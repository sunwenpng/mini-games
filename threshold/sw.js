/*
 * 离线缓存：网络优先，断网时用缓存。只缓存本站（同源）的 GET 请求。
 * 网络优先意味着在线时永远拿到最新版本，不会因为缓存卡在旧版本。
 */
const CACHE = 'threshold-v4';
const CORE = [
  './', './index.html', './styles.css', './manifest.webmanifest',
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
  './traditions/sikhism.gurdwara/pack.js',
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
