"""Inline markup handling shared by the Beamer and PowerPoint generators.

Text strings in deck_spec.py may contain
  $...$    inline LaTeX math
  **...**  bold
  !!...!!  accent color
to_latex() turns such a string into LaTeX for Beamer.
to_runs() turns it into a list of styled runs for PowerPoint, rendering simple
inline math with Unicode symbols, italic letters and sub/superscripts.
"""
import re

GREEK = {
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'varepsilon': 'ε', 'epsilon': 'ϵ',
    'kappa': 'κ', 'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'pi': 'π', 'rho': 'ρ', 'sigma': 'σ',
    'tau': 'τ', 'phi': 'φ', 'chi': 'χ', 'omega': 'ω', 'theta': 'θ', 'ell': 'ℓ',
}
GREEK_UPRIGHT = {'Delta': 'Δ', 'Phi': 'Φ', 'Lambda': 'Λ', 'Pi': 'Π', 'Sigma': 'Σ', 'Theta': 'Θ', 'Omega': 'Ω'}
SYMBOLS = {
    'leq': '≤', 'geq': '≥', 'le': '≤', 'ge': '≥', 'to': '→', 'approx': '≈', 'times': '×',
    'in': '∈', 'cdot': '·', 'ldots': '…', 'dots': '…', 'infty': '∞', 'iff': '⟺', 'propto': '∝',
    'neq': '≠', 'pm': '±', 'dagger': '†', 'sum': '∑', 'min': 'min', 'max': 'max', 'mid': '|',
    'prime': '′', 'quad': '\u2003', 'qquad': '\u2003\u2003', ',': '\u2009', ';': ' ', ':': ' ',
    '!': '', ' ': ' ', '%': '%', '&': '&', '#': '#', '{': '{', '}': '}',
}
SCRIPT = {'R': 'ℛ', 'L': 'ℒ', 'F': 'ℱ', 'H': 'ℋ'}
BLACKBOARD = {'E': '𝔼', 'R': 'ℝ', 'Z': 'ℤ', 'N': 'ℕ'}
IGNORE = {'left', 'right', 'bigl', 'bigr', 'Bigl', 'Bigr', 'big', 'Big', 'displaystyle', 'limits'}


# ----------------------------------------------------------------- LaTeX side
def _escape_text(s):
    s = s.replace('\\', r'\textbackslash{}')
    for a, b in (('&', r'\&'), ('%', r'\%'), ('#', r'\#'), ('_', r'\_')):
        s = s.replace(a, b)
    s = s.replace('\u2192', r'$\to$').replace('\u2212', r'$-$').replace('\u2248', r'$\approx$')
    s = s.replace('\n', r'\\ ')
    return s


def to_latex(s):
    """Markup string -> LaTeX. Bold and accent spans may contain math."""
    out = []
    bold = accent = False
    for i, part in enumerate(re.split(r'(\$[^$]*\$)', s)):
        if i % 2 == 1:
            out.append(part)
            continue
        for tok in re.split(r'(\*\*|!!)', part):
            if tok == '**':
                out.append('}' if bold else r'\textbf{')
                bold = not bold
            elif tok == '!!':
                out.append('}' if accent else r'\alert{')
                accent = not accent
            elif tok:
                out.append(_escape_text(tok))
    return ''.join(out)


# ----------------------------------------------------------------- run side
def _tokenize(s):
    toks, i = [], 0
    while i < len(s):
        c = s[i]
        if c == '\\':
            m = re.match(r'\\([A-Za-z]+)', s[i:])
            if m:
                toks.append(('cmd', m.group(1)))
                i += len(m.group(0))
                continue
            toks.append(('cmd', s[i + 1] if i + 1 < len(s) else ''))
            i += 2
            continue
        if c in '{}_^':
            toks.append((c, c))
        elif c == ' ':
            pass
        else:
            toks.append(('ch', c))
        i += 1
    return toks


