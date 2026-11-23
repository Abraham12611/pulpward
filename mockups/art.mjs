// Pulpward mockup art kit: procedural SVG pieces (original art, no reference assets traced).
export const FONT = "'Arial Black','Segoe UI Black',Impact,sans-serif";
export function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const R = (x, y, w, h, f, x2 = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${x2}/>`;
const C = (x, y, r, f, x2 = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${x2}/>`;
export const T = (x, y, s, size, fill = '#fff', stroke = '#10101c', anchor = 'middle', sw) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${sw ?? Math.max(3, size / 6)}" paint-order="stroke" stroke-linejoin="round" text-anchor="${anchor}">${s}</text>`;

export const defs = () => `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a22"/><stop offset=".55" stop-color="#2b1b24"/><stop offset="1" stop-color="#4a2a1c"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc766" stop-opacity=".85"/><stop offset="1" stop-color="#ffc766" stop-opacity="0"/></radialGradient>
<radialGradient id="pinkglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5c8a" stop-opacity=".9"/><stop offset="1" stop-color="#ff5c8a" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".30"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc3ff" stop-opacity=".35"/><stop offset="1" stop-color="#2f78c8" stop-opacity=".6"/></linearGradient>
<linearGradient id="slash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#9ff3ff"/><stop offset="1" stop-color="#3fb6ff" stop-opacity=".1"/></linearGradient>
<linearGradient id="dirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a3a2e"/><stop offset=".5" stop-color="#5a2224"/><stop offset="1" stop-color="#1c0f16"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff3d7f" stop-opacity="0"/><stop offset=".5" stop-color="#ffd1e0"/><stop offset="1" stop-color="#ff3d7f" stop-opacity="0"/></linearGradient>
<filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="blur14"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="redch"><feColorMatrix values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .75 0"/></filter>
<filter id="cyanch"><feColorMatrix values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .75 0"/></filter>
</defs>`;

// ---------- terrain ----------
export function platform(x, y, w, depth = 400, seed = 1) {
  const r = rng(seed); let s = '';
  s += R(x, y, w, depth, 'url(#dirt)');
  for (let i = 0; i < w / 18; i++) { // brick-ish strata flecks
    const px = x + r() * (w - 12), py = y + 18 + r() * Math.min(depth - 30, 110);
    s += R(px | 0, py | 0, 10 + (r() * 18 | 0), 4, r() > .5 ? '#a04a38' : '#3a1820', 'opacity=".7"');
  }
  s += R(x, y, w, 14, '#3f8f2c') + R(x, y, w, 4, '#9be05a') + R(x, y + 14, w, 5, '#2b6a22');
  for (let px = x; px < x + w; px += 6) { // grass fringe
    const hh = 3 + (r() * 5 | 0);
    s += R(px, y + 16, 4, hh, r() > .4 ? '#2b6a22' : '#3f8f2c');
  }
  for (let i = 0; i < w / 40; i++) { // tufts
    const tx = x + 8 + r() * (w - 20);
    s += `<path d="M${tx} ${y} l-4 -12 l4 5 l2 -13 l3 13 l5 -7 l-3 14z" fill="#6fd04a" stroke="#1d4a18" stroke-width="1.5"/>`;
  }
  s += R(x - 2, y, 4, depth, '#10080e', 'opacity=".5"');
  return s;
}
export function torch(x, y) {
  return `<ellipse cx="${x}" cy="${y - 10}" rx="90" ry="90" fill="url(#glow)" opacity=".7"/>` +
    R(x - 3, y, 6, 34, '#5a3a22') + `<path d="M${x} ${y - 22} q10 10 6 20 q-6 6 -12 0 q-4 -10 6 -20z" fill="#ffb02e" stroke="#ff6a1e" stroke-width="2"/>` + C(x, y - 6, 3, '#fff2b0');
}
export function lantern(x, y) {
  return R(x - 1, y - 40, 2, 40, '#2a1a1a') + R(x - 8, y, 16, 20, '#ffcb6b', 'stroke="#3a2412" stroke-width="3"') + `<ellipse cx="${x}" cy="${y + 10}" rx="46" ry="46" fill="url(#glow)" opacity=".6"/>`;
}
export function heartTree(x, y, s = 1, glowOn = true) {
  // x,y = base of trunk
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  if (glowOn) o += `<ellipse cx="0" cy="-70" rx="200" ry="170" fill="url(#glow)" opacity=".55"/>`;
  o += R(-18, -150, 36, 150, '#c56a3e', 'stroke="#3a1a14" stroke-width="4"') + R(-6, -150, 10, 150, '#e08a50') + R(-30, -14, 60, 14, '#8a4a2a');
  const r = rng(9);
  const blobs = [[0, -190, 78], [-62, -168, 50], [62, -168, 50], [-30, -232, 50], [34, -230, 48], [0, -150, 56]];
  blobs.forEach(b => o += C(b[0], b[1], b[2], '#2f9a4a', 'stroke="#10401f" stroke-width="4"'));
  blobs.forEach(b => o += C(b[0] - 12, b[1] - 14, b[2] * .55, '#49c05f'));
  for (let i = 0; i < 11; i++) { const fx = (r() - .5) * 150, fy = -140 - r() * 120; o += `<path d="M${fx} ${fy} l-7 -4 q-2 12 7 16 q9 -4 7 -16z" fill="#ff4d62" stroke="#7a1030" stroke-width="2"/>`; }
  // heartseed crystal
  o += `<ellipse cx="0" cy="-34" rx="40" ry="40" fill="url(#pinkglow)"/>` + `<path d="M0 -14 l-14 -16 l14 -22 l14 22z" fill="#ff7aa6" stroke="#fff" stroke-width="3"/><path d="M0 -14 l-14 -16 l14 -4z" fill="#ffd0e2"/>`;
  return o + '</g>';
}

// ---------- world ----------
export function world(o = {}) {
  const r = rng(5); let s = R(0, 0, 1280, 720, 'url(#sky)');
  s += `<ellipse cx="640" cy="330" rx="520" ry="260" fill="url(#glow)" opacity=".35"/>`;
  // far canopy silhouettes
  s += `<path d="M0 420 Q120 190 260 330 Q340 200 470 300 Q600 130 760 290 Q900 170 1040 300 Q1160 210 1280 330 V720 H0z" fill="#0d2229" opacity=".85"/>`;
  s += `<path d="M0 470 Q150 330 300 420 Q420 330 560 410 Q700 300 860 410 Q1000 330 1140 420 Q1210 380 1280 430 V720 H0z" fill="#12303a" opacity=".9"/>`;
  // big trunks
  [[190, 60], [1010, 90], [1210, 70]].forEach(t => s += `<path d="M${t[0]} 0 q-${t[1] / 2} 280 -${t[1]} 560 h${t[1] * 1.6} q-${t[1] / 3} -280 ${t[1] / 2} -560z" fill="#1c1a22" opacity=".8"/>`);
  // god rays
  [[470, 0, 120, 640], [660, 0, 90, 640], [840, 0, 140, 640]].forEach(g => s += `<polygon points="${g[0]},0 ${g[0] + g[2]},0 ${g[0] + g[2] * 2.4 + 80},${g[3]} ${g[0] - 80},${g[3]}" fill="url(#ray)"/>`);
  // waterfall
  s += R(70, 70, 110, 500, 'url(#water)') + R(76, 70, 8, 500, '#c9ecff', 'opacity=".5"') + R(120, 70, 6, 500, '#c9ecff', 'opacity=".35"') + R(158, 70, 5, 500, '#c9ecff', 'opacity=".3"');
  s += `<ellipse cx="125" cy="572" rx="70" ry="14" fill="#e8f7ff" opacity=".7"/>` + R(0, 572, 300, 148, '#143a66') + R(0, 572, 300, 6, '#6fc3ff', 'opacity=".6"');
  // back ledge fences / terrain tiers
  s += platform(0, 440, 70, 300, 3);
  s += platform(180, 436, 330, 320, 4);
  s += platform(520, 372, 280, 360, 6);   // heartseed tier
  s += platform(800, 440, 110, 320, 7);
  s += platform(910, 496, 110, 260, 8);
  s += platform(1020, 560, 260, 200, 9);
  s += platform(300, 600, 520, 160, 12);   // lower floor
  s += platform(1090, 410, 190, 340, 13).replace(/^/, ''); // upper right ledge
  s += torch(300, 400) + torch(815, 560) + torch(1000, 460);
  s += lantern(560, 300) + lantern(780, 300);
  // fence posts
  [[200, 436], [226, 436]].forEach(p => s += R(p[0], p[1] - 32, 8, 32, '#7a4a2a'));
  // bush with fruit
  s += `<path d="M420 600 q-30 -30 -4 -50 q10 20 30 -4 q14 22 36 4 q22 24 6 50z" fill="#2fa04a" stroke="#10401f" stroke-width="3"/>`;
  // mushrooms (bounce pads)
  s += `<g transform="translate(236 436)"><rect x="-4" y="-14" width="8" height="14" fill="#f3e1c0"/><path d="M-22 -14 q22 -30 44 0z" fill="#ff5c8a" stroke="#6a1030" stroke-width="3"/>${C(-8, -22, 3, '#fff')}${C(8, -20, 3, '#fff')}</g>`;
  s += heartTree(660, 372, 1);
  // vines
  s += `<path d="M520 372 q-8 40 4 70 M528 372 q10 30 -2 58" stroke="#2f9a4a" stroke-width="4" fill="none"/>`;
  // dust motes
  for (let i = 0; i < 40; i++) s += C((r() * 1280) | 0, (r() * 600) | 0, 1 + r() * 2, '#ffe9a8', `opacity="${(.2 + r() * .5).toFixed(2)}"`);
  return s;
}

// ---------- characters ----------
export function hero(x, y, p = {}) {
  const { s = 1, flip = 1, blade = -20, legs = 'idle', crouch = 0, tilt = 0, scarf = 0, bladeHidden = false } = p;
  const ol = 'stroke="#10101c" stroke-width="3" stroke-linejoin="round"';
  let g = `<g transform="translate(${x} ${y}) scale(${s * flip} ${s}) rotate(${tilt})">`;
  const lo = legs === 'run' ? [[-16, -10, 14, 10], [4, -14, 14, 14]] : legs === 'air' ? [[-14, -14, 12, 14], [4, -8, 14, 10]] : [[-14, -10, 12, 10], [2, -10, 12, 10]];
  lo.forEach(l => g += R(l[0], l[1] + crouch, l[2], l[3], '#3a2a24', ol));
  g += `<path d="M-14 ${-42 + crouch} l-24 ${8 + scarf} l8 8 l18 -2z" fill="#ff5a3c" ${ol}/><path d="M-26 ${-34 + crouch + scarf} l-20 ${12 + scarf} l8 4 l16 -6z" fill="#ff7a52" ${ol}/>`;
  g += R(-14, -40 + crouch, 28, 32 - crouch, '#2fb5a0', ol) + R(-14, -22 + crouch, 28, 5, '#f2b84b') + R(-6, -38 + crouch, 12, 10, '#6fe0cd');
  g += R(-13, -62 + crouch, 26, 22, '#f4c9a0', ol) + R(4, -54 + crouch, 4, 6, '#1b1b1b') + R(-6, -54 + crouch, 4, 6, '#1b1b1b');
  g += `<path d="M-15 ${-62 + crouch} l15 -20 l15 20z" fill="#6fd36a" ${ol}/><path d="M-4 ${-66 + crouch} l14 -12 l6 16z" fill="#9af08a" ${ol}/>`;
  if (!bladeHidden) g += `<g transform="translate(10 ${-34 + crouch}) rotate(${blade})">${R(0, -3, 14, 6, '#f4c9a0', ol)}<path d="M12 -5 l30 -4 l14 9 l-14 9 l-30 -4z" fill="#e8fbff" ${ol}/><path d="M16 -2 l36 2 l-36 2z" fill="#7fe3ff"/>${R(10, -7, 4, 14, '#f2b84b', ol)}</g>`;
  return g + '</g>';
}
export function arc(cx, cy, r, a0, a1, th = 30, grad = 'url(#slash)') {
  const pts = [], n = 22; const d0 = a0 * Math.PI / 180, d1 = a1 * Math.PI / 180;
  for (let i = 0; i <= n; i++) { const a = d0 + (d1 - d0) * i / n; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  for (let i = n; i >= 0; i--) { const a = d0 + (d1 - d0) * i / n; const k = Math.sin(Math.PI * i / n); const rr = r - th * k; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + 'z';
  return `<path d="${d}" fill="#7fe3ff" opacity=".6" filter="url(#blur6)"/><path d="${d}" fill="${grad}"/>`;
}
const eyes = (x, y, k = 1) => R(x - 12 * k, y - 6 * k, 8 * k, 8 * k, '#fff2d0') + R(x + 4 * k, y - 6 * k, 8 * k, 8 * k, '#fff2d0') + R(x - 8 * k, y - 4 * k, 4 * k, 6 * k, '#2a0a10') + R(x + 8 * k, y - 4 * k, 4 * k, 6 * k, '#2a0a10') +
  `<path d="M${x - 15 * k} ${y - 12 * k} l14 ${5 * k} M${x + 15 * k} ${y - 12 * k} l-14 ${5 * k}" stroke="#2a0a10" stroke-width="${3 * k}"/>`;
export const apple = (x, y, k = 1, hit = false) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="4" rx="26" ry="26" fill="${hit ? '#fff' : '#d8243c'}" stroke="#4a0a1c" stroke-width="4"/><ellipse cx="-8" cy="-6" rx="9" ry="12" fill="#ff6a7c" opacity=".7"/><path d="M0 -22 q-3 -12 8 -16" stroke="#5a3a1a" stroke-width="4" fill="none"/><path d="M6 -30 q14 -8 18 4 q-12 6 -18 -4z" fill="#3fbf55" stroke="#10401f" stroke-width="2"/>${eyes(0, 4, 1)}</g>`;
export const kiwi = (x, y, k = 1, flip = 1) => `<g transform="translate(${x} ${y}) scale(${k * flip} ${k})"><path d="M-70 8 l40 -8 l-40 -10 z" fill="#9be05a" opacity=".5"/><ellipse cx="0" cy="0" rx="30" ry="20" fill="#8a6a3a" stroke="#2a1a0a" stroke-width="4"/><ellipse cx="0" cy="2" rx="22" ry="13" fill="#9ad24a"/><ellipse cx="0" cy="2" rx="8" ry="5" fill="#f4f0b0"/>${[[-12, 0], [12, 4], [-4, 8], [6, -4]].map(p => R(p[0], p[1], 3, 3, '#1a1a10')).join('')}<path d="M26 -2 l18 4 l-18 4z" fill="#ffd36a" stroke="#2a1a0a" stroke-width="2"/>${eyes(14, -6, .55)}<path d="M-6 -18 q-10 -22 -22 -14 q8 10 22 14z M4 -18 q8 -22 22 -14 q-8 10 -22 14z" fill="#d8f0a0" stroke="#2a1a0a" stroke-width="2" opacity=".85"/></g>`;
export const coconut = (x, y, k = 1, hit = false) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="46" ry="44" fill="${hit ? '#fff' : '#6a4228'}" stroke="#1a0e08" stroke-width="5"/><path d="M-40 -14 q40 -40 80 0 l-6 10 q-34 -26 -68 0z" fill="#8a5a38"/><path d="M-30 -30 l60 0 M-42 -6 l84 0" stroke="#c0c8d0" stroke-width="7"/><path d="M-30 -30 l60 0 M-42 -6 l84 0" stroke="#4a5058" stroke-width="2"/>${C(-14, 16, 5, '#2a1a10')}${C(0, 22, 5, '#2a1a10')}${C(14, 16, 5, '#2a1a10')}${eyes(0, -16, 1.1)}<path d="M-26 -30 l-10 -14 M26 -30 l10 -14" stroke="#c0c8d0" stroke-width="6"/></g>`;
export const wisp = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-30 -24 q30 -42 60 0z" fill="#79d6ff" stroke="#10405a" stroke-width="3" opacity=".9"/><path d="M-30 -24 l24 34 M30 -24 l-24 34 M0 -40 l0 50" stroke="#e8fbff" stroke-width="1.5"/><path d="M-14 6 q-4 -14 14 -14 q18 0 14 14 q-2 18 -14 20 q-12 -2 -14 -20z" fill="#cfefff" stroke="#27607a" stroke-width="3"/>${eyes(0, 8, .6)}<ellipse cx="0" cy="8" rx="40" ry="40" fill="#7fe3ff" opacity=".18"/></g>`;
export const grape = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${[[-14, -8], [14, -8], [0, 4], [-26, 8], [26, 8], [-12, 20], [12, 20], [0, 34]].map(p => C(p[0], p[1], 13, '#7a3fc0', 'stroke="#1e0a3a" stroke-width="3"') + C(p[0] - 4, p[1] - 4, 4, '#b890ee')).join('')}${eyes(0, 4, .8)}<path d="M0 -20 q4 -14 14 -16" stroke="#3a6a2a" stroke-width="4" fill="none"/></g>`;
export function titan(x, y, k = 1, hit = false) { return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="40" rx="150" ry="22" fill="#000" opacity=".4"/>` + coconut(0, -10, 3.4, hit) + `<path d="M-130 -60 l-40 -40 M130 -60 l40 -40" stroke="#c0c8d0" stroke-width="14"/>${[-90, -40, 40, 90].map(a => `<path d="M${a} -150 l${a / 10} -34 l16 34z" fill="#e8d0a0" stroke="#3a2412" stroke-width="4"/>`).join('')}</g>`; }

// ---------- VFX ----------
export function splash(cx, cy, n, cols, spread, seed = 3, big = 7) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = r() * spread; const sz = 3 + r() * big; s += R((cx + Math.cos(a) * d) | 0, (cy + Math.sin(a) * d * .8) | 0, sz | 0, sz | 0, cols[(r() * cols.length) | 0]); }
  return s;
}
export function impact(x, y, k = 1, col = '#fff') {
  let p = ''; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = (i % 2 ? 26 : 52) * k; p += `${(x + Math.cos(a) * l).toFixed(1)},${(y + Math.sin(a) * l).toFixed(1)} `; }
  return `<polygon points="${p}" fill="${col}" stroke="#ffcc33" stroke-width="3"/>`;
}
export function speedLines(cx, cy, n, r0, r1, seed = 4, col = '#fff') {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, a0 = r0 + r() * 80, a1 = r1 + r() * 200; s += `<line x1="${cx + Math.cos(a) * a0}" y1="${cy + Math.sin(a) * a0}" x2="${cx + Math.cos(a) * a1}" y2="${cy + Math.sin(a) * a1}" stroke="${col}" stroke-width="${1 + r() * 3}" opacity="${.15 + r() * .35}"/>`; }
  return s;
}
export const dmg = (x, y, v, c = '#ffe36a', k = 1) => T(x, y, v, 30 * k, c, '#5a1a00');

