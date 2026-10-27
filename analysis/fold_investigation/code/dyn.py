"""Strategy dynamics under alternative reputation-selection rules.
rule='track'  : fast-slow tracking. At t=0 reputations relax fully from r0 (all-good=1 or all-bad=0) at the
                initial composition; afterwards they follow the auxiliary flow with n_inner RK4 steps of size h
                per strategy step (timescale ratio eps = dt/(n_inner*h)); a branch is lost only at a fold.
rule='reinit' : the repository convention: at every evaluated composition reputations are re-relaxed from r0.
                Implemented exactly (vectorized relaxation each evaluation, warm-started from r0)."""
import numpy as np, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import lib

def normalize(f):
    f = np.maximum(f, 0); return f / f.sum(1, keepdims=True)

def run(norm, regime, f0, rule='track', r0=1.0, dt=0.1, T=3000., n_inner=4, h=0.5,
        jump_window=50, record_every=50):
    Aa = lib.A(norm); par = lib.cond(norm, regime)
    f = normalize(np.array(f0, float))
    r, _ = lib.relax(f, Aa, par, r0=r0, tol=1e-11)
    r_init = r.copy()
    nsteps = int(round(T / dt))
    hist_R = []; drop = np.zeros(len(f)); rise = np.zeros(len(f))
    t_drop = np.full(len(f), np.nan); f_drop = np.full((len(f), 3), np.nan)
    window = []
    prev_f = f.copy(); prev_r = r[:, 2].copy()
    jumps = np.zeros(len(f), int); jump_down = np.zeros(len(f), int); jump_up = np.zeros(len(f), int)
    f_jump = np.full((len(f), 3), np.nan); t_jump = np.full(len(f), np.nan)
    for step in range(nsteps):
        if step % 10 == 0 and step > 0:
            dr = r[:, 2] - prev_r; dfn = np.abs(f - prev_f).max(1)
            jmp = (np.abs(dr) > 0.15) & (dfn < 0.01)
            newj = jmp & np.isnan(t_jump)
            t_jump[newj] = step * dt; f_jump[newj] = f[newj]
            jump_down += jmp & (dr < 0); jump_up += jmp & (dr > 0)
            prev_f = f.copy(); prev_r = r[:, 2].copy()
        if rule == 'track':
            for _ in range(n_inner):
                k1 = lib.aux_rhs(r, f, Aa, par); k2 = lib.aux_rhs(np.clip(r+.5*h*k1,0,1), f, Aa, par)
                k3 = lib.aux_rhs(np.clip(r+.5*h*k2,0,1), f, Aa, par); k4 = lib.aux_rhs(np.clip(r+h*k3,0,1), f, Aa, par)
                r = np.clip(r + h*(k1+2*k2+2*k3+k4)/6, 0, 1)
        else:
            r, _ = lib.relax(f, Aa, par, r0=r0, tol=1e-10, dt=0.5)
        # midpoint strategy step with reputations held at the fast equilibrium value
        k = lib.replicator(f, r); fm = normalize(f + .5*dt*k)
        if rule == 'reinit':
            rm, _ = lib.relax(fm, Aa, par, r0=r0, tol=1e-10, dt=0.5)
        else:
            rm = r
        f = normalize(f + dt*lib.replicator(fm, rm))
        if step % record_every == 0:
            hist_R.append(r[:, 2].copy())
            window.append(r[:, 2].copy())
            if len(window) > jump_window // record_every + 1: window.pop(0)
            d = window[0] - r[:, 2]; u = r[:, 2] - window[0]
            newdrop = (d > drop)
            first = newdrop & (d > 0.2) & np.isnan(t_drop)
            t_drop[first] = step*dt; f_drop[first] = f[first]
            drop = np.maximum(drop, d); rise = np.maximum(rise, u)
    coop = lib.coop_real(f, r)
    res = np.max(np.abs(lib.replicator(f, r)), 1)
    return dict(f=f, r=r, coop=coop, r_init=r_init, drop=drop, rise=rise, t_drop=t_drop, f_drop=f_drop,
                residual=res, hist=np.array(hist_R), jump_down=jump_down, jump_up=jump_up, t_jump=t_jump, f_jump=f_jump)
