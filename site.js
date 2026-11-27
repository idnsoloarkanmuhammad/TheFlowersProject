(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const lilyScene = () => window.BouquetScene || null;
  const peonyScene = () => window.PeonyScene || null;
  const violetScene = () => window.VioletScene || null;

  const lilyReplay = byId('replay-hero');
  const lilyPause = byId('pause-toggle');
  const lilyPalette = byId('palette-toggle');
  const lilyPaletteName = byId('palette-name');
  const lilyState = byId('animation-state');

  const peonyReplay = byId('peony-replay');
  const peonyPause = byId('peony-pause');
  const peonyPalette = byId('peony-palette');
  const peonyPaletteName = byId('peony-palette-name');
  const peonyState = byId('peony-animation-state');
  const peonySwatches = byId('peony-swatches');

  const violetReplay = byId('violet-replay');
  const violetPause = byId('violet-pause');
  const violetPalette = byId('violet-palette');
  const violetPaletteName = byId('violet-palette-name');
  const violetState = byId('violet-animation-state');
  const violetSwatches = byId('violet-swatches');

  function updateSwatches(container, detail) {
    if (!container || !detail || !Array.isArray(detail.swatches)) return;
    container.querySelectorAll('i').forEach((swatch, index) => {
      if (detail.swatches[index]) swatch.style.backgroundColor = detail.swatches[index];
    });
  }

  function updateNamedPalette(nameElement, swatchElement, detail) {
    if (!detail) return;
    if (nameElement && detail.paletteName) nameElement.textContent = detail.paletteName;
    updateSwatches(swatchElement, detail);
  }

  lilyReplay?.addEventListener('click', () => {
    const api = lilyScene();
    if (!api || typeof api.replay !== 'function') return;
    api.replay();
    if (lilyScene() !== api) return;
    if (lilyState) lilyState.textContent = 'Playing';
  });

  lilyPause?.addEventListener('click', () => {
    const api = lilyScene();
    if (!api) return;
    const paused = api.togglePause();
    lilyPause.setAttribute('aria-pressed', String(paused));
    lilyPause.setAttribute('aria-label', paused ? 'Resume lily animation' : 'Pause lily animation');
    if (lilyState) lilyState.textContent = paused ? 'Paused' : 'Playing';
  });

  lilyPalette?.addEventListener('click', () => {
    const name = lilyScene()?.nextPalette();
    if (name && lilyPaletteName) lilyPaletteName.textContent = name;
  });

  peonyReplay?.addEventListener('click', () => {
    const api = peonyScene();
    if (!api || typeof api.replay !== 'function') return;
    api.replay();
    if (peonyScene() !== api) return;
    if (peonyState) peonyState.textContent = 'Playing';
  });

  peonyPause?.addEventListener('click', () => {
    const api = peonyScene();
    if (!api) return;
    const paused = api.togglePause();
    peonyPause.setAttribute('aria-pressed', String(paused));
    peonyPause.setAttribute('aria-label', paused ? 'Resume peony animation' : 'Pause peony animation');
    if (peonyState) peonyState.textContent = paused ? 'Paused' : 'Playing';
  });

  peonyPalette?.addEventListener('click', () => {
    const palette = peonyScene()?.nextPalette();
    if (palette) updateNamedPalette(peonyPaletteName, peonySwatches, palette);
  });

  violetReplay?.addEventListener('click', () => {
    const api = violetScene();
    if (!api || typeof api.replay !== 'function') return;
    api.replay();
    if (violetScene() !== api) return;
    if (violetState) violetState.textContent = 'Playing';
  });

  violetPause?.addEventListener('click', () => {
    const api = violetScene();
    if (!api) return;
    const paused = api.togglePause();
    violetPause.setAttribute('aria-pressed', String(paused));
    violetPause.setAttribute('aria-label', paused ? 'Resume violet animation' : 'Pause violet animation');
    if (violetState) violetState.textContent = paused ? 'Paused' : 'Playing';
  });

  violetPalette?.addEventListener('click', () => {
    const palette = violetScene()?.nextPalette();
    if (palette) updateNamedPalette(violetPaletteName, violetSwatches, palette);
  });

  window.addEventListener('bouquet:state', (event) => {
    const detail = event.detail || {};
    if (detail.paletteName && lilyPaletteName) lilyPaletteName.textContent = detail.paletteName;
    if (typeof detail.paused === 'boolean' && lilyPause) {
      lilyPause.setAttribute('aria-pressed', String(detail.paused));
      lilyPause.setAttribute('aria-label', detail.paused ? 'Resume lily animation' : 'Pause lily animation');
      if (lilyState) lilyState.textContent = detail.paused ? 'Paused' : 'Playing';
    }
  });

  window.addEventListener('peony:state', (event) => {
    const detail = event.detail || {};
    updateNamedPalette(peonyPaletteName, peonySwatches, detail);
    if (typeof detail.paused === 'boolean' && peonyPause) {
      peonyPause.setAttribute('aria-pressed', String(detail.paused));
      peonyPause.setAttribute('aria-label', detail.paused ? 'Resume peony animation' : 'Pause peony animation');
      if (peonyState) peonyState.textContent = detail.paused ? 'Paused' : 'Playing';
    }
  });

  window.addEventListener('violet:state', (event) => {
    const detail = event.detail || {};
    updateNamedPalette(violetPaletteName, violetSwatches, detail);
    if (typeof detail.paused === 'boolean' && violetPause) {
      violetPause.setAttribute('aria-pressed', String(detail.paused));
      violetPause.setAttribute('aria-label', detail.paused ? 'Resume violet animation' : 'Pause violet animation');
      if (violetState) violetState.textContent = detail.paused ? 'Paused' : 'Playing';
    }
  });

  // Starting state of the three first studies (paused when prefers-reduced-motion is on).
  function showStartState(api, pauseButton, stateElement, label, restingText) {
    const state = api && api.getState && api.getState();
    if (!state || !state.paused || !pauseButton) return;
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', `Resume ${label} animation`);
    if (stateElement) stateElement.textContent = 'Paused';
  }

  function markUnavailableStudy(sectionId, stateId) {
    const section = byId(sectionId);
    if (!section) return;
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
    const state = byId(stateId);
    if (state) state.textContent = 'Unavailable';
  }

  window.addEventListener('load', () => {
    const lilyApi = lilyScene();
    const peonyApi = peonyScene();
    const violetApi = violetScene();
    updateNamedPalette(peonyPaletteName, peonySwatches, peonyApi?.getState());
    updateNamedPalette(violetPaletteName, violetSwatches, violetApi?.getState());
    showStartState(lilyApi, lilyPause, lilyState, 'lily');
    showStartState(peonyApi, peonyPause, peonyState, 'peony');
    showStartState(violetApi, violetPause, violetState, 'violet');

    // A missing standalone renderer is a local study failure, not a page-wide failure.
    if (!lilyApi) markUnavailableStudy('top', 'animation-state');
    if (!peonyApi) markUnavailableStudy('peony-study', 'peony-animation-state');
    if (!violetApi) markUnavailableStudy('violet-study', 'violet-animation-state');

    // Error state: if the drawing library did not load, say so instead of leaving empty dark sections.
    if (!window.FlowerEngine && !document.querySelector('.state-note')) {
      const note = document.createElement('p');
      note.className = 'state-note';
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
      note.setAttribute('aria-atomic', 'true');
      note.textContent = 'Some of the studies could not be loaded. Reload the page to try again.';
      const nav = document.querySelector('.global-nav');
      if (nav) nav.insertAdjacentElement('afterend', note);
    }
  }, { once: true });
})();
