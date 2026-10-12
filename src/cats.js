import { world, view } from './state.js';
import { rand, clamp, TAU } from './lib/math.js';

/* Two white cats: one with blue eyes, one with amber eyes and a higher meow */
const LOOKS = [
  { eye: '#7fc4f5', pitch: 1 },
  { eye: '#e7bf55', pitch: 1.18 }
];
const FUR = '#f5f3ef', SHADE = '#d8d3c9', PINK = '#efa3b2';
const WALK_SPEED = 70;

export function spawnCats() {
  const { W, R, floorTop } = view;
  const dir = Math.random() < .5 ? 1 : -1, sc = clamp(R / 110, .65, 1.05);
  const both = Math.random() < .65, first = Math.random() < .5 ? 0 : 1;
  const stop = W * rand(.32, .62);
  const make = (look, lag, stopOff, size) => ({
    ...LOOKS[look], dir, sc: sc * size,
    x: (dir > 0 ? -90 * sc : W + 90 * sc) - dir * lag * sc,
    y: floorTop + 34 * sc * size,
    mode: 'walk', t: rand(0, 3), stopAt: stop - dir * stopOff * sc,
    sitLeft: rand(2.8, 4.5), tail: rand(0, 5), petted: 0, sat: false
  });
  world.cats.push(make(first, 0, 0, 1));
  if (both) world.cats.push(make(1 - first, rand(90, 140), rand(95, 130), .92));
}

export function placeCatsOnFloor() {
  for (const c of world.cats) c.y = view.floorTop + 34 * c.sc;
}

export function catAt(px, py) {
  return world.cats.find(c => Math.abs(px - c.x) < 60 * c.sc && py > c.y - 95 * c.sc && py < c.y + 10);
}

/* A pet makes the cat sit a little longer with its eyes closed */
export function petCat(c) {
  c.petted = 1.4;
  if (c.mode === 'walk') { c.mode = 'sit'; c.sitLeft = 3; }
  else c.sitLeft = Math.max(c.sitLeft, 2.5);
}

export function updateCats(dt) {
  for (const c of world.cats) {
    c.t += dt; c.tail += dt; c.petted = Math.max(0, c.petted - dt);
    if (c.mode === 'walk') {
      c.x += c.dir * WALK_SPEED * c.sc * dt;
      const reached = (c.dir > 0 && c.x >= c.stopAt) || (c.dir < 0 && c.x <= c.stopAt);
      if (!c.sat && reached) { c.mode = 'sit'; c.sat = true; }
    } else {
      c.sitLeft -= dt;
      if (c.sitLeft <= 0) { c.mode = 'walk'; c.sat = true; }
    }
  }
  world.cats = world.cats.filter(c => !(c.sat && c.mode === 'walk' && (c.x < -160 || c.x > view.W + 160)));
}

export function drawCats(ctx) {
  [...world.cats].sort((a, b) => a.y - b.y).forEach(cat => drawCat(ctx, cat));
}

