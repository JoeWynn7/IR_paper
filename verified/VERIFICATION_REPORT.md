# Verification report

This report records the final audit of the computational materials: what was checked, what was wrong, what was changed, how the numbers changed, and whether any scientific conclusion changed. Values are given at the reference parameters ($b/c=5$, $e_1=e_2=0.02$) unless stated otherwise. "Old" refers to the previous release in `../code-and-figures/`; "new" refers to this folder.

Labels used below: **[A]** analytical result; **[N]** deterministic numerical calculation (root finding, ODE integration); **[S]** stochastic finite-population simulation.

## 1. Scope and conventions

* Main-model convention unchanged: at every strategy composition, reputations are relaxed from the all-good state to equilibrium. Alternative initial reputations appear only in the robustness analysis of Extended Data Figure 2e.
* The model (direct-reset record, private assessment, conditional-independence closure, payoffs) is unchanged; no new assumption was introduced.
* Every notebook in this folder was executed in the verification environment. For the unchanged analyses (Figure 2, ED1, Figure 3, Figure 5, ED7) the original notebook files are kept unchanged; the executed copies were used only for verification. Notebooks that use Numba (Figure 2, ED1, Figure 3) were executed in load-only mode with a stand-in that runs the same functions as plain Python; their outputs reproduce the saved data (ED1 recognition table identical to $2\times10^{-20}$; Figure 3 equilibrium table identical to $3\times10^{-27}$). Full regeneration of the stochastic simulations of Figure 2/ED1 and of the Figure 3 fields requires Numba and was not repeated.

## 2. Summary of the audit

| Analysis | Check performed | Result |
|---|---|---|
| Reputation equilibria (all-good selection) | Independent re-evaluation of 3,000 Figure 3 field points with the C engine | Agreement to $\le2.3\times10^{-13}$ |
| Stationary response $\mathcal R(u)$ | Identities for $(0,0)$ and $(1,1)$; 20 random Markov chains (ED2 self-check) | Passed |
| Homogeneous-DISC roots (ED2 a–d, ED9) | Notebook residual and full-state stability checks | Passed; data unchanged |
| Simplex dynamics (Figure 3) | Field and equilibria reproduction; edge equilibria against ED8 root scan (SC 0.079, SJ 0.282, SS 0.356/0.239/0.206) | Unchanged |
| Sampled cooperation (Figure 4, ED6, ED3 plane, ED4) | Comparison with an exact-reputation engine | **Corrected** (interpolation across folds; §3.1) |
| Cooperative class | Structure of final states in all scans | **Redefined** (attractor-based; §4) |
| Error planes (ED5) | Resident-root accuracy versus classification tolerance | **Corrected** (§3.2) |
| Readout invasion planes (ED3) | Full regeneration of the 801×801 grids | One cell changes class (§3.3) |
| Depth-plane protection (ED6) | Pure-DISC invasion fitnesses with refined roots | **Three cells corrected** (§3.4) |
| $b/c$ dependence (ED4) | Regeneration with exact reputations; thresholds $R_L,R_U$ | Regenerated (§3.5) |
| Initial reputations (ED2e) | Quasi-static tracking, all-good versus all-bad | Regenerated (§3.6) |
| Opportunistic invasion (Figure 5, ED7) | Notebook execution; residuals ($\le5\times10^{-13}$) versus tolerance ($10^{-10}$) | Unchanged |
| Finite-population simulations (Figure 2, ED1) | Notebook execution in load mode; earlier independent C simulator spot checks | Unchanged |
| Figure code and text | Titles, labels, terminology, informal wording | Revised (§5) |

## 3. Corrections

### 3.1 Interpolation of the replicator field across folds (Figure 4, ED6, ED3 cooperation plane, ED4) — [N]

**What was wrong.** The sampled-cooperation pipelines computed the all-good reputations exactly only at the nodes of a coarse triangular mesh (resolution 23 for Figure 4, ED6 and the ED3 plane; 25, or 41 for SC, in ED4) and integrated the strategy dynamics on the linearly interpolated replicator field. Wherever the selected reputation branch is discontinuous (folds; Extended Data Figure 8) or very steep, the interpolated field mixes the two sides of the discontinuity over a whole mesh cell. This moves the separatrices that bound the cooperative basin and biases mean cooperation. The generator of the ED3 cooperation table could not be identified.

