// pages-b.mjs — top pins close-up, boards, audience, geography, pillars,
// cadence, why partner, packages, contact.
import { C, FONTS, lighten, darken } from './theme.mjs';
import {
  PW, PH, M, CW, COL2, COL3, pageFrame, pageHead, statCard, pinTile, eyebrow,
  label, body, head, card, chip, deltaChip, sparkline, metricRow, bullets, miniStat, priceRow, para,
  fmtInt, compact, fmt1,
} from './layout.mjs';
import { donut, hBar, vBars, lineChart, heatmap, ringSlice, arcPath } from './charts.mjs';
import { icon } from './icons.mjs';
import { wrapText, textWidth } from './metrics.mjs';

const css = (k) => FONTS[k].css;
const wt = (k) => FONTS[k].weight;

/* ========================= 06 · TOP PINS, CLOSE UP ========================== */

export function pinCloseUps(p, d) {
  pageFrame(p, d, { section: 'Top pins, close up', index: 6, total: 14 });
  pageHead(p, d, { title: 'Top pins, close up', deck: 'The four pins that carried the quarter — and the exact numbers behind each one.' });

  const pins = d.topPins.slice(0, 4);
  const w = COL2, h = 228, gapX = 10, gapY = 10;
  pins.forEach((pin, i) => {
    const x = M + (i % 2) * (w + gapX);
    const y = 146 + Math.floor(i / 2) * (h + gapY);
    card(p, x, y, w, h, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });

    pinTile(p, x + 16, y + 18, 82, 123, { palette: pin.palette, badge: `#${pin.rank}`, icon: i % 2 ? 'pin' : 'grid' });
    const tx = x + 112, tw2 = w - 130;
    chip(p, x + 16, y + 152, pin.board, { fill: '#F2EBE2', color: C.inkSoft, size: 6.4, h: 14.5, padX: 6 });
    body(p, `${pin.format} · ${pin.published}`, x + 16, y + 182, { size: 7, color: C.faint });
    p.text(`${fmt1((pin.saves / pin.impressions) * 100)}% save rate`, x + 16, y + 202,
      { font: 'M700', size: 7.6, color: C.red, css: css('M700'), weight: 700 });

    const titleLines = wrapText(pin.title, 'P700', 11.5, tw2).slice(0, 3);
    titleLines.forEach((ln, li) => {
      p.text(ln, tx, y + 34 + li * 14, { font: 'P700', size: 11.5, color: C.ink, css: css('P700'), weight: 700, tracking: -0.2 });
    });
    p.line(tx, y + 86, x + w - 16, y + 86, { stroke: '#EFEAE3', width: 0.7 });
    [
      { n: 'Impressions', v: compact(pin.impressions), ic: 'trend' },
      { n: 'Saves', v: compact(pin.saves), ic: 'bookmark' },
      { n: 'Pin clicks', v: compact(pin.clicks), ic: 'cursor' },
    ].forEach((r, ri) => {
      icon(r.ic, p, tx, y + 104 + ri * 19 - 8, 10, { color: [C.sage, C.red, C.clay][ri], sw: 1.1 });
      p.text(r.n, tx + 16, y + 104 + ri * 19, { font: 'M500', size: 8.2, color: C.muted, css: css('M500'), weight: 500 });
      p.text(r.v, x + w - 16, y + 104 + ri * 19, { font: 'M700', size: 9.2, color: C.ink, align: 'right', css: css('M700'), weight: 700 });
    });
    p.rect(tx, y + 172, tw2, 5.5, { r: 2.75, fill: C.hair2 });
    p.rect(tx, y + 172, Math.max(3, tw2 * Math.min(1, (pin.saves / pin.impressions) / 0.06)), 5.5,
      { r: 2.75, grad: { from: lighten(C.red, 0.25), to: C.red, angle: 0 } });
    p.text('save rate vs top-pin benchmark', tx, y + 190, { font: 'M400', size: 6.4, color: C.faint, css: css('M400'), weight: 400 });
  });

  const yb = 146 + 2 * (h + gapY) + 6;
  card(p, M, yb, CW, 74, { r: 12, fill: '#F7F3EE' });
  icon('spark', p, M + 18, yb + 22, 12, { color: C.gold });
  body(p, 'Every one of these four pins is a repeatable format — room tour, budget makeover, storage system or seasonal lookbook.', M + 40, yb + 30, { size: 8.8, color: C.ink });
  body(p, 'Your product can be the hero of the next one.', M + 40, yb + 44, { size: 8.8, color: C.muted });
  p.text('Save rate = saves ÷ impressions', PW - M - 20, yb + 38, {
    font: 'M400', size: 6.6, color: C.faint, align: 'right', css: css('M400'), weight: 400,
  });
}

/* ================================ 07 · BOARDS ================================ */

