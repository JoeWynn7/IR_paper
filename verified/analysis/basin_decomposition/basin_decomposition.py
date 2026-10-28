"""Decomposition of mean long-run cooperation into the size of the cooperative basin and the cooperation level
reached within it, for no inertia, full one-step inertia and the selected multi-step depths.

Definitions (see ../../engine/analysis.py): rho_bar = omega_C * rho_bar_C + (1 - omega_C) * rho_bar_D, where omega_C
is the fraction of area-uniform initial compositions that do not converge to the ALLD vertex, rho_bar_C the mean
long-run cooperation over those compositions and rho_bar_D the mean over the remaining ones (zero in the limit).

A change between two inertia conditions a -> b is split exactly (midpoint, i.e. two-factor Shapley, decomposition):
    delta rho_bar = basin term + level term + defective term,
    basin term   = (omega_b - omega_a) * (q_a + q_b) / 2,          q = rho_bar_C - rho_bar_D,
    level term   = (omega_a + omega_b) / 2 * (q_b - q_a),
    defective term = rho_bar_D,b - rho_bar_D,a.
If one condition has no cooperative outcome (omega = 0), rho_bar_C is undefined there and the whole cooperative change
is attributed to the basin term.

Inputs: Figure 4 table and final states (b/c = 5, 512 shifted-Halton starts) and, if present, the Extended Data
Figure 4 table (b/c scan, 8 x 512 scrambled-Sobol starts).
Outputs: basin_decomposition_reference.csv, basin_decomposition_changes.csv, basin_decomposition_benefit_cost.csv.
"""
from pathlib import Path
import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
VERIFIED = HERE.parent.parent
SELECTED = {'SC': (2, 0), 'SH': (3, 0), 'SJ': (4, 3), 'SS': (1, 2)}
NORMS = tuple(SELECTED)
COLUMNS = ['n_initial', 'n_cooperative', 'mean_cooperation', 'cooperative_basin', 'cooperation_cooperative',
           'cooperation_defective', 'min_final_cooperation_cooperative', 'max_final_cooperation_defective']


def decompose(a, b):
    def parts(x):
        w = x['cooperative_basin']
        rc = x['cooperation_cooperative'] if x['n_cooperative'] > 0 else np.nan
        rd = x['cooperation_defective'] if x['n_cooperative'] < x['n_initial'] else 0.0
        return w, (rc - rd) if np.isfinite(rc) else 0.0, rd
    wa, qa, da = parts(a); wb, qb, db = parts(b)
    if a['n_cooperative'] == 0 or b['n_cooperative'] == 0:
        basin, level = wb * qb - wa * qa, 0.0
    else:
        basin, level = (wb - wa) * (qa + qb) / 2, (wa + wb) / 2 * (qb - qa)
    total = b['mean_cooperation'] - a['mean_cooperation']
    return dict(change_in_mean_cooperation=total, basin_term=basin, level_term=level, defective_term=db - da,
                closure_error=total - basin - level - (db - da),
                basin_share=basin / total if abs(total) > 1e-9 else np.nan)


def reference_table():
    d = pd.read_csv(VERIFIED / 'figure4_ed6' / 'data' / 'figure4' / 'total_depth_results.csv')
    rows = []
    for norm in NORMS:
        for cond, (k1, k2) in (('none', (0, 0)), ('one', (1, 1)), ('multi', SELECTED[norm])):
            r = d[(d.norm == norm) & (d.k1 == k1) & (d.k2 == k2)].iloc[0]
            rows.append(dict(norm=norm, condition=cond, k1=k1, k2=k2, **{c: r[c] for c in COLUMNS},
                             basin_standard_error=np.sqrt(r.cooperative_basin * (1 - r.cooperative_basin) / r.n_initial)))
    return pd.DataFrame(rows)


def changes(table, by=()):
    out = []
    for key, g in table.groupby(['norm', *by], sort=False):
        g = g.set_index('condition')
        for a, b in (('none', 'one'), ('one', 'multi'), ('none', 'multi')):
            out.append(dict(zip(['norm', *by], key if isinstance(key, tuple) else (key,)), change=f'{a} -> {b}',
                            **decompose(g.loc[a], g.loc[b])))
    return pd.DataFrame(out)


if __name__ == '__main__':
    pd.set_option('display.width', 220)
    ref = reference_table()
    ref.to_csv(HERE / 'basin_decomposition_reference.csv', index=False)
    ch = changes(ref)
    ch.to_csv(HERE / 'basin_decomposition_changes.csv', index=False)
    print(ref.round(4).to_string(index=False)); print(ch.round(4).to_string(index=False))
    ed4 = VERIFIED / 'figure3_ed2-ed5_ed9' / 'data' / 'extended_data_figure4' / 'benefit_cost_scan.csv'
    if ed4.exists():
        s = pd.read_csv(ed4)
        bc = changes(s[['norm', 'condition', 'b_over_c', *COLUMNS]], by=('b_over_c',))
        bc.to_csv(HERE / 'basin_decomposition_benefit_cost.csv', index=False)
        sub = bc[(bc.change == 'one -> multi') & (bc.change_in_mean_cooperation.abs() >= 0.05)]
        print('b/c scan, one -> multi, |change| >= 0.05: basin share range by norm')
        print(sub.groupby('norm').basin_share.describe()[['count', 'min', '50%', 'max']].round(3))
