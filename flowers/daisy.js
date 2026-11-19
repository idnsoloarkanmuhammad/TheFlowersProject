(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'daisy', name: 'Daisies', latin: 'Bellis perennis', seed: 4505, art: .69, accent: '#e9d27a',
    title: 'Small,<br>and <em>sure.</em>',
    copy: 'A daisy is not one flower but a head of many: yellow disc florets in the middle, white ray florets around the edge. The name comes from \u201cday\u2019s eye\u201d, because it opens with the light.',
    facts: [['Family', 'Asteraceae'], ['Ray florets', '21 drawn'], ['Name', 'day\u2019s eye']],
    note: ['PROTOTYPE FLOWER', 'Radial, simple and low in complexity: rated most beautiful.'],
    ambient: { rose: [236, 224, 190], leaf: [140, 175, 120], light: [235, 205, 120] },
    palettes: [
      palette('Meadow', ['#b8b0a0', '#f3efe6', '#f2c230'], { ray0: '#cfc8b6', ray1: '#f4f0e6', ray2: '#ffffff', c0: '#f7d54a', c1: '#e1a41c', c2: '#9a6a10' }),
      palette('Blushed', ['#b8586f', '#f1b6c3', '#f2c230'], { ray0: '#e6a0b0', ray1: '#f6d3da', ray2: '#fff5f5', c0: '#f7d54a', c1: '#e1a41c', c2: '#9a6a10' }),
      palette('Aster', ['#4a4fa0', '#9aa3e6', '#f2c230'], { ray0: '#6f78cf', ray1: '#aab3ee', ray2: '#e6e9ff', c0: '#f7d54a', c1: '#e1a41c', c2: '#9a6a10' }),
    ],
    build(random, U) {
      const spots = [[500, 400, 150, 1.2], [330, 520, 100, 2.4], [680, 510, 104, 2.8], [235, 660, 78, 3.6], [770, 650, 80, 4.0], [430, 700, 70, 4.3], [585, 690, 68, 4.6], [390, 300, 58, 5.0], [615, 290, 56, 5.3]];
      const flowers = spots.map(([x, y, R, start], i) => ({ x, y, R, start, bx: 500 + (x - 500) * .55, rot: random() * 2, i }));
      const blades = Array.from({ length: 34 }, (_, i) => ({ x: 130 + i * 22 + random() * 12, h: 140 + random() * 150, lean: (random() - .5) * .5, start: .2 + random() * 1.5, ph: random() * 6 }));
      return { flowers, blades };
    },
    draw(g, pal, T, d, U) {
      for (const b of d.blades) {
        const p = U.open(T, b.start, 1.6);
        U.leaf(g, pal, b.x, 1030, -Math.PI / 2 + b.lean + U.sway(T, b.ph, .04), b.h, 10, p, { tip: .9, light: b.ph > 3 });
      }
      for (const f of d.flowers) {
        const pts = [[f.bx, 1030], [f.bx, 880], [f.x, f.y + 190], [f.x, f.y + f.R * .2]];
        U.stem(g, pts, U.easeOut(U.progress(T, f.start - 1.6, 2.4)), pal.stem, 4);
        const a = U.cubic(pts, .45);
        U.leaf(g, pal, a[0], a[1], -Math.PI / 2 + .9 * (f.i % 2 ? 1 : -1), 70, 22, U.open(T, f.start, 1), { tip: .5 });
      }
      d.flowers.forEach((f) => {
        const first = U.open(T, f.start, 1.4);
        if (first <= 0) return;
        g.save();
        g.translate(f.x + U.sway(T, f.i, 2), f.y + U.sway(T + 1, f.i, 1.4)); g.rotate(f.rot);
        const discR = f.R * .24;
        for (let i = 0; i < 21; i++) {
          const o = U.open(T, f.start + i * .03, 1.3);
          if (o <= 0) continue;
          g.save(); g.rotate(i / 21 * U.TAU); g.translate(discR * .7, 0);
          U.petal(g, { len: f.R * .78 * o, wid: f.R * .085, tip: .1, notch: .5, belly: .55, colors: [pal.ray0, pal.ray1, pal.ray2], veins: 2, vein: 'rgba(90,80,70,.3)', outline: 'rgba(40,34,30,.45)' });
          g.restore();
        }
        const o = U.open(T, f.start + .7, 1.2);
        U.disc(g, discR * o, [pal.c0, pal.c1, pal.c2]);
        g.fillStyle = pal.c2;
        for (let i = 1; i < 26; i++) { const r = discR * .85 * Math.sqrt(i / 26) * o, a = i * U.GOLDEN; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 1.6, 0, U.TAU); g.fill(); }
        g.restore();
      });
      U.motes(g, T, 22, 500, 480, 360, 300, ['#ffffff', '#f2d98a']);
    },
  });
})();
