"""Generate the Beamer source IR_Hilbe_slides.tex from deck_spec.py."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from deck_spec import SLIDES, EQUATIONS  # noqa: E402
from markup import to_latex as L  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), '..', 'IR_Hilbe_slides.tex')

SIZE = {'normal': r'\normalsize', 'small': r'\small', 'footnotesize': r'\footnotesize'}
REF_KEYS = ['milinski2016', 'nowak1998', 'nowak2005', 'ohtsuki2004', 'ohtsuki2006', 'hilbe2018',
            'fujimoto2022', 'fujimoto2023', 'radzvilavicius2019', 'okada2020', 'radzvilavicius2021',
            'kawakatsu2024', 'murase2023', 'murase2024synchronization', 'tham2026', 'schmid2021',
            'schmid2023', 'clark2020', 'michelmata2024', 'yamamoto2025', 'ostrom1990', 'cox2010',
            'tadelis2016', 'blumstein2009', 'mendesiedlecki2013neural', 'mendesiedlecki2013diagnostic',
            'slovic1993', 'siegel2018']

PREAMBLE = r"""% =============================================================================
% Indirect reciprocity with inertial reputation updating
% Slides for a discussion with Christian Hilbe (November 2026)
%
% Theme: metropolis (16:9). Compile with pdfLaTeX + BibTeX
% (latexmk -pdf IR_Hilbe_slides.tex). On Overleaf, compile as usual.
% Figures are searched in figures/ and, inside the repository, in ../Manuscript_doc/.
% This file was generated from build/deck_spec.py; it can be edited directly.
% =============================================================================
\documentclass[aspectratio=169,10pt,t,xcolor=table]{beamer}
\usetheme[progressbar=none,numbering=counter,block=fill,sectionpage=none]{metropolis}
\usefonttheme[onlymath]{serif}
\usepackage{appendixnumberbeamer}
\usepackage{amsmath,amssymb,mathrsfs,bm,booktabs,array}
\usepackage{tikz}
\usetikzlibrary{arrows.meta,positioning,calc}
\usepackage[authoryear,round]{natbib}
\graphicspath{{figures/}{../Manuscript_doc/}}

% ----------------------------------------------------------------- colors
\definecolor{ink}{HTML}{23373B}
\definecolor{accent}{HTML}{EB811B}
\definecolor{blueacc}{HTML}{2F6E9E}
\definecolor{muted}{HTML}{6B7B80}
\definecolor{cardbg}{HTML}{EEF2F3}
\definecolor{goodimg}{HTML}{3B7DB8}
\definecolor{badimg}{HTML}{E58A9A}
\setbeamercolor{background canvas}{bg=white}
\setbeamercolor{normal text}{fg=ink,bg=white}
\setbeamercolor{frametitle}{bg=white,fg=ink}
\setbeamercolor{alerted text}{fg=accent}
\setbeamercolor{footline}{fg=muted}
\setbeamercolor{block title}{bg=cardbg,fg=ink}
\setbeamercolor{block body}{bg=cardbg,fg=ink}
\setbeamercolor{block title alerted}{bg=accent!16,fg=accent!75!black}
\setbeamercolor{block body alerted}{bg=accent!16,fg=ink}
\setbeamercolor{block title example}{bg=blueacc!13,fg=blueacc!85!black}
\setbeamercolor{block body example}{bg=blueacc!13,fg=ink}
\setbeamerfont{frametitle}{size=\large,series=\bfseries}
\setbeamerfont{block title}{size=\small,series=\bfseries}
\setbeamertemplate{itemize item}{\color{accent}\raisebox{1pt}{\scalebox{0.8}{$\blacktriangleright$}}}
\setlength{\leftmargini}{1.1em}

