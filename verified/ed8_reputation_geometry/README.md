# Extended Data Figure 8: Reputation geometry along the ALLD–DISC edge

`Extended_Data_Figure8.ipynb` computes every self-consistent reputation equilibrium on the ALLD–DISC edge of the simplex ($f_{\rm ALLC}=0$, $0.01\le f_{\rm DISC}\le1$) for SC, SH, SJ and SS without inertia, with full one-step inertia and with the selected multi-step depths ($b/c=5$, $e_1=e_2=0.02$, $\alpha=\beta=1$). On this edge the self-consistency problem reduces exactly to one equation in the mean reputation $\bar r$; all roots are located on a grid of 8,001 values of $\bar r$ and refined by bisection, and their stability is that of the auxiliary reputation flow. The notebook also follows the branch selected by the main convention (relaxation from all-good reputations) and evaluates the normalized payoff advantage of DISC over ALLD on it, $(\Pi_{\rm DISC}-\Pi_{\rm ALLD})/[c(1-e_1)]=(b/c)f_{\rm DISC}(r_{\rm DISC}-r_{\rm ALLD})-\bar r$.

## Files

| File | Content |
|---|---|
| `data/extended_data_figure8/edge_equilibria.csv` | All roots with reputations, largest eigenvalue of the auxiliary flow, stability and residual ($<10^{-10}$). |
| `data/extended_data_figure8/selected_branch.csv` | All-good-selected reputations and payoff advantage at each grid point (residual $\le10^{-12}$). |
| `data/extended_data_figure8/folds.csv` | Saddle-node points (a stable and an unstable root meeting). |
| `data/extended_data_figure8/payoff_sign_changes.csv` | Sign changes of the payoff advantage on the selected branch: continuous (edge equilibria) or discontinuous (loss of the high branch at a fold). |
| `figures/extended_data_figure8/Extended_Data_Figure8.{pdf,svg,png}` | Figure (7.5 in wide). |

## Results shown

| Norm | One-step inertia | Selected multi-step inertia |
|---|---|---|
| SC | Bistable for $f_{\rm DISC}\ge0.896$: the high branch ends at a fold, DISC's payoff advantage jumps from about $-6\times10^{-4}$ to 3.1. No interior edge equilibrium. | $(2,0)$: unique, smooth branch (concave response; proven for every $(k_1,0)$); edge equilibrium at $f_{\rm DISC}=0.080$ (0.213 without inertia). |
| SH | Bistable for $f_{\rm DISC}\ge0.972$; payoff advantage changes sign only at the fold. | $(3,0)$: hysteresis loop with folds at $f_{\rm DISC}=0.511$ (end of the high branch) and $0.923$ (end of the low branch); the selected branch and the sign change of the payoff advantage move to $0.511$. |
| SJ | Bistable for $f_{\rm DISC}\ge0.770$ (low branch at $r_{\rm DISC}=0.5$); sign change only at the fold. | $(4,3)$: no fold; unique branch; continuous edge equilibrium at $f_{\rm DISC}=0.283$. |
| SS | No fold; edge equilibrium at 0.239 (0.357 without inertia). | $(1,2)$: no fold; edge equilibrium at 0.207. |

Without inertia there is a unique equilibrium for all four norms (SH and SJ: low reputations and negative payoff advantage along the whole edge).

## Interpretation and use in the manuscript

Directional inertia changes the geometry of reputation formation along the edge that determines whether DISC can grow against ALLD. Under SH and SJ, one-step inertia creates a high-reputation branch only close to the DISC vertex, and DISC out-earns ALLD only on that branch; the boundary of the region from which cooperation can grow is therefore set by the fold. The selected multi-step depths remove the fold (SJ) or move it far towards ALLD (SH), so that the advantage of DISC begins at much lower DISC frequencies. Under SC and SS the change is mainly a smooth displacement of the edge equilibrium towards the ALLD vertex; the SC one-step fold exists but lies near the DISC vertex and does not bound the cooperative basin. Folds are therefore one of two mechanisms, not a universal one.

This figure supports the interpretation of Figure 3 (the presence or absence of ALLD–DISC edge equilibria and the abrupt change of the field near the DISC vertex in the one-step SH and SJ panels) and of Figure 4 (the large increase of the cooperative basin with multi-step depth under SH and SJ, and the smaller, smooth increase under SC and SS).
