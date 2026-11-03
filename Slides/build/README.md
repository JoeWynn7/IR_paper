# Slide build pipeline

The Beamer deck (`../IR_Hilbe_slides.tex`) and the PowerPoint deck (`../IR_Hilbe_slides.pptx`) are generated from one content file, `deck_spec.py`. Both decks share the same slides, wording, equations and figures. After generation, either file can be edited directly. Regenerating overwrites manual edits.

| File | Role |
|---|---|
| `deck_spec.py` | Slide content: text with inline markup (`$math$`, `**bold**`, `!!accent!!`) and display equations. |
| `markup.py` | Converts markup to LaTeX for Beamer, or to styled text runs for PowerPoint. |
| `make_reputation_map.py` | Plots the reputation map R(u) for SJ architectures into `../figures/reputation_map.pdf`. |
| `make_beamer.py` | Writes `../IR_Hilbe_slides.tex` (metropolis theme, 16:9). |
| `make_assets.py` | Prepares the PowerPoint assets: figure PNGs, equation images rendered at the Beamer font size, native Office Math (OMML) from pandoc, and `deck.json`. |
| `make_pptx.js` | Builds the PowerPoint deck with `pptxgenjs`. The deck uses a theme, named layouts and sections. |
| `inject_omml.py` | Wraps every equation picture in an editable Office Math object (the picture stays as fallback). It also removes surplus paragraph properties written by `pptxgenjs`. |

## Regenerate

```bash
cd Slides/build
python3 make_reputation_map.py /tmp/slide_assets/png
python3 make_beamer.py
cd .. && latexmk -pdf IR_Hilbe_slides.tex && cd build
python3 make_assets.py /tmp/slide_assets
PPTX_SKILL=<pptx skill dir> NODE_PATH=<dir with node_modules/pptxgenjs> node make_pptx.js /tmp/slide_assets /tmp/raw.pptx
python3 inject_omml.py /tmp/slide_assets /tmp/raw.pptx ../IR_Hilbe_slides.pptx
```

Requirements: TeX Live (metropolis, natbib), pandoc, poppler (`pdftoppm`, `pdftocairo`), Python with matplotlib, and Node with `pptxgenjs`. `apply_theme.js` comes from the pptx skill used to build the deck.

## Notes

- **Figures.** Figures come from `../../Manuscript_doc/`. Fig. 4 is the exception: it uses `../figures/Fig4_verified.pdf`, which is the verified-data rendering with the correct SS envelope labels.
- **Equations in PowerPoint.** Equations are native Office Math objects, editable in PowerPoint 2010 or later. Viewers without Office Math support, such as LibreOffice, show the fallback image. Each image's alt text holds the LaTeX source of its equation.
