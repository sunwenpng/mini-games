/* 公共厨房（锡克教 · 谒师所）：玩法定义与场景。资源是做好的饭，只用来招待来客。 */
Courtyard.define({
  id: 'sikhism.gurdwara',
  saveKey: 'threshold-pa-save-v1',
  tz: 'Asia/Kolkata',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;600&display=swap',
  theme: { hud: 'rgba(20,34,74,.92)', bar: '#1a2a5a', btn: '#fdf3e2', btnInk: '#1a2a5a', accent: '#e07a1f', stage: '#141c34' },
  bell: 'chime',
  horizon: 0.46,
  seasons: mo => (mo >= 3 && mo <= 6 ? 'hot' : mo >= 7 && mo <= 9 ? 'monsoon' : 'cool'),
  resource: { icon: '🍛', start: 4 },
  chore: { icon: '🫓', gain: 2, every: 18, max: 6, pile: 'dishes', spots: [[0.06, 0.76, 0.4, 0.82]] },
  care: {
    mode: 'guests', icon: '🍽️', max: 4, every: 35, zone: [0.45, 0.84, 0.94, 0.93],
    who: {
      'zh-CN': ['一位赶路的卡车司机', '放学的学生', '附近工地的工人', '一位外国游客', '带着孩子的母亲', '一位老人', '印度教邻居一家', '一位穆斯林裁缝'],
      en: ['a truck driver on the road', 'students after school', 'workers from a nearby site', 'a foreign traveller', 'a mother with her child', 'an elderly man', 'a Hindu neighbour’s family', 'a Muslim tailor'],
    },
    looks: [{ body: '#6a7f9a', head: 'turban', headColor: '#1f4fa0' }, { body: '#9a6a5a', head: 'scarf', headColor: '#e07a1f' }, { body: '#5f8a6a', head: 'scarf', headColor: '#f2c94c' }, { body: '#8a7a5a', head: 'turban', headColor: '#e07a1f' }, { body: '#7a6a9a', head: 'scarf', headColor: '#c0392b' }, { body: '#a07a4a', head: 'scarf', headColor: '#2e8b57' }],
  },
  practices: [
    { id: 'enter', icon: '🧣', kind: 'steps', steps: 3, sound: 'chime' },
    { id: 'kirtan', icon: '🎶', kind: 'read', texts: ['mulMantar', 'fateh'] },
    { id: 'simran', icon: '📿', kind: 'count', targets: [27, 108], lang: 'pa' },
    { id: 'learn', icon: '📖', kind: 'learn', cards: ['langar', 'pangat', 'gurdwara', 'khalsa'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '公共厨房',
      'app.label': '启扉 · 锡克教 · 谒师所的公共厨房（未经审核的预览）',
      'intro.body': '一座谒师所（Gurdwara）：白色的圆顶，门前高高的橙色旗（Nishan Sahib）。旁边是公共厨房（Langar），志愿者揉面、烙饼、煮豆汤，任何人来都可以坐下吃一顿。',
      'intro.how': '在厨房帮忙（烙饼、洗碗）会做出饭来；饭只用来端给来客。包头、聆听、默念和阅读只记在功课簿里。',
      'intro.etiquette': '进入前请包住头发、脱鞋、洗手。',
      'res.name': '份饭',
      'chore.label': '帮厨',
      'chore.pile': '待洗的碗盘',
      'chore.got': '洗好碗盘、烙好饼，又备好 {n} 份饭',
      'guests.intro': '来客坐在地上的长垫子上（Pangat），不分身份并排吃饭。点一位来客，给他端上饭。',
      'prac.enter.bar': '进殿',
      'prac.enter.title': '进入大殿',
      'prac.enter.body': '进入供奉经典的大殿前要做好准备。殿内的经典《古鲁·格兰特·萨希卜》被视为在世的上师，游戏里只远远地出现，不可点击。',
      'prac.enter.step.1': '用头巾包住头发',
      'prac.enter.step.2': '脱鞋，洗手洗脚',
      'prac.enter.step.3': '进殿，在经典前跪下低头致敬，然后安静坐下',
      'prac.enter.btn': '继续',
      'prac.enter.done': '已进殿，已记入功课簿',
      'prac.kirtan.bar': '聆听',
      'prac.kirtan.title': '聆听与阅读',
      'prac.kirtan.body': '经文只在聆听和阅读的情境中出现，不用机器朗读。可以播放参考录音。',
      'usage.mulMantar': '经典的开篇，锡克人每天晨祷的第一段',
      'usage.fateh': '锡克人见面时的问候',
      'prac.simran.bar': '默念',
      'prac.simran.title': '默念（Simran）',
      'prac.simran.body': '反复默念“Waheguru”（奇妙的上师，即神），把心放在神上。',
      'prac.simran.mantra': 'ਵਾਹਿਗੁਰੂ',
      'prac.simran.mantraLatn': 'vāhigurū',
      'prac.simran.mantraTr': '瓦希古鲁（奇妙的上师）',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解锡克教',
      'prac.learn.body': '几张小卡片。',
      'learn.langar.title': '公共厨房（Langar）',
      'learn.langar.sub': '始于古鲁那纳克',
      'learn.langar.body': '公共厨房始于锡克教创始人古鲁那纳克（1469–1539）。任何人，不论宗教、种姓、性别和贫富，都可以来吃一顿素食。\n饭菜由志愿者做，食材来自捐献。阿姆利则金庙的公共厨房每天供应约十万份饭。',
      'learn.pangat.title': '同排用餐（Pangat）',
      'learn.pangat.sub': '先同排吃饭，再见古鲁',
      'learn.pangat.body': '第三代古鲁阿马尔·达斯规定，来见他的人都要先在公共厨房和大家坐成一排吃饭，国王也不例外。\n大家坐在地上，没有上座下座。这是对种姓等级的直接否定。',
      'learn.gurdwara.title': '谒师所（Gurdwara）',
      'learn.gurdwara.sub': '“通往古鲁的门”',
      'learn.gurdwara.body': '谒师所是锡克人聚会的地方，供奉经典，有唱颂（kirtan）、公共厨房，常常还提供住宿。\n锡克教没有僧侣阶层，任何受过训练的人都可以诵读经典。',
      'learn.khalsa.title': '卡尔萨与五个 K',
      'learn.khalsa.sub': '1699 年丰收节',
      'learn.khalsa.body': '1699 年丰收节，第十代古鲁戈宾德·辛格创立卡尔萨（Khalsa）。受洗的锡克人保持五样信物：不剪的头发（Kesh）、木梳（Kangha）、铁手镯（Kara）、短剑（Kirpan）和短衬裤（Kachera）。\n很多锡克男子缠头巾，是为了包住不剪的头发。',
      'hint.morning': '厨房里，志愿者在揉面、煮豆汤。',
    },
    en: {
      'app.title': 'Langar Hall',
      'app.label': 'Threshold · Sikhism · a gurdwara’s community kitchen (unreviewed preview)',
      'intro.body': 'A gurdwara: white domes and a tall saffron flag, the Nishan Sahib, at the gate. Beside it is the langar, where volunteers knead dough, cook rotis and stir dal, and anyone who comes can sit down to a meal.',
      'intro.how': 'Helping in the kitchen (cooking rotis, washing dishes) makes meals, and meals are only for serving guests. Covering your head, listening, simran and reading are only noted in the practice book.',
      'intro.etiquette': 'Cover your hair, take off your shoes and wash your hands before entering.',
      'res.name': 'meals',
      'chore.label': 'Seva',
      'chore.pile': 'dishes to wash',
      'chore.got': 'Dishes washed and rotis made: {n} more meals ready',
      'guests.intro': 'Guests sit on long mats on the floor (pangat), side by side whoever they are. Tap a guest to serve them.',
      'prac.enter.bar': 'Enter',
      'prac.enter.title': 'Entering the hall',
      'prac.enter.body': 'Prepare before entering the hall of the scripture. The Guru Granth Sahib is revered as the living Guru; in the game it appears only far away and cannot be tapped.',
      'prac.enter.step.1': 'Cover your hair with a scarf',
      'prac.enter.step.2': 'Take off your shoes; wash hands and feet',
      'prac.enter.step.3': 'Enter, kneel and bow before the Guru Granth Sahib, then sit quietly',
      'prac.enter.btn': 'Continue',
      'prac.enter.done': 'Entered; noted in the practice book',
      'prac.kirtan.bar': 'Listen',
      'prac.kirtan.title': 'Listening and reading',
      'prac.kirtan.body': 'Gurbani appears only for listening and reading and is never read by a machine voice. You can play the reference recording.',
      'usage.mulMantar': 'The opening of the scripture and of the daily morning prayer',
      'usage.fateh': 'The greeting Sikhs exchange when they meet',
      'prac.simran.bar': 'Simran',
      'prac.simran.title': 'Simran',
      'prac.simran.body': 'Repeat “Waheguru” (the Wondrous Guru, God) quietly, keeping the mind on God.',
      'prac.simran.mantra': 'ਵਾਹਿਗੁਰੂ',
      'prac.simran.mantraLatn': 'vāhigurū',
      'prac.simran.mantraTr': 'Waheguru, the Wondrous Guru',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Sikhism',
      'prac.learn.body': 'A few short cards.',
      'learn.langar.title': 'Langar',
      'learn.langar.sub': 'Begun by Guru Nanak',
      'learn.langar.body': 'The langar goes back to Guru Nanak (1469–1539), founder of Sikhism. Anyone, whatever their religion, caste, gender or means, may come for a vegetarian meal.\nVolunteers cook and the food is donated. The langar at the Golden Temple in Amritsar serves around a hundred thousand meals a day.',
      'learn.pangat.title': 'Pangat',
      'learn.pangat.sub': 'First the meal in a row, then the Guru',
      'learn.pangat.body': 'The third Guru, Amar Das, asked everyone who came to see him to first eat in the langar, sitting in a row with everyone else; even a king.\nAll sit on the floor with no higher or lower place: a direct rejection of caste hierarchy.',
      'learn.gurdwara.title': 'The gurdwara',
      'learn.gurdwara.sub': '“The door to the Guru”',
      'learn.gurdwara.body': 'A gurdwara houses the scripture and gathers the community for kirtan and langar, and often offers a place to stay.\nSikhism has no priestly class; anyone trained may read the scripture.',
      'learn.khalsa.title': 'The Khalsa and the five Ks',
      'learn.khalsa.sub': 'Vaisakhi 1699',
      'learn.khalsa.body': 'At Vaisakhi in 1699 the tenth Guru, Gobind Singh, founded the Khalsa. Initiated Sikhs keep five articles of faith: uncut hair (kesh), a wooden comb (kangha), a steel bracelet (kara), a short sword (kirpan) and cotton undershorts (kachera).\nMany Sikh men wear a turban to cover their uncut hair.',
      'hint.morning': 'In the kitchen, volunteers are kneading dough and cooking dal.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.46;
      ctx.fillStyle = '#c9b892'; for (let i = 0; i < 6; i++) ctx.fillRect(i * w * 0.18 - 4, hy - h * (0.04 + (i % 2) * 0.03), w * 0.15, h * 0.08);
      K.ground(ctx, w, h, hy, '#ddd4c2', '#cfc4ae');
      /* 谒师所主殿：白墙、金色与白色圆顶 */
      const cx = w * 0.6, base = h * 0.68;
      ctx.fillStyle = '#f6f3ec'; ctx.fillRect(cx - w * 0.22, base - h * 0.12, w * 0.44, h * 0.12);
      for (let i = -2; i <= 2; i++) { ctx.fillStyle = '#d9d2c2'; K.rr(ctx, cx + i * w * 0.08 - w * 0.022, base - h * 0.1, w * 0.044, h * 0.07, 10); ctx.fill(); }
      const dome = (x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x - r * 1.15, y - r * 1.2, x, y - r * 1.9); ctx.quadraticCurveTo(x + r * 1.15, y - r * 1.2, x + r, y); ctx.closePath(); ctx.fill(); };
      dome(cx, base - h * 0.12, w * 0.07, '#e7c45a');
      dome(cx - w * 0.18, base - h * 0.12, w * 0.03, '#f6f3ec');
      dome(cx + w * 0.18, base - h * 0.12, w * 0.03, '#f6f3ec');
      /* 橙色旗 Nishan Sahib */
      const fx = w * 0.26;
      ctx.fillStyle = '#c8b28a'; ctx.fillRect(fx - 2, base - h * 0.3, 4, h * 0.3);
      ctx.fillStyle = '#e07a1f'; ctx.fillRect(fx - 3, base - h * 0.3, 6, h * 0.26);
      const wv = m.reduceMotion ? 0 : Math.sin(t * 2.5) * 4;
      K.poly(ctx, [[fx + 3, base - h * 0.31], [fx + w * 0.12, base - h * 0.29 + wv], [fx + 3, base - h * 0.24]], '#f08a2a');
      /* 公共厨房：棚下的灶台与长垫 */
      ctx.fillStyle = '#b8805a'; ctx.fillRect(w * 0.02, h * 0.66, w * 0.38, h * 0.012);
      ctx.fillStyle = '#e9e1cf'; ctx.fillRect(w * 0.04, h * 0.672, w * 0.34, h * 0.06);
      K.circle(ctx, w * 0.12, h * 0.71, w * 0.035, '#3a3a3a'); K.circle(ctx, w * 0.28, h * 0.71, w * 0.035, '#3a3a3a');
      for (let i = 0; i < 3; i++) K.circle(ctx, w * 0.12 + Math.sin(t + i) * 3, h * 0.67 - i * 9 - (t * 8 % 9), 4 + i, 'rgba(240,240,240,' + (0.35 - i * 0.1) + ')');
      ctx.fillStyle = '#b8483a'; ctx.fillRect(w * 0.44, h * 0.88, w * 0.52, h * 0.018);
      ctx.fillStyle = '#2f6a8a'; ctx.fillRect(w * 0.44, h * 0.93, w * 0.52, h * 0.018);
      K.hit('spot', 'enter', cx, base - h * 0.05, Math.max(30, w * 0.1));
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour > 18.2 || m.hour < 6) { K.glow(ctx, w * 0.6, h * 0.6, h * 0.08, 'rgba(255,220,140,.45)', t); K.glow(ctx, w * 0.2, h * 0.7, h * 0.05, 'rgba(255,200,120,.45)', t); }
    },
  },
});
