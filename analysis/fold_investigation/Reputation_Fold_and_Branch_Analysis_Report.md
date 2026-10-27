# Reputation Folds, Branch Discontinuities, Branch Selection, and Initial-Reputation Dependence

**Technical report — IR_paper (indirect reciprocity with direct-reset reputation inertia)**
Date: 2026-10-27

---

## 0. How to read this report

This report summarizes a focused investigation carried out after the repository audit. It does not re-describe the full model; the model is as stated in `code-and-figures/Model.md` (direct-reset internal records with depths k1, k2; readout α^m and 1 − β^n; conditional-independence private-assessment closure; fast reputation, slow replicator dynamics).

Every statement is labelled by its evidential source:

| Label | Meaning |
|---|---|
| **[R]** | Result already contained in the repository (code, data, or results guides). |
| **[N]** | New analysis or check performed in this investigation (independent code; not part of the repository). |
| **[I]** | Interpretation based on [R] and/or [N] results. |

No repository file was modified. All new code and outputs are in `/home/claude/fold_investigation/` (Section 9).

**Parameter settings used throughout** (unless stated otherwise): b/c = 5, c = 1, e1 = e2 = 0.02; norms SC (p,q) = (1,0), SH (0,0), SJ (0,1), SS (1,1).

| Condition label | (k1, k2) | (α, β) |
|---|---|---|
| none (instantaneous) | (0,0) | (0,0) |
| one (full one-step) | (1,1) | (1,1) |
| multi (selected multi-step) | SC (2,0), SH (3,0), SJ (4,3), SS (1,2) | (1,1) |

Compositions are written f = (f_ALLC, f_ALLD, f_DISC).

---

## 1. Questions investigated

1. **Fold structure.** Does the reputation self-consistency equation r_I = 𝓡(φ_I(r, f)) have folds (saddle-node bifurcations) and bistability as the strategy composition changes? Where, and how do they differ between no inertia, one-step inertia, and selected multi-step inertia?
2. **Mapping to strategy dynamics.** Do fold-induced reputation collapses change the payoff ordering and redirect evolutionary trajectories? Are the observed basin boundaries ordinary separatrices of strategy equilibria, reputation-fold boundaries, or both?
3. **Mechanism of the multi-step gain.** Can the large increase in sampled cooperation under the selected multi-step architectures be attributed to removal, displacement, or weakening of reputation folds?
4. **Branch selection.** Can the different procedures used in the repository (vector all-good relaxation, scalar all-good relaxation, highest strictly stable root) be unified under one rule that corresponds to the actual reputation dynamics from an all-good initial state?
5. **Initial-reputation dependence.** What happens from all-bad (and intermediate) initial reputations? Is this equivalent to the bistability in ED Figure 2, and is ED Figure 2 sufficient to support the corresponding claim?

---

## 2. Analyses performed

### 2.1 Tools built for this investigation [N]

| Tool | File | What it does |
|---|---|---|
| Model library | `lib.py` | 𝓡(u) for arbitrary (k1,k2,α,β); error-adjusted A_aR; φ_I; payoffs; replicator field; vector auxiliary relaxation from any initial r; full internal-state occupation ODE; exact copy of the repository's shifted-Halton sampler (seed 2026). |
| Exhaustive equilibrium finder | `lib.scan_equilibria` | Exact reduction of the 3-dimensional self-consistency system to one scalar equation in r̄ (given r̄: r_C = 𝓡(φ_C(r̄)), r_D = 𝓡(φ_D(r̄)), r_DISC = (r̄ − f_C r_C − f_D r_D)/f_DISC). Scans r̄ ∈ [0,1] (2,001–20,001 points), refines sign changes by bisection, and classifies each root by the eigenvalues of the auxiliary-flow Jacobian. |
| Branch continuation | `edges.py` | Along three composition paths: all equilibria, all-good and all-bad re-initialized selection, quasi-static tracking in both directions, and full-state ODE selection from all-G. |
| Simplex maps | `maps.py` | Same quantities on an 80-resolution triangular grid (3,240 compositions with f_DISC > 0). |
| Strategy dynamics, tracking rule | `dyn.py` | Fast–slow integration: reputations relax fully from r0 (all-good or all-bad) at t = 0, then follow the auxiliary flow (4 RK4 substeps of size 0.5 per strategy step, i.e. timescale ratio ε = 0.05). Strategy midpoint step dt = 0.1, horizon T = 3000. |
| Strategy dynamics, re-initialized rule | `dyn_mesh.py` | (i) repository-style replicator-field interpolation on a resolution-23 mesh; (ii) re-initialized reputations on a fine resolution-160 lattice, linearly interpolated, with payoffs evaluated exactly. |
| Trajectory mechanism classification | `foldtest2.py` | Re-integrates every defecting trajectory with full history and tests, by scanning equilibria along the path, whether it occupied the high branch inside a bistable region before ending low (fold crossing). |
| Basin grid | `basin_grid.py` | Tracking dynamics from an 861-point grid of initial compositions (resolution 40). |
| Finite-population simulator | `fpsim.c`, `fpsim.py` | C re-implementation of the repository's private-record event process (`_simulate_replicate` in `Figure2.ipynb` / `Extended_Data_Figure1.ipynb`), with selectable initial internal state (all-G or all-B) and unequal strategy counts. |
| Summary | `classify.py` → `summary_512.csv` | Per-condition comparison of all rules and initial conditions on the 512-start sample. |

