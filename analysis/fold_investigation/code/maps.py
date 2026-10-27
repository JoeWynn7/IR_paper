import sys, pickle, time, numpy as np
sys.path.insert(0, '.'); import lib
M = 80
pts = np.array([(i/M, j/M, 1-(i+j)/M) for i in range(M+1) for j in range(M+1-i)])
pts = pts[pts[:, 2] > 1e-9]          # f_DISC > 0 (scan reduction needs f_R>0)
out = {'pts': pts}; t0 = time.time()
for norm in lib.NORMS:
    Aa = lib.A(norm)
    for rg in ['none', 'one', 'multi']:
        par = lib.cond(norm, rg)
        eq = lib.scan_equilibria(pts, Aa, par, nbar=3001)
        good, resg = lib.relax(pts, Aa, par, r0=1.0)
        bad, resb = lib.relax(pts, Aa, par, r0=0.0)
        nst = np.array([(e[:, 4] < -1e-9).sum() for e in eq])
        hi = np.array([e[e[:, 4] < -1e-9, 3].max() if (e[:, 4] < -1e-9).any() else np.nan for e in eq])
        lo = np.array([e[e[:, 4] < -1e-9, 3].min() if (e[:, 4] < -1e-9).any() else np.nan for e in eq])
        out[(norm, rg)] = dict(eq=eq, good=good, bad=bad, nst=nst, hi=hi, lo=lo, resg=resg, resb=resb)
        print(norm, rg, 'max stable', nst.max(), 'bistable pts', (nst >= 2).sum(),
              'good!=highest', np.sum(np.abs(good[:, 2]-hi) > 1e-6), f'{time.time()-t0:.0f}s', flush=True)
pickle.dump(out, open('maps.pkl', 'wb'))
