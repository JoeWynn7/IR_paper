// Section 4 of the talk, "Conclusion", as an editable PowerPoint deck.
// Answers the two open problems of Section 1 (Slides/IR_motivation_section.pptx),
// summarizes the main findings and closes with implications and points for discussion.
// Numbers come from the verified data (see Slides/results/README.md).
// Usage: NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
//        PPTX_SKILL=<pptx skill dir> node make_conclusion_pptx.js <output.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts", "apply_theme.js"));

const OUT = process.argv[2];

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
pres.title = "Indirect reciprocity with inertial reputation updating: conclusion";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const FS = { title: 24, cardTitle: 16, body: 14, small: 12, ref: 10.5, source: 10 };
const MX = 0.5, CW = 9.0;
const SEC = "Conclusion";

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
    { placeholder: { options: { name: "title", type: "title", x: 0.95, y: 1.55, w: 8.1, h: 1.9,
        fontSize: 28, bold: true, color: WHITE, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "note", type: "body", x: 0.95, y: 3.7, w: 8.1, h: 0.8,
        fontSize: 18, color: CARD, align: "left", valign: "top", margin: 0 }, text: "" } },
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
function line(slide, name, x1, y1, x2, y2, color, o = {}) {
  slide.addShape(pres.shapes.LINE, { objectName: name, x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1,
    line: Object.assign({ color, width: 2 }, o) });
}
function arrow(slide, name, x1, y1, x2, y2, color, o = {}) { line(slide, name, x1, y1, x2, y2, color, Object.assign({ endArrowType: "triangle" }, o)); }
function dot(slide, name, x, y, d, fill, label, labelColor = WHITE, pt = 13) {
  slide.addShape(pres.shapes.OVAL, { objectName: name, x, y, w: d, h: d, fill: { color: fill.color, transparency: fill.transparency || 0 },
    line: { color: fill.color, width: 0 } });
  if (label) slide.addText(label, { objectName: name + " label", isTextBox: true, x, y, w: d, h: d, margin: 0,
    align: "center", valign: "middle", fontSize: pt, bold: true, color: labelColor });
}
function tag(slide, name, label, x, y, w, color = ORANGE, textColor = ORANGE_TEXT) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h: 0.28, rectRadius: 0.06,
    fill: { color, transparency: 80 }, line: { color, width: 0, transparency: 100 } });
  text(slide, label, { objectName: name + " text", x, y, w, h: 0.28, fontSize: 11, bold: true, color: textColor, align: "center", valign: "middle" });
}
function sources(slide, s) {
  s = s.split(" · ").map((c) => c.replace(/ /g, " ")).join(" · ");
  text(slide, s, { objectName: "Sources", x: MX, y: 5.02, w: 8.3, h: 0.4, fontSize: FS.source, color: MUTED });
}
const sub = (t, o = {}) => ({ text: t, options: Object.assign({ subscript: true }, o) });
const it = (t, o = {}) => ({ text: t, options: Object.assign({ italic: true }, o) });

