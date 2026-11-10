/*
 * 节历引擎：只提供历法计算，节日名称和规则由各传统包的 pack.calendar 提供。
 * - chinese：用浏览器内置的 Intl 农历（ca-chinese）推算月、日、闰月。
 * - 固定公历日期（fixed）：官方公布的日期，如泰国的四大佛教节日。
 * - lunarDays：每个农历月里的固定日子（初一、十五；泰国佛日按农历日估算，标“估算”）。
 * - rel：相对复活节的日子（base: 'easter' 西方教会，'pascha' 东正教，按尤利乌斯历计算后换成公历）。
 * - islamic：伊斯兰历月、日（Intl islamic-umalqura），实际以当地见月为准，一律标“估算”。
 * - hebrew：希伯来历月名、日（Intl hebrew）。犹太节日从前一天日落开始，这里给的是白天那一天。
 * 农历计算失败（极老的浏览器）时返回空列表，不报错。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const DAY = 86400000;
  const cache = {};

  function fmt(tz) {
    if (!cache[tz]) {
      try {
        cache[tz] = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: tz, month: 'numeric', day: 'numeric' });
      } catch (e) {
        cache[tz] = null;
      }
    }
    return cache[tz];
  }

  /* 返回 { month, day, leap } 或 null。 */
  function lunar(date, tz) {
    const f = fmt(tz || 'Asia/Shanghai');
    if (!f) return null;
    let month = null;
    let day = null;
    let leap = false;
    try {
      f.formatToParts(date).forEach(p => {
        if (p.type === 'month') {
          leap = /bis/i.test(p.value);
          month = parseInt(p.value, 10);
        } else if (p.type === 'day') {
          day = parseInt(p.value, 10);
        }
      });
    } catch (e) {
      return null;
    }
    if (!month || !day) return null;
    return { month, day, leap };
  }

  /* 某时区里的公历日期字符串 YYYY-MM-DD。 */
  function isoDay(date, tz) {
    try {
      const parts = {};
      new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
        .formatToParts(date).forEach(p => { parts[p.type] = p.value; });
      return parts.year + '-' + parts.month + '-' + parts.day;
    } catch (e) {
      return date.toISOString().slice(0, 10);
    }
  }

  /* 西方复活节（格里高利历，匿名算法）。返回 UTC 的 YYYY-MM-DD。 */
  function easter(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
  }

  /* 东正教复活节：尤利乌斯历计算，加上两历差（1900–2099 年为 13 天）。 */
  function pascha(year) {
    const a = year % 4, b = year % 7, c = year % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31), day = ((d + e + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day) + 13 * DAY).toISOString().slice(0, 10);
  }

  function shiftIso(iso, days) {
    return new Date(Date.parse(iso + 'T00:00:00Z') + days * DAY).toISOString().slice(0, 10);
  }

  const other = {};
  function otherFmt(cal, tz, opts) {
    const k = cal + tz + JSON.stringify(opts);
    if (!(k in other)) {
      try { other[k] = new Intl.DateTimeFormat('en-u-ca-' + cal, Object.assign({ timeZone: tz }, opts)); } catch (e) { other[k] = null; }
    }
    return other[k];
  }

  /* 伊斯兰历 { month, day }（数字）。 */
  function islamicDate(date, tz) {
    const f = otherFmt('islamic-umalqura', tz, { month: 'numeric', day: 'numeric' });
    if (!f) return null;
    const out = {};
    try { f.formatToParts(date).forEach(p => { if (p.type === 'month' || p.type === 'day') out[p.type] = parseInt(p.value, 10); }); } catch (e) { return null; }
    return out.month && out.day ? out : null;
  }

  /* 希伯来历 { month: 'Tishri' 等英文月名, day }。 */
  function hebrewDate(date, tz) {
    const f = otherFmt('hebrew', tz, { month: 'long', day: 'numeric' });
    if (!f) return null;
    const out = {};
    try { f.formatToParts(date).forEach(p => { if (p.type === 'month') out.month = p.value; if (p.type === 'day') out.day = parseInt(p.value, 10); }); } catch (e) { return null; }
    return out.month && out.day ? out : null;
  }

  /* 当天是哪些节日。返回 [{ id, approx }]。 */
  function observancesOn(cal, date) {
    if (!cal) return [];
    const tz = cal.tz || 'Asia/Shanghai';
    const out = [];
    const iso = isoDay(date, tz);
    (cal.fixed || []).forEach(o => {
      if (o.date === iso) out.push({ id: o.id, approx: !!o.approx });
    });
    /* 有年历的佛日（日期表），算确切日期。 */
    if (cal.wanPhra && cal.wanPhra.indexOf(iso) >= 0) out.push({ id: 'obs.th.wanPhra', approx: false });
    if (cal.rel && cal.rel.length) {
      const y = parseInt(iso.slice(0, 4), 10);
      const base = { easter: easter(y), pascha: pascha(y) };
      cal.rel.forEach(o => { if (shiftIso(base[o.base], o.offset || 0) === iso) out.push({ id: o.id, approx: false }); });
    }
    if (cal.islamic && cal.islamic.length) {
      const h = islamicDate(date, tz);
      if (h) cal.islamic.forEach(o => { if (o.month === h.month && o.day === h.day) out.push({ id: o.id, approx: true }); });
    }
    if (cal.hebrew && cal.hebrew.length) {
      const h = hebrewDate(date, tz);
      if (h) cal.hebrew.forEach(o => { if ((o.months || [o.month]).indexOf(h.month) >= 0 && o.day === h.day) out.push({ id: o.id, approx: !!o.approx }); });
    }
    (cal.yearly || []).forEach(o => { if (iso.slice(5) === o.md) out.push({ id: o.id, approx: !!o.approx }); });
    const needLunar = (cal.lunar && cal.lunar.length) || (cal.lunarDays && cal.lunarDays.length);
    if (!needLunar) return out;
    const l = lunar(date, tz);
    if (!l) return out;
    const next = lunar(new Date(date.getTime() + DAY), tz);
    const lastDay = !!(next && next.day === 1);
    (cal.lunar || []).forEach(o => {
      if (l.leap) return;
      if (o.month !== l.month) return;
      if (o.day === l.day || (o.lastDay && lastDay && l.day < o.day)) out.push({ id: o.id, approx: !!o.approx });
    });
    (cal.lunarDays || []).forEach(o => {
      if (o.from && iso < o.from) return;
      if (o.day === l.day || (o.day === 'last' && lastDay)) out.push({ id: o.id, approx: !!o.approx });
    });
    return out;
  }

  /* 从今天起 days 天内的节日，最多 limit 个；同一天多个都列出。 */
  function upcoming(cal, from, days, limit) {
    const out = [];
    for (let i = 0; i <= (days || 120) && out.length < (limit || 5); i++) {
      const d = new Date(from.getTime() + i * DAY);
      observancesOn(cal, d).forEach(o => out.push(Object.assign({ inDays: i, date: isoDay(d, cal.tz || 'Asia/Shanghai') }, o)));
    }
    return out.slice(0, limit || 5);
  }

  /* 月龄（天，0≈新月，≈14.77 满月），用于画月相。精度约半天。 */
  function moonAge(date) {
    const SYN = 29.530588853;
    const epoch = Date.UTC(2000, 0, 6, 18, 14);
    const age = ((date.getTime() - epoch) / DAY) % SYN;
    return age < 0 ? age + SYN : age;
  }

  T.Calendar = { lunar, isoDay, observancesOn, upcoming, moonAge, easter, pascha, islamicDate, hebrewDate };
})(typeof window !== 'undefined' ? window : globalThis);