**What was changed.** A new engine (`engine/irsim.c`) tabulates the reputation map on a fine lattice (7,381 nodes), interpolates reputations only inside cells where the map is smooth (node spread $\le0.02$), and evaluates them exactly elsewhere; payoffs and the field are always computed from these reputations. The same samplers (shifted Halton, seed 2026; scrambled Sobol, seeds 2026–2033) are used. Validation: refined settings (finer lattice and threshold, half the time step, tighter stopping tolerance) change mean cooperation by $\le1.3\times10^{-5}$ with identical outcome classes (`engine/validation/settings_check_output.txt`); an independent numpy implementation without lattice reproduces the outcome of every tested trajectory (§3.7); the analytic SC no-inertia case reproduces the previous exact value (0.6098 versus 0.6101; the difference reflects neutral drift on the equilibrium segment).

**Numerical change.** Figure 4 (180 conditions): median $|\Delta\bar\rho|=0.002$, 90th percentile 0.013, maximum 0.086; 27 conditions change by more than 0.01 and 7 by more than 0.02. ED6 (256 conditions): median 0.004, maximum 0.086; 49 conditions change by more than 0.01. The largest corrections occur exactly where folds bound the basin:

| Condition | Old $\bar\rho$ | New $\bar\rho$ |
|---|---:|---:|
| SC $(1,7)$ | 0.0000 | 0.0858 |
| SC $(1,6)$ | 0.0705 | 0.1296 |
| SH $(1,1)$ | 0.0248 | 0.0762 |
| SH $(2,7)$ | 0.1148 | 0.0803 |
| SJ $(6,7)$ | 0.6795 | 0.6489 |
| SJ $(5,6)$ | 0.6355 | 0.6068 |

Reference conditions:

| Norm | Condition | Old $\bar\rho$ | New $\bar\rho$ | Change | Old basin ($\rho\ge0.5$) | New $\omega_C$ |
|---|---|---:|---:|---:|---:|---:|
| SC | none (0,0) | 0.6098 | 0.6101 | +0.0003 | 0.6328 | 0.6348 |
| SC | one (1,1) | 0.5893 | 0.5912 | +0.0019 | 0.6035 | 0.6055 |
| SC | multi (2,0) | 0.8766 | 0.8651 | −0.0115 | 0.8945 | 0.8828 |
| SH | none (0,0) | 0.0000 | 0.0000 | 0 | 0 | 0 |
| SH | one (1,1) | 0.0248 | 0.0762 | +0.0514 | 0.0254 | 0.0781 |
| SH | multi (3,0) | 0.6967 | 0.6910 | −0.0057 | 0.7109 | 0.7051 |
| SJ | none (0,0) | 0.0000 | 0.0000 | 0 | 0 | 0 |
| SJ | one (1,1) | 0.2306 | 0.2248 | −0.0058 | 0.2363 | 0.2305 |
| SJ | multi (4,3) | 0.7044 | 0.6986 | −0.0057 | 0.7188 | 0.7129 |
| SS | none (0,0) | 0.5335 | 0.5434 | +0.0099 | 0.5625 | 0.5605 |
| SS | one (1,1) | 0.6980 | 0.6960 | −0.0019 | 0.7148 | 0.7129 |
| SS | multi (1,2) | 0.7429 | 0.7410 | −0.0019 | 0.7617 | 0.7598 |

Figure 4 envelope: the best allocation changes at two budgets, both near-ties within sampling variation — SS $K=1$: $(0,1)$ 0.5539 versus $(1,0)$ 0.5522 (previously $(1,0)$); SS $K=6$: $(1,5)$ 0.7814 versus $(2,4)$ 0.7807 (previously $(2,4)$). The SC envelope now peaks at $K=5$ (0.888) and declines to 0.875 at $K=8$ (previously a plateau of 0.894 at $K=4$–6 and 0.890 at $K=8$). The selected depths remain on the envelope at their budgets.

ED3 cooperation plane and ED4: see §3.5 and §3.7.

**Conclusion changed?** No qualitative conclusion changes. The one-step SH value triples (0.025 → 0.076) but remains far below multi-step (0.691); statements that one-step SH cooperation is "near zero" should read "low (about 0.08)". Values quoted from the old tables must be replaced (§8).

### 3.2 ED5 classification limited by solver tolerance — [N]

**What was wrong.** Resident reputations were accepted at a relaxation residual of $10^{-9}$, but invasion classes were assigned with a tolerance of $10^{-10}$ on the invasion fitnesses. On the line $e_2=0$, under SC and SH, the resident reached from all-good is the all-bad state, at which ALLD is exactly neutral ($\lambda_{\rm ALLD}=0$). Slow convergence to $g=0$ left $g\sim10^{-9}$–$10^{-7}$, so $\lambda_{\rm ALLD}$ was $-2\times10^{-9}$ to $-2\times10^{-6}$ and those points were wrongly classified as "ALLD excluded".

