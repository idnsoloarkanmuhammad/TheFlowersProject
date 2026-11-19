(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'lotus', name: 'Lotus', latin: 'Nelumbo nucifera', seed: 5111, art: .69, accent: '#f0a0c4',
    title: 'Rain slides<br>right <em>off.</em>',
    copy: 'Lotus leaves carry microscopic bumps and a waxy coating, so water beads up and rolls away, taking dirt with it. Researchers call this the lotus effect.',
    facts: [['Family', 'Nelumbonaceae'], ['Leaves', 'round, stalk in the centre'], ['Drawn with', '22 petals in 3 rings']],
    note: ['RADIAL SYMMETRY', 'Concentric rings give many axes of symmetry.'],
    ambient: { rose: [240, 160, 196], leaf: [120, 175, 150], light: [240, 215, 150] },
    palettes: [
      palette('Pink', ['#a8406e', '#f08cb8', '#fff0f4'], { deep: '#a03a68', mid: '#ec86b2', light: '#f8bcd4', tip: '#fff1f5', seed: '#c8d070' }),
      palette('White', ['#8d9a9a', '#e8eeee', '#ffffff'], { deep: '#a7b5b0', mid: '#e6eeec', light: '#f4f8f6', tip: '#ffffff', seed: '#c8d070' }),
      palette('Magenta', ['#5a1456', '#b02e94', '#f2a2e0'], { deep: '#521050', mid: '#a82a8c', light: '#d874c0', tip: '#f5b4e6', seed: '#c8d070' }),
    ],
    build(random, U) {
      const leaves = [[225, 790, 200, 56, 1.2], [790, 830, 190, 52, 1.8], [560, 900, 150, 42, 2.2], [120, 905, 130, 36, 2.6]].map(([x, y, rx, ry, start]) => ({ x, y, rx, ry, start }));
      return { leaves };
    },
    draw(g, pal, T, d, U) {
      g.save(); g.strokeStyle = 'rgba(120,170,190,.22)'; g.lineWidth = 2;
      for (let i = 0; i < 4; i++) { const p = ((T * .1 + i / 4) % 1), r = 120 + p * 330; g.globalAlpha = (1 - p) * .9; g.beginPath(); g.ellipse(500, 905, r, r * .22, 0, 0, U.TAU); g.stroke(); }
      g.restore(); g.globalAlpha = 1;
      for (const l of d.leaves) {
        const o = U.open(T, l.start, 1.8);
        if (o <= 0) continue;
        g.save(); g.translate(l.x, l.y + U.sway(T, l.x, 1.5)); g.scale(o, o);
        g.beginPath(); g.ellipse(0, 0, l.rx, l.ry, 0, 0, U.TAU);
        const gr = g.createRadialGradient(0, 0, 4, 0, 0, l.rx); gr.addColorStop(0, pal.leafLight); gr.addColorStop(.6, pal.leaf); gr.addColorStop(1, pal.leafDark);
        g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(8,18,12,.65)'; g.lineWidth = 2.6; g.stroke();
        g.strokeStyle = 'rgba(190,220,170,.42)'; g.lineWidth = 1.2;
        for (let i = 0; i < 16; i++) { const a = i * U.TAU / 16; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * l.rx * .94, Math.sin(a) * l.ry * .94); g.stroke(); }
        g.fillStyle = 'rgba(220,240,250,.55)'; g.beginPath(); g.arc(l.rx * .22, -l.ry * .1, 3, 0, U.TAU); g.fill();
        g.restore();
      }
      const stemP = U.easeOut(U.progress(T, .4, 3));
      U.stem(g, [[500, 930], [500, 840], [500, 700], [500, 620]], stemP, pal.stem, 11);
      const bud = U.open(T, 4.2, 1.6);
      if (bud > 0) {
        U.stem(g, [[720, 920], [722, 820], [716, 700], [712, 610]], stemP, pal.stem, 6);
        g.save(); g.translate(712, 590); g.scale(bud, bud);
        for (const s of [-1, 1]) { g.save(); g.rotate(-Math.PI / 2 + s * .22); U.petal(g, { len: 100, wid: 28, tip: .7, colors: [pal.deep, pal.mid, pal.light] }); g.restore(); }
        g.save(); g.rotate(-Math.PI / 2); U.petal(g, { len: 110, wid: 30, tip: .75, colors: [pal.mid, pal.light, pal.tip] }); g.restore();
        g.restore();
      }
      const cx = 500, cy = 440, R = 215;
      g.save(); g.translate(cx + U.sway(T, 1, 2), cy + U.sway(T + 1, 2, 1.2)); g.scale(1, .82);
      [{ n: 8, len: 1, wid: .27, off: 0, delay: 1.4, tilt: 0 }, { n: 8, len: .84, wid: .25, off: Math.PI / 8, delay: 2.0, tilt: .2 }, { n: 6, len: .6, wid: .22, off: .3, delay: 2.6, tilt: .4 }].forEach((ring, ri) => {
        for (let i = 0; i < ring.n; i++) {
          const o = U.open(T, ring.delay + i * .07, 1.8);
          if (o <= 0) continue;
          g.save(); g.rotate(i / ring.n * U.TAU + ring.off);
          U.petal(g, { len: R * ring.len * o, wid: R * ring.wid, tip: .55, belly: .5, curl: .1 + ring.tilt * .2, colors: [pal.deep, pal.mid, pal.light, pal.tip], veins: 3, vein: pal.vein });
          g.restore();
        }
      });
      const c = U.open(T, 3, 1.3);
      g.strokeStyle = '#e8c04a'; g.lineWidth = 2;
      for (let i = 0; i < 30; i++) { const a = i * .21, r1 = R * .15 * c, r2 = R * .27 * c; g.beginPath(); g.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); g.stroke(); g.fillStyle = '#f6dc7a'; g.beginPath(); g.arc(Math.cos(a) * r2, Math.sin(a) * r2, 3, 0, U.TAU); g.fill(); }
      U.disc(g, R * .15 * c, [pal.seed, '#98a850', '#5e7a3a']);
      g.fillStyle = '#3c4a22';
      for (let i = 0; i < 10; i++) { const a = i * U.GOLDEN, r = R * .085 * Math.sqrt(i / 10 + .1) * c; g.beginPath(); g.arc(Math.cos(a) * r * 1.4, Math.sin(a) * r * 1.4, 3, 0, U.TAU); g.fill(); }
      g.restore();
      U.motes(g, T, 18, 500, 470, 340, 280, [pal.tip, '#f8e8b0']);
    },
  });
})();
