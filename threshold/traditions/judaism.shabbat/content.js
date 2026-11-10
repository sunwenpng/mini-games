/*
 * 犹太教包的阅读内容：《示玛》（申命记 6:4–5，希伯来原文公有领域）与安息日歌《平安临到你们》（17 世纪，公有领域）。
 * 神名写作 ה׳，转写 Adonai；英文参考 JPS 1917（公有领域）；中文依和合本句意，神名改为“主”以合犹太习惯。noTTS。draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'he', dir: 'rtl', noTTS: true };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['judaism.shabbat'] = [
    rec({
      id: 'judaism.shabbat.shema', key: 'shema', type: 'scripture',
      title: { 'zh-CN': '示玛（以色列啊，你要听）', en: 'Shema Yisrael' },
      edition: 'Deuteronomy 6:4–5 with the customary response; divine name abbreviated', source: { id: 'Deut 6:4-5', name: 'Deuteronomy 6:4–5' },
      audio: 'ref.he',
      text: {
        orig: ['שְׁמַע יִשְׂרָאֵל ה׳ אֱלֹהֵינוּ ה׳ אֶחָד', 'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד', 'וְאָהַבְתָּ אֵת ה׳ אֱלֹהֶיךָ', 'בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ'],
        latn: ['Shema Yisrael, Adonai Eloheinu, Adonai echad.', 'Baruch shem kevod malchuto le‘olam va‘ed.', 'Ve’ahavta et Adonai Elohecha', 'bechol levavcha uvechol nafshecha uvechol me’odecha.'],
      },
      translations: {
        en: ['Hear, O Israel: the LORD our God, the LORD is one.', '(Blessed be the name of His glorious kingdom for ever and ever.)', 'And thou shalt love the LORD thy God', 'with all thy heart, and with all thy soul, and with all thy might.'],
        'zh-CN': ['以色列啊，你要听：主是我们的神，主是独一的。', '（愿他荣耀国度的名永远受称颂。）', '你要爱主你的神，', '尽心、尽性、尽力。'],
      },
    }),
    rec({
      id: 'judaism.shabbat.shalomAleichem', key: 'shalomAleichem', type: 'hymn',
      title: { 'zh-CN': '平安临到你们（安息日歌）', en: 'Shalom Aleichem (Shabbat song)' },
      edition: 'First verse, 17th-century kabbalistic song', source: { id: 'Shalom Aleichem', name: 'Shalom Aleichem, sung on Friday night' },
      text: {
        orig: ['שָׁלוֹם עֲלֵיכֶם מַלְאֲכֵי הַשָּׁרֵת', 'מַלְאֲכֵי עֶלְיוֹן', 'מִמֶּלֶךְ מַלְכֵי הַמְּלָכִים', 'הַקָּדוֹשׁ בָּרוּךְ הוּא'],
        latn: ['Shalom aleichem, malachei hashareit,', 'malachei elyon,', 'mimelech malchei hamelachim,', 'HaKadosh baruch hu.'],
      },
      translations: {
        en: ['Peace be upon you, ministering angels,', 'angels of the Most High,', 'from the King of kings,', 'the Holy One, blessed be He.'],
        'zh-CN': ['愿平安临到你们，侍奉的天使，', '至高者的天使，', '来自万王之王——', '那圣者，愿他受称颂。'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
