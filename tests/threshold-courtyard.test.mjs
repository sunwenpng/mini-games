/*
 * 庭院引擎与十二个新传统包的测试。每个包在独立的 vm 里加载（引擎是单例），用假时钟和假存储。
 * 运行：node --test tests/threshold-courtyard.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'threshold');
const PACKS = ['buddhism.tibetan', 'buddhism.japan', 'buddhism.india.navayana', 'hinduism.ghat', 'sikhism.gurdwara', 'daoism.mountain',
  'shinto.shrine', 'christianity.catholic', 'christianity.orthodox', 'christianity.protestant', 'islam.mosque', 'judaism.shabbat'];

function storage() {
  const data = {};
  return { data, getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, removeItem: k => { delete data[k]; } };
}

function load(id) {
  const ctx = { console, Intl, JSON, Math, Object, Array, String, Number, Date, Set, Map, Promise, setTimeout, clearTimeout };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const files = ['core/calendar.js', 'data/registry.js', 'core/rights.js', `traditions/${id}/pack.js`, `traditions/${id}/content.js`,
    'core/courtyard/i18n.js', 'core/courtyard/kit.js', 'core/courtyard/engine.js', `traditions/${id}/game.js`];
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  vm.runInContext('globalThis.C = Courtyard; globalThis.K = CourtyardKit;', ctx);
  return ctx;
}

function stubCtx(bad) {
  const check = args => args.forEach(a => { if (typeof a === 'number' && !Number.isFinite(a)) bad.push(a); });
  const grad = { addColorStop() {} };
  return new Proxy({}, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return (...a) => { check(a); return grad; };
      return (...a) => { check(a); };
    },
    set(target, prop, v) { target[prop] = v; return true; },
  });
}

const at = (iso, tz) => Date.parse(iso + (tz || 'Z'));

for (const id of PACKS) {
  test(`${id}：内容、文案、玩法循环、节历、场景`, () => {
    const c = load(id);
    const { C, K } = c;
    const T = c.Threshold;
    const pack = T.PACKS[id];
    assert.ok(pack && pack.status === 'preview', '内测预览');
    assert.equal(pack.entry, 'play.html?p=' + id);

    /* 内容记录 */
    const recs = T.CONTENT[id];
    assert.ok(recs.length >= 2, '至少两段内容');
    assert.equal(JSON.stringify(T.Rights.checkContent(recs)), '[]', '内容字段齐全');
    for (const r of recs) {
      const n = r.text.orig.length;
      if (r.text.latn) assert.equal(r.text.latn.length, n, r.key + ' 转写行数');
      for (const tr of Object.keys(r.translations || {})) assert.equal(r.translations[tr].length, n, r.key + ' 译文 ' + tr);
      assert.equal(r.reviewStatus, 'draft');
      if (r.audio) assert.ok(T.VOICES[r.audio] && T.VOICES[r.audio].file, r.key + ' 录音');
    }
    assert.equal(JSON.stringify(T.Rights.checkPackVoices(pack)), '[]', '可选声音的权利链齐全');
    for (const v of Object.values(T.VOICES)) if (v.kind === 'reference') assert.ok(fs.existsSync(path.join(ROOT, v.file)), '录音文件存在：' + v.file);

    /* 玩法循环 */
    const store = storage();
    let now = at('2026-11-10T09:00:00', '+00:00');
    C.env.rand = (() => { let s = 7; return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); })();
    const r0 = C.start(store, now, '#ui=en');
    C.env.now = () => now;
    assert.equal(C.lang, 'en');
    const S = C.state;
    const rest = C.restNow();
    const before = S.res;
    const p = S.piles[0];
    C.sweep(p.id); C.sweep(p.id);
    if (rest) assert.equal(S.res, before, '休息日不干活');
    else assert.ok(S.res > before, '干活得资源');
    S.res = 200;
    for (const pr of C.def.practices) {
      if (pr.kind === 'offer') { assert.ok(C.offer(pr.id, pr.items[0])); assert.equal(C.offer(pr.id, pr.items[0]), false, '同一天不重复'); }
      else if (pr.kind === 'read') { C.readDone(recs[0].key); }
      else if (!pr.window) assert.ok(C.practiceDone(pr.id), pr.id);
    }
    assert.equal(S.res, 200, '功课不产出也不消耗资源');
    const care = C.def.care;
    if (care.mode === 'animals') {
      if (!rest) for (const it of C.shopItems().filter(x => x !== 'tool')) assert.ok(C.buy(it), '买 ' + it);
      S.inv.med = 9;
      for (const k of care.kinds) {
        const a = C.spawnAnimal(k, true);
        if (!a) continue;
        C.feed(a.id); C.water(a.id); C.treat(a.id);
        now += 21 * 60000; C.step(0.1);
        if (k === 'dog' || k === 'cat') { a.trust = 0.9; a.full = 0.9; C.giveName(a.id, C.nameOptions(a)[0]); assert.ok(C.adopt(a.id), '送养 ' + k); }
      }
    } else {
      const g = C.spawnGuest();
      assert.ok(g, '来客');
      assert.ok(C.serve(g.id), '招待');
      assert.equal(S.log.served, 1);
    }
    assert.ok(C.save());
    assert.ok(store.data[C.def.saveKey], '写入存档');

    /* 文案：两种界面语言都不缺 key */
    for (const lang of ['zh-CN', 'en']) {
      C.setLang(lang);
      const keys = ['app.title', 'app.label', 'intro.body', 'intro.how', 'res.name', 'chore.label', 'chore.pile'];
      for (const pr of C.def.practices) {
        keys.push('prac.' + pr.id + '.bar', 'prac.' + pr.id + '.title');
        if (pr.kind === 'steps') { for (let i = 1; i <= pr.steps; i++) keys.push('prac.' + pr.id + '.step.' + i); keys.push('prac.' + pr.id + '.btn', 'prac.' + pr.id + '.done'); }
        if (pr.kind === 'offer') pr.items.forEach(it => keys.push('offer.' + it));
        if (pr.kind === 'count') keys.push('prac.' + pr.id + '.mantra');
        if (pr.kind === 'learn') pr.cards.forEach(cd => keys.push('learn.' + cd + '.title', 'learn.' + cd + '.body'));
        if (pr.window) keys.push('hint.window.' + pr.id);
      }
      pack.options.content.forEach(o => keys.push('opt.content.' + o.id));
      pack.options.voice.filter(o => o.state !== 'off').forEach(o => keys.push('voice.' + o.id));
      (pack.notice || []).forEach(k => keys.push(k));
      keys.push(pack.previewBody, pack.calendar.note);
      for (const k of keys) assert.ok(C.has(k), lang + ' 缺 ' + k);
      C.tt(C.hint().key, C.hint().p);
    }
    assert.deepEqual([...C.env.missing], [], '运行中没有缺失的文案');

    /* 节历：一整年都能算，节日都有名字 */
    const names = new Set();
    for (let d = 0; d < 400; d++) T.Calendar.observancesOn(pack.calendar, new Date(Date.UTC(2026, 10, 10) + d * 86400000)).forEach(o => names.add(o.id));
    assert.ok(names.size >= 3, '一年里至少三个节日：' + [...names].join(','));
    for (const n of names) assert.ok(C.has(n), '节日名 ' + n);

    /* 场景：24 小时 × 四个季节 × 下雨，绘制不出非法数值 */
    const bad = [];
    const g = stubCtx(bad);
    for (const mo of [1, 4, 7, 10]) for (let hh = 0; hh < 24; hh += 3) {
      now = Date.UTC(2027, mo - 1, 14, hh);
      const m = C.model(); m.t = hh; m.rain = hh % 6 ? 0 : 0.8;
      K.hits = [];
      K.sky(g, 375, 600, m, 600 * (C.def.horizon || 0.5));
      (C.def.scene.back || C.def.scene)(g, 375, 600, m, K, hh);
      m.piles.forEach(pl => K.pile(g, pl, 375, 600, typeof C.def.chore.pile === 'function' ? C.def.chore.pile(m) : C.def.chore.pile, m));
      m.animals.forEach(a => K.animal(g, a, 375, 600, hh, m));
      m.guests.forEach(gg => K.guest(g, gg, 375, 600, hh));
      K.weather(g, 375, 600, m, hh); K.dim(g, 375, 600, m);
      if (C.def.scene.lights) C.def.scene.lights(g, 375, 600, m, K, hh);
    }
    assert.deepEqual(bad, [], '没有 NaN / Infinity');
    assert.ok(r0, '启动结果');
  });
}

