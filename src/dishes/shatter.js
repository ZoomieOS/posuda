import { DISH } from '../config/dishes.js';
import { rand, TAU } from '../lib/math.js';

/*
  Cuts a disc of radius r into polygons: n radial sectors,
  each split into an inner triangle, a middle band and an outer rim piece.
*/
export function makeShards(r, type, reduceMotion) {
  const [lo, hi] = DISH[type].shards;
  const n = reduceMotion ? 6 : Math.floor(rand(lo, hi)), base = rand(0, TAU), polys = [];
  const A = [], ri = [], rm = [];
  for (let i = 0; i < n; i++) {
    A.push(base + (i + rand(-.3, .3)) / n * TAU);
    ri.push(r * rand(.25, .45));
    rm.push(r * rand(.6, .8));
  }
  const P = (rad, a) => [Math.cos(a) * rad, Math.sin(a) * rad];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a0 = A[i], a1 = j === 0 ? A[0] + TAU : A[j];
    polys.push([[0, 0], P(ri[i], a0), P(ri[j], a1)]);
    polys.push([P(ri[i], a0), P(rm[i], a0), P(rm[j], a1), P(ri[j], a1)]);
    const outer = [P(rm[i], a0)];
    for (let k = 0; k <= 4; k++) outer.push(P(r + 1, a0 + (a1 - a0) * k / 4));
    outer.push(P(rm[j], a1));
    polys.push(outer);
  }
  return polys.map(p => ({
    p,
    cx: p.reduce((s, q) => s + q[0], 0) / p.length,
    cy: p.reduce((s, q) => s + q[1], 0) / p.length
  }));
}
