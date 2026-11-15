# Revision notes: Manuscript_full_20261114.tex (revision 3)

This file supersedes `Manuscript_full_20261103.tex`, which is kept unchanged. The compiled PDF is `Manuscript_full_20261114.pdf` (55 pages; the main text ends on page 10, the Methods on page 16, and the Supplementary Information starts on page 28). The Overleaf package is `Manuscript_doc/IR_manuscript_overleaf_20261114.zip`. Build as before: `latexmk -pdf Manuscript_full_20261114`.

Contents of this note:

1. Abstract, with the reason for each sentence
2. Introduction: which structure was used and why
3. Results
4. Discussion
5. Equations
6. Supplementary Information
7. New analytical material that the authors should check
8. Open items

---

## 1. Abstract

The abstract follows the pattern of Christian's recent abstracts (Murase & Hilbe 2024, *PNAS*, both papers; Tham, Hilbe & Murase 2026, *PNAS*; Schmid et al. 2021, *Nat. Hum. Behav.*; Schmid et al. 2023, *Nat. Commun.*). Their common features are:

- a first sentence of about ten words that names the mechanism and says why it matters;
- one or two sentences that explain the mechanism in everyday terms, with people as the subject;
- a statement of what existing models do, followed by the gap ("Much less is known about…", "Yet…");
- "Here, we…" with a plain verb (introduce, propose, identify);
- the model stated as a contrast with the standard assumption;
- "Using analytical calculations and simulations, we show that…";
- results in short declarative sentences, without numbers, norm names or symbols;
- a last sentence on what the results mean, phrased modestly ("Our results suggest…").

Sentences are short, mostly one clause, and in the active voice.

| # | Sentence | Why it is written this way |
|---|---|---|
| 1 | Indirect reciprocity is a key mechanism for cooperation among strangers. | Christian opens with one short sentence that places the paper. Compare "Indirect reciprocity is a key explanation for the exceptional magnitude of cooperation among humans" and "Direct and indirect reciprocity are key mechanisms for the evolution of cooperation". |
| 2 | People help others to maintain a good reputation, which makes them more likely to receive help themselves. | The mechanism in everyday terms, so that a non-specialist can follow the rest. "People" is the subject, as in "People often cooperate out of concern for their reputation". |
| 3 | Most models ask which behaviors should be regarded as good. | States what the literature does, in one line. It sets up the contrast for the gap and names the first of the two questions (which behaviors) that the last sentence returns to. |
| 4 | Much less is known about how reputations should change as new evidence arrives. | The gap, in the phrasing Christian uses ("Much less is known about how social norms initially evolve…"). It poses the paper's question, framing A of the slides. |
| 5 | Typically, a single observation can overturn a reputation. | Names the tacit assumption that the paper relaxes, concretely enough for the reader to see that it is extreme. |
| 6 | When individuals assess each other privately, isolated errors then generate disagreements that spread through the population. | Says why the assumption matters. The wording follows Tham et al. ("errors can generate disagreements that propagate throughout a population"). |
| 7 | Here, we introduce a model in which reputations have inertia. | "Here, we" plus a plain verb, and a ten-word sentence that introduces the central concept. The comma after "Here" follows the *PNAS* abstracts. |
| 8 | A reputation only changes after repeated contrary evidence, and losing a good reputation may require more or less evidence than regaining one. | Defines the two ingredients (inertia, asymmetry) without terminology. It mirrors Christian's device "Most prior work assumes… We instead allow…". |
| 9 | Using analytical calculations and simulations, we show that this asymmetry is crucial. | The method phrase is taken from Tham et al. The claim is one short clause, like "the stability of cooperation depends on a single quantity". It announces the main result before its details. |
| 10 | When inertia is placed in the direction that suits the social norm, individuals largely agree on who is good, although they never exchange information. | Result of Fig. 2. "Although they never exchange information" carries the point of framing B in one clause. "Largely" keeps the claim accurate (mean disagreement ≤ 0.1). |
| 11 | Cooperation then becomes stable and easy to reach. | Result of Fig. 3. Eight words, and the two adjectives correspond to local stability and to the size of the basin. |
| 12 | Inertia in the opposite direction can destroy cooperation altogether. | Result of Fig. 4. A contrast sentence makes the asymmetry claim memorable, and "can" matches the data (recovery-only allocations give no cooperation under SC, SH and SJ). |
| 13 | Tolerance, however, has a downside. | A four-word pivot. Christian often uses a very short sentence to turn the argument ("Yet their results can be vastly different"). |
| 14 | When isolated misdeeds have no consequences, occasional defectors can invade. | Result of Fig. 5a, stated as a condition and its consequence, without O-DISC or α. |
| 15 | They are kept in check once early warnings carry partial consequences. | The remedy, Fig. 5b. "Kept in check" does not promise more than the analysis shows (one family of opportunists). |
| 16 | Our results suggest that cooperation depends not only on which behaviors a society regards as good, but also on how it revises its judgments. | The message. It returns to sentences 3 and 4 and closes the frame. "Suggest" follows Christian's cautious last sentences. |

