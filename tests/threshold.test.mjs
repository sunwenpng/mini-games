// 启扉平台第一阶段测试：node --test tests/threshold.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'threshold');
const DATA_FILES = [
  'locales/zh-CN.js', 'locales/zh-TW.js', 'locales/en.js', 'data/registry.js', 'data/script-samples.js',
  'traditions/buddhism.han/pack.js', 'traditions/buddhism.han/content.js',
  'traditions/buddhism.theravada.th/pack.js', 'traditions/buddhism.theravada.th/content.js',
  'traditions/sikhism.gurdwara/pack.js', 'traditions/sikhism.gurdwara/content.js',
  'traditions/buddhism.tibetan/pack.js', 'traditions/buddhism.tibetan/content.js',
  'traditions/buddhism.japan/pack.js', 'traditions/buddhism.japan/content.js',
  'traditions/buddhism.india.navayana/pack.js', 'traditions/buddhism.india.navayana/content.js',
  'traditions/hinduism.ghat/pack.js', 'traditions/hinduism.ghat/content.js',
  'traditions/daoism.mountain/pack.js', 'traditions/daoism.mountain/content.js',
  'traditions/shinto.shrine/pack.js', 'traditions/shinto.shrine/content.js',
  'traditions/christianity.catholic/pack.js', 'traditions/christianity.catholic/content.js',
  'traditions/christianity.orthodox/pack.js', 'traditions/christianity.orthodox/content.js',
  'traditions/christianity.protestant/pack.js', 'traditions/christianity.protestant/content.js',
  'traditions/islam.mosque/pack.js', 'traditions/islam.mosque/content.js',
  'traditions/judaism.shabbat/pack.js', 'traditions/judaism.shabbat/content.js',
  'core/i18n.js', 'core/save.js', 'core/rights.js', 'core/calendar.js',
];

function boot({ withApp = false, hash = '', storage } = {}) {
  const store = storage || memoryStorage();
  const ctx = {
    console, Intl, JSON, Math, Date, Object, Array, String, Number, Set, btoa, atob, encodeURIComponent, decodeURIComponent,
    location: { hash },
    localStorage: store,
    document: { getElementById: () => null, documentElement: { setAttribute() {} }, addEventListener() {} },
    addEventListener() {},
    setTimeout, clearTimeout,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of DATA_FILES.concat(withApp ? ['core/app.js'] : [])) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  return { T: ctx.Threshold, ctx, store };
}

function memoryStorage(init = {}, { throwOnRead = false, throwOnWrite = false } = {}) {
  const data = Object.assign({}, init);
  return {
    data,
    getItem: k => { if (throwOnRead) throw new Error('denied'); return k in data ? data[k] : null; },
    setItem: (k, v) => { if (throwOnWrite) throw new Error('quota'); data[k] = String(v); },
  };
}

const plain = o => JSON.parse(JSON.stringify(o));
const same = (a, b, m) => assert.deepEqual(plain(a), plain(b), m);

const stripComments = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/* ---------- 多语言 ---------- */
test('简体、繁體、English 文案 key 完全一致，且都能取到', () => {
  const { T } = boot();
  const zh = Object.keys(T.MESSAGES['zh-CN']).sort();
  const en = Object.keys(T.MESSAGES.en).sort();
  same(en, zh);
  same(Object.keys(T.MESSAGES['zh-TW']).sort(), zh);
  for (const loc of ['zh-CN', 'zh-TW', 'en', 'qps-ploc', 'qps-plocm']) {
    const i = T.createI18n(loc);
    for (const k of zh) assert.ok(!i.t(k, { n: 2, live: 1, name: 'x', place: 'y', voice: 'v', kind: 'k' }).includes('⟦'), loc + ' ' + k);
    assert.equal(i.missing.size, 0);
  }
});

test('复数、插值、缺 key 标记', () => {
  const { T } = boot();
  const en = T.createI18n('en');
  assert.equal(en.t('home.versionCount', { n: 1, live: 1 }), '1 version, 1 open');
  assert.equal(en.t('home.versionCount', { n: 5, live: 1 }), '5 versions, 1 open');
  assert.equal(T.createI18n('zh-CN').t('action.enter', { place: '山寺小院' }), '进入山寺小院');
  assert.equal(en.t('no.such.key'), '⟦no.such.key⟧');
  assert.ok(en.missing.has('no.such.key'));
});

