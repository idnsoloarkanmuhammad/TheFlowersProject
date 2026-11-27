(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'poppy', name: 'Poppies', latin: 'Papaver rhoeas', seed: 4909, art: .69, accent: '#ee6a4f',
    title: 'Tissue paper,<br>in <em>red.</em>',
    copy: 'The petals are crumpled in the bud and only smooth out as the flower opens; each bloom lasts a day or two. The seeds can wait in disturbed soil for years, then flower all at once.',
    facts: [['Family', 'Papaveraceae'], ['Petals', '4, in two sizes'], ['Drawn with', '3 blooms, 2 seed pods']],
    note: ['SIMPLE FORM', 'Four petals, one centre: low complexity reads quickly.'],
    ambient: { rose: [236, 96, 76], leaf: [140, 170, 120], light: [240, 190, 150] },
    palettes: [
      palette('Field', ['#7a1410', '#e0372a', '#ff9a78'], { deep: '#8c1612', mid: '#e0372a', light: '#f56a48', tip: '#ffb08c', blot: '#150808' }),
      palette('Coral', ['#9a3a2a', '#f08060', '#ffd6bc'], { deep: '#a53f2c', mid: '#ee7c5a', light: '#f7a888', tip: '#ffe0cc', blot: '#2a1410' }),
      palette('Cream', ['#8c7a60', '#eadfca', '#fffdf6'], { deep: '#9b8a70', mid: '#e8dcc6', light: '#f4ecdc', tip: '#fffdf6', blot: '#3a2a3a' }),
    ],
    build(random, U) {
      const heads = [{ x: 500, y: 380, R: 175, start: 1.6, bx: 500 }, { x: 292, y: 560, R: 118, start: 3.0, bx: 380 }, { x: 712, y: 545, R: 122, start: 3.5, bx: 620 }]
        .map((h) => ({ ...h, stem: [[h.bx, 1030], [h.bx - 20, 840], [h.x + 20, h.y + h.R + 90], [h.x, h.y + h.R * .35]] }));
      const pods = [{ x: 410, y: 690, start: 4.6 }, { x: 600, y: 675, start: 5.0 }].map((p) => ({ ...p, stem: [[p.x + (p.x < 500 ? 20 : -20), 1030], [p.x, 880], [p.x + 10, p.y + 120], [p.x, p.y + 30]] }));
      const hair = Array.from({ length: 36 }, () => ({ t: .2 + random() * .75, s: random() < .5 ? 1 : -1, h: 5 + random() * 6, i: Math.floor(random() * 3) }));
      return { heads, pods, hair };
    },
    draw(g, pal, T, d, U) {
      const all = [...d.heads, ...d.pods];
      for (const h of all) U.stem(g, h.stem, U.easeOut(U.progress(T, h.start - 2, 2.6)), pal.stem, 4.5);
      all.forEach((h, i) => {
        const gr = U.easeOut(U.progress(T, h.start - 2, 2.6));
        if (gr < .5) return;
        g.strokeStyle = 'rgba(190,210,160,.5)'; g.lineWidth = 1;
        for (const k of d.hair) { if (k.i !== i % 3) continue; const p = U.cubic(h.stem, k.t); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + k.s * k.h, p[1] - 4); g.stroke(); }
        const a = U.cubic(h.stem, .35);
        for (const s of [-1, 1]) U.leaf(g, pal, a[0], a[1], -Math.PI / 2 + s * .9, 78, 18, U.open(T, h.start, 1), { tip: .7, light: s > 0, curl: s * .3 });
      });
      for (const p of d.pods) {
        const o = U.open(T, p.start, 1.4);
        if (o <= 0) continue;
        g.save(); g.translate(p.x + U.sway(T, p.x, 2), p.y); g.scale(o, o);
        g.save(); g.scale(1, 1.3); U.disc(g, 26, [pal.leafLight, pal.leaf, pal.leafDark]); g.restore();
        g.fillStyle = pal.leafDark; g.beginPath(); g.ellipse(0, -36, 24, 7, 0, 0, U.TAU); g.fill();
        g.strokeStyle = pal.leafLight; g.lineWidth = 1.6;
        for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 3, -36); g.lineTo(i * 8, -34 + Math.abs(i) * 2); g.stroke(); }
        g.restore();
      }
      d.heads.forEach((h, idx) => {
        g.save(); g.translate(h.x + U.sway(T, idx * 2, 2), h.y + U.sway(T + 1, idx, 1.5)); g.rotate(idx * .5);
        for (let k = 0; k < 4; k++) {
          const o = U.open(T, h.start + (k % 2) * .35 + k * .08, 1.5);
          if (o <= 0) continue;
          const big = k % 2 === 0, R = h.R * (big ? 1 : .88) * o;
          g.save(); g.rotate(k * Math.PI / 2 + .39);
          U.petal(g, { len: R * .96, wid: R * (big ? .78 : .66), tip: 0, belly: .55, curl: Math.sin(k) * .2, colors: [pal.deep, pal.mid, pal.light, pal.tip], veins: 5, vein: 'rgba(80,10,10,.32)', outline: 'rgba(60,8,8,.45)' });
          g.strokeStyle = 'rgba(255,230,210,.2)'; g.lineWidth = 1.4;
          for (let c = 0; c < 4; c++) { g.beginPath(); g.moveTo(R * .35, (c - 1.5) * R * .22); g.quadraticCurveTo(R * .6, (c - 1.5) * R * .3 + Math.sin(c + k) * 9, R * .86, (c - 1.5) * R * .26); g.stroke(); }
          g.save(); g.scale(1, 1.2); U.disc(g, R * .13, [pal.blot, pal.blot, 'rgba(0,0,0,0)'], R * .1, 0); g.restore();
          g.restore();
        }
        const c = U.open(T, h.start + .8, 1.2);
        U.disc(g, h.R * .12 * c, [pal.leafLight, pal.leaf, pal.leafDark]);
        g.strokeStyle = pal.leafLight; g.lineWidth = 1.4;
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * h.R * .11 * c, Math.sin(a) * h.R * .11 * c); g.stroke(); }
        g.fillStyle = pal.blot;
        for (let i = 0; i < 34; i++) { const a = i * U.GOLDEN, r = h.R * (.16 + (i % 5) * .012) * c; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 2.1, 0, U.TAU); g.fill(); }
        g.restore();
      });
      U.motes(g, T, 18, 500, 480, 340, 300, [pal.tip, '#f1d5ac']);
    },
  });
})();
