import { rand } from './lib/math.js';
import { SOUND } from './config/sounds.js';

let ac = null;
let muted = false;

export function ensureAudio() {
  if (!ac) {
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; }
  }
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
}

export function toggleMuted() { muted = !muted; return muted; }

const ok = () => ac && !muted;

function noise(dur, pow) {
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, pow);
  const src = ac.createBufferSource(); src.buffer = buf;
  return src;
}

function ping(freq, start, len, gain, wave) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = wave || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + .004);
  g.gain.exponentialRampToValueAtTime(.0001, start + len);
  o.connect(g).connect(ac.destination); o.start(start); o.stop(start + len + .05);
}

export function whoosh() {
  if (!ok()) return;
  const src = noise(.35, 1), bp = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
  bp.type = 'bandpass'; bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(2200, t + .35);
  g.gain.value = .12;
  src.connect(bp).connect(g).connect(ac.destination); src.start(t);
}

export function swish() {
  if (!ok()) return;
  const t = ac.currentTime;
  for (let k = 0; k < 3; k++) {
    const src = noise(.25, 1.5), bp = ac.createBiquadFilter(), g = ac.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = .8; g.gain.value = .25;
    src.connect(bp).connect(g).connect(ac.destination); src.start(t + k * .12);
  }
  for (let k = 0; k < 6; k++) ping(rand(2500, 6000), t + rand(.05, .4), .12, .03);
}

export function tink(n) {
  if (!ok()) return;
  const t = ac.currentTime;
  for (let k = 0; k < n; k++) ping(rand(3000, 7000), t + k * .04, rand(.08, .18), .07);
}

export function chime() {
  if (!ok()) return;
  const t = ac.currentTime;
  [784, 988, 1175, 1568].forEach((f, i) => ping(f, t + i * .09, .9, .08));
}

/* A short meow followed by a soft purr; pitch makes each cat sound different */
export function meow(pitch = 1) {
  if (!ok()) return;
  const t = ac.currentTime, o = ac.createOscillator(), lp = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(520 * pitch, t);
  o.frequency.linearRampToValueAtTime(820 * pitch, t + .16);
  o.frequency.exponentialRampToValueAtTime(430 * pitch, t + .55);
  lp.type = 'lowpass'; lp.Q.value = 6;
  lp.frequency.setValueAtTime(900 * pitch, t);
  lp.frequency.linearRampToValueAtTime(2200 * pitch, t + .18);
  lp.frequency.linearRampToValueAtTime(800 * pitch, t + .55);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .6);
  o.connect(lp).connect(g).connect(ac.destination); o.start(t); o.stop(t + .65);

  const pn = noise(1.3, .4), plp = ac.createBiquadFilter(), pg = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
  plp.type = 'lowpass'; plp.frequency.value = 260; pg.gain.value = 0;
  lfo.frequency.value = 24; lg.gain.value = .22; lfo.connect(lg).connect(pg.gain);
  pn.connect(plp).connect(pg).connect(ac.destination);
  pn.start(t + .55); lfo.start(t + .55); lfo.stop(t + 1.9);
}

export function crash(type) {
  if (!ok()) return;
  const S = SOUND[type] || SOUND.plate, t = ac.currentTime;
  if (S.ring) ping(rand(1700, 2400), t, 1.6, .06);

  const src = noise(S.dur, S.decay), f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = S.filter; f.frequency.value = S.freq;
  if (S.filter === 'bandpass') f.Q.value = .7;
  g.gain.value = S.gain;
  src.connect(f).connect(g).connect(ac.destination); src.start(t);

  for (let k = 0; k < S.pings; k++) ping(rand(S.pLo, S.pHi), t + rand(0, S.spread), rand(S.pLen[0], S.pLen[1]), S.pGain, S.wave);

  const [f0, f1, tg0, tl] = S.thud, th = ac.createOscillator(), tg = ac.createGain();
  th.frequency.setValueAtTime(f0, t); th.frequency.exponentialRampToValueAtTime(f1, t + tl * .7);
  tg.gain.setValueAtTime(tg0, t); tg.gain.exponentialRampToValueAtTime(.0001, t + tl);
  th.connect(tg).connect(ac.destination); th.start(t); th.stop(t + tl + .05);

  if (S.rattle) for (let k = 0; k < 5; k++) {
    const st = t + .28 + k * rand(.05, .11), n = noise(.05, 2), bp = ac.createBiquadFilter(), ng = ac.createGain();
    bp.type = 'bandpass'; bp.frequency.value = rand(700, 1600); bp.Q.value = 3; ng.gain.value = .5 * (1 - k / 6);
    n.connect(bp).connect(ng).connect(ac.destination); n.start(st);
  }
  if (S.sparkle) for (let k = 0; k < 10; k++) ping(rand(6000, 12000), t + .35 + rand(0, .6), rand(.05, .15), .03);
  if (S.lid) {
    let st = t + .45;
    for (let k = 0; k < 7; k++) { ping(rand(1000, 1300), st, .09, .06, 'triangle'); st += .13 * (1 - k / 9); }
  }
}
