import photoUrl from '../assets/showroom.jpg';
import { clamp } from '../lib/math.js';

/* Photo of the Maserati showroom in Warsaw (number plate blurred) */
export const photo = new Image();
photo.src = photoUrl;

/* Where the pavement starts in the photo, as a fraction of its height */
const PAVEMENT_LINE = .8;
/* Horizontal focus: keep the sign and the car in frame on narrow screens */
const FOCUS_X = .42;

export function showroom(g, v) {
  const { W, H, floorTop } = v;
  g.fillStyle = '#1b1d22'; g.fillRect(0, 0, W, H);
  if (!photo.complete || !photo.naturalWidth) return;

  const iw = photo.naturalWidth, ih = photo.naturalHeight;
  const s = Math.max(W / iw, floorTop / (PAVEMENT_LINE * ih));
  const offY = floorTop - PAVEMENT_LINE * ih * s;
  const offX = clamp(W * .5 - FOCUS_X * iw * s, W - iw * s, 0);
  g.drawImage(photo, offX, offY, iw * s, ih * s);

  /* if the photo ends above the screen bottom, stretch its last strip of pavement */
  const bottom = offY + ih * s;
  if (bottom < H) g.drawImage(photo, 0, ih * .93, iw, ih * .07, offX, bottom - 1, iw * s, H - bottom + 1);

  /* darken the top so the light title stays readable, and the floor for depth */
  const shade = g.createLinearGradient(0, 0, 0, H * .34);
  shade.addColorStop(0, 'rgba(0,0,0,.62)'); shade.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = shade; g.fillRect(0, 0, W, H * .34);
  const low = g.createLinearGradient(0, floorTop, 0, H);
  low.addColorStop(0, 'rgba(0,0,0,0)'); low.addColorStop(1, 'rgba(0,0,0,.45)');
  g.fillStyle = low; g.fillRect(0, floorTop, W, H - floorTop);

  /* dishes hit the facade below the sign line */
  v.wallTopPx = Math.max(offY + ih * s * .28, H * .12);
}