% ----------------------------------------------------------------- helpers
% Source line at the bottom left of a slide
\newcommand{\source}[1]{%
  \begin{tikzpicture}[remember picture,overlay]
    \node[anchor=south west,font=\tiny,text=muted,text width=13.2cm,align=left,inner sep=0pt]
      at ([xshift=0.48cm,yshift=0.22cm]current page.south west) {#1};
  \end{tikzpicture}}
% Storyline tag at the top right of a slide
\newcommand{\slidetag}[2]{%
  \begin{tikzpicture}[remember picture,overlay]
    \node[anchor=north east,fill=#1!15,text=#1!80!black,font=\scriptsize\bfseries,
          rounded corners=2pt,inner xsep=5pt,inner ysep=3pt]
      at ([xshift=-0.42cm,yshift=-0.32cm]current page.north east) {#2};
  \end{tikzpicture}}
% Key message box
\newcommand{\takeaway}[1]{\par\vspace{3pt}\noindent
  \begin{tikzpicture}
    \node[fill=accent!13,rounded corners=3pt,text width=\dimexpr\linewidth-12pt\relax,
          inner sep=6pt,align=left,font=\small]{#1};
  \end{tikzpicture}\par\vspace{2pt}}
% Display equation with optional lead text
\newcommand{\eqlead}[1]{{\small #1\par}\vspace{-1pt}}
\newcommand{\eqline}[2]{{\centering #1\mbox{$\displaystyle #2$}\par}\vspace{2pt}}
% Figure caption and small notes
\newcommand{\figcap}[1]{{\scriptsize\color{muted}#1\par}}
\newcommand{\smallnote}[1]{{\scriptsize\color{muted}\itshape #1\par}}
\newenvironment{cardlist}{\begin{itemize}\setlength{\itemsep}{1pt}\small}{\end{itemize}}

% ----------------------------------------------------------------- title data
\title{Indirect reciprocity with inertial reputation updating}
\author{Wenqiang Zhu}
\date{}
"""


def esc_tikz(s):
    """Flow-node text: markup plus explicit line breaks."""
    return r'\\'.join(L(x) for x in s.split('\n'))


def render_el(el, w=r'\linewidth'):
    t = el['type']
    if t == 'bullets':
        items = '\n'.join(r'  \item ' + L(x) for x in el['items'])
        return '{%s\n\\begin{itemize}\n%s\n\\end{itemize}}\n' % (SIZE[el['size']], items)
    if t == 'text':
        s = L(el['text'])
        if el.get('bold'):
            s = r'\textbf{%s}' % s
        if el.get('color') == 'muted':
            s = r'{\color{muted}%s}' % s
        return '{%s %s\\par}\\vspace{3pt}\n' % (SIZE[el['size']], s)
    if t == 'eq':
        tex, size = EQUATIONS[el['id']]
        out = ''
        if el.get('lead'):
            out += '\\eqlead{%s}\n' % L(el['lead'])
        return out + '\\eqline{%s}{%s}\n' % (SIZE[size], tex)
    if t == 'card':
        env = {'plain': 'block', 'accent': 'alertblock', 'blue': 'exampleblock'}[el['style']]
        body = ''
        if el.get('body'):
            body += '{\\small %s\\par}\n' % L(el['body'])
        if el.get('items'):
            body += '\\begin{cardlist}\n%s\n\\end{cardlist}\n' % '\n'.join(r'  \item ' + L(x) for x in el['items'])
        return '\\begin{%s}{%s}\n%s\\end{%s}\n' % (env, L(el['title']), body, env)
    if t == 'cards':
        n = len(el['cards'])
        width = (1 - 0.03 * (n - 1)) / n
        cols = '\n\\hfill\n'.join('\\begin{column}{%.3f\\textwidth}\n%s\\end{column}' % (width, render_el(c))
                                 for c in el['cards'])
        return '\\begin{columns}[T,onlytextwidth]\n%s\n\\end{columns}\n\\vspace{4pt}\n' % cols
    if t == 'takeaway':
        return '\\takeaway{%s}\n' % L(el['text'])
    if t == 'figure':
        out = '{\\centering\\includegraphics[width=\\linewidth,height=%.2f\\textheight,keepaspectratio]{%s}\\par}\n' % (el['h'], el['file'])
        if el.get('caption'):
            out += '\\vspace{3pt}\\figcap{%s}\n' % L(el['caption'])
        return out
    if t == 'caption':
        return '\\figcap{%s}\n' % L(el['text'])
    if t == 'note':
        return '\\smallnote{%s}\n' % L(el['text'])
    if t == 'table':
        spec = ''.join('>{\\raggedright\\arraybackslash}p{\\dimexpr%.3f\\linewidth-2\\tabcolsep\\relax}' % wd for wd in el['widths'])
        lines = ['{%s' % SIZE[el['size']], '\\begin{tabular}{@{}%s@{}}' % spec, '\\toprule',
                 '\\rowcolor{cardbg}' + ' & '.join('\\textbf{%s}' % L(h) if h else '' for h in el['header']) + r' \\',
                 '\\midrule']
        for r in el['rows']:
            cells = [L(c) for c in r]
            if el.get('first_bold') and cells[0]:
                cells[0] = '\\textbf{%s}' % cells[0]
            lines.append(' & '.join(cells) + r' \\')
        lines += ['\\bottomrule', '\\end{tabular}}\\par\\vspace{3pt}']
        return '\n'.join(lines) + '\n'
    if t == 'flow':
        n = len(el['nodes'])
        gap = 0.9
        lines = ['\\par\\vspace{4pt}{\\centering\\begin{tikzpicture}[box/.style={fill=cardbg,rounded corners=3pt,'
                 'align=center,font=\\footnotesize,minimum height=1.0cm,inner sep=4pt,'
                 'text width=\\dimexpr(\\linewidth-%dcm)/%d-8pt\\relax}]' % (round(gap * (n - 1)), n)]
        for i, node in enumerate(el['nodes']):
            pos = '' if i == 0 else ', right=%.2fcm of n%d' % (gap, i - 1)
            lines.append('  \\node[box%s] (n%d) {%s};' % (pos, i, esc_tikz(node)))
        for i, c in enumerate(el['connectors']):
            if c == '+':
                lines.append('  \\node[font=\\Large\\bfseries,text=accent] at ($(n%d.east)!0.5!(n%d.west)$) {+};' % (i, i + 1))
            else:
                lines.append('  \\draw[-{Latex[length=2.2mm]},very thick,accent] (n%d.east) -- (n%d.west);' % (i, i + 1))
        lines.append('\\end{tikzpicture}\\par}\\vspace{4pt}')
        return '\n'.join(lines) + '\n'
    if t == 'sequence':
        lines = ['\\par\\vspace{2pt}{\\centering\\begin{tikzpicture}[x=1.05cm,y=0.75cm]',
                 '  \\node[anchor=east,font=\\scriptsize,text=muted] at (-0.6,0) {assessment};',
                 '  \\node[anchor=east,font=\\scriptsize,text=muted] at (-0.6,-1) {image};']
        for i, (a, g) in enumerate(zip(el['assess'], el['images'])):
            neg = a != '+'
            lines.append('  \\node[circle,draw=%s,thick,minimum size=0.55cm,font=\\small\\bfseries,text=%s] at (%d,0) {$%s$};'
                         % ('badimg' if neg else 'muted', 'badimg!80!black' if neg else 'ink', i, '-' if neg else '+'))
            lines.append('  \\node[circle,fill=%s,minimum size=0.55cm,font=\\small\\bfseries,text=white] at (%d,-1) {%s};'
                         % ('badimg' if g == 'B' else 'goodimg', i, g))
        lines.append('  \\draw[-{Latex[length=1.6mm]},muted] (-0.35,-1.62) -- (%.2f,-1.62) node[right,font=\\scriptsize,text=muted] {time};' % (len(el['assess']) - 0.6))
        lines.append('\\end{tikzpicture}\\par}\\vspace{2pt}')
        return '\n'.join(lines) + '\n'
    if t == 'agenda':
        rows = []
        for num, title, desc in el['items']:
            rows.append('\\tikz\\node[circle,fill=accent,text=white,font=\\small\\bfseries,minimum size=0.62cm,inner sep=0pt]{%s}; &'
                        ' \\textbf{%s}\\newline{\\small\\color{muted}%s}\\\\[7pt]' % (num, L(title), L(desc)))
        return ('\\vspace{6pt}\\begin{tabular}{@{}m{0.8cm}m{0.85\\linewidth}@{}}\n' + '\n'.join(rows) + '\n\\end{tabular}\n')
    if t == 'qa':
        lines = ['\\vspace{4pt}\\begin{tabular}{@{}>{\\raggedright\\arraybackslash}p{0.31\\linewidth}>{\\raggedright\\arraybackslash}p{0.64\\linewidth}@{}}',
                 '\\toprule']
        for i, (q, a) in enumerate(el['rows']):
            lines.append('{\\small\\bfseries\\color{blueacc}%s} & {\\small %s} \\\\' % (L(q), L(a)))
            lines.append('\\midrule' if i < len(el['rows']) - 1 else '\\bottomrule')
        lines.append('\\end{tabular}')
        return '\n'.join(lines) + '\n'
    raise ValueError(t)


def render_list(els):
    return ''.join(render_el(e) for e in els)


def overlays(s):
    out = ''
    if s.get('tag'):
        color = 'blueacc' if 'A' in s['tag'].split('\u00b7')[0] else 'accent'
        out += '\\slidetag{%s}{%s}\n' % (color, L(s['tag']))
    if s.get('source'):
        out += '\\source{%s}\n' % L(s['source'])
    return out


def frame_content(s):
    body = ''
    if s.get('layout') == 'two':
        r = s['ratio']
        body += ('\\begin{columns}[T,onlytextwidth]\n\\begin{column}{%.2f\\textwidth}\n%s\\end{column}\n\\hfill\n'
                 '\\begin{column}{%.2f\\textwidth}\n%s\\end{column}\n\\end{columns}\n'
                 % (r, render_list(s['left']), 0.96 - r, render_list(s['right'])))
        if s.get('bottom'):
            body += '\\vspace{2pt}\n' + render_list(s['bottom'])
    else:
        body += render_list(s['body'])
    return '\\begin{frame}{%s}\\relax\n%s%s\\end{frame}\n' % (L(s['title']), overlays(s), body)


def frame_figure(s):
    cap = '\\figcap{%s}\n' % L(s['caption'])
    note = '\\vspace{2pt}\\smallnote{%s}\n' % L(s['note']) if s.get('note') else ''
    take = '\\takeaway{%s}\n' % L(s['takeaway'])
    if s['side']:
        body = ('\\begin{columns}[T,onlytextwidth]\n\\begin{column}{0.63\\textwidth}\n'
                '{\\centering\\includegraphics[width=\\linewidth,height=0.82\\textheight,keepaspectratio]{%s}\\par}\n'
                '\\end{column}\n\\hfill\n\\begin{column}{0.34\\textwidth}\n%s\\vspace{4pt}\n%s%s\\end{column}\n\\end{columns}\n'
                % (s['fig'], cap, take, note))
    else:
        body = ('{\\centering\\includegraphics[width=\\linewidth,height=0.49\\textheight,keepaspectratio]{%s}\\par}\n'
                '\\vspace{3pt}\n%s%s%s' % (s['fig'], cap, take, note))
    return '\\begin{frame}{%s}\\relax\n%s\\end{frame}\n' % (L(s['title']), body)


def frame_title(s):
    return r"""{\setbeamercolor{background canvas}{bg=ink}
\begin{frame}[plain,noframenumbering]
\vspace*{1.55cm}
{\color{white}\fontsize{21}{26}\selectfont\bfseries %s\par}
\vspace{0.35cm}
{\color{accent}\large %s\par}
\vspace{1.1cm}
{\color{white}\normalsize\bfseries %s\par}
\vspace{2pt}
{\color{white!72!ink}\small %s\par}
\vspace{0.45cm}
{\color{white!72!ink}\small %s\par}
\end{frame}}
""" % (L(s['title']), L(s['subtitle']), L(s['author']), L(s['institute']), L(s['date']))


def frame_section(s):
    out = ''
    if s.get('appendix'):
        out += '\\appendix\n'
    out += '\\section{%s}\n' % L(s['title'])
    out += r"""{\setbeamercolor{background canvas}{bg=ink}
\begin{frame}[plain,noframenumbering]
\vspace*{2.0cm}
{\color{accent}\fontsize{40}{44}\selectfont\bfseries %s\par}
\vspace{0.3cm}
{\color{white}\fontsize{22}{26}\selectfont\bfseries %s\par}
\end{frame}}
""" % (s['number'], L(s['title']))
    return out


def frame_standout(s):
    chips = '\n'.join('  \\node[fill=white!12!ink,rounded corners=3pt,text width=4.15cm,minimum height=1.25cm,'
                      'align=left,font=\\small,text=white,inner sep=6pt] at (%.2f,0) {%s};' % (i * 4.75, L(c))
                      for i, c in enumerate(s['chips']))
    return r"""{\setbeamercolor{background canvas}{bg=ink}
\begin{frame}[plain,noframenumbering]
\vspace*{1.3cm}
\begin{center}
\begin{minipage}{0.86\textwidth}
{\color{white}\fontsize{17}{23}\selectfont\bfseries %s\par}
\end{minipage}

\vspace{1.0cm}
\begin{tikzpicture}
%s
\end{tikzpicture}
\end{center}
\end{frame}}
""" % (L(s['title']), chips)


def frame_references(s):
    keys = ','.join(REF_KEYS)
    return r"""\begin{frame}[allowframebreaks]{References}
\nocite{%s}
\tiny
\bibliographystyle{plainnat}
\bibliography{slides_refs}
\end{frame}
""" % keys


def main():
    parts = [PREAMBLE, '\\begin{document}\n']
    for i, s in enumerate(SLIDES):
        parts.append('\n%% ---------------------------------------------------------------- slide %d\n' % (i + 1))
        k = s['kind']
        if k == 'title':
            parts.append(frame_title(s))
        elif k == 'section':
            parts.append(frame_section(s))
        elif k == 'content':
            parts.append(frame_content(s))
        elif k == 'figure':
            parts.append(frame_figure(s))
        elif k == 'standout':
            parts.append(frame_standout(s))
        elif k == 'references':
            parts.append(frame_references(s))
        else:
            raise ValueError(k)
    parts.append('\n\\end{document}\n')
    with open(OUT, 'w') as f:
        f.write(''.join(parts))
    print('wrote', os.path.abspath(OUT))


if __name__ == '__main__':
    main()
