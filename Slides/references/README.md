# References slides

`../IR_references_section.pptx` lists every work cited in the five section decks: 27 references in alphabetical order, on three slides after a title slide. Each entry shows the short citation used on the slides (in orange) above the full reference in Nature style.

- `build_refs.py` holds the list of cited works (short citation → bib key) and formats them from `Manuscript_doc/latex_file/references.bib`.
- `make_references_pptx.js` lays the entries out in two columns per slide, balanced by estimated height.

Two papers by Murase & Hilbe (2024) are cited, so they are labelled 2024a (computational evolution of social norms) and 2024b (opinion synchronization). The Section 1 deck uses the same labels.

When a section deck cites a new work, add it to `CITED` in `build_refs.py` and rebuild:

```bash
python3 build_refs.py <refs.json>
NODE_PATH=<dir with pptxgenjs> PPTX_SKILL=<pptx skill dir> \
node make_references_pptx.js <refs.json> ../IR_references_section.pptx
```
