// Shared renderer for the newer studies. Each flower file only describes geometry
// (build + draw in a 1000x1000 world); this module owns canvas sizing, the
// vector -> glyph conversion, the frame loop, palettes, pause/replay and keys.
(() => {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FPS = 30;
  const WORLD = 1000;
  const GLYPHS = ' .,:;!i+*ox%#@';
  const TAU = Math.PI * 2;
  const GOLDEN = 137.508 * Math.PI / 180;
  const GREENS = { stem: '#5a7f4f', leaf: '#4d7f58', leafDark: '#244c3a', leafLight: '#8fae72' };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (d) => d * Math.PI / 180;
  const progress = (t, start, dur) => clamp((t - start) / dur, 0, 1);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const open = (T, start, dur = 1.6) => easeOut(progress(T, start, dur));
  const sway = (T, phase = 0, amp = 1) => Math.sin(T * .8 + phase) * amp * (REDUCED ? .2 : 1);

  function seeded(seed) {
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let n = Math.imul(seed ^ seed >>> 15, 1 | seed);
      n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n;
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  function cubic(p, t) {
    const u = 1 - t;
    return [
      u*u*u*p[0][0] + 3*u*u*t*p[1][0] + 3*u*t*t*p[2][0] + t*t*t*p[3][0],
      u*u*u*p[0][1] + 3*u*u*t*p[1][1] + 3*u*t*t*p[2][1] + t*t*t*p[3][1],
    ];
  }
  function cubicAngle(p, t) {
    const a = cubic(p, Math.max(0, t - .01));
    const b = cubic(p, Math.min(1, t + .01));
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }

  // ---- drawing helpers shared by every flower ---------------------------------
  function stem(g, pts, amount, color, width) {
    if (amount <= 0) return;
    const n = 34, end = Math.max(1, Math.floor(n * amount));
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [c, w] of [['rgba(6,14,9,.55)', width + 3], [color, width]]) {
      g.beginPath();
      for (let i = 0; i <= end; i++) {
        const p = cubic(pts, (i / n) * amount);
        if (i === 0) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]);
      }
      g.strokeStyle = c; g.lineWidth = w; g.stroke();
    }
  }

  // Petal outline along +x. tip: 0 round .. 1 pointed; notch: 0..1 cleft at the tip.
  function petalPath(g, L, W, o) {
    const k = o.tip || 0, n = o.notch || 0, b = o.belly ?? .5, c = (o.curl || 0) * L * .25;
    const x2 = L * (b + .3 - .3 * k), y2 = W * (1.25 - k);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(L * .12, -W * 1.3, x2, -y2, L, c - (n ? W * .16 : 0));
    if (n) { g.lineTo(L * (1 - n * .16), c); g.lineTo(L, c + W * .16); }
    g.bezierCurveTo(x2, y2, L * .12, W * 1.3, 0, 0);
    g.closePath();
  }

  function petal(g, o) {
    const L = o.len, W = o.wid;
    if (L < .5 || W < .5) return;
    petalPath(g, L, W, o);
    if (o.flat) g.fillStyle = o.colors[1] || o.colors[0];
    else {
      const grad = g.createLinearGradient(0, 0, L, 0);
      o.colors.forEach((c, i) => grad.addColorStop(i / (o.colors.length - 1), c));
      g.fillStyle = grad;
    }
    g.fill();
    if (o.outline !== false) { g.strokeStyle = o.outline || 'rgba(25,8,15,.5)'; g.lineWidth = o.lw || 2.2; g.stroke(); }
    if (o.vein) {
      g.strokeStyle = o.vein; g.lineWidth = 1.1;
      const nv = o.veins || 1;
      for (let i = 1; i <= nv; i++) {
        const ty = ((i / (nv + 1)) * 2 - 1) * W * .6;
        g.beginPath(); g.moveTo(L * .05, 0); g.quadraticCurveTo(L * .5, ty * .55, L * .9, ty + (o.curl || 0) * L * .2); g.stroke();
      }
    }
  }

  function leaf(g, pal, x, y, ang, len, wid, p = 1, o = {}) {
    if (p <= 0) return;
    const L = len * p, W = wid * p;
    g.save(); g.translate(x, y); g.rotate(ang);
    petalPath(g, L, W, { tip: o.tip ?? .55, belly: o.belly ?? .45, curl: o.curl || 0 });
    const grad = g.createLinearGradient(0, -W, L, W);
    grad.addColorStop(0, pal.leafDark); grad.addColorStop(.5, o.light ? pal.leafLight : pal.leaf); grad.addColorStop(1, pal.leafDark);
    g.fillStyle = grad; g.fill();
    g.strokeStyle = 'rgba(8,18,12,.65)'; g.lineWidth = 2.4; g.stroke();
    g.strokeStyle = 'rgba(190,211,151,.4)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(2, 0); g.lineTo(L * .88, (o.curl || 0) * L * .2); g.stroke();
    g.restore();
  }

  function disc(g, r, stops, x = 0, y = 0) {
    const grad = g.createRadialGradient(x - r * .2, y - r * .28, 1, x, y, r * 1.3);
    stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
    g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }

  function motes(g, T, n, cx, cy, rx, ry, colors) {
    for (let i = 0; i < n; i++) {
      const ph = T * (.22 + (i % 5) * .035) + i * 2.399;
      g.globalAlpha = .22 + .3 * (Math.sin(ph * 2) * .5 + .5);
      g.fillStyle = colors[i % colors.length];
      g.beginPath();
      g.arc(cx + Math.cos(ph) * rx * (.5 + (i % 7) / 14), cy + Math.sin(ph * .83) * ry * (.5 + (i % 6) / 12), 1.5 + (i % 3) * .45, 0, TAU);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  const palette = (name, swatches, colors) => ({ name, swatches, vein: 'rgba(60,20,35,.4)', ...GREENS, ...colors });
  const U = Object.freeze({
    REDUCED, TAU, GOLDEN, clamp, lerp, rad, progress, easeOut, open, sway, seeded, cubic, cubicAngle,
    stem, petalPath, petal, leaf, disc, motes, palette,
  });

  // ---- registry + mounting -----------------------------------------------------
  const registry = [];
  const instances = [];
  let activeInstance = null;
  let rafId = null, lastFrame = 0;
  let started = false;
  let observer = null;
  let updateFallbackVisibility = null;
  let resizeHandler = null;
  let visibilityHandler = null;
  let keydownHandler = null;
  const styleCache = new Map();
  const cachedStyle = (r, g, b) => {
    const key = (r << 16) | (g << 8) | b;
    let v = styleCache.get(key);
    if (!v) { v = `rgb(${r},${g},${b})`; styleCache.set(key, v); }
    return v;
  };

  // Error state: keep the live status outside the canvas image's semantic subtree.
  function showError(section) {
    if (!section) return;
    const host = section.querySelector('.scene') || section;
    if (host.querySelector('.scene-error')) return;
    const note = document.createElement('p');
    note.className = 'scene-error';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    note.setAttribute('aria-atomic', 'true');
    note.textContent = 'This study could not be drawn in your browser.';
    host.appendChild(note);
  }

  function mountFailure(section, def, error) {
    console.error(`[FlowerEngine] Could not mount the ${def.name || def.id} study.`, error);
    showError(section);
    return null;
  }

  // With prefers-reduced-motion the bloom starts finished and paused (T = 20 s is past
  // every animation delay). Replay and Resume stay available as deliberate actions.
  const FINISHED = 20;

  function mount(def) {
    const section = document.getElementById(`${def.id}-study`);
    if (!section) return null;
    const screen = document.getElementById(`${def.id}-screen`);
    if (!screen || typeof screen.getContext !== 'function') return mountFailure(section, def, new Error('Canvas element or 2D context is unavailable.'));

    let sctx, off, octx;
    try {
      sctx = screen.getContext('2d', { alpha: false });
      off = document.createElement('canvas');
      octx = off.getContext('2d', { willReadFrequently: true });
    } catch (err) {
      return mountFailure(section, def, err);
    }
    if (!sctx || !octx) return mountFailure(section, def, new Error('Canvas 2D context could not be created.'));

    let data;
    try {
      data = def.build(seeded(def.seed || 1), U);
    } catch (err) {
      return mountFailure(section, def, err);
    }
    const inst = { def, section, T: REDUCED ? FINISHED : 0, palIndex: 0, playbackRate: 1, paused: REDUCED, ratio: 0, visible: false, dirty: true, failed: false, api: null };
    let cols = 0, rows = 0, cellW = 0, cellH = 0, fontSize = 0, dpr = 1;

    function resize() {
      const rect = section.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width)), height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      fontSize = clamp(Math.floor(Math.min(width / 112, height / 88)), 6, 11);
      sctx.font = `bold ${fontSize}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
      cellW = sctx.measureText('M').width || fontSize * .62;
      cellH = fontSize;
      screen.width = Math.floor(width * dpr); screen.height = Math.floor(height * dpr);
      cols = Math.ceil(width / cellW) + 1; rows = Math.ceil(height / cellH) + 1;
      off.width = cols; off.height = rows;
      inst.dirty = false;
      render();
    }

    function render() {
      if (inst.failed || !cols || !rows) return;
      const aspect = cellH / cellW, mobile = window.innerWidth <= 760, art = def.art ?? .69;
      let scale, ox, oy;
      if (mobile) {
        scale = Math.min((cols * .94) / WORLD, (rows * aspect * .78) / WORLD);
        ox = (cols - WORLD * scale) / 2; oy = (rows - WORLD * scale / aspect) / 2 + rows * .12;
      } else {
        scale = Math.min((cols * .69) / WORLD, (rows * aspect * .94) / WORLD);
        ox = cols * art - (WORLD * scale) / 2; oy = (rows - WORLD * scale / aspect) / 2;
      }
      octx.setTransform(1, 0, 0, 1, 0, 0);
      octx.clearRect(0, 0, cols, rows);
      octx.setTransform(scale, 0, 0, scale / aspect, ox, oy);
      octx.globalAlpha = 1;
      def.draw(octx, def.palettes[inst.palIndex], inst.T, data, U);

      const px = octx.getImageData(0, 0, cols, rows).data;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.fillStyle = '#080909';
      sctx.fillRect(0, 0, screen.width / dpr, screen.height / dpr);
      sctx.save();
      sctx.globalAlpha = .34;
      sctx.filter = `blur(${Math.max(2, Math.round(cellH * .42))}px)`;
      sctx.drawImage(off, 0, 0, cols * cellW, rows * cellH);
      sctx.restore();

      sctx.font = `bold ${fontSize}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
      sctx.textBaseline = 'top';
      const last = GLYPHS.length - 1, tick = Math.floor(inst.T * 9);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const k = (y * cols + x) * 4;
          const r = px[k], gg = px[k + 1], b = px[k + 2], max = Math.max(r, gg, b);
          if (max < 13) continue;
          const value = max / 255;
          const hash = ((x * 73856093) ^ (y * 19349663) ^ (tick * 83492791)) >>> 0;
          const variation = hash % 9 === 0 ? (hash & 16 ? 1 : -1) : 0;
          const index = clamp(Math.round(Math.pow(value, .72) * last) + variation, 1, last);
          const boost = Math.min(1.28, (38 + 220 * value) / max);
          sctx.fillStyle = cachedStyle(Math.min(255, (r * boost) | 0) & 0xf8, Math.min(255, (gg * boost) | 0) & 0xf8, Math.min(255, (b * boost) | 0) & 0xf8);
          sctx.fillText(GLYPHS[index], x * cellW, y * cellH);
        }
      }
    }

    const emit = () => {
      if (inst.failed) return;
      const p = def.palettes[inst.palIndex];
      window.dispatchEvent(new CustomEvent('flower:state', { detail: { id: def.id, paletteName: p.name, swatches: p.swatches, paused: inst.paused } }));
    };
    inst.resize = resize;
    inst.render = render;
    inst.api = {
      replay() {
        if (inst.failed) return false;
        inst.T = 0;
        inst.paused = false;
        if (inst.visible && !document.hidden) {
          const draw = inst.dirty ? inst.resize : render;
          if (!runInstanceSafely(inst, draw)) return false;
        } else {
          inst.dirty = true;
        }
        emit();
        syncScheduler();
        return true;
      },
      togglePause() {
        if (inst.failed) return true;
        inst.paused = !inst.paused;
        emit();
        syncScheduler();
        return inst.paused;
      },
      nextPalette() {
        return inst.api.setPalette((inst.palIndex + 1) % def.palettes.length);
      },
      setPalette(index) {
        if (inst.failed || !Number.isInteger(index) || index < 0 || index >= def.palettes.length) return null;
        inst.palIndex = index;
        if (inst.visible && !document.hidden) {
          const draw = inst.dirty ? inst.resize : render;
          if (!runInstanceSafely(inst, draw)) return null;
        } else {
          inst.dirty = true;
        }
        emit();
        syncScheduler();
        return def.palettes[inst.palIndex];
      },
      setPlaybackRate(value) {
        if (inst.failed || !Number.isFinite(value) || value < 0.75 || value > 1.25) return false;
        inst.playbackRate = value;
        emit();
        return true;
      },
      getState() {
        if (inst.failed) return null;
        const p = def.palettes[inst.palIndex];
        return { paletteName: p.name, swatches: p.swatches, paused: inst.paused, paletteIndex: inst.palIndex, palettes: def.palettes.map((item) => item.name), playbackRate: inst.playbackRate, time: inst.T };
      },
      sync: emit,
    };
    try {
      resize();
    } catch (err) {
      return mountFailure(section, def, err);
    }
    instances.push(inst);
    return inst;
  }

  function hasRunnableInstance() {
    return !document.hidden && instances.some((inst) => !inst.failed && !inst.paused && inst.visible);
  }

  function stopScheduler() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    lastFrame = 0;
  }

  function wakeScheduler() {
    if (!started || rafId !== null || !hasRunnableInstance()) return;
    rafId = requestAnimationFrame(frame);
  }

  function syncScheduler() {
    if (hasRunnableInstance()) wakeScheduler();
    else stopScheduler();
  }

  function updateActiveInstance() {
    activeInstance = instances.reduce((best, inst) => {
      if (inst.failed || !inst.visible) return best;
      return inst.ratio > (best ? best.ratio : .25) ? inst : best;
    }, null);
  }

  function failInstance(inst, error) {
    if (!inst || inst.failed) return;
    inst.failed = true;
    inst.dirty = false;
    inst.api = null;
    if (observer && typeof observer.unobserve === 'function') {
      try { observer.unobserve(inst.section); } catch (observerError) {
        console.warn('[FlowerEngine] Could not unobserve a failed study.', observerError);
      }
    }
    console.error(`[FlowerEngine] The ${inst.def.name || inst.def.id} renderer failed.`, error);
    showError(inst.section);
    if (activeInstance === inst) activeInstance = null;
    updateActiveInstance();
    window.dispatchEvent(new CustomEvent('flower:failure', {
      detail: { id: inst.def.id, message: error && error.message ? error.message : 'Renderer failed.' },
    }));
    syncScheduler();
  }

  function runInstanceSafely(inst, action) {
    if (!inst || inst.failed) return false;
    try {
      action();
      return true;
    } catch (error) {
      failInstance(inst, error);
      return false;
    }
  }

  function renderVisibleInstance(inst) {
    if (inst.failed || !inst.visible || document.hidden) return;
    if (inst.dirty) runInstanceSafely(inst, inst.resize);
    else runInstanceSafely(inst, inst.render);
  }

  function setInstanceVisibility(inst, ratio) {
    if (inst.failed) return;
    const wasVisible = inst.visible;
    inst.ratio = ratio;
    inst.visible = ratio > .04;
    if (inst.visible && (!wasVisible || inst.dirty)) renderVisibleInstance(inst);
  }

  function frame(now) {
    rafId = null;
    if (!hasRunnableInstance()) {
      lastFrame = 0;
      return;
    }
    if (lastFrame && now - lastFrame < 1000 / FPS) {
      wakeScheduler();
      return;
    }
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / FPS;
    lastFrame = now;
    for (const inst of instances) {
      if (inst.failed || !inst.visible) continue;
      if (inst.dirty && !runInstanceSafely(inst, inst.resize)) continue;
      if (inst.failed || inst.paused) continue;
      inst.T += dt * inst.playbackRate;
      runInstanceSafely(inst, inst.render);
    }
    syncScheduler();
  }

  function start() {
    if (started || !instances.length) return;
    started = true;

    const measureInitialVisibility = (renderOnEntry = false) => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      for (const inst of instances) {
        if (inst.failed) continue;
        const wasVisible = inst.visible;
        const rect = inst.section.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const ratio = visibleHeight / Math.max(1, rect.height);
        inst.ratio = ratio;
        inst.visible = ratio > .04;
        if (renderOnEntry && inst.visible && (!wasVisible || inst.dirty)) renderVisibleInstance(inst);
      }
      updateActiveInstance();
    };

    let observing = false;
    if (typeof window.IntersectionObserver === 'function') {
      try {
        observer = new window.IntersectionObserver((entries) => {
          for (const entry of entries) {
            const inst = instances.find((item) => item.section === entry.target);
            if (!inst || inst.failed) continue;
            setInstanceVisibility(inst, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
          updateActiveInstance();
          syncScheduler();
        }, { threshold: [0, .04, .1, .25, .5, .75, 1] });
        instances.forEach((inst) => observer.observe(inst.section));
        observing = true;
      } catch (err) {
        if (observer && typeof observer.disconnect === 'function') {
          try { observer.disconnect(); } catch (disconnectError) {
            console.warn('[FlowerEngine] Could not disconnect the failed IntersectionObserver.', disconnectError);
          }
        }
        observer = null;
        console.warn('[FlowerEngine] IntersectionObserver is unavailable; using viewport bounds instead.', err);
      }
    }

    measureInitialVisibility();
    if (!observing) {
      updateFallbackVisibility = () => {
        measureInitialVisibility(true);
        syncScheduler();
      };
      window.addEventListener('scroll', updateFallbackVisibility, { passive: true });
    }

    resizeHandler = () => {
      for (const inst of instances) {
        if (!inst.failed) inst.dirty = true;
      }
      measureInitialVisibility(true);
      syncScheduler();
    };
    visibilityHandler = () => {
      lastFrame = 0;
      if (document.hidden) {
        stopScheduler();
        return;
      }
      measureInitialVisibility(true);
      syncScheduler();
    };
    keydownHandler = (event) => {
      const target = event.target;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName))) return;
      if (!activeInstance || activeInstance.failed || !activeInstance.api || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.code === 'Space') { event.preventDefault(); activeInstance.api.togglePause(); }
      else if (event.key.toLowerCase() === 'r') activeInstance.api.replay();
      else if (event.key.toLowerCase() === 'p') activeInstance.api.nextPalette();
    };
    window.addEventListener('resize', resizeHandler, { passive: true });
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('keydown', keydownHandler);
    syncScheduler();
  }

  window.FlowerEngine = Object.freeze({
    U,
    register: (def) => registry.push(def),
    list: () => registry.slice(),
    mount,
    start,
    get: (id) => {
      const inst = instances.find((item) => item.def.id === id);
      return inst && !inst.failed ? inst.api : null;
    },
  });
})();
