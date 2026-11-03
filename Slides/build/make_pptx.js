// Build the editable PowerPoint version from deck.json (written by make_assets.py).
// Usage: node make_pptx.js <asset_dir> <output.pptx>
// Equations are inserted as images named "EQ:<id>:<n>"; inject_omml.py then wraps
// each of them with a native, editable Office Math object (the image stays as fallback).
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");

const ASSETS = process.argv[2];
const OUTFILE = process.argv[3];
const deck = JSON.parse(fs.readFileSync(path.join(ASSETS, "deck.json"), "utf8"));
const SKILL = process.env.PPTX_SKILL;
const { applyTheme } = require(path.join(SKILL, "scripts", "apply_theme.js"));

// ------------------------------------------------------------------ theme and constants
const THEME = {
  name: "Inertial reputation",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "23373B", lt1: "FFFFFF", dk2: "23373B", lt2: "EEF2F3",
    accent1: "EB811B", accent2: "2F6E9E", accent3: "3E8E5E", accent4: "8C2D19",
    accent5: "6B7B80", accent6: "A3B6BC", hlink: "2F6E9E", folHlink: "6B7B80",
  },
};
const HEX = { ink: "23373B", accent: "EB811B", blue: "2F6E9E", muted: "6B7B80", card: "EEF2F3",
              accentDark: "A65A10", blueDark: "24577E", chip: "3A4E52", good: "3B7DB8", bad: "E58A9A",
              rule: "BFC8CB", light: "C4CED1" };
const W = 10, H = 5.625, MX = 0.5;
const TOP = 0.95, BOTTOM = 5.02;
const FS = { normal: 15.5, small: 14, footnotesize: 12.5, caption: 11, note: 10.5, source: 10,
             cardTitle: 13.5, takeaway: 14, title: 20 };
const GAP = 0.12;

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Indirect reciprocity with inertial reputation updating";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ------------------------------------------------------------------ layouts
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.75, y: 1.15, w: 8.5, h: 1.25,
        fontSize: 32, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 0.75, y: 2.5, w: 8.5, h: 0.45,
        fontSize: 18, color: C.accent1, margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "SECTION_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.75, y: 2.35, w: 8.5, h: 0.75,
        fontSize: 32, bold: true, color: C.background1, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.2, w: 7.4, h: 0.6,
        fontSize: FS.title, bold: true, color: C.text1, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.05, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: HEX.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "STANDOUT_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.95, y: 0.95, w: 8.1, h: 2.15,
        fontSize: 26, bold: true, color: C.background1, valign: "middle", margin: 0 }, text: "" } },
  ],
});

// ------------------------------------------------------------------ text helpers
function runsToText(runs, base = {}) {
  // runs: [{text, italic, bold, sub, sup, accent}] -> pptxgenjs text array
  return runs.map((r) => {
    const o = Object.assign({}, base);
    if (r.italic) o.italic = true;
    if (r.bold || base.bold) o.bold = true;
    if (r.sub) o.subscript = true;
    if (r.sup) o.superscript = true;
    if (r.accent) o.color = C.accent1;
    return { text: r.text, options: o };
  });
}
function plainLen(runs) { return runs.reduce((n, r) => n + r.text.length, 0); }
function lines(runs, wIn, pt, indent = 0) {
  const cpl = Math.max(8, (wIn - indent - 0.1) / (0.5 * pt / 72));
  return Math.max(1, Math.ceil(plainLen(runs) / cpl));
}
const LH = (pt) => (pt * 1.18) / 72;
function paragraphs(list, base, bullet) {
  // list of run arrays -> one pptxgenjs text array with paragraph breaks
  const out = [];
  list.forEach((runs, i) => {
    const t = runsToText(runs, base);
    if (bullet) t.forEach((x) => { x.options.bullet = { code: "25B8", indent: 14 }; x.options.paraSpaceAfter = 4; });
    if (i < list.length - 1 && t.length) t[t.length - 1].options.breakLine = true;
    out.push(...t);
  });
  return out;
}

