/*
 * 犹太教包（街区会堂与安息日）：内测预览，只做知识与文化。
 * 规则：神名写作 ה׳（不写四字神名），不用机器朗读；安息日（周五日落到周六入夜）游戏里不干活；
 * 不模拟祷告仪式；节日用 Intl 的希伯来历推算。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'judaism.shabbat';
  T.addPack({
    id: ID,
    family: 'judaism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-he-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'he', state: 'ok' }, { id: 'he-latn', state: 'ok' }, { id: 'he-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.he', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'he-both', translation: 'zh-CN', voice: 'ref.he' },
    notice: ['notice.he.experience', 'notice.he.knowledge', 'notice.he.name', 'notice.he.shabbat'],
    previewBody: 'preview.body.he',
    calendar: {
      tz: 'Asia/Jerusalem',
      note: 'cal.note.he',
      hebrew: [
        { id: 'obs.he.roshHashanah', month: 'Tishri', day: 1 }, { id: 'obs.he.yomKippur', month: 'Tishri', day: 10 },
        { id: 'obs.he.sukkot', month: 'Tishri', day: 15 }, { id: 'obs.he.simchatTorah', month: 'Tishri', day: 22 },
        { id: 'obs.he.hanukkah', month: 'Kislev', day: 25 }, { id: 'obs.he.tuBishvat', month: 'Shevat', day: 15 },
        { id: 'obs.he.purim', months: ['Adar', 'Adar II'], day: 14 }, { id: 'obs.he.pesach', month: 'Nisan', day: 15 },
        { id: 'obs.he.shavuot', month: 'Sivan', day: 6 }, { id: 'obs.he.tishaBav', month: 'Av', day: 9 },
      ],
    },
    review: { advisor: null, nativeReview: { he: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, knowledgeOnly: true, divineName: 'abbreviated', noTTS: true, restOnShabbat: true },
    voices: {
      'ref.he': {
        kind: 'reference', file: 'audio/judaism-shema.m4a', license: 'CC0', performer: 'J-J Tilsen (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shema1j.ogg',
      },
      'ref.shofar': {
        kind: 'reference', file: 'audio/judaism-shofar.m4a', license: 'CC BY-SA 3.0', performer: 'Tfursten (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:4_sjofar_tonen.ogg',
      },
    },
  }, {
    'zh-CN': {
      'version.judaism.shabbat.name': '犹太教 · 街区会堂与安息日',
      'version.judaism.shabbat.place': '会堂小院',
      'version.judaism.shabbat.region': '耶路撒冷的老街区（犹太社区遍及全球）',
      'version.judaism.shabbat.note': '只做知识与文化：安息日、门柱圣卷、施舍盒、羊角号',
      'opt.content.he': '希伯来文',
      'opt.content.he-latn': '拉丁转写',
      'opt.content.he-both': '希伯来文 + 转写',
      'voice.ref.he': '参考录音',
      'voice.ref.he.note': '《示玛》CC0（J-J Tilsen），羊角号 CC BY-SA 3.0（Tfursten）；非本产品录制',
      'notice.he.experience': '这是文化体验，不代表任何会堂或犹太教派别，也不承诺任何宗教效果。',
      'notice.he.knowledge': '这一版只做知识与文化：不模拟祷告和仪式，只在知识卡片里说明。',
      'notice.he.name': '按犹太传统，神的名字写作 ה׳（Hashem），转写为 Adonai；不用机器朗读经文。',
      'notice.he.shabbat': '安息日（周五日落到周六入夜，按耶路撒冷时间估算）游戏里不干活，只能休息、阅读。',
      'preview.body.he': '犹太教版本由 AI 根据公开资料起草，没有经过拉比或学者审核，希伯来文也没有经过母语者校对。转写、译文、说明可能有错，不代表任何会堂或派别。',
      'cal.note.he': '节日按希伯来历推算；犹太节日从前一天日落开始，这里写的是白天那一天。以色列与海外的个别节日天数不同。',
      'obs.he.roshHashanah': '犹太新年（Rosh Hashanah）',
      'obs.he.yomKippur': '赎罪日（Yom Kippur）',
      'obs.he.sukkot': '住棚节（Sukkot）',
      'obs.he.simchatTorah': '圣会节 / 欢庆托拉节',
      'obs.he.hanukkah': '光明节（Hanukkah）第一天',
      'obs.he.tuBishvat': '树木新年（Tu BiShvat）',
      'obs.he.purim': '普珥节（Purim）',
      'obs.he.pesach': '逾越节（Pesach）',
      'obs.he.shavuot': '七七节（Shavuot）',
      'obs.he.tishaBav': '圣殿被毁纪念日（Tisha B’Av）',
      'rest.shabbat': '安息日',
    },
    en: {
      'version.judaism.shabbat.name': 'Judaism · a neighbourhood synagogue and Shabbat',
      'version.judaism.shabbat.place': 'Synagogue Courtyard',
      'version.judaism.shabbat.region': 'An old Jerusalem neighbourhood (Jewish communities are worldwide)',
      'version.judaism.shabbat.note': 'Knowledge and culture only: Shabbat, the mezuzah, the tzedakah box, the shofar',
      'opt.content.he': 'Hebrew',
      'opt.content.he-latn': 'Transliteration',
      'opt.content.he-both': 'Hebrew + transliteration',
      'voice.ref.he': 'Reference recordings',
      'voice.ref.he.note': 'Shema CC0 (J-J Tilsen), shofar CC BY-SA 3.0 (Tfursten); not recorded by us',
      'notice.he.experience': 'This is a cultural experience. It does not represent any synagogue or Jewish movement and promises no spiritual result.',
      'notice.he.knowledge': 'This version covers knowledge and culture only: prayers and rituals are never simulated, only described on cards.',
      'notice.he.name': 'Following Jewish custom, God’s name is written ה׳ (Hashem) and transliterated Adonai; Scripture is never read by a machine voice.',
      'notice.he.shabbat': 'On Shabbat (Friday sunset to Saturday nightfall, estimated for Jerusalem) there is no work in the game; you can only rest and read.',
      'preview.body.he': 'The Jewish version was drafted by AI from public sources. No rabbi or scholar has reviewed it and the Hebrew has not been checked by a native speaker. Transliteration, translations and notes may be wrong. It represents no synagogue or movement.',
      'cal.note.he': 'Festivals follow the Hebrew calendar; Jewish days begin at sunset the evening before, and the day shown is the daytime. A few festivals differ in length in Israel and abroad.',
      'obs.he.roshHashanah': 'Rosh Hashanah',
      'obs.he.yomKippur': 'Yom Kippur',
      'obs.he.sukkot': 'Sukkot',
      'obs.he.simchatTorah': 'Shemini Atzeret / Simchat Torah',
      'obs.he.hanukkah': 'Hanukkah (first day)',
      'obs.he.tuBishvat': 'Tu BiShvat',
      'obs.he.purim': 'Purim',
      'obs.he.pesach': 'Pesach (Passover)',
      'obs.he.shavuot': 'Shavuot',
      'obs.he.tishaBav': 'Tisha B’Av',
      'rest.shabbat': 'Shabbat',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