// ---------- HUD ----------
export function hud(vp, o = {}) {
  const { x, y, w, h } = vp, m = 22, hp = o.hp ?? 4, spark = o.spark ?? .72, chain = o.chain ?? 12, mult = o.mult ?? '2.5', tide = o.tide ?? .62;
  let s = '';
  const panel = (px, py, pw, ph) => `<path d="M${px} ${py} h${pw - 14} l14 14 v${ph - 14} h-${pw} z" fill="#0c1218" fill-opacity=".72" stroke="#ffd36a" stroke-opacity=".5" stroke-width="2"/>`;
  // top-left: portrait + hp + juice
  s += panel(x + m, y + m, 330, 92) + `<rect x="${x + m + 10}" y="${y + m + 10}" width="60" height="60" fill="#133038" stroke="#ffd36a" stroke-width="3"/>` + hero(x + m + 40, y + m + 66, { s: .62, blade: 0, bladeHidden: true });
  for (let i = 0; i < 5; i++) s += `<path d="M${x + m + 92 + i * 34} ${y + m + 20} l12 -10 l12 10 l-12 18z" fill="${i < hp ? '#ff4d7a' : '#2a1a24'}" stroke="${i < hp ? '#ffd0dc' : '#5a3a4a'}" stroke-width="2.5"/>`;
  s += R(x + m + 90, y + m + 50, 218, 14, '#1a2a30', 'stroke="#6fe0cd" stroke-width="2"') + R(x + m + 92, y + m + 52, 214 * spark, 10, '#ffd36a') + T(x + m + 90, y + m + 82, 'BLOOM', 11, '#ffd36a', '#000', 'start', 2);
  // top center: tide
  const cx = x + w / 2;
  s += panel(cx - 190, y + m, 380, 62) + T(cx, y + m + 26, 'WAVE 4 · BLIGHT TIDE', 15, '#ffd36a', '#000', 'middle', 3) + R(cx - 170, y + m + 36, 340, 12, '#2a1418', 'stroke="#ff5c6a" stroke-width="2"') + R(cx - 168, y + m + 38, 336 * tide, 8, '#ff5c6a');
  // top right: petals + score + pause
  s += panel(x + w - m - 280, y + m, 280, 62) + C(x + w - m - 256, y + m + 30, 11, '#ff8ab0', 'stroke="#fff" stroke-width="2"') + T(x + w - m - 236, y + m + 38, '1,284', 22, '#fff', '#000', 'start', 4) + T(x + w - m - 30, y + m + 38, (o.score ?? '48,260'), 22, '#ffd36a', '#000', 'end', 4);
  s += `<rect x="${x + w - m - 60}" y="${y + m + 72}" width="60" height="46" rx="8" fill="#0c1218" fill-opacity=".72" stroke="#ffd36a" stroke-opacity=".5" stroke-width="2"/>` + R(x + w - m - 40, y + m + 84, 6, 22, '#fff') + R(x + w - m - 26, y + m + 84, 6, 22, '#fff');
  // combo chain (left of centre)
  if (chain) s += T(x + m, y + m + 150, `${chain} CHAIN`, 34, '#fff', '#ff3d7f', 'start', 8) + T(x + m, y + m + 182, `×${mult}`, 28, '#ffd36a', '#5a1a00', 'start', 6) + R(x + m, y + m + 192, 160, 8, '#2a1418') + R(x + m, y + m + 192, 160 * .7, 8, '#ffd36a');
  return s;
}
export function fruitSlots(cx, by, o = {}) {
  const icons = [['#ff4d62', 'Q'], ['#ffd23a', 'E'], ['#9be05a', 'R']];
  let s = '';
  icons.forEach((ic, i) => { const px = cx + (i - 1) * 86; const ready = i !== 2 || o.ready;
    s += `<path d="M${px - 32} ${by - 26} l16 -18 h32 l16 18 l-16 18 h-32z" fill="#0c1218" fill-opacity=".8" stroke="${ready ? '#ffd36a' : '#555'}" stroke-width="3"/>` + C(px, by - 26, 15, ic[0], 'stroke="#10101c" stroke-width="3"') + C(px - 4, by - 31, 4, '#fff', 'opacity=".7"') + T(px, by + 10, ic[1], 15, '#ffd36a', '#000', 'middle', 3); });
  return s;
}
export function touchControls(vp, o = {}) {
  const { x, y, w, h } = vp; let s = '';
  const bx = x + 150, by = y + h - 140;
  s += C(bx, by, 96, '#ffffff', 'opacity=".08" stroke="#fff" stroke-opacity=".35" stroke-width="3"') + C(bx + (o.stick ?? 28), by - 6, 44, '#ffffff', 'opacity=".28" stroke="#fff" stroke-width="3"');
  s += `<path d="M${bx - 128} ${by} l-22 0 m0 0 l10 -10 m-10 10 l10 10" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none"/>`;
  s += `<path d="M${bx + 128} ${by} l22 0 m0 0 l-10 -10 m10 10 l-10 10" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none"/>`;
  const rx = x + w - 180, ry = y + h - 150;
  const btn = (px, py, r, col, label, ic) => C(px, py, r, col, 'fill-opacity=".30" stroke="#fff" stroke-opacity=".7" stroke-width="4"') + C(px, py, r - 10, col, 'fill-opacity=".35"') + (ic || '') + T(px, py + r + 22, label, 15, '#fff', '#000', 'middle', 4);
  s += btn(rx, ry, 70, '#ff4d7a', 'SLASH', `<path d="M${rx - 26} ${ry + 24} q40 -10 52 -50 q-6 38 -52 50z" fill="#fff"/>`);
  s += btn(rx - 138, ry + 30, 46, '#6fe0cd', 'JUMP', `<path d="M${rx - 138} ${ry + 44} v-30 m-14 12 l14 -14 l14 14" stroke="#fff" stroke-width="6" fill="none"/>`);
  s += btn(rx + 6, ry - 118, 40, '#ffd36a', 'DASH', `<path d="M${rx - 12} ${ry - 118} h28 m-10 -10 l10 10 l-10 10" stroke="#fff" stroke-width="6" fill="none"/>`);
  s += btn(rx - 108, ry - 100, 36, '#9be05a', 'FRUIT', C(rx - 108, ry - 100, 12, '#ffd23a', 'stroke="#fff" stroke-width="3"'));
  // aim ring hint
  s += `<circle cx="${rx}" cy="${ry}" r="110" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3" stroke-dasharray="6 10"/>`;
  return s;
}

