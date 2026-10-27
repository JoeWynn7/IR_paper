# Supplementary Information: detailed content and evidence outline

This is a plan for the SI, not a finished supplement. It prioritizes the derivations, numerical procedures, figure-specific settings, and evidence required for the current results. The companion [Methods_outline.md](Methods_outline.md) assigns the concise presentation to the main text.

Evidence links are relative to this workspace. If the outlines are moved to another project, copy the linked model and publication-result folders alongside them or update the links; the outlines do not embed the underlying datasets.

Use the current revised Figure 1-5 and ED1-ED7 materials. The [older restart outline](paper_restart_package/03_methods_and_SI_outline.md) is a pre-repair record: its earlier hold on the original Figure 3, Figure 4, ED3, and ED6 does not describe the present revised outputs. The excluded time-correlated and persistent opportunism analyses are outside this SI plan.

**Evidence labels used below:** **Available** means a current source or saved dataset supports the stated content. **Partial** means a current output exists but a derivation, provenance detail, or numerical validation remains incomplete. **Missing / conditional** identifies information that must be disclosed or checked before making the corresponding stronger claim. A default notebook execution, a targeted reconstruction, and a full numerical rescan are different forms of evidence.

## S0. Symbol and parameter table — required

Include a single notation table before the derivations, with figure-specific overrides rather than one assumed global configuration:

| Symbols | Meaning and scope to record |
|---|---|
| $b,c,z=b/c$ | Benefit, cost and their ratio; reference $b=5,c=1$, with $z$ varied in ED4 and ED7. |
| $e_1,e_2$ | Implementation and assessment error probabilities; reference 0.02 each, with both varied from 0 to 0.45 in ED5. |
| $p,q,A_{aR}$ | Four-norm prescriptions for realized acts toward bad recipients, and error-adjusted positive-assessment probabilities conditional on intended act and observer image. |
| $k_1,k_2,K$ | Warning depth, recovery depth, and $K=k_1+k_2$; nonnegative integers, with scan ranges stated per figure. |
| $\alpha,\beta$ | Intermediate-state binary-readout parameters on $[0,1]$; distinguish the one-step tolerance/strictness endpoints and full readout. |
| $N,n_{\mathrm{DISC}},f_I$ | Finite population and DISC observer counts versus deterministic strategy frequencies. The 512 sampled initial compositions are not finite-population individuals. |
| $L_{ij},s_{ij},g_I,d_I$ | Private internal record and good-readout probability, and finite-simulation reputation and disagreement estimators. |
| $r_I,\bar r,\varphi_I,\mathcal R$ | Mean-field good-reputation probabilities, their population mean, assessment inputs, and stationary record-response function. Keep $r_I$ distinct from finite-simulation $g_I$. |
| $\tau,t,\Pi_I$ | Auxiliary reputation-relaxation time, strategy-evolution time, and expected payoff; no physical-duration equivalence is assumed. |
| $\rho_{\mathrm{int}},\rho_{\mathrm{real}}$ | Intended and realized cooperation; identify the metric used in each figure. |
| $\lambda_C,\lambda_D,\delta,\Lambda$ | Standard mutant payoff advantages, IID omission probability, and normalized IID mutant advantage; record their distinct normalizations and numerical tolerances. |

**Why / figures.** Prevents conflicting uses of the same notation across finite simulations, mean-field fields, sampled-cooperation analyses, and invasion plots in Figure 1-5 and ED1-ED7.

**Evidence / status.** Available: [Model.md](Model.md), [ED5 configuration](publication_strategy_results_20261027/data/extended_data_figure5/input_config.json), [depth configuration](publication_depth_results_20261027/data/figure4/input_config.json), and [ED7 configuration](publication_opportunism_results_20261027/data/extended_data_figure7/input_config.json). Final manuscript notation remains an editorial choice; any change must be applied consistently to all equations and legends.

## S1. Donation game, private information, and assessment events — required

**Include.** Define the well-mixed population, donor and recipient, ALLC/ALLD/DISC, successful-cooperation payoff $(b,-c)$, and private observer-target internal records. Distinguish intended action, realized action, prescribed assessment, recorded assessment, internal state, and binary readout. Define $e_1$ and $e_2$, their order and independence. State that defection is not reversed by implementation error.

Give the complete four-norm prescription table. Using $p$ and $q$ for prescribed approval of realized cooperation and defection toward a recipient read as bad, before assessment reversal, the norm pairs are SC $(1,0)$, SH $(0,0)$, SJ $(0,1)$ and SS $(1,1)$; cooperation toward good is approved and defection toward good disapproved by all four norms.

**Why / figures.** Establishes the shared rules underlying the Figure 1 schematic and every subsequent calculation.

**Evidence / status.** Available: [Model.md](Model.md), [Figure 2 notebook](publication_figures_20261026/Figure2.ipynb), and current numerical notebooks. The exact editable assembly for the original Figure 1 PDF is not located; the model semantics are supported by the code.

**Writing check.** Do not describe the finite simulation as public-reputation updating, full-observer updating, or a finite-population strategy evolution process.

## S2. Error-adjusted assessments and private-image closure — required

**Derive.** Define $A_{aR}$ as the probability of a recorded positive assessment conditional on intended action $a$ and the observer's recipient image $R$. With

$$
\epsilon=(1-e_1)(1-e_2)+e_1e_2,
$$

show the four effective probabilities

