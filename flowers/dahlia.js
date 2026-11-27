(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'dahlia', name: 'Dahlias', latin: 'Dahlia', seed: 5010, art: .31, accent: '#f08a4b',
    title: 'Geometry<br>with <em>manners.</em>',
    copy: 'Dahlias are native to Mexico, which made one its national flower. Breeders have produced thousands of cultivars, and the formal types are almost mechanical in their order.',
    facts: [['Family', 'Asteraceae'], ['Origin', 'Mexico'], ['Drawn with', '9 rings of petals']],
    note: ['ORDERED LAYERS', 'Concentric rings add complexity without losing the pattern.'],
    ambient: { rose: [238, 110, 120], leaf: [140, 170, 125], light: [245, 190, 110] },
    palettes: [
      palette('Sunset', ['#8c1f4a', '#ee6a3a', '#ffd070'], { deep: '#7e1a45', mid: '#e0502f', light: '#f59a3e', tip: '#ffd77a' }),
      palette('Burgundy', ['#3d0c1d', '#8f1d3a', '#e07a8a'], { deep: '#2f0818', mid: '#7e1832', light: '#b8344f', tip: '#ee9aa6' }),
      palette('Blush', ['#a8546a', '#f0a8b8', '#fff0e8'], { deep: '#a04f66', mid: '#eca0b2', light: '#f7ccd2', tip: '#fff1ea' }),
    ],
    build(random, U) {
      const heads = [{ x: 500, y: 365, R: 190, start: 1.4, rot: .05 }, { x: 288, y: 560, R: 124, start: 3.0, rot: .2 }, { x: 714, y: 545, R: 128, start: 3.5, rot: -.1 }];
      const bases = [500, 370, 630];
      const stems = heads.map((h, i) => ({ pts: [[bases[i], 1030], [bases[i], 840], [U.lerp(bases[i], h.x, .8), h.y + h.R + 90], [h.x, h.y + h.R * .3]], start: .2 + i * .3 }));
      const leaves = [];
      stems.forEach((s, si) => { for (let i = 0; i < 3; i++) leaves.push({ pts: s.pts, t: .26 + i * .2, side: (i + si) % 2 ? 1 : -1, size: 90 + random() * 30, start: 1 + si * .3 + i * .4 }); });
      const pompons = [{ x: 405, y: 705, R: 52, start: 4.6 }, { x: 600, y: 700, R: 50, start: 5.0 }];
      return { heads, stems, leaves, pompons };
    },
    draw(g, pal, T, d, U) {
      for (const s of d.stems) U.stem(g, s.pts, U.easeOut(U.progress(T, s.start, 3)), pal.stem, 7);
      for (const l of d.leaves) {
        const a = U.cubic(l.pts, l.t), ang = U.cubicAngle(l.pts, l.t) + l.side * U.rad(55);
        U.leaf(g, pal, a[0], a[1], ang, l.size, l.size * .4, U.open(T, l.start, 1), { tip: .55, light: l.side > 0 });
      }
      for (const p of d.pompons) {
        const o = U.open(T, p.start, 1.6);
        if (o <= 0) continue;
        g.strokeStyle = pal.stem; g.lineWidth = 4; g.beginPath(); g.moveTo(p.x, 1030); g.quadraticCurveTo(p.x + 14, 880, p.x, p.y + p.R); g.stroke();
        g.save(); g.translate(p.x, p.y);
        for (let i = 70; i >= 0; i--) {
          const r = p.R * Math.sqrt(i / 70) * o, a = i * U.GOLDEN, t = i / 70;
          g.fillStyle = t > .6 ? pal.mid : t > .25 ? pal.light : pal.tip;
          g.strokeStyle = 'rgba(30,8,15,.4)'; g.lineWidth = 1.2;
          g.beginPath(); g.arc(Math.cos(a) * r * .8, Math.sin(a) * r * .8, p.R * (.2 - t * .06) * o, 0, U.TAU); g.fill(); g.stroke();
        }
        g.restore();
      }
      d.heads.forEach((h, idx) => {
        if (U.open(T, h.start, 1.5) <= 0) return;
        g.save(); g.translate(h.x + U.sway(T, idx * 2, 2.2), h.y + U.sway(T + 1, idx, 1.6)); g.rotate(h.rot);
        const rings = [[16, .0, .86, .17], [16, .12, .78, .16], [14, .2, .68, .15], [14, .28, .58, .14], [12, .35, .48, .13], [12, .4, .4, .12], [10, .42, .31, .11], [8, .43, .22, .1], [6, .44, .15, .09]];
        rings.forEach(([n, base, len, wid], ri) => {
          const shade = ri / (rings.length - 1);
          for (let i = 0; i < n; i++) {
            const o = U.open(T, h.start + ri * .24 + i * .015, 1.3);
            if (o <= 0) continue;
            const a = i / n * U.TAU + (ri % 2) * Math.PI / n;
            g.save(); g.rotate(a); g.translate(base * h.R * o, 0);
            U.petal(g, { len: len * h.R * o, wid: wid * h.R * (.4 + .6 * o), tip: .62, belly: .5, curl: .08, colors: [pal.deep, shade < .5 ? pal.mid : pal.light, shade < .6 ? pal.light : pal.tip], veins: 1, vein: pal.vein, outline: 'rgba(30,6,16,.5)', lw: 1.8 });
            g.restore();
          }
        });
        g.restore();
      });
      U.motes(g, T, 20, 500, 470, 340, 290, [pal.tip, '#f1d5ac']);
    },
  });
})();
