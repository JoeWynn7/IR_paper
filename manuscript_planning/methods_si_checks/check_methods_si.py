"""Independent checks of the equations and reference values in the Methods and
Supplementary Information (inertial reputation model, private assessment).

The script does not use the project's code. It re-implements the closed-form
reputation map, the homogeneous-DISC resident and the invasion quantities, and
checks:
  1. closed-form R(u) against the stationary vector of the Markov chain T(u);
  2. derivative formula, full-readout identities and the passage-time identity;
  3. R'(1) = 1 - alpha (k1 >= 1) and concavity for k2 = 0;
  4. reference values of Supplementary Table S7 (r_R, R_L, R_U);
  5. chord condition and the no-inertia corollary R_L = R_U;
  6. opportunistic invasion: delta_c of Fig. 5a, alpha_L, alpha_U, H(0);
  7. critical b/c at alpha = 0.8 (Supplementary Table S8);
  8. closure ratio u_R'/DeltaPhi at the fold (SH = 2, SJ = 1.971);
  9. the error-free threshold alpha <= 1 - c/b;
 10. aggregation coefficients and the SC neutral line.
Run:  python check_methods_si.py   (requires numpy, scipy)
"""
import numpy as np
from scipy.optimize import brentq, fsolve

NORMS = {'SC': (1, 0), 'SH': (0, 0), 'SJ': (0, 1), 'SS': (1, 1)}
SELECTED = {'SC': (2, 0), 'SH': (3, 0), 'SJ': (4, 3), 'SS': (1, 2)}
E1 = E2 = 0.02
BC = 5.0


def assessment(norm, e1=E1, e2=E2):
    """P^+_{A|Y}: positive recorded assessment given intended A and observer image Y."""
    p, q = NORMS[norm]
    eps = (1 - e1) * (1 - e2) + e1 * e2
    return dict(CG=eps, DG=e2, CB=e2 + (1 - 2 * e2) * ((1 - e1) * p + e1 * q), DB=e2 + (1 - 2 * e2) * q)


def R(u, a, b, k1, k2):
    """Reputation map R(u; alpha, beta, k1, k2), Methods Eq. for the stationary map."""
    u = np.asarray(u, float)
    v = 1 - u
    Z = v ** k1 + u ** k2 - v ** k1 * u ** k2
    SW = sum((a * v) ** m for m in range(0, k1 + 1))
    SS = sum(u ** n * (1 - b ** n) for n in range(1, k2 + 1)) if k2 else 0 * u
    return (u ** (k2 + 1) * SW + v ** (k1 + 1) * SS) / Z


def R_chain(u, a, b, k1, k2):
    """Stationary readout probability from the transition matrices (direct reset)."""
    n = k1 + k2 + 2
    G, B = 0, k1 + 1
    Tp, Tm = np.zeros((n, n)), np.zeros((n, n))
    Tp[G, G] = 1
    Tm[G, 1 if k1 else B] = 1
    for m in range(1, k1 + 1):
        Tp[m, G] = 1
        Tm[m, m + 1 if m < k1 else B] = 1
    Tm[B, B] = 1
    Tp[B, B + 1 if k2 else G] = 1
    for j in range(1, k2 + 1):
        Tm[B + j, B] = 1
        Tp[B + j, B + j + 1 if j < k2 else G] = 1
    T = u * Tp + (1 - u) * Tm
    w, V = np.linalg.eig(T.T)
    pi = np.real(V[:, np.argmin(abs(w - 1))])
    pi /= pi.sum()
    sigma = np.r_[1, [a ** m for m in range(1, k1 + 1)], 0, [1 - b ** j for j in range(1, k2 + 1)]]
    return pi @ sigma


def Phi(r, A):
    return r * A['CG'] + (1 - r) * A['CB'], r * A['DG'] + (1 - r) * A['DB']


def uR(r, A):
    pc, pd = Phi(r, A)
    return r * pc + (1 - r) * pd


def resident(A, f, grid=20001):
    """Highest strictly stable root of F(r) = f(u_R(r)) - r."""
    g = np.linspace(0, 1, grid)
    F = f(uR(g, A)) - g
    roots = [float(g[i]) for i in range(grid - 1) if F[i] == 0]
    roots += [brentq(lambda r: f(uR(r, A)) - r, g[i], g[i + 1], xtol=1e-15)
              for i in range(grid - 1) if F[i] * F[i + 1] < 0]
    if abs(F[-1]) < 1e-12:
        roots.append(1.0)
    h = 1e-7
    stable = [r for r in roots if (f(uR(min(r + h, 1), A)) - min(r + h, 1)
                                   - f(uR(max(r - h, 0), A)) + max(r - h, 0)) < 0]
    return max(stable)


def deriv(f, x, h=1e-7):
    return (f(x + h) - f(x - h)) / (2 * h)


