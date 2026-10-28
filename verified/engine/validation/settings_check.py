"""Sensitivity of mean long-run cooperation to the numerical settings of the engine (512 shifted-Halton starts,
b/c = 5): default settings (lattice M = 120, threshold 0.02, dt = 0.2, 500-step intervals, rho tolerance 1e-7)
versus refined settings (M = 160, threshold 0.01, dt = 0.1, 1000-step intervals, rho tolerance 1e-8)."""
import sys, time
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[1])); import irsim, analysis
F0 = irsim.halton_shifted(512, 2026)
for norm, arch in [('SH', (1, 1, 1., 1.)), ('SJ', (1, 1, 1., 1.)), ('SC', (2, 0, 1., 1.)), ('SS', (0, 0, 0., 0.))]:
    p = irsim.params(norm, *arch)
    t = time.time(); a, _ = irsim.run(p, F0); ta = time.time() - t
    t = time.time(); b, _ = irsim.run(p, F0, M=160, thr=0.01, dt=0.1, chunk=1000, max_chunks=400, rho_tol=1e-8); tb = time.time() - t
    ra, rb = 0.98 * a[0][:, 6], 0.98 * b[0][:, 6]
    sa, sb = analysis.summarize_outcomes(ra), analysis.summarize_outcomes(rb)
    print(f"{norm} {arch[:2]}: mean cooperation {sa['mean_cooperation']:.6f} (default) vs {sb['mean_cooperation']:.6f} (refined); "
          f"difference {abs(sa['mean_cooperation'] - sb['mean_cooperation']):.1e}; outcome classes differ for "
          f"{int(((ra >= analysis.COOPERATIVE_CUT) != (rb >= analysis.COOPERATIVE_CUT)).sum())} of 512 starts; {ta:.0f}s / {tb:.0f}s", flush=True)
