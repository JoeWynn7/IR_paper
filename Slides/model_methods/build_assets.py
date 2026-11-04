"""Assets for the Section 2 deck (model and methods).

Writes into <asset_dir>:
  eq/<id>.png       equation pictures (fallback for viewers without Office Math)
  fig/*.png         figures (Fig. 1, reputation map, chord schematic)
  assets.json       equation sizes and native Office Math (OMML) from pandoc,
                    and styled text runs for every M`...` string in the deck script

Usage: python3 build_assets.py <asset_dir> make_model_pptx.js
"""
import json
import os
import re
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(HERE, '..', 'build'))
from markup import to_runs  # noqa: E402

OUT, JS = sys.argv[1], sys.argv[2]

# id -> (LaTeX, font size in pt)
EQUATIONS = {
    'assess1': (r"P^{+}_{\mathrm{C|G}}=\varepsilon,\qquad P^{+}_{\mathrm{D|G}}=e_2,\qquad P^{+}_{\mathrm{D|B}}=e_2+(1-2e_2)\,q", 15),
    'assess2': (r"P^{+}_{\mathrm{C|B}}=e_2+(1-2e_2)\bigl[(1-e_1)\,p+e_1\,q\bigr],\qquad \varepsilon=(1-e_1)(1-e_2)+e_1e_2", 15),
    'sigma': (r"\sigma(\mathrm{G})=1,\quad \sigma(\mathrm{W}_m)=\alpha^m,\quad \sigma(\mathrm{B})=0,\quad \sigma(\mathrm{S}_n)=1-\beta^n", 15),
    'recog': (r"\Delta g=\frac{g_{\mathrm{DISC}}+g_{\mathrm{ALLC}}}{2}-g_{\mathrm{ALLD}},\qquad \bar d=\sum_I\frac{n_I}{N}\,d_I", 16),
    'paths': (r"\pi_{\mathrm{W}_m}=v^m\,\pi_{\mathrm{G}},\qquad \pi_{\mathrm{S}_n}=u^n\,\pi_{\mathrm{B}}", 15),
    'flux': (r"v^{k_1+1}\,\pi_{\mathrm{G}}=u^{k_2+1}\,\pi_{\mathrm{B}}", 15),
    'pi': (r"\pi_{\mathrm{G}}=\frac{u^{k_2+1}}{Z(u)},\qquad \pi_{\mathrm{B}}=\frac{v^{k_1+1}}{Z(u)},\qquad Z(u)=v^{k_1}+u^{k_2}-v^{k_1}u^{k_2}", 15),
    'map': (r"\mathscr{R}(u)=\sum_{\ell}\pi_\ell(u)\,\sigma(\ell)=\frac{u^{k_2+1}\sum_{m=0}^{k_1}(\alpha v)^m+v^{k_1+1}\sum_{n=1}^{k_2}u^n(1-\beta^n)}{v^{k_1}+u^{k_2}-v^{k_1}u^{k_2}}", 15),
    'full': (r"\mathscr{R}(u)=\frac{u^{k_2}\bigl(1-v^{k_1+1}\bigr)}{Z(u)}", 15),
    'slope': (r"\mathscr{R}'(1)=1-\alpha", 15),
    'uI1': (r"u_{\mathrm{ALLC}}=\Phi_{\mathrm{C}}(\bar r),\qquad u_{\mathrm{ALLD}}=\Phi_{\mathrm{D}}(\bar r)", 14),
    'uI2': (r"u_{\mathrm{DISC}}=h_{\mathrm{GG}}P^{+}_{\mathrm{C|G}}+h_{\mathrm{GB}}\bigl(P^{+}_{\mathrm{C|B}}+P^{+}_{\mathrm{D|G}}\bigr)+h_{\mathrm{BB}}P^{+}_{\mathrm{D|B}}", 14),
    'sc': (r"r_I^*=\mathscr{R}\bigl(u_I(\boldsymbol{r}^*;\boldsymbol{f})\bigr),\qquad \frac{\mathrm{d}r_I}{\mathrm{d}\tau}=\mathscr{R}(u_I)-r_I,\quad r_I(0)=1", 14),
    'res': (r"u_{\mathrm{R}}(r)=r\,\Phi_{\mathrm{C}}(r)+(1-r)\,\Phi_{\mathrm{D}}(r),\qquad F(r)=\mathscr{R}\bigl[u_{\mathrm{R}}(r)\bigr]-r", 14),
    'pay': (r"\Pi_I=(1-e_1)\bigl[b\,(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\,r_I^*)-c\,\chi_I\bigr],\qquad \chi_{\mathrm{ALLC}}=1,\ \chi_{\mathrm{ALLD}}=0,\ \chi_{\mathrm{DISC}}=\bar r^*", 14),
    'rep': (r"\frac{\mathrm{d}f_I}{\mathrm{d}t}=f_I\bigl(\Pi_I-\bar\Pi\bigr),\qquad \bar\Pi=\sum_J f_J\Pi_J", 14),
    'coop': (r"\rho=(1-e_1)\bigl(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\,\bar r^*\bigr),\qquad \bar\rho\approx\omega_{\mathrm{C}}\,\bar\rho_{\mathrm{C}}", 14),
    'mut': (r"\Lambda_{\mathrm{X}}=\frac{\Pi_{\mathrm{X}}-\Pi_{\mathrm{R}}}{c(1-e_1)}=\bigl(r_{\mathrm{R}}^*-\chi_{\mathrm{X}}\bigr)-\frac{b}{c}\bigl(r_{\mathrm{R}}^*-r_{\mathrm{X}}^*\bigr),\qquad r_{\mathrm{X}}^*=\mathscr{R}(u_{\mathrm{X}})", 14),
    'win': (r"R_{\mathrm{L}}=\frac{r_{\mathrm{R}}^*}{r_{\mathrm{R}}^*-\mathscr{R}(\Phi^*_{\mathrm{D}})}<\frac{b}{c}<\frac{1-r_{\mathrm{R}}^*}{\mathscr{R}(\Phi^*_{\mathrm{C}})-r_{\mathrm{R}}^*}=R_{\mathrm{U}}", 14),
    'chord': (r"r_{\mathrm{R}}^*\,\mathscr{R}(\Phi^*_{\mathrm{C}})+(1-r_{\mathrm{R}}^*)\,\mathscr{R}(\Phi^*_{\mathrm{D}})<\mathscr{R}(u_{\mathrm{R}}^*)", 14),
    'lam': (r"\Lambda(\delta)=\delta\,r_{\mathrm{R}}^*-\frac{b}{c}\bigl[r_{\mathrm{R}}^*-r_{\mathrm{X}}^*(\delta)\bigr],\qquad u_{\mathrm{X}}(\delta)=u_{\mathrm{R}}^*-\delta\,r_{\mathrm{R}}^*\,\Delta\Phi^*", 14),
    'slope0': (r"\Lambda'(0)=r_{\mathrm{R}}^*\Bigl[1-\frac{b}{c}\,\Delta\Phi^*\,\mathscr{R}'(u_{\mathrm{R}}^*)\Bigr]", 14),
    'hmin': (r"H_{\min}=\min_{0\leq\delta\leq1}\frac{r_{\mathrm{R}}^*-r_{\mathrm{X}}^*(\delta)}{\delta\,r_{\mathrm{R}}^*}\geq\frac{c}{b}", 14),
}

