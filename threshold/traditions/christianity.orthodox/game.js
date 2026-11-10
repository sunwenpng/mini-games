/* 圆顶小教堂（东正教）：玩法定义与场景。 */
Courtyard.define({
  id: 'christianity.orthodox',
  saveKey: 'threshold-orth-save-v1',
  tz: 'Europe/Belgrade',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  theme: { hud: 'rgba(20,32,60,.92)', bar: '#1a2a4a', btn: '#f6f1e4', btnInk: '#1a2a4a', accent: '#8a6a1f', stage: '#141c30' },
  bell: 'church',
  horizon: 0.5,
  resource: { icon: '🍞', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'dog'], max: 4, every: 110, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['瓦西亚', '玛莎', '米什卡', '卢卡', '佐拉', '鲍里斯', '奥莉娅', '斯托扬'], en: ['Vasya', 'Masha', 'Mishka', 'Luka', 'Zora', 'Boris', 'Olya', 'Stoyan'] },
    families: { 'zh-CN': ['教堂旁卖蜂蜜的老奶奶', '村里的小学老师', '养蜂人一家', '神父的邻居'], en: ['the old woman who sells honey by the church', 'the village schoolteacher', 'a beekeeping family', 'the priest’s neighbours'] },
  },
  practices: [
    { id: 'cross', icon: '☦️', kind: 'steps', steps: 3, sound: 'church' },
    { id: 'candle', icon: '🕯️', kind: 'offer', items: ['beeswax', 'names'], sound: 'church' },
    { id: 'rope', icon: '📿', kind: 'count', targets: [33, 100], lang: 'el' },
    { id: 'read', icon: '📖', kind: 'read' },
    { id: 'learn', icon: '📚', kind: 'learn', cards: ['icons', 'liturgy', 'fasting'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '圆顶小教堂',
      'app.label': '启扉 · 东正教 · 圆顶小教堂（未经审核的预览）',
      'intro.body': '村子边的一座白墙小教堂，蓝色的洋葱顶上点着金星，顶上是东正教的十字架。旁边一排白桦树，钟架上挂着几口小钟。教堂里点满蜂蜡蜡烛，一只灰猫常在门口等人。',
      'intro.how': '打理教堂院子能分到面包，用来照顾猫和狗。画十字、点烛、念耶稣祷文只记在功课簿里。',
      'intro.etiquette': '女性进堂常戴头巾，男性脱帽。',
      'res.name': '面包',
      'chore.label': '打理',
      'chore.pile': '落叶和积雪',
      'chore.got': '院子打理好一角，分来 {n} 块面包',
      'prac.cross.bar': '画十字',
      'prac.cross.title': '画十字与鞠躬',
      'prac.cross.body': '东正教用拇指、食指、中指并拢（象征圣三），无名指和小指弯向掌心（象征基督的神性和人性），从额头到胸前，再从右肩到左肩，然后鞠躬。',
      'prac.cross.step.1': '进门画十字，鞠躬',
      'prac.cross.step.2': '在圣像前画十字，鞠躬',
      'prac.cross.step.3': '在堂中站定，画十字',
      'prac.cross.btn': '画十字',
      'prac.cross.done': '已记入功课簿',
      'prac.candle.bar': '点烛',
      'prac.candle.title': '蜂蜡蜡烛与代祷名单',
      'prac.candle.body': '在烛台上点一支细长的蜂蜡蜡烛；也可以写下想为之祈祷的人的名字，交给教堂。不用面包，也不换取任何东西。',
      'offer.beeswax': '一支蜂蜡蜡烛',
      'offer.names': '一张写着名字的代祷单',
      'offer.why.beeswax': '纯净的蜂蜡象征纯净的祈祷',
      'offer.why.names': '在祷告时为生者和亡者纪念',
      'prac.rope.bar': '念珠绳',
      'prac.rope.title': '念珠绳与耶稣祷文',
      'prac.rope.body': '念珠绳（komboskini / chotki）用羊毛绳打成绳结，每个结念一遍耶稣祷文。',
      'prac.rope.mantra': 'Κύριε Ἰησοῦ Χριστέ, ἐλέησόν με',
      'prac.rope.mantraLatn': 'Kýrie Iisoú Christé, eléison me',
      'prac.rope.mantraTr': '主耶稣基督，求你怜悯我',
      'prac.rope.note': '常见的念珠绳有 33 结或 100 结。',
      'prac.read.bar': '短祷',
      'prac.read.title': '短祷',
      'prac.read.body': '希腊文、转写和译文逐行对照。',
      'usage.jesusPrayer': '东正教修道传统中反复念诵的短祷',
      'usage.kyrie': '礼仪中反复应答的一句',
      'usage.trisagion': '礼仪中歌唱的三圣颂',
      'usage.christosAnesti': '复活节期间反复歌唱的赞词',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解东正教',
      'prac.learn.body': '几张小卡片。',
      'learn.icons.title': '圣像与圣像墙',
      'learn.icons.sub': '“天国的窗户”',
      'learn.icons.body': '东正教的圣像是按严格传统绘制的圣画，被看作通向天国的窗户。信徒在圣像前画十字、鞠躬、亲吻圣像。\n圣像墙把圣所和会众隔开。游戏里只作远景，不画圣像人物。',
      'learn.liturgy.title': '神圣礼仪',
      'learn.liturgy.sub': '站着祈祷的礼拜',
      'learn.liturgy.body': '东正教的主日礼拜称为神圣礼仪（Divine Liturgy），多数教堂没有长椅，信徒站着参礼，礼仪大部分是唱的。\n游戏不模拟礼仪和圣事。',
      'learn.fasting.title': '斋期',
      'learn.fasting.sub': '一年将近一半的日子',
      'learn.fasting.body': '东正教有大斋期、圣诞斋期等，以及每周三、周五的斋日，斋期内不吃肉、奶、蛋等。\n严格程度因人因地而异。',
      'hint.dawn': '清晨，教堂敲响了晨祷的钟。',
      'hint.night': '堂里的长明灯还亮着。',
    },
    en: {
      'app.title': 'Domed Village Church',
      'app.label': 'Threshold · Eastern Orthodox Christianity · Domed Village Church (unreviewed preview)',
      'intro.body': 'A whitewashed church at the edge of the village: blue onion domes dotted with gold stars beneath the Orthodox cross, a row of birches, a little bell frame. Inside, beeswax candles burn, and a grey cat waits by the door.',
      'intro.how': 'Tending the churchyard earns bread, which feeds the cats and dogs. The sign of the cross, candles and the Jesus Prayer are only noted in the practice book.',
      'intro.etiquette': 'Women often cover their heads; men remove their hats.',
      'res.name': 'bread',
      'chore.label': 'Tend',
      'chore.pile': 'leaves and snow',
      'chore.got': 'A corner of the churchyard tidied; you receive {n} bread',
      'prac.cross.bar': 'Cross',
      'prac.cross.title': 'The sign of the cross and bowing',
      'prac.cross.body': 'Orthodox Christians join thumb, index and middle finger (the Trinity) and fold the other two into the palm (Christ’s two natures), touching forehead, chest, right shoulder, then left shoulder, and bow.',
      'prac.cross.step.1': 'At the door: cross yourself and bow',
      'prac.cross.step.2': 'Before an icon: cross yourself and bow',
      'prac.cross.step.3': 'Standing in the nave: cross yourself',
      'prac.cross.btn': 'Cross',
      'prac.cross.done': 'Noted in the practice book',
      'prac.candle.bar': 'Candle',
      'prac.candle.title': 'Beeswax candle and a list of names',
      'prac.candle.body': 'Light a thin beeswax candle at the stand; you may also write the names of people to pray for and hand them in. It costs no bread and earns nothing.',
      'offer.beeswax': 'a beeswax candle',
      'offer.names': 'a slip with names to remember',
      'offer.why.beeswax': 'Pure wax for a pure prayer',
      'offer.why.names': 'The living and the departed are remembered at prayer',
      'prac.rope.bar': 'Prayer rope',
      'prac.rope.title': 'The prayer rope and the Jesus Prayer',
      'prac.rope.body': 'The prayer rope (komboskini, chotki) is knotted wool; at each knot one says the Jesus Prayer.',
      'prac.rope.mantra': 'Κύριε Ἰησοῦ Χριστέ, ἐλέησόν με',
      'prac.rope.mantraLatn': 'Kýrie Iisoú Christé, eléison me',
      'prac.rope.mantraTr': 'Lord Jesus Christ, have mercy on me',
      'prac.rope.note': 'Common ropes have 33 or 100 knots.',
      'prac.read.bar': 'Prayers',
      'prac.read.title': 'Short prayers',
      'prac.read.body': 'Greek, romanization and translation line by line.',
      'usage.jesusPrayer': 'The short prayer repeated in the Orthodox monastic tradition',
      'usage.kyrie': 'The response repeated throughout the litanies',
      'usage.trisagion': 'The thrice-holy hymn sung in the Liturgy',
      'usage.christosAnesti': 'Sung again and again in the Paschal season',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Orthodoxy',
      'prac.learn.body': 'A few short cards.',
      'learn.icons.title': 'Icons and the iconostasis',
      'learn.icons.sub': '“Windows onto heaven”',
      'learn.icons.body': 'Orthodox icons are painted by strict tradition and seen as windows onto heaven. The faithful cross themselves, bow and kiss them.\nThe iconostasis separates sanctuary and nave. In the game it is background only; no icon figures are drawn.',
      'learn.liturgy.title': 'The Divine Liturgy',
      'learn.liturgy.sub': 'Worship standing',
      'learn.liturgy.body': 'The Sunday service is the Divine Liturgy. Most churches have no pews; people stand, and almost everything is sung.\nThe game never simulates the Liturgy or the sacraments.',
      'learn.fasting.title': 'Fasting',
      'learn.fasting.sub': 'Nearly half the year',
      'learn.fasting.body': 'There is Great Lent, the Nativity Fast and others, plus Wednesdays and Fridays, when meat, dairy and eggs are set aside.\nHow strictly varies from person to person and place to place.',
      'hint.dawn': 'Early morning: the bell rings for matins.',
      'hint.night': 'The vigil lamp is still burning inside.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.5;
      K.hills(ctx, w, hy, '#7d9468', h * 0.07, 51);
      K.ground(ctx, w, h, hy, m.season === 'winter' ? '#e8eae6' : '#90a46a', m.season === 'winter' ? '#d8dbd6' : '#7c9058');
      const cx = w * 0.5, base = h * 0.75, bw = w * 0.4;
      ctx.fillStyle = '#f4f2ec'; ctx.fillRect(cx - bw / 2, base - h * 0.15, bw, h * 0.15);
      K.poly(ctx, [[cx - bw / 2 - 4, base - h * 0.15], [cx + bw / 2 + 4, base - h * 0.15], [cx + bw * 0.3, base - h * 0.19], [cx - bw * 0.3, base - h * 0.19]], '#5a7a9a');
      ctx.fillStyle = '#f4f2ec'; ctx.fillRect(cx - bw * 0.12, base - h * 0.27, bw * 0.24, h * 0.09);
      const onion = (x, y, r, col) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - r * 0.7, y);
        ctx.bezierCurveTo(x - r * 1.3, y - r * 0.9, x - r * 0.3, y - r * 1.5, x, y - r * 2.1);
        ctx.bezierCurveTo(x + r * 0.3, y - r * 1.5, x + r * 1.3, y - r * 0.9, x + r * 0.7, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#e8c45a'; for (let i = 0; i < 5; i++) K.circle(ctx, x + Math.sin(i * 2.1) * r * 0.5, y - r * (0.4 + (i % 3) * 0.35), 1.6, '#e8c45a');
        ctx.strokeStyle = '#c8a440'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - r * 2.1); ctx.lineTo(x, y - r * 2.9);
        ctx.moveTo(x - r * 0.35, y - r * 2.6); ctx.lineTo(x + r * 0.35, y - r * 2.6); ctx.moveTo(x - r * 0.2, y - r * 2.78); ctx.lineTo(x + r * 0.2, y - r * 2.78);
        ctx.moveTo(x - r * 0.25, y - r * 2.32); ctx.lineTo(x + r * 0.25, y - r * 2.44); ctx.stroke();
      };
      onion(cx, base - h * 0.27, w * 0.05, '#2f5f9a');
      onion(cx - bw * 0.36, base - h * 0.15, w * 0.028, '#2f5f9a');
      onion(cx + bw * 0.36, base - h * 0.15, w * 0.028, '#2f5f9a');
      ctx.fillStyle = '#4a3a2a'; ctx.beginPath(); ctx.moveTo(cx - w * 0.04, base); ctx.lineTo(cx - w * 0.04, base - h * 0.06); ctx.arc(cx, base - h * 0.06, w * 0.04, Math.PI, 0); ctx.lineTo(cx + w * 0.04, base); ctx.closePath(); ctx.fill();
      for (let i = -1; i <= 1; i += 2) { ctx.fillStyle = m.night ? '#f2d27a' : '#5a6a8a'; ctx.beginPath(); ctx.moveTo(cx + i * bw * 0.28 - 6, base - h * 0.05); ctx.lineTo(cx + i * bw * 0.28 - 6, base - h * 0.1); ctx.arc(cx + i * bw * 0.28, base - h * 0.1, 6, Math.PI, 0); ctx.lineTo(cx + i * bw * 0.28 + 6, base - h * 0.05); ctx.fill(); }
      K.hit('spot', 'cross', cx, base - h * 0.04, Math.max(28, w * 0.07));
      /* 钟架 */
      const bx = w * 0.86, by = h * 0.76;
      ctx.fillStyle = '#6a4a30'; ctx.fillRect(bx - w * 0.05, by - h * 0.12, 4, h * 0.12); ctx.fillRect(bx + w * 0.05 - 4, by - h * 0.12, 4, h * 0.12); ctx.fillRect(bx - w * 0.055, by - h * 0.12, w * 0.11, 4);
      [-0.025, 0, 0.025].forEach((d, i) => { ctx.fillStyle = '#b8862b'; ctx.beginPath(); ctx.arc(bx + d * w, by - h * 0.1, 4 + i, Math.PI, 0); ctx.fill(); });
      for (let i = 0; i < 3; i++) { const x = w * (0.06 + i * 0.07); ctx.fillStyle = '#efefe8'; ctx.fillRect(x - 3, h * 0.6, 6, h * 0.17); ctx.fillStyle = '#2a2a2a'; for (let k = 0; k < 4; k++) ctx.fillRect(x - 3, h * (0.62 + k * 0.035), 4, 2); K.circle(ctx, x, h * 0.58, h * 0.05, m.season === 'autumn' ? '#d9b03a' : m.season === 'winter' ? 'rgba(0,0,0,0)' : '#7aa64a'); }
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6.5 || m.hour > 18.4) K.glow(ctx, w * 0.5, h * 0.71, h * 0.05, 'rgba(255,200,130,.55)', t);
      if (m.offered.indexOf('beeswax') >= 0) K.flame(ctx, w * 0.44, h * 0.745, 3.5, t);
    },
  },
});
