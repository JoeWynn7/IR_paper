# Results revision notes — 28 October 2026

The Results section and all figure captions of `manuscript/Manuscript_formal_20261028.tex` were rewritten from `verified/` (commit `c96d2e8`). The Introduction, Discussion, Methods and SI placeholders were not changed. One reference (Hilbe et al. 2018, PNAS) was added to the bibliography.

## Results structure

1. **Inertial reputation updating** (Fig. 1). Introduces the model and the stationary map $\mathcal R(u)$.
2. **The direction of inertia determines whether private judgements identify defectors** (Fig. 2; ED1–ED3). Covers recognition and agreement, closed forms for pure allocations, bistability and initial-reputation dependence, and reputation-to-cooperation levels.
3. **Inertia reorganizes the evolutionary dynamics of cooperation** (Fig. 3; ED4–ED6, ED2e). Covers attractors, $\bar\rho\approx\omega_C\bar\rho_C$, edge geometry and folds, the viability window, and robustness.
4. **The direction of inertia matters more than its amount** (Fig. 4; ED7, ED8). Covers allocation, the non-monotonic envelope, the depth plane and readout direction.
5. **Tolerance invites opportunistic defection unless warning states carry consequences** (Fig. 5; ED9). Covers $\Lambda$, $\Lambda'(0)$ for any filter, the marginal penalty, and $\alpha_U$ and $\alpha_L$.

## Equations in Results

| Equation | Content | Status |
|---|---|---|
| `eq:results-pure-maps` | $\mathcal R=1-(1-u)^{k_1+1}$ for $(k_1,0)$; $\mathcal R=u^{k_2+1}$ for $(0,k_2)$ (full readout) | Exact; checked against the general map to $10^{-16}$ |
| `eq:results-edge-advantage` | DISC–ALLD payoff advantage on the ALLD–DISC edge | Exact; matches ED8 data to $3\times10^{-15}$ |
| `eq:canonical-window` | $R_L<b/c<R_U$ | Exact; reproduces `invasion_thresholds.csv` |
| `eq:opportunistic-invasion-results` | $\Lambda(\delta)$ | Unchanged from the previous draft |
| `eq:opportunistic-slope-results` | $\Lambda'(0)$ for a general filter $\mathcal F$ | Reproduces `lambda_prime_0` (inertia and aggregation) |
| `eq:results-marginal-penalty` | $\mathcal R'(u_R)\approx(1-\alpha)+(k_1+1)(k_2+1)(1-u_R)^{k_1}$, with $\beta=1$ and $k_1\ge1$ | **New** leading-order expansion; within 0.02 of the exact value on every high-reputation branch tested |
| `eq:results-alpha-upper` | $\alpha_U\approx1-c/[b(1-e_1)(1-2e_2)]$ for deep warning paths | **New** approximation: 0.787 vs exact 0.804–0.807 at $b/c=5$; within ≈0.04 for $b/c\in[2,8]$ |

The exact $\alpha_U$ solves $\Lambda'(0)=0$. Root-finding reproduces every saved upper boundary to $10^{-9}$, consistent with `upper_reason = local_slope`. The derivation of the two new expressions should be added to Methods or SI.

## Extended Data numbering (by first citation)

| Final | Content | Working number / asset file |
|---|---|---|
| ED1 | Replicated recognition, threshold sensitivity | ED1 / `ED_Fig1.pdf` |
| ED2 | Homogeneous-DISC drift (a–d); all-good vs all-bad (e) | ED2 / `ED_Fig2.pdf` |
| ED3 | Readout and depth planes of homogeneous reputation | ED9 / `ED_Fig9.pdf` |
| ED4 | Reputation geometry along the ALLD–DISC edge | ED8 / `ED_Fig8.pdf` |
| ED5 | Benefit-to-cost ratio | ED4 / `ED_Fig4.pdf` |
| ED6 | Error plane | ED5 / `ED_Fig5.pdf` |
| ED7 | Depth plane | ED6 / `ED_Fig6.pdf` |
| ED8 | Readout direction: simplexes (a–d) + cooperation (e–h) + invasion (i–l) | ED3 / `ED_Fig3.pdf` |
| ED9 | Opportunism across norms | ED7 / `ED_Fig7.pdf` |

LaTeX numbers these figures automatically from their order in the file. Asset paths keep the working numbers, and each environment carries a comment naming its source folder in `verified/`.

## Figure edits needed to match the captions

- **Fig. 3:** add panel letters a–d, one per norm column, with three rows (none, one-step, multi-step) in each column.
- **ED8 (working ED3):** combine `ed3_simplex` with the plane block. The simplex columns become a–d, each holding the tolerance-only simplex above the strictness-only one. The plane panels are already lettered e–l.
- **Fig. 5a:** the axis label reads "Normalized invasion exponent", but the text and captions use "normalized invasion fitness".
- `Main_Figure/` contains outdated assembled figures. Use the `verified/` figure packages.

## Methods passages now inconsistent with verified results (not edited)

- **Strategy numerics (lines ~292–298 of the original):** these describe the superseded pipeline (synchronous simplex iteration, mesh resolutions 23/25/41, the mean-change gate, three failing one-step points). Replace them with the description of the engine (`verified/engine/README.md`).
- **Fig. 2 depth map:** the Methods say "ten independent runs per condition", but the verified data use **one run per condition**.
- **Cooperation measures:** the Methods use $\langle\rho_C\rangle_\Delta$ and say ED4 shows intended cooperation. The verified figures use $\bar\rho$ (realized). $\omega_C$ and $\bar\rho_C$ are not defined in Methods; `VERIFICATION_REPORT.md` §4 has the definitions.
- **Initial compositions:** the total-depth scan uses shifted Halton points (seed 2026), not Sobol.
- **Simplex shading:** the Methods describe shading and percentage labels that the verified Fig. 3 does not have.
- **Notation:** the Methods write $r_R^*$; the Results use $r_{\mathrm R}^*$. In the quantitative filter, the symbol $R$ (score bound) clashes with the resident subscript and with $R_L$ and $R_U$.

## Analysis gaps

1. **(Necessary)** Evolutionary dynamics at the protective readout. Fig. 3, Fig. 4 and ED5–ED7 all use $\alpha=1$. For the multi-step SC, SH and SJ allocations, $\alpha=1$ lies outside the O-DISC-secure interval. No result yet shows that $\bar\rho$ and $\omega_C$ remain high at $\alpha\approx0.8$. Until this is computed, the Results cannot claim that resistance to errors and resistance to opportunists hold simultaneously; the current draft does not claim it.
2. **(Recommended)** Derivations of `eq:results-marginal-penalty` and `eq:results-alpha-upper` for Methods/SI. They were derived and checked numerically, not proven in general.
3. **(Optional)** A finite-population check of the evolutionary results. The existing finite-population checks cover reputations only.
