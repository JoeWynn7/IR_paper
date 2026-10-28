"""Shared definitions for summarizing long-run outcomes of the strategy dynamics.

Outcome classes (attractor-based definition)
--------------------------------------------
For every parameter condition studied, each trajectory of the replicator dynamics (with reputations at the
all-good-selected equilibrium) converges either to an attractor with positive cooperation (a vertex, edge or interior
equilibrium, or, for Scoring without inertia, a neutrally stable segment) or to the zero-cooperation set: the ALLD
vertex together with the low-reputation segment of the ALLD-DISC edge, on which DISC players are regarded as bad and
defect, and along which DISC earns slightly less than ALLD so that the dynamics drift (sometimes extremely slowly)
towards the ALLD vertex (Extended Data Figure 8). The *cooperative basin* is the set of initial compositions whose
trajectories converge to an attractor with positive cooperation.

At the end of integration, trajectories in the zero-cooperation class have realized cooperation of at most 7e-4,
whereas trajectories reaching a cooperative attractor have realized cooperation of at least 0.34 in all scans
(0.97-0.98 for nearly all conditions). The numerical classification ``rho_final >= COOPERATIVE_CUT`` with
COOPERATIVE_CUT = 0.01 therefore identifies the attractor; any value inside the observed gap gives the same
classification, and the gap is checked for every condition (defective <= GAP_LOW, cooperative >= GAP_HIGH).

Quantities (per condition, over area-uniform initial compositions)
------------------------------------------------------------------
mean_cooperation          rho_bar   : mean long-run realized cooperation over initial compositions
cooperative_basin         omega_C   : fraction of initial compositions in the cooperative basin
cooperation_cooperative   rho_bar_C : mean long-run cooperation over initial compositions in the cooperative basin
cooperation_defective     rho_bar_D : the same over the remaining initial compositions (zero in the long-time limit)
Identity: rho_bar = omega_C * rho_bar_C + (1 - omega_C) * rho_bar_D.
"""
import numpy as np

COOPERATIVE_CUT = 0.01        # any value in the observed gap (7e-4, 0.34) gives an identical classification
GAP_LOW, GAP_HIGH = 1e-3, 0.3  # gap check: final cooperation <= GAP_LOW (defective) or >= GAP_HIGH (cooperative)


def summarize_outcomes(rho):
    """Summary statistics of final realized cooperation rho (one value per initial composition)."""
    rho = np.asarray(rho, float)
    C = rho >= COOPERATIVE_CUT
    out = dict(n_initial=int(rho.size), mean_cooperation=float(rho.mean()), cooperative_basin=float(C.mean()),
               n_cooperative=int(C.sum()),
               cooperation_cooperative=float(rho[C].mean()) if C.any() else np.nan,
               cooperation_defective=float(rho[~C].mean()) if (~C).any() else np.nan,
               max_final_cooperation_defective=float(rho[~C].max()) if (~C).any() else np.nan,
               min_final_cooperation_cooperative=float(rho[C].min()) if C.any() else np.nan)
    out['outcome_gap_ok'] = bool((np.isnan(out['max_final_cooperation_defective']) or
                                  out['max_final_cooperation_defective'] <= GAP_LOW) and
                                 (np.isnan(out['min_final_cooperation_cooperative']) or
                                  out['min_final_cooperation_cooperative'] >= GAP_HIGH))
    return out


# ---------------------------------------------------------------- pure-DISC resident and rare mutants
NORMS = {'SC': (1., 0.), 'SH': (0., 0.), 'SJ': (0., 1.), 'SS': (1., 1.)}


def response(u, k1, k2, alpha=1.0, beta=1.0):
    """Stationary good-readout probability R(u) of the direct-reset record (k1 warning, k2 recovery states)."""
    u = np.clip(np.asarray(u, float), 0.0, 1.0); v = 1.0 - u
    if alpha == 0.0 and beta == 0.0:
        return u
    Z = v ** k1 + u ** k2 - v ** k1 * u ** k2
    w = sum((alpha * v) ** m for m in range(1, k1 + 1)) if k1 else 0.0 * u
    s = sum(u ** n * (1 - beta ** n) for n in range(1, k2 + 1)) if k2 else 0.0 * u
    return (u ** (k2 + 1) * (1 + w) + v ** (k1 + 1) * s) / Z


def assessment(norm, e1, e2):
    p, q = NORMS[norm]; eps = (1 - e1) * (1 - e2) + e1 * e2
    return eps, p * (eps - e2) + q * (1 - eps - e2) + e2, e2, q * (1 - 2 * e2) + e2


def pure_disc_invasion(norm, k1, k2, alpha=1.0, beta=1.0, b_over_c=5.0, e1=0.02, e2=0.02,
                       relax_dt=0.18, relax_tol=1e-11, max_steps=400000, polish_tol=1e-13, polish_step=1e-6):
    """All-good resident reputation g of a pure DISC population (RK4 relaxation from g = 1, then step-limited
    Newton refinement) and invasion fitnesses of rare ALLD and ALLC (Extended Data Figures 3, 5 and 6)."""
    A = assessment(norm, e1, e2)
    G = lambda g: response(g * g * A[0] + g * (1 - g) * (A[1] + A[2]) + (1 - g) ** 2 * A[3], k1, k2, alpha, beta) - g
    g = 1.0
    for _ in range(max_steps):
        q1 = G(g)
        if abs(q1) <= relax_tol: break
        q2 = G(min(max(g + .5 * relax_dt * q1, 0), 1)); q3 = G(min(max(g + .5 * relax_dt * q2, 0), 1))
        q4 = G(min(max(g + relax_dt * q3, 0), 1))
        g = min(max(g + relax_dt * (q1 + 2 * q2 + 2 * q3 + q4) / 6, 0), 1)
    for _ in range(60):
        val = G(g)
        if abs(val) <= 0.1 * polish_tol: break
        lo, hi = max(g - 1e-7, 0.0), min(g + 1e-7, 1.0); slope = (G(hi) - G(lo)) / (hi - lo)
        if abs(slope) > 1e-12: g = min(max(g + float(np.clip(-val / slope, -polish_step, polish_step)), 0.0), 1.0)
    residual = abs(float(G(g)))
    rC = float(response(g * A[0] + (1 - g) * A[1], k1, k2, alpha, beta))
    rD = float(response(g * A[2] + (1 - g) * A[3], k1, k2, alpha, beta))
    lam_D = (1 - e1) * (b_over_c * rD - (b_over_c - 1) * g)
    lam_C = (1 - e1) * (b_over_c * rC - 1 - (b_over_c - 1) * g)
    return dict(r_DISC_resident=float(g), r_ALLC_mutant=rC, r_ALLD_mutant=rD, lambda_ALLD=float(lam_D),
                lambda_ALLC=float(lam_C), resident_residual=residual)


INVASION_TOL = 1e-10


def locally_protected(lambda_ALLD, lambda_ALLC, tol=INVASION_TOL):
    """Pure DISC excludes rare ALLD and is not invaded by rare ALLC (rule of Extended Data Figures 3 and 5)."""
    return (np.asarray(lambda_ALLD) < -tol) & (np.asarray(lambda_ALLC) <= tol)
