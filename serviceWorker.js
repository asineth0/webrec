self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("webrec").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/index.css",
        "/tailwind.min.css",
        "assets/inter-v2-latin.css",
        "assets/inter-v2-latin-100.woff",
        "assets/inter-v2-latin-100.woff2",
        "assets/inter-v2-latin-200.woff",
        "assets/inter-v2-latin-200.woff2",
        "assets/inter-v2-latin-300.woff",
        "assets/inter-v2-latin-300.woff2",
        "assets/inter-v2-latin-500.woff",
        "assets/inter-v2-latin-500.woff2",
        "assets/inter-v2-latin-600.woff",
        "assets/inter-v2-latin-600.woff2",
        "assets/inter-v2-latin-700.woff",
        "assets/inter-v2-latin-700.woff2",
        "assets/inter-v2-latin-800.woff",
        "assets/inter-v2-latin-800.woff2",
        "assets/inter-v2-latin-900.woff",
        "assets/inter-v2-latin-900.woff2",
        "assets/inter-v2-latin-regular.woff",
        "assets/inter-v2-latin-regular.woff2",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }

      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== "basic") {
          return res;
        }

        var resToCache = res.clone();

        caches.open("webrec").then((cache) => {
          cache.put(event.request, resToCache);
        });

        return res;
      });
    })
  );
});
