/*
 * 山寺小院：敲木鱼、上香、拜佛、诵经，收留山门外的流浪小动物。
 * 界面全部画在 canvas 上，没有 HTML 按钮，方便以后移植到小游戏平台。
 */
'use strict';

const VW = 400;
let VH = 720;
const PANEL_H = 214;
let PANEL_TOP = VH - PANEL_H;
const TAU = Math.PI * 2;
const SANS = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
const SERIF = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif';
const SAVE_KEY = 'temple-yard-save-v1';
const INK = '#2b211a';
const PAPER = '#f4ecdb';
const GOLD = '#d9b25c';
const INCENSE_SEC = 240;
const BOW_COOLDOWN = 45;
const BELL_COOLDOWN = 6;

const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

let scale = 1;
let offX = 0;
let offY = 0;

/* ---------- 庭院透视：wx 是左右（-1 到 1），d 是远近（0 在大殿前，1 在最近处） ---------- */
const Y0 = 262;
const BY = Y0 - 4;
const Z_FAR = 2.2;
let K = 429;
let YH = 67;

function yard(wx, d) {
  const s = 1 / (Z_FAR + (1 - Z_FAR) * d);
  return [VW / 2 + wx * 210 * s, YH + K * s, s];
}

function layout() {
  PANEL_TOP = VH - PANEL_H;
  const y1 = PANEL_TOP - 12;
  K = (y1 - Y0) / (1 - 1 / Z_FAR);
  YH = y1 - K;
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  VH = Math.max(720, Math.min(900, VW * h / w));
  scale = Math.min(w / VW, h / VH);
  offX = (w - VW * scale) / 2;
  offY = (h - VH * scale) / 2;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  layout();
}

/* ---------- 小工具 ---------- */
function rng(seed) {
  return function () {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

function hexRgb(c) {
  const n = parseInt(c.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function mixColor(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
}

function fmt(n) {
  n = Math.floor(n);
  if (n < 100000) return String(n);
  if (n < 100000000) return (n / 10000).toFixed(1) + '万';
  return (n / 100000000).toFixed(2) + '亿';
}

function dayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

/* ---------- 内容 ---------- */
/* 可选的经文。rate 是朗读语速，经文越像咒语念得越快。 */
const SUTRA_TEXTS = [
  {
    id: 'xinjing', title: '般若波罗蜜多心经', short: '心经', note: '玄奘译本', rate: 0.72,
    text: '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。舍利子，是诸法空相，不生不灭，不垢不净，不增不减。是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，无眼界，乃至无意识界，无无明，亦无无明尽，乃至无老死，亦无老死尽。无苦集灭道，无智亦无得。以无所得故，菩提萨埵，依般若波罗蜜多故，心无挂碍。无挂碍故，无有恐怖，远离颠倒梦想，究竟涅槃。三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。',
  },
  {
    id: 'dabei', title: '千手千眼无碍大悲心陀罗尼', short: '大悲咒', note: '八十四句', rate: 0.85,
    text: '南无喝啰怛那哆啰夜耶，南无阿唎耶，婆卢羯帝烁钵啰耶，菩提萨埵婆耶，摩诃萨埵婆耶，摩诃迦卢尼迦耶，唵，萨皤啰罚曳，数怛那怛写，南无悉吉栗埵伊蒙阿唎耶，婆卢吉帝室佛啰楞驮婆，南无那啰谨墀，醯利摩诃皤哆沙咩，萨婆阿他豆输朋，阿逝孕，萨婆萨哆那摩婆萨哆，那摩婆伽，摩罚特豆，怛侄他，唵，阿婆卢醯，卢迦帝，迦罗帝，夷醯唎，摩诃菩提萨埵，萨婆萨婆，摩啰摩啰，摩醯摩醯唎驮孕，俱卢俱卢羯蒙，度卢度卢罚阇耶帝，摩诃罚阇耶帝，陀啰陀啰，地唎尼，室佛啰耶，遮啰遮啰，么么罚摩啰，穆帝隶，伊醯伊醯，室那室那，阿啰嘇佛啰舍利，罚沙罚嘇，佛啰舍耶，呼嚧呼嚧摩啰，呼嚧呼嚧醯利，娑啰娑啰，悉唎悉唎，苏嚧苏嚧，菩提夜菩提夜，菩驮夜菩驮夜，弥帝唎夜，那啰谨墀，地利瑟尼那，波夜摩那，娑婆诃，悉陀夜，娑婆诃，摩诃悉陀夜，娑婆诃，悉陀喻艺，室皤啰耶，娑婆诃，那啰谨墀，娑婆诃，摩啰那啰，娑婆诃，悉啰僧阿穆佉耶，娑婆诃，娑婆摩诃阿悉陀夜，娑婆诃，者吉啰阿悉陀夜，娑婆诃，波陀摩羯悉陀夜，娑婆诃，那啰谨墀皤伽啰耶，娑婆诃，摩婆利胜羯啰夜，娑婆诃，南无喝啰怛那哆啰夜耶，南无阿唎耶，婆嚧吉帝，烁皤啰夜，娑婆诃，唵，悉殿都，漫多啰，跋陀耶，娑婆诃。',
  },
  {
    id: 'wangsheng', title: '拔一切业障根本得生净土陀罗尼', short: '往生咒', note: '净土陀罗尼', rate: 0.78,
    text: '南无阿弥多婆夜，哆他伽多夜，哆地夜他，阿弥利都婆毗，阿弥利哆，悉耽婆毗，阿弥唎哆，毗迦兰帝，阿弥唎哆，毗迦兰多，伽弥腻，伽伽那，枳多迦利，娑婆诃。',
  },
  {
    id: 'jingang', title: '金刚般若波罗蜜经偈', short: '金刚经偈', note: '鸠摩罗什译本', rate: 0.66,
    text: '凡所有相，皆是虚妄。若见诸相非相，即见如来。若以色见我，以音声求我，是人行邪道，不能见如来。一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
  },
  {
    id: 'liuzi', title: '六字大明咒', short: '六字真言', note: '二十一遍', rate: 0.8,
    text: '唵嘛呢叭咪吽，'.repeat(21),
  },
  {
    id: 'nianfo', title: '南无阿弥陀佛', short: '念佛', note: '十八遍', rate: 0.72,
    text: '南无阿弥陀佛，'.repeat(18),
  },
];

const SUTRAS = SUTRA_TEXTS.map(def => {
  const chars = [];
  const phrases = [];
  let cur = '';
  let start = 0;
  for (const ch of def.text) {
    if ('，。：；、'.includes(ch)) {
      if (cur) phrases.push({ start, end: chars.length, text: cur });
      cur = '';
    } else {
      if (!cur) start = chars.length;
      chars.push(ch);
      cur += ch;
    }
  }
  if (cur) phrases.push({ start, end: chars.length, text: cur });
  return Object.assign({}, def, { chars, phrases });
});

function sutraById(id) {
  return SUTRAS.find(s => s.id === id) || SUTRAS[0];
}

const KINDS = {
  orange: { label: '橘猫', type: 'cat', body: '#e39a4c', dark: '#b4662a', belly: '#f7e1c0', stripe: true, eye: '#5d8a2e', w: 3 },
  tabby: { label: '狸花猫', type: 'cat', body: '#9a8b72', dark: '#4e4434', belly: '#e4dac6', stripe: true, eye: '#8a9a2a', w: 3 },
  black: { label: '小黑猫', type: 'cat', body: '#2c2a2e', dark: '#141316', belly: '#3d3a40', stripe: false, eye: '#e8c23a', w: 2 },
  white: { label: '白猫', type: 'cat', body: '#f2efe9', dark: '#8f877d', belly: '#ffffff', stripe: false, patch: true, eye: '#4a8fd0', w: 2 },
  yellowdog: { label: '小黄狗', type: 'dog', body: '#d4a463', dark: '#a6763a', belly: '#f2dfbd', w: 2 },
  blackdog: { label: '小黑狗', type: 'dog', body: '#34302d', dark: '#1c1917', belly: '#c4955d', tan: true, w: 1 },
  sparrow: { label: '小麻雀', type: 'bird', body: '#8a6a48', dark: '#4a3826', belly: '#e8dfcf', w: 2 },
};

const INJURIES = {
  cat: ['后腿受伤，走路一瘸一拐', '前爪被划破了', '眼睛发炎，睁不太开', '背上有一道伤口'],
  dog: ['后腿受伤，走路一瘸一拐', '前爪扎了刺', '耳朵被咬伤了', '身上有一道伤口'],
  bird: ['翅膀受伤，飞不起来', '爪子被线缠伤了'],
};

const NAMES = {
  cat: ['橘子', '年糕', '糯米', '芝麻', '煤球', '雪球', '团子', '元宵', '小满', '招财', '豆包', '阿福', '花卷', '麦芽', '可乐', '奶盖'],
  dog: ['旺财', '来福', '豆豆', '大黄', '阿黑', '馒头', '土豆', '石头', '虎子', '小米'],
  bird: ['啾啾', '米粒', '豆丁', '小灰', '叽喳', '谷子'],
};

const ADOPTERS = [
  '山下开面馆的王阿姨',
  '来寺里写生的美院学生小林',
  '退休的李老师，家里有个小院',
  '每周来上香的陈叔一家',
  '镇卫生院的护士小周',
  '在城里工作的程序员阿杰',
  '种茶的赵大爷',
  '带着孙女来祈福的刘奶奶',
];

const FOODS = [
  { id: 'catfood', label: '猫粮' },
  { id: 'dogfood', label: '狗粮' },
  { id: 'millet', label: '小米' },
  { id: 'bun', label: '馒头' },
  { id: 'milk', label: '牛奶' },
  { id: 'water', label: '清水' },
];
const FOOD_LABEL = { catfood: '猫粮', dogfood: '狗粮', millet: '小米', bun: '馒头', milk: '牛奶', water: '清水', med: '碘伏和纱布' };

/* 饱食、亲近、健康的变化，以及喂完后的真实小知识。 */
const DIET = {
  cat: {
    catfood: { h: 40, t: 8, hp: 0, tip: '猫粮营养全面，它吃得很香。' },
    dogfood: { h: 20, t: 3, hp: 0, tip: '狗粮缺少猫必需的牛磺酸，偶尔吃可以，长期吃会生病。' },
    bun: { h: 12, t: 2, hp: 0, tip: '猫是肉食动物，馒头只能顶饿，几乎没有它需要的营养。' },
    milk: { h: 8, t: 1, hp: -10, tip: '大多数成年猫乳糖不耐受，喝牛奶容易拉肚子。' },
    millet: { refuse: '它闻了闻，不吃小米。' },
    water: { h: 4, t: 2, hp: 2, tip: '猫天生不爱喝水，常备一碗干净的水能少得肾病。' },
  },
  dog: {
    dogfood: { h: 40, t: 8, hp: 0, tip: '狗粮吃得干干净净，尾巴摇个不停。' },
    catfood: { h: 25, t: 4, hp: 0, tip: '猫粮的蛋白和脂肪偏高，狗常吃容易胖。' },
    bun: { h: 22, t: 4, hp: 0, tip: '白馒头狗可以吃一点，别泡咸菜汤，盐多了伤肾。' },
    milk: { h: 8, t: 1, hp: -6, tip: '很多狗也乳糖不耐受，喝牛奶会拉肚子。' },
    millet: { refuse: '它对小米没兴趣。' },
    water: { h: 4, t: 2, hp: 2, tip: '它喝得很急，看来渴坏了。' },
  },
  bird: {
    millet: { h: 45, t: 8, hp: 0, tip: '麻雀最爱小米，啄得飞快。' },
    bun: { h: 18, t: 3, hp: 0, tip: '馒头要掰成碎屑，发霉的千万不能喂。' },
    milk: { h: 0, t: 0, hp: -12, tip: '鸟类消化不了乳糖，喂牛奶很危险。' },
    catfood: { refuse: '颗粒太大，小麻雀啄不动。' },
    dogfood: { refuse: '颗粒太大，小麻雀啄不动。' },
    water: { h: 4, t: 2, hp: 2, tip: '它在碗边蹦来蹦去，喝了几口水。' },
  },
};

const GOODS = [
  { id: 'catfood', label: '猫粮', n: 5, cost: 40, note: '猫的主粮' },
  { id: 'dogfood', label: '狗粮', n: 5, cost: 40, note: '狗的主粮' },
  { id: 'millet', label: '小米', n: 5, cost: 20, note: '小鸟爱吃' },
  { id: 'bun', label: '馒头', n: 5, cost: 10, note: '斋堂剩下的' },
  { id: 'milk', label: '牛奶', n: 3, cost: 15, note: '香客送的' },
  { id: 'med', label: '碘伏和纱布', n: 1, cost: 60, note: '处理伤口' },
];

const MAX_MONK = 8;
const MAX_KENNEL = 8;
const fishCost = lv => Math.round(30 * Math.pow(2, lv - 1));
const monkCost = n => Math.round(150 * Math.pow(2.5, n));
const kennelCost = k => [300, 900, 2500, 6000, 15000][k - 3] || 99999;

/* ---------- 存档 ---------- */
function freshSave() {
  return {
    merit: 0, total: 0, knocks: 0, sutras: 0, bows: 0, bells: 0, rescued: 0,
    fishLv: 1, monk: 0, kennel: 3,
    inv: { catfood: 4, dogfood: 2, millet: 3, bun: 3, milk: 2, med: 1 },
    animals: [], adopted: [], incenseAt: 0, bellDays: {}, sutraProg: {}, sutraCount: {}, offer: {}, wishDays: {}, wishes: 0,
    view: { hour: null, season: null }, opt: { fishBeat: true },
    nextStray: 6, nextId: 1, seenIntro: false, firstDone: false, last: Date.now(),
  };
}

function loadSave() {
  const base = freshSave();
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!s) return base;
    const out = Object.assign(base, s);
    out.inv = Object.assign(freshSave().inv, s.inv || {});
    if (typeof s.sutraPos === 'number' && !(s.sutraProg && s.sutraProg.xinjing)) out.sutraProg = Object.assign({}, out.sutraProg, { xinjing: s.sutraPos });
    delete out.sutraPos;
    out.view = Object.assign({ hour: null, season: null }, s.view || {});
    out.opt = Object.assign({ fishBeat: true }, s.opt || {});
    return out;
  } catch (e) {
    return base;
  }
}

function writeSave() {
  S.last = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* 无痕模式下可能不可用 */ }
}

let S = loadSave();

/* ---------- 运行时状态 ---------- */
const G = {
  clock: 0, hour: null, buttons: [], modal: null, sutra: null, bow: null, ad: null, busy: false,
  shown: S.merit, knockAge: 9, fishHit: 0, monkT: 0, monkAge: 9, bellAge: 9, bellAt: -99, bowAt: -99, incenseAnim: 1,
  weather: { rain: false, t: rnd(150, 300) }, rainAmt: 0,
  smoke: [], leaves: [], floats: [], hearts: [], ripples: [], drops: [], splashes: [],
  toast: null, saveT: 0, speaking: false, sheetTop: 0,
  scene: 'yard', trans: null, snow: 0, wet: 0, flies: [], dust: [], qingAt: -99, drumAt: -99, humUntil: 0, sky: null,
};
G.snow = seasonNow() === 'winter' ? 0.5 : 0;

/* 固定的山形、银杏、星星、地上的落叶。 */
const scenery = (function () {
  const R = rng(17);
  const mountains = [
    { base: 150, amp: 70 }, { base: 196, amp: 52 }, { base: 236, amp: 34 },
  ].map(L => {
    const p = [R() * 6, R() * 6, R() * 6];
    const f = [0.011 + R() * 0.004, 0.027 + R() * 0.01, 0.06 + R() * 0.02];
    const pts = [];
    for (let x = -10; x <= VW + 10; x += 8) {
      const n = 0.55 * Math.sin(x * f[0] + p[0]) + 0.3 * Math.sin(x * f[1] + p[1]) + 0.15 * Math.sin(x * f[2] + p[2]);
      pts.push([x, L.base - L.amp * (0.5 + 0.5 * n)]);
    }
    return pts;
  });
  const blobs = [];
  for (let i = 0; i < 46; i++) {
    const a = R() * TAU;
    const r = Math.sqrt(R());
    blobs.push({ x: Math.cos(a) * r * 80, y: Math.sin(a) * r * 56, r: 14 + R() * 18, ci: Math.floor(R() * 5), ph: R() * 6 });
  }
  blobs.sort((a, b) => a.y - b.y);
  const stars = [];
  for (let i = 0; i < 70; i++) stars.push({ x: R() * VW, y: R() * 200, r: 0.4 + R() * 1.1, ph: R() * 6 });
  const floorLeaves = [];
  for (let i = 0; i < 34; i++) floorLeaves.push({ wx: -1.2 + R() * 1.6, d: R() * 1.1, rot: R() * 6, ci: Math.floor(R() * 5) });
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const n = 4 + Math.floor(R() * 3);
    const puffs = [];
    for (let j = 0; j < n; j++) puffs.push([(j - n / 2) * 14 + R() * 8, R() * 8 - 4, 12 + R() * 10]);
    clouds.push({ x: R() * (VW + 160) - 80, y: 24 + R() * 110, v: 2 + R() * 5, s: 0.7 + R() * 0.6, puffs });
  }
  const puddles = [];
  for (let i = 0; i < 7; i++) puddles.push({ wx: -0.85 + R() * 1.7, d: 0.15 + R() * 0.8, r: 0.5 + R() * 0.7 });
  const twigs = [];
  const grow = (x, y, ang, len, w, depth) => {
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    twigs.push([x, y, x2, y2, w]);
    if (depth > 0) for (let i = 0; i < (depth > 1 ? 3 : 2); i++) grow(x2, y2, ang + (R() - 0.5) * 1.1, len * (0.58 + R() * 0.15), w * 0.62, depth - 1);
  };
  [-2.45, -2.05, -1.6, -1.15, -0.8].forEach(a => grow(0, -120, a, 42 + R() * 10, 4.5, 3));
  return { mountains, blobs, stars, floorLeaves, clouds, puddles, twigs };
})();

/* ---------- 时间和天色 ---------- */
const SKY_KEYS = [
  [0, '#0b1026', '#1d2546', '#262c48', '#1b2038', '#141829', 0.22],
  [5, '#141c3c', '#2d3357', '#2c3150', '#22263f', '#1a1d30', 0.28],
  [6.5, '#5d6fa6', '#f0b38c', '#8a86a2', '#6b6884', '#4c4a62', 0.72],
  [8, '#7fb2d8', '#e2ebe9', '#a3b5bb', '#7f969d', '#61787f', 1],
  [16, '#7aaed6', '#e7ebe6', '#a3b5bb', '#7f969d', '#61787f', 1],
  [17.8, '#6676ad', '#f0a565', '#a28592', '#7e6878', '#5a4b5d', 0.74],
  [19.3, '#1a2144', '#3a3961', '#2e3150', '#222640', '#191b30', 0.3],
  [24, '#0b1026', '#1d2546', '#262c48', '#1b2038', '#141829', 0.22],
];

function realHour() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

function hourNow() {
  if (G.hour != null) return G.hour;
  if (S.view && S.view.hour != null) return S.view.hour;
  return realHour();
}

const SEASON_LEAVES = {
  spring: ['#a8d46f', '#c3e38c', '#8cc152', '#d6ecaa', '#9bcc5e'],
  summer: ['#4e8d3a', '#5f9f45', '#3f7a30', '#71ad55', '#45823a'],
  autumn: ['#e8b82c', '#f1c946', '#d9a21e', '#f6d867', '#c98e18'],
  winter: [],
};
const SEASON_LABEL = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };

function seasonNow() {
  if (S.view && S.view.season) return S.view.season;
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

function skyNow() {
  const h = hourNow();
  let i = 0;
  while (SKY_KEYS[i + 1][0] < h) i++;
  const a = SKY_KEYS[i];
  const b = SKY_KEYS[i + 1];
  const t = (h - a[0]) / (b[0] - a[0]);
  const rain = G.rainAmt;
  const grey = '#6d7378';
  const c = j => {
    const base = mixColor(a[j], b[j], t);
    if (rain <= 0) return base;
    const m = base.match(/\d+/g).map(Number);
    const g = hexRgb(grey);
    return 'rgb(' + m.map((v, k) => Math.round(v + (g[k] * (0.4 + 0.6 * (a[6] + (b[6] - a[6]) * t)) - v) * rain * 0.55)).join(',') + ')';
  };
  const g1 = Math.exp(-Math.pow((h - 6.6) / 0.9, 2));
  const g2 = Math.exp(-Math.pow((h - 17.9) / 0.9, 2));
  return { top: c(1), bot: c(2), m: [c(3), c(4), c(5)], light: (a[6] + (b[6] - a[6]) * t) * (1 - rain * 0.25), warm: (g1 + g2) * (1 - rain) };
}

const SHICHEN = '子丑寅卯辰巳午未申酉戌亥';
function shichen() {
  const h = hourNow();
  return SHICHEN[Math.floor(((h + 1) % 24) / 2)] + '时';
}

function isNight() {
  const h = hourNow();
  return h >= 21.5 || h < 5.5;
}

/* ---------- 声音：全部用 WebAudio 合成，不需要素材 ---------- */
let AC = null;
let master = null;
let muted = false;
let noiseBuf = null;
let rainNode = null;

let bus = null;
let verbIn = null;
let drone = null;

/* 混响用的脉冲响应：一段逐渐衰减的噪声，模拟大殿的空间感。 */
function impulse(sec, decay) {
  const len = Math.floor(AC.sampleRate * sec);
  const buf = AC.createBuffer(2, len, AC.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function audio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain();
      master.gain.value = muted ? 0 : 0.9;
      master.connect(AC.destination);
      noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const verb = AC.createConvolver();
      verb.buffer = impulse(3.4, 2.6);
      verbIn = AC.createGain();
      const wet = AC.createGain();
      wet.gain.value = 0.32;
      verbIn.connect(verb);
      verb.connect(wet);
      wet.connect(master);
      bus = AC.createGain();
      bus.connect(master);
      const send = AC.createGain();
      send.gain.value = 0.35;
      bus.connect(send);
      send.connect(verbIn);
    } catch (e) {
      AC = null;
    }
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}

function env(g, t, peak, attack, decay) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(type, f0, f1, peak, attack, decay, when, dest) {
  const t = AC.currentTime + (when || 0);
  const o = AC.createOscillator();
  const g = AC.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + attack + decay * 0.5);
  env(g, t, peak, attack, decay);
  o.connect(g);
  g.connect(dest || bus);
  o.start(t);
  o.stop(t + attack + decay + 0.05);
}

function noise(freq, q, peak, attack, decay, when, type) {
  const t = AC.currentTime + (when || 0);
  const s = AC.createBufferSource();
  s.buffer = noiseBuf;
  const f = AC.createBiquadFilter();
  f.type = type || 'bandpass';
  f.frequency.value = freq;
  f.Q.value = q;
  const g = AC.createGain();
  env(g, t, peak, attack, decay);
  s.connect(f);
  f.connect(g);
  g.connect(bus);
  s.start(t, Math.random());
  s.stop(t + attack + decay + 0.05);
}