test('伪语言：加长至少 30%，保留占位符，RTL 伪语言方向为 rtl', () => {
  const { T } = boot();
  const p = T.createI18n('qps-ploc');
  const base = T.createI18n('en').t('home.lead');
  const out = p.t('home.lead');
  assert.ok([...out].length >= [...base].length * 1.3, out);
  assert.match(T.pseudoize('Enter {place}'), /\{place\}/);
  assert.equal(T.createI18n('qps-plocm').dir, 'rtl');
  assert.equal(T.createI18n('qps-ploc').lang, 'en');
});

test('平台代码里没有写死的中文界面文案', () => {
  for (const f of ['core/app.js', 'core/i18n.js', 'core/save.js', 'core/rights.js', 'core/calendar.js', 'data/registry.js', 'traditions/buddhism.han/pack.js', 'traditions/buddhism.theravada.th/pack.js']) {
    // 语言自称（endonym）必须用该语言的文字书写，不算界面文案
    const code = stripComments(fs.readFileSync(path.join(ROOT, f), 'utf8')).replace(/endonym: '[^']*'/g, '');
    const hits = code.match(/[一-鿿]+/g) || [];
    same(hits, [], f);
  }
});

/* ---------- 注册表与审核门 ---------- */
test('每个传统和版本都有双语名称，状态合法，只有 live 和 preview 能进入，preview 进入前必须确认', () => {
  const { T } = boot();
  const zh = T.MESSAGES['zh-CN'];
  for (const f of T.FAMILIES) {
    assert.ok(zh['family.' + f.id + '.name'] && zh['family.' + f.id + '.note'], f.id);
    if (f.status) assert.ok(T.STATUSES.includes(f.status));
    for (const v of f.versions) {
      assert.ok(T.STATUSES.includes(v.status), v.id);
      for (const k of ['name', 'place', 'region', 'note']) assert.ok(zh['version.' + v.id + '.' + k], v.id + k);
      assert.equal(T.canEnter(v.id), v.status === 'live' || v.status === 'preview', v.id);
      assert.equal(T.needsAck(v.id), v.status === 'preview', v.id);
    }
  }
  assert.equal(T.canEnter('islam'), false);
  assert.equal(T.canEnter('sikhism.gurdwara'), true, '锡克教由纸面推演转为预览');
  const all = T.FAMILIES.flatMap(f => f.versions);
  assert.equal(all.length, 14, '十个传统、十四个版本');
  assert.ok(T.FAMILIES.every(f => f.versions.length && f.versions.every(v => T.canEnter(v.id))), '每个传统都至少有一个能进入的版本');
  assert.equal(T.canEnter('buddhism.theravada.th'), true);
  assert.equal(T.canEnter('nope'), false);
});

test('包的选项都有文案；不可选项都写明原因；可进入的包默认值可选', () => {
  const { T } = boot();
  const zh = T.MESSAGES['zh-CN'];
  for (const pack of Object.values(T.PACKS)) {
  const enterable = pack.status === 'live' || pack.status === 'preview';
  for (const [group, opts] of Object.entries(pack.options)) {
    for (const o of opts) {
      if (group === 'ui') assert.ok(T.LOCALES.find(l => l.id === o.id), o.id);
      else if (group === 'voice') assert.ok(zh['voice.' + o.id], o.id);
      else assert.ok(zh['opt.' + group + '.' + o.id], group + o.id);
      if (o.state === 'off') assert.ok(o.why && zh[o.why], 'why ' + o.id);
    }
    const def = opts.find(o => o.id === pack.defaults[group]);
    assert.ok(def && (!enterable || def.state !== 'off'), pack.id + ' default ' + group);
  }
  assert.equal(pack.rules.adsInSacredSpace, false);
  assert.equal(pack.rules.practicesYieldCurrency, false);
  for (const k of pack.notice || []) assert.ok(zh[k], k);
  }
  assert.equal(T.PACKS['buddhism.theravada.th'].rules.noAnimalRelease, true);
});

