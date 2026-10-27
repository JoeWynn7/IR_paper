# Figure 4 and Extended Data Figure 6

This package contains two executed publication notebooks, their numerical data, and ten figures, each exported as PDF and SVG. Text and comments are in English. The original research files remain unchanged.

Start with [Results_Figure4_and_ED6.md](Results_Figure4_and_ED6.md) for the research question, figure conventions, numerical examples, brief interpretation, and a handoff paragraph for a new conversation.

| Notebook | Outputs |
|---|---|
| [Figure4_Total_Depth.ipynb](Figure4_Total_Depth.ipynb) | Four norm panels and a combined 2-by-2 figure, using all 180 allocations at total depths 0-8. |
| [Extended_Data_Figure6.ipynb](Extended_Data_Figure6.ipynb) | Four norm panels and a combined figure, using 256 depth pairs with each depth from 0 to 7. |

Run the notebooks from this directory with Python 3.11 and the packages in `requirements.txt`. Default execution loads the external tables. No private-machine path or historical Python module is required. Missing data raise an error; they do not automatically trigger a scan. `RECOMPUTE=True` explicitly regenerates the displayed scan and can be expensive.

## Data and numerical status

- `data/figure4/`: the current 180-row table, 36 observed allocation maxima, settings, and the unchanged original 264-row source table under `source/`.
- `data/extended_data_figure6/`: the current 256-row table, summary, settings, and the unchanged original table under `source/`.
- `data/repairs/`: three accepted current-environment recalculations, original/new comparisons, chunk histories, and saved initial compositions, mesh fields, and trajectory endpoints.
- `validation/`: execution, numerical, source-integrity, and export checks. `manifest.csv` records relative paths, file sizes, and SHA-256 checksums.

Three shared one-step conditions, SC/SH/SS at (1,1), originally failed the ensemble-mean stability gate. They were recalculated with the identified source shifted-Halton sampler and extended horizon, as authorized. The old interpolation environment is unavailable, and reconstructed trajectories do not reproduce every original 32,000-step value exactly. They are documented reconstructions, not exact continuation of archived trajectories.

All displayed rows now pass the source mean-change gate. This does not mean every strategy trajectory has converged: the gate checks the ensemble mean, and residual quantiles are retained separately. Only the three failed conditions were rerun; the complete scans were not repeated. Figure 4 excludes original K=9,10 rows, including the separate failed SH (2,8) condition at K=10.

The depth scan uses one shifted-Halton initial-composition sample. It must not be described as the eight repeated Sobol samples used in ED4 of the preceding package. Both current figures report realized cooperation. ED6 hatching uses strict negative payoff advantages for rare ALLD and ALLC in pure DISC; it is a local test against these two strategies.

The source notebooks were `Fig5_total_depth_best_allocations.ipynb` (the historical name for manuscript Figure 4) and the final appended blue-heatmap cells of `28_k1_k2_discrete_cooperation_ess.ipynb`. Their relevant numerical functions are included in the new notebooks. Source names and hashes are recorded in [data/source_manifest.csv](data/source_manifest.csv).
