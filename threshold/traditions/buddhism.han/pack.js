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
        { id: 'zh-TW', state: 'draft', why: 'why.draftUiTw' },
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
    /* 进入前须知（平台渲染，文案由包提供）。 */
    saveKeys: ['threshold-han-save-v1'],
    notice: ['notice.experience', 'notice.noAds', 'notice.voice', 'notice.phase1'],
    /* 节历：农历（中国时区）。日期是汉传寺院通行的说法，各地可能不同，待顾问审定。 */
    calendar: {
      tz: 'Asia/Shanghai',
      showLunar: true,
      note: 'cal.note.han',
      lunar: [
        { id: 'obs.han.maitreya', month: 1, day: 1 },
        { id: 'obs.han.renunciation', month: 2, day: 8 },
        { id: 'obs.han.parinirvana', month: 2, day: 15 },
        { id: 'obs.han.guanyinBirth', month: 2, day: 19 },
        { id: 'obs.han.vesak', month: 4, day: 8 },
        { id: 'obs.han.guanyinAwakening', month: 6, day: 19 },
        { id: 'obs.han.ullambana', month: 7, day: 15 },
        { id: 'obs.han.ksitigarbha', month: 7, day: 30, lastDay: true },
        { id: 'obs.han.guanyinRenunciation', month: 9, day: 19 },
        { id: 'obs.han.bhaisajyaguru', month: 9, day: 30, lastDay: true },
        { id: 'obs.han.amitabha', month: 11, day: 17 },
        { id: 'obs.han.bodhi', month: 12, day: 8 },
      ],
      lunarDays: [
        { id: 'obs.han.new', day: 1 },
        { id: 'obs.han.full', day: 15 },
      ],
    },
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
