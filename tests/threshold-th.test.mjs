// 泰国上座部佛教包（菩提静院）测试：node --test tests/threshold-th.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'threshold');
const PACK_DIR = path.join(ROOT, 'traditions', 'buddhism.theravada.th');
const FILES = [
  path.join(ROOT, 'core', 'calendar.js'),
  path.join(PACK_DIR, 'pack.js'),
  path.join(PACK_DIR, 'content.js'),
  path.join(PACK_DIR, 'game', 'i18n.js'),
  path.join(PACK_DIR, 'game', 'scene.js'),
  path.join(PACK_DIR, 'game', 'game.js'),
];
const GAME_SRC = fs.readFileSync(path.join(PACK_DIR, 'game', 'game.js'), 'utf8');

function storage(init = {}) {
  const data = Object.assign({}, init);
  return { data, getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, removeItem: k => { delete data[k]; } };
}

function canvasCtx() {
  const gradient = { addColorStop() {} };
  const st = {};
  return new Proxy(st, {
    get(t, k) {
      if (k in t) return t[k];
      return (...a) => {
        a.forEach((v, i) => { if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(String(k) + ' arg ' + i + ' ' + v); });
        if (k === 'ellipse' && (a[2] < 0 || a[3] < 0)) throw new Error('negative ellipse');
        if (k === 'arc' && a[2] < 0) throw new Error('negative arc');
        if (k === 'createLinearGradient' || k === 'createRadialGradient') return gradient;
        return undefined;
      };
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

/* 本地时间的某一刻（测试按本机时区，和游戏一样用 getHours）。 */
const at = (y, mo, d, h, mi = 0) => new Date(y, mo - 1, d, h, mi).getTime();

function boot({ store = storage(), hash = '', t = at(2026, 11, 10, 13, 0) } = {}) {
  const clock = { t };
  const ctx = { console, Intl, JSON, Math, Date, Object, Array, String, Number, Set, setTimeout, clearTimeout, encodeURIComponent, decodeURIComponent };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of FILES) vm.runInContext(fs.readFileSync(f, 'utf8') + (f.endsWith('game.js') ? '\n;globalThis.__TH = TH; globalThis.__MSG = TH_MSG; globalThis.__Scene = Scene;' : ''), ctx, { filename: f });
  const TH = ctx.__TH;
  const res = TH.logic.start({ storage: store, hash, now: () => clock.t });
  return { TH, L: TH.logic, S: () => TH.S, clock, store, ctx, res };
}

const run = (b, sec) => { for (let i = 0; i < sec * 10; i++) { b.clock.t += 100; b.L.step(0.1); } };

test('三种语言的文案 key 一致；代码里用到的 key 都有', () => {
  const { ctx } = boot();
  const M = ctx.__MSG;
  const zh = Object.keys(M['zh-CN']).sort();
  assert.deepEqual(Object.keys(M.en).sort(), zh);
  assert.deepEqual(Object.keys(M.th).sort(), zh);
  const used = new Set([...GAME_SRC.matchAll(/tt\('([a-zA-Z.\-]+)'\s*[,)]/g)].map(m => m[1]));
  const dynamic = [
    ...['hot', 'rain', 'cool'].map(k => 'season.' + k),
    ...['dawn', 'morning', 'afternoon', 'evening', 'night'].map(k => 'time.' + k),
    ...['krap', 'offer', 'chant', 'alms', 'sweep', 'care'].map(k => 'bar.' + k),
    ...[1, 2, 3].map(k => 'krap.step.' + k),
    ...['lotus', 'marigold', 'jasmine', 'candle', 'incense'].map(k => 'offer.' + k),
    ...['pi-Thai', 'pi-Latn', 'pi-both'].map(k => 'script.' + k),
    ...['none', 'th', 'en', 'zh-CN'].map(k => 'tr.' + k),
    ...['namo', 'tisarana', 'pancasila', 'itipiso', 'metta'].map(k => 'usage.' + k),
    'kind.dog', 'kind.cat', 'food.dogfood', 'food.catfood', 'inj.leg', 'inj.skin', 'inj.eye',
    ...['flower', 'teacher', 'boat', 'postman'].map(k => 'family.' + k),
    ...['krap', 'offer', 'chant', 'alms', 'sweep', 'adopted'].map(k => 'journal.' + k),
    ...['dogfood', 'catfood', 'med', 'broom'].map(k => 'shop.' + k),
    ...['makha', 'visakha', 'asalha', 'khaoPhansa', 'okPhansa', 'wanPhra'].map(k => 'obs.th.' + k),
    'care.healed', 'care.arrive', 'care.arriveInjured', 'care.adopted', 'alms.pourDone',
  ];
  for (const k of [...used, ...dynamic]) assert.ok(M['zh-CN'][k] != null, '缺 ' + k);
});

test('新开局：有米、有叶堆；扫两下得米，扫帚升级后每堆多得', () => {
  const b = boot();
  const S = b.S();
  assert.equal(S.rice, 12);
  assert.ok(S.piles.length >= 2);
  const id = S.piles[0].id;
  assert.equal(b.L.sweep(id).key, 'sweep.half');
  const r = b.L.sweep(id);
  assert.equal(r.key, 'sweep.got');
  assert.equal(S.rice, 14);
  assert.equal(S.log.sweep, 1);
  S.rice = 100;
  assert.equal(b.L.buy('broom').key, 'shop.bought');
  assert.equal(S.broom, 2);
  b.L.addPile();
  const p = S.piles[S.piles.length - 1].id;
  b.L.sweep(p);
  b.L.sweep(p);
  assert.equal(S.rice, 100 - 30 + 3);
  S.piles = [];
  assert.equal(b.L.sweep(null).key, 'sweep.none');
});

test('修行只记录：礼佛三拜、供花烛香、诵完五段都不产出也不花米', () => {
  const b = boot();
  const S = b.S();
  const rice = S.rice;
  for (let i = 0; i < 3; i++) b.L.krapStep();
  assert.equal(S.log.krap, 1);
  b.L.offer('flower', 'jasmine');
  b.L.offer('candle');
  b.L.offer('incense');
  assert.equal(S.log.offer, 3);
  const m = b.L.model();
  assert.equal(m.offerings.flower, 'jasmine');
  assert.ok(m.offerings.candle && m.offerings.incense);
  for (const k of ['namo', 'tisarana', 'pancasila', 'itipiso', 'metta']) b.L.chantDone(k);
  assert.equal(S.log.chant, 5);
  assert.equal(S.rice, rice, '修行不改变米');
  assert.ok(S.journal.length >= 9);
  b.clock.t += 21 * 60000;
  assert.equal(b.L.model().offerings.candle, false, '蜡烛 20 分钟后熄灭');
});

test('布施只在清晨 6–8 点；僧人停下时放一勺饭用 1 份米；一天只记一次；演示不花米也不记', () => {
  const noon = boot({ t: at(2026, 11, 10, 13) });
  assert.equal(noon.L.startAlms(false).key, 'alms.closed');
  const demo = noon.L.startAlms(true);
  assert.equal(demo.key, 'alms.waiting');
  const rice0 = noon.S().rice;
  for (let k = 0; k < 400 && noon.TH.G.alms; k++) {
    noon.clock.t += 100;
    noon.L.step(0.1);
    if (noon.L.currentMonk()) noon.L.giveAlms();
  }
  assert.equal(noon.TH.G.alms, null, '演示结束');
  assert.equal(noon.S().rice, rice0, '演示不花米');
  assert.equal(noon.S().log.alms, 0, '演示不记');

  const b = boot({ t: at(2026, 11, 10, 6, 30) });
  assert.equal(b.L.hint().key, 'hint.alms');
  assert.equal(b.L.startAlms(false).key, 'alms.waiting');
  let gave = 0;
  for (let k = 0; k < 400 && b.TH.G.alms; k++) {
    b.clock.t += 100;
    b.L.step(0.1);
    if (b.L.currentMonk() && gave < 2) { b.L.giveAlms(); gave++; }
  }
  assert.equal(b.S().rice, 12 - 2);
  assert.equal(b.S().log.alms, 1);
  assert.equal(b.S().almsGiven, 2);
  assert.ok(b.L.almsDoneToday(new Date(b.clock.t)));
  assert.equal(b.L.startAlms(false).key, 'alms.done', '同一天不再重复记');
  b.S().rice = 0;
  b.clock.t = at(2026, 11, 11, 6, 10);
  b.L.startAlms(false);
  for (let k = 0; k < 200 && !b.L.currentMonk(); k++) b.L.step(0.1);
  assert.equal(b.L.giveAlms().key, 'alms.noRice');
});

test('照顾动物：没粮、怕人、没药都有提示；上药一分钟后伤好；起名；健康亲人后送养得米', () => {
  const b = boot();
  const S = b.S();
  S.inv.dogfood = 0;
  const a = b.L.spawnAnimal('dog', true);
  a.hunger = 30;
  assert.equal(b.L.feed(a.id).key, 'care.noFood');
  S.rice = 100;
  b.L.buy('dogfood');
  assert.equal(b.L.feed(a.id).key, 'care.fed');
  assert.ok(a.hunger >= 75);
  a.trust = 10;
  assert.equal(b.L.pet(a.id).key, 'care.shy');
  assert.equal(b.L.treat(a.id).key, 'care.noMed');
  b.L.buy('med');
  assert.equal(b.L.treat(a.id).key, 'care.treated');
  b.TH.G.events = [];
  run(b, 61);
  assert.equal(a.injured, null, '伤好了');
  assert.ok(b.TH.G.events.some(e => e.key === 'care.healed'));
  assert.equal(b.L.giveName(a.id, ['ด่าง', 'Dang']), null, '还不亲近时不能起名');
  a.trust = 50;
  const opts = b.L.nameOptions(a);
  assert.ok(opts.length >= 3);
  assert.equal(b.L.giveName(a.id, opts[0]).key, 'care.named');
  assert.equal(b.L.adopt(a.id).key, 'care.adoptNot');
  a.trust = 90; a.health = 95; a.hunger = 90;
  const before = S.rice;
  const r = b.L.adopt(a.id);
  assert.equal(r.key, 'care.adopted');
  assert.equal(S.rice, before + 15);
  assert.equal(S.log.adopted, 1);
  assert.ok(!S.animals.includes(a));
});

test('动物会自己来，最多 4 只；离线 3 小时叶子落满、动物饿了但不会饿死', () => {
  const b = boot();
  const S = b.S();
  run(b, 20);
  assert.ok(S.animals.length >= 1, '15 秒后来第一只');
  for (let i = 0; i < 6; i++) b.L.spawnAnimal();
  assert.equal(S.animals.length, 4);
  b.L.save();
  const store = b.store;
  const later = boot({ store, t: b.clock.t + 3 * 3600 * 1000 });
  assert.ok(later.res.away >= 2.9);
  assert.equal(later.S().piles.length, 6);
  assert.ok(later.S().animals.every(a => a.hunger >= 10));
});

test('平台选择带进来；游戏里改了写回平台；平台存档不存在时不新建', () => {
  const plat = { ver: 1, prefs: { 'buddhism.theravada.th': { ui: 'en', content: 'pi-both', translation: 'zh-CN', voice: 'sys.th' } }, display: { motion: 'reduce' } };
  const store = storage({ 'threshold-save-v1': JSON.stringify(plat) });
  const b = boot({ store, hash: '#tr=th' });
  const S = b.S();
  assert.equal(S.opt.ui, 'en');
  assert.equal(S.opt.content, 'pi-both');
  assert.equal(S.opt.translation, 'th', '地址栏优先');
  assert.equal(b.L.model().reduceMotion, true, '平台的减少动效');
  assert.equal(b.TH.tt('bar.alms'), 'Alms');
  b.L.setLang('th');
  b.L.syncPlatform();
  assert.equal(JSON.parse(store.data['threshold-save-v1']).prefs['buddhism.theravada.th'].ui, 'th');
  assert.equal(b.TH.tt('bar.alms'), 'ตักบาตร');
  const empty = storage();
  boot({ store: empty }).L.syncPlatform();
  assert.equal(empty.data['threshold-save-v1'], undefined);
});

test('存档：坏了用备份；都坏了重新开始；不认识的动物被丢掉', () => {
  const good = boot();
  good.S().rice = 77;
  good.S().animals.push({ kind: 'dragon' });
  good.L.save();
  good.L.save();
  const s1 = storage({ 'threshold-th-save-v1': '{bad', 'threshold-th-save-v1.bak': good.store.data['threshold-th-save-v1'] });
  const r = boot({ store: s1 });
  assert.equal(r.res.note, 'restored');
  assert.equal(r.S().rice, 77);
  assert.ok(r.S().animals.every(a => a.kind === 'dog' || a.kind === 'cat'));
  const s2 = storage({ 'threshold-th-save-v1': '{bad', 'threshold-th-save-v1.bak': 'nope' });
  assert.equal(boot({ store: s2 }).S().rice, 12);
});

test('没有广告、没有放生；节历按真实日期给出雨安居和佛日', () => {
  assert.ok(!/ad-kit|AdKit|showAd|watchSupport/.test(GAME_SRC), '菩提静院里没有广告');
  assert.ok(!/release|放生|ปล่อย/.test(GAME_SRC.replace(/\/\*[\s\S]*?\*\//g, '')), '没有放生玩法');
  const b = boot({ t: at(2027, 8, 1, 10) });
  assert.ok(b.L.phansaRange(new Date(b.clock.t)), '2027 年 8 月在雨安居里');
  assert.equal(b.L.seasonOf(new Date(b.clock.t)), 'rain');
  assert.equal(b.L.seasonOf(new Date(at(2027, 4, 1, 10))), 'hot');
  assert.equal(b.L.seasonOf(new Date(at(2027, 12, 1, 10))), 'cool');
});

test('场景在一天 24 小时、三个季节、下雨和托钵时都能画，不出现非法数值', () => {
  const b = boot();
  const cv = { width: 0, height: 0, getContext: () => canvasCtx(), getBoundingClientRect: () => ({ width: 390, height: 600 }) };
  b.ctx.__Scene.init(cv);
  b.L.spawnAnimal('dog', true);
  b.L.spawnAnimal('cat', false);
  b.L.startAlms(true);
  run(b, 6);
  const base = b.L.model();
  for (let h = 0; h < 24; h += 0.5) {
    for (const season of ['hot', 'rain', 'cool']) {
      b.ctx.__Scene.draw(Object.assign({}, base, { hour: h, season, rain: h % 3 === 0 ? 0.8 : 0, wet: 0.5, moonAge: h * 1.2 }), h);
    }
  }
  assert.ok(b.ctx.__Scene.hit(-100, -100, base) === null);
});
