# Results guide: Figure 3 and Extended Data Figures 2-5

This document describes the current notebook outputs and provides a short interpretation for continuing the research in a new conversation. It is a results guide, not a manuscript draft. Numerical values refer to the supplied data, including the documented reputation-solver corrections. No additional dynamical experiments or statistical tests were performed to write this guide.

## 1. Research question and figure map

These results ask how directional reputation inertia affects stationary reputations, evolutionary strategy dynamics, cooperation across initial strategy compositions, and resistance to rare unconditional strategies. They extend the recognition analysis in Figure 2 and ED1, but recognition, cooperation, and evolutionary stability remain different measurements.

| Figure or block | Question | Notebook and combined output |
|---|---|---|
| Figure 3: 12 simplexes | How do the equilibrated strategy fields differ without inertia, with full one-step inertia, and with selected multi-step inertia? | [Figure3_Simplex_Dynamics.ipynb](Figure3_Simplex_Dynamics.ipynb); [combined figure](figures/figure3/Figure3_combined.pdf) |
| ED2: 12 panels | Which homogeneous DISC reputation branches exist, and where is the auxiliary reputation problem bistable? | [Extended_Data_Figure2.ipynb](Extended_Data_Figure2.ipynb); [combined figure](figures/extended_data_figure2/Extended_Data_Figure2_combined.pdf) |
| ED3, first two rows: eight simplexes | What changes when only tolerance or only strictness is expressed through the one-step readout? | [Figure3_Simplex_Dynamics.ipynb](Figure3_Simplex_Dynamics.ipynb); [combined block](figures/ed3_simplex/ED3_simplex_combined.pdf) |
| ED3, third and fourth rows: eight planes | How do average cooperation and local invasion resistance depend on the two readout parameters? | [Extended_Data_Figure3_Planes.ipynb](Extended_Data_Figure3_Planes.ipynb); [combined block](figures/extended_data_figure3_planes/Extended_Data_Figure3_planes_combined.pdf) |
| ED4: four panels | How does sampled long-time cooperation vary with the benefit-to-cost ratio, and how does this relate to pure-DISC invasion thresholds? | [Extended_Data_Figure4.ipynb](Extended_Data_Figure4.ipynb); [combined figure](figures/extended_data_figure4/Extended_Data_Figure4_combined.pdf) |
| ED5: 12 panels | Over which implementation- and assessment-error combinations does a pure-DISC resident resist rare ALLD and ALLC? | [Extended_Data_Figure5.ipynb](Extended_Data_Figure5.ipynb); [combined figure](figures/extended_data_figure5/Extended_Data_Figure5_combined.pdf) |

Columns consistently follow Scoring (SC), Shunning (SH), Stern Judging (SJ), and Simple Standing (SS). ED3 is supplied as two separate blocks; references below use the block, row, and norm rather than assuming a finalized four-row panel-letter scheme. All 56 individual panels and six composites have PDF and SVG versions.

## 2. Model and quantities needed to read these results

### Strategies, private assessment, and inertia

ALLC always intends to cooperate, ALLD always defects, and DISC intends to cooperate with recipients it privately regards as good. Intended cooperation fails with probability $e_1$; the prescribed assessment is reversed with probability $e_2$. The four norms approve cooperation with a good recipient and disapprove defection against a good recipient. Their approval rules toward a bad recipient are:

| Norm | Cooperation with bad | Defection against bad |
|---|---:|---:|
| SC | 1 | 0 |
| SH | 0 | 0 |
| SJ | 0 | 1 |
| SS | 1 | 1 |

An observer evaluates the realized action using its own image of the recipient. The theoretical calculations use conditional independence of donor and observer images given recipient strategy; they do not track a finite population's full private reputation matrix.

The internal record has good and bad states, $k_1$ warning states, and $k_2$ recovery states. Losing established good standing requires $k_1+1$ consecutive negative assessments; recovery requires $k_2+1$ consecutive positive assessments. A positive assessment resets any warning state directly to good, and a negative assessment resets any recovery state directly to bad. Good-readout probabilities in warning and recovery states are $\alpha^m$ and $1-\beta^n$, respectively.

Let $\mathcal R(u)$ denote stationary good-readout probability under independent positive assessments with probability $u$. The notebooks implement it in `reputation_transform`. Instantaneous updating gives $\mathcal R(u)=u$. For one-step internal depths,

$$
\mathcal R(u)=
\frac{u^2[1+\alpha(1-u)]+u(1-u)^2(1-\beta)}{1-u+u^2}.
$$

