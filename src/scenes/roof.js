import { rand } from '../lib/math.js';
import { disc } from '../lib/draw.js';
import { vignette } from './helpers.js';

/* Rooftop at night: starry sky, moon, city skyline, brick parapet */
export function roof(g, v) {
  const { W, H, floorTop } = v;
  const top = v.wallTopPx;

  const sky = g.createLinearGradient(0, 0, 0, top);
  sky.addColorStop(0, '#070d22'); sky.addColorStop(1, '#22305a');
  g.fillStyle = sky; g.fillRect(0, 0, W, top);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(255,255,255,${rand(.3, .9)})`;
    g.fillRect(rand(0, W), rand(0, top * .8), rand(.8, 2), rand(.8, 2));
  }

  const mx = W * .82, my = top * .3, glow = g.createRadialGradient(mx, my, 10, mx, my, 70);
  glow.addColorStop(0, 'rgba(255,245,215,.35)'); glow.addColorStop(1, 'rgba(255,245,215,0)');
  g.fillStyle = glow; g.fillRect(mx - 70, my - 70, 140, 140);
  disc(g, mx, my, 16, '#fff3d6');
  disc(g, mx + 6, my - 4, 14, 'rgba(34,48,90,.9)');

  for (let x = -10; x < W;) {
    const bw = rand(30, 70), bh = rand(top * .2, top * .6);
    g.fillStyle = '#0d1630'; g.fillRect(x, top - bh, bw, bh);
    for (let wy = top - bh + 6; wy < top - 8; wy += 10) for (let wx = x + 5; wx < x + bw - 6; wx += 9) {
      if (Math.random() < .22) {
        g.fillStyle = Math.random() < .8 ? 'rgba(255,214,120,.8)' : 'rgba(160,200,255,.7)';
        g.fillRect(wx, wy, 4, 5);
      }
    }
    x += bw + rand(2, 10);
  }

  g.fillStyle = '#3a1f17'; g.fillRect(0, top, W, floorTop - top);
  const bh = 20, bw = 46;
  for (let y = top + 10, row = 0; y < floorTop; y += bh, row++) for (let x = -(row % 2) * bw / 2; x < W; x += bw) {
    g.fillStyle = `hsl(12, ${40 + rand(-6, 6)}%, ${30 + rand(-5, 5)}%)`;
    g.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3);
  }
  g.fillStyle = '#9c8b7a'; g.fillRect(0, top, W, 10);
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, top + 10, W, 3);

  const fl = g.createLinearGradient(0, floorTop, 0, H);
  fl.addColorStop(0, '#2d2d33'); fl.addColorStop(1, '#141418');
  g.fillStyle = fl; g.fillRect(0, floorTop, W, H - floorTop);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(255,255,255,${rand(.03, .1)})`;
    g.fillRect(rand(0, W), rand(floorTop, H), 2, 2);
  }
  vignette(g, v, .4);
}
