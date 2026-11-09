/*
 * 泰国上座部佛教包的诵读内容：泰国在家众常诵的五段巴利文。
 * - 原文：巴利三藏与泰国通行诵本，公有领域。泰文字母写法按泰国诵本常见体例（每个音节带元音，如“นะโม ตัสสะ”），
 *   拉丁转写按国际通行的巴利文转写（带附加符号）。
 * - 译文：泰语用泰国诵本里常见的释义；English 与简体中文由 AI 起草。全部是 draft，需要泰国僧人或学者、
 *   泰语母语者逐行审定后才能升级。
 * 类型：homage 礼敬文 | refuge 三皈依 | precepts 戒文 | recollection 随念 | metta 慈心文
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.CONTENT = T.CONTENT || {};

  const NAMO_TH = 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ';
  const NAMO_LA = 'Namo tassa bhagavato arahato sammāsambuddhassa';
  const NAMO_TR = {
    th: 'ขอนอบน้อมแด่พระผู้มีพระภาคเจ้า ผู้เป็นพระอรหันต์ ตรัสรู้ชอบได้โดยพระองค์เอง',
    en: 'Homage to the Blessed One, the Worthy One, the Perfectly Self-Awakened One.',
    'zh-CN': '礼敬世尊、阿罗汉、正等正觉者。',
  };

  const base = {
    license: 'public-domain-text',
    territory: ['*'],
    reviewStatus: 'draft',
    reviewers: [],
    titleLang: 'th',
    edition: 'Thai chanting-book orthography (to be matched to an edition by an advisor)',
    editionLang: 'en',
  };

  function rec(o) {
    return Object.assign({}, base, o);
  }

  T.CONTENT['buddhism.theravada.th'] = [
    rec({
      id: 'buddhism.theravada.th.namo',
      key: 'namo',
      type: 'homage',
      title: { th: 'บทนอบน้อม (นะโม ตัสสะ)', 'pi-Latn': 'Namo tassa', en: 'Homage to the Buddha', 'zh-CN': '礼敬文' },
      source: { id: 'Tipiṭaka', name: 'Pali Canon, e.g. MN 56' },
      usage: 'th.usage.namo',
      text: { 'pi-Thai': [NAMO_TH, NAMO_TH, NAMO_TH], 'pi-Latn': [NAMO_LA, NAMO_LA, NAMO_LA] },
      translations: {
        th: [NAMO_TR.th, NAMO_TR.th, NAMO_TR.th],
        en: [NAMO_TR.en, NAMO_TR.en, NAMO_TR.en],
        'zh-CN': [NAMO_TR['zh-CN'], NAMO_TR['zh-CN'], NAMO_TR['zh-CN']],
      },
    }),
    rec({
      id: 'buddhism.theravada.th.tisarana',
      key: 'tisarana',
      type: 'refuge',
      title: { th: 'ไตรสรณคมน์', 'pi-Latn': 'Tisaraṇa', en: 'The Three Refuges', 'zh-CN': '三皈依' },
      source: { id: 'Khp 1', name: 'Khuddakapāṭha 1 (Saraṇattaya)' },
      usage: 'th.usage.tisarana',
      text: {
        'pi-Thai': [
          'พุทธัง สะระณัง คัจฉามิ', 'ธัมมัง สะระณัง คัจฉามิ', 'สังฆัง สะระณัง คัจฉามิ',
          'ทุติยัมปิ พุทธัง สะระณัง คัจฉามิ', 'ทุติยัมปิ ธัมมัง สะระณัง คัจฉามิ', 'ทุติยัมปิ สังฆัง สะระณัง คัจฉามิ',
          'ตะติยัมปิ พุทธัง สะระณัง คัจฉามิ', 'ตะติยัมปิ ธัมมัง สะระณัง คัจฉามิ', 'ตะติยัมปิ สังฆัง สะระณัง คัจฉามิ',
        ],
        'pi-Latn': [
          'Buddhaṃ saraṇaṃ gacchāmi', 'Dhammaṃ saraṇaṃ gacchāmi', 'Saṅghaṃ saraṇaṃ gacchāmi',
          'Dutiyampi buddhaṃ saraṇaṃ gacchāmi', 'Dutiyampi dhammaṃ saraṇaṃ gacchāmi', 'Dutiyampi saṅghaṃ saraṇaṃ gacchāmi',
          'Tatiyampi buddhaṃ saraṇaṃ gacchāmi', 'Tatiyampi dhammaṃ saraṇaṃ gacchāmi', 'Tatiyampi saṅghaṃ saraṇaṃ gacchāmi',
        ],
      },
      translations: {
        th: [
          'ข้าพเจ้าถึงพระพุทธเจ้าว่าเป็นที่พึ่ง', 'ข้าพเจ้าถึงพระธรรมว่าเป็นที่พึ่ง', 'ข้าพเจ้าถึงพระสงฆ์ว่าเป็นที่พึ่ง',
          'แม้ครั้งที่สอง ข้าพเจ้าถึงพระพุทธเจ้าว่าเป็นที่พึ่ง', 'แม้ครั้งที่สอง ข้าพเจ้าถึงพระธรรมว่าเป็นที่พึ่ง', 'แม้ครั้งที่สอง ข้าพเจ้าถึงพระสงฆ์ว่าเป็นที่พึ่ง',
          'แม้ครั้งที่สาม ข้าพเจ้าถึงพระพุทธเจ้าว่าเป็นที่พึ่ง', 'แม้ครั้งที่สาม ข้าพเจ้าถึงพระธรรมว่าเป็นที่พึ่ง', 'แม้ครั้งที่สาม ข้าพเจ้าถึงพระสงฆ์ว่าเป็นที่พึ่ง',
        ],
        en: [
          'I go to the Buddha for refuge.', 'I go to the Dhamma for refuge.', 'I go to the Sangha for refuge.',
          'For the second time, I go to the Buddha for refuge.', 'For the second time, I go to the Dhamma for refuge.', 'For the second time, I go to the Sangha for refuge.',
          'For the third time, I go to the Buddha for refuge.', 'For the third time, I go to the Dhamma for refuge.', 'For the third time, I go to the Sangha for refuge.',
        ],
        'zh-CN': [
          '我皈依佛。', '我皈依法。', '我皈依僧。',
          '第二次，我皈依佛。', '第二次，我皈依法。', '第二次，我皈依僧。',
          '第三次，我皈依佛。', '第三次，我皈依法。', '第三次，我皈依僧。',
        ],
      },
    }),
    rec({
      id: 'buddhism.theravada.th.pancasila',
      key: 'pancasila',
      type: 'precepts',
      title: { th: 'ศีล ๕', 'pi-Latn': 'Pañcasīla', en: 'The Five Precepts', 'zh-CN': '五戒' },
      source: { id: 'Khp 2', name: 'Khuddakapāṭha 2 (Dasasikkhāpada), first five' },
      usage: 'th.usage.pancasila',
      text: {
        'pi-Thai': [
          'ปาณาติปาตา เวระมะณี สิกขาปะทัง สะมาทิยามิ',
          'อะทินนาทานา เวระมะณี สิกขาปะทัง สะมาทิยามิ',
          'กาเมสุมิจฉาจารา เวระมะณี สิกขาปะทัง สะมาทิยามิ',
          'มุสาวาทา เวระมะณี สิกขาปะทัง สะมาทิยามิ',
          'สุราเมระยะมัชชะปะมาทัฏฐานา เวระมะณี สิกขาปะทัง สะมาทิยามิ',
        ],
        'pi-Latn': [
          'Pāṇātipātā veramaṇī sikkhāpadaṃ samādiyāmi',
          'Adinnādānā veramaṇī sikkhāpadaṃ samādiyāmi',
          'Kāmesumicchācārā veramaṇī sikkhāpadaṃ samādiyāmi',
          'Musāvādā veramaṇī sikkhāpadaṃ samādiyāmi',
          'Surāmerayamajjapamādaṭṭhānā veramaṇī sikkhāpadaṃ samādiyāmi',
        ],
      },
      translations: {
        th: [
          'ข้าพเจ้าขอสมาทานสิกขาบท คือเจตนาเป็นเครื่องเว้นจากการฆ่าสัตว์',
          'ข้าพเจ้าขอสมาทานสิกขาบท คือเจตนาเป็นเครื่องเว้นจากการลักทรัพย์',
          'ข้าพเจ้าขอสมาทานสิกขาบท คือเจตนาเป็นเครื่องเว้นจากการประพฤติผิดในกาม',
          'ข้าพเจ้าขอสมาทานสิกขาบท คือเจตนาเป็นเครื่องเว้นจากการพูดเท็จ',
          'ข้าพเจ้าขอสมาทานสิกขาบท คือเจตนาเป็นเครื่องเว้นจากการดื่มน้ำเมา คือสุราและเมรัย อันเป็นที่ตั้งแห่งความประมาท',
        ],
        en: [
          'I undertake the training rule to refrain from taking life.',
          'I undertake the training rule to refrain from taking what is not given.',
          'I undertake the training rule to refrain from sexual misconduct.',
          'I undertake the training rule to refrain from false speech.',
          'I undertake the training rule to refrain from intoxicating drinks and drugs that lead to carelessness.',
        ],
        'zh-CN': [
          '我受持离杀生的学处。',
          '我受持离不与取的学处。',
          '我受持离欲邪行的学处。',
          '我受持离妄语的学处。',
          '我受持离放逸之因的谷酒、花酒等酒类的学处。',
        ],
      },
    }),
    rec({
      id: 'buddhism.theravada.th.itipiso',
      key: 'itipiso',
      type: 'recollection',
      title: { th: 'อิติปิโส (พุทธคุณ ธรรมคุณ สังฆคุณ)', 'pi-Latn': 'Iti pi so', en: 'Recollection of the Triple Gem', 'zh-CN': '三宝功德（随念）' },
      source: { id: 'AN 6.10', name: 'Aṅguttara Nikāya 6.10 and parallels' },
      usage: 'th.usage.itipiso',
      text: {
        'pi-Thai': [
          'อิติปิ โส ภะคะวา อะระหัง สัมมาสัมพุทโธ',
          'วิชชาจะระณะสัมปันโน สุคะโต โลกะวิทู',
          'อะนุตตะโร ปุริสะทัมมะสาระถิ',
          'สัตถา เทวะมะนุสสานัง พุทโธ ภะคะวาติ',
          'สวากขาโต ภะคะวะตา ธัมโม',
          'สันทิฏฐิโก อะกาลิโก เอหิปัสสิโก',
          'โอปะนะยิโก ปัจจัตตัง เวทิตัพโพ วิญญูหีติ',
          'สุปะฏิปันโน ภะคะวะโต สาวะกะสังโฆ',
          'อุชุปะฏิปันโน ภะคะวะโต สาวะกะสังโฆ',
          'ญายะปะฏิปันโน ภะคะวะโต สาวะกะสังโฆ',
          'สามีจิปะฏิปันโน ภะคะวะโต สาวะกะสังโฆ',
          'ยะทิทัง จัตตาริ ปุริสะยุคานิ อัฏฐะ ปุริสะปุคคะลา',
          'เอสะ ภะคะวะโต สาวะกะสังโฆ',
          'อาหุเนยโย ปาหุเนยโย ทักขิเณยโย อัญชะลีกะระณีโย',
          'อะนุตตะรัง ปุญญักเขตตัง โลกัสสาติ',
        ],
        'pi-Latn': [
          'Iti pi so bhagavā arahaṃ sammāsambuddho',
          'Vijjācaraṇasampanno sugato lokavidū',
          'Anuttaro purisadammasārathi',
          'Satthā devamanussānaṃ buddho bhagavāti',
          'Svākkhāto bhagavatā dhammo',
          'Sandiṭṭhiko akāliko ehipassiko',
          'Opanayiko paccattaṃ veditabbo viññūhīti',
          'Supaṭipanno bhagavato sāvakasaṅgho',
          'Ujupaṭipanno bhagavato sāvakasaṅgho',
          'Ñāyapaṭipanno bhagavato sāvakasaṅgho',
          'Sāmīcipaṭipanno bhagavato sāvakasaṅgho',
          'Yadidaṃ cattāri purisayugāni aṭṭha purisapuggalā',
          'Esa bhagavato sāvakasaṅgho',
          'Āhuneyyo pāhuneyyo dakkhiṇeyyo añjalikaraṇīyo',
          'Anuttaraṃ puññakkhettaṃ lokassāti',
        ],
      },
      translations: {
        th: [
          'เพราะเหตุอย่างนี้ๆ พระผู้มีพระภาคเจ้านั้น เป็นผู้ไกลจากกิเลส ตรัสรู้ชอบได้โดยพระองค์เอง',
          'เป็นผู้ถึงพร้อมด้วยวิชชาและจรณะ เป็นผู้ไปแล้วด้วยดี เป็นผู้รู้โลกอย่างแจ่มแจ้ง',
          'เป็นผู้สามารถฝึกบุรุษที่สมควรฝึกได้อย่างไม่มีใครยิ่งกว่า',
          'เป็นครูผู้สอนของเทวดาและมนุษย์ทั้งหลาย เป็นผู้รู้ ผู้ตื่น ผู้เบิกบานด้วยธรรม เป็นผู้มีความจำเริญ จำแนกธรรมสั่งสอนสัตว์',
          'พระธรรมเป็นสิ่งที่พระผู้มีพระภาคเจ้าตรัสไว้ดีแล้ว',
          'เป็นสิ่งที่ผู้ศึกษาและปฏิบัติพึงเห็นได้ด้วยตนเอง เป็นสิ่งที่ปฏิบัติได้และให้ผลได้ไม่จำกัดกาล เป็นสิ่งที่ควรกล่าวกะผู้อื่นว่าท่านจงมาดูเถิด',
          'เป็นสิ่งที่ควรน้อมเข้ามาใส่ตัว เป็นสิ่งที่ผู้รู้ก็รู้ได้เฉพาะตน',
          'สงฆ์สาวกของพระผู้มีพระภาคเจ้า หมู่ใด ปฏิบัติดีแล้ว',
          'สงฆ์สาวกของพระผู้มีพระภาคเจ้า หมู่ใด ปฏิบัติตรงแล้ว',
          'สงฆ์สาวกของพระผู้มีพระภาคเจ้า หมู่ใด ปฏิบัติเพื่อรู้ธรรมเป็นเครื่องออกจากทุกข์แล้ว',
          'สงฆ์สาวกของพระผู้มีพระภาคเจ้า หมู่ใด ปฏิบัติสมควรแล้ว',
          'ได้แก่บุคคลเหล่านี้คือ คู่แห่งบุรุษ ๔ คู่ นับเรียงตัวบุรุษได้ ๘ บุรุษ',
          'นั่นแหละ สงฆ์สาวกของพระผู้มีพระภาคเจ้า',
          'เป็นสงฆ์ควรแก่สักการะที่เขานำมาบูชา เป็นสงฆ์ควรแก่สักการะที่เขาจัดไว้ต้อนรับ เป็นผู้ควรรับทักษิณาทาน เป็นผู้ที่บุคคลทั่วไปควรทำอัญชลี',
          'เป็นเนื้อนาบุญของโลก ไม่มีนาบุญอื่นยิ่งกว่า',
        ],
        en: [
          'Such indeed is the Blessed One: worthy and perfectly self-awakened,',
          'accomplished in knowledge and conduct, well-gone, knower of the worlds,',
          'unexcelled trainer of those who can be tamed,',
          'teacher of gods and humans, awakened and blessed.',
          'The Dhamma is well taught by the Blessed One,',
          'visible here and now, timeless, inviting one to come and see,',
          'leading onward, to be known by the wise for themselves.',
          'The community of the Blessed One’s disciples practises well,',
          'practises straightforwardly,',
          'practises the true way,',
          'practises properly,',
          'that is, the four pairs of persons, the eight kinds of individuals.',
          'This is the community of the Blessed One’s disciples,',
          'worthy of gifts, of hospitality, of offerings and of respectful greeting,',
          'the unsurpassed field of merit for the world.',
        ],
        'zh-CN': [
          '世尊确实如此：是阿罗汉、正等正觉者，',
          '明行具足、善逝、世间解，',
          '无上士、调御丈夫，',
          '天人师、佛、世尊。',
          '法是世尊善说的，',
          '现见的、不待时的、来见的，',
          '引导向上的、智者各自证知的。',
          '世尊的弟子僧团是善行道的，',
          '是正直行道的，',
          '是如理行道的，',
          '是恭敬行道的，',
          '即四双八辈。',
          '这就是世尊的弟子僧团，',
          '应供、应受款待、应受布施、应合掌礼敬，',
          '是世间无上的福田。',
        ],
      },
    }),
    rec({
      id: 'buddhism.theravada.th.metta',
      key: 'metta',
      type: 'metta',
      title: { th: 'แผ่เมตตา', 'pi-Latn': 'Sabbe sattā', en: 'Loving-kindness', 'zh-CN': '慈心文' },
      source: { id: 'Thai chanting book', name: 'Common Thai lay chant (แผ่เมตตาให้สัตว์ทั้งหลาย)' },
      usage: 'th.usage.metta',
      text: {
        'pi-Thai': ['สัพเพ สัตตา', 'อะเวรา โหนตุ', 'อัพยาปัชฌา โหนตุ', 'อะนีฆา โหนตุ', 'สุขี อัตตานัง ปะริหะรันตุ'],
        'pi-Latn': ['Sabbe sattā', 'Averā hontu', 'Abyāpajjhā hontu', 'Anīghā hontu', 'Sukhī attānaṃ pariharantu'],
      },
      translations: {
        th: [
          'สัตว์ทั้งหลายที่เป็นเพื่อนทุกข์ เกิด แก่ เจ็บ ตาย ด้วยกันทั้งหมดทั้งสิ้น',
          'จงเป็นสุขเป็นสุขเถิด อย่าได้มีเวรแก่กันและกันเลย',
          'จงเป็นสุขเป็นสุขเถิด อย่าได้เบียดเบียนซึ่งกันและกันเลย',
          'จงเป็นสุขเป็นสุขเถิด อย่าได้มีความทุกข์กายทุกข์ใจเลย',
          'จงมีความสุขกายสุขใจ รักษาตนให้พ้นจากทุกข์ภัยทั้งสิ้นเถิด',
        ],
        en: [
          'May all beings',
          'be free from enmity,',
          'free from ill will,',
          'free from distress,',
          'and may they look after themselves with ease.',
        ],
        'zh-CN': ['愿一切众生', '无怨，', '无害，', '无恼，', '安乐地守护自己。'],
      },
    }),
  ];
})(typeof window !== 'undefined' ? window : globalThis);
