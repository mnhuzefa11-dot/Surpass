// layout.mjs — page frame + shared components used by every page.
import { PAGE, C, FONTS, lighten, darken, mix } from './theme.mjs';
import { label, body, head, card, chip, deltaChip, sparkline } from './charts.mjs';
import { icon } from './icons.mjs';
import { wrapText, textWidth } from './metrics.mjs';

export const { w: PW, h: PH, m: M } = PAGE;
export const CW = PW - M * 2;          // 503.28
export const COL2 = (CW - 10) / 2;     // 246.64
export const COL3 = (CW - 20) / 3;     // 161.09

const css = (k) => FONTS[k].css;
const wt = (k) => FONTS[k].weight;

/* --------------------------------- number format ------------------------------- */

export const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
export function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}
export const fmt1 = (n) => Number(n).toFixed(1);

/* ------------------------------------ frame ----------------------------------- */

export function pageFrame(p, d, o = {}) {
  const dark = !!o.dark;
  const bg = dark ? C.ink : (o.bg ?? '#FFFFFF');
  p.rect(0, 0, PW, PH, { fill: bg });
  if (dark) {
    p.rect(0, 0, PW, PH, { grad: { from: '#191C27', to: '#0A0B10', angle: 105 } });
    p.circle(545, 120, 250, { fill: C.red, fillOpacity: 0.055 });
    p.circle(545, 110, 140, { fill: C.crimson, fillOpacity: 0.06 });
    p.circle(60, 760, 190, { fill: C.gold, fillOpacity: 0.035 });
  }
  if (o.plain) return;

  const inkA = dark ? '#9BA1B0' : C.muted;
  const inkB = dark ? '#6E7484' : C.faint;
  const rule = dark ? '#2A2E39' : C.hair2;

  /* running head */
  label(p, (o.section ?? '').toUpperCase(), M, 60, { size: 6.8, tracking: 2.1, color: dark ? '#B9A88C' : C.red });
  p.text(`${d.profile.handle}  ·  ${d.meta.kicker} ${d.meta.edition}`, PW - M, 60, {
    font: 'M500', size: 6.8, color: inkB, align: 'right', tracking: 0.9, css: css('M500'), weight: 500,
  });
  p.line(M, 68, PW - M, 68, { stroke: rule, width: 0.8 });

  /* running foot */
  p.line(M, 792, PW - M, 792, { stroke: rule, width: 0.8 });
  p.text(o.footLeft ?? `Source: Pinterest Analytics · ${d.meta.dataWindow}`, M, 806, {
    font: 'M400', size: 6.3, color: inkB, css: css('M400'), weight: 400,
  });
  p.text(`${String(o.index).padStart(2, '0')} / ${o.total}`, PW - M, 806, {
    font: 'M700', size: 6.8, color: dark ? '#C9CDD8' : C.inkSoft, align: 'right', tracking: 0.8, css: css('M700'), weight: 700,
  });

  if (d.meta.draft) {
    const h = 15;
    p.rect(0, PH - h, PW, h, { fill: dark ? '#3A1620' : '#F7EFE2' });
    p.text('SAMPLE FIGURES · REPLACE WITH YOUR PINTEREST ANALYTICS EXPORT BEFORE SENDING', PW / 2, PH - h / 2 + 0.3, {
      font: 'M700', size: 5.9, color: dark ? '#E7B9A8' : '#9A6B1E', align: 'center', baseline: 'middle',
      tracking: 1.1, css: css('M700'), weight: 700,
    });
  }
}

export function pageHead(p, d, o = {}) {
  const y = o.y ?? 92;
  head(p, o.title, M, y, { size: o.size ?? 26.5, color: o.color ?? C.ink, font: o.font ?? 'P700' });
  if (o.deck) {
    const lines = wrapText(o.deck, 'M400', 9.5, o.deckW ?? CW - 4);
    lines.slice(0, 3).forEach((ln, i) => body(p, ln, M, y + 20 + i * 13.6, { size: 9.5, color: o.deckColor ?? C.muted }));
    return y + 20 + Math.min(lines.length, 3) * 13.6;
  }
  return y + 8;
}

/* --------------------------------- components --------------------------------- */

export function statCard(p, x, y, w, h, o = {}) {
  card(p, x, y, w, h, { r: 11, fill: o.fill ?? '#FAF8F5', stroke: o.stroke ?? '#EFEAE3' });
  const pad = 13;
  label(p, o.label.toUpperCase(), x + pad, y + 20, { size: 6.4, tracking: 1.5, color: C.muted });
  p.text(o.value, x + pad, y + 46, {
    font: 'M800', size: o.valueSize ?? 21, color: C.ink, tracking: -0.5, css: css('M800'), weight: 800,
  });
  if (o.delta != null) {
    const vw = textWidth(o.value, 'M800', o.valueSize ?? 21, -0.5);
    const up = o.delta >= 0;
    icon(up ? 'arrowUp' : 'arrowDown', p, x + pad + vw + 8, y + 36, 8, { color: up ? '#2F6B4F' : '#A83348', sw: 1.5 });
    p.text(`${Math.abs(o.delta).toFixed(1)}%`, x + pad + vw + 19, y + 46, {
      font: 'M700', size: 8, color: up ? '#2F6B4F' : '#A83348', css: css('M700'), weight: 700,
    });
  }
  if (o.note) body(p, o.note, x + pad, y + 60, { size: 7.2, color: C.faint });
  if (o.spark) {
    sparkline(p, x + pad, y + h - 34, w - pad * 2, 24, o.spark, { color: o.sparkColor ?? C.red, width: 1.3 });
  }
  return p;
}

