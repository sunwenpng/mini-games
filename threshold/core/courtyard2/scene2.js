/*
 * 庭院 v2 的建筑重画（v2 新增；不改各传统的 game.js，旧入口 play.html 不受影响）。
 * - CourtyardScene2[id] = { back, lights, front?, msg? }：登记之后，庭院 v2 用它代替 game.js 里的 scene；
 *   msg 是对少量文案的覆盖（只在 v2 生效）。各传统的重画放在 traditions/<id>/scene2.js。
 * - Build2：画建筑用的工具（石墙、木板墙、瓦顶、拱窗、玫瑰窗、门、洋葱顶、十字架……）。
 *   建筑是静态的，所以先画到离屏画布上缓存，每帧只贴图；另存一层“亮灯的窗”，天黑后叠上去。
 */
var CourtyardScene2 = {};
var Build2 = (function (K) {
  'use strict';
  if (!K) return null;
  const B = {}, TAU = Math.PI * 2;

  /* ---------- 颜色 ---------- */
  function rgb(c) {
    if (c[0] === '#') return c.slice(1).match(/\w\w/g).map(v => parseInt(v, 16));
    return c.match(/[\d.]+/g).slice(0, 3).map(Number);
  }
  /* k > 0 向白提亮，k < 0 向黑压暗 */
  B.tone = function (c, k) {
    const p = rgb(c), t = k > 0 ? 255 : 0, a = Math.abs(k);
    return 'rgb(' + p.map(v => Math.round(v + (t - v) * a)).join(',') + ')';
  };
  B.mix = function (a, b, t) {
    const p = rgb(a), q = rgb(b);
    return 'rgb(' + p.map((v, i) => Math.round(v + (q[i] - v) * t)).join(',') + ')';
  };
  function trace(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
  function box(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }
  B.trace = trace;
  B.poly = function (g, pts, fill, stroke, lw) {
    if (g.lit) return;
    const ctx = g.ctx; trace(ctx, pts);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  };
  B.rect = function (g, x, y, w, h, fill) { if (g.lit) return; g.ctx.fillStyle = fill; g.ctx.fillRect(x, y, w, h); };

  /* ---------- 墙面 ----------
   * pts 多边形；o.kind 'stone'（默认，错缝石块）| 'plaster'（抹灰）| 'board'（横木板）
   * o.slope 砌缝的斜率（侧墙有透视时用）；o.dark 整面压暗 0..1（背光面）；o.course 一层的高度 */
  B.wall = function (g, pts, color, o) {
    if (g.lit) return;
    o = o || {};
    const ctx = g.ctx, bb = box(pts), r = K.rng(o.seed || 11), ch = o.course || 7, sl = o.slope || 0;
    ctx.save();
    trace(ctx, pts); ctx.fillStyle = color; ctx.fill(); ctx.clip();
    ctx.save();
    if (sl) ctx.transform(1, sl, 0, 1, 0, -sl * bb.x0);
    const pad = Math.abs(sl) * bb.w + ch, y0 = bb.y0 - pad, y1 = bb.y1 + pad;
    if (o.kind === 'board') {
      for (let y = y0; y < y1; y += ch) {
        ctx.fillStyle = 'rgba(40,50,60,.20)'; ctx.fillRect(bb.x0, y, bb.w, 1);
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(bb.x0, y + 1, bb.w, 1);
      }
    } else if (o.kind === 'plaster') {
      for (let i = 0; i < 26; i++) {
        const x = bb.x0 + r() * bb.w, y = bb.y0 + r() * bb.h, s = 6 + r() * 16;
        ctx.fillStyle = r() < 0.5 ? 'rgba(255,255,255,.10)' : 'rgba(110,100,80,.05)';
        ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.5, 0, 0, TAU); ctx.fill();
      }
    } else {
      for (let y = y0, row = 0; y < y1; y += ch, row++) {
        let x = bb.x0 - (row % 2 ? ch : 0) - r() * ch;
        while (x < bb.x1) {
          const bw = ch * (1.5 + r() * 1.5), v = r();
          if (v < 0.55) {
            ctx.fillStyle = v < 0.28 ? 'rgba(255,250,235,' + (0.05 + r() * 0.10).toFixed(3) + ')' : 'rgba(80,55,25,' + (0.04 + r() * 0.09).toFixed(3) + ')';
            ctx.fillRect(x + 0.5, y + 0.5, bw - 1, ch - 1);
          }
          x += bw;
          ctx.fillStyle = 'rgba(70,48,24,.24)'; ctx.fillRect(x - 0.5, y, 1, ch);
        }
        ctx.fillStyle = 'rgba(70,48,24,.22)'; ctx.fillRect(bb.x0 - 2, y, bb.w + 4, 1);
        ctx.fillStyle = 'rgba(255,250,235,.14)'; ctx.fillRect(bb.x0 - 2, y + 1, bb.w + 4, 1);
      }
    }
    ctx.restore();
    const gr = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
    gr.addColorStop(0, 'rgba(255,250,228,.12)'); gr.addColorStop(1, 'rgba(40,26,10,.12)');
    ctx.fillStyle = gr; ctx.fillRect(bb.x0, bb.y0, bb.w, bb.h);
    if (o.dark) { ctx.fillStyle = 'rgba(34,30,52,' + o.dark + ')'; ctx.fillRect(bb.x0, bb.y0, bb.w, bb.h); }
    ctx.restore();
    if (o.edge !== false) { trace(ctx, pts); ctx.strokeStyle = 'rgba(60,42,22,.38)'; ctx.lineWidth = 1; ctx.stroke(); }
  };

  /* ---------- 屋顶：一排排的瓦。冬天积雪 ---------- */
  B.roof = function (g, pts, color, o) {
    if (g.lit) return;
    o = o || {};
    const ctx = g.ctx, bb = box(pts), sl = o.slope || 0, rh = o.row || 6, tw = o.tile || 7, r = K.rng(o.seed || 5);
    const col = g.snow ? B.mix(color, '#f1f4f7', o.snow == null ? 0.8 : o.snow) : color;
    ctx.save();
    trace(ctx, pts); ctx.fillStyle = col; ctx.fill(); ctx.clip();
    ctx.save();
    if (sl) ctx.transform(1, sl, 0, 1, 0, -sl * bb.x0);
    const pad = Math.abs(sl) * bb.w + rh, a = g.snow ? 0.35 : 1;
    for (let y = bb.y0 - pad, row = 0; y < bb.y1 + pad; y += rh, row++) {
      ctx.fillStyle = 'rgba(30,14,6,' + (0.26 * a) + ')'; ctx.fillRect(bb.x0 - 2, y, bb.w + 4, 1.2);
      ctx.fillStyle = 'rgba(255,225,190,' + (0.16 * a) + ')'; ctx.fillRect(bb.x0 - 2, y + 1.2, bb.w + 4, 1);
      for (let x = bb.x0 - (row % 2 ? tw / 2 : 0); x < bb.x1; x += tw) {
        ctx.fillStyle = 'rgba(30,14,6,' + (0.15 * a) + ')'; ctx.fillRect(x, y + 1, 1, rh - 1);
        if (r() < 0.22) { ctx.fillStyle = 'rgba(255,210,170,' + (0.14 * a) + ')'; ctx.fillRect(x + 1, y + 2, tw - 1, rh - 2); }
        else if (r() < 0.14) { ctx.fillStyle = 'rgba(50,20,10,' + (0.12 * a) + ')'; ctx.fillRect(x + 1, y + 2, tw - 1, rh - 2); }
      }
    }
    ctx.restore();
    const gr = ctx.createLinearGradient(0, bb.y0, 0, bb.y1);
    gr.addColorStop(0, 'rgba(255,240,215,.16)'); gr.addColorStop(1, 'rgba(20,10,10,.16)');
    ctx.fillStyle = gr; ctx.fillRect(bb.x0, bb.y0, bb.w, bb.h);
    if (o.dark) { ctx.fillStyle = 'rgba(30,26,48,' + o.dark + ')'; ctx.fillRect(bb.x0, bb.y0, bb.w, bb.h); }
    ctx.restore();
    trace(ctx, pts); ctx.strokeStyle = 'rgba(40,22,12,.4)'; ctx.lineWidth = 1; ctx.stroke();
  };

  /* 记下发光点的位置（换算回画布坐标），天黑后在这里加一圈光晕 */
  function glowAt(g, x, y, r) {
    const M = g.ctx.getTransform();
    g.glows.push({ x: (M.a * x + M.c * y + M.e) / g.sc, y: (M.b * x + M.d * y + M.f) / g.sc, r });
  }
  B.glowAt = glowAt;

  /* ---------- 窗 ----------
   * x 中心，y 窗台，w 宽，h 高（到拱顶）。o.square 方窗；o.point 尖拱；o.frame 窗框色；o.glass 白天的玻璃色；
   * o.bars 竖棂数；o.rows 横棂数；o.warm 夜里的灯色；o.sill 画窗台；o.stain 彩色玻璃的颜色表 */
  B.win = function (g, x, y, w, h, o) {
    o = o || {};
    const ctx = g.ctx, r = w / 2, top = y - h;
    const shape = d => {
      const rr = r + d;
      ctx.beginPath(); ctx.moveTo(x - rr, y + d);
      if (o.square) { ctx.lineTo(x - rr, top - d); ctx.lineTo(x + rr, top - d); }
      else if (o.point) { ctx.lineTo(x - rr, top + r * 1.3); ctx.quadraticCurveTo(x - rr, top + r * 0.3, x, top - d * 1.4); ctx.quadraticCurveTo(x + rr, top + r * 0.3, x + rr, top + r * 1.3); }
      else { ctx.lineTo(x - rr, top + r); ctx.arc(x, top + r, rr, Math.PI, 0); }
      ctx.lineTo(x + rr, y + d); ctx.closePath();
    };
    const bars = () => {
      const nb = o.bars == null ? 1 : o.bars, nr = o.rows == null ? Math.max(1, Math.round(h / w) - 1) : o.rows;
      ctx.lineWidth = Math.max(0.8, w * 0.06);
      for (let i = 1; i <= nb; i++) { const bx = x - r + (w * i) / (nb + 1); ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, top); ctx.stroke(); }
      for (let i = 1; i <= nr; i++) { const by = y - (h - (o.square ? 0 : r * 0.6)) * i / (nr + 1); ctx.beginPath(); ctx.moveTo(x - r, by); ctx.lineTo(x + r, by); ctx.stroke(); }
    };
    if (g.lit) {
      ctx.save(); shape(-0.6); ctx.clip();
      const gr = ctx.createLinearGradient(0, top, 0, y);
      gr.addColorStop(0, o.warm || '#ffe9b0'); gr.addColorStop(1, B.tone(o.warm || '#ffcf78', -0.12));
      ctx.fillStyle = gr; ctx.fillRect(x - r, top, w, h);
      if (o.stain) stain(ctx, x, top, w, h, o.stain, 0.75, o.seed || 3);
      ctx.strokeStyle = 'rgba(60,34,14,.75)'; bars();
      ctx.restore();
      glowAt(g, x, y - h / 2, Math.max(w, h) * 0.85);
      return;
    }
    const frame = o.frame || '#efe6d2';
    shape(Math.max(1.4, w * 0.13)); ctx.fillStyle = frame; ctx.fill();
    ctx.strokeStyle = 'rgba(60,42,22,.35)'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.save(); shape(0); ctx.clip();
    const gr = ctx.createLinearGradient(x - r, top, x + r, y);
    const gl = o.glass || '#34465a';
    gr.addColorStop(0, B.tone(gl, 0.22)); gr.addColorStop(0.5, gl); gr.addColorStop(1, B.tone(gl, -0.3));
    ctx.fillStyle = gr; ctx.fillRect(x - r, top, w, h);
    if (o.stain) stain(ctx, x, top, w, h, o.stain, 0.42, o.seed || 3);
    ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.beginPath(); ctx.moveTo(x - r, top + h * 0.5); ctx.lineTo(x + r * 0.2, top); ctx.lineTo(x + r * 0.7, top); ctx.lineTo(x - r, top + h * 0.75); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x - r, top, w, Math.max(1.2, h * 0.05));
    ctx.strokeStyle = o.bar || frame; bars();
    ctx.restore();
    if (o.sill !== false) { ctx.fillStyle = B.tone(frame, 0.08); ctx.fillRect(x - r - w * 0.22, y, w * 1.44, Math.max(1.6, h * 0.04)); ctx.fillStyle = 'rgba(40,26,10,.25)'; ctx.fillRect(x - r - w * 0.18, y + Math.max(1.6, h * 0.04), w * 1.36, 1); }
  };
  function stain(ctx, x, top, w, h, cols, a, seed) {
    const r = K.rng(seed), n = Math.max(3, Math.round(h / (w * 0.42)));
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < n; i++) for (let k = 0; k < 2; k++) {
      ctx.fillStyle = cols[Math.floor(r() * cols.length)];
      ctx.fillRect(x - w / 2 + k * w / 2, top + (h * i) / n, w / 2, h / n + 0.5);
    }
    ctx.restore();
  }

  /* ---------- 玫瑰窗 ---------- */
  B.rose = function (g, x, y, r, o) {
    o = o || {};
    const ctx = g.ctx, n = o.n || 12, cols = o.cols || ['#c23a44', '#2f62b8', '#e2ab3c', '#2f8a66', '#7a3fa0'];
    const petals = a => {
      ctx.save(); ctx.globalAlpha = a;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU;
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath(); ctx.arc(x, y, r * 0.86, a0, a1); ctx.arc(x, y, r * 0.3, a1, a0, true); ctx.closePath(); ctx.fill();
        ctx.fillStyle = cols[(i + 2) % cols.length];
        ctx.beginPath(); ctx.arc(x + Math.cos((a0 + a1) / 2) * r * 0.66, y + Math.sin((a0 + a1) / 2) * r * 0.66, r * 0.1, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = cols[2]; ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, TAU); ctx.fill();
      ctx.restore();
    };
    const tracery = col => {
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.9, r * 0.06);
      for (let i = 0; i < n; i++) { const a = (i / n) * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3); ctx.lineTo(x + Math.cos(a) * r * 0.88, y + Math.sin(a) * r * 0.88); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.88, 0, TAU); ctx.stroke();
    };
    if (g.lit) {
      K.circle(ctx, x, y, r * 0.88, '#ffe6a6'); petals(0.8); tracery('rgba(60,34,14,.8)');
      glowAt(g, x, y, r * 2.4);
      return;
    }
    const frame = o.frame || '#efe6d2';
    K.circle(ctx, x, y, r * 1.12, B.tone(frame, -0.12)); K.circle(ctx, x, y, r * 1.04, frame);
    K.circle(ctx, x, y, r * 0.88, '#262c40'); petals(0.5);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.88, 0, TAU); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,.13)'; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x, y - r); ctx.lineTo(x + r * 0.4, y - r); ctx.lineTo(x - r, y + r * 0.4); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(x, y - r * 0.12, r * 0.95, Math.PI * 1.1, Math.PI * 1.9); ctx.arc(x, y + r * 0.05, r * 0.95, Math.PI * 1.9, Math.PI * 1.1, true); ctx.fill();
    ctx.restore();
    tracery(frame);
    ctx.strokeStyle = 'rgba(60,42,22,.4)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.stroke();
  };

  /* ---------- 门 ----------
   * x 中心，y 门槛，w 门洞宽，h 门洞高（到拱顶）。o.orders 层层退进的拱券数；o.step 每层退进多少；
   * o.frame 石色；o.wood 木色；o.tymp 门楣上留一块半圆（true 或颜色）；o.square 方门 */
  B.door = function (g, x, y, w, h, o) {
    o = o || {};
    const ctx = g.ctx, r = w / 2, top = y - h, n = o.orders || 0, st = o.step || w * 0.1;
    const arch = d => {
      const rr = r + d;
      ctx.beginPath(); ctx.moveTo(x - rr, y);
      if (o.square) { ctx.lineTo(x - rr, top - d); ctx.lineTo(x + rr, top - d); }
      else { ctx.lineTo(x - rr, top + r); ctx.arc(x, top + r, rr, Math.PI, 0); }
      ctx.lineTo(x + rr, y); ctx.closePath();
    };
    if (g.lit) {
      if (o.tymp && !o.square) {
        ctx.save(); ctx.beginPath(); ctx.arc(x, top + r, r * 0.82, Math.PI, 0); ctx.closePath(); ctx.clip();
        ctx.fillStyle = '#ffdf9a'; ctx.fillRect(x - r, top, w, r);
        ctx.strokeStyle = 'rgba(60,34,14,.7)'; ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) { const a = Math.PI + (i / 5) * Math.PI; ctx.beginPath(); ctx.moveTo(x, top + r); ctx.lineTo(x + Math.cos(a) * r, top + r + Math.sin(a) * r); ctx.stroke(); }
        ctx.restore();
        glowAt(g, x, top + r * 0.6, w * 1.3);
      }
      ctx.fillStyle = 'rgba(255,214,140,.85)'; ctx.fillRect(x - 0.6, o.tymp && !o.square ? top + r : top + 2, 1.2, y - top - (o.tymp && !o.square ? r : 2));
      return;
    }
    const frame = o.frame || '#e6dcc4', wood = o.wood || '#5c3a22';
    for (let k = n; k >= 1; k--) {
      arch(k * st); ctx.fillStyle = B.tone(frame, k % 2 ? 0.1 : -0.1); ctx.fill();
      ctx.strokeStyle = 'rgba(60,42,22,.32)'; ctx.lineWidth = 0.8; ctx.stroke();
    }
    arch(0); ctx.fillStyle = B.tone(wood, -0.55); ctx.fill();
    ctx.save(); arch(0); ctx.clip();
    const dTop = o.tymp && !o.square ? top + r : top;
    const wg = ctx.createLinearGradient(x - r, 0, x + r, 0);
    wg.addColorStop(0, B.tone(wood, 0.12)); wg.addColorStop(0.5, wood); wg.addColorStop(1, B.tone(wood, -0.2));
    ctx.fillStyle = wg; ctx.fillRect(x - r + 1, dTop, w - 2, y - dTop);
    const pl = Math.max(4, Math.round(w / 5));
    ctx.fillStyle = 'rgba(20,10,4,.35)';
    for (let i = 1; i < pl; i++) ctx.fillRect(x - r + (w * i) / pl, dTop, 0.8, y - dTop);
    ctx.fillStyle = 'rgba(20,10,4,.75)'; ctx.fillRect(x - 0.7, dTop, 1.4, y - dTop);
    /* 铁铰链与门环 */
    ctx.fillStyle = 'rgba(24,20,18,.8)';
    [0.22, 0.72].forEach(f => { const yy = dTop + (y - dTop) * f; ctx.fillRect(x - r + 1, yy, r * 0.62, 1.4); ctx.fillRect(x + r * 0.38 - 1, yy, r * 0.62, 1.4); });
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(x + s * r * 0.2, dTop + (y - dTop) * 0.5, Math.max(1, w * 0.035), 0, TAU); ctx.fillStyle = '#c8a24a'; ctx.fill(); });
    if (o.tymp && !o.square) {
      ctx.beginPath(); ctx.arc(x, top + r, r, Math.PI, 0); ctx.closePath(); ctx.fillStyle = o.tymp === true ? B.tone(frame, -0.04) : o.tymp; ctx.fill();
      ctx.fillStyle = B.tone(frame, 0.12); ctx.fillRect(x - r, top + r - 1.5, w, 3);
    }
    const sh = ctx.createLinearGradient(0, top, 0, top + h * 0.35);
    sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh; ctx.fillRect(x - r, top, w, h * 0.35);
    ctx.restore();
  };

  /* 台阶：x 中心，y 最上一级的顶面，w 最上一级的宽，n 级数，sh 每级高，grow 每级向两边多出多少 */
  B.steps = function (g, x, y, w, n, sh, color, grow) {
    if (g.lit) return;
    const ctx = g.ctx;
    for (let i = 0; i < n; i++) {
      const ww = w + i * 2 * (grow || sh), yy = y + i * sh;
      ctx.fillStyle = B.tone(color, 0.1 - i * 0.03); ctx.fillRect(x - ww / 2, yy, ww, sh);
      ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x - ww / 2, yy, ww, 1);
      ctx.fillStyle = 'rgba(40,26,10,.3)'; ctx.fillRect(x - ww / 2, yy + sh - 1, ww, 1);
    }
  };

  /* 十字架：x 中心，y 底，s 总高。kind 'latin' | 'orthodox'（三横，下横斜） */
  B.cross = function (g, x, y, s, color, kind) {
    if (g.lit) return;
    const ctx = g.ctx, t = Math.max(1.6, s * 0.1);
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.lineWidth = t;
    const line = (x0, y0, x1, y1) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); };
    line(x, y, x, y - s);
    if (kind === 'orthodox') {
      line(x - s * 0.3, y - s * 0.62, x + s * 0.3, y - s * 0.62);
      line(x - s * 0.15, y - s * 0.82, x + s * 0.15, y - s * 0.82);
      line(x - s * 0.2, y - s * 0.34, x + s * 0.2, y - s * 0.24);
    } else line(x - s * 0.3, y - s * 0.66, x + s * 0.3, y - s * 0.66);
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = Math.max(0.6, t * 0.3);
    line(x - t * 0.25, y - s * 0.05, x - t * 0.25, y - s * 0.97);
    ctx.restore();
    K.circle(ctx, x, y, t * 0.85, color);
  };

  /* 洋葱顶：x 中心，y 洋葱底，r 最宽处的半径。o.pat 'stars' | 'ribs' | 无；o.cross 十字架颜色（false 不画） */
  B.onion = function (g, x, y, r, color, o) {
    if (g.lit) return;
    o = o || {};
    const ctx = g.ctx;
    const shape = () => {
      ctx.beginPath(); ctx.moveTo(x - r * 0.62, y);
      ctx.bezierCurveTo(x - r * 1.42, y - r * 0.7, x - r * 0.42, y - r * 1.5, x, y - r * 2.2);
      ctx.bezierCurveTo(x + r * 0.42, y - r * 1.5, x + r * 1.42, y - r * 0.7, x + r * 0.62, y);
      ctx.closePath();
    };
    const gr = ctx.createLinearGradient(x - r, 0, x + r, 0);
    gr.addColorStop(0, B.tone(color, 0.18)); gr.addColorStop(0.3, B.tone(color, 0.34)); gr.addColorStop(0.55, color); gr.addColorStop(1, B.tone(color, -0.42));
    shape(); ctx.fillStyle = gr; ctx.fill();
    ctx.save(); shape(); ctx.clip();
    if (o.pat === 'stars') {
      const rr = K.rng(o.seed || 9);
      for (let i = 0; i < 16; i++) {
        const sx = x + (rr() - 0.5) * r * 1.7, sy = y - rr() * r * 1.5, s = Math.max(0.9, r * 0.075);
        ctx.fillStyle = '#f2d36a'; ctx.beginPath();
        for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU, q = k % 2 ? s * 0.45 : s * 1.2; ctx.lineTo(sx + Math.cos(a) * q, sy + Math.sin(a) * q); }
        ctx.fill();
      }
    } else if (o.pat === 'ribs') {
      ctx.strokeStyle = 'rgba(60,30,0,.22)'; ctx.lineWidth = Math.max(0.7, r * 0.04);
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * r * 0.18, y); ctx.bezierCurveTo(x + i * r * 0.42, y - r * 0.7, x + i * r * 0.14, y - r * 1.5, x, y - r * 2.2); ctx.stroke(); }
    }
    ctx.fillStyle = 'rgba(255,255,255,.34)'; ctx.beginPath(); ctx.ellipse(x - r * 0.42, y - r * 0.92, r * 0.13, r * 0.42, -0.25, 0, TAU); ctx.fill();
    if (g.snow) { ctx.fillStyle = 'rgba(248,250,252,.85)'; ctx.beginPath(); ctx.ellipse(x - r * 0.1, y - r * 1.86, r * 0.36, r * 0.42, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    shape(); ctx.strokeStyle = 'rgba(40,24,6,.35)'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.fillStyle = B.tone(color, -0.25); ctx.fillRect(x - r * 0.66, y - 1, r * 1.32, Math.max(2, r * 0.12));
    if (o.cross !== false) B.cross(g, x, y - r * 2.14, r * (o.crossSize || 1.15), o.cross || '#e6c158', 'orthodox');
  };

  /* 灌木：一团深浅不同的圆 */
  B.bush = function (g, x, y, r, color, seed) {
    if (g.lit) return;
    const ctx = g.ctx, rr = K.rng(seed || 3);
    K.shadow(ctx, x + r * 0.2, y, r * 1.3, r * 0.3, 0.22);
    for (let i = 0; i < 7; i++) {
      const a = rr() * TAU, d = rr() * r * 0.7, px = x + Math.cos(a) * d, py = y - r * 0.55 - Math.abs(Math.sin(a)) * d * 0.7, s = r * (0.45 + rr() * 0.3);
      K.circle(ctx, px + s * 0.15, py + s * 0.15, s, B.tone(color, -0.25));
      K.circle(ctx, px, py, s, color);
      K.circle(ctx, px - s * 0.3, py - s * 0.3, s * 0.5, g.snow ? 'rgba(246,248,250,.9)' : B.tone(color, 0.22));
    }
  };
  /* 一排花 */
  B.flowers = function (g, x0, x1, y, cols, seed) {
    if (g.lit || g.snow) return;
    const ctx = g.ctx, rr = K.rng(seed || 4), n = Math.max(3, Math.round((x1 - x0) / 5));
    for (let i = 0; i < n; i++) {
      const x = x0 + ((i + rr() * 0.6) / n) * (x1 - x0), yy = y - rr() * 3;
      ctx.fillStyle = '#4f8a46'; ctx.fillRect(x - 0.5, yy, 1, 4);
      K.circle(ctx, x, yy, 1.5 + rr(), cols[Math.floor(rr() * cols.length)]);
    }
  };
  /* 小路：多边形 + 零星的石子 */
  B.path = function (g, pts, color, seed) {
    if (g.lit) return;
    const ctx = g.ctx, bb = box(pts), rr = K.rng(seed || 6);
    ctx.save(); trace(ctx, pts); ctx.fillStyle = color; ctx.globalAlpha = 0.92; ctx.fill(); ctx.globalAlpha = 1; ctx.clip();
    for (let i = 0; i < bb.w * bb.h / 90; i++) {
      const x = bb.x0 + rr() * bb.w, y = bb.y0 + rr() * bb.h, s = 1.2 + rr() * 2.6 * (0.4 + (y - bb.y0) / bb.h);
      ctx.fillStyle = rr() < 0.5 ? 'rgba(255,255,255,.22)' : 'rgba(70,50,30,.16)';
      ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.5, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
    trace(ctx, pts); ctx.strokeStyle = 'rgba(60,45,25,.18)'; ctx.lineWidth = 1.5; ctx.stroke();
  };
  /* 一条阴影带（檐下、墙脚） */
  B.shade = function (g, pts, a) { if (g.lit) return; trace(g.ctx, pts); g.ctx.fillStyle = 'rgba(24,18,30,' + (a || 0.2) + ')'; g.ctx.fill(); };
  /* 一盏小灯：白天是个小灯罩，夜里亮 */
  B.lamp = function (g, x, y, s) {
    const ctx = g.ctx;
    if (g.lit) { K.circle(ctx, x, y, s * 0.7, '#fff0c0'); glowAt(g, x, y, s * 7); return; }
    ctx.fillStyle = '#2a2622'; ctx.fillRect(x - s * 0.9, y - s * 1.3, s * 1.8, s * 0.5); ctx.fillRect(x - s * 0.15, y - s * 2.2, s * 0.3, s);
    ctx.fillStyle = 'rgba(255,236,180,.75)'; ctx.fillRect(x - s * 0.7, y - s * 0.8, s * 1.4, s * 1.6);
    ctx.strokeStyle = '#2a2622'; ctx.lineWidth = 0.8; ctx.strokeRect(x - s * 0.7, y - s * 0.8, s * 1.4, s * 1.6);
  };

  /* ---------- 拼形状用的小工具 ---------- */
  /* 圆弧上的点（拼进多边形）：圆心 cx,cy，半径 r，从角 a0 到 a1，分 n 段 */
  B.arc = function (cx, cy, r, a0, a1, n) {
    const out = []; n = n || 10;
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  };
  /* 一道线脚（檐口、腰线）：从 (x0,y0) 到 (x1,y1)，竖向厚 th；上沿提亮，下面压一道影子 */
  B.band = function (g, x0, y0, x1, y1, th, color) {
    if (g.lit) return;
    const ctx = g.ctx;
    B.poly(g, [[x0, y0], [x1, y1], [x1, y1 + th], [x0, y0 + th]], color);
    trace(ctx, [[x0, y0], [x1, y1], [x1, y1 + 1], [x0, y0 + 1]]); ctx.fillStyle = 'rgba(255,255,255,.32)'; ctx.fill();
    trace(ctx, [[x0, y0 + th], [x1, y1 + th], [x1, y1 + th + 1.8], [x0, y0 + th + 1.8]]); ctx.fillStyle = 'rgba(40,26,10,.26)'; ctx.fill();
  };
  /* 檐下一排小盲拱（伦巴第带 / 拱廊饰带）：沿 (x0,y0)-(x1,y1) 排开，r 是小拱半径，leg 是小柱的长度 */
  B.arcade = function (g, x0, y0, x1, y1, r, color, leg) {
    if (g.lit) return;
    const ctx = g.ctx, len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / (r * 2.3)));
    for (let i = 0; i < n; i++) {
      const f = (i + 0.5) / n, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f + r;
      ctx.beginPath(); ctx.moveTo(x - r, y + (leg || r * 0.5)); ctx.lineTo(x - r, y); ctx.arc(x, y, r, Math.PI, 0); ctx.lineTo(x + r, y + (leg || r * 0.5)); ctx.closePath();
      ctx.fillStyle = 'rgba(46,32,18,.30)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - r, y + (leg || r * 0.5)); ctx.lineTo(x - r, y); ctx.arc(x, y, r, Math.PI, 0); ctx.lineTo(x + r, y + (leg || r * 0.5));
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(0.8, r * 0.34); ctx.stroke();
    }
  };
  /* 一个拱形的洞口（钟楼的钟洞）：里面是暗的，右侧露出一点洞壁 */
  B.opening = function (g, x, y, w, h, frame) {
    if (g.lit) return;
    const ctx = g.ctx, r = w / 2;
    const sh = () => { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r, y - h + r); ctx.arc(x, y - h + r, r, Math.PI, 0); ctx.lineTo(x + r, y); ctx.closePath(); };
    sh(); ctx.fillStyle = '#2b2522'; ctx.fill();
    ctx.save(); sh(); ctx.clip();
    ctx.fillStyle = 'rgba(255,236,200,.20)'; ctx.fillRect(x + r - Math.max(1.5, w * 0.14), y - h, w, h);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x - r, y - h, w, h * 0.2);
    ctx.restore();
    sh(); ctx.strokeStyle = frame || '#efe6d2'; ctx.lineWidth = Math.max(1, w * 0.09); ctx.stroke();
  };
  /* 圆窗：白天暗玻璃加十字棂，夜里亮 */
  B.oculus = function (g, x, y, r, frame) {
    const ctx = g.ctx;
    if (g.lit) {
      K.circle(ctx, x, y, r * 0.8, '#ffe2a0');
      ctx.strokeStyle = 'rgba(60,34,14,.75)'; ctx.lineWidth = Math.max(0.8, r * 0.12);
      ctx.beginPath(); ctx.moveTo(x - r * 0.8, y); ctx.lineTo(x + r * 0.8, y); ctx.moveTo(x, y - r * 0.8); ctx.lineTo(x, y + r * 0.8); ctx.stroke();
      glowAt(g, x, y, r * 2.6); return;
    }
    frame = frame || '#efe6d2';
    K.circle(ctx, x, y, r * 1.08, B.tone(frame, -0.16)); K.circle(ctx, x, y, r, frame); K.circle(ctx, x, y, r * 0.8, '#34465a');
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(x, y, r * 0.8, Math.PI * 0.9, Math.PI * 1.5); ctx.lineTo(x, y); ctx.fill();
    ctx.strokeStyle = frame; ctx.lineWidth = Math.max(0.8, r * 0.14);
    ctx.beginPath(); ctx.moveTo(x - r * 0.8, y); ctx.lineTo(x + r * 0.8, y); ctx.moveTo(x, y - r * 0.8); ctx.lineTo(x, y + r * 0.8); ctx.stroke();
  };
  /* 给一块已经画好的形状补一层左亮右暗（圆柱体：鼓座、柱子） */
  B.round = function (g, x0, y0, w, h, a) {
    if (g.lit) return;
    const ctx = g.ctx, gr = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    gr.addColorStop(0, 'rgba(60,60,90,' + (a || 0.16) * 0.5 + ')'); gr.addColorStop(0.28, 'rgba(255,255,255,.16)'); gr.addColorStop(0.55, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(40,40,70,' + (a || 0.16) * 1.7 + ')');
    ctx.fillStyle = gr; ctx.fillRect(x0, y0, w, h);
  };
  /* 在“设计坐标”里画：原点放在 (ox, oy)，按 s 缩放。设计坐标以门槛正中为原点，y 向上为负 */
  B.place = function (g, ox, oy, s, fn) { const ctx = g.ctx; ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s); fn(ctx); ctx.restore(); };
  /* 各教堂共用的取景：手机竖屏 375×690 时 s = 1 */
  B.unit = function (w, h) { return Math.min(w / 375, h / 690); };

  /* ---------- 缓存：白天一层，亮灯的窗一层 ---------- */
  const CACHE = {};
  B.layers = function (ctx, key, w, h, m, build) {
    const sc = (ctx.getTransform ? ctx.getTransform().a : 1) || 1, snow = m.season === 'winter';
    const sig = [Math.round(w), Math.round(h), sc, snow].join('|');
    let e = CACHE[key];
    if (!e || e.sig !== sig) {
      e = CACHE[key] = { sig, glows: [] };
      ['day', 'lit'].forEach(mode => {
        const cv = document.createElement('canvas');
        cv.width = Math.ceil(w * sc); cv.height = Math.ceil(h * sc);
        const c = cv.getContext('2d');
        c.setTransform(sc, 0, 0, sc, 0, 0);
        const g = { ctx: c, lit: mode === 'lit', snow, glows: [], sc, w, h };
        build(g, w, h);
        e[mode] = cv;
        if (g.lit) e.glows = g.glows;
      });
    }
    return e;
  };
  B.get = function (key) { return CACHE[key] || null; };
  B.blit = function (ctx, e, w, h) { ctx.drawImage(e.day, 0, 0, w, h); };
  /* 窗里的灯：天黑全亮，清晨和傍晚半亮，白天不亮 */
  B.litLevel = function (m) { return m.night ? 1 : (m.hour < 6.5 || m.hour > 18.4) ? 0.8 : 0; };
  B.glow = function (ctx, e, w, h, m, t) {
    const a = B.litLevel(m);
    if (!a || !e) return;
    ctx.save();
    ctx.globalAlpha = a; ctx.drawImage(e.lit, 0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const f = m.reduceMotion ? 1 : 0.94 + Math.sin((t || 0) * 2.2) * 0.06;
    e.glows.forEach(p => {
      const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * f);
      gr.addColorStop(0, 'rgba(255,196,120,.2)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * f, 0, TAU); ctx.fill();
    });
    ctx.restore();
  };
  /* 把登记的文案覆盖合并进当前传统的词典（在 Courtyard.boot 之前调用） */
  B.applyMsg = function (def) {
    const s2 = CourtyardScene2[def.id];
    if (!s2 || !s2.msg || !def.msg) return;
    Object.keys(s2.msg).forEach(lang => { if (def.msg[lang]) Object.assign(def.msg[lang], s2.msg[lang]); });
  };
  return B;
})(typeof CourtyardKit !== 'undefined' ? CourtyardKit : null);
