// Temporary, isolated palette and motion experiments for one existing flower study.
// The selected renderer is restored to its entry state whenever the dialog closes.
(() => {
  'use strict';
  const trigger = document.getElementById('open-experiments');
  if (!trigger) return;

  const studies = [
    { id: 'top', name: 'Lilies', getApi: () => window.BouquetScene },
    { id: 'peony-study', name: 'Peonies', getApi: () => window.PeonyScene },
    { id: 'violet-study', name: 'Violets', getApi: () => window.VioletScene },
    ...(window.FlowerEngine ? window.FlowerEngine.list().filter((def) => !def.cover).map((def) => ({ id: `${def.id}-study`, name: def.name, getApi: () => window.FlowerEngine.get(def.id) })) : []),
  ];

  const dialog = document.createElement('dialog');
  dialog.className = 'experiment-dialog';
  dialog.setAttribute('aria-labelledby', 'experiment-title');
  dialog.innerHTML = `
    <div class="experiment-form">
      <div class="experiment-heading">
        <p class="eyebrow">Generative study</p>
        <h2 id="experiment-title">Experiment with a flower</h2>
        <p class="experiment-intro">Try another palette or change the pace of the drawing. Closing this window restores the starting state.</p>
      </div>
      <label class="experiment-field" for="experiment-study">Flower study
        <select id="experiment-study" name="study"></select>
      </label>
      <label class="experiment-field" for="experiment-palette">Colour palette
        <select id="experiment-palette" name="palette"></select>
      </label>
      <div class="experiment-field">
        <div class="experiment-rate-label"><label for="experiment-rate">Animation pace</label><output id="experiment-rate-value" for="experiment-rate">1×</output></div>
        <input id="experiment-rate" name="rate" type="range" min="0.75" max="1.25" step="0.25" value="1" aria-valuetext="1 times the original pace">
        <div class="experiment-rate-ends"><span>Slower</span><span>Original</span><span>Faster</span></div>
      </div>
      <p class="experiment-note" id="experiment-note" role="status" aria-live="polite" aria-atomic="true">Changes are temporary and affect only the selected study.</p>
      <div class="experiment-actions">
        <button class="text-link" id="experiment-reset" type="button">Reset</button>
        <button class="button button-primary" id="experiment-close" type="button">Close</button>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const studySelect = dialog.querySelector('#experiment-study');
  const paletteSelect = dialog.querySelector('#experiment-palette');
  const rateInput = dialog.querySelector('#experiment-rate');
  const rateOutput = dialog.querySelector('#experiment-rate-value');
  const note = dialog.querySelector('#experiment-note');
  const resetButton = dialog.querySelector('#experiment-reset');
  const closeButton = dialog.querySelector('#experiment-close');

  studies.forEach((study) => {
    const option = document.createElement('option');
    option.value = study.id;
    option.textContent = study.name;
    option.disabled = typeof study.getApi() !== 'object' || study.getApi() === null;
    studySelect.appendChild(option);
  });

  let activeStudy = null;
  let initialState = null;
  const clampRate = (value) => Math.max(0.75, Math.min(1.25, Number(value)));

  function getState(study) {
    const api = study?.getApi();
    const state = api?.getState?.();
    if (!api || !state) return null;
    return { api, state: { paletteIndex: state.paletteIndex || 0, playbackRate: state.playbackRate || 1, paletteNames: state.palettes || [state.paletteName].filter(Boolean) } };
  }

  function restoreActive() {
    if (!activeStudy || !initialState) return;
    const api = activeStudy.getApi();
    if (!api) return;
    api.setPalette?.(initialState.paletteIndex);
    api.setPlaybackRate?.(initialState.playbackRate);
  }

  function setRateOutput(value) {
    const rate = clampRate(value);
    rateOutput.value = `${rate.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}×`;
    rateInput.setAttribute('aria-valuetext', `${rate} times the original pace`);
  }

  function populatePaletteOptions(names, currentIndex) {
    paletteSelect.replaceChildren();
    names.forEach((name, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = name;
      paletteSelect.appendChild(option);
    });
    paletteSelect.value = String(currentIndex);
  }

  function selectStudy(id) {
    if (activeStudy) restoreActive();
    activeStudy = studies.find((study) => study.id === id) || studies[0];
    const snapshot = getState(activeStudy);
    if (!snapshot) {
      note.textContent = 'This study is currently unavailable.';
      paletteSelect.disabled = true;
      rateInput.disabled = true;
      resetButton.disabled = true;
      return;
    }
    initialState = snapshot.state;
    paletteSelect.disabled = snapshot.state.paletteNames.length < 2;
    rateInput.disabled = false;
    resetButton.disabled = false;
    populatePaletteOptions(snapshot.state.paletteNames, snapshot.state.paletteIndex);
    rateInput.value = String(snapshot.state.playbackRate);
    setRateOutput(snapshot.state.playbackRate);
    note.textContent = 'Changes are temporary and affect only the selected study.';
  }

  studySelect.addEventListener('change', () => selectStudy(studySelect.value));
  paletteSelect.addEventListener('change', () => {
    const api = activeStudy?.getApi();
    if (!api?.setPalette?.(Number(paletteSelect.value))) note.textContent = 'The selected palette could not be applied.';
  });
  rateInput.addEventListener('input', () => {
    const rate = clampRate(rateInput.value);
    const api = activeStudy?.getApi();
    if (api?.setPlaybackRate?.(rate)) {
      setRateOutput(rate);
      note.textContent = 'Motion pace updated. The original timing returns when this window closes.';
    }
  });
  resetButton.addEventListener('click', () => {
    if (!activeStudy || !initialState) return;
    const api = activeStudy.getApi();
    api?.setPalette?.(initialState.paletteIndex);
    api?.setPlaybackRate?.(initialState.playbackRate);
    paletteSelect.value = String(initialState.paletteIndex);
    rateInput.value = String(initialState.playbackRate);
    setRateOutput(initialState.playbackRate);
    note.textContent = 'The selected study is back at its starting state.';
  });

  function openDialog() {
    if (dialog.open) return;
    if (!studySelect.value || studySelect.selectedOptions[0]?.disabled) {
      const firstAvailable = [...studySelect.options].find((option) => !option.disabled);
      if (firstAvailable) studySelect.value = firstAvailable.value;
    }
    selectStudy(studySelect.value);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    closeButton.focus();
  }

  function closeDialog() {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else {
      restoreActive();
      dialog.removeAttribute('open');
      activeStudy = null;
      initialState = null;
    }
  }

  trigger.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', () => restoreActive());
  dialog.addEventListener('close', () => {
    restoreActive();
    activeStudy = null;
    initialState = null;
    trigger.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
})();
