/*
 * 日本佛教包（禅宗风格）的读经内容：日本通行的《般若心经》、《延命十句观音经》、《四弘誓愿》。
 * 原文属公有领域；罗马字按日本寺院常见读法；译文由 AI 起草。全部 draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'ja', tts: 'ja-JP', rate: 0.85 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['buddhism.japan'] = [
    rec({
      id: 'buddhism.japan.hannya', key: 'hannya', type: 'sutra',
      title: { 'zh-CN': '般若心经（日本读法）', en: 'Heart Sutra (Japanese reading)', ja: '般若心経' },
      edition: 'Xuanzang (T251), Japanese temple reading', source: { id: 'T0251', name: 'Taishō 251, as chanted in Japanese temples' },
      audio: 'ref.ja',
      text: {
        orig: [
          '摩訶般若波羅蜜多心経', '観自在菩薩 行深般若波羅蜜多時', '照見五蘊皆空 度一切苦厄', '舎利子 色不異空 空不異色', '色即是空 空即是色 受想行識亦復如是',
          '舎利子 是諸法空相 不生不滅 不垢不浄 不増不減', '是故空中 無色無受想行識', '無眼耳鼻舌身意 無色声香味触法', '無眼界乃至無意識界', '無無明亦無無明尽 乃至無老死亦無老死尽',
          '無苦集滅道 無智亦無得 以無所得故', '菩提薩埵 依般若波羅蜜多故 心無罣礙', '無罣礙故 無有恐怖 遠離一切顛倒夢想 究竟涅槃', '三世諸仏 依般若波羅蜜多故 得阿耨多羅三藐三菩提',
          '故知般若波羅蜜多 是大神呪 是大明呪 是無上呪 是無等等呪', '能除一切苦 真実不虚', '故説般若波羅蜜多呪 即説呪曰', '羯諦羯諦 波羅羯諦 波羅僧羯諦 菩提薩婆訶', '般若心経',
        ],
        latn: [
          'Maka hannya haramita shingyō', 'Kanjizai bosatsu gyō jin hannya haramita ji', 'shōken go’on kai kū do issai kuyaku', 'sharishi shiki fu i kū kū fu i shiki', 'shiki soku ze kū kū soku ze shiki ju sō gyō shiki yaku bu nyo ze',
          'sharishi ze shohō kūsō fu shō fu metsu fu ku fu jō fu zō fu gen', 'ze ko kū chū mu shiki mu ju sō gyō shiki', 'mu gen ni bi zesshin i mu shiki shō kō mi soku hō', 'mu gen kai nai shi mu i shiki kai', 'mu mu myō yaku mu mu myō jin nai shi mu rō shi yaku mu rō shi jin',
          'mu ku shū metsu dō mu chi yaku mu toku i mu sho tokko', 'bodaisatta e hannya haramita ko shin mu keige', 'mu keige ko mu u kufu onri issai tendō musō kukyō nehan', 'san ze sho butsu e hannya haramita ko toku anokutara sanmyaku sanbodai',
          'ko chi hannya haramita ze dai jin shu ze dai myō shu ze mu jō shu ze mu tō dō shu', 'nō jo issai ku shinjitsu fu ko', 'ko setsu hannya haramita shu soku setsu shu watsu', 'gyatei gyatei hara gyatei hara sō gyatei boji sowaka', 'hannya shingyō',
        ],
      },
      translations: {
        'zh-CN': [
          '《摩诃般若波罗蜜多心经》', '观自在菩萨深入修行般若波罗蜜多时，', '照见五蕴都是空的，度脱一切苦厄。', '舍利子，色不异于空，空不异于色，', '色就是空，空就是色；受、想、行、识也是这样。',
          '舍利子，一切法都是空相：不生不灭，不垢不净，不增不减。', '所以在空中没有色，没有受想行识，', '没有眼耳鼻舌身意，没有色声香味触法，', '没有眼界，乃至没有意识界，', '没有无明，也没有无明的尽头，乃至没有老死，也没有老死的尽头。',
          '没有苦集灭道，没有智也没有得；因为无所得，', '菩萨依般若波罗蜜多，心中没有挂碍；', '没有挂碍，所以没有恐怖，远离一切颠倒梦想，最终达到涅槃。', '三世诸佛依般若波罗蜜多，得到无上正等正觉。',
          '所以知道般若波罗蜜多是大神咒、大明咒、无上咒、无等等咒，', '能除去一切苦，真实不虚。', '所以说般若波罗蜜多咒，咒语是：', '揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。', '般若心经（完）',
        ],
        en: [
          'The Great Heart of Perfect Wisdom Sūtra', 'Avalokiteśvara Bodhisattva, practising deeply the perfection of wisdom,', 'saw that the five aggregates are empty and passed beyond all suffering.', 'Śāriputra, form is not other than emptiness, emptiness not other than form;', 'form is emptiness, emptiness is form; so too feeling, perception, formations and consciousness.',
          'Śāriputra, all dharmas are marked by emptiness: not born, not destroyed, not defiled, not pure, not increasing, not decreasing.', 'Therefore in emptiness there is no form, no feeling, perception, formations or consciousness,', 'no eye, ear, nose, tongue, body or mind, no sight, sound, smell, taste, touch or object of mind,', 'no realm of sight, up to no realm of mind-consciousness,', 'no ignorance and no end of ignorance, up to no old age and death and no end of old age and death,',
          'no suffering, origin, cessation or path, no wisdom and no attainment. With nothing to attain,', 'the bodhisattva relies on the perfection of wisdom, and the mind has no hindrance;', 'without hindrance there is no fear; far from all upside-down views, one reaches nirvāṇa.', 'All buddhas of the three times rely on the perfection of wisdom and attain supreme awakening.',
          'Know then that the perfection of wisdom is the great mantra, the bright mantra, the supreme mantra, the unequalled mantra,', 'which removes all suffering; it is true, not false.', 'So the mantra of the perfection of wisdom is spoken:', 'gate gate pāragate pārasaṃgate bodhi svāhā.', 'Heart Sūtra',
        ],
      },
    }),
    rec({
      id: 'buddhism.japan.enmei', key: 'enmei', type: 'sutra',
      title: { 'zh-CN': '延命十句观音经', en: 'Ten-Line Kannon Sūtra for Long Life', ja: '延命十句観音経' },
      edition: 'Common Zen chanting book', source: { id: 'Enmei Jikku Kannon-gyō', name: 'Enmei Jikku Kannon-gyō (Chinese text, popularised by Hakuin)' },
      text: {
        orig: ['観世音', '南無仏', '与仏有因', '与仏有縁', '仏法僧縁', '常楽我浄', '朝念観世音', '暮念観世音', '念念従心起', '念念不離心'],
        latn: ['Kanzeon', 'namu butsu', 'yo butsu u in', 'yo butsu u en', 'buppō sō en', 'jō raku ga jō', 'chō nen kanzeon', 'bo nen kanzeon', 'nen nen jū shin ki', 'nen nen fu ri shin'],
      },
      translations: {
        'zh-CN': ['观世音，', '皈命于佛。', '与佛有因，', '与佛有缘，', '与佛法僧有缘，', '常、乐、我、净。', '早晨念观世音，', '傍晚念观世音，', '念念从心生起，', '念念不离此心。'],
        en: ['Kanzeon!', 'Homage to the Buddha.', 'With the Buddha we have our source,', 'with the Buddha we have affinity,', 'affinity with Buddha, Dharma and Sangha,', 'constancy, joy, self and purity.', 'In the morning, think of Kanzeon;', 'in the evening, think of Kanzeon.', 'Each thought arises from mind;', 'each thought is not separate from mind.'],
      },
    }),
    rec({
      id: 'buddhism.japan.shiguseigan', key: 'shiguseigan', type: 'gatha',
      title: { 'zh-CN': '四弘誓愿', en: 'The Four Great Vows', ja: '四弘誓願文' },
      edition: 'Common Zen chanting book', source: { id: 'Shiguseigan', name: 'Four Bodhisattva Vows (Chinese text, Tiantai origin)' },
      text: {
        orig: ['衆生無辺誓願度', '煩悩無尽誓願断', '法門無量誓願学', '仏道無上誓願成'],
        latn: ['shujō muhen seigan do', 'bonnō mujin seigan dan', 'hōmon muryō seigan gaku', 'butsudō mujō seigan jō'],
      },
      translations: {
        'zh-CN': ['众生无边，誓愿度尽；', '烦恼无尽，誓愿断除；', '法门无量，誓愿学习；', '佛道无上，誓愿成就。'],
        en: ['Beings are numberless; I vow to free them.', 'Delusions are inexhaustible; I vow to end them.', 'Dharma gates are boundless; I vow to enter them.', 'The Buddha way is unsurpassable; I vow to realise it.'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
