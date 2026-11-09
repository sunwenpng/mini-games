/*
 * 菩提静院（泰国上座部佛教包）：规则与界面。
 * - 规则（TH.logic）不碰 DOM，测试可以直接调用；界面（TH.ui）只负责渲染和事件。
 * - 资源只有“米”：扫院子得来，用来换狗粮、猫粮、药和布施的饭。礼佛、供养、诵读、布施只记入功课簿。
 * - 时间用真实时钟：清晨 6–8 点才能布施；热季 / 雨季 / 凉季、雨安居、佛日都按真实日期。
 */
var TH = (function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  const T = root.Threshold || {};
  const PACK = (T.PACKS || {})['buddhism.theravada.th'];
  const TEXTS = (T.CONTENT || {})['buddhism.theravada.th'] || [];
  const SAVE_KEY = 'threshold-th-save-v1';
  const PLATFORM_KEY = 'threshold-save-v1';
  const VERSION_ID = 'buddhism.theravada.th';
  const UI_LANGS = ['th', 'en', 'zh-CN'];
  const SCRIPTS = ['pi-Thai', 'pi-Latn', 'pi-both'];
  const TRS = ['none', 'th', 'en', 'zh-CN'];
  const MAX_PILES = 6;
  const MAX_ANIMALS = 4;
  const COST = { dogfood: 6, catfood: 6, med: 12 };
  const BROOM_MAX = 4;

  const env = { now: () => Date.now(), storage: null, missing: new Set() };
  let S = null;
  const G = {
    monks: [], alms: null, chant: null, sheet: null, toastT: 0, rain: 0, rainTarget: 0, wet: 0, weatherT: 30,
    hintKey: '', clock: 0, pileT: 0, wind: 0.3, saveT: 0,
  };

  /* ---------- 文案 ---------- */
  let LANG = 'zh-CN';
  const plurals = {};
  function tt(key, p) {
    const chain = [LANG, 'en', 'zh-CN'];
    let v = null;
    for (const id of chain) {
      const d = (typeof TH_MSG !== 'undefined' && TH_MSG[id]) || null;
      if (d && Object.prototype.hasOwnProperty.call(d, key)) {
        v = d[key];
        if (v && typeof v === 'object') {
          if (!plurals[id]) {
            try { plurals[id] = new Intl.PluralRules(id); } catch (e) { plurals[id] = { select: () => 'other' }; }
          }
          const n = p && typeof p.n === 'number' ? p.n : 0;
          const cat = plurals[id].select(n);
          v = v[cat] != null ? v[cat] : v.other;
        }
        break;
      }
    }
    if (v == null) {
      env.missing.add(key);
      return '⟦' + key + '⟧';
    }
    return String(v).replace(/\{(\w+)\}/g, (m, k) => (p && p[k] != null ? String(p[k]) : m));
  }

  /* ---------- 平台选择 ---------- */
  function readJSON(k) {
    try {
      const raw = env.storage && env.storage.getItem(k);
      const v = raw ? JSON.parse(raw) : null;
      return v && typeof v === 'object' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function readPlatform(hash) {
    const plat = readJSON(PLATFORM_KEY);
    const out = Object.assign({}, (plat && plat.prefs && plat.prefs[VERSION_ID]) || {});
    String(hash || '').replace(/^#/, '').split('&').forEach(pair => {
      const i = pair.indexOf('=');
      if (i < 0) return;
      const k = decodeURIComponent(pair.slice(0, i));
      const v = decodeURIComponent(pair.slice(i + 1));
      if (k === 'ui') out.ui = v;
      if (k === 'src') out.content = v;
      if (k === 'tr') out.translation = v;
      if (k === 'voice') out.voice = v;
    });
    return { prefs: out, display: (plat && plat.display) || {} };
  }

  /* 游戏里改的语言和声音写回平台存档（平台存档不存在就不新建）。 */
  function syncPlatform() {
    const plat = readJSON(PLATFORM_KEY);
    if (!plat) return;
    plat.prefs = plat.prefs && typeof plat.prefs === 'object' ? plat.prefs : {};
    plat.prefs[VERSION_ID] = { ui: S.opt.ui, content: S.opt.content, translation: S.opt.translation, voice: 'sys.th' };
    try { env.storage.setItem(PLATFORM_KEY, JSON.stringify(plat)); } catch (e) { /* 写不进就算了 */ }
  }

  /* ---------- 存档 ---------- */
  function fresh(now) {
    return {
      ver: 1, createdAt: now, last: now, seenIntro: false,
      rice: 12, broom: 1, inv: { dogfood: 1, catfood: 1, med: 0 },
      piles: [], pileSeq: 1, animals: [], animalSeq: 1, nextAnimalAt: now + 15000,
      log: { krap: 0, offer: 0, chant: 0, alms: 0, sweep: 0, adopted: 0, chants: {} },
      journal: [], almsDay: '', almsGiven: 0, offerings: { flower: null, flowerAt: 0, candleAt: 0, incenseAt: 0 },
      opt: { ui: null, content: 'pi-Thai', translation: 'none', speak: true, sound: true, reduceMotion: null },
    };
  }

  function merge(s, now) {
    const f = fresh(now);
    const out = Object.assign(f, s);
    out.inv = Object.assign(fresh(now).inv, s.inv || {});
    out.log = Object.assign(fresh(now).log, s.log || {});
    out.log.chants = Object.assign({}, (s.log && s.log.chants) || {});
    out.offerings = Object.assign(fresh(now).offerings, s.offerings || {});
    out.opt = Object.assign(fresh(now).opt, s.opt || {});
    out.piles = Array.isArray(s.piles) ? s.piles.filter(p => p && Number.isFinite(p.x)) : [];
    out.animals = Array.isArray(s.animals) ? s.animals.filter(a => a && (a.kind === 'dog' || a.kind === 'cat')) : [];
    out.journal = Array.isArray(s.journal) ? s.journal.slice(-40) : [];
    ['rice', 'broom'].forEach(k => { if (!Number.isFinite(out[k]) || out[k] < 0) out[k] = f[k]; });
    out.broom = Math.min(BROOM_MAX, Math.max(1, Math.floor(out.broom)));
    return out;
  }

  function load(now) {
    const main = readJSON(SAVE_KEY);
    if (main) return { s: merge(main, now), note: '' };
    const bak = readJSON(SAVE_KEY + '.bak');
    if (bak) return { s: merge(bak, now), note: 'restored' };
    return { s: fresh(now), note: '' };
  }

  function save() {
    if (!S || !env.storage) return true;
    S.last = env.now();
    try {
      const prev = env.storage.getItem(SAVE_KEY);
      if (prev) env.storage.setItem(SAVE_KEY + '.bak', prev);
      env.storage.setItem(SAVE_KEY, JSON.stringify(S));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- 时间与历法 ---------- */
  function hourOf(d) {
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  }

  function seasonOf(d) {
    const m = d.getMonth() + 1;
    if (m >= 3 && m <= 5) return 'hot';
    if (m >= 6 && m <= 10) return 'rain';
    return 'cool';
  }

  function tod(h) {
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 19.5) return 'evening';
    return 'night';
  }

  function dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function almsOpen(d) {
    const h = hourOf(d);
    const w = (PACK && PACK.rules.almsWindow) || [6, 8];
    return h >= w[0] && h < w[1];
  }

  function phansaRange(d) {
    const iso = T.Calendar ? T.Calendar.isoDay(d, 'Asia/Bangkok') : dayKey(d);
    return ((PACK && PACK.calendar.phansa) || []).find(r => iso >= r[0] && iso <= r[1]) || null;
  }

  function todayObs(d) {
    return T.Calendar && PACK ? T.Calendar.observancesOn(PACK.calendar, d) : [];
  }

  /* ---------- 记录 ---------- */
  function note(key, params) {
    S.journal.push({ t: env.now(), key, params: params || {} });
    if (S.journal.length > 40) S.journal.splice(0, S.journal.length - 40);
  }

  /* ---------- 叶堆 ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }

  function addPile() {
    if (S.piles.length >= MAX_PILES) return null;
    for (let k = 0; k < 8; k++) {
      const p = { id: S.pileSeq++, x: rand(0.2, 0.8), y: rand(0.66, 0.84), n: 2 };
      if (S.piles.every(q => Math.hypot(q.x - p.x, (q.y - p.y) * 1.6) > 0.12)) {
        S.piles.push(p);
        return p;
      }
    }
    return null;
  }

  function pileEvery(d) {
    return seasonOf(d) === 'hot' ? 22 : seasonOf(d) === 'rain' ? 40 : 30;
  }

  function sweepYield() {
    return 2 + (S.broom - 1);
  }

  /* 扫一下：叶堆分两次扫完。返回 { key, params }。 */
  function sweep(id) {
    const p = id == null ? S.piles[0] : S.piles.find(q => q.id === id);
    if (!p) return { key: 'sweep.none' };
    p.n -= 1;
    if (p.n > 0) return { key: 'sweep.half' };
    S.piles = S.piles.filter(q => q !== p);
    const n = sweepYield();
    S.rice += n;
    S.log.sweep += 1;
    return { key: 'sweep.got', params: { n } };
  }

  /* ---------- 动物 ---------- */
  const COATS = { dog: ['brown', 'black', 'white'], cat: ['orange', 'tabby', 'calico'] };
  const INJ = ['leg', 'skin', 'eye'];

  function spawnAnimal(kind, injured) {
    if (S.animals.length >= MAX_ANIMALS) return null;
    kind = kind || (Math.random() < 0.55 ? 'dog' : 'cat');
    const hurt = injured == null ? Math.random() < 0.4 : injured;
    const a = {
      id: S.animalSeq++, kind, coat: COATS[kind][Math.floor(Math.random() * 3)],
      name: null, x: Math.random() < 0.5 ? 0.04 : 0.96, y: rand(0.7, 0.84), tx: rand(0.25, 0.75), ty: rand(0.68, 0.84),
      dir: 1, state: 'walk', wait: 0, hunger: Math.round(rand(20, 45)), health: hurt ? 45 : 75, trust: Math.round(rand(4, 14)),
      injured: hurt ? INJ[Math.floor(Math.random() * 3)] : null, treated: false, treatedAt: 0, waterAt: 0, happy: 0,
    };
    S.animals.push(a);
    return a;
  }

  function animalName(a) {
    if (a.name) return a.name[0] + (LANG === 'th' ? '' : ' (' + a.name[1] + ')');
    return tt('care.unnamed', { kind: tt('kind.' + a.kind) });
  }

  function find(id) {
    return S.animals.find(a => a.id === id) || null;
  }

  function feed(id) {
    const a = find(id);
    if (!a) return null;
    const food = a.kind === 'dog' ? 'dogfood' : 'catfood';
    if (a.hunger > 85) return { key: 'care.full' };
    if (S.inv[food] <= 0) return { key: 'care.noFood', params: { food: tt('food.' + food) } };
    S.inv[food] -= 1;
    a.hunger = Math.min(100, a.hunger + 45);
    a.trust = Math.min(100, a.trust + 10);
    a.happy = 1;
    return { key: 'care.fed', params: { name: animalName(a) } };
  }

  function water(id) {
    const a = find(id);
    if (!a) return null;
    const now = env.now();
    if (now - a.waterAt > 30000) a.trust = Math.min(100, a.trust + 3);
    a.waterAt = now;
    a.hunger = Math.min(100, a.hunger + 3);
    return { key: 'care.watered', params: { name: animalName(a) } };
  }

  function pet(id) {
    const a = find(id);
    if (!a) return null;
    if (a.trust < 25) return { key: 'care.shy' };
    a.trust = Math.min(100, a.trust + 5);
    a.happy = 1;
    return { key: 'care.petted', params: { name: animalName(a) } };
  }

  function treat(id) {
    const a = find(id);
    if (!a || !a.injured || a.treated) return null;
    if (S.inv.med <= 0) return { key: 'care.noMed' };
    S.inv.med -= 1;
    a.treated = true;
    a.treatedAt = env.now();
    a.trust = Math.min(100, a.trust + 6);
    return { key: 'care.treated', params: { name: animalName(a) } };
  }

  function nameOptions(a) {
    const list = (typeof TH_NAMES !== 'undefined' ? TH_NAMES[a.kind] : []) || [];
    const used = new Set(S.animals.filter(x => x.name).map(x => x.name[0]));
    return list.filter(n => !used.has(n[0])).slice(0, 4);
  }

  function giveName(id, pair) {
    const a = find(id);
    if (!a || a.name || a.trust < 40) return null;
    a.name = pair;
    return { key: 'care.named', params: { name: animalName(a) } };
  }

  function canAdopt(a) {
    return a.health >= 80 && a.trust >= 80 && !a.injured;
  }

  const FAMILIES = ['flower', 'teacher', 'boat', 'postman'];
  function adopt(id) {
    const a = find(id);
    if (!a) return null;
    if (!canAdopt(a)) return { key: 'care.adoptNot' };
    S.animals = S.animals.filter(x => x !== a);
    const n = 15;
    S.rice += n;
    S.log.adopted += 1;
    const fam = FAMILIES[(S.log.adopted - 1) % FAMILIES.length];
    const r = { key: 'care.adopted', params: { name: animalName(a), family: tt('family.' + fam), n } };
    note('care.adopted', { name: a.name ? a.name[0] : '', family: fam, n });
    return r;
  }

  /* ---------- 商店 ---------- */
  function broomCost() {
    return 30 * S.broom;
  }

  function buy(item) {
    if (item === 'broom') {
      if (S.broom >= BROOM_MAX) return { key: 'shop.max' };
      const c = broomCost();
      if (S.rice < c) return { key: 'shop.short' };
      S.rice -= c;
      S.broom += 1;
      return { key: 'shop.bought', params: { item: tt('shop.broom') } };
    }
    const c = COST[item];
    if (!c) return null;
    if (S.rice < c) return { key: 'shop.short' };
    S.rice -= c;
    S.inv[item] += 1;
    return { key: 'shop.bought', params: { item: tt('shop.' + item) } };
  }

  /* ---------- 修行（只记录） ---------- */
  function krapStep() {
    G.krap = (G.krap || 0) + 1;
    if (G.krap >= 3) {
      G.krap = 0;
      S.log.krap += 1;
      note('krap.done');
      return { key: 'krap.done', done: true };
    }
    return { key: 'krap.step.' + (G.krap + 1) };
  }

  function offer(kind, flower) {
    const now = env.now();
    if (kind === 'flower') {
      S.offerings.flower = flower || 'lotus';
      S.offerings.flowerAt = now;
    } else if (kind === 'candle') {
      S.offerings.candleAt = now;
    } else if (kind === 'incense') {
      S.offerings.incenseAt = now;
    } else {
      return null;
    }
    S.log.offer += 1;
    const item = kind === 'flower' ? tt('offer.' + S.offerings.flower) : tt('offer.' + kind);
    note('offer.done', { item: kind === 'flower' ? 'offer.' + S.offerings.flower : 'offer.' + kind });
    return { key: 'offer.done', params: { item } };
  }

  function chantDone(key) {
    S.log.chant += 1;
    S.log.chants[key] = (S.log.chants[key] || 0) + 1;
    const rec = TEXTS.find(r => r.key === key);
    note('chant.done', { text: key });
    return { key: 'chant.done', params: { title: rec ? rec.title[LANG] || rec.title.en : key } };
  }

  /* ---------- 布施 ---------- */
  function almsDoneToday(d) {
    return S.almsDay === dayKey(d);
  }

  function startAlms(demo) {
    const d = new Date(env.now());
    if (!demo && !almsOpen(d)) return { key: 'alms.closed' };
    if (!demo && almsDoneToday(d)) return { key: 'alms.done', params: { n: S.almsGiven } };
    G.alms = { demo: !!demo, given: 0, passed: 0, done: false };
    G.monks = [0, 1, 2].map(i => ({ id: i, x: -0.08 - i * 0.22, stopped: false, served: false, waited: 0 }));
    return { key: 'alms.waiting' };
  }

  function currentMonk() {
    return G.monks.find(m => m.stopped && !m.served) || null;
  }

  function giveAlms() {
    if (!G.alms) return null;
    const m = currentMonk();
    if (!m) return { key: 'alms.waiting' };
    if (!G.alms.demo) {
      if (S.rice < 1) return { key: 'alms.noRice' };
      S.rice -= 1;
    }
    m.served = true;
    m.stopped = false;
    G.alms.given += 1;
    return { key: 'alms.passed' };
  }

  function finishAlms() {
    const a = G.alms;
    G.alms = null;
    G.monks = [];
    if (!a) return null;
    if (a.demo) return { key: 'alms.doneDemo' };
    if (a.given > 0) {
      S.log.alms += 1;
      S.almsDay = dayKey(new Date(env.now()));
      S.almsGiven = a.given;
      note('alms.done', { n: a.given });
    }
    return { key: 'alms.done', params: { n: a.given } };
  }

  /* ---------- 每帧更新 ---------- */
  function step(dt) {
    const now = env.now();
    const d = new Date(now);
    G.clock += dt;
    /* 落叶 */
    G.pileT += dt;
    if (G.pileT >= pileEvery(d)) {
      G.pileT = 0;
      addPile();
    }
    /* 动物来访 */
    if (now >= S.nextAnimalAt) {
      const a = spawnAnimal();
      S.nextAnimalAt = now + rand(60000, 120000);
      if (a) G.events.push({ key: a.injured ? 'care.arriveInjured' : 'care.arrive', params: { kind: tt('kind.' + a.kind) } });
    }
    /* 动物：走动、饥饿、恢复 */
    S.animals.forEach(a => {
      a.hunger = Math.max(0, a.hunger - dt / 40);
      if (a.hunger > 40) a.health = Math.min(100, a.health + dt * (a.injured ? 0.02 : 0.08));
      else if (a.hunger < 15) a.health = Math.max(20, a.health - dt * 0.02);
      if (a.injured && a.treated && now - a.treatedAt > 60000) {
        a.injured = null;
        a.treated = false;
        a.health = Math.max(a.health, 70);
        G.events.push({ key: 'care.healed', params: { name: animalName(a) } });
      }
      a.happy = Math.max(0, a.happy - dt * 0.7);
      if (a.state === 'walk') {
        const dx = a.tx - a.x;
        const dy = a.ty - a.y;
        const dist = Math.hypot(dx, dy);
        const sp = (a.injured && !a.treated ? 0.025 : 0.05) * dt;
        if (dist < sp) {
          a.state = Math.random() < 0.5 ? 'sit' : 'idle';
          a.wait = rand(4, 10);
        } else {
          a.x += dx / dist * sp;
          a.y += dy / dist * sp;
          a.dir = dx >= 0 ? 1 : -1;
        }
      } else {
        a.wait -= dt;
        if (a.wait <= 0) {
          a.state = 'walk';
          a.tx = rand(0.22, 0.78);
          a.ty = rand(0.68, 0.85);
        }
      }
    });
    /* 托钵的僧人 */
    if (G.alms) {
      G.monks.forEach(m => {
        if (m.stopped) {
          m.waited += dt;
          if (m.waited > 7) {
            m.stopped = false;
            m.served = true;
            G.alms.passed += 1;
          }
          return;
        }
        const before = m.x;
        m.x += dt * 0.07;
        if (!m.served && before < 0.5 && m.x >= 0.5) {
          m.x = 0.5;
          m.stopped = true;
          m.waited = 0;
          if (G.monks.some(o => o !== m && o.stopped)) m.stopped = false;
        }
      });
      if (G.monks.every(m => m.x > 1.08)) G.events.push(Object.assign({ almsFinished: true }, finishAlms()));
    }
    /* 天气：雨季常有阵雨，午后更多 */
    G.weatherT -= dt;
    if (G.weatherT <= 0) {
      const season = seasonOf(d);
      const h = hourOf(d);
      const chance = season === 'rain' ? (h > 13 && h < 19 ? 0.55 : 0.3) : season === 'cool' ? 0.05 : 0.12;
      G.rainTarget = Math.random() < chance ? rand(0.5, 1) : 0;
      G.weatherT = rand(60, 150);
    }
    G.rain += (G.rainTarget - G.rain) * Math.min(1, dt * 0.3);
    G.wet = Math.max(0, Math.min(1, G.wet + (G.rain > 0.2 ? dt * 0.05 : -dt * 0.01)));
    G.wind = 0.3 + G.rain * 0.6;
    S.last = now;
  }

  /* 离开期间：叶子照落、动物照饿（不会饿死），最多按 12 小时算。 */
  function catchUp(now) {
    const away = Math.min(12 * 3600, Math.max(0, (now - S.last) / 1000));
    if (away < 60) return 0;
    const n = Math.floor(away / pileEvery(new Date(now)));
    for (let i = 0; i < n; i++) addPile();
    S.animals.forEach(a => {
      a.hunger = Math.max(10, a.hunger - away / 40);
      a.state = 'sit';
      a.wait = rand(2, 6);
    });
    S.last = now;
    return away / 3600;
  }

  /* 场景要画的东西。 */
  function model() {
    const now = env.now();
    const d = new Date(now);
    const o = S.offerings;
    return {
      hour: hourOf(d),
      season: seasonOf(d),
      rain: G.rain,
      wet: G.wet,
      wind: G.wind,
      moonAge: T.Calendar ? T.Calendar.moonAge(d) : 0,
      reduceMotion: reduceMotion(),
      piles: S.piles,
      animals: S.animals,
      monks: G.monks,
      highlightPiles: G.highlightUntil > G.clock,
      offerings: {
        flower: o.flower && now - o.flowerAt < 6 * 3600000 ? o.flower : null,
        candle: now - o.candleAt < 20 * 60000,
        incense: now - o.incenseAt < 20 * 60000,
      },
    };
  }

  let platformDisplay = {};
  function reduceMotion() {
    if (S && S.opt.reduceMotion != null) return !!S.opt.reduceMotion;
    if (platformDisplay.motion === 'reduce') return true;
    if (platformDisplay.motion === 'full') return false;
    try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  /* 当前的提示：按紧要程度。 */
  function hint() {
    const d = new Date(env.now());
    const h = hourOf(d);
    if (almsOpen(d) && !almsDoneToday(d)) return { key: 'hint.alms' };
    const hurt = S.animals.find(a => a.injured && !a.treated);
    if (hurt) return { key: 'hint.injured', params: { name: animalName(hurt) } };
    const hungry = S.animals.find(a => a.hunger < 30);
    if (hungry) return { key: 'hint.hungry', params: { name: animalName(hungry) } };
    if (S.piles.length >= 3) return { key: 'hint.sweep' };
    if (todayObs(d).some(o => o.id === 'obs.th.wanPhra')) return { key: 'hint.wanPhra' };
    if (h >= 20 || h < 5) return { key: 'hint.night' };
    if (phansaRange(d)) return { key: 'hint.phansa' };
    return { key: 'hint.idle' };
  }

  /* ---------- 启动（不碰 DOM） ---------- */
  function start(opts) {
    env.storage = opts.storage || null;
    if (opts.now) env.now = opts.now;
    const now = env.now();
    const loaded = load(now);
    S = loaded.s;
    const plat = readPlatform(opts.hash || '');
    platformDisplay = plat.display || {};
    const p = plat.prefs;
    if (UI_LANGS.indexOf(p.ui) >= 0) S.opt.ui = p.ui;
    if (SCRIPTS.indexOf(p.content) >= 0) S.opt.content = p.content;
    if (TRS.indexOf(p.translation) >= 0) S.opt.translation = p.translation;
    if (!S.opt.ui) S.opt.ui = (PACK && PACK.defaults.ui) || 'th';
    LANG = S.opt.ui;
    G.events = [];
    const away = catchUp(now);
    if (!S.piles.length) { addPile(); addPile(); }
    return { note: loaded.note, away };
  }

  function setLang(id) {
    if (UI_LANGS.indexOf(id) < 0) return;
    S.opt.ui = id;
    LANG = id;
  }

  const logic = {
    start, step, save, sweep, feed, water, pet, treat, giveName, nameOptions, adopt, canAdopt, buy, broomCost,
    krapStep, offer, chantDone, startAlms, giveAlms, finishAlms, currentMonk, almsOpen, almsDoneToday,
    spawnAnimal, addPile, catchUp, model, hint, seasonOf, hourOf, tod, phansaRange, todayObs, setLang, syncPlatform,
    animalName, dayKey, COST, BROOM_MAX,
  };

  /* ====================================================================== */
  /* 界面 */
  /* ====================================================================== */
  const doc = root.document;
  const $ = id => doc.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let lastFocus = null;

  function say(r) {
    if (!r || !r.key) return;
    toast(tt(r.key, r.params));
  }

  function toast(msg) {
    const el = $('toast');
    if (el) {
      el.textContent = msg;
      el.hidden = false;
      G.toastT = 3.4;
    }
    const sr = $('sr');
    if (sr) sr.textContent = msg;
  }

  function applyLang() {
    const html = doc.documentElement;
    html.lang = LANG;
    doc.title = tt('app.title');
    $('scene').setAttribute('aria-label', tt('app.label'));
    $('title').textContent = tt('app.title');
    $('platform').textContent = '‹ ' + tt('hud.platform');
    $('more').textContent = tt('hud.menu');
    const bar = { krap: 'bar.krap', offer: 'bar.offer', chant: 'bar.chant', alms: 'bar.alms', sweep: 'bar.sweep', care: 'bar.care' };
    Object.keys(bar).forEach(k => {
      const b = doc.querySelector('[data-open="' + k + '"] .lbl');
      if (b) b.textContent = tt(bar[k]);
    });
    const z = { m: 1, l: 1.12, xl: 1.25 }[platformDisplay.size];
    html.style.zoom = z && z !== 1 ? String(z) : '';
  }

  function hud() {
    const d = new Date(env.now());
    const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const bits = [tt('season.' + seasonOf(d)), tt('time.' + tod(hourOf(d))), hh];
    if (phansaRange(d)) bits.push(tt('phansa.on'));
    if (G.rain > 0.3) bits.push(tt('rain.on'));
    $('chip').textContent = bits.join(' · ');
    $('rice').textContent = tt('hud.rice', { n: S.rice });
    const h = hint();
    const text = tt(h.key, h.params);
    if ($('hint').textContent !== text) $('hint').textContent = text;
    const almsBtn = doc.querySelector('[data-open="alms"]');
    if (almsBtn) almsBtn.classList.toggle('glow', almsOpen(d) && !almsDoneToday(d));
    const careBtn = doc.querySelector('[data-open="care"]');
    if (careBtn) careBtn.classList.toggle('dot', S.animals.some(a => a.hunger < 30 || (a.injured && !a.treated)));
  }

  /* ---------- 弹出层 ---------- */
  function openSheet(kind, arg) {
    if (!G.sheet) lastFocus = doc.activeElement;
    G.sheet = { kind, arg };
    renderSheet();
    const sh = $('sheet');
    sh.hidden = false;
    $('veil').hidden = false;
    const h = sh.querySelector('h2');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }

  function closeSheet() {
    if (G.sheet && G.sheet.kind === 'chant') stopSpeech();
    if (G.sheet && G.sheet.kind === 'alms' && G.alms && !G.alms.done) {
      /* 关掉弹窗也让僧人走完，不打断。 */
    }
    G.sheet = null;
    $('sheet').hidden = true;
    $('veil').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function head(title, sub) {
    return `<div class="sh-head"><h2>${esc(title)}</h2><button type="button" class="x" data-act="close" aria-label="${esc(tt('common.close'))}">×</button></div>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}`;
  }

  function bar(label, v) {
    return `<div class="meter"><span>${esc(label)}</span><span class="track"><span style="width:${Math.round(v)}%"></span></span></div>`;
  }

  const SHEETS = {
    intro() {
      return `${head(tt('intro.title'))}
        <p>${esc(tt('intro.body'))}</p>
        <p>${esc(tt('intro.how'))}</p>
        <p class="warn">${esc(tt('intro.preview'))}</p>
        <div class="row"><button type="button" class="primary" data-act="intro-ok">${esc(tt('intro.start'))}</button></div>
        ${langPicker()}`;
    },

    krap() {
      const k = G.krap || 0;
      return `${head(tt('krap.title'), tt('krap.body'))}
        <ol class="steps">${[1, 2, 3].map(i => `<li class="${i <= k ? 'done' : i === k + 1 ? 'now' : ''}">${esc(tt('krap.step.' + i))}</li>`).join('')}</ol>
        <div class="row"><button type="button" class="primary big" data-act="krap" id="krap-btn">${esc(tt('krap.btn'))}</button></div>
        <p class="note">${esc(tt('krap.feet'))}</p>`;
    },

    offer() {
      const m = model().offerings;
      const item = (kind, sub, why) => `<div class="item"><div><b>${esc(tt('offer.' + (sub || kind)))}</b><span class="note">${esc(tt(why))}</span></div>
        <button type="button" class="secondary" data-act="offer" data-kind="${kind}" data-sub="${sub || ''}">${esc((kind === 'flower' ? m.flower === sub : m[kind]) ? tt('offer.lit') : tt('offer.give'))}</button></div>`;
      return `${head(tt('offer.title'), tt('offer.body'))}
        <div class="list">
          ${item('flower', 'lotus', 'offer.why.flower')}
          ${item('flower', 'marigold', 'offer.why.flower')}
          ${item('flower', 'jasmine', 'offer.why.flower')}
          ${item('candle', '', 'offer.why.candle')}
          ${item('incense', '', 'offer.why.incense')}
        </div>`;
    },

    chant() {
      if (!G.chant) {
        return `${head(tt('chant.title'), tt('chant.draft'))}
          <div class="list">${TEXTS.map(r => `<button type="button" class="item pick" data-act="chant-pick" data-key="${esc(r.key)}">
            <span><b lang="${LANG === 'th' ? 'th' : LANG}">${esc(r.title[LANG] || r.title.en)}</b>
            <span class="note">${esc(tt('usage.' + r.key))} · ${esc(tt('chant.lines', { n: r.text['pi-Thai'].length }))}${S.log.chants[r.key] ? ' · ✓' + S.log.chants[r.key] : ''}</span></span><span aria-hidden="true">›</span></button>`).join('')}</div>
          ${chantOptions()}`;
      }
      const r = TEXTS.find(x => x.key === G.chant.key);
      const n = r.text['pi-Thai'].length;
      const i = Math.min(G.chant.i, n);
      const finished = G.chant.i >= n;
      const voice = voiceState();
      return `${head(r.title[LANG] || r.title.en, tt('usage.' + r.key))}
        <p class="note voice">${esc(voice)}</p>
        <ol class="chant" id="chant-lines">${r.text['pi-Thai'].map((line, k) => {
          const showThai = S.opt.content !== 'pi-Latn';
          const showLatn = S.opt.content !== 'pi-Thai';
          const tr = S.opt.translation !== 'none' ? (r.translations[S.opt.translation] || [])[k] : '';
          return `<li class="${k < i ? 'past' : k === i ? 'now' : ''}" ${k === i ? 'aria-current="true"' : ''}>
            ${showThai ? `<span class="pi" lang="pi-Thai">${esc(line)}</span>` : ''}
            ${showLatn ? `<span class="la" lang="pi-Latn">${esc(r.text['pi-Latn'][k])}</span>` : ''}
            ${tr ? `<span class="tr" lang="${esc(S.opt.translation)}">${esc(tr)}</span>` : ''}
          </li>`;
        }).join('')}</ol>
        <p class="note" role="status">${esc(finished ? tt('chant.done', { title: r.title[LANG] || r.title.en }) : tt('chant.progress', { i: i + 1, n }))}</p>
        <div class="row">
          ${finished
            ? `<button type="button" class="primary" data-act="chant-again">${esc(tt('chant.again'))}</button><button type="button" class="secondary" data-act="chant-list">${esc(tt('chant.list'))}</button>`
            : `<button type="button" class="secondary" data-act="chant-prev" ${i === 0 ? 'disabled' : ''}>${esc(tt('chant.prev'))}</button>
               <button type="button" class="primary" data-act="chant-next">${esc(tt('chant.next'))}</button>
               <button type="button" class="secondary" data-act="chant-auto" aria-pressed="${G.chant.auto ? 'true' : 'false'}">${esc(G.chant.auto ? tt('chant.stop') : tt('chant.auto'))}</button>`}
        </div>
        ${chantOptions()}`;
    },

    alms() {
      const d = new Date(env.now());
      const open = almsOpen(d);
      const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      if (G.alms) {
        const m = currentMonk();
        return `${head(tt('alms.title'), G.alms.demo ? tt('alms.demoNote') : '')}
          <p>${esc(tt('alms.body'))}</p>
          <p class="note" role="status">${esc(m ? '' : tt('alms.waiting'))}</p>
          <div class="row"><button type="button" class="primary big" data-act="alms-give" ${m ? '' : 'disabled'}>${esc(tt('alms.give'))}</button></div>
          <p class="note">${esc(tt('hud.rice', { n: S.rice }))}</p>`;
      }
      if (open && almsDoneToday(d)) {
        return `${head(tt('alms.title'))}
          <p>${esc(tt('alms.done', { n: S.almsGiven }))}</p>
          <div class="item"><div><b>${esc(tt('alms.pour'))}</b><span class="note">${esc(tt('alms.pourBody'))}</span></div><button type="button" class="secondary" data-act="pour">${esc(tt('alms.pour'))}</button></div>`;
      }
      if (open) {
        return `${head(tt('alms.title'))}
          <p>${esc(tt('alms.body'))}</p>
          <div class="row"><button type="button" class="primary" data-act="alms-start">${esc(tt('alms.start'))}</button></div>
          <p class="note">${esc(tt('hud.rice', { n: S.rice }))}</p>`;
      }
      const when = hourOf(d) < 6 ? tt('alms.today') : tt('alms.tomorrow');
      return `${head(tt('alms.title'))}
        <p>${esc(tt('alms.closed', { time: hh, when }))}</p>
        <p class="note">${esc(tt('alms.body'))}</p>
        ${almsDoneToday(d) ? `<div class="item"><div><b>${esc(tt('alms.pour'))}</b><span class="note">${esc(tt('alms.pourBody'))}</span></div><button type="button" class="secondary" data-act="pour">${esc(tt('alms.pour'))}</button></div>` : ''}
        <div class="row"><button type="button" class="secondary" data-act="alms-demo">${esc(tt('alms.demo'))}</button></div>`;
    },

    care() {
      if (G.sheet.arg != null && find(G.sheet.arg)) return animalSheet(find(G.sheet.arg));
      return `${head(tt('care.title'))}
        ${S.animals.length ? `<div class="list">${S.animals.map(a => `<button type="button" class="item pick" data-act="animal" data-id="${a.id}">
          <span><b>${esc(animalName(a))}</b><span class="note">${esc(tt('kind.' + a.kind))}${a.injured ? ' · ' + esc(a.treated ? tt('care.healing') : tt('care.injured', { what: tt('inj.' + a.injured) })) : ''}</span>
          ${bar(tt('care.hunger'), a.hunger)}</span><span aria-hidden="true">›</span></button>`).join('')}</div>` : `<p>${esc(tt('care.empty'))}</p>`}
        <div class="row"><button type="button" class="secondary" data-act="open" data-to="shop">${esc(tt('menu.shop'))}</button></div>`;
    },

    shop() {
      const row = (item, label, cost, extra) => `<div class="item"><div><b>${esc(label)}</b><span class="note">${esc(tt('shop.cost', { n: cost }))}${extra ? ' · ' + esc(extra) : ''}</span></div>
        <button type="button" class="secondary" data-act="buy" data-item="${item}" ${S.rice < cost ? 'aria-disabled="true"' : ''}>${esc(tt('shop.buy'))}</button></div>`;
      return `${head(tt('shop.title'), tt('shop.note'))}
        <p><b>${esc(tt('hud.rice', { n: S.rice }))}</b></p>
        <div class="list">
          ${row('dogfood', tt('shop.dogfood'), COST.dogfood, tt('shop.have', { n: S.inv.dogfood }))}
          ${row('catfood', tt('shop.catfood'), COST.catfood, tt('shop.have', { n: S.inv.catfood }))}
          ${row('med', tt('shop.med'), COST.med, tt('shop.have', { n: S.inv.med }))}
          ${S.broom >= BROOM_MAX ? `<div class="item"><div><b>${esc(tt('shop.max'))}</b></div></div>` : row('broom', tt('shop.broom'), broomCost(), tt('shop.level', { n: S.broom }))}
        </div>`;
    },

    calendar() {
      const d = new Date(env.now());
      let dateText = '';
      try {
        dateText = new Intl.DateTimeFormat(LANG === 'th' ? 'th-TH-u-ca-buddhist' : LANG, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(d);
        if (LANG !== 'th') dateText += ' · BE ' + new Intl.DateTimeFormat('en-u-ca-buddhist', { year: 'numeric' }).format(d).replace(/\D+/g, '');
      } catch (e) { dateText = dayKey(d); }
      const today = todayObs(d);
      const ph = phansaRange(d) || ((PACK && PACK.calendar.phansa) || []).find(r => r[0] >= dayKey(d));
      const next = T.Calendar ? T.Calendar.upcoming(PACK.calendar, d, 200, 8).filter(o => o.inDays > 0).slice(0, 5) : [];
      const fmt = iso => {
        try { return new Intl.DateTimeFormat(LANG === 'th' ? 'th-TH' : LANG, { month: 'short', day: 'numeric' }).format(new Date(iso + 'T12:00:00+07:00')); } catch (e) { return iso; }
      };
      const nm = o => tt(o.id) + (o.approx ? tt('cal.approx') : '');
      return `${head(tt('cal.title'))}
        <p>${esc(tt('cal.today', { date: dateText }))}</p>
        ${today.map(o => `<p class="today">${esc(tt('cal.todayIs', { name: nm(o) }))}</p>`).join('')}
        ${phansaRange(d) ? `<p class="today">${esc(tt('cal.inPhansa'))}</p>` : ''}
        ${ph ? `<p class="note">${esc(tt('cal.phansa', { from: fmt(ph[0]), to: fmt(ph[1]) }))}</p>` : ''}
        <h3>${esc(tt('cal.next'))}</h3>
        <ul class="plain">${next.map(o => `<li>${esc(nm(o))} <span class="note">${esc(fmt(o.date))} · ${esc(o.inDays === 1 ? tt('cal.tomorrow') : tt('cal.inDays', { n: o.inDays }))}</span></li>`).join('')}</ul>
        <p class="note">${esc(tt('cal.note'))}</p>`;
    },

    journal() {
      const L = S.log;
      const rows = [['krap', L.krap], ['offer', L.offer], ['chant', L.chant], ['alms', L.alms], ['sweep', L.sweep], ['adopted', L.adopted]];
      const recent = S.journal.slice(-10).reverse();
      const fmtT = ms => {
        try { return new Intl.DateTimeFormat(LANG === 'th' ? 'th-TH' : LANG, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ms)); } catch (e) { return ''; }
      };
      const line = e => {
        const p = Object.assign({}, e.params);
        if (e.key === 'offer.done') p.item = tt(p.item);
        if (e.key === 'chant.done') {
          const r = TEXTS.find(x => x.key === p.text);
          p.title = r ? r.title[LANG] || r.title.en : p.text;
        }
        if (e.key === 'care.adopted') { p.family = tt('family.' + p.family); }
        return tt(e.key, p);
      };
      return `${head(tt('journal.title'), tt('journal.note'))}
        <dl class="counts">${rows.map(([k, n]) => `<dt>${esc(tt('journal.' + k))}</dt><dd>${esc(tt('journal.times', { n }))}</dd>`).join('')}</dl>
        <h3>${esc(tt('journal.recent'))}</h3>
        ${recent.length ? `<ul class="plain">${recent.map(e => `<li>${esc(line(e))} <span class="note">${esc(fmtT(e.t))}</span></li>`).join('')}</ul>` : `<p class="note">${esc(tt('journal.empty'))}</p>`}`;
    },

    settings() {
      const radios = (name, list, cur, label) => `<fieldset><legend>${esc(label)}</legend><div class="opts">${list.map(([v, l, extra]) => `<label><input type="radio" name="${name}" value="${esc(v)}" ${cur === v ? 'checked' : ''}> <span>${esc(l)}</span>${extra ? `<small>${esc(extra)}</small>` : ''}</label>`).join('')}</div></fieldset>`;
      return `${head(tt('set.title'), tt('set.note'))}
        ${langPicker()}
        ${radios('script', SCRIPTS.map(s => [s, tt('script.' + s)]), S.opt.content, tt('set.script'))}
        ${radios('tr', TRS.map(s => [s, tt('tr.' + s), s === 'none' ? '' : tt('common.draft')]), S.opt.translation, tt('set.tr'))}
        ${radios('speak', [['on', tt('set.voice.sys.th'), tt('chant.voiceKind')], ['off', tt('set.voice.off')]], S.opt.speak ? 'on' : 'off', tt('set.voice'))}
        ${radios('sound', [['on', tt('set.on')], ['off', tt('set.off')]], S.opt.sound ? 'on' : 'off', tt('set.sound'))}
        ${radios('motion', [['on', tt('set.on')], ['off', tt('set.off')]], reduceMotion() ? 'on' : 'off', tt('set.motion'))}`;
    },

    more() {
      const b = (to, key) => `<button type="button" class="item pick" data-act="open" data-to="${to}"><b>${esc(tt(key))}</b><span aria-hidden="true">›</span></button>`;
      return `${head(tt('hud.menu'))}
        <div class="list">${b('calendar', 'menu.calendar')}${b('journal', 'menu.journal')}${b('shop', 'menu.shop')}${b('settings', 'menu.settings')}
        <a class="item pick" href="${esc(platformHref())}"><b>${esc(tt('menu.platform'))}</b><span aria-hidden="true">›</span></a></div>`;
    },
  };

  function langPicker() {
    return `<fieldset><legend>${esc(tt('set.ui'))}</legend><div class="opts">${UI_LANGS.map(id => `<label><input type="radio" name="ui" value="${id}" ${S.opt.ui === id ? 'checked' : ''}> <span lang="${id}">${id === 'th' ? 'ไทย' : id === 'en' ? 'English' : '简体中文'}</span>${id !== 'zh-CN' ? `<small>${esc(tt('common.draft'))}</small>` : ''}</label>`).join('')}</div></fieldset>`;
  }

  function chantOptions() {
    return `<details class="opts-box"><summary>${esc(tt('set.script'))} · ${esc(tt('set.tr'))}</summary>
      <div class="opts inline">${SCRIPTS.map(s => `<label><input type="radio" name="script" value="${s}" ${S.opt.content === s ? 'checked' : ''}> ${esc(tt('script.' + s))}</label>`).join('')}</div>
      <div class="opts inline">${TRS.map(s => `<label><input type="radio" name="tr" value="${s}" ${S.opt.translation === s ? 'checked' : ''}> ${esc(tt('tr.' + s))}</label>`).join('')}</div>
    </details>`;
  }

  function animalSheet(a) {
    const opts = !a.name && a.trust >= 40 ? nameOptions(a) : [];
    const food = a.kind === 'dog' ? 'dogfood' : 'catfood';
    return `${head(animalName(a), tt('kind.' + a.kind) + (a.injured ? ' · ' + (a.treated ? tt('care.healing') : tt('care.injured', { what: tt('inj.' + a.injured) })) : ''))}
      ${bar(tt('care.hunger'), a.hunger)}${bar(tt('care.health'), a.health)}${bar(tt('care.trust'), a.trust)}
      <div class="grid-btns">
        <button type="button" class="secondary" data-act="feed" data-id="${a.id}">${esc(tt('care.feed', { food: tt('food.' + food) }))} <small>×${S.inv[food]}</small></button>
        <button type="button" class="secondary" data-act="water" data-id="${a.id}">${esc(tt('care.water'))}</button>
        <button type="button" class="secondary" data-act="pet" data-id="${a.id}">${esc(tt('care.pet'))}</button>
        ${a.injured && !a.treated ? `<button type="button" class="secondary" data-act="treat" data-id="${a.id}">${esc(tt('care.treat'))} <small>×${S.inv.med}</small></button>` : ''}
      </div>
      ${opts.length ? `<h3>${esc(tt('care.pickName'))}</h3><div class="grid-btns">${opts.map((n, i) => `<button type="button" class="secondary" data-act="name" data-id="${a.id}" data-i="${i}"><span lang="th">${esc(n[0])}</span> <small>${esc(n[1])}</small></button>`).join('')}</div>` : ''}
      <p class="note">${esc(canAdopt(a) ? tt('care.adoptReady') : tt('care.adoptNot'))}</p>
      <div class="row"><button type="button" class="primary" data-act="adopt" data-id="${a.id}" ${canAdopt(a) ? '' : 'aria-disabled="true"'}>${esc(tt('care.adopt'))}</button>
      <button type="button" class="secondary" data-act="open" data-to="care">${esc(tt('common.back'))}</button></div>`;
  }

  function renderSheet() {
    if (!G.sheet) return;
    const f = SHEETS[G.sheet.kind];
    const sh = $('sheet');
    const keep = doc.activeElement && sh.contains(doc.activeElement) ? doc.activeElement.getAttribute('data-act') + '|' + (doc.activeElement.getAttribute('data-id') || doc.activeElement.getAttribute('data-kind') || doc.activeElement.value || '') : null;
    sh.innerHTML = f ? f() : '';
    sh.setAttribute('aria-label', (sh.querySelector('h2') || {}).textContent || '');
    if (keep) {
      const [act, extra] = keep.split('|');
      const el = Array.from(sh.querySelectorAll('[data-act="' + act + '"], input')).find(e => (e.getAttribute('data-act') === act || e.value === extra) && (!extra || e.getAttribute('data-id') === extra || e.getAttribute('data-kind') === extra || e.value === extra));
      if (el) el.focus({ preventScroll: true });
    }
    const now = sh.querySelector('.chant .now');
    if (now && now.scrollIntoView) now.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  function platformHref() {
    return '../../../index.html#view=pack&v=' + VERSION_ID;
  }

  /* ---------- 朗读 ---------- */
  let thaiVoice = null;
  function findVoice() {
    try {
      const vs = root.speechSynthesis ? root.speechSynthesis.getVoices() : [];
      thaiVoice = vs.find(v => /^th(-|_|$)/i.test(v.lang)) || null;
    } catch (e) { thaiVoice = null; }
    return thaiVoice;
  }

  function voiceState() {
    if (!S.opt.speak) return tt('chant.voiceOff');
    if (!root.speechSynthesis || !findVoice()) return tt('chant.voiceNone');
    return tt('set.voice.sys.th') + ' · ' + tt('chant.voiceKind');
  }

  let speakTimer = null;
  function stopSpeech() {
    clearTimeout(speakTimer);
    try { if (root.speechSynthesis) root.speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
  }

  function speakLine(after) {
    stopSpeech();
    const r = TEXTS.find(x => x.key === G.chant.key);
    const line = r && r.text['pi-Thai'][G.chant.i];
    if (!line) return;
    const fallback = () => { speakTimer = setTimeout(after, 1200 + [...line].length * 70); };
    if (!S.opt.speak || !root.speechSynthesis || !findVoice()) {
      if (after) fallback();
      return;
    }
    try {
      const u = new root.SpeechSynthesisUtterance(line);
      const v = (T.VOICES || {})['sys.th'] || { tts: { rate: 0.82, pitch: 0.9 } };
      u.lang = 'th-TH';
      u.voice = thaiVoice;
      u.rate = v.tts.rate;
      u.pitch = v.tts.pitch;
      let doneOnce = false;
      const done = () => { if (!doneOnce) { doneOnce = true; if (after) speakTimer = setTimeout(after, 450); } };
      u.onend = done;
      u.onerror = done;
      root.speechSynthesis.speak(u);
      /* 有的浏览器不触发 onend：按长度兜底。 */
      if (after) setTimeout(() => { if (!doneOnce && !root.speechSynthesis.speaking) done(); }, 2500 + [...line].length * 120);
    } catch (e) {
      if (after) fallback();
    }
  }

  function chantAdvance(auto) {
    const r = TEXTS.find(x => x.key === G.chant.key);
    const n = r.text['pi-Thai'].length;
    G.chant.i += 1;
    if (G.chant.i >= n) {
      G.chant.auto = false;
      stopSpeech();
      say(chantDone(r.key));
      sound('chime');
    } else if (auto && G.chant.auto) {
      speakLine(() => { if (G.chant && G.chant.auto) { chantAdvance(true); renderSheet(); } });
    } else {
      speakLine(null);
    }
    renderSheet();
  }

  /* ---------- 环境声 ---------- */
  let AC = null;
  let rainNode = null;
  function audio() {
    if (AC || !S.opt.sound) return AC;
    try {
      const C = root.AudioContext || root.webkitAudioContext;
      if (C) AC = new C();
    } catch (e) { AC = null; }
    return AC;
  }

  function sound(kind) {
    if (!S.opt.sound) return;
    const ac = audio();
    if (!ac) return;
    const t0 = ac.currentTime;
    const out = ac.createGain();
    out.connect(ac.destination);
    if (kind === 'chime') {
      const base = [1318, 1568, 1760, 2093][Math.floor(Math.random() * 4)];
      [1, 2.76, 5.4].forEach((m, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.frequency.value = base * m;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.05 / (i + 1), t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.2 / (i + 1));
        o.connect(g).connect(out);
        o.start(t0);
        o.stop(t0 + 2.4);
      });
    } else if (kind === 'bird') {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      const f = 2600 + Math.random() * 1200;
      o.frequency.setValueAtTime(f, t0);
      o.frequency.exponentialRampToValueAtTime(f * 1.4, t0 + 0.08);
      o.frequency.exponentialRampToValueAtTime(f * 0.9, t0 + 0.16);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.025, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
      o.connect(g).connect(out);
      o.start(t0);
      o.stop(t0 + 0.25);
    } else if (kind === 'sweep') {
      const len = Math.floor(ac.sampleRate * 0.35);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len) * 0.25;
      const src = ac.createBufferSource();
      const f = ac.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 2400;
      src.buffer = buf;
      src.connect(f).connect(out);
      src.start(t0);
    }
  }

  function rainSound() {
    const ac = AC;
    if (!ac) return;
    const want = S.opt.sound ? G.rain : 0;
    if (!rainNode && want > 0.05) {
      const len = ac.sampleRate * 2;
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const f = ac.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1400;
      const g = ac.createGain();
      g.gain.value = 0;
      src.connect(f).connect(g).connect(ac.destination);
      src.start();
      rainNode = { src, g };
    }
    if (rainNode) rainNode.g.gain.value = want * 0.05;
  }

  /* ---------- 事件 ---------- */
  function act(e) {
    const el = e.target.closest('[data-act], [data-open]');
    if (!el) return;
    audio();
    const open = el.getAttribute('data-open');
    if (open) {
      if (open === 'sweep') {
        const r = sweep(null);
        if (r.key === 'sweep.none' || r.key === 'sweep.half' || r.key === 'sweep.got') G.highlightUntil = G.clock + 3;
        say(r);
        if (r.key !== 'sweep.none') sound('sweep');
        save();
        return;
      }
      if (open === 'chant') G.chant = null;
      if (open === 'krap') G.krap = 0;
      openSheet(open, null);
      return;
    }
    const a = el.getAttribute('data-act');
    if (el.getAttribute('aria-disabled') === 'true' && a !== 'adopt' && a !== 'buy') return;
    const id = Number(el.getAttribute('data-id'));
    let r = null;
    switch (a) {
      case 'close': closeSheet(); return;
      case 'intro-ok':
        S.seenIntro = true;
        save();
        closeSheet();
        return;
      case 'open':
        G.sheet = { kind: el.getAttribute('data-to'), arg: null };
        renderSheet();
        { const h = $('sheet').querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
        return;
      case 'krap':
        r = krapStep();
        el.disabled = true;
        setTimeout(() => { renderSheet(); }, reduceMotion() ? 0 : 900);
        if (r.done) { say(r); sound('chime'); } else { const sr = $('sr'); if (sr) sr.textContent = tt(r.key); }
        save();
        return;
      case 'offer': r = offer(el.getAttribute('data-kind'), el.getAttribute('data-sub') || null); break;
      case 'chant-pick':
        G.chant = { key: el.getAttribute('data-key'), i: 0, auto: false };
        renderSheet();
        speakLine(null);
        { const h = $('sheet').querySelector('h2'); if (h) h.focus({ preventScroll: true }); }
        return;
      case 'chant-next': chantAdvance(false); save(); return;
      case 'chant-prev': G.chant.i = Math.max(0, G.chant.i - 1); speakLine(null); renderSheet(); return;
      case 'chant-auto':
        G.chant.auto = !G.chant.auto;
        if (G.chant.auto) speakLine(() => { if (G.chant && G.chant.auto) { chantAdvance(true); renderSheet(); save(); } });
        else stopSpeech();
        renderSheet();
        return;
      case 'chant-again': G.chant.i = 0; G.chant.auto = false; speakLine(null); renderSheet(); return;
      case 'chant-list': G.chant = null; stopSpeech(); renderSheet(); return;
      case 'alms-start': r = startAlms(false); break;
      case 'alms-demo': r = startAlms(true); break;
      case 'alms-give': r = giveAlms(); break;
      case 'pour': note('alms.pourDone'); r = { key: 'alms.pourDone' }; sound('chime'); break;
      case 'animal': G.sheet.arg = id; renderSheet(); { const h = $('sheet').querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } } return;
      case 'feed': r = feed(id); break;
      case 'water': r = water(id); break;
      case 'pet': r = pet(id); break;
      case 'treat': r = treat(id); break;
      case 'name': { const an = find(id); const opt = an ? nameOptions(an)[Number(el.getAttribute('data-i'))] : null; r = opt ? giveName(id, opt) : null; break; }
      case 'adopt': r = adopt(id); if (r && r.key === 'care.adopted') G.sheet.arg = null; break;
      case 'buy': r = buy(el.getAttribute('data-item')); break;
      default: return;
    }
    say(r);
    save();
    renderSheet();
  }

  function change(e) {
    const el = e.target;
    if (!el.name) return;
    if (el.name === 'ui') {
      setLang(el.value);
      applyLang();
      syncPlatform();
    } else if (el.name === 'script') {
      S.opt.content = el.value;
      syncPlatform();
    } else if (el.name === 'tr') {
      S.opt.translation = el.value;
      syncPlatform();
    } else if (el.name === 'speak') {
      S.opt.speak = el.value === 'on';
      if (!S.opt.speak) stopSpeech();
    } else if (el.name === 'sound') {
      S.opt.sound = el.value === 'on';
      rainSound();
    } else if (el.name === 'motion') {
      S.opt.reduceMotion = el.value === 'on';
    } else {
      return;
    }
    save();
    renderSheet();
    hud();
  }

  function onCanvas(e) {
    if (G.sheet) return;
    audio();
    const r = $('scene').getBoundingClientRect();
    const hit = Scene.hit(e.clientX - r.left, e.clientY - r.top, model());
    if (!hit) return;
    if (hit.type === 'pile') {
      const res = sweep(hit.id);
      say(res);
      sound('sweep');
      save();
    } else if (hit.type === 'animal') {
      openSheet('care', hit.id);
    }
  }

  /* ---------- 主循环 ---------- */
  let lastT = 0;
  let hudT = 0;
  let ambT = 4;
  function frame(ts) {
    /* 按真实经过的时间推进（最多 2 秒），分成小步，掉帧时僧人和动物也不会变慢。 */
    let left = Math.min(2, lastT ? (ts - lastT) / 1000 : 0.016);
    const dt = left;
    lastT = ts;
    while (left > 0) {
      step(Math.min(0.1, left));
      left -= 0.1;
    }
    G.events.splice(0).forEach(ev => {
      say(ev);
      if (ev.almsFinished && G.sheet && G.sheet.kind === 'alms') renderSheet();
    });
    if (G.alms && G.sheet && G.sheet.kind === 'alms') {
      const btn = $('sheet').querySelector('[data-act="alms-give"]');
      const ready = !!currentMonk();
      if (btn && btn.disabled === ready) renderSheet();
    }
    Scene.draw(model(), G.clock);
    hudT -= dt;
    if (hudT <= 0) {
      hud();
      hudT = 1;
    }
    if (G.toastT > 0) {
      G.toastT -= dt;
      if (G.toastT <= 0) $('toast').hidden = true;
    }
    ambT -= dt;
    if (ambT <= 0 && AC) {
      const h = hourOf(new Date(env.now()));
      if (Math.random() < 0.5 + G.wind * 0.3) sound('chime');
      else if (h > 5.5 && h < 18.5 && G.rain < 0.2) sound('bird');
      ambT = rand(5, 11);
    }
    if (AC) rainSound();
    G.saveT += dt;
    if (G.saveT > 5) {
      G.saveT = 0;
      if (!save()) toast(tt('toast.saveFailed'));
    }
    root.requestAnimationFrame(frame);
  }

  function boot() {
    let storage = null;
    try { storage = root.localStorage; } catch (e) { storage = null; }
    const res = start({ storage, hash: root.location.hash });
    Scene.init($('scene'));
    applyLang();
    hud();
    doc.addEventListener('click', act);
    doc.addEventListener('change', change);
    $('scene').addEventListener('click', onCanvas);
    $('more').addEventListener('click', () => openSheet('more'));
    $('veil').addEventListener('click', closeSheet);
    $('platform').setAttribute('href', platformHref());
    doc.addEventListener('keydown', e => { if (e.key === 'Escape' && G.sheet) closeSheet(); });
    root.addEventListener('resize', () => Scene.resize());
    doc.addEventListener('visibilitychange', () => { if (doc.hidden) save(); });
    root.addEventListener('pagehide', save);
    if (root.speechSynthesis && root.speechSynthesis.addEventListener) root.speechSynthesis.addEventListener('voiceschanged', findVoice);
    findVoice();
    if (!S.seenIntro) openSheet('intro');
    else if (res.away >= 1) toast(tt('toast.welcomeBack', { h: Math.floor(res.away), n: Math.floor(res.away) }));
    root.requestAnimationFrame(frame);
  }

  return { logic, boot, tt, get S() { return S; }, G, env, setNow: f => { env.now = f; } };
})();
