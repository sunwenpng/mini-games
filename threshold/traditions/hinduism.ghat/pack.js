/*
 * 印度教包（河坛小庙）：内测预览。印度教极其多样，这一版只做北印度恒河边一座供奉湿婆的小庙：
 * 观瞻（darshan）、供奉（puja）、晚祷挥灯（aarti）、念珠持诵（japa），庙里的牛棚（gaushala）。
 * 神像只作远景剪影，不可点击；不模拟祭司主持的仪式。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  const ID = 'hinduism.ghat';
  T.addPack({
    id: ID,
    family: 'hinduism',
    status: 'preview',
    entry: 'play.html?p=' + ID,
    saveKeys: ['threshold-hi-save-v1'],
    options: {
      ui: [{ id: 'zh-CN', state: 'ok' }, { id: 'en', state: 'draft', why: 'why.draftUi' }],
      content: [{ id: 'sa-Deva', state: 'ok' }, { id: 'sa-Latn', state: 'ok' }, { id: 'sa-both', state: 'ok' }],
      translation: [{ id: 'none', state: 'ok' }, { id: 'zh-CN', state: 'draft', why: 'why.translationDraft' }, { id: 'en', state: 'draft', why: 'why.translationDraft' }],
      voice: [{ id: 'ref.hi', state: 'ok' }, { id: 'sys.hi', state: 'ok' }],
    },
    defaults: { ui: 'zh-CN', content: 'sa-both', translation: 'zh-CN', voice: 'ref.hi' },
    notice: ['notice.hi.experience', 'notice.hi.diversity', 'notice.hi.etiquette', 'notice.hi.practice'],
    previewBody: 'preview.body.hi',
    calendar: {
      tz: 'Asia/Kolkata',
      note: 'cal.note.hi',
      fixed: [
        { id: 'obs.hi.shivaratri', date: '2026-02-15' }, { id: 'obs.hi.holi', date: '2026-03-04' }, { id: 'obs.hi.janmashtami', date: '2026-09-04' },
        { id: 'obs.hi.ganesh', date: '2026-09-14' }, { id: 'obs.hi.dussehra', date: '2026-10-20' }, { id: 'obs.hi.diwali', date: '2026-11-08' },
        { id: 'obs.hi.devDeepawali', date: '2026-11-24', approx: true },
        { id: 'obs.hi.shivaratri', date: '2027-03-06' }, { id: 'obs.hi.holi', date: '2027-03-22' }, { id: 'obs.hi.janmashtami', date: '2027-08-25', approx: true },
        { id: 'obs.hi.ganesh', date: '2027-09-04' }, { id: 'obs.hi.dussehra', date: '2027-10-09' }, { id: 'obs.hi.diwali', date: '2027-10-29' },
      ],
      sources: ['https://www.indiapost.gov.in/holidays-list', 'https://calendarific.com/holidays/2027/IN', 'https://www.calendarlabs.com/holidays/hindu/2027'],
    },
    review: { advisor: null, nativeReview: { hi: null, en: null, 'zh-CN': 'self' }, lastReview: null },
    rules: { adsInSacredSpace: false, ads: false, practicesYieldCurrency: false, depictions: ['murti-not-interactive'], cowsStay: true },
    voices: {
      'ref.hi': {
        kind: 'reference', file: 'audio/hindu-gayatri.m4a', license: 'CC0', performer: 'Wilfredor (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gayatri_mantra.ogg',
      },
      'ref.hi.aarti': {
        kind: 'reference', file: 'audio/hindu-aarti.m4a', license: 'CC0', performer: 'Shri hari om sharan ji (Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aarti_Puja,_deity_Santoshi.ogg',
      },
      'sys.hi': { kind: 'system', style: 'sanskrit', tts: { lang: 'hi-IN', rate: 0.8 } },
    },
  }, {
    'zh-CN': {
      'version.hinduism.ghat.name': '印度教 · 恒河边的湿婆小庙',
      'version.hinduism.ghat.place': '河坛小庙',
      'version.hinduism.ghat.region': '北印度 · 恒河沿岸',
      'version.hinduism.ghat.note': '观瞻、供奉、晚祷挥灯、念珠持诵，庙里的牛棚',
      'opt.content.sa-Deva': '梵文（天城体）',
      'opt.content.sa-Latn': '梵文（IAST 转写）',
      'opt.content.sa-both': '天城体 + 转写',
      'voice.ref.hi': '《伽耶特利》参考录音',
      'voice.ref.hi.note': 'CC0 公有领域，非本产品录制；只有伽耶特利有录音，其他段落退回设备朗读',
      'voice.sys.hi': '设备朗读（印地语语音）',
      'voice.sys.hi.note': '用印地语语音读梵文，发音不完全准确',
      'notice.hi.experience': '这是文化体验，不代表任何寺庙、教派或上师，也不承诺任何宗教效果。',
      'notice.hi.diversity': '印度教内部差别极大。这一版只做北印度一座供奉湿婆的小庙，不代表其他教派和地区。',
      'notice.hi.etiquette': '进庙脱鞋；用右手递接供品；神像只能观瞻，游戏里不可点击。',
      'notice.hi.practice': '观瞻、供奉、晚祷、持诵只记在功课簿里，不产出任何可花的东西；喂牛和狗用的粮食来自打扫河坛。',
      'preview.body.hi': '印度教版本由 AI 根据公开资料起草，没有经过祭司或学者审核，梵文与天城体也没有经过专家校对。读音、译文、礼仪说明和节日日期都可能有错，不代表任何寺庙。',
      'cal.note.hi': '节日按印度公布的日期；印度教节日按阴阳历，各地可能差一天。以当地寺庙为准。',
      'obs.hi.shivaratri': '湿婆之夜（Maha Shivaratri）',
      'obs.hi.holi': '洒红节（Holi）',
      'obs.hi.janmashtami': '黑天诞辰（Janmashtami）',
      'obs.hi.ganesh': '象头神节（Ganesh Chaturthi）',
      'obs.hi.dussehra': '十胜节（Dussehra）',
      'obs.hi.diwali': '排灯节（Diwali）',
      'obs.hi.devDeepawali': '天神排灯节（Dev Deepawali，瓦拉纳西河坛点灯）',
    },
    en: {
      'version.hinduism.ghat.name': 'Hinduism · a riverside Shiva shrine',
      'version.hinduism.ghat.place': 'Ghat Shrine',
      'version.hinduism.ghat.region': 'North India · along the Ganga',
      'version.hinduism.ghat.note': 'Darshan, puja, evening aarti, japa, and the temple’s cows',
      'opt.content.sa-Deva': 'Sanskrit (Devanagari)',
      'opt.content.sa-Latn': 'Sanskrit (IAST)',
      'opt.content.sa-both': 'Devanagari + IAST',
      'voice.ref.hi': 'Gayatri mantra reference recording',
      'voice.ref.hi.note': 'CC0 public domain, not recorded by us; only the Gayatri has a recording, other texts fall back to the device voice',
      'voice.sys.hi': 'Device voice (Hindi)',
      'voice.sys.hi.note': 'A Hindi voice reading Sanskrit; pronunciation is approximate',
      'notice.hi.experience': 'This is a cultural experience. It does not represent any temple, sampradaya or guru and promises no spiritual result.',
      'notice.hi.diversity': 'Hindu traditions vary enormously. This version is one small Shiva shrine in North India and does not stand for other traditions or regions.',
      'notice.hi.etiquette': 'Take off your shoes; give and receive offerings with the right hand. The murti is for darshan only and cannot be tapped in the game.',
      'notice.hi.practice': 'Darshan, puja, aarti and japa are only noted in the practice book and produce nothing to spend. The food for the cows and dogs comes from sweeping the ghat.',
      'preview.body.hi': 'The Hindu version was drafted by AI from public sources. No priest or scholar has reviewed it and the Sanskrit has not been checked by an expert. Pronunciation, translations, etiquette notes and dates may be wrong. It represents no temple.',
      'cal.note.hi': 'Festivals follow published Indian dates; Hindu festivals follow a lunisolar calendar and may differ by a day between regions. Follow the local temple.',
      'obs.hi.shivaratri': 'Maha Shivaratri',
      'obs.hi.holi': 'Holi',
      'obs.hi.janmashtami': 'Janmashtami',
      'obs.hi.ganesh': 'Ganesh Chaturthi',
      'obs.hi.dussehra': 'Dussehra',
      'obs.hi.diwali': 'Diwali',
      'obs.hi.devDeepawali': 'Dev Deepawali (lamps on the Varanasi ghats)',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