/* 木鱼：空腔木头的“笃”，主音很快下滑，再加一点敲击声。 */
function sndFish(soft) {
  if (!audio()) return;
  const v = soft ? 0.14 : 0.55;
  const p = soft ? 1.2 : 1;
  tone('sine', 780 * p, 560 * p, v, 0.002, 0.16);
  tone('sine', 1720 * p, 1500 * p, v * 0.25, 0.001, 0.05);
  noise(2400, 1.5, v * 0.5, 0.001, 0.03);
}

/*
 * 梵钟：82Hz 的低沉主音，加上大钟特有的不和谐泛音。
 * 每个泛音用两个略微错开的频率，产生“嗡——嗡——”的起伏，余音十几秒，再送进混响。
 */
function sndBell() {
  if (!audio()) return;
  const t = AC.currentTime;
  const grp = AC.createGain();
  grp.gain.value = 0.8;
  const lp = AC.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2600;
  grp.connect(lp);
  lp.connect(bus);
  const extra = AC.createGain();
  extra.gain.value = 0.5;
  lp.connect(extra);
  extra.connect(verbIn);
  const f0 = 82;
  [[0.5, 0.16, 18, 0.25], [1, 0.3, 15, 0.45], [2.03, 0.19, 11, 0.8], [2.76, 0.11, 8, 1.1], [3.5, 0.08, 6, 1.4], [4.6, 0.05, 4.5, 1.7], [5.92, 0.035, 3.2, 2.1], [7.3, 0.022, 2.2, 2.6]].forEach(([r, v, d, beat]) => {
    [-beat / 2, beat / 2].forEach(db => {
      const o = AC.createOscillator();
      const g = AC.createGain();
      o.type = 'sine';
      o.frequency.value = f0 * r + db;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v * 0.55, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g);
      g.connect(grp);
      o.start(t);
      o.stop(t + d + 0.1);
    });
  });
  noise(180, 0.7, 0.4, 0.003, 0.3, 0, 'lowpass');
  tone('triangle', 1320, 1240, 0.035, 0.002, 0.6);
}

/* 引磬：清脆的“叮”，两组略微错开的高音互相拍出颤音。 */
function sndChime() {
  if (!audio()) return;
  [[1, 0.16, 4.5], [1.0025, 0.12, 4.5], [2.72, 0.07, 2.4], [2.725, 0.05, 2.4], [5.1, 0.03, 1.2], [8.2, 0.015, 0.6]].forEach(([r, v, d]) => tone('sine', 1040 * r, 1040 * r, v, 0.002, d));
}

/* 没有中文语音时的吟唱声：一字一个低沉的元音，句尾音调落下。 */
function chantHum(n) {
  if (!audio()) return;
  const t0 = AC.currentTime;
  const stepT = 0.34;
  for (let i = 0; i < n; i++) {
    const t = t0 + i * stepT;
    const o = AC.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(i === n - 1 ? 104 : 117, t);
    const f1 = AC.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 520;
    f1.Q.value = 5;
    const f2 = AC.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 900;
    f2.Q.value = 6;
    const g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + stepT * 0.95);
    o.connect(f1);
    o.connect(f2);
    f1.connect(g);
    f2.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + stepT);
  }
  G.humUntil = t0 + n * stepT;
}

/* 诵经时的低沉底音，像殿里的共鸣。 */
function startDrone() {
  if (drone || !audio()) return;
  const t = AC.currentTime;
  const g = AC.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.026, t + 2.5);
  g.connect(bus);
  const oscs = [98, 147, 196.4].map((f, i) => {
    const o = AC.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const og = AC.createGain();
    og.gain.value = [1, 0.55, 0.22][i];
    o.connect(og);
    og.connect(g);
    o.start(t);
    return o;
  });
  const lfo = AC.createOscillator();
  const lg = AC.createGain();
  lfo.frequency.value = 0.12;
  lg.gain.value = 0.008;
  lfo.connect(lg);
  lg.connect(g.gain);
  lfo.start(t);
  drone = { g, oscs: oscs.concat([lfo]) };
}

function stopDrone() {
  if (!drone || !AC) return;
  const d = drone;
  drone = null;
  const t = AC.currentTime;
  d.g.gain.cancelScheduledValues(t);
  d.g.gain.setValueAtTime(Math.max(0.0001, d.g.gain.value), t);
  d.g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  d.oscs.forEach(o => o.stop(t + 1.3));
}

function sndMeow() {
  if (!audio()) return;
  const t = AC.currentTime;
  const o = AC.createOscillator();
  const f = AC.createBiquadFilter();
  const g = AC.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(480, t);
  o.frequency.linearRampToValueAtTime(760, t + 0.18);
  o.frequency.linearRampToValueAtTime(520, t + 0.55);
  f.type = 'bandpass';
  f.Q.value = 3;
  f.frequency.setValueAtTime(900, t);
  f.frequency.linearRampToValueAtTime(1700, t + 0.2);
  f.frequency.linearRampToValueAtTime(800, t + 0.55);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(f).connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.65);
}

function sndWoof() {
  if (!audio()) return;
  [0, 0.22].forEach(w => {
    tone('sawtooth', 300, 170, 0.12, 0.01, 0.13, w);
    noise(700, 1, 0.12, 0.005, 0.1, w);
  });
}

function sndChirp(vol) {
  if (!audio()) return;
  const v = vol || 1;
  [0, 0.09, 0.2].forEach(w => tone('sine', 3800, 5200, 0.06 * v, 0.005, 0.05, w));
}

function sndDrum() {
  if (!audio()) return;
  tone('sine', 120, 52, 0.55, 0.004, 0.9);
  tone('sine', 190, 90, 0.18, 0.003, 0.3);
  noise(260, 0.8, 0.35, 0.002, 0.18, 0, 'lowpass');
}

function sndPurr() {
  if (!audio()) return;
  for (let i = 0; i < 9; i++) noise(160, 1, 0.1, 0.02, 0.07, i * 0.11, 'lowpass');
}

function soundFor(a) {
  const type = KINDS[a.kind].type;
  if (type === 'cat') sndMeow();
  else if (type === 'dog') sndWoof();
  else sndChirp();
}

function updateRainSound() {
  if (!AC) return;
  if (!rainNode && G.rainAmt > 0.01) {
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const f = AC.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1400;
    f.Q.value = 0.4;
    const g = AC.createGain();
    g.gain.value = 0;
    s.connect(f).connect(g).connect(master);
    s.start();
    rainNode = { s, g };
  }
  if (rainNode) rainNode.g.gain.value = G.rainAmt * (seasonNow() === 'winter' ? 0 : 0.16);
}

function setMuted(m) {
  muted = m;
  if (master) master.gain.value = muted ? 0 : 0.9;
  if (muted) stopSpeech();
}

/* ---------- 诵经朗读：用系统自带的中文语音 ---------- */
let zhVoice = null;
const hasTTS = typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices();
    zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs.find(v => /^zh/i.test(v.lang)) || null;
  } catch (e) {
    zhVoice = null;
  }
}
if (hasTTS) {
  pickVoice();
  try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) { /* 部分浏览器不支持 */ }
}

let ttsPending = 0;

function canSpeak() {
  if (!hasTTS || muted) return false;
  try {
    const vs = speechSynthesis.getVoices();
    return !vs.length || !!zhVoice;
  } catch (e) {
    return false;
  }
}

/* 一句一句念。手动敲得太快时，丢掉积压的句子，从当前这句接着念。 */
function speak(str, rate) {
  if (!canSpeak()) return false;
  try {
    if (ttsPending > 1) {
      speechSynthesis.cancel();
      ttsPending = 0;
    }
    const u = new SpeechSynthesisUtterance(str);
    u.lang = 'zh-CN';
    u.rate = rate || 0.75;
    u.pitch = 0.55;
    if (zhVoice) u.voice = zhVoice;
    ttsPending++;
    G.speaking = true;
    const done = () => {
      ttsPending = Math.max(0, ttsPending - 1);
      G.speaking = ttsPending > 0;
    };
    u.onend = done;
    u.onerror = done;
    speechSynthesis.speak(u);
    return true;
  } catch (e) {
    ttsPending = 0;
    G.speaking = false;
    return false;
  }
}

