/* 河坛小庙（印度教 · 恒河边的湿婆小庙）：玩法定义与场景。 */
Courtyard.define({
  id: 'hinduism.ghat',
  saveKey: 'threshold-hi-save-v1',
  tz: 'Asia/Kolkata',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap',
  theme: { hud: 'rgba(90,30,10,.92)', bar: '#5a1e0a', btn: '#fbeedd', btnInk: '#5a1e0a', accent: '#c4561a', stage: '#2a160c' },
  bell: 'bowl',
  horizon: 0.42,
  seasons: mo => (mo >= 3 && mo <= 6 ? 'hot' : mo >= 7 && mo <= 9 ? 'monsoon' : 'cool'),
  resource: { icon: '🌾', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 22, max: 6, pile: 'petals', spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cow', 'dog'], max: 4, every: 120, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['甘加', '娜迪', '高丽', '卡莉', '莫蒂', '拉鲁', '谢鲁', '布鲁'], en: ['Ganga', 'Nandi', 'Gauri', 'Kali', 'Moti', 'Lalu', 'Sheru', 'Bhuru'] },
    families: { 'zh-CN': ['河坛边卖花环的一家', '撑船的老人', '附近学校的老师', '开茶摊的兄弟俩'], en: ['the family who sell marigold garlands on the ghat', 'an old boatman', 'a teacher from the nearby school', 'two brothers who run a chai stall'] },
  },
  shop: ['food.cow', 'food.dog', 'med', 'tool'],
  practices: [
    { id: 'darshan', icon: '🔔', kind: 'steps', steps: 3, sound: 'chime' },
    { id: 'puja', icon: '🪔', kind: 'offer', items: ['flowers', 'diya', 'incense', 'fruit'], sound: 'chime' },
    { id: 'japa', icon: '📿', kind: 'count', targets: [27, 108], sound: 'chime', lang: 'sa' },
    { id: 'read', icon: '📜', kind: 'read' },
    { id: 'aarti', icon: '🔥', kind: 'steps', steps: 3, window: [18, 20], daily: true, sound: 'chime', audio: 'ref.hi.aarti' },
  ],
  msg: {
    'zh-CN': {
      'app.title': '河坛小庙',
      'app.label': '启扉 · 印度教 · 河坛小庙（未经审核的预览）',
      'intro.body': '恒河边一段石阶（ghat）上的小庙，供奉湿婆。尖塔上飘着橙色的旗，台阶上落满金盏花瓣。庙后有个小牛棚，几头牛和河坛上的狗一起过日子。傍晚，河坛上会点起晚祷的灯。',
      'intro.how': '清扫台阶上的花瓣，庙里会分给你粮食，用来喂牛和狗。观瞻、供奉、晚祷和持诵只记在功课簿里。',
      'intro.etiquette': '进庙前脱鞋。',
      'res.name': '粮食',
      'chore.label': '扫台阶',
      'chore.pile': '花瓣',
      'chore.got': '台阶扫干净一段，庙里分来 {n} 份粮食',
      'prac.darshan.bar': '观瞻',
      'prac.darshan.title': '观瞻（Darshan）',
      'prac.darshan.body': '观瞻就是“看见神，也被神看见”。脱鞋进庙，摇一下门口的铃，合掌站在神龛前静静地看。',
      'prac.darshan.step.1': '脱鞋，摇铃',
      'prac.darshan.step.2': '合掌，在神龛前观瞻',
      'prac.darshan.step.3': '顺时针绕神龛一圈',
      'prac.darshan.btn': '继续',
      'prac.darshan.done': '观瞻完毕，已记入功课簿',
      'prac.puja.bar': '供奉',
      'prac.puja.title': '供奉（Puja）',
      'prac.puja.body': '献上花、油灯、香或水果。供过的食物会作为“prasad”（恩赐）分给大家。不用粮食，也不换取任何东西。',
      'offer.flowers': '一串金盏花环',
      'offer.diya': '一盏陶土油灯',
      'offer.incense': '一支香',
      'offer.fruit': '一份水果',
      'offer.why.flowers': '鲜花代表心意',
      'offer.why.diya': '灯光驱散黑暗',
      'offer.why.incense': '香气代表敬意',
      'offer.why.fruit': '供过的水果会分给来客',
      'prac.japa.bar': '持诵',
      'prac.japa.title': '念珠持诵（Japa）',
      'prac.japa.body': '用一串 108 颗的念珠，每念一遍拨一颗。',
      'prac.japa.mantra': 'ॐ नमः शिवाय',
      'prac.japa.mantraLatn': 'oṃ namaḥ śivāya',
      'prac.japa.mantraTr': '唵，礼敬湿婆',
      'prac.japa.note': '每点一下拨一颗珠。',
      'prac.read.bar': '诵读',
      'prac.read.title': '诵读',
      'prac.read.body': '天城体梵文、IAST 转写和译文逐行对照。',
      'usage.gayatri': '吠陀中最有名的一句，许多人清晨念诵；部分传统认为需入门后才念',
      'usage.panchakshara': '湿婆信徒最常持诵的五字真言',
      'usage.mahamrityunjaya': '祈求健康与解脱的真言',
      'usage.asatoma': '出自奥义书的祈祷，常在仪式结束时念',
      'prac.aarti.bar': '晚祷',
      'prac.aarti.title': '晚祷挥灯（Aarti）',
      'prac.aarti.body': '傍晚在河坛上，人们一边唱颂，一边顺时针挥动点着的灯。可以在旁边合掌静听。只在傍晚 6 点到 8 点，一天记一次。',
      'prac.aarti.step.1': '在台阶上坐下，合掌',
      'prac.aarti.step.2': '灯顺时针挥动，跟着静听唱颂',
      'prac.aarti.step.3': '用手掌在灯焰上方拂过，再轻触额头',
      'prac.aarti.btn': '继续',
      'prac.aarti.done': '晚祷结束，已记入功课簿',
      'hint.window.aarti': '傍晚了，河坛上的晚祷要开始了。',
      'care.intro': '庙里的牛和河坛上的狗。牛在这里受到敬重，伤好后留在牛棚由大家照顾。',
      'hint.dawn': '清晨，有人在恒河里沐浴，向太阳献水。',
    },
    en: {
      'app.title': 'Ghat Shrine',
      'app.label': 'Threshold · Hinduism · Ghat Shrine (unreviewed preview)',
      'intro.body': 'A small Shiva shrine on the stone steps of a ghat by the Ganga. A saffron flag flies from the spire and marigold petals cover the steps. Behind it is a little cowshed where a few cows live alongside the ghat dogs. In the evening the lamps of aarti are lit by the river.',
      'intro.how': 'Sweeping petals off the steps earns grain from the temple, which feeds the cows and dogs. Darshan, puja, aarti and japa are only noted in the practice book.',
      'intro.etiquette': 'Take off your shoes before entering the shrine.',
      'res.name': 'grain',
      'chore.label': 'Sweep',
      'chore.pile': 'petals',
      'chore.got': 'Swept a stretch of steps; the temple gives {n} grain',
      'prac.darshan.bar': 'Darshan',
      'prac.darshan.title': 'Darshan',
      'prac.darshan.body': 'Darshan is “seeing the deity and being seen”. Take off your shoes, ring the bell at the door, and stand quietly before the shrine with joined palms.',
      'prac.darshan.step.1': 'Shoes off, ring the bell',
      'prac.darshan.step.2': 'Join palms and take darshan',
      'prac.darshan.step.3': 'Walk once clockwise around the shrine',
      'prac.darshan.btn': 'Continue',
      'prac.darshan.done': 'Darshan taken; noted in the practice book',
      'prac.puja.bar': 'Puja',
      'prac.puja.title': 'Puja',
      'prac.puja.body': 'Offer flowers, a lamp, incense or fruit. Offered food comes back as prasad, shared with everyone. It costs no grain and earns nothing.',
      'offer.flowers': 'a marigold garland',
      'offer.diya': 'a clay oil lamp',
      'offer.incense': 'a stick of incense',
      'offer.fruit': 'some fruit',
      'offer.why.flowers': 'Flowers carry the heart’s offering',
      'offer.why.diya': 'Light drives away darkness',
      'offer.why.incense': 'Fragrance shows respect',
      'offer.why.fruit': 'Offered fruit is shared with visitors',
      'prac.japa.bar': 'Japa',
      'prac.japa.title': 'Japa with a mala',
      'prac.japa.body': 'With a mala of 108 beads, move one bead for each repetition.',
      'prac.japa.mantra': 'ॐ नमः शिवाय',
      'prac.japa.mantraLatn': 'oṃ namaḥ śivāya',
      'prac.japa.mantraTr': 'Om, salutation to Śiva',
      'prac.japa.note': 'Each tap moves one bead.',
      'prac.read.bar': 'Recite',
      'prac.read.title': 'Recitation',
      'prac.read.body': 'Sanskrit in Devanagari, IAST and translation line by line.',
      'usage.gayatri': 'The best-known Vedic verse, said by many at dawn; some traditions reserve it for the initiated',
      'usage.panchakshara': 'The five-syllable mantra most repeated by devotees of Śiva',
      'usage.mahamrityunjaya': 'A mantra for health and liberation',
      'usage.asatoma': 'An Upaniṣadic prayer, often said at the close of a rite',
      'prac.aarti.bar': 'Aarti',
      'prac.aarti.title': 'Evening aarti',
      'prac.aarti.body': 'At dusk on the ghat, lamps are waved clockwise while hymns are sung. You can sit and listen with joined palms. Only from 6 to 8 p.m., once a day.',
      'prac.aarti.step.1': 'Sit on the steps and join your palms',
      'prac.aarti.step.2': 'The lamps circle clockwise; listen to the hymn',
      'prac.aarti.step.3': 'Pass your palms over the flame and touch your forehead',
      'prac.aarti.btn': 'Continue',
      'prac.aarti.done': 'Aarti over; noted in the practice book',
      'hint.window.aarti': 'Dusk: aarti is about to begin on the ghat.',
      'care.intro': 'The temple cows and the ghat dogs. Cows are honoured here; once healed they stay in the cowshed and everyone looks after them.',
      'hint.dawn': 'Dawn: people bathe in the Ganga and offer water to the sun.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.42;
      ctx.fillStyle = '#d9c9a0'; ctx.fillRect(0, hy - h * 0.01, w, h * 0.015);
      const rv = ctx.createLinearGradient(0, hy, 0, h * 0.56);
      rv.addColorStop(0, m.night ? '#1c2a3a' : '#7a9aa8'); rv.addColorStop(1, m.night ? '#14202c' : '#5a7a86');
      ctx.fillStyle = rv; ctx.fillRect(0, hy, w, h * 0.14);
      ctx.strokeStyle = 'rgba(255,255,255,.18)';
      for (let i = 0; i < 6; i++) { const y = hy + 8 + i * 9, o = m.reduceMotion ? 0 : (t * 10 + i * 30) % w; ctx.beginPath(); ctx.moveTo(o, y); ctx.lineTo(o + 40, y); ctx.stroke(); }
      /* 小船 */
      const bxp = (w * 0.2 + (m.reduceMotion ? 0 : t * 4)) % (w + 60) - 30;
      K.poly(ctx, [[bxp - 22, hy + h * 0.06], [bxp + 22, hy + h * 0.06], [bxp + 16, hy + h * 0.075], [bxp - 16, hy + h * 0.075]], '#5a3a22');
      /* 河坛石阶 */
      for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? '#c9b38a' : '#bda67c'; ctx.fillRect(0, h * 0.56 + i * h * 0.024, w, h * 0.024); }
      K.ground(ctx, w, h, h * 0.73, '#c4ad84', '#b09670');
      /* 湿婆小庙：方殿 + 曲线尖塔（shikhara） */
      const cx = w * 0.42, base = h * 0.73;
      ctx.fillStyle = '#e9dcc0'; ctx.fillRect(cx - w * 0.14, base - h * 0.1, w * 0.28, h * 0.1);
      ctx.beginPath(); ctx.moveTo(cx - w * 0.1, base - h * 0.1);
      ctx.quadraticCurveTo(cx - w * 0.1, base - h * 0.26, cx, base - h * 0.3);
      ctx.quadraticCurveTo(cx + w * 0.1, base - h * 0.26, cx + w * 0.1, base - h * 0.1); ctx.closePath();
      ctx.fillStyle = '#e2cfa8'; ctx.fill();
      ctx.strokeStyle = 'rgba(120,90,50,.35)';
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(cx - w * 0.1 + i * w * 0.004, base - h * 0.1 - i * h * 0.03); ctx.lineTo(cx + w * 0.1 - i * w * 0.004, base - h * 0.1 - i * h * 0.03); ctx.stroke(); }
      K.circle(ctx, cx, base - h * 0.305, w * 0.014, '#d4a63a');
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(cx - 1, base - h * 0.36, 2, h * 0.05);
      const wv = m.reduceMotion ? 0 : Math.sin(t * 3) * 3;
      K.poly(ctx, [[cx + 1, base - h * 0.36], [cx + w * 0.07, base - h * 0.345 + wv], [cx + 1, base - h * 0.33]], '#e8792b');
      ctx.fillStyle = '#4a2a1a'; K.rr(ctx, cx - w * 0.04, base - h * 0.085, w * 0.08, h * 0.085, 8); ctx.fill();
      K.glow(ctx, cx, base - h * 0.035, w * 0.035, 'rgba(255,190,90,.5)', t);
      /* 门口的铃 */
      ctx.fillStyle = '#c8962e'; ctx.beginPath(); ctx.arc(cx + w * 0.06, base - h * 0.08, 5, Math.PI, 0); ctx.fill();
      K.hit('spot', 'darshan', cx, base - h * 0.05, Math.max(28, w * 0.07));
      /* 牛棚 */
      ctx.fillStyle = '#a07a50'; ctx.fillRect(w * 0.72, base - h * 0.08, w * 0.24, h * 0.08);
      K.poly(ctx, [[w * 0.7, base - h * 0.08], [w * 0.84, base - h * 0.12], [w * 0.98, base - h * 0.08]], '#7a5a3a');
      K.tree(ctx, w * 0.12, h * 0.73, h * 0.17, 'banyan', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.hour >= 17.5 || m.hour < 6) {
        for (let i = 0; i < 9; i++) { const x = ((i * 0.12 + (m.reduceMotion ? 0 : t * 0.004)) % 1) * w, y = h * (0.47 + (i % 3) * 0.025); K.glow(ctx, x, y, 7, 'rgba(255,190,90,.8)', t + i); }
      }
      if (m.hour >= 18 && m.hour < 20) for (let i = 0; i < 3; i++) K.glow(ctx, w * (0.25 + i * 0.25), h * 0.6, h * 0.04, 'rgba(255,170,60,.6)', t * 2 + i);
      if (m.offered.indexOf('diya') >= 0) K.flame(ctx, w * 0.36, h * 0.725, 4, t);
    },
  },
});
