// build-pdf.mjs — writes media-kit.pdf into the repo.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { loadData, renderPdf, PAGES } from './pages.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(ROOT, 'media-kit.pdf');

const data = loadData();
data.__qr = await QRCode.toDataURL(data.contact.qrTarget, {
  margin: 0, width: 900, errorCorrectionLevel: 'M',
  color: { dark: '#0E0F13', light: '#FFFFFF' },
});

await renderPdf(data, out);
const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`PDF written: ${path.relative(process.cwd(), out)} — ${PAGES.length} pages, ${kb} KB`);