Unless varied on an axis, $b=5$, $c=1$, and $e_1=e_2=0.02$. Reputation branch selection starts from good reputations. The following settings recur:

| Setting | Depths | Readout |
|---|---|---|
| Without inertia | $(1,1)$ in the simplex code; $(0,0)$ in ED2 and ED5 | The simplex and ED5 codes use $\alpha=\beta=0$; readout parameters are immaterial at zero depths. All give $\mathcal R(u)=u$. |
| Full one-step | $(1,1)$ | $(\alpha,\beta)=(1,1)$ |
| Tolerance only | $(1,1)$ | $(\alpha,\beta)=(1,0)$ |
| Strictness only | $(1,1)$ | $(\alpha,\beta)=(0,1)$ |
| Selected multi-step | SC $(2,0)$; SH $(3,0)$; SJ $(4,3)$; SS $(1,2)$ | $(\alpha,\beta)=(1,1)$ |

The selected depth pairs were carried forward from the earlier recognition analysis. They were not optimized here for cooperation, basin size, or error tolerance.

### Evolutionary dynamics and cooperation

At fixed strategy frequencies $f_I$, the selected stationary reputations satisfy

$$
r_I=\mathcal R\!\left(\varphi_I(\boldsymbol r,\boldsymbol f)\right),
\qquad \bar r=\sum_I f_Ir_I.
$$

The positive-assessment inputs $\varphi_I$ include the norm, both errors, and the private-image closure. The corrected simplex calculation selects a stationary branch through the auxiliary flow

$$
\frac{\mathrm d r_I}{\mathrm d\tau}=\mathcal R(\varphi_I)-r_I,
\qquad r_I(0)=1.
$$

Auxiliary time $\tau$ is used to solve self-consistency. It is not the exact transient evolution of every internal record state. Strategy frequencies evolve on the slower timescale by

$$
\dot f_I=f_I(\Pi_I-\bar\Pi),\qquad
\bar\Pi=\sum_I f_I\Pi_I,
$$

with

$$
\begin{aligned}
\Pi_{\mathrm{ALLC}}&=(1-e_1)[b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{ALLC}})-c],\\
\Pi_{\mathrm{ALLD}}&=(1-e_1)b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{ALLD}}),\\
\Pi_{\mathrm{DISC}}&=(1-e_1)[b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{DISC}})-c\bar r].
\end{aligned}
$$

Intended and realized cooperation are

$$
\rho_{\mathrm{int}}=f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\bar r,
\qquad \rho_{\mathrm C}=(1-e_1)\rho_{\mathrm{int}}.
$$

ED3 cooperation planes report realized cooperation; ED4 reports intended cooperation. A value at a pure-DISC reputation equilibrium, where $\rho_{\mathrm{int}}=r_{\mathrm{DISC}}$, is conditional on that composition and branch. It is not an average over evolutionary outcomes.

## 3. Figure 3: corrected evolutionary fields

The simplex vertices are ALLD at the lower left, ALLC at the lower right, and DISC at the top. Coordinates satisfy

$$
x=f_{\mathrm{ALLC}}+\tfrac12f_{\mathrm{DISC}},\qquad
y=\tfrac{\sqrt3}{2}f_{\mathrm{DISC}}.
$$

Rows show instantaneous updating, full one-step inertia, and selected multi-step inertia. Equilibrium markers are gray, blue, and orange, respectively. Filled **edge** markers indicate attraction along that invariant edge; stability against the missing third strategy is recorded separately in [equilibria.csv](data/simplex_dynamics/equilibria.csv). A filled edge marker must not automatically be called a fully stable equilibrium.

### Observations supported by the current fields and equilibrium records

| Norm | Instantaneous updating | Full one-step inertia | Selected multi-step inertia |
|---|---|---|---|
| SC | Pure DISC is a saddle. A continuous equilibrium segment also exists. | Pure DISC is a strict local sink; an interior saddle is recorded. | Pure DISC remains a strict local sink. |
| SH | Pure DISC is not a strict sink; its homogeneous reputation is low. | A high-reputation pure-DISC sink exists alongside the ALLD sink. | A high-reputation pure-DISC sink is retained. |
| SJ | Pure DISC is not a strict sink; homogeneous reputation is $0.5$. | Pure DISC is a strict local sink on the selected high branch. | Pure DISC remains a strict local sink with reputation close to one. |
| SS | A stable ALLC-DISC edge mixture exists; pure DISC is not a strict sink. | Pure DISC is a strict local sink. | Pure DISC becomes a saddle; a stable ALLC-DISC mixture is recorded. |

