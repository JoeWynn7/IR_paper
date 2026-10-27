# Results guide: Figure 4 and Extended Data Figure 6

This guide explains the current depth-allocation results for a new conversation. It describes existing results and three documented numerical reconstructions; it does not add a model mechanism, statistical test, or new parameter scan.

## 1. Research question and figure map

The question is whether the amount and directional allocation of reputation inertia have different evolutionary consequences. Figure 4 compares allocations under a fixed total depth. ED6 shows the two-dimensional depth landscape and separates average cooperation from local protection of pure DISC.

| Figure | Code and combined output | Displayed domain |
|---|---|---|
| Figure 4 | [Figure4_Total_Depth.ipynb](Figure4_Total_Depth.ipynb); [combined figure](figures/figure4/Figure4_combined.pdf) | Every nonnegative integer allocation with $K=k_1+k_2\in\{0,\ldots,8\}$: 45 per norm, 180 conditions. |
| ED6 | [Extended_Data_Figure6.ipynb](Extended_Data_Figure6.ipynb); [combined figure](figures/extended_data_figure6/Extended_Data_Figure6_combined.pdf) | $k_1,k_2\in\{0,\ldots,7\}$: 64 per norm, 256 conditions. |

Both figures have four single panels, ordered Scoring (SC), Shunning (SH), Stern Judging (SJ), and Simple Standing (SS). Each single panel and composite is available in PDF and SVG. The historical notebook name `Fig5_total_depth_best_allocations` refers here to manuscript Figure 4.

## 2. Model, parameters, and measured cooperation

ALLC always intends to cooperate, ALLD always defects, and DISC intends to cooperate with recipients it privately regards as good. Implementation error $e_1$ turns intended cooperation into defection, and assessment error $e_2$ reverses the prescribed assessment. Observers apply their social norm to the realized action using their own private image of the recipient.

All four norms approve cooperation with a good recipient and disapprove defection against a good recipient. Toward a bad recipient, SC approves cooperation only, SH approves neither action, SJ approves defection only, and SS approves both actions.

The direct-reset reputation record contains established good and bad states, $k_1$ warning states, and $k_2$ recovery states. Losing good standing requires $k_1+1$ consecutive negative assessments; recovery requires $k_2+1$ consecutive positive assessments. Positive evidence resets a warning directly to good, and negative evidence resets a recovery state directly to bad. These are consecutive assessments in an observer's record of a target.

Both figures use full readout, $\alpha=\beta=1$: warning states are treated as good and recovery states as bad. Thus $k_1$ controls tolerance of negative evidence and $k_2$ controls strictness of recovery. Total depth $K$ counts intermediate states, giving $K+2$ internal states. It is a structural constraint; no explicit cost of memory is added to the payoff.

Reference settings are $b/c=5$, $c=1$, and $e_1=e_2=0.02$. The theoretical private-image closure treats donor and observer images as conditionally independent given recipient strategy. At every strategy composition, stationary reputations are selected from the all-good initialization by the auxiliary flow

$$
\frac{\mathrm d r_I}{\mathrm d\tau}=\mathcal R(\varphi_I)-r_I,
$$

where $\mathcal R$ is the stationary response of the direct-reset record and $\varphi_I$ is its positive-assessment input. This is a stationary self-consistency calculation, not the exact transient dynamics of every internal state. Strategies evolve more slowly by the three-strategy replicator equation. The full computational definitions are included in each notebook, including `reputation_transform`, `positive_assessment_probabilities`, `payoffs`, and `strategy_rhs_from_reputations`.

For composition $\boldsymbol f$, let $\bar r=\sum_I f_Ir_I$. Realized cooperation is

$$
C(\boldsymbol f)=(1-e_1)\left(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\bar r\right).
$$

The plotted value is the mean of this quantity at the final states of 512 initial strategy compositions. Each has equal weight under the specified area-uniform sampling construction. This is an initial-condition average, not cooperation at a single equilibrium and not the probability of reaching pure DISC. The largest possible realized value at the reference error is $0.98$.

This dataset uses one shifted-Halton sample, seed 2026, constructed by the source fallback and reflected into the strategy triangle. Its identification is supported by an analytic SC control described below. It has no independent replicate-based SEM or confidence interval. Do not attribute the eight Sobol repetitions used in the earlier ED4 analysis to these figures.