test('内容记录字段齐全、分类正确；正式构建会挡住未审校内容', () => {
  const { T } = boot();
  const recs = T.CONTENT['buddhism.han'];
  assert.equal(recs.length, 6);
  same(T.Rights.checkContent(recs), []);
  const types = Object.fromEntries(recs.map(r => [r.key, r.type]));
  same(types, { xinjing: 'sutra', dabei: 'dharani', wangsheng: 'dharani', jingang: 'gatha', liuzi: 'mantra', nianfo: 'nianfo' });
  assert.equal(T.Rights.releaseFilter(recs).length, 0, '全部仍是自查状态，正式构建不应显示');
  assert.ok(T.Rights.checkContent([{ id: 'x', type: 'sutra', text: { a: 'b' } }]).length >= 3);
});

test('泰国上座部内容：五段巴利文，泰文字母、拉丁转写和三种译文逐行对齐，编辑自查过但未经母语与顾问审定', () => {
  const { T } = boot();
  const recs = T.CONTENT['buddhism.theravada.th'];
  same(recs.map(r => r.key), ['namo', 'tisarana', 'pancasila', 'itipiso', 'metta']);
  same(T.Rights.checkContent(recs), []);
  for (const r of recs) {
    const n = r.text['pi-Thai'].length;
    assert.equal(r.text['pi-Latn'].length, n, r.key);
    for (const tr of ['th', 'en', 'zh-CN']) assert.equal(r.translations[tr].length, n, r.key + ' ' + tr);
    assert.ok(r.text['pi-Thai'].every(l => /^[\u0E00-\u0E7F ]+$/.test(l)), r.key + ' 泰文字母');
    assert.ok(r.text['pi-Latn'].every(l => /^[A-Za-zāīūṃṅñṭḍṇḷĀĪŪÑ’ ]+$/.test(l)), r.key + ' 拉丁转写');
    assert.equal(r.reviewStatus, 'self-checked');
    assert.ok(r.reviewers.length && r.reviewers.every(x => x.by && x.date), r.key + ' 自查记录');
    assert.ok(T.MESSAGES['zh-CN']['type.' + r.type], r.type);
  }
  assert.equal(recs[0].text['pi-Thai'].length, 3, '礼敬文念三遍');
  assert.equal(T.Rights.releaseFilter(recs).length, 0);
});

test('声音权利链：可选的声音都齐全，自有录音缺材料所以不可选', () => {
  const { T } = boot();
  const pack = T.PACKS['buddhism.han'];
  same(T.Rights.checkPackVoices(pack), []);
  assert.equal(T.Rights.voiceReady('ref.cc0.xinjing'), true);
  assert.equal(T.Rights.voiceReady('own.xinjing.v1'), false);
  assert.ok(T.Rights.voiceProblems('own.xinjing.v1', T.VOICES['own.xinjing.v1']).includes('contract'));
  for (const o of pack.options.voice) assert.ok(T.Rights.KINDS.includes(T.VOICES[o.id].kind));
});

/* ---------- 存档 ---------- */
const LEGACY = 'temple-yard-save-v1';

test('新用户：默认存档，不提示', () => {
  const { T, store } = boot();
  const r = T.Save.load(store, 1);
  assert.equal(r.note, '');
  assert.equal(r.data.lastVersion, null);
  same(r.data.prefs, {});
});

test('F7 Codex 分支 v3 存档：带出声线和最近版本，旧键不被改写', () => {
  const legacy = JSON.stringify({ ver: 3, seenIntro: true, platformChosen: true, merit: 99, opt: { fishBeat: true, voiceProfile: 'solemn' },
    platform: { traditionId: 'buddhism.han.zh', uiLocale: 'zh-CN', contentLocale: 'zh-Hans', audioLocale: 'zh-CN' } });
  const store = memoryStorage({ [LEGACY]: legacy });
  const { T } = boot({ storage: store });
  const r = T.Save.load(store, 5);
  assert.equal(r.note, 'migrated');
  assert.equal(r.data.migratedFrom, LEGACY + '@v3');
  assert.equal(r.data.lastVersion, 'buddhism.han');
  same(r.data.prefs['buddhism.han'], { ui: 'zh-CN', content: 'lzh', translation: 'none', voice: 'sys.solemn' });
  assert.ok(T.Save.write(store, r.data));
  assert.equal(store.data[LEGACY], legacy, '旧存档原样保留');
  assert.equal(T.Save.load(store, 6).note, '', '第二次读平台自己的存档');
});