EQ_TEMPLATE = r"""\documentclass[11pt,border=0.6pt]{standalone}
\usepackage{amsmath,amssymb,mathrsfs,bm,xcolor}
\definecolor{ink}{HTML}{23373B}
\begin{document}
{\fontsize{%d}{%d}\selectfont\color{ink}$\displaystyle %s$}
\end{document}
"""
A_RPR = ('<a:rPr lang="en-US" sz="{sz}" i="{i}"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill>'
         '<a:latin typeface="Cambria Math" panose="02040503050406030204" pitchFamily="18" charset="0"/></a:rPr>')


def run(cmd, cwd=None):
    subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def pdf_size_pt(path):
    out = subprocess.run(['pdfinfo', path], capture_output=True, text=True).stdout
    w, h = re.search(r'Page size:\s+([\d.]+) x ([\d.]+)', out).groups()
    return float(w), float(h)


def to_pandoc_tex(tex):
    tex = re.sub(r'\\[Bb]igl\s*', r'\\left', tex)
    return re.sub(r'\\[Bb]igr\s*', r'\\right', tex)


def omml_for_powerpoint(xml, sz):
    """Give every math run DrawingML properties (Cambria Math, size, theme text colour)."""
    def fix(m):
        r = m.group(0)
        rpr = A_RPR.format(sz=sz, i=0 if '<m:sty m:val="p"' in r else 1)
        if '</m:rPr>' in r:
            return r.replace('</m:rPr>', '</m:rPr>' + rpr, 1)
        return r.replace('<m:r>', '<m:r>' + rpr, 1)
    return re.sub(r'<m:r>.*?</m:r>', fix, xml, flags=re.S)


