/* e-FEM x MIDAS strategy hub: interactions. Data lives in data.js (globals). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const strip = s => { const d = document.createElement('div'); d.innerHTML = s; return d.textContent || ''; };
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const IT = document.documentElement.lang === 'it';
  const L = (en, it) => IT ? it : en;
  const catIT = { 'Core Product': 'Prodotto core', 'Competitor & Comparison': 'Concorrenti e confronti', 'Problem-Aware': 'Consapevolezza del problema', 'Trust & Industry': 'Fiducia e settore', 'Migration & Branded': 'Migrazione e brand' };
  const typeIT = { 'Linear Static': 'Statica lineare', 'Modal': 'Modale', 'Thermal': 'Termica' };
  const catL = c => IT ? (catIT[c] || c) : c;
  const typeL = t => IT ? (typeIT[t] || t) : t;
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.addEventListener('click', e => { e.preventDefault(); location.href = langBtn.getAttribute('href') + location.hash; });

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1600);
  }
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (_) {} ta.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = L('Copied', 'Copiato'); btn.classList.add('done'); setTimeout(() => { btn.textContent = o; btn.classList.remove('done'); }, 1500); }
    toast(L('Copied to clipboard', 'Copiato negli appunti'));
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy($('#' + b.dataset.copy).innerText, b)));

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  function currentTheme() {
    const a = root.getAttribute('data-theme');
    if (a) return a;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintThemeLabel() { $('#theme-lbl').textContent = currentTheme() === 'dark' ? L('Light', 'Chiaro') : L('Dark', 'Scuro'); }
  $('#theme-btn').addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); store.set('efem-theme-v', next);
    try { localStorage.setItem('efem-theme', next); } catch (e) {}
    paintThemeLabel(); restyleCharts();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { paintThemeLabel(); restyleCharts(); });
  paintThemeLabel();

  /* ---------- Mobile nav ---------- */
  const menuBtn = $('#menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#rail a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  /* ---------- Scrollspy + progress ---------- */
  const links = $$('#rail a');
  const targets = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  function onScroll() {
    const h = document.documentElement;
    const pct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    $('#progress-line').style.width = (pct * 100).toFixed(2) + '%';
    let cur = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top < 140) cur = t;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- NAFEMS ---------- */
  function renderNafems() {
    const f = $('#nafems-filter').value;
    const rows = nafemsBenchmarks.filter(b => f === 'ALL' || b.type === f);
    const max = 4;
    $('#nafems-tbody').innerHTML = rows.map(r => {
      const abs = Math.abs(parseFloat(r.delta));
      return `<tr>
        <td class="mono strong">${esc(r.id)}<span class="sub">${esc(r.desc)}</span></td>
        <td>${esc(typeL(r.type))}</td>
        <td class="mono">${esc(r.ref)}</td>
        <td class="mono strong">${esc(r.ibm)}</td>
        <td><span class="delta">${esc(r.delta)}</span></td>
        <td class="hide-sm"><div class="bar-cell"><i style="width:${(abs / max * 100).toFixed(0)}%"></i><span class="mono">${abs.toFixed(2)}%</span></div></td>
      </tr>`;
    }).join('');
    const errs = rows.map(r => Math.abs(parseFloat(r.delta)));
    const mean = errs.reduce((a, b) => a + b, 0) / (errs.length || 1);
    $('#nafems-summary').innerHTML = IT ? `${rows.length} benchmark · errore medio |e| <b>${mean.toFixed(2)}%</b> · peggiore <b>${Math.max(...errs).toFixed(2)}%</b>. Scala barre: 4% = larghezza piena.` : `${rows.length} benchmark${rows.length === 1 ? '' : 's'} · mean |error| <b>${mean.toFixed(2)}%</b> · worst <b>${Math.max(...errs).toFixed(2)}%</b>. Bar scale: 4% = full width.`;
  }
  $('#nafems-filter').addEventListener('change', renderNafems);

  /* ---------- Keywords ---------- */
  $('#rail-kw').textContent = allKeywords.length;
  let kwFiltered = allKeywords;
  function renderKwMix() {
    const cats = {};
    allKeywords.forEach(k => { cats[k.cat] = cats[k.cat] || { EN: 0, IT: 0 }; cats[k.cat][k.lang === 'Italian' ? 'IT' : 'EN']++; });
    $('#kw-mix').innerHTML = Object.entries(cats).map(([c, v]) => `
      <button class="total" data-cat="${esc(c)}" style="text-align:left;cursor:pointer;font:inherit;color:inherit">
        <div class="k">${esc(catL(c))}</div>
        <div class="v">${v.EN + v.IT}</div>
        <div class="meta" style="margin-top:6px">EN ${v.EN} · IT ${v.IT}</div>
      </button>`).join('');
    $$('#kw-mix [data-cat]').forEach(b => b.addEventListener('click', () => {
      const sel = $('#kw-cat-select'); sel.value = sel.value === b.dataset.cat ? 'ALL' : b.dataset.cat; filterKw();
    }));
  }
  function filterKw() {
    const q = $('#kw-search-input').value.toLowerCase().trim();
    const lang = $('#kw-lang-select').value, cat = $('#kw-cat-select').value;
    kwFiltered = allKeywords.filter(k =>
      (!q || k.term.toLowerCase().includes(q) || (k.intentLabel || k.intent).toLowerCase().includes(q) || k.hub.toLowerCase().includes(q)) &&
      (lang === 'ALL' || k.lang === lang) && (cat === 'ALL' || k.cat === cat));
    $('#kw-visible-badge').textContent = `${kwFiltered.length} / ${allKeywords.length}`;
    $$('#kw-mix [data-cat]').forEach(b => b.style.borderColor = b.dataset.cat === cat ? 'var(--signal)' : '');
    const hl = s => q ? esc(s).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`) : esc(s);
    $('#keywords-tbody').innerHTML = kwFiltered.length ? kwFiltered.map(k => `<tr>
      <td class="mono" style="color:var(--muted)">${k.id}</td>
      <td class="strong">${hl(k.term)}</td>
      <td><span class="lang ${k.lang === 'Italian' ? 'it' : 'en'}">${k.lang === 'Italian' ? 'IT' : 'EN'}</span></td>
      <td>${esc(catL(k.cat))}</td>
      <td style="color:var(--muted)">${esc(k.intentLabel || k.intent)}</td>
      <td class="mono" style="color:var(--signal)">${esc(k.hub)}</td></tr>`).join('')
      : `<tr><td colspan="6" class="empty">${L('No keywords match. Clear the filters to see all', 'Nessuna keyword corrisponde. Azzera i filtri per vederle tutte e')} ${allKeywords.length}.</td></tr>`;
  }
  ['#kw-search-input', '#kw-lang-select', '#kw-cat-select'].forEach(s => $(s).addEventListener('input', filterKw));
  $('#kw-csv').addEventListener('click', () => {
    const rows = [['id', 'keyword', 'language', 'category', 'intent', 'target_hub'], ...kwFiltered.map(k => [k.id, k.term, k.lang, k.cat, k.intent, k.hub])];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'efem-keywords.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(L(`Exported ${kwFiltered.length} keywords`, `Esportate ${kwFiltered.length} keyword`));
  });

  /* ---------- FAQs ---------- */
  let faqFiltered = faqData;
  const chev = '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 3 5 5-5 5"/></svg>';
  function renderFaqs() {
    const q = $('#faq-search-input').value.toLowerCase().trim();
    const lang = $('#faq-lang-filter').value;
    faqFiltered = faqData.filter(i => (!q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q) || String(i.id) === q) && (lang === 'ALL' || i.lang === lang));
    $('#faq-counter-label').textContent = L(`Showing ${faqFiltered.length} of ${faqData.length} technical Q&As`, `${faqFiltered.length} di ${faqData.length} domande tecniche visualizzate`);
    const hl = s => q ? esc(s).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`) : esc(s);
    $('#faq-accordion-list').innerHTML = faqFiltered.length ? faqFiltered.map(i => `
      <details class="faq" id="faq-${i.id}"${q ? ' open' : ''}>
        <summary><span class="id">#${String(i.id).padStart(3, '0')}</span><span class="lang ${i.lang === 'IT' ? 'it' : 'en'}">${i.lang}</span><span class="q">${hl(i.q)}</span>${chev}</summary>
        <div class="a">${hl(i.a)}</div>
      </details>`).join('') : `<div class="empty">${L('No questions match that search.', 'Nessuna domanda corrisponde alla ricerca.')}</div>`;
  }
  $('#faq-search-input').addEventListener('input', renderFaqs);
  $('#faq-lang-filter').addEventListener('change', renderFaqs);
  $('#faq-expand').addEventListener('click', () => $$('#faq-accordion-list details').forEach(d => d.open = true));
  $('#faq-collapse').addEventListener('click', () => $$('#faq-accordion-list details').forEach(d => d.open = false));
  $('#faq-schema-btn').addEventListener('click', e => {
    const json = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqFiltered.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }))
    };
    copy(JSON.stringify(json, null, 2), e.currentTarget);
    toast(L(`FAQPage JSON-LD for ${faqFiltered.length} questions copied`, `FAQPage JSON-LD copiato per ${faqFiltered.length} domande`));
  });

  /* ---------- Roadmap ---------- */
  const RM_KEY = 'efem-roadmap-v1';
  let rmState = store.get(RM_KEY, {});
  function renderRoadmap() {
    let idx = 0;
    $('#roadmap-grid').innerHTML = roadmapData.map((p, pi) => {
      const tone = ['bad', 'info', 'warn', 'ok'][pi % 4];
      const items = p.items.map(t => {
        const id = 'rm-' + idx++;
        return `<label class="task${rmState[id] ? ' done' : ''}"><input type="checkbox" data-id="${id}"${rmState[id] ? ' checked' : ''}><span>${esc(t)}</span></label>`;
      }).join('');
      return `<article class="card ${tone} phase" data-phase="${pi}">
        <div class="phase-h"><div><span class="badge ${tone}">${esc(p.phase)}</span><h3>${esc(p.title)}</h3></div><span class="phase-pct" data-pct></span></div>
        <div class="phase-bar"><i data-bar></i></div>
        <div class="grid" style="gap:8px">${items}</div>
      </article>`;
    }).join('');
    $$('#roadmap-grid input').forEach(b => b.addEventListener('change', () => {
      rmState[b.dataset.id] = b.checked; store.set(RM_KEY, rmState);
      b.closest('.task').classList.toggle('done', b.checked); updateRoadmap();
    }));
    updateRoadmap();
  }
  function updateRoadmap() {
    const boxes = $$('#roadmap-grid input');
    const done = boxes.filter(b => b.checked).length;
    const pct = boxes.length ? Math.round(done / boxes.length * 100) : 0;
    $('#roadmap-pct-text').textContent = L(`${pct}% Complete (${done} / ${boxes.length})`, `${pct}% completato (${done} / ${boxes.length})`);
    $('#rm-meter').style.width = pct + '%';
    $('#rail-rm').textContent = pct + '%';
    $$('#roadmap-grid .phase').forEach(ph => {
      const b = $$('input', ph), d = b.filter(x => x.checked).length, p = Math.round(d / b.length * 100);
      $('[data-pct]', ph).textContent = `${d}/${b.length}`; $('[data-bar]', ph).style.width = p + '%';
    });
  }
  $('#rm-reset').addEventListener('click', () => { if (confirm(L('Clear all roadmap checkmarks in this browser?', 'Azzerare tutte le spunte della roadmap in questo browser?'))) { rmState = {}; store.set(RM_KEY, rmState); renderRoadmap(); } });

  /* ---------- Charts ---------- */
  let reviewChart, tcoChart;
  function chartDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = css('--mono') || 'monospace';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = css('--muted');
    Chart.defaults.borderColor = css('--line');
  }
  function reviewColors() { return [css('--bad'), css('--bad'), css('--warn'), css('--info'), css('--muted')]; }
  function tcoColors() { return [css('--signal'), css('--warn'), css('--muted')]; }
  function initCharts() {
    if (!window.Chart) { $$('.chart').forEach(c => c.innerHTML = `<div class="empty">${L('Chart library did not load. The data table shows the same numbers.', 'La libreria dei grafici non si è caricata. La tabella mostra gli stessi dati.')}</div>`); return; }
    chartDefaults();
    reviewChart = new Chart($('#reviewGateChart'), {
      type: 'bar',
      data: {
        labels: [L('midas MeshFree (Current)', 'midas MeshFree (attuale)'), L('midas NFX (Current)', 'midas NFX (attuale)'), L('AI LLM Inclusion Gate', 'Soglia di inclusione LLM'), 'Simcenter Simsolid', 'Ansys Mechanical'],
        datasets: [{ label: L('Verified B2B Reviews', 'Recensioni B2B verificate'), data: [0.6, 1, 10, 34, 707], backgroundColor: reviewColors(), borderRadius: 4, barThickness: 22 }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { left: 8 } },
        scales: {
          x: { type: 'logarithmic', min: 0.5, grid: { color: css('--line') }, ticks: { callback: v => [1, 10, 100, 1000].includes(v) ? v : '' } },
          y: { grid: { display: false }, ticks: { color: css('--ink-2'), font: { family: css('--sans'), size: innerWidth < 640 ? 10.5 : 12 } } }
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ctx.dataIndex === 0 ? L(' 0 Verified Reviews (Critical Gap)', ' 0 recensioni verificate (gap critico)') : ` ${ctx.raw} ${L('Verified Reviews', 'recensioni verificate')}` } }
        }
      }
    });
    tcoChart = new Chart($('#tcoChartCanvas'), {
      type: 'bar',
      data: {
        labels: [L('MIDAS MTS (All-in-One)', 'MIDAS MTS (tutto in uno)'), 'Simcenter Simsolid + CFD', L('Ansys / Abaqus Suite', 'Suite Ansys / Abaqus')],
        datasets: [
          { label: L('Software Licenses (€k)', 'Licenze software (k€)'), data: [81, 252, 468], backgroundColor: tcoColors()[0], borderRadius: 3 },
          { label: L('HPC / CPU Core Tax (€k)', 'Costi HPC / core CPU (k€)'), data: [0, 15, 36], backgroundColor: tcoColors()[1], borderRadius: 3 },
          { label: L('Meshing & Cleanup Labor (€k)', 'Lavoro di meshing e pulizia (k€)'), data: [92, 92, 263], backgroundColor: tcoColors()[2], borderRadius: 3 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: css('--ink-2'), font: { family: css('--sans'), size: 12 } } },
          y: { stacked: true, grid: { color: css('--line') }, ticks: { callback: v => '€' + v + 'k' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, color: css('--ink-2') } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: €${ctx.raw}k` } }
        }
      }
    });
    updateTCO();
  }
  function restyleCharts() {
    if (!reviewChart) return;
    chartDefaults();
    reviewChart.data.datasets[0].backgroundColor = reviewColors();
    const tc = tcoColors(); tcoChart.data.datasets.forEach((d, i) => d.backgroundColor = tc[i]);
    [reviewChart, tcoChart].forEach(c => {
      Object.values(c.options.scales).forEach(s => { if (s.grid && s.grid.color) s.grid.color = css('--line'); s.ticks.color = s.ticks.font ? css('--ink-2') : css('--muted'); });
      if (c.options.plugins.legend.labels) c.options.plugins.legend.labels.color = css('--ink-2');
      c.update('none');
    });
  }

  /* ---------- TCO (model identical to the original hub) ---------- */
  function updateTCO() {
    const engineers = +$('#tco-engineers').value, cores = +$('#tco-cores').value, hours = +$('#tco-hours').value, needCfd = $('#tco-cfd').checked;
    $('#lbl-engineers').textContent = IT ? `${engineers} ingegner${engineers === 1 ? 'e' : 'i'}` : `${engineers} Engineer${engineers === 1 ? '' : 's'}`;
    $('#lbl-cores').textContent = `${cores} core`;
    $('#lbl-hours').textContent = L(`${hours} hrs/wk`, `${hours} h/sett`);
    const extraCorePacks = Math.max(0, Math.ceil((cores - 8) / 8));
    const annualMeshingLaborTrad = (engineers * hours * 46 * 55) / 1000;
    const annualMeshingLaborMidas = annualMeshingLaborTrad * 0.35;
    const midasLic = Math.round(engineers * (20 + 3.5 * 2)), midasHpc = 0, midasLabor = Math.round(annualMeshingLaborMidas * 3);
    const midasTotal = midasLic + midasHpc + midasLabor;
    const simsolidLic = Math.round(engineers * (needCfd ? 28 : 15) * 3), simsolidHpc = Math.round(engineers * extraCorePacks * 2.5 * 3), simsolidLabor = midasLabor;
    const simsolidTotal = simsolidLic + simsolidHpc + simsolidLabor;
    const ansysLic = Math.round(engineers * (needCfd ? 52 : 36) * 3), ansysHpc = Math.round(engineers * extraCorePacks * 6 * 3), ansysLabor = Math.round(annualMeshingLaborTrad * 3);
    const ansysTotal = ansysLic + ansysHpc + ansysLabor;
    $('#stat-midas-total').textContent = `€${midasTotal}k`;
    $('#stat-simsolid-total').textContent = `€${simsolidTotal}k`;
    $('#stat-ansys-total').textContent = `€${ansysTotal}k`;
    const reclaimed = Math.round((annualMeshingLaborTrad - annualMeshingLaborMidas) * 3);
    $('#tco-savings-banner').innerHTML = IT
      ? `<b>Risparmio netto a 3 anni: €${ansysTotal - midasTotal}k vs. Ansys/Abaqus · €${simsolidTotal - midasTotal}k vs. SimSolid</b>
      <p>Include €0 di costi per core CPU/GPU e €${reclaimed}k di ore di ingegneria recuperate.</p>`
      : `<b>3-Year Net Savings: €${ansysTotal - midasTotal}k vs. Ansys/Abaqus · €${simsolidTotal - midasTotal}k vs. SimSolid</b>
      <p>Includes €0 CPU/GPU core fees and €${reclaimed}k in reclaimed engineering hours.</p>`;
    if (tcoChart) {
      tcoChart.data.datasets[0].data = [midasLic, simsolidLic, ansysLic];
      tcoChart.data.datasets[1].data = [midasHpc, simsolidHpc, ansysHpc];
      tcoChart.data.datasets[2].data = [midasLabor, simsolidLabor, ansysLabor];
      tcoChart.update();
    }
  }
  ['#tco-engineers', '#tco-cores', '#tco-hours', '#tco-cfd'].forEach(s => $(s).addEventListener('input', updateTCO));

  /* ---------- Command palette ---------- */
  const index = [];
  function buildIndex() {
    $$('.sec').forEach(s => { const h = $('h2', s); if (h) index.push({ t: L('Section', 'Sezione'), sec: true, x: h.textContent, sub: ($('.sec-kicker', s) || {}).textContent || '', href: '#' + s.id }); });
    $$('.report .rp-h2, .report .rp-h3').forEach((h, i) => { if (!h.id) h.id = 'rph-' + i; index.push({ t: 'Report', x: h.textContent.replace(/^\d+\s*/, ''), sub: L('Full audit report', 'Report completo'), href: '#' + h.id }); });
    $$('.report p, .report li, .report td').forEach((p, i) => { if (!p.id) p.id = 'rpp-' + i; index.push({ t: 'Report', x: p.textContent, body: true, href: '#' + p.id }); });
    faqData.forEach(f => index.push({ t: 'FAQ ' + f.lang, x: f.q, sub: f.a, href: '#faq-' + f.id, faq: f.id }));
    allKeywords.forEach(k => index.push({ t: 'Keyword', x: k.term, sub: `${catL(k.cat)} · ${k.hub}`, href: '#keywords-db', kw: k.term }));
  }
  let sel = 0, results = [];
  function search(q) {
    q = q.toLowerCase().trim();
    if (!q) { results = index.filter(r => r.sec); }
    else {
      const words = q.split(/\s+/);
      results = index.map(r => {
        const hay = (r.x + ' ' + (r.sub || '')).toLowerCase();
        if (!words.every(w => hay.includes(w))) return null;
        let s = r.x.toLowerCase().includes(q) ? 3 : 1; if (r.sec) s += 3; if (r.body) s -= 1;
        return [s, r];
      }).filter(Boolean).sort((a, b) => b[0] - a[0]).slice(0, 40).map(x => x[1]);
    }
    sel = 0; paint(q);
  }
  function snippet(text, q) {
    const i = q ? text.toLowerCase().indexOf(q.split(/\s+/)[0]) : -1;
    const s = i > 60 ? '…' + text.slice(i - 50, i + 110) : text.slice(0, 160);
    return esc(s);
  }
  function paint(q) {
    $('#palette-res').innerHTML = results.length ? results.map((r, i) => `
      <a class="pr${i === sel ? ' sel' : ''}" href="${r.href}" data-i="${i}">
        <span class="t">${esc(r.t)}</span>
        <span class="x">${r.body ? snippet(r.x, q) : esc(r.x)}${r.sub && !r.body ? `<small>${snippet(r.sub, q)}</small>` : ''}</span>
      </a>`).join('') : `<div class="empty">${L('Nothing found.', 'Nessun risultato.')}</div>`;
    $$('#palette-res .pr').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(results[+a.dataset.i]); }));
  }
  function go(r) {
    if (!r) return; closePalette();
    if (r.kw) { $('#kw-search-input').value = r.kw; $('#kw-lang-select').value = 'ALL'; $('#kw-cat-select').value = 'ALL'; filterKw(); }
    if (r.faq) { $('#faq-search-input').value = ''; $('#faq-lang-filter').value = 'ALL'; renderFaqs(); }
    const el = $(r.href); if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ block: r.body ? 'center' : 'start' });
    if (r.body || r.faq) { el.style.transition = 'background .6s'; el.style.background = 'var(--signal-soft)'; setTimeout(() => el.style.background = '', 1400); }
  }
  function openPalette() { $('#palette').classList.add('open'); const i = $('#palette-input'); i.value = ''; search(''); setTimeout(() => i.focus(), 0); }
  function closePalette() { $('#palette').classList.remove('open'); }
  $('#search-btn').addEventListener('click', openPalette);
  $('#palette').addEventListener('click', e => { if (e.target.id === 'palette') closePalette(); });
  $('#palette-input').addEventListener('input', e => search(e.target.value));
  $('#palette-input').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(results.length - 1, sel + 1); paint($('#palette-input').value); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); paint($('#palette-input').value); e.preventDefault(); }
    else if (e.key === 'Enter') { go(results[sel]); e.preventDefault(); }
    const s = $('#palette-res .sel'); if (s) s.scrollIntoView({ block: 'nearest' });
  });
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape') closePalette();
  });

  /* ---------- Report citations: smooth jump + back ---------- */
  $$('.report sup.cite a').forEach(a => a.setAttribute('title', (($(a.getAttribute('href')) || {}).textContent || '').trim().slice(0, 140)));

  /* ---------- Boot ---------- */
  renderNafems(); renderKwMix(); filterKw(); renderFaqs(); renderRoadmap(); buildIndex();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const jump = () => { const t = location.hash && document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); };
  jump(); addEventListener('load', jump); if (document.fonts) document.fonts.ready.then(jump);
  if (document.readyState === 'complete') initCharts(); else addEventListener('load', initCharts);
})();
