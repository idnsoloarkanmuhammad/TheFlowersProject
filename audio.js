// Navbar audio toggle for "Avril 14th".
// One shared Audio object; playback only begins after an explicit button activation.
(() => {
  'use strict';

  const button = document.getElementById('audio-toggle');
  if (!button) return;

  const label = button.querySelector('.audio-label');
  const face = button.querySelector('.audio-face');
  const status = document.getElementById('audio-status');
  if (!label || !face) return;

  const SOURCE = 'audio/avril-14th.mp3';
  const VOLUME = 0.20;

  // Create the single playback object now, but do not request the MP3 yet.
  const audio = new Audio();
  audio.preload = 'none';
  audio.loop = false;
  audio.volume = VOLUME;

  let sourceAssigned = false;

  // Keep the exact Unicode expressions as text, not image assets.
  const COPY = {
    off: {
      label: 'ENABLE AUDIO',
      face: 'ヾ(´◯`)ﾉ♪♪♪',
      name: 'Enable audio',
    },
    on: {
      label: 'DISABLE AUDIO',
      face: '(\u0E07\'\u0300-\'\u0301)\u0E07',
      name: 'Disable audio',
    },
  };

  function render(isPlaying) {
    const copy = isPlaying ? COPY.on : COPY.off;
    button.dataset.state = isPlaying ? 'on' : 'off';
    label.textContent = copy.label;
    face.textContent = copy.face;
    button.setAttribute('aria-label', copy.name);
    button.setAttribute('aria-pressed', String(isPlaying));
  }

  function announce(message) {
    if (status) status.textContent = message;
  }

  // Visual state follows media events, never the user's intent alone.
  audio.addEventListener('playing', () => {
    announce('');
    render(true);
  });
  audio.addEventListener('pause', () => render(false));
  audio.addEventListener('ended', () => render(false));
  audio.addEventListener('error', () => {
    render(false);
    announce('Audio could not be loaded. Please try again.');
  });

  button.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause(); // Preserve currentTime so the next enable resumes from this position.
      return;
    }

    // A previous media error can be retried without creating another Audio object.
    if (audio.error) {
      audio.removeAttribute('src');
      audio.load();
      sourceAssigned = false;
    }

    // Assign the MP3 only inside the first explicit activation (or a user retry).
    if (!sourceAssigned) {
      audio.src = SOURCE;
      sourceAssigned = true;
    }

    announce('');

    try {
      const playRequest = audio.play();
      if (playRequest && typeof playRequest.catch === 'function') {
        playRequest.catch((error) => {
          render(false);
          // A rapid user-requested pause can reject the pending play() promise.
          if (!error || error.name !== 'AbortError') {
            announce('Audio could not be played. Please try again.');
          }
        });
      }
    } catch (error) {
      render(false);
      announce('Audio could not be played. Please try again.');
    }
  });

  render(false);
  button.hidden = false; // Reveal only after the media object and listeners are ready.
})();
