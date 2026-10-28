"""Python interface to irsim.c (compiled on first use with the system C compiler)."""
import ctypes, os, subprocess
import numpy as np

_HERE = os.path.dirname(os.path.abspath(__file__))
_LIB = os.path.join(_HERE, 'libirsim.so')
if not os.path.exists(_LIB) or os.path.getmtime(_LIB) < os.path.getmtime(os.path.join(_HERE, 'irsim.c')):
    subprocess.check_call(['cc', '-O3', '-std=c99', '-shared', '-fPIC', '-o', _LIB,
                           os.path.join(_HERE, 'irsim.c'), '-lm'])
_lib = ctypes.CDLL(_LIB)
_D = ctypes.POINTER(ctypes.c_double)
_lib.api_reputations.argtypes = [_D, ctypes.c_int, _D, _D, ctypes.c_double, _D, _D]
_lib.api_run.argtypes = [_D, ctypes.c_int, ctypes.c_double, ctypes.c_double, ctypes.c_int, _D, ctypes.c_int,
                         _D, ctypes.c_double, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_double, _D, _D]

NORMS = {'SC': (1., 0.), 'SH': (0., 0.), 'SJ': (0., 1.), 'SS': (1., 1.)}
SELECTED_DEPTHS = {'SC': (2, 0), 'SH': (3, 0), 'SJ': (4, 3), 'SS': (1, 2)}

def assessment(norm, e1, e2):
    """Probabilities of a recorded positive assessment: intended C/D toward a recipient read G/B."""
    p, q = NORMS[norm]
    eps = (1 - e1) * (1 - e2) + e1 * e2
    return (eps, p * (eps - e2) + q * (1 - eps - e2) + e2, e2, q * (1 - 2 * e2) + e2)

def params(norm, k1, k2, alpha, beta, e1=0.02, e2=0.02, b=5.0, c=1.0):
    return np.array([*assessment(norm, e1, e2), k1, k2, alpha, beta, e1, b, c], float)

_lib.api_track.argtypes = [_D, ctypes.c_int, _D, _D, ctypes.c_double, ctypes.c_int, ctypes.c_int, ctypes.c_int,
                           ctypes.c_double, ctypes.c_double, _D]

def _ptr(a): return a.ctypes.data_as(_D)

def reputations(p, F, r0=None, tol=1e-12):
    """All-good (or r0-initialized) relaxed reputations (r_ALLC, r_ALLD, r_DISC) at compositions F."""
    F = np.ascontiguousarray(np.atleast_2d(F), float); n = len(F)
    R = np.zeros((n, 3)); res = np.zeros(n)
    r0p = None if r0 is None else _ptr(np.ascontiguousarray(np.broadcast_to(r0, (n, 3)), float))
    _lib.api_reputations(_ptr(np.ascontiguousarray(p, float)), n, _ptr(F), r0p, tol, _ptr(R), _ptr(res))
    return R, res

def run(p, F0, bs=(5.0,), M=120, thr=0.02, tol=1e-11, dt=0.2, chunk=500, max_chunks=400, checks=3, rho_tol=1e-7):
    """Integrate replicator dynamics from initial compositions F0 for each benefit b in bs (c = p[10]).
    Returns array (len(bs), n, 9): final f (3), r (3), intended cooperation, steps, final max|f_dot|;
    and info: max lattice residual, flagged cells, exact evaluations, total cells."""
    F0 = np.ascontiguousarray(np.atleast_2d(F0), float); n = len(F0)
    bs = np.ascontiguousarray(np.atleast_1d(bs), float)
    out = np.zeros((len(bs), n, 9)); info = np.zeros(4)
    _lib.api_run(_ptr(np.ascontiguousarray(p, float)), M, thr, tol, len(bs), _ptr(bs), n, _ptr(F0), dt, chunk,
                 max_chunks, checks, rho_tol, _ptr(out), _ptr(info))
    return out, info

def halton_shifted(n=512, seed=2026):
    """Area-uniform shifted-Halton sample of the strategy simplex (Figure 4 / ED6 sampling design)."""
    shift = np.random.RandomState(seed).random_sample(2)
    idx = np.arange(1, n + 1); coords = []
    for base in (2, 3):
        rem = idx.copy(); vals = np.zeros(n); fac = 1. / base
        while np.any(rem):
            vals += fac * (rem % base); rem //= base; fac /= base
        coords.append(vals)
    uv = (np.column_stack(coords) + shift) % 1.0
    refl = uv.sum(1) > 1; uv[refl] = 1 - uv[refl]
    return np.column_stack((uv[:, 0], uv[:, 1], 1 - uv.sum(1)))

def sobol_scrambled(n=512, seed=2026):
    """Area-uniform scrambled-Sobol sample of the strategy simplex (ED4 sampling design)."""
    from scipy.stats import qmc
    uv = qmc.Sobol(2, scramble=True, seed=int(seed)).random_base2(int(np.log2(n)))
    refl = uv.sum(1) > 1; uv[refl] = 1 - uv[refl]
    return np.column_stack((uv, 1 - uv.sum(1)))

def run_tracking(p, F0, r0=1.0, dt=0.2, chunk=500, max_chunks=400, checks=3, rho_tol=1e-7, tol=1e-11):
    """Robustness protocol: reputations initialized once (all-good r0=1 or all-bad r0=0) at t = 0 and then
    followed quasi-statically along the trajectory. Returns array (n, 9) as in run()."""
    F0 = np.ascontiguousarray(np.atleast_2d(F0), float); n = len(F0)
    R0 = np.ascontiguousarray(np.broadcast_to(np.asarray(r0, float), (n, 3)), float)
    out = np.zeros((n, 9))
    _lib.api_track(_ptr(np.ascontiguousarray(p, float)), n, _ptr(F0), _ptr(R0), dt, chunk, max_chunks, checks,
                   rho_tol, tol, _ptr(out))
    return out
