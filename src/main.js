import './style.css';
import { view, world } from './state.js';
import { el, showToast, showCombo, showNote, setPressed } from './ui.js';
import { load, save } from './storage.js';
import { rand, clamp, pick } from './lib/math.js';
import { HEAVY } from './config/dishes.js';
import { LOC, PHRASES, CAT_PHRASES } from './config/locations.js';
import { NOTE_FIRST, NOTE_EVERY } from './config/notes.js';
import { renderDish } from './dishes/render.js';
import { renderScene, onSceneAssetReady } from './scenes/index.js';
import { spawnShards, kickShards, sweepShards, updateShards, drawShards } from './shards.js';
import { spawnCats, placeCatsOnFloor, catAt, petCat, updateCats, drawCats } from './cats.js';
import { addHeart, addDust, addMark, updateEffects, drawMarks, drawDust, drawHearts } from './effects.js';
import * as sfx from './audio.js';

const ctx = el.canvas.getContext('2d');

let loc = LOC[load('bp-loc')] ? load('bp-loc') : 'kitchen';
let dishType = 'plate';
let bg = null;

/* the dish in hand: idle → drag → fly → gone → idle */
const dish = { x: 0, y: 0, s: 1, rot: 0, c: null, r: 0, type: 'plate' };
let state = 'idle', fly = null, drag = null;

let count = parseInt(load('bp-count', '0'), 10) || 0;
let sessionSmashes = 0, combo = 0, lastSmash = -10, sinceCat = 0, idleT = 0;
el.count.textContent = count;

/* ---------- layout ---------- */
function redrawDish() {
  Object.assign(dish, renderDish(dishType, el.input.value.trim(), view.R, view.dpr));
}

function restPos() {
  const th = el.tray.getBoundingClientRect().height;
  return { x: view.W / 2, y: view.H - th - dish.r * .85 };
}

function resize() {
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  view.W = el.canvas.clientWidth; view.H = el.canvas.clientHeight;
  el.canvas.width = view.W * view.dpr; el.canvas.height = view.H * view.dpr;
  view.R = clamp(Math.min(view.W, view.H * .9) * .2, 68, 120);
  view.floorTop = view.H * LOC[loc].floor;
  bg = renderScene(loc, view);
  redrawDish();
  placeCatsOnFloor();
  if (state === 'idle') Object.assign(dish, restPos());
}

function setLoc(next) {
  loc = next; el.app.dataset.loc = next;
  setPressed(el.locChips, b => b.dataset.loc === next);
  save('bp-loc', next);
  world.shards = []; world.marks = []; world.dust = []; world.cats = [];
  resize();
  setTimeout(() => { if (!world.cats.length) spawnCats(); }, 1500);
}

/* ---------- throwing ---------- */
function throwDish(vx, vy) {
  if (state !== 'idle' && state !== 'drag') return;
  sfx.ensureAudio();
  const { W, R, floorTop, wallTopPx } = view;
  const lo = wallTopPx + R * .5, hi = Math.max(lo + 10, floorTop - R * .7);
  const ty = rand(lo, hi);
  let tx = vy < -1 ? dish.x + vx / -vy * (dish.y - ty) : W / 2 + rand(-W * .25, W * .25);
  tx = clamp(tx, 50, W - 50);
  fly = { sx: dish.x, sy: dish.y, tx, ty, t: 0, dur: .42, spin: clamp(vx / 300, -4, 4) + rand(-2, 2) };
  state = 'fly';
  sfx.whoosh();
}

function smash() {
  spawnShards(dish);
  addDust(dish.x, dish.y, dish.type === 'glass' || dish.type === 'wine');
  addMark(dish.x, dish.y);
  if (!view.reduceMotion) world.shake = HEAVY.has(dish.type) ? .26 : .18;
  sfx.crash(dish.type);

  count++; el.count.textContent = count; save('bp-count', count);

  const now = performance.now() / 1000;
  combo = now - lastSmash < 2.4 ? combo + 1 : 1; lastSmash = now;
  if (combo >= 2) showCombo(combo);
  else showToast(pick(Math.random() < .4 ? LOC[loc].phrases : PHRASES));

  sinceCat++; idleT = 0;
  if (!world.cats.length && sinceCat >= 4 && Math.random() < .7) { spawnCats(); sinceCat = 0; }

  sessionSmashes++;
  if (sessionSmashes >= NOTE_FIRST && (sessionSmashes - NOTE_FIRST) % NOTE_EVERY === 0) {
    setTimeout(() => { showNote(); sfx.chime(); }, 900);
  }

  dish.c = null; state = 'gone';
  setTimeout(() => {
    el.input.value = '';
    redrawDish();
    const p = restPos();
    Object.assign(dish, { x: p.x, y: view.H + dish.r, s: 1, rot: 0 });
    state = 'idle';
  }, 650);
}

/* ---------- input ---------- */
const localPt = e => { const b = el.canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };

