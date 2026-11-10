/*
 * 印度新乘佛教包（Buddha Vihara）：内测预览。安贝德卡尔博士 1956 年在那格浦尔带领数十万人皈依佛教，
 * 形成以马哈拉施特拉为中心的新乘佛教。玩法：社区佛堂的日常、三皈五戒（天城体巴利文）、历史阅读、
 * 社区节日（安贝德卡尔诞辰、转法轮日）。不画安贝德卡尔和佛陀的像，只写文字。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'buddhism.india.navayana';
  T.addPack({
    id: ID,
    family: 'buddhism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-nv-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'pi-Deva', state: 'ok' }, { id: 'pi-Latn', state: 'ok' }, { id: 'pi-Deva-Latn', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.nv', state: 'ok' }, { id: 'sys.nv', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'pi-Deva-Latn', translation: 'zh-CN', voice: 'ref.nv' },
    notice: ['notice.nv.experience', 'notice.nv.history', 'notice.nv.images', 'notice.nv.practice'],
    previewBody: 'preview.body.nv',
    calendar: {
      tz: 'Asia/Kolkata',
      note: 'cal.note.nv',
      yearly: [
        { id: 'obs.nv.ambedkarJayanti', md: '04-14' },
        { id: 'obs.nv.dhammachakra', md: '10-14' },
        { id: 'obs.nv.mahaparinirvan', md: '12-06' },
      ],
      fixed: [
        { id: 'obs.nv.buddhaPurnima', date: '2026-05-01' }, { id: 'obs.nv.vijayadashami', date: '2026-10-20' },
        { id: 'obs.nv.buddhaPurnima', date: '2027-05-20', approx: true }, { id: 'obs.nv.vijayadashami', date: '2027-10-09' },
      ],
      sources: ['https://www.indiapost.gov.in/holidays-list', 'https://www.calendarlabs.com/holidays/india/2027'],
    },
    review: { advisor: null, nativeReview: { mr: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['no-portraits'] },
    voices: {
      'ref.nv': {
        kind: 'reference', file: 'audio/navayana-buddham-saranam.m4a', license: 'CC0', performer: 'Hariharan (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Buddham_Saranam_Gacchami_-_Male_Voice,_with_Female_Chorus.oga',
      },
      'sys.nv': { kind: 'system', style: 'pali', tts: { lang: 'hi-IN', rate: 0.8 } },
    },
  }, {
    'zh-CN': {
      'version.buddhism.india.navayana.name': '印度新乘佛教',
      'version.buddhism.india.navayana.place': '社区佛堂',
      'version.buddhism.india.navayana.region': '印度 · 马哈拉施特拉',
      'version.buddhism.india.navayana.note': '三皈五戒、1956 年集体皈依的历史、社区节日',
      'opt.content.pi-Deva': '巴利文（天城体）',
      'opt.content.pi-Latn': '巴利文（拉丁转写）',
      'opt.content.pi-Deva-Latn': '天城体 + 转写',
      'voice.ref.nv': '三皈依参考录音',
      'voice.ref.nv.note': 'CC0 公有领域，非本产品录制；只有三皈依有录音',
      'voice.sys.nv': '设备朗读（印地语语音）',
      'voice.sys.nv.note': '用印地语语音读天城体巴利文，发音不完全准确',
      'notice.nv.experience': '这是文化体验，不代表任何佛教团体，也不承诺任何宗教效果。',
      'notice.nv.history': '新乘佛教与反种姓歧视的社会运动紧密相关。这里只讲历史和日常，不对其他宗教作评价。',
      'notice.nv.images': '游戏里不画安贝德卡尔博士和佛陀的像。',
      'notice.nv.practice': '礼拜、供养、诵读、阅读只记在功课簿里，不产出任何可花的东西；照顾动物用的口粮来自打扫佛堂。',
      'preview.body.nv': '印度新乘佛教版本由 AI 根据公开资料起草，没有经过新乘佛教社区成员或学者审核，天城体巴利文也没有经过母语者校对。可能有错，不代表任何团体。',
      'cal.note.nv': '安贝德卡尔诞辰、转法轮日、逝世纪念日按公历；佛陀节、胜利十日节按印度公布的日期。以当地佛堂为准。',
      'obs.nv.ambedkarJayanti': '安贝德卡尔诞辰',
      'obs.nv.dhammachakra': '转法轮日（1956 年集体皈依纪念）',
      'obs.nv.mahaparinirvan': '安贝德卡尔逝世纪念日',
      'obs.nv.buddhaPurnima': '佛陀节（卫塞节）',
      'obs.nv.vijayadashami': '阿育王胜利十日（皈依日农历纪念）',
    },
    en: {
      'version.buddhism.india.navayana.name': 'Navayana Buddhism in India',
      'version.buddhism.india.navayana.place': 'Community Vihara',
      'version.buddhism.india.navayana.region': 'India · Maharashtra',
      'version.buddhism.india.navayana.note': 'Refuges and precepts, the 1956 mass conversion, community festivals',
      'opt.content.pi-Deva': 'Pali (Devanagari)',
      'opt.content.pi-Latn': 'Pali (romanized)',
      'opt.content.pi-Deva-Latn': 'Devanagari + romanized',
      'voice.ref.nv': 'Three Refuges reference recording',
      'voice.ref.nv.note': 'CC0 public domain, not recorded by us; only the Refuges have a recording',
      'voice.sys.nv': 'Device voice (Hindi)',
      'voice.sys.nv.note': 'A Hindi voice reading Devanagari Pali; pronunciation is approximate',
      'notice.nv.experience': 'This is a cultural experience. It does not represent any Buddhist organisation and promises no spiritual result.',
      'notice.nv.history': 'Navayana Buddhism is bound up with the movement against caste discrimination. This version covers history and daily life and passes no judgement on other religions.',
      'notice.nv.images': 'No portraits of Dr Ambedkar or the Buddha are drawn.',
      'notice.nv.practice': 'Bowing, offerings, recitation and reading are only noted in the practice book and produce nothing to spend. The rations for the animals come from sweeping the vihara.',
      'preview.body.nv': 'The Navayana version was drafted by AI from public sources. No member or scholar of the Navayana community has reviewed it, and the Devanagari Pali has not been checked by a native reader. It may contain errors and represents no organisation.',
      'cal.note.nv': 'Ambedkar Jayanti, Dhammachakra Pravartan Din and Mahaparinirvan Din follow the Gregorian dates; Buddha Purnima and Vijayadashami follow Indian published dates. Follow the local vihara.',
      'obs.nv.ambedkarJayanti': 'Ambedkar Jayanti',
      'obs.nv.dhammachakra': 'Dhammachakra Pravartan Din (1956 conversion)',
      'obs.nv.mahaparinirvan': 'Mahaparinirvan Din (Dr Ambedkar’s death anniversary)',
      'obs.nv.buddhaPurnima': 'Buddha Purnima',
      'obs.nv.vijayadashami': 'Ashoka Vijayadashami',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
