# Results writing report — 29 October 2026

**Scope.** The Results section and all 14 figure captions of `manuscript/Manuscript_formal_20261028.tex` were rewritten following `Results_Blueprint_NHB.docx`. Numbers come from `verified/` (IR_paper commit `41e91fe`). The Introduction and Discussion are unchanged; Methods were changed only for notation (see §7). The manuscript compiles with no errors or undefined references (26 pages).

**No inconsistency between the blueprint and the verified results required changing its logic.** Two points in my instructions differed from the blueprint; I followed the blueprint in both:

- **Where ED4 and ED5 belong.** The task text listed working ED4 and ED5 under Results 4. The blueprint places them in Results 3 as brief robustness statements, and Results 3 is where they now appear.
- **Fig. 3 evidence.** The blueprint's Fig. 3 caption says the selected architectures "broaden the region leading to cooperative outcomes". The streamline portraits do not draw basins, so this claim rests on the sampled scans (cooperative-basin fractions). The text quotes those fractions, and the caption says "reached from a larger part of the simplex".

## 1. Final five-section structure

| # | Subsection title (from blueprint) | Main figure | Extended Data cited (final number ← working number) |
|---|---|---|---|
| 1 | A framework for inertial reputation updating | Fig. 1 | — |
| 2 | Directional inertia reshapes private reputation dynamics | Fig. 2 | ED1 ← ED1; ED2a–d ← ED2a–d; ED3 ← ED9 |
| 3 | Directional inertia reshapes strategy dynamics | Fig. 3 | ED2e ← ED2e; ED4 ← ED8; ED5 ← ED4; ED6 ← ED5 |
| 4 | Cooperation depends on how inertia is allocated, not simply on total depth | Fig. 4 | ED7 ← ED6; ED8 ← ED3 |
| 5 | Reputation readout balances tolerance and opportunistic exploitation | Fig. 5 | ED9 ← ED7 |

Extended Data are numbered by first citation, which reproduces the blueprint's "Extended Data architecture" table order exactly. Asset file names keep the working numbers, and a comment above each figure environment names its source folder in `verified/`.

## 2. Main conclusion of each section

1. **Framework.** Deterioration and recovery are separately tunable evidence-accumulation processes. Depth ($k_1,k_2$) sets when a reversal completes; readout ($\alpha,\beta$) sets how incomplete evidence affects treatment.
2. **Private reputation dynamics.** Agreement alone is not enough (one-step Shunning agrees on "everyone is bad"). Only norm-specific allocations give both recognition and agreement across observers:
   - Separation is 0.88–0.92 with disagreement 0.06–0.08 under the selected architectures. One-step inertia meets both criteria under none of the norms.
   - The design generalization (deterioration inertia for SC/SH, stricter recovery for SS, both directions for SJ) is stated as suggested by the four norms, not as a theorem.
   - One-step inertia makes homogeneous DISC reputations history dependent under SC, SH and SJ; the selected architectures have a single high-reputation state.
3. **Strategy dynamics.** Without inertia there is no common route to stable cooperation.
   - One-step inertia makes DISC a strict local attractor under all four norms, but cooperation is reachable from only 8% of initial compositions under SH and 23% under SJ.
   - The selected architectures give highly cooperative attractors:
     - The attractor is pure DISC under SC, SH and SJ, reached from 88%, 71% and 71% of compositions.
     - Under SS it is an ALLC–DISC mixture (about 80% DISC), reached from 76%.
     - Realized cooperation is 0.975–0.980, close to the error ceiling of 0.98.
   - ALLD remains an attractor in every case.
   - Mechanism: under SH and SJ the selected architectures displace (SH) or remove (SJ) the fold; under SC and SS the threshold shifts smoothly.
   - Robustness to $b/c$, errors and initial reputation is covered in three sentences.
   - Basin enlargement appears once, as one quantitative observation ("accounts for much of this increase"). The change in the cooperative state itself is given equal weight.
4. **Allocation.** At fixed $K$, cooperation ranges from almost none to high. Pure strictness gives no cooperation under SC, SH and SJ.
   - The recognition-selected architectures lie on the cooperation envelope at their depths.
   - More inertia is not better: SC peaks at $K=5$, and SJ is flat from $K=7$ to $K=8$.
   - Directionality also operates through readout (ED8 ← working ED3), with a norm-dependent response.
