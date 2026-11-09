// 汉传佛教包（平台第二阶段）测试：node --test tests/threshold-han.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'threshold', 'traditions', 'buddhism.han', 'game');
const LIBS = fs.readFileSync(path.join(DIR, 'ad-kit.js'), 'utf8') + '\n' + fs.readFileSync(path.join(DIR, 'i18n-en.js'), 'utf8');
const GAME = fs.readFileSync(path.join(DIR, 'game.js'), 'utf8') +
  '\n;globalThis.__t = { G, get S() { return S; }, get loadNotice() { return loadNotice; }, step, draw, knock, startBow, lightIncense, strikeBell,' +
  ' makeOffer, OFFERS, makeWish, strikeQing, beatDrum, chooseSutra, closeSutra, sutraById, buyGood, GOODS, upgradeTool, hireMonk, toolCost,' +
  ' spawnPile, sweepPile, pileYield, watchSupport, supportReward, writeSave, catchUp, adopt, enterHall, exitHall, spend,' +
  ' L, fmt, wrap, get UI_LANG() { return UI_LANG; }, L_MISSING, spawnStray, feed, pet, treat, openAnimal, openNaming, giveName, showChores,' +
  ' selectVoiceProfile, SUTRAS, WISH_CATS, toggleAutoSutra };';

