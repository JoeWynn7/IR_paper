# Revision plan: from the new Introduction to submission

*Drafted 25 November 2026. The Introduction has a working draft (commit `8e0c289`). This plan covers the remaining sections.*

> **Progress (25 November 2026).**
> - Round 1 (Results): revised and checked against an independent implementation (commit `8b73fc9`).
> - Round 2 (Discussion): revised to seven paragraphs and about 1,180 words. The general theory of reputation filters and the "which filter is best" question now live in Supplementary Note `si:filters`. The missing reference `iyengar2019` was dropped, and the missing SI keys (`SI-murase2024synchronization`, `SI-schmid2021`, `SI-murase2023`) were added.
> - Round 4 (Methods, 26 November 2026): cut from about 3,400 to about 2,360 words and from 34 to 7 displayed equations (image probabilities, reputation map, self-consistency, relaxation, payoffs, replicator dynamics, rare-mutant payoff). Equations the SI relied on (Φ, h, u_I, the one-step map, cooperation measures, fold and upper-boundary conditions, simulation estimators) now live in the SI, and numerical settings that existed only in the Methods were added to Supplementary Note `si:numerics`.
> - Round 3 (Abstract, 26 November 2026): rewritten at 149 words, unreferenced, following the Introduction's thread (how goodness is defined, then how reputations should change). Title unchanged.
> - Round 6 (SI, 26 November 2026): revised for detail and readability. Added overviews and summaries for the theory notes, tables of modelling assumptions and of where each figure is explained, the sources of misjudgment under each norm (Supplementary Table `tab:si-misjudgments`), a worked example of a record, the explicit maps of the settings used with values at telling inputs, closed-form resident reputations without inertia, and intermediate steps in several derivations. All existing SI formulas were checked symbolically (SymPy); every new number was computed independently.
> - Round 5, part 1 (Extended Data legends, 26 November 2026): all eight legends rewritten against the rendered figures and the verified data (143–228 words each). Results 2 corrected (under one-step SJ the low resident state is r = 1/2, not "everyone bad"), and two Results 3 sentences swapped so that Extended Data Figs. 5 and 6 are cited in numerical order. Still to fix in the figure files: the colour of the selected architectures (red in ED Fig. 2, orange elsewhere), labels "Full multi-step inertia"/"Multi-step inertia" versus "selected architectures" in the text, the ED Fig. 8 key "α_L ≤ α ≤ α_U" (folds are excluded), and panel titles "Stern judging"/"Simple standing".
> - Round 5, part 2 (main figure legends, 26 November 2026): all five legends rewritten against the rendered figures and the verified data (138–235 words each). Still to fix in the figure files: Fig. 5a axis "Invasion exponent" (should be "Payoff advantage, Λ") and legend entries "Multi-step inertia"/"Quantitative"; Fig. 5b axes "Invasion window" and "Cooperation rate" (should show δ_c and r_R*); Fig. 3 row label "Full multi-step inertia" (should be "Selected architectures").
> - Round 7 (whole-text review, 26 November 2026): colons and semicolons removed from the text, captions and tables; vague frequency words replaced by numbers or exact conditions; very short sentences merged. Results opens with a three-paragraph model description that leaves details to Methods; the definition of Δg moved to Methods (`eq:separation`), and R_L and R_U now form one equation (`eq:window`). Figure titles no longer repeat the Results headings. SI tables cut from 21 to 8 (kept: norms, transitions, basins, thresholds, secure intervals, invasion by ALLC, selected architectures, symbols); the content of the removed tables moved into the text, partly as displayed formulas (`eq:s-selected-maps`, `eq:s-resident-norms`, `eq:s-instantaneous`). Accuracy fixes checked against the verified data: final cooperation at the cooperative attractor (0.974–0.980) is stated with its exceptions (instantaneous SC and SS, SS without a warning path, partial strengths); the low state of one-step SJ is exactly 0.5; 0.96–0.98 is the mean over cooperative trajectories, not every trajectory.
> - Round 8 (Introduction, 26 November 2026): rewritten in a narrative style (918 words, six paragraphs). It opens with two everyday judgments, names the two processes behind every reputation (judging and revising), follows the classic question about judging (how goodness should be defined) into private assessment, and arrives at the question about revising (how reputations should change). No "because", no colons or semicolons. Nine references added after comparing the bibliography with the reference lists of 12 top-journal papers in `Refs/` (alexander1987, sugden1986, kandori1992, brandt2004, pacheco2006, uchida2013, yoeli2013, schmid2021nhb, lee2021; DOIs checked), and eight existing but uncited entries are now cited (leimar2001, panchanathan2003, okada2017, okada2020, tanabe2013, murase2022, murase2023, tadelis2016; reeder1979 and skowronski1989 in the Discussion). Results and SI now speak of the two processes in the same words.
> - Round 8b (Introduction, 26 November 2026): recast in an academic register in five paragraphs (895 words). It opens directly on reputation and cooperation, calls the two processes assessment and updating (Results and SI now use the same terms), states the research question at the end of paragraph 4, begins the findings with "Here, we", gives no numbers in the findings and closes on the significance of the work. Citations unchanged.
> - The manuscript compiles cleanly with TeX Live 2023 (pdflatex, bibtex for both bibliographies): no errors, no LaTeX warnings, no overfull boxes; 53 pages.
> - NHB limits confirmed on the journal's content-types page (nature.com/nathumbehav/content): Article main text up to 5,000 words, excluding abstract, Methods, references and figure legends; abstract up to 150 words, unreferenced; up to 8 display items.
> - Main text (Introduction + Results + Discussion) is about 5,270 words (Introduction 895, Results 3,174, Discussion 1,197; headings, equations, citations and draft notes not counted). About 270 need to go to meet the 5,000-word NHB limit, best taken from Results (the robustness paragraph in Results 3, the closing paragraph of Results 5 and the mirror-image paragraph that the Discussion repeats). The main text now cites 60 references; whether NHB caps references for Articles could not be checked from this environment.