5. **Tolerance–exploitation trade-off.** Excluding ALLD does not exclude partial opportunism; the SJ (4,3) architecture with $\alpha=1$ can be invaded by all opportunists with $0<\delta<0.365$.
   - Alternative mechanisms are presented as illustrations, not benchmarks.
   - Lowering $\alpha$ restores a marginal penalty. The secure interval is $\alpha_L<\alpha\le\alpha_U$ with $\alpha_L\approx0.567$ and $\alpha_U\approx0.804$, defined implicitly from the full model.
   - $\alpha=0.8$ is secure for all four selected architectures, with $r_R^*$ of 0.978–0.990.
   - The scope is limited to the IID O-DISC family and explicitly excludes ALLC.

## 3. Equations retained in the main text

| Label | Equation | Why it is in the Results |
|---|---|---|
| `eq:results-separation` | $\Delta g=\tfrac12(g_{\rm DISC}+g_{\rm ALLC})-g_{\rm ALLD}$ | Defines the recognition measure used by Fig. 2 and the selection rule (blueprint Results 2, Layer 1). |
| `eq:canonical-window` | $R_L=\dfrac{r_R^*}{r_R^*-\mathcal R[u_D(r_R^*)]}<\dfrac bc<\dfrac{1-r_R^*}{\mathcal R[u_C(r_R^*)]-r_R^*}=R_U$ | Explains local viability of DISC against ALLD and ALLC, and why SS settles in a mixture ($R_U\approx4.0<5$). Matches the blueprint's form. Checked against `invasion_thresholds.csv` to machine precision. |
| `eq:opportunistic-invasion-results` | $\Lambda(\delta)=\delta r_R^*-(b/c)[r_R^*-r_X^*(\delta)]$ | Separates saved cost from lost future benefit. |
| `eq:opportunistic-slope-results` | $\Lambda'(0)=r_R^*[1-(b/c)\Delta u(r_R^*)\,\partial_u\mathcal R(u_R^*;\alpha,\beta,k_1,k_2)]$ | Shows why a flat reputation response makes weak opportunism pay. Reproduces the saved `lambda_prime_0` values. |
| `eq:results-alpha-lower` | $F(r_L,\alpha_L)=0,\ \partial_rF(r_L,\alpha_L)=0$, with $F=\mathcal R(u_R(r);\alpha,\beta,k_1,k_2)-r$ | Implicit fold definition of $\alpha_L$, as in the blueprint. |
| `eq:results-alpha-upper` | $(b/c)\,\Delta u(r_U)\,\partial_u\mathcal R(u_R(r_U);\alpha_U,\beta,k_1,k_2)=1$ | Weak-opportunism reduction of $\max_\delta\Lambda=0$, which is stated in the text. Justified because every interior upper boundary in the verified data (926 of 926 cases across norms, architectures and $b/c$) is `local_slope`. Root-finding on this condition reproduces the saved $\alpha_U$ to $10^{-9}$. |

**Not in the main text, per the blueprint:**
- The universal approximation for $\alpha_U$ is removed. It is accurate to within about 0.04 and could go to the SI, labelled as asymptotic.
- The pure maps $1-(1-u)^{k_1+1}$ and $u^{k_2+1}$ are omitted.

One exact property is stated inline only: for $k_1\ge1$, $\partial_u\mathcal R\to1-\alpha$ as $u\to1$, independently of $\beta$ and $k_2$. This explains why full tolerance readout flattens the response. I derived it from the stationary map and checked it numerically; the derivation should be added to the SI.

## 4. How each Extended Data figure supports the main results

| Final | Working | Supports | Role in the text |
|---|---|---|---|
| ED1 | ED1 | Results 2 / Fig. 2 | Replication (30 runs); exact integers depend on the criteria, the direction does not. |
| ED2 | ED2 | a–d: Results 2; e: Results 3 | Homogeneous-DISC bistability (one-step) versus a single high state (selected); population-level robustness across all-good and all-bad initial reputations. |
| ED3 | ED9 | Results 2 | One sentence: readout and depth both reorganize reputation levels and multistability. No cell counts in the text. |
| ED4 | ED8 | Results 3 / Fig. 3 | Mechanism: fold displacement or removal (SH, SJ) versus smooth threshold shifts (SC, SS). |
| ED5 | ED4 | Results 3 | Brief robustness across $b/c$; visualizes $R_L$ and $R_U$. |
| ED6 | ED5 | Results 3 | Brief local-protection robustness across errors; labelled as not being a cooperation scan. |
| ED7 | ED6 | Results 4 / Fig. 4 | Two-dimensional extension of the allocation result; protection versus cooperation. |
| ED8 | ED3 | Results 4 | Readout analogue of directional depth. |
| ED9 | ED7 | Results 5 / Fig. 5 | Secure readout intervals across norms and $b/c$. |

