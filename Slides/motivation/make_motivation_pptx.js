// Section 1 of the talk, "Motivation and research gap", as an editable PowerPoint deck.
// Version 4 (5 November 2026). Two candidate framings come first: A asks how reputations
// should change (asymmetry), B asks whether reputations can work without shared information.
// The shared argument is norm-neutral (misjudgements rather than punishment only).
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
pres.title = "Indirect reciprocity with inertial reputation updating: motivation and research gap";
pres.author = "Wenqiang Zhu";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, WHITE = C.background1, CARD = C.background2, ORANGE = C.accent1,
      GOOD = C.accent2, BAD = C.accent3, MUTED = C.accent5, ORANGE_TEXT = C.accent6;
const FS = { title: 24, cardTitle: 16, body: 14, small: 12, ref: 10.5, source: 10 };
const MX = 0.5, CW = 9.0;
const SEC = "Motivation and research gap";

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
    donor: await iconData(fa.FaHandHoldingHeart), observer: await iconData(fa.FaEye),
    help: await iconData(fa.FaHandsHelping), shield: await iconData(fa.FaShieldAlt), warn: await iconData(fa.FaExclamationTriangle),
    model: await iconData(fa.FaCogs), society: await iconData(fa.FaLandmark),
    hidden: await iconData(fa.FaEyeSlash), balance: await iconData(fa.FaBalanceScale), person: await iconData(fa.FaUserCheck),
    change: await iconData(fa.FaSyncAlt), network: await iconData(fa.FaProjectDiagram), design: await iconData(fa.FaTools),
  };

  // ================================================================ 1. Title
  pres.addSection({ title: "Title" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Title" });
  s.addText("Indirect reciprocity with inertial reputation updating", { placeholder: "title" });
  s.addText("Part 1 · Motivation and research gap", { placeholder: "subtitle" });
  s.addText("Wenqiang Zhu · Beihang University", { placeholder: "author" });
  {
    const y = 4.25, d = 0.42, xs = [0.75, 1.47, 2.19, 2.91];
    const fills = [{ color: GOOD }, { color: BAD, transparency: 70 }, { color: BAD, transparency: 45 }, { color: BAD }];
    const labels = ["G", [{ text: "W" }, sub("1")], [{ text: "W" }, sub("2")], "B"];
    fills.forEach((f, i) => {
      dot(s, "Motif state " + (i + 1), xs[i], y, d, f, null);
      s.addText(labels[i], { objectName: "Motif label " + (i + 1), isTextBox: true, x: xs[i], y, w: d, h: d, margin: 0,
        align: "center", valign: "middle", fontSize: 13, bold: true, color: WHITE });
      if (i < 3) arrow(s, "Motif arrow " + (i + 1), xs[i] + d + 0.05, y + d / 2, xs[i + 1] - 0.05, y + d / 2, BAD, { width: 1.5 });
    });
  }
  s.addNotes("This part first presents the two ways in which we could frame the paper, and then develops the argument they share. The small diagram is the idea in one line: a good reputation does not turn bad at once, but passes through warning states.");

  pres.addSection({ title: SEC });

  // ================================================================ 2. Two storylines
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Two ways to frame the work", { placeholder: "title" });
  {
    const head = (letter, name) => ({ text: [{ text: `${letter}  `, options: { bold: true, color: ORANGE } }, { text: name, options: { bold: true, color: WHITE } }],
      options: { fill: { color: INK }, fontSize: 13.5, valign: "middle" } });
    const label = (t, fill) => ({ text: t.toUpperCase(), options: { bold: true, color: ORANGE_TEXT, fontSize: 10.5, charSpacing: 1, valign: "top", fill } });
    const rowsText = [
      ["Opening",
       "Reputations are judgements that change as evidence accumulates. Theory has asked which actions are good, rarely how judgements should change.",
       "Cooperation by reputation needs agreement about who is good, which theory usually secures through institutions, gossip or synchronized opinions."],
      ["Problem",
       "Private, noisy observation causes misjudgements. Some norms wrongly condemn cooperators, others wrongly excuse defectors.",
       "Shared information is costly, slow or untrusted in many settings, especially in large or polarized populations."],
      ["Gap",
       "Models change reputations by one symmetric rule, whereas people and institutions revise judgements asymmetrically and gradually.",
       "Revising is the one lever every observer holds. Whether it alone can make private reputations accurate and shared is open."],
      ["Approach",
       "Asymmetric inertia. Losing and regaining standing can require different amounts of evidence, and incomplete evidence has graded consequences.",
       "Observers share nothing and see one interaction at a time. Each revises its own judgements with asymmetric inertia and graded consequences."],
      ["Message",
       "How reputations change, above all how asymmetrically, matters as much as which behaviours are judged good.",
       "Accurate, shared reputations can emerge from how individuals revise their own judgements, without any shared information."],
    ];
    const rows = [[{ text: "", options: { fill: { color: INK } } }, head("A", "How should reputations change?"), head("B", "Can reputations work without sharing information?")]];
    rowsText.forEach((r, i) => {
      const fill = { color: i % 2 ? WHITE : CARD };
      const strong = r[0] === "Message";
      rows.push([label(r[0], fill), { text: r[1], options: { fill, bold: strong } }, { text: r[2], options: { fill, bold: strong } }]);
    });
    s.addTable(rows, { objectName: "Storyline table", x: MX, y: 1.05, w: CW, colW: [0.96, 4.02, 4.02], rowH: [0.42, 0.62, 0.5, 0.62, 0.62, 0.62],
      fontSize: 12, color: INK, valign: "middle", margin: [0.03, 0.09, 0.03, 0.09], border: { type: "solid", pt: 0.5, color: "C4CED1" } });
  }
  s.addNotes("Before the argument, here are the two ways in which we could frame the paper. They pose different questions. Framing A asks how reputations should change. The field has mostly asked which actions should be judged good. Under private, noisy observation, judgements go wrong in two ways, wrongly condemning cooperators or wrongly excusing defectors, and models let reputations change by a single symmetric rule, whereas people and institutions revise asymmetrically and gradually. A's message is that how reputations change, and above all how asymmetrically, matters as much as the norm. Framing B asks whether reputations can work without shared information. Agreement about who is good is usually secured by institutions, gossip or synchronized opinions, which are costly, slow or untrusted in many settings. Revising one's own judgements is the one lever every observer holds, and B's message is that accurate, shared reputations can emerge from that lever alone. A speaks to the theory of indirect reciprocity, B to a broad readership interested in decentralized cooperation. B differs from Michel-Mata et al. because their observers draw on several fresh observations per judgement, whereas ours see one interaction at a time. Key references for B: Radzvilavicius et al. 2021, Kawakatsu et al. 2024, Murase and Hilbe 2024, Michel-Mata et al. 2024, Iyengar et al. 2019. We would like your view on which framing to adopt.");

  // ================================================================ 3. Accurate and shared
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Cooperation needs reputations that are accurate and shared", { placeholder: "title" });
  {
    const rows = [
      { icon: ic.donor, t: [{ text: "A donor ", options: {} }, { text: "helps or refuses", options: { bold: true } }] },
      { icon: ic.observer, badge: "1", t: [{ text: "An observer " }, { text: "judges", options: { bold: true, color: GOOD } }, { text: " the action against a social norm" }] },
      { icon: null, badge: "2", t: [{ text: "and " }, { text: "revises", options: { bold: true, color: ORANGE_TEXT } }, { text: " its view of the donor" }] },
      { icon: ic.help, t: [{ text: "Good standing " }, { text: "attracts help", options: { bold: true } }, { text: " from third parties" }] },
    ];
    rows.forEach((r, i) => {
      const y = 1.2 + i * 0.78;
      if (r.icon) iconCircle(s, `Loop row ${i + 1}`, r.icon, MX, y, 0.52);
      if (r.badge) dot(s, `Loop step ${r.badge}`, MX + 0.62, y + 0.08, 0.36, { color: r.badge === "1" ? GOOD : ORANGE }, r.badge, WHITE, 13);
      text(s, r.t, { objectName: `Loop row ${i + 1} text`, x: MX + 1.1, y, w: 3.75, h: 0.52, valign: "middle" });
      if (i === 0) arrow(s, "Loop arrow 1", MX + 0.26, y + 0.56, MX + 0.26, y + 0.76, MUTED, { width: 1.25 });
      if (i === 1) arrow(s, "Loop arrow 2", MX + 0.26, y + 0.56, MX + 0.26, y + 1.54, MUTED, { width: 1.25 });
    });
  }
  card(s, "Public information", 5.55, 1.15, 3.95, 1.3);
  text(s, [{ text: "Public information", options: { bold: true, color: GOOD, breakLine: true } },
           { text: "Leading-eight norms keep cooperation stable, even with occasional errors." }],
    { objectName: "Public text", x: 5.75, y: 1.15, w: 3.6, h: 1.3, valign: "middle" });
  card(s, "Private information", 5.55, 2.6, 3.95, 1.3, { fill: { color: BAD, transparency: 88 }, line: { color: BAD, width: 0, transparency: 100 } });
  text(s, [{ text: "Private information", options: { bold: true, color: BAD, breakLine: true } },
           { text: "Observers hold different views of the same person. Most leading-eight norms fail." }],
    { objectName: "Private text", x: 5.75, y: 2.6, w: 3.6, h: 1.3, valign: "middle" });
  card(s, "Requirement", MX, 4.25, CW, 0.62, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Reputations must be " }, { text: "accurate", options: { bold: true, color: ORANGE } }, { text: " (tell cooperators from defectors) and " },
           { text: "shared", options: { bold: true, color: ORANGE } }, { text: " (observers agree about who is who)." }],
    { objectName: "Requirement text", x: 0.75, y: 4.25, w: 8.5, h: 0.62, color: WHITE, valign: "middle" });
  sources(s, "Nowak & Sigmund 1998, 2005 · Ohtsuki & Iwasa 2004, 2006 · Takahashi & Mashima 2006 · Hilbe et al. 2018 · Fujimoto & Ohtsuki 2022, 2023");
  s.addNotes("Indirect reciprocity: those who help gain a good reputation, and a good reputation attracts help from third parties. Reputations are built in two steps. An observer judges each action against a social norm, and it revises its view of the actor in light of that judgement. Keep these two steps in mind, because the whole argument is organized around them. With public information, the leading-eight norms keep cooperation stable even with errors. With private, noisy information, observers hold different views of the same person, and most leading-eight norms fail. Reputations must therefore be both accurate and shared.");

  // ================================================================ 4. Misjudgements
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Private assessment produces misjudgements", { placeholder: "title" });
  {
    const steps = [
      [{ text: "An observer judges an action through " }, { text: "its own view", options: { bold: true } }, { text: " of the recipient." }],
      [{ text: "Observers who see the recipient differently, or who err, reach " }, { text: "different verdicts", options: { bold: true } }, { text: " on the same action." }],
      [{ text: "A verdict about one individual shapes verdicts about those who act towards it, so misjudgements " }, { text: "spread", options: { bold: true } }, { text: "." }],
    ];
    steps.forEach((tx, i) => {
      const x = MX + i * 3.1;
      card(s, `Mechanism step ${i + 1}`, x, 1.12, 2.8, 1.2, i === 2 ? { fill: { color: ORANGE, transparency: 85 }, line: { color: ORANGE, width: 0, transparency: 100 } } : {});
      text(s, tx, { objectName: `Mechanism step ${i + 1} text`, x: x + 0.18, y: 1.12, w: 2.44, h: 1.2, valign: "middle" });
      if (i < 2) arrow(s, `Mechanism arrow ${i + 1}`, x + 2.84, 1.72, x + 3.06, 1.72, INK);
    });
  }
  {
    const y = 2.6, h = 1.3;
    card(s, "Wrongful condemnation", MX, y, 4.35, h, { fill: { color: BAD, transparency: 88 }, line: { color: BAD, width: 0, transparency: 100 } });
    text(s, [{ text: "Wrongful condemnation", options: { bold: true, color: BAD, breakLine: true } },
             { text: "Cooperators lose standing they should keep, for example when refusing help to someone seen as bad is condemned." }],
      { objectName: "Wrongful condemnation text", x: MX + 0.22, y, w: 3.95, h, valign: "middle" });
    card(s, "Wrongful excuse", 5.15, y, 4.35, h, { fill: { color: GOOD, transparency: 88 }, line: { color: GOOD, width: 0, transparency: 100 } });
    text(s, [{ text: "Wrongful excuse", options: { bold: true, color: GOOD, breakLine: true } },
             { text: "Defectors keep or regain standing they should lose, for example when defection against someone seen as bad is approved." }],
      { objectName: "Wrongful excuse text", x: 5.37, y, w: 3.95, h, valign: "middle" });
  }
  text(s, "Which kind of misjudgement dominates depends on the norm.",
    { objectName: "Misjudgement note", x: MX, y: 4.12, w: CW, h: 0.45, italic: true, fontSize: 15, valign: "middle" });
  sources(s, "Takahashi & Mashima 2006 · Uchida 2010 · Hilbe et al. 2018 · Radzvilavicius et al. 2019 · Okada 2020 · Fujimoto & Ohtsuki 2023 · Michel-Mata et al. 2024");
  s.addNotes("Under private assessment, an observer judges each action through its own view of the recipient. Observers who see the recipient differently, or who simply err, reach different verdicts on the same action. And because a verdict about one individual shapes verdicts about those who act towards it, misjudgements spread through the population. They come in two kinds. Cooperators can be wrongly condemned, for example when a refusal to help someone seen as bad is condemned. The best-known instance is the punishment dilemma, in which a justified refusal looks unjustified to an observer who disagrees about the recipient. Defectors can be wrongly excused, for example when defection against someone seen as bad is approved and lets defectors regain standing. Which kind dominates depends on the norm. Under Scoring and Shunning, cooperators mainly accumulate unwarranted condemnations. Under Simple Standing, defectors regain standing too easily. Stern Judging is exposed to both. This norm dependence is why asymmetry will matter.");

  // ================================================================ 5. Two routes
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Two routes to robust reputations", { placeholder: "title" });
  text(s, [{ text: "Distortion  =  " }, { text: "how often", options: { bold: true, color: GOOD } }, { text: " misjudgements occur  ×  " },
           { text: "how much", options: { bold: true, color: ORANGE_TEXT } }, { text: " each one weighs" }],
    { objectName: "Product statement", x: MX, y: 1.0, w: CW, h: 0.4, fontSize: 16, align: "center", valign: "middle" });
  text(s, "This holds for both kinds, cooperators wrongly condemned and defectors wrongly excused.",
    { objectName: "Product note", x: MX, y: 1.4, w: CW, h: 0.26, fontSize: FS.small, color: MUTED, align: "center", valign: "middle" });
  {
    const y = 2.08, h = 0.72;
    const boxes = [
      { name: "Action", x: 0.6, w: 1.45, t: [{ text: "Action", options: { bold: true } }], fill: CARD },
      { name: "Step 1", x: 2.45, w: 2.3, t: [{ text: "Step 1 · judge", options: { bold: true, color: GOOD, breakLine: true } }, { text: "norm + view of recipient", options: { fontSize: FS.small } }], fill: GOOD },
      { name: "Step 2", x: 5.15, w: 2.3, t: [{ text: "Step 2 · revise", options: { bold: true, color: ORANGE_TEXT, breakLine: true } }, { text: "judgement → standing", options: { fontSize: FS.small } }], fill: ORANGE },
      { name: "Reputation", x: 7.85, w: 1.55, t: [{ text: "Reputation", options: { bold: true } }], fill: CARD },
    ];
    boxes.forEach((b, i) => {
      const tinted = b.fill !== CARD;
      card(s, `Pipeline ${b.name}`, b.x, y, b.w, h, tinted ? { fill: { color: b.fill, transparency: 85 }, line: { color: b.fill, width: 1 } } : {});
      text(s, b.t, { objectName: `Pipeline ${b.name} text`, x: b.x, y, w: b.w, h, align: "center", valign: "middle" });
      if (i < 3) arrow(s, `Pipeline arrow ${i + 1}`, b.x + b.w + 0.04, y + h / 2, boxes[i + 1].x - 0.04, y + h / 2, INK);
    });
    const fy = 1.9;
    line(s, "Feedback up", 8.62, y, 8.62, fy, MUTED, { width: 1.25, dashType: "dash" });
    line(s, "Feedback across", 8.62, fy, 3.6, fy, MUTED, { width: 1.25, dashType: "dash" });
    arrow(s, "Feedback down", 3.6, fy, 3.6, y - 0.02, MUTED, { width: 1.25, dashType: "dash" });
    text(s, "feedback: the actor is later a recipient", { objectName: "Feedback label", x: 4.6, y: fy - 0.22, w: 3.2, h: 0.2, fontSize: FS.ref, color: MUTED, align: "center" });
    const routes = [
      { x: 0.6, c: GOOD, head: "Route 1 · fewer misjudgements",
        body: "Align what observers know (institutions, gossip, opinion synchronization, empathy), or judge leniently", target: 3.6 },
      { x: 5.15, c: ORANGE, head: "Route 2 · less weight per misjudgement",
        body: "Pool evidence before revising (scores, records, aggregation), or give reputations asymmetric inertia (this work)", target: 6.3 },
    ];
    routes.forEach((r, i) => {
      card(s, `Route ${i + 1}`, r.x, 3.05, 4.25, 1.05, { fill: { color: WHITE }, line: { color: r.c, width: 1.5 } });
      text(s, [{ text: r.head, options: { bold: true, color: i === 0 ? GOOD : ORANGE_TEXT, breakLine: true } }, { text: r.body }],
        { objectName: `Route ${i + 1} text`, x: r.x + 0.18, y: 3.05, w: 3.9, h: 1.05, valign: "middle" });
      arrow(s, `Route ${i + 1} arrow`, r.target, 3.08, r.target, y + h + 0.04, r.c, { width: 1.5 });
    });
  }
  card(s, "Lever", MX, 4.22, CW, 0.72, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Revising is the one lever every observer holds.", options: { bold: true, color: ORANGE, fontSize: 16, breakLine: true } },
           { text: "It needs no shared information and no institution, which most of route 1 requires.", options: { color: WHITE, fontSize: 13.5 } }],
    { objectName: "Lever text", x: 0.75, y: 4.22, w: 8.5, h: 0.72, valign: "middle" });
  sources(s, "Route 1: Radzvilavicius et al. 2019, 2021 · Kawakatsu et al. 2024 · Murase & Hilbe 2024 · Tham et al. 2026 · Schmid et al. 2021. Route 2: Schmid et al. 2023 · Clark et al. 2020 · Michel-Mata et al. 2024");
  s.addNotes("The framework behind both framings. How far misjudgements distort reputations is the product of two factors: how often they occur, and how much each one weighs. This holds for both kinds, cooperators wrongly condemned and defectors wrongly excused. The first factor is set at step one, judging. Aligning what observers know, through institutions, gossip, opinion synchronization or empathy, reduces misjudgements at the source, and lenient judgement reduces condemnations in general. The second factor is set at step two, revising. Pooling evidence, through scores, records or aggregation, or giving reputations inertia, reduces the weight of each misjudgement. Asymmetric inertia can reduce the weight of one kind more than the other. The key point is the difference between the routes. Revising is the one lever every observer holds. It needs no shared information and no institution, which most of route one requires. In our model the product appears explicitly: the reputational cost of deliberately withholding help is the assessment contrast times the slope of the reputation map, Eq. 3.");

  // ================================================================ 6. Open problems
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Two open problems", { placeholder: "title" });
  [
    { x: MX, icon: ic.change, head: "How should judgements change?",
      body: "Theory asks which behaviours are good. How judgements should change as evidence accumulates, including whether losing and regaining standing should be equally easy, has received little attention.",
      note: "Models use one symmetric rule, whereas people and institutions revise asymmetrically and gradually." },
    { x: 5.15, icon: ic.network, head: "Can reputations work without shared information?",
      body: "Agreement is usually produced by sharing information. Whether individuals can reach accurate, shared reputations through how they revise their own judgements remains open.",
      note: "Shared information is costly, slow or untrusted in many settings." },
  ].forEach((c, i) => {
    card(s, `Problem ${i + 1}`, c.x, 1.12, 4.35, 2.85);
    iconCircle(s, `Problem ${i + 1}`, c.icon, c.x + 0.2, 1.27, 0.5);
    text(s, c.head, { objectName: `Problem ${i + 1} title`, x: c.x + 0.85, y: 1.22, w: 3.35, h: 0.6, bold: true, fontSize: FS.cardTitle, valign: "middle" });
    text(s, c.body, { objectName: `Problem ${i + 1} body`, x: c.x + 0.22, y: 1.92, w: 3.95, h: 1.3, fontSize: 13.5 });
    text(s, c.note, { objectName: `Problem ${i + 1} note`, x: c.x + 0.22, y: 3.3, w: 3.95, h: 0.55, fontSize: FS.small, color: MUTED, italic: true });
  });
  card(s, "What makes both hard", MX, 4.15, CW, 0.75, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "What makes both hard  ", options: { bold: true, color: ORANGE } },
           { text: "Any rule that forgives honest errors risks excusing deliberate defection.", options: { color: WHITE } }],
    { objectName: "What makes both hard text", x: 0.75, y: 4.15, w: 8.5, h: 0.75, valign: "middle", fontSize: 15 });
  sources(s, "Ohtsuki & Iwasa 2004 · Schmid et al. 2023 · Michel-Mata et al. 2024 · Ostrom 1990 · Blumstein & Nakamura 2009 · Siegel et al. 2018 · Kawakatsu et al. 2024 · Iyengar et al. 2019");
  s.addNotes("This leaves two open problems at a general level. The first is how judgements should change. The theory of indirect reciprocity has mostly asked which behaviours should be judged good. How judgements should change as evidence accumulates, including whether losing and regaining standing should be equally easy, has received little attention. Models use one symmetric rule, the latest assessment, a score or a fixed window of observations, whereas people and institutions revise asymmetrically and gradually. The second problem is whether reputations can work without shared information. Agreement is usually produced by sharing information, and whether individuals can reach accurate, shared reputations purely through how they revise their own judgements remains open. Both problems are hard for the same reason: any rule that forgives honest errors risks excusing deliberate defection.");

  // ================================================================ 7. Why they matter
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Why these problems matter", { placeholder: "title" });
  [
    { icon: ic.hidden, head: "A hidden assumption", hl: false,
      body: "Every model needs a revision rule. Conclusions about which norms sustain cooperation rest on one symmetric rule, so they may change with it." },
    { icon: ic.person, head: "The lever every observer holds", hl: true,
      body: "Revising needs no shared information and no institution, so it works where the usual remedies cannot." },
    { icon: ic.design, head: "Rules designed in practice", hl: false,
      body: "Communities, online platforms and artificial agents set such rules, through warnings, probation and ratings, with little guidance from theory." },
  ].forEach((c, i) => {
    const x = MX + i * 3.1;
    card(s, `Reason ${i + 1}`, x, 1.15, 2.8, 2.85, c.hl ? { fill: { color: WHITE }, line: { color: ORANGE, width: 2 } } : {});
    iconCircle(s, `Reason ${i + 1}`, c.icon, x + 0.2, 1.32, 0.55, c.hl ? ORANGE : INK);
    text(s, c.head, { objectName: `Reason ${i + 1} title`, x: x + 0.2, y: 1.98, w: 2.45, h: 0.6, bold: true, fontSize: FS.cardTitle, color: c.hl ? ORANGE_TEXT : INK, valign: "top" });
    text(s, c.body, { objectName: `Reason ${i + 1} body`, x: x + 0.2, y: 2.6, w: 2.45, h: 1.3, fontSize: 13.5 });
  });
  card(s, "Our work", MX, 4.18, CW, 0.7, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Our work  ", options: { bold: true, color: ORANGE } },
           { text: "A model in which losing and regaining standing can require different amounts of evidence, and incomplete evidence has graded consequences.", options: { color: WHITE } }],
    { objectName: "Our work text", x: 0.75, y: 4.18, w: 8.5, h: 0.7, valign: "middle", fontSize: 15 });
  sources(s, "Hilbe et al. 2018 · Kessinger et al. 2023 · Murase & Hilbe 2024 · Ostrom 1990 · Tadelis 2016 · Pires & Santos 2025");
  s.addNotes("Why do these problems matter? First, a hidden assumption. Every model of indirect reciprocity needs a rule for revising reputations, and the conclusions of the field about which norms sustain cooperation under private assessment were drawn with one symmetric rule. If the rule matters, those conclusions may change. Second, and most importantly, revising is the one lever every observer holds. It needs no shared information and no institution, which is exactly what the usual remedies require, so it works where they cannot. Third, these rules are designed in practice. Communities, online platforms and artificial agents set revision rules through warnings, probation and ratings, with little guidance from theory. Our work provides a model in which losing and regaining standing can require different amounts of evidence, and incomplete evidence has graded consequences.");

  // ================================================================ 8. Here, we
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Here, we give reputations asymmetric inertia", { placeholder: "title" });
  text(s, "A reputation changes only after a run of contrary assessments, and the run needed to lose standing can differ from the run needed to regain it. Observers share no information.",
    { objectName: "Lead", x: MX, y: 1.05, w: CW, h: 0.55, fontSize: 15 });
  {
    const d = 0.55, x0 = 2.95, p = 0.95;
    const rows = [
      { y: 1.8, label: "Losing standing", sub: "warning states", color: BAD,
        nodes: [["G", GOOD, 0], [[{ text: "W" }, sub("1")], BAD, 75], [[{ text: "W" }, sub("2")], BAD, 75], ["…"], [[{ text: "W" }, sub("k", { italic: true }), sub("1")], BAD, 75], ["B", BAD, 0]] },
      { y: 2.7, label: "Regaining standing", sub: "recovery states", color: GOOD,
        nodes: [["B", BAD, 0], [[{ text: "S" }, sub("1")], GOOD, 75], ["…"], [[{ text: "S" }, sub("k", { italic: true }), sub("2")], GOOD, 75], ["G", GOOD, 0]] },
    ];
    rows.forEach((r, ri) => {
      text(s, [{ text: r.label, options: { bold: true, breakLine: true } }, { text: r.sub, options: { fontSize: FS.small, color: MUTED } }],
        { objectName: `Path ${ri + 1} label`, x: MX, y: r.y - 0.02, w: 2.3, h: 0.6 });
      r.nodes.forEach((n, i) => {
        const x = x0 + i * p;
        if (n[0] === "…") {
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
    arrow(s, "Legend negative", 2.95, 3.53, 3.4, 3.53, BAD, { width: 1.75 });
    text(s, "negative assessment", { objectName: "Legend negative label", x: 3.5, y: 3.4, w: 1.9, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
    arrow(s, "Legend positive", 5.45, 3.53, 5.9, 3.53, GOOD, { width: 1.75 });
    text(s, "positive assessment", { objectName: "Legend positive label", x: 6.0, y: 3.4, w: 1.9, h: 0.26, fontSize: FS.small, color: MUTED, valign: "middle" });
  }
  const choices = [
    { x: MX, t: [{ text: "Depths " }, it("k"), sub("1"), { text: ", " }, it("k"), sub("2")], tagText: "asymmetry",
      b: "How much evidence it takes to lose and to regain standing" },
    { x: 5.15, t: [{ text: "Strengths " }, it("α"), { text: ", " }, it("β")], tagText: "partial consequences",
      b: "How strongly incomplete evidence already affects treatment" },
  ];
  choices.forEach((c, i) => {
    card(s, `Design choice ${i + 1}`, c.x, 3.85, 4.35, 1.0);
    text(s, c.t, { objectName: `Design choice ${i + 1} title`, x: c.x + 0.22, y: 3.95, w: 2.4, h: 0.32, fontSize: FS.cardTitle, bold: true });
    tag(s, `Design choice ${i + 1} tag`, c.tagText, c.x + 2.55, 3.97, 1.6);
    text(s, c.b, { objectName: `Design choice ${i + 1} body`, x: c.x + 0.22, y: 4.3, w: 3.95, h: 0.5 });
  });
  sources(s, "The model is defined in Section 2 (Fig. 1).");
  s.addNotes("Here, we give reputations asymmetric inertia. An established reputation changes only after a run of contrary assessments. Negative assessments move an individual in good standing through warning states before the reputation turns bad, and positive assessments move an individual in bad standing through recovery states before it turns good. The two paths can differ in length, so losing and regaining standing may require different amounts of evidence. That is the asymmetry. Each intermediate state can already carry partial consequences, set by the strengths. Observers share no information and update on one observation at a time, so any agreement among them must come from how they revise their judgements. In terms of the framework, this is route two, with two new features: asymmetry and graded consequences.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
