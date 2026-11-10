/* 道教包的读经内容：《道德经》第一、八章，《太上老君说常清静经》开篇（公有领域）。拼音与译文由 AI 起草。draft。 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'zh', origLang: 'zh', tts: 'zh-CN', rate: 0.75 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['daoism.mountain'] = [
    rec({
      id: 'daoism.mountain.ddj1', key: 'ddj1', type: 'scripture',
      title: { 'zh-CN': '道德经 · 第一章', en: 'Daodejing, chapter 1' },
      edition: '王弼本', source: { id: 'DDJ 1', name: '《道德经》第一章（王弼本）' },
      text: {
        orig: ['道可道，非常道；', '名可名，非常名。', '无名，天地之始；有名，万物之母。', '故常无欲，以观其妙；常有欲，以观其徼。', '此两者同出而异名，同谓之玄。', '玄之又玄，众妙之门。'],
        latn: ['dào kě dào, fēi cháng dào;', 'míng kě míng, fēi cháng míng.', 'wú míng, tiān dì zhī shǐ; yǒu míng, wàn wù zhī mǔ.', 'gù cháng wú yù, yǐ guān qí miào; cháng yǒu yù, yǐ guān qí jiào.', 'cǐ liǎng zhě tóng chū ér yì míng, tóng wèi zhī xuán.', 'xuán zhī yòu xuán, zhòng miào zhī mén.'],
      },
      translations: {
        'zh-CN': ['能说出来的道，不是恒常的道；', '能叫出来的名，不是恒常的名。', '无名，是天地的开端；有名，是万物的母亲。', '所以常处于无欲，去体会它的奥妙；常处于有欲，去看它的边际。', '这两者出于同一来源而名称不同，都可以叫作“玄”。', '玄而又玄，是一切奥妙的门。'],
        en: ['The Way that can be spoken of is not the constant Way;', 'the name that can be named is not the constant name.', 'Nameless, it is the beginning of heaven and earth; named, it is the mother of all things.', 'So, ever without desire, one sees its subtlety; ever with desire, one sees its bounds.', 'These two come from the same source but differ in name; both are called mystery.', 'Mystery upon mystery, the gate of all wonders.'],
      },
    }),
    rec({
      id: 'daoism.mountain.ddj8', key: 'ddj8', type: 'scripture',
      title: { 'zh-CN': '道德经 · 第八章（上善若水）', en: 'Daodejing, chapter 8' },
      edition: '王弼本', source: { id: 'DDJ 8', name: '《道德经》第八章（王弼本）' },
      text: {
        orig: ['上善若水。', '水善利万物而不争，', '处众人之所恶，故几于道。', '居善地，心善渊，与善仁，', '言善信，正善治，事善能，动善时。', '夫唯不争，故无尤。'],
        latn: ['shàng shàn ruò shuǐ.', 'shuǐ shàn lì wàn wù ér bù zhēng,', 'chǔ zhòng rén zhī suǒ wù, gù jī yú dào.', 'jū shàn dì, xīn shàn yuān, yǔ shàn rén,', 'yán shàn xìn, zhèng shàn zhì, shì shàn néng, dòng shàn shí.', 'fū wéi bù zhēng, gù wú yóu.'],
      },
      translations: {
        'zh-CN': ['最高的善像水一样。', '水善于滋养万物而不与之争，', '停留在众人厌恶的低处，所以接近于道。', '居处善于选地，心善于沉静，待人善于仁爱，', '说话善于守信，为政善于治理，做事善于发挥所长，行动善于把握时机。', '正因为不争，所以没有过失。'],
        en: ['The highest good is like water.', 'Water benefits all things and does not contend;', 'it rests in the low places people disdain, and so is close to the Way.', 'In dwelling, choose the ground well; in mind, be deep; in giving, be kind;', 'in speech, be true; in governing, keep order; in work, be able; in action, be timely.', 'Because it does not contend, it is free from blame.'],
      },
    }),
    rec({
      id: 'daoism.mountain.qingjing', key: 'qingjing', type: 'scripture',
      title: { 'zh-CN': '清静经（开篇）', en: 'Scripture of Clarity and Stillness (opening)' },
      edition: '《太上老君说常清静经》通行本', source: { id: 'Qingjing jing', name: '《太上老君说常清静经》（唐代，正统道藏）' },
      text: {
        orig: ['老君曰：', '大道无形，生育天地；', '大道无情，运行日月；', '大道无名，长养万物；', '吾不知其名，强名曰道。'],
        latn: ['lǎo jūn yuē:', 'dà dào wú xíng, shēng yù tiān dì;', 'dà dào wú qíng, yùn xíng rì yuè;', 'dà dào wú míng, zhǎng yǎng wàn wù;', 'wú bù zhī qí míng, qiǎng míng yuē dào.'],
      },
      translations: {
        'zh-CN': ['老君说：', '大道没有形体，却生育了天地；', '大道没有情感，却运行着日月；', '大道没有名字，却长养着万物；', '我不知道它的名字，勉强叫它“道”。'],
        en: ['Laojun said:', 'The great Way has no form, yet it gives birth to heaven and earth;', 'the great Way has no feelings, yet it moves the sun and moon;', 'the great Way has no name, yet it nourishes all things;', 'I do not know its name; forced to name it, I call it the Way.'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
