import sys, numpy as np, pickle, time
sys.path.insert(0, '.'); import lib
X = np.r_[np.linspace(0.002, 0.98, 1200), np.linspace(0.9801, 1.0, 400)]
EDGES = {
 'ALLD-DISC': lambda x: np.column_stack([0*x, 1-x, x]),
 'ALLC-DISC': lambda x: np.column_stack([1-x, 0*x, x]),
 'ray C=D':   lambda x: np.column_stack([(1-x)/2, (1-x)/2, x]),
}
def track(fpath, Aa, par, r0):
    """quasi-static continuation: warm-started relaxation along an ordered path"""
    r = np.array(r0, float); out = []
    for f in fpath:
        rr, res = lib.relax(f[None], Aa, par, r0=r, tol=1e-10, dt=0.5)
        r = rr[0]; out.append(r.copy())
    return np.array(out)
res = {}
t0 = time.time()
for edge, path in EDGES.items():
    F = path(X)
    for norm in lib.NORMS:
        Aa = lib.A(norm)
        for rg in ['none', 'one', 'multi']:
            par = lib.cond(norm, rg)
            eq = lib.scan_equilibria(F, Aa, par, nbar=4001)
            rg_good, _ = lib.relax(F, Aa, par, r0=1.0)
            rg_bad, _ = lib.relax(F, Aa, par, r0=0.0)
            Xt = X[::3]; Ft = F[::3]
            down = track(Ft[::-1], Aa, par, [1, 1, 1])[::-1]     # start all-good at the DISC end, move away
            up = track(Ft, Aa, par, [0, 0, 0])                    # start all-bad at the far end, move toward DISC
            fs_good = lib.fullstate_relax(F[::8], Aa, par, start='G')
            res[(edge, norm, rg)] = dict(X=X, F=F, eq=eq, good=rg_good, bad=rg_bad, down=down, up=up,
                                         fs_good=fs_good, Xfs=X[::8], Xt=Xt)
            pickle.dump(res, open('edges.pkl', 'wb'))
            print(edge, norm, rg, f'{time.time()-t0:.0f}s', flush=True)
pickle.dump(res, open('edges.pkl', 'wb'))
