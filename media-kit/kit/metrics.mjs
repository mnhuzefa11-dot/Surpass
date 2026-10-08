// metrics.mjs — real font metrics (via fontkit, bundled with pdfkit) so text can be
// measured, wrapped and truncated identically in the HTML and PDF renderers.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { FONTS } from './theme.mjs';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FONT_DIR = path.join(__dirname, '..', 'assets', 'fonts');

const cache = new Map();
function open(key) {
  if (!cache.has(key)) cache.set(key, fontkit.openSync(path.join(FONT_DIR, FONTS[key].file)));
  return cache.get(key);
}

/** Advance width of a string in points. */
export function textWidth(str, key, size, tracking = 0) {
  const f = open(key);
  const s = String(str);
  let w = 0;
  try {
    w = f.layout(s).advanceWidth / f.unitsPerEm * size;
  } catch {
    w = s.length * size * 0.55;
  }
  return w + tracking * s.length; // both backends add tracking after every glyph
}

/** Greedy word wrap. Returns array of lines. */
export function wrapText(str, key, size, maxWidth, tracking = 0) {
  const paragraphs = String(str).split('\n');
  const out = [];
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(''); continue; }
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = line + ' ' + words[i];
      if (textWidth(test, key, size, tracking) <= maxWidth) line = test;
      else { out.push(line); line = words[i]; }
    }
    out.push(line);
  }
  return out;
}

export function truncate(str, key, size, maxWidth, tracking = 0) {
  let s = String(str);
  if (textWidth(s, key, size, tracking) <= maxWidth) return s;
  while (s.length > 1 && textWidth(s + '…', key, size, tracking) > maxWidth) s = s.slice(0, -1);
  return s.trimEnd() + '…';
}

/** Vertical metrics as fractions of em (from fontkit). */
const vcache = new Map();
function vmetric(key, name, fallback) {
  if (!vcache.has(key)) {
    const f = open(key);
    const u = f.unitsPerEm;
    vcache.set(key, {
      ascent: (f.ascent ?? 0.75 * u) / u,
      descent: (f.descent ?? -0.25 * u) / u,
      capHeight: (f.capHeight ?? 0.7 * u) / u,
    });
  }
  const v = vcache.get(key);
  return v[name] ?? fallback;
}
export const ascentOf = (key) => vmetric(key, 'ascent', 0.8);
export const descentOf = (key) => vmetric(key, 'descent', -0.25);
export const capHeightOf = (key) => vmetric(key, 'capHeight', 0.7);

/** Baseline y for a given anchor mode, in points. */
export function baselineY(y, key, size, mode) {
  if (mode === 'top') return y + ascentOf(key) * size;
  if (mode === 'middle') return y + ((ascentOf(key) - descentOf(key)) / 2) * size;
  return y; // 'alphabetic' (default): y IS the baseline
}

export function fontFile(key) {
  return path.join(FONT_DIR, FONTS[key].file);
}
