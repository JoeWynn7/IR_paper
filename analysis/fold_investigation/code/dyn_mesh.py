"""Re-initialized selection rule (repository convention): reputations at each composition are the
result of relaxing from r0. Precomputed on a fine triangular mesh, linearly interpolated (reputations,
not the vector field), payoffs evaluated exactly from interpolated reputations."""
import numpy as np, sys, os
from scipy.interpolate import LinearNDInterpolator
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import lib, dyn

def mesh(norm, regime, r0, M=160):
    pts = np.array([(i/M, j/M, 1-(i+j)/M) for i in range(M+1) for j in range(M+1-i)])
    r, res = lib.relax(pts, lib.A(norm), lib.cond(norm, regime), r0=r0, tol=1e-11)
    return LinearNDInterpolator(pts[:, :2], r), pts, r, res

def run(norm, regime, f0, r0=1.0, dt=0.1, T=3000., M=160):
    interp, *_ = mesh(norm, regime, r0, M)
    f = dyn.normalize(np.array(f0, float))
    R = lambda f: np.clip(interp(f[:, :2]), 0, 1)
    for step in range(int(round(T/dt))):
        r = R(f); k = lib.replicator(f, r); fm = dyn.normalize(f + .5*dt*k)
        f = dyn.normalize(f + dt*lib.replicator(fm, R(fm)))
    r = R(f)
    return dict(f=f, r=r, coop=lib.coop_real(f, r), residual=np.max(np.abs(lib.replicator(f, r)), 1))

def run_rhs_interp(norm, regime, f0, r0=1.0, dt=0.1, T=3000., M=23):
    """Repository-style: interpolate the replicator vector field (not reputations) on a resolution-M mesh."""
    pts = np.array([(i/M, j/M, 1-(i+j)/M) for i in range(M+1) for j in range(M+1-i)])
    r, _ = lib.relax(pts, lib.A(norm), lib.cond(norm, regime), r0=r0, tol=1e-10)
    rhs = lib.replicator(pts, r)
    ix = LinearNDInterpolator(pts[:, :2], rhs[:, 0]); iy = LinearNDInterpolator(pts[:, :2], rhs[:, 1])
    def V(f):
        dx = ix(f[:, :2]); dy = iy(f[:, :2]); v = np.column_stack([dx, dy, -dx-dy])
        v[f <= 1e-12] = 0; v -= f * v.sum(1, keepdims=True); return v
    f = dyn.normalize(np.array(f0, float))
    for step in range(int(round(T/dt))):
        fm = dyn.normalize(f + .5*dt*V(f)); f = dyn.normalize(f + dt*V(fm))
    rr, _ = lib.relax(f, lib.A(norm), lib.cond(norm, regime), r0=r0, tol=1e-10)
    return dict(f=f, r=rr, coop=lib.coop_real(f, rr))

def lattice_interp(vals, M):
    """O(1) barycentric interpolation on the regular triangular lattice used by mesh(): node (i,j) has
    f_C=i/M, f_D=j/M; index map built once. vals: (nodes, k)."""
    idx = {}
    n = 0
    for i in range(M+1):
        for j in range(M+1-i):
            idx[(i, j)] = n; n += 1
    tab = np.full((M+2, M+2), -1, int)
    for (i, j), v in idx.items(): tab[i, j] = v
    def interp(f):
        x = f[:, 0]*M; y = f[:, 1]*M
        i = np.clip(np.floor(x).astype(int), 0, M-1); j = np.clip(np.floor(y).astype(int), 0, M-1)
        over = i + j > M - 1
        j = np.where(over & (j > 0), j - 1, j); i = np.where(over & (j == 0) & (i + j > M - 1), i - 1, i)
        u = x - i; v = y - j
        lower = u + v <= 1
        a = tab[i, j]; b = tab[i+1, j]; c = tab[i, j+1]; d = tab[np.minimum(i+1, M), np.minimum(j+1, M)]
        out = np.where(lower[:, None],
                       (1-u-v)[:, None]*vals[a] + u[:, None]*vals[b] + v[:, None]*vals[c],
                       (u+v-1)[:, None]*vals[np.where(d >= 0, d, a)] + (1-v)[:, None]*vals[b] + (1-u)[:, None]*vals[c])
        return out
    return interp

def run_fast(norm, regime, f0, r0=1.0, dt=0.1, T=3000., M=160):
    pts = np.array([(i/M, j/M, 1-(i+j)/M) for i in range(M+1) for j in range(M+1-i)])
    r, res = lib.relax(pts, lib.A(norm), lib.cond(norm, regime), r0=r0, tol=1e-11)
    R = lattice_interp(r, M)
    f = dyn.normalize(np.array(f0, float))
    for step in range(int(round(T/dt))):
        rr = np.clip(R(f), 0, 1); k = lib.replicator(f, rr); fm = dyn.normalize(f + .5*dt*k)
        f = dyn.normalize(f + dt*lib.replicator(fm, np.clip(R(fm), 0, 1)))
    rr = np.clip(R(f), 0, 1)
    return dict(f=f, r=rr, coop=lib.coop_real(f, rr), mesh_res=res.max())