Every displayed case also retains a strict local ALLD sink. Local cooperative stability therefore does not imply global attraction.

For SS, the stable instantaneous mixture has $(f_{\mathrm{ALLC}},f_{\mathrm{ALLD}},f_{\mathrm{DISC}})\approx(0.77517,0,0.22483)$ and intended cooperation $0.98924$. The selected multi-step mixture is approximately $(0.19671,0,0.80329)$, with intended cooperation $0.99522$. These are particular equilibrium outcomes, not average cooperation levels across initial conditions.

In instantaneous SC, the dashed equilibrium segment satisfies

$$
f_{\mathrm{DISC}}=\frac{c}{b(A_{\mathrm{CG}}-A_{\mathrm{DG}})}\approx0.212585,
$$

where $A_{\mathrm{CG}}$ and $A_{\mathrm{DG}}$ are effective positive-assessment probabilities, including errors, for intended cooperation and defection toward a recipient regarded as good. The segment is neutral along its tangent; transverse stability varies along it. Previously sampled roots on this segment should not be described as distinct isolated interior equilibria.

### Interpretation and limits

The calculations support a setting-specific connection between inertia and cooperative local attractors. They also show that the selected multi-step settings need not preserve the same equilibrium type: SS supports a cooperative mixture rather than a pure-DISC sink.

The plots contain sampled equilibrated vector fields and streamlines, with an independent all-good reputation initialization at each composition. They are not full coupled reputation-strategy trajectories. No hand-drawn shading, basin-area measurement, or sampled cooperation average was calculated from these streamplots. The finite root searches and local eigenvalues are numerical evidence, not an exhaustive theorem about every equilibrium.

## 4. ED2: homogeneous DISC reputation branches

The first row plots the scalar auxiliary drift $\mathcal R(\varphi_{\mathrm{DISC}}(r))-r$ and its phase strips. Filled and open roots denote scalar stability and instability. Gray, blue, and orange identify the three inertia settings. At the reference parameters, the saved roots are:

| Norm | Instantaneous stable root | Full one-step roots, in increasing order | Selected multi-step stable root |
|---|---:|---|---:|
| SC | 0.337838 | 0.000876 stable; 0.528199 unstable; 0.996279 stable | 0.999940 |
| SH | 0.020391 | 0.000808 stable; 0.903481 unstable; 0.995272 stable | 0.999998 |
| SJ | 0.500000 | 0.500000 stable; 0.878750 unstable; 0.995307 stable | 0.99999961 |
| SS | 0.833333 | 0.996297 stable, with no additional root in this record | 0.993660 |

Source: [three_curve_equilibria.csv](data/extended_data_figure2/three_curve_equilibria.csv). Full one-step inertia supports a high-standing branch under every norm, but SC, SH, and SJ also retain a stable lower branch in this homogeneous scalar problem. The selected multi-step cases have a single stable high root in the recorded analysis. SS is an important qualification: its selected multi-step reputation is slightly lower than its one-step reputation.

The second row scans $\alpha,\beta\in[0,1]$ on a $161\times161$ grid, retaining one-step depths. The third scans $k_1,k_2\in\{0,\ldots,8\}$ with full readout. In both rows, color shows the **highest stable root**, and hatching identifies two stable roots. A high-colored hatched cell does not say that every reputation initialization reaches the high branch.

The figure demonstrates stationary multistability, rather than a performed parameter-sweep hysteresis experiment. Scalar stability is also distinct from stability of the full internal-state occupation dynamics. The notebook includes `latent_linearization` for selected conditions and depth-grid roots; the readout-plane table itself reports the scalar classification.

Mechanistically, inertia changes the nonlinear stationary response and can change both the value and multiplicity of self-consistent reputations. These homogeneous calculations do not establish the size of a cooperative strategy basin, or resistance to ALLC and ALLD.

## 5. ED3: directional readout and its evolutionary consequences

### First two rows: tolerance only versus strictness only

The first row uses $(\alpha,\beta)=(1,0)$ and the second $(0,1)$, both with depths $(1,1)$. Blue markers retain the one-step color convention.

Tolerance-only readout produces a strict local pure-DISC sink under all four norms in the current records. Strictness-only readout does not do so under any of them. Both sets still have an ALLD sink. In strictness-only SC and SS, filled cooperative-edge mixtures are attractive along the edge but have positive transverse eigenvalues, approximately $0.09221$ and $0.03672$; they are not full sinks.

