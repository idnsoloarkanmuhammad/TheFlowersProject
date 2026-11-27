(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'tulip', name: 'Tulips', latin: 'Tulipa', seed: 4202, art: .31, accent: '#f08a5d',
    title: 'Open when<br>it\u2019s <em>warm.</em>',
    copy: 'Tulip petals respond to temperature, closing in the cold and opening as it warms. These five breathe slowly, a few degrees at a time.',
    facts: [['Family', 'Liliaceae'], ['Tepals', '6 (3 + 3)'], ['Drawn with', '5 stems, arranged symmetrically']],
    note: ['BALANCED ARRANGEMENT', 'Surveyed buyers preferred symmetrical bouquets.'],
    ambient: { rose: [235, 130, 95], leaf: [150, 180, 130], light: [240, 200, 140] },
    palettes: [
      palette('Flame', ['#8a1d1d', '#e2502f', '#ffb36b'], { deep: '#7a1a1c', mid: '#d94a2b', light: '#f58a45', tip: '#ffc27a' }),
      palette('Orchid', ['#4c2f6e', '#9a6ccb', '#e6d0f2'], { deep: '#43285f', mid: '#8b5fbd', light: '#bf98dd', tip: '#efdcf6' }),
      palette('Blush', ['#a45a6b', '#e7a3b4', '#fff0ee'], { deep: '#965063', mid: '#dd98ab', light: '#f2c4cd', tip: '#fff1ee' }),
    ],
    build(random, U) {
      const heads = [
        { x: 500, y: 300, s: 1.0, start: 2.4, bx: 500 },
        { x: 372, y: 372, s: .92, start: 3.0, bx: 430 },
        { x: 628, y: 372, s: .92, start: 3.3, bx: 570 },
        { x: 262, y: 470, s: .8, start: 3.9, bx: 360 },
        { x: 738, y: 470, s: .8, start: 4.2, bx: 640 },
      ].map((h) => ({ ...h, stem: [[h.bx, 1030], [h.bx + (h.x - h.bx) * .1, 840], [h.x + (h.bx - h.x) * .1, h.y + 250], [h.x, h.y + 30 * h.s]] }));
      const blades = [];
      for (let i = 0; i < 9; i++) {
        const side = i % 2 ? 1 : -1;
        blades.push({ x: 500 + side * (20 + i * 14), side, len: 360 + random() * 150, w: 28 + random() * 12, lean: .1 + random() * .35, start: .4 + i * .18 });
      }
      return { heads, blades };
    },
    draw(g, pal, T, d, U) {
      for (const b of d.blades) {
        const p = U.open(T, b.start, 2.2);
        U.leaf(g, pal, b.x, 1030, -Math.PI / 2 + b.side * b.lean + U.sway(T, b.x, .02), b.len, b.w, p, { tip: .7, belly: .4, curl: b.side * .5, light: b.w > 36 });
      }
      for (const h of d.heads) U.stem(g, h.stem, U.easeOut(U.progress(T, h.start - 2, 2.6)), pal.stem, 7);
      d.heads.forEach((h, i) => {
        const grow = U.open(T, h.start, 2);
        if (grow <= 0) return;
        const breath = (Math.sin(T * .35 + i * 1.3) + 1) / 2, spread = .1 + .42 * (.35 + .65 * breath) * grow;
        const H = 190 * h.s * grow, Wd = 62 * h.s;
        g.save();
        g.translate(h.x + U.sway(T, i, 2), h.y); g.rotate(U.sway(T, i * 2, .02));
        const draw = (ang, ox, len, wid, cols) => {
          g.save(); g.translate(ox, 0); g.rotate(-Math.PI / 2 + ang);
          U.petal(g, { len, wid, tip: .45, belly: .4, colors: cols, veins: 2, vein: pal.vein });
          g.restore();
        };
        draw(-spread * 1.15, -Wd * .3, H * .94, Wd * .86, [pal.deep, pal.mid, pal.light]);
        draw(spread * 1.15, Wd * .3, H * .94, Wd * .86, [pal.deep, pal.mid, pal.light]);
        draw(-spread * .45, -Wd * .12, H, Wd, [pal.deep, pal.light, pal.tip]);
        draw(spread * .45, Wd * .12, H, Wd, [pal.deep, pal.light, pal.tip]);
        draw(0, 0, H * 1.02, Wd * 1.05, [pal.mid, pal.light, pal.tip]);
        g.restore();
      });
      U.motes(g, T, 18, 500, 450, 360, 300, [pal.tip, '#f1d5ac']);
    },
  });
})();
