/*
 * 庭院引擎：所有新传统共用的玩法骨架。每个传统只提供一个定义（文案、功课、场景画法），不复制规则代码。
 * - 规则（Courtyard.logic）不碰 DOM，测试直接调用；界面（ui）只负责渲染和事件。
 * - 资源循环和平台底线一致：干活（扫院子、做饭、整理物资）得资源；资源只用来照顾动物或招待客人；
 *   一切宗教功课（礼拜、供奉、诵读、计数、静坐、阅读）只记入功课簿，不产出任何东西。
 * - 定义格式见 Courtyard.define 的注释；场景由各传统的 scene(ctx, w, h, m, K) 画建筑，引擎画天空、地面、
 *   落叶堆、动物、来客和天气（K = CourtyardKit）。
 */
var Courtyard = (function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  const T = root.Threshold || (root.Threshold = {});
  const PLATFORM_KEY = 'threshold-save-v1';
  const MIN = 60000;
  const HOUR = 3600000;

  let DEF = null;
  let PACK = null;
  let TEXTS = [];
  const env = { now: () => Date.now(), storage: null, missing: new Set(), rand: Math.random };
  let S = null;
  const G = { sheet: null, sheetArg: null, toastT: 0, clock: 0, pileT: 0, saveT: 0, read: null, count: null, timer: null, rain: 0, rainTarget: 0, weatherT: 40, hintKey: '', audio: null };

  /*
   * define(def)：
   *   id, saveKey, tz, langs, defaultLang, theme { hud, bar, btn, btnInk, accent, paper, stage }
   *   msg { 'zh-CN': {...}, en: {...} }            传统自己的文案
   *   resource { icon, start }                      文案 res.name
   *   chore { icon, gain, every, max, pile }        文案 chore.label / chore.pile / chore.got
   *   care { mode: 'animals' | 'guests', kinds, max, every, adoptGift, names, families, guestsWho }
   *   shop [ 'food.dog', 'med', 'tool' ... ]        guests 模式不用小卖部
   *   practices [ { id, icon, kind: steps|offer|read|count|timer|learn, ... } ]
   *   seasons(month) → 季节 key；rest(date, hour) → 休息日名称 key 或 null（例如安息日）
   *   scene(ctx, w, h, m, K)                         画建筑和专属景物
   */
  function define(def) {
    DEF = def;
    PACK = (T.PACKS || {})[def.id] || null;
    TEXTS = (T.CONTENT || {})[def.id] || [];
    dictCache = {};
    return api;
  }

  /* ---------- 文案 ---------- */
  let LANG = 'zh-CN';
  let dictCache = {};
  const plurals = {};
  function dict(id) {
    if (!dictCache[id]) dictCache[id] = Object.assign({}, (T.MESSAGES && T.MESSAGES[id]) || {}, (typeof CY_MSG !== 'undefined' && CY_MSG[id]) || {}, (DEF && DEF.msg && DEF.msg[id]) || {});
    return dictCache[id];
  }
  function has(key) {
    return [LANG, 'en', 'zh-CN'].some(id => Object.prototype.hasOwnProperty.call(dict(id), key));
  }
  function tt(key, p) {
    let v = null;
    for (const id of [LANG, 'en', 'zh-CN']) {
      const d = dict(id);
      if (Object.prototype.hasOwnProperty.call(d, key)) {
        v = d[key];
        if (v && typeof v === 'object') {
          if (!plurals[id]) { try { plurals[id] = new Intl.PluralRules(id); } catch (e) { plurals[id] = { select: () => 'other' }; } }
          const cat = plurals[id].select(p && typeof p.n === 'number' ? p.n : 0);
          v = v[cat] != null ? v[cat] : v.other;
        }
        break;
      }
    }
    if (v == null) { env.missing.add(key); return '⟦' + key + '⟧'; }
    return String(v).replace(/\{(\w+)\}/g, (m, k) => (p && p[k] != null ? String(p[k]) : m));
  }
  function setLang(id) {
    LANG = (DEF.langs || ['zh-CN']).indexOf(id) >= 0 ? id : (DEF.defaultLang || 'zh-CN');
    if (S) S.opt.ui = LANG;
    if (typeof document !== 'undefined') document.documentElement.lang = LANG;
    return LANG;
  }

  /* ---------- 时间 ---------- */
  const fmtCache = {};
  function hourOf(ms) {
    const tz = DEF.tz || 'UTC';
    try {
      if (!fmtCache[tz]) fmtCache[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
      let h = 0, m = 0;
      fmtCache[tz].formatToParts(new Date(ms)).forEach(p => { if (p.type === 'hour') h = +p.value; if (p.type === 'minute') m = +p.value; });
      return h + m / 60;
    } catch (e) { return new Date(ms).getHours(); }
  }
  function dayKey(ms) { return T.Calendar ? T.Calendar.isoDay(new Date(ms), DEF.tz || 'UTC') : new Date(ms).toISOString().slice(0, 10); }
  function monthOf(ms) { return parseInt(dayKey(ms).slice(5, 7), 10); }
  function weekdayOf(ms) { return new Date(dayKey(ms) + 'T12:00:00Z').getUTCDay(); }
  function tod(h) { return h < 5 ? 'night' : h < 8 ? 'dawn' : h < 11 ? 'morning' : h < 13 ? 'noon' : h < 17 ? 'afternoon' : h < 19.5 ? 'evening' : 'night'; }
  function seasonOf(ms) {
    const mo = monthOf(ms);
    if (DEF.seasons) return DEF.seasons(mo);
    return mo <= 2 || mo === 12 ? 'winter' : mo <= 5 ? 'spring' : mo <= 8 ? 'summer' : 'autumn';
  }
  function clockText(h) { const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
  function todayObs(d) { return T.Calendar && PACK && PACK.calendar ? T.Calendar.observancesOn(PACK.calendar, d || new Date(env.now())) : []; }
  function restNow() { return DEF.rest ? DEF.rest(new Date(env.now()), hourOf(env.now()), weekdayOf(env.now())) : null; }

  /* ---------- 平台选择 ---------- */
  function readJSON(k) {
    try { const raw = env.storage && env.storage.getItem(k); const v = raw ? JSON.parse(raw) : null; return v && typeof v === 'object' ? v : null; } catch (e) { return null; }
  }
  function opts(field) { return (PACK && PACK.options && PACK.options[field]) || []; }
  function okOpt(field, id) { return opts(field).some(o => o.id === id && o.state !== 'off'); }
  function readPlatform(hash) {
    const plat = readJSON(PLATFORM_KEY);
    const out = Object.assign({}, (plat && plat.prefs && plat.prefs[DEF.id]) || {});
    String(hash || '').replace(/^#/, '').split('&').forEach(pair => {
      const i = pair.indexOf('=');
      if (i < 0) return;
      const k = decodeURIComponent(pair.slice(0, i)), v = decodeURIComponent(pair.slice(i + 1));
      if (k === 'ui') out.ui = v;
      if (k === 'src') out.content = v;
      if (k === 'tr') out.translation = v;
      if (k === 'voice') out.voice = v;
    });
    return { prefs: out, display: (plat && plat.display) || {} };
  }
  function syncPlatform() {
    const plat = readJSON(PLATFORM_KEY);
    if (!plat) return;
    plat.prefs = plat.prefs && typeof plat.prefs === 'object' ? plat.prefs : {};
    plat.prefs[DEF.id] = { ui: S.opt.ui, content: S.opt.script, translation: S.opt.tr, voice: S.opt.voice };
    try { env.storage.setItem(PLATFORM_KEY, JSON.stringify(plat)); } catch (e) { /* 写不进就算了 */ }
  }

  /* ---------- 存档 ---------- */
  function kinds() { return (DEF.care && DEF.care.mode === 'animals' && DEF.care.kinds) || []; }
  function fresh(now) {
    const inv = { med: 0 };
    kinds().forEach(k => { inv['food.' + k] = 1; });
    const d = (PACK && PACK.defaults) || {};
    return {
      ver: 1, createdAt: now, last: now, seenIntro: false,
      res: (DEF.resource && DEF.resource.start) || 12, tool: 1, inv,
      piles: [], pileSeq: 1, animals: [], animalSeq: 1, nextAnimalAt: now + 15000,
      guests: [], guestSeq: 1, nextGuestAt: now + 8000,
      log: { chore: 0, adopted: 0, served: 0, read: 0, prac: {}, texts: {} },
      journal: [], days: {}, offered: {},
      opt: { ui: null, script: d.content || (opts('content')[0] || {}).id || 'orig', tr: d.translation || 'none', voice: d.voice || 'off', sound: true, reduceMotion: null },
    };
  }
  function merge(s, now) {
    const f = fresh(now);
    const out = Object.assign(f, s);
    out.inv = Object.assign(fresh(now).inv, s.inv || {});
    out.log = Object.assign(fresh(now).log, s.log || {});
    out.log.prac = Object.assign({}, (s.log && s.log.prac) || {});
    out.log.texts = Object.assign({}, (s.log && s.log.texts) || {});
    out.opt = Object.assign(fresh(now).opt, s.opt || {});
    out.days = Object.assign({}, s.days || {});
    out.offered = Object.assign({}, s.offered || {});
    out.piles = Array.isArray(s.piles) ? s.piles.filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y)) : [];
    out.animals = Array.isArray(s.animals) ? s.animals.filter(a => a && kinds().indexOf(a.kind) >= 0) : [];
    out.guests = Array.isArray(s.guests) ? s.guests.filter(g => g && Number.isFinite(g.x)) : [];
    out.journal = Array.isArray(s.journal) ? s.journal.slice(-40) : [];
    if (!Number.isFinite(out.res) || out.res < 0) out.res = f.res;
    out.tool = Math.min(4, Math.max(1, Math.floor(Number(out.tool) || 1)));
    return out;
  }
  function load(now) {
    const main = readJSON(DEF.saveKey);
    if (main) return { s: merge(main, now), note: '' };
    const bak = readJSON(DEF.saveKey + '.bak');
    if (bak) return { s: merge(bak, now), note: 'restored' };
    return { s: fresh(now), note: '' };
  }
  function save() {
    if (!S || !env.storage) return true;
    S.last = env.now();
    try {
      const prev = env.storage.getItem(DEF.saveKey);
      if (prev) env.storage.setItem(DEF.saveKey + '.bak', prev);
      env.storage.setItem(DEF.saveKey, JSON.stringify(S));
      return true;
    } catch (e) { return false; }
  }

  /* ---------- 规则 ---------- */
  const events = [];
  function emit(key, p) { events.push({ key, p: p || {} }); }
  function note(kind, extra) {
    S.journal.push(Object.assign({ kind, at: env.now() }, extra || {}));
    if (S.journal.length > 40) S.journal.splice(0, S.journal.length - 40);
  }
  function r01() { return env.rand(); }

  function choreSpots() { return (DEF.chore && DEF.chore.spots) || [[0.08, 0.74, 0.92, 0.93]]; }
  function addPile() {
    const max = (DEF.chore && DEF.chore.max) || 6;
    if (S.piles.length >= max) return null;
    const spots = choreSpots();
    const sp = spots[Math.floor(r01() * spots.length)];
    const p = { id: S.pileSeq++, x: sp[0] + r01() * (sp[2] - sp[0]), y: sp[1] + r01() * (sp[3] - sp[1]), left: 2 };
    S.piles.push(p);
    return p;
  }
  function gain() { return ((DEF.chore && DEF.chore.gain) || 3) + (S.tool - 1); }
  function sweep(id) {
    const rest = restNow();
    if (rest) { emit('chore.rest', { name: tt(rest) }); return 0; }
    const p = S.piles.find(x => x.id === id);
    if (!p) return 0;
    p.left--;
    if (p.left > 0) { emit('chore.half'); return 0; }
    S.piles = S.piles.filter(x => x !== p);
    const n = gain();
    S.res += n;
    S.log.chore++;
    note('chore');
    emit('chore.got', { n, res: tt('res.name') });
    return n;
  }

  /* 动物 */
  const INJ = { dog: ['leg', 'skin', 'eye'], cat: ['leg', 'skin', 'eye'], cow: ['leg', 'skin'], bird: ['wing'] };
  function spawnAnimal(kind, injured) {
    const c = DEF.care;
    if (!c || c.mode !== 'animals' || S.animals.length >= (c.max || 4)) return null;
    const ks = kinds();
    kind = kind || ks[Math.floor(r01() * ks.length)];
    const hurt = injured != null ? injured : r01() < 0.45;
    const zone = c.zone || [0.1, 0.78, 0.9, 0.92];
    const a = {
      id: S.animalSeq++, kind, name: '', full: 0.25 + r01() * 0.3, trust: kind === 'cow' ? 0.5 : 0.1, water: 0.4,
      injury: hurt ? INJ[kind][Math.floor(r01() * INJ[kind].length)] : null, healAt: 0,
      x: zone[0] + r01() * (zone[2] - zone[0]), y: zone[1] + r01() * (zone[3] - zone[1]), tx: 0, ty: 0, dir: 1, since: env.now(),
    };
    a.tx = a.x; a.ty = a.y;
    S.animals.push(a);
    emit(hurt ? 'care.arriveHurt' : 'care.arrive', { kind: tt('kind.' + kind) });
    return a;
  }
  function animal(id) { return S.animals.find(a => a.id === id) || null; }
  function animalName(a) { return a.name || tt('care.unnamed', { kind: tt('kind.' + a.kind) }); }
  function feed(id) {
    const a = animal(id);
    if (!a) return false;
    const k = 'food.' + a.kind;
    if (a.full > 0.85) { emit('care.notHungry'); return false; }
    if (!(S.inv[k] > 0)) { emit('care.noFood', { food: tt('shop.' + k) }); return false; }
    S.inv[k]--;
    a.full = Math.min(1, a.full + 0.5);
    a.trust = Math.min(1, a.trust + 0.18);
    emit('care.fed', { name: animalName(a) });
    return true;
  }
  function water(id) {
    const a = animal(id);
    if (!a) return false;
    a.water = 1;
    a.trust = Math.min(1, a.trust + 0.05);
    emit('care.watered', { name: animalName(a) });
    return true;
  }
  function pet(id) {
    const a = animal(id);
    if (!a) return false;
    if (a.trust < 0.3) { emit('care.shy'); return false; }
    a.trust = Math.min(1, a.trust + 0.08);
    emit('care.petted', { name: animalName(a) });
    return true;
  }
  function treat(id) {
    const a = animal(id);
    if (!a || !a.injury || a.healAt) return false;
    if (!(S.inv.med > 0)) { emit('care.noMed'); return false; }
    S.inv.med--;
    a.healAt = env.now() + 20 * MIN;
    emit('care.treated', { name: animalName(a) });
    return true;
  }
  function nameOptions(a) {
    const names = (DEF.care && DEF.care.names && DEF.care.names[LANG]) || (DEF.care && DEF.care.names && DEF.care.names.en) || ['Lucky', 'Sunny', 'Pebble', 'Ash'];
    const used = new Set(S.animals.map(x => x.name));
    const pool = names.filter(n => !used.has(n));
    const start = (a.id * 3) % Math.max(1, pool.length);
    return pool.slice(start).concat(pool.slice(0, start)).slice(0, 4);
  }
  function giveName(id, name) {
    const a = animal(id);
    if (!a || !name) return false;
    a.name = String(name).slice(0, 12);
    emit('care.named', { name: a.name });
    return true;
  }
  function canAdopt(a) { return !!a && (a.kind === 'dog' || a.kind === 'cat') && !a.injury && a.trust >= 0.6 && a.full >= 0.4; }
  function adopt(id) {
    const a = animal(id);
    if (!canAdopt(a)) { emit('care.adoptNot'); return false; }
    const fams = (DEF.care.families && (DEF.care.families[LANG] || DEF.care.families.en)) || ['a neighbour'];
    const fam = fams[(a.id + S.log.adopted) % fams.length];
    const n = DEF.care.adoptGift || 15;
    S.animals = S.animals.filter(x => x !== a);
    S.res += n;
    S.log.adopted++;
    note('adopted', { name: animalName(a) });
    emit('care.adopted', { name: animalName(a), family: fam, res: tt('res.name'), n });
    return true;
  }

  /* 来客（招待模式：锡克教公共厨房、教会食物站） */
  function spawnGuest() {
    const c = DEF.care;
    if (!c || c.mode !== 'guests' || S.guests.length >= (c.max || 3)) return null;
    const who = (c.who && (c.who[LANG] || c.who.en)) || ['a guest'];
    const zone = c.zone || [0.15, 0.8, 0.85, 0.9];
    const g = { id: S.guestSeq++, who: Math.floor(r01() * who.length), x: zone[0] + r01() * (zone[2] - zone[0]), y: zone[1] + r01() * (zone[3] - zone[1]), since: env.now(), look: Math.floor(r01() * 6) };
    S.guests.push(g);
    emit('guests.arrive', { who: guestName(g) });
    return g;
  }
  function guestName(g) { const who = (DEF.care.who && (DEF.care.who[LANG] || DEF.care.who.en)) || ['a guest']; return who[g.who % who.length]; }
  function serve(id) {
    const g = S.guests.find(x => x.id === id);
    if (!g) return false;
    if (S.res < 1) { emit('guests.short', { res: tt('res.name') }); return false; }
    S.res -= 1;
    S.guests = S.guests.filter(x => x !== g);
    S.log.served++;
    note('served');
    emit('guests.served', { who: guestName(g) });
    return true;
  }

  /* 小卖部 */
  function shopItems() { return DEF.care && DEF.care.mode === 'animals' ? (DEF.shop || kinds().map(k => 'food.' + k).concat(['med', 'tool'])) : []; }
  function cost(item) { return item === 'tool' ? 30 * S.tool : item === 'med' ? 12 : 6; }
  function buy(item) {
    if (shopItems().indexOf(item) < 0) return false;
    const rest = restNow();
    if (rest) { emit('chore.rest', { name: tt(rest) }); return false; }
    if (item === 'tool' && S.tool >= 4) { emit('shop.max'); return false; }
    const c = cost(item);
    if (S.res < c) { emit('shop.short', { res: tt('res.name') }); return false; }
    S.res -= c;
    if (item === 'tool') S.tool++;
    else S.inv[item] = (S.inv[item] || 0) + 1;
    emit('shop.bought', { item: tt(item === 'tool' ? 'shop.tool' : 'shop.' + item) });
    return true;
  }

  /* 功课：只记录 */
  function practice(id) { return (DEF.practices || []).find(p => p.id === id) || null; }
  function practiceOpen(p) {
    if (!p || !p.window) return true;
    const h = hourOf(env.now());
    return h >= p.window[0] && h < p.window[1];
  }
  function doneToday(p) { return !!(p && p.daily && S.days[p.id] === dayKey(env.now())); }
  function practiceDone(id, extra) {
    const p = practice(id);
    if (!p) return false;
    if (!practiceOpen(p) || doneToday(p)) return false;
    S.log.prac[id] = (S.log.prac[id] || 0) + 1;
    if (p.daily) S.days[id] = dayKey(env.now());
    note('prac', Object.assign({ id }, extra || {}));
    return true;
  }
  function offer(pid, item) {
    const p = practice(pid);
    if (!p || p.kind !== 'offer' || (p.items || []).indexOf(item) < 0) return false;
    const today = dayKey(env.now());
    if (S.offered[item] === today) return false;
    S.offered[item] = today;
    S.log.prac[pid] = (S.log.prac[pid] || 0) + 1;
    note('prac', { id: pid, item });
    emit('offer.done', { item: tt('offer.' + item) });
    return true;
  }
  function readDone(textKey) {
    S.log.read++;
    S.log.texts[textKey] = (S.log.texts[textKey] || 0) + 1;
    note('read', { key: textKey });
    return true;
  }

  /* ---------- 时间推进 ---------- */
  function step(dt) {
    const now = env.now();
    const c = DEF.care;
    G.pileT += dt;
    if (G.pileT >= ((DEF.chore && DEF.chore.every) || 25)) { G.pileT = 0; if (!restNow()) addPile(); }
    if (c && c.mode === 'animals' && now >= S.nextAnimalAt) {
      S.nextAnimalAt = now + ((c.every || 120) * 1000) * (0.7 + r01() * 0.6);
      spawnAnimal();
    }
    if (c && c.mode === 'guests' && now >= S.nextGuestAt) {
      S.nextGuestAt = now + ((c.every || 45) * 1000) * (0.7 + r01() * 0.6);
      spawnGuest();
    }
    const drain = dt / (3 * 3600);
    S.animals.forEach(a => {
      a.full = Math.max(0, a.full - drain);
      a.water = Math.max(0, a.water - drain * 1.5);
      if (a.healAt && now >= a.healAt) { a.injury = null; a.healAt = 0; emit('care.healed', { name: animalName(a) }); }
      if (dt < 5) {
        const sp = (a.kind === 'cow' ? 0.004 : a.kind === 'bird' ? 0.03 : 0.012) * dt;
        const dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy);
        if (d < 0.01) {
          if (r01() < dt * 0.15) {
            const z = (c && c.zone) || [0.1, 0.78, 0.9, 0.92];
            a.tx = z[0] + r01() * (z[2] - z[0]);
            a.ty = z[1] + r01() * (z[3] - z[1]);
          }
        } else {
          a.x += (dx / d) * Math.min(sp, d);
          a.y += (dy / d) * Math.min(sp, d);
          a.dir = dx >= 0 ? 1 : -1;
        }
      }
    });
    /* 鸽子伤好吃饱就飞走；牛留下 */
    S.animals.slice().forEach(a => {
      if (a.kind === 'bird' && !a.injury && a.full > 0.6) {
        S.animals = S.animals.filter(x => x !== a);
        note('flew', { name: animalName(a) });
        emit('care.flew', { name: animalName(a) });
      }
    });
    S.guests.slice().forEach(g => {
      if (now - g.since > 6 * MIN) { S.guests = S.guests.filter(x => x !== g); emit('guests.left', { who: guestName(g) }); }
    });
  }

  /* 离开期间：最多补 6 小时的落叶和来访，不补动物的饥饿惩罚（只按真实时间降低饱腹）。 */
  function catchUp(ms) {
    if (!(ms > 0)) return 0;
    const capped = Math.min(ms, 6 * HOUR);
    const piles = Math.floor(capped / (((DEF.chore && DEF.chore.every) || 25) * 1000 * 6));
    for (let i = 0; i < piles; i++) if (!addPile()) break;
    S.animals.forEach(a => { a.full = Math.max(0.15, a.full - capped / (3 * HOUR) * 0.5); a.water = Math.max(0.1, a.water - capped / (2 * HOUR) * 0.5); if (a.healAt && env.now() >= a.healAt) { a.injury = null; a.healAt = 0; } });
    if (DEF.care && DEF.care.mode === 'animals' && S.animals.length < 2 && capped > HOUR) spawnAnimal();
    return Math.floor(ms / HOUR);
  }

  function start(storage, now, hash) {
    env.storage = storage;
    if (now != null) env.now = () => now;
    const loaded = load(env.now());
    S = loaded.s;
    const plat = readPlatform(hash);
    const pr = plat.prefs;
    if (pr.ui && (DEF.langs || []).indexOf(pr.ui) >= 0 && okOpt('ui', pr.ui)) S.opt.ui = pr.ui;
    if (pr.content && okOpt('content', pr.content)) S.opt.script = pr.content;
    if (pr.translation && okOpt('translation', pr.translation)) S.opt.tr = pr.translation;
    if (pr.voice && okOpt('voice', pr.voice)) S.opt.voice = pr.voice;
    if (S.opt.reduceMotion == null && plat.display && plat.display.motion === 'reduce') S.opt.reduceMotion = true;
    setLang(S.opt.ui || DEF.defaultLang || 'zh-CN');
    const away = env.now() - (S.last || env.now());
    const h = away > HOUR ? catchUp(away) : 0;
    if (!S.piles.length) { addPile(); addPile(); }
    return { note: loaded.note, awayHours: h };
  }

  function model() {
    const now = env.now();
    const h = hourOf(now);
    return {
      now, hour: h, tod: tod(h), season: seasonOf(now), month: monthOf(now), weekday: weekdayOf(now),
      rain: G.rain, night: h < 5.5 || h >= 19.3, piles: S.piles, animals: S.animals, guests: S.guests,
      offered: Object.keys(S.offered).filter(k => S.offered[k] === dayKey(now)),
      doneToday: (DEF.practices || []).filter(p => p.daily && S.days[p.id] === dayKey(now)).map(p => p.id),
      obs: todayObs(new Date(now)).map(o => o.id), rest: restNow(), reduceMotion: !!S.opt.reduceMotion,
      moon: T.Calendar ? T.Calendar.moonAge(new Date(now)) : 7, timer: !!(G.timer && G.timer.running),
    };
  }

  function hint() {
    const rest = restNow();
    if (rest) return { key: 'chore.rest', p: { name: tt(rest) } };
    const hurt = S.animals.find(a => a.injury && !a.healAt);
    if (hurt) return { key: 'hint.hurt', p: { name: animalName(hurt) } };
    const hungry = S.animals.find(a => a.full < 0.25);
    if (hungry) return { key: 'hint.hungry', p: { name: animalName(hungry) } };
    if (S.guests.length && S.res < 1) return { key: 'guests.short', p: { res: tt('res.name') } };
    if (S.guests.length) return { key: 'hint.guests', p: {} };
    const obs = todayObs(new Date(env.now()));
    if (obs.length) return { key: 'cal.todayIs', p: { name: tt(obs[0].id) + (obs[0].approx ? tt('cal.approx') : '') } };
    const timed = (DEF.practices || []).find(p => p.window && practiceOpen(p) && !doneToday(p));
    if (timed) return { key: 'hint.window.' + timed.id, p: {} };
    if (S.piles.length >= 3) return { key: 'chore.where', p: { pile: tt('chore.pile') } };
    if (has('hint.' + tod(hourOf(env.now())))) return { key: 'hint.' + tod(hourOf(env.now())), p: {} };
    return { key: 'hint.idle', p: {} };
  }

  const api = {
    define, tt, has, setLang, start, step, save, model, hint, sweep, feed, water, pet, treat, giveName, nameOptions, adopt, canAdopt,
    serve, buy, shopItems, cost, practice, practiceOpen, practiceDone, doneToday, offer, readDone, spawnAnimal, spawnGuest, addPile,
    catchUp, todayObs, restNow, hourOf, dayKey, seasonOf, tod, animalName, guestName, syncPlatform, events,
    get state() { return S; }, get lang() { return LANG; }, get def() { return DEF; }, get pack() { return PACK; }, get texts() { return TEXTS; }, env, G,
  };
  return api;
})();