This comparison is consistent with the role of preserving good treatment while negative evidence accumulates. It does not show that strictness is universally harmful: full bidirectional settings and multi-step depths change the assessment environment, and are different interventions.

### Third row: cooperation across the readout plane

The horizontal axis is $\alpha$ and the vertical axis $\beta$, with depths $(1,1)$, $b/c=5$, and errors $0.02$. The $41\times41$ grid contains 1,681 conditions per norm. Each saved condition uses 512 initial strategy compositions. Color represents the saved basin-weighted realized cooperation, using a nonlinear blue scale from zero to $0.75$; equal color increments do not represent equal cooperation increments.

Selected corner values from [23_alpha_beta_dense41.csv](data/extended_data_figure3_planes/23_alpha_beta_dense41.csv) are:

| Norm | Instantaneous $(0,0)$ | Tolerance only $(1,0)$ | Strictness only $(0,1)$ | Full one-step $(1,1)$ |
|---|---:|---:|---:|---:|
| SC | 0.609765 | 0.737559 | 0.000020 | 0.591174 |
| SH | about zero | 0.210158 | 0.000159 | 0.024819 |
| SJ | about zero | 0.481438 | about zero | 0.230543 |
| SS | 0.533481 | 0.632476 | 0.654784 | 0.697978 |

SC, SH, and SJ show greater sampled cooperation toward large $\alpha$ and small $\beta$; their largest saved grid values occur at $(1,0)$. SS remains comparatively cooperative across the plane and is high near the full-readout corner. These are statements about the tested grid and initial-condition ensemble, not universal optima or statistically tested rankings.

All 6,724 rows pass the saved observable-stability gate. The exact historical generator of this final table has not been uniquely identified. Its values were retained, not recomputed with the corrected simplex solver. The default notebook verifies and plots the supplied table; it does not establish complete upstream regeneration.

### Fourth row: local invasion of pure DISC

The invasion calculation uses an $801\times801$ readout grid. With $c=1$, $R=b/c$, resident reputation $r$, and rare-mutant reputations $r_C,r_D$, the payoff advantages are

$$
\lambda_D=(1-e_1)[Rr_D-(R-1)r],\qquad
\lambda_C=(1-e_1)[Rr_C-1-(R-1)r].
$$

A positive advantage permits growth of the tested rare mutant. Pink denotes $\lambda_D>0$; otherwise purple denotes $\lambda_C>0$; the remaining cells are green. ALLD has classification priority. White dashed and solid curves denote zero advantage for ALLD and ALLC, respectively. Exact zero is neutral, so a green boundary is not automatically a strict sink. The separately saved protection flag uses numerical tolerances.

The green region lies near high $\alpha$; SH and SJ also have large ALLD-invasion regions. SS has no positive-ALLD-advantage cells in this supplied grid, but most cells permit ALLC invasion. The cooperation and local-invasion rows answer different questions: for example, tolerance-only SC has the highest saved cooperation on its plane, while its pure-DISC resident is vulnerable to ALLC.

The labels test only rare ALLC and ALLD in pure DISC. They are not evidence of resistance to all possible mutant strategies. The 181 repaired points and seven changed classifications described below are included in the current planes.

## 6. ED4: benefit-to-cost dependence and initial-condition averages

Each panel varies $R=b/c$ over 45 saved values from $1.001$ to $10$. Gray, blue, and orange compare the same three settings as Figure 3. Lines are PCHIP interpolations of saved means; smoothing does not add simulated parameter values.

Each condition has eight independent scrambled Sobol samples, seeds 2026-2033, each containing 512 equally weighted initial strategy compositions. Folding the Sobol square into the strategy triangle gives uniform area sampling. The same initial samples are reused across conditions. The mean estimates cooperation under this specified distribution of initial compositions and all-good reputation branch.

Bands show $\pm\mathrm{SEM}=\pm s/\sqrt8$ across the eight sample means. They do not quantify finite-population stochasticity, numerical integration error, or mesh error. No statistical test accompanies the plotted differences.

At $R=5$, [cooperation_summary.csv](data/extended_data_figure4/cooperation_summary.csv) gives intended cooperation:

