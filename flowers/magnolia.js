(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'magnolia', name: 'Magnolia', latin: 'Magnolia \u00d7 soulangeana', seed: 5212, art: .31, accent: '#e8b0c4',
    title: 'Before<br>the <em>leaves.</em>',
    copy: 'Many magnolias flower on bare branches in early spring, before any leaves open. They are an old lineage, and their flowers are traditionally pollinated by beetles rather than bees.',
    facts: [['Family', 'Magnoliaceae'], ['Tepals', '9, in three whorls'], ['Drawn with', '3 blooms, 4 furry buds']],
    note: ['FIGURE AND GROUND', 'Bare branch, few elements: the bloom is unmistakable.'],
    ambient: { rose: [232, 176, 196], leaf: [150, 150, 135], light: [245, 225, 220] },
    palettes: [
      palette('Blush', ['#a8506e', '#eab4c6', '#fff6f4'], { deep: '#a04a68', mid: '#e8aac0', tip: '#fff5f2', wood: '#3a2c28', cone: '#c8d48a' }),
      palette('Ivory', ['#8f8a6a', '#ece6d0', '#fffdf4'], { deep: '#a49c78', mid: '#ebe4cc', tip: '#fffdf4', wood: '#352a24', cone: '#c8d48a' }),
      palette('Plum', ['#4a1740', '#a2438c', '#f0b6e0'], { deep: '#431238', mid: '#9a3a84', tip: '#f0b4de', wood: '#30221f', cone: '#d8c080' }),
    ],
    build(random, U) {
      const main = [[-30, 960], [260, 800], [560, 470], [980, 190]];
      const twigs = [];
      const add = (t, a, len, w, s) => { const p = U.cubic(main, t); twigs.push({ pts: [p, [p[0] + Math.cos(a) * len * .3, p[1] + Math.sin(a) * len * .3], [p[0] + Math.cos(a) * len * .7, p[1] + Math.sin(a) * len * .7 - 10], [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len]], w, start: s }); };
      add(.34, -2.0, 190, 9, 1.4); add(.5, -.3, 210, 9, 1.8); add(.64, -2.2, 190, 8, 2.2); add(.8, -.9, 140, 6, 2.6);
      const blooms = [{ x: 345, y: 585, R: 112, start: 3.2, rot: .1 }, { x: 560, y: 300, R: 140, start: 2.6, rot: -.2 }, { x: 740, y: 430, R: 104, start: 3.7, rot: .3 }];
      const buds = [{ x: 220, y: 660, a: -1.2, s: 1 }, { x: 470, y: 410, a: -.6, s: .9 }, { x: 665, y: 245, a: -1.4, s: 1 }, { x: 880, y: 300, a: -.3, s: .8 }].map((b, i) => ({ ...b, start: 3 + i * .4 }));
      const fur = Array.from({ length: 22 }, () => ({ a: random() * 6.28, r: random(), l: 4 + random() * 5 }));
      return { main, twigs, blooms, buds, fur };
    },
    draw(g, pal, T, d, U) {
      U.stem(g, d.main, U.easeOut(U.progress(T, .2, 3.4)), pal.wood, 24);
      for (const tw of d.twigs) U.stem(g, tw.pts, U.easeOut(U.progress(T, tw.start - .6, 1.8)), pal.wood, tw.w);
      for (const b of d.buds) {
        const o = U.open(T, b.start, 1.2);
        if (o <= 0) continue;
        g.save(); g.translate(b.x, b.y); g.rotate(b.a); g.scale(o * b.s, o * b.s);
        g.save(); g.scale(1, 1.9); U.disc(g, 17, ['#c9b9a4', '#9a8570', '#5a463a']); g.restore();
        g.strokeStyle = 'rgba(230,220,200,.55)'; g.lineWidth = 1.1;
        for (const f of d.fur) { const x = Math.cos(f.a) * 15 * f.r, y = Math.sin(f.a) * 30 * f.r; g.beginPath(); g.moveTo(x, y); g.lineTo(x + f.l * .5, y - f.l); g.stroke(); }
        g.restore();
      }
      d.blooms.forEach((b, idx) => {
        if (U.open(T, b.start, 1.5) <= 0) return;
        g.save(); g.translate(b.x + U.sway(T, idx * 2, 1.6), b.y + U.sway(T + 1, idx, 1.2)); g.rotate(b.rot); g.scale(1, .88);
        [{ n: 3, len: 1, wid: .36, off: 0, delay: 0 }, { n: 3, len: .94, wid: .35, off: Math.PI / 3, delay: .3 }, { n: 3, len: .82, wid: .33, off: Math.PI / 6 + .2, delay: .6 }].forEach((w, wi) => {
          for (let i = 0; i < w.n; i++) {
            const o = U.open(T, b.start + w.delay + i * .12, 1.8);
            if (o <= 0) continue;
            g.save(); g.rotate(i / w.n * U.TAU + w.off + wi * .4);
            U.petal(g, { len: b.R * w.len * o, wid: b.R * w.wid, tip: .1, belly: .58, curl: .06, colors: [pal.deep, pal.mid, pal.tip], veins: 3, vein: 'rgba(110,50,70,.28)', outline: 'rgba(50,25,35,.45)' });
            g.restore();
          }
        });
        const c = U.open(T, b.start + 1.3, 1.3);
        g.strokeStyle = pal.deep; g.lineWidth = 1.6;
        for (let i = 0; i < 18; i++) { const a = i * .35; g.beginPath(); g.moveTo(Math.cos(a) * b.R * .08, Math.sin(a) * b.R * .08); g.lineTo(Math.cos(a) * b.R * .22 * c, Math.sin(a) * b.R * .22 * c); g.stroke(); }
        U.disc(g, b.R * .1 * c, [pal.tip, pal.cone, '#7a8a48']);
        g.restore();
      });
      U.motes(g, T, 16, 500, 450, 380, 300, [pal.tip, '#f6e6d6']);
    },
  });
})();