test('节历引擎：复活节、东正教复活节、伊斯兰历、希伯来历', () => {
  const c = load('christianity.catholic');
  const Cal = c.Threshold.Calendar;
  assert.equal(Cal.easter(2026), '2026-04-05');
  assert.equal(Cal.easter(2027), '2027-03-28');
  assert.equal(Cal.pascha(2026), '2026-04-12');
  assert.equal(Cal.pascha(2027), '2027-05-02');
  const cath = c.Threshold.PACKS['christianity.catholic'].calendar;
  const on = (cal, iso) => Cal.observancesOn(cal, new Date(iso + 'T12:00:00Z')).map(o => o.id);
  assert.ok(on(cath, '2027-03-28').includes('obs.cath.easter'));
  assert.ok(on(cath, '2027-02-10').includes('obs.cath.ash'), '圣灰礼仪日 = 复活节前 46 天');
  const isl = load('islam.mosque');
  const icals = isl.Threshold.PACKS['islam.mosque'].calendar;
  const ion = iso => isl.Threshold.Calendar.observancesOn(icals, new Date(iso + 'T12:00:00Z'));
  assert.ok(ion('2026-03-20').some(o => o.id === 'obs.isl.fitr' && o.approx), '2026 开斋节（估算）');
  const jud = load('judaism.shabbat');
  const jcal = jud.Threshold.PACKS['judaism.shabbat'].calendar;
  const jon = iso => jud.Threshold.Calendar.observancesOn(jcal, new Date(iso + 'T12:00:00Z')).map(o => o.id);
  assert.ok(jon('2026-09-12').includes('obs.he.roshHashanah'));
  assert.ok(jon('2026-09-21').includes('obs.he.yomKippur'));
  assert.ok(jon('2027-03-23').includes('obs.he.purim'), '闰年的普珥节在第二亚达月');
  assert.ok(jon('2026-04-02').includes('obs.he.pesach'));
});