class _MathParser:
    def __init__(self, s, base):
        self.t = _tokenize(s)
        self.i = 0
        self.base = base
        self.runs = []

    def emit(self, text, st):
        if not text:
            return
        self.runs.append(dict(text=text, italic=st.get('italic', False), bold=st.get('bold', False) or self.base.get('bold', False),
                              sub=st.get('sub', False), sup=st.get('sup', False), accent=self.base.get('accent', False)))

    def parse_seq(self, st, until_close=False):
        while self.i < len(self.t):
            k, v = self.t[self.i]
            if k == '}':
                self.i += 1
                if until_close:
                    return
                continue
            self.parse_item(st)

    def parse_arg(self, st):
        """Parse one argument: a group or a single token."""
        if self.i >= len(self.t):
            return
        k, v = self.t[self.i]
        if k == '{':
            self.i += 1
            self.parse_seq(st, until_close=True)
        else:
            self.parse_item(st)

    def parse_item(self, st):
        k, v = self.t[self.i]
        self.i += 1
        if k == '{':
            self.parse_seq(st, until_close=True)
        elif k in '_^':
            st2 = dict(st)
            if k == '_':
                st2['sub'] = True
            else:
                st2['sup'] = True
            st2['italic_default'] = st.get('italic_default', True)
            self.parse_arg(st2)
        elif k == 'ch':
            self.emit_char(v, st)
        elif k == 'cmd':
            self.emit_cmd(v, st)

    def emit_char(self, c, st):
        letters_italic = st.get('italic_default', True)
        if c.isalpha():
            if st.get('script'):
                c = SCRIPT.get(c, c)
                self.emit(c, dict(st, italic=False))
            elif st.get('bb'):
                self.emit(BLACKBOARD.get(c, c), dict(st, italic=False))
            else:
                self.emit(c, dict(st, italic=letters_italic))
        else:
            c = {'-': '\u2212', "'": '\u2032', '~': ' '}.get(c, c)
            if c in '=<>' and not (st.get('sub') or st.get('sup')):
                c = ' ' + c + ' '
            self.emit(c, dict(st, italic=False))

    def emit_cmd(self, name, st):
        if name in IGNORE:
            return
        if name in ('mathrm', 'text', 'textrm', 'operatorname', 'mathsf'):
            self.parse_arg(dict(st, italic_default=False))
        elif name in ('mathscr', 'mathcal'):
            self.parse_arg(dict(st, script=True))
        elif name == 'mathbb':
            self.parse_arg(dict(st, bb=True))
        elif name in ('boldsymbol', 'bm', 'mathbf'):
            self.parse_arg(dict(st, bold=True))
        elif name in ('bar', 'overline', 'dot', 'hat', 'tilde'):
            mark = {'bar': '\u0304', 'overline': '\u0304', 'dot': '\u0307', 'hat': '\u0302', 'tilde': '\u0303'}[name]
            n = len(self.runs)
            self.parse_arg(st)
            if len(self.runs) > n:
                self.runs[-1]['text'] += mark
        elif name in ('frac', 'tfrac', 'dfrac'):
            self.parse_arg(st)
            self.emit('/', dict(st, italic=False))
            self.parse_arg(st)
        elif name in GREEK:
            self.emit(GREEK[name], dict(st, italic=st.get('italic_default', True)))
        elif name in GREEK_UPRIGHT:
            self.emit(GREEK_UPRIGHT[name], dict(st, italic=False))
        elif name in SYMBOLS:
            sym = SYMBOLS[name]
            if name in ('leq', 'geq', 'le', 'ge', 'approx', 'iff', 'propto', 'neq', 'in', 'to') \
                    and not (st.get('sub') or st.get('sup')):
                sym = ' ' + sym + ' '
            self.emit(sym, dict(st, italic=False))
        else:
            self.emit(name, dict(st, italic=False))


def _merge(runs):
    out = []
    keys = ('italic', 'bold', 'sub', 'sup', 'accent')
    for r in runs:
        if out and all(out[-1][k] == r[k] for k in keys):
            out[-1]['text'] += r['text']
        else:
            out.append(dict(r))
    return out


def to_runs(s):
    """Markup string -> list of runs {text, italic, bold, sub, sup, accent}."""
    runs = []
    bold = accent = False
    for i, part in enumerate(re.split(r'(\$[^$]*\$)', s)):
        if i % 2 == 1:
            p = _MathParser(part[1:-1], dict(bold=bold, accent=accent))
            p.parse_seq({'italic_default': True})
            runs.extend(p.runs)
            continue
        for tok in re.split(r'(\*\*|!!)', part):
            if tok == '**':
                bold = not bold
            elif tok == '!!':
                accent = not accent
            elif tok:
                runs.append(dict(text=tok, italic=False, bold=bold, sub=False, sup=False, accent=accent))
    return _merge(runs)


def plain(s):
    return ''.join(r['text'] for r in to_runs(s))


if __name__ == '__main__':
    for s in [r"Strengths $\alpha$, $\beta$ and $r_{\mathrm{R}}^*$ with $\bar\rho\approx\omega_{\mathrm{C}}\bar\rho_{\mathrm{C}}$",
              r"**Selected:** SC $(2,0)$; $\Delta g\geq0.8$ and $\bar d\leq0.1$, $K=k_1+k_2$",
              r"$\mathscr{R}'(1)=1-\alpha$ and $\alpha\leq1-c/b$ (!!key!!)"]:
        print(to_latex(s))
        print(to_runs(s))
