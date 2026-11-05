# Section 1 slides: Motivation and research gap

`../IR_motivation_section.pptx` is the PowerPoint version of the first section of the talk (version 2, 5 November 2026). It has seven slides. It follows `Manuscript_doc/intro_revisions/final/`, which holds the final Storylines 1 and 3 and the framework of two routes out of the punishment dilemma.

| # | Slide | Content |
|---|---|---|
| 1 | Title | |
| 2 | Cooperation needs reputations that are accurate and shared | The two steps of reputation formation (judge, revise); public versus private information |
| 3 | The punishment dilemma | The three-step cascade; punishing protects cooperation but risks the punisher's standing |
| 4 | Two routes out of the dilemma | Harm = how often disputed judgements occur × how much each changes a reputation; route 1 at step 1, route 2 at step 2; costly but not catastrophic |
| 5 | Open problem: how should judgements be revised? | Models use one symmetric rule; societies revise asymmetrically and gradually |
| 6 | Two ways to tell the story | Storyline 1 and Storyline 3 side by side, for the choice of framing |
| 7 | Here, we give judgements inertia | Warning and recovery paths; depths (direction) and strengths (partial consequences) |

Everything on the slides is native and editable, and each slide has speaker notes. The deck uses the same theme and layouts as the other section decks.

## Rebuild

```bash
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_motivation_pptx.js ../IR_motivation_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint. The first version of this deck (nine slides) is in the git history.
