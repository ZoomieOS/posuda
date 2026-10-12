import { TAU } from '../lib/math.js';
import { disc, ring, radial } from '../lib/draw.js';

/* Each painter draws its dish seen from above, centred at 0,0 inside radius r */
export const PAINT = {
  plate(g, r) {
    disc(g, 0, 0, r, radial(g, r, '#ffffff', '#dfe3e8'));
    ring(g, 0, 0, r * .9, r * .045, '#2f5d9e');
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * TAU;
      disc(g, Math.cos(a) * r * .965, Math.sin(a) * r * .965, r * .016, '#2f5d9e');
    }
    ring(g, 0, 0, r * .7, 2, 'rgba(0,0,0,.07)');
  },

  bowl(g, r) {
    disc(g, 0, 0, r, radial(g, r, '#fbf3e4', '#cdb994'));
    const sh = g.createRadialGradient(0, 0, r * .55, 0, 0, r);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.8, 'rgba(80,50,20,.18)'); sh.addColorStop(1, 'rgba(80,50,20,.05)');
    disc(g, 0, 0, r, sh);
    ring(g, 0, 0, r * .9, r * .045, '#b8533a');
  },

  saucer(g, r) {
    disc(g, 0, 0, r, radial(g, r, '#fff7f7', '#ead2d6'));
    ring(g, 0, 0, r * .9, r * .045, '#cf7f97');
    ring(g, 0, 0, r * .8, 1.5, '#c9a24a');
    ring(g, 0, 0, r * .55, 2, 'rgba(0,0,0,.06)');
  },

  mug(g, r) {
    const br = r * .8;
    g.lineWidth = r * .11; g.strokeStyle = '#c98f22'; g.lineCap = 'round';
    g.beginPath(); g.arc(br * .97, 0, r * .15, -1.3, 1.3); g.stroke();
    disc(g, 0, 0, br, radial(g, br, '#f3c55a', '#c98f22'));
    const inn = g.createRadialGradient(0, 0, br * .4, 0, 0, br * .86);
    inn.addColorStop(0, '#fff7e4'); inn.addColorStop(.85, '#f1e2bf'); inn.addColorStop(1, '#d9c393');
    disc(g, 0, 0, br * .86, inn);
  },

  glass(g, r) {
    const gr = g.createRadialGradient(-r * .25, -r * .3, r * .05, 0, 0, r);
    gr.addColorStop(0, 'rgba(225,250,255,.32)'); gr.addColorStop(.75, 'rgba(170,225,235,.16)'); gr.addColorStop(1, 'rgba(200,240,250,.45)');
    disc(g, 0, 0, r, gr);
    ring(g, 0, 0, r * .965, r * .07, 'rgba(235,252,255,.75)');
    ring(g, 0, 0, r * .62, 2, 'rgba(235,252,255,.35)');
    g.lineCap = 'round'; g.strokeStyle = 'rgba(255,255,255,.7)';
    g.lineWidth = r * .06; g.beginPath(); g.arc(0, 0, r * .8, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
    g.lineWidth = r * .03; g.beginPath(); g.arc(0, 0, r * .8, Math.PI * 1.55, Math.PI * 1.62); g.stroke();
  },

  wine(g, r) {
    const gr = g.createRadialGradient(-r * .25, -r * .3, r * .05, 0, 0, r);
    gr.addColorStop(0, 'rgba(255,235,242,.28)'); gr.addColorStop(.8, 'rgba(240,200,215,.14)'); gr.addColorStop(1, 'rgba(255,230,240,.4)');
    disc(g, 0, 0, r, gr);
    disc(g, r * .05, r * .08, r * .5, 'rgba(150,20,55,.3)');
    ring(g, 0, 0, r * .975, r * .035, 'rgba(255,245,250,.85)');
    disc(g, 0, 0, r * .12, 'rgba(255,255,255,.25)');
    ring(g, 0, 0, r * .12, 1.5, 'rgba(255,255,255,.5)');
    g.lineCap = 'round'; g.strokeStyle = 'rgba(255,255,255,.75)';
    g.lineWidth = r * .045; g.beginPath(); g.arc(0, 0, r * .84, Math.PI * 1.15, Math.PI * 1.42); g.stroke();
  },

  vase(g, r) {
    disc(g, 0, 0, r, radial(g, r, '#4f7bc4', '#1b3466'));
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = r * .025;
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * TAU;
      g.beginPath(); g.arc(Math.cos(a) * r * .86, Math.sin(a) * r * .86, r * .07, a + .6, a + Math.PI - .6); g.stroke();
    }
    ring(g, 0, 0, r * .74, r * .02, 'rgba(255,255,255,.45)');
    disc(g, 0, -r * .42, r * .21, '#d9e3f5');
    disc(g, 0, -r * .42, r * .16, '#0b162e');
  },

  teapot(g, r) {
    const br = r * .72;
    g.fillStyle = '#e7e1d5';
    g.beginPath();
    g.moveTo(br * .8, -r * .14); g.lineTo(r * .97, -r * .34); g.lineTo(r * .99, -r * .22); g.lineTo(br * .85, r * .14);
    g.closePath(); g.fill();
    g.lineWidth = r * .09; g.strokeStyle = '#e7e1d5'; g.lineCap = 'round';
    g.beginPath(); g.arc(-br * 1.03, 0, r * .16, Math.PI - 1.3, Math.PI + 1.3); g.stroke();
    disc(g, 0, 0, br, radial(g, br, '#f4f1ea', '#d7d0c2'));
    ring(g, 0, 0, br * .88, 3, '#3a7d6b');
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * TAU;
      disc(g, Math.cos(a) * br * .94, Math.sin(a) * br * .94, r * .018, '#3a7d6b');
    }
    ring(g, 0, -br * .5, r * .16, 1.5, 'rgba(58,125,107,.6)');
    disc(g, 0, -br * .5, r * .05, '#3a7d6b');
  }
};
