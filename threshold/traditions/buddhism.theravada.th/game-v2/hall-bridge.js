/*
 * 菩提静院 v2：在不改游戏逻辑的前提下加“进殿”（พระอุโบสถ）。
 * - 场景右下角加“进殿”按钮；点了打开 HallView 全屏殿内视图（实拍佛像，可换一尊）。
 * - 殿内的“拜佛、供花、诵经”按钮直接触发原来的底栏按钮，原面板叠在殿内画面上。
 * - 面板里点“拜”时殿内画面暗下再亮起；供花时花瓣落下、供灯时点亮灯火、供香时香烟升起。
 * - 面板与遮罩加进出动画（只加 class，不改原来的 hidden 逻辑）。
 */
(function () {
  'use strict';
  const doc = document;
  const lang = () => (doc.documentElement.getAttribute('lang') || 'th');
  const LABEL = { th: 'เข้าโบสถ์', 'zh-CN': '进殿', 'zh-TW': '進殿', en: 'Enter the hall' };
  function bar(k) { return doc.querySelector('.bar [data-open="' + k + '"]'); }
  function label(k) { const b = bar(k); return b ? (b.querySelector('.lbl') || {}).textContent || k : k; }
  function icon(k) { const b = bar(k); return b ? (b.querySelector('.ico') || {}).textContent || '' : ''; }
  function enter() {
    const def = window.HallView && HallView.get('buddhism.theravada.th');
    if (!def || HallView.isOpen()) return;
    chip.hidden = true;
    HallView.open(def, {
      lang: lang(), mount: doc.querySelector('.app'),
      actions: ['krap', 'offer', 'chant'].map(k => ({ id: k, icon: icon(k), label: label(k), run: () => { const b = bar(k); if (b) b.click(); } })),
      onClose: () => { chip.hidden = false; },
      /* 手机返回键：殿内叠着功课面板时先收面板 */
      onBack: () => { const sh = doc.getElementById('sheet'), v = doc.getElementById('veil'); if (sh && !sh.hidden && v) { v.click(); return true; } return false; },
    });
  }
  const stage = doc.querySelector('.stage');
  const chip = doc.createElement('button');
  chip.type = 'button'; chip.className = 'enter-chip';
  chip.innerHTML = '<span aria-hidden="true">🛕</span> ' + (LABEL[lang()] || LABEL.th);
  chip.addEventListener('click', enter);
  if (stage) stage.appendChild(chip);
  new MutationObserver(() => { chip.lastChild.textContent = ' ' + (LABEL[lang()] || LABEL.th); }).observe(doc.documentElement, { attributes: true, attributeFilter: ['lang'] });
  /* 殿内效果 */
  doc.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-act]');
    if (!b || !window.HallView || !HallView.isOpen()) return;
    const act = b.getAttribute('data-act');
    if (act === 'krap') HallView.bow();
    else if (act === 'offer') HallView.fx(HallView.effectFor(b.getAttribute('data-kind') + ' ' + (b.getAttribute('data-sub') || '')));
  }, true);
  /* 面板动画 */
  ['sheet', 'veil'].forEach(id => {
    const el = doc.getElementById(id);
    if (!el) return;
    new MutationObserver(() => { if (!el.hidden) requestAnimationFrame(() => el.classList.add('in')); else el.classList.remove('in'); }).observe(el, { attributes: true, attributeFilter: ['hidden'] });
  });
})();
