// icons.mjs — a tiny stroked-path icon set (no emoji, no icon fonts, renders identically
// in SVG and PDF). All icons are drawn inside a `s` x `s` box at (x, y).
import { C } from './theme.mjs';

const D = (p, d, o = {}) => p.path(d, {
  stroke: o.color ?? C.ink, strokeWidth: o.sw ?? 1.15, cap: 'round', join: 'round', opacity: o.opacity,
});

export const icons = {
  trend(p, x, y, s, o) { // arrow rising, with axis
    const c = o.color ?? C.sage;
    D(p, `M ${x} ${y + s} L ${x + s * 0.34} ${y + s * 0.55} L ${x + s * 0.6} ${y + s * 0.78} L ${x + s} ${y + s * 0.18}`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.72} ${y + s * 0.16} L ${x + s} ${y + s * 0.18} L ${x + s * 0.94} ${y + s * 0.46}`, { color: c, sw: o.sw });
  },
  pin(p, x, y, s, o) { // thumbtack
    const c = o.color ?? C.red;
    D(p, `M ${x + s * 0.36} ${y + s * 0.12} L ${x + s * 0.82} ${y + s * 0.58} M ${x + s * 0.59} ${y + s * 0.2} L ${x + s * 0.8} ${y + s * 0.41}`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.2} ${y + s * 0.44} L ${x + s * 0.56} ${y + s * 0.8}`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.1} ${y + s * 0.9} L ${x + s * 0.42} ${y + s * 0.58}`, { color: c, sw: o.sw });
    p.circle(x + s * 0.3, y + s * 0.3, s * 0.13, { stroke: c, strokeWidth: o.sw ?? 1.15 });
  },
  grid(p, x, y, s, o) {
    const c = o.color ?? C.navy; const g = s * 0.42;
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => {
      p.rect(x + i * (g + s * 0.16), y + j * (g + s * 0.16), g, g, { r: 1.4, stroke: c, strokeWidth: o.sw ?? 1.15 });
    });
  },
  calendar(p, x, y, s, o) {
    const c = o.color ?? C.gold;
    p.rect(x + s * 0.06, y + s * 0.14, s * 0.88, s * 0.8, { r: 2, stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.06} ${y + s * 0.38} L ${x + s * 0.94} ${y + s * 0.38}`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.28} ${y + s * 0.04} L ${x + s * 0.28} ${y + s * 0.22} M ${x + s * 0.72} ${y + s * 0.04} L ${x + s * 0.72} ${y + s * 0.22}`, { color: c, sw: o.sw });
    p.circle(x + s * 0.34, y + s * 0.6, s * 0.055, { fill: c });
    p.circle(x + s * 0.58, y + s * 0.6, s * 0.055, { fill: c });
  },
  globe(p, x, y, s, o) {
    const c = o.color ?? C.navy;
    p.circle(x + s / 2, y + s / 2, s * 0.44, { stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.06} ${y + s * 0.5} L ${x + s * 0.94} ${y + s * 0.5}`, { color: c, sw: o.sw });
    p.path(`M ${x + s * 0.5} ${y + s * 0.06} q ${s * 0.3} ${s * 0.44} 0 ${s * 0.88} q -${s * 0.3} -${s * 0.44} 0 -${s * 0.88} Z`, { stroke: c, strokeWidth: o.sw ?? 1.15 });
  },
  users(p, x, y, s, o) {
    const c = o.color ?? C.plum;
    p.circle(x + s * 0.36, y + s * 0.32, s * 0.19, { stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.06} ${y + s * 0.92} q ${s * 0.3} -${s * 0.38} ${s * 0.6} 0`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.62} ${y + s * 0.16} a ${s * 0.19} ${s * 0.19} 0 1 1 0.001 0`, { color: c, sw: o.sw });
    D(p, `M ${x + s * 0.68} ${y + s * 0.92} q ${s * 0.26} -${s * 0.3} ${s * 0.28} 0`, { color: c, sw: o.sw });
  },
  bookmark(p, x, y, s, o) {
    const c = o.color ?? C.red;
    p.path(`M ${x + s * 0.18} ${y + s * 0.08} L ${x + s * 0.82} ${y + s * 0.08} L ${x + s * 0.82} ${y + s * 0.94} L ${x + s * 0.5} ${y + s * 0.7} L ${x + s * 0.18} ${y + s * 0.94} Z`,
      { stroke: c, strokeWidth: o.sw ?? 1.15, join: 'round' });
  },
  cursor(p, x, y, s, o) {
    const c = o.color ?? C.clay;
    p.path(`M ${x + s * 0.16} ${y + s * 0.06} L ${x + s * 0.82} ${y + s * 0.5} L ${x + s * 0.5} ${y + s * 0.56} L ${x + s * 0.36} ${y + s * 0.92} Z`,
      { stroke: c, strokeWidth: o.sw ?? 1.15, join: 'round' });
  },
  target(p, x, y, s, o) {
    const c = o.color ?? C.crimson;
    p.circle(x + s / 2, y + s / 2, s * 0.44, { stroke: c, strokeWidth: o.sw ?? 1.15 });
    p.circle(x + s / 2, y + s / 2, s * 0.22, { stroke: c, strokeWidth: o.sw ?? 1.15 });
    p.circle(x + s / 2, y + s / 2, s * 0.06, { fill: c });
  },
  clock(p, x, y, s, o) {
    const c = o.color ?? C.sage;
    p.circle(x + s / 2, y + s / 2, s * 0.44, { stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.5} ${y + s * 0.26} L ${x + s * 0.5} ${y + s * 0.54} L ${x + s * 0.68} ${y + s * 0.66}`, { color: c, sw: o.sw });
  },
  doc(p, x, y, s, o) {
    const c = o.color ?? C.navy;
    p.rect(x + s * 0.16, y + s * 0.06, s * 0.68, s * 0.88, { r: 2, stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.3} ${y + s * 0.34} L ${x + s * 0.7} ${y + s * 0.34} M ${x + s * 0.3} ${y + s * 0.52} L ${x + s * 0.7} ${y + s * 0.52} M ${x + s * 0.3} ${y + s * 0.7} L ${x + s * 0.55} ${y + s * 0.7}`, { color: c, sw: o.sw });
  },
  spark(p, x, y, s, o) {
    const c = o.color ?? C.gold;
    p.path(`M ${x + s / 2} ${y + s * 0.06} L ${x + s * 0.6} ${y + s * 0.4} L ${x + s * 0.94} ${y + s / 2} L ${x + s * 0.6} ${y + s * 0.6} L ${x + s / 2} ${y + s * 0.94} L ${x + s * 0.4} ${y + s * 0.6} L ${x + s * 0.06} ${y + s / 2} L ${x + s * 0.4} ${y + s * 0.4} Z`,
      { fill: c });
  },
  check(p, x, y, s, o) {
    D(p, `M ${x + s * 0.14} ${y + s * 0.55} L ${x + s * 0.42} ${y + s * 0.8} L ${x + s * 0.88} ${y + s * 0.2}`, { color: o.color ?? '#2F6B4F', sw: o.sw ?? 1.6 });
  },
  arrowUp(p, x, y, s, o) {
    const c = o.color ?? '#2F6B4F';
    p.path(`M ${x + s / 2} ${y + s} L ${x + s / 2} ${y + s * 0.18} M ${x + s * 0.2} ${y + s * 0.46} L ${x + s / 2} ${y + s * 0.12} L ${x + s * 0.8} ${y + s * 0.46}`,
      { stroke: c, strokeWidth: o.sw ?? 1.3, cap: 'round' });
  },
  arrowDown(p, x, y, s, o) {
    const c = o.color ?? '#A83348';
    p.path(`M ${x + s / 2} ${y} L ${x + s / 2} ${y + s * 0.82} M ${x + s * 0.2} ${y + s * 0.54} L ${x + s / 2} ${y + s * 0.88} L ${x + s * 0.8} ${y + s * 0.54}`,
      { stroke: c, strokeWidth: o.sw ?? 1.3, cap: 'round' });
  },
  bars(p, x, y, s, o) {
    const c = o.color ?? C.navy;
    [[0, 0.44], [0.34, 0.18], [0.68, 0.66]].forEach(([fx, fy]) => {
      p.rect(x + s * (0.08 + fx * 0.86), y + s * (0.1 + fy * 0.8), s * 0.2, s * (0.86 - fy * 0.8), { r: 1.2, fill: c });
    });
  },
  mail(p, x, y, s, o) {
    const c = o.color ?? C.red;
    p.rect(x + s * 0.05, y + s * 0.16, s * 0.9, s * 0.68, { r: 2, stroke: c, strokeWidth: o.sw ?? 1.15 });
    D(p, `M ${x + s * 0.08} ${y + s * 0.22} L ${x + s * 0.5} ${y + s * 0.56} L ${x + s * 0.92} ${y + s * 0.22}`, { color: c, sw: o.sw });
  },
  rupee(p, x, y, s, o) {
    const c = o.color ?? C.gold;
    D(p, `M ${x + s * 0.26} ${y + s * 0.12} L ${x + s * 0.76} ${y + s * 0.12} M ${x + s * 0.26} ${y + s * 0.36} L ${x + s * 0.76} ${y + s * 0.36} M ${x + s * 0.5} ${y + s * 0.12} q 0 ${s * 0.24} -${s * 0.24} ${s * 0.24} L ${x + s * 0.26} ${y + s * 0.36} M ${x + s * 0.26} ${y + s * 0.36} L ${x + s * 0.74} ${y + s * 0.88}`,
      { color: c, sw: o.sw ?? 1.3 });
  },
};

export function icon(name, p, x, y, s, o = {}) {
  const fn = icons[name];
  if (fn) fn(p, x, y, s, o);
  return p;
}