The abstract has 209 words. A 148-word version for journals with a 150-word limit:

> Indirect reciprocity is a key mechanism for cooperation among strangers. People help others to maintain a good reputation, which makes them more likely to receive help themselves. Most models ask which behaviors should be regarded as good. Much less is known about how reputations should change as new evidence arrives. Here, we introduce a model in which reputations have inertia. A reputation only changes after repeated contrary evidence, and losing it may require more or less evidence than regaining it. We show that this asymmetry is crucial. When inertia suits the social norm, individuals agree on who is good without exchanging information, and cooperation becomes stable and easy to reach. Inertia in the opposite direction can destroy cooperation. Full tolerance, however, lets occasional defectors invade, unless early warnings carry partial consequences. Cooperation thus depends on how judgments are revised, not only on which behaviors are regarded as good.

---

## 2. Introduction

### Choice of structure

The slides offer two framings. **A** asks how reputations should change. **B** asks whether reputations can work without shared information. I wrote the Introduction with **framing A**, for four reasons.

1. **It matches the title.** "Asymmetric reputational inertia" is an answer to "how should reputations change?". Under B, the title's key word would appear only in the approach.
2. **It covers all four results.** A sets up the asymmetry (Figs. 2–4) and the treatment of incomplete evidence (Fig. 5). B is carried by Fig. 2 alone, and Figs. 4 and 5 would read as side results.
3. **It is the safer claim.** B promises agreement "without any shared information". Christian's own result (Murase & Hilbe 2024) is that cooperative norms are not evolutionarily stable when private opinions are independent. Our mean-field theory makes the same independence assumption, and Section 7 below shows that the limit still applies in a weaker form. A reader who knows that paper would test claim B first.
4. **It is more clearly new.** Michel-Mata et al. 2024 already frame aggregation as consensus without communication. No previous paper asks whether losing and regaining standing should need the same evidence.

B is not lost. Its core appears as one sentence at the end of the approach paragraph ("observers in our model share no information…"), as one sentence in the findings, and as a Discussion paragraph.

### Paragraph plan (839 words)

| ¶ | Role | Content |
|---|---|---|
| 1 | Field and the two steps | Reputation-based cooperation. Reputations are formed in two steps, judging and revising. Theory has studied the first step (norms, leading eight). The second has received little attention. |
| 2 | Problem | Private assessment produces misjudgments that spread. They come in two kinds, wrongful condemnation and wrongful excuse, and the norm decides which dominates. Reputations must be accurate and consistent. |
| 3 | Two routes and the gap | Distortion depends on how often misjudgments occur and on how much each weighs. Most remedies reduce how often. Revision is treated either as overwrite or as symmetric pooling, whereas people and institutions revise asymmetrically and gradually. Two open questions. |
| 4 | Approach | "Here, we…". Warning and recovery states, asymmetric depths, partial consequences. No shared information. |
| 5 | Findings and message | Asymmetry rather than amount. The beneficial asymmetry protects the standing that a norm most often overturns by mistake. Stable and easy to reach. Wrong path gives no cooperation. Cost of tolerance, and "costly but not catastrophic". |

### If you prefer framing B

Replace paragraphs 1–3 by an opening on agreement (institutions, gossip, synchronization), the cost of shared information, and "revising is the one lever every observer holds". Paragraphs 4 and 5 need only their first sentences changed. `intro_revisions/final/` has drafts in that direction (Storyline 3). I can write it out in full if you want to compare the two side by side.

---

## 3. Results

