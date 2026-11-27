(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'rose', name: 'Roses', latin: 'Rosa', seed: 4101, art: .69, accent: '#e08a9c',
    title: 'Too many<br><em>petals.</em>',
    copy: 'Wild roses have five. Breeders spent centuries turning stamens into petals until one bloom carried dozens, each layer overlapping the last. This one opens from the outside in.',
    facts: [['Family', 'Rosaceae'], ['Wild form', '5 petals'], ['Drawn with', '34 petals per head']],
    note: ['ONE FOCAL POINT', 'A single dominant head, radial and uncluttered.'],
    ambient: { rose: [214, 120, 140], leaf: [140, 170, 135], light: [230, 190, 170] },
    palettes: [
      palette('Claret', ['#5c1426', '#b3263f', '#f2a7b0'], { deep: '#4a0f20', mid: '#a5223b', light: '#cf4a62', tip: '#f4aab2', vein: 'rgba(60,8,24,.45)' }),
      palette('Apricot', ['#a3482e', '#e8956b', '#fbe0c4'], { deep: '#8c3a28', mid: '#dc8560', light: '#f1b48a', tip: '#fde4c8', vein: 'rgba(110,50,30,.4)' }),
      palette('Cream', ['#9a7d63', '#e6d2b8', '#fffaf0'], { deep: '#8f7860', mid: '#dcc7ac', light: '#efe2cd', tip: '#fffaf0', vein: 'rgba(110,88,66,.35)' }),
    ],
    build(random, U) {
      const heads = [
        { x: 500, y: 365, R: 185, start: 1.4, rot: -.1 },
        { x: 292, y: 560, R: 122, start: 2.8, rot: .2 },
        { x: 710, y: 540, R: 128, start: 3.3, rot: -.25 },
      ];
      const bases = [500, 360, 640];
      const stems = heads.map((h, i) => ({
        pts: [[bases[i], 1020], [bases[i] + (h.x - bases[i]) * .1, 820], [U.lerp(bases[i], h.x, .75), h.y + h.R * .8], [h.x, h.y + h.R * .2]],
        start: .2 + i * .3,
      }));
      const leaves = [];
      stems.forEach((s, si) => {
        for (let i = 0; i < 4; i++) {
          leaves.push({ pts: s.pts, t: .28 + i * .15 + random() * .03, side: i % 2 ? 1 : -1, size: 62 + random() * 26, start: 1 + si * .3 + i * .35 });
        }
      });
      const buds = [{ x: 410, y: 700, a: -.5, s: 1, start: 4.4 }, { x: 600, y: 690, a: .5, s: .9, start: 4.9 }];
      return { heads, stems, leaves, buds };
    },
    draw(g, pal, T, d, U) {
      for (const s of d.stems) U.stem(g, s.pts, U.easeOut(U.progress(T, s.start, 3)), pal.stem, 6);
      for (const l of d.leaves) {
        const p = U.open(T, l.start, .9);
        if (p <= 0) continue;
        const a = U.cubic(l.pts, l.t), base = U.cubicAngle(l.pts, l.t) + l.side * U.rad(58);
        U.leaf(g, pal, a[0], a[1], base, l.size, l.size * .42, p, { tip: .4 });
        U.leaf(g, pal, a[0] + Math.cos(base) * l.size * .3, a[1] + Math.sin(base) * l.size * .3, base + .6 * l.side, l.size * .7, l.size * .3, p, { tip: .4, light: true });
      }
      for (const b of d.buds) {
        const p = U.open(T, b.start, 1.4);
        if (p <= 0) continue;
        g.save(); g.translate(b.x, b.y); g.rotate(b.a + U.sway(T, b.x, .03)); g.scale(p * b.s, p * b.s);
        g.strokeStyle = pal.stem; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 90); g.lineTo(0, 20); g.stroke();
        U.disc(g, 26, [pal.tip, pal.mid, pal.deep], 0, 0);
        g.save(); g.scale(1, 1.5); U.disc(g, 20, [pal.light, pal.mid, pal.deep]); g.restore();
        for (let k = -1; k <= 1; k++) U.leaf(g, pal, 0, 20, Math.PI / 2 + k * .7, 34, 8, 1, { tip: .8 });
        g.restore();
      }
      d.heads.forEach((h, idx) => {
        const N = 34;
        g.save();
        g.translate(h.x + U.sway(T, idx * 1.7, 2.5), h.y + U.sway(T + 1.3, idx, 1.8));
        g.rotate(h.rot);
        for (let k = N - 1; k >= 0; k--) {
          const t = Math.sqrt((k + .5) / N), o = U.open(T, h.start + (1 - t) * 2.4, 1.5);
          if (o <= .001) continue;
          const a = k * U.GOLDEN, dist = h.R * (.05 + .52 * t) * o;
          g.save();
          g.translate(Math.cos(a) * dist, Math.sin(a) * dist * .92); g.rotate(a);
          g.globalAlpha = .96;
          U.petal(g, { len: h.R * (.3 + .36 * t) * o, wid: h.R * (.17 + .19 * t) * (.4 + .6 * o), tip: 0, belly: .5, curl: .35 * (1 - t), colors: [pal.deep, k % 2 ? pal.mid : pal.light, pal.tip], veins: 3, vein: pal.vein });
          g.restore();
        }
        g.restore();
      });
      U.motes(g, T, 22, 500, 480, 330, 260, [pal.tip, '#f1d5ac']);
    },
  });
})();
