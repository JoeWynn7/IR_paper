# Section 1 slides: Motivation and research gap

`../IR_motivation_section.pptx` is the PowerPoint version of the first section of the talk (version 4, 5 November 2026). It has eight slides. The argument is norm-neutral: it speaks of misjudgements (cooperators wrongly condemned, defectors wrongly excused) rather than of punishment only, and of asymmetry rather than direction.

| # | Slide | Content |
|---|---|---|
| 1 | Title | |
| 2 | Two ways to frame the work | A, "How should reputations change?", versus B, "Can reputations work without sharing information?", compared row by row (opening, problem, gap, approach, message) |
| 3 | Cooperation needs reputations that are accurate and shared | The two steps of reputation formation (judge, revise); public versus private information |
| 4 | Private assessment produces misjudgements | Mechanism of disagreement; wrongful condemnation versus wrongful excuse; which dominates depends on the norm |
| 5 | Two routes to robust reputations | Distortion = how often misjudgements occur × how much each one weighs; route 1 at step 1, route 2 at step 2; "Revising is the one lever every observer holds" |
| 6 | Two open problems | How should judgements change? Can reputations work without shared information? What makes both hard |
| 7 | Why these problems matter | A hidden assumption; the lever every observer holds; rules designed in practice; what our work provides |
| 8 | Here, we give reputations asymmetric inertia | Warning and recovery paths; depths (asymmetry) and strengths (partial consequences) |

Everything on the slides is native and editable, and each slide has speaker notes. The deck uses the same theme and layouts as the other section decks.

## Rebuild

```bash
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_motivation_pptx.js ../IR_motivation_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint. Earlier versions of this deck are in the git history.
