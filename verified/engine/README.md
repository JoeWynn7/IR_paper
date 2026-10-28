# Strategy-dynamics engine

This folder contains the numerical core used for all sampled-cooperation results (Figure 4, Extended Data Figures 2e, 3a–d of the readout planes, 4 and 6) and the scripts that produce their data.

## Files

| File | Purpose |
|---|---|
| `irsim.c` | C implementation of the model: stationary response $\mathcal R(u)$, auxiliary reputation flow, all-good relaxation, reputation lattice, replicator dynamics, trajectory integration, and the initial-reputation tracking protocol. |
| `irsim.py` | Python interface (ctypes). Compiles `irsim.c` with the system C compiler on first use (`cc -O3 -std=c99 -shared -fPIC`). Also provides the shifted-Halton and scrambled-Sobol samplers of the simplex. |
| `analysis.py` | Definitions of the outcome classes and summary quantities, the pure-DISC resident/mutant calculation, and the local-protection rule. |
| `scan.py` | Resumable parameter scans: `depth` (Figure 4 and ED6), `readout` (ED3 cooperation plane), `ratio` (ED4). |
| `initial_reputation.py` | All-good versus all-bad initial reputations at the population level (ED2e). |
| `postprocess.py` | Builds the figure tables and per-trajectory final-state archives in the figure packages from the scan results. |
| `results/` | Scan summaries (`summary_<scan>_w<worker>.csv`) and per-trajectory final states (`states_<scan>/`). |

## Model conventions

* Strategies ALLC, ALLD, DISC; private assessment; implementation error $e_1$ and assessment error $e_2$; norms SC $(1,0)$, SH $(0,0)$, SJ $(0,1)$, SS $(1,1)$.
* Direct-reset record with $k_1$ warning and $k_2$ recovery states; readouts $\alpha^m$ and $1-\beta^n$. Without inertia, $\mathcal R(u)=u$.
* **Main convention:** at every strategy composition the reputations $(r_{\rm ALLC},r_{\rm ALLD},r_{\rm DISC})$ are the equilibrium reached by relaxing $\mathrm dr_I/\mathrm d\tau=\mathcal R(\varphi_I)-r_I$ from the all-good state (RK4, step 0.25, residual $\le10^{-11}$).
* Payoffs $\Pi_{\rm ALLC}=(1-e_1)[b(f_C+f_R r_C)-c]$, $\Pi_{\rm ALLD}=(1-e_1)b(f_C+f_R r_D)$, $\Pi_{\rm DISC}=(1-e_1)[b(f_C+f_R r_R)-c\bar r]$; replicator dynamics. Realized cooperation $\rho=(1-e_1)(f_C+f_R\bar r)$.

## Treatment of discontinuities of the reputation branch

The all-good reputation map is tabulated exactly at the 7,381 nodes of a triangular lattice with $M=120$ subdivisions. Inside a lattice cell it is interpolated linearly (barycentric) only if no reputation component varies by more than 0.02 across the cell's nodes. In all other cells — those crossed by a fold of the selected branch or by a steep transition — the map is evaluated exactly at the requested composition. Payoffs and the replicator field are always computed from these reputations; the field itself is never interpolated. In the earlier pipelines the replicator field was interpolated on a coarse mesh (resolution 23, 25 or 41) across folds, which biased sampled cooperation (see `../VERIFICATION_REPORT.md`).

## Integration and stopping rule

Explicit midpoint rule with $\Delta t=0.2$. Each trajectory is integrated in intervals of 500 steps (100 time units) until its realized cooperation changes by at most $10^{-7}$ over three consecutive intervals, with a cap of 400 intervals ($4\times10^4$ time units). Trajectories that reach the cap are counted in `n_step_cap`; they occur on the neutral equilibrium segment of Scoring without inertia, along which the dynamics drift neutrally, and in a few trajectories at benefit-to-cost ratios close to the pure-DISC protection thresholds $R_L$ and $R_U$, where an invasion fitness is close to zero and the dynamics are slow. The outcome classification is unaffected in all cases (gap check in `analysis.py`). Refined settings (lattice $M=160$, threshold 0.01, $\Delta t=0.1$, 1,000-step intervals, tolerance $10^{-8}$) change mean cooperation by at most $1.3\times10^{-5}$ and leave every outcome class unchanged (`validation/settings_check.py`). An independent implementation without lattice (`validation/independent_trajectory_check.py`, re-relaxing reputations exactly at every step) reproduces the outcome of every tested trajectory.

## Reproducing the scans

```
python scan.py depth 0 1        # 264 conditions (Figure 4 and ED6), one worker
python scan.py readout 0 1      # 6,724 conditions (ED3 plane)
python scan.py ratio 0 1        # 540 conditions (ED4), 4,096 initial compositions each
python initial_reputation.py    # 24 conditions (ED2e)
python postprocess.py depth readout ratio initial_reputation
```

Scans are resumable and can be split across workers (`python scan.py <scan> <worker> <number of workers>`).
