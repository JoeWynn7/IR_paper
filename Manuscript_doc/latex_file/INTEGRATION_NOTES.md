# Integration notes: Manuscript_full_20261103.tex

First complete LaTeX draft of *Indirect reciprocity with inertial reputation updating*. It combines the main text, Methods, Extended Data and Supplementary Information in one file. The compiled PDF is `Manuscript_full_20261103.pdf` (48 pages).

## Build

Run these from `Manuscript_doc/latex_file/`:

```
pdflatex Manuscript_full_20261103
bibtex   Manuscript_full_20261103
bibtex   SI
pdflatex Manuscript_full_20261103
pdflatex Manuscript_full_20261103
```

The second `bibtex` run builds the separate Supplementary reference list (`multibib`). Figures are read directly from `Manuscript_doc/` through `\graphicspath{{../}}`, so replacing `Manuscript_doc/Fig3.pdf` updates the manuscript. Draft notes print in dark red. To hide them, set `\draftnotesfalse` in the preamble.

## Sources and how they were used

| Part | Source | Treatment |
|---|---|---|
| Abstract | none | Temporary abstract written from the Results. To be revised. |
| Introduction | `Introduction_V2.docx` | Text kept. Two colons and one long sentence were split into full sentences. References 1–42 keep their original order. |
| Results | `Results_Outline.docx` | Paragraph outline turned into prose. Structure, claims and the four displayed equations are kept. Verified numbers were added (see below). |
| Discussion | none | Short provisional text (summary, positioning, trade-off, limitations). To be revised. |
| Methods | `Methods.pdf` | LaTeX rebuilt from the PDF. Duplicated material was removed (see below). |
| Figure and Extended Data legends | `Results_Outline.docx` | Kept, with the consistency fixes listed below. |
| Supplementary Information | `Supplementary_Information.pdf` | LaTeX rebuilt with content preserved. Only cross-references, spelling and a few sentence splits changed. |

## Results–Methods deduplication

- Eq. (1) is the ALLC/ALLD window, Eq. (2) is Λ(δ), Eq. (3) is Λ′(0) and Eq. (4) is the security criterion H_min ≥ c/b. These appear only in the Results. The Methods cite them instead of repeating the former displays (M14), (M16) and (M17).
- The conceptual description of Fig. 1 (paths, depths, readout strengths and their meaning) appears only in the Results. The Methods keep only the formal state space, transition rules and readout function. Interpretive sentences that repeated the Results were removed. The O-DISC definition in the Methods now refers back to the Results.
- Main-text equations are numbered (1)–(20) continuously. SI equations keep the (S1)–(S45) numbering of the SI PDF.

## Consistency fixes

1. **Extended Data numbering.** The figure files and `Results_Outline.docx` use ED6 = readout (tolerance only vs strictness only), ED7 = error planes and ED8 = depth plane. They also give ED2 panels e–h. `Methods.pdf` and `Supplementary_Information.pdf` used an older order (ED6 = errors, ED7 = depth, ED8 = readout, "ED2e"). All Methods and SI references now follow the figure files, including Supplementary Tables S2 and S11.
2. **Fig. 2 legend.** The outline said "black and red outlines". The figure marks one-step inertia (1,1) with a blue outline, so the legend now says black and blue.
3. **Notation.** The outline's h(α) became H_min, matching the Methods and SI. r\*_D and r\*_C became r\*_ALLD and r\*_ALLC. "Response function" became "reputation map". δ_C became δ_c. α_L, α_U, R_L and R_U now use upright subscripts throughout.
4. **ED Fig. 9 legend.** The outline said "filled if secure, open otherwise". All reference markers in the figure are identical white circles, so that clause was removed.
5. **ED Fig. 8 legend.** The outline said SS has high cooperation "in a strictness-weighted region". The panel shows high cooperation whenever k1 ≥ 1, with the highest values for strictness-weighted allocations, and the legend now says this.
6. **SI Proposition S6.** The SI described a "dashed line in Fig. 3a (top)". The sentence now refers to the Scoring panel of Fig. 3a without describing its graphics, because that panel will change.
7. **Spelling.** American spelling is used throughout, following the Introduction and Results outline.

## Numbers added to the Results

Each value below was checked against `verified/` or the SI tables.

- Basin sizes: one-step SH 7.8% and SJ 23.0%. Selected architectures: SC 88.3%, SH 70.5%, SJ 71.3% and SS 76.0% (`verified/analysis/basin_decomposition/basin_decomposition_reference.csv`).
- Mean cooperation without inertia → selected architecture: SC 0.61 → 0.87, SH 0 → 0.69, SJ 0 → 0.70, SS 0.54 → 0.74 (same file).
- Fig. 4 envelope under SC: 0.879 at K = 3, 0.888 at K = 5 and 0.875 at K = 8. At K = 8, (0,8) gives 0.000 (`verified/figure4_ed6/data/figure4/`).
- R_U values come from Supplementary Table S7. Δg and d̄ ranges come from Table S10. Secure intervals and r\*_R(0.8) come from Table S8. H(0) at α = 1 and α = 0.8 comes from SI Note 8.

## References

- `references.bib` holds the 42 Introduction references plus Hofbauer & Sigmund (1998) and Virtanen et al. (2020), which are cited in the Methods. Journal names use Nature-style abbreviations, and automatic abbreviation is switched off. DOIs are included only where the source list gave them. The PNAS article numbers were checked against the PDFs in `Refs/`.
- The SI cites copies of eight entries under `SI-` keys. This lets the SI list number from 1 without clashing with the main list. If you edit one of these entries, update its copy as well.

## Open items

- **Fig. 3a, Scoring panel.** Not final and to be replaced. The text describes Fig. 3a only qualitatively. Re-check the Fig. 3 legend and SI Proposition S6 after the update.
- **Abstract and Discussion** are temporary.
- **SI** needs further revision.
- **Data and code availability:** repository and DOI still needed.
- **Back matter:** acknowledgements, author contributions, competing interests and the full author list are placeholders.
- **Fig. 4 label to check.** The data give (0,1) at 0.554 as the best SS allocation at K = 1, ahead of (1,0) at 0.552. The figure labels (1,0). This is a near tie, but the label could be corrected.
