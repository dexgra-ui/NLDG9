const CACHE='nldg-v1-1-7';
const CORE=[
  './',
  'index.html',
  'styles.css',
  'newsletter.css',
  'newsletter.html',
  'newsletter/who-god-says-you-are.html',
  'newsletter.js',
  'platform.css?v=5.3.1',
  'script.js',
  'site-intro.js?v=1.0.0',
  'site-navigation.js?v=1.9.7',
  'no-labels-approved-logo.png',
  'manifest.webmanifest'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  const url=new URL(event.request.url);
  const fileName=url.pathname.split('/').pop()||'';
  const isGenealogyAsset=url.origin===self.location.origin&&fileName.startsWith('biblical-people-genealogy');
  const networkRequest=isGenealogyAsset
    ? new Request(event.request,{cache:'reload'})
    : event.request;

  event.respondWith(
    fetch(networkRequest)
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));
        }
        return response;
      })
      .catch(async()=>{
        const cached=await caches.match(event.request);
        if(cached)return cached;
        if(event.request.mode==='navigate'){
          return (await caches.match('index.html'))||(await caches.match('./'));
        }
        return new Response('Offline',{status:503,statusText:'Offline'});
      })
  );
});
