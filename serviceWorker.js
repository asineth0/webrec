self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open("webrec").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/index.css",
        "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.4.0/ionicons.min.js",
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
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
