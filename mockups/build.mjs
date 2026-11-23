import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as A from './art.mjs';
const { FONT, T, R_: R, C_: C, world, hero, arc, apple, kiwi, coconut, wisp, grape, titan, splash, impact, speedLines, dmg, hud, fruitSlots, touchControls, phone, browser, svg, platform, defs, rng } = A;

const OUT = path.resolve('.', 'out'); fs.mkdirSync(OUT, { recursive: true });
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const branch = (x, y, w) => R(x, y, w, 10, '#8a5a30', 'stroke="#2a1608" stroke-width="3"') + R(x, y, w, 3, '#c28a50') + `<path d="M${x + 8} ${y + 10} l-6 18 M${x + w - 8} ${y + 10} l6 18" stroke="#2f9a4a" stroke-width="4"/>`;
const branches = () => branch(300, 300, 120) + branch(880, 318, 140) + branch(1120, 250, 110) + branch(450, 230, 90);

// ---------------- reusable gameplay scenes (1280x720 space) ----------------
function sceneAction() {
  let s = world() + branches();
  s += grape(360, 400, .9) + coconut(955, 450, .85) + apple(1130, 526, 1) + apple(1210, 526, 1);
  s += wisp(330, 250, 1) + wisp(1040, 190, 1) + kiwi(880, 290, 1, -1);
  s += apple(720, 570, 1.1, true) + impact(690, 560, 1, '#fff') + splash(700, 560, 36, ['#ff3d5a', '#ffd0d8', '#ff8a9a'], 80, 3);
  s += arc(560, 548, 120, -70, 40, 44) + hero(540, 600, { blade: -12, legs: 'run', tilt: 6, scarf: 6 });
  s += dmg(700, 500, '+240', '#ffe36a', 1.2) + T(604, 468, 'CLEAN CUT!', 30, '#9ff3ff', '#0a2a40', 'middle', 7);
  s += splash(560, 300, 14, ['#ffe9a8', '#fff'], 120, 7, 3);
  return s;
}
const wrapGame = (scene, vpbox, hudOn = true, extra = '') => scene + extra;
const VIG = R(0, 0, 1280, 720, 'url(#vig)');

// ---------------- page shell ----------------
const page = (name, W, H, body, css = '') => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}body{width:${W}px;height:${H}px;overflow:hidden;font-family:'Segoe UI',Arial,sans-serif;color:#e8eef7;background:radial-gradient(circle at 30% 20%,#18303a,#0a1016 70%)}
.t{font:900 34px ${FONT};letter-spacing:1px;color:#ffd36a}.s{font-size:16px;color:#9fb3c8;margin-top:4px}
.chip{display:inline-block;padding:5px 12px;border-radius:999px;background:#ffffff14;border:1px solid #ffffff30;font-size:13px;margin:3px 4px 0 0;color:#dbe6f2}
.abs{position:absolute}${css}</style></head><body>${body}</body></html>`;
  fs.writeFileSync(path.join(OUT, name + '.html'), html);
  return { name, W, H };
};
const head = (t, s, x = 50, y = 28) => `<div class="abs" style="left:${x}px;top:${y}px"><div class="t">${t}</div><div class="s">${s}</div></div>`;
const pages = [];

// 01 desktop gameplay -----------------------------------------------------------
{
  const g = svg('0 0 1280 720', 1600, 900, sceneAction() + VIG + hud({ x: 0, y: 0, w: 1280, h: 720 }, { chain: 12 }) + fruitSlots(640, 650, { ready: true }) +
    R(0, 0, 1280, 720, 'none'));
  const hint = `<div style="position:absolute;left:0;right:0;bottom:0;height:34px;background:#0009;display:flex;gap:28px;justify-content:center;align-items:center;font:600 13px Segoe UI;color:#cfe">` +
    ['A / D · Move', 'W / Space · Jump (x2)', 'Mouse · Aim + Slash', 'Shift · Dash', 'S · Drop / Plunge', 'Q E R · Fruit powers'].map(x => `<span>${x}</span>`).join('') + '</div>';
  pages.push(page('01-desktop-gameplay', 1700, 1070, head('01 · Desktop gameplay', 'Mid-run: horizontal Clean Cut on a Rot Apple, 12-chain, tiered orchard with waterfall, heartseed shelf and canopy branches.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(`<div style="position:relative">${g}${hint}</div>`, 1600, 900)}</div>`));
}

