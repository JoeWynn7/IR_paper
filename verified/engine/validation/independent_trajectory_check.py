"""Independent per-trajectory check (numpy library of the fold analysis): reputations re-relaxed exactly from
all-good at every evaluation; midpoint rule dt=0.4; stop when max|f_dot|<1e-9 or after T=8000.
Compares the final outcome of selected starts with the C engine."""
import sys, time, numpy as np
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parents[2] / 'analysis' / 'fold_branch_analysis' / 'code')); import lib
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parents[1])); import irsim
norm, a, b, n_each = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4])
F0 = irsim.halton_shifted(512, 2026)
p = irsim.params(norm, 1, 1, a, b); out, _ = irsim.run(p, F0); rc = 0.98 * out[0][:, 6]
coop, defe = np.flatnonzero(rc >= 1e-3), np.flatnonzero(rc < 1e-3)
rng = np.random.default_rng(0)
sel = np.r_[rng.choice(coop, min(n_each, len(coop)), replace=False), rng.choice(defe, min(n_each, len(defe)), replace=False)]
Aa = lib.A(norm); par = (1, 1, a, b)
def field(f):
    r, _ = lib.relax(f, Aa, par, r0=1.0, tol=1e-10, dt=0.25)
    g = np.sum(f * r, 1)
    pi = (1 - lib.E1) * np.column_stack([lib.B * (f[:, 0] + f[:, 2] * r[:, 0]) - lib.C,
                                          lib.B * (f[:, 0] + f[:, 2] * r[:, 1]),
                                          lib.B * (f[:, 0] + f[:, 2] * r[:, 2]) - lib.C * g])
    return f * (pi - np.sum(f * pi, 1, keepdims=True)), r
f = F0[sel].copy(); dt = 0.4; t0 = time.time()
for step in range(20000):
    k, _ = field(f)
    if np.abs(k).max() < 1e-9: break
    fm = np.clip(f + .5 * dt * k, 0, None); fm /= fm.sum(1, keepdims=True)
    k2, _ = field(fm); f = np.clip(f + dt * k2, 0, None); f /= f.sum(1, keepdims=True)
_, r = field(f); rho = (1 - lib.E1) * (f[:, 0] + f[:, 2] * np.sum(f * r, 1))
agree = ((rho >= 1e-3) == (rc[sel] >= 1e-3))
print(norm, a, b, 'starts', len(sel), 'agreement', int(agree.sum()), '/', len(sel), 'steps', step, '%.0fs' % (time.time() - t0))
for i, j in enumerate(sel):
    print('  start', F0[j].round(3), 'engine rho %.4f' % rc[j], 'numpy rho %.4f' % rho[i], 'final f', f[i].round(3))
