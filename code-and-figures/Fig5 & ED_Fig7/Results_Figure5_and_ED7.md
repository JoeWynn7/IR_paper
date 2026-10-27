# Results guide: Figure 5 and Extended Data Figure 7

This guide describes the current figures and saved numerical results for a new conversation. It provides a brief interpretation of the specified IID opportunity-to-defect model; it does not introduce a new strategy family, statistical test, or parameter scan.

## 1. Question and figure map

The figures ask whether an established discriminator population can resist a rare individual that occasionally withholds cooperation from recipients it regards as good, and how this depends on the reputation readout and benefit-to-cost ratio.

| Figure | Contents | Notebook and combined output |
|---|---|---|
| Figure 5 | Two SJ panels: invasion curves for five specified mechanisms, and a readout scan for the selected multi-step architecture. | [Figure5_Opportunistic_Invasion.ipynb](Figure5_Opportunistic_Invasion.ipynb); [combined figure](figures/figure5/Figure5_combined.pdf) |
| ED7 | One cross-norm strip panel and eight readout/benefit maps, comparing one-step and selected multi-step inertia under four norms. | [Extended_Data_Figure7.ipynb](Extended_Data_Figure7.ipynb); [combined figure](figures/extended_data_figure7/Extended_Data_Figure7_combined.pdf) |

The historical names of the source notebooks use different figure numbers. The final ED7 assembly uses the cooperation-background plotting version. The source notebook also contains an invasion-window background and an additional $\beta$ analysis; those are not components of this ED7 release.

## 2. Model and the tested mutant family

The well-mixed resident population uses DISC: an individual intends to cooperate when it privately regards the recipient as good and defects otherwise. Observers independently use their own private images when applying a shared norm to the realized action. Intended cooperation fails with probability $e_1$, and the prescribed assessment is reversed with probability $e_2$. The theoretical closure treats donor and observer images as conditionally independent given recipient strategy.

The direct-reset reputation record has $k_1$ warning states and $k_2$ recovery states. A positive assessment resets a warning state to good; a negative assessment resets a recovery state to bad. At warning level $m$, the probability of a good readout is $\alpha^m$; at recovery level $n$, it is $1-\beta^n$. The stationary good-readout response to a positive assessment probability $u$ is denoted $\mathcal R(u)$ and is implemented in both notebooks as `reputation_map`.

The four norms differ in prescribed approval of actions toward a recipient regarded as bad: SC approves cooperation only, SH approves neither action, SJ approves defection only, and SS approves both actions. Cooperation toward good is approved, and defection toward good is disapproved, under all four.

The rare mutant O-DISC independently skips cooperation toward a recipient it regards as good with probability $\delta\in[0,1]$ on each interaction. It defects against recipients it regards as bad. Thus $\delta=0$ is behaviorally identical to DISC, while $\delta=1$ behaves as ALLD. The mutant is rare enough that it does not change the resident reputation environment. The omission decisions are IID: neither a persistent mode nor temporal correlation is included.

Let $r_R$ be the selected resident probability of being read as good, $r_X$ the mutant's stationary good-reputation probability, and $z=b/c$. In the resident population, define $u_C$ and $u_D$ as the probabilities of a recorded positive assessment for intended cooperation and defection, averaged over the observer's recipient image. Write

$$
\Delta u=u_C-u_D,\qquad u_R=r_Ru_C+(1-r_R)u_D,\qquad
u_X=u_R-\delta r_R\Delta u,\qquad r_X=\mathcal R(u_X).
$$

Under the same payoff and private-image closure, resident and mutant payoffs satisfy

$$
\Pi_R=(1-e_1)(b-c)r_R,\qquad
\Pi_X=(1-e_1)[br_X-c(1-\delta)r_R].
$$

The dimensionless invasion quantity plotted in Figure 5 is

$$
\Lambda(\delta)=\frac{\Pi_X-\Pi_R}{c(1-e_1)}
=\delta r_R-z(r_R-r_X).
$$

A positive value gives the tested rare mutant a payoff advantage. At $\delta=0$, the mutant is a resident clone and $\Lambda(0)=0$ by neutrality. For $\delta>0$, the first term represents saved cooperation cost and the second is the payoff effect of the mutant's reputation difference. The latter can be a gain or a loss: for example, the saved SJ multi-step low-branch case at $\alpha=0$ has $\Delta u\approx-0.193925$, so omission can raise the mutant's reputation. At $\delta=1$, the mutant is ALLD, so excluding ALLD only checks one endpoint of this family.

