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
        { id: 'obs.th.okPhansa', date: '2026-10-26', approx: true },
        { id: 'obs.th.makha', date: '2027-02-21' },
        { id: 'obs.th.visakha', date: '2027-05-20' },
        { id: 'obs.th.asalha', date: '2027-07-18' },
        { id: 'obs.th.khaoPhansa', date: '2027-07-19' },
        { id: 'obs.th.okPhansa', date: '2027-10-15', approx: true },
      ],
      lunarDays: [
        { id: 'obs.th.wanPhra', day: 8, approx: true },
        { id: 'obs.th.wanPhra', day: 15, approx: true },
        { id: 'obs.th.wanPhra', day: 23, approx: true },
        { id: 'obs.th.wanPhra', day: 'last', approx: true },
      ],
      phansa: [['2026-07-30', '2026-10-26'], ['2027-07-19', '2027-10-15']],
      sources: [
        'https://www.nationthailand.com/news/general/40070369',
        'https://www.officeholidays.com/countries/thailand/2027',
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