$$
A_{\mathrm{CG}}=\epsilon,\quad A_{\mathrm{DG}}=e_2,\quad
A_{\mathrm{CB}}=p(\epsilon-e_2)+q(1-\epsilon-e_2)+e_2,\quad
A_{\mathrm{DB}}=q(1-2e_2)+e_2.
$$

Let $r_I$ be the type-specific good-readout probability and $\bar r=\sum_I f_Ir_I$. State the theoretical approximation that donor and observer private images of the same recipient are conditionally independent given its strategy. Define

$$
h_{GG}=\sum_I f_Ir_I^2,\quad
h_{GB}=\sum_I f_Ir_I(1-r_I),\quad
h_{BB}=\sum_I f_I(1-r_I)^2.
$$

Then give

$$
\begin{aligned}
\varphi_{\mathrm{ALLC}}&=\bar r A_{\mathrm{CG}}+(1-\bar r)A_{\mathrm{CB}},\\
\varphi_{\mathrm{ALLD}}&=\bar r A_{\mathrm{DG}}+(1-\bar r)A_{\mathrm{DB}},\\
\varphi_{\mathrm{DISC}}&=h_{GG}A_{\mathrm{CG}}
+h_{GB}(A_{\mathrm{CB}}+A_{\mathrm{DG}})+h_{BB}A_{\mathrm{DB}}.
\end{aligned}
$$

Explain that $h_{GB}$ denotes either ordered disagreement separately; the two orders are not a single shared event with probability $h_{GB}$ in total.

**Why / figures.** Required to reconstruct theoretical reputations, payoffs, and invasion results in Figure 3-5 and ED2-ED7.

**Evidence / status.** Available: [Model.md](Model.md), the `effective_assessment` and assessment-input functions in the [strategy package](publication_strategy_results_20261027/README.md), and the invasion notebooks. Conditional independence is an approximation; finite simulations retain private-record correlations.

**Missing / conditional.** A quantitative error bound comparing this closure with finite private-record correlations is not supplied. It becomes necessary if the manuscript asserts quantitative equivalence, rather than presenting separate theory and simulations.

## S3. Direct-reset state transitions and readout — required

**Include a complete transition table.** For $G,W_1,\ldots,W_{k_1},B,S_1,\ldots,S_{k_2}$, specify which state follows a positive and a negative assessment. A positive assessment clears every warning and returns to $G$; a negative one clears every recovery state and returns to $B$. For zero depths, transitions go directly between established states. Give the binary readout probabilities $1,\alpha^m,0,1-\beta^n$ respectively.

Show a short worked example for one-step depths and identify $K+2$ internal states. Define the $k_1+1$ and $k_2+1$ counts as consecutive assessments of one target by one observer, not consecutive global interactions. Clarify that consulting a record does not alter it and each readout is independently sampled conditional on the internal state.

**Why / figures.** Supports Figure 1, Figure 2, ED1-ED3, the depth scans, and the interpretation of $\alpha,\beta,k_1,k_2$.

**Evidence / status.** Available: [Model.md](Model.md), [Figure2.ipynb](publication_figures_20261026/Figure2.ipynb), and the stationary-response functions in the current notebooks.

**Historical correction.** The earlier [supplementary draft](supplementary_model_and_dynamics.tex) includes positive-depth restrictions and excludes self-records; do not inherit those restrictions in the current finite process. Do not replace direct reset with a stepwise-return model.

## S4. Stationary record distribution and response function — required

**Derive.** For a fixed independent positive-assessment probability $u$, define $v=1-u$ and $T(u)=uT_++vT_-$. Explicitly identify this IID input as a mathematical stationary-response assumption; an individual finite-population assessment history is not thereby proved IID.

Derive the normalization and stationary probabilities

$$
Z=v^{k_1}+u^{k_2}-v^{k_1}u^{k_2},\quad
\pi_G=\frac{u^{k_2+1}}Z,\quad \pi_{W_m}=v^m\pi_G,\quad
\pi_B=\frac{v^{k_1+1}}Z,\quad \pi_{S_n}=u^n\pi_B.
$$

Weight the states by their binary readout probabilities to obtain

$$
\mathcal R(u)=
\frac{u^{k_2+1}\left[1+\sum_{m=1}^{k_1}(\alpha v)^m\right]
+v^{k_1+1}\sum_{n=1}^{k_2}u^n(1-\beta^n)}{Z}.
$$

Specify empty sums, the $u=0,1$ limits, and zero-depth cases. Give the one-step expression and verify $\mathcal R(u)=u$ for instantaneous binary updating. Explain why zero depths with full readout and nonzero depths with $\alpha=\beta=0$ can produce the same binary-update rule without implying identical hidden internal records.

**Why / figures.** This response is the link between the internal chain, ED2 reputation branches, strategy calculations, and the IID invasion equations.

**Evidence / status.** Available: [Model.md](Model.md), `reputation_transform` / `reputation_map` in the released notebooks, and saved equation checks in [validation/](publication_strategy_results_20261027/validation/). An earlier Markov-chain/closed-form check is recorded in [model_formula_checks.json](paper_restart_package/evidence/checks/model_formula_checks.json).

**Writing check.** Re-derive the symbols in the final SI from one consistent transition convention and state the applicable endpoints; do not present sampled validation as a proof of every full-system transient.

## S5. Self-consistency, branch selection, and timescales — required

