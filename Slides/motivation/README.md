# Section 1 slides: Motivation and research gap

`../IR_motivation_section.pptx` is the final PowerPoint version of the first section of the talk. It has nine slides, and its storyline follows `Manuscript_doc/intro_revisions/Introduction_final.tex`.

| # | Slide | Introduction paragraph |
|---|---|---|
| 1 | Title | |
| 2 | Reputation sustains cooperation among strangers | 1 |
| 3 | Private reputations must be both accurate and shared | 1 |
| 4 | Overwrite updating turns single errors into cascades | 2 |
| 5 | Existing remedies share a tacit symmetry | 2 |
| 6 | Institutions separate losing from regaining standing | 3 |
| 7 | Relaxing the symmetry raises two questions | 3 |
| 8 | Research gap | 3 |
| 9 | Here, we give reputations inertia | 4 |

Everything on the slides is native and editable: text boxes, shapes, arrows and the theme colors. Each slide has speaker notes taken from the Introduction. The deck uses a theme, named layouts and one section, so colors and fonts can be changed in one place (Design > Variants).

## Rebuild

```bash
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_motivation_pptx.js ../IR_motivation_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint.
