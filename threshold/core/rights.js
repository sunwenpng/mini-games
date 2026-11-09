/*
 * 内容与声音的审核门。
 * - 开发构建：所有内容都能看到，未达标的标“未审校”。
 * - 正式构建：只保留 reviewStatus ≥ native-reviewed 的内容；声音必须有完整权利链。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});

  const REVIEW = ['missing', 'draft', 'self-checked', 'native-reviewed', 'advisor-approved'];
  const TYPES = ['sutra', 'dharani', 'gatha', 'mantra', 'nianfo', 'prayer', 'hymn', 'scripture'];
  const KINDS = ['system', 'reference', 'owned'];

  function reviewRank(status) {
    return REVIEW.indexOf(status);
  }

  function checkContent(records) {
    const problems = [];
    (records || []).forEach(r => {
      if (!r.id) problems.push({ id: '?', problem: 'id' });
      if (TYPES.indexOf(r.type) < 0) problems.push({ id: r.id, problem: 'type' });
      if (!r.license) problems.push({ id: r.id, problem: 'license' });
      if (!r.source || !r.source.id) problems.push({ id: r.id, problem: 'source' });
      if (reviewRank(r.reviewStatus) < 0) problems.push({ id: r.id, problem: 'reviewStatus' });
      if (!Array.isArray(r.territory) || !r.territory.length) problems.push({ id: r.id, problem: 'territory' });
      if (!r.text || !Object.keys(r.text).length) problems.push({ id: r.id, problem: 'text' });
    });
    return problems;
  }

  function releaseFilter(records) {
    return (records || []).filter(r => reviewRank(r.reviewStatus) >= reviewRank('native-reviewed'));
  }

  /* 声音是否具备上线所需的权利信息。系统语音不需要（但界面必须标明“机器朗读”）。 */
  function voiceProblems(id, v) {
    const p = [];
    if (!v || KINDS.indexOf(v.kind) < 0) return ['kind'];
    if (v.kind === 'reference') {
      if (!v.license) p.push('license');
      if (!v.sourceUrl) p.push('sourceUrl');
      if (!v.file) p.push('file');
    }
    if (v.kind === 'owned') {
      ['file', 'performer', 'license', 'contract', 'scope', 'proofreadBy'].forEach(k => { if (!v[k]) p.push(k); });
    }
    return p;
  }

  function voiceReady(id) {
    return voiceProblems(id, (T.VOICES || {})[id]).length === 0;
  }

  /* 包里标成可选（ok/draft）的声音，权利链必须齐全；不齐全的必须是 off。 */
  function checkPackVoices(pack) {
    const bad = [];
    pack.options.voice.forEach(o => {
      if (o.state !== 'off' && !voiceReady(o.id)) bad.push(o.id);
    });
    return bad;
  }

  T.Rights = { REVIEW, TYPES, KINDS, reviewRank, checkContent, releaseFilter, voiceProblems, voiceReady, checkPackVoices };
})(typeof window !== 'undefined' ? window : globalThis);
