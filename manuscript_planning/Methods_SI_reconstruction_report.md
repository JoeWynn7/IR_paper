# Methods and SI: reconstruction report

This report accompanies the new Methods and Supplementary Information (SI). It records which model was reconstructed, how the historical materials were used, which of their statements were wrong or outdated, the single notation system, and the main-text edits needed for consistency.

## Deliverables

| File | Content |
|---|---|
| `manuscript/Methods_body.tex` | Methods section (body only). Replace the Methods of `Manuscript_formal_20261028.tex` with `\input{Methods_body}`. |
| `manuscript/Methods_references.tex` | Bibliography entries cited in the Methods. Seven of them are not yet in the manuscript bibliography. |
| `manuscript/Methods.tex`, `Methods.pdf` | Stand-alone wrapper and compiled Methods (6 pages; equations numbered M1–M19 only in this wrapper). |
| `manuscript/Supplementary_Information.tex`, `.pdf` | Stand-alone SI (13 Supplementary Notes, 11 Supplementary Tables, 24 pages). |
| `manuscript_planning/methods_si_checks/` | Independent script and its output. It reproduces every number and analytic identity quoted in the Methods and SI without using the project code. |

Scope, as requested: private assessment and the discrete inertial (direct-reset) record only. The continuous ("stepwise-return") chain in `Markov chain.docx` is not included.

## 1. The reconstructed model

The current model is the one implemented in `verified/` and used for every figure.

- **Game and norms.** Donation game with ALLC, ALLD and DISC. Second-order norms with prescriptions `p`, `q` for actions towards recipients regarded as bad: SC (1,0), SH (0,0), SJ (0,1), SS (1,1). Implementation error `e1` acts on intended cooperation only. Assessment error `e2` reverses the prescribed assessment. Both errors are integrated into `P^+_{A|Y}`, conditioned on the *intended* action.
- **Record.** States `G, W_1..W_{k1}, B, S_1..S_{k2}` with `k1, k2 ≥ 0`. Updates use *direct reset*: a positive assessment sends every `W_m` to `G`, and a negative one sends every `S_n` to `B`. The readout is `σ(W_m) = α^m` and `σ(S_n) = 1 − β^n`, freshly sampled at each consultation.
- **Reputation map.** `R(u) = [u^{k2+1} Σ_{m=0}^{k1}(αv)^m + v^{k1+1} Σ_{n=1}^{k2} u^n(1−β^n)] / (v^{k1} + u^{k2} − v^{k1}u^{k2})`.
- **Closure and selection.** Conditional independence of donor and observer images given the recipient's strategy, and i.i.d. inputs to each record. The branch is selected by relaxation from all-good records at every composition.
- **Evolution.** Replicator dynamics with payoffs evaluated at stationary reputations.
- **Simulations.** Finite-population simulations at fixed strategy counts, used for reputation formation only (no strategy evolution).

## 2. What was kept and what was wrong in the historical materials

