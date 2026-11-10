/* 镇守之森（神道 · 村里的神社）：玩法定义与场景。 */
Courtyard.define({
  id: 'shinto.shrine',
  saveKey: 'threshold-shinto-save-v1',
  tz: 'Asia/Tokyo',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&display=swap',
  theme: { hud: 'rgba(40,20,16,.92)', bar: '#3a1a12', btn: '#fbf3e8', btnInk: '#3a1a12', accent: '#c23b22', stage: '#1e1612' },
  bell: 'chime',
  horizon: 0.42,
  resource: { icon: '🍙', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 22, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.2, 0.8, 0.8, 0.95]] },
  care: {
    mode: 'animals', kinds: ['cat', 'dog'], max: 4, every: 120, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['小福', '玉子', '小太郎', '阿铃', '小枫', '团子', '小纱', '阿樱'], en: ['Fuku', 'Tama', 'Kotaro', 'Suzu', 'Kaede', 'Dango', 'Saya', 'Sakura'] },
    families: { 'zh-CN': ['神社旁开荞麦面馆的一家', '每天来散步的老夫妇', '神社的巫女一家', '町内会会长'], en: ['the soba shop family next to the shrine', 'an old couple who walk here every day', 'a shrine maiden’s family', 'the head of the neighbourhood association'] },
  },
  practices: [
    { id: 'temizu', icon: '💧', kind: 'steps', steps: 4, sound: 'chime' },
    { id: 'sanpai', icon: '👏', kind: 'steps', steps: 4, sound: 'clap' },
    { id: 'ema', icon: '🪧', kind: 'offer', items: ['emaHealth', 'emaStudy', 'emaPeace'], sound: 'chime' },
    { id: 'read', icon: '📜', kind: 'read' },
    { id: 'learn', icon: '📖', kind: 'learn', cards: ['torii', 'kami', 'omamori'] },
  ],
  msg: {
    'zh-CN': {
      'app.title': '镇守之森',
      'app.label': '启扉 · 神道 · 镇守之森（未经审核的预览）',
      'intro.body': '村子边上一片老杉林里的小神社：朱红的鸟居，铺着白砂的参道，手水舍，一对守护的石狮（狛犬），拜殿前挂着注连绳和白色纸垂。猫常在拜殿的台阶上晒太阳。',
      'intro.how': '清扫参道上的落叶能分到饭团，用来照顾神社的猫狗。手水、参拜、绘马只记在功课簿里。',
      'intro.etiquette': '在鸟居前一礼再进去，靠参道边上走。',
      'res.name': '饭团',
      'chore.label': '扫参道',
      'chore.pile': '落叶和积雪',
      'chore.got': '参道扫干净一段，社务所分来 {n} 个饭团',
      'prac.temizu.bar': '手水',
      'prac.temizu.title': '手水（净手漱口）',
      'prac.temizu.body': '参拜前在手水舍净身。用一勺水完成全部步骤。',
      'prac.temizu.step.1': '右手拿勺，舀水冲洗左手',
      'prac.temizu.step.2': '换左手拿勺，冲洗右手',
      'prac.temizu.step.3': '再换右手，把水倒在左手掌心漱口（不要直接用勺子喝）',
      'prac.temizu.step.4': '竖起勺子，让剩下的水冲洗勺柄，放回原处',
      'prac.temizu.btn': '下一步',
      'prac.temizu.done': '净身完毕，已记入功课簿',
      'prac.sanpai.bar': '参拜',
      'prac.sanpai.title': '参拜（二拜二拍手一拜）',
      'prac.sanpai.body': '在拜殿前轻摇铃，然后按一般神社的方法参拜。香油钱（赛钱）不用游戏里的米。',
      'prac.sanpai.step.1': '轻摇铃',
      'prac.sanpai.step.2': '深深鞠躬两次',
      'prac.sanpai.step.3': '在胸前拍手两次，合掌默念',
      'prac.sanpai.step.4': '再深深鞠躬一次',
      'prac.sanpai.btn': '下一步',
      'prac.sanpai.done': '参拜完毕，已记入功课簿',
      'prac.ema.bar': '绘马',
      'prac.ema.title': '绘马',
      'prac.ema.body': '在木牌上写下心愿，挂在绘马架上。不用饭团，也不换取任何东西。',
      'offer.emaHealth': '写“家人健康”',
      'offer.emaStudy': '写“学业顺利”',
      'offer.emaPeace': '写“世界和平”',
      'prac.read.bar': '祷词',
      'prac.read.title': '祷词',
      'prac.read.body': '日文、罗马字和译文对照。',
      'usage.ryakuhai': '参拜时可以默念的简短祷词',
      'usage.sanpai': '一般神社的参拜顺序',
      'prac.learn.bar': '了解',
      'prac.learn.title': '了解神道',
      'prac.learn.body': '几张小卡片。',
      'learn.torii.title': '鸟居',
      'learn.torii.sub': '俗世与神域的分界',
      'learn.torii.body': '鸟居标志着从日常空间进入神的领域。穿过前一礼，离开时转身再一礼。\n朱红色的鸟居多见于稻荷神社，也有不涂色的原木鸟居。',
      'learn.kami.title': '神（Kami）',
      'learn.kami.sub': '八百万神',
      'learn.kami.body': '神道认为山、树、岩石、河流、祖先和英雄都可能是神（kami）。“八百万神”是形容神之多。\n神社本殿里供奉神体，一般人看不到，游戏里也不画。',
      'learn.omamori.title': '御守与神签',
      'learn.omamori.sub': '为什么这里不卖',
      'learn.omamori.body': '神社会授予御守（护身符）和神签。这里不做付费抽签，也不卖御守：它们是神社授予的，不是游戏里的商品。',
      'hint.dawn': '清晨，神职人员在打扫拜殿。',
      'hint.night': '石灯笼亮着，杉林很静。',
    },
    en: {
      'app.title': 'Shrine in the Grove',
      'app.label': 'Threshold · Shinto · Shrine in the Grove (unreviewed preview)',
      'intro.body': 'A small shrine in an old cedar grove at the edge of the village: a vermilion torii, a white gravel approach, a water pavilion, a pair of guardian lion-dogs, and a sacred rope with white paper streamers over the worship hall. A cat suns itself on the steps.',
      'intro.how': 'Sweeping leaves from the approach earns rice balls, which feed the shrine cats and dogs. Temizu, worship and ema are only noted in the practice book.',
      'intro.etiquette': 'Bow at the torii before entering and keep to the side of the approach.',
      'res.name': 'rice balls',
      'chore.label': 'Sweep',
      'chore.pile': 'leaves and snow',
      'chore.got': 'Swept a stretch of the approach; the shrine office sends {n} rice balls',
      'prac.temizu.bar': 'Temizu',
      'prac.temizu.title': 'Temizu (purification)',
      'prac.temizu.body': 'Purify yourself at the water pavilion before worship, all with one ladleful.',
      'prac.temizu.step.1': 'Ladle in the right hand: rinse the left hand',
      'prac.temizu.step.2': 'Ladle in the left hand: rinse the right hand',
      'prac.temizu.step.3': 'Back to the right: pour water into the left palm and rinse your mouth (never drink from the ladle)',
      'prac.temizu.step.4': 'Tilt the ladle upright so the rest washes the handle, then put it back',
      'prac.temizu.btn': 'Next',
      'prac.temizu.done': 'Purified; noted in the practice book',
      'prac.sanpai.bar': 'Worship',
      'prac.sanpai.title': 'Worship (two bows, two claps, one bow)',
      'prac.sanpai.body': 'Ring the bell gently before the worship hall, then pray in the usual shrine manner. Offering coins are never paid with in-game rice.',
      'prac.sanpai.step.1': 'Ring the bell gently',
      'prac.sanpai.step.2': 'Bow deeply twice',
      'prac.sanpai.step.3': 'Clap twice before your chest and pray silently',
      'prac.sanpai.step.4': 'Bow deeply once more',
      'prac.sanpai.btn': 'Next',
      'prac.sanpai.done': 'Worship done; noted in the practice book',
      'prac.ema.bar': 'Ema',
      'prac.ema.title': 'Ema',
      'prac.ema.body': 'Write a wish on a wooden plaque and hang it on the rack. It costs no rice balls and earns nothing.',
      'offer.emaHealth': 'write “health for my family”',
      'offer.emaStudy': 'write “success in my studies”',
      'offer.emaPeace': 'write “peace in the world”',
      'prac.read.bar': 'Prayer',
      'prac.read.title': 'Prayers',
      'prac.read.body': 'Japanese, rōmaji and translation.',
      'usage.ryakuhai': 'A short prayer that may be said silently at worship',
      'usage.sanpai': 'The usual order of worship at a shrine',
      'prac.learn.bar': 'Learn',
      'prac.learn.title': 'About Shinto',
      'prac.learn.body': 'A few short cards.',
      'learn.torii.title': 'The torii',
      'learn.torii.sub': 'Between the everyday and the sacred',
      'learn.torii.body': 'A torii marks the passage from everyday space into the realm of the kami. Bow before passing through, and turn to bow again when you leave.\nVermilion torii are typical of Inari shrines; others are plain wood.',
      'learn.kami.title': 'Kami',
      'learn.kami.sub': 'The eight million kami',
      'learn.kami.body': 'In Shinto, mountains, trees, rocks, rivers, ancestors and heroes may all be kami; “eight million kami” means countless.\nThe object in which the kami dwells is kept unseen in the inner sanctuary, and the game does not draw it.',
      'learn.omamori.title': 'Amulets and fortunes',
      'learn.omamori.sub': 'Why they are not sold here',
      'learn.omamori.body': 'Shrines grant omamori (amulets) and omikuji (fortune slips). The game has no paid fortunes and sells no amulets: they are given by shrines, not game items.',
      'hint.dawn': 'Early morning: a priest is sweeping the worship hall.',
      'hint.night': 'The stone lanterns are lit; the cedar grove is still.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.42;
      for (let i = 0; i < 9; i++) K.tree(ctx, w * (i / 8), hy + h * 0.06, h * (0.22 + (i % 3) * 0.03), 'cypress', m, t);
      K.ground(ctx, w, h, hy + h * 0.05, '#7a8a62', '#6a7a54');
      /* 参道 */
      K.poly(ctx, [[w * 0.42, h * 0.62], [w * 0.58, h * 0.62], [w * 0.85, h], [w * 0.15, h]], m.season === 'winter' ? '#f1f1ee' : '#e4e0d4');
      /* 拜殿 */
      const cx = w * 0.5, base = h * 0.62, bw = w * 0.42;
      ctx.fillStyle = '#7a5236'; ctx.fillRect(cx - bw * 0.42, base - h * 0.11, bw * 0.84, h * 0.11);
      ctx.fillStyle = '#efe6d2'; ctx.fillRect(cx - bw * 0.36, base - h * 0.09, bw * 0.72, h * 0.06);
      ctx.fillStyle = '#5a3a26'; for (let i = 0; i <= 4; i++) ctx.fillRect(cx - bw * 0.38 + i * bw * 0.19 - 2, base - h * 0.11, 4, h * 0.11);
      const ry = base - h * 0.11;
      K.poly(ctx, [[cx - bw * 0.6, ry + 6], [cx, ry - h * 0.1], [cx + bw * 0.6, ry + 6]], '#5c4636');
      ctx.strokeStyle = '#a07a48'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - bw * 0.06, ry - h * 0.13); ctx.lineTo(cx + bw * 0.03, ry - h * 0.08); ctx.moveTo(cx + bw * 0.06, ry - h * 0.13); ctx.lineTo(cx - bw * 0.03, ry - h * 0.08); ctx.stroke();
      ctx.fillStyle = '#a07a48'; for (let i = -2; i <= 2; i++) ctx.fillRect(cx + i * bw * 0.08 - 5, ry - h * 0.095, 10, 4);
      /* 注连绳与纸垂 */
      ctx.strokeStyle = '#d8c48a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - bw * 0.3, base - h * 0.1); ctx.quadraticCurveTo(cx, base - h * 0.08, cx + bw * 0.3, base - h * 0.1); ctx.stroke();
      ctx.fillStyle = '#ffffff'; for (let i = -2; i <= 2; i++) { const x = cx + i * bw * 0.12; K.poly(ctx, [[x, base - h * 0.088], [x + 4, base - h * 0.078], [x - 2, base - h * 0.07], [x + 3, base - h * 0.06], [x - 1, base - h * 0.06], [x - 4, base - h * 0.07], [x + 1, base - h * 0.078]], '#fff'); }
      ctx.fillStyle = '#c8962e'; ctx.beginPath(); ctx.arc(cx, base - h * 0.072, 6, 0, Math.PI * 2); ctx.fill();
      K.hit('spot', 'sanpai', cx, base - h * 0.05, Math.max(28, w * 0.08));
      /* 鸟居 */
      const tx = w * 0.5, ty = h * 0.86, tw = w * 0.62;
      ctx.fillStyle = '#c23b22';
      ctx.fillRect(tx - tw * 0.36, ty - h * 0.3, w * 0.03, h * 0.3); ctx.fillRect(tx + tw * 0.36 - w * 0.03, ty - h * 0.3, w * 0.03, h * 0.3);
      ctx.fillRect(tx - tw * 0.42, ty - h * 0.25, tw * 0.84, h * 0.018);
      ctx.beginPath(); ctx.moveTo(tx - tw * 0.52, ty - h * 0.33); ctx.quadraticCurveTo(tx, ty - h * 0.3, tx + tw * 0.52, ty - h * 0.33); ctx.lineTo(tx + tw * 0.5, ty - h * 0.3); ctx.quadraticCurveTo(tx, ty - h * 0.28, tx - tw * 0.5, ty - h * 0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(tx - tw * 0.53, ty - h * 0.34, tw * 1.06, h * 0.012);
      /* 手水舍 */
      const wx = w * 0.12, wy = h * 0.74;
      ctx.fillStyle = '#9a968c'; ctx.fillRect(wx - w * 0.06, wy - h * 0.025, w * 0.12, h * 0.025);
      ctx.fillStyle = '#6a8aa0'; ctx.fillRect(wx - w * 0.05, wy - h * 0.024, w * 0.1, h * 0.008);
      ctx.fillStyle = '#5a3a26'; ctx.fillRect(wx - w * 0.07, wy - h * 0.09, 3, h * 0.065); ctx.fillRect(wx + w * 0.07 - 3, wy - h * 0.09, 3, h * 0.065);
      K.poly(ctx, [[wx - w * 0.09, wy - h * 0.085], [wx, wy - h * 0.115], [wx + w * 0.09, wy - h * 0.085]], '#5c4636');
      K.hit('spot', 'temizu', wx, wy - h * 0.03, Math.max(26, w * 0.08));
      /* 狛犬 */
      [w * 0.3, w * 0.7].forEach((x, i) => { ctx.fillStyle = '#9a968c'; ctx.fillRect(x - 8, h * 0.66, 16, 10); K.circle(ctx, x + (i ? -3 : 3), h * 0.645, 8, '#a8a49a'); ctx.fillRect(x - 6, h * 0.65, 12, 12); });
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6 || m.hour > 18.2) { K.glow(ctx, w * 0.5, h * 0.56, h * 0.06, 'rgba(255,200,120,.45)', t); }
      if (m.offered.length) { ctx.fillStyle = '#d9b47a'; for (let i = 0; i < m.offered.length; i++) ctx.fillRect(w * 0.84 + i * 9, h * 0.66, 7, 6); }
    },
  },
});
