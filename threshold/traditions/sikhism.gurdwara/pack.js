/*
 * 锡克教 · 谒师所（Gurdwara）：纸面推演包。
 * 用来验证平台接口能否描述一个“不是寺院、不以个人修行为中心”的传统，不是可玩版本：
 * status 是 research，平台不会开放入口；所有选项都是 off，没有任何内容记录和声音文件。
 * 推演结论见 docs/Claude_非寺院型传统纸面推演_锡克教_v1.md。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.PACKS = T.PACKS || {};

  T.PACKS['sikhism.gurdwara'] = {
    id: 'sikhism.gurdwara',
    family: 'sikhism',
    status: 'research',
    entry: null,
    saveKeys: [],
    options: {
      ui: [
        { id: 'pa', state: 'off', why: 'why.notYet' },
        { id: 'en', state: 'off', why: 'why.notYet' },
        { id: 'hi', state: 'off', why: 'why.notYet' },
      ],
      /* 古木基文是文字，不是语言；《古鲁·格兰特·萨希卜》的语言混合了多种中古印度语言。 */
      content: [{ id: 'pa-Guru', state: 'off', why: 'why.sikhAdvisor' }],
      translation: [
        { id: 'none', state: 'off', why: 'why.sikhAdvisor' },
        { id: 'en', state: 'off', why: 'why.translationSource' },
        { id: 'pa', state: 'off', why: 'why.translationSource' },
      ],
      voice: [{ id: 'own.sikh.kirtan.v1', state: 'off', why: 'why.sikhAdvisor' }],
    },
    defaults: { ui: 'en', content: 'pa-Guru', translation: 'none', voice: 'own.sikh.kirtan.v1' },
    /* 实践能力：平台只认 kind，名称和规则由包提供。 */
    practices: [
      { id: 'seva.langar', kind: 'service', yields: ['meals-served'], note: '公共厨房帮厨：揉面、烙饼、洗碗、给大家盛饭' },
      { id: 'pangat', kind: 'service', yields: [], note: '所有人不分身份并排坐在地上吃饭' },
      { id: 'darbar.visit', kind: 'practice', yields: [], note: '进入大殿：包头、脱鞋、洗手；只做空间导览，不模拟礼拜' },
      { id: 'kirtan.listen', kind: 'reading', yields: [], note: '只听经授权的 kirtan 录音，不做跟唱打分' },
    ],
    notice: [],
    calendar: null,
    review: { advisor: null, nativeReview: {}, lastReview: null },
    rules: {
      adsInSacredSpace: false,
      ads: false,
      practicesYieldCurrency: false,
      noAnimalRelease: true,
      /* 《古鲁·格兰特·萨希卜》被视为在世的上师：不能做道具、不能被拿起或移动、不出现在可点击物里。 */
      depictions: ['guru-granth-sahib-not-interactive', 'gurus-portraits-need-advisor'],
      headCovering: true,
      contentHandling: 'scripture-requires-reading-context',
    },
  };

  T.VOICES = T.VOICES || {};
  T.VOICES['own.sikh.kirtan.v1'] = { kind: 'owned', file: null, performer: null, license: null, contract: null, scope: null, covers: [], proofreadBy: null };
})(typeof window !== 'undefined' ? window : globalThis);