**What was changed.** After relaxation, the resident root is refined by step-limited Newton iterations (steps $\le10^{-6}$, so the root reached by relaxation is retained) to a residual $\le10^{-13}$; the convergence assertion now uses this tolerance. No "uncertain" category was introduced; the existing precedence rule (ALLD non-exclusion first) is applied to exact values.

**Numerical change.** 855 of 696,972 grid points change class, all on the $e_2=0$ row: SC without inertia 240, SH without inertia 240, SC one-step 169, SH one-step 206; all become "ALLD not excluded". Class counts (not excluded / ALLC invades / DISC resists both): SC none 10,769/47,311/1 → 11,009/47,071/1; SH none 57,840/0/241 → 58,080/0/1; SC one 11,284/46,410/387 → 11,453/46,241/387; SH one 57,165/414/502 → 57,371/414/296. All other grids unchanged; maximum change of any resident reputation $5.3\times10^{-7}$.

**Conclusion changed?** No. The changes are confined to the boundary line $e_2=0$, where ALLD is neutral. The figure shows the corrected class as a one-pixel strip along the lower axis in panels a, b, e and f.

### 3.3 ED3 invasion grids — [N]

**What was checked/changed.** The 801×801 grids were fully regenerated from the notebook (all-good relaxation to $10^{-11}$, polynomial fallback where relaxation is slow, Newton refinement to $\le10^{-13}$). The classification rule was unified with ED5 (ALLD not excluded if $\lambda_{\rm ALLD}\ge-10^{-10}$; otherwise ALLC invades if $\lambda_{\rm ALLC}>10^{-10}$); the label "ALLD invades" became "ALLD not excluded".

**Numerical change.** Regenerated resident reputations agree with the previous (repaired) grids to $\le1.7\times10^{-8}$. One SH cell ($\alpha=0.975$, $\beta=0.9213$) changes from "DISC resists both" to "ALLC invades" ($\lambda_{\rm ALLC}$: $-2.3\times10^{-10}\to+2.7\times10^{-10}$). The rule change affects no cell.

**Conclusion changed?** No.

### 3.4 ED6 local-protection markers — [N]

**What was wrong.** For SH with $k_1=1$, $k_2=5,6,7$, the pure-DISC resident reached from all-good is the all-bad state, at which ALLD is neutral or weakly favoured ($\lambda_{\rm ALLD}=1.3\times10^{-10}$, $2.5\times10^{-12}$, $5.1\times10^{-14}$). The previous solver tolerance gave $\lambda_{\rm ALLD}\approx-2\times10^{-10}$ and marked these cells as protected.

**What was changed.** Invasion fitnesses use the refined resident root (`engine/analysis.py`) and the ED5 rule.

**Numerical change.** SH protected cells 53 → 50; other norms unchanged (50 each).

**Conclusion changed?** No.

### 3.5 ED4 ($b/c$ scan) — [N]

**What was wrong.** As in §3.1 (field interpolated on meshes of resolution 25, or 41 for SC). In addition, ED4 reported intended cooperation, whereas all other cooperation figures report realized cooperation.

**What was changed.** All 540 conditions (4 norms × 3 inertia conditions × 45 ratios; 8 scrambled-Sobol samples × 512 initial compositions, seeds 2026–2033, as before) were recomputed with the engine. The ordinate is now mean long-run realized cooperation $\bar\rho$; the band is ±1 s.e. across the eight sample means. The pure-DISC thresholds $R_L$, $R_U$ were recomputed from refined resident roots and agree with the previous values (SJ multi-step $R_U$: 20,910.4 → 20,910.0; irrelevant within the plotted range).

**Numerical change** (compared with the previous intended values multiplied by $1-e_1$): median $|\Delta|=0.001$; 74 of 540 points change by more than 0.01 and 47 by more than 0.02 — almost all of them one-step SH (+0.05 to +0.06 for $b/c\gtrsim5$; e.g. $b/c=5$: 0.027 → 0.078) and one-step SJ (up to 0.024). Maximum changes for the other curves: SC ≤ 0.006, SH multi-step 0.011, SJ multi-step 0.005, SS ≤ 0.007. At $b/c=5$: SC 0.602/0.589/0.860, SH 0/0.078/0.689, SJ 0/0.222/0.692, SS 0.555/0.688/0.740 (none/one-step/multi-step).

