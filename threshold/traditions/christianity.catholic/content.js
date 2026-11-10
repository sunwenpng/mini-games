/*
 * 天主教包的经文：《天主经》《圣母经》《圣三光荣经》，拉丁文通行本（公有领域）。
 * 英文用传统英文本（公有领域）；中文按通行中文经文的意思由 AI 重新起草，不照抄现行的教会译本。draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'la', tts: 'it-IT', rate: 0.8 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['christianity.catholic'] = [
    rec({
      id: 'christianity.catholic.paterNoster', key: 'paterNoster', type: 'prayer',
      title: { 'zh-CN': '天主经（Pater Noster）', en: 'The Lord’s Prayer (Pater Noster)' },
      edition: 'Roman Missal (Latin)', source: { id: 'Mt 6:9-13', name: 'Matthew 6:9–13, Latin liturgical text' },
      audio: 'ref.la.pater',
      text: { orig: ['Pater noster, qui es in caelis,', 'sanctificetur nomen tuum.', 'Adveniat regnum tuum.', 'Fiat voluntas tua, sicut in caelo et in terra.', 'Panem nostrum quotidianum da nobis hodie,', 'et dimitte nobis debita nostra,', 'sicut et nos dimittimus debitoribus nostris.', 'Et ne nos inducas in tentationem,', 'sed libera nos a malo. Amen.'] },
      translations: {
        en: ['Our Father, who art in heaven,', 'hallowed be thy name;', 'thy kingdom come;', 'thy will be done on earth as it is in heaven.', 'Give us this day our daily bread;', 'and forgive us our trespasses', 'as we forgive those who trespass against us;', 'and lead us not into temptation,', 'but deliver us from evil. Amen.'],
        'zh-CN': ['我们在天上的父，', '愿你的名被尊为圣；', '愿你的国来临；', '愿你的旨意行在地上，如同在天上。', '求你今天赐给我们日用的食粮；', '求你宽恕我们的罪过，', '正如我们宽恕得罪我们的人；', '不要让我们陷于诱惑，', '但救我们脱离凶恶。阿们。'],
      },
    }),
    rec({
      id: 'christianity.catholic.aveMaria', key: 'aveMaria', type: 'prayer',
      title: { 'zh-CN': '圣母经（Ave Maria）', en: 'Hail Mary (Ave Maria)' },
      edition: 'Latin liturgical text', source: { id: 'Lk 1:28,42', name: 'Luke 1:28, 1:42 and the Church’s petition' },
      audio: 'ref.la',
      text: { orig: ['Ave Maria, gratia plena,', 'Dominus tecum.', 'Benedicta tu in mulieribus,', 'et benedictus fructus ventris tui, Iesus.', 'Sancta Maria, Mater Dei,', 'ora pro nobis peccatoribus,', 'nunc et in hora mortis nostrae. Amen.'] },
      translations: {
        en: ['Hail Mary, full of grace,', 'the Lord is with thee.', 'Blessed art thou among women,', 'and blessed is the fruit of thy womb, Jesus.', 'Holy Mary, Mother of God,', 'pray for us sinners,', 'now and at the hour of our death. Amen.'],
        'zh-CN': ['万福玛利亚，满被圣宠者，', '主与你同在。', '你在妇女中蒙受祝福，', '你的胎儿耶稣也蒙受祝福。', '天主之母圣玛利亚，', '求你为我们罪人祈求，', '现在和我们临终的时候。阿们。'],
      },
    }),
    rec({
      id: 'christianity.catholic.gloria', key: 'gloria', type: 'prayer',
      title: { 'zh-CN': '圣三光荣经（Gloria Patri）', en: 'Glory Be (Gloria Patri)' },
      edition: 'Latin liturgical text', source: { id: 'Gloria Patri', name: 'Doxology, Latin liturgical text' },
      text: { orig: ['Gloria Patri, et Filio, et Spiritui Sancto.', 'Sicut erat in principio, et nunc, et semper,', 'et in saecula saeculorum. Amen.'] },
      translations: {
        en: ['Glory be to the Father, and to the Son, and to the Holy Spirit.', 'As it was in the beginning, is now, and ever shall be,', 'world without end. Amen.'],
        'zh-CN': ['愿光荣归于父、归于子、归于圣神。', '起初如何，现在如何，永远如何，', '世世无穷。阿们。'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
