# Results presentation — Indirect reciprocity with inertial reputation updating

*Working document for organizing the Results before manuscript drafting (target: Nature Human Behaviour; for discussion with Christian Hilbe).*
*Basis: `verified/` at commit `eeb80ec` (27 Oct 2026) — `VERIFICATION_REPORT.md`, `Model.md`, figure packages, engine, `analysis/`. All numbers below are verified values; superseded values from `code-and-figures/`, `Main_Figure/` and `previous_version/` folders are not used.*

---

## 0. How to read this document

**Evidence labels.** Every finding is tagged by the kind of evidence behind it.

| Label | Meaning |
|---|---|
| **[A]** | Analytical result (closed form or proof) |
| **[N]** | Deterministic numerical calculation in the mean-field model (root finding, continuation, ODE integration over sampled initial conditions) |
| **[S]** | Stochastic finite-population simulation of the private-record process |
| **[I]** | Mechanistic interpretation — consistent with the results, not directly demonstrated by a single calculation |
| *(supp.)* | Supporting analysis in `verified/analysis/` that is not shown in any current figure |

Within each section, **Demonstrated** lists what the data show; **Interpretation** lists mechanistic readings. Keep this separation in the manuscript.

**Reference settings.** $b/c=5$, $e_1=e_2=0.02$ (maximum realized cooperation $1-e_1=0.98$). Three inertia conditions recur throughout:

| Condition | Depths $(k_1,k_2)$ | Readout $(\alpha,\beta)$ | Stationary response |
|---|---|---|---|
| No inertia | $(0,0)$ [equivalently $(1,1)$ with $\alpha=\beta=0$] | — | $\mathcal R(u)=u$ |
| Full one-step inertia | $(1,1)$ | $(1,1)$ | one-step $\mathcal R$ |
| Selected multi-step inertia | SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$ | $(1,1)$ | multi-step $\mathcal R$ |

The multi-step depths were selected by a **recognition** criterion (Figure 2, ED1), not optimized for cooperation, basin size, error tolerance or opportunism resistance.

**Main-model convention.** At every strategy composition reputations are relaxed from the all-good state to the self-consistent equilibrium (conditional-independence closure; reputations fast, strategies slow, replicator dynamics). Other initial reputations appear only as robustness (ED2e).

**Terminology adopted (verified).**

| Symbol | Term to use | Do not use |
|---|---|---|
| $\rho$ | realized cooperation, $(1-e_1)(f_{\rm ALLC}+f_{\rm DISC}\bar r)$ | intended cooperation (except where explicitly labelled, e.g. $r_R$ in Fig. 5/ED7) |
| $\bar\rho$ | mean long-run cooperation (averaged over area-uniform initial strategy compositions) | basin-weighted / expected cooperation |
| $\omega_C$ | size of the cooperative basin (fraction of initial compositions converging to an attractor with positive cooperation) | fraction with $\rho\ge0.5$ |
| $\bar\rho_C$ | cooperation level within the cooperative basin | — |
| $k_1$, $\alpha$ | tolerance depth, tolerance strength (warning path) | — |
| $k_2$, $\beta$ | strictness (recovery) depth, strictness strength (recovery path) | — |
| — | "ALLD not excluded" (includes neutral ALLD) | "ALLD invades" |
| — | "pure DISC locally protected" (rare ALLD and ALLC both excluded) | "ESS" without qualification |

**Working versus proposed figure numbers.** File names use working numbers (ED1–ED9). Section A1 proposes a final numbering that follows first citation in the narrative below. Captions in Part 3 are labelled with the working number and the proposed number.

---

## Central message (one paragraph)

Inertia — requiring several consecutive assessments before an observer's private judgement of a target is reversed — turns private reputations into informative, widely shared signals, but only when inertia is allocated in the direction the social norm requires. In evolutionary terms, inertia does not raise the cooperation level of cooperative outcomes (which is already limited by implementation error) and does not remove defection as an attractor; instead, correctly allocated inertia **enlarges the set of initial conditions from which discriminators take over**. It does so by reshaping the self-consistent reputation landscape: tolerance of negative evidence lifts discriminator reputations where defectors are common and removes or displaces reputation folds, whereas recovery depth with full readout creates low-reputation traps. Tolerance is therefore necessary, strictness is useful only in combination and only under some norms, and fully tolerant readout carries a cost — it can be exploited by occasional defectors unless warning states are read more cautiously.

---

# Part 1. Results narrative

Recommended order (nine subsections; the first is the model and can be brief or moved to the start of Results as "Model overview"):

| § | Suggested title | Main display items | Role |
|---|---|---|---|
| R0 | Inertial reputation records | Fig. 1 | Model |
| R1 | Directional inertia makes private reputations informative and shared | Fig. 2; ED1 | Phenomenon (reputation level) |
| R2 | Inertia stabilizes discriminators but leaves defection stable | Fig. 3; ED2a–d; ED9 | Phenomenon (evolutionary, local) |
| R3 | Inertia increases cooperation by enlarging the cooperative basin | Fig. 4; ED6; basin decomposition | Core result (evolutionary, global) |
| R4 | Reputation folds and branch shifts determine where cooperation can grow | ED8 (+ ED9) | Mechanism |
| R5 | Tolerance is necessary; strictness helps only in combination | ED3; Fig. 4 allocation; ED6; ED9 | Mechanism / design principle |
| R6 | Robustness to benefits, errors and initial reputations | ED4; ED5; ED2e | Robustness |
| R7 | Tolerance can be exploited by occasional defectors | Fig. 5; ED7 | Claim boundary / trade-off |

Rationale for this order: Nature Human Behaviour readers should first see that the mechanism does something interpretable at the level of social judgement (R1), then what it does for the evolution of cooperation (R2–R3), then why (R4–R5), then how general the result is (R6), and finally where its limits lie (R7). Putting the basin result (R3) before the mechanism (R4) lets the mechanism answer a question the reader already has. Putting opportunism last makes it an honest qualification rather than an afterthought.

---

## R0. Inertial reputation records (Figure 1)

**Suggested title.** *An inertial model of private reputation updating*

