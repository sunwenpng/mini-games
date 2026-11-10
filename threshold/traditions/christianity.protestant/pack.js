/*
 * 新教包（社区教会）：内测预览。新教宗派很多，这一版是一座北美小镇风格的社区教会：
 * 主日礼拜的流程、圣诗、读经（英王钦定本与中文和合本，均为公有领域）、教会的食物站（招待模式）。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'christianity.protestant';
  T.addPack({
    id: ID,
    family: 'christianity',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-prot-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'en-kjv', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'ok' }],
      voice: [{ id: 'ref.prot', state: 'ok' }, { id: 'sys.prot', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'en-kjv', translation: 'zh-CN', voice: 'ref.prot' },
    notice: ['notice.prot.experience', 'notice.prot.diversity', 'notice.prot.pantry', 'notice.prot.practice'],
    previewBody: 'preview.body.prot',
    calendar: {
      tz: 'America/New_York',
      note: 'cal.note.prot',
      rel: [
        { id: 'obs.prot.palm', base: 'easter', offset: -7 }, { id: 'obs.prot.goodFriday', base: 'easter', offset: -2 },
        { id: 'obs.prot.easter', base: 'easter', offset: 0 }, { id: 'obs.prot.pentecost', base: 'easter', offset: 49 },
      ],
      yearly: [{ id: 'obs.prot.reformation', md: '10-31' }, { id: 'obs.prot.christmasEve', md: '12-24' }, { id: 'obs.prot.christmas', md: '12-25' }],
    },
    review: { advisor: null, nativeReview: { en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['no-images-of-christ'], noSacraments: true },
    voices: {
      'ref.prot': {
        kind: 'reference', file: 'audio/protestant-amazing-grace.m4a', license: 'Public domain', performer: 'Original Sacred Harp Choir, 1922 (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amazing_grace_1922.ogg',
      },
      'sys.prot': { kind: 'system', style: 'clear', tts: { lang: 'en-GB', rate: 0.9 } },
    },
  }, {
    'zh-CN': {
      'version.christianity.protestant.name': '新教 · 小镇社区教会',
      'version.christianity.protestant.place': '社区教会',
      'version.christianity.protestant.region': '北美小镇（新教遍及全球）',
      'version.christianity.protestant.note': '主日礼拜、圣诗、读经、教会食物站',
      'opt.content.en-kjv': '英文（英王钦定本，1611）',
      'voice.ref.prot': '《奇异恩典》参考录音（1922 年圣诗合唱）',
      'voice.ref.prot.note': '公有领域，Original Sacred Harp Choir；非本产品录制；只有这首圣诗有录音',
      'voice.sys.prot': '设备朗读（英语）',
      'voice.sys.prot.note': '设备自带的英语语音',
      'notice.prot.experience': '这是文化体验，不代表任何教会或宗派，也不承诺任何宗教效果。',
      'notice.prot.diversity': '新教宗派众多（路德宗、圣公会、长老会、浸信会、卫理公会、五旬节派等），礼拜方式差别很大。这一版只是一座小镇社区教会。',
      'notice.prot.pantry': '整理捐来的食物会做成食物包，只用来分给来食物站的人。',
      'notice.prot.practice': '礼拜、唱诗、读经只记在功课簿里，不产出任何可花的东西；不模拟圣餐和洗礼。',
      'preview.body.prot': '新教版本由 AI 根据公开资料起草，没有经过牧师或学者审核。经文用公有领域的英王钦定本和中文和合本，其他说明可能有错，不代表任何教会。',
      'cal.note.prot': '复活节按格里高利历算法推算；各宗派对节期的重视程度不同。',
      'obs.prot.palm': '棕枝主日',
      'obs.prot.goodFriday': '受难节',
      'obs.prot.easter': '复活节',
      'obs.prot.pentecost': '五旬节（圣灵降临节）',
      'obs.prot.reformation': '宗教改革纪念日',
      'obs.prot.christmasEve': '平安夜',
      'obs.prot.christmas': '圣诞节',
    },
    en: {
      'version.christianity.protestant.name': 'Protestant Christianity · a small-town church',
      'version.christianity.protestant.place': 'Community Church',
      'version.christianity.protestant.region': 'Small-town North America (Protestantism is worldwide)',
      'version.christianity.protestant.note': 'Sunday worship, hymns, Scripture reading, the church food pantry',
      'opt.content.en-kjv': 'English (King James Version, 1611)',
      'voice.ref.prot': 'Amazing Grace reference recording (1922 hymn choir)',
      'voice.ref.prot.note': 'Public domain, Original Sacred Harp Choir; not recorded by us; only this hymn has a recording',
      'voice.sys.prot': 'Device voice (English)',
      'voice.sys.prot.note': 'The device’s English voice',
      'notice.prot.experience': 'This is a cultural experience. It does not represent any church or denomination and promises no spiritual result.',
      'notice.prot.diversity': 'There are many Protestant traditions (Lutheran, Anglican, Presbyterian, Baptist, Methodist, Pentecostal and more) and their worship differs widely. This is just one small-town community church.',
      'notice.prot.pantry': 'Sorting donated food makes food boxes, which are only for the people who come to the pantry.',
      'notice.prot.practice': 'Worship, hymns and Bible reading are only noted in the practice book and produce nothing to spend; communion and baptism are never simulated.',
      'preview.body.prot': 'The Protestant version was drafted by AI from public sources. No pastor or scholar has reviewed it. Scripture uses the public-domain King James Version and Chinese Union Version; other notes may be wrong. It represents no church.',
      'cal.note.prot': 'Easter is computed with the Gregorian algorithm; denominations differ in how much they keep the church year.',
      'obs.prot.palm': 'Palm Sunday',
      'obs.prot.goodFriday': 'Good Friday',
      'obs.prot.easter': 'Easter',
      'obs.prot.pentecost': 'Pentecost',
      'obs.prot.reformation': 'Reformation Day',
      'obs.prot.christmasEve': 'Christmas Eve',
      'obs.prot.christmas': 'Christmas',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
