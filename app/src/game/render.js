// Placeholder renderer: flat shapes until the sprite pass lands. No glow, no grain.
import { W, H, STEP_LIST, PERCHES, SHRINE, groundAt } from './game.js';

const STONE = '#e9dcc0';
const STONE_D = '#cdbb98';
const GRASS = '#8fb04a';

function sky(c) {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#c7aedd');
  g.addColorStop(0.55, '#f0b9c8');
  g.addColorStop(1, '#f8d9b5');
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}

function island(c, x, y, w, h) {
  c.fillStyle = '#b79cc9';
  c.beginPath();
  c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w * 0.65, y + h); c.lineTo(x + w * 0.35, y + h * 0.7);
  c.closePath(); c.fill();
  c.fillStyle = '#9fb872';
  c.fillRect(x, y - 3, w, 4);
}

function cloud(c, x, y, s) {
  c.fillStyle = 'rgba(255,240,235,0.85)';
  c.beginPath();
  c.ellipse(x, y, 30 * s, 10 * s, 0, 0, 7);
  c.ellipse(x + 18 * s, y - 6 * s, 20 * s, 10 * s, 0, 0, 7);
  c.fill();
}

function terrain(c) {
  for (const s of STEP_LIST) {
    const x0 = Math.max(0, s.x0);
    const w = Math.min(W + 40, s.x1) - x0;
    c.fillStyle = STONE;
    c.fillRect(x0, s.y, w, H - s.y);
    c.fillStyle = STONE_D;
    for (let y = s.y + 16; y < H; y += 16) c.fillRect(x0, y, w, 1);
    c.fillStyle = GRASS;
    c.fillRect(x0, s.y, w, 4);
  }
  for (const p of PERCHES) {
    c.fillStyle = STONE_D; c.fillRect(p.x, p.y, p.w, 6);
    c.fillStyle = GRASS; c.fillRect(p.x, p.y, p.w, 3);
    c.fillStyle = STONE; c.fillRect(p.x + p.w / 2 - 3, p.y + 6, 6, 60);
  }
}

function shrine(c, g) {
  const gy = groundAt(SHRINE.x);
  c.fillStyle = STONE_D; c.fillRect(SHRINE.x - 6, gy - 10, SHRINE.w + 12, 10);
  c.fillStyle = STONE; c.fillRect(SHRINE.x + 4, gy - 22, SHRINE.w - 8, 12);
  const cx = SHRINE.x + SHRINE.w / 2;
  c.fillStyle = g.shrineFlash > 0 ? '#ffd0dc' : '#f27fa6';
  c.beginPath();
  c.moveTo(cx, gy - 66); c.lineTo(cx + 14, gy - 42); c.lineTo(cx + 8, gy - 22); c.lineTo(cx - 8, gy - 22); c.lineTo(cx - 14, gy - 42);
  c.closePath(); c.fill();
  c.fillStyle = '#ffc4d6';
  c.beginPath(); c.moveTo(cx, gy - 66); c.lineTo(cx + 14, gy - 42); c.lineTo(cx, gy - 40); c.closePath(); c.fill();
}

function fruit(c, f) {
  const { r, col } = f.d;
  c.save();
  c.translate(f.x, f.y);
  c.rotate(f.rot);
  c.fillStyle = f.flash > 0 ? '#ffffff' : col;
  c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
  if (f.type === 'watermelon') {
    c.strokeStyle = '#1f6a38'; c.lineWidth = 2;
    for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 5, -r + 2); c.lineTo(i * 5, r - 2); c.stroke(); }
  } else if (f.type === 'pumpkin') {
    c.strokeStyle = '#b8560f'; c.lineWidth = 1.5;
    for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(0, 0, Math.abs(i) * 5 + 3, r - 1, 0, 0, 7); c.stroke(); }
  } else if (f.type === 'pineapple') {
    c.fillStyle = '#4f8f3a'; c.fillRect(-3, -r - 5, 6, 6);
  } else {
    c.fillStyle = '#3f7d34'; c.fillRect(-1, -r - 2, 2, 4);
  }
  c.restore();
}

function hero(c, p, a = 1, t = 0) {
  c.save();
  c.globalAlpha = a;
  c.translate(p.x, p.y);
  if (p.face < 0) c.scale(-1, 1);
  const rolling = p.state === 'roll';
  if (rolling) { c.translate(0, -11); c.rotate(t * 18); c.translate(0, 11); }
  const bob = p.state === 'free' && p.grounded && Math.abs(p.vx) > 10 ? Math.sin(t * 22) * 1 : 0;
  c.fillStyle = '#2b7a78'; c.fillRect(-5, -16 + bob, 10, 11);        // armor
  c.fillStyle = '#2a2a33'; c.fillRect(-4, -6, 3.5, 6); c.fillRect(0.5, -6, 3.5, 6); // legs
  c.fillStyle = '#f2c9a0'; c.fillRect(-4, -22 + bob, 8, 7);          // face
  c.fillStyle = '#3f9a4a'; c.fillRect(-5, -25 + bob, 10, 4); c.fillRect(-2, -27 + bob, 4, 3); // hair
  c.fillStyle = '#e8b64a'; c.fillRect(-4, -22 + bob, 8, 1.5);        // circlet
  c.fillStyle = '#e8745e'; c.fillRect(-7, -17 + bob, 5, 3);          // scarf
  if (p.state === 'slash' || p.state === 'skip' || p.state === 'roll') {
    c.fillStyle = '#a9d9a0'; c.fillRect(4, -14, 14, 2.5);
  } else {
    c.fillStyle = '#a9d9a0'; c.fillRect(5, -12, 2.5, 9);
  }
  c.restore();
}

