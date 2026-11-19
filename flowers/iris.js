(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'iris', name: 'Irises', latin: 'Iris germanica', seed: 4808, art: .31, accent: '#9b8cf0',
    title: 'Three up,<br>three <em>down.</em>',
    copy: 'The three upright petals are standards, the three that hang are falls, and a fuzzy beard runs down each fall. The genus is named for Iris, the Greek goddess of the rainbow.',
    facts: [['Family', 'Iridaceae'], ['Parts', '3 standards, 3 falls'], ['Symmetry', 'bilateral, not radial']],
    note: ['BLUE-VIOLET', 'Blue was the most preferred flower colour in the study.'],
    ambient: { rose: [150, 130, 235], leaf: [130, 170, 140], light: [235, 200, 120] },
    palettes: [
      palette('Bearded blue', ['#2b2b8a', '#6a63d6', '#cdc8f6'], { stand: ['#4a46b8', '#8a82e6', '#d9d4fa'], fall: ['#23236f', '#4e48b8', '#8c84e0'], beard: '#f2c43a', vein: 'rgba(15,10,70,.55)' }),
      palette('Sunset', ['#7a1f3d', '#e0813a', '#ffd9a0'], { stand: ['#c4602a', '#f0a45c', '#ffe0b0'], fall: ['#5e1431', '#9c2c4e', '#d96b5a'], beard: '#ffe27a', vein: 'rgba(60,10,25,.55)' }),
      palette('White', ['#5a5aa8', '#d8d6f0', '#ffffff'], { stand: ['#b8b6e0', '#eceaf8', '#ffffff'], fall: ['#8d8bcb', '#d7d5f0', '#f6f5ff'], beard: '#f2c43a', vein: 'rgba(60,60,130,.45)' }),
    ],
    build(random, U) {
      const heads = [{ x: 500, y: 290, R: 150, start: 2.4, bx: 500 }, { x: 310, y: 470, R: 118, start: 3.4, bx: 400 }, { x: 695, y: 440, R: 122, start: 3.9, bx: 600 }]
        .map((h) => ({ ...h, stem: [[h.bx, 1030], [h.bx, 860], [h.x, h.y + h.R + 200], [h.x, h.y + h.R * .5]] }));
      const swords = Array.from({ length: 11 }, (_, i) => { const k = i - 5; return { x: 500 + k * 36, ang: -Math.PI / 2 + k * .07, len: 470 - Math.abs(k) * 28 + random() * 30, w: 30 - Math.abs(k), start: .2 + Math.abs(k) * .16, ph: i }; });
      return { heads, swords };
    },
    draw(g, pal, T, d, U) {
      for (const s of d.swords) U.leaf(g, pal, s.x, 1030, s.ang + U.sway(T, s.ph, .02), s.len, s.w, U.open(T, s.start, 2.4), { tip: .8, belly: .35, curl: (s.ang + Math.PI / 2) * 1.2, light: s.ph % 3 === 0 });
      for (const h of d.heads) U.stem(g, h.stem, U.easeOut(U.progress(T, h.start - 2, 2.6)), pal.stem, 8);
      d.heads.forEach((h, idx) => {
        const o = U.open(T, h.start, 2);
        if (o <= 0) return;
        g.save(); g.translate(h.x + U.sway(T, idx, 2), h.y + U.sway(T + 1, idx, 1.2));
        const R = h.R * o;
        const stand = (ang, len, wid) => { g.save(); g.rotate(ang); U.petal(g, { len, wid, tip: .15, belly: .5, curl: .1, colors: pal.stand, veins: 3, vein: pal.vein }); g.restore(); };
        stand(-Math.PI / 2, R * .95, R * .3);
        stand(-Math.PI / 2 - .62, R * .88, R * .34);
        stand(-Math.PI / 2 + .62, R * .88, R * .34);
        for (const [ang, len] of [[Math.PI / 2, R * .9], [Math.PI * .18, R * 1.02], [Math.PI * .82, R * 1.02]]) {
          g.save(); g.rotate(ang);
          U.petal(g, { len, wid: R * .36, tip: 0, belly: .6, curl: ang === Math.PI / 2 ? 0 : (ang < 2 ? .5 : -.5), colors: pal.fall, veins: 5, vein: pal.vein });
          g.strokeStyle = pal.beard; g.lineWidth = 3;
          for (let i = 0; i < 9; i++) { const t = .12 + i * .06; g.beginPath(); g.moveTo(len * t, -4); g.lineTo(len * t + 6, 0); g.lineTo(len * t, 4); g.stroke(); }
          g.restore();
        }
        g.restore();
      });
      U.motes(g, T, 18, 500, 480, 330, 300, [pal.stand[2], '#f1d5ac']);
    },
  });
})();