test('伊斯兰教、犹太教、锡克教：经文不用机器朗读；犹太教不写四字神名；不模拟礼拜', () => {
  for (const id of ['islam.mosque', 'judaism.shabbat', 'sikhism.gurdwara']) {
    const c = load(id);
    for (const r of c.Threshold.CONTENT[id]) if (r.type === 'scripture') assert.equal(r.noTTS, true, id + ' ' + r.key);
  }
  const j = load('judaism.shabbat');
  const all = JSON.stringify(j.Threshold.CONTENT['judaism.shabbat']) + fs.readFileSync(path.join(ROOT, 'traditions/judaism.shabbat/game.js'), 'utf8');
  assert.ok(!/יהוה|יְהוָה/.test(all), '没有四字神名');
  const i = load('islam.mosque');
  assert.ok(i.Threshold.PACKS['islam.mosque'].rules.noSimulatedPrayer);
  assert.ok(!i.C.def.practices.some(p => /salah|prayer/i.test(p.id) && p.kind === 'steps'), '没有礼拜步骤练习');
});

test('犹太教：安息日（周五日落到周六入夜）不能干活、不能买卖，平日可以', () => {
  const c = load('judaism.shabbat');
  const { C } = c;
  let now = Date.parse('2026-11-13T17:00:00+02:00');
  C.start(storage(), now, '');
  C.env.now = () => now;
  assert.equal(C.restNow(), 'rest.shabbat', '周五傍晚');
  const p = C.state.piles[0];
  assert.equal(C.sweep(p.id), 0);
  C.state.res = 100;
  assert.equal(C.buy('med'), false, '安息日不买卖');
  now = Date.parse('2026-11-14T12:00:00+02:00');
  assert.equal(C.restNow(), 'rest.shabbat', '周六中午');
  now = Date.parse('2026-11-14T20:00:00+02:00');
  assert.equal(C.restNow(), null, '周六入夜后结束');
  now = Date.parse('2026-11-11T12:00:00+02:00');
  assert.equal(C.restNow(), null, '周三');
  assert.ok(C.buy('med'));
});

test('锡克教与新教：资源只用来招待来客，没有小卖部', () => {
  for (const id of ['sikhism.gurdwara', 'christianity.protestant']) {
    const c = load(id);
    c.C.start(storage(), Date.parse('2026-11-10T09:00:00Z'), '');
    assert.equal(c.C.def.care.mode, 'guests');
    assert.deepEqual([...c.C.shopItems()], [], id);
    assert.equal(c.C.buy('med'), false);
  }
});

test('统一入口只加载白名单里的包；平台首页加载了所有包', () => {
  const play = fs.readFileSync(path.join(ROOT, 'play.html'), 'utf8');
  for (const id of PACKS) assert.ok(play.includes("'" + id + "'"), id);
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const id of PACKS) assert.ok(index.includes(`traditions/${id}/pack.js`) && index.includes(`traditions/${id}/content.js`), id);
});