| Source | Status | Problems found (not carried over) |
|---|---|---|
| `Model11.docx` | Early derivation of the direct-reset chain; the stationary distribution and the map are correct. | A single `k` for both paths in the first part. `p` is used both as a norm parameter and as the positive-evaluation probability. Typos `d_GC`, `d_BC`. Includes public assessment, which is out of scope. |
| `Markov chain.docx` | The direct-reset ("skip") part is correct. | The normalizer is labelled `D^{-1}` but is `D`. The second half is the continuous/stepwise-return chain, which is excluded as instructed. |
| `old_1.tex` | Correct transform, threshold proposition and filtering corollaries. | Uses `r` for `b/c`, which clashes with reputation `r`. Uses `Φ` for the reputation map, which clashes with the assessment probabilities `Φ_C`, `Φ_D`. Requires `k1, k2` to be positive. Corollary 1's linear term `(1−α)δ` needs `k1 ≥ 1`; it fails for `k1 = 0`. Calls labels "publicly recordable", which is inconsistent with private assessment. |
| `old_2.tex` | Main source for the SI derivations. Correct: `P^+` derivation, stationary distribution, full-state versus auxiliary distinction, rare-mutant identity, `Λ(δ)`, `Λ'(0)`, local and global security, `k2 = 0` concavity, the error-free threshold and the fold/closure algebra. | `k1, k2 ∈ ℕ` (positive only). Writes `Φ_R(u)` with `u` as a *reputation*, although `u` is an assessment probability. The numerical section (adaptive DOP853 on an interpolated field; 512 scrambled-Sobol starts for all scans; basin = intended cooperation ≥ 0.5; "basin-weighted cooperation") is superseded by the verified engine. `δ_c` is defined as the total length of positive intervals instead of the upper end. Its ED numbering no longer matches. The temporal and persistent opportunism sections are out of scope. A "720-case audit" is not in the verified package and is not cited. The waiting-time formula uses `q`, which clashes with the norm parameter. |
| `Methods_Rewritten.docx` | Close to the current model and settings. | Strategy indices `C, D, R` clash with actions `C, D` and with the resident `R`. `ρ` is used for both cooperation at a composition and its average. |
| `Secure_Readout_Main_Text_and_SI.docx` | Correct O-DISC derivation and SJ worked example; all numbers verified. | `η` for `(1−e1)(1−2e2)` clashes with the persistence `η` in `old_2`. `h(α)` for `min H` clashes with `h_GG`, `h_GB`, `h_BB`. |
| `Supplementary_Information_Full.docx` | Most recent; matches the verified engine settings. | Its ED numbering (ED6 readout, ED7 errors, ED8 depth plane; "ED2e–h") differs from the manuscript. Strategy indices `C, D, R`. `A_{as}` notation. |
| `Aggregation and Quantative.txt` | Correct benchmark maps. | `g(u)` clashes with the simulated `g_I`. `q` (threshold fraction) clashes with the norm `q`. `T` (count) clashes with the transition matrices. `R` (score bound) and `r_t` (score) clash with `R` and `r`. `ρ = u/(1−u)` clashes with cooperation. |

### Outdated statements in the current manuscript Methods (`Manuscript_formal_20261028.tex`)

These are corrected in the new Methods, following `verified/VERIFICATION_REPORT.md` and the engine code:

1. **Strategy fields.** The old text says the strategy-dynamics scans use an interpolated replicator field on resolution-23/25/41 meshes, scrambled-Sobol starts for the depth scan, midpoint step 0.1/0.05, and 4,000- or 5,000-step blocks. It also says three one-step points "did not pass". The verified engine instead uses:
   - reputations exact on a 120-subdivision lattice, interpolated only inside smooth cells, with the field never interpolated;
   - shifted-Halton starts (seed 2026), with Sobol only for the `b/c` scan;
   - midpoint step 0.2, stopping after three 100-time-unit blocks with change ≤ 10⁻⁷ (cap 4×10⁴);
   - all conditions pass the outcome-gap check.
2. **Figure 3.** The old text says Fig. 3 uses synchronous moment iteration "retaining terminal iterates". Fig. 3 uses RK4 relaxation (0.1 then 0.2) to residual ≤ 10⁻¹².
3. **Relaxation step.** The old text says the relaxation step is 0.1. The engine uses 0.25 (fallback 0.1).
4. **ED1 drift criterion.** This is described as a diagnostic only. In the ED1 code it is an eligibility condition for selection (`choose()` requires `convergence_flag`).
5. **Symbol clashes:**
   - `g_{α,β}(δ)` clashes with `g_I`;
   - `M` is used both for the number of initial compositions and for the aggregation sample size;
   - `s_max`, `s_0` clash with `s_ij`;
   - `m = n_DISC` clashes with the index of `W_m`;
   - `φ(C,G)` (norm) is easily confused with `Φ` (assessment).

