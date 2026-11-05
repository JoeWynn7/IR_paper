"""Assets for the Section 5 deck (supplementary results).

Writes into <asset_dir>:
  fig/ED_Fig<n>.png   renderings of Extended Data Figs. 1-9 from Manuscript_doc/
  assets.json         figure paths and aspect ratios, and styled text runs for every
                      M`...` string in the deck script

Usage: python3 build_assets.py <asset_dir> make_supplementary_pptx.js
"""
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


def pdf_size_pt(path):
    out = subprocess.run(['pdfinfo', path], capture_output=True, text=True).stdout
    w, h = re.search(r'Page size:\s+([\d.]+) x ([\d.]+)', out).groups()
    return float(w), float(h)


def figures():
    d = os.path.join(OUT, 'fig')
    os.makedirs(d, exist_ok=True)
    out = {}
    for n in range(1, 10):
        name = 'ED_Fig%d' % n
        src = os.path.join(REPO, 'Manuscript_doc', name + '.pdf')
        subprocess.run(['pdftocairo', '-png', '-r', str(DPI), '-singlefile', src, os.path.join(d, name)],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        w, h = pdf_size_pt(src)
        out[name] = {'png': os.path.join(d, name + '.png'), 'aspect': w / h}
    return out


def text_runs():
    src = open(JS, encoding='utf-8').read()
    return {s: to_runs(s) for s in sorted(set(re.findall(r'M`([^`]*)`', src)))}


def main():
    os.makedirs(OUT, exist_ok=True)
    data = {'figures': figures(), 'runs': text_runs()}
    with open(os.path.join(OUT, 'assets.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('figures:', len(data['figures']), 'text strings:', len(data['runs']))


if __name__ == '__main__':
    main()
