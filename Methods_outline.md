# Methods: content and evidence outline

This is a writing outline, not a finished Methods section. It specifies what the main-text Methods should contain, why each item is needed, and where its detailed derivation or numerical record belongs. [SI_outline.md](SI_outline.md) provides the accompanying supplementary plan.

Evidence links are relative to this workspace. If the outlines are moved to another project, copy the linked model and publication-result folders alongside them or update the links; the outlines do not embed the underlying datasets.

The scope is the current Figure 1-5 and Extended Data Figures 1-7, using the revised outputs and their stated limitations. It excludes the previously set-aside time-correlated or persistent opportunism analyses. The earlier [restart outline](paper_restart_package/03_methods_and_SI_outline.md) predates the later numerical repairs and must not be used as the current figure-status list.

## Recommended main-text structure

### M1. Donation game, behavioral strategies, and private assessment

**Include.** Define the well-mixed donation game, donor and recipient, benefit $b$ and cost $c$, and the three strategies ALLC, ALLD, and DISC. An intended cooperative action fails with probability $e_1$; intended defection is not reversed. An assessment prescribed by the norm is reversed with independent probability $e_2$. Benefits and costs occur only after successful cooperation. State the reference values $b/c=5$ and $e_1=e_2=0.02$ where applicable, and identify the benefit-ratio and error scans that vary them.

Explain that a DISC donor consults its own private image of the recipient, whereas an observer evaluates the realized action using the observer's own private image of that recipient. Define the four norms, including their prescriptions for actions toward good and bad recipients. Use the observed norm table, not an assumption of common public reputation.

**Why / figures.** Establishes the interaction and information structure used throughout Figures 1-5 and ED1-ED7.

**Move to SI.** Full norm table, error-integrated assessment probabilities, conditioning and event-by-event order: SI S1-S2.

**Evidence / status.** [Model.md](Model.md), [Figure 2 notebook](publication_figures_20261026/Figure2.ipynb), and the model functions in the strategy and invasion notebooks. The current rule is the direct-reset model; historical alternatives are not interchangeable.

### M2. Directional reputation inertia and binary readout

**Include.** Define established good and bad states, $k_1$ warning states and $k_2$ recovery states, with $k_1,k_2\geq0$. State that losing established good standing requires $k_1+1$ consecutive negative assessments and regaining it requires $k_2+1$ consecutive positive assessments in the same observer-target record. A positive assessment resets any warning state directly to good; a negative assessment resets any recovery state directly to bad.

Give the probabilities of reading intermediate states as good:

$$
\Pr(G\mid W_m)=\alpha^m,\qquad
\Pr(G\mid S_n)=1-\beta^n.
$$

Readouts are freshly sampled at each consultation and do not themselves change the internal record. Explain full readout, one-step inertia, instantaneous binary updating, and how $K=k_1+k_2$ relates to the number of intermediate states. Do not assign a memory cost that the model does not contain.

**Why / figures.** Defines the central mechanism and the varying readout or depth coordinates in Figure 1, Figure 2, Figure 4, Figure 5, ED1-ED3, ED6, and ED7.

**Move to SI.** Complete positive/negative transition table, $k_i=0$ boundaries, stationary state distribution, and response-function derivation: SI S3-S4.

**Evidence / status.** [Model.md](Model.md) and the final notebooks. The original Figure 1 is a conceptual schematic; its exact editable assembly source has not been identified.

### M3. Finite-population reputation and recognition simulations

**Include.** Explain that simulations keep the three strategy counts fixed and update private reputations, rather than simulating evolutionary strategy replacement. In each event sample different donor and recipient individuals, then sample one DISC observer independently; the observer may be either participant, and self-images are retained. A single event updates the observer's record of the donor. Define one sweep as $n_{\mathrm{DISC}}N$ events and state all-good initial records.

Define the strategy-specific mean good-readout probabilities $g_I$, reputation separation $\Delta g$ and mean disagreement $\bar d$:

