// pages.mjs — the page order, plus the one entry point both builders use.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { SvgCanvas, PdfCanvas } from './canvas.mjs';
import { PAGE, FONTS } from './theme.mjs';
import { fontFile } from './metrics.mjs';
import { cover, contents, creator, growth, topPins } from './pages-a.mjs';
import {
  pinCloseUps, boards, audience, geography, pillars, cadence, whyPartner, packages, contact,
} from './pages-b.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

export const PAGES = [
  { id: 'cover', title: 'Cover', fn: cover },
  { id: 'contents', title: 'Contents', fn: contents },
  { id: 'creator', title: 'The creator', fn: creator },
  { id: 'growth', title: 'Growth at a glance', fn: growth },
  { id: 'top-pins', title: 'Top-performing pins', fn: topPins },
  { id: 'pin-detail', title: 'Top pins, close up', fn: pinCloseUps },
  { id: 'boards', title: 'Top boards', fn: boards },
  { id: 'audience', title: 'Audience profile', fn: audience },
  { id: 'geography', title: 'Where they are', fn: geography },
  { id: 'pillars', title: 'Content pillars', fn: pillars },
  { id: 'cadence', title: 'Publishing rhythm', fn: cadence },
  { id: 'why', title: 'Why partner with me', fn: whyPartner },
  { id: 'packages', title: 'Packages & process', fn: packages },
  { id: 'contact', title: "Let's talk", fn: contact },
];

export function loadData() {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
  return d;
}

/** Build one page as SVG (mode 'svg') or draw it onto a PDFKit document (mode 'pdf'). */
export function buildPage(mode, doc, data, i, extra = {}) {
  const page = PAGES[i];
  if (mode === 'svg') {
    const c = new SvgCanvas({ width: PAGE.w, height: PAGE.h, background: '#FFFFFF' });
    page.fn(c, data);
    return c;
  }
  const c = new PdfCanvas(doc, { width: PAGE.w, height: PAGE.h, background: '#FFFFFF' });
  page.fn(c, data);
  return c;
}

/** Render the whole kit to a PDF file. */
export async function renderPdf(data, outFile) {
  const doc = new PDFDocument({
    size: [PAGE.w, PAGE.h], margin: 0, autoFirstPage: false, compress: true, pdfVersion: '1.7',
    info: {
      Title: `${data.profile.name} — Pinterest Media Kit ${data.meta.edition}`,
      Author: data.profile.name,
      Subject: `Pinterest media kit · ${data.profile.niche} · data window ${data.meta.dataWindow}`,
      Keywords: 'Pinterest, media kit, influencer, brand partnership, home decor, India',
      Creator: 'Pinterest Media Kit builder',
    },
  });
  const stream = fs.createWriteStream(outFile);
  doc.pipe(stream);
  Object.keys(FONTS).forEach((k) => doc.registerFont(k, fontFile(k)));
  PAGES.forEach((pg, i) => {
    const c = buildPage('pdf', doc, data, i);
    if (doc.outline) {
      doc.outline.addItem(`${String(i + 1).padStart(2, '0')} · ${pg.title}`, c.page ? { expanded: false } : undefined);
    }
  });
  doc.end();
  await new Promise((res) => stream.on('finish', res));
  return outFile;
}

export function renderSvgs(data) {
  return PAGES.map((_, i) => buildPage('svg', null, data, i).toSvg());
}
