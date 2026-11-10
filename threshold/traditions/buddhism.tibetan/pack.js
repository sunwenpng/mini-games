/*
 * 藏传佛教包（转经院）：内测预览。和汉传、泰国都不同：转经轮、绕寺（转经）、酥油灯与七供水、哈达、等身长头的礼拜，
 * 藏文与转写并列，藏历节日（新年、萨嘎达瓦等）。无广告，不画活佛与上师像，殿内佛像不可点击。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'buddhism.tibetan';
  T.addPack({
    id: ID,
    family: 'buddhism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-bo-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'bo-Tibt', state: 'ok' }, { id: 'bo-Latn', state: 'ok' }, { id: 'bo-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.bo', state: 'ok' }, { id: 'sys.bo', state: 'ok', why: 'why.boVoice' }],
    },
    defaults: { ui: 'zh-CN', content: 'bo-both', translation: 'zh-CN', voice: 'ref.bo' },
    notice: ['notice.bo.experience', 'notice.bo.clockwise', 'notice.bo.images', 'notice.bo.practice'],
    previewBody: 'preview.body.bo',
    calendar: {
      tz: 'Asia/Shanghai',
      note: 'cal.note.bo',
      fixed: [
        { id: 'obs.bo.losar', date: '2026-02-18' },
        { id: 'obs.bo.sagaDawa', date: '2026-05-31' },
        { id: 'obs.bo.losar', date: '2027-02-07' },
        { id: 'obs.bo.chotrul', date: '2027-02-20' },
        { id: 'obs.bo.sagaDawa', date: '2027-06-18' },
        { id: 'obs.bo.lhabab', date: '2027-11-20', approx: true },
      ],
      /* 每月初十（莲师日）、十五（满月）、廿五（空行母日）按农历日估算；藏历与农历常差一天，偶尔差一个月。 */
      lunarDays: [
        { id: 'obs.bo.guru', day: 10, approx: true },
        { id: 'obs.bo.full', day: 15, approx: true },
        { id: 'obs.bo.dakini', day: 25, approx: true },
      ],
      sources: ['https://tnp.org/important-tibetan-buddhist-holidays-in-2026/', 'https://www.potalastore.com/blog/2027-tibetan-buddhist-calendar-dates/'],
    },
    review: { advisor: null, nativeReview: { bo: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['buddha-image-not-interactive', 'no-lama-portraits'], clockwise: true },
    voices: {
      'ref.bo': {
        kind: 'reference', file: 'audio/tibetan-om-mani.m4a', license: 'CC0', performer: 'Saimmx (Wikimedia Commons), recorded at Dingjue Temple, Changhua, Taiwan',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:20260602_145912_Dingjue_Om_mani_padme_hum.ogg',
      },
      'ref.bo.gyuto': {
        kind: 'reference', file: 'audio/tibetan-gyuto.m4a', license: 'CC BY 4.0', performer: 'Samuel Corwin (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Samuel_Corwin_-_09_-_Tibetan_Monks_Chanting_at_Gyuto_Branch_Monastery_House_No_422_McLeod_Ganj.ogg',
      },
      'sys.bo': { kind: 'system', style: 'tibetan', tts: { lang: 'bo', rate: 0.8 } },
    },
  }, {
    'zh-CN': {
      'version.buddhism.tibetan.name': '藏传佛教',
      'version.buddhism.tibetan.place': '转经院',
      'version.buddhism.tibetan.region': '青藏高原、喜马拉雅地区',
      'version.buddhism.tibetan.note': '转经轮、绕寺、酥油灯与七供水、六字真言',
      'opt.content.bo-Tibt': '藏文',
      'opt.content.bo-Latn': '藏文拉丁转写',
      'opt.content.bo-both': '藏文 + 转写',
      'voice.ref.bo': '六字真言参考录音',
      'voice.ref.bo.note': 'CC0 公有领域，非本产品录制，录于台湾彰化定觉寺（汉传寺院的念法）；只有六字真言有录音',
      'voice.sys.bo': '设备朗读',
      'voice.sys.bo.note': '大多数设备没有藏语语音，会只显示文字',
      'why.boVoice': '大多数设备没有藏语朗读语音',
      'notice.bo.experience': '这是文化体验，不代表任何寺院、上师或传承，也不承诺任何宗教效果。',
      'notice.bo.clockwise': '转经轮、绕寺都按顺时针方向；寺里不要用手指指佛像，不要跨过经书和法器。',
      'notice.bo.images': '游戏里不画活佛和上师像；殿内佛像只作远景，不可点击。',
      'notice.bo.practice': '礼拜、转经、供灯、诵读只记在功课簿里，不产出任何可花的东西；照顾动物用的糌粑来自打扫院子。',
      'preview.body.bo': '藏传佛教版本由 AI 根据公开资料起草，没有经过藏传佛教僧人或学者审核，藏文也没有经过母语者校对。经文写法、转写、译文、礼仪说明和节日日期都可能有错。它用来检验平台能不能承载藏传传统，不代表任何寺院。',
      'cal.note.bo': '新年、萨嘎达瓦等大节按公开的藏历日历；每月初十、十五、廿五按农历估算，可能差一天。以当地寺院为准。',
      'obs.bo.losar': '藏历新年（洛萨）',
      'obs.bo.sagaDawa': '萨嘎达瓦节（佛陀诞生、成道、涅槃）',
      'obs.bo.chotrul': '神变节（酥油灯节）',
      'obs.bo.lhabab': '天降节',
      'obs.bo.guru': '莲师日（初十）',
      'obs.bo.full': '满月（十五）',
      'obs.bo.dakini': '空行母日（廿五）',
    },
    en: {
      'version.buddhism.tibetan.name': 'Tibetan Buddhism',
      'version.buddhism.tibetan.place': 'Kora Courtyard',
      'version.buddhism.tibetan.region': 'Tibetan Plateau and the Himalaya',
      'version.buddhism.tibetan.note': 'Prayer wheels, kora, butter lamps and water bowls, Om mani padme hum',
      'opt.content.bo-Tibt': 'Tibetan script',
      'opt.content.bo-Latn': 'Romanized Tibetan',
      'opt.content.bo-both': 'Tibetan + romanized',
      'voice.ref.bo': 'Om mani padme hum reference recording',
      'voice.ref.bo.note': 'CC0 public domain, not recorded by us; recorded at Dingjue Temple, Taiwan (a Chinese Buddhist rendering); only the mantra has a recording',
      'voice.sys.bo': 'Device voice',
      'voice.sys.bo.note': 'Most devices have no Tibetan voice and will show text only',
      'why.boVoice': 'Most devices have no Tibetan text-to-speech voice',
      'notice.bo.experience': 'This is a cultural experience. It does not represent any monastery, teacher or lineage and promises no spiritual result.',
      'notice.bo.clockwise': 'Prayer wheels and kora always go clockwise. Do not point at images with a finger, and do not step over texts or ritual objects.',
      'notice.bo.images': 'No portraits of lamas or teachers are drawn. Images in the hall are background only and cannot be tapped.',
      'notice.bo.practice': 'Prostrations, wheel turning, lamp offerings and recitation are only noted in the practice book and produce nothing to spend. The tsampa for the animals comes from sweeping the courtyard.',
      'preview.body.bo': 'The Tibetan Buddhist version was drafted by AI from public sources. No Tibetan monastic or scholar has reviewed it, and the Tibetan text has not been checked by a native speaker. Spelling, transliteration, translations, etiquette notes and dates may be wrong. It tests whether the platform can carry the Tibetan tradition and does not represent any monastery.',
      'cal.note.bo': 'Losar, Saga Dawa and other great days follow published Tibetan calendars; the 10th, 15th and 25th of each month are estimated from the Chinese lunar calendar and may be a day off. Follow the local monastery.',
      'obs.bo.losar': 'Losar (Tibetan New Year)',
      'obs.bo.sagaDawa': 'Saga Dawa Düchen (birth, awakening and parinirvāṇa)',
      'obs.bo.chotrul': 'Chötrul Düchen (butter lamp festival)',
      'obs.bo.lhabab': 'Lhabab Düchen',
      'obs.bo.guru': 'Guru Rinpoche day (10th)',
      'obs.bo.full': 'Full moon (15th)',
      'obs.bo.dakini': 'Ḍākinī day (25th)',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
