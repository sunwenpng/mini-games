/* 转经院（藏传佛教）：玩法定义与场景。规则在 core/courtyard/engine.js。 */
Courtyard.define({
  id: 'buddhism.tibetan',
  saveKey: 'threshold-bo-save-v1',
  tz: 'Asia/Shanghai',
  langs: ['zh-CN', 'en'],
  defaultLang: 'zh-CN',
  font: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Tibetan&display=swap',
  theme: { hud: 'rgba(60,18,20,.92)', bar: '#3a1416', btn: '#f6ead2', btnInk: '#4a1a14', accent: '#8f2a22', stage: '#2a1a18' },
  bell: 'bowl',
  horizon: 0.46,
  resource: { icon: '🥣', start: 12 },
  chore: { icon: '🧹', gain: 3, every: 24, max: 6, pile: m => (m.season === 'winter' ? 'snow' : 'leaves'), spots: [[0.06, 0.8, 0.94, 0.95]] },
  care: {
    mode: 'animals', kinds: ['dog', 'cat'], max: 4, every: 110, adoptGift: 15, zone: [0.08, 0.82, 0.92, 0.95],
    names: { 'zh-CN': ['扎西', '达瓦', '尼玛', '白玛', '格桑', '次仁', '多吉', '央金'], en: ['Tashi', 'Dawa', 'Nyima', 'Pema', 'Kelsang', 'Tsering', 'Dorje', 'Yangchen'] },
    families: { 'zh-CN': ['山下开甜茶馆的一家', '放牧的阿佳', '寺旁小学的老师', '常来转经的老阿妈'], en: ['the family who run the sweet-tea house', 'a herding family', 'a teacher at the village school', 'an old woman who walks the kora every day'] },
  },
  practices: [
    { id: 'prostrate', icon: '🙇', kind: 'steps', steps: 3, sound: 'bowl' },
    { id: 'wheels', icon: '☸️', kind: 'count', targets: [21, 108], sound: 'chime', lang: 'bo' },
    { id: 'offer', icon: '🪔', kind: 'offer', items: ['lamp', 'water', 'khata'], sound: 'bowl' },
    { id: 'read', icon: '📜', kind: 'read' },
    { id: 'kora', icon: '👣', kind: 'steps', steps: 4, audio: 'ref.bo.gyuto' },
  ],
  msg: {
    'zh-CN': {
      'app.title': '转经院',
      'app.label': '启扉 · 藏传佛教 · 转经院（未经审核的预览）',
      'intro.body': '高原上的一座小寺：白墙、绛红色的边玛墙、金顶上的法轮和双鹿，一排转经轮，风里的经幡。常有老人绕着寺院转经，寺里的狗在台阶上晒太阳。',
      'intro.how': '打扫院子能从厨房分到糌粑，用来照顾狗和猫。磕头、转经轮、供灯、诵读和绕寺只记在功课簿里。',
      'intro.etiquette': '转经和绕寺都按顺时针走。',
      'res.name': '糌粑',
      'chore.label': '扫院',
      'chore.pile': '落叶和积雪',
      'chore.got': '扫干净一处，厨房分来 {n} 份糌粑',
      'prac.prostrate.bar': '磕头',
      'prac.prostrate.title': '礼拜（三拜）',
      'prac.prostrate.body': '双手合十，依次轻触头顶、喉间、胸前，代表身、语、意；然后跪下，向前伏身礼拜，再起身。这里拜三次。长途朝圣者行的“等身长头”是全身伏地，这里不模拟。',
      'prac.prostrate.step.1': '第一拜',
      'prac.prostrate.step.2': '第二拜',
      'prac.prostrate.step.3': '第三拜',
      'prac.prostrate.btn': '拜下',
      'prac.prostrate.done': '三拜完毕，已记入功课簿',
      'prac.wheels.bar': '转经轮',
      'prac.wheels.title': '转经轮',
      'prac.wheels.body': '沿着墙边的一排转经轮顺时针走，用右手推动经轮。轮里卷着写满六字真言的经纸，人们相信转一圈如同诵读一遍。',
      'prac.wheels.mantra': 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ',
      'prac.wheels.mantraLatn': 'oṃ maṇi padme hūṃ',
      'prac.wheels.mantraTr': '唵嘛呢叭咪吽',
      'prac.wheels.note': '每推一下记一圈。',
      'prac.offer.bar': '供灯供水',
      'prac.offer.title': '酥油灯、七供水、哈达',
      'prac.offer.body': '在佛堂前供上酥油灯和清水，或献一条哈达。不用糌粑，也不换取任何东西。',
      'offer.lamp': '一盏酥油灯',
      'offer.water': '七碗清水',
      'offer.khata': '一条白哈达',
      'offer.why.lamp': '灯光象征驱散无明的智慧',
      'offer.why.water': '清水人人可得，供养时没有吝惜之心',
      'offer.why.khata': '洁白表示心意纯净',
      'prac.read.bar': '诵读',
      'prac.read.title': '诵读',
      'prac.read.body': '藏文原文、拉丁转写和译文逐行对照。',
      'usage.omMani': '观世音菩萨的心咒，转经、绕寺时口中常念',
      'usage.refuge': '修法开头常念的皈依发心偈',
      'prac.kora.bar': '绕寺',
      'prac.kora.title': '绕寺转经（廓拉）',
      'prac.kora.body': '沿着寺院外的转经道顺时针绕一圈，边走边念，或者只是安静地走。',
      'prac.kora.step.1': '从东门出发',
      'prac.kora.step.2': '走过南墙的经幡',
      'prac.kora.step.3': '经过西边的白塔',
      'prac.kora.step.4': '沿北墙回到东门',
      'prac.kora.btn': '往前走',
      'prac.kora.done': '绕寺一圈，已记入功课簿',
      'care.intro': '寺里收留的狗和猫。藏地寺院常有狗，人们相信照顾它们也是修行的一部分。',
      'hint.dawn': '清晨，已经有老人在绕寺转经了。',
      'hint.night': '夜里佛堂的酥油灯还亮着。',
    },
    en: {
      'app.title': 'Kora Courtyard',
      'app.label': 'Threshold · Tibetan Buddhism · Kora Courtyard (unreviewed preview)',
      'intro.body': 'A small monastery on the plateau: whitewashed walls, a deep red parapet, a golden roof with the Dharma wheel and two deer, a row of prayer wheels and prayer flags in the wind. Old people walk the kora around it and the monastery dogs sun themselves on the steps.',
      'intro.how': 'Sweeping the courtyard earns tsampa from the kitchen, which feeds the dogs and cats. Prostrations, prayer wheels, lamp offerings, recitation and the kora are only noted in the practice book.',
      'intro.etiquette': 'Prayer wheels and kora always go clockwise.',
      'res.name': 'tsampa',
      'chore.label': 'Sweep',
      'chore.pile': 'leaves and snow',
      'chore.got': 'Swept clean; the kitchen sends {n} tsampa',
      'prac.prostrate.bar': 'Prostrate',
      'prac.prostrate.title': 'Prostrations (three)',
      'prac.prostrate.body': 'Join the palms and touch the crown, throat and heart, for body, speech and mind. Then kneel, bow forward and rise. Three times here. The full-length prostrations of long pilgrimages are not simulated.',
      'prac.prostrate.step.1': 'First prostration',
      'prac.prostrate.step.2': 'Second prostration',
      'prac.prostrate.step.3': 'Third prostration',
      'prac.prostrate.btn': 'Bow',
      'prac.prostrate.done': 'Three prostrations; noted in the practice book',
      'prac.wheels.bar': 'Wheels',
      'prac.wheels.title': 'Prayer wheels',
      'prac.wheels.body': 'Walk clockwise along the row of prayer wheels and turn each with your right hand. Each wheel holds scrolls printed with Om mani padme hum; one turn is held to equal one recitation.',
      'prac.wheels.mantra': 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ',
      'prac.wheels.mantraLatn': 'oṃ maṇi padme hūṃ',
      'prac.wheels.mantraTr': 'Om, jewel in the lotus, hum',
      'prac.wheels.note': 'Each tap counts one turn.',
      'prac.offer.bar': 'Offer',
      'prac.offer.title': 'Butter lamp, water bowls, khata',
      'prac.offer.body': 'Offer a butter lamp or clean water before the shrine, or present a khata. It costs no tsampa and earns nothing.',
      'offer.lamp': 'a butter lamp',
      'offer.water': 'seven bowls of water',
      'offer.khata': 'a white khata',
      'offer.why.lamp': 'Light stands for wisdom dispelling ignorance',
      'offer.why.water': 'Water is free to all, so it is offered without stinginess',
      'offer.why.khata': 'White stands for a pure intention',
      'prac.read.bar': 'Recite',
      'prac.read.title': 'Recitation',
      'prac.read.body': 'Tibetan, romanization and translation line by line.',
      'usage.omMani': 'The mantra of Avalokiteśvara, murmured while turning wheels and walking the kora',
      'usage.refuge': 'The refuge and bodhicitta verse said at the start of practice',
      'prac.kora.bar': 'Kora',
      'prac.kora.title': 'Kora (circumambulation)',
      'prac.kora.body': 'Walk once around the monastery clockwise on the kora path, reciting or simply walking quietly.',
      'prac.kora.step.1': 'Set out from the east gate',
      'prac.kora.step.2': 'Pass the prayer flags on the south wall',
      'prac.kora.step.3': 'Pass the white chorten in the west',
      'prac.kora.step.4': 'Return along the north wall to the east gate',
      'prac.kora.btn': 'Walk on',
      'prac.kora.done': 'One kora; noted in the practice book',
      'care.intro': 'Dogs and cats taken in by the monastery. Tibetan monasteries often have dogs, and caring for them is seen as part of practice.',
      'hint.dawn': 'Early morning; old people are already walking the kora.',
      'hint.night': 'The butter lamps are still lit in the hall at night.',
    },
  },
  scene: {
    back(ctx, w, h, m, K, t) {
      const hy = h * 0.46;
      K.mountains(ctx, w, hy, '#8b9bb0', h * 0.22, 4, true);
      K.hills(ctx, w, hy + 6, m.season === 'winter' ? '#c9cbc4' : '#9a8f6a', h * 0.06, 9);
      K.ground(ctx, w, h, hy + 4, m.season === 'winter' ? '#e4e2da' : '#b9a27a', m.season === 'winter' ? '#cfcac0' : '#9c8460');
      /* 主殿：梯形白墙、绛红边玛墙、金顶 */
      const cx = w * 0.5, base = h * 0.7, bw = w * 0.56, bh = h * 0.2;
      K.poly(ctx, [[cx - bw / 2, base], [cx + bw / 2, base], [cx + bw * 0.46, base - bh], [cx - bw * 0.46, base - bh]], '#f2efe6', 'rgba(0,0,0,.12)');
      ctx.fillStyle = '#7a1f1c'; ctx.fillRect(cx - bw * 0.47, base - bh - h * 0.035, bw * 0.94, h * 0.035);
      ctx.fillStyle = '#d4a63a'; ctx.fillRect(cx - bw * 0.47, base - bh - h * 0.04, bw * 0.94, h * 0.006);
      K.poly(ctx, [[cx - bw * 0.22, base - bh - h * 0.04], [cx + bw * 0.22, base - bh - h * 0.04], [cx + bw * 0.16, base - bh - h * 0.08], [cx - bw * 0.16, base - bh - h * 0.08]], '#d4a63a');
      /* 法轮与双鹿（远景剪影，不可点击） */
      const wy = base - bh - h * 0.115, wr = h * 0.03;
      ctx.strokeStyle = '#e8bf4a'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, wy, wr, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx, wy); ctx.lineTo(cx + Math.cos(a) * wr, wy + Math.sin(a) * wr); ctx.stroke(); }
      [-1, 1].forEach(s => { ctx.fillStyle = '#e8bf4a'; ctx.beginPath(); ctx.ellipse(cx + s * wr * 1.8, wy + wr * 0.6, wr * 0.7, wr * 0.4, 0, 0, Math.PI * 2); ctx.fill(); K.circle(ctx, cx + s * wr * 1.4, wy + wr * 0.05, wr * 0.28, '#e8bf4a'); });
      /* 窗：黑色梯形窗框 */
      for (let r = 0; r < 2; r++) for (let i = -2; i <= 2; i++) {
        if (r === 1 && i === 0) continue;
        const x = cx + i * bw * 0.17, y = base - bh * (0.78 - r * 0.42), ww = bw * 0.06, wh = bh * 0.2;
        K.poly(ctx, [[x - ww * 0.9, y + wh], [x + ww * 0.9, y + wh], [x + ww * 0.6, y], [x - ww * 0.6, y]], '#1e1a1a');
        ctx.fillStyle = m.night ? '#f2c45a' : '#5a3a2a'; ctx.fillRect(x - ww * 0.45, y + wh * 0.18, ww * 0.9, wh * 0.7);
      }
      /* 门与门帘 */
      ctx.fillStyle = '#7a1f1c'; ctx.fillRect(cx - bw * 0.07, base - bh * 0.4, bw * 0.14, bh * 0.4);
      ctx.fillStyle = '#f2efe6'; ctx.fillRect(cx - bw * 0.06, base - bh * 0.36, bw * 0.12, bh * 0.04);
      ctx.fillStyle = '#2b4f8a'; ctx.fillRect(cx - bw * 0.06, base - bh * 0.3, bw * 0.12, bh * 0.3);
      /* 经幡 */
      K.flags(ctx, cx - bw * 0.46, base - bh - h * 0.04, w * 0.02, hy - h * 0.02, t, m);
      K.flags(ctx, cx + bw * 0.46, base - bh - h * 0.04, w * 0.98, hy - h * 0.04, t + 1, m);
      /* 白塔（却丹） */
      const sx = w * 0.88, sy = h * 0.74;
      ctx.fillStyle = '#f4f1ea'; ctx.fillRect(sx - w * 0.05, sy - h * 0.03, w * 0.1, h * 0.03);
      ctx.fillRect(sx - w * 0.04, sy - h * 0.05, w * 0.08, h * 0.02);
      ctx.beginPath(); ctx.arc(sx, sy - h * 0.07, w * 0.035, Math.PI, 0); ctx.fill();
      ctx.fillRect(sx - w * 0.006, sy - h * 0.13, w * 0.012, h * 0.06);
      K.circle(ctx, sx, sy - h * 0.135, w * 0.009, '#d4a63a');
      /* 转经轮长廊 */
      const rx = w * 0.06, ry = h * 0.76;
      ctx.fillStyle = '#7a1f1c'; ctx.fillRect(rx - 4, ry - h * 0.075, w * 0.3 + 8, h * 0.012);
      for (let i = 0; i < 6; i++) {
        const x = rx + i * w * 0.05 + w * 0.02;
        const spin = m.reduceMotion ? 0 : Math.sin(t * 2 + i) * 0.5;
        ctx.fillStyle = '#c8962e'; K.rr(ctx, x - w * 0.015, ry - h * 0.06, w * 0.03, h * 0.05, 3); ctx.fill();
        ctx.fillStyle = '#e6c25a'; ctx.fillRect(x - w * 0.015 + spin * 3, ry - h * 0.045, 3, h * 0.02);
        ctx.fillStyle = '#5a3a2a'; ctx.fillRect(x - 1, ry - h * 0.012, 2, h * 0.012);
      }
      K.hit('spot', 'wheels', rx + w * 0.15, ry - h * 0.035, Math.max(30, w * 0.16));
      /* 煨桑炉的烟 */
      const bx = w * 0.72, by = h * 0.78;
      ctx.fillStyle = '#e8e2d4'; ctx.fillRect(bx - 10, by - 18, 20, 18);
      for (let i = 0; i < 4; i++) K.circle(ctx, bx + Math.sin(t * 0.8 + i) * 6, by - 24 - i * 10 - (t * 8 % 10), 5 + i * 2, 'rgba(230,230,230,' + (0.35 - i * 0.07) + ')');
      K.tree(ctx, w * 0.12, h * 0.6, h * 0.12, 'round', m, t);
    },
    lights(ctx, w, h, m, K, t) {
      if (m.night || m.hour < 6.5 || m.hour > 18.5) {
        const cx = w * 0.5, base = h * 0.7;
        K.glow(ctx, cx, base - h * 0.06, h * 0.08, 'rgba(255,200,110,.5)', t);
      }
      if (m.offered.indexOf('lamp') >= 0) K.flame(ctx, w * 0.5, h * 0.705, 5, t);
    },
  },
});
