/*
 * 锡克教 · 谒师所（Gurdwara）：内测预览。由纸面推演（docs/Claude_非寺院型传统纸面推演_锡克教_v1.md）转为可玩版本。
 * 核心是 Seva（无私服务）和 Langar（公共厨房）：资源是“做好的饭”，只用来招待来客，不能花在别处。
 * 规则：《古鲁·格兰特·萨希卜》被视为在世的上师，不出现在任何可点击物里；Gurbani 不用机器朗读；进入要包头、脱鞋。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'sikhism.gurdwara';
  T.addPack({
    id: ID,
    family: 'sikhism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-pa-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      /* 古木基文是文字，不是语言；经典的语言混合了多种中古印度语言。 */
      content: [{ id: 'pa-Guru', state: 'ok' }, { id: 'pa-Latn', state: 'ok' }, { id: 'pa-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.pa', state: 'ok' }, { id: 'own.sikh.kirtan.v1', state: 'off', why: 'why.sikhAdvisor' }],
    },
    defaults: { ui: 'zh-CN', content: 'pa-both', translation: 'zh-CN', voice: 'ref.pa' },
    practices: [
      { id: 'seva.langar', kind: 'service', yields: ['meals-served'], note: '公共厨房帮厨：揉面、烙饼、洗碗、给大家盛饭' },
      { id: 'pangat', kind: 'service', yields: [], note: '所有人不分身份并排坐在地上吃饭' },
      { id: 'darbar.visit', kind: 'practice', yields: [], note: '进入大殿：包头、脱鞋、洗手；不模拟主持仪式' },
      { id: 'kirtan.listen', kind: 'reading', yields: [], note: '只听录音，不用机器朗读' },
    ],
    notice: ['notice.pa.experience', 'notice.pa.entry', 'notice.pa.scripture', 'notice.pa.langar'],
    previewBody: 'preview.body.pa',
    calendar: {
      tz: 'Asia/Kolkata',
      note: 'cal.note.pa',
      fixed: [
        { id: 'obs.pa.vaisakhi', date: '2026-04-14' }, { id: 'obs.pa.bandiChhor', date: '2026-11-08' }, { id: 'obs.pa.guruNanak', date: '2026-11-24' },
        { id: 'obs.pa.vaisakhi', date: '2027-04-14' }, { id: 'obs.pa.bandiChhor', date: '2027-10-29' }, { id: 'obs.pa.guruNanak', date: '2027-11-14', approx: true },
      ],
      sources: ['https://en.wikipedia.org/wiki/Guru_Nanak_Gurpurab', 'https://www.drikpanchang.com/calendars/indian/sikh-festivals/jayanti/guru-nanak-jayanti-date.html'],
    },
    review: { advisor: null, nativeReview: { pa: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: {
      adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, noAnimalRelease: true,
      depictions: ['guru-granth-sahib-not-interactive', 'no-guru-portraits'],
      headCovering: true, contentHandling: 'scripture-requires-reading-context', noTTS: true,
    },
    voices: {
      'ref.pa': {
        kind: 'reference', file: 'audio/sikh-mul-mantar.m4a', license: 'CC BY-SA 4.0', performer: 'Usingh0663 (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_M%C5%ABl_Mantar,_the_opening_verse_of_the_Sikh_scripture,_with_%22Shudh_Ucharan%22.wav',
      },
      'own.sikh.kirtan.v1': { kind: 'owned', file: null, performer: null, license: null, contract: null, scope: null, covers: [], proofreadBy: null },
    },
  }, {
    'zh-CN': {
      'version.sikhism.gurdwara.name': '锡克教 · 谒师所',
      'version.sikhism.gurdwara.place': '公共厨房',
      'version.sikhism.gurdwara.region': '旁遮普 · 全球锡克社区',
      'version.sikhism.gurdwara.note': '无私服务、公共厨房（Langar）、同排用餐、聆听《根本颂》',
      'opt.content.pa-Guru': '古木基文',
      'opt.content.pa-Latn': '拉丁转写',
      'opt.content.pa-both': '古木基文 + 转写',
      'voice.ref.pa': '《根本颂》参考录音',
      'voice.ref.pa.note': 'CC BY-SA 4.0，录音者 Usingh0663，非本产品录制',
      'notice.pa.experience': '这是文化体验，不代表任何谒师所或锡克教团体，也不承诺任何宗教效果。',
      'notice.pa.entry': '进入谒师所要包住头发、脱鞋、洗手；不带烟酒。',
      'notice.pa.scripture': '经典《古鲁·格兰特·萨希卜》被视为在世的上师，游戏里只远远地出现在殿内，不可点击；经文不用机器朗读。',
      'notice.pa.langar': '公共厨房做出的饭只用来招待来客，不能花在别处；不论来客的宗教、种姓和身份，大家坐在一排吃饭。',
      'preview.body.pa': '锡克教版本由 AI 根据公开资料起草，没有经过锡克教顾问或谒师所审核，古木基文也没有经过母语者校对。转写、译文、礼仪说明和节日日期都可能有错，不代表任何谒师所。',
      'cal.note.pa': '锡克节日有纳纳克历（Nanakshahi）与传统阴历（Bikrami）两种算法，这里按印度公布的日期；以当地谒师所为准。',
      'obs.pa.vaisakhi': '丰收节 / 卡尔萨创立纪念（Vaisakhi）',
      'obs.pa.bandiChhor': '解放日（Bandi Chhor Divas）',
      'obs.pa.guruNanak': '古鲁那纳克诞辰（Gurpurab）',
    },
    en: {
      'version.sikhism.gurdwara.name': 'Sikhism · Gurdwara',
      'version.sikhism.gurdwara.place': 'Langar Hall',
      'version.sikhism.gurdwara.region': 'Punjab · the global Sikh community',
      'version.sikhism.gurdwara.note': 'Seva, the community kitchen (langar), eating side by side, listening to the Mūl Mantar',
      'opt.content.pa-Guru': 'Gurmukhi',
      'opt.content.pa-Latn': 'Romanized',
      'opt.content.pa-both': 'Gurmukhi + romanized',
      'voice.ref.pa': 'Mūl Mantar reference recording',
      'voice.ref.pa.note': 'CC BY-SA 4.0 by Usingh0663, not recorded by us',
      'notice.pa.experience': 'This is a cultural experience. It does not represent any gurdwara or Sikh body and promises no spiritual result.',
      'notice.pa.entry': 'Cover your head, take off your shoes and wash your hands before entering; no tobacco or alcohol.',
      'notice.pa.scripture': 'The Guru Granth Sahib is revered as the living Guru. In the game it appears only far inside the hall and cannot be tapped; Gurbani is never read by a machine voice.',
      'notice.pa.langar': 'Food cooked in the langar is only for serving guests and cannot be spent elsewhere. Everyone sits in one row regardless of religion, caste or status.',
      'preview.body.pa': 'The Sikh version was drafted by AI from public sources. No Sikh advisor or gurdwara has reviewed it, and the Gurmukhi has not been checked by a native reader. Transliteration, translation, etiquette notes and dates may be wrong. It represents no gurdwara.',
      'cal.note.pa': 'Sikh dates are reckoned by the Nanakshahi or the traditional Bikrami calendar; these follow published Indian dates. Follow the local gurdwara.',
      'obs.pa.vaisakhi': 'Vaisakhi (harvest; founding of the Khalsa)',
      'obs.pa.bandiChhor': 'Bandi Chhor Divas',
      'obs.pa.guruNanak': 'Guru Nanak Gurpurab',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
