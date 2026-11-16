/*
 * 殿内动画版（续）：其余各版本的场景。由 toon.js 的 HallToon.add 登记。
 * - 有神像的传统画神像：泰国的佛（肉髻上有火焰形光焰）、新乘的白色佛像与安贝德卡博士像、印度教的象头神、道教的太上老君。
 * - 不画神像的传统画圣所本身，同样会动：神道的神镜与纸垂、伊斯兰教的礼拜龛与吊灯、犹太教的约柜与长明灯、锡克教的经辇（Palki）与经书。
 */
(function (T) {
  'use strict';
  if (!T || !T.add) return;
  const { ell, circ, glow, shape, lin, lighter, buddha, place, TAU } = T.LIB;
  const Z = (zh, en) => ({ 'zh-CN': zh, en });

  /* 把“设计坐标”（宽 uw、高 uh，原点在底部正中）放进画面 */
  function fit(c, W, H, uw, uh, bottom, top) {
    const b = H * (bottom || 0.74), tp = H * (top || 0.11), s = Math.min(W / uw, (b - tp) / uh);
    c.translate(W / 2, b); c.scale(s, s);
    return s;
  }
  function floor(c, W, H, y, a, b) { c.fillStyle = lin(c, 0, H * y, 0, H, [a, b]); c.fillRect(0, H * y, W, H * (1 - y)); }
  function garland(c, x0, y0, x1, y1, sag, t, calm, cols) {
    const n = 22, sw = calm ? 0 : Math.sin(t * 1.1 + x0 * 0.01) * 3;
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * (sag + sw);
      circ(c, x, y, 4.2, cols[i % cols.length]); circ(c, x - 1.2, y - 1.2, 1.4, 'rgba(255,255,255,.35)');
    }
  }
  function flame(c, x, y, s, t, calm) {
    const f = calm ? 0 : Math.sin(t * 9 + x) * 0.15;
    c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - s * 1.2, s * 5, 'rgba(255,170,70,.35)'); c.restore();
    c.fillStyle = '#ffcf5a'; c.beginPath(); c.moveTo(x, y - s * (2.2 + f)); c.quadraticCurveTo(x + s * 0.85, y - s * 0.5, x, y); c.quadraticCurveTo(x - s * 0.85, y - s * 0.5, x, y - s * (2.2 + f)); c.fill();
    circ(c, x, y - s * 0.55, s * 0.35, '#fff6d0');
  }

  /* ================= 泰国：佛殿（Ubosot） ================= */
  const THAI = { skin: '#e8b94a', skin2: '#b8862a', robe: '#d9a640', robe2: '#a8761e', trim: '#f6dc8a', hair: '#2a2016', inner: '#d9a640', lotus: ['#f2d37a', '#c9962e'], halo: 'none', bare: true, bowl: false, rasmi: true, jewel: false };
  T.add('buddhism.theravada.th', {
    name: { 'zh-CN': '佛像（泰式）', en: 'The Buddha (Thai style)', th: 'พระพุทธรูป' },
    about: Z('泰国佛殿里的主佛多是全身贴金的“降魔印”坐像：右手垂下触地，请大地为证，左手平放在腿上。头顶的肉髻上有一簇火焰形的“光焰”，象征智慧的光明。\n信众会在佛像上贴金箔，所以老佛像常常一层层金光闪闪。', 'The main image of a Thai ordination hall is usually a gilded Buddha “subduing Mara”: the right hand touches the earth as witness, the left rests in the lap. A flame-shaped finial rises from the crown, the light of wisdom.\nDevotees press gold leaf onto the image, so old statues glow with layer upon layer of gold.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#3a0806', '#6a120c', '#3a0806']); c.fillRect(0, 0, W, H);
      /* 红墙上的金色小花 */
      c.fillStyle = 'rgba(240,196,90,.28)';
      for (let y = 30, r = 0; y < H * 0.74; y += 28, r++) for (let x = (r % 2) * 14; x < W; x += 28) { c.save(); c.translate(x, y); c.rotate(Math.PI / 4); c.fillRect(-2.5, -2.5, 5, 5); c.restore(); }
      /* 两侧尖顶窗框和柱子 */
      [-1, 1].forEach(sd => {
        const x = W / 2 + sd * W * 0.42, cw = Math.max(16, W * 0.06);
        c.fillStyle = lin(c, x - cw / 2, 0, x + cw / 2, 0, ['#1e3a2a', '#3a6a4a', '#1e3a2a']); c.fillRect(x - cw / 2, 0, cw, H * 0.8);
        c.fillStyle = '#e8b83a'; for (let y = H * 0.12; y < H * 0.78; y += H * 0.1) c.fillRect(x - cw / 2, y, cw, 3);
        c.fillStyle = '#e8b83a'; c.beginPath(); c.moveTo(x - cw * 0.9, H * 0.08); c.quadraticCurveTo(x, H * 0.04, x + cw * 0.9, H * 0.08); c.lineTo(x + cw * 0.6, H * 0.1); c.lineTo(x - cw * 0.6, H * 0.1); c.fill();
      });
      /* 金色的多层佛座 */
      c.save();
      fit(c, W, H, 300, 400, 0.76);
      [[150, 0, '#8a5a14'], [128, -16, '#c9962e'], [108, -30, '#e8b83a']].forEach(r => { c.fillStyle = r[2]; c.fillRect(-r[0], r[1] - 16, r[0] * 2, 16); c.fillStyle = 'rgba(255,240,190,.4)'; c.fillRect(-r[0], r[1] - 16, r[0] * 2, 2); });
      c.translate(0, -44);
      buddha(c, t, THAI, calm);
      c.restore();
      floor(c, W, H, 0.78, '#5a0c08', '#2a0604');
    },
  });

  /* ================= 新乘佛教：佛像与安贝德卡博士像 ================= */
  const NAVA = { skin: '#f4efe6', skin2: '#cfc5b4', robe: '#ede5d6', robe2: '#c4b8a2', trim: '#d8bc7a', hair: '#3a3c4a', inner: '#d8bc7a', lotus: ['#f8f4ec', '#d4c6ae'], halo: 'none', jewel: false };
  function ambedkar(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    /* 画框 + 万寿菊花环 */
    c.fillStyle = '#5a3a1a'; c.fillRect(-34, -46, 68, 86); c.fillStyle = '#dfe8f2'; c.fillRect(-29, -41, 58, 76);
    /* 西装、衬衫、领带 */
    shape(c, k => { k.moveTo(-26, 35); k.quadraticCurveTo(-24, 4, 0, 0); k.quadraticCurveTo(24, 4, 26, 35); });
    c.fillStyle = '#1f3a7a'; c.fill();
    shape(c, k => { k.moveTo(-7, 1); k.lineTo(0, 14); k.lineTo(7, 1); }); c.fillStyle = '#ffffff'; c.fill();
    c.fillStyle = '#2f5fb8'; c.fillRect(-1.6, 4, 3.2, 14);
    /* 手里的宪法书 */
    c.fillStyle = '#2a4a8a'; c.fillRect(8, 16, 12, 16); c.fillStyle = '#e8c25a'; c.fillRect(10, 18, 8, 1.4);
    /* 头：圆框眼镜、梳向一侧的黑发 */
    c.fillStyle = '#b07a52'; c.fillRect(-4, -6, 8, 8);
    ell(c, 0, -16, 12, 14, '#b67e56');
    shape(c, k => { k.moveTo(-12, -18); k.quadraticCurveTo(-12, -32, 2, -31); k.quadraticCurveTo(13, -30, 12, -18); k.quadraticCurveTo(4, -26, -12, -18); }); c.fillStyle = '#1e1a18'; c.fill();
    c.strokeStyle = '#1e1a18'; c.lineWidth = 1.1; c.beginPath(); c.arc(-4.6, -16, 3.4, 0, TAU); c.moveTo(8, -16); c.arc(4.6, -16, 3.4, 0, TAU); c.moveTo(-1.2, -16); c.lineTo(1.2, -16); c.stroke();
    c.strokeStyle = 'rgba(80,40,20,.7)'; c.beginPath(); c.moveTo(-3, -8); c.quadraticCurveTo(0, -6.5, 3, -8); c.stroke();
    c.restore();
    garland(c, x - 34 * s, y - 46 * s, x + 34 * s, y - 46 * s, 30 * s, 0, true, ['#f29a1e', '#f6c32e', '#f29a1e', '#e8701a']);
  }
  T.add('buddhism.india.navayana', {
    name: { 'zh-CN': '佛陀与安贝德卡博士', en: 'The Buddha and Dr Ambedkar' },
    about: Z('印度新乘佛教的佛堂：白色的佛陀坐像，背后是二十四根辐条的法轮；墙上挂着安贝德卡博士的像，他手里拿着自己主持起草的印度宪法。\n1956 年，安贝德卡带领几十万原属“不可接触者”的民众皈依佛教。两侧的五色旗是佛教旗，蓝色是新乘佛教常用的颜色。', 'A Navayana Buddhist shrine: a white seated Buddha before a 24-spoked Dhamma wheel, and a portrait of Dr B. R. Ambedkar holding the Constitution of India he helped draft.\nIn 1956 Ambedkar led hundreds of thousands of formerly “untouchable” people into Buddhism. The five-coloured Buddhist flag hangs at the sides; blue is the colour of the movement.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#14285a', '#1f3f8a', '#132650']); c.fillRect(0, 0, W, H);
      /* 两侧的佛教旗 */
      const cols = ['#2f62c8', '#f4c430', '#d8322a', '#f8f8f4', '#f08a24'];
      [-1, 1].forEach(sd => {
        const x0 = sd < 0 ? W * 0.03 : W * 0.97 - W * 0.12, sw = calm ? 0 : Math.sin(t * 1.2 + sd) * 2;
        cols.forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.moveTo(x0 + i * W * 0.024, H * 0.05); c.lineTo(x0 + (i + 1) * W * 0.024, H * 0.05); c.lineTo(x0 + (i + 1) * W * 0.024 + sw, H * 0.3); c.lineTo(x0 + i * W * 0.024 + sw, H * 0.3); c.fill(); });
      });
      c.save();
      fit(c, W, H, 320, 400, 0.75);
      /* 法轮：慢慢转 */
      c.save(); c.translate(0, -230); c.rotate(calm ? 0 : t * 0.08);
      c.strokeStyle = 'rgba(240,220,160,.55)'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.stroke();
      c.lineWidth = 2; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; c.beginPath(); c.moveTo(Math.cos(a) * 18, Math.sin(a) * 18); c.lineTo(Math.cos(a) * 146, Math.sin(a) * 146); c.stroke(); }
      circ(c, 0, 0, 18, 'rgba(240,220,160,.55)');
      c.restore();
      buddha(c, t, NAVA, calm);
      c.restore();
      ambedkar(c, W * 0.84, H * 0.42, Math.min(W, H) / 320);
      floor(c, W, H, 0.77, '#1a2a50', '#0c1428');
    },
  });

  /* ================= 印度教：象头神甘尼许 ================= */
  function ganesha(c, t, calm) {
    const br = calm ? 0 : Math.sin(t * TAU / 5);
    const SK = '#ee8e62', SK2 = '#c9653c';
    /* 背后的光圈（prabhavali） */
    c.save(); c.translate(0, -250); c.rotate(calm ? 0 : t * 0.05);
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; c.fillStyle = 'rgba(250,200,90,.5)'; c.beginPath(); c.moveTo(Math.cos(a - 0.06) * 92, Math.sin(a - 0.06) * 92); c.lineTo(Math.cos(a) * 128, Math.sin(a) * 128); c.lineTo(Math.cos(a + 0.06) * 92, Math.sin(a + 0.06) * 92); c.fill(); }
    c.restore();
    circ(c, 0, -250, 94, 'rgba(240,180,70,.35)');
    /* 莲座 */
    ell(c, 0, -40, 130, 26, '#c9302a'); ell(c, 0, -46, 120, 20, '#e8484a');
    for (let i = 0; i < 11; i++) { const x = -120 + i * 24; c.fillStyle = '#f2a0b0'; c.beginPath(); c.moveTo(x - 11, -34); c.quadraticCurveTo(x, -64, x + 11, -34); c.fill(); }
    c.save(); c.translate(0, -br * 0.8);
    /* 盘腿：黄色的腰布，红边 */
    shape(c, k => { k.moveTo(-118, -48); k.bezierCurveTo(-120, -92, -60, -104, 0, -104); k.bezierCurveTo(60, -104, 120, -92, 118, -48); k.quadraticCurveTo(0, -30, -118, -48); });
    c.fillStyle = lin(c, 0, -104, 0, -40, ['#f6c03a', '#d8901a']); c.fill();
    c.strokeStyle = '#c9302a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-116, -50); c.quadraticCurveTo(0, -34, 116, -50); c.stroke();
    ell(c, 78, -64, 20, 9, SK); ell(c, -70, -60, 18, 8, SK2);
    /* 大肚子 + 蛇带 + 圣线 */
    ell(c, 0, -150, 72, 66, lin(c, -70, -200, 70, -90, [SK, SK, SK2]));
    c.strokeStyle = '#3a8a4a'; c.lineWidth = 6; c.beginPath(); c.ellipse(0, -118, 66, 14, 0, 0.05 * Math.PI, 0.95 * Math.PI); c.stroke();
    circ(c, -60, -112, 6, '#3a8a4a'); circ(c, -62, -114, 1.5, '#fff');
    c.strokeStyle = '#f8f0d0'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-38, -214); c.quadraticCurveTo(10, -150, 52, -112); c.stroke();
    circ(c, 0, -146, 4, SK2);
    /* 胸、肩 */
    shape(c, k => { k.moveTo(-58, -222); k.quadraticCurveTo(0, -238, 58, -222); k.lineTo(56, -186); k.quadraticCurveTo(0, -176, -56, -186); });
    c.fillStyle = SK; c.fill();
    c.strokeStyle = '#e8b83a'; c.lineWidth = 5; c.beginPath(); c.moveTo(-40, -222); c.quadraticCurveTo(0, -186, 40, -222); c.stroke();
    [-24, -8, 8, 24].forEach(x => circ(c, x, -204 + Math.abs(x) * 0.3, 3.4, '#d83a3a'));
    /* 四只手：上右斧、上左绳索、下右施无畏、下左托莫达卡甜点 */
    const arm = (sx, sy, ex, ey) => { c.strokeStyle = SK; c.lineCap = 'round'; c.lineWidth = 17; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + ex) / 2 + (ex > 0 ? 10 : -10), (sy + ey) / 2, ex, ey); c.stroke(); c.strokeStyle = '#e8b83a'; c.lineWidth = 3; c.beginPath(); c.arc(ex, ey, 8, 0, TAU); c.stroke(); };
    arm(-56, -214, -98, -258); arm(56, -214, 98, -258); arm(-58, -200, -84, -150); arm(58, -200, 80, -142);
    /* 斧 */
    c.save(); c.translate(-100, -266); c.rotate(-0.3);
    c.fillStyle = '#7a4a22'; c.fillRect(-2, -30, 4, 44); c.fillStyle = '#c8ccd2'; c.beginPath(); c.moveTo(2, -30); c.quadraticCurveTo(20, -26, 18, -10); c.lineTo(2, -14); c.fill();
    c.restore(); circ(c, -100, -262, 9, SK);
    /* 绳索 */
    c.strokeStyle = '#e8b83a'; c.lineWidth = 2.4; c.beginPath(); c.arc(104, -280, 14, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(100, -266); c.quadraticCurveTo(110, -250, 98, -240); c.stroke(); circ(c, 100, -260, 9, SK);
    /* 施无畏印 */
    c.save(); c.translate(-88, -152); ell(c, 0, 0, 10, 12, SK); for (let i = 0; i < 4; i++) { c.fillStyle = SK; c.fillRect(-7 + i * 4, -18, 3.4, 10); } circ(c, 0, 0, 2.6, '#d83a3a'); c.restore();
    /* 莫达卡 */
    ell(c, 84, -134, 18, 7, '#c8a050');
    [[-7, 0], [7, 0], [0, -6]].forEach(p => { c.fillStyle = '#f4e2b0'; c.beginPath(); c.moveTo(84 + p[0] - 6, -138 + p[1]); c.quadraticCurveTo(84 + p[0], -152 + p[1], 84 + p[0] + 6, -138 + p[1]); c.fill(); });
    c.restore();
    /* 头：大耳朵、象鼻（向他自己的左边弯）、一根断牙 */
    c.save(); c.translate(0, -br * 1.2);
    const ear = calm ? 0 : Math.sin(t * 1.6) * 0.06;
    [-1, 1].forEach(sd => {
      c.save(); c.translate(sd * 40, -272); c.rotate(sd * ear);
      shape(c, k => { k.moveTo(0, -36); k.bezierCurveTo(sd * 62, -46, sd * 70, 24, sd * 18, 34); k.quadraticCurveTo(sd * 4, 10, 0, -36); });
      c.fillStyle = SK2; c.fill();
      shape(c, k => { k.moveTo(sd * 6, -26); k.bezierCurveTo(sd * 50, -34, sd * 54, 16, sd * 18, 24); k.quadraticCurveTo(sd * 8, 4, sd * 6, -26); });
      c.fillStyle = '#f2a8a0'; c.fill();
      c.restore();
    });
    ell(c, 0, -276, 44, 46, lin(c, -40, -320, 40, -230, [lighter(SK), SK, SK2]));
    /* 王冠 */
    shape(c, k => { k.moveTo(-34, -306); k.lineTo(-24, -352); k.lineTo(0, -372); k.lineTo(24, -352); k.lineTo(34, -306); k.quadraticCurveTo(0, -316, -34, -306); });
    c.fillStyle = lin(c, -34, 0, 34, 0, ['#b8862a', '#f8dc80', '#b8862a']); c.fill();
    [[-14, -330, '#d83a3a'], [14, -330, '#2fa06a'], [0, -350, '#2f62c8']].forEach(p => circ(c, p[0], p[1], 4, p[2]));
    circ(c, 0, -376, 5, '#f8dc80');
    /* 额头的三道白灰和红点 */
    c.strokeStyle = '#fff8ec'; c.lineWidth = 2.2; [-298, -293, -288].forEach(y => { c.beginPath(); c.moveTo(-16, y); c.quadraticCurveTo(0, y - 2, 16, y); c.stroke(); });
    circ(c, 0, -291, 3, '#d83a3a');
    /* 眼睛 */
    [-1, 1].forEach(sd => { ell(c, sd * 16, -278, 5, 3.4, '#fff'); circ(c, sd * 16, -278, 2.4, '#2a1a10'); c.strokeStyle = '#2a1a10'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(sd * 10, -281); c.quadraticCurveTo(sd * 16, -283, sd * 22, -280); c.stroke(); });
    /* 牙：左边（他的右边）断了一半 */
    c.fillStyle = '#fff6e0';
    shape(c, k => { k.moveTo(-16, -252); k.quadraticCurveTo(-24, -240, -22, -234); k.lineTo(-14, -238); k.quadraticCurveTo(-12, -246, -10, -254); }); c.fill();
    shape(c, k => { k.moveTo(16, -252); k.quadraticCurveTo(32, -232, 40, -212); k.quadraticCurveTo(30, -224, 12, -244); }); c.fill();
    /* 象鼻：从脸中间垂下，向画面右边卷到甜点那里 */
    const sw = calm ? 0 : Math.sin(t * 1.3) * 4;
    c.strokeStyle = SK; c.lineCap = 'round'; c.lineWidth = 19;
    c.beginPath(); c.moveTo(0, -262); c.bezierCurveTo(-4, -220, 8, -190, 34 + sw * 0.5, -176); c.quadraticCurveTo(58 + sw, -168, 62 + sw, -184); c.stroke();
    c.strokeStyle = 'rgba(150,70,40,.4)'; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const u = i / 6; c.beginPath(); c.moveTo(-8 + u * 30, -246 + u * 64); c.lineTo(6 + u * 34, -246 + u * 66); c.stroke(); }
    c.restore();
    /* 坐骑小老鼠 */
    c.save(); c.translate(104, -20);
    ell(c, 0, 0, 16, 10, '#8a8a92'); circ(c, 14, -4, 7, '#9a9aa2'); circ(c, 13, -10, 3.4, '#c8a0a8'); circ(c, 18, -5, 1.2, '#111');
    c.strokeStyle = '#8a8a92'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-16, 2); c.quadraticCurveTo(-28, 4, -26, -8); c.stroke();
    ell(c, 22, 4, 4, 3, '#f4e2b0');
    c.restore();
  }
  T.add('hinduism.ghat', {
    name: Z('象头神甘尼许', 'Ganesha'),
    about: Z('象头神甘尼许是“排除障碍之神”，开始一件事之前先拜他。四只手分别拿着斧头（斩断执着）、绳索、莫达卡甜点，另一只手施无畏印；一根象牙是断的，传说他用它写下了《摩诃婆罗多》。\n他的坐骑是一只小老鼠。额头上三道白灰和一点朱红是湿婆派信徒的记号。', 'Ganesha, remover of obstacles, is honoured before any undertaking. His four hands hold an axe (cutting attachment), a noose and a modak sweet, the fourth raised in blessing; one tusk is broken, the pen with which he is said to have written the Mahabharata.\nHis mount is a little mouse. The three white lines and red dot on his brow are the Shaiva tilak.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#1e120c', '#3a2014', '#1e120c']); c.fillRect(0, 0, W, H);
      /* 石墙 */
      c.strokeStyle = 'rgba(255,220,170,.06)'; c.lineWidth = 1;
      for (let y = 0; y < H; y += 22) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = (y / 22) % 2 ? 0 : 20; x < W; x += 40) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 22); c.stroke(); } }
      /* 万寿菊花串 */
      for (let i = 0; i < 3; i++) garland(c, -10, H * (0.04 + i * 0.025), W + 10, H * (0.04 + i * 0.025), H * 0.05, t + i, calm, i % 2 ? ['#f29a1e', '#f6c32e'] : ['#e8701a', '#f6c32e', '#e8701a', '#fff4d0']);
      /* 两侧的黄铜油灯 */
      [-1, 1].forEach(sd => { const x = W / 2 + sd * W * 0.4, y = H * 0.7; c.fillStyle = '#b8862a'; c.fillRect(x - 3, y - 50, 6, 50); ell(c, x, y - 50, 16, 5, '#d8a840'); ell(c, x, y, 18, 5, '#8a5a14'); flame(c, x, y - 54, 4, t, calm); });
      c.save(); fit(c, W, H, 300, 400, 0.75); ganesha(c, t, calm); c.restore();
      floor(c, W, H, 0.77, '#2a1810', '#120a06');
    },
  });

  /* ================= 道教：太上老君 ================= */
  function laojun(c, t, calm) {
    const br = calm ? 0 : Math.sin(t * TAU / 6);
    /* 太极头光：慢慢转 */
    c.save(); c.translate(0, -296); c.rotate(calm ? 0 : t * 0.15);
    circ(c, 0, 0, 66, 'rgba(250,240,220,.85)');
    c.fillStyle = '#1e1a22'; c.beginPath(); c.arc(0, 0, 66, -Math.PI / 2, Math.PI / 2); c.arc(0, 33, 33, Math.PI / 2, -Math.PI / 2, true); c.arc(0, -33, 33, Math.PI / 2, -Math.PI / 2); c.fill();
    circ(c, 0, -33, 9, '#1e1a22'); circ(c, 0, 33, 9, 'rgba(250,240,220,1)');
    c.restore();
    glow(c, 0, -296, 110, 'rgba(255,230,170,.25)');
    /* 宝座 */
    c.fillStyle = '#7a1e14'; c.fillRect(-120, -250, 240, 250);
    c.fillStyle = '#e8b83a'; c.fillRect(-124, -254, 248, 8); c.fillRect(-124, -8, 248, 8);
    c.strokeStyle = 'rgba(232,184,58,.6)'; c.lineWidth = 2; c.strokeRect(-110, -238, 220, 222);
    c.save(); c.translate(0, -br * 0.8);
    /* 袍子：黄袍、紫领、八卦纹 */
    shape(c, k => { k.moveTo(-60, -238); k.bezierCurveTo(-100, -230, -112, -180, -112, -120); k.lineTo(-124, -16); k.quadraticCurveTo(0, -2, 124, -16); k.lineTo(112, -120); k.bezierCurveTo(112, -180, 100, -230, 60, -238); });
    c.fillStyle = lin(c, -120, 0, 120, 0, ['#c9902a', '#ecbd52', '#d9a43a', '#a8761e']); c.fill();
    c.strokeStyle = '#3a2a6a'; c.lineWidth = 10; c.beginPath(); c.moveTo(-34, -238); c.quadraticCurveTo(-4, -170, 10, -110); c.moveTo(34, -238); c.quadraticCurveTo(10, -200, 10, -110); c.stroke();
    c.strokeStyle = 'rgba(80,40,10,.4)'; c.lineWidth = 2;
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, x = Math.cos(a) * 34, y = -70 + Math.sin(a) * 18; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 6, y); c.moveTo(x - 6, y + 3); c.lineTo(x - 1, y + 3); c.moveTo(x + 1, y + 3); c.lineTo(x + 6, y + 3); c.stroke(); }
    /* 袖子和手：左手持拂尘搭在臂弯，右手放在膝上 */
    [-1, 1].forEach(sd => {
      shape(c, k => { k.moveTo(sd * 58, -232); k.bezierCurveTo(sd * 112, -210, sd * 116, -130, sd * 84, -112); k.lineTo(sd * 40, -112); k.bezierCurveTo(sd * 62, -150, sd * 66, -190, sd * 50, -210); });
      c.fillStyle = lin(c, sd * 40, -232, sd * 116, -112, ['#d9a43a', '#b8862a']); c.fill();
      c.strokeStyle = '#3a2a6a'; c.lineWidth = 5; c.beginPath(); c.moveTo(sd * 84, -114); c.lineTo(sd * 40, -114); c.stroke();
    });
    ell(c, 56, -120, 13, 10, '#f0c8a0');
    /* 拂尘 */
    const sway = calm ? 0 : Math.sin(t * 1.1) * 3;
    c.save(); c.translate(-50, -124);
    c.fillStyle = '#5a3a1a'; c.fillRect(-3, -70, 6, 74); circ(c, 0, -72, 5, '#e8b83a');
    c.strokeStyle = 'rgba(250,250,245,.9)'; c.lineWidth = 1.4;
    for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-1 + i * 0.2, -72); c.bezierCurveTo(-20 - i * 2, -90, -40 - i * 1.5 + sway, -60, -46 - i * 1.2 + sway, -10 + i * 2); c.stroke(); }
    c.restore();
    ell(c, -48, -120, 13, 10, '#f0c8a0');
    c.restore();
    /* 头：白发、长眉、长须、道冠 */
    c.save(); c.translate(0, -br);
    ell(c, 0, -282, 34, 40, '#f2caa0');
    [-1, 1].forEach(sd => { ell(c, sd * 34, -276, 7, 15, '#e8b890'); });
    shape(c, k => { k.moveTo(-34, -290); k.bezierCurveTo(-36, -322, 36, -322, 34, -290); k.quadraticCurveTo(0, -304, -34, -290); }); c.fillStyle = '#f4f2ee'; c.fill();
    ell(c, 0, -320, 14, 12, '#f4f2ee');
    /* 道冠 */
    shape(c, k => { k.moveTo(-14, -326); k.lineTo(-10, -346); k.quadraticCurveTo(0, -354, 10, -346); k.lineTo(14, -326); }); c.fillStyle = lin(c, -14, 0, 14, 0, ['#b8862a', '#f8dc80', '#b8862a']); c.fill();
    c.fillStyle = '#e8b83a'; c.fillRect(-22, -334, 44, 3);
    /* 长眉垂下来 */
    c.strokeStyle = '#f8f8f4'; c.lineWidth = 4; c.lineCap = 'round';
    [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 6, -294); c.quadraticCurveTo(sd * 22, -300, sd * 36, -278); c.stroke(); });
    /* 眯着的眼、红脸颊 */
    c.strokeStyle = '#4a2a1a'; c.lineWidth = 1.6;
    [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 8, -284); c.quadraticCurveTo(sd * 15, -279, sd * 22, -284); c.stroke(); });
    ell(c, -20, -270, 7, 4, 'rgba(240,110,90,.3)'); ell(c, 20, -270, 7, 4, 'rgba(240,110,90,.3)');
    /* 长须 */
    const bs = calm ? 0 : Math.sin(t * 0.9) * 2;
    shape(c, k => { k.moveTo(-24, -268); k.quadraticCurveTo(-26, -236, -8 + bs, -186); k.quadraticCurveTo(0, -176, 8 + bs, -186); k.quadraticCurveTo(26, -236, 24, -268); k.quadraticCurveTo(0, -252, -24, -268); });
    c.fillStyle = '#f8f6f2'; c.fill();
    c.strokeStyle = 'rgba(160,160,170,.5)'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 7, -260); c.quadraticCurveTo(i * 6, -230, i * 2 + bs, -194); c.stroke(); }
    c.strokeStyle = '#f8f6f2'; c.lineWidth = 3; c.beginPath(); c.moveTo(-14, -266); c.quadraticCurveTo(-26, -262, -30, -250); c.moveTo(14, -266); c.quadraticCurveTo(26, -262, 30, -250); c.stroke();
    c.restore();
  }
  T.add('daoism.mountain', {
    name: Z('太上老君', 'Taishang Laojun'),
    about: Z('太上老君是道教尊奉的“三清”之一（道德天尊），一般认为就是写《道德经》的老子。画像里他白发长须、长眉垂下，手持拂尘，坐在宝座上。\n背后的太极图表示阴阳相生；拂尘是道士拂去尘俗的法器。', 'Taishang Laojun, one of the Three Pure Ones (the Celestial Worthy of the Way and its Virtue), is identified with Laozi, author of the Daodejing. He is shown white-haired with long brows and beard, holding a horsetail whisk on his throne.\nThe taiji behind him shows yin and yang giving rise to each other; the whisk brushes away the dust of the world.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#120c10', '#2a1a1a', '#160e0c']); c.fillRect(0, 0, W, H);
      /* 飘动的祥云 */
      c.fillStyle = 'rgba(240,220,180,.06)';
      for (let i = 0; i < 6; i++) { const x = ((i * 97 + (calm ? 0 : t * 6)) % (W + 120)) - 60, y = H * (0.1 + (i % 3) * 0.12); [0, 18, 34].forEach((d, k) => circ(c, x + d, y - (k === 1 ? 8 : 0), 16, 'rgba(240,220,180,.07)')); }
      [-1, 1].forEach(sd => { const x = W / 2 + sd * W * 0.43, cw = Math.max(16, W * 0.065); c.fillStyle = lin(c, x - cw / 2, 0, x + cw / 2, 0, ['#4a0f08', '#a02818', '#3a0a06']); c.fillRect(x - cw / 2, 0, cw, H * 0.84); });
      /* 匾 */
      c.fillStyle = '#1e2a4a'; c.fillRect(W / 2 - W * 0.22, H * 0.035, W * 0.44, H * 0.05); c.strokeStyle = '#e8b83a'; c.lineWidth = 2; c.strokeRect(W / 2 - W * 0.22, H * 0.035, W * 0.44, H * 0.05);
      c.fillStyle = '#f0c860'; c.font = '700 ' + Math.round(H * 0.03) + 'px "Noto Serif SC","Songti SC",serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('道德天尊', W / 2, H * 0.06);
      c.save(); fit(c, W, H, 300, 380, 0.76, 0.13); laojun(c, t, calm); c.restore();
      floor(c, W, H, 0.78, '#24140e', '#100806');
    },
  });

  /* ================= 神道：拜殿里的神镜 ================= */
  T.add('shinto.shrine', {
    name: Z('神镜', 'The sacred mirror'),
    about: Z('神道不为神造像。拜殿正中供的常是一面圆镜，两边是插着杨桐（榊）枝的花瓶和白色的纸垂“御币”，头上横着一根粗粗的稻草注连绳，挂着锯齿形的白纸“纸垂”，标出神圣的地方。\n人站在镜前，看到的是自己，也提醒人清明正直。', 'Shinto makes no images of the kami. At the centre of the worship hall there is often a round mirror, with branches of sakaki in vases and white paper wands (gohei) on either side, and a thick straw rope (shimenawa) hung with zigzag paper streamers marking the sacred space.\nStanding before the mirror one sees oneself: a reminder to be clear and upright.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#3a2a1a', '#5a4026', '#2a1c10']); c.fillRect(0, 0, W, H);
      /* 木板墙和竹帘 */
      c.strokeStyle = 'rgba(30,18,8,.35)'; c.lineWidth = 1; for (let x = 0; x < W; x += 26) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H * 0.78); c.stroke(); }
      c.fillStyle = 'rgba(200,170,110,.35)'; c.fillRect(0, H * 0.08, W, H * 0.12);
      c.strokeStyle = 'rgba(90,60,30,.5)'; for (let y = H * 0.08; y < H * 0.2; y += 4) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      /* 注连绳 + 纸垂 */
      const ry = H * 0.21;
      c.strokeStyle = '#c8b070'; c.lineWidth = Math.max(12, H * 0.022); c.lineCap = 'round';
      c.beginPath(); c.moveTo(-10, ry - 6); c.quadraticCurveTo(W / 2, ry + H * 0.03, W + 10, ry - 6); c.stroke();
      c.strokeStyle = 'rgba(120,90,30,.5)'; c.lineWidth = 2; for (let x = 0; x < W; x += 10) { c.beginPath(); c.moveTo(x, ry - 10); c.lineTo(x + 8, ry + 8); c.stroke(); }
      [0.2, 0.4, 0.6, 0.8].forEach((f, i) => {
        const x = W * f, y = ry + 8 + Math.sin(f * Math.PI) * H * 0.02, sw = calm ? 0 : Math.sin(t * 1.4 + i) * 0.12;
        c.save(); c.translate(x, y); c.rotate(sw);
        c.fillStyle = '#fbfaf6'; const s = H * 0.022;
        c.beginPath(); c.moveTo(-s * 0.5, 0); c.lineTo(s * 0.5, 0); c.lineTo(s * 0.5, s); c.lineTo(-s * 0.2, s); c.lineTo(-s * 0.2, s * 2); c.lineTo(s * 0.7, s * 2); c.lineTo(s * 0.7, s * 3); c.lineTo(-s * 0.1, s * 3); c.lineTo(-s * 0.1, s * 4); c.lineTo(-s * 0.9, s * 4); c.lineTo(-s * 0.9, s * 3.2); c.lineTo(-s * 0.4, s * 3.2); c.lineTo(-s * 0.4, s * 2.2); c.lineTo(-s * 1.0, s * 2.2); c.lineTo(-s * 1.0, s * 1.2); c.lineTo(-s * 0.5, s * 1.2); c.closePath(); c.fill();
        c.restore();
      });
      c.save(); fit(c, W, H, 300, 330, 0.74, 0.26);
      /* 神镜：圆镜 + 波浪形的镜台 */
      c.fillStyle = '#6a4a26'; c.fillRect(-10, -90, 20, 90);
      [-1, 1].forEach(sd => { c.strokeStyle = '#8a6430'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, -60); c.bezierCurveTo(sd * 30, -50, sd * 40, -20, sd * 60, 0); c.stroke(); });
      circ(c, 0, -170, 86, '#6a4a1e'); circ(c, 0, -170, 78, lin(c, -78, -248, 78, -92, ['#f4f0e0', '#c8c0a8', '#8a8470', '#d8d0b8']));
      const sweep = calm ? 0.3 : (t * 0.18) % 1.6 - 0.3;
      c.save(); c.beginPath(); c.arc(0, -170, 78, 0, TAU); c.clip();
      c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,255,240,.35)';
      c.beginPath(); c.moveTo(-90 + sweep * 180, -260); c.lineTo(-60 + sweep * 180, -260); c.lineTo(-120 + sweep * 180, -80); c.lineTo(-150 + sweep * 180, -80); c.fill();
      c.restore();
      c.strokeStyle = '#e8c25a'; c.lineWidth = 3; c.beginPath(); c.arc(0, -170, 82, 0, TAU); c.stroke();
      /* 两边的榊和御币 */
      [-1, 1].forEach(sd => {
        const x = sd * 118;
        c.fillStyle = '#f4f2ec'; c.fillRect(x - 10, -50, 20, 50); ell(c, x, -50, 10, 3, '#e8e6e0');
        for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.25, sw = calm ? 0 : Math.sin(t * 1.2 + i) * 0.04; c.save(); c.translate(x, -54); c.rotate(a + Math.PI / 2 + sw); ell(c, 0, -40 - (i % 3) * 8, 6, 14, i % 2 ? '#2f6a3a' : '#3f7a44'); c.restore(); }
        const gx = sd * 70; c.fillStyle = '#c8a878'; c.fillRect(gx - 1.5, -150, 3, 150);
        for (let k = 0; k < 2; k++) { const s2 = 7, sw = calm ? 0 : Math.sin(t * 1.5 + k + sd) * 0.1; c.save(); c.translate(gx + (k ? 3 : -3), -148); c.rotate(sw + (k ? 0.1 : -0.1)); c.fillStyle = '#fbfaf6'; c.beginPath(); c.moveTo(0, 0); c.lineTo(s2, 0); c.lineTo(s2, s2 * 2); c.lineTo(0, s2 * 2); c.lineTo(0, s2 * 3.6); c.lineTo(-s2, s2 * 3.6); c.lineTo(-s2, s2 * 1.6); c.lineTo(0, s2 * 1.6); c.closePath(); c.fill(); c.restore(); }
      });
      /* 三方（供台）+ 酒瓶 */
      c.fillStyle = '#e8d8b8'; c.fillRect(-40, -18, 80, 18); c.fillStyle = '#d8c8a4'; c.fillRect(-30, -6, 60, 6);
      [-14, 14].forEach(x => { ell(c, x, -30, 7, 12, '#fbfaf6'); c.fillStyle = '#fbfaf6'; c.fillRect(x - 3, -46, 6, 8); });
      c.restore();
      floor(c, W, H, 0.76, '#6a4a2a', '#3a2614');
    },
  });

  /* ================= 伊斯兰教：礼拜龛（米哈拉布） ================= */
  T.add('islam.mosque', {
    name: Z('礼拜龛（米哈拉布）', 'The mihrab'),
    about: Z('清真寺里没有任何偶像。正面墙上的拱形壁龛叫“米哈拉布”，指示麦加天房的方向，大家朝着它礼拜。右边的台阶是“敏拜尔”，伊玛目在上面宣讲。\n装饰只用几何图案、花草纹和书法。上面一行写的是“奉至仁至慈的真主之名”。', 'A mosque holds no images. The arched niche in the front wall, the mihrab, shows the direction of the Kaaba in Mecca, which everyone faces in prayer. The stepped pulpit to its right is the minbar, from which the imam preaches.\nDecoration is geometry, foliage and calligraphy. The line above reads “In the name of God, the Most Gracious, the Most Merciful.”'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#e8e0d0', '#d8ccb6', '#b8a88c']); c.fillRect(0, 0, W, H);
      /* 两侧的几何星纹 */
      const star = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, q = k % 2 ? r * 0.55 : r; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.fill(); };
      for (let y = 20, r = 0; y < H * 0.75; y += 40, r++) for (let x = (r % 2) * 20; x < W; x += 40) { if (Math.abs(x - W / 2) < W * 0.26) continue; star(x, y, 13, 'rgba(30,110,140,.35)'); star(x, y, 6, 'rgba(200,150,60,.4)'); }
      /* 书法带 */
      c.fillStyle = '#1e5a7a'; c.fillRect(0, H * 0.06, W, H * 0.06);
      c.fillStyle = '#f0d27a'; c.font = '600 ' + Math.round(H * 0.032) + 'px "Noto Naskh Arabic","Geeza Pro","Amiri","Arial",serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', W / 2, H * 0.09);
      /* 米哈拉布：尖拱壁龛，蓝绿瓷砖，顶上一圈钟乳石般的“穆卡纳斯” */
      const mx = W / 2, mw = Math.min(W * 0.46, H * 0.3), top = H * 0.17, bot = H * 0.74;
      const arch = (d) => { c.beginPath(); c.moveTo(mx - mw / 2 - d, bot); c.lineTo(mx - mw / 2 - d, top + mw * 0.55); c.quadraticCurveTo(mx - mw / 2 - d, top - d, mx, top - mw * 0.12 - d); c.quadraticCurveTo(mx + mw / 2 + d, top - d, mx + mw / 2 + d, top + mw * 0.55); c.lineTo(mx + mw / 2 + d, bot); c.closePath(); };
      arch(18); c.fillStyle = '#c8a050'; c.fill();
      arch(10); c.fillStyle = '#1e7a8a'; c.fill();
      arch(0); c.fillStyle = lin(c, 0, top, 0, bot, ['#0e3a4a', '#16566a', '#0e3a4a']); c.fill();
      c.save(); arch(0); c.clip();
      for (let y = top + mw * 0.6; y < bot; y += 18) for (let x = mx - mw / 2; x < mx + mw / 2; x += 18) { star(x + 9, y + 9, 6, 'rgba(120,200,210,.35)'); }
      for (let r = 0; r < 4; r++) for (let i = 0; i < 5 + r; i++) { const x = mx - mw * 0.4 + (i + 0.5) * mw * 0.8 / (5 + r), y = top + r * 12; c.fillStyle = r % 2 ? 'rgba(240,210,120,.45)' : 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(x, y + 10, mw * 0.06, Math.PI, 0); c.fill(); }
      c.restore();
      /* 吊灯：一排玻璃灯，轻轻晃，火光闪 */
      for (let i = 0; i < 5; i++) {
        const lx = W * (0.14 + i * 0.18), sw = calm ? 0 : Math.sin(t * 0.8 + i) * 3, ly = H * (0.3 + (i % 2) * 0.04);
        c.strokeStyle = 'rgba(80,60,30,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, H * 0.12); c.lineTo(lx + sw, ly - 14); c.stroke();
        c.save(); c.globalCompositeOperation = 'lighter'; glow(c, lx + sw, ly, 46, 'rgba(255,190,90,' + (0.35 + (calm ? 0 : Math.sin(t * 7 + i) * 0.05)) + ')'); c.restore();
        c.fillStyle = 'rgba(200,240,230,.55)'; c.beginPath(); c.moveTo(lx + sw - 9, ly - 12); c.quadraticCurveTo(lx + sw - 14, ly + 6, lx + sw, ly + 10); c.quadraticCurveTo(lx + sw + 14, ly + 6, lx + sw + 9, ly - 12); c.fill();
        circ(c, lx + sw, ly + 2, 3, '#fff2b0');
      }
      /* 敏拜尔：右边的台阶讲坛 */
      const bx = mx + mw / 2 + W * 0.06, bw = W * 0.2;
      c.fillStyle = '#6a4220';
      c.beginPath(); c.moveTo(bx, bot); c.lineTo(bx + bw, bot); c.lineTo(bx + bw, bot - H * 0.22); c.lineTo(bx + bw * 0.75, bot - H * 0.22); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(240,200,120,.4)'; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(bx + bw * 0.15 * i, bot - H * 0.035 * i); c.lineTo(bx + bw, bot - H * 0.035 * i); c.stroke(); }
      c.fillStyle = '#7a4c24'; c.fillRect(bx + bw * 0.75, bot - H * 0.3, bw * 0.25, H * 0.08);
      c.beginPath(); c.moveTo(bx + bw * 0.73, bot - H * 0.3); c.lineTo(bx + bw * 0.875, bot - H * 0.36); c.lineTo(bx + bw * 1.02, bot - H * 0.3); c.fillStyle = '#c8a050'; c.fill();
      /* 地毯：一排排拱形的礼拜毯 */
      c.fillStyle = '#7a1a1e'; c.fillRect(0, bot, W, H - bot);
      for (let y = bot + 4, r = 0; y < H; y += 46, r++) for (let x = 2; x < W; x += 40) { c.strokeStyle = 'rgba(240,200,120,.45)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 4, y + 40); c.lineTo(x + 4, y + 14); c.quadraticCurveTo(x + 4, y + 2, x + 18, y); c.quadraticCurveTo(x + 32, y + 2, x + 32, y + 14); c.lineTo(x + 32, y + 40); c.stroke(); }
    },
  });

  /* ================= 犹太教：约柜与长明灯 ================= */
  T.add('judaism.shabbat', {
    name: Z('约柜与长明灯', 'The Ark and the eternal light'),
    about: Z('会堂正面是“约柜”（Aron Kodesh），里面收着手抄的《妥拉》经卷，前面挂着绣花的帷幔。约柜上方常刻着十诫的两块石版，前面悬着一盏永远不灭的“长明灯”（Ner Tamid）。\n会堂里不放人像。礼拜时大家面向约柜，也就是面向耶路撒冷。', 'At the front of a synagogue stands the Ark (Aron Kodesh), holding the handwritten Torah scrolls behind an embroidered curtain. Above it are often the two tablets of the Ten Commandments, and before it hangs the eternal light (Ner Tamid), never put out.\nThere are no human images. Worshippers face the Ark, and so face Jerusalem.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#e6dcc8', '#d4c6aa', '#b4a284']); c.fillRect(0, 0, W, H);
      c.strokeStyle = 'rgba(120,100,70,.18)'; for (let y = 0; y < H * 0.76; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      c.save(); fit(c, W, H, 300, 420, 0.76, 0.06);
      /* 十诫石版 */
      [-1, 1].forEach(sd => {
        const x = sd * 30; c.fillStyle = '#f4f0e6'; c.beginPath(); c.moveTo(x - 26, -330); c.lineTo(x - 26, -380); c.arc(x, -380, 26, Math.PI, 0); c.lineTo(x + 26, -330); c.closePath(); c.fill();
        c.strokeStyle = '#8a7a5a'; c.lineWidth = 1.5; c.stroke();
        c.fillStyle = '#3a3a5a'; c.font = '600 10px "Noto Serif Hebrew","Times New Roman",serif'; c.textAlign = 'center';
        const L = sd < 0 ? ['א', 'ב', 'ג', 'ד', 'ה'] : ['ו', 'ז', 'ח', 'ט', 'י']; L.forEach((ch, i) => c.fillText(ch, x, -394 + i * 13));
      });
      /* 约柜：木柜 + 绣花帷幔 */
      c.fillStyle = '#5a3418'; c.fillRect(-110, -280, 220, 280);
      c.fillStyle = '#c8962e'; c.fillRect(-116, -286, 232, 10);
      c.beginPath(); c.moveTo(-116, -286); c.lineTo(0, -318); c.lineTo(116, -286); c.closePath(); c.fill();
      const cw = calm ? 0 : Math.sin(t * 0.9) * 2;
      c.beginPath(); c.moveTo(-92, -262); c.lineTo(92, -262); c.quadraticCurveTo(96 + cw, -130, 92 + cw * 1.5, -14); c.lineTo(-92 + cw * 1.5, -14); c.quadraticCurveTo(-96 + cw, -130, -92, -262); c.closePath();
      c.fillStyle = lin(c, -92, 0, 92, 0, ['#14205a', '#2a3a8a', '#1e2c70', '#14205a']); c.fill();
      c.strokeStyle = '#e8c25a'; c.lineWidth = 3; c.strokeRect(-84, -254, 168, 232);
      /* 大卫星 */
      c.lineWidth = 4; c.beginPath(); for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * TAU / 3; c.lineTo(Math.cos(a) * 34, -170 + Math.sin(a) * 34); } c.closePath(); c.stroke();
      c.beginPath(); for (let k = 0; k < 3; k++) { const a = Math.PI / 2 + k * TAU / 3; c.lineTo(Math.cos(a) * 34, -170 + Math.sin(a) * 34); } c.closePath(); c.stroke();
      c.fillStyle = '#e8c25a'; c.font = '700 18px "Noto Serif Hebrew","Times New Roman",serif'; c.textAlign = 'center'; c.fillText('כתר תורה', 0, -86);
      for (let x = -84; x <= 84; x += 8) { c.fillStyle = '#e8c25a'; c.fillRect(x + cw * 1.5, -16, 3, 8); }
      /* 长明灯 */
      const sw = calm ? 0 : Math.sin(t * 0.7) * 2;
      c.strokeStyle = '#8a6a30'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -318); c.lineTo(sw, -262); c.stroke();
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, sw, -250, 50, 'rgba(255,90,60,' + (0.4 + (calm ? 0 : Math.sin(t * 5) * 0.06)) + ')'); c.restore();
      c.fillStyle = '#c8962e'; c.beginPath(); c.moveTo(sw - 12, -262); c.lineTo(sw + 12, -262); c.lineTo(sw + 7, -244); c.lineTo(sw - 7, -244); c.fill();
      ell(c, sw, -253, 6, 7, 'rgba(230,60,40,.85)');
      /* 读经台 */
      c.fillStyle = '#6a4020'; c.fillRect(-60, -6, 120, 6);
      c.restore();
      floor(c, W, H, 0.77, '#8a6a46', '#4a3420');
    },
  });

  /* ================= 锡克教：经辇里的《古鲁格兰特》 ================= */
  T.add('sikhism.gurdwara', {
    name: Z('古鲁格兰特（经书）', 'Guru Granth Sahib'),
    about: Z('谒师所里不供任何神像。正中金色的经辇（Palki）下，用绣花布“鲁马拉”盖着的就是经书《古鲁格兰特》，锡克人把它当作永远的古鲁（上师）来尊敬。\n侍经人在经书后面挥动拂尘（Chaur Sahib）。墙上的标志是“坎达”：双刃剑、圆环和两把弯刀。', 'A gurdwara holds no images. Beneath the golden canopy (palki), wrapped in embroidered cloths (rumalas), rests the scripture Guru Granth Sahib, honoured by Sikhs as the eternal Guru.\nAn attendant waves the whisk (chaur sahib) over it. The emblem on the wall is the Khanda: a double-edged sword, a ring and two curved swords.'),
    paint(c, W, H, t, calm) {
      c.fillStyle = lin(c, 0, 0, 0, H, ['#f4efe4', '#e8dcc6', '#cbb894']); c.fillRect(0, 0, W, H);
      /* 坎达 */
      c.save(); c.translate(W / 2, H * 0.11); const k = Math.min(W, H) / 300;
      c.scale(k, k); c.strokeStyle = '#1e3a8a'; c.fillStyle = '#1e3a8a';
      c.lineWidth = 5; c.beginPath(); c.arc(0, 4, 16, 0, TAU); c.stroke();
      c.beginPath(); c.moveTo(0, -30); c.lineTo(4, -20); c.lineTo(3, 28); c.lineTo(-3, 28); c.lineTo(-4, -20); c.closePath(); c.fill();
      [-1, 1].forEach(sd => { c.lineWidth = 3.4; c.beginPath(); c.moveTo(sd * 8, 30); c.bezierCurveTo(sd * 30, 18, sd * 34, -8, sd * 18, -26); c.stroke(); });
      c.restore();
      c.save(); fit(c, W, H, 300, 360, 0.76, 0.18);
      /* 经辇：四根金柱，上面一个圆顶，四周挂流苏 */
      [-110, 110].forEach(x => { c.fillStyle = lin(c, x - 6, 0, x + 6, 0, ['#a87a24', '#f6d67a', '#a87a24']); c.fillRect(x - 6, -300, 12, 300); });
      shape(c, k2 => { k2.moveTo(-124, -300); k2.quadraticCurveTo(-110, -360, 0, -372); k2.quadraticCurveTo(110, -360, 124, -300); });
      c.fillStyle = lin(c, -124, 0, 124, 0, ['#a87a24', '#f8dc80', '#c99a3a']); c.fill();
      circ(c, 0, -380, 8, '#f8dc80');
      c.fillStyle = '#c99a3a'; c.fillRect(-128, -304, 256, 10);
      for (let x = -124; x <= 124; x += 7) { const sw = calm ? 0 : Math.sin(t * 1.6 + x * 0.1) * 1.5; c.strokeStyle = '#e8b83a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, -294); c.lineTo(x + sw, -280); c.stroke(); circ(c, x + sw, -279, 2, '#d8322a'); }
      /* 经台 + 鲁马拉 + 打开的经书 */
      c.fillStyle = '#8a1e3a'; c.fillRect(-100, -120, 200, 120);
      c.fillStyle = lin(c, -100, 0, 100, 0, ['#d83a6a', '#f27aa0', '#d83a6a']);
      c.beginPath(); c.moveTo(-104, -124); c.lineTo(104, -124); c.lineTo(110, -20); c.quadraticCurveTo(0, -6, -110, -20); c.closePath(); c.fill();
      c.strokeStyle = '#e8c25a'; c.lineWidth = 2; for (let x = -90; x <= 90; x += 20) { c.beginPath(); c.arc(x, -70, 6, 0, TAU); c.stroke(); }
      c.fillStyle = '#f8f4ea'; c.beginPath(); c.moveTo(-70, -128); c.quadraticCurveTo(-35, -146, 0, -134); c.quadraticCurveTo(35, -146, 70, -128); c.lineTo(70, -122); c.quadraticCurveTo(35, -138, 0, -126); c.quadraticCurveTo(-35, -138, -70, -122); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(80,60,40,.35)'; c.lineWidth = 0.8; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(-62, -128 - i * 2); c.quadraticCurveTo(-34, -142 - i * 0.5, -8, -132 - i); c.stroke(); c.beginPath(); c.moveTo(8, -132 - i); c.quadraticCurveTo(34, -142 - i * 0.5, 62, -128 - i * 2); c.stroke(); }
      const sh = calm ? 0.3 : (t * 0.25) % 1.4;
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, -100 + sh * 200, -90, 40, 'rgba(255,220,180,.25)'); c.restore();
      /* 两边的花 */
      [-1, 1].forEach(sd => { for (let i = 0; i < 6; i++) circ(c, sd * (130 + (i % 2) * 10), -20 - i * 12, 7, i % 2 ? '#f29a1e' : '#f6c32e'); });
      c.restore();
      floor(c, W, H, 0.77, '#f4f2ec', '#d8d2c4');
    },
  });
})(typeof HallToon !== 'undefined' ? HallToon : null);
