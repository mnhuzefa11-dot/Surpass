// pages-a.mjs — cover, contents, profile, growth, top pins.
import { C, FONTS, lighten, darken, mix } from './theme.mjs';
import {
  PW, PH, M, CW, COL2, COL3, pageFrame, pageHead, statCard, pinTile, eyebrow,
  label, body, head, card, chip, deltaChip, sparkline, metricRow, bullets, miniStat,
  fmtInt, compact, fmt1,
} from './layout.mjs';
import { donut, hBar, vBars, lineChart, heatmap, ringSlice, arcPath, ringMeter } from './charts.mjs';
import { icon } from './icons.mjs';
import { wrapText, textWidth } from './metrics.mjs';

const css = (k) => FONTS[k].css;
const wt = (k) => FONTS[k].weight;

/* ================================ 01 · COVER ================================= */

export function cover(p, d) {
  pageFrame(p, d, { dark: true, plain: true, section: '' });

  /* --- left column ---------------------------------------------------------- */
  eyebrow(p, d.meta.kicker, M, 96, { size: 7.4, tracking: 3.1, color: '#C9A363' });

  const [first, ...rest] = d.profile.name.split(' ');
  const nameSize = 43;
  head(p, first, M, 176, { size: nameSize, color: '#FFFFFF', font: 'P900', weight: 900, tracking: -0.8 });
  head(p, rest.join(' '), M, 176 + nameSize * 0.98, { size: nameSize, color: '#FFFFFF', font: 'P900', weight: 900, tracking: -0.8 });

  p.line(M, 176 + nameSize * 1.98 + 6, M + 64, 176 + nameSize * 1.98 + 6, { stroke: '#C9A363', width: 1.6 });

  p.text(`${d.profile.url}  ·  Home décor & small spaces`.toUpperCase(), M, 176 + nameSize * 1.98 + 28, {
    font: 'M600', size: 6.4, color: '#9AA0B0', tracking: 1.4, css: css('M600'), weight: 600,
  });

  const tag = wrapText(d.profile.tagline, 'PI400', 18.5, 296);
  tag.forEach((ln, i) => p.text(ln, M, 330 + i * 24, {
    font: 'PI400', size: 18.5, color: '#E8E2D8', css: css('PI400'), weight: 400, tracking: -0.2,
  }));

  const bioY = 330 + tag.length * 24 + 8;
  wrapText(d.profile.bio, 'M400', 9.2, 288).forEach((ln, i) => p.text(ln, M, bioY + i * 14.6, {
    font: 'M400', size: 9.2, color: '#8E94A4', css: css('M400'), weight: 400,
  }));

  /* --- fanned pin tiles ------------------------------------------------------ */
  const tiles = [
    { x: 352, y: 142, w: 110, h: 164, rot: -7, palette: [C.crimson, C.clay], cap: 'ROOM TOURS', icon: 'grid' },
    { x: 444, y: 214, w: 106, h: 159, rot: 7, palette: [C.navy, C.sage], cap: 'BUDGET DIY', icon: 'pin' },
  ];
  tiles.forEach((t) => {
    p.rotated(t.x + t.w / 2, t.y + t.h / 2, t.rot, () => {
      pinTile(p, t.x, t.y, t.w, t.h, { palette: t.palette, icon: t.icon });
      p.rect(t.x + t.w / 2 - 26, t.y + t.h + 10, 52, 15, { r: 7.5, fill: '#FFFFFF', fillOpacity: 0.08 });
      p.text(t.cap, t.x + t.w / 2, t.y + t.h + 18, {
        font: 'M700', size: 5.9, color: '#B9BEC9', align: 'center', baseline: 'middle', tracking: 1.2,
        css: css('M700'), weight: 700,
      });
    });
  });

  /* --- credential strip ------------------------------------------------------ */
  const credY = 556;
  p.line(M, credY - 26, M + 288, credY - 26, { stroke: '#2C313D', width: 0.8 });
  [
    { v: d.profile.pins, l: 'Pins published' },
    { v: String(d.profile.boards), l: 'Boards' },
    { v: d.profile.since, l: 'Creating since' },
  ].forEach((c, i) => {
    const x = M + i * 96;
    p.text(c.v, x, credY, { font: 'M800', size: 13, color: '#E8E2D8', tracking: -0.3, css: css('M800'), weight: 800 });
    p.text(c.l.toUpperCase(), x, credY + 12, { font: 'M600', size: 5.9, color: '#7C8291', tracking: 1.3, css: css('M600'), weight: 600 });
  });

  /* --- hero stats ------------------------------------------------------------ */
  const stats = [
    { v: d.heroStats[2].value, l: d.heroStats[2].label, s: d.heroStats[2].delta },
    { v: d.heroStats[0].value, l: d.heroStats[0].label, s: d.heroStats[0].delta },
    { v: d.heroStats[3].value, l: d.heroStats[3].label, s: d.heroStats[3].delta },
  ];
  const statY = 640;
  stats.forEach((s, i) => {
    const x = M + i * 168;
    p.text(s.v, x, statY, { font: 'M800', size: 27, color: '#FFFFFF', tracking: -1, css: css('M800'), weight: 800 });
    p.text(s.l.toUpperCase(), x, statY + 18, { font: 'M600', size: 6.5, color: '#8E94A4', tracking: 1.6, css: css('M600'), weight: 600 });
    p.text(s.s, x, statY + 32, { font: 'M500', size: 6.9, color: '#C9A363', tracking: 0.4, css: css('M500'), weight: 500 });
    if (i < stats.length - 1) {
      p.line(M + 152 + i * 168, statY - 12, M + 152 + i * 168, statY + 38, { stroke: '#2E3340', width: 0.8 });
    }
  });

  /* --- footer strip ---------------------------------------------------------- */
  p.line(M, 726, PW - M, 726, { stroke: '#2C313D', width: 0.8 });
  p.text('PREPARED FOR BRAND PARTNERSHIPS', M, 748, { font: 'M700', size: 6.6, color: '#8E94A4', tracking: 1.9, css: css('M700'), weight: 700 });
  p.text(`DATA WINDOW ${d.meta.dataWindow.toUpperCase()}`, PW - M, 748, {
    font: 'M700', size: 6.6, color: '#8E94A4', align: 'right', tracking: 1.9, css: css('M700'), weight: 700,
  });
  p.text(d.contact.headline, M, 776, { font: 'PI400', size: 11.5, color: '#6E7484', css: css('PI400'), weight: 400 });
  p.text(`${d.contact.email}   ·   ${d.contact.handle}`, PW - M, 776, {
    font: 'M600', size: 8, color: '#B9BEC9', align: 'right', css: css('M600'), weight: 600, tracking: 0.2,
  });

  if (d.meta.draft) {
    p.rect(0, PH - 17, PW, 17, { fill: '#3A1620' });
    p.text('DRAFT · EVERY NUMBER IS A PLACEHOLDER — REPLACE WITH YOUR PINTEREST ANALYTICS EXPORT', PW / 2, PH - 8.6, {
      font: 'M700', size: 6.2, color: '#E7B9A8', align: 'center', baseline: 'middle', tracking: 1.1,
      css: css('M700'), weight: 700,
    });
  }
}