export function boards(p, d) {
  pageFrame(p, d, { section: 'Top boards', index: 7, total: 14 });
  pageHead(p, d, { title: 'Top boards', deck: 'Board views show where a brand pin would sit inside an already-busy collection.' });

  const b = d.topBoards;
  const max = Math.max(...b.map((x) => x.views));
  let y = 176;
  b.forEach((bd, i) => {
    const colors = [C.red, C.crimson, C.navy, C.clay, C.sage, C.gold, C.plum, C.navy, C.sage];
    const rowH = hBar(p, M, y, CW, {
      name: bd.name, value: bd.views, max, color: colors[i % colors.length],
      valueText: compact(bd.views), labelW: 158, valueW: 66, h: 19, size: 9.2,
    });
    p.text(`${bd.pins} pins · ${bd.followers} followers`, M, y + rowH + 6, { font: 'M400', size: 6.9, color: C.faint, css: css('M400'), weight: 400 });
    p.text(`+${bd.trend}% QoQ`, M + CW, y + rowH + 6, {
      font: 'M700', size: 6.9, color: '#2F6B4F', align: 'right', tracking: 0.2, css: css('M700'), weight: 700,
    });
    y += rowH + 20;
  });

  const total = b.reduce((s, x) => s + x.views, 0);
  const sy = y + 2;
  card(p, M, sy, CW, 116, { r: 12, fill: '#FAF8F5' });
  const stats = [
    { v: compact(total), l: 'Views across these 9 boards', n: 'last 90 days' },
    { v: compact(b[0].views), l: `Top board · ${b[0].name}`, n: '+18% quarter on quarter' },
    { v: `${b.length} of ${d.profile.boards}`, l: 'Boards shown here', n: 'full board list on request' },
    { v: '4', l: 'Boards over 150K views', n: 'room for a brand takeover' },
  ];
  const fw = (CW - 36) / 4;
  stats.forEach((s, i) => {
    const x = M + 18 + i * fw;
    p.text(s.v, x, sy + 44, { font: 'M800', size: 19, color: C.ink, tracking: -0.5, css: css('M800'), weight: 800 });
    label(p, s.l.toUpperCase(), x, sy + 58, { size: 5.9, tracking: 1.2, color: C.muted });
    body(p, s.n, x, sy + 74, { size: 6.9, color: C.faint });
    if (i < 3) p.line(x + fw - 12, sy + 24, x + fw - 12, sy + 92, { stroke: C.hair2, width: 0.7 });
  });

  card(p, M, sy + 130, CW, 60, { r: 10, fill: C.ink });
  p.text('A board takeover puts your brand on the first screen of a board that already gets thousands of views a week.',
    M + 20, sy + 158, { font: 'PI400', size: 10.5, color: '#F3EFE8', css: css('PI400'), weight: 400 });
  p.text('See packages · p.13', PW - M - 20, sy + 178, {
    font: 'M700', size: 7, color: '#C9A363', align: 'right', tracking: 1.2, css: css('M700'), weight: 700,
  });
}

/* =============================== 08 · AUDIENCE =============================== */

