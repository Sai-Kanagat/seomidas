"""Build both language versions.

index.html     English  (src/index.src.html + src/report.html)
it/index.html  Italian  (src/index.src.it.html + src/report.partA.it.html + src/report.partB.it.html)

Run: python3 build.py
"""
from pathlib import Path

here = Path(__file__).parent
src = here / 'src'
BASE = 'https://sai-kanagat.github.io/seomidas/'

THEME_BTN = '<button class="tb-btn" id="theme-btn"'


def toggle(href, code, label):
    return (f'<a class="tb-btn" id="lang-btn" href="{href}" hreflang="{code}" lang="{code}" '
            f'aria-label="{label}"><span>{code.upper()}</span></a>\n  ')


def alternates():
    return (f'<link rel="alternate" hreflang="en" href="{BASE}">\n'
            f'<link rel="alternate" hreflang="it" href="{BASE}it/">\n')


def build(template, report, out, lang_link):
    html = template.read_text()
    assert '<!--REPORT-->' in html and THEME_BTN in html, template
    html = html.replace('<!--REPORT-->', report)
    html = html.replace(THEME_BTN, lang_link + THEME_BTN, 1)
    html = html.replace('</head>', alternates() + '</head>', 1)
    out.parent.mkdir(exist_ok=True)
    out.write_text(html)
    print('built', out.relative_to(here))


build(src / 'index.src.html', (src / 'report.html').read_text(), here / 'index.html',
      toggle('it/', 'it', 'Versione italiana'))

it_tpl = src / 'index.src.it.html'
if it_tpl.exists():
    report_it = (src / 'report.partA.it.html').read_text() + (src / 'report.partB.it.html').read_text()
    build(it_tpl, report_it, here / 'it' / 'index.html', toggle('../', 'en', 'English version'))
