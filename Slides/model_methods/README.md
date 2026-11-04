# Section 2 slides: Model and methods

`../IR_model_methods_section.pptx` is the PowerPoint version of the second section of the talk. It has 12 slides and follows the Results (first subsection) and the Methods of `Manuscript_doc/latex_file/Manuscript_full_20261103.tex`. It uses the same theme and layouts as the Section 1 deck (`../IR_motivation_section.pptx`).

| # | Slide | Manuscript source |
|---|---|---|
| 1 | Title | |
| 2 | Donation game with private assessment | Methods, donation game; Eq. for the assessment probabilities |
| 3 | Inertial reputation updating | Results, first subsection; Fig. 1; image probabilities |
| 4 | Two levels of analysis | Methods, simulations and strategy evolution |
| 5 | Recognition and agreement select the architectures | Results, reputation dynamics; Methods, simulations |
| 6 | Deriving the stationary reputation map | Methods, stationary reputation map |
| 7 | Properties of the reputation map | Methods, stationary reputation map |
| 8 | From single records to population reputations | Methods, self-consistent private reputations |
| 9 | Strategy evolution and cooperation | Methods, strategy evolution and cooperation |
| 10 | Local stability against rare unconditional mutants | Results, Eq. (window); Methods, invasion |
| 11 | Opportunistic discriminators (O-DISC) | Results, opportunism; Methods, invasion |
| 12 | From methods to results | |

- **Equations** are native Office Math objects, editable in PowerPoint 2010 or later. Viewers without Office Math, such as LibreOffice or some previewers, show a picture of the same equation instead. Each picture's alt text holds the LaTeX source.
- **Text, tables and diagrams** are native and editable. Each slide has speaker notes.
- **Figures.** Fig. 1 comes from `Manuscript_doc/Fig1_model.pdf` and the reputation map from `../figures/reputation_map.pdf`. The chord sketch on slide 10 is a schematic drawn by `build_assets.py`; its points are chosen for visibility. The dots in the simplex on slide 9 only show how initial compositions are spread.

## Rebuild

```bash
python3 build_assets.py <asset_dir> make_model_pptx.js
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_model_pptx.js <asset_dir> <raw.pptx>
python3 inject_omml.py <asset_dir> <raw.pptx> ../IR_model_methods_section.pptx
```

`build_assets.py` renders the equations (pdfLaTeX and pandoc), the figures and the styled text runs for every M`...` string in the deck script. It reuses `../build/markup.py`. Rebuilding overwrites manual edits made in PowerPoint.
