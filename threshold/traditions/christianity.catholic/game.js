/* 堂区小教堂（天主教）：玩法定义与场景。 */
Courtyard.define({
  id: 'christianity.catholic',
  saveKey: 'threshold-cath-save-v1',
  tz: 'Europe/Rome',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  theme: { hud: 'rgba(40,30,24,.92)', bar: '#33261e', btn: '#f6efe2', btnInk: '#33261e', accent: '#7a2a3a', stage: '#221a16' },
  bell: 'church',
  horizon: 0.5,
  resource: { icon: '🥖', start: 12 },
  chore: { icon: '🌿', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'dog', 'bird'], max: 4, every: 110, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['方济', '露琪亚', '皮诺', '贝拉', '托托', '米莉', '朱利奥', '安娜'], en: ['Francesco', 'Lucia', 'Pino', 'Bella', 'Totò', 'Milly', 'Giulio', 'Anna'] },
    families: { 'zh-CN': ['村口面包房的一家', '退休的小学老师', '种橄榄的农户', '神父的邻居'], en: ['the baker’s family at the village gate', 'a retired schoolteacher', 'an olive-growing family', 'the priest’s neighbours'] },
  },
  shop: ['food.cat', 'food.dog', 'food.bird', 'med', 'tool'],
  practices: [
    { id: 'enter', icon: '✝️', kind: 'steps', steps: 2, sound: 'church' },
    { id: 'candle', icon: '🕯️', kind: 'offer', items: ['votive', 'flowers'], sound: 'church' },
    { id: 'rosary', icon: '📿', kind: 'count', targets: [10, 50], lang: 'la' },
    { id: 'read', icon: '📖', kind: 'read' },
    { id: 'angelus', icon: '🔔', kind: 'steps', steps: 3, window: [12, 13], daily: true, sound: 'church', audio: 'ref.bells' },
    { id: 'learn', icon: '📚', kind: 'learn', cards: ['mass', 'rosary', 'francis'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '堂区小教堂',
      'app.label': '启扉 · 天主教 · 堂区小教堂（未经审核的预览）',
      'intro.body': '意大利乡间的一座石头小教堂：钟楼、圆花窗、拱门，门前一片花园和几棵橄榄树。中午钟楼会敲三钟经的钟声。教堂的猫在长椅下打盹，鸽子在钟楼上咕咕叫。',
      'intro.how': '打理花园、扫台阶能从堂区分到面包，用来照顾猫、狗和受伤的鸽子。画十字、点烛、念玫瑰经、祈祷只记在功课簿里。',
      'intro.etiquette': '进堂前把手机调成静音。',
      'res.name': '面包',
      'chore.label': '打理',
      'chore.pile': '落叶和积雪',
      'chore.got': '花园打理好一角，堂区分来 {n} 块面包',
      'prac.enter.bar': '进堂',
      'prac.enter.title': '进堂',
      'prac.enter.body': '进门时用指尖蘸一点圣水，画十字；走到长椅前，面向祭台单膝跪一下（或深深鞠躬），再坐下。',
      'prac.enter.step.1': '蘸圣水，画十字（额、胸、左肩、右肩）',
      'prac.enter.step.2': '面向祭台单膝下跪，然后入座',
      'prac.enter.btn': '继续',
      'prac.enter.done': '已进堂，已记入功课簿',
      'prac.candle.bar': '点烛',
      'prac.candle.title': '许愿烛与鲜花',
      'prac.candle.body': '在侧边的烛台上点一支小蜡烛，为某个人或某件事祈祷；或者在圣母像前放一束花（游戏里不画圣像）。不用面包，也不换取任何东西。',
      'offer.votive': '一支许愿烛',
      'offer.flowers': '一束野花',
      'offer.why.votive': '烛光代表持续的祈祷',
      'offer.why.flowers': '为圣母月（五月）常见的献花',
      'prac.rosary.bar': '玫瑰经',
      'prac.rosary.title': '玫瑰经',
      'prac.rosary.body': '玫瑰经分成五端，每端念一遍《天主经》、十遍《圣母经》、一遍《圣三光荣经》，同时默想耶稣和圣母生平的一个“奥迹”。',
      'prac.rosary.mantra': 'Ave Maria, gratia plena, Dominus tecum…',
      'prac.rosary.mantraTr': '万福玛利亚，满被圣宠者，主与你同在……',
      'prac.rosary.note': '选 10 是一端，选 50 是五端。每点一下拨一颗珠。',
      'prac.read.bar': '经文',
      'prac.read.title': '经文',
      'prac.read.body': '拉丁文原文和译文逐行对照。',
      'usage.paterNoster': '耶稣教导门徒的祈祷',
      'usage.aveMaria': '玫瑰经里反复念的经文',
      'usage.gloria': '赞美圣三的短颂，常在一段祈祷结束时念',
      'prac.angelus.bar': '三钟经',
      'prac.angelus.title': '三钟经（Angelus）',
      'prac.angelus.body': '早上 6 点、中午 12 点、傍晚 6 点，教堂敲钟，信众停下手里的事念三钟经，纪念天使报喜。这里在中午 12 点到 1 点之间，一天记一次。',
      'prac.angelus.step.1': '钟声响起，停下手里的事',
      'prac.angelus.step.2': '念三段短句，每段后念一遍《圣母经》',
      'prac.angelus.step.3': '以祷词结束，画十字',
      'prac.angelus.btn': '继续',
      'prac.angelus.done': '三钟经念完，已记入功课簿',
      'hint.window.angelus': '正午了，钟楼敲响了三钟经的钟声。',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解天主教',
      'prac.learn.body': '几张小卡片。',
      'learn.mass.title': '弥撒',
      'learn.mass.sub': '天主教最核心的礼仪',
      'learn.mass.body': '弥撒分为圣道礼仪（读经、讲道）和圣祭礼仪（祝圣饼酒、领圣体）。\n天主教徒相信祝圣后的饼酒成为基督的身体和血。游戏不模拟弥撒和任何圣事。',
      'learn.rosary.title': '玫瑰经的念珠',
      'learn.rosary.sub': '五十九颗珠和一个十字架',
      'learn.rosary.body': '一串玫瑰念珠通常由一个十字架和五十九颗珠子组成：五组十颗小珠，中间夹着大珠。\n念珠是帮助专心祈祷的工具，不是护身符。',
      'learn.francis.title': '亚西西的圣方济各',
      'learn.francis.sub': '动物的主保',
      'learn.francis.body': '圣方济各（约 1181–1226）放弃家产，过贫穷的生活，传说他向鸟儿讲道。\n在他的纪念日（10 月 4 日），不少堂区会为人们带来的宠物祝福。',
      'care.intro': '教堂花园里的猫狗和受伤的鸽子。鸽子伤好吃饱后会自己飞走。',
      'hint.dawn': '清晨，神父去开教堂的门。',
      'hint.evening': '傍晚的钟声在山谷里回响。',
    },
    en: {
      'app.title': 'Parish Church',
      'app.label': 'Threshold · Catholic Christianity · Parish Church (unreviewed preview)',
      'intro.body': 'A small stone church in the Italian countryside: a bell tower, a rose window, an arched door, a garden and a few olive trees in front. At noon the tower rings the Angelus. The church cat dozes under the pews and pigeons coo in the belfry.',
      'intro.how': 'Tending the garden and sweeping the steps earns bread from the parish, which feeds the cats, dogs and injured pigeons. The sign of the cross, candles, the rosary and prayers are only noted in the practice book.',
      'intro.etiquette': 'Silence your phone before going in.',
      'res.name': 'bread',
      'chore.label': 'Tend',
      'chore.pile': 'leaves and snow',
      'chore.got': 'A corner of the garden tidied; the parish gives {n} bread',
      'prac.enter.bar': 'Enter',
      'prac.enter.title': 'Entering church',
      'prac.enter.body': 'At the door, dip your fingertips in holy water and make the sign of the cross; at your pew, genuflect towards the altar (or bow deeply) before sitting.',
      'prac.enter.step.1': 'Holy water and the sign of the cross (forehead, chest, left shoulder, right shoulder)',
      'prac.enter.step.2': 'Genuflect towards the altar, then sit',
      'prac.enter.btn': 'Continue',
      'prac.enter.done': 'In church; noted in the practice book',
      'prac.candle.bar': 'Candle',
      'prac.candle.title': 'Votive candle and flowers',
      'prac.candle.body': 'Light a small candle at the side stand as a prayer for someone or something, or leave flowers at Mary’s altar (no image is drawn). It costs no bread and earns nothing.',
      'offer.votive': 'a votive candle',
      'offer.flowers': 'wild flowers',
      'offer.why.votive': 'The flame stands for a prayer that continues',
      'offer.why.flowers': 'Flowers are often brought in May, Mary’s month',
      'prac.rosary.bar': 'Rosary',
      'prac.rosary.title': 'The rosary',
      'prac.rosary.body': 'The rosary has five decades; each is one Our Father, ten Hail Marys and one Glory Be, while meditating on a “mystery” from the lives of Jesus and Mary.',
      'prac.rosary.mantra': 'Ave Maria, gratia plena, Dominus tecum…',
      'prac.rosary.mantraTr': 'Hail Mary, full of grace, the Lord is with thee…',
      'prac.rosary.note': '10 is one decade, 50 is five. Each tap moves one bead.',
      'prac.read.bar': 'Prayers',
      'prac.read.title': 'Prayers',
      'prac.read.body': 'Latin and translation line by line.',
      'usage.paterNoster': 'The prayer Jesus taught his disciples',
      'usage.aveMaria': 'The prayer repeated in the rosary',
      'usage.gloria': 'A short hymn to the Trinity that closes many prayers',
      'prac.angelus.bar': 'Angelus',
      'prac.angelus.title': 'The Angelus',
      'prac.angelus.body': 'At 6 a.m., noon and 6 p.m. the church bell rings and the faithful pause to pray the Angelus, recalling the Annunciation. Here between noon and 1 p.m., once a day.',
      'prac.angelus.step.1': 'The bell rings; stop what you are doing',
      'prac.angelus.step.2': 'Three short verses, each followed by a Hail Mary',
      'prac.angelus.step.3': 'A closing prayer and the sign of the cross',
      'prac.angelus.btn': 'Continue',
      'prac.angelus.done': 'Angelus prayed; noted in the practice book',
      'hint.window.angelus': 'Noon: the bell tower rings the Angelus.',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Catholicism',
      'prac.learn.body': 'A few short cards.',
      'learn.mass.title': 'The Mass',
      'learn.mass.sub': 'The heart of Catholic worship',
      'learn.mass.body': 'The Mass has the Liturgy of the Word (readings, homily) and the Liturgy of the Eucharist (consecration, communion).\nCatholics believe the consecrated bread and wine become the body and blood of Christ. The game never simulates the Mass or any sacrament.',
      'learn.rosary.title': 'Rosary beads',
      'learn.rosary.sub': 'Fifty-nine beads and a crucifix',
      'learn.rosary.body': 'A rosary usually has a crucifix and fifty-nine beads: five sets of ten small beads with larger beads between.\nThe beads help the mind stay with the prayer; they are not a charm.',
      'learn.francis.title': 'St Francis of Assisi',
      'learn.francis.sub': 'Patron of animals',
      'learn.francis.body': 'Francis (c. 1181–1226) gave up his family’s wealth to live in poverty; stories tell of him preaching to the birds.\nOn his feast day, 4 October, many parishes bless the pets people bring.',
      'care.intro': 'The cats and dogs of the church garden and injured pigeons; pigeons fly off once healed and fed.',
      'hint.dawn': 'Early morning: the priest unlocks the church.',
      'hint.evening': 'The evening bell echoes down the valley.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.5;
      K.hills(ctx, w, hy, '#8aa070', h * 0.08, 41);
      K.ground(ctx, w, h, hy, m.season === 'winter' ? '#dcdcd4' : '#9aab72', m.season === 'winter' ? '#cbcbc2' : '#869862');
      /* 教堂主体：石墙、山墙、圆花窗、拱门 */
      const cx = w * 0.42, base = h * 0.74, bw = w * 0.36;
      ctx.fillStyle = '#d8c8a8'; ctx.fillRect(cx - bw / 2, base - h * 0.16, bw, h * 0.16);
      K.poly(ctx, [[cx - bw / 2 - 4, base - h * 0.16], [cx, base - h * 0.27], [cx + bw / 2 + 4, base - h * 0.16]], '#cdbb98');
      ctx.strokeStyle = 'rgba(120,100,70,.25)'; for (let y = base - h * 0.16; y < base; y += 8) { ctx.beginPath(); ctx.moveTo(cx - bw / 2, y); ctx.lineTo(cx + bw / 2, y); ctx.stroke(); }
      K.circle(ctx, cx, base - h * 0.19, w * 0.035, '#5a4a6a');
      ctx.strokeStyle = '#c8b28a'; ctx.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx, base - h * 0.19); ctx.lineTo(cx + Math.cos(a) * w * 0.035, base - h * 0.19 + Math.sin(a) * w * 0.035); ctx.stroke(); }
      ctx.fillStyle = '#5a3a26'; ctx.beginPath(); ctx.moveTo(cx - w * 0.045, base); ctx.lineTo(cx - w * 0.045, base - h * 0.07); ctx.arc(cx, base - h * 0.07, w * 0.045, Math.PI, 0); ctx.lineTo(cx + w * 0.045, base); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8a7a5a'; ctx.fillRect(cx - 1.5, base - h * 0.32, 3, h * 0.05); ctx.fillRect(cx - w * 0.015, base - h * 0.305, w * 0.03, 3);
      K.hit('spot', 'enter', cx, base - h * 0.04, Math.max(28, w * 0.07));
      /* 钟楼 */
      const bx = cx + bw / 2 + w * 0.07;
      ctx.fillStyle = '#d0bf9c'; ctx.fillRect(bx - w * 0.055, base - h * 0.33, w * 0.11, h * 0.33);
      ctx.fillStyle = '#3a2e26'; ctx.beginPath(); ctx.moveTo(bx - w * 0.03, base - h * 0.24); ctx.lineTo(bx - w * 0.03, base - h * 0.27); ctx.arc(bx, base - h * 0.27, w * 0.03, Math.PI, 0); ctx.lineTo(bx + w * 0.03, base - h * 0.24); ctx.fill();
      const sw = m.hour >= 12 && m.hour < 12.1 && !m.reduceMotion ? Math.sin(t * 4) * 4 : 0;
      ctx.fillStyle = '#b8862b'; ctx.beginPath(); ctx.arc(bx + sw, base - h * 0.255, w * 0.016, Math.PI, 0); ctx.fill();
      K.poly(ctx, [[bx - w * 0.065, base - h * 0.33], [bx, base - h * 0.4], [bx + w * 0.065, base - h * 0.33]], '#a8582e');
      ctx.fillStyle = '#6a5a4a'; ctx.fillRect(bx - 1.5, base - h * 0.45, 3, h * 0.05); ctx.fillRect(bx - w * 0.013, base - h * 0.435, w * 0.026, 3);
      K.hit('spot', 'angelus', bx, base - h * 0.25, Math.max(24, w * 0.06));
      K.tree(ctx, w * 0.08, h * 0.76, h * 0.14, 'olive', m, t);
      K.tree(ctx, w * 0.95, h * 0.72, h * 0.2, 'cypress', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6.5 || m.hour > 18.4) K.glow(ctx, w * 0.42, h * 0.55, h * 0.05, 'rgba(255,200,140,.5)', t);
      if (m.offered.indexOf('votive') >= 0) K.flame(ctx, w * 0.36, h * 0.735, 3.5, t);
    },
  },
});
