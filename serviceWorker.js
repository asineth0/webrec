self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("webrec").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/index.js",
        "/tailwind.min.css",
        "/assets/inter-v2-latin.css",
        "/assets/inter-v2-latin-100.woff",
        "/assets/inter-v2-latin-100.woff2",
        "/assets/inter-v2-latin-200.woff",
        "/assets/inter-v2-latin-200.woff2",
        "/assets/inter-v2-latin-300.woff",
        "/assets/inter-v2-latin-300.woff2",
        "/assets/inter-v2-latin-500.woff",
        "/assets/inter-v2-latin-500.woff2",
        "/assets/inter-v2-latin-600.woff",
        "/assets/inter-v2-latin-600.woff2",
        "/assets/inter-v2-latin-700.woff",
        "/assets/inter-v2-latin-700.woff2",
        "/assets/inter-v2-latin-800.woff",
        "/assets/inter-v2-latin-800.woff2",
        "/assets/inter-v2-latin-900.woff",
        "/assets/inter-v2-latin-900.woff2",
        "/assets/inter-v2-latin-regular.woff",
        "/assets/inter-v2-latin-regular.woff2",
        "/manifest.webmanifest",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open("webrec").then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
