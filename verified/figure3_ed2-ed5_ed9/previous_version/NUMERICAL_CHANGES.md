# Numerical changes and verification scope

This release preserves the direct-reset model, private-assessment closure, payoffs, and parameters. The changes below address numerical equilibration and equilibrium representation. Original research files remain unchanged.

## 1. Simplex reputation solver

The earlier simplex code used a synchronous iteration of the reputation moments and could return its last iterate when the iteration limit was reached. The corrected code integrates the continuous auxiliary reputation equations

$$
\frac{\mathrm d r_I}{\mathrm d\tau}
=\mathcal R\!\left(\varphi_I(\boldsymbol r,\boldsymbol f)\right)-r_I
$$

from all-good reputations at every strategy composition. These equations share the stationary self-consistency relation with the earlier iteration, but their dynamical convergence properties differ.

The original 84-by-74 rectangular plotting grid is retained, giving 3,074 valid compositions per panel. All 20 settings were calculated, for 61,480 field points. Every corrected field point satisfies a true reputation RHS residual of at most $10^{-12}$. Equilibrium records also contain reputation and strategy residuals.

On this same grid, 3,026 earlier moment iterations did not pass their own stopping criterion. The largest corrected-versus-earlier change in a replicator-vector component is approximately 0.4732. Some direction fields change materially. These differences must not be described as cosmetic changes or assumed to preserve the earlier basin interpretation.

One SJ full-one-step grid point exhibits very slow passage near a stationary-branch bottleneck. Continuous integration was extended along the same trajectory until it reached its attracting solution. A Newton solve near the slowly moving state was not accepted as a substitute for the all-good trajectory. No unconverged terminal value is used in a plotted field.

The full pointwise record is in the 20 NPZ files under [data/simplex_dynamics/](data/simplex_dynamics/). Each includes corrected and earlier reputations, vector fields, convergence diagnostics, and residuals. The compact comparison is [solver_comparison.csv](data/simplex_dynamics/solver_comparison.csv).

### Equilibrium markers and the continuous SC set

The equilibrium marker colors retain the source scheme: gray without inertia, blue for one-step settings, and orange for selected multi-step settings. Filled markers on an invariant edge describe stability along that edge. They do not by themselves establish stability against the missing third strategy. Eigenvalues and separate stability fields are saved in [equilibria.csv](data/simplex_dynamics/equilibria.csv).

For SC with instantaneous updating, the model has a continuous equilibrium segment. Let $A_{\mathrm{CG}}$ and $A_{\mathrm{DG}}$ denote the effective positive-assessment probabilities for intended cooperation and defection. On

$$
f_{\mathrm{DISC}}=\frac{c}{b(A_{\mathrm{CG}}-A_{\mathrm{DG}})},
$$

the three strategy payoffs coincide. At the reference parameters this gives $f_{\mathrm{DISC}}\approx0.212585$. Multiple root-search seeds on this set should not be presented as distinct isolated interior equilibria. The corrected plot uses a thin dashed segment. Neutrality refers to movement along the set; transverse stability is a separate question. This is a correction to the numerical representation of the same equations, without manually added shading.

## 2. ED3 invasion-plane repairs

The original complete table contains $4\times801^2=2,566,404$ parameter points. Direct inspection found 181 entries with a failed reputation-convergence flag:

| Norm | Failed entries | Changed invasion classifications after repair |
|---|---:|---:|
| SC | 144 | 1 |
| SH | 15 | 2 |
| SJ | 22 | 4 |
| SS | 0 | 0 |
| Total | 181 | 7 |

At one-step depth, the all-DISC assessment input is quadratic in resident reputation and the reputation response is rational. The scalar self-consistency equation can therefore be expressed as a polynomial of degree at most six. Real roots were refined and checked against the original reputation equation; the attracting root corresponding to the all-good scalar branch was selected. All dependent reputations, invasion payoff differences, protection flags, residuals, and convergence flags were updated at the repaired entries.

The repaired residuals are at most $1.72\times10^{-15}$. Eleven independent continuous integrations from all-good reputation, including every point whose invasion class changed and additional slow or large-change examples, check branch selection. Their resident reputations agree with the polynomial solutions to within $4.12\times10^{-9}$, with ODE residuals approximately $10^{-12}$.

The largest resident-reputation correction is approximately 0.956; the largest ALLD invasion-payoff correction is approximately 4.28. Some earlier trajectories lingered near a branch bottleneck. These are substantive numerical corrections rather than rounding adjustments.

All original entries outside the 181 failed points are retained. Their original accepted tolerance gives a maximum residual of approximately $10^{-10}$ for the current complete supplied grids. The public regeneration path uses its stated $10^{-11}$ relaxation tolerance and invokes the residual-checked polynomial fallback when relaxation fails.

Old and new values for all repaired fields are saved in [invasion_repairs.csv](data/extended_data_figure3_planes/invasion_repairs.csv). The branch checks are in [repair_ode_checks.csv](data/extended_data_figure3_planes/repair_ode_checks.csv). The four NPZ grids retain all numerical fields at float64 or the corresponding integer precision. The repairs can be reversed using the saved old rows; the original CSV was not edited.

## 3. Data retained or recomputed elsewhere

- **ED2:** existing stationary-root and parameter-plane tables were retained. Drift curves were saved for plotting. These are auxiliary stationary-reputation calculations, not a new validation of full internal-state transients across the entire plane.
- **ED3 cooperation:** the supplied dense41 table has 6,724 rows and all saved observable-stability gates pass. Its realized-cooperation values were retained. The exact final upstream computation entry point remains unidentified; no earlier script is passed off as a verified exact generator.
- **ED4:** the 4,320 existing records and 12 local-invasion threshold records were retained. The 540 mean/standard-error summaries were recalculated from the eight independent initial-condition sample means. Full trajectory integrations were not repeated.
- **ED5:** all twelve 241-by-241 error grids were newly calculated using the source all-good RK4 equations, time step 0.18, maximum 120,000 steps, and residual tolerance $10^{-9}$. All 696,972 resident solves passed. Numerical fields that previously existed only during execution are now saved in NPZ files.

## 4. Limits of verification

The five notebooks are intended to reproduce the supplied numerical panels from external files with relative paths. Their default execution, array integrity, export formats, and visual layouts are checked. Expensive full ED2 planes, the entire ED3 cooperation scan, all 801-point invasion grids, and the ED4 trajectory ensemble were not recalculated in this release.

Solver convergence, local equilibrium stability, basin-weighted cooperation, and immunity to particular mutant strategies are separate properties. None of the numerical checks should be substituted for a broader evolutionary-stability claim. Earlier hand-drawn simplex shading is omitted and is not revalidated by this release.
