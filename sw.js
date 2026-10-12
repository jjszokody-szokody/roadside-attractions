// Roadside Gems service worker
const VER='rg-v1',SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon-180.png',
 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css','https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css','https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'];
const API=/overpass|wikidata\.org|wikipedia\.org|nominatim\.openstreetmap\.org/;
self.addEventListener('install',e=>e.waitUntil(caches.open(VER).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{mode:u.startsWith('http')?'cors':'same-origin'})).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return; // Overpass POSTs go straight to network
 if(API.test(u.hostname)){ // network-first; only successful responses are cached
  e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(VER+'-api').then(x=>x.put(r,c))}return res}).catch(()=>caches.open(VER+'-api').then(x=>x.match(r)).then(m=>m||Response.error())));return}
 if(/tile\.openstreetmap\.org/.test(u.hostname))return; // respect OSM tile policy: no bulk caching
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&(u.origin===location.origin||/unpkg\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname))){const c=res.clone();caches.open(VER).then(x=>x.put(r,c))}return res})))});