function stopSpeech() {
  ttsPending = 0;
  G.speaking = false;
  try { if (hasTTS) speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
}

function voiceBusy() {
  return G.speaking || (!!AC && AC.currentTime < (G.humUntil || 0));
}

/* ---------- 广告 ---------- */
function fakeAd(rewarded) {
  return new Promise(resolve => { G.ad = { left: 3, rewarded, resolve }; });
}

const demoProvider = {
  name: 'demo',
  showRewarded: () => fakeAd(true),
  showInterstitial: () => fakeAd(false),
  showBanner: () => Promise.resolve({ ok: true }),
  hideBanner() {},
};

const ads = AdKit.create({
  provider: demoProvider,
  storage: AdKit.webStorage(),
  placements: {
    food_pack: { format: 'rewarded', unitId: 'your-rewarded-id', maxPerDay: 8 },
    heal_now: { format: 'rewarded', unitId: 'your-rewarded-id', maxPerDay: 20 },
  },
});

function closeAd(completed) {
  const ad = G.ad;
  G.ad = null;
  ad.resolve(ad.rewarded ? { ok: true, completed } : { ok: true });
}

async function watchFoodPack() {
  if (G.busy) return;
  G.busy = true;
  const r = await ads.showRewarded('food_pack');
  G.busy = false;
  if (!r.rewarded) return;
  S.inv.catfood += 5;
  S.inv.dogfood += 5;
  S.inv.millet += 5;
  S.inv.med += 1;
  toast('领到粮食包：猫粮 5、狗粮 5、小米 5、碘伏纱布 1');
  writeSave();
}

async function watchHeal(a) {
  if (G.busy) return;
  G.busy = true;
  const r = await ads.showRewarded('heal_now');
  G.busy = false;
  if (!r.rewarded) return;
  a.injured = '';
  a.treated = false;
  a.health = 100;
  a.trust = Math.min(100, a.trust + 5);
  burstHearts(a);
  toast(nameOf(a) + '的伤完全好了');
  writeSave();
}

/* ---------- 功德 ---------- */
function incenseLeft() {
  return Math.max(0, INCENSE_SEC - (Date.now() - S.incenseAt) / 1000);
}
function mult() {
  return incenseLeft() > 0 ? 2 : 1;
}

function gain(v) {
  S.merit += v;
  S.total += v;
}

function spend(cost) {
  if (S.merit < cost) {
    toast('功德不够，还差 ' + fmt(cost - S.merit));
    return false;
  }
  S.merit -= cost;
  G.shown = Math.min(G.shown, S.merit);
  return true;
}

function fishPos() {
  return [VW / 2, PANEL_TOP + 84];
}

function knock(source) {
  const v = S.fishLv * mult();
  gain(v);
  S.knocks++;
  if (source === 'monk') {
    G.monkAge = 0;
    if (!G.sutra) sndFish(true);
    floatText('+' + fmt(v), 66 + rnd(-6, 6), PANEL_TOP + 52, '#f3d27a', 12);
    return;
  }
  G.knockAge = 0;
  G.fishHit = 1;
  /* 诵经时以念经的人声为主，木鱼只轻轻打拍子，也可以关掉。 */
  if (!G.sutra) sndFish(false);
  else if (S.opt.fishBeat) sndFish(true);
  const [fx, fy] = fishPos();
  floatText('功德 +' + fmt(v), fx + rnd(-30, 30), fy - 64, '#ffd77a', 17);
  G.ripples.push({ x: fx, y: fy, r: 50, life: 0.6 });
  if (G.sutra) advanceSutra();
}

function sutraPos(id) {
  return S.sutraProg[id] || 0;
}

function advanceSutra() {
  const g = G.sutra;
  const su = sutraById(g.id);
  const p = sutraPos(su.id);
  const ph = su.phrases.find(q => q.start === p);
  if (ph && !speak(ph.text, su.rate)) chantHum(ph.text.length);
  S.sutraProg[su.id] = p + 1;
  if (p + 1 >= su.chars.length) {
    S.sutraProg[su.id] = 0;
    S.sutraCount[su.id] = (S.sutraCount[su.id] || 0) + 1;
    S.sutras++;
    const v = Math.round(20 + su.chars.length * 0.4) * S.fishLv * mult();
    gain(v);
    g.auto = false;
    g.done = 3;
    sndChime();
    toast('诵毕一遍' + su.short + '，功德 +' + fmt(v));
    writeSave();
  }
}

function openSutra() {
  if (G.bow) return;
  audio();
  G.modal = { type: 'sutras' };
}

function chooseSutra(id) {
  G.modal = null;
  G.sutra = { id, auto: false, t: 0, wait: 0, done: 0 };
  startDrone();
  if (!canSpeak() && !muted) toast('这台设备没有中文朗读语音，会用吟唱声代替', 'info', 4);
}

function closeSutra() {
  stopSpeech();
  stopDrone();
  G.sutra = null;
  writeSave();
}

function switchSutra() {
  closeSutra();
  openSutra();
}

function toggleAutoSutra() {
  const g = G.sutra;
  g.auto = !g.auto;
  g.t = 0.2;
  if (!g.auto) stopSpeech();
}

function toggleFishBeat() {
  S.opt.fishBeat = !S.opt.fishBeat;
  toast(S.opt.fishBeat ? '诵经时木鱼轻轻打拍子' : '诵经时不出木鱼声，只念经');
  writeSave();
}

function lightIncense() {
  if (G.bow) return;
  const left = incenseLeft();
  if (left > 0) {
    toast('香还燃着，还剩 ' + clockText(left));
    return;
  }
  S.incenseAt = Date.now();
  G.incenseAnim = 0;
  gain(5);
  sndChime();
  toast('上了三炷香。香燃着的时候，功德翻倍');
  writeSave();
}

function startBow() {
  if (G.bow || G.sutra) return;
  const wait = BOW_COOLDOWN - (G.clock - G.bowAt);
  if (wait > 0) {
    toast('刚拜过，' + Math.ceil(wait) + ' 秒后再来');
    return;
  }
  G.bow = { t: 0, n: 0 };
}

function finishBow() {
  const v = (15 + 5 * S.fishLv) * mult();
  gain(v);
  S.bows++;
  G.bowAt = G.clock;
  G.bow = null;
  toast('三拜已毕，功德 +' + fmt(v));
  writeSave();
}

function strikeBell() {
  const wait = BELL_COOLDOWN - (G.clock - G.bellAt);
  if (wait > 0) return;
  G.bellAt = G.clock;
  G.bellAge = 0;
  sndBell();
  S.bells++;
  let v = 2 * S.fishLv * mult();
  const h = realHour();
  const slot = h >= 5 && h < 9 ? 'am' : h >= 17 && h < 21 ? 'pm' : '';
  const key = dayKey() + slot;
  if (slot && !S.bellDays[key]) {
    S.bellDays = { [key]: 1, [dayKey() + (slot === 'am' ? 'pm' : 'am')]: S.bellDays[dayKey() + (slot === 'am' ? 'pm' : 'am')] || 0 };
    const bonus = 60 * mult();
    v += bonus;
    toast((slot === 'am' ? '晨钟' : '暮钟') + '响彻山谷，今日加持功德 +' + fmt(bonus));
  }
  gain(v);
  const p = bellPos();
  floatText('功德 +' + fmt(v), p[0], p[1] - 120, '#ffd77a', 15);
}

/* ---------- 小动物 ---------- */
function nameOf(a) {
  return a.name || ('这只' + KINDS[a.kind].label);
}

function pickKind() {
  const list = Object.keys(KINDS);
  let total = 0;
  list.forEach(k => { total += KINDS[k].w; });
  let r = Math.random() * total;
  for (const k of list) {
    r -= KINDS[k].w;
    if (r <= 0) return k;
  }
  return 'orange';
}

function spawnStray(forceKind, forceInjured) {
  const kind = forceKind || pickKind();
  const type = KINDS[kind].type;
  const injured = forceInjured != null ? forceInjured : Math.random() < 0.4;
  const side = Math.random() < 0.5 ? -1 : 1;
  const a = {
    id: S.nextId++, kind, name: '', wx: side * 1.5, d: rnd(0.55, 0.9), tx: side * rnd(0.25, 0.6), td: rnd(0.45, 0.85),
    dir: -side, state: 'arrive', t: 0, phase: 0, hop: 0, hunger: rnd(12, 32), health: injured ? rnd(42, 58) : rnd(68, 86),
    trust: rnd(4, 14), injured: injured ? pick(INJURIES[type]) : '', treated: false, petAt: -99, waterAt: -99, bowl: '', blink: 2,
  };
  S.animals.push(a);
  S.rescued++;
  toast('山门外来了一只' + (injured ? '受伤的' : '饿肚子的') + KINDS[kind].label + '，点它看看');
  soundFor(a);
  return a;
}

function randomSpot() {
  for (let i = 0; i < 20; i++) {
    const wx = rnd(-0.85, 0.85);
    const d = rnd(0.1, 0.95);
    if (Math.abs(wx) < 0.3 && Math.abs(d - 0.45) < 0.14) continue;
    return [wx, d];
  }
  return [0.5, 0.7];
}

function setState(a, state, t) {
  a.state = state;
  a.t = t;
}

function walkTo(a, wx, d, state) {
  a.tx = clamp(wx, -1.6, 1.6);
  a.td = clamp(d, 0, 1);
  a.state = state || 'walk';
}

function pickNext(a) {
  const type = KINDS[a.kind].type;
  if (isNight()) {
    const home = type === 'bird' ? [-0.98, 0.24] : [-0.66 + (a.id % 3 - 1) * 0.12, 0.8 + (a.id % 2) * 0.06];
    if (Math.hypot(a.wx - home[0], a.d - home[1]) > 0.1) return walkTo(a, home[0] + rnd(-0.04, 0.04), home[1] + rnd(-0.03, 0.03));
    return setState(a, 'sleep', rnd(20, 40));
  }
  if (G.rainAmt > 0.5) {
    if (a.d > 0.12) return walkTo(a, rnd(-0.6, 0.6), rnd(0.02, 0.09));
    return setState(a, Math.random() < 0.5 ? 'sit' : 'lie', rnd(6, 12));
  }
  const r = Math.random();
  if (type === 'bird') {
    if (r < 0.55) {
      const [wx, d] = randomSpot();
      return walkTo(a, lerp(a.wx, wx, 0.4), lerp(a.d, d, 0.4));
    }
    return setState(a, 'peck', rnd(2, 5));
  }
  if (r < 0.42) {
    const [wx, d] = randomSpot();
    return walkTo(a, wx, d);
  }
  if (r < 0.66) return setState(a, 'sit', rnd(4, 9));
  if (r < 0.84) return setState(a, type === 'cat' ? 'groom' : 'lie', rnd(4, 8));
  if (a.hunger > 40) return setState(a, 'sleep', rnd(12, 25));
  return setState(a, 'sit', rnd(3, 6));
}

function speedOf(a) {
  const type = KINDS[a.kind].type;
  let v = type === 'dog' ? 0.22 : type === 'bird' ? 0.3 : 0.16;
  if (a.state === 'flee' || a.state === 'arrive') v *= 1.6;
  if (a.injured && !a.treated) v *= 0.45;
  return v;
}

function updateAnimal(a, dt) {
  const type = KINDS[a.kind].type;
  a.blink -= dt;
  if (a.blink < -0.14) a.blink = rnd(2, 6);

  /* 身体状况 */
  a.hunger = Math.max(0, a.hunger - dt / 20);
  if (a.injured && a.treated) {
    a.health = Math.min(100, a.health + dt / 3);
    if (a.health >= 100) {
      a.injured = '';
      a.treated = false;
      toast(nameOf(a) + '的伤好了');
    }
  } else if (a.injured) {
    a.health = Math.max(25, a.health - dt / 30);
  } else if (a.hunger > 30) {
    a.health = Math.min(100, a.health + dt / 10);
  }
  if (a.hunger <= 0) a.health = Math.max(30, a.health - dt / 40);
  if (a.hunger < 25 && !a.leaving && Math.random() < dt / 30) {
    soundFor(a);
    a.cry = 1;
  }
  a.cry = Math.max(0, (a.cry || 0) - dt);

  /* 被选中时停下来，方便照顾 */
  const selected = G.modal && G.modal.id === a.id;
  if (selected && (a.state === 'walk' || a.state === 'sit' || a.state === 'groom' || a.state === 'peck')) {
    a.state = 'sit';
    a.t = 1;
    return;
  }

  if (a.state === 'walk' || a.state === 'arrive' || a.state === 'flee' || a.state === 'leave') {
    const dx = a.tx - a.wx;
    const dd = (a.td - a.d) * 1.3;
    const dist = Math.hypot(dx, dd);
    if (Math.abs(dx) > 0.004) a.dir = dx > 0 ? 1 : -1;
    const v = speedOf(a);
    if (type === 'bird') {
      a.hop = (a.hop + dt) % 0.34;
      if (a.hop > 0.2) return;
    }
    a.phase += dt * (type === 'bird' ? 0 : 11) * (a.injured && !a.treated ? 0.6 : 1);
    if (dist <= v * dt) {
      a.wx = a.tx;
      a.d = a.td;
      if (a.state === 'leave') {
        S.animals = S.animals.filter(b => b !== a);
        return;
      }
      if (a.state === 'arrive') setState(a, 'sit', rnd(3, 6));
      else pickNext(a);
      return;
    }
    a.wx += dx / dist * v * dt;
    a.d += dd / dist * v * dt / 1.3;
    return;
  }

  a.t -= dt;
  if (a.state === 'eat' && a.t <= 0) a.bowl = '';
  if (a.t <= 0) pickNext(a);
}

function animalScale(a, p) {
  return p[2] * (KINDS[a.kind].type === 'bird' ? 1.45 : 1.55);
}

function hitAnimal(x, y) {
  const list = S.animals.filter(a => !a.leaving).sort((a, b) => b.d - a.d);
  for (const a of list) {
    const p = yard(a.wx, a.d);
    const type = KINDS[a.kind].type;
    const k = animalScale(a, p);
    const cy = p[1] - (type === 'bird' ? 8 : 18) * k;
    const r = (type === 'bird' ? 14 : 28) * k + 10;
    if (Math.hypot(x - p[0], y - cy) < r) return a;
  }
  return null;
}

function openAnimal(a) {
  audio();
  G.modal = { type: 'animal', id: a.id };
  if (a.state === 'walk' || a.state === 'arrive') setState(a, 'sit', 1);
  if (!S.firstDone) S.firstDone = true;
}

function animalById(id) {
  return S.animals.find(a => a.id === id);
}

function burstHearts(a, n) {
  const p = yard(a.wx, a.d);
  for (let i = 0; i < (n || 4); i++) G.hearts.push({ x: p[0] + rnd(-12, 12), y: p[1] - 40 * p[2] + rnd(-8, 4), vy: rnd(-34, -22), life: rnd(1, 1.5) });
}

function feed(a, foodId) {
  const type = KINDS[a.kind].type;
  if (foodId !== 'water' && !(S.inv[foodId] > 0)) {
    toast('没有' + FOOD_LABEL[foodId] + '了。去商店买，或看广告领粮食包');
    return;
  }
  const rule = DIET[type][foodId];
  if (rule.refuse) {
    toast(rule.refuse);
    return;
  }
  if (foodId === 'water' && G.clock - a.waterAt < 60) {
    toast('碗里的水还没喝完');
    return;
  }
  if (a.hunger >= 92) {
    toast(nameOf(a) + '还饱着呢');
    return;
  }
  if (foodId === 'water') a.waterAt = G.clock;
  else S.inv[foodId]--;
  a.hunger = Math.min(100, a.hunger + rule.h);
  a.trust = Math.min(100, a.trust + rule.t);
  a.health = clamp(a.health + rule.hp, 5, 100);
  setState(a, 'eat', 3.2);
  a.bowl = foodId;
  toast(rule.tip, rule.hp < 0 ? 'warn' : 'tip', 5);
  if (rule.t >= 4) burstHearts(a, 3);
  if (rule.hp < 0) soundFor(a);
  writeSave();
}

function pet(a) {
  const type = KINDS[a.kind].type;
  if (a.trust < 25) {
    const [wx, d] = randomSpot();
    G.modal = null;
    walkTo(a, wx, d, 'flee');
    toast(nameOf(a) + '还怕人，躲开了。先喂点吃的吧');
    return;
  }
  if (G.clock - a.petAt < 12) {
    toast(nameOf(a) + '已经被摸得很舒服了');
    return;
  }
  a.petAt = G.clock;
  a.trust = Math.min(100, a.trust + 3);
  burstHearts(a, 5);
  if (type === 'cat') {
    sndPurr();
    toast('它眯起眼睛，喉咙里呼噜呼噜响');
  } else if (type === 'dog') {
    sndWoof();
    a.wag = 2.5;
    toast('它翻过肚皮，尾巴摇个不停');
  } else {
    sndChirp();
    toast('它歪着头看你，没有飞走');
  }
}

function treat(a) {
  if (!(S.inv.med > 0)) {
    toast('没有碘伏和纱布了。去商店买，或看广告领');
    return;
  }
  S.inv.med--;
  a.treated = true;
  a.trust = Math.min(100, a.trust + 5);
  toast('用碘伏清理了伤口，包好纱布。过一会儿就能好');
  writeSave();
}

function canAdopt(a) {
  return !!a.name && a.trust >= 80 && a.health >= 90 && !a.injured && a.hunger >= 50;
}

function openNaming(a) {
  const type = KINDS[a.kind].type;
  const used = new Set(S.animals.map(b => b.name).concat(S.adopted.map(b => b.name)));
  const pool = NAMES[type].filter(n => !used.has(n));
  const opts = [];
  while (opts.length < 3 && pool.length) opts.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  if (!opts.length) opts.push(KINDS[a.kind].label.slice(-1) + S.nextId);
  G.modal = { type: 'name', id: a.id, opts };
}

function giveName(a, n) {
  a.name = n;
  a.trust = Math.min(100, a.trust + 2);
  G.modal = { type: 'animal', id: a.id };
  toast('它以后就叫' + n + '了');
  soundFor(a);
  writeSave();
}

function adopt(a) {
  const who = pick(ADOPTERS);
  const v = Math.round((120 + 30 * S.fishLv) * mult());
  gain(v);
  const d = new Date();
  S.adopted.unshift({ name: a.name, kind: a.kind, who, date: (d.getMonth() + 1) + '月' + d.getDate() + '日' });
  if (S.adopted.length > 60) S.adopted.length = 60;
  a.leaving = true;
  walkTo(a, a.wx < 0 ? -1.6 : 1.6, a.d, 'leave');
  burstHearts(a, 8);
  G.modal = { type: 'adopted', name: a.name, kind: a.kind, who, v };
  sndChime();
  writeSave();
}

/* ---------- 商店 ---------- */
function buyGood(g) {
  if (!spend(g.cost)) return;
  S.inv[g.id] += g.n;
  toast('买了' + g.label + ' ' + g.n + (g.id === 'med' ? ' 份' : ' 份'));
  writeSave();
}

function upgradeFish() {
  if (!spend(fishCost(S.fishLv))) return;
  S.fishLv++;
  sndFish(false);
  toast('换了一只更好的木鱼，每敲一下功德 +' + S.fishLv);
  writeSave();
}

function hireMonk() {
  if (S.monk >= MAX_MONK) return;
  if (!spend(monkCost(S.monk))) return;
  S.monk++;
  toast(S.monk === 1 ? '来了一位小沙弥，会帮你一直敲木鱼' : '又来了一位小沙弥，现在有 ' + S.monk + ' 位');
  writeSave();
}

function growKennel() {
  if (S.kennel >= MAX_KENNEL) return;
  if (!spend(kennelCost(S.kennel))) return;
  S.kennel++;
  toast('猫窝扩建好了，最多能收留 ' + S.kennel + ' 只');
  writeSave();
}

/* ---------- 每帧更新 ---------- */
function toast(textStr, kind, sec) {
  G.toast = { text: textStr, kind: kind || 'info', t: sec || 2.8 };
}

function floatText(str, x, y, color, size) {
  G.floats.push({ text: str, x, y, color, size, life: 1.1 });
  if (G.floats.length > 40) G.floats.shift();
}

function clockText(sec) {
  const s = Math.ceil(sec);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function burnerPos() {
  return yard(0, 0.46);
}
function bellPos() {
  const p = yard(1.0, 0.16);
  return [p[0] + 20, p[1], p[2]];
}

function incenseTips() {
  const left = incenseLeft();
  if (left <= 0) return [];
  const rise = Math.min(1, G.incenseAnim);
  if (G.scene === 'hall') {
    const base = hallLayout().altarY - 3 - 15;
    const len = (5 + 20 * left / INCENSE_SEC) * rise;
    return [-5, 0, 5].map((ox, i) => [200 + ox + (i - 1) * 1.5, base - len]);
  }
  const [x, y, s] = burnerPos();
  const k = s * 1.5;
  const len = (6 + 26 * left / INCENSE_SEC) * rise;
  return [-7, 0, 7].map((ox, i) => [x + (ox + (i - 1) * 2) * k, y + (-60 - len) * k]);
}

function step(dt) {
  G.clock += dt;
  G.knockAge += dt;
  G.monkAge += dt;
  G.bellAge += dt;
  G.incenseAnim = Math.min(1, G.incenseAnim + dt * 1.5);
  G.fishHit = Math.max(0, G.fishHit - dt * 8);
  G.shown += (S.merit - G.shown) * Math.min(1, dt * 10);
  if (Math.abs(S.merit - G.shown) < 0.5) G.shown = S.merit;

  if (G.ad) {
    G.ad.left -= dt;
    if (G.ad.left <= 0) closeAd(true);
  }

  const started = S.seenIntro;

  if (S.monk > 0 && started) {
    G.monkT += dt;
    const iv = 2.5 / S.monk;
    while (G.monkT >= iv) {
      G.monkT -= iv;
      knock('monk');
    }
  }

  const sg = G.sutra;
  if (sg) {
    sg.done = Math.max(0, sg.done - dt);
    if (sg.auto) {
      const su = sutraById(sg.id);
      sg.t -= dt;
      if (sg.t <= 0) {
        const pos = sutraPos(su.id);
        const atBreak = pos > 0 && su.phrases.some(q => q.end === pos);
        if (atBreak && voiceBusy() && sg.wait < 8) {
          sg.wait += dt;
          sg.t = 0;
        } else {
          sg.wait = 0;
          knock('sutra');
          const p2 = sutraPos(su.id);
          sg.t = 0.3 + (su.phrases.some(q => q.end === p2) ? 0.2 : 0);
        }
      }
    }
  }

  if (G.bow) {
    const b = G.bow;
    b.t += dt;
    const marks = [0.35, 1.95, 3.55];
    while (b.n < 3 && b.t >= marks[b.n]) {
      sndChime();
      b.n++;
    }
    if (b.t >= 5.3) finishBow();
  }

  /* 天气 */
  const w = G.weather;
  w.t -= dt;
  if (w.t <= 0) {
    if (w.rain) {
      w.rain = false;
      w.t = rnd(300, 600);
    } else if (Math.random() < 0.5 && !isNight()) {
      w.rain = true;
      w.t = rnd(90, 200);
      toast(seasonNow() === 'winter' ? '下雪了，小动物们躲到屋檐下' : '下雨了，小动物们躲到屋檐下');
      S.animals.forEach(a => { if (a.state !== 'leave' && a.state !== 'eat') a.t = Math.min(a.t, rnd(0, 1.5)); });
    } else {
      w.t = rnd(200, 400);
    }
  }
  G.rainAmt = clamp(G.rainAmt + (w.rain ? dt / 4 : -dt / 6), 0, 1);
  updateRainSound();

  /* 进出大殿的淡入淡出 */
  if (G.trans) {
    G.trans.t += dt;
    if (G.trans.t >= 0.3 && G.scene !== G.trans.to) {
      G.scene = G.trans.to;
      G.smoke.length = 0;
      G.leaves.length = 0;
    }
    if (G.trans.t >= 0.6) G.trans = null;
  }

  /* 积雪和地面湿度 */
  const winterNow = seasonNow() === 'winter';
  if (G.weather.rain && winterNow) G.snow = Math.min(1, G.snow + dt / 90);
  else G.snow = Math.max(0, G.snow - dt / (winterNow ? 900 : 40));
  if (G.weather.rain && !winterNow) G.wet = Math.min(1, G.wet + dt / 20);
  else G.wet = Math.max(0, G.wet - dt / 150);

  scenery.clouds.forEach(c => {
    c.x += c.v * dt * (1 + G.rainAmt);
    if (c.x > VW + 100) c.x = -100;
  });

  /* 夏夜萤火虫 */
  const hh = hourNow();
  if (seasonNow() === 'summer' && (hh >= 19.5 || hh < 4.5) && G.rainAmt < 0.3) {
    while (G.flies.length < 14) G.flies.push({ wx: rnd(-0.9, 0.9), d: rnd(0.1, 0.9), h: rnd(8, 40), ph: rnd(0, 6), sp: rnd(0.5, 1.2) });
    G.flies.forEach(f => {
      f.wx = clamp(f.wx + Math.sin(G.clock * 0.4 * f.sp + f.ph) * 0.05 * dt, -1, 1);
      f.d = clamp(f.d + Math.cos(G.clock * 0.3 * f.sp + f.ph * 2) * 0.04 * dt, 0.05, 0.95);
      f.h = clamp(f.h + Math.sin(G.clock * f.sp + f.ph) * 6 * dt, 4, 50);
    });
  } else {
    G.flies.length = 0;
  }

  /* 殿里光柱中的浮尘 */
  if (G.scene === 'hall') {
    while (G.dust.length < 26) G.dust.push({ x: rnd(40, 320), y: rnd(80, 360), vx: rnd(-3, 3), vy: rnd(-2, 2), ph: rnd(0, 6) });
    G.dust.forEach(p => {
      p.x += (p.vx + Math.sin(G.clock * 0.5 + p.ph) * 2) * dt;
      p.y += (p.vy + Math.cos(G.clock * 0.4 + p.ph) * 1.5) * dt;
      if (p.x < 30 || p.x > 340 || p.y < 70 || p.y > PANEL_TOP - 30) {
        p.x = rnd(60, 300);
        p.y = rnd(90, 340);
      }
    });
  }

  /* 清晨山里的鸟叫 */
  if (!G.sutra && G.scene === 'yard' && hh >= 5.5 && hh < 10 && G.rainAmt < 0.2 && seasonNow() !== 'winter' && Math.random() < dt / 9) sndChirp(0.35);

  /* 流浪动物 */
  if (started) {
    S.nextStray -= dt;
    const living = S.animals.filter(a => !a.leaving).length;
    if (S.nextStray <= 0) {
      if (living < S.kennel) {
        if (S.rescued === 0) spawnStray('orange', true);
        else spawnStray();
        S.nextStray = living === 0 ? 40 : rnd(100, 200);
      } else {
        S.nextStray = 30;
      }
    }
  }
  S.animals.slice().forEach(a => updateAnimal(a, dt));

  /* 粒子 */
  const tips = incenseTips();
  if (tips.length && !calm) {
    G.smokeT = (G.smokeT || 0) + dt;
    while (G.smokeT > 0.09) {
      G.smokeT -= 0.09;
      const tp = pick(tips);
      G.smoke.push({ x: tp[0], y: tp[1], vx: rnd(-3, 3), vy: rnd(-18, -12), life: 1, r: 2, ph: rnd(0, 6) });
    }
  }
  G.smoke.forEach(p => {
    p.life -= dt / 4.5;
    p.y += p.vy * dt;
    p.x += (p.vx + Math.sin(G.clock * 1.3 + p.ph) * 6 + G.rainAmt * -4) * dt;
    p.r += dt * 4;
  });
  G.smoke = G.smoke.filter(p => p.life > 0);

  const season = seasonNow();
  const fallRate = season === 'autumn' ? 0.6 : season === 'spring' ? 0.3 : season === 'summer' ? 0.04 : 0;
  if (!calm && G.scene === 'yard' && G.leaves.length < 7 && Math.random() < dt * fallRate) {
    G.leaves.push({ x: rnd(-20, 130), y: rnd(70, 180), vx: rnd(8, 22), vy: rnd(16, 26), rot: rnd(0, 6), vr: rnd(-2, 2), ph: rnd(0, 6), land: rnd(Y0 + 10, PANEL_TOP - 8), kind: season });
  }
  G.leaves.forEach(l => {
    l.x += (l.vx + Math.sin(G.clock * 2 + l.ph) * 14) * dt;
    l.y += l.vy * dt;
    l.rot += l.vr * dt;
  });
  G.leaves = G.leaves.filter(l => l.y < l.land && l.x < VW + 20);

  if (G.rainAmt > 0.02) {
    const snow = seasonNow() === 'winter';
    const want = Math.round((snow ? 110 : 140) * G.rainAmt);
    while (G.drops.length < want) G.drops.push({ x: rnd(-20, VW + 20), y: rnd(-20, PANEL_TOP), v: snow ? rnd(30, 70) : rnd(520, 700), r: rnd(1, 2.6), ph: rnd(0, 6) });
    if (G.drops.length > want) G.drops.length = want;
    G.drops.forEach(d => {
      if (snow) {
        if (d.v > 100) d.v = rnd(30, 70);
        d.y += d.v * dt;
        d.x += (Math.sin(G.clock * 1.5 + d.ph) * 14 - 6) * dt;
      } else {
        if (d.v < 100) d.v = rnd(520, 700);
        d.y += d.v * dt;
        d.x -= d.v * 0.12 * dt;
      }
      if (d.y > PANEL_TOP) {
        if (!snow && G.splashes.length < 40) G.splashes.push({ x: d.x, y: rnd(Y0 + 6, PANEL_TOP - 4), life: 0.4 });
        d.y = rnd(-40, 0);
        d.x = rnd(0, VW + 40);
      }
    });
  } else {
    G.drops.length = 0;
  }
  G.splashes.forEach(s => { s.life -= dt; });
  G.splashes = G.splashes.filter(s => s.life > 0);

  G.floats.forEach(f => { f.life -= dt; f.y -= 38 * dt; });
  G.floats = G.floats.filter(f => f.life > 0);
  G.hearts.forEach(h => { h.life -= dt; h.y += h.vy * dt; });
  G.hearts = G.hearts.filter(h => h.life > 0);
  G.ripples.forEach(r => { r.life -= dt; r.r += 70 * dt; });
  G.ripples = G.ripples.filter(r => r.life > 0);

  if (G.toast) {
    G.toast.t -= dt;
    if (G.toast.t <= 0) G.toast = null;
  }

  G.saveT += dt;
  if (G.saveT > 5) {
    G.saveT = 0;
    writeSave();
  }
}

/* 离开期间：小沙弥照常敲木鱼，小动物会饿，包扎过的伤会长好。 */
function catchUp() {
  const sec = clamp((Date.now() - S.last) / 1000, 0, 8 * 3600);
  if (sec < 60 || !S.seenIntro) return;
  const earned = Math.floor(S.monk * S.fishLv / 2.5 * sec);
  gain(earned);
  S.knocks += Math.floor(S.monk / 2.5 * sec);
  S.animals.forEach(a => {
    a.hunger = Math.max(5, a.hunger - sec / 60);
    if (a.injured && a.treated) {
      a.health = Math.min(100, a.health + sec / 3);
      if (a.health >= 100) {
        a.injured = '';
        a.treated = false;
      }
    } else if (a.injured) {
      a.health = Math.max(25, a.health - sec / 30);
    }
    if (a.state === 'leave') a.leaving = true;
  });
  S.animals = S.animals.filter(a => !a.leaving);
  S.nextStray = Math.max(5, S.nextStray - sec);
  const hours = sec >= 3600 ? Math.floor(sec / 3600) + ' 小时' : Math.floor(sec / 60) + ' 分钟';
  let msg = '你离开了 ' + hours;
  if (earned > 0) msg += '，小沙弥替你攒了 ' + fmt(earned) + ' 功德';
  if (S.animals.some(a => a.hunger < 40)) msg += '。小动物们饿了';
  toast(msg, 'info', 5);
}

/* ---------- 绘制：基础 ---------- */
function text(str, x, y, size, color, align, weight, font) {
  ctx.font = (weight || 500) + ' ' + size + 'px ' + (font || SANS);
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || INK;
  ctx.fillText(str, x, y);
}

function wrap(str, maxW, size, font) {
  ctx.font = '500 ' + size + 'px ' + (font || SANS);
  const lines = [];
  let cur = '';
  for (const ch of str) {
    if (ctx.measureText(cur + ch).width > maxW && cur) {
      lines.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(x, y, rx, ry, rot) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(rx, 0.1), Math.max(ry, 0.1), rot || 0, 0, TAU);
}

function fillEllipse(x, y, rx, ry, color, rot) {
  ellipse(x, y, rx, ry, rot);
  ctx.fillStyle = color;
  ctx.fill();
}

function glow(x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

const BUTTON_FILL = { red: '#8e2b1f', dark: '#3e2219', ink: 'rgba(43,33,26,.07)', ad: '#2d7468', off: 'rgba(43,33,26,.14)', gold: '#c9a24a' };

function button(label, x, y, w, h, onTap, style, sub) {
  const s = style || 'red';
  G.buttons.push({ x, y, w, h, onTap });
  roundRect(x, y, w, h, 7);
  ctx.fillStyle = BUTTON_FILL[s];
  ctx.fill();
  if (s === 'red' || s === 'dark') {
    ctx.strokeStyle = s === 'red' ? GOLD : 'rgba(217,178,92,.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else if (s === 'ink') {
    ctx.strokeStyle = 'rgba(43,33,26,.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const color = s === 'ink' || s === 'gold' ? INK : s === 'off' ? '#8a7a68' : s === 'dark' ? '#a8927a' : '#f8ecd0';
  if (sub) {
    text(label, x + w / 2, y + h / 2 - 8, 16, color, 'center', 700, SERIF);
    text(sub, x + w / 2, y + h / 2 + 11, w < 64 ? 9.5 : 10.5, color, 'center', 500);
  } else {
    text(label, x + w / 2, y + h / 2 + 1, 16, color, 'center', 700, SERIF);
  }
}

/* ---------- 绘制：天空、山、大殿 ---------- */
function drawSky(sk) {
  const g = ctx.createLinearGradient(0, 0, 0, Y0);
  g.addColorStop(0, sk.top);
  g.addColorStop(1, sk.bot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VW, Y0 + 2);
  if (sk.warm > 0.02) {
    const hg = ctx.createLinearGradient(0, Y0 - 170, 0, Y0);
    hg.addColorStop(0, 'rgba(255,140,90,0)');
    hg.addColorStop(1, 'rgba(255,150,90,' + sk.warm * 0.55 + ')');
    ctx.fillStyle = hg;
    ctx.fillRect(0, Y0 - 170, VW, 172);
  }

  const h = hourNow();
  const starA = clamp((0.5 - sk.light) * 2.4, 0, 1) * (1 - G.rainAmt);
  if (starA > 0.02) {
    scenery.stars.forEach(s => {
      ctx.globalAlpha = starA * (0.55 + 0.45 * Math.sin(G.clock * 1.6 + s.ph));
      ctx.fillStyle = '#fdf7e3';
      ctx.fillRect(s.x, s.y, s.r, s.r);
    });
    ctx.globalAlpha = 1;
  }

  const clear = 1 - G.rainAmt * 0.85;
  if (h >= 5.8 && h <= 18.6) {
    const t = (h - 5.8) / 12.8;
    const x = lerp(30, 370, t);
    const y = 170 - Math.sin(Math.PI * t) * 120;
    ctx.globalAlpha = clear;
    glow(x, y, 70 + sk.warm * 90, sk.warm > 0.1 ? 'rgba(255,165,95,' + (0.35 + sk.warm * 0.35) + ')' : 'rgba(255,236,190,.45)');
    fillEllipse(x, y, 13 + sk.warm * 4, 13 + sk.warm * 4, sk.warm > 0.3 ? '#ffb877' : h < 7.5 || h > 17 ? '#ffd6a0' : '#fff6dc');
    if (sk.warm > 0.3 && !calm) sunRays(x, y, sk.warm);
    ctx.globalAlpha = 1;
  } else {
    const hh = h < 12 ? h + 24 : h;
    const t = (hh - 18.6) / 11.2;
    const x = lerp(360, 40, t);
    const y = 160 - Math.sin(Math.PI * t) * 110;
    ctx.globalAlpha = clear;
    glow(x, y, 50, 'rgba(220,230,255,.25)');
    fillEllipse(x, y, 11, 11, '#f3eed8');
    fillEllipse(x - 3, y - 2, 2.4, 2, 'rgba(160,160,150,.35)');
    fillEllipse(x + 3.5, y + 3, 1.8, 1.6, 'rgba(160,160,150,.3)');
    ctx.globalAlpha = 1;
  }

  drawClouds(sk);
  scenery.mountains.forEach((pts, i) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], Y0 + 2);
    pts.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(pts[pts.length - 1][0], Y0 + 2);
    ctx.closePath();
    ctx.fillStyle = sk.m[i];
    ctx.fill();
    const base = [150, 196, 236][i];
    const mist = ctx.createLinearGradient(0, base - 30, 0, base + 30);
    mist.addColorStop(0, 'rgba(255,255,255,0)');
    mist.addColorStop(1, 'rgba(235,240,245,' + (0.1 + 0.08 * sk.light + G.rainAmt * 0.12) + ')');
    ctx.fillStyle = mist;
    ctx.fillRect(0, base - 30, VW, 60);
  });
}

function drawWalls() {
  [[0, 66], [334, 66]].forEach(([x, w]) => {
    ctx.fillStyle = '#9a4033';
    ctx.fillRect(x, 214, w, BY - 214 + 2);
    ctx.fillStyle = 'rgba(0,0,0,.12)';
    ctx.fillRect(x, BY - 8, w, 10);
    ctx.fillStyle = '#3b3f46';
    ctx.fillRect(x - 2, 206, w + 4, 9);
    ctx.fillStyle = '#2b2e34';
    for (let i = x; i < x + w; i += 6) ctx.fillRect(i, 214, 4, 3);
    if (G.snow > 0.01) {
      ctx.fillStyle = 'rgba(245,248,252,' + G.snow * 0.9 + ')';
      ctx.fillRect(x - 2, 202, w + 4, 5);
    }
  });
}

function drawHall(sk) {
  const cx = VW / 2;
  /* 台基和台阶 */
  ctx.fillStyle = '#8e857a';
  ctx.fillRect(56, BY - 16, 288, 20);
  ctx.fillStyle = '#a69d90';
  ctx.fillRect(56, BY - 17, 288, 3);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i % 2 ? '#9b9285' : '#b0a799';
    ctx.fillRect(cx - 36 - i * 4, BY - 12 + i * 5, 72 + i * 8, 5);
  }

  /* 墙和柱 */
  ctx.fillStyle = '#7d2a20';
  ctx.fillRect(74, BY - 84, 252, 68);
  const bays = [[101, 152], [248, 299]];
  bays.forEach(([a, b]) => {
    ctx.fillStyle = '#6b3520';
    ctx.fillRect(a, BY - 80, b - a, 64);
    ctx.strokeStyle = 'rgba(214,160,90,.55)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let x = a + 4; x < b; x += 6) { ctx.moveTo(x, BY - 78); ctx.lineTo(x, BY - 46); }
    for (let y = BY - 78; y < BY - 46; y += 6) { ctx.moveTo(a + 2, y); ctx.lineTo(b - 2, y); }
    ctx.moveTo((a + b) / 2, BY - 80);
    ctx.lineTo((a + b) / 2, BY - 16);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(a + 3, BY - 42, b - a - 6, 22);
  });

  /* 正门里面：佛像和烛光 */
  const dg = ctx.createLinearGradient(0, BY - 82, 0, BY - 16);
  dg.addColorStop(0, '#120a06');
  dg.addColorStop(1, '#3a2312');
  ctx.fillStyle = dg;
  ctx.fillRect(161, BY - 82, 78, 66);
  drawBuddha(cx, BY - 18);

  [92, 152, 239, 299].forEach(x => {
    ctx.fillStyle = '#a2271d';
    ctx.fillRect(x, BY - 86, 10, 70);
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.fillRect(x + 1.5, BY - 86, 2.5, 70);
    ctx.fillStyle = '#8b8277';
    ctx.fillRect(x - 2, BY - 20, 14, 4);
  });

  /* 彩画额枋和斗拱 */
  ctx.fillStyle = '#2f5d62';
  ctx.fillRect(68, BY - 96, 264, 11);
  for (let x = 72; x < 328; x += 16) {
    ctx.fillStyle = '#4f8f84';
    ctx.fillRect(x, BY - 94, 10, 7);
    ctx.fillStyle = '#c9a24a';
    ctx.fillRect(x + 11, BY - 92, 3, 3);
  }
  ctx.fillStyle = '#21423f';
  ctx.fillRect(64, BY - 104, 272, 8);
  for (let x = 68; x < 334; x += 10) {
    ctx.fillStyle = x % 20 < 10 ? '#3d7a6e' : '#b8863a';
    ctx.fillRect(x, BY - 103, 6, 6);
  }

  /* 屋顶：歇山顶，檐角起翘 */
  const ry = BY - 104;
  ctx.beginPath();
  ctx.moveTo(22, ry - 18);
  ctx.quadraticCurveTo(60, ry + 2, 110, ry);
  ctx.lineTo(290, ry);
  ctx.quadraticCurveTo(340, ry + 2, 378, ry - 18);
  ctx.quadraticCurveTo(335, ry - 24, 286, ry - 58);
  ctx.lineTo(114, ry - 58);
  ctx.quadraticCurveTo(65, ry - 24, 22, ry - 18);
  ctx.closePath();
  const rg = ctx.createLinearGradient(0, ry - 58, 0, ry);
  rg.addColorStop(0, '#4b515b');
  rg.addColorStop(1, '#2b2f36');
  ctx.fillStyle = rg;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 44; i++) {
    const t = i / 44;
    const top = lerp(110, 290, t);
    const bot = lerp(14, 386, t);
    ctx.moveTo(top, ry - 60);
    ctx.lineTo(bot, ry + 4);
  }
  ctx.stroke();
  if (G.snow > 0.01) {
    const sg = ctx.createLinearGradient(0, ry - 60, 0, ry);
    sg.addColorStop(0, 'rgba(245,248,252,' + G.snow * 0.85 + ')');
    sg.addColorStop(1, 'rgba(245,248,252,' + G.snow * 0.4 + ')');
    ctx.fillStyle = sg;
    ctx.fillRect(0, ry - 70, VW, 80);
  }
  ctx.restore();
  ctx.strokeStyle = '#1f2227';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(22, ry - 18);
  ctx.quadraticCurveTo(60, ry + 2, 110, ry);
  ctx.lineTo(290, ry);
  ctx.quadraticCurveTo(340, ry + 2, 378, ry - 18);
  ctx.stroke();
  ctx.fillStyle = '#5b616b';
  for (let x = 40; x < 362; x += 7) {
    const y = x < 110 ? lerp(ry - 10, ry, (x - 40) / 70) : x > 290 ? lerp(ry, ry - 10, (x - 290) / 72) : ry;
    fillEllipse(x, y + 1, 2, 2, '#5b616b');
  }
  /* 正脊和鸱吻 */
  ctx.fillStyle = '#2a2d33';
  ctx.fillRect(108, ry - 66, 184, 9);
  ctx.fillStyle = '#3a3e45';
  ctx.fillRect(108, ry - 66, 184, 2);
  [[108, -1], [292, 1]].forEach(([x, s]) => {
    ctx.beginPath();
    ctx.moveTo(x, ry - 57);
    ctx.quadraticCurveTo(x + s * 2, ry - 80, x - s * 10, ry - 82);
    ctx.quadraticCurveTo(x - s * 4, ry - 74, x - s * 8, ry - 66);
    ctx.closePath();
    ctx.fillStyle = '#2a2d33';
    ctx.fill();
  });
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(cx - 3, ry - 76, 6, 10);
  fillEllipse(cx, ry - 78, 4, 4, '#c9a24a');

  /* 匾额 */
  ctx.fillStyle = '#1b2a48';
  ctx.fillRect(cx - 32, BY - 112, 64, 18);
  ctx.strokeStyle = '#d4af5a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - 30, BY - 110, 60, 14);
  text('大雄宝殿', cx, BY - 103, 10.5, '#e8c56a', 'center', 700, SERIF);

  /* 灯笼 */
  const night = 1 - sk.light;
  [120, 280].forEach(x => {
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, BY - 96);
    ctx.lineTo(x, BY - 86);
    ctx.stroke();
    fillEllipse(x, BY - 76, 8, 10, night > 0.3 ? '#ff6a3a' : '#c3352a');
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x - 4, BY - 87, 8, 2);
    ctx.fillRect(x - 4, BY - 66, 8, 2);
    ctx.fillStyle = '#e0b24a';
    ctx.fillRect(x - 0.5, BY - 64, 1, 7);
  });
}

