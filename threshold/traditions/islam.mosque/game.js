/* 清真寺庭院（伊斯兰教 · 只做知识与文化）：玩法定义与场景。不模拟礼拜。 */
Courtyard.define({
  id: 'islam.mosque',
  saveKey: 'threshold-isl-save-v1',
  tz: 'Europe/Istanbul',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@500;700&display=swap',
  theme: { hud: 'rgba(16,48,52,.92)', bar: '#123438', btn: '#eef6f2', btnInk: '#123438', accent: '#1f7a6a', stage: '#10262a' },
  bell: 'chime',
  horizon: 0.5,
  resource: { icon: '🫓', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'bird'], max: 5, every: 90, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['米斯卡', '泽伊特', '帕穆克', '卡拉', '蒂尔琪', '敦卡', '叙特', '菲斯蒂克'], en: ['Misket', 'Zeytin', 'Pamuk', 'Kara', 'Tırçık', 'Duman', 'Süt', 'Fıstık'] },
    families: { 'zh-CN': ['街角面包房的一家', '退休的书法老师', '开杂货店的邻居', '大学生室友'], en: ['the corner bakery family', 'a retired calligraphy teacher', 'the neighbour who runs the grocery', 'two university roommates'] },
  },
  shop: ['food.cat', 'food.bird', 'med', 'tool'],
  practices: [
    { id: 'visit', icon: '🕌', kind: 'steps', steps: 3, sound: 'chime' },
    { id: 'adhan', icon: '🔊', kind: 'steps', steps: 1, audio: 'ref.ar' },
    { id: 'read', icon: '📖', kind: 'read' },
    { id: 'learn', icon: '📚', kind: 'learn', cards: ['pillars', 'salah', 'wudu', 'ramadan', 'calligraphy', 'cats'] },
    { id: 'sadaqa', icon: '🤲', kind: 'offer', items: ['dates', 'bread', 'water'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '清真寺庭院',
      'app.label': '启扉 · 伊斯兰教（只做知识与文化）· 清真寺庭院（未经审核的预览）',
      'intro.body': '伊斯坦布尔老街区里的一座小清真寺：灰色的圆顶，两座细长的宣礼塔，庭院中央是供人净身的八角水亭，一棵老梧桐树下总有几只猫。一天五次，宣礼声从塔上传来。',
      'intro.how': '打扫庭院能从街坊那里分到面饼，用来照顾猫和受伤的鸽子。参观、聆听、阅读和分享只记在功课簿里。这一版不模拟礼拜。',
      'intro.etiquette': '访客进入礼拜殿要脱鞋、衣着遮住肩膀和膝盖，女性戴头巾；不要从正在礼拜的人面前走过。',
      'res.name': '面饼',
      'chore.label': '打扫',
      'chore.pile': '落叶和积雪',
      'chore.got': '庭院扫干净一角，街坊送来 {n} 张面饼',
      'prac.visit.bar': '参观',
      'prac.visit.title': '作为访客参观',
      'prac.visit.body': '大多数清真寺欢迎非礼拜时间的访客。这里只走访客的流程，不模拟礼拜。',
      'prac.visit.step.1': '整理衣着：遮住肩膀和膝盖，女性戴上头巾',
      'prac.visit.step.2': '在门口脱鞋，放进鞋架',
      'prac.visit.step.3': '安静地站在后面看一看，不打扰礼拜的人',
      'prac.visit.btn': '继续',
      'prac.visit.done': '参观完毕，已记入功课簿',
      'prac.adhan.bar': '宣礼',
      'prac.adhan.title': '聆听宣礼',
      'prac.adhan.body': '宣礼（Adhan）是召唤礼拜的呼声，每天五次从宣礼塔上传出。这里可以播放一段宣礼录音（CC0），并在“阅读”里看到宣礼词的意思。',
      'prac.adhan.step.1': '安静下来，聆听宣礼',
      'prac.adhan.btn': '聆听',
      'prac.adhan.done': '已记入功课簿',
      'prac.read.bar': '阅读',
      'prac.read.title': '阅读',
      'prac.read.body': '阿拉伯原文、转写和译文对照。经文不用机器朗读；宣礼词可以播放录音。',
      'usage.fatiha': '《古兰经》第一章，穆斯林每次礼拜都会念',
      'usage.adhan': '召唤礼拜的呼声',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解伊斯兰教',
      'prac.learn.body': '几张小卡片。',
      'learn.pillars.title': '五功',
      'learn.pillars.sub': '伊斯兰教的五项基本功修',
      'learn.pillars.body': '念（作证言）、礼（每日五次礼拜）、斋（斋月白天封斋）、课（天课，按比例施舍财产）、朝（有能力者一生朝觐麦加一次）。',
      'learn.salah.title': '礼拜（Salah）',
      'learn.salah.sub': '只作说明，不模拟',
      'learn.salah.body': '穆斯林每天在黎明、正午、下午、日落和夜间礼拜五次，面向麦加的天房。\n一次礼拜由站立、诵读、鞠躬、叩头、跪坐等动作组成，称为“拜”。游戏不模拟礼拜。',
      'learn.wudu.title': '小净（Wudu）',
      'learn.wudu.sub': '礼拜前的净身',
      'learn.wudu.body': '礼拜前要洗净双手、漱口、呛鼻、洗脸、洗手臂到肘、抹头、洗脚到踝。\n庭院中间的八角水亭就是做小净的地方。',
      'learn.ramadan.title': '斋月与开斋',
      'learn.ramadan.sub': '黎明到日落',
      'learn.ramadan.body': '斋月里，成年健康的穆斯林从黎明到日落不吃不喝。日落时一般先吃几颗椰枣、喝水开斋（iftar）。\n很多清真寺在斋月里设免费的开斋饭，欢迎所有人。斋月结束后是开斋节。',
      'learn.calligraphy.title': '书法与装饰',
      'learn.calligraphy.sub': '为什么清真寺里没有人像',
      'learn.calligraphy.body': '伊斯兰传统避免在宗教场所描绘人物，清真寺多用阿拉伯书法、几何图案和植物纹样来装饰。\n奥斯曼时期的伊斯坦布尔是书法艺术的重镇。',
      'learn.cats.title': '清真寺的猫',
      'learn.cats.sub': '伊斯坦布尔的街猫',
      'learn.cats.body': '伊斯坦布尔的清真寺常有猫出入，街坊会给它们留食物和水。\n圣门弟子艾布·胡莱赖的名字意思是“小猫的父亲”，传说他总带着一只猫。',
      'prac.sadaqa.bar': '分享',
      'prac.sadaqa.title': '分享（Sadaqa）',
      'prac.sadaqa.body': '自愿的施舍称为 sadaqa（施济），可以是钱，也可以是食物、一杯水，甚至一个微笑。不用面饼，也不换取任何东西。',
      'offer.dates': '给邻居送一盘椰枣',
      'offer.bread': '给路过的人一块面包',
      'offer.water': '在门口放一壶清水',
      'care.intro': '庭院里的猫和受伤的鸽子。鸽子伤好吃饱后会自己飞走。',
      'hint.dawn': '黎明，宣礼塔上传来晨礼的宣礼声。',
      'hint.evening': '日落时分，宣礼声在屋顶之间回响。',
    },
    en: {
      'app.title': 'Mosque Courtyard',
      'app.label': 'Threshold · Islam (knowledge and culture only) · Mosque Courtyard (unreviewed preview)',
      'intro.body': 'A small mosque in an old Istanbul neighbourhood: a grey dome, two slender minarets, an octagonal ablution fountain in the courtyard, and always a few cats beneath the old plane tree. Five times a day the call to prayer sounds from the minaret.',
      'intro.how': 'Sweeping the courtyard earns flatbread from the neighbours, which feeds the cats and injured pigeons. Visiting, listening, reading and sharing are only noted in the practice book. Prayer is never simulated.',
      'intro.etiquette': 'Visitors to the prayer hall take off their shoes and cover shoulders and knees; women cover their hair. Never walk in front of someone praying.',
      'res.name': 'flatbread',
      'chore.label': 'Sweep',
      'chore.pile': 'leaves and snow',
      'chore.got': 'A corner of the courtyard swept; neighbours bring {n} flatbread',
      'prac.visit.bar': 'Visit',
      'prac.visit.title': 'Visiting as a guest',
      'prac.visit.body': 'Most mosques welcome visitors outside prayer times. This only follows a visitor’s steps; prayer is never simulated.',
      'prac.visit.step.1': 'Dress: cover shoulders and knees; women cover their hair',
      'prac.visit.step.2': 'Take off your shoes at the door and leave them on the rack',
      'prac.visit.step.3': 'Stand quietly at the back and look, without disturbing anyone at prayer',
      'prac.visit.btn': 'Continue',
      'prac.visit.done': 'Visit done; noted in the practice book',
      'prac.adhan.bar': 'Adhan',
      'prac.adhan.title': 'Listening to the adhan',
      'prac.adhan.body': 'The adhan is the call to prayer, sounded five times a day from the minaret. You can play a recording (CC0) here and read its meaning under “Read”.',
      'prac.adhan.step.1': 'Be still and listen',
      'prac.adhan.btn': 'Listen',
      'prac.adhan.done': 'Noted in the practice book',
      'prac.read.bar': 'Read',
      'prac.read.title': 'Reading',
      'prac.read.body': 'Arabic, transliteration and translation. The Qur’an is never read by a machine voice; the adhan has a recording.',
      'usage.fatiha': 'The first chapter of the Qur’an, recited in every prayer',
      'usage.adhan': 'The call to prayer',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Islam',
      'prac.learn.body': 'A few short cards.',
      'learn.pillars.title': 'The five pillars',
      'learn.pillars.sub': 'The basic practices of Islam',
      'learn.pillars.body': 'Shahada (the declaration of faith), salah (five daily prayers), sawm (fasting in Ramadan), zakat (giving a share of one’s wealth) and hajj (pilgrimage to Mecca once in a lifetime for those able).',
      'learn.salah.title': 'Salah',
      'learn.salah.sub': 'Described, never simulated',
      'learn.salah.body': 'Muslims pray five times a day, at dawn, midday, afternoon, sunset and night, facing the Kaaba in Mecca.\nEach prayer is made of units (rak‘a) of standing, recitation, bowing, prostration and sitting. The game never simulates prayer.',
      'learn.wudu.title': 'Wudu',
      'learn.wudu.sub': 'Washing before prayer',
      'learn.wudu.body': 'Before prayer one washes the hands, rinses mouth and nose, washes the face and arms to the elbows, wipes the head and washes the feet to the ankles.\nThe octagonal fountain in the courtyard is where wudu is done.',
      'learn.ramadan.title': 'Ramadan and iftar',
      'learn.ramadan.sub': 'Dawn to sunset',
      'learn.ramadan.body': 'In Ramadan, healthy adult Muslims neither eat nor drink from dawn to sunset. At sunset the fast is usually broken with dates and water (iftar).\nMany mosques offer free iftar meals open to all. Ramadan ends with Eid al-Fitr.',
      'learn.calligraphy.title': 'Calligraphy and ornament',
      'learn.calligraphy.sub': 'Why there are no figures in a mosque',
      'learn.calligraphy.body': 'Islamic tradition avoids depicting people in religious spaces; mosques are adorned with Arabic calligraphy, geometric patterns and plant motifs.\nOttoman Istanbul was a great centre of calligraphy.',
      'learn.cats.title': 'Mosque cats',
      'learn.cats.sub': 'The street cats of Istanbul',
      'learn.cats.body': 'Cats come and go in Istanbul’s mosques, and neighbours leave food and water for them.\nThe Companion Abu Hurayra’s name means “father of the kitten”; he is said to have kept a cat with him.',
      'prac.sadaqa.bar': 'Share',
      'prac.sadaqa.title': 'Sadaqa',
      'prac.sadaqa.body': 'Voluntary giving is called sadaqa: money, food, a cup of water, even a smile. It costs no flatbread and earns nothing.',
      'offer.dates': 'take a plate of dates to the neighbours',
      'offer.bread': 'give bread to a passer-by',
      'offer.water': 'leave a jug of water by the door',
      'care.intro': 'The courtyard cats and injured pigeons; pigeons fly off once healed and fed.',
      'hint.dawn': 'Dawn: the call to the dawn prayer sounds from the minaret.',
      'hint.evening': 'Sunset: the call to prayer echoes across the rooftops.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.5;
      ctx.fillStyle = '#b8a890'; for (let i = 0; i < 8; i++) ctx.fillRect(i * w * 0.13 - 4, hy - h * (0.03 + (i % 3) * 0.02), w * 0.11, h * 0.08);
      K.ground(ctx, w, h, hy, m.season === 'winter' ? '#e6e4e0' : '#d8cdb8', m.season === 'winter' ? '#d4d2ce' : '#c8bca4');
      const cx = w * 0.5, base = h * 0.7;
      /* 主体与圆顶 */
      ctx.fillStyle = '#e6dfd0'; ctx.fillRect(cx - w * 0.25, base - h * 0.1, w * 0.5, h * 0.1);
      ctx.fillStyle = '#9aa2a8';
      ctx.beginPath(); ctx.ellipse(cx, base - h * 0.1, w * 0.17, h * 0.1, 0, Math.PI, 0); ctx.fill();
      [-1, 1].forEach(s => { ctx.beginPath(); ctx.ellipse(cx + s * w * 0.17, base - h * 0.1, w * 0.07, h * 0.045, 0, Math.PI, 0); ctx.fill(); });
      ctx.fillStyle = '#c8a440'; ctx.fillRect(cx - 1.5, base - h * 0.23, 3, h * 0.03);
      ctx.beginPath(); ctx.arc(cx, base - h * 0.235, 5, 0.6, Math.PI * 2 - 0.6); ctx.strokeStyle = '#c8a440'; ctx.lineWidth = 2; ctx.stroke();
      for (let i = -3; i <= 3; i++) { ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); const x = cx + i * w * 0.06; ctx.moveTo(x - 5, base - h * 0.02); ctx.lineTo(x - 5, base - h * 0.06); ctx.arc(x, base - h * 0.06, 5, Math.PI, 0); ctx.lineTo(x + 5, base - h * 0.02); ctx.fill(); }
      /* 两座宣礼塔 */
      [cx - w * 0.33, cx + w * 0.33].forEach(x => {
        ctx.fillStyle = '#ece6da'; ctx.fillRect(x - w * 0.016, base - h * 0.34, w * 0.032, h * 0.34);
        ctx.fillStyle = '#d8d0c0'; ctx.fillRect(x - w * 0.026, base - h * 0.25, w * 0.052, h * 0.01);
        K.poly(ctx, [[x - w * 0.018, base - h * 0.34], [x, base - h * 0.42], [x + w * 0.018, base - h * 0.34]], '#9aa2a8');
        ctx.fillStyle = '#c8a440'; ctx.fillRect(x - 1, base - h * 0.45, 2, h * 0.03);
      });
      K.hit('spot', 'adhan', cx + w * 0.33, base - h * 0.3, Math.max(24, w * 0.05));
      /* 净身水亭 */
      const fx = w * 0.5, fy = h * 0.8;
      ctx.fillStyle = '#d8d0c0'; ctx.fillRect(fx - w * 0.06, fy - h * 0.035, w * 0.12, h * 0.035);
      ctx.fillStyle = '#6a8aa0'; ctx.fillRect(fx - w * 0.05, fy - h * 0.03, w * 0.1, h * 0.006);
      ctx.fillStyle = '#8a6a4a'; ctx.fillRect(fx - w * 0.06, fy - h * 0.09, 3, h * 0.055); ctx.fillRect(fx + w * 0.06 - 3, fy - h * 0.09, 3, h * 0.055);
      ctx.fillStyle = '#9aa2a8'; ctx.beginPath(); ctx.ellipse(fx, fy - h * 0.09, w * 0.075, h * 0.03, 0, Math.PI, 0); ctx.fill();
      K.hit('spot', 'visit', cx, base - h * 0.04, Math.max(28, w * 0.07));
      K.tree(ctx, w * 0.1, h * 0.76, h * 0.2, 'round', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6 || m.hour > 18) { [0.17, 0.83].forEach(x => K.glow(ctx, w * x, h * 0.45, h * 0.03, 'rgba(255,230,170,.7)', t)); K.glow(ctx, w * 0.5, h * 0.66, h * 0.05, 'rgba(255,220,150,.4)', t); }
    },
  },
});
