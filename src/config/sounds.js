/*
  Голос каждой посуды.
  dur/decay/filter/freq/gain — шумовой «хруст»
  pings/pLo/pHi/pGain/pLen/spread/wave — звонкие осколки
  thud = [частота от, частота до, громкость, длина] — удар
  rattle  — осколки стучат по полу
  sparkle — стеклянный перезвон после удара
  ring    — «тинь» бокала перед ударом
  lid     — катящаяся крышка чайника
*/
export const SOUND = {
  plate:  { dur: .7,  decay: 3,   filter: 'highpass', freq: 900,  gain: .65, pings: 7,  pLo: 2200, pHi: 6500,  pGain: .09, pLen: [.12, .45], spread: .22, wave: 'triangle', thud: [160, 45, .45, .22] },
  bowl:   { dur: .5,  decay: 2.2, filter: 'bandpass', freq: 650,  gain: .9,  pings: 4,  pLo: 900,  pHi: 2200,  pGain: .08, pLen: [.08, .22], spread: .14, wave: 'sine',     thud: [110, 32, .8, .3], rattle: true },
  saucer: { dur: .45, decay: 4,   filter: 'highpass', freq: 2600, gain: .4,  pings: 11, pLo: 4200, pHi: 9500,  pGain: .07, pLen: [.06, .3],  spread: .3,  wave: 'sine',     thud: [260, 120, .12, .08] },
  mug:    { dur: .45, decay: 2.5, filter: 'bandpass', freq: 950,  gain: .8,  pings: 5,  pLo: 1400, pHi: 3200,  pGain: .08, pLen: [.08, .25], spread: .15, wave: 'triangle', thud: [140, 40, .6, .24], rattle: true },
  glass:  { dur: .9,  decay: 2.5, filter: 'highpass', freq: 3800, gain: .55, pings: 16, pLo: 5000, pHi: 11500, pGain: .06, pLen: [.15, .7],  spread: .5,  wave: 'sine',     thud: [320, 160, .1, .06], sparkle: true },
  wine:   { dur: 1.1, decay: 2.2, filter: 'highpass', freq: 4500, gain: .45, pings: 12, pLo: 6000, pHi: 12500, pGain: .05, pLen: [.3, 1.1],  spread: .4,  wave: 'sine',     thud: [400, 200, .06, .05], sparkle: true, ring: true },
  vase:   { dur: 1,   decay: 2,   filter: 'bandpass', freq: 700,  gain: 1,   pings: 8,  pLo: 1200, pHi: 4000,  pGain: .08, pLen: [.1, .4],   spread: .35, wave: 'triangle', thud: [90, 28, .9, .4], rattle: true },
  teapot: { dur: .8,  decay: 2.4, filter: 'bandpass', freq: 850,  gain: .9,  pings: 6,  pLo: 1500, pHi: 4200,  pGain: .08, pLen: [.1, .35],  spread: .25, wave: 'triangle', thud: [120, 35, .7, .3], rattle: true, lid: true }
};