**What to state.** Well-mixed donation game ($b>c$) with ALLC, ALLD and DISC; private assessment (each observer uses its own image of the recipient when applying the norm to the donor's realized action); four second-order norms (SC, SH, SJ, SS) that differ only in how actions toward recipients regarded as bad are assessed; implementation error $e_1$ and assessment error $e_2$. Each observer keeps an internal record per target with $k_1$ warning states and $k_2$ suspicion/recovery states and a direct-reset rule; losing good standing requires $k_1+1$, regaining it $k_2+1$ consecutive assessments by the same observer about the same target. A probabilistic readout ($\alpha^m$, $1-\beta^n$) separates *when* the record completes a reversal (depth) from *how intermediate evidence affects treatment* (readout).

**Key formal object to introduce here.** The stationary reputation response $\mathcal R(u)$ (Model §5): the probability of being read as good when assessments are independently positive with probability $u$. With $\mathcal R(u)=u$ for instantaneous updating, inertia enters the whole analysis only through the shape of $\mathcal R$. This makes R4–R5 easy to explain later.

**Claim boundary.** The deterministic analyses use a conditional-independence closure for private images; finite-population simulations (R1) retain individual records. Norms and inertia parameters are fixed within a population; only behavioural strategies evolve.

**Transition.** First question: does inertia change what observers believe about each other, before any evolution?

---

## R1. Directional inertia makes private reputations informative and shared (Figure 2; ED1)

**Scientific question.** At a fixed strategy composition, does inertia let DISC observers (i) regard cooperators as good and defectors as bad (*separation*) and (ii) agree with each other (*low disagreement*)? Does the amount or the direction of inertia matter?

**Analysis.** [S] Finite-population private-record process, equal numbers of ALLC, ALLD, DISC, all records start good, $e_1=e_2=0.02$. Snapshots ($N=90$, one run each); depth landscapes $k_1,k_2\in\{0,\dots,6\}$ ($N=150$, one run per condition, 41 sampling times); 30 independent replicates per condition for selection and threshold sensitivity (ED1; 5,880 runs). Observables: separation $\Delta g=\tfrac12(g_{\rm DISC}+g_{\rm ALLC})-g_{\rm ALLD}$ and mean observer disagreement $\bar d$.

**Demonstrated.**
- Without inertia, recognition is poor under every norm: $\Delta g$ = 0.70 (SC), 0.015 (SH), 0.010 (SJ), 0.61 (SS), with $\bar d$ = 0.20, 0.06, 0.50, 0.24 (ED1 data, 30 replicates).
- Full one-step inertia meets neither default criterion ($\Delta g\ge0.8$, $\bar d\le0.1$) under any norm. Under SH it produces near-unanimous *bad* opinions of everyone ($g_I\approx0.0008$ for all three strategies; $\Delta g\approx0.00004$, $\bar d=0.0016$): agreement without information. Under SJ disagreement stays at chance ($\bar d=0.50$). SS comes closest ($\Delta g=0.815$, $\bar d=0.108$).
- Norm-specific multi-step allocations meet both criteria with the smallest total depth: SC $(2,0)$ $\Delta g=0.919$, $\bar d=0.064$; SH $(3,0)$ 0.906, 0.069; SJ $(4,3)$ 0.881, 0.081; SS $(1,2)$ 0.917, 0.056 (95% bootstrap intervals ≈ ±0.0005; ED1 table).
- The allocation, not the total depth, determines recognition: the qualifying regions are tolerance-dominated (SC, SH), bidirectional (SJ) and recovery-dominated (SS) (Fig. 2e–h). Under SJ, recovery-dominated allocations ($k_2>k_1$) *invert* recognition — ALLC is regarded worse than ALLD ($\Delta g$ down to $-0.29$; single-run landscape).
- The selected integers depend on the operational thresholds (ED1e–h; e.g. $\Delta g\ge0.90$, $\bar d\le0.05$ selects SC $(3,1)$, SH $(4,1)$, SJ $(5,5)$, SS $(1,3)$), but the direction of the allocation is stable across the threshold grid.

**Interpretation [I].** Each norm generates different erroneous signals. SC and SH condemn justified defection against bad recipients, so DISC players accumulate unwarranted negative assessments — tolerance buffers these. SS approves defection against bad recipients, so ALLD can earn positive assessments — longer recovery limits readmission of defectors. SJ makes the assessment of either action depend on the observer's image of the recipient, so private disagreement creates errors in both directions — both depths are needed. Recognition requires *informative agreement*, not agreement alone (SH one-step).

**Claim boundary.** Fixed equal composition; recognition is not cooperation or stability. Separation is a contrast of mean reputations, not classification accuracy. Fig. 2 landscapes are single runs (no uncertainty); replicated values come from ED1. The selected pairs are minimum-depth selections under stated thresholds within a $0$–$6$ grid, not optimal architectures. No statistical tests; do not write "significantly".

**Transition.** Recognition at a fixed composition does not say whether discriminators can spread. We therefore embed the reputation dynamics in strategy evolution, carrying forward the three conditions (none, one-step, selected multi-step).

---

## R2. Inertia stabilizes discriminators but leaves defection stable (Figure 3; ED2a–d; ED9)

**Scientific question.** How does inertia change the evolutionary dynamics of ALLC, ALLD and DISC — in particular, can a population of discriminators resist invasion, and is cooperation then globally attracting?

**Analysis.** [N] Replicator fields on the strategy simplex with reputations relaxed from all-good at every composition (residual $\le10^{-12}$); equilibria and eigenvalues (`simplex_dynamics/equilibria.csv`). Homogeneous-DISC reputation drift $\mathcal R(\varphi_{\rm DISC}(r))-r$ and its roots (ED2a–d); highest stable homogeneous reputation and multistability over the one-step readout plane and the full-readout depth plane (ED9).

**Demonstrated.**
- *No inertia:* the DISC vertex is never a strict sink. SC: DISC is a saddle; a neutral equilibrium segment at $f_{\rm DISC}=c/[b(A_{\rm CG}-A_{\rm DG})]\approx0.2126$ connects the two DISC edges [A/N]. SH and SJ: DISC is unstable (homogeneous reputations 0.020 and 0.500). SS: a stable ALLC–DISC mixture $(0.775,0,0.225)$ with intended cooperation 0.989.
- *Full one-step inertia:* the DISC vertex becomes a strict local sink under all four norms ($r_{\rm DISC}=0.995$–$0.996$).
- *Selected multi-step inertia:* DISC remains a strict sink under SC, SH, SJ ($r_{\rm DISC}=0.99994$, $0.999998$, $0.9999996$). Under SS the DISC vertex is a saddle (rare ALLC invades) and the attractor is an ALLC–DISC mixture $(0.197,0,0.803)$ with intended cooperation 0.995.
- *ALLD is a strict local sink in every case* (12 of 12 panels): the dynamics are bistable.
- Homogeneous DISC (ED2a–d): one-step inertia creates a second, stable low-reputation root under SC (0.0009), SH (0.0008) and SJ (0.500), separated from the high root by unstable roots at 0.528, 0.903 and 0.879; SS has a single high root (0.996). Every selected multi-step setting has a single, high stable root.
- ED9: multistability is widespread. In the depth plane ($0\le k_1,k_2\le8$, full readout) SC is bistable in 60/81 cells (all $k_1,k_2\ge1$ except $(1,k_2\ge5)$), SH in 60/81, SJ in 30/81 (exactly the cells with $k_2\ge k_1\ge1$), SS in 3/81. Large recovery depth relative to tolerance depth leaves only a *low* root (e.g. SC and SH with $k_1=1$, $k_2\ge5$ resp. $\ge3$). The four selected pairs lie in monostable, high-reputation cells.

**Interpretation [I/A].** Inertia acts through the shape of $\mathcal R$. For SC with pure tolerance $(k_1,0)$ and full readout, $\mathcal R(u)=1-(1-u)^{k_1+1}$ is concave and $\varphi_{\rm DISC}$ is linear in $r$, so the homogeneous problem has exactly one root [A; supp. fold report §3.1]. Recovery depth with full readout makes $\mathcal R\sim(k_1+1)u^{k_2+1}$ near $u=0$ (convex), which permits a low-reputation trap [A/I]. Local stability of DISC arises when its homogeneous reputation is high enough that rare ALLD loses reputation and rare ALLC gains too little.

**Claim boundary.** Local stability is not global attraction: every panel retains the ALLD attractor. Filled *edge* markers indicate stability within the edge; full stability is recorded in the equilibria table. Streamlines are sampled fields with reputations re-relaxed at each composition, not coupled reputation–strategy trajectories, and no basins are drawn on them. ED2/ED9 concern homogeneous DISC (scalar problem), not whole-simplex basins.

**Transition.** Because defection remains an attractor in every condition, the evolutionary effect of inertia must be measured globally: from how many initial compositions does the population reach cooperation, and how much cooperation does it reach?

---

## R3. Inertia increases cooperation by enlarging the cooperative basin (Figure 4; ED6; basin decomposition)

**Scientific question.** How much long-run cooperation does each inertia architecture produce, does this depend on the total amount of inertia or on its allocation, and is the gain due to larger basins or to more cooperative end states?

**Analysis.** [N] For each architecture, 512 area-uniform initial compositions (shifted Halton, seed 2026) integrated to convergence with the verified engine (exact reputations wherever the reputation map is not smooth). Mean long-run cooperation $\bar\rho$, cooperative-basin size $\omega_C$, conditional level $\bar\rho_C$. Figure 4: all 180 allocations with $K=k_1+k_2\le8$; ED6: all 64 pairs $0\le k_1,k_2\le7$ per norm, with pure-DISC local protection. Exact two-factor (midpoint) decomposition $\Delta\bar\rho=$ basin term $+$ level term (`analysis/basin_decomposition/`).

**Demonstrated.**
- *Outcomes are dichotomous.* In every scan each trajectory either converges to the zero-cooperation set (final $\rho\le6.6\times10^{-4}$) or to an attractor with positive cooperation (final $\rho\ge0.35$; for 220 of 230 cooperative depth conditions 0.974–0.980). This justifies an attractor-based basin definition independent of any threshold (VR §4).
- *Reference comparisons* (none / one-step / selected multi-step):

| Norm | $\bar\rho$ | $\omega_C$ (s.e. ≤ 0.022) | $\bar\rho_C$ |
|---|---|---|---|
| SC | 0.610 / 0.591 / 0.865 | 0.635 / 0.605 / 0.883 | 0.961 / 0.976 / 0.980 |
| SH | 0.000 / 0.076 / 0.691 | 0 / 0.078 / 0.705 | — / 0.975 / 0.980 |
| SJ | 0.000 / 0.225 / 0.699 | 0 / 0.230 / 0.713 | — / 0.975 / 0.980 |
| SS | 0.543 / 0.696 / 0.741 | 0.561 / 0.713 / 0.760 | 0.970 / 0.976 / 0.975 |

- *The gain is a basin effect.* Relative to one-step or no inertia, at least 94% of the increase in $\bar\rho$ produced by the selected multi-step depths comes from the basin term (SC 99%/94%, SH 99.7%/100%, SJ 99.5%/100%, SS 102%/98%). $\bar\rho_C$ changes by at most 0.019 and is 0.975–0.980 for all norms under one-step and multi-step inertia — close to the error-limited maximum 0.98.
- *Allocation matters more than amount.* At fixed $K$ the spread across allocations is large (e.g. SC at $K=8$: from ≈0 at $(0,8)$ to 0.875 at $(8,0)$). The largest $\bar\rho$ at each $K$ is achieved by pure tolerance $(K,0)$ for SC and SH at every $K$; by mixed allocations for SJ from $K=3$ [$(2,1),(3,1),(3,2),(4,2),(4,3),(5,3)$]; and by recovery-weighted allocations with $k_1\in\{1,2\}$ for SS [$(1,1),(1,2),\dots,(1,5),(2,5),(2,6)$; $(0,1)$ at $K=1$].
- *More inertia is not monotonically better.* The SC envelope peaks at $K=5$ (0.888) and declines to 0.875 at $K=8$; SJ $(4,3)$ and $(5,3)$ are equal to four decimals (0.699). SH rises to 0.817 at $(8,0)$, SS to 0.815 at $(2,6)$. One-step inertia lowers cooperation under SC relative to no inertia (0.591 vs 0.610), through a smaller basin.
- *Recognition and cooperation coincide.* Each recognition-selected pair lies on the cooperation envelope at its budget (SC $K=2$, SH $K=3$, SJ $K=7$, SS $K=3$), although it was not chosen for cooperation.
- ED6: highest $\bar\rho$ in the square: SC $(5,0)$ 0.888, SH $(7,0)$ 0.813, SJ $(7,6)$ 0.743, SS $(2,7)$ 0.836. Local protection of pure DISC and high $\bar\rho$ do not coincide everywhere: SS $(1,2)$ has $\bar\rho=0.741$ but pure DISC is invaded by rare ALLC ($\lambda_{\rm ALLC}=+0.0016$).

**Interpretation [I].** Inertia changes *which* populations reach cooperation, not *how* cooperative the cooperative state is. Behaviourally: once discriminators dominate, cooperation is near-maximal with or without inertia; inertia decides whether a population starting with many defectors or unconditional cooperators gets there.

**Claim boundary.** $\omega_C$ and $\bar\rho$ refer to area-uniform sampling of the simplex; another prior over initial conditions would give other numbers. One 512-point sample: conservative s.e. of $\omega_C$ ≤ 0.022; near-ties (SS at $K=1$ and $K=6$; SJ $K=7$ vs 8; SC $K=4$–6) are not resolved. The envelope is the observed maximum on an integer grid with no cost of memory. Deterministic mean-field dynamics; no finite-population evolutionary simulations.

**Transition.** Why does the right allocation enlarge the basin so much under SH and SJ (≈9-fold and ≈3-fold relative to one-step) and only moderately under SC and SS? The answer lies in how reputations behave when defectors are common.

---

## R4. Reputation folds and branch shifts determine where cooperation can grow (ED8; ED9)

**Scientific question.** What feature of reputation formation sets the boundary of the cooperative basin, and how do the selected architectures change it?

**Analysis.** [N, exact reduction] On the ALLD–DISC edge the self-consistency problem reduces to one equation in $\bar r$; all roots are found on 8,001 grid values and refined by bisection; stability from the auxiliary flow; the all-good-selected branch and the normalized payoff advantage of DISC over ALLD, $(b/c)f_{\rm DISC}(r_{\rm DISC}-r_{\rm ALLD})-\bar r$, are followed along the edge (ED8). *(supp.)* Simplex-wide branch maps, trajectory classification and finite-population checks in `analysis/fold_branch_analysis/`.

**Demonstrated (ED8).**
- *No inertia:* a unique reputation equilibrium along the edge for all norms; under SH and SJ DISC reputation is low (≈0.02; 0.5) and DISC earns less than ALLD along the whole edge.
- *One-step SC, SH, SJ:* the high-reputation branch exists only close to the DISC vertex ($f_{\rm DISC}\ge0.896$, 0.972, 0.770); it ends in a fold where DISC reputation collapses and DISC's payoff advantage changes sign *discontinuously* (jumps in $r_{\rm DISC}$ of 0.86, 0.97, 0.47). There is no interior ALLD–DISC edge equilibrium.
- *Selected multi-step:* SJ $(4,3)$ has no fold; the branch is unique and DISC's advantage changes sign continuously at an edge equilibrium $f_{\rm DISC}=0.283$. SH $(3,0)$ has a hysteresis loop (folds at $f_{\rm DISC}=0.511$ and 0.923); the selected branch and the sign change move from 0.97 to 0.511. SC $(2,0)$ has a unique smooth branch [A: unique for every $(k_1,0)$] and an edge equilibrium at 0.080 (0.213 without inertia). SS has no fold in any condition; the edge equilibrium shifts from 0.357 (none) to 0.239 (one-step) and 0.207 (multi-step).
- *(supp.)* [N] Under one-step SH the cooperative basin coincides with the fold-bounded high-branch strip along the ALLC–DISC edge; under the multi-step settings the remaining defection basin lies near the ALLD–ALLC edge. [S] In finite private-record populations ($N=200$) the same bistability and hysteresis appear (e.g. SH $(3,0)$ at $f_{\rm DISC}=0.55$–0.80: $g_{\rm DISC}\approx0.90$–1.00 from all-good versus 0.11–0.13 from all-bad records), so folds are not an artefact of the closure.

**Interpretation [I].** Two mechanisms, depending on the norm. (i) *Fold removal or displacement* (SH, SJ): with one-step inertia discriminators keep a good reputation only when they are already the vast majority; a few more defectors make the high branch disappear, reputations collapse and discriminators lose to defectors. The selected architectures remove (SJ) or move (SH) this cliff far towards ALLD, so discriminators out-earn defectors from much lower frequencies. (ii) *Smooth displacement* (SC, SS): no relevant fold; inertia raises DISC reputation in defector-rich populations and moves the edge equilibrium (and hence the separatrix) towards ALLD. Folds are therefore one of two mechanisms, not a universal explanation.

**Claim boundary.** ED8 is exact only on the ALLD–DISC edge; interior basin boundaries are characterized in the supporting analysis, which used the earlier $\rho\ge0.5$ classification and a single sample (its qualitative conclusions agree with the verified tables). The fold location depends on the all-good branch-selection convention (justified as the dynamic meaning of "records start good"). Timescale separation is weakest exactly near folds.

**Transition.** The geometry points to a directional asymmetry: tolerance depth lifts the high branch, whereas recovery depth with full readout creates the low trap. We next isolate the two directions.

---

## R5. Tolerance is necessary; strictness helps only in combination (ED3; Fig. 4 allocation colours; ED6; ED9)

**Scientific question.** Which direction of inertia — tolerating negative evidence (warning path) or demanding more evidence for recovery (recovery path) — supports discriminators and cooperation?

**Analysis.** [N] One-step depths with tolerance-only $(\alpha,\beta)=(1,0)$ versus strictness-only $(0,1)$ readout (ED3 simplexes); $\bar\rho$ over the readout plane (41×41, 512 starts each) and local invasion of pure DISC (801×801) (ED3 planes); pure-strictness allocations $(0,K)$ in Fig. 4/ED6; ED6 protection pattern; ED9 depth plane.

**Demonstrated.**
- Tolerance-only readout makes the DISC vertex a strict sink under all four norms; strictness-only readout under none (SC and SS: edge mixtures attracting along the ALLC–DISC edge but with positive transverse eigenvalues 0.092 and 0.037; SH and SJ: homogeneous DISC reputation 0.0004 and 0.376).
- Mean cooperation over the readout plane is largest at tolerance-only readout for SC (0.738), SH (0.203) and SJ (0.483), and zero at strictness-only readout for these three norms; SS is cooperative across the plane (0.54–0.70). Under SC cooperation decreases continuously as $\alpha\to0$ and vanishes only in a thin strip $\alpha\le0.075$ at high $\beta$.
- Pure DISC resists both rare ALLD and ALLC only in a high-$\alpha$ band (6.5–9.1% of the plane); SH and SJ leave ALLD not excluded over most of the plane; under SS ALLD is always excluded but ALLC invades outside the high-$\alpha$ band.
- Pure-strictness allocations $(0,K)$ give $\bar\rho\le5\times10^{-6}$ for SC, SH, SJ at every $K\le8$, and decreasing cooperation for SS (0.554 at $(0,1)$ to 0.055 at $(0,8)$, where the attractor is an interior mixture whose cooperation falls from 0.87 to 0.38).
- Local protection of pure DISC (ED6) requires $k_1\ge1$, and $k_2\le1$ when $k_1=1$; this pattern (50 of 64 cells) is identical across the four norms.
- Strictness is useful in combination: SJ needs both depths (envelope uses $k_2\ge1$ from $K=3$; recognition selects $(4,3)$) and SS favours recovery-weighted allocations with $k_1\ge1$.

**Interpretation [I].** Tolerance gives discriminators the "benefit of the doubt" against negative assessments that errors and private disagreement inevitably produce (and that SC and SH prescribe for justified defection). Strictness acts as probation for those regarded as bad: valuable where defectors can earn positive assessments (SS, SJ), but on its own it keeps good players in bad standing and, with full readout, creates the low-reputation trap of R4. The norm determines how much strictness can be added on top of tolerance.

**Claim boundary.** The readout plane is computed at one-step depths only; multi-step depths were scanned only at full readout ($\alpha=\beta=1$). Do not claim that strictness is harmful in general; the evidence is that strictness *without* tolerance fails under SC, SH, SJ.

**Transition.** These results are at one parameter combination. Are they robust to the benefit-to-cost ratio, to error rates and to the assumed initial reputations?

---

## R6. Robustness to benefits, errors and initial reputations (ED4; ED5; ED2e)

**Scientific question.** Do the conclusions of R2–R5 depend on $b/c$, on $e_1,e_2$, or on all-good initial reputations?

**Analysis.** [N] ED4: $\bar\rho$ at 45 ratios $b/c\in[1.001,10]$, 8 scrambled-Sobol samples × 512 compositions, ±1 s.e.m.; pure-DISC protection interval $R_L<b/c<R_U$. ED5: invasion classes of pure DISC on a 241×241 $(e_1,e_2)$ grid at $b/c=5$. ED2e: population-level $\bar\rho$ with reputations initialized all-good or all-bad and then tracked quasi-statically.

**Demonstrated.**
- *Benefit-to-cost ratio (ED4).* Selected multi-step inertia gives the highest $\bar\rho$ at every ratio $b/c\ge1.1$ under all four norms. At $b/c=5$: SC 0.602/0.589/0.860, SH 0/0.078/0.689, SJ 0/0.222/0.692, SS 0.555/0.688/0.740 (none/one-step/multi-step; Sobol samples, hence slightly different from Fig. 4). Wherever the multi-step gain over one-step is ≥0.05, 98.8–103% of it is a basin effect. One-step inertia is below no inertia under SC for $b/c\gtrsim2.9$.
- Pure DISC is locally protected under one-step inertia only up to $R_U\approx5.6$–6.3; under multi-step SC, SH, SJ up to $R_U=230$, 4,410, 20,910; under multi-step SS only up to $R_U=4.0$ — yet SS multi-step has the highest $\bar\rho$, through its ALLC–DISC mixture.
- *Errors (ED5).* "DISC resists both" occupies 60% (SC), 67% (SH) and 31% (SJ) of the error grid under multi-step inertia versus 0.5–0.7% under one-step and only the error-free corner without inertia. SS is the exception: 0.3% multi-step versus 1.6% one-step.
- *Initial reputations (ED2e).* All-good and all-bad initialization give identical $\bar\rho$ except one-step SH (0.076 → 0.000), one-step SJ (0.225 → 0.000) and multi-step SJ (0.699 → 0.706; 4 of 512 starts near the ALLC vertex reach an inverted reputation state and then cooperation). One-step SC is insensitive at the population level despite bistability at the DISC vertex.

**Interpretation [I].** Selected multi-step inertia makes outcomes independent of the initial reputational state; one-step cooperation under SH and SJ exists only if reputations start good. The SS exception shows that pure-DISC protection is not the right summary of cooperative success when the attractor is a mixture.

**Claim boundary.** ED4 bands reflect initial-condition sampling only (not model or closure error). ED5 is a local test of pure DISC against rare ALLD/ALLC; grid counts are not areas under an error distribution, and $\bar\rho$ was not computed across errors. ED2e compares two extreme initial states only. Each robustness axis is varied one at a time.

**Transition.** All tests so far use unconditional mutants. A tolerant reputation system might instead be exploited by a discriminator who defects only occasionally.

---

## R7. Tolerance can be exploited by occasional defectors (Figure 5; ED7)

**Scientific question.** Can a resident discriminator population resist a rare opportunistic discriminator (O-DISC) that independently omits intended cooperation toward good recipients with probability $\delta$ — and how does this depend on readout?

**Analysis.** [N] Rare-mutant invasion payoff $\Lambda(\delta)=\delta r_R-(b/c)(r_R-r_X)$ (Model §9) on the highest strictly stable resident branch; full curves over $\delta\in(0,1]$ (Fig. 5a), readout scan for SJ $(4,3)$ (Fig. 5b), secure readout intervals across norms and $b/c\in[2,8]$ (ED7).

**Demonstrated.**
- Under SJ at $b/c=5$ all five mechanisms exclude ALLD ($\delta=1$), but four admit a positive invasion interval for small $\delta$: one-step $\delta_c=0.008$ (narrow but present), multi-step $(4,3)$ with $\alpha=1$ $\delta_c=0.365$, aggregation $(M,Q)=(2,1)$ 0.137, quantitative score 0.383. Multi-step $(4,3)$ with $\alpha=0.8$ has no positive interval ($\Lambda'(0)=-0.018$) while resident intended cooperation remains 0.987.
- For SJ $(4,3)$ the secure readout interval is $\alpha\in(0.567,0.804]$; below the fold the resident is on the low branch ($r_R\approx0.4$–0.5), above 0.804 the window opens and reaches $\delta_c=0.365$ at $\alpha=1$.
- ED7 at $b/c=5$: secure intervals for multi-step SC $[0,0.807]$, SH $(0.591,0.806]$, SJ $(0.567,0.804]$, SS $[0,1]$; one-step SC $(0.432,0.967]$, SH $(0.865,0.990]$, SJ $(0.852,0.989]$, SS $[0,0.965]$. At $(\alpha,b/c)=(0.8,5)$ every multi-step setting is IID-secure with $r_R=0.978$–0.990, whereas one-step SH and SJ are insecure with $r_R=0.0007$ and 0.47.

**Interpretation [I].** Full tolerance readout ($\alpha=1$) treats a target in a warning state as fully good, so a mutant that withholds cooperation occasionally keeps its good standing and saves costs. Reading warning states more cautiously ($\alpha\approx0.6$–0.8) makes omissions reputationally costly while keeping resident cooperation high. There is a trade-off: tolerance protects cooperators against errors, but complete tolerance invites opportunism.

**Claim boundary.** Only the IID O-DISC family (from DISC to ALLD) is tested; it does not include ALLC (SS multi-step is IID-secure but invaded by ALLC, ED6), time-correlated or persistent opportunism, or arbitrary mutants. Mechanism comparisons are not matched for memory. **Important open item:** the evolutionary results of R2–R6 use $\alpha=1$, which for multi-step SC, SH and SJ lies outside the IID-secure interval at $b/c=5$; basin sizes and $\bar\rho$ at the secure readout (e.g. $\alpha=0.8$) have not been computed (see A2).

---

# Part 2. Figure-by-figure explanation

## 2.1 Classification of display items

| Item (working) | Role in narrative | Status |
|---|---|---|
| Fig. 1 | Model schematic | Main |
| Fig. 2 | Recognition (R1) | Main |
| Fig. 3 | Evolutionary dynamics (R2) | Main |
| Fig. 4 | Basin/allocation result (R3) | Main — central figure |
| Fig. 5 | Opportunism trade-off (R7) | Main |
| **ED8** | Mechanism of basin enlargement (R4) | **Essential** — consider promoting to main text |
| **ED2** (a–d, e) | Homogeneous bistability (R2); initial-reputation robustness (R6) | **Essential** |
| **ED3** | Direction of inertia (R5) | **Essential** |
| **ED1** | Replication and threshold sensitivity of R1 | Essential support for the selected depths |
| ED9 | Multistability landscape (R2, R4) | Supporting mechanism |
| ED6 | Full depth landscape and local protection (R3, R5) | Robustness / supporting |
| ED4 | Benefit-to-cost robustness (R6) | Robustness |
| ED5 | Error robustness (R6) | Robustness |
| ED7 | Opportunism across norms (R7) | Robustness of R7 |

Suggestion for the main text (optional, not required by the data): Nature Human Behaviour allows a limited number of main display items. The mechanism (ED8) currently has no main-text figure. Two options: (a) add ED8 panels a–c/e–g (SC, SH, SJ) as a new main figure between Figs 4 and 5; (b) add a small basin-decomposition panel ($\omega_C$ and $\bar\rho_C$ for the three conditions) to Fig. 4, which would make the central "basin, not level" claim visible rather than textual.

## 2.2 Main figures

### Figure 1 — Inertial reputation updating
- **Designed to establish:** the model's one new ingredient and its two independent controls (depth: when a judgement reverses; readout: how intermediate evidence is treated).
- **Panels:** a, instantaneous updating (one assessment flips the image). b, inertial record: G → W$_1$…W$_{k_1}$ → B on negative evidence; B → S$_1$…S$_{k_2}$ → G on positive evidence; direct reset; readout probabilities.
- **Conclusion:** none; it defines tolerance ($k_1$, $\alpha$) and strictness ($k_2$, $\beta$).
- **Emphasize to Hilbe:** directionality (separate loss and recovery paths) and the direct-reset rule (consecutive assessments within one observer–target pair); privacy of records; that inertia acts only via $\mathcal R(u)$ in the mean field.
- **Note:** Fig. 1 is in `Main_Figure/` only (no source in `verified/`); labels say "suspicion states", Model.md says "suspicious states"/"recovery path" — unify.

### Figure 2 — Private reputation matrices and depth landscapes
- **Designed to establish:** inertia, allocated per norm, produces informative and shared private reputations; one-step inertia does not.
- **Panels a–d:** 30 DISC observers × 90 targets (DISC, ALLC, ALLD blocks) at the end of single runs. Row 1 (no inertia): noisy, with SH almost all bad and SJ random. Row 2 (one-step): SC separates ALLC/ALLD but not DISC; SH all bad; SJ random. Row 3 (selected): cooperative blocks blue, ALLD mostly white in all norms.
- **Panels e–h:** $\Delta g$ (colour) and $\bar d$ (circle area) over $k_1,k_2\in\{0..6\}$; stars mark the shortest qualifying pair.
- **Conclusion:** direction of allocation decides recognition — tolerance-dominated (SC, SH), bidirectional (SJ), recovery-dominated (SS); SJ with $k_2>k_1$ inverts recognition.
- **Emphasize:** fixed equal composition (no evolution yet); Δg is a contrast, not accuracy; landscapes are single runs (ED1 for replication); SH one-step as "agreement without information".

### Figure 3 — Evolutionary dynamics on the strategy simplex
- **Designed to establish:** inertia makes discriminators locally stable but leaves defection stable; the selected settings change the geometry of the field.
- **Rows:** no inertia, one-step, selected multi-step; columns SC, SH, SJ, SS.
- **Key panels:** SC none (neutral segment); SS none (stable ALLC–DISC mixture); one-step row (DISC sinks; SC interior saddle; abrupt field changes near DISC in SH/SJ = folds); multi-step row (DISC sinks except SS, where a mixture is stable; edge saddles at $f_{\rm DISC}$ = 0.079 SC, 0.282 SJ, 0.206 SS; none on the SH edge, where the boundary is a fold at 0.511).
- **Conclusion:** bistability everywhere; the multi-step settings move the boundary on the ALLD–DISC edge towards ALLD.
- **Emphasize:** markers' meaning (filled edge marker ≠ full sink in general; here all filled markers are strict sinks except the SC no-inertia segment endpoint); no hand-drawn basins; one-step SH/SJ boundaries are folds, not separatrices (ED8).
- **Note:** panels carry no letters; captions below propose a–l row-wise.

### Figure 4 — Total depth and allocation
- **Designed to establish:** (i) allocation matters more than amount; (ii) the selected settings are on the envelope; (iii) more depth is not monotonically better.
- **Panels a–d:** $\bar\rho$ for every allocation with $K\le8$, colour $k_1/K$ (blue tolerance, orange strictness); black line: best allocation at each $K$.
- **Conclusion:** SC/SH favour pure tolerance, SJ balanced, SS recovery-weighted with $k_1\ge1$; pure strictness gives zero cooperation under SC/SH/SJ; SC peaks at $K=5$.
- **Emphasize:** report $\omega_C$ alongside $\bar\rho$ in the text (≥94% basin effect); near-ties (SS $K=1,6$; SJ $K=7/8$); single 512-point sample; no memory cost.

### Figure 5 — Opportunistic invasion
- **Designed to establish:** excluding ALLD does not exclude partial defection; full tolerance readout opens an invasion window; calibrated readout closes it.
- **Panel a:** $\Lambda(\delta)$ for five SJ mechanisms; open circles at $\delta_c$.
- **Panel b:** $\delta_c$ (top) and $r_R$ (bottom) versus $\alpha$ for SJ $(4,3)$; secure band $(0.567,0.804]$; open circle at the fold.
- **Conclusion:** trade-off between error tolerance and exploitability; $\alpha\approx0.8$ secure with $r_R=0.987$.
- **Emphasize:** IID family only; one-step window narrow (0.008) but present; $r_R$ is *intended* cooperation; the main dynamical results use $\alpha=1$ (open item A2).

## 2.3 Extended Data figures

### ED1 — Replicated recognition and threshold sensitivity (essential support)
- **Establishes:** the selected pairs are robust minimum-depth choices with tight uncertainty; direction of allocation is threshold-robust, exact integers are not.
- **a–d:** $\Delta g$ vs $\bar d$ for 49 pairs (30 replicates each), colour $K$; shaded qualifying region; star = selection; inset full range with × at $(0,0)$. **e–h:** selection across 25 threshold combinations.
- **Emphasize:** 30 independent replicates; drift check passed for all 196 architectures; conservative interval-based rule selects the same pairs.

### ED2 — Homogeneous-DISC drift and initial reputations (essential)
- **a–d:** drift $\dot r_{\rm DISC}$ vs $r_{\rm DISC}$; phase lines above. One-step SC/SH/SJ bistable (low roots 0.0009, 0.0008, 0.5); multi-step single high root. **e:** $\bar\rho$ from all-good vs all-bad initial reputations.
- **Emphasize:** a–d is vertex-level bistability; e shows that population-level sensitivity occurs only for one-step SH and SJ (and +0.008 for SJ multi-step), not SC one-step.

### ED3 — Directional readout (essential)
- **Simplex rows:** tolerance-only gives DISC sinks under all norms; strictness-only under none. **Cooperation row:** $\bar\rho$ highest at tolerance-only corner for SC/SH/SJ, zero at strictness-only. **Invasion row:** protection only at high $\alpha$.
- **Emphasize:** one-step depths only; cooperation and local protection answer different questions (tolerance-only SC: highest $\bar\rho$ but pure DISC invaded by ALLC).
- **Note:** plane panels are lettered e–l although eight simplexes precede them (A3).

### ED4 — Benefit-to-cost ratio (robustness)
- **Establishes:** ordering multi-step > one-step, none holds for all $b/c\ge1.1$; protection intervals.
- **Emphasize:** realized cooperation (changed from intended); SS multi-step unprotected above $b/c=4$ yet most cooperative; one-step SH ≈0.08, not zero.

### ED5 — Error rates (robustness)
- **Establishes:** multi-step greatly broadens the region where pure DISC resists both rare ALLD and ALLC for SC, SH, SJ; SS is a counterexample.
- **Emphasize:** local test only; $e_2=0$ boundary row corrected to "ALLD not excluded" (ALLD exactly neutral on the all-bad resident).

### ED6 — Depth plane (supporting)
- **Establishes:** full $(k_1,k_2)$ landscape of $\bar\rho$; protection requires tolerance depth; protection ≠ cooperation (SS).
- **Emphasize:** maxima outside Fig. 4's domain (SJ $(7,6)$, SS $(2,7)$; $K>8$).

### ED7 — Opportunism across norms (robustness of R7)
- **a:** secure $\alpha$ intervals at $b/c=5$ (open circles = excluded fold ends). **b–e:** $(\alpha,b/c)$ maps, colour $r_R$, outlines secure region; circle at $(0.8,5)$.
- **Emphasize:** at $(0.8,5)$ all multi-step settings secure and highly cooperative; one-step SH/SJ insecure and uncooperative; security ≠ cooperation (SS multi, $r_R=0.62$ at $\alpha=0$).

### ED8 — Reputation geometry along the ALLD–DISC edge (essential mechanism)
- **a–d:** all equilibria $r_{\rm DISC}(f_{\rm DISC})$, stable solid, unstable dashed, folds ◇. **e–h:** DISC payoff advantage on the all-good branch; ● edge equilibria; △ sign change at a fold.
- **Emphasize:** fold removal (SJ) and displacement (SH) vs smooth shifts (SC, SS); the one-step SC fold lies near the vertex and does not bound the basin.

### ED9 — Multistability landscapes (supporting mechanism)
- **a–d:** one-step depths, $(\alpha,\beta)$ plane; **e–h:** full readout, $(k_1,k_2)$ plane; colour highest stable homogeneous reputation, hatching = bistable.
- **Emphasize:** colour is the *highest* root — hatched dark cells are not guaranteed to reach it; SJ bistable exactly where $k_2\ge k_1\ge1$; selected pairs monostable.


---

# Part 3. Figure captions (LaTeX)

Conventions used in all captions: norms SC (Scoring), SH (Shunning), SJ (Stern Judging), SS (Simple Standing); $e_1$ implementation error, $e_2$ assessment error; reference values $b/c=5$, $e_1=e_2=0.02$. Each caption is self-contained so that it can be inserted directly. Labels use proposed final numbers (`fig:...`, `edfig:...`); the working number is given in the heading. Where a figure currently lacks panel letters (Fig. 3, ED3 simplexes) the caption assumes the lettering stated in the note above it.

### Figure 1 (working Fig. 1; proposed Fig. 1)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{Fig1}
\caption{\textbf{Instantaneous and inertial updating of private reputations.}
\textbf{a}, Instantaneous updating. An observer's binary image of a target (G, good; B, bad) is replaced after every recorded assessment: a single negative assessment changes G to B, and a single positive assessment changes B to G.
\textbf{b}, Inertial updating with a direct-reset internal record. Between the established states G and B, the record contains $k_1$ warning states $\mathrm{W}_1,\dots,\mathrm{W}_{k_1}$ on the path to losing good standing and $k_2$ suspicion (recovery) states $\mathrm{S}_1,\dots,\mathrm{S}_{k_2}$ on the path to regaining it. Negative assessments (red arrows) advance the record towards B and positive assessments (blue arrows) towards G; an assessment that supports the established judgement resets the record directly to that state. Losing good standing therefore requires $k_1+1$ consecutive negative assessments, and regaining it requires $k_2+1$ consecutive positive assessments, counted within one observer's record of one target. When consulted, warning state $\mathrm{W}_m$ is read as good with probability $\alpha^m$ (tolerance strength $\alpha$) and suspicion state $\mathrm{S}_n$ is read as bad with probability $\beta^n$ (strictness strength $\beta$); G is always read as good and B as bad. The depths $(k_1,k_2)$ determine when a reversal is completed, and the readout parameters $(\alpha,\beta)$ determine how intermediate evidence affects current treatment. Instantaneous updating is recovered for $k_1=k_2=0$ or for $\alpha=\beta=0$. Each observer keeps its own records and assesses a donor's realized action by applying the shared social norm to its own image of the recipient.}
\label{fig:model}
\end{figure}
```

### Figure 2 (working Fig. 2; proposed Fig. 2)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{Fig2}
\caption{\textbf{Directional inertia makes private reputations informative and shared.}
Finite populations with equal numbers of unconditional cooperators (ALLC), unconditional defectors (ALLD) and discriminators (DISC); strategies are fixed, all internal records start in state G, $e_1=e_2=0.02$, and in each interaction one observer is drawn uniformly from the DISC players.
\textbf{a}--\textbf{d}, Private reputation matrices under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}) at the end of single runs (30 players per strategy, $N=90$; 1{,}000 sweeps; seed 2027). Rows are the 30 DISC observers and columns the targets, grouped as DISC, ALLC and ALLD; blue denotes a good and white a bad binary image. Top row, without inertia (one-step record with $\alpha=\beta=0$, equivalent to instantaneous updating); middle row, full one-step inertia, $(k_1,k_2)=(1,1)$ with $\alpha=\beta=1$; bottom row, selected multi-step inertia with $\alpha=\beta=1$ and the depths shown above each block.
\textbf{e}--\textbf{h}, Reputation separation and observer disagreement over tolerance depth $k_1$ and strictness depth $k_2$ ($0\le k_1,k_2\le6$; full readout; 50 players per strategy, $N=150$; one run per condition; 1{,}000 sweeps, burn-in 800, sampling every 5 sweeps). Colour shows the separation $\Delta g=\tfrac12(g_{\mathrm{DISC}}+g_{\mathrm{ALLC}})-g_{\mathrm{ALLD}}$, where $g_I$ is the mean probability that a DISC observer reads a type-$I$ target as good. Circle area scales with the square of the mean disagreement $\bar d$, the probability that two distinct DISC observers read the same target differently, averaged over the three strategies. Black and red outlines mark no inertia, $(0,0)$, and one-step inertia, $(1,1)$; stars mark the pair with the smallest total depth $K=k_1+k_2$ that satisfies $\Delta g\ge0.8$ and $\bar d\le0.1$ (the same pairs are selected from 30 independent replicates; Extended Data Fig.~\ref{edfig:recognition}).}
\label{fig:recognition}
\end{figure}
```

### Figure 3 (working Fig. 3; proposed Fig. 3)
*Assumes panel letters a–d (top row, SC–SS), e–h (middle row), i–l (bottom row) are added.*

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{Fig3}
\caption{\textbf{Inertia stabilizes discriminators, but defection remains an attractor.}
Replicator dynamics of ALLC, ALLD and DISC on the strategy simplex (vertices labelled by the corresponding pure population) under SC, SH, SJ and SS (columns). At every strategy composition, stationary reputations are obtained by relaxation from the all-good state and determine payoffs; streamlines show the resulting field.
\textbf{a}--\textbf{d}, Without inertia ($\mathcal{R}(u)=u$). \textbf{e}--\textbf{h}, Full one-step inertia, $(k_1,k_2)=(1,1)$, $\alpha=\beta=1$. \textbf{i}--\textbf{l}, Selected multi-step inertia, $\alpha=\beta=1$, with $(k_1,k_2)=(2,0)$ for SC, $(3,0)$ for SH, $(4,3)$ for SJ and $(1,2)$ for SS.
Filled circles, stable equilibria (all are strict local sinks except the end point of the neutral segment in \textbf{a}); open circles, unstable equilibria. The dashed line in \textbf{a} is a continuum of neutrally stable equilibria at $f_{\mathrm{DISC}}=c/[b(A_{\mathrm{CG}}-A_{\mathrm{DG}})]\approx0.213$, where $A_{\mathrm{CG}}$ and $A_{\mathrm{DG}}$ are the probabilities of a positive assessment for intended cooperation and defection towards a recipient regarded as good. ALLD is a strict local sink in every panel. Abrupt changes of the field near the DISC vertex in \textbf{f} and \textbf{g} arise where the high-reputation branch ends at a fold (Extended Data Fig.~\ref{edfig:geometry}). $b/c=5$, $e_1=e_2=0.02$.}
\label{fig:simplex}
\end{figure}
```

### Figure 4 (working Fig. 4; proposed Fig. 4)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{Fig4}
\caption{\textbf{How inertia is allocated matters more than how much inertia there is.}
Mean long-run cooperation $\bar\rho$ for every allocation of a total depth $K=k_1+k_2\le8$ between tolerance depth $k_1$ and strictness depth $k_2$ under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}) (full readout, $\alpha=\beta=1$; 45 allocations per norm). $\bar\rho$ is the realized cooperation $\rho=(1-e_1)(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\bar r)$ at the end of the replicator dynamics, averaged over 512 initial strategy compositions sampled uniformly by area from the simplex (shifted Halton sequence); reputations are relaxed from the all-good state at every composition. Point colour gives the allocation fraction $k_1/K$ (orange, all strictness; blue, all tolerance; the value 0.5 is used at $K=0$); small horizontal offsets separate overlapping points. The black line connects the allocation with the largest $\bar\rho$ at each $K$, labelled $(k_1,k_2)$. Every trajectory converges either to a state without cooperation or to an attractor with positive cooperation, so $\bar\rho\approx\omega_C\bar\rho_C$, where $\omega_C$ is the fraction of initial compositions in the cooperative basin and $\bar\rho_C$ the cooperation level reached within it. The maximum possible value is $1-e_1=0.98$. $b/c=5$, $e_1=e_2=0.02$.}
\label{fig:depth}
\end{figure}
```

### Figure 5 (working Fig. 5; proposed Fig. 5)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{Fig5}
\caption{\textbf{Full tolerance can be exploited by occasional defectors.}
A rare opportunistic discriminator (O-DISC) in a resident DISC population omits intended cooperation towards a recipient it regards as good independently with probability $\delta$ in each interaction ($\delta=0$, DISC; $\delta=1$, ALLD). The normalized invasion payoff is $\Lambda(\delta)=(\Pi_{\mathrm X}-\Pi_{\mathrm R})/[c(1-e_1)]=\delta r_{\mathrm R}-(b/c)(r_{\mathrm R}-r_{\mathrm X})$, where $r_{\mathrm R}$ and $r_{\mathrm X}$ are the stationary probabilities that a resident and the mutant are regarded as good; $\Lambda>0$ means that the mutant can invade. SJ, $b/c=5$, $e_1=e_2=0.02$, $\beta=1$.
\textbf{a}, $\Lambda(\delta)$ for full one-step inertia ($(k_1,k_2)=(1,1)$, $\alpha=1$), multi-step inertia ($(4,3)$) with $\alpha=1$ and $\alpha=0.8$, an aggregation rule (good if at least one of the last two assessments is positive) and a quantitative score (integer score in $[-5,5]$ changed by $\pm1$ per assessment, read as good if non-negative). Open circles mark the upper ends $\delta_c$ of the positive-invasion intervals ($0.008$, $0.365$, $0.137$ and $0.383$ for one-step, multi-step with $\alpha=1$, aggregation and quantitative, respectively); multi-step inertia with $\alpha=0.8$ has no positive interval. Curves are clipped below $\Lambda=-0.15$.
\textbf{b}, Dependence on the tolerance readout $\alpha$ for $(k_1,k_2)=(4,3)$. Top, $\delta_c$ (zero when no positive interval exists); bottom, resident intended cooperation $r_{\mathrm R}$ (realized cooperation is $(1-e_1)r_{\mathrm R}$). The resident is no longer invadable by any O-DISC mutant for $0.567<\alpha\le0.804$ (green). The lower boundary is a fold of the high-reputation branch (open circle; below it the resident occupies the low branch), and the upper boundary is a neutral-invasion boundary. Resident reputations are taken from the highest strictly stable self-consistent root.}
\label{fig:opportunism}
\end{figure}
```

### Extended Data Figure 1 (working ED1; proposed ED Fig. 1)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig1}
\caption{\textbf{Replicated recognition analysis and sensitivity of the selected depths to the recognition criteria.}
Finite populations of 50 players per strategy ($N=150$), all records initially G, full readout ($\alpha=\beta=1$), $e_1=e_2=0.02$; 30 independent runs for each of the 49 depth pairs $0\le k_1,k_2\le6$ under each norm (5{,}880 runs). Most runs use 1{,}000 sweeps with burn-in 800 and sampling every 5 sweeps; two slowly relaxing SJ conditions use longer windows.
\textbf{a}--\textbf{d}, Mean separation $\Delta g$ against mean disagreement $\bar d$ (definitions as in Fig.~\ref{fig:recognition}) under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}); colour gives the total depth $K=k_1+k_2$. The shaded region satisfies $\Delta g\ge0.8$ and $\bar d\le0.1$. Stars mark the selected pair, chosen by minimum $K$ among qualifying pairs, then by larger $\Delta g$, smaller $\bar d$, and smaller $k_1$ and $k_2$: SC $(2,0)$, $\Delta g=0.919$, $\bar d=0.064$; SH $(3,0)$, $0.906$, $0.069$; SJ $(4,3)$, $0.881$, $0.081$; SS $(1,2)$, $0.917$, $0.056$ (pointwise 95\% bootstrap intervals, 2{,}000 resamples of replicate means, are narrower than $\pm0.001$). Insets show all 49 pairs; crosses mark no inertia, $(0,0)$.
\textbf{e}--\textbf{h}, Pair selected under alternative thresholds for the maximum disagreement (horizontal) and minimum separation (vertical); cell colour gives its $K$. Gold outlines mark the default thresholds, and dark outlines enclose threshold combinations that select the same pair as the default. A more conservative rule that applies the thresholds to the bootstrap interval limits selects the same four pairs at the default thresholds. All 196 architectures pass a drift criterion requiring the change in $\Delta g$ and $\bar d$ between the two halves of the sampling window to lie within $\pm0.01$.}
\label{edfig:recognition}
\end{figure}
```

### Extended Data Figure 2 (working ED2; proposed ED Fig. 2)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig2}
\caption{\textbf{Reputational bistability of a discriminator population and robustness to initial reputations.}
\textbf{a}--\textbf{d}, Homogeneous DISC population under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}). Curves show the reputation drift $\dot r_{\mathrm{DISC}}=\mathcal{R}(\varphi_{\mathrm{DISC}}(r_{\mathrm{DISC}}))-r_{\mathrm{DISC}}$, where $\varphi_{\mathrm{DISC}}$ is the probability of a positive assessment and $\mathcal{R}$ the stationary reputation response of the record, without inertia (grey), with full one-step inertia (blue) and with selected multi-step inertia (orange; depths indicated, $\alpha=\beta=1$). Phase lines above each panel show the direction of the drift; filled and open circles denote stable and unstable self-consistent reputations. With one-step inertia SC, SH and SJ have two stable reputations (low roots $0.0009$, $0.0008$ and $0.5$; high roots $0.995$--$0.996$); every multi-step case has a single high stable reputation.
\textbf{e}, Mean long-run cooperation $\bar\rho$ when reputations start all good (solid bars) or all bad (hatched bars) and then follow the strategy dynamics quasi-statically; 512 initial strategy compositions sampled uniformly by area (shifted Halton sequence). Values differ only for one-step SH ($0.076$ versus $0$), one-step SJ ($0.225$ versus $0$) and multi-step SJ ($0.699$ versus $0.706$; four initial compositions near the ALLC vertex reach an inverted reputation state from all-bad records). $b/c=5$, $e_1=e_2=0.02$.}
\label{edfig:homogeneous}
\end{figure}
```

### Extended Data Figure 9 (working ED9; proposed ED Fig. 3)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig3}
\caption{\textbf{Reputation of a discriminator population across readout parameters and inertia depths.}
Colour shows the highest stable self-consistent good reputation $r^*$ of a homogeneous DISC population; hatching marks parameter combinations with two stable reputations (bistability). Because colour shows the highest root, a hatched cell does not imply that this root is reached from every initial reputation.
\textbf{a}--\textbf{d}, One-step depths $(k_1,k_2)=(1,1)$ over tolerance strength $\alpha$ and strictness strength $\beta$ ($161\times161$ grid) under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}).
\textbf{e}--\textbf{h}, Full readout ($\alpha=\beta=1$) over depths $0\le k_1,k_2\le8$. Squares mark no inertia (black) and full one-step inertia (blue); stars mark the selected multi-step depths. Bistability occurs in 60 (SC), 60 (SH), 30 (SJ) and 3 (SS) of 81 depth pairs; under SJ it occurs exactly where $k_2\ge k_1\ge1$. Large strictness depth relative to tolerance depth leaves only a low reputation (white cells). The selected depths lie in monostable, high-reputation cells. $e_1=e_2=0.02$.}
\label{edfig:planes}
\end{figure}
```