## 3. Figure 4: fixed total depth and observed allocation maxima

The horizontal axis is $K=k_1+k_2$, and the vertical axis is basin-weighted realized cooperation. Each point is one allocation. Small horizontal offsets, at most 0.1, separate nonwinning points; their true depth remains the integer $K$. Pale dashed vertical connectors show the range of values at each depth, not an uncertainty interval.

Color encodes $k_1/K$: orange means all depth is allocated to strictness, pale gray means balanced allocation, and blue means all depth is allocated to tolerance. At $K=0$, the ratio is undefined; its display value is set to 0.5 as a neutral color convention.

The black line connects

$$
C_K^{\max,\mathrm{obs}}=
\max_{k_1+k_2=K}\widehat{\mathbb E}[C\mid k_1,k_2].
$$

Outlined points and labels identify the winning observed allocation. Exact ties favor larger $k_1$. The line connects discrete tested budgets; it is not a continuous optimization or an uncertainty band. The 36 records, including gaps to the second observed value, are in [best_allocations.csv](data/figure4/best_allocations.csv).

### Direct observations

| Norm | Winning allocations over the displayed budgets | Representative values |
|---|---|---|
| SC | $(K,0)$ for every $K=1,\ldots,8$. | The envelope rises from 0.609765 at $K=0$ to approximately 0.89387 around $K=4$-6, then is 0.890038 at $K=8$. |
| SH | $(K,0)$ for every $K=1,\ldots,8$. | The envelope rises from a near-zero numerical floor to 0.696717 at $(3,0)$ and 0.819218 at $(8,0)$. |
| SJ | $(1,0),(2,0),(2,1),(3,1),(3,2),(4,2),(4,3),(5,3)$ for $K=1,\ldots,8$. | Mixed allocations become the observed winners from $K=3$; the value at $(4,3)$ is 0.704374 and at $(5,3)$ is 0.706289. |
| SS | $(1,0),(1,1),(1,2),(1,3),(1,4),(2,4),(2,5),(2,6)$ for $K=1,\ldots,8$. | The envelope is 0.533481 at $K=0$, 0.697988 at $(1,1)$, and 0.830390 at $(2,6)$. |

The same total depth can therefore produce very different observed cooperation, depending on its allocation. SC also shows why the result should not be summarized as a monotonic benefit of greater depth: its displayed envelope plateaus and slightly decreases at larger budgets.

The earlier recognition-selected pairs lie on the current observed cooperation envelope at their respective budgets:

| Norm | Recognition-selected pair | Total depth | Mean realized cooperation | Pure DISC locally protected against ALLC and ALLD? |
|---|---|---:|---:|---|
| SC | $(2,0)$ | 2 | 0.876603 | Yes |
| SH | $(3,0)$ | 3 | 0.696717 | Yes |
| SJ | $(4,3)$ | 7 | 0.704374 | Yes |
| SS | $(1,2)$ | 3 | 0.742908 | No; ALLC has positive invasion advantage. |

These pairs were selected by recognition criteria in the earlier analysis, rather than optimized for the present cooperation statistic. Their coincidence with the envelope is restricted to the tested setting and budget. It does not make them unique global optima or statistically separated winners.

### Mechanistic interpretation

The observed allocations are consistent with the assessment rules. SC condemns defection regardless of recipient standing, and SH approves only cooperation with good recipients; longer warning paths can buffer negative assessments of conditional cooperators. SJ makes assessments depend strongly on recipient images, making both directions relevant under private disagreement. Under SS, defectors can receive positive assessments for refusing bad recipients, so a longer recovery requirement can help limit their return to good standing.

These are model-consistent explanations of the pattern. The two figures do not isolate each causal pathway, determine the exact winning integers analytically, or demonstrate that increasing a particular depth has the same effect under every norm.

## 4. ED6: the depth landscape and local invasion resistance

The horizontal axis is tolerance depth $k_1$ and the vertical axis strictness depth $k_2$, each from 0 to 7. Blue color shows mean realized cooperation on a common linear scale from 0 to 1. Dotted hatching reports a separate property: pure DISC has negative payoff advantages for both rare ALLD and rare ALLC.

