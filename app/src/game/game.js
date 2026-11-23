// Pulpward core simulation. No DOM access here so it can be tested in node.
// Logical viewport is 640x360 with a 16px tile. The player collider is 12x22.

export const W = 640;
export const H = 360;
export const T = 16;

// One continuous stepped slope. Shrine sits on the lowest (left) step.
const STEPS = [
  { x0: -100, x1: 176, y: 300 },
  { x0: 176, x1: 336, y: 276 },
  { x0: 336, x1: 496, y: 252 },
  { x0: 496, x1: W + 400, y: 228 },
];
// Empty one-way perches the player can jump onto. Fruits never use them.
export const PERCHES = [
  { x: 196, w: 56, y: 226 },
  { x: 372, w: 56, y: 196 },
];
export const SHRINE = { x: 24, w: 56, edge: 84 };

export const groundAt = (x) => {
  for (const s of STEPS) if (x >= s.x0 && x < s.x1) return s.y;
  return STEPS[STEPS.length - 1].y;
};
export const STEP_LIST = STEPS;

export const FRUIT = {
  berry: { r: 5, hp: 1, spd: 70, pts: 10, dmg: 2, col: '#c2273d' },
  apple: { r: 7, hp: 1, spd: 55, pts: 15, dmg: 3, col: '#d63a2f' },
  orange: { r: 8, hp: 1, spd: 50, pts: 15, dmg: 3, col: '#f08a1c' },
  pear: { r: 8, hp: 2, spd: 45, pts: 25, dmg: 4, col: '#b9c43a' },
  pineapple: { r: 9, hp: 2, spd: 40, pts: 30, dmg: 5, col: '#e6b422' },
  watermelon: { r: 16, hp: 5, spd: 28, pts: 80, dmg: 12, col: '#2f8f4e', heavy: true },
  pumpkin: { r: 14, hp: 4, spd: 30, pts: 70, dmg: 10, col: '#e8731a', heavy: true },
};

const G = 900;
const JUMP_V = Math.sqrt(2 * G * 68); // apex ~68px (4.25 tiles)
const RUN = 120;
const DASH_DIST = 80;
const DASH_T = 0.16;

const rand = (a, b) => a + Math.random() * (b - a);

export class Game {
  constructor(save = {}) {
    this.best = save.best || 0;
    this.events = []; // sfx / ui events consumed by the host
    this.reset();
  }

  reset() {
    this.t = 0;
    this.over = false;
    this.score = 0;
    this.chain = 0;
    this.chainT = 0;
    this.shrineHp = 100;
    this.shrineFlash = 0;
    this.wave = 1;
    this.phase = 'banner';
    this.phaseT = 1.6;
    this.toSpawn = 0;
    this.spawnT = 0;
    this.fruits = [];
    this.parts = [];
    this.texts = [];
    this.ghosts = [];
    this.rings = [];
    this.trauma = 0;
    this.freeze = 0;
    this.p = {
      x: 120, y: groundAt(120), vx: 0, vy: 0, face: 1, hp: 5, inv: 0,
      grounded: true, state: 'free', st: 0, cd: 0, dashCd: 0, target: null, hit: false, run: 0,
    };
    this.startWave();
  }

  emit(e) { this.events.push(e); }

  startWave() {
    this.toSpawn = 6 + this.wave * 3;
    this.spawnT = 0.5;
    this.phase = 'banner';
    this.phaseT = 1.6;
    this.emit({ type: 'wave', wave: this.wave });
  }

  pickType() {
    const w = this.wave;
    const pool = [['berry', 4], ['apple', 4], ['orange', 3]];
    if (w >= 3) pool.push(['pear', 2]);
    if (w >= 4) pool.push(['watermelon', 1 + Math.min(3, (w - 4) * 0.4)]);
    if (w >= 5) pool.push(['pineapple', 2]);
    if (w >= 7) pool.push(['pumpkin', 1.5]);
    const sum = pool.reduce((a, [, k]) => a + k, 0);
    let r = Math.random() * sum;
    for (const [n, k] of pool) { if ((r -= k) <= 0) return n; }
    return 'apple';
  }