### 2.2 Validation of the new tools [N]

| Check | Result |
|---|---|
| Engine vs. repository Figure 4 values (resolution-23 field interpolation, same sampler, same gate-free horizon) | SH one 0.0249 (repository 0.0248); SH multi 0.6967 (0.6967); SJ one 0.2305 (0.2306); SJ multi 0.7044 (0.7044); SC one 0.5912 (0.5912, original); SC multi 0.8766 (0.8766); SS none 0.5335 (0.5335); SS one 0.6980 (0.6980); SS multi 0.7429 (0.7429). |
| Exception | SC without inertia: mesh interpolation destroys the neutral equilibrium segment (gives 0.0013). The repository correctly uses an analytic field for this case (0.6098), and so does the tracking engine (0.6083). |
| Finite simulator vs. ED1 (N = 150, equal composition, all-G) | SC one: g = (0.468, 0.997, 0.0008) vs ED1 (0.465, 0.997, 0.0008); SC multi: (0.958, 1.000, 0.058) vs (0.957, 1.000, 0.059); SJ one ≈ 0.51/0.50/0.50; SJ multi (1.000, 0.973, 0.105) vs (1.000, 0.972, 0.105). |
| Mean-field all-good selection vs. full internal-state ODE from all-G | Identical selected branch at every sampled point along all three composition paths, including inside bistable regions. |
| Timescale-ratio sensitivity of the tracking rule | SH one-step sampled cooperation 0.0763 at ε = 0.0125, 0.05, and 0.2 (identical). |

### 2.3 A corrected issue during the investigation [N]

The first version of the r̄-scan rejected roots whose computed r_DISC slightly exceeded 1 numerically, so it missed some high-reputation equilibria at small f_DISC (e.g., SJ (4,3) in ALLC-rich compositions). The scanner was corrected (tolerance window extended before accepting only roots with 0 ≤ r_DISC ≤ 1), and the map and edge scans were recomputed. A first trajectory-jump detector (based on reputation change per unit composition change) also proved unreliable because fold collapses usually occur early, while compositions are still changing rapidly; it was replaced by the path-bistability classification in `foldtest2.py`. All numbers in this report come from the corrected procedures.

---

## 3. Findings: reputation folds and branch discontinuities

### 3.1 Homogeneous DISC (pure-DISC vertex)

**[R]** ED2 (`data/extended_data_figure2/three_curve_equilibria.csv`) reports, at f = (0,0,1):

| Norm | none | one-step roots (stable / unstable / stable) | multi |
|---|---|---|---|
| SC | 0.3378 | 0.0009 / 0.5282 / 0.9963 | 0.9999 |
| SH | 0.0204 | 0.0008 / 0.9035 / 0.9953 | 0.999998 |
| SJ | 0.5000 | 0.5000 / 0.8788 / 0.9953 | ≈1 |
| SS | 0.8333 | 0.9963 (single) | 0.9937 |

**[R]** The ED2 depth plane (`k1_k2_summary.csv`) shows bistability for SC whenever k1, k2 ≥ 1 (except (1, k2 ≥ 5)), monostability for SC whenever k2 = 0, monostability for SH at (k ≥ 3, 0), and, in the scanned grid, monostability for SJ whenever k1 > k2. The selected multi-step pairs lie in monostable cells.

**[N]** Independent recomputation reproduces these roots exactly.

