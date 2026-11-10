/* 会堂小院（犹太教 · 只做知识与文化）：玩法定义与场景。安息日不干活。 */
(function () {
  'use strict';
  /* 耶路撒冷日落时间的粗略估算（小时，当地时间）：冬至约 16:40，夏至约 19:50。 */
  function sunset(date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 1);
    const doy = Math.floor((date.getTime() - start) / 86400000) + 1;
    return 18.2 + 1.55 * Math.sin((2 * Math.PI * (doy - 81)) / 365);
  }
  Courtyard.define({
    id: 'judaism.shabbat',
    saveKey: 'threshold-he-save-v1',
    tz: 'Asia/Jerusalem',
    langs: ['zh-CN', 'en'],
    defaultLang: 'zh-CN',
    font: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@500;700&display=swap',
    theme: { hud: 'rgba(24,36,64,.92)', bar: '#1c2a4a', btn: '#f4f1e8', btnInk: '#1c2a4a', accent: '#2f5aa0', stage: '#161e34' },
    bell: 'chime',
    horizon: 0.48,
    /* 周五日落前 18 分钟点蜡烛起，到周六日落后约 42 分钟入夜止。 */
    rest(date, hour, weekday) {
      const s = sunset(date);
      if (weekday === 5 && hour >= s - 0.3) return 'rest.shabbat';
      if (weekday === 6 && hour < s + 0.7) return 'rest.shabbat';
      return null;
    },
    resource: { icon: '🥯', start: 12 },
    chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'leaves' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
    care: {
      mode: 'animals', kinds: ['cat', 'dog'], max: 4, every: 110, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
      names: { 'zh-CN': ['沙洛姆', '托娃', '米奇', '诺亚', '莉莉', '阿里', '达娜', '本尼'], en: ['Shalom', 'Tova', 'Miki', 'Noa', 'Lili', 'Ari', 'Dana', 'Beni'] },
      families: { 'zh-CN': ['街角面包房的一家', '会堂的看门老人', '附近学校的老师', '刚结婚的年轻夫妇'], en: ['the corner bakery family', 'the old synagogue caretaker', 'a teacher from the nearby school', 'a newly married couple'] },
    },
    practices: [
      { id: 'mezuzah', icon: '🚪', kind: 'steps', steps: 2, sound: 'chime' },
      { id: 'tzedakah', icon: '🪙', kind: 'offer', items: ['box', 'bread', 'visit'] },
      { id: 'read', icon: '📜', kind: 'read' },
      { id: 'shabbat', icon: '🕯️', kind: 'learn', cards: ['candles', 'kiddush', 'challah', 'rest', 'havdalah'] },
      { id: 'shofar', icon: '📯', kind: 'steps', steps: 4, sound: 'shofar', audio: 'ref.shofar' },
      { id: 'learn', icon: '📚', kind: 'learn', cards: ['synagogue', 'torah', 'kashrut', 'name'] },
    ],
    msg: {
      'zh-CN': {
        'app.title': '会堂小院',
        'app.label': '启扉 · 犹太教（只做知识与文化）· 会堂小院（未经审核的预览）',
        'intro.body': '耶路撒冷老街区里的一座石头小会堂：浅黄的石墙，拱形的窗，窗上是大卫之星。院子里有一棵橄榄树和几只街猫。每到周五傍晚，街上安静下来，安息日开始了。',
        'intro.how': '打扫院子能从街坊那里分到面包，用来照顾猫和狗。安息日不干活，只能休息、阅读。门柱圣卷、施舍、阅读和羊角号只记在功课簿里。这一版不模拟祷告。',
        'intro.etiquette': '男性进会堂通常戴小圆帽（kippah）。',
        'res.name': '面包',
        'chore.label': '打扫',
        'chore.pile': '落叶',
        'chore.got': '院子扫干净一角，街坊送来 {n} 个面包',
        'prac.mezuzah.bar': '门柱',
        'prac.mezuzah.title': '门柱圣卷（Mezuzah）',
        'prac.mezuzah.body': '犹太人家和会堂的门框右侧钉着一个小盒子，里面卷着写有《示玛》的羊皮纸。很多人进出时用手指轻触它，再碰一下嘴唇。',
        'prac.mezuzah.step.1': '走到门口，看见门框右侧的小盒子',
        'prac.mezuzah.step.2': '用指尖轻触门柱圣卷，再碰一下嘴唇',
        'prac.mezuzah.btn': '继续',
        'prac.mezuzah.done': '已记入功课簿',
        'prac.tzedakah.bar': '施舍',
        'prac.tzedakah.title': '施舍（Tzedakah）',
        'prac.tzedakah.body': 'Tzedakah 的意思是“公义”：帮助他人被看作应尽的义务，而不只是善心。很多家庭在安息日前往施舍盒里放几枚硬币。这里不用面包，也不换取任何东西。',
        'offer.box': '往施舍盒里放几枚硬币',
        'offer.bread': '给需要的邻居送去面包',
        'offer.visit': '去探望生病的邻居',
        'prac.read.bar': '阅读',
        'prac.read.title': '阅读',
        'prac.read.body': '希伯来原文、转写和译文对照。经文不用机器朗读，可以播放参考录音。',
        'usage.shema': '犹太信仰的核心宣认，早晚都会念',
        'usage.shalomAleichem': '周五晚上安息日晚餐前唱的歌',
        'prac.shabbat.bar': '安息日',
        'prac.shabbat.title': '安息日（Shabbat）',
        'prac.shabbat.body': '从周五日落到周六入夜。这些卡片说明安息日的习俗，游戏不模拟仪式。',
        'learn.candles.title': '点安息日蜡烛',
        'learn.candles.sub': '周五日落前',
        'learn.candles.body': '周五日落前十八分钟左右，家里通常由女主人点燃两支蜡烛，用双手在烛光前画圈，遮住眼睛念祝福。\n点燃蜡烛之后，安息日就开始了。',
        'learn.kiddush.title': '圣化礼（Kiddush）',
        'learn.kiddush.sub': '晚餐开始',
        'learn.kiddush.body': '安息日晚餐开始时，一家之主举起一杯葡萄酒，念祝福，宣告这一天的神圣。',
        'learn.challah.title': '哈拉面包（Challah）',
        'learn.challah.sub': '两个编织面包',
        'learn.challah.body': '安息日餐桌上有两个编织的哈拉面包，纪念旷野中周五降下双份吗哪。掰面包前先念祝福，常撒一点盐。',
        'learn.rest.title': '休息',
        'learn.rest.sub': '为什么游戏里这天不干活',
        'learn.rest.body': '安息日不工作：不点火、不写字、不做买卖，许多人也不使用电子设备。\n所以在游戏里，安息日不能扫院子，只能休息和阅读。',
        'learn.havdalah.title': '分别礼（Havdalah）',
        'learn.havdalah.sub': '周六入夜',
        'learn.havdalah.body': '周六天空出现三颗星时，安息日结束。人们点燃一支编织蜡烛，闻香料，喝一口酒，告别安息日。',
        'prac.shofar.bar': '羊角号',
        'prac.shofar.title': '羊角号（Shofar）',
        'prac.shofar.body': '用公羊角做的号角，在犹太新年和赎罪日结束时吹响。有四种吹法。这里可以听一段录音。',
        'prac.shofar.step.1': 'Tekiah：一声长音',
        'prac.shofar.step.2': 'Shevarim：三声断续的短音',
        'prac.shofar.step.3': 'Teruah：九声急促的音',
        'prac.shofar.step.4': 'Tekiah Gedolah：一声很长的长音',
        'prac.shofar.btn': '下一种',
        'prac.shofar.done': '已记入功课簿',
        'prac.learn.bar': '了解',
        'prac.learn.title': '了解犹太教',
        'prac.learn.body': '几张小卡片。',
        'learn.synagogue.title': '会堂',
        'learn.synagogue.sub': '祈祷、学习、聚会的地方',
        'learn.synagogue.body': '会堂是犹太社区祈祷、学习和聚会的地方。正面墙上的约柜里存放着手写的托拉经卷，通常朝向耶路撒冷。\n公共祈祷一般需要十个成年人（minyan）。',
        'learn.torah.title': '托拉',
        'learn.torah.sub': '摩西五经',
        'learn.torah.body': '托拉指《摩西五经》，由专门的抄写员用羽毛笔手写在羊皮卷上。每周安息日在会堂里读一段，一年读完一遍。',
        'learn.kashrut.title': '饮食律法（Kashrut）',
        'learn.kashrut.sub': '“洁食”',
        'learn.kashrut.body': '犹太饮食律法规定哪些食物可以吃：例如不吃猪肉和贝类，肉和奶不同吃。符合律法的食物称为 kosher。',
        'learn.name.title': '为什么写作 ה׳',
        'learn.name.sub': '神名的写法',
        'learn.name.body': '犹太传统不念出、也尽量不随意书写神的四字圣名。日常书写常用 ה׳（Hashem，“那名”），念经时读作 Adonai（“我的主”）。',
        'care.intro': '院子里的街猫和狗。犹太律法要求善待动物（tza’ar ba’alei chayim），先喂动物再自己吃饭。',
        'hint.evening': '傍晚，街上的人们匆匆回家准备安息日晚餐。',
      },
      en: {
        'app.title': 'Synagogue Courtyard',
        'app.label': 'Threshold · Judaism (knowledge and culture only) · Synagogue Courtyard (unreviewed preview)',
        'intro.body': 'A small stone synagogue in an old Jerusalem neighbourhood: pale golden stone, arched windows with the Star of David, an olive tree and a few street cats in the courtyard. Every Friday towards evening the street grows quiet and Shabbat begins.',
        'intro.how': 'Sweeping the courtyard earns bread from the neighbours, which feeds the cats and dogs. On Shabbat there is no work; you can only rest and read. The mezuzah, tzedakah, reading and shofar are only noted in the practice book. Prayer is never simulated.',
        'intro.etiquette': 'Men usually wear a kippah in the synagogue.',
        'res.name': 'bread',
        'chore.label': 'Sweep',
        'chore.pile': 'leaves',
        'chore.got': 'A corner of the courtyard swept; neighbours bring {n} bread',
        'prac.mezuzah.bar': 'Mezuzah',
        'prac.mezuzah.title': 'The mezuzah',
        'prac.mezuzah.body': 'On the right doorpost of Jewish homes and synagogues is a small case holding a parchment with the Shema. Many touch it with their fingertips when passing and then touch their lips.',
        'prac.mezuzah.step.1': 'At the door, notice the small case on the right doorpost',
        'prac.mezuzah.step.2': 'Touch the mezuzah with your fingertips, then your lips',
        'prac.mezuzah.btn': 'Continue',
        'prac.mezuzah.done': 'Noted in the practice book',
        'prac.tzedakah.bar': 'Tzedakah',
        'prac.tzedakah.title': 'Tzedakah',
        'prac.tzedakah.body': 'Tzedakah means “justice”: helping others is a duty, not just kindness. Many families drop coins in the tzedakah box before Shabbat. It costs no bread here and earns nothing.',
        'offer.box': 'put a few coins in the tzedakah box',
        'offer.bread': 'take bread to a neighbour in need',
        'offer.visit': 'visit a sick neighbour',
        'prac.read.bar': 'Read',
        'prac.read.title': 'Reading',
        'prac.read.body': 'Hebrew, transliteration and translation. Scripture is never read by a machine voice; a reference recording can be played.',
        'usage.shema': 'The central declaration of Jewish faith, said morning and evening',
        'usage.shalomAleichem': 'Sung on Friday night before the Shabbat meal',
        'prac.shabbat.bar': 'Shabbat',
        'prac.shabbat.title': 'Shabbat',
        'prac.shabbat.body': 'From Friday sunset to Saturday nightfall. These cards describe its customs; the game does not simulate the rituals.',
        'learn.candles.title': 'Lighting Shabbat candles',
        'learn.candles.sub': 'Before Friday sunset',
        'learn.candles.body': 'About eighteen minutes before sunset on Friday, two candles are lit at home, often by the woman of the house, who circles her hands over the flames and covers her eyes to say the blessing.\nOnce the candles are lit, Shabbat has begun.',
        'learn.kiddush.title': 'Kiddush',
        'learn.kiddush.sub': 'The meal begins',
        'learn.kiddush.body': 'At the start of the Shabbat meal, the head of the household raises a cup of wine and says a blessing proclaiming the holiness of the day.',
        'learn.challah.title': 'Challah',
        'learn.challah.sub': 'Two braided loaves',
        'learn.challah.body': 'Two braided challah loaves sit on the Shabbat table, recalling the double portion of manna on Fridays in the wilderness. A blessing is said before the bread is broken, often with a little salt.',
        'learn.rest.title': 'Rest',
        'learn.rest.sub': 'Why there is no work in the game today',
        'learn.rest.body': 'On Shabbat there is no work: no kindling fire, no writing, no buying or selling, and many do not use electronic devices.\nSo in the game you cannot sweep on Shabbat; you can only rest and read.',
        'learn.havdalah.title': 'Havdalah',
        'learn.havdalah.sub': 'Saturday nightfall',
        'learn.havdalah.body': 'When three stars appear on Saturday night, Shabbat ends. A braided candle is lit, spices are smelled and wine is sipped to bid Shabbat farewell.',
        'prac.shofar.bar': 'Shofar',
        'prac.shofar.title': 'The shofar',
        'prac.shofar.body': 'A ram’s-horn trumpet blown on Rosh Hashanah and at the close of Yom Kippur, in four kinds of calls. You can hear a recording here.',
        'prac.shofar.step.1': 'Tekiah: one long blast',
        'prac.shofar.step.2': 'Shevarim: three broken notes',
        'prac.shofar.step.3': 'Teruah: nine rapid notes',
        'prac.shofar.step.4': 'Tekiah gedolah: one very long blast',
        'prac.shofar.btn': 'Next call',
        'prac.shofar.done': 'Noted in the practice book',
        'prac.learn.bar': 'Learn',
        'prac.learn.title': 'About Judaism',
        'prac.learn.body': 'A few short cards.',
        'learn.synagogue.title': 'The synagogue',
        'learn.synagogue.sub': 'A place to pray, study and gather',
        'learn.synagogue.body': 'The synagogue is where a Jewish community prays, studies and gathers. The ark in the front wall, usually facing Jerusalem, holds handwritten Torah scrolls.\nCommunal prayer usually needs ten adults (a minyan).',
        'learn.torah.title': 'The Torah',
        'learn.torah.sub': 'The Five Books of Moses',
        'learn.torah.body': 'The Torah, the Five Books of Moses, is handwritten by a trained scribe with a quill on parchment. A portion is read in synagogue each Shabbat, completing the cycle every year.',
        'learn.kashrut.title': 'Kashrut',
        'learn.kashrut.sub': 'Kosher food',
        'learn.kashrut.body': 'Jewish dietary law sets out what may be eaten: for example no pork or shellfish, and meat and dairy are not eaten together. Food that follows the law is kosher.',
        'learn.name.title': 'Why ה׳',
        'learn.name.sub': 'Writing the divine name',
        'learn.name.body': 'Jewish tradition does not pronounce the four-letter divine name and avoids writing it casually. Everyday writing often uses ה׳ (Hashem, “the Name”), read aloud in prayer as Adonai (“my Lord”).',
        'care.intro': 'The courtyard’s street cats and dogs. Jewish law requires kindness to animals (tza’ar ba’alei chayim), and to feed one’s animals before oneself.',
        'hint.evening': 'Evening: people hurry home to prepare the Shabbat meal.',
      },
    },
    scene: {
      back(ctx, w, h, m, K, t) {
        const hy = h * 0.48;
        ctx.fillStyle = '#d8c69c'; for (let i = 0; i < 7; i++) { ctx.fillRect(i * w * 0.15 - 4, hy - h * (0.05 + (i % 3) * 0.02), w * 0.13, h * 0.09); K.circle(ctx, i * w * 0.15 + w * 0.06, hy - h * (0.05 + (i % 3) * 0.02), w * 0.025, '#cfbc92'); }
        K.ground(ctx, w, h, hy, '#e2d6b8', '#d2c4a2');
        const cx = w * 0.5, base = h * 0.74, bw = w * 0.44;
        ctx.fillStyle = '#e8d8b0'; ctx.fillRect(cx - bw / 2, base - h * 0.2, bw, h * 0.2);
        ctx.strokeStyle = 'rgba(150,120,70,.25)'; for (let y = base - h * 0.2; y < base; y += 9) { ctx.beginPath(); ctx.moveTo(cx - bw / 2, y); ctx.lineTo(cx + bw / 2, y); ctx.stroke(); }
        ctx.fillStyle = '#d6c296'; ctx.fillRect(cx - bw / 2 - 4, base - h * 0.205, bw + 8, h * 0.012);
        for (let i = -1; i <= 1; i++) {
          const x = cx + i * bw * 0.3, y = base - h * 0.15;
          ctx.fillStyle = m.night || m.rest ? '#f2d27a' : '#5a7a9a';
          ctx.beginPath(); ctx.moveTo(x - 9, y + h * 0.06); ctx.lineTo(x - 9, y); ctx.arc(x, y, 9, Math.PI, 0); ctx.lineTo(x + 9, y + h * 0.06); ctx.fill();
        }
        /* 大卫之星 */
        const sx = cx, sy = base - h * 0.27, r = w * 0.03;
        ctx.strokeStyle = '#2f5aa0'; ctx.lineWidth = 2.5;
        [0, Math.PI].forEach(o => { ctx.beginPath(); for (let k = 0; k < 3; k++) { const a = o - Math.PI / 2 + k * 2 * Math.PI / 3; ctx[k ? 'lineTo' : 'moveTo'](sx + Math.cos(a) * r, sy + Math.sin(a) * r); } ctx.closePath(); ctx.stroke(); });
        ctx.fillStyle = '#e8d8b0'; K.poly(ctx, [[cx - bw * 0.15, base - h * 0.2], [cx, base - h * 0.3], [cx + bw * 0.15, base - h * 0.2]], '#e2d0a6');
        ctx.beginPath(); ctx.arc(sx, sy, r * 1.25, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(47,90,160,.5)'; ctx.lineWidth = 1; ctx.stroke();
        /* 门与门柱圣卷 */
        ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(cx - w * 0.045, base); ctx.lineTo(cx - w * 0.045, base - h * 0.07); ctx.arc(cx, base - h * 0.07, w * 0.045, Math.PI, 0); ctx.lineTo(cx + w * 0.045, base); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#b8862b'; ctx.save(); ctx.translate(cx + w * 0.055, base - h * 0.06); ctx.rotate(0.3); ctx.fillRect(-2, -8, 4, 16); ctx.restore();
        K.hit('spot', 'mezuzah', cx + w * 0.05, base - h * 0.05, Math.max(26, w * 0.06));
        K.tree(ctx, w * 0.12, h * 0.76, h * 0.16, 'olive', m, t);
        K.tree(ctx, w * 0.9, h * 0.74, h * 0.18, 'cypress', m, t);
      },
      lights(ctx, w, h, m, K, t) {
        if (m.rest) { [0.47, 0.53].forEach(x => K.flame(ctx, w * x, h * 0.62, 4, t)); K.glow(ctx, w * 0.5, h * 0.62, h * 0.06, 'rgba(255,210,140,.45)', t); }
        else if (m.night) K.glow(ctx, w * 0.5, h * 0.62, h * 0.05, 'rgba(255,210,140,.35)', t);
      },
    },
  });
})();