**Include.** Formulate $r_I=\mathcal R(\varphi_I)$ at fixed strategy composition. Describe the continuous auxiliary relaxation $\mathrm dr_I/\mathrm d\tau=\mathcal R(\varphi_I)-r_I$ and its all-good initialization, and distinguish it from both synchronous fixed-point iteration and the complete internal-state occupation dynamics. If a full-state evolution equation is presented, derive its observation-event scaling explicitly; do not identify it with the auxiliary equation.

For a homogeneous DISC population, give the scalar self-consistency function, the slope-based scalar stability criterion, and the selection of the highest strictly stable root in ED7. Explain multiple roots and folds. Away from marginal folds, the selected highest scalar root generally corresponds to all-good relaxation; at a fold a marginal root need not satisfy the strict stability rule.

**Why / figures.** A different reputation branch can change payoffs and apparent invasion; this is essential for ED2, the Figure 3 fields, and Figure 5/ED7 boundaries.

**Evidence / status.** Available: [ED2 notebook](publication_strategy_results_20261027/Extended_Data_Figure2.ipynb), [simplex solver notes](publication_strategy_results_20261027/Simplex_Solver_Changes.md), and [ED7 notebook](publication_opportunism_results_20261027/Extended_Data_Figure7.ipynb). ED2 includes full-state linearization for selected conditions and depth-grid roots, not verification of the entire readout plane.

**Missing / conditional.** Do not claim that scalar stability proves stability of all internal-state transients or that the finite private-record process always selects the same branch. Full comparisons would require additional validation.

## S6. Payoffs, replicator dynamics, and cooperation measures — required

**Derive.** Under the closure, set $\bar r=\sum_I f_Ir_I$ and calculate

$$
\begin{aligned}
\Pi_{\mathrm{ALLC}}&=(1-e_1)[b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{ALLC}})-c],\\
\Pi_{\mathrm{ALLD}}&=(1-e_1)b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{ALLD}}),\\
\Pi_{\mathrm{DISC}}&=(1-e_1)[b(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_{\mathrm{DISC}})-c\bar r].
\end{aligned}
$$

Give $\dot f_I=f_I(\Pi_I-\bar\Pi)$ and the intended and realized cooperation definitions in M5. Define the reported initial-composition average and distinguish it from a pure-DISC resident's local stability and from the fraction of starts above a chosen cooperation cutoff.

**Why / figures.** Required for Figure 3, Figure 4, ED3, ED4, and ED6, and for interpreting the role of implementation errors in all payoff comparisons.

**Evidence / status.** Available: [Model.md](Model.md), [strategy results guide](publication_strategy_results_20261027/Results_Figure3_and_ED2_to_ED5.md), and [depth results guide](publication_depth_results_20261027/Results_Figure4_and_ED6.md).

**Writing check.** Figure 4, ED3's cooperation plane, and ED6 report realized cooperation; ED4 reports intended cooperation. Do not assume numerical equality between the different ensembles after the factor $1-e_1$ is applied.

## S7. Finite-population event algorithm and estimators — required

**Include pseudocode.** At each event: select a donor uniformly, select a distinct recipient, select one DISC observer independently and uniformly, sample the donor's private recipient image if needed, apply implementation error, sample the observer's own recipient image, apply the norm and assessment error, then update only the observer's record of the donor. The observer may equal donor or recipient; self-images are retained. Two consultations may independently sample readouts from the same underlying record.

State that all records start good, the three strategy counts remain fixed, and $n_{\mathrm{DISC}}N$ events define one sweep. For $s_{ij}=\Pr(G\mid L_{ij})$, specify exactly how $g_I$ is averaged and how two **distinct** observers' disagreement is estimated:

$$
d_j=\frac{\sum_{i\ne\ell}[s_{ij}(1-s_{\ell j})+(1-s_{ij})s_{\ell j}]}
{n_{\mathrm{DISC}}(n_{\mathrm{DISC}}-1)}.
$$

Define $d_I$, $\Delta g$, and $\bar d$ as in M3; state the units are dimensionless. Low disagreement alone can reflect agreement on uninformative bad reputations.

**Why / figures.** Reconstructs Figure 2 and ED1 and makes observer sampling and finite-population normalization verifiable.

**Evidence / status.** Available: [Figure2.ipynb](publication_figures_20261026/Figure2.ipynb), [ED1 notebook](publication_figures_20261026/Extended_Data_Figure1.ipynb), and [recognition guide](publication_figures_20261026/Results_Figure2_and_ED1.md). Exact self-image and fresh-readout rules must replace conflicting statements in older drafts.

## S8. Recognition experiment, selection, uncertainty, and ED1 — required

**Include a settings table and selection pseudocode.**

| Dataset | Population and design | Sampling / uncertainty |
|---|---|---|
| Figure 2 matrices | $N=90$, 30 per strategy; 12 single snapshots; seed 2027 | Final state after 1,000 sweeps. The current SJ multi-step snapshot is a regenerated realization and is not a cellwise reproduction of the old PPT snapshot. |
| Figure 2 depth planes | $N=150$, 50 per strategy; four norms, $k_1,k_2=0,\ldots,6$ | One run per condition, base seed 2027; 1,000 sweeps, burn-in 800, interval 5, 41 measurement times. No ED1 drift gate or replicate uncertainty. |
| ED1 | Same $N=150$ and depth grid; 30 independent runs per condition, base seed 20260918 | 5,880 replicate records. Most use the 1,000/800/5 schedule. SJ $(4,5)$ uses 3,000/2,400/5; SJ $(3,5)$ uses 50,000/40,000/5. |

