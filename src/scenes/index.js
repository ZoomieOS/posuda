import { LOC } from '../config/locations.js';
import { kitchen } from './kitchen.js';
import { showroom, photo } from './showroom.js';
import { roof } from './roof.js';

const SCENES = { kitchen, showroom, roof };

/* Paints the location into an offscreen canvas and sets view.wallTopPx */
export function renderScene(loc, v) {
  const bg = document.createElement('canvas');
  bg.width = v.W * v.dpr; bg.height = v.H * v.dpr;
  const g = bg.getContext('2d');
  g.scale(v.dpr, v.dpr);
  v.wallTopPx = v.H * LOC[loc].wallTop;
  SCENES[loc](g, v);
  return bg;
}

/* Calls back when a location's image finishes loading */
export function onSceneAssetReady(cb) {
  photo.addEventListener('load', () => cb('showroom'));
}
