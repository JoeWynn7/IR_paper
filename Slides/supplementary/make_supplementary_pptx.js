// Section 5 of the talk, "Supplementary results", as an editable PowerPoint deck.
// One slide per Extended Data figure, with caption, key message and speaker notes.
// Texts follow the Extended Data legends of Manuscript_doc/latex_file/Manuscript_full_20261103.tex
// and Manuscript_doc/intro_revisions/Framing_and_results_text.md.
// Text written as M`...` may contain inline LaTeX ($...$), **bold** and !!accent!!;
// build_assets.py converts these strings to styled runs.
// Usage: NODE_PATH=<modules> PPTX_SKILL=<pptx skill dir> node make_supplementary_pptx.js <asset_dir> <out.pptx>
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts", "apply_theme.js"));

const ASSET_DIR = process.argv[2];
const OUT = process.argv[3];
const A = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, "assets.json"), "utf8"));

// ------------------------------------------------------------------ theme (same as Sections 1-3)
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
pres.title = "Indirect reciprocity with inertial reputation updating: supplementary results";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const FS = { title: 24, cardTitle: 16, body: 14, small: 12, caption: 11, source: 10 };
const MX = 0.5, CW = 9.0;
const SEC = "Supplementary results";

// ------------------------------------------------------------------ layouts (same as Sections 1-3)
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
function card(slide, name, x, y, w, h, opt = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ objectName: name, x, y, w, h, rectRadius: 0.08,
    fill: { color: CARD }, line: { color: CARD, width: 0 } }, opt));
}
function arrow(slide, name, x1, y1, x2, y2, color, o = {}) {
  slide.addShape(pres.shapes.LINE, { objectName: name, x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1,
    line: Object.assign({ color, width: 2, endArrowType: "triangle" }, o) });
}
function dot(slide, name, x, y, d, fill) {
  slide.addShape(pres.shapes.OVAL, { objectName: name, x, y, w: d, h: d,
    fill: { color: fill.color, transparency: fill.transparency || 0 }, line: { color: fill.color, width: 0 } });
}
function tag(slide, name, label, x, y, w) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h: 0.3, rectRadius: 0.06,
    fill: { color: ORANGE, transparency: 80 }, line: { color: ORANGE, width: 0, transparency: 100 } });
  text(slide, label, { objectName: name + " text", x, y, w, h: 0.3, fontSize: FS.small, bold: true, color: ORANGE_TEXT, align: "center", valign: "middle" });
}
function keyMessage(slide, x, y, w, h, message) {
  card(slide, "Key message", x, y, w, h, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
  text(slide, [{ text: "Key message", options: { bold: true, color: ORANGE_TEXT, breakLine: true } }, ...T(message)],
    { objectName: "Key message text", x: x + 0.18, y, w: w - 0.36, h, valign: "middle" });
}

// Figure on the left, caption and key message on the right.
// With wide: true the figure spans the slide and caption and message sit below it.
function edSlide({ n, title, figH, capH, caption, message, supports, src, notes, wide }) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText(title, { placeholder: "title" });
  const f = A.figures["ED_Fig" + n];
  const label = `ED Fig. ${n}`;
  if (wide) {
    const w = 7.6, h = w / f.aspect;
    s.addImage({ objectName: "Figure " + label, path: f.png, x: MX + (CW - w) / 2, y: 1.1, w, h, altText: label });
    const y = 1.1 + h + 0.2;
    tag(s, "Figure label", label, MX, y, 1.15);
    text(s, supports, { objectName: "Supports", x: MX + 1.3, y, w: 2.9, h: 0.3, fontSize: FS.small, color: MUTED, valign: "middle" });
    text(s, caption, { objectName: "Caption", x: MX, y: y + 0.42, w: 4.2, h: 4.88 - y - 0.42, fontSize: FS.caption, color: MUTED });
    keyMessage(s, 4.95, y, 4.55, 4.88 - y, message);
  } else {
    const w = figH * f.aspect;
    s.addImage({ objectName: "Figure " + label, path: f.png, x: MX, y: 1.12, w, h: figH, altText: label });
    const X = MX + w + 0.3, W = 9.5 - X;
    tag(s, "Figure label", label, X, 1.12, 1.15);
    text(s, supports, { objectName: "Supports", x: X + 1.3, y: 1.12, w: W - 1.3, h: 0.3, fontSize: FS.small, color: MUTED, valign: "middle" });
    text(s, caption, { objectName: "Caption", x: X, y: 1.55, w: W, h: capH, fontSize: FS.caption, color: MUTED });
    const my = 1.55 + capH + 0.15;
    keyMessage(s, X, my, W, 4.88 - my, message);
  }
  if (src) sources(s, src);
  s.addNotes(notes);
  return s;
}