function drawBuddha(x, base) {
  glow(x, base - 36, 30, 'rgba(255,200,110,.5)');
  fillEllipse(x, base - 4, 22, 5, '#9a6f2c');
  for (let i = -2; i <= 2; i++) fillEllipse(x + i * 8, base - 6, 5, 3.5, '#c99a44');
  const g = ctx.createLinearGradient(x - 16, 0, x + 16, 0);
  g.addColorStop(0, '#9c7128');
  g.addColorStop(0.45, '#f0cf73');
  g.addColorStop(1, '#a47a2e');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 18, base - 8);
  ctx.quadraticCurveTo(x - 19, base - 22, x - 11, base - 30);
  ctx.quadraticCurveTo(x, base - 36, x + 11, base - 30);
  ctx.quadraticCurveTo(x + 19, base - 22, x + 18, base - 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - 3, base - 37, 6, 5);
  fillEllipse(x, base - 41, 6.5, 7.5, '#e6c266');
  fillEllipse(x, base - 48.5, 3.4, 2.8, '#6b4c22');
  ctx.strokeStyle = 'rgba(90,60,20,.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - 8, base - 14);
  ctx.quadraticCurveTo(x, base - 10, x + 8, base - 14);
  ctx.stroke();
  [-26, 26].forEach(dx => {
    ctx.fillStyle = '#e8e0cf';
    ctx.fillRect(x + dx - 2, base - 14, 4, 10);
    const f = 1 + Math.sin(G.clock * 9 + dx) * 0.15;
    fillEllipse(x + dx, base - 17, 2 * f, 3.6 * f, '#ffcf6a');
  });
}

/* ---------- 绘制：庭院 ---------- */
function drawFloor() {
  const top = Y0 - 6;
  const g = ctx.createLinearGradient(0, top, 0, PANEL_TOP);
  g.addColorStop(0, '#8b8378');
  g.addColorStop(1, '#a9a193');
  ctx.fillStyle = g;
  ctx.fillRect(0, top, VW, PANEL_TOP - top);
  const wet = Math.max(G.wet, seasonNow() === 'winter' ? 0 : G.rainAmt * 0.5);
  if (wet > 0) {
    ctx.fillStyle = 'rgba(40,50,60,' + wet * 0.2 + ')';
    ctx.fillRect(0, top, VW, PANEL_TOP - top);
  }

  const a = yard(-0.2, 0);
  const b = yard(0.2, 0);
  const c = yard(0.2, 1.4);
  const d = yard(-0.2, 1.4);
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.lineTo(d[0], d[1]);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,248,232,.1)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(50,42,34,.2)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let z = Z_FAR; z > 0.5; z -= 0.12) {
    const y = YH + K / z;
    if (y > PANEL_TOP) break;
    ctx.moveTo(0, y);
    ctx.lineTo(VW, y);
  }
  for (let wx = -3; wx <= 3.001; wx += 0.25) {
    const p = yard(wx, 0);
    const q = yard(wx, 1.4);
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
  }
  ctx.stroke();

  const season = seasonNow();
  scenery.floorLeaves.forEach((l, i) => {
    let c = null;
    if (season === 'autumn') c = SEASON_LEAVES.autumn[l.ci];
    else if (season === 'winter' && i < 8) c = '#8a6a3a';
    else if (season === 'spring' && i < 8) c = '#f3c3cf';
    if (!c) return;
    const p = yard(l.wx, l.d);
    if (p[1] > PANEL_TOP) return;
    drawLeaf(p[0], p[1], 4.2 * p[2] + 1.5, l.rot, c, 0.9);
  });
  if (G.wet > 0.03) {
    scenery.puddles.forEach(q => {
      const p = yard(q.wx, q.d);
      fillEllipse(p[0], p[1], 30 * q.r * p[2], 7 * q.r * p[2], 'rgba(150,170,195,' + G.wet * 0.35 + ')');
      ctx.strokeStyle = 'rgba(230,238,248,' + G.wet * 0.35 + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p[0] - 14 * q.r * p[2], p[1] - 1);
      ctx.lineTo(p[0] + 4 * q.r * p[2], p[1] - 2);
      ctx.stroke();
    });
  }
  if (G.snow > 0.01) {
    ctx.fillStyle = 'rgba(240,244,250,' + G.snow * 0.6 + ')';
    ctx.fillRect(0, Y0 - 6, VW, PANEL_TOP - Y0 + 6);
    scenery.puddles.forEach(q => {
      const p = yard(q.wx, q.d);
      fillEllipse(p[0], p[1], 40 * q.r * p[2], 9 * q.r * p[2], 'rgba(255,255,255,' + G.snow * 0.5 + ')');
    });
  }

  G.splashes.forEach(s => {
    ctx.strokeStyle = 'rgba(220,230,240,' + s.life * 1.2 + ')';
    ctx.lineWidth = 0.8;
    ellipse(s.x, s.y, (0.4 - s.life) * 18 + 1, (0.4 - s.life) * 5 + 0.5);
    ctx.stroke();
  });
}

function drawLeaf(x, y, r, rot, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,80,20,.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, r * 0.5);
  ctx.stroke();
  ctx.restore();
}

/* 银杏：春天嫩绿、夏天浓绿、秋天金黄、冬天只剩枝条。早晚被霞光染暖。 */
function drawTree() {
  const season = seasonNow();
  const pal = SEASON_LEAVES[season];
  const sk = G.sky || { warm: 0 };
  const p = yard(-1.2, 0.2);
  const tx = p[0];
  const ty = p[1];
  fillEllipse(tx + 4, ty, 22, 5, 'rgba(0,0,0,.2)');
  ctx.fillStyle = '#4a3526';
  ctx.beginPath();
  ctx.moveTo(tx - 10, ty);
  ctx.quadraticCurveTo(tx - 6, ty - 60, tx - 5, ty - 130);
  ctx.lineTo(tx + 5, ty - 130);
  ctx.quadraticCurveTo(tx + 6, ty - 60, tx + 10, ty);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.fillRect(tx - 3, ty - 120, 3, 118);
  ctx.lineCap = 'round';

  if (!pal.length) {
    ctx.strokeStyle = '#4a3526';
    scenery.twigs.forEach(([x1, y1, x2, y2, w]) => {
      ctx.lineWidth = Math.max(0.6, w);
      ctx.beginPath();
      ctx.moveTo(tx + x1, ty + y1);
      ctx.lineTo(tx + x2, ty + y2);
      ctx.stroke();
    });
    if (G.snow > 0.05) {
      ctx.strokeStyle = 'rgba(245,248,252,' + G.snow * 0.9 + ')';
      scenery.twigs.forEach(([x1, y1, x2, y2, w]) => {
        if (w < 1) return;
        ctx.lineWidth = Math.max(1, w * 0.5);
        ctx.beginPath();
        ctx.moveTo(tx + x1, ty + y1 - w * 0.5);
        ctx.lineTo(tx + x2, ty + y2 - w * 0.5);
        ctx.stroke();
      });
    }
    return;
  }

  ctx.strokeStyle = '#4a3526';
  [[-4, -100, -48, -150, 6], [2, -112, 44, -160, 5], [0, -126, -10, -176, 4]].forEach(([x1, y1, x2, y2, w]) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(tx + x1, ty + y1);
    ctx.lineTo(tx + x2, ty + y2);
    ctx.stroke();
  });
  const cx = tx - 26;
  const cy = ty - 150;
  const sparse = season === 'spring';
  const lit = sk.warm > 0.1 ? 'rgba(255,190,120,' + (0.25 + sk.warm * 0.35) + ')' : 'rgba(255,240,170,.25)';
  scenery.blobs.forEach((b, i) => {
    if (sparse && i % 3 === 0) return;
    const sway = calm ? 0 : Math.sin(G.clock * 0.8 + b.ph) * 1.4;
    fillEllipse(cx + b.x + sway + 3, cy + b.y + 4, b.r, b.r * 0.85, season === 'autumn' ? 'rgba(150,100,20,.35)' : 'rgba(30,60,20,.3)');
  });
  scenery.blobs.forEach((b, i) => {
    if (sparse && i % 3 === 0) return;
    const sway = calm ? 0 : Math.sin(G.clock * 0.8 + b.ph) * 1.4;
    const r = sparse ? b.r * 0.85 : b.r;
    fillEllipse(cx + b.x + sway, cy + b.y, r, r * 0.85, pal[b.ci]);
    fillEllipse(cx + b.x + sway - r * 0.3, cy + b.y - r * 0.3, r * 0.4, r * 0.3, lit);
  });
}

function drawBurner() {
  const [x, y, s] = burnerPos();
  const k = s * 1.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  fillEllipse(0, 0, 46, 8, 'rgba(0,0,0,.22)');
  ctx.fillStyle = '#7d756a';
  ctx.fillRect(-32, -14, 64, 14);
  ctx.fillStyle = '#958c80';
  ctx.fillRect(-32, -14, 64, 3);
  ctx.fillStyle = '#3e3220';
  ctx.fillRect(-25, -27, 6, 14);
  ctx.fillRect(-3, -25, 6, 12);
  ctx.fillRect(19, -27, 6, 14);
  const g = ctx.createLinearGradient(-34, 0, 34, 0);
  g.addColorStop(0, '#3f321d');
  g.addColorStop(0.4, '#8c7547');
  g.addColorStop(1, '#3a2e1b');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-34, -58);
  ctx.bezierCurveTo(-34, -36, -28, -25, 0, -25);
  ctx.bezierCurveTo(28, -25, 34, -36, 34, -58);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(230,200,130,.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-32, -48);
  ctx.quadraticCurveTo(0, -42, 32, -48);
  ctx.stroke();
  for (let i = -3; i <= 3; i++) fillEllipse(i * 8, -40, 1.6, 1.6, 'rgba(230,200,130,.4)');
  ctx.strokeStyle = '#4a3b22';
  ctx.lineWidth = 4;
  [-27, 27].forEach(ex => {
    ctx.beginPath();
    ctx.moveTo(ex - 5, -58);
    ctx.lineTo(ex - 5, -70);
    ctx.lineTo(ex + 5, -70);
    ctx.lineTo(ex + 5, -58);
    ctx.stroke();
  });
  fillEllipse(0, -58, 36, 6, '#5d4a2a');
  fillEllipse(0, -58, 31, 4.4, '#bdb5a6');

  const left = incenseLeft();
  if (left > 0) {
    const rise = Math.min(1, G.incenseAnim);
    const len = (6 + 26 * left / INCENSE_SEC) * rise;
    [-7, 0, 7].forEach((ox, i) => {
      const lean = (i - 1) * 2;
      ctx.strokeStyle = '#a3462e';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(ox, -58);
      ctx.lineTo(ox + lean, -60 - len);
      ctx.stroke();
      fillEllipse(ox + lean, -60 - len, 1.6, 1.6, '#ff9a4a');
    });
  }
  ctx.restore();
}

function drawBell() {
  const [bx, by, s] = bellPos();
  const k = s * 2;
  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(k, k);
  fillEllipse(0, 0, 64, 8, 'rgba(0,0,0,.2)');
  ctx.fillStyle = '#8e857a';
  ctx.fillRect(-66, -6, 132, 8);
  [-56, 56].forEach(x => {
    ctx.fillStyle = '#8a2a1f';
    ctx.fillRect(x - 4, -112, 8, 108);
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.fillRect(x - 3, -112, 2, 108);
  });
  ctx.fillStyle = '#3d2a1c';
  ctx.fillRect(-60, -110, 120, 7);
  ctx.beginPath();
  ctx.moveTo(-78, -122);
  ctx.quadraticCurveTo(-60, -112, -40, -114);
  ctx.lineTo(40, -114);
  ctx.quadraticCurveTo(60, -112, 78, -122);
  ctx.quadraticCurveTo(50, -130, 30, -150);
  ctx.lineTo(-30, -150);
  ctx.quadraticCurveTo(-50, -130, -78, -122);
  ctx.closePath();
  ctx.fillStyle = '#353940';
  ctx.fill();
  ctx.fillStyle = '#25282d';
  ctx.fillRect(-32, -154, 64, 5);

  const t = G.bellAge;
  const sway = t < 6 ? 0.05 * Math.exp(-t * 1.2) * Math.sin(t * 6) : 0;
  ctx.save();
  ctx.translate(0, -103);
  ctx.rotate(sway);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 6);
  ctx.stroke();
  const bg = ctx.createLinearGradient(-22, 0, 22, 0);
  bg.addColorStop(0, '#2e3a30');
  bg.addColorStop(0.45, '#7c8c66');
  bg.addColorStop(1, '#2c362c');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.moveTo(-14, 8);
  ctx.quadraticCurveTo(0, 0, 14, 8);
  ctx.bezierCurveTo(16, 30, 18, 46, 22, 56);
  ctx.lineTo(-22, 56);
  ctx.bezierCurveTo(-18, 46, -16, 30, -14, 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(200,210,170,.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-15, 20); ctx.lineTo(15, 20);
  ctx.moveTo(-17, 40); ctx.lineTo(17, 40);
  ctx.moveTo(-19, 48); ctx.lineTo(19, 48);
  ctx.moveTo(0, 20); ctx.lineTo(0, 40);
  ctx.stroke();
  for (let r = 0; r < 2; r++) for (let c = -2; c <= 2; c++) fillEllipse(c * 4.5 + (c > 0 ? 2 : c < 0 ? -2 : 0), 25 + r * 6, 1.1, 1.1, 'rgba(210,220,180,.45)');
  ctx.restore();

  let dx = 0;
  if (t < 0.12) dx = -10 * Math.sin(t / 0.12 * Math.PI / 2);
  else if (t < 5) dx = -10 * Math.exp(-(t - 0.12) * 2.5) * Math.cos((t - 0.12) * 7);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, -103); ctx.lineTo(32 + dx, -72);
  ctx.moveTo(48, -103); ctx.lineTo(48 + dx, -72);
  ctx.stroke();
  ctx.fillStyle = '#6b4a2e';
  roundRect(23 + dx, -75, 34, 7, 3.5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.fillRect(25 + dx, -74, 30, 2);
  ctx.restore();
}

function drawHouse() {
  const p = yard(-0.72, 0.72);
  const k = p[2] * 1.25;
  ctx.save();
  ctx.translate(p[0], p[1]);
  ctx.scale(k, k);
  fillEllipse(2, 0, 34, 6, 'rgba(0,0,0,.22)');
  ctx.fillStyle = '#8c5c35';
  ctx.fillRect(-28, -30, 56, 30);
  ctx.strokeStyle = 'rgba(60,35,15,.45)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let y = -24; y < 0; y += 6) { ctx.moveTo(-28, y); ctx.lineTo(28, y); }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-33, -28);
  ctx.lineTo(0, -48);
  ctx.lineTo(33, -28);
  ctx.closePath();
  ctx.fillStyle = '#5a3a22';
  ctx.fill();
  ctx.fillStyle = '#2a1a10';
  ctx.beginPath();
  ctx.arc(0, -10, 10, Math.PI, 0);
  ctx.lineTo(10, 0);
  ctx.lineTo(-10, 0);
  ctx.closePath();
  ctx.fill();
  fillEllipse(0, -2, 8, 2.5, '#c96f5a');
  fillEllipse(40, -2, 9, 3, '#6b7f8c');
  fillEllipse(40, -3, 7, 2, '#a9c8d8');
  ctx.restore();
}