test('F8 GitHub v4（存档 v2）和 v1 存档：用默认选择；没看过开场的不记最近版本', () => {
  for (const [legacy, last] of [
    [{ ver: 2, seenIntro: true, tut: 9, playSec: 900 }, 'buddhism.han'],
    [{ seenIntro: true, rescued: 3 }, 'buddhism.han'],
    [{ ver: 2, seenIntro: false, tut: 1 }, null],
  ]) {
    const store = memoryStorage({ [LEGACY]: JSON.stringify(legacy) });
    const { T } = boot({ storage: store });
    const r = T.Save.load(store, 1);
    assert.equal(r.data.lastVersion, last);
    same(r.data.prefs['buddhism.han'], T.PACKS['buddhism.han'].defaults);
  }
});

test('旧存档里非法的声线回到默认；旧存档损坏就当新用户', () => {
  const s1 = memoryStorage({ [LEGACY]: JSON.stringify({ ver: 3, seenIntro: true, opt: { voiceProfile: 'robot' } }) });
  assert.equal(boot({ storage: s1 }).T.Save.load(s1, 1).data.prefs['buddhism.han'].voice, 'sys.clear');
  const s2 = memoryStorage({ [LEGACY]: '{broken' });
  const r = boot({ storage: s2 }).T.Save.load(s2, 1);
  assert.equal(r.note, '');
  assert.equal(r.data.lastVersion, null);
});

test('平台存档损坏：有备份就恢复，没有就重置；读不到存储不崩溃', () => {
  const { T } = boot();
  const good = JSON.stringify(Object.assign(T.Save.fresh(1), { lastVersion: 'buddhism.han' }));
  const a = memoryStorage({ 'threshold-save-v1': '{x', 'threshold-save-v1.bak': good });
  assert.equal(T.Save.load(a, 1).note, 'restored');
  assert.equal(T.Save.load(a, 1).data.lastVersion, 'buddhism.han');
  const b = memoryStorage({ 'threshold-save-v1': '{x' });
  assert.equal(T.Save.load(b, 1).note, 'reset');
  const c = memoryStorage({}, { throwOnRead: true });
  assert.equal(T.Save.load(c, 1).note, '');
  const d = memoryStorage({}, { throwOnWrite: true });
  assert.equal(T.Save.write(d, T.Save.fresh(1)), false);
});

test('写入前留备份；四项选择互相独立；不可选的值被改回默认', () => {
  const { T, store } = boot();
  const s = T.Save.fresh(1);
  T.Save.write(store, s);
  s.lastVersion = 'buddhism.han';
  T.Save.write(store, s);
  assert.ok(store.data['threshold-save-v1.bak']);
  const base = T.PACKS['buddhism.han'].defaults;
  const p = T.Save.normalizePrefs('buddhism.han', Object.assign({}, base, { ui: 'en' }));
  same(p, Object.assign({}, base, { ui: 'en' }));
  assert.equal(T.Save.normalizePrefs('buddhism.han', { voice: 'own.xinjing.v1' }).voice, base.voice, '未录制的自有录音不可选');
  assert.equal(T.Save.normalizePrefs('buddhism.han', { translation: 'en' }).translation, 'none');
  same(T.Save.normalizePrefs('buddhism.theravada.th', { ui: 'zh-TW', voice: 'own.th.v1' }), { ui: 'th', content: 'pi-Thai', translation: 'none', voice: 'sys.th' }, '泰国包不可选的项回到默认');
  assert.equal(T.Save.normalizePrefs('nope', {}), null, '不存在的版本没有包');
});

test('存档码往返一致；改动和乱码会被拦下', () => {
  const { T } = boot();
  const s = Object.assign(T.Save.fresh(1), { uiLocale: 'en', lastVersion: 'buddhism.han', prefs: { 'buddhism.han': { ui: 'en', content: 'lzh', translation: 'none', voice: 'sys.hall' } } });
  const code = T.Save.exportCode(s);
  assert.match(code, /^THRS1:/);
  const r = T.Save.parseCode(code, 2);
  same(r.data.prefs, s.prefs);
  assert.equal(r.data.uiLocale, 'en');
  assert.equal(T.Save.parseCode(code.slice(0, -1) + (code.endsWith('a') ? 'b' : 'a'), 2).error, 'checksum');
  assert.equal(T.Save.parseCode('hello', 2).error, 'format');
  assert.equal(T.Save.parseCode('THRS1:@@:abc', 2).error, 'format');
});

