# Section 4 slides: Conclusion

`../IR_conclusion_section.pptx` is the PowerPoint version of the fourth section of the talk. It has seven slides, uses the same theme and layouts as the other section decks, and answers the two open problems posed in Section 1 (`../IR_motivation_section.pptx`).

| # | Slide | Content |
|---|---|---|
| 1 | Title | Motif: an asymmetric record (longer warning path than recovery path) |
| 2 | Back to the two open problems | How should judgements change? Can reputations work without shared information? Answers, and what made both hard |
| 3 | Four findings | One stat per main figure: 4 of 4 norms (Fig. 2), 8% → 71% (Fig. 3), 0 vs 0.87 (Fig. 4), α ∈ (0.57, 0.80] (Fig. 5) |
| 4 | A design principle: costly but not catastrophic | Probability of being seen as good after one negative assessment under overwrite (0), full tolerance (1) and partial consequences (0.8) |
| 5 | Take-home message | Statement slide |
| 6 | Implications and limitations | Norm comparisons, design of revision rules, testable predictions; mean-field closure, fixed architectures, one family of opportunists |
| 7 | Points for discussion | Framing and journal, misjudgement framing, figures, extensions |

Numbers come from the verified data:
- basins: `verified/analysis/basin_decomposition/basin_decomposition_reference.csv`;
- Scoring at total depth 2: `verified/figure4_ed6/data/figure4/total_depth_results.csv`;
- secure range and invasion window: the Fig. 5 legend and Results.

The bar values on slide 4 are exact: after one negative assessment, a good record moves to the first warning state, which is read as good with probability α.

Everything is native and editable, and each slide has speaker notes.

## Rebuild

```bash
NODE_PATH=<dir with pptxgenjs, react, react-dom, react-icons, sharp> \
PPTX_SKILL=<pptx skill dir> node make_conclusion_pptx.js ../IR_conclusion_section.pptx
```

Rebuilding overwrites manual edits made in PowerPoint.
