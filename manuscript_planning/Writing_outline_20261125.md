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

## 1. Introduction (target 1,050–1,150 words, 7 paragraphs)

The argument runs: what indirect reciprocity is → the revising step and the assumption theory makes about it → why that assumption matters under private information → what existing remedies do → what people and institutions do instead → our model → findings.

**¶1 Indirect reciprocity and the judging step** (slide 5, loop rows 1–2 and "Public information"; about 170 words)
- Opening phenomenon in everyday terms: people help strangers they will not meet again (directions, colleagues, anonymous online trade\cite{tadelis2016}).
- Reputation explains it: helping earns standing, and standing attracts help from third parties. Name the mechanism\cite{nowak1998,nowak2005,milinski2016} and cite experimental support\cite{wedekind2000,milinski2002}.
- Reputations are useful only if they track behavior, which needs a shared standard of what counts as good. Use the concrete puzzle: helping a cooperator is clearly good, but is refusing to help a defector good? Condemning justified refusals undermines discriminators\cite{leimar2001,panchanathan2003}.
- That is why theory has asked which norms sustain cooperation. With public information the leading eight do\cite{ohtsuki2004,ohtsuki2006}.
- End on a transition: judging an action is only half of forming a reputation.

**¶2 The revising step and the overwrite assumption** (slide 4, OPENING row "Reputations are judgements that change as evidence accumulates"; slide 5, loop row 2; about 170 words)
- Topic sentence: a reputation is an opinion that changes as evidence accumulates, not a single judgment.
- Concrete example (a colleague with years of help, seen refusing once). Whether the refusal is bad is a question for the norm. Whether it should turn a good opinion bad is a separate question about revision.
- The default answer in theory: the latest judgment replaces the previous opinion, however well supported\cite{ohtsuki2004,hilbe2018}. Higher-order norms condition the judgment on the actor's reputation\cite{ohtsuki2004,santos2018}, but one observation still decides.
- Why the assumption has been acceptable: with public information an erroneous judgment is shared by everyone, and under the leading eight the next cooperative act restores standing\cite{ohtsuki2006}.
- Closing sentence that opens the gap: the assumption becomes consequential once judgments are neither reliable nor shared.

**¶3 Private assessment produces two kinds of misjudgment** (slide 6; about 190 words)
- Private, noisy observation leads to divergent opinions\cite{takahashi2006,uchida2010}, and most leading-eight norms fail\cite{hilbe2018,okada2018,perret2021,fujimoto2023}.
- Mechanism: an action is judged through the observer's own view of the recipient, and misjudgments spread\cite{hilbe2018,radzvilavicius2019}.
- Two kinds: wrongful condemnation (the punishment dilemma\cite{okada2020dilemmas,pires2025}) and wrongful excuse. Which dominates depends on the norm\cite{fujimoto2022,fujimoto2023}.
- Requirement: accurate and consistent reputations\cite{fujimoto2022,murase2024synchronization}.
- Change from the current draft: shorter, because ¶2 now carries the transition.

**¶4 Two factors, and what existing remedies do** (slide 7; about 190 words)
- Distortion depends on how often misjudgments occur and how much each one weighs.
- Route 1 (frequency): institutions, gossip, empathy, synchronization\cite{radzvilavicius2021,kawakatsu2024,radzvilavicius2019,murase2024synchronization,tham2026}; generous or stochastic norms\cite{schmid2021,okada2024,murase2023}. Most of these need shared information, and revision is the one lever every observer holds (slide 7).
- Route 2 (weight): scores, records, aggregation, multi-level reputations\cite{schmid2023,clark2020,michelmata2024,tanabe2013,murase2022,yamamoto2025}. In these, a single quantity ties how standing is lost to how it is regained.
- Check before finalizing: whether "tied" fits Clark et al. 2020.

**¶5 The gap: asymmetric, graded revision in people and institutions** (slide 4, GAP row; about 150 words)
- Impressions change at different rates for good and bad conduct\cite{skowronski1989,mendesiedlecki2013diagnostic,siegel2018}; graduated sanctions\cite{ostrom1990,cox2010}; redemption of criminal records\cite{blumstein2009}.
- Incomplete evidence has graded consequences.
- The three open questions, which the Results answer in order: should losing standing take as much evidence as regaining it? Which direction deserves more inertia under a given norm? How should individuals be treated while the evidence is incomplete?

**¶6 Approach** (slide 8; about 140 words)
- Warning and recovery paths of independent depths, and partial consequences through the strengths. No shared information, one observation at a time.
- Methods in one sentence: closed-form reputation map, mean-field theory, evolutionary dynamics, individual-based simulations, four norms.

**¶7 Findings and message** (slides 16, 27, 29, 30; about 190 words)
- Placement matters more than amount, and the norm-specific direction is stated explicitly.
- Accurate and consistent reputations without communication; cooperation stable and easy to reach; the wrong path can destroy cooperation.
- The cost of tolerance (occasional defectors), shared by aggregation and scores; partial consequences exclude opportunists ("costly but not catastrophic").
- The general result for filters with deterministic images.
- Take-home: how a society revises its judgments can matter as much as which behaviors it judges as good.

---

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