// ------------------------------------------------------------------ elements: measure
function measure(el, w) {
  switch (el.type) {
    case "bullets": {
      const pt = FS[el.size];
      return el.items.reduce((h, it) => h + lines(it, w, pt, 0.25) * LH(pt) + 4 / 72, 0) + 0.08;
    }
    case "text": {
      const pt = FS[el.size];
      return lines(el.text, w, pt) * LH(pt) + 0.06;
    }
    case "eq": {
      const e = deck.equations[el.id];
      const s = Math.min(1, (w - 0.1) / e.w);
      return (el.lead ? lines(el.lead, w, FS.small) * LH(FS.small) + 0.04 : 0) + e.h * s + 0.1;
    }
    case "card": {
      const iw = w - 0.24;
      let h = LH(FS.cardTitle) + 0.06;
      if (el.body) h += lines(el.body, iw, FS.small) * LH(FS.small);
      (el.items || []).forEach((it) => { h += lines(it, iw, FS.small, 0.25) * LH(FS.small) + 3 / 72; });
      return h + 0.22;
    }
    case "cards": {
      const n = el.cards.length, cw = (w - 0.2 * (n - 1)) / n;
      return Math.max(...el.cards.map((c) => measure(c, cw))) + 0.04;
    }
    case "takeaway": return lines(el.text, w - 0.24, FS.takeaway) * LH(FS.takeaway) + 0.22;
    case "figure": return (BOTTOM - TOP) * el.h + (el.caption ? lines(el.caption, w, FS.caption) * LH(FS.caption) + 0.08 : 0);
    case "caption": return lines(el.text, w, FS.caption) * LH(FS.caption) + 0.06;
    case "note": return lines(el.text, w, FS.note) * LH(FS.note) + 0.05;
    case "table": {
      const pt = FS[el.size] - 1;
      let h = 0;
      const rows = [el.header].concat(el.rows);
      rows.forEach((r) => { h += Math.max(...r.map((c, j) => lines(c, w * el.widths[j], pt))) * LH(pt) + 0.09; });
      return h + 0.08;
    }
    case "flow": return 0.92;
    case "sequence": return 1.32;
    case "agenda": return el.items.length * 0.62;
    case "qa": return el.rows.reduce((h, r) => h + Math.max(lines(r[0], w * 0.31, FS.small), lines(r[1], w * 0.64, FS.small)) * LH(FS.small) + 0.2, 0.05);
  }
  throw new Error("unknown element " + el.type);
}

