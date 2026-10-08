// canvas.mjs — one drawing API, two backends: SVG (for the HTML preview) and PDF (via PDFKit).
// Every page is composed by the same code, so the preview and the PDF are identical.
import { textWidth, baselineY } from './metrics.mjs';

/* ---------------------------------- helpers --------------------------------- */

export function polar(cx, cy, r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Arc as cubic-bezier segments (avoids SVG 'A' which PDFKit can't parse). */
export function arcPath(cx, cy, r, a0, a1) {
  let sweep = a1 - a0;
  if (Math.abs(sweep) >= 359.999) sweep = 359.999 * Math.sign(sweep || 1);
  const steps = Math.max(1, Math.ceil(Math.abs(sweep) / 90));
  const step = (sweep * Math.PI / 180) / steps;
  const [sx, sy] = polar(cx, cy, r, a0);
  let d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  let ang = (a0 - 90) * Math.PI / 180;
  const k = 4 / 3 * Math.tan(step / 4);
  let [px, py] = [sx, sy];
  for (let i = 0; i < steps; i++) {
    const a2 = ang + step;
    const [ex, ey] = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
    const c1 = [px - k * r * Math.sin(ang), py + k * r * Math.cos(ang)];
    const c2 = [ex + k * r * Math.sin(a2), ey - k * r * Math.cos(a2)];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
    [px, py] = [ex, ey];
    ang = a2;
  }
  return d;
}

/** Donut / ring slice path (a0 -> a1, degrees clockwise from 12 o'clock). */
export function ringSlice(cx, cy, rOuter, rInner, a0, a1) {
  const outer = arcPath(cx, cy, rOuter, a0, a1);
  const inner = arcPath(cx, cy, rInner, a1, a0);
  const [ix, iy] = polar(cx, cy, rInner, a1);
  const innerCmds = inner.replace(/^\s*M\s*-?[\d.]+\s+-?[\d.]+\s*/, '');
  return `${outer} L ${ix.toFixed(2)} ${iy.toFixed(2)} ${innerCmds} Z`;
}

function gradEndpoints(x, y, w, h, angle = 90) {
  const a = angle * Math.PI / 180;
  const cx = x + w / 2, cy = y + h / 2;
  const len = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a));
  const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
  return [cx - dx, cy - dy, cx + dx, cy + dy];
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* --------------------------------- SVG canvas -------------------------------- */

let gradSeq = 0;

export class SvgCanvas {
  constructor({ width, height, background = '#FFFFFF' }) {
    this.width = width; this.height = height; this.bg = background;
    this.body = []; this.defs = []; this.id = 'p' + (++SvgCanvas.count);
    this.hasClip = false;
  }
  measure(str, font, size, tracking = 0) { return textWidth(str, font, size, tracking); }
  _grad(g) {
    const [x1, y1, x2, y2] = gradEndpoints(g.x, g.y, g.w, g.h, g.angle ?? 90);
    const id = `g${++gradSeq}`;
    this.defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/></linearGradient>`);
    return `url(#${id})`;
  }
  rect(x, y, w, h, o = {}) {
    let fill = o.fill;
    if (o.grad) fill = this._grad({ ...o.grad, x, y, w, h });
    const rr = o.r ? Math.min(o.r, Math.abs(w) / 2, Math.abs(h) / 2) : 0;
    const r = rr ? ` rx="${rr.toFixed(2)}" ry="${rr.toFixed(2)}"` : '';
    if (!fill && !o.stroke) return this;
    this.body.push(`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${Math.max(0, w).toFixed(2)}" height="${Math.max(0, h).toFixed(2)}"${r}` +
      (fill ? ` fill="${fill}"` : ' fill="none"') +
      (o.fillOpacity != null ? ` fill-opacity="${o.fillOpacity}"` : '') +
      (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.strokeWidth ?? 1}"` : '') +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') + '/>');
    return this;
  }
  line(x1, y1, x2, y2, o = {}) {
    this.body.push(`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${o.stroke ?? '#000'}" stroke-width="${o.width ?? 1}"` +
      (o.dash ? ` stroke-dasharray="${o.dash}"` : '') + (o.cap ? ` stroke-linecap="${o.cap}"` : '') +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') + '/>');
    return this;
  }
  path(d, o = {}) {
    let fill = o.fill;
    if (o.grad) {
      // gradient over the path bbox is approximated by the caller-supplied box
      fill = this._grad({ ...o.grad, x: o.grad.x ?? 0, y: o.grad.y ?? 0, w: o.grad.w ?? this.width, h: o.grad.h ?? this.height });
    }
    this.body.push(`<path d="${d}" fill="${fill ?? 'none'}"` +
      (o.fillOpacity != null ? ` fill-opacity="${o.fillOpacity}"` : '') +
      (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.strokeWidth ?? 1}"` : '') +
      (o.cap ? ` stroke-linecap="${o.cap}"` : '') + (o.join ? ` stroke-linejoin="${o.join}"` : '') +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') + '/>');
    return this;
  }
  circle(cx, cy, r, o = {}) {
    this.body.push(`<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${o.fill ?? 'none'}"` +
      (o.fillOpacity != null ? ` fill-opacity="${o.fillOpacity}"` : '') +
      (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.strokeWidth ?? 1}"` : '') +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') + '/>');
    return this;
  }
  text(str, x, y, o = {}) {
    if (str == null || str === '') return this;
    const anchor = o.align === 'center' ? 'middle' : o.align === 'right' ? 'end' : 'start';
    const fam = o.css; const w = o.weight ?? 400;
    const by = baselineY(y, o.font, o.size, o.baseline);
    const dy = '';
    const ls = o.tracking ? ` letter-spacing="${o.tracking}"` : '';
    this.body.push(`<text x="${x.toFixed(2)}" y="${by.toFixed(2)}" font-family=${JSON.stringify(fam)} font-size="${o.size}" font-weight="${w}"${ls}${dy} fill="${o.color ?? '#111'}" text-anchor="${anchor}"` +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') +
      (o.italic ? ' font-style="italic"' : '') + `>${esc(str)}</text>`);
    return this;
  }
  image(dataUrl, x, y, w, h, o = {}) {
    this.body.push(`<image x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" href="${dataUrl}" preserveAspectRatio="xMidYMid meet"` +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') + '/>');
    return this;
  }
  /** Run `fn` inside a rotation about (cx, cy). */
  rotated(cx, cy, deg, fn) {
    this.body.push(`<g transform="rotate(${deg} ${cx.toFixed(2)} ${cy.toFixed(2)})">`);
    fn();
    this.body.push('</g>');
    return this;
  }
  toSvg(extraStyle = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" width="${this.width}" height="${this.height}" shape-rendering="geometricPrecision">
<defs><style>${extraStyle}</style>${this.defs.join('')}</defs>
<rect x="0" y="0" width="${this.width}" height="${this.height}" fill="${this.bg}"/>
${this.body.join('\n')}
</svg>`;
  }
}
SvgCanvas.count = 0;

/* --------------------------------- PDF canvas -------------------------------- */

export class PdfCanvas {
  constructor(doc, { width, height, background = '#FFFFFF' }) {
    this.doc = doc; this.width = width; this.height = height;
    doc.addPage({ size: [width, height], margin: 0 });
    this.page = doc.page;
    doc.rect(0, 0, width, height).fill(background);
  }
  measure(str, font, size, tracking = 0) { return textWidth(str, font, size, tracking); }
  _setFont(font, size, color, opacity) {
    const d = this.doc;
    d.font(font).fontSize(size);
    d.fillOpacity(opacity ?? 1).strokeOpacity(opacity ?? 1);
    d.fillColor(color ?? '#111');
  }
  rect(x, y, w, h, o = {}) {
    const d = this.doc;
    d.save();
    if (o.opacity != null) d.opacity(o.opacity);
    const rr = o.r ? Math.min(o.r, Math.abs(w) / 2, Math.abs(h) / 2) : 0;
    if (rr) d.roundedRect(x, y, w, h, rr); else d.rect(x, y, w, h);
    if (o.grad) {
      const [x1, y1, x2, y2] = gradEndpoints(x, y, w, h, o.grad.angle ?? 90);
      const g = d.linearGradient(x1, y1, x2, y2);
      g.stop(0, o.grad.from); g.stop(1, o.grad.to);
      d.fill(g);
    } else if (o.fill) {
      d.fillColor(o.fill, o.fillOpacity ?? 1).fill();
    } else {
      d.fillOpacity(0);
    }
    if (o.stroke) d.strokeColor(o.stroke).lineWidth(o.strokeWidth ?? 1).strokeOpacity(1).stroke();
    d.restore();
    return this;
  }
  line(x1, y1, x2, y2, o = {}) {
    const d = this.doc;
    d.save();
    if (o.opacity != null) d.opacity(o.opacity);
    d.moveTo(x1, y1).lineTo(x2, y2)
      .strokeColor(o.stroke ?? '#000').strokeOpacity(o.opacity ?? 1).lineWidth(o.width ?? 1)
      .lineCap(o.cap === 'round' ? 'round' : 'butt');
    if (o.dash) d.dash(o.width ?? 1, { space: (o.width ?? 1) * 3 });
    d.stroke();
    if (o.dash) d.undash();
    d.restore();
    return this;
  }
  path(d_, o = {}) {
    const d = this.doc;
    d.save();
    if (o.opacity != null) d.opacity(o.opacity);
    d.path(d_);
    if (o.grad) {
      const g0 = o.grad;
      const g = d.linearGradient(g0.x ?? 0, g0.y ?? 0, (g0.x ?? 0) + (g0.w ?? this.width), (g0.y ?? 0) + (g0.h ?? this.height));
      g.stop(0, g0.from); g.stop(1, g0.to);
      d.fill(g);
    } else if (o.fill) {
      d.fillColor(o.fill, o.fillOpacity ?? 1).fill();
    } else {
      d.fillOpacity(0);
    }
    if (o.stroke) d.strokeColor(o.stroke).strokeOpacity(o.opacity ?? 1).lineWidth(o.strokeWidth ?? 1)
      .lineJoin(o.join ?? 'miter').lineCap(o.cap ?? 'butt').stroke();
    d.restore();
    return this;
  }
  circle(cx, cy, r, o = {}) {
    const d = this.doc;
    d.save();
    if (o.opacity != null) d.opacity(o.opacity);
    d.circle(cx, cy, r);
    if (o.fill) d.fillColor(o.fill, o.fillOpacity ?? o.opacity ?? 1).fill(); else d.fillOpacity(0);
    if (o.stroke) d.strokeColor(o.stroke).lineWidth(o.strokeWidth ?? 1).strokeOpacity(o.opacity ?? 1).stroke();
    d.restore();
    return this;
  }
  image(dataUrl, x, y, w, h, o = {}) {
    const d = this.doc;
    d.save();
    if (o.opacity != null) d.opacity(o.opacity);
    d.image(dataUrl, x, y, { width: w, height: h });
    d.restore();
    return this;
  }
  rotated(cx, cy, deg, fn) {
    const d = this.doc;
    d.save();
    d.rotate(deg, { origin: [cx, cy] });
    fn();
    d.restore();
    return this;
  }
  text(str, x, y, o = {}) {
    if (str == null || str === '') return this;
    const d = this.doc;
    d.save();
    const size = o.size;
    const opts = { lineBreak: false, characterSpacing: o.tracking ?? 0, baseline: 'alphabetic' };
    d.font(o.font).fontSize(size).fillOpacity(o.opacity ?? 1).fillColor(o.color ?? '#111');
    let tx = x;
    if (o.align === 'center') tx = x - textWidth(str, o.font, size, o.tracking ?? 0) / 2;
    if (o.align === 'right') tx = x - textWidth(str, o.font, size, o.tracking ?? 0);
    const ty = baselineY(y, o.font, size, o.baseline);
    d.text(String(str), tx, ty, opts);
    d.restore();
    return this;
  }
}

