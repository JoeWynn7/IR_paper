"""Prepare assets for the PowerPoint version and write deck.json.

  * figure PNGs (from the same PDFs the Beamer deck uses)
  * equation fallback PNGs, rendered with LaTeX at the Beamer font size
  * equation OMML (native Office math) via pandoc
  * text runs for every markup string (see markup.py)

Usage: python make_assets.py <asset_dir>
"""
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from deck_spec import SLIDES, EQUATIONS  # noqa: E402
from markup import to_runs  # noqa: E402
from make_beamer import REF_KEYS  # noqa: E402

SLIDES_DIR = os.path.join(HERE, '..')
MANU = os.path.join(SLIDES_DIR, '..', 'Manuscript_doc')
OUT = os.path.abspath(sys.argv[1])
SCALE = 10.0 / (160 / 25.4)          # Beamer 16:9 frame (160 mm wide) -> 10 in PowerPoint slide
PT = {'normal': 10, 'small': 9, 'footnotesize': 8}


def fig_pdf(name):
    for d in (os.path.join(SLIDES_DIR, 'figures'), MANU):
        p = os.path.join(d, name + '.pdf')
        if os.path.exists(p):
            return p
    raise FileNotFoundError(name)


def run(cmd, cwd=None):
    subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def pdf_size_pt(path):
    out = subprocess.run(['pdfinfo', path], capture_output=True, text=True).stdout
    m = re.search(r'Page size:\s+([\d.]+) x ([\d.]+) pts', out)
    return float(m.group(1)), float(m.group(2))


# ------------------------------------------------------------------ figures
def figures():
    names = set()
    for s in SLIDES:
        if s.get('fig'):
            names.add(s['fig'])
        for key in ('body', 'left', 'right', 'bottom'):
            for el in s.get(key, []) or []:
                if el['type'] == 'figure':
                    names.add(el['file'])
    d = os.path.join(OUT, 'png')
    os.makedirs(d, exist_ok=True)
    info = {}
    for n in sorted(names):
        src = fig_pdf(n)
        png = os.path.join(d, n + '.png')
        if n != 'reputation_map' or not os.path.exists(png):
            run(['pdftoppm', '-png', '-r', '220', '-singlefile', src, os.path.join(d, n)])
        w, h = pdf_size_pt(src)
        info[n] = {'png': png, 'aspect': w / h}
    return info


# ------------------------------------------------------------------ equations
EQ_TEMPLATE = r"""\documentclass[10pt,border=0.6pt]{standalone}
\usepackage{amsmath,amssymb,mathrsfs,bm,xcolor}
\definecolor{ink}{HTML}{23373B}
\begin{document}
{\color{ink}%s$\displaystyle %s$}
\end{document}
"""
SIZECMD = {'normal': r'\normalsize', 'small': r'\small', 'footnotesize': r'\footnotesize'}


def to_pandoc_tex(tex):
    tex = re.sub(r'\\[Bb]igl\s*', r'\\left', tex)
    tex = re.sub(r'\\[Bb]igr\s*', r'\\right', tex)
    return tex


A_RPR = ('<a:rPr lang="en-US" sz="{sz}" i="{i}"><a:latin typeface="Cambria Math" '
         'panose="02040503050406030204" pitchFamily="18" charset="0"/></a:rPr>')


def omml_for_powerpoint(xml, sz):
    """Add DrawingML run properties (Cambria Math, size) to every math run."""
    def fix(m):
        r = m.group(0)
        upright = '<m:sty m:val="p"' in r
        rpr = A_RPR.format(sz=sz, i=0 if upright else 1)
        if '</m:rPr>' in r:
            return r.replace('</m:rPr>', '</m:rPr>' + rpr, 1)
        return r.replace('<m:r>', '<m:r>' + rpr, 1)
    xml = re.sub(r'<m:r>.*?</m:r>', fix, xml, flags=re.S)
    xml = xml.replace('<m:jc m:val="center" />', '<m:jc m:val="centerGroup"/>')
    return xml