// 02 impact / screen shake ------------------------------------------------------
{
  const base = world() + branches();
  const burst = `<g transform="translate(640 360) rotate(-1.1) scale(1.045) translate(-640 -360)">
    <use href="#WL"/></g>`;
  const body = `<g id="WL">${base}${grape(360, 400, .9)}${coconut(940, 380, .85)}${apple(1130, 480, 1)}</g>
  <g>${burst}</g>
  <g transform="translate(640 360) rotate(-1.1) scale(1.045) translate(-640 -360)" style="mix-blend-mode:screen"><use href="#WL" transform="translate(-14 4)" filter="url(#redch)" opacity=".8"/><use href="#WL" transform="translate(14 -4)" filter="url(#cyanch)" opacity=".8"/></g>
  <ellipse cx="660" cy="330" rx="520" ry="330" fill="url(#pinkglow)" opacity=".55"/>
  <rect x="580" y="0" width="160" height="610" fill="url(#beam)" opacity=".85"/><rect x="636" y="0" width="48" height="610" fill="#fff" opacity=".9"/>
  <ellipse cx="660" cy="600" rx="200" ry="26" fill="#ffd1e0" opacity=".9"/><ellipse cx="660" cy="600" rx="320" ry="40" fill="none" stroke="#ff5c8a" stroke-width="6" opacity=".8"/>
  ${speedLines(660, 330, 90, 130, 800, 21)}
  ${splash(660, 330, 120, ['#ff3d7f', '#ffd1e0', '#ffe36a', '#fff'], 360, 11, 10)}
  ${apple(420, 250, 1).replace('<g', '<g opacity=".95"')}${kiwi(900, 170, 1, -1)}${coconut(280, 140, .7, true)}
  ${impact(420, 250, 1.3)}${impact(900, 170, 1.2)}${impact(280, 140, 1)}
  ${hero(520, 600, { blade: -150, legs: 'air', tilt: -4, scarf: 10 })}
  ${arc(560, 560, 150, -190, 10, 40, 'url(#slash)')}
  <g transform="rotate(-5 660 170)">${T(660, 190, 'BLOOM BURST!', 98, '#fff', '#ff2d6f', 'middle', 18)}</g>
  ${T(660, 250, '+ 5,200  ·  CHAIN ×18', 28, '#ffe36a', '#4a0a20', 'middle', 7)}
  ${VIG}${R(0, 0, 1280, 720, '#fff', 'opacity=".07"')}
  ${hud({ x: 0, y: 0, w: 1280, h: 720 }, { chain: 18, mult: '3.0', spark: 1, hp: 4, tide: .74, score: '112,940' })}`;
  const g = svg('0 0 1280 720', 1600, 900, body);
  const notes = ['Screen shake: 12 px decaying · 0.38 s', 'RGB split: ±14 px for 4 frames', 'Hit-stop: 60 ms freeze on impact', 'HUD stays stable while the world shakes'];
  pages.push(page('02-desktop-bloom-burst-screenshake', 1700, 1130, head('02 · Bloom Burst · screen shake, RGB split, hit-stop', 'The 100% Spark payoff. World shakes and chromatically splits; the HUD does not, so numbers stay readable.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(g, 1600, 900)}</div><div class="abs" style="left:50px;top:1062px">${notes.map(n => `<span class="chip">${n}</span>`).join('')}</div>`));
}

// 03 mobile landscape controls ---------------------------------------------------
{
  const vp = { x: 0, y: 64, w: 1280, h: 592 };
  const mark = (px, py, n) => `<circle cx="${px}" cy="${py}" r="20" fill="#ff3d7f" stroke="#fff" stroke-width="3"/>` + T(px, py + 8, n, 22, '#fff', '#000', 'middle', 0);
  const inner = svg(`0 64 1280 592`, 1240, 573, sceneAction() + VIG + hud(vp, { chain: 9, mult: '2.0' }) + touchControls(vp) +
    mark(60, 440, 1) + mark(1100, 520, 2) + mark(960, 560, 3) + mark(1160, 440, 4) + mark(1040, 440, 5) + mark(880, 118, 6));
  const legend = [['1', 'Left thumb · virtual stick: drag left/right to run. Flick up = jump, flick down = drop through / plunge.'],
  ['2', 'SLASH · tap = slash in facing direction. Drag from it = aim any angle (arc preview shows).'],
  ['3', 'JUMP · tap, tap again in air for the double jump. Hold = higher jump.'],
  ['4', 'DASH · invulnerable burst. Dash + Slash = Dash Slash.'],
  ['5', 'FRUIT · power-ups gathered on the run, one tap each.'],
  ['6', 'HUD stays inside the safe area (notch and rounded corners).']];
  pages.push(page('03-mobile-landscape-controls', 1500, 1000, head('03 · Mobile · landscape layout and touch controls', '19.5:9 phone in landscape. Thumbs sit on the left and right edges; the centre stays clear for the action.', 50, 20) +
    `<div class="abs" style="left:80px;top:100px">${phone(inner, 1240, 573)}</div>` +
    `<div class="abs" style="left:80px;top:760px;width:1340px;display:grid;grid-template-columns:1fr 1fr;gap:6px 30px;font-size:15px;color:#dbe6f2">${legend.map(l => `<div><b style="color:#ff3d7f">${l[0]}</b> &nbsp;${l[1]}</div>`).join('')}</div>`));
}

// 04 rotate prompt --------------------------------------------------------------
{
  const rotIcon = `<g transform="translate(195 330)"><rect x="-34" y="-58" width="68" height="116" rx="12" fill="none" stroke="#ffd36a" stroke-width="7" transform="rotate(-14)"/><path d="M60 -70 q60 30 46 96" stroke="#ffd36a" stroke-width="7" fill="none" stroke-dasharray="3 14" stroke-linecap="round"/><path d="M96 14 l10 20 l18 -16z" fill="#ffd36a"/></g>`;
  const portrait = svg('0 0 390 844', 390, 844, R(0, 0, 390, 844, '#0a1016') + `<g opacity=".35"><g transform="translate(-440 -80) scale(1.1)">${world()}</g></g>` + R(0, 0, 390, 844, '#000', 'opacity=".72"') + rotIcon +
    T(195, 500, 'ROTATE YOUR PHONE', 30, '#fff', '#ff3d7f', 'middle', 7) + `<text x="195" y="540" fill="#cfe0f0" font-family="Segoe UI,Arial" font-size="16" text-anchor="middle">Pulpward is played in landscape.</text><text x="195" y="564" fill="#9fb3c8" font-family="Segoe UI,Arial" font-size="14" text-anchor="middle">Turn your device sideways to start the run.</text>` +
    `<rect x="85" y="610" width="220" height="50" rx="25" fill="#ff3d7f" stroke="#fff" stroke-width="3"/>` + T(195, 643, 'I ROTATED · PLAY', 17, '#fff', '#5a0a2a', 'middle', 4) + `<text x="195" y="700" fill="#8aa0b5" font-family="Segoe UI,Arial" font-size="12" text-anchor="middle">Rotation lock on? Turn it off in Control Centre / quick settings.</text>`);
  const vp = { x: 0, y: 64, w: 1280, h: 592 };
  const land = svg('0 64 1280 592', 844, 390, sceneAction() + VIG + hud(vp, { chain: 0 }) + touchControls(vp));
  pages.push(page('04-mobile-rotate-gate', 1620, 1040, head('04 · Mobile · landscape gate', 'Portrait shows a rotate prompt and the game stays paused. The Screen Orientation API is requested after fullscreen on Android; iOS relies on this gate.', 50, 20) +
    `<div class="abs" style="left:50px;top:110px">${phone(portrait, 390, 844)}</div>` +
    `<div class="abs" style="left:520px;top:430px;font:900 70px ${FONT};color:#ffd36a">➜</div>` +
    `<div class="abs" style="left:640px;top:290px">${phone(land, 844, 390)}</div>` +
    `<div class="abs" style="left:640px;top:790px;width:880px;font-size:15px;color:#cfe">When landscape is detected the countdown 3·2·1 starts; the run never begins in portrait.</div>`));
}

// 05 combat moves sheet ----------------------------------------------------------
{
  const card = (title, trig, input, body) => `<div style="width:566px;background:#0f1822;border:2px solid #ffd36a44;border-radius:14px;overflow:hidden">${svg('0 0 560 340', 560, 340, `<rect width="560" height="340" fill="url(#sky)"/><ellipse cx="280" cy="200" rx="260" ry="130" fill="url(#glow)" opacity=".35"/>` + platform(0, 272, 560, 70, 3) + body)}<div style="padding:10px 14px"><div style="font:900 19px ${FONT};color:#ffd36a">${title}</div><div style="font-size:13px;color:#b9c9da;margin-top:3px">${trig}</div><div style="margin-top:4px">${input.map(i => `<span class="chip">${i}</span>`).join('')}</div></div></div>`;
  const ghost = (x, y, o, p) => `<g opacity="${o}">${hero(x, y, p)}</g>`;
  const cards = [
    card('1 · Ground Slash', 'Enemy ahead at your height. Three-hit string, each swing a different angle.', ['PC: Click', 'Touch: Tap SLASH'], hero(200, 272, { blade: -10, legs: 'run' }) + arc(250, 220, 110, -60, 30, 34) + apple(370, 244) + impact(330, 230, .6)),
    card('2 · Rising Uppercut', 'Enemy above you. Aim up to launch and juggle.', ['PC: Click above', 'Touch: Slash + drag up'], hero(190, 255, { blade: -80, legs: 'air', tilt: -8 }) + arc(215, 190, 115, -5, -115, 34) + kiwi(176, 72) + impact(176, 80, .7) + `<path d="M190 270 v-30" stroke="#ffffff55" stroke-width="3"/>`),
    card('3 · Plunge Slam', 'Airborne with enemies below. Shockwave radius grows with fall height.', ['PC: S in air', 'Touch: Flick down'], hero(280, 150, { blade: 95, legs: 'air' }) + `<ellipse cx="280" cy="272" rx="160" ry="20" fill="none" stroke="#9ff3ff" stroke-width="6"/><ellipse cx="280" cy="272" rx="100" ry="12" fill="#9ff3ff" opacity=".4"/>` + apple(130, 244) + apple(430, 244) + speedLines(280, 200, 20, 20, 80, 2) + arc(280, 190, 100, 60, 120, 26)),
    card('4 · Aerial Spin', 'Surrounded while airborne. 360° sweep, hits everything in range.', ['PC: Click in air ×2', 'Touch: Double-tap SLASH'], hero(280, 170, { blade: -90, legs: 'air' }) + arc(280, 128, 100, -20, 320, 30) + kiwi(160, 70) + kiwi(400, 80, 1, -1) + apple(280, 250) + impact(160, 80, .6) + impact(400, 90, .6)),
    card('5 · Dash Slash', 'Enemy far away. Invulnerable lunge that cuts everything on the line.', ['PC: Shift + Click', 'Touch: DASH then SLASH'], ghost(150, 272, .2, { legs: 'run', tilt: 10 }) + ghost(250, 272, .35, { legs: 'run', tilt: 10 }) + ghost(340, 272, .6, { legs: 'run', tilt: 10 }) + hero(430, 272, { blade: -6, legs: 'run', tilt: 12 }) + speedLines(300, 230, 22, 40, 220, 8) + arc(330, 215, 210, -14, 14, 20) + coconut(80, 232, .75, true)),
    card('6 · Slide Cut', 'Low enemies or a gap under hazards. Keep momentum; hurtbox shrinks.', ['PC: S + Click while running', 'Touch: Flick down + SLASH'], R(180, 190, 220, 16, '#6a4a2a', 'stroke="#2a1608" stroke-width="3"') + `<path d="M200 206 l10 22 l10 -22 M250 206 l10 22 l10 -22 M300 206 l10 22 l10 -22 M350 206 l10 22 l10 -22" fill="#cfd6df" stroke="#2a1608" stroke-width="2"/>` + hero(240, 270, { blade: -4, legs: 'idle', tilt: -78, crouch: 0 }) + arc(330, 262, 100, -40, 20, 24) + grape(420, 244, .9) + speedLines(240, 262, 12, 30, 120, 6)),
    card('7 · Parry Deflect', 'Time a slash against a projectile: reflect it and gain Spark.', ['PC: Click on contact', 'Touch: Tap SLASH on ring'], hero(210, 272, { blade: -80 }) + `<circle cx="285" cy="205" r="34" fill="none" stroke="#ffd36a" stroke-width="4" stroke-dasharray="6 6"/>` + impact(285, 205, .8, '#9ff3ff') + `<ellipse cx="420" cy="210" rx="26" ry="12" fill="#ff4d62" stroke="#4a0a1c" stroke-width="3"/><path d="M450 210 h60" stroke="#ff4d62" stroke-width="8" opacity=".4"/>` + kiwi(500, 110, .9, -1) + `<path d="M300 195 q80 -70 180 -90" stroke="#9ff3ff" stroke-width="5" fill="none" stroke-dasharray="4 8"/>` + T(285, 150, 'PERFECT', 22, '#9ff3ff', '#0a2a40', 'middle', 6)),
    card('8 · Ledge Strike', 'Hanging on a ledge edge. Pull-up cut or strike from below.', ['PC: Hold W + Click', 'Touch: Hold JUMP + SLASH'], platform(300, 150, 260, 140, 5) + apple(430, 106) + hero(300, 232, { blade: -55, legs: 'air' }) + R(290, 148, 30, 8, '#f4c9a0', 'stroke="#10101c" stroke-width="2"') + arc(325, 190, 100, -20, -90, 28) + impact(390, 140, .6)),
    card('9 · Heart Slash (charged)', 'Hold to charge a wide cutting wave. Releases a screen-wide arc at Spark ≥ 50%.', ['PC: Hold click · release', 'Touch: Hold SLASH · release'], `<circle cx="205" cy="215" r="60" fill="#ff7aa6" opacity=".25"/><circle cx="205" cy="215" r="40" fill="none" stroke="#ffd1e0" stroke-width="4"/>` + hero(190, 272, { blade: -30 }) + arc(330, 200, 230, -75, 35, 62, 'url(#beam)') + arc(330, 200, 230, -75, 35, 40) + grape(450, 220, .9) + apple(500, 244) + kiwi(440, 120, 1, -1) + impact(450, 220, .8) + impact(500, 240, .6) + impact(440, 130, .7) + splash(430, 200, 30, ['#ff3d7f', '#ffd1e0', '#fff'], 90, 4))
  ];
  pages.push(page('05-combat-context-moves', 1860, 1530, head('05 · Context-sensitive slash moves', 'One button, many cuts. The animation depends on attack angle, enemy position, height, speed and timing. Each move has 2 to 3 animation variants to avoid repetition.', 40, 18) +
    `<div class="abs" style="left:40px;top:108px;display:grid;grid-template-columns:repeat(3,566px);gap:22px">${cards.join('')}</div>`));
}

// 06 main menu ------------------------------------------------------------------
{
  const btn = (y, label, hot) => `<g><path d="M110 ${y} h360 l22 26 l-22 26 h-360z" fill="${hot ? '#ff3d7f' : '#0c1218'}" fill-opacity="${hot ? 1 : .8}" stroke="${hot ? '#fff' : '#ffd36a'}" stroke-opacity="${hot ? 1 : .5}" stroke-width="3"/>${T(150, y + 36, label, 26, '#fff', hot ? '#5a0a2a' : '#000', 'start', 5)}</g>`;
  const body = world() + branches() + coconut(955, 450, .85) + apple(1130, 526, 1) + apple(1210, 526, 1) + wisp(1040, 190, 1) + R(0, 0, 1280, 720, '#000', 'opacity=".25"') + `<rect width="640" height="720" fill="#0a0e14" opacity=".72"/><polygon points="640,0 700,0 640,720 600,720" fill="#0a0e14" opacity=".72"/>` + VIG +
    `<g transform="translate(110 70)"><path d="M0 60 l30 -50 l30 50 l-30 52z" fill="#ff4d7a" stroke="#fff" stroke-width="5"/><path d="M30 12 q36 -6 40 30 q-24 -2 -40 -30z" fill="#6fd36a" stroke="#10401f" stroke-width="4"/></g>` +
    T(110, 262, 'PULPWARD', 108, '#ffd36a', '#7a1e3a', 'start', 20) + `<text x="116" y="304" fill="#ff9ab8" font-family="${FONT}" font-size="26" letter-spacing="6">ONE SWIPE FROM DISASTER</text>` +
    btn(350, 'PLAY', true) + btn(420, 'DAILY ECHO', false) + btn(490, 'ARMORY', false) + btn(560, 'SETTINGS', false) +
    `<text x="110" y="670" fill="#9fb3c8" font-family="Segoe UI,Arial" font-size="15">No login needed · progress saved on this device · v0.1 · Built on Base44</text>` +
    `<g transform="translate(0 0)"><rect x="1000" y="640" width="250" height="52" rx="26" fill="#0c1218" fill-opacity=".8" stroke="#ffd36a" stroke-opacity=".5" stroke-width="2"/>${T(1125, 674, 'SOUND ON · MUSIC ON', 14, '#cfe', '#000', 'middle', 3)}</g>` +
    hero(880, 440, { s: 2.2, blade: -30, legs: 'idle', scarf: 8 });
  pages.push(page('06-main-menu', 1700, 1070, head('06 · Main menu', 'First thing a judge sees: the real world behind the title, a single PLAY button and a note that no account is needed.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// 07 upgrade picker -------------------------------------------------------------
{
  const cardSvg = (x, name, rarity, col, desc, fruitCol, tag) => `<g transform="translate(${x} 150)"><rect width="300" height="430" rx="20" fill="#101a24" stroke="${col}" stroke-width="5"/><rect x="8" y="8" width="284" height="414" rx="14" fill="none" stroke="${col}" stroke-opacity=".35"/>
    <ellipse cx="150" cy="130" rx="100" ry="90" fill="${col}" opacity=".22"/>${C(150, 130, 56, fruitCol, 'stroke="#10101c" stroke-width="6"')}${C(132, 108, 14, '#fff', 'opacity=".6"')}<path d="M150 74 q-4 -22 14 -28 q20 8 6 24z" fill="#6fd36a" stroke="#10401f" stroke-width="3"/>
    ${T(150, 250, name, 28, '#fff', '#10101c', 'middle', 6)}${T(150, 282, rarity, 15, col, '#10101c', 'middle', 4)}
    <foreignObject x="26" y="300" width="248" height="110"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#d6e2ee;font:15px Segoe UI,Arial;text-align:center;line-height:1.35">${desc}<br/><b style="color:${col}">${tag}</b></div></foreignObject></g>`;
  const body = sceneAction() + R(0, 0, 1280, 720, '#050a10', 'opacity=".78"') + T(640, 100, 'CHOOSE A FRUIT', 64, '#ffd36a', '#7a1e3a', 'middle', 14) + `<text x="640" y="130" fill="#cfe0f0" font-family="Segoe UI,Arial" font-size="18" text-anchor="middle">Wave 4 cleared · pick one, it lasts this run</text>` +
    cardSvg(130, 'Pomegranate Pop', 'RARE', '#ff4d7a', 'Every 5th cut bursts into seeds that auto-hit nearby enemies.', '#d8243c', 'DAMAGE · AREA') +
    cardSvg(490, 'Lime Dash', 'COMMON', '#9be05a', 'Dash recharges 40% faster and leaves a cutting trail.', '#7ed03a', 'MOBILITY') +
    cardSvg(850, 'Mango Mender', 'EPIC', '#ffb02e', 'Clean Cuts have a chance to restore 1 Heartseed pip.', '#ffa91f', 'SUPPORT') +
    `<g transform="translate(540 612)"><rect width="200" height="54" rx="27" fill="#0c1218" stroke="#ffd36a" stroke-width="3"/>${T(100, 36, 'REROLL · 20', 20, '#ffd36a', '#000', 'middle', 4)}</g>` +
    R(340, 690, 600, 8, '#1a2a30') + R(340, 690, 380, 8, '#ffd36a');
  pages.push(page('07-upgrade-pick', 1700, 1070, head('07 · Upgrade pick between waves', 'A three-card choice after each wave keeps runs different. The timer bar lets fast players keep the pace.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// 08 world map ------------------------------------------------------------------
{
  const node = (x, y, n, label, state, stars = 0) => {
    const col = state === 'done' ? '#9be05a' : state === 'now' ? '#ff3d7f' : '#4a5566';
    return `${state === 'now' ? `<circle cx="${x}" cy="${y}" r="48" fill="#ff3d7f" opacity=".28"/>` : ''}${C(x, y, 30, col, 'stroke="#10101c" stroke-width="5"')}${T(x, y + 9, state === 'lock' ? '🔒' : n, 24, '#fff', '#10101c', 'middle', 5)}${T(x, y + 66, label, 16, '#e8f3ff', '#000', 'middle', 4)}${[0, 1, 2].map(i => `<path d="M${x - 24 + i * 24} ${y - 42} l5 -10 l5 10 l-5 4z" fill="${i < stars ? '#ffd36a' : '#2a3442'}" stroke="#10101c" stroke-width="2"/>`).join('')}`;
  };
  const r = rng(2);
  let body = R(0, 0, 1280, 720, '#0e2a2a') + `<ellipse cx="320" cy="360" rx="420" ry="300" fill="#1c4a3a"/><ellipse cx="960" cy="340" rx="420" ry="300" fill="#3a2a4a"/>`;
  for (let i = 0; i < 40; i++) body += `<path d="M${r() * 1280} ${60 + r() * 640} l8 -22 l8 22z" fill="${i % 2 ? '#2a6a4a' : '#4a3a6a'}" opacity=".7"/>`;
  body += `<path d="M120 560 C260 460 300 520 420 430 S520 300 660 340 S820 240 980 300 S1120 200 1180 160" fill="none" stroke="#f4e2b0" stroke-width="12" stroke-dasharray="4 22" stroke-linecap="round"/>`;
  body += node(140, 560, 1, 'Seedling Steps', 'done', 3) + node(300, 480, 2, 'Waterfall Climb', 'done', 2) + node(440, 420, 3, 'Orchard Heights', 'now', 1) + node(610, 340, 4, 'Heartseed Shelf', 'lock') + node(760, 300, 5, 'Canopy Run', 'lock') + node(920, 290, '★', 'BOSS · Coconut Titan', 'lock') + node(1070, 230, 7, 'Lantern Marsh', 'lock') + node(1180, 160, 8, 'Glow Caverns', 'lock');
  body += `<rect x="40" y="40" width="440" height="84" rx="14" fill="#0c1218" fill-opacity=".85" stroke="#ffd36a" stroke-opacity=".5" stroke-width="2"/>` + T(70, 82, 'WORLD 1 · SUNLIT TERRACE', 24, '#ffd36a', '#000', 'start', 5) + `<text x="70" y="108" fill="#cfe0f0" font-family="Segoe UI,Arial" font-size="14">6 stages · 1 boss · 14 of 18 stars to unlock Lantern Marsh</text>` +
    `<rect x="900" y="40" width="340" height="60" rx="14" fill="#0c1218" fill-opacity=".85" stroke="#ffd36a" stroke-opacity=".5" stroke-width="2"/>` + C(932, 70, 12, '#ff8ab0', 'stroke="#fff" stroke-width="2"') + T(956, 78, '1,284 Petals', 22, '#fff', '#000', 'start', 4) +
    `<g transform="translate(40 560)"><rect width="330" height="130" rx="14" fill="#0c1218" fill-opacity=".9" stroke="#ff3d7f" stroke-width="3"/>${T(20, 36, 'STAGE 3 · ORCHARD HEIGHTS', 16, '#ff9ab8', '#000', 'start', 3)}<text x="20" y="62" fill="#cfe0f0" font-family="Segoe UI,Arial" font-size="13">Vertical stage · 3 tiers · best chain 22</text><rect x="20" y="78" width="290" height="38" rx="19" fill="#ff3d7f" stroke="#fff" stroke-width="3"/>${T(165, 105, 'PLAY STAGE', 20, '#fff', '#5a0a2a', 'middle', 4)}</g>`;
  pages.push(page('08-world-map', 1700, 1070, head('08 · World map and stage select', 'Two groves, six stages each, one boss per grove. Stars unlock the next grove, no payments involved.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// 09 boss -----------------------------------------------------------------------
{
  const body = world() + branches() +
    `<polygon points="560,602 960,602 1020,640 500,640" fill="#ff2d4a" opacity=".35"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${520 + i * 44} 600 l22 0 l-22 40 l-22 0z" fill="#ff2d4a" opacity=".5"/>`).join('')}` +
    titan(900, 535, .85) + wisp(300, 250, 1) + apple(420, 576, 1) +
    `<g opacity=".9"><circle cx="900" cy="500" r="120" fill="none" stroke="#ff2d4a" stroke-width="5" stroke-dasharray="14 10"/></g>` + T(900, 400, 'SLAM INCOMING', 26, '#ff5c6a', '#2a0000', 'middle', 7) +
    arc(260, 540, 100, -80, 40, 34) + hero(250, 600, { blade: -20, legs: 'run', scarf: 5 }) + `<g opacity=".25">${hero(170, 600, { legs: 'run' })}</g>` + VIG +
    hud({ x: 0, y: 0, w: 1280, h: 720 }, { chain: 6, mult: '1.5', hp: 3, tide: .3 }) +
    `<g transform="translate(340 640)"><rect width="600" height="44" rx="10" fill="#0c1218" fill-opacity=".85" stroke="#ff5c6a" stroke-width="3"/><rect x="8" y="8" width="584" height="28" rx="6" fill="#2a1418"/><rect x="8" y="8" width="380" height="28" rx="6" fill="#ff3d4a"/><rect x="388" y="8" width="3" height="28" fill="#fff"/><rect x="190" y="8" width="3" height="28" fill="#0006"/>${T(300, 34, 'COCONUT TITAN · ARMOR 2/3', 16, '#fff', '#000', 'middle', 4)}</g>`;
  pages.push(page('09-boss-fight', 1700, 1070, head('09 · Boss fight: Coconut Titan', 'Telegraphed floor slam, armor segments to cut through in sequence, and a visible safe lane. Dodge by jumping to the tier above.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// 10 results + share ------------------------------------------------------------
{
  const stat = (y, k, v) => `<text x="80" y="${y}" fill="#b9c9da" font-family="Segoe UI,Arial" font-size="19">${k}</text>` + T(560, y, v, 22, '#fff', '#000', 'end', 4);
  const body = sceneAction() + R(0, 0, 1280, 720, '#050a10', 'opacity=".78"') +
    `<g transform="translate(110 70)"><rect width="640" height="580" rx="22" fill="#101a24" stroke="#ffd36a" stroke-width="5"/>${T(320, 74, 'STAGE CLEAR', 58, '#ffd36a', '#7a1e3a', 'middle', 12)}${[0, 1, 2].map(i => `<path d="M${200 + i * 120} 150 l16 -36 l16 36 l36 4 l-28 26 l8 38 l-32 -20 l-32 20 l8 -38 l-28 -26z" transform="translate(${i === 1 ? 0 : 0} ${i === 1 ? -16 : 0}) translate(-34 0)" fill="${i < 3 ? '#ffd36a' : '#2a3442'}" stroke="#7a4a00" stroke-width="4"/>`).join('')}${T(320, 260, '112,940', 56, '#fff', '#10101c', 'middle', 10)}<text x="320" y="288" fill="#ff9ab8" text-anchor="middle" font-family="${FONT}" font-size="18">NEW BEST · RANK S</text>` +
    stat(340, 'Longest chain', '31') + stat(376, 'Clean Cuts', '86%') + stat(412, 'Heartseed damage', '0 · PURE GROVE') + stat(448, 'Petals earned', '+ 640') +
    `<g transform="translate(60 480)"><rect width="250" height="64" rx="32" fill="#ff3d7f" stroke="#fff" stroke-width="4"/>${T(125, 42, 'NEXT STAGE', 24, '#fff', '#5a0a2a', 'middle', 5)}</g><g transform="translate(330 480)"><rect width="110" height="64" rx="32" fill="#0c1218" stroke="#ffd36a" stroke-width="3"/>${T(55, 42, 'RETRY', 18, '#ffd36a', '#000', 'middle', 4)}</g><g transform="translate(456 480)"><rect width="140" height="64" rx="32" fill="#0c1218" stroke="#9ff3ff" stroke-width="3"/>${T(70, 42, 'SHARE', 18, '#9ff3ff', '#000', 'middle', 4)}</g></g>` +
    `<g transform="translate(800 100) rotate(3)"><rect width="340" height="520" rx="18" fill="#fff"/><rect x="10" y="10" width="320" height="400" rx="12" fill="#0a1a22"/><svg x="10" y="10" width="320" height="400" viewBox="440 200 520 640" preserveAspectRatio="xMidYMid slice">${world()}${apple(720, 570, 1.1, true)}${impact(690, 560, 1)}${arc(560, 548, 120, -70, 40, 44)}${hero(540, 600, { blade: -12, legs: 'run' })}</svg>${T(170, 60, 'PULPWARD', 28, '#ffd36a', '#7a1e3a', 'middle', 6)}${T(170, 372, '112,940', 40, '#fff', '#10101c', 'middle', 8)}<text x="170" y="450" fill="#10101c" text-anchor="middle" font-family="${FONT}" font-size="20">Beat my score on the same seed</text><text x="170" y="480" fill="#d02a60" text-anchor="middle" font-family="${FONT}" font-size="26">ECHO · 7K3Q-X9</text><text x="170" y="504" fill="#555" text-anchor="middle" font-family="Segoe UI,Arial" font-size="13">pulpward.base44.app/e/7K3QX9</text></g>`;
  pages.push(page('10-results-and-share', 1700, 1070, head('10 · Results and share card', 'One next-step button, a ready-made share image and a same-seed challenge link. No login to share.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// 11 enemy roster ---------------------------------------------------------------
{
  const e = (title, role, tip, art) => `<div style="width:420px;background:#0f1822;border:2px solid #ffd36a44;border-radius:14px;overflow:hidden">${svg('0 0 420 260', 420, 260, `<rect width="420" height="260" fill="url(#sky)"/><ellipse cx="210" cy="140" rx="180" ry="100" fill="url(#glow)" opacity=".35"/>` + platform(0, 215, 420, 60, 2) + art)}<div style="padding:10px 14px"><div style="font:900 19px ${FONT};color:#ffd36a">${title}</div><div style="font-size:13px;color:#b9c9da;margin-top:3px">${role}</div><div style="font-size:13px;color:#9be05a;margin-top:4px">Counter: ${tip}</div></div></div>`;
  const cards = [
    e('Rot Apple', 'Rolls along tiers, hops ledges, 1 HP. The basic grunt.', 'Ground Slash; chain through packs.', apple(210, 175, 1.5)),
    e('Kiwi Dart', 'Flies in arcs, then dives at the Heartseed.', 'Rising Uppercut or Aerial Spin.', kiwi(210, 110, 1.6)),
    e('Coconut Brute', 'Armored, needs a break hit then a finisher.', 'Dash Slash to break, Plunge to finish.', coconut(210, 150, 1.2)),
    e('Mold Wisp', 'Drifts down with a leaf parachute, drops spores.', 'Cut the parachute mid-air.', wisp(210, 120, 1.8)),
    e('Grape Swarm', 'Splits into 8 pips on death.', 'Heart Slash or Aerial Spin.', grape(210, 130, 1.8)),
    e('Coconut Titan (boss)', 'Floor slams, armor segments, minion calls.', 'Dodge onto a higher tier; attack in the opening.', titan(210, 185, .55))
  ];
  pages.push(page('11-enemy-roster', 1400, 880, head('11 · Enemy roster', 'Each enemy asks for a different movement or slash, so the moves in sheet 05 are all useful.', 40, 18) +
    `<div class="abs" style="left:40px;top:100px;display:grid;grid-template-columns:repeat(3,420px);gap:20px">${cards.join('')}</div>`));
}

// 12 level section --------------------------------------------------------------
{
  const pin = (x, y, t, n) => `<circle cx="${x}" cy="${y}" r="16" fill="#ff3d7f" stroke="#fff" stroke-width="3"/>` + T(x, y + 6, n, 17, '#fff', '#000', 'middle', 0) + T(x + 24, y + 6, t, 17, '#fff', '#000', 'start', 4);
  const jump = (x1, y1, x2, y2, h) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - h} ${x2} ${y2}" fill="none" stroke="#9ff3ff" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="6" fill="#9ff3ff"/>`;
  const body = world() + branches() + R(0, 0, 1280, 720, '#06141e', 'opacity=".6"') +
    jump(380, 596, 250, 432, 70) + jump(480, 430, 600, 368, 60) + jump(600, 368, 360, 296, 90) + jump(360, 296, 500, 226, 50) + jump(930, 316, 840, 438, 40) + jump(960, 436, 1170, 246, 100) + jump(1120, 246, 1030, 556, 20) + jump(236, 432, 236, 300, 60) +
    pin(300, 640, 'Tier 1 · Orchard floor, 2 lanes of enemies', 1) + pin(180, 470, 'Tier 2 · Ledge, one jump up', 2) + pin(580, 345, 'Tier 3 · Heartseed shelf, double jump or bounce', 3) + pin(300, 285, 'Tier 4 · Canopy branches, one-way', 4) + pin(236, 410, 'Mushroom bounce pad', 5) + pin(1010, 396, 'Cliff, wall-cling', 6) + pin(820, 296, 'Branch, drop through with S', 7) + pin(60, 100, 'Waterfall: slows enemy spawns on the left', 8);
  pages.push(page('12-level-height-design', 1700, 1070, head('12 · Level design: verticality', 'Four tiers, jump routes, bounce pads and drop-through branches. Enemies spawn at different heights so you must move vertically to win.', 50, 20) +
    `<div class="abs" style="left:50px;top:100px">${browser(svg('0 0 1280 720', 1600, 900, body), 1600, 900)}</div>`));
}

// ------------- render -------------
const only = process.argv[2];
for (const p of pages) {
  if (only && !p.name.startsWith(only)) continue;
  const f = path.join(OUT, p.name + '.html'), png = path.join(OUT, p.name + '.png');
  const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${p.W},${p.H}`, `--screenshot=${png}`, 'file:///' + f.replace(/\\/g, '/')], { encoding: 'utf8', timeout: 60000 });
  console.log(p.name, r.status, fs.existsSync(png) ? fs.statSync(png).size : 'missing');
}