function drawCat(c, cat) {
  c.save();
  c.translate(cat.x, cat.y); c.scale(cat.sc * cat.dir, cat.sc);
  c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 2, 46, 6, 0, 0, TAU); c.fill();
  c.lineCap = 'round';
  const blink = (cat.t % 3.4) < .12;

  if (cat.mode === 'walk') {
    const ph = cat.t * 9;
    c.strokeStyle = FUR; c.lineWidth = 8; c.beginPath(); c.moveTo(-36, -30);
    c.quadraticCurveTo(-62, -40 + Math.sin(cat.tail * 3) * 6, -60, -70 + Math.sin(cat.tail * 3) * 8); c.stroke();
    c.lineWidth = 7;
    [[-14, Math.PI, SHADE], [16, Math.PI, SHADE], [-26, 0, FUR], [28, 0, FUR]].forEach(([lx, o, col]) => {
      c.strokeStyle = col; c.beginPath(); c.moveTo(lx, -22); c.lineTo(lx + Math.sin(ph + o) * 6, 0); c.stroke();
    });
    const bd = c.createLinearGradient(0, -48, 0, -12); bd.addColorStop(0, FUR); bd.addColorStop(1, SHADE);
    c.fillStyle = bd; c.beginPath(); c.ellipse(0, -30, 38, 17, 0, 0, TAU); c.fill();
    c.save(); c.translate(42, -44 + Math.sin(ph * 2) * 1.2); drawHead(c, cat, blink); c.restore();
  } else {
    c.strokeStyle = FUR; c.lineWidth = 8; c.beginPath(); c.moveTo(-14, -6);
    c.quadraticCurveTo(-42, 0, -32 + Math.sin(cat.tail * 2) * 4, -18 + Math.sin(cat.tail * 2.3) * 4); c.stroke();
    const bd = c.createLinearGradient(-20, -60, 10, 0); bd.addColorStop(0, FUR); bd.addColorStop(1, SHADE);
    c.fillStyle = bd; c.beginPath(); c.ellipse(-2, -30, 24, 30, -.1, 0, TAU); c.fill();
    c.fillStyle = FUR; c.beginPath(); c.ellipse(10, -4, 8, 5, 0, 0, TAU); c.ellipse(-12, -4, 8, 5, 0, 0, TAU); c.fill();
    c.save(); c.translate(8, -66); drawHead(c, cat, blink || cat.petted > 0); c.restore();
  }
  c.restore();
}

function drawHead(c, cat, closed) {
  c.fillStyle = FUR;
  c.beginPath(); c.moveTo(-13, -8); c.lineTo(-9, -27); c.lineTo(1, -12); c.fill();
  c.beginPath(); c.moveTo(4, -12); c.lineTo(12, -26); c.lineTo(15, -6); c.fill();
  c.fillStyle = PINK;
  c.beginPath(); c.moveTo(-10, -11); c.lineTo(-8.5, -21); c.lineTo(-3, -12); c.fill();
  c.beginPath(); c.moveTo(6, -12); c.lineTo(11.5, -21); c.lineTo(13, -9); c.fill();

  const hg = c.createRadialGradient(-4, -5, 2, 0, 0, 16);
  hg.addColorStop(0, '#ffffff'); hg.addColorStop(1, SHADE);
  c.fillStyle = hg; c.beginPath(); c.arc(0, 0, 15.5, 0, TAU); c.fill();

  if (closed) {
    c.strokeStyle = '#5a5550'; c.lineWidth = 1.6;
    c.beginPath(); c.arc(-5, -1, 3, .2, Math.PI - .2); c.stroke();
    c.beginPath(); c.arc(6, -1, 3, .2, Math.PI - .2); c.stroke();
  } else {
    c.fillStyle = cat.eye; c.beginPath(); c.arc(-5, -2, 3.4, 0, TAU); c.arc(6, -2, 3.4, 0, TAU); c.fill();
    c.fillStyle = '#1d1f24'; c.fillRect(-5.7, -4.8, 1.4, 5.4); c.fillRect(5.3, -4.8, 1.4, 5.4);
    c.fillStyle = '#fff'; c.fillRect(-4.2, -4, 1, 1); c.fillRect(6.8, -4, 1, 1);
  }
  if (cat.petted > 0) {
    c.fillStyle = 'rgba(239,140,160,.45)';
    c.beginPath(); c.ellipse(-9, 4, 3.5, 2, 0, 0, TAU); c.ellipse(10, 4, 3.5, 2, 0, 0, TAU); c.fill();
  }
  c.fillStyle = PINK; c.beginPath(); c.moveTo(-1.5, 4); c.lineTo(2.5, 4); c.lineTo(.5, 6.5); c.fill();
  c.strokeStyle = 'rgba(110,110,110,.55)'; c.lineWidth = .8;
  [[5, 0], [6.5, 3]].forEach(([y, s]) => {
    c.beginPath(); c.moveTo(4, y); c.lineTo(24, y - 2 + s); c.stroke();
    c.beginPath(); c.moveTo(-3, y); c.lineTo(-22, y - 2 + s); c.stroke();
  });
}
