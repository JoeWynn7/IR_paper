"""Format the works cited in the talk as styled runs for the References deck.

The list holds every author-year citation that appears on the slides or in the
speaker notes of the five section decks. Entries are formatted in Nature style from
Manuscript_doc/latex_file/references.bib and written to <out.json> as runs
(text, italic, bold) together with the short citation used on the slides.

Usage: python3 build_refs.py <out.json>
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BIB = os.path.join(HERE, '..', '..', 'Manuscript_doc', 'latex_file', 'references.bib')

# short citation as written on the slides -> bib key
CITED = [
    ('Blumstein & Nakamura 2009', 'blumstein2009'),
    ('Clark et al. 2020', 'clark2020'),
    ('Fujimoto & Ohtsuki 2022', 'fujimoto2022'),
    ('Fujimoto & Ohtsuki 2023', 'fujimoto2023'),
    ('Hilbe et al. 2018', 'hilbe2018'),
    ('Iyengar et al. 2019', 'iyengar2019'),
    ('Kawakatsu et al. 2024', 'kawakatsu2024'),
    ('Kessinger et al. 2023', 'kessinger2023'),
    ('Michel-Mata et al. 2024', 'michelmata2024'),
    ('Murase & Hilbe 2024a', 'murase2024computational'),
    ('Murase & Hilbe 2024b', 'murase2024synchronization'),
    ('Nowak & Sigmund 1998', 'nowak1998'),
    ('Nowak & Sigmund 2005', 'nowak2005'),
    ('Ohtsuki & Iwasa 2004', 'ohtsuki2004'),
    ('Ohtsuki & Iwasa 2006', 'ohtsuki2006'),
    ('Okada 2020', 'okada2020dilemmas'),
    ('Ostrom 1990', 'ostrom1990'),
    ('Pires & Santos 2025', 'pires2025'),
    ('Radzvilavicius et al. 2019', 'radzvilavicius2019'),
    ('Radzvilavicius et al. 2021', 'radzvilavicius2021'),
    ('Schmid et al. 2021', 'schmid2021'),
    ('Schmid et al. 2023', 'schmid2023'),
    ('Siegel et al. 2018', 'siegel2018'),
    ('Tadelis 2016', 'tadelis2016'),
    ('Takahashi & Mashima 2006', 'takahashi2006'),
    ('Tham et al. 2026', 'tham2026'),
    ('Uchida 2010', 'uchida2010'),
]

ACCENTS = {"'": '\u0301', '`': '\u0300', '"': '\u0308', '^': '\u0302', '~': '\u0303', 'c': '\u0327'}


def delatex(s):
    import unicodedata
    def acc(m):
        return unicodedata.normalize('NFC', m.group(2) + ACCENTS[m.group(1)])
    s = re.sub(r"\{\\([\'`\"^~c])\s*\{?(\w)\}?\}", acc, s)
    s = re.sub(r"\\([\'`\"^~])\{?(\w)\}?", acc, s)
    s = s.replace('--', '\u2013').replace('\\&', '&').replace('~', '\u00a0')
    s = s.replace('{', '').replace('}', '')
    return re.sub(r'\s+', ' ', s).strip()


def entries():
    text = open(BIB, encoding='utf-8').read()
    out = {}
    for m in re.finditer(r'@(\w+)\{([^,]+),(.*?)\n\}', text, re.S):
        typ, key, body = m.group(1).lower(), m.group(2).strip(), m.group(3)
        fields = {}
        for fm in re.finditer(r'(\w+)\s*=\s*\{((?:[^{}]|\{[^{}]*\})*)\}', body, re.S):
            fields[fm.group(1).lower()] = fm.group(2)
        out[key] = (typ, fields)
    return out


def initials(first):
    parts = []
    for tok in first.replace('.', '. ').split():
        tok = tok.strip()
        if not tok:
            continue
        if '-' in tok and not tok.endswith('.'):
            parts.append('-'.join(p[0] + '.' for p in tok.split('-') if p))
        elif tok.endswith('.'):
            parts.append(tok)
        else:
            parts.append(tok[0] + '.')
    return ' '.join(parts)


def authors(field):
    names = [delatex(a) for a in field.split(' and ')]
    fmt = []
    for n in names:
        if ',' in n:
            last, first = [x.strip() for x in n.split(',', 1)]
        else:
            last, first = n.split()[-1], ' '.join(n.split()[:-1])
        fmt.append(f'{last}, {initials(first)}' if first else last)
    if len(fmt) > 5:
        return fmt[0] + ' et al.'
    if len(fmt) == 1:
        return fmt[0]
    return ', '.join(fmt[:-1]) + ' & ' + fmt[-1]


def runs(typ, f):
    r = [{'text': authors(f['author']) + ' '}]
    title = delatex(f['title'])
    year = f.get('year', '')
    if typ == 'book':
        r += [{'text': title, 'italic': True}, {'text': f" ({delatex(f.get('publisher', ''))}, {year})."}]
    elif typ == 'inproceedings':
        r += [{'text': title + '. In '}, {'text': delatex(f.get('booktitle', '')), 'italic': True},
              {'text': f" ({delatex(f.get('publisher', ''))}, {year})."}]
    else:
        r += [{'text': title + '. '}, {'text': delatex(f.get('journal', '')), 'italic': True}, {'text': ' '}]
        if f.get('volume'):
            r += [{'text': f['volume'], 'bold': True}, {'text': ', '}]
        r += [{'text': f"{delatex(f.get('pages', ''))} ({year})."}]
    return r


def main():
    db = entries()
    out = []
    for cite, key in CITED:
        typ, f = db[key]
        out.append({'cite': cite, 'key': key, 'runs': runs(typ, f)})
    out.sort(key=lambda e: e['cite'].lower())
    with open(sys.argv[1], 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    for e in out:
        print(e['cite'], '|', ''.join(x['text'] for x in e['runs']))


if __name__ == '__main__':
    main()
