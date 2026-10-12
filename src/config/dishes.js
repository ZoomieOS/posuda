/*
  Посуда.
  k      — размер относительно тарелки
  ink    — цвет текста
  shards — сколько секторов при разбивании [min, max]
  glass  — прозрачная (стекло)
  tr     — какую часть радиуса может занимать текст
  ty     — сдвиг текста по вертикали (доля радиуса)
*/
export const DISH = {
  plate:  { k: 1,   ink: '#22314d', shards: [8, 12] },
  bowl:   { k: .86, ink: '#3b2a1e', shards: [6, 9] },
  saucer: { k: .72, ink: '#4a2a35', shards: [8, 11] },
  mug:    { k: .7,  ink: '#4a3510', shards: [6, 9],   tr: .7 },
  glass:  { k: .62, ink: '#f4fdff', shards: [12, 16], glass: true },
  wine:   { k: .66, ink: '#fff5f8', shards: [12, 17], glass: true, tr: .9 },
  vase:   { k: .82, ink: '#f4f7ff', shards: [9, 13],  tr: .8, ty: .16 },
  teapot: { k: .95, ink: '#24453b', shards: [8, 12],  tr: .66, ty: .1 }
};

/* Посуда, на которой текст светлый и нужна тень */
export const isLightInk = type => !!DISH[type].glass || type === 'vase';

/* Посуда, которая трясёт экран сильнее */
export const HEAVY = new Set(['vase', 'teapot']);