/* ---------- 深链接与路由 ---------- */
test('深链接解析与生成互逆', () => {
  const { T } = boot();
  const prefs = { ui: 'en', content: 'lzh', translation: 'none', voice: 'sys.hall' };
  const hash = T.Save.formatLink('buddhism.han', prefs, 'pack');
  const back = T.Save.parseLink(hash);
  assert.equal(back.versionId, 'buddhism.han');
  assert.equal(back.view, 'pack');
  same(back.prefs, prefs);
});

test('路由：未开放的版本落到筹备页；深链接选择被修正后写入存档', () => {
  const cases = [
    ['#v=buddhism.theravada.th', 'pack'],
    ['#v=sikhism.gurdwara', 'pack'],
    ['#view=pack&v=buddhism.tibetan', 'pack'],
    ['#view=family&f=islam', 'family'],
    ['#view=pack&v=nope', 'home'],
    ['#view=family&f=buddhism', 'family'],
    ['#v=bogus.version', 'home'],
    ['#view=sources&v=buddhism.han', 'sources'],
    ['', 'home'],
  ];
  for (const [hash, view] of cases) {
    const { T, ctx } = boot({ withApp: true, hash });
    T.app.save = T.Save.fresh(1);
    ctx.location.hash = hash;
    T.app.route();
    assert.equal(T.app.state.view, view, hash);
  }
  const { T, ctx, store } = boot({ withApp: true });
  T.app.save = T.Save.fresh(1);
  ctx.location.hash = '#v=buddhism.han&ui=en&voice=own.xinjing.v1&tr=en';
  T.app.route();
  assert.equal(T.app.state.view, 'pack');
  same(T.app.save.prefs['buddhism.han'], { ui: 'en', content: 'lzh', translation: 'none', voice: 'sys.clear' });
  assert.ok(store.data['threshold-save-v1'], '写入了平台存档');
});

/* ---------- 第四阶段：节历、存档码带游戏进度、显示设置 ---------- */
test('节历：汉传按农历推算佛诞等日子；泰国用官方日期，2026 年佛日按年历、之后标“估算”', () => {
  const { T } = boot();
  const han = T.PACKS['buddhism.han'].calendar;
  const on = (cal, iso, tz) => T.Calendar.observancesOn(cal, new Date(iso + 'T12:00:00' + tz)).map(o => o.id);
  assert.ok(on(han, '2027-05-13', '+08:00').includes('obs.han.vesak'), '2027 年农历四月初八');
  assert.ok(on(han, '2026-11-09', '+08:00').includes('obs.han.new'), '农历十月初一');
  assert.ok(on(han, '2026-12-25', '+08:00').includes('obs.han.amitabha'), '农历十一月十七');
  same(T.Calendar.lunar(new Date('2026-11-09T12:00:00+08:00'), 'Asia/Shanghai'), { month: 10, day: 1, leap: false });
  const th = T.PACKS['buddhism.theravada.th'].calendar;
  assert.ok(on(th, '2027-02-21', '+07:00').includes('obs.th.makha'));
  assert.ok(on(th, '2027-05-20', '+07:00').includes('obs.th.visakha'));
  const next = T.Calendar.upcoming(th, new Date('2026-11-09T12:00:00+07:00'), 60, 10);
  assert.ok(next.length >= 4, '60 天内有节日');
  assert.ok(next.filter(o => o.id === 'obs.th.wanPhra' && o.date < '2027-01-01').every(o => !o.approx), '2026 年佛日按年历，不是估算');
  assert.ok(next.filter(o => o.id === 'obs.th.wanPhra' && o.date >= '2027-01-01').every(o => o.approx), '2027 年起佛日标估算');
  same(next.filter(o => o.id === 'obs.th.wanPhra').map(o => o.date).filter(d => d < '2026-12-31'), ['2026-11-09', '2026-11-17', '2026-11-24', '2026-12-02', '2026-12-09', '2026-12-17', '2026-12-24']);
  assert.equal(th.wanPhra.length, 50, '2569 年 50 个佛日');
  assert.ok(!on(th, '2026-11-10', '+07:00').includes('obs.th.wanPhra'), '2026-11-10 不是佛日（估算法会误报处）');
  const age = T.Calendar.moonAge(new Date('2026-11-24T14:53:00Z'));
  assert.ok(Math.abs(age - 14.77) < 1.2, '2026-11-24 满月，月龄 ' + age.toFixed(2));
});

