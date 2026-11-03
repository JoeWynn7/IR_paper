# Figure checks (3 November 2026)

## Fig. 4: envelope labels under Simple Standing

**Result: the verified data give (0,1) at K = 1. The manuscript figure is out of date and should be redrawn.**

`Manuscript_doc/Fig4.pdf` was drawn from the pre-verification data in `verified/figure4_ed6/data/previous_version/figure4/`. The verified data (`verified/figure4_ed6/data/figure4/total_depth_results.csv`) change the Simple Standing envelope at two depths.

| K | Allocation | Mean cooperation ρ̄ | Basin ω_C | Cooperation in basin |
|---|---|---|---|---|
| 1 | **(0,1)** | **0.5539** | 0.635 | 0.873 |
| 1 | (1,0) | 0.5522 | 0.564 | 0.978 |
| 6 | **(1,5)** | **0.7814** | 0.801 | 0.976 |
| 6 | (2,4) | 0.7807 | 0.797 | 0.980 |

- **Old labels.** In the pre-verification data (1,0) led at K = 1 (0.5523 against 0.5490), and (2,4) led at K = 6. The current figure shows exactly these labels.
- **Verified figure.** The notebook `verified/figure4_ed6/Figure4_Total_Depth.ipynb` selects the largest ρ̄ at each K, with ties going to the larger k1. Its output, `verified/figure4_ed6/figures/figure4/Figure4_combined.pdf`, already shows (0,1) and (1,5).
- **Other norms.** All SC, SH and SJ envelope labels are the same in both versions.
- **Size of the differences.** Both are small (0.0017 and 0.0007). The notebook notes that differences below about 0.01 are within the variation expected from 512 sampled initial compositions. At K = 1 the two allocations differ in kind: (0,1) has a larger basin but a much less cooperative attractor.
- **Recommendation.** Redraw Fig. 4 from the verified data. The text and legend do not rely on these two labels. The legend could state that envelope differences below about 0.01 are not rankings.

Checks of the other sampled-cooperation figures:
- **ED Fig. 2e–h** matches the verified data exactly, including the bar labels.
- **ED Fig. 8** matches the verified data. For example, cell SC (1,7) is tinted, consistent with the verified 0.086 and not the old value of 0.

## Fig. 3a: Scoring without inertia

**Recommendation: draw the set of equilibria as one line instead of a row of markers.**

Under Scoring with instantaneous updating, every composition with f_DISC = c/[b(ε − e2)] ≈ 0.2126 is an equilibrium (Supplementary Proposition on the line of equilibria). This is a continuum, not a set of isolated equilibria, so a row of filled and open circles suggests the wrong structure.

The line has two parts with different transverse stability. Off the line,

df_DISC/dt = (1 − e1) f_DISC [b f_DISC (ε − e2) − c] [f_ALLD r̄ − f_ALLC (1 − r̄)].

- **Attracting part:** where f_ALLC (1 − r̄) > f_ALLD r̄, closer to the ALLC–DISC edge.
- **Repelling part:** closer to the ALLD–DISC edge.
- **Switch point:** f_ALLC ≈ 0.266 at the reference parameters. Intended cooperation there equals r̄ ≈ 0.34.
- **Agreement with saved diagnostics:** the transverse eigenvalues in `verified/figure3_ed2-ed5_ed9/data/simplex_dynamics/neutral_set_diagnostics.csv` change sign at the same point.
- **Cooperation along the attracting part:** intended cooperation rises from 0.34 to 0.99 at the ALLC–DISC edge. The current label "98.96%" therefore describes only the endpoint.

Suggested drawing:
- one line, solid on the attracting part and dashed on the repelling part;
- a range label (for example "34–99%") instead of a single percentage;
- legend wording such as "Without inertia, SC has a line of equilibria (solid, attracting; dashed, repelling)".

The verified notebook already draws this set as a single dashed segment (`neutral_segment`). The only change needed is to split it at f_ALLC ≈ 0.266.

`Fig3a_SC_single_line_preview.png` shows this layout. It was made with `fig3a_sc_preview.py`, which uses the closed-form reputations of this case. Its shaded basin covers 62% of a triangular grid, against 63.5% in the verified Halton sample. The preview only illustrates the layout; it is not production artwork.
