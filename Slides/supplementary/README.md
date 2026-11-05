# Section 5 slides: Supplementary results

`../IR_supplementary_section.pptx` is the PowerPoint version of the fifth section of the talk, shown after the conclusion. It has 11 slides and uses the same theme and layouts as the other section decks.

| # | Slide | Supports |
|---|---|---|
| 1 | Title | |
| 2 | Nine supplementary results (overview) | |
| 3 | Selection is robust to the thresholds (ED Fig. 1) | Fig. 2 |
| 4 | Directional inertia removes history dependence (ED Fig. 2) | Fig. 3 |
| 5 | Depths and strengths jointly set reputation states (ED Fig. 3) | Fig. 2 |
| 6 | Rare discriminators no longer lose reputation abruptly (ED Fig. 4) | Fig. 3 |
| 7 | The advantage holds across benefit-to-cost ratios (ED Fig. 5) | Fig. 3 |
| 8 | Tolerance and strictness are not interchangeable (ED Fig. 6) | Fig. 3 |
| 9 | Directional inertia protects DISC across error rates (ED Fig. 7) | Fig. 3 |
| 10 | High cooperation and local protection differ (ED Fig. 8) | Fig. 4 |
| 11 | Protective tolerance strengths exist for every norm (ED Fig. 9) | Fig. 5 |

- **Texts.** Captions are shortened Extended Data legends. Key messages follow `Manuscript_doc/intro_revisions/Framing_and_results_text.md`, adjusted to the legends. Each slide has speaker notes taken from the legends and the Results.
- **Figures** come from `Manuscript_doc/ED_Fig1.pdf` to `ED_Fig9.pdf`, the files the manuscript uses.

## Rebuild

```bash
python3 build_assets.py <asset_dir> make_supplementary_pptx.js
NODE_PATH=<dir with pptxgenjs> PPTX_SKILL=<pptx skill dir> \
node make_supplementary_pptx.js <asset_dir> ../IR_supplementary_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint.