def main():
    rng = np.random.default_rng(1)
    # 1-2. closed form, derivative and identities
    err = err_d = 0.0
    for _ in range(400):
        k1, k2 = rng.integers(0, 7, 2)
        a, b = rng.random(2)
        u = rng.uniform(0.01, 0.99)
        v = 1 - u
        err = max(err, abs(R_chain(u, a, b, k1, k2) - R(u, a, b, k1, k2)))
        SW = sum((a * v) ** m for m in range(k1 + 1))
        SWp = sum(m * a ** m * v ** (m - 1) for m in range(1, k1 + 1))
        SS = sum(u ** n * (1 - b ** n) for n in range(1, k2 + 1))
        SSp = sum(n * u ** (n - 1) * (1 - b ** n) for n in range(1, k2 + 1))
        Om = u ** (k2 + 1) * SW + v ** (k1 + 1) * SS
        Z = v ** k1 + u ** k2 - v ** k1 * u ** k2
        Omp = (k2 + 1) * u ** k2 * SW - u ** (k2 + 1) * SWp - (k1 + 1) * v ** k1 * SS + v ** (k1 + 1) * SSp
        Zp = -k1 * v ** (k1 - 1) * (1 - u ** k2) + k2 * u ** (k2 - 1) * (1 - v ** k1)
        err_d = max(err_d, abs((Omp * Z - Om * Zp) / Z ** 2 - deriv(lambda x: R(x, a, b, k1, k2), u)))
        Rf = R(u, 1, 1, k1, k2)
        assert abs(Rf - u ** k2 * (1 - v ** (k1 + 1)) / Z) < 1e-12
        assert abs(1 - Rf - v ** k1 * (1 - u ** (k2 + 1)) / Z) < 1e-12
        EGB = (1 - v ** (k1 + 1)) / (u * v ** (k1 + 1))
        EBG = (1 - u ** (k2 + 1)) / (v * u ** (k2 + 1))
        assert abs(Rf - EGB / (EGB + EBG)) < 1e-10
        assert abs(R(u, 0, 0, k1, k2) - u) < 1e-12
    print(f'[1] max |closed form - Markov chain| = {err:.1e}')
    print(f'[2] max derivative-formula error = {err_d:.1e}; full-readout and passage-time identities hold')
    # 3. R'(1) and concavity
    for k1, k2, a, b in [(1, 1, .8, 1), (4, 3, .8, 1), (2, 0, .3, .5), (1, 2, 0., .2)]:
        s = (R(1, a, b, k1, k2) - R(1 - 1e-7, a, b, k1, k2)) / 1e-7
        assert abs(s - (1 - a)) < 1e-5
    uu = np.linspace(0, 1, 2001)
    for k1 in range(1, 6):
        for a in (0.2, 0.5, 0.8, 1.0):
            assert (np.diff(R(uu, a, 1, k1, 0), 2) <= 1e-12).all()
    print("[3] R'(1) = 1 - alpha (k1 >= 1) and concavity for k2 = 0 confirmed")
    # 4-5. Table S7 and chord condition
    print('[4] Table S7: norm setting r_R r_ALLD r_ALLC R_L R_U  | chord gap')
    for norm in NORMS:
        A = assessment(norm)
        for lab, (k1, k2, a, b) in [('none', (0, 0, 0, 0)), ('one', (1, 1, 1, 1)),
                                    ('sel', (*SELECTED[norm], 1, 1))]:
            f = lambda u: R(u, a, b, k1, k2)
            r = resident(A, f)
            pc, pd = Phi(r, A)
            rC, rD = float(f(pc)), float(f(pd))
            RL = r / (r - rD) if r > rD else np.inf
            RU = (1 - r) / (rC - r) if rC > r else np.inf
            gap = float(f(uR(r, A))) - (r * rC + (1 - r) * rD)
            if np.isfinite(RL) and np.isfinite(RU):
                assert (RL < RU) == (gap > 1e-12) or abs(RL - RU) < 1e-6
            print(f'    {norm} {lab:4s} {r:.6f} {rD:.6f} {rC:.6f} {RL:10.4f} {RU:10.4f} | {gap:+.2e}')
    # 6. opportunistic invasion (SJ)
    A = assessment('SJ')
    dgrid = np.unique(np.r_[np.linspace(0, 1, 4001), np.linspace(0, .025, 1001), np.geomspace(1e-9, 1e-3, 100)])

    def lam(f, r):
        pc, pd = Phi(r, A)
        u, dP = uR(r, A), pc - pd
        return lambda d: d * r - BC * (r - f(u - d * r * dP))

    def delta_c(L):
        val = L(dgrid)
        idx = np.where(val[1:] > 0)[0]
        if not len(idx):
            return 0.0
        i = idx.max() + 1
        return brentq(L, dgrid[i], dgrid[i + 1]) if i + 1 < len(dgrid) else 1.0

    def damped(f):
        r = 1.0
        for _ in range(300000):
            nxt = .8 * r + .2 * float(f(uR(r, A)))
            if abs(nxt - r) < 2e-14:
                return nxt
            r = nxt
        raise RuntimeError

    agg = lambda u: 1 - (1 - u) ** 2

    def score(u, zmax=5, z0=0):
        t = np.asarray(u, float) / (1 - np.asarray(u, float))
        return sum(t ** j for j in range(zmax + z0, 2 * zmax + 1)) / sum(t ** j for j in range(2 * zmax + 1))

    print('[6] Fig. 5a (SJ): r_R, Lambda(1), delta_c')
    for lab, f, sel in [('one-step', lambda u: R(u, 1, 1, 1, 1), resident),
                        ('(4,3) a=1', lambda u: R(u, 1, 1, 4, 3), resident),
                        ('(4,3) a=0.8', lambda u: R(u, .8, 1, 4, 3), resident),
                        ('aggregation', agg, None), ('score', score, None)]:
        r = sel(A, f) if sel else damped(f)
        L = lam(f, r)
        print(f'    {lab:12s} r_R={r:.7f} Lambda(1)={L(1.0):+.4f} delta_c={delta_c(L):.6f}')
    F = lambda r, a: R(uR(r, A), a, 1, 4, 3) - r
    dF = lambda r, a: deriv(lambda x: F(x, a), r)
    rL, aL = fsolve(lambda x: [F(*x), dF(*x)], [0.85, 0.567], xtol=1e-14)
    dPhi = lambda r: Phi(r, A)[0] - Phi(r, A)[1]
    rU, aU = fsolve(lambda x: [F(*x), BC * dPhi(x[0]) * deriv(lambda u: R(u, x[1], 1, 4, 3), uR(x[0], A)) - 1],
                    [0.987, 0.80], xtol=1e-14)
    print(f'    alpha_L = {aL:.7f} (r = {rL:.6f}); alpha_U = {aU:.7f} (r = {rU:.6f})')
    # 7. critical b/c at alpha = 0.8
    print('[7] Table S8: r_R(0.8), H(0), min H, (b/c)_crit')
    d = np.r_[np.geomspace(1e-9, 1e-3, 200), np.linspace(1e-3, 1, 100001)]
    for norm, (k1, k2) in SELECTED.items():
        An = assessment(norm)
        f = lambda u: R(u, .8, 1, k1, k2)
        r = resident(An, f)
        pc, pd = Phi(r, An)
        u, dP = uR(r, An), pc - pd
        H = (r - f(u - d * r * dP)) / (d * r)
        H0 = dP * deriv(f, u)
        print(f'    {norm} r={r:.6f} H(0)={H0:.6f} minH={min(H.min(), H0):.6f} crit={1 / min(H.min(), H0):.4f}')
    # 8. closure ratio at the fold
    for norm, (k1, k2), g0 in [('SH', (3, 0), [.84, .59]), ('SJ', (4, 3), [.85, .567])]:
        An = assessment(norm)
        Fn = lambda r, a: R(uR(r, An), a, 1, k1, k2) - r
        r0, a0 = fsolve(lambda x: [Fn(*x), deriv(lambda y: Fn(y, x[1]), x[0])], g0, xtol=1e-14)
        ratio = deriv(lambda y: uR(y, An), r0) / (Phi(r0, An)[0] - Phi(r0, An)[1])
        print(f"[8] {norm} fold alpha={a0:.6f}: u_R'/DeltaPhi = {ratio:.6f}")
    # 9. error-free threshold
    for norm in NORMS:
        An = assessment(norm, 0, 0)
        for k1, k2 in [(1, 1), (2, 0), (3, 0), (4, 3), (1, 2), (5, 6)]:
            for bc in (3, 5, 8):
                for a, secure in ((1 - 1 / bc - 1e-3, True), (1 - 1 / bc + 1e-3, False)):
                    L = lambda dd: dd - bc * (1 - R(1 - dd, a, 1, k1, k2))
                    assert (L(dgrid[1:]) <= 1e-14).all() == secure
    print('[9] error-free threshold alpha <= 1 - c/b confirmed (all norms, 6 architectures, b/c = 3, 5, 8)')
    # 10. aggregation coefficients and SC neutral line
    r = damped(agg)
    pc, pd = Phi(r, A)
    u, dP = uR(r, A), pc - pd
    c1, c2 = r * (1 - 2 * BC * (1 - u) * dP), BC * r * r * dP * dP
    print(f'[10] aggregation (SJ): Lambda = {c1:.6f} d - {c2:.6f} d^2, root {c1 / c2:.6f}')
    As = assessment('SC')
    print(f'     SC neutral line f_DISC = {1 / (BC * (As["CG"] - As["DG"])):.4f}')


if __name__ == '__main__':
    main()
