/*
 * 平台界面（DOM）。所有面向用户的文字都走 t()，本文件不写任何界面文案。
 * 路由用 # 片段，兼容静态托管和直接双击打开：
 *   #view=home | #view=family&f=buddhism | #view=prep&v=… | #v=buddhism.han&ui=…（进入设置）
 *   #view=sources&v=… | #view=settings | #view=brand | #view=scripts
 */
(function (root) {
  'use strict';
  const T = root.Threshold;
  const doc = root.document;

  const app = { save: null, note: '', i18n: null, state: { view: 'home', family: null, version: null }, importPending: null };
  T.app = app;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (k, p) => app.i18n.t(k, p);

  function store() {
    try { return root.localStorage; } catch (e) { return null; }
  }

  function persist() {
    const s = store();
    if (!s || !T.Save.write(s, app.save)) toast(t('toast.saveFailed'));
  }

  /* ---------- 语言 ---------- */
  function setLocale(id) {
    app.i18n = T.createI18n(id);
    const html = doc.documentElement;
    html.lang = app.i18n.lang;
    html.dir = app.i18n.dir;
    html.setAttribute('data-script', app.i18n.info.script);
    doc.title = t('brand.title');
  }

  /* ---------- 显示：字号与动效 ---------- */
  const SIZES = { m: 1, l: 1.12, xl: 1.25 };
  function applyDisplay() {
    const d = (app.save && app.save.display) || {};
    const html = doc.documentElement;
    html.style.zoom = SIZES[d.size] && d.size !== 'm' ? String(SIZES[d.size]) : '';
    if (d.motion === 'reduce' || d.motion === 'full') html.setAttribute('data-motion', d.motion);
    else html.removeAttribute('data-motion');
  }

  /* 各传统包的游戏存档（只在本机）。存档码会一起带上。 */
  function packSaveKeys() {
    const keys = [];
    Object.keys(T.PACKS || {}).forEach(id => (T.PACKS[id].saveKeys || []).forEach(k => keys.push(k)));
    return keys;
  }

  function readPackSaves() {
    const s = store();
    const out = {};
    if (!s) return out;
    packSaveKeys().forEach(k => {
      try {
        const v = s.getItem(k);
        if (v) out[k] = v;
      } catch (e) { /* 读不到就跳过 */ }
    });
    return out;
  }

  /* ---------- 播报与提示 ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = doc.getElementById('toast');
    if (el) {
      el.textContent = msg;
      el.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
    }
    announce(msg);
  }

  function announce(msg) {
    const sr = doc.getElementById('sr');
    if (sr) sr.textContent = msg;
  }

  /* ---------- 路由 ---------- */
  function routeFromHash() {
    const link = T.Save.parseLink(root.location.hash);
    const st = app.state;
    st.family = link.family;
    st.version = link.versionId;
    if (link.view) st.view = link.view;
    else if (link.versionId) st.view = 'pack';
    else st.view = 'home';

    if (st.version) {
      const hit = T.findVersion(st.version);
      if (!hit) {
        st.view = 'home';
        st.version = null;
      } else {
        st.family = hit.family.id;
        if ((st.view === 'pack' || st.view === 'sources') && !T.canEnter(st.version)) st.view = 'prep';
      }
    }
    if (st.view === 'pack' && Object.keys(link.prefs).length) {
      const merged = Object.assign({}, prefsFor(st.version), link.prefs);
      app.save.prefs[st.version] = T.Save.normalizePrefs(st.version, merged);
      persist();
    }
    if (st.view === 'family') {
      const f = T.FAMILIES.find(x => x.id === st.family);
      if (!f) st.view = 'home';
      else if (!f.versions.length) st.view = 'prep';
    }
  }

  function go(hash) {
    if (root.location.hash === hash) {
      routeFromHash();
      render();
    } else {
      root.location.hash = hash;
    }
  }

  function prefsFor(versionId) {
    const pack = packOf(versionId);
    if (!pack) return {};
    if (app.save.prefs[versionId]) return app.save.prefs[versionId];
    /* 没选过时，界面语言默认跟平台语言走（包里有且可选的话）。 */
    const d = Object.assign({}, pack.defaults);
    const cur = app.i18n && app.i18n.locale;
    const opt = pack.options.ui.find(o => o.id === cur);
    if (opt && opt.state !== 'off') d.ui = cur;
    return d;
  }

  function packOf(versionId) {
    const hit = T.findVersion(versionId);
    return hit && hit.version.pack ? T.PACKS[hit.version.pack] : null;
  }

  /* ---------- 小部件 ---------- */
  const badge = st => `<span class="status s-${esc(st)}">${esc(t('status.' + st))}</span>`;

  function crumbs(parts) {
    return `<nav class="crumbs" aria-label="${esc(t('a11y.breadcrumb'))}">${parts.map((p, i) => {
      const item = p.hash ? `<a href="${esc(p.hash)}">${esc(p.label)}</a>` : `<span aria-current="page">${esc(p.label)}</span>`;
      return item + (i < parts.length - 1 ? '<span class="sep" aria-hidden="true">›</span>' : '');
    }).join('')}</nav>`;
  }

  function logo(id, size) {
    return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
  }

  /* ---------- 视图 ---------- */
  function viewHome() {
    const last = app.save.lastVersion && T.canEnter(app.save.lastVersion) ? app.save.lastVersion : null;
    return `
      <section class="intro">
        <h1>${esc(t('home.title'))}</h1>
        <p class="lead">${esc(t('home.lead'))}</p>
      </section>
      ${last ? `<a class="resume" href="${esc(T.Save.formatLink(last, null, 'pack'))}">
        <span class="note">${esc(t('home.resume'))}</span>
        <span class="name">${esc(t('version.' + last + '.name'))} · ${esc(t('version.' + last + '.place'))}</span>
      </a>` : ''}
      <ul class="grid" role="list">
        ${T.FAMILIES.map(f => {
          const st = T.familyStatus(f);
          const live = f.versions.filter(v => v.status === 'live').length;
          const hash = f.versions.length ? '#view=family&f=' + f.id : '#view=prep&f=' + f.id;
          return `<li><a class="card" href="${hash}">
            <span class="row"><span class="name">${esc(t('family.' + f.id + '.name'))}</span>${badge(st)}</span>
            <span class="meta">${esc(t('family.' + f.id + '.note'))}</span>
            ${f.versions.length ? `<span class="note">${esc(t('home.versionCount', { n: f.versions.length, live }))}</span>` : ''}
          </a></li>`;
        }).join('')}
      </ul>`;
  }

  function viewFamily() {
    const f = T.FAMILIES.find(x => x.id === app.state.family);
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('family.' + f.id + '.name') }])}
      <section class="intro">
        <h1>${esc(t('family.title', { name: t('family.' + f.id + '.name') }))}</h1>
        <p class="lead">${esc(t('family.lead'))}</p>
      </section>
      <ul class="grid" role="list">
        ${f.versions.map(v => {
          const hash = T.canEnter(v.id) ? T.Save.formatLink(v.id, null, 'pack') : '#view=prep&v=' + v.id;
          return `<li><a class="card" href="${esc(hash)}">
            <span class="row"><span class="name">${esc(t('version.' + v.id + '.name'))}</span>${badge(v.status)}</span>
            <span class="meta">${esc(t('version.' + v.id + '.place'))} · ${esc(t('version.' + v.id + '.region'))}</span>
            <span class="note">${esc(t('version.' + v.id + '.note'))}</span>
          </a></li>`;
        }).join('')}
      </ul>`;
  }

  function viewPrep() {
    const st = app.state;
    const f = T.FAMILIES.find(x => x.id === st.family);
    const hit = st.version ? T.findVersion(st.version) : null;
    const v = hit ? hit.version : null;
    const status = v ? v.status : T.familyStatus(f);
    const title = v ? t('version.' + v.id + '.name') : t('family.' + f.id + '.name');
    const key = v ? v.id : f.id;
    const prep = (v && v.prep) || {};
    const on = !!app.save.notify[key];
    const trail = [{ label: t('nav.allTraditions'), hash: '#view=home' }];
    if (v) trail.push({ label: t('family.' + f.id + '.name'), hash: '#view=family&f=' + f.id }, { label: title });
    else trail.push({ label: title });
    return `
      ${crumbs(trail)}
      <section class="intro">
        <div class="title-row"><h1>${esc(title)}</h1>${badge(status)}</div>
        <p class="lead">${esc(t('prep.lead'))}</p>
      </section>
      <section class="panel">
        <h2>${esc(t('prep.missing'))}</h2>
        <ul class="checklist" role="list">
          ${T.PREP_ITEMS.map(item => {
            const ok = !!prep[item];
            return `<li><span class="mark-ok ${ok ? 'ok' : 'no'}" aria-hidden="true">${ok ? '✓' : '○'}</span><span>${esc(t('prep.' + item))}<span class="sr-only">${esc(t(ok ? 'prep.done' : 'prep.todo'))}</span></span></li>`;
          }).join('')}
        </ul>
        ${f.knowledgeOnly ? `<p class="warn">${esc(t('prep.knowledgeOnly'))}</p>` : ''}
        ${f.rtl ? `<p class="note">${esc(t('prep.rtl'))}</p>` : ''}
      </section>
      <div class="actions">
        <button type="button" class="secondary" data-act="notify" data-key="${esc(key)}" aria-pressed="${on}">${esc(t(on ? 'prep.notifyOn' : 'prep.notify'))}</button>
        <a class="secondary" href="${v ? '#view=family&f=' + f.id : '#view=home'}">${esc(t('action.back'))}</a>
      </div>`;
  }

  function optionLabel(group, o) {
    if (group === 'ui') {
      const info = (T.LOCALES || []).find(l => l.id === o.id);
      return info ? info.endonym : o.id;
    }
    if (group === 'voice') return t('voice.' + o.id);
    return t('opt.' + group + '.' + o.id);
  }

  function optionTags(group, o) {
    const tags = [];
    if (group === 'voice') {
      const kind = (T.VOICES[o.id] || {}).kind;
      if (kind) tags.push(`<span class="tag k-${kind}">${esc(t('kind.' + kind))}</span>`);
    }
    if (o.state === 'draft') tags.push(`<span class="tag">${esc(t('tag.draft'))}</span>`);
    return tags.join('');
  }

  function fieldset(versionId, group) {
    const pack = packOf(versionId);
    const prefs = prefsFor(versionId);
    return `<fieldset class="panel">
      <legend>${esc(t('settings.' + group))}</legend>
      <p class="note">${esc(t('settings.' + group + '.hint'))}</p>
      <div class="opts">
        ${pack.options[group].map(o => {
          const off = o.state === 'off';
          const id = 'opt-' + group + '-' + o.id.replace(/[^a-z0-9]/gi, '-');
          const why = o.why ? t(o.why) : (group === 'voice' ? t('voice.' + o.id + '.note') : '');
          const dirAttr = group === 'ui' ? ` lang="${esc(o.id)}"` : '';
          return `<label class="opt${off ? ' off' : ''}" for="${id}">
            <input type="radio" id="${id}" name="${group}" value="${esc(o.id)}" ${prefs[group] === o.id ? 'checked' : ''} ${off ? 'disabled' : ''} data-version="${esc(versionId)}">
            <span class="label"><span><span${dirAttr}>${esc(optionLabel(group, o))}</span>${optionTags(group, o)}</span>${why ? `<span class="why" id="${id}-why">${esc(why)}</span>` : ''}</span>
          </label>`;
        }).join('')}
      </div>
    </fieldset>`;
  }

  function lunarText(l) {
    const months = t('cal.months').split(',');
    const days = t('cal.days').split(',');
    return t('cal.lunarDate', { month: (l.leap ? t('cal.leap') : '') + (months[l.month - 1] || l.month), day: days[l.day - 1] || l.day });
  }

  function calendarPanel(pack) {
    const cal = pack.calendar;
    if (!cal || !T.Calendar) return '';
    const now = new Date();
    const name = o => t(o.id) + (o.approx ? t('cal.approx') : '');
    const today = T.Calendar.observancesOn(cal, now);
    const l = cal.showLunar ? T.Calendar.lunar(now, cal.tz) : null;
    let dateFmt = null;
    try { dateFmt = new Intl.DateTimeFormat(app.i18n.lang, { month: 'short', day: 'numeric', timeZone: cal.tz }); } catch (e) { dateFmt = null; }
    const next = T.Calendar.upcoming(cal, now, 200, 8).filter(o => o.inDays > 0).slice(0, 4);
    const when = o => (o.inDays === 1 ? t('cal.tomorrow') : t('cal.inDays', { n: o.inDays }));
    return `<section class="panel cal">
      <h2>${esc(t('cal.title'))}</h2>
      ${l ? `<p>${esc(t('cal.today', { date: lunarText(l) }))}</p>` : ''}
      ${today.map(o => `<p class="today">${esc(t('cal.todayIs', { name: name(o) }))}</p>`).join('')}
      ${next.length ? `<h3>${esc(t('cal.upcoming'))}</h3><ul class="checklist" role="list">${next.map(o => {
        const d = dateFmt ? dateFmt.format(new Date(o.date + 'T12:00:00Z')) : o.date;
        return `<li><span class="mark-ok" aria-hidden="true">·</span><span>${esc(name(o))} <span class="note">${esc(d)} · ${esc(when(o))}</span></span></li>`;
      }).join('')}</ul>` : ''}
      ${cal.note ? `<p class="note">${esc(t(cal.note))}</p>` : ''}
    </section>`;
  }

  function viewPack() {
    const id = app.state.version;
    const hit = T.findVersion(id);
    const pack = packOf(id);
    const prefs = prefsFor(id);
    const voice = T.VOICES[prefs.voice] || {};
    const href = pack.entry + T.Save.formatLink(id, prefs);
    const ackNeeded = T.needsAck(id);
    const acked = !!app.save.acks[id];
    const params = { voice: t('voice.' + prefs.voice), kind: t('kind.' + voice.kind) };
    const notice = pack.notice || [];
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('family.' + hit.family.id + '.name'), hash: '#view=family&f=' + hit.family.id }, { label: t('version.' + id + '.name') }])}
      <section class="intro">
        <h1>${esc(t('settings.title', { place: t('version.' + id + '.place') }))}</h1>
        <p class="lead">${esc(t('settings.lead'))}</p>
      </section>
      <div class="two">
        ${T.Save.FIELDS.map(g => fieldset(id, g)).join('')}
      </div>
      <section class="panel">
        <h2>${esc(t('notice.title'))}</h2>
        <ul class="checklist" role="list">
          ${notice.map(k => `<li><span class="mark-ok" aria-hidden="true">·</span><span>${esc(t(k, params))}</span></li>`).join('')}
        </ul>
      </section>
      ${calendarPanel(pack)}
      ${ackNeeded ? `<section class="panel warn-panel" aria-labelledby="preview-title">
        <h2 id="preview-title">${esc(t('preview.title'))}</h2>
        <p>${esc(t('preview.body'))}</p>
        <label class="ack" for="ack-${esc(id.replace(/\./g, '-'))}"><input type="checkbox" id="ack-${esc(id.replace(/\./g, '-'))}" name="ack" data-version="${esc(id)}" ${acked ? 'checked' : ''}> <span>${esc(t('preview.ack'))}</span></label>
      </section>` : ''}
      <div class="actions">
        ${ackNeeded && !acked
          ? `<button type="button" class="primary" data-act="need-ack" aria-describedby="preview-title">${esc(t('action.enter', { place: t('version.' + id + '.place') }))}</button>`
          : `<a class="primary" href="${esc(href)}" data-act="enter" data-version="${esc(id)}">${esc(t('action.enter', { place: t('version.' + id + '.place') }))}</a>`}
        <a class="secondary" href="#view=sources&v=${esc(id)}">${esc(t('action.sources'))}</a>
      </div>`;
  }

  function viewSources() {
    const id = app.state.version;
    const records = (T.CONTENT && T.CONTENT[id]) || [];
    const pack = packOf(id);
    const row = (k, v) => `<dt>${esc(t(k))}</dt><dd>${v}</dd>`;
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('version.' + id + '.name'), hash: T.Save.formatLink(id, null, 'pack') }, { label: t('sources.title') }])}
      <section class="intro">
        <h1>${esc(t('sources.title'))}</h1>
        <p class="lead">${esc(t('sources.lead'))}</p>
      </section>
      <h2>${esc(t('sources.texts'))}</h2>
      <div class="two">
        ${records.map(r => `<article class="panel">
          <h3 lang="${esc(r.titleLang || 'zh-Hant')}">${esc(r.title[r.titleLang] || Object.values(r.title)[0])}${r.title.en && r.titleLang !== 'en' ? ` <span class="note" lang="en">${esc(r.title.en)}</span>` : ''}</h3>
          <dl class="src">
            ${row('src.type', esc(t('type.' + r.type)))}
            ${row('src.edition', `<span lang="${esc(r.editionLang || 'zh')}">${esc(r.edition)}</span>`)}
            ${row('src.source', `<span lang="${esc(r.editionLang || 'zh')}">${esc(r.source.name)}</span> (${esc(r.source.id)})`)}
            ${row('src.license', esc(t('license.' + r.license)))}
            ${row('src.review', esc(t('review.' + r.reviewStatus)))}
            ${row('src.length', esc(Array.isArray(Object.values(r.text)[0]) ? t('src.lines', { n: Object.values(r.text)[0].length }) : t('src.chars', { n: [...Object.values(r.text)[0]].length })))}
          </dl>
        </article>`).join('')}
      </div>
      <h2>${esc(t('sources.voices'))}</h2>
      <div class="two">
        ${pack.options.voice.map(o => {
          const v = T.VOICES[o.id] || {};
          const problems = T.Rights.voiceProblems(o.id, v);
          return `<article class="panel">
            <h3>${esc(t('voice.' + o.id))} <span class="tag k-${esc(v.kind)}">${esc(t('kind.' + v.kind))}</span></h3>
            <dl class="src">
              ${v.kind === 'system' ? row('src.note', esc(t('voice.systemNote'))) : ''}
              ${v.license ? row('src.license', esc(v.license)) : ''}
              ${v.performer ? row('src.performer', esc(v.performer)) : ''}
              ${v.sourceUrl ? row('src.link', `<a href="${esc(v.sourceUrl)}" target="_blank" rel="noopener">${esc(t('src.open'))}</a>`) : ''}
              ${v.sha1 ? row('src.hash', `<code>${esc(v.sha1)}</code>`) : ''}
              ${row('src.proofread', esc(v.proofreadBy || t('src.none')))}
              ${problems.length ? row('src.missing', esc(problems.map(p => t('rights.' + p)).join(t('list.sep')))) : ''}
            </dl>
          </article>`;
        }).join('')}
      </div>`;
  }

  function viewSettings() {
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('nav.settings') }])}
      <section class="intro"><h1>${esc(t('nav.settings'))}</h1></section>
      <section class="panel">
        <h2>${esc(t('platform.language'))}</h2>
        <p class="note">${esc(t('platform.languageHint'))}</p>
        <div class="opts">
          ${T.UI_LOCALES.map(id => {
            const info = T.LOCALES.find(l => l.id === id);
            return `<label class="opt" for="ui-${id}"><input type="radio" name="platform-ui" id="ui-${id}" value="${id}" ${app.i18n.locale === id ? 'checked' : ''}>
              <span class="label"><span lang="${id.indexOf('qps') === 0 ? 'en' : id}">${esc(info.endonym)}</span>${info.status !== 'ok' ? `<span class="why">${esc(t('locale.status.' + info.status))}</span>` : ''}</span></label>`;
          }).join('')}
        </div>
      </section>
      <section class="panel">
        <h2>${esc(t('settings.display'))}</h2>
        <p class="note">${esc(t('display.hint'))}</p>
        <fieldset class="inline"><legend>${esc(t('display.size'))}</legend><div class="opts row">
          ${['m', 'l', 'xl'].map(k => `<label class="opt" for="size-${k}"><input type="radio" name="display-size" id="size-${k}" value="${k}" ${(app.save.display.size || 'm') === k ? 'checked' : ''}><span class="label">${esc(t('display.size.' + k))}</span></label>`).join('')}
        </div></fieldset>
        <fieldset class="inline"><legend>${esc(t('display.motion'))}</legend><div class="opts row">
          ${['system', 'reduce', 'full'].map(k => `<label class="opt" for="motion-${k}"><input type="radio" name="display-motion" id="motion-${k}" value="${k}" ${(app.save.display.motion || 'system') === k ? 'checked' : ''}><span class="label">${esc(t('display.motion.' + k))}</span></label>`).join('')}
        </div></fieldset>
      </section>
      <section class="panel">
        <h2>${esc(t('privacy.title'))}</h2>
        <p class="note">${esc(t('privacy.body'))}</p>
      </section>
      <section class="panel">
        <h2>${esc(t('code.title'))}</h2>
        <p class="note">${esc(t('code.hint'))}</p>
        <label class="field-label" for="code-out">${esc(t('code.export'))}</label>
        <textarea id="code-out" readonly rows="3"></textarea>
        <div class="actions"><button type="button" class="secondary" data-act="export">${esc(t('code.make'))}</button><button type="button" class="secondary" data-act="copy">${esc(t('code.copy'))}</button></div>
        <label class="field-label" for="code-in">${esc(t('code.import'))}</label>
        <textarea id="code-in" rows="3"></textarea>
        <div class="actions"><button type="button" class="secondary" data-act="read">${esc(t('code.read'))}</button><button type="button" class="primary" data-act="apply" hidden>${esc(t('code.apply'))}</button></div>
        <p class="note" id="code-msg" role="status"></p>
      </section>`;
  }

  function viewBrand() {
    const dirs = [
      { id: 'logo-a', key: 'a', rec: true },
      { id: 'logo-b', key: 'b' },
      { id: 'logo-c', key: 'c' },
    ];
    const tile = (id, size, cls) => `<figure><div class="tile ${cls}">${logo(id, size)}</div><figcaption>${size}px</figcaption></figure>`;
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('nav.brand') }])}
      <section class="intro"><h1>${esc(t('brand.boardTitle'))}</h1><p class="lead">${esc(t('brand.boardLead'))}</p></section>
      ${dirs.map(d => `<section class="panel${d.rec ? ' rec' : ''}">
        <div class="title-row"><h2>${esc(t('brand.dir.' + d.key))}</h2>${d.rec ? `<span class="tag rec">${esc(t('brand.recommended'))}</span>` : ''}</div>
        <p class="note">${esc(t('brand.dir.' + d.key + '.why'))}</p>
        <div class="logo-row">${tile(d.id, 128, 'light')}${tile(d.id, 48, 'light')}${tile(d.id, 24, 'light')}${tile(d.id, 16, 'light')}${tile(d.id, 48, 'dark')}${tile(d.id, 24, 'dark')}</div>
      </section>`).join('')}
      <section class="panel">
        <h2>${esc(t('brand.icons'))}</h2>
        <p class="note">${esc(t('brand.iconsNote'))}</p>
        <div class="logo-row icons">
          ${['ios', 'circle', 'squircle', 'mono', 'print'].map(k => `<figure><div class="app-icon ${k}">${logo('logo-a', 46)}</div><figcaption>${esc(t('brand.icon.' + k))}</figcaption></figure>`).join('')}
        </div>
      </section>
      <section class="panel">
        <h2>${esc(t('brand.lockups'))}</h2>
        <p class="note">${esc(t('brand.lockupsNote'))}</p>
        <div class="lockups">
          ${(T.SCRIPT_SAMPLES || []).filter(s => s.lockup).map(s => `<div class="lockup" dir="${s.dir}" lang="${s.lang}">${logo('logo-a', 30)}<span>${esc(s.lockup)}<small dir="${app.i18n.dir}" lang="${app.i18n.lang}">${esc(t('script.' + s.script))}</small></span></div>`).join('')}
        </div>
      </section>`;
  }

  function viewScripts() {
    return `
      ${crumbs([{ label: t('nav.allTraditions'), hash: '#view=home' }, { label: t('nav.scripts') }])}
      <section class="intro"><h1>${esc(t('scripts.title'))}</h1><p class="lead">${esc(t('scripts.lead'))}</p></section>
      ${(T.SCRIPT_SAMPLES || []).map(s => `<section class="test-box" dir="${s.dir}" lang="${s.lang}">
        <div class="lockup bare">${logo('logo-a', 26)}<strong>${esc(s.welcome)}</strong><small dir="${app.i18n.dir}" lang="${app.i18n.lang}">${esc(t('script.' + s.script))} · ${esc(s.dir.toUpperCase())}</small></div>
        <p>${esc(s.body)}</p>
        <div class="faux"><span>${esc(s.button)} <span class="arrow" aria-hidden="true">→</span></span></div>
      </section>`).join('')}
      <p class="note">${esc(t('scripts.note'))}</p>`;
  }

  const VIEWS = { home: viewHome, family: viewFamily, prep: viewPrep, pack: viewPack, sources: viewSources, settings: viewSettings, brand: viewBrand, scripts: viewScripts };

  function renderChrome() {
    const set = (id, html) => { const el = doc.getElementById(id); if (el) el.innerHTML = html; };
    set('brand-name', esc(t('brand.name')));
    set('brand-sub', esc(t('brand.sub')));
    set('nav', `
      <a href="#view=home"${app.state.view === 'home' ? ' aria-current="page"' : ''}>${esc(t('nav.home'))}</a>
      <a href="#view=settings"${app.state.view === 'settings' ? ' aria-current="page"' : ''}>${esc(t('nav.settings'))}</a>`);
    set('footer', `<p>${esc(t('footer.note'))}</p><p><a href="#view=brand">${esc(t('nav.brand'))}</a> · <a href="#view=scripts">${esc(t('nav.scripts'))}</a></p>`);
    const brand = doc.getElementById('brand-link');
    if (brand) brand.setAttribute('aria-label', t('brand.homeLabel'));
    const main = doc.getElementById('main');
    if (main) main.setAttribute('aria-label', t('a11y.main'));
  }

  function render(focus) {
    const view = VIEWS[app.state.view] || viewHome;
    renderChrome();
    const main = doc.getElementById('main');
    main.innerHTML = view();
    if (focus !== false) {
      const h = main.querySelector('h1');
      if (h) {
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
      root.scrollTo(0, 0);
    }
  }

  /* ---------- 事件 ---------- */
  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.getAttribute('data-act');
    if (act === 'notify') {
      const key = el.getAttribute('data-key');
      app.save.notify[key] = !app.save.notify[key];
      persist();
      render(false);
      toast(t(app.save.notify[key] ? 'toast.notifyOn' : 'toast.notifyOff'));
    } else if (act === 'enter') {
      app.save.lastVersion = el.getAttribute('data-version');
      persist();
    } else if (act === 'need-ack') {
      const box = doc.querySelector('input[name="ack"]');
      if (box) box.focus();
      toast(t('preview.needAck'));
    } else if (act === 'export') {
      doc.getElementById('code-out').value = T.Save.exportCode(app.save, readPackSaves());
    } else if (act === 'copy') {
      const area = doc.getElementById('code-out');
      if (!area.value) area.value = T.Save.exportCode(app.save, readPackSaves());
      area.select();
      const msg = doc.getElementById('code-msg');
      const fail = () => { msg.textContent = t('code.copyFailed'); };
      try {
        root.navigator.clipboard.writeText(area.value).then(() => { msg.textContent = t('code.copied'); }, fail);
      } catch (err) {
        fail();
      }
    } else if (act === 'read') {
      const r = T.Save.parseCode(doc.getElementById('code-in').value, Date.now(), packSaveKeys());
      const msg = doc.getElementById('code-msg');
      const apply = doc.querySelector('[data-act="apply"]');
      if (r.error) {
        app.importPending = null;
        apply.hidden = true;
        msg.textContent = t('code.error.' + r.error);
      } else {
        app.importPending = r;
        apply.hidden = false;
        const g = Object.keys(r.packs || {}).length;
        msg.textContent = g ? t('code.summaryPacks', { n: Object.keys(r.data.prefs).length, g }) : t('code.summary', { n: Object.keys(r.data.prefs).length });
      }
    } else if (act === 'apply' && app.importPending) {
      const pending = app.importPending;
      app.save = pending.data;
      app.importPending = null;
      persist();
      const s = store();
      Object.keys(pending.packs || {}).forEach(k => {
        try {
          const prev = s.getItem(k);
          if (prev) s.setItem(k + '.bak', prev);
          s.setItem(k, pending.packs[k]);
        } catch (e) { toast(t('toast.saveFailed')); }
      });
      applyDisplay();
      setLocale(app.save.uiLocale || app.i18n.locale);
      render();
      toast(t('toast.imported'));
    }
  }

  function onChange(e) {
    const input = e.target;
    if (input.name === 'display-size' || input.name === 'display-motion') {
      app.save.display[input.name === 'display-size' ? 'size' : 'motion'] = input.value;
      persist();
      applyDisplay();
      return;
    }
    if (input.name === 'ack') {
      const v = input.getAttribute('data-version');
      if (input.checked) app.save.acks[v] = true;
      else delete app.save.acks[v];
      persist();
      render(false);
      const box = doc.querySelector('input[name="ack"]');
      if (box) box.focus();
      return;
    }
    if (input.name === 'platform-ui') {
      app.save.uiLocale = input.value;
      persist();
      setLocale(input.value);
      render(false);
      toast(t('toast.language', { name: (T.LOCALES.find(l => l.id === input.value) || {}).endonym }));
      return;
    }
    const version = input.getAttribute('data-version');
    if (version && T.Save.FIELDS.indexOf(input.name) >= 0) {
      const p = Object.assign({}, prefsFor(version));
      p[input.name] = input.value;
      app.save.prefs[version] = T.Save.normalizePrefs(version, p);
      persist();
      render(false);
      const sel = doc.getElementById(input.id);
      if (sel) sel.focus();
    }
  }

  app.init = function () {
    const s = store();
    const loaded = s ? T.Save.load(s, Date.now()) : { data: T.Save.fresh(Date.now()), note: '' };
    app.save = loaded.data;
    app.note = loaded.note;
    setLocale(app.save.uiLocale || 'zh-CN');
    applyDisplay();
    if (loaded.note === 'migrated') persist();
    routeFromHash();
    render(false);
    if (loaded.note) toast(t('toast.load.' + loaded.note));
    root.addEventListener('hashchange', () => { routeFromHash(); render(); });
    doc.addEventListener('click', onClick);
    doc.addEventListener('change', onChange);
  };

  app.route = routeFromHash;
  app.readPackSaves = readPackSaves;
  app.packSaveKeys = packSaveKeys;
  app.render = render;
})(typeof window !== 'undefined' ? window : globalThis);