The local slope is

$$
\Lambda'(0)=r_R[1-z\Delta u\,\mathcal R'(u_R)].
$$

This slope characterizes sufficiently small deviations when nonzero. It does not replace a check of the rest of $\delta\in(0,1]$; a zero slope also requires the remaining curve or higher-order terms to be checked.

Unless varied on an axis, $e_1=e_2=0.02$, $\beta=1$, and $z=5$. Resident reputations are chosen from the highest strictly stable scalar self-consistent root found numerically. Away from marginal folds this generally corresponds to all-good scalar relaxation; a marginal fold root does not meet the strict stability criterion. The full internal-state transient and arbitrary resident populations are not simulated by these figures.

## 3. Figure 5: opportunistic invasion and readout under SJ

### Panel a: five specified mechanisms

The horizontal axis is the IID omission probability $\delta$ and the vertical axis is $\Lambda(\delta)$. The graph clips negative tails below $-0.15$; complete values are saved in [panel_a_curves.csv](data/figure5/panel_a_curves.csv). Open circles mark nonzero crossings. There is no near-zero inset in the final visible layout.

The two external comparison mechanisms have their own reputation responses:

- **Aggregation:** $M=2$, $Q=1$; at least one of two assessments must be positive for a good classification.
- **Quantitative:** a reflecting integer score from $-5$ to $5$, increasing or decreasing by one after a positive or negative assessment; scores at least $S=0$ are read as good.

These are the specified baselines, not a comparison matched for total memory cost or optimized over every baseline parameter.

The saved results are:

| Mechanism | Resident intended cooperation $r_R$ | $\Lambda'(0)$ | Upper end $\delta_c$ of the positive-invasion interval |
|---|---:|---:|---:|
| Full one-step, $(k_1,k_2)=(1,1)$, $\alpha=\beta=1$ | 0.995307 | 0.077075 | 0.008397 |
| Full multi-step, $(4,3)$, $\alpha=\beta=1$ | 0.9999996 | 0.999760 | 0.365299 |
| Multi-step, $(4,3)$, $\alpha=0.8,\beta=1$ | 0.986509 | -0.018056 | 0; no positive interval found |
| Aggregation, $(M,Q)=(2,1)$ | 0.998188 | 0.599876 | 0.137033 |
| Quantitative, $(R,S)=(5,0)$ | 0.999999995 | 0.999997 | 0.383206 |

Source: [panel_a_summary.csv](data/figure5/panel_a_summary.csv). The positive intervals in these displayed cases, where present, start immediately above the neutral point $\delta=0$. All five saved cases exclude ALLD at $\delta=1$, yet four have a positive interval for weaker opportunism. In particular, the one-step window is narrow and is hard to distinguish at the main plot scale; it is not absent.

The specified full multi-step case gives a wider observed window than the one-step case under these settings. Reducing its readout parameter to $\alpha=0.8$ removes the positive window found by the numerical search while retaining high resident cooperation. This comparison alone does not show that all multi-step mechanisms are more vulnerable, or that one reputation architecture dominates every aggregation or quantitative alternative.

### Panel b: readout adjustment for $(k_1,k_2)=(4,3)$

The horizontal axis is $\alpha\in[0,1]$. The upper axis shows $\delta_c$, the largest upper endpoint of a detected positive-invasion interval; zero denotes that no positive interval was found. The lower axis shows resident **intended** cooperation $r_R$. Realized cooperation is $(1-e_1)r_R=0.98r_R$ here.

The saved green interval is approximately

$$
\alpha\in(0.5669858454,\,0.8036039715].
$$

The lower end is a resident-branch fold and is excluded from the strictly stable high branch. The upper end is a neutral invasion boundary and is included under the numerical convention. Endpoint inclusion is defined using the unrounded boundary values.