## 1. Where the manuscript stands

| Part | Now | Target (Nature Human Behaviour) |
|---|---|---|
| Abstract | 209 words | ≤150 words, no citations |
| Introduction | 819 words | ~800 words; minor polish only |
| Results | 3,063 words, 5 subsections, 6 displayed equations | ~2,700 words |
| Discussion | 1,694 words, 11 paragraphs | ~1,300 words, about 7 paragraphs |
| Main text (Introduction + Results + Discussion) | **5,576 words** | **≤5,000 words** |
| Methods | 3,356 words | no fixed limit; remove overlap with the SI |
| Display items | 5 main figures, 8 Extended Data figures | ≤8 main; Extended Data ≤10 (to verify) |
| References cited before the SI | 42 | acceptable |
| Draft notes still in the text | 8 | 0 |

The NHB and PNAS limits come from third-party guides and must be checked against the journals' own pages before formatting.

## 2. Target journal

**Recommended: Nature Human Behaviour first.**

- Its format fits the manuscript as it is: a separate Methods section with no fixed length, Extended Data figures, and Supplementary Information.
- The main text needs about 600 fewer words.
- The abstract must drop from 209 to 150 words.

**PNAS as the alternative.**

- PNAS prefers 6 pages (roughly 4,000 words including figures) and allows up to 12 pages for an extra charge.
- The abstract can be up to 250 words, and a Significance Statement of 50–120 words is required.
- Most of the Methods would move to the SI, and the main figures would drop to four or five.

Deciding now matters, because the length targets for the Results and the Discussion depend on it.

## 3. One thread for the whole paper

Every section should follow the line the Introduction sets up:

- **The classic question:** how goodness should be defined.
- **Its limit:** under private assessment, defining goodness is only part of the problem.
- **Our question:** how reputations should change in response to new assessments.
- **Our answer:**
  - inertia placed to protect the standing that a norm most often overturns by mistake;
  - a single negative assessment that is costly but not catastrophic.

