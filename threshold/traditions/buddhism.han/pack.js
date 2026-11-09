/*
 * 汉传佛教包（山寺小院）的元数据。平台不加载游戏代码也能读到这些信息。
 * 选项的 state：ok 可选 | draft 可选但未审校 | off 不可选（必须给出原因 key）
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.PACKS = T.PACKS || {};

  T.PACKS['buddhism.han'] = {
    id: 'buddhism.han',
    family: 'buddhism',
    status: 'live',
    /* 相对 threshold/index.html 的入口。原版 ../temple-yard/ 保持不动，可随时回退。 */
    entry: 'traditions/buddhism.han/game/index.html',
    options: {
      ui: [
        { id: 'zh-CN', state: 'ok' },
        { id: 'zh-TW', state: 'off', why: 'why.notYet' },
        { id: 'en', state: 'draft', why: 'why.draftUi' },
      ],
      content: [
        { id: 'lzh', state: 'ok' },
        { id: 'lzh-pinyin', state: 'off', why: 'why.pinyin' },
        { id: 'sa-Deva', state: 'off', why: 'why.sanskrit' },
      ],
      translation: [
        { id: 'none', state: 'ok' },
        { id: 'zh-CN', state: 'off', why: 'why.translationSource' },
        { id: 'en', state: 'off', why: 'why.translationSource' },
      ],
      voice: [
        { id: 'sys.clear', state: 'ok' },
        { id: 'sys.solemn', state: 'ok' },
        { id: 'sys.hall', state: 'ok' },
        { id: 'ref.cc0.xinjing', state: 'ok' },
        { id: 'own.xinjing.v1', state: 'off', why: 'why.ownNotRecorded' },
      ],
    },
    defaults: { ui: 'zh-CN', content: 'lzh', translation: 'none', voice: 'sys.clear' },
    review: { advisor: null, nativeReview: { 'zh-CN': 'self' }, lastReview: null },
    rules: {
      adsInSacredSpace: false,
      practicesYieldCurrency: false,
      depictions: [],
      noAnimalRelease: true,
    },
  };

  /*
   * 声音与权利链。kind：system 设备朗读（非真人）| reference 参考录音（非本产品录制）| owned 自有录音
   * 正式构建里，owned 必须有完整权利字段；reference 必须写明许可。
   */
  T.VOICES = T.VOICES || {};
  Object.assign(T.VOICES, {
    'sys.clear': { kind: 'system', style: 'clear', tts: { rate: 1, pitch: 0.62 } },
    'sys.solemn': { kind: 'system', style: 'solemn', tts: { rate: 0.78, pitch: 0.46 } },
    'sys.hall': { kind: 'system', style: 'hall', tts: { rate: 0.86, pitch: 0.52 } },
    'ref.cc0.xinjing': {
      kind: 'reference',
      file: 'traditions/buddhism.han/game/audio/heart-sutra-mandarin-cc0.ogg',
      sha1: 'eddfa65241e675ffc51105eb1dd9bf3a33795a4b',
      performer: 'Wikimedia Commons: Nyarlathotep1001',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bore_Xinjing_%E8%88%AC%E8%8B%A5%E5%BF%83%E7%BB%8F_(Heart_Sutra)_in_Mandarin_recited_by_a_Chinese_Buddhist_layperson_2.ogg',
      license: 'CC0-1.0',
      scope: { territory: ['*'], commercial: true, derivative: true },
      covers: ['buddhism.han.xinjing'],
      proofreadBy: null,
    },
    'own.xinjing.v1': {
      kind: 'owned',
      file: null,
      performer: null,
      license: null,
      contract: null,
      scope: null,
      covers: ['buddhism.han.xinjing'],
      proofreadBy: null,
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
