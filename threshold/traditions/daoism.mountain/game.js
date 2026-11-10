/* 山中道观（道教）：玩法定义与场景。 */
Courtyard.define({
  id: 'daoism.mountain',
  saveKey: 'threshold-dao-save-v1',
  tz: 'Asia/Shanghai',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  theme: { hud: 'rgba(24,34,32,.92)', bar: '#1f2b28', btn: '#eef0e6', btnInk: '#1f2b28', accent: '#3d6b5a', stage: '#18201e' },
  bell: 'qing',
  horizon: 0.46,
  resource: { icon: '🍵', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'dog'], max: 4, every: 120, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['清风', '明月', '松子', '云团', '小白', '阿黄', '墨墨', '桂花'], en: ['Qingfeng', 'Mingyue', 'Pinecone', 'Cloud', 'Snowy', 'Ahuang', 'Ink', 'Osmanthus'] },
    families: { 'zh-CN': ['山脚卖茶叶的人家', '来写生的美术老师', '山下镇上的小学生一家', '护林员夫妇'], en: ['the tea sellers at the foot of the mountain', 'an art teacher who comes to sketch', 'a family from the town below', 'the forest rangers'] },
  },
  practices: [
    { id: 'salute', icon: '🙌', kind: 'steps', steps: 2, sound: 'qing' },
    { id: 'incense', icon: '🕯️', kind: 'offer', items: ['xiang', 'cha', 'deng'], sound: 'qing' },
    { id: 'sit', icon: '🧘', kind: 'timer', minutes: [3, 5, 10] },
    { id: 'read', icon: '📜', kind: 'read' },
    { id: 'learn', icon: '📖', kind: 'learn', cards: ['sanqing', 'daily', 'quanzhen'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '山中道观',
      'app.label': '启扉 · 道教 · 山中道观（未经审核的预览）',
      'intro.body': '半山腰的一座小道观：红墙山门，黑瓦大殿，殿前一只大香炉，四周松柏和竹林。清晨云雾从山谷里升起来，道长在院子里打扫。',
      'intro.how': '打扫山门和台阶能分到斋饭，用来照顾观里的猫狗。行礼、上香、静坐和读经只记在功课簿里。',
      'intro.etiquette': '进殿时跨过门槛，不要踩在门槛上。',
      'res.name': '斋饭',
      'chore.label': '扫山门',
      'chore.pile': '落叶和积雪',
      'chore.got': '台阶扫干净一段，斋堂分来 {n} 份斋饭',
      'prac.salute.bar': '行礼',
      'prac.salute.title': '抱拳礼',
      'prac.salute.body': '道教常用拱手或抱拳行礼：左手在外抱住右手，举在胸前，微微躬身。见到道长时可以这样问好，说一声“无量天尊”或“慈悲”。',
      'prac.salute.step.1': '在山门前抱拳一礼',
      'prac.salute.step.2': '到大殿前抱拳一礼',
      'prac.salute.btn': '行礼',
      'prac.salute.done': '礼毕，已记入功课簿',
      'prac.incense.bar': '上香',
      'prac.incense.title': '三炷香、清茶、灯',
      'prac.incense.body': '道观里一般上三炷香：右手点燃，左手持香，举过额头，依次插入香炉。也可以供一杯清茶、一盏灯。不用斋饭，也不换取任何东西。',
      'offer.xiang': '三炷清香',
      'offer.cha': '一杯清茶',
      'offer.deng': '一盏油灯',
      'offer.why.xiang': '一般解释为敬道、经、师三宝',
      'offer.why.cha': '清茶代表心意清净',
      'offer.why.deng': '灯光代表光明',
      'prac.sit.bar': '静坐',
      'prac.sit.title': '静坐',
      'prac.sit.body': '盘腿或端坐，腰背放松挺直，舌抵上颚，呼吸细长，心思放在小腹（丹田）。开始和结束各敲一声磬。',
      'prac.sit.during': '呼吸细、匀、深、长。',
      'prac.sit.note': '可以提前结束；坐满才记入功课簿。',
      'prac.read.bar': '读经',
      'prac.read.title': '读经',
      'prac.read.body': '原文、拼音和白话译文逐行对照。',
      'usage.ddj1': '《道德经》开篇，讲“道”不可言说',
      'usage.ddj8': '以水为喻，讲不争之德',
      'usage.qingjing': '道观早晚课常诵的短经',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解道教',
      'prac.learn.body': '几张小卡片。',
      'learn.sanqing.title': '三清',
      'learn.sanqing.sub': '道教最高的三位尊神',
      'learn.sanqing.body': '三清是元始天尊、灵宝天尊、道德天尊（即太上老君）。大殿里供奉的常常就是三清。\n游戏里神像只作远景，不可点击。',
      'learn.daily.title': '道观的一天',
      'learn.daily.sub': '早晚课与劳作',
      'learn.daily.body': '道士清晨上早课，诵经礼拜；白天打扫、种菜、接待来客；傍晚上晚课。\n很多道观也教太极拳、八段锦等养生功法。',
      'learn.quanzhen.title': '全真与正一',
      'learn.quanzhen.sub': '两大道派',
      'learn.quanzhen.body': '全真派道士出家住观、素食、束发戴冠，北京白云观是全真派的祖庭之一。\n正一派道士多可以居家，以斋醮科仪为主，江西龙虎山是正一派的祖庭。',
      'hint.dawn': '清晨，云雾从山谷里升起来。',
      'hint.night': '夜里山风吹过松林。',
    },
    en: {
      'app.title': 'Mountain Daoist Temple',
      'app.label': 'Threshold · Daoism · Mountain Daoist Temple (unreviewed preview)',
      'intro.body': 'A small Daoist temple halfway up the mountain: a red-walled gate, a black-tiled hall, a great incense burner before it, pines, cypresses and bamboo all around. At dawn the mist rises from the valley while the priest sweeps the yard.',
      'intro.how': 'Sweeping the gate and steps earns vegetarian meals from the refectory, which feed the temple cats and dogs. The salute, incense, quiet sitting and reading are only noted in the practice book.',
      'intro.etiquette': 'Step over the threshold, never on it.',
      'res.name': 'meals',
      'chore.label': 'Sweep',
      'chore.pile': 'leaves and snow',
      'chore.got': 'Swept a flight of steps; the refectory sends {n} meals',
      'prac.salute.bar': 'Salute',
      'prac.salute.title': 'The Daoist salute',
      'prac.salute.body': 'Daoists greet with cupped hands: the left hand wraps the right in front of the chest, with a slight bow. You may greet a priest this way, saying “Wuliang tianzun” or “Cibei”.',
      'prac.salute.step.1': 'Salute at the gate',
      'prac.salute.step.2': 'Salute before the main hall',
      'prac.salute.btn': 'Salute',
      'prac.salute.done': 'Done; noted in the practice book',
      'prac.incense.bar': 'Incense',
      'prac.incense.title': 'Three sticks, tea, a lamp',
      'prac.incense.body': 'In Daoist temples one usually offers three sticks of incense: light them with the right hand, hold them in the left, raise them to the forehead and place them in the burner one by one. You may also offer a cup of tea or a lamp. It costs no meals and earns nothing.',
      'offer.xiang': 'three sticks of incense',
      'offer.cha': 'a cup of clear tea',
      'offer.deng': 'an oil lamp',
      'offer.why.xiang': 'Often explained as honouring the Dao, the scriptures and the teachers',
      'offer.why.cha': 'Clear tea for a clear heart',
      'offer.why.deng': 'Light for brightness',
      'prac.sit.bar': 'Sit',
      'prac.sit.title': 'Quiet sitting',
      'prac.sit.body': 'Sit cross-legged or upright, back relaxed and straight, tongue touching the palate, breath fine and long, attention resting in the lower belly (dantian). A chime marks start and end.',
      'prac.sit.during': 'Breath fine, even, deep and long.',
      'prac.sit.note': 'You can stop early; only a full sitting is noted.',
      'prac.read.bar': 'Read',
      'prac.read.title': 'Scripture reading',
      'prac.read.body': 'Original, pinyin and translation line by line.',
      'usage.ddj1': 'The opening of the Daodejing: the Way cannot be spoken',
      'usage.ddj8': 'Water as the image of not contending',
      'usage.qingjing': 'A short scripture chanted at morning and evening services',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Daoism',
      'prac.learn.body': 'A few short cards.',
      'learn.sanqing.title': 'The Three Pure Ones',
      'learn.sanqing.sub': 'The highest deities of Daoism',
      'learn.sanqing.body': 'The Three Pure Ones are Yuanshi Tianzun, Lingbao Tianzun and Daode Tianzun (Taishang Laojun). The main hall often enshrines them.\nIn the game the images are background only and cannot be tapped.',
      'learn.daily.title': 'A day in a Daoist temple',
      'learn.daily.sub': 'Services and work',
      'learn.daily.body': 'Priests chant the morning service at dawn; by day they sweep, grow vegetables and receive visitors; at dusk comes the evening service.\nMany temples also teach taiji and other health practices.',
      'learn.quanzhen.title': 'Quanzhen and Zhengyi',
      'learn.quanzhen.sub': 'Two main orders',
      'learn.quanzhen.body': 'Quanzhen priests are monastic, vegetarian and wear their hair in a topknot; the White Cloud Temple in Beijing is a central Quanzhen temple.\nZhengyi priests may live at home and specialise in ritual; Mount Longhu in Jiangxi is the Zhengyi centre.',
      'hint.dawn': 'Dawn: mist rises from the valley.',
      'hint.night': 'At night the mountain wind moves through the pines.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.46;
      K.mountains(ctx, w, hy - h * 0.04, '#7f9a94', h * 0.2, 31, m.season === 'winter');
      K.mountains(ctx, w, hy, '#5f7a70', h * 0.12, 37, false);
      if (m.hour < 9 && !m.reduceMotion) { ctx.fillStyle = 'rgba(240,244,240,.35)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse((i * 0.3 + t * 0.005) % 1.2 * w, hy - h * 0.02, w * 0.25, h * 0.025, 0, 0, Math.PI * 2); ctx.fill(); } }
      K.ground(ctx, w, h, hy, m.season === 'winter' ? '#dfe2dc' : '#8a9478', m.season === 'winter' ? '#cfd3cc' : '#7a846a');
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#b8b2a4' : '#aaa496'; ctx.fillRect(w * 0.3, h * (0.72 + i * 0.016), w * 0.4, h * 0.016); }
      /* 大殿：黑瓦、飞檐、红柱 */
      const cx = w * 0.5, base = h * 0.72, bw = w * 0.5;
      ctx.fillStyle = '#9a2a22'; for (let i = 0; i <= 4; i++) ctx.fillRect(cx - bw * 0.36 + i * bw * 0.18 - 3, base - h * 0.12, 6, h * 0.12);
      ctx.fillStyle = '#e8dcc4'; ctx.fillRect(cx - bw * 0.34, base - h * 0.11, bw * 0.68, h * 0.03);
      ctx.fillStyle = '#5a2a1e'; ctx.fillRect(cx - bw * 0.08, base - h * 0.08, bw * 0.16, h * 0.08);
      const ry = base - h * 0.12;
      ctx.fillStyle = '#2e3236';
      ctx.beginPath(); ctx.moveTo(cx - bw * 0.56, ry - h * 0.03); ctx.quadraticCurveTo(cx - bw * 0.42, ry, cx - bw * 0.3, ry - h * 0.005);
      ctx.lineTo(cx - bw * 0.2, ry - h * 0.1); ctx.lineTo(cx + bw * 0.2, ry - h * 0.1); ctx.lineTo(cx + bw * 0.3, ry - h * 0.005);
      ctx.quadraticCurveTo(cx + bw * 0.42, ry, cx + bw * 0.56, ry - h * 0.03); ctx.lineTo(cx + bw * 0.4, ry + 4); ctx.lineTo(cx - bw * 0.4, ry + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#3e4246'; ctx.fillRect(cx - bw * 0.21, ry - h * 0.108, bw * 0.42, h * 0.012);
      ctx.fillStyle = '#1e3a6a'; ctx.fillRect(cx - bw * 0.07, ry - h * 0.085, bw * 0.14, h * 0.03);
      ctx.fillStyle = '#e8c45a'; ctx.font = Math.round(h * 0.018) + 'px serif'; ctx.textAlign = 'center'; ctx.fillText(C_TEXT, cx, ry - h * 0.064);
      /* 香炉（鼎） */
      const dx = cx, dy = h * 0.8;
      ctx.fillStyle = '#6a5a3a'; K.rr(ctx, dx - w * 0.05, dy - h * 0.045, w * 0.1, h * 0.04, 6); ctx.fill();
      ctx.fillRect(dx - w * 0.045, dy - h * 0.005, 4, h * 0.012); ctx.fillRect(dx + w * 0.045 - 4, dy - h * 0.005, 4, h * 0.012);
      K.hit('spot', 'incense', dx, dy - h * 0.03, Math.max(26, w * 0.07));
      for (let i = 0; i < 4; i++) K.circle(ctx, dx + Math.sin(t * 0.7 + i) * 5, dy - h * 0.06 - i * 10 - (t * 6 % 10), 3 + i * 1.5, 'rgba(225,225,220,' + (0.35 - i * 0.07) + ')');
      K.tree(ctx, w * 0.1, h * 0.72, h * 0.2, 'pine', m, t);
      K.tree(ctx, w * 0.9, h * 0.7, h * 0.17, 'cypress', m, t);
      K.tree(ctx, w * 0.8, h * 0.74, h * 0.12, 'bamboo', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6 || m.hour > 18.4) K.glow(ctx, w * 0.5, h * 0.67, h * 0.06, 'rgba(255,200,120,.5)', t);
      if (m.offered.indexOf('deng') >= 0) K.flame(ctx, w * 0.44, h * 0.715, 4, t);
    },
  },
});
var C_TEXT = '三清殿';