export function audience(p, d) {
  pageFrame(p, d, { section: 'Audience profile', index: 8, total: 14 });
  pageHead(p, d, { title: 'Audience profile', deck: 'Who is on the other side of the screen — gender, age, device and interests.' });

  const dm = d.demographics;
  const y1 = 146, h1 = 236;

  /* -------------------------------- gender donut ------------------------------- */
  card(p, M, y1, COL2, h1, { r: 12 });
  eyebrow(p, 'Gender split', M + 18, y1 + 26, { size: 6.5, tracking: 1.6 });
  donut(p, M + 82, y1 + 112, 50, 32, dm.gender.map((g) => ({ value: g.pct, color: g.color })),
    { center: [`${dm.gender[0].pct}%`, 'women'], centerSize: 16, centerDy2: 13 });
  dm.gender.forEach((g, i) => {
    const lx = M + 150, ly = y1 + 88 + i * 38;
    p.circle(lx, ly - 3, 4.2, { fill: g.color });
    p.text(g.label, lx + 13, ly, { font: 'M600', size: 9, color: C.ink, css: css('M600'), weight: 600 });
    p.text(`${g.pct}%`, lx + 13, ly + 14, { font: 'M800', size: 13, color: C.ink, tracking: -0.3, css: css('M800'), weight: 800 });
  });
  p.line(M + 18, y1 + 190, M + COL2 - 18, y1 + 190, { stroke: '#EFEAE3', width: 0.7 });
  body(p, 'A female-led purchase journey — squarely in the décor sweet spot.', M + 18, y1 + 212, { size: 7.6, color: C.faint });

  /* ---------------------------------- age bands -------------------------------- */
  card(p, M + COL2 + 10, y1, COL2, h1, { r: 12 });
  eyebrow(p, 'Age bands', M + COL2 + 28, y1 + 26, { size: 6.5, tracking: 1.6 });
  vBars(p, M + COL2 + 28, y1 + 62, COL2 - 36, 130,
    dm.age.map((a) => ({ label: a.label, value: a.pct, pct: a.pct })), { color: C.navy, gap: 8 });
  p.line(M + COL2 + 28, y1 + 190, M + COL2 + 10 + COL2 - 18, y1 + 190, { stroke: '#EFEAE3', width: 0.7 });
  body(p, '67% are 25–44: prime home-making years, with budget and intent.', M + COL2 + 28, y1 + 212, { size: 7.6, color: C.faint });

  /* --------------------------------- device mix -------------------------------- */
  const y2 = 396, h2 = 132;
  card(p, M, y2, COL2, h2, { r: 12 });
  eyebrow(p, 'Device mix', M + 18, y2 + 26, { size: 6.5, tracking: 1.6 });
  const dv = dm.devices;
  const bx = M + 18, bw = COL2 - 36, by = y2 + 44, bh = 22;
  let acc = 0;
  dv.forEach((v, i) => {
    const segW = ((v.pct / 100) * (bw - 8)) - 3;
    p.rect(bx + acc, by, segW, bh, { r: 4, fill: [C.red, C.navy, C.gold][i], fillOpacity: i === 0 ? 1 : 0.92 });
    acc += segW + 4;
  });
  dv.forEach((v, i) => {
    const lx = bx + i * ((bw) / 3);
    p.circle(lx + 3, by + 42, 3.6, { fill: [C.red, C.navy, C.gold][i] });
    p.text(v.label, lx + 12, by + 45, { font: 'M600', size: 7.8, color: C.inkSoft, css: css('M600'), weight: 600 });
    p.text(`${v.pct}%`, lx + 12, by + 57, { font: 'M800', size: 10, color: C.ink, tracking: -0.2, css: css('M800'), weight: 800 });
  });
  body(p, 'Designed and shot for the phone feed first.', bx, y2 + 112, { size: 7.4, color: C.faint });

  /* --------------------------------- interests --------------------------------- */
  card(p, M + COL2 + 10, y2, COL2, h2, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Top interests', M + COL2 + 28, y2 + 26, { size: 6.5, tracking: 1.6, rule: false });
  dm.interests.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + COL2 + 28 + col * ((COL2 - 36) / 2);
    const y = y2 + 54 + row * 26;
    p.circle(x + 3.4, y - 3, 3.2, { fill: C.red });
    p.text(it, x + 13, y, { font: 'M600', size: 8.2, color: C.ink, css: css('M600'), weight: 600 });
  });

  /* ------------------------------- brand insight ------------------------------- */
  const y3 = 544, h3 = 192;
  card(p, M, y3, CW, h3, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  p.rect(M, y3, 3, h3, { r: 1.5, fill: C.red });
  eyebrow(p, 'What this means for your brand', M + 24, y3 + 30, { size: 6.6, tracking: 1.7 });
  const qlines = wrapText(dm.insight, 'PI400', 13.5, CW - 68);
  qlines.forEach((ln, i) => {
    p.text(ln, M + 24, y3 + 64 + i * 19, { font: 'PI400', size: 13.5, color: C.ink, css: css('PI400'), weight: 400 });
  });
  const by3 = y3 + 64 + qlines.length * 19 + 10;
  bullets(p, [
    'Plan décor, storage and kitchen pushes for this audience — they are actively furnishing.',
    'Mobile-first creative wins the feed: every pin is built at 2:3 before anything else.',
    'Interest overlap with DIY, interiors and organisation keeps brand pins relevant for weeks.',
  ], M + 24, by3 + 8, CW - 48, { size: 8.4, lh: 12.2, gap: 4, tickColor: C.red });

  label(p, 'Audience data shown: gender, age, device, interests and location — no engagement metrics are included.', M, 762,
    { size: 6.2, tracking: 0.8, color: C.faint });
}

/* ============================== 09 · GEOGRAPHY =============================== */