  spawn(type) {
    const d = FRUIT[type];
    const mult = 1 + this.wave * 0.05;
    const x = W + d.r + 4 + rand(0, 20);
    this.fruits.push({
      type, d, x, y: groundAt(x) - d.r, vy: 0, hp: d.hp, spd: d.spd * mult, rot: 0, flash: 0, kb: 0,
    });
  }

  shake(a) { this.trauma = Math.min(1, this.trauma + a); }
  pop(x, y, text, col = '#fff6d8', size = 14) {
    this.texts.push({ x, y, text, col, size, t: 0, life: 0.9 });
  }
  chunks(x, y, col, n, power = 1) {
    for (let i = 0; i < n; i++) {
      const a = rand(-Math.PI, 0);
      const s = rand(60, 200) * power;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, col, life: rand(0.4, 0.8), t: 0, sz: rand(2, 4) });
    }
  }

  update(rawDt, inp) {
    const dt = Math.min(rawDt, 1 / 30);
    this.tickFx(dt);
    if (this.over) return;
    if (this.freeze > 0) { this.freeze -= dt; return; }
    this.t += dt;

    if (this.phase === 'banner') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) this.phase = 'play';
    } else {
      this.spawnT -= dt;
      if (this.toSpawn > 0 && this.spawnT <= 0) {
        this.spawn(this.pickType());
        this.toSpawn--;
        this.spawnT = Math.max(0.35, 1.4 - this.wave * 0.07) * rand(0.6, 1.4);
      }
      if (this.toSpawn === 0 && this.fruits.length === 0) {
        this.wave++;
        this.startWave();
      }
    }

    this.updatePlayer(dt, inp);
    this.updateFruits(dt);

    if (this.chainT > 0) { this.chainT -= dt; if (this.chainT <= 0) this.chain = 0; }
    if (this.shrineHp <= 0 || this.p.hp <= 0) this.end();
  }

  tickFx(dt) {
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    this.shrineFlash = Math.max(0, this.shrineFlash - dt);
    for (const q of this.parts) { q.t += dt; q.vy += 600 * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
    this.parts = this.parts.filter((q) => q.t < q.life);
    for (const q of this.texts) { q.t += dt; q.y -= 18 * dt; }
    this.texts = this.texts.filter((q) => q.t < q.life);
    for (const q of this.ghosts) q.t += dt;
    this.ghosts = this.ghosts.filter((q) => q.t < 0.22);
    for (const q of this.rings) q.t += dt;
    this.rings = this.rings.filter((q) => q.t < 0.3);
  }

  end() {
    this.over = true;
    if (this.score > this.best) this.best = this.score;
    this.emit({ type: 'over', score: this.score, wave: this.wave, best: this.best });
  }

  nearestFruit() {
    const p = this.p;
    let best = null;
    let bd = 220;
    for (const f of this.fruits) {
      const d = Math.abs(f.x - p.x);
      if (d < bd && Math.abs(f.y - (p.y - 10)) < 90) { bd = d; best = f; }
    }
    return best;
  }

  updatePlayer(dt, inp) {
    const p = this.p;
    p.cd = Math.max(0, p.cd - dt);
    p.dashCd = Math.max(0, p.dashCd - dt);
    p.inv = Math.max(0, p.inv - dt);
    const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);

    if (p.state === 'free') {
      const target = dir * RUN;
      const a = dir === 0 ? 1400 : 1000;
      if (p.vx < target) p.vx = Math.min(target, p.vx + a * dt);
      else if (p.vx > target) p.vx = Math.max(target, p.vx - a * dt);
      if (dir) p.face = dir;
      if (inp.jumpPressed && p.grounded) { p.vy = -JUMP_V; p.grounded = false; this.emit({ type: 'jump' }); }
      if (!inp.jumpHeld && p.vy < -120) p.vy *= 0.5;
      if (inp.dashPressed && p.dashCd <= 0) this.startDash(dir || p.face);
      else if (inp.attackPressed && p.cd <= 0) this.startAttack();
    }

    if (p.state === 'dash') {
      p.st += dt;
      p.vx = p.face * (DASH_DIST / DASH_T);
      p.vy = 0;
      p.inv = Math.max(p.inv, 0.05);
      if (Math.floor(p.st * 60) % 2 === 0) this.ghosts.push({ x: p.x, y: p.y, face: p.face, t: 0 });
      this.hitFruits(p.x, p.y - 10, 14, 1, 'dash');
      if (p.st >= DASH_T) { p.state = 'free'; p.vx *= 0.3; p.dashCd = 0.35; }
    } else if (p.state === 'slash') {
      p.st += dt;
      p.vx *= 0.85;
      if (!p.hit && p.st > 0.06) {
        p.hit = true;
        this.hitFruits(p.x + p.face * 18, p.y - 11, 20, 1, 'slash');
      }
      if (p.st > 0.2) { p.state = 'free'; p.cd = 0.08; }
    } else if (p.state === 'skip') {
      p.st += dt;
      const tg = p.target;
      if (!tg || tg.dead) { p.state = 'free'; p.cd = 0.1; }
      else {
        const dx = tg.x - p.x;
        p.face = dx >= 0 ? 1 : -1;
        p.vx = p.face * 560;
        p.vy = 0;
        if (Math.floor(p.st * 60) % 2 === 0) this.ghosts.push({ x: p.x, y: p.y, face: p.face, t: 0 });
        if (Math.abs(dx) < tg.d.r + 12 || p.st > 0.3) {
          this.hitFruits(p.x + p.face * 12, p.y - 11, tg.d.r + 14, 2, 'skip');
          p.state = 'free'; p.cd = 0.1; p.vx = p.face * 80; p.inv = Math.max(p.inv, 0.15);
        }
      }
    } else if (p.state === 'roll') {
      p.st += dt;
      const tg = p.target;
      p.inv = Math.max(p.inv, 0.05);
      if (p.vy < 0 || p.st < 0.18) {
        p.vy += G * dt;
        p.vx = p.face * 120;
      } else if (!tg || tg.dead) {
        p.state = 'free'; p.cd = 0.1;
      } else {
        const dx = tg.x - p.x;
        const dy = (tg.y - tg.d.r) - (p.y - 11);
        const len = Math.hypot(dx, dy) || 1;
        p.vx = (dx / len) * 520; p.vy = (dy / len) * 520;
        if (Math.floor(p.st * 60) % 2 === 0) this.ghosts.push({ x: p.x, y: p.y, face: p.face, t: 0 });
        if (len < tg.d.r + 12) {
          this.hitFruits(tg.x, tg.y, tg.d.r + 18, 4, 'roll');
          p.state = 'free'; p.vy = -220; p.vx = -p.face * 60; p.cd = 0.1; p.grounded = false;
        }
      }
      if (p.st > 0.9) { p.state = 'free'; }
    }

    // Integrate
    if (p.state !== 'dash' && p.state !== 'skip' && p.state !== 'roll') {
      p.vy += (p.vy > 0 ? G * 1.6 : G) * dt;
    }
    const nx = p.x + p.vx * dt;
    const half = 6;
    const lead = nx + (p.vx >= 0 ? half : -half);
    if (p.y > groundAt(lead) + 1) {
      p.vx = 0; // wall of a higher step
    } else {
      p.x = Math.max(half, Math.min(W - half, nx));
    }
    const prevY = p.y;
    p.y += p.vy * dt;
    p.grounded = false;
    const g = groundAt(p.x);
    if (p.y >= g) { p.y = g; p.vy = 0; p.grounded = true; }
    else if (p.vy > 0) {
      for (const pr of PERCHES) {
        if (p.x > pr.x && p.x < pr.x + pr.w && prevY <= pr.y + 1 && p.y >= pr.y) {
          p.y = pr.y; p.vy = 0; p.grounded = true;
        }
      }
    }
    if (p.grounded && p.state === 'roll') p.state = 'free';

    // contact with fruits
    if (p.inv <= 0) {
      for (const f of this.fruits) {
        if (Math.abs(f.x - p.x) < f.d.r + 5 && Math.abs((f.y) - (p.y - 11)) < f.d.r + 10) {
          p.hp--; p.inv = 1.1; p.vx = -p.face * 160; p.vy = -160; p.grounded = false;
          this.shake(0.4); this.freeze = 0.06; this.emit({ type: 'hurt' });
          this.pop(p.x, p.y - 28, '-1', '#ff7a7a');
          break;
        }
      }
    }
  }

  startDash(dir) {
    const p = this.p;
    p.state = 'dash'; p.st = 0; p.face = dir;
    this.rings.push({ x: p.x, y: p.y - 11, t: 0 });
    this.emit({ type: 'dash' });
  }

  startAttack() {
    const p = this.p;
    const tg = this.nearestFruit();
    p.hit = false; p.st = 0; p.target = tg;
    if (tg) p.face = tg.x >= p.x ? 1 : -1;
    const dist = tg ? Math.abs(tg.x - p.x) : 0;
    if (tg && tg.d.heavy) {
      p.state = 'roll'; p.vy = -300; p.grounded = false;
      this.rings.push({ x: p.x, y: p.y - 11, t: 0 });
      this.emit({ type: 'roll' });
    } else if (tg && dist > 34) {
      p.state = 'skip';
      this.rings.push({ x: p.x, y: p.y - 11, t: 0 });
      this.emit({ type: 'skip' });
    } else {
      p.state = 'slash';
      this.emit({ type: 'slash' });
    }
  }

  hitFruits(cx, cy, rad, dmg, kind) {
    let any = false;
    for (const f of this.fruits) {
      if (f.dead) continue;
      if (Math.hypot(f.x - cx, (f.y) - cy) < rad + f.d.r) {
        if (kind === 'dash' && f.dashHit) continue;
        if (kind === 'dash') f.dashHit = true;
        any = true;
        f.hp -= dmg; f.flash = 0.1; f.kb = 120;
        if (f.hp <= 0) this.kill(f, kind);
        else { this.shake(0.15); this.chunks(f.x, f.y, f.d.col, 3); this.emit({ type: 'hit' }); }
      }
    }
    if (any) {
      this.freeze = kind === 'roll' ? 0.1 : 0.04;
      if (kind === 'roll') this.shake(0.55);
    }
    this.fruits = this.fruits.filter((f) => !f.dead);
  }

  kill(f, kind) {
    f.dead = true;
    this.chain++;
    this.chainT = 1.4;
    const mult = Math.min(this.chain, 9);
    this.score += f.d.pts * mult;
    this.chunks(f.x, f.y, f.d.col, f.d.heavy ? 18 : 8, f.d.heavy ? 1.4 : 1);
    this.shake(f.d.heavy ? 0.5 : 0.22);
    this.emit({ type: 'kill', heavy: !!f.d.heavy });
    if (kind === 'roll') this.pop(f.x, f.y - f.d.r - 8, 'SMASH!', '#ffd24a', 18);
    else if (f.d.heavy) this.pop(f.x, f.y - f.d.r - 8, 'BOOM', '#ffb347', 18);
    if (mult >= 2) this.pop(f.x + 16, f.y - f.d.r - 24, `X${mult}`, '#fff1b0', 14);
  }

  updateFruits(dt) {
    for (const f of this.fruits) {
      f.flash = Math.max(0, f.flash - dt);
      const kb = f.kb; f.kb = Math.max(0, f.kb - 600 * dt);
      f.x += (kb - f.spd) * dt;
      f.rot -= (f.spd / f.d.r) * dt;
      f.vy += G * dt;
      f.y += f.vy * dt;
      const g = groundAt(f.x) - f.d.r;
      if (f.y >= g) { f.y = g; f.vy = 0; }
      if (f.x - f.d.r <= SHRINE.edge) {
        f.dead = true;
        this.shrineHp = Math.max(0, this.shrineHp - f.d.dmg);
        this.shrineFlash = 0.25;
        this.shake(0.3);
        this.chain = 0;
        this.chunks(f.x, f.y, f.d.col, 6);
        this.pop(SHRINE.x + 30, groundAt(40) - 70, `-${f.d.dmg}`, '#ff8aa0');
        this.emit({ type: 'shrine' });
      }
    }
    this.fruits = this.fruits.filter((f) => !f.dead);
  }
}