$$
\Delta g=\frac{g_{\mathrm{DISC}}+g_{\mathrm{ALLC}}}{2}-g_{\mathrm{ALLD}},
\qquad
\bar d=\frac{d_{\mathrm{DISC}}+d_{\mathrm{ALLC}}+d_{\mathrm{ALLD}}}{3}.
$$

State the operational recognition thresholds $\Delta g\geq0.8$ and $\bar d\leq0.1$, the minimum-total-depth rule, and the fact that the Figure 2 scan and ED1 replicate analysis use separate datasets. ED1 adds its recorded drift criterion. Name the four representative pairs selected under the stated criteria.

**Why / figures.** Supports the matrix snapshots and depth plane in Figure 2, the replication and threshold analysis in ED1, and the later use of norm-specific representative depths.

**Move to SI.** Ordered event pseudocode, exact finite-observer disagreement estimator, sample windows, seeds, repetitions, bootstrap and drift rule, selection tie-breaks, and the separate Figure 2 and ED1 selection records: SI S7-S8.

**Evidence / status.** [Figure 2 and ED1 results guide](publication_figures_20261026/Results_Figure2_and_ED1.md), [input configuration](publication_figures_20261026/data/extended_data_figure1/input_config.json), and [sampling windows](publication_figures_20261026/data/extended_data_figure1/sampling_windows.csv). Figure 2 matrices use $N=90$; its depth scan uses $N=150$ and one run per condition. ED1 uses $N=150$ and 30 independent runs per condition. The regenerated SJ multi-step snapshot differs from the earlier PPT realization.

### M4. Stationary reputation closure and strategy dynamics

**Include.** Introduce $r_I$, the probability that a type-$I$ individual is read as good, and $\bar r=\sum_I f_Ir_I$. Give the stationary response $\mathcal R(u)$ and the self-consistency relation

$$
r_I^*=\mathcal R\!\left(\varphi_I(\boldsymbol r^*,\boldsymbol f)\right).
$$

State that the theoretical calculation closes donor and observer private images by conditional independence given recipient strategy. This is a modeling approximation; the finite process keeps individual private records and their history-dependent correlations.

Explain the all-good branch selection, multiple roots and fold boundaries as relevant. At a mixed strategy composition, the three reputations are selected through the vector auxiliary equation $\mathrm dr_I/\mathrm d\tau=\mathcal R(\varphi_I)-r_I$. This is a numerical route to self-consistency, not the exact transient equation for every internal state. Pure DISC reduces the resident problem to a scalar flow; away from marginal folds, all-good relaxation generally corresponds to its highest strictly stable root. A marginal fold root is not strictly stable. State the assumption that reputation is equilibrated on the faster timescale before payoffs determine the slower strategy frequencies.

Give the replicator equation $\dot f_I=f_I(\Pi_I-\bar\Pi)$ and either the three expected payoffs or an equivalent complete definition. Keep the auxiliary reputation time $\tau$ distinct from strategy time $t$.

**Why / figures.** Supports Figure 3, Figure 4, ED2-ED6, and the stationary residents in Figure 5/ED7.

**Move to SI.** Error-adjusted assessment inputs, conditional-independence closure, stationary chain, branch and full-state stability distinctions, explicit payoff derivation, and numerical solvers: SI S2-S6, S9.

**Evidence / status.** [Model.md](Model.md), [Figure 3 and ED2-ED5 guide](publication_strategy_results_20261027/Results_Figure3_and_ED2_to_ED5.md), and [numerical changes](publication_strategy_results_20261027/NUMERICAL_CHANGES.md). The corrected simplex fields were recalculated; other cooperation ensembles were not all recomputed from those fields.

### M5. Cooperation across initial compositions and standard mutant invasion

**Include.** Define intended and realized cooperation separately:

$$
\rho_{\mathrm{int}}=f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\bar r,
\qquad
\rho_{\mathrm{real}}=(1-e_1)\rho_{\mathrm{int}}.
$$

