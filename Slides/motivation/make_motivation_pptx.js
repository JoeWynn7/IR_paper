// Section 1 of the talk, "Motivation and research gap", as an editable PowerPoint deck.
// The storyline follows Manuscript_doc/intro_revisions/Introduction_final.tex.
// Usage: NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
//        PPTX_SKILL=<pptx skill dir> node make_motivation_pptx.js <output.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts", "apply_theme.js"));

const OUT = process.argv[2];

// ------------------------------------------------------------------ theme
// Same ink and orange as the main deck. Blue marks good standing and positive
// assessments, rose marks bad standing and negative assessments (as in Fig. 1).
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
pres.title = "Indirect reciprocity with inertial reputation updating: motivation and research gap";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;

const FS = { title: 24, cardTitle: 16, body: 14, small: 12, ref: 10.5, source: 10 };
const MX = 0.5, CW = 9.0;

// ------------------------------------------------------------------ layouts
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
        fontSize: FS.title, bold: true, color: INK, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.13, w: 0.5, h: 0.28, fontSize: 10, color: MUTED, align: "right" },
});
pres.defineSlideMaster({
  title: "STATEMENT_DARK",
  background: { color: INK },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.95, y: 1.05, w: 8.1, h: 0.4,
        fontSize: 15, bold: true, color: ORANGE, align: "left", valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.95, y: 1.55, w: 8.1, h: 1.75,
        fontSize: 30, bold: true, color: WHITE, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "note", type: "body", x: 0.95, y: 3.55, w: 8.1, h: 0.9,
        fontSize: 16, color: CARD, align: "left", valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.13, w: 0.5, h: 0.28, fontSize: 10, color: CARD, align: "right" },
});

