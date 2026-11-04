# Section 3 slides: Main results

`../IR_main_results_section.pptx` is the PowerPoint version of the third section of the talk. It has nine slides and uses the same theme and layouts as the Section 1 and Section 2 decks.

| # | Slide | Content |
|---|---|---|
| 1 | Title | |
| 2 | Four results | The four headlines, one per main figure |
| 3 | Where inertia sits decides reputation quality | Fig. 2 |
| 4 | Cooperation becomes stable and easy to reach | Fig. 3 |
| 5 | Selected architectures enlarge the cooperative basin | Native bar chart of basin sizes |
| 6 | Allocation matters more than the amount of memory | Fig. 4 (verified-data rendering) |
| 7 | Forgiveness can shelter opportunists | Fig. 5a |
| 8 | Partial consequences restore deterrence | Fig. 5b |
| 9 | Results at a glance | Native summary table per norm |

- **Texts.** Headlines and key messages follow `Manuscript_doc/intro_revisions/Framing_and_results_text.md`. Captions are shortened figure legends. Each slide has speaker notes taken from the Results.
- **Data.** The chart on slide 5 and the basin and cooperation values on slide 9 are read from `verified/analysis/basin_decomposition/basin_decomposition_reference.csv`. The O-DISC column on slide 9 follows the Results text (all four selected architectures resist the O-DISC family at α = 0.8, Extended Data Fig. 9).
- **Figures.** Figs. 2, 3 and 5 come from `Manuscript_doc/`. Fig. 4 comes from `../figures/Fig4_verified.pdf`. Fig. 5 is split into panels a and b by `build_assets.py`. The Scoring panel in Fig. 3a is still the draft version.

## Rebuild

```bash
python3 build_assets.py <asset_dir> make_results_pptx.js
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_results_pptx.js <asset_dir> ../IR_main_results_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint.