/* ---------- 绘制：小动物 ---------- */
function catHead(k, hx, hy, a, down) {
  const kind = KINDS[a.kind];
  const B = kind.body;
  ctx.fillStyle = B;
  ctx.beginPath();
  ctx.moveTo(hx - 6, hy - 4);
  ctx.lineTo(hx - 4.5, hy - 13);
  ctx.lineTo(hx + 0.5, hy - 6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + 1, hy - 6.5);
  ctx.lineTo(hx + 5.5, hy - 13);
  ctx.lineTo(hx + 7.5, hy - 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e9a3a3';
  ctx.beginPath();
  ctx.moveTo(hx + 2.5, hy - 7);
  ctx.lineTo(hx + 5.2, hy - 11);
  ctx.lineTo(hx + 6.2, hy - 5);
  ctx.closePath();
  ctx.fill();
  fillEllipse(hx, hy, 8, 7.2, B);
  if (kind.stripe) {
    ctx.strokeStyle = kind.dark;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(hx - 2, hy - 6.8); ctx.lineTo(hx - 1, hy - 3.5);
    ctx.moveTo(hx + 1, hy - 7); ctx.lineTo(hx + 1.3, hy - 3.8);
    ctx.stroke();
  }
  if (kind.patch) fillEllipse(hx - 3, hy - 3, 3.5, 3, '#9a9288');
  fillEllipse(hx + 4.5, hy + 2.6, 3.8, 2.8, kind.belly);
  fillEllipse(hx + 7.6, hy + 1.2, 1.2, 1, '#d77a8a');
  const closed = a.state === 'sleep' || a.blink < 0 || down;
  if (closed) {
    ctx.strokeStyle = '#1a1410';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(hx + 2, hy - 1.5);
    ctx.quadraticCurveTo(hx + 3.5, hy - 0.5, hx + 5, hy - 1.5);
    ctx.stroke();
  } else {
    fillEllipse(hx + 3.6, hy - 1.6, 1.7, 1.9, kind.eye);
    fillEllipse(hx + 3.9, hy - 1.6, 0.6, 1.5, '#111');
    if (a.injured && !a.treated && a.injured.includes('眼睛')) fillEllipse(hx + 3.6, hy - 1.6, 2.2, 1.2, 'rgba(200,80,80,.55)');
  }
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(hx + 6, hy + 3); ctx.lineTo(hx + 12, hy + 2);
  ctx.moveTo(hx + 6, hy + 3.6); ctx.lineTo(hx + 12, hy + 4.5);
  ctx.stroke();
}

function legs(list, color, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  list.forEach(([x1, y1, x2, y2]) => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); });
  ctx.stroke();
}

function drawCat(a) {
  const kind = KINDS[a.kind];
  const B = kind.body;
  const D = kind.dark;
  const st = a.state;
  const walking = st === 'walk' || st === 'arrive' || st === 'flee' || st === 'leave';
  const sw = walking ? Math.sin(a.phase) : 0;
  const limp = a.injured && !a.treated && walking ? Math.abs(Math.sin(a.phase)) * 2 : 0;
  const tailSway = calm ? 0 : Math.sin(G.clock * 2 + a.id) * 3;

  if (st === 'sleep' || st === 'lie') {
    const sleep = st === 'sleep';
    ctx.strokeStyle = B;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, -4);
    ctx.quadraticCurveTo(-20, 2, sleep ? 4 : -26, sleep ? 1 : -2);
    ctx.stroke();
    const breathe = Math.sin(G.clock * 2.2 + a.id) * 0.6;
    fillEllipse(0, -7, 16, 7.5 + breathe, B);
    if (kind.stripe) {
      ctx.strokeStyle = D;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let x = -9; x <= 6; x += 5) { ctx.moveTo(x, -14); ctx.quadraticCurveTo(x + 2, -10, x, -6); }
      ctx.stroke();
    }
    if (kind.patch) fillEllipse(-4, -10, 6, 4, '#a39b90');
    catHead(1, sleep ? 11 : 14, sleep ? -8 : -13, a, sleep);
    if (!sleep) legs([[12, -2, 20, -1]], B, 3.4);
    return;
  }

  if (st === 'sit' || st === 'groom') {
    ctx.strokeStyle = B;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, -2);
    ctx.quadraticCurveTo(-20, -1, -18 + tailSway * 0.3, -8);
    ctx.stroke();
    fillEllipse(-2, -12, 10, 12.5, B, -0.12);
    fillEllipse(2, -10, 5, 8, kind.belly);
    if (kind.stripe) {
      ctx.strokeStyle = D;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-9, -18); ctx.lineTo(-4, -16);
      ctx.moveTo(-10, -12); ctx.lineTo(-5, -10);
      ctx.moveTo(-10, -6); ctx.lineTo(-5, -5);
      ctx.stroke();
    }
    if (kind.patch) fillEllipse(-6, -14, 4, 5, '#a39b90');
    const groom = st === 'groom';
    legs([[3, -8, 3, 0], [7, -8, groom ? 9 : 7, groom ? -16 : 0]], B, 3.2);
    if (a.treated) legs([[3, -4, 3, -1.5]], '#ffffff', 3.4);
    catHead(1, groom ? 8 : 5, groom ? -21 : -27, a, groom);
    return;
  }

  /* 站立、走路、吃东西 */
  const eat = st === 'eat';
  ctx.strokeStyle = B;
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-17, -15);
  ctx.bezierCurveTo(-26, -16, -29, -26 + tailSway, -25, -34 + tailSway);
  ctx.stroke();
  legs([[-11, -12, -11 - sw * 3, 0], [11, -12, 11 + sw * 3, 0]], D, 3.6);
  fillEllipse(0, -15 + limp * 0.5, 18, 8.5, B);
  fillEllipse(2, -11 + limp * 0.5, 12, 3.8, kind.belly);
  if (kind.stripe) {
    ctx.strokeStyle = D;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = -11; x <= 7; x += 5) { ctx.moveTo(x, -23); ctx.quadraticCurveTo(x + 2, -18, x, -13); }
    ctx.stroke();
  }
  if (kind.patch) fillEllipse(-5, -18, 7, 4.5, '#a39b90');
  legs([[-8, -12, -8 + sw * 3, -limp], [14, -12, 14 - sw * 3, 0]], B, 3.8);
  if (a.treated) legs([[-8, -5, -8 + sw * 3, -2]], '#ffffff', 4);
  else if (a.injured && a.injured.includes('腿')) fillEllipse(-8 + sw * 3, -4, 1.6, 1.6, '#b8423a');
  catHead(1, eat ? 21 : 19, eat ? -11 : -23 + limp * 0.3, a, eat);
}

function drawDog(a) {
  const kind = KINDS[a.kind];
  const B = kind.body;
  const D = kind.dark;
  const st = a.state;
  const walking = st === 'walk' || st === 'arrive' || st === 'flee' || st === 'leave';
  const sw = walking ? Math.sin(a.phase) : 0;
  const limp = a.injured && !a.treated && walking ? Math.abs(Math.sin(a.phase)) * 2 : 0;
  const wagSpeed = (a.wag || 0) > 0 ? 18 : 6;
  const wag = calm ? 0 : Math.sin(G.clock * wagSpeed + a.id) * ((a.wag || 0) > 0 ? 0.45 : 0.18);
  a.wag = Math.max(0, (a.wag || 0) - 1 / 60);

  const head = (hx, hy, down) => {
    fillEllipse(hx, hy, 8.5, 7.8, B);
    fillEllipse(hx + 7, hy + 2.5, 5.5, 3.6, kind.tan ? kind.belly : B);
    fillEllipse(hx + 11.5, hy + 1.2, 1.8, 1.5, '#1a1612');
    ctx.fillStyle = D;
    ctx.beginPath();
    ctx.moveTo(hx - 4, hy - 6);
    ctx.quadraticCurveTo(hx - 1, hy - 12, hx + 2, hy - 6);
    ctx.lineTo(hx - 1, hy + 2);
    ctx.closePath();
    ctx.fill();
    if (kind.tan) fillEllipse(hx + 3.5, hy - 4.5, 1.3, 0.9, kind.belly);
    if (a.state === 'sleep' || a.blink < 0 || down) {
      ctx.strokeStyle = '#1a1410';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(hx + 2, hy - 1.5);
      ctx.lineTo(hx + 5, hy - 1.5);
      ctx.stroke();
    } else {
      fillEllipse(hx + 3.6, hy - 1.8, 1.4, 1.5, '#1a1410');
      fillEllipse(hx + 3.9, hy - 2.2, 0.4, 0.4, '#fff');
    }
    if ((a.wag || 0) > 0 || st === 'eat') {
      fillEllipse(hx + 8, hy + 6.5, 1.8, 2.5, '#d86a6a');
    }
  };

  const tail = (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(wag);
    ctx.strokeStyle = B;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -10, -1, -14);
    ctx.stroke();
    ctx.restore();
  };

  if (st === 'sleep' || st === 'lie') {
    const breathe = Math.sin(G.clock * 2 + a.id) * 0.6;
    tail(-16, -6);
    fillEllipse(0, -8, 19, 8 + breathe, B);
    fillEllipse(3, -4, 12, 3, kind.belly);
    legs([[12, -2, 24, -1]], B, 3.8);
    head(st === 'sleep' ? 14 : 18, st === 'sleep' ? -8 : -16, st === 'sleep');
    return;
  }
  if (st === 'sit') {
    tail(-10, -4);
    fillEllipse(-2, -15, 11, 15, B, -0.1);
    fillEllipse(3, -13, 5.5, 10, kind.belly);
    legs([[2, -10, 2, 0], [7, -10, 7, 0]], kind.tan ? kind.belly : B, 3.6);
    if (a.treated) legs([[2, -4, 2, -1]], '#ffffff', 3.8);
    head(6, -33, false);
    return;
  }
  const eat = st === 'eat';
  tail(-19, -22);
  legs([[-13, -14, -13 - sw * 3.5, 0], [13, -14, 13 + sw * 3.5, 0]], D, 4);
  fillEllipse(0, -19 + limp * 0.5, 20, 9.5, B);
  fillEllipse(3, -14 + limp * 0.5, 13, 3.5, kind.belly);
  const legC = kind.tan ? kind.belly : B;
  legs([[-9, -14, -9 + sw * 3.5, -limp], [16, -14, 16 - sw * 3.5, 0]], legC, 4.2);
  if (a.treated) legs([[-9, -6, -9 + sw * 3.5, -2]], '#ffffff', 4.4);
  head(eat ? 23 : 22, eat ? -12 : -28 + limp * 0.3, eat);
}

function drawBird(a) {
  const kind = KINDS[a.kind];
  const st = a.state;
  const hopping = (st === 'walk' || st === 'arrive' || st === 'flee' || st === 'leave') && a.hop < 0.2;
  const lift = hopping ? Math.sin(a.hop / 0.2 * Math.PI) * 6 : 0;
  const peck = st === 'peck' || st === 'eat' ? Math.max(0, Math.sin(G.clock * 9 + a.id)) : 0;
  const puff = st === 'sleep' ? 1.25 : 1;
  ctx.translate(0, -lift);
  legs([[-1, -2, -1.5, 0], [2, -2, 2.5, 0]], '#8a6a4a', 0.9);
  ctx.strokeStyle = kind.dark;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-12, -9);
  ctx.stroke();
  fillEllipse(0, -6.5, 7 * puff, 5.5 * puff, kind.body);
  fillEllipse(1.5, -4.5, 5 * puff, 3.2 * puff, kind.belly);
  fillEllipse(-1.5, -7.5, 5, 3.4, kind.dark, -0.2);
  ctx.strokeStyle = 'rgba(240,220,190,.6)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-4, -8); ctx.lineTo(1, -7);
  ctx.moveTo(-4, -6.5); ctx.lineTo(0, -5.8);
  ctx.stroke();
  if (a.treated) fillEllipse(-1.5, -7.5, 3.5, 1.3, '#ffffff', -0.2);
  const hx = 5 + peck * 1.5;
  const hy = -11 + peck * 6;
  if (st !== 'sleep') {
    fillEllipse(hx, hy, 4, 3.8, '#7a5a3a');
    fillEllipse(hx + 1, hy + 1.2, 2.6, 1.8, '#f0e8da');
    fillEllipse(hx + 0.5, hy + 3.4, 1.6, 1.2, '#1c1612');
    ctx.fillStyle = '#2c241e';
    ctx.beginPath();
    ctx.moveTo(hx + 3.4, hy - 0.8);
    ctx.lineTo(hx + 6.4, hy + 0.2);
    ctx.lineTo(hx + 3.4, hy + 1);
    ctx.closePath();
    ctx.fill();
    fillEllipse(hx + 1.6, hy - 0.6, 0.8, 0.8, '#111');
  }
}

const FOOD_COLOR = { catfood: '#8a5a32', dogfood: '#6e4a2a', millet: '#e8c95a', bun: '#f4efe2', milk: '#ffffff', water: '#a9c8d8' };

function drawAnimal(a) {
  const p = yard(a.wx, a.d);
  const type = KINDS[a.kind].type;
  const k = animalScale(a, p);
  const sel = G.modal && G.modal.id === a.id;
  ctx.save();
  ctx.translate(p[0], p[1]);
  ctx.scale(k, k);
  if (sel) {
    ctx.strokeStyle = 'rgba(255,215,110,.9)';
    ctx.lineWidth = 2;
    ellipse(2, 0, type === 'bird' ? 12 : 26, type === 'bird' ? 4 : 6);
    ctx.stroke();
  }
  fillEllipse(2, 0, type === 'bird' ? 8 : 20, type === 'bird' ? 2.5 : 4.5, 'rgba(0,0,0,.22)');
  if (a.bowl) {
    const bx = a.dir * (type === 'bird' ? 12 : 30);
    fillEllipse(bx, -1.5, type === 'bird' ? 5 : 8, type === 'bird' ? 2 : 3, '#b8b0a2');
    fillEllipse(bx, -2.5, type === 'bird' ? 3.8 : 6.2, type === 'bird' ? 1.3 : 2, FOOD_COLOR[a.bowl] || '#999');
  }
  ctx.scale(a.dir, 1);
  if (type === 'cat') drawCat(a);
  else if (type === 'dog') drawDog(a);
  else drawBird(a);
  ctx.restore();

  const top = p[1] - (type === 'bird' ? 24 : type === 'dog' ? 48 : 42) * k;
  if (a.state === 'sleep') {
    const z = (G.clock * 0.6 + a.id) % 1;
    ctx.globalAlpha = 1 - z;
    text('z', p[0] + 8 * k + z * 6, top + 10 - z * 14, 9 + z * 4, '#f4ecdb', 'center', 700);
    ctx.globalAlpha = 1;
  }
  let icon = '';
  if (a.injured && !a.treated) icon = 'hurt';
  else if (a.hunger < 40) icon = 'hungry';
  else if (canAdopt(a)) icon = 'home';
  if (icon && !a.leaving) drawBubble(p[0], top - 6 - (a.cry ? Math.sin(a.cry * 12) * 2 : 0), icon);
  if (a.name) {
    ctx.globalAlpha = 0.9;
    text(a.name, p[0], p[1] + 9, 10.5, '#fbf3e0', 'center', 600);
    ctx.globalAlpha = 1;
  }
}

function drawBubble(x, y, icon) {
  fillEllipse(x, y, 10, 9, 'rgba(250,244,230,.92)');
  ctx.fillStyle = 'rgba(250,244,230,.92)';
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 7);
  ctx.lineTo(x, y + 12);
  ctx.lineTo(x + 3, y + 7);
  ctx.fill();
  if (icon === 'hurt') {
    ctx.fillStyle = '#c23b2e';
    ctx.fillRect(x - 1.6, y - 5, 3.2, 10);
    ctx.fillRect(x - 5, y - 1.6, 10, 3.2);
  } else if (icon === 'hungry') {
    ctx.fillStyle = '#7a5532';
    ctx.beginPath();
    ctx.arc(x, y - 1, 6, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    fillEllipse(x, y - 1, 6, 1.6, '#c99a5a');
  } else {
    ctx.fillStyle = '#b8402e';
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x + 6, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 4.5, y, 9, 5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 1.2, y + 1.5, 2.4, 3.5);
  }
}

function drawHeart(x, y, r, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ff7d8a';
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.9);
  ctx.bezierCurveTo(x - r * 1.4, y - r * 0.2, x - r * 0.6, y - r * 1.2, x, y - r * 0.4);
  ctx.bezierCurveTo(x + r * 0.6, y - r * 1.2, x + r * 1.4, y - r * 0.2, x, y + r * 0.9);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/* ---------- 绘制：光、雨、粒子 ---------- */
function drawLights(sk) {
  const dark = 1 - sk.light;
  if (dark > 0.02) {
    ctx.fillStyle = 'rgba(14,18,46,' + (dark * 0.55) + ')';
    ctx.fillRect(0, 0, VW, PANEL_TOP);
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const fl = calm ? 0 : Math.sin(G.clock * 7) * 0.02 + Math.sin(G.clock * 13) * 0.015;
  glow(VW / 2, BY - 40, 62 + dark * 30, 'rgba(255,160,70,' + (0.12 + dark * 0.22 + fl) + ')');
  if (dark > 0.3) {
    [120, 280].forEach(x => glow(x, BY - 76, 34, 'rgba(255,90,40,' + (dark * 0.4 + fl) + ')'));
  }
  if (dark > 0.3) {
    [-0.58, 0.58].forEach(wx => {
      const p = yard(wx, 0.07);
      glow(p[0], p[1] - 35 * p[2] * 1.7, 26, 'rgba(255,170,80,' + dark * 0.45 + ')');
    });
  }
  G.flies.forEach(f => {
    const p = yard(f.wx, f.d);
    const a = 0.5 + 0.5 * Math.sin(G.clock * 3 * f.sp + f.ph);
    if (a > 0.15) glow(p[0], p[1] - f.h * p[2], 7, 'rgba(200,255,120,' + a * 0.75 + ')');
  });
  incenseTips().forEach(([x, y]) => glow(x, y, 6, 'rgba(255,140,60,' + (0.5 + dark * 0.4) + ')'));
  ctx.restore();
}

function drawSmoke() {
  G.smoke.forEach(p => {
    ctx.globalAlpha = Math.min(1, p.life * 1.4) * 0.22;
    fillEllipse(p.x, p.y, p.r, p.r * 1.2, '#e9e8e4');
  });
  ctx.globalAlpha = 1;
}

function drawRain() {
  if (G.rainAmt <= 0.02) return;
  if (seasonNow() === 'winter') {
    ctx.fillStyle = 'rgba(250,252,255,' + (0.85 * G.rainAmt) + ')';
    G.drops.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, TAU);
      ctx.fill();
    });
    return;
  }
  ctx.strokeStyle = 'rgba(205,215,230,' + (0.35 * G.rainAmt) + ')';
  ctx.lineWidth = 1;
  ctx.beginPath();
  G.drops.forEach(d => {
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - 2, d.y + 13);
  });
  ctx.stroke();
}

/* ---------- 绘制：木鱼和底部操作区 ---------- */
function drawPanel() {
  const top = PANEL_TOP;
  const g = ctx.createLinearGradient(0, top, 0, VH);
  g.addColorStop(0, '#5b3a22');
  g.addColorStop(1, '#2e1c11');
  ctx.fillStyle = g;
  ctx.fillRect(0, top, VW, VH - top);
  ctx.strokeStyle = 'rgba(0,0,0,.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 9; i++) {
    const y = top + 10 + i * 22;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(120, y + 6, 260, y - 6, VW, y + 3);
  }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,220,170,.18)';
  ctx.fillRect(0, top, VW, 2);

  drawFish();
  if (S.monk > 0) drawMonk();

  if (S.knocks < 3 && !G.modal && S.seenIntro) {
    const [fx, fy] = fishPos();
    const pulse = (G.clock % 1.4) / 1.4;
    ctx.strokeStyle = 'rgba(255,215,120,' + (1 - pulse) * 0.8 + ')';
    ctx.lineWidth = 2;
    ellipse(fx, fy, 70 + pulse * 20, 54 + pulse * 16);
    ctx.stroke();
    text('点木鱼，积功德', fx, fy - 82, 14, '#ffe2a0', 'center', 700, SERIF);
  }

  if (G.sutra) return;
  const y = VH - 60;
  const inc = incenseLeft();
  const bowWait = BOW_COOLDOWN - (G.clock - G.bowAt);
  const list = [['上香', lightIncense, inc > 0 ? 'dark' : 'red', inc > 0 ? '燃香 ' + clockText(inc) : '功德翻倍']];
  if (G.scene === 'hall') {
    list.unshift(['礼佛', startBow, bowWait > 0 || G.bow ? 'dark' : 'red', G.bow ? '礼拜中' : bowWait > 0 ? Math.ceil(bowWait) + ' 秒' : '三拜']);
    const n = OFFERS.filter(o => offerLeft(o.id) > 0).length;
    list.push(['供奉', () => { G.modal = { type: 'offer' }; }, 'red', n ? '已供 ' + n + '/4' : '花果水灯']);
    list.push(['祈福', () => { G.modal = { type: 'wish' }; }, 'red', '许个心愿']);
    list.push(['诵经', openSutra, 'red', '六部可选']);
    list.push(['出殿', exitHall, 'red', '回到小院']);
  } else {
    const bellWait = BELL_COOLDOWN - (G.clock - G.bellAt);
    list.push(['进殿', enterHall, 'red', '礼佛供奉']);
    list.push(['诵经', openSutra, 'red', '六部可选']);
    list.push(['撞钟', strikeBell, bellWait > 0 ? 'dark' : 'red', bellRemark()]);
    list.push(['商店', () => { G.modal = { type: 'shop' }; }, 'red', '粮食药品']);
  }
  const gap = 5;
  const w = (VW - 20 - gap * (list.length - 1)) / list.length;
  list.forEach(([label, fn, st, sub], i) => button(label, 10 + i * (w + gap), y, w, 50, fn, st, sub));
}

function bellRemark() {
  const h = realHour();
  const slot = h >= 5 && h < 9 ? 'am' : h >= 17 && h < 21 ? 'pm' : '';
  if (slot && !S.bellDays[dayKey() + slot]) return slot === 'am' ? '晨钟加持' : '暮钟加持';
  return '钟声';
}

