/*
 * 多语言文案。T.MESSAGES[locale] 由 locales/*.js 填充。
 * - t(key, params)：按回退链取文案，支持 {name} 插值和 { one, other } 复数。
 * - 缺 key 时返回 ⟦key⟧，并记入 missing，方便测试扫出来。
 * - 伪语言 qps-ploc / qps-plocm：以英文为底，加重音并加长约 40%，用来测排版。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.MESSAGES = T.MESSAGES || {};

  const ACCENT = {
    a: 'á', b: 'ƀ', c: 'ç', d: 'ð', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'î', j: 'ĵ', k: 'ķ', l: 'ļ', m: 'ɱ',
    n: 'ñ', o: 'ö', p: 'þ', q: 'ǫ', r: 'ŕ', s: 'š', t: 'ţ', u: 'û', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž',
    A: 'Á', B: 'Ɓ', C: 'Ç', D: 'Ð', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Î', J: 'Ĵ', K: 'Ķ', L: 'Ļ', M: 'Ṁ',
    N: 'Ñ', O: 'Ö', P: 'Þ', Q: 'Ǫ', R: 'Ŕ', S: 'Š', T: 'Ţ', U: 'Û', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž',
  };

  function pseudoize(str) {
    let out = '';
    let depth = 0;
    for (const ch of String(str)) {
      if (ch === '{') depth++;
      if (ch === '}') depth = Math.max(0, depth - 1);
      out += depth > 0 || ch === '}' ? ch : (ACCENT[ch] || ch);
    }
    const pad = Math.max(2, Math.round([...String(str)].length * 0.4));
    return '[' + out + ' ' + '~'.repeat(pad) + ']';
  }
  T.pseudoize = pseudoize;

  function localeInfo(id) {
    return (T.LOCALES || []).find(l => l.id === id) || null;
  }

  T.createI18n = function (localeId) {
    const info = localeInfo(localeId) || localeInfo('zh-CN');
    const pseudo = info.status === 'pseudo';
    const chain = [info.id].concat(info.fallback || []);
    if (chain.indexOf('zh-CN') < 0) chain.push('zh-CN');
    const pluralLocale = pseudo ? 'en' : info.id;
    let plural = null;
    try { plural = new Intl.PluralRules(pluralLocale); } catch (e) { plural = null; }
    const missing = new Set();

    function raw(key) {
      for (const id of chain) {
        const dict = pseudo && id === info.id ? null : T.MESSAGES[id];
        if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return { value: dict[key], from: id };
      }
      return null;
    }

    function fill(str, params) {
      if (!params) return str;
      return String(str).replace(/\{(\w+)\}/g, (m, k) => (params[k] == null ? m : String(params[k])));
    }

    function t(key, params) {
      const hit = raw(key);
      if (!hit) {
        missing.add(key);
        return '⟦' + key + '⟧';
      }
      let v = hit.value;
      if (v && typeof v === 'object') {
        const n = params && typeof params.n === 'number' ? params.n : 0;
        const cat = plural ? plural.select(n) : 'other';
        v = v[cat] != null ? v[cat] : v.other;
      }
      v = fill(v, params);
      return pseudo ? pseudoize(v) : v;
    }

    return {
      locale: info.id,
      info,
      dir: info.direction,
      lang: pseudo ? 'en' : info.id,
      t,
      has: key => !!raw(key),
      missing,
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