- **Section titles** now state the four results, as on the slides: "Asymmetric inertia makes private reputations accurate and consistent", "…makes cooperation stable and easy to reach", "Allocation matters more than the amount of inertia", "Full tolerance shelters occasional defectors, and partial consequences exclude them". Figure titles match.
- **Terminology.** "Directional inertia" is replaced by "asymmetric inertia". "Discriminating and consistent" is now "accurate and consistent", as on the slides.
- **Former Extended Data Fig. 4 removed**, together with the paragraph that explained why basins expand, the SI paragraph on the ALLD–DISC edge and the corresponding Methods sentence. Basin sizes are still reported, as on slide 20, but not explained. Extended Data figures are renumbered 1–8. The **figure files were renamed to match** on 14 November: `Manuscript_doc/ED_FigN.pdf` is Extended Data Fig. N for N = 1–8, and the file of the removed edge figure was deleted (it remains in the Git history).
- **Framework section.** A new short paragraph introduces the reputation map in words (linear without inertia, flattened near u = 1 by warning states and near u = 0 by recovery states), because the later sections rely on it.
- **Fig. 2 section.** Each failure without inertia is now explained and assigned to one of the two kinds of misjudgment, and the selected asymmetries are tied to them.
- **Fig. 3 section.** Basin sizes are given for all four norms (88%, 71%, 71%, 76%, against 61%, 8%, 23%, 71% for one-step inertia). The window is displayed as an inequality with the two thresholds on separate lines, and the chord condition is explained in the main text. The text notes that the missing window without inertia agrees with Murase & Hilbe 2024.
- **Fig. 4 section**, new observations from the verified data:
  - SC with two states: 0 for (0,2) against 0.87 for (2,0) (the slide example);
  - recovery-only allocations give no cooperation at any depth under SC, SH and SJ;
  - adding a recovery state to (1,0) lowers cooperation (0.81 → 0.59 under SC, 0.31 → 0.08 under SH, 0.49 → 0.22 under SJ), so more inertia can be worse than less;
  - under SS neither path alone helps;
  - an explanation of the diminishing returns: every extra warning state also raises the reputation of unconditional defectors (0.06 and 0.08 for the selected SC and SH architectures, below 0.01 for one-step inertia).
- **Fig. 5 section.** The slope formula is presented as a product of a judging factor and a revising factor. The error-free threshold α ≤ 1 − c/b is now in the main text with its interpretation. A new paragraph reports the mirror image of deterrence (Section 7). The section closes with "costly but not catastrophic".
- The Extended Data legend for the depth plane said that SS supports high cooperation "whenever a warning path is present". The data do not support this for warning-only allocations (0.55 falling to 0.29), so the legend now says "when a short warning path is combined with a longer recovery path".

---

## 4. Discussion

Order of paragraphs:

1. the second design dimension (how readily judgments are revised);
2. the asymmetry mirrors the misjudgments of each norm;
3. agreement without communication, and the two routes;
4. value of information, allocation and saturation;
5. the price of tolerance;
6. **new:** reputation filters, their mathematical forms, and the three properties of a reputation map that determine the results (fixed points, position relative to the chord, slope);
7. **new:** two opposing requirements on the slope, and why they require graded consequences;
8. **new:** the open question of which filter is best without assuming a context;
9. institutions and predictions;
10. limitations, including the two-sided deviation result of Section 7;
11. conclusion.

Paragraph 8 states what a context-free optimum would have to achieve, why the goals conflict (memory, speed of response, and the fact that the assessments to be separated depend on the norm and on the reputations the filter itself produces), and three ways to approach the question.

---

## 5. Equations

- Every displayed equation now carries **one relation per line**. Groups of related definitions share one number (`aligned`). This applies to the main text, the Methods and the SI.
- Formulas that were written inline in the Methods are now displayed (the transition matrix, the one-step and full-strength maps, the image probabilities, the fold and upper-boundary conditions, the aggregation and score maps).
- Equations are **centred**. The previous files used the template option `fleqn` (flush left). To restore it, write `\documentclass[fleqn,10pt]{wlscirep}`.
- Main-text equations are now (1) separation, (2) window, (3) thresholds, (4) Λ(δ), (5) Λ′(0), (6) security criterion. The slides call the slope formula "Eq. 3". It is now Eq. (5).
- In the score formulas, the odds u/(1 − u) are written ϑ instead of t, which also denotes evolutionary time.

---

## 6. Supplementary Information

### New structure