### Extended Data Figure 6 (working ED6; proposed ED Fig. 4)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig4}
\caption{\textbf{Mean cooperation and local protection of discriminators across inertia depths.}
Mean long-run cooperation $\bar\rho$ (colour; computed as in Fig.~\ref{fig:depth}) for all depth pairs $0\le k_1,k_2\le7$ with full readout ($\alpha=\beta=1$) under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}); 512 initial strategy compositions per pair. Dots mark pairs at which a pure DISC population is locally protected, that is, rare ALLD and rare ALLC both have negative invasion payoffs ($\lambda_{\mathrm{ALLD}}<-10^{-10}$ and $\lambda_{\mathrm{ALLC}}\le10^{-10}$, with resident reputations refined to a residual below $10^{-13}$). Protection requires $k_1\ge1$, and $k_2\le1$ when $k_1=1$, under all four norms (50 of 64 pairs each). Highest values: SC $(5,0)$, $\bar\rho=0.888$; SH $(7,0)$, $0.813$; SJ $(7,6)$, $0.743$; SS $(2,7)$, $0.836$. Protection and cooperation need not coincide; for example, SS $(1,2)$ has $\bar\rho=0.741$ although pure DISC is invaded by ALLC, because the attractor is a stable ALLC--DISC mixture. $b/c=5$, $e_1=e_2=0.02$.}
\label{edfig:depthplane}
\end{figure}
```

### Extended Data Figure 8 (working ED8; proposed ED Fig. 5)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig5}
\caption{\textbf{Reputation geometry along the edge between defectors and discriminators.}
Self-consistent reputations on the ALLD--DISC edge ($f_{\mathrm{ALLC}}=0$, $0.01\le f_{\mathrm{DISC}}\le1$) without inertia (grey), with full one-step inertia (blue) and with selected multi-step inertia (orange; depths indicated, $\alpha=\beta=1$). On this edge the self-consistency problem reduces exactly to one equation in the mean reputation; all roots are located on a grid of 8{,}001 values and refined by bisection, and stability is that of the auxiliary reputation flow.
\textbf{a}--\textbf{d}, DISC reputation $r_{\mathrm{DISC}}$ against DISC frequency under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}); solid lines, stable; dashed lines, unstable; diamonds, folds (saddle-node points).
\textbf{e}--\textbf{h}, Normalized payoff advantage of DISC over ALLD, $(\Pi_{\mathrm{DISC}}-\Pi_{\mathrm{ALLD}})/[c(1-e_1)]=(b/c)f_{\mathrm{DISC}}(r_{\mathrm{DISC}}-r_{\mathrm{ALLD}})-\bar r$, on the branch reached from all-good reputations. Filled circles, edge equilibria (continuous sign changes); triangles, discontinuous sign changes where the high-reputation branch ends at a fold. With one-step inertia the high branch of SC, SH and SJ exists only for $f_{\mathrm{DISC}}\ge0.896$, $0.972$ and $0.770$, respectively. Selected multi-step inertia removes the fold under SJ (edge equilibrium at $f_{\mathrm{DISC}}=0.283$), moves it to $f_{\mathrm{DISC}}=0.511$ under SH (hysteresis between folds at $0.511$ and $0.923$), and yields a unique smooth branch under SC (edge equilibrium at $0.080$, compared with $0.213$ without inertia). SS has no fold; its edge equilibrium moves from $0.357$ (no inertia) to $0.239$ (one-step) and $0.207$ (multi-step). $b/c=5$, $e_1=e_2=0.02$.}
\label{edfig:geometry}
\end{figure}
```