Integration cap: trajectories that did not meet the convergence criterion within $4\times10^4$ time units occur on the neutral equilibrium segment of SC without inertia (9,271 trajectories over 45 ratios) and, in a handful of cases (2–38 trajectories), at ratios close to $R_L$ or $R_U$, where the relevant invasion fitness is nearly zero and the dynamics are slow; the outcome-gap check holds for all 540 conditions, so the classification is unaffected.

**Conclusion changed?** No. Ordering of the curves and the protection intervals are unchanged. One-step SH cooperation is low but not negligible (≈0.08) over the whole range $b/c\ge5$.

### 3.6 ED2 population-level initial-reputation comparison — [N]

**What was changed.** The population-level comparison previously shown in `initial_reputation.png` (fold analysis) was computed with a finite reputation timescale (four RK4 inner steps per strategy step). It was recomputed with the engine's tracking protocol: reputations are initialized once at $t=0$ (all-good $r=1$ or all-bad $r=0$) and then follow the strategy trajectory quasi-statically (warm-started relaxation at every evaluation); 512 shifted-Halton initial compositions as in Figure 4. It is now panel e of the revised ED2.

**Result.**

| Norm | Inertia | All-good | All-bad | Difference |
|---|---|---:|---:|---:|
| SC | none / one-step / multi (2,0) | 0.610 / 0.591 / 0.865 | 0.610 / 0.591 / 0.865 | 0 |
| SH | none / one-step / multi (3,0) | 0 / 0.076 / 0.691 | 0 / 0.000 / 0.691 | one-step −0.076 |
| SJ | none / one-step / multi (4,3) | 0 / 0.225 / 0.699 | 0 / 0.000 / 0.706 | one-step −0.225; multi-step **+0.008** |
| SS | none / one-step / multi (1,2) | 0.543 / 0.696 / 0.741 | 0.543 / 0.696 / 0.741 | 0 |

With all-good initialization the tracking protocol reproduces the main-convention values exactly (one-step SH 0.0762, SJ 0.2248, SC 0.5912). The SJ multi-step difference is caused by 4 of 512 initial compositions near the ALLC vertex ($f_{\rm ALLC}\ge0.85$): from all-bad reputations SJ relaxes there to an inverted reputation state (ALLC bad, ALLD good), and these trajectories reach the cooperative ALLC–DISC equilibrium instead of the ALLD vertex ($\omega_C$ 0.713 → 0.721). The previous estimate (0.702 versus 0.714) is replaced by 0.699 versus 0.706.

**Conclusion changed?** No. The supporting statement holds as worded, provided the small SJ multi-step difference (+0.008, in favour of all-bad initialization) is mentioned.

### 3.7 ED3 cooperation plane — [N]

**What was wrong.** The previous 41×41 table (generator not identified) used a resolution-23 interpolated field. Under SC it reported zero cooperation in a wedge of low tolerance strength ($\alpha\le0.175$; 167 cells), e.g. $(\alpha,\beta)=(0.025,0.2)$ and the whole column $\alpha=0$, $\beta>0$.

**What was changed.** All 6,724 conditions were recomputed with the engine (512 shifted-Halton starts, as Figure 4). Two points in the disputed SC wedge were checked independently with the numpy library of the fold analysis (reputations re-relaxed exactly from all-good at every step, no lattice): $(\alpha,\beta)=(0.025,0.2)$, 8 trajectories, and $(0,0.1)$, 6 trajectories; every trajectory reached the same outcome as in the engine (cooperative trajectories converge to the mixed ALLC–DISC equilibrium $f_{\rm DISC}\approx0.21$ with $\rho=0.970$; `engine/validation/`).

**Numerical change.** SC: of the 167 previously zero cells, 89 now exceed 0.1 (up to 0.53; median 0.14); zero cooperation remains only in a thin strip $\alpha\le0.075$ above a line running from $\beta=0.35$ at $\alpha=0$ to $\beta=0.93$ at $\alpha=0.075$ (61 cells); elsewhere median $|\Delta|=0.002$, maximum 0.12. SH: systematic increase (mean +0.010, maximum +0.072, e.g. $(0.925,0.35)$: 0.036 → 0.108; 356 cells change by more than 0.02). SJ: maximum 0.036. SS: maximum 0.016. The $(1,1)$ corner reproduces Figure 4 (SC 0.591, SH 0.076, SJ 0.225, SS 0.696). Maximum plotted value 0.738 (colour scale unchanged, 0–0.75). Integration cap reached by 26 trajectories in 7 conditions (SC without inertia; SJ and SS near $\alpha\approx0.85$–0.95), outcome gap satisfied everywhere.

