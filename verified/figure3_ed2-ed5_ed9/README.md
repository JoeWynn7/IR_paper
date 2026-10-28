# Figure 3 and Extended Data Figures 2, 3, 4, 5 and 9

Reference parameters unless an axis varies them: $b/c=5$, $e_1=e_2=0.02$; reputations relaxed from all-good at every composition; selected multi-step depths SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$ with $\alpha=\beta=1$.

| Notebook | Figure(s) | Output folders |
|---|---|---|
| `Figure3_Simplex_Dynamics.ipynb` | Figure 3 (12 simplexes); simplex panels of ED3 (tolerance-only $(\alpha,\beta)=(1,0)$ and strictness-only $(0,1)$) | `figures/figure3/`, `figures/ed3_simplex/` |
| `Extended_Data_Figure2.ipynb` | ED2 (revised): homogeneous-DISC reputation drift (a–d) and population-level all-good versus all-bad initial reputations (e). ED9: former ED2 rows 2–3, the one-step readout plane and the full-readout depth plane of the highest stable homogeneous-DISC reputation | `figures/extended_data_figure2/`, `figures/extended_data_figure9/` |
| `Extended_Data_Figure3_Planes.ipynb` | ED3 readout planes: mean long-run cooperation (41×41) and local invasion of pure DISC (801×801) | `figures/extended_data_figure3_planes/` |
| `Extended_Data_Figure4.ipynb` | ED4: mean long-run cooperation versus $b/c$ (8×512 initial compositions per point) | `figures/extended_data_figure4/` |
| `Extended_Data_Figure5.ipynb` | ED5: invasion classes over $(e_1,e_2)$ (241×241) | `figures/extended_data_figure5/` |

Combined figures and every single panel are saved as PDF and SVG; the revised ED2 and ED9 are also saved as 300-dpi PNG and follow the typography of the assembled manuscript figures.

## Data

| Folder | Content | Status |
|---|---|---|
| `data/simplex_dynamics/` | Twenty replicator fields with all-good reputations (residual $\le10^{-12}$), equilibria, neutral-segment diagnostics, comparison with the earlier solver | Verified, unchanged |
| `data/extended_data_figure2/` | Homogeneous-DISC roots and planes; drift curves; `population_initial_reputation.csv` (panel e) | Roots and planes unchanged; panel-e table new |
| `data/extended_data_figure3_planes/` | `cooperation_readout_plane.csv` (+ final states), `ESS_<norm>.npz` invasion grids, `invasion_grid_summary.csv` | Regenerated |
| `data/extended_data_figure4/` | `benefit_cost_scan.csv` (+ final states), `invasion_thresholds.csv` | Regenerated |
| `data/extended_data_figure5/` | Twelve 241×241 grids with refined resident roots, `grid_summary.csv`, `metadata.json` | Corrected and regenerated |
| `*/previous_version/` | Superseded tables kept for comparison | — |

Sampled-cooperation tables are produced by `../engine/scan.py` and `../engine/postprocess.py`; quantities and outcome classes are defined in `../engine/analysis.py`. Invasion classification (ED3, ED5): ALLD is not excluded if $\lambda_{\rm ALLD}\ge-10^{-10}$; otherwise ALLC invades if $\lambda_{\rm ALLC}>10^{-10}$; otherwise DISC resists both, with resident roots refined to a residual $\le10^{-13}$.

`previous_version/` contains the earlier package README, results guide (`Results_Figure3_and_ED2_to_ED5.md`), numerical-change notes (`NUMERICAL_CHANGES.md`, `Simplex_Solver_Changes.md`, which still describe the simplex-solver correction and the ED3 repairs of the earlier release), validation records and manifest. Numerical values in the earlier results guide that concern ED3 cooperation, ED4 and ED5 are superseded; see `../VERIFICATION_REPORT.md`.
