/*
 * 藏传佛教包的诵读内容。藏文原文属公有领域（六字真言；阿底峡尊者的皈依发心偈）；转写为通行读音拼写，
 * 译文由 AI 起草。全部 draft，需藏传僧人或学者与藏语母语者审定。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'bo', tts: 'bo' };
  const rec = o => Object.assign({}, base, o);
  const OM = 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ༔';
  T.CONTENT['buddhism.tibetan'] = [
    rec({
      id: 'buddhism.tibetan.omMani', key: 'omMani', type: 'mantra',
      title: { 'zh-CN': '六字真言', en: 'Om mani padme hum', bo: 'ཡི་གེ་དྲུག་པ' },
      edition: 'Common Tibetan spelling', source: { id: 'Kāraṇḍavyūha', name: 'Kāraṇḍavyūha Sūtra (mantra of Avalokiteśvara)' },
      audio: 'ref.bo',
      text: { orig: [OM, OM, OM], latn: ['oṃ maṇi padme hūṃ', 'oṃ maṇi padme hūṃ', 'oṃ maṇi padme hūṃ'] },
      translations: {
        'zh-CN': ['唵嘛呢叭咪吽（观世音菩萨的心咒）', '唵嘛呢叭咪吽', '唵嘛呢叭咪吽'],
        en: ['Om, jewel in the lotus, hum (mantra of Avalokiteśvara, Chenrezig)', 'Om, jewel in the lotus, hum', 'Om, jewel in the lotus, hum'],
      },
    }),
    rec({
      id: 'buddhism.tibetan.refuge', key: 'refuge', type: 'refuge',
      title: { 'zh-CN': '皈依发心偈', en: 'Refuge and bodhicitta', bo: 'སྐྱབས་འགྲོ་སེམས་བསྐྱེད' },
      edition: 'Verse attributed to Atiśa, common Tibetan prayer books', source: { id: 'Atiśa', name: 'Atiśa Dīpaṃkara (11th c.), as recited in Tibetan prayer books' },
      text: {
        orig: [
          'སངས་རྒྱས་ཆོས་དང་ཚོགས་ཀྱི་མཆོག་རྣམས་ལ། །',
          'བྱང་ཆུབ་བར་དུ་བདག་ནི་སྐྱབས་སུ་མཆི། །',
          'བདག་གིས་སྦྱིན་སོགས་བགྱིས་པའི་བསོད་ནམས་ཀྱིས། །',
          'འགྲོ་ལ་ཕན་ཕྱིར་སངས་རྒྱས་འགྲུབ་པར་ཤོག །',
        ],
        latn: [
          'sangye chö dang tsok kyi chok nam la',
          'jangchub bardu dak ni kyab su chi',
          'dak gi jin sok gyi pé sönam kyi',
          'dro la pen chir sangye drub par shok',
        ],
      },
      translations: {
        'zh-CN': ['于佛、法与殊胜的僧众，', '直至菩提，我都皈依。', '愿以我布施等善行的功德，', '为利益众生而成就佛道。'],
        en: ['In the Buddha, the Dharma and the supreme Assembly', 'I take refuge until awakening.', 'By the merit of my giving and other good deeds,', 'may I attain buddhahood to benefit all beings.'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