**Conclusion changed?** The qualitative picture is unchanged (SS high everywhere; SH and SJ low except at high tolerance; SC increasing with tolerance). One specific feature changes: under SC, low tolerance strength does **not** abolish cooperation over a wedge of the plane; cooperation decreases continuously as $\alpha\to0$ and vanishes only in the thin strip $\alpha\le0.075$ at high strictness strength. Any statement based on the old white wedge must be revised.

## 4. Outcome classes, basin definition and terminology

### 4.1 Structure of the long-run outcomes — [N]

In every scan (264 depth conditions, the ED3 plane, the ED4 $b/c$ scan and the 24 initial-reputation runs; see the `outcome_gap_ok` column of each table), every trajectory ends in one of two classes:

* **Convergence to zero cooperation.** These trajectories end on the ALLD–DISC edge ($f_{\rm ALLC}<10^{-21}$ at the end of integration) on the low-reputation branch, where DISC players are regarded as bad by DISC observers and therefore defect against almost everyone; realized cooperation at the end of integration is at most $7\times10^{-4}$. Along this branch DISC earns slightly less than ALLD (payoff advantage between $-0.5$ and $-10^{-16}$ depending on norm and depth; ED8 bottom row), so these states drift towards the ALLD vertex, in some conditions extremely slowly (for example SC with $k_2\ge2$, where low-reputation DISC is almost payoff-equivalent to ALLD). Many trajectories therefore stop before reaching the vertex ($f_{\rm ALLD}$ between 0.002 and 1), but all of them are in the zero-cooperation set.
* **Convergence to an attractor with positive cooperation.** For nearly all conditions this is a single attractor (for example the DISC vertex or a mixed ALLC–DISC equilibrium) whose realized cooperation is $0.974$–$0.980$, close to the error-limited maximum $1-e_1$ (220 of the 230 depth conditions with a cooperative outcome). Exceptions: SS without inertia (0.970), SC without inertia (a neutrally stable equilibrium segment at $f_{\rm DISC}=0.2126$; final cooperation 0.44–0.97 depending on the point reached) and SS with $k_1=0$, $k_2\ge1$ (an interior mixed equilibrium with cooperation 0.87 for $k_2=1$ decreasing to 0.38 for $k_2=8$).

Across all scans, the largest final cooperation in the first class is $6.6\times10^{-4}$ and the smallest in the second is 0.35 (SC without inertia at small $b/c$; 0.38 over the depth conditions).

### 4.2 Definition adopted

A fixed cooperation threshold is not needed. The classes are defined by the attractor reached:

> **Cooperative basin.** The set of initial strategy compositions whose trajectories converge to an attractor with positive cooperation. Its complement is the basin of the zero-cooperation set (the ALLD vertex together with the low-reputation segment of the ALLD–DISC edge, along which the dynamics drift towards ALLD). The relative size $\omega_C$ of the cooperative basin is the fraction of area-uniformly sampled initial compositions that belong to it.

Numerically a trajectory is assigned to the cooperative basin if its final realized cooperation is at least 0.01. Because of the gap in §4.1, every cut between $6.6\times10^{-4}$ and 0.35 gives an identical classification, so the result does not depend on this choice; the gap is checked for every condition (`outcome_gap_ok`). The previous rule $\rho_{\rm final}\ge0.5$ is not appropriate: it classifies the cooperative interior attractor of SS with $k_1=0$, $k_2\ge6$ (cooperation 0.38–0.46) as non-cooperative, giving $\omega_C=0$ instead of 0.23, 0.18 and 0.14 for $k_2=6,7,8$; elsewhere it coincides with the attractor definition up to the mesh corrections of §3.1.

### 4.3 Quantities and notation

| Symbol | Name in text | Definition | Column |
|---|---|---|---|
| $\rho$ | realized cooperation | $(1-e_1)\,(f_{\rm ALLC}+f_{\rm DISC}\bar r)$ at a strategy composition | — |
| $\bar\rho$ | mean long-run cooperation | average of the long-run $\rho$ over initial compositions sampled uniformly (by area) from the simplex | `mean_cooperation` |
| $\omega_C$ | cooperative-basin size (fraction of initial compositions reaching a cooperative outcome) | as in §4.2 | `cooperative_basin` |
| $\bar\rho_C$ | cooperation level of cooperative outcomes | mean long-run $\rho$ over initial compositions in the cooperative basin | `cooperation_cooperative` |
| $\bar\rho_D$ | cooperation in the non-cooperative outcome | mean long-run $\rho$ over the remaining compositions; zero in the long-time limit ($\le6.6\times10^{-4}$ at the end of integration) | `cooperation_defective` |

