// References section of the talk, as an editable PowerPoint deck.
// Lists every work cited in the five section decks, alphabetically, with the short
// citation used on the slides above each full reference (Nature style).
// Usage: python3 build_refs.py <refs.json>
//        NODE_PATH=<dir with pptxgenjs> PPTX_SKILL=<pptx skill dir> node make_references_pptx.js <refs.json> <out.pptx>
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts", "apply_theme.js"));

const REFS = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const OUT = process.argv[3];

// ------------------------------------------------------------------ theme (shared by all section decks)
const THEME = {
  name: "Inertial reputation",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "23373B", lt1: "FFFFFF", dk2: "3A4E52", lt2: "EEF2F3",
    accent1: "E07B16", accent2: "2F6E9E", accent3: "C9506A", accent4: "3E8E5E",
    accent5: "66767B", accent6: "A65A10", hlink: "2F6E9E", folHlink: "66767B",
  },
};
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.title = "Indirect reciprocity with inertial reputation updating: references";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const MX = 0.5, CW = 9.0;
const SEC = "References";

pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: INK },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.75, y: 1.0, w: 8.5, h: 1.35,
        fontSize: 32, bold: true, color: WHITE, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 0.75, y: 2.5, w: 8.5, h: 0.45,
        fontSize: 18, color: ORANGE, align: "left", valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "author", type: "body", x: 0.75, y: 3.05, w: 8.5, h: 0.4,
        fontSize: 14, color: CARD, align: "left", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: WHITE },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.28, w: CW, h: 0.62,
        fontSize: 24, bold: true, color: INK, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.13, w: 0.5, h: 0.28, fontSize: 10, color: MUTED, align: "right" },
});

// ------------------------------------------------------------------ packing
// Estimate the height of an entry (citation line + wrapped reference) at the given sizes.
const COL_W = 4.25, TOP = 1.1, BOTTOM = 4.98, GAP = 0.12;
const PT_CITE = 11, PT_REF = 10.5;
const lineH = (pt) => (pt * 1.2) / 72;
const charsPerLine = Math.floor(COL_W / (0.44 * PT_REF / 72));
function entryHeight(e) {
  const n = e.runs.reduce((k, r) => k + r.text.length, 0);
  return lineH(PT_CITE) + Math.ceil(n / charsPerLine) * lineH(PT_REF) + GAP;
}
// Use the smallest even number of columns that holds everything, then balance the
// entries across those columns by estimated height (order stays alphabetical).
const CAP = BOTTOM - TOP;
const heights = REFS.map(entryHeight);
const total = heights.reduce((a, b) => a + b, 0);
let nCols = 2 * Math.ceil(total / (2 * CAP));
let columns;
for (;;) {
  const target = total / nCols;
  columns = []; let col = [], h = 0, ok = true;
  REFS.forEach((e, i) => {
    const eh = heights[i];
    const remainingCols = nCols - columns.length - 1;
    if (col.length && (h + eh / 2 > target) && remainingCols > 0) { columns.push(col); col = []; h = 0; }
    col.push(e); h += eh;
    if (h > CAP) ok = false;
  });
  columns.push(col);
  if (ok) break;
  nCols += 2;
}
const pages = [];
for (let i = 0; i < columns.length; i += 2) pages.push(columns.slice(i, i + 2));

function entryRuns(list) {
  const out = [];
  list.forEach((e, i) => {
    out.push({ text: e.cite, options: { bold: true, color: ORANGE_TEXT, fontSize: PT_CITE, breakLine: true } });
    e.runs.forEach((r, k) => {
      const o = { fontSize: PT_REF, color: INK };
      if (r.italic) o.italic = true;
      if (r.bold) o.bold = true;
      if (k === e.runs.length - 1 && i < list.length - 1) { o.breakLine = true; o.paraSpaceAfter = 7; }
      out.push({ text: r.text, options: o });
    });
  });
  return out;
}

(async () => {
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("References", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  s.addNotes(`Works cited in the talk, ${REFS.length} in total, in alphabetical order.`);

  pres.addSection({ title: SEC });
  pages.forEach((cols, p) => {
    s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    s.addText(pages.length > 1 ? `References (${p + 1} of ${pages.length})` : "References", { placeholder: "title" });
    cols.forEach((list, c) => {
      s.addText(entryRuns(list), { objectName: `References column ${c + 1}`, isTextBox: true, x: MX + c * (COL_W + 0.5), y: TOP, w: COL_W, h: BOTTOM - TOP,
        margin: 0, valign: "top", fontSize: PT_REF, color: INK });
    });
    if (cols.length === 2) s.addShape(pres.shapes.LINE, { objectName: "Column rule", x: MX + COL_W + 0.25, y: TOP, w: 0, h: BOTTOM - TOP - 0.1, line: { color: CARD, width: 1 } });
    const first = cols[0][0].cite, last = cols[cols.length - 1][cols[cols.length - 1].length - 1].cite;
    s.addNotes(`References ${first} to ${last}. Short citations in orange match those used on the slides.`);
  });

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "with", pages.length, "reference slides;", columns.map((c) => c.length).join("/"), "entries per column");
})();
