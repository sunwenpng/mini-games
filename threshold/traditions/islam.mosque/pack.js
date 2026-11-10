/*
 * 伊斯兰教包（街区清真寺的庭院）：内测预览，只做知识与文化。
 * 规则：不模拟礼拜（礼拜动作只在知识卡片里说明）；不画任何先知与人物形象；《古兰经》不用机器朗读，只配历史录音；
 * 伊斯兰历节日用 Intl 的 umalqura 历推算，一律标“估算”（实际以当地见月为准）。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'islam.mosque';
  T.addPack({
    id: ID,
    family: 'islam',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-isl-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'ar', state: 'ok' }, { id: 'ar-latn', state: 'ok' }, { id: 'ar-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'ok' }],
      voice: [{ id: 'ref.ar', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'ar-both', translation: 'zh-CN', voice: 'ref.ar' },
    notice: ['notice.isl.experience', 'notice.isl.knowledge', 'notice.isl.images', 'notice.isl.quran'],
    previewBody: 'preview.body.isl',
    calendar: {
      tz: 'Europe/Istanbul',
      note: 'cal.note.isl',
      islamic: [
        { id: 'obs.isl.newYear', month: 1, day: 1 }, { id: 'obs.isl.ashura', month: 1, day: 10 }, { id: 'obs.isl.mawlid', month: 3, day: 12 },
        { id: 'obs.isl.miraj', month: 7, day: 27 }, { id: 'obs.isl.ramadan', month: 9, day: 1 }, { id: 'obs.isl.qadr', month: 9, day: 27 },
        { id: 'obs.isl.fitr', month: 10, day: 1 }, { id: 'obs.isl.arafah', month: 12, day: 9 }, { id: 'obs.isl.adha', month: 12, day: 10 },
      ],
    },
    review: { advisor: null, nativeReview: { ar: null, tr: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, knowledgeOnly: true, noSimulatedPrayer: true, depictions: ['no-figures'], noTTS: true },
    voices: {
      'ref.ar': {
        kind: 'reference', file: 'audio/islam-adhan.m4a', license: 'CC0', performer: 'Aishatu98 (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Adhan.ogg',
      },
    },
  }, {
    'zh-CN': {
      'version.islam.mosque.name': '伊斯兰教 · 街区清真寺',
      'version.islam.mosque.place': '清真寺庭院',
      'version.islam.mosque.region': '土耳其 · 伊斯坦布尔的老街区（伊斯兰教遍及全球）',
      'version.islam.mosque.note': '只做知识与文化：宣礼、斋月开斋、书法、清真寺的猫',
      'opt.content.ar': '阿拉伯文',
      'opt.content.ar-latn': '拉丁转写',
      'opt.content.ar-both': '阿拉伯文 + 转写',
      'voice.ref.ar': '宣礼参考录音',
      'voice.ref.ar.note': 'CC0 公有领域，非本产品录制；只有宣礼有录音，《古兰经》经文只显示文字',
      'notice.isl.experience': '这是文化体验，不代表任何清真寺、教法学派或团体，也不承诺任何宗教效果。',
      'notice.isl.knowledge': '这一版只做知识与文化：不模拟礼拜，礼拜的动作只在知识卡片里说明。',
      'notice.isl.images': '游戏里不画任何先知和人物的形象；清真寺内部不画。',
      'notice.isl.quran': '《古兰经》经文只在阅读情境出现，不用机器朗读，也不配录音；译文只是对意思的解释。',
      'preview.body.isl': '伊斯兰教版本由 AI 根据公开资料起草，没有经过伊玛目或伊斯兰学者审核，阿拉伯文也没有经过母语者校对。转写、译文、说明和节日日期都可能有错，不代表任何清真寺。',
      'cal.note.isl': '伊斯兰历是纯阴历，月初以见新月为准，这里按乌姆古拉历推算，各地可能差一两天。',
      'obs.isl.newYear': '伊斯兰新年',
      'obs.isl.ashura': '阿舒拉日',
      'obs.isl.mawlid': '圣纪（部分穆斯林纪念）',
      'obs.isl.miraj': '登霄夜',
      'obs.isl.ramadan': '斋月开始',
      'obs.isl.qadr': '盖德尔夜（常在斋月第 27 夜）',
      'obs.isl.fitr': '开斋节',
      'obs.isl.arafah': '阿拉法特日',
      'obs.isl.adha': '古尔邦节（宰牲节）',
    },
    en: {
      'version.islam.mosque.name': 'Islam · a neighbourhood mosque',
      'version.islam.mosque.place': 'Mosque Courtyard',
      'version.islam.mosque.region': 'Türkiye · an old Istanbul neighbourhood (Islam is worldwide)',
      'version.islam.mosque.note': 'Knowledge and culture only: the call to prayer, breaking the fast, calligraphy, the mosque cats',
      'opt.content.ar': 'Arabic',
      'opt.content.ar-latn': 'Transliteration',
      'opt.content.ar-both': 'Arabic + transliteration',
      'voice.ref.ar': 'Call to prayer reference recording',
      'voice.ref.ar.note': 'CC0 public domain, not recorded by us; only the adhan has a recording, Qur’anic text is shown as text only',
      'notice.isl.experience': 'This is a cultural experience. It does not represent any mosque, school of law or community and promises no spiritual result.',
      'notice.isl.knowledge': 'This version covers knowledge and culture only: prayer is never simulated; its movements are only described on knowledge cards.',
      'notice.isl.images': 'No prophets or human figures are drawn; the inside of the mosque is not drawn.',
      'notice.isl.quran': 'Qur’anic text appears only for reading, with no machine voice and no recording. Translations only convey meaning.',
      'preview.body.isl': 'The Islam version was drafted by AI from public sources. No imam or Islamic scholar has reviewed it and the Arabic has not been checked by a native speaker. Transliteration, translations, notes and dates may be wrong. It represents no mosque.',
      'cal.note.isl': 'The Islamic calendar is purely lunar and months begin with the sighting of the new moon; dates here follow the Umm al-Qura calendar and may differ locally by a day or two.',
      'obs.isl.newYear': 'Islamic New Year',
      'obs.isl.ashura': 'Ashura',
      'obs.isl.mawlid': 'Mawlid (observed by many Muslims)',
      'obs.isl.miraj': 'Isra and Mi‘raj',
      'obs.isl.ramadan': 'Ramadan begins',
      'obs.isl.qadr': 'Laylat al-Qadr (often the 27th night)',
      'obs.isl.fitr': 'Eid al-Fitr',
      'obs.isl.arafah': 'Day of Arafah',
      'obs.isl.adha': 'Eid al-Adha',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
