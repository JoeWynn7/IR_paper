// Section 2 of the talk, "Model and methods", as an editable PowerPoint deck.
// Content follows the Results (first subsection) and Methods of
// Manuscript_doc/latex_file/Manuscript_full_20261103.tex.
// Text written as M`...` may contain inline LaTeX ($...$), **bold** and !!accent!!;
// build_assets.py converts these strings to styled runs. Display equations are
// pictures named "EQ:..." that inject_omml.py turns into native Office Math.
// Usage: NODE_PATH=<modules> PPTX_SKILL=<pptx skill dir> node make_model_pptx.js <asset_dir> <raw.pptx>
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts", "apply_theme.js"));

const ASSET_DIR = process.argv[2];
const OUT = process.argv[3];
const A = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, "assets.json"), "utf8"));

// ------------------------------------------------------------------ theme (same as Section 1)
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
pres.title = "Indirect reciprocity with inertial reputation updating: model and methods";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const FS = { title: 24, cardTitle: 16, body: 14, small: 12, caption: 11, source: 10 };
const MX = 0.5, CW = 9.0;
const SEC = "Model and methods";

// ------------------------------------------------------------------ layouts (same as Section 1)
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

// ------------------------------------------------------------------ text helpers
function M(strings) {
  const k = strings.raw[0];
  if (!(k in A.runs)) throw new Error("missing runs for: " + k + " (rerun build_assets.py)");
  return A.runs[k];
}
function T(runs, base = {}) {
  return runs.map((r) => {
    const o = Object.assign({}, base);
    if (r.italic) o.italic = true;
    if (r.bold) o.bold = true;
    if (r.sub) o.subscript = true;
    if (r.sup) o.superscript = true;
    if (r.accent) o.color = ORANGE_TEXT;
    return { text: r.text, options: o };
  });
}
function P(list, base = {}, bullet = false) {
  const out = [];
  list.forEach((runs, i) => {
    const t = T(runs, base);
    if (bullet) { t[0].options.bullet = { code: "25AA", indent: 13 }; t[0].options.paraSpaceAfter = 4; }
    if (i < list.length - 1) t[t.length - 1].options.breakLine = true;
    out.push(...t);
  });
  return out;
}
function text(slide, t, o) {
  // t: plain string, pptxgenjs text array, or runs from M`...`
  const isRuns = Array.isArray(t) && t.length && t[0].options === undefined && "italic" in t[0];
  slide.addText(isRuns ? T(t) : t, Object.assign({ isTextBox: true, margin: 0, fontSize: FS.body, color: INK, valign: "top" }, o));
}
function sources(slide, runs) {
  text(slide, runs, { objectName: "Sources", x: MX, y: 5.02, w: 8.3, h: 0.4, fontSize: FS.source, color: MUTED });
}

// ------------------------------------------------------------------ shape helpers
async function iconData(Comp, hex = "#FFFFFF") {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: hex, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
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
  slide.addShape(pres.shapes.LINE, { objectName: name, x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1,
    line: Object.assign({ color, width: 2, endArrowType: "triangle" }, o) });
}
function dot(slide, name, x, y, d, fill, label, labelColor = WHITE, pt = 13) {
  slide.addShape(pres.shapes.OVAL, { objectName: name, x, y, w: d, h: d,
    fill: { color: fill.color, transparency: fill.transparency || 0 }, line: { color: fill.color, width: 0 } });
  if (label) slide.addText(label, { objectName: name + " label", isTextBox: true, x, y, w: d, h: d, margin: 0,
    align: "center", valign: "middle", fontSize: pt, bold: true, color: labelColor });
}
function num(slide, name, n, x, y, d = 0.36) { dot(slide, name, x, y, d, { color: ORANGE }, String(n), WHITE, 14); }

// Display equation: picture now, native Office Math after inject_omml.py.
// The equation is fitted into the column (x, w); align "c" centres it, "l" sets it flush left.
function EQ(slide, id, x, y, w, align = "c", o = {}) {
  const e = A.equations[id];
  const s = Math.min(1, (w * 0.94) / e.w);
  const pw = e.w * s, ph = e.h * s;
  const px = align === "c" ? x + (w - pw) / 2 : x;
  const py = o.vcenter !== undefined ? o.vcenter - ph / 2 : y;
  slide.addImage({ path: e.png, x: px, y: py, w: pw, h: ph, altText: e.tex,
    objectName: `EQ:${id}:${align}:${s.toFixed(4)}:${x.toFixed(3)}:${w.toFixed(3)}` });
  return ph;
}
function figure(slide, name, x, y, h) {
  const f = A.figures[name];
  slide.addImage({ objectName: "Figure " + name, path: f.png, x, y, w: h * f.aspect, h });
  return h * f.aspect;
}

