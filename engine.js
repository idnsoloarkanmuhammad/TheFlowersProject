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
  let rafId = 0, lastFrame = 0;
  const styleCache = new Map();
  const cachedStyle = (r, g, b) => {
    const key = (r << 16) | (g << 8) | b;
    let v = styleCache.get(key);
    if (!v) { v = `rgb(${r},${g},${b})`; styleCache.set(key, v); }
    return v;
  };

  function mount(def) {
    const section = document.getElementById(`${def.id}-study`);
    const screen = document.getElementById(`${def.id}-screen`);
    if (!section || !screen) return null;
    const sctx = screen.getContext('2d', { alpha: false });
    const off = document.createElement('canvas');
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!sctx || !octx) return null;

    const data = def.build(seeded(def.seed || 1), U);
    const inst = { def, section, T: 0, palIndex: 0, paused: false, ratio: 0, visible: false, dirty: true };
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
      if (!cols || !rows) return;
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
      const p = def.palettes[inst.palIndex];
      window.dispatchEvent(new CustomEvent('flower:state', { detail: { id: def.id, paletteName: p.name, swatches: p.swatches, paused: inst.paused } }));
    };
    inst.resize = resize;
    inst.render = render;
    inst.api = {
      replay() { inst.T = 0; inst.paused = false; render(); emit(); },
      togglePause() { inst.paused = !inst.paused; emit(); return inst.paused; },
      nextPalette() { inst.palIndex = (inst.palIndex + 1) % def.palettes.length; render(); emit(); return def.palettes[inst.palIndex]; },
      getState() { const p = def.palettes[inst.palIndex]; return { paletteName: p.name, swatches: p.swatches, paused: inst.paused }; },
    };
    instances.push(inst);
    resize();
    return inst;
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (document.hidden) { lastFrame = 0; return; }
    if (lastFrame && now - lastFrame < 1000 / FPS) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / FPS;
    lastFrame = now;
    for (const inst of instances) {
      if (!inst.visible) continue;
      if (inst.dirty) inst.resize();
      if (inst.paused) continue;
      inst.T += dt;
      inst.render();
    }
  }

  function start() {
    if (!instances.length || rafId) return;
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const inst = instances.find((i) => i.section === e.target);
        if (!inst) continue;
        inst.ratio = e.intersectionRatio;
        inst.visible = e.isIntersecting && e.intersectionRatio > .04;
        if (inst.visible) { if (inst.dirty) inst.resize(); else inst.render(); }
      }
      activeInstance = instances.reduce((best, i) => (i.ratio > (best ? best.ratio : .25) ? i : best), null);
      lastFrame = 0;
    }, { threshold: [0, .04, .1, .25, .5, .75, 1] });
    instances.forEach((i) => observer.observe(i.section));
    window.addEventListener('resize', () => instances.forEach((i) => { i.dirty = true; }), { passive: true });
    window.addEventListener('keydown', (event) => {
      const t = event.target;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(t.tagName))) return;
      if (!activeInstance || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.code === 'Space') { event.preventDefault(); activeInstance.api.togglePause(); }
      else if (event.key.toLowerCase() === 'r') activeInstance.api.replay();
      else if (event.key.toLowerCase() === 'p') activeInstance.api.nextPalette();
    });
    rafId = requestAnimationFrame(frame);
  }

  window.FlowerEngine = Object.freeze({
    U,
    register: (def) => registry.push(def),
    list: () => registry.slice(),
    mount,
    start,
    get: (id) => (instances.find((i) => i.def.id === id) || {}).api || null,
  });
})();
