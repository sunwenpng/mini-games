/*
 * 东正教“白桦林边的小教堂”的 v2 重画（只在 play2.html 加载；game.js 里原来的画法留给旧入口）。
 * 俄罗斯式十字形平面的白色教堂：立面顶上三道半圆的“扎科马拉”山墙，正中鼓座上一个金色洋葱顶，
 * 四角是蓝底金星的小洋葱顶；前面是带拱顶的门廊，门上方挂一幅圣像和一盏小油灯。右边是木钟架。
 * 设计坐标：以门槛正中为原点，y 向上为负，手机竖屏（375×690）时 1 个单位 = 1 像素。
 */
(function (B, K) {
  'use strict';
  if (!B || !K) return;
  const WHITE = '#f3efe6', TRIM = '#fbf8f1', METAL = '#4f6f8e', GOLD = '#d9a93a', BLUE = '#2f5f9a';

  /* 圣像：金框、深蓝底、圣母的红色头巾和光环（只画轮廓，不画五官） */
  function icon(g, x, y, w, h) {
    if (g.lit) return;
    const ctx = g.ctx;
    ctx.fillStyle = '#8a6a2a'; ctx.fillRect(x - w / 2 - 1.5, y - h / 2 - 1.5, w + 3, h + 3);
    ctx.fillStyle = '#e2c066'; ctx.fillRect(x - w / 2 - 0.8, y - h / 2 - 0.8, w + 1.6, h + 1.6);
    ctx.fillStyle = '#d9b456'; ctx.fillRect(x - w / 2, y - h / 2, w, h);
    K.circle(ctx, x, y - h * 0.18, w * 0.26, '#f0d27a');
    ctx.fillStyle = '#8a2a26'; ctx.beginPath(); ctx.moveTo(x - w * 0.36, y + h / 2); ctx.quadraticCurveTo(x - w * 0.34, y - h * 0.2, x, y - h * 0.3); ctx.quadraticCurveTo(x + w * 0.34, y - h * 0.2, x + w * 0.36, y + h / 2); ctx.closePath(); ctx.fill();
    K.circle(ctx, x, y - h * 0.16, w * 0.12, '#c99a72');
    ctx.fillStyle = '#2a4a7a'; ctx.fillRect(x - w * 0.12, y + h * 0.08, w * 0.24, h * 0.42);
  }

  function build(g) {
    const ctx = g.ctx;
    B.path(g, [[-18, 0], [18, 0], [60, 200], [-60, 200]], '#d4cbb5', 51);
    B.shade(g, [[80, 0], [118, -12], [170, -4], [120, 12]], 0.13);

    /* ---- 中央鼓座 + 金顶（先画，主体挡住鼓座下段） ---- */
    B.wall(g, [[-24, -142], [24, -142], [24, -206], [-24, -206]], WHITE, { kind: 'plaster', seed: 52 });
    B.round(g, -24, -206, 48, 64, 0.2);
    [-14, 0, 14].forEach((x, i) => B.win(g, x, -160, 6, 24, { glass: '#3a4658', frame: TRIM, bars: 0, rows: 0, sill: false, seed: 60 + i }));
    B.band(g, -26, -206, 26, -206, 4, TRIM);
    B.arcade(g, -22, -202, 22, -202, 2.6, '#d8d2c4', 2);
    B.onion(g, 0, -208, 30, GOLD, { pat: 'ribs', crossSize: 1.1, cross: '#e8c860' });
    /* ---- 四角的小鼓座 + 蓝底金星的小洋葱 ---- */
    [-62, 62].forEach((x, i) => {
      B.wall(g, [[x - 10, -126], [x + 10, -126], [x + 10, -164], [x - 10, -164]], WHITE, { kind: 'plaster', seed: 53 + i });
      B.round(g, x - 10, -164, 20, 38, 0.2);
      B.win(g, x, -140, 4, 14, { glass: '#3a4658', frame: TRIM, bars: 0, rows: 0, sill: false });
      B.band(g, x - 11, -164, x + 11, -164, 2.5, TRIM);
      B.onion(g, x, -166, 13, BLUE, { pat: 'stars', seed: 70 + i, crossSize: 1.3 });
    });

    /* ---- 侧面（向右后方退去） ---- */
    B.wall(g, [[80, 0], [118, -12], [118, -126], [80, -128]], WHITE, { kind: 'plaster', seed: 54, dark: 0.18 });
    B.win(g, 99, -46, 8, 30, { glass: '#3a4658', frame: TRIM, bars: 0, rows: 1, seed: 66 });
    B.poly(g, [[80, -128], [118, -126], [118, -131], [80, -134]], B.tone(METAL, -0.2));

    /* ---- 主体正面：三道扎科马拉 ---- */
    const top = [[-80, 0], [-80, -128]]
      .concat(B.arc(-53, -128, 27, Math.PI, Math.PI * 2, 12)).concat(B.arc(0, -128, 26, Math.PI, Math.PI * 2, 12)).concat(B.arc(53, -128, 27, Math.PI, Math.PI * 2, 12))
      .concat([[80, -128], [80, 0]]);
    B.wall(g, top, WHITE, { kind: 'plaster', seed: 55 });
    if (!g.lit) {
      /* 扎科马拉上的铁皮屋面 */
      ctx.save(); ctx.lineCap = 'round';
      [[-53, 27], [0, 26], [53, 27]].forEach(a => {
        ctx.strokeStyle = g.snow ? '#eef2f6' : METAL; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(a[0], -128, a[1] + 2.5, Math.PI, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(a[0], -128, a[1] + 4.5, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
      });
      ctx.restore();
      /* 每个半圆里的小圆窗 */
      [[-53], [0], [53]].forEach(a => B.oculus(g, a[0], -138, 5, TRIM));
      /* 壁柱 */
      [-80, -27, 26, 76].forEach((x, i) => { ctx.fillStyle = i < 2 ? 'rgba(255,255,255,.55)' : 'rgba(150,140,130,.18)'; ctx.fillRect(x, -128, 4, 128); });
      ctx.fillStyle = '#cfc8ba'; ctx.fillRect(-82, -8, 164, 8);
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-82, -8, 164, 1);
    } else [[-53], [0], [53]].forEach(a => B.oculus(g, a[0], -138, 5, TRIM));
    B.band(g, -82, -128, 82, -128, 3, TRIM);
    /* 两侧开间的窗：下面长窗，上面短窗，带白色窗套 */
    [-53, 53].forEach((x, i) => {
      B.win(g, x, -36, 11, 40, { glass: '#3a4658', frame: TRIM, bars: 0, rows: 1, seed: 62 + i, warm: '#ffe2a0' });
      B.win(g, x, -96, 9, 20, { glass: '#3a4658', frame: TRIM, bars: 0, rows: 0, seed: 64 + i });
      if (!g.lit) B.poly(g, [[x - 9, -78], [x, -86], [x + 9, -78]], 'rgba(150,140,130,.25)');
    });

    /* ---- 门廊 ---- */
    const porch = [[-36, 0], [-36, -78]].concat(B.arc(0, -78, 36, Math.PI, Math.PI * 2, 18)).concat([[36, -78], [36, 0]]);
    B.shade(g, [[36, 0], [44, -2], [44, -80], [36, -78]], 0.2);
    B.wall(g, porch, WHITE, { kind: 'plaster', seed: 56 });
    if (!g.lit) {
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = g.snow ? '#eef2f6' : METAL; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, -78, 38.5, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore();
      [-36, 32].forEach((x, i) => { ctx.fillStyle = i ? 'rgba(150,140,130,.2)' : 'rgba(255,255,255,.6)'; ctx.fillRect(x, -78, 4, 78); });
    }
    B.cross(g, 0, -116, 16, '#d9b456', 'orthodox');
    icon(g, 0, -91, 15, 18);
    /* 圣像下的小油灯 */
    if (g.lit) { K.circle(ctx, 0, -77, 1.6, '#ffb070'); B.glowAt(g, 0, -77, 12); }
    else { ctx.fillStyle = '#9a2a22'; ctx.beginPath(); ctx.arc(0, -77, 2, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#5a4a2a'; ctx.fillRect(-0.3, -82, 0.6, 5); }
    B.door(g, 0, -8, 28, 52, { orders: 2, step: 4, frame: '#ece5d6', wood: '#6e2a22' });
    B.steps(g, 0, -8, 46, 2, 4, '#d8d2c6', 5);

    /* ---- 门边的沙盘蜡烛台 ---- */
    if (!g.lit) {
      ctx.fillStyle = '#6a5034'; ctx.fillRect(-60, -22, 18, 4); ctx.fillRect(-58, -18, 2, 18); ctx.fillRect(-46, -18, 2, 18);
      ctx.fillStyle = '#d8c48a'; ctx.fillRect(-59, -23, 16, 1.5);
      [-56, -53, -50, -47].forEach((x, i) => { ctx.fillStyle = '#e8c86a'; ctx.fillRect(x, -30 + (i % 2) * 2, 1.2, 7 - (i % 2) * 2); });
    }
    /* ---- 右边的木钟架 ---- */
    if (!g.lit) {
      ctx.fillStyle = '#6a4a30'; ctx.fillRect(124, -84, 4, 88); ctx.fillRect(156, -84, 4, 88); ctx.fillRect(122, -84, 40, 4); ctx.fillRect(122, -60, 40, 2);
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(127, -84, 1, 88); ctx.fillRect(159, -84, 1, 88);
      [[132, 4], [142, 6.5], [152, 4.6]].forEach(b => {
        ctx.fillStyle = '#3a2a1a'; ctx.fillRect(b[0] - 0.4, -80, 0.8, 4);
        ctx.fillStyle = '#b8862b'; ctx.beginPath(); ctx.moveTo(b[0] - b[1], -76 + b[1] * 1.7); ctx.quadraticCurveTo(b[0] - b[1] * 0.9, -76, b[0], -76); ctx.quadraticCurveTo(b[0] + b[1] * 0.9, -76, b[0] + b[1], -76 + b[1] * 1.7); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,230,150,.45)'; ctx.fillRect(b[0] - b[1] * 0.55, -75, b[1] * 0.3, b[1] * 1.3);
      });
    }
    B.roof(g, [[118, -84], [142, -100], [166, -84]], METAL, { row: 3, tile: 4, seed: 57 });
    B.cross(g, 142, -100, 12, '#d9b456', 'orthodox');
    B.flowers(g, -76, -42, 3, ['#f2d24a', '#f6f2ea', '#c84a6a'], 58);
    B.flowers(g, 42, 76, 3, ['#f2d24a', '#f6f2ea', '#8a6ad0'], 59);
    B.bush(g, -90, 6, 10, '#5d7f4a', 60);
  }

  /* 白桦：白树干上的黑斑，枝叶是一团团的浅绿（秋天金黄，冬天只剩枝条） */
  function birch(ctx, x, y, s, m, t) {
    const sway = m.reduceMotion ? 0 : Math.sin((t || 0) * 1.1 + x * 0.02) * s * 0.02;
    K.shadow(ctx, x + s * 0.1, y, s * 0.3, s * 0.06, 0.18);
    ctx.fillStyle = '#f1efe8'; ctx.beginPath(); ctx.moveTo(x - s * 0.035, y); ctx.lineTo(x - s * 0.02 + sway, y - s * 1.05); ctx.lineTo(x + s * 0.02 + sway, y - s * 1.05); ctx.lineTo(x + s * 0.035, y); ctx.fill();
    ctx.fillStyle = 'rgba(80,80,80,.18)'; ctx.fillRect(x + s * 0.012, y - s * 1.0, s * 0.02, s);
    const r = K.rng(Math.round(x));
    ctx.fillStyle = '#2a2a2a'; for (let k = 0; k < 9; k++) ctx.fillRect(x - s * 0.03 + r() * s * 0.02, y - s * (0.08 + k * 0.1 + r() * 0.04), s * (0.02 + r() * 0.03), Math.max(1, s * 0.012));
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = Math.max(0.6, s * 0.012);
    for (let k = 0; k < 5; k++) { const yy = y - s * (0.55 + k * 0.1), d = (k % 2 ? 1 : -1) * s * (0.14 + r() * 0.08); ctx.beginPath(); ctx.moveTo(x + sway, yy); ctx.quadraticCurveTo(x + d * 0.6 + sway, yy - s * 0.04, x + d + sway, yy + s * 0.06); ctx.stroke(); }
    if (m.season === 'winter') return;
    const col = m.season === 'autumn' ? '#e0b43a' : m.season === 'spring' ? '#9cc65a' : '#7faa4c';
    for (let k = 0; k < 9; k++) {
      const px = x + sway * 1.5 + (r() - 0.5) * s * 0.42, py = y - s * (0.62 + r() * 0.5), rr = s * (0.07 + r() * 0.06);
      K.circle(ctx, px + rr * 0.2, py + rr * 0.2, rr, K.mix(col.slice(1), '2a4a2a', 0.3));
      K.circle(ctx, px, py, rr, col);
    }
  }

  CourtyardScene2['christianity.orthodox'] = {
    back(ctx, w, h, m, K2, t) {
      const hy = h * 0.5, winter = m.season === 'winter';
      K.hills(ctx, w, hy, '#7d9468', h * 0.07, 51);
      K.ground(ctx, w, h, hy, winter ? '#e8eae6' : '#90a46a', winter ? '#d8dbd6' : '#7c9058');
      const s = B.unit(w, h), cx = w * 0.5, base = h * 0.75;
      const e = B.layers(ctx, 'christianity.orthodox', w, h, m, g => B.place(g, cx, base, s, () => build(g)));
      B.blit(ctx, e, w, h);
      K.hit('hall', 'door', cx, base - 34 * s, Math.max(30, 38 * s));
      [[0.06, 0.78, 0.2], [0.13, 0.765, 0.17], [0.2, 0.79, 0.21]].forEach(b => birch(ctx, w * b[0], h * b[1], h * b[2], m, t));
    },
    lights(ctx, w, h, m, K2, t) {
      B.glow(ctx, B.get('christianity.orthodox'), w, h, m, t);
      const s = B.unit(w, h), cx = w * 0.5, base = h * 0.75;
      if (m.offered.indexOf('beeswax') >= 0) [-55.4, -52.4, -49.4, -46.4].forEach((x, i) => K.flame(ctx, cx + x * s, base - (30 - (i % 2) * 2) * s, 2.3 * s, t + i));
    },
  };
})(typeof Build2 !== 'undefined' ? Build2 : null, typeof CourtyardKit !== 'undefined' ? CourtyardKit : null);
