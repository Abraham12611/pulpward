// Tiny WebAudio synth so the prototype has sound without asset files.
let ctx;
const ensure = () => {
  if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (A) ctx = new A(); }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function tone(freq, end, dur, type = 'square', vol = 0.06) {
  const a = ensure(); if (!a) return;
  const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, end), a.currentTime + dur);
  g.gain.setValueAtTime(vol, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}

function noise(dur, vol = 0.08, hp = 800) {
  const a = ensure(); if (!a) return;
  const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = a.createBufferSource(); s.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = a.createGain(); g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(a.destination); s.start();
}

export const unlock = ensure;

export function sfx(e) {
  switch (e.type) {
    case 'jump': tone(300, 520, 0.12, 'square', 0.04); break;
    case 'dash': noise(0.12, 0.07, 1500); break;
    case 'slash': noise(0.1, 0.09, 2500); tone(900, 400, 0.08, 'triangle', 0.04); break;
    case 'skip': noise(0.16, 0.09, 1200); tone(500, 1100, 0.12, 'sawtooth', 0.03); break;
    case 'roll': tone(220, 520, 0.2, 'triangle', 0.06); break;
    case 'hit': tone(200, 120, 0.06, 'square', 0.06); break;
    case 'kill': tone(e.heavy ? 90 : 240, 40, e.heavy ? 0.3 : 0.14, 'square', e.heavy ? 0.12 : 0.07); noise(e.heavy ? 0.25 : 0.1, 0.1, 300); break;
    case 'shrine': tone(160, 60, 0.3, 'sawtooth', 0.08); break;
    case 'hurt': tone(180, 60, 0.25, 'square', 0.08); break;
    case 'wave': tone(392, 784, 0.35, 'triangle', 0.06); break;
    case 'over': tone(220, 55, 0.8, 'sawtooth', 0.08); break;
    default: break;
  }
}
