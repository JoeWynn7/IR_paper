"""Independent analysis library for the fold/branch investigation.
Model exactly as in code-and-figures/Model.md (direct reset, readout, private closure).
Composition order: f = (ALLC, ALLD, DISC); reputations r = (r_C, r_D, r_R)."""
import numpy as np

E1 = E2 = 0.02
B, C = 5.0, 1.0
NORMS = {'SC': (1., 0.), 'SH': (0., 0.), 'SJ': (0., 1.), 'SS': (1., 1.)}
SEL = {'SC': (2, 0), 'SH': (3, 0), 'SJ': (4, 3), 'SS': (1, 2)}

def cond(norm, regime):
    """(k1, k2, alpha, beta) exactly as used in Fig3/ED4/Fig4."""
    if regime == 'none':  return (0, 0, 0., 0.)
    if regime == 'one':   return (1, 1, 1., 1.)
    if regime == 'multi': return (*SEL[norm], 1., 1.)
    raise ValueError(regime)

def A(norm, e1=E1, e2=E2):
    p, q = NORMS[norm]
    eps = (1 - e1) * (1 - e2) + e1 * e2
    return np.array([eps, p * (eps - e2) + q * (1 - eps - e2) + e2, e2, q * (1 - 2 * e2) + e2])  # CG, CB, DG, DB

def R(u, k1, k2, a, b):
    u = np.clip(np.asarray(u, float), 0., 1.); v = 1 - u
    Z = v ** k1 + u ** k2 - v ** k1 * u ** k2
    w = np.zeros_like(u); s = np.zeros_like(u)
    for m in range(1, k1 + 1): w = w + (a * v) ** m
    for n in range(1, k2 + 1): s = s + u ** n * (1 - b ** n)
    return (u ** (k2 + 1) * (1 + w) + v ** (k1 + 1) * s) / Z

def inputs(r, f, Aa):
    """phi for (C, D, R); r, f shape (...,3)."""
    cg, cb, dg, db = Aa
    g = np.sum(f * r, -1); g2 = np.sum(f * r * r, -1)
    uc = g * cg + (1 - g) * cb
    ud = g * dg + (1 - g) * db
    ur = g2 * cg + (g - g2) * (cb + dg) + (1 - 2 * g + g2) * db
    return np.stack([uc, ud, ur], -1)

def aux_rhs(r, f, Aa, par):
    return R(inputs(r, f, Aa), *par) - r

def relax(f, Aa, par, r0=1.0, dt=0.25, tol=1e-11, max_steps=400000, return_steps=False):
    """Auxiliary vector flow dr/dtau = R(phi)-r (RK4) from r0, vectorized over compositions."""
    f = np.atleast_2d(f).astype(float)
    r = np.broadcast_to(np.asarray(r0, float), f.shape).copy()
    active = np.ones(len(f), bool); steps = np.zeros(len(f), int)
    for it in range(max_steps):
        idx = np.flatnonzero(active)
        if idx.size == 0: break
        rr, ff = r[idx], f[idx]
        k1 = aux_rhs(rr, ff, Aa, par)
        done = np.max(np.abs(k1), -1) <= tol
        active[idx[done]] = False
        mv = ~done; rr, ff, k1 = rr[mv], ff[mv], k1[mv]
        if rr.size == 0: continue
        k2 = aux_rhs(np.clip(rr + .5 * dt * k1, 0, 1), ff, Aa, par)
        k3 = aux_rhs(np.clip(rr + .5 * dt * k2, 0, 1), ff, Aa, par)
        k4 = aux_rhs(np.clip(rr + dt * k3, 0, 1), ff, Aa, par)
        r[idx[mv]] = np.clip(rr + dt * (k1 + 2 * k2 + 2 * k3 + k4) / 6, 0, 1)
        steps[idx[mv]] += 1
    res = np.max(np.abs(aux_rhs(r, f, Aa, par)), -1)
    return (r, res, steps) if return_steps else (r, res)

