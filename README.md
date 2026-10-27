# Indirect reciprocity with inertial reputation updating

This repository contains the model description, numerical analyses, data, and figures for research on indirect reciprocity with inertial reputation updating. The model examines how individuals update private reputations based on behavior and social norms, and how reputation inertia affects cooperation and strategy evolution.

## Getting started

1. Read [Model.md](code-and-figures/Model.md) for the model assumptions, reputation states, social norms, and dynamics.
2. Use the table below to find a figure package. Start with its `Results_*.md` for an explanation of the figures and findings, and its `README.md` for the data, computational settings, and reproduction scope.
3. Explore the Jupyter notebooks and the `data/`, `figures/`, and `validation/` directories. Each package also has a `manifest.csv` with file and checksum information.

| Figures | Contents | Resources |
|---|---|---|
| Figure 2 and Extended Data Figure 1 | Reputation matrices, inertia depth, and recognition analysis | [Package](code-and-figures/Fig2%20%26%20ED_Fig1/) · [Results](code-and-figures/Fig2%20%26%20ED_Fig1/Results_Figure2_and_ED1.md) · [README](code-and-figures/Fig2%20%26%20ED_Fig1/README.md) |
| Figure 3 and Extended Data Figures 2–5 | Strategy simplex dynamics, reputation, cooperation, and invasion | [Package](code-and-figures/Fig3%20%26%20ED_Fig2-5/) · [Results](code-and-figures/Fig3%20%26%20ED_Fig2-5/Results_Figure3_and_ED2_to_ED5.md) · [README](code-and-figures/Fig3%20%26%20ED_Fig2-5/README.md) |
| Figure 4 and Extended Data Figure 6 | Total depth, depth allocation, and cooperation | [Package](code-and-figures/Fig4%20%26%20ED_Fig6/) · [Results](code-and-figures/Fig4%20%26%20ED_Fig6/Results_Figure4_and_ED6.md) · [README](code-and-figures/Fig4%20%26%20ED_Fig6/README.md) |
| Figure 5 and Extended Data Figure 7 | Opportunistic invasion and cooperation | [Package](code-and-figures/Fig5%20%26%20ED_Fig7/) · [Results](code-and-figures/Fig5%20%26%20ED_Fig7/Results_Figure5_and_ED7.md) · [README](code-and-figures/Fig5%20%26%20ED_Fig7/README.md) |

## Running the notebooks

The figure packages use Python 3.11 and each provides its own `requirements.txt`. Install the requirements from the relevant package directory, then open the notebooks in an existing Jupyter environment and run the cells in order. For example:

```bash
cd 'code-and-figures/Fig2 & ED_Fig1'
python -m pip install -r requirements.txt
```

By default, the notebooks load the supplied data and export figures as PDF and SVG. Full parameter scans or simulations require explicitly enabling the relevant recomputation options; they can be computationally expensive and may write to existing data or output directories. Back up the supplied files before recomputing, and consult the package README and validation records.

## Interpreting the results

- The Figure 3 and Extended Data Figures 2–5 package includes scientifically relevant numerical corrections. Read [NUMERICAL_CHANGES.md](code-and-figures/Fig3%20%26%20ED_Fig2-5/NUMERICAL_CHANGES.md) before reusing earlier figures or descriptions.
- Some Figure 4 conditions were recalculated and documented; the complete depth scans were not rerun. The package README describes the validation gate and its limits.
- Figure 5 and Extended Data Figure 7 test the specified IID opportunistic O-DISC family. Resistance to this family does not establish resistance to every possible mutant strategy.

## Using this repository in a new conversation

Provide the repository link and identify the figure or question of interest. A useful reading order is `Model.md`, followed by the relevant package's `Results_*.md` and `README.md`, then the notebooks, data, and validation files as needed. Interpret numerical findings in the context of the recorded calculations and their stated limits.
