/*
 * 庭院 v2 场景润色（不改 kit.js，只在加载后包一层）：
 * 云层、太阳光晕、星星闪烁；远山空气透视；地面质感与阴影；树、人、动物的明暗；
 * 按时辰调色（清晨偏粉、傍晚偏金、夜里偏蓝）和画面暗角。各传统的 scene() 不用改就能用上。
 */
(function (K) {
  'use strict';
  if (!K || K.v2) return;
  K.v2 = true;
  const TAU = Math.PI * 2;
  const orig = { sky: K.sky, mountains: K.mountains, hills: K.hills, ground: K.ground, tree: K.tree, person: K.person, animal: K.animal, dim: K.dim, glow: K.glow, pile: K.pile };

  /* 地面纹理：一块小噪声图，按 pattern 平铺 */
  let noise = null;
  function noisePattern(ctx) {
    if (noise) return ctx.createPattern(noise, 'repeat');
    noise = document.createElement('canvas'); noise.width = noise.height = 96;
    const c = noise.getContext('2d'), d = c.createImageData(96, 96), r = K.rng(91);
    for (let i = 0; i < d.data.length; i += 4) { const v = r(); d.data[i] = d.data[i + 1] = d.data[i + 2] = v < 0.5 ? 0 : 255; d.data[i + 3] = Math.floor(Math.abs(v - 0.5) * 34); }
    c.putImageData(d, 0, 0);
    return ctx.createPattern(noise, 'repeat');
  }
  function rgba(hex, a) {
    const p = (hex.replace('#', '').match(/\w\w/g) || ['80', '80', '80']).map(v => parseInt(v, 16));
    return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')';
  }
  K.shadow = function (ctx, x, y, rx, ry, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, 'rgba(0,0,0,' + (a || 0.22) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, TAU); ctx.fill(); ctx.restore();
  };

  K.sky = function (ctx, w, h, m, horizon) {
    orig.sky(ctx, w, h, m, horizon);
    const t = m.t || 0;
    /* 地平线附近的光 */
    const warm = m.hour > 5 && m.hour < 8 ? 1 - Math.abs(m.hour - 6.5) / 1.5 : m.hour > 17 && m.hour < 20 ? 1 - Math.abs(m.hour - 18.5) / 1.5 : 0;
    if (warm > 0) {
      const g = ctx.createLinearGradient(0, horizon * 0.4, 0, horizon);
      g.addColorStop(0, 'rgba(255,170,110,0)'); g.addColorStop(1, 'rgba(255,170,110,' + (0.35 * warm) + ')');
      ctx.fillStyle = g; ctx.fillRect(0, horizon * 0.4, w, horizon * 0.6);
    }
    /* 太阳光晕 */
    const dayT = (m.hour - 6) / 13;
    if (dayT > 0 && dayT < 1 && !m.night && m.rain < 0.4) {
      const sx = w * (0.1 + dayT * 0.8), sy = horizon * (0.85 - Math.sin(dayT * Math.PI) * 0.7);
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.35);
      g.addColorStop(0, 'rgba(255,240,200,.45)'); g.addColorStop(0.2, 'rgba(255,230,180,.15)'); g.addColorStop(1, 'rgba(255,230,180,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, horizon);
    }
    /* 星星闪烁 */
    if (m.night && !m.reduceMotion) {
      const r = K.rng(23);
      for (let i = 0; i < 18; i++) {
        const x = r() * w, y = r() * horizon * 0.7, a = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.6 + r()) + i));
        ctx.fillStyle = 'rgba(255,255,240,' + a.toFixed(2) + ')'; ctx.fillRect(x, y, 1.4, 1.4);
      }
    }
    /* 云：两层，慢慢飘 */
    const night = m.night ? 0.35 : 1;
    const cloudCol = m.rain > 0.3 ? [150, 156, 166] : warm > 0.3 ? [255, 214, 190] : [255, 255, 255];
    const n = m.rain > 0.3 ? 7 : 4;
    for (let layer = 0; layer < 2; layer++) {
      const r = K.rng(41 + layer * 7);
      for (let i = 0; i < n; i++) {
        const sp = (layer ? 3.2 : 1.6) * (m.reduceMotion ? 0 : 1);
        const cw = w * (0.22 + r() * 0.2) * (layer ? 1 : 0.7);
        const x = ((r() * (w + cw) + t * sp) % (w + cw * 2)) - cw;
        const y = horizon * (0.12 + r() * 0.42) + layer * horizon * 0.08;
        const a = (layer ? 0.55 : 0.32) * night * (m.rain > 0.3 ? 1.3 : 1);
        for (let k = 0; k < 5; k++) {
          const cx = x + (k - 2) * cw * 0.18, cy = y + Math.sin(k * 1.7 + i) * cw * 0.04, rr = cw * (0.16 + (k === 2 ? 0.08 : 0) + r() * 0.05);
          const g = ctx.createRadialGradient(cx, cy - rr * 0.3, rr * 0.1, cx, cy, rr);
          g.addColorStop(0, 'rgba(' + cloudCol.join(',') + ',' + a + ')'); g.addColorStop(1, 'rgba(' + cloudCol.join(',') + ',0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, rr * 1.4, rr * 0.75, 0, 0, TAU); ctx.fill();
        }
      }
    }
  };

  /* 远山：山脚加一层薄雾（空气透视） */
  K.mountains = function (ctx, w, y, color, amp, seed, snow) {
    orig.mountains(ctx, w, y, color, amp, seed, snow);
    const h2 = ctx.createLinearGradient(0, y - amp * 0.45, 0, y + 2);
    h2.addColorStop(0, 'rgba(225,232,238,0)'); h2.addColorStop(1, 'rgba(225,232,238,.3)');
    ctx.fillStyle = h2; ctx.fillRect(0, y - amp * 0.45, w, amp * 0.45 + 2);
  };
  K.hills = function (ctx, w, y, color, amp, seed) {
    orig.hills(ctx, w, y, color, amp, seed);
    const h2 = ctx.createLinearGradient(0, y - amp, 0, y + 4);
    h2.addColorStop(0, 'rgba(255,255,255,.12)'); h2.addColorStop(1, 'rgba(0,0,0,.08)');
    ctx.fillStyle = h2; ctx.fillRect(0, y - amp, w, amp + 4);
  };
  K.ground = function (ctx, w, h, y, c1, c2) {
    orig.ground(ctx, w, h, y, c1, c2);
    ctx.save();
    ctx.fillStyle = noisePattern(ctx); ctx.globalAlpha = 0.9; ctx.fillRect(0, y, w, h - y);
    const g = ctx.createLinearGradient(0, y, 0, y + (h - y) * 0.25);
    g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, y, w, (h - y) * 0.25);
    ctx.restore();
  };

  /* 离屏图层：先把物体画到小画布上，再只在物体本身上加明暗，最后贴回 */
  let off = null;
  function layer(ctx, w, h) {
    const sc = (ctx.getTransform ? ctx.getTransform().a : 1) || 1;
    if (!off) off = document.createElement('canvas');
    const W = Math.ceil(w * sc), H = Math.ceil(h * sc);
    if (off.width < W) off.width = W;
    if (off.height < H) off.height = H;
    const c = off.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, off.width, off.height); c.setTransform(sc, 0, 0, sc, 0, 0);
    return { c, sc };
  }
  /* 树：投影、树冠受光面与背光面 */
  K.tree = function (ctx, x, y, s, kind, m, t) {
    K.shadow(ctx, x + s * 0.12, y, s * 0.42, s * 0.08, 0.2);
    if (kind === 'palm' || kind === 'bamboo' || !ctx.getTransform) { orig.tree(ctx, x, y, s, kind, m, t); return; }
    const ox = x - s * 0.75, oy = y - s * 1.45, L = layer(ctx, s * 1.5, s * 1.5);
    orig.tree(L.c, x - ox, y - oy, s, kind, m, t);
    L.c.globalCompositeOperation = 'source-atop';
    const g = L.c.createLinearGradient(0, 0, s * 1.5, s * 1.45);
    g.addColorStop(0, 'rgba(255,250,210,.28)'); g.addColorStop(0.45, 'rgba(255,250,210,0)'); g.addColorStop(1, 'rgba(0,25,12,.32)');
    L.c.fillStyle = g; L.c.fillRect(0, 0, s * 1.5, s * 1.5);
    L.c.globalCompositeOperation = 'source-over';
    ctx.drawImage(off, 0, 0, Math.ceil(s * 1.5 * L.sc), Math.ceil(s * 1.5 * L.sc), ox, oy, Math.ceil(s * 1.5 * L.sc) / L.sc, Math.ceil(s * 1.5 * L.sc) / L.sc);
  };
  K.person = function (ctx, x, y, s, o, t) {
    K.shadow(ctx, x, y, s * 0.24, s * 0.06, 0.25);
    orig.person(ctx, x, y, s, o, t);
  };
  K.animal = function (ctx, a, w, h, t, m) {
    orig.animal(ctx, a, w, h, t, m);
    /* 眼睛：一个小亮点，让动物有神 */
    const x = a.x * w, y = a.y * h, s = Math.min(w, h) * (a.kind === 'cow' ? 0.12 : a.kind === 'bird' ? 0.045 : a.kind === 'dog' ? 0.08 : 0.07);
    const d = a.dir || 1;
    const ex = a.kind === 'dog' ? 0.47 : a.kind === 'cat' ? 0.35 : a.kind === 'cow' ? 0.5 : 0.4;
    const ey = a.kind === 'dog' ? -0.7 : a.kind === 'cat' ? -0.53 : a.kind === 'cow' ? -0.64 : -0.75;
    const blink = m && !m.reduceMotion && Math.sin((t || 0) * 0.9 + a.id * 3) > 0.985;
    ctx.fillStyle = '#1b1612';
    if (blink) ctx.fillRect(x + d * s * ex - s * 0.03, y + s * ey, s * 0.06, s * 0.012);
    else { ctx.beginPath(); ctx.arc(x + d * s * ex, y + s * ey, Math.max(1, s * 0.03), 0, TAU); ctx.fill(); }
  };

  /* 时辰调色 + 暗角 */
  K.dim = function (ctx, w, h, m) {
    orig.dim(ctx, w, h, m);
    const hr = m.hour;
    let tint = null;
    if (hr >= 5 && hr < 7.5) tint = 'rgba(255,170,190,' + (0.1 * (1 - Math.abs(hr - 6.2) / 1.3)) + ')';
    else if (hr >= 16.5 && hr < 19.5) tint = 'rgba(255,170,80,' + (0.14 * (1 - Math.abs(hr - 18) / 1.5)) + ')';
    else if (m.night) tint = 'rgba(40,60,140,.12)';
    if (tint) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = tint.replace(/[\d.]+\)$/, v => Math.min(0.6, parseFloat(v) * 3) + ')'); ctx.fillRect(0, 0, w, h); ctx.restore(); }
    const vg = ctx.createRadialGradient(w / 2, h * 0.55, Math.min(w, h) * 0.35, w / 2, h * 0.55, Math.max(w, h) * 0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,' + (m.night ? 0.45 : 0.22) + ')');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  };
  K.glow = function (ctx, x, y, r, color, t) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; orig.glow(ctx, x, y, r, color, t); ctx.restore();
  };

  /* 建筑通用的光影：给各包画好的主建筑加一层从左上来的受光与右下阴影（scene.back 画完后由 ui 调用） */
  K.light = function (ctx, w, h, m, horizon) {
    if (m.night) return;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255,248,220,.10)'); g.addColorStop(0.55, 'rgba(255,248,220,0)'); g.addColorStop(1, 'rgba(0,10,30,.10)');
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.restore();
  };
})(typeof CourtyardKit !== 'undefined' ? CourtyardKit : null);
