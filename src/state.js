/* Shared, mutable game state. Modules read and write fields; nobody reassigns these objects. */

export const view = {
  W: 0, H: 0, dpr: 1,
  R: 100,          // base dish radius in CSS px
  floorTop: 0,     // y where the floor starts
  wallTopPx: 0,    // highest y a dish may hit
  reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
};

export const world = {
  shards: [],
  dust: [],
  marks: [],
  hearts: [],
  cats: [],
  shake: 0
};