Use the same terms everywhere: assessment, reputation, good and bad standing, wrongful condemnation, wrongful excuse, warning and recovery states, partial consequences, accurate and consistent. In the Results and Methods, introduce the technical names once, next to the plain terms: tolerance and strictness depths k₁ and k₂, and tolerance and strictness strengths α and β.

## 4. Section plans, in order

### Round 1 — Results

The Introduction now makes specific promises, so the Results come first.

| Promise in the Introduction (¶5) | Where it is delivered |
|---|---|
| Where inertia is placed matters more than how much there is | Results 4 (Fig. 4, Extended Data Fig. 7) |
| Inertia should protect the standing a norm most often overturns by mistake | Results 2 and 4 (Figs. 2 and 4) |
| Private reputations become accurate and consistent | Results 2 (Fig. 2, Extended Data Figs. 1–3) |
| Cooperation becomes stable and is reached from most initial conditions | Results 3 (Fig. 3, Extended Data Figs. 2, 4–6) |
| Inertia in the opposite direction can eliminate cooperation | Results 4 (Fig. 4) |
| Without partial consequences, occasional defectors invade | Results 5 (Fig. 5a) |
| Costly but not catastrophic excludes them | Results 5 (Fig. 5b, Extended Data Fig. 8) |

Edits by subsection:

1. **Model.**
   - Introduce the reputation map as the single function through which any rule for changing reputations acts. This makes the comparison with scores and aggregation exact.
   - Define "instantaneous updating" as the classic rule in which each assessment replaces the previous view.
   - Introduce k₁, k₂, α and β next to their plain names.
2. **Accurate and consistent reputations.**
   - Add the clearest evidence that the right direction depends on the norm. Under Simple Standing, tolerance alone raises the share of observers who regard ALLD as good from 0.30 to 0.57 as warning states go from 0 to 4. Mean cooperation falls from 0.55 to 0.39 as warning states go from 1 to 5. The mixed allocation (1,2) reaches 0.74.
3. **Stable and easy to reach.**
   - Qualify "without inertia, pure DISC is not stable under any norm" with our observation model (one observer per interaction).
   - Cite Fujimoto & Ohtsuki 2023, who find Simple Standing can be stable when everyone observes every interaction, and Murase & Hilbe 2024.
4. **Allocation versus amount.**
   - Lead with the headline sentence used in the Introduction.
   - Keep the comparison (2,0) versus (0,2) under Scoring: 0.87 versus 0.
5. **Occasional defectors.**
   - Resolve the draft note on the DISC–ALLC mixtures at α = 0.8: verify the numbers in the verified package, or remove the passage.
   - Correct the claim that the alternative rules were "not matched in memory". Aggregation with M = 2, Q = 1 ("look twice, forgive once") has exactly the same reputation map as our record with one warning state and α = 1 (checked numerically: difference ≤ 1e-16).

Optional retitling, to echo the Introduction:

- Results 4: "Where inertia is placed matters more than how much there is".
- Results 5: "A single negative assessment should be costly but not catastrophic".

Cut about 350 words, mainly from Results 3 (the robustness paragraph) and Results 5 (the derivation details, which can go to the Methods).

### Round 2 — Discussion

Go from 11 paragraphs to about 7, and from about 1,700 to about 1,300 words.

1. **The answer.** Reputations should change slowly, asymmetrically and with graded consequences. Say in one sentence why this matters beyond the four norms.
2. **Agreement without communication (frame B).**
   - Observers who share nothing still largely agree, because reliable private judgments coincide: disagreement is 2r(1−r).
   - Agreement alone is not enough: under Shunning with one-step inertia, everyone agrees that everyone is bad.
   - Present this as complementary to institutions, gossip and synchronization.
3. **Norms and rules for changing reputations must be designed together.** Shunning and Stern Judging fail under instantaneous updating but work with the right inertia, so comparisons of norms under private assessment may need revisiting.
4. **Costly but not catastrophic.**
   - The tension between tolerance and exploitation.
   - Scores and aggregation as reputation filters described by their maps.
   - Why a single negative assessment needs a fractional price.
   - Institutional parallels: graduated sanctions, criminal records.