(async () => {
  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 5 · Supplementary results", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  { // motif: a record that resets after an isolated negative assessment (G -> W1 -> G)
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19];
    const fills = [{ color: GOOD }, { color: BAD, transparency: 55 }, { color: GOOD }];
    const labels = ["G", [{ text: "W" }, { text: "1", options: { subscript: true } }], "G"];
    fills.forEach((f, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, f);
      s.addText(labels[i], { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE });
      if (i < 2) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, i === 0 ? BAD : GOOD, { width: 1.5 });
    });
  }
  s.addNotes("These backup slides show the nine Extended Data figures. Each one tests the robustness of a main result or explains its mechanism.");

  pres.addSection({ title: SEC });

  // ================================================================ 2. Overview
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Nine supplementary results", { placeholder: "title" });
  [
    ["Selection is robust to the thresholds", "Fig. 2"],
    ["Inertia removes history dependence", "Fig. 3"],
    ["Depths and strengths set reputations", "Fig. 2"],
    ["Rare discriminators avoid abrupt collapse", "Fig. 3"],
    ["The advantage holds across b/c", "Fig. 3"],
    ["Tolerance and strictness differ", "Fig. 3"],
    ["Protection holds across error rates", "Fig. 3"],
    ["Cooperation and protection differ", "Fig. 4"],
    ["Every norm has protective tolerance", "Fig. 5"],
  ].forEach((r, i) => {
    const c = i % 3, row = Math.floor(i / 3);
    const x = MX + c * 3.075, y = 1.12 + row * 1.3;
    card(s, `ED ${i + 1} card`, x, y, 2.85, 1.15);
    tag(s, `ED ${i + 1} tag`, `ED Fig. ${i + 1}`, x + 0.15, y + 0.13, 1.05);
    text(s, "supports " + r[1], { objectName: `ED ${i + 1} supports`, x: x + 1.32, y: y + 0.13, w: 1.4, h: 0.3, fontSize: FS.caption, color: MUTED, valign: "middle" });
    text(s, r[0], { objectName: `ED ${i + 1} headline`, x: x + 0.15, y: y + 0.5, w: 2.6, h: 0.6, bold: true, fontSize: FS.body });
  });
  s.addNotes("The nine Extended Data figures, in order. Two support the reputation results of Fig. 2, five support the evolutionary results of Fig. 3, one extends the depth comparison of Fig. 4, and one extends the opportunism analysis of Fig. 5 to all four norms.");

  // ================================================================ 3-11. Extended Data figures
  edSlide({
    n: 1, title: "Selection is robust to the thresholds", figH: 3.05, capH: 1.3, supports: "supports Fig. 2",
    caption: M`**a–d**, Separation $\Delta g$ and disagreement $\bar d$ for all tested depth pairs, coloured by total depth $K$. The shaded region meets both criteria, and stars mark the selected pairs. **e–h**, Pair selected when the two thresholds vary. Orange boxes mark the default criteria.`,
    message: M`Changing the criteria changes the exact depths, but the qualifying architectures stay compact and keep the same directional pattern.`,
    src: M`30 independent runs per condition, $N=150$, equal strategy numbers, $e_1=e_2=0.02$, $\alpha=\beta=1$.`,
    notes: "Panels a to d plot separation against disagreement for every tested depth pair, averaged over 30 runs. The shaded corner meets both criteria, and the stars mark the qualifying pairs with the smallest total depth, the same four architectures as in Fig. 2. Panels e to h vary the separation cutoff and the disagreement cutoff. The exact depths change with the thresholds, but compact qualifying architectures persist over a range of criteria, and the directional pattern is the same.",
  });
  edSlide({
    n: 2, title: "Directional inertia removes history dependence", figH: 3.2, capH: 1.3, supports: "supports Fig. 3",
    caption: M`**a–d**, Reputation dynamics of a homogeneous DISC population, for no inertia (grey), one-step inertia (blue) and the selected architectures (red). Filled circles are stable equilibria. **e–h**, Mean cooperation after all-good (solid) and all-bad (hatched) initial reputations.`,
    message: M`With one-step inertia, DISC populations under SC, SH and SJ are bistable, so cooperation depends on initial reputations. The selected architectures leave a single high-reputation state.`,
    src: M`Parameters: $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$.`,
    notes: "With one-step inertia, homogeneous DISC populations under Scoring, Shunning and Stern Judging have both a high and a low stable reputation state, so their reputation depends on history. The selected architectures remove this bistability and leave a single high-reputation state. Panels e to h show the consequence for evolution. The selected architectures reach similar cooperation from all-good and all-bad initial reputations, with a small residual difference under Stern Judging. Under one-step inertia, cooperation under Shunning and Stern Judging collapses when records start bad.",
  });
  edSlide({
    n: 3, title: "Depths and strengths jointly set reputation states", figH: 3.3, capH: 1.3, supports: "supports Fig. 2",
    caption: M`Highest stable good-reputation equilibrium of a DISC population. **a–d**, Across the strengths $\alpha$ and $\beta$ at one-step depths. **e–h**, Across the depths $k_1$ and $k_2$ with $\alpha=\beta=1$. Hatching marks bistability, and stars mark the selected architectures.`,
    message: M`Whether a high-reputation state exists, and whether it is bistable, depends jointly on the norm, the direction of inertia and the strengths of the intermediate states.`,
    src: M`Parameters: $e_1=e_2=0.02$.`,
    notes: "The upper row varies the two strengths at one-step depths, the lower row varies the two depths at full strength. Colour is the highest stable good-reputation equilibrium of a homogeneous DISC population, and hatching marks bistability. The planes show that depth, direction and strength interact, and that the pattern differs between norms. The stars mark the four selected architectures.",
  });
  edSlide({
    n: 4, title: "Rare discriminators no longer lose reputation abruptly", figH: 3.15, capH: 1.25, supports: "supports Fig. 3",
    caption: M`**a–d**, DISC reputation along the ALLD–DISC edge as its frequency varies. Solid and dashed curves are stable and unstable branches, and diamonds mark folds. **e–h**, Payoff advantage of DISC over ALLD on the branch reached from all-good records.`,
    message: M`Under one-step inertia, rare discriminators lose their reputation abruptly, and with it their advantage over ALLD. The selected architectures shift this threshold to lower frequencies or make it continuous.`,
    src: M`Parameters: $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$ for the inertial settings.`,
    notes: "This figure explains why the basins in Fig. 3 expand. On the edge between ALLD and DISC, the reputation of DISC depends on its own frequency. Under one-step inertia with Scoring, Shunning and Stern Judging, the high-reputation branch disappears at a fold when DISC becomes rare, and DISC loses its payoff advantage abruptly. The selected architecture moves this threshold to lower DISC frequencies under Shunning, and removes the fold under Scoring and Stern Judging, where the threshold becomes a continuous edge equilibrium. Under Simple Standing all thresholds are continuous.",
  });
  edSlide({
    n: 5, title: "The advantage holds across benefit-to-cost ratios", figH: 3.25, capH: 1.3, supports: "supports Fig. 3",
    caption: M`Mean cooperation $\bar\rho$ as $b/c$ varies, for no inertia (grey), one-step inertia (blue) and the selected architectures (orange). Solid segments mark local protection of pure DISC, $R_{\mathrm{L}}<b/c<R_{\mathrm{U}}$. The dotted line marks $b/c=5$.`,
    message: M`The selected architectures support more cooperation across most benefit-to-cost ratios. Under SS, cooperation stays high even where pure DISC is not locally protected.`,
    src: M`Means over eight samples of 512 initial compositions. Parameters: $e_1=e_2=0.02$, $\alpha=\beta=1$.`,
    notes: "Mean cooperation as a function of the benefit-to-cost ratio. The selected multi-step architectures support more cooperation than instantaneous updating and one-step inertia across most of the range. Solid segments mark where pure DISC is locally protected against both ALLC and ALLD. Under Simple Standing, high cooperation persists even where pure DISC is not protected, because the population settles in a cooperative mixture of DISC and ALLC.",
  });
  edSlide({
    n: 6, title: "Tolerance and strictness are not interchangeable", figH: 3.8, capH: 1.15, supports: "supports Fig. 3",
    caption: M`One-step depths. **a–d**, Strategy dynamics with tolerance only, $(\alpha,\beta)=(1,0)$, and strictness only, $(\alpha,\beta)=(0,1)$. **e–h**, Mean cooperation across the $(\alpha,\beta)$ plane. **i–l**, Local invasion classes of a pure-DISC resident.`,
    message: M`Tolerance alone makes pure DISC a stable, highly cooperative state under every norm. Strictness alone does not, and its effect depends on the norm.`,
    src: M`Parameters: $b/c=5$, $e_1=e_2=0.02$, $k_1=k_2=1$.`,
    notes: "At one-step depths we switch on only one of the two strengths. With tolerance only, alpha equal to one and beta equal to zero, pure DISC is a stable equilibrium with near-complete cooperation under all four norms. With strictness only, pure DISC is not stable. Under Scoring and Simple Standing a cooperative state remains on the DISC–ALLC edge, while Shunning and Stern Judging lose cooperation. The lower rows show mean cooperation and local invasion classes across the whole strength plane.",
  });
  edSlide({
    n: 7, title: "Directional inertia protects DISC across error rates", figH: 3.8, capH: 1.3, supports: "supports Fig. 3",
    caption: M`Local invasion classes of a pure-DISC resident across implementation error $e_1$ and assessment error $e_2$, without inertia (**a**), with one-step inertia (**b**) and with the selected architectures (**c**). Pink, ALLD invades. Purple, ALLC invades. Green, DISC resists both.`,
    message: M`Without inertia or with one-step inertia, ALLD invades almost everywhere under SH and SJ. The selected architectures exclude ALLD over most of the error plane.`,
    src: M`Local resistance only, not cooperation scans. Parameters: $b/c=5$, $\alpha=\beta=1$.`,
    notes: "These maps classify local resistance of a pure DISC population across the two error rates. Under Shunning and Stern Judging, ALLD invades almost everywhere without inertia or with one-step inertia. The selected architectures exclude ALLD over most of the error plane under these norms, and under Scoring and Shunning they make DISC resistant to both mutants over most of it. These maps concern local resistance only and are not cooperation scans.",
  });
  edSlide({
    n: 8, title: "High cooperation and local protection differ", wide: true, supports: "supports Fig. 4",
    caption: M`Mean cooperation $\bar\rho$ over the $(k_1,k_2)$ plane under SC, SH, SJ and SS. Dots mark depth pairs at which pure DISC resists rare ALLC and ALLD mutants.`,
    message: M`Cooperation follows the same norm-specific directions as in Fig. 4. The depths that protect pure DISC are not the same as those that give the most cooperation.`,
    src: M`Parameters: $b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$.`,
    notes: "This is the full depth plane behind Fig. 4. Scoring and Shunning show high cooperation for tolerance-dominated allocations, Stern Judging benefits from a combination of tolerance and strictness depths, and Simple Standing supports high cooperation whenever a warning path is present, with the highest values for strictness-weighted allocations. The dots show where pure DISC resists rare unconditional mutants. Local protection and high population-level cooperation are related but not identical.",
  });
  edSlide({
    n: 9, title: "Protective tolerance strengths exist for every norm", figH: 3.8, capH: 1.3, supports: "supports Fig. 5",
    caption: M`**a**, Secure intervals of $\alpha$ at $b/c=5$ for one-step and selected architectures, with resident cooperation in blue. **b–e**, Resident cooperation and security across $\alpha$ and $b/c$. Black curves delimit the secure region, and white circles mark $(\alpha,b/c)=(0.8,5)$.`,
    message: M`At $\alpha=0.8$ and $b/c=5$, all four selected architectures resist the O-DISC family while cooperation stays high. Secure ranges narrow at low $b/c$ and close under SH at $b/c=2$.`,
    src: M`Selected depths SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$. Parameters: $e_1=e_2=0.02$, $\beta=1$.`,
    notes: "This extends Fig. 5 to all four norms. Panel a shows, for each norm, the interval of tolerance strengths in which an established DISC population resists the whole O-DISC family at b over c equal to 5. At the reference point alpha equal to 0.8, the selected architectures maintain high resident cooperation and resist opportunists under all four norms, whereas one-step inertia under Shunning and Stern Judging has already lost its high-reputation state. Because the lower end of the interval is a fold that does not depend on b over c, while the upper end rises with b over c, the secure ranges shrink at low benefit-to-cost ratios and can vanish, as under Shunning at b over c equal to 2.",
  });

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
