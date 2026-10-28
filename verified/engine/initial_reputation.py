"""Population-level initial-reputation robustness (revised Extended Data Figure 2, panel e).
For each norm and inertia condition, the 512 shifted-Halton initial compositions of Figure 4 are integrated with
reputations initialized once at t = 0 either at all-good (r = 1) or at all-bad (r = 0) and then followed
quasi-statically (warm-started relaxation of the auxiliary flow at every evaluation; robustness protocol).
Writes results/summary_initial_reputation.csv and results/states_initial_reputation/<norm>_<condition>_<r0>.npy
(final f_ALLC, f_ALLD, f_DISC, r_ALLC, r_ALLD, r_DISC, intended cooperation). Resumable."""
import os, sys, time, numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import irsim

E1 = E2 = 0.02
CONDITIONS = {'none': lambda n: (0, 0, 0., 0.), 'one': lambda n: (1, 1, 1., 1.),
              'multi': lambda n: (*irsim.SELECTED_DEPTHS[n], 1., 1.)}

if __name__ == '__main__':
    out_csv = 'results/summary_initial_reputation.csv'
    os.makedirs('results/states_initial_reputation', exist_ok=True)
    done = set()
    if os.path.exists(out_csv):
        d = pd.read_csv(out_csv); done = set(zip(d.norm, d.condition, d.initial_reputation))
    F0 = irsim.halton_shifted(512, 2026)
    for norm in irsim.NORMS:
        for cond, arch in CONDITIONS.items():
            for r0, label in ((1.0, 'all_good'), (0.0, 'all_bad')):
                if (norm, cond, label) in done: continue
                t0 = time.time()
                p = irsim.params(norm, *arch(norm), E1, E2, 5.0, 1.0)
                o = irsim.run_tracking(p, F0, r0=r0)
                rho = (1 - E1) * o[:, 6]
                np.save(f'results/states_initial_reputation/{norm}_{cond}_{label}.npy', o[:, :7].astype(np.float64))
                row = dict(norm=norm, condition=cond, k1=arch(norm)[0], k2=arch(norm)[1], initial_reputation=label,
                           n_initial=len(F0), mean_cooperation=rho.mean(),
                           sem_cooperation=rho.std(ddof=1) / np.sqrt(len(rho)),
                           n_defective=int((rho < 0.05).sum()), n_cooperative=int((rho >= 0.05).sum()),
                           max_steps=int(o[:, 7].max()), n_step_cap=int((o[:, 7] >= 400 * 500).sum()),
                           max_final_strategy_residual=float(o[:, 8].max()), seconds=time.time() - t0)
                pd.DataFrame([row]).to_csv(out_csv, mode='a', header=not os.path.exists(out_csv), index=False)
                print(norm, cond, label, 'coop %.4f' % row['mean_cooperation'], '%.0fs' % row['seconds'], flush=True)
    print('DONE initial reputation')