| Norm | Without inertia | Full one-step | Selected multi-step |
|---|---:|---:|---:|
| SC | $0.61399\pm0.00155$ | $0.60019\pm0.00208$ | $0.87936\pm0.00214$ |
| SH | about zero | $0.02753\pm0.00119$ | $0.70654\pm0.00180$ |
| SJ | about zero | $0.24085\pm0.00178$ | $0.70776\pm0.00165$ |
| SS | $0.56611\pm0.00163$ | $0.70298\pm0.00190$ | $0.75807\pm0.00090$ |

The selected multi-step setting gives the larger mean in these four comparisons. One-step inertia does not improve every norm: SC is slightly lower than its instantaneous reference. Near-zero numerical floors in SH and SJ should not be interpreted as meaningful positive cooperation.

Solid line segments indicate the strict pure-DISC protection interval $R_L<R<R_U$; dashed segments lie outside it. When the relevant denominators are positive, the boundaries follow from the two payoff advantages:

$$
R_L=\frac{r}{r-r_D},\qquad
R_U=\frac{1-r}{r_C-r}.
$$

| Norm | Full one-step $(R_L,R_U)$ | Selected multi-step $(R_L,R_U)$ |
|---|---|---|
| SC | $(1.00081,6.30700)$ | $(1.06249,230.23899)$ |
| SH | $(1.00081,5.64093)$ | $(1.08417,4410.36616)$ |
| SJ | $(1.00122,5.68653)$ | $(1.00000083,20910.36178)$ |
| SS | $(1.00113,6.34409)$ | $(1.00004,4.00011)$ |

Source: [invasion_thresholds.csv](data/extended_data_figure4/invasion_thresholds.csv). Right arrows indicate an upper threshold beyond $10$, not extrapolated cooperation curves. The instantaneous cases have no nonempty strict protection interval.

Two comparisons clarify the interpretation. At $R=5$, one-step SH protects pure DISC locally but has mean cooperation only $0.02753$. Conversely, selected multi-step SS has mean cooperation $0.75807$ even though $R>R_U\approx4.00011$, allowing ALLC invasion of pure DISC. Its cooperative mixed equilibrium in Figure 3 is consistent with this distinction.

The 4,320 saved records pass their operational mean-change, individual-change, and residual-quantile gates. This does not require every trajectory's residual to vanish. The inertial strategy fields use triangular-mesh interpolation, with resolution 41 for SC and 25 for the other norms; an independent mesh-refinement study is not supplied. The trajectory ensemble was reused, and its 540 mean/SEM summaries were recalculated.

ED3 and ED4 averages should not be treated as identical datasets after multiplying by $1-e_1$: they have different initial sampling and numerical pipelines, as well as different cooperation conventions. Neither reused ensemble was newly generated from the corrected Figure 3 fields in this release.

## 7. ED5: implementation- and assessment-error planes

Rows compare instantaneous, full one-step, and selected multi-step settings. The horizontal axis is implementation error $e_1$ and the vertical axis assessment error $e_2$, each spanning $[0,0.45]$ on 241 points, with $R=5$.

Pink means ALLD is not excluded, defined by $\lambda_D\geq-10^{-10}$. Among the remaining cells, purple means $\lambda_C>10^{-10}$ and green means DISC resists both tested mutants within the stated tolerance. This preserves the source priority rule. Unlike ED3's sign-based colors, the ED5 category boundaries explicitly use a tolerance. Green permits numerical neutrality for ALLC; it does not always mean strict attraction.

The following counts are taken from [grid_summary.csv](data/extended_data_figure5/grid_summary.csv). Each panel has 58,081 sampled error pairs:

| Norm | Green cells: instantaneous | Green cells: full one-step | Green cells: selected multi-step |
|---|---:|---:|---:|
| SC | 1 | 387 | 35,014 |
| SH | 241 | 502 | 39,018 |
| SJ | 1 | 298 | 18,175 |
| SS | 1 | 938 | 166 |

Selected multi-step inertia produces a much broader displayed resistance region for SC, SH, and SJ. SS is a counterexample to a universal improvement: its selected multi-step region is smaller than its one-step region. In the instantaneous panels, green cells are confined to zero-error boundaries; no green cells have both errors positive.

Counts describe the finite sampled grid, including boundaries. They are not exact continuous areas, probabilities under a specified error distribution, uncertainty estimates, or cooperation averages. These panels also do not test attraction from arbitrary strategy compositions. In particular, the depth pairs selected for recognition need not maximize pure-DISC protection against errors.

All twelve grids were newly computed using the source all-good scalar RK4 equations. All 696,972 resident solves passed the $10^{-9}$ reputation residual criterion. Resident and mutant reputations, both payoff advantages, classifications, and convergence diagnostics are saved separately in NPZ files.

