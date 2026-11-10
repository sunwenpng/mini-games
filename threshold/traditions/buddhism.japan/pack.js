/*
 * 日本佛教包（禅寺の庭）：内测预览。日本佛教宗派差别很大，这一版只做禅宗（曹洞宗风格）的小寺：
 * 枯山水耙沙、坐禅、梵钟、线香，日文汉字与罗马字读经。其他宗派（净土真宗、日莲宗等）以后分开做。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'buddhism.japan';
  T.addPack({
    id: ID,
    family: 'buddhism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-ja-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'ja-Jpan', state: 'ok' }, { id: 'ja-Latn', state: 'ok' }, { id: 'ja-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.ja', state: 'ok' }, { id: 'sys.ja', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'ja-both', translation: 'zh-CN', voice: 'ref.ja' },
    notice: ['notice.ja.experience', 'notice.ja.school', 'notice.ja.etiquette', 'notice.ja.practice'],
    previewBody: 'preview.body.ja',
    calendar: {
      tz: 'Asia/Tokyo',
      note: 'cal.note.ja',
      yearly: [
        { id: 'obs.ja.shusho', md: '01-01' },
        { id: 'obs.ja.nehan', md: '02-15' },
        { id: 'obs.ja.hanamatsuri', md: '04-08' },
        { id: 'obs.ja.obon', md: '08-13' },
        { id: 'obs.ja.jodo', md: '12-08' },
        { id: 'obs.ja.joya', md: '12-31' },
      ],
      fixed: [
        { id: 'obs.ja.higanSpring', date: '2026-03-20' }, { id: 'obs.ja.higanAutumn', date: '2026-09-23' },
        { id: 'obs.ja.higanSpring', date: '2027-03-21' }, { id: 'obs.ja.higanAutumn', date: '2027-09-23' },
      ],
    },
    review: { advisor: null, nativeReview: { ja: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['buddha-image-not-interactive'], school: 'soto-zen-style' },
    voices: {
      'ref.ja': {
        kind: 'reference', file: 'audio/japan-heart-sutra.m4a', license: 'CC BY 3.0', performer: 'kennymiyoshi (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Heart_Sutra.oga',
      },
      'ref.ja.bell': {
        kind: 'reference', file: 'audio/japan-bonsho.m4a', license: 'CC BY 2.1 JP', performer: 'Jnn (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bonsyou5599.ogg',
      },
      'sys.ja': { kind: 'system', style: 'japanese', tts: { lang: 'ja-JP', rate: 0.85 } },
    },
  }, {
    'zh-CN': {
      'version.buddhism.japan.name': '日本佛教 · 禅宗',
      'version.buddhism.japan.place': '禅寺小庭',
      'version.buddhism.japan.region': '日本',
      'version.buddhism.japan.note': '枯山水、坐禅、梵钟、日文读经；其他宗派以后分开做',
      'opt.content.ja-Jpan': '日文汉字',
      'opt.content.ja-Latn': '罗马字读音',
      'opt.content.ja-both': '汉字 + 罗马字',
      'voice.ref.ja': '日本寺院《般若心经》参考录音',
      'voice.ref.ja.note': 'CC BY 3.0，演唱者 kennymiyoshi，非本产品录制；只有心经有录音，其他段落退回设备朗读',
      'voice.sys.ja': '设备日语朗读',
      'voice.sys.ja.note': '设备自带的日语语音，不是真人',
      'notice.ja.experience': '这是文化体验，不代表任何寺院或宗派，也不承诺任何宗教效果。',
      'notice.ja.school': '日本佛教各宗派差别很大。这一版按禅宗（曹洞宗风格）的小寺来做，读经与仪式不代表其他宗派。',
      'notice.ja.etiquette': '山门前合掌一礼；本堂里不大声说话；坐禅时不随意走动。',
      'notice.ja.practice': '合掌礼、上香、坐禅、读经只记在功课簿里，不产出任何可花的东西；照顾猫狗用的米来自打理庭院。',
      'preview.body.ja': '日本佛教版本由 AI 根据公开资料起草，没有经过日本僧人或学者审核，日文也没有经过母语者校对。读音、译文、礼仪说明可能有错。它不代表任何寺院。',
      'cal.note.ja': '日本寺院的节日多用公历日期；彼岸按春分、秋分。以当地寺院为准。',
      'obs.ja.shusho': '修正会（新年）',
      'obs.ja.nehan': '涅槃会',
      'obs.ja.hanamatsuri': '花祭（灌佛会）',
      'obs.ja.obon': '盂兰盆（お盆）',
      'obs.ja.jodo': '成道会',
      'obs.ja.joya': '除夜之钟',
      'obs.ja.higanSpring': '春彼岸（中日）',
      'obs.ja.higanAutumn': '秋彼岸（中日）',
    },
    en: {
      'version.buddhism.japan.name': 'Japanese Buddhism · Zen',
      'version.buddhism.japan.place': 'Zen Temple Garden',
      'version.buddhism.japan.region': 'Japan',
      'version.buddhism.japan.note': 'Raked gravel, zazen, the temple bell, sutras in Japanese; other schools to come separately',
      'opt.content.ja-Jpan': 'Japanese (kanji)',
      'opt.content.ja-Latn': 'Rōmaji reading',
      'opt.content.ja-both': 'Kanji + rōmaji',
      'voice.ref.ja': 'Heart Sutra reference recording (Japanese temple)',
      'voice.ref.ja.note': 'CC BY 3.0 by kennymiyoshi, not recorded by us; only the Heart Sutra has a recording, other texts fall back to the device voice',
      'voice.sys.ja': 'Japanese device voice',
      'voice.sys.ja.note': 'The device’s Japanese text-to-speech, not a human',
      'notice.ja.experience': 'This is a cultural experience. It does not represent any temple or school and promises no spiritual result.',
      'notice.ja.school': 'Japanese Buddhist schools differ widely. This version follows a small Zen temple (Sōtō style); its chants and rites do not stand for other schools.',
      'notice.ja.etiquette': 'Bow with joined palms at the gate; keep your voice low in the main hall; do not move about during zazen.',
      'notice.ja.practice': 'Gasshō, incense, zazen and sutra chanting are only noted in the practice book and produce nothing to spend. The rice for the cats and dogs comes from tending the garden.',
      'preview.body.ja': 'The Japanese Buddhist version was drafted by AI from public sources. No Japanese monk or scholar has reviewed it and the Japanese has not been checked by a native speaker. Readings, translations and etiquette notes may be wrong. It does not represent any temple.',
      'cal.note.ja': 'Japanese temples mostly keep Gregorian dates; Higan follows the equinoxes. Follow the local temple.',
      'obs.ja.shusho': 'Shushō-e (New Year)',
      'obs.ja.nehan': 'Nehan-e (parinirvāṇa)',
      'obs.ja.hanamatsuri': 'Hanamatsuri (Buddha’s birthday)',
      'obs.ja.obon': 'Obon',
      'obs.ja.jodo': 'Jōdō-e (awakening)',
      'obs.ja.joya': 'Joya no kane (New Year’s Eve bell)',
      'obs.ja.higanSpring': 'Spring Higan (middle day)',
      'obs.ja.higanAutumn': 'Autumn Higan (middle day)',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
