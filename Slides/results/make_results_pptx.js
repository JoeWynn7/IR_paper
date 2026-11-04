// Section 3 of the talk, "Main results", as an editable PowerPoint deck.
// One slide per main figure (Fig. 5 split into panels a and b), with caption and key
// message, plus a native chart of cooperative basins and a summary table built from the
// verified data. Texts follow Manuscript_doc/intro_revisions/Framing_and_results_text.md.
// Text written as M`...` may contain inline LaTeX ($...$), **bold** and !!accent!!;
// build_assets.py converts these strings to styled runs.
// Usage: NODE_PATH=<modules> PPTX_SKILL=<pptx skill dir> node make_results_pptx.js <asset_dir> <out.pptx>
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

// ------------------------------------------------------------------ theme (same as Sections 1 and 2)
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
pres.title = "Indirect reciprocity with inertial reputation updating: main results";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const FS = { title: 24, cardTitle: 16, body: 14, small: 12, caption: 11, source: 10 };
const MX = 0.5, CW = 9.0;
const SEC = "Main results";

// ------------------------------------------------------------------ layouts (same as Sections 1 and 2)
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

// ------------------------------------------------------------------ helpers
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
function text(slide, t, o) {
  const isRuns = Array.isArray(t) && t.length && t[0].options === undefined && "italic" in t[0];
  slide.addText(isRuns ? T(t) : t, Object.assign({ isTextBox: true, margin: 0, fontSize: FS.body, color: INK, valign: "top" }, o));
}
function sources(slide, t) {
  text(slide, t, { objectName: "Sources", x: MX, y: 5.02, w: 8.3, h: 0.4, fontSize: FS.source, color: MUTED });
}
async function iconData(Comp, hex = "#FFFFFF") {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: hex, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
function card(slide, name, x, y, w, h, opt = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ objectName: name, x, y, w, h, rectRadius: 0.08,
    fill: { color: CARD }, line: { color: CARD, width: 0 } }, opt));
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
function tag(slide, name, label, x, y, w) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h: 0.3, rectRadius: 0.06,
    fill: { color: ORANGE, transparency: 80 }, line: { color: ORANGE, width: 0, transparency: 100 } });
  text(slide, label, { objectName: name + " text", x, y, w, h: 0.3, fontSize: FS.small, bold: true, color: ORANGE_TEXT, align: "center", valign: "middle" });
}
const pct = (v) => Math.round(100 * v) + "%";

// Figure on the left, caption and key message in the column on the right.
function figureSlide({ title, fig, figH, label, caption, capH, message, src, notes }) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText(title, { placeholder: "title" });
  const f = A.figures[fig];
  const w = figH * f.aspect;
  s.addImage({ objectName: "Figure " + fig, path: f.png, x: MX, y: 1.12, w, h: figH, altText: label });
  const X = MX + w + 0.3, W = 9.5 - X;
  tag(s, "Figure label", label, X, 1.12, 1.0);
  text(s, caption, { objectName: "Caption", x: X, y: 1.55, w: W, h: capH, fontSize: FS.caption, color: MUTED });
  const my = 1.55 + capH + 0.15, mh = 4.88 - my;
  card(s, "Key message", X, my, W, mh, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(s, [{ text: "Key message", options: { bold: true, color: ORANGE_TEXT, breakLine: true } }, ...T(message)],
    { objectName: "Key message text", x: X + 0.18, y: my, w: W - 0.36, h: mh, valign: "middle" });
  if (src) sources(s, src);
  s.addNotes(notes);
  return s;
}

