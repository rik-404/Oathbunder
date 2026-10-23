// sw.js — service worker de atualização do jogo
// Regra de ouro: TODA VEZ que você publicar uma mudança, suba o número em VERSAO.
// - Abas já abertas recebem aviso "Nova versão disponível" (banner no canto).
// - index.html sempre sai da rede (network-first) → quem recarrega pega o novo.
// - Assets (js/css/png/mp3) ficam em cache-first; como a URL muda com ?v=, o cache se invalida sozinho.
const VERSAO='cvsw-v11';
const self_=self;

self_.addEventListener('install',e=>{
  // assume o controle assim que a nova versão é baixada (sem esperar fechar a aba)
  e.waitUntil(self_.skipWaiting());
});

self_.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const ks=await caches.keys();
    await Promise.all(ks.filter(k=>k!==VERSAO).map(k=>caches.delete(k))); // limpa caches antigas
    await self_.clients.claim();                                          // assume as abas abertas
  })());
});

self_.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    // index.html / navegação: rede primeiro (sempre o mais novo), cache só quando offline
    e.respondWith(fetch(r).then(res=>{
      const cp=res.clone();
      caches.open(VERSAO).then(async c=>{await c.put(r,cp);try{await c.put(new URL('index.html',r.url).href,cp)}catch(_){}}).catch(()=>{});
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match(new URL('index.html',self_.location.origin)))));
    return;
  }
  // assets locais versionados por URL: cache primeiro, grava na rede de fundo
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
    if(res.ok&&r.url.startsWith(self_.location.origin)){
      const cp=res.clone();caches.open(VERSAO).then(c=>c.put(r,cp)).catch(()=>{});
    }
    return res;
  })));
});
