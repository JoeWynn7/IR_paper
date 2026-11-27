# Introduction V4: polish and citation map

27 November 2026. Input: the author-supplied five-paragraph draft (about 1,040 words without citations, 30 distinct references). Output: `manuscript/Introduction_V4.tex`, a drop-in replacement for the Introduction block of `Manuscript_full .tex`. `Introduction_V3.tex` is untouched. V4 cites 49 distinct references, 19 more than the supplied draft.

## 1. Edits to the text (everything else is unchanged)

| Where | Change | Reason |
|---|---|---|
| ¶1 | "never interacted with them before" → "never interacted directly" | removes the they/them ambiguity |
| ¶1 | Citations split into "pairwise interactions" and "collective action" | each reference sits next to the claim it supports |
| ¶2 | Added "including the 'leading eight'" | names what the cited norm papers established; your brief asks for it |
| ¶2 | Example: "refusing to help a recipient may be considered justified by observers who regard the recipient as bad, but condemned by those who regard the recipient as good" | under private assessment, standing is observer-specific, so "an individual of bad standing" was imprecise |
| ¶3 | "Reputational errors depend … on how frequently individuals misjudge" → "The reputational damage caused by errors depends … on how often individuals misjudge" | the original was circular |
| ¶3 | "namely, how should we define goodness?" → "The former is the classical question of how goodness should be defined" | a question mark inside a sentence, followed by a citation |
| ¶3 | "our existing judgement" → "an observer's existing judgement"; "requires consideration" → "requires considering" | consistency |
| ¶4 | **New sentence:** models with unequal upward and downward moves (Tanabe) and unequal weighting of good and bad acts (Rankin & Eggimann) | your brief asks that gradual updating, asymmetry and judgement bias be acknowledged; it also pre-empts the obvious reviewer comment. Delete if you prefer |
| ¶5 | "updating of reputations" → "updating of private reputations" | your brief asks ¶5 to say that reputations are private |
| ¶5 | "total depth of inertia" → "total amount of inertia" | "depth" is not defined in the Introduction |
| ¶5 | "expand their basins" → "enlarge their basins"; "reveal" → "show"; "determines the conditions" → "thereby the conditions … can sustain" | avoids implying more than the model establishes |
| all | `~\cite` → `\cite` | the class loads `cite` with the superscript option, so a tilde leaves a gap before the number |

## 2. Citation map (bold = added in V4)

**¶1**

| Claim | Keys | What the source supports |
|---|---|---|
| mechanism | alexander1987, nowak1998, nowak2005 | as supplied |
| pairwise interactions | wedekind2000, leimar2001, schmid2021nhb | as supplied |
| collective action | milinski2002, yoeli2013, **panchanathan2004** | public-goods experiment; field experiment; indirect reciprocity can stabilize collective action (abstract) |
| two functions of reputation | **milinski2016, nowak2005** | reputation as social currency; review |

**¶2**

| Claim | Keys | What the source supports |
|---|---|---|
| norms identified | **brandt2004, pacheco2006**, ohtsuki2004, ohtsuki2006, santos2018, kessinger2023, murase2024computational | assessment and action rules; stern judging; leading eight |
| justified vs unjustified defection | **sugden1986, kandori1992**, leimar2001, panchanathan2003, **ohtsuki2006** | standing and community enforcement; leading eight |
| fail under private, noisy assessment | **okada2018, perret2021**, takahashi2006, uchida2010, hilbe2018, fujimoto2022, fujimoto2023 | PDF abstracts: stern judging and shunning have no cooperative stable point under private assessment (Okada); stable strategies disappear once errors are present (Perret) |
| same norm, different verdicts | hilbe2018, **radzvilavicius2019**, okada2020dilemmas | PDFs: the same rule and action can receive different verdicts (Hilbe); opinions differ and empathy reduces unjustified defection (Radzvilavicius); punishment dilemma (Okada) |
| errors propagate | hilbe2018, **uchida2013**, fujimoto2022 | PDF (Hilbe): disagreements can spread, depending on the norm; stern judging collapses under error and private information (Uchida, arXiv abstract) |
| norm-dependent distortion | okada2020dilemmas, **morsky2024**, fujimoto2023 | scoring and punishment dilemmas; "cooperators can end up punished and defectors rewarded" (PDF abstract); simple standing can be stable, stern judging cannot (PDF abstract) |
| two requirements | **michelmata2024**, murase2024synchronization | PDF abstracts: reputations must reflect behaviour and individuals must agree; stability depends on how correlated opinions are |