export function geography(p, d) {
  pageFrame(p, d, { section: 'Where they are', index: 9, total: 14 });
  pageHead(p, d, { title: 'Where they are', deck: 'Country and city concentration, plus the seasonal windows worth booking.' });

  const dm = d.demographics;
  /* countries */
  card(p, M, 146, 300, 250, { r: 12 });
  eyebrow(p, 'Top countries', M + 18, 172, { size: 6.5, tracking: 1.6 });
  const maxC = Math.max(...dm.countries.map((c) => c.pct));
  dm.countries.forEach((c, i) => {
    hBar(p, M + 18, 190 + i * 30, 264, {
      name: c.label, value: c.pct, max: maxC, color: i === 0 ? C.red : C.navy,
      valueText: `${c.pct}%`, labelW: 96, valueW: 34, h: 16, size: 8.6,
    });
  });
  body(p, 'India-first, with a meaningful English-market tail.', M + 18, 378, { size: 7.4, color: C.faint });

  /* cities */
  const cx = 356, cw = PW - M - cx;
  card(p, cx, 146, cw, 250, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Top cities', cx + 16, 172, { size: 6.5, tracking: 1.6, rule: false });
  const maxCity = Math.max(...dm.cities.map((c) => c.pct));
  dm.cities.forEach((c, i) => {
    const y = 196 + i * 32;
    p.text(c.label, cx + 16, y, { font: 'M600', size: 8.4, color: C.ink, css: css('M600'), weight: 600 });
    p.text(`${c.pct}%`, cx + cw - 16, y, { font: 'M700', size: 8.4, color: C.ink, align: 'right', css: css('M700'), weight: 700 });
    p.rect(cx + 16, y + 6, cw - 32, 5, { r: 2.5, fill: '#E9E1D6' });
    p.rect(cx + 16, y + 6, (cw - 32) * (c.pct / maxCity), 5, { r: 2.5, fill: C.crimson });
  });

  /* seasonality */
  card(p, M, 412, CW, 196, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  eyebrow(p, 'Seasonal interest index', M + 18, 438, { size: 6.5, tracking: 1.6, rule: false });
  body(p, 'Relative search and save interest across the year · 100 = seasonal peak', M + 18, 452, { size: 7, color: C.faint });
  const sea = dm.seasonality;
  const maxS = Math.max(...sea.map((s) => s.value));
  const sbW = CW - 60, sbX = M + 30, sbY = 476, sbH = 92;
  const gap = 6;
  const colW = (sbW - gap * (sea.length - 1)) / sea.length;
  sea.forEach((s, i) => {
    const hh = (s.value / maxS) * sbH;
    const x = sbX + i * (colW + gap);
    const top = s.value === maxS;
    p.rect(x, sbY, colW, sbH, { r: 3, fill: '#F3EFE9' });
    p.rect(x, sbY + sbH - hh, colW, hh, {
      r: 3, grad: top ? { from: lighten(C.red, 0.2), to: C.red, angle: 0 } : { from: '#BCC5D4', to: C.navy, angle: 0 },
    });
    if (top) {
      p.rect(x - 6, sbY - 22, 46, 16, { r: 8, fill: C.ink });
      p.text('PEAK · OCT', x + 17, sbY - 14, {
        font: 'M700', size: 6, color: '#FFFFFF', align: 'center', baseline: 'middle', tracking: 0.6, css: css('M700'), weight: 700,
      });
    }
    p.text(s.label, x + colW / 2, sbY + sbH + 12, {
      font: 'M600', size: 6.6, color: top ? C.red : C.muted, align: 'center', css: css('M600'), weight: 600,
    });
  });

  /* planning windows */
  card(p, M, 624, CW, 106, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Best windows to book', M + 18, 650, { size: 6.5, tracking: 1.6, rule: false });
  const wins = [
    { t: 'Aug – Oct', d: 'Festive & Diwali décor', c: C.red },
    { t: 'Nov – Dec', d: 'Wedding season gifting', c: C.crimson },
    { t: 'Jan – Mar', d: 'New-year home refresh', c: C.navy },
    { t: 'Jun – Jul', d: 'Monsoon & balcony care', c: C.sage },
  ];
  const wW = (CW - 36) / 4;
  wins.forEach((wv, i) => {
    const x = M + 18 + i * wW;
    p.rect(x, 668, 10, 10, { r: 2.5, fill: wv.c });
    p.text(wv.t, x + 18, 677, { font: 'M700', size: 8.6, color: C.ink, css: css('M700'), weight: 700 });
    body(p, wv.d, x, 692, { size: 7.4, color: C.muted });
    p.text('Book 3–4 weeks ahead', x, 706, { font: 'M400', size: 6.4, color: C.faint, css: css('M400'), weight: 400 });
  });
}

/* =============================== 10 · PILLARS ================================ */

export function pillars(p, d) {
  pageFrame(p, d, { section: 'Content pillars', index: 10, total: 14 });
  pageHead(p, d, { title: 'Content pillars', deck: 'Five themes carry the account. Each one is a ready-made slot for a brand.' });

  const pl = d.pillars;
  donut(p, 165, 300, 82, 51, pl.map((x) => ({ value: x.share, color: x.color })), {
    center: ['5', 'pillars'], centerSize: 19, centerDy2: 15,
  });

  const rx = 286, rw = PW - M - rx;
  pl.forEach((pl2, i) => {
    const y = 186 + i * 46;
    p.circle(rx + 4, y - 3, 4.4, { fill: pl2.color });
    p.text(pl2.name, rx + 16, y, { font: 'M700', size: 10, color: C.ink, css: css('M700'), weight: 700, tracking: -0.2 });
    p.text(`${pl2.share}%`, rx + rw, y, { font: 'M800', size: 10, color: C.ink, align: 'right', css: css('M800'), weight: 800 });
    p.text(pl2.desc, rx + 16, y + 12, { font: 'M400', size: 7.4, color: C.faint, css: css('M400'), weight: 400 });
    p.rect(rx + 16, y + 18, rw - 16, 4, { r: 2, fill: '#EFEAE3' });
    p.rect(rx + 16, y + 18, (rw - 16) * (pl2.share / 40), 4, { r: 2, fill: pl2.color });
  });

  /* format mix */
  card(p, M, 424, CW, 140, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  eyebrow(p, 'Format mix', M + 18, 450, { size: 6.5, tracking: 1.6, rule: false });
  const fm = d.formats;
  const fbX = M + 18, fbW = CW - 240, fbY = 466;
  let acc = 0;
  fm.forEach((f) => {
    const segW = (f.share / 100) * fbW;
    p.rect(fbX + acc, fbY, segW, 22, { r: 4, fill: f.color, fillOpacity: 0.92 });
    acc += segW;
  });
  fm.forEach((f, i) => {
    const lx = fbX + (i > 0 ? (fm.slice(0, i).reduce((s, z) => s + z.share, 0) / 100) * fbW : 0);
    p.text(`${f.share}%`, lx + 8, fbY + 14.5, {
      font: 'M800', size: 9, color: '#FFFFFF', baseline: 'middle', css: css('M800'), weight: 800,
    });
    p.text(f.name, lx + 8, fbY + 38, { font: 'M600', size: 7.4, color: C.inkSoft, css: css('M600'), weight: 600 });
  });
  p.line(fbX, fbY + 62, fbX + fbW, fbY + 62, { stroke: '#EFEAE3', width: 0.7 });
  body(p, 'Statics carry search traffic, video carries saves, Idea Pins carry discovery.', fbX, fbY + 80, { size: 7.6, color: C.muted });

  const nx = fbX + fbW + 24;
  p.text('BRAND FIT', nx, 466, { font: 'M700', size: 6.2, color: C.red, tracking: 1.6, css: css('M700'), weight: 700 });
  [
    ['Home décor / paint', 'Home décor & styling · 38%'],
    ['Furniture / storage', 'Small-space solutions · 24%'],
    ['Kitchenware', 'Organising & lifestyle · 12%'],
    ['Gifting / festive', 'Festive & seasonal · 8%'],
  ].forEach((r, i) => {
    const y = 488 + i * 18;
    p.text(r[0], nx, y, { font: 'M600', size: 7.6, color: C.ink, css: css('M600'), weight: 600 });
    p.text(r[1], nx, y + 9, { font: 'M400', size: 6.6, color: C.faint, css: css('M400'), weight: 400 });
  });

  card(p, M, 580, CW, 132, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'How a campaign runs inside a pillar', M + 18, 606, { size: 6.5, tracking: 1.6, rule: false });
  const steps = [
    { n: '01', t: 'Pick the pillar', d: 'Choose the theme that matches your product.' },
    { n: '02', t: 'Slot it in', d: 'Your pin publishes inside that pillar’s next cycle.' },
    { n: '03', t: 'Track it', d: 'Impressions, saves and pin clicks for your pin only.' },
  ];
  steps.forEach((s, i) => {
    const x = M + 18 + i * ((CW - 36) / 3);
    p.text(s.n, x, 636, { font: 'P700', size: 13, color: C.red, css: css('P700'), weight: 700 });
    p.text(s.t, x + 26, 636, { font: 'M700', size: 8.6, color: C.ink, css: css('M700'), weight: 700 });
    wrapText(s.d, 'M400', 7.4, (CW - 36) / 3 - 30).forEach((ln, li) => {
      body(p, ln, x + 26, 650 + li * 10.4, { size: 7.4, color: C.muted });
    });
  });
}

/* =============================== 11 · CADENCE ================================ */

export function cadence(p, d) {
  pageFrame(p, d, { section: 'Publishing rhythm', index: 11, total: 14 });
  pageHead(p, d, { title: 'Publishing rhythm', deck: 'A brand pin only performs if the account keeps feeding the algorithm. This one never stops.' });

  /* heatmap: 7 day rows x 12 week columns */
  const weeks = d.cadence.weeks;              // 12 weeks x 7 days
  const rows = [];
  for (let day = 0; day < 7; day++) rows.push(weeks.map((wk) => wk[day]));

  const gx = M + 34, gw = CW - 34, gy = 196, gh = 176;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const { cellH, gap } = heatmap(p, gx, gy, gw, gh, rows, { max: 3, color: C.red, gap: 4 });
  days.forEach((dn, i) => {
    p.text(dn, M, gy + i * (cellH + gap) + cellH / 2, {
      font: 'M600', size: 6.6, color: C.muted, baseline: 'middle', css: css('M600'), weight: 600,
    });
  });
  for (let w = 0; w < 12; w++) {
    const x = gx + w * ((gw - gap * 11) / 12 + gap) + ((gw - gap * 11) / 12) / 2;
    p.text(`W${w + 1}`, x, gy + gh + 12, {
      font: 'M500', size: 6.2, color: C.faint, align: 'center', css: css('M500'), weight: 500,
    });
  }
  /* legend */
  const lx = PW - M - 150;
  p.text('Pins per day', lx, gy - 14, { font: 'M600', size: 6.4, color: C.muted, css: css('M600'), weight: 600 });
  [1, 2, 3].forEach((v, i) => {
    p.rect(lx + 56 + i * 30, gy - 20, 16, 9, { r: 2, fill: C.red, fillOpacity: 0.10 + (v / 3) * 0.85 });
    p.text(String(v), lx + 76 + i * 30, gy - 15.5, {
      font: 'M500', size: 6.2, color: C.faint, baseline: 'middle', css: css('M500'), weight: 500,
    });
  });

  const stats = [
    { v: '31', l: 'Pins per month', n: 'average across the year', ic: 'grid' },
    { v: '48', l: 'Weeks live this year', n: 'no dead weeks', ic: 'calendar' },
    { v: '3.1', l: 'Pins per week', n: 'evenly spread', ic: 'trend' },
  ];
  const sw = COL3;
  stats.forEach((s, i) => {
    const x = M + i * (sw + 10);
    card(p, x, 400, sw, 92, { r: 11 });
    icon(s.ic, p, x + 14, 416, 11, { color: C.red, sw: 1.1 });
    p.text(s.v, x + 14, 452, { font: 'M800', size: 20, color: C.ink, tracking: -0.5, css: css('M800'), weight: 800 });
    label(p, s.l.toUpperCase(), x + 14, 464, { size: 6.1, tracking: 1.2, color: C.muted });
    body(p, s.n, x + 14, 480, { size: 6.8, color: C.faint });
  });

  card(p, M, 512, CW, 184, { r: 12, fill: '#FFFFFF', stroke: '#E6DED3' });
  p.rect(M, 512, 3, 184, { r: 1.5, fill: C.sage });
  eyebrow(p, 'Why this matters to a brand', M + 22, 540, { size: 6.6, tracking: 1.7, color: C.sage });
  bullets(p, [
    'Fresh pins every week keep the account in distribution — algorithm reach compounds instead of decaying.',
    'A brand pin is published into a live rhythm, not a dormant grid, so it gets seen from day one.',
    'Publishing days are planned in advance, so campaign dates are honoured to the day.',
    'Pins stay live indefinitely; a campaign keeps earning saves long after the invoice.',
  ], M + 22, 568, CW - 44, { size: 8.6, lh: 12.6, gap: 4.4, tickColor: C.sage });
  p.text('Cadence from Pinterest account activity · last 12 weeks', M + 22, 682, {
    font: 'M400', size: 6.4, color: C.faint, css: css('M400'), weight: 400,
  });
}

/* ============================= 12 · WHY PARTNER ============================== */

export function whyPartner(p, d) {
  pageFrame(p, d, { section: 'Why partner with me', index: 12, total: 14 });
  pageHead(p, d, { title: 'Why partner with me', deck: 'The commercial case, in four lines — and the three ways brands work with this account.' });

  const iconsList = ['bookmark', 'globe', 'clock', 'doc'];
  const colors = [C.red, C.navy, C.clay, C.sage];
  d.whyMe.forEach((wme, i) => {
    const x = M + (i % 2) * (COL2 + 10);
    const y = 146 + Math.floor(i / 2) * 134;
    card(p, x, y, COL2, 124, { r: 12, fill: i % 3 === 0 ? '#FFFFFF' : '#FAF8F5', stroke: '#E9E4DD' });
    icon(iconsList[i], p, x + 18, y + 20, 13, { color: colors[i], sw: 1.15 });
    p.text(String(i + 1).padStart(2, '0'), x + COL2 - 18, y + 30, {
      font: 'P700', size: 13, color: '#E2DAD0', align: 'right', css: css('P700'), weight: 700,
    });
    wrapText(wme.title, 'P700', 12.5, COL2 - 36).forEach((ln, li) => {
      p.text(ln, x + 18, y + 56 + li * 15, { font: 'P700', size: 12.5, color: C.ink, css: css('P700'), weight: 700, tracking: -0.2 });
    });
    const tl = wrapText(wme.title, 'P700', 12.5, COL2 - 36).length;
    wrapText(wme.body, 'M400', 8.4, COL2 - 36).slice(0, 4).forEach((ln, li) => {
      body(p, ln, x + 18, y + 56 + tl * 15 + 4 + li * 12, { size: 8.4, color: C.inkSoft });
    });
  });

  /* ways to work together */
  const wy = 424;
  eyebrow(p, 'Three ways to work together', M, wy, { size: 6.6, tracking: 1.7 });
  const ways = [
    { tag: 'Pin feature', d: 'One hero pin, styled around your product.', p: `from ${d.packages[0].price}` },
    { tag: 'Board takeover', d: 'Your brand across a high-traffic board.', p: `from ${d.packages[1].price}` },
    { tag: 'Seasonal campaign', d: 'A full month of pins around a moment.', p: `from ${d.packages[2].price}` },
  ];
  ways.forEach((wv, i) => {
    const x = M + i * (COL3 + 10);
    card(p, x, wy + 14, COL3, 108, { r: 11, fill: '#F7F3EE' });
    p.text(wv.tag, x + 16, wy + 44, { font: 'M700', size: 9.6, color: C.ink, css: css('M700'), weight: 700 });
    wrapText(wv.d, 'M400', 7.6, COL3 - 32).slice(0, 3).forEach((ln, li) => {
      body(p, ln, x + 16, wy + 60 + li * 11, { size: 7.6, color: C.muted });
    });
    p.text(wv.p, x + 16, wy + 104, { font: 'M700', size: 8, color: C.red, css: css('M700'), weight: 700 });
  });

  /* categories */
  card(p, M, 566, CW, 92, { r: 12 });
  eyebrow(p, 'Categories I work in', M + 18, 592, { size: 6.4, tracking: 1.6, rule: false });
  let cxp = M + 18;
  d.pastPartners.categories.forEach((cat) => {
    const w2 = p.measure(cat, 'M600', 7.6, 0.8) + 20;
    if (cxp + w2 > PW - M - 18) return;
    chip(p, cxp, 606, cat, { fill: '#F2EBE2', color: C.inkSoft, size: 7.4, h: 19, padX: 9, tracking: 0.8, stroke: '#E6DED3' });
    cxp += w2 + 7;
  });
  body(p, d.pastPartners.note, M + 18, 646, { size: 7.4, color: C.faint });

  card(p, M, 672, CW, 92, { r: 12, fill: C.ink });
  wrapText('References, past campaign decks and a live screen-share of the analytics dashboard are available on request.',
    'PI400', 11.5, CW - 44).forEach((ln, i) => {
    p.text(ln, M + 22, 704 + i * 16, { font: 'PI400', size: 11.5, color: '#F3EFE8', css: css('PI400'), weight: 400 });
  });
  p.text('ASK FOR THE FULL CASE STUDY  →', M + 22, 748, {
    font: 'M700', size: 6.6, color: '#C9A363', tracking: 1.4, css: css('M700'), weight: 700,
  });
}

/* ============================== 13 · PACKAGES =============================== */

export function packages(p, d) {
  pageFrame(p, d, { section: 'Packages & process', index: 13, total: 14 });
  pageHead(p, d, { title: 'Packages & process', deck: 'Transparent pricing, fixed deliverables, a five-working-day turnaround.' });

  const y0 = 148, h = 320;
  d.packages.forEach((pk, i) => {
    const x = M + i * (COL3 + 10);
    const featured = !!pk.featured;
    if (featured) {
      p.rect(x - 5, y0 - 10, COL3 + 10, h + 20, { r: 14, fill: C.ink });
      p.rect(x - 5, y0 - 10, COL3 + 10, h + 20, { r: 14, stroke: C.gold, strokeWidth: 0.9 });
    } else {
      card(p, x, y0, COL3, h, { r: 12 });
    }
    const inkC = featured ? '#FFFFFF' : C.ink;
    const softC = featured ? '#A9AEBB' : C.muted;
    const faintC = featured ? '#7C8291' : C.faint;

    if (featured) {
      p.rect(x + COL3 / 2 - 38, y0 - 20, 76, 17, { r: 8.5, fill: C.red });
      p.text('MOST BOOKED', x + COL3 / 2, y0 - 11.6, {
        font: 'M800', size: 5.9, color: '#FFFFFF', align: 'center', baseline: 'middle', tracking: 1.1, css: css('M800'), weight: 800,
      });
    }
    p.text(pk.tier, x + 16, y0 + 28, { font: 'P700', size: 15, color: inkC, css: css('P700'), weight: 700, tracking: -0.3 });
    p.text(pk.price, x + 16, y0 + 58, { font: 'M800', size: 21, color: inkC, tracking: -0.6, css: css('M800'), weight: 800 });
    p.text(pk.unit, x + 16, y0 + 72, { font: 'M500', size: 6.8, color: faintC, tracking: 0.6, css: css('M500'), weight: 500 });
    wrapText(pk.tagline, 'M400', 8, COL3 - 32).slice(0, 2).forEach((ln, li) => {
      p.text(ln, x + 16, y0 + 90 + li * 11, { font: 'M400', size: 8, color: softC, css: css('M400'), weight: 400 });
    });
    p.line(x + 16, y0 + 116, x + COL3 - 16, y0 + 116, { stroke: featured ? '#333846' : '#EFEAE3', width: 0.7 });

    let ly = y0 + 136;
    const listBottom = y0 + h - 52;
    pk.deliverables.forEach((dl) => {
      const lines = wrapText(dl, 'M400', 7.8, COL3 - 44);
      if (ly > listBottom) return;
      icon('check', p, x + 16, ly - 6, 8.5, { color: featured ? '#C9A363' : C.sage, sw: 1.5 });
      lines.forEach((ln, li) => {
        p.text(ln, x + 30, ly + li * 10.4, { font: 'M400', size: 7.8, color: featured ? '#DDE0E7' : C.inkSoft, css: css('M400'), weight: 400 });
      });
      ly += lines.length * 10.4 + 6.4;
    });

    p.line(x + 16, y0 + h - 44, x + COL3 - 16, y0 + h - 44, { stroke: featured ? '#333846' : '#EFEAE3', width: 0.7 });
    p.text('BEST FOR', x + 16, y0 + h - 28, { font: 'M700', size: 5.9, color: faintC, tracking: 1.2, css: css('M700'), weight: 700 });
    wrapText(pk.bestFor, 'M600', 7.4, COL3 - 32).forEach((ln, li) => {
      p.text(ln, x + 16, y0 + h - 16 + li * 9.6, { font: 'M600', size: 7.4, color: featured ? '#E8E2D8' : C.ink, css: css('M600'), weight: 600 });
    });
  });

  /* add-ons */
  const ay = 496;
  card(p, M, ay, CW, 112, { r: 12, fill: '#F7F3EE' });
  eyebrow(p, 'Add-ons', M + 18, ay + 26, { size: 6.5, tracking: 1.6, rule: false });
  const colW = (CW - 56) / 2;
  d.addons.forEach((a, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + 18 + col * (colW + 20);
    const y = ay + 46 + row * 22;
    priceRow(p, a.name, a.price, x, y, colW);
  });

  /* process */
  const py = 634;
  eyebrow(p, 'How it runs', M, py, { size: 6.5, tracking: 1.6 });
  const steps = d.process;
  const sw = (CW - 30) / 4;
  p.line(M + 20, py + 34, M + CW - 20, py + 34, { stroke: C.hair, width: 0.8 });
  steps.forEach((s, i) => {
    const x = M + i * (sw + 10);
    p.circle(x + 20, py + 34, 12, { fill: '#FFFFFF', stroke: C.red, strokeWidth: 1.1 });
    p.text(s.step, x + 20, py + 34, {
      font: 'M800', size: 7.6, color: C.red, align: 'center', baseline: 'middle', css: css('M800'), weight: 800,
    });
    p.text(s.title, x, py + 62, { font: 'M700', size: 8.8, color: C.ink, css: css('M700'), weight: 700 });
    wrapText(s.body, 'M400', 7.4, sw - 6).slice(0, 3).forEach((ln, li) => {
      body(p, ln, x, py + 76 + li * 10.6, { size: 7.4, color: C.muted });
    });
  });

  label(p, 'Prices in INR, exclusive of GST · usage rights and exclusivity quoted separately', M, 762, { size: 6.2, tracking: 0.8, color: C.faint });
}

/* =============================== 14 · CONTACT =============================== */

export function contact(p, d) {
  pageFrame(p, d, { dark: true, section: 'Contact', index: 14, total: 14 });

  eyebrow(p, 'Next step', M, 92, { size: 7, tracking: 2.6, color: '#C9A363' });
  wrapText(d.contact.headline, 'P900', 34, 330).forEach((ln, i) => {
    p.text(ln, M, 176 + i * 40, { font: 'P900', size: 34, color: '#FFFFFF', css: css('P900'), weight: 900, tracking: -0.8 });
  });
  wrapText(d.contact.body, 'M400', 9.6, 300).forEach((ln, i) => {
    p.text(ln, M, 292 + i * 15.4, { font: 'M400', size: 9.6, color: '#9AA0B0', css: css('M400'), weight: 400 });
  });

  /* contact rows */
  const rows = [
    { ic: 'mail', l: 'Email', v: d.contact.email },
    { ic: 'pin', l: 'Pinterest', v: d.contact.handle },
    { ic: 'globe', l: 'Profile', v: d.contact.url },
  ];
  rows.forEach((r, i) => {
    const y = 388 + i * 40;
    p.circle(M + 13, y - 4, 13, { fill: '#FFFFFF', fillOpacity: 0.07 });
    icon(r.ic, p, M + 6.5, y - 10.5, 13, { color: '#C9A363', sw: 1.05 });
    p.text(r.l.toUpperCase(), M + 36, y - 6, {
      font: 'M700', size: 5.9, color: '#7C8291', tracking: 1.4, css: css('M700'), weight: 700,
    });
    p.text(r.v, M + 36, y + 8, { font: 'M600', size: 9.6, color: '#F3EFE8', css: css('M600'), weight: 600, tracking: 0.1 });
  });

  /* QR */
  const qx = PW - M - 156, qy = 344, qs = 156;
  card(p, qx, qy, qs, qs, { r: 14, fill: '#FFFFFF', stroke: '#3A3F4D' });
  if (d.__qr) p.image(d.__qr, qx + 16, qy + 16, qs - 32, qs - 32);
  p.text('Scan to open the profile', qx + qs / 2, qy + qs + 16, {
    font: 'M500', size: 6.8, color: '#8E94A4', align: 'center', css: css('M500'), weight: 500,
  });

  /* closing band */
  p.line(M, 556, PW - M, 556, { stroke: '#2C313D', width: 0.8 });
  p.text('WHAT HAPPENS NEXT', M, 584, { font: 'M700', size: 6.2, color: '#C9A363', tracking: 1.8, css: css('M700'), weight: 700 });
  const nexts = [
    { t: 'Send the brief', d: 'Product, goal, dates, budget range.' },
    { t: 'Receive a concept', d: 'Moodboard and pin direction in 48 hours.' },
    { t: 'Lock the slots', d: '50% to book, balance on publish.' },
  ];
  nexts.forEach((n, i) => {
    const x = M + i * 150;
    p.text(String(i + 1).padStart(2, '0'), x, 614, { font: 'P700', size: 11, color: '#C9A363', css: css('P700'), weight: 700 });
    p.text(n.t, x + 24, 614, { font: 'M700', size: 8.8, color: '#FFFFFF', css: css('M700'), weight: 700 });
    wrapText(n.d, 'M400', 7.2, 118).forEach((ln, li) => {
      p.text(ln, x + 24, 628 + li * 10, { font: 'M400', size: 7.2, color: '#8E94A4', css: css('M400'), weight: 400 });
    });
  });

  p.line(M, 690, PW - M, 690, { stroke: '#2C313D', width: 0.8 });
  p.text(d.profile.name, M, 716, { font: 'P700', size: 12, color: '#FFFFFF', css: css('P700'), weight: 700 });
  p.text(`${d.profile.niche} · ${d.profile.location}`, M, 732, {
    font: 'M400', size: 7.4, color: '#8E94A4', css: css('M400'), weight: 400,
  });
  p.text(`Figures: Pinterest Analytics · ${d.meta.dataWindow}`, PW - M, 716, {
    font: 'M500', size: 7.4, color: '#8E94A4', align: 'right', css: css('M500'), weight: 500,
  });
  p.text(`Media kit · ${d.meta.edition} edition`, PW - M, 732, {
    font: 'M500', size: 7.4, color: '#8E94A4', align: 'right', css: css('M500'), weight: 500,
  });
}
