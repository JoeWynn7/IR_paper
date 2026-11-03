# Integration notes: Manuscript_full_20261103.tex (revision 2)

This is the complete LaTeX manuscript: main text, Methods, Extended Data and Supplementary Information in one file. The compiled PDF is `Manuscript_full_20261103.pdf` (about 41 pages). The Overleaf package is `Manuscript_doc/IR_manuscript_overleaf_20261103.zip`.

## Build

- **Overleaf:** upload the ZIP. It compiles as is, because latexmk runs BibTeX for both reference lists automatically.
- **Locally:** run `latexmk -pdf Manuscript_full_20261103`. The manual sequence is pdflatex, then `bibtex Manuscript_full_20261103`, then `bibtex SI`, then pdflatex twice.
- **Figures:** the file looks for them in `figures/` (the Overleaf package) and in `../` (this repository). Replacing a PDF in `Manuscript_doc/` therefore updates the repository build.
- **Draft notes** print in dark red. Set `\draftnotesfalse` to hide them.

## Changes in revision 2

### Abstract

Rewritten after the pattern of recent abstracts by Hilbe and co-authors (Murase & Hilbe 2024 PNAS; Tham, Hilbe & Murase 2026 PNAS; Schmid et al. 2023 Nat. Commun.). It runs: context, then the gap (private assessment and overwrite updating), then "Here we introduce", then the main results in order of importance, then the opportunism trade-off and its remedy, then the broader implication. It is 195 words. For a 150-word limit, the sentence on public reputations and the last sentence can be shortened first.

### Main text

- **Terminology.** "Readout" is replaced throughout. Records are now "interpreted" as good or bad images, and α and β are always called the tolerance strength and the strictness strength. Examples:
  - "full readout" became "α = β = 1";
  - "secure readout intervals" became "secure intervals of tolerance strength";
  - "readout plane" became "(α, β) plane".

  The Introduction already used "evidence interpretation", so the new wording matches it. LaTeX labels such as `ed:readout` are unchanged.
- **Citations** now come before the final punctuation everywhere: "…opportunities\cite{…}." (the `nomove` option of the `cite` package keeps them there). Sentences that ended in "et al." were rephrased so that no period appears twice.
- **Results.**
  - The prose was tightened, with clearer transitions between paragraphs.
  - Specific numbers were reduced to those the argument needs: the selection criteria and architectures, the basin sizes (70–88% against 8% and 23%), R_U ≈ 4 under SS, the SJ window 0 < δ < 0.365, the secure range from about 0.57 to 0.80, and α = 0.8.
  - Detailed values moved to the SI. A new Supplementary Table lists basin sizes and mean cooperation.
  - Robustness results (ED Figs. 2e–h and 5–7) are condensed into one paragraph.
  - A two-sentence closing paragraph links the Results to the Discussion.
- **Discussion** expanded to about 900 words. It covers:
  1. evidence dynamics as a second design dimension next to norms;
  2. why the beneficial direction depends on the norm, and what this implies for norm studies;
  3. agreement versus discrimination, and how inertia complements opinion synchronization;
  4. the value of information and diminishing returns of memory;
  5. the tolerance–accountability trade-off and its consequences for invasion analyses;
  6. institutional parallels (graduated sanctions) and testable predictions for impression formation;
  7. limitations, which absorb the former SI note "Scope and limitations";
  8. a concluding statement.
- **Figure layout.** Float parameters were relaxed, figures are placed at page tops (`[!t]`) and slightly reduced (Fig. 1 at 60%, Figs. 2, 3 and 5 at 90%, Fig. 4 at 85% of the text width), and legends use a small font. Main figures now share pages with text.

### Supplementary Information (restructured, about 16 pages instead of 22)

| New note | Contents | Former notes |
|---|---|---|
| 1 Model and theoretical framework | 1.1 interactions, norms and errors; 1.2 inertial record (incl. reference parameters); 1.3 stationary reputation map; 1.4 private reputations in the population; 1.5 strategy dynamics and cooperation | 1 (conventions), 2, 3, 4, 5, 6 |
| 2 Invasion of a discriminator population | 2.1 rare mutants; 2.2 unconditional mutants; 2.3 opportunistic discriminators and secure tolerance strengths; 2.4 alternative reputation filters | 7, 8, 9 |
| 3 Finite-population reputation simulations | event algorithm, estimators, runs, selection | 10 |
| 4 Numerical methods | — | 11 |
| 5 Notation | symbol table (moved from the front to the end, as a reference) | 1 |

- **Removed:** "Figure-by-figure settings" and "Scope and limitations". The key limitations are now in the Discussion.
- **No duplicate formulas.** The SI cites formulas already displayed in the main text or Methods instead of displaying them again. These are the window (Eq. 1), Λ(δ), Λ′(0), the security criterion, the self-consistency and relaxation equations, the replicator equation and the recognition statistics.
- **New SI content:**
  - transverse stability of the line of equilibria for SC without inertia (attracting where f_ALLC (1 − r̄) > f_ALLD r̄, switch at f_ALLC ≈ 0.266);
  - a table of basin sizes and mean cooperation, taken from `verified/analysis/basin_decomposition/`.

### Figure checks

Details are in `Manuscript_doc/figure_checks/README.md`.

- **Fig. 4 is out of date.** `Manuscript_doc/Fig4.pdf` was drawn from the pre-verification data. The verified data give **(0,1) = 0.5539 against (1,0) = 0.5522 at K = 1** and **(1,5) = 0.7814 against (2,4) = 0.7807 at K = 6** under SS. The verified notebook output already shows the correct labels. A draft note in the Fig. 4 legend flags this.
- **Fig. 3a (SC).** Recommendation: draw a single line of equilibria, solid where it attracts and dashed where it repels, with a range label (34–99%). A preview is in `figure_checks/`.
- **ED Figs. 2 and 8** match the verified data.

## Earlier decisions (revision 1, still valid)

- **Extended Data numbering** follows the figure files: ED6 = tolerance only vs strictness only, ED7 = error planes, ED8 = depth plane, and ED2 has panels e–h.
- **Fig. 2 legend:** black and blue outlines (not red).
- **ED Fig. 9 legend:** the "filled/open" marker clause was removed.
- **Equations (1)–(4)** appear only in the Results and are cited from the Methods. The conceptual description of Fig. 1 appears only in the Results.
- **Reference keys.** `references.bib` contains the 42 Introduction references plus Hofbauer & Sigmund (1998) and Virtanen et al. (2020). The SI cites duplicate entries with `SI-` keys, so that its reference list numbers from 1. If you edit one of these entries, edit its copy as well.

## Open items

- Redraw Fig. 4 from the verified data, and the SC panel of Fig. 3a.
- Abstract and Discussion: further revision as planned.
- Data and code availability: repository and DOI.
- Back matter: acknowledgements, author contributions, competing interests and the full author list.