def equations():
    d = os.path.join(OUT, 'eq')
    os.makedirs(d, exist_ok=True)
    ids = list(EQUATIONS)
    with open(os.path.join(d, 'all.md'), 'w') as f:
        f.write('\n\n'.join('$$%s$$' % to_pandoc_tex(EQUATIONS[i][0]) for i in ids) + '\n')
    res = subprocess.run(['pandoc', 'all.md', '-o', 'all.docx'], cwd=d, capture_output=True, text=True)
    if 'Could not convert' in res.stderr:
        raise RuntimeError(res.stderr)
    xml = zipfile.ZipFile(os.path.join(d, 'all.docx')).read('word/document.xml').decode()
    paras = re.findall(r'<m:oMathPara>.*?</m:oMathPara>', xml, re.S)
    assert len(paras) == len(ids), (len(paras), len(ids))
    info = {}
    for eid, omml in zip(ids, paras):
        tex, pt = EQUATIONS[eid]
        with open(os.path.join(d, eid + '.tex'), 'w') as f:
            f.write(EQ_TEMPLATE % (pt, round(pt * 1.2), tex))
        run(['pdflatex', '-interaction=nonstopmode', eid + '.tex'], cwd=d)
        run(['pdftocairo', '-png', '-r', '600', '-transp', '-singlefile', eid + '.pdf', eid], cwd=d)
        wpt, hpt = pdf_size_pt(os.path.join(d, eid + '.pdf'))
        info[eid] = {'png': os.path.join(d, eid + '.png'), 'w': wpt / 72, 'h': hpt / 72,
                     'sz': pt * 100, 'omml': omml_for_powerpoint(omml, pt * 100), 'tex': tex}
    return info


def figures():
    d = os.path.join(OUT, 'fig')
    os.makedirs(d, exist_ok=True)
    out = {}
    for name, src in (('Fig1_model', os.path.join(REPO, 'Manuscript_doc', 'Fig1_model.pdf')),
                      ('reputation_map', os.path.join(REPO, 'Slides', 'figures', 'reputation_map.pdf'))):
        run(['pdftoppm', '-png', '-r', '300', '-singlefile', src, os.path.join(d, name)])
        w, h = pdf_size_pt(src)
        out[name] = {'png': os.path.join(d, name + '.png'), 'aspect': w / h}
    out['chord'] = chord_schematic(d)
    return out


def chord_schematic(d):
    """Geometry of the protection window: the map above its chord (schematic)."""
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import numpy as np
    plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 11, 'mathtext.fontset': 'cm'})
    ink, muted, orange, blue = '#23373B', '#66767B', '#E07B16', '#2F6E9E'
    u = np.linspace(0, 1, 400)
    R = 1 - (1 - u) ** 3                       # reputation map of (k1, k2) = (2, 0), alpha = beta = 1
    phd, phc, w = 0.12, 0.62, 0.55             # illustrative points
    ur = w * phc + (1 - w) * phd
    f = lambda x: 1 - (1 - x) ** 3
    chord_at = w * f(phc) + (1 - w) * f(phd)
    fig, ax = plt.subplots(figsize=(3.4, 3.15), dpi=300)
    ax.plot(u, u, ls=(0, (4, 3)), color=muted, lw=1.2)
    ax.text(0.83, 0.62, 'no inertia', color=muted, fontsize=10, rotation=40, ha='center')
    ax.plot(u, R, color=blue, lw=2.2)
    ax.plot([phd, phc], [f(phd), f(phc)], color=ink, lw=1.4)
    ax.plot([phd, phc], [f(phd), f(phc)], 'o', color=ink, ms=4.5)
    ax.plot([ur], [f(ur)], 'o', color=orange, ms=7, zorder=5)
    ax.plot([ur], [chord_at], 'o', mfc='white', mec=ink, ms=5.5, zorder=5)
    ax.annotate('', xy=(ur, f(ur) - 0.015), xytext=(ur, chord_at + 0.015),
                arrowprops=dict(arrowstyle='->', color=orange, lw=1.4))
    for x, lab in ((phd, r'$\Phi^*_{\mathrm{D}}$'), (ur, r'$u^*_{\mathrm{R}}$'), (phc, r'$\Phi^*_{\mathrm{C}}$')):
        ax.plot([x, x], [0, f(x)], color=muted, lw=0.6, ls=':')
        ax.text(x, -0.07, lab, ha='center', va='top', fontsize=12, color=ink)
    ax.text(0.3, 0.93, r'$\mathscr{R}(u)$', color=blue, fontsize=13)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.02)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xlabel('positive-assessment probability $u$', color=ink, labelpad=30)
    ax.set_ylabel('reputation', color=ink)
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)
    for s in ('left', 'bottom'):
        ax.spines[s].set_color(muted)
    fig.tight_layout()
    path = os.path.join(d, 'chord.png')
    fig.savefig(path, transparent=False, facecolor='white')
    plt.close(fig)
    from PIL import Image
    im = Image.open(path)
    return {'png': path, 'aspect': im.width / im.height}


def text_runs():
    src = open(JS, encoding='utf-8').read()
    strings = sorted(set(re.findall(r'M`([^`]*)`', src)))
    out = {}
    for s in strings:
        out[s] = to_runs(s)
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    data = {'equations': equations(), 'figures': figures(), 'runs': text_runs()}
    with open(os.path.join(OUT, 'assets.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('equations:', len(data['equations']), 'text strings:', len(data['runs']))


if __name__ == '__main__':
    main()
