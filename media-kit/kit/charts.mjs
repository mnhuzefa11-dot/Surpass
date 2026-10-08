// charts.mjs — reusable, hand-built chart primitives (no chart library).
// Each function works on both canvases: `p` is an SvgCanvas or PdfCanvas.
import { polar, arcPath, ringSlice } from './canvas.mjs';
import { C, FONTS, lighten, darken, mix } from './theme.mjs';

const css = (k) => FONTS[k].css;
const wt = (k) => FONTS[k].weight;

/* --------------------------------- text helpers -------------------------------- */

export function label(p, str, x, y, o = {}) {
  const f = o.font ?? 'M600';
  return p.text(str, x, y, {
    font: f, size: o.size ?? 7.5, color: o.color ?? C.muted,
    tracking: o.tracking ?? 1.5, align: o.align, baseline: o.baseline,
    css: css(f), weight: o.weight ?? wt(f),
  });
}

export function body(p, str, x, y, o = {}) {
  const f = o.font ?? 'M400';
  return p.text(str, x, y, {
    font: f, size: o.size ?? 9.5, color: o.color ?? C.inkSoft, align: o.align,
    baseline: o.baseline, css: css(f), weight: o.weight ?? wt(f), tracking: o.tracking ?? 0,
  });
}

export function head(p, str, x, y, o = {}) {
  const f = o.font ?? 'P700';
  return p.text(str, x, y, {
    font: f, size: o.size ?? 22, color: o.color ?? C.ink, align: o.align,
    baseline: o.baseline, css: css(f), weight: o.weight ?? wt(f), tracking: o.tracking ?? -0.2,
  });
}

/* ----------------------------------- cards ------------------------------------ */

export function card(p, x, y, w, h, o = {}) {
  if (o.fill !== 'none') {
    p.rect(x, y, w, h, { r: o.r ?? 12, fill: o.fill ?? '#FAF8F5', stroke: o.stroke ?? '#EFEAE3', strokeWidth: o.strokeWidth ?? 0.8 });
  }
  if (o.accent) {
    // thin accent bar along the left edge
    p.rect(x, y + 1, 3, h - 2, { r: 1.5, fill: o.accent });
  }
  return p;
}

export function chip(p, x, y, text, o = {}) {
  const f = o.font ?? 'M700';
  const size = o.size ?? 7;
  const padX = o.padX ?? 6.5;
  const h = o.h ?? 15;
  const tw = p.measure(text, f, size, o.tracking ?? 0.9);
  const w = tw + padX * 2;
  p.rect(x, y, w, h, { r: h / 2, fill: o.fill ?? C.sand, stroke: o.stroke });
  p.text(text, x + w / 2, y + h / 2 + 0.2, {
    font: f, size, color: o.color ?? C.inkSoft, align: 'center', baseline: 'middle',
    tracking: o.tracking ?? 0.9, css: css(f), weight: o.weight ?? wt(f),
  });
  return w;
}

export function deltaChip(p, x, y, value, o = {}) {
  const up = value >= 0;
  const text = `${Math.abs(value).toFixed(1)}%`;
  const size = o.size ?? 7;
  const h = o.h ?? 15;
  const w = p.measure(text, 'M700', size, 0.4) + 27;
  p.rect(x, y, w, h, { r: h / 2, fill: up ? '#EAF3EC' : '#FBEBEE' });
  const c = up ? '#2F6B4F' : '#A83348';
  const bx = x + 8, by = y + h / 2;
  if (up) {
    p.path(`M ${bx} ${by + 2.6} L ${bx} ${by - 1.4} M ${bx - 2.4} ${by + 0.6} L ${bx} ${by - 2.8} L ${bx + 2.4} ${by + 0.6}`,
      { stroke: c, strokeWidth: 1.1, cap: 'round' });
  } else {
    p.path(`M ${bx} ${by - 2.6} L ${bx} ${by + 1.4} M ${bx - 2.4} ${by - 0.6} L ${bx} ${by + 2.8} L ${bx + 2.4} ${by - 0.6}`,
      { stroke: c, strokeWidth: 1.1, cap: 'round' });
  }
  p.text(text, x + 18, by + 0.2, {
    font: 'M700', size, color: c, baseline: 'middle', tracking: 0.3, css: css('M700'), weight: 700,
  });
  return w;
}

/* --------------------------------- sparklines --------------------------------- */

function smoothPath(pts, tension = 0.22) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