## 8. What the figures jointly support

The results form a sequence from stationary reputation structure (ED2), through strategy fields (Figure 3 and the ED3 simplexes), to initial-condition averages and parameter dependence (ED3 cooperation and ED4), and finally local error tolerance (ED5).

The supported conclusion is conditional: directional inertia can support highly cooperative local equilibria and greater sampled cooperation under the tested norms and parameters. The selected multi-step settings broaden pure-DISC resistance for SC, SH, and SJ over much of the displayed error grid. SS shows that improved sampled cooperation can coexist with vulnerability of pure DISC to ALLC and a stable cooperative mixture.

The figures do not support a blanket claim that more inertia is always better, that the recognition-selected depths are evolutionarily optimal, or that a pure-DISC resistance region measures the cooperative basin. High reputation alone is insufficient to settle these evolutionary questions. Differences without a statistical test should not be described as statistically significant.

## 9. Numerical status and continuation notes

The current outputs include substantive numerical corrections. Read [NUMERICAL_CHANGES.md](NUMERICAL_CHANGES.md) and [Simplex_Solver_Changes.md](Simplex_Solver_Changes.md) before comparing with the earlier PPT assembly.

- **Simplexes:** all 20 fields, containing 61,480 compositions, were recalculated with continuous all-good relaxation and a true residual gate of $10^{-12}$. The earlier synchronous method failed its own criterion at 3,026 field points. Some SJ/SS arrows change materially. Legacy and corrected fields are saved together, and original SVG marker positions are recorded. The SC equilibrium segment is represented explicitly.
- **ED3 invasion:** 181 originally unconverged points were repaired, changing seven color classifications. Eleven independent ODE integrations check selected branches, including every changed-class point. All other original grid values were retained. Old and new fields are recorded in [invasion_repairs.csv](data/extended_data_figure3_planes/invasion_repairs.csv).
- **Reused versus recomputed:** ED2 full parameter scans, ED3 cooperation and complete invasion scans, and ED4 trajectories were not rerun. Default execution of all five notebooks was verified. These are different levels of verification.
- **Provenance gap:** the exact historical execution entry points for the final dense41 cooperation table and original 801-point invasion table remain unidentified. The supplied numerical values and current invasion regeneration path are explicit; complete verified regeneration of the cooperation scan is not claimed.

| Evidence | Purpose |
|---|---|
| [data/simplex_dynamics/](data/simplex_dynamics/) | Corrected and legacy fields, equilibrium fractions and eigenvalues, neutral-segment diagnostics, and source-marker comparisons. |
| [data/extended_data_figure2/](data/extended_data_figure2/) | Scalar roots, readout/depth-plane summaries, drift curves, and configurations. |
| [data/extended_data_figure3_planes/](data/extended_data_figure3_planes/) | Cooperation table, four complete invasion grids, and repair records. |
| [data/extended_data_figure4/](data/extended_data_figure4/) | Repeated initial-sampling records, means/SEM, local thresholds, and numerical settings. |
| [data/extended_data_figure5/](data/extended_data_figure5/) | Twelve error grids, category counts, model settings, and metadata. |
| [validation/](validation/) | Independent solver checks, saved-equation checks, notebook execution and export checks. |

### Text to give a new conversation

> We study indirect reciprocity with ALLC, ALLD, and DISC, private assessment under SC/SH/SJ/SS, and direct-reset directional reputation inertia. Read this results guide, the five linked notebooks, and NUMERICAL_CHANGES.md before drafting. Reference settings are b/c=5 and e1=e2=0.02; selected full-readout depths are SC (2,0), SH (3,0), SJ (4,3), and SS (1,2). Figure 3 contains corrected equilibrated replicator fields without hand-drawn basin shading. ED2 concerns stationary homogeneous-DISC reputation branches. ED3 separates directional readout, sampled realized cooperation, and local invasion. ED4 reports intended cooperation averaged over eight independent samples of 512 initial compositions, with SEM. ED5 tests rare ALLC/ALLD invasion across errors. Keep reputation, local stability, mixed equilibria, and initial-condition averages distinct. Use the corrected fields and documented invasion repairs, not earlier PPT arrows. Do not infer basin areas from streamplots, call every filled edge marker a full sink, equate rare-mutant resistance with universal ESS, or treat reused ensembles as recomputed. The historical generator of the final ED3 cooperation table remains unresolved. Continue interpretation and writing from these existing results; do not add model assumptions or new conclusions without evidence.