**[N] Analytic result (SC).** Under SC, φ_ALLC = ε and φ_ALLD = e2 are constants and φ_DISC = e2 + (ε − e2) r̄ is linear in r_DISC. Hence G(r_DISC) = 𝓡(φ_DISC) is concave whenever 𝓡 is concave, and G(r) − r has exactly one root on [0,1] (G(0) > 0, G(1) < 1). 𝓡 is concave for instantaneous updating and for every pure-tolerance architecture (k1, 0) with full readout (𝓡 = 1 − (1−u)^(k1+1)). **SC with (2,0) therefore has a unique reputation equilibrium at every composition — no folds anywhere.** With k2 ≥ 1 and full readout, 𝓡 ~ (k1+1)u^(k2+1) near u = 0 (convex), which permits multiple equilibria; this is the origin of the one-step bistability.

**[I]** Recovery depth k2 with full readout makes the stationary response sigmoidal and creates a low-reputation trap; tolerance depth k1 lifts the high branch. Architectures that combine tolerance without a convex recovery segment (SC, SH) avoid the trap.

### 3.2 Branch structure along composition paths [N]

Source: `edges.py`, figures `branches_ALLD-DISC.png`, `branches_ALLC-DISC.png`, `branches_ray_CD.png`.

**ALLD–DISC edge** (f_ALLC = 0):

| Norm, condition | Bistable f_DISC interval | Lower fold (high branch disappears) | Upper end of low branch |
|---|---|---|---|
| SC one | [0.895, 1] | 0.895 | persists to f_DISC = 1 |
| SH one | [0.972, 1] | 0.972 | persists to f_DISC = 1 |
| SJ one | [0.770, 1] | 0.770 | the r = 0.5 branch persists to f_DISC = 1 |
| SH multi (3,0) | [0.511, 0.923] | 0.511 | upper fold at 0.923 (S-shaped curve, hysteresis loop) |
| all "none"; SC multi; SJ multi; all SS | none | — | — |

**ALLC–DISC edge** (f_ALLD = 0): one-step SC, SH, SJ are bistable on [0.871, 1], [0.134, 1], [0.048, 1], respectively, but the all-good-selected branch is continuous along the whole edge (no fold of the high branch). All multi-step and all no-inertia cases are monostable on this edge.

**Interior ray f_ALLC = f_ALLD:** one-step SC fold at f_DISC ≈ 0.711 (bistable [0.712, 1]); SH one [0.942, 1]; SJ one [0.664, 1]. All multi-step cases are monostable along the ray.

**[I]** Loss of the high branch is driven by ALLD content: ALLC presence does not destroy the high branch, but ALLD presence does, through the norm-prescribed negative assessment of justified defection (SC, SH) or private disagreement about recipients (SJ).

### 3.3 Simplex-wide branch maps [N]

Source: `maps.py` (resolution 80, 3,240 compositions with f_DISC > 0).

| Condition | Points with two stable equilibria | Location of bistable region |
|---|---|---|
| SC one | 129 | f_ALLC ≤ 0.17, f_ALLD ≤ 0.15, f_DISC ≥ 0.68 (near the DISC vertex) |
| SH one | 386 | f_ALLD ≤ 0.10 (strip along the ALLC–DISC edge) |
| SH multi | 93 | f_ALLC ≤ 0.07, 0.09 ≤ f_ALLD ≤ 0.53, 0.40 ≤ f_DISC ≤ 0.91; bounded by two fold curves meeting at a cusp near f_ALLC ≈ 0.07 |
| SJ one | 936 | f_ALLD ≤ 0.23 (broad band) |
| SJ multi | 153 | ALLC corner only (f_ALLC 0.79–0.99): an "inverted" stable state with ALLC read as bad and ALLD as good; irrelevant from all-good starts |
| all "none"; SC multi; all SS | 0 | — |

At most two stable equilibria occur anywhere.

### 3.4 Discontinuities and payoff ordering [N]

Along the ALLD–DISC edge, the sign of Π_DISC − Π_ALLD on the all-good-selected branch changes as follows (`edge_payoff.py`):

| Type | Cases (f_DISC at sign change) |
|---|---|
| **Discontinuous (fold)**: the high branch disappears, DISC reputation collapses, and DISC falls from out-earning ALLD to losing to it | SC one (0.894; jump 0.84), SH one (0.971; jump 0.97), SH multi (0.510; jump 0.67), SJ one (0.774; jump 0.47) |
| **Smooth root (ordinary edge saddle)** | SC none (0.212, endpoint of the neutral segment), SC multi (0.079), SJ multi (0.282), SS none (0.356), SS one (0.239), SS multi (0.206) |

