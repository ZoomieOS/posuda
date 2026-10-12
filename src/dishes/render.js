import { DISH, isLightInk } from '../config/dishes.js';
import { PAINT } from './paint.js';

const HAND = 'Neucha, "Comic Sans MS", cursive';

/* Word-wrap that also breaks words too long for one line */
function wrap(g, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean), lines = [];
  let line = '';
  for (let w of words) {
    while (g.measureText(w).width > maxW && w.length > 1) {
      let cut = w.length - 1;
      while (cut > 1 && g.measureText(w.slice(0, cut) + '-').width > maxW) cut--;
      if (line) { lines.push(line); line = ''; }
      lines.push(w.slice(0, cut) + '-');
      w = w.slice(cut);
    }
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

/* Renders a dish with the thought written on it into its own canvas */
export function renderDish(type, text, R, dpr) {
  const d = DISH[type], r = Math.round(R * d.k);
  const c = document.createElement('canvas');
  c.width = c.height = Math.ceil(2 * r * dpr);
  const g = c.getContext('2d');
  g.scale(dpr, dpr); g.translate(r, r);
  PAINT[type](g, r);

  const tr = d.tr || 1, light = isLightInk(type);
  g.save();
  g.translate(0, (d.ty || 0) * r); g.rotate(-.06);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  if (light) { g.shadowColor = 'rgba(0,20,40,.75)'; g.shadowBlur = 4; }

  if (text) {
    let size = r * (d.glass ? .38 : .34) * Math.min(1, tr + .15), lines;
    const box = r * 1.15 * tr;
    do { g.font = `${size}px ${HAND}`; lines = wrap(g, text, box); size *= .92; }
    while ((lines.length * size * 1.1 > box || lines.length > 5) && size > 8);
    const lh = size / .92 * 1.05;
    g.fillStyle = d.ink;
    lines.forEach((l, i) => g.fillText(l, 0, (i - (lines.length - 1) / 2) * lh));
  } else {
    g.font = `${r * (d.glass ? .22 : .17) * Math.min(1, tr + .2)}px ${HAND}`;
    g.fillStyle = light ? 'rgba(240,252,255,.65)' : 'rgba(60,70,90,.42)';
    g.fillText('напиши здесь,', 0, -r * .1 * tr);
    g.fillText('что гложет', 0, r * .1 * tr);
  }
  g.restore();
  return { c, r, type };
}
