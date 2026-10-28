var CACHE = "livrago-v1";
var FICHIERS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copie = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copie); });
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