## 5. Remaining scientific issues before the Results are final

1. **Evolutionary outcomes at the protective readout (analysis missing; not added).** Results 3–4 use $\alpha=1$. For the selected SC, SH and SJ architectures, $\alpha=1$ is outside the IID-secure interval. The text does not claim that high mean cooperation and opportunism resistance hold together; it only states that residents remain highly cooperative at $\alpha=0.8$. Computing $\bar\rho$ and $\omega_C$ at $\alpha\approx0.8$ for the four selected architectures would let the paper make the stronger claim in its final sentence.
2. **Methods "Numerical strategy calculations" is outdated (not edited, as instructed).** It describes the superseded pipeline: synchronous simplex iteration with non-converged points, mesh interpolation at resolutions 23/25/41, a mean-change gate, three failing one-step points, and Sobol initial points for the depth scan. The verified results use the engine in `verified/engine/README.md` (exact reputations, per-trajectory convergence, shifted Halton points). This paragraph contradicts the Fig. 3 and Fig. 4 captions and must be replaced before submission.
3. **SI derivations needed** for the inline limit $\partial_u\mathcal R\to1-\alpha$ and, if retained, the asymptotic $\alpha_U$ approximation.
4. **Figure artwork changes:**
   - Fig. 1: relabel "Suspicion states" as "Recovery states".
   - Fig. 3: add panel letters a–d (one per norm column).
   - Fig. 5a: change the axis label "Normalized invasion exponent" to "invasion payoff".
   - ED8 (working ED3): assemble as described in §6.
5. **Minor:** the Fig. 4 envelope at SS $K=1$ is a near-tie, $(0,1)$ 0.554 versus $(1,0)$ 0.552. The text describes the SS pattern "from $K=2$ onwards" accordingly.

## 6. Recommendation for `ed3_simplex`

**Integrate four representative panels into the readout Extended Data figure (final ED8 ← working ED3), and move the full eight-panel set to the SI.**

- **Panels a–d:** tolerance-only and strictness-only simplexes for Scoring and Stern Judging. Scoring shows that strictness-only readout leaves only an ALLC–DISC edge mixture that ALLD can invade. Stern Judging shows that discriminators lose their high-reputation state.
- **Panels e–l:** the existing cooperation and invasion planes, already lettered e–l in the verified file, so no relettering is needed.

This follows the blueprint's guidance: representative simplexes help interpret the corners of the $\alpha$–$\beta$ planes, and a 16-panel figure is avoided. The caption cites the SI for the statement that strictness-only readout fails under all four norms.

## 7. Methods edits (notation only)

- "Suspicion states" is now "recovery states" throughout, following the blueprint.
- $\Phi_R(r)$, $\Phi_C^*$, $\Phi_D^*$ and $\Delta\Phi^*$ are replaced by $u_C(r)$, $u_D(r)$, $u_{\rm R}(r)$ and $\Delta u(r)$, defined in `eq:methods-resident-assessment` and matching the blueprint. $u_{\rm R}(r)$ is algebraically identical to the former $\Phi_R(r)$.
- $r_R^*$ is written $r_{\mathrm R}^*$ throughout.
- The realized cooperation rate is written $\rho$ (previously $\rho_C$) to avoid a clash with $\bar\rho_C$. $\langle\rho_C\rangle_\Delta$ is replaced by definitions of $\bar\rho$, $\omega_C$ and $\bar\rho_C$ (attractor-based basin), with the measures-of-cooperation sentence corrected (all averages realized). The sentence about simplex shading, which does not exist in the verified figures, is removed.
- The Fig. 2 depth map uses "one run per condition", not "ten independent runs".
- The quantitative filter's score bound and threshold are renamed $s_{\max}$ and $s_0$, avoiding clashes with $R_L$, $R_U$ and the resident subscript.
