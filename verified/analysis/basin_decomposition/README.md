# Cooperative-basin size versus cooperation level

`basin_decomposition.py` reads the verified Figure 4 and Extended Data Figure 4 tables and writes:

| File | Content |
|---|---|
| `basin_decomposition_reference.csv` | $\bar\rho$, $\omega_C$ (with a conservative random-sampling standard error), $\bar\rho_C$, $\bar\rho_D$ for no inertia, one-step and selected multi-step inertia under each norm ($b/c=5$, 512 initial compositions). |
| `basin_decomposition_changes.csv` | Exact midpoint (two-factor Shapley) decomposition of the change in $\bar\rho$ between inertia conditions into a basin term, a cooperation-level term and a defective-class term. |
| `basin_decomposition_benefit_cost.csv` | The same decomposition at every $b/c$ of the ED4 scan. |

Definitions are given in `../../engine/analysis.py` and in §4 and §7 of `../../VERIFICATION_REPORT.md`. Run with `python basin_decomposition.py` from this folder.