### Extended Data Figure 3 (working ED3; proposed ED Fig. 6)
*Assumes panel letters a–d (tolerance-only simplexes), e–h (strictness-only simplexes), i–l (cooperation planes), m–p (invasion planes). The current plane file is lettered e–l (see A3).*

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig6}
\caption{\textbf{Tolerance, not strictness, stabilizes discriminators.}
All panels use one-step depths, $(k_1,k_2)=(1,1)$, and show SC, SH, SJ and SS in columns.
\textbf{a}--\textbf{h}, Replicator dynamics as in Fig.~\ref{fig:simplex} for tolerance-only readout, $(\alpha,\beta)=(1,0)$ (\textbf{a}--\textbf{d}), and strictness-only readout, $(\alpha,\beta)=(0,1)$ (\textbf{e}--\textbf{h}). Filled circles, equilibria that are stable along the boundary on which they lie; open circles, unstable equilibria. Pure DISC is a strict local sink under all four norms with tolerance-only readout and under none with strictness-only readout; the filled ALLC--DISC edge equilibria in \textbf{e} and \textbf{h} are unstable to invasion by ALLD (transverse eigenvalues $0.092$ and $0.037$).
\textbf{i}--\textbf{l}, Mean long-run cooperation $\bar\rho$ (computed as in Fig.~\ref{fig:depth}) over the readout plane ($41\times41$ grid; 512 initial compositions per point; non-linear colour scale). \textbf{m}--\textbf{p}, Local invasion of a pure DISC population by rare ALLD and ALLC ($801\times801$ grid). Pink, ALLD not excluded ($\lambda_{\mathrm{ALLD}}\ge-10^{-10}$, including neutrality); purple, ALLD excluded but ALLC invades ($\lambda_{\mathrm{ALLC}}>10^{-10}$); green, pure DISC resists both. Dashed and solid white curves mark zero invasion payoff for ALLD and ALLC, respectively. Resident reputations are relaxed from the all-good state and refined to a residual below $10^{-13}$. $b/c=5$, $e_1=e_2=0.02$.}
\label{edfig:readout}
\end{figure}
```

### Extended Data Figure 4 (working ED4; proposed ED Fig. 7)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig7}
\caption{\textbf{Dependence on the benefit-to-cost ratio.}
Mean long-run cooperation $\bar\rho$ (realized cooperation averaged over initial strategy compositions) against $b/c$ under SC (\textbf{a}), SH (\textbf{b}), SJ (\textbf{c}) and SS (\textbf{d}) without inertia (grey), with full one-step inertia (blue) and with selected multi-step inertia (orange; $\alpha=\beta=1$). Each of the 45 values of $b/c$ between $1.001$ and $10$ uses eight independent scrambled Sobol samples of 512 area-uniform initial compositions; lines interpolate the means (monotone cubic interpolation) and shading shows $\pm1$ s.e.m. across the eight sample means. Solid segments mark ratios at which a pure DISC population is locally protected against rare ALLD and ALLC, $R_L<b/c<R_U$, and dashed segments ratios at which it is not; labels give the thresholds within the plotted range, and arrows indicate $R_U>10$. Without inertia the protection interval is empty. The vertical dotted line marks the reference value $b/c=5$. $e_1=e_2=0.02$.}
\label{edfig:benefit}
\end{figure}
```

