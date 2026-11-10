/*
 * 新教包的经文与圣诗：英王钦定本（1611）主祷文、诗篇 23 篇；圣诗《奇异恩典》（约翰·牛顿，1779）——均为公有领域。
 * 中文：经文用和合本（1919，公有领域）；圣诗中文由 AI 新译，不照抄现行赞美诗本。draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'en', tts: 'en-GB', rate: 0.9 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['christianity.protestant'] = [
    rec({
      id: 'christianity.protestant.lordsPrayer', key: 'lordsPrayer', type: 'prayer',
      title: { 'zh-CN': '主祷文', en: 'The Lord’s Prayer' },
      edition: 'King James Version, Matthew 6:9–13; 和合本', source: { id: 'Mt 6:9-13', name: 'Matthew 6:9–13 (KJV 1611; Chinese Union Version 1919)' },
      text: { orig: ['Our Father which art in heaven, Hallowed be thy name.', 'Thy kingdom come. Thy will be done in earth, as it is in heaven.', 'Give us this day our daily bread.', 'And forgive us our debts, as we forgive our debtors.', 'And lead us not into temptation, but deliver us from evil:', 'For thine is the kingdom, and the power, and the glory, for ever. Amen.'] },
      translations: { 'zh-CN': ['我们在天上的父：愿人都尊你的名为圣。', '愿你的国降临；愿你的旨意行在地上，如同行在天上。', '我们日用的饮食，今日赐给我们。', '免我们的债，如同我们免了人的债。', '不叫我们遇见试探；救我们脱离凶恶。', '因为国度、权柄、荣耀，全是你的，直到永远。阿们！'] },
    }),
    rec({
      id: 'christianity.protestant.psalm23', key: 'psalm23', type: 'scripture',
      title: { 'zh-CN': '诗篇 23 篇', en: 'Psalm 23' },
      edition: 'King James Version; 和合本', source: { id: 'Ps 23', name: 'Psalm 23 (KJV 1611; Chinese Union Version 1919)' },
      text: { orig: ['The LORD is my shepherd; I shall not want.', 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.', 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.', 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.', 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.', 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.'] },
      translations: { 'zh-CN': ['耶和华是我的牧者，我必不至缺乏。', '他使我躺卧在青草地上，领我在可安歇的水边。', '他使我的灵魂苏醒，为自己的名引导我走义路。', '我虽然行过死荫的幽谷，也不怕遭害，因为你与我同在；你的杖，你的竿，都安慰我。', '在我敌人面前，你为我摆设筵席；你用油膏了我的头，使我的福杯满溢。', '我一生一世必有恩惠慈爱随着我；我且要住在耶和华的殿中，直到永远。'] },
    }),
    rec({
      id: 'christianity.protestant.amazingGrace', key: 'amazingGrace', type: 'hymn',
      title: { 'zh-CN': '奇异恩典（圣诗）', en: 'Amazing Grace (hymn)' },
      edition: 'Olney Hymns (1779), verses 1–2', source: { id: 'Olney Hymns 41', name: 'John Newton, Olney Hymns (1779)' },
      audio: 'ref.prot',
      text: { orig: ['Amazing grace! how sweet the sound', 'That saved a wretch like me!', 'I once was lost, but now am found;', 'Was blind, but now I see.', '’Twas grace that taught my heart to fear,', 'And grace my fears relieved;', 'How precious did that grace appear', 'The hour I first believed!'] },
      translations: { 'zh-CN': ['奇异的恩典，多么甜美的声音，', '救了我这样一个卑微的人！', '我曾经迷失，如今被找回；', '曾经盲目，如今看见。', '是恩典教我的心敬畏，', '也是恩典解除我的惧怕；', '那恩典显得多么宝贵，', '在我初信的那一刻！'] },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