**[R]** These smooth roots coincide with the edge equilibria recorded in `Fig3 & ED_Fig2-5/data/simplex_dynamics/equilibria.csv` (SC multi 0.079; SJ multi 0.282; SS 0.356 / 0.239 / 0.206). The repository records **no** ALLD–DISC edge equilibrium for one-step SC, SH, or SJ.

**[I]** This is consistent with the boundary on that edge being a fold rather than a saddle: the replicator field is discontinuous at the fold under the all-good selection rule, and a root search on the payoff difference cannot find an equilibrium there.

### 3.5 Hysteresis in the finite private-record process [N]

Source: `fp_check.py`. N = 200, ALLD–DISC edge, 2,000 sweeps (burn-in 1,600), two seeds; g_DISC = finite-population mean good-readout probability; MF = mean-field selected value.

| Case | MF all-good | Finite, all-G start | MF all-bad | Finite, all-B start |
|---|---|---|---|---|
| SH multi, f_DISC = 0.55 | 0.908 | 0.904 | 0.111 | 0.114 |
| SH multi, 0.65 | 0.975 | 0.974 | 0.115 | 0.118 |
| SH multi, 0.80 | 0.997 | 0.997 | 0.126 | 0.130 |
| SH multi, 0.90 | 1.000 | 1.000 | 0.144 | **1.000** (escape near the upper fold, 0.923) |
| SH one, 0.98 | 0.984 | 0.983 | 0.001 | 0.001 |
| SC one, 0.90 | 0.889 | 0.883 | 0.001 | 0.001 |
| SJ one, 0.80 | 0.981 | 0.981 | 0.500 | 0.503 |
| SC multi / SJ multi (monostable) | identical from both starts | identical from both starts | — | — |

**[I]** Folds, bistability, and hysteresis are properties of the private-record process itself, not artefacts of the mean-field closure. Near a fold, finite-size fluctuations can trigger the transition slightly early (SH multi at f_DISC = 0.90).

---

## 4. How the branch structure shapes strategy dynamics and cooperative basins

### 4.1 Sampled cooperation under all rules [N]

512 shifted-Halton starts (seed 2026); realized cooperation (1 − e1)(f_ALLC + f_DISC r̄) at the final state (`summary_512.csv`).

| Norm | Cond. | Repository value [R] | Re-init, fine mesh, all-good | Tracking, all-good | Tracking, all-bad | Re-init, fine mesh, all-bad |
|---|---|---|---|---|---|---|
| SC | none | 0.610 | 0.610 | 0.608 | 0.608 | 0.610 |
| SC | one | 0.591 | 0.591 | 0.589 | 0.589 | **0.168** |
| SC | multi | 0.877 | 0.865 | 0.867 | 0.867 | 0.865 |
| SH | none | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| SH | one | **0.025** | **0.080** | **0.076** | 0.000 | 0.000 |
| SH | multi | 0.697 | 0.691 | 0.691 | 0.691 | 0.691 |
| SJ | none | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| SJ | one | 0.231 | 0.227 | 0.225 | 0.000 | 0.000 |
| SJ | multi | 0.704 | 0.699 | 0.702 | 0.714 | 0.706 |
| SS | none | 0.533 | 0.543 | 0.545 | 0.545 | 0.543 |
| SS | one | 0.698 | 0.696 | 0.698 | 0.698 | 0.696 |
| SS | multi | 0.743 | 0.741 | 0.743 | 0.743 | 0.741 |

