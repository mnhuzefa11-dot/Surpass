// kit/raster.mjs — render an SVG or the built PDF to PNG for visual QA.
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

export async function svgToPng(svgPath, outPath, width = 900) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: false, fontDirs: [], defaultFontFamily: 'Manrope' } });
  fs.writeFileSync(outPath, r.render().asPng());
  return outPath;
}

export async function pdfToPng(pdfPath, outDir, scale = 1.6) {
  const { createCanvas, DOMMatrix, Path2D } = await import('@napi-rs/canvas');
  globalThis.DOMMatrix = globalThis.DOMMatrix || DOMMatrix;
  globalThis.Path2D = globalThis.Path2D || Path2D;
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: false, isEvalSupported: false }).promise;
  fs.mkdirSync(outDir, { recursive: true });
  const outs = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, vp.width, vp.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const out = `${outDir}/page-${String(i).padStart(2, '0')}.png`;
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    outs.push(out);
  }
  return outs;
}

if (process.argv[2] === 'svg') await svgToPng(process.argv[3], process.argv[4]);
if (process.argv[2] === 'pdf') console.log((await pdfToPng(process.argv[3], process.argv[4])).join('\n'));
