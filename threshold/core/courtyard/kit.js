/*
 * 庭院场景工具箱：天空、远山、地面、树、人、动物、落叶堆、天气。各传统的 scene() 只画自己的建筑。
 * 所有坐标用像素；动物、落叶堆、来客的位置在存档里是 0–1 的比例，这里换算。
 * 宗教人物与神圣对象（佛像、圣像、经典、神像）一律不在这里画，也不可点击；各包按自己的规则处理。
 */
var CourtyardKit = (function () {
  'use strict';
  const K = { hits: [] };
  const TAU = Math.PI * 2;

  K.hit = function (type, id, x, y, r) { K.hits.push({ type, id, x, y, r }); };
  K.find = function (x, y) {
    let best = null;
    K.hits.forEach(h => { const d = Math.hypot(h.x - x, h.y - y); if (d <= h.r && (!best || d < best.d)) best = { d, h }; });
    return best ? best.h : null;
  };
  K.rng = function (seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  K.rr = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  };
  K.poly = function (ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  };
  K.circle = function (ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); ctx.fillStyle = fill; ctx.fill(); };
  K.mix = function (a, b, t) {
    const pa = a.match(/\w\w/g).map(v => parseInt(v, 16)), pb = b.match(/\w\w/g).map(v => parseInt(v, 16));
    return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('');
  };

  /* 天空：按钟点渐变；夜里有星星和真实月相 */
  const SKY = [
    [0, '#0d1526', '#1c2740'], [5, '#1d2a48', '#5a4a6a'], [6.5, '#f0b27a', '#9fc3e0'], [9, '#8cc0e8', '#d8ecf6'],
    [16, '#86b6de', '#e6eef0'], [18.3, '#e8925e', '#f4c98e'], [19.5, '#3a3560', '#8a5a6a'], [21, '#121a30', '#26304c'], [24, '#0d1526', '#1c2740'],
  ];
  K.skyColors = function (h) {
    for (let i = 1; i < SKY.length; i++) {
      if (h <= SKY[i][0]) {
        const a = SKY[i - 1], b = SKY[i], t = (h - a[0]) / (b[0] - a[0]);
        return [K.mix(a[1].slice(1), b[1].slice(1), t), K.mix(a[2].slice(1), b[2].slice(1), t)];
      }
    }
    return [SKY[0][1], SKY[0][2]];
  };
  K.sky = function (ctx, w, h, m, horizon) {
    const [top, bot] = K.skyColors(m.hour);
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, top); g.addColorStop(1, m.rain > 0.3 ? K.mix(bot.slice(1), '8a9098', 0.6) : bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, horizon + 2);
    if (m.night) {
      const r = K.rng(7);
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      for (let i = 0; i < 50; i++) { const x = r() * w, y = r() * horizon * 0.8, s = r() < 0.15 ? 1.6 : 0.9; ctx.fillRect(x, y, s, s); }
    }
    const dayT = (m.hour - 6) / 13;
    if (dayT > 0 && dayT < 1 && !m.night) {
      const sx = w * (0.1 + dayT * 0.8), sy = horizon * (0.85 - Math.sin(dayT * Math.PI) * 0.7);
      K.circle(ctx, sx, sy, Math.max(10, w * 0.035), m.rain > 0.3 ? 'rgba(255,240,200,.25)' : '#fff2c4');
    }
    if (m.night || m.hour < 7 || m.hour > 18) K.moon(ctx, w * 0.78, horizon * 0.22, Math.max(9, w * 0.028), m.moon);
  };
  K.moon = function (ctx, x, y, r, age) {
    const ph = (age || 0) / 29.53;
    K.circle(ctx, x, y, r, '#f4efd8');
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r + 0.5, 0, TAU); ctx.clip();
    const k = Math.cos(ph * TAU);
    ctx.fillStyle = 'rgba(20,26,44,.85)';
    ctx.beginPath();
    if (ph < 0.5) { ctx.arc(x, y, r + 1, Math.PI / 2, -Math.PI / 2, false); ctx.ellipse(x, y, Math.abs(k) * r, r + 1, 0, -Math.PI / 2, Math.PI / 2, k < 0); }
    else { ctx.arc(x, y, r + 1, -Math.PI / 2, Math.PI / 2, false); ctx.ellipse(x, y, Math.abs(k) * r, r + 1, 0, Math.PI / 2, -Math.PI / 2, k < 0); }
    ctx.fill();
    ctx.restore();
  };
  K.hills = function (ctx, w, y, color, amp, seed) {
    const r = K.rng(seed || 3);
    ctx.beginPath(); ctx.moveTo(0, y);
    const n = 6;
    for (let i = 0; i <= n; i++) ctx.quadraticCurveTo(w * (i - 0.5) / n, y - amp * (0.4 + r()), w * i / n, y - amp * 0.3 * r());
    ctx.lineTo(w, y + 4); ctx.lineTo(0, y + 4); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  };
  K.mountains = function (ctx, w, y, color, amp, seed, snow) {
    const r = K.rng(seed || 5);
    const pts = [[0, y]];
    for (let i = 0; i <= 8; i++) pts.push([w * i / 8, y - amp * (0.3 + r() * 0.7) * (i % 2 ? 1 : 0.55)]);
    pts.push([w, y]);
    K.poly(ctx, pts, color);
    if (snow) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      pts.forEach((p, i) => { if (i % 2 && p[1] < y - amp * 0.6) K.poly(ctx, [[p[0] - amp * 0.12, p[1] + amp * 0.14], p, [p[0] + amp * 0.12, p[1] + amp * 0.14]], 'rgba(255,255,255,.85)'); });
    }
  };
  K.ground = function (ctx, w, h, y, c1, c2) {
    const g = ctx.createLinearGradient(0, y, 0, h);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fillRect(0, y, w, h - y);
  };
  K.dim = function (ctx, w, h, m) {
    const a = m.night ? 0.42 : m.hour < 6.5 || m.hour > 18.6 ? 0.2 : 0;
    if (a) { ctx.fillStyle = 'rgba(10,14,34,' + a + ')'; ctx.fillRect(0, 0, w, h); }
  };
  K.glow = function (ctx, x, y, r, color, t) {
    const f = 0.85 + Math.sin((t || 0) * 7 + x) * 0.08;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * f);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * f, 0, TAU); ctx.fill();
  };
  K.flame = function (ctx, x, y, s, t) {
    const f = Math.sin((t || 0) * 9 + x) * 0.15;
    K.poly(ctx, [[x, y - s * (1.4 + f)], [x + s * 0.45, y], [x - s * 0.45, y]], '#ffcf5a');
    K.circle(ctx, x, y - s * 0.25, s * 0.22, '#fff3c0');
  };

  /* 树 */
  const LEAF = { spring: '#6fae5a', summer: '#3f8a46', autumn: '#c98a3a', winter: '#7d8a74', hot: '#5c9a48', monsoon: '#2f8a4a', cool: '#4c8c50' };
  K.tree = function (ctx, x, y, s, kind, m, t) {
    const leaf = LEAF[m.season] || '#4f8f4a';
    const sway = m.reduceMotion ? 0 : Math.sin((t || 0) * 1.2 + x * 0.01) * s * 0.03;
    ctx.fillStyle = '#5a4130';
    if (kind === 'pine' || kind === 'cypress') {
      ctx.fillRect(x - s * 0.06, y - s * 0.4, s * 0.12, s * 0.4);
      const c = kind === 'pine' ? '#2f5a3e' : '#2c4f38';
      for (let i = 0; i < 3; i++) K.poly(ctx, [[x + sway, y - s * (1.25 - i * 0.28)], [x + s * (0.32 + i * 0.1), y - s * (0.55 - i * 0.18)], [x - s * (0.32 + i * 0.1), y - s * (0.55 - i * 0.18)]], m.season === 'winter' && kind === 'pine' ? K.mix('2f5a3e', 'dfe6ea', 0.25) : c);
      return;
    }
    if (kind === 'palm') {
      ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = s * 0.07;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 0.1, y - s * 0.6, x + sway, y - s * 1.1); ctx.stroke();
      ctx.strokeStyle = '#3f7a3a'; ctx.lineWidth = s * 0.05;
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.55; ctx.beginPath(); ctx.moveTo(x + sway, y - s * 1.1); ctx.quadraticCurveTo(x + sway + Math.cos(a) * s * 0.35, y - s * 1.15 + Math.sin(a) * s * 0.2, x + sway + Math.cos(a) * s * 0.55, y - s * 0.9 + Math.sin(a) * s * 0.1); ctx.stroke(); }
      return;
    }
    if (kind === 'bamboo') {
      for (let i = 0; i < 5; i++) {
        const bx = x + (i - 2) * s * 0.08;
        ctx.strokeStyle = '#5f8f3e'; ctx.lineWidth = s * 0.035;
        ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + sway * (1 + i * 0.2), y - s * (1 + (i % 2) * 0.2)); ctx.stroke();
        K.poly(ctx, [[bx + sway, y - s * 0.9], [bx + s * 0.18 + sway, y - s * 0.95], [bx + sway, y - s * 0.86]], '#6fa64a');
      }
      return;
    }
    ctx.fillRect(x - s * 0.07, y - s * 0.5, s * 0.14, s * 0.5);
    if (kind === 'sakura' && (m.month === 3 || m.month === 4)) {
      [[0, -0.8, 0.42], [-0.28, -0.62, 0.3], [0.3, -0.6, 0.3]].forEach(c => K.circle(ctx, x + c[0] * s + sway, y + c[1] * s, c[2] * s, '#f3c4d2'));
      return;
    }
    const col = kind === 'maple' && m.season === 'autumn' ? '#c8502e' : kind === 'olive' ? '#7f9466' : kind === 'banyan' || kind === 'bodhi' ? '#3d7f42' : leaf;
    if (m.season === 'winter' && kind !== 'olive' && kind !== 'banyan' && kind !== 'bodhi') {
      ctx.strokeStyle = '#5a4130'; ctx.lineWidth = s * 0.03;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x, y - s * 0.5); ctx.lineTo(x + (i - 2) * s * 0.18 + sway, y - s * (0.85 + (i % 2) * 0.15)); ctx.stroke(); }
      return;
    }
    [[0, -0.85, 0.42], [-0.3, -0.65, 0.32], [0.3, -0.62, 0.32], [0, -0.55, 0.3]].forEach((c, i) => K.circle(ctx, x + c[0] * s + sway * (1 - i * 0.2), y + c[1] * s, c[2] * s, i ? K.mix(col.slice(1), '20402a', 0.12 * i) : col));
    if (kind === 'banyan') { ctx.strokeStyle = 'rgba(90,65,48,.6)'; ctx.lineWidth = 1; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x + (i - 3) * s * 0.12, y - s * 0.5); ctx.lineTo(x + (i - 3) * s * 0.13, y); ctx.stroke(); } }
  };

  /* 人：只用简单剪影；robe、头饰区分身份，不画面部细节 */
  K.person = function (ctx, x, y, s, o, t) {
    o = o || {};
    const bob = o.walk ? Math.abs(Math.sin((t || 0) * 6 + x)) * s * 0.03 : 0;
    const body = o.body || '#6a7f9a';
    ctx.fillStyle = body;
    K.rr(ctx, x - s * 0.17, y - s * 0.62 - bob, s * 0.34, s * 0.62, s * 0.1); ctx.fill();
    if (o.sash) { ctx.fillStyle = o.sash; ctx.fillRect(x - s * 0.17, y - s * 0.5 - bob, s * 0.34, s * 0.08); }
    const hy = y - s * 0.74 - bob;
    K.circle(ctx, x, hy, s * 0.13, o.skin || '#c99a74');
    if (o.head === 'turban') { K.circle(ctx, x, hy - s * 0.06, s * 0.15, o.headColor || '#d07a2a'); }
    else if (o.head === 'scarf') { ctx.fillStyle = o.headColor || '#7a4a6a'; ctx.beginPath(); ctx.arc(x, hy, s * 0.155, Math.PI, 0); ctx.lineTo(x + s * 0.17, hy + s * 0.2); ctx.lineTo(x - s * 0.17, hy + s * 0.2); ctx.fill(); }
    else if (o.head === 'kippah' || o.head === 'cap') { ctx.fillStyle = o.headColor || '#2a3550'; ctx.beginPath(); ctx.arc(x, hy - s * 0.04, s * 0.11, Math.PI, 0); ctx.fill(); }
    else if (o.head === 'veil') { ctx.fillStyle = o.headColor || '#2a2a33'; ctx.beginPath(); ctx.arc(x, hy - s * 0.01, s * 0.16, Math.PI, 0); ctx.lineTo(x + s * 0.18, hy + s * 0.3); ctx.lineTo(x - s * 0.18, hy + s * 0.3); ctx.fill(); }
    else if (o.head !== 'shaved') { ctx.fillStyle = o.hair || '#2a2420'; ctx.beginPath(); ctx.arc(x, hy - s * 0.02, s * 0.135, Math.PI, 0); ctx.fill(); }
    if (o.item === 'bowl') K.circle(ctx, x + s * 0.12, y - s * 0.38 - bob, s * 0.08, '#3a2a1a');
    if (o.item === 'plate') { ctx.fillStyle = '#e8e2d2'; ctx.fillRect(x + s * 0.1, y - s * 0.4 - bob, s * 0.2, s * 0.05); }
  };

  /* 动物 */
  K.animal = function (ctx, a, w, h, t, m) {
    const x = a.x * w, y = a.y * h, s = Math.min(w, h) * (a.kind === 'cow' ? 0.12 : a.kind === 'bird' ? 0.045 : a.kind === 'dog' ? 0.08 : 0.07);
    const step = m && m.reduceMotion ? 0 : Math.sin((t || 0) * 8 + a.id) * s * 0.04;
    ctx.save(); ctx.translate(x, y); ctx.scale(a.dir || 1, 1);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.55, s * 0.12, 0, 0, TAU); ctx.fill();
    if (a.kind === 'dog') {
      const c = ['#b07a46', '#d8c19a', '#3a3330', '#a9653a'][a.id % 4];
      ctx.fillStyle = c; K.rr(ctx, -s * 0.45, -s * 0.55, s * 0.8, s * 0.32, s * 0.12); ctx.fill();
      ctx.fillRect(-s * 0.4, -s * 0.28 + step, s * 0.09, s * 0.28); ctx.fillRect(s * 0.22, -s * 0.28 - step, s * 0.09, s * 0.28);
      K.circle(ctx, s * 0.42, -s * 0.66, s * 0.17, c);
      K.poly(ctx, [[s * 0.33, -s * 0.8], [s * 0.4, -s * 0.95], [s * 0.47, -s * 0.8]], K.mix(c.slice(1), '000000', 0.25));
      ctx.strokeStyle = c; ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.5); ctx.quadraticCurveTo(-s * 0.6, -s * 0.75, -s * 0.55 + step, -s * 0.85); ctx.stroke();
    } else if (a.kind === 'cat') {
      const c = ['#e2a55a', '#3b3532', '#d9d2c6', '#8f8a80'][a.id % 4];
      ctx.fillStyle = c; K.rr(ctx, -s * 0.38, -s * 0.42, s * 0.62, s * 0.26, s * 0.12); ctx.fill();
      ctx.fillRect(-s * 0.32, -s * 0.2 + step, s * 0.07, s * 0.2); ctx.fillRect(s * 0.13, -s * 0.2 - step, s * 0.07, s * 0.2);
      K.circle(ctx, s * 0.3, -s * 0.5, s * 0.15, c);
      K.poly(ctx, [[s * 0.2, -s * 0.58], [s * 0.22, -s * 0.74], [s * 0.3, -s * 0.62]], c);
      K.poly(ctx, [[s * 0.32, -s * 0.62], [s * 0.4, -s * 0.74], [s * 0.42, -s * 0.56]], c);
      ctx.strokeStyle = c; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(-s * 0.38, -s * 0.35); ctx.quadraticCurveTo(-s * 0.65, -s * 0.4, -s * 0.55, -s * 0.75 + step); ctx.stroke();
    } else if (a.kind === 'cow') {
      const c = ['#efe9dc', '#cdbfa8', '#8a6a4e'][a.id % 3];
      ctx.fillStyle = c; K.rr(ctx, -s * 0.5, -s * 0.62, s * 0.88, s * 0.38, s * 0.14); ctx.fill();
      ctx.fillRect(-s * 0.42, -s * 0.28, s * 0.09, s * 0.28); ctx.fillRect(s * 0.24, -s * 0.28, s * 0.09, s * 0.28);
      K.rr(ctx, s * 0.34, -s * 0.72, s * 0.22, s * 0.26, s * 0.08); ctx.fill();
      ctx.strokeStyle = '#d8cfbf'; ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.moveTo(s * 0.38, -s * 0.72); ctx.quadraticCurveTo(s * 0.35, -s * 0.86, s * 0.42, -s * 0.9); ctx.moveTo(s * 0.52, -s * 0.72); ctx.quadraticCurveTo(s * 0.56, -s * 0.86, s * 0.5, -s * 0.9); ctx.stroke();
      ctx.fillStyle = '#c0392b'; ctx.fillRect(s * 0.3, -s * 0.5, s * 0.06, s * 0.08);
    } else {
      ctx.fillStyle = '#8e95a3'; ctx.beginPath(); ctx.ellipse(0, -s * 0.45, s * 0.42, s * 0.28, 0, 0, TAU); ctx.fill();
      K.circle(ctx, s * 0.36, -s * 0.72, s * 0.18, '#7d8494');
      ctx.fillStyle = '#5a6070'; ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.5, s * 0.28, s * 0.14, -0.3, 0, TAU); ctx.fill();
      K.poly(ctx, [[s * 0.52, -s * 0.74], [s * 0.66, -s * 0.7], [s * 0.52, -s * 0.66]], '#d6a24a');
    }
    if (a.injury && !a.healAt) { ctx.fillStyle = '#fff'; ctx.fillRect(-s * 0.1, -s * 1.15, s * 0.2, s * 0.06); ctx.fillStyle = '#d1453b'; ctx.fillRect(-s * 0.03, -s * 1.22, s * 0.06, s * 0.2); }
    ctx.restore();
    K.hit('animal', a.id, x, y - s * 0.4, Math.max(22, s * 0.8));
  };

  /* 活计：落叶、花瓣、雪、待洗的碗盘、待整理的箱子 */
  K.pile = function (ctx, p, w, h, style, m) {
    const x = p.x * w, y = p.y * h, s = Math.min(w, h) * 0.05;
    const r = K.rng(p.id * 13);
    const n = p.left > 1 ? 9 : 5;
    if (style === 'dishes') {
      for (let i = 0; i < n / 2; i++) { ctx.fillStyle = i % 2 ? '#d9dde2' : '#c3c9d0'; ctx.beginPath(); ctx.ellipse(x, y - i * s * 0.12, s * 0.5, s * 0.14, 0, 0, TAU); ctx.fill(); }
    } else if (style === 'boxes') {
      for (let i = 0; i < Math.ceil(n / 3); i++) { ctx.fillStyle = ['#c79a5a', '#b8874a', '#d4ab6e'][i % 3]; ctx.fillRect(x - s * 0.4 + i * s * 0.12, y - s * 0.35 * (i + 1), s * 0.55, s * 0.32); ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.strokeRect(x - s * 0.4 + i * s * 0.12, y - s * 0.35 * (i + 1), s * 0.55, s * 0.32); }
    } else {
      const cols = style === 'petals' ? ['#f2a43a', '#e8792b', '#f6c85a', '#d84a3a'] : style === 'snow' ? ['#f4f6f8', '#e2e8ee'] : m && m.season === 'autumn' ? ['#c8742e', '#d9a03a', '#a8502a'] : ['#9a8a4a', '#7c8a3e', '#b0903e', '#8a6a3a'];
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath(); ctx.ellipse(x + (r() - 0.5) * s * 1.2, y + (r() - 0.5) * s * 0.35, s * 0.18, s * 0.09, r() * 3, 0, TAU); ctx.fill();
      }
    }
    K.hit('pile', p.id, x, y, Math.max(24, s));
  };

  K.guest = function (ctx, g, w, h, t, look) {
    const x = g.x * w, y = g.y * h, s = Math.min(w, h) * 0.13;
    const looks = look || [{ body: '#6a7f9a' }, { body: '#9a6a5a', head: 'scarf' }, { body: '#5f8a6a' }, { body: '#8a7a5a', head: 'cap' }, { body: '#7a6a9a' }, { body: '#a07a4a', head: 'scarf', headColor: '#c4683a' }];
    K.person(ctx, x, y, s, looks[g.look % looks.length], t);
    K.circle(ctx, x + s * 0.28, y - s * 1.05, s * 0.12, 'rgba(255,255,255,.92)');
    ctx.fillStyle = '#8a5a1f'; ctx.font = Math.round(s * 0.18) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🍲', x + s * 0.28, y - s * 0.99);
    K.hit('guest', g.id, x, y - s * 0.4, Math.max(26, s * 0.5));
  };

  K.flags = function (ctx, x1, y1, x2, y2, t, m) {
    const cols = ['#2c6fbb', '#f4f1e8', '#c0392b', '#2e8b57', '#e5b72e'];
    ctx.strokeStyle = 'rgba(80,60,40,.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + 18, x2, y2); ctx.stroke();
    for (let i = 1; i < 14; i++) {
      const u = i / 14, x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u + Math.sin(u * Math.PI) * 18 * (1 - Math.abs(0.5 - u) * 0.2);
      const fl = m && m.reduceMotion ? 0 : Math.sin((t || 0) * 3 + i) * 2;
      ctx.fillStyle = cols[i % 5]; ctx.fillRect(x - 5, y, 10, 12 + fl);
    }
  };

  K.weather = function (ctx, w, h, m, t) {
    if (m.rain > 0.05) {
      ctx.strokeStyle = 'rgba(200,215,230,' + (0.25 + m.rain * 0.35) + ')'; ctx.lineWidth = 1;
      const n = Math.floor(60 * m.rain), r = K.rng(11);
      for (let i = 0; i < n; i++) { const x = (r() * w + t * 40) % w, y = (r() * h + t * 600 * (0.8 + r() * 0.4)) % h; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 12); ctx.stroke(); }
    }
    if (m.season === 'winter' && m.snow) {
      ctx.fillStyle = 'rgba(255,255,255,.8)'; const r = K.rng(17);
      for (let i = 0; i < 40; i++) { const x = (r() * w + Math.sin(t + i) * 10) % w, y = (r() * h + t * 30 * (0.5 + r())) % h; ctx.fillRect(x, y, 2, 2); }
    }
  };

  return K;
})();
