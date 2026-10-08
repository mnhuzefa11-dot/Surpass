// theme.mjs — design tokens for the media kit. One source of truth for both renderers.
export const PAGE = { w: 595.28, h: 841.89, m: 46 }; // A4 in points

export const C = {
  ink: '#0E0F13',
  ink2: '#171922',
  inkSoft: '#3C404B',
  muted: '#71757F',
  faint: '#9A9CA3',
  hair: '#DFD9D1',
  hair2: '#EDE8E1',
  paper: '#FFFFFF',
  cream: '#FAF7F3',
  sand: '#F2EBE2',
  sandDeep: '#E3D6C6',
  red: '#C2475B',
  crimson: '#7A1F2B',
  navy: '#2B3A55',
  gold: '#B98A2E',
  sage: '#5C7A6B',
  plum: '#8C6BAE',
  clay: '#C2703F',
  white: '#FFFFFF',
};

export const SERIES = [C.red, C.navy, C.gold, C.sage, C.plum, C.clay];

// Font registry: pdfKey -> ttf file + css family/weight
export const FONTS = {
  P400: { file: 'PlayfairDisplay_400Regular.ttf', family: 'Playfair Display', weight: 400, css: "'Playfair Display', Georgia, serif" },
  PI400: { file: 'PlayfairDisplay_400Regular_Italic.ttf', family: 'Playfair Display', weight: 400, italic: true, css: "'Playfair Display', Georgia, serif" },
  P600: { file: 'PlayfairDisplay_600SemiBold.ttf', family: 'Playfair Display', weight: 600, css: "'Playfair Display', Georgia, serif" },
  P700: { file: 'PlayfairDisplay_700Bold.ttf', family: 'Playfair Display', weight: 700, css: "'Playfair Display', Georgia, serif" },
  P900: { file: 'PlayfairDisplay_900Black.ttf', family: 'Playfair Display', weight: 900, css: "'Playfair Display', Georgia, serif" },
  M400: { file: 'Manrope_400Regular.ttf', family: 'Manrope', weight: 400, css: "'Manrope', 'Helvetica Neue', Arial, sans-serif" },
  M500: { file: 'Manrope_500Medium.ttf', family: 'Manrope', weight: 500, css: "'Manrope', 'Helvetica Neue', Arial, sans-serif" },
  M600: { file: 'Manrope_600SemiBold.ttf', family: 'Manrope', weight: 600, css: "'Manrope', 'Helvetica Neue', Arial, sans-serif" },
  M700: { file: 'Manrope_700Bold.ttf', family: 'Manrope', weight: 700, css: "'Manrope', 'Helvetica Neue', Arial, sans-serif" },
  M800: { file: 'Manrope_800ExtraBold.ttf', family: 'Manrope', weight: 800, css: "'Manrope', 'Helvetica Neue', Arial, sans-serif" },
};

export const TRACK = { none: 0, tight: -0.2, wide: 0.6, wider: 1.4, widest: 2.4 };

/* ------------------------------ colour utilities ------------------------------ */
const hex2rgb = (h) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
};
const rgb2hex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

export const mix = (a, b, t) => {
  const A = hex2rgb(a), B = hex2rgb(b);
  return rgb2hex(A.map((v, i) => v + (B[i] - v) * t));
};
export const lighten = (h, t) => mix(h, '#ffffff', t);
export const darken = (h, t) => mix(h, '#000000', t);
export const alpha = (h, a) => `rgba(${hex2rgb(h).join(',')},${a})`;