| New note | Contents | Former location |
|---|---|---|
| 1 Model | 1.1 interactions, norms, errors; 1.2 inertial record | 1.1, 1.2 |
| 2 The reputation map of a single record | 2.1 stationary distribution; 2.2 map and special cases; 2.3 passage times; 2.4 properties | 1.3 |
| 3 Private reputations in a population | 3.1 closure; 3.2 self-consistency; 3.3 latent-state dynamics; 3.4 selection of a solution; 3.5 homogeneous discriminator populations | 1.4, and the resident functions from 1.1 |
| 4 Evolutionary dynamics | 4.1 payoffs and replicator dynamics; 4.2 line of equilibria under Scoring; 4.3 measures of cooperation | 1.5 |
| 5 Invasion of a discriminator population | 5.1 rare mutants; 5.2 unconditional mutants; 5.3 opportunistic discriminators; 5.4 deviations towards more cooperation (new) | 2.1–2.3 |
| 6 General reputation filters | 6.1 definition and stationary response; 6.2 price of one negative assessment; 6.3 two requirements on the slope; 6.4 aggregation; 6.5 quantitative scores; 6.6 comparison | 2.4 "Alternative reputation filters", much extended |
| 7 Finite-population simulations | unchanged in content, now with subsections | 3 |
| 8 Numerical methods | grouped into reputations, strategy dynamics, invasion analyses, software | 4 |
| 9 Notation | extended by the new symbols | 5 |

Other changes: each note opens with a short statement of what it does and which results it contains. A new Supplementary Table S1 lists the main analytical results and where each is used. The former Note 1 mixed the single record, the population closure and the dynamics, and these are now separate notes. Labels used by the main text (`si:map`, `si:filters`, …) are unchanged. One sentence about earlier pipelines ("Earlier pipelines interpolated the replicator field… This was corrected") was removed from the numerical methods, since it describes the history of the project and not the method.

### Proposition S2 (stationary distribution)

The statement now lists the four probabilities on separate lines. The proof is in four labelled steps: (1) existence and uniqueness, (2) balance along the two paths, (3) balance between good and bad standing, (4) normalization. Steps 2 and 3 are presented as necessary conditions and Step 4 as the point at which they determine the distribution, so the logic no longer runs backwards from the answer.

In case you meant the second proposition of the old file (the four-part list of properties, old S3), I reorganized that one as well. It is now three propositions, each with its own proof: monotonicity in the strengths (S4), the derivative (S5) and the response to rare contrary assessments (S6). A new Lemma S3 (duality: exchanging good and bad standing exchanges α and β, k₁ and k₂, u and 1 − u) lets the "mostly bad record" case follow from the "mostly good record" case instead of "in the same way".

### Former Section 2.4, aggregation and quantitative scores

- **Aggregation (6.4).** The map is derived as a binomial tail. Its derivative is obtained by a telescoping sum. The note gives the curvature (convex below (Q − 1)/(M − 1), concave above), the behaviour for rare contrary assessments, and, for the (2,1) rule, the loss of reputation, the parabola Λ(δ), the invasion window δ_c in closed form and the exact security condition 1 − u_R* ≥ c/(2bΔΦ*).
- **Quantitative score (6.5).** The stationary distribution is derived from detailed balance, the map from geometric sums, and a closed form is given, R = u^{n_b}(u^{n_g} − v^{n_g})/(u^{n_s} − v^{n_s}). The slope is written as a covariance, which shows that the map is increasing. The note gives the behaviour for rare contrary assessments, the correspondence between (n_g − 1, n_b − 1) and the depths (k₁, k₂), and the difference from the inertial record: a score has no reset and responds to the balance of evidence, so its map approaches a step at u = 1/2, whereas the depths of an inertial record move the switch point.

---

## 7. New analytical material to check

These results were derived and checked numerically in this revision. They are not in the verified package. The two places in the manuscript that depend on new numbers carry a red draft note.