export function sparkline(p, x, y, w, h, values, o = {}) {
  const color = o.color ?? C.red;
  const min = Math.min(...values), max = Math.max(...values);
  const span = (max - min) || 1;
  const pts = values.map((v, i) => [
    x + (i / (values.length - 1)) * w,
    y + h - ((v - min) / span) * (h - 2) - 1,
  ]);
  const line = smoothPath(pts);
  const area = `${line} L ${(x + w).toFixed(2)} ${(y + h).toFixed(2)} L ${x.toFixed(2)} ${(y + h).toFixed(2)} Z`;
  if (o.area !== false) {
    p.path(area, { fill: color, fillOpacity: o.areaOpacity ?? 0.13 });
  }
  p.path(line, { stroke: color, strokeWidth: o.width ?? 1.4, cap: 'round', join: 'round', opacity: o.opacity ?? 1 });
  if (o.endDot !== false) {
    p.circle(pts[pts.length - 1][0], pts[pts.length - 1][1], o.dotR ?? 1.9, { fill: color });
  }
  return pts;
}

/* ---------------------------------- bar charts -------------------------------- */

/** Horizontal bar with track. Returns the row height used. */
export function hBar(p, x, y, w, o = {}) {
  const { name, value, max, pct, color = C.red, valueText, sub } = o;
  const labelW = o.labelW ?? 118;
  const h = o.h ?? 16;
  const barX = x + labelW;
  const barW = w - labelW - (o.valueW ?? 62);
  const frac = max ? value / max : 1;
  p.text(name, x, y + h - 4.6, { font: 'M600', size: o.size ?? 9.4, color: C.ink, css: css('M600'), weight: 600, tracking: -0.1 });
  if (sub) p.text(sub, x, y + h + 6, { font: 'M400', size: 7.4, color: C.faint, css: css('M400'), weight: 400 });
  p.rect(barX, y + 1.5, barW, h - 3, { r: (h - 3) / 2, fill: C.hair2 });
  const fw = Math.max(2.2, barW * frac);
  p.rect(barX, y + 1.5, fw, h - 3, {
    r: Math.min((h - 3) / 2, fw / 2),
    grad: { from: lighten(color, 0.22), to: color, angle: 0 },
  });
  p.text(valueText ?? String(value), x + w, y + h - 4.6, {
    font: 'M700', size: o.size ?? 9.4, color: C.ink, align: 'right', css: css('M700'), weight: 700, tracking: -0.1,
  });
  if (pct != null) {
    p.text(pct, x + w, y + h + 6, { font: 'M500', size: 7.4, color: C.faint, align: 'right', css: css('M500'), weight: 500 });
  }
  return h;
}

export function vBars(p, x, y, w, h, items, o = {}) {
  const gap = o.gap ?? 6;
  const bw = (w - gap * (items.length - 1)) / items.length;
  const max = Math.max(...items.map((i) => i.value));
  items.forEach((it, i) => {
    const bh = Math.max(2, (it.value / max) * h);
    const bx = x + i * (bw + gap);
    p.rect(bx, y, bw, h, { r: 3, fill: C.hair2 });
    const col = o.color ?? C.navy;
    p.rect(bx, y + h - bh, bw, bh, {
      r: Math.min(3, bw / 2),
      grad: { from: lighten(col, 0.28), to: col, angle: 0 },
    });
    p.text(it.label, bx + bw / 2, y + h + 12, { font: 'M600', size: 7.4, color: C.muted, align: 'center', css: css('M600'), weight: 600 });
    if (o.showValues !== false) {
      p.text(`${it.pct ?? it.value}%`, bx + bw / 2, y + h - bh - 6, {
        font: 'M700', size: 7.6, color: C.inkSoft, align: 'center', css: css('M700'), weight: 700,
      });
    }
  });
  return h + 20;
}

/* ----------------------------------- donuts ----------------------------------- */

