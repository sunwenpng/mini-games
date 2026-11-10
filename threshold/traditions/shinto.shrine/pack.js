/*
 * 神道包（镇守之森的神社）：内测预览。手水净身、二拜二拍手一拜、绘马、扫参道，节日按公历。
 * 不画神体；本殿不可点击；不做付费求签。鸟居只在本包使用（平台品牌刻意不用鸟居）。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'shinto.shrine';
  T.addPack({
    id: ID,
    family: 'shinto',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-shinto-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'ja-shinto', state: 'ok' }, { id: 'ja-shinto-latn', state: 'ok' }, { id: 'ja-shinto-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'sys.shinto', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'ja-shinto-both', translation: 'zh-CN', voice: 'sys.shinto' },
    notice: ['notice.shinto.experience', 'notice.shinto.local', 'notice.shinto.etiquette', 'notice.shinto.practice'],
    previewBody: 'preview.body.shinto',
    calendar: {
      tz: 'Asia/Tokyo',
      note: 'cal.note.shinto',
      yearly: [
        { id: 'obs.shinto.hatsumode', md: '01-01' },
        { id: 'obs.shinto.setsubun', md: '02-03' },
        { id: 'obs.shinto.nagoshi', md: '06-30' },
        { id: 'obs.shinto.shichigosan', md: '11-15' },
        { id: 'obs.shinto.niiname', md: '11-23' },
        { id: 'obs.shinto.oharae', md: '12-31' },
      ],
    },
    review: { advisor: null, nativeReview: { ja: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['no-shintai', 'honden-not-interactive'], noPaidOmikuji: true },
    voices: { 'sys.shinto': { kind: 'system', style: 'japanese', tts: { lang: 'ja-JP', rate: 0.8 } } },
  }, {
    'zh-CN': {
      'version.shinto.shrine.name': '神道 · 村里的神社',
      'version.shinto.shrine.place': '镇守之森',
      'version.shinto.shrine.region': '日本',
      'version.shinto.shrine.note': '手水净身、二拜二拍手一拜、绘马、扫参道',
      'opt.content.ja-shinto': '日文',
      'opt.content.ja-shinto-latn': '罗马字',
      'opt.content.ja-shinto-both': '日文 + 罗马字',
      'voice.sys.shinto': '设备日语朗读',
      'voice.sys.shinto.note': '设备自带的日语语音，不是神职人员',
      'notice.shinto.experience': '这是文化体验，不代表任何神社，也不承诺任何灵验。',
      'notice.shinto.local': '各地神社供奉的神和规矩各不相同；参拜方法以神社自己的说明为准（例如出云大社是二拜四拍手一拜）。',
      'notice.shinto.etiquette': '鸟居前一礼；参道中间是神走的路，靠边走；手水只用来净手漱口，不要直接用勺子喝。',
      'notice.shinto.practice': '手水、参拜、绘马只记在功课簿里，不产出任何可花的东西；香油钱不用游戏里的米。',
      'preview.body.shinto': '神道版本由 AI 根据公开资料起草，没有经过神职人员或学者审核，日文也没有经过母语者校对。可能有错，不代表任何神社。',
      'cal.note.shinto': '神社的节日多用公历；各神社的例祭日不同，以当地神社为准。',
      'obs.shinto.hatsumode': '初诣（新年参拜）',
      'obs.shinto.setsubun': '节分',
      'obs.shinto.nagoshi': '夏越之祓（钻茅轮）',
      'obs.shinto.shichigosan': '七五三',
      'obs.shinto.niiname': '新尝祭（新谷感谢）',
      'obs.shinto.oharae': '年越之大祓',
    },
    en: {
      'version.shinto.shrine.name': 'Shinto · a village shrine',
      'version.shinto.shrine.place': 'Shrine in the Grove',
      'version.shinto.shrine.region': 'Japan',
      'version.shinto.shrine.note': 'Temizu purification, two bows two claps one bow, ema, sweeping the approach',
      'opt.content.ja-shinto': 'Japanese',
      'opt.content.ja-shinto-latn': 'Rōmaji',
      'opt.content.ja-shinto-both': 'Japanese + rōmaji',
      'voice.sys.shinto': 'Japanese device voice',
      'voice.sys.shinto.note': 'The device’s Japanese voice, not a priest',
      'notice.shinto.experience': 'This is a cultural experience. It does not represent any shrine and promises no result.',
      'notice.shinto.local': 'Each shrine has its own kami and customs; follow the shrine’s own instructions (Izumo Taisha, for example, uses two bows, four claps, one bow).',
      'notice.shinto.etiquette': 'Bow at the torii; keep to the side of the approach, as the centre is the path of the kami; use the temizu water only to rinse hands and mouth, never drink from the ladle.',
      'notice.shinto.practice': 'Temizu, worship and ema are only noted in the practice book and produce nothing to spend; offering coins are never paid with in-game rice.',
      'preview.body.shinto': 'The Shinto version was drafted by AI from public sources. No priest or scholar has reviewed it and the Japanese has not been checked by a native speaker. It may contain errors and represents no shrine.',
      'cal.note.shinto': 'Shrine festivals mostly follow the Gregorian calendar; each shrine’s main festival differs. Follow the local shrine.',
      'obs.shinto.hatsumode': 'Hatsumōde (first visit of the year)',
      'obs.shinto.setsubun': 'Setsubun',
      'obs.shinto.nagoshi': 'Nagoshi no harae (summer purification)',
      'obs.shinto.shichigosan': 'Shichi-go-san',
      'obs.shinto.niiname': 'Niiname-sai (harvest thanksgiving)',
      'obs.shinto.oharae': 'Ōharae (year-end purification)',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