(async () => {
  const ic = {
    accurate: await iconData(fa.FaBullseye), shared: await iconData(fa.FaUsers),
    quality: await iconData(fa.FaBullseye), evolution: await iconData(fa.FaSeedling), shield: await iconData(fa.FaShieldAlt),
  };

  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 2 · Model and methods", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  { // motif: the recovery path, complementing the warning path on the Part 1 title slide
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19, 2.91];
    const fills = [{ color: BAD }, { color: GOOD, transparency: 70 }, { color: GOOD, transparency: 45 }, { color: GOOD }];
    const labels = ["B", [{ text: "S" }, { text: "1", options: { subscript: true } }], [{ text: "S" }, { text: "2", options: { subscript: true } }], "G"];
    fills.forEach((f, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, f, null);
      s.addText(labels[i], { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE });
      if (i < 3) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, GOOD, { width: 1.5 });
    });
  }
  s.addNotes("This part defines the model and the two levels of analysis: reputation formation in finite populations, and a mean-field theory that feeds into strategy evolution and invasion analysis.");

  pres.addSection({ title: SEC });

  // ================================================================ 2. Donation game
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Donation game with private assessment", { placeholder: "title" });
  [["ALLC", "always intends to help"], ["ALLD", "never helps"], ["DISC", "helps recipients it regards as good"]].forEach((st, i) => {
    const x = MX + i * 1.54;
    card(s, `Strategy ${st[0]}`, x, 1.15, 1.42, 0.98);
    text(s, st[0], { objectName: `Strategy ${st[0]} name`, x: x + 0.14, y: 1.24, w: 1.2, h: 0.3, bold: true, fontSize: 15 });
    text(s, st[1], { objectName: `Strategy ${st[0]} text`, x: x + 0.14, y: 1.55, w: 1.2, h: 0.52, fontSize: FS.small, color: MUTED });
  });
  text(s, M`**Private assessment.** A random observer judges the donor's action with **its own** image of the recipient.`,
    { objectName: "Private assessment", x: MX, y: 2.3, w: 4.5, h: 0.6 });
  text(s, M`**Errors.** Intended cooperation fails with probability $e_1$, and assessments are reversed with probability $e_2$.`,
    { objectName: "Errors", x: MX, y: 3.0, w: 4.5, h: 0.65 });
  {
    const hdr = (t) => ({ text: T(t, { bold: true, color: WHITE }), options: { fill: { color: INK }, align: t === M`Norm` ? "left" : "center" } });
    const rows = [[M`Norm`, M`$p$`, M`$q$`].map(hdr)];
    [["Scoring (SC)", "1", "0"], ["Shunning (SH)", "0", "0"], ["Stern Judging (SJ)", "0", "1"], ["Simple Standing (SS)", "1", "1"]].forEach((r, i) => {
      const fill = { color: i % 2 ? WHITE : CARD };
      rows.push([{ text: r[0], options: { fill } }, { text: r[1], options: { fill, align: "center" } }, { text: r[2], options: { fill, align: "center" } }]);
    });
    s.addTable(rows, { objectName: "Norm table", x: 5.4, y: 1.15, w: 4.1, colW: [2.7, 0.7, 0.7], rowH: 0.31, fontSize: FS.body,
      color: INK, valign: "middle", margin: [0.02, 0.08, 0.02, 0.12], border: { type: "solid", pt: 0.5, color: "C4CED1" } });
  }
  text(s, M`$p$ and $q$ are the probabilities that cooperation and defection towards a recipient regarded as bad are assessed positively. Towards a good recipient, cooperation is good and defection is bad.`,
    { objectName: "Norm caption", x: 5.4, y: 2.83, w: 4.1, h: 0.85, fontSize: FS.small, color: MUTED });
  card(s, "Assessment card", MX, 3.88, CW, 1.02);
  text(s, M`Positive recorded assessment, given intended action and the observer's image of the recipient`,
    { objectName: "Assessment lead", x: 0.7, y: 3.88, w: 2.2, h: 1.02, fontSize: FS.small, color: MUTED, valign: "middle" });
  EQ(s, "assess1", 3.0, 0, 6.4, "c", { vcenter: 4.17 });
  EQ(s, "assess2", 3.0, 0, 6.4, "c", { vcenter: 4.6 });
  sources(s, M`Parameters throughout: $b/c=5$ and $e_1=e_2=0.02$.`);
  s.addNotes("We consider a well-mixed population playing the donation game. A donor can help at cost c, giving the recipient b greater than c. ALLC always intends to help, ALLD never does, and DISC helps only recipients it regards as good. Reputations are private. A randomly drawn observer judges the donor's realized action using its own image of the recipient, so donor and observer can disagree. The four second-order norms differ only in how they judge actions towards recipients regarded as bad, summarized by p and q. Intended cooperation fails with probability e1, and the observer records the opposite assessment with probability e2. The equations give the probability that the recorded assessment is positive.");

  // ================================================================ 3. Inertial updating
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Inertial reputation updating", { placeholder: "title" });
  figure(s, "Fig1_model", MX, 1.12, 3.15);
  text(s, M`**Fig. 1** | **a**, instantaneous updating. **b**, inertial updating. An assessment in the opposite direction resets the record to the established state.`,
    { objectName: "Fig. 1 caption", x: MX, y: 4.35, w: 3.8, h: 0.6, fontSize: FS.caption, color: MUTED });
  {
    const X = 4.7, W = 4.8;
    const cell = (runs, o = {}) => ({ text: T(runs), options: o });
    const head = (runs) => ({ text: T(runs, { bold: true, color: WHITE }), options: { fill: { color: INK } } });
    const rowHead = (runs) => ({ text: T(runs, { bold: true }), options: { fill: { color: CARD } } });
    const rows = [
      [head(M` `), head(M`Losing standing`), head(M`Regaining standing`)],
      [rowHead(M`Depth`), cell(M`$k_1$ warning states. Loss takes $k_1+1$ consecutive negative assessments.`),
                          cell(M`$k_2$ recovery states. Recovery takes $k_2+1$ consecutive positive ones.`)],
      [rowHead(M`Strength`), cell(M`$\mathrm{W}_m$ is read as good with probability $\alpha^m$.`),
                             cell(M`$\mathrm{S}_n$ is read as bad with probability $\beta^n$.`)],
    ];
    s.addTable(rows, { objectName: "Depth and strength table", x: X, y: 1.15, w: W, colW: [0.95, 1.925, 1.925], rowH: [0.34, 0.95, 0.72],
      fontSize: FS.small + 1, color: INK, valign: "middle", margin: [0.03, 0.08, 0.03, 0.1], border: { type: "solid", pt: 0.5, color: "C4CED1" } });
    text(s, M`A consulted record is read as good with probability`, { objectName: "Sigma lead", x: X, y: 3.4, w: W, h: 0.28 });
    EQ(s, "sigma", X, 0, W, "c", { vcenter: 3.86 });
    card(s, "Compared settings", X, 4.12, W, 0.8);
    text(s, P([M`**Compared settings** with $\alpha=\beta=1$`, M`No inertia $(0,0)$, one-step $(1,1)$, and the selected SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$ and SS $(1,2)$`]),
      { objectName: "Compared settings text", x: X + 0.18, y: 4.12, w: W - 0.3, h: 0.8, valign: "middle", fontSize: 13 });
  }
  s.addNotes("Under instantaneous updating, each new assessment replaces the observer's image. Under inertial updating, consecutive negative assessments move a good record through k1 warning states before it turns bad, and consecutive positive assessments move a bad record through k2 recovery states before it turns good. An assessment that supports the established judgment returns the record to the established state. The pair (0,0) recovers instantaneous updating. Whenever a record is consulted, to act or to assess, its state is read as a good or bad image. Warning state W_m is read as good with probability alpha to the m, and recovery state S_n as bad with probability beta to the n. The depths set how much evidence changes a reputation, the strengths set how strongly incomplete evidence is expressed.");

  // ================================================================ 4. Two levels of analysis
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Two levels of analysis", { placeholder: "title" });
  {
    const nodes = [["Finite-population simulations", "reputations only"], ["Select architectures", "from reputation statistics"],
                   ["Mean-field theory", "stationary reputations"], ["Evolution and invasion", "replicator dynamics, rare mutants"]];
    nodes.forEach((n, i) => {
      const x = MX + i * 2.333;
      card(s, `Step ${i + 1}`, x, 1.25, 2.0, 1.05, i < 2 ? {} : { fill: { color: GOOD, transparency: 88 }, line: { color: GOOD, width: 0, transparency: 100 } });
      num(s, `Step ${i + 1} number`, i + 1, x - 0.08, 1.07, 0.36);
      text(s, [{ text: n[0], options: { bold: true, breakLine: true } }, { text: n[1], options: { fontSize: FS.small, color: MUTED } }],
        { objectName: `Step ${i + 1} text`, x: x + 0.15, y: 1.3, w: 1.75, h: 0.95, valign: "middle", align: "center" });
      if (i < 3) arrow(s, `Step arrow ${i + 1}`, x + 2.04, 1.775, x + 2.29, 1.775, INK);
    });
  }
  const levels = [
    { x: MX, title: M`Reputation formation (Fig. 2)`, fill: CARD, items: [
      M`$N=150$, equal numbers of ALLC, ALLD and DISC, strategies fixed`,
      M`Each DISC keeps its own record of every individual, with no mean-field closure`,
      M`30 replicate runs per architecture and a drift check before selection`] },
    { x: 5.15, title: M`Evolutionary analysis (Figs. 3–5)`, fill: null, items: [
      M`Reputations equilibrate faster than strategy frequencies change`,
      M`Replicator dynamics from 512 initial compositions, uniform over the simplex`,
      M`Invasion of a resident DISC population by rare ALLC, ALLD and O-DISC mutants`] },
  ];
  levels.forEach((l, i) => {
    card(s, `Level ${i + 1}`, l.x, 2.6, 4.35, 2.25, i === 1 ? { fill: { color: GOOD, transparency: 88 }, line: { color: GOOD, width: 0, transparency: 100 } } : {});
    text(s, T(l.title, { bold: true }), { objectName: `Level ${i + 1} title`, x: l.x + 0.25, y: 2.75, w: 3.9, h: 0.32, fontSize: FS.cardTitle });
    text(s, P(l.items, {}, true), { objectName: `Level ${i + 1} items`, x: l.x + 0.25, y: 3.17, w: 3.9, h: 1.6 });
  });
  s.addNotes("The analysis has two levels. First, individual-based simulations at fixed strategy composition test how private reputations form, without the mean-field closure. Every DISC individual keeps its own record of everyone. From these simulations we select one architecture per norm, using reputation statistics only. Second, a mean-field theory gives stationary private reputations at every strategy composition. Assuming that reputations equilibrate faster than strategies change, we use them in replicator dynamics and in invasion analyses with rare ALLC, ALLD and opportunistic mutants.");

  // ================================================================ 5. Selection
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Recognition and agreement select the architectures", { placeholder: "title" });
  iconCircle(s, "Recognition", ic.accurate, MX, 1.2, 0.48);
  text(s, M`$g_I$ is the probability that a DISC observer regards a type-$I$ individual as good.`, { objectName: "Definition g", x: 1.15, y: 1.17, w: 4.65, h: 0.55, valign: "middle" });
  iconCircle(s, "Agreement", ic.shared, MX, 1.87, 0.48);
  text(s, M`$d_I$ is the probability that two DISC observers disagree about the same type-$I$ individual.`, { objectName: "Definition d", x: 1.15, y: 1.84, w: 4.65, h: 0.55, valign: "middle" });
  EQ(s, "recog", MX, 0, 5.3, "c", { vcenter: 2.85 });
  card(s, "Selection rule", MX, 3.4, 5.3, 1.45, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(s, P([[{ text: "Selection rule", bold: true, italic: false, sub: false, sup: false, accent: true }],
             M`Among allocations with $\Delta g\geq0.8$ and $\bar d\leq0.1$, take the one with the smallest total depth $K=k_1+k_2$. The rule uses reputation statistics only.`]),
    { objectName: "Selection rule text", x: 0.72, y: 3.4, w: 4.9, h: 1.45, valign: "middle" });
  text(s, "Selected architectures", { objectName: "Selected heading", x: 6.15, y: 1.17, w: 3.3, h: 0.3, bold: true, fontSize: 15 });
  [["SC", 2, 0, "protects good standing"], ["SH", 3, 0, "protects good standing"], ["SJ", 4, 3, "acts in both directions"], ["SS", 1, 2, "slows recovery"]].forEach((a, i) => {
    const y = 1.55 + i * 0.74, x = 6.15;
    card(s, `Selected ${a[0]}`, x, y, 3.35, 0.66);
    text(s, a[0], { objectName: `Selected ${a[0]} norm`, x: x + 0.15, y: y + 0.06, w: 0.5, h: 0.3, bold: true, fontSize: 15 });
    text(s, `(${a[1]}, ${a[2]})`, { objectName: `Selected ${a[0]} depths`, x: x + 0.62, y: y + 0.06, w: 0.75, h: 0.3, fontSize: 15 });
    for (let j = 0; j < a[1]; j++) dot(s, `Selected ${a[0]} warning ${j + 1}`, x + 1.45 + j * 0.2, y + 0.13, 0.14, { color: BAD }, null);
    for (let j = 0; j < a[2]; j++) dot(s, `Selected ${a[0]} recovery ${j + 1}`, x + 1.45 + a[1] * 0.2 + 0.12 + j * 0.2, y + 0.13, 0.14, { color: GOOD }, null);
    text(s, a[3], { objectName: `Selected ${a[0]} note`, x: x + 0.15, y: y + 0.36, w: 3.1, h: 0.26, fontSize: FS.small, color: MUTED });
  });
  dot(s, "Legend warning", 6.17, 4.58, 0.14, { color: BAD }, null);
  text(s, "warning state", { objectName: "Legend warning label", x: 6.38, y: 4.52, w: 1.2, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
  dot(s, "Legend recovery", 7.67, 4.58, 0.14, { color: GOOD }, null);
  text(s, "recovery state", { objectName: "Legend recovery label", x: 7.88, y: 4.52, w: 1.4, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
  s.addNotes("We measure recognition by the reputational separation delta g: the average goodness of DISC and ALLC minus that of ALLD, as seen by DISC observers. We measure agreement by the mean disagreement d bar, the probability that two DISC observers hold different images of the same individual. Agreement alone is not enough, because observers can agree that everyone is bad. Among allocations with delta g at least 0.8 and d bar at most 0.1, we take the one with the smallest total depth. This gives (2,0) for Scoring, (3,0) for Shunning, (4,3) for Stern Judging and (1,2) for Simple Standing. The selection uses reputation statistics only, without reference to evolutionary outcomes.");

  // ================================================================ 6. Derivation of the reputation map
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Deriving the stationary reputation map", { placeholder: "title" });
  text(s, M`Take one record whose assessments are independent and positive with probability $u$, and let $v=1-u$. Its state follows the Markov chain $T(u)=uT^{+}+vT^{-}$.`,
    { objectName: "Map lead", x: MX, y: 1.08, w: CW, h: 0.55 });
  card(s, "Map result", 0.35, 3.72, 9.3, 1.2, { fill: { color: ORANGE, transparency: 88 }, line: { color: ORANGE, width: 0, transparency: 100 } });
  [
    { id: "paths", lab: M`Path states are entered only from their predecessor`, yc: 2.0 },
    { id: "flux", lab: M`Flux balance between good and bad standing`, yc: 2.62 },
    { id: "pi", lab: M`Normalization`, yc: 3.26 },
    { id: "map", lab: M`**Reputation map**, the stationary probability of being regarded as good`, yc: 4.32 },
  ].forEach((r, i) => {
    num(s, `Map step ${i + 1}`, i + 1, MX, r.yc - 0.18);
    text(s, r.lab, { objectName: `Map step ${i + 1} label`, x: 1.0, y: r.yc - 0.3, w: 2.5, h: 0.6, valign: "middle" });
    EQ(s, r.id, 3.65, 0, 5.85, "l", { vcenter: r.yc });
  });
  s.addNotes("Consider one record whose assessments are independent and positive with probability u. Its state is a Markov chain. Warning state W_m can only be entered from W_{m-1} after a negative assessment, and recovery state S_n only from S_{n-1} after a positive one. This gives the geometric weights in step 1. The only transitions from good to bad standing complete a run of k1 plus one negative assessments, and the only reverse transitions complete a run of k2 plus one positive ones. Balancing these two fluxes and normalizing gives the stationary distribution. Averaging the image probabilities over it gives the reputation map, the stationary probability that the target is regarded as good.");

  // ================================================================ 7. Properties of the map
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Properties of the reputation map", { placeholder: "title" });
  {
    const X = MX, W = 4.8;
    const item = (runs, y, name) => {
      s.addShape(pres.shapes.RECTANGLE, { objectName: name + " marker", x: X, y: y + 0.08, w: 0.1, h: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
      text(s, runs, { objectName: name, x: X + 0.25, y, w: W - 0.25, h: 0.5 });
    };
    item(M`Without inertia, $\mathscr{R}(u)=u$.`, 1.15, "Property linear");
    item(M`With $\alpha=\beta=1$, $\mathscr{R}$ is the fraction of time spent in good standing.`, 1.6, "Property time");
    EQ(s, "full", X + 0.25, 0, W - 0.25, "c", { vcenter: 2.5 });
    item(M`Slope near a good record, for $k_1\geq1$`, 2.98, "Property slope");
    EQ(s, "slope", X + 3.35, 0, 1.45, "l", { vcenter: 3.11 });
    item(M`$\mathscr{R}$ increases with $\alpha$, decreases with $\beta$, and is concave when $k_2=0$.`, 3.45, "Property monotone");
    card(s, "Map takeaway", X, 4.17, W, 0.72, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
    text(s, M`With full tolerance strength, rare negative evidence barely changes a good reputation.`,
      { objectName: "Map takeaway text", x: X + 0.2, y: 4.17, w: W - 0.4, h: 0.72, valign: "middle" });
  }
  figure(s, "reputation_map", 5.65, 1.1, 3.25);
  text(s, M`$\mathscr{R}(u)$ for SJ architectures. Inset: near $u=1$ the slope is $1-\alpha$.`,
    { objectName: "Map figure caption", x: 5.65, y: 4.42, w: 3.85, h: 0.45, fontSize: FS.caption, color: MUTED });
  s.addNotes("Without inertia the map is the identity. With full strengths it is the fraction of time spent in good standing. The map increases with the tolerance strength and decreases with the strictness strength, and it is concave when there is no recovery path. Near a mostly good record, with at least one warning state, its slope is one minus alpha. With full tolerance strength the map is therefore flat near u equals one, so rare negative evidence barely changes a good reputation. This property matters again for opportunistic defectors.");

  // ================================================================ 8. Population reputations
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("From single records to population reputations", { placeholder: "title" });
  [[M`Donor and observer images of a recipient are independent, given its strategy.`, "A1"],
   [M`Assessments entering a record are independent, positive with probability $u_I$.`, "A2"]].forEach((a, i) => {
    const x = MX + i * 4.65;
    card(s, `Assumption ${a[1]}`, x, 1.12, 4.35, 0.82);
    dot(s, `Assumption ${a[1]} badge`, x + 0.15, 1.27, 0.52, { color: INK }, a[1], WHITE, 14);
    text(s, a[0], { objectName: `Assumption ${a[1]} text`, x: x + 0.82, y: 1.12, w: 3.4, h: 0.82, valign: "middle" });
  });
  [
    { id: "uI1", lab: M`Assessment of type-$I$ donors`, yc: 2.3 },
    { id: "uI2", lab: null, yc: 2.72 },
    { id: "sc", lab: M`Self-consistency, from initially good records`, yc: 3.28 },
    { id: "res", lab: M`Homogeneous DISC population`, yc: 3.85 },
  ].forEach((r, i) => {
    if (r.lab) text(s, T(r.lab, { bold: true }), { objectName: `Population row ${i + 1} label`, x: MX, y: r.yc - 0.25, w: 2.55, h: 0.5, valign: "middle" });
    EQ(s, r.id, 3.15, 0, 6.35, "l", { vcenter: r.yc });
  });
  text(s, M`$\Phi_{\mathrm{C}}(r)$ and $\Phi_{\mathrm{D}}(r)$ are the probabilities that intended cooperation and defection are assessed positively, and the $h$ terms are joint probabilities of the donor's and the observer's images. The resident reputation $r_{\mathrm{R}}^*$ is the highest strictly stable root of $F$.`,
    { objectName: "Population note", x: MX, y: 4.25, w: CW, h: 0.65, fontSize: FS.small, color: MUTED });
  s.addNotes("To go from single records to a population we use two mean-field assumptions, as in previous analyses of private assessment. First, the donor's and the observer's images of a recipient are independent given its strategy. Second, the assessments entering a record of a type-I individual are independent with a common probability u_I, so each record has the stationary response R. Stationary reputations then satisfy r_I equals R of u_I. This can have several solutions, and we select the one reached from initially good records. In a homogeneous DISC population the condition reduces to a scalar equation F of r equals zero. Stable roots have F prime negative, and the resident reputation is the highest strictly stable root.");

  // ================================================================ 9. Strategy evolution
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Strategy evolution and cooperation", { placeholder: "title" });
  {
    const X = MX, W = 5.7;
    [
      { id: "pay", lab: M`Payoffs per unit time, with stationary reputations at every composition`, y: 1.12, yc: 1.6 },
      { id: "rep", lab: M`Replicator dynamics`, y: 1.98, yc: 2.52 },
      { id: "coop", lab: M`Realized cooperation`, y: 2.95, yc: 3.37 },
    ].forEach((r, i) => {
      text(s, r.lab, { objectName: `Evolution label ${i + 1}`, x: X, y: r.y, w: W, h: 0.3, color: MUTED });
      EQ(s, r.id, X, 0, W, "c", { vcenter: r.yc });
    });
    card(s, "Measures", X, 3.8, W, 1.08);
    [[M`$\bar\rho$`, "mean long-run cooperation"], [M`$\omega_{\mathrm{C}}$`, "cooperative basin"], [M`$\bar\rho_{\mathrm{C}}$`, "cooperation within the basin"]].forEach((m, i) => {
      const x = X + 0.15 + i * 1.85;
      text(s, T(m[0], { bold: true, color: ORANGE_TEXT }), { objectName: `Measure ${i + 1} symbol`, x, y: 3.88, w: 1.7, h: 0.45, fontSize: 22, align: "center" });
      text(s, m[1], { objectName: `Measure ${i + 1} label`, x, y: 4.33, w: 1.7, h: 0.48, fontSize: FS.small, color: MUTED, align: "center" });
    });
  }
  { // simplex with initial compositions spread uniformly by area
    const tx = 6.6, ty = 1.5, tw = 2.75, th = tw * 0.866;
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { objectName: "Simplex", x: tx, y: ty, w: tw, h: th, fill: { color: CARD }, line: { color: MUTED, width: 1 } });
    const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
    for (let i = 1; i <= 90; i++) {
      let a = halton(i, 2), b = halton(i, 3);
      if (a + b > 1) { a = 1 - a; b = 1 - b; }
      // barycentric: apex (top) weight a, bottom-left weight b, bottom-right the rest
      const px = (tx + tw / 2) * a + tx * b + (tx + tw) * (1 - a - b);
      const py = ty * a + (ty + th) * (1 - a);
      dot(s, `Initial composition ${i}`, px - 0.025, py - 0.025, 0.05, { color: MUTED }, null);
    }
    text(s, "DISC", { objectName: "Vertex DISC", x: tx + tw / 2 - 0.5, y: ty - 0.32, w: 1.0, h: 0.28, align: "center", bold: true });
    text(s, "ALLC", { objectName: "Vertex ALLC", x: tx - 0.45, y: ty + th + 0.05, w: 0.9, h: 0.28, align: "center", bold: true });
    text(s, "ALLD", { objectName: "Vertex ALLD", x: tx + tw - 0.45, y: ty + th + 0.05, w: 0.9, h: 0.28, align: "center", bold: true });
    text(s, "Initial compositions are sampled uniformly by area, 512 per analysis (90 shown).",
      { objectName: "Simplex caption", x: 6.4, y: 4.35, w: 3.1, h: 0.5, fontSize: FS.small, color: MUTED });
  }
  s.addNotes("Reputations equilibrate quickly relative to strategy change, so payoffs at every composition use the stationary reputations reached from initially good records. ALLC always pays the cost, ALLD never does, and DISC pays it at rate r bar. Strategy frequencies follow the replicator dynamics. Realized cooperation is at most one minus e1, that is 0.98. We integrate from 512 initial compositions sampled uniformly by area. Every trajectory ends either in the zero-cooperation set or at an attractor with positive cooperation, so we report mean cooperation rho bar, the cooperative basin omega C and cooperation within the basin, with rho bar approximately omega C times rho bar C.");

  // ================================================================ 10. Unconditional mutants
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Local stability against rare unconditional mutants", { placeholder: "title" });
  {
    const X = MX, W = 5.75;
    text(s, M`A rare mutant X intends to help with probability $\chi_{\mathrm{X}}$, whatever its image of the recipient. ALLD has $\chi=0$ and ALLC has $\chi=1$.`,
      { objectName: "Mutant lead", x: X, y: 1.08, w: W, h: 0.55 });
    EQ(s, "mut", X, 0, W, "c", { vcenter: 1.95 });
    text(s, M`Pure DISC resists both ALLD and ALLC if and only if`, { objectName: "Window lead", x: X, y: 2.3, w: W, h: 0.3 });
    EQ(s, "win", X, 0, W, "c", { vcenter: 2.95 });
    text(s, M`The window is open if and only if $\mathscr{R}$ lies above its chord,`, { objectName: "Chord lead", x: X, y: 3.35, w: W, h: 0.3 });
    EQ(s, "chord", X, 0, W, "c", { vcenter: 3.85 });
  }
  figure(s, "chord", 6.55, 1.1, 2.6);
  text(s, "Schematic of the chord condition.", { objectName: "Chord caption", x: 6.55, y: 3.75, w: 2.95, h: 0.25, fontSize: FS.caption, color: MUTED });
  card(s, "Window takeaway", MX, 4.2, CW, 0.68, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, M`Without inertia $\mathscr{R}$ is linear, so no $b/c$ protects pure DISC. Inertia bends $\mathscr{R}$ and opens the window.`,
    { objectName: "Window takeaway text", x: 0.75, y: 4.2, w: 8.5, h: 0.68, valign: "middle", color: WHITE });
  s.addNotes("Consider a homogeneous DISC population at its resident reputation and a rare mutant X that helps with probability chi, independently of its image of the recipient. Its normalized payoff advantage is the cost it saves minus the benefit it loses through reputation. ALLD has chi zero and ALLC has chi one. The resident resists both if and only if b over c lies between R_L and R_U. The lower bound requires ALLD to lose enough help to offset the cost it saves. The upper bound prevents ALLC from gaining more through a better reputation than it pays for helping recipients regarded as bad. The window is non-empty exactly when the reputation map at the resident's assessment probability lies above the chord joining its values at Phi_D and Phi_C. Without inertia the map is linear, the chord coincides with it, and no benefit-to-cost ratio protects DISC.");

  // ================================================================ 11. O-DISC
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Opportunistic discriminators (O-DISC)", { placeholder: "title" });
  text(s, M`O-DISC behaves like DISC but withholds help from a recipient it regards as good with probability $\delta$.`,
    { objectName: "O-DISC lead", x: MX, y: 1.08, w: CW, h: 0.3 });
  { // delta axis
    const y = 1.72;
    s.addShape(pres.shapes.RECTANGLE, { objectName: "Occasional range", x: 1.35, y: y - 0.09, w: 7.3, h: 0.18,
      fill: { color: ORANGE, transparency: 70 }, line: { color: ORANGE, width: 0, transparency: 100 } });
    dot(s, "Axis DISC end", 1.05, y - 0.13, 0.26, { color: GOOD }, null);
    dot(s, "Axis ALLD end", 8.7, y - 0.13, 0.26, { color: BAD }, null);
    text(s, M`$\delta=0$, DISC`, { objectName: "Axis DISC label", x: 0.5, y: y + 0.18, w: 1.4, h: 0.28, fontSize: FS.small, align: "center" });
    text(s, M`$\delta=1$, ALLD`, { objectName: "Axis ALLD label", x: 8.1, y: y + 0.18, w: 1.4, h: 0.28, fontSize: FS.small, align: "center" });
    text(s, M`occasional defection, $0<\delta<1$, not tested by resistance to ALLD`,
      { objectName: "Axis middle label", x: 2.5, y: y + 0.18, w: 5.0, h: 0.28, fontSize: FS.small, color: ORANGE_TEXT, align: "center" });
  }
  [
    { id: "lam", lab: M`Invasion payoff`, yc: 2.55 },
    { id: "slope0", lab: M`Slope at $\delta=0$`, yc: 3.1 },
    { id: "hmin", lab: M`Every O-DISC is excluded if and only if`, yc: 3.7 },
  ].forEach((r, i) => {
    text(s, T(r.lab, { bold: true }), { objectName: `O-DISC row ${i + 1} label`, x: MX, y: r.yc - 0.25, w: 2.4, h: 0.5, valign: "middle" });
    EQ(s, r.id, 3.0, 0, 6.5, "l", { vcenter: r.yc });
  });
  card(s, "Error-free result", MX, 4.18, CW, 0.74, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(s, M`**Error-free limit** ($e_1=e_2=0$, $\beta=1$, $k_1\geq1$). Every O-DISC is excluded if and only if $\alpha\leq1-c/b$, for all four norms and every $k_2$.`,
    { objectName: "Error-free text", x: 0.7, y: 4.18, w: 8.6, h: 0.74, valign: "middle" });
  s.addNotes("Tolerance protects discriminators from erroneous negative assessments, but it might also shelter individuals who defect occasionally. The opportunistic discriminator withholds help from a recipient it regards as good with probability delta. Delta zero is DISC and delta one is ALLD, so resistance to ALLD only tests the endpoint. The invasion payoff is the cost saved minus the benefit lost through a worse reputation. At delta zero its slope depends on the slope of the reputation map at the resident state. If the map is flat there, as with full tolerance strength, weak opportunism costs almost no reputation and can invade. The whole family is excluded if and only if the smallest reputation loss per unit of withheld cooperation is at least c over b. In the error-free limit this reduces to alpha at most one minus c over b, which is 0.8 at b over c equal to 5. Secure tolerance strengths form an interval: its lower end is a fold of the high-reputation state, and its upper end is set by this slope condition.");

  // ================================================================ 12. Methods to results
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("From methods to results", { placeholder: "title" });
  [
    { icon: ic.quality, t: "Reputation quality", m: M`Finite-population simulations`, q: M`$\Delta g$ and $\bar d$`, f: "Fig. 2 · ED Fig. 1" },
    { icon: ic.evolution, t: "Evolution of cooperation", m: M`Mean-field reputations and replicator dynamics`, q: M`$\bar\rho$, $\omega_{\mathrm{C}}$ and the window $R_{\mathrm{L}}<b/c<R_{\mathrm{U}}$`, f: "Figs. 3–4 · ED Figs. 2–8" },
    { icon: ic.shield, t: "Resistance to opportunism", m: M`Invasion analysis of the O-DISC family`, q: M`$\Lambda'(0)$, $H_{\min}$ and secure $\alpha$`, f: "Fig. 5 · ED Fig. 9" },
  ].forEach((c, i) => {
    const x = MX + i * 3.1;
    card(s, `Result route ${i + 1}`, x, 1.15, 2.8, 3.0);
    iconCircle(s, `Result route ${i + 1}`, c.icon, x + 0.2, 1.3, 0.55);
    text(s, c.t, { objectName: `Result route ${i + 1} title`, x: x + 0.2, y: 1.95, w: 2.45, h: 0.55, bold: true, fontSize: FS.cardTitle });
    text(s, c.m, { objectName: `Result route ${i + 1} method`, x: x + 0.2, y: 2.52, w: 2.45, h: 0.55 });
    text(s, c.q, { objectName: `Result route ${i + 1} measures`, x: x + 0.2, y: 3.1, w: 2.45, h: 0.5, fontSize: FS.small, color: MUTED });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Result route ${i + 1} tag`, x: x + 0.2, y: 3.68, w: 2.4, h: 0.34, rectRadius: 0.06,
      fill: { color: ORANGE, transparency: 80 }, line: { color: ORANGE, width: 0, transparency: 100 } });
    text(s, c.f, { objectName: `Result route ${i + 1} tag text`, x: x + 0.2, y: 3.68, w: 2.4, h: 0.34, fontSize: FS.small, bold: true, color: ORANGE_TEXT, align: "center", valign: "middle" });
    if (i < 2) arrow(s, `Result route arrow ${i + 1}`, x + 2.84, 2.65, x + 3.06, 2.65, INK);
  });
  text(s, "The architectures are selected in the first step and tested, unchanged, in the other two.",
    { objectName: "Routes note", x: MX, y: 4.38, w: CW, h: 0.45, italic: true, color: MUTED, valign: "middle" });
  s.addNotes("The three parts of the method map onto the results. Simulations of reputation formation give Fig. 2 and the selection of the architectures. Mean-field reputations with replicator dynamics and the local stability window give Figs. 3 and 4 and most Extended Data figures. The invasion analysis of opportunistic discriminators gives Fig. 5. The architectures are chosen in the first step and are not tuned for the later ones.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
