/*
 * 伊斯兰教包的阅读内容：《古兰经》开端章（阿拉伯原文公有领域）与宣礼词。
 * 英文用皮克索尔（Pickthall, 1930）译本（公有领域）；中文由 AI 新拟，只表达大意，不照抄现行中文译本。
 * 规则：noTTS（不用机器朗读）；开端章只显示文字，宣礼词配 CC0 录音。draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'ar', dir: 'rtl', noTTS: true };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['islam.mosque'] = [
    rec({
      id: 'islam.mosque.fatiha', key: 'fatiha', type: 'scripture',
      title: { 'zh-CN': '开端章（法蒂哈）', en: 'Al-Fātiḥa (The Opening)' },
      edition: 'Qur’an 1:1–7 (Ḥafṣ ʿan ʿĀṣim); English: Pickthall 1930', source: { id: 'Q 1', name: 'Qur’an, Sūrat al-Fātiḥa 1:1–7' },
      text: {
        orig: ['بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'الرَّحْمَٰنِ الرَّحِيمِ', 'مَالِكِ يَوْمِ الدِّينِ', 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'],
        latn: ['bismi llāhi r-raḥmāni r-raḥīm', 'al-ḥamdu lillāhi rabbi l-ʿālamīn', 'ar-raḥmāni r-raḥīm', 'māliki yawmi d-dīn', 'iyyāka naʿbudu wa-iyyāka nastaʿīn', 'ihdinā ṣ-ṣirāṭa l-mustaqīm', 'ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn'],
      },
      translations: {
        en: ['In the name of Allah, the Beneficent, the Merciful.', 'Praise be to Allah, Lord of the Worlds,', 'The Beneficent, the Merciful.', 'Owner of the Day of Judgment,', 'Thee (alone) we worship; Thee (alone) we ask for help.', 'Show us the straight path,', 'The path of those whom Thou hast favoured; not (the path) of those who earn Thine anger nor of those who go astray.'],
        'zh-CN': ['以普慈特慈的真主之名。', '赞美归于真主——众世界的养育者，', '普慈的、特慈的，', '审判之日的主宰。', '我们唯独敬拜你，唯独向你求助。', '求你指引我们正直的道路——', '你所恩待之人的道路，而非遭你恼怒之人、也非迷途之人的道路。'],
      },
    }),
    rec({
      id: 'islam.mosque.adhan', key: 'adhan', type: 'call',
      title: { 'zh-CN': '宣礼词（Adhan）', en: 'The call to prayer (Adhan)' },
      edition: 'Sunni form (each line repeated as customary)', source: { id: 'Adhan', name: 'The adhan, Sunni form' },
      audio: 'ref.ar',
      text: {
        orig: ['اللهُ أَكْبَرُ', 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ', 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ', 'حَيَّ عَلَى الصَّلَاةِ', 'حَيَّ عَلَى الْفَلَاحِ', 'اللهُ أَكْبَرُ', 'لَا إِلٰهَ إِلَّا اللهُ'],
        latn: ['allāhu akbar', 'ashhadu an lā ilāha illā llāh', 'ashhadu anna muḥammadan rasūlu llāh', 'ḥayya ʿalā ṣ-ṣalāh', 'ḥayya ʿalā l-falāḥ', 'allāhu akbar', 'lā ilāha illā llāh'],
      },
      translations: {
        en: ['God is greatest (four times).', 'I bear witness that there is no god but God (twice).', 'I bear witness that Muhammad is the messenger of God (twice).', 'Come to prayer (twice).', 'Come to success (twice).', 'God is greatest (twice).', 'There is no god but God.'],
        'zh-CN': ['真主至大（四遍）。', '我作证：除真主外，再无神明（两遍）。', '我作证：穆罕默德是真主的使者（两遍）。', '快来礼拜（两遍）。', '快来成功（两遍）。', '真主至大（两遍）。', '除真主外，再无神明。'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