With $c=1$, $R=b/c$, all-DISC resident reputation $r$, and reputations $r_D,r_C$ of the two rare mutants, the saved advantages are

$$
\lambda_D=(1-e_1)[Rr_D-(R-1)r],\qquad
\lambda_C=(1-e_1)[Rr_C-1-(R-1)r].
$$

Hatching uses the source rule $\lambda_D<0$ **and** $\lambda_C<0$, without the boundary tolerances used in some earlier ED3/ED5 plots. It is a local test against these two unconditional strategies, not a test against every possible mutant or an estimate of a cooperative basin.

### Direct observations and numerical examples

SC and SH favor tolerance-dominated high-cooperation regions. SJ exhibits a high-cooperation region requiring depth in both directions. SS has high-cooperation allocations with appreciable strictness depth. However, darker color and hatching do not coincide everywhere. For example, SS $(1,2)$ has mean cooperation 0.742908 but $\lambda_C\approx0.001553>0$, so pure DISC is vulnerable to ALLC there.

The largest observed values **within the ED6 square** are:

| Norm | Pair | Total depth | Mean realized cooperation |
|---|---|---:|---:|
| SC | $(6,0)$ | 6 | 0.893867 |
| SH | $(7,0)$ | 7 | 0.817304 |
| SJ | $(7,6)$ | 13 | 0.742656 |
| SS | $(2,7)$ | 9 | 0.841809 |

These maxima have different total depths and are not comparisons at equal structural budget. The exact maximizer can depend on the finite initial sample and numerical resolution; no replicate uncertainty or mesh-refinement study is supplied.

The square and triangular scans overlap in 172 displayed parameter conditions, and their current numerical fields agree there. ED6 contains all allocations at fixed $K\leq7$, but omits $(0,8)$ and $(8,0)$ at $K=8$. Consequently, ED6 alone cannot reconstruct the full Figure 4 envelope at $K=8$. Conversely, ED6 includes total depths above 8, explaining why its SJ and SS maxima are outside Figure 4's displayed domain.

## 5. Computation, convergence, and changes from the old results

### Source chain and numerical method

| Result | Original numerical source | Plotting source used for the current layout |
|---|---|---|
| Figure 4 | `25_server_total_depth_scan.py` and `25_total_depth_publication.csv` | `Fig5_total_depth_best_allocations.ipynb`, final spread-layout cell 8, with readable labels restored. |
| ED6 | `24_server_k1_k2_scan.py` and `24_k1_k2_publication.csv` | The appended blue heatmap cell 3 of the final `28_k1_k2_discrete_cooperation_ess.ipynb`. The earlier server notebook lacks this final style. |

Both numerical scanners use the same relevant model functions. The new notebooks include the required functions and use relative data paths. Original CSVs are preserved unchanged under the two `source/` directories; [source_manifest.csv](data/source_manifest.csv) records source names and hashes.

Reputations are solved on a 300-point triangular strategy mesh, resolution 23, using all-good RK4 with a $10^{-9}$ true residual requirement. The initial reputation stage uses time step 0.1 and up to 20,000 steps, followed by continuation at 0.2 for up to 80,000 steps when needed. The equilibrated strategy field is linearly interpolated, and strategy trajectories use midpoint integration at time step 0.1. Instantaneous SC instead uses its analytic field and time step 0.05.

The source observable gate requires changes in the ensemble mean realized cooperation of at most $2\times10^{-5}$ on two consecutive checks, in blocks of 4,000 strategy steps. The original cap was eight blocks. This gate does not require a small residual for every trajectory, or small individual trajectory changes. `residual_q99` is a separate diagnostic; for example, saved instantaneous SS has a value around 0.00348 despite passing the mean gate.

### Three accepted reconstructions

SC, SH, and SS at $(1,1)$ failed that original gate. Their current-environment reconstructions use the same identified initial sampler and model, with an extended cap of 64 blocks. They passed after the following actual step counts:

| Norm | Original mean at 32,000 steps | Current final mean | Current steps | Current strategy residual q99 |
|---|---:|---:|---:|---:|
| SC | 0.5912128135 | 0.5892760519 | 40,000 | $1.36\times10^{-5}$ |
| SH | 0.0248838758 | 0.0248319034 | 44,000 | $1.93\times10^{-4}$ |
| SS | 0.6980023102 | 0.6979881699 | 36,000 | $1.87\times10^{-5}$ |