(async () => {
  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 3 · Main results", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  { // motif: one full cycle, loss through a warning state and recovery through a recovery state
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19, 2.91, 3.63];
    const fills = [{ color: GOOD }, { color: BAD, transparency: 55 }, { color: BAD }, { color: GOOD, transparency: 55 }, { color: GOOD }];
    const labels = ["G", [{ text: "W" }, { text: "1", options: { subscript: true } }], "B", [{ text: "S" }, { text: "1", options: { subscript: true } }], "G"];
    fills.forEach((f, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, f, null);
      s.addText(labels[i], { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE });
      if (i < 4) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, i < 2 ? BAD : GOOD, { width: 1.5 });
    });
  }
  s.addNotes("This part presents the four main results in figure order. Each figure answers one part of the two questions from the motivation.");

  pres.addSection({ title: SEC });

  // ================================================================ 2. Overview
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Four results", { placeholder: "title" });
  [
    ["Where inertia sits decides whether private reputations are accurate and shared", "Fig. 2"],
    ["Directional inertia makes cooperation both stable and easy to reach", "Fig. 3"],
    ["Allocation matters more than the amount of memory", "Fig. 4"],
    ["Forgiveness can shelter opportunists, and partial consequences restore deterrence", "Fig. 5"],
  ].forEach((r, i) => {
    const x = MX + (i % 2) * 4.65, y = 1.15 + Math.floor(i / 2) * 1.9;
    card(s, `Result ${i + 1}`, x, y, 4.35, 1.72);
    dot(s, `Result ${i + 1} number`, x + 0.22, y + 0.22, 0.48, { color: ORANGE }, String(i + 1), WHITE, 16);
    text(s, r[0], { objectName: `Result ${i + 1} headline`, x: x + 0.9, y: y + 0.2, w: 3.25, h: 0.95, bold: true, fontSize: FS.cardTitle });
    tag(s, `Result ${i + 1} figure`, r[1], x + 0.9, y + 1.24, 0.9);
  });
  text(s, "Results 1–3 concern the direction of inertia. Result 4 concerns how incomplete evidence is treated.",
    { objectName: "Overview note", x: MX, y: 4.95, w: 8.3, h: 0.3, fontSize: FS.caption, color: MUTED });
  s.addNotes("Four results, one per main figure. The first two concern the direction of inertia: it decides whether private reputations are accurate and shared, and whether cooperation is stable and easy to reach. The third separates direction from amount. The fourth concerns the second question, how incomplete evidence should be treated: tolerance invites occasional defectors, and giving warning states partial consequences restores deterrence.");

  // ================================================================ 3. Fig. 2
  figureSlide({
    title: "Where inertia sits decides reputation quality", fig: "Fig2", figH: 3.5, label: "Fig. 2", capH: 1.3,
    caption: M`**a–d**, Private reputation matrices without inertia, with one-step inertia and with the selected architectures. Rows are DISC observers, columns are DISC, ALLC and ALLD targets, and blue means good. **e–h**, Separation $\Delta g$ (colour) and disagreement $\bar d$ (circle area) across depths. Stars mark the selected architectures.`,
    message: M`Without inertia, or with one step in both directions, observers disagree or agree on the wrong verdict. Inertia in the norm-specific direction makes them agree and still separate cooperators from defectors.`,
    src: M`Parameters: $e_1=e_2=0.02$, equal strategy numbers, $N=90$ for the matrices and $N=150$ for the depth maps, $\alpha=\beta=1$.`,
    notes: "Each norm fails in its own way without inertia. Under Scoring observers are divided about discriminators, Shunning drives almost everyone to bad, Stern Judging sustains widespread disagreement and Simple Standing trusts defectors. One-step inertia does not fix this. Under Shunning, observers now agree, but only because they regard nearly everyone as bad. The depth maps show that allocations with the same total depth give very different separation and disagreement. The stars mark the smallest qualifying architectures: (2,0) for Scoring, (3,0) for Shunning, (4,3) for Stern Judging and (1,2) for Simple Standing. With them, observers regard DISC and ALLC as good and ALLD as bad, and they largely agree.",
  });

  // ================================================================ 4. Fig. 3
  figureSlide({
    title: "Cooperation becomes stable and easy to reach", fig: "Fig3", figH: 3.5, label: "Fig. 3", capH: 1.3,
    caption: M`Replicator dynamics of ALLC, ALLD and DISC without inertia (**a**), with one-step inertia (**b**) and with the selected architectures (**c**). Filled and open circles are stable and unstable equilibria. Shading marks the basin of a cooperative state, and percentages give intended cooperation there.`,
    message: M`One-step inertia already stabilizes discriminators, but under Shunning and Stern Judging few starting points lead there. The selected architectures make cooperation the outcome for most initial conditions under all four norms.`,
    src: M`Parameters: $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$. Reputations are relaxed from initially good records at every composition.`,
    notes: "Without inertia, Shunning and Stern Judging do not support cooperation, and under Scoring and Simple Standing a pure DISC population is not a stable cooperative state. Note that the Scoring panel in row a is still the draft version; Scoring has a line of equilibria there, which will be drawn as a single line. One-step inertia makes highly cooperative DISC populations locally stable under all four norms, but under Shunning and Stern Judging their basins are narrow. With the selected architectures, pure DISC is a stable equilibrium with near-complete intended cooperation under Scoring, Shunning and Stern Judging, and it is reached from most initial compositions. Under Simple Standing, the cooperative attractor is a stable mixture of DISC and ALLC.",
  });

  // ================================================================ 5. Basin chart
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Selected architectures enlarge the cooperative basin", { placeholder: "title" });
  {
    const norms = [["SC", "Scoring"], ["SH", "Shunning"], ["SJ", "Stern Judging"], ["SS", "Simple Standing"]];
    const B = A.basins;
    const series = [["none", "No inertia"], ["one", "One-step (1,1)"], ["multi", "Selected architecture"]].map(([k, name]) => ({
      name, labels: norms.map((n) => n[1]), values: norms.map((n) => B[n[0]][k].basin) }));
    s.addChart(pres.charts.BAR, series, {
      objectName: "Cooperative basin chart", x: MX, y: 1.1, w: 6.0, h: 3.8, barDir: "col", barGrouping: "clustered", barGapWidthPct: 55,
      chartColors: ["B5BFC2", "2F6E9E", "E07B16"],
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0%", dataLabelFontSize: 10, dataLabelColor: "23373B", dataLabelFontFace: "+mn-lt",
      valAxisMinVal: 0, valAxisMaxVal: 1, valAxisMajorUnit: 0.25, valAxisLabelFormatCode: "0%", valAxisLabelFontSize: 11, valAxisLabelColor: "66767B", valAxisLabelFontFace: "+mn-lt",
      showValAxisTitle: true, valAxisTitle: "Cooperative basin", valAxisTitleFontSize: 12, valAxisTitleColor: "66767B", valAxisTitleFontFace: "+mn-lt",
      catAxisLabelFontSize: 12, catAxisLabelColor: "23373B", catAxisLabelFontFace: "+mn-lt", catAxisLineShow: true,
      valGridLine: { color: "E3E8EA", size: 0.75 }, catGridLine: { style: "none" },
      showLegend: true, legendPos: "t", legendFontSize: 12, legendColor: "23373B", legendFontFace: "+mn-lt", showTitle: false,
    });
    const X = 6.85, W = 2.65;
    [["SH", "Shunning"], ["SJ", "Stern Judging"]].forEach(([k, name], i) => {
      const y = 1.2 + i * 1.25;
      card(s, `Callout ${k}`, X, y, W, 1.1);
      text(s, name, { objectName: `Callout ${k} norm`, x: X + 0.2, y: y + 0.1, w: W - 0.4, h: 0.28, fontSize: FS.small, color: MUTED, bold: true });
      text(s, [{ text: pct(B[k].one.basin), options: { color: GOOD } }, { text: " → ", options: { color: MUTED } }, { text: pct(B[k].multi.basin), options: { color: ORANGE_TEXT } }],
        { objectName: `Callout ${k} value`, x: X + 0.2, y: y + 0.38, w: W - 0.4, h: 0.6, fontSize: 30, bold: true, valign: "middle" });
    });
    const within = norms.flatMap((n) => ["none", "one", "multi"].map((k) => B[n[0]][k].within)).filter((v) => v !== null);
    const lo = Math.round(100 * Math.min(...within)), hi = Math.round(100 * Math.max(...within));
    text(s, `Cooperation within the basin is ${lo}–${hi}% in every case, so mean cooperation follows the size of the basin.`,
      { objectName: "Within-basin note", x: X, y: 3.8, w: W, h: 1.0, fontSize: FS.body });
  }
  sources(s, M`Basin: share of 512 initial compositions that reach an attractor with positive cooperation. Verified data, $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$.`);
  s.addNotes("This chart summarizes the basins of attraction in Fig. 3. Under Shunning the cooperative basin grows from 8 to 71 percent of initial compositions, and under Stern Judging from 23 to 71 percent. Under Scoring it grows from about 60 to 88 percent. Under Simple Standing the gain is small, because one-step inertia already does well there. Cooperation inside the basin is 96 to 98 percent in every case, so the gain in mean cooperation comes almost entirely from larger basins rather than from more cooperation within them. The ALLD–DISC edge in Extended Data Fig. 4 shows why the basins expand.");

  // ================================================================ 6. Fig. 4
  figureSlide({
    title: "Allocation matters more than the amount of memory", fig: "Fig4", figH: 3.35, label: "Fig. 4", capH: 1.2,
    caption: M`Mean cooperation $\bar\rho$ for every allocation $(k_1,k_2)$ at total depth $K=k_1+k_2$, coloured by the tolerance fraction $k_1/K$. Outlined points joined by the line are the best allocation at each depth. $K=0$ is instantaneous updating.`,
    message: M`At the same depth, cooperation ranges from absent to high depending on which path receives the states, and extra depth gives diminishing returns. The selected architectures are the best allocations at their depth.`,
    src: M`Verified data. Parameters: $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$, 512 initial compositions per point.`,
    notes: "Here we compare all allocations with the same total depth. Under Scoring with eight intermediate states, mean cooperation ranges from zero when all are recovery states to high when all are warning states. The best allocations protect good standing under Scoring and Shunning, combine both paths under Stern Judging at larger depths, and pair a short warning path with a longer recovery path under Simple Standing. Gains flatten after a few states. The four architectures chosen from reputation statistics alone are the most cooperative allocations at their depths.",
  });

  // ================================================================ 7. Fig. 5a
  figureSlide({
    title: "Forgiveness can shelter opportunists", fig: "Fig5a", figH: 3.75, label: "Fig. 5a", capH: 1.25,
    caption: M`Invasion payoff $\Lambda$ (vertical axis) of an O-DISC mutant against a DISC resident under SJ, as a function of the omission probability $\delta$. Curves compare one-step inertia, the selected architecture $(4,3)$ with $\alpha=1$ and $\alpha=0.8$, an aggregation rule and a quantitative score. Positive values mean invasion.`,
    message: M`Every mechanism shown excludes ALLD. Under full tolerance strength, O-DISC mutants with $0<\delta<0.365$ can still invade, and aggregation and quantitative scores show similar windows.`,
    src: M`Aggregation after Michel-Mata et al. 2024, quantitative score after Schmid et al. 2023. Parameters: $b/c=5$, $e_1=e_2=0.02$, $\beta=1$.`,
    notes: "An opportunistic discriminator withholds help from good recipients with probability delta. All five mechanisms compared here exclude ALLD, the endpoint delta equal to one. Under the selected Stern Judging architecture with full tolerance strength, however, every mutant with delta between 0 and 0.365 can invade, and one-step inertia admits a narrow window of the same kind. Aggregation of two sampled assessments and a bounded quantitative score show similar windows. These two mechanisms were neither optimized nor matched in memory, so they illustrate a shared vulnerability, not a ranking. The cause is the flat reputation map near a good resident: weak opportunism costs almost no reputation.",
  });

  // ================================================================ 8. Fig. 5b
  figureSlide({
    title: "Partial consequences restore deterrence", fig: "Fig5b", figH: 3.75, label: "Fig. 5b", capH: 1.25,
    caption: M`Selected SJ architecture as the tolerance strength $\alpha$ varies. Top, the largest endpoint $\delta_c$ of the invasion window. Bottom, resident intended cooperation $r_{\mathrm{R}}^*$. The green band is the secure range $\alpha_{\mathrm{L}}<\alpha\leq\alpha_{\mathrm{U}}$.`,
    message: M`Lowering $\alpha$ from 1 to 0.8 excludes every O-DISC mutant while residents stay highly cooperative. Below $\alpha_{\mathrm{L}}\approx0.57$ the high-reputation state is lost, so protection holds in a bounded range.`,
    src: M`$\alpha_{\mathrm{L}}=0.567$ and $\alpha_{\mathrm{U}}=0.804$. Parameters: $b/c=5$, $e_1=e_2=0.02$, $\beta=1$.`,
    notes: "Lowering the tolerance strength gives warning states an immediate chance of being read as bad, which restores a reputational cost to weak opportunism. For the selected Stern Judging architecture, reducing alpha from 1 to 0.8 excludes every O-DISC mutant, and residents remain highly cooperative. Lowering alpha too far destroys the high-reputation resident state. The secure range runs from about 0.57 to 0.80. The lower end is a fold of the high-reputation state and does not depend on b over c. The upper end rises with b over c. Extended Data Fig. 9 shows that protective tolerance strengths exist under all four norms, and that the range closes under Shunning at b over c equal to 2.",
  });

  // ================================================================ 9. Results at a glance
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Results at a glance", { placeholder: "title" });
  {
    const B = A.basins;
    const head = (runs, align = "center") => ({ text: T(runs, { bold: true, color: WHITE, fontSize: 12 }), options: { fill: { color: INK }, align } });
    const rows = [[head(M`Norm`, "left"), head(M`Selected $(k_1,k_2)$`), head(M`Role of inertia`, "left"),
                   head(M`Cooperative basin, one-step → selected`), head(M`Mean cooperation $\bar\rho$`), { text: [...T(M`Resists O-DISC`, { bold: true, color: WHITE, fontSize: 12, breakLine: true }), ...T(M`at $\alpha=0.8$`, { bold: true, color: WHITE, fontSize: 12 })], options: { fill: { color: INK }, align: "center" } }]];
    [["SC", "Scoring", "protects good standing"], ["SH", "Shunning", "protects good standing"],
     ["SJ", "Stern Judging", "acts in both directions"], ["SS", "Simple Standing", "slows recovery"]].forEach(([k, name, role], i) => {
      const fill = { color: i % 2 ? WHITE : CARD };
      const m = B[k].multi;
      rows.push([
        { text: name, options: { fill, bold: true } },
        { text: `(${m.k1}, ${m.k2})`, options: { fill, align: "center" } },
        { text: role, options: { fill } },
        { text: [{ text: pct(B[k].one.basin), options: { color: GOOD } }, { text: " → ", options: {} }, { text: pct(m.basin), options: { bold: true, color: ORANGE_TEXT } }], options: { fill, align: "center" } },
        { text: m.mean.toFixed(2), options: { fill, align: "center" } },
        { text: "yes", options: { fill, align: "center" } },
      ]);
    });
    s.addTable(rows, { objectName: "Summary table", x: MX, y: 1.15, w: CW, colW: [1.65, 1.05, 2.3, 1.65, 1.1, 1.25], rowH: [0.6, 0.5, 0.5, 0.5, 0.5],
      fontSize: FS.body, color: INK, valign: "middle", margin: [0.03, 0.08, 0.03, 0.1], border: { type: "solid", pt: 0.5, color: "C4CED1" } });
  }
  card(s, "Glance takeaway", MX, 4.0, CW, 0.82, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, "Reputational criteria alone pick architectures that also make cooperation stable and accessible. Lowering the tolerance strength then closes the opportunistic loophole.",
    { objectName: "Glance takeaway text", x: 0.75, y: 4.0, w: 8.5, h: 0.82, color: WHITE, valign: "middle" });
  sources(s, M`Verified data, $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$ unless stated. Under SS the cooperative attractor is a DISC–ALLC mixture, because ALLC can invade pure DISC.`);
  s.addNotes("This table collects the four results per norm. The selected architectures protect good standing under Scoring and Shunning, act in both directions under Stern Judging and slow recovery under Simple Standing. They enlarge the cooperative basin, most strongly under Shunning and Stern Judging. At a tolerance strength of 0.8 all four resist the whole family of opportunistic discriminators while cooperation stays high. Under Simple Standing, ALLC can still invade pure DISC, so the cooperative attractor is a mixture of DISC and ALLC.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
