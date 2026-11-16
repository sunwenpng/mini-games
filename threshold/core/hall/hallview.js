/*
 * 殿内视图（v2 新增，各游戏共用，不改旧文件）：
 * - 每个传统在 traditions/<id>/hall.js 里用 HallView.define() 登记殿内可瞻仰的主尊或圣所（实拍照片 + 介绍 + 署名）。
 * - HallView.paint()：只在给定画布上画照片（慢推镜头、交叉淡入），供自带殿内场景的游戏（山寺小院 v2）嵌入。
 * - HallView.open()：全屏殿内视图，带顶部名牌、底部动作、主尊选择条、介绍卡和香烟、花瓣、灯火等效果，供庭院 v2 和菩提静院 v2 使用。
 * 照片来自维基共享资源，许可与作者写在每条记录的 credit 里，并在“介绍”卡上显示。
 */
var HallView = (function () {
  'use strict';
  const HV = { defs: {} };
  const TAU = Math.PI * 2;
  const BASE = (function () {
    const s = typeof document !== 'undefined' && document.currentScript && document.currentScript.src;
    return s ? s.replace(/core\/hall\/hallview\.js.*$/, '') : '';
  })();
  const STR = {
    'zh-CN': { back: '出殿', pick: '换一尊', about: '介绍', photo: '照片', by: '摄影', lic: '许可', src: '来源', close: '关闭', loading: '正在请进殿内…', retry: '照片没有加载出来 · 点这里重试', choose: '选择要瞻仰的主尊', now: '当前' },
    'zh-TW': { back: '出殿', pick: '換一尊', about: '介紹', photo: '照片', by: '攝影', lic: '授權', src: '來源', close: '關閉', loading: '正在請進殿內…', retry: '照片沒有載入 · 點這裡重試', choose: '選擇要瞻仰的主尊', now: '目前' },
    en: { back: 'Leave', pick: 'Choose', about: 'About', photo: 'Photo', by: 'Photo', lic: 'Licence', src: 'Source', close: 'Close', loading: 'Entering…', retry: 'The photo did not load · tap to retry', choose: 'Choose what to visit', now: 'Now' },
    th: { back: 'ออก', pick: 'เลือก', about: 'เกี่ยวกับ', photo: 'ภาพ', by: 'ภาพโดย', lic: 'สัญญาอนุญาต', src: 'ที่มา', close: 'ปิด', loading: 'กำลังเข้า…', retry: 'โหลดภาพไม่สำเร็จ · แตะเพื่อลองใหม่', choose: 'เลือกองค์ที่จะสักการะ', now: 'ขณะนี้' },
  };
  /* 场所不同，说法不同：教堂、会堂、礼拜殿里不说“出殿”“换一尊”。hall.js 里用 words: 'church' | 'place' 选 */
  const WORDS = {
    church: {
      'zh-CN': { back: '出堂', pick: '换一处', loading: '正在走进堂内…', choose: '选择要看的地方' },
      'zh-TW': { back: '出堂', pick: '換一處', loading: '正在走進堂內…', choose: '選擇要看的地方' },
      en: { back: 'Leave', pick: 'Look around', loading: 'Stepping inside…', choose: 'Choose where to look' },
    },
    place: {
      'zh-CN': { pick: '换一处', loading: '正在走进殿内…', choose: '选择要看的地方' },
      'zh-TW': { pick: '換一處', loading: '正在走進殿內…', choose: '選擇要看的地方' },
      en: { pick: 'Look around', loading: 'Stepping inside…', choose: 'Choose where to look' },
    },
  };
  /* 实拍 / 动画切换（v3）：按钮上写的是“切过去”的那一种 */
  const MODE = {
    'zh-CN': { toon: '动画', photo: '实拍', toonSub: '动画版', toonBy: '插画：启扉程序绘制' },
    'zh-TW': { toon: '動畫', photo: '實拍', toonSub: '動畫版', toonBy: '插畫：啟扉程式繪製' },
    en: { toon: 'Animated', photo: 'Photo', toonSub: 'Animated', toonBy: 'Illustration drawn by Threshold' },
    th: { toon: 'แอนิเมชัน', photo: 'ภาพถ่าย', toonSub: 'ฉบับแอนิเมชัน', toonBy: 'ภาพวาดโดย Threshold' },
  };
  function modeStr(lang) { return MODE[lang] || MODE[String(lang).split('-')[0]] || MODE.en; }
  function toonOK(def) { return typeof HallToon !== 'undefined' && HallToon.has(def.id); }
  function strFor(def, lang) {
    lang = lang || 'zh-CN';
    const base = STR[lang] || STR[lang.split('-')[0]] || STR.en;
    const w = def && def.words && WORDS[def.words];
    return w ? Object.assign({}, base, w[lang] || w[lang.split('-')[0]] || w.en) : base;
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const L = (o, lang) => (o == null ? '' : typeof o === 'string' ? o : o[lang] || (lang === 'zh-TW' && o['zh-CN']) || o.en || o['zh-CN'] || Object.values(o)[0] || '');

  HV.define = function (def) { HV.defs[def.id] = def; return def; };
  HV.get = function (id) { return HV.defs[id] || null; };
  HV.words = strFor;
  HV.url = function (p) { return /^(https?:|\/|\.)/.test(p) ? p : BASE + p; };

  /* ---------- 图片缓存 ---------- */
  const IMG = {};
  function img(src) {
    if (!src) return null;
    let e = IMG[src];
    if (!e) {
      e = IMG[src] = { im: new Image(), ok: false, err: false, seen: -1 };
      e.im.decoding = 'async';
      e.im.onload = () => { e.ok = true; };
      e.im.onerror = () => { e.err = true; };
      e.im.src = HV.url(src);
    }
    return e.ok ? e.im : null;
  }
  HV.preload = function (def) { (def.halls || []).forEach(h => { img(h.thumb); }); };
  /* 高清版（长边 1600）只在屏幕够大、够密，而且用户没开“省流量”时才用；否则用长边 1100 的标准版 */
  function saveData() { const c = typeof navigator !== 'undefined' && navigator.connection; return !!(c && (c.saveData || /2g/.test(c.effectiveType || ''))); }
  /* 高清版加载失败时退回标准版 */
  function bigSrc(h, px) { return h.hd && px >= 700 && !saveData() && !(IMG[h.hd] && IMG[h.hd].err) ? h.hd : h.img; }
  /* 照片状态：ok 大图已到 / loading 还在路上 / error 大图失败（可能还有一张模糊的缩略图垫着） */
  HV.status = function (h, px) {
    const b = IMG[bigSrc(h, px || 0)];
    if (b && b.ok) return 'ok';
    if (b && b.err) return 'error';
    return 'loading';
  };
  HV.retry = function (h) { [h.hd, h.img, h.thumb].forEach(k => { if (k && IMG[k] && !IMG[k].ok) delete IMG[k]; }); };
  function devScale(ctx) { try { const m = ctx.getTransform(); return Math.max(1, Math.min(3, Math.hypot(m.a, m.b))); } catch (e) { return 1; } }

  /* ---------- 记住每个传统上次瞻仰的主尊 ---------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* 无痕模式 */ } }
  HV.current = function (def) {
    const want = lsGet('threshold-hall-' + def.id);
    return def.halls.find(h => h.id === want) || def.halls[0];
  };
  HV.choose = function (def, id) { lsSet('threshold-hall-' + def.id, id); };

  /* ---------- 画照片：按焦点裁切填满，慢推镜头，交叉淡入 ---------- */
  const paintState = {};
  function cover(ctx, im, x, y, w, h, focus, zoom, drift) {
    const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
    if (!iw || !ih) return;
    const s = Math.max(w / iw, h / ih) * zoom;
    const dw = iw * s, dh = ih * s;
    const fx = focus ? focus[0] : 0.5, fy = focus ? focus[1] : 0.45;
    let dx = x + w / 2 - fx * dw + (drift ? drift[0] : 0);
    let dy = y + h / 2 - fy * dh + (drift ? drift[1] : 0);
    dx = Math.min(x, Math.max(x + w - dw, dx));
    dy = Math.min(y, Math.max(y + h - dh, dy));
    ctx.drawImage(im, dx, dy, dw, dh);
  }
  /* 横幅照片的羽化版本（上下边缘渐隐），按目标宽度缓存 */
  const FEATHER = new Map();
  function feathered(im, tw, sides) {
    const key = im.src + '|' + tw + (sides ? 's' : '');
    if (FEATHER.has(key)) return FEATHER.get(key);
    const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
    const th = Math.round(tw * ih / iw);
    const c = document.createElement('canvas'); c.width = tw; c.height = th;
    const g = c.getContext('2d');
    g.drawImage(im, 0, 0, tw, th);
    g.globalCompositeOperation = 'destination-in';
    const v = g.createLinearGradient(0, 0, 0, th);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.09, 'rgba(0,0,0,1)'); v.addColorStop(0.9, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = v; g.fillRect(0, 0, tw, th);
    if (sides) {
      const hz = g.createLinearGradient(0, 0, tw, 0);
      hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(0.05, 'rgba(0,0,0,1)'); hz.addColorStop(0.95, 'rgba(0,0,0,1)'); hz.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = hz; g.fillRect(0, 0, tw, th);
    }
    if (FEATHER.size > 5) FEATHER.delete(FEATHER.keys().next().value);
    FEATHER.set(key, c);
    return c;
  }
  HV.paint = function (ctx, x, y, w, h, t, hall, o) {
    o = o || {};
    const key = o.key || 'default';
    const st = paintState[key] || (paintState[key] = { cur: null, prev: null, at: 0 });
    if (st.cur !== hall) { st.prev = st.cur; st.cur = hall; st.at = t; }
    const fade = Math.min(1, Math.max(0, (t - st.at) / 0.9));
    const calm = !!o.calm;
    const breathe = calm ? 0 : Math.sin(t * 0.07) * 0.5 + 0.5;
    const drift = calm ? [0, 0] : [Math.sin(t * 0.05) * w * 0.012, Math.cos(t * 0.043) * h * 0.01];
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = '#120b07'; ctx.fillRect(x, y, w, h);
    const ds = devScale(ctx), px = w * ds;
    /* 取景：
     * - 照片比屏幕“宽”时不硬裁成只剩中间一条：按 span（主体左右范围，0–1）放大到主体刚好占满屏宽，
     *   上下露出的部分垫一层放大压暗的同一张图，照片上下边缘羽化。
     * - 主体本来就窄（或照片本来就是竖幅）时直接铺满。
     */
    const one = (hh, im, small, a) => {
      if (a <= 0) return;
      ctx.globalAlpha = a;
      const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
      if (!iw || !ih) return;
      const r = iw / ih;
      const z = (hh.zoom || 1) * (1.04 + breathe * 0.05) * (1 + (o.push || 0));
      const fy = hh.focus ? hh.focus[1] : 0.45;
      if (hh.fit !== 'cover' && (hh.fit === 'contain' || r > (w / h) * 1.18)) {
        const sp = hh.span || (r < 0.9 ? [0.12, 0.88] : [0.04, 0.96]);
        const mid = (sp[0] + sp[1]) / 2;
        const dw = (o.wide || 1) * w / Math.max(0.2, sp[1] - sp[0]);
        const coverW = Math.max(w, h * r);
        if (dw >= coverW * 0.94) { cover(ctx, im, x, y, w, h, [mid, fy], z, drift); return; }
        const dh = dw / r;
        cover(ctx, small || im, x, y, w, h, [mid, 0.5], z * 1.25, drift);
        ctx.fillStyle = 'rgba(14,8,5,.72)'; ctx.fillRect(x, y, w, h);
        const fm = feathered(im, Math.min(iw, Math.round(dw * ds)), dw < w * 1.04);
        const sc = 1 + breathe * 0.03 + (o.push || 0);
        const W2 = dw * sc, H2 = dh * sc;
        let dx = x + w / 2 - mid * W2 + drift[0];
        if (W2 >= w) dx = Math.min(x, Math.max(x + w - W2, dx));
        const cy = y + h * (o.cy || hh.cy || (dh > h * 0.8 ? 0.5 : 0.46));
        ctx.drawImage(fm, dx, cy - H2 / 2 + drift[1], W2, H2);
      } else cover(ctx, im, x, y, w, h, hh.focus, z, drift);
    };
    const draw = (hh, a) => {
      if (!hh || a <= 0) return;
      const src = bigSrc(hh, px);
      const big = img(src), small = img(hh.thumb);
      if (big) {
        /* 大图到了以后从缩略图淡入，不是“啪”地一下换掉 */
        const e = IMG[src];
        if (e.seen < 0 || t < e.seen) e.seen = small ? t : t - 1;
        const k = Math.min(1, Math.max(0, (t - e.seen) / 0.5));
        if (k < 1 && small) one(hh, small, small, a);
        one(hh, big, small, a * k);
      } else if (small) one(hh, small, small, a);
    };
    if (fade < 1) draw(st.prev, 1);
    draw(hall, fade);
    ctx.globalAlpha = 1;
    ctx.restore();
    return !!img(bigSrc(hall, px)) || !!img(hall.thumb);
  };

  /* ---------- 全屏殿内视图 ---------- */
  let V = null;
  HV.isOpen = function () { return !!V; };

  HV.open = function (def, opts) {
    /* 重新打开时沿用已经压进浏览历史的那一条，不重复压 */
    const hadHist = !!(V && V.hist);
    if (V) { V.hist = false; HV.close(true); }
    opts = opts || {};
    const lang = opts.lang || 'zh-CN';
    const S = strFor(def, lang);
    const root = document.createElement('div');
    root.className = 'hv';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'false');
    root.innerHTML = `
      <canvas class="hv-cv" aria-hidden="true"></canvas>
      <header class="hv-top">
        <button type="button" class="hv-pill hv-back" data-hv="back">‹ ${esc(S.back)}</button>
        <div class="hv-title"><b></b><span></span></div>
        <button type="button" class="hv-pill hv-mode" data-hv="mode" hidden></button>
        <button type="button" class="hv-pill hv-about" data-hv="about" aria-label="${esc(S.about)}">ⓘ</button>
      </header>
      <button type="button" class="hv-load" data-hv="retry" hidden>${esc(S.loading)}</button>
      <div class="hv-strip" hidden><p class="hv-strip-h">${esc(S.choose)}</p><div class="hv-thumbs" role="listbox"></div></div>
      <nav class="hv-acts"></nav>
      <section class="hv-card" hidden></section>`;
    (opts.mount || document.body).appendChild(root);
    const cv = root.querySelector('.hv-cv');
    V = {
      def, opts, lang, S, root, cv, ctx: cv.getContext('2d'), W: 360, H: 640, DPR: 1, raf: 0, t0: performance.now() / 1000,
      hall: opts.start ? def.halls.find(h => h.id === opts.start) || HV.current(def) : HV.current(def),
      fx: [], smoke: [], petals: [], dust: [], lamps: 0, bow: null, halo: 0, push: 0, enterT: 0,
      mode: toonOK(def) && lsGet('threshold-hall-mode') === 'toon' ? 'toon' : 'photo',
    };
    for (let i = 0; i < 46; i++) V.dust.push({ x: Math.random(), y: Math.random(), s: 0.6 + Math.random() * 1.4, ph: Math.random() * TAU, v: 0.004 + Math.random() * 0.01 });
    V.loadEl = root.querySelector('.hv-load'); V.loadState = '';
    V.mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    modeBtn(); buildActs(); title(); thumbs();
    root.addEventListener('click', onClick);
    /* 法器互动（rite.js）：在画布上按、拖 */
    if (typeof HallRite !== 'undefined' && HallRite.has(def.id)) {
      HallRite.open(V);
      cv.style.touchAction = 'none';
      const at = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, performance.now() / 1000]; };
      const on = type => e => { if (!V || V.cv !== cv) return; const p = at(e); if (HallRite.pointer(type, p[0], p[1], V, p[2])) { e.preventDefault(); if (type === 'down' && cv.setPointerCapture) try { cv.setPointerCapture(e.pointerId); } catch (x) { /* 忽略 */ } } };
      cv.addEventListener('pointerdown', on('down')); cv.addEventListener('pointermove', on('move'));
      cv.addEventListener('pointerup', on('up')); cv.addEventListener('pointercancel', on('cancel'));
    }
    window.addEventListener('resize', resize);
    document.addEventListener('keydown', onKey);
    /* 手机的返回键（或 iOS 的右滑返回）先出殿，而不是直接离开游戏 */
    V.hist = hadHist;
    if (!hadHist && opts.history !== false && window.history && history.pushState) {
      try { history.pushState({ hv: 1 }, ''); V.hist = true; } catch (e) { /* 某些内嵌环境不允许 */ }
    }
    if (V.hist) window.addEventListener('popstate', onPop);
    resize();
    requestAnimationFrame(() => root.classList.add('in'));
    V.raf = requestAnimationFrame(frame);
    HV.preload(def);
    return V;
  };
  HV.close = function (now) {
    if (!V) return;
    const v = V;
    V = null;
    cancelAnimationFrame(v.raf);
    if (typeof HallRite !== 'undefined') HallRite.close(v);
    window.removeEventListener('resize', resize);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('popstate', onPop);
    if (v.hist) { v.hist = false; try { history.back(); } catch (e) { /* 忽略 */ } }
    v.root.classList.remove('in');
    const rm = () => v.root.remove();
    if (now) rm(); else setTimeout(rm, 380);
    if (v.opts.onClose) v.opts.onClose();
  };
  HV.refresh = function () { if (V) { buildActs(); title(); } };

  function hallName(h) { return L(h.name, V.lang); }
  function title() {
    const h = V.hall, toon = V.mode === 'toon';
    const nm = toon ? HallToon.name(V.def.id, V.lang) : hallName(h);
    V.root.querySelector('.hv-title b').textContent = nm;
    V.root.querySelector('.hv-title span').textContent = toon ? modeStr(V.lang).toonSub : L(h.sub, V.lang);
    V.root.setAttribute('aria-label', nm);
  }
  function modeBtn() {
    const b = V.root.querySelector('.hv-mode');
    if (!toonOK(V.def)) { b.hidden = true; return; }
    const M = modeStr(V.lang);
    b.hidden = false; b.textContent = V.mode === 'toon' ? M.photo : M.toon;
    b.setAttribute('aria-pressed', V.mode === 'toon' ? 'true' : 'false');
  }
  HV.setMode = function (mode) {
    if (!V || !toonOK(V.def)) return;
    V.mode = mode === 'toon' ? 'toon' : 'photo'; lsSet('threshold-hall-mode', V.mode);
    V.push = 0.05; modeBtn(); buildActs(); title();
    const s = V.root.querySelector('.hv-strip'); if (V.mode === 'toon' && !s.hidden) toggleStrip(false);
  };
  function buildActs() {
    const acts = (V.opts.actions || []).concat(V.def.halls.length > 1 && V.mode !== 'toon' ? [{ id: '_pick', icon: '✦', label: V.S.pick }] : []);
    const nav = V.root.querySelector('.hv-acts');
    nav.style.gridTemplateColumns = 'repeat(' + Math.max(1, acts.length) + ', 1fr)';
    nav.innerHTML = acts.map(a => `<button type="button" data-hv="act" data-id="${esc(a.id)}"${a.on ? ' class="on"' : ''}><span class="i" aria-hidden="true">${esc(a.icon || '')}</span><span class="l">${esc(a.label)}</span></button>`).join('');
  }
  function thumbs() {
    const box = V.root.querySelector('.hv-thumbs');
    box.innerHTML = V.def.halls.map(h => `<button type="button" role="option" data-hv="pick" data-id="${esc(h.id)}" aria-selected="${h === V.hall}">
      <img src="${esc(HV.url(h.thumb))}" alt="" loading="lazy"><span>${esc(hallName(h))}</span></button>`).join('');
  }
  function card() {
    if (V.mode === 'toon') {
      const box = V.root.querySelector('.hv-card'), M = modeStr(V.lang);
      box.innerHTML = `<div class="hv-card-h"><h2>${esc(HallToon.name(V.def.id, V.lang))}</h2><button type="button" class="hv-x" data-hv="card-x" aria-label="${esc(V.S.close)}">×</button></div>
        <p class="hv-sub">${esc(M.toonSub)}</p><div class="hv-about-body">${L(HallToon.about(V.def.id), V.lang).split('\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}</div><p class="hv-credit">${esc(M.toonBy)}</p>`;
      box.hidden = false; requestAnimationFrame(() => box.classList.add('in'));
      return;
    }
    const h = V.hall, c = h.credit || {};
    const about = L(h.about, V.lang).split('\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
    const box = V.root.querySelector('.hv-card');
    box.innerHTML = `<div class="hv-card-h"><h2>${esc(hallName(h))}</h2><button type="button" class="hv-x" data-hv="card-x" aria-label="${esc(V.S.close)}">×</button></div>
      ${L(h.sub, V.lang) ? `<p class="hv-sub">${esc(L(h.sub, V.lang))}</p>` : ''}
      <div class="hv-about-body">${about}</div>
      <p class="hv-credit">${esc(V.S.photo)}：${esc(L(c.place, V.lang) || '')}${c.place ? ' · ' : ''}${esc(V.S.by)} ${esc(c.who || '?')} · ${esc(c.lic || '')}
      ${c.url ? ` · <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(V.S.src)}</a>` : ''}</p>`;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('in'));
  }
  function hideCard() { const b = V.root.querySelector('.hv-card'); b.classList.remove('in'); setTimeout(() => { if (V && !b.classList.contains('in')) b.hidden = true; }, 260); }
  function toggleStrip(show) {
    const s = V.root.querySelector('.hv-strip');
    const on = show == null ? s.hidden : show;
    if (on) { s.hidden = false; requestAnimationFrame(() => s.classList.add('in')); const cur = s.querySelector('[aria-selected="true"]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ inline: 'center', block: 'nearest' }); }
    else { s.classList.remove('in'); setTimeout(() => { if (V && !s.classList.contains('in')) s.hidden = true; }, 260); }
  }
  HV.pick = function (id) {
    if (!V) return;
    const h = V.def.halls.find(x => x.id === id);
    if (!h || h === V.hall) return;
    V.hall = h; HV.choose(V.def, id); title(); thumbs();
    V.push = 0.05; V.halo = 0;
    if (V.opts.onPick) V.opts.onPick(id);
  };
  function onClick(e) {
    const b = e.target.closest('[data-hv]');
    if (!b) return;
    const k = b.dataset.hv;
    if (k === 'back') HV.close();
    else if (k === 'about') card();
    else if (k === 'mode') HV.setMode(V.mode === 'toon' ? 'photo' : 'toon');
    else if (k === 'retry') { if (V.loadState === 'error') { HV.retry(V.hall); V.loadState = ''; } }
    else if (k === 'card-x') hideCard();
    else if (k === 'pick') { HV.pick(b.dataset.id); toggleStrip(false); }
    else if (k === 'act') {
      if (b.dataset.id === '_pick') { toggleStrip(); return; }
      const a = (V.opts.actions || []).find(x => x.id === b.dataset.id);
      if (a && a.run) a.run(HV);
    }
  }
  function onPop() {
    if (!V) return;
    /* 这次“返回”已经把我们压的那一条用掉了 */
    const again = () => { try { history.pushState({ hv: 1 }, ''); } catch (e) { V.hist = false; } };
    const cardEl = V.root.querySelector('.hv-card'), strip = V.root.querySelector('.hv-strip');
    if (!cardEl.hidden && cardEl.classList.contains('in')) { hideCard(); again(); return; }
    if (!strip.hidden && strip.classList.contains('in')) { toggleStrip(false); again(); return; }
    if (V.opts.onBack && V.opts.onBack()) { again(); return; }
    V.hist = false;
    HV.close();
  }
  function onKey(e) { if (e.key === 'Escape' && V && !document.querySelector('.sheet:not([hidden])')) HV.close(); }
  function resize() {
    if (!V) return;
    const r = V.cv.getBoundingClientRect();
    V.DPR = Math.min(2, window.devicePixelRatio || 1);
    V.W = Math.max(200, r.width); V.H = Math.max(200, r.height);
    V.cv.width = Math.round(V.W * V.DPR); V.cv.height = Math.round(V.H * V.DPR);
    V.ctx.setTransform(V.DPR, 0, 0, V.DPR, 0, 0);
  }

  /* ---------- 效果：礼拜、香烟、花瓣、灯、钟声光环 ---------- */
  HV.bow = function () { if (V) V.bow = { t: 0 }; };
  HV.fx = function (kind) {
    if (!V) return;
    if (kind === 'smoke' || kind === 'incense') V.fx.push({ k: 'smoke', t: 0, life: 40 });
    else if (kind === 'petals' || kind === 'flower') { for (let i = 0; i < 40; i++) V.petals.push({ x: Math.random(), y: -Math.random() * 0.4, vx: (Math.random() - 0.5) * 0.02, vy: 0.05 + Math.random() * 0.06, r: Math.random() * TAU, c: ['#f6c3cf', '#f2a43a', '#f7e6a0', '#e76f51', '#ffffff'][i % 5] }); }
    else if (kind === 'lamp' || kind === 'candle') V.lamps = Math.min(9, V.lamps + 3);
    else if (kind === 'halo' || kind === 'bell') V.halo = 1;
    else if (kind === 'water') V.fx.push({ k: 'shine', t: 0, life: 3 });
    else V.halo = 1;
  };
  HV.effectFor = function (item) {
    const s = String(item).toLowerCase();
    if (/xiang|incense|agarbatti|dhoop|senko|kodo|osenko/.test(s)) return 'smoke';
    if (/hua|flower|mala|phool|petal|lotus|sakaki|rose|dok/.test(s)) return 'petals';
    if (/deng|lamp|diya|candle|butter|light|tian|thian|chang|ner/.test(s)) return 'lamp';
    if (/water|shui|jal|cha|tea/.test(s)) return 'water';
    return 'halo';
  };

  function frame(ms) {
    if (!V) return;
    const t = ms / 1000;
    const dt = Math.min(0.07, t - (V.last || t));
    V.last = t;
    const calm = !!(V.mq && V.mq.matches);
    const { ctx, W, H } = V;
    /* 没有任何效果在动的时候隔一帧画一次：慢推镜头 30 帧足够，省一半电 */
    const rite = typeof HallRite !== 'undefined' && HallRite.busy(V);
    const busy = rite || V.bow || V.fx.length || V.smoke.length || V.petals.length || V.halo > 0 || V.enterT < 1 || V.push > 0.002 || V.loadState !== 'ok';
    V.tick = (V.tick || 0) + 1;
    if (!busy && (V.tick & 1)) { V.raf = requestAnimationFrame(frame); return; }
    V.enterT = Math.min(1, V.enterT + dt / 0.9);
    V.push *= Math.pow(0.2, dt);
    let dip = 0;
    if (V.bow) {
      V.bow.t += dt;
      const u = V.bow.t / 2.2;
      dip = u < 1 ? Math.sin(u * Math.PI) : 0;
      if (u >= 1) { V.bow = null; V.halo = Math.max(V.halo, 0.8); }
    }
    const enter = 1 - Math.pow(1 - V.enterT, 3);
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    const toon = V.mode === 'toon';
    if (toon) {
      const z = 1 + V.push + (1 - enter) * 0.12 + dip * 0.05;
      ctx.save(); ctx.translate(W / 2, H * 0.45); ctx.scale(z, z); ctx.translate(-W / 2, -H * 0.45);
      HallToon.paint(ctx, W, H, t, V.def, V.hall, calm);
      ctx.restore();
    }
    const ok = toon || HV.paint(ctx, 0, 0, W, H, t, V.hall, { key: 'view', calm, push: V.push + (1 - enter) * 0.12 + dip * 0.05 });
    /* 缩略图已经垫上时不再显示“正在请进殿内”；但大图彻底失败时要说出来，给一个重试 */
    let stt = toon ? 'ok' : HV.status(V.hall, W * V.DPR);
    if (stt === 'loading' && ok) stt = 'ok';
    if (stt !== V.loadState) {
      V.loadState = stt;
      V.loadEl.hidden = stt === 'ok';
      V.loadEl.textContent = stt === 'error' ? V.S.retry : V.S.loading;
      V.loadEl.classList.toggle('err', stt === 'error');
    }
    /* 色调与暗角：让照片更像“在殿里” */
    const vg = ctx.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.25, W / 2, H * 0.5, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(8,4,2,.62)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.2); top.addColorStop(0, 'rgba(6,4,3,.7)'); top.addColorStop(1, 'rgba(6,4,3,0)');
    ctx.fillStyle = top; ctx.fillRect(0, 0, W, H * 0.2);
    const bot = ctx.createLinearGradient(0, H * 0.62, 0, H); bot.addColorStop(0, 'rgba(6,4,3,0)'); bot.addColorStop(1, 'rgba(6,4,3,.86)');
    ctx.fillStyle = bot; ctx.fillRect(0, H * 0.62, W, H * 0.38);

    ctx.globalCompositeOperation = 'lighter';
    /* 两侧烛火 */
    const fl = calm ? 0 : Math.sin(t * 7.3) * 0.04 + Math.sin(t * 12.1) * 0.03;
    glow(ctx, W * 0.1, H * 0.8, H * 0.22, 'rgba(255,160,70,' + (0.16 + fl) + ')');
    glow(ctx, W * 0.9, H * 0.8, H * 0.22, 'rgba(255,160,70,' + (0.16 - fl) + ')');
    /* 供上的灯 */
    for (let i = 0; i < V.lamps; i++) {
      const x = W * (0.5 + (i - (V.lamps - 1) / 2) * 0.085), y = H * 0.84;
      glow(ctx, x, y - 6, 26, 'rgba(255,170,80,' + (0.45 + fl) + ')');
      flame(ctx, x, y, 5, t + i);
    }
    /* 光里的浮尘 */
    if (!calm) V.dust.forEach(p => {
      p.y -= p.v * dt; p.x += Math.sin(t * 0.3 + p.ph) * 0.0006;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      const a = (0.25 + 0.25 * Math.sin(t * 1.4 + p.ph)) * (0.6 + 0.4 * Math.sin(p.x * 3));
      ctx.fillStyle = 'rgba(255,236,200,' + a.toFixed(3) + ')';
      ctx.fillRect(p.x * W, p.y * H, p.s, p.s);
    });
    /* 光环：钟声、礼拜之后 */
    if (V.halo > 0) {
      const f = V.hall.focus || [0.5, 0.42];
      glow(ctx, W * 0.5, H * Math.min(0.55, f[1]), Math.min(W, H) * (0.5 + (1 - V.halo) * 0.25), 'rgba(255,214,140,' + (0.22 * V.halo) + ')');
      V.halo = Math.max(0, V.halo - dt * 0.35);
    }
    ctx.globalCompositeOperation = 'source-over';
    /* 香烟 */
    V.fx = V.fx.filter(f => (f.t += dt) < f.life);
    const burning = V.fx.some(f => f.k === 'smoke');
    if (burning) {
      const bx = W * 0.5, by = H * 0.86;
      if (!calm && Math.random() < dt * 22) V.smoke.push({ x: bx + (Math.random() - 0.5) * 14, y: by - 30, a: 0.32, r: 3, vx: 0, t: 0 });
      ctx.strokeStyle = '#6a3a1a'; ctx.lineWidth = 1.6;
      [-8, 0, 8].forEach(dx => { ctx.beginPath(); ctx.moveTo(bx + dx, by); ctx.lineTo(bx + dx * 1.3, by - 30); ctx.stroke(); });
      ctx.globalCompositeOperation = 'lighter';
      [-8, 0, 8].forEach(dx => glow(ctx, bx + dx * 1.3, by - 31, 6, 'rgba(255,120,40,.9)'));
      ctx.globalCompositeOperation = 'source-over';
    }
    V.smoke = V.smoke.filter(p => {
      p.t += dt; p.y -= dt * 26; p.vx += (Math.sin(p.t * 1.7 + p.x) * 6 - p.vx) * dt; p.x += p.vx * dt; p.r += dt * 4.5; p.a -= dt * 0.045;
      if (p.a <= 0) return false;
      ctx.globalAlpha = p.a; ctx.drawImage(puff(), p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      return true;
    });
    ctx.globalAlpha = 1;
    /* 花瓣 */
    V.petals = V.petals.filter(p => {
      p.y += p.vy * dt; p.x += p.vx * dt + Math.sin(t * 2 + p.r) * 0.0012; p.r += dt * 2;
      if (p.y > 0.9) return false;
      ctx.save(); ctx.translate(p.x * W, p.y * H); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.ellipse(0, 0, 5, 2.6, 0, 0, TAU); ctx.fill();
      ctx.restore();
      return true;
    });
    if (V.fx.some(f => f.k === 'shine')) { ctx.globalCompositeOperation = 'lighter'; glow(ctx, W * 0.5, H * 0.82, 60, 'rgba(170,210,255,.25)'); ctx.globalCompositeOperation = 'source-over'; }
    /* 法器 */
    if (typeof HallRite !== 'undefined') HallRite.frame(ctx, W, H, t, dt, V, calm);
    /* 礼拜：整个画面暗下去再亮起来 */
    if (dip > 0) { ctx.fillStyle = 'rgba(0,0,0,' + (dip * 0.55).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
    if (enter < 1) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - enter).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
    V.raf = requestAnimationFrame(frame);
  }
  /* 一小团烟：只画一次，之后每个烟粒子贴图，比每帧新建渐变省得多 */
  let PUFF = null;
  function puff() {
    if (PUFF) return PUFF;
    PUFF = document.createElement('canvas'); PUFF.width = PUFF.height = 64;
    const c = PUFF.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(225,222,215,1)'); g.addColorStop(1, 'rgba(225,222,215,0)');
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
    return PUFF;
  }
  function glow(ctx, x, y, r, c) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function flame(ctx, x, y, s, t) {
    const f = Math.sin(t * 9) * 0.15;
    ctx.fillStyle = '#ffcf5a';
    ctx.beginPath(); ctx.moveTo(x, y - s * (2 + f)); ctx.quadraticCurveTo(x + s * 0.8, y - s * 0.5, x, y); ctx.quadraticCurveTo(x - s * 0.8, y - s * 0.5, x, y - s * (2 + f)); ctx.fill();
    ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(x, y - s * 0.5, s * 0.35, 0, TAU); ctx.fill();
    ctx.fillStyle = '#8a5a2a'; ctx.fillRect(x - s * 1.1, y, s * 2.2, s * 0.9);
  }
  HV.glow = glow;

  /* ---------- 供自带画布的游戏用：只弹出主尊选择 ---------- */
  HV.picker = function (def, opts) {
    opts = opts || {};
    const lang = opts.lang || 'zh-CN';
    const S = strFor(def, lang);
    const cur = HV.current(def);
    const box = document.createElement('div');
    box.className = 'hv-pop';
    box.innerHTML = `<div class="hv-pop-in" role="dialog" aria-modal="true" aria-label="${esc(S.choose)}">
      <div class="hv-card-h"><h2>${esc(opts.title || S.choose)}</h2><button type="button" class="hv-x" data-p="x" aria-label="${esc(S.close)}">×</button></div>
      <div class="hv-grid">${def.halls.map(h => `<button type="button" data-p="pick" data-id="${esc(h.id)}" class="${h === cur ? 'cur' : ''}"><img src="${esc(HV.url(h.thumb))}" alt="" loading="lazy"><b>${esc(L(h.name, lang))}</b><small>${esc(L(h.sub, lang))}</small></button>`).join('')}</div>
      <p class="hv-credit">${esc(opts.note || '')}</p></div>`;
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add('in'));
    const done = id => { box.classList.remove('in'); setTimeout(() => box.remove(), 260); if (id && opts.onPick) { HV.choose(def, id); opts.onPick(id); } };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-p]');
      if (!b) { if (e.target === box) done(null); return; }
      done(b.dataset.p === 'pick' ? b.dataset.id : null);
    });
    return box;
  };
  /* 只显示一张介绍卡（不打开全屏视图时用） */
  HV.aboutCard = function (def, hall, lang) {
    const S = strFor(def, lang), c = hall.credit || {};
    const box = document.createElement('div');
    box.className = 'hv-pop';
    box.innerHTML = `<div class="hv-pop-in"><div class="hv-card-h"><h2>${esc(L(hall.name, lang))}</h2><button type="button" class="hv-x" data-p="x" aria-label="${esc(S.close)}">×</button></div>
      ${L(hall.sub, lang) ? `<p class="hv-sub">${esc(L(hall.sub, lang))}</p>` : ''}
      <div class="hv-about-body">${L(hall.about, lang).split('\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="hv-credit">${esc(S.photo)}：${esc(L(c.place, lang))} · ${esc(S.by)} ${esc(c.who || '?')} · ${esc(c.lic || '')}${c.url ? ` · <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(S.src)}</a>` : ''}</p></div>`;
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add('in'));
    box.addEventListener('click', e => { if (e.target === box || e.target.closest('[data-p="x"]')) { box.classList.remove('in'); setTimeout(() => box.remove(), 260); } });
  };
  HV.L = L;
  return HV;
})();
