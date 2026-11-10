/*
 * 庭院引擎的界面：顶栏、底部按钮、面板、场景循环、朗读和声音。规则全部在 engine.js。
 * 文字都在 DOM 里（便于读屏、断行和多文字排版），场景只在 Canvas 里画。
 */
(function () {
  'use strict';
  const C = Courtyard;
  const K = CourtyardKit;
  const T = window.Threshold || {};
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const tt = (k, p) => C.tt(k, p);
  let canvas, ctx, W = 360, H = 480, DPR = 1, lastFrame = 0, T0 = 0, hintT = 0;
  const U = { sheet: null, arg: null, focusBack: null, timerH: 0 };

  /* ---------- 声音 ---------- */
  let AC = null, ambientOn = false, windNode = null;
  function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function tone(freqs, dur, gain, type) {
    const a = ac();
    if (!a || !C.state.opt.sound) return;
    const now = a.currentTime;
    freqs.forEach((f, i) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime((gain || 0.2) / (i + 1), now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur * (1 - i * 0.12));
      o.connect(g); g.connect(a.destination); o.start(now); o.stop(now + dur);
    });
  }
  function noiseBurst(dur, gain, freq) {
    const a = ac();
    if (!a || !C.state.opt.sound) return;
    const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = freq || 1800; g.gain.value = gain || 0.4;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  const BELLS = {
    bowl: () => tone([220, 528, 870], 6, 0.22),
    temple: () => tone([98, 196, 293, 415], 7, 0.3),
    church: () => tone([262, 330, 392, 523], 4, 0.18, 'triangle'),
    chime: () => tone([1318, 1760, 2093], 2.4, 0.08),
    qing: () => tone([880, 1320, 1990], 4.5, 0.14),
    clap: () => noiseBurst(0.12, 0.6, 1500),
    shofar: () => tone([233, 466], 1.6, 0.12, 'sawtooth'),
    drum: () => tone([70, 110], 0.6, 0.4),
  };
  function bell(kind) { const f = BELLS[kind || C.def.bell || 'bowl']; if (f) f(); }
  function ambient(on) {
    const a = ac();
    if (!a) return;
    if (on && !windNode && C.state.opt.sound) {
      const len = a.sampleRate * 2, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) { last = last * 0.985 + (Math.random() * 2 - 1) * 0.015; d[i] = last * 3; }
      const s = a.createBufferSource(), g = a.createGain();
      s.buffer = buf; s.loop = true; g.gain.value = 0.05; s.connect(g); g.connect(a.destination); s.start();
      windNode = { s, g };
    } else if (!on && windNode) { try { windNode.s.stop(); } catch (e) { /* 已停 */ } windNode = null; }
    ambientOn = on;
  }

  /* ---------- 朗读 ---------- */
  const synth = window.speechSynthesis || null;
  function voiceFor(lang) {
    if (!synth || !lang) return null;
    const vs = synth.getVoices() || [];
    const base = lang.split('-')[0].toLowerCase();
    return vs.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase()) || vs.find(v => v.lang && v.lang.toLowerCase().split(/[-_]/)[0] === base) || null;
  }
  function voiceKind(r) {
    const v = (T.VOICES || {})[C.state.opt.voice];
    const k = v ? v.kind : 'off';
    /* 选了参考录音、但这一段没有录音时，退回设备朗读 */
    if (r && k === 'reference' && !r.audio) return 'system';
    return k;
  }
  function speak(text, lang, rate, done, r) {
    if (!synth || voiceKind(r) !== 'system') { if (done) setTimeout(done, 1800); return false; }
    const v = voiceFor(lang);
    if (!v) { if (done) setTimeout(done, 1800); return false; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v; u.lang = v.lang; u.rate = rate || 0.85;
    u.onend = () => done && done();
    u.onerror = () => done && done();
    synth.speak(u);
    return true;
  }
  function stopAudio() {
    if (synth) synth.cancel();
    if (C.G.audio) { try { C.G.audio.pause(); } catch (e) { /* 忽略 */ } }
  }

  /* ---------- 提示 ---------- */
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg; el.hidden = false; C.G.toastT = 3.4;
    $('sr').textContent = msg;
  }
  function flush() {
    const ev = C.events.splice(0);
    if (ev.length) { const e = ev[ev.length - 1]; toast(tt(e.key, e.p)); }
    hud();
    if (U.sheet && !U.keep) render();
  }

  /* ---------- 顶栏和底栏 ---------- */
  function hud() {
    const m = C.model();
    $('title').textContent = tt('app.title');
    const bits = [tt('season.' + m.season), tt('time.' + m.tod), clock(m.hour)];
    if (m.rest) bits.unshift(tt(m.rest));
    else if (m.obs.length) bits.unshift(tt(m.obs[0]));
    $('chip').textContent = bits.join(' · ');
    $('res').textContent = (C.def.resource.icon || '') + ' ' + C.state.res;
    $('res').setAttribute('aria-label', tt('res.have', { name: tt('res.name'), n: C.state.res }));
    $('more').textContent = tt('hud.menu');
    $('platform').textContent = '‹ ' + tt('hud.platform');
    const care = C.def.care;
    document.querySelectorAll('#bar button').forEach(b => {
      const k = b.dataset.open;
      b.classList.toggle('dot', (k === 'care' && C.state.animals.some(a => a.injury && !a.healAt || a.full < 0.25)) || (k === 'guests' && C.state.guests.length > 0));
      b.classList.toggle('glow', !!(C.practice(k) && C.practice(k).window && C.practiceOpen(C.practice(k)) && !C.doneToday(C.practice(k))));
    });
    if (care) { /* 留给以后：按需显示数量 */ }
  }
  function clock(h) { const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
  function buildBar() {
    const d = C.def;
    const items = d.practices.slice(0, d.barPractices || 4).map(p => ({ k: p.id, icon: p.icon, label: tt('prac.' + p.id + '.bar') }));
    items.push({ k: 'chore', icon: d.chore.icon || '🧹', label: tt('chore.label') });
    if (d.care) items.push({ k: d.care.mode === 'guests' ? 'guests' : 'care', icon: d.care.icon || '🐕', label: tt(d.care.mode === 'guests' ? 'bar.guests' : 'bar.care') });
    const bar = $('bar');
    bar.style.gridTemplateColumns = 'repeat(' + items.length + ', 1fr)';
    bar.innerHTML = items.map(i => `<button type="button" data-open="${esc(i.k)}"><span class="ico" aria-hidden="true">${esc(i.icon)}</span><span class="lbl">${esc(i.label)}</span></button>`).join('');
  }

  /* ---------- 面板 ---------- */
  function open(kind, arg) {
    U.focusBack = document.activeElement;
    U.sheet = kind; U.arg = arg == null ? null : arg; U.keep = false;
    if (kind !== 'read') { C.G.read = null; stopAudio(); }
    render();
    $('veil').hidden = false; $('sheet').hidden = false;
    const h = $('sheet').querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  }
  function close() {
    U.sheet = null; stopAudio(); C.G.read = null; C.G.count = null;
    if (C.G.timer && C.G.timer.running) stopTimer(false);
    $('veil').hidden = true; $('sheet').hidden = true;
    if (U.focusBack && U.focusBack.focus) U.focusBack.focus();
    C.save();
  }
  function head(title) { return `<div class="sh-head"><h2>${esc(title)}</h2><button type="button" class="x" data-act="close" aria-label="${esc(tt('common.close'))}">×</button></div>`; }
  function para(key, cls) { return C.has(key) ? `<p class="${cls || ''}">${esc(tt(key))}</p>` : ''; }

  function render() {
    const k = U.sheet;
    if (!k) return;
    const p = C.practice(k);
    let html = '';
    if (k === 'intro') html = sIntro();
    else if (p) html = sPractice(p);
    else if (k === 'care') html = sCare();
    else if (k === 'guests') html = sGuests();
    else if (k === 'shop') html = sShop();
    else if (k === 'calendar') html = sCalendar();
    else if (k === 'journal') html = sJournal();
    else if (k === 'settings') html = sSettings();
    else if (k === 'sources') html = sSources();
    else if (k === 'more') html = sMore();
    $('sheet').innerHTML = html;
    $('sheet').setAttribute('aria-label', ($('sheet').querySelector('h2') || {}).textContent || '');
  }

  function sIntro() {
    return head(tt('app.title')) + para('intro.body') + para('intro.how', 'note') + `<p class="warn">${esc(tt('intro.preview'))}</p>` +
      (C.has('intro.etiquette') ? `<p class="note">${esc(tt('intro.etiquette'))}</p>` : '') +
      `<div class="row"><button type="button" class="primary big" data-act="intro-go">${esc(tt('intro.start'))}</button></div>`;
  }

  function closedNote(p) {
    return `<p class="warn">${esc(tt('prac.closed', { from: p.window[0], to: p.window[1], time: clock(C.hourOf(C.env.now())) }))}</p>`;
  }
  function sPractice(p) {
    const base = 'prac.' + p.id;
    let html = head(tt(base + '.title')) + para(base + '.body');
    const open = C.practiceOpen(p), done = C.doneToday(p);
    if (p.kind === 'read') return sRead(p);
    if (p.kind === 'learn') return sLearn(p);
    if (p.kind === 'steps') {
      const n = p.steps;
      const st = U.arg && U.arg.step != null ? U.arg : { step: 0, demo: false };
      if (!open && !st.demo) return html + closedNote(p) + `<div class="row"><button type="button" class="secondary" data-act="steps-demo" data-p="${esc(p.id)}">${esc(tt('prac.demo'))}</button></div>`;
      if (done && !st.demo) return html + `<p class="note">${esc(tt('prac.today'))}</p>`;
      html += (st.demo ? `<p class="note">${esc(tt('prac.demoNote'))}</p>` : '') + '<ol class="steps">';
      for (let i = 1; i <= n; i++) html += `<li class="${i - 1 < st.step ? 'done' : i - 1 === st.step ? 'now' : ''}">${esc(tt(base + '.step.' + i))}</li>`;
      html += '</ol>';
      if (st.step < n) html += `<div class="row"><button type="button" class="primary big" data-act="step" data-p="${esc(p.id)}">${esc(tt(base + '.btn'))}</button><span class="note">${esc(tt('prac.step', { i: st.step + 1, n }))}</span></div>`;
      else html += `<p class="today">${esc(tt(base + '.done'))}</p>`;
      return html + para(base + '.note', 'note');
    }
    if (p.kind === 'offer') {
      const today = C.model().offered;
      html += '<div class="grid-btns">' + p.items.map(it => `<button type="button" class="item pick" data-act="offer" data-p="${esc(p.id)}" data-item="${esc(it)}" ${today.indexOf(it) >= 0 ? 'aria-disabled="true"' : ''}><span><b>${esc(tt('offer.' + it))}</b><small>${esc(today.indexOf(it) >= 0 ? tt('offer.lit') : (C.has('offer.why.' + it) ? tt('offer.why.' + it) : ''))}</small></span></button>`).join('') + '</div>';
      return html + para(base + '.note', 'note');
    }
    if (p.kind === 'count') {
      const c = C.G.count && C.G.count.p === p.id ? C.G.count : null;
      if (!c) {
        return html + `<h3>${esc(tt('count.pick'))}</h3><div class="row">` + p.targets.map(n => `<button type="button" class="secondary" data-act="count-start" data-p="${esc(p.id)}" data-n="${n}">${n}</button>`).join('') + '</div>' + para(base + '.note', 'note');
      }
      html += `<p class="mantra" lang="${esc(p.lang || '')}" ${p.dir ? `dir="${esc(p.dir)}"` : ''}>${esc(tt(base + '.mantra'))}</p>${C.has(base + '.mantraLatn') ? `<p class="latn">${esc(tt(base + '.mantraLatn'))}</p>` : ''}${para(base + '.mantraTr', 'note')}`;
      html += `<div class="beads" aria-hidden="true">${Array.from({ length: Math.min(c.n, 36) }, (_, i) => `<span class="${i < Math.round(c.i / c.n * Math.min(c.n, 36)) ? 'on' : ''}"></span>`).join('')}</div>`;
      if (c.i < c.n) html += `<div class="row"><button type="button" class="primary big" data-act="count" data-p="${esc(p.id)}">${esc(tt('count.tap'))}</button><span class="note">${esc(tt('count.progress', { i: c.i, n: c.n }))}</span></div>`;
      else html += `<p class="today">${esc(tt('count.done', { n: c.n }))}</p>`;
      return html;
    }
    if (p.kind === 'timer') {
      const tm = C.G.timer && C.G.timer.p === p.id ? C.G.timer : null;
      if (!tm || !tm.running) {
        return html + (tm && tm.msg ? `<p class="today">${esc(tm.msg)}</p>` : '') + `<h3>${esc(tt('timer.pick'))}</h3><div class="row">` + p.minutes.map(n => `<button type="button" class="secondary" data-act="timer-start" data-p="${esc(p.id)}" data-n="${n}">${esc(tt('timer.min', { n }))}</button>`).join('') + '</div>' + para(base + '.note', 'note');
      }
      const left = Math.max(0, Math.ceil((tm.end - Date.now()) / 1000));
      return html + `<p class="big-clock" aria-live="off">${esc(tt('timer.left', { m: Math.floor(left / 60), s: String(left % 60).padStart(2, '0') }))}</p>` + para(base + '.during', 'note') + `<div class="row"><button type="button" class="secondary" data-act="timer-stop">${esc(tt('timer.stop'))}</button></div>`;
    }
    return html;
  }

  function sLearn(p) {
    const base = 'prac.' + p.id;
    const card = U.arg && U.arg.card;
    if (card) {
      return head(tt('learn.' + card + '.title')) + `<div class="learn">${tt('learn.' + card + '.body').split('\n').map(s => `<p>${esc(s)}</p>`).join('')}</div>` +
        `<div class="row"><button type="button" class="primary" data-act="learn-done" data-p="${esc(p.id)}" data-card="${esc(card)}">${esc(tt('learn.read'))}</button><button type="button" class="secondary" data-act="open" data-k="${esc(p.id)}">${esc(tt('common.back'))}</button></div>`;
    }
    return head(tt(base + '.title')) + para(base + '.body') + '<div class="list">' + p.cards.map(c => `<button type="button" class="item pick" data-act="learn" data-p="${esc(p.id)}" data-card="${esc(c)}"><span><b>${esc(tt('learn.' + c + '.title'))}</b>${C.has('learn.' + c + '.sub') ? `<small class="note">${esc(tt('learn.' + c + '.sub'))}</small>` : ''}</span><span aria-hidden="true">›</span></button>`).join('') + '</div>' + para(base + '.note', 'note');
  }

  /* 诵读：原文 / 转写 / 译文逐行对齐 */
  function textTitle(r) { return r.title[C.lang] || r.title.en || Object.values(r.title)[0]; }
  function scriptMode() {
    const ids = (C.pack.options.content || []).map(o => o.id);
    const i = ids.indexOf(C.state.opt.script);
    return i === 1 ? 'latn' : i === 2 ? 'both' : 'orig';
  }
  function sRead(p) {
    const base = 'prac.' + p.id;
    const texts = C.texts.filter(r => !p.texts || p.texts.indexOf(r.key) >= 0);
    const rd = C.G.read;
    if (!rd) {
      return head(tt(base + '.title')) + para(base + '.body') + `<h3>${esc(tt('read.pick'))}</h3><div class="list">` +
        texts.map(r => `<button type="button" class="item pick" data-act="read-open" data-key="${esc(r.key)}"><span><b>${esc(textTitle(r))}</b><small class="note">${esc(C.has('usage.' + r.key) ? tt('usage.' + r.key) : '')}</small></span><span class="note">${esc(tt('read.lines', { n: r.text.orig.length }))}</span></button>`).join('') + '</div>' +
        `<p class="note">${esc(tt('read.draft'))}</p>`;
    }
    const r = texts.find(x => x.key === rd.key) || texts[0];
    const mode = scriptMode(), tr = C.state.opt.tr;
    const n = r.text.orig.length;
    const vk = voiceKind(r);
    const rec = r.audio && (T.VOICES || {})[r.audio];
    let vnote = '';
    if (vk === 'off') vnote = tt('read.voiceOff');
    else if (vk === 'reference' && rec) vnote = tt('read.voiceRec', { who: rec.performer || rec.credit || '?', license: rec.license });
    else if (r.noTTS) vnote = tt('read.noTts');
    else if (!voiceFor(r.tts)) vnote = tt('read.voiceNone');
    else vnote = tt('read.voiceTts');
    let html = head(textTitle(r)) + (C.has('usage.' + r.key) ? `<p class="note">${esc(tt('usage.' + r.key))}</p>` : '');
    html += '<ol class="chant">' + r.text.orig.map((line, i) => {
      const cls = i === rd.i ? 'now' : i < rd.i ? 'past' : '';
      const o = mode !== 'latn' ? `<span class="pi" lang="${esc(r.origLang || '')}" ${r.dir ? `dir="${esc(r.dir)}"` : ''}>${esc(line)}</span>` : '';
      const l = mode !== 'orig' && r.text.latn ? `<span class="la">${esc(r.text.latn[i])}</span>` : '';
      const t2 = tr !== 'none' && r.translations && r.translations[tr] ? `<span class="tr" lang="${esc(tr)}">${esc(r.translations[tr][i])}</span>` : '';
      return `<li class="${cls}" ${i === rd.i ? 'aria-current="true"' : ''}>${o || (mode === 'latn' ? '' : '')}${l}${t2}</li>`;
    }).join('') + '</ol>';
    html += `<p class="note voice">${esc(vnote)}</p>`;
    if (rd.i < n) {
      html += `<div class="row"><button type="button" class="primary" data-act="read-next">${esc(tt('read.next'))}</button><button type="button" class="secondary" data-act="read-prev" ${rd.i ? '' : 'disabled'}>${esc(tt('read.prev'))}</button>` +
        `<button type="button" class="secondary" data-act="read-auto">${esc(rd.auto ? tt('read.stop') : tt('read.auto'))}</button>` +
        (rec && vk === 'reference' ? `<button type="button" class="secondary" data-act="read-rec">${esc(rd.playing ? tt('read.pause') : tt('read.play'))}</button>` : '') +
        `<span class="note">${esc(tt('read.progress', { i: rd.i + 1, n }))}</span></div>`;
    } else {
      html += `<p class="today">${esc(tt('read.done', { title: textTitle(r) }))}</p><div class="row"><button type="button" class="secondary" data-act="read-again">${esc(tt('read.again'))}</button><button type="button" class="secondary" data-act="read-list">${esc(tt('read.list'))}</button></div>`;
    }
    return html + `<p class="note">${esc(tt('read.draft'))}</p>`;
  }
  function readLine() {
    const rd = C.G.read;
    if (!rd) return;
    const r = C.texts.find(x => x.key === rd.key);
    if (!r || rd.i >= r.text.orig.length) return;
    if (r.noTTS || voiceKind(r) !== 'system' || !voiceFor(r.tts)) { if (rd.auto) rd.tm = setTimeout(nextLine, 2600); return; }
    const line = r.ttsText ? r.ttsText[rd.i] : r.text.orig[rd.i];
    speak(line, r.tts, r.rate, () => { if (C.G.read === rd && rd.auto) nextLine(); }, r);
  }
  function nextLine() {
    const rd = C.G.read;
    if (!rd) return;
    const r = C.texts.find(x => x.key === rd.key);
    rd.i++;
    if (rd.i >= r.text.orig.length) { rd.auto = false; C.readDone(r.key); C.save(); bell(); }
    else readLine();
    render(); hud();
  }

  function careMeters(a) {
    const bar = (k, v) => `<div class="meter"><span>${esc(tt(k))}</span><span class="track"><span style="width:${Math.round(v * 100)}%"></span></span></div>`;
    return bar('care.full', a.full) + bar('care.trust', a.trust);
  }
  function sCare() {
    const S = C.state;
    const a = U.arg != null ? S.animals.find(x => x.id === U.arg) : null;
    if (a) {
      let html = head(C.animalName(a));
      if (a.injury) html += `<p class="warn">${esc(tt('care.injured', { what: tt('inj.' + a.injury) }))}${a.healAt ? ' · ' + esc(tt('care.healing')) : ''}</p>`;
      html += careMeters(a);
      const food = 'food.' + a.kind;
      html += `<div class="grid-btns">
        <button type="button" class="item pick" data-act="feed" data-id="${a.id}"><span><b>${esc(tt('care.feed'))}</b><small>${esc(tt('shop.' + food))} · ${esc(tt('shop.have', { n: S.inv[food] || 0 }))}</small></span></button>
        <button type="button" class="item pick" data-act="water" data-id="${a.id}"><span><b>${esc(tt('care.water'))}</b></span></button>
        ${a.kind !== 'bird' ? `<button type="button" class="item pick" data-act="pet" data-id="${a.id}"><span><b>${esc(tt('care.pet'))}</b></span></button>` : ''}
        ${a.injury && !a.healAt ? `<button type="button" class="item pick" data-act="treat" data-id="${a.id}"><span><b>${esc(tt('care.treat'))}</b><small>${esc(tt('shop.have', { n: S.inv.med || 0 }))}</small></span></button>` : ''}
      </div>`;
      if (!a.name) html += `<h3>${esc(tt('care.pickName'))}</h3><div class="row">` + C.nameOptions(a).map(n => `<button type="button" class="secondary" data-act="name" data-id="${a.id}" data-name="${esc(n)}">${esc(n)}</button>`).join('') + '</div>';
      if (a.kind === 'dog' || a.kind === 'cat') html += `<p class="note">${esc(tt(C.canAdopt(a) ? 'care.adoptReady' : 'care.adoptNot'))}</p><div class="row"><button type="button" class="primary" data-act="adopt" data-id="${a.id}" ${C.canAdopt(a) ? '' : 'aria-disabled="true"'}>${esc(tt('care.adopt'))}</button></div>`;
      else if (a.kind === 'cow') html += `<p class="note">${esc(tt('care.stays', { name: C.animalName(a) }))}</p>`;
      return html + `<div class="row"><button type="button" class="secondary" data-act="open" data-k="care">${esc(tt('common.back'))}</button><button type="button" class="secondary" data-act="open" data-k="shop">${esc(tt('menu.shop'))}</button></div>`;
    }
    let html = head(tt('care.title')) + para('care.intro', 'note');
    if (!S.animals.length) html += `<p class="note">${esc(tt('care.empty'))}</p>`;
    html += '<div class="list">' + S.animals.map(x => `<button type="button" class="item pick" data-act="animal" data-id="${x.id}"><span><b>${esc(C.animalName(x))}</b><small class="note">${esc(x.injury ? tt('care.injured', { what: tt('inj.' + x.injury) }) : tt('kind.' + x.kind))}</small></span><span aria-hidden="true">›</span></button>`).join('') + '</div>';
    return html + `<div class="row"><button type="button" class="secondary" data-act="open" data-k="shop">${esc(tt('menu.shop'))}</button></div>`;
  }
  function sGuests() {
    const S = C.state;
    let html = head(tt('guests.title')) + para('guests.intro', 'note');
    if (!S.guests.length) html += `<p class="note">${esc(tt('guests.empty'))}</p>`;
    html += '<div class="list">' + S.guests.map(g => `<div class="item"><span><b>${esc(C.guestName(g))}</b></span><button type="button" class="primary" data-act="serve" data-id="${g.id}">${esc(tt('guests.serve'))}</button></div>`).join('') + '</div>';
    return html + `<p class="note">${esc(tt('res.have', { name: tt('res.name'), n: S.res }))}</p>`;
  }
  function sShop() {
    const S = C.state;
    const items = C.shopItems();
    return head(tt('shop.title')) + `<p class="note">${esc(tt('shop.note', { res: tt('res.name') }))}</p><div class="list">` + items.map(it => {
      const name = it === 'tool' ? tt('shop.tool') : tt('shop.' + it);
      const have = it === 'tool' ? tt('shop.level', { n: S.tool }) : tt('shop.have', { n: S.inv[it] || 0 });
      return `<div class="item"><span><b>${esc(name)}</b><small class="note">${esc(have)} · ${esc(tt('shop.cost', { n: C.cost(it), res: tt('res.name') }))}</small></span><button type="button" class="primary" data-act="buy" data-item="${esc(it)}" ${S.res < C.cost(it) || (it === 'tool' && S.tool >= 4) ? 'aria-disabled="true"' : ''}>${esc(tt('shop.buy'))}</button></div>`;
    }).join('') + '</div>';
  }
  function sCalendar() {
    const cal = C.pack && C.pack.calendar;
    const now = new Date(C.env.now());
    let html = head(tt('cal.title'));
    if (!cal || !T.Calendar) return html + `<p class="note">${esc(tt('cal.none'))}</p>`;
    const name = o => tt(o.id) + (o.approx ? tt('cal.approx') : '');
    T.Calendar.observancesOn(cal, now).forEach(o => { html += `<p class="today">${esc(tt('cal.todayIs', { name: name(o) }))}</p>`; });
    const next = T.Calendar.upcoming(cal, now, 370, 12).filter(o => o.inDays > 0);
    let fmt = null;
    try { fmt = new Intl.DateTimeFormat(C.lang, { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }); } catch (e) { fmt = null; }
    html += `<h3>${esc(tt('cal.next'))}</h3>`;
    html += next.length ? '<ul class="plain">' + next.map(o => `<li>${esc(name(o))} <span class="note">${esc(fmt ? fmt.format(new Date(o.date + 'T12:00:00Z')) : o.date)} · ${esc(o.inDays === 1 ? tt('cal.tomorrow') : tt('cal.inDays', { n: o.inDays }))}</span></li>`).join('') + '</ul>' : `<p class="note">${esc(tt('cal.none'))}</p>`;
    return html + para('cal.note', 'note');
  }
  function sJournal() {
    const S = C.state;
    const rows = [[tt('journal.chore'), S.log.chore], [tt('journal.read'), S.log.read]];
    C.def.practices.forEach(p => { if (p.kind !== 'read') rows.push([tt('prac.' + p.id + '.bar'), S.log.prac[p.id] || 0]); });
    if (C.def.care && C.def.care.mode === 'animals') rows.push([tt('journal.adopted'), S.log.adopted]);
    if (C.def.care && C.def.care.mode === 'guests') rows.push([tt('journal.served'), S.log.served]);
    let html = head(tt('journal.title')) + `<p class="note">${esc(tt('journal.note'))}</p><dl class="counts">` + rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(tt('journal.times', { n: r[1] }))}</dd>`).join('') + '</dl>';
    const recent = S.journal.slice(-8).reverse();
    html += `<h3>${esc(tt('journal.recent'))}</h3>` + (recent.length ? '<ul class="plain">' + recent.map(j => {
      const when = new Date(j.at).toLocaleString(C.lang, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      let what = j.kind === 'chore' ? tt('journal.chore') : j.kind === 'read' ? (C.texts.find(r => r.key === j.key) ? textTitle(C.texts.find(r => r.key === j.key)) : tt('journal.read')) : j.kind === 'prac' ? tt('prac.' + j.id + '.bar') + (j.item ? ' · ' + tt('offer.' + j.item) : '') + (j.card ? ' · ' + tt('learn.' + j.card + '.title') : '') : j.kind === 'adopted' ? tt('journal.adopted') + ' · ' + j.name : j.kind === 'served' ? tt('journal.served') : j.name || j.kind;
      return `<li><span class="note">${esc(when)}</span> ${esc(what)}</li>`;
    }).join('') + '</ul>' : `<p class="note">${esc(tt('journal.empty'))}</p>`);
    return html;
  }
  function radio(name, cur, list) {
    return '<div class="opts">' + list.map(o => `<label><input type="radio" name="${esc(name)}" value="${esc(o.id)}" ${o.id === cur ? 'checked' : ''} ${o.off ? 'disabled' : ''}> ${esc(o.label)}${o.small ? ` <small>${esc(o.small)}</small>` : ''}</label>`).join('') + '</div>';
  }
  function sSettings() {
    const S = C.state, P = C.pack.options;
    const endo = { 'zh-CN': '简体中文', en: 'English', 'zh-TW': '繁體中文' };
    let html = head(tt('set.title'));
    html += `<fieldset><legend>${esc(tt('set.ui'))}</legend>${radio('ui', S.opt.ui, C.def.langs.map(l => ({ id: l, label: endo[l] || l, small: (P.ui.find(o => o.id === l) || {}).state === 'draft' ? tt('common.draft') : '' })))}</fieldset>`;
    html += `<fieldset><legend>${esc(tt('set.script'))}</legend>${radio('script', S.opt.script, P.content.filter(o => o.state !== 'off').map(o => ({ id: o.id, label: tt('opt.content.' + o.id) })))}</fieldset>`;
    html += `<fieldset><legend>${esc(tt('set.tr'))}</legend>${radio('tr', S.opt.tr, P.translation.filter(o => o.state !== 'off').map(o => ({ id: o.id, label: tt('tr.' + o.id), small: o.state === 'draft' ? tt('common.draft') : '' })))}</fieldset>`;
    html += `<fieldset><legend>${esc(tt('set.voice'))}</legend>${radio('voice', S.opt.voice, P.voice.filter(o => o.state !== 'off').map(o => ({ id: o.id, label: tt('voice.' + o.id) })).concat([{ id: 'off', label: tt('set.voice.off') }]))}</fieldset>`;
    html += `<fieldset><legend>${esc(tt('set.sound'))}</legend>${radio('sound', S.opt.sound ? 'on' : 'off', [{ id: 'on', label: tt('set.on') }, { id: 'off', label: tt('set.off') }])}</fieldset>`;
    html += `<fieldset><legend>${esc(tt('set.motion'))}</legend>${radio('motion', S.opt.reduceMotion ? 'on' : 'off', [{ id: 'on', label: tt('set.on') }, { id: 'off', label: tt('set.off') }])}</fieldset>`;
    return html + `<p class="note">${esc(tt('set.note'))}</p>`;
  }
  function sSources() {
    let html = head(tt('src.title'));
    html += C.texts.map(r => {
      const rec = r.audio && (T.VOICES || {})[r.audio];
      return `<div class="item"><span><b>${esc(textTitle(r))}</b><small class="note">${esc(tt('src.text', { src: r.source.name }))} · ${esc(tt('src.license', { lic: r.licenseNote || r.license }))}</small>` +
        (rec ? `<small class="note">${esc(tt('src.audio', { who: rec.performer || '?', lic: rec.license }))} · <a href="${esc(rec.sourceUrl)}" target="_blank" rel="noopener">${esc(tt('src.link'))}</a></small>` : '') +
        `<small class="note">${esc(tt('src.review', { status: r.reviewStatus }))}</small></span></div>`;
    }).join('');
    return html + para('src.note', 'note');
  }
  function sMore() {
    const extra = C.def.practices.slice(C.def.barPractices || 4);
    const items = extra.map(p => ({ k: p.id, label: (p.icon || '') + ' ' + tt('prac.' + p.id + '.bar') }))
      .concat([{ k: 'calendar', label: '📅 ' + tt('menu.calendar') }, { k: 'journal', label: '📓 ' + tt('menu.journal') }])
      .concat(C.def.care && C.def.care.mode === 'animals' ? [{ k: 'shop', label: '🛒 ' + tt('menu.shop') }] : [])
      .concat([{ k: 'settings', label: '⚙️ ' + tt('menu.settings') }, { k: 'sources', label: '📜 ' + tt('menu.sources') }, { k: 'intro', label: 'ℹ️ ' + tt('app.title') }]);
    return head(tt('hud.menu')) + '<div class="list">' + items.map(i => `<button type="button" class="item pick" data-act="open" data-k="${esc(i.k)}"><span>${esc(i.label)}</span><span aria-hidden="true">›</span></button>`).join('') +
      `<a class="item" href="index.html"><span>↩︎ ${esc(tt('menu.platform'))}</span></a></div>`;
  }

  /* ---------- 计时器 ---------- */
  function startTimer(pid, n) {
    C.G.timer = { p: pid, n, end: Date.now() + n * 60000, startAt: Date.now(), running: true };
    bell();
    clearInterval(U.timerH);
    U.timerH = setInterval(() => {
      const tm = C.G.timer;
      if (!tm || !tm.running) return clearInterval(U.timerH);
      if (Date.now() >= tm.end) { finishTimer(true); return; }
      if (U.sheet === pid) { const el = document.querySelector('.big-clock'); if (el) { const left = Math.ceil((tm.end - Date.now()) / 1000); el.textContent = tt('timer.left', { m: Math.floor(left / 60), s: String(left % 60).padStart(2, '0') }); } }
    }, 500);
  }
  function finishTimer(full) {
    const tm = C.G.timer;
    if (!tm) return;
    clearInterval(U.timerH);
    tm.running = false;
    const mins = Math.max(0, Math.round((Date.now() - tm.startAt) / 60000));
    if (full) { C.practiceDone(tm.p, { min: tm.n }); tm.msg = tt('timer.done', { n: tm.n }); bell(); bell(); }
    else tm.msg = tt('timer.stopped', { n: mins });
    toast(tm.msg); C.save();
    if (U.sheet) render();
  }
  function stopTimer() { finishTimer(false); }

  /* ---------- 事件 ---------- */
  function onSheetClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    const act = b.dataset.act, id = b.dataset.id != null ? +b.dataset.id : null, p = b.dataset.p;
    ac();
    switch (act) {
      case 'close': close(); return;
      case 'intro-go': C.state.seenIntro = true; C.save(); close(); ambient(true); return;
      case 'open': open(b.dataset.k); return;
      case 'steps-demo': U.arg = { step: 0, demo: true }; render(); return;
      case 'step': {
        const pr = C.practice(p), st = U.arg && U.arg.step != null ? U.arg : { step: 0, demo: false };
        st.step++; U.arg = st;
        if (pr.sound) bell(pr.sound);
        if (pr.audio && st.step === 1) playFile(pr.audio);
        if (st.step >= pr.steps) { if (!st.demo && C.practiceDone(p)) toast(tt('prac.done')); C.save(); }
        render(); hud(); return;
      }
      case 'offer': C.offer(p, b.dataset.item); bell(C.practice(p).sound); C.save(); flush(); render(); return;
      case 'count-start': C.G.count = { p, n: +b.dataset.n, i: 0 }; render(); return;
      case 'count': {
        const c = C.G.count; c.i++;
        if (C.practice(p).sound && c.i % 27 === 0) bell(C.practice(p).sound);
        if (c.i >= c.n) { C.practiceDone(p, { n: c.n }); bell(); C.save(); toast(tt('count.done', { n: c.n })); }
        render(); return;
      }
      case 'timer-start': startTimer(p, +b.dataset.n); render(); return;
      case 'timer-stop': stopTimer(); return;
      case 'learn': U.arg = { card: b.dataset.card }; render(); return;
      case 'learn-done': C.practiceDone(p, { card: b.dataset.card }); toast(tt('learn.done', { title: tt('learn.' + b.dataset.card + '.title') })); C.save(); U.arg = null; render(); return;
      case 'read-open': C.G.read = { key: b.dataset.key, i: 0, auto: false }; render(); readLine(); return;
      case 'read-next': stopAudioTts(); nextLine(); return;
      case 'read-prev': stopAudioTts(); C.G.read.i = Math.max(0, C.G.read.i - 1); render(); readLine(); return;
      case 'read-auto': { const rd = C.G.read; rd.auto = !rd.auto; if (rd.auto) readLine(); else stopAudioTts(); render(); return; }
      case 'read-rec': toggleRecording(); return;
      case 'read-again': C.G.read.i = 0; render(); readLine(); return;
      case 'read-list': stopAudio(); C.G.read = null; render(); return;
      case 'animal': U.arg = id; render(); return;
      case 'feed': C.feed(id); break;
      case 'water': C.water(id); break;
      case 'pet': C.pet(id); break;
      case 'treat': C.treat(id); break;
      case 'name': C.giveName(id, b.dataset.name); break;
      case 'adopt': if (C.adopt(id)) U.arg = null; break;
      case 'serve': C.serve(id); break;
      case 'buy': C.buy(b.dataset.item); break;
      default: return;
    }
    C.save(); flush();
  }
  /* 功课附带的参考录音（如晚祷、宣礼）：只在用户选了“参考录音”或默认声音时播放，静音设置下不播 */
  function playFile(voiceId) {
    const v = (T.VOICES || {})[voiceId];
    if (!v || !v.file || C.state.opt.voice === 'off' || !C.state.opt.sound) return;
    if (C.G.audio) C.G.audio.pause();
    C.G.audio = new Audio(v.file); C.G.audio.dataset.src = v.file;
    C.G.audio.play().catch(() => {});
    toast(tt('read.voiceRec', { who: v.performer || '?', license: v.license }));
  }
  function stopAudioTts() { if (synth) synth.cancel(); const rd = C.G.read; if (rd && rd.tm) clearTimeout(rd.tm); }
  function toggleRecording() {
    const rd = C.G.read, r = C.texts.find(x => x.key === rd.key), v = (T.VOICES || {})[r.audio];
    if (!v) return;
    if (!C.G.audio || C.G.audio.dataset.src !== v.file) {
      if (C.G.audio) C.G.audio.pause();
      C.G.audio = new Audio(v.file); C.G.audio.dataset.src = v.file;
      C.G.audio.onended = () => { rd.playing = false; render(); };
    }
    if (rd.playing) { C.G.audio.pause(); rd.playing = false; } else { C.G.audio.play().catch(() => {}); rd.playing = true; }
    render();
  }
  function onSettings(e) {
    const el = e.target;
    if (!el || el.type !== 'radio') return;
    const S = C.state;
    if (el.name === 'ui') { C.setLang(el.value); buildBar(); }
    if (el.name === 'script') S.opt.script = el.value;
    if (el.name === 'tr') S.opt.tr = el.value;
    if (el.name === 'voice') S.opt.voice = el.value;
    if (el.name === 'sound') { S.opt.sound = el.value === 'on'; ambient(S.opt.sound); }
    if (el.name === 'motion') S.opt.reduceMotion = el.value === 'on';
    C.syncPlatform(); C.save(); render(); hud();
  }
  function onBar(e) {
    const b = e.target.closest('button[data-open]');
    if (!b) return;
    ac();
    const k = b.dataset.open;
    if (k === 'chore') { toast(C.restNow() ? tt('chore.rest', { name: tt(C.restNow()) }) : C.state.piles.length ? tt('chore.where', { pile: tt('chore.pile') }) : tt('chore.none')); C.G.flash = 2; return; }
    open(k);
  }
  function onCanvas(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left), y = (e.clientY - r.top);
    const h = K.find(x, y);
    ac();
    if (!h) return;
    if (h.type === 'pile') { C.sweep(h.id); bell('chime'); C.save(); flush(); }
    else if (h.type === 'animal') open('care', h.id);
    else if (h.type === 'guest') { C.serve(h.id); C.save(); flush(); }
    else if (h.type === 'spot') open(h.id);
  }

  /* ---------- 场景 ---------- */
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    W = Math.max(200, r.width); H = Math.max(200, r.height);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function weather(dt, m) {
    const G = C.G;
    G.weatherT -= dt;
    if (G.weatherT <= 0) {
      G.weatherT = 90 + Math.random() * 120;
      const wet = { monsoon: 0.6, summer: 0.3, spring: 0.25, autumn: 0.2, hot: 0.08, cool: 0.08, winter: 0.12 }[m.season] || 0.15;
      G.rainTarget = Math.random() < wet ? 0.4 + Math.random() * 0.6 : 0;
    }
    G.rain += (G.rainTarget - G.rain) * Math.min(1, dt * 0.2);
  }
  function draw(t) {
    K.hits = [];
    const m = C.model();
    m.t = t;
    m.flash = C.G.flash > 0;
    const d = C.def, sc = d.scene;
    const horizon = H * (d.horizon || 0.5);
    ctx.clearRect(0, 0, W, H);
    K.sky(ctx, W, H, m, horizon);
    (sc.back || sc)(ctx, W, H, m, K, t);
    const style = typeof d.chore.pile === 'function' ? d.chore.pile(m) : d.chore.pile || 'leaves';
    m.piles.slice().sort((a, b) => a.y - b.y).forEach(p => {
      K.pile(ctx, p, W, H, style, m);
      if (m.flash) { ctx.strokeStyle = 'rgba(255,220,120,' + (0.5 + Math.sin(t * 10) * 0.4) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 22, 0, Math.PI * 2); ctx.stroke(); }
    });
    m.animals.slice().sort((a, b) => a.y - b.y).forEach(a => K.animal(ctx, a, W, H, t, m));
    m.guests.forEach(g => K.guest(ctx, g, W, H, t, d.care && d.care.looks));
    if (sc.front) sc.front(ctx, W, H, m, K, t);
    K.weather(ctx, W, H, m, t);
    K.dim(ctx, W, H, m);
    if (sc.lights) sc.lights(ctx, W, H, m, K, t);
  }
  function frame(ts) {
    if (!T0) T0 = ts;
    const real = Math.min(2, (ts - (lastFrame || ts)) / 1000);
    lastFrame = ts;
    let left = real;
    while (left > 0) { const dt = Math.min(0.1, left); C.step(dt); left -= dt; }
    const G = C.G;
    G.saveT += real; if (G.saveT > 15) { G.saveT = 0; if (!C.save()) toast(tt('toast.saveFailed')); }
    if (G.toastT > 0) { G.toastT -= real; if (G.toastT <= 0) $('toast').hidden = true; }
    if (G.flash > 0) G.flash -= real;
    if (C.events.length) flush();
    hintT -= real;
    if (hintT <= 0) { hintT = 2; const h = C.hint(); $('hint').textContent = tt(h.key, h.p); hud(); }
    const m = C.model();
    weather(real, m);
    draw(m.reduceMotion ? Math.floor(ts / 1000) : ts / 1000);
    requestAnimationFrame(frame);
  }

  function boot() {
    let storage = null;
    try { storage = window.localStorage; storage.getItem('x'); } catch (e) { storage = null; }
    const r = C.start(storage, null, location.hash);
    C.env.now = () => Date.now();
    const th = C.def.theme || {};
    const rootEl = document.documentElement;
    Object.keys(th).forEach(k => rootEl.style.setProperty('--' + k, th[k]));
    document.title = tt('app.title');
    if (C.def.font) {
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = C.def.font; l.media = 'print';
      l.onload = () => { l.media = 'all'; };
      document.head.appendChild(l);
    }
    $('scene').setAttribute('aria-label', tt('app.label'));
    canvas = $('scene'); ctx = canvas.getContext('2d');
    buildBar(); resize(); hud();
    window.addEventListener('resize', resize);
    $('bar').addEventListener('click', onBar);
    $('sheet').addEventListener('click', onSheetClick);
    $('sheet').addEventListener('change', onSettings);
    $('veil').addEventListener('click', close);
    $('more').addEventListener('click', () => open('more'));
    canvas.addEventListener('click', onCanvas);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && U.sheet) close(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) C.save(); });
    if (r.note === 'restored') toast(tt('toast.restored'));
    else if (r.awayHours) toast(tt('toast.welcomeBack', { h: r.awayHours }));
    if (!C.state.seenIntro) open('intro');
    C.save();
    requestAnimationFrame(frame);
  }

  C.boot = boot;
  C.ui = { open, close, render, bell, draw: (c, w, h, t) => { ctx = c; W = w; H = h; draw(t); } };
})();