Explain the 2,000 bootstrap resamples of independent run means, seed 2026091801, and pointwise 95% intervals. The two half-window drift intervals must both lie strictly within $(-0.01,0.01)$ for the ED1 drift criterion. State the recognition thresholds $\Delta g\ge0.8$ and $\bar d\le0.1$, followed by minimum $K$, larger separation, lower disagreement, then smaller $k_1,k_2$ as tie-breaks.

Figure 2 independently selects its stars from its own one-run data without ED1's drift criterion. ED1 selects from replicated estimates and obtains the same four pairs under the default rule. An older draft or candidate description reported 10 runs per Figure 2 depth condition; the current saved table and plotted output use one. The ED1 sensitivity vertical axis is the **minimum** allowed separation, not the erroneous maximum label in an earlier figure. The white-circle **area** in the Figure 2 depth plots scales with the square of disagreement.

**Why / figures.** Makes the recognition claim and the origin of SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$ and SS $(1,2)$ reproducible.

**Evidence / status.** Available: [recognition raw and summary data](publication_figures_20261026/data/extended_data_figure1/), [selected architectures](publication_figures_20261026/data/extended_data_figure1/selected_architectures.csv), [actual sampling windows](publication_figures_20261026/data/extended_data_figure1/sampling_windows.csv), and [results guide](publication_figures_20261026/Results_Figure2_and_ED1.md). Full finite-depth and 5,880-run scans were reused, not rerun in the current release; statistics and selections were recalculated.

**Missing / conditional.** More independent Figure 2 depth-plane runs or additional population sizes would be needed for a stronger precision or size-generalization claim. Do not attribute ED1's 30 replicates to Figure 2.

## S9. Homogeneous DISC reputation branches and ED2 — required

**Include.** Derive the homogeneous scalar assessment input and fixed-point equation. Document the root grids used for the ordinary curves and readout plane, 2,001 and 401 respectively, the $161\times161$ readout scan, the integer depths $0,\ldots,8$, the scalar slope tolerance $10^{-7}$ and near-fold treatment. Specify that color gives the **highest stable root** and hatching gives two stable scalar roots.

Provide the stable/unstable root classification for the displayed reference mechanisms, a brief example of multistability, and the scope of `latent_linearization`: selected cases and depth-grid roots, not the whole readout plane. A stationary bifurcation diagram is not by itself a performed hysteresis experiment.

**Why / figures.** Supports ED2 and explains why initialization and branch selection matter for the later pure-DISC calculations.

**Evidence / status.** Available: [ED2 notebook](publication_strategy_results_20261027/Extended_Data_Figure2.ipynb), [root and plane tables](publication_strategy_results_20261027/data/extended_data_figure2/), and [ED2/ED4 validation](publication_strategy_results_20261027/validation/ed2_ed4_validation.json). The complete plane scans were reused, not rerun for the release.

## S10. Simplex fields, equilibria, and their numerical correction — required

**Include the algorithm and diagnostics.** At each composition independently start from all-good reputations, solve the continuous self-consistency relaxation, compute payoffs and the replicator vector, then draw the sampled field. The 84-by-74 rectangular grid has 3,074 inside-simplex compositions per panel; the 20 Figure 3 / ED3 simplex settings contain 61,480 such points. State the true reputation RHS residual limit $10^{-12}$ and RK4 continuation stages: time step 0.1 for up to 20,000 steps, then 0.2 for up to 80,000 and, where needed, another 200,000 steps.

Report what was corrected: the old synchronous iteration failed its own criterion at 3,026 plotted grid points, and the largest change in a replicator-vector component was about 0.4732. Twenty uniform-composition checks plus one slow SJ one-step point were independently integrated with DOP853, with maximum reputation difference about $2.72\times10^{-9}$. The previous arrows and markers must not be treated as unchanged.

Specify simplex coordinates and equilibrium search, numerical residual and eigenvalue criteria, and the difference between along-edge and transverse stability. Filled edge markers are defined by the along-edge convention. Use the saved `full_strict_sink` and eigenvalues for full local stability; do not infer it from marker fill alone.

Under instantaneous SC, explicitly derive the continuous equilibrium set

$$
f_{\mathrm{DISC}}=\frac{c}{b(A_{\mathrm{CG}}-A_{\mathrm{DG}})}\approx0.212585
$$

at the reference parameters. The line is neutral along its tangent and has variable transverse stability; it is not a set of distinct isolated roots. Streamlines show sampled equilibrated fields, not a full coupled slow-fast transient or a measured basin. The earlier manually drawn shading and basin-area claims are not part of the current output.

**Why / figures.** Required to support Figure 3 and the first two rows of ED3, and to make the differences from the old assembled panels traceable.

**Evidence / status.** Available: [simplex solver notes](publication_strategy_results_20261027/Simplex_Solver_Changes.md), [solver comparison](publication_strategy_results_20261027/data/simplex_dynamics/solver_comparison.csv), [equilibrium and eigenvalue records](publication_strategy_results_20261027/data/simplex_dynamics/equilibria.csv), and [independent checks](publication_strategy_results_20261027/validation/simplex_independent_checks.json). The field recomputation and default notebook execution were performed; the finite root search is not a mathematical enumeration theorem.

## S11. Rare ALLC/ALLD invasion and figure-specific boundaries — required