Define the reported average over the specified sampled initial strategy compositions. A pure-DISC resident's local resistance to rare ALLC and ALLD is a different quantity from the average cooperation reached across starting compositions. Introduce the mutant payoff advantages and explain the meaning of positive, negative, and neutral values. A condition against these two mutants is not an unrestricted evolutionary-stability result.

Describe the depth and benefit-cost comparisons at the level needed to identify their inputs. Figure 4/ED6 use a single 512-point shifted-Halton sample and realized cooperation; ED4 uses eight independent 512-point scrambled-Sobol samples and intended cooperation, with SEM across eight sample means. The shifted-Halton source is strongly inferred by an analytic control rather than recorded in the archived runtime. Do not transfer either sampling protocol to the ED3 cooperation table, whose exact upstream entry point and seed remain unresolved.

**Why / figures.** Supports Figure 4, ED3 cooperation and invasion planes, ED4 benefit-cost curves, ED5 error planes, and ED6 depth maps.

**Move to SI.** Payoff-advantage and threshold derivations, denominators and neutral cases, figure-specific sign/tolerance conventions, sampling design, integration and convergence diagnostics: SI S10-S13.

**Evidence / status.** [Figure 3 and ED2-ED5 guide](publication_strategy_results_20261027/Results_Figure3_and_ED2_to_ED5.md), [Figure 4 and ED6 guide](publication_depth_results_20261027/Results_Figure4_and_ED6.md), and their underlying CSV/NPZ files. Original ED3 cooperation values are reused; the exact final generating script is not identified. The Figure 4/ED6 observable gate checks mean change, not convergence of every strategy trajectory.

### M6. IID opportunistic mutants and the two specified benchmarks

**Include.** Define O-DISC as a rare mutant that independently omits cooperation with probability $\delta$ when it regards a recipient as good, and defects against bad recipients. The resident environment remains fixed. State that $\delta=0$ is a neutral DISC clone and $\delta=1$ is ALLD, and define the normalized payoff difference

$$
\Lambda(\delta)=\frac{\Pi_X-\Pi_R}{c(1-e_1)}
=\delta r_R-\frac bc(r_R-r_X).
$$

Explain the family-level numerical security test over $\delta\in(0,1]$, its tolerance, branch condition, and the fact that the local slope and ALLD endpoint alone are insufficient. Figure 5 uses a finite nonuniform $\delta$ grid and Brent refinement; ED7 searches rational-response stationary-point candidates and filters interior roots at $\delta\le10^{-8}$. Neither should be described as a formal exhaustive proof. The reputation term may be positive or negative; omission does not always lower reputation. Identify the two Figure 5 comparators as aggregation $(M,Q)=(2,1)$ and the reflecting score $-5,\ldots,5$ read as good at threshold zero. They are the specified implementations, without a matched-memory or global-optimization claim.

**Why / figures.** Supports the IID invasion curves and readout adjustment in Figure 5 and the one-step/multi-step robustness maps in ED7.

**Move to SI.** Derive $u_X$, $r_X$, the payoff formula, the local slope and rational-response search; record numerical root filters and open/closed endpoints. Give both benchmark stationary responses and their limitations: SI S14-S16.

**Evidence / status.** [Figure 5 and ED7 guide](publication_opportunism_results_20261027/Results_Figure5_and_ED7.md), [Figure 5 notebook](publication_opportunism_results_20261027/Figure5_Opportunistic_Invasion.ipynb), and [ED7 notebook](publication_opportunism_results_20261027/Extended_Data_Figure7.ipynb). The IID family does not include ALLC; ED7 security and ALLC vulnerability can coexist.

### M7. Numerical reporting and data/code availability

**Include.** Provide a concise description of the methods used for stationary roots, strategy fields, parameter scans, and simulations, with a pointer to the SI for actual tolerances, sampling and convergence gates. Say which results were reused, partially recalculated, or fully recomputed. Report the current scripts and data location, software requirements and the intended public availability in the format required by the eventual journal; do not claim a repository or DOI exists unless it has been created.