function drawFish() {
  const [fx, fy] = fishPos();
  G.buttons.push({ x: fx - 75, y: fy - 60, w: 150, h: 112, onTap: () => knock('tap'), fish: true });
  fillEllipse(fx, fy + 46, 78, 14, 'rgba(0,0,0,.35)');
  fillEllipse(fx, fy + 42, 74, 13, '#8e1f1a');
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.2;
  ellipse(fx, fy + 42, 70, 11);
  ctx.stroke();

  const sq = 1 - G.fishHit * 0.04;
  ctx.save();
  ctx.translate(fx, fy + 40);
  ctx.scale(1 + G.fishHit * 0.02, sq);
  ctx.translate(0, -40);
  const g = ctx.createRadialGradient(-24, -24, 6, 0, 0, 82);
  g.addColorStop(0, '#e2844a');
  g.addColorStop(0.35, '#ad4420');
  g.addColorStop(0.75, '#6e2410');
  g.addColorStop(1, '#3a1107');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-66, 8);
  ctx.bezierCurveTo(-68, -40, -36, -54, 0, -54);
  ctx.bezierCurveTo(36, -54, 68, -40, 66, 8);
  ctx.bezierCurveTo(64, 34, 36, 44, 0, 44);
  ctx.bezierCurveTo(-36, 44, -64, 34, -66, 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(50,12,4,.35)';
  ctx.lineWidth = 1.2;
  for (let r = 0; r < 3; r++) {
    for (let c = -3 + (r % 2) * 0.5; c <= 3; c++) {
      ctx.beginPath();
      ctx.arc(c * 15, -40 + r * 11, 7, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = 'rgba(40,10,4,.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 40, 92, Math.PI * 1.3, Math.PI * 1.7);
  ctx.stroke();
  ctx.fillStyle = '#1e0803';
  ctx.beginPath();
  ctx.moveTo(-54, 10);
  ctx.quadraticCurveTo(0, 34, 54, 10);
  ctx.quadraticCurveTo(0, 20, -54, 10);
  ctx.closePath();
  ctx.fill();
  fillEllipse(-54, 10, 5.5, 5.5, '#1e0803');
  fillEllipse(54, 10, 5.5, 5.5, '#1e0803');
  fillEllipse(-24, -30, 22, 11, 'rgba(255,225,190,.32)', -0.4);
  fillEllipse(-30, -34, 7, 3.5, 'rgba(255,245,230,.5)', -0.4);
  ctx.restore();

  G.ripples.forEach(r => {
    ctx.strokeStyle = 'rgba(255,215,130,' + r.life * 0.6 + ')';
    ctx.lineWidth = 1.5;
    ellipse(r.x, r.y, r.r * 1.3, r.r);
    ctx.stroke();
  });

  /* 木槌：敲下去很快，抬起来慢一点 */
  const px = fx + 112;
  const py = fy + 34;
  const rest = 1.15;
  const hit = 0.74;
  const u = Math.min(1, G.knockAge / 0.24);
  const th = hit + (rest - hit) * (1 - Math.pow(1 - u, 3));
  const hx = px - 105 * Math.cos(th);
  const hy = py - 105 * Math.sin(th);
  ctx.strokeStyle = '#c9a46a';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px + 16 * Math.cos(th), py + 16 * Math.sin(th));
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, py - 1.5);
  ctx.lineTo(hx, hy - 1.5);
  ctx.stroke();
  fillEllipse(hx, hy, 12, 11, '#e6d2a6');
  fillEllipse(hx - 3, hy - 3, 5, 4, 'rgba(255,255,255,.35)');
}

function drawMonk() {
  const x = 62;
  const y = PANEL_TOP + 112;
  const hit = G.monkAge < 0.12;
  fillEllipse(x, y + 4, 26, 5, 'rgba(0,0,0,.3)');
  ctx.fillStyle = '#7d766c';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 2);
  ctx.quadraticCurveTo(x - 16, y - 22, x - 2, y - 26);
  ctx.quadraticCurveTo(x + 10, y - 22, x + 12, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8f2a1e';
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 24);
  ctx.lineTo(x + 6, y - 6);
  ctx.lineTo(x + 2, y - 4);
  ctx.lineTo(x - 11, y - 21);
  ctx.closePath();
  ctx.fill();
  fillEllipse(x - 2, y - 33, 8, 8.5, '#f0cfa8');
  fillEllipse(x - 4, y - 36, 3, 2, 'rgba(255,255,255,.35)');
  fillEllipse(x + 2.5, y - 33, 0.9, 0.9, '#3a2a20');
  fillEllipse(x + 22, y - 2, 9, 7, '#a2401e');
  ctx.fillStyle = '#1e0803';
  ctx.fillRect(x + 15, y - 1, 14, 1.6);
  ctx.strokeStyle = '#c9a46a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 14);
  ctx.lineTo(x + (hit ? 20 : 26), y + (hit ? -10 : -20));
  ctx.stroke();
  fillEllipse(x + (hit ? 20 : 26), y + (hit ? -10 : -20), 2.8, 2.6, '#e6d2a6');
  text(S.monk > 1 ? '小沙弥 ×' + S.monk : '小沙弥', x + 4, y + 18, 11, '#d8c3a0', 'center', 600);
}

/* ---------- 绘制：顶部信息 ---------- */
function drawHud() {
  const g = ctx.createLinearGradient(0, 0, 0, 70);
  g.addColorStop(0, 'rgba(20,12,8,.66)');
  g.addColorStop(1, 'rgba(20,12,8,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VW, 70);
  text('功德', 16, 16, 12, '#e8d6b0', 'left', 600, SERIF);
  text(fmt(G.shown), 16, 38, 26, '#ffd77a', 'left', 700);
  const per = S.monk * S.fishLv / 2.5 * mult();
  const extra = [];
  if (per > 0) extra.push('+' + (per < 10 ? per.toFixed(1) : fmt(per)) + '/秒');
  if (mult() > 1) extra.push('香火 ×2');
  if (extra.length) text(extra.join('  '), 16, 59, 11, '#e8d6b0', 'left', 600);

  const winter = seasonNow() === 'winter';
  const weather = G.rainAmt > 0.5 ? (winter ? '雪' : '雨') : isNight() ? '夜' : '晴';
  const where = G.scene === 'hall' ? '大雄宝殿 · ' : '';
  text(where + SEASON_LABEL[seasonNow()] + ' · ' + shichen() + ' · ' + weather, VW - 16, 16, 12, '#e8d6b0', 'right', 600, SERIF);
  button('天时', VW - 188, 28, 50, 26, () => { G.modal = { type: 'view' }; }, 'dark');
  button('送养册', VW - 132, 28, 62, 26, () => { G.modal = { type: 'book' }; }, 'dark');
  button(muted ? '静音' : '声音', VW - 64, 28, 50, 26, () => setMuted(!muted), 'dark');
}

function drawToast() {
  const t = G.toast;
  if (!t) return;
  const lines = wrap(t.text, VW - 80, 14);
  const h = 20 + lines.length * 20;
  const y = 66;
  ctx.globalAlpha = Math.min(1, t.t * 3);
  roundRect(24, y, VW - 48, h, 8);
  ctx.fillStyle = t.kind === 'warn' ? 'rgba(120,32,24,.94)' : 'rgba(244,236,219,.95)';
  ctx.fill();
  if (t.kind !== 'warn') {
    ctx.fillStyle = '#a8322a';
    ctx.fillRect(24, y + 8, 3, h - 16);
  }
  lines.forEach((l, i) => text(l, VW / 2, y + 20 + i * 20, 14, t.kind === 'warn' ? '#fbe9d6' : INK, 'center', 600));
  ctx.globalAlpha = 1;
}

/* ---------- 绘制：弹窗 ---------- */
function card(x, y, w, h, title) {
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  roundRect(x + 2, y + 4, w, h, 10);
  ctx.fill();
  roundRect(x, y, w, h, 10);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.strokeStyle = 'rgba(160,120,60,.6)';
  ctx.lineWidth = 1.2;
  roundRect(x + 5, y + 5, w - 10, h - 10, 7);
  ctx.stroke();
  if (title) {
    ctx.fillStyle = '#a8322a';
    ctx.fillRect(x + 18, y + 16, 22, 22);
    text('院', x + 29, y + 27.5, 14, '#f8ecd0', 'center', 700, SERIF);
    text(title, x + 48, y + 28, 19, INK, 'left', 700, SERIF);
  }
}

function bar(x, y, w, label, v, color) {
  text(label, x, y, 12.5, '#6b5a48', 'left', 600);
  roundRect(x + 40, y - 5, w - 80, 10, 5);
  ctx.fillStyle = 'rgba(43,33,26,.12)';
  ctx.fill();
  roundRect(x + 40, y - 5, Math.max(10, (w - 80) * v / 100), 10, 5);
  ctx.fillStyle = color;
  ctx.fill();
  text(String(Math.round(v)), x + w - 30, y, 12.5, INK, 'right', 700);
}

function drawAnimalSheet(a) {
  const kind = KINDS[a.kind];
  const type = kind.type;
  const w = VW - 28;
  const h = 312;
  const x = 14;
  const y = VH - h - 10;
  G.sheetTop = y;
  card(x, y, w, h);
  text(a.name || kind.label, x + 22, y + 28, 20, INK, 'left', 700, SERIF);
  ctx.font = '700 20px ' + SERIF;
  const nw = ctx.measureText(a.name || kind.label).width;
  text(a.name ? kind.label : '还没有名字', x + 30 + nw, y + 30, 12, '#8a7a68', 'left', 600);
  let cond = '身体健康';
  let condColor = '#4b6b3a';
  if (a.injured && !a.treated) { cond = a.injured; condColor = '#a8322a'; }
  else if (a.injured) { cond = '伤口包好了，正在恢复'; condColor = '#8a6a2a'; }
  else if (a.hunger < 30) { cond = '饿得肚子咕咕叫'; condColor = '#a8322a'; }
  text(cond, x + 22, y + 54, 13, condColor, 'left', 600);
  button('×', x + w - 46, y + 12, 32, 32, () => { G.modal = null; }, 'ink');

  bar(x + 22, y + 78, w - 44, '饱食', a.hunger, '#c98a3a');
  bar(x + 22, y + 98, w - 44, '健康', a.health, '#5f9a5a');
  bar(x + 22, y + 118, w - 44, '亲近', a.trust, '#d0606a');

  text('喂它吃', x + 22, y + 142, 12, '#8a7a68', 'left', 600);
  const bw = (w - 44 - 16) / 3;
  FOODS.forEach((f, i) => {
    const bx = x + 22 + (i % 3) * (bw + 8);
    const by = y + 154 + Math.floor(i / 3) * 40;
    const have = f.id === 'water' ? -1 : S.inv[f.id];
    const rule = DIET[type][f.id];
    const style = have === 0 || rule.refuse ? 'off' : 'ink';
    const label = f.id === 'water' ? '清水' : f.label + ' ' + have;
    button(label, bx, by, bw, 34, () => feed(a, f.id), style);
  });

  let hint = '';
  if (!a.name) hint = a.trust < 50 ? '亲近到 50 就能给它起名字' : '它已经信任你了，给它起个名字吧';
  else if (!canAdopt(a)) hint = '亲近 80、健康 90、吃饱以后，可以为它找个好人家';
  else hint = '它已经准备好去新家了';
  text(hint, x + 22, y + 244, 12, '#8a7a68', 'left', 500);

  const acts = [['摸摸', () => pet(a), 'red']];
  if (a.injured && !a.treated) {
    acts.push(['上药 (' + S.inv.med + ')', () => treat(a), S.inv.med > 0 ? 'red' : 'off']);
    if (ads.canShow('heal_now').ok) acts.push(['看广告治好', () => watchHeal(a), 'ad']);
  }
  if (!a.name && a.trust >= 50) acts.push(['起名', () => openNaming(a), 'gold']);
  if (canAdopt(a)) acts.push(['送养', () => adopt(a), 'gold']);
  const n = acts.length;
  const aw = (w - 44 - (n - 1) * 8) / n;
  acts.forEach(([label, fn, st], i) => button(label, x + 22 + i * (aw + 8), y + 258, aw, 40, fn, st));
}

function drawNaming(a) {
  const w = 320;
  const h = 250;
  const x = (VW - w) / 2;
  const y = (VH - h) / 2 - 40;
  card(x, y, w, h, '给它起个名字');
  text('这只' + KINDS[a.kind].label + '以后就叫：', x + 24, y + 62, 13, '#6b5a48', 'left', 500);
  G.modal.opts.forEach((n, i) => button(n, x + 24 + i * 94, y + 82, 84, 46, () => giveName(a, n), 'gold'));
  button('换一批', x + 24, y + 150, 128, 40, () => openNaming(a), 'ink');
  button('先不起', x + w - 152, y + 150, 128, 40, () => { G.modal = { type: 'animal', id: a.id }; }, 'ink');
}

function drawAdopted() {
  const m = G.modal;
  const w = 330;
  const h = 260;
  const x = (VW - w) / 2;
  const y = (VH - h) / 2 - 40;
  card(x, y, w, h, m.name + '有家了');
  const lines = wrap(m.name + '被' + m.who + '领养了。临走前它回头看了一眼小院。', w - 48, 15);
  lines.forEach((l, i) => text(l, x + 24, y + 70 + i * 24, 15, INK, 'left', 500));
  text('功德 +' + fmt(m.v), x + w / 2, y + 160, 22, '#a8322a', 'center', 700, SERIF);
  button('好', x + w / 2 - 70, y + 194, 140, 44, () => { G.modal = null; }, 'red');
}

function drawShop() {
  const x = 16;
  const w = VW - 32;
  const y = 64;
  const h = VH - y - 16;
  card(x, y, w, h, '商店');
  text('功德 ' + fmt(S.merit), x + w - 60, y + 28, 15, '#a8322a', 'right', 700);
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  let yy = y + 60;
  text('粮食和药品', x + 22, yy, 12, '#8a7a68', 'left', 600);
  yy += 14;
  GOODS.forEach(g => {
    text(g.label, x + 22, yy + 18, 15, INK, 'left', 700, SERIF);
    text('×' + g.n + '  ' + g.note + '  现有 ' + S.inv[g.id], x + 22, yy + 36, 11, '#8a7a68', 'left', 500);
    button(g.cost + ' 功德', x + w - 118, yy + 6, 96, 34, () => buyGood(g), S.merit >= g.cost ? 'red' : 'off');
    yy += 46;
  });
  if (ads.canShow('food_pack').ok) {
    button('看广告领粮食包', x + 22, yy + 4, w - 44, 40, watchFoodPack, 'ad');
    yy += 50;
  }
  yy += 6;
  text('修行和小院', x + 22, yy, 12, '#8a7a68', 'left', 600);
  yy += 14;
  const ups = [
    ['换更好的木鱼', '每敲一下功德 ' + S.fishLv + ' → ' + (S.fishLv + 1), fishCost(S.fishLv), upgradeFish, false],
    ['请小沙弥', S.monk >= MAX_MONK ? '已经满员' : '自动敲木鱼，现有 ' + S.monk + ' 位', monkCost(S.monk), hireMonk, S.monk >= MAX_MONK],
    ['扩建猫窝', S.kennel >= MAX_KENNEL ? '已经最大' : '能收留 ' + S.kennel + ' → ' + (S.kennel + 1) + ' 只', kennelCost(S.kennel), growKennel, S.kennel >= MAX_KENNEL],
  ];
  ups.forEach(([label, sub, cost, fn, maxed]) => {
    text(label, x + 22, yy + 18, 15, INK, 'left', 700, SERIF);
    text(sub, x + 22, yy + 36, 11, '#8a7a68', 'left', 500);
    if (maxed) text('已满', x + w - 70, yy + 23, 14, '#8a7a68', 'center', 600);
    else button(fmt(cost) + ' 功德', x + w - 118, yy + 6, 96, 34, fn, S.merit >= cost ? 'red' : 'off');
    yy += 46;
  });
}

function drawBook() {
  const x = 16;
  const w = VW - 32;
  const y = 64;
  const h = VH - y - 16;
  card(x, y, w, h, '送养册');
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  const stats = '木鱼 ' + fmt(S.knocks) + ' 下 · 诵经 ' + S.sutras + ' 部 · 拜佛 ' + S.bows + ' 次';
  const stats2 = '收留 ' + S.rescued + ' 只 · 送养 ' + S.adopted.length + ' 只 · 累计功德 ' + fmt(S.total);
  text(stats, x + 22, y + 60, 12.5, '#6b5a48', 'left', 600);
  text(stats2, x + 22, y + 80, 12.5, '#6b5a48', 'left', 600);
  ctx.fillStyle = 'rgba(160,120,60,.4)';
  ctx.fillRect(x + 22, y + 96, w - 44, 1);
  if (!S.adopted.length) {
    const lines = wrap('还没有送养过小动物。把它们喂饱、治好伤、起好名字，等亲近够了，就能为它们找个好人家。', w - 44, 14);
    lines.forEach((l, i) => text(l, x + 22, y + 124 + i * 22, 14, '#8a7a68', 'left', 500));
    return;
  }
  const rows = Math.floor((h - 120) / 44);
  S.adopted.slice(0, rows).forEach((r, i) => {
    const yy = y + 112 + i * 44;
    text(r.name, x + 22, yy + 12, 16, INK, 'left', 700, SERIF);
    text(KINDS[r.kind].label + ' · ' + r.date, x + w - 22, yy + 12, 11.5, '#8a7a68', 'right', 500);
    text('去了' + r.who + '家', x + 22, yy + 31, 12, '#6b5a48', 'left', 500);
  });
}

function drawIntro() {
  const w = 340;
  const h = 360;
  const x = (VW - w) / 2;
  const y = (VH - h) / 2 - 30;
  card(x, y, w, h, '山寺小院');
  const lines = [
    '深山里有一座小寺。',
    '敲木鱼积攒功德，上香、拜佛、诵经、撞钟都能得到加持。',
    '山门外常有流浪的猫狗和受伤的小鸟。用功德换粮食和药，喂饱它们、治好它们，等它们信任你了，再为它们找一个好人家。',
  ];
  let yy = y + 66;
  lines.forEach(p => {
    wrap(p, w - 48, 14.5).forEach(l => {
      text(l, x + 24, yy, 14.5, INK, 'left', 500);
      yy += 23;
    });
    yy += 8;
  });
  button('进入小院', x + w / 2 - 80, y + h - 70, 160, 48, () => {
    S.seenIntro = true;
    G.modal = null;
    audio();
    sndBell();
    writeSave();
  }, 'red');
}

function drawSutra() {
  const g = G.sutra;
  const su = sutraById(g.id);
  const x = 18;
  const w = VW - 36;
  const y = 62;
  const h = PANEL_TOP - y - 8;
  card(x, y, w, h);
  const titleX = x + w - 30;
  ctx.fillStyle = '#a8322a';
  ctx.fillRect(titleX - 11, y + 18, 22, 22);
  text('经', titleX, y + 29.5, 14, '#f8ecd0', 'center', 700, SERIF);
  const step = 18;
  const tstep = Math.min(step, (h - 130) / su.title.length);
  for (let i = 0; i < su.title.length; i++) text(su.title[i], titleX, y + 56 + i * tstep, 15, '#a8322a', 'center', 700, SERIF);

  /* 竖排，从右往左读；经文长的分页 */
  const top = y + 24;
  const bottom = y + h - 84;
  const rows = Math.max(8, Math.floor((bottom - top) / step));
  const maxCols = Math.max(1, Math.floor((w - 70) / 19));
  const pageSize = rows * maxCols;
  const pos = sutraPos(su.id);
  const page = Math.floor(pos / pageSize);
  const pages = Math.ceil(su.chars.length / pageSize);
  const first = page * pageSize;
  const count = Math.min(pageSize, su.chars.length - first);
  const cols = Math.ceil(count / rows);
  const colW = Math.min(24, (w - 70) / Math.max(cols, 1));
  const right = titleX - 28;
  const ph = su.phrases.find(q => pos >= q.start && pos < q.end);
  for (let j = 0; j < count; j++) {
    const i = first + j;
    const cx = right - Math.floor(j / rows) * colW;
    const cy = top + (j % rows) * step + step / 2;
    if (i === pos) fillEllipse(cx, cy, 9, 9, 'rgba(168,50,42,.85)');
    else if (ph && i >= ph.start && i < ph.end && i > pos) fillEllipse(cx, cy, 8, 8, 'rgba(201,162,74,.18)');
    const color = i === pos ? '#fff4dc' : i < pos ? INK : 'rgba(43,33,26,.3)';
    text(su.chars[i], cx, cy + 0.5, 14.5, color, 'center', i < pos ? 600 : 500, SERIF);
  }

  const pct = Math.round(pos / su.chars.length * 100);
  let status = su.short + ' · ' + pct + '%';
  if (pages > 1) status += ' · 第 ' + (page + 1) + '/' + pages + ' 页';
  status += g.auto ? ' · 自动诵经中' : ' · 敲木鱼诵一句';
  if (g.done > 0) status = '诵毕 · ' + su.short + '已诵 ' + (S.sutraCount[su.id] || 0) + ' 遍';
  text(status, x + 24, y + h - 68, 12, '#6b5a48', 'left', 600);
  const by = y + h - 52;
  button('换经', x + 22, by, 62, 40, switchSutra, 'ink');
  button(S.opt.fishBeat ? '木鱼 开' : '木鱼 关', x + 90, by, 72, 40, toggleFishBeat, 'ink');
  button(g.auto ? '停止' : '自动诵经', x + 168, by, 92, 40, toggleAutoSutra, g.auto ? 'gold' : 'red');
  button('合上', x + w - 84, by, 62, 40, closeSutra, 'ink');

  if (g.done > 0) {
    ctx.globalAlpha = Math.min(1, g.done);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2 - 20);
    ctx.rotate(-0.12);
    ctx.strokeStyle = '#b8322a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-56, -30, 112, 60);
    text('功德圆满', 0, 1, 24, '#b8322a', 'center', 700, SERIF);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function drawSutraPicker() {
  const x = 16;
  const w = VW - 32;
  const y = 64;
  const h = VH - y - 16;
  card(x, y, w, h, '选一部经');
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  text('敲一下木鱼诵一句，也可以点“自动诵经”跟着念', x + 22, y + 58, 12, '#6b5a48', 'left', 500);
  const rowH = Math.min(72, (h - 90) / SUTRAS.length);
  SUTRAS.forEach((su, i) => {
    const yy = y + 76 + i * rowH;
    const pos = sutraPos(su.id);
    const n = S.sutraCount[su.id] || 0;
    text(su.short, x + 22, yy + 18, 17, INK, 'left', 700, SERIF);
    text(su.note + ' · ' + su.chars.length + ' 字' + (n ? ' · 已诵 ' + n + ' 遍' : ''), x + 22, yy + 40, 11.5, '#8a7a68', 'left', 500);
    if (pos > 0) {
      roundRect(x + 22, yy + 50, w - 160, 4, 2);
      ctx.fillStyle = 'rgba(43,33,26,.12)';
      ctx.fill();
      roundRect(x + 22, yy + 50, Math.max(4, (w - 160) * pos / su.chars.length), 4, 2);
      ctx.fillStyle = '#a8322a';
      ctx.fill();
    }
    button(pos > 0 ? '接着诵' : '开始诵', x + w - 112, yy + 8, 90, 38, () => chooseSutra(su.id), 'red');
    ctx.fillStyle = 'rgba(160,120,60,.25)';
    ctx.fillRect(x + 22, yy + rowH - 6, w - 44, 1);
  });
}

function drawBowOverlay() {
  const b = G.bow;
  const n = Math.min(3, b.n);
  if (n > 0) {
    const m = [0.35, 1.95, 3.55][n - 1];
    const u = b.t - m;
    if (u < 1.4) {
      ctx.globalAlpha = Math.max(0, 1 - u / 1.4);
      text(['一拜', '二拜', '三拜'][n - 1], VW / 2, 150 - u * 10, 30, '#ffe6a8', 'center', 700, SERIF);
      ctx.globalAlpha = 1;
    }
  }
}

function drawAd() {
  ctx.fillStyle = 'rgba(0,0,0,.92)';
  ctx.fillRect(0, 0, VW, VH);
  const y = VH / 2;
  text('模拟广告', VW / 2, y - 50, 30, '#ffffff', 'center', 700);
  text('这里是真实广告的位置', VW / 2, y - 6, 16, '#c8d6df');
  text(Math.ceil(G.ad.left) + ' 秒', VW / 2, y + 38, 20, '#ffd166');
  if (G.ad.rewarded) text('点屏幕提前关闭（不发奖）', VW / 2, y + 92, 15, '#8fa0ac');
}

function drawFallingLeaf(l) {
  if (l.kind === 'spring') {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    fillEllipse(0, 0, 3.2, 2, '#f6c1cf');
    ctx.restore();
  } else {
    drawLeaf(l.x, l.y, 5, l.rot, l.kind === 'summer' ? '#5f9f45' : '#efc443');
  }
}

function draw() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#1a120c';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.restore();

  G.buttons = [];
  const sk = skyNow();
  G.sky = sk;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, VW, VH);
  ctx.clip();

  if (G.scene === 'hall') {
    drawHallInside(sk);
  } else {
    drawSky(sk);
    drawWalls();
    drawFloor();
    drawHall(sk);
    const objs = [
      { d: 0.2, fn: drawTree },
      { d: 0.46, fn: drawBurner },
      { d: 0.16, fn: drawBell },
      { d: 0.72, fn: drawHouse },
      { d: 0.07, fn: () => drawStoneLantern(-0.58, sk) },
      { d: 0.07, fn: () => drawStoneLantern(0.58, sk) },
    ];
    S.animals.forEach(a => objs.push({ d: a.d, fn: () => drawAnimal(a) }));
    objs.sort((a, b) => a.d - b.d);
    objs.forEach(o => o.fn());
    drawSmoke();
    G.leaves.forEach(drawFallingLeaf);
    warmTint(sk);
    drawLights(sk);
    drawRain();
    G.hearts.forEach(h => drawHeart(h.x, h.y, 5, Math.min(1, h.life)));
  }
  if (G.bow) drawBowOverlay();

  drawPanel();
  G.floats.forEach(f => {
    ctx.globalAlpha = Math.min(1, f.life * 1.6);
    text(f.text, f.x, f.y, f.size, f.color, 'center', 700, SERIF);
  });
  ctx.globalAlpha = 1;

  if (G.sutra) drawSutra();
  drawHud();

  const m = G.modal;
  if (m) {
    G.buttons = [];
    if (m.type !== 'animal') {
      ctx.fillStyle = 'rgba(10,6,4,.45)';
      ctx.fillRect(0, 0, VW, VH);
    }
    if (m.type === 'animal' || m.type === 'name') {
      const a = animalById(m.id);
      if (!a || a.leaving) G.modal = null;
      else if (m.type === 'animal') drawAnimalSheet(a);
      else drawNaming(a);
    } else if (m.type === 'shop') drawShop();
    else if (m.type === 'book') drawBook();
    else if (m.type === 'adopted') drawAdopted();
    else if (m.type === 'intro') drawIntro();
    else if (m.type === 'sutras') drawSutraPicker();
    else if (m.type === 'offer') drawOffer();
    else if (m.type === 'wish') drawWish();
    else if (m.type === 'blessing') drawBlessing();
    else if (m.type === 'view') drawView();
  }
  drawToast();
  if (G.trans) {
    const t = G.trans.t;
    ctx.fillStyle = 'rgba(8,5,3,' + clamp(t < 0.3 ? t / 0.3 : (0.6 - t) / 0.3, 0, 1) + ')';
    ctx.fillRect(0, 0, VW, VH);
  }
  if (G.ad) {
    G.buttons = [];
    drawAd();
  }
  ctx.restore();
}

