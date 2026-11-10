/*
 * 泰国上座部佛教包（菩提静院）的元数据。状态 preview：未经顾问和母语审校的内测预览，进入前用户必须确认。
 * 和汉传包刻意不同：巴利文原文（泰文字母 / 拉丁转写）、泰语界面、清晨布施的时间窗口、
 * 佛日（วันพระ）节律、三拜（五体投地）、供花烛香、热季 / 雨季 / 凉季，不做放生。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.PACKS = T.PACKS || {};

  T.PACKS['buddhism.theravada.th'] = {
    id: 'buddhism.theravada.th',
    family: 'buddhism',
    status: 'preview',
    entry: 'traditions/buddhism.theravada.th/game/index.html',
    saveKeys: ['threshold-th-save-v1'],
    options: {
      ui: [
        { id: 'th', state: 'draft', why: 'why.draftThai' },
        { id: 'en', state: 'draft', why: 'why.draftUi' },
        { id: 'zh-CN', state: 'ok' },
        { id: 'zh-TW', state: 'off', why: 'why.notYet' },
      ],
      content: [
        { id: 'pi-Thai', state: 'ok' },
        { id: 'pi-Latn', state: 'ok', why: 'why.latnOnly' },
        { id: 'pi-both', state: 'ok' },
      ],
      translation: [
        { id: 'none', state: 'ok' },
        { id: 'th', state: 'draft', why: 'why.translationDraft' },
        { id: 'en', state: 'draft', why: 'why.translationDraft' },
        { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' },
      ],
      voice: [
        { id: 'sys.th', state: 'ok', why: 'why.thaiVoice' },
        { id: 'own.th.v1', state: 'off', why: 'why.ownThai' },
      ],
    },
    defaults: { ui: 'th', content: 'pi-Thai', translation: 'none', voice: 'sys.th' },
    notice: ['notice.th.experience', 'notice.th.etiquette', 'notice.th.alms', 'notice.th.noRelease', 'notice.th.practice', 'notice.th.voice'],
    /*
     * 节历（曼谷时区）。四大节日用泰国政府公布的日期（2026、2027）；出雨安居按入雨安居后第三个满月估算。
     * 佛日按农历初八、十五、廿三和月末估算：泰国阴历与中国农历都按月相，但起算不同，可能差一天。
     */
    calendar: {
      tz: 'Asia/Bangkok',
      note: 'cal.note.th',
      fixed: [
        { id: 'obs.th.makha', date: '2026-03-03' },
        { id: 'obs.th.visakha', date: '2026-05-31' },
        { id: 'obs.th.asalha', date: '2026-07-29' },
        { id: 'obs.th.khaoPhansa', date: '2026-07-30' },
        { id: 'obs.th.okPhansa', date: '2026-10-26' },
        { id: 'obs.th.makha', date: '2027-02-21' },
        { id: 'obs.th.visakha', date: '2027-05-20' },
        { id: 'obs.th.asalha', date: '2027-07-18' },
        { id: 'obs.th.khaoPhansa', date: '2027-07-19' },
        { id: 'obs.th.okPhansa', date: '2027-10-15', approx: true },
      ],
      /* 2569（2026）年的 50 个佛日：泰国通行年历（OFM、Central 两份公开年历逐日一致）。
         其中 2026-06-14 一处两份标注不同（แรม 14 / แรม 15），按小月推算取 แรม 14，日期一致。 */
      wanPhra: [
        '2026-01-03',
        '2026-01-11',
        '2026-01-18',
        '2026-01-26',
        '2026-02-02',
        '2026-02-10',
        '2026-02-16',
        '2026-02-24',
        '2026-03-03',
        '2026-03-11',
        '2026-03-18',
        '2026-03-26',
        '2026-04-02',
        '2026-04-10',
        '2026-04-16',
        '2026-04-24',
        '2026-05-01',
        '2026-05-09',
        '2026-05-16',
        '2026-05-24',
        '2026-05-31',
        '2026-06-08',
        '2026-06-14',
        '2026-06-22',
        '2026-06-29',
        '2026-07-07',
        '2026-07-14',
        '2026-07-22',
        '2026-07-29',
        '2026-07-30',
        '2026-08-06',
        '2026-08-13',
        '2026-08-21',
        '2026-08-28',
        '2026-09-05',
        '2026-09-11',
        '2026-09-19',
        '2026-09-26',
        '2026-10-04',
        '2026-10-11',
        '2026-10-19',
        '2026-10-26',
        '2026-11-03',
        '2026-11-09',
        '2026-11-17',
        '2026-11-24',
        '2026-12-02',
        '2026-12-09',
        '2026-12-17',
        '2026-12-24',
      ],
      /* 没有年历的年份（2027 起）才用中国农历日估算，并标“估算”。 */
      lunarDays: [
        { id: 'obs.th.wanPhra', day: 8, approx: true, from: '2027-01-01' },
        { id: 'obs.th.wanPhra', day: 15, approx: true, from: '2027-01-01' },
        { id: 'obs.th.wanPhra', day: 23, approx: true, from: '2027-01-01' },
        { id: 'obs.th.wanPhra', day: 'last', approx: true, from: '2027-01-01' },
      ],
      phansa: [['2026-07-30', '2026-10-26'], ['2027-07-19', '2027-10-15']],
      sources: [
        'https://www.nationthailand.com/news/general/40070369',
        'https://www.officeholidays.com/countries/thailand/2027',
        'https://www.ofm.co.th/blog/calendar-buddhist-2569/',
        'https://www.central.co.th/e-shopping/yearly-buddhist-holy-day-calendar',
      ],
    },
    review: { advisor: null, nativeReview: { th: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: {
      adsInSacredSpace: false,
      ads: false,
      practicesYieldCurrency: false,
      depictions: ['buddha-image-not-interactive'],
      noAnimalRelease: true,
      almsWindow: [6, 8],
    },
  };

  T.VOICES = T.VOICES || {};
  Object.assign(T.VOICES, {
    'sys.th': { kind: 'system', style: 'thai', tts: { lang: 'th-TH', rate: 0.82, pitch: 0.9 } },
    'own.th.v1': {
      kind: 'owned',
      file: null,
      performer: null,
      license: null,
      contract: null,
      scope: null,
      covers: ['buddhism.theravada.th.namo', 'buddhism.theravada.th.tisarana', 'buddhism.theravada.th.pancasila'],
      proofreadBy: null,
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
