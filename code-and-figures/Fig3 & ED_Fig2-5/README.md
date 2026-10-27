# Figure 3 and Extended Data Figures 2-5

The five notebooks generate individual panels, combined figures, and external numerical data. Run them from this directory with Python 3.11 and the packages in `requirements.txt`. The supplied data are loaded by default. All exported figures are PDF and SVG.

For an explanation of the figures and a concise analysis for a new conversation, read [Results_Figure3_and_ED2_to_ED5.md](Results_Figure3_and_ED2_to_ED5.md). It includes a figure map, definitions, numerical examples, interpretation limits, and a ready-to-use handoff paragraph.

| Notebook | Contents | Figure pairs (PDF + SVG) |
|---|---|---:|
| [Figure3_Simplex_Dynamics.ipynb](Figure3_Simplex_Dynamics.ipynb) | Main Figure 3: 12 simplexes and one combined figure. ED3 first two rows: eight simplexes and one combined figure. | 22 |
| [Extended_Data_Figure2.ipynb](Extended_Data_Figure2.ipynb) | Twelve all-DISC reputation panels and one combined figure. | 13 |
| [Extended_Data_Figure3_Planes.ipynb](Extended_Data_Figure3_Planes.ipynb) | ED3 third and fourth rows: four cooperation planes, four invasion planes, and one combined figure. | 9 |
| [Extended_Data_Figure4.ipynb](Extended_Data_Figure4.ipynb) | Four benefit-to-cost panels and one combined figure. | 5 |
| [Extended_Data_Figure5.ipynb](Extended_Data_Figure5.ipynb) | Twelve error-plane panels and one combined figure. | 13 |

There are 56 individual panels and six combined figures, each in both formats. ED3 is supplied as two separately reproducible blocks. The simplex figures contain vector fields and equilibrium markers, without manually drawn basin shading.

## Numerical corrections

The model and parameters are retained. Two numerical issues were corrected before plotting:

1. Simplex reputations now use continuous all-good relaxation with an explicit residual gate, rather than the original synchronous fixed-point iteration. All 20 displayed settings were recalculated. The earlier and corrected fields are saved together for comparison.
2. The saved 801-by-801 invasion planes contained 181 points marked as unconverged. These points were repaired with residual-checked scalar self-consistency roots and independent branch checks. Seven invasion classifications changed. The other original grid values are retained.

These changes are scientifically relevant numerical corrections, not a claim that the older figures are reproduced unchanged. Read [NUMERICAL_CHANGES.md](NUMERICAL_CHANGES.md) before reusing previous descriptions of the direction fields or invasion boundaries.

The detailed simplex comparison is in [Simplex_Solver_Changes.md](Simplex_Solver_Changes.md). File sizes and SHA-256 checksums are listed in `manifest.csv`; the final verification scope is recorded in [validation/release_checks.json](validation/release_checks.json).

## Settings and figure conventions

Unless an axis varies the parameter, the calculations use $b/c=5$ and $e_1=e_2=0.02$, with initially good reputations. The representative multi-step depths are SC (2,0), SH (3,0), SJ (4,3), and SS (1,2).

- Main Figure 3 rows: instantaneous updating, full one-step inertia, and selected full multi-step inertia. Equilibrium colors are gray `#6B6B6B`, blue `#0077BB`, and orange `#D55E00`.
- ED3 simplex rows: tolerance only $(\alpha,\beta)=(1,0)$ and strictness only $(0,1)$, both retaining $k_1=k_2=1$. Their equilibrium markers are blue.
- Filled edge markers follow the source convention of stability **along the edge**. Transverse stability is recorded separately. The SC instantaneous case has a continuous equilibrium segment; a dashed line represents the set without basin shading.
- ED2 shows an auxiliary all-DISC reputation flow and its stationary branches, not the exact transient process of every internal reputation state.
- ED3 cooperation planes use **realized cooperation**. ED4 uses **intended cooperation**. Their numerical scales must be distinguished by the implementation-success factor $1-e_1$.
- ED4 error bands are one standard error across eight independent initial-condition sample means, each based on 512 strategy compositions. They are not errors from stochastic population evolution.
- ED3 and ED5 invasion classes concern rare ALLC and ALLD in an all-DISC population, with the specified numerical boundary tolerances. They are not tests against every possible mutant strategy.

## Data and recomputation

Data are stored under `data/`, figures under `figures/`, and checks under `validation/`. Each notebook contains the model and plotting functions it uses; no private machine path or separate historical code module is required for the default supplied-data workflow.

The simplex, ED2, ED4, and ED5 notebooks expose `RECOMPUTE`. The ED3 plane notebook exposes `RECOMPUTE_INVASION`. Missing or incompatible data raise an error instead of starting an expensive calculation automatically. Regeneration writes into the same relative data directories; retain a separate copy before replacing supplied data.

| Dataset | Current release |
|---|---|
| `data/simplex_dynamics/` | Twenty recalculated vector fields, reputations, residuals, legacy fields, equilibrium records, and solver comparisons. |
| `data/extended_data_figure2/` | Existing root and plane tables; stationary drift curves are also saved. No full plane rescan was run. |
| `data/extended_data_figure3_planes/` | The complete 6,724-row cooperation table, four float64 invasion grids, and old/new records for all 181 repairs. |
| `data/extended_data_figure4/` | The 4,320 saved independent-initial-sampling records, 540 recomputed means/standard errors, and local invasion thresholds. No strategy-trajectory rerun was performed. |
| `data/extended_data_figure5/` | Twelve newly computed 241-by-241 grids, including resident/mutant reputations, invasion payoff differences, residuals, convergence flags, and classifications. |

The exact historical execution entry points that produced the final dense41 cooperation table and the original 801-point invasion table have not been uniquely identified. Supplied numerical data and the current invasion regeneration algorithm are explicit. The ED3 notebook does not claim to regenerate the full cooperation scan from an unverified historical script.

All numerical arrays are stored externally; no raw-data Base64 block is embedded in the notebooks. The source research files were not overwritten.
