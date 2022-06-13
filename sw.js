const cacheName = "evilCirc-store";

self.addEventListener('fetch', e => {
 e.respondWith(caches.open(cacheName).then((cache) => {
   // Go to the network first
   return fetch(e.request.url).then((fetchedResponse) => {
     cache.put(e.request, fetchedResponse.clone())
     return fetchedResponse;
   }).catch(() => {
     // If the network is unavailable, get
     return cache.match(e.request.url);
   });
 }));
});
 