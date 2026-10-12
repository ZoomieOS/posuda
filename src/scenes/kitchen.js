import { rand, clamp } from '../lib/math.js';
import { vignette, floorLines } from './helpers.js';

/* Night kitchen: teal tiles, warm lamp, wooden floor */
export function kitchen(g, v) {
  const { W, H, floorTop } = v;
  g.fillStyle = '#122426'; g.fillRect(0, 0, W, H);

  const t = clamp(W / 8, 44, 74);
  for (let y = 0; y < floorTop; y += t) for (let x = -((W % t) / 2); x < W; x += t) {
    g.fillStyle = `hsl(184, 34%, ${21 + rand(-4, 4)}%)`; g.fillRect(x + 2, y + 2, t - 4, t - 4);
    g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x + 4, y + 4, t * .4, 2);
  }

  const lamp = g.createRadialGradient(W * .5, -40, 10, W * .5, -40, Math.max(W, H) * .8);
  lamp.addColorStop(0, 'rgba(255,205,150,.22)'); lamp.addColorStop(1, 'rgba(255,205,150,0)');
  g.fillStyle = lamp; g.fillRect(0, 0, W, floorTop);

  g.fillStyle = '#0b1718'; g.fillRect(0, floorTop - 8, W, 8);
  const fl = g.createLinearGradient(0, floorTop, 0, H);
  fl.addColorStop(0, '#3d2c21'); fl.addColorStop(1, '#1c130d');
  g.fillStyle = fl; g.fillRect(0, floorTop, W, H - floorTop);
  floorLines(g, v, 'rgba(0,0,0,.28)', false);
  vignette(g, v, .45);
}