/** Abstract Pinterest-style pin tile built from the pin's own palette. */
export function pinTile(p, x, y, w, h, o = {}) {
  const [c1, c2] = o.palette ?? [C.crimson, C.sandDeep];
  card(p, x, y, w, h, { r: 10, fill: 'none', stroke: C.hair });
  p.rect(x, y, w, h, { r: 10, grad: { from: lighten(c1, 0.12), to: darken(c2, 0.18), angle: 115 } });
  /* decorative arcs */
  p.path(`M ${x - w * 0.2} ${y + h * 0.78} q ${w * 0.7} -${h * 0.42} ${w * 1.35} ${h * 0.08}`, {
    stroke: '#FFFFFF', strokeWidth: 1, opacity: 0.28,
  });
  p.circle(x + w * 0.78, y + h * 0.2, w * 0.2, { fill: '#FFFFFF', fillOpacity: 0.16 });
  /* mock copy lines */
  const lw = w * 0.62;
  p.rect(x + w * 0.14, y + h * 0.62, lw, 3.4, { r: 1.7, fill: '#FFFFFF', fillOpacity: 0.72 });
  p.rect(x + w * 0.14, y + h * 0.62 + 8.5, lw * 0.66, 3.4, { r: 1.7, fill: '#FFFFFF', fillOpacity: 0.42 });
  /* save pill */
  const pillW = Math.min(w * 0.42, 34);
  p.rect(x + w - pillW - 7, y + 7, pillW, 13, { r: 6.5, fill: '#FFFFFF', fillOpacity: 0.9 });
  p.text('Save', x + w - pillW / 2 - 7, y + 13.7, {
    font: 'M700', size: 5.6, color: '#3A3F4B', align: 'center', baseline: 'middle', tracking: 0.5,
    css: css('M700'), weight: 700,
  });
  if (o.badge) {
    const bw = 26;
    p.rect(x + 7, y + 7, bw, 13.5, { r: 6.75, fill: C.ink, fillOpacity: 0.86 });
    p.text(o.badge, x + 7 + bw / 2, y + 14.2, {
      font: 'M800', size: 6.4, color: '#FFFFFF', align: 'center', baseline: 'middle', tracking: 0.4,
      css: css('M800'), weight: 800,
    });
  }
  if (o.icon) icon(o.icon, p, x + w * 0.14, y + h * 0.14, 11, { color: '#FFFFFF', sw: 1.2, opacity: 0.9 });
  return p;
}

/** Uppercase section label with a short rule. */
export function eyebrow(p, text, x, y, o = {}) {
  label(p, text.toUpperCase(), x, y, { size: o.size ?? 7, tracking: o.tracking ?? 1.9, color: o.color ?? C.red });
  if (o.rule !== false) {
    p.line(x, y + 6, x + (o.ruleW ?? 26), y + 6, { stroke: o.ruleColor ?? C.red, width: 1.1 });
  }
}

export function metricRow(p, x, y, w, o = {}) {
  const { iconName, name, value, color = C.ink } = o;
  if (iconName) icon(iconName, p, x, y - 8, 10, { color: o.iconColor ?? C.muted, sw: 1.1 });
  p.text(name, x + (iconName ? 16 : 0), y, { font: 'M500', size: 8.2, color: C.muted, css: css('M500'), weight: 500 });
  p.text(value, x + w, y, { font: 'M700', size: 9.4, color, align: 'right', css: css('M700'), weight: 700, tracking: -0.1 });
  return p;
}

export function bullets(p, items, x, y, w, o = {}) {
  const size = o.size ?? 9;
  const lh = o.lh ?? 12.8;
  let cy = y;
  items.forEach((it) => {
    if (o.tick !== false) icon('check', p, x, cy - 7.6, 9, { color: o.tickColor ?? o.color ?? C.sage, sw: 1.5 });
    const lines = wrapText(it, 'M400', size, w - 15);
    lines.forEach((ln, i) => body(p, ln, x + 15, cy + i * lh, { size, color: o.color ?? C.inkSoft }));
    cy += lines.length * lh + (o.gap ?? 5.4);
  });
  return cy;
}

/** Wrapped paragraph. Returns the y position below the block. */
export function para(p, str, x, y, w, o = {}) {
  const size = o.size ?? 8.4;
  const lh = o.lh ?? size * 1.42;
  const lines = wrapText(str, o.font ?? 'M400', size, w);
  lines.forEach((ln, i) => body(p, ln, x, y + i * lh, { size, color: o.color ?? C.inkSoft, font: o.font }));
  return y + lines.length * lh;
}

export function priceRow(p, name, price, x, y, w) {
  body(p, name, x, y, { size: 8.6, color: C.inkSoft });
  p.text(price, x + w, y, { font: 'M700', size: 8.6, color: C.ink, align: 'right', css: css('M700'), weight: 700 });
  p.line(x, y + 8.6, x + w, y + 8.6, { stroke: C.hair2, width: 0.6 });
  return 22;
}

export function miniStat(p, x, y, w, o = {}) {
  p.text(o.value, x, y, { font: 'M800', size: o.size ?? 15, color: o.color ?? C.ink, tracking: -0.4, css: css('M800'), weight: 800 });
  label(p, o.label.toUpperCase(), x, y + (o.labelDy ?? 12), { size: 6.1, tracking: 1.3, color: C.faint });
  if (o.note) body(p, o.note, x, y + (o.labelDy ?? 12) + 11, { size: 7, color: C.faint });
  return p;
}

export { label, body, head, card, chip, deltaChip, sparkline, icon };