/* =============================== 02 · CONTENTS =============================== */

const SECTIONS = [
  { n: '03', t: 'The creator', s: 'Who you are hiring' },
  { n: '04', t: 'Growth at a glance', s: '90-day performance snapshot' },
  { n: '05', t: 'Top-performing pins', s: 'Ranked by impressions' },
  { n: '06', t: 'Top pins, close up', s: 'The four that carried the quarter' },
  { n: '07', t: 'Top boards', s: 'Where your brand can sit' },
  { n: '08', t: 'Audience profile', s: 'Gender, age, device' },
  { n: '09', t: 'Where they are', s: 'Countries, cities, seasonality' },
  { n: '10', t: 'Content pillars', s: 'Themes, formats, brand fit' },
  { n: '11', t: 'Publishing rhythm', s: 'Cadence and consistency' },
  { n: '12', t: 'Why partner with me', s: 'The commercial case' },
  { n: '13', t: 'Packages & process', s: 'Investment and timeline' },
  { n: '14', t: "Let's talk", s: 'Contact and next step' },
];

export function contents(p, d) {
  pageFrame(p, d, { section: 'Contents', index: 2, total: SECTIONS.length + 2 });
  pageHead(p, d, { title: 'Contents', deck: 'Everything a brand team needs to decide, in fourteen pages.' });

  const x = M, y0 = 158, rowH = 27.6;
  SECTIONS.forEach((s, i) => {
    const y = y0 + i * rowH;
    p.text(s.n, x, y, { font: 'P700', size: 9.5, color: i === 0 ? C.red : C.faint, css: css('P700'), weight: 700 });
    p.text(s.t, x + 34, y, { font: 'M700', size: 9.6, color: C.ink, tracking: -0.1, css: css('M700'), weight: 700 });
    p.text(s.s, x + 34, y + 11, { font: 'M400', size: 7.2, color: C.faint, css: css('M400'), weight: 400 });
    p.line(x, y + 20, x + 300, y + 20, { stroke: C.hair2, width: 0.6 });
  });

  /* right rail */
  const rx = 372, rw = PW - M - rx;
  card(p, rx, 138, rw, 226, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'The short version', rx + 16, 164, { size: 6.6, tracking: 1.7 });
  [
    { v: d.profile.followers, l: 'Followers' },
    { v: d.heroStats[0].value, l: 'Monthly views' },
    { v: d.heroStats[3].value, l: 'Save rate' },
    { v: '31', l: 'Pins / month' },
  ].forEach((s, i) => {
    const y = 192 + i * 44;
    p.text(s.v, rx + 16, y, { font: 'M800', size: 18, color: C.ink, tracking: -0.5, css: css('M800'), weight: 800 });
    label(p, s.l.toUpperCase(), rx + 16, y + 13, { size: 6.1, tracking: 1.3, color: C.faint });
    if (i < 3) p.line(rx + 16, y + 22, rx + rw - 16, y + 22, { stroke: C.hair2, width: 0.6 });
  });

  card(p, rx, 380, rw, 168, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  p.rect(rx, 380, 3, 168, { r: 1.5, fill: C.red });
  eyebrow(p, 'How to read this', rx + 16, 406, { size: 6.6, tracking: 1.7, rule: false });
  body(p, 'Figures come from Pinterest Analytics for the 90 days to 30 Sep 2026 unless a page says otherwise.', rx + 16, 428,
    { size: 8.4, color: C.inkSoft });
  p.text('91%', rx + 16, 492, { font: 'M800', size: 22, color: C.ink, tracking: -0.6, css: css('M800'), weight: 800 });
  body(p, 'of sessions are on mobile — design for the phone feed first.', rx + 16, 508, { size: 8, color: C.faint });

  card(p, M, 508, 300, 178, { r: 12, fill: C.ink });
  p.text('“', M + 20, 556, { font: 'P900', size: 40, color: '#C9A363', css: css('P900'), weight: 900 });
  wrapText('Save-led décor content for the India of small flats and serious budgets.', 'PI400', 15, 256)
    .forEach((ln, i) => p.text(ln, M + 22, 580 + i * 21, {
      font: 'PI400', size: 15, color: '#F3EFE8', css: css('PI400'), weight: 400,
    }));
  p.text('THE PITCH, IN ONE SENTENCE', M + 22, 660, {
    font: 'M700', size: 6.2, color: '#C9A363', tracking: 1.7, css: css('M700'), weight: 700,
  });
  p.line(M + 22, 672, M + 278, 672, { stroke: '#2C313D', width: 0.8 });

  card(p, rx, 566, rw, 120, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Ask me for', rx + 16, 592, { size: 6.6, tracking: 1.7, rule: false });
  body(p, 'A pin-by-pin performance deck from any campaign — or the raw Pinterest Analytics exports behind this kit.', rx + 16, 614,
    { size: 8.4, color: C.inkSoft });
  p.text('→', rx + rw - 20, 676, { font: 'M700', size: 11, color: C.red, align: 'right', css: css('M700'), weight: 700 });
}

/* ================================ 03 · CREATOR =============================== */

export function creator(p, d) {
  pageFrame(p, d, { section: 'The creator', index: 3, total: 14 });
  pageHead(p, d, { title: d.profile.name, deck: `${d.profile.niche} · ${d.profile.location}` });

  /* identity card */
  const ix = M, iy = 150, iw = 300, ih = 250;
  card(p, ix, iy, iw, ih, { r: 12, fill: '#F7F3EE' });
  const cx = ix + 62, cy = iy + 66;
  p.circle(cx, cy, 40, { grad: { from: C.red, to: C.plum, angle: 40 } });
  p.text(d.profile.avatarInitials, cx, cy + 1, {
    font: 'P700', size: 26, color: '#FFFFFF', align: 'center', baseline: 'middle', tracking: 0.5,
    css: css('P700'), weight: 700,
  });
  p.text(d.profile.name, ix + 118, iy + 52, { font: 'P700', size: 17, color: C.ink, tracking: -0.3, css: css('P700'), weight: 700 });
  p.text(d.profile.handle, ix + 118, iy + 70, { font: 'M600', size: 8.6, color: C.red, css: css('M600'), weight: 600 });
  chip(p, ix + 118, iy + 80, d.profile.since ? `On Pinterest since ${d.profile.since}` : 'Home décor creator', {
    fill: '#FFFFFF', color: C.inkSoft, size: 6.6, h: 15, stroke: '#E6DED3',
  });

  wrapText(d.profile.bio, 'M400', 8.8, iw - 36).slice(0, 5).forEach((ln, i) => {
    body(p, ln, ix + 18, iy + 138 + i * 13, { size: 8.8, color: C.inkSoft });
  });

  p.line(ix + 18, iy + 206, ix + iw - 18, iy + 206, { stroke: '#E6DED3', width: 0.7 });
  [
    { k: 'Niche', v: d.profile.niche },
    { k: 'Based in', v: d.profile.location },
    { k: 'Account', v: `${d.profile.boards} boards · ${d.profile.pins} pins published` },
  ].forEach((r, i) => {
    label(p, r.k.toUpperCase(), ix + 18, iy + 224 + i * 16, { size: 6.1, tracking: 1.3, color: C.faint });
    p.text(r.v, ix + 92, iy + 224 + i * 16, {
      font: 'M600', size: 8.2, color: C.ink, css: css('M600'), weight: 600, tracking: -0.1,
    });
  });

  /* right rail — promise + what I make */
  const rx = 362, rw = PW - M - rx;
  card(p, rx, iy, rw, 118, { r: 12, fill: C.ink });
  p.text('IN ONE LINE', rx + 16, iy + 24, { font: 'M700', size: 6.2, color: '#C9A363', tracking: 1.7, css: css('M700'), weight: 700 });
  wrapText(d.profile.tagline, 'PI400', 12.5, rw - 32).forEach((ln, i) => {
    p.text(ln, rx + 16, iy + 48 + i * 16, { font: 'PI400', size: 12.5, color: '#F3EFE8', css: css('PI400'), weight: 400 });
  });

  card(p, rx, iy + 130, rw, 120, { r: 12 });
  eyebrow(p, 'What I make', rx + 16, iy + 154, { size: 6.4, tracking: 1.7 });
  bullets(p, ['Shoppable décor guides', 'Room tours & before/after', 'Budget DIY walk-throughs'], rx + 16, iy + 178, rw - 30,
    { size: 8.2, lh: 11.6, gap: 4 });

  /* at-a-glance strip */
  const gy = 428, gh = 148;
  card(p, M, gy, CW, gh, { r: 12, fill: '#FAF8F5' });
  eyebrow(p, 'At a glance', M + 20, gy + 26, { size: 6.6, tracking: 1.7 });
  const facts = [
    { v: d.profile.followers, l: 'Followers', n: 'organic, no paid', ic: 'users' },
    { v: d.heroStats[0].value, l: 'Monthly views', n: 'best month on record', ic: 'trend' },
    { v: d.profile.pins, l: 'Pins published', n: 'across 24 boards', ic: 'grid' },
    { v: d.heroStats[3].value, l: 'Save rate', n: 'vs 1.1% platform avg', ic: 'bookmark' },
  ];
  const colW = (CW - 40) / 4;
  facts.forEach((f, i) => {
    const x = M + 20 + i * colW;
    icon(f.ic, p, x, gy + 52, 12, { color: C.red, sw: 1.1 });
    p.text(f.v, x, gy + 92, { font: 'M800', size: 20, color: C.ink, tracking: -0.5, css: css('M800'), weight: 800 });
    label(p, f.l.toUpperCase(), x, gy + 104, { size: 6.1, tracking: 1.3, color: C.muted });
    body(p, f.n, x, gy + 122, { size: 7, color: C.faint });
    if (i < 3) p.line(x + colW - 18, gy + 46, x + colW - 18, gy + 128, { stroke: C.hair2, width: 0.7 });
  });

  card(p, M, 596, CW, 152, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Why brands book this account', M + 20, 622, { size: 6.6, tracking: 1.7 });
  bullets(p, [
    'A save-led audience: 5.2% save rate means pins get stored as shopping lists, not scrolled past.',
    'Built for the Indian home: two-thirds of the audience is in India, in metro and tier-1 cities.',
    'End-to-end production: concept, styling, shoot and copy from one person, in five working days.',
  ], M + 20, 648, CW - 40, { size: 8.8, lh: 13, tickColor: C.red });
}

/* =============================== 04 · GROWTH ================================= */

export function growth(p, d) {
  pageFrame(p, d, { section: 'Growth at a glance', index: 4, total: 14 });
  pageHead(p, d, { title: 'Growth at a glance', deck: `Headline performance across the ${d.snapshot.windowLabel.toLowerCase()} — Pinterest Analytics.` });

  const cards = d.snapshot.cards;
  const cw = COL3, ch = 88, gap = 10;
  cards.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    statCard(p, M + col * (cw + gap), 146 + row * (ch + gap), cw, ch, {
      label: c.label, value: c.value, delta: c.delta, note: c.note, spark: c.spark,
      sparkColor: [C.red, C.crimson, C.navy, C.plum, C.gold, C.sage][i],
    });
  });

  /* hero chart */
  const cy = 346, chh = 186;
  card(p, M, cy, CW, chh, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  eyebrow(p, 'Monthly views · 12 months', M + 20, cy + 26, { size: 6.6, tracking: 1.7, rule: false });
  p.text('Views, in millions', M + 20, cy + 40, { font: 'M400', size: 7.2, color: C.faint, css: css('M400'), weight: 400 });
  deltaChip(p, PW - M - 20 - 54, cy + 18, d.heroStats[0].delta ? 18.0 : 0);

  const m = d.snapshot.monthly;
  const { X, Y } = lineChart(p, M + 12, cy + 52, CW - 24, 122, {
    series: [{ values: m.map((x) => x.views), color: C.red, area: true, areaOpacity: 0.10, width: 2 }],
    xLabels: m.map((x) => x.month), yMax: 2.4, yTicks: 4,
    formatY: (v) => (v === 0 ? '0' : v.toFixed(1) + 'M'),
  });
  const lx = X(m.length - 1), ly = Y(m[m.length - 1].views);
  p.line(lx, ly - 6, lx - 34, ly - 30, { stroke: C.red, width: 0.7 });
  p.rect(lx - 34 - 62, ly - 44, 62, 16, { r: 8, fill: C.ink });
  p.text('2.41M · Oct', lx - 34 - 31, ly - 36, {
    font: 'M700', size: 6.6, color: '#FFFFFF', align: 'center', baseline: 'middle', css: css('M700'), weight: 700,
  });
  p.text('Best month on record', lx - 34 - 31, ly - 22, {
    font: 'M500', size: 6.2, color: C.faint, align: 'center', css: css('M500'), weight: 500,
  });

  /* trend cards */
  const ty = 546, th = 150;
  const pairCard = (x, title, sub, values, color, big, bigLabel, note, fmtY, yMax) => {
    card(p, x, ty, COL2, th, { r: 12 });
    eyebrow(p, title, x + 18, ty + 24, { size: 6.5, tracking: 1.6, rule: false, color });
    p.text(sub, x + 18, ty + 37, { font: 'M400', size: 7.1, color: C.faint, css: css('M400'), weight: 400 });
    p.text(big, x + COL2 - 18, ty + 34, {
      font: 'M800', size: 17, color: C.ink, align: 'right', tracking: -0.5, css: css('M800'), weight: 800,
    });
    p.text(bigLabel, x + COL2 - 18, ty + 44, {
      font: 'M500', size: 6.2, color: C.faint, align: 'right', css: css('M500'), weight: 500,
    });
    lineChart(p, x + 8, ty + 52, COL2 - 20, 66, {
      series: [{ values, color, area: true, areaOpacity: 0.09, width: 1.6, endDot: true }],
      xLabels: values.map((_, i) => ''), yMax, yTicks: 2, padL: 26, formatY: fmtY,
    });
    body(p, note, x + 18, ty + 132, { size: 7.1, color: C.muted });
  };

  pairCard(M, 'Saves per month', 'Saves, in thousands', m.map((x) => x.saves), C.navy, '96.4K', '+24.1% vs first month',
    'Saves are the strongest signal of purchase intent on Pinterest.', (v) => (v === 0 ? '0' : Math.round(v) + 'K'), 120);
  pairCard(M + COL2 + 10, 'Save-rate trend', 'Saves ÷ impressions', d.heroStats[3].spark, C.gold, d.heroStats[3].value, 'platform average 1.1%',
    'A save rate four to five times the platform average, maintained for a year.', (v) => (v === 0 ? '0' : v.toFixed(1) + '%'), 6);

  /* closing note */
  card(p, M, 712, CW, 56, { r: 10, fill: '#F7F3EE' });
  icon('spark', p, M + 18, 730, 12, { color: C.gold });
  body(p, 'The takeaway: reach is climbing while save behaviour holds — pins keep working weeks after they go live.', M + 40, 738,
    { size: 8.8, color: C.ink });
  p.text('Full 90-day export available on request', PW - M - 20, 745, {
    font: 'M600', size: 7.4, color: C.muted, align: 'right', css: css('M600'), weight: 600,
  });
}

/* ============================== 05 · TOP PINS ================================ */

export function topPins(p, d) {
  pageFrame(p, d, { section: 'Top-performing pins', index: 5, total: 14 });
  pageHead(p, d, { title: 'Top-performing pins', deck: 'Ranked by impressions over the last 90 days — every pin here is a template your brand can plug into.' });

  const top = d.topPins;
  const maxImp = Math.max(...top.map((t) => t.impressions));
  const x0 = M, y0 = 166, rowH = 33.5, tw = CW;

  /* header */
  label(p, 'PIN', x0 + 26, y0 - 8, { size: 6.2, tracking: 1.4 });
  label(p, 'IMPRESSIONS', x0 + 326, y0 - 8, { size: 6.2, tracking: 1.4, align: 'right' });
  label(p, 'SAVES', x0 + 396, y0 - 8, { size: 6.2, tracking: 1.4, align: 'right' });
  label(p, 'SAVE RATE', x0 + tw, y0 - 8, { size: 6.2, tracking: 1.4, align: 'right' });
  p.line(x0, y0 - 2, x0 + tw, y0 - 2, { stroke: C.hair, width: 0.9 });

  top.forEach((t, i) => {
    const y = y0 + 16 + i * rowH;
    const med = i < 3;
    if (i % 2 === 1) p.rect(x0, y - 15, tw, rowH - 2, { fill: '#FBFAF8' });
    p.text(String(t.rank).padStart(2, '0'), x0 + 2, y, {
      font: 'P700', size: 11, color: med ? C.red : C.faint, css: css('P700'), weight: 700,
    });
    const titleLines = wrapText(t.title, 'M600', 9.4, 246);
    p.text(titleLines[0], x0 + 26, y, { font: 'M600', size: 9.4, color: C.ink, css: css('M600'), weight: 600, tracking: -0.1 });
    p.text(`${t.board}  ·  ${t.format}  ·  ${t.published}`, x0 + 26, y + 12,
      { font: 'M400', size: 7, color: C.faint, css: css('M400'), weight: 400 });
    p.text(compact(t.impressions), x0 + 326, y, {
      font: 'M700', size: 9.4, color: C.ink, align: 'right', css: css('M700'), weight: 700,
    });
    p.text(compact(t.saves), x0 + 396, y, {
      font: 'M700', size: 9.4, color: C.ink, align: 'right', css: css('M700'), weight: 700,
    });
    /* save-rate bar */
    const rate = t.saves / t.impressions;
    const barW = 96, bx = x0 + tw - barW, by = y - 6;
    p.rect(bx, by, barW, 7, { r: 3.5, fill: C.hair2 });
    p.rect(bx, by, Math.max(3, barW * (rate / 0.06)), 7, { r: 3.5, grad: { from: lighten(C.red, 0.25), to: C.red, angle: 0 } });
    p.text(`${fmt1(rate * 100)}%`, x0 + tw, y + 12, {
      font: 'M600', size: 7, color: C.muted, align: 'right', css: css('M600'), weight: 600,
    });
    p.line(x0, y + 19, x0 + tw, y + 19, { stroke: C.hair2, width: 0.6 });
  });

  const yb = y0 + 16 + top.length * rowH + 8;
  const sumImp = top.reduce((s, t) => s + t.impressions, 0);
  const sumSav = top.reduce((s, t) => s + t.saves, 0);
  const sumClk = top.reduce((s, t) => s + t.clicks, 0);
  const facts = [
    { v: compact(top[0].impressions), l: 'Best pin, impressions', n: top[0].title.slice(0, 34) + '…', ic: 'trend' },
    { v: compact(sumImp), l: 'Top 8 pins, impressions', n: '35% of all reach in the window', ic: 'bars' },
    { v: compact(sumSav), l: 'Saves across top 8', n: 'saved, not just seen', ic: 'bookmark' },
    { v: fmt1((sumSav / sumImp) * 100) + '%', l: 'Blended save rate', n: 'top-8 average', ic: 'target' },
  ];
  const fw = (CW - 30) / 4;
  card(p, M, yb, CW, 108, { r: 12, fill: '#F7F3EE' });
  facts.forEach((f, i) => {
    const x = M + 18 + i * fw;
    icon(f.ic, p, x, yb + 26, 11, { color: C.red, sw: 1.1 });
    p.text(f.v, x, yb + 58, { font: 'M800', size: 17, color: C.ink, tracking: -0.4, css: css('M800'), weight: 800 });
    label(p, f.l.toUpperCase(), x, yb + 70, { size: 5.9, tracking: 1.2, color: C.muted });
    body(p, f.n, x, yb + 84, { size: 6.8, color: C.faint });
    if (i < 3) p.line(x + fw - 14, yb + 20, x + fw - 14, yb + 88, { stroke: '#E6DED3', width: 0.7 });
  });

  label(p, 'Save rate = saves ÷ impressions · source: Pinterest Analytics pin-level report', M, 762, { size: 6.2, tracking: 0.8, color: C.faint });
}

export { icon };