**Derive.** In pure DISC, let $r$ be the resident reputation and let

$$
r_C=\mathcal R(rA_{\mathrm{CG}}+(1-r)A_{\mathrm{CB}}),\qquad
r_D=\mathcal R(rA_{\mathrm{DG}}+(1-r)A_{\mathrm{DB}}).
$$

For $c=1$ and $z=b/c$, write

$$
\lambda_D=(1-e_1)[zr_D-(z-1)r],\qquad
\lambda_C=(1-e_1)[zr_C-1-(z-1)r].
$$

Under the required positive-denominator conditions, derive the candidate strict-protection bounds $z_L=r/(r-r_D)$ and $z_U=(1-r)/(r_C-r)$. Treat zero, negative, infinite, coincident and neutral cases separately; do not assert a universal nonempty interval.

**Report each figure's actual classification.**

| Figure | Saved color, flag, or line convention |
|---|---|
| ED3 readout invasion plane | Raw $\lambda_D>0$ has priority; otherwise $\lambda_C>0$ is the second category. Zero boundaries are neutral; the separately stored protection flag uses tolerances. |
| ED4 | Solid segments indicate the source's strict pure-DISC protection interval; dashed segments lie outside it. State threshold edge cases. |
| ED5 | ALLD non-exclusion $\lambda_D\ge-10^{-10}$ has priority; then $\lambda_C>10^{-10}$; the remaining category permits numerical neutrality for ALLC. |
| ED6 | Dotted cells use the source's strict sign rule $\lambda_D<0$ **and** $\lambda_C<0$. |

State explicitly that these local comparisons are against rare ALLC and ALLD, not a test against every possible behavioral mutant. The $\lambda_C,\lambda_D$ above are payoff differences with $c=1$; Figure 5's $\Lambda$ uses a different normalization, although their signs can be compared consistently after accounting for the positive factor.

**Why / figures.** Supports ED3-ED6 and prevents tolerance or neutrality choices from being silently conflated.

**Evidence / status.** Available: [ED3 plane notebook](publication_strategy_results_20261027/Extended_Data_Figure3_Planes.ipynb), [ED4 notebook](publication_strategy_results_20261027/Extended_Data_Figure4.ipynb), [ED5 notebook](publication_strategy_results_20261027/Extended_Data_Figure5.ipynb), and [ED6 notebook](publication_depth_results_20261027/Extended_Data_Figure6.ipynb).

## S12. ED3 and ED5 plane calculations and repair records — required

**ED3.** Describe the $41\times41$ one-step $(\alpha,\beta)$ cooperation table, 6,724 rows across four norms, $n_{\mathrm{initial}}=512$ per condition according to the saved table, and realized cooperation. All saved observable-stability flags pass. The individual initial vectors, the exact historical generator, initial-sampling scheme/seed, and execution entry point for this final cooperation table have not been found or uniquely established. Do not substitute the protocol of another scan without evidence.

For the separate $801\times801$ local invasion grids, document the original 181 failed reputation entries, the same-equation scalar self-consistency repairs, and seven changed classifications. Retained entries have maximum saved residual about $10^{-10}$; repaired entries have residual at most $1.72\times10^{-15}$. Eleven independent Radau integrations check branch selection, including all seven changed-class points. Record the original/new values and the fact that the entire grid and cooperation ensemble were not rerun.

**ED5.** State that implementation and assessment errors each range from 0 to 0.45 on 241 points, with $b/c=5$ and the three displayed inertia settings. Twelve grids contain 696,972 resident solves; they were newly calculated and passed the $10^{-9}$ reputation residual gate. Explain the $10^{-10}$ invasion classification tolerance and its priority in S11. A grid-count comparison is not a confidence interval or probability over environmental conditions.

**Why / figures.** Supports the directional-readout and error conclusions, with the numerical repairs and validation scope visible to a reader.

**Evidence / status.** Partial for complete ED3 cooperation provenance; available for the stored outputs and targeted repairs: [ED3 data](publication_strategy_results_20261027/data/extended_data_figure3_planes/), [repair record](publication_strategy_results_20261027/data/extended_data_figure3_planes/invasion_repairs.csv), [numerical changes](publication_strategy_results_20261027/NUMERICAL_CHANGES.md). ED5 recomputation and checks: [ED5 validation](publication_strategy_results_20261027/validation/ed5_validation.json).

## S13. Strategy-composition sampling, benefit ratios, and depth allocation — required

**First define the estimator.** Show how each sampled initial composition produces a final realized or intended cooperation value, and average over the declared initial-composition sample. Explain that the result depends on that sampling measure, interpolation and numerical stopping criteria. Do not equate it with the entire state-space basin area or a universal probability of cooperation.

**Report the protocols separately.**

| Analysis | Initial sample and outcome | Numerical settings and evidence |
|---|---|---|
| ED3 cooperation | 512 initial compositions per readout condition according to saved metadata; realized cooperation | Individual initial vectors, final unique generator, sampling scheme and seed are not confirmed. Saved observable-stability flags pass; no claim of full regeneration. |
| ED4 | Eight independently scrambled Sobol samples, seeds 2026-2033, each 512 area-uniform compositions; intended cooperation | Same initial samples reused across conditions. 45 $b/c$ values from 1.001 to 10. SEM is the sample standard deviation of the eight group means divided by $\sqrt8$. No ABM stochastic SEM or statistical test is supplied. |
| Figure 4 / ED6 | One shifted-Halton fallback sample of 512 compositions, seed 2026; realized cooperation | Triangular field mesh resolution 23. The sampler is strongly inferred by an analytic control; original starting arrays and interpolation topology were not archived. No independent-replicate error bars. |

