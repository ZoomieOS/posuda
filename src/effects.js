import { world, view } from './state.js';
import { rand, TAU } from './lib/math.js';
import { heartPath } from './lib/draw.js';

export function addHeart(x, y, big = 1) {
  world.hearts.push({ x, y, vx: rand(-40, 40), vy: rand(-140, -70), t: 0, life: rand(1.2, 2), sz: rand(7, 13) * big, wob: rand(0, 6) });
}

export function addDust(x, y, glass) {
  const n = view.reduceMotion ? 8 : (glass ? 40 : 26);
  for (let i = 0; i < n; i++) {
    const a = rand(0, TAU), sp = rand(60, 380);
    world.dust.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80, t: 0, life: rand(.3, .8), sz: rand(1, 3), glass });
  }
}

export function addMark(x, y) {
  const rays = [];
  for (let i = 0; i < 7; i++) rays.push([rand(0, TAU), rand(10, 34)]);
  world.marks.push({ x, y, t: 0, rays });
  if (world.marks.length > 12) world.marks.shift();
}

export function updateEffects(dt) {
  for (const d of world.dust) { d.t += dt; d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt; }
  world.dust = world.dust.filter(d => d.t < d.life);
  for (const h of world.hearts) { h.t += dt; h.x += (h.vx + Math.sin(h.t * 4 + h.wob) * 30) * dt; h.y += h.vy * dt; }
  world.hearts = world.hearts.filter(h => h.t < h.life);
  for (const m of world.marks) m.t += dt;
  world.marks = world.marks.filter(m => m.t < 6);
  world.shake = Math.max(0, world.shake - dt);
}

export function drawMarks(ctx, rgb) {
  for (const m of world.marks) {
    const al = Math.min(1, (6 - m.t) / 2) * .55;
    ctx.strokeStyle = `rgba(${rgb},${al})`; ctx.lineWidth = 1.5;
    for (const [a, l] of m.rays) {
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + Math.cos(a) * l, m.y + Math.sin(a) * l); ctx.stroke();
    }
    ctx.fillStyle = `rgba(${rgb},${al * .6})`;
    ctx.beginPath(); ctx.arc(m.x, m.y, 4, 0, TAU); ctx.fill();
  }
}

export function drawDust(ctx) {
  for (const d of world.dust) {
    ctx.globalAlpha = 1 - d.t / d.life;
    ctx.fillStyle = d.glass ? '#dff8ff' : 'rgba(255,255,255,.85)';
    ctx.fillRect(d.x, d.y, d.sz, d.sz);
  }
  ctx.globalAlpha = 1;
}

export function drawHearts(ctx) {
  for (const h of world.hearts) {
    ctx.globalAlpha = Math.max(0, 1 - h.t / h.life);
    ctx.fillStyle = '#ff7b8f'; heartPath(ctx, h.x, h.y, h.sz); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
