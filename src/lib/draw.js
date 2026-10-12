import { TAU } from './math.js';

export function disc(g, x, y, r, fill) {
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = fill; g.fill();
}

export function ring(g, x, y, r, w, col) {
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.lineWidth = w; g.strokeStyle = col; g.stroke();
}

/* Glossy radial gradient with the light coming from the top-left */
export function radial(g, r, c1, c2) {
  const gr = g.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r);
  gr.addColorStop(0, c1); gr.addColorStop(1, c2);
  return gr;
}

export function heartPath(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * .35);
  c.bezierCurveTo(x - s, y - s * .3, x - s * .5, y - s * 1.05, x, y - s * .45);
  c.bezierCurveTo(x + s * .5, y - s * 1.05, x + s, y - s * .3, x, y + s * .35);
}
