(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'lavender', name: 'Lavender', latin: 'Lavandula', seed: 4303, art: .69, accent: '#a99be0',
    title: 'A field,<br>in <em>one line.</em>',
    copy: 'Lavender flowers sit in whorls up the stem, opening from the bottom. Pale sage stems carry them, and the whole thing leans a little with every breath of air.',
    facts: [['Family', 'Lamiaceae'], ['Flowers', 'whorls, bottom first'], ['Drawn with', '9 spikes, ~25 whorls each']],
    note: ['COOL HUES', 'Blue-violet ranked among the most liked flower colours.'],
    ambient: { rose: [160, 140, 225], leaf: [150, 180, 160], light: [215, 200, 235] },
    palettes: [
      palette('Provence', ['#3d2d7a', '#7f63c8', '#cdbdf0'], { deep: '#3d2d7a', mid: '#7a5fc4', light: '#b39ae6', tip: '#d9ccf5', stem: '#7f9a76' }),
      palette('Dusk', ['#2f3f86', '#6b86d6', '#c3d0f4'], { deep: '#2c3b80', mid: '#6580d0', light: '#9fb4ec', tip: '#cfdaf6', stem: '#7e9c82' }),
      palette('Heather', ['#6a2f6d', '#b36aae', '#efc9e8'], { deep: '#612c64', mid: '#a95fa4', light: '#d093ca', tip: '#f2d2ec', stem: '#8a9a72' }),
    ],
    build(random, U) {
      const spikes = [];
      for (let i = 0; i < 9; i++) {
        const k = i - 4, bx = 500 + k * 44, tx = 500 + k * 88, ty = 270 + Math.abs(k) * 52 + random() * 16;
        spikes.push({ pts: [[bx, 1030], [bx + k * 10, 800], [U.lerp(bx, tx, .8), ty + 330], [tx, ty]], start: .3 + Math.abs(k) * .22, phase: i * .9 });
      }
      return { spikes };
    },
    draw(g, pal, T, d, U) {
      d.spikes.forEach((s, si) => {
        const sw = U.sway(T, s.phase, 7);
        const pts = [s.pts[0], s.pts[1], [s.pts[2][0] + sw * .5, s.pts[2][1]], [s.pts[3][0] + sw, s.pts[3][1]]];
        U.stem(g, pts, U.easeOut(U.progress(T, s.start, 3)), pal.stem, 4.5);
        const grown = U.easeOut(U.progress(T, s.start, 3));
        if (si % 2 === 0) for (let l = 0; l < 3; l++) {
          const side = l % 2 ? 1 : -1;
          U.leaf(g, pal, pts[0][0] + side * 6, 1030 - l * 12, -Math.PI / 2 + side * (.18 + l * .08), 300 + l * 40, 9, grown, { tip: .85, light: true });
        }
        for (let w = 0; w < 25; w++) {
          const t = .52 + w * .019, o = U.open(T, s.start + 2.2 + w * .16, .9);
          if (o <= 0 || t > grown) continue;
          const p = U.cubic(pts, t), a = U.cubicAngle(pts, t), size = (11 - w * .22) * o;
          const nx = -Math.sin(a), ny = Math.cos(a);
          for (const side of [-1, 1, 0]) {
            const off = side === 0 ? 0 : side * size * .95;
            g.save(); g.translate(p[0] + nx * off, p[1] + ny * off); g.rotate(a + side * .5);
            const gr = g.createLinearGradient(-size, 0, size, 0);
            gr.addColorStop(0, pal.deep); gr.addColorStop(.55, w % 3 ? pal.mid : pal.light); gr.addColorStop(1, pal.tip);
            g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, size * 1.25, size * .6, 0, 0, U.TAU); g.fill();
            g.strokeStyle = 'rgba(20,10,40,.4)'; g.lineWidth = 1.1; g.stroke();
            g.restore();
          }
        }
      });
      U.motes(g, T, 26, 500, 520, 380, 300, [pal.tip, pal.light]);
    },
  });
})();
