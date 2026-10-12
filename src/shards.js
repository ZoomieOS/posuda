import { world, view } from './state.js';
import { DISH } from './config/dishes.js';
import { rand } from './lib/math.js';
import { makeShards } from './dishes/shatter.js';

const MAX_SHARDS = 420;

/* Breaks the flying dish into physical shards at its current position */
export function spawnShards(dish) {
  const { x, y, s, rot, c, r, type } = dish;
  const glass = !!DISH[type].glass, cos = Math.cos(rot), sin = Math.sin(rot);
  const { floorTop, H } = view;
  for (const sh of makeShards(r, type, view.reduceMotion)) {
    const ox = (sh.cx * cos - sh.cy * sin) * s, oy = (sh.cx * sin + sh.cy * cos) * s;
    const len = Math.hypot(ox, oy) || 1, sp = rand(140, glass ? 640 : 520);
    world.shards.push({
      ...sh, c, r, s, glass, x: x + ox, y: y + oy, a: rot,
      vx: ox / len * sp + rand(-60, 60), vy: oy / len * sp * .6 - rand(60, 260), va: rand(-9, 9),
      floor: floorTop + rand(6, Math.min(70, (H - floorTop) * .45)), t: 0, landed: false
    });
  }
  if (world.shards.length > MAX_SHARDS) world.shards.splice(0, world.shards.length - MAX_SHARDS);
}

/* Tapping shards on the floor makes them jump; returns how many were hit */
export function kickShards(px, py) {
  let hit = 0;
  for (const s of world.shards) {
    if (Math.hypot(s.x - px, s.y - py) < 34 + s.r * s.s * .3) {
      s.landed = false; s.vy = -rand(280, 620); s.vx = (s.x - px) * 6 + rand(-120, 120); s.va = rand(-14, 14);
      s.t = Math.min(s.t, 3); hit++;
    }
  }
  return hit;
}

/* Sends every shard sliding off-screen; returns false if there was nothing to sweep */
export function sweepShards() {
  if (!world.shards.length) return false;
  const dir = Math.random() < .5 ? -1 : 1;
  for (const s of world.shards) {
    s.landed = false; s.vx = dir * rand(900, 1600); s.vy = -rand(40, 180); s.va = rand(-10, 10); s.t = Math.max(s.t, 7.3);
  }
  return true;
}

export function updateShards(dt) {
  for (const s of world.shards) {
    s.t += dt;
    if (s.landed) continue;
    s.vy += 1900 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt;
    if (s.y > s.floor && s.vy > 0) {
      s.y = s.floor; s.vy *= -.22; s.vx *= .55; s.va *= .4;
      if (Math.abs(s.vy) < 60) s.landed = true;
    }
  }
  world.shards = world.shards.filter(s => s.t < 9 && s.x > -200 && s.x < view.W + 200);
}

export function drawShards(ctx) {
  for (const s of world.shards) {
    const al = s.t > 7 ? Math.max(0, 1 - (s.t - 7) / 2) : 1;
    ctx.save();
    ctx.globalAlpha = al;
    ctx.translate(s.x, s.y); ctx.rotate(s.a); ctx.scale(s.s, s.s); ctx.translate(-s.cx, -s.cy);
    ctx.beginPath(); ctx.moveTo(s.p[0][0], s.p[0][1]);
    for (let i = 1; i < s.p.length; i++) ctx.lineTo(s.p[i][0], s.p[i][1]);
    ctx.closePath();
    ctx.save(); ctx.clip(); ctx.drawImage(s.c, -s.r, -s.r, 2 * s.r, 2 * s.r); ctx.restore();
    ctx.strokeStyle = s.glass ? 'rgba(235,252,255,.85)' : 'rgba(255,255,255,.5)';
    ctx.lineWidth = (s.glass ? 1.4 : 1) / s.s;
    ctx.stroke();
    ctx.restore();
  }
}