(async () => {
  const ic = {
    change: await iconData(fa.FaSyncAlt), network: await iconData(fa.FaProjectDiagram),
    norms: await iconData(fa.FaBalanceScale), design: await iconData(fa.FaTools), lab: await iconData(fa.FaFlask),
    limits: await iconData(fa.FaExclamationCircle),
  };

  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 4 · Conclusion", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  { // motif: an asymmetric cycle, two warning states on the way down, one recovery state on the way up
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19, 2.91, 3.63, 4.35];
    const nodes = [["G", { color: GOOD }], [[{ text: "W" }, sub("1")], { color: BAD, transparency: 65 }], [[{ text: "W" }, sub("2")], { color: BAD, transparency: 40 }],
                   ["B", { color: BAD }], [[{ text: "S" }, sub("1")], { color: GOOD, transparency: 55 }], ["G", { color: GOOD }]];
    nodes.forEach((n, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, n[1], null);
      s.addText(n[0], { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE });
      if (i < 5) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, i < 3 ? BAD : GOOD, { width: 1.5 });
    });
  }
  s.addNotes("To conclude, we return to the two open problems from the beginning and summarize what the model tells us. The small diagram shows an asymmetric record: losing standing takes longer than regaining it, as for Scoring and Shunning.");

  pres.addSection({ title: SEC });

  // ================================================================ 2. Back to the open problems
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Back to the two open problems", { placeholder: "title" });
  [
    { x: MX, icon: ic.change, label: "Open problem 1", q: "How should judgements change?",
      a: "Asymmetrically, and differently for each norm. Asymmetry, not the amount of inertia, decides whether private reputations are accurate and shared.", figs: "Figs. 2 and 4" },
    { x: 5.15, icon: ic.network, label: "Open problem 2", q: "Can reputations work without shared information?",
      a: "Yes. With the right asymmetry, observers who share nothing still agree and tell cooperators from defectors, and cooperation becomes stable and easy to reach.", figs: "Figs. 2 and 3" },
  ].forEach((c, i) => {
    card(s, `Problem ${i + 1}`, c.x, 1.12, 4.35, 1.05);
    iconCircle(s, `Problem ${i + 1}`, c.icon, c.x + 0.2, 1.36, 0.55);
    text(s, [{ text: c.label.toUpperCase(), options: { fontSize: 10.5, bold: true, color: ORANGE_TEXT, charSpacing: 1, breakLine: true } },
             { text: c.q, options: { bold: true, fontSize: FS.cardTitle } }],
      { objectName: `Problem ${i + 1} question`, x: c.x + 0.92, y: 1.12, w: 3.3, h: 1.05, valign: "middle" });
    arrow(s, `Problem ${i + 1} arrow`, c.x + 2.175, 2.22, c.x + 2.175, 2.47, MUTED, { width: 1.5 });
    card(s, `Answer ${i + 1}`, c.x, 2.52, 4.35, 1.45, { fill: { color: WHITE }, line: { color: ORANGE, width: 1.5 } });
    text(s, [{ text: "Answer  ", options: { bold: true, color: ORANGE_TEXT } }, { text: c.a }],
      { objectName: `Answer ${i + 1} text`, x: c.x + 0.2, y: 2.52, w: 3.95, h: 1.15, valign: "middle" });
    text(s, c.figs, { objectName: `Answer ${i + 1} figures`, x: c.x + 0.2, y: 3.62, w: 3.95, h: 0.28, fontSize: FS.ref, color: MUTED });
  });
  card(s, "What made both hard", MX, 4.15, CW, 0.75, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "What made both hard  ", options: { bold: true, color: ORANGE } },
           { text: "Forgiving honest errors does excuse occasional defection, but partial consequences restore deterrence while cooperation stays high (Fig. 5).", options: { color: WHITE } }],
    { objectName: "What made both hard text", x: 0.75, y: 4.15, w: 8.5, h: 0.75, valign: "middle", fontSize: 14 });
  s.addNotes("We started with two open problems. The first was how judgements should change. The answer is asymmetrically, and differently for each norm. Asymmetry, not the total amount of inertia, decides whether private reputations are accurate and shared. The second was whether reputations can work without shared information. The answer is yes. With the right asymmetry, observers who share nothing still agree with one another and tell cooperators from defectors, and cooperation becomes stable and easy to reach. What made both problems hard was the risk that forgiving honest errors also excuses deliberate defection. That risk is real, but letting warning states carry partial consequences restores deterrence while cooperation stays high.");

  // ================================================================ 3. Four findings
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Four findings", { placeholder: "title" });
  [
    { fig: "Fig. 2", stat: "4 of 4 norms", body: "Compact asymmetric architectures make private reputations accurate and shared. One-step symmetric inertia does not." },
    { fig: "Fig. 3", stat: "8% → 71%", body: "The cooperative basin under Shunning (23% → 71% under Stern Judging). Cooperation becomes stable and easy to reach." },
    { fig: "Fig. 4", stat: [{ text: "0 vs 0.87" }], body: "Mean cooperation under Scoring at the same depth with opposite asymmetries, (0, 2) versus (2, 0). Allocation beats amount." },
    { fig: "Fig. 5", stat: [it("α"), { text: " ∈ (0.57, 0.80]" }], body: "Full tolerance lets occasional defectors invade. Partial consequences in this range of the tolerance strength restore deterrence (Stern Judging)." },
  ].forEach((f, i) => {
    const x = MX + (i % 2) * 4.65, y = 1.12 + Math.floor(i / 2) * 1.9;
    card(s, `Finding ${i + 1}`, x, y, 4.35, 1.75);
    tag(s, `Finding ${i + 1} figure`, f.fig, x + 0.2, y + 0.18, 0.8);
    text(s, f.stat, { objectName: `Finding ${i + 1} stat`, x: x + 1.15, y: y + 0.08, w: 3.0, h: 0.5, fontSize: 24, bold: true, color: ORANGE_TEXT, valign: "middle" });
    text(s, f.body, { objectName: `Finding ${i + 1} text`, x: x + 0.2, y: y + 0.66, w: 3.95, h: 1.0, fontSize: 13.5 });
  });
  text(s, [{ text: "Verified data. " }, it("b"), { text: "/" }, it("c"), { text: " = 5, " }, it("e"), sub("1"), { text: " = " }, it("e"), sub("2"),
           { text: " = 0.02, " }, it("α"), { text: " = " }, it("β"), { text: " = 1 unless stated. Basin: share of 512 initial compositions reaching cooperation." }],
    { objectName: "Sources", x: MX, y: 5.02, w: 8.3, h: 0.4, fontSize: FS.source, color: MUTED });
  s.addNotes("The four findings behind these answers. First, compact asymmetric architectures, selected only by recognition and agreement, make private reputations accurate and shared under all four norms, whereas one-step symmetric inertia does not. Second, the same architectures make cooperation stable and easy to reach: the cooperative basin grows from 8 to 71 percent under Shunning and from 23 to 71 percent under Stern Judging. Third, allocation beats amount. Under Scoring with two intermediate states, putting both on the recovery path gives no cooperation, while putting both on the warning path gives a mean cooperation of 0.87. Fourth, full tolerance lets occasional defectors invade, under Stern Judging every O-DISC mutant with delta below 0.365, and a tolerance strength between about 0.57 and 0.80 restores deterrence while residents stay cooperative.");

  // ================================================================ 4. Costly but not catastrophic
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("A design principle: costly but not catastrophic", { placeholder: "title" });
  [
    { head: "Overwrite", sub: "standard updating", after: 0, verdict: "Catastrophic", vColor: BAD, cons: "Errors and disagreement cascade." },
    { head: "Full tolerance", sub: [{ text: "inertia, " }, it("α"), { text: " = 1" }], after: 1, verdict: "Costless", vColor: MUTED, cons: "Occasional defectors invade." },
    { head: "Partial consequences", sub: [{ text: "inertia, " }, it("α"), { text: " = 0.8" }], after: 0.8, verdict: "Costly, not catastrophic", vColor: ORANGE, cons: "Errors are absorbed, defection still costs.", hl: true },
  ].forEach((c, i) => {
    const x = MX + i * 3.1;
    card(s, `Rule ${i + 1}`, x, 1.12, 2.8, 3.02, c.hl ? { fill: { color: WHITE }, line: { color: ORANGE, width: 2 } } : {});
    text(s, [{ text: c.head, options: { bold: true, fontSize: FS.cardTitle, breakLine: true } },
             ...(Array.isArray(c.sub) ? c.sub.map((r) => ({ text: r.text, options: Object.assign({ fontSize: FS.small, color: MUTED }, r.options || {}) })) : [{ text: c.sub, options: { fontSize: FS.small, color: MUTED } }])],
      { objectName: `Rule ${i + 1} head`, x: x + 0.2, y: 1.2, w: 2.45, h: 0.6, valign: "middle" });
    // meter: probability of being seen as good before and after one negative assessment
    const base = 2.95, H = 0.95, bw = 0.42;
    line(s, `Rule ${i + 1} baseline`, x + 0.45, base, x + 2.35, base, MUTED, { width: 1 });
    s.addShape(pres.shapes.RECTANGLE, { objectName: `Rule ${i + 1} before`, x: x + 0.7, y: base - H, w: bw, h: H, fill: { color: GOOD }, line: { color: GOOD, width: 0 } });
    if (c.after > 0) s.addShape(pres.shapes.RECTANGLE, { objectName: `Rule ${i + 1} after`, x: x + 1.68, y: base - H * c.after, w: bw, h: H * c.after,
      fill: { color: GOOD, transparency: c.after < 1 ? 35 : 0 }, line: { color: GOOD, width: 0 } });
    text(s, String(c.after), { objectName: `Rule ${i + 1} value`, x: x + 1.55, y: base - H * c.after - 0.27, w: 0.68, h: 0.24, fontSize: FS.small, bold: true, align: "center" });
    text(s, "before", { objectName: `Rule ${i + 1} before label`, x: x + 0.55, y: base + 0.04, w: 0.72, h: 0.22, fontSize: 10.5, color: MUTED, align: "center" });
    text(s, "after", { objectName: `Rule ${i + 1} after label`, x: x + 1.53, y: base + 0.04, w: 0.72, h: 0.22, fontSize: 10.5, color: MUTED, align: "center" });
    tag(s, `Rule ${i + 1} verdict`, c.verdict, x + 0.2, 3.36, 2.4, c.vColor, c.vColor === MUTED ? INK : (c.vColor === BAD ? BAD : ORANGE_TEXT));
    text(s, c.cons, { objectName: `Rule ${i + 1} consequence`, x: x + 0.2, y: 3.68, w: 2.45, h: 0.42, fontSize: 13 });
  });
  text(s, "Bars: probability of being seen as good before and after one negative assessment, starting from good standing.",
    { objectName: "Meter caption", x: MX, y: 4.2, w: CW, h: 0.24, fontSize: FS.ref, color: MUTED });
  text(s, [{ text: "Depth", options: { bold: true, color: ORANGE_TEXT } }, { text: " decides whether one assessment can overturn a reputation. " },
           { text: "Strength", options: { bold: true, color: ORANGE_TEXT } }, { text: " decides its cost." }],
    { objectName: "Principle", x: MX, y: 4.5, w: CW, h: 0.4, fontSize: 15, valign: "middle" });
  s.addNotes("The results suggest a simple design principle for any reputation system. Look at what a single negative assessment does to someone in good standing. Under overwrite updating it is catastrophic: the reputation turns bad at once, so errors and disagreement cascade. Under full tolerance it costs nothing: the record moves to a warning state that is still read as good, so occasional defectors invade. With partial consequences it is costly but not catastrophic: with a tolerance strength of 0.8, the first warning state is read as good with probability 0.8, so the individual pays a price without losing its standing. Depth decides whether one assessment can overturn a reputation, and strength decides what it costs at the margin. In terms of the two routes from the beginning, this is how to design route two well.");

  // ================================================================ 5. Take-home message
  s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: SEC });
  s.addText("Take-home message", { placeholder: "kicker" });
  s.addText("How individuals revise their judgements, and how asymmetrically, can make reputations accurate and shared without any shared information.", { placeholder: "title" });
  s.addText("A single negative assessment should be costly but not catastrophic.", { placeholder: "note" });
  s.addNotes("If there is one message to take home: how individuals revise their judgements, and how asymmetrically, can make reputations accurate and shared without any shared information. And the rule for designing such revision is that a single negative assessment should be costly but not catastrophic.");

  // ================================================================ 6. Implications and limitations
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Implications and limitations", { placeholder: "title" });
  {
    const cols = [
      { x: MX, head: "Implications", color: GOOD, items: [
        { icon: ic.norms, t: [{ text: "Revisit norm comparisons. ", options: { bold: true } }, { text: "Shunning and Stern Judging fail under overwrite updating but sustain cooperation with suitable asymmetric inertia." }] },
        { icon: ic.design, t: [{ text: "Design rules, not only norms. ", options: { bold: true } }, { text: "Separate rules for losing and regaining standing, with graded consequences." }] },
        { icon: ic.lab, t: [{ text: "Testable predictions. ", options: { bold: true } }, { text: "A single lapse should lower trust without making a good reputation bad, and how fast impressions change in each direction should depend on the norm." }] },
      ] },
      { x: 5.15, head: "Limitations and next steps", color: BAD, items: [
        { icon: ic.limits, t: [{ text: "Mean-field closure ", options: { bold: true } }, { text: "and separated timescales. Simulations with co-evolving strategies and records would test them." }] },
        { icon: ic.limits, t: [{ text: "Fixed architectures, free memory. ", options: { bold: true } }, { text: "Let depths and strengths evolve, with a cost of memory." }] },
        { icon: ic.limits, t: [{ text: "One family of opportunists. ", options: { bold: true } }, { text: "Test defectors who time or correlate their omissions." }] },
      ] },
    ];
    cols.forEach((c, ci) => {
      card(s, c.head, c.x, 1.12, 4.35, 3.75);
      text(s, c.head, { objectName: `${c.head} title`, x: c.x + 0.22, y: 1.22, w: 3.9, h: 0.38, bold: true, fontSize: FS.cardTitle, color: c.color, valign: "middle" });
      c.items.forEach((itm, k) => {
        const y = 1.72 + k * 1.03;
        iconCircle(s, `${c.head} ${k + 1}`, itm.icon, c.x + 0.22, y + 0.05, 0.42, c.color);
        text(s, itm.t, { objectName: `${c.head} item ${k + 1}`, x: c.x + 0.8, y, w: 3.4, h: 0.98, fontSize: 13 });
      });
    });
  }
  s.addNotes("Three implications. First, comparisons of norms under private assessment should be revisited, because Shunning and Stern Judging fail under overwrite updating but sustain cooperation once paired with a suitable asymmetric architecture. Second, reputation systems should be designed at the level of revision rules, not only norms: separate rules for losing and regaining standing, with graded consequences. Third, the model makes testable predictions for experiments on impression formation. A single lapse should lower trust without making a good reputation bad, and how fast impressions change in each direction should depend on the norm. The main limitations: the population-level theory uses a mean-field closure and separated timescales, all individuals share a fixed architecture and memory is free, and we tested one family of occasional, independent opportunists.");

  // ================================================================ 7. Points for discussion
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Points for discussion", { placeholder: "title" });
  [
    { h: "Framing and journal", t: "Framing A (how reputations should change) or B (reputations without sharing information), and which journal to target." },
    { h: "Misjudgement framing", t: "Does the norm-neutral framing, with wrongful condemnation and wrongful excuse, convince across all four norms?" },
    { h: "Figures", t: "Redraw Fig. 3a with the Scoring line of equilibria as a single line, and Fig. 4 from the verified data." },
    { h: "Extensions", t: "Which would strengthen the paper most: evolving architectures, strategic opportunists, or an experiment on asymmetric updating?" },
  ].forEach((p, i) => {
    const x = MX + (i % 2) * 4.65, y = 1.12 + Math.floor(i / 2) * 1.9;
    card(s, `Discussion ${i + 1}`, x, y, 4.35, 1.75);
    dot(s, `Discussion ${i + 1} number`, x + 0.22, y + 0.22, 0.48, { color: ORANGE }, String(i + 1), WHITE, 16);
    text(s, p.h, { objectName: `Discussion ${i + 1} title`, x: x + 0.9, y: y + 0.2, w: 3.25, h: 0.5, bold: true, fontSize: FS.cardTitle, valign: "middle" });
    text(s, p.t, { objectName: `Discussion ${i + 1} text`, x: x + 0.9, y: y + 0.72, w: 3.25, h: 0.95, fontSize: 13 });
  });
  s.addNotes("Four points we would like your view on. First, the framing and the target journal: framing A, how reputations should change, or framing B, reputations without sharing information. Second, whether the norm-neutral framing in terms of wrongful condemnation and wrongful excuse convinces across all four norms. Third, two figures still need work: Fig. 3a should show the Scoring line of equilibria as a single line, and Fig. 4 should be redrawn from the verified data. Fourth, which extension would strengthen the paper most: letting architectures evolve, testing strategic opportunists, or an experiment on asymmetric updating.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
