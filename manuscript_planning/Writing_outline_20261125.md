# Paragraph-level writing outline (25 November 2026)

This is the outline for revising `manuscript/Manuscript_full .tex` paragraph by paragraph. It follows the structure of the presentation *Indirect reciprocity with asymmetric reputational inertia* (43 slides) and keeps framing A ("How should reputations change?"). For each paragraph it gives its job, its content, the slide it draws on and anything that has to be fixed. Word budgets are targets, not limits.

## 0. How the deck maps onto the paper

| Deck section | Slides | Paper section |
|---|---|---|
| 1 Motivation and research gap | 4–8 | Introduction ¶1–¶7 |
| 2 Model and methods | 10–14, 21, 23 | Results, model subsection, and Methods |
| 3 Results (four results) | 16–25 | Results R1–R4 |
| 4 Conclusion | 27–30 | Last Results paragraph and Discussion |
| 5 Supplementary results | 32–40 | Extended Data Figs 1–8 and SI |

The deck states each step of the argument as one message per slide. The manuscript should do the same with one message per paragraph, stated in that paragraph's first sentence.

---

## 1. Introduction (about 1,230 words, 8 paragraphs; revised 25 November, third pass)

**Opening pattern** (from Hilbe et al. 2018, Schmid et al. 2023, Michel-Mata et al. 2024, Murase & Hilbe 2024 and Tham et al. 2026): an empirical statement about reputation; the mechanism and its evidence; how models formalize it (donor, recipient, observer); the field's central question (which norms?); the standard assumption, acknowledged for why it was adopted; why it fails; what we change. Tham et al. 2026 has the closest structure: "most prior work assumes X; we instead allow Y".

**The question.** How should private reputations be revised as evidence accumulates, and in particular, should losing a good reputation require as much evidence as regaining one? It is stated once, at the end of ¶6, and answered in the first sentence of ¶8.
- Importance: it is the counterpart of the field's central question (¶2–¶3); overwriting is what lets misjudgments spread (¶4); revision is the one lever each observer controls without shared information (¶5).
- Novelty: existing rules tie loss to recovery, whereas misjudgments, people and institutions are directional (¶6).

| ¶ | Purpose | Slides |
|---|---|---|
| 1 | Reputation, indirect reciprocity, roles, two steps | 5 |
| 2 | The judging step: why it is subtle; which norms; leading eight | 5 |
| 3 | The revising step: colleague example; overwrite assumption; why it was acceptable | 4 (Opening) |
| 4 | Private assessment: two kinds of misjudgment; overwriting lets them spread | 6 |
| 5 | Remedies act on judging and need shared information; revision is each observer's lever; models that absorb misjudgments | 7 |
| 6 | Gap: those models tie loss to recovery; misjudgments, people and institutions are directional → the question | 4 (Gap), 7 |
| 7 | Approach | 8 |
| 8 | Answer, its condition, the general result, take-home | 16, 27, 29, 30 |

## 2. Results

**Model subsection: "A model of asymmetric reputational inertia"** (slides 10–11)
- ¶M1 Game, strategies, private assessment, four norms, errors. Add the reference parameters ($b/c=5$, $e_1=e_2=0.02$) as on slide 10.
- ¶M2 Inertial updating: depths, reset rule and the names tolerance depth, strictness depth and total depth.
- ¶M3 Interpretation of records: the strengths $\alpha,\beta$ and what "partial consequences" means.
- ¶M4 The reputation map $\mathscr R(u)$ and how inertia flattens it near $u=1$ and $u=0$. Name the three settings compared throughout (slide 11, "Compared settings").
- Terminology to fix once and use everywhere: "interpreted as" or "read as" (the deck uses "read"); "selected architectures" against "selected multi-step architectures"; whether to say "full one-step inertia" or "one-step inertia".

**R1 "Asymmetric inertia makes private reputations accurate and consistent"** (slides 17–18; Fig. 2, ED1–3)
- ¶1 Two requirements and the measures $\Delta g$ and $\bar d$ (slide 18).
- ¶2 How each norm fails without inertia and with one-step inertia; agreement alone is not enough (slide 17 notes).
- ¶3 Selection rule and the four architectures; the asymmetry mirrors each norm's misjudgments; robustness (ED1).
- ¶4 Bistability removed (ED2a–d, ED3); transition to evolution.

