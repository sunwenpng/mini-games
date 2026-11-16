/*
 * 殿内的法器互动（v3 新增；只在 play2.html 加载，叠在殿内视图上，照片和动画两种画法都能用）。
 * 每个版本按自己的传统放不同的东西：
 *   藏传：手摇转经筒（往左拨让它顺时针转，点一下让它一直转；每转一圈算念诵一遍筒里的经文）
 *   日本、道教：木鱼、磬（鏧）、钟（拉开撞木再松手）
 *   天主教：圣水盆（蘸圣水、画十字）和洒圣水器（挥动洒水）
 *   东正教：手提香炉（拖动摇摆，链上的小铃会响，冒烟）
 * 声音全部用 Web Audio 现场合成，不另外下载文件。
 * 用法（由 hallview.js 调用）：HallRite.has(id) / open(V) / frame(ctx, W, H, t, dt, V, calm) / pointer(type, x, y, V) / busy(V) / close(V)
 */
var HallRite = (function () {
  'use strict';
  const TAU = Math.PI * 2;
  const KITS = {
    'buddhism.tibetan': ['wheel'],
    'buddhism.japan': ['bell', 'muyu', 'qing'],
    'daoism.mountain': ['bell', 'muyu', 'qing'],
    'christianity.catholic': ['font', 'sprinkle'],
    'christianity.orthodox': ['censer'],
  };
  const WORDS = {
    'zh-CN': {
      wheel: '转经筒', wheelN: '转了 {n} 圈', wheelTip: '往左拨经筒，让它顺时针转；点一下，它会一直转', wheelWrong: '转经筒要顺时针转：往左拨', wheelAuto: '一直转', wheelDone: '转满 108 圈',
      muyu: '木鱼', qing: '磬', bell: '钟', percTip: '点木鱼、点磬；按住钟往左一拉再松手，撞木就撞上去', japanQing: '鏧（磬）', japanBell: '梵钟',
      font: '圣水盆', fontTip: '点圣水盆蘸一点圣水，再按“额、胸、左肩、右肩”画十字', crossTip: '画十字：额 → 胸 → 左肩 → 右肩', crossDone: '因父、及子、及圣神之名。阿们。',
      forehead: '额', chest: '胸', lsh: '左肩', rsh: '右肩',
      sprinkle: '洒圣水', sprinkleTip: '按住洒水器挥一下，圣水就洒出去了',
      censer: '香炉', censerTip: '拖动香炉左右摇，链上的小铃会响（礼仪中由神父摇香炉）',
      count: '{name} {n}',
    },
    'zh-TW': {
      wheel: '轉經筒', wheelN: '轉了 {n} 圈', wheelTip: '往左撥經筒，讓它順時針轉；點一下，它會一直轉', wheelWrong: '轉經筒要順時針轉：往左撥', wheelAuto: '一直轉', wheelDone: '轉滿 108 圈',
      muyu: '木魚', qing: '磬', bell: '鐘', percTip: '點木魚、點磬；按住鐘往左一拉再鬆手，撞木就撞上去', japanQing: '鏧（磬）', japanBell: '梵鐘',
      font: '聖水盆', fontTip: '點聖水盆蘸一點聖水，再按「額、胸、左肩、右肩」畫十字', crossTip: '畫十字：額 → 胸 → 左肩 → 右肩', crossDone: '因父、及子、及聖神之名。阿們。',
      forehead: '額', chest: '胸', lsh: '左肩', rsh: '右肩',
      sprinkle: '灑聖水', sprinkleTip: '按住灑水器揮一下，聖水就灑出去了',
      censer: '香爐', censerTip: '拖動香爐左右搖，鏈上的小鈴會響（禮儀中由神父搖香爐）',
      count: '{name} {n}',
    },
    en: {
      wheel: 'Prayer wheel', wheelN: '{n} turns', wheelTip: 'Flick the drum to the left so it turns clockwise; tap it to keep it turning', wheelWrong: 'A prayer wheel turns clockwise: flick it to the left', wheelAuto: 'Turning', wheelDone: '108 turns',
      muyu: 'Wooden fish', qing: 'Singing bowl', bell: 'Bell', percTip: 'Tap the wooden fish and the bowl; press the bell, pull left and let go to swing the log into it', japanQing: 'Rin bowl', japanBell: 'Temple bell',
      font: 'Holy water', fontTip: 'Tap the font to dip your fingers, then cross yourself: forehead, chest, left shoulder, right shoulder', crossTip: 'Forehead → chest → left shoulder → right shoulder', crossDone: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      forehead: 'Forehead', chest: 'Chest', lsh: 'Left', rsh: 'Right',
      sprinkle: 'Sprinkle', sprinkleTip: 'Hold the sprinkler and flick it to sprinkle holy water',
      censer: 'Censer', censerTip: 'Drag the censer to swing it; the little bells ring (in the liturgy the priest censes)',
      count: '{name} {n}',
    },
  };
  const FIRST_TIP = {};
  function has(id) { return !!KITS[id]; }

  /* ---------- 声音 ---------- */
  let AC = null, OUT = null;
  function ac() {
    if (!AC) {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; }
      if (AC) { OUT = AC.createDynamicsCompressor(); OUT.threshold.value = -14; OUT.connect(AC.destination); }
    }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function soundOn(V) { const o = V && V.opts; return !(o && typeof o.sound === 'function' && !o.sound()); }
  /* 一个分音：频率 f，起音后指数衰减；det 不为 0 时再叠一个略微走调的，拍出颤音 */
  function partial(a, f, gain, dur, type, det, t0, glide) {
    const now = (t0 || a.currentTime);
    [0, det || 0].forEach((d, i) => {
      if (i && !det) return;
      const o = a.createOscillator(), g = a.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f + d, now);
      if (glide) o.frequency.exponentialRampToValueAtTime(glide, now + 0.06);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gain, now + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); g.connect(OUT); o.start(now); o.stop(now + dur + 0.05);
    });
  }
  function noise(a, dur, gain, freq, q) {
    const len = Math.max(1, Math.floor(a.sampleRate * dur)), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1.2; g.gain.value = gain;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(OUT); s.start();
  }
  const SND = {
    /* 木鱼：空心木头“笃”，音高很快往下掉 */
    muyu(V, s) { const a = ac(); if (!a || !soundOn(V)) return; partial(a, 760, 0.5 * s, 0.16, 'sine', 0, 0, 470); partial(a, 1240, 0.12 * s, 0.06); noise(a, 0.03, 0.5 * s, 2400, 2); },
    /* 磬：几组不成谐波的分音，各自带一点颤音，余音很长 */
    qing(V, s) { const a = ac(); if (!a || !soundOn(V)) return; [[587, 0.22, 7, 1.3], [1597, 0.12, 5.5, 2.1], [2950, 0.06, 3.5, 2.8], [4400, 0.03, 2, 0]].forEach(p => partial(a, p[0], p[1] * s, p[2], 'sine', p[3])); noise(a, 0.02, 0.25 * s, 5000, 3); },
    /* 大钟：低沉、很长，带嗡嗡的拍音 */
    bell(V, s) { const a = ac(); if (!a || !soundOn(V)) return; [[73, 0.32, 11, 0.6], [146, 0.2, 9, 0.9], [196, 0.14, 7, 1.1], [262, 0.1, 5.5, 1.6], [347, 0.06, 4, 0], [512, 0.03, 2.5, 0]].forEach(p => partial(a, p[0], p[1] * s, p[2], 'sine', p[3])); noise(a, 0.08, 0.35 * s, 500, 0.8); },
    /* 转经筒转满一圈：极轻的一声 */
    tick(V) { const a = ac(); if (!a || !soundOn(V)) return; partial(a, 2637, 0.025, 0.6, 'sine', 3); },
    chime(V) { const a = ac(); if (!a || !soundOn(V)) return; [1318, 1760, 2093, 2637].forEach((f, i) => partial(a, f, 0.07, 2.4, 'sine', 2, a.currentTime + i * 0.09)); },
    /* 水：一小阵沙沙声 + 两三声水滴 */
    splash(V, s) { const a = ac(); if (!a || !soundOn(V)) return; noise(a, 0.35, 0.22 * s, 3200, 0.7); for (let i = 0; i < 3; i++) partial(a, 1700 + Math.random() * 1600, 0.04 * s, 0.12, 'sine', 0, a.currentTime + 0.05 + i * 0.07, 900 + Math.random() * 600); },
    dip(V) { const a = ac(); if (!a || !soundOn(V)) return; partial(a, 1200, 0.06, 0.18, 'sine', 0, 0, 600); noise(a, 0.18, 0.12, 2200, 1); },
    /* 香炉链上的小铃 */
    jingle(V, s) { const a = ac(); if (!a || !soundOn(V)) return; for (let i = 0; i < 5; i++) partial(a, 3100 + Math.random() * 1400, 0.03 * s, 0.5, 'sine', 4, a.currentTime + Math.random() * 0.08); },
  };

  /* ---------- 画图小工具 ---------- */
  function circ(c, x, y, r, f) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, TAU); c.fillStyle = f; c.fill(); }
  function ell(c, x, y, rx, ry, f) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); c.fillStyle = f; c.fill(); }
  function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function glow(c, x, y, r, col) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  function label(c, x, y, text, a) {
    if (!text) return;
    c.save(); c.font = '600 12px "Noto Sans SC","PingFang SC",system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const w = c.measureText(text).width + 14;
    c.globalAlpha = a == null ? 1 : a;
    c.fillStyle = 'rgba(20,12,8,.62)'; rr(c, x - w / 2, y - 10, w, 20, 10); c.fill();
    c.fillStyle = '#f6e6c4'; c.fillText(text, x, y + 0.5);
    c.restore();
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fmt(s, p) { return String(s).replace(/\{(\w+)\}/g, (m, k) => (p && p[k] != null ? p[k] : m)); }
  let PUFF = null;
  function puff() {
    if (PUFF) return PUFF;
    PUFF = document.createElement('canvas'); PUFF.width = PUFF.height = 64;
    const c = PUFF.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(230,226,218,1)'); g.addColorStop(1, 'rgba(230,226,218,0)');
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
    return PUFF;
  }

  /* ================= 法器 ================= */
  const MAKE = {};

  /* ---------- 转经筒 ---------- */
  MAKE.wheel = function (R) {
    const M = ['ཨོཾ', 'མ', 'ཎི', 'པདྨེ', 'ཧཱུྃ'];
    const it = { id: 'wheel', ang: 0, vel: 0, acc: 0, n: 0, auto: false, wob: 0, drag: null };
    it.layout = function (W, H, bot) { it.r = Math.max(30, Math.min(W * 0.115, 54)); it.h = it.r * 1.5; it.x = W * 0.74; it.y = bot - it.r * 3.0; it.W = W; it.H = H; };
    it.hit = (x, y) => Math.abs(x - it.x) < it.r * 1.6 && y > it.y - it.h && y < it.y + it.h * 1.2;
    it.down = (x, y, t) => { it.drag = { x, y, t, t0: t, x0: x, y0: y, moved: 0 }; };
    it.move = (x, y, t) => {
      const d = it.drag; if (!d) return;
      const dt = Math.max(0.008, t - d.t), dx = x - d.x;
      d.moved += Math.abs(dx) + Math.abs(y - d.y);
      const v = -dx / dt / it.r;                    /* 往左拨 = 正方向（从上往下看顺时针） */
      if (v < -0.5) { it.vel = Math.max(0, it.vel * 0.85); if (!it.warned) { R.tip(R.w.wheelWrong, 3); it.warned = true; } }
      else it.vel = Math.min(14, Math.max(it.vel, it.vel * 0.4 + v * 0.6));
      d.x = x; d.y = y; d.t = t;
    };
    it.up = (x, y, t) => {
      const d = it.drag; it.drag = null;
      if (d && d.moved < 8 && t - d.t0 < 0.4) { it.auto = !it.auto; if (it.auto) it.vel = Math.max(it.vel, 3); }
      R.seen();
    };
    it.busy = () => it.vel > 0.05 || it.auto;
    it.step = function (dt, t) {
      if (it.auto) it.vel += (7 - it.vel) * Math.min(1, dt * 1.5);
      else if (!it.drag) it.vel *= Math.exp(-0.18 * dt);
      if (it.vel < 0.02 && !it.auto) it.vel = 0;
      it.ang += it.vel * dt; it.acc += it.vel * dt;
      while (it.acc >= TAU) {
        it.acc -= TAU; it.n++;
        SND.tick(R.V);
        if (it.n % 108 === 0) { SND.chime(R.V); R.glow(); R.tip(R.w.wheelDone, 3); R.done('wheels', 108); }
      }
      it.wob = it.auto ? 1 : Math.min(1, it.vel / 6);
    };
    it.draw = function (c, t) {
      const r = it.r, h = it.h, wx = Math.sin(it.ang) * 1.6 * it.wob, wy = Math.cos(it.ang) * 0.9 * it.wob;
      const x = it.x + wx, y = it.y + wy, ry = r * 0.3;
      /* 手和柄：袖子从右下角伸进来 */
      const hx = x + r * 0.55, hy = y + h * 0.5 + r * 2.1;
      c.save(); c.lineCap = 'round';
      c.strokeStyle = lin(c, x, y, x + r, y + h * 2, ['#7a4a26', '#5a3418']); c.lineWidth = r * 0.2;
      c.beginPath(); c.moveTo(x, y + h * 0.5); c.lineTo(hx + r * 0.25, hy + r * 1.4); c.stroke();
      c.strokeStyle = '#c99a3a'; c.lineWidth = r * 0.26; c.beginPath(); c.moveTo(x + r * 0.06, y + h * 0.5 + r * 0.25); c.lineTo(x + r * 0.1, y + h * 0.5 + r * 0.45); c.stroke();
      c.restore();
      c.fillStyle = '#7a1e1a';
      c.beginPath(); c.moveTo(hx - r * 0.2, hy + r * 0.2); c.quadraticCurveTo(hx + r * 0.9, hy - r * 0.1, hx + r * 2.6, hy + r * 0.5); c.lineTo(hx + r * 2.6, hy + r * 2.4); c.lineTo(hx + r * 0.3, hy + r * 2.4); c.closePath(); c.fill();
      c.fillStyle = '#e2b78a'; c.beginPath(); c.ellipse(hx + r * 0.15, hy + r * 0.5, r * 0.42, r * 0.5, -0.4, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(120,70,40,.5)'; c.lineWidth = 1; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(hx - r * 0.2 + i * r * 0.16, hy + r * 0.2); c.lineTo(hx - r * 0.1 + i * r * 0.16, hy + r * 0.7); c.stroke(); }
      /* 坠子：在筒身后面时先画 */
      const ps = it.ang * 0.98 + 1.2, L = r * 1.0, bx = x - (r + L) * Math.sin(ps), by = y + (r + L) * 0.3 * Math.cos(ps) + r * 0.15 * (1 - it.wob);
      const ax = x - r * Math.sin(ps), ay = y + ry * Math.cos(ps);
      const weight = () => { c.strokeStyle = '#d8b04a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); circ(c, bx, by, r * 0.16, '#c9962e'); circ(c, bx - r * 0.05, by - r * 0.05, r * 0.06, '#f6e2a0'); };
      if (Math.cos(ps) < 0) weight();
      /* 筒身 */
      c.save();
      c.beginPath(); c.moveTo(x - r, y - h / 2); c.lineTo(x - r, y + h / 2); c.ellipse(x, y + h / 2, r, ry, 0, Math.PI, 0, true); c.lineTo(x + r, y - h / 2); c.ellipse(x, y - h / 2, r, ry, 0, 0, Math.PI, true); c.closePath();
      c.fillStyle = lin(c, x - r, 0, x + r, 0, ['#8a5a1a', '#f4d27a', '#e0b04a', '#a8701e', '#5a3a10']); c.fill();
      c.clip();
      /* 上下两圈纹带 */
      [y - h / 2 + r * 0.12, y + h / 2 - r * 0.32].forEach(yy => {
        c.fillStyle = 'rgba(90,40,10,.35)'; c.fillRect(x - r, yy, r * 2, r * 0.2);
        for (let k = 0; k < 16; k++) {
          const ph = it.ang + k * TAU / 16, cz = Math.cos(ph);
          if (cz <= 0) continue;
          circ(c, x - r * Math.sin(ph), yy + r * 0.1 + ry * 0.1 * cz, r * 0.055 * (0.4 + cz * 0.6), k % 2 ? '#c23a3a' : '#2fa0a0');
        }
      });
      /* 中间一圈深红的字带 */
      c.fillStyle = lin(c, x - r, 0, x + r, 0, ['#4a0e08', '#a8281a', '#8a1e14', '#3a0a06']); c.fillRect(x - r, y - r * 0.34, r * 2, r * 0.68);
      c.fillStyle = 'rgba(255,220,140,.5)'; c.fillRect(x - r, y - r * 0.36, r * 2, 1.2); c.fillRect(x - r, y + r * 0.34, r * 2, 1.2);
      /* 六字真言（字随筒转；转得快时字变淡、拖影） */
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = '700 ' + Math.round(r * 0.5) + 'px "Noto Serif Tibetan","Kailasa","Microsoft Himalaya","Jomolhari",serif';
      const blur = Math.min(1, it.vel / 10);
      for (let k = 0; k < 10; k++) {
        const ph = it.ang + k * TAU / 10, cz = Math.cos(ph);
        if (cz <= 0.05) continue;
        const sx = x - r * 0.92 * Math.sin(ph);
        c.save(); c.translate(sx, y + ry * 0.05 * cz); c.scale(Math.max(0.15, cz), 1);
        c.globalAlpha = cz * (1 - blur * 0.6);
        c.fillStyle = 'rgba(30,6,2,.7)'; c.fillText(M[k % 5], 0.8, 1);
        c.fillStyle = '#ffd86a'; c.fillText(M[k % 5], 0, 0);
        c.restore();
      }
      if (blur > 0.2) { c.globalAlpha = blur * 0.35; c.fillStyle = '#f6dc90'; c.fillRect(x - r, y - r * 0.28, r * 2, r * 0.56); c.globalAlpha = 1; }
      c.restore();
      /* 上下的边 */
      c.strokeStyle = '#5a3810'; c.lineWidth = 1.2;
      c.beginPath(); c.ellipse(x, y + h / 2, r, ry, 0, 0, Math.PI); c.stroke();
      ell(c, x, y - h / 2, r, ry, lin(c, x - r, 0, x + r, 0, ['#b8862e', '#f8de90', '#9a6a1e']));
      /* 顶盖和顶珠 */
      c.beginPath(); c.moveTo(x - r * 0.9, y - h / 2); c.quadraticCurveTo(x, y - h / 2 - r * 1.05, x + r * 0.9, y - h / 2); c.closePath();
      c.fillStyle = lin(c, x - r, 0, x + r, 0, ['#9a6a1e', '#f4d27a', '#8a5a14']); c.fill();
      circ(c, x, y - h / 2 - r * 0.78, r * 0.17, '#e8c25a'); circ(c, x, y - h / 2 - r * 0.98, r * 0.11, '#c23a3a');
      if (Math.cos(ps) >= 0) weight();
      label(c, it.x, it.y + h / 2 + r * 0.9 - r * 3.3, '', 0);
    };
    it.caption = () => (it.n ? fmt(R.w.wheelN, { n: it.n }) : R.w.wheel) + (it.auto ? ' · ' + R.w.wheelAuto : '');
    it.capAt = () => [it.x - it.r * 2.3, it.y + it.h * 0.5 + it.r * 1.2];
    return it;
  };

  /* ---------- 木鱼 ---------- */
  MAKE.muyu = function (R) {
    const it = { id: 'muyu', n: 0, hit0: -9, mallet: 0, rings: [], last: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(30, Math.min(W * 0.1, 46)); it.x = W * 0.25; it.y = bot - it.s * 1.15; };
    it.hit = (x, y) => Math.hypot(x - it.x, (y - it.y) * 1.2) < it.s * 1.5;
    it.down = (x, y, t) => {
      it.n++; it.hit0 = t; it.rings.push({ t: 0 });
      const now = t; it.last.push(now); if (it.last.length > 6) it.last.shift();
      SND.muyu(R.V, 1); R.seen();
    };
    it.busy = () => it.rings.length > 0;
    it.step = dt => { it.rings = it.rings.filter(r => (r.t += dt) < 0.8); };
    it.draw = function (c, t) {
      const s = it.s, k = t - it.hit0, sq = k < 0.18 ? Math.sin(k / 0.18 * Math.PI) * 0.07 : 0;
      const x = it.x, y = it.y;
      /* 垫子 */
      ell(c, x, y + s * 0.62, s * 1.35, s * 0.32, '#8a1e18'); ell(c, x, y + s * 0.56, s * 1.28, s * 0.27, '#c23a28');
      c.strokeStyle = '#e8b83a'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y + s * 0.56, s * 1.1, s * 0.21, 0, 0, TAU); c.stroke();
      /* 鱼身：扁圆的一团木头，正面一道宽宽的口，顶上一对相向的鱼头（衔着一颗珠） */
      c.save(); c.translate(x, y + s * 0.55); c.scale(1 + sq * 0.6, 1 - sq); c.translate(-x, -(y + s * 0.55));
      const body = () => { c.beginPath(); c.moveTo(x - s * 1.1, y + s * 0.5); c.bezierCurveTo(x - s * 1.3, y - s * 0.2, x - s * 0.8, y - s * 0.72, x, y - s * 0.72); c.bezierCurveTo(x + s * 0.8, y - s * 0.72, x + s * 1.3, y - s * 0.2, x + s * 1.1, y + s * 0.5); c.closePath(); };
      /* 顶上的鱼头：两条弯弯的身子在中间合成一个把手 */
      [-1, 1].forEach(sd => {
        c.beginPath(); c.moveTo(x + sd * s * 0.75, y - s * 0.42);
        c.bezierCurveTo(x + sd * s * 0.8, y - s * 0.95, x + sd * s * 0.3, y - s * 1.12, x + sd * s * 0.14, y - s * 0.86);
        c.lineTo(x + sd * s * 0.3, y - s * 0.62); c.closePath();
        c.fillStyle = sd < 0 ? '#b23a1e' : '#8e2a14'; c.fill();
        circ(c, x + sd * s * 0.42, y - s * 0.88, s * 0.06, '#f0c040'); circ(c, x + sd * s * 0.42, y - s * 0.88, s * 0.028, '#2a0804');
      });
      circ(c, x, y - s * 0.9, s * 0.12, '#f0c040'); circ(c, x - s * 0.03, y - s * 0.93, s * 0.04, '#fff6c8');
      body();
      const g = c.createRadialGradient(x - s * 0.35, y - s * 0.4, s * 0.1, x, y, s * 1.3);
      g.addColorStop(0, '#d8683c'); g.addColorStop(0.55, '#a0301a'); g.addColorStop(1, '#5a160a');
      c.fillStyle = g; c.fill();
      c.save(); body(); c.clip();
      /* 鳞纹 */
      c.strokeStyle = 'rgba(240,190,90,.4)'; c.lineWidth = 1;
      for (let r = 0; r < 2; r++) for (let i = -3; i <= 3; i++) { const sx = x + i * s * 0.3 + (r % 2) * s * 0.15, sy = y - s * 0.42 + r * s * 0.2; c.beginPath(); c.arc(sx, sy, s * 0.13, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
      /* 正面的口：一道很宽的缝，两头圆 */
      c.fillStyle = '#1e0602'; c.beginPath(); c.moveTo(x - s * 0.95, y + s * 0.12); c.quadraticCurveTo(x, y + s * 0.42, x + s * 0.95, y + s * 0.12); c.quadraticCurveTo(x + s * 1.02, y + s * 0.2, x + s * 0.92, y + s * 0.24); c.quadraticCurveTo(x, y + s * 0.56, x - s * 0.92, y + s * 0.24); c.quadraticCurveTo(x - s * 1.02, y + s * 0.2, x - s * 0.95, y + s * 0.12); c.fill();
      c.strokeStyle = 'rgba(240,190,90,.55)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - s * 0.95, y + s * 0.1); c.quadraticCurveTo(x, y + s * 0.38, x + s * 0.95, y + s * 0.1); c.stroke();
      c.restore();
      c.fillStyle = 'rgba(255,230,190,.28)'; c.beginPath(); c.ellipse(x - s * 0.42, y - s * 0.4, s * 0.32, s * 0.11, -0.45, 0, TAU); c.fill();
      c.restore();
      /* 木槌：敲的时候落下 */
      const lift = k < 0.08 ? 1 - k / 0.08 : k < 0.3 ? (k - 0.08) / 0.22 : 1;
      const ang = -0.95 + (1 - lift) * 0.65 - 0.2;
      c.save(); c.translate(x + s * 1.35, y + s * 0.05); c.rotate(ang);
      c.fillStyle = '#7a4a22'; c.fillRect(-s * 1.1, -s * 0.06, s * 1.1, s * 0.12);
      circ(c, -s * 1.15, 0, s * 0.2, '#f0e6d0'); circ(c, -s * 1.2, -s * 0.05, s * 0.07, '#fff');
      c.restore();
      /* 敲出来的一圈圈 */
      it.rings.forEach(r => { c.strokeStyle = 'rgba(255,220,160,' + (0.5 * (1 - r.t / 0.8)).toFixed(3) + ')'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - s * 0.1, s * (1.1 + r.t * 1.6), s * (0.8 + r.t * 1.2), 0, 0, TAU); c.stroke(); });
      if (k < 0.5) { c.save(); c.globalAlpha = 1 - k / 0.5; c.fillStyle = '#ffe2a0'; c.font = '700 ' + Math.round(s * 0.42) + 'px "Noto Serif SC","Songti SC",serif'; c.textAlign = 'center'; c.fillText(R.lang === 'en' ? 'tok' : '笃', x, y - s * (1.0 + k * 1.4)); c.restore(); }
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.muyu, n: it.n }) : R.w.muyu);
    it.capAt = () => [it.x, it.y + it.s * 1.25];
    return it;
  };

  /* ---------- 磬（日本叫鏧） ---------- */
  MAKE.qing = function (R) {
    const it = { id: 'qing', n: 0, hit0: -9, waves: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(28, Math.min(W * 0.095, 44)); it.x = W * 0.75; it.y = bot - it.s * 1.05; };
    it.hit = (x, y) => Math.hypot(x - it.x, (y - it.y) * 1.2) < it.s * 1.5;
    it.down = (x, y, t) => { it.n++; it.hit0 = t; for (let i = 0; i < 5; i++) it.waves.push({ t: -i * 0.35 }); SND.qing(R.V, 1); R.seen(); };
    it.busy = () => it.waves.length > 0;
    it.step = dt => { it.waves = it.waves.filter(w => (w.t += dt) < 3.2); };
    it.draw = function (c, t) {
      const s = it.s, x = it.x, y = it.y, k = t - it.hit0, ring = k >= 0 && k < 6 ? Math.exp(-k * 0.6) : 0;
      const jit = ring * Math.sin(t * 90) * 0.8;
      /* 垫子：织锦方垫 + 四角流苏 */
      c.fillStyle = '#5a1e5a'; rr(c, x - s * 1.3, y + s * 0.35, s * 2.6, s * 0.5, 6); c.fill();
      c.fillStyle = '#8a3a8a'; rr(c, x - s * 1.2, y + s * 0.3, s * 2.4, s * 0.42, 6); c.fill();
      c.strokeStyle = '#e8c25a'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x - s + i * s * 0.4, y + s * 0.34); c.lineTo(x - s * 0.8 + i * s * 0.4, y + s * 0.68); c.stroke(); }
      [-1, 1].forEach(sd => { c.strokeStyle = '#e8b83a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + sd * s * 1.2, y + s * 0.7); c.lineTo(x + sd * s * 1.3, y + s * 1.0); c.stroke(); });
      /* 钵 */
      const rx = s * 0.95 + jit, ry = s * 0.28;
      c.beginPath(); c.moveTo(x - rx, y - s * 0.3); c.bezierCurveTo(x - rx, y + s * 0.4, x - rx * 0.5, y + s * 0.48, x, y + s * 0.48); c.bezierCurveTo(x + rx * 0.5, y + s * 0.48, x + rx, y + s * 0.4, x + rx, y - s * 0.3); c.closePath();
      c.fillStyle = lin(c, x - rx, 0, x + rx, 0, ['#5a3a12', '#d8a848', '#f4d27a', '#a87420', '#4a2e0e']); c.fill();
      c.strokeStyle = 'rgba(255,240,190,.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x - rx * 0.9, y - s * 0.05); c.quadraticCurveTo(x, y + s * 0.12, x + rx * 0.9, y - s * 0.05); c.stroke();
      ell(c, x, y - s * 0.3, rx, ry, '#3a2408');
      ell(c, x, y - s * 0.28, rx * 0.9, ry * 0.8, lin(c, x - rx, 0, x + rx, 0, ['#2a1804', '#6a4a16', '#3a2408']));
      c.strokeStyle = ring > 0.05 ? 'rgba(255,236,170,' + (0.5 + ring * 0.5).toFixed(3) + ')' : '#e8c25a'; c.lineWidth = 2 + ring * 2;
      c.beginPath(); c.ellipse(x, y - s * 0.3, rx, ry, 0, 0, TAU); c.stroke();
      if (ring > 0.05) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - s * 0.3, s * 1.6, 'rgba(255,214,140,' + (0.3 * ring).toFixed(3) + ')'); c.restore(); }
      /* 一圈圈的声波 */
      it.waves.forEach(w => {
        if (w.t < 0) return;
        const a = 0.45 * (1 - w.t / 3.2);
        c.strokeStyle = 'rgba(255,230,170,' + a.toFixed(3) + ')'; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(x, y - s * 0.3, rx + w.t * s * 1.6, ry + w.t * s * 0.6, 0, 0, TAU); c.stroke();
      });
      /* 磬槌：敲的时候碰一下边 */
      const hitA = k < 0.12 ? Math.sin(k / 0.12 * Math.PI) : 0;
      c.save(); c.translate(x + s * 1.15, y - s * 0.55); c.rotate(-0.5 + hitA * 0.35);
      c.fillStyle = '#6a3a1a'; c.fillRect(-s * 0.06, 0, s * 0.12, s * 1.15);
      ell(c, 0, 0, s * 0.14, s * 0.22, '#3a1e0e');
      c.restore();
    };
    it.caption = () => { const nm = R.id === 'buddhism.japan' ? R.w.japanQing : R.w.qing; return it.n ? fmt(R.w.count, { name: nm, n: it.n }) : nm; };
    it.capAt = () => [it.x, it.y + it.s * 1.25];
    return it;
  };

  /* ---------- 钟：拉开撞木，松手撞上去 ---------- */
  MAKE.bell = function (R) {
    const it = { id: 'bell', n: 0, pos: 0, v: 0, held: false, pulled: 0, hit0: -9, waves: [], auto: 0 };
    it.layout = (W, H, bot, top) => { it.bw = Math.max(60, Math.min(W * 0.23, 96)); it.bh = it.bw * 1.25; it.x = Math.max(it.bw * 0.62, W * 0.17); it.y = Math.max(top + 70, H * 0.17); it.gap = it.bw * 0.1; it.max = it.bw * 0.6; it.W = W; it.H = H; };
    const logY = () => it.y + it.bh * 0.78, logR = () => it.x - it.bw * 0.5 - it.gap + it.pos;
    it.hit = (x, y) => (x < logR() + 10 && Math.abs(y - logY()) < it.bw * 0.3) || (Math.abs(x - it.x) < it.bw * 0.55 && y > it.y && y < it.y + it.bh * 1.1);
    it.down = (x, y, t) => { it.held = true; it.grab = x; it.pos0 = it.pos; it.t0 = t; it.moved = 0; };
    it.move = (x, y) => { if (!it.held) return; it.moved += 1; it.pos = Math.max(-it.max, Math.min(0, it.pos0 + (x - it.grab))); it.v = 0; };
    it.up = (x, y, t) => {
      if (!it.held) return; it.held = false;
      if (it.pos > -it.max * 0.12) it.auto = 0.35;      /* 只是点了一下：自己往后拉开再撞 */
      else it.fly = true;
      R.seen();
    };
    it.busy = () => it.held || it.auto > 0 || Math.abs(it.v) > 1 || Math.abs(it.pos) > 0.5 || it.waves.length > 0 || it.hit0 > -9 && R.t - it.hit0 < 8;
    it.step = function (dt, t) {
      if (it.held) return;
      if (it.auto > 0) { it.auto -= dt; it.pos += (-it.max * 0.65 - it.pos) * Math.min(1, dt * 9); if (it.auto <= 0) { it.fly = true; it.v = 0; } return; }
      /* 松手后撞木荡向钟（目标在钟里面），碰到就是一下；之后回到离钟一点点的地方停住 */
      const k = it.fly ? 46 : 30, damp = it.fly ? 0.6 : 7, rest = it.fly ? it.gap * 2 : -it.gap;
      it.v += (-k * (it.pos - rest) - damp * it.v) * dt; it.pos += it.v * dt;
      if (!it.fly && it.pos > 0) { it.pos = 0; it.v = Math.min(0, it.v); }
      if (it.fly && it.pos >= 0 && it.v > 0) {
        it.fly = false;
        const s = Math.min(1, Math.max(0.3, it.v / 420));
        it.pos = 0; it.v = -it.v * 0.3; it.n++; it.hit0 = t;
        for (let i = 0; i < 4; i++) it.waves.push({ t: -i * 0.3, s });
        SND.bell(R.V, s); R.glow();
      }
      it.waves = it.waves.filter(w => (w.t += dt) < 3.5);
    };
    it.draw = function (c, t) {
      const bw = it.bw, bh = it.bh, k = t - it.hit0, sway = k >= 0 && k < 8 ? Math.sin(k * 3.2) * 0.035 * Math.exp(-k * 0.5) : 0;
      const x = it.x, y = it.y;
      /* 声波：从撞座往外扩 */
      it.waves.forEach(w => { if (w.t < 0) return; const a = 0.4 * (1 - w.t / 3.5) * (w.s || 1); c.strokeStyle = 'rgba(255,220,160,' + a.toFixed(3) + ')'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y + bh * 0.7, bw * 0.6 + w.t * it.W * 0.35, 0, TAU); c.stroke(); });
      /* 吊钟的绳和梁 */
      c.fillStyle = '#4a2a14'; c.fillRect(x - bw * 0.8, y - 10, bw * 1.6, 7);
      c.save(); c.translate(x, y); c.rotate(sway);
      c.strokeStyle = '#3a2a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -4); c.lineTo(0, bh * 0.06); c.stroke();
      /* 钟纽 */
      c.strokeStyle = '#5a4a2a'; c.lineWidth = bw * 0.07; c.beginPath(); c.arc(0, bh * 0.08, bw * 0.12, Math.PI, 0); c.stroke();
      /* 钟身 */
      c.beginPath(); c.moveTo(-bw * 0.34, bh * 0.12); c.bezierCurveTo(-bw * 0.42, bh * 0.14, -bw * 0.46, bh * 0.4, -bw * 0.47, bh * 0.92); c.lineTo(-bw * 0.52, bh); c.lineTo(bw * 0.52, bh); c.lineTo(bw * 0.47, bh * 0.92); c.bezierCurveTo(bw * 0.46, bh * 0.4, bw * 0.42, bh * 0.14, bw * 0.34, bh * 0.12); c.closePath();
      c.fillStyle = lin(c, -bw * 0.5, 0, bw * 0.5, 0, ['#2e3a2e', '#6a7a5a', '#8a7a4a', '#4a4a32', '#22281e']); c.fill();
      c.save(); c.clip();
      c.fillStyle = 'rgba(90,150,120,.18)'; for (let i = 0; i < 9; i++) circ(c, ((i * 37) % 17 - 8) * bw * 0.05, bh * (0.2 + ((i * 29) % 13) / 18), bw * 0.06, 'rgba(90,150,120,.18)');
      c.strokeStyle = 'rgba(20,24,16,.5)'; c.lineWidth = 2;
      [0.36, 0.62, 0.66].forEach(f => { c.beginPath(); c.moveTo(-bw, bh * f); c.lineTo(bw, bh * f); c.stroke(); });
      c.beginPath(); c.moveTo(0, bh * 0.12); c.lineTo(0, bh * 0.62); c.stroke();
      /* 钟乳：上半段一排排小突起 */
      for (let r = 0; r < 3; r++) for (let i = -2; i <= 2; i++) { if (!i) continue; circ(c, i * bw * 0.09, bh * (0.18 + r * 0.055), bw * 0.024, 'rgba(200,190,140,.55)'); }
      c.restore();
      /* 撞座：左下的莲花圆盘 */
      circ(c, -bw * 0.38, bh * 0.78, bw * 0.09, '#8a7a4a'); circ(c, -bw * 0.38, bh * 0.78, bw * 0.05, '#5a5032');
      if (k >= 0 && k < 1.2) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, -bw * 0.38, bh * 0.78, bw * 0.6, 'rgba(255,214,140,' + (0.6 * (1 - k / 1.2)).toFixed(3) + ')'); c.restore(); }
      c.restore();
      /* 撞木：两根绳吊着的一根圆木，从画面左边伸进来 */
      const ly = logY(), lr = logR(), ll = lr - it.bw * 1.5, lt = it.bw * 0.13;
      c.strokeStyle = '#c8a878'; c.lineWidth = 1.5;
      [0.3, 0.75].forEach(f => { const rx = ll + (lr - ll) * f; c.beginPath(); c.moveTo(rx - it.pos * 0.6, it.y - 8); c.lineTo(rx, ly - lt); c.stroke(); });
      c.fillStyle = lin(c, 0, ly - lt, 0, ly + lt, ['#a87a4a', '#7a4e26', '#4a2e14']); c.fillRect(ll, ly - lt, lr - ll, lt * 2);
      ell(c, lr, ly, lt * 0.45, lt, '#c8925a'); c.strokeStyle = 'rgba(80,40,10,.6)'; c.lineWidth = 1; c.beginPath(); c.ellipse(lr, ly, lt * 0.25, lt * 0.6, 0, 0, TAU); c.stroke();
      if (it.n === 0 && !it.held) { const a = 0.5 + 0.5 * Math.sin(t * 3); c.fillStyle = 'rgba(255,226,160,' + (0.8 * a).toFixed(3) + ')'; c.font = '700 18px system-ui'; c.textAlign = 'center'; c.fillText('⟵', it.x, ly + lt + 18); }
    };
    it.caption = () => { const nm = R.id === 'buddhism.japan' ? R.w.japanBell : R.w.bell; return it.n ? fmt(R.w.count, { name: nm, n: it.n }) : nm; };
    it.capAt = () => [it.x, it.y + it.bh + 14];
    return it;
  };

  /* ---------- 圣水盆：蘸水，画十字 ---------- */
  MAKE.font = function (R) {
    const it = { id: 'font', dip: -9, wet: false, step: 0, ripples: [], trail: [], done: -9, n: 0 };
    it.layout = (W, H, bot) => { it.s = Math.max(30, Math.min(W * 0.1, 46)); it.x = W * 0.2; it.y = bot - it.s * 1.6; it.W = W; it.H = H; it.bot = bot;
      const cx = W / 2, cy = H * 0.6, u = Math.min(W * 0.17, H * 0.1);
      it.pts = [[cx, cy - u * 1.15, 'forehead'], [cx, cy + u * 0.55, 'chest'], [cx - u * 0.95, cy - u * 0.15, 'lsh'], [cx + u * 0.95, cy - u * 0.15, 'rsh']];
      it.u = u; it.cx = cx; it.cy = cy; };
    it.hit = (x, y) => (Math.hypot(x - it.x, y - it.y) < it.s * 1.4) || (it.wet && it.pts.some(p => Math.hypot(x - p[0], y - p[1]) < it.u * 0.5));
    it.down = (x, y, t) => {
      if (Math.hypot(x - it.x, y - it.y) < it.s * 1.4) {
        it.dip = t; it.wet = true; it.step = 0; it.ripples.push({ t: 0 }, { t: -0.25 }); SND.dip(R.V); R.tip(R.w.crossTip, 6); R.seen(); return;
      }
      it.tap(x, y, t);
    };
    it.tap = (x, y, t) => {
      if (!it.wet) return;
      const p = it.pts[it.step];
      if (p && Math.hypot(x - p[0], y - p[1]) < it.u * 0.55) {
        it.trail.push({ x: p[0], y: p[1], t: 0 }); it.step++;
        SND.tick(R.V);
        if (it.step >= 4) { it.wet = false; it.done = t; it.n++; SND.chime(R.V); R.glow(); R.tip(R.w.crossDone, 5); R.done('enter'); }
      }
    };
    it.move = (x, y, t) => { if (it.wet) it.tap(x, y, t); };
    it.busy = () => it.wet || it.ripples.length > 0 || R.t - it.done < 3 || R.t - it.dip < 1.2;
    it.step_ = null;
    it.stepFn = dt => { it.ripples = it.ripples.filter(r => (r.t += dt) < 1.4); it.trail.forEach(p => (p.t += dt)); if (!it.wet && R.t - it.done > 3) it.trail = []; };
    it.draw = function (c, t) {
      const s = it.s, x = it.x, y = it.y;
      /* 立柱 + 贝壳形的盆 */
      c.fillStyle = lin(c, x - s * 0.3, 0, x + s * 0.3, 0, ['#bdb6a8', '#f0ece4', '#a8a092']); c.fillRect(x - s * 0.22, y + s * 0.3, s * 0.44, it.bot - y - s * 0.3);
      c.fillStyle = '#d8d2c6'; c.fillRect(x - s * 0.42, it.bot - s * 0.18, s * 0.84, s * 0.18);
      c.beginPath(); c.moveTo(x - s, y - s * 0.05);
      for (let i = 0; i <= 8; i++) { const a = Math.PI + (i / 8) * Math.PI; c.quadraticCurveTo(x + Math.cos(a - Math.PI / 16) * s * 1.25, y - s * 0.1 + Math.sin(a - Math.PI / 16) * s * 0.95, x + Math.cos(a) * s * 1.05, y - s * 0.05 + Math.sin(a) * s * 0.8); }
      c.closePath(); c.fillStyle = lin(c, 0, y - s, 0, y, ['#f4f0e8', '#c8c0b2']); c.fill();
      c.strokeStyle = 'rgba(120,110,95,.5)'; c.lineWidth = 1; for (let i = 1; i < 8; i++) { const a = Math.PI + (i / 8) * Math.PI; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * s * 0.95, y + Math.sin(a) * s * 0.72); c.stroke(); }
      c.beginPath(); c.moveTo(x - s * 1.05, y - s * 0.05); c.bezierCurveTo(x - s * 1.0, y + s * 0.55, x + s * 1.0, y + s * 0.55, x + s * 1.05, y - s * 0.05); c.closePath();
      c.fillStyle = lin(c, x - s, 0, x + s, 0, ['#d8d2c6', '#f8f4ec', '#b8b0a2']); c.fill();
      ell(c, x, y - s * 0.02, s * 0.95, s * 0.22, '#7ab0d0');
      ell(c, x - s * 0.3, y - s * 0.07, s * 0.35, s * 0.06, 'rgba(255,255,255,.45)');
      it.ripples.forEach(r => { if (r.t < 0) return; c.strokeStyle = 'rgba(255,255,255,' + (0.7 * (1 - r.t / 1.4)).toFixed(3) + ')'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x + s * 0.1, y - s * 0.02, s * 0.15 + r.t * s * 0.55, s * 0.04 + r.t * s * 0.13, 0, 0, TAU); c.stroke(); });
      /* 蘸水的手指 */
      const k = t - it.dip;
      if (k >= 0 && k < 1.1) {
        const d = k < 0.4 ? k / 0.4 : k < 0.6 ? 1 : 1 - (k - 0.6) / 0.5;
        const fx = x + s * 0.15, fy = y - s * 1.6 + d * s * 1.5;
        c.fillStyle = '#efc49e';
        c.beginPath(); c.moveTo(fx - s * 0.14, fy - s * 1.2); c.lineTo(fx - s * 0.14, fy); c.arc(fx, fy, s * 0.14, Math.PI, 0, true); c.lineTo(fx + s * 0.14, fy - s * 1.2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(fx + s * 0.12, fy - s * 1.2); c.lineTo(fx + s * 0.12, fy - s * 0.15); c.arc(fx + s * 0.26, fy - s * 0.15, s * 0.14, Math.PI, 0, true); c.lineTo(fx + s * 0.4, fy - s * 1.2); c.closePath(); c.fill();
        c.fillStyle = '#7a1e1a'; c.fillRect(fx - s * 0.3, fy - s * 1.9, s * 0.9, s * 0.75);
      }
      /* 画十字：像照镜子一样，左肩在左 */
      if (it.wet || R.t - it.done < 3) {
        const fade = it.wet ? 1 : Math.max(0, 1 - (R.t - it.done) / 3), u = it.u, cx = it.cx, cy = it.cy;
        c.save(); c.globalAlpha = fade;
        c.fillStyle = 'rgba(14,10,20,.55)'; rr(c, cx - u * 1.6, cy - u * 2.0, u * 3.2, u * 3.1, 18); c.fill();
        c.fillStyle = 'rgba(255,255,255,.08)';
        circ(c, cx, cy - u * 1.15, u * 0.45, 'rgba(255,255,255,.08)');
        c.beginPath(); c.moveTo(cx - u * 1.25, cy + u * 1.05); c.quadraticCurveTo(cx - u * 1.2, cy - u * 0.45, cx, cy - u * 0.5); c.quadraticCurveTo(cx + u * 1.2, cy - u * 0.45, cx + u * 1.25, cy + u * 1.05); c.closePath(); c.fill();
        /* 已经走过的笔画：一道带水光的金线 */
        if (it.trail.length > 1) {
          c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(190,225,255,.85)'; c.lineWidth = 5; c.lineCap = 'round';
          for (let i = 1; i < it.trail.length; i++) { if (i === 2) continue; c.beginPath(); c.moveTo(it.trail[i - 1].x, it.trail[i - 1].y); c.lineTo(it.trail[i].x, it.trail[i].y); c.stroke(); }
          c.restore();
        }
        it.pts.forEach((p, i) => {
          const on = i < it.step, next = it.wet && i === it.step, pul = next ? 0.6 + 0.4 * Math.sin(t * 5) : 1;
          if (next) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, p[0], p[1], u * 0.55 * pul, 'rgba(160,210,255,.5)'); c.restore(); }
          circ(c, p[0], p[1], u * 0.16, on ? '#bfe2ff' : next ? '#ffffff' : 'rgba(255,255,255,.35)');
          c.fillStyle = 'rgba(255,246,226,.9)'; c.font = '600 11px "Noto Sans SC","PingFang SC",system-ui'; c.textAlign = 'center';
          c.fillText((i + 1) + ' ' + R.w[p[2]], p[0], p[1] + u * 0.42);
        });
        if (!it.wet) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,214,140,' + (0.8 * fade).toFixed(3) + ')'; c.lineWidth = 3; c.beginPath(); c.moveTo(it.pts[0][0], it.pts[0][1]); c.lineTo(it.pts[1][0], it.pts[1][1]); c.moveTo(it.pts[2][0], it.pts[2][1]); c.lineTo(it.pts[3][0], it.pts[3][1]); c.stroke(); c.restore(); }
        c.restore();
      }
    };
    it.caption = () => R.w.font;
    it.capAt = () => [it.x, it.bot - it.s * 0.45];
    return it;
  };

  /* ---------- 洒圣水器 ---------- */
  MAKE.sprinkle = function (R) {
    const it = { id: 'sprinkle', hx: 0, hy: 0, held: false, vx: 0, vy: 0, drops: [], splash: [], last: -9, n: 0, flick: -9 };
    it.layout = (W, H, bot) => { it.s = Math.max(32, Math.min(W * 0.11, 48)); it.rx = W * 0.8; it.ry = bot - it.s * 1.7; it.W = W; it.H = H; it.floor = bot - it.s * 0.2; if (!it.held && !it.init) { it.hx = it.rx; it.hy = it.ry; it.init = true; } };
    it.hit = (x, y) => Math.hypot(x - it.hx, y - it.hy) < it.s * 1.3 || Math.hypot(x - it.rx, y - it.ry - it.s) < it.s * 1.4;
    it.down = (x, y, t) => { it.held = true; it.t0 = t; it.px = x; it.py = y; it.pt = t; it.moved = 0; it.ox = it.hx - x; it.oy = it.hy - y; };
    it.move = (x, y, t) => {
      if (!it.held) return;
      const dt = Math.max(0.008, t - it.pt), nx = x + it.ox, ny = y + it.oy;
      it.vx = (nx - it.hx) / dt; it.vy = (ny - it.hy) / dt; it.moved += Math.hypot(nx - it.hx, ny - it.hy);
      it.hx = nx; it.hy = ny; it.pt = t;
      const sp = Math.hypot(it.vx, it.vy);
      if (sp > 700 && t - it.last > 0.07) spray(t, it.vx / sp, it.vy / sp, Math.min(1, sp / 1800));
    };
    it.up = (x, y, t) => {
      if (!it.held) return; it.held = false;
      if (it.moved < 10) it.flick = t;                  /* 点一下：自己朝主像挥一下 */
      R.seen();
    };
    function spray(t, dx, dy, s) {
      it.last = t;
      const n = Math.round(10 + 18 * s);
      for (let i = 0; i < n; i++) {
        const a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.7, v = 260 + Math.random() * 520 * (0.5 + s);
        it.drops.push({ x: it.hx + (Math.random() - 0.5) * it.s * 0.5, y: it.hy + (Math.random() - 0.5) * it.s * 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, r: 1.2 + Math.random() * 2.2, t: 0 });
      }
      if (!it.lastSnd || t - it.lastSnd > 0.25) { SND.splash(R.V, 0.6 + s * 0.4); it.lastSnd = t; it.n++; }
    }
    it.busy = () => it.held || it.drops.length > 0 || it.splash.length > 0 || Math.hypot(it.hx - it.rx, it.hy - it.ry) > 1 || R.t - it.flick < 0.8;
    it.stepFn = function (dt, t) {
      const k = t - it.flick;
      if (!it.held && k >= 0 && k < 0.6) {
        /* 自动挥：先往后一收，再往主像那边一甩 */
        const u = k / 0.6, tx = it.rx - it.W * 0.25 * Math.sin(u * Math.PI), ty = it.ry - it.H * 0.22 * Math.sin(u * Math.PI);
        const vx = (tx - it.hx) / dt, vy = (ty - it.hy) / dt; it.hx = tx; it.hy = ty;
        if (u > 0.3 && u < 0.7 && t - it.last > 0.06) { const sp = Math.hypot(vx, vy) || 1; spray(t, vx / sp - 0.4, vy / sp - 0.6, 0.8); }
      } else if (!it.held) { it.hx += (it.rx - it.hx) * Math.min(1, dt * 6); it.hy += (it.ry - it.hy) * Math.min(1, dt * 6); }
      it.drops = it.drops.filter(d => {
        d.t += dt; d.vy += 980 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y > it.floor + Math.random() * it.s) { it.splash.push({ x: d.x, y: d.y, t: 0 }); return false; }
        return d.t < 2.5 && d.x > -20 && d.x < it.W + 20;
      });
      it.splash = it.splash.filter(p => (p.t += dt) < 0.6);
    };
    it.draw = function (c, t) {
      const s = it.s;
      /* 圣水桶 */
      const bx = it.rx + s * 0.05, by = it.ry + s * 1.0;
      c.strokeStyle = '#c8a24a'; c.lineWidth = 2; c.beginPath(); c.arc(bx, by - s * 0.2, s * 0.62, Math.PI, 0); c.stroke();
      c.beginPath(); c.moveTo(bx - s * 0.6, by - s * 0.2); c.lineTo(bx - s * 0.48, by + s * 0.6); c.lineTo(bx + s * 0.48, by + s * 0.6); c.lineTo(bx + s * 0.6, by - s * 0.2); c.closePath();
      c.fillStyle = lin(c, bx - s * 0.6, 0, bx + s * 0.6, 0, ['#8a6a24', '#f0d27a', '#a87e2a']); c.fill();
      ell(c, bx, by - s * 0.2, s * 0.6, s * 0.14, '#5a8ab0'); ell(c, bx - s * 0.2, by - s * 0.23, s * 0.2, s * 0.04, 'rgba(255,255,255,.5)');
      /* 洒水器：一根银杆，头上一个带孔的圆球 */
      const ang = it.held ? Math.atan2(it.vy, it.vx) * 0.15 - 0.9 : -1.2 + (it.hx - it.rx) * 0.003;
      const ex = it.hx + Math.cos(ang + Math.PI / 2) * s * 1.6, ey = it.hy + Math.sin(ang + Math.PI / 2) * s * 1.6;
      c.strokeStyle = lin(c, it.hx, it.hy, ex, ey, ['#f0f0f4', '#9aa0aa']); c.lineWidth = s * 0.12; c.lineCap = 'round';
      c.beginPath(); c.moveTo(it.hx, it.hy); c.lineTo(ex, ey); c.stroke();
      c.strokeStyle = '#6a4a2a'; c.lineWidth = s * 0.18; c.beginPath(); c.moveTo(it.hx + (ex - it.hx) * 0.6, it.hy + (ey - it.hy) * 0.6); c.lineTo(ex, ey); c.stroke();
      const g = c.createRadialGradient(it.hx - s * 0.12, it.hy - s * 0.12, 1, it.hx, it.hy, s * 0.32);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#8a929e'); circ(c, it.hx, it.hy, s * 0.3, g);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; circ(c, it.hx + Math.cos(a) * s * 0.17, it.hy + Math.sin(a) * s * 0.17, 1.3, '#4a5260'); }
      /* 水珠和落地的水花 */
      c.save(); c.globalCompositeOperation = 'lighter';
      it.drops.forEach(d => { circ(c, d.x, d.y, d.r, 'rgba(190,225,255,.75)'); circ(c, d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.4, 'rgba(255,255,255,.95)'); if (Math.random() < 0.04) glow(c, d.x, d.y, d.r * 5, 'rgba(220,240,255,.5)'); });
      c.restore();
      it.splash.forEach(p => { c.strokeStyle = 'rgba(200,230,255,' + (0.6 * (1 - p.t / 0.6)).toFixed(3) + ')'; c.lineWidth = 1; c.beginPath(); c.ellipse(p.x, p.y, 2 + p.t * 16, 1 + p.t * 4, 0, 0, TAU); c.stroke(); });
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.sprinkle, n: it.n }) : R.w.sprinkle);
    it.capAt = () => [it.rx, it.floor + 2];
    return it;
  };

  /* ---------- 东正教的手提香炉 ---------- */
  MAKE.censer = function (R) {
    const it = { id: 'censer', th: 0, om: 0, held: false, smoke: [], n: 0, prevS: 0, peak: 0 };
    it.layout = (W, H, bot, top) => { it.ax = W * 0.84; it.ay = top - 6; it.L = Math.min(H * 0.42, bot - top - 60); it.s = Math.max(22, Math.min(W * 0.075, 34)); it.W = W; it.H = H; };
    const pos = () => [it.ax + Math.sin(it.th) * it.L, it.ay + Math.cos(it.th) * it.L];
    it.hit = (x, y) => { const p = pos(); return Math.hypot(x - p[0], y - p[1]) < it.s * 1.6; };
    it.down = (x, y, t) => { it.held = true; it.pt = t; it.moved = 0; it.t0 = t; };
    it.move = (x, y, t) => {
      if (!it.held) return;
      const th = Math.max(-1.1, Math.min(1.1, Math.atan2(x - it.ax, Math.max(20, y - it.ay)))), dt = Math.max(0.008, t - it.pt);
      it.om = (th - it.th) / dt; it.moved += Math.abs(th - it.th); it.th = th; it.pt = t;
    };
    it.up = (x, y, t) => { if (!it.held) return; it.held = false; if (it.moved < 0.05) it.om += it.th > 0 ? -3 : 3; R.seen(); };
    it.busy = () => it.held || Math.abs(it.om) > 0.02 || Math.abs(it.th) > 0.01 || it.smoke.length > 0;
    it.stepFn = function (dt, t) {
      if (!it.held) { it.om += (-(9.8 / (it.L / 260)) * Math.sin(it.th) - 0.35 * it.om) * dt; it.th += it.om * dt; }
      const sgn = Math.sign(it.om);
      if (sgn && sgn !== it.prevS) {
        if (Math.abs(it.th) > 0.18) { it.n++; SND.jingle(R.V, Math.min(1, Math.abs(it.th) * 1.6)); }
        it.prevS = sgn;
      }
      const p = pos(), rate = 3 + Math.abs(it.om) * 6;
      if (Math.random() < dt * rate) it.smoke.push({ x: p[0] + (Math.random() - 0.5) * it.s * 0.6, y: p[1] - it.s * 0.4, r: 3, a: 0.35, vx: -it.om * it.L * 0.25, t: 0 });
      it.smoke = it.smoke.filter(q => { q.t += dt; q.vx *= Math.exp(-1.5 * dt); q.x += (q.vx + Math.sin(q.t * 1.3 + q.y * 0.02) * 8) * dt; q.y -= dt * 28; q.r += dt * 9; q.a -= dt * 0.08; return q.a > 0; });
    };
    it.draw = function (c, t) {
      const s = it.s, p = pos(), x = p[0], y = p[1];
      it.smoke.forEach(q => { c.globalAlpha = q.a; c.drawImage(puff(), q.x - q.r, q.y - q.r, q.r * 2, q.r * 2); });
      c.globalAlpha = 1;
      /* 链子：四根，链上挂小铃 */
      const sx = [-0.55, -0.2, 0.2, 0.55];
      sx.forEach((f, i) => {
        const ex = x + f * s * 0.9 * Math.cos(it.th), ey = y - s * 0.5 - f * s * 0.9 * Math.sin(it.th);
        c.strokeStyle = '#d8b04a'; c.lineWidth = 1.1; c.setLineDash([2.5, 1.5]); c.beginPath(); c.moveTo(it.ax, it.ay + 4); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
        for (let k = 1; k <= 3; k++) { const u = k / 4; circ(c, it.ax + (ex - it.ax) * u, it.ay + (ey - it.ay) * u, 1.8, '#f0d27a'); }
      });
      circ(c, it.ax, it.ay + 4, 4, '#c8962e');
      c.save(); c.translate(x, y); c.rotate(-it.th);
      /* 炉身、炉盖、十字 */
      c.beginPath(); c.moveTo(-s * 0.7, -s * 0.15); c.bezierCurveTo(-s * 0.7, s * 0.5, s * 0.7, s * 0.5, s * 0.7, -s * 0.15); c.closePath();
      c.fillStyle = lin(c, -s * 0.7, 0, s * 0.7, 0, ['#8a6420', '#f4d67a', '#b8862a', '#6a4810']); c.fill();
      c.fillStyle = '#7a5418'; c.fillRect(-s * 0.18, s * 0.38, s * 0.36, s * 0.16);
      c.beginPath(); c.moveTo(-s * 0.66, -s * 0.15); c.quadraticCurveTo(-s * 0.6, -s * 0.85, 0, -s * 0.9); c.quadraticCurveTo(s * 0.6, -s * 0.85, s * 0.66, -s * 0.15); c.closePath();
      c.fillStyle = lin(c, -s * 0.66, 0, s * 0.66, 0, ['#9a7024', '#f8e08a', '#a87a24']); c.fill();
      for (let i = -2; i <= 2; i++) circ(c, i * s * 0.2, -s * 0.45 + Math.abs(i) * s * 0.05, s * 0.05, '#4a3008');
      c.strokeStyle = '#e8c25a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -s * 0.9); c.lineTo(0, -s * 1.25); c.moveTo(-s * 0.13, -s * 1.12); c.lineTo(s * 0.13, -s * 1.12); c.stroke();
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, -s * 0.3, s * 0.6, 'rgba(255,140,60,' + (0.25 + 0.1 * Math.sin(t * 6)).toFixed(3) + ')'); c.restore();
      c.restore();
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.censer, n: it.n }) : R.w.censer);
    it.capAt = () => { const p = pos(); return [p[0] - it.s * 1.8, p[1] + it.s * 0.9]; };
    return it;
  };

  /* ================= 调度 ================= */
  let R = null;
  function open(V) {
    close();
    const kit = KITS[V.def.id];
    if (!kit) return;
    const lang = WORDS[V.lang] ? V.lang : (String(V.lang).indexOf('zh') === 0 ? 'zh-CN' : 'en');
    R = { V, id: V.def.id, lang, w: Object.assign({}, WORDS.en, lang.indexOf('zh') === 0 ? WORDS['zh-CN'] : {}, WORDS[lang]), items: [], active: null, tipText: '', tipUntil: 0, t: 0, used: false };
    R.tip = (text, sec) => { R.tipText = text; R.tipUntil = R.t + (sec || 4); };
    R.seen = () => { R.used = true; };
    R.glow = () => { if (window.HallView && HallView.fx) HallView.fx('halo'); };
    R.done = (pid, n) => { if (V.opts && V.opts.onRite) V.opts.onRite(pid, n); };
    kit.forEach(k => R.items.push(MAKE[k](R)));
    const first = FIRST_TIP[V.def.id] || { wheel: 'wheelTip', bell: 'percTip', muyu: 'percTip', font: 'fontTip', censer: 'censerTip' }[kit[0]];
    if (first && R.w[first]) R.tip(R.w[first], 7);
    if (kit.indexOf('sprinkle') >= 0) R.later = R.w.sprinkleTip;
  }
  function close() { R = null; }
  function frame(c, W, H, t, dt, V, calm) {
    if (!R || R.V !== V) return;
    R.t = t;
    const bot = H - 96, top = 64;
    R.items.forEach(it => { it.layout(W, H, bot, top); (it.stepFn || it.step)(dt, t); });
    R.items.forEach(it => it.draw(c, t));
    R.items.forEach(it => { const p = it.capAt(); label(c, p[0], p[1], it.caption(), 0.92); });
    if (R.tipText && t < R.tipUntil) {
      const a = Math.min(1, (R.tipUntil - t) / 0.6);
      c.save(); c.font = '600 13px "Noto Sans SC","PingFang SC",system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const lines = wrap(c, R.tipText, W - 48), lh = 18, h = lines.length * lh + 14, y = top + 22;
      const w = Math.min(W - 32, Math.max(...lines.map(l => c.measureText(l).width)) + 28);
      c.globalAlpha = a; c.fillStyle = 'rgba(20,12,8,.72)'; rr(c, W / 2 - w / 2, y, w, h, 12); c.fill();
      c.fillStyle = '#ffe9bf'; lines.forEach((l, i) => c.fillText(l, W / 2, y + 7 + lh / 2 + i * lh));
      c.restore();
    } else if (R.later && R.used) { R.tip(R.later, 5); R.later = null; }
  }
  function wrap(c, text, max) {
    const out = []; let line = '';
    const parts = /[㐀-鿿]/.test(text) ? Array.from(text) : text.split(/(\s+)/);
    parts.forEach(ch => { if (c.measureText(line + ch).width > max && line) { out.push(line.trim()); line = ch.trim() ? ch : ''; } else line += ch; });
    if (line.trim()) out.push(line.trim());
    return out;
  }
  function pointer(type, x, y, V, t) {
    if (!R || R.V !== V) return false;
    if (type === 'down') {
      for (let i = R.items.length - 1; i >= 0; i--) { const it = R.items[i]; if (it.hit(x, y)) { R.active = it; ac(); it.down(x, y, t); return true; } }
      return false;
    }
    const it = R.active;
    if (!it) return false;
    if (type === 'move') { if (it.move) it.move(x, y, t); return true; }
    if (type === 'up' || type === 'cancel') { if (it.up) it.up(x, y, t); R.active = null; return true; }
    return false;
  }
  function busy(V) { return !!(R && R.V === V && (R.active || R.items.some(it => it.busy()) || R.t < R.tipUntil)); }
  /* 给 rite2.js 用：登记新的法器、新的版本、新的文案，以及画图和声音的小工具 */
  function add(name, make) { MAKE[name] = make; }
  function kit(id, list, tipKey) { KITS[id] = list; if (tipKey) FIRST_TIP[id] = tipKey; }
  function words(lang, obj) { WORDS[lang] = Object.assign(WORDS[lang] || {}, obj); }
  const LIB = { SND, ac, partial, noise, soundOn, circ, ell, lin, glow, label, rr, fmt, puff, TAU };
  /* 调试和测试用：当前的法器状态 */
  function state() { return R ? R.items.map(it => ({ id: it.id, n: it.n, vel: it.vel, auto: it.auto, step: typeof it.step === 'number' ? it.step : undefined, wet: it.wet, th: it.th, lit: it.lit, done: it.done })) : null; }
  return { has, open, close, frame, pointer, busy, state, add, kit, words, LIB, KITS, WORDS };
})();