export function donut(p, cx, cy, rOuter, rInner, segments, o = {}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let a = o.start ?? 0;
  const gapDeg = o.gapDeg ?? 1.6;
  segments.forEach((seg) => {
    const sweep = (seg.value / total) * 360;
    const a0 = a + gapDeg / 2;
    const a1 = a + sweep - gapDeg / 2;
    if (a1 > a0) p.path(ringSlice(cx, cy, rOuter, rInner, a0, a1), { fill: seg.color ?? C.red });
    a += sweep;
  });
  if (o.track) {
    p.path(ringSlice(cx, cy, rOuter, rInner, 0, 359.9), { stroke: C.hair2, strokeWidth: 1 });
  }
  if (o.center) {
    const [l1, l2] = o.center;
    p.text(l1, cx, cy + (o.centerDy1 ?? -1), {
      font: 'M800', size: o.centerSize ?? 17, color: C.ink, align: 'center', baseline: 'middle',
      tracking: -0.4, css: css('M800'), weight: 800,
    });
    if (l2) p.text(l2, cx, cy + (o.centerDy2 ?? 12), {
      font: 'M600', size: 6.6, color: C.faint, align: 'center', baseline: 'middle',
      tracking: 1.2, css: css('M600'), weight: 600,
    });
  }
  return p;
}

/* ---------------------------------- line chart -------------------------------- */

export function lineChart(p, x, y, w, h, o = {}) {
  const { series, xLabels, yMax, yTicks = 4, formatY } = o;
  const padL = o.padL ?? 34, padB = 18, padT = 8, padR = 8;
  const plotW = w - padL - padR, plotH = h - padB - padT;
  const n = xLabels.length;
  const X = (i) => x + padL + (i / (n - 1)) * plotW;
  const Y = (v) => y + padT + plotH - (v / yMax) * plotH;

  /* grid */
  for (let t = 0; t <= yTicks; t++) {
    const v = (yMax / yTicks) * t;
    const gy = Y(v);
    p.line(x + padL, gy, x + padL + plotW, gy, { stroke: t === 0 ? C.hair : C.hair2, width: t === 0 ? 0.9 : 0.7 });
    p.text(formatY ? formatY(v) : String(Math.round(v)), x + padL - 7, gy, {
      font: 'M500', size: 6.6, color: C.faint, align: 'right', baseline: 'middle', css: css('M500'), weight: 500,
    });
  }
  /* x labels */
  const every = o.labelEvery ?? Math.ceil(n / 12);
  xLabels.forEach((lb, i) => {
    if (i % every !== 0 && i !== n - 1) return;
    p.text(lb, X(i), y + h - padB + 11, {
      font: 'M500', size: 6.6, color: C.faint, align: i === n - 1 && o.labelEvery ? 'right' : 'center',
      css: css('M500'), weight: 500,
    });
  });
  /* series */
  series.forEach((s) => {
    const pts = s.values.map((v, i) => [X(i), Y(v)]);
    const line = smoothPath(pts, 0.2);
    if (s.area) {
      p.path(`${line} L ${pts[pts.length - 1][0].toFixed(2)} ${Y(0).toFixed(2)} L ${pts[0][0].toFixed(2)} ${Y(0).toFixed(2)} Z`,
        { fill: s.color, fillOpacity: s.areaOpacity ?? 0.10 });
    }
    p.path(line, { stroke: s.color, strokeWidth: s.width ?? 1.8, cap: 'round', join: 'round', dash: s.dash });
    if (s.dots) pts.forEach((pt) => p.circle(pt[0], pt[1], 1.6, { fill: s.color }));
    if (s.endDot !== false) {
      const last = pts[pts.length - 1];
      p.circle(last[0], last[1], 3.4, { fill: s.color, fillOpacity: 0.18 });
      p.circle(last[0], last[1], 1.9, { fill: s.color });
    }
  });
  return { X, Y };
}

/* ---------------------------------- heatmap ----------------------------------- */

export function heatmap(p, x, y, w, h, rows, o = {}) {
  const cols = rows[0].length;
  const gap = o.gap ?? 2;
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows.length - 1)) / rows.length;
  const max = o.max ?? Math.max(...rows.flat());
  rows.forEach((row, r) => row.forEach((v, c) => {
    const t = max ? v / max : 0;
    const fill = o.color ?? C.red;
    p.rect(x + c * (cw + gap), y + r * (ch + gap), cw, ch, { r: 1.4, fill, fillOpacity: 0.10 + t * 0.85 });
  }));
  return { cellW: cw, cellH: ch, gap };
}

/* ------------------------------- progress ring -------------------------------- */

export function ringMeter(p, cx, cy, r, frac, o = {}) {
  p.path(arcPath(cx, cy, r, 0, 359.9), { stroke: o.track ?? C.hair2, strokeWidth: o.width ?? 5, cap: 'round' });
  p.path(arcPath(cx, cy, r, 0, Math.max(2, frac * 359.9)), {
    stroke: o.color ?? C.red, strokeWidth: o.width ?? 5, cap: 'round',
  });
}

export { polar, arcPath, ringSlice };