At $\alpha=0.8$, $r_R\approx0.986509$ and realized cooperation is about 0.966779. At $\alpha=1$, $r_R\approx0.9999996$ but the tested mutant has a positive interval extending to $\delta_c\approx0.365299$. The comparison illustrates a setting-specific tradeoff: a modest reduction in resident cooperation accompanies the disappearance of the detected IID invasion window. It is not a statistical estimate or a result for all error rates and norms.

The Figure 5 source uses 5,015 nonuniform $\delta$ points, near-zero refinements and Brent refinement of sign changes; its alpha scan has 1,006 points. Its saved checks provide strong finite-grid evidence but do not by themselves prove that no narrower positive interval exists anywhere between sampled values. The ED7 calculation below uses a separate rational-function extremum search for the same IID family.

## 4. ED7: norm, mechanism, readout, and benefit-to-cost ratio

### Layout and interpretation

The cross-norm panel has eight strips: each norm has a one-step row and a selected multi-step row. The latter depths are SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, and SS $(1,2)$. The strip axis is $\alpha$, with $z=5$.

The eight maps have $\alpha\in[0,1]$ horizontally and $z=b/c\in[2,8]$ vertically, sampled at 161 benefit values. Each norm has a one-step and a multi-step map. The open circle on each map marks $(\alpha,z)=(0.8,5)$.

Green color is resident **intended cooperation** $r_R$. It is shown both inside and outside the secure region and is constant along the benefit-ratio direction at fixed $\alpha$, because benefits and costs affect payoff comparison but not the resident assessment equation. Black outlines and boundary curves show security against the tested IID O-DISC family. No minimum-cooperation threshold is imposed.

For $\delta>0$, define the normalized reputation-loss response

$$
H(\delta)=\frac{r_R-r_X(\delta)}{\delta r_R},
$$

with its limiting value used at $\delta=0$. Then $\Lambda=\delta r_R[1-zH(\delta)]$. The ED7 source uses polynomial roots to find candidate stationary points of the rational response and compares them with the endpoints. Its root filter retains interior candidates with $\delta>10^{-8}$; the resulting minimum is a numerical calculation, not a formal proof that every possible extremum was found. Its security condition is $1-z\min H\leq10^{-10}$. This is a tolerance on the normalized condition. The calculation applies to the IID O-DISC family and the specified scalar resident branch, not all possible mutants or full-state transient dynamics.

### Secure readout intervals at $b/c=5$

The table rounds boundaries to six decimals; the interval brackets reflect the unrounded endpoint flags in [c_secure_alpha_intervals.csv](data/extended_data_figure7/c_secure_alpha_intervals.csv).

| Norm | One-step $(1,1)$ | Selected multi-step |
|---|---|---|
| SC | $(0.431929,\,0.966915]$ | $[0,\,0.807064]$ |
| SH | $(0.864863,\,0.989948]$ | $(0.591161,\,0.806464]$ |
| SJ | $(0.852446,\,0.988514]$ | $(0.566986,\,0.803604]$ |
| SS | $[0,\,0.965245]$ | $[0,\,1]$ |

The original assembled figure wrote the bounds as uniformly closed intervals. That is incorrect at fold boundaries: a fold is not a strictly stable high-branch point. The current strip plot marks such excluded ends with open circles. Domain endpoints and neutral-invasion endpoints are included where the saved flags specify them.

At the marked reference $(0.8,5)$, the current tables give:

| Norm | One-step $r_R$; IID secure? | Multi-step $r_R$; IID secure? |
|---|---|---|
| SC | 0.983571; yes | 0.989782; yes |
| SH | 0.000728; no | 0.986341; yes |
| SJ | 0.470247; no | 0.986509; yes |
| SS | 0.983927; yes | 0.977886; yes |

Source: [reference_point_08_5.csv](data/extended_data_figure7/reference_point_08_5.csv). These entries are particular branch-specific theoretical values, not averages over initial strategy frequencies. At $z=2$, SH has no secure interval in either mechanism, while SJ has very narrow secure intervals that can be difficult to see at map resolution. The [benefit-ratio interval table](data/extended_data_figure7/benefit_alpha_intervals_both_mechanisms.csv) is the appropriate source for their numerical endpoints.

The selected multi-step SS mechanism is IID-secure for the full displayed $\alpha$ range at $z=5$, but this does not enforce high resident cooperation at every readout: the saved $r_R$ is about 0.622053 at $\alpha=0$. Security and cooperation are distinct outputs.

