# Verified computational materials

This folder is the complete, self-contained verified version of the computational project behind the manuscript: code, notebooks, data, figures and supporting tables for every figure, including analyses that required no change. The earlier materials are preserved unchanged in `../code-and-figures/` and `../Main_Figure/`; superseded files that are useful for comparison are also kept inside this folder under `previous_version/` subfolders.

Main-model convention (unchanged): at each strategy composition, reputations are initialized from the all-good state and relaxed to the corresponding equilibrium. Analyses with other initial reputations are robustness analyses (Extended Data Figure 2e).

Reference parameters: $b/c=5$, $e_1=e_2=0.02$; selected multi-step depths SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$ with $\alpha=\beta=1$; one-step inertia $(1,1)$ with $\alpha=\beta=1$; no inertia $\mathcal R(u)=u$.

## Structure

```
verified/
├── README.md                     this file
├── VERIFICATION_REPORT.md        what was checked, what was corrected, old versus new values, definitions
├── Model.md                      model description (unchanged copy)
├── engine/                       verified strategy-dynamics engine (C + Python), scan scripts, raw scan results
├── figure2_ed1/                  Figure 2, Extended Data Figure 1 (finite-population simulations)
├── figure3_ed2-ed5_ed9/          Figure 3, Extended Data Figures 2, 3, 4, 5 and 9
├── figure4_ed6/                  Figure 4, Extended Data Figure 6
├── figure5_ed7/                  Figure 5, Extended Data Figure 7
├── ed8_reputation_geometry/      Extended Data Figure 8 (new)
└── analysis/
    ├── basin_decomposition/      cooperative-basin size versus cooperation level (tables, script)
    └── fold_branch_analysis/     fold and branch-selection analysis (report and scripts)
```

Each figure package contains its notebooks, `data/`, `figures/` (PDF and SVG for every panel and combined figure) and `requirements.txt`. Notebooks load saved data by default and regenerate them when their `RECOMPUTE` flag is set. Sampled-cooperation data are produced by the engine (`engine/README.md`).

| Figure | Notebook | Status |
|---|---|---|
| Figure 2, ED1 | `figure2_ed1/Figure2.ipynb`, `Extended_Data_Figure1.ipynb` | Verified, unchanged (data and figures identical to the previous release) |
| Figure 3, ED3 simplexes | `figure3_ed2-ed5_ed9/Figure3_Simplex_Dynamics.ipynb` | Verified, unchanged |
| ED2 (revised) and ED9 (new, former ED2 rows 2–3) | `figure3_ed2-ed5_ed9/Extended_Data_Figure2.ipynb` | Panels a–d and ED9 data unchanged; panel e new; layout revised |
| ED3 planes | `figure3_ed2-ed5_ed9/Extended_Data_Figure3_Planes.ipynb` | Cooperation plane regenerated; invasion grids regenerated (one cell changes class) |
| ED4 | `figure3_ed2-ed5_ed9/Extended_Data_Figure4.ipynb` | Regenerated |
| ED5 | `figure3_ed2-ed5_ed9/Extended_Data_Figure5.ipynb` | Corrected (resident-root accuracy) and regenerated |
| Figure 4, ED6 | `figure4_ed6/Figure4_Total_Depth.ipynb`, `Extended_Data_Figure6.ipynb` | Regenerated |
| Figure 5, ED7 | `figure5_ed7/Figure5_Opportunistic_Invasion.ipynb`, `Extended_Data_Figure7.ipynb` | Verified, unchanged |
| ED8 (new) | `ed8_reputation_geometry/Extended_Data_Figure8.ipynb` | New |

Whether conclusions changed, and every numerical value that changed, is documented in `VERIFICATION_REPORT.md`.

## Running

Python 3.11 or later with NumPy, pandas, SciPy and Matplotlib; a C99 compiler for `engine/irsim.c` (compiled automatically on first use); Numba for regenerating the simulations of Figure 2/ED1 and the fields of Figure 3. Run each notebook from its own directory. The verification was carried out with Python 3.13.17, NumPy 2.5.3, pandas 3.0.5, SciPy 1.18.1, Matplotlib 3.11.2 and GCC 13.3. Numba was not available in the verification environment; notebooks that use it were executed in load-only mode with a stand-in that runs the same functions as plain Python (results identical to the saved data).

`MANIFEST.csv` lists every file with its size and SHA-256 checksum.