el.canvas.addEventListener('pointerdown', e => {
  sfx.ensureAudio();
  const [px, py] = localPt(e);
  if (state === 'idle' && Math.hypot(px - dish.x, py - dish.y) <= dish.r * 1.15) {
    state = 'drag'; el.canvas.classList.add('dragging'); el.canvas.setPointerCapture(e.pointerId);
    drag = { dx: dish.x - px, dy: dish.y - py, samples: [[px, py, performance.now()]] };
    return;
  }
  const kitty = catAt(px, py);
  if (kitty) {
    petCat(kitty); sfx.meow(kitty.pitch);
    for (let i = 0; i < 6; i++) addHeart(kitty.x + rand(-20, 20), kitty.y - 75 * kitty.sc);
    showToast(pick(CAT_PHRASES));
    return;
  }
  const hit = kickShards(px, py);
  if (hit) sfx.tink(Math.min(hit, 4));
});

el.canvas.addEventListener('pointermove', e => {
  if (state !== 'drag') return;
  const [px, py] = localPt(e);
  dish.x = px + drag.dx; dish.y = py + drag.dy;
  drag.samples.push([px, py, performance.now()]);
  if (drag.samples.length > 8) drag.samples.shift();
});

/* a fast upward flick throws; anything slower puts the dish back */
function endDrag() {
  if (state !== 'drag') return;
  el.canvas.classList.remove('dragging');
  const now = performance.now(), s = drag.samples.filter(q => now - q[2] < 120);
  let vx = 0, vy = 0;
  if (s.length > 1) {
    const a = s[0], z = s[s.length - 1], dt = Math.max(.016, (z[2] - a[2]) / 1000);
    vx = (z[0] - a[0]) / dt; vy = (z[1] - a[1]) / dt;
  }
  if (vy < -350) throwDish(vx, vy); else state = 'idle';
}
el.canvas.addEventListener('pointerup', endDrag);
el.canvas.addEventListener('pointercancel', endDrag);

el.form.addEventListener('submit', e => { e.preventDefault(); throwDish(rand(-200, 200), -900); });
el.input.addEventListener('input', () => { if (state === 'idle' || state === 'drag') redrawDish(); });

el.dishChips.forEach(b => b.addEventListener('click', () => {
  dishType = b.dataset.dish;
  setPressed(el.dishChips, x => x === b);
  if (state === 'idle') redrawDish();
}));
el.locChips.forEach(b => b.addEventListener('click', () => { if (b.dataset.loc !== loc) setLoc(b.dataset.loc); }));

el.sweep.addEventListener('click', () => {
  sfx.ensureAudio();
  if (!sweepShards()) { showToast('Уже чисто'); return; }
  sfx.swish(); showToast('Чистота');
});

el.mute.addEventListener('click', () => {
  el.mute.textContent = sfx.toggleMuted() ? 'Звук: выкл' : 'Звук: вкл';
});

el.noteClose.addEventListener('click', () => {
  el.note.hidden = true;
  for (let i = 0; i < 18; i++) addHeart(view.W / 2 + rand(-60, 60), view.H * .45 + rand(-30, 30), 1.2);
  el.input.focus({ preventScroll: true });
});

/* ---------- loop ---------- */
function updateDish(dt) {
  if (state === 'idle') {
    const p = restPos(), k = Math.min(1, dt * 10);
    dish.x += (p.x - dish.x) * k; dish.y += (p.y - dish.y) * k;
    dish.rot += (0 - dish.rot) * k; dish.s += (1 - dish.s) * k;
  } else if (state === 'fly') {
    fly.t += dt;
    const p = Math.min(1, fly.t / fly.dur), e = 1 - (1 - p) * (1 - p);
    dish.x = fly.sx + (fly.tx - fly.sx) * e;
    dish.y = fly.sy + (fly.ty - fly.sy) * e - Math.sin(p * Math.PI) * 50;
    dish.s = 1 - .52 * e; dish.rot += fly.spin * dt;
    if (p >= 1) smash();
  }
}

function update(dt) {
  updateDish(dt);
  updateShards(dt);
  updateEffects(dt);
  updateCats(dt);
  idleT += dt;
  if (!world.cats.length && idleT > 30) { idleT = 0; spawnCats(); }
}

function drawDishInHand() {
  if (!dish.c || state === 'gone') return;
  ctx.save();
  ctx.translate(dish.x, dish.y); ctx.rotate(dish.rot); ctx.scale(dish.s, dish.s);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 26 * view.dpr; ctx.shadowOffsetY = 14 * dish.s * view.dpr;
  ctx.drawImage(dish.c, -dish.r, -dish.r, dish.r * 2, dish.r * 2);
  ctx.restore();
}

function draw() {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.save();
  if (world.shake > 0) ctx.translate(rand(-5, 5) * world.shake * 5, rand(-5, 5) * world.shake * 5);
  if (bg) ctx.drawImage(bg, 0, 0, view.W, view.H);
  drawMarks(ctx, LOC[loc].mark);
  drawCats(ctx);
  drawShards(ctx);
  drawDust(ctx);
  ctx.restore();
  drawDishInHand();
  drawHearts(ctx);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(.033, (now - last) / 1000); last = now;
  update(dt); draw();
  requestAnimationFrame(frame);
}

/* ---------- start ---------- */
el.app.dataset.loc = loc;
setPressed(el.locChips, b => b.dataset.loc === loc);
window.addEventListener('resize', resize);
onSceneAssetReady(name => { if (name === loc) bg = renderScene(loc, view); });
resize();
Object.assign(dish, restPos());
document.fonts?.load('30px Neucha').then(redrawDish).catch(() => {});
setTimeout(() => { if (!world.cats.length) spawnCats(); }, 2500);
requestAnimationFrame(frame);
