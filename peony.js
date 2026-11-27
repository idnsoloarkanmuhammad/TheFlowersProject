// ASCII peonies: each frame is redrawn from vector petals, leaves and stems,
// then converted into coloured character glyphs on a low-resolution canvas.
(() => {
  'use strict';

  const WORLD_W = 1000;
  const WORLD_H = 1000;
  const FPS = 30;
  const GLYPHS = ' .,:;!i+*ox%#@';
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screen = document.getElementById('peony-screen');
  const section = document.getElementById('peony-study');
  if (!section) return;

  let failed = false;
  let rafId = null;
  let observer = null;
  let observing = false;
  let visible = false;
  let dirty = false;
  let lastFrame = 0;
  let resizeHandler = null;
  let scrollHandler = null;
  let visibilityHandler = null;
  let keydownHandler = null;

  function failScene(error) {
    if (failed) return;
    failed = true;
    stopScheduler();
    if (observer && typeof observer.disconnect === 'function') {
      try { observer.disconnect(); } catch (disconnectError) {
        console.warn('[PeonyScene] Could not disconnect the failed observer.', disconnectError);
      }
    }
    observer = null;
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
    if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
    console.error('[PeonyScene] The peony renderer could not be initialized or drawn.', error);
    delete window.PeonyScene;
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
    const state = document.getElementById('peony-animation-state');
    if (state) state.textContent = 'Unavailable';
  }

  function runSafely(action) {
    if (failed) return false;
    try {
      action();
      return true;
    } catch (error) {
      failScene(error);
      return false;
    }
  }

  let sctx, off, octx;
  try {
    if (!screen || typeof screen.getContext !== 'function') throw new Error('The peony canvas is unavailable.');
    sctx = screen.getContext('2d', { alpha: false });
    off = document.createElement('canvas');
    octx = off.getContext('2d', { willReadFrequently: true });
    if (!sctx || !octx) throw new Error('A canvas 2D context could not be created.');
  } catch (error) {
    failScene(error);
    return;
  }

  const PALETTES = [
    {
      name: 'Rosewater',
      deep: '#71334b', mid: '#c96383', light: '#eb9fb3', highlight: '#ffd6dc',
      vein: 'rgba(105,35,62,.52)', center: '#e8b85e', centerDark: '#9a633a',
      leafDark: '#244c3a', leaf: '#477c56', leafLight: '#86a96a', stem: '#557e4d',
      swatches: ['#71334b', '#c96383', '#ffd6dc'],
    },
    {
      name: 'Porcelain',
      deep: '#8c776c', mid: '#d6c5b6', light: '#f1e6d9', highlight: '#fffaf0',
      vein: 'rgba(115,91,78,.4)', center: '#d6a84f', centerDark: '#89613c',
      leafDark: '#284b3d', leaf: '#557d61', leafLight: '#a1b58a', stem: '#66805b',
      swatches: ['#8c776c', '#d6c5b6', '#fffaf0'],
    },
    {
      name: 'Orchid',
      deep: '#49345f', mid: '#8465a6', light: '#bd9bd4', highlight: '#ead9f0',
      vein: 'rgba(59,35,82,.5)', center: '#e4bf71', centerDark: '#80513c',
      leafDark: '#23483f', leaf: '#477866', leafLight: '#8aaf87', stem: '#537960',
      swatches: ['#49345f', '#8465a6', '#ead9f0'],
    },
    {
      name: 'Marigold',
      deep: '#803d2e', mid: '#ca6941', light: '#efaa64', highlight: '#ffe0a3',
      vein: 'rgba(112,48,27,.5)', center: '#5b4227', centerDark: '#30251c',
      leafDark: '#24483a', leaf: '#557c48', leafLight: '#a0ad62', stem: '#638047',
      swatches: ['#803d2e', '#ca6941', '#ffe0a3'],
    },
  ];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (d) => d * Math.PI / 180;
  const progress = (t, start, duration) => clamp((t - start) / duration, 0, 1);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const smooth = (a, b, t) => {
    const x = clamp((t - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  };

  function seeded(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let n = Math.imul(seed ^ seed >>> 15, 1 | seed);
      n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n;
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  function cubic(points, t) {
    const u = 1 - t;
    return [
      u*u*u*points[0][0] + 3*u*u*t*points[1][0] + 3*u*t*t*points[2][0] + t*t*t*points[3][0],
      u*u*u*points[0][1] + 3*u*u*t*points[1][1] + 3*u*t*t*points[2][1] + t*t*t*points[3][1],
    ];
  }

  function cubicAngle(points, t) {
    const a = cubic(points, Math.max(0, t - .01));
    const b = cubic(points, Math.min(1, t + .01));
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }

  const FLOWERS = [
    { x: 505, y: 315, radius: 170, start: 3.15, rotation: -.12, stemBase: 505 },
    { x: 292, y: 485, radius: 132, start: 4.35, rotation: .14, stemBase: 390 },
    { x: 718, y: 470, radius: 139, start: 4.95, rotation: -.18, stemBase: 620 },
    { x: 423, y: 650, radius: 108, start: 6.0, rotation: .2, stemBase: 445 },
    { x: 632, y: 655, radius: 103, start: 6.55, rotation: -.1, stemBase: 565 },
  ];

  function buildBotany() {
    const random = seeded(2048);
    const stems = [];
    const leaves = [];
    const buds = [];
    FLOWERS.forEach((flower, index) => {
      const baseX = flower.stemBase + (random() - .5) * 48;
      const points = [
        [baseX, 1020],
        [baseX + (flower.x - baseX) * .12, 815 - random() * 36],
        [lerp(baseX, flower.x, .7), flower.y + flower.radius * .78],
        [flower.x, flower.y + flower.radius * .18],
      ];
      stems.push({ points, start: .3 + index * .18, flowerIndex: index });
      const leafCount = 5 + (index % 2);
      for (let i = 0; i < leafCount; i++) {
        const t = .2 + i / (leafCount + 1) * .62 + random() * .035;
        leaves.push({
          stem: points,
          t,
          side: i % 2 ? 1 : -1,
          length: 75 + random() * 64,
          width: 15 + random() * 9,
          start: 1.0 + index * .15 + t * 1.45,
          tint: random(),
          curl: (random() - .5) * .35,
        });
      }
      // Small unopened side buds keep the silhouette botanical rather than geometric.
      if (index === 1 || index === 2 || index === 4) {
        const t = .78;
        const p = cubic(points, t);
        buds.push({ x: p[0] + (index % 2 ? -28 : 28), y: p[1] - 12, start: 3.2 + index * .35, angle: index % 2 ? -.72 : -.42, scale: .72 + random() * .24 });
      }
    });

    const filler = [];
    for (let i = 0; i < 23; i++) {
      const x = 250 + random() * 500;
      const y = 360 + random() * 360;
      filler.push({ x, y, size: 2.2 + random() * 2.5, start: 5.5 + random() * 3.2, phase: random() * Math.PI * 2 });
    }

    return { stems, leaves, buds, filler };
  }

  let BOTANY;
  try {
    BOTANY = buildBotany();
  } catch (error) {
    failScene(error);
    return;
  }
  const LAYERS = [
    { count: 15, base: .02, length: .76, width: .205, delay: 0, curl: .02 },
    { count: 13, base: .16, length: .64, width: .19, delay: .34, curl: .08 },
    { count: 11, base: .29, length: .52, width: .166, delay: .7, curl: .13 },
    { count: 9, base: .40, length: .39, width: .145, delay: 1.02, curl: .2 },
    { count: 7, base: .48, length: .28, width: .126, delay: 1.28, curl: .3 },
  ];

  // prefers-reduced-motion: start with the bloom finished and paused (20 s is past every delay).
  let T = REDUCED_MOTION ? 20 : 0;
  let playbackRate = 1;
  let paletteIndex = 0;
  let paused = REDUCED_MOTION;
  let cols = 0, rows = 0, cellW = 0, cellH = 0, fontSize = 0, dpr = 1;
  const styleCache = new Map();

  function cachedStyle(r, g, b) {
    const key = (r << 16) | (g << 8) | b;
    let value = styleCache.get(key);
    if (!value) {
      value = `rgb(${r},${g},${b})`;
      styleCache.set(key, value);
    }
    return value;
  }

  function resize() {
    if (failed) return;
    const rect = section.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    fontSize = clamp(Math.floor(Math.min(width / 112, height / 88)), 6, 11);
    sctx.font = `bold ${fontSize}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
    cellW = sctx.measureText('M').width || fontSize * .62;
    cellH = fontSize;
    screen.width = Math.floor(width * dpr);
    screen.height = Math.floor(height * dpr);
    cols = Math.ceil(width / cellW) + 1;
    rows = Math.ceil(height / cellH) + 1;
    off.width = cols;
    off.height = rows;
    render();
    dirty = false;
  }

  function leafPath(g, length, width, curl) {
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(length * .23, -width * 1.1, length * .72, -width * .72 + curl * length, length, curl * length * .18);
    g.bezierCurveTo(length * .7, width * .84 + curl * length, length * .25, width * .8, 0, 0);
    g.closePath();
  }

  function drawCurve(g, points, amount, color, width) {
    if (amount <= 0) return;
    const samples = 34;
    const end = Math.max(1, Math.floor(samples * amount));
    g.beginPath();
    for (let i = 0; i <= end; i++) {
      const p = cubic(points, (i / samples) * amount);
      if (i === 0) g.moveTo(p[0], p[1]);
      else g.lineTo(p[0], p[1]);
    }
    g.strokeStyle = color;
    g.lineWidth = width;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.stroke();
  }

  function drawFoliage(g, pal) {
    for (const stem of BOTANY.stems) {
      const grow = easeOut(progress(T, stem.start, 3.1));
      drawCurve(g, stem.points, grow, pal.stem, 5.5);
      if (grow > .1) {
        const end = cubic(stem.points, grow);
        g.fillStyle = pal.leaf;
        g.beginPath(); g.arc(end[0], end[1], 3.2, 0, Math.PI * 2); g.fill();
      }
    }

    for (const leaf of BOTANY.leaves) {
      const p = easeOut(progress(T, leaf.start, .8));
      if (p <= 0) continue;
      const anchor = cubic(leaf.stem, leaf.t);
      const sway = REDUCED_MOTION ? .2 : 1;
      const breeze = Math.sin(T * .85 + anchor[0] * .012) * 2.8 * sway;
      const angle = cubicAngle(leaf.stem, leaf.t) + leaf.side * rad(62 + leaf.tint * 17) + breeze * .003;
      const length = leaf.length * p;
      const width = leaf.width * p;
      g.save();
      g.translate(anchor[0], anchor[1]);
      g.rotate(angle);
      leafPath(g, length, width, leaf.curl);
      const grad = g.createLinearGradient(0, -width, length, width);
      grad.addColorStop(0, pal.leafDark);
      grad.addColorStop(.5, leaf.tint > .5 ? pal.leafLight : pal.leaf);
      grad.addColorStop(1, pal.leafDark);
      g.fillStyle = grad;
      g.fill();
      g.strokeStyle = 'rgba(8,18,12,.68)';
      g.lineWidth = 2.6;
      g.stroke();
      g.strokeStyle = 'rgba(190,211,151,.43)';
      g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(2, 0); g.quadraticCurveTo(length * .48, leaf.side * width * .04, length * .88, leaf.curl * length * .18); g.stroke();
      g.restore();
    }

    for (const bud of BOTANY.buds) {
      const p = easeOut(progress(T, bud.start, 1.5));
      if (!p) continue;
      g.save();
      g.translate(bud.x, bud.y);
      g.rotate(bud.angle + Math.sin(T + bud.x) * .025);
      g.scale(p * bud.scale, p * bud.scale);
      const grad = g.createLinearGradient(-18, -42, 22, 35);
      grad.addColorStop(0, pal.leafLight);
      grad.addColorStop(.5, pal.leaf);
      grad.addColorStop(1, pal.leafDark);
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(0, 34);
      g.bezierCurveTo(-31, 2, -20, -42, 0, -54);
      g.bezierCurveTo(27, -34, 32, 5, 0, 34);
      g.fill();
      g.strokeStyle = 'rgba(8,20,12,.6)'; g.lineWidth = 3; g.stroke();
      g.restore();
    }
  }

  function drawPetal(g, flower, layer, ringIndex, petalIndex, pal) {
    const angle = petalIndex / layer.count * Math.PI * 2 + (ringIndex % 2 ? Math.PI / layer.count : 0) + flower.rotation;
    const stagger = (petalIndex / layer.count) * .2;
    const open = easeOut(progress(T, flower.start + layer.delay + stagger, 1.55));
    if (open <= .001) return;

    const r = flower.radius;
    const base = layer.base * r;
    const length = layer.length * r * open;
    const width = layer.width * r * (.34 + .66 * open);
    const curl = layer.curl * open;
    const sway = REDUCED_MOTION ? .18 : 1;
    const drift = Math.sin(T * .7 + flower.x * .013 + petalIndex) * .012 * sway;

    g.save();
    g.translate(Math.cos(angle) * base, Math.sin(angle) * base);
    g.rotate(angle + drift);
    g.globalAlpha = .95 * open;

    const grad = g.createLinearGradient(0, -width, length, width * .65);
    grad.addColorStop(0, pal.deep);
    grad.addColorStop(.36, pal.mid);
    grad.addColorStop(.78, pal.light);
    grad.addColorStop(1, pal.highlight);

    g.beginPath();
    g.moveTo(0, -width * .3);
    g.bezierCurveTo(length * .12, -width * 1.12, length * .7, -width * (1.13 + curl * .2), length, -width * curl);
    g.bezierCurveTo(length * .79, width * (1.0 + curl), length * .23, width * .82, 0, width * .3);
    g.closePath();
    g.fillStyle = grad;
    g.fill();
    g.strokeStyle = 'rgba(28,12,20,.45)';
    g.lineWidth = 2.4;
    g.stroke();

    // Fine petal veins and a narrow reflected highlight keep the ASCII texture rich.
    g.strokeStyle = pal.vein;
    g.lineWidth = 1.25;
    g.beginPath();
    g.moveTo(4, 0);
    g.quadraticCurveTo(length * .36, -width * .04, length * .84, -width * .08);
    g.stroke();
    g.strokeStyle = 'rgba(255,245,239,.24)';
    g.lineWidth = 1.15;
    g.beginPath();
    g.moveTo(length * .12, -width * .18);
    g.quadraticCurveTo(length * .52, -width * .64, length * .85, -width * .24);
    g.stroke();

    if (ringIndex < 2 && petalIndex % 3 === 0 && open > .65) {
      g.fillStyle = 'rgba(91,37,52,.27)';
      for (let dot = 0; dot < 4; dot++) {
        const dx = length * (.48 + dot * .075);
        const dy = Math.sin(dot * 2.1 + petalIndex) * width * .2;
        g.beginPath(); g.ellipse(dx, dy, 2.1, 1.2, .2, 0, Math.PI * 2); g.fill();
      }
    }
    g.restore();
  }

  function drawPeony(g, flower, pal, index) {
    const firstOpen = easeOut(progress(T, flower.start, 1.55));
    if (firstOpen <= 0) return;
    const sway = REDUCED_MOTION ? .18 : 1;
    const driftX = Math.sin(T * .72 + index * 1.7) * 2.5 * sway;
    const driftY = Math.cos(T * .54 + index) * 1.8 * sway;

    g.save();
    g.translate(flower.x + driftX, flower.y + driftY);
    g.rotate(flower.rotation * .13 + Math.sin(T * .42 + index) * .008 * sway);

    LAYERS.forEach((layer, ringIndex) => {
      for (let i = 0; i < layer.count; i++) drawPetal(g, flower, layer, ringIndex, i, pal);
    });

    const centerOpen = easeOut(progress(T, flower.start + 1.2, 1.4));
    if (centerOpen > 0) {
      const centerR = flower.radius * (.105 + .045 * centerOpen);
      const centerGrad = g.createRadialGradient(-centerR * .22, -centerR * .3, 1, 0, 0, centerR * 1.35);
      centerGrad.addColorStop(0, pal.highlight);
      centerGrad.addColorStop(.42, pal.center);
      centerGrad.addColorStop(1, pal.centerDark);
      g.globalAlpha = centerOpen;
      g.fillStyle = centerGrad;
      g.beginPath(); g.arc(0, 0, centerR, 0, Math.PI * 2); g.fill();

      const seed = seeded(100 + index * 91);
      for (let i = 0; i < 38; i++) {
        const a = i / 38 * Math.PI * 2 + T * .025;
        const rr = centerR * (.35 + seed() * .82);
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        const dot = 1.4 + seed() * 2.0;
        g.strokeStyle = pal.centerDark;
        g.lineWidth = 1.1;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 7); g.stroke();
        g.fillStyle = i % 3 ? pal.center : pal.highlight;
        g.beginPath(); g.arc(x + Math.cos(a) * 7, y + Math.sin(a) * 7, dot, 0, Math.PI * 2); g.fill();
      }
    }
    g.restore();
  }

  function drawFillers(g, pal) {
    for (const flower of BOTANY.filler) {
      const p = easeOut(progress(T, flower.start, .9));
      if (!p) continue;
      const sway = Math.sin(T * 1.2 + flower.phase) * 2.3;
      g.save();
      g.translate(flower.x + sway, flower.y + Math.cos(T + flower.phase) * 1.5);
      g.globalAlpha = p * .76;
      g.strokeStyle = 'rgba(130,162,105,.7)';
      g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(0, 13); g.lineTo(0, 0); g.stroke();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        g.fillStyle = i % 2 ? '#fff5e9' : '#e6d9d1';
        g.beginPath();
        g.arc(Math.cos(a) * flower.size * 1.5, Math.sin(a) * flower.size * 1.5, flower.size * .82, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = pal.center;
      g.beginPath(); g.arc(0, 0, flower.size * .72, 0, Math.PI * 2); g.fill();
      g.restore();
    }
  }

  function drawScene(g, pal) {
    drawFoliage(g, pal);
    FLOWERS.forEach((flower, index) => drawPeony(g, flower, pal, index));
    drawFillers(g, pal);

    // A few drifting pollen lights, painted into the same low-res field.
    for (let i = 0; i < 24; i++) {
      const phase = T * (.22 + (i % 5) * .035) + i * 2.399;
      const x = 500 + Math.cos(phase) * (185 + (i % 7) * 23);
      const y = 480 + Math.sin(phase * .83) * (155 + (i % 6) * 22);
      const alpha = .25 + .3 * (Math.sin(phase * 2) * .5 + .5);
      g.globalAlpha = alpha;
      g.fillStyle = i % 4 === 0 ? pal.highlight : '#f1d5ac';
      g.beginPath(); g.arc(x, y, 1.5 + (i % 3) * .45, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }

  function render() {
    if (!cols || !rows) return;
    const aspect = cellH / cellW;
    const mobile = window.innerWidth <= 760;
    let scale, offsetX, offsetY;
    if (mobile) {
      scale = Math.min((cols * .94) / WORLD_W, (rows * aspect * .78) / WORLD_H);
      offsetX = (cols - WORLD_W * scale) / 2;
      offsetY = (rows - WORLD_H * scale / aspect) / 2 + rows * .12;
    } else {
      scale = Math.min((cols * .69) / WORLD_W, (rows * aspect * .94) / WORLD_H);
      offsetX = cols * .69 - (WORLD_W * scale) / 2;
      offsetY = (rows - WORLD_H * scale / aspect) / 2;
    }

    octx.setTransform(1, 0, 0, 1, 0, 0);
    octx.clearRect(0, 0, cols, rows);
    octx.setTransform(scale, 0, 0, scale / aspect, offsetX, offsetY);
    drawScene(octx, PALETTES[paletteIndex]);

    const pixels = octx.getImageData(0, 0, cols, rows).data;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.fillStyle = '#080909';
    sctx.fillRect(0, 0, screen.width / dpr, screen.height / dpr);

    sctx.save();
    sctx.globalAlpha = .34;
    sctx.filter = `blur(${Math.max(2, Math.round(cellH * .42))}px)`;
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(off, 0, 0, cols * cellW, rows * cellH);
    sctx.restore();

    sctx.font = `bold ${fontSize}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
    sctx.textBaseline = 'top';
    const last = GLYPHS.length - 1;
    const tick = Math.floor(T * 9);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = (y * cols + x) * 4;
        const r = pixels[k], gg = pixels[k + 1], b = pixels[k + 2];
        const max = Math.max(r, gg, b);
        if (max < 13) continue;
        const value = max / 255;
        const hash = ((x * 73856093) ^ (y * 19349663) ^ (tick * 83492791)) >>> 0;
        const variation = hash % 9 === 0 ? (hash & 16 ? 1 : -1) : 0;
        const index = clamp(Math.round(Math.pow(value, .72) * last) + variation, 1, last);
        const boost = Math.min(1.28, (38 + 220 * value) / max);
        sctx.fillStyle = cachedStyle(
          Math.min(255, (r * boost) | 0) & 0xf8,
          Math.min(255, (gg * boost) | 0) & 0xf8,
          Math.min(255, (b * boost) | 0) & 0xf8,
        );
        sctx.fillText(GLYPHS[index], x * cellW, y * cellH);
      }
    }
  }

  function state() {
    if (failed) return;
    const palette = PALETTES[paletteIndex];
    window.dispatchEvent(new CustomEvent('peony:state', {
      detail: { paletteName: palette.name, swatches: palette.swatches, paused, time: T },
    }));
  }

  function replay() {
    if (failed) return;
    T = 0;
    paused = false;
    lastFrame = 0;
    if (visible && !document.hidden) {
      if (!runSafely(dirty ? resize : render)) return;
      dirty = false;
    } else {
      dirty = true;
    }
    state();
    syncScheduler();
  }

  function togglePause() {
    if (failed) return true;
    paused = !paused;
    lastFrame = 0;
    state();
    syncScheduler();
    return paused;
  }

  function nextPalette() {
    if (failed) return null;
    paletteIndex = (paletteIndex + 1) % PALETTES.length;
    if (visible && !document.hidden) {
      if (!runSafely(dirty ? resize : render)) return null;
      dirty = false;
    } else {
      dirty = true;
    }
    state();
    syncScheduler();
    return PALETTES[paletteIndex];
  }

  function setPalette(index) {
    if (failed || !Number.isInteger(index) || index < 0 || index >= PALETTES.length) return null;
    paletteIndex = index;
    if (visible && !document.hidden) {
      if (!runSafely(dirty ? resize : render)) return null;
      dirty = false;
    } else dirty = true;
    state();
    syncScheduler();
    return PALETTES[paletteIndex];
  }

  function setPlaybackRate(value) {
    if (failed || !Number.isFinite(value) || value < 0.75 || value > 1.25) return false;
    playbackRate = value;
    state();
    return true;
  }

  function getState() {
    if (failed) return null;
    return { paletteName: PALETTES[paletteIndex].name, swatches: PALETTES[paletteIndex].swatches, paused, paletteIndex, palettes: PALETTES.map((item) => item.name), playbackRate, time: T };
  }

  function sectionIsVisible() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function canAnimate() {
    return !failed && !paused && visible && !document.hidden;
  }

  function wake() {
    if (!canAnimate() || rafId !== null) return;
    rafId = requestAnimationFrame(frame);
  }

  function stopScheduler() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    lastFrame = 0;
  }

  function syncScheduler() {
    if (!canAnimate()) {
      stopScheduler();
      return;
    }
    if (dirty && !runSafely(resize)) return;
    wake();
  }

  function setVisibility(nextVisible) {
    if (failed) return;
    const wasVisible = visible;
    visible = Boolean(nextVisible);
    if (!visible) {
      stopScheduler();
      return;
    }
    if (document.hidden) {
      dirty = true;
      stopScheduler();
      return;
    }
    if (!wasVisible || dirty) {
      if (dirty) {
        if (!runSafely(resize)) return;
      } else if (!runSafely(render)) {
        return;
      }
    }
    syncScheduler();
  }

  function updateFallbackVisibility() {
    setVisibility(sectionIsVisible());
  }

  function frame(now) {
    rafId = null;
    if (!canAnimate()) {
      lastFrame = 0;
      return;
    }
    if (lastFrame && now - lastFrame < 1000 / FPS) {
      wake();
      return;
    }
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / FPS;
    lastFrame = now;
    T += delta * playbackRate;
    if (!runSafely(render)) return;
    if (canAnimate()) wake();
  }

  // Initial measurement is synchronous; the first observer callback is asynchronous.
  visible = sectionIsVisible();
  if (!runSafely(resize)) return;
  if (document.hidden) dirty = true;

  if (typeof window.IntersectionObserver === 'function') {
    try {
      observer = new window.IntersectionObserver((entries) => {
        const entry = entries.find((item) => item.target === section);
        if (entry) setVisibility(entry.isIntersecting && entry.intersectionRatio > 0);
      }, { threshold: [0, .01, .08] });
      observer.observe(section);
      observing = true;
    } catch (error) {
      if (observer && typeof observer.disconnect === 'function') {
        try { observer.disconnect(); } catch (disconnectError) {
          console.warn('[PeonyScene] Could not disconnect the failed observer.', disconnectError);
        }
      }
      observer = null;
      observing = false;
      console.warn('[PeonyScene] Visibility observer failed; using viewport bounds instead.', error);
    }
  }

  resizeHandler = () => {
    if (failed) return;
    visible = sectionIsVisible();
    dirty = true;
    if (!visible || document.hidden) {
      stopScheduler();
      return;
    }
    if (!runSafely(resize)) return;
    syncScheduler();
  };
  if (!observing) {
    scrollHandler = updateFallbackVisibility;
    window.addEventListener('scroll', scrollHandler, { passive: true });
    updateFallbackVisibility();
  }
  visibilityHandler = () => {
    if (document.hidden) {
      stopScheduler();
      return;
    }
    visible = sectionIsVisible();
    if (visible && dirty && !runSafely(resize)) return;
    syncScheduler();
  };
  keydownHandler = (event) => {
    const target = event.target;
    if (failed || (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)))) return;
    if (!visible || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.code === 'Space') { event.preventDefault(); togglePause(); }
    if (event.key.toLowerCase() === 'r') replay();
    if (event.key.toLowerCase() === 'p') nextPalette();
  };
  window.addEventListener('resize', resizeHandler, { passive: true });
  document.addEventListener('visibilitychange', visibilityHandler);
  window.addEventListener('keydown', keydownHandler);

  window.PeonyScene = Object.freeze({ replay, togglePause, nextPalette, setPalette, setPlaybackRate, getState });
  syncScheduler();

})();
