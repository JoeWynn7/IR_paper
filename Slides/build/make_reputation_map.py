"""Plot the stationary reputation map R(u) for Stern Judging architectures.

R(u) = [u^{k2+1} sum_{m=0}^{k1} (alpha v)^m + v^{k1+1} sum_{n=1}^{k2} u^n (1-beta^n)]
       / [v^{k1} + u^{k2} - v^{k1} u^{k2}],   v = 1 - u.
Writes figures/reputation_map.pdf (Beamer) and reputation_map.png (PowerPoint).
"""
import os
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
FIG = os.path.join(HERE, '..', 'figures')
PNG_DIR = sys.argv[1] if len(sys.argv) > 1 else FIG


def R(u, k1, k2, a, b):
    v = 1 - u
    num = u ** (k2 + 1) * sum((a * v) ** m for m in range(k1 + 1)) \
        + v ** (k1 + 1) * sum(u ** n * (1 - b ** n) for n in range(1, k2 + 1))
    return num / (v ** k1 + u ** k2 - v ** k1 * u ** k2)


CASES = [  # label, k1, k2, alpha, beta, color, style
    ('No inertia', 0, 0, 1, 1, '#8C8C8C', '-'),
    ('One-step (1,1)', 1, 1, 1, 1, '#2B7BBA', '-'),
    (r'Selected (4,3), $\alpha=1$', 4, 3, 1, 1, '#E07B39', '-'),
    (r'Selected (4,3), $\alpha=0.8$', 4, 3, 0.8, 1, '#8C2D19', '--'),
]

plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 10, 'axes.linewidth': 0.8,
                     'mathtext.fontset': 'dejavusans'})
u = np.linspace(1e-6, 1 - 1e-6, 2001)
fig, ax = plt.subplots(figsize=(4.1, 3.5))
for lab, k1, k2, a, b, col, ls in CASES:
    ax.plot(u, R(u, k1, k2, a, b), color=col, ls=ls, lw=1.8, label=lab)
ax.set(xlim=(0, 1), ylim=(0, 1.02), xlabel='Probability of a positive assessment, $u$',
       ylabel=r'Reputation map $\mathcal{R}(u)$')
ax.spines[['top', 'right']].set_visible(False)
ax.legend(frameon=False, fontsize=8, loc='upper left')
ins = ax.inset_axes([0.55, 0.12, 0.42, 0.42])
uu = np.linspace(0.9, 1 - 1e-9, 400)
for lab, k1, k2, a, b, col, ls in CASES:
    ins.plot(uu, R(uu, k1, k2, a, b), color=col, ls=ls, lw=1.4)
ins.set(xlim=(0.9, 1), ylim=(0.9, 1.003), xticks=[0.9, 1], yticks=[0.9, 1])
ins.tick_params(labelsize=7)
ins.set_title(r'slope $1-\alpha$ at $u=1$', fontsize=7.5, pad=2)
fig.tight_layout()
fig.savefig(os.path.join(FIG, 'reputation_map.pdf'))
fig.savefig(os.path.join(PNG_DIR, 'reputation_map.png'), dpi=300)
print('slopes near u=1:', {lab: round(float((R(1 - 1e-6, k1, k2, a, b) - R(1 - 2e-6, k1, k2, a, b)) / 1e-6), 4)
                           for lab, k1, k2, a, b, *_ in CASES})
