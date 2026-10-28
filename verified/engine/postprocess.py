"""Build the figure data tables from the verified scan results.

Usage: python postprocess.py <target> [<target> ...]   with targets depth, readout, ratio, initial_reputation.
Reads results/summary_<scan>_w*.csv and results/states_<scan>/ written by scan.py (or initial_reputation.py) and
writes the tables used by the figure notebooks into ../<package>/data/... together with the per-trajectory final
states (compressed .npz). Outcome classes and summary quantities are defined in analysis.py.
"""
import os, sys, glob, json
import numpy as np, pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import analysis, scan, irsim

E1 = scan.E1
ROOT = os.environ.get('IR_VERIFIED_ROOT', os.path.dirname(HERE))   # the verified folder (engine/ lives inside it)
DIAGNOSTICS = ['max_steps', 'n_step_cap', 'max_final_strategy_residual', 'lattice_max_residual', 'flagged_cells',
               'exact_evaluations']


def load(name):
    files = sorted(glob.glob(os.path.join(HERE, 'results', f'summary_{name}_w*.csv')))
    s = pd.concat([pd.read_csv(f) for f in files]).sort_values('job').reset_index(drop=True)
    J = scan.jobs(name)
    assert len(s) == len(J) and s.job.tolist() == list(range(len(J))), f'{name}: scan incomplete ({len(s)}/{len(J)})'
    return s, J


def final_states(name, j):
    a = np.load(os.path.join(HERE, 'results', f'states_{name}', f'{j}_0.npy')).astype(float)
    return a[:, :3], (1 - E1) * a[:, 3]


def build(name):
    s, J = load(name)
    rows, F, RHO = [], [], []
    for j, spec in enumerate(J):
        f, rho = final_states(name, j); F.append(f); RHO.append(rho)
        row = {k: v for k, v in spec.items() if k not in ('ratio', 'sample')}
        row.update(b_over_c=float(s.b_over_c[j]), e1=E1, e2=scan.E2, sample=spec['sample'])
        row.update(analysis.summarize_outcomes(rho))
        if name == 'ratio':
            per = rho.reshape(8, 512).mean(1)
            row.update(sem_mean_cooperation=float(per.std(ddof=1) / np.sqrt(8)),
                       **{f'mean_cooperation_sample{q}': float(per[q]) for q in range(8)})
        row.update({k: s.loc[j, k] for k in DIAGNOSTICS})
        inv = analysis.pure_disc_invasion(spec['norm'], spec['k1'], spec['k2'], spec['alpha'], spec['beta'],
                                          float(s.b_over_c[j]), E1, scan.E2)
        row.update(lambda_ALLD=inv['lambda_ALLD'], lambda_ALLC=inv['lambda_ALLC'],
                   disc_locally_protected=bool(analysis.locally_protected(inv['lambda_ALLD'], inv['lambda_ALLC'])))
        rows.append(row)
    return pd.DataFrame(rows), np.array(F, np.float32), np.array(RHO, np.float32)


def save(df, F, RHO, path_csv, keys):
    os.makedirs(os.path.dirname(path_csv), exist_ok=True)
    df.to_csv(path_csv, index=False)
    np.savez_compressed(path_csv.replace('.csv', '_final_states.npz'), final_frequencies=F, final_cooperation=RHO,
                        **{k: (df[k].to_numpy().astype(str) if df[k].dtype == object else df[k].to_numpy()) for k in keys})
    print('wrote', os.path.relpath(path_csv, ROOT), len(df), 'rows; gap check passed for',
          int(df.outcome_gap_ok.sum()), 'of', len(df))


if __name__ == '__main__':
    for target in sys.argv[1:]:
        if target == 'depth':
            df, F, RHO = build('depth')
            df.insert(3, 'K', df.k1 + df.k2)
            fig4 = (df.K <= 8).to_numpy(); ed6 = ((df.k1 <= 7) & (df.k2 <= 7)).to_numpy()
            save(df[fig4].reset_index(drop=True), F[fig4], RHO[fig4],
                 os.path.join(ROOT, 'figure4_ed6', 'data', 'figure4', 'total_depth_results.csv'), ['norm', 'k1', 'k2'])
            save(df[ed6].reset_index(drop=True), F[ed6], RHO[ed6],
                 os.path.join(ROOT, 'figure4_ed6', 'data', 'extended_data_figure6', 'depth_plane_results.csv'),
                 ['norm', 'k1', 'k2'])
        elif target == 'readout':
            df, F, RHO = build('readout')
            save(df, F, RHO, os.path.join(ROOT, 'figure3_ed2-ed5_ed9', 'data', 'extended_data_figure3_planes',
                                          'cooperation_readout_plane.csv'), ['norm', 'alpha', 'beta'])
        elif target == 'ratio':
            df, F, RHO = build('ratio')
            save(df, F, RHO, os.path.join(ROOT, 'figure3_ed2-ed5_ed9', 'data', 'extended_data_figure4',
                                          'benefit_cost_scan.csv'), ['norm', 'condition', 'b_over_c'])
        elif target == 'initial_reputation':
            src = os.path.join(HERE, 'results', 'summary_initial_reputation.csv')
            d = pd.read_csv(src); assert len(d) == 24
            rows = []
            for r in d.itertuples():
                a = np.load(os.path.join(HERE, 'results', 'states_initial_reputation',
                                         f'{r.norm}_{r.condition}_{r.initial_reputation}.npy'))
                row = dict(norm=r.norm, condition=r.condition, k1=r.k1, k2=r.k2, initial_reputation=r.initial_reputation,
                           b_over_c=5.0, e1=E1, e2=scan.E2, sample='halton2026')
                row.update(analysis.summarize_outcomes((1 - E1) * a[:, 6]))
                row.update(max_steps=r.max_steps, n_step_cap=r.n_step_cap,
                           max_final_strategy_residual=r.max_final_strategy_residual)
                rows.append(row)
            out = os.path.join(ROOT, 'figure3_ed2-ed5_ed9', 'data', 'extended_data_figure2',
                               'population_initial_reputation.csv')
            pd.DataFrame(rows).to_csv(out, index=False); print('wrote', os.path.relpath(out, ROOT))
        else:
            raise SystemExit(f'unknown target {target}')