Repository values are from `Fig4 & ED_Fig6/data/figure4/total_depth_results.csv` (SC (1,1), SH (1,1), SS (1,1) are the repository's reconstructed rows).

### 4.2 Starting regions and defect mechanisms [N]

"High-branch region" = compositions where a stable equilibrium with r_DISC > 0.5 exists. Defect outcomes (final realized cooperation < 0.5, tracking rule, all-good start) are classified with `foldtest2.py` into:
- **started low** — r_DISC(0) ≤ 0.5, so no high branch is available at the initial composition;
- **fold crossing** — occupied the high branch inside a bistable region and ended on the low branch;
- **smooth** — started high and declined continuously (separatrix or beyond-cusp path).

| Norm, cond. | Starts in high-branch region | in bistable region | Cooperative fraction | P(coop \| high start) | Defect: started low / fold crossing / smooth |
|---|---|---|---|---|---|
| SC one | 0.512 | 0.039 | 0.604 | 0.71 | 127 / 0 / 76 |
| SC multi | 0.961 | 0 | 0.885 | 0.90 | 8 / 0 / 51 |
| SH one | 0.109 | 0.109 | 0.078 | 0.71 | 456 / 16 / 0 |
| SH multi | 0.855 | 0.025 | 0.705 | 0.81 | 68 / 0 / 83 |
| SJ one | 0.311 | 0.166 | 0.230 | 0.74 | 118 / 11 / 265 |
| SJ multi | 1.000 | 0 | 0.717 | 0.72 | 0 / 0 / 145 |
| SS (all) | 1.000 | 0 | 0.56–0.76 | — | no folds (all smooth) |

### 4.3 Basin maps on an initial-composition grid [N]

Source: `basin_grid.py`, figure `basins_folds.png`. 861 starts, tracking rule, all-good, T = 2000.

| Norm | Cooperative fraction, one-step | Cooperative fraction, selected multi-step |
|---|---|---|
| SC | 0.59 | 0.86 |
| SH | 0.10 | 0.69 |
| SJ | 0.25 | 0.70 |
| SS | 0.69 | 0.75 |

**Classification of basin boundaries [I]**, based on `basins_folds.png` and Sections 3–4.2:

| Condition | Character of the boundary between cooperation and defection |
|---|---|
| SH one-step | **Fold boundary.** The cooperative basin is the fold-bounded high-branch strip along the ALLC–DISC edge. All defect outcomes either start outside it (456) or leave it through the fold (16). |
| SJ one-step | **Mixed.** Fold on the ALLD side of the band. Smooth (beyond-cusp merging of the high branch into the r = 0.5 branch) and ordinary separatrix elsewhere, including the ALLC-rich corner. |
| SC one-step | **Ordinary separatrix** near the ALLD–ALLC edge. The fold near the DISC vertex exists but does not bound the basin. |
| SH multi | Fold on the upper-left (ALLD-rich, ALLC-poor) side, truncated by a cusp near f_ALLC ≈ 0.07. Separatrix along the lower part. |
| SC multi, SJ multi, all SS | **Ordinary separatrix only** (no folds on the relevant branch). |

**[I]** In every selected multi-step case, the remaining defection basin lies near the ALLD–ALLC edge. There, ALLD exploits ALLC before DISC can grow. It is governed by payoff dynamics, not by reputation folds.

---

## 5. Can the multi-step cooperation gain be attributed to the fold/branch structure? [I]

**Yes for SH and SJ; no for SC and SS.**

- **SH.** One-step inertia creates a high-reputation branch that exists only in a fold-bounded strip (10.9% of starts), and this strip *is* the cooperative basin. The selected (3,0) architecture displaces the ALLD–DISC fold from f_DISC ≈ 0.97 to ≈ 0.51 and confines the remaining bistable region to ALLC-poor compositions beyond a cusp. The high-branch region grows to 85.5% of starts, and cooperation rises from 0.076–0.080 (resolved) to 0.691.
- **SJ.** One-step inertia creates a high branch over a broad band whose ALLD-side boundary is a fold; below it the reputation falls to the no-inertia value 0.5. The selected (4,3) architecture removes the relevant fold altogether (high-branch region = 100% of starts), and cooperation rises from 0.225 to 0.702.
- **SC.** The fold mechanism does not explain the gain. The one-step fold is confined near the DISC vertex and does not bound the basin. The (2,0) gain (0.589 → 0.867) comes from a smooth increase of DISC reputation in ALLD-rich compositions, which moves the separatrix toward the ALLD–ALLC edge. The analytic concavity result (Section 3.1) guarantees no folds at all for (2,0).
- **SS.** There are no folds in any condition. The gains (0.545 → 0.698 → 0.743) are smooth geometric changes.

The hypothesized causal chain — composition → loss of the high branch at a fold → DISC reputation collapse → payoff reversal → redirected trajectories → basin restructuring — is directly demonstrated for SH one-step and partially for SJ one-step. For the multi-step architectures the chain is *removed or displaced*, which is the mechanism of their gain in these two norms.

---

## 6. Recommended unified branch-selection rule

### 6.1 Comparison of existing procedures

| Procedure (repository usage) [R] | Relation to dynamic all-good selection |
|---|---|
| Scalar all-good relaxation (ED3 invasion, ED5) | **Identical.** [N, analytic] In the scalar pure-DISC problem the drift at r = 1 is negative (𝓡(A_CG) < 1), so relaxation from r = 1 stops at the highest root, which is stable unless it is a fold. |
| Highest strictly stable root (ED2 colour, Fig 5, ED7) | **Identical except exactly at folds** (measure zero). There the strict rule excludes the semi-stable root while relaxation converges to it slowly. |
| Vector all-good re-initialized relaxation at each composition (Fig 3, ED4, Fig 4, ED6, ED3 cooperation) | **Identical at fixed composition.** [N] SC and SH are monotone (cooperative) systems, so relaxation from (1,1,1) converges to the greatest equilibrium (theorem). For SJ and SS (non-monotone), all-good relaxation equals the highest-r_DISC stable equilibrium at all but 8 of 3,240 map points (SJ one-step). One of these is genuine: relaxation reaches r = 0.5 although a stable equilibrium at r_DISC = 0.953 exists next to an unstable one at 0.943. The other seven lie in the ALLC corner, where two stable states with similar r_DISC exist. Along trajectories, re-initialization differs from tracking only when a trajectory re-enters a bistable region from the low side. |

### 6.2 Recommendation [I]

**Dynamic all-good selection.** At t = 0 all internal records are in the good state. Reputations relax under the fast dynamics, and thereafter follow the reputation dynamics continuously as the strategy composition changes. A branch is left only when it ceases to exist (at a fold).

Justification:
1. It is the physical meaning of "reputations start good" in a fast–slow system.
2. **Fixed-composition quantities** reduce to relaxation from all-good, so all existing pure-DISC results (ED2, ED3 invasion, ED4 thresholds, ED5, Fig 5, ED7) are unchanged. Fold endpoints should be described as "the high branch exists for α strictly beyond the fold", which matches the current open-endpoint convention.
3. **Strategy trajectories:** from all-good starts, re-initialization and tracking agree within 0.004 on all 12 conditions (Section 4.1), so the rule change itself does not alter conclusions.
4. Re-initialization is **not** consistent for other initial conditions (SC one-step from all-bad: 0.589 tracking vs 0.168 re-initialized). Tracking is required for any statement about initial reputations.
5. "Highest stable root" is ill-defined at mixed compositions (no total order on equilibria, e.g. the SJ inverted states) and is not a dynamical rule.
6. The selected branch agrees with the full internal-state ODE from all-G and with finite private-record simulations (Sections 2.2, 3.5).

**Limitations of the rule.** It assumes timescale separation; results are insensitive for ε ∈ [0.0125, 0.2]. It inherits the conditional-independence closure. Near folds the fast relaxation is slow (bottleneck), so the separation assumption is weakest exactly at fold boundaries.

---

## 7. All-good versus all-bad initial reputations

### 7.1 Homogeneous DISC [N]

Relaxation from initial r0 at f = (0,0,1); the full-state ODE from all-G / all-B agrees in every case.

| Norm, cond. | r0 = 1 | 0.75 | 0.5 | 0.25 | 0 | Threshold (unstable root) |
|---|---|---|---|---|---|---|
| SC one | 0.9963 | 0.9963 | 0.0009 | 0.0009 | 0.0009 | 0.528 |
| SH one | 0.9953 | 0.0008 | 0.0008 | 0.0008 | 0.0008 | 0.904 |
| SJ one | 0.9953 | 0.5 | 0.5 | 0.5 | 0.5 | 0.879 |
| SS one | 0.9963 | (all r0) | | | | none |
| all multi | high root | (all r0) | | | | none |
| all none | unique root | (all r0) | | | | none |

The original hypotheses are confirmed at this level. Without inertia, the initial condition is irrelevant. Under one-step inertia, SC and SH collapse to near-zero reputation, SJ collapses to the no-inertia value 0.5, and SS remains high. The selected multi-step architectures reach the high state from any initial reputation.

### 7.2 Evolutionary outcomes [N]

Tracking rule, 512 starts (`initial_reputation.png`, `summary_512.csv`).

| Norm | none (good / bad) | one-step (good / bad) | multi (good / bad) |
|---|---|---|---|
| SC | 0.608 / 0.608 | **0.589 / 0.589** | 0.867 / 0.867 |
| SH | 0 / 0 | **0.076 / 0.0001** | 0.691 / 0.691 |
| SJ | 0 / 0 | **0.225 / 0.000** | 0.702 / 0.714 |
| SS | 0.545 / 0.545 | 0.698 / 0.698 | 0.743 / 0.743 |

- **SH and SJ one-step:** cooperation disappears from all-bad starts.
- **SC one-step: correction to the original hypothesis.** Cooperation does *not* collapse at the evolutionary level. The SC one-step low branch occupies only a small region near the DISC vertex. Trajectories starting there move out of it, recover the high branch, and re-enter the bistable region on the high branch (hysteresis). Only the pure-DISC vertex itself remains trapped.
- **SJ multi:** the all-bad start gives slightly *higher* cooperation (0.714 vs 0.702). In a few ALLC-rich starts (6 of 512), SJ can lock into an inverted state (ALLC bad, ALLD good) that penalizes ALLD.
- **Recognition (Fig 2 / ED1) [N]:** at the equal composition (1/3, 1/3, 1/3) every condition has a single stable equilibrium. Finite simulations (N = 150) from all-B reproduce the all-G reputations, so the recognition results are independent of initial reputations.

### 7.3 Robustness of the selected multi-step architectures [I]

The selected architectures are robust to initial reputations in all four norms: identical or near-identical outcomes from all-good and all-bad starts, both at pure DISC and at the population level. One-step inertia creates genuine initial-reputation dependence for SH and SJ, which are the norms where inertia matters most.

---

## 8. Is ED Figure 2 sufficient? Recommended figure

### 8.1 Sufficiency [I]

ED Figure 2 is **sufficient** for the pure-DISC statement: one-step inertia creates reputational bistability (and hence initial-reputation dependence at the DISC vertex), and the selected depths remove it.

It is **not sufficient** for:
- **Population-level statements.** Initial-reputation dependence of evolutionary outcomes depends on the size and location of the composition-dependent bistable region, not on vertex bistability. One-step SC is bistable at the vertex but evolutionarily insensitive.
- **The basin mechanism.** Which basin boundaries are folds and which are separatrices is not visible in ED2 or in the Figure 3 streamplots.

### 8.2 Recommended additional figure (Extended Data or SI) [I]

Settings: b/c = 5, e1 = e2 = 0.02, one-step and selected multi-step architectures.

- **Panels a–d — continuation diagrams.** r_DISC vs f_DISC along the ALLD–DISC edge for SC, SH, SJ, SS. One-step and selected multi-step are overlaid; stable branches solid, unstable dashed, folds marked; arrows show the all-good path (decreasing f_DISC) and the all-bad path (increasing f_DISC); a thin strip shows the sign of Π_DISC − Π_ALLD.
  - *Establishes:* the folds, the hysteresis loop (SH (3,0)), the discontinuous payoff reversal, and fold removal (SC, SJ).
- **Panels e–l — basin maps.** Cooperative vs defecting initial compositions (861-point grid, tracking rule, all-good) for one-step and selected multi-step, with the fold-bounded bistable regions hatched.
  - *Establishes:* fold-bounded basins (SH one-step), mixed boundaries (SJ one-step), and separatrix-bounded basins elsewhere.
- **Panel m — initial-reputation bars.** Sampled realized cooperation from all-good vs all-bad starts for the 12 conditions (could replace or complement ED2 panels a–d for this purpose).

Prototypes: `branches_ALLD-DISC.png`, `basins_folds.png`, `initial_reputation.png`. These are diagnostic, not publication-styled. If space is limited, panels a–d plus m carry the essential claims; e–l can move to SI.

---

## 9. Implications for the paper's narrative [I]

1. **Strengthened central mechanism.** The evidence supports "inertia reorganizes basins" over "inertia raises equilibrium cooperation", and identifies the reorganizing object. In SH and SJ, one-step inertia generates reputational multistability whose fold bounds the cooperative basin. Correct allocation removes (SJ) or displaces (SH) the fold, enlarging the basin roughly 3–9-fold.
2. **Norm specificity is now mechanistic.** SH and SJ are fold-governed; SC and SS are governed by smooth changes in the response (SC (2,0) provably has no folds).
3. **New robustness claim.** Selected architectures make outcomes independent of initial reputations. One-step inertia does not (SH, SJ).
4. **Recovery direction.** Strict recovery (k2 ≥ 1 with full readout) is what creates the low-reputation trap. This connects ED3's "tolerance > strictness" result to the fold mechanism.
5. **Wording to avoid.** Do not describe Figure 3 one-step basin edges as separatrices of saddles. Do not call the repository's one-step SH cooperation (0.025) a resolved value. Do not describe initial-reputation dependence using ED2 alone.

---

## 10. Figure, notebook, and code impact

| Item | Required change |
|---|---|
| `Fig4 & ED_Fig6/Figure4_Total_Depth.ipynb`, `Extended_Data_Figure6.ipynb` | Recompute sampled cooperation without interpolating the replicator field across folds (direct tracking or a fold-resolving mesh). One-step SH changes from 0.025 to about 0.08; other values move by ≤ 0.011. The envelope winners are unlikely to change, but this has not been rerun. |
| `Fig3 & ED_Fig2-5/Extended_Data_Figure4.ipynb` | Same issue (mesh 25 for SH, SJ, SS; 41 for SC). The ED4 one-step SH value (0.0275) is likely underestimated. The SEM does not capture this bias. |
| ED3 cooperation plane (`23_alpha_beta_dense41.csv`, mesh 23) | Same pipeline as Figure 4 (Section 11, item 6). Cells whose folds lie near the DISC vertex are affected; regeneration is needed anyway because of the provenance gap. |
| `Figure3_Simplex_Dynamics.ipynb` (Fig 3, ED3 rows 1–2) | Values are correct pointwise (re-initialized all-good, no interpolation). Add fold-curve / bistable-region overlays and caption text explaining fold-bounded edges. |
| ED2, ED3 invasion, ED4 thresholds, ED5, Fig 5, ED7 | No value changes. State the dynamic all-good rule; keep the open fold endpoints. |
| Fig 2 / ED1 | No change (monostable at equal composition; verified from all-bad starts). |
| `Model.md`, Methods, SI (S5, S10, S13) | Replace "highest stable root / all-good re-initialization" language with the dynamic all-good rule. Note fold-induced field discontinuities and the mesh-resolution requirement near folds. |

---

## 11. Remaining limitations and open issues

1. **Closure.** All deterministic results use the conditional-independence closure. Finite simulations agree closely at the tested compositions, but no finite-population *evolutionary* simulation (strategy updating with private records) has been run.
2. **Sampling.** Basin fractions are estimated on one 512-point shifted-Halton sample and an 861-point grid. There is no replicate uncertainty.
3. **Numerical resolution.**
    - The r̄-scan can miss two roots lying within one grid cell very close to a fold.
    - Bistable-region boundaries on the 80-resolution map are resolved only to about 0.0125 in composition.
    - Thin near-fold bands (SJ) are under-sampled.
4. **Classification thresholds.**
    - "High branch" uses r_DISC > 0.5, and "cooperative" uses final realized cooperation ≥ 0.5 (the repository's convention).
    - The "started low" category mixes starts below a fold-bounded region and starts in smoothly low-reputation regions. For SH one-step these coincide; for SC and SJ they do not.
5. **Timescale separation.** Tested for ε from 0.0125 to 0.2 in SH one-step only. The near-fold bottleneck could matter for finite ε in other conditions.
6. **ED3 provenance.** The ED3 cooperation table appears to share the Figure 4 pipeline: identical values at the (0,0) corner and identical cooperative fractions at (1,1). This was observed in the audit but is not proof.
7. **Repository convergence gates.** The Figure 4 / ED6 mean-change gate remains weaker than per-trajectory convergence; the tracking runs used a fixed horizon (T = 3000) and report final residuals rather than a gate.
8. **SJ inverted states.** The ALLC-corner inverted equilibria (ALLC bad, ALLD good) are a symmetry property of SJ. They affect all-bad starts marginally (6 of 512) and should be mentioned briefly if all-bad results are reported.
9. **Scope.** Parameters are fixed at b/c = 5, e1 = e2 = 0.02. The dependence of fold locations on b/c (reputations do not depend on b/c, but basins do) and on the error rates has not been mapped.

---

## 12. File index

All in `/home/claude/fold_investigation/`:

| File | Content |
|---|---|
| `Reputation_Fold_and_Branch_Analysis_Report.md` | This report |
| `summary_512.csv` | Per-condition numbers of Sections 4.1–4.2 |
| `branches_ALLD-DISC.png`, `branches_ALLC-DISC.png`, `branches_ray_CD.png` | Continuation diagrams |
| `basins_folds.png` | Basin maps with bistable regions |
| `initial_reputation.png` | All-good vs all-bad comparison |
| `lib.py`, `dyn.py`, `dyn_mesh.py`, `edges.py`, `maps.py`, `classify.py`, `foldtest2.py`, `basin_grid.py`, `fpsim.c`, `fpsim.py` | Analysis code (independent of the repository) |

Intermediate pickles (`edges.pkl`, `maps.pkl`, `track512.pkl`, `reinit512.pkl`, `foldtest2.pkl`, `basin_grid.pkl`, `fp_check.pkl`) are in the session scratchpad: `/tmp/claude-0/-home-claude/7fb0dc81-977c-55c5-82de-1f507553802d/scratchpad/fold/`.
