/*
 * 文字压力测试与锁版用的样本。除“启扉”和“Threshold”外，都是演示用的问候语和说明句，
 * 不是品牌译名，也未经母语审校，正式使用前必须由母语者重写。
 */
(function (root) {
  'use strict';
  const T = (root.Threshold = root.Threshold || {});
  T.SCRIPT_SAMPLES = [
    { script: 'Hans', lang: 'zh-CN', dir: 'ltr', lockup: '启扉', welcome: '欢迎', button: '进入', body: '每个传统有自己的空间、语言、经典、声音和礼仪。还没准备好的版本会写明缺什么。' },
    { script: 'Latn', lang: 'en', dir: 'ltr', lockup: 'Threshold', welcome: 'Welcome', button: 'Enter', body: 'Each tradition has its own space, languages, texts, sounds and customs. Versions that are not ready say what is still missing.' },
    { script: 'Thai', lang: 'th', dir: 'ltr', lockup: 'ยินดีต้อนรับ', welcome: 'ยินดีต้อนรับ', button: 'เข้า', body: 'แพลตฟอร์มนี้ช่วยให้คุณเรียนรู้วัฒนธรรมและประเพณีต่างๆอย่างเคารพโดยไม่มีช่องว่างระหว่างคำซึ่งต้องตัดบรรทัดตามพจนานุกรม' },
    { script: 'Deva-hi', lang: 'hi', dir: 'ltr', lockup: 'स्वागत है', welcome: 'स्वागत है', button: 'प्रवेश करें', body: 'यह मंच आपको विभिन्न परंपराओं और संस्कृतियों को सम्मान के साथ जानने में मदद करता है।' },
    { script: 'Deva-mr', lang: 'mr', dir: 'ltr', lockup: null, welcome: 'स्वागत आहे', button: 'प्रवेश करा', body: 'हे व्यासपीठ विविध परंपरा आणि संस्कृती आदराने जाणून घेण्यास मदत करते.' },
    { script: 'Arab', lang: 'ar', dir: 'rtl', lockup: 'مرحبًا', welcome: 'مرحبًا', button: 'ادخل', body: 'تساعدك هذه المنصة على التعرف على التقاليد والثقافات المختلفة باحترام.' },
    { script: 'Hebr', lang: 'he', dir: 'rtl', lockup: 'ברוכים הבאים', welcome: 'ברוכים הבאים', button: 'כניסה', body: 'הפלטפורמה הזו עוזרת להכיר מסורות ותרבויות שונות בכבוד.' },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
