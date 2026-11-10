/* 神道包的内容：略拜词（通行的简短祷词，公有领域）与参拜的口诀。罗马字与译文由 AI 起草。draft。 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'ja', tts: 'ja-JP', rate: 0.8 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['shinto.shrine'] = [
    rec({
      id: 'shinto.shrine.ryakuhai', key: 'ryakuhai', type: 'prayer',
      title: { 'zh-CN': '略拜词', en: 'Ryakuhaishi (short prayer)', ja: '略拝詞' },
      edition: 'Common shrine usage', source: { id: 'Ryakuhaishi', name: 'Ryakuhaishi, traditional short prayer' },
      text: { orig: ['祓へ給へ', '清め給へ', '神ながら守り給へ', '幸へ給へ'], latn: ['harae tamae', 'kiyome tamae', 'kamunagara mamori tamae', 'sakihae tamae'] },
      translations: { 'zh-CN': ['请祓除（污秽），', '请使之清净，', '愿依神意守护，', '愿赐予幸福。'], en: ['Purify,', 'cleanse,', 'protect us as the kami will,', 'and bless us.'] },
    }),
    rec({
      id: 'shinto.shrine.sanpai', key: 'sanpai', type: 'prayer',
      title: { 'zh-CN': '参拜的顺序', en: 'The order of worship' },
      edition: 'Jinja Honchō general guidance', source: { id: 'Nihai nihakushu ippai', name: 'Two bows, two claps, one bow (general shrine practice)' },
      text: { orig: ['二拝', '二拍手', '一拝'], latn: ['nihai', 'nihakushu', 'ippai'] },
      translations: { 'zh-CN': ['深深鞠躬两次，', '在胸前拍手两次，', '再深深鞠躬一次。'], en: ['Bow deeply twice,', 'clap twice before your chest,', 'and bow deeply once more.'] },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