**Why / figures.** Allows a reader to distinguish deterministic numerical calculations, finite simulations, and estimates based on sampled initial conditions, and to reproduce the figures from supplied files.

**Move to SI.** Complete figure-by-figure settings, changes to old outputs, validation status, numerical limitations, source gaps, and file map: SI S17-S19.

**Evidence / status.** Each public package has its own README, `requirements.txt`, external data and `validation/` records: [Figure 2/ED1](publication_figures_20261026/README.md), [Figure 3/ED2-ED5](publication_strategy_results_20261027/README.md), [Figure 4/ED6](publication_depth_results_20261027/README.md), and [Figure 5/ED7](publication_opportunism_results_20261027/README.md). Default notebook execution is verified; this does not mean every historical full scan was rerun.

## Essential distinctions for the eventual prose

| Distinction | Required wording discipline |
|---|---|
| Internal state, binary readout, and assessment | They are three different objects; consultations can resample a binary image without updating the underlying state. |
| Fixed-input stationary response, auxiliary relaxation, and real transients | $\mathcal R(u)$ is derived for independent fixed-probability assessments; auxiliary relaxation selects self-consistent roots and is not the full internal-state transient. |
| Finite simulation and mean-field theory | Finite strategies remain fixed and individual private histories are retained; conditional independence is an approximation used in the theoretical closure. |
| Recognition, resident reputation, sampled cooperation, and local protection | These are distinct quantities. A high or stable resident reputation does not by itself show a large cooperative basin or protection against every mutant. |
| Intended and realized cooperation | Multiply intended cooperation by $1-e_1$ for realized cooperation. Figure 4/ED3 cooperation/ED6 use realized values; ED4 uses intended values. |
| Figure 2 and ED1 | One scan replicate per Figure 2 depth condition; 30 independent ED1 repeats. Figure 2's stars do not use ED1's drift gate. |
| Different numerical gates | Pointwise reputation residual, stability of an ensemble mean, stability of individual observables, and strategy residuals are different checks. |
| Standard mutants and IID O-DISC | ED3/ED5/ED6 classify standard mutant advantages with different boundary conventions; ED7 tests the IID O-DISC family, which excludes ALLC. |
| Existing data and new verification | Default plotting was executed; some saved run-level records or parameter grids were reused. Do not describe reused scans as fully recomputed or imply that unsaved trajectory histories are available. |

## Decisions and checks before final Methods prose

1. **ED3 cooperation provenance:** locate or explicitly disclose the missing unique generator, initial-composition sampling scheme/seed, and exact historical execution environment for the final 6,724-row table. The stored row count and observable-stability flags alone do not establish the entire pipeline.
2. **Strength of equilibrium language:** decide whether the source's mean-only gate is sufficient for the planned Figure 4/ED6 claims. If the paper claims all individual trajectories reached equilibrium, additional diagnostics are required; the current three targeted replacements pass the original mean gate but do not establish that stronger claim.
3. **Numerical sensitivity:** determine whether the intended conclusions require mesh-refinement, alternative initial conditions, or independent sampled-start replications. Treat these as missing tests, not completed results.
4. **Figure and version consistency:** use the revised simplex fields and the documented 181 ED3 invasion repairs; do not reuse earlier hand-drawn basin shading or silently call the new SJ matrix snapshot identical to the old PPT. Correct the original ED1 threshold label and ED7 endpoint notation.
5. **Final presentation and availability:** decide the manuscript's exact Methods/SI division, symbol choices, code/data release location, and any journal-specific format. These are editorial decisions; no journal policy or publication URL is assumed here.

Extra population-size, initial-reputation, closure-error, and benchmark-budget checks are useful optional extensions. They become necessary only if the paper makes the corresponding stronger generality or comparative claims; no such additional experiment was run for this outline.
