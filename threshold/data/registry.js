/*
 * 平台注册表：传统、版本、语言。只放元数据，不放玩法代码。
 * 版本状态：live 可体验 | preview 内测预览（未经审核，进入前必须确认）| next 下一个制作 | research 研究中 | advisory 顾问审核中 | planned 规划中
 * 只有 live 和 preview 的版本能进入；其余进入“筹备页”。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});

  T.STATUSES = ['live', 'preview', 'next', 'research', 'advisory', 'planned'];

  /* 上线前必须完成的五项；筹备页按这里显示进度。 */
  T.PREP_ITEMS = ['advisor', 'native', 'sources', 'audio', 'layout'];

  T.FAMILIES = [
    {
      id: 'buddhism',
      versions: [
        { id: 'buddhism.han', status: 'live', pack: 'buddhism.han', prep: { advisor: false, native: true, sources: true, audio: false, layout: true } },
        { id: 'buddhism.theravada.th', status: 'preview', pack: 'buddhism.theravada.th', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
        { id: 'buddhism.tibetan', status: 'preview', pack: 'buddhism.tibetan', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
        { id: 'buddhism.japan', status: 'preview', pack: 'buddhism.japan', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
        { id: 'buddhism.india.navayana', status: 'preview', pack: 'buddhism.india.navayana', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
      ],
    },
    { id: 'hinduism', status: 'research', versions: [{ id: 'hinduism.ghat', status: 'preview', pack: 'hinduism.ghat', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } }] },
    {
      id: 'christianity',
      status: 'research',
      versions: [
        { id: 'christianity.catholic', status: 'preview', pack: 'christianity.catholic', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
        { id: 'christianity.orthodox', status: 'preview', pack: 'christianity.orthodox', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
        { id: 'christianity.protestant', status: 'preview', pack: 'christianity.protestant', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
      ],
    },
    {
      id: 'sikhism',
      status: 'research',
      versions: [
        /* 由纸面推演转为内测预览（2026-11-09）。 */
        { id: 'sikhism.gurdwara', status: 'preview', pack: 'sikhism.gurdwara', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } },
      ],
    },
    { id: 'daoism', status: 'research', versions: [{ id: 'daoism.mountain', status: 'preview', pack: 'daoism.mountain', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } }] },
    { id: 'shinto', status: 'research', versions: [{ id: 'shinto.shrine', status: 'preview', pack: 'shinto.shrine', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } }] },
    /* 伊斯兰教、犹太教：只做知识与文化（不模拟礼拜和仪式），从右往左排版。 */
    { id: 'islam', status: 'advisory', versions: [{ id: 'islam.mosque', status: 'preview', pack: 'islam.mosque', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } }], rtl: true, knowledgeOnly: true },
    { id: 'judaism', status: 'advisory', versions: [{ id: 'judaism.shabbat', status: 'preview', pack: 'judaism.shabbat', prep: { advisor: false, native: false, sources: true, audio: false, layout: true } }], rtl: true, knowledgeOnly: true },
  ];

  /*
   * 语言与文字。status：ok 已审校 | draft 有框架待母语审校 | pseudo 伪语言（测试用）| planned 未开始
   * lineBreak：space 按空格 | dictionary 需要按词典断词（泰文等）| cjk 逐字
   */
  T.LOCALES = [
    { id: 'zh-CN', endonym: '简体中文', script: 'Hans', direction: 'ltr', lineBreak: 'cjk', status: 'ok', fallback: [] },
    { id: 'zh-TW', endonym: '繁體中文', script: 'Hant', direction: 'ltr', lineBreak: 'cjk', status: 'draft', fallback: ['zh-CN'] },
    { id: 'en', endonym: 'English', script: 'Latn', direction: 'ltr', lineBreak: 'space', status: 'draft', fallback: ['zh-CN'] },
    { id: 'th', endonym: 'ไทย', script: 'Thai', direction: 'ltr', lineBreak: 'dictionary', status: 'draft', fallback: ['en', 'zh-CN'] },
    { id: 'pa', endonym: 'ਪੰਜਾਬੀ', script: 'Guru', direction: 'ltr', lineBreak: 'space', status: 'planned', fallback: ['en', 'zh-CN'] },
    { id: 'hi', endonym: 'हिन्दी', script: 'Deva', direction: 'ltr', lineBreak: 'space', status: 'planned', fallback: ['en', 'zh-CN'] },
    { id: 'mr', endonym: 'मराठी', script: 'Deva', direction: 'ltr', lineBreak: 'space', status: 'planned', fallback: ['en', 'zh-CN'] },
    { id: 'ar', endonym: 'العربية', script: 'Arab', direction: 'rtl', lineBreak: 'space', status: 'planned', fallback: ['en', 'zh-CN'] },
    { id: 'he', endonym: 'עברית', script: 'Hebr', direction: 'rtl', lineBreak: 'space', status: 'planned', fallback: ['en', 'zh-CN'] },
    { id: 'qps-ploc', endonym: 'Pseudo +40%', script: 'Latn', direction: 'ltr', lineBreak: 'space', status: 'pseudo', fallback: ['en', 'zh-CN'] },
    { id: 'qps-plocm', endonym: 'Pseudo RTL', script: 'Latn', direction: 'rtl', lineBreak: 'space', status: 'pseudo', fallback: ['en', 'zh-CN'] },
  ];

  /* 界面语言切换器里可选的：已审校、待审校和两种伪语言。planned 只在压力测试页出现。 */
  T.UI_LOCALES = ['zh-CN', 'zh-TW', 'en', 'qps-ploc', 'qps-plocm'];

  T.findVersion = function (id) {
    for (const f of T.FAMILIES) {
      const v = f.versions.find(x => x.id === id);
      if (v) return { family: f, version: v };
    }
    return null;
  };

  T.familyStatus = function (f) {
    if (f.versions.some(v => v.status === 'live')) return 'live';
    if (f.versions.some(v => v.status === 'preview')) return 'preview';
    return f.status || (f.versions[0] && f.versions[0].status) || 'planned';
  };

  T.canEnter = function (versionId) {
    const hit = T.findVersion(versionId);
    return !!(hit && (hit.version.status === 'live' || hit.version.status === 'preview') && hit.version.pack && T.PACKS && T.PACKS[hit.version.pack]);
  };

  /*
   * 注册一个传统包，同时并入它在平台页面上要用的文案（名称、选项、须知、节日）。
   * 包的文案覆盖 locales 里的同名 key（例如原先写着“暂无”的版本名）。zh-TW 由 tools/gen-zh-tw.py 统一生成。
   */
  T.addPack = function (pack, msg) {
    T.PACKS = T.PACKS || {};
    T.PACKS[pack.id] = pack;
    T.MESSAGES = T.MESSAGES || {};
    Object.keys(msg || {}).forEach(lang => {
      T.MESSAGES[lang] = T.MESSAGES[lang] || {};
      Object.assign(T.MESSAGES[lang], msg[lang]);
    });
    if (pack.voices) { T.VOICES = T.VOICES || {}; Object.assign(T.VOICES, pack.voices); }
    return pack;
  };

  /* 预览版本进入前必须由用户确认“知道未经审核”。 */
  T.needsAck = function (versionId) {
    const hit = T.findVersion(versionId);
    return !!(hit && hit.version.status === 'preview');
  };
})(typeof window !== 'undefined' ? window : globalThis);