export function draw(c, g, time) {
  const sh = g.trauma * g.trauma * 7;
  c.save();
  sky(c);
  const par = Math.sin(time * 0.1) * 6;
  island(c, 120 + par, 70, 110, 60);
  island(c, 380 - par, 40, 80, 46);
  cloud(c, 80, 60, 1); cloud(c, 470, 90, 1.2); cloud(c, 300, 130, 0.8);

  c.translate((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
  terrain(c);
  shrine(c, g);

  for (const q of g.rings) {
    const k = q.t / 0.3;
    c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2;
    c.beginPath(); c.ellipse(q.x, q.y, 4 + k * 20, 10 + k * 8, 0, 0, 7); c.stroke();
  }
  for (const q of g.ghosts) hero(c, { ...g.p, x: q.x, y: q.y, face: q.face, state: 'skip' }, 0.35 * (1 - q.t / 0.22), time);
  for (const f of g.fruits) fruit(c, f);
  if (g.p.inv <= 0 || Math.floor(time * 20) % 2 === 0) hero(c, g.p, 1, time);
  for (const q of g.parts) {
    c.globalAlpha = 1 - q.t / q.life; c.fillStyle = q.col; c.fillRect(q.x, q.y, q.sz, q.sz);
  }
  c.globalAlpha = 1;
  c.textAlign = 'center';
  for (const q of g.texts) {
    c.globalAlpha = Math.min(1, (q.life - q.t) * 3);
    c.font = `900 ${q.size}px system-ui, sans-serif`;
    c.lineWidth = 3; c.strokeStyle = '#4a2a2a'; c.strokeText(q.text, q.x, q.y);
    c.fillStyle = q.col; c.fillText(q.text, q.x, q.y);
  }
  c.globalAlpha = 1;
  c.restore();
  hud(c, g);
}

function pill(c, x, y, w, h) {
  c.fillStyle = '#fbf0dc'; c.strokeStyle = '#4a2a2a'; c.lineWidth = 1.5;
  c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill(); c.stroke();
}

function hud(c, g) {
  pill(c, 8, 8, 170, 18);
  c.fillStyle = '#e46a86'; c.fillRect(12, 12, 162 * (g.shrineHp / 100), 10);
  c.fillStyle = '#4a2a2a'; c.font = '700 10px system-ui, sans-serif'; c.textAlign = 'left';
  c.fillText('Shrine', 14, 21);
  for (let i = 0; i < 5; i++) { c.fillStyle = i < g.p.hp ? '#e46a86' : '#d8c8b8'; c.fillRect(10 + i * 12, 32, 9, 9); }
  pill(c, W / 2 - 50, 8, 100, 20);
  c.fillStyle = '#4a2a2a'; c.font = '800 13px system-ui, sans-serif'; c.textAlign = 'center';
  c.fillText(`Wave ${g.wave}`, W / 2, 23);
  pill(c, W - 150, 8, 100, 20);
  c.fillStyle = '#4a2a2a'; c.textAlign = 'right'; c.fillText(g.score.toLocaleString(), W - 56, 23);
  if (g.phase === 'banner' && !g.over) {
    c.textAlign = 'center'; c.font = '900 28px system-ui, sans-serif';
    c.lineWidth = 4; c.strokeStyle = '#4a2a2a'; c.strokeText(`Wave ${g.wave}`, W / 2, 110);
    c.fillStyle = '#fff1d0'; c.fillText(`Wave ${g.wave}`, W / 2, 110);
  }
  if (g.over) {
    c.fillStyle = 'rgba(40,24,40,0.55)'; c.fillRect(0, 0, W, H);
    c.textAlign = 'center'; c.fillStyle = '#fff1d0';
    c.font = '900 32px system-ui, sans-serif'; c.fillText('The shrine has fallen', W / 2, 140);
    c.font = '700 16px system-ui, sans-serif';
    c.fillText(`Wave ${g.wave}   Score ${g.score.toLocaleString()}   Best ${g.best.toLocaleString()}`, W / 2, 175);
    c.fillText('Press Enter or tap to play again', W / 2, 210);
  }
}