**R2 "Asymmetric inertia makes cooperation stable and easy to reach"** (slides 19–21; Fig. 3, ED2e–h, ED4–6)
- ¶1 Replicator set-up and the measures (cooperative basin, $\bar\rho$) (slide 14).
- ¶2 Without inertia and with one-step inertia: stable is not the same as reachable (8% and 23%).
- ¶3 Selected architectures: pure DISC under SC, SH and SJ; DISC–ALLC mixture under SS; basins of 71–88% (slide 20). **Fix:** the text says 70–88%, but Supplementary Table S5 gives 0.705–0.883.
- ¶4 Local stability window and chord condition (slide 21), including why SS ends in a mixture ($R_{\rm U}\approx4$).
- ¶5 Robustness (ED2e–h, ED4, ED5, ED6) and the transition: allocation and amount are confounded.

**R3 "Allocation matters more than the amount of inertia"** (slide 22; Fig. 4, ED7)
- ¶1 Same $K$, very different outcomes; (0,2) against (2,0) under SC; more can be worse.
- ¶2 The best allocations follow the norm-specific directions, and the selected architectures lie on the envelope.
- ¶3 Diminishing returns because tolerance also shelters defectors; transition to opportunism.

**R4 "Full tolerance shelters occasional defectors, and partial consequences exclude them"** (slides 23–25; Fig. 5, ED8)
- ¶1 Defining O-DISC and $\Lambda(\delta)$ (slide 23).
- ¶2 Excluding ALLD does not exclude O-DISC; aggregation and scores behave the same way (slide 24).
- ¶3 Mechanism: $\Lambda'(0)$ as assessment contrast × map slope, which links back to the two steps of ¶1–¶2 of the Introduction (slide 7 notes, "Eq. 3").
- ¶4 Family criterion and the error-free threshold $\alpha\le1-c/b$.
- ¶5 Secure interval (0.567, 0.804] (slide 25), fold against slope; all norms (ED8).
- ¶6 Scope, and the mirror image (ALLC at $\alpha=0.8$). **Open:** the numbers are not yet in the verified package; decide whether this stays in the Results or moves to the Discussion and SI.
- ¶7 Synthesis: depth against strength; catastrophic, costless, or costly but not catastrophic (slide 29).

**Figures to bring in line with the text:** the Fig. 3c row label ("Full multi-step inertia"), and the axis labels of Fig. 5a and 5b ("Invasion exponent", "Opportunistic defection", "Invasion window", "Cooperation rate").

---

## 3. Discussion (slides 27–30; currently 11 paragraphs, target 8–9)

- ¶D1 Answer to the framing question: how judgments are revised, with the norm held fixed (slide 27, problem 1).
- ¶D2 Asymmetry mirrors the norm's misjudgments; norms and revision rules should be analyzed together.
- ¶D3 Agreement without communication: why reliable private judgments coincide, and why agreement is not sufficient; the two routes are complementary (slide 27, problem 2, and slide 7).
- ¶D4 The value of information: retained evidence helps only if it is allocated well, and it saturates.
- ¶D5 Tolerance has a price; continuous families of partial defection should become a standard test.
- ¶D6 Reputation filters, the price of one negative assessment and graded consequences. **Suggestion:** merge the current three filter paragraphs into one or two, since the general result now appears in the Introduction.
- ¶D7 Which filter is best is an open question.
- ¶D8 Institutional practices and testable predictions for human impression formation.
- ¶D9 Limitations: the mean-field closure, the separation of timescales, no evolution of the architecture, the restricted mutant set, and the two-sided neutrality (ALLC).
- ¶D10 Closing (slide 30 take-home).

---

## 4. Methods (slides 10–14, 21, 23)

The current order already matches the deck: game and errors (slide 10) → records (slide 11) → stationary map (slide 12) → self-consistency (slide 13) → evolution and measures (slide 14) → invasion (slides 21, 23) → simulations → numerics. Edit at paragraph level only: remove repetitions of the Results, and check that every symbol is defined before first use.

## 5. Housekeeping still open

- Abstract: align with the final Introduction and check the target journal's length limit (currently 209 words).
- Author list and affiliations (the deck lists six authors).
- `iyengar2019` is cited in the Discussion but missing from `references.bib`.