For ED4, document the original integration and three-gate convergence protocol, not just a generic 'steady-state' label. The inertial strategy fields use mesh resolution 41 for SC and 25 for the other norms; the no-inertia baseline uses an analytic field. SC uses $dt=0.05$ and 5,000-step chunks; the other norms use $dt=0.1$ and 4,000-step chunks. Baseline mean/individual-change/residual-q99 limits are $2\times10^{-6}$, $2\times10^{-5}$, $2\times10^{-5}$ for three consecutive chunks. Inertial limits are $2\times10^{-5}$, $10^{-4}$, $0.002$ for two consecutive chunks; for inertial SC the first two limits are $5\times10^{-5}$ and $2\times10^{-4}$. The maximum is 64 chunks. State that these checks still do not require every trajectory's residual to vanish. The 4,320 stored run-level records were reused and 540 means/SEM were recalculated; individual trajectory histories were not supplied or rerun, and there is no independent mesh-refinement study.

For Figure 4/ED6, document the original gate: mean realized-cooperation change $\le2\times10^{-5}$ for two consecutive 4,000-step chunks, originally at most eight chunks. The three SC/SH/SS $(1,1)$ failures were reconstructed and extended in the current environment to 40,000, 44,000 and 36,000 steps and pass this same mean gate. SH still has strategy residual q99 approximately $1.93\times10^{-4}$. Historical interpolation topology and trajectory endpoints are missing; the reconstructed 32,000-step prefix differs from the old SC summary by one cooperative start, so these are not exact continuation of archived trajectories.

State the Figure 4 triangular domain $K=0,\ldots,8$, 180 rows across norms, and the ED6 square $k_1,k_2=0,\ldots,7$, 256 rows. They share 172 displayed conditions. ED6 does not contain both extreme allocations at $K=8$, so its square alone cannot reproduce the full Figure 4 envelope there. For each $K$, select the largest observed sampled mean; exact ties favor larger $k_1$. This is not a global or statistically established optimum and does not impose an explicit memory cost.

**Why / figures.** Required for Figure 4, ED3 cooperation, ED4, and ED6 and for reporting the sampling evidence without transferring settings between datasets.

**Evidence / status.** Partial for ED3's original generating process; available for the current others: [ED4 data](publication_strategy_results_20261027/data/extended_data_figure4/), [ED4 notebook](publication_strategy_results_20261027/Extended_Data_Figure4.ipynb), [depth data](publication_depth_results_20261027/data/), and [targeted-repair diagnostics](publication_depth_results_20261027/validation/targeted_repairs.json). Figure 4/ED6 retain 177/253 original rows and three reconstructed rows. The separate originally failed SH $(2,8)$ at $K=10$ is outside the displayed domain and is retained only as source evidence.

**Missing / conditional.** If 'all trajectories equilibrated', robustness to the field mesh, or a statistically precise ranking is claimed, the existing mean gate and one-sample depth scan do not suffice. Additional validation is then required; it has not been performed for this outline.

## S14. IID opportunistic discriminator: payoff and family-level security — required

**Derive.** In pure DISC, define

$$
\begin{aligned}
u_C&=r_RA_{\mathrm{CG}}+(1-r_R)A_{\mathrm{CB}},\\
u_D&=r_RA_{\mathrm{DG}}+(1-r_R)A_{\mathrm{DB}},\\
\Delta u&=u_C-u_D,\qquad u_R=r_Ru_C+(1-r_R)u_D,\\
u_X&=u_R-\delta r_R\Delta u,\qquad r_X=\mathcal R(u_X),\\
\Pi_R&=(1-e_1)(b-c)r_R,\qquad
\Pi_X=(1-e_1)[br_X-c(1-\delta)r_R],\\
\Lambda(\delta)&=\frac{\Pi_X-\Pi_R}{c(1-e_1)}
=\delta r_R-z(r_R-r_X).
\end{aligned}
$$

State the IID omission rule, rare-mutant assumption, $\delta=0$ clone neutrality and $\delta=1$ ALLD equivalence. Include

$$
\Lambda'(0)=r_R[1-z\Delta u\mathcal R'(u_R)].
$$

The reputation contribution can be a gain or a loss: $\Delta u$ need not be positive on every branch. Neither the local slope nor the ALLD endpoint alone proves security against all $\delta$.

For the family-level computation with $r_R>0$, define $H(\delta)=(r_R-r_X)/(\delta r_R)$ for $\delta>0$ and its limit $H(0)=\Delta u\mathcal R'(u_R)$. Then $\Lambda=\delta r_R[1-zH(\delta)]$. Explain the numerical search for the minimum of $H$, its domain, endpoint handling, and the fact that family-level nonpositive advantage is not unrestricted strict ESS. IID O-DISC does not include ALLC.

**Why / figures.** Supports Figure 5 and ED7, including the narrow one-step positive window and the relation between local and global family checks.

**Evidence / status.** Available: [opportunism results guide](publication_opportunism_results_20261027/Results_Figure5_and_ED7.md), [Figure 5 notebook](publication_opportunism_results_20261027/Figure5_Opportunistic_Invasion.ipynb), and [ED7 notebook](publication_opportunism_results_20261027/Extended_Data_Figure7.ipynb). The saved earlier [SS ALLC reference](publication_opportunism_results_20261027/data/comparison/ED6_SS_multistep_reference.csv) shows why IID security and ALLC invasion can coexist.

