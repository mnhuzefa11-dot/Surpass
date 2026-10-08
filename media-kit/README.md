# Pinterest Media Kit

A print-ready, brand-facing media kit for a Pinterest creator — **14 pages, A4**, built from a
single data file. Ships as a PDF (for email/WhatsApp pitches) and as one self-contained HTML
file (for a live link or a quick screen share).

```
media-kit/
├── data.json          ← EDIT THIS: every number, name and line of copy
├── index.html         ← the kit as a self-contained web page (fonts embedded)
├── media-kit.pdf      ← the kit as a 14-page print-ready PDF
├── kit/               ← the builder (layout + chart engine, no chart library)
└── assets/            ← embedded fonts (Playfair Display + Manrope, OFL licensed)
```

## What's inside

| # | Page | What it does |
|---|------|--------------|
| 01 | Cover | Name, positioning line, three hero stats, credential strip |
| 02 | Contents | Page index plus "the short version" rail |
| 03 | The creator | Bio, what I make, at-a-glance facts |
| 04 | Growth at a glance | Six stat cards, 12-month views chart, saves trend, save-rate trend |
| 05 | **Top-performing pins** | Ranked table: impressions, saves, save rate per pin + summary stats |
| 06 | **Top pins, close up** | Four pin cards with tile, exact numbers and benchmark bars |
| 07 | **Top boards** | Nine boards ranked by views, with pin/follower counts and QoQ trend |
| 08 | Audience profile | Gender donut, age bands, device split, interests, brand takeaway |
| 09 | Where they are | Countries, cities, seasonality index, best booking windows |
| 10 | Content pillars | Pillar donut, format mix, brand-fit mapping |
| 11 | Publishing rhythm | 12-week × 7-day cadence heatmap |
| 12 | Why partner with me | Four commercial arguments + three ways to work together |
| 13 | Packages & process | Three tiers, add-ons, four-step process |
| 14 | Let's talk | Contact details + QR to the profile |

**Metrics the kit deliberately does NOT show:** engagement audience, outbound clicks and total
audience. It leads with top-pin detail, top-board views, impressions, saves, pin clicks,
followers, save rate and monthly views instead.

## Editing the numbers

1. Open `data.json` and replace the sample values with your Pinterest Analytics export.
2. Set `"draft": false` under `meta` — this removes the "sample figures" banner from every page.
3. Rebuild:

```bash
npm install          # first time only
npm run build        # writes media-kit.pdf and index.html
```

Everything — headings, chart labels, percentages, price tables — is generated from `data.json`.
Change a number once and it updates on every page that uses it.

## Previewing

```bash
npm run preview      # serves this folder on port 5173
```

Open `index.html` for the scrollable kit, or press **Print / Save as PDF** in the page header to
get a PDF straight from the browser. The PDF in this folder is already generated for you.

## Notes for whoever maintains this

- **The preview and the PDF are the same artwork.** Every page is composed once by
  `kit/pages-*.mjs` against a shared drawing API (`kit/canvas.mjs`) that has two backends —
  SVG for the web page and PDFKit for the PDF. They cannot drift apart.
- Fonts are embedded in both outputs, so the files render identically on any machine that has
  never seen Manrope or Playfair Display. Both are SIL Open Font License; see
  `assets/fonts/OFL-LICENSE.txt`.
- The QR code on page 14 is generated from `contact.qrTarget` in `data.json`.
- Charts (donuts, bars, sparklines, line charts, heatmap) are drawn by hand in `kit/charts.mjs`
  — no chart library, so nothing renders differently across viewers.
- Prices are labelled in INR excluding GST; adjust the copy in `data.json` → `packages`.
