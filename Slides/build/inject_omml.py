"""Replace equation pictures by native, editable Office Math objects.

make_pptx.js inserts every display equation as a picture named
"EQ:<id>:<n>:<column x>:<column width>:<scale>". This script wraps each such
<p:pic> in the structure PowerPoint itself writes for equations:

  <mc:AlternateContent>
    <mc:Choice Requires="a14">  text box with <a14:m><m:oMathPara>...</m:oMathPara></a14:m>
    <mc:Fallback>               the original picture

PowerPoint 2010 and later show the editable equation; other readers show the picture.
Usage: python inject_omml.py <asset_dir> <in.pptx> <out.pptx>
"""
import json
import re
import sys
import zipfile

ASSETS, SRC, DST = sys.argv[1:4]
EQ = json.load(open(ASSETS + '/deck.json'))['equations']
EMU = 914400
MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006'
A14 = 'http://schemas.microsoft.com/office/drawing/2010/main'
MATH = 'http://schemas.openxmlformats.org/officeDocument/2006/math'

PIC_RE = re.compile(r'<p:pic>(?:(?!</p:pic>).)*?name="EQ:([^"]+)"(?:(?!</p:pic>).)*?</p:pic>', re.S)


P_RE = re.compile(r'<a:p>(?:(?!</a:p>).)*?</a:p>', re.S)
PPR_RE = re.compile(r'<a:pPr\b[^>]*/>|<a:pPr\b[^>]*>.*?</a:pPr>', re.S)


def fix_paragraphs(xml):
    """Keep only the leading <a:pPr> of each paragraph.

    pptxgenjs writes an extra <a:pPr> before every run that lacks paragraph options,
    which is not allowed by the schema and makes readers drop the bullet.
    """
    def fix(m):
        p = m.group(0)
        first_run = p.find('<a:r>')
        out, last, kept = [], 0, False
        for mm in PPR_RE.finditer(p):
            out.append(p[last:mm.start()])
            if not kept and (first_run == -1 or mm.start() < first_run):
                out.append(mm.group(0))
                kept = True
            last = mm.end()
        out.append(p[last:])
        return ''.join(out)
    return P_RE.sub(fix, xml)


def textbox(sid, eid, x, y, w, h, omml, sz):
    return (
        '<p:sp><p:nvSpPr><p:cNvPr id="%d" name="Equation %s"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>'
        '<p:spPr><a:xfrm><a:off x="%d" y="%d"/><a:ext cx="%d" cy="%d"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
        '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="ctr">'
        '<a:noAutofit/></a:bodyPr><a:lstStyle/>'
        '<a:p><a:pPr algn="ctr"/><a14:m>%s</a14:m><a:endParaRPr lang="en-US" sz="%d" dirty="0"/></a:p>'
        '</p:txBody></p:sp>' % (sid, eid, x, y, w, h, omml, sz))


def process(xml):
    ids = [int(i) for i in re.findall(r'<p:cNvPr id="(\d+)"', xml)]
    next_id = [max(ids or [1]) + 100]
    count = [0]

    def repl(m):
        pic = m.group(0)
        eid, _, colx, colw, scale = m.group(1).split(':')
        info = EQ[eid]
        off = re.search(r'<a:off x="(\d+)" y="(\d+)"/>', pic)
        ext = re.search(r'<a:ext cx="(\d+)" cy="(\d+)"/>', pic)
        y, h = int(off.group(2)), int(ext.group(2))
        x, w = int(float(colx) * EMU), int(float(colw) * EMU)
        sz = int(round(info['sz'] * float(scale) / 50.0)) * 50
        omml = info['omml'].replace('sz="%d"' % info['sz'], 'sz="%d"' % sz)
        omml = omml.replace('<m:oMathPara>', '<m:oMathPara xmlns:m="%s">' % MATH, 1)
        sid = next_id[0]
        next_id[0] += 1
        count[0] += 1
        return ('<mc:AlternateContent xmlns:mc="%s"><mc:Choice xmlns:a14="%s" Requires="a14">%s</mc:Choice>'
                '<mc:Fallback>%s</mc:Fallback></mc:AlternateContent>'
                % (MC, A14, textbox(sid, eid, x, y, w, h, omml, sz), pic))

    return PIC_RE.sub(repl, xml), count[0]


def main():
    zin = zipfile.ZipFile(SRC)
    zout = zipfile.ZipFile(DST, 'w', zipfile.ZIP_DEFLATED)
    total = 0
    for item in zin.infolist():
        data = zin.read(item.filename)
        if re.match(r'ppt/slides/slide\d+\.xml$', item.filename):
            xml, n = process(fix_paragraphs(data.decode('utf-8')))
            total += n
            data = xml.encode('utf-8')
        zout.writestr(item, data)
    zout.close()
    print('equations converted:', total)


if __name__ == '__main__':
    main()
