# Simplex numerical correction notes

This release changes the numerical reputation solver, not the model equations, parameters, all-good initialization, or marker colors. It does not reproduce hand-drawn basin shading.

## Solver and checks

The earlier code iterated the stationary self-consistency map synchronously for at most 1,000 iterations. The corrected code integrates `dr/dtau = R(phi)-r` from `(1,1,1)`, with RK4 continuation stages, and requires the true reputation RHS residual to be at most `1e-12`. Failed values cannot be used for plotting. The same 84 by 74 rectangular grid supplies 3,074 in-simplex points per condition.

All 61,480 plotted composition points pass this criterion. Twenty uniform-composition checks and one slowly relaxing SJ one-step point were also integrated independently with DOP853 from all-good initial conditions. Their maximum reputation difference from RK4 was `2.72e-9` at the independent check tolerance. The stationary response formula was checked against the source NumPy expression. See `validation/simplex_independent_checks.json`.

The slow SJ field point required 113,866 RK4 steps. A near-stationary intermediate value did not satisfy the criterion; continuous integration was extended until it reached the selected equilibrium. No Newton reputation root or unverified final iterate was substituted.

## Differences from the earlier field

The following comparison evaluates both numerical methods at identical strategy compositions. The legacy failure count uses the original synchronous-iteration criterion; it is not a count of failures in the corrected output. Vector changes are maximum componentwise differences in the three-strategy replicator RHS.

| Case | Legacy failed points / 3074 | Maximum vector change | Corrected isolated equilibria | Equilibrium segments |
|---|---:|---:|---:|---:|
| without_inertia_SC | 0 | 3.90611e-11 | 3 | 1 |
| without_inertia_SH | 0 | 1.40912e-12 | 3 | 0 |
| without_inertia_SJ | 0 | 1.30056e-12 | 3 | 0 |
| without_inertia_SS | 0 | 2.49734e-12 | 5 | 0 |
| one_step_SC | 0 | 7.04433e-10 | 4 | 0 |
| one_step_SH | 0 | 9.83446e-11 | 3 | 0 |
| one_step_SJ | 252 | 0.473232 | 3 | 0 |
| one_step_SS | 457 | 0.13098 | 4 | 0 |
| multi_step_SC | 0 | 3.38628e-11 | 4 | 0 |
| multi_step_SH | 0 | 9.07167e-10 | 3 | 0 |
| multi_step_SJ | 914 | 0.343926 | 4 | 0 |
| multi_step_SS | 504 | 0.135921 | 5 | 0 |
| tolerance_only_SC | 0 | 6.85072e-10 | 4 | 0 |
| tolerance_only_SH | 1 | 1.76944e-08 | 3 | 0 |
| tolerance_only_SJ | 143 | 0.0595724 | 4 | 0 |
| tolerance_only_SS | 303 | 0.0946951 | 4 | 0 |
| strictness_only_SC | 0 | 8.87684e-10 | 4 | 0 |
| strictness_only_SH | 0 | 6.5925e-13 | 3 | 0 |
| strictness_only_SJ | 189 | 0.0652656 | 3 | 0 |
| strictness_only_SS | 263 | 0.0703498 | 5 | 0 |

The cases with substantial field differences are mainly SJ and SS. Field failure counts refer only to the rectangular grid; equilibrium searches evaluate additional compositions and are checked separately, so marker counts can change even when a legacy field has no flagged grid points. The corrected arrows and equilibrium positions must be used as generated; matching the earlier image is not an acceptance criterion. `solver_comparison.csv` and each field NPZ retain the legacy and corrected arrays. `marker_count_comparison.csv` compares corrected records with the marker counts saved in the original notebook output; original marker coordinates were also extracted from the 20 saved source SVG panels. Their counts match the original notebook log, without rerunning the old equilibrium search. `legacy_marker_position_comparison.csv` records distances to corrected markers and identifies points belonging to the SC equilibrium segment.

## Equilibrium-set representation

In SC with instantaneous updating, the model has an equilibrium segment satisfying `f_DISC = c / [b (A_CG-A_DG)]`. The original root searches sampled multiple points from this set and could describe them as isolated roots. The revised figure uses a thin dashed gray segment and retains its two boundary endpoints as markers. `neutral_segment_endpoints.csv` and `neutral_set_diagnostics.csv` save the condition, endpoints, and 21 checks. Neutrality refers to the segment tangent: its transverse eigenvalue varies across the segment and is saved separately.

Edge markers retain the source convention: a filled edge circle indicates stability tangent to that invariant edge. It does not by itself establish stability against the missing third strategy. Both tangent and transverse diagnostics are saved in `equilibria.csv`. Interior root searches use log-ratio coordinates to keep trial compositions within the simplex, and accepted equilibria must also pass a strategy-RHS residual check.

Streamlines are rendered from the sampled equilibrated field, with each composition initialized independently at all-good reputations. They are not new full slow-fast trajectories, and no basin area or cooperation average was calculated.

## Files

- `Figure3_Simplex_Dynamics.ipynb`: self-contained model, corrected solver, data regeneration, and plotting. Default execution reads saved fields.
- `data/simplex_dynamics/*.npz`: fields, reputations, residuals, iteration counts, legacy comparisons, and equilibrium-segment endpoints.
- `equilibria.csv`: corrected equilibrium coordinates, cooperation readouts, residuals, eigenvalues, and marker classification.
- `solver_comparison.csv`: case-level numerical differences.
- `neutral_set_diagnostics.csv`: tangent and transverse diagnostics for the SC segment.

The 12 main panels and their composite are in `figures/figure3/`. The eight supplementary simplex panels and their composite are in `figures/ed3_simplex/`. Each figure is exported only as PDF and SVG.
