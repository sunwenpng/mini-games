/* 社区教会（新教）：玩法定义与场景。资源是食物包，只用来分给来食物站的人。 */
Courtyard.define({
  id: 'christianity.protestant',
  saveKey: 'threshold-prot-save-v1',
  tz: 'America/New_York',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  theme: { hud: 'rgba(30,40,46,.92)', bar: '#25323a', btn: '#f4f6f4', btnInk: '#25323a', accent: '#2f6a5a', stage: '#1a2328' },
  bell: 'church',
  horizon: 0.5,
  resource: { icon: '📦', start: 3 },
  chore: { icon: '🥫', gain: 2, every: 18, max: 6, pile: 'boxes', spots: [[0.06, 0.78, 0.4, 0.86]] },
  care: {
    mode: 'guests', icon: '🤝', max: 4, every: 35, zone: [0.5, 0.84, 0.94, 0.93],
    who: {
      'zh-CN': ['一位刚失业的父亲', '带着两个孩子的母亲', '一位独居的老人', '一位大学生', '一位夜班护士', '一位刚搬来的移民', '一位退伍军人', '一位邻居'],
      en: ['a father who just lost his job', 'a mother with two kids', 'an elderly man who lives alone', 'a college student', 'a night-shift nurse', 'a newly arrived immigrant', 'a veteran', 'a neighbour'],
    },
  },
  practices: [
    { id: 'worship', icon: '⛪', kind: 'steps', steps: 5, sound: 'church' },
    { id: 'read', icon: '📖', kind: 'read' },
    { id: 'pray', icon: '🙏', kind: 'timer', minutes: [2, 5, 10] },
    { id: 'learn', icon: '📚', kind: 'learn', cards: ['reformation', 'scripture', 'denominations', 'hymns'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '社区教会',
      'app.label': '启扉 · 新教 · 小镇社区教会（未经审核的预览）',
      'intro.body': '小镇上一座白色木板教堂：尖尖的钟塔、红色的门、门前的白栅栏和枫树。教堂地下室每周开一次食物站，邻居们送来罐头和面包，再分给需要的人。',
      'intro.how': '整理捐来的食物会做成食物包；食物包只用来分给来食物站的人。礼拜、读经、祷告和阅读只记在功课簿里。',
      'res.name': '个食物包',
      'chore.label': '整理',
      'chore.pile': '捐来的食物箱',
      'chore.got': '整理好一批捐赠，做出 {n} 个食物包',
      'guests.intro': '来食物站的人。不问身份，也不要求参加礼拜。点一位，把食物包递给他。',
      'guests.serve': '递上食物包',
      'guests.served': '{who}拿到了食物包，道了声谢',
      'prac.worship.bar': '主日礼拜',
      'prac.worship.title': '主日礼拜',
      'prac.worship.body': '一场常见的主日礼拜大致是这样的。各宗派和教会差别很大。',
      'prac.worship.step.1': '会众入座，唱一首开场圣诗',
      'prac.worship.step.2': '一起祷告，念主祷文',
      'prac.worship.step.3': '读一段圣经',
      'prac.worship.step.4': '牧师讲道',
      'prac.worship.step.5': '唱诗，奉献，祝福散会',
      'prac.worship.btn': '继续',
      'prac.worship.done': '礼拜结束，已记入功课簿',
      'prac.read.bar': '读经',
      'prac.read.title': '读经与圣诗',
      'prac.read.body': '英王钦定本原文与中文和合本对照；圣诗附中文译文。',
      'usage.lordsPrayer': '耶稣教导门徒的祷告，礼拜中常一起念',
      'usage.psalm23': '最为人熟知的一篇诗篇',
      'usage.amazingGrace': '约翰·牛顿写的圣诗，他曾是贩奴船的船长',
      'prac.pray.bar': '静祷',
      'prac.pray.title': '安静祷告',
      'prac.pray.body': '新教重视个人与神直接的祷告。找一个安静的时刻，用自己的话祷告，或者安静地坐着。',
      'prac.pray.during': '用自己的话，或者只是安静。',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解新教',
      'prac.learn.body': '几张小卡片。',
      'learn.reformation.title': '宗教改革',
      'learn.reformation.sub': '1517 年，维滕贝格',
      'learn.reformation.body': '1517 年 10 月 31 日，马丁·路德公布《九十五条论纲》，批评赎罪券的买卖，拉开了宗教改革的序幕。\n此后出现了路德宗、改革宗、圣公会等许多新的教会。',
      'learn.scripture.title': '唯独圣经',
      'learn.scripture.sub': '把圣经交到每个人手里',
      'learn.scripture.body': '宗教改革强调“唯独圣经、唯独恩典、唯独信心”。改革者把圣经译成各地的语言，让普通人也能自己读。\n这里用的英王钦定本（1611）和中文和合本（1919）都是影响很大的译本。',
      'learn.denominations.title': '宗派',
      'learn.denominations.sub': '许多教会，一个传统',
      'learn.denominations.body': '新教没有统一的教会机构，分成许多宗派：路德宗、圣公会、长老会、浸信会、卫理公会、五旬节派等等。\n它们在洗礼、圣餐、教会治理上看法不同。',
      'learn.hymns.title': '会众唱诗',
      'learn.hymns.sub': '大家一起唱',
      'learn.hymns.body': '会众一起唱圣诗是新教礼拜的特色之一。路德本人就写了很多圣诗。\n《奇异恩典》是英语世界最有名的圣诗之一。',
      'hint.morning': '早上，有人在教堂门口摆放食物站的桌子。',
    },
    en: {
      'app.title': 'Community Church',
      'app.label': 'Threshold · Protestant Christianity · Community Church (unreviewed preview)',
      'intro.body': 'A white clapboard church in a small town: a pointed steeple, a red door, a picket fence and maples out front. Once a week the basement becomes a food pantry: neighbours bring cans and bread to share with whoever needs them.',
      'intro.how': 'Sorting donations makes food boxes, which are only for the people who come to the pantry. Worship, Bible reading, prayer and reading are only noted in the practice book.',
      'res.name': 'food boxes',
      'chore.label': 'Sort',
      'chore.pile': 'boxes of donations',
      'chore.got': 'A batch of donations sorted: {n} food boxes ready',
      'guests.intro': 'People who come to the pantry. No questions asked and no one has to attend worship. Tap someone to hand over a box.',
      'guests.serve': 'Hand over a box',
      'guests.served': '{who} takes a food box and says thanks',
      'prac.worship.bar': 'Worship',
      'prac.worship.title': 'Sunday worship',
      'prac.worship.body': 'A common shape for a Sunday service. Denominations and congregations differ widely.',
      'prac.worship.step.1': 'People gather and sing an opening hymn',
      'prac.worship.step.2': 'Prayer together, including the Lord’s Prayer',
      'prac.worship.step.3': 'A reading from the Bible',
      'prac.worship.step.4': 'The sermon',
      'prac.worship.step.5': 'A hymn, the offering, and the blessing',
      'prac.worship.btn': 'Continue',
      'prac.worship.done': 'Service over; noted in the practice book',
      'prac.read.bar': 'Bible',
      'prac.read.title': 'Scripture and hymns',
      'prac.read.body': 'King James text with the Chinese Union Version; the hymn has a new Chinese translation.',
      'usage.lordsPrayer': 'The prayer Jesus taught, often said together in worship',
      'usage.psalm23': 'The best-known psalm',
      'usage.amazingGrace': 'By John Newton, once captain of a slave ship',
      'prac.pray.bar': 'Pray',
      'prac.pray.title': 'Quiet prayer',
      'prac.pray.body': 'Protestants stress direct personal prayer to God. Take a quiet moment and pray in your own words, or simply sit in silence.',
      'prac.pray.during': 'In your own words, or simply in silence.',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Protestantism',
      'prac.learn.body': 'A few short cards.',
      'learn.reformation.title': 'The Reformation',
      'learn.reformation.sub': 'Wittenberg, 1517',
      'learn.reformation.body': 'On 31 October 1517 Martin Luther published his Ninety-five Theses against the sale of indulgences, beginning the Reformation.\nLutheran, Reformed, Anglican and many other churches followed.',
      'learn.scripture.title': 'Scripture alone',
      'learn.scripture.sub': 'A Bible in everyone’s hands',
      'learn.scripture.body': 'The Reformers stressed Scripture alone, grace alone and faith alone, and translated the Bible into local languages so ordinary people could read it.\nThe King James Version (1611) and the Chinese Union Version (1919) used here were both hugely influential.',
      'learn.denominations.title': 'Denominations',
      'learn.denominations.sub': 'Many churches, one tradition',
      'learn.denominations.body': 'Protestantism has no single church structure. It includes Lutherans, Anglicans, Presbyterians, Baptists, Methodists, Pentecostals and more,\nwho differ on baptism, communion and church government.',
      'learn.hymns.title': 'Congregational singing',
      'learn.hymns.sub': 'Everyone sings',
      'learn.hymns.body': 'Singing hymns together is a hallmark of Protestant worship; Luther himself wrote many.\nAmazing Grace is among the best-known hymns in English.',
      'hint.morning': 'Morning: someone is setting up the pantry tables by the door.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.5;
      K.hills(ctx, w, hy, '#86a06e', h * 0.05, 61);
      K.ground(ctx, w, h, hy, m.season === 'winter' ? '#eef0ee' : '#8fae66', m.season === 'winter' ? '#dfe3df' : '#7c9a58');
      const cx = w * 0.55, base = h * 0.76, bw = w * 0.34;
      ctx.fillStyle = '#f7f7f4'; ctx.fillRect(cx - bw / 2, base - h * 0.15, bw, h * 0.15);
      ctx.strokeStyle = 'rgba(0,0,0,.08)'; for (let y = base - h * 0.15; y < base; y += 5) { ctx.beginPath(); ctx.moveTo(cx - bw / 2, y); ctx.lineTo(cx + bw / 2, y); ctx.stroke(); }
      K.poly(ctx, [[cx - bw / 2 - 6, base - h * 0.15], [cx, base - h * 0.25], [cx + bw / 2 + 6, base - h * 0.15]], '#4a5a62');
      ctx.fillStyle = '#f7f7f4'; ctx.fillRect(cx - w * 0.04, base - h * 0.36, w * 0.08, h * 0.13);
      K.poly(ctx, [[cx - w * 0.05, base - h * 0.36], [cx, base - h * 0.47], [cx + w * 0.05, base - h * 0.36]], '#4a5a62');
      ctx.fillStyle = '#7a7a72'; ctx.fillRect(cx - 1.5, base - h * 0.52, 3, h * 0.05); ctx.fillRect(cx - w * 0.012, base - h * 0.505, w * 0.024, 3);
      ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.moveTo(cx - w * 0.02, base - h * 0.28); ctx.lineTo(cx - w * 0.02, base - h * 0.31); ctx.arc(cx, base - h * 0.31, w * 0.02, Math.PI, 0); ctx.lineTo(cx + w * 0.02, base - h * 0.28); ctx.fill();
      ctx.fillStyle = '#a8302a'; ctx.fillRect(cx - w * 0.035, base - h * 0.08, w * 0.07, h * 0.08);
      for (let i = -1; i <= 1; i += 2) { ctx.fillStyle = m.night ? '#f2d27a' : '#7a9ab0'; ctx.beginPath(); ctx.moveTo(cx + i * bw * 0.3 - 7, base - h * 0.04); ctx.lineTo(cx + i * bw * 0.3 - 7, base - h * 0.1); ctx.arc(cx + i * bw * 0.3, base - h * 0.1, 7, Math.PI, 0); ctx.lineTo(cx + i * bw * 0.3 + 7, base - h * 0.04); ctx.fill(); }
      K.hit('spot', 'worship', cx, base - h * 0.05, Math.max(28, w * 0.07));
      /* 白栅栏与食物站的桌子 */
      ctx.fillStyle = '#f2f2ee'; for (let x = 0; x < w; x += 12) ctx.fillRect(x, h * 0.79, 6, h * 0.025);
      ctx.fillRect(0, h * 0.798, w, 3);
      ctx.fillStyle = '#c8a878'; ctx.fillRect(w * 0.04, h * 0.76, w * 0.34, h * 0.012);
      ctx.fillStyle = '#6a5a4a'; ctx.fillRect(w * 0.06, h * 0.772, 3, h * 0.03); ctx.fillRect(w * 0.36, h * 0.772, 3, h * 0.03);
      K.tree(ctx, w * 0.12, h * 0.72, h * 0.18, 'maple', m, t);
      K.tree(ctx, w * 0.93, h * 0.74, h * 0.16, 'maple', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6.5 || m.hour > 18.4) K.glow(ctx, w * 0.55, h * 0.68, h * 0.05, 'rgba(255,210,150,.5)', t);
    },
  },
});
