"""Resumable parameter scans with the verified engine.
Usage: python scan.py <jobset> <worker> <nworkers>
Each condition writes one summary row (summary_<jobset>.csv) and its per-trajectory final states
(results/states_<jobset>/<job>_<ratio index>.npy: final f_ALLC, f_ALLD, f_DISC, intended cooperation)."""
import sys, os, time, json, numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import irsim, analysis

E1 = E2 = 0.02
RATIOS_ED4 = np.unique(np.r_[1.001, np.linspace(1.1, 7, 31), np.linspace(7.25, 10, 12), 5.])

def jobs(name):
    J = []
    if name == 'depth':      # Figure 4 (K<=8) and ED6 (k1,k2<=7), full readout
        pairs = sorted({(a, b) for a in range(9) for b in range(9) if a + b <= 8} | {(a, b) for a in range(8) for b in range(8)})
        for norm in irsim.NORMS:
            for k1, k2 in pairs: J.append(dict(norm=norm, k1=k1, k2=k2, alpha=1.0, beta=1.0, sample='halton2026'))
    elif name == 'readout':  # ED3 cooperation plane, one-step depths, 41 x 41 readout grid
        vals = np.round(np.linspace(0, 1, 41), 6)
        for norm in irsim.NORMS:
            for a in vals:
                for b in vals: J.append(dict(norm=norm, k1=1, k2=1, alpha=float(a), beta=float(b), sample='halton2026'))
    elif name == 'ratio':    # ED4: benefit-to-cost scan, eight scrambled-Sobol samples, one job per ratio
        for norm in irsim.NORMS:
            for cond, (k1, k2, a, b) in [('none', (0, 0, 0., 0.)), ('one', (1, 1, 1., 1.)),
                                         ('multi', (*irsim.SELECTED_DEPTHS[norm], 1., 1.))]:
                for ratio in RATIOS_ED4:
                    J.append(dict(norm=norm, condition=cond, k1=k1, k2=k2, alpha=a, beta=b, ratio=float(ratio),
                                  sample='sobol2026-2033'))
    return J

def starts(sample):
    if sample == 'halton2026': return irsim.halton_shifted(512, 2026)
    return np.vstack([irsim.sobol_scrambled(512, s) for s in range(2026, 2034)])

if __name__ == '__main__':
    name, w, nw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    out_csv = f'results/summary_{name}_w{w}.csv'
    os.makedirs('results', exist_ok=True)
    done = set(pd.read_csv(out_csv)['job'].tolist()) if os.path.exists(out_csv) else set()
    os.makedirs(f'results/states_{name}', exist_ok=True)
    J = jobs(name)
    order = list(range(len(J)))
    if name == 'readout':   # coarse 21 x 21 sub-grid first, then the remaining points (job indices are unchanged)
        grid = np.round(np.linspace(0, 1, 41), 6)
        coarse = lambda s: (int(np.argmin(abs(grid - s['alpha']))) % 2 + int(np.argmin(abs(grid - s['beta']))) % 2) > 0
        order.sort(key=lambda j: coarse(J[j]))
    for j in order:
        spec = J[j]
        if j % nw != w or j in done: continue
        t0 = time.time()
        p = irsim.params(spec['norm'], spec['k1'], spec['k2'], spec['alpha'], spec['beta'], E1, E2, 5.0, 1.0)
        F0 = starts(spec['sample'])
        bs = np.array([spec['ratio']]) if name == 'ratio' else np.array([5.0])
        out, info = irsim.run(p, F0, bs=bs)
        rows = []
        for q, bval in enumerate(bs):
            o = out[q]; rho = (1 - E1) * o[:, 6]
            row = dict(job=j, **{k: v for k, v in spec.items() if k != 'ratio'}, b_over_c=float(bval), e1=E1, e2=E2, n_initial=len(F0))
            if name == 'ratio':
                means = o[:, 6].reshape(8, 512).mean(1)
                row.update(mean_intended_cooperation=means.mean(), sem_intended_cooperation=means.std(ddof=1) / np.sqrt(8),
                           **{f'intended_cooperation_sample{s}': means[s] for s in range(8)})
            row.update(analysis.summarize_outcomes(rho))
            row.update(max_steps=int(o[:, 7].max()), n_step_cap=int((o[:, 7] >= 400 * 500).sum()),
                       max_final_strategy_residual=float(o[:, 8].max()), lattice_max_residual=info[0],
                       flagged_cells=int(info[1]), exact_evaluations=int(info[2]), seconds=time.time() - t0)
            rows.append(row)
            np.save(f'results/states_{name}/{j}_{q}.npy', np.column_stack([o[:, :3], o[:, 6]]).astype(np.float32))
        pd.DataFrame(rows).to_csv(out_csv, mode='a', header=not os.path.exists(out_csv), index=False)
        print(name, j, spec['norm'], spec['k1'], spec['k2'], spec['alpha'], spec['beta'], 'coop %.4f' % rows[0]['mean_cooperation'], '%.1fs' % (time.time() - t0), flush=True)
    print('DONE', name, w)