Identity: $\bar\rho=\omega_C\,\bar\rho_C+(1-\omega_C)\,\bar\rho_D\approx\omega_C\,\bar\rho_C$.

Recommended wording: "mean long-run cooperation $\bar\rho$ (averaged over initial strategy compositions)" instead of "basin-weighted cooperation" or "expected cooperation"; "size of the cooperative basin $\omega_C$"; "cooperation level within the cooperative basin $\bar\rho_C$". The symbols avoid $\beta$, which denotes the strictness readout. All sampled quantities are reported as realized cooperation (including implementation errors); ED4 previously used intended cooperation (larger by the factor $1/(1-e_1)$) and now also uses realized cooperation. Uncertainty: with 512 quasi-random initial compositions, a conservative (random-sampling) standard error of $\omega_C$ is $\sqrt{\omega_C(1-\omega_C)/512}\le0.022$; ED4 reports the standard error across eight independent samples.

## 5. Code, labels and file organization

* **New code.** `engine/` (C engine, Python interface, outcome definitions, scans, post-processing); `ed8_reputation_geometry/Extended_Data_Figure8.ipynb`; `analysis/basin_decomposition/basin_decomposition.py`.
* **Rewritten notebooks.** `Figure4_Total_Depth.ipynb`, `Extended_Data_Figure6.ipynb`, `Extended_Data_Figure4.ipynb`: the interpolating numerical cores were replaced by calls to the engine; plotting code retained; labels changed to "Mean cooperation $\bar\rho$".
* **Edited notebooks.** `Extended_Data_Figure5.ipynb` (root refinement, residual criterion, metadata names); `Extended_Data_Figure3_Planes.ipynb` (root refinement, unified classification and label "ALLD not excluded", cooperation data from the engine, colour-bar label); `Extended_Data_Figure2.ipynb` (panel e, split into ED2 and ED9, publication typography, single panels renamed `panel_<group>_<norm>`).
* **Unchanged notebooks.** Figure 2, ED1, Figure 3, Figure 5, ED7 (only executed). Notebooks, data and figures are byte-identical to the previous release (the Figure 2 results guide and validation record differ only by the wording change below; their checksums in `figure2_ed1/manifest.csv` were updated).
* **Labels and wording.** "Basin-weighted (realized/intended) cooperation" and `expected_cooperation` were replaced by "mean (long-run) cooperation $\bar\rho$" and `mean_cooperation`; ED3 colour bar and ED6 colour bar likewise; ED3/ED5 class label "ALLD invades" → "ALLD not excluded" (the class includes neutral ALLD); ED4 legend "protected/unprotected" now states "pure DISC locally protected"; a metadata reference to a historical notebook name (`Fig3_e1_e2_error_shields_three_inertia_3x4.ipynb`) was replaced by the actual notebook; "PPT-assembled" was replaced by "manually assembled" in the Figure 2 documentation.
* **Documents.** Earlier package READMEs, results guides, validation records and manifests whose numbers or descriptions no longer apply were moved to `previous_version/` folders and replaced by new READMEs. A checksum manifest of the whole folder is in `MANIFEST.csv`.
* **Not changed.** Colours, line widths, panel layouts and file formats of existing figures (except the ED2 reorganization); model equations; parameter values; samplers and seeds.

## 6. Effect of mesh interpolation

| Analysis (previous mesh) | Conditions | Median $|\Delta\bar\rho|$ | Max $|\Delta\bar\rho|$ | $>0.02$ | Where the large changes are |
|---|---:|---:|---:|---:|---|
| Figure 4 (23) | 180 | 0.002 | 0.086 | 7 | SC $(1,6)$, $(1,7)$; SH $(1,1)$, $(1,2)$, $(2,6)$; SJ $(1,2)$, $(3,5)$ |
| ED6 (23) | 256 | 0.004 | 0.086 | 13 | as above plus SH $(2,7)$ and SJ with $k_2\ge5$ |
| ED3 cooperation plane (23) | 6,724 | 0.000–0.002 by norm | 0.534 | 614 | SC low-tolerance wedge (§3.7); SH at high tolerance (+0.03 to +0.07) |
| ED4 (25; SC 41) | 540 | 0.001 | 0.059 | 47 | one-step SH (+0.05 to +0.06), one-step SJ (up to 0.024) |

