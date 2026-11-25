<a href="https://sai-kanagat.github.io/seomidas/"><img src=".github/assets/banner.svg" width="100%" alt="e-FEM x MIDAS. A beam mesh bends and recovers."></a>

# e-FEM x MIDAS Strategy Hub

A static site that merges the original interactive hub with the full "EFEM CAE SEO GEO Strategy" audit PDF. It has no build dependencies.

## What to copy into your repo

```
index.html          the site (the full PDF report is already inlined)
assets/styles.css   design system (light + dark)
assets/app.js       interactions
assets/data.js      keywords, 100 FAQs, NAFEMS rows, roadmap (verbatim from the original hub)
```

`src/` and `build.py` are optional. They are only needed to regenerate `index.html`:

- `src/index.src.html` is the page template
- `src/report.html` is the PDF as HTML
- run `python3 build.py` after editing either file

## Embedding in Notion

1. Turn on GitHub Pages: repo Settings, then Pages, deploy from your branch, root folder.
2. In Notion, type `/embed`, paste the `https://<user>.github.io/<repo>/` URL, and drag the block to full width and roughly 900px tall.
3. Deep links work, for example `.../#ch5` (TCO calculator), `.../#faq-vault` or `.../#report`.

## Notes

- The theme follows the viewer's system setting. The toggle choice is saved per browser.
- Roadmap checkmarks are saved per browser, in localStorage. They are not shared between people.
- External requests: Google Fonts (IBM Plex) and Chart.js 4.4.1 from cdnjs. The charts each have an HTML table fallback.
- `noindex` is set, because this is an internal strategy document.
