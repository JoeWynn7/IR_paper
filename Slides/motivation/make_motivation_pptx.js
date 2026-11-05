// Section 1 of the talk, "Motivation and research gap", as an editable PowerPoint deck.
// Version 3 (5 November 2026): follows Manuscript_doc/intro_revisions/final/.
// The two candidate storylines are presented first (A = Storyline 1, B = Storyline 3),
// followed by the shared argument and the approach.
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
      options: { fill: { color: INK }, fontSize: 15, valign: "middle" } });
    const label = (t) => ({ text: t.toUpperCase(), options: { bold: true, color: ORANGE_TEXT, fontSize: 10.5, charSpacing: 1, valign: "top" } });
    const rowsText = [
      ["Opening",
       "Reputations form in two steps. An observer judges an action, then revises its view of the actor.",
       "From villages to online markets, people help those in good standing, but each person forms a private view."],
      ["Problem",
       "Under private assessment, justified punishment is condemned by observers who disagree, so punishing puts one's own standing at risk.",
       "Punishers are condemned by observers who disagree. The harm depends on what observers know and on how they revise what they believe."],
      ["Gap",
       "Remedies mostly improve judging. Revising is modelled as one symmetric rule, unlike human impressions and institutional practice.",
       "Remedies improve what observers know. How a verdict should be revised, between condemning cooperators and excusing defectors, is open."],
      ["Approach",
       "Reputations with inertia that can differ between losing and regaining standing, and graded consequences while evidence accumulates.",
       "Judgements with inertia, partial consequences for those under suspicion or on probation, and no shared information."],
      ["Message",
       "How a society revises its judgements in each direction matters as much as which behaviours it judges good.",
       "Cooperation depends not only on what individuals know about each other, but also on how they revise what they believe."],
    ];
    const rows = [[{ text: "", options: { fill: { color: INK } } }, head("A", "How reputations change"), head("B", "From information to judgement")]];
    rowsText.forEach((r, i) => {
      const fill = { color: i % 2 ? WHITE : CARD };
      const strong = r[0] === "Message";
      rows.push([Object.assign(label(r[0]), { options: Object.assign(label(r[0]).options, { fill }) }),
                 { text: r[1], options: { fill, bold: strong } }, { text: r[2], options: { fill, bold: strong } }]);
    });
    s.addTable(rows, { objectName: "Storyline table", x: MX, y: 1.05, w: CW, colW: [0.96, 4.02, 4.02], rowH: [0.4, 0.46, 0.62, 0.62, 0.62, 0.62],
      fontSize: 12, color: INK, valign: "middle", margin: [0.03, 0.09, 0.03, 0.09], border: { type: "solid", pt: 0.5, color: "C4CED1" } });
  }
  s.addNotes("Before the argument itself, here are the two ways in which we could frame the paper. Both rest on the same argument, which the next slides develop. Storyline A stays close to the field. Reputations form in two steps, judging and revising. Remedies for the punishment dilemma have mostly improved judging, while revising has been modelled as one symmetric rule. Its message is that how a society revises its judgements in each direction matters as much as which behaviours it judges good. Storyline B is written for a broad readership. It contrasts what observers know with how they revise what they believe, and it treats revision as a balance between condemning cooperators and excusing defectors. Its message is that cooperation depends not only on what individuals know about each other, but also on how they revise what they believe. We would like your view on which framing to adopt.");

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

  // ================================================================ 4. Punishment dilemma
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("The punishment dilemma", { placeholder: "title" });
  {
    const steps = [
      [{ text: "D refuses to help X, whom D regards as bad. Stable norms call this " }, { text: "justified punishment", options: { bold: true } }, { text: "." }],
      [{ text: "Observer O still regards X as good, sees an " }, { text: "unjustified", options: { bold: true } }, { text: " refusal and condemns D." }],
      [{ text: "Disagreement about X becomes disagreement about D, and " }, { text: "spreads", options: { bold: true } }, { text: "." }],
    ];
    steps.forEach((t, i) => {
      const x = MX + i * 3.1;
      card(s, `Cascade step ${i + 1}`, x, 1.15, 2.8, 1.25, i === 2 ? { fill: { color: BAD, transparency: 85 }, line: { color: BAD, width: 0, transparency: 100 } } : {});
      text(s, t, { objectName: `Cascade step ${i + 1} text`, x: x + 0.18, y: 1.15, w: 2.44, h: 1.25, valign: "middle" });
      if (i < 2) arrow(s, `Cascade arrow ${i + 1}`, x + 2.84, 1.775, x + 3.06, 1.775, INK);
    });
  }
  {
    const y = 2.7, h = 1.15;
    card(s, "Dilemma protects", MX, y, 4.35, h, { fill: { color: GOOD, transparency: 88 }, line: { color: GOOD, width: 0, transparency: 100 } });
    iconCircle(s, "Dilemma protects", ic.shield, MX + 0.2, y + 0.3, 0.55, GOOD);
    text(s, [{ text: "Punishing defectors", options: { bold: true, breakLine: true } }, { text: "protects cooperation from exploitation" }],
      { objectName: "Dilemma protects text", x: MX + 0.9, y, w: 3.3, h, valign: "middle" });
    card(s, "Dilemma risks", 5.15, y, 4.35, h, { fill: { color: BAD, transparency: 88 }, line: { color: BAD, width: 0, transparency: 100 } });
    iconCircle(s, "Dilemma risks", ic.warn, 5.35, y + 0.3, 0.55, BAD);
    text(s, [{ text: "but risks the punisher's own standing", options: { bold: true, breakLine: true } }, { text: "with every observer who disagrees" }],
      { objectName: "Dilemma risks text", x: 6.05, y, w: 3.3, h, valign: "middle" });
  }
  text(s, "A remedy must protect justified punishers without letting genuine defectors escape.",
    { objectName: "Dilemma requirement", x: MX, y: 4.1, w: CW, h: 0.45, italic: true, color: INK, fontSize: 15, valign: "middle" });
  sources(s, "Okada 2020 · Hilbe et al. 2018 · Uchida & Sasaki 2013 · Radzvilavicius et al. 2019 · Michel-Mata et al. 2024 · Pires & Santos 2025");
  s.addNotes("The difficulty is sharpest for the norms that work best under public information. They let a discriminator refuse help to someone in bad standing without losing its own standing, because the refusal counts as justified punishment. But this only works if the observer agrees about the recipient. An observer who still regards the recipient as good sees an unjustified refusal and condemns the discriminator. Disagreement about one individual becomes disagreement about those who act towards it, and it spreads. This is the punishment dilemma, a term from Okada 2020 that Michel-Mata et al. and Pires and Santos also use. Punishing defectors protects cooperation, yet it risks the punisher's own reputation.");

  // ================================================================ 5. Two routes
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Two routes out of the dilemma", { placeholder: "title" });
  text(s, [{ text: "Loss of standing  =  " }, { text: "how often", options: { bold: true, color: GOOD } }, { text: " one is condemned  ×  " },
           { text: "how much", options: { bold: true, color: ORANGE_TEXT } }, { text: " each condemnation weighs" }],
    { objectName: "Product statement", x: MX, y: 1.0, w: CW, h: 0.4, fontSize: 16, align: "center", valign: "middle" });
  text(s, "Justified punishers are condemned wrongly, through disagreement or error. Defectors are condemned rightly.",
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
      { x: 0.6, c: GOOD, head: "Route 1 · fewer wrongful condemnations",
        body: "Align what observers know (institutions, gossip, opinion synchronization, empathy), or judge leniently", target: 3.6 },
      { x: 5.15, c: ORANGE, head: "Route 2 · less impact per condemnation",
        body: "Pool evidence before revising (scores, records, aggregation), or give reputations inertia (this work)", target: 6.3 },
    ];
    routes.forEach((r, i) => {
      card(s, `Route ${i + 1}`, r.x, 3.08, 4.25, 1.1, { fill: { color: WHITE }, line: { color: r.c, width: 1.5 } });
      text(s, [{ text: r.head, options: { bold: true, color: i === 0 ? GOOD : ORANGE_TEXT, breakLine: true } }, { text: r.body }],
        { objectName: `Route ${i + 1} text`, x: r.x + 0.18, y: 3.08, w: 3.9, h: 1.1, valign: "middle" });
      arrow(s, `Route ${i + 1} arrow`, r.target, 3.08, r.target, y + h + 0.04, r.c, { width: 1.5 });
    });
  }
  card(s, "Route contrast", MX, 4.33, CW, 0.56, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Route 1 relies mostly on shared information. ", options: { color: WHITE } }, { text: "Route 2 is open to every observer on its own.", options: { bold: true, color: ORANGE } }],
    { objectName: "Route contrast text", x: 0.75, y: 4.33, w: 8.5, h: 0.56, valign: "middle", fontSize: 15 });
  sources(s, "Route 1: Radzvilavicius et al. 2019, 2021 · Kawakatsu et al. 2024 · Murase & Hilbe 2024 · Tham et al. 2026 · Schmid et al. 2021. Route 2: Schmid et al. 2023 · Clark et al. 2020 · Michel-Mata et al. 2024");
  s.addNotes("The framework behind both storylines. How much reputation an individual loses is the product of two factors: how often it is condemned, and how much each condemnation moves its reputation. This holds for every condemnation. Justified punishers are condemned wrongly, either because the observer disagrees about the recipient, which is the punishment dilemma, or because of plain errors. Defectors are condemned rightly. The first factor is set at step one, judging. Aligning what observers know, through institutions, gossip, opinion synchronization or empathy, reduces wrongful condemnations, and lenient judgement reduces condemnations in general. The second factor is set at step two, revising. Pooling evidence, through scores, records or aggregation, or giving reputations inertia, reduces the impact of each condemnation. Route one relies mostly on shared information. Route two is open to every observer on its own. In our model the same product appears explicitly: the reputational cost of deliberately withholding help is the assessment contrast times the slope of the reputation map, Eq. 3. We come back to what this means for defectors in the results.");

  // ================================================================ 6. Open problem
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Open problem: how should judgements be revised?", { placeholder: "title" });
  {
    // models
    card(s, "Models card", MX, 1.15, 4.35, 2.75);
    iconCircle(s, "Models", ic.model, MX + 0.2, 1.3, 0.5);
    text(s, "Models", { objectName: "Models title", x: MX + 0.85, y: 1.3, w: 3.3, h: 0.5, bold: true, fontSize: FS.cardTitle, valign: "middle" });
    text(s, "Revision follows one symmetric rule: the latest assessment, a score or a fixed window of observations.",
      { objectName: "Models text", x: MX + 0.25, y: 1.95, w: 3.9, h: 0.9 });
    dot(s, "Models G", MX + 0.9, 3.05, 0.5, { color: GOOD }, "G", WHITE, 14);
    dot(s, "Models B", MX + 2.75, 3.05, 0.5, { color: BAD }, "B", WHITE, 14);
    arrow(s, "Models loss", MX + 1.46, 3.2, MX + 2.69, 3.2, INK, { width: 1.5 });
    arrow(s, "Models recovery", MX + 2.69, 3.43, MX + 1.46, 3.43, INK, { width: 1.5 });
    text(s, "same rule", { objectName: "Models same rule", x: MX + 3.3, y: 3.15, w: 1.0, h: 0.3, fontSize: FS.small, color: MUTED, valign: "middle" });
    // societies
    card(s, "Societies card", 5.15, 1.15, 4.35, 2.75);
    iconCircle(s, "Societies", ic.society, 5.35, 1.3, 0.5);
    text(s, "Societies", { objectName: "Societies title", x: 6.0, y: 1.3, w: 3.3, h: 0.5, bold: true, fontSize: FS.cardTitle, valign: "middle" });
    const items = [
      [{ text: "Sanctions escalate only with " }, { text: "repeated", options: { bold: true } }, { text: " violations" }],
      [{ text: "Standing returns only after " }, { text: "years", options: { bold: true } }, { text: " of good conduct" }],
      [{ text: "Impressions are revised " }, { text: "asymmetrically", options: { bold: true } }],
    ];
    items.forEach((t, i) => {
      s.addShape(pres.shapes.RECTANGLE, { objectName: `Societies marker ${i + 1}`, x: 5.42, y: 2.06 + i * 0.58, w: 0.1, h: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
      text(s, t, { objectName: `Societies item ${i + 1}`, x: 5.65, y: 1.95 + i * 0.58, w: 3.7, h: 0.5 });
    });
  }
  card(s, "Gap statement", MX, 4.08, CW, 0.82, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Open  ", options: { bold: true, color: ORANGE } }, { text: "Should losing and regaining standing follow the same rule?", options: { breakLine: true } },
           { text: "Open  ", options: { bold: true, color: ORANGE } }, { text: "How should incomplete evidence be treated, so that errors are forgiven but defection is not?" }],
    { objectName: "Gap statement text", x: 0.75, y: 4.08, w: 8.5, h: 0.82, color: WHITE, valign: "middle", fontSize: 15 });
  sources(s, "Ohtsuki & Iwasa 2004 · Schmid et al. 2023 · Michel-Mata et al. 2024 · Ostrom 1990 · Cox et al. 2010 · Blumstein & Nakamura 2009 · Skowronski & Carlston 1989 · Siegel et al. 2018");
  s.addNotes("Most remedies work at step one. At step two, the standard model lets the latest assessment overwrite a reputation, and the models that accumulate evidence, such as scores, records and aggregation, still use one symmetric rule: positive and negative evidence enter through the same score, threshold or window. Human societies do it differently. Sanctions escalate only with repeated violations, standing is restored only after a period of good conduct, and impressions are revised asymmetrically. This leaves two open questions. Should losing and regaining standing follow the same rule? And how should evidence that is not yet conclusive be treated, so that honest errors are forgiven but deliberate defection is not? The second question carries the tension of the dilemma: whatever shields justified punishers from wrongful condemnations may also shield defectors from rightful ones.");

  // ================================================================ 7. Why it matters
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Why the open problem matters", { placeholder: "title" });
  [
    { icon: ic.hidden, head: "A hidden assumption",
      body: "Every model needs a revision rule. Conclusions about which norms sustain cooperation rest on one symmetric rule, so they may change with it." },
    { icon: ic.balance, head: "An unavoidable trade-off",
      body: "Every revision rule weighs condemning cooperators against excusing defectors. Existing models fix this balance implicitly." },
    { icon: ic.person, head: "Open to every observer",
      body: "Revising needs no shared information or institutions. Communities and online platforms design such rules routinely." },
  ].forEach((c, i) => {
    const x = MX + i * 3.1;
    card(s, `Reason ${i + 1}`, x, 1.15, 2.8, 2.85);
    iconCircle(s, `Reason ${i + 1}`, c.icon, x + 0.2, 1.32, 0.55);
    text(s, c.head, { objectName: `Reason ${i + 1} title`, x: x + 0.2, y: 2.0, w: 2.45, h: 0.34, bold: true, fontSize: FS.cardTitle });
    text(s, c.body, { objectName: `Reason ${i + 1} body`, x: x + 0.2, y: 2.4, w: 2.45, h: 1.5, fontSize: 13.5 });
  });
  card(s, "Our work", MX, 4.18, CW, 0.7, { fill: { color: INK }, line: { color: INK, width: 0 } });
  text(s, [{ text: "Our work  ", options: { bold: true, color: ORANGE } },
           { text: "A model in which losing and regaining standing follow different rules, and incomplete evidence has graded consequences.", options: { color: WHITE } }],
    { objectName: "Our work text", x: 0.75, y: 4.18, w: 8.5, h: 0.7, valign: "middle", fontSize: 15 });
  sources(s, "Hilbe et al. 2018 · Kessinger et al. 2023 · Murase & Hilbe 2024 · Ostrom 1990 · Tadelis 2016");
  s.addNotes("Why does this matter? First, it is a hidden assumption. Every model of indirect reciprocity has to specify how judgements become reputations, and the conclusions of the field about which norms sustain cooperation under private assessment were drawn with one symmetric rule, mostly the overwrite rule. If the rule matters, those conclusions may change. Second, there is a trade-off that no rule can avoid: any rule weighs condemning cooperators on disputed or erroneous evidence against excusing defectors whose misconduct is not yet conclusive. Existing models fix this balance implicitly, through their single rule. Third, revising is the one lever that every observer holds. It needs no shared information and no institution, which is exactly what route one requires. Communities and online platforms design such rules all the time, through escalating sanctions, probation and rating systems, but theory gives little guidance on how. Our work provides a model in which losing and regaining standing follow different rules, and incomplete evidence has graded consequences.");

  // ================================================================ 8. Here, we
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  s.addText("Here, we give judgements inertia", { placeholder: "title" });
  text(s, "A reputation changes only after a run of contrary assessments, and the run can differ between losing and regaining standing. Observers share no information.",
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
    { x: MX, t: [{ text: "Depths " }, it("k"), sub("1"), { text: ", " }, it("k"), sub("2")], tagText: "direction",
      b: "How much evidence changes a reputation in each direction" },
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
  s.addNotes("Here, we give judgements inertia. An established reputation changes only after a run of contrary assessments. Negative assessments move an individual in good standing through warning states before the reputation turns bad, and positive assessments move an individual in bad standing through recovery states before it turns good. The two paths can differ in length, so losing and regaining standing may require different amounts of evidence. Each intermediate state can already carry partial consequences, set by the strengths. Observers share no information and update on one observation at a time, so any agreement among them must come from how they revise their judgements. In terms of the framework, this is route two with two new features: direction and partial consequences.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
