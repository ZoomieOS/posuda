import { NOTES } from './config/notes.js';
import { COMBO_WORDS } from './config/locations.js';
import { shuffled } from './lib/math.js';

const $ = id => document.getElementById(id);

export const el = {
  app: $('app'),
  canvas: $('c'),
  input: $('thought'),
  form: $('form'),
  toast: $('toast'),
  combo: $('combo'),
  note: $('note'),
  noteText: $('note-text'),
  noteClose: $('note-close'),
  count: $('count'),
  tray: document.querySelector('.tray'),
  mute: $('mute'),
  sweep: $('sweep'),
  dishChips: document.querySelectorAll('.chip'),
  locChips: document.querySelectorAll('.loc')
};

function flash(node, cls, ms, timerKey) {
  node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
  clearTimeout(flash[timerKey]);
  flash[timerKey] = setTimeout(() => node.classList.remove(cls), ms);
}

export function showToast(text) {
  el.toast.textContent = text;
  flash(el.toast, 'show', 1400, 'toast');
}

export function showCombo(n) {
  el.combo.textContent = COMBO_WORDS[Math.min(n, COMBO_WORDS.length - 1)] + ' ×' + n;
  flash(el.combo, 'show', 1500, 'combo');
}

/* Notes come in random order and don't repeat until all were shown */
const order = shuffled(NOTES.length);
let noteIdx = 0;
export function showNote() {
  el.noteText.textContent = NOTES[order[noteIdx % NOTES.length]];
  noteIdx++;
  el.note.hidden = false;
  el.noteClose.focus({ preventScroll: true });
}

export function setPressed(nodes, isOn) {
  nodes.forEach(n => n.setAttribute('aria-pressed', String(isOn(n))));
}
