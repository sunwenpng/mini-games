/*
 * 印度教包的诵读内容：吠陀与奥义书中的几段常诵文（公有领域）。转写用 IAST；译文由 AI 起草。全部 draft。
 * 注意：部分传统认为伽耶特利曼陀罗需经入门（upanayana）才念诵；这里只作文本展示与参考录音。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};
  const base = { license: 'public-domain-text', territory: ['*'], reviewStatus: 'draft', reviewers: [], titleLang: 'zh-CN', editionLang: 'en', origLang: 'sa', tts: 'hi-IN', rate: 0.8 };
  const rec = o => Object.assign({}, base, o);
  T.CONTENT['hinduism.ghat'] = [
    rec({
      id: 'hinduism.ghat.gayatri', key: 'gayatri', type: 'mantra',
      title: { 'zh-CN': '伽耶特利曼陀罗', en: 'Gāyatrī mantra' },
      edition: 'Ṛgveda 3.62.10 with the vyāhṛti', source: { id: 'RV 3.62.10', name: 'Ṛgveda 3.62.10' },
      audio: 'ref.hi',
      text: {
        orig: ['ॐ भूर्भुवः स्वः', 'तत्सवितुर्वरेण्यं', 'भर्गो देवस्य धीमहि', 'धियो यो नः प्रचोदयात्'],
        latn: ['oṃ bhūr bhuvaḥ svaḥ', 'tat savitur vareṇyaṃ', 'bhargo devasya dhīmahi', 'dhiyo yo naḥ pracodayāt'],
      },
      translations: {
        'zh-CN': ['唵，地、空、天。', '那值得敬仰的萨维特利（太阳神）的', '神圣光辉，我们冥想它；', '愿它启发我们的心智。'],
        en: ['Om, earth, sky, heaven.', 'On that adorable', 'radiance of the divine Savitṛ we meditate;', 'may it inspire our minds.'],
      },
    }),
    rec({
      id: 'hinduism.ghat.panchakshara', key: 'panchakshara', type: 'mantra',
      title: { 'zh-CN': '五字真言（湿婆）', en: 'Pañcākṣara (Śiva)' },
      edition: 'Common devotional form', source: { id: 'Yajurveda', name: 'Śrī Rudram (Kṛṣṇa Yajurveda), devotional form' },
      text: { orig: ['ॐ नमः शिवाय', 'ॐ नमः शिवाय', 'ॐ नमः शिवाय'], latn: ['oṃ namaḥ śivāya', 'oṃ namaḥ śivāya', 'oṃ namaḥ śivāya'] },
      translations: { 'zh-CN': ['唵，礼敬湿婆。', '唵，礼敬湿婆。', '唵，礼敬湿婆。'], en: ['Om, salutation to Śiva.', 'Om, salutation to Śiva.', 'Om, salutation to Śiva.'] },
    }),
    rec({
      id: 'hinduism.ghat.mahamrityunjaya', key: 'mahamrityunjaya', type: 'mantra',
      title: { 'zh-CN': '大胜死真言', en: 'Mahāmṛtyuñjaya mantra' },
      edition: 'Ṛgveda 7.59.12', source: { id: 'RV 7.59.12', name: 'Ṛgveda 7.59.12' },
      text: {
        orig: ['ॐ त्र्यम्बकं यजामहे', 'सुगन्धिं पुष्टिवर्धनम्', 'उर्वारुकमिव बन्धनान्', 'मृत्योर्मुक्षीय माऽमृतात्'],
        latn: ['oṃ tryambakaṃ yajāmahe', 'sugandhiṃ puṣṭivardhanam', 'urvārukam iva bandhanān', 'mṛtyor mukṣīya mā’mṛtāt'],
      },
      translations: {
        'zh-CN': ['唵，我们礼拜三眼者，', '芬芳、增益生命的那一位；', '愿我像熟透的瓜脱离藤蔓，', '从死亡中解脱，而不离开不朽。'],
        en: ['Om, we worship the three-eyed one,', 'fragrant, who nourishes all;', 'like a ripe cucumber from its vine,', 'may I be freed from death, not from immortality.'],
      },
    }),
    rec({
      id: 'hinduism.ghat.asatoma', key: 'asatoma', type: 'prayer',
      title: { 'zh-CN': '从虚妄引我至真实', en: 'Asato mā (Pavamāna mantra)' },
      edition: 'Bṛhadāraṇyaka Upaniṣad 1.3.28', source: { id: 'BU 1.3.28', name: 'Bṛhadāraṇyaka Upaniṣad 1.3.28' },
      text: {
        orig: ['असतो मा सद्गमय', 'तमसो मा ज्योतिर्गमय', 'मृत्योर्मा अमृतं गमय', 'ॐ शान्तिः शान्तिः शान्तिः'],
        latn: ['asato mā sad gamaya', 'tamaso mā jyotir gamaya', 'mṛtyor mā amṛtaṃ gamaya', 'oṃ śāntiḥ śāntiḥ śāntiḥ'],
      },
      translations: {
        'zh-CN': ['引我从虚妄走向真实，', '引我从黑暗走向光明，', '引我从死亡走向不朽。', '唵，平安，平安，平安。'],
        en: ['Lead me from the unreal to the real,', 'from darkness to light,', 'from death to immortality.', 'Om, peace, peace, peace.'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