## 3. New or sharpened analytical results in the SI (please review)

All were checked numerically (`methods_si_checks/`). They explain statements already in the Results; none changes a result.

- **Chord condition (Prop. S9).** The ALLC/ALLD window is non-empty iff `r R(Φ_C*) + (1−r) R(Φ_D*) < R(u_R*)`. Equivalently, `H_ALLC < c/b < H_ALLD`, where `H_ALLC` is the reputation gained per extra cooperation and `H_ALLD` the reputation lost per withheld cooperation.
- **No window without inertia (Cor. S10).** Without inertia, `R_L = R_U = 1/ΔΦ*`. This proves the Results statement that "Without inertia, this window is empty under all four norms".
- **One family for all mutants (Lemma S7).** ALLC, ALLD, O-DISC and the resident form one family indexed by intended cooperation `χ`, with `u_X = χΦ_C* + (1−χ)Φ_D*`. For O-DISC, `u_X(δ) = (1−δ)u_R* + δΦ_D*`.
- **Location of the worst mutant (Cor. S12).** Concave `R` puts the worst mutant at `δ → 0` and implies `Λ(δ) ≥ δΛ(1)`. Convex `R` makes ALLD the worst mutant.
- **Where the secure interval closes (Prop. S14).** At `b/c = u_R'(r_L)/ΔΦ(r_L)`. This is exactly 2 for Shunning at any error rate, depth or readout, which explains "the interval can therefore close (Shunning at b/c = 2)". It is ≈ 1.971 for SJ (4,3) and 1 for Scoring, so a fold never closes the Scoring interval.
- **Error-free threshold (Prop. S13, from `old_2`).** `α ≤ 1 − c/b`, which is 0.8 at `b/c = 5`. The Methods now state that this is the origin of the illustrative readout `α = 0.8`.
- **Smaller results.**
  - Full-readout symmetry: `R = u^{k2}(1−v^{k1+1})/Z` and `1 − R = v^{k1}(1−u^{k2+1})/Z`.
  - Renewal interpretation: under full readout, `R` is the fraction of time in good standing, given by the mean passage times.
  - The SC no-inertia neutral line `f_DISC = c/[b(ε−e2)]`.
  - The two no-inertia implementations, `(0,0)` and `α = β = 0`, generate identical image processes (Lemma S1).

## 4. Methods versus SI

| Topic | Methods | SI |
|---|---|---|
| Game, norms, errors | Definitions, `P^+` (M1), `Φ_C`, `Φ_D`, `ΔΦ` (M2) | Event-by-event derivation, per-norm tables (Notes 2) |
| Record and readout | State space, rules, readout (M3–M4) | Full transition table, matrices, instantaneous equivalence (Note 3) |
| Reputation map | Balance argument, `π` and `R` (M5–M6), key properties | Proofs, special cases, derivative, asymptotics, concavity, passage times (Note 4) |
| Reputation equations | Closure, `h`, `u_I`, self-consistency, relaxation, homogeneous DISC (M7–M10) | Assumptions and what they neglect, full latent-state system and equivalence, three selection protocols, readout sensitivity, ALLD–DISC edge reduction (Note 5) |
| Strategy dynamics | Payoffs, replicator, `ρ`, `ρ̄`, `ω_C` (M11–M12) | Derivations, equilibrium classification, SC neutral line, basin decomposition (Note 6) |
| Local invasion | Mutant identity and window (M13–M14), classification rule | Proofs, degenerate cases, chord condition, reference values (Note 7) |
| O-DISC | `u_X`, `Λ`, `Λ'(0)`, criterion (M15–M17), boundaries, filters | Proofs, curvature corollary, error-free theorem, closure, SJ example, interval table (Notes 8–9) |
| Simulations | Algorithm, estimators, design and selection | Pseudocode details, exact estimator form, seeds and extension, selected-architecture table (Note 10) |
| Numerics and figures | Solvers and figure settings (condensed) | All tolerances, grids and seeds; figure-by-figure table (Notes 11–12) |

