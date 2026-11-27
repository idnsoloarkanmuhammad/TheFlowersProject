// ASCII violets: five-petalled flowers, heart-shaped foliage and drifting light,
// redrawn as coloured glyphs on every frame. No image or video assets are used.
(() => {
  'use strict';

  const WORLD_W = 1000;
  const WORLD_H = 1000;
  const FPS = 30;
  const GLYPHS = ' .,:;!|i+*ox%#@';
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screen = document.getElementById('violet-screen');
  const section = document.getElementById('violet-study');
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
        console.warn('[VioletScene] Could not disconnect the failed observer.', disconnectError);
      }
    }
    observer = null;
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
    if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
    console.error('[VioletScene] The violet renderer could not be initialized or drawn.', error);
    delete window.VioletScene;
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
    const state = document.getElementById('violet-animation-state');
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
    if (!screen || typeof screen.getContext !== 'function') throw new Error('The violet canvas is unavailable.');
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
      name: 'Periwinkle',
      deep: '#29345f', mid: '#6475c2', light: '#a5a9e5', highlight: '#e7e3ff',
      vein: 'rgba(36,38,88,.62)', throat: '#e6c77d', throatLight: '#fff0bd', throatDark: '#9a754b',
      leafDark: '#203d3a', leaf: '#456d63', leafLight: '#91a98b', stem: '#5e806d',
      swatches: ['#29345f', '#7184d1', '#e7e3ff'], background: '#080b13',
    },
    {
      name: 'Blue Hour',
      deep: '#172d59', mid: '#3e65a0', light: '#86add5', highlight: '#d8e9f6',
      vein: 'rgba(18,39,78,.62)', throat: '#d9b978', throatLight: '#fff0c7', throatDark: '#896b4d',
      leafDark: '#1e3938', leaf: '#426a5e', leafLight: '#8da992', stem: '#527969',
      swatches: ['#172d59', '#5c85b8', '#d8e9f6'], background: '#070c15',
    },
    {
      name: 'Lavender Ink',
      deep: '#49345f', mid: '#8067a8', light: '#b8a7d8', highlight: '#eee4f5',
      vein: 'rgba(62,42,84,.62)', throat: '#d8bd78', throatLight: '#fff0c4', throatDark: '#866549',
      leafDark: '#263d3b', leaf: '#527166', leafLight: '#9aae91', stem: '#5d7c6b',
      swatches: ['#49345f', '#967db8', '#eee4f5'], background: '#0a0913',
    },
    {
      name: 'Letter Gold',
      deep: '#41416e', mid: '#7777a8', light: '#c1b9cc', highlight: '#f2e9d9',
      vein: 'rgba(55,48,85,.58)', throat: '#d4a95f', throatLight: '#fff0c7', throatDark: '#815b39',
      leafDark: '#253d35', leaf: '#587260', leafLight: '#a3aa7e', stem: '#718268',
      swatches: ['#41416e', '#9891b8', '#e9d6a8'], background: '#0b0b12',
    },
  ];

  const FLOWERS = [
    { x: 520, y: 270, radius: 106, start: 3.05, rotation: -.12, stemBase: 505 },
    { x: 315, y: 420, radius: 88, start: 3.92, rotation: .16, stemBase: 405 },
    { x: 725, y: 410, radius: 96, start: 4.48, rotation: -.18, stemBase: 625 },
    { x: 450, y: 555, radius: 78, start: 5.18, rotation: .12, stemBase: 455 },
    { x: 640, y: 585, radius: 80, start: 5.82, rotation: -.08, stemBase: 570 },
    { x: 245, y: 640, radius: 65, start: 6.42, rotation: -.2, stemBase: 365 },
    { x: 805, y: 635, radius: 66, start: 6.88, rotation: .22, stemBase: 650 },
  ];

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, amount) => a + (b - a) * amount;
  const rad = (degrees) => degrees * Math.PI / 180;
  const progress = (time, start, duration) => clamp((time - start) / duration, 0, 1);
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);

  function seeded(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function cubic(points, t) {
    const u = 1 - t;
    return [
      u * u * u * points[0][0] + 3 * u * u * t * points[1][0] + 3 * u * t * t * points[2][0] + t * t * t * points[3][0],
      u * u * u * points[0][1] + 3 * u * u * t * points[1][1] + 3 * u * t * t * points[2][1] + t * t * t * points[3][1],
    ];
  }

  function cubicAngle(points, t) {
    const before = cubic(points, Math.max(0, t - .01));
    const after = cubic(points, Math.min(1, t + .01));
    return Math.atan2(after[1] - before[1], after[0] - before[0]);
  }

  function buildBotany() {
    const random = seeded(7319);
    const stems = [];
    const leaves = [];
    const buds = [];

    FLOWERS.forEach((flower, index) => {
      const baseX = flower.stemBase + (random() - .5) * 30;
      const points = [
        [baseX, 1040],
        [baseX + (flower.x - baseX) * .16 + (random() - .5) * 48, 825 - random() * 30],
        [lerp(baseX, flower.x, .74), flower.y + flower.radius * .78],
        [flower.x, flower.y + flower.radius * .18],
      ];
      stems.push({ points, start: .22 + index * .14 });

      const leafCount = 5 + (index % 3);
      for (let i = 0; i < leafCount; i++) {
        const t = .19 + (i / (leafCount + 1)) * .66 + random() * .025;
        leaves.push({
          stem: points,
          t,
          side: i % 2 === 0 ? -1 : 1,
          length: 72 + random() * 62,
          width: 30 + random() * 22,
          start: .72 + index * .11 + t * .85,
          tint: random(),
          curl: (random() - .5) * .16,
          phase: random() * Math.PI * 2,
        });
      }

      if (index % 2 === 0 || index === 3) {
        const point = cubic(points, .82);
        buds.push({
          x: point[0] + (index % 2 ? 24 : -24),
          y: point[1] - 8,
          start: 2.4 + index * .38,
          angle: index % 2 ? -.62 : -.35,
          scale: .64 + random() * .18,
        });
      }
    });

    const fillers = [];
    for (let i = 0; i < 20; i++) {
      fillers.push({
        x: 300 + random() * 430,
        y: 420 + random() * 310,
        size: 1.8 + random() * 2.2,
        start: 5.1 + random() * 3,
        phase: random() * Math.PI * 2,
      });
    }

    const drifting = [];
    for (let i = 0; i < 12; i++) {
      drifting.push({
        x: 270 + random() * 510,
        y: random() * 950,
        size: 4 + random() * 5,
        speed: 12 + random() * 18,
        phase: random() * Math.PI * 2,
        rotation: random() * Math.PI,
      });
    }

    const motes = [];
    for (let i = 0; i < 34; i++) {
      motes.push({
        x: 250 + random() * 540,
        y: 200 + random() * 570,
        size: .9 + random() * 1.8,
        phase: random() * Math.PI * 2,
        speed: .35 + random() * .75,
      });
    }

    return { stems, leaves, buds, fillers, drifting, motes };
  }

  const BOTANY = buildBotany();
  const PETALS = [
    { angle: -135, length: .76, width: .78, delay: .02, layer: 0 },
    { angle: -45, length: .76, width: .78, delay: .11, layer: 0 },
    { angle: 180, length: .80, width: .88, delay: .20, layer: 1 },
    { angle: 0, length: .80, width: .88, delay: .29, layer: 1 },
    { angle: 90, length: .92, width: 1.03, delay: .38, layer: 2 },
  ];

  // prefers-reduced-motion: start with the flowering finished and paused (20 s is past every delay).
  let time = REDUCED_MOTION ? 20 : 0;
  let playbackRate = 1;
  let paletteIndex = 0;
  let paused = REDUCED_MOTION;
  let cols = 0;
  let rows = 0;
  let cellW = 0;
  let cellH = 0;
  let fontSize = 0;
  let dpr = 1;
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

  function drawCurve(g, points, amount, color, width) {
    if (amount <= 0) return;
    const samples = 32;
    const end = Math.max(1, Math.floor(samples * amount));
    g.beginPath();
    for (let i = 0; i <= end; i++) {
      const point = cubic(points, (i / samples) * amount);
      if (i === 0) g.moveTo(point[0], point[1]);
      else g.lineTo(point[0], point[1]);
    }
    g.strokeStyle = color;
    g.lineWidth = width;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.stroke();
  }

  function drawHeartLeafPath(g, length, width, curl) {
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(length * .02, -width * .48, length * .22, -width * 1.02, length * .52, -width * .78);
    g.bezierCurveTo(length * .78, -width * .88, length * .98, -width * .35, length, curl * width);
    g.bezierCurveTo(length * .98, width * .38, length * .78, width * .86, length * .52, width * .78);
    g.bezierCurveTo(length * .22, width * 1.02, length * .02, width * .48, 0, 0);
    g.closePath();
  }

  function drawFoliage(g, pal) {
    for (const stem of BOTANY.stems) {
      const growth = easeOut(progress(time, stem.start, 3.4));
      drawCurve(g, stem.points, growth, pal.stem, 4.4);
    }

    for (const leaf of BOTANY.leaves) {
      const growth = easeOut(progress(time, leaf.start, .92));
      if (growth <= .001) continue;
      const anchor = cubic(leaf.stem, leaf.t);
      const sway = REDUCED_MOTION ? .16 : 1;
      const breeze = Math.sin(time * .72 + leaf.phase) * 2.8 * sway;
      const angle = cubicAngle(leaf.stem, leaf.t) + leaf.side * rad(50 + leaf.tint * 17) + breeze * .003;
      const length = leaf.length * growth;
      const width = leaf.width * growth;

      g.save();
      g.translate(anchor[0], anchor[1]);
      g.rotate(angle);
      drawHeartLeafPath(g, length, width, leaf.curl);

      const gradient = g.createLinearGradient(0, -width, length, width);
      gradient.addColorStop(0, pal.leafDark);
      gradient.addColorStop(.52, leaf.tint > .52 ? pal.leafLight : pal.leaf);
      gradient.addColorStop(1, pal.leafDark);
      g.fillStyle = gradient;
      g.fill();
      g.strokeStyle = 'rgba(5,17,16,.72)';
      g.lineWidth = 2.1;
      g.stroke();

      g.strokeStyle = 'rgba(195,211,167,.4)';
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(2, 0);
      g.quadraticCurveTo(length * .42, leaf.side * width * .04, length * .88, leaf.curl * width);
      g.stroke();
      for (let vein = 0; vein < 4; vein++) {
        const t = .27 + vein * .14;
        g.beginPath();
        g.moveTo(length * t, 0);
        g.quadraticCurveTo(length * (t + .08), -width * .42, length * (t + .18), -width * .53);
        g.moveTo(length * t, 0);
        g.quadraticCurveTo(length * (t + .08), width * .42, length * (t + .18), width * .53);
        g.stroke();
      }
      g.restore();
    }

    for (const bud of BOTANY.buds) {
      const growth = easeOut(progress(time, bud.start, 1.45));
      if (growth <= 0) continue;
      g.save();
      g.translate(bud.x, bud.y);
      g.rotate(bud.angle + Math.sin(time * .7 + bud.x) * .018);
      g.scale(growth * bud.scale, growth * bud.scale);
      const gradient = g.createLinearGradient(-15, -36, 22, 30);
      gradient.addColorStop(0, pal.leafLight);
      gradient.addColorStop(.54, pal.leaf);
      gradient.addColorStop(1, pal.leafDark);
      g.fillStyle = gradient;
      g.beginPath();
      g.moveTo(0, 31);
      g.bezierCurveTo(-26, 2, -18, -34, 0, -47);
      g.bezierCurveTo(24, -33, 28, 4, 0, 31);
      g.fill();
      g.strokeStyle = 'rgba(9,23,22,.7)';
      g.lineWidth = 2.4;
      g.stroke();
      g.restore();
    }
  }

  function drawBud(g, radius, openness, pal) {
    const scale = 1 - openness * .72;
    g.save();
    g.scale(scale, scale);
    const gradient = g.createRadialGradient(-radius * .16, -radius * .24, 1, 0, 0, radius * .54);
    gradient.addColorStop(0, pal.leafLight);
    gradient.addColorStop(.55, pal.leaf);
    gradient.addColorStop(1, pal.leafDark);
    g.fillStyle = gradient;
    g.beginPath();
    g.ellipse(0, 0, radius * .34, radius * .49, -.18, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = 'rgba(8,20,19,.72)';
    g.lineWidth = 2.2;
    g.stroke();
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5 + time * .012;
      g.strokeStyle = pal.leafLight;
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(Math.cos(angle) * radius * .25, Math.sin(angle) * radius * .3, Math.cos(angle) * radius * .38, Math.sin(angle) * radius * .42);
      g.stroke();
    }
    g.restore();
  }

  function drawPetal(g, flower, petal, index, pal) {
    const opening = easeOut(progress(time, flower.start + petal.delay, 1.9));
    if (opening <= .001) return;

    const radius = flower.radius;
    const length = radius * petal.length * (.035 + .965 * opening);
    const width = radius * (.29 + (petal.layer === 2 ? .07 : 0)) * petal.width * (.36 + .64 * opening);
    const angle = rad(petal.angle) + flower.rotation;
    const sway = REDUCED_MOTION ? .15 : 1;
    const drift = Math.sin(time * .64 + flower.x * .012 + index) * .009 * sway;

    g.save();
    g.rotate(angle + drift);
    g.globalAlpha = .98 * opening;

    const gradient = g.createLinearGradient(0, -width, length, width * .78);
    gradient.addColorStop(0, pal.deep);
    gradient.addColorStop(.31, pal.mid);
    gradient.addColorStop(.76, pal.light);
    gradient.addColorStop(1, pal.highlight);

    g.beginPath();
    g.moveTo(0, -width * .22);
    g.bezierCurveTo(length * .1, -width * 1.08, length * .56, -width * 1.16, length * .83, -width * .75);
    g.bezierCurveTo(length * 1.12, -width * .31, length * 1.08, width * .38, length * .78, width * .76);
    g.bezierCurveTo(length * .48, width * 1.05, length * .14, width * .76, 0, width * .22);
    g.closePath();
    g.fillStyle = gradient;
    g.fill();
    g.strokeStyle = 'rgba(12,13,34,.52)';
    g.lineWidth = 2.1;
    g.stroke();

    // The dark fine lines from the throat are a defining feature of viola petals.
    g.strokeStyle = pal.vein;
    g.lineWidth = 1.45;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(4, 0);
    g.quadraticCurveTo(length * .28, -width * .06, length * .82, -width * .12);
    g.moveTo(4, 0);
    g.quadraticCurveTo(length * .3, width * .1, length * .79, width * .18);
    g.stroke();

    g.strokeStyle = 'rgba(248,241,255,.23)';
    g.lineWidth = 1.1;
    g.beginPath();
    g.moveTo(length * .15, -width * .2);
    g.quadraticCurveTo(length * .52, -width * .72, length * .84, -width * .26);
    g.stroke();

    if (index === 4) {
      g.strokeStyle = 'rgba(42,34,80,.62)';
      g.lineWidth = 2.0;
      for (let stripe = -2; stripe <= 2; stripe++) {
        g.beginPath();
        g.moveTo(3, stripe * width * .055);
        g.quadraticCurveTo(length * .18, stripe * width * .1, length * (.36 + Math.abs(stripe) * .035), stripe * width * .22);
        g.stroke();
      }
    }

    g.restore();
  }

  function drawViolet(g, flower, pal, index) {
    const bloom = easeOut(progress(time, flower.start, 2.2));
    if (bloom <= .001) return;

    const sway = REDUCED_MOTION ? .14 : 1;
    const driftX = Math.sin(time * .66 + index * 1.8) * 2.1 * sway;
    const driftY = Math.cos(time * .49 + index) * 1.6 * sway;

    g.save();
    g.translate(flower.x + driftX, flower.y + driftY);
    g.rotate(flower.rotation * .16 + Math.sin(time * .4 + index) * .007 * sway);

    if (bloom < .84) drawBud(g, flower.radius, bloom, pal);
    PETALS.forEach((petal, petalIndex) => drawPetal(g, flower, petal, petalIndex, pal));

    const centre = easeOut(progress(time, flower.start + .6, 1.1));
    if (centre > .01) {
      const size = flower.radius * (.095 + .025 * centre);
      g.globalAlpha = centre;
      const centreGradient = g.createRadialGradient(-size * .28, -size * .34, 1, 0, 0, size * 1.35);
      centreGradient.addColorStop(0, pal.throatLight);
      centreGradient.addColorStop(.52, pal.throat);
      centreGradient.addColorStop(1, pal.throatDark);
      g.fillStyle = centreGradient;
      g.beginPath();
      g.ellipse(0, 0, size * 1.08, size * .88, .08, 0, Math.PI * 2);
      g.fill();

      g.strokeStyle = pal.throatDark;
      g.lineWidth = 1.05;
      for (let line = -2; line <= 2; line++) {
        g.beginPath();
        g.moveTo(line * size * .1, size * .08);
        g.quadraticCurveTo(line * size * .14, size * .25, line * size * .2, size * .42);
        g.stroke();
      }
      g.fillStyle = '#fff3c9';
      g.beginPath();
      g.arc(-size * .08, -size * .06, Math.max(1.8, size * .16), 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    }
    g.restore();
  }

  function drawFillers(g, pal) {
    for (const flower of BOTANY.fillers) {
      const opening = easeOut(progress(time, flower.start, .85));
      if (!opening) continue;
      const sway = Math.sin(time * .9 + flower.phase) * 1.9;
      g.save();
      g.translate(flower.x + sway, flower.y + Math.cos(time * .7 + flower.phase) * 1.3);
      g.globalAlpha = opening * .68;
      g.strokeStyle = 'rgba(132,166,138,.72)';
      g.lineWidth = 1.1;
      g.beginPath();
      g.moveTo(0, 10);
      g.lineTo(0, 0);
      g.stroke();
      for (let petal = 0; petal < 5; petal++) {
        const angle = petal * Math.PI * 2 / 5;
        g.fillStyle = petal % 2 ? pal.highlight : pal.light;
        g.beginPath();
        g.ellipse(Math.cos(angle) * flower.size, Math.sin(angle) * flower.size, flower.size * .6, flower.size * .42, angle, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = pal.throat;
      g.beginPath();
      g.arc(0, 0, flower.size * .33, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }

  function drawDriftingPetals(g, pal) {
    if (REDUCED_MOTION) return;
    for (const petal of BOTANY.drifting) {
      const cycle = (time * petal.speed / 100 + petal.y / 1100) % 1;
      const y = -35 + cycle * 1080;
      const x = petal.x + Math.sin(time * .52 + petal.phase) * 30;
      const rotation = petal.rotation + time * .24;
      const alpha = .18 + .2 * Math.sin(cycle * Math.PI);
      g.save();
      g.translate(x, y);
      g.rotate(rotation);
      g.globalAlpha = alpha;
      g.fillStyle = cycle > .5 ? pal.light : pal.highlight;
      g.beginPath();
      g.ellipse(0, 0, petal.size * .58, petal.size * 1.35, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }

  function drawMotes(g, pal) {
    for (const mote of BOTANY.motes) {
      const phase = time * mote.speed + mote.phase;
      const x = mote.x + Math.sin(phase * .72) * 8;
      const y = mote.y + Math.cos(phase * .56) * 7;
      const alpha = .18 + .34 * (Math.sin(phase * 1.7) * .5 + .5);
      g.globalAlpha = alpha;
      g.fillStyle = mote.size > 2.1 ? pal.throatLight : pal.highlight;
      g.beginPath();
      g.arc(x, y, mote.size, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  function drawScene(g, pal) {
    drawFoliage(g, pal);
    FLOWERS.forEach((flower, index) => drawViolet(g, flower, pal, index));
    drawFillers(g, pal);
    drawDriftingPetals(g, pal);
    drawMotes(g, pal);
  }

  function render() {
    if (!cols || !rows) return;
    const aspect = cellH / cellW;
    const mobile = window.innerWidth <= 760;
    let scale;
    let offsetX;
    let offsetY;

    if (mobile) {
      scale = Math.min((cols * .94) / WORLD_W, (rows * aspect * .77) / WORLD_H);
      offsetX = (cols - WORLD_W * scale) / 2;
      offsetY = (rows - WORLD_H * scale / aspect) / 2 + rows * .13;
    } else {
      scale = Math.min((cols * .70) / WORLD_W, (rows * aspect * .95) / WORLD_H);
      offsetX = cols * .70 - (WORLD_W * scale) / 2;
      offsetY = (rows - WORLD_H * scale / aspect) / 2;
    }

    octx.setTransform(1, 0, 0, 1, 0, 0);
    octx.clearRect(0, 0, cols, rows);
    octx.setTransform(scale, 0, 0, scale / aspect, offsetX, offsetY);
    drawScene(octx, PALETTES[paletteIndex]);

    const pixels = octx.getImageData(0, 0, cols, rows).data;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.fillStyle = PALETTES[paletteIndex].background;
    sctx.fillRect(0, 0, screen.width / dpr, screen.height / dpr);

    sctx.save();
    sctx.globalAlpha = .3;
    sctx.filter = `blur(${Math.max(2, Math.round(cellH * .4))}px)`;
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(off, 0, 0, cols * cellW, rows * cellH);
    sctx.restore();

    sctx.font = `bold ${fontSize}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
    sctx.textBaseline = 'top';
    const lastGlyph = GLYPHS.length - 1;
    const tick = Math.floor(time * 11);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const offset = (y * cols + x) * 4;
        const red = pixels[offset];
        const green = pixels[offset + 1];
        const blue = pixels[offset + 2];
        const maximum = Math.max(red, green, blue);
        if (maximum < 14) continue;

        const luminance = (red * .2126 + green * .7152 + blue * .0722) / 255;
        const hash = (Math.imul(x + 1, 73856093) ^ Math.imul(y + 1, 19349663) ^ Math.imul(tick + 1, 83492791)) >>> 0;
        const variation = hash % 11 === 0 ? (hash & 16 ? 1 : -1) : 0;
        const glyphIndex = clamp(Math.round(Math.pow(luminance, .78) * lastGlyph) + variation, 1, lastGlyph);
        const boost = Math.min(1.3, (42 + 215 * luminance) / Math.max(1, maximum));
        sctx.fillStyle = cachedStyle(
          Math.min(255, (red * boost) | 0) & 0xf8,
          Math.min(255, (green * boost) | 0) & 0xf8,
          Math.min(255, (blue * boost) | 0) & 0xf8,
        );
        sctx.fillText(GLYPHS[glyphIndex], x * cellW, y * cellH);
      }
    }
  }

  function emitState() {
    if (failed) return;
    const palette = PALETTES[paletteIndex];
    window.dispatchEvent(new CustomEvent('violet:state', {
      detail: { paletteName: palette.name, swatches: palette.swatches, paused, time },
    }));
  }

  function replay() {
    if (failed) return;
    time = 0;
    paused = false;
    lastFrame = 0;
    if (visible && !document.hidden) {
      if (!runSafely(dirty ? resize : render)) return;
      dirty = false;
    } else {
      dirty = true;
    }
    emitState();
    syncScheduler();
  }

  function togglePause() {
    if (failed) return true;
    paused = !paused;
    lastFrame = 0;
    emitState();
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
    emitState();
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
    emitState();
    syncScheduler();
    return PALETTES[paletteIndex];
  }

  function setPlaybackRate(value) {
    if (failed || !Number.isFinite(value) || value < 0.75 || value > 1.25) return false;
    playbackRate = value;
    emitState();
    return true;
  }

  function getState() {
    if (failed) return null;
    const palette = PALETTES[paletteIndex];
    return { paletteName: palette.name, swatches: palette.swatches, paused, paletteIndex, palettes: PALETTES.map((item) => item.name), playbackRate, time };
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
    time += delta * playbackRate;
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
          console.warn('[VioletScene] Could not disconnect the failed observer.', disconnectError);
        }
      }
      observer = null;
      observing = false;
      console.warn('[VioletScene] Visibility observer failed; using viewport bounds instead.', error);
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

  window.VioletScene = Object.freeze({ replay, togglePause, nextPalette, setPalette, setPlaybackRate, getState });
  syncScheduler();

})();
