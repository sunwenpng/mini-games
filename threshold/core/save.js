/*
 * 平台存档。新键 threshold-save-v1；旧游戏的 temple-yard-save-v1 只读不写，留作回退。
 * 第一次打开平台时，从旧存档里读出已有的版本、语言和声线选择。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});

  const KEY = 'threshold-save-v1';
  const BAK = KEY + '.bak';
  const LEGACY = 'temple-yard-save-v1';
  const FIELDS = ['ui', 'content', 'translation', 'voice'];

  function fresh(now) {
    return { ver: 1, uiLocale: null, lastVersion: null, prefs: {}, notify: {}, acks: {}, display: { size: 'm', motion: 'system' }, migratedFrom: null, createdAt: now || Date.now() };
  }

  function parse(raw) {
    try {
      const v = JSON.parse(raw);
      return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
    } catch (e) {
      return null;
    }
  }

  /* 把某个版本的选择修正成合法值：不存在或不可选的项回到默认值。 */
  function normalizePrefs(versionId, prefs) {
    const pack = T.PACKS && T.PACKS[(T.findVersion(versionId) || {}).version ? T.findVersion(versionId).version.pack : null];
    if (!pack) return null;
    const out = {};
    FIELDS.forEach(f => {
      const want = prefs && prefs[f];
      const opt = pack.options[f].find(o => o.id === want);
      out[f] = opt && opt.state !== 'off' ? want : pack.defaults[f];
    });
    return out;
  }

  function merge(s, now) {
    const out = Object.assign(fresh(now), s);
    out.prefs = s.prefs && typeof s.prefs === 'object' ? s.prefs : {};
    out.notify = s.notify && typeof s.notify === 'object' ? s.notify : {};
    out.acks = s.acks && typeof s.acks === 'object' ? s.acks : {};
    const d = s.display && typeof s.display === 'object' ? s.display : {};
    out.display = {
      size: ['m', 'l', 'xl'].indexOf(d.size) >= 0 ? d.size : 'm',
      motion: ['system', 'reduce', 'full'].indexOf(d.motion) >= 0 ? d.motion : 'system',
    };
    Object.keys(out.prefs).forEach(id => {
      const p = normalizePrefs(id, out.prefs[id]);
      if (p) out.prefs[id] = p;
      else delete out.prefs[id];
    });
    if (out.lastVersion && !T.findVersion(out.lastVersion)) out.lastVersion = null;
    if (out.uiLocale && (T.UI_LOCALES || []).indexOf(out.uiLocale) < 0) out.uiLocale = null;
    return out;
  }

  /* 旧山寺小院存档 → 平台选择。支持 v1/v2（没有 platform 字段）和 Codex 分支的 v3。 */
  function fromLegacy(legacy, now) {
    const out = fresh(now);
    const ver = Number.isFinite(legacy.ver) ? legacy.ver : 1;
    out.migratedFrom = LEGACY + '@v' + ver;
    const p = legacy.platform || {};
    const raw = {
      ui: p.uiLocale || 'zh-CN',
      content: p.contentLocale === 'zh-Hans' || !p.contentLocale ? 'lzh' : p.contentLocale,
      translation: 'none',
      voice: legacy.opt && legacy.opt.voiceProfile ? 'sys.' + legacy.opt.voiceProfile : 'sys.clear',
    };
    out.prefs['buddhism.han'] = normalizePrefs('buddhism.han', raw);
    if (legacy.seenIntro || legacy.platformChosen) out.lastVersion = 'buddhism.han';
    return out;
  }

  /* 返回 { data, note }。note：'' | 'migrated' | 'restored' | 'reset' */
  function load(storage, now) {
    let main = null;
    let bak = null;
    let legacy = null;
    try {
      main = storage.getItem(KEY);
      bak = storage.getItem(BAK);
      legacy = storage.getItem(LEGACY);
    } catch (e) {
      return { data: fresh(now), note: '' };
    }
    if (main) {
      const s = parse(main);
      if (s) return { data: merge(s, now), note: '' };
      const b = bak ? parse(bak) : null;
      if (b) return { data: merge(b, now), note: 'restored' };
      return { data: fresh(now), note: 'reset' };
    }
    const old = legacy ? parse(legacy) : null;
    if (old) return { data: fromLegacy(old, now), note: 'migrated' };
    return { data: fresh(now), note: '' };
  }

  function write(storage, data) {
    try {
      const prev = storage.getItem(KEY);
      if (prev && parse(prev)) storage.setItem(BAK, prev);
      storage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- 存档码 ---------- */
  function checksum(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(36);
  }

  /* packs：{ 存档键: 原始 JSON 字符串 }，可省略。带游戏进度时外面包一层 { thrs: 2, platform, packs }。 */
  function exportCode(data, packs) {
    const hasPacks = packs && Object.keys(packs).length;
    const json = JSON.stringify(hasPacks ? { thrs: 2, platform: data, packs } : data);
    return 'THRS1:' + btoa(encodeURIComponent(json)) + ':' + checksum(json);
  }

  /* 返回 { data, packs } 或 { error: 'format'|'damaged'|'checksum'|'content' }。allowed：可以写入的游戏存档键。 */
  function parseCode(code, now, allowed) {
    const m = String(code || '').trim().match(/^THRS1:([A-Za-z0-9+/=]+):([0-9a-z]+)$/);
    if (!m) return { error: 'format' };
    let json;
    try {
      json = decodeURIComponent(atob(m[1]));
    } catch (e) {
      return { error: 'damaged' };
    }
    if (checksum(json) !== m[2]) return { error: 'checksum' };
    const s = parse(json);
    if (!s) return { error: 'content' };
    if (s.thrs === 2) {
      const plat = s.platform && typeof s.platform === 'object' ? s.platform : null;
      if (!plat) return { error: 'content' };
      const packs = {};
      const src = s.packs && typeof s.packs === 'object' ? s.packs : {};
      Object.keys(src).forEach(k => {
        if (allowed && allowed.indexOf(k) < 0) return;
        if (typeof src[k] === 'string' && parse(src[k])) packs[k] = src[k];
      });
      return { data: merge(plat, now), packs };
    }
    return { data: merge(s, now), packs: {} };
  }

  /* ---------- 深链接：#v=buddhism.han&ui=zh-CN&src=lzh&tr=none&voice=sys.clear ---------- */
  const LINK = { ui: 'ui', src: 'content', tr: 'translation', voice: 'voice' };

  function parseLink(hash) {
    const out = { params: {} };
    String(hash || '').replace(/^#/, '').split('&').forEach(pair => {
      if (!pair) return;
      const i = pair.indexOf('=');
      const k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i));
      const v = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1));
      out.params[k] = v;
    });
    out.view = out.params.view || null;
    out.family = out.params.f || null;
    out.versionId = out.params.v || null;
    out.prefs = {};
    Object.keys(LINK).forEach(k => { if (out.params[k]) out.prefs[LINK[k]] = out.params[k]; });
    return out;
  }

  function formatLink(versionId, prefs, view) {
    const parts = [];
    if (view) parts.push('view=' + encodeURIComponent(view));
    if (versionId) parts.push('v=' + encodeURIComponent(versionId));
    Object.keys(LINK).forEach(k => {
      const f = LINK[k];
      if (prefs && prefs[f]) parts.push(k + '=' + encodeURIComponent(prefs[f]));
    });
    return '#' + parts.join('&');
  }

  T.Save = { KEY, BAK, LEGACY, FIELDS, fresh, load, write, merge, fromLegacy, normalizePrefs, exportCode, parseCode, checksum, parseLink, formatLink };
})(typeof window !== 'undefined' ? window : globalThis);