1. **Lemma S3 (duality).** 1 − R(u; α, β, k₁, k₂) = R(1 − u; β, α, k₂, k₁). Checked to machine precision for random parameters.
2. **Proposition S20 (price of one negative assessment).** For any finite-state filter, R′(1) = P₁, the expected time for which an individual is regarded as bad after one isolated negative assessment. Proved by a renewal argument and checked on 300 random automata. It gives 1 − α for the inertial record, 0 for forgiving aggregation rules and scores, and 1 for instantaneous updating.
3. **Proposition S21 (two requirements on the slope).** For any filter, weak opportunists are excluded if and only if R′(u*) ≥ c/(bΔΦ*), and the resident state is stable if and only if R′(u*) < 1/u_R′(r*). In the error-free limit this is c/b ≤ P₁ < 1/(2 − p). It contains the existing results (the error-free threshold, the stability condition for r = 1 and the closing of the secure interval) as special cases. **Corollary S22:** a filter with deterministic images has a whole-number P₁ and cannot satisfy both. This gives the Discussion a general argument for partial consequences.
4. **Proposition S18 (deviations in both directions), with consequences for the main text.** With 𝓜 = (b/c)ΔΦ*R′(u_R*), mutants that help slightly less invade if 𝓜 < 1, and mutants that help slightly more invade if 𝓜 > 1. A discriminator population therefore cannot strictly resist both, which is the form that the Murase–Hilbe independence result takes for inertial records. Concretely, **at α = 0.8 the upper threshold R_U is below 5 under all four selected architectures** (4.88, 4.89, 4.96 and 2.21 for SC, SH, SJ and SS), so ALLC can invade pure DISC. The previous text mentioned this for SS only. The invasion is harmless: on the ALLC–DISC edge the population settles at 2.4%, 2.2% and 0.7% ALLC under SC, SH and SJ (54% under SS), intended cooperation is 0.99, and ALLD has a strongly negative growth rate (Supplementary Table S11). I reported this in the last Results section, in the Methods and in the limitations paragraph. The same code reproduces the verified DISC–ALLC equilibrium of SS (1,2) at α = 1 (f_ALLC = 0.197, intended cooperation 0.9952). Please confirm the α = 0.8 numbers with the verified engine, and decide how prominently you want this stated. I think it is better said by us than found by a referee.
5. **Monotonicity of R in u** is stated as a numerical observation only (3,000 random architectures). I have no proof.

All values in the existing SI tables (S9, S10, S13 and the worked example) were recomputed independently and agree. The scripts are in `checks/`.

---

## 8. Open items

- **Fig. 4** was replaced on 14 November by the version drawn from the verified data (`Manuscript_doc/Fig4.pdf`). Its envelope labels agree with `verified/figure4_ed6/data/figure4/total_depth_results.csv`, and the draft note in the legend was removed.
- **Extended Data Fig. 8** (secure tolerance strengths) was replaced on 14 November by the version with orange outlines and boundary curves. It is stored as `Manuscript_doc/ED_Fig8.pdf`, and the legend now says "orange" instead of "black".
- **Fig. 3a (SC)** redraw, as before.
- **Fig. 3c (SS): the label 99.99% should read 99.52%.** Recalculated on 15 November with `checks/fig3_equilibria.py`, which agrees with the verified `equilibria.csv` to six digits. The stable mixture has f_ALLC = 0.19671 and f_DISC = 0.80329. A DISC donor intends to cooperate with probability r̄ = 0.19671 × 0.99524 + 0.80329 × 0.99376 = 0.99405, so intended cooperation is 0.19671 + 0.80329 × 0.99405 = 0.99522 (realized 97.53%). The other labels of Fig. 3 are correct: 99.99% (SC), 100% (SH, 99.9998% before rounding) and 100% (SJ) in panel c, 99.63%, 99.53%, 99.53% and 99.63% in panel b, and 98.96% and 98.92% in panel a. The values are now in the new Supplementary Table S8, and the Fig. 3 legend carries a draft note until the figure is corrected. The main text says that the SS mixture contains about 80% DISC and 20% ALLC.
- **Slide scripts and the old manuscript file.** The scripts in `Slides/` and `Manuscript_full_20261103.tex` still expect the old file names (`ED_Fig1.pdf`–`ED_Fig9.pdf`, with the edge figure as number 4). They were left unchanged on request. Rebuilding either from the repository would now place the wrong figures or fail on the missing `ED_Fig9.pdf`. The committed decks, `Manuscript_full_20261103.pdf` and the Overleaf package of 3 November are not affected, because they contain their own copies of the figures.
- **Slides.** Slide 32 is titled "Nine supplementary results" but lists eight.
- **Spelling.** The manuscript uses American spelling (judgment, behavior), the slides British (judgement).
- **Length.** The Results now have about 3,800 words and the Discussion about 1,700. For a journal with a tight limit, the Discussion paragraphs 4, 7 and 9 are the first candidates for shortening.
- **Unchanged from before:** data and code availability, acknowledgements, author contributions, competing interests, full author list.
