/*
 * 菩提静院的 Canvas 场景：只画画面，不管规则。界面（按钮、弹窗、文字）全部在 DOM 里。
 * 构图（从后到前）：天空与月相 → 远处的棕榈与稻田 → 布萨堂（โบสถ์，层叠屋顶、金色山墙、
 * 檐角风铃）→ 白塔（เจดีย์）→ 菩提树（缠着彩布、撑着木杆）→ 院子、叶堆、供桌 → 狗和猫 → 路上托钵的僧人 → 雨。
 * 坐标：模型里的位置用 0–1 的比例（x 按宽，y 按高），这里换算成像素。
 */
var Scene = (function () {
  'use strict';
  let cv = null;
  let ctx = null;
  let W = 360;
  let H = 560;
  let DPR = 1;

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* 固定的装饰：星星、菩提叶冠、棕榈、稻田。 */
  const R = rng(29);
  const stars = Array.from({ length: 70 }, () => ({ x: R(), y: R() * 0.42, r: 0.4 + R() * 1.1, p: R() * 6 }));
  const leaves = Array.from({ length: 460 }, () => {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(R());
    return { a, d, rot: R() * 6.28, s: 0.7 + R() * 0.6, tone: R(), sway: R() * 6 };
  });
  const palms = Array.from({ length: 7 }, (_, i) => ({ x: 0.04 + i * 0.16 + R() * 0.05, h: 0.07 + R() * 0.05, lean: (R() - 0.5) * 0.4 }));

  function init(canvas) {
    cv = canvas;
    ctx = cv.getContext('2d');
    resize();
  }

  function resize() {
    if (!cv) return;
    const r = cv.getBoundingClientRect ? cv.getBoundingClientRect() : { width: cv.width, height: cv.height };
    DPR = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    W = Math.max(280, r.width || 360);
    H = Math.max(360, r.height || 560);
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  function mix(c1, c2, t) {
    const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const a = p(c1);
    const b = p(c2);
    return 'rgb(' + a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',') + ')';
  }

  /* 一天里的天空：深夜 → 黎明橙 → 白天蓝 → 傍晚金 → 夜。 */
  function skyColors(h) {
    const keys = [
      [0, '#0d1424', '#1c2540'],
      [5, '#1a2140', '#4a3a5a'],
      [6, '#f0a76a', '#f7d9a8'],
      [8, '#7fb6e0', '#cfe6f2'],
      [12, '#5d9fd6', '#bfe0f0'],
      [16.5, '#79a8d2', '#e8dcb8'],
      [18, '#e48a4f', '#f3c98d'],
      [19.2, '#2a2c52', '#6b4a6a'],
      [21, '#0f1628', '#1e2744'],
      [24, '#0d1424', '#1c2540'],
    ];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (h >= a[0] && h <= b[0]) {
        const t = (h - a[0]) / (b[0] - a[0]);
        return [mix(a[1], b[1], t), mix(a[2], b[2], t)];
      }
    }
    return [keys[0][1], keys[0][2]];
  }

  function daylight(h) {
    if (h < 5.5 || h > 19.5) return 0;
    if (h < 7) return (h - 5.5) / 1.5;
    if (h > 18) return (19.5 - h) / 1.5;
    return 1;
  }

  /* ---------- 天空 ---------- */
  function drawSky(m, t) {
    const [top, bottom] = skyColors(m.hour);
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H * 0.5);
    const light = daylight(m.hour);
    if (light < 0.9) {
      ctx.fillStyle = '#fff';
      stars.forEach(s => {
        ctx.globalAlpha = (1 - light) * (0.45 + 0.4 * Math.sin(t * 1.3 + s.p) * (m.reduceMotion ? 0 : 1)) * (1 - m.rain * 0.8);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 7);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      drawMoon(W * 0.78, H * 0.1, Math.min(W, H) * 0.035, m.moonAge, 1 - light);
    }
    if (light > 0) {
      const sx = W * (0.1 + 0.8 * ((m.hour - 6) / 12.5));
      const sy = H * (0.42 - 0.3 * Math.sin(Math.PI * Math.max(0, Math.min(1, (m.hour - 6) / 12.5))));
      ctx.globalAlpha = light * (1 - m.rain * 0.8);
      const sg = ctx.createRadialGradient(sx, sy, 2, sx, sy, 60);
      sg.addColorStop(0, 'rgba(255,240,200,.95)');
      sg.addColorStop(0.2, 'rgba(255,220,150,.5)');
      sg.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, 60, 0, 7);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (m.rain > 0) {
      ctx.fillStyle = 'rgba(70,80,95,' + (m.rain * 0.45) + ')';
      ctx.fillRect(0, 0, W, H * 0.5);
    }
  }

  /* 月相：age 0 新月，≈14.8 满月。亮面用两段弧画出，北半球视角（右亮为上弦）。 */
  function drawMoon(x, y, r, age, alpha) {
    if (alpha <= 0.02) return;
    const phase = ((age % 29.53) + 29.53) % 29.53 / 29.53;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#2a3046';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#f4ecd2';
    const waxing = phase < 0.5;
    const k = Math.cos(phase * 2 * Math.PI);
    ctx.beginPath();
    if (waxing) {
      ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0);
    } else {
      ctx.arc(x, y, r, Math.PI / 2, -Math.PI / 2, false);
      ctx.ellipse(x, y, Math.abs(k) * r, r, 0, -Math.PI / 2, Math.PI / 2, k > 0);
    }
    ctx.fill();
    ctx.restore();
  }

  /* ---------- 远景：稻田与棕榈 ---------- */
  function drawFar(m) {
    const hy = H * 0.46;
    const light = daylight(m.hour);
    const seasonGreen = m.season === 'hot' ? '#a8a35e' : m.season === 'rain' ? '#6f9e4f' : '#93a960';
    ctx.fillStyle = mix('#1d2a26', seasonGreen, 0.25 + light * 0.75);
    ctx.fillRect(0, hy - 6, W, H * 0.08);
    palms.forEach(p => {
      const x = p.x * W;
      const top = hy - p.h * H;
      ctx.strokeStyle = mix('#0f1715', '#4f5a3a', light);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, hy);
      ctx.quadraticCurveTo(x + p.lean * 20, (hy + top) / 2, x + p.lean * 30, top);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * 0.55;
        ctx.save();
        ctx.translate(x + p.lean * 30, top);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(9, 0, 10, 2.2, 0.2, 0, 7);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  /* ---------- 布萨堂 ---------- */
  function hallBox() {
    const w = Math.min(W * 0.6, 320);
    const cx = W * 0.5;
    const base = H * 0.55;
    const wallH = w * 0.26;
    const wallTop = base - wallH - w * 0.05;
    return { w, cx, base, wallH, wallTop, roofH: w * 0.6 };
  }

  function tri(cx, baseY, half, h, fill, edge, edgeW) {
    ctx.beginPath();
    ctx.moveTo(cx - half, baseY);
    ctx.lineTo(cx, baseY - h);
    ctx.lineTo(cx + half, baseY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (edge) {
      ctx.strokeStyle = edge;
      ctx.lineWidth = edgeW || 3;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }

  function drawHall(m, t) {
    const b = hallBox();
    const light = daylight(m.hour);
    const dim = c => mix('#141824', c, 0.35 + light * 0.65);
    /* 台基与台阶 */
    ctx.fillStyle = dim('#eae4d8');
    ctx.fillRect(b.cx - b.w * 0.52, b.base - b.w * 0.05, b.w * 1.04, b.w * 0.05);
    ctx.fillStyle = dim('#d8d0c0');
    for (let i = 0; i < 3; i++) ctx.fillRect(b.cx - b.w * (0.12 + i * 0.02), b.base - b.w * 0.05 + i * (b.w * 0.05 / 3), b.w * (0.24 + i * 0.04), b.w * 0.05 / 3);
    /* 墙与柱 */
    ctx.fillStyle = dim('#f7f3ea');
    ctx.fillRect(b.cx - b.w * 0.45, b.wallTop, b.w * 0.9, b.wallH);
    for (let i = -2; i <= 2; i++) {
      const x = b.cx + i * b.w * 0.2;
      ctx.fillStyle = dim('#fbf8f2');
      ctx.fillRect(x - 4, b.wallTop, 8, b.wallH);
      ctx.fillStyle = dim('#d4a537');
      ctx.fillRect(x - 6, b.wallTop, 12, 6);
    }
    /* 三扇门：中间的门开着，能看见里面的佛像和烛光（不可点击）。 */
    const doorW = b.w * 0.11;
    const doorH = b.wallH * 0.72;
    const doorY = b.wallTop + b.wallH - doorH;
    [-1, 1].forEach(s => {
      const x = b.cx + s * b.w * 0.3 - doorW / 2;
      ctx.fillStyle = dim('#8c2a1e');
      ctx.fillRect(x, doorY, doorW, doorH);
      ctx.strokeStyle = dim('#d4a537');
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 2, doorY + 2, doorW - 4, doorH - 4);
    });
    const dx = b.cx - doorW * 0.65;
    ctx.fillStyle = '#1a120c';
    ctx.fillRect(dx, doorY - 4, doorW * 1.3, doorH + 4);
    const glow = 0.35 + (1 - light) * 0.5 + Math.sin(t * 2.1) * 0.04 * (m.reduceMotion ? 0 : 1);
    const gg = ctx.createRadialGradient(b.cx, doorY + doorH * 0.55, 1, b.cx, doorY + doorH * 0.55, doorW);
    gg.addColorStop(0, 'rgba(255,200,110,' + glow + ')');
    gg.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = gg;
    ctx.fillRect(dx, doorY - 4, doorW * 1.3, doorH + 4);
    /* 坐佛剪影：小而安静，放在暗处。 */
    const by = doorY + doorH * 0.86;
    const bs = doorW * 0.32;
    ctx.fillStyle = '#c99a3a';
    ctx.beginPath();
    ctx.ellipse(b.cx, by, bs * 1.05, bs * 0.32, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(b.cx - bs * 0.55, by - bs * 0.15);
    ctx.quadraticCurveTo(b.cx - bs * 0.6, by - bs * 1.15, b.cx, by - bs * 1.2);
    ctx.quadraticCurveTo(b.cx + bs * 0.6, by - bs * 1.15, b.cx + bs * 0.55, by - bs * 0.15);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.cx, by - bs * 1.45, bs * 0.28, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(b.cx - bs * 0.07, by - bs * 1.7);
    ctx.lineTo(b.cx, by - bs * 2.05);
    ctx.lineTo(b.cx + bs * 0.07, by - bs * 1.7);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,165,55,.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dx + 1, doorY - 3, doorW * 1.3 - 2, doorH + 2);

    /* 层叠屋顶：三层三角，从后往前，橙瓦绿边；最前面是金色山墙。 */
    const top = b.wallTop + 2;
    tri(b.cx, top + 10, b.w * 0.58, b.roofH * 0.62, dim('#b4462a'), dim('#2f6d4b'), 5);
    tri(b.cx, top + 4, b.w * 0.5, b.roofH * 0.82, dim('#c9572f'), dim('#2f6d4b'), 5);
    tri(b.cx, top, b.w * 0.4, b.roofH, dim('#8c2a1e'), null);
    /* 山墙（หน้าบัน）：红底金纹 */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(b.cx - b.w * 0.36, top - 2);
    ctx.lineTo(b.cx, top - b.roofH * 0.9);
    ctx.lineTo(b.cx + b.w * 0.36, top - 2);
    ctx.closePath();
    ctx.fillStyle = dim('#9b2f22');
    ctx.fill();
    ctx.clip();
    ctx.strokeStyle = dim('#e0b54a');
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(b.cx, top - b.roofH * 0.28, 8 + i * 9, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }
    ctx.fillStyle = dim('#e0b54a');
    ctx.beginPath();
    ctx.arc(b.cx, top - b.roofH * 0.3, 7, 0, 7);
    ctx.fill();
    ctx.restore();
    /* 博风板（ใบระกา）：沿两条斜边的金色锯齿 */
    const apex = { x: b.cx, y: top - b.roofH };
    [[-1], [1]].forEach(([s]) => {
      const x0 = b.cx + s * b.w * 0.41;
      const y0 = top + 1;
      ctx.strokeStyle = dim('#e0b54a');
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(apex.x, apex.y);
      ctx.stroke();
      const n = 12;
      ctx.fillStyle = dim('#e0b54a');
      for (let i = 1; i < n; i++) {
        const px = lerp(x0, apex.x, i / n);
        const py = lerp(y0, apex.y, i / n);
        ctx.beginPath();
        ctx.moveTo(px, py - 2);
        ctx.lineTo(px + s * 2, py - 9);
        ctx.lineTo(px - s * 3, py - 3);
        ctx.fill();
      }
      /* 檐角的卷尾（หางหงส์）与风铃 */
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(x0 + s * 12, y0 + 2, x0 + s * 10, y0 - 12);
      ctx.stroke();
      const sway = m.reduceMotion ? 0 : Math.sin(t * 1.7 + s) * 3 * (0.4 + m.wind);
      ctx.strokeStyle = dim('#8a7a50');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0 + s * 4, y0 + 2);
      ctx.lineTo(x0 + s * 4 + sway, y0 + 16);
      ctx.stroke();
      ctx.fillStyle = dim('#d4a537');
      ctx.beginPath();
      ctx.arc(x0 + s * 4 + sway, y0 + 18, 3, 0, 7);
      ctx.fill();
      ctx.fillRect(x0 + s * 4 + sway - 2.5, y0 + 21, 5, 5);
    });
    /* 屋脊顶端的鸱尾（ช่อฟ้า） */
    ctx.strokeStyle = dim('#e0b54a');
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(apex.x, apex.y + 2);
    ctx.quadraticCurveTo(apex.x - 2, apex.y - 16, apex.x + 9, apex.y - 20);
    ctx.stroke();
    ctx.lineCap = 'butt';
    /* 夜里门口的灯 */
    if (light < 0.6) {
      [-1, 1].forEach(s => {
        const lx = b.cx + s * b.w * 0.47;
        const ly = b.wallTop + 8;
        const lg = ctx.createRadialGradient(lx, ly, 1, lx, ly, 26);
        lg.addColorStop(0, 'rgba(255,214,140,' + (0.85 - light) + ')');
        lg.addColorStop(1, 'rgba(255,190,110,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(lx, ly, 26, 0, 7);
        ctx.fill();
      });
    }
  }

  /* ---------- 白塔 ---------- */
  function drawChedi(m) {
    const light = daylight(m.hour);
    const dim = c => mix('#141824', c, 0.35 + light * 0.65);
    const x = W * 0.87;
    const gy = H * 0.53;
    const s = Math.min(W, H) * 0.16;
    ctx.fillStyle = dim('#efeae0');
    ctx.fillRect(x - s * 0.42, gy - s * 0.12, s * 0.84, s * 0.12);
    ctx.fillRect(x - s * 0.34, gy - s * 0.22, s * 0.68, s * 0.1);
    ctx.fillRect(x - s * 0.27, gy - s * 0.3, s * 0.54, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(x - s * 0.3, gy - s * 0.3);
    ctx.bezierCurveTo(x - s * 0.32, gy - s * 0.62, x - s * 0.12, gy - s * 0.72, x, gy - s * 0.72);
    ctx.bezierCurveTo(x + s * 0.12, gy - s * 0.72, x + s * 0.32, gy - s * 0.62, x + s * 0.3, gy - s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - s * 0.1, gy - s * 0.82, s * 0.2, s * 0.1);
    ctx.fillStyle = dim('#d4a537');
    for (let i = 0; i < 7; i++) {
      const w = s * (0.08 - i * 0.009);
      ctx.fillRect(x - w, gy - s * (0.86 + i * 0.06), w * 2, s * 0.045);
    }
    ctx.beginPath();
    ctx.moveTo(x - 1.5, gy - s * 1.27);
    ctx.lineTo(x, gy - s * 1.5);
    ctx.lineTo(x + 1.5, gy - s * 1.27);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.06)';
    ctx.beginPath();
    ctx.moveTo(x + s * 0.05, gy - s * 0.3);
    ctx.bezierCurveTo(x + s * 0.2, gy - s * 0.6, x + s * 0.12, gy - s * 0.72, x, gy - s * 0.72);
    ctx.bezierCurveTo(x + s * 0.12, gy - s * 0.72, x + s * 0.32, gy - s * 0.62, x + s * 0.3, gy - s * 0.3);
    ctx.fill();
  }

  /* ---------- 菩提树 ---------- */
  function heart(x, y, s, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.9);
    ctx.bezierCurveTo(-s, s * 0.1, -s * 0.7, -s * 0.8, 0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.7, -s * 0.8, s, s * 0.1, 0, s * 0.9);
    ctx.lineTo(0, s * 1.6);
    ctx.fill();
    ctx.restore();
  }

  function treeBox() {
    return { x: W * 0.15, gy: H * 0.66, r: Math.min(W * 0.24, H * 0.2) };
  }

  function drawTree(m, t) {
    const light = daylight(m.hour);
    const dim = c => mix('#10161a', c, 0.3 + light * 0.7);
    const b = treeBox();
    const cy = b.gy - b.r * 1.55;
    /* 木杆（ไม้ค้ำโพธิ์） */
    ctx.strokeStyle = dim('#8a6a44');
    ctx.lineWidth = 3;
    [[-0.55, -0.9], [0.6, -0.8], [0.25, -1.1]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(b.x + dx * b.r * 1.05, b.gy);
      ctx.lineTo(b.x + dx * b.r * 0.55, b.gy + dy * b.r);
      ctx.stroke();
    });
    /* 树干 */
    ctx.fillStyle = dim('#6b5038');
    ctx.beginPath();
    ctx.moveTo(b.x - b.r * 0.16, b.gy);
    ctx.quadraticCurveTo(b.x - b.r * 0.04, b.gy - b.r * 0.8, b.x - b.r * 0.22, cy);
    ctx.lineTo(b.x + b.r * 0.2, cy);
    ctx.quadraticCurveTo(b.x + b.r * 0.06, b.gy - b.r * 0.8, b.x + b.r * 0.16, b.gy);
    ctx.fill();
    /* 缠在树干上的三色布 */
    ['#e7c23a', '#d65a8a', '#3d9a5c'].forEach((c, i) => {
      ctx.fillStyle = dim(c);
      ctx.fillRect(b.x - b.r * 0.12, b.gy - b.r * (0.42 + i * 0.09), b.r * 0.25, b.r * 0.07);
    });
    /* 树冠：几百片心形叶子 */
    const sway = m.reduceMotion ? 0 : (0.6 + m.wind) * 1.2;
    leaves.forEach(L => {
      const x = b.x + Math.cos(L.a) * L.d * b.r * 1.1;
      const y = cy + Math.sin(L.a) * L.d * b.r * 0.72 - b.r * 0.1;
      const base = m.season === 'hot' && L.tone > 0.7 ? '#b9a34a' : L.tone > 0.5 ? '#3f7d3c' : '#2e6633';
      ctx.fillStyle = dim(base);
      heart(x + Math.sin(t * 0.9 + L.sway) * sway, y, 5.2 * L.s, L.rot + Math.sin(t * 1.3 + L.sway) * 0.15 * sway);
    });
  }

  /* ---------- 院子 ---------- */
  function drawGround(m) {
    const light = daylight(m.hour);
    const dim = c => mix('#141820', c, 0.32 + light * 0.68);
    const hy = H * 0.52;
    ctx.fillStyle = dim(m.season === 'hot' ? '#b7ae78' : '#8fae6a');
    ctx.fillRect(0, hy, W, H - hy);
    ctx.fillStyle = dim('#e2d6bf');
    ctx.beginPath();
    ctx.moveTo(W * 0.2, hy + 4);
    ctx.lineTo(W * 0.8, hy + 4);
    ctx.lineTo(W * 1.02, H * 0.88);
    ctx.lineTo(-W * 0.02, H * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = dim('#cfc2a6');
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const y = lerp(hy + 4, H * 0.88, i / 6);
      ctx.beginPath();
      ctx.moveTo(lerp(W * 0.2, -W * 0.02, i / 6), y);
      ctx.lineTo(lerp(W * 0.8, W * 1.02, i / 6), y);
      ctx.stroke();
    }
    if (m.wet > 0) {
      ctx.fillStyle = 'rgba(80,100,120,' + (m.wet * 0.18) + ')';
      ctx.fillRect(0, hy, W, H - hy);
    }
    /* 路：清晨僧人托钵从这里走过 */
    ctx.fillStyle = dim('#a99470');
    ctx.fillRect(0, H * 0.88, W, H * 0.12);
    ctx.fillStyle = dim('#9a8462');
    ctx.fillRect(0, H * 0.88, W, 2);
  }

  /* 供桌：供过的花、烛、香会亮一阵。 */
  function drawAltar(m, t) {
    const b = hallBox();
    const x = b.cx + b.w * 0.36;
    const y = H * 0.63;
    const light = daylight(m.hour);
    const dim = c => mix('#141820', c, 0.35 + light * 0.65);
    ctx.fillStyle = dim('#8a4a2a');
    ctx.fillRect(x - 24, y, 48, 6);
    ctx.fillRect(x - 20, y + 6, 3, 14);
    ctx.fillRect(x + 17, y + 6, 3, 14);
    const o = m.offerings || {};
    ctx.fillStyle = dim('#c9b48a');
    ctx.fillRect(x - 6, y - 7, 12, 7);
    if (o.incense) {
      for (let i = -1; i <= 1; i++) {
        ctx.strokeStyle = dim('#a3412d');
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + i * 3, y - 6);
        ctx.lineTo(x + i * 4, y - 20);
        ctx.stroke();
        ctx.fillStyle = '#ff7a3c';
        ctx.fillRect(x + i * 4 - 1, y - 21, 2, 2);
        if (!m.reduceMotion) {
          ctx.strokeStyle = 'rgba(220,220,230,.35)';
          ctx.beginPath();
          ctx.moveTo(x + i * 4, y - 22);
          for (let k = 1; k < 6; k++) ctx.lineTo(x + i * 4 + Math.sin(t * 1.5 + k + i) * 3, y - 22 - k * 5);
          ctx.stroke();
        }
      }
    }
    if (o.candle) {
      ctx.fillStyle = dim('#f3e6c4');
      ctx.fillRect(x - 18, y - 12, 4, 12);
      const f = 1 + Math.sin(t * 9) * 0.12 * (m.reduceMotion ? 0 : 1);
      ctx.fillStyle = '#ffd36b';
      ctx.beginPath();
      ctx.ellipse(x - 16, y - 15, 2 * f, 4 * f, 0, 0, 7);
      ctx.fill();
      const cg = ctx.createRadialGradient(x - 16, y - 15, 1, x - 16, y - 15, 18);
      cg.addColorStop(0, 'rgba(255,210,120,.45)');
      cg.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(x - 16, y - 15, 18, 0, 7);
      ctx.fill();
    }
    if (o.flower) {
      const fx = x + 15;
      ctx.fillStyle = dim('#3d7a46');
      ctx.fillRect(fx - 1, y - 12, 2, 12);
      if (o.flower === 'lotus') {
        ctx.fillStyle = dim('#f0a3c0');
        ctx.beginPath();
        ctx.ellipse(fx, y - 16, 4, 6, 0, 0, 7);
        ctx.fill();
      } else if (o.flower === 'marigold') {
        ctx.fillStyle = dim('#f2a12b');
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(fx, y - 4 - i * 4, 3, 0, 7);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = dim('#fbfbf2');
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(fx + Math.cos(i * 0.8) * 5, y - 12 + Math.sin(i * 0.8) * 5, 1.8, 0, 7);
          ctx.fill();
        }
        ctx.fillStyle = dim('#d6453c');
        ctx.beginPath();
        ctx.arc(fx, y - 4, 2, 0, 7);
        ctx.fill();
      }
    }
  }

  function drawPiles(m) {
    const light = daylight(m.hour);
    (m.piles || []).forEach(p => {
      const x = p.x * W;
      const y = p.y * H;
      const s = p.n >= 2 ? 1 : 0.6;
      ctx.fillStyle = 'rgba(0,0,0,.12)';
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 18 * s, 5 * s, 0, 0, 7);
      ctx.fill();
      const Rr = rng(p.id * 13 + 7);
      for (let i = 0; i < 14 * s; i++) {
        ctx.fillStyle = mix('#151a14', ['#8a6a2c', '#a8873b', '#6e7a34', '#b39a52'][Math.floor(Rr() * 4)], 0.35 + light * 0.65);
        heart(x + (Rr() - 0.5) * 30 * s, y - Rr() * 9 * s, 3.4, Rr() * 6);
      }
      if (m.highlightPiles) {
        ctx.strokeStyle = 'rgba(255,240,200,.85)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, 24 * s, 12 * s, 0, 0, 7);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }

  /* ---------- 狗和猫 ---------- */
  const COATS = {
    brown: ['#b07a46', '#7a5230'], black: ['#2e2a28', '#171412'], white: ['#efe7da', '#b7a994'],
    orange: ['#e09a4a', '#b0662a'], tabby: ['#9a8b72', '#5a4e3c'], calico: ['#f2ece2', '#d07a35'],
  };

  function drawAnimal(a, m, t) {
    const x = a.x * W;
    const y = a.y * H;
    const c = COATS[a.coat] || COATS.brown;
    const light = daylight(m.hour);
    const col = k => mix('#141820', k, 0.35 + light * 0.65);
    const dir = a.dir || 1;
    const bob = a.state === 'walk' && !m.reduceMotion ? Math.abs(Math.sin(t * 8 + a.id)) * 1.5 : 0;
    const sz = a.kind === 'dog' ? 1 : 0.78;
    ctx.save();
    ctx.translate(x, y - bob);
    ctx.scale(dir * sz, sz);
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.ellipse(0, 2 + bob, 16, 4, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = col(c[0]);
    if (a.state === 'sit') {
      ctx.beginPath();
      ctx.ellipse(-2, -9, 9, 10, -0.3, 0, 7);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, -9, 14, 7, 0, 0, 7);
      ctx.fill();
      ctx.fillRect(-11, -6, 3, 8);
      ctx.fillRect(8, -6, 3, 8);
      if (a.injured && !a.treated) ctx.fillRect(-5, -6, 3, 5);
      else ctx.fillRect(-5, -6, 3, 8);
      ctx.fillRect(3, -6, 3, 8);
    }
    /* 尾巴 */
    ctx.strokeStyle = col(c[1]);
    ctx.lineWidth = a.kind === 'dog' ? 3 : 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-13, -10);
    const wag = a.happy > 0 && !m.reduceMotion ? Math.sin(t * 14) * 5 : 0;
    if (a.kind === 'cat') ctx.quadraticCurveTo(-22, -16, -18 + wag * 0.3, -28);
    else ctx.quadraticCurveTo(-20, -14 + wag, -21, -20 + wag);
    ctx.stroke();
    /* 头 */
    const hx = a.state === 'sit' ? 4 : 13;
    const hy = a.state === 'sit' ? -20 : -15;
    ctx.fillStyle = col(c[0]);
    ctx.beginPath();
    ctx.arc(hx, hy, a.kind === 'dog' ? 6.5 : 6, 0, 7);
    ctx.fill();
    if (a.kind === 'dog') {
      ctx.beginPath();
      ctx.ellipse(hx + 5, hy + 2, 4, 3, 0, 0, 7);
      ctx.fill();
      ctx.fillStyle = col(c[1]);
      ctx.beginPath();
      ctx.ellipse(hx - 3, hy - 3, 2.5, 5, 0.5, 0, 7);
      ctx.fill();
    } else {
      ctx.fillStyle = col(c[1]);
      ctx.beginPath();
      ctx.moveTo(hx - 5, hy - 3); ctx.lineTo(hx - 3, hy - 10); ctx.lineTo(hx, hy - 5);
      ctx.moveTo(hx + 1, hy - 5); ctx.lineTo(hx + 4, hy - 10); ctx.lineTo(hx + 5, hy - 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1a1410';
    ctx.beginPath();
    ctx.arc(hx + 2.5, hy - 1, 1.1, 0, 7);
    ctx.fill();
    if (a.injured && !a.treated) {
      ctx.fillStyle = '#c23b2e';
      ctx.fillRect(-4, -12, 4, 2);
    } else if (a.treated && a.injured) {
      ctx.fillStyle = '#f4f1ea';
      ctx.fillRect(-5, -4, 4, 3);
    }
    ctx.restore();
    if (a.happy > 0) {
      ctx.fillStyle = 'rgba(214,69,90,' + Math.min(1, a.happy) + ')';
      heartIcon(x + 4, y - 34 * sz - (1 - a.happy) * 10, 4);
    }
    if (a.hunger < 30) {
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath();
      ctx.arc(x + 12, y - 36 * sz, 7, 0, 7);
      ctx.fill();
      ctx.fillStyle = '#8a6a2c';
      ctx.beginPath();
      ctx.ellipse(x + 12, y - 35 * sz, 4, 2, 0, 0, 7);
      ctx.fill();
    }
  }

  function heartIcon(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s);
    ctx.bezierCurveTo(x - s * 1.6, y - s * 0.2, x - s * 0.6, y - s * 1.4, x, y - s * 0.4);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 1.4, x + s * 1.6, y - s * 0.2, x, y + s);
    ctx.fill();
  }

  /* ---------- 僧人 ---------- */
  function drawMonk(p, m, t) {
    const x = p.x * W;
    const y = H * 0.955;
    const light = daylight(m.hour);
    const col = k => mix('#141820', k, 0.4 + light * 0.6);
    const step = m.reduceMotion ? 0 : Math.sin(t * 5 + p.id) * (p.stopped ? 0 : 1);
    const s = Math.min(1.15, H / 560);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.beginPath();
    ctx.ellipse(0, 1, 11, 3, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = col('#7a5a40');
    ctx.fillRect(-5 + step * 2, -5, 3, 5);
    ctx.fillRect(2 - step * 2, -5, 3, 5);
    /* 袈裟：托钵时披着，双肩都盖住 */
    ctx.fillStyle = col('#d4802e');
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(-11, -30);
    ctx.quadraticCurveTo(0, -42, 11, -30);
    ctx.lineTo(9, -4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = col('#b0631f');
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-9 + i * 3, -32 + i * 2);
      ctx.lineTo(4 + i * 2, -6);
      ctx.stroke();
    }
    /* 钵 */
    ctx.fillStyle = col('#24221f');
    ctx.beginPath();
    ctx.ellipse(0, -18, 7, 6, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = col('#4a4640');
    ctx.fillRect(-7, -22, 14, 2);
    /* 头 */
    ctx.fillStyle = col('#c79a74');
    ctx.beginPath();
    ctx.arc(0, -42, 5.5, 0, 7);
    ctx.fill();
    ctx.restore();
  }

  function drawRain(m, t) {
    if (m.rain <= 0) return;
    const n = Math.round(80 * m.rain);
    ctx.strokeStyle = 'rgba(200,215,230,.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const sx = ((i * 97.13 + t * 220 * (m.reduceMotion ? 0.2 : 1)) % (W + 40)) - 20;
      const sy = ((i * 53.7 + t * 520 * (m.reduceMotion ? 0.2 : 1)) % (H + 30)) - 15;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 3, sy + 10);
    }
    ctx.stroke();
  }

  function draw(m, t) {
    if (!ctx) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawSky(m, t);
    drawFar(m);
    drawGround(m);
    drawChedi(m);
    drawHall(m, t);
    drawAltar(m, t);
    drawTree(m, t);
    drawPiles(m);
    (m.animals || []).slice().sort((a, b) => a.y - b.y).forEach(a => drawAnimal(a, m, t));
    (m.monks || []).forEach(p => drawMonk(p, m, t));
    drawRain(m, t);
    const dark = 1 - daylight(m.hour);
    if (dark > 0) {
      ctx.fillStyle = 'rgba(10,14,30,' + (dark * 0.28) + ')';
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* 点到了什么：叶堆或动物（比例坐标里按像素距离判断）。 */
  function hit(px, py, m) {
    let best = null;
    let bd = 34;
    (m.animals || []).forEach(a => {
      const d = Math.hypot(a.x * W - px, a.y * H - 12 - py);
      if (d < bd) { bd = d; best = { type: 'animal', id: a.id }; }
    });
    (m.piles || []).forEach(p => {
      const d = Math.hypot(p.x * W - px, p.y * H - 4 - py);
      if (d < bd) { bd = d; best = { type: 'pile', id: p.id }; }
    });
    return best;
  }

  return { init, resize, draw, hit, size: () => ({ W, H }) };
})();
