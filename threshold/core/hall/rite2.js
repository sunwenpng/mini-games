/*
 * 殿内法器（续）：其余各版本。由 rite.js 的 HallRite.add / kit / words 登记。
 *   泰国：贴金箔、一排小钟            新乘：点蜡烛、撒花
 *   印度教：摇铃、转灯（阿罗提）、吹海螺   道教、日本：加一炉香
 *   神道：摇神铃、拍手                伊斯兰教：念珠（泰斯比哈）
 *   犹太教：点安息日蜡烛、绕手、遮眼    锡克教：挥拂尘（Chaur Sahib）
 *   新教：拉钟绳、翻圣经              东正教：加一个插细蜡烛的烛台
 */
(function (HR) {
  'use strict';
  if (!HR || !HR.add) return;
  const L = HR.LIB, { circ, ell, lin, glow, rr, fmt, puff, TAU } = L;

  HR.words('zh-CN', {
    goldleaf: '金箔', goldTip: '把左下角的金箔拖到佛像上，按一下就贴上了', tbells: '小钟', candles: '蜡烛', candleTip: '点一下蜡烛把它点亮，点右边的花篮撒花', petals: '花',
    ghanta: '摇铃', aarti: '灯', conch: '海螺', hinduTip: '按住铃左右摇；拿着灯盘顺时针画圈（转三圈）；按住海螺吹',
    incense: '上香', suzu: '神铃', clap: '拍手', shintoTip: '先鞠躬两次，再拍手两下，最后鞠躬一次。可以拉一拉右边的神铃',
    tasbih: '念珠', tasbihTip: '往下拨念珠，一颗一颗数：赞主清净 33 遍、赞主 33 遍、主至大 34 遍', tasbihPh: ['赞主清净（Subhanallah）', '一切赞颂归主（Alhamdulillah）', '主至大（Allahu Akbar）'],
    shabbat: '安息日蜡烛', shabbatTip: '点亮两支蜡烛，然后在烛光上方用手画三个圈，再按“遮眼”', cover: '遮眼', blessing: '愿你蒙福，我们的主，宇宙之王，祂以诫命使我们圣洁，吩咐我们点燃安息日的灯。',
    chaur: '拂尘', chaurTip: '拿着拂尘在经书上方左右挥，这是对经书的敬意',
    rope: '钟绳', bible: '圣经', protTip: '往下拉钟绳敲钟；点圣经翻一页',
    verses: ['耶和华是我的牧者，我必不致缺乏。（诗篇 23:1）', '神爱世人，甚至将他的独生子赐给他们。（约翰福音 3:16）', '你的话是我脚前的灯，是我路上的光。（诗篇 119:105）', '凡劳苦担重担的人可以到我这里来，我就使你们得安息。（马太福音 11:28）', '如今常存的有信、有望、有爱，其中最大的是爱。（哥林多前书 13:13）'],
    tapers: '烛台', taperTip: '点烛台加一支细蜡烛；也可以拖动香炉',
    circleN: '转了 {n} 圈',
  });
  HR.words('zh-TW', {
    goldleaf: '金箔', goldTip: '把左下角的金箔拖到佛像上，按一下就貼上了', tbells: '小鐘', candles: '蠟燭', candleTip: '點一下蠟燭把它點亮，點右邊的花籃撒花', petals: '花',
    ghanta: '搖鈴', aarti: '燈', conch: '海螺', hinduTip: '按住鈴左右搖；拿著燈盤順時針畫圈（轉三圈）；按住海螺吹',
    incense: '上香', suzu: '神鈴', clap: '拍手', shintoTip: '先鞠躬兩次，再拍手兩下，最後鞠躬一次。可以拉一拉右邊的神鈴',
    tasbih: '念珠', tasbihTip: '往下撥念珠，一顆一顆數：讚主清淨 33 遍、讚主 33 遍、主至大 34 遍', tasbihPh: ['讚主清淨（Subhanallah）', '一切讚頌歸主（Alhamdulillah）', '主至大（Allahu Akbar）'],
    shabbat: '安息日蠟燭', shabbatTip: '點亮兩支蠟燭，然後在燭光上方用手畫三個圈，再按「遮眼」', cover: '遮眼', blessing: '願你蒙福，我們的主，宇宙之王，祂以誡命使我們聖潔，吩咐我們點燃安息日的燈。',
    chaur: '拂塵', chaurTip: '拿著拂塵在經書上方左右揮，這是對經書的敬意',
    rope: '鐘繩', bible: '聖經', protTip: '往下拉鐘繩敲鐘；點聖經翻一頁',
    verses: ['耶和華是我的牧者，我必不致缺乏。（詩篇 23:1）', '神愛世人，甚至將他的獨生子賜給他們。（約翰福音 3:16）', '你的話是我腳前的燈，是我路上的光。（詩篇 119:105）', '凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。（馬太福音 11:28）', '如今常存的有信、有望、有愛，其中最大的是愛。（哥林多前書 13:13）'],
    tapers: '燭台', taperTip: '點燭台加一支細蠟燭；也可以拖動香爐',
    circleN: '轉了 {n} 圈',
  });
  HR.words('en', {
    goldleaf: 'Gold leaf', goldTip: 'Drag the gold leaf from the bottom left onto the Buddha and let go to press it on', tbells: 'Bells', candles: 'Candles', candleTip: 'Tap a candle to light it; tap the basket on the right to scatter flowers', petals: 'Flowers',
    ghanta: 'Bell', aarti: 'Lamp', conch: 'Conch', hinduTip: 'Hold the bell and shake it; circle the lamp clockwise three times; hold the conch to blow',
    incense: 'Incense', suzu: 'Shrine bell', clap: 'Clap', shintoTip: 'Bow twice, clap twice, bow once. You can shake the bell rope on the right',
    tasbih: 'Prayer beads', tasbihTip: 'Pull the beads down one at a time: Subhanallah 33, Alhamdulillah 33, Allahu Akbar 34', tasbihPh: ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar'],
    shabbat: 'Shabbat candles', shabbatTip: 'Light both candles, draw three circles over the flames with your hand, then tap “Cover eyes”', cover: 'Cover eyes', blessing: 'Blessed are You, Lord our God, King of the universe, who sanctified us with His commandments and commanded us to light the Shabbat lamp.',
    chaur: 'Chaur', chaurTip: 'Wave the whisk over the scripture, a sign of respect',
    rope: 'Bell rope', bible: 'Bible', protTip: 'Pull the rope to ring the bell; tap the Bible to turn a page',
    verses: ['The Lord is my shepherd; I shall not want. (Psalm 23:1)', 'For God so loved the world, that he gave his only begotten Son. (John 3:16)', 'Thy word is a lamp unto my feet, and a light unto my path. (Psalm 119:105)', 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. (Matthew 11:28)', 'And now abideth faith, hope, charity, these three; but the greatest of these is charity. (1 Corinthians 13:13)'],
    tapers: 'Candle stand', taperTip: 'Tap the stand to add a thin candle; you can also swing the censer',
    circleN: '{n} circles',
  });

  HR.words('th', {
    goldleaf: 'แผ่นทอง', goldTip: 'ลากแผ่นทองจากมุมซ้ายล่างไปปิดที่องค์พระ แล้วปล่อยนิ้ว', tbells: 'ระฆัง', count: '{name} {n}',
  });

  /* ---------- 声音 ---------- */
  const S = L.SND;
  function snd(V, fn) { const a = L.ac(); if (a && L.soundOn(V)) fn(a); }
  const ring = (V, f, g, d) => snd(V, a => { L.partial(a, f, g, d, 'sine', 3); L.partial(a, f * 2.76, g * 0.4, d * 0.6, 'sine', 4); L.partial(a, f * 5.4, g * 0.15, d * 0.3); });
  const knock = (V, f) => snd(V, a => { L.partial(a, f, 0.25, 0.08, 'triangle'); L.noise(a, 0.02, 0.3, 3000, 2); });

  /* ---------- 泰国：贴金箔 ---------- */
  HR.add('goldleaf', function (R) {
    const it = { id: 'goldleaf', n: 0, leaves: [], drag: null };
    it.layout = (W, H, bot) => { it.s = Math.max(28, Math.min(W * 0.09, 40)); it.x = W * 0.2; it.y = bot - it.s * 1.2; it.W = W; it.H = H; it.bot = bot; };
    it.hit = (x, y) => Math.abs(x - it.x) < it.s && Math.abs(y - it.y) < it.s;
    it.down = (x, y, t) => { it.drag = { x, y, t0: t, moved: 0 }; };
    it.move = (x, y) => { if (it.drag) { it.drag.moved += Math.hypot(x - it.drag.x, y - it.drag.y); it.drag.x = x; it.drag.y = y; } };
    it.up = (x, y, t) => {
      const d = it.drag; it.drag = null; if (!d) return;
      let px = x, py = y;
      if (d.moved < 10) { px = it.W * (0.36 + Math.random() * 0.28); py = it.H * (0.34 + Math.random() * 0.26); }
      if (py > it.bot - it.s * 2.5) return;
      it.leaves.push({ x: px, y: py, a: Math.random() * 0.8 - 0.4, t }); if (it.leaves.length > 60) it.leaves.shift();
      it.n++; S.chime(R.V); R.seen();
    };
    it.busy = () => !!it.drag || it.leaves.some(l => R.t - l.t < 2);
    it.step = () => {};
    it.draw = function (c, t) {
      /* 已经贴上的金箔：方方的一小片，偶尔闪一下 */
      it.leaves.forEach((l, i) => {
        c.save(); c.translate(l.x, l.y); c.rotate(l.a);
        c.fillStyle = 'rgba(248,214,110,.92)'; c.fillRect(-5, -5, 10, 10);
        c.fillStyle = 'rgba(255,250,220,.6)'; c.fillRect(-5, -5, 10, 2);
        c.restore();
        const k = (t * 0.7 + i * 0.37) % 3;
        if (k < 0.25 || R.t - l.t < 1) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, l.x, l.y, 14, 'rgba(255,236,160,.6)'); c.restore(); }
      });
      /* 一小叠金箔，夹在白纸里 */
      const s = it.s, x = it.x, y = it.y;
      for (let i = 3; i >= 0; i--) { c.fillStyle = i ? '#f2eee4' : '#ffffff'; c.fillRect(x - s * 0.8 + i * 2, y - s * 0.6 + i * 2, s * 1.6, s * 1.2); }
      c.fillStyle = lin(c, x - s * 0.5, 0, x + s * 0.5, 0, ['#c9962e', '#fbe08a', '#d8a83a']); c.fillRect(x - s * 0.5, y - s * 0.35, s, s * 0.7);
      if (it.drag) { c.save(); c.translate(it.drag.x, it.drag.y); c.fillStyle = 'rgba(248,214,110,.95)'; c.fillRect(-7, -7, 14, 14); c.restore(); }
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.goldleaf, n: it.n }) : R.w.goldleaf);
    it.capAt = () => [it.x, it.y + it.s * 0.95];
    return it;
  });

  /* ---------- 泰国：一排小钟 ---------- */
  HR.add('tbells', function (R) {
    const NOTE = [784, 880, 988, 1175, 1319];
    const it = { id: 'tbells', n: 0, sw: [0, 0, 0, 0, 0], v: [0, 0, 0, 0, 0] };
    it.layout = (W, H, bot) => { it.s = Math.max(14, Math.min(W * 0.045, 20)); it.x0 = W * 0.56; it.x1 = W * 0.94; it.y = bot - it.s * 5.2; };
    const bx = i => it.x0 + (it.x1 - it.x0) * (i + 0.5) / 5;
    it.hit = (x, y) => x > it.x0 - 6 && x < it.x1 + 6 && y > it.y - 6 && y < it.y + it.s * 3.4;
    it.down = (x) => { const i = Math.max(0, Math.min(4, Math.floor((x - it.x0) / (it.x1 - it.x0) * 5))); it.v[i] += 5; it.n++; ring(R.V, NOTE[i], 0.12, 2.6); R.seen(); };
    it.busy = () => it.sw.some((a, i) => Math.abs(a) > 0.01 || Math.abs(it.v[i]) > 0.01);
    it.step = dt => { for (let i = 0; i < 5; i++) { it.v[i] += (-30 * it.sw[i] - 1.6 * it.v[i]) * dt; it.sw[i] += it.v[i] * dt; } };
    it.draw = function (c) {
      c.fillStyle = '#6a3a14'; c.fillRect(it.x0 - 8, it.y - 6, it.x1 - it.x0 + 16, 6);
      c.fillStyle = '#e8b83a'; c.fillRect(it.x0 - 8, it.y - 7, it.x1 - it.x0 + 16, 2);
      for (let i = 0; i < 5; i++) {
        const s = it.s * (1.1 - i * 0.07);
        c.save(); c.translate(bx(i), it.y); c.rotate(it.sw[i] * 0.3);
        c.strokeStyle = '#3a2a1a'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, s * 0.5); c.stroke();
        c.beginPath(); c.moveTo(-s * 0.55, s * 2.2); c.quadraticCurveTo(-s * 0.5, s * 0.5, 0, s * 0.5); c.quadraticCurveTo(s * 0.5, s * 0.5, s * 0.55, s * 2.2); c.closePath();
        c.fillStyle = lin(c, -s * 0.6, 0, s * 0.6, 0, ['#8a6420', '#f4d67a', '#a87a24']); c.fill();
        circ(c, it.sw[i] * 4, s * 2.3, s * 0.15, '#6a4a14');
        c.restore();
      }
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.tbells, n: it.n }) : R.w.tbells);
    it.capAt = () => [(it.x0 + it.x1) / 2, it.y + it.s * 3.6];
    return it;
  });

  /* ---------- 蜡烛（新乘：白蜡烛；东正教：插在沙盘里的细蜡烛） ---------- */
  function candles(style) {
    return function (R) {
      const it = { id: style === 'taper' ? 'tapers' : 'candles', n: 0, lit: 0, cs: [] };
      it.layout = (W, H, bot) => {
        it.s = Math.max(10, Math.min(W * 0.03, 14));
        if (style === 'taper') { it.x = W * 0.24; it.y = bot - it.s * 3.2; it.w = W * 0.3; }
        else { it.x = W * 0.24; it.y = bot - it.s * 2.6; it.w = W * 0.3; }
        if (!it.cs.length) for (let i = 0; i < (style === 'taper' ? 0 : 5); i++) it.cs.push({ f: (i + 0.5) / 5, h: 1 - Math.abs(i - 2) * 0.12, lit: -1 });
      };
      it.hit = (x, y) => Math.abs(x - it.x) < it.w * 0.6 && y > it.y - it.s * 5 && y < it.y + it.s * 1.6;
      it.down = (x, y, t) => {
        if (style === 'taper') {
          if (it.cs.length >= 9) it.cs.shift();
          it.cs.push({ f: Math.max(0.05, Math.min(0.95, (x - (it.x - it.w / 2)) / it.w)), h: 0.8 + Math.random() * 0.4, lit: t });
        } else {
          let best = null; it.cs.forEach(cd => { const d = Math.abs(it.x - it.w / 2 + cd.f * it.w - x); if (cd.lit < 0 && (!best || d < best.d)) best = { d, cd }; });
          if (!best) return;
          best.cd.lit = t;
        }
        it.n++; snd(R.V, a => { L.noise(a, 0.25, 0.18, 1800, 0.8); L.partial(a, 1046, 0.03, 1.2); }); R.seen();
      };
      it.busy = () => it.cs.some(cd => cd.lit >= 0);
      it.step = () => {};
      it.draw = function (c, t) {
        const s = it.s, x0 = it.x - it.w / 2;
        if (style === 'taper') {
          /* 黄铜沙盘 */
          ell(c, it.x, it.y, it.w * 0.6, s * 0.9, '#8a6420'); ell(c, it.x, it.y - 2, it.w * 0.56, s * 0.7, '#d8c08a');
          c.fillStyle = '#6a4a14'; c.fillRect(it.x - 3, it.y, 6, s * 2.2); ell(c, it.x, it.y + s * 2.2, s * 2, s * 0.5, '#8a6420');
        } else {
          c.fillStyle = '#d8d0c0'; c.fillRect(x0 - 6, it.y, it.w + 12, s * 0.6); c.fillStyle = '#a89c88'; c.fillRect(x0 - 6, it.y + s * 0.6, it.w + 12, s * 0.3);
        }
        it.cs.forEach(cd => {
          const cx = x0 + cd.f * it.w, hh = s * (style === 'taper' ? 3.6 : 3) * cd.h, cw = style === 'taper' ? s * 0.26 : s * 0.7;
          c.fillStyle = style === 'taper' ? '#e8c86a' : '#f8f4ea'; c.fillRect(cx - cw / 2, it.y - hh, cw, hh);
          c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx + cw * 0.2, it.y - hh, cw * 0.3, hh);
          c.strokeStyle = '#3a2a1a'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, it.y - hh); c.lineTo(cx, it.y - hh - 3); c.stroke();
          if (cd.lit >= 0) {
            const k = Math.min(1, (t - cd.lit) / 0.4), f = Math.sin(t * 9 + cx) * 0.15, fs = s * (style === 'taper' ? 0.55 : 0.7) * k;
            c.save(); c.globalCompositeOperation = 'lighter'; glow(c, cx, it.y - hh - fs * 1.4, fs * 6, 'rgba(255,170,70,.35)'); c.restore();
            c.fillStyle = '#ffcf5a'; c.beginPath(); c.moveTo(cx, it.y - hh - fs * (2.4 + f)); c.quadraticCurveTo(cx + fs * 0.8, it.y - hh - fs * 0.6, cx, it.y - hh); c.quadraticCurveTo(cx - fs * 0.8, it.y - hh - fs * 0.6, cx, it.y - hh - fs * (2.4 + f)); c.fill();
            circ(c, cx, it.y - hh - fs * 0.6, fs * 0.32, '#fff6d0');
          }
        });
      };
      it.caption = () => { const nm = style === 'taper' ? R.w.tapers : R.w.candles; return it.n ? fmt(R.w.count, { name: nm, n: it.n }) : nm; };
      it.capAt = () => [it.x, it.y + it.s * (style === 'taper' ? 3.4 : 2.2)];
      return it;
    };
  }
  HR.add('candles', candles('white'));
  HR.add('tapers', candles('taper'));

  /* ---------- 撒花 ---------- */
  HR.add('petals', function (R) {
    const it = { id: 'petals', n: 0, ps: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(28, Math.min(W * 0.09, 40)); it.x = W * 0.78; it.y = bot - it.s * 1.1; it.W = W; it.H = H; it.bot = bot; };
    it.hit = (x, y) => Math.hypot(x - it.x, y - it.y) < it.s * 1.3;
    it.down = () => {
      for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 - 0.9 + Math.random() * 0.8; const v = 300 + Math.random() * 260; it.ps.push({ x: it.x, y: it.y - it.s * 0.4, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * TAU, c: ['#f6c3cf', '#f2a43a', '#f7e6a0', '#e76f51', '#ffffff'][i % 5], t: 0 }); }
      it.n++; snd(R.V, a => L.noise(a, 0.4, 0.08, 2600, 0.6)); R.seen();
    };
    it.busy = () => it.ps.length > 0;
    it.step = dt => { it.ps = it.ps.filter(p => { p.t += dt; p.vy += 420 * dt; p.vx *= Math.exp(-1.6 * dt); p.vy = Math.min(p.vy, 90); p.x += (p.vx + Math.sin(p.t * 3 + p.r) * 30) * dt; p.y += p.vy * dt; p.r += dt * 3; return p.y < it.bot && p.t < 8; }); };
    it.draw = function (c) {
      it.ps.forEach(p => { c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.globalAlpha = 0.92; c.beginPath(); c.ellipse(0, 0, 5, 2.6, 0, 0, TAU); c.fill(); c.restore(); });
      const s = it.s, x = it.x, y = it.y;
      c.fillStyle = '#8a5a2a'; c.beginPath(); c.moveTo(x - s, y - s * 0.3); c.lineTo(x + s, y - s * 0.3); c.lineTo(x + s * 0.7, y + s * 0.5); c.lineTo(x - s * 0.7, y + s * 0.5); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(240,200,140,.5)'; c.lineWidth = 1; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * s * 0.28, y - s * 0.3); c.lineTo(x + i * s * 0.2, y + s * 0.5); c.stroke(); }
      for (let i = 0; i < 9; i++) circ(c, x - s * 0.8 + (i % 5) * s * 0.4, y - s * 0.38 - Math.floor(i / 5) * s * 0.22, s * 0.17, ['#f2a43a', '#f6c3cf', '#ffffff', '#e76f51', '#f7e6a0'][i % 5]);
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.petals, n: it.n }) : R.w.petals);
    it.capAt = () => [it.x, it.y + it.s * 0.95];
    return it;
  });

  /* ---------- 印度教：手摇铃（Ghanta） ---------- */
  HR.add('ghanta', function (R) {
    const it = { id: 'ghanta', n: 0, a: 0, v: 0, held: false, lastDir: 0 };
    it.layout = (W, H, bot) => { it.s = Math.max(26, Math.min(W * 0.085, 38)); it.x = W * 0.18; it.y = bot - it.s * 2.0; };
    it.hit = (x, y) => Math.abs(x - it.x) < it.s * 1.2 && y > it.y - it.s * 2 && y < it.y + it.s * 1.4;
    it.down = (x, y) => { it.held = true; it.px = x; it.moved = 0; };
    it.move = (x) => { if (!it.held) return; const dx = x - it.px; it.px = x; it.moved += Math.abs(dx); it.a = Math.max(-0.7, Math.min(0.7, it.a + dx * 0.02)); const dir = Math.sign(dx); if (dir && dir !== it.lastDir && Math.abs(dx) > 1) { it.lastDir = dir; ding(); } };
    function ding() { it.n++; ring(R.V, 1568, 0.1, 1.8); }
    it.up = () => { it.held = false; if (it.moved < 6) { it.v = 6; ding(); } R.seen(); };
    it.busy = () => it.held || Math.abs(it.a) > 0.01 || Math.abs(it.v) > 0.05;
    it.step = dt => { if (it.held) return; const pa = it.a; it.v += (-60 * it.a - 3 * it.v) * dt; it.a += it.v * dt; if (Math.sign(pa) !== Math.sign(it.a) && Math.abs(it.v) > 2) ring(R.V, 1568, 0.05, 1.2); };
    it.draw = function (c) {
      const s = it.s;
      c.save(); c.translate(it.x, it.y); c.rotate(it.a);
      /* 柄 + 顶上的小神牛 */
      c.fillStyle = lin(c, -4, 0, 4, 0, ['#8a6420', '#f4d67a', '#8a6420']); c.fillRect(-s * 0.1, -s * 1.6, s * 0.2, s * 1.2);
      ell(c, 0, -s * 1.7, s * 0.28, s * 0.16, '#c9962e'); circ(c, s * 0.18, -s * 1.82, s * 0.1, '#c9962e');
      /* 铃身 */
      c.beginPath(); c.moveTo(-s * 0.7, s * 0.8); c.quadraticCurveTo(-s * 0.6, -s * 0.4, 0, -s * 0.45); c.quadraticCurveTo(s * 0.6, -s * 0.4, s * 0.7, s * 0.8); c.closePath();
      c.fillStyle = lin(c, -s * 0.7, 0, s * 0.7, 0, ['#8a6420', '#f8dc80', '#c9962e', '#6a4a14']); c.fill();
      c.fillStyle = '#6a4a14'; c.fillRect(-s * 0.74, s * 0.76, s * 1.48, s * 0.1);
      circ(c, -it.v * 0.6, s * 0.92, s * 0.12, '#5a3a10');
      c.restore();
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.ghanta, n: it.n }) : R.w.ghanta);
    it.capAt = () => [it.x, it.y + it.s * 1.5];
    return it;
  });

  /* ---------- 印度教：转灯（阿罗提） ---------- */
  HR.add('aarti', function (R) {
    const it = { id: 'aarti', n: 0, held: false, ang: 0, acc: 0, trail: [], px: 0, py: 0, auto: -9 };
    it.layout = (W, H, bot) => { it.s = Math.max(24, Math.min(W * 0.08, 34)); it.hx = W * 0.78; it.hy = bot - it.s * 1.4; it.cx = W * 0.5; it.cy = H * 0.42; it.r = Math.min(W * 0.32, H * 0.2); if (!it.init) { it.px = it.hx; it.py = it.hy; it.init = true; } };
    it.hit = (x, y) => Math.hypot(x - it.px, y - it.py) < it.s * 1.5;
    it.down = (x, y, t) => { it.held = true; it.t0 = t; it.moved = 0; it.prevA = Math.atan2(y - it.cy, x - it.cx); };
    it.move = (x, y) => {
      if (!it.held) return;
      it.moved += Math.hypot(x - it.px, y - it.py);
      it.px = x; it.py = y;
      const a = Math.atan2(y - it.cy, x - it.cx); let d = a - it.prevA; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; it.prevA = a;
      turn(d);
      it.trail.push({ x, y, t: R.t }); if (it.trail.length > 60) it.trail.shift();
    };
    function turn(d) {
      /* 画面里 y 向下，所以顺时针是角度增加 */
      if (d > 0) it.acc += d; else it.acc = Math.max(0, it.acc + d * 0.5);
      if (it.acc >= TAU) { it.acc -= TAU; it.n++; ring(R.V, 1318, 0.06, 1.6); if (it.n % 3 === 0) { S.chime(R.V); R.glow(); R.done('aarti'); } }
    }
    it.up = (x, y, t) => { it.held = false; if (it.moved < 8) it.auto = t; R.seen(); };
    it.busy = () => it.held || it.trail.length > 0 || R.t - it.auto < 2.2 || Math.hypot(it.px - it.hx, it.py - it.hy) > 1;
    it.step = (dt, t) => {
      const k = t - it.auto;
      if (!it.held && k >= 0 && k < 2) {
        const a0 = Math.atan2(it.hy - it.cy, it.hx - it.cx), a = a0 + (k / 2) * TAU, rr2 = it.r * (0.5 + 0.5 * Math.min(1, k * 2, (2 - k) * 2));
        const nx = it.cx + Math.cos(a) * rr2 * 1.2, ny = it.cy + Math.sin(a) * rr2 * 0.9 + (it.hy - it.cy) * (1 - Math.min(1, k * 2, (2 - k) * 2));
        it.px = nx; it.py = ny; it.trail.push({ x: nx, y: ny, t }); if (it.trail.length > 60) it.trail.shift();
        if (k + dt >= 2) turn(TAU);
      } else if (!it.held) { it.px += (it.hx - it.px) * Math.min(1, dt * 5); it.py += (it.hy - it.py) * Math.min(1, dt * 5); }
      it.trail = it.trail.filter(p => t - p.t < 0.9);
    };
    it.draw = function (c, t) {
      c.save(); c.globalCompositeOperation = 'lighter';
      it.trail.forEach((p, i) => { const a = 1 - (t - p.t) / 0.9; glow(c, p.x, p.y - it.s * 0.5, it.s * 0.9 * a, 'rgba(255,170,60,' + (0.35 * a).toFixed(3) + ')'); });
      c.restore();
      const s = it.s, x = it.px, y = it.py;
      ell(c, x, y, s, s * 0.3, '#c9962e'); ell(c, x, y - 2, s * 0.9, s * 0.24, '#f0cc6a');
      ell(c, x - s * 0.5, y - s * 0.12, s * 0.16, s * 0.07, '#d83a3a'); ell(c, x + s * 0.5, y - s * 0.12, s * 0.16, s * 0.07, '#f6c32e');
      ell(c, x, y - s * 0.2, s * 0.32, s * 0.14, '#a8701e');
      const f = Math.sin(t * 9) * 0.15;
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - s * 0.6, s * 2.2, 'rgba(255,170,70,.4)'); c.restore();
      c.fillStyle = '#ffcf5a'; c.beginPath(); c.moveTo(x, y - s * (1.1 + f)); c.quadraticCurveTo(x + s * 0.3, y - s * 0.4, x, y - s * 0.25); c.quadraticCurveTo(x - s * 0.3, y - s * 0.4, x, y - s * (1.1 + f)); c.fill();
      circ(c, x, y - s * 0.45, s * 0.1, '#fff6d0');
    };
    it.caption = () => (it.n ? fmt(R.w.circleN, { n: it.n }) : R.w.aarti);
    it.capAt = () => [it.hx, it.hy + it.s * 0.9];
    return it;
  });

  /* ---------- 印度教：海螺 ---------- */
  HR.add('conch', function (R) {
    const it = { id: 'conch', n: 0, held: false, k: 0, node: null, waves: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(24, Math.min(W * 0.08, 34)); it.x = W * 0.5; it.y = bot - it.s * 1.0; };
    it.hit = (x, y) => Math.hypot(x - it.x, (y - it.y) * 1.3) < it.s * 1.4;
    it.down = () => {
      it.held = true; it.n++;
      snd(R.V, a => {
        const o = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
        o.type = 'sawtooth'; o.frequency.value = 233; o2.type = 'sawtooth'; o2.frequency.value = 234.6;
        lfo.frequency.value = 5; lg.gain.value = 2.5; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
        f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 2;
        g.gain.setValueAtTime(0.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(0.16, a.currentTime + 0.5);
        o.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination);
        o.start(); o2.start(); lfo.start();
        it.node = { a, o, o2, lfo, g };
      });
      R.seen();
    };
    it.up = () => {
      it.held = false;
      const n = it.node; it.node = null;
      if (n) { const now = n.a.currentTime; n.g.gain.cancelScheduledValues(now); n.g.gain.setValueAtTime(n.g.gain.value, now); n.g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6); [n.o, n.o2, n.lfo].forEach(o => o.stop(now + 0.7)); }
    };
    it.busy = () => it.held || it.k > 0.01 || it.waves.length > 0;
    it.step = (dt, t) => {
      it.k += ((it.held ? 1 : 0) - it.k) * Math.min(1, dt * 4);
      if (it.held && (!it.lw || t - it.lw > 0.35)) { it.lw = t; it.waves.push({ t: 0 }); }
      it.waves = it.waves.filter(w => (w.t += dt) < 1.6);
      if (it.held && it.node && it.k > 0.95 && R.t - (it.t0 || 0) > 6) it.up();
    };
    it.draw = function (c) {
      const s = it.s, x = it.x, y = it.y;
      it.waves.forEach(w => { c.strokeStyle = 'rgba(255,236,200,' + (0.4 * (1 - w.t / 1.6)).toFixed(3) + ')'; c.lineWidth = 2; c.beginPath(); c.arc(x - s * 0.9, y - s * 0.1, s * 0.4 + w.t * s * 2.4, Math.PI * 0.7, Math.PI * 1.3); c.stroke(); });
      if (it.k > 0.05) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y, s * 2, 'rgba(255,240,210,' + (0.25 * it.k).toFixed(3) + ')'); c.restore(); }
      c.save(); c.translate(x, y); c.rotate(-0.15 + it.k * 0.05);
      c.beginPath(); c.moveTo(-s * 1.1, 0); c.bezierCurveTo(-s * 0.6, -s * 0.8, s * 0.7, -s * 0.9, s * 1.1, -s * 0.15); c.quadraticCurveTo(s * 1.3, s * 0.2, s * 0.9, s * 0.45); c.bezierCurveTo(s * 0.3, s * 0.7, -s * 0.6, s * 0.4, -s * 1.1, 0); c.closePath();
      c.fillStyle = lin(c, 0, -s, 0, s * 0.6, ['#fffaf0', '#f0e2c8', '#d8c4a0']); c.fill();
      c.strokeStyle = 'rgba(160,120,80,.6)'; c.lineWidth = 1.2; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(s * 0.75, -s * 0.05, s * (0.1 + i * 0.1), -Math.PI * 0.8, Math.PI * 0.3); c.stroke(); }
      c.fillStyle = '#e8c25a'; c.fillRect(-s * 0.2, -s * 0.66, s * 0.12, s * 1.1);
      c.restore();
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.conch, n: it.n }) : R.w.conch);
    it.capAt = () => [it.x, it.y + it.s * 0.9];
    return it;
  });

  /* ---------- 上香：三炷香，烟慢慢往上飘 ---------- */
  HR.add('incense', function (R) {
    const it = { id: 'incense', n: 0, sticks: [], smoke: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(24, Math.min(W * 0.075, 32)); it.x = W * 0.5; it.y = bot - it.s * 1.0; };
    it.hit = (x, y) => Math.abs(x - it.x) < it.s * 1.4 && y > it.y - it.s * 3 && y < it.y + it.s;
    it.down = (x, y, t) => { it.sticks = [-1, 0, 1].map((d, i) => ({ d, t: t + i * 0.25 })); it.n++; snd(R.V, a => L.noise(a, 0.3, 0.12, 1600, 0.8)); R.seen(); };
    it.busy = () => it.sticks.length > 0 || it.smoke.length > 0;
    it.step = (dt, t) => {
      it.sticks.forEach(s2 => { if (t > s2.t && Math.random() < dt * 7) it.smoke.push({ x: it.x + s2.d * it.s * 0.35, y: it.y - it.s * 2.6, r: 2, a: 0.3, t: 0, ph: Math.random() * 6 }); });
      it.sticks = it.sticks.filter(s2 => t - s2.t < 60);
      it.smoke = it.smoke.filter(p => { p.t += dt; p.y -= dt * 22; p.x += Math.sin(p.t * 1.4 + p.ph) * 10 * dt; p.r += dt * 4; p.a -= dt * 0.05; return p.a > 0; });
    };
    it.draw = function (c, t) {
      it.smoke.forEach(p => { c.globalAlpha = p.a; c.drawImage(puff(), p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); });
      c.globalAlpha = 1;
      const s = it.s, x = it.x, y = it.y;
      it.sticks.forEach(s2 => {
        if (t < s2.t) return;
        const sx = x + s2.d * s * 0.35, burn = Math.min(1, (t - s2.t) / 60);
        c.strokeStyle = '#8a3a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, y - s * 0.4); c.lineTo(sx + s2.d * 2, y - s * (2.6 - burn * 1.2)); c.stroke();
        c.save(); c.globalCompositeOperation = 'lighter'; glow(c, sx + s2.d * 2, y - s * (2.6 - burn * 1.2), 5, 'rgba(255,110,40,.95)'); c.restore();
      });
      /* 三足香炉 */
      c.fillStyle = '#5a4a32'; [-0.6, 0, 0.6].forEach(d => c.fillRect(x + d * s - 3, y + s * 0.2, 6, s * 0.45));
      c.beginPath(); c.moveTo(-s * 0.95 + x, y - s * 0.45); c.bezierCurveTo(x - s * 0.95, y + s * 0.35, x + s * 0.95, y + s * 0.35, x + s * 0.95, y - s * 0.45); c.closePath();
      c.fillStyle = lin(c, x - s, 0, x + s, 0, ['#3a3022', '#8a7650', '#5a4a32', '#2a2218']); c.fill();
      ell(c, x, y - s * 0.45, s * 0.95, s * 0.22, '#2a2016'); ell(c, x, y - s * 0.43, s * 0.82, s * 0.16, '#b8a888');
      [-1, 1].forEach(sd => { c.strokeStyle = '#6a5a3a'; c.lineWidth = 3; c.beginPath(); c.arc(x + sd * s * 0.95, y - s * 0.6, s * 0.18, Math.PI * 0.5, Math.PI * 1.5, sd > 0); c.stroke(); });
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.incense, n: it.n }) : R.w.incense);
    it.capAt = () => [it.x, it.y + it.s * 0.95];
    return it;
  });

  /* ---------- 神道：神铃（鈴）和铃绳 ---------- */
  HR.add('suzu', function (R) {
    const it = { id: 'suzu', n: 0, a: 0, v: 0, held: false, shake: 0 };
    it.layout = (W, H, bot, top) => { it.s = Math.max(22, Math.min(W * 0.07, 32)); it.x = W * 0.91; it.top = top + 40; it.len = (bot - 30) - it.top; it.W = W; };
    const end = () => [it.x + Math.sin(it.a) * it.len, it.top + Math.cos(it.a) * it.len];
    it.hit = (x, y) => { if (y < it.top + it.s * 2) return false; const u = (y - it.top) / it.len, rx = it.x + Math.sin(it.a) * it.len * u; return Math.abs(x - rx) < 24 && u <= 1.05; };
    it.down = (x, y) => { it.held = true; it.gx = x; it.a0 = it.a; it.moved = 0; };
    it.move = (x) => { if (!it.held) return; const na = Math.max(-0.45, Math.min(0.45, it.a0 + (x - it.gx) / it.len * 1.4)); it.moved += Math.abs(na - it.a); if (Math.abs(na - it.a) > 0.04) { jingle(0.6); } it.a = na; };
    function jingle(s) { it.shake = 1; snd(R.V, a => { for (let i = 0; i < 6; i++) L.partial(a, 2300 + Math.random() * 1800, 0.035 * s, 0.35, 'sine', 5, a.currentTime + Math.random() * 0.15); L.noise(a, 0.2, 0.12 * s, 4200, 1.5); }); }
    it.up = () => { it.held = false; if (it.moved < 0.03) it.v = 2.2; it.n++; jingle(1); R.seen(); };
    it.busy = () => it.held || Math.abs(it.a) > 0.01 || Math.abs(it.v) > 0.02 || it.shake > 0.01;
    it.step = dt => { it.shake *= Math.exp(-4 * dt); if (it.held) return; it.v += (-9 * it.a - 1.2 * it.v) * dt; it.a += it.v * dt; };
    it.draw = function (c, t) {
      const s = it.s, e = end(), jx = Math.sin(t * 60) * it.shake * 2;
      /* 铃：几颗金色的圆铃挂在梁下 */
      c.fillStyle = '#5a3a1a'; c.fillRect(it.x - s * 1.4, it.top - s * 1.4, s * 2.8, 5);
      [[-0.7, 0.8], [0, 1.05], [0.7, 0.8]].forEach(b => { const bx = it.x + b[0] * s + jx, by = it.top - s * 0.4; const g = c.createRadialGradient(bx - s * 0.2, by - s * 0.2, 1, bx, by, s * b[1] * 0.6); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, '#a87a1e'); circ(c, bx, by, s * b[1] * 0.55, g); c.fillStyle = '#3a2408'; c.fillRect(bx - s * b[1] * 0.4, by + s * 0.05, s * b[1] * 0.8, 1.6); });
      /* 红白两色编成的粗绳 */
      c.save(); c.lineCap = 'round';
      c.strokeStyle = '#d8322a'; c.lineWidth = Math.max(8, s * 0.42); c.beginPath(); c.moveTo(it.x, it.top); c.lineTo(e[0], e[1]); c.stroke();
      c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(3, s * 0.16); c.setLineDash([7, 7]); c.beginPath(); c.moveTo(it.x, it.top); c.lineTo(e[0], e[1]); c.stroke(); c.setLineDash([]);
      c.restore();
      c.strokeStyle = '#d8322a'; c.lineWidth = 2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(e[0] + i * 3, e[1] + 22); c.stroke(); }
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.suzu, n: it.n }) : R.w.suzu);
    it.capAt = () => { const e = end(); return [e[0] - it.s * 1.6, e[1] + 4]; };
    return it;
  });

  /* ---------- 神道：拍手 ---------- */
  HR.add('clap', function (R) {
    const it = { id: 'clap', n: 0, at: -9, last: -9, rings: [] };
    it.layout = (W, H, bot) => { it.s = Math.max(26, Math.min(W * 0.085, 36)); it.x = W * 0.22; it.y = bot - it.s * 1.3; };
    it.hit = (x, y) => Math.hypot(x - it.x, y - it.y) < it.s * 1.4;
    it.down = (x, y, t) => {
      it.n++; it.rings.push({ t: 0 });
      snd(R.V, a => { L.noise(a, 0.09, 0.9, 1400, 0.9); L.noise(a, 0.4, 0.15, 900, 0.5); });
      if (t - it.last < 2.5 && it.at < t - 0.1) { it.pair = (it.pair || 1) + 1; } else it.pair = 1;
      if (it.pair === 2) { R.glow(); R.done('sanpai'); }
      it.last = t; it.at = t; R.seen();
    };
    it.busy = () => it.rings.length > 0;
    it.step = dt => { it.rings = it.rings.filter(r => (r.t += dt) < 0.7); };
    it.draw = function (c, t) {
      const s = it.s, k = t - it.at, close = k < 0.12 ? 1 - k / 0.12 : 0;
      it.rings.forEach(r => { c.strokeStyle = 'rgba(255,240,210,' + (0.6 * (1 - r.t / 0.7)).toFixed(3) + ')'; c.lineWidth = 2; c.beginPath(); c.arc(it.x, it.y - s * 0.3, s * 0.8 + r.t * s * 2, 0, TAU); c.stroke(); });
      [-1, 1].forEach(sd => {
        const gap = s * 0.08 + (1 - close) * s * 0.35;
        c.save(); c.translate(it.x + sd * gap, it.y); c.rotate(sd * 0.12 * (1 - close));
        c.beginPath(); c.moveTo(0, s * 0.6); c.lineTo(0, -s * 0.9); c.quadraticCurveTo(sd * s * 0.12, -s * 1.1, sd * s * 0.42, -s * 0.85); c.lineTo(sd * s * 0.45, s * 0.6); c.closePath();
        c.fillStyle = '#efc49e'; c.fill(); c.strokeStyle = 'rgba(140,90,60,.5)'; c.lineWidth = 1; c.stroke();
        c.fillStyle = '#f4f2ec'; c.fillRect(sd > 0 ? 0 : -s * 0.5, s * 0.6, s * 0.5, s * 0.5);
        c.restore();
      });
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.clap, n: it.n }) : R.w.clap);
    it.capAt = () => [it.x, it.y + it.s * 1.4];
    return it;
  });

  /* ---------- 伊斯兰教：念珠 ---------- */
  HR.add('tasbih', function (R) {
    const it = { id: 'tasbih', n: 0, off: 0, held: false, flash: -9 };
    it.layout = (W, H, bot, top) => { it.x = W * 0.86; it.y0 = top + 60; it.y1 = bot - 30; it.gap = Math.max(14, Math.min(20, (it.y1 - it.y0) / 22)); };
    it.hit = (x, y) => Math.abs(x - it.x) < 30 && y > it.y0 && y < it.y1;
    it.down = (x, y) => { it.held = true; it.py = y; };
    it.move = (x, y) => { if (!it.held) return; const dy = y - it.py; it.py = y; if (dy > 0) { it.off += dy; while (it.off >= it.gap) { it.off -= it.gap; click(); } } };
    it.up = () => { if (it.held && it.off < 3) click(); it.held = false; R.seen(); };
    function click() {
      it.n++; snd(R.V, a => { L.partial(a, 1900, 0.08, 0.05, 'triangle'); L.noise(a, 0.02, 0.25, 4000, 3); });
      if (it.n === 33 || it.n === 66 || it.n === 100) { it.flash = R.t; S.chime(R.V); R.glow(); const ph = it.n === 33 ? 1 : it.n === 66 ? 2 : 0; R.tip(it.n === 100 ? R.w.tasbihPh[2] + ' · 100' : R.w.tasbihPh[ph], 3); }
      if (it.n >= 100) it.n = 0;
    }
    it.busy = () => it.held || R.t - it.flash < 2;
    it.step = () => {};
    it.draw = function (c, t) {
      const n = Math.floor((it.y1 - it.y0) / it.gap);
      c.strokeStyle = '#3a6a4a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(it.x, it.y0 - 10); c.lineTo(it.x, it.y1 + 10); c.stroke();
      for (let i = 0; i < n; i++) {
        const y = it.y0 + i * it.gap + it.off, big = (i + Math.floor(it.n)) % 11 === 0;
        const g = c.createRadialGradient(it.x - 3, y - 3, 1, it.x, y, it.gap * 0.5);
        g.addColorStop(0, big ? '#fff2c8' : '#d8f0e0'); g.addColorStop(1, big ? '#a8701e' : '#2f7a5a');
        circ(c, it.x, y, it.gap * (big ? 0.5 : 0.42), g);
      }
      /* 穗子 */
      c.fillStyle = '#c9962e'; c.fillRect(it.x - 4, it.y1 + 8, 8, 6);
      c.strokeStyle = '#2f7a5a'; c.lineWidth = 1.5; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(it.x + i, it.y1 + 14); c.lineTo(it.x + i * 2, it.y1 + 34); c.stroke(); }
      if (R.t - it.flash < 1.5) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, it.x, (it.y0 + it.y1) / 2, 80, 'rgba(180,240,200,' + (0.3 * (1 - (R.t - it.flash) / 1.5)).toFixed(3) + ')'); c.restore(); }
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.tasbih, n: it.n }) : R.w.tasbih);
    it.capAt = () => [it.x - 42, it.y1 + 22];
    return it;
  });

  /* ---------- 犹太教：安息日蜡烛 ---------- */
  HR.add('shabbat', function (R) {
    const it = { id: 'shabbat', lit: [false, false], circles: 0, acc: 0, held: false, covered: -9, trail: [], n: 0 };
    it.layout = (W, H, bot) => { it.s = Math.max(14, Math.min(W * 0.04, 18)); it.x = W * 0.5; it.y = bot - it.s * 1.2; it.dx = it.s * 3.4; it.W = W; it.btn = [it.x + it.s * 7, it.y - it.s * 1.4]; };
    const cx = i => it.x + (i ? 1 : -1) * it.dx;
    const flameY = () => it.y - it.s * 6.6;
    it.hit = (x, y) => (Math.abs(x - it.x) < it.dx + it.s * 2 && y > it.y - it.s * 14 && y < it.y + it.s) || (it.lit[0] && it.lit[1] && Math.hypot(x - it.btn[0], y - it.btn[1]) < 34);
    it.down = (x, y, t) => {
      if (it.lit[0] && it.lit[1] && it.circles >= 3 && Math.hypot(x - it.btn[0], y - it.btn[1]) < 34) { it.covered = t; it.n++; S.chime(R.V); R.glow(); R.tip(R.w.blessing, 7); it.circles = 0; return; }
      for (let i = 0; i < 2; i++) if (!it.lit[i] && Math.abs(x - cx(i)) < it.s * 2) { it.lit[i] = t; snd(R.V, a => L.noise(a, 0.3, 0.2, 1700, 0.8)); R.seen(); return; }
      it.held = true; it.prev = Math.atan2(y - flameY(), x - it.x);
    };
    it.move = (x, y, t) => {
      if (!it.held || !(it.lit[0] && it.lit[1])) return;
      const a = Math.atan2(y - flameY(), x - it.x); let d = a - it.prev; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; it.prev = a;
      it.acc += Math.abs(d); it.trail.push({ x, y, t }); if (it.trail.length > 50) it.trail.shift();
      if (it.acc >= TAU) { it.acc -= TAU; it.circles = Math.min(3, it.circles + 1); L.SND.tick(R.V); if (it.circles === 3) R.tip(R.w.shabbatTip, 4); }
    };
    it.up = () => { it.held = false; };
    it.busy = () => it.lit[0] || it.lit[1] || it.trail.length > 0;
    it.step = (dt, t) => { it.trail = it.trail.filter(p => t - p.t < 0.8); };
    it.draw = function (c, t) {
      const s = it.s;
      c.save(); c.globalCompositeOperation = 'lighter'; it.trail.forEach(p => { const a = 1 - (t - p.t) / 0.8; glow(c, p.x, p.y, 16 * a, 'rgba(255,220,150,' + (0.4 * a).toFixed(3) + ')'); }); c.restore();
      for (let i = 0; i < 2; i++) {
        const x = cx(i), y = it.y;
        /* 银烛台 */
        ell(c, x, y, s * 1.4, s * 0.4, '#a8acb4'); c.fillStyle = lin(c, x - s * 0.3, 0, x + s * 0.3, 0, ['#8a8e96', '#f0f2f6', '#9a9ea6']); c.fillRect(x - s * 0.25, y - s * 3, s * 0.5, s * 3);
        ell(c, x, y - s * 3, s * 0.9, s * 0.25, '#c8ccd4'); c.fillStyle = '#c8ccd4'; c.fillRect(x - s * 0.6, y - s * 3.4, s * 1.2, s * 0.4);
        c.fillStyle = '#f8f6f0'; c.fillRect(x - s * 0.35, y - s * 6.4, s * 0.7, s * 3);
        if (it.lit[i]) {
          const k = Math.min(1, (t - it.lit[i]) / 0.4), f = Math.sin(t * 9 + i) * 0.15, fs = s * 0.6 * k;
          c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - s * 6.9, s * 4.5 * k, 'rgba(255,170,70,.35)'); c.restore();
          c.fillStyle = '#ffcf5a'; c.beginPath(); c.moveTo(x, y - s * 6.4 - fs * (2.4 + f)); c.quadraticCurveTo(x + fs * 0.8, y - s * 6.4 - fs * 0.6, x, y - s * 6.4); c.quadraticCurveTo(x - fs * 0.8, y - s * 6.4 - fs * 0.6, x, y - s * 6.4 - fs * (2.4 + f)); c.fill();
        }
      }
      if (it.lit[0] && it.lit[1]) {
        /* 绕手的进度 + “遮眼”按钮 */
        for (let i = 0; i < 3; i++) circ(c, it.x - 10 + i * 10, flameY() - s * 3, 3, i < it.circles ? '#ffd67a' : 'rgba(255,255,255,.3)');
        const ready = it.circles >= 3, b = it.btn;
        c.globalAlpha = ready ? 1 : 0.4; L.label(c, b[0], b[1], '✋ ' + R.w.cover, 1); c.globalAlpha = 1;
      }
      const k = t - it.covered;
      if (k >= 0 && k < 2.5) { c.save(); c.fillStyle = 'rgba(10,6,4,' + (0.55 * Math.sin(Math.min(1, k / 2.5) * Math.PI)).toFixed(3) + ')'; c.fillRect(0, 0, it.W, it.y + 200); c.restore(); }
    };
    it.caption = () => R.w.shabbat;
    it.capAt = () => [it.x, it.y + it.s * 1.1];
    return it;
  });

  /* ---------- 锡克教：拂尘（Chaur Sahib） ---------- */
  HR.add('chaur', function (R) {
    const it = { id: 'chaur', n: 0, a: 0.3, v: 0, held: false, lastDir: 0 };
    it.layout = (W, H, bot) => { it.s = Math.max(26, Math.min(W * 0.085, 38)); it.x = W * 0.9; it.y = H * 0.66; it.len = Math.min(H * 0.3, W * 0.48); };
    const tip = () => [it.x - Math.sin(it.a) * it.len - it.len * 0.3, it.y - Math.cos(it.a) * it.len];
    it.hit = (x, y) => { const p = tip(); return Math.hypot(x - p[0], y - p[1]) < it.s * 2 || Math.hypot(x - it.x, y - it.y) < it.s * 1.4; };
    it.down = (x) => { it.held = true; it.gx = x; it.a0 = it.a; it.moved = 0; };
    it.move = (x) => { if (!it.held) return; const na = Math.max(-0.4, Math.min(1.0, it.a0 - (x - it.gx) / it.len * 1.5)); const d = na - it.a; it.moved += Math.abs(d); const dir = Math.sign(d); if (dir && dir !== it.lastDir && Math.abs(d) > 0.01) { it.lastDir = dir; wave(); } it.v = d * 60; it.a = na; };
    function wave() { it.n++; snd(R.V, a => L.noise(a, 0.35, 0.06, 2400, 0.4)); }
    it.up = () => { it.held = false; if (it.moved < 0.02) { it.v = -4; wave(); } R.seen(); };
    it.busy = () => it.held || Math.abs(it.v) > 0.02 || Math.abs(it.a - 0.3) > 0.01;
    it.step = dt => { if (it.held) return; it.v += (-14 * (it.a - 0.3) - 2.2 * it.v) * dt; it.a += it.v * dt; };
    it.draw = function (c, t) {
      const p = tip(), s = it.s;
      /* 银柄 */
      c.strokeStyle = lin(c, it.x, it.y, p[0], p[1], ['#9aa0aa', '#f4f6fa', '#9aa0aa']); c.lineWidth = s * 0.2; c.lineCap = 'round';
      const mx = it.x + (p[0] - it.x) * 0.45, my = it.y + (p[1] - it.y) * 0.45;
      c.beginPath(); c.moveTo(it.x, it.y); c.lineTo(mx, my); c.stroke();
      circ(c, mx, my, s * 0.2, '#e8c25a');
      /* 白色的毛：一大束，随挥动的速度飘起来 */
      const ang = Math.atan2(p[1] - my, p[0] - mx), lag = Math.max(-0.6, Math.min(0.6, -it.v * 0.06));
      const hair = (col, lw) => {
        c.strokeStyle = col; c.lineWidth = lw;
        for (let i = 0; i < 30; i++) {
          const spread = (i / 29 - 0.5) * 0.55, L2 = Math.hypot(p[0] - mx, p[1] - my) * (0.88 + (i % 5) * 0.03);
          const a1 = ang + spread + lag * 0.5, a2 = ang + spread * 1.7 + lag;
          c.beginPath(); c.moveTo(mx, my); c.quadraticCurveTo(mx + Math.cos(a1) * L2 * 0.55, my + Math.sin(a1) * L2 * 0.55, mx + Math.cos(a2) * L2, my + Math.sin(a2) * L2); c.stroke();
        }
      };
      hair('rgba(110,100,90,.35)', 3.2); hair('rgba(255,255,252,.96)', 1.8);
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.chaur, n: it.n }) : R.w.chaur);
    it.capAt = () => [it.x - it.s * 0.6, it.y + it.s * 1.1];
    return it;
  });

  /* ---------- 新教：钟绳 ---------- */
  HR.add('rope', function (R) {
    const it = { id: 'rope', n: 0, pull: 0, v: 0, held: false, fired: false };
    it.layout = (W, H, bot, top) => { it.x = W * 0.86; it.top = 0; it.end = bot - 70; it.max = 70; };
    const y1 = () => it.end + it.pull;
    it.hit = (x, y) => Math.abs(x - it.x) < 26 && y > it.end * 0.4 && y < y1() + 50;
    it.down = (x, y) => { it.held = true; it.gy = y; it.p0 = it.pull; it.fired = false; };
    it.move = (x, y) => { if (!it.held) return; it.pull = Math.max(0, Math.min(it.max, it.p0 + (y - it.gy))); if (it.pull > it.max * 0.6 && !it.fired) { it.fired = true; toll(); } };
    function toll() { it.n++; snd(R.V, a => { [[262, 0.2, 5], [330, 0.14, 4], [392, 0.1, 3.5], [523, 0.06, 2.5], [698, 0.03, 1.5]].forEach(p => L.partial(a, p[0], p[1], p[2], 'triangle', 1)); }); R.glow(); }
    it.up = () => { if (it.held && !it.fired) { it.v = 260; toll(); } it.held = false; R.seen(); };
    it.busy = () => it.held || it.pull > 0.5 || Math.abs(it.v) > 1;
    it.step = dt => { if (it.held) return; it.v += (-40 * it.pull - 4 * it.v) * dt; it.pull = Math.max(-20, it.pull + it.v * dt); };
    it.draw = function (c) {
      const y = y1();
      c.strokeStyle = '#c8a878'; c.lineWidth = 4; c.beginPath(); c.moveTo(it.x, it.top); c.lineTo(it.x, y + 40); c.stroke();
      /* 手抓的那段“毛绒把手”：红白蓝条纹 */
      const sy = y - 40;
      ['#b8322f', '#f4f2ec', '#2c4f8a', '#f4f2ec', '#b8322f', '#f4f2ec', '#2c4f8a'].forEach((col, i) => { c.fillStyle = col; rr(c, it.x - 9, sy + i * 8, 18, 9, 4); c.fill(); });
      c.strokeStyle = '#c8a878'; c.lineWidth = 3; c.beginPath(); c.moveTo(it.x, y + 16); c.quadraticCurveTo(it.x + 14, y + 30, it.x + 4, y + 44); c.stroke();
    };
    it.caption = () => (it.n ? fmt(R.w.count, { name: R.w.rope, n: it.n }) : R.w.rope);
    it.capAt = () => [it.x - 44, y1() + 20];
    return it;
  });

  /* ---------- 新教：圣经 ---------- */
  HR.add('bible', function (R) {
    const it = { id: 'bible', n: 0, flip: -9, page: 0 };
    it.layout = (W, H, bot) => { it.s = Math.max(30, Math.min(W * 0.1, 44)); it.x = W * 0.24; it.y = bot - it.s * 0.9; };
    it.hit = (x, y) => Math.abs(x - it.x) < it.s * 1.3 && Math.abs(y - it.y) < it.s * 0.9;
    it.down = (x, y, t) => { it.flip = t; it.page = (it.page + 1) % R.w.verses.length; it.n++; snd(R.V, a => L.noise(a, 0.25, 0.1, 3000, 0.7)); R.tip(R.w.verses[it.page], 6); R.seen(); };
    it.busy = () => R.t - it.flip < 0.6;
    it.step = () => {};
    it.draw = function (c, t) {
      const s = it.s, x = it.x, y = it.y;
      c.fillStyle = '#3a1a10'; c.beginPath(); c.moveTo(x - s * 1.25, y + s * 0.15); c.lineTo(x + s * 1.25, y + s * 0.15); c.lineTo(x + s * 1.15, y + s * 0.4); c.lineTo(x - s * 1.15, y + s * 0.4); c.closePath(); c.fill();
      [-1, 1].forEach(sd => { c.fillStyle = '#fbf8f0'; c.beginPath(); c.moveTo(x, y + s * 0.2); c.quadraticCurveTo(x + sd * s * 0.6, y - s * 0.05, x + sd * s * 1.15, y + s * 0.1); c.lineTo(x + sd * s * 1.12, y - s * 0.55); c.quadraticCurveTo(x + sd * s * 0.6, y - s * 0.72, x, y - s * 0.5); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(80,60,40,.3)'; c.lineWidth = 0.8; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x + sd * s * 0.15, y - s * (0.42 - i * 0.1)); c.lineTo(x + sd * s * 0.95, y - s * (0.45 - i * 0.1)); c.stroke(); } });
      c.fillStyle = '#b8322f'; c.fillRect(x - 1, y - s * 0.5, 2, s * 0.9);
      const k = t - it.flip;
      if (k >= 0 && k < 0.5) { const u = k / 0.5, w2 = Math.cos(u * Math.PI) * s * 1.1; c.fillStyle = 'rgba(255,252,244,.95)'; c.beginPath(); c.moveTo(x, y + s * 0.2); c.lineTo(x + w2, y + s * 0.1 - Math.sin(u * Math.PI) * s * 0.3); c.lineTo(x + w2, y - s * 0.6 - Math.sin(u * Math.PI) * s * 0.3); c.lineTo(x, y - s * 0.5); c.closePath(); c.fill(); }
    };
    it.caption = () => R.w.bible;
    it.capAt = () => [it.x, it.y + it.s * 0.75];
    return it;
  });

  /* ---------- 各版本放什么 ---------- */
  HR.kit('buddhism.theravada.th', ['goldleaf', 'tbells'], 'goldTip');
  HR.kit('buddhism.india.navayana', ['candles', 'petals'], 'candleTip');
  HR.kit('hinduism.ghat', ['ghanta', 'conch', 'aarti'], 'hinduTip');
  HR.kit('daoism.mountain', ['bell', 'muyu', 'qing', 'incense'], 'percTip');
  HR.kit('buddhism.japan', ['bell', 'muyu', 'qing', 'incense'], 'percTip');
  HR.kit('shinto.shrine', ['clap', 'suzu'], 'shintoTip');
  HR.kit('islam.mosque', ['tasbih'], 'tasbihTip');
  HR.kit('judaism.shabbat', ['shabbat'], 'shabbatTip');
  HR.kit('sikhism.gurdwara', ['chaur'], 'chaurTip');
  HR.kit('christianity.protestant', ['bible', 'rope'], 'protTip');
  HR.kit('christianity.orthodox', ['tapers', 'censer'], 'taperTip');
})(typeof HallRite !== 'undefined' ? HallRite : null);
