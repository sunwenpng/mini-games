/*
 * 新教“小镇白教堂”的 v2 重画（只在 play2.html 加载；game.js 里原来的画法留给旧入口）。
 * 新英格兰式的白色木板教堂：山花立面、正中的方塔、百叶钟室和尖顶；红色双扇门两边是带绿百叶的高窗。
 * 门前是白色尖头栅栏，左边是食物站的长桌。
 * 设计坐标：以门槛正中为原点，y 向上为负，手机竖屏（375×690）时 1 个单位 = 1 像素。
 */
(function (B, K) {
  'use strict';
  if (!B || !K) return;
  const WHITE = '#f6f5f0', TRIM = '#ffffff', ROOF = '#55616a', SHUT = '#2f4a3a';

  function shutters(g, x, sill, w, h) {
    if (g.lit) return;
    const ctx = g.ctx;
    [-1, 1].forEach(sd => {
      const sx = x + sd * (w / 2 + 2.5) - (sd < 0 ? w * 0.42 : 0);
      ctx.fillStyle = SHUT; ctx.fillRect(sx, sill - h, w * 0.42, h);
      ctx.fillStyle = 'rgba(255,255,255,.12)'; for (let y = sill - h + 2; y < sill - 1; y += 2.4) ctx.fillRect(sx + 0.8, y, w * 0.42 - 1.6, 0.7);
      ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(sx + (sd > 0 ? w * 0.42 : -1), sill - h, 1, h);
    });
  }

  function build(g, w, h, cx, base, s) {
    const ctx = g.ctx;
    /* ---- 画面坐标里的东西：栅栏、长桌 ---- */
    if (!g.lit) {
      const fy = h * 0.79, gate = [cx - 24 * s, cx + 24 * s];
      ctx.fillStyle = 'rgba(30,40,20,.14)'; ctx.fillRect(0, fy + h * 0.024, w, 3);
      for (let x = 2; x < w; x += 11 * s) {
        if (x + 6 * s > gate[0] && x < gate[1]) continue;
        ctx.fillStyle = '#f4f4ef'; ctx.beginPath(); ctx.moveTo(x, fy + h * 0.025); ctx.lineTo(x, fy + 3 * s); ctx.lineTo(x + 3 * s, fy); ctx.lineTo(x + 6 * s, fy + 3 * s); ctx.lineTo(x + 6 * s, fy + h * 0.025); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(80,90,90,.25)'; ctx.fillRect(x + 4.6 * s, fy + 3 * s, 1.4 * s, h * 0.025 - 3 * s);
      }
      [[0, gate[0]], [gate[1], w]].forEach(r => { ctx.fillStyle = '#ecece6'; ctx.fillRect(r[0], fy + 6 * s, r[1] - r[0], 2.4 * s); ctx.fillRect(r[0], fy + h * 0.025 - 6 * s, r[1] - r[0], 2.4 * s); });
      [gate[0] - 3 * s, gate[1]].forEach(x => { ctx.fillStyle = '#ffffff'; ctx.fillRect(x, fy - 4 * s, 3 * s, h * 0.025 + 4 * s); K.circle(ctx, x + 1.5 * s, fy - 5 * s, 2.2 * s, '#ffffff'); });
      /* 食物站的长桌：红白格桌布 */
      const tx0 = w * 0.04, tx1 = w * 0.38, ty = h * 0.76;
      ctx.fillStyle = '#5a4a3a'; [tx0 + 4, tx1 - 7].forEach(x => ctx.fillRect(x, ty, 3, h * 0.034));
      ctx.fillStyle = '#f4efe6'; ctx.fillRect(tx0 - 2, ty - 2, tx1 - tx0 + 4, 10 * s);
      ctx.fillStyle = 'rgba(190,50,46,.55)';
      for (let x = tx0 - 2, i = 0; x < tx1 + 2; x += 4 * s, i++) if (i % 2) ctx.fillRect(x, ty - 2, 4 * s, 10 * s);
      ctx.fillStyle = 'rgba(190,50,46,.35)'; ctx.fillRect(tx0 - 2, ty + 1.5 * s, tx1 - tx0 + 4, 3 * s);
      ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(tx0 - 2, ty + 10 * s - 2, tx1 - tx0 + 4, 1.5);
      /* 桌上的几样东西：罐头、面包、一篮苹果 */
      const it = [['#c84a3a', 6, 8], ['#e8c46a', 10, 6], ['#3a6a9a', 6, 8], ['#c8a060', 12, 6], ['#6a9a4a', 6, 8]];
      it.forEach((o, i) => { const x = tx0 + (tx1 - tx0) * (0.1 + i * 0.19); ctx.fillStyle = o[0]; ctx.fillRect(x, ty - 2 - o[2] * s, o[1] * s, o[2] * s); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(x + 1, ty - 2 - o[2] * s, 1.2, o[2] * s); });
    }
    B.place(g, cx, base, s, () => church(g));
  }

  function church(g) {
    const ctx = g.ctx;
    B.path(g, [[-16, 0], [16, 0], [36, 200], [-36, 200]], '#cfc9bb', 61);
    B.shade(g, [[62, 0], [146, -20], [196, -12], [110, 12]], 0.14);

    /* ---- 侧墙（向右后方退去）和屋顶 ---- */
    const foot = x => -20 * (x - 62) / 84, eave = x => -118 - 4 * (x - 62) / 84;
    B.wall(g, [[62, 0], [146, -20], [146, -122], [62, -118]], WHITE, { kind: 'board', course: 4, slope: -0.13, dark: 0.16 });
    if (!g.lit) { ctx.fillStyle = '#a9a9a2'; B.poly(g, [[62, 0], [146, -20], [146, -15], [62, 6]], '#a9a9a2'); }
    [82, 106, 130].forEach((x, i) => B.win(g, x, foot(x) - 14, 10 - i, 54 - i * 4, { square: true, glass: '#394650', frame: TRIM, bars: 1, rows: 4, seed: 80 + i }));
    B.shade(g, [[62, -118], [146, -122], [146, -116], [62, -112]], 0.2);
    B.roof(g, [[0, -172], [86, -166], [148, -122], [62, -118]], ROOF, { slope: -0.07, row: 4, tile: 5, seed: 62 });
    void eave;

    /* ---- 正面：带山花的白木板墙 ---- */
    B.wall(g, [[-62, 0], [-62, -118], [0, -170], [62, -118], [62, 0]], WHITE, { kind: 'board', course: 4 });
    if (!g.lit) {
      /* 角柱、花岗岩基座 */
      ctx.fillStyle = TRIM; ctx.fillRect(-62, -118, 6, 118); ctx.fillStyle = '#e8e8e2'; ctx.fillRect(56, -118, 6, 118);
      ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(-56, -118, 1, 118);
      ctx.fillStyle = '#a9a9a2'; ctx.fillRect(-64, -6, 128, 6); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-64, -6, 128, 1);
    }
    /* 山花：上下两道檐口，中间一扇半圆扇窗 */
    B.band(g, -66, -118, 66, -118, 4, TRIM);
    B.band(g, -68, -117, 0, -174, 4, TRIM); B.band(g, 0, -174, 68, -117, 4, '#ececE6');
    B.oculus(g, 0, -138, 9, TRIM);
    /* 两边的高窗和绿百叶 */
    [-38, 38].forEach((x, i) => { shutters(g, x, -22, 15, 64); B.win(g, x, -22, 15, 64, { square: true, glass: '#394650', frame: TRIM, bars: 2, rows: 5, seed: 90 + i, sill: true }); });
    /* 门：两根小壁柱 + 小山花门头；红色双扇门，门上一排气窗 */
    if (!g.lit) {
      ctx.fillStyle = TRIM; ctx.fillRect(-23, -66, 5, 60); ctx.fillRect(18, -66, 5, 60);
      ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(-18, -66, 1, 60);
    }
    B.band(g, -26, -68, 26, -68, 4, TRIM);
    B.poly(g, [[-27, -72], [0, -84], [27, -72]], TRIM, 'rgba(60,60,60,.25)', 0.8);
    B.win(g, 0, -58, 34, 6, { square: true, glass: '#394650', frame: TRIM, bars: 3, rows: 0, sill: false, seed: 95 });
    B.door(g, 0, -6, 32, 50, { square: true, frame: TRIM, wood: '#a8302a' });
    B.steps(g, 0, -6, 50, 2, 3.2, '#b8b8b0', 6);
    B.lamp(g, -30, -50, 3); B.lamp(g, 30, -50, 3);

    /* ---- 方塔：塔身（钟面）→ 百叶钟室 → 八角尖顶 ---- */
    B.wall(g, [[-20, -150], [20, -150], [20, -230], [-20, -230]], WHITE, { kind: 'board', course: 4 });
    B.wall(g, [[20, -150], [27, -152], [27, -232], [20, -230]], WHITE, { kind: 'board', course: 4, slope: -0.28, dark: 0.2 });
    if (!g.lit) {
      ctx.fillStyle = TRIM; ctx.fillRect(-20, -230, 4, 80); ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(16, -230, 4, 80);
      /* 钟面 */
      K.circle(ctx, 0, -200, 10.5, '#2f3a3e'); K.circle(ctx, 0, -200, 9, '#f8f6ee');
      ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 0.8;
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 7.5, -200 + Math.sin(a) * 7.5); ctx.lineTo(Math.cos(a) * 8.6, -200 + Math.sin(a) * 8.6); ctx.stroke(); }
      ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, -206); ctx.moveTo(0, -200); ctx.lineTo(4, -198); ctx.stroke();
    }
    B.band(g, -23, -230, 23, -230, 4, TRIM); B.band(g, 23, -230, 29, -232, 4, '#e2e2dc');
    /* 钟室：四角立柱，中间一个拱形百叶洞口 */
    B.wall(g, [[-17, -234], [17, -234], [17, -268], [-17, -268]], WHITE, { kind: 'plaster', edge: false });
    B.wall(g, [[17, -234], [23, -236], [23, -270], [17, -268]], WHITE, { kind: 'plaster', dark: 0.22, edge: false });
    B.opening(g, 0, -238, 18, 26, TRIM);
    if (!g.lit) {
      ctx.fillStyle = 'rgba(240,240,232,.75)'; for (let y = -258; y < -239; y += 3) ctx.fillRect(-8, y, 16, 1.2);
      ctx.fillStyle = TRIM; ctx.fillRect(-17, -268, 3.5, 34); ctx.fillRect(13.5, -268, 3.5, 34);
      /* 栏杆和四角的小尖 */
      ctx.fillStyle = TRIM; ctx.fillRect(-20, -274, 40, 2); ctx.fillRect(-20, -270, 40, 2.2);
      for (let x = -18; x <= 16; x += 4) ctx.fillRect(x, -274, 1.2, 4);
      [-19, 18].forEach(x => { ctx.fillRect(x - 1, -280, 3, 8); B.poly(g, [[x - 1.5, -280], [x + 0.5, -287], [x + 2.5, -280]], TRIM); });
    }
    B.band(g, -19, -268, 19, -268, 3, TRIM);
    /* 尖顶：八角形，两个面一明一暗 */
    B.roof(g, [[-14, -274], [0, -350], [3, -274]], ROOF, { row: 3, tile: 4, seed: 63 });
    B.roof(g, [[3, -274], [0, -350], [16, -275]], ROOF, { row: 3, tile: 4, seed: 64, dark: 0.32 });
    if (!g.lit) { ctx.fillStyle = '#c8a64a'; K.circle(ctx, 0, -351, 2, '#c8a64a'); }
    B.cross(g, 0, -352, 14, '#c8a64a', 'latin');

    B.bush(g, -72, 4, 10, '#56784a', 65);
    B.bush(g, 72, 0, 9, '#50724a', 66);
    B.flowers(g, -60, -30, 3, ['#e05a6a', '#f6f2ea', '#f2d24a'], 67);
    B.flowers(g, 30, 60, 3, ['#e05a6a', '#f6f2ea', '#7a6ad0'], 68);
  }

  CourtyardScene2['christianity.protestant'] = {
    back(ctx, w, h, m, K2, t) {
      const hy = h * 0.5, winter = m.season === 'winter';
      K.hills(ctx, w, hy, '#86a06e', h * 0.05, 61);
      K.ground(ctx, w, h, hy, winter ? '#eef0ee' : '#8fae66', winter ? '#dfe3df' : '#7c9a58');
      const s = B.unit(w, h), cx = w * 0.55, base = h * 0.76;
      K.tree(ctx, w * 0.93, h * 0.74, h * 0.16, 'maple', m, t);
      const e = B.layers(ctx, 'christianity.protestant', w, h, m, g => build(g, w, h, cx, base, s));
      B.blit(ctx, e, w, h);
      K.hit('hall', 'door', cx, base - 32 * s, Math.max(30, 36 * s));
      K.tree(ctx, w * 0.12, h * 0.72, h * 0.18, 'maple', m, t);
    },
    lights(ctx, w, h, m, K2, t) {
      B.glow(ctx, B.get('christianity.protestant'), w, h, m, t);
    },
  };
})(typeof Build2 !== 'undefined' ? Build2 : null, typeof CourtyardKit !== 'undefined' ? CourtyardKit : null);
