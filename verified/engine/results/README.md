# Scan results

* `summary_<scan>_w<worker>.csv`: one row per condition as written by `scan.py` (integration diagnostics; the outcome columns in these stored files were written with preliminary cuts 0.05 and 0.9 and are superseded: the published tables recompute all outcome quantities from the final states with `analysis.py`, which `scan.py` now also uses).
* `summary_initial_reputation.csv` and `states_initial_reputation/`: output of `initial_reputation.py` (final frequencies, reputations and intended cooperation of every trajectory).
* Per-trajectory final states of the `depth`, `readout` and `ratio` scans (`states_<scan>/`, one file per condition) are not stored here; the same data are archived in compressed form next to each figure table (`*_final_states.npz` in the figure packages). Rerunning `scan.py` recreates them.
