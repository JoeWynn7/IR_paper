import ctypes, numpy as np, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import lib
_l = ctypes.CDLL(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'libfpsim.so'))
D = ctypes.POINTER(ctypes.c_double); I = ctypes.POINTER(ctypes.c_int)
_l.simulate.restype = ctypes.c_int
_l.simulate.argtypes = [ctypes.c_int]*3 + [ctypes.c_double]*4 + [ctypes.c_int, D, I, I, ctypes.c_int,
                        ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_uint64, D, ctypes.c_int]
def run(norm, par, nR, nC, nD, init='G', sweeps=1000, burn=800, every=5, seed=1):
    k1, k2, a, b = par
    P, M, sig = lib.chain(*par)
    p, q = lib.NORMS[norm]
    N = nR + nC + nD; eps = nR * N
    total, burnin, inter = int(sweeps*eps), int(burn*eps), int(every*eps)
    maxs = (total - burnin)//inter + 2
    out = np.zeros(3*maxs)
    sig = np.ascontiguousarray(sig, float); P = np.ascontiguousarray(P, np.int32); M = np.ascontiguousarray(M, np.int32)
    ns = _l.simulate(nR, nC, nD, p, q, lib.E1, lib.E2, len(sig), sig.ctypes.data_as(D), P.ctypes.data_as(I),
                     M.ctypes.data_as(I), 0 if init == 'G' else k1+1, total, burnin, inter, seed,
                     out.ctypes.data_as(D), maxs)
    return out[:3*ns].reshape(ns, 3)   # columns g_DISC, g_ALLC, g_ALLD
