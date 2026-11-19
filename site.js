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
    lilyScene()?.replay();
    if (lilyState) lilyState.textContent = 'Bloom restarting';
  });

  lilyPause?.addEventListener('click', () => {
    const api = lilyScene();
    if (!api) return;
    const paused = api.togglePause();
    lilyPause.setAttribute('aria-pressed', String(paused));
    lilyPause.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
    if (lilyState) lilyState.textContent = paused ? 'Paused' : 'In bloom';
  });

  lilyPalette?.addEventListener('click', () => {
    const name = lilyScene()?.nextPalette();
    if (name && lilyPaletteName) lilyPaletteName.textContent = name;
  });

  peonyReplay?.addEventListener('click', () => {
    peonyScene()?.replay();
    if (peonyState) peonyState.textContent = 'Bloom restarting';
  });

  peonyPause?.addEventListener('click', () => {
    const api = peonyScene();
    if (!api) return;
    const paused = api.togglePause();
    peonyPause.setAttribute('aria-pressed', String(paused));
    peonyPause.setAttribute('aria-label', paused ? 'Resume peony animation' : 'Pause peony animation');
    if (peonyState) peonyState.textContent = paused ? 'Paused' : 'Opening slowly';
  });

  peonyPalette?.addEventListener('click', () => {
    const palette = peonyScene()?.nextPalette();
    if (palette) updateNamedPalette(peonyPaletteName, peonySwatches, palette);
  });

  violetReplay?.addEventListener('click', () => {
    violetScene()?.replay();
    if (violetState) violetState.textContent = 'Opening slowly';
  });

  violetPause?.addEventListener('click', () => {
    const api = violetScene();
    if (!api) return;
    const paused = api.togglePause();
    violetPause.setAttribute('aria-pressed', String(paused));
    violetPause.setAttribute('aria-label', paused ? 'Resume violet animation' : 'Pause violet animation');
    if (violetState) violetState.textContent = paused ? 'Paused' : 'In bloom';
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
      lilyPause.setAttribute('aria-label', detail.paused ? 'Resume animation' : 'Pause animation');
      if (lilyState) lilyState.textContent = detail.paused ? 'Paused' : 'In bloom';
    }
  });

  window.addEventListener('peony:state', (event) => {
    const detail = event.detail || {};
    updateNamedPalette(peonyPaletteName, peonySwatches, detail);
    if (typeof detail.paused === 'boolean' && peonyPause) {
      peonyPause.setAttribute('aria-pressed', String(detail.paused));
      peonyPause.setAttribute('aria-label', detail.paused ? 'Resume peony animation' : 'Pause peony animation');
      if (peonyState) peonyState.textContent = detail.paused ? 'Paused' : 'Opening slowly';
    }
  });

  window.addEventListener('violet:state', (event) => {
    const detail = event.detail || {};
    updateNamedPalette(violetPaletteName, violetSwatches, detail);
    if (typeof detail.paused === 'boolean' && violetPause) {
      violetPause.setAttribute('aria-pressed', String(detail.paused));
      violetPause.setAttribute('aria-label', detail.paused ? 'Resume violet animation' : 'Pause violet animation');
      if (violetState) violetState.textContent = detail.paused ? 'Paused' : 'In bloom';
    }
  });

  window.addEventListener('load', () => {
    updateNamedPalette(peonyPaletteName, peonySwatches, peonyScene()?.getState());
    updateNamedPalette(violetPaletteName, violetSwatches, violetScene()?.getState());
  }, { once: true });
})();
