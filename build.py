"""Rebuild index.html: inlines src/report.html into src/index.src.html. Run: python3 build.py"""
from pathlib import Path
here = Path(__file__).parent
src = (here / 'src/index.src.html').read_text()
report = (here / 'src/report.html').read_text()
(here / 'index.html').write_text(src.replace('<!--REPORT-->', report))
print('index.html built')