Interpolating the replicator field across a fold mixes payoffs computed on two different reputation branches within one mesh cell. Where a fold or a steep transition bounds the cooperative basin (one-step SH and SJ near the DISC vertex, SC and SH with large recovery depth, SC at very low tolerance strength), this shifts the separatrix and changes the fraction of initial compositions that reach cooperation; elsewhere the field is smooth and the interpolation error is at the $10^{-3}$ level. The direction of the error is not uniform (one-step SH was underestimated by a factor of three; SC (2,0) and the large-depth SJ allocations were overestimated by about 0.01–0.03). Figure 3 is not affected (its fields are evaluated exactly at every grid point), nor are ED2, ED5, ED7, ED8 or ED9, which do not integrate strategy dynamics.

## 7. Basin size versus cooperation level — [N]

Reference parameters, 512 initial compositions (`analysis/basin_decomposition/`):

| Norm | Inertia | $\bar\rho$ | $\omega_C$ (±s.e.) | $\bar\rho_C$ | $\bar\rho_D$ |
|---|---|---:|---:|---:|---:|
| SC | none | 0.610 | 0.635 (0.021) | 0.961 | 0 |
| SC | one-step | 0.591 | 0.605 (0.022) | 0.976 | 0 |
| SC | multi (2,0) | 0.865 | 0.883 (0.014) | 0.980 | 0 |
| SH | none | 0.000 | 0 | — | 0 |
| SH | one-step | 0.076 | 0.078 (0.012) | 0.975 | 0 |
| SH | multi (3,0) | 0.691 | 0.705 (0.020) | 0.980 | 0 |
| SJ | none | 0.000 | 0 | — | 0 |
| SJ | one-step | 0.225 | 0.230 (0.019) | 0.975 | 0 |
| SJ | multi (4,3) | 0.699 | 0.713 (0.020) | 0.980 | 0 |
| SS | none | 0.543 | 0.561 (0.022) | 0.970 | 0 |
| SS | one-step | 0.696 | 0.713 (0.020) | 0.976 | 0 |
| SS | multi (1,2) | 0.741 | 0.760 (0.019) | 0.975 | 0 |

($\bar\rho_D\le4\times10^{-4}$ in every case at these conditions; "—": no cooperative outcome.)

Exact decomposition of the change in $\bar\rho$ (midpoint rule; definitions in `analysis/basin_decomposition/basin_decomposition.py`):

| Norm | Change | $\Delta\bar\rho$ | from $\Delta\omega_C$ | from $\Delta\bar\rho_C$ | basin share |
|---|---|---:|---:|---:|---:|
| SC | one → multi | +0.274 | +0.271 | +0.003 | 99% |
| SC | none → multi | +0.255 | +0.241 | +0.014 | 94% |
| SH | one → multi | +0.615 | +0.613 | +0.002 | 99.7% |
| SH | none → multi | +0.691 | +0.691 | (no cooperative outcome without inertia) | 100% |
| SJ | one → multi | +0.474 | +0.472 | +0.002 | 99.5% |
| SJ | none → multi | +0.699 | +0.699 | (no cooperative outcome without inertia) | 100% |
| SS | one → multi | +0.045 | +0.046 | −0.001 | 102% |
| SS | none → multi | +0.198 | +0.194 | +0.004 | 98% |
| SC | none → one | −0.019 | −0.028 | +0.009 | — |

The statement is quantitatively supported: under every norm, at least 94% of the increase in mean cooperation produced by the selected multi-step depths (relative to no inertia or to one-step inertia) comes from the enlargement of the cooperative basin. The cooperation level within the cooperative basin changes by at most 0.019 (SC, none → multi) and is 0.975–0.980 under one-step and multi-step inertia for all norms, limited by implementation error rather than by inertia. The same holds across the benefit-to-cost scan (ED4, 8×512 initial compositions): at every ratio where the selected multi-step depths raise $\bar\rho$ by at least 0.05 relative to one-step inertia, the basin term accounts for 98.8–99.7% (SC), 99.7–99.8% (SH), 99.2–99.8% (SJ) and 100–103% (SS) of the increase (`basin_decomposition_benefit_cost.csv`).

Suggested wording: "Selected multi-step inertia raised mean cooperation mainly by enlarging the cooperative basin—the set of initial strategy compositions that converge to a cooperative state—from 0.61 to 0.88 (SC), 0.08 to 0.71 (SH), 0.23 to 0.71 (SJ) and 0.71 to 0.76 (SS) relative to one-step inertia, whereas the cooperation level reached within that basin was already close to the error-limited maximum (0.975–0.980) and changed by less than 0.005." Caveats to state: the basin fraction refers to area-uniform sampling of the simplex; under SH and SJ without inertia there is no cooperative outcome, so the comparison with no inertia concerns the creation of a basin.