As you suggested, the local-invasion derivation lives in the SI. The Methods keep one invasion subsection that states the general rare-mutant identity once, reads off the ALLC/ALLD window and the O-DISC results from it, and points to the SI proofs.

## 5. Notation crosswalk and main-text edits needed

The Methods and SI use the quantities you listed: `P^+_{D|G}`, `r_R*`, `R[...]`, `ΔΦ*`, `R'(u_R*)`, `r_X*(δ)`, and `min_δ (r_R* − r_X*(δ))/(δ r_R*) ≥ c/b`. The current Results and captions still use older symbols:

| Current Results / captions | Use instead |
|---|---|
| `u_C(r)`, `u_D(r)` | `Φ_C(r)`, `Φ_D(r)` |
| `Δu(r)`, `Δu*` | `ΔΦ(r)`, `ΔΦ*` |
| `∂_u R(u_R*; α, β, k1, k2)` | `R'(u_R*)` (dependence on `α, β, k1, k2` implicit, or `R'(u_R*; α, β, k1, k2)`) |
| Eq. `results-alpha-upper`: `(b/c) Δu(r_U) ∂_u R(…) = 1` | `(b/c) ΔΦ(r_U) R'[u_R(r_U); α_U] = 1` |
| Eq. `canonical-window` written with `R[u_D(r_R*)]` | Either keep `R(Φ_D*)` or use the expanded form `R[r_R* P⁺_{D|G} + (1−r_R*) P⁺_{D|B}]` you plan to use; both are defined in Methods Eq. (M14) |
| "positive-assessment probabilities generated by the three strategies `Φ_I`" (old Methods) | `u_I` (strategy level); `Φ_A` is reserved for action-conditional probabilities |
| `g_{α,β}(δ)` | `H(δ)`; `H_min = min_δ H(δ)` |
| `𝓕`, `𝓕_A`, `𝓕_Q`, `s_max`, `s_0`, `M` (initial compositions) | `R_agg`, `R_score`, `z_max`, `z_0`, `n_init` |
| `φ(C,G)` (norm table) | `ν_{CG}` |

**Convention to note.** `G` and `B` denote both the image values and the two established latent states. The established states are always read as the image of the same name, so the dual use cannot cause an error; SI Note 1 states the convention explicitly. If you prefer full separation, rename the latent states (for example to calligraphic letters) in Fig. 1 and the Results as well.

**References.** Seven new bibliography keys are needed when `Methods_body.tex` is inserted into the manuscript: `okada2018`, `radzvilavicius2019`, `ohtsuki2004`, `kessinger2023`, `kawakatsu2024`, `hofbauer1998` and `virtanen2020`. The SI additionally cites `radzvilavicius2021`. Entries are in `Methods_references.tex`; please check them against the PDFs in `Refs/`.

## 6. Items for you to decide or check

1. **Methods length.** About 3,600 words of prose plus equations. The "Alternative reputation filters" paragraph and the figure-specific paragraph are the easiest to shorten further by pointing to SI Notes 9 and 12.
2. **ED numbering.** Methods and SI follow the manuscript order (ED1 recognition, ED2 resident drift, ED3 reputation planes, ED4 edge geometry, ED5 b/c, ED6 errors, ED7 depth plane, ED8 readout, ED9 opportunism security). If the order changes, update the `\figlabel` block in `Methods.tex` and the `\ED…` macros at the top of the SI.
3. **Data and code availability.** This is a placeholder; no repository or DOI is asserted.
4. **Old outlines.** `Methods_outline.md` and `SI_outline.md` (repository root) describe superseded numerical settings and should not be used for further writing.
5. **Continuous model.** If the continuous (stepwise-return) model is later added, it fits as a new Supplementary Note after Note 4. It would need its own stationary distribution; the population, invasion and security machinery of Notes 5–8 applies unchanged with its `R`.