/* ---------- 天空细节：云、霞光、光芒 ---------- */
function drawClouds(sk) {
  const night = clamp(1 - sk.light, 0, 1);
  const rain = G.rainAmt;
  let col = [lerp(255, 70, night), lerp(255, 78, night), lerp(255, 110, night)];
  if (sk.warm > 0) col = [lerp(col[0], 255, sk.warm * 0.6), lerp(col[1], 172, sk.warm * 0.6), lerp(col[2], 138, sk.warm * 0.6)];
  col = col.map((v, k) => lerp(v, [140, 146, 152][k] * (1 - night * 0.6), rain * 0.8));
  const a = clamp(0.55 + rain * 0.35 - night * 0.2, 0, 1);
  const under = 'rgba(' + col.map(v => Math.round(v * 0.82)).join(',') + ',' + (a * 0.8).toFixed(3) + ')';
  const main = 'rgba(' + col.map(v => Math.round(v)).join(',') + ',' + a.toFixed(3) + ')';
  scenery.clouds.forEach(c => {
    c.puffs.forEach(([px, py, r]) => fillEllipse(c.x + px * c.s, c.y + (py + 3) * c.s, r * c.s, r * 0.55 * c.s, under));
    c.puffs.forEach(([px, py, r]) => fillEllipse(c.x + px * c.s, c.y + (py - 2) * c.s, r * 0.9 * c.s, r * 0.6 * c.s, main));
  });
}

function sunRays(x, y, warm) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,205,150,' + (warm * 0.05).toFixed(3) + ')';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI / 2 + (i - 3) * 0.28 + Math.sin(G.clock * 0.15 + i) * 0.04;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a - 0.05) * 420, y + Math.sin(a - 0.05) * 420);
    ctx.lineTo(x + Math.cos(a + 0.05) * 420, y + Math.sin(a + 0.05) * 420);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* 日出日落时，整个院子被染上一层暖色。 */
function warmTint(sk) {
  if (sk.warm < 0.02) return;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,120,40,' + (sk.warm * 0.65).toFixed(3) + ')';
  ctx.fillRect(0, 0, VW, PANEL_TOP);
  ctx.restore();
}

function drawStoneLantern(wx, sk) {
  const p = yard(wx, 0.07);
  const k = p[2] * 1.7;
  const lit = 1 - sk.light > 0.3;
  ctx.save();
  ctx.translate(p[0], p[1]);
  ctx.scale(k, k);
  fillEllipse(0, 0, 13, 3, 'rgba(0,0,0,.2)');
  ctx.fillStyle = '#8f887e';
  ctx.fillRect(-10, -6, 20, 6);
  ctx.fillStyle = '#9d968b';
  ctx.fillRect(-4, -24, 8, 18);
  ctx.fillStyle = '#8f887e';
  ctx.fillRect(-9, -28, 18, 4);
  ctx.fillStyle = '#a49d92';
  ctx.fillRect(-8, -42, 16, 14);
  ctx.fillStyle = lit ? '#ffb45a' : '#3a342e';
  ctx.fillRect(-4, -39, 8, 8);
  ctx.fillStyle = '#7d766c';
  ctx.beginPath();
  ctx.moveTo(-15, -42);
  ctx.quadraticCurveTo(-8, -44, -6, -50);
  ctx.lineTo(6, -50);
  ctx.quadraticCurveTo(8, -44, 15, -42);
  ctx.closePath();
  ctx.fill();
  fillEllipse(0, -53, 3, 3.5, '#8f887e');
  if (G.snow > 0.05) {
    ctx.fillStyle = 'rgba(245,248,252,' + G.snow + ')';
    ctx.fillRect(-7, -51, 14, 2.5);
  }
  ctx.restore();
}

/* ---------- 大雄宝殿：进殿、礼佛、供奉、祈福 ---------- */
const OFFER_SEC = 600;
const OFFERS = [
  { id: 'flower', label: '供花', note: '一对莲花，敬献佛前' },
  { id: 'fruit', label: '供果', note: '两盘时令水果' },
  { id: 'water', label: '供水', note: '七杯清净水' },
  { id: 'lamp', label: '供灯', note: '点亮六盏酥油灯' },
];

const WISH_CATS = ['平安', '健康', '学业', '事业', '姻缘', '家人'];
const WISHES = {
  平安: ['出入平安，岁岁无忧', '一路顺风，诸事顺遂', '家宅安宁，四季平安'],
  健康: ['身体康健，百病不侵', '吃得香，睡得稳，笑得开', '愿家人无病无痛，长寿安康'],
  学业: ['心静如水，学有所成', '勤学不辍，金榜题名', '考场从容，下笔有神'],
  事业: ['所求皆如愿，所行化坦途', '贵人相助，步步登高', '踏实做事，前程似锦'],
  姻缘: ['遇良人，得良缘', '有情人终成眷属', '相知相守，白首不离'],
  家人: ['父母安康，儿女绕膝', '家和万事兴', '团团圆圆，平平安安'],
};

function offerLeft(id) {
  return Math.max(0, OFFER_SEC - (Date.now() - (S.offer[id] || 0)) / 1000);
}

function makeOffer(o) {
  const left = offerLeft(o.id);
  if (left > 0) {
    toast(o.label + '还供着，' + clockText(left) + ' 后可以换新的');
    return;
  }
  S.offer[o.id] = Date.now();
  const v = (10 + 5 * S.fishLv) * mult();
  gain(v);
  sndChime();
  floatText('功德 +' + fmt(v), VW / 2, hallLayout().altarY - 70, '#ffd77a', 16);
  toast(o.note + '，功德 +' + fmt(v));
  writeSave();
}

function makeWish(cat) {
  const key = dayKey() + cat;
  let v = 0;
  if (!S.wishDays[key]) {
    v = 10 * S.fishLv * mult();
    gain(v);
    const keep = {};
    Object.keys(S.wishDays).forEach(k => { if (k.indexOf(dayKey()) === 0) keep[k] = 1; });
    keep[key] = 1;
    S.wishDays = keep;
  }
  S.wishes++;
  sndChime();
  G.modal = { type: 'blessing', cat, line: pick(WISHES[cat]), v };
  writeSave();
}

function strikeQing() {
  if (G.clock - G.qingAt < 1.2) return;
  G.qingAt = G.clock;
  sndChime();
  const v = S.fishLv * mult();
  gain(v);
  floatText('功德 +' + fmt(v), 70, PANEL_TOP - 92, '#ffd77a', 14);
}

function beatDrum() {
  if (G.clock - G.drumAt < 1.2) return;
  G.drumAt = G.clock;
  sndDrum();
  const v = S.fishLv * mult();
  gain(v);
  floatText('功德 +' + fmt(v), 334, PANEL_TOP - 112, '#ffd77a', 14);
}

function enterHall() {
  if (G.trans || G.bow) return;
  audio();
  G.trans = { t: 0, to: 'hall' };
}

function exitHall() {
  if (G.trans || G.bow) return;
  G.trans = { t: 0, to: 'yard' };
}

function hallLayout() {
  const altarY = PANEL_TOP - 128;
  return { altarY, floorY: altarY + 24, sc: (altarY - 72) / 292 };
}

function bowDip() {
  const b = G.bow;
  if (!b) return 0;
  let amt = 0;
  for (const m of [0.35, 1.95, 3.55]) {
    const u = (b.t - m) / 1.3;
    if (u > 0 && u < 1) amt = Math.max(amt, Math.sin(u * Math.PI));
  }
  return amt;
}

function drawHallInside(sk) {
  const { altarY, floorY, sc } = hallLayout();
  const dip = bowDip();
  const night = clamp(1 - sk.light, 0, 1);
  ctx.save();
  ctx.translate(0, -dip * 28);

  /* 后墙和藻井 */
  const wg = ctx.createLinearGradient(0, 0, 0, floorY);
  wg.addColorStop(0, '#24140b');
  wg.addColorStop(1, '#4a2b17');
  ctx.fillStyle = wg;
  ctx.fillRect(0, -40, VW, floorY + 42);
  ctx.strokeStyle = 'rgba(201,162,74,.22)';
  ctx.lineWidth = 1;
  for (let x = 44; x < VW - 40; x += 52) {
    ctx.fillStyle = 'rgba(110,28,18,.4)';
    ctx.fillRect(x, 74, 40, floorY - 84);
    ctx.strokeRect(x + 3, 77, 34, floorY - 90);
  }
  ctx.fillStyle = '#1a0e07';
  ctx.fillRect(0, -40, VW, 104);
  for (let x = 0; x < VW; x += 40) {
    for (let y = -16; y < 60; y += 40) {
      ctx.strokeStyle = 'rgba(201,162,74,.4)';
      ctx.strokeRect(x + 3, y + 3, 34, 34);
      fillEllipse(x + 20, y + 20, 9, 9, '#2f5d62');
      fillEllipse(x + 20, y + 20, 5, 5, '#c9a24a');
    }
  }
  ctx.fillStyle = '#3a1c10';
  ctx.fillRect(0, 62, VW, 8);
  ctx.fillStyle = 'rgba(201,162,74,.5)';
  ctx.fillRect(0, 69, VW, 1.5);

  /* 地面和红毯 */
  const fg = ctx.createLinearGradient(0, floorY, 0, PANEL_TOP);
  fg.addColorStop(0, '#2e1f15');
  fg.addColorStop(1, '#5a3f2b');
  ctx.fillStyle = fg;
  ctx.fillRect(0, floorY, VW, PANEL_TOP - floorY + 40);
  ctx.strokeStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath();
  const vy = floorY - 260;
  const fb = PANEL_TOP + 40;
  for (let x = -400; x <= 800; x += 50) {
    ctx.moveTo(200 + (x - 200) * (floorY - vy) / (fb - vy), floorY);
    ctx.lineTo(x, fb);
  }
  for (let i = 1; i < 6; i++) {
    const y = floorY + (fb - floorY) * Math.pow(i / 6, 1.6);
    ctx.moveTo(0, y);
    ctx.lineTo(VW, y);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(156, floorY);
  ctx.lineTo(244, floorY);
  ctx.lineTo(300, fb);
  ctx.lineTo(100, fb);
  ctx.closePath();
  ctx.fillStyle = '#7a1d16';
  ctx.fill();
  ctx.strokeStyle = 'rgba(217,178,92,.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(162, floorY);
  ctx.lineTo(108, fb);
  ctx.moveTo(238, floorY);
  ctx.lineTo(292, fb);
  ctx.stroke();

  drawStatue(200, altarY + 10, sc);
  drawBanner(56, 72, floorY - 30, 0);
  drawBanner(344, 72, floorY - 30, 2);
  drawAltar(altarY);
  drawSmoke();

  const cushY = PANEL_TOP - 26;
  [142, 200, 258].forEach(x => drawCushion(x, cushY));
  const cat = S.animals.find(a => KINDS[a.kind].type === 'cat' && a.name && a.trust >= 60 && !a.leaving);
  if (cat) {
    ctx.save();
    ctx.translate(142, cushY - 3);
    ctx.scale(1.5, 1.5);
    drawCat(Object.assign({}, cat, { state: 'sleep' }));
    ctx.restore();
    text(cat.name, 142, cushY + 14, 10.5, '#f4e2c0', 'center', 600);
  }
  drawQing(70, PANEL_TOP - 38);
  drawDrum(334, PANEL_TOP - 64);
  drawPillar(-6);
  drawPillar(372);

  /* 光：白天门外的光柱和浮尘，夜里只有烛火和灯 */
  ctx.fillStyle = 'rgba(12,6,4,' + (0.16 + night * 0.45).toFixed(3) + ')';
  ctx.fillRect(0, -40, VW, PANEL_TOP + 80);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const day = clamp(sk.light, 0, 1) * (1 - G.rainAmt * 0.5);
  if (day > 0.2) {
    ctx.fillStyle = 'rgba(255,226,170,' + (0.045 * day).toFixed(3) + ')';
    for (let i = 0; i < 3; i++) {
      const x1 = 28 + i * 34;
      ctx.beginPath();
      ctx.moveTo(x1, 72);
      ctx.lineTo(x1 + 20, 72);
      ctx.lineTo(x1 + 190, floorY + 70);
      ctx.lineTo(x1 + 128, floorY + 70);
      ctx.closePath();
      ctx.fill();
    }
    G.dust.forEach(p => {
      const a = (0.5 + 0.5 * Math.sin(G.clock * 1.3 + p.ph)) * 0.55 * day;
      ctx.fillStyle = 'rgba(255,240,200,' + a.toFixed(3) + ')';
      ctx.fillRect(p.x, p.y, 1.4, 1.4);
    });
  }
  const fl = calm ? 0 : Math.sin(G.clock * 7) * 0.03 + Math.sin(G.clock * 13) * 0.02;
  glow(200, altarY - 220 * sc, 130, 'rgba(255,200,120,' + (0.1 + night * 0.12 + fl).toFixed(3) + ')');
  [128, 272].forEach(x => glow(x, altarY - 58, 52, 'rgba(255,170,80,' + (0.32 + fl).toFixed(3) + ')'));
  if (offerLeft('lamp') > 0) [72, 94, 116, 284, 306, 328].forEach(x => glow(x, altarY - 12, 22, 'rgba(255,170,80,' + (0.3 + fl).toFixed(3) + ')'));
  incenseTips().forEach(([x, y]) => glow(x, y, 6, 'rgba(255,140,60,.7)'));
  ctx.restore();

  if (dip > 0) {
    ctx.fillStyle = 'rgba(0,0,0,' + (dip * 0.5).toFixed(3) + ')';
    ctx.fillRect(0, -40, VW, PANEL_TOP + 80);
  }
  ctx.restore();
}

function petal(x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(0, y, 0, y - h);
  g.addColorStop(0, c2);
  g.addColorStop(1, c1);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.bezierCurveTo(x - w, y - h * 0.6, x - w * 0.3, y - h * 0.9, x, y - h);
  ctx.bezierCurveTo(x + w * 0.3, y - h * 0.9, x + w, y - h * 0.6, x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(201,150,60,.7)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,240,220,.35)';
  ctx.beginPath();
  ctx.moveTo(x, y - 3);
  ctx.lineTo(x, y - h * 0.75);
  ctx.stroke();
}

function hairPath() {
  ctx.beginPath();
  ctx.moveTo(-30, -238);
  ctx.bezierCurveTo(-32, -262, -18, -272, 0, -272);
  ctx.bezierCurveTo(18, -272, 32, -262, 30, -238);
  ctx.quadraticCurveTo(14, -252, 0, -252);
  ctx.quadraticCurveTo(-14, -252, -30, -238);
  ctx.closePath();
  ctx.moveTo(16, -279);
  ctx.ellipse(0, -279, 16, 12, 0, 0, TAU);
}

/* 释迦牟尼坐像：火焰背光、头光、莲台，禅定印。 */
function drawStatue(x0, y0, sc) {
  ctx.save();
  ctx.translate(x0, y0);
  ctx.scale(sc, sc);

  ctx.beginPath();
  for (let i = 0; i <= 90; i++) {
    const a = i / 90 * TAU;
    const wv = 1 + (calm ? 0 : 0.045 * Math.sin(a * 11 + G.clock * 0.5) + 0.02 * Math.sin(a * 23 - G.clock * 0.8));
    const tip = Math.pow(Math.max(0, Math.cos(a)), 6) * 30;
    const px = Math.sin(a) * 122 * wv;
    const py = -168 - Math.cos(a) * (150 * wv + tip);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const mg = ctx.createRadialGradient(0, -210, 10, 0, -170, 175);
  mg.addColorStop(0, '#ffeeb0');
  mg.addColorStop(0.45, '#e2ae48');
  mg.addColorStop(0.8, '#b5602a');
  mg.addColorStop(1, '#6e2a16');
  ctx.fillStyle = mg;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,225,150,.35)';
  ctx.lineWidth = 2;
  [[96, 122], [72, 96]].forEach(([rx, ry]) => {
    ellipse(0, -170, rx, ry);
    ctx.stroke();
  });
  const hg = ctx.createRadialGradient(0, -232, 4, 0, -232, 56);
  hg.addColorStop(0, '#fff6d0');
  hg.addColorStop(0.6, '#f0c868');
  hg.addColorStop(1, 'rgba(230,160,60,0)');
  ctx.fillStyle = hg;
  ellipse(0, -232, 56, 56);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,240,200,.55)';
  ctx.lineWidth = 1.5;
  ellipse(0, -232, 47, 47);
  ctx.stroke();
  ellipse(0, -232, 40, 40);
  ctx.stroke();

  ctx.fillStyle = '#7a4c1c';
  ctx.fillRect(-100, -30, 200, 34);
  ctx.fillStyle = '#a8742e';
  ctx.fillRect(-104, -34, 208, 6);
  for (let i = -4; i <= 4; i++) petal(i * 22, -26, 13, 30, '#e7b49a', '#c98a5e');
  for (let i = -3.5; i <= 3.5; i += 1) petal(i * 25, -38, 14, 34, '#f0c4a8', '#d4986a');

  const skin = ctx.createLinearGradient(-40, 0, 40, 0);
  skin.addColorStop(0, '#c9963e');
  skin.addColorStop(0.45, '#f6d888');
  skin.addColorStop(1, '#c08a38');
  const robe = ctx.createLinearGradient(-90, 0, 90, 0);
  robe.addColorStop(0, '#9a5a1e');
  robe.addColorStop(0.5, '#e9b04a');
  robe.addColorStop(1, '#94561c');

  ctx.fillStyle = robe;
  ellipse(0, -66, 94, 26);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-66, -72);
  ctx.bezierCurveTo(-72, -120, -70, -168, -50, -180);
  ctx.quadraticCurveTo(-30, -190, -14, -194);
  ctx.lineTo(14, -194);
  ctx.quadraticCurveTo(30, -190, 50, -180);
  ctx.bezierCurveTo(70, -168, 72, -120, 66, -72);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.moveTo(-16, -192);
  ctx.lineTo(16, -192);
  ctx.quadraticCurveTo(10, -160, 0, -150);
  ctx.quadraticCurveTo(-10, -160, -16, -192);
  ctx.fill();
  ctx.strokeStyle = 'rgba(110,50,10,.45)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.moveTo(-58 + i * 4, -160 + i * 18);
    ctx.quadraticCurveTo(-20, -130 + i * 16, 10 + i * 6, -100 + i * 6);
  }
  ctx.moveTo(60, -160);
  ctx.quadraticCurveTo(50, -120, 56, -80);
  for (let i = 0; i < 3; i++) {
    ctx.moveTo(-80 + i * 20, -60);
    ctx.quadraticCurveTo(-40 + i * 25, -50, i * 30, -62);
  }
  ctx.stroke();
  ctx.fillStyle = skin;
  ellipse(0, -86, 30, 11);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,70,20,.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-24, -86);
  ctx.quadraticCurveTo(0, -80, 24, -86);
  ctx.stroke();
  ellipse(0, -94, 7, 4);
  ctx.stroke();

  ctx.fillStyle = skin;
  ctx.fillRect(-11, -204, 22, 14);
  ctx.strokeStyle = 'rgba(120,70,20,.4)';
  ctx.beginPath();
  ctx.moveTo(-10, -200);
  ctx.quadraticCurveTo(0, -197, 10, -200);
  ctx.moveTo(-10, -195);
  ctx.quadraticCurveTo(0, -192, 10, -195);
  ctx.stroke();
  fillEllipse(-31, -226, 6.5, 21, '#d9a855');
  fillEllipse(31, -226, 6.5, 21, '#d9a855');
  const face = ctx.createRadialGradient(-8, -240, 4, 0, -230, 40);
  face.addColorStop(0, '#fbe6a6');
  face.addColorStop(0.7, '#e8bf62');
  face.addColorStop(1, '#c48e3a');
  ctx.fillStyle = face;
  ellipse(0, -230, 29, 35);
  ctx.fill();

  ctx.fillStyle = '#2b3352';
  hairPath();
  ctx.fill();
  ctx.save();
  hairPath();
  ctx.clip();
  for (let y = -290; y <= -238; y += 5.5) {
    const shift = Math.round((y + 290) / 5.5) % 2 ? 3 : 0;
    for (let x = -33; x <= 33; x += 6) fillEllipse(x + shift, y, 1.9, 1.9, '#1b2138');
  }
  ctx.restore();
  fillEllipse(0, -254, 3.4, 3.4, '#c8462a');

  ctx.lineCap = 'round';
  ctx.strokeStyle = '#7a4e1e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-21, -241);
  ctx.quadraticCurveTo(-12, -248, -3, -242);
  ctx.moveTo(21, -241);
  ctx.quadraticCurveTo(12, -248, 3, -242);
  ctx.stroke();
  ctx.strokeStyle = '#5a3612';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(-18, -232);
  ctx.quadraticCurveTo(-11, -228, -5, -232);
  ctx.moveTo(18, -232);
  ctx.quadraticCurveTo(11, -228, 5, -232);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(150,95,35,.6)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-1, -238);
  ctx.quadraticCurveTo(-3, -224, -5, -219);
  ctx.quadraticCurveTo(0, -216, 5, -219);
  ctx.stroke();
  ctx.strokeStyle = '#a5502c';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-7, -209);
  ctx.quadraticCurveTo(0, -205.5, 7, -209);
  ctx.stroke();
  fillEllipse(0, -243, 1.8, 1.8, '#fff3cf');
  fillEllipse(-10, -248, 9, 4, 'rgba(255,250,220,.25)');
  ctx.restore();
}

