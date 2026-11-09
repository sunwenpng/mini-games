/*
 * 节历引擎：只提供历法计算，节日名称和规则由各传统包的 pack.calendar 提供。
 * - chinese：用浏览器内置的 Intl 农历（ca-chinese）推算月、日、闰月。
 * - 固定公历日期（fixed）：官方公布的日期，如泰国的四大佛教节日。
 * - lunarDays：每个农历月里的固定日子（初一、十五；泰国佛日按农历日估算，标“估算”）。
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

  /* 当天是哪些节日。返回 [{ id, approx }]。 */
  function observancesOn(cal, date) {
    if (!cal) return [];
    const tz = cal.tz || 'Asia/Shanghai';
    const out = [];
    const iso = isoDay(date, tz);
    (cal.fixed || []).forEach(o => {
      if (o.date === iso) out.push({ id: o.id, approx: !!o.approx });
    });
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

  T.Calendar = { lunar, isoDay, observancesOn, upcoming, moonAge };
})(typeof window !== 'undefined' ? window : globalThis);