// ------------------------------------------------------------------ helpers
async function iconData(Comp, hex = "#FFFFFF") {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: hex, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
function text(slide, t, o) { slide.addText(t, Object.assign({ isTextBox: true, margin: 0, fontSize: FS.body, color: INK, valign: "top" }, o)); }
function card(slide, name, x, y, w, h, opt = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ objectName: name, x, y, w, h, rectRadius: 0.08,
    fill: { color: CARD }, line: { color: CARD, width: 0 } }, opt));
}
function iconCircle(slide, name, data, x, y, d, fill = INK) {
  slide.addShape(pres.shapes.OVAL, { objectName: name + " circle", x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  const s = d * 0.52;
  slide.addImage({ objectName: name + " icon", data, x: x + (d - s) / 2, y: y + (d - s) / 2, w: s, h: s });
}
function arrow(slide, name, x1, y1, x2, y2, color, o = {}) {
  const flipH = x2 < x1, flipV = y2 < y1;
  slide.addShape(pres.shapes.LINE, { objectName: name, x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH, flipV,
    line: Object.assign({ color, width: 2, endArrowType: "triangle" }, o) });
}
function dot(slide, name, x, y, d, fill, label, labelColor = WHITE, pt = 13) {
  slide.addShape(pres.shapes.OVAL, { objectName: name, x, y, w: d, h: d, fill: { color: fill.color, transparency: fill.transparency || 0 },
    line: { color: fill.color, width: 0 } });
  if (label) slide.addText(label, { objectName: name + " label", isTextBox: true, x, y, w: d, h: d, margin: 0,
    align: "center", valign: "middle", fontSize: pt, bold: true, color: labelColor });
}
function sources(slide, s) {
  s = s.split(" · ").map((c) => c.replace(/ /g, "\u00A0")).join(" · ");
  text(slide, s, { objectName: "Sources", x: MX, y: 5.02, w: 8.3, h: 0.4, fontSize: FS.source, color: MUTED });
}
const sub = (t, o = {}) => ({ text: t, options: Object.assign({ subscript: true }, o) });

(async () => {
  const ic = {
    donor: await iconData(fa.FaHandHoldingHeart), recipient: await iconData(fa.FaUser), observer: await iconData(fa.FaEye),
    accurate: await iconData(fa.FaBullseye), shared: await iconData(fa.FaUsers), agree: await iconData(fa.FaHandshake),
    info: await iconData(fa.FaLayerGroup), commons: await iconData(fa.FaWater), record: await iconData(fa.FaGavel),
  };

  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 1 · Motivation and research gap", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  // Motif: a reputation path from good to bad through warning states.
  {
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19, 2.91];
    const nodes = [["G", { color: GOOD }, WHITE], ["W", { color: BAD, transparency: 70 }, WHITE], ["W", { color: BAD, transparency: 45 }, WHITE], ["B", { color: BAD }, WHITE]];
    nodes.forEach((n, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, n[1], null);
      const label = i === 1 ? [{ text: "W" }, sub("1")] : i === 2 ? [{ text: "W" }, sub("2")] : n[0];
      s.addText(label, { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: n[2] });
      if (i < 3) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, BAD, { width: 1.5 });
    });
  }
  s.addNotes("This part motivates the question of the paper. The small diagram is the idea in one line: a good reputation does not turn bad at once, but passes through warning states.");

  // ================================================================ 2. Indirect reciprocity
  pres.addSection({ title: "Motivation and research gap" });
  const SEC = "Motivation and research gap";
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Reputation sustains cooperation among strangers", { placeholder: "title" });
  {
    const d = 0.8;
    iconCircle(s, "Observer", ic.observer, 2.35, 1.3, d);
    iconCircle(s, "Donor", ic.donor, 0.75, 3.05, d);
    iconCircle(s, "Recipient", ic.recipient, 3.95, 3.05, d);
    text(s, "Observer", { objectName: "Observer name", x: 0.5, y: 1.55, w: 1.7, h: 0.3, bold: true, align: "right" });
    text(s, "Donor", { objectName: "Donor name", x: 0.45, y: 3.95, w: 1.4, h: 0.3, bold: true, align: "center" });
    text(s, "Recipient", { objectName: "Recipient name", x: 3.65, y: 3.95, w: 1.4, h: 0.3, bold: true, align: "center" });
    arrow(s, "Help arrow", 1.65, 3.45, 3.85, 3.45, INK);
    text(s, "helps or refuses", { objectName: "Help label", x: 1.65, y: 3.12, w: 2.2, h: 0.28, align: "center", color: MUTED });
    arrow(s, "Assessment arrow", 2.45, 2.05, 1.5, 3.0, INK, { dashType: "dash", width: 1.75 });
    text(s, "judges the donor's action with a social norm", { objectName: "Assessment label", x: 3.3, y: 1.38, w: 1.8, h: 0.7, color: MUTED });
    text(s, "Donors in good standing are later helped by others.", { objectName: "Diagram note", x: 0.5, y: 4.42, w: 4.6, h: 0.3, italic: true, color: MUTED });
  }
  card(s, "Card indirect reciprocity", 5.45, 1.2, 4.05, 1.6);
  text(s, "Indirect reciprocity", { objectName: "Card 1 title", x: 5.7, y: 1.36, w: 3.6, h: 0.32, fontSize: FS.cardTitle, bold: true });
  text(s, "Helping others improves one's standing. Individuals in good standing are more likely to receive help from third parties.",
    { objectName: "Card 1 body", x: 5.7, y: 1.74, w: 3.6, h: 0.95 });
  card(s, "Card classical result", 5.45, 3.0, 4.05, 1.75);
  text(s, "Classical result", { objectName: "Card 2 title", x: 5.7, y: 3.16, w: 3.6, h: 0.32, fontSize: FS.cardTitle, bold: true });
  text(s, [{ text: "Leading-eight norms make cooperation evolutionarily stable when reputations are " },
           { text: "public", options: { bold: true, color: ORANGE_TEXT } }, { text: ", even with occasional errors." }],
    { objectName: "Card 2 body", x: 5.7, y: 3.54, w: 3.6, h: 1.05 });
  sources(s, "Nowak & Sigmund 1998, 2005 · Wedekind & Milinski 2000 · Leimar & Hammerstein 2001 · Panchanathan & Boyd 2003 · Ohtsuki & Iwasa 2004, 2006");
  s.addNotes("Cooperation among unrelated individuals is sustained in part by reputation. By helping others, individuals improve their standing and become more likely to receive help from third parties. This is indirect reciprocity. Theory has identified social norms that make reputation-based cooperation evolutionarily stable, most notably the leading-eight norms. They sustain cooperation when reputations are public, even with occasional errors. These results rest on agreement about who is good and who is bad.");

  // ================================================================ 3. Accurate and shared
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Private reputations must be both accurate and shared", { placeholder: "title" });
  {
    const pub = ["GGBGB", "GGBGB", "GGBGB", "GGBGB"];
    const prv = ["GGBGB", "GBBGG", "BGBGB", "GGGBB"];
    const grid = (name, x0, head, subh, pat) => {
      text(s, head, { objectName: name + " heading", x: x0 - 0.3, y: 1.2, w: 2.5, h: 0.3, bold: true, fontSize: 15 });
      text(s, subh, { objectName: name + " subheading", x: x0 - 0.3, y: 1.5, w: 2.5, h: 0.28, fontSize: FS.small, color: MUTED });
      "ABCDE".split("").forEach((c, i) => text(s, c, { objectName: `${name} column ${c}`, x: x0 + i * 0.4, y: 1.83, w: 0.28, h: 0.22, align: "center", fontSize: FS.ref, color: MUTED }));
      pat.forEach((row, j) => {
        text(s, String(j + 1), { objectName: `${name} row ${j + 1}`, x: x0 - 0.3, y: 2.1 + j * 0.4, w: 0.2, h: 0.28, align: "right", valign: "middle", fontSize: FS.ref, color: MUTED });
        row.split("").forEach((v, i) => dot(s, `${name} r${j + 1}c${i + 1}`, x0 + i * 0.4, 2.1 + j * 0.4, 0.28, { color: v === "G" ? GOOD : BAD }, null));
      });
    };
    grid("Public grid", 0.85, "Public reputations", "One shared view", pub);
    grid("Private grid", 3.45, "Private reputations", "Views diverge", prv);
    text(s, "Rows are observers, columns are individuals.", { objectName: "Grid caption", x: 0.55, y: 3.78, w: 4.6, h: 0.25, fontSize: FS.ref, color: MUTED });
    dot(s, "Legend good", 0.58, 4.15, 0.2, { color: GOOD }, null);
    text(s, "good", { objectName: "Legend good label", x: 0.86, y: 4.12, w: 0.7, h: 0.26, fontSize: FS.small, valign: "middle" });
    dot(s, "Legend bad", 1.6, 4.15, 0.2, { color: BAD }, null);
    text(s, "bad", { objectName: "Legend bad label", x: 1.88, y: 4.12, w: 0.7, h: 0.26, fontSize: FS.small, valign: "middle" });
  }
  card(s, "Card private assessment", 5.6, 1.2, 3.9, 1.5);
  text(s, "Private, noisy assessment", { objectName: "Card 1 title", x: 5.85, y: 1.34, w: 3.45, h: 0.32, fontSize: FS.cardTitle, bold: true });
  text(s, "Individuals hold different views of the same person. Most leading-eight norms then fail to sustain cooperation.",
    { objectName: "Card 1 body", x: 5.85, y: 1.7, w: 3.45, h: 0.95 });
  card(s, "Card central problem", 5.6, 2.9, 3.9, 1.95, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(s, "Central problem", { objectName: "Card 2 title", x: 5.85, y: 3.03, w: 3.45, h: 0.32, fontSize: FS.cardTitle, bold: true, color: ORANGE_TEXT });
  iconCircle(s, "Accurate", ic.accurate, 5.85, 3.47, 0.5);
  text(s, [{ text: "Accurate", options: { bold: true, breakLine: true } }, { text: "Tell cooperators from defectors" }],
    { objectName: "Accurate text", x: 6.5, y: 3.43, w: 2.85, h: 0.58 });
  iconCircle(s, "Shared", ic.shared, 5.85, 4.15, 0.5);
  text(s, [{ text: "Shared", options: { bold: true, breakLine: true } }, { text: "Observers agree about who is who" }],
    { objectName: "Shared text", x: 6.5, y: 4.11, w: 2.85, h: 0.58 });
  sources(s, "Takahashi & Mashima 2006 · Uchida 2010 · Hilbe et al. 2018 · Okada et al. 2018 · Perret et al. 2021 · Fujimoto & Ohtsuki 2022, 2023 · Murase & Hilbe 2024");
  s.addNotes("When reputations are private and assessments are noisy, individuals hold different views of the same person. The left grid shows public reputations, where every observer holds the same view. The right grid shows private reputations, where views diverge. Under private assessment, most leading-eight norms no longer maintain stable cooperation. A central problem for indirect reciprocity is therefore how reputations can remain both accurate and shared. They must distinguish those who cooperate from those who do not, and different observers must largely agree about who is who.");

  // ================================================================ 4. Overwrite updating
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Overwrite updating turns single errors into cascades", { placeholder: "title" });
  text(s, [{ text: "Standard binary updating. ", options: { bold: true } }, { text: "Each new assessment replaces the previous image." }],
    { objectName: "Part 1 heading", x: MX, y: 1.15, w: CW, h: 0.3, fontSize: 15 });
  {
    const x0 = 2.0, p = 0.62, a = "++++-++", im = "GGGGBGG";
    text(s, "Assessment", { objectName: "Row label assessment", x: MX, y: 1.68, w: 1.4, h: 0.42, valign: "middle" });
    text(s, "Image", { objectName: "Row label image", x: MX, y: 2.28, w: 1.4, h: 0.42, valign: "middle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: "Error highlight", x: x0 + 4 * p - 0.09, y: 1.6, w: 0.6, h: 1.18, rectRadius: 0.08,
      fill: { color: WHITE, transparency: 100 }, line: { color: ORANGE, width: 1.5, dashType: "dash" } });
    for (let i = 0; i < 7; i++) {
      const pos = a[i] === "+";
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Assessment ${i + 1}`, x: x0 + i * p, y: 1.68, w: 0.42, h: 0.42, rectRadius: 0.06,
        fill: { color: pos ? GOOD : BAD }, line: { color: pos ? GOOD : BAD, width: 0 } });
      text(s, pos ? "+" : "−", { objectName: `Assessment ${i + 1} sign`, x: x0 + i * p, y: 1.68, w: 0.42, h: 0.42, align: "center", valign: "middle", bold: true, fontSize: 18, color: WHITE });
      dot(s, `Image ${i + 1}`, x0 + i * p, 2.28, 0.42, { color: im[i] === "G" ? GOOD : BAD }, im[i], WHITE, 14);
    }
    text(s, "error", { objectName: "Error label", x: x0 + 4 * p - 0.09, y: 2.82, w: 0.6, h: 0.25, align: "center", fontSize: FS.small, bold: true, color: ORANGE_TEXT });
    text(s, "A single error reverses a reputation built over many interactions, and the next observation reverses it again.",
      { objectName: "Part 1 explanation", x: 6.45, y: 1.72, w: 3.05, h: 1.0 });
  }
  text(s, [{ text: "Private assessment. ", options: { bold: true } }, { text: "Reversals do not stay local but spread through behavior." }],
    { objectName: "Part 2 heading", x: MX, y: 3.15, w: CW, h: 0.3, fontSize: 15 });
  {
    const steps = ["An error leaves two observers with different views of recipient X.",
                   "A discriminator refuses to help X, whom it regards as bad.",
                   "An observer who regards X as good condemns the discriminator."];
    steps.forEach((t, i) => {
      const x = MX + i * 3.1;
      card(s, `Cascade step ${i + 1}`, x, 3.58, 2.8, 1.22, i === 2 ? { fill: { color: BAD, transparency: 85 }, line: { color: BAD, width: 0, transparency: 100 } } : {});
      text(s, t, { objectName: `Cascade step ${i + 1} text`, x: x + 0.18, y: 3.58, w: 2.44, h: 1.22, valign: "middle" });
      if (i < 2) arrow(s, `Cascade arrow ${i + 1}`, x + 2.84, 4.19, x + 3.06, 4.19, INK);
    });
  }
  sources(s, "Ohtsuki & Iwasa 2004 · Hilbe et al. 2018 · Radzvilavicius et al. 2019 · Okada 2020");
  s.addNotes("Part of this fragility lies in how reputations are updated. In the standard binary framework, each new assessment replaces the previous image of an individual. An isolated error can therefore reverse a reputation built over many interactions, and the next observation can reverse it again. Under private assessment, such reversals do not remain local. They amplify disagreements among observers and feed back into behavior. A discriminator who refuses to help a recipient it regards as bad may itself be condemned by an observer who regards that recipient as good.");

  // ================================================================ 5. Existing remedies
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Existing remedies share a tacit symmetry", { placeholder: "title" });
  {
    const cols = [
      { name: "Restore agreement", icon: ic.agree, x: MX, items: [
        ["Public institutions", "Radzvilavicius 2021"], ["Gossip", "Kawakatsu 2024"], ["Empathetic evaluation", "Radzvilavicius 2019"],
        ["Synchronized private opinions", "Murase 2024; Tham 2026; Okada 2024"]] },
      { name: "Use more information", icon: ic.info, x: 5.15, items: [
        ["Generous or stochastic assessment", "Schmid 2021; Murase 2023"], ["Graded or quantitative reputations", "Tanabe 2013; Murase 2022; Schmid 2023; Clark 2020"],
        ["Reasoning about errors", "Pandula 2024; Morsky 2024"], ["Aggregating several observations", "Michel-Mata 2024"]] },
    ];
    cols.forEach((c) => {
      card(s, `Card ${c.name}`, c.x, 1.15, 4.35, 2.55);
      iconCircle(s, c.name, c.icon, c.x + 0.2, 1.3, 0.5);
      text(s, c.name, { objectName: `${c.name} title`, x: c.x + 0.85, y: 1.3, w: 3.3, h: 0.5, valign: "middle", fontSize: FS.cardTitle, bold: true });
      c.items.forEach((it, k) => {
        text(s, [{ text: it[0], options: { breakLine: true } }, { text: it[1], options: { fontSize: FS.ref, color: MUTED } }],
          { objectName: `${c.name} item ${k + 1}`, x: c.x + 0.25, y: 1.95 + k * 0.42, w: 3.95, h: 0.42 });
      });
    });
  }
  card(s, "Assumption callout", MX, 3.88, CW, 0.95, { fill: { color: INK }, line: { color: INK, width: 0 } });
  dot(s, "Callout G", 0.78, 4.1, 0.5, { color: GOOD }, "G", WHITE, 14);
  dot(s, "Callout B", 2.28, 4.1, 0.5, { color: BAD }, "B", WHITE, 14);
  arrow(s, "Callout loss arrow", 1.34, 4.24, 2.22, 4.24, WHITE, { width: 1.5 });
  arrow(s, "Callout recovery arrow", 2.22, 4.47, 1.34, 4.47, WHITE, { width: 1.5 });
  text(s, [{ text: "Most share one assumption", options: { bold: true, color: ORANGE, breakLine: true } },
           { text: "Losing and regaining standing follow the same rule, such as one score, threshold or observation window." }],
    { objectName: "Callout text", x: 3.05, y: 3.98, w: 6.25, h: 0.78, color: WHITE, valign: "middle" });
  sources(s, "Assumption: Schmid et al. 2023 · Michel-Mata et al. 2024 · Yamamoto et al. 2025");
  s.addNotes("Recent work has made reputation systems more robust to errors and disagreement in two ways. Some mechanisms restore agreement among observers, through public institutions, gossip, empathetic evaluation or the synchronization of private opinions. Others use more information before a reputation changes, through generous or stochastic assessment, graded or quantitative reputations, reasoning about errors and the aggregation of several observations. Most of these mechanisms share a tacit assumption. Losing and regaining standing are governed by the same rule, such as a single score, threshold or observation window.");

  // ================================================================ 6. Institutions
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Institutions separate losing from regaining standing", { placeholder: "title" });
  {
    const ex = [
      { name: "Graduated sanctions", subt: "Commons management", icon: ic.commons, x: MX,
        body: "First offences meet mild sanctions, which escalate only after repeated violations.", ref: "Ostrom 1990 · Cox et al. 2010", strip: "repeated violations" },
      { name: "Criminal records", subt: "Redemption", icon: ic.record, x: 5.15,
        body: "A record stops signaling elevated risk only after years without a further offence.", ref: "Blumstein & Nakamura 2009", strip: "offence-free years" },
    ];
    ex.forEach((e, k) => {
      card(s, `Card ${e.name}`, e.x, 1.15, 4.35, 2.65);
      iconCircle(s, e.name, e.icon, e.x + 0.2, 1.32, 0.55);
      text(s, e.name, { objectName: `${e.name} title`, x: e.x + 0.9, y: 1.3, w: 3.25, h: 0.32, fontSize: FS.cardTitle, bold: true });
      text(s, e.subt, { objectName: `${e.name} subtitle`, x: e.x + 0.9, y: 1.62, w: 3.25, h: 0.26, fontSize: FS.small, color: MUTED });
      text(s, e.body, { objectName: `${e.name} body`, x: e.x + 0.25, y: 2.05, w: 3.9, h: 0.62 });
      const by = 3.25;
      if (k === 0) {
        [0.2, 0.38, 0.56].forEach((h, i) => s.addShape(pres.shapes.RECTANGLE, { objectName: `Sanction bar ${i + 1}`, x: e.x + 0.3 + i * 0.42, y: by - h, w: 0.3, h,
          fill: { color: BAD, transparency: 60 - i * 30 }, line: { color: BAD, width: 0, transparency: 100 } }));
      } else {
        [[BAD, 0], [BAD, 40], [BAD, 70], [GOOD, 70], [GOOD, 40], [GOOD, 0]].forEach((c, i) => s.addShape(pres.shapes.ROUNDED_RECTANGLE,
          { objectName: `Year ${i + 1}`, x: e.x + 0.3 + i * 0.36, y: by - 0.3, w: 0.28, h: 0.3, rectRadius: 0.04,
            fill: { color: c[0], transparency: c[1] }, line: { color: c[0], width: 0, transparency: 100 } }));
      }
      const sx = k === 0 ? e.x + 1.65 : e.x + 2.55;
      text(s, e.strip + " →", { objectName: `${e.name} strip label`, x: sx, y: by - 0.32, w: e.x + 4.15 - sx, h: 0.32, fontSize: FS.small, color: MUTED, valign: "bottom" });
      text(s, e.ref, { objectName: `${e.name} reference`, x: e.x + 0.25, y: 3.42, w: 3.9, h: 0.25, fontSize: FS.ref, color: MUTED });
    });
  }
  card(s, "Takeaway", MX, 4.0, CW, 0.82, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(s, [{ text: "These practices treat losing and regaining standing as " }, { text: "separate processes", options: { bold: true, color: ORANGE_TEXT } },
           { text: ", and incomplete evidence already carries " }, { text: "partial consequences", options: { bold: true, color: ORANGE_TEXT } }, { text: "." }],
    { objectName: "Takeaway text", x: 0.75, y: 4.0, w: 8.5, h: 0.82, valign: "middle", fontSize: 15 });
  s.addNotes("Many human institutions do not make this symmetry assumption. Communities that successfully manage shared resources sanction first offences mildly and escalate only after repeated violations. A criminal record stops signaling elevated risk only after years without a further offence. These practices treat losing and regaining standing as separate processes and let incomplete evidence carry partial consequences.");

  // ================================================================ 7. Two questions
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Relaxing the symmetry raises two questions", { placeholder: "title" });
  {
    const qs = [
      { n: "1", x: MX, q: "Should losing a good reputation require as much evidence as regaining one?",
        chips: [[BAD, "Forgive too little", "honest mistakes trigger cascades of disagreement"], [GOOD, "Restore too readily", "defectors escape the consequences of their behavior"]],
        note: "Which risk dominates may depend on the norm." },
      { n: "2", x: 5.15, q: "How should evidence that is accumulating, but not yet conclusive, affect treatment?",
        chips: [[GOOD, "Wait for conclusive evidence", "cooperators are protected from errors"], [BAD, "The same forbearance", "may shelter those who defect only occasionally"]],
        note: "A single defection looks like an error." },
    ];
    qs.forEach((q) => {
      card(s, `Question ${q.n} card`, q.x, 1.15, 4.35, 3.7);
      dot(s, `Question ${q.n} number`, q.x + 0.22, 1.33, 0.55, { color: ORANGE }, q.n, WHITE, 20);
      text(s, q.q, { objectName: `Question ${q.n} text`, x: q.x + 0.95, y: 1.3, w: 3.2, h: 1.05, fontSize: FS.cardTitle, bold: true });
      q.chips.forEach((c, i) => {
        const y = 2.42 + i * 0.97;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Question ${q.n} chip ${i + 1}`, x: q.x + 0.22, y, w: 3.91, h: 0.86, rectRadius: 0.06,
          fill: { color: WHITE }, line: { color: c[0], width: 1.25 } });
        text(s, [{ text: c[1], options: { bold: true, color: c[0], breakLine: true } }, { text: "→ " + c[2] }],
          { objectName: `Question ${q.n} chip ${i + 1} text`, x: q.x + 0.38, y, w: 3.62, h: 0.86, valign: "middle" });
      });
      text(s, q.note, { objectName: `Question ${q.n} note`, x: q.x + 0.25, y: 4.36, w: 3.9, h: 0.4, italic: true, color: MUTED, valign: "middle" });
    });
  }
  sources(s, "Question 2: Schmid et al. 2021 · Michel-Mata et al. 2024");
  s.addNotes("Relaxing the same assumption in models of indirect reciprocity raises two questions. First, should losing a good reputation require as much evidence as regaining one? If observers forgive too little, honest mistakes trigger cascades of disagreement. If they restore standing too readily, defectors escape the consequences of their behavior. Which of these risks dominates may depend on the norm that defines good conduct. Second, how should evidence that is accumulating, but not yet conclusive, affect how someone is treated? Waiting for conclusive evidence protects cooperators from errors, but the same forbearance may shelter individuals who defect deliberately, provided they do so only occasionally.");

  // ================================================================ 8. Research gap
  s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: SEC });
  s.addText("Research gap", { placeholder: "kicker" });
  s.addText("Can a reputation system forgive honest mistakes without excusing deliberate defection?", { placeholder: "title" });
  s.addText([{ text: "Question 1 concerns how much evidence changes a reputation.", options: { breakLine: true } },
             { text: "Question 2 concerns how incomplete evidence is treated in the meantime." }], { placeholder: "note" });
  s.addNotes("Together, the two questions lead to the research gap. Whether a reputation system can forgive honest mistakes without excusing deliberate defection remains open. Answering it requires a model that separates how much evidence changes a reputation from how incomplete evidence is treated.");

  // ================================================================ 9. Approach
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Here, we give reputations inertia", { placeholder: "title" });
  text(s, "An established reputation changes only after contrary evidence has accumulated, and the amount required can differ by direction.",
    { objectName: "Lead", x: MX, y: 1.1, w: CW, h: 0.5, fontSize: 15 });
  {
    const d = 0.55, x0 = 2.95, p = 0.95;
    const rows = [
      { y: 1.8, label: "Losing standing", sub: "warning states", color: BAD,
        nodes: [["G", GOOD, 0], [[{ text: "W" }, sub("1")], BAD, 75], [[{ text: "W" }, sub("2")], BAD, 75], ["⋯"], [[{ text: "W" }, sub("k", { italic: true }), sub("1")], BAD, 75], ["B", BAD, 0]] },
      { y: 2.7, label: "Regaining standing", sub: "recovery states", color: GOOD,
        nodes: [["B", BAD, 0], [[{ text: "S" }, sub("1")], GOOD, 75], ["⋯"], [[{ text: "S" }, sub("k", { italic: true }), sub("2")], GOOD, 75], ["G", GOOD, 0]] },
    ];
    rows.forEach((r, ri) => {
      text(s, [{ text: r.label, options: { bold: true, breakLine: true } }, { text: r.sub, options: { fontSize: FS.small, color: MUTED } }],
        { objectName: `Path ${ri + 1} label`, x: MX, y: r.y - 0.02, w: 2.3, h: 0.6 });
      r.nodes.forEach((n, i) => {
        const x = x0 + i * p;
        if (n[0] === "⋯") {
          [0, 1, 2].forEach((j) => dot(s, `Path ${ri + 1} ellipsis ${j + 1}`, x + 0.1 + j * 0.15, r.y + d / 2 - 0.035, 0.07, { color: MUTED }, null));
        } else {
          const solid = n[2] === 0;
          dot(s, `Path ${ri + 1} state ${i + 1}`, x, r.y, d, { color: n[1], transparency: n[2] }, null);
          s.addText(n[0], { objectName: `Path ${ri + 1} state ${i + 1} label`, isTextBox: true, x, y: r.y, w: d, h: d, margin: 0,
            align: "center", valign: "middle", fontSize: 14, bold: true, color: solid ? WHITE : INK });
        }
        if (i < r.nodes.length - 1) arrow(s, `Path ${ri + 1} arrow ${i + 1}`, x + d + 0.06, r.y + d / 2, x + p - 0.06, r.y + d / 2, r.color, { width: 1.75 });
      });
    });
    // legend
    arrow(s, "Legend negative", 2.95, 3.53, 3.4, 3.53, BAD, { width: 1.75 });
    text(s, "negative assessment", { objectName: "Legend negative label", x: 3.5, y: 3.4, w: 1.9, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
    arrow(s, "Legend positive", 5.45, 3.53, 5.9, 3.53, GOOD, { width: 1.75 });
    text(s, "positive assessment", { objectName: "Legend positive label", x: 6.0, y: 3.4, w: 1.9, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
  }
  const choices = [
    { x: MX, t: [{ text: "Depths " }, { text: "k", options: { italic: true } }, sub("1"), { text: ", " }, { text: "k", options: { italic: true } }, sub("2")],
      b: "How much evidence changes an established reputation in each direction", tag: "Question 1" },
    { x: 5.15, t: [{ text: "Strengths " }, { text: "α", options: { italic: true } }, { text: ", " }, { text: "β", options: { italic: true } }],
      b: "How strongly incomplete evidence is expressed in the meantime", tag: "Question 2" },
  ];
  choices.forEach((c, i) => {
    card(s, `Design choice ${i + 1}`, c.x, 3.85, 4.35, 1.0);
    text(s, c.t, { objectName: `Design choice ${i + 1} title`, x: c.x + 0.22, y: 3.95, w: 2.6, h: 0.32, fontSize: FS.cardTitle, bold: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Design choice ${i + 1} tag`, x: c.x + 3.0, y: 3.97, w: 1.15, h: 0.28, rectRadius: 0.06,
      fill: { color: ORANGE, transparency: 80 }, line: { color: ORANGE, width: 0, transparency: 100 } });
    text(s, c.tag, { objectName: `Design choice ${i + 1} tag text`, x: c.x + 3.0, y: 3.97, w: 1.15, h: 0.28, align: "center", valign: "middle", fontSize: 11, bold: true, color: ORANGE_TEXT });
    text(s, c.b, { objectName: `Design choice ${i + 1} body`, x: c.x + 0.22, y: 4.3, w: 3.95, h: 0.5 });
  });
  sources(s, "The model is defined in Section 2 (Fig. 1).");
  s.addNotes("Here, we develop a model of indirect reciprocity in which reputations have inertia. An established reputation changes only after contrary evidence has accumulated, and the amount of evidence required can differ between losing and regaining standing. Negative evidence moves an individual in good standing through a sequence of warning states before the reputation turns bad, and positive evidence moves an individual in bad standing through recovery states before it turns good. The length of each path sets the inertia in that direction, and each intermediate state can already affect how the individual is treated. The framework separates two design choices: how much evidence changes an established reputation in each direction, which addresses question 1, and how strongly incomplete evidence is expressed in the meantime, which addresses question 2.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
