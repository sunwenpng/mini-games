/*
 * 锡克教包的内容：《根本颂》（Mūl Mantar，《古鲁·格兰特·萨希卜》开篇，公有领域）。
 * 规则：只在“聆听 / 阅读”的情境出现，不用机器朗读（noTTS），配参考录音。转写为通行拼法，译文由 AI 起草。draft。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'pa', noTTS: true };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['sikhism.gurdwara'] = [
    rec({
      id: 'sikhism.gurdwara.mulMantar', key: 'mulMantar', type: 'scripture',
      title: { 'zh-CN': '根本颂（Mūl Mantar）', en: 'Mūl Mantar' },
      edition: 'Guru Granth Sahib, Ang 1', source: { id: 'SGGS 1', name: 'Guru Granth Sahib, Ang 1 (Japji Sahib opening)' },
      audio: 'ref.pa',
      text: {
        orig: ['ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ', 'ਨਿਰਭਉ ਨਿਰਵੈਰੁ', 'ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥', 'ਜਪੁ ॥', 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥', 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥'],
        latn: ['ik oankār sat nām kartā purakh', 'nirbhau nirvair', 'akāl mūrat ajūnī saibhaṅ gur prasād', 'jap', 'ād sach jugād sach', 'hai bhī sach nānak hosī bhī sach'],
      },
      translations: {
        'zh-CN': ['唯一的造化者，其名为真，是创造的本体，', '无所畏惧，无有仇恨，', '超越时间，不经生育，自在自存，借古鲁的恩典而被认识。', '诵念：', '太初即真，历劫皆真，', '那纳克说：如今亦真，将来亦真。'],
        en: ['One Creator, whose name is Truth, the creative being,', 'without fear, without enmity,', 'timeless in form, unborn, self-existent, known by the Guru’s grace.', 'Recite:', 'True in the beginning, true through the ages,', 'true now, says Nanak, and true for ever.'],
      },
    }),
    rec({
      id: 'sikhism.gurdwara.fateh', key: 'fateh', type: 'prayer',
      title: { 'zh-CN': '锡克问候语', en: 'The Sikh greeting' },
      edition: 'Common usage', source: { id: 'Khalsa greeting', name: 'Khalsa greeting (Guru Gobind Singh era)' },
      text: { orig: ['ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ', 'ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ'], latn: ['vāhigurū jī kā khālsā', 'vāhigurū jī kī fateh'] },
      translations: { 'zh-CN': ['卡尔萨属于神（Waheguru），', '胜利属于神。'], en: ['The Khalsa belongs to Waheguru,', 'victory belongs to Waheguru.'] },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
