# Section 1 slides: Motivation and research gap

`../IR_motivation_section.pptx` is the PowerPoint version of the first section of the talk (version 3, 5 November 2026). It has eight slides. It follows `Manuscript_doc/intro_revisions/final/`, which holds the final Storylines 1 and 3 and the framework of two routes out of the punishment dilemma. On the slides, Storyline 1 is called **A** and Storyline 3 is called **B**.

| # | Slide | Content |
|---|---|---|
| 1 | Title | |
| 2 | Two ways to frame the work | Storylines A and B row by row: opening, problem, gap, approach, message |
| 3 | Cooperation needs reputations that are accurate and shared | The two steps of reputation formation (judge, revise); public versus private information |
| 4 | The punishment dilemma | The three-step cascade; punishing protects cooperation but risks the punisher's standing |
| 5 | Two routes out of the dilemma | Loss of standing = how often one is condemned × how much each condemnation weighs; route 1 at step 1, route 2 at step 2 |
| 6 | Open problem: how should judgements be revised? | Models use one symmetric rule; societies revise asymmetrically and gradually; two open questions |
| 7 | Why the open problem matters | A hidden assumption, an unavoidable trade-off, open to every observer; what our work provides |
| 8 | Here, we give judgements inertia | Warning and recovery paths; depths (direction) and strengths (partial consequences) |

Everything on the slides is native and editable, and each slide has speaker notes. The deck uses the same theme and layouts as the other section decks.

## Rebuild

```bash
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_motivation_pptx.js ../IR_motivation_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint. Earlier versions of this deck are in the git history.