test('存档码带上各传统的游戏进度；只接受已知的存档键；旧格式照样能读', () => {
  const { T } = boot();
  const s = Object.assign(T.Save.fresh(1), { uiLocale: 'zh-TW', acks: { 'buddhism.theravada.th': true }, display: { size: 'xl', motion: 'reduce' } });
  const packs = { 'threshold-han-save-v1': JSON.stringify({ stores: 42 }), 'threshold-th-save-v1': JSON.stringify({ rice: 7 }) };
  const code = T.Save.exportCode(s, packs);
  const keys = ['threshold-han-save-v1', 'threshold-th-save-v1'];
  const r = T.Save.parseCode(code, 2, keys);
  same(r.packs, packs);
  same(r.data.display, { size: 'xl', motion: 'reduce' });
  assert.equal(r.data.acks['buddhism.theravada.th'], true);
  assert.equal(r.data.uiLocale, 'zh-TW');
  const evil = T.Save.exportCode(s, { 'some-other-site-key': '{"x":1}', 'threshold-th-save-v1': 'not json' });
  same(T.Save.parseCode(evil, 2, keys).packs, {}, '未知键和坏数据都被丢掉');
  const old = T.Save.parseCode(T.Save.exportCode(s), 2, keys);
  same(old.packs, {});
  assert.equal(old.data.uiLocale, 'zh-TW');
});

test('显示设置：非法值回到默认', () => {
  const { T } = boot();
  const m = T.Save.merge({ display: { size: 'huge', motion: 'spin' } }, 1);
  same(m.display, { size: 'm', motion: 'system' });
  same(T.Save.fresh(1).acks, {});
});

test('平台页面：繁體中文界面能完整渲染每个页面，预览版本要先勾选确认', () => {
  const html = {};
  const el = id => (html[id] = html[id] || { id, innerHTML: '', textContent: '', hidden: true, setAttribute() {}, querySelector: () => null, focus() {} });
  const store = memoryStorage();
  const { T, ctx } = boot({ withApp: true, storage: store, hash: '#view=pack&v=buddhism.theravada.th' });
  ctx.document.getElementById = el;
  ctx.document.documentElement = { setAttribute() {}, removeAttribute() {}, style: {} };
  ctx.document.querySelector = () => null;
  ctx.scrollTo = () => {};
  T.app.init();
  const main = () => html.main.innerHTML;
  assert.ok(main().includes('data-act="need-ack"'), '没确认时没有进入链接');
  assert.ok(!main().includes('data-act="enter"'));
  T.app.save.acks['buddhism.theravada.th'] = true;
  T.app.render(false);
  assert.ok(main().includes('data-act="enter"'), '确认后出现进入链接');
  assert.ok(main().includes('traditions/buddhism.theravada.th/game/index.html#v=buddhism.theravada.th'));
  T.app.save.uiLocale = 'zh-TW';
  T.Save.write(store, T.app.save);
  ctx.location.hash = '#view=home';
  T.app.init();
  for (const h of ['#view=home', '#view=family&f=buddhism', '#view=pack&v=buddhism.han', '#view=sources&v=buddhism.han', '#view=sources&v=buddhism.theravada.th', '#view=settings', '#view=brand', '#view=scripts', '#view=family&f=sikhism', '#view=prep&v=sikhism.gurdwara']) {
    ctx.location.hash = h;
    T.app.route();
    T.app.render(false);
    assert.ok(!main().includes('⟦'), h + ' 缺文案');
    assert.ok(main().length > 200, h);
  }
  assert.equal(T.app.i18n.locale, 'zh-TW');
});