function makeCtx() {
  const gradient = { addColorStop() {} };
  const st = { font: '10px x' };
  return new Proxy(st, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'measureText') return s => ({ width: String(s).length * 10 });
      return (...a) => {
        a.forEach((v, i) => { if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(String(k) + ' arg ' + i + ' ' + v); });
        if (k === 'ellipse' && (a[2] < 0 || a[3] < 0)) throw new Error('negative ellipse');
        if (k === 'createLinearGradient' || k === 'createRadialGradient') return gradient;
        return undefined;
      };
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

function storage(init = {}) {
  const data = Object.assign({}, init);
  return { data, getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, removeItem: k => { delete data[k]; } };
}

function boot({ store = storage(), hash = '', now = 1_800_000_000_000, clock = { t: now } } = {}) {
  const noop = () => {};
  class FakeDate extends Date { constructor(...a) { super(...(a.length ? a : [clock.t])); } static now() { return clock.t; } }
  const el = { getContext: () => makeCtx(), width: 0, height: 0, textContent: '', setAttribute: noop };
  const ctx = {
    document: { getElementById: () => el, addEventListener: noop, hidden: false },
    localStorage: store, location: { hash, href: '' }, navigator: {},
    requestAnimationFrame: noop, innerWidth: 390, innerHeight: 844, devicePixelRatio: 2, addEventListener: noop,
    matchMedia: () => ({ matches: false }), setTimeout, clearTimeout, console, Date: FakeDate, Math, JSON, Object, Promise, Array,
  };
  ctx.window = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(LIBS, ctx);
  vm.runInContext(GAME, ctx);
  return { T: ctx.__t, ctx, store };
}

const run = (T, sec) => { for (let i = 0, n = Math.round(sec * 60); i < n; i++) { T.step(1 / 60); if (i % 20 === 0) T.draw(); } };
const LEGACY = 'temple-yard-save-v1';

test('旧山寺小院存档：功德 1:1 折成存粮，木鱼等级折成工具等级；旧键不被写入', () => {
  const legacy = JSON.stringify({ ver: 3, seenIntro: true, tut: 9, merit: 777, fishLv: 4, knocks: 1200, sutras: 2, animals: [], adopted: [], inv: { catfood: 2 } });
  const store = storage({ [LEGACY]: legacy });
  const { T } = boot({ store });
  assert.equal(T.S.stores, 777);
  assert.equal(T.S.toolLv, 4);
  assert.equal(T.S.merit, 0);
  assert.equal(T.S.knocks, 1200, '修行簿保留');
  assert.match(T.loadNotice, /功德折成了存粮/);
  T.writeSave();
  assert.equal(store.data[LEGACY], legacy, '旧存档原样保留，可回退');
  assert.ok(store.data['threshold-han-save-v1']);
  const again = boot({ store });
  assert.equal(again.T.S.stores, 777, '第二次读自己的存档，不重复折算');
  assert.equal(again.T.loadNotice, '');
});

test('修行只记录：木鱼、上香、礼佛、撞钟、供奉、祈福、磬鼓、诵完整部经都不产出存粮', async () => {
  const { T } = boot();
  T.S.seenIntro = true; T.S.tut = 9; T.G.modal = null; T.S.stores = 50;
  T.G.piles = []; T.G.pileT = 1e9;
  for (let i = 0; i < 20; i++) T.knock('tap');
  assert.equal(T.S.knocks, 20);
  T.lightIncense(); T.strikeBell();
  T.enterHall(); run(T, 1);
  T.startBow(); run(T, 6);
  assert.equal(T.S.bows, 1);
  for (const o of T.OFFERS) T.makeOffer(o);
  T.makeWish('平安'); T.G.modal = null;
  T.strikeQing(); T.beatDrum();
  const su = T.sutraById('wangsheng');
  T.chooseSutra(su.id);
  for (let i = 0; i < su.chars.length; i++) T.knock('tap');
  T.closeSutra();
  assert.equal(T.S.sutras, 1);
  assert.equal(T.S.stores, 50, '存粮没有变化');
});

test('出坡：扫一堆得两次存粮，堆会被扫掉；院子会长出新的堆，最多 5 堆', () => {
  const { T } = boot();
  T.S.seenIntro = true; T.S.tut = 9; T.G.modal = null;
  run(T, 40);
  assert.equal(T.G.piles.length, 5);
  const p = T.G.piles[0];
  const before = T.S.stores;
  T.sweepPile(p); T.sweepPile(p);
  assert.equal(T.S.stores - before, 2 * T.pileYield());
  assert.ok(!T.G.piles.includes(p));
  assert.equal(T.S.chores, 2);
  T.draw();
});

test('小沙弥帮忙扫地会产出存粮；离线也照常', () => {
  const { T, store } = boot();
  T.S.seenIntro = true; T.S.tut = 9; T.G.modal = null; T.S.monk = 2;
  const s0 = T.S.stores;
  run(T, 30);
  assert.ok(T.S.stores - s0 >= 9, '30 秒两位小沙弥约 10 份');
  T.writeSave();
  const later = boot({ store, now: 1_800_000_000_000 + 3600 * 1000 });
  assert.ok(later.T.S.stores > T.S.stores + 1000, '离线一小时');
});

test('商店用存粮；不够时不扣；升级扫帚提高每扫产出', () => {
  const { T } = boot();
  T.S.seenIntro = true; T.S.tut = 9;
  T.S.stores = 10;
  const med = T.GOODS.find(g => g.id === 'med');
  const inv = T.S.inv.med;
  T.buyGood(med);
  assert.equal(T.S.inv.med, inv);
  assert.equal(T.S.stores, 10);
  T.S.stores = 1000;
  const y0 = T.pileYield();
  T.upgradeTool();
  assert.equal(T.pileYield(), y0 + 1);
  assert.equal(T.S.stores, 1000 - T.toolCost(1));
});

test('支持我们：开局 3 分钟内不出现；之后看完得存粮', async () => {
  const clock = { t: 1_800_000_000_000 };
  const { T } = boot({ clock });
  T.S.seenIntro = true; T.S.tut = 9;
  const s0 = T.S.stores;
  await T.watchSupport();
  assert.equal(T.S.stores, s0, '3 分钟内拿不到');
  clock.t += 181 * 1000;
  const p = T.watchSupport();
  run(T, 4);
  await p;
  assert.equal(T.S.stores - s0, T.supportReward());
});

test('平台选择：存档里的声线和地址栏里的参考录音都能带进游戏', () => {
  const plat = JSON.stringify({ ver: 1, prefs: { 'buddhism.han': { ui: 'zh-CN', content: 'lzh', translation: 'none', voice: 'sys.solemn' } } });
  const a = boot({ store: storage({ 'threshold-save-v1': plat }) });
  assert.equal(a.T.S.opt.voiceProfile, 'solemn');
  assert.ok(!a.T.S.opt.reference);
  const b = boot({ store: storage({ 'threshold-save-v1': plat }), hash: '#v=buddhism.han&voice=ref.cc0.xinjing' });
  assert.equal(b.T.S.opt.reference, true, '地址栏优先');
});

test('送养时领养人留下存粮作谢礼', () => {
  const { T } = boot();
  T.S.seenIntro = true; T.S.tut = 9;
  const a = { id: 9, kind: 'orange', name: '橘子', wx: 0.3, d: 0.6, tx: 0.3, td: 0.6, dir: 1, state: 'sit', t: 5, phase: 0, hop: 0, hunger: 90, health: 100, trust: 95, injured: '', treated: false, petAt: -99, waterAt: -99, bowl: '', blink: 2 };
  T.S.animals.push(a);
  const s0 = T.S.stores;
  T.adopt(a);
  assert.ok(T.S.stores > s0);
  T.draw();
});

test('经济节奏：只靠扫院子，10 分钟内能买得起药和两袋猫粮', () => {
  const { T } = boot();
  T.S.seenIntro = true; T.S.tut = 9; T.G.modal = null;
  let firstMed = null;
  for (let sec = 0; sec < 600; sec++) {
    for (let f = 0; f < 60; f++) T.step(1 / 60);
    if (T.G.piles.length) T.sweepPile(T.G.piles[0]);
    if (firstMed == null && T.S.stores >= T.GOODS.find(g => g.id === 'med').cost) firstMed = sec;
  }
  console.log('# 10 分钟扫地：存粮', T.S.stores, '，第一次买得起药在第', firstMed, '秒');
  assert.ok(firstMed != null && firstMed < 180, 'first med at ' + firstMed);
  assert.ok(T.S.stores >= 60 + 80, 'stores ' + T.S.stores);
});


test('English：平台选 en 后整套界面走一遍，没有漏翻的中文', async () => {
  const plat = JSON.stringify({ ver: 1, prefs: { 'buddhism.han': { ui: 'en', content: 'lzh', translation: 'none', voice: 'sys.clear' } } });
  const { T } = boot({ store: storage({ 'threshold-save-v1': plat }) });
  assert.equal(T.UI_LANG, 'en');
  T.draw();
  const S = T.S;
  const G = T.G;
  S.seenIntro = true; S.tut = 1; G.modal = null;
  for (let i = 0; i < 6; i++) T.knock('tap');
  run(T, 3);
  S.tut = 9;
  for (const kind of ['orange', 'tabby', 'sparrow', 'yellowdog']) {
    S.kennel = 99;
    const a = T.spawnStray(kind, true);
    run(T, 2);
    T.openAnimal(a); T.draw();
    for (const f of ['catfood', 'dogfood', 'millet', 'bun', 'milk', 'water']) { a.hunger = 30; T.feed(a, f); run(T, 1); }
    a.trust = 5; T.openAnimal(a); T.pet(a); run(T, 1);
    a.trust = 60; T.openAnimal(a); T.pet(a); run(T, 1);
    S.inv.med = 2; T.treat(a); run(T, 1);
    a.name = ''; T.openNaming(a); T.draw(); T.giveName(a, G.modal.opts[0]); run(T, 1);
    a.trust = 95; a.health = 100; a.injured = ''; a.treated = false; a.hunger = 90;
    T.openAnimal(a); T.draw(); T.adopt(a); T.draw(); G.modal = null; run(T, 1);
  }
  for (const t of ['shop', 'book', 'view', 'audio', 'sutras', 'offer', 'wish']) { G.modal = { type: t }; T.draw(); }
  G.modal = null;
  T.showChores(); run(T, 1);
  T.lightIncense(); T.strikeBell(); T.enterHall(); run(T, 1);
  T.startBow(); run(T, 6);
  for (const o of T.OFFERS) T.makeOffer(o);
  for (const c of T.WISH_CATS) { T.makeWish(c); T.draw(); }
  G.modal = null; T.exitHall(); run(T, 1);
  for (const su of T.SUTRAS) {
    T.chooseSutra(su.id); T.draw();
    for (let i = 0; i < su.chars.length; i++) { T.knock('tap'); if (i % 30 === 0) T.draw(); }
    T.draw(); T.closeSutra();
  }
  run(T, 4);
  assert.deepEqual([...T.L_MISSING], [], '漏翻：' + [...T.L_MISSING].join(' | '));
  assert.equal(T.L('山门外来了一只受伤的橘猫，点它看看'), 'A hurt orange cat has come to the gate. Tap it');
  assert.equal(T.fmt(123456), '123.5k');
  const lines = T.wrap('Stray cats, dogs and injured birds often come to the gate and need care', 120, 14);
  assert.ok(lines.length > 1 && lines.every(l => !/^\s|\s$/.test(l)), '按词断行');
});

test('中文模式不受英文词表影响', () => {
  const { T } = boot();
  assert.equal(T.UI_LANG, 'zh-CN');
  assert.equal(T.L('商店'), '商店');
  assert.equal(T.fmt(123456), '12.3万');
});

test('游戏里改声线会写回平台存档；平台存档不存在时不新建', () => {
  const plat = JSON.stringify({ ver: 1, prefs: { 'buddhism.han': { ui: 'zh-CN', content: 'lzh', translation: 'none', voice: 'sys.clear' } } });
  const store = storage({ 'threshold-save-v1': plat });
  const { T } = boot({ store });
  T.selectVoiceProfile('hall');
  assert.equal(JSON.parse(store.data['threshold-save-v1']).prefs['buddhism.han'].voice, 'sys.hall');
  assert.ok(store.data['threshold-save-v1.bak']);
  const empty = storage();
  boot({ store: empty }).T.selectVoiceProfile('solemn');
  assert.equal(empty.data['threshold-save-v1'], undefined);
});