## S15. Figure 5 baselines and direct invasion calculations — required

**Include.** Give the exact aggregation baseline $M=2,Q=1$, for which the probability of a good readout is $2u-u^2$. Define the quantitative model as an integer score from $-5$ to $5$, reflected at the bounds, moving one level up/down after positive/negative assessment, and read as good at score $\ge0$. Derive or specify its stationary finite-state Markov chain and use the same resident/mutant payoff convention.

Record SJ, $z=5$, $e_1=e_2=0.02$, $\beta=1$, the one-step and $(4,3)$ multi-step cases, and $\alpha=1$ versus 0.8 where applicable. The source uses 5,015 nonuniform $\delta$ points with near-zero refinement and Brent refinement of detected sign changes, plus a 1,006-point $\alpha$ scan. Explain $\delta_c$ as the upper endpoint of a detected positive interval, not a maximum payoff or probability.

Keep the one-step positive window, $\delta_c\approx0.008397$, even though it is visually narrow. Mark the Figure 5 lower fold as excluded and its upper invasion boundary as included according to the stored records. The supplied finite-grid checks do not prove that every possible narrower positive interval has been excluded.

**Why / figures.** Documents all five Figure 5a curves and the readout/cooperation panel, including the specified comparison scope.

**Evidence / status.** Available: [Figure 5 data](publication_opportunism_results_20261027/data/figure5/), including the saved $1{,}006\times1{,}001$ map, and [Figure 5 validation](publication_opportunism_results_20261027/validation/figure5_validation.json). The five curves, saved residents, selected crossings, and comparator chain checks were examined; the complete alpha scan was not rerun.

**Missing / conditional.** A matched memory budget or optimized comparator families are not supplied. They are needed before claiming that one mechanism is universally superior to those alternatives.

## S16. ED7 security landscapes and endpoint rules — required

**Include.** Specify four norms, the full one-step depths $(1,1)$, the four recognition-selected multi-step depths, $\beta=1$, $e_1=e_2=0.02$, and $b/c=2,\ldots,8$ on 161 values. The source uses at least 601 $\alpha$ grid points, adding fold neighborhoods and reference points. State that the green background is resident **intended** cooperation $r_R$; it is not a cooperation basin or an invasion probability. Black outlines and curves show security against the IID family. The marked reference is $(\alpha,b/c)=(0.8,5)$.

Explain the rational-response computation: evaluate endpoints and numerically found real stationary-point candidates of $H$; the source root filter uses imaginary-part tolerance $10^{-7}$ and retains interior roots with $\delta>10^{-8}$. Security uses $1-z\min H\le10^{-10}$ in the normalized condition. This is a finite-precision algorithm and not a formal proof that every possible extremely small interior extremum was found.

List the saved $b/c=5$ intervals with their actual `lower_included` and `upper_included` fields. Marginal fold ends are excluded; domain or neutral-invasion ends are included where the table says so. Correct the original assembled figure's uniformly closed-interval legend. Explain that a very narrow interval can be invisible at plotting resolution; use the table for numeric claims.

**Why / figures.** Supports ED7, relates Figure 5's SJ example to other norms and benefit ratios, and prevents unrestricted-stability claims.

**Evidence / status.** Available: [ED7 data](publication_opportunism_results_20261027/data/extended_data_figure7/), [secure alpha intervals](publication_opportunism_results_20261027/data/extended_data_figure7/c_secure_alpha_intervals.csv), [benefit-ratio intervals](publication_opportunism_results_20261027/data/extended_data_figure7/benefit_alpha_intervals_both_mechanisms.csv), and [ED7 validation](publication_opportunism_results_20261027/validation/ed7_validation.json). All 4,822 saved resident points were checked for scalar residual/stability; eight reference points and a small boundary example were checked. The full parameter scan was not rerun.

**Scope.** The original notebook's `two_versions` covers different backgrounds as well as two inertia mechanisms. The current final figure uses the cooperation background and both inertia mechanisms. The extra $\beta$ study and temporally persistent mutant models are not part of this release.

## S17. Figure-by-figure reproducibility table — required

Include a compact table in the final SI, with the full settings in the sections above and data/identifier links in an accompanying code/data index. The following is the minimum coverage:

