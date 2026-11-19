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

  const OLD = [['top', 'Lilies', 'Lilium', ['#ca97a9', '#97ab89', '#d2be9b']], ['peony-study', 'Peonies', 'Paeonia', ['#71334b', '#c96383', '#ffd6dc']], ['violet-study', 'Violets', 'Viola', ['#949fdd', '#8fb29d', '#d2bb84']]];
  const flowers = FlowerEngine.list().filter((d) => !d.cover);
  const entries = [...OLD, ...flowers.map((d) => [`${d.id}-study`, d.name, d.latin, d.palettes[0].swatches])];
  const pad = (n) => String(n).padStart(2, '0');
  const rules = [
    ['One focal point', 'A single, centred, radial form reads fastest and was rated most beautiful.'],
    ['Few, ordered layers', 'Moderate complexity beats both bare and busy; symmetry axes add fluency.'],
    ['Neighbouring hues', 'Analogous colours were preferred over a single flat colour.'],
    ['Sharp edges, dark ground', 'Crisp contours helped ratings; the dark page keeps every edge legible.'],
  ];

  document.body.insertAdjacentHTML('afterbegin', `
<section class="chapter study cover" id="cover-study" data-text="left" aria-labelledby="cover-title" style="--accent:#e9a3b6">
  <div class="scene" aria-hidden="true">
    <canvas class="ambient-ascii" data-ambient-theme="cover" aria-hidden="true"></canvas>
    <canvas class="study-screen" id="cover-screen"></canvas>
    <div class="scene-vignette"></div><div class="scene-grain"></div>
  </div>
  <div class="page-shell">
    <header class="topbar glass" aria-label="Site header">
      <span data-wordmark></span>
      <div class="header-meta"><nav class="chapter-links" aria-label="Sections"><a href="#index">STUDIES</a><a href="#notes">RESEARCH</a></nav><span class="edition">15 STUDIES <i></i> 30 FPS</span></div>
    </header>
    <main class="study-main"><section class="study-intro">
      <p class="eyebrow"><span class="eyebrow-rule"></span> A LIVE FIELD GUIDE</p>
      <h1 id="cover-title" class="cover-title">Fifteen flowers,<br>drawn in <em>letters.</em></h1>
      <p class="intro-copy">Every bloom is redrawn thirty times a second and converted to characters. The compositions follow what research says people find beautiful in a flower.</p>
      <div class="intro-actions"><a class="button button-primary glass" href="#top"><span>Start with the lilies</span></a><a class="text-link" href="#notes">Read the research <span aria-hidden="true">\u2192</span></a></div>
    </section></main>
    <a class="scroll-cue glass-inset" href="#index"><span>ALL FIFTEEN STUDIES</span><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 3v11m-4-4 4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
  </div>
</section>
<section class="cover-index" id="index" aria-labelledby="index-title">
  <div class="cover-index-inner">
    <h2 id="index-title">Four rules, <em>fifteen flowers.</em></h2>
    <ol class="rule-strip">${rules.map(([t, p], i) => `<li><span>${pad(i + 1)}</span><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol>
    <ul class="study-grid">${entries.map(([id, name, latin, sw], i) => `<li><a href="#${id}"><span class="num">${pad(i + 1)}</span><span class="dots" aria-hidden="true">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><strong>${name}</strong><em>${latin}</em></a></li>`).join('')}</ul>
  </div>
</section>`);
})();
