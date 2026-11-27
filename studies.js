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

  const ICON = {
    replay: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.3 8A6.5 6.5 0 1 0 16.5 11M16.3 3.8V8h-4.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pause: '<svg class="pause-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="5.5" y="4.5" width="3.2" height="11" rx="1" fill="currentColor"/><rect x="11.3" y="4.5" width="3.2" height="11" rx="1" fill="currentColor"/></svg><svg class="play-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.2 5.6 7 4.4-7 4.4V5.6Z" fill="currentColor"/></svg>',
  };

  function chapterHTML(def, n) {
    const side = def.art > .5 ? 'left' : 'right';
    const p0 = def.palettes[0];
    const facts = def.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    return `
<section class="chapter study" id="${def.id}-study" data-text="${side}" aria-labelledby="${def.id}-title" style="--accent:${def.accent}">
  <div class="scene">
    <canvas class="study-screen" id="${def.id}-screen" role="img" aria-label="Animated drawing of ${def.name.toLowerCase()}, made of coloured text characters."></canvas>
  </div>
  <div class="page-shell">
    <div class="study-main">
      <section class="study-intro" aria-labelledby="${def.id}-title">
        <p class="eyebrow">Botanical study / ${pad(n)}</p>
        <h2 id="${def.id}-title">${def.title}</h2>
        <p class="study-latin">${def.latin}</p>
        <p class="intro-copy">${def.copy}</p>
        <dl class="study-facts">${facts}</dl>
        <div class="intro-actions">
          <button class="button button-primary glass" id="${def.id}-replay" type="button" aria-label="Replay the bloom, ${def.name.toLowerCase()}"><span>Replay the bloom</span>${ICON.replay}</button>
        </div>
      </section>
    </div>
    <aside class="controls-dock glass" aria-label="${def.name} animation controls">
      <div class="dock-label"><span class="dock-title" id="${def.id}-state" aria-live="polite">Playing</span></div>
      <span class="dock-divider" aria-hidden="true"></span>
      <button class="icon-button glass-inset" id="${def.id}-pause" type="button" aria-label="Pause ${def.name.toLowerCase()} animation" aria-pressed="false" title="Pause or resume (Space)">${ICON.pause}</button>
      <button class="palette-button glass-inset" id="${def.id}-palette" type="button" title="Change colour palette (P)">
        <span class="palette-swatches" id="${def.id}-swatches" aria-hidden="true">${p0.swatches.map((c) => `<i style="background-color:${c}"></i>`).join('')}</span>
        <span class="palette-copy"><small>Colour</small><strong id="${def.id}-palette-name">${p0.name}</strong></span>
      </button>
    </aside>
  </div>
</section>`;
  }

  const COLOPHON = `
<section class="chapter colophon" id="notes" aria-labelledby="notes-title">
  <div class="colophon-inner">
    <p class="eyebrow">Colophon</p>
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

  (document.getElementById('main') || document.body).insertAdjacentHTML('beforeend', defs.map((d, i) => chapterHTML(d, i + 4)).join('') + COLOPHON);

  // The cover, index and notes now exist, so the links that point at them can be shown.
  document.querySelectorAll('[data-cover-link]').forEach((a) => a.setAttribute('href', '#cover-study'));
  document.querySelectorAll('[data-needs-js]').forEach((el) => { el.hidden = false; });

  // Side index: one tick per study.
  const rail = document.createElement('nav');
  rail.className = 'study-rail';
  rail.setAttribute('aria-label', 'All studies');
  rail.innerHTML = ORDER.map((item, i) => `<a href="#${item.id}" data-id="${item.id}" aria-label="${pad(i + 1)} ${item.name}"><span>${pad(i + 1)} ${item.name.toUpperCase()}</span></a>`).join('');
  document.body.appendChild(rail);

  const ratios = new Map();
  function setCurrentStudy() {
    const [bestId, bestRatio] = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0] || [];
    if (!bestId || bestRatio <= 0) return;
    rail.querySelectorAll('a').forEach((a) => (a.dataset.id === bestId ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }

  function updateCurrentStudyFromViewport() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    ratios.clear();
    ORDER.forEach((item) => {
      const section = document.getElementById(item.id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      ratios.set(item.id, visibleHeight / Math.max(1, rect.height));
    });
    setCurrentStudy();
  }

  let navObserver = null;
  let observingStudies = false;
  if (typeof window.IntersectionObserver === 'function') {
    try {
      navObserver = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio));
        setCurrentStudy();
      }, { threshold: [0, .15, .3, .5, .7, .9] });
      ORDER.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) navObserver.observe(section);
      });
      observingStudies = true;
    } catch (error) {
      if (navObserver && typeof navObserver.disconnect === 'function') {
        try { navObserver.disconnect(); } catch (disconnectError) {
          console.warn('[Studies] Could not disconnect the failed navigation observer.', disconnectError);
        }
      }
      navObserver = null;
      console.warn('[Studies] Navigation observer failed; using viewport bounds instead.', error);
    }
  }

  if (!observingStudies) {
    window.addEventListener('scroll', updateCurrentStudyFromViewport, { passive: true });
    window.addEventListener('resize', updateCurrentStudyFromViewport, { passive: true });
    updateCurrentStudyFromViewport();
  }

  function markStudyFailure(section, error) {
    if (!section) return;
    console.error(`[Studies] Could not mount the ${section.id} study.`, error);
    const host = section.querySelector('.scene') || section;
    if (!host.querySelector('.scene-error')) {
      const note = document.createElement('p');
      note.className = 'scene-error';
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
      note.setAttribute('aria-atomic', 'true');
      note.textContent = 'This study could not be drawn in your browser.';
      host.appendChild(note);
    }
    section.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    const state = section.querySelector('.dock-title');
    if (state) state.textContent = 'Unavailable';
  }

  // Runtime failures must update the UI even if controls already retain the old API reference.
  window.addEventListener('flower:failure', (event) => {
    const detail = event.detail || {};
    if (!detail.id) return;
    const section = document.getElementById(`${detail.id}-study`);
    if (section) markStudyFailure(section, new Error(detail.message || 'Renderer failed.'));
  });

  // Mount each renderer independently so one unexpected failure cannot stop later studies.
  allDefs.forEach((def) => {
    const section = document.getElementById(`${def.id}-study`);
    let instance = null;
    try {
      instance = FlowerEngine.mount(def);
    } catch (error) {
      markStudyFailure(section, error);
      return;
    }
    if (!instance) markStudyFailure(section, new Error('Renderer mount returned no instance.'));
  });

  try {
    FlowerEngine.start();
  } catch (error) {
    console.error('[Studies] Could not start the shared renderer.', error);
  }

  const $ = (id) => document.getElementById(id);
  const setSwatches = (def, swatches) => {
    const box = $(`${def.id}-swatches`);
    if (box && swatches) box.querySelectorAll('i').forEach((el, i) => { if (swatches[i]) el.style.backgroundColor = swatches[i]; });
  };
  defs.forEach((def) => {
    const api = FlowerEngine.get(def.id);
    if (!api) return;
    $(`${def.id}-replay`)?.addEventListener('click', () => api.replay());
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
    if (pause) { pause.setAttribute('aria-pressed', String(d.paused)); pause.setAttribute('aria-label', `${d.paused ? 'Resume' : 'Pause'} ${def.name.toLowerCase()} animation`); }
    if (state) state.textContent = d.paused ? 'Paused' : 'Playing';
  });
  // Show the starting state (for example paused under prefers-reduced-motion) on the controls.
  defs.forEach((def) => { const api = FlowerEngine.get(def.id); if (api && api.sync) api.sync(); });
})();
