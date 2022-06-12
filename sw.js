self.addEventListener('install', e => {

    e.waitUntil(
        caches.open('evilCirc-store').then(cache => { 
        return cache.addAll(["/", 'index.html', 'main.js', 'style.css']);
      })
    );
 });

   self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(response => response || fetch(e.request))
    );
  });