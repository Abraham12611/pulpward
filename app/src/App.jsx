import React, { useEffect, useRef, useState } from 'react';
import { Game, W, H } from '@/game/game.js';
import { draw } from '@/game/render.js';
import { sfx, unlock } from '@/game/audio.js';

const SAVE_KEY = 'pulpward.save.v1';
const loadSave = () => {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; }
};

const KEYS = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'jump', KeyW: 'jump', Space: 'jump',
  KeyJ: 'attack', KeyZ: 'attack',
  KeyK: 'dash', ShiftLeft: 'dash', KeyX: 'dash',
};

function useLandscape() {
  const [portrait, setPortrait] = useState(window.innerHeight > window.innerWidth);
  useEffect(() => {
    const f = () => setPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return !portrait;
}

export default function App() {
  const canvasRef = useRef(null);
  const input = useRef({ left: false, right: false, jumpHeld: false, jumpPressed: false, attackPressed: false, dashPressed: false });
  const landscape = useLandscape();
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    const game = new Game(loadSave());
    const inp = input.current;
    let raf; let last = performance.now(); let tm = 0;

    const fit = () => {
      const s = Math.min(window.innerWidth / W, window.innerHeight / H);
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${W * s}px`; canvas.style.height = `${H * s}px`;
      canvas.width = Math.round(W * s * dpr); canvas.height = Math.round(H * s * dpr);
      c.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

    const press = (k, down) => {
      if (k === 'left') inp.left = down;
      else if (k === 'right') inp.right = down;
      else if (k === 'jump') { if (down && !inp.jumpHeld) inp.jumpPressed = true; inp.jumpHeld = down; }
      else if (k === 'attack' && down) inp.attackPressed = true;
      else if (k === 'dash' && down) inp.dashPressed = true;
    };
    const kd = (e) => {
      unlock();
      if (e.code === 'Enter' && game.over) { game.reset(); return; }
      const k = KEYS[e.code]; if (k) { e.preventDefault(); press(k, true); }
    };
    const ku = (e) => { const k = KEYS[e.code]; if (k) press(k, false); };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    window.__pwPress = press;
    window.__pwRestart = () => { if (game.over) game.reset(); };

    const loop = (now) => {
      const dt = (now - last) / 1000; last = now; tm += dt;
      game.update(dt, inp);
      inp.jumpPressed = inp.attackPressed = inp.dashPressed = false;
      for (const e of game.events) {
        sfx(e);
        if (e.type === 'over') localStorage.setItem(SAVE_KEY, JSON.stringify({ best: e.best }));
      }
      game.events.length = 0;
      draw(c, game, tm);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  const bind = (k) => ({
    onPointerDown: (e) => { e.preventDefault(); unlock(); window.__pwRestart?.(); window.__pwPress(k, true); },
    onPointerUp: () => window.__pwPress(k, false),
    onPointerLeave: () => window.__pwPress(k, false),
    onPointerCancel: () => window.__pwPress(k, false),
  });
  const btn = 'absolute flex items-center justify-center rounded-full border-2 border-[#4a2a2a] bg-[#fbf0dc]/70 font-extrabold text-[#4a2a2a] select-none touch-none';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2b2133] overflow-hidden touch-none">
      <canvas ref={canvasRef} />
      {touch && landscape && (
        <>
          <div {...bind('left')} className={`${btn} left-4 bottom-5 h-16 w-16 text-2xl`}>◀</div>
          <div {...bind('right')} className={`${btn} left-24 bottom-5 h-16 w-16 text-2xl`}>▶</div>
          <div {...bind('attack')} className={`${btn} right-6 bottom-6 h-20 w-20 text-sm`}>ATTACK</div>
          <div {...bind('jump')} className={`${btn} right-28 bottom-4 h-14 w-14 text-xs`}>JUMP</div>
          <div {...bind('dash')} className={`${btn} right-8 bottom-28 h-12 w-12 text-xs`}>DASH</div>
        </>
      )}
      {!landscape && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#2b2133] text-center text-[#fff1d0]">
          <div className="text-5xl">⟳</div>
          <div className="text-xl font-extrabold">Rotate your phone</div>
          <div className="text-sm opacity-80">Pulpward plays in landscape.</div>
        </div>
      )}
    </div>
  );
}