5. **Predictions for human behavior.**
   - A single recent lapse should lower an individual's treatment without reversing it.
   - How fast people revise good and bad impressions should depend on the prevailing norm.
6. **Limitations.**
   - The mean-field closure.
   - Separation of timescales between reputations and strategies.
   - Architectures that are fixed rather than evolving.
   - The mutant set tested.
   - No cost of memory.
7. **Closing.** Return to defining goodness versus changing reputations.

Move the detailed slope requirements and the "which filter is best" discussion to the SI, keeping one sentence in the main text. Fix the missing reference `iyengar2019`.

### Round 3 — Abstract and title (plus Significance Statement if PNAS)

- **Abstract:** at most 150 words, no citations, following the Introduction's thread.
  1. Reputations and the classic question.
  2. Failure under private assessment.
  3. Each assessment replaces the previous view.
  4. Asymmetric reputational inertia.
  5. Direction matters more than amount, with the rule tied to the norm.
  6. Stable, reachable cooperation.
  7. The price of tolerance and the costly-but-not-catastrophic principle.
- **Title options:**
  - Current: "Indirect reciprocity with asymmetric reputational inertia".
  - From the deck: "Asymmetric inertia in social judgement sustains cooperation".
  - From the deck: "Private reputations sustain cooperation through asymmetric inertia".
  - A new option on the paper's question: "How reputations should change: asymmetric inertia sustains cooperation".

### Round 4 — Methods

- Every claim in the Results should have a Methods anchor, with the same notation.
- Remove passages that repeat the SI.
- Keep figure-specific numerical settings in one subsection.

### Round 5 — Figures and Extended Data

- Bring legends in line with the new terms.
- Number Extended Data in order of first citation.
- Check that Fig. 1 shows both features the Introduction names: separate path lengths and partial consequences.
- Use the same color and label conventions across figures.

### Round 6 — Supplementary Information and references

- Add the missing SI references: `SI-murase2023`, `SI-murase2024synchronization`, `SI-schmid2021`.
- Verify the numbers in Supplementary Table `tab:si-generous` (marked as new and not yet verified).
- Confirm Yamamoto et al. 2025, which has been checked against the abstract only.
- Keep the SI notes consistent with the Methods.

### Round 7 — Front matter, back matter and submission package

- Final author list and affiliations. The deck lists Wenqiang Zhu, Xin Wang\*, Xingru Chen, Ming Wei, Shaoting Tang\* and Christian Hilbe.
- Acknowledgements, author contributions, competing interests.
- Data and code availability: deposit the verified package with a DOI.
- Cover letter that states the question and the answer in one paragraph.
- Read-through by co-authors before submission.

## 5. Open issues that affect accuracy

1. The DISC–ALLC mixtures at α = 0.8 (Results 5 and Supplementary Table `tab:si-generous`) are not yet verified.
2. Our "no stable norm without inertia" statement must be reconciled with Fujimoto & Ohtsuki 2023.
3. "Look twice, forgive once" has the same reputation map as our simplest record with one warning state. Fig. 5a's text must reflect this, and the Discussion can use it to position our model as one that contains this aggregation rule as a special case.
4. Four citation keys are missing from `references.bib`.
5. The repository and DOI for data and code still need to be created.

## 6. Decisions needed before Round 1

1. Target journal: NHB (recommended) or PNAS.
2. Order of the Results: keep the current order (recommended, since it builds from reputations to cooperation), or lead with "where inertia is placed".
3. Retitle Results subsections 4 and 5 to echo the Introduction: yes or no.
4. Keep the general theory of reputation filters in the main Discussion, or move most of it to the SI (recommended).
5. Who reruns or checks the α = 0.8 mixture numbers.

## 7. How each round runs

1. Agree on a paragraph-level plan for the section.
2. Draft the section.
3. Check:
   - numbers against `verified/`;
   - citations against `references.bib`;
   - terms against Section 3;
   - word count against the target.
4. Commit and push to `claude/brave-brown-cm03v6`.
