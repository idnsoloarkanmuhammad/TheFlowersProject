(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'hydrangea', name: 'Hydrangeas', latin: 'Hydrangea macrophylla', seed: 4707, art: .69, accent: '#8ea8e8',
    title: 'The colour<br>is in the <em>soil.</em>',
    copy: 'What look like petals are sepals. In acidic soil the plant takes up aluminium and the blooms turn blue; in neutral to alkaline soil they stay pink. Here the palette button plays the soil.',
    facts: [['Family', 'Hydrangeaceae'], ['Sepals', '4 per floret'], ['Drawn with', '~160 florets in the large head']],
    note: ['ANALOGOUS COLOUR', 'Neighbouring hues, not a single flat colour.'],
    ambient: { rose: [130, 160, 230], leaf: [140, 175, 140], light: [200, 190, 240] },
    palettes: [
      palette('Acidic', ['#2f4ba0', '#6f95e6', '#c6d8fb'], { sets: [['#2a3f93', '#5f86e0', '#bcd0fa'], ['#3a3f9c', '#7a82e0', '#cfd0fa'], ['#2f5aa6', '#74a4e8', '#d2e4fb']], eye: '#f4f0b0' }),
      palette('Neutral', ['#a23f79', '#ea8fc0', '#fbd5e8'], { sets: [['#9a3a72', '#e17db5', '#f9cfe4'], ['#b0467f', '#ef9acb', '#fddbec'], ['#8d3a78', '#d37fc4', '#f4c9ea']], eye: '#f4f0b0' }),
      palette('Between', ['#5a4ba8', '#a58ee0', '#e6dcfa'], { sets: [['#524498', '#9a82da', '#e0d3f8'], ['#6a4fa8', '#b08fe0', '#eadcf8'], ['#4a58a8', '#8a9ae0', '#d8e0fa']], eye: '#f4f0b0' }),
    ],
    build(random, U) {
      const heads = [{ x: 500, y: 395, R: 215, start: 1.5 }, { x: 270, y: 640, R: 130, start: 3.4 }, { x: 735, y: 615, R: 138, start: 3.9 }].map((h) => {
        const n = Math.round(h.R * .75), fl = [];
        for (let i = 0; i < n; i++) {
          const r = Math.sqrt((i + .5) / n), a = i * U.GOLDEN;
          fl.push({ nx: Math.cos(a) * r, ny: Math.sin(a) * r * .92, r, rot: random() * 6, set: Math.floor(random() * 3), jitter: random() });
        }
        fl.sort((p, q) => p.ny - q.ny);
        return { ...h, fl };
      });
      const leaves = [[290, 850, -.5], [420, 880, -.9], [600, 880, -2.2], [730, 850, -2.6], [150, 770, -.2], [860, 760, -2.9], [500, 930, -1.57]].map(([x, y, a], i) => ({ x, y, a, size: 190 + (i % 3) * 20, start: .5 + i * .25 }));
      return { heads, leaves };
    },
    draw(g, pal, T, d, U) {
      for (const l of d.leaves) U.leaf(g, pal, l.x, l.y, l.a + U.sway(T, l.x, .02), l.size, l.size * .46, U.open(T, l.start, 1.6), { tip: .5, belly: .5, light: l.x > 500 });
      d.heads.forEach((h, idx) => {
        const o = U.open(T, h.start, 3.2);
        if (o <= 0) return;
        g.save(); g.translate(h.x + U.sway(T, idx * 2, 2), h.y + U.sway(T + 1, idx, 1.5));
        U.disc(g, h.R * .82 * o, ['rgba(20,30,60,.6)', 'rgba(10,16,34,.5)', 'rgba(0,0,0,0)']);
        for (const f of h.fl) {
          const fo = U.open(T, h.start + (1 - f.r) * 1.1 + f.jitter * .5, 1.2);
          if (fo <= 0) continue;
          const z = Math.sqrt(Math.max(0, 1 - f.r * f.r)), size = h.R * (.19 - .06 * f.r) * fo;
          g.save(); g.translate(f.nx * h.R * .86 * o, f.ny * h.R * .86 * o); g.rotate(f.rot);
          g.globalAlpha = .55 + .45 * z;
          for (let k = 0; k < 4; k++) { g.save(); g.rotate(k * Math.PI / 2); U.petal(g, { len: size, wid: size * .5, tip: .05, belly: .55, colors: pal.sets[f.set], flat: true, outline: 'rgba(15,20,50,.45)', lw: 1.5 }); g.restore(); }
          g.fillStyle = pal.eye; g.beginPath(); g.arc(0, 0, size * .13, 0, U.TAU); g.fill();
          g.restore();
        }
        g.restore();
      });
      U.motes(g, T, 18, 500, 500, 350, 300, ['#dbe6ff', '#cfd2ff']);
    },
  });
})();
