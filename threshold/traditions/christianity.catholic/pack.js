/*
 * 天主教包（堂区小教堂）：内测预览。圣水与画十字、点许愿烛、玫瑰经计数、拉丁文经文、三钟经的钟声，
 * 教会年历（复活节按算法推算）。不画耶稣、圣母和圣人像；不模拟弥撒和圣事。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'christianity.catholic';
  T.addPack({
    id: ID,
    family: 'christianity',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-cath-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'la', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'ok' }],
      voice: [{ id: 'ref.la', state: 'ok' }, { id: 'sys.la', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'la', translation: 'zh-CN', voice: 'ref.la' },
    notice: ['notice.cath.experience', 'notice.cath.sacraments', 'notice.cath.etiquette', 'notice.cath.practice'],
    previewBody: 'preview.body.cath',
    calendar: {
      tz: 'Europe/Rome',
      note: 'cal.note.cath',
      rel: [
        { id: 'obs.cath.ash', base: 'easter', offset: -46 }, { id: 'obs.cath.palm', base: 'easter', offset: -7 },
        { id: 'obs.cath.goodFriday', base: 'easter', offset: -2 }, { id: 'obs.cath.easter', base: 'easter', offset: 0 },
        { id: 'obs.cath.ascension', base: 'easter', offset: 39 }, { id: 'obs.cath.pentecost', base: 'easter', offset: 49 },
      ],
      yearly: [
        { id: 'obs.cath.epiphany', md: '01-06' }, { id: 'obs.cath.assumption', md: '08-15' }, { id: 'obs.cath.francis', md: '10-04' },
        { id: 'obs.cath.allSaints', md: '11-01' }, { id: 'obs.cath.christmas', md: '12-25' },
      ],
    },
    review: { advisor: null, nativeReview: { la: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['no-images-of-christ-or-saints'], noSacraments: true },
    voices: {
      'ref.la': {
        kind: 'reference', file: 'audio/catholic-ave-maria.m4a', license: 'CC BY-SA 3.0', performer: 'Schola Gregoriana (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg',
      },
      'ref.la.pater': {
        kind: 'reference', file: 'audio/catholic-pater-noster.m4a', license: 'CC0', performer: 'Dan Palraz (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pater-Noster.ogg',
      },
      'ref.bells': {
        kind: 'reference', file: 'audio/church-bells.m4a', license: 'Public domain', performer: 'natalie (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Church_bells_-_Leverkusen,_2007.oga',
      },
      'sys.la': { kind: 'system', style: 'latin', tts: { lang: 'it-IT', rate: 0.8 } },
    },
  }, {
    'zh-CN': {
      'version.christianity.catholic.name': '天主教 · 堂区小教堂',
      'version.christianity.catholic.place': '堂区小教堂',
      'version.christianity.catholic.region': '意大利乡间（天主教会遍及全球）',
      'version.christianity.catholic.note': '圣水与画十字、许愿烛、玫瑰经、拉丁文经文、三钟经',
      'opt.content.la': '拉丁文',
      'voice.ref.la': '格里高利圣咏参考录音',
      'voice.ref.la.note': '《圣母经》CC BY-SA 3.0（Schola Gregoriana），《天主经》CC0；非本产品录制',
      'voice.sys.la': '设备朗读（意大利语语音读拉丁文）',
      'voice.sys.la.note': '没有拉丁语语音，用意大利语语音近似教会拉丁文的读法',
      'notice.cath.experience': '这是文化体验，不代表任何教区或修会，也不承诺任何宗教效果。',
      'notice.cath.sacraments': '不模拟弥撒、告解、领圣体等圣事；这些只在知识卡片里介绍。',
      'notice.cath.etiquette': '进堂时衣着得体、手机静音；不画耶稣、圣母和圣人像。',
      'notice.cath.practice': '画十字、点烛、念玫瑰经和祈祷只记在功课簿里，不产出任何可花的东西；照顾猫狗用的面包来自打理教堂花园。',
      'preview.body.cath': '天主教版本由 AI 根据公开资料起草，没有经过神父或神学者审核。经文用拉丁文通行本，中文译文为 AI 起草，可能有错，不代表任何教区。',
      'cal.note.cath': '复活节及相关节日按格里高利历算法推算；固定节日按罗马礼通用历。各国主教团可能把部分节日移到主日。',
      'obs.cath.ash': '圣灰礼仪日（四旬期开始）',
      'obs.cath.palm': '圣枝主日',
      'obs.cath.goodFriday': '耶稣受难日',
      'obs.cath.easter': '复活节',
      'obs.cath.ascension': '耶稣升天节',
      'obs.cath.pentecost': '圣神降临节',
      'obs.cath.epiphany': '主显节',
      'obs.cath.assumption': '圣母升天节',
      'obs.cath.francis': '圣方济各纪念日（为动物祝福）',
      'obs.cath.allSaints': '诸圣节',
      'obs.cath.christmas': '圣诞节',
    },
    en: {
      'version.christianity.catholic.name': 'Catholic Christianity · a parish church',
      'version.christianity.catholic.place': 'Parish Church',
      'version.christianity.catholic.region': 'Rural Italy (the Catholic Church is worldwide)',
      'version.christianity.catholic.note': 'Holy water and the sign of the cross, votive candles, the rosary, Latin prayers, the Angelus',
      'opt.content.la': 'Latin',
      'voice.ref.la': 'Gregorian chant reference recordings',
      'voice.ref.la.note': 'Ave Maria CC BY-SA 3.0 (Schola Gregoriana), Pater Noster CC0; not recorded by us',
      'voice.sys.la': 'Device voice (Italian voice reading Latin)',
      'voice.sys.la.note': 'No Latin voice exists; an Italian voice approximates ecclesiastical Latin',
      'notice.cath.experience': 'This is a cultural experience. It does not represent any parish or order and promises no spiritual result.',
      'notice.cath.sacraments': 'Mass, confession, communion and the other sacraments are never simulated; they are only described on knowledge cards.',
      'notice.cath.etiquette': 'Dress modestly and silence your phone in church. No images of Christ, Mary or the saints are drawn.',
      'notice.cath.practice': 'The sign of the cross, candles, the rosary and prayers are only noted in the practice book and produce nothing to spend. The bread for the cats and dogs comes from tending the church garden.',
      'preview.body.cath': 'The Catholic version was drafted by AI from public sources. No priest or theologian has reviewed it. Prayers use the standard Latin texts; the Chinese translations are AI drafts and may be wrong. It represents no parish.',
      'cal.note.cath': 'Easter and the feasts that depend on it are computed with the Gregorian algorithm; fixed feasts follow the General Roman Calendar. Bishops’ conferences may move some feasts to a Sunday.',
      'obs.cath.ash': 'Ash Wednesday (Lent begins)',
      'obs.cath.palm': 'Palm Sunday',
      'obs.cath.goodFriday': 'Good Friday',
      'obs.cath.easter': 'Easter Sunday',
      'obs.cath.ascension': 'Ascension',
      'obs.cath.pentecost': 'Pentecost',
      'obs.cath.epiphany': 'Epiphany',
      'obs.cath.assumption': 'Assumption of Mary',
      'obs.cath.francis': 'St Francis of Assisi (blessing of animals)',
      'obs.cath.allSaints': 'All Saints',
      'obs.cath.christmas': 'Christmas',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