def jac(r, f, Aa, par, h=1e-7):
    r = np.atleast_2d(r); f = np.atleast_2d(f)
    J = np.empty(r.shape + (3,))
    for j in range(3):
        e = np.zeros(3); e[j] = h
        J[..., j] = (aux_rhs(np.clip(r + e, 0, 1), f, Aa, par) - aux_rhs(np.clip(r - e, 0, 1), f, Aa, par)) / \
                    (np.clip(r + e, 0, 1)[..., j] - np.clip(r - e, 0, 1)[..., j])[..., None]
    return J

def scan_equilibria(f, Aa, par, nbar=4001, chunk=400):
    """All equilibria of the self-consistency system at each composition (f_R>0),
    via the exact reduction to one equation in rbar. Returns list of arrays rows:
    (rbar, rC, rD, rR, max_real_eig)."""
    f = np.atleast_2d(f).astype(float)
    grid = np.linspace(0, 1, nbar)
    cg, cb, dg, db = Aa
    out = []
    for s in range(0, len(f), chunk):
        ff = f[s:s + chunk]
        fC, fD, fR = ff[:, 0:1], ff[:, 1:2], ff[:, 2:3]
        def F(gb, fC, fD, fR):
            rC = R(gb * cg + (1 - gb) * cb, *par); rD = R(gb * dg + (1 - gb) * db, *par)
            rR = (gb - fC * rC - fD * rD) / fR
            ok = (rR >= -0.2) & (rR <= 1.2)
            rRc = rR
            g2 = fC * rC ** 2 + fD * rD ** 2 + fR * rRc ** 2
            ur = g2 * cg + (gb - g2) * (cb + dg) + (1 - 2 * gb + g2) * db
            val = R(ur, *par) - rRc
            return np.where(ok, val, np.nan), rC, rD, rRc
        G = np.broadcast_to(grid, (len(ff), nbar))
        val, _, _, _ = F(G, fC, fD, fR)
        sgn = np.sign(val)
        cross = (sgn[:, :-1] * sgn[:, 1:] < 0) | (val[:, :-1] == 0)
        ii, jj = np.nonzero(cross)
        lo = grid[jj].copy(); hi = grid[jj + 1].copy()
        fCi, fDi, fRi = fC[ii, 0], fD[ii, 0], fR[ii, 0]
        vlo = F(lo, fCi, fDi, fRi)[0]
        for _ in range(60):
            mid = .5 * (lo + hi); vm = F(mid, fCi, fDi, fRi)[0]
            left = np.sign(vm) == np.sign(vlo)
            lo = np.where(left, mid, lo); vlo = np.where(left, vm, vlo); hi = np.where(left, hi, mid)
        gb = .5 * (lo + hi)
        _, rC, rD, rR = F(gb, fCi, fDi, fRi)
        keep = (rR >= -1e-9) & (rR <= 1 + 1e-9)
        gb, rC, rD, rR, ii = gb[keep], rC[keep], rD[keep], np.clip(rR[keep], 0, 1), ii[keep]
        rr = np.stack([rC, rD, rR], -1)
        Jm = jac(rr, ff[ii], Aa, par)
        ev = np.linalg.eigvals(Jm).real.max(-1) if len(ii) else np.zeros(0)
        res = np.max(np.abs(aux_rhs(rr, ff[ii], Aa, par)), -1) if len(ii) else np.zeros(0)
        for p in range(len(ff)):
            m = ii == p
            out.append(np.column_stack([gb[m], rC[m], rD[m], rR[m], ev[m], res[m]]))
    return out

def payoffs(f, r):
    f = np.atleast_2d(f); r = np.atleast_2d(r)
    g = np.sum(f * r, -1)
    pc = (1 - E1) * (B * (f[:, 0] + f[:, 2] * r[:, 0]) - C)
    pd = (1 - E1) * B * (f[:, 0] + f[:, 2] * r[:, 1])
    pr = (1 - E1) * (B * (f[:, 0] + f[:, 2] * r[:, 2]) - C * g)
    return np.stack([pc, pd, pr], -1)

