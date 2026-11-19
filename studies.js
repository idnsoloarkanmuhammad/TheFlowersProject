// Builds the twelve newer chapters from the flower registry, wires their
// controls, and replaces the old three-link header nav with a 15-study index.
(() => {
  'use strict';

  const allDefs = window.FlowerEngine ? FlowerEngine.list() : [];
  const defs = allDefs.filter((d) => !d.cover);
  if (!defs.length) return;

  const pad = (n) => String(n).padStart(2, '0');
  const ORDER = [
    { id: 'top', name: 'Lilies' }, { id: 'peony-study', name: 'Peonies' }, { id: 'violet-study', name: 'Violets' },
    ...defs.map((d) => ({ id: `${d.id}-study`, name: d.name })),
  ];
  const TOTAL = ORDER.length;

  window.AmbientThemes = Object.fromEntries(allDefs.map((d) => [d.id, d.ambient]));

  const navHTML = (i) => {
    const prev = ORDER[i - 1], next = ORDER[i + 1];
    return `${prev ? `<a href="#${prev.id}" aria-label="Previous study: ${prev.name}">\u2190</a>` : ''}`
      + `<span>${pad(i + 1)} / ${TOTAL} \u00b7 ${ORDER[i].name.toUpperCase()}</span>`
      + `<a href="#${next ? next.id : 'notes'}" aria-label="${next ? `Next study: ${next.name}` : 'Notes on looking'}">\u2192</a>`;
  };

  const ICON = {
    replay: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.3 8A6.5 6.5 0 1 0 16.5 11M16.3 3.8V8h-4.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 3v11m-4-4 4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pause: '<svg class="pause-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 5.5v9M13 5.5v9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><svg class="play-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.2 5.6 7 4.4-7 4.4V5.6Z" fill="currentColor"/></svg>',
    chevron: '<svg class="chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  function chapterHTML(def, n) {
    const side = def.art > .5 ? 'left' : 'right';
    const next = ORDER[n];
    const p0 = def.palettes[0];
    const facts = def.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    const nextHref = next ? next.id : 'notes';
    const nextLabel = next ? `CONTINUE TO STUDY ${pad(n + 1)}` : 'READ THE NOTES';
    return `
<section class="chapter study" id="${def.id}-study" data-text="${side}" aria-labelledby="${def.id}-title" style="--accent:${def.accent}">
  <div class="scene" aria-hidden="true">
    <canvas class="ambient-ascii" data-ambient-theme="${def.id}" aria-hidden="true"></canvas>
    <canvas class="study-screen" id="${def.id}-screen"></canvas>
    <div class="scene-vignette"></div><div class="scene-grain"></div>
  </div>
  <div class="page-shell">
    <header class="topbar glass" aria-label="${def.name} header">
      <span data-wordmark></span>
      <div class="header-meta">
        <span class="live-pill glass-inset"><span class="live-indicator"></span> LIVE CANVAS</span>
        <nav class="chapter-links" aria-label="Botanical studies">${navHTML(n - 1)}</nav>
        <span class="edition">NO. ${pad(n)} <i></i> 30 FPS</span>
      </div>
    </header>
    <main class="study-main">
      <section class="study-intro" aria-labelledby="${def.id}-title">
        <p class="eyebrow"><span class="eyebrow-rule"></span> BOTANICAL STUDY&nbsp; / &nbsp;${pad(n)}</p>
        <h2 id="${def.id}-title">${def.title}</h2>
        <p class="study-latin">${def.latin}</p>
        <p class="intro-copy">${def.copy}</p>
        <dl class="study-facts">${facts}</dl>
        <div class="intro-actions">
          <button class="button button-primary glass" id="${def.id}-replay" type="button"><span>Replay the bloom</span>${ICON.replay}</button>
        </div>
      </section>
    </main>
    <aside class="controls-dock glass" aria-label="${def.name} animation controls">
      <div class="dock-label"><span class="dock-overline">THE COMPOSITION</span><span class="dock-title" id="${def.id}-state" aria-live="polite">Opening slowly</span></div>
      <span class="dock-divider" aria-hidden="true"></span>
      <button class="icon-button glass-inset" id="${def.id}-pause" type="button" aria-label="Pause animation" aria-pressed="false" title="Pause or resume (Space)">${ICON.pause}</button>
      <button class="palette-button glass-inset" id="${def.id}-palette" type="button" title="Change colour palette (P)">
        <span class="palette-swatches" id="${def.id}-swatches" aria-hidden="true">${p0.swatches.map((c) => `<i style="background-color:${c}"></i>`).join('')}</span>
        <span class="palette-copy"><small>COLOUR</small><strong id="${def.id}-palette-name">${p0.name}</strong></span>${ICON.chevron}
      </button>
    </aside>
    <div class="corner-note glass" aria-label="Design note"><span class="corner-note-mark">\u2733</span><span><strong>${def.note[0]}</strong><small>${def.note[1]}</small></span></div>
    <footer class="page-footer"><span>${def.latin.toUpperCase()}</span><span class="keyboard-hint"><kbd>SPACE</kbd> pause <b>\u00b7</b> <kbd>R</kbd> replay <b>\u00b7</b> <kbd>P</kbd> palette</span></footer>
    <a class="scroll-cue glass-inset" href="#${nextHref}"><span>${nextLabel}</span>${ICON.down}</a>
  </div>
</section>`;
  }

  const COLOPHON = `
<section class="chapter colophon" id="notes" aria-labelledby="notes-title">
  <div class="colophon-inner">
    <p class="eyebrow"><span class="eyebrow-rule"></span> COLOPHON</p>
    <h2 id="notes-title">Notes on <em>looking.</em></h2>
    <p class="colophon-lead">Each drawing follows a small set of constraints taken from published work on how people rate flowers. They shaped the geometry and colour of the vector drawings, before anything becomes a character.</p>
    <div class="colophon-grid">
      <article><h3>Prototypes win</h3><p>In a survey of about 2,000 people rating 52 flower images, radially symmetrical flowers with low complexity were rated most beautiful. Sharp contours and blue colour also helped, and shape mattered more than colour.</p><p class="how">Used here: one dominant, centred head per study; hard dark outlines drawn before the glyph conversion.</p><cite>Hůla &amp; Flegr, 2016, PeerJ</cite></article>
      <article><h3>Not too simple, not too busy</h3><p>The same paper reviews evidence that moderately complex objects are preferred over very simple or very complex ones, and that fluency and liking rise with the number of symmetry axes.</p><p class="how">Used here: a hero, two supporting heads and a few small details, with petals built in ordered rings.</p><cite>Hůla &amp; Flegr, 2016 (reviewing Akalin et al.; Evans et al.; Tinio &amp; Leder)</cite></article>
      <article><h3>Arrangements and neighbours</h3><p>In a study of floral design, consumers preferred more symmetrical arrangements and were wary of single-colour ones, favouring similar or neighbouring hues. Straight and curved lines were equally liked.</p><p class="how">Used here: bouquets balanced around a vertical axis; palettes of neighbouring hues with a small accent.</p><cite>NC State and Texas A&amp;M, HortScience, 2023</cite></article>
      <article><h3>Colour is partly cultural</h3><p>Some colour preference looks widespread and some is learned: East Asian cultures, for instance, lean towards white, while other groups rank colours differently.</p><p class="how">Used here: every study carries alternative palettes, switchable with <kbd>P</kbd>.</p><cite>Hůla &amp; Flegr, 2016 (review)</cite></article>
    </div>
    <p class="colophon-caveat">None of this research tested ASCII renderings. It informed the drawings; whether the glyph output inherits the same appeal has not been tested.</p>
    <a class="text-link" href="#cover-study">Back to the cover <span aria-hidden="true">\u2191</span></a>
  </div>
</section>`;

  document.body.insertAdjacentHTML('beforeend', defs.map((d, i) => chapterHTML(d, i + 4)).join('') + COLOPHON);

  const wordmarkSource = document.querySelector('#top .wordmark');
  document.querySelectorAll('[data-wordmark]').forEach((slot) => {
    if (wordmarkSource) slot.replaceWith(wordmarkSource.cloneNode(true));
  });
  document.querySelectorAll('.chapter-links').forEach((nav) => {
    const index = ORDER.findIndex((item) => item.id === (nav.closest('.chapter') || {}).id);
    if (index >= 0) nav.innerHTML = navHTML(index);
  });
  document.querySelectorAll('.wordmark').forEach((a) => a.setAttribute('href', '#cover-study'));

  // Side index: one tick per study.
  const rail = document.createElement('nav');
  rail.className = 'study-rail';
  rail.setAttribute('aria-label', 'All studies');
  rail.innerHTML = ORDER.map((item, i) => `<a href="#${item.id}" data-id="${item.id}" aria-label="${pad(i + 1)} ${item.name}"><span>${pad(i + 1)} ${item.name.toUpperCase()}</span></a>`).join('');
  document.body.appendChild(rail);

  if ('IntersectionObserver' in window) {
    const ratios = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
      const [bestId, bestRatio] = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      if (!bestId || bestRatio <= 0) return;
      rail.querySelectorAll('a').forEach((a) => (a.dataset.id === bestId ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    }, { threshold: [0, .15, .3, .5, .7, .9] });
    ORDER.forEach((item) => { const el = document.getElementById(item.id); if (el) io.observe(el); });
  }

  // Mount renderers, then wire the controls.
  allDefs.forEach((def) => FlowerEngine.mount(def));
  FlowerEngine.start();

  const $ = (id) => document.getElementById(id);
  const setSwatches = (def, swatches) => {
    const box = $(`${def.id}-swatches`);
    if (box && swatches) box.querySelectorAll('i').forEach((el, i) => { if (swatches[i]) el.style.backgroundColor = swatches[i]; });
  };
  defs.forEach((def) => {
    const api = FlowerEngine.get(def.id);
    if (!api) return;
    $(`${def.id}-replay`)?.addEventListener('click', () => { api.replay(); $(`${def.id}-state`).textContent = 'Bloom restarting'; });
    $(`${def.id}-pause`)?.addEventListener('click', () => api.togglePause());
    $(`${def.id}-palette`)?.addEventListener('click', () => api.nextPalette());
  });
  window.addEventListener('flower:state', (event) => {
    const d = event.detail || {};
    const def = defs.find((x) => x.id === d.id);
    if (!def) return;
    const name = $(`${def.id}-palette-name`);
    if (name && d.paletteName) name.textContent = d.paletteName;
    setSwatches(def, d.swatches);
    const pause = $(`${def.id}-pause`), state = $(`${def.id}-state`);
    if (pause) { pause.setAttribute('aria-pressed', String(d.paused)); pause.setAttribute('aria-label', d.paused ? 'Resume animation' : 'Pause animation'); }
    if (state) state.textContent = d.paused ? 'Paused' : 'Opening slowly';
  });
})();
