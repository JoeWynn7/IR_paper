# Figure 2 and Extended Data Figure 1

Two self-contained notebooks generate the panels, combined figures, and numerical tables. All file paths are relative to the current working directory.

Panel definitions and a brief interpretation are provided in [Results_Figure2_and_ED1.md](Results_Figure2_and_ED1.md).

## Run

Use Python 3.11 with the packages in `requirements.txt`. Open the notebooks from this directory and run their cells in order. The supplied data are used by default; no raw data are embedded in the notebook source.

- `Figure2.ipynb`: 12 reputation-matrix panels, four depth-plane panels, and one combined figure.
- `Extended_Data_Figure1.ipynb`: four recognition panels, four threshold-selection panels, and one combined figure.

Figures are saved only as PDF and SVG in `figures/figure2/` and `figures/extended_data_figure1/`. Numerical data and configurations are stored in the corresponding subdirectories of `data/`.

## Simulation settings

| Analysis | Population and sampling |
|---|---|
| Figure 2 matrices | 30 individuals per strategy; 1,000 sweeps; seed 2027 for each case. |
| Figure 2 depth plane | 50 individuals per strategy; depths 0-6; one replicate per condition; base seed 2027; 1,000 sweeps, burn-in 800, sampling interval 5. |
| Extended Data Figure 1 | 50 individuals per strategy; depths 0-6; 30 replicates per condition; base seed 20260918. Most runs use 1,000 sweeps; extended sampling windows are retained in the raw table. |

Both analyses use direct-reset private records, independently sampled readouts, self-images, and independently selected DISC observers. Implementation and assessment errors are both 0.02. Multi-step matrix depths are SC (2,0), SH (3,0), SJ (4,3), and SS (1,2).

The depth-plane data and the repeated recognition data are separate experiments. Their sample sizes must be reported separately.

## Regenerate simulation data

- In `Figure2.ipynb`, set `RECOMPUTE_MATRICES=True` to simulate the 12 snapshots. Set `RECOMPUTE_DEPTH_SCAN=True` to repeat the 196-condition depth scan.
- In `Extended_Data_Figure1.ipynb`, set `RECOMPUTE=True` to repeat the recognition simulations and extend cases that fail the drift criterion.

The full depth scan and repeated recognition simulations are computationally intensive. Missing or incompatible input data raise an error rather than triggering simulations automatically. Regeneration writes to the same relative output directories, so retain a separate copy of supplied data before replacing them.

## Data

- Matrix NPZ files contain the internal state and binary readout arrays used for the figures, with parameters in `snapshot_config.json`.
- The Figure 2 depth-plane CSV files contain replicate-level values, summary statistics, and the plotting configuration.
- `recognition_raw.csv` contains 5,880 replicate-level records, including actual run lengths, sampling windows, and half-window drift values. The notebook regenerates summary statistics, selected architectures, and threshold sensitivity from this external table.
- Bootstrap uncertainty uses 2,000 resamples of independent replicate means and seed 2026091801. The selection rule minimizes total depth after imposing the specified separation and disagreement criteria.

The notebooks have been executed with the supplied data. The 12 matrix simulations were also regenerated. Full depth and repeated-recognition simulations were not rerun for this release.
