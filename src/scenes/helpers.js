export function vignette(g, v, a) {
  const { W, H } = v;
  const vg = g.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .3, W / 2, H * .45, Math.max(W, H) * .8);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
}

/* Perspective lines on the floor; rows adds horizontal tile seams */
export function floorLines(g, v, col, rows) {
  const { W, H, floorTop } = v;
  g.strokeStyle = col; g.lineWidth = 1;
  for (let i = -10; i <= 10; i++) {
    g.beginPath(); g.moveTo(W / 2 + i * W * .06, floorTop); g.lineTo(W / 2 + i * W * .22, H); g.stroke();
  }
  if (rows) for (let k = 1; k < 9; k++) {
    const y = floorTop + (H - floorTop) * Math.pow(k / 9, 1.6);
    g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
  }
}