def equations():
    d = os.path.join(OUT, 'eq')
    os.makedirs(d, exist_ok=True)
    ids = list(EQUATIONS)
    # OMML through pandoc (one docx with all equations, in order)
    md = '\n\n'.join('$$%s$$' % to_pandoc_tex(EQUATIONS[i][0]) for i in ids)
    with open(os.path.join(d, 'all.md'), 'w') as f:
        f.write(md + '\n')
    res = subprocess.run(['pandoc', 'all.md', '-o', 'all.docx'], cwd=d, capture_output=True, text=True)
    if 'Could not convert' in res.stderr:
        raise RuntimeError(res.stderr)
    xml = zipfile.ZipFile(os.path.join(d, 'all.docx')).read('word/document.xml').decode()
    paras = re.findall(r'<m:oMathPara>.*?</m:oMathPara>', xml, re.S)
    assert len(paras) == len(ids), (len(paras), len(ids))
    info = {}
    for eid, omml in zip(ids, paras):
        tex, size = EQUATIONS[eid]
        with open(os.path.join(d, eid + '.tex'), 'w') as f:
            f.write(EQ_TEMPLATE % (SIZECMD[size], tex))
        run(['pdflatex', '-interaction=nonstopmode', eid + '.tex'], cwd=d)
        run(['pdftocairo', '-png', '-r', '600', '-transp', '-singlefile', eid + '.pdf', eid], cwd=d)
        wpt, hpt = pdf_size_pt(os.path.join(d, eid + '.pdf'))
        sz = int(round(PT[size] * SCALE)) * 100
        info[eid] = {'png': os.path.join(d, eid + '.png'), 'w': wpt / 72 * SCALE, 'h': hpt / 72 * SCALE,
                     'omml': omml_for_powerpoint(omml, sz), 'sz': sz, 'tex': tex}
    return info


# ------------------------------------------------------------------ references
def references():
    bib = open(os.path.join(SLIDES_DIR, 'slides_refs.bib')).read()
    entries = {}
    for m in re.finditer(r'@(\w+)\{([^,]+),(.*?)\n\}', bib, re.S):
        fields = dict((k.lower(), v.strip()) for k, v in re.findall(r'(\w+)\s*=\s*\{(.*?)\}\s*,?\s*\n', m.group(3) + '\n', re.S))
        entries[m.group(2)] = (m.group(1).lower(), fields)

    def clean(s):
        s = re.sub(r"\{\\'(\w)\}", lambda x: {'a': 'á', 'e': 'é', 'i': 'í'}.get(x.group(1), x.group(1)), s)
        s = s.replace('{\\c{c}}', 'ç').replace('{\\"u}', 'ü').replace("{\\'a}", 'á').replace('\\&', '&')
        s = s.replace('{', '').replace('}', '').replace('--', '–').replace('`', '‘').replace("'", '’')
        return s

    def initials(first):
        return ' '.join(p[0] + '.' for p in re.split(r'[\s]+', first.replace('-', ' -')) if p and p[0].isalpha())

    out = []
    for k in REF_KEYS:
        typ, f = entries[k]
        names = [a.strip() for a in f['author'].split(' and ')]
        fmt = []
        for a in names:
            if a == 'others':
                continue
            last, _, first = a.partition(',')
            fmt.append('%s, %s' % (clean(last.strip()), initials(clean(first.strip()))))
        if len(names) > 5 or 'others' in names:
            auth = fmt[0] + ' et al.'
        elif len(fmt) == 1:
            auth = fmt[0]
        else:
            auth = ', '.join(fmt[:-1]) + ' & ' + fmt[-1]
        title = clean(f['title'])
        if typ == 'book':
            out.append('%s %s (%s, %s).' % (auth, title, clean(f['publisher']), f['year']))
        else:
            out.append('%s %s. %s %s, %s (%s).' % (auth, title, clean(f['journal']), f['volume'], clean(f['pages']), f['year']))
    return out


# ------------------------------------------------------------------ deck.json
def convert(obj):
    """Recursively replace markup strings by run lists (keys listed below)."""
    TEXT_KEYS = {'text', 'title', 'subtitle', 'author', 'institute', 'date', 'caption', 'takeaway',
                 'note', 'source', 'tag', 'lead', 'body'}
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            if k in TEXT_KEYS and isinstance(v, str):
                out[k] = to_runs(v)
            elif k in ('items', 'chips', 'nodes', 'header') and isinstance(v, list) and all(isinstance(x, str) for x in v):
                out[k] = [to_runs(x) for x in v]
            elif k == 'rows' and isinstance(v, list):
                out[k] = [[to_runs(c) if isinstance(c, str) else c for c in row] for row in v]
            elif k == 'items' and isinstance(v, list):   # agenda tuples
                out[k] = [[to_runs(c) for c in row] for row in v]
            else:
                out[k] = convert(v)
        return out
    if isinstance(obj, list):
        return [convert(x) for x in obj]
    return obj


def main():
    os.makedirs(OUT, exist_ok=True)
    deck = {'slides': convert(SLIDES), 'figures': figures(), 'equations': equations(),
            'references': [to_runs(r) for r in references()]}
    with open(os.path.join(OUT, 'deck.json'), 'w') as f:
        json.dump(deck, f, ensure_ascii=False, indent=1)
    print('deck.json:', len(deck['slides']), 'slides,', len(deck['equations']), 'equations,',
          len(deck['figures']), 'figures,', len(deck['references']), 'references')


if __name__ == '__main__':
    main()