| Figure | Required method description | Current evidence status |
|---|---|---|
| Figure 1 | Direct-reset state paths, readout and errors; diagram is conceptual. | Model/code available; exact diagram assembly source not found. |
| Figure 2 | 12 finite snapshots and four depth planes; $N$, per-condition runs, seed, sweep, metrics and marker encoding. | Current snapshots regenerated; depth data reused; one run per depth condition. |
| ED1 | 30 runs per grid point, bootstrap, drift, thresholds, selection and sensitivity; extended SJ windows. | Saved raw records reused; statistics recalculated. |
| ED2 | Auxiliary scalar branches, root grids, readout/depth scans and selected full-state checks. | Saved tables reused; complete plane scan not rerun. |
| Figure 3 | 12 revised equilibrated simplex fields, solver gates, equilibria, marker conventions and neutral segment. | Recomputed with saved field and solver comparisons; no basin shading or basin area. |
| ED3 | Eight tolerance/strictness simplexes, four cooperation and four invasion planes; different measures and fixes. | Simplexes recomputed; cooperation data reused with upstream gap; 181 invasion points repaired. |
| ED4 | Intended cooperation across $b/c$, eight independent start samples, SEM, interpolation, local protection and three convergence gates. | Saved run-level records reused; means/SEM recalculated and recorded gates checked. Individual trajectory histories were not supplied or rerun. |
| ED5 | Error grids, full selected depth cases, payoff classification priority and tolerance. | All 12 grids newly calculated and resident residuals checked. |
| Figure 4 | $K=0$-8 allocations, single-sample realized cooperation, observed envelope and tie rule. | Source rows reused except three authorized reconstructions; original weak gate disclosed. |
| ED6 | Integer depth square, same cooperation sample class, strict two-mutant hatching and source repairs. | Source rows reused except the same three reconstructions; 172 displayed rows overlap Figure 4. |
| Figure 5 | IID omission, five specified mechanisms, normalized advantage, readout scan and numerical crossing search. | Saved full curves/map reused; pointwise and selected checks run; full alpha scan not rerun. |
| ED7 | One-step/multi-step $\alpha$/$b/c$ security, rational-response candidates and endpoint inclusion. | Saved grids/intervals reused; all saved resident residuals and selected examples checked; full grid not rerun. |

Provide explicit default values $b/c=5$, $c=1$, $e_1=e_2=0.02$ where applicable, and identify axes that override them. Cite the current per-figure input configurations rather than extrapolating a single solver, seed, sample size, or convergence criterion to every figure.

## S18. Provenance, reproducibility, and unresolved evidence — required

The SI or its accompanying availability index should provide:

1. The exact public notebook, external data table/array, configuration, output names and tested software dependencies for each figure. The current release packages are [Figure 2/ED1](publication_figures_20261026/README.md), [Figure 3/ED2-ED5](publication_strategy_results_20261027/README.md), [Figure 4/ED6](publication_depth_results_20261027/README.md), and [Figure 5/ED7](publication_opportunism_results_20261027/README.md).
2. Whether each table was reused, summarized again, corrected at selected points, or fully recomputed; preserve original versus corrected values and record branch, residual, sampling and gate criteria.
3. A record of the original source notebook names when they differ from manuscript numbering, and a warning that old hand-assembled PPT shading, old one-step values failing the gate, and old ED7 closed-endpoint labels are not the current scientific result.
4. Explicit missing items: the final ED3 cooperation generator/seed and exact sampling protocol; the historical 801-grid execution entry point; the original Figure 1 editable assembly; and the old depth-scan interpolation topology and trajectory endpoints. The current code can redraw from supplied data, but these gaps limit exact historical end-to-end reproduction.
5. File integrity and output checks, stated as what was actually checked. The current notebook default executions and visual exports were verified; full historical ED2, ED3 cooperation/invasion, ED4, depth and ED7 scans were not all rerun. Figure 3 fields, ED5 grids, and the named targeted repairs were recomputed.

Before submission, decide the final public archive, version, license and availability statement. A DOI, external repository or independent end-to-end replication must not be asserted until it exists.

## S19. Optional strengthening and conditional requirements

These are proposals for later work, not completed analyses or new results. Their necessity depends on the claim the manuscript intends to make.

| Possible addition | Why it would help | When it becomes necessary |
|---|---|---|
| Additional finite-population sizes, observation schedules, initial reputations and independent Figure 2 runs | Measure sensitivity of recognition to the finite design and improve uncertainty estimates. | A broad finite-size, initialization-insensitive or precise per-cell claim. |
| Quantitative comparison of finite private-record correlations with the conditional-independence closure | Assess the theory/finite-simulation approximation. | A claim of close quantitative equivalence between the two descriptions. |
| Strategy-field mesh refinement and per-trajectory residual/long-time checks | Assess whether averages, boundaries, and apparent basin outcomes depend on numerical resolution or weak mean gates. | Claims that all trajectories truly equilibrate or that small differences in sampled envelopes are robust. |
| Independent initial-composition samples for Figure 4/ED6 and verified ED3 sampler regeneration | Quantify uncertainty in allocation rankings and establish sampling provenance. | A statistical ranking, precise optimum, or reproducibility claim for those averages. |
| More robust analysis of very small $\delta$ and numerical branch folds | Probe the ED7 root-filter cutoff and near-neutral boundaries. | A rigorous continuous-family guarantee beyond the saved finite-precision algorithm. |
| Matched-budget and broader aggregation/quantitative parameter comparisons | Clarify whether conclusions depend on the specific baseline implementations. | A general superiority or fair-resource comparative claim. |

## S20. Recommended writing and verification order

1. Freeze the symbol table and the direct-reset model from S1-S6; verify equations against the current notebooks rather than copying conflicting historical prose.
2. Write the finite event algorithm, metrics and selection protocol from S7-S9, with the distinct Figure 2 and ED1 datasets.
3. Write the dynamics, invasion and sampled-cooperation methods from S10-S13, including the numerical correction and uncertainty limits before interpreting the panels.
4. Write the IID derivation, benchmarks and security calculation from S14-S16, retaining root-filter and endpoint qualifications.
5. Complete the figure-by-figure table and availability index in S17-S18. Resolve or transparently disclose missing provenance and choose only claims supported by the gates actually met.
6. Use S19 to decide whether stronger claims need new verification. Do not describe those proposed tests as existing evidence.