// ---------- frames ----------
export const phone = (inner, w, h, rot = false) => `<div style="width:${w + 44}px;height:${h + 44}px;border-radius:52px;background:linear-gradient(145deg,#3a3f4a,#12151b);padding:22px;box-shadow:0 30px 80px #000c,inset 0 0 0 3px #555b68;position:relative"><div style="width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;background:#000;position:relative">${inner}</div></div>`;
export const browser = (inner, w, h, url = 'pulpward.base44.app') => `<div style="width:${w}px;border-radius:14px;overflow:hidden;background:#1b1f27;box-shadow:0 30px 90px #000c,0 0 0 2px #394050"><div style="height:44px;display:flex;align-items:center;gap:10px;padding:0 16px;background:#232834"><i style="width:12px;height:12px;border-radius:6px;background:#ff5f57"></i><i style="width:12px;height:12px;border-radius:6px;background:#febc2e"></i><i style="width:12px;height:12px;border-radius:6px;background:#28c840"></i><div style="margin-left:18px;flex:1;height:26px;border-radius:13px;background:#12151b;color:#9aa3b5;font:13px Segoe UI,Arial;line-height:26px;padding-left:16px">🔒 ${url}</div></div><div style="width:${w}px;height:${h}px">${inner}</div></div>`;
export const svg = (vb, w, h, body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" shape-rendering="geometricPrecision" style="display:block" ${extra}>${defs()}${body}</svg>`;
export const R_ = R, C_ = C;
