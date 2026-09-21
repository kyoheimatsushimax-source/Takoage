// たこあげ ちゅうごくご Service Worker
// 内容を更新したら CACHE の版数を上げてください（例: v0.1 → v0.2）
const CACHE = "takoage-v1.2";
const ASSETS = ["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// ネット優先・失敗したらキャッシュ（更新がすぐ反映され、オフラインでも動く）
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
