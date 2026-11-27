// Cover: one large radial "prototype" flower (the form people rated most beautiful),
// a short statement of the four design rules, and an index of all fifteen studies.
(() => {
  'use strict';
  if (!window.FlowerEngine) return;
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'cover', cover: true, seed: 7, art: .69, accent: '#e9a3b6',
    ambient: { rose: [202, 151, 169], leaf: [151, 171, 137], light: [210, 190, 155] },
    palettes: [
      palette('Rosewater', ['#6e2a47', '#d0698a', '#ffd9de'], { deep: '#5f2340', mid: '#cf6689', light: '#eea5b9', tip: '#ffe0e4', c: ['#f6d98a', '#d9a441', '#8a5a2a'] }),
      palette('Blue hour', ['#2b3a85', '#6f86dc', '#d8e0fb'], { deep: '#27347a', mid: '#6a80d6', light: '#a7b6ee', tip: '#e0e6fc', c: ['#f6e3a0', '#d9b04a', '#8a6a2a'] }),
      palette('Gold', ['#7a4a12', '#e0a62c', '#fff0b8'], { deep: '#7a4a12', mid: '#dd9f26', light: '#f1c75e', tip: '#fff1bd', c: ['#fff0b8', '#c98a1c', '#5a3a14'] }),
    ],
    build: () => ({}),
    draw(g, pal, T, d, U) {
      const R = 330;
      g.save();
      g.translate(500, 500);
      g.rotate(T * .02 * (U.REDUCED ? .2 : 1));
      [{ n: 13, len: .98, wid: .2, base: .2, off: 0, delay: .2 }, { n: 13, len: .82, wid: .19, base: .18, off: .24, delay: .7 },
        { n: 10, len: .62, wid: .17, base: .14, off: .1, delay: 1.2 }, { n: 8, len: .42, wid: .14, base: .08, off: .3, delay: 1.7 }].forEach((r) => {
        for (let i = 0; i < r.n; i++) {
          const o = U.open(T, r.delay + i * .05, 1.6);
          if (o <= 0) continue;
          g.save(); g.rotate(i / r.n * U.TAU + r.off); g.translate(r.base * R * o, 0);
          U.petal(g, { len: R * r.len * o, wid: R * r.wid, tip: .45, belly: .5, colors: [pal.deep, pal.mid, pal.light], veins: 2, vein: pal.vein });
          g.restore();
        }
      });
      const c = U.open(T, 2.2, 1.6);
      U.disc(g, R * .13 * c, pal.c);
      g.fillStyle = pal.c[2];
      for (let i = 1; i < 60; i++) { const r = R * .12 * Math.sqrt(i / 60) * c, a = i * U.GOLDEN; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 2, 0, U.TAU); g.fill(); }
      g.restore();
      U.motes(g, T, 26, 500, 500, 420, 380, [pal.tip, '#f1d5ac']);
    },
  });

  const OLD = [
    { id: 'top', name: 'Lilies', latin: 'Lilium', swatches: ['#ca97a9', '#97ab89', '#d2be9b'] },
    { id: 'peony-study', name: 'Peonies', latin: 'Paeonia', swatches: ['#71334b', '#c96383', '#ffd6dc'] },
    { id: 'violet-study', name: 'Violets', latin: 'Viola', swatches: ['#949fdd', '#8fb29d', '#d2bb84'] },
  ];
  const flowers = FlowerEngine.list().filter((d) => !d.cover);
  const familyFor = (id) => window.FlowerBotany?.[id]?.family || '';
  const entries = [
    ...OLD.map((item) => ({ ...item, family: familyFor(item.id) })),
    ...flowers.map((d) => ({ id: `${d.id}-study`, name: d.name, latin: d.latin, swatches: d.palettes[0].swatches, family: familyFor(d.id) })),
  ];
  const pad = (n) => String(n).padStart(2, '0');
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const families = [...new Set(entries.map((entry) => entry.family).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const rules = [
    ['One focal point', 'A single, centred, radial form reads fastest and was rated most beautiful.'],
    ['Few, ordered layers', 'Moderate complexity beats both bare and busy; symmetry axes add fluency.'],
    ['Neighbouring hues', 'Analogous colours were preferred over a single flat colour.'],
    ['Sharp edges, dark ground', 'Crisp contours helped ratings; the dark page keeps every edge legible.'],
  ];

  // Inserted at the start of <main> so the DOM order matches the visual order: nav, cover, index, studies.
  (document.getElementById('main') || document.body).insertAdjacentHTML('afterbegin', `
<section class="chapter study cover" id="cover-study" data-text="left" aria-labelledby="cover-title" style="--accent:#e9a3b6">
  <div class="scene">
    <canvas class="study-screen" id="cover-screen" role="img" aria-label="Animated drawing of one large radial flower, made of coloured text characters."></canvas>
  </div>
  <div class="page-shell">
    <div class="study-main"><section class="study-intro">
      <p class="eyebrow">A live field guide</p>
      <h1 id="cover-title" class="cover-title">Fifteen flowers,<br>drawn in <em>letters.</em></h1>
      <p class="intro-copy">Every bloom is redrawn thirty times a second and converted to characters. The compositions follow what research says people find beautiful in a flower.</p>
      <div class="intro-actions"><a class="button button-primary glass" href="#top"><span>Start with the lilies</span></a><a class="text-link" href="#notes">Read the research</a><button class="text-link experiment-trigger" id="open-experiments" type="button">Experiment with a flower</button></div>
    </section></div>
  </div>
</section>
<section class="cover-index" id="index" aria-labelledby="index-title">
  <div class="cover-index-inner">
    <h2 id="index-title">Four rules, <em>fifteen flowers.</em></h2>
    <ol class="rule-strip">${rules.map(([t, p], i) => `<li><span>${pad(i + 1)}</span><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol>
    <div class="study-filters" role="group" aria-label="Find a botanical study">
      <div class="study-filter-field study-search-field">
        <label for="study-search">Find a flower</label>
        <input id="study-search" type="search" autocomplete="off" placeholder="Common or scientific name" aria-describedby="study-filter-status">
      </div>
      <div class="study-filter-field study-family-field">
        <label for="study-family">Botanical family</label>
        <select id="study-family" aria-describedby="study-filter-status">
          <option value="">All families</option>
          ${families.map((family) => `<option value="${escapeHTML(family)}">${escapeHTML(family)}</option>`).join('')}
        </select>
      </div>
      <button class="text-link study-filter-reset" id="study-filter-reset" type="button" disabled>Clear filters</button>
    </div>
    <p class="study-filter-status" id="study-filter-status" role="status" aria-live="polite" aria-atomic="true" hidden></p>
    <p class="study-filter-empty" id="study-filter-empty" role="status" hidden>No studies match these filters.</p>
    <ul class="study-grid">${entries.map((entry, i) => `<li data-common-name="${escapeHTML(entry.name)}" data-latin-name="${escapeHTML(entry.latin)}" data-family="${escapeHTML(entry.family)}"><a href="#${escapeHTML(entry.id)}"><span class="num">${pad(i + 1)}</span><span class="dots" aria-hidden="true">${entry.swatches.map((c) => `<i style="background:${c}"></i>`).join('')}</span><strong>${escapeHTML(entry.name)}</strong><em>${escapeHTML(entry.latin)}</em></a></li>`).join('')}</ul>
  </div>
</section>`);
})();