## 5. How the figures relate to earlier local invasion results

Figure 5 shows directly why resistance to ALLD need not imply resistance to intermediate IID omission probabilities. ED7 extends the same family-level question across norms and parameters.

The IID family goes from DISC to ALLD; it does not contain ALLC, which also cooperates with recipients it regards as bad. For example, selected multi-step SS at $\alpha=\beta=1$ and $z=5$ is secure against the IID O-DISC family in ED7, while the earlier ED6 result has a positive ALLC invasion advantage of approximately 0.001553. The [saved ED6 reference row](data/comparison/ED6_SS_multistep_reference.csv) records that separate test. These results concern different mutant families and are compatible.

Do not describe IID-family security as an unrestricted evolutionary stable strategy, as protection against ALLC, or as proof of a large basin of attraction. The figures do not compare mechanisms under a matched memory budget, supply replicate uncertainty, or test temporal persistence. The earlier recognition-selected depths remain fixed inputs here; they were not optimized for opportunism resistance.

## 6. Data, checks, and reproducibility

| Evidence | Role |
|---|---|
| [data/figure5/](data/figure5/) | Five full curve tables, summary and readout boundaries, 1,006-point scan, source validation, and saved 1,006-by-1,001 alpha-delta map. |
| [data/extended_data_figure7/](data/extended_data_figure7/) | Eight stored fields, resident profiles, 1,288 benefit-ratio boundary records, endpoint flags, and reference points. |
| [data/comparison/](data/comparison/) | Existing ED6 SS reference and the source table's identity. |
| [validation/figure5_validation.json](validation/figure5_validation.json) | Direct checks of all five saved curves, the 1,006 resident points, refined crossings, the saved alpha-delta map, and quantitative-chain identities. |
| [validation/ed7_validation.json](validation/ed7_validation.json) | Saved resident residuals and stability, eight reference comparisons, selected direct-$\delta$ checks, and a small boundary recomputation. |

Both notebooks have been executed with their supplied data. Figure 5 checks all five curves against its equations; ED7 checks all 4,822 stored resident points, whose largest fixed-point residual is approximately $7.22\times10^{-16}$ and whose scalar flow derivatives meet the source's strict stability criterion. These checks do not establish full-state transient stability or prove that the full root search is exhaustive.

The two SJ multi-step datasets agree in IID security classification at 203 common $\alpha$ points and in resident reputation to within $4.1\times10^{-13}$. The saved Figure 5 map is checked on a finite grid. ED7 additionally searches numerical stationary points of the rational response over $\delta$, subject to the root-filter limitations above; the complete alpha-benefit scan was not rerun in this release. There are no stochastic-replication error bars in these deterministic stationary calculations.

Both notebooks expose `RECOMPUTE=True` for the displayed numerical calculations. This can be expensive and overwrites their current relative data outputs; preserve a separate copy before using it. The default workflow reads supplied data and does not initiate a full scan. Original research files and the earlier figures remain unchanged.

### Handoff text for a new conversation

> We study direct-reset reputation inertia in private indirect reciprocity. Figure 5 and ED7 test a rare IID O-DISC that independently skips cooperation toward privately good recipients with probability delta; it is DISC at delta=0 and ALLD at delta=1. Read this guide and both linked notebooks before drafting. The plotted normalized advantage is Lambda=delta*r_R-(b/c)*(r_R-r_X); positive values permit invasion. Figure 5 uses SJ, b/c=5, e1=e2=.02, beta=1 and compares full one-step, multi-step (4,3) at alpha=1 and .8, aggregation (M=2,Q=1), and a reflecting quantitative score (R=5,S=0). The one-step positive window is narrow, not absent. The SJ multi-step secure readout interval is approximately (0.566986,0.803604], with the fold excluded. ED7 compares one-step and selected multi-step architectures across four norms, using resident intended cooperation as the green background and IID-family security as black boundaries. Bounds at folds are open; the original uniform closed-interval legend was incorrect. IID security does not imply resistance to ALLC or arbitrary mutants, and no cooperation threshold is built into the ED7 security test. Saved data and limited validation are included; full scans were not rerun, and time-correlated/persistent opportunism remains outside scope. Continue from these existing results without introducing new model assumptions or unsupported conclusions.
