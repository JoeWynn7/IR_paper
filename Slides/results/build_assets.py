"""Assets for the Section 3 deck (main results).

Writes into <asset_dir>:
  fig/*.png      figure renderings (Figs. 2-4 whole, Fig. 5 split into panels a and b)
  assets.json    figure paths and aspect ratios, verified basin data for the chart,
                 and styled text runs for every M`...` string in the deck script

Usage: python3 build_assets.py <asset_dir> make_results_pptx.js
"""
import csv
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(HERE, '..', 'build'))
from markup import to_runs  # noqa: E402

OUT, JS = sys.argv[1], sys.argv[2]
DPI = 300
FIGS = {
    'Fig2': os.path.join(REPO, 'Manuscript_doc', 'Fig2.pdf'),
    'Fig3': os.path.join(REPO, 'Manuscript_doc', 'Fig3.pdf'),
    'Fig4': os.path.join(REPO, 'Slides', 'figures', 'Fig4_verified.pdf'),   # verified data, correct SS labels
    'Fig5': os.path.join(REPO, 'Manuscript_doc', 'Fig5.pdf'),
}
# Panels of Fig. 5 as horizontal ranges in points (page is 540 x 255 pt).
FIG5_PANELS = {'Fig5a': (0, 270), 'Fig5b': (275, 540)}
BASINS = os.path.join(REPO, 'verified', 'analysis', 'basin_decomposition', 'basin_decomposition_reference.csv')


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def pdf_size_pt(path):
    out = subprocess.run(['pdfinfo', path], capture_output=True, text=True).stdout
    w, h = re.search(r'Page size:\s+([\d.]+) x ([\d.]+)', out).groups()
    return float(w), float(h)


def figures():
    d = os.path.join(OUT, 'fig')
    os.makedirs(d, exist_ok=True)
    out = {}
    for name, src in FIGS.items():
        run(['pdftocairo', '-png', '-r', str(DPI), '-singlefile', src, os.path.join(d, name)])
        w, h = pdf_size_pt(src)
        out[name] = {'png': os.path.join(d, name + '.png'), 'aspect': w / h}
    w5, h5 = pdf_size_pt(FIGS['Fig5'])
    k = DPI / 72.0
    for name, (x0, x1) in FIG5_PANELS.items():
        run(['pdftocairo', '-png', '-r', str(DPI), '-singlefile', '-x', str(int(x0 * k)), '-y', '0',
             '-W', str(int((x1 - x0) * k)), '-H', str(int(h5 * k)), FIGS['Fig5'], os.path.join(d, name)])
        out[name] = {'png': os.path.join(d, name + '.png'), 'aspect': (x1 - x0) / h5}
    return out


def basins():
    rows = list(csv.DictReader(open(BASINS)))
    data = {}
    for r in rows:
        data.setdefault(r['norm'], {})[r['condition']] = {
            'k1': int(r['k1']), 'k2': int(r['k2']),
            'basin': float(r['cooperative_basin']), 'mean': float(r['mean_cooperation']),
            'within': float(r['cooperation_cooperative']) if r['cooperation_cooperative'] else None}
    return data


def text_runs():
    src = open(JS, encoding='utf-8').read()
    return {s: to_runs(s) for s in sorted(set(re.findall(r'M`([^`]*)`', src)))}


def main():
    os.makedirs(OUT, exist_ok=True)
    data = {'figures': figures(), 'basins': basins(), 'runs': text_runs()}
    with open(os.path.join(OUT, 'assets.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('figures:', len(data['figures']), 'text strings:', len(data['runs']))


if __name__ == '__main__':
    main()
