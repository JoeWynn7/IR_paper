# Figure 5 and Extended Data Figure 7

This package contains two executed notebooks, numerical data, and 13 figures, each exported as PDF and SVG. All notebook text and comments are in English, and the notebooks use paths relative to this directory.

Start with [Results_Figure5_and_ED7.md](Results_Figure5_and_ED7.md) for the model, figure conventions, numerical findings, interpretation limits, and a handoff paragraph for a new conversation.

| Notebook | Contents |
|---|---|
| [Figure5_Opportunistic_Invasion.ipynb](Figure5_Opportunistic_Invasion.ipynb) | Two individual panels and one composite for manuscript Figure 5. |
| [Extended_Data_Figure7.ipynb](Extended_Data_Figure7.ipynb) | The cross-norm strip panel, eight one-step/multi-step maps, and one composite. |

Run the notebooks from this directory using Python 3.11 and the packages in `requirements.txt`. By default they load supplied external data and perform small checks; they do not repeat the complete parameter scans. `RECOMPUTE=True` explicitly repeats the displayed calculations and may be expensive. Keep a separate copy of the supplied data before regeneration.

## Scope and important distinctions

- Both figures test an independent, identically distributed (IID) O-DISC family. A mutant independently skips an intended cooperative act toward an individually perceived good recipient with probability $\delta$. These figures do not use the separately excluded time-correlated or persistent opportunism variants.
- Figure 5 shows normalized mutant payoff advantages for SJ and a readout scan at $b/c=5$. The full one-step mechanism has a narrow positive-invasion window near $\delta=0$, even though it is difficult to see at the plotted scale.
- ED7 shows intended resident cooperation in green; black outlines indicate resistance to the tested IID O-DISC family. They do not establish resistance to every mutant. The first rows of the original result set also contained an alternative invasion-window background; only the cooperation-background version was selected for the final ED7.
- Some lower boundaries are resident-branch folds and are excluded. The original assembled figure's uniformly closed-interval legend is not valid for those boundaries. Current strip panels mark excluded fold endpoints with open circles; endpoint flags are retained in the data.

## Data and verification

`data/figure5/` contains the five complete invasion curves, readout scan, summary and boundary tables, validation records, and original-source copies. The saved multistep alpha-by-delta map is retained under `source/` for verification. `data/extended_data_figure7/` contains eight parameter fields and their profile, interval, reference, and validation tables. `data/comparison/` contains the previously published ED6 reference row used to distinguish ALLC invasion from IID O-DISC invasion.

`validation/` records default notebook execution, saved-data checks, limited numerical recalculations, and figure checks. `manifest.csv` lists relative paths, file sizes, and SHA-256 hashes. No complete alpha-benefit scan was rerun for this release. The original research files were not overwritten.

The historical notebook names are `figure6_opportunistic_two_panel_bc5.ipynb` for manuscript Figure 5 and `figure5_ED_robustness_two_versions.ipynb` for ED7. The latter name encompasses different plotting backgrounds as well as the one-step and multi-step comparisons; the present package follows the final cooperation-background assembly. Original source identities are recorded in [data/source_manifest.csv](data/source_manifest.csv).