def replicator(f, r):
    P = payoffs(f, r); m = np.sum(f * P, -1, keepdims=True)
    return f * (P - m)

def coop_real(f, r):
    return (1 - E1) * (f[:, 0] + f[:, 2] * np.sum(f * r, -1))

# ---------- full internal-state occupation dynamics (true mean-field record dynamics) ----------
def chain(k1, k2, a, b):
    n = k1 + k2 + 2; Bi = k1 + 1
    P = np.zeros(n, int); M = np.zeros(n, int)
    for s in range(n):
        if s == 0: P[s] = 0; M[s] = 1 if k1 else Bi
        elif s < Bi: P[s] = 0; M[s] = s + 1 if s < k1 else Bi
        elif s == Bi: P[s] = Bi + 1 if k2 else 0; M[s] = Bi
        else:
            nn = s - Bi; P[s] = s + 1 if nn < k2 else 0; M[s] = Bi
    sig = np.r_[1., [a ** m for m in range(1, k1 + 1)], 0., [1 - b ** m for m in range(1, k2 + 1)]]
    return P, M, sig

def fullstate_relax(f, Aa, par, start='G', dt=0.2, tol=1e-11, max_steps=400000):
    """Occupation x[I, state] of each strategy's record; each record updated at unit rate:
    dx_I/dtau = phi_I * (x_I P) + (1-phi_I)*(x_I M) - x_I, phi from r_I = sigma . x_I."""
    k1, k2, a, b = par
    P, M, sig = chain(*par)
    n = len(sig); f = np.atleast_2d(f).astype(float); N = len(f)
    x = np.zeros((N, 3, n)); x[:, :, 0 if start == 'G' else k1 + 1] = 1.
    Pm = np.zeros((n, n)); Mm = np.zeros((n, n))
    Pm[np.arange(n), P] = 1; Mm[np.arange(n), M] = 1
    def rhs(x):
        r = x @ sig
        ph = inputs(r, f, Aa)
        return ph[..., None] * (x @ Pm) + (1 - ph[..., None]) * (x @ Mm) - x
    active = np.ones(N, bool)
    for it in range(max_steps):
        idx = np.flatnonzero(active)
        if idx.size == 0: break
        fsave = f; f = fsave[idx]
        xx = x[idx]; k1_ = rhs(xx)
        done = np.abs(k1_).max((-1, -2)) <= tol
        active[idx[done]] = False
        if (~done).any():
            xx2 = xx[~done]; f = fsave[idx[~done]]
            q1 = k1_[~done]; q2 = rhs(xx2 + .5 * dt * q1); q3 = rhs(xx2 + .5 * dt * q2); q4 = rhs(xx2 + dt * q3)
            x[idx[~done]] = np.clip(xx2 + dt * (q1 + 2 * q2 + 2 * q3 + q4) / 6, 0, 1)
        f = fsave
    return x @ sig

def halton512(seed=2026, n=512):
    """Exact copy of the repository's shifted-Halton fallback sampler (Figure4/ED6)."""
    shift = np.random.RandomState(seed).random_sample(2)
    idx = np.arange(1, n + 1); coords = []
    for base in (2, 3):
        rem = idx.copy(); vals = np.zeros(n); fac = 1. / base
        while np.any(rem):
            vals += fac * (rem % base); rem //= base; fac /= base
        coords.append(vals)
    uv = (np.column_stack(coords) + shift) % 1.0
    refl = uv[:, 0] + uv[:, 1] > 1.0; uv[refl] = 1.0 - uv[refl]
    return np.column_stack((uv[:, 0], uv[:, 1], 1.0 - uv.sum(1)))
