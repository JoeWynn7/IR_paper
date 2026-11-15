# Numerical checks for revision 3

Independent Python scripts (NumPy and SciPy only) that were used to check the formulas and to compute the new numbers in `Manuscript_full_20261114.tex`. They are not part of the verified package.

| Script | What it checks |
|---|---|
| `verify.py` | Recomputes Supplementary Tables S9 and S13 and the worked example (resident reputations, thresholds, δ_c), and checks the closed forms, derivatives and expansions of the aggregation and score maps. Also defines the model functions used by the other scripts. |
| `chk2.py` | Duality (Lemma S3), monotonicity of the map in u (numerical), the derivative formula (Proposition S5), the boundary expansions (Proposition S6) and F′(1) = (1 − α)(2 − p) − 1. |
| `filt.py` | Proposition S20, R′(1) = P₁, on 300 random finite-state filters. |
| `edge.py`, `edge2.py` | Invasion by ALLC at α = 0.8: R_U, the slope parameter, and the stable equilibrium on the ALLC–DISC edge with the growth rate of rare ALLD (Supplementary Table S11). |
| `fig3_equilibria.py` | Cooperation rates at the equilibria labelled in Fig. 3 (Supplementary Table S8): intended cooperation f_ALLC + f_DISC × r̄, where r̄ is the probability that a DISC donor intends to cooperate. Compares with the verified `equilibria.csv`. |

Run from this directory, for example `python3 verify.py`. `edge.py` and `edge2.py` take a few minutes.
