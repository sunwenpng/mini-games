/* 社区佛堂（印度新乘佛教）：玩法定义与场景。 */
Courtyard.define({
  id: 'buddhism.india.navayana',
  saveKey: 'threshold-nv-save-v1',
  tz: 'Asia/Kolkata',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap',
  theme: { hud: 'rgba(16,36,80,.92)', bar: '#14295a', btn: '#eef2fa', btnInk: '#14295a', accent: '#1f4fa0', stage: '#14213d' },
  bell: 'bowl',
  horizon: 0.48,
  seasons: mo => (mo >= 3 && mo <= 6 ? 'hot' : mo >= 7 && mo <= 9 ? 'monsoon' : 'cool'),
  resource: { icon: '🍚', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: 'leaves', spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['dog', 'cat'], max: 4, every: 110, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['莫蒂', '拉朱', '辛巴', '巴卢', '基蒂', '索努', '米图', '雷什米'], en: ['Moti', 'Raju', 'Simba', 'Bhalu', 'Kitty', 'Sonu', 'Mitthu', 'Reshmi'] },
    families: { 'zh-CN': ['街角开茶摊的一家', '佛堂图书室的志愿者', '附近学校的老师', '刚搬来的年轻夫妇'], en: ['the family who run the corner chai stall', 'a volunteer from the vihara library', 'a teacher from the nearby school', 'a young couple who just moved in'] },
  },
  practices: [
    { id: 'vandana', icon: '🙏', kind: 'steps', steps: 3, sound: 'bowl' },
    { id: 'offer', icon: '🕯️', kind: 'offer', items: ['candle', 'flowers', 'incense'], sound: 'bowl' },
    { id: 'read', icon: '📿', kind: 'read' },
    { id: 'learn', icon: '📖', kind: 'learn', cards: ['conversion', 'vows', 'deekshabhoomi', 'library'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '社区佛堂',
      'app.label': '启扉 · 印度新乘佛教 · 社区佛堂（未经审核的预览）',
      'intro.body': '马哈拉施特拉一个街区里的小佛堂（Buddha Vihara）：白色的圆顶，门口挂着蓝旗和五色佛教旗，旁边是一间小图书室。傍晚，邻居们来这里一起念三皈五戒。',
      'intro.how': '打扫佛堂和院子能分到口粮，用来照顾街上的狗和猫。礼拜、供养、诵读和阅读只记在功课簿里。',
      'res.name': '口粮',
      'chore.label': '打扫',
      'chore.pile': '落叶',
      'chore.got': '打扫干净一处，分到 {n} 份口粮',
      'prac.vandana.bar': '礼拜',
      'prac.vandana.title': '礼拜（三拜）',
      'prac.vandana.body': '脱鞋进佛堂，在佛前合掌，跪下礼拜三次，分别礼敬佛、法、僧。',
      'prac.vandana.step.1': '第一拜：礼敬佛',
      'prac.vandana.step.2': '第二拜：礼敬法',
      'prac.vandana.step.3': '第三拜：礼敬僧',
      'prac.vandana.btn': '礼拜',
      'prac.vandana.done': '三拜完毕，已记入功课簿',
      'prac.offer.bar': '供养',
      'prac.offer.title': '蜡烛、花、香',
      'prac.offer.body': '在佛前点一支蜡烛、供一束花或一支香。不用口粮，也不换取任何东西。',
      'offer.candle': '一支蜡烛',
      'offer.flowers': '一束花',
      'offer.incense': '一支香',
      'offer.why.candle': '烛光象征智慧照破无明',
      'offer.why.flowers': '花会凋谢，提醒无常',
      'offer.why.incense': '香气象征持戒的德行',
      'prac.read.bar': '诵读',
      'prac.read.title': '三皈五戒',
      'prac.read.body': '天城体巴利文、拉丁转写和译文逐行对照。社区聚会时常一起诵读。',
      'usage.namo': '诵读开头念三遍',
      'usage.tisarana': '皈依佛法僧，1956 年集体皈依时也念这一段',
      'usage.panchshil': '在家人受持的五条戒',
      'prac.learn.bar': '阅读',
      'prac.learn.title': '佛堂图书室',
      'prac.learn.body': '新乘佛教的历史，读几段。',
      'learn.conversion.title': '1956 年的集体皈依',
      'learn.conversion.sub': '那格浦尔 · 10 月 14 日',
      'learn.conversion.body': '1956 年 10 月 14 日，印度宪法起草委员会主席安贝德卡尔博士在那格浦尔皈依佛教，随后带领数十万追随者一起受三皈五戒。\n他出身于当时被视为“不可接触者”的种姓，认为佛教主张人人平等，可以帮助人们摆脱种姓歧视。\n同年 12 月 6 日，他在德里去世。他写的《佛陀及其正法》在第二年出版，是新乘佛教的重要著作。',
      'learn.vows.title': '二十二誓言',
      'learn.vows.sub': '皈依时一起立下的誓言',
      'learn.vows.body': '集体皈依时，安贝德卡尔为皈依者立下二十二条誓言。\n内容包括：不再崇拜原先信仰中的神灵、不再举行相关仪式；相信人人平等；遵行八正道、修习十波罗蜜；慈悲待人；不杀生、不偷盗、不邪淫、不妄语、不饮酒。\n这些誓言把宗教皈依和社会平等连在一起，至今仍在新乘佛教的皈依仪式中宣读。',
      'learn.deekshabhoomi.title': '皈依之地（Deekshabhoomi）',
      'learn.deekshabhoomi.sub': '那格浦尔的大佛塔',
      'learn.deekshabhoomi.body': '集体皈依的地方后来建起一座巨大的佛塔，称为 Deekshabhoomi（皈依之地）。\n每年转法轮日前后，来自全印度的上百万人到这里纪念。',
      'learn.library.title': '为什么佛堂旁边有图书室',
      'learn.library.sub': '“教育、组织、奋斗”',
      'learn.library.body': '安贝德卡尔常说“教育、组织、奋斗”。很多社区佛堂兼作图书室、补习班和聚会的地方。\n孩子们在这里写作业，年轻人在这里准备考试。',
      'care.intro': '街区里的狗和猫，大家轮流照顾。',
      'hint.evening': '傍晚，邻居们陆续来佛堂一起诵读。',
    },
    en: {
      'app.title': 'Community Vihara',
      'app.label': 'Threshold · Navayana Buddhism · Community Vihara (unreviewed preview)',
      'intro.body': 'A small Buddha Vihara in a Maharashtra neighbourhood: a white dome, blue flags and the five-coloured Buddhist flag at the door, and a little library beside it. In the evening neighbours come to recite the Refuges and Precepts together.',
      'intro.how': 'Sweeping the vihara and yard earns rations, which feed the street dogs and cats. Bowing, offerings, recitation and reading are only noted in the practice book.',
      'res.name': 'rations',
      'chore.label': 'Sweep',
      'chore.pile': 'leaves',
      'chore.got': 'Swept clean; you receive {n} rations',
      'prac.vandana.bar': 'Bow',
      'prac.vandana.title': 'Vandana (three bows)',
      'prac.vandana.body': 'Take off your shoes, join your palms before the Buddha, kneel and bow three times: to the Buddha, the Dhamma and the Sangha.',
      'prac.vandana.step.1': 'First bow: the Buddha',
      'prac.vandana.step.2': 'Second bow: the Dhamma',
      'prac.vandana.step.3': 'Third bow: the Sangha',
      'prac.vandana.btn': 'Bow',
      'prac.vandana.done': 'Three bows; noted in the practice book',
      'prac.offer.bar': 'Offer',
      'prac.offer.title': 'Candle, flowers, incense',
      'prac.offer.body': 'Light a candle, offer flowers or a stick of incense before the Buddha. It costs no rations and earns nothing.',
      'offer.candle': 'a candle',
      'offer.flowers': 'flowers',
      'offer.incense': 'a stick of incense',
      'offer.why.candle': 'Candlelight stands for wisdom dispelling ignorance',
      'offer.why.flowers': 'Flowers fade, a reminder of impermanence',
      'offer.why.incense': 'Fragrance stands for virtue',
      'prac.read.bar': 'Recite',
      'prac.read.title': 'Refuges and Precepts',
      'prac.read.body': 'Pali in Devanagari, romanization and translation line by line, often recited together at gatherings.',
      'usage.namo': 'Said three times before other recitations',
      'usage.tisarana': 'Going for refuge; also recited at the 1956 conversion',
      'usage.panchshil': 'The five precepts of lay followers',
      'prac.learn.bar': 'Read',
      'prac.learn.title': 'Vihara library',
      'prac.learn.body': 'A few pages on Navayana history.',
      'learn.conversion.title': 'The 1956 conversion',
      'learn.conversion.sub': 'Nagpur · 14 October',
      'learn.conversion.body': 'On 14 October 1956 in Nagpur, Dr B. R. Ambedkar, chair of the committee that drafted India’s constitution, became a Buddhist and then led hundreds of thousands of followers through the Refuges and Precepts.\nBorn into a caste then treated as “untouchable”, he saw in Buddhism a teaching of human equality that could free people from caste discrimination.\nHe died in Delhi on 6 December that year. His book The Buddha and His Dhamma appeared the following year and remains central to Navayana.',
      'learn.vows.title': 'The twenty-two vows',
      'learn.vows.sub': 'Taken together at the conversion',
      'learn.vows.body': 'At the conversion Ambedkar gave twenty-two vows.\nThey include no longer worshipping the deities of one’s former faith or performing its rites; holding all people equal; following the Noble Eightfold Path and the ten perfections; compassion; and refraining from killing, stealing, sexual misconduct, lying and intoxicants.\nThe vows join religious conversion to social equality and are still read at Navayana conversion ceremonies.',
      'learn.deekshabhoomi.title': 'Deekshabhoomi',
      'learn.deekshabhoomi.sub': 'The great stupa in Nagpur',
      'learn.deekshabhoomi.body': 'A great stupa now stands where the conversion took place: Deekshabhoomi, “the ground of initiation”.\nAround Dhammachakra Pravartan Din each year, a million or more people from across India gather there.',
      'learn.library.title': 'Why a library next to the vihara',
      'learn.library.sub': '“Educate, agitate, organise”',
      'learn.library.body': 'Ambedkar’s call was “educate, agitate, organise”. Many community viharas double as libraries, tuition rooms and meeting halls.\nChildren do homework here and young people prepare for exams.',
      'care.intro': 'The neighbourhood’s dogs and cats, looked after by everyone in turn.',
      'hint.evening': 'Evening: neighbours drift in to recite together.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.48;
      ctx.fillStyle = '#b9a98a';
      for (let i = 0; i < 7; i++) { const bw = w * 0.12, bh = h * (0.06 + (i % 3) * 0.02); ctx.fillRect(i * w * 0.15 - 6, hy - bh, bw, bh); }
      K.ground(ctx, w, h, hy, m.season === 'monsoon' ? '#8a9a6a' : '#c8b48c', m.season === 'monsoon' ? '#6f8a58' : '#b09a72');
      const cx = w * 0.5, base = h * 0.72;
      ctx.fillStyle = '#f3f2ee'; ctx.fillRect(cx - w * 0.28, base - h * 0.12, w * 0.56, h * 0.12);
      ctx.fillStyle = '#e4e2dc'; ctx.fillRect(cx - w * 0.3, base - h * 0.125, w * 0.6, h * 0.012);
      ctx.fillStyle = '#f7f6f2'; ctx.beginPath(); ctx.ellipse(cx, base - h * 0.125, w * 0.17, h * 0.1, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#dcd8cc'; ctx.fillRect(cx - w * 0.005, base - h * 0.25, w * 0.01, h * 0.03);
      K.circle(ctx, cx, base - h * 0.255, w * 0.012, '#d4a63a');
      for (let i = -2; i <= 2; i++) { ctx.fillStyle = '#2a3a5a'; ctx.fillRect(cx + i * w * 0.1 - w * 0.025, base - h * 0.09, w * 0.05, h * 0.06); ctx.fillStyle = m.night ? '#f2d27a' : '#8aa0c8'; ctx.fillRect(cx + i * w * 0.1 - w * 0.02, base - h * 0.085, w * 0.04, h * 0.05); }
      ctx.fillStyle = '#5a3a2a'; ctx.fillRect(cx - w * 0.035, base - h * 0.08, w * 0.07, h * 0.08);
      /* 蓝旗与五色佛教旗 */
      const flag = (x, cols) => { ctx.fillStyle = '#6a6a6a'; ctx.fillRect(x, base - h * 0.2, 2, h * 0.2); const wv = m.reduceMotion ? 0 : Math.sin(t * 3 + x) * 2; cols.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x + 2 + i * 6, base - h * 0.2 + wv * (i / cols.length), 6, h * 0.04); }); };
      flag(w * 0.12, ['#1f4fa0', '#1f4fa0', '#1f4fa0', '#1f4fa0']);
      flag(w * 0.84, ['#2c6fbb', '#f2c94c', '#c0392b', '#f4f1e8', '#e8792b']);
      /* 图书室 */
      ctx.fillStyle = '#e9e1cf'; ctx.fillRect(w * 0.03, base - h * 0.08, w * 0.14, h * 0.08);
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(w * 0.06, base - h * 0.06, w * 0.08, h * 0.035);
      K.tree(ctx, w * 0.93, h * 0.66, h * 0.15, 'banyan', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour > 18.3 || m.hour < 6) K.glow(ctx, w * 0.5, h * 0.66, h * 0.07, 'rgba(255,210,130,.5)', t);
      if (m.offered.indexOf('candle') >= 0) K.flame(ctx, w * 0.5, h * 0.705, 4, t);
    },
  },
});
