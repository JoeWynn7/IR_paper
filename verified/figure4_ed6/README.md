# Figure 4 and Extended Data Figure 6

Mean long-run cooperation as a function of the depths $(k_1,k_2)$ of the direct-reset record (full readout, $b/c=5$, $e_1=e_2=0.02$; 512 shifted-Halton initial compositions, seed 2026).

| Notebook | Outputs |
|---|---|
| `Figure4_Total_Depth.ipynb` | Figure 4: all 180 allocations with $k_1+k_2\le8$; four norm panels and a combined figure (`figures/figure4/`). |
| `Extended_Data_Figure6.ipynb` | Extended Data Figure 6: all 256 pairs with $0\le k_1,k_2\le7$; four norm panels and a combined figure (`figures/extended_data_figure6/`). |

## Data

* `data/figure4/total_depth_results.csv` and `data/extended_data_figure6/depth_plane_results.csv`: one row per condition with the mean long-run cooperation $\bar\rho$ (`mean_cooperation`), the cooperative-basin fraction $\omega_C$ (`cooperative_basin`), the conditional cooperation levels $\bar\rho_C$, $\bar\rho_D$, the outcome-gap check, integration diagnostics, and the pure-DISC invasion fitnesses and local-protection flag.
* `*_final_states.npz`: final strategy frequencies and realized cooperation of every trajectory, from which all summary columns can be recomputed.
* `data/figure4/best_allocations.csv`: allocation with the largest $\bar\rho$ at each total depth.
* `data/previous_version/`: the earlier tables (interpolated replicator field on a resolution-23 mesh, cooperative class defined by $\rho\ge0.5$), the earlier repair records and source manifest, retained for comparison only.

Both tables are produced by `../engine/scan.py depth` and `../engine/postprocess.py depth`; each notebook can also regenerate its own table with `RECOMPUTE=True`. Quantities and outcome classes are defined in `../engine/analysis.py`; numerical methods are described in `../engine/README.md`; changes relative to the previous version are documented in `../VERIFICATION_REPORT.md`.

`previous_version/Results_Figure4_and_ED6.md` is the earlier results guide. Its numerical values refer to the previous data and are superseded.
