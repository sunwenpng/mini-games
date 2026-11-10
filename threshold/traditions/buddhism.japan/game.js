/* 禅寺小庭（日本佛教 · 禅宗风格）：玩法定义与场景。 */
Courtyard.define({
  id: 'buddhism.japan',
  saveKey: 'threshold-ja-save-v1',
  tz: 'Asia/Tokyo',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&display=swap',
  theme: { hud: 'rgba(28,30,32,.92)', bar: '#24262a', btn: '#efe9dc', btnInk: '#2a2a2a', accent: '#4a5a3a', stage: '#1e2022' },
  bell: 'temple',
  horizon: 0.44,
  resource: { icon: '🍙', start: 12 },
  chore: { icon: '🪨', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.08, 0.8, 0.92, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'dog'], max: 4, every: 120, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['小雪', '麻糬', '阿福', '小豆', '虎太郎', '小梅', '茶茶', '小樱'], en: ['Yuki', 'Mochi', 'Fuku', 'Azuki', 'Kotaro', 'Ume', 'Chacha', 'Sakura'] },
    families: { 'zh-CN': ['门前卖团子的老奶奶', '住在附近的大学生', '寺子屋的老师', '来扫墓的一家人'], en: ['the old woman who sells dango by the gate', 'a university student nearby', 'the teacher from the community school', 'a family visiting their family grave'] },
  },
  practices: [
    { id: 'gassho', icon: '🙏', kind: 'steps', steps: 2, sound: 'bowl' },
    { id: 'incense', icon: '🌸', kind: 'offer', items: ['senko', 'hana', 'tomyo'], sound: 'bowl' },
    { id: 'zazen', icon: '🧘', kind: 'timer', minutes: [3, 5, 10] },
    { id: 'read', icon: '📿', kind: 'read' },
    { id: 'bell', icon: '🔔', kind: 'steps', steps: 1, daily: true, audio: 'ref.ja.bell' },
  ],
  msg: {
    'zh-CN': {
      'app.title': '禅寺小庭',
      'app.label': '启扉 · 日本佛教（禅宗风格）· 禅寺小庭（未经审核的预览）',
      'intro.body': '一座小禅寺：瓦顶本堂、钟楼、石灯笼，还有用耙子耙出波纹的枯山水。春天樱花，秋天红叶。寺里的猫常在檐下打盹。',
      'intro.how': '耙沙、扫青苔上的落叶，能从寺里分到饭团，用来照顾猫和狗。合掌礼、上香、坐禅、读经和撞钟只记在功课簿里。',
      'intro.etiquette': '在山门前合掌一礼再进去。',
      'res.name': '饭团',
      'chore.label': '耙庭',
      'chore.pile': '落叶和积雪',
      'chore.got': '耙好一片庭院，寺里分来 {n} 个饭团',
      'prac.gassho.bar': '合掌',
      'prac.gassho.title': '合掌礼',
      'prac.gassho.body': '双手掌心相合，指尖向上，放在胸前，微微低头一礼。进山门时一次，到本堂前一次。',
      'prac.gassho.step.1': '山门前一礼',
      'prac.gassho.step.2': '本堂前一礼',
      'prac.gassho.btn': '合掌一礼',
      'prac.gassho.done': '礼毕，已记入功课簿',
      'prac.incense.bar': '上香',
      'prac.incense.title': '线香、花、灯明',
      'prac.incense.body': '在香炉里立一支线香，或供花、点一盏灯明。不用饭团，也不换取任何东西。',
      'offer.senko': '一支线香',
      'offer.hana': '一束时令花',
      'offer.tomyo': '一盏灯明',
      'offer.why.senko': '香烟升起，清净身心',
      'offer.why.hana': '花会凋谢，提醒无常',
      'offer.why.tomyo': '灯明象征智慧',
      'prac.zazen.bar': '坐禅',
      'prac.zazen.title': '坐禅',
      'prac.zazen.body': '面向墙壁坐下，背挺直，双手结法界定印，眼睛半闭看前方地面，只是数呼吸或只管坐。开始和结束时敲一下钟。',
      'prac.zazen.during': '呼吸自然。念头来了，就让它走。',
      'prac.zazen.note': '可以提前结束；坐满才记入功课簿。',
      'prac.read.bar': '读经',
      'prac.read.title': '读经',
      'prac.read.body': '日文汉字、罗马字读音和译文逐行对照。',
      'usage.hannya': '禅宗早晚课最常读的经',
      'usage.enmei': '很短的观音经，白隐禅师推广',
      'usage.shiguseigan': '法会结束时常读的四句誓愿',
      'prac.bell.bar': '撞钟',
      'prac.bell.title': '梵钟',
      'prac.bell.body': '有的寺院允许参拜者撞一下钟。先合掌一礼，再拉绳撞钟，听余音散尽。一天一次。',
      'prac.bell.step.1': '合掌一礼，撞钟',
      'prac.bell.btn': '撞钟',
      'prac.bell.done': '钟声远去，已记入功课簿',
      'care.intro': '寺里的猫狗。日本不少寺院有猫，被当作寺里的一员。',
      'hint.dawn': '清晨，本堂传来早课的读经声。',
      'hint.night': '石灯笼亮了，庭院很安静。',
    },
    en: {
      'app.title': 'Zen Temple Garden',
      'app.label': 'Threshold · Japanese Buddhism (Zen style) · Zen Temple Garden (unreviewed preview)',
      'intro.body': 'A small Zen temple: a tiled main hall, a bell tower, stone lanterns and a dry garden of raked gravel. Cherry blossom in spring, red maples in autumn. The temple cat naps under the eaves.',
      'intro.how': 'Raking the gravel and sweeping leaves off the moss earns rice balls, which feed the cats and dogs. Gasshō, incense, zazen, sutra chanting and ringing the bell are only noted in the practice book.',
      'intro.etiquette': 'Bow with joined palms at the gate before entering.',
      'res.name': 'rice balls',
      'chore.label': 'Rake',
      'chore.pile': 'leaves and snow',
      'chore.got': 'Raked a patch of garden; the temple sends {n} rice balls',
      'prac.gassho.bar': 'Gasshō',
      'prac.gassho.title': 'Gasshō',
      'prac.gassho.body': 'Press the palms together, fingertips up, in front of the chest and bow slightly: once at the gate, once before the main hall.',
      'prac.gassho.step.1': 'Bow at the gate',
      'prac.gassho.step.2': 'Bow before the main hall',
      'prac.gassho.btn': 'Bow',
      'prac.gassho.done': 'Bowed; noted in the practice book',
      'prac.incense.bar': 'Incense',
      'prac.incense.title': 'Incense, flowers, light',
      'prac.incense.body': 'Stand a stick of incense in the burner, or offer flowers or a lamp. It costs no rice balls and earns nothing.',
      'offer.senko': 'a stick of incense',
      'offer.hana': 'seasonal flowers',
      'offer.tomyo': 'a lamp',
      'offer.why.senko': 'The rising smoke clears body and mind',
      'offer.why.hana': 'Flowers fade, a reminder of impermanence',
      'offer.why.tomyo': 'Light stands for wisdom',
      'prac.zazen.bar': 'Zazen',
      'prac.zazen.title': 'Zazen',
      'prac.zazen.body': 'Sit facing the wall, back upright, hands in the cosmic mudra, eyes half closed on the floor ahead. Count breaths or just sit. A bell marks the start and end.',
      'prac.zazen.during': 'Breathe naturally. When thoughts come, let them go.',
      'prac.zazen.note': 'You can stop early; only a full sitting is noted.',
      'prac.read.bar': 'Chant',
      'prac.read.title': 'Sutra chanting',
      'prac.read.body': 'Japanese text, rōmaji reading and translation line by line.',
      'usage.hannya': 'The sutra chanted most often at Zen morning and evening services',
      'usage.enmei': 'A very short Kannon sutra, spread by Hakuin',
      'usage.shiguseigan': 'The four vows chanted at the close of services',
      'prac.bell.bar': 'Bell',
      'prac.bell.title': 'Temple bell',
      'prac.bell.body': 'Some temples let visitors strike the great bell once. Bow, pull the rope, and listen until the sound fades. Once a day.',
      'prac.bell.step.1': 'Bow and strike the bell',
      'prac.bell.btn': 'Strike',
      'prac.bell.done': 'The sound fades; noted in the practice book',
      'care.intro': 'The temple’s cats and dogs. Many Japanese temples keep a cat as one of the household.',
      'hint.dawn': 'Early morning; chanting drifts from the main hall.',
      'hint.night': 'The stone lanterns are lit and the garden is quiet.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.44;
      K.hills(ctx, w, hy, '#5f7a62', h * 0.1, 21);
      K.ground(ctx, w, h, hy, '#7d8f6a', '#6a7a58');
      /* 枯山水：白砂与耙纹、石组 */
      const gy = h * 0.74;
      ctx.fillStyle = m.season === 'winter' ? '#f2f2ee' : '#e6e1d4'; ctx.fillRect(0, gy, w, h - gy);
      ctx.strokeStyle = 'rgba(150,140,120,.45)'; ctx.lineWidth = 1;
      for (let y = gy + 8; y < h; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= w; x += 20) ctx.lineTo(x, y + Math.sin(x / 30) * 1.5); ctx.stroke(); }
      [[0.2, 0.86, 0.05], [0.26, 0.88, 0.03], [0.72, 0.9, 0.045]].forEach(r => {
        ctx.strokeStyle = 'rgba(150,140,120,.6)'; ctx.beginPath(); ctx.ellipse(r[0] * w, r[1] * h, r[2] * w * 1.8, r[2] * w * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#6e6a62'; ctx.beginPath(); ctx.ellipse(r[0] * w, r[1] * h - r[2] * w * 0.2, r[2] * w, r[2] * w * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      });
      /* 本堂 */
      const cx = w * 0.46, base = h * 0.7, bw = w * 0.52;
      ctx.fillStyle = '#8a6a48'; ctx.fillRect(cx - bw * 0.45, base - h * 0.012, bw * 0.9, h * 0.012);
      ctx.fillStyle = '#efe9dc'; ctx.fillRect(cx - bw * 0.4, base - h * 0.13, bw * 0.8, h * 0.12);
      ctx.fillStyle = '#6b4a30';
      for (let i = 0; i <= 6; i++) ctx.fillRect(cx - bw * 0.4 + i * bw * 0.8 / 6 - 2, base - h * 0.13, 4, h * 0.12);
      ctx.fillStyle = '#3a2a1e'; ctx.fillRect(cx - bw * 0.1, base - h * 0.1, bw * 0.2, h * 0.09);
      const ry = base - h * 0.13;
      K.poly(ctx, [[cx - bw * 0.56, ry + 4], [cx - bw * 0.42, ry - h * 0.02], [cx - bw * 0.22, ry - h * 0.11], [cx + bw * 0.22, ry - h * 0.11], [cx + bw * 0.42, ry - h * 0.02], [cx + bw * 0.56, ry + 4], [cx + bw * 0.46, ry + 2], [cx - bw * 0.46, ry + 2]], '#4c5258');
      ctx.strokeStyle = '#3a3f44'; ctx.lineWidth = 1;
      for (let i = 1; i < 12; i++) { const x = cx - bw * 0.42 + i * bw * 0.84 / 12; ctx.beginPath(); ctx.moveTo(x, ry - h * 0.02); ctx.lineTo(x + (x - cx) * 0.05, ry + 2); ctx.stroke(); }
      ctx.fillStyle = '#5a6066'; ctx.fillRect(cx - bw * 0.23, ry - h * 0.118, bw * 0.46, h * 0.01);
      /* 钟楼 */
      const bx = w * 0.86, by = h * 0.72;
      ctx.fillStyle = '#6b4a30'; ctx.fillRect(bx - w * 0.07, by - h * 0.13, 4, h * 0.13); ctx.fillRect(bx + w * 0.07 - 4, by - h * 0.13, 4, h * 0.13);
      K.poly(ctx, [[bx - w * 0.1, by - h * 0.12], [bx, by - h * 0.17], [bx + w * 0.1, by - h * 0.12]], '#4c5258');
      ctx.fillStyle = '#4a4a3e'; K.rr(ctx, bx - w * 0.028, by - h * 0.115, w * 0.056, h * 0.065, 6); ctx.fill();
      K.hit('spot', 'bell', bx, by - h * 0.08, Math.max(26, w * 0.07));
      /* 石灯笼 */
      const lx = w * 0.12, ly = h * 0.74;
      ctx.fillStyle = '#9a968c'; ctx.fillRect(lx - 3, ly - h * 0.05, 6, h * 0.05);
      ctx.fillRect(lx - 9, ly - h * 0.075, 18, h * 0.025);
      K.poly(ctx, [[lx - 14, ly - h * 0.075], [lx, ly - h * 0.1], [lx + 14, ly - h * 0.075]], '#8a867c');
      K.tree(ctx, w * 0.07, h * 0.62, h * 0.15, m.season === 'spring' ? 'sakura' : 'maple', m, t);
      K.tree(ctx, w * 0.95, h * 0.58, h * 0.13, 'pine', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6.2 || m.hour > 18.2) K.glow(ctx, w * 0.12, h * 0.74 - h * 0.062, h * 0.04, 'rgba(255,200,120,.75)', t);
      if (m.offered.indexOf('tomyo') >= 0) K.flame(ctx, w * 0.46, h * 0.665, 4, t);
      if (m.offered.indexOf('senko') >= 0) for (let i = 0; i < 3; i++) K.circle(ctx, w * 0.52 + Math.sin(t + i) * 4, h * 0.67 - i * 8 - (t * 6 % 8), 3 + i, 'rgba(220,220,220,' + (0.3 - i * 0.08) + ')');
    },
  },
});