## 8. Manuscript items that must be updated

**Figures to replace** (assembled versions in `../Main_Figure/` were made from the previous data):

| Item | Change |
|---|---|
| Figure 4 | New values for all 180 points; y-axis label "Mean cooperation $\bar\rho$" (was "Basin-weighted cooperation"); envelope labels at SS $K=1$ now $(0,1)$ and at SS $K=6$ now $(1,5)$ (both near-ties); SC envelope shape (peak at $K=5$). |
| ED2 | Rows 2–3 removed (now ED9); new panel e (population level, all-good versus all-bad). |
| ED3 | Cooperation plane (row 3) regenerated; colour-bar label "Mean cooperation $\bar\rho$"; invasion legend "ALLD not excluded"; one SH invasion cell changed. |
| ED4 | Regenerated; realized instead of intended cooperation; one-step SH curve higher (≈0.08). |
| ED5 | Bottom pixel row ($e_2=0$) of panels a, b, e, f changed to "ALLD not excluded"; legend unchanged. |
| ED6 | New values; colour-bar label "Mean cooperation $\bar\rho$"; protection dots removed at SH $(1,5)$, $(1,6)$, $(1,7)$. |
| ED8 | New (reputation geometry along the ALLD–DISC edge). |
| ED9 | New number for the former ED2 rows 2–3 (content unchanged). |
| Figure 2, Figure 3, Figure 5, ED1, ED7 | Unchanged. |

**Numerical values to replace in text or captions** (old → new; reference parameters):

* Mean cooperation (Figure 4 / ED6): SC one-step 0.589 → 0.591, multi-step (2,0) 0.877 → 0.865; SH one-step 0.025 → 0.076, (3,0) 0.697 → 0.691; SJ one-step 0.231 → 0.225, (4,3) 0.704 → 0.699; SS none 0.533 → 0.543, one-step 0.698 → 0.696, (1,2) 0.743 → 0.741; SC envelope 0.894 (K = 4–6) → 0.884/0.888/0.886; SH (8,0) 0.819 → 0.817; SJ (5,3) 0.706 → 0.699; SS (2,6) 0.830 → 0.815.
* Cooperative-basin sizes: use $\omega_C$ from §7 (the old $\rho\ge0.5$ fractions are superseded).
* ED4 at $b/c=5$: values in §3.5 (realized cooperation).
* ED5 class counts: §3.2.
* ED6: SH locally protected pairs 53 → 50.
* ED3 cooperation plane: §3.7.
* Initial-reputation robustness: §3.6 (SJ multi-step 0.699 versus 0.706).

**Terminology to change throughout:** "basin-weighted (realized/intended) cooperation" and "expected cooperation" → "mean long-run cooperation $\bar\rho$"; "cooperative basin" defined by attractor (§4.2), not by $\rho\ge0.5$; ED3/ED5 class "ALLD invades" → "ALLD not excluded"; ED4 now uses realized cooperation (the statement "ED4 uses intended values" in the outlines no longer applies).

**Methods/SI planning documents** (`../Methods_outline.md` lines 94, 137, 147; `../SI_outline.md` lines 158, 281–286, 294, 367, 383, 396) describe the earlier mesh resolutions, the mean-change gate, ED4 intended cooperation and an unidentified ED3 generator. These should now describe the engine (`engine/README.md`): exact reputations wherever the reputation map is not smooth, per-trajectory convergence criterion, attractor-based outcome classes; the ED3 generator is now identified (`engine/scan.py readout`). The outlines were not edited.

**Recommended Extended Data numbering.** The working numbers above keep the existing ED1–ED7 and append ED8 (geometry) and ED9 (former ED2 rows 2–3). If the order should follow first citation in the Results, one option is:

| Recommended | Content | Working number |
|---|---|---|
| ED1 | Recognition landscapes (Figure 2) | ED1 |
| ED2 | Homogeneous-DISC drift and initial-reputation robustness | ED2 |
| ED3 | Homogeneous-DISC readout and depth planes | ED9 |
| ED4 | Reputation geometry along the ALLD–DISC edge | ED8 |
| ED5 | Readout planes: simplexes, cooperation, invasion | ED3 |
| ED6 | Benefit-to-cost ratio | ED4 |
| ED7 | Action and assessment errors | ED5 |
| ED8 | Depth plane | ED6 |
| ED9 | Opportunistic invasion across norms | ED7 |

File and folder names in this release use the working numbers.
