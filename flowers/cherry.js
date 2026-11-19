(() => {
  'use strict';
  const { palette } = FlowerEngine.U;

  FlowerEngine.register({
    id: 'cherry', name: 'Cherry blossom', latin: 'Prunus', seed: 4606, art: .31, accent: '#f0a6bd',
    title: 'A week,<br>give or take.',
    copy: 'Ornamental cherries stay in full bloom for roughly a week before wind and rain take the petals. The ones falling here run on a clock of their own.',
    facts: [['Family', 'Rosaceae'], ['Petals', '5, each with a notch'], ['Falling', '40 petals, looped']],
    note: ['SHARP CONTOURS', 'Crisp edges and a dark ground raise legibility.'],
    ambient: { rose: [240, 166, 190], leaf: [150, 165, 140], light: [250, 220, 225] },
    palettes: [
      palette('Somei Yoshino', ['#c9718b', '#f6bfd0', '#fff4f6'], { base: '#d4708c', mid: '#f4b6c8', tip: '#fff3f5', eye: '#d23a5c', wood: '#3b2a26' }),
      palette('Kanzan', ['#a23a68', '#e56fa0', '#f9c4da'], { base: '#9d3563', mid: '#e0689a', tip: '#f8c3d9', eye: '#c92a62', wood: '#33231f' }),
      palette('Shirotae', ['#a69a9a', '#ece4e4', '#ffffff'], { base: '#b9a7a9', mid: '#ece3e3', tip: '#ffffff', eye: '#cf6a7a', wood: '#3a2e2a' }),
    ],
    build(random, U) {
      const main = [[-40, 1010], [260, 930], [520, 700], [960, 230]];
      const twigs = [];
      const spawn = (t, ang, len, w, start) => {
        const p = U.cubic(main, t), a = ang;
        twigs.push({ pts: [p, [p[0] + Math.cos(a) * len * .3, p[1] + Math.sin(a) * len * .3 - 20], [p[0] + Math.cos(a) * len * .7, p[1] + Math.sin(a) * len * .7 - 30], [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len - 10]], w, start });
      };
      [[.3, -.9, 230, 9], [.42, -2.1, 200, 8], [.55, -.4, 250, 8], [.62, -1.9, 230, 8], [.76, -.2, 190, 7], [.82, -1.6, 180, 6], [.9, -.8, 130, 5]].forEach((s, i) => spawn(s[0], s[1], s[2], s[3], 1.2 + i * .35));
      const blossoms = [];
      twigs.forEach((tw, ti) => {
        const n = 3 + (ti % 3);
        for (let i = 0; i < n; i++) {
          const t = .35 + i * (.65 / n);
          const p = U.cubic(tw.pts, Math.min(1, t));
          blossoms.push({ x: p[0] + (random() - .5) * 50, y: p[1] + (random() - .5) * 50, R: 36 + random() * 22, rot: random() * 6, start: 3 + ti * .5 + i * .35, bud: random() < .22 });
        }
      });
      const fall = Array.from({ length: 40 }, () => ({ x: random() * 1000, y: random() * 1100, v: 14 + random() * 26, dr: (random() - .5) * 40, sp: .5 + random() * 1.6, s: 9 + random() * 8, ph: random() * 6 }));
      return { main, twigs, blossoms, fall };
    },
    draw(g, pal, T, d, U) {
      U.stem(g, d.main, U.easeOut(U.progress(T, .2, 3.6)), pal.wood, 22);
      for (const tw of d.twigs) U.stem(g, tw.pts, U.easeOut(U.progress(T, tw.start - .6, 1.8)), pal.wood, tw.w);
      for (const b of d.blossoms) {
        const o = U.open(T, b.start, 1.3);
        if (o <= 0) continue;
        g.save(); g.translate(b.x + U.sway(T, b.x, 1.2), b.y); g.rotate(b.rot);
        if (b.bud) { U.disc(g, b.R * .35 * o, [pal.tip, pal.mid, pal.base]); g.restore(); continue; }
        for (let i = 0; i < 5; i++) {
          g.save(); g.rotate(i * U.TAU / 5);
          U.petal(g, { len: b.R * o, wid: b.R * .5, tip: 0, notch: .9, belly: .55, colors: [pal.base, pal.mid, pal.tip], vein: pal.vein, outline: 'rgba(70,20,40,.4)', lw: 1.8 });
          g.restore();
        }
        g.strokeStyle = pal.eye; g.lineWidth = 1.3; g.fillStyle = pal.eye;
        for (let i = 0; i < 14; i++) { const a = i * 1.1, l = b.R * .42 * o; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * l, Math.sin(a) * l); g.stroke(); g.beginPath(); g.arc(Math.cos(a) * l, Math.sin(a) * l, 1.9, 0, U.TAU); g.fill(); }
        g.restore();
      }
      const fadeIn = U.progress(T, 6, 2);
      for (const f of d.fall) {
        const y = (f.y + T * f.v) % 1120 - 60, x = f.x + Math.sin(T * .6 + f.ph) * 40 + T * f.dr * .3;
        g.save(); g.globalAlpha = .75 * fadeIn; g.translate(((x % 1000) + 1000) % 1000, y); g.rotate(T * f.sp + f.ph);
        U.petal(g, { len: f.s, wid: f.s * .5, tip: 0, notch: .9, colors: [pal.mid, pal.tip], outline: false });
        g.restore();
      }
      g.globalAlpha = 1;
    },
  });
})();