// ------------------------------------------------------------------ elements: render
let eqCounter = 0;
function render(slide, el, x, y, w) {
  const h = measure(el, w);
  switch (el.type) {
    case "bullets":
      slide.addText(paragraphs(el.items, { fontSize: FS[el.size], color: C.text1 }, true),
        { x, y, w, h, margin: 0, valign: "top", isTextBox: true, objectName: "Bullets" });
      break;
    case "text": {
      const base = { fontSize: FS[el.size], color: el.color === "muted" ? HEX.muted : C.text1, bold: !!el.bold };
      slide.addText(runsToText(el.text, base), { x, y, w, h, margin: 0, valign: "top", isTextBox: true, objectName: "Text" });
      break;
    }
    case "eq": {
      const e = deck.equations[el.id];
      let yy = y;
      if (el.lead) {
        const lh = lines(el.lead, w, FS.small) * LH(FS.small);
        slide.addText(runsToText(el.lead, { fontSize: FS.small, color: C.text1 }),
          { x, y: yy, w, h: lh, margin: 0, valign: "top", isTextBox: true, objectName: "Equation lead" });
        yy += lh + 0.04;
      }
      const s = Math.min(1, (w - 0.1) / e.w);
      const ew = e.w * s, eh = e.h * s;
      eqCounter += 1;
      slide.addImage({ path: e.png, x: x + (w - ew) / 2, y: yy + 0.03, w: ew, h: eh,
        altText: e.tex, objectName: `EQ:${el.id}:${eqCounter}:${(x).toFixed(3)}:${w.toFixed(3)}:${s.toFixed(3)}` });
      break;
    }
    case "card": {
      const titleColor = el.style === "accent" ? HEX.accentDark : el.style === "blue" ? HEX.blueDark : C.text1;
      const fill = el.style === "accent" ? { color: C.accent1, transparency: 84 }
        : el.style === "blue" ? { color: C.accent2, transparency: 87 } : { color: C.background2 };
      const parts = [{ text: el.title.map((r) => r.text).join(""), options: { bold: true, fontSize: FS.cardTitle, color: titleColor, breakLine: true, paraSpaceAfter: 3 } }];
      if (el.title.some((r) => r.italic || r.sub || r.sup)) {
        parts.splice(0, 1, ...runsToText(el.title, { bold: true, fontSize: FS.cardTitle, color: titleColor }));
        parts[parts.length - 1].options.breakLine = true;
        parts[parts.length - 1].options.paraSpaceAfter = 3;
      }
      if (el.body) {
        const t = runsToText(el.body, { fontSize: FS.small, color: C.text1 });
        if (el.items && el.items.length) t[t.length - 1].options.breakLine = true;
        parts.push(...t);
      }
      if (el.items && el.items.length) parts.push(...paragraphs(el.items, { fontSize: FS.small, color: C.text1 }, true));
      slide.addText(parts, { x, y, w, h, shape: pres.ShapeType.roundRect, rectRadius: 0.06, fill,
        margin: [6, 9, 6, 9], valign: "top", isTextBox: true, objectName: "Card" });
      break;
    }
    case "cards": {
      const n = el.cards.length, cw = (w - 0.2 * (n - 1)) / n;
      const ch = Math.max(...el.cards.map((c) => measure(c, cw)));
      el.cards.forEach((c, i) => {
        // equal heights within a row of cards
        const saved = measure; // eslint-disable-line no-unused-vars
        renderCardFixed(slide, c, x + i * (cw + 0.2), y, cw, ch);
      });
      break;
    }
    case "takeaway":
      slide.addText(runsToText(el.text, { fontSize: FS.takeaway, color: C.text1 }),
        { x, y, w, h, shape: pres.ShapeType.roundRect, rectRadius: 0.05,
          fill: { color: C.accent1, transparency: 85 }, margin: [5, 9, 5, 9], valign: "middle",
          isTextBox: true, objectName: "Key message" });
      break;
    case "figure": {
      const fig = deck.figures[el.file];
      const bh = (BOTTOM - TOP) * el.h;
      let fw = w, fh = fw / fig.aspect;
      if (fh > bh) { fh = bh; fw = fh * fig.aspect; }
      slide.addImage({ path: fig.png, x: x + (w - fw) / 2, y, w: fw, h: fh, altText: el.file, objectName: "Figure " + el.file });
      if (el.caption) {
        slide.addText(runsToText(el.caption, { fontSize: FS.caption, color: HEX.muted }),
          { x, y: y + fh + 0.08, w, h: lines(el.caption, w, FS.caption) * LH(FS.caption), margin: 0, valign: "top",
            isTextBox: true, objectName: "Caption" });
      }
      break;
    }
    case "caption":
      slide.addText(runsToText(el.text, { fontSize: FS.caption, color: HEX.muted }),
        { x, y, w, h, margin: 0, valign: "top", isTextBox: true, objectName: "Caption" });
      break;
    case "note":
      slide.addText(runsToText(el.text, { fontSize: FS.note, color: HEX.muted, italic: true }),
        { x, y, w, h, margin: 0, valign: "top", isTextBox: true, objectName: "Note" });
      break;
    case "table": {
      const pt = FS[el.size] - 1;
      const rows = [];
      const nrows = el.rows.length;
      const cell = (runs, opts) => ({ text: runsToText(runs, { fontSize: pt, color: C.text1, bold: !!opts.bold }), options: opts.o });
      rows.push(el.header.map((c) => cell(c, { bold: true, o: { fill: { color: C.background2 },
        border: [{ pt: 1, color: HEX.ink }, { type: "none" }, { pt: 0.75, color: HEX.ink }, { type: "none" }] } })));
      el.rows.forEach((r, i) => rows.push(r.map((c, j) => cell(c, { bold: el.first_bold && j === 0, o: {
        border: [{ type: "none" }, { type: "none" }, i === nrows - 1 ? { pt: 1, color: HEX.ink } : { pt: 0.5, color: HEX.light }, { type: "none" }] } }))));
      slide.addTable(rows, { x, y, w, colW: el.widths.map((f) => f * w), margin: [3, 5, 3, 5], valign: "middle",
        fontFace: THEME.bodyFontFace, objectName: "Table" });
      break;
    }
    case "flow": {
      const n = el.nodes.length, cw = 0.42, nw = (w - cw * (n - 1)) / n, nh = 0.72, ny = y + 0.08;
      el.nodes.forEach((runs, i) => {
        const nx = x + i * (nw + cw);
        const parts = [];
        let cur = [];
        runs.forEach((r) => {
          const pieces = r.text.split("\n");
          pieces.forEach((p, k) => {
            if (k > 0) { parts.push(cur); cur = []; }
            if (p) cur.push(Object.assign({}, r, { text: p }));
          });
        });
        parts.push(cur);
        slide.addText(paragraphs(parts, { fontSize: FS.footnotesize, color: C.text1 }, false),
          { x: nx, y: ny, w: nw, h: nh, shape: pres.ShapeType.roundRect, rectRadius: 0.06,
            fill: { color: C.background2 }, align: "center", valign: "middle", margin: 3, isTextBox: true,
            objectName: "Flow node" });
        if (i < n - 1) {
          const c = el.connectors[i];
          if (c === "+") {
            slide.addText("+", { x: nx + nw, y: ny, w: cw, h: nh, fontSize: 22, bold: true, color: C.accent1,
              align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Connector" });
          } else {
            slide.addShape(pres.ShapeType.line, { x: nx + nw + 0.06, y: ny + nh / 2, w: cw - 0.12, h: 0,
              line: { color: HEX.accent, width: 2.25, endArrowType: "triangle" }, objectName: "Arrow" });
          }
        }
      });
      break;
    }
    case "sequence": {
      const n = el.assess.length, d = 0.34, step = 0.62;
      const x0 = x + (w - (n - 1) * step - d) / 2 + 0.3;
      slide.addText("assessment", { x: x0 - 1.25, y: y + 0.05, w: 1.1, h: d, fontSize: 11, color: HEX.muted,
        align: "right", valign: "middle", margin: 0, isTextBox: true, objectName: "Label" });
      slide.addText("image", { x: x0 - 1.25, y: y + 0.5, w: 1.1, h: d, fontSize: 11, color: HEX.muted,
        align: "right", valign: "middle", margin: 0, isTextBox: true, objectName: "Label" });
      el.assess.forEach((a, i) => {
        const neg = a !== "+";
        slide.addText(neg ? "−" : "+", { x: x0 + i * step, y: y + 0.05, w: d, h: d, shape: pres.ShapeType.ellipse,
          fill: { color: C.background1 }, line: { color: neg ? HEX.bad : HEX.muted, width: 1.25 },
          fontSize: 13, bold: true, color: neg ? "B04A5E" : C.text1, align: "center", valign: "middle", margin: 0,
          objectName: "Assessment" });
        const g = el.images[i];
        slide.addText(g, { x: x0 + i * step, y: y + 0.5, w: d, h: d, shape: pres.ShapeType.ellipse,
          fill: { color: g === "B" ? HEX.bad : HEX.good }, line: { type: "none" },
          fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, objectName: "Image" });
      });
      const ax = x0 - 0.15, ay = y + 0.98, aw = (n - 1) * step + d + 0.35;
      slide.addShape(pres.ShapeType.line, { x: ax, y: ay, w: aw, h: 0, line: { color: HEX.muted, width: 1, endArrowType: "triangle" }, objectName: "Time axis" });
      slide.addText("time", { x: ax + aw + 0.05, y: ay - 0.13, w: 0.6, h: 0.26, fontSize: 11, color: HEX.muted, margin: 0, isTextBox: true, objectName: "Label" });
      break;
    }
    case "agenda": {
      el.items.forEach((it, i) => {
        const yy = y + i * 0.62;
        slide.addText(it[0].map((r) => r.text).join(""), { x, y: yy + 0.05, w: 0.38, h: 0.38, shape: pres.ShapeType.ellipse,
          fill: { color: C.accent1 }, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle",
          margin: 0, objectName: "Number" });
        slide.addText(runsToText(it[1], { fontSize: FS.normal, bold: true, color: C.text1 }).concat(
          [{ text: "", options: { breakLine: true } }],
          runsToText(it[2], { fontSize: FS.small, color: HEX.muted })),
          { x: x + 0.55, y: yy, w: w - 0.55, h: 0.56, margin: 0, valign: "middle", isTextBox: true, objectName: "Agenda item" });
      });
      break;
    }
    case "qa": {
      const rows = el.rows.map((r, i) => {
        const last = i === el.rows.length - 1;
        const b = [i === 0 ? { pt: 1, color: HEX.ink } : { type: "none" }, { type: "none" },
                   last ? { pt: 1, color: HEX.ink } : { pt: 0.5, color: HEX.light }, { type: "none" }];
        return [{ text: runsToText(r[0], { fontSize: FS.small, bold: true, color: C.accent2 }), options: { border: b } },
                { text: runsToText(r[1], { fontSize: FS.small, color: C.text1 }), options: { border: b } }];
      });
      slide.addTable(rows, { x, y, w, colW: [w * 0.33, w * 0.67], margin: [6, 6, 6, 6], valign: "middle",
        fontFace: THEME.bodyFontFace, objectName: "Questions and answers" });
      break;
    }
    default:
      throw new Error("unknown element " + el.type);
  }
  return h;
}
function renderCardFixed(slide, c, x, y, w, h) {
  const orig = measure;
  // draw with the common row height
  const el = Object.assign({}, c);
  const titleColor = el.style === "accent" ? HEX.accentDark : el.style === "blue" ? HEX.blueDark : C.text1;
  const fill = el.style === "accent" ? { color: C.accent1, transparency: 84 }
    : el.style === "blue" ? { color: C.accent2, transparency: 87 } : { color: C.background2 };
  const parts = runsToText(el.title, { bold: true, fontSize: FS.cardTitle, color: titleColor });
  parts[parts.length - 1].options.breakLine = true;
  parts[parts.length - 1].options.paraSpaceAfter = 3;
  if (el.body) {
    const t = runsToText(el.body, { fontSize: FS.small, color: C.text1 });
    if (el.items && el.items.length) t[t.length - 1].options.breakLine = true;
    parts.push(...t);
  }
  if (el.items && el.items.length) parts.push(...paragraphs(el.items, { fontSize: FS.small, color: C.text1 }, true));
  slide.addText(parts, { x, y, w, h, shape: pres.ShapeType.roundRect, rectRadius: 0.06, fill,
    margin: [6, 9, 6, 9], valign: "top", isTextBox: true, objectName: "Card" });
  return orig;
}

function stack(slide, els, x, y0, w, y1) {
  let y = y0;
  els.forEach((el) => {
    const h = el.type === "card" ? (renderCardFixed(slide, el, x, y, w, measure(el, w)), measure(el, w)) : render(slide, el, x, y, w);
    y += h + GAP;
  });
  if (y - GAP > y1 + 0.02) console.warn(`  overflow ${(y - GAP - y1).toFixed(2)} in on "${currentTitle}"`);
  return y;
}

// ------------------------------------------------------------------ slide decorations
function addTag(slide, runs) {
  const txt = runs.map((r) => r.text).join("");
  const isA = txt.trim().startsWith("Storyline A");
  const tw = 0.11 * txt.length * 0.62 + 0.3;
  slide.addText(txt, { x: W - 0.42 - tw, y: 0.28, w: tw, h: 0.3, shape: pres.ShapeType.roundRect, rectRadius: 0.04,
    fill: { color: isA ? C.accent2 : C.accent1, transparency: 85 }, fontSize: 10, bold: true,
    color: isA ? HEX.blueDark : HEX.accentDark, align: "center", valign: "middle", margin: 0, objectName: "Storyline tag" });
}
function addSource(slide, runs) {
  slide.addText(runsToText(runs, { fontSize: FS.source, color: HEX.muted }),
    { x: MX, y: 5.12, w: 8.4, h: 0.38, margin: 0, valign: "middle", isTextBox: true, objectName: "Source" });
}

// ------------------------------------------------------------------ slide builders
let currentTitle = "";
let section = null;
function newSlide(master) { return pres.addSlide({ masterName: master, sectionTitle: section }); }

function titleSlide(s) {
  const slide = newSlide("TITLE_DARK");
  slide.addText(s.title.map((r) => r.text).join(""), { placeholder: "title" });
  slide.addText(s.subtitle.map((r) => r.text).join(""), { placeholder: "subtitle" });
  slide.addText([
    { text: s.author.map((r) => r.text).join(""), options: { bold: true, fontSize: 16, color: C.background1, breakLine: true } },
    { text: s.institute.map((r) => r.text).join(""), options: { fontSize: 13.5, color: HEX.light, breakLine: true } },
    { text: " ", options: { fontSize: 8, breakLine: true } },
    { text: s.date.map((r) => r.text).join(""), options: { fontSize: 13.5, color: HEX.light } },
  ], { x: 0.75, y: 3.35, w: 8.5, h: 1.3, margin: 0, valign: "top", isTextBox: true, objectName: "Author block" });
}
function sectionSlide(s) {
  section = s.number + "  " + s.title.map((r) => r.text).join("");
  pres.addSection({ title: section });
  const slide = newSlide("SECTION_DARK");
  slide.addText(s.number, { x: 0.75, y: 1.3, w: 3, h: 1.0, fontSize: 60, bold: true, color: C.accent1, margin: 0,
    valign: "bottom", isTextBox: true, objectName: "Section number" });
  slide.addText(s.title.map((r) => r.text).join(""), { placeholder: "title" });
}
function contentSlide(s) {
  const slide = newSlide("CONTENT");
  currentTitle = s.title.map((r) => r.text).join("");
  slide.addText(runsToText(s.title, {}), { placeholder: "title" });
  if (s.tag) addTag(slide, s.tag);
  if (s.source) addSource(slide, s.source);
  const y1 = s.source ? 5.05 : BOTTOM;
  if (s.layout === "two") {
    const cw = W - 2 * MX, lw = cw * s.ratio, rw = cw * (0.96 - s.ratio), rx = MX + cw - rw;
    const yl = stack(slide, s.left, MX, TOP, lw, y1);
    const yr = stack(slide, s.right, rx, TOP, rw, y1);
    if (s.bottom) stack(slide, s.bottom, MX, Math.max(yl, yr), cw, y1);
  } else {
    stack(slide, s.body, MX, TOP, W - 2 * MX, y1);
  }
}
function figureSlide(s) {
  const slide = newSlide("CONTENT");
  currentTitle = s.title.map((r) => r.text).join("");
  slide.addText(runsToText(s.title, {}), { placeholder: "title" });
  const fig = deck.figures[s.fig];
  if (s.side) {
    const bw = 6.0, bh = BOTTOM - TOP;
    let fw = bw, fh = fw / fig.aspect;
    if (fh > bh) { fh = bh; fw = fh * fig.aspect; }
    slide.addImage({ path: fig.png, x: MX + (bw - fw) / 2, y: TOP, w: fw, h: fh, altText: s.fig, objectName: "Figure " + s.fig });
    const rx = MX + bw + 0.25, rw = W - MX - rx;
    const els = [{ type: "caption", text: s.caption }, { type: "takeaway", text: s.takeaway }];
    if (s.note) els.push({ type: "note", text: s.note });
    stack(slide, els, rx, TOP, rw, BOTTOM);
  } else {
    const bw = W - 2 * MX, bh = 2.55;
    let fw = bw, fh = fw / fig.aspect;
    if (fh > bh) { fh = bh; fw = fh * fig.aspect; }
    slide.addImage({ path: fig.png, x: MX + (bw - fw) / 2, y: TOP, w: fw, h: fh, altText: s.fig, objectName: "Figure " + s.fig });
    const els = [{ type: "caption", text: s.caption }, { type: "takeaway", text: s.takeaway }];
    if (s.note) els.push({ type: "note", text: s.note });
    stack(slide, els, MX, TOP + fh + 0.12, bw, BOTTOM);
  }
}
function standoutSlide(s) {
  const slide = newSlide("STANDOUT_DARK");
  slide.addText(s.title.map((r) => r.text).join(""), { placeholder: "title" });
  const n = s.chips.length, cw = 2.62, gap = 0.14, x0 = (W - (n * cw + (n - 1) * gap)) / 2;
  s.chips.forEach((runs, i) => {
    slide.addText(runsToText(runs, { fontSize: 13, color: C.background1 }), { x: x0 + i * (cw + gap), y: 3.45, w: cw, h: 0.95,
      shape: pres.ShapeType.roundRect, rectRadius: 0.06, fill: { color: HEX.chip }, margin: [5, 8, 5, 8],
      valign: "middle", isTextBox: true, objectName: "Contribution" });
  });
}
function referenceSlides(s) {
  const refs = deck.references, per = 14;
  for (let p = 0; p * per < refs.length; p++) {
    const slide = newSlide("CONTENT");
    slide.addText(`References (${p + 1}/${Math.ceil(refs.length / per)})`, { placeholder: "title" });
    const chunk = refs.slice(p * per, (p + 1) * per);
    const half = Math.ceil(chunk.length / 2);
    [chunk.slice(0, half), chunk.slice(half)].forEach((col, j) => {
      const t = [];
      col.forEach((runs, i) => {
        const r = runsToText(runs, { fontSize: 10, color: C.text1 });
        r[r.length - 1].options.paraSpaceAfter = 5;
        if (i < col.length - 1) r[r.length - 1].options.breakLine = true;
        t.push(...r);
      });
      slide.addText(t, { x: MX + j * 4.6, y: TOP, w: 4.4, h: BOTTOM - TOP, margin: 0, valign: "top", isTextBox: true, objectName: "Reference list" });
    });
  }
}

// ------------------------------------------------------------------ build
pres.addSection({ title: "Opening" });
section = "Opening";
for (const s of deck.slides) {
  switch (s.kind) {
    case "title": titleSlide(s); break;
    case "section": sectionSlide(s); break;
    case "content": contentSlide(s); break;
    case "figure": figureSlide(s); break;
    case "standout": standoutSlide(s); break;
    case "references": referenceSlides(s); break;
    default: throw new Error(s.kind);
  }
}

(async () => {
  await pres.writeFile({ fileName: OUTFILE });
  await applyTheme(OUTFILE, THEME);
  console.log("wrote", OUTFILE, "equations:", eqCounter);
})();
