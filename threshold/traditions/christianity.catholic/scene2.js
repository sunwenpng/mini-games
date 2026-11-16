/*
 * 天主教“山谷小教堂”的 v2 重画（只在 play2.html 加载；game.js 里原来的画法留给旧入口）。
 * 意大利乡间的罗马式石砌教堂：山墙立面、伦巴第拱带、玫瑰窗、层层退进的拱门，侧面是赤陶瓦的中殿，
 * 后面立着方形钟楼。点门直接进堂；点钟楼的钟是三钟经。
 * 设计坐标：以门槛正中为原点，y 向上为负，手机竖屏（375×690）时 1 个单位 = 1 像素。
 */
(function (B, K) {
  'use strict';
  if (!B || !K) return;
  const STONE = '#dcc9a3', STONE2 = '#cdb68c', TRIM = '#efe3c6', ROOF = '#b5643a';

  function build(g) {
    const ctx = g.ctx;
    /* 门前的石子路，一直通到画面下方 */
    B.path(g, [[-22, 0], [22, 0], [74, 200], [-74, 200]], '#cdbf9e', 21);
    /* 建筑投在地上的影子（光从左上来） */
    B.shade(g, [[68, 0], [142, -16], [196, -8], [120, 12]], 0.14);

    /* ---- 钟楼（先画，中殿挡住它的下半截） ---- */
    B.wall(g, [[96, -20], [134, -20], [134, -300], [96, -300]], STONE2, { seed: 31, course: 6 });
    B.wall(g, [[134, -20], [142, -22], [142, -298], [134, -300]], STONE2, { seed: 32, course: 6, slope: -0.25, dark: 0.3 });
    [[-150, 4, 14], [-200, 4, 14]].forEach(o => B.win(g, 115, o[0], o[1], o[2], { glass: '#2a2a32', frame: TRIM, bars: 0, rows: 0, sill: false }));
    B.band(g, 94, -250, 136, -250, 3, TRIM); B.band(g, 136, -250, 144, -251, 3, B.tone(TRIM, -0.2));
    B.opening(g, 115, -256, 20, 34, TRIM);
    B.band(g, 94, -296, 136, -296, 4, TRIM); B.band(g, 136, -296, 144, -297, 4, B.tone(TRIM, -0.2));
    B.arcade(g, 98, -292, 132, -292, 2.6, B.tone(STONE2, -0.1), 2);
    B.roof(g, [[91, -300], [115, -342], [139, -300]], ROOF, { row: 4, tile: 5, seed: 33 });
    B.roof(g, [[139, -300], [115, -342], [147, -298]], ROOF, { row: 4, tile: 5, seed: 34, dark: 0.3 });
    B.cross(g, 115, -341, 18, '#6c5a48', 'latin');

    /* ---- 中殿侧墙（向右后方退去）：扶壁和拱窗 ---- */
    const sideY = x => -16 * (x - 68) / 72;           /* 侧墙墙脚的高度 */
    const topY = x => -150 + 2 * (x - 68) / 72;       /* 侧墙檐口 */
    B.wall(g, [[68, 0], [140, -16], [140, -148], [68, -150]], STONE, { seed: 35, slope: -0.12, dark: 0.2 });
    [80, 103, 126].forEach((x, i) => B.win(g, x, sideY(x) - 60 + i * 2, 7 - i * 0.6, 30 - i * 2, { glass: '#3b4a5c', frame: B.tone(TRIM, -0.15), bars: 0, rows: 1, seed: 40 + i, stain: ['#b8423c', '#2e5aa8', '#d9a83a'] }));
    if (!g.lit) [91, 114, 137].forEach((x, i) => {
      const b = sideY(x), t = topY(x) + 18, bw = 5 - i;
      ctx.fillStyle = B.tone(STONE, -0.05); ctx.fillRect(x - bw, t, bw, b - t);
      ctx.fillStyle = 'rgba(30,20,40,.25)'; ctx.fillRect(x, t + 2, bw * 0.7, b - t - 2);
      B.poly(g, [[x - bw, t], [x, t - 8], [x + bw * 0.7, t - 6], [x + bw * 0.7, t + 2], [x, t + 2]], B.tone(STONE, 0.05));
    });
    B.shade(g, [[68, -150], [140, -148], [140, -141], [68, -142]], 0.26);
    /* 侧面的瓦顶 */
    B.roof(g, [[0, -236], [74, -226], [142, -148], [68, -150]], ROOF, { slope: -0.06, row: 5, tile: 6, seed: 36 });

    /* ---- 正立面：山墙 ---- */
    B.wall(g, [[-68, 0], [-68, -150], [0, -234], [68, -150], [68, 0]], STONE, { seed: 37, course: 7 });
    if (!g.lit) {
      /* 两边的壁柱 + 墙脚的基座 */
      [[-68, 1], [61, -1]].forEach(p => { ctx.fillStyle = B.tone(STONE, p[1] > 0 ? 0.12 : -0.06); ctx.fillRect(p[0], -150, 7, 150); });
      ctx.fillStyle = B.tone(STONE, -0.18); ctx.fillRect(-70, -8, 140, 8);
      ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-70, -8, 140, 1);
    }
    /* 山墙的檐口和下面的小盲拱 */
    B.band(g, -74, -149, 0, -240, 5, TRIM); B.band(g, 0, -240, 74, -149, 5, B.tone(TRIM, -0.06));
    B.arcade(g, -62, -148, -4, -220, 3.2, B.tone(STONE, -0.12), 2.5);
    B.arcade(g, 4, -220, 62, -148, 3.2, B.tone(STONE, -0.12), 2.5);
    /* 腰线 + 一排小盲拱 */
    B.band(g, -68, -122, 68, -122, 3, TRIM);
    B.arcade(g, -60, -119, 60, -119, 3.4, B.tone(STONE, -0.12), 3);
    /* 玫瑰窗 */
    B.rose(g, 0, -170, 22, { n: 12, frame: TRIM });
    /* 两扇细长的拱窗 */
    [-45, 45].forEach((x, i) => B.win(g, x, -48, 9, 38, { glass: '#3b4a5c', frame: TRIM, bars: 0, rows: 1, seed: 50 + i, stain: ['#b8423c', '#2e5aa8', '#d9a83a', '#3f8a5a'] }));
    /* 门：三层退进的拱券，门楣半圆里留一块浮雕的底色 */
    B.door(g, 0, -10, 32, 64, { orders: 3, step: 5, frame: B.tone(STONE, 0.05), wood: '#5b3a24', tymp: '#d6c398' });
    if (!g.lit) {
      /* 门楣上画一个淡淡的圣像轮廓：光环 + 身形 */
      K.circle(ctx, 0, -64, 4.6, '#e6c35c'); K.circle(ctx, 0, -64, 3, '#c9a77c');
      B.poly(g, [[-5, -59], [5, -59], [7, -53], [-7, -53]], '#a98a62');
    }
    B.steps(g, 0, -10, 54, 3, 3.4, '#d3c6a8', 5);
    B.cross(g, 0, -239, 24, '#6c5a48', 'latin');

    /* ---- 门边的许愿烛架、花和灌木 ---- */
    if (!g.lit) {
      ctx.fillStyle = '#2d2622'; ctx.fillRect(-53.5, -24, 2, 24); ctx.fillRect(-60, -24, 15, 2); ctx.fillRect(-58, -1, 11, 1.5);
      ['#f4eee0', '#f4eee0', '#f4eee0'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-58.5 + i * 4.5, -29, 2, 5); });
    }
    B.flowers(g, -66, -36, 3, ['#e05a6a', '#f2d24a', '#f6f2ea', '#9a6ad0'], 23);
    B.flowers(g, 34, 66, 3, ['#e05a6a', '#f2d24a', '#f6f2ea'], 24);
    B.bush(g, -86, 6, 12, '#5f7f48', 25);
    B.bush(g, 82, 2, 9, '#58784a', 26);
  }

  CourtyardScene2['christianity.catholic'] = {
    /* 底栏原来的“进堂”其实是“蘸圣水、画十字、跪一下”的礼仪；进堂改由点门进入 */
    msg: {
      'zh-CN': { 'prac.enter.bar': '圣水', 'prac.enter.title': '进门的礼仪：圣水与画十字' },
      en: { 'prac.enter.bar': 'Holy water', 'prac.enter.title': 'At the door: holy water and the sign of the cross' },
    },
    back(ctx, w, h, m, K2, t) {
      const hy = h * 0.5, winter = m.season === 'winter';
      K.hills(ctx, w, hy, '#8aa070', h * 0.08, 41);
      K.ground(ctx, w, h, hy, winter ? '#dcdcd4' : '#9aab72', winter ? '#cbcbc2' : '#869862');
      const s = B.unit(w, h), cx = w * 0.36, base = h * 0.74;
      K.tree(ctx, w * 0.95, h * 0.72, h * 0.2, 'cypress', m, t);
      const e = B.layers(ctx, 'christianity.catholic', w, h, m, g => B.place(g, cx, base, s, () => build(g)));
      B.blit(ctx, e, w, h);
      /* 钟：正午敲三钟经时摆动 */
      const bx = cx + 115 * s, by = base - 284 * s;
      const sw = m.hour >= 12 && m.hour < 12.1 && !m.reduceMotion ? Math.sin(t * 4) * 0.45 : 0;
      ctx.save(); ctx.translate(bx, by - 6 * s); ctx.rotate(sw); ctx.scale(s, s);
      ctx.fillStyle = '#3a2e26'; ctx.fillRect(-0.8, 0, 1.6, 3);
      ctx.fillStyle = '#b8862b'; ctx.beginPath(); ctx.moveTo(-6.5, 13); ctx.quadraticCurveTo(-6, 3, 0, 2.5); ctx.quadraticCurveTo(6, 3, 6.5, 13); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e2b850'; ctx.fillRect(-4.5, 4, 1.4, 7);
      ctx.fillStyle = '#8a6420'; ctx.fillRect(-7, 12.4, 14, 1.8);
      ctx.restore();
      K.hit('hall', 'door', cx, base - 40 * s, Math.max(30, 40 * s));
      K.hit('spot', 'angelus', bx, by, Math.max(24, 22 * s));
      K.tree(ctx, w * 0.08, h * 0.76, h * 0.14, 'olive', m, t);
    },
    lights(ctx, w, h, m, K2, t) {
      B.glow(ctx, B.get('christianity.catholic'), w, h, m, t);
      const s = B.unit(w, h), cx = w * 0.36, base = h * 0.74;
      if (m.offered.indexOf('votive') >= 0) [-56.5, -52, -47.5].forEach((x, i) => K.flame(ctx, cx + (x + 0.5) * s, base - (29 + (i % 2)) * s, 2.6 * s, t + i));
    },
  };
})(typeof Build2 !== 'undefined' ? Build2 : null, typeof CourtyardKit !== 'undefined' ? CourtyardKit : null);
