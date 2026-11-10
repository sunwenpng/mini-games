/* 印度新乘佛教包的诵读内容：天城体巴利文的礼敬文、三皈依、五戒（公有领域），译文由 AI 起草。全部 draft。 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'pi', tts: 'hi-IN', rate: 0.8 };
  const rec = o => Object.assign({}, base, o);
  const NAMO = 'नमो तस्स भगवतो अरहतो सम्मासम्बुद्धस्स';
  const NAMO_L = 'namo tassa bhagavato arahato sammāsambuddhassa';
  T.CONTENT['buddhism.india.navayana'] = [
    rec({
      id: 'buddhism.india.navayana.namo', key: 'namo', type: 'homage',
      title: { 'zh-CN': '礼敬文', en: 'Homage (Namo tassa)' },
      edition: 'Common Navayana vandana books', source: { id: 'Tipiṭaka', name: 'Pali Canon, e.g. MN 56' },
      text: { orig: [NAMO, NAMO, NAMO], latn: [NAMO_L, NAMO_L, NAMO_L] },
      translations: { 'zh-CN': ['礼敬彼世尊、阿罗汉、正等正觉者。', '礼敬彼世尊、阿罗汉、正等正觉者。', '礼敬彼世尊、阿罗汉、正等正觉者。'], en: ['Homage to the Blessed One, the Worthy One, the Perfectly Self-Awakened One.', 'Homage to the Blessed One, the Worthy One, the Perfectly Self-Awakened One.', 'Homage to the Blessed One, the Worthy One, the Perfectly Self-Awakened One.'] },
    }),
    rec({
      id: 'buddhism.india.navayana.tisarana', key: 'tisarana', type: 'refuge',
      title: { 'zh-CN': '三皈依（Trisaran）', en: 'The Three Refuges (Trisaran)' },
      edition: 'Common Navayana vandana books', source: { id: 'Khp 1', name: 'Khuddakapāṭha 1 (Saraṇattaya)' },
      audio: 'ref.nv',
      text: {
        orig: ['बुद्धं सरणं गच्छामि', 'धम्मं सरणं गच्छामि', 'संघं सरणं गच्छामि', 'दुतियम्पि बुद्धं सरणं गच्छामि', 'दुतियम्पि धम्मं सरणं गच्छामि', 'दुतियम्पि संघं सरणं गच्छामि', 'ततियम्पि बुद्धं सरणं गच्छामि', 'ततियम्पि धम्मं सरणं गच्छामि', 'ततियम्पि संघं सरणं गच्छामि'],
        latn: ['buddhaṃ saraṇaṃ gacchāmi', 'dhammaṃ saraṇaṃ gacchāmi', 'saṅghaṃ saraṇaṃ gacchāmi', 'dutiyampi buddhaṃ saraṇaṃ gacchāmi', 'dutiyampi dhammaṃ saraṇaṃ gacchāmi', 'dutiyampi saṅghaṃ saraṇaṃ gacchāmi', 'tatiyampi buddhaṃ saraṇaṃ gacchāmi', 'tatiyampi dhammaṃ saraṇaṃ gacchāmi', 'tatiyampi saṅghaṃ saraṇaṃ gacchāmi'],
      },
      translations: {
        'zh-CN': ['我皈依佛。', '我皈依法。', '我皈依僧。', '第二次，我皈依佛。', '第二次，我皈依法。', '第二次，我皈依僧。', '第三次，我皈依佛。', '第三次，我皈依法。', '第三次，我皈依僧。'],
        en: ['I go to the Buddha for refuge.', 'I go to the Dhamma for refuge.', 'I go to the Sangha for refuge.', 'For the second time, I go to the Buddha for refuge.', 'For the second time, I go to the Dhamma for refuge.', 'For the second time, I go to the Sangha for refuge.', 'For the third time, I go to the Buddha for refuge.', 'For the third time, I go to the Dhamma for refuge.', 'For the third time, I go to the Sangha for refuge.'],
      },
    }),
    rec({
      id: 'buddhism.india.navayana.panchshil', key: 'panchshil', type: 'precepts',
      title: { 'zh-CN': '五戒（Panchshil）', en: 'The Five Precepts (Panchshil)' },
      edition: 'Common Navayana vandana books', source: { id: 'Khp 2', name: 'Khuddakapāṭha 2, first five' },
      text: {
        orig: ['पाणातिपाता वेरमणी सिक्खापदं समादियामि', 'अदिन्नादाना वेरमणी सिक्खापदं समादियामि', 'कामेसु मिच्छाचारा वेरमणी सिक्खापदं समादियामि', 'मुसावादा वेरमणी सिक्खापदं समादियामि', 'सुरामेरयमज्जपमादट्ठाना वेरमणी सिक्खापदं समादियामि'],
        latn: ['pāṇātipātā veramaṇī sikkhāpadaṃ samādiyāmi', 'adinnādānā veramaṇī sikkhāpadaṃ samādiyāmi', 'kāmesu micchācārā veramaṇī sikkhāpadaṃ samādiyāmi', 'musāvādā veramaṇī sikkhāpadaṃ samādiyāmi', 'surāmerayamajjapamādaṭṭhānā veramaṇī sikkhāpadaṃ samādiyāmi'],
      },
      translations: {
        'zh-CN': ['我受持离杀生的学处。', '我受持离不与取的学处。', '我受持离欲邪行的学处。', '我受持离妄语的学处。', '我受持离谷酒、花酒等令人放逸之因的学处。'],
        en: ['I undertake the training rule to refrain from taking life.', 'I undertake the training rule to refrain from taking what is not given.', 'I undertake the training rule to refrain from sexual misconduct.', 'I undertake the training rule to refrain from false speech.', 'I undertake the training rule to refrain from intoxicating drinks and drugs that lead to carelessness.'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