### Extended Data Figure 5 (working ED5; proposed ED Fig. 8)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig8}
\caption{\textbf{Local protection of discriminators across implementation and assessment errors.}
Invasion of a pure DISC population by rare ALLD and rare ALLC over implementation error $e_1$ and assessment error $e_2$ ($241\times241$ grid on $[0,0.45]^2$) under SC, SH, SJ and SS (columns) without inertia (\textbf{a}--\textbf{d}), with full one-step inertia (\textbf{e}--\textbf{h}) and with selected multi-step inertia (\textbf{i}--\textbf{l}; $\alpha=\beta=1$). Pink, ALLD not excluded ($\lambda_{\mathrm{ALLD}}\ge-10^{-10}$, including neutrality); purple, ALLD excluded but ALLC invades ($\lambda_{\mathrm{ALLC}}>10^{-10}$); green, pure DISC resists both. White curves mark zero invasion payoffs (dashed, ALLD; solid, ALLC). Resident reputations are relaxed from the all-good state and refined to a residual below $10^{-13}$. Along $e_2=0$ under SC and SH the resident reached from all-good reputations is the all-bad state, at which ALLD is exactly neutral. Green occupies 60\% (SC), 67\% (SH), 31\% (SJ) and 0.3\% (SS) of the grid with multi-step inertia, $0.5$--$1.6\%$ with one-step inertia, and only the error-free corner without inertia. $b/c=5$.}
\label{edfig:errors}
\end{figure}
```

### Extended Data Figure 7 (working ED7; proposed ED Fig. 9)

```latex
\begin{figure}
\centering
\includegraphics[width=\linewidth]{ED_Fig9}
\caption{\textbf{Security against occasional defectors across norms, readouts and benefit-to-cost ratios.}
Security of a resident DISC population against the rare opportunistic mutant of Fig.~\ref{fig:opportunism} for all $\delta\in(0,1]$, with full one-step inertia, $(k_1,k_2)=(1,1)$, and selected multi-step inertia (SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$); $\beta=1$, $e_1=e_2=0.02$.
\textbf{a}, Tolerance readout $\alpha$ at $b/c=5$. Colour shows resident intended cooperation $r_{\mathrm R}$; black outlines enclose the readout values at which the resident is secure. Open circles mark interval ends at folds of the high-reputation branch, which are excluded. Secure intervals: one-step SC $(0.432,0.967]$, SH $(0.865,0.990]$, SJ $(0.852,0.989]$, SS $[0,0.965]$; multi-step SC $[0,0.807]$, SH $(0.591,0.806]$, SJ $(0.567,0.804]$, SS $[0,1]$.
\textbf{b}--\textbf{e}, Security over $\alpha$ and $b/c\in[2,8]$ under SC (\textbf{b}), SH (\textbf{c}), SJ (\textbf{d}) and SS (\textbf{e}) for one-step (top) and multi-step (bottom) inertia. Colour, $r_{\mathrm R}$ (independent of $b/c$); black curves, boundaries of the secure region; circles, reference point $(\alpha,b/c)=(0.8,5)$, at which all multi-step settings are secure with $r_{\mathrm R}=0.978$--$0.990$, whereas one-step SH and SJ are not secure ($r_{\mathrm R}=0.0007$ and $0.47$). Security is evaluated for independent omissions only and does not imply resistance to ALLC or to other mutant strategies.}
\label{edfig:opportunism}
\end{figure}
```

---

# Part 4. Overall Results message

## 4.1 Main scientific message

Reputation inertia is a cognitively simple rule — do not reverse a judgement on a single piece of evidence — whose consequences depend on **direction**. Tolerating negative evidence protects discriminators from the unwarranted condemnation that errors, private disagreement and the norm itself generate; demanding more evidence before readmission limits the return of defectors but, without tolerance, traps good players in bad standing. When the allocation fits the norm, private reputations become informative and shared, and the population reaches cooperation from far more starting points. The effect of inertia is on the **basin of attraction of cooperation**, not on the level of cooperation once reached, and it operates by **reshaping the self-consistent reputation landscape** (folds and branch shifts). Full tolerance has a price: it can be exploited by opportunists who defect only occasionally, a vulnerability removed by reading warning states more cautiously.

## 4.2 Strongest conclusions currently supported

1. **Norm-specific allocations of inertia give high separation with low disagreement; one-step inertia does not** [S; 30 replicates; Fig. 2, ED1].
2. **Inertia makes pure DISC locally stable but never removes ALLD as an attractor** [N; Fig. 3, ED2a–d].
3. **Selected multi-step inertia increases mean long-run cooperation under all four norms, and ≥94% of the increase is due to a larger cooperative basin; the cooperation level within the basin stays at 0.975–0.980** [N; Fig. 4, VR §7]. The ordering holds for every $b/c\ge1.1$ [N; ED4].
4. **Allocation matters more than total depth; pure strictness yields no cooperation under SC, SH, SJ; local protection of pure DISC requires tolerance depth under every norm** [N; Fig. 4, ED6, ED3].
5. **Under SH and SJ the cooperative basin is bounded by a reputation fold that the selected depths remove (SJ) or displace (SH); under SC and SS the gain is a smooth shift** [N; ED8, with supporting analysis].
6. **Outcomes under the selected depths are insensitive to initial reputations; one-step cooperation under SH and SJ requires good initial reputations** [N; ED2e].
7. **Exclusion of ALLD does not imply security against occasional defection; full tolerance readout opens an invasion window, partial readout closes it at little cost in resident cooperation** [N; Fig. 5, ED7].

## 4.3 Primarily mechanistic results

- ED8 (fold vs smooth geometry), ED9 and ED2a–d (multistability created by recovery depth, removed by tolerance), the analytic uniqueness for SC with $(k_1,0)$, and the supporting branch/basin analysis.
- The norm-by-norm explanations of *why* each allocation works (R1, R5) are interpretations [I] consistent with the assessment rules; no analysis isolates each causal pathway.

## 4.4 Results that demonstrate robustness

- ED1 (replication, threshold sensitivity), ED4 ($b/c$), ED5 (errors; local test), ED2e (initial reputations), ED6 (full depth landscape), ED7 (opportunism across norms and $b/c$); engine validation (refined settings change $\bar\rho$ by ≤1.3×10⁻⁵; independent implementation reproduces trajectory outcomes); outcome-gap check in every condition.

## 4.5 Claims to avoid or state cautiously

| Avoid | Say instead / caveat |
|---|---|
| "Inertia increases cooperation" (unqualified) | Correctly allocated inertia increases cooperation; one-step inertia lowers it under SC (0.591 vs 0.610) and pure strictness abolishes it under SC/SH/SJ. |
| "More memory is better" | SC peaks at $K=5$ then declines; SS $(0,K)$ declines with $K$. |
| "Inertia raises the cooperation level" | Inertia enlarges the cooperative basin; $\bar\rho_C$ is error-limited. |
| "Optimal depths" | Recognition-selected representative depths; lie on the observed envelope at their budget within a finite grid. |
| "ESS", "evolutionarily stable" | Locally protected against rare ALLD and ALLC; IID-secure against O-DISC. |
| "Cooperation is globally stable" | ALLD remains an attractor in every condition. |
| "One-step SH cooperation is near zero" | Low (≈0.08). |
| "Basin size" without qualification | Fraction of area-uniformly sampled initial compositions; one 512-point sample (s.e. ≤0.022). |
| "Significantly higher" | No statistical tests; report values and sampling uncertainty. |
| "Folds explain the basin" (all norms) | Folds under SH and SJ; smooth shifts under SC and SS. |
| "Robust to errors" (cooperation) | ED5 tests local protection only; $\bar\rho$ not computed across errors; SS multi-step is less protected than one-step. |
| "Secure against cheaters" | Secure against the IID O-DISC family; not ALLC, not temporally correlated opportunism. |
| Generalization to human populations | Theoretical, well-mixed, three-strategy, fixed-norm model with a mean-field closure; no empirical test; no finite-population evolutionary simulations. |
| Implying the main results hold at the secure readout | Figs 3–4, ED4–ED6 use $\alpha=1$; not recomputed at $\alpha\approx0.8$ (A2). |

---

# Appendices

## A1. Proposed Extended Data numbering (first citation in this narrative)

| Proposed | Content | Working number | First cited |
|---|---|---|---|
| ED1 | Replicated recognition and threshold sensitivity | ED1 | R1 |
| ED2 | Homogeneous-DISC drift; initial reputations (e) | ED2 | R2 (panel e in R6) |
| ED3 | Readout and depth planes of homogeneous reputation | ED9 | R2 |
| ED4 | Depth plane: cooperation and local protection | ED6 | R3 |
| ED5 | Reputation geometry along the ALLD–DISC edge | ED8 | R4 |
| ED6 | Tolerance-only vs strictness-only readout | ED3 | R5 |
| ED7 | Benefit-to-cost ratio | ED4 | R6 |
| ED8 | Error planes | ED5 | R6 |
| ED9 | Opportunism across norms | ED7 | R7 |

This differs from the option in `VERIFICATION_REPORT.md` §8 only because the depth plane (working ED6) is cited together with Fig. 4 here. If ED6 is instead cited only in R5, the VR ordering applies unchanged.

## A2. Analyses not yet performed that the narrative would benefit from (not done; listed for discussion)

1. **Cooperative basin and $\bar\rho$ at the IID-secure readout** (e.g. selected depths with $\alpha=0.8$, $\beta=1$): needed to show that the basin result (R3) and the opportunism result (R7) can hold simultaneously. Currently the dynamical results use $\alpha=1$, which lies outside the secure interval for multi-step SC, SH and SJ.
2. $\bar\rho$ / $\omega_C$ across error rates (ED5 is local only).
3. A finite-population evolutionary simulation with private records at one or two reference conditions, to check the closure at the level of strategy evolution (the supporting analysis checks reputations only).
4. Optional display of $\omega_C$ and $\bar\rho_C$ (basin decomposition) in a figure panel.

## A3. Inconsistencies found during this review (reported, not resolved)

1. **ED3 panel letters.** The plane block (`Extended_Data_Figure3_planes_combined.pdf`) is lettered e–l, while the simplex block contains eight unlettered panels; the assembled figure would need a–p (or a–h for simplexes and i–p for planes). `engine/README.md` refers to "3a–d of the readout planes".
2. **Figure 3 and ED3 simplexes have no panel letters.**
3. **Terminology across figures:** $\alpha$ is called "tolerance strength" (ED9), "readout parameter" (ED7), "readout probability" (Fig. 5b) and is unlabelled in ED3; $\Lambda$ is called "normalized invasion exponent" in Fig. 5a but "normalized invasion payoff difference" in Model.md; Fig. 1 uses "suspicion states", Model.md "suspicious states"/"recovery path"; ED8 titles use "Stern judging"/"Simple standing" (lower case) unlike the other figures.
4. **ED4 legend** still reads "(protected)/(unprotected)"; the footnote clarifies "pure DISC locally protected". VR §5 states the legend was changed; only the footnote carries the full wording.
5. **`figure5_ed7/data/comparison/ED6_SS_multistep_reference.csv`** retains the superseded ED6 row (mesh-23 value 0.7429, column `expected_cooperation`). Only $\lambda_{\rm ALLC}=0.001553$ is used, which is unchanged in the verified ED6; `Results_Figure5_and_ED7.md` still refers to it as "the earlier ED6 result".
6. **Figure 1** exists only in `Main_Figure/` (no source or notebook in `verified/`). All other assembled files in `Main_Figure/` predate the verification (VR §8).
7. **Sampler differences.** No-inertia SC gives $\bar\rho=0.610$ (Fig. 4, Halton), $0.6098$ (ED2e tracking protocol; neutral drift on the equilibrium segment) and $0.602$ (ED4, Sobol). Not an error, but quote the value belonging to the figure being discussed.
8. The supporting fold report (`analysis/fold_branch_analysis/`) classifies basins with the earlier $\rho\ge0.5$ rule and contains some mesh-based values; its README marks these as superseded. Use it only for qualitative mechanism statements and the branch results reproduced in ED8.

## A4. Source map for numbers used above

| Topic | File (under `verified/`) |
|---|---|
| Recognition values, selection | `figure2_ed1/data/extended_data_figure1/recognition_summary.csv`, `selected_architectures.csv`, `threshold_sensitivity.csv`; Fig. 2 landscape `figure2_ed1/data/figure2/path_length_plane_summary.csv` |
| Simplex equilibria | `figure3_ed2-ed5_ed9/data/simplex_dynamics/equilibria.csv` |
| Homogeneous roots, planes, ED2e | `figure3_ed2-ed5_ed9/data/extended_data_figure2/three_curve_equilibria.csv`, `k1_k2_summary.csv`, `alpha_beta_summary.csv`, `population_initial_reputation.csv` |
| ED3 planes | `figure3_ed2-ed5_ed9/data/extended_data_figure3_planes/cooperation_readout_plane.csv`, `invasion_grid_summary.csv`, `ESS_<norm>.npz` |
| ED4 | `figure3_ed2-ed5_ed9/data/extended_data_figure4/benefit_cost_scan.csv`, `invasion_thresholds.csv` |
| ED5 | `figure3_ed2-ed5_ed9/data/extended_data_figure5/grid_summary.csv` |
| Fig. 4, ED6 | `figure4_ed6/data/figure4/total_depth_results.csv`, `best_allocations.csv`; `figure4_ed6/data/extended_data_figure6/depth_plane_results.csv`, `grid_summary.csv` |
| Basin decomposition | `analysis/basin_decomposition/basin_decomposition_reference.csv`, `_changes.csv`, `_benefit_cost.csv` |
| ED8 | `ed8_reputation_geometry/data/extended_data_figure8/folds.csv`, `payoff_sign_changes.csv`, `edge_equilibria.csv` |
| Fig. 5, ED7 | `figure5_ed7/data/figure5/panel_a_summary.csv`, `readout_boundaries.csv`; `figure5_ed7/data/extended_data_figure7/c_secure_alpha_intervals.csv`, `reference_point_08_5.csv` |
| Outcome classes, definitions | `VERIFICATION_REPORT.md` §4; `engine/analysis.py` |
| Supporting mechanism | `analysis/fold_branch_analysis/Reputation_Fold_and_Branch_Analysis_Report.md` |
