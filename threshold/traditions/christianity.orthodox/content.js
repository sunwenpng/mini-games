/* 东正教包的短祷：耶稣祷文、三圣颂、主怜悯、复活节赞词（希腊文礼仪文本，公有领域）。转写与译文由 AI 起草。draft。 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'el', tts: 'el-GR', rate: 0.8 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['christianity.orthodox'] = [
    rec({
      id: 'christianity.orthodox.jesusPrayer', key: 'jesusPrayer', type: 'prayer',
      title: { 'zh-CN': '耶稣祷文', en: 'The Jesus Prayer' },
      edition: 'Philokalia tradition', source: { id: 'Jesus Prayer', name: 'The Jesus Prayer (Greek liturgical form)' },
      text: { orig: ['Κύριε Ἰησοῦ Χριστέ,', 'Υἱὲ τοῦ Θεοῦ,', 'ἐλέησόν με τὸν ἁμαρτωλόν.'], latn: ['Kýrie Iisoú Christé,', 'Yié tou Theoú,', 'eléison me ton amartolón.'] },
      translations: { 'zh-CN': ['主耶稣基督，', '神的儿子，', '求你怜悯我这个罪人。'], en: ['Lord Jesus Christ,', 'Son of God,', 'have mercy on me, a sinner.'] },
    }),
    rec({
      id: 'christianity.orthodox.kyrie', key: 'kyrie', type: 'prayer',
      title: { 'zh-CN': '主，怜悯（Kyrie eleison）', en: 'Kyrie eleison' },
      edition: 'Litany response', source: { id: 'Kyrie', name: 'Litany response of the Divine Liturgy' },
      audio: 'ref.orth',
      text: { orig: ['Κύριε, ἐλέησον.', 'Κύριε, ἐλέησον.', 'Κύριε, ἐλέησον.'], latn: ['Kýrie, eléison.', 'Kýrie, eléison.', 'Kýrie, eléison.'] },
      translations: { 'zh-CN': ['主，怜悯。', '主，怜悯。', '主，怜悯。'], en: ['Lord, have mercy.', 'Lord, have mercy.', 'Lord, have mercy.'] },
    }),
    rec({
      id: 'christianity.orthodox.trisagion', key: 'trisagion', type: 'hymn',
      title: { 'zh-CN': '三圣颂', en: 'Trisagion' },
      edition: 'Divine Liturgy', source: { id: 'Trisagion', name: 'Trisagion hymn (5th c.)' },
      text: { orig: ['Ἅγιος ὁ Θεός,', 'Ἅγιος ἰσχυρός,', 'Ἅγιος ἀθάνατος,', 'ἐλέησον ἡμᾶς.'], latn: ['Ágios o Theós,', 'Ágios ischyrós,', 'Ágios athánatos,', 'eléison imás.'] },
      translations: { 'zh-CN': ['圣哉，上帝；', '圣哉，大能者；', '圣哉，永生者；', '求你怜悯我们。'], en: ['Holy God,', 'Holy Mighty,', 'Holy Immortal,', 'have mercy on us.'] },
    }),
    rec({
      id: 'christianity.orthodox.christosAnesti', key: 'christosAnesti', type: 'hymn',
      title: { 'zh-CN': '复活节赞词', en: 'Paschal troparion' },
      edition: 'Paschal troparion', source: { id: 'Paschal troparion', name: 'Troparion of Pascha' },
      text: { orig: ['Χριστὸς ἀνέστη ἐκ νεκρῶν,', 'θανάτῳ θάνατον πατήσας,', 'καὶ τοῖς ἐν τοῖς μνήμασι', 'ζωὴν χαρισάμενος.'], latn: ['Christós anésti ek nekrón,', 'thanáto thánaton patísas,', 'ke tis en tis mnímasi', 'zoín charisámenos.'] },
      translations: { 'zh-CN': ['基督从死者中复活，', '以死胜死，', '并把生命', '赐给坟墓中的人。'], en: ['Christ is risen from the dead,', 'trampling down death by death,', 'and upon those in the tombs', 'bestowing life.'] },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
