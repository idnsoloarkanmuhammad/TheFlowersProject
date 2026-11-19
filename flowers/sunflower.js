(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'sunflower', name: 'Sunflowers', latin: 'Helianthus annuus', seed: 4404, art: .31, accent: '#e8b64c',
    title: 'Counting<br>the <em>seeds.</em>',
    copy: 'The seed head is packed by turning 137.5\u00b0 for every new seed, the golden angle. That makes two sets of spirals running opposite ways, usually counted in Fibonacci numbers such as 34 and 55.',
    facts: [['Family', 'Asteraceae'], ['Angle', '137.5\u00b0 per seed'], ['Drawn with', '420 seeds in the large head']],
    note: ['MANY AXES OF SYMMETRY', 'More symmetry axes are processed more fluently.'],
    ambient: { rose: [232, 180, 76], leaf: [150, 175, 120], light: [230, 200, 150] },
    palettes: [
      palette('Classic', ['#4a2b14', '#e0a526', '#ffe08a'], { ray0: '#c4780f', ray1: '#f0b62b', ray2: '#ffe27c', d0: '#2b180c', d1: '#5a3418', d2: '#a8782f' }),
      palette('Copper', ['#5a1f10', '#c2561f', '#f4b36a'], { ray0: '#a8401a', ray1: '#d9732a', ray2: '#f6b66b', d0: '#2b140c', d1: '#4f2a16', d2: '#9a6a30' }),
      palette('Lemon', ['#5a4a14', '#e6cf3f', '#fff5b0'], { ray0: '#bba122', ray1: '#eed84a', ray2: '#fff6b8', d0: '#2c2410', d1: '#5a4a1c', d2: '#a99238' }),
    ],
    build(random, U) {
      const heads = [
        { x: 500, y: 360, R: 190, start: 1.3, seeds: 420, rot: .1 },
        { x: 280, y: 545, R: 125, start: 2.9, seeds: 260, rot: -.2 },
        { x: 722, y: 520, R: 130, start: 3.4, seeds: 260, rot: .3 },
      ];
      const bases = [500, 380, 620];
      const stems = heads.map((h, i) => ({ pts: [[bases[i], 1030], [bases[i], 840], [U.lerp(bases[i], h.x, .8), h.y + h.R + 120], [h.x, h.y + h.R * .3]], start: .2 + i * .3 }));
      const leaves = [];
      stems.forEach((s, si) => { for (let i = 0; i < 3; i++) leaves.push({ pts: s.pts, t: .24 + i * .2, side: (i + si) % 2 ? 1 : -1, size: 120 + random() * 40, start: 1 + si * .3 + i * .4 }); });
      return { heads, stems, leaves };
    },
    draw(g, pal, T, d, U) {
      for (const s of d.stems) U.stem(g, s.pts, U.easeOut(U.progress(T, s.start, 3)), pal.stem, 11);
      for (const l of d.leaves) {
        const p = U.open(T, l.start, 1);
        const a = U.cubic(l.pts, l.t);
        U.leaf(g, pal, a[0], a[1], U.cubicAngle(l.pts, l.t) + l.side * U.rad(50) + U.sway(T, l.t * 9, .03), l.size, l.size * .55, p, { tip: .4, belly: .35, curl: l.side * .2, light: l.side > 0 });
      }
      d.heads.forEach((h, idx) => {
        const first = U.open(T, h.start, 1.6);
        if (first <= 0) return;
        g.save();
        g.translate(h.x + U.sway(T, idx * 2, 2.2), h.y + U.sway(T + 1, idx, 1.6));
        g.rotate(h.rot * .3 + U.sway(T, idx, .01));
        const discR = h.R * .46;
        for (const ring of [{ off: Math.PI / 21, scale: .9, cols: [pal.ray0, pal.ray1, pal.ray1], delay: 0 }, { off: 0, scale: 1, cols: [pal.ray0, pal.ray1, pal.ray2], delay: .25 }]) {
          for (let i = 0; i < 21; i++) {
            const o = U.open(T, h.start + ring.delay + i * .02, 1.4);
            if (o <= 0) continue;
            const a = i / 21 * U.TAU + ring.off;
            g.save(); g.rotate(a); g.translate(discR * .8, 0);
            U.petal(g, { len: h.R * .62 * ring.scale * o, wid: h.R * .1, tip: .8, belly: .45, curl: Math.sin(i * 2.1) * .12, colors: ring.cols, veins: 1, vein: 'rgba(120,60,8,.4)', outline: 'rgba(60,28,5,.5)' });
            g.restore();
          }
        }
        const dOpen = U.open(T, h.start + .8, 1.4);
        U.disc(g, discR * dOpen, [pal.d2, pal.d1, pal.d0]);
        const n = Math.round(h.seeds * dOpen), c = discR / Math.sqrt(h.seeds), sz = Math.max(1.4, h.R * .012);
        for (let i = 1; i < n; i++) {
          const r = c * Math.sqrt(i), a = i * U.GOLDEN + T * .01, t = r / discR;
          g.fillStyle = t > .78 ? pal.d2 : i % 2 ? pal.d1 : pal.d0;
          g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, sz * (1.1 + t * .6), 0, U.TAU); g.fill();
        }
        g.restore();
      });
      U.motes(g, T, 20, 500, 460, 340, 280, [pal.ray2, '#f1d5ac']);
    },
  });
})();
