// build-html.mjs — one self-contained HTML file with fonts embedded, built from the
// same page code as the PDF. Open it in any browser, or print it straight to PDF.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { loadData, renderSvgs, PAGES } from './pages.mjs';
import { PAGE } from './theme.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WOFF = path.join(ROOT, 'assets', 'woff');

const FACES = [
  ['Manrope', 400, 'normal', 'manrope-latin-400-normal.woff'],
  ['Manrope', 500, 'normal', 'manrope-latin-500-normal.woff'],
  ['Manrope', 600, 'normal', 'manrope-latin-600-normal.woff'],
  ['Manrope', 700, 'normal', 'manrope-latin-700-normal.woff'],
  ['Manrope', 800, 'normal', 'manrope-latin-800-normal.woff'],
  ['Playfair Display', 400, 'normal', 'playfair-display-latin-400-normal.woff'],
  ['Playfair Display', 400, 'italic', 'playfair-display-latin-400-italic.woff'],
  ['Playfair Display', 600, 'normal', 'playfair-display-latin-600-normal.woff'],
  ['Playfair Display', 700, 'normal', 'playfair-display-latin-700-normal.woff'],
  ['Playfair Display', 900, 'normal', 'playfair-display-latin-900-normal.woff'],
];

const fontCss = FACES.map(([fam, wt2, style, file]) => {
  const b64 = fs.readFileSync(path.join(WOFF, file)).toString('base64');
  return `@font-face{font-family:'${fam}';font-style:${style};font-weight:${wt2};font-display:block;` +
    `src:url(data:font/woff;base64,${b64}) format('woff');}`;
}).join('\n');

const data = loadData();
data.__qr = await QRCode.toDataURL(data.contact.qrTarget, {
  margin: 0, width: 700, errorCorrectionLevel: 'M', color: { dark: '#0E0F13', light: '#FFFFFF' },
});

const svgs = renderSvgs(data);
const shortSide = Math.round((PAGE.h / PAGE.w) * 794); // A4 at 96 dpi

const sheets = svgs.map((svg, i) => `
  <section class="sheet" id="p${i + 1}">
    <div class="frame" style="--ar:${(PAGE.h / PAGE.w).toFixed(4)}">${svg}</div>
    <div class="sheetNo">${String(i + 1).padStart(2, '0')} / ${svgs.length}</div>
  </section>`).join('');

const toc = PAGES.map((pg, i) => `<a href="#p${i + 1}">${String(i + 1).padStart(2, '0')} ${pg.title}</a>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${data.profile.name} — Pinterest Media Kit ${data.meta.edition}</title>
<meta name="description" content="Pinterest media kit for ${data.profile.name} · ${data.profile.niche} · ${data.meta.dataWindow}">
<style>
${fontCss}
:root{ --ink:#0E0F13; --muted:#6F737C; --line:#E4DED6; --paper:#FFFFFF; --bg:#EDEAE5; --accent:#C2475B; }
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}

.bar{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.bar-in{max-width:1180px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.brand{font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700;letter-spacing:-.2px}
.brand span{color:var(--accent)}
.bar .meta{font-size:11.5px;color:var(--muted);letter-spacing:.3px;text-transform:uppercase}
.bar .spacer{flex:1}
.btn{font-size:12px;font-weight:700;letter-spacing:.4px;padding:9px 15px;border-radius:999px;border:1px solid var(--ink);color:var(--ink);background:transparent;cursor:pointer}
.btn.primary{background:var(--ink);color:#fff;border-color:var(--ink)}
.btn:hover{opacity:.85}

.layout{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:206px 1fr;gap:28px;padding:26px 20px 60px}
@media(max-width:960px){.layout{grid-template-columns:1fr}.rail{display:none}}
.rail{position:sticky;top:74px;align-self:start;font-size:12px}
.rail h4{margin:0 0 10px;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted)}
.rail a{display:block;padding:6px 8px;border-radius:7px;color:#3C404B}
.rail a:hover{background:#fff;color:var(--ink)}
.rail .note{margin-top:16px;padding:12px;background:#fff;border:1px solid var(--line);border-radius:10px;color:var(--muted);line-height:1.5}
.rail .note b{color:var(--ink)}

.sheets{display:flex;flex-direction:column;align-items:center;gap:26px}
.sheet{width:100%;max-width:794px;position:relative}
.sheet .frame{width:100%;background:#fff;border-radius:6px;box-shadow:0 1px 2px rgba(16,18,24,.10),0 18px 40px -18px rgba(16,18,24,.35);overflow:hidden}
.sheet svg{display:block;width:100%;height:auto}
.sheetNo{text-align:center;font-size:10.5px;letter-spacing:1.4px;color:#8B8F98;margin-top:9px}

.draft{background:#F7EFE2;color:#8A5F14;border:1px solid #E9D6B4;border-radius:10px;padding:12px 14px;font-size:12px;line-height:1.5;max-width:794px}
.draft b{color:#6E4A0B}

@media print{
  @page{size:A4;margin:0}
  body{background:#fff}
  .bar,.rail,.sheetNo,.draft{display:none!important}
  .layout{display:block;padding:0;max-width:none}
  .sheets{gap:0}
  .sheet{max-width:none;width:${PAGE.w}pt;height:${PAGE.h}pt;page-break-after:always;break-after:page}
  .sheet:last-child{page-break-after:auto;break-after:auto}
  .sheet .frame{box-shadow:none;border-radius:0;width:${PAGE.w}pt;height:${PAGE.h}pt}
  .sheet svg{width:${PAGE.w}pt;height:${PAGE.h}pt}
}
</style>
</head>
<body>
<header class="bar">
  <div class="bar-in">
    <div class="brand">${data.profile.name} <span>·</span> Pinterest Media Kit ${data.meta.edition}</div>
    <div class="meta">${data.profile.niche} &nbsp;·&nbsp; ${data.meta.dataWindow}</div>
    <div class="spacer"></div>
    <a class="btn" href="media-kit.pdf" download>Download PDF</a>
    <button class="btn primary" onclick="window.print()">Print / Save as PDF</button>
  </div>
</header>

<div class="layout">
  <aside class="rail">
    <h4>Pages</h4>
    ${toc}
    <div class="note">
      <b>Live numbers.</b> This preview is generated from <code>data.json</code> — edit it and re-run
      the builder to refresh every page and the PDF together.
    </div>
  </aside>

  <main class="sheets">
    ${data.meta.draft ? `<div class="draft"><b>Draft:</b> every figure in this kit is placeholder data. Replace the values in <code>data.json</code> with your own Pinterest Analytics export, set <code>meta.draft</code> to <code>false</code>, and rebuild — the banner and this note disappear automatically.</div>` : ''}
    ${sheets}
  </main>
</div>
</body>
</html>
`;

const out = path.join(ROOT, 'index.html');
fs.writeFileSync(out, html);
console.log(`HTML written: index.html — ${svgs.length} pages, ${(fs.statSync(out).size / 1024).toFixed(0)} KB (self-contained)`);