**¶3**

| Claim | Keys | What the source supports |
|---|---|---|
| changes in moral assessment | radzvilavicius2019, schmid2021, **okada2024** | empathy; generosity (results mixed, hence "sought to improve"); updating donors' and recipients' images |
| public institutions, gossip | radzvilavicius2021, kawakatsu2024 | as supplied |
| opinion synchronization | murase2024synchronization, **tham2026** | PDF abstract: dual updates help synchronize opinions |
| quantitative scores, records, aggregation | clark2020, schmid2023, michelmata2024 | as supplied |
| instantaneous binary updating | **ohtsuki2004, ohtsuki2006, hilbe2018** | binary models in which each assessment sets the new reputation |

**¶4**

| Claim | Keys | What the source supports |
|---|---|---|
| effect of a new assessment depends on the established reputation | **mendesiedlecki2013neural, pandula2024** | updating after evaluatively inconsistent behaviour (abstract); "a degree of bias towards believing previously held reputations can help sustain cooperation" (PDF abstract) |
| gradual revision | yamamoto2025 | see section 3, item 1 |
| positive and negative information weigh differently | **reeder1979, skowronski1989**, mendesiedlecki2013diagnostic, siegel2018 | dispositional attribution; negativity bias; diagnosticity; volatility of beliefs about bad people |
| precedents in the indirect-reciprocity literature | **tanabe2013, rankin2009** | PDF (Tanabe): separate upward and downward transition probabilities, with public reputations; abstract (Rankin & Eggimann): good and bad acts weighted unequally, and the bias evolves |
| norms that condemn conditional cooperators | **okada2020dilemmas** | scoring dilemma |
| norms that reward defectors | **schmid2021** | PDF abstract: assessment generosity "allows defectors to invade" |

## 3. To check before submission

1. **yamamoto2025.** "Individuals revise reputations gradually" is your statement, and I could only check it against the abstract and press coverage (three reputation levels, scenario experiment, reputations rise and fall step by step). The PMC and PLOS hosts are blocked from this environment. Please confirm against the full text.
2. **schmid2021 in ¶4** supports the narrower point that lenient assessment lets defectors invade. It does not show that Simple Standing assigns positive assessments to defectors. Keep it, replace it with `ohtsuki2004` plus a pointer to the Results, or drop it.
3. **Checked at abstract level, or from the standard literature only:** rankin2009, uchida2013, mendesiedlecki2013neural, yoeli2013, panchanathan2004, reeder1979, skowronski1989, sugden1986, kandori1992, brandt2004, pacheco2006. None is used for a number or a specific detail.
4. **Reference count.** If V4 replaces the current Introduction, the main-text list (Introduction, Results, Discussion, Methods) has 55 distinct references, against 46 now. Check this against the journal's guidance.
5. **Entries that change status.** `pires2025` is no longer cited in the main text, so its undefined-key problem disappears. `murase2022` is no longer cited. `iyengar2019` (Discussion) is still missing from the bib files; a draft entry is in `Introduction_V3_new_refs.bib`.
6. **"Stable" in ¶5** means stable within the replicator dynamics over ALLC, ALLD and DISC. Murase & Hilbe 2024 prove that no cooperative norm is evolutionarily stable when private opinions are independent, so keep the Results and Discussion wording that reconciles the two.

## 4. Optional additions I left out

- The institutional analogies from V2 and the manuscript (graduated sanctions, criminal records: `ostrom1990`, `cox2010`, `blumstein2009`), because your draft omits them. One sentence at the end of ¶4 would restore them, for example: "Institutions show a similar logic: graduated sanctions escalate with repeated violations\cite{ostrom1990,cox2010}, and a criminal record loses its relevance only after years without a further offence\cite{blumstein2009}."
- Naming the four norms in ¶4 or ¶5 (Scoring, Shunning, Stern Judging, Simple Standing), which would make the "norm-specific" claims concrete for readers outside the field.