function drawBanner(x, top, bottom, ph) {
  const sway = calm ? 0 : Math.sin(G.clock * 0.7 + ph) * 0.015;
  ctx.save();
  ctx.translate(x, top);
  ctx.rotate(sway);
  const h = bottom - top;
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath();
  ctx.moveTo(-22, 14);
  ctx.lineTo(0, 0);
  ctx.lineTo(22, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8e2b1f';
  ctx.fillRect(-20, 14, 40, 8);
  const cols = ['#b8322a', '#d9a52e', '#2e6e62', '#b8322a', '#e3c06a'];
  let y = 22;
  const seg = (h - 50) / cols.length;
  cols.forEach((c, i) => {
    const w = 17 - i * 0.6;
    const g = ctx.createLinearGradient(-w, 0, w, 0);
    g.addColorStop(0, 'rgba(0,0,0,.35)');
    g.addColorStop(0.4, 'rgba(255,255,255,.08)');
    g.addColorStop(1, 'rgba(0,0,0,.4)');
    ctx.fillStyle = c;
    ctx.fillRect(-w, y, w * 2, seg);
    ctx.fillStyle = g;
    ctx.fillRect(-w, y, w * 2, seg);
    ctx.fillStyle = '#c9a24a';
    ctx.fillRect(-w - 1, y + seg - 2, w * 2 + 2, 3);
    y += seg;
  });
  ctx.strokeStyle = '#d9a52e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = -3; i <= 3; i++) {
    ctx.moveTo(i * 5, y);
    ctx.lineTo(i * 5 + Math.sin(G.clock + i) * 1.5, y + 22);
  }
  ctx.stroke();
  ctx.restore();
}

function drawCandle(x, base) {
  fillEllipse(x, base, 10, 3, '#8a6a2a');
  ctx.fillStyle = '#b8902e';
  ctx.fillRect(x - 2.5, base - 26, 5, 26);
  fillEllipse(x, base - 26, 9, 2.5, '#d9b25c');
  ctx.fillStyle = '#b8261c';
  ctx.fillRect(x - 3.5, base - 50, 7, 24);
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.fillRect(x - 2.5, base - 50, 1.5, 24);
  const f = 1 + (calm ? 0 : Math.sin(G.clock * 11 + x) * 0.12);
  fillEllipse(x, base - 56, 2.8 * f, 6 * f, '#ffbf55');
  fillEllipse(x, base - 55, 1.3, 3, '#fff6d8');
}

function drawVase(x, base) {
  ctx.fillStyle = '#e9eef0';
  ctx.beginPath();
  ctx.moveTo(x - 6, base);
  ctx.bezierCurveTo(x - 16, base - 8, x - 14, base - 26, x - 5, base - 32);
  ctx.lineTo(x - 7, base - 38);
  ctx.lineTo(x + 7, base - 38);
  ctx.lineTo(x + 5, base - 32);
  ctx.bezierCurveTo(x + 14, base - 26, x + 16, base - 8, x + 6, base);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3d5f9a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 12, base - 12);
  ctx.quadraticCurveTo(x, base - 8, x + 12, base - 12);
  ctx.moveTo(x - 12, base - 22);
  ctx.quadraticCurveTo(x, base - 18, x + 12, base - 22);
  ctx.stroke();
  [[-10, -62], [0, -72], [10, -60]].forEach(([dx, dy], i) => {
    ctx.strokeStyle = '#4f8f3a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, base - 36);
    ctx.quadraticCurveTo(x + dx * 0.4, base - 50, x + dx, base + dy + 6);
    ctx.stroke();
    if (i !== 1) fillEllipse(x + dx * 1.3, base + dy + 14, 6, 2.5, '#4f8f3a', dx > 0 ? 0.4 : -0.4);
    const fx = x + dx;
    const fy = base + dy;
    [-0.5, 0, 0.5].forEach(r => {
      ctx.save();
      ctx.translate(fx, fy + 4);
      ctx.rotate(r);
      fillEllipse(0, -5, 3.2, 6, r ? '#e57f99' : '#f6b3c4');
      ctx.restore();
    });
  });
}

function drawFruit(x, base) {
  fillEllipse(x, base, 12, 3, '#9a7424');
  ctx.fillStyle = '#b8902e';
  ctx.fillRect(x - 2.5, base - 8, 5, 8);
  fillEllipse(x, base - 8, 16, 3.5, '#d9b25c');
  [[-8, -14], [0, -14], [8, -14], [-4, -21], [4, -21], [0, -28]].forEach(([dx, dy]) => {
    fillEllipse(x + dx, base + dy, 5, 5, '#ef8f24');
    fillEllipse(x + dx - 1.5, base + dy - 1.5, 1.8, 1.4, '#ffd08a');
  });
  ctx.fillStyle = '#4f8f3a';
  ctx.fillRect(x - 0.5, base - 35, 1, 3);
}

function drawCup(x, base) {
  ctx.fillStyle = '#d9b25c';
  ctx.beginPath();
  ctx.moveTo(x - 4.5, base - 8);
  ctx.lineTo(x + 4.5, base - 8);
  ctx.lineTo(x + 2.5, base);
  ctx.lineTo(x - 2.5, base);
  ctx.closePath();
  ctx.fill();
  fillEllipse(x, base - 8, 4.5, 1.4, '#cfe6f2');
}

function drawLamp(x, base) {
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath();
  ctx.moveTo(x - 6, base - 6);
  ctx.lineTo(x + 6, base - 6);
  ctx.lineTo(x + 3, base);
  ctx.lineTo(x - 3, base);
  ctx.closePath();
  ctx.fill();
  const f = 1 + (calm ? 0 : Math.sin(G.clock * 12 + x) * 0.15);
  fillEllipse(x, base - 10, 2 * f, 4 * f, '#ffbf55');
  fillEllipse(x, base - 9.5, 0.9, 2, '#fff6d8');
}

function drawAltarBurner(x, base) {
  ctx.fillStyle = '#3e3220';
  ctx.fillRect(x - 11, base - 6, 4, 6);
  ctx.fillRect(x + 7, base - 6, 4, 6);
  const g = ctx.createLinearGradient(x - 15, 0, x + 15, 0);
  g.addColorStop(0, '#3f321d');
  g.addColorStop(0.4, '#9a8250');
  g.addColorStop(1, '#3a2e1b');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 15, base - 18);
  ctx.bezierCurveTo(x - 15, base - 8, x - 10, base - 5, x, base - 5);
  ctx.bezierCurveTo(x + 10, base - 5, x + 15, base - 8, x + 15, base - 18);
  ctx.closePath();
  ctx.fill();
  fillEllipse(x, base - 18, 16, 3, '#5d4a2a');
  fillEllipse(x, base - 18, 13, 2, '#bdb5a6');
  const left = incenseLeft();
  if (left > 0) {
    const len = (5 + 20 * left / INCENSE_SEC) * Math.min(1, G.incenseAnim);
    [-5, 0, 5].forEach((ox, i) => {
      ctx.strokeStyle = '#a3462e';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x + ox, base - 18);
      ctx.lineTo(x + ox + (i - 1) * 1.5, base - 18 - len);
      ctx.stroke();
      fillEllipse(x + ox + (i - 1) * 1.5, base - 18 - len, 1.3, 1.3, '#ff9a4a');
    });
  }
}

function drawAltar(top) {
  const on = id => offerLeft(id) > 0;
  if (on('flower')) [92, 308].forEach(x => drawVase(x, top - 3));
  [128, 272].forEach(x => drawCandle(x, top - 3));
  if (on('fruit')) [162, 238].forEach(x => drawFruit(x, top - 3));
  drawAltarBurner(200, top - 2);
  ctx.fillStyle = '#4a160f';
  ctx.fillRect(54, top - 4, 292, 10);
  ctx.fillStyle = 'rgba(255,200,150,.16)';
  ctx.fillRect(54, top - 4, 292, 2);
  if (on('water')) for (let i = 0; i < 7; i++) drawCup(146 + i * 18, top - 3);
  if (on('lamp')) [72, 94, 116, 284, 306, 328].forEach(x => drawLamp(x, top - 3));

  const cg = ctx.createLinearGradient(0, top + 6, 0, top + 80);
  cg.addColorStop(0, '#e2b240');
  cg.addColorStop(1, '#a8781a');
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.moveTo(58, top + 6);
  ctx.lineTo(342, top + 6);
  ctx.lineTo(344, top + 74);
  for (let x = 344; x > 56; x -= 16) ctx.quadraticCurveTo(x - 8, top + 82, x - 16, top + 74);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9a2418';
  ctx.fillRect(58, top + 6, 284, 10);
  ctx.fillStyle = '#d9b25c';
  ctx.fillRect(58, top + 16, 284, 1.5);
  ctx.strokeStyle = 'rgba(120,70,10,.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 74; x < 340; x += 22) {
    ctx.moveTo(x, top + 20);
    ctx.quadraticCurveTo(x + 3, top + 50, x, top + 74);
  }
  ctx.stroke();
  ctx.strokeStyle = '#8e2b1f';
  ctx.lineWidth = 1.6;
  ellipse(200, top + 46, 20, 20);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.translate(200, top + 46);
    ctx.rotate(i / 8 * TAU);
    fillEllipse(0, -10, 3.5, 7, '#b8402e');
    ctx.restore();
  }
  fillEllipse(200, top + 46, 4, 4, '#8e2b1f');
  ctx.strokeStyle = '#c9a24a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 56; x <= 344; x += 16) {
    ctx.moveTo(x, top + 74);
    ctx.lineTo(x, top + 84);
  }
  ctx.stroke();
  for (let x = 56; x <= 344; x += 16) fillEllipse(x, top + 85, 1.6, 2.2, '#c9a24a');
}

function drawCushion(x, y) {
  fillEllipse(x, y + 4, 27, 8, 'rgba(0,0,0,.35)');
  fillEllipse(x, y, 25, 9, '#a8752a');
  fillEllipse(x, y - 2, 21, 6.5, '#c99038');
  ctx.strokeStyle = 'rgba(110,70,20,.6)';
  ctx.lineWidth = 1;
  ellipse(x, y - 2, 14, 4);
  ctx.stroke();
  ellipse(x, y - 2, 7, 2);
  ctx.stroke();
}

function drawQing(x, y) {
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x - 26, y - 4, 52, 6);
  ctx.fillRect(x - 22, y + 2, 4, 14);
  ctx.fillRect(x + 18, y + 2, 4, 14);
  fillEllipse(x, y - 8, 20, 5, '#9a2418');
  const g = ctx.createLinearGradient(x - 22, 0, x + 22, 0);
  g.addColorStop(0, '#5a3a1a');
  g.addColorStop(0.45, '#c9a24a');
  g.addColorStop(1, '#4a3016');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 22, y - 30);
  ctx.bezierCurveTo(x - 22, y - 14, x - 10, y - 9, x, y - 9);
  ctx.bezierCurveTo(x + 10, y - 9, x + 22, y - 14, x + 22, y - 30);
  ctx.closePath();
  ctx.fill();
  fillEllipse(x, y - 30, 22, 5, '#3a2610');
  ctx.strokeStyle = '#e2c27a';
  ctx.lineWidth = 1.5;
  ellipse(x, y - 30, 22, 5);
  ctx.stroke();
  const t = G.clock - G.qingAt;
  if (t < 1.5) {
    ctx.strokeStyle = 'rgba(255,220,150,' + (1 - t / 1.5) * 0.6 + ')';
    ellipse(x, y - 30, 22 + t * 20, 5 + t * 5);
    ctx.stroke();
  }
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 24, y - 2);
  ctx.lineTo(x + 44, y - 14);
  ctx.stroke();
  fillEllipse(x + 45, y - 15, 4, 3.5, '#e6d2a6');
}

function drawDrum(x, y) {
  const t = G.clock - G.drumAt;
  const shake = t < 0.4 ? Math.sin(t * 60) * (0.4 - t) * 4 : 0;
  ctx.strokeStyle = '#3a2416';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 50);
  ctx.lineTo(x + 18, y);
  ctx.moveTo(x + 24, y + 50);
  ctx.lineTo(x - 18, y);
  ctx.stroke();
  ctx.save();
  ctx.translate(shake, 0);
  const g = ctx.createLinearGradient(0, y - 28, 0, y + 28);
  g.addColorStop(0, '#6e1a12');
  g.addColorStop(0.5, '#b0281c');
  g.addColorStop(1, '#5a140e');
  ctx.fillStyle = g;
  ctx.fillRect(x - 24, y - 28, 48, 56);
  fillEllipse(x - 24, y, 10, 28, '#e6d2a6');
  ctx.strokeStyle = '#9a7a4a';
  ctx.lineWidth = 1;
  ellipse(x - 24, y, 10, 28);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    fillEllipse(x - 18 + i * 8, y - 25, 1.5, 1.5, '#e2c27a');
    fillEllipse(x - 18 + i * 8, y + 25, 1.5, 1.5, '#e2c27a');
  }
  ctx.restore();
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 40);
  ctx.lineTo(x + 30, y + 22);
  ctx.stroke();
  fillEllipse(x + 31, y + 21, 3.5, 3.5, '#6b4a2e');
}

function drawPillar(x) {
  const g = ctx.createLinearGradient(x, 0, x + 34, 0);
  g.addColorStop(0, '#5a140e');
  g.addColorStop(0.45, '#b0281c');
  g.addColorStop(1, '#4a100b');
  ctx.fillStyle = g;
  ctx.fillRect(x, 40, 34, PANEL_TOP);
  [86, 104, PANEL_TOP - 56].forEach(y => {
    ctx.fillStyle = '#c9a24a';
    ctx.fillRect(x - 1, y, 36, 4);
  });
  ctx.fillStyle = '#6f675c';
  ctx.fillRect(x - 4, PANEL_TOP - 20, 42, 20);
}

/* ---------- 弹窗：供奉、祈福、天时 ---------- */
function drawOffer() {
  const w = 340;
  const h = 320;
  const x = (VW - w) / 2;
  const y = 110;
  card(x, y, w, h, '供奉');
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  text('供品摆上供桌，十分钟后撤下，可以再供', x + 24, y + 58, 12, '#6b5a48', 'left', 500);
  OFFERS.forEach((o, i) => {
    const yy = y + 76 + i * 56;
    text(o.label, x + 24, yy + 16, 17, INK, 'left', 700, SERIF);
    text(o.note, x + 24, yy + 37, 11.5, '#8a7a68', 'left', 500);
    const left = offerLeft(o.id);
    if (left > 0) button('供着 ' + clockText(left), x + w - 128, yy + 6, 104, 36, () => makeOffer(o), 'off');
    else button('供奉 +' + fmt((10 + 5 * S.fishLv) * mult()), x + w - 128, yy + 6, 104, 36, () => makeOffer(o), 'red');
  });
}

function drawWish() {
  const w = 330;
  const h = 250;
  const x = (VW - w) / 2;
  const y = 130;
  card(x, y, w, h, '祈福');
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  text('在佛前许一个心愿', x + 24, y + 58, 12.5, '#6b5a48', 'left', 500);
  WISH_CATS.forEach((c, i) => button(c, x + 24 + (i % 3) * 98, y + 80 + Math.floor(i / 3) * 56, 88, 46, () => makeWish(c), 'gold'));
  text('每类心愿每天第一次祈福有功德', x + 24, y + 210, 11.5, '#8a7a68', 'left', 500);
}

function drawBlessing() {
  const m = G.modal;
  const w = 260;
  const h = 340;
  const x = (VW - w) / 2;
  const y = 120;
  ctx.strokeStyle = '#b8322a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y - 26);
  ctx.lineTo(x + w / 2, y + 6);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  roundRect(x + 3, y + 5, w, h, 12);
  ctx.fill();
  roundRect(x, y, w, h, 12);
  ctx.fillStyle = '#a8322a';
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();
  roundRect(x + 10, y + 10, w - 20, h - 20, 8);
  ctx.lineWidth = 1;
  ctx.stroke();
  text('祈 福', x + w / 2, y + 40, 15, '#f3d27a', 'center', 700, SERIF);
  text(m.cat, x + w / 2, y + 96, 40, '#ffe6a8', 'center', 700, SERIF);
  m.line.split('，').forEach((l, i) => text(l, x + w / 2, y + 152 + i * 30, 19, '#fbecd0', 'center', 600, SERIF));
  const d = new Date();
  text(d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 · 山寺小院', x + w / 2, y + h - 98, 11.5, '#f3d27a', 'center', 500);
  if (m.v) text('功德 +' + fmt(m.v), x + w / 2, y + h - 76, 14, '#ffd77a', 'center', 700);
  button('收好', x + w / 2 - 60, y + h - 58, 120, 40, () => { G.modal = null; }, 'gold');
}

function drawView() {
  const w = 350;
  const h = 330;
  const x = (VW - w) / 2;
  const y = 110;
  card(x, y, w, h, '天时');
  button('×', x + w - 50, y + 12, 34, 32, () => { G.modal = null; }, 'ink');
  text('换个时辰和季节，看看小院不同的样子', x + 24, y + 58, 12.5, '#6b5a48', 'left', 500);
  const row = (label, yy, opts, cur, set) => {
    text(label, x + 24, yy + 17, 14, INK, 'left', 700, SERIF);
    const bw = (w - 90 - (opts.length - 1) * 5) / opts.length;
    opts.forEach(([name, val], i) => button(name, x + 66 + i * (bw + 5), yy, bw, 34, () => set(val), cur === val ? 'gold' : 'ink'));
  };
  row('时辰', y + 80, [['实时', null], ['日出', 6.6], ['白天', 11], ['日落', 17.9], ['夜晚', 22.5]], S.view.hour, v => { S.view.hour = v; writeSave(); });
  row('季节', y + 130, [['实时', null], ['春', 'spring'], ['夏', 'summer'], ['秋', 'autumn'], ['冬', 'winter']], S.view.season, v => {
    S.view.season = v;
    G.snow = seasonNow() === 'winter' ? 0.5 : 0;
    writeSave();
  });
  row('天气', y + 180, [['晴', false], [seasonNow() === 'winter' ? '下雪' : '下雨', true]], G.weather.rain, v => {
    G.weather.rain = v;
    G.weather.t = v ? 240 : 400;
  });
  text('“实时”会跟着你所在地的真实时间和季节走', x + 24, y + 236, 12, '#8a7a68', 'left', 500);
  button('好', x + w / 2 - 60, y + h - 60, 120, 42, () => { G.modal = null; }, 'red');
}

/* ---------- 输入 ---------- */
function yardTap(x, y) {
  if (y < 60 || y > PANEL_TOP) return;
  const a = hitAnimal(x, y);
  if (a) {
    openAnimal(a);
    return;
  }
  const [bx, by] = bellPos();
  if (x > bx - 70 && x < bx + 80 && y > by - 160 && y < by + 6) {
    strikeBell();
    return;
  }
  const [px, py, s] = burnerPos();
  if (Math.abs(x - px) < 60 * s * 1.5 && y > py - 110 * s * 1.5 && y < py + 6) {
    lightIncense();
    return;
  }
  if (x > 150 && x < 250 && y > BY - 120 && y < BY + 4) enterHall();
}

function hallTap(x, y) {
  if (y < 60 || y > PANEL_TOP) return;
  const { altarY } = hallLayout();
  if (Math.hypot(x - 70, y - (PANEL_TOP - 26)) < 36) {
    strikeQing();
    return;
  }
  if (Math.hypot(x - 334, y - (PANEL_TOP - 64)) < 40) {
    beatDrum();
    return;
  }
  if (x > 110 && x < 290 && y < altarY - 70) {
    startBow();
    return;
  }
  if (x > 54 && x < 346 && y > altarY - 70 && y < altarY + 86) G.modal = { type: 'offer' };
}

function press(x, y) {
  audio();
  if (G.ad) {
    if (G.ad.rewarded) closeAd(false);
    return;
  }
  for (let i = G.buttons.length - 1; i >= 0; i--) {
    const b = G.buttons[i];
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      b.onTap();
      return;
    }
  }
  const m = G.modal;
  if (m) {
    if (m.type === 'animal' && y < G.sheetTop) {
      G.modal = null;
      if (G.scene === 'yard') yardTap(x, y);
    }
    return;
  }
  if (G.sutra || G.trans) return;
  if (G.scene === 'hall') hallTap(x, y);
  else yardTap(x, y);
}

window.addEventListener('pointerdown', e => {
  e.preventDefault();
  press((e.clientX - offX) / scale, (e.clientY - offY) / scale);
}, { passive: false });

window.addEventListener('keydown', e => {
  if (e.key === 'm' || e.key === 'M') setMuted(!muted);
  if ((e.key === ' ' || e.key === 'Enter') && !G.modal && !G.ad) {
    e.preventDefault();
    audio();
    knock('tap');
  }
  if (e.key === 'Escape') {
    if (G.modal && G.modal.type !== 'intro') G.modal = null;
    else if (G.sutra) closeSutra();
  }
});

window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    writeSave();
    stopSpeech();
  } else {
    catchUp();
    last = 0;
  }
});
window.addEventListener('pagehide', writeSave);

/* ---------- 启动 ---------- */
resize();
catchUp();
if (!S.seenIntro) G.modal = { type: 'intro' };

let last = 0;
function loop(t) {
  const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
  last = t;
  if (!document.hidden) {
    step(dt);
    draw();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