Every mesh and final reputation solve in these reconstructions passed $10^{-9}$. The strategy criterion remains the original mean gate; in particular, the SH row must not be described as having every trajectory equilibrated.

The source code could choose Sobol or a shifted-Halton fallback depending on SciPy availability. A no-inertia SC control, which avoids the interpolation mesh, reproduces the original summary at floating-point precision using the fallback: mean 0.6097647422, cooperative fraction 0.6328125, and 16,000 steps. The new notebooks therefore make shifted-Halton sampling explicit.

The historical trajectory endpoints and actual interpolation topology were not saved. Current reconstruction at the original 32,000-step horizon does not reproduce all old values: the SC cooperative count differs by one of 512 starts. The precise source of the remaining numerical difference is unresolved. Thus the three replacements are documented recalculations, not exact continuation of old trajectories. The user explicitly chose these converged current-environment values with full old/new records.

Only these three conditions were recomputed; the other 177 Figure 4 rows and 253 ED6 rows retain their original row text. Relative to the earlier plotted table, the 36 winning allocation labels are unchanged; the SS envelope value at $K=2$ is updated. This comparison does not validate the old failed values.

The original Figure 4 table extends to $K=10$ and contains a separate failed SH $(2,8)$ row. All $K=9,10$ rows are outside the final Figure 4 domain, so that failed value is retained only in the source archive and is not plotted or used in the present envelope.

## 6. Reading limits and files for continuation

The figures support norm-dependent allocation effects within a specified finite scan. They connect a fixed-depth comparison to a broader depth landscape and show that local protection of pure DISC and average cooperation can differ.

They do not establish universal optimal memory depths, a benefit from every increase in depth, statistically significant rankings, or resistance to arbitrary mutants. There is no independent initial-sample repetition, full mesh-refinement test, or exact archival interpolation environment. The current tables pass the source observable criterion, which is weaker than requiring every trajectory to settle at a strategy equilibrium.

| File or directory | Role |
|---|---|
| [total_depth_results.csv](data/figure4/total_depth_results.csv) | All 180 displayed allocation results, including the three accepted replacements. |
| [best_allocations.csv](data/figure4/best_allocations.csv) | The 36 observed maxima, winning pairs, gaps, and tie information. |
| [24_k1_k2_publication.csv](data/extended_data_figure6/24_k1_k2_publication.csv) | All 256 current ED6 cells, cooperation values, payoff advantages, and local flags. |
| [data/repairs/](data/repairs/) | Corrections, old/new values, chunk histories, initial arrays, final states and reputations, and reconstructed mesh fields. |
| [validation/targeted_repairs.json](validation/targeted_repairs.json) | Sampler control, reconstruction scope, residuals, and archival limitations. |
| [validation/](validation/) | Notebook execution, source integrity, numerical checks, and figure checks. |

Default execution of both notebooks has been verified. It loads external data and does not rerun the full 180- or 256-condition scans. The supplied figures have been rendered and inspected. A public regeneration path is included, but a complete fresh scan with the extended horizon has not been executed.

### Handoff text for a new conversation

> We study private indirect reciprocity with ALLC, ALLD, and DISC under SC/SH/SJ/SS and direct-reset directional reputation inertia. Read this guide and the two notebooks before drafting. Figure 4 compares all allocations with total depth K=0-8; ED6 scans k1,k2=0-7. Both use full readout, b/c=5, errors 0.02, and realized cooperation averaged over one shifted-Halton sample of 512 initial strategy compositions, seed 2026. The black envelope is the largest observed value at each tested K, not a statistically established global optimum. ED6 hatching means negative rare-ALLD and rare-ALLC payoff advantages in pure DISC, separate from average cooperation. Three originally failed one-step conditions were reconstructed and extended in the current environment, with original/new values and arrays retained. Their mean gates pass, but not every strategy residual vanishes; the old interpolation environment is unavailable. All other displayed rows retain their source values. Keep these limits explicit, do not attribute ED4's repeated Sobol statistics to this dataset, and do not add model costs or evolutionary conclusions without evidence.
