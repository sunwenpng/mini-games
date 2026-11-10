/*
 * 离线缓存：网络优先，断网时用缓存。只缓存本站（同源）的 GET 请求。
 * 网络优先意味着在线时永远拿到最新版本，不会因为缓存卡在旧版本。
 */
const CACHE = 'threshold-v6';
const CORE = [
  './', './index.html', './legal.html', './styles.css', './manifest.webmanifest',
  './brand/logo-a.svg', './brand/icon-192.png', './brand/icon-512.png',
  './locales/zh-CN.js', './locales/zh-TW.js', './locales/en.js',
  './data/registry.js', './data/script-samples.js',
  './core/i18n.js', './core/save.js', './core/rights.js', './core/calendar.js', './core/app.js',
  './traditions/buddhism.han/pack.js', './traditions/buddhism.han/content.js',
  './traditions/buddhism.han/game/index.html', './traditions/buddhism.han/game/game.js',
  './traditions/buddhism.han/game/ad-kit.js', './traditions/buddhism.han/game/i18n-en.js', './traditions/buddhism.han/game/i18n-zh-TW.js',
  './traditions/buddhism.theravada.th/pack.js', './traditions/buddhism.theravada.th/content.js',
  './traditions/buddhism.theravada.th/game/index.html', './traditions/buddhism.theravada.th/game/game.js',
  './traditions/buddhism.theravada.th/game/game.css', './traditions/buddhism.theravada.th/game/scene.js',
  './traditions/buddhism.theravada.th/game/i18n.js',
  './traditions/sikhism.gurdwara/pack.js', './traditions/sikhism.gurdwara/content.js', './traditions/sikhism.gurdwara/game.js',
  './play.html', './core/courtyard/courtyard.css', './core/courtyard/i18n.js', './core/courtyard/kit.js', './core/courtyard/engine.js', './core/courtyard/ui.js',
  './traditions/buddhism.tibetan/pack.js', './traditions/buddhism.tibetan/content.js', './traditions/buddhism.tibetan/game.js',
  './traditions/buddhism.japan/pack.js', './traditions/buddhism.japan/content.js', './traditions/buddhism.japan/game.js',
  './traditions/buddhism.india.navayana/pack.js', './traditions/buddhism.india.navayana/content.js', './traditions/buddhism.india.navayana/game.js',
  './traditions/hinduism.ghat/pack.js', './traditions/hinduism.ghat/content.js', './traditions/hinduism.ghat/game.js',
  './traditions/daoism.mountain/pack.js', './traditions/daoism.mountain/content.js', './traditions/daoism.mountain/game.js',
  './traditions/shinto.shrine/pack.js', './traditions/shinto.shrine/content.js', './traditions/shinto.shrine/game.js',
  './traditions/christianity.catholic/pack.js', './traditions/christianity.catholic/content.js', './traditions/christianity.catholic/game.js',
  './traditions/christianity.orthodox/pack.js', './traditions/christianity.orthodox/content.js', './traditions/christianity.orthodox/game.js',
  './traditions/christianity.protestant/pack.js', './traditions/christianity.protestant/content.js', './traditions/christianity.protestant/game.js',
  './traditions/islam.mosque/pack.js', './traditions/islam.mosque/content.js', './traditions/islam.mosque/game.js',
  './traditions/judaism.shabbat/pack.js', './traditions/judaism.shabbat/content.js', './traditions/judaism.shabbat/game.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('threshold-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html')))
  );
});
