/*
 * 殿内“动画”画法（v3 新增，和实拍并存；殿内右上角切换）。
 * 用画布画出卡通的佛像和基督像，会轻轻呼吸，光环慢慢转，基督会眨眼。
 * 画法庄重：不做夸张表情，不改动各传统里有讲究的地方（佛的螺发、肉髻、白毫、长耳、手印、莲座；
 * 天主教的圣心、东正教圣像的金底和十字光环、新教不加光环）。
 * 用法：HallToon.has(def.id) / HallToon.paint(ctx, W, H, t, def, hall, calm)
 */
var HallToon = (function () {
  'use strict';
  const TAU = Math.PI * 2;

  /* 每个版本用哪一种形象、什么配色 */
  const LOOKS = {
    'buddhism.tibetan': { fig: 'buddha', style: 'tibetan', name: { 'zh-CN': '释迦牟尼佛', en: 'Shakyamuni Buddha' } },
    'buddhism.japan': { fig: 'buddha', style: 'japan', name: { 'zh-CN': '释迦如来', en: 'Shaka Nyorai' } },
    'buddhism.han': { fig: 'buddha', style: 'han', name: { 'zh-CN': '释迦牟尼佛', en: 'Shakyamuni Buddha' } },
    'christianity.catholic': { fig: 'christ', style: 'catholic', name: { 'zh-CN': '耶稣圣心', en: 'The Sacred Heart' } },
    'christianity.orthodox': { fig: 'christ', style: 'orthodox', name: { 'zh-CN': '全能者基督', en: 'Christ Pantocrator' } },
    'christianity.protestant': { fig: 'christ', style: 'protestant', name: { 'zh-CN': '耶稣', en: 'Jesus' } },
  };
  const BUDDHA = {
    han: { skin: '#e9b94f', skin2: '#c98f2c', robe: '#b8402c', robe2: '#8e2a1c', trim: '#e8c25a', hair: '#26346b', inner: '#3f7a5a', lotus: ['#f7d0d8', '#e88aa0'], halo: 'flame' },
    tibetan: { skin: '#ecc25a', skin2: '#c99430', robe: '#b03526', robe2: '#7e2016', trim: '#f0c24a', hair: '#2b56b8', inner: '#e0a43a', lotus: ['#f9e0e6', '#e27a92'], halo: 'rainbow', bare: true },
    japan: { skin: '#e2b04a', skin2: '#b8862a', robe: '#d9a23c', robe2: '#a8761e', trim: '#f4d47a', hair: '#2a2620', inner: '#d9a23c', lotus: ['#f2d37a', '#c9962e'], halo: 'flame' },
  };
  const CHRIST = {
    catholic: { tunic: '#f4efe4', mantle: '#b8322f', halo: 'cross', arms: 'open', heart: true },
    orthodox: { tunic: '#8a3324', mantle: '#2c4f8a', halo: 'cross', arms: 'bless', icon: true },
    protestant: { tunic: '#f6f3ec', mantle: '#7aa0c8', halo: 'glow', arms: 'open' },
  };

  const ABOUT = {
    buddha: { 'zh-CN': '按传统造像的规矩画成的卡通佛像：头顶的肉髻和一颗颗右旋的螺发，眉间的白毫，垂下来的长耳，结跏趺坐在莲花座上。\n汉传和日本的佛像双手结禅定印；藏传的释迦牟尼右手垂下触地，左手托钵，背光是一圈圈彩虹色。', en: 'A cartoon Buddha drawn by the traditional rules: the cranial mound and tight curls, the tuft between the brows, long earlobes, seated cross-legged on a lotus.\nThe Chinese and Japanese Buddha rests his hands in meditation; the Tibetan Shakyamuni touches the earth with his right hand and holds a bowl in his left, inside a rainbow aureole.' },
    catholic: { 'zh-CN': '耶稣圣心像：胸前是燃着火焰、围着荆棘冠的心，上面一个小十字，表示耶稣对人的爱。头后是带十字的光环。\n这是卡通版，按天主教常见的圣心像画法。', en: 'The Sacred Heart: a heart aflame and crowned with thorns, topped with a small cross, standing for the love of Jesus. A cross-marked halo behind the head.\nA cartoon after the usual Catholic image.' },
    orthodox: { 'zh-CN': '按东正教圣像的样子画的全能者基督：金底，十字光环里写着希腊文“ὁ ὤν”（自有永有者），两边是“IC XC”（耶稣基督）。\n右手祝福，左手捧着福音书。', en: 'Christ Pantocrator in the manner of an Orthodox icon: gold ground, a cross halo inscribed ὁ ὤν (“He who is”), and IC XC (Jesus Christ) on either side.\nHe blesses with his right hand and holds the Gospel in his left.' },
    protestant: { 'zh-CN': '张开双臂的耶稣，没有光环，衣服朴素，接近新教儿童圣经插画的画法。\n许多新教教会不在礼拜堂里放圣像，这里只是讲故事用的插画。', en: 'Jesus with open arms, no halo and plain clothes, close to Protestant children’s Bible illustration.\nMany Protestant churches keep no images in worship; this is a storytelling picture.' },
  };
  function about(id) { if (EXTRA[id]) return EXTRA[id].about; const L = LOOKS[id]; if (!L) return { 'zh-CN': '', en: '' }; return L.fig === 'buddha' ? ABOUT.buddha : ABOUT[L.style]; }
  const EXTRA = {};   /* toon2.js 等后加的场景：{ name, about, paint(ctx, W, H, t, calm) } */
  function has(id) { return !!LOOKS[id] || !!EXTRA[id]; }
  function name(id, lang) { const L = LOOKS[id] || EXTRA[id]; if (!L) return ''; return L.name[lang] || L.name[String(lang).split('-')[0]] || (String(lang).indexOf('zh') === 0 ? L.name['zh-CN'] : L.name.en) || L.name.en; }

  /* ---------- 小工具 ---------- */
  function ell(c, x, y, rx, ry, fill) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = fill; c.fill(); }
  function circ(c, x, y, r, fill) { ell(c, x, y, r, r, fill); }
  function glow(c, x, y, r, col) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  }
  function shape(c, d) { c.beginPath(); d(c); c.closePath(); }
  function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }

  /* ---------- 背景 ---------- */
  function bgTemple(c, W, H, t, st, calm) {
    const tib = st === BUDDHA.tibetan;
    c.fillStyle = lin(c, 0, 0, 0, H, tib ? ['#1e0e0a', '#3b1610', '#2a100a'] : ['#1a0a06', '#40180e', '#22100a']);
    c.fillRect(0, 0, W, H);
    /* 背墙上的暗纹 */
    c.save(); c.globalAlpha = 0.07; c.strokeStyle = '#f0c870'; c.lineWidth = 1;
    for (let y = H * 0.1; y < H * 0.75; y += 26) for (let x = (y / 26) % 2 ? 0 : 13; x < W; x += 26) { c.beginPath(); c.arc(x, y, 8, 0, TAU); c.stroke(); }
    c.restore();
    /* 两根柱子 */
    [-1, 1].forEach(sd => {
      const x = W / 2 + sd * W * 0.43, cw = Math.max(18, W * 0.07);
      c.fillStyle = lin(c, x - cw / 2, 0, x + cw / 2, 0, tib ? ['#6e1a12', '#c23a28', '#5a140c'] : ['#5e140c', '#b42e1e', '#4a0f08']);
      c.fillRect(x - cw / 2, 0, cw, H * 0.86);
      if (tib) for (let y = H * 0.18; y < H * 0.8; y += H * 0.16) {
        c.fillStyle = '#2f62b8'; c.fillRect(x - cw / 2, y, cw, 6); c.fillStyle = '#e8b83a'; c.fillRect(x - cw / 2, y + 6, cw, 3); c.fillStyle = '#2f8a5a'; c.fillRect(x - cw / 2, y + 9, cw, 4);
      }
      c.fillStyle = '#d9a83a'; c.fillRect(x - cw / 2 - 3, H * 0.06, cw + 6, 7);
    });
    /* 垂下来的幡：轻轻摆 */
    const cols = tib ? ['#2f62b8', '#f4f0e6', '#c23a28', '#2f8a5a', '#e8b83a'] : ['#e8b83a', '#c23a28', '#e8b83a', '#c23a28'];
    [-1, 1].forEach(sd => {
      const x0 = W / 2 + sd * W * 0.3, sw = calm ? 0 : Math.sin(t * 0.9 + sd) * 3;
      const bw = Math.max(16, W * 0.06), bh = H * 0.34;
      for (let k = 0; k < (tib ? 5 : 4); k++) {
        const y = H * 0.08 + k * bh / (tib ? 5 : 4);
        c.fillStyle = cols[k % cols.length];
        c.beginPath(); c.moveTo(x0 - bw / 2 + sw * k * 0.3, y); c.lineTo(x0 + bw / 2 + sw * k * 0.3, y); c.lineTo(x0 + bw / 2 + sw * (k + 1) * 0.3, y + bh / (tib ? 5 : 4)); c.lineTo(x0 - bw / 2 + sw * (k + 1) * 0.3, y + bh / (tib ? 5 : 4)); c.fill();
      }
      const ty = H * 0.08 + bh, tx = x0 + sw * 1.4;
      c.fillStyle = '#e8b83a';
      c.beginPath(); c.moveTo(tx - bw / 2, ty); c.lineTo(tx, ty + bw * 0.6); c.lineTo(tx + bw / 2, ty); c.fill();
      c.strokeStyle = '#e8b83a'; c.lineWidth = 1.2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(tx + i * 3, ty + bw * 0.45); c.lineTo(tx + i * 3 + sw * 0.6, ty + bw * 0.45 + 14); c.stroke(); }
    });
    /* 地面 */
    c.fillStyle = lin(c, 0, H * 0.74, 0, H, ['#2a120a', '#140804']);
    c.fillRect(0, H * 0.74, W, H * 0.26);
  }
  function bgChurch(c, W, H, t, st, calm) {
    if (st.icon) {
      /* 圣像：深色木框里的金底 */
      c.fillStyle = '#1c120c'; c.fillRect(0, 0, W, H);
      const x0 = W * 0.06, y0 = H * 0.08, w = W * 0.88, h = H * 0.7;
      c.fillStyle = '#5a1e14'; c.fillRect(x0 - 8, y0 - 8, w + 16, h + 16);
      c.fillStyle = lin(c, x0, y0, x0 + w, y0 + h, ['#f2d27a', '#d4a640', '#f0cc6a', '#b98a2e']);
      c.fillRect(x0, y0, w, h);
      c.strokeStyle = 'rgba(120,70,20,.45)'; c.lineWidth = 2; c.strokeRect(x0 + 6, y0 + 6, w - 12, h - 12);
      c.save(); c.globalAlpha = 0.12; c.fillStyle = '#fff';
      for (let i = 0; i < 40; i++) { const r = ((i * 97) % 89) / 89; c.fillRect(x0 + r * w, y0 + ((i * 53) % 71) / 71 * h, 2, 2); }
      c.restore();
      c.fillStyle = '#1c120c'; c.fillRect(0, H * 0.8, W, H * 0.2);
      return;
    }
    const prot = !st.heart;
    c.fillStyle = lin(c, 0, 0, 0, H, prot ? ['#d9d2c4', '#efe8da', '#c8bfae'] : ['#2a2430', '#4a3e44', '#2a2228']);
    c.fillRect(0, 0, W, H);
    /* 背后的窗：天主教是彩色玻璃尖拱窗，新教是一扇透亮的白窗加一个空十字 */
    const wx = W / 2, wt = H * 0.06, ww = Math.min(W * 0.62, H * 0.4), wh = H * 0.62;
    c.save();
    c.beginPath(); c.moveTo(wx - ww / 2, wt + wh); c.lineTo(wx - ww / 2, wt + ww * 0.5); c.quadraticCurveTo(wx - ww / 2, wt, wx, wt - ww * 0.1); c.quadraticCurveTo(wx + ww / 2, wt, wx + ww / 2, wt + ww * 0.5); c.lineTo(wx + ww / 2, wt + wh); c.closePath();
    c.fillStyle = prot ? '#bfd4e6' : '#1c2238'; c.fill(); c.clip();
    if (!prot) {
      const pal = ['#2f5fb8', '#c23a3a', '#e2b23a', '#2f8a5a', '#7a3fa0', '#3a8ac0'];
      for (let y = wt - 20, r = 0; y < wt + wh; y += 22, r++) for (let x = wx - ww / 2 - 10 + (r % 2) * 11, k = 0; x < wx + ww / 2; x += 22, k++) {
        c.fillStyle = pal[(r * 3 + k * 5) % pal.length]; c.globalAlpha = 0.55 + 0.25 * Math.sin(t * 0.6 + r + k);
        c.fillRect(x, y, 21, 21);
      }
      c.globalAlpha = 1; c.strokeStyle = '#141018'; c.lineWidth = 2;
      for (let y = wt - 20; y < wt + wh; y += 22) { c.beginPath(); c.moveTo(wx - ww, y); c.lineTo(wx + ww, y); c.stroke(); }
    } else {
      c.fillStyle = lin(c, 0, wt, 0, wt + wh, ['#eef6fc', '#cfe0ee']); c.fillRect(wx - ww, wt - 20, ww * 2, wh + 40);
      c.strokeStyle = 'rgba(120,110,95,.6)'; c.lineWidth = 3;
      for (let i = 1; i < 3; i++) { c.beginPath(); c.moveTo(wx - ww / 2 + ww * i / 3, wt - 20); c.lineTo(wx - ww / 2 + ww * i / 3, wt + wh); c.stroke(); }
      for (let y = wt + 40; y < wt + wh; y += 60) { c.beginPath(); c.moveTo(wx - ww / 2, y); c.lineTo(wx + ww / 2, y); c.stroke(); }
    }
    c.restore();
    c.strokeStyle = prot ? '#f8f4ec' : '#6a5a52'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(wx - ww / 2, wt + wh); c.lineTo(wx - ww / 2, wt + ww * 0.5); c.quadraticCurveTo(wx - ww / 2, wt, wx, wt - ww * 0.1); c.quadraticCurveTo(wx + ww / 2, wt, wx + ww / 2, wt + ww * 0.5); c.lineTo(wx + ww / 2, wt + wh); c.stroke();
    /* 斜射进来的光 */
    if (!calm || true) {
      c.save(); c.globalCompositeOperation = 'lighter';
      const a = 0.07 + 0.03 * Math.sin(t * 0.4);
      c.fillStyle = lin(c, wx, wt, wx + W * 0.3, H * 0.9, [prot ? 'rgba(255,250,230,' + a * 1.6 + ')' : 'rgba(255,220,160,' + a * 1.6 + ')', 'rgba(255,220,160,0)']);
      c.beginPath(); c.moveTo(wx - ww * 0.3, wt + 20); c.lineTo(wx + ww * 0.4, wt + 20); c.lineTo(wx + W * 0.5, H * 0.92); c.lineTo(wx - W * 0.1, H * 0.92); c.fill();
      c.restore();
    }
    /* 地面 */
    c.fillStyle = lin(c, 0, H * 0.76, 0, H, prot ? ['#a58a66', '#6e5a40'] : ['#3a302c', '#1a1412']);
    c.fillRect(0, H * 0.76, W, H * 0.24);
  }

  /* ---------- 佛 ---------- */
  function buddha(c, t, st, calm) {
    const br = calm ? 0 : Math.sin(t * TAU / 5.5);           /* 呼吸 */
    const rot = calm ? 0 : t * 0.06;
    /* 身光 */
    c.save();
    if (st.halo === 'none') {
      glow(c, 0, -200, 190, 'rgba(255,214,120,.22)');
    } else if (st.halo === 'rainbow') {
      ['#2f62b8', '#3f9a6a', '#e8c23a', '#e0782a', '#c23a3a'].forEach((col, i) => { ell(c, 0, -182, 136 - i * 9, 180 - i * 9, col); });
      ell(c, 0, -182, 92, 136, '#16243c');
      glow(c, 0, -182, 150, 'rgba(255,220,140,.12)');
    } else {
      const g = c.createRadialGradient(0, -190, 20, 0, -190, 180);
      g.addColorStop(0, 'rgba(255,214,120,.55)'); g.addColorStop(0.75, 'rgba(230,160,60,.22)'); g.addColorStop(1, 'rgba(230,160,60,0)');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, -186, 132, 178, 0, 0, TAU); c.fill();
      /* 身光边上的火焰纹 */
      c.fillStyle = 'rgba(240,190,80,.55)';
      for (let i = 0; i < 26; i++) {
        const a = Math.PI * 0.62 + (i / 25) * Math.PI * 1.76, fx = Math.cos(a) * 128, fy = -186 + Math.sin(a) * 172;
        const fl = calm ? 0 : Math.sin(t * 3 + i) * 3;
        c.save(); c.translate(fx, fy); c.rotate(a + Math.PI / 2);
        c.beginPath(); c.moveTo(-7, 0); c.quadraticCurveTo(-4, -10 - fl, 0, -16 - fl); c.quadraticCurveTo(4, -10 - fl, 7, 0); c.fill();
        c.restore();
      }
      c.strokeStyle = 'rgba(255,220,140,.5)'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -186, 124, 168, 0, 0, TAU); c.stroke();
    }
    c.restore();
    /* 头光 */
    const hy = -290 - br * 1.2;
    if (st.halo !== 'none') {
    glow(c, 0, hy, 90, 'rgba(255,226,150,.35)');
    c.save(); c.translate(0, hy); c.rotate(rot);
    c.strokeStyle = 'rgba(255,224,140,.55)'; c.lineWidth = 1.2;
    for (let i = 0; i < 36; i++) { const a = (i / 36) * TAU; c.beginPath(); c.moveTo(Math.cos(a) * 50, Math.sin(a) * 50); c.lineTo(Math.cos(a) * 70, Math.sin(a) * 70); c.stroke(); }
    c.restore();
    circ(c, 0, hy, 62, st.halo === 'rainbow' ? 'rgba(80,140,90,.85)' : 'rgba(240,190,90,.55)');
    circ(c, 0, hy, 54, st.halo === 'rainbow' ? 'rgba(40,90,160,.9)' : 'rgba(255,214,130,.45)');
    c.strokeStyle = 'rgba(255,236,170,.8)'; c.lineWidth = 2; c.beginPath(); c.arc(0, hy, 62, 0, TAU); c.stroke();
    }

    /* 莲座：后排花瓣 → 腿 → 前排花瓣 */
    shape(c, k => { k.moveTo(-104, 0); k.lineTo(104, 0); k.lineTo(90, -24); k.lineTo(-90, -24); });
    c.fillStyle = lin(c, 0, -24, 0, 0, ['#8a3020', '#5a1a10']); c.fill();
    c.fillStyle = st.trim; c.fillRect(-92, -24, 184, 3); c.fillRect(-100, -6, 200, 2);
    const petal = (a, ry, back) => {
      const x = Math.cos(a) * 112, y = -48 + Math.sin(a) * ry, s = back ? 0.86 : 1, sw = calm ? 0 : Math.sin(t * 1.3 + a * 3) * 0.6;
      c.save(); c.translate(x, y); c.scale(s, s);
      c.beginPath(); c.moveTo(-17, 6); c.bezierCurveTo(-20, -14, -6, -30, sw, -42); c.bezierCurveTo(6, -30, 20, -14, 17, 6); c.closePath();
      c.fillStyle = lin(c, 0, 6, 0, -42, [st.lotus[1], st.lotus[0], st.lotus[0]]); c.fill();
      c.strokeStyle = 'rgba(120,40,50,.35)'; c.lineWidth = 1; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(0, 2); c.lineTo(sw * 0.6, -30); c.stroke();
      c.restore();
    };
    for (let i = 0; i < 9; i++) petal(Math.PI + (i / 8) * Math.PI, 16, true);
    ell(c, 0, -58, 110, 16, st.lotus[0]);

    c.save(); c.translate(0, -br * 0.8);
    /* 盘起的腿 */
    shape(c, k => { k.moveTo(-114, -60); k.bezierCurveTo(-118, -96, -80, -114, 0, -116); k.bezierCurveTo(80, -114, 118, -96, 114, -60); k.bezierCurveTo(60, -46, -60, -46, -114, -60); });
    c.fillStyle = lin(c, 0, -116, 0, -50, [st.robe, st.robe2]); c.fill();
    c.strokeStyle = 'rgba(60,10,6,.35)'; c.lineWidth = 1.4;
    [[-90, -70, -30, -96], [90, -70, 30, -96], [-60, -58, 10, -84]].forEach(l => { c.beginPath(); c.moveTo(l[0], l[1]); c.quadraticCurveTo((l[0] + l[2]) / 2, l[3] + 8, l[2], l[3]); c.stroke(); });
    /* 一只脚心朝上（右脚放在左腿上） */
    c.save(); c.translate(48, -98); c.rotate(-0.18);
    ell(c, 0, 0, 18, 7.5, st.skin2); ell(c, -1, -0.5, 15, 5.5, '#f0bfa0');
    for (let i = 0; i < 5; i++) circ(c, 15 + (i < 1 ? 1 : 0), -5 + i * 2.6, 2.1 - i * 0.18, st.skin);
    c.restore();
    /* 身体（袈裟） */
    shape(c, k => { k.moveTo(-58, -232); k.bezierCurveTo(-88, -230, -100, -200, -98, -168); k.lineTo(-100, -116); k.bezierCurveTo(-60, -102, 60, -102, 100, -116); k.lineTo(98, -168); k.bezierCurveTo(100, -200, 88, -230, 58, -232); });
    c.fillStyle = lin(c, -100, -230, 100, -110, [st.robe, st.robe, st.robe2]); c.fill();
    /* 福田衣的格子 */
    c.save(); c.clip();
    c.strokeStyle = 'rgba(255,214,120,.28)'; c.lineWidth = 1.1;
    for (let x = -96; x < 100; x += 26) { c.beginPath(); c.moveTo(x, -236); c.lineTo(x + 6, -100); c.stroke(); }
    for (let y = -210; y < -100; y += 34) { c.beginPath(); c.moveTo(-100, y); c.lineTo(100, y + 4); c.stroke(); }
    c.restore();
    if (st.bare) {
      /* 藏式：右肩袒露 */
      shape(c, k => { k.moveTo(8, -236); k.bezierCurveTo(40, -238, 70, -232, 84, -214); k.bezierCurveTo(96, -196, 92, -168, 70, -150); k.bezierCurveTo(40, -170, 20, -200, 8, -236); });
      c.fillStyle = lin(c, 20, -236, 90, -150, [st.skin, st.skin2]); c.fill();
      c.strokeStyle = 'rgba(140,80,20,.4)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(40, -214); c.quadraticCurveTo(56, -204, 70, -208); c.stroke();
      c.beginPath(); c.moveTo(66, -200); c.quadraticCurveTo(76, -180, 74, -160); c.stroke();
      c.strokeStyle = st.trim; c.lineWidth = 3; c.beginPath(); c.moveTo(6, -236); c.bezierCurveTo(22, -196, 44, -168, 72, -148); c.stroke();
    } else {
      /* 汉式、日式：通肩，胸前露出一点内衣和系带 */
      shape(c, k => { k.moveTo(-30, -234); k.quadraticCurveTo(0, -176, 30, -234); });
      c.fillStyle = st.skin; c.fill();
      c.strokeStyle = st.inner; c.lineWidth = 5; c.beginPath(); c.moveTo(-26, -196); c.quadraticCurveTo(0, -188, 26, -196); c.stroke();
      c.strokeStyle = st.trim; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-31, -234); c.quadraticCurveTo(0, -172, 31, -234); c.stroke();
    }
    /* 手臂（衣袖） */
    [-1, 1].forEach(sd => {
      if (st.bare && sd > 0) {
        /* 右手：触地印，手垂在右膝上 */
        shape(c, k => { k.moveTo(80, -216); k.bezierCurveTo(104, -190, 108, -140, 100, -96); k.lineTo(86, -96); k.bezierCurveTo(88, -140, 80, -170, 66, -190); });
        c.fillStyle = lin(c, 66, -216, 108, -96, [st.skin, st.skin2]); c.fill();
        ell(c, 94, -86, 10, 15, st.skin);
        c.strokeStyle = 'rgba(120,70,20,.5)'; c.lineWidth = 1; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(94 + i * 4, -82); c.lineTo(94 + i * 4, -72); c.stroke(); }
        return;
      }
      shape(c, k => { k.moveTo(sd * 60, -228); k.bezierCurveTo(sd * 104, -214, sd * 114, -150, sd * 86, -116); k.lineTo(sd * 50, -104); k.bezierCurveTo(sd * 70, -140, sd * 74, -184, sd * 58, -204); });
      c.fillStyle = lin(c, sd * 60, -228, sd * 100, -110, [st.robe, st.robe2]); c.fill();
      c.strokeStyle = st.trim; c.lineWidth = 2; c.beginPath(); c.moveTo(sd * 86, -116); c.lineTo(sd * 50, -104); c.stroke();
    });
    /* 禅定印：两手相叠，拇指相接；藏式左手托钵 */
    if (st.bare && st.bowl === false) {
      shape(c, k => { k.moveTo(-60, -112); k.bezierCurveTo(-40, -98, 0, -100, 14, -108); k.bezierCurveTo(4, -118, -40, -120, -60, -112); });
      c.fillStyle = st.skin; c.fill(); c.strokeStyle = 'rgba(140,80,20,.45)'; c.lineWidth = 1; c.stroke();
    } else if (st.bare) {
      ell(c, -18, -110, 30, 10, st.skin);
      shape(c, k => { k.moveTo(-44, -122); k.quadraticCurveTo(-18, -96, 8, -122); });
      c.fillStyle = '#1e2a4a'; c.fill(); ell(c, -18, -122, 26, 5, '#3a4a78');
    } else {
      /* 左手在下、右手叠在上，掌心向上，两拇指尖相接成一个小圈 */
      [[0, -108, 1], [0, -114, 0]].forEach(hh => {
        shape(c, k => { k.moveTo(-34, hh[1]); k.bezierCurveTo(-30, hh[1] + 9, 30, hh[1] + 9, 34, hh[1]); k.bezierCurveTo(30, hh[1] - 7, -30, hh[1] - 7, -34, hh[1]); });
        c.fillStyle = hh[2] ? st.skin2 : st.skin; c.fill();
        c.strokeStyle = 'rgba(140,80,20,.45)'; c.lineWidth = 1; c.stroke();
      });
      c.strokeStyle = 'rgba(140,80,20,.45)'; c.lineWidth = 1;
      [-26, -20, -14, 14, 20, 26].forEach(x => { c.beginPath(); c.moveTo(x, -112); c.lineTo(x * 1.04, -108); c.stroke(); });
      [-1, 1].forEach(sd => { shape(c, k => { k.moveTo(sd * 18, -116); k.quadraticCurveTo(sd * 14, -132, sd * 1.5, -130); k.lineTo(sd * 1.5, -125); k.quadraticCurveTo(sd * 10, -125, sd * 11, -115); }); c.fillStyle = st.skin; c.fill(); c.stroke(); });
    }
    /* 前排莲瓣：盖住腿的下沿 */
    c.restore();
    for (let i = 0; i < 9; i++) petal((i / 8) * Math.PI, 18, false);
    c.save(); c.translate(0, -br * 0.8);
    /* 颈、三道 */
    c.fillStyle = st.skin; c.fillRect(-14, -252, 28, 24);
    c.strokeStyle = 'rgba(140,80,20,.45)'; c.lineWidth = 1; [-246, -240, -234].forEach(y => { c.beginPath(); c.moveTo(-12, y); c.quadraticCurveTo(0, y + 2, 12, y); c.stroke(); });
    c.restore();

    /* 头 */
    c.save(); c.translate(0, -br * 1.2);
    /* 长耳 */
    [-1, 1].forEach(sd => {
      shape(c, k => { k.moveTo(sd * 34, -296); k.bezierCurveTo(sd * 50, -302, sd * 52, -270, sd * 46, -250); k.bezierCurveTo(sd * 44, -238, sd * 34, -240, sd * 34, -256); });
      c.fillStyle = st.skin2; c.fill();
      c.strokeStyle = 'rgba(120,60,10,.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(sd * 38, -290); c.quadraticCurveTo(sd * 46, -276, sd * 40, -258); c.stroke();
    });
    const fg = c.createRadialGradient(-10, -292, 6, 0, -280, 46);
    fg.addColorStop(0, B_lighter(st.skin)); fg.addColorStop(1, st.skin2);
    ell(c, 0, -280, 37, 42, fg);
    /* 螺发 + 肉髻 */
    c.save();
    shape(c, k => { k.moveTo(-38, -286); k.bezierCurveTo(-40, -330, 40, -330, 38, -286); k.quadraticCurveTo(0, -300, -38, -286); });
    c.fillStyle = st.hair; c.fill(); c.clip();
    for (let y = -330, r = 0; y < -284; y += 6.5, r++) for (let x = -42 + (r % 2) * 3.4; x < 42; x += 6.8) { circ(c, x, y, 3.1, B_lighter(st.hair)); circ(c, x - 0.8, y - 0.8, 1.1, 'rgba(255,255,255,.25)'); }
    c.restore();
    circ(c, 0, -330, 19, st.hair);
    c.save(); c.beginPath(); c.arc(0, -330, 19, 0, TAU); c.clip();
    for (let y = -350, r = 0; y < -312; y += 6.5, r++) for (let x = -20 + (r % 2) * 3.4; x < 20; x += 6.8) circ(c, x, y, 3.1, B_lighter(st.hair));
    c.restore();
    if (st.rasmi) {
      /* 泰式：肉髻上一簇火焰形的“光焰”（rasmi） */
      const fl = calm ? 0 : Math.sin(t * 2) * 1.2;
      shape(c, k => { k.moveTo(-9, -346); k.bezierCurveTo(-12, -366, -4, -380, fl, -398); k.bezierCurveTo(4, -380, 12, -366, 9, -346); });
      c.fillStyle = lin(c, -10, -398, 10, -346, [B_lighter(st.skin), st.skin, st.skin2]); c.fill();
      c.strokeStyle = 'rgba(120,70,10,.45)'; c.lineWidth = 1; c.stroke();
    } else if (st.halo === 'rainbow') { circ(c, 0, -348, 6, '#e8b83a'); circ(c, 0, -350, 3, '#c23a3a'); }
    else if (st.jewel !== false) circ(c, 0, -320, 4.5, '#e05a3a');
    /* 白毫、眉、眼（垂目）、鼻、口、腮红 */
    circ(c, 0, -293, 2.6, '#fff4d6');
    c.strokeStyle = 'rgba(80,40,20,.75)'; c.lineWidth = 1.6; c.lineCap = 'round';
    [-1, 1].forEach(sd => {
      c.beginPath(); c.moveTo(sd * 5, -296); c.quadraticCurveTo(sd * 16, -303, sd * 28, -296); c.stroke();
      c.beginPath(); c.moveTo(sd * 7, -284); c.quadraticCurveTo(sd * 16, -279, sd * 25, -284); c.stroke();
    });
    c.lineWidth = 1.2; c.beginPath(); c.moveTo(-1, -282); c.quadraticCurveTo(-4, -270, 0, -268); c.quadraticCurveTo(3, -267, 5, -270); c.stroke();
    c.strokeStyle = 'rgba(170,70,50,.8)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-7, -259); c.quadraticCurveTo(0, -254, 7, -259); c.stroke();
    ell(c, -21, -268, 7, 4, 'rgba(240,120,100,.18)'); ell(c, 21, -268, 7, 4, 'rgba(240,120,100,.18)');
    c.restore();
  }
  function B_lighter(col) {
    const p = col.slice(1).match(/\w\w/g).map(v => parseInt(v, 16));
    return 'rgb(' + p.map(v => Math.round(v + (255 - v) * 0.22)).join(',') + ')';
  }

  /* ---------- 基督 ---------- */
  function christ(c, t, st, calm) {
    const br = calm ? 0 : Math.sin(t * TAU / 5);
    const blink = calm ? 0 : ((t % 4.7) < 0.13 ? 1 : 0);
    /* 光环 */
    const hy = -322 - br;
    if (st.halo === 'cross') {
      glow(c, 0, hy, 90, 'rgba(255,226,150,.4)');
      circ(c, 0, hy, 50, st.icon ? '#e8c060' : 'rgba(250,214,120,.9)');
      c.strokeStyle = st.icon ? '#8a5a1a' : 'rgba(200,150,60,.9)'; c.lineWidth = 2; c.beginPath(); c.arc(0, hy, 50, 0, TAU); c.stroke();
      c.fillStyle = st.icon ? '#9a2a1e' : '#c23a3a';
      [[-50, -7, 28, 14], [22, -7, 28, 14], [-7, -50, 14, 28]].forEach(r => c.fillRect(r[0], hy + r[1], r[2], r[3]));
      if (st.icon) {
        c.fillStyle = '#f6e8c0'; c.font = 'bold 9px serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('Ο', -37, hy); c.fillText('Ω', 0, hy - 37); c.fillText('Ν', 37, hy);
      }
    } else glow(c, 0, hy, 110, 'rgba(255,246,220,.55)');
    /* 地上的光圈 */
    ell(c, 0, -4, 80, 12, 'rgba(255,240,200,.18)');
    c.save(); c.translate(0, -br * 0.6);
    /* 后面的头发 */
    shape(c, k => { k.moveTo(-30, -330); k.bezierCurveTo(-40, -300, -38, -270, -34, -252); k.quadraticCurveTo(0, -244, 34, -252); k.bezierCurveTo(38, -270, 40, -300, 30, -330); });
    c.fillStyle = '#5a3a22'; c.fill();
    /* 长袍 */
    const sway = calm ? 0 : Math.sin(t * 1.1) * 2;
    shape(c, k => { k.moveTo(-36, -268); k.bezierCurveTo(-50, -200, -60, -100, -64 + sway, -12); k.quadraticCurveTo(-30, -2, 0, -8); k.quadraticCurveTo(30, -2, 64 + sway, -12); k.bezierCurveTo(60, -100, 50, -200, 36, -268); });
    c.fillStyle = lin(c, -60, 0, 60, 0, [st.tunic, B_lighter(st.tunic), st.tunic]); c.fill();
    c.strokeStyle = 'rgba(60,40,30,.18)'; c.lineWidth = 1.4;
    [-28, -8, 14, 34].forEach((x, i) => { c.beginPath(); c.moveTo(x * 0.5, -220); c.quadraticCurveTo(x * 0.9, -120, x * 1.2 + sway * 0.6, -14); c.stroke(); });
    /* 脚 */
    [-1, 1].forEach(sd => { ell(c, sd * 16, -6, 12, 6, '#e8b890'); c.fillStyle = '#6a4a2a'; c.fillRect(sd * 16 - 10, -6, 20, 2.4); });
    /* 外袍（斗篷） */
    shape(c, k => { k.moveTo(6, -270); k.bezierCurveTo(40, -276, 54, -250, 56, -214); k.lineTo(66 + sway, -16); k.quadraticCurveTo(44, -6, 24, -18); k.lineTo(-34, -120); k.bezierCurveTo(-44, -142, -24, -170, -2, -190); k.bezierCurveTo(16, -206, 12, -250, 6, -270); });
    c.fillStyle = lin(c, -30, -270, 70, -20, [B_lighter(st.mantle), st.mantle, st.mantle]); c.fill();
    c.strokeStyle = 'rgba(40,10,10,.25)'; c.lineWidth = 1.4;
    [[30, -230, 50, -40], [16, -180, 34, -60], [-10, -160, 10, -110]].forEach(l => { c.beginPath(); c.moveTo(l[0], l[1]); c.quadraticCurveTo(l[0] + 10, (l[1] + l[3]) / 2, l[2], l[3]); c.stroke(); });
    if (st.icon) { c.strokeStyle = '#e8c060'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-34, -120); c.lineTo(24, -18); c.stroke(); }
    /* 圣心 */
    if (st.heart) {
      const hx = 0, hyy = -222, pulse = calm ? 1 : 1 + Math.sin(t * 2.4) * 0.06;
      glow(c, hx, hyy, 40 * pulse, 'rgba(255,170,90,.5)');
      c.save(); c.translate(hx, hyy); c.scale(pulse, pulse);
      shape(c, k => { k.moveTo(0, 10); k.bezierCurveTo(-16, 0, -14, -14, -6, -14); k.quadraticCurveTo(-1, -14, 0, -8); k.quadraticCurveTo(1, -14, 6, -14); k.bezierCurveTo(14, -14, 16, 0, 0, 10); });
      c.fillStyle = '#d62a2a'; c.fill();
      c.strokeStyle = '#5a7a3a'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(0, -3, 11, 4, 0, 0, TAU); c.stroke();
      c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(-4, -12); c.quadraticCurveTo(0, -26 - (calm ? 0 : Math.sin(t * 8) * 2), 4, -12); c.fill();
      c.strokeStyle = '#f4e0a0'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, -18); c.lineTo(0, -30); c.moveTo(-3.5, -26); c.lineTo(3.5, -26); c.stroke();
      c.restore();
    }
    /* 手臂 */
    if (st.arms === 'open') {
      [-1, 1].forEach(sd => {
        const lift = calm ? 0 : Math.sin(t * TAU / 5 + 0.6) * 1.5;
        shape(c, k => { k.moveTo(sd * 30, -270); k.bezierCurveTo(sd * 70, -262, sd * 96, -224, sd * 108, -190 - lift); k.lineTo(sd * 92, -176 - lift); k.bezierCurveTo(sd * 76, -200, sd * 54, -224, sd * 34, -232); });
        c.fillStyle = sd > 0 && st.mantle ? lin(c, 30, -270, 108, -176, [st.tunic, st.tunic]) : st.tunic; c.fill();
        c.strokeStyle = 'rgba(60,40,30,.2)'; c.lineWidth = 1; c.stroke();
        /* 手心朝外 */
        c.save(); c.translate(sd * 104, -176 - lift); c.rotate(sd * 0.5);
        ell(c, 0, 0, 9, 10, '#f0c49c');
        for (let i = 0; i < 4; i++) { const fx = -6 + i * 4, fl = i === 1 || i === 2 ? 15 : 12; c.beginPath(); c.moveTo(fx - 1.9, -4); c.lineTo(fx - 1.9, -fl + 2); c.arc(fx, -fl + 2, 1.9, Math.PI, 0); c.lineTo(fx + 1.9, -4); c.fillStyle = '#f0c49c'; c.fill(); }
        c.save(); c.translate(-sd * 8, 2); c.rotate(-sd * 0.9); ell(c, 0, -5, 2.4, 6, '#f0c49c'); c.restore();
        c.strokeStyle = 'rgba(150,90,60,.4)'; c.lineWidth = 0.8; c.beginPath(); c.arc(0, 2, 5, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
        c.restore();
      });
    } else {
      /* 东正教：右手祝福，左手捧福音书 */
      shape(c, k => { k.moveTo(-30, -268); k.bezierCurveTo(-64, -250, -66, -206, -50, -194); k.lineTo(-30, -224); k.lineTo(-28, -236); });
      c.fillStyle = st.tunic; c.fill();
      c.save(); c.translate(-36, -230);
      ell(c, 0, 0, 8, 10, '#e2b48a'); c.fillStyle = '#e2b48a'; c.fillRect(-3, -20, 3.6, 14); c.fillRect(1.4, -21, 3.6, 15); c.fillRect(-7, -10, 3.4, 8);
      c.restore();
      shape(c, k => { k.moveTo(32, -266); k.bezierCurveTo(60, -246, 62, -200, 48, -186); k.lineTo(26, -196); k.lineTo(30, -236); });
      c.fillStyle = st.mantle; c.fill();
      c.save(); c.translate(36, -206); c.rotate(-0.12);
      c.fillStyle = '#7a1a14'; c.fillRect(-22, -30, 40, 52);
      c.strokeStyle = '#e8c060'; c.lineWidth = 2; c.strokeRect(-19, -27, 34, 46);
      c.beginPath(); c.moveTo(-2, -20); c.lineTo(-2, 10); c.moveTo(-12, -8); c.lineTo(8, -8); c.stroke();
      [[-15, -23], [11, -23], [-15, 15], [11, 15]].forEach(p => circ(c, p[0], p[1], 2.2, '#4a8ac0'));
      ell(c, 16, 10, 9, 8, '#e2b48a');
      c.restore();
    }
    c.restore();
    /* 头 */
    c.save(); c.translate(0, -br);
    c.fillStyle = '#e8b890'; c.fillRect(-9, -294, 18, 22);
    ell(c, 0, -316, 25, 29, '#f0c8a0');
    /* 前面的头发：中分 */
    shape(c, k => { k.moveTo(-27, -312); k.bezierCurveTo(-30, -346, 30, -346, 27, -312); k.quadraticCurveTo(18, -334, 1, -336); k.quadraticCurveTo(-16, -334, -27, -312); });
    c.fillStyle = '#5a3a22'; c.fill();
    shape(c, k => { k.moveTo(-27, -314); k.bezierCurveTo(-34, -290, -32, -270, -24, -256); k.lineTo(-20, -290); });
    c.fill();
    shape(c, k => { k.moveTo(27, -314); k.bezierCurveTo(34, -290, 32, -270, 24, -256); k.lineTo(20, -290); });
    c.fill();
    /* 胡子 */
    shape(c, k => { k.moveTo(-20, -306); k.bezierCurveTo(-22, -286, -12, -280, 0, -279); k.bezierCurveTo(12, -280, 22, -286, 20, -306); k.quadraticCurveTo(14, -294, 0, -295); k.quadraticCurveTo(-14, -294, -20, -306); });
    c.fillStyle = '#5a3a22'; c.fill();
    c.strokeStyle = '#5a3a22'; c.lineWidth = 2.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-9, -301); c.quadraticCurveTo(0, -305, 9, -301); c.stroke();
    c.strokeStyle = 'rgba(190,90,80,.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-4, -297.5); c.quadraticCurveTo(0, -295.5, 4, -297.5); c.stroke();
    /* 眼睛：会眨 */
    [-1, 1].forEach(sd => {
      if (blink) { c.strokeStyle = '#3a2416'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sd * 10 - 4, -318); c.quadraticCurveTo(sd * 10, -316, sd * 10 + 4, -318); c.stroke(); }
      else { ell(c, sd * 10, -318, 2.8, 3.6, '#3a2416'); circ(c, sd * 10 + 0.9, -319.4, 0.9, '#fff'); }
      c.strokeStyle = '#4a2e1a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(sd * 5, -326); c.quadraticCurveTo(sd * 10, -329, sd * 16, -326); c.stroke();
    });
    c.strokeStyle = 'rgba(150,90,60,.6)'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(0, -316); c.quadraticCurveTo(-2.5, -307, 1, -306); c.stroke();
    ell(c, -15, -307, 5, 3, 'rgba(240,120,100,.18)'); ell(c, 15, -307, 5, 3, 'rgba(240,120,100,.18)');
    c.restore();
  }

  /* ---------- 对外 ---------- */
  function place(W, H, fig) {
    const top = H * 0.11, bottom = H * (fig === 'christ' ? 0.76 : 0.74);
    const s = Math.min(W / 300, (bottom - top) / (fig === 'christ' ? 360 : 372));
    return { s, x: W / 2, y: bottom };
  }
  function paint(ctx, W, H, t, def, hall, calm) {
    if (EXTRA[def.id]) { ctx.save(); EXTRA[def.id].paint(ctx, W, H, t, calm, LIB); ctx.restore(); return true; }
    const L = LOOKS[def.id];
    if (!L) return false;
    ctx.save();
    if (L.fig === 'buddha') {
      const st = BUDDHA[L.style];
      bgTemple(ctx, W, H, t, st, calm);
      const p = place(W, H, 'buddha');
      ctx.translate(p.x, p.y); ctx.scale(p.s, p.s);
      buddha(ctx, t, st, calm);
    } else {
      const st = CHRIST[L.style];
      bgChurch(ctx, W, H, t, st, calm);
      const p = place(W, H, 'christ');
      ctx.translate(p.x, p.y); ctx.scale(p.s, p.s);
      christ(ctx, t, st, calm);
    }
    ctx.restore();
    if (L.fig === 'christ' && CHRIST[L.style].icon) {
      ctx.save(); ctx.fillStyle = '#7a2a1e'; ctx.font = 'bold ' + Math.round(Math.min(W, H) * 0.06) + 'px serif'; ctx.textAlign = 'center';
      ctx.fillText('IC', W * 0.22, H * 0.2); ctx.fillText('XC', W * 0.78, H * 0.2); ctx.restore();
    }
    return true;
  }
  /* 给 toon2.js 用：佛像画法（可传入新的样式）、背景和小工具 */
  const LIB = { ell, circ, glow, shape, lin, lighter: B_lighter, buddha, christ, bgTemple, bgChurch, place, BUDDHA, CHRIST, TAU };
  function add(id, look) { EXTRA[id] = look; }
  return { has, name, about, paint, add, LIB, LOOKS };
})();
