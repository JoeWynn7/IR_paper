"""Recalculation of the cooperation rates at the equilibria labelled in Fig. 3.

At a composition f = (f_ALLC, f_ALLD, f_DISC) with stationary reputations r_I,
a DISC donor intends to cooperate with probability
    rbar = f_ALLC r_ALLC + f_ALLD r_ALLD + f_DISC r_DISC,
the probability that it regards a random recipient as good, so that
    intended cooperation = f_ALLC + f_DISC * rbar,
    realized cooperation = (1 - e1) * intended cooperation.

Reputations solve the self-consistency equations of the Methods on the branch
reached from all-good records. Edge equilibria are located by root finding on
the payoff difference. Results are compared with the verified package
(verified/figure3_ed2-ed5_ed9/data/simplex_dynamics/equilibria.csv).
"""
import csv, os, contextlib, io
import numpy as np
from scipy.optimize import brentq
with contextlib.redirect_stdout(io.StringIO()):
    from verify import NORMS, P, Rmap, e1, e2

B, C = 5.0, 1.0
SETTINGS = {'a (no inertia)': {n: (0, 0) for n in NORMS},
            'b (one-step)': {n: (1, 1) for n in NORMS},
            'c (selected)': {'SC': (2, 0), 'SH': (3, 0), 'SJ': (4, 3), 'SS': (1, 2)}}
CASE = {'a (no inertia)': 'without_inertia', 'b (one-step)': 'one_step', 'c (selected)': 'multi_step'}


def reputations(norm, f, k, tol=1e-15, itmax=2_000_000):
    """Stationary reputations (r_ALLC, r_ALLD, r_DISC) from all-good records."""
    Pn = P(norm); f = np.asarray(f, float); r = np.ones(3)
    R = lambda u: Rmap(min(max(u, 0.0), 1.0), k[0], k[1], 1.0, 1.0)
    for _ in range(itmax):
        rb = f @ r
        hGG, hGB, hBB = f @ (r * r), f @ (r * (1 - r)), f @ ((1 - r) ** 2)
        u = (rb * Pn['CG'] + (1 - rb) * Pn['CB'],
             rb * Pn['DG'] + (1 - rb) * Pn['DB'],
             hGG * Pn['CG'] + hGB * (Pn['CB'] + Pn['DG']) + hBB * Pn['DB'])
        new = np.array([R(x) for x in u])
        if np.max(np.abs(new - r)) < tol:
            return new
        r = 0.5 * r + 0.5 * new
    raise RuntimeError('no convergence')


def payoffs(f, r):
    fC, fD, fX = f; rb = float(np.dot(f, r))
    return (1 - e1) * np.array([B * (fC + fX * r[0]) - C, B * (fC + fX * r[1]), B * (fC + fX * r[2]) - C * rb])


def cooperation(f, r):
    rb = float(np.dot(f, r))
    return rb, f[0] + f[2] * rb


def verified_rows():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'verified',
                        'figure3_ed2-ed5_ed9', 'data', 'simplex_dynamics', 'equilibria.csv')
    return list(csv.DictReader(open(path))) if os.path.exists(path) else []


def main():
    ver = verified_rows()
    def lookup(case, loc):
        for row in ver:
            if row['case'] == case and row['location'] == loc and row['marker_filled'] == 'True':
                return float(row['f_ALLC']), float(row['intended_cooperation'])
        return None
    for label, arch in SETTINGS.items():
        print('\nFig. 3' + label)
        for norm in NORMS:
            k = arch[norm]
            # pure DISC
            f = (0.0, 0.0, 1.0); r = reputations(norm, f, k); pi = payoffs(f, r)
            lamC, lamD = pi[0] - pi[2], pi[1] - pi[2]
            rb, rho = cooperation(f, r)
            state = 'stable' if (lamC < 0 and lamD < 0) else ('ALLC invades' if lamC > 0 and lamD < 0 else 'ALLD invades')
            print('  %s %s  pure DISC: P(DISC intends C) = %.7f, intended = %.4f%%, realized = %.4f%%  [%s]'
                  % (norm, k, rb, 100 * rho, 100 * (1 - e1) * rho, state))
            if lamC > 0 and lamD < 0:
                g = lambda x: (lambda p: p[0] - p[2])(payoffs((x, 0.0, 1 - x), reputations(norm, (x, 0.0, 1 - x), k)))
                xs = np.linspace(1e-4, 0.999, 60); gv = [g(x) for x in xs]
                for i in range(len(xs) - 1):
                    if gv[i] > 0 >= gv[i + 1]:
                        x = brentq(g, xs[i], xs[i + 1], xtol=1e-13)
                        f = (x, 0.0, 1 - x); r = reputations(norm, f, k); pi = payoffs(f, r)
                        rb, rho = cooperation(f, r)
                        pbar = x * pi[0] + (1 - x) * pi[2]
                        print('      stable ALLC-DISC mixture: f_ALLC = %.6f, f_DISC = %.6f' % (x, 1 - x))
                        print('      r_ALLC = %.6f, r_DISC = %.6f, P(DISC intends C) = rbar = %.6f' % (r[0], r[2], rb))
                        print('      intended = f_ALLC + f_DISC * rbar = %.6f + %.6f * %.6f = %.6f  (%.2f%%)'
                              % (x, 1 - x, rb, rho, 100 * rho))
                        print('      realized = %.2f%%;  mean payoff/(b-c) = %.6f;  ALLD growth rate = %.3f'
                              % (100 * (1 - e1) * rho, pbar / (B - C), pi[1] - pbar))
                        v = lookup(CASE[label] + '_' + norm, 'ALLC-DISC')
                        if v: print('      verified package: f_ALLC = %.6f, intended = %.6f' % v)
            else:
                v = lookup(CASE[label] + '_' + norm, 'DISC')
                if v: print('      verified package: intended = %.7f' % v[1])


if __name__ == '__main__':
    main()
