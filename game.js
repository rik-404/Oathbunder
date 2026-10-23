(()=>{
if(typeof THREE==='undefined'){document.body.insertAdjacentHTML('beforeend','<p style="position:fixed;inset:auto 16px 40% 16px;text-align:center;z-index:99">Não foi possível carregar o motor 3D. Recarregue a página.</p>');return}

/* ================= utilidades ================= */
const TAU=Math.PI*2;
const rand=(a,b)=>a+Math.random()*(b-a), randi=(a,b)=>Math.floor(a+Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const angDiff=(a,b)=>((b-a+Math.PI*3)%TAU)-Math.PI;
const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// Migração única do balanceamento: remove apenas as melhorias permanentes antigas.
// Moedas, classes, conquistas e recordes continuam intactos.
const BALANCE_RESET='balance-reset-2026-10';
if(!store.get(BALANCE_RESET,false)){store.set('cv_shop',{});store.set(BALANCE_RESET,true)}
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch=matchMedia('(pointer: coarse)').matches;
const shade=(c,l)=>new THREE.Color(c).offsetHSL(0,0,l).getHex();
const fmtT=s=>{s=Math.floor(s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const fmtN=n=>String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.'); // separador de milhar (1.240)

/* ================= som (SFX sintetizados) e hit-stop ================= */
let actx=null,amaster=null,sfxGain=null,musicGain=null;
let muted=store.get('cv_muted',false);
let musicVol=store.get('cv_musicVol',.5);
let sfxVol=store.get('cv_sfxVol',.7);
const sfxLast={};const SFX_GAP={hit:60,gem:70,shot:55,melee:80,bone:120,coin:60,level:350,click:40,hurt:150,kill:70};
function audioCtx(){if(!actx){try{actx=new(window.AudioContext||window.webkitAudioContext)();
  sfxGain=actx.createGain();sfxGain.gain.value=sfxVol;sfxGain.connect(actx.destination);
  musicGain=actx.createGain();musicGain.gain.value=musicVol;musicGain.connect(actx.destination);
  amaster=actx.createGain();amaster.gain.value=1;amaster.connect(actx.destination)}catch(e){actx=null}}
  if(actx&&actx.state==='suspended')actx.resume();return actx}
function setSfxVol(v){sfxVol=clamp(v,0,1);store.set('cv_sfxVol',sfxVol);if(sfxGain)sfxGain.gain.value=sfxVol;updateVolUI()}
function setMusicVol(v){musicVol=clamp(v,0,1);store.set('cv_musicVol',musicVol);if(musicGain)musicGain.gain.value=musicVol;const bgm=$('#bgm');if(bgm)bgm.volume=muted?0:musicVol;if(fieldMusic)fieldMusic.volume=muted?0:musicVol;updateVolUI()}
function setMuted(m){muted=m;store.set('cv_muted',m);updateVolUI();const b=$('#sndbtn');if(b)b.textContent=m?'🔇 Mudo':'🔊 Som';const b2=$('#optMuteAll');if(b2)b2.checked=m;const bgm=$('#bgm');if(bgm)bgm.volume=m?0:musicVol;if(fieldMusic)fieldMusic.volume=m?0:musicVol;if(titleAmb)titleAmb.volume=m?0:musicVol*.4}
function updateVolUI(){
  const mv=Math.round(musicVol*100),sv=Math.round(sfxVol*100);
  const setR=(id,v)=>{const el=$(id);if(el)el.value=v},setT=(id,t)=>{const el=$(id);if(el)el.textContent=t},setC=(id,c)=>{const el=$(id);if(el)el.checked=c};
  setR('#musicVol',mv);setT('#musicVolVal',mv+'%');
  setR('#sfxVol',sv);setT('#sfxVolVal',sv+'%');
  setR('#optMusicVol',mv);setT('#optMusicVolVal',mv+'%');
  setR('#optSfxVol',sv);setT('#optSfxVolVal',sv+'%');
  setC('#muteAll',muted);setC('#optMuteAll',muted);
  const bgm=$('#bgm');if(bgm)bgm.volume=muted?0:musicVol;
}
function tone(f0,f1,d,type,v,delay=0){if(muted||!audioCtx())return;const t=actx.currentTime+delay,o=actx.createOscillator(),g=actx.createGain();
  o.type=type;o.frequency.setValueAtTime(Math.max(1,f0),t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(sfxGain);o.start(t);o.stop(t+d+.02)}
function noiseFx(d,v,freq,q=.9,type='bandpass',delay=0){if(muted||!audioCtx())return;const t=actx.currentTime+delay,len=Math.max(1,Math.floor(actx.sampleRate*d));
  const buf=actx.createBuffer(1,len,actx.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=Math.random()*2-1;
  const src=actx.createBufferSource();src.buffer=buf;const f=actx.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;
  const g=actx.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  src.connect(f);f.connect(g);g.connect(sfxGain);src.start(t);src.stop(t+d)}
// S(n,arg): dispara um efeito sonoro nomeado, com limite de repetição por tipo pra não vir uma metralhadora
function S(n,arg){const gap=SFX_GAP[n],now=performance.now();if(gap&&now-(sfxLast[n]||0)<gap)return;sfxLast[n]=now;
  switch(n){
    case'click':tone(600,900,.06,'square',.1);break;
    case'shot':if(arg==='arrow')tone(300,140,.08,'triangle',.1);
      else if(arg==='bullet'){noiseFx(.05,.18,3000,.7,'highpass');tone(900,300,.05,'square',.08)}
      else if(arg==='hellfire')noiseFx(.12,.16,420,.8);
      else tone(420,180,.09,'sine',.14);break;
    case'bone':tone(220,120,.1,'triangle',.12);break;
    case'melee':noiseFx(.09,.3,900,1);tone(180,90,.08,'square',.14);break;
    case'hit':tone(arg?700:320,arg?180:160,.05,'square',arg?.16:.1);break;
    case'kill':noiseFx(.14,.25,600,.8);tone(200,60,.12,'sawtooth',.12);break;
    case'hurt':tone(300,90,.2,'sawtooth',.22);break;
    case'gem':tone(880,1320,.07,'sine',.07);break;
    case'coin':tone(988,1319,.09,'square',.08);break;
    case'heart':tone(520,780,.12,'sine',.12);break;
    case'magnet':tone(400,900,.15,'sine',.1);break;
    case'chest':tone(520,880,.15,'triangle',.18);tone(660,1100,.15,'triangle',.14,.1);break;
    case'level':tone(523,784,.12,'triangle',.2);tone(659,1046,.14,'triangle',.18,.1);tone(784,1318,.16,'triangle',.16,.2);break;
    case'dash':noiseFx(.12,.14,1200,.7,'highpass');break;
    case'jump':tone(240,420,.08,'sine',.1);break;
    case'ability':tone(300,900,.18,'sawtooth',.14);noiseFx(.15,.12,800,.9);break;
    case'bossin':tone(90,45,.5,'sawtooth',.3);noiseFx(.4,.2,150,.6,'lowpass');break;
    case'bossdie':tone(200,40,.6,'sawtooth',.3);noiseFx(.5,.3,300,.7);break;
  }}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>audioCtx(),{passive:true})); // desbloqueia o áudio no primeiro gesto
let titleAmb=null,ambT=0; // crepitar da fogueira na tela de título
let fieldMusic=null; // mantido por compatibilidade — a música agora usa o elemento #bgm
function updTitleAmb(){if(typeof Audio!=='function')return;const want=state==='title';
  if(want){if(!titleAmb){titleAmb=new Audio('assets/sounds/campfire-sond.mp3?v=1');titleAmb.loop=true;ambT=0}
    titleAmb.volume=muted?0:musicVol*.4;
    if(titleAmb.paused&&--ambT<=0){ambT=10;titleAmb.play().catch(()=>{ambT=25})}}
  else if(titleAmb&&!titleAmb.paused)titleAmb.pause()}
function updFieldMusic(){if(typeof Audio!=='function')return;const bgm=$('#bgm');if(!bgm)return;
  bgm.volume=muted?0:musicVol;
  const want=state==='title'||state==='menu'||state==='play'||state==='pause'||state==='upgrade'||state==='dying'||state==='options';
  if(want){if(bgm.paused)bgm.play().catch(()=>{})}
  else if(!bgm.paused)bgm.pause()}
let hitStopT=0,lastKillStop=0;
function hitStop(t){if(!reduceMotion)hitStopT=Math.max(hitStopT,t)}
function killStop(t){const n=performance.now();if(n-lastKillStop>90){lastKillStop=n;hitStop(t)}}

/* ================= dados ================= */
const CLASSES=window.CLASSES||{};
const ORDER=['mago','arqueiro','guerreiro','tank','necro','chrono','pistol','dracula','demon','future','human','king'];

// armas: dados e lógica em assets/js/weapons/ (carregados antes deste arquivo)
const WEAPONS=window.WEAPONS||{},WEAPON_UPDATERS=window.WEAPON_UPDATERS||{},WEAPON_RESETS=window.WEAPON_RESETS||[];
// melhorias de nível em assets/js/upgrades.js (const STAT_UPS — carregada antes deste arquivo)
// símbolos pra reconhecer cada poder e classe de relance
const ICONS={
  'Orbes Giratórios':'🔮','Raio Celeste':'🌩️','Aura de Brasa':'🔥','Canhão de Estilhaços':'💥',
  'Força':'💪','Mãos Rápidas':'⚡','Botas Leves':'👟','Coração de Pedra':'❤️','Olho Certeiro':'🎯','Sede de Sangue':'🩸','Placas de Ferro':'🧱','Regeneração':'💚','Ímã':'🧲','Sabedoria':'📖','Alcance Maior':'💥','Foco':'⏳','Poção Grande':'🧪',
  'Projétil Extra':'✨','Perfuração':'➡️','Espinhos':'🌵','Horda Óssea':'🦴','Ossos Afiados':'⚰️',
  'Punho Fatal':'💢','Velocidade de Tiro':'🚀','Empurrão':'🫱','Reflexo Relâmpago':'💨','Pulso Congelante':'❄️',
};
// ícones de classe: pixel art 16×16 gerada em assets/images/icons/ (via node _genicons.js) — um rosto por herói
const CLSICON={mago:'assets/images/icons/mago.png?v=3',arqueiro:'assets/images/icons/arqueiro.png?v=3',guerreiro:'assets/images/icons/guerreiro.png?v=3',tank:'assets/images/icons/tank.png?v=3',necro:'assets/images/icons/necro.png?v=3',chrono:'assets/images/icons/chrono.png?v=3',pistol:'assets/images/icons/pistol.png?v=3',dracula:'assets/images/icons/dracula.png?v=4',demon:'assets/images/icons/demon.png?v=4',future:'assets/images/icons/future.png?v=4',human:'assets/images/icons/human.png?v=4',king:'assets/images/icons/king.png?v=4'};
let CLSIMG={};try{for(const k in CLSICON){const im=new Image();im.src=CLSICON[k];CLSIMG[k]=im}}catch(e){} // preload p/ canvas (menu 3D)
const clsImg=k=>`<img class="cimg" src="${CLSICON[k]}" alt="" title="${CLASSES[k]?CLASSES[k].nome:k}">`; // HTML: tamanho segue o font-size do pai (em)
const CLSTIPO={mago:'Mago',arqueiro:'Arqueiro',guerreiro:'Guerreiro',tank:'Guardião',necro:'Necromante',chrono:'Chronomante',pistol:'Pistoleiro',dracula:'Vampiro',demon:'Demônio',future:'Viajante',human:'Humano',king:'Rei'};
// ícones de poder/melhoria/interface: pixel art 16×16 em assets/images/icons/upg/ (via node _genicons.js)
const UPGSLUG={'Orbes Giratórios':'orbes-giratorios','Raio Celeste':'raio-celeste','Aura de Brasa':'aura-brasa','Canhão de Estilhaços':'canhao',};
const upgImg=n=>{const s=UPGSLUG[n];return s?`<img class="cimg" src="assets/images/icons/upg/${s}.png?v=3" alt="">`:''};
// emojis antigos → PNG (shop/ conquistas/ HUD continuam usando o char no fonte)
const EMICON={'❤️':'coracao','💪':'forca','⚡':'maos-rapidas','👟':'botas-leves','🎯':'olho-certeiro','💥':'alcance-maior','⏳':'foco','⌛':'tempo','⏱️':'foco','🧱':'placas-ferro','💚':'regeneracao','🩸':'pacto','✨':'projetil-extra','➡️':'perfuracao','🌵':'espinhos','💢':'punho-fatal','🚀':'vel-tiro','🫱':'empurrao','💨':'reflexo-relampago','❄️':'gelo','📖':'sabedoria','🧲':'ima','🪙':'ouro-real','🔒':'trancado','🔓':'desbloquear','💀':'craneo','☠️':'craneo','⭐':'estrela','🎖️':'estrela','👹':'golem','⚔️':'espadas','🗡️':'ossos-afiados','🦴':'horda-ossea','🧠':'ia'};
const emIc=e=>{const s=EMICON[e];return s?`<img class="cimg" src="assets/images/icons/upg/${s}.png?v=3" alt="">`:''};
const icon=n=>upgImg(n)||ICONS[n]||'';
const WEAPONS_NAMES=new Set(Object.values(WEAPONS).map(w=>w.nome));
const BUILD_LIMITS={weapons:5,upgrades:5};
const weaponSlots=p=>Object.values(p.weap||{}).filter(l=>l>0).length;
const upgradeSlots=p=>Object.keys(p.upgIds||{}).length;
const UNLOCK={guerreiro:150}; // compra com ouro (Mago começa liberado)
// Classes liberadas por missão (não por ouro). prog(): progresso atual rumo a goal.
// há uma corrida em andamento? (soma o progresso atual no total mostrado)
function inRun(){return state==='play'||state==='pause'||state==='upgrade'||state==='dying'}
const MISSION={
  arqueiro:{goal:1,label:'corrida',desc:'Jogue uma corrida até o fim (até morrer)',prog:()=>Math.min(1,metaStat().runs)},
  tank:{goal:2000,label:'de dano',desc:'Receba 2.000 de dano numa única corrida',prog:()=>Math.min(2000,Math.max(metaStat().maxDmg,inRun()?runDmg:0))},
  necro:{goal:2500,label:'esqueletos',desc:'Abata 2.500 esqueletos no total',prog:()=>Math.min(2500,metaStat().skelKills+(inRun()?runSkel:0))},
  chrono:{goal:1200,label:'',fmt:v=>fmtT(v),desc:'Sobreviva 20 minutos numa única corrida',prog:()=>Math.min(1200,Math.max(metaStat().bestTime,inRun()?runTime:0))},
  pistol:{goal:300,label:'abates numa corrida',desc:'Faça 300 abates numa única corrida',prog:()=>Math.min(300,Math.max(metaStat().maxKills,inRun()?kills:0))},
  dracula:{goal:1500,label:'morcegos',desc:'Abata 1.500 morcegos no total',prog:()=>Math.min(1500,metaStat().batKills+(inRun()?runBat:0))},
  demon:{goal:5,label:'Golens',desc:'Derrote o Golem 5 vezes no total',prog:()=>Math.min(5,metaStat().bosses+(inRun()?bossKills:0))},
  future:{goal:20,label:'de nível',desc:'Alcance o nível 20 numa única corrida',prog:()=>Math.min(20,Math.max(metaStat().bestLvl,inRun()?player.lvl:0))},
  human:{goal:3,label:'corridas',desc:'Jogue 3 corridas (o Zé insiste em aparecer)',prog:()=>Math.min(3,metaStat().runs)},
  king:{goal:1000,label:'de ouro',desc:'Acumule 1.000 de ouro',prog:()=>Math.min(1000,coins())},
};
const isUnlocked=k=>(!UNLOCK[k]&&!MISSION[k])||!!store.get('cv_unlocked',{})[k];
const doUnlock=k=>{const u=store.get('cv_unlocked',{});u[k]=1;store.set('cv_unlocked',u)};
const RARITY={novo:{t:'NOVO',c:'#f2b84b'},comum:{t:'COMUM',c:'#7fcf5a'},incomum:{t:'INCOMUM',c:'#62b8ff'},raro:{t:'RARO',c:'#c08bff'}};

/* ===== meta-progressão (tudo salvo no navegador) ===== */
const coins=()=>store.get('cv_coins',0);
const addCoins=n=>store.set('cv_coins',Math.max(0,coins()+n));
const shopLv=()=>store.get('cv_shop',{});
const metaStat=()=>Object.assign({kills:0,runs:0,bestTime:0,bestLvl:0,bosses:0,maxDmg:0,skelKills:0,maxKills:0,batKills:0,classes:{}},store.get('cv_stat',{}));
const SHOP=[
  {id:'hp',ic:'❤️',nome:'Vitalidade',desc:l=>'+'+(l*15)+' de vida inicial',max:6,cost:l=>40+(l-1)*45},
  {id:'dmg',ic:'💪',nome:'Poder',desc:l=>'+'+(l*5)+'% de dano',max:6,cost:l=>50+(l-1)*55},
  {id:'spd',ic:'👟',nome:'Agilidade',desc:l=>'+'+(l*4)+'% de velocidade',max:5,cost:l=>45+(l-1)*50},
  {id:'crit',ic:'🎯',nome:'Precisão',desc:l=>'+'+(l*4)+'% de crítico',max:5,cost:l=>55+(l-1)*50},
  {id:'magnet',ic:'🧲',nome:'Magnetismo',desc:l=>'+'+(l*20)+'% de coleta de orbes',max:3,cost:l=>60+(l-1)*60},
  {id:'greed',ic:'🪙',nome:'Ganância',desc:l=>'+'+(l*15)+'% de ouro ganho',max:5,cost:l=>50+(l-1)*55},
];
// a loja vai crescer: skins e outros itens entram na mesma lista SHOP no futuro
function applyShop(p){const s=shopLv();
  if(s.hp){p.maxHp+=s.hp*15;p.hp+=s.hp*15}
  if(s.dmg)p.stats.dmg*=1+s.dmg*.05;
  if(s.spd)p.stats.move*=1+s.spd*.04;
  if(s.crit)p.stats.crit+=s.crit*.04;
  if(s.magnet)p.stats.magnet*=1+s.magnet*.2;
}
const ACH=[
  {id:'k100',ic:'💀',nome:'Caçador',desc:'Abata 100 inimigos no total',goal:100,cur:s=>s.kills,rw:30},
  {id:'k1000',ic:'☠️',nome:'Exterminador',desc:'Abata 1000 inimigos no total',goal:1000,cur:s=>s.kills,rw:120},
  {id:'t5',ic:'⏱️',nome:'Resistente',desc:'Sobreviva 5 min numa partida',goal:300,cur:s=>s.bestTime,rw:40,time:true},
  {id:'t10',ic:'⌛',nome:'Imortal',desc:'Sobreviva 10 min numa partida',goal:600,cur:s=>s.bestTime,rw:110,time:true},
  {id:'lv15',ic:'⭐',nome:'Veterano',desc:'Chegue ao nível 15 numa partida',goal:15,cur:s=>s.bestLvl,rw:50},
  {id:'boss5',ic:'👹',nome:'Mata-Golem',desc:'Derrote o Golem 5 vezes',goal:5,cur:s=>s.bosses,rw:80},
  {id:'allcls',ic:'🎖️',nome:'Mestre de Armas',desc:'Jogue com as 4 classes',goal:4,cur:s=>Object.keys(s.classes).length,rw:60},
  {id:'runs15',ic:'🔁',nome:'Persistente',desc:'Jogue 15 partidas',goal:15,cur:s=>s.runs,rw:60},
];
function claimAch(){const st=metaStat(),claimed=store.get('cv_ach',{});let bonus=0;
  for(const a of ACH)if(!claimed[a.id]&&a.cur(st)>=a.goal){claimed[a.id]=1;bonus+=a.rw}
  if(bonus){store.set('cv_ach',claimed);addCoins(bonus)}return bonus}
function recordRun(){const s=metaStat();s.runs++;s.kills+=kills;s.bestTime=Math.max(s.bestTime,Math.floor(runTime));s.bestLvl=Math.max(s.bestLvl,player.lvl);s.bosses+=bossKills;s.maxDmg=Math.max(s.maxDmg,Math.round(runDmg));s.skelKills+=runSkel;s.maxKills=Math.max(s.maxKills,kills);s.batKills+=runBat;s.classes[player.cls]=true;store.set('cv_stat',s);
  let newCls=null;if(!store.get('cv_unlocked',{}).arqueiro){doUnlock('arqueiro');newCls='arqueiro'} // missão do Arqueiro: completar uma corrida
  if(!store.get('cv_unlocked',{}).human&&s.runs>=MISSION.human.goal){doUnlock('human');newCls=newCls||'human'} // missão do Zé: 3 corridas
  const greed=1+(shopLv().greed||0)*.15,earned=Math.max(1,Math.floor((kills*.6+runTime/4)*greed));addCoins(earned);
  return{earned,bonus:claimAch(),newCls}}

/* ================= motor ================= */
const renderer=new THREE.WebGLRenderer({antialias:!isTouch,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isTouch?1.25:1.75));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('#game').appendChild(renderer.domElement);
const scene=new THREE.Scene();
const SKY_DAY=new THREE.Color(0xb6d6de),SKY_DUSK=new THREE.Color(0xf0a878),SKY_NIGHT=new THREE.Color(0x161b33),skyC=new THREE.Color();
scene.background=new THREE.Color(0xb6d6de);scene.fog=new THREE.Fog(0xb6d6de,26,70);
const camera=new THREE.PerspectiveCamera(42,1,.1,160);
const hemi=new THREE.HemisphereLight(0xcfe4e8,0x5a6a33,.75);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffd9a0,.9);sun.castShadow=true;const SM=isTouch?1024:2048;sun.shadow.mapSize.set(SM,SM);
Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:70});sun.shadow.bias=-.0008;sun.shadow.camera.updateProjectionMatrix();scene.add(sun,sun.target);
const heroLight=new THREE.PointLight(0xffc890,.4,12,1.5);scene.add(heroLight);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

const boxGeo=new THREE.BoxGeometry(1,1,1);
// Bloco com faces coloridas (estilo Minecraft). Ordem de faces do BoxGeometry: +X,-X,+Y(topo),-Y(base),+Z,-Z — 4 vértices cada.
function faceBoxGeo(topHex,sideHex,botHex){
  const g=new THREE.BoxGeometry(1,1,1),n=g.attributes.position.count,a=new Float32Array(n*3);
  const top=new THREE.Color(topHex),side=new THREE.Color(sideHex),bot=new THREE.Color(botHex==null?sideHex:botHex);
  for(let i=0;i<n;i++){const c=(i>=8&&i<12)?top:(i>=12&&i<16)?bot:side;a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}
  g.setAttribute('color',new THREE.Float32BufferAttribute(a,3));return g;
}
// Paleta casada com as árvores .vox: verde puro saturado (#00aa00) + terra no tom do tronco (#663300)
const grassBlockGeo=faceBoxGeo(0x6f9143,0x6b4a2b,0x3a1c00); // grama: topo oliva (paleta "entardecer"), lados/base terra
const dirtBlockGeo=faceBoxGeo(0x8a5016,0x663300,0x3a1c00);  // terra batida (caminho)
const ringGeo=new THREE.RingGeometry(.86,1,40);
const discGeo=new THREE.CircleGeometry(1,40);
const mats={};
function mat(c,e=0,t=0){const k=c+'|'+e+'|'+t;if(!mats[k]){const m=new THREE.MeshLambertMaterial({color:c});if(e){m.emissive=new THREE.Color(c);m.emissiveIntensity=e}if(t){m.transparent=true;m.opacity=t}mats[k]=m}return mats[k]}
const flashMat=new THREE.MeshBasicMaterial({color:0xffffff});
const vcMat=new THREE.MeshLambertMaterial({vertexColors:true});
const eliteMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:new THREE.Color(0x7a4a00),emissiveIntensity:.8});
const projMat=new THREE.MeshBasicMaterial({vertexColors:true});
function vox(p,x,y,z,w,h,d,c,e,t){const m=new THREE.Mesh(boxGeo,mat(c,e,t));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;p.add(m);return m}
function collect(g){const a=[];g.traverse(o=>{if(o.isMesh)a.push({m:o,mat:o.material})});g.userData.meshes=a;return g}
function setFlash(g,on){if(g.userData.flashOn===on)return;g.userData.flashOn=on;for(const it of g.userData.meshes)it.m.material=on?flashMat:it.mat}
// junta várias caixas numa geometria só (1 chamada de desenho por inimigo)
function mergeBoxes(boxes,amp=0){const pos=[],nor=[],col=[],idx=[];let off=0;const c=new THREE.Color();
  for(const b of boxes){const sd=amp>0?2:1; // amp>0: 2 subdivisões por eixo + speckle em 3 tons (textura de pixel procedural)
    const g=new THREE.BoxGeometry(b[3],b[4],b[5],sd,sd,sd);g.translate(b[0],b[1],b[2]);c.setHex(b[6]);
    const P=g.attributes.position.array,N=g.attributes.normal.array;
    for(let i=0;i<P.length/3;i++){const r=Math.random(),m=amp>0?(r<.33?1-amp:r<.66?1:1+amp):1;
      pos.push(P[i*3],P[i*3+1],P[i*3+2]);nor.push(N[i*3],N[i*3+1],N[i*3+2]);col.push(c.r*m,c.g*m,c.b*m)}
    for(const i of g.index.array)idx.push(i+off);off+=P.length/3;g.dispose()}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('color',new THREE.Float32BufferAttribute(col,3));G.setIndex(idx);G.computeBoundingSphere();return G}

// Tipos de árvore procedurais (variedade). Cada uma é uma geometria mesclada (1 draw call por tipo via InstancedMesh).
const treeMat=new THREE.MeshLambertMaterial({vertexColors:true});
const TREE_GEOS=[
  // carvalho: tronco curto + copa redonda cheia (verdes vivos)
  mergeBoxes([[0,.65,0,.36,1.3,.36,0x6b4a2b],[0,1.5,0,.46,.5,.46,0x5a3f26],
    [0,1.95,0,1.6,1.05,1.6,0x6a9a3e],[0,2.62,0,1.05,.75,1.05,0x7cab4d],
    [.55,2.12,.35,.7,.6,.7,0x4d7a37],[-.5,2.18,-.3,.66,.55,.66,0x5f9042],[.22,2.5,-.42,.5,.5,.5,0x5f9042]],.12),
  // pinheiro: silhueta cônica em camadas
  mergeBoxes([[0,.5,0,.28,1.0,.28,0x5a3f26],[0,1.2,0,1.5,.55,1.5,0x2d7a38],
    [0,1.66,0,1.15,.55,1.15,0x339040],[0,2.12,0,.8,.55,.8,0x6a9a3e],[0,2.56,0,.46,.5,.46,0x7cab4d],[0,2.9,0,.2,.3,.2,0x7cab4d]],.12),
  // arbusto: tufo arredondado (sem tronco)
  mergeBoxes([[0,.45,0,1.2,.85,1.2,0x6a9a3e],[.36,.9,.26,.66,.6,.66,0x7cab4d],[-.33,.76,-.26,.6,.55,.6,0x4d7a37],[.1,1.05,-.1,.5,.45,.5,0x5f9042]],.12),
  // outono: copa quente (laranja/âmbar)
  mergeBoxes([[0,.65,0,.34,1.3,.34,0x6b4a2b],[0,1.5,0,.44,.5,.44,0x5a3f26],
    [0,1.95,0,1.5,1.0,1.5,0xe09428],[0,2.6,0,1.0,.72,1.0,0xf0b53a],
    [.5,2.12,.32,.66,.6,.66,0xc85528],[-.46,2.18,-.3,.6,.55,.6,0xd9702a]],.15),
  // bétula: tronco claro com marcas + copa leve
  mergeBoxes([[0,.8,0,.24,1.6,.24,0xe4ded0],[0,1.0,0,.26,.08,.26,0x3a352c],[0,1.5,0,.26,.07,.26,0x3a352c],
    [0,2.18,0,1.15,.95,1.15,0x83ad55],[0,2.82,0,.72,.6,.72,0x9cbf68],[.46,2.32,.3,.55,.5,.55,0x749c47]],.08),
  // árvore morta: galhos que saem do tronco em L (blocos sobrepostos, sem buracos)
  mergeBoxes([
    // tronco afinando
    [0,.6,0,.32,1.2,.32,0x6a5240],[0,1.35,0,.24,.5,.24,0x6a5240],[0,1.78,0,.17,.56,.17,0x6a5240],
    // galho direito: horizontal saindo do tronco + sobe
    [.26,1.4,0,.5,.16,.16,0x5c4636],[.46,1.68,0,.16,.56,.16,0x5c4636],[.46,2.02,0,.11,.3,.11,0x5c4636],
    // galho esquerdo: um pouco mais alto, com leve z
    [-.25,1.62,-.02,.48,.15,.15,0x5c4636],[-.45,1.9,-.02,.15,.56,.15,0x5c4636],[-.45,2.24,-.02,.1,.28,.1,0x5c4636],
    // galho central saindo do topo do tronco, inclinado pra frente
    [.1,2.02,.12,.28,.15,.15,0x6a5240],[.22,2.28,.18,.13,.4,.13,0x5c4636]],.12),
];
// pedras procedurais (facetadas, com musguinho no topo)
const ROCK_GEOS=[
  mergeBoxes([[0,.3,0,1.0,.6,.9,0x8a8a86],[.22,.72,.1,.6,.42,.56,0x9a9a94],[-.26,.56,-.2,.5,.4,.5,0x76766f],
    [0,.96,.05,.36,.26,.36,0xa6a69f],[0,1.07,.08,.52,.08,.5,0x6f8f3f]],.14),
  mergeBoxes([[0,.25,0,.82,.5,.82,0x82827c],[.16,.56,.1,.46,.36,.46,0x94948d],[-.2,.42,-.14,.42,.3,.42,0x70706b],[-.08,.64,.06,.32,.1,.32,0x6f8f3f]],.14),
];
// geometrias de decoração do campo (compartilhadas entre o jogo e a galeria)
const DECOR_GEO={
  grave:mergeBoxes([
    [0,.08,0,.52,.16,.24,0x7a7a72],                                   // base
    [0,.46,0,.42,.68,.16,0x9d9d95],[0,.82,0,.3,.14,.16,0x9d9d95],[0,.9,0,.17,.08,.16,0x9d9d95], // laje + topo arredondado
    [0,.58,.085,.05,.24,.02,0x6c6c66],[0,.62,.085,.17,.05,.02,0x6c6c66]]), // cruz gravada na frente
  cross:mergeBoxes([[0,.37,0,.13,.74,.11,0x94948c],[0,.52,0,.44,.13,.1,0x9a9a92]]), // poste alto + trave mais baixa (cruz, não T)
  shroom:mergeBoxes([[0,.13,0,.16,.26,.16,0xe8e0c8],[0,.3,0,.44,.14,.44,0xd0402a]]),
  fire:mergeBoxes([[.46,.15,0,.26,.3,.3,0x7a7a72],[-.46,.15,.06,.26,.3,.3,0x8a8a80],[.08,.15,.46,.3,.3,.26,0x7f7f77],[-.12,.15,-.46,.3,.3,.26,0x8a8a80],[.4,.15,-.38,.24,.28,.24,0x82827a],
    [0,.14,0,.62,.14,.17,0x6a4a2b],[0,.14,0,.17,.14,.62,0x5a3f26],[-.04,.27,.04,.52,.12,.15,0x7a5230],[.04,.27,-.04,.15,.12,.52,0x6a4a2b],
    [.31,.14,0,.08,.1,.14,0xc8a878],[-.31,.14,0,.08,.1,.14,0xc8a878],[0,.1,0,.34,.06,.34,0x8a2a0a]]),
  flame:mergeBoxes([[0,.3,0,.34,.3,.34,0xff7a1a],[0,.54,0,.26,.26,.26,0xff7a1a],[0,.76,0,.17,.24,.17,0xff7a1a],[0,.96,0,.1,.2,.1,0xff7a1a],[0,1.12,0,.05,.14,.05,0xff7a1a],
    [-.14,.52,.06,.1,.22,.1,0xff7a1a],[.13,.62,-.05,.09,.24,.09,0xff7a1a]]),
  crystal:mergeBoxes([
    // base de rocha escura (dá contorno/borda contra o chão claro)
    [0,.11,0,.5,.22,.5,0x241c36],[.17,.2,.1,.22,.14,.22,0x1b1430],[-.14,.17,-.12,.2,.12,.2,0x1b1430],
    // cristais facetados: tons diferentes dão volume e definição de aresta
    [0,.52,0,.28,.66,.28,0x7a54c8],[.23,.48,.12,.18,.52,.18,0xa888f2],[-.19,.42,-.12,.16,.46,.16,0x5e3fa8],[.03,.86,0,.14,.26,.14,0xd4bcff]]),
  stump:mergeBoxes([[0,.18,0,.5,.36,.5,0x6b4a2b],[0,.37,0,.4,.05,.4,0xc9a06a]]),
};

/* ================= heróis (articulados) ================= */
function buildBody(P){
  const root=new THREE.Group();
  const leg=x=>{const l=new THREE.Group();l.position.set(x,.34,0);vox(l,0,-.15,0,.16,.32,.18,P.legs);vox(l,0,-.3,.02,.18,.09,.23,P.boots||0x2a2118);root.add(l);return l};
  const legL=leg(-.11),legR=leg(.11);
  const torso=new THREE.Group();torso.position.y=.34;root.add(torso);
  vox(torso,0,.22,0,.44,.44,.28,P.body);vox(torso,0,.03,0,.46,.07,.3,P.trim);
  const head=new THREE.Group();head.position.y=.62;torso.add(head);
  vox(head,0,0,0,.34,.34,.34,P.skin);
  vox(head,-.08,.02,.171,.06,.07,.01,P.eye||0x15101c,P.eyeE||0);vox(head,.08,.02,.171,.06,.07,.01,P.eye||0x15101c,P.eyeE||0);
  const arm=x=>{const a=new THREE.Group();a.position.set(x,.42,0);vox(a,0,-.15,0,.13,.34,.15,P.arm||P.body);vox(a,0,-.34,0,.12,.1,.13,P.skin);torso.add(a);const h=new THREE.Group();h.position.set(0,-.36,.02);a.add(h);return[a,h]};
  const [armL,handL]=arm(-.3),[armR,handR]=arm(.3);
  return{root,legL,legR,torso,head,armL,armR,handL,handR,keep:[]};
}
function makeBow(parent,col=0x7a5230){const bw=new THREE.Group();parent.add(bw);for(let i=-3;i<=3;i++)vox(bw,0,i*.1,.12-i*i*.011,.05,.11,.05,col);vox(bw,0,0,.012,.012,.64,.012,0xeeeeee);return bw}
function buildHero(cls){
  const C=CLASSES[cls],P=C.pal,b=buildBody(P);
  const fn=C.model;if(fn)fn(b,P,vox,makeBow,boxGeo);
  collect(b.root);if(b.bubble)b.root.add(b.bubble);
  return b;
}

/* ================= inimigos (geometria única) ================= */
function humanoid(P,o={}){
  const L=P.legs,B=P.body,T=P.trim,S=P.skin,A=P.arm||B,E=P.eye||0x15101c;
  const b=[[-.11,.17,0,.16,.34,.18,L],[.11,.17,0,.16,.34,.18,L],[0,.56,0,.44,.44,.28,B],[0,.37,0,.46,.07,.3,T],[0,.96,0,.34,.34,.34,S],[-.08,.98,.172,.06,.07,.01,E],[.08,.98,.172,.06,.07,.01,E]];
  if(o.armsFwd)b.push([-.3,.72,.14,.13,.14,.34,A],[.3,.72,.14,.13,.14,.34,A],[-.3,.72,.34,.12,.12,.1,S],[.3,.72,.34,.12,.12,.1,S]);
  else b.push([-.3,.61,0,.13,.34,.15,A],[.3,.61,0,.13,.34,.15,A],[-.3,.42,0,.12,.1,.13,S],[.3,.42,0,.12,.1,.13,S]);
  return b.concat(o.extra||[]);
}
const ENEMY_BOXES={};
const ENEMIES={};
const ENEMY_GEO={};
function enemyGeo(t){if(!ENEMY_GEO[t])ENEMY_GEO[t]=mergeBoxes(ENEMY_BOXES[t]());return ENEMY_GEO[t]}
// Inimigos articulados: corpo (malha) + pernas/asas separadas pra animar.
const LEGGED={};
// inimigos definidos em arquivos separados (assets/js/enimies/*.js registram em window.ENEMY_DEFS)
const ENEMY_DEFS=(function(){const D=(window&&window.ENEMY_DEFS)||{},out={};
  for(const k in D){const S=D[k](humanoid);if(!S)continue;out[k]=S;ENEMY_BOXES[k]=S.boxes;ENEMIES[k]=S.stats;if(S.legged)LEGGED[k]=1}
  return out})();
const _BODY={},_LEG={},_WING={};
function enemyBodyGeo(t){if(_BODY[t])return _BODY[t];let bx=ENEMY_BOXES[t]();
  if(LEGGED[t])bx=bx.slice(2); // tira pernas (as asas do morcego são geometria separada)
  return _BODY[t]=mergeBoxes(bx)}
function enemyLegGeo(t){if(_LEG[t])return _LEG[t];const d=ENEMY_DEFS[t],L=d&&d.leg?d.leg[0][6]:ENEMY_BOXES[t]()[0][6]; // cor da perna
  return _LEG[t]=mergeBoxes(d&&d.leg?d.leg:[[0,-.17,0,.16,.34,.18,L]])} // def.leg: caixas finas (esqueleto); padrão: bloco maciço, pivô no quadril, pé em -.34
function batWingGeo(side){const k='w'+side;if(_WING[k])return _WING[k];const s=side; // pivô no ombro (±.15,.95)
  const BONE=0x1a1226,MEM=0x2a1548,MEM2=0x241240,MEM3=0x3d2166,VEIN=0x5a3a8a,CLAW=0xcfc7b0;
  return _WING[k]=mergeBoxes([
    // membrana em 3 painéis (gradiente escuro -> claro)
    [.18*s,.00,.04,.36,.025,.26,MEM2],
    [.40*s,.01,.05,.26,.022,.22,MEM],
    [.58*s,.02,.06,.20,.020,.16,MEM3],
    // borda recortada (3 pontas)
    [.20*s,.00,.17,.14,.020,.06,MEM],
    [.36*s,.00,.18,.12,.020,.05,MEM],
    [.52*s,.00,.16,.10,.020,.04,MEM3],
    // ossos dos dedos
    [.16*s,.045,-.02,.32,.030,.05,BONE],
    [.30*s,.045,-.13,.50,.028,.035,BONE],
    [.36*s,.050,-.07,.36,.022,.030,BONE],
    [.38*s,.050,.02,.34,.022,.030,BONE],
    [.38*s,.050,.10,.30,.022,.030,BONE],
    // veias
    [.26*s,.055,.06,.18,.015,.015,VEIN],
    [.46*s,.055,.07,.16,.015,.015,VEIN],
    // garra na ponta
    [.68*s,.025,-.02,.07,.04,.06,CLAW]
  ])}
function buildGolem(){const b=buildBody({body:0x6e6578,trim:0x4a4352,skin:0x7d7488,legs:0x5c5466,arm:0x7d7488,eye:0xff6a2a,eyeE:1.4,boots:0x4a4352});
  vox(b.torso,0,.25,.15,.16,.16,.04,0xff6a2a,1.4);vox(b.torso,-.12,.4,.145,.12,.06,.02,0x4f7a3a);vox(b.torso,.15,.1,.145,.1,.05,.02,0x4f7a3a);
  vox(b.torso,-.33,.47,0,.24,.2,.3,0x5c5466);vox(b.torso,.33,.47,0,.24,.2,.3,0x5c5466);vox(b.head,0,.2,0,.2,.08,.2,0x4a4352);
  vox(b.handL,0,-.05,0,.24,.24,.24,0x6e6578);vox(b.handR,0,-.05,0,.24,.24,.24,0x6e6578);
  b.root.scale.setScalar(2.6);collect(b.root);return b}
function buildOgre(){const b=buildBody({body:0x6a5a3a,trim:0x4a3a28,skin:0x7aa84a,legs:0x5a4a2e,arm:0x7aa84a,eye:0xffd24a,eyeE:.6,boots:0x3a2a1a});
  vox(b.torso,0,.06,.13,.54,.44,.24,0x7aa84a);                                              // barrigão
  vox(b.torso,-.35,.5,0,.22,.14,.3,0x4a3a28);vox(b.torso,.35,.5,0,.22,.14,.3,0x4a3a28);     // ombreiras de couro
  vox(b.head,0,-.15,.11,.3,.12,.18,0x7aa84a);                                               // mandíbula
  vox(b.head,-.08,-.19,.18,.045,.09,.03,0xf0ead8);vox(b.head,.08,-.19,.18,.045,.09,.03,0xf0ead8); // presas
  vox(b.head,-.21,.02,0,.06,.12,.09,0x7aa84a);vox(b.head,.21,.02,0,.06,.12,.09,0x7aa84a);   // orelhas
  vox(b.head,0,.2,-.02,.32,.12,.32,0x2a1f14);                                               // cabelo
  // bastão de guerra na mão direita
  const club=new THREE.Group();club.rotation.x=Math.PI/2;b.handR.add(club);
  vox(club,0,.38,0,.12,1.15,.12,0x5a3f26);vox(club,0,1.05,0,.38,.52,.38,0x7a5a3a);vox(club,0,1.05,0,.44,.17,.44,0x5a3f26);
  vox(club,.21,1.1,0,.11,.15,.11,0x9a9a90);vox(club,-.19,.92,.13,.11,.15,.11,0x9a9a90);vox(club,.1,1.2,-.1,.1,.13,.1,0x9a9a90);
  b.root.scale.setScalar(2.4);collect(b.root);return b}

const PROJ_GEO={
  fire:mergeBoxes([[0,0,0,.26,.26,.26,0x8fe1ff],[0,0,-.13,.14,.14,.3,0xd6f3ff]]),
  arrow:mergeBoxes([[0,0,0,.045,.045,.52,0x8a6a42],[0,0,.28,.075,.075,.1,0xcfd6dd],[0,0,.345,.035,.035,.05,0xe8eef2],[0,0,-.20,.11,.018,.13,0x7fcf5a],[0,0,-.20,.018,.11,.13,0xeee7da],[0,0,-.28,.05,.05,.02,0x2a4a3a]]),
  bone:mergeBoxes([[0,0,0,.3,.07,.07,0xe6dfca],[.15,0,0,.09,.12,.12,0xe6dfca],[-.15,0,0,.09,.12,.12,0xe6dfca]]),
  orb:mergeBoxes([[0,0,0,.36,.36,.36,0xff6a2a],[0,0,0,.2,.44,.2,0xffb070]]),
  skull:mergeBoxes([[0,0,0,.24,.24,.22,0x9ff0bf],[0,0,-.1,.14,.14,.22,0xdcffe8],[-.06,.02,.11,.04,.05,.02,0x133a22],[.06,.02,.11,.04,.05,.02,0x133a22]]),
  bullet:mergeBoxes([[0,0,0,.08,.08,.22,0xffe08a],[0,0,-.13,.045,.045,.14,0xffb84a],[0,0,.12,.05,.05,.05,0xfff4c8]]),
  batp:mergeBoxes([[0,0,0,.16,.12,.14,0x2a1f38],[-.18,.02,0,.22,.03,.16,0x1a1226],[.18,.02,0,.22,.03,.16,0x1a1226],[-.05,.02,.08,.03,.03,.02,0xff3030],[.05,.02,.08,.03,.03,.02,0xff3030]]),
  hellfire:mergeBoxes([[0,0,0,.28,.28,.28,0xff6a2a],[0,0,-.14,.16,.16,.3,0xffb04a],[0,0,.12,.14,.14,.1,0x7a1a0a]]),
  plasma:mergeBoxes([[0,0,0,.14,.14,.34,0x3bf0d0],[0,0,-.18,.08,.08,.18,0xbffff4],[0,0,.14,.1,.1,.1,0x1affd8]]),
  rock:mergeBoxes([[0,0,0,.2,.17,.2,0x8a8a86],[0,.06,.05,.12,.08,.12,0x9a9a94],[-.06,-.05,-.04,.09,.09,.09,0x74746f],[.07,.03,.02,.06,.06,.06,0x9a9a94]]),
  gcoin:mergeBoxes([[0,0,0,.22,.22,.06,0xf2c14b],[0,0,.04,.11,.11,.02,0xffe9a0],[0,0,-.04,.11,.11,.02,0xcf9a2a]]),
  time:mergeBoxes([[0,0,0,.26,.26,.26,0x9fe8ff],[0,0,0,.36,.07,.07,0xe9d58a],[0,0,0,.07,.36,.07,0xe9d58a],[0,.02,.14,.025,.11,.02,0xffffff],[.06,-.02,.14,.09,.025,.02,0xffffff]]),
};

/* ================= estado ================= */
let state='menu',selCls=store.get('cv_cls','guerreiro');if(!CLASSES[selCls])selCls='guerreiro';
let grid=null,hgt=null,level=null,fxGroup=null,wGroup=null,enemies=[],projs=[],pickups=[],fxs=[],parts=[],texts=[],chests=[],totems=[],landPos=null,flameMat=null,fireFx=null;
let kills=0,runTime=0,shake=0,boss=null,hurtA=0,deadT=0,hordeN=0,nextHorde=60,nextBoss=240,bossCount=0,spawnAcc=0,pendingUps=0,upSource='lvl',bossKills=0,lastReward=null,runDmg=0,runSkel=0,runBat=0,cheatGod=false,ogreLoose=false;
// Map state (must be declared before setScreen uses it)
let mapOpen=false,mapScreen=null,mapCanvas=null;
// Boss state moved to BOSS module
const player={model:null};
let camYaw=0,camDist=5.4,camPitch=.5,camZoom=6.5,camFx=0,camFz=0;
const W=128,H=128;

/* ================= campo ================= */
const isWall=(x,z)=>{const i=Math.round(x),j=Math.round(z);if(!grid||i<0||j<0||i>=W||j>=H)return true;return grid[j*W+i]>0};
const wallH=(x,z)=>{const i=Math.round(x),j=Math.round(z);if(!grid||i<0||j<0||i>=W||j>=H)return 9;return hgt[j*W+i]};
function collide(x,z,r){if(isWall(x-r,z-r)||isWall(x+r,z-r)||isWall(x-r,z+r)||isWall(x+r,z+r))return true;if(r>.5&&(isWall(x-r,z)||isWall(x+r,z)||isWall(x,z-r)||isWall(x,z+r)))return true;return false}
function moveEnt(e,dx,dz){let bl=false;if(!collide(e.x+dx,e.z,e.r))e.x+=dx;else bl=true;if(!collide(e.x,e.z+dz,e.r))e.z+=dz;else bl=true;return bl}
const nz=(x,z)=>Math.sin(x*.11+1.7)*Math.cos(z*.09)+Math.sin((x-z)*.05)*.8;
// montanhas: morros altos jogáveis, sempre longe da praça central (topo rochoso pintado no buildField)
const HILLS=[];{let ht=0;while(HILLS.length<4&&ht++<300){const x=rand(18,W-19),z=rand(18,H-19);
  if(Math.hypot(x-W/2,z-H/2)<36)continue; // centro fica plano (spawn/arena)
  if(HILLS.some(h=>Math.hypot(h.x-x,h.z-z)<h.r+22))continue; // montanhas espalhadas
  HILLS.push({x,z,h:3.5+Math.random()*3,r:9+Math.random()*5})}}
const hillH=(x,z)=>{let a=0;for(const h of HILLS){const d2=(x-h.x)*(x-h.x)+(z-h.z)*(z-h.z);a+=h.h*Math.exp(-d2/(h.r*h.r))}return a};
// relevo suave do terreno (colinas e depressões) + montanhas — altura em unidades
const relief=(x,z)=>(Math.sin(x*.15+1.3)*Math.cos(z*.12-.7)+Math.sin((x+z)*.08)*.7)*.16+hillH(x,z);
const jv=(x,z)=>{const H2=(i,j)=>{const h=Math.sin(i*127.1+j*311.7)*43758.5453;return h-Math.floor(h)-.5};const a=Math.floor(x/4),b=Math.floor(z/4);
return H2(a,b)*.7+H2(Math.round(x),Math.round(z))*.3}; // micro-relevo voxel (estilo o campo do título): placas de 4x4 + leve variação fina; determinístico, todo mundo amosstra o mesmo topo
const nz2=(x,z)=>Math.sin(x*.031+4.2)*Math.cos(z*.027+1.3)+Math.sin((x+z)*.019+2.1)*.6; // manchas grandes de grama seca
function genField(){
  grid=new Uint8Array(W*H);hgt=new Float32Array(W*H);const trees=[],rocks=[],clears=[];
  const set=(x,z,v,h)=>{grid[z*W+x]=v;hgt[z*W+x]=h};const free=(x,z)=>x>3&&z>3&&x<W-4&&z<H-4&&grid[z*W+x]===0&&Math.hypot(x-W/2,z-H/2)>9;
  // clareiras abertas espalhadas pelo mapa: "arenas" naturais que dão respiro nas lutas
  let ct=0;while(clears.length<7&&ct++<400){const x=rand(16,W-17),z=rand(16,H-17),r=6.5+Math.random()*3;
    if(Math.hypot(x-W/2,z-H/2)<r+15)continue; // o centro (spawn) já nasce limpo
    if(Math.max(hillH(x,z),hillH(x+r,z),hillH(x,z+r))>1.5)continue; // clareiras ficam em terreno baixo (arena plana)
    if(clears.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+r+9))continue;
    clears.push({x:Math.round(x),z:Math.round(z),r})}
  const inClear=(x,z)=>clears.some(c=>(c.x-x)*(c.x-x)+(c.z-z)*(c.z-z)<(c.r+1.2)*(c.r+1.2));
  // distância mínima entre árvores pra não nascer uma dentro da outra (centro a centro)
  const TREE_MIN=3,TREE_MIN2=TREE_MIN*TREE_MIN;
  const treeOk=(x,z)=>free(x,z)&&!inClear(x,z)&&trees.every(([tx,tz])=>(tx-x)*(tx-x)+(tz-z)*(tz-z)>=TREE_MIN2);
  for(let z=0;z<H;z++)for(let x=0;x<W;x++)if(x<3||z<3||x>=W-3||z>=H-3)set(x,z,1,rand(2.6,4.4));
  for(let c=0;c<38;c++){const cx=randi(8,W-9),cz=randi(8,H-9),n=randi(4,11);for(let i=0;i<n;i++){const x=cx+randi(-5,5),z=cz+randi(-5,5);if(treeOk(x,z)){set(x,z,2,3);trees.push([x,z])}}}
  for(let i=0;i<55;i++){const x=randi(4,W-5),z=randi(4,H-5);if(treeOk(x,z)){set(x,z,2,3);trees.push([x,z])}}
  for(let i=0;i<95;i++){const x=randi(4,W-5),z=randi(4,H-5);if(free(x,z)&&!inClear(x,z)){set(x,z,3,.9);rocks.push([x,z])}}
  return{trees,rocks,clears};
}
function buildField(){
  const{trees,rocks}=genField();
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),col=new THREE.Color(),up=new THREE.Vector3(0,1,0);
  const inst=(n,cast)=>{const m=new THREE.InstancedMesh(boxGeo,new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,n));m.receiveShadow=true;m.castShadow=!!cast;level.add(m);return m};
  // chão — blocos de grama (topo verde) com manchas de terra batida, estilo Minecraft
  const gCells=[],dCells=[];
  for(let z=0;z<H;z++)for(let x=0;x<W;x++)(nz(x,z)>1.2?dCells:gCells).push([x,z]);
  const ROCK_TONE=new THREE.Color(0x8c8c80); // pedra dos topos de montanha
  const blockInst=(geo,cells,dry)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}),Math.max(1,cells.length));
    m.receiveShadow=true;level.add(m);
    cells.forEach(([x,z],i)=>{m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06-.7,z),q,s.set(1,1.4,1));m.setMatrixAt(i,m4); // topo segue o relevo + micro-relevo voxel; bloco mais alto fecha os desníveis
      const yv=relief(x,z);
      if(dry&&nz2(x,z)>0.98)col.setHex(0xa8a24a).offsetHSL(0,0,rand(-.06,.04)); // manchas de grama seca/amarelada
      else col.setScalar(1.0+rand(-.08,.08)+((x+z)%2?.03:-.03)); // contraste/brilho: patches claros e escuros como as folhas
      if(yv>2)col.lerp(ROCK_TONE,Math.min(.8,(yv-2)/3));m.setColorAt(i,col)}); // acima de 2u o topo da montanha fica rochoso
    return m};
  blockInst(grassBlockGeo,gCells,true);blockInst(dirtBlockGeo,dCells);
  // penhascos da borda
  const bl=[];for(let z=0;z<H;z++)for(let x=0;x<W;x++)if(grid[z*W+x]===1)bl.push([x,z]);
  const bm=inst(bl.length,true);bl.forEach(([x,z],i)=>{const h=hgt[z*W+x];m4.compose(p.set(x,h/2,z),q,s.set(1,h,1));bm.setMatrixAt(i,m4);col.setHex(0x7d8274).offsetHSL(0,0,rand(-.06,.04));bm.setColorAt(i,col)});
  // árvores — vários tipos procedurais, 1 InstancedMesh por tipo
  {const buckets=TREE_GEOS.map(()=>[]);
    trees.forEach(t=>buckets[(Math.random()*TREE_GEOS.length)|0].push(t));
    TREE_GEOS.forEach((geo,bi)=>{const list=buckets[bi];if(!list.length)return;
      const im=new THREE.InstancedMesh(geo,treeMat,list.length);im.castShadow=true;im.receiveShadow=true;
      list.forEach(([x,z],i)=>{q.setFromAxisAngle(up,rand(0,TAU));m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06,z),q,s.setScalar(rand(.82,1.22)));im.setMatrixAt(i,m4);
        col.setScalar(1+rand(-.07,.07));im.setColorAt(i,col)}); // leve variação de tom por árvore
      level.add(im)});}
  // pedras — variantes facetadas, 1 InstancedMesh por tipo
  {const rb=ROCK_GEOS.map(()=>[]);rocks.forEach(t=>rb[(Math.random()*ROCK_GEOS.length)|0].push(t));
    ROCK_GEOS.forEach((geo,bi)=>{const list=rb[bi];if(!list.length)return;
      const im=new THREE.InstancedMesh(geo,treeMat,list.length);im.castShadow=true;im.receiveShadow=true;
      list.forEach(([x,z],i)=>{q.setFromAxisAngle(up,rand(0,TAU));m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06,z),q,s.setScalar(rand(.75,1.1)));im.setMatrixAt(i,m4);
        col.setScalar(1+rand(-.06,.05));im.setColorAt(i,col)});
      level.add(im)});}
  // flores espalhadas pelo chão (decoração plana, estilo Minecraft)
  const N=600,dm=inst(N,false);let n=0;
  for(let i=0;i<N;i++){const x=rand(4,W-5),z=rand(4,H-5);if(isWall(x,z)||relief(x,z)>1.5)continue;
    m4.compose(p.set(x,.07+relief(x,z)+jv(x,z)*.06,z),q,s.set(.12,.14,.12));col.setHex(pick([0xf2d24b,0xe86a8a,0xffffff,0xa58bff,0xff7a3a]));
    dm.setMatrixAt(n,m4);dm.setColorAt(n++,col)}
  dm.count=Math.max(1,n);
  // marcos do campo (decoração que não bloqueia): cemitérios, cogumelos, fogueiras, cristais e tocos
  landPos={fire:[],cry:[],grave:[]};
  {const decInst=(geo,matl,list,sc)=>{if(!list.length)return;const im=new THREE.InstancedMesh(geo,matl,list.length);im.castShadow=true;im.receiveShadow=true;level.add(im);
      list.forEach((it,i)=>{q.setFromAxisAngle(up,it[2]!=null?it[2]:rand(0,TAU));const k=sc?sc[0]+Math.random()*(sc[1]-sc[0]):1;
        m4.compose(p.set(it[0],relief(it[0],it[1])+jv(it[0],it[1])*.06,it[1]),q,s.setScalar(k));im.setMatrixAt(i,m4);col.setScalar(1+rand(-.08,.05));im.setColorAt(i,col)});return im};
    const open=(x,z,dC=12)=>x>4&&z>4&&x<W-5&&z<H-5&&!isWall(x,z)&&Math.hypot(x-W/2,z-H/2)>dC&&relief(x,z)<2; // marcos no terreno baixo
    // cemitérios: pequenos grupos de lápides e cruzes
    const graveG=DECOR_GEO.grave,crossG=DECOR_GEO.cross;
    const spots=[];let gt=0;while(spots.length<6&&gt++<250){const x=randi(12,W-13),z=randi(12,H-13);
      if(!open(x,z)||spots.some(s=>Math.hypot(s.x-x,s.z-z)<18))continue;spots.push({x,z})}
    landPos.grave=spots.map(s=>({x:s.x,z:s.z}));
    const graves=[],crosses=[];
    for(const s of spots){const n=randi(3,6);for(let i=0;i<n;i++){const x=s.x+randi(-2,2),z=s.z+randi(-2,2);
      if(isWall(x,z)||x<4||z<4||x>=W-5||z>=H-5)continue;(Math.random()<.55?graves:crosses).push([x,z,rand(-.5,.5)])}}
    decInst(graveG,new THREE.MeshLambertMaterial({vertexColors:true}),graves,[.9,1.2]);
    decInst(crossG,new THREE.MeshLambertMaterial({vertexColors:true}),crosses,[.9,1.2]);
    // tufos de cogumelo
    const shroomG=DECOR_GEO.shroom;
    const shList=[];let ht=0;while(shList.length<24&&ht++<400){const x=randi(6,W-7),z=randi(6,H-7);
      if(!open(x,z,6))continue;if(shList.some(s=>Math.hypot(s[0]-x,s[1]-z)<6))continue;shList.push([x,z,rand(0,TAU)])}
    decInst(shroomG,new THREE.MeshLambertMaterial({vertexColors:true}),shList,[.7,1.2]);
    // fogueiras (chama usa material brilhante com flicker no frame)
    const fireG=DECOR_GEO.fire,flG=DECOR_GEO.flame;
    const fires=[];let ft=0;while(fires.length<7&&ft++<300){const x=randi(10,W-11),z=randi(10,H-11);
      if(!open(x,z,20)||fires.some(f=>Math.hypot(f[0]-x,f[1]-z)<24))continue;fires.push([x,z,rand(0,TAU)])}
    landPos.fire=fires.map(f=>({x:f[0],z:f[1]}));
    decInst(fireG,new THREE.MeshLambertMaterial({vertexColors:true}),fires,[1,1.1]);
    flameMat=new THREE.MeshBasicMaterial({color:0xff8a2a});
    fireFx={mesh:null,base:[],smokes:[],lights:[],t:rand(0,9)};
    if(fires.length){const fm=new THREE.InstancedMesh(flG,flameMat,fires.length);level.add(fm);fireFx.mesh=fm;
      fires.forEach(([x,z,ry],i)=>{const y=relief(x,z)+jv(x,z)*.06,sc=rand(.85,1.1);
        q.setFromAxisAngle(up,ry);m4.compose(p.set(x,y,z),q,s.setScalar(sc));fm.setMatrixAt(i,m4);
        fireFx.base.push({x,z,y,ry,sc,ph:rand(0,TAU)});
        const li=new THREE.PointLight(0xff8a3a,1.5,6,2);li.position.set(x,y+.85,z);li.visible=false;level.add(li);fireFx.lights.push(li); // luz quente só de perto
        for(let k=0;k<3;k++){const sm=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xaab0b8,transparent:true,opacity:0,depthWrite:false}));
          sm.position.set(x,y-1.5,z);level.add(sm);fireFx.smokes.push({m:sm,x,y,z,ph:k/3})}})}
    // cristais arcanos (emitem luz própria até de dia)
    const cryG=DECOR_GEO.crystal;
    const crys=[];let yt=0;while(crys.length<8&&yt++<300){const x=randi(8,W-9),z=randi(8,H-9);
      if(!open(x,z,16)||crys.some(c=>Math.hypot(c[0]-x,c[1]-z)<22))continue;crys.push([x,z,rand(0,TAU)])}
    landPos.cry=crys.map(c=>({x:c[0],z:c[1]}));
    if(crys.length){const cm=new THREE.InstancedMesh(cryG,new THREE.MeshBasicMaterial({vertexColors:true}),crys.length);level.add(cm); // vertexColors mostra as facetas/base (não um borrão)
      crys.forEach(([x,z,ry],i)=>{q.setFromAxisAngle(up,ry);m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06,z),q,s.setScalar(rand(.9,1.4)));cm.setMatrixAt(i,m4);
        col.setScalar(1+rand(-.06,.08));cm.setColorAt(i,col)})} // só leve variação de brilho
    // tocos onde as árvores caíram
    const stumpG=DECOR_GEO.stump;
    const stumps=[];for(let i=0;i<26;i++){const x=randi(5,W-6),z=randi(5,H-6);if(open(x,z,10))stumps.push([x,z,rand(0,TAU)])}
    decInst(stumpG,new THREE.MeshLambertMaterial({vertexColors:true}),stumps,[.8,1.2]);
  }
  // baús
  chests=[];let tries=0;while(chests.length<20&&tries++<800){const x=randi(6,W-7),z=randi(6,H-7);if(isWall(x,z)||Math.hypot(x-W/2,z-H/2)<14)continue;if(chests.some(c=>Math.hypot(c.x-x,c.z-z)<10))continue;
    const {g,lid}=makeChest();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);g.rotation.y=rand(0,TAU);level.add(g);chests.push({x,z,g,lid,open:false})}
  // totens de íma — dois por partida, bem afastados. Ao usar: puxa orbes e moedas de todo o mapa e fica apagado
  totems=[];let tt=0;while(totems.length<2&&tt++<900){const x=randi(12,W-13),z=randi(12,H-13);if(isWall(x,z)||Math.hypot(x-W/2,z-H/2)<22)continue;if(totems.some(c=>Math.hypot(c.x-x,c.z-z)<40))continue;if(chests.some(c=>Math.hypot(c.x-x,c.z-z)<4))continue;
    const {g,m,off}=makeTotem();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);level.add(g);
    totems.push({x,z,g,m,off,t:rand(0,5),used:false})}
}

/* ================= entidades ================= */
// Escala degrau a degrau POR HORDA. A curva tem teto prático para que partidas longas
// continuem exigindo boas escolhas, sem transformar cada inimigo em uma esponja de dano.
// A adaptação é deliberadamente leve: ela ajusta o ritmo, não pune quem está jogando bem.
let aiSkill=.5,aiHpAvg=1,runDealt=0,aiT=0,moonOn=false,moonT=0,moonCd=0,moonKills=0,moonA=0,moonBudget=0,moonAcc=0;const MOON_RED=new THREE.Color(0x5c0f12);
function updAI(dt){if(!player||cheatGod)return;aiT-=dt;if(aiT>0)return;aiT=.5;
 const kF=clamp(kills/Math.max(runTime/60,.4)/35,0,1); // 35 abates/minuto é uma corrida confortável
 const eF=clamp(runDealt/Math.max(120,runDmg*12),0,1); // dano causado vs dano recebido, sem punir quem ainda não apanhou
 const hF=clamp(player.hp/player.maxHp,0,1);aiHpAvg+=(hF-aiHpAvg)*.2; // vida mantida
 aiSkill=clamp(aiSkill+(.4*kF+.25*eF+.35*aiHpAvg-aiSkill)*.045,.25,.75);
 // LUA DE SANGUE: evento raro, só depois da fase de aprendizado e nunca sobreposto a chefe.
 if(aiSkill<.62)moonKills=Math.max(0,moonKills-1);
 if(moonOn){moonT-=dt;moonAcc+=dt;if(moonAcc>3&&moonBudget>0){moonAcc=0;moonBudget--;const a=rand(0,TAU),d=15+rand(0,7),x=player.x+Math.sin(a)*d,z=player.z+Math.cos(a)*d;if(!collide(x,z,.4))spawnEnemy('zombie',x,z,false,{ms:1.05+Math.random()*.2})}
  if(moonT<=0){moonOn=false;moonCd=240}}
 else if(moonCd>0)moonCd-=dt;} // adaptação lenta, sem efeito ioiô
function bloodMoon(){moonOn=true;moonT=35;moonCd=240;moonKills=0;moonBudget=12;moonAcc=3;
 nextHorde=Math.max(nextHorde,runTime+moonT+15);
 for(let i=0;i<16;i++){const a=i/16*TAU,d=15+rand(0,7),x=player.x+Math.sin(a)*d,z=player.z+Math.cos(a)*d;if(!collide(x,z,.5))spawnEnemy('zombie',x,z,false,{ms:1.05+Math.random()*.2})}
 toast('🩸 LUA DE SANGUE','Seu massacre atraiu os mortos — eles vêm grandes e fortes');addShake(.5);S('bossin')}
function scaleT(){const H=Math.min(22,hordeN),a=clamp((aiSkill-.5)*.4,-.1,.1);return{hp:(1+H*.22+H*H*.018)*(1+a),dmg:(1+H*.055)*(1+a),spd:1+a*.5,extra:Math.max(0,a)}}
function spawnEnemy(type,x,z,elite,opts){
  const D=ENEMIES[type],S=scaleT(),ms=(opts&&opts.ms)||1;const sc=(D.scale||1)*(elite?1.35:1)*ms;const emat=elite?eliteMat:vcMat;
  let mesh,legL,legR,wingL,wingR,parts;
  if(LEGGED[type]||type==='bat'){ // corpo + partes articuladas
    mesh=new THREE.Group();const body=new THREE.Mesh(enemyBodyGeo(type),emat);body.castShadow=true;mesh.add(body);parts=[body];
    if(LEGGED[type]){legL=new THREE.Mesh(enemyLegGeo(type),emat);legR=new THREE.Mesh(enemyLegGeo(type),emat);
      legL.castShadow=legR.castShadow=true;legL.position.set(-.11,.34,0);legR.position.set(.11,.34,0);mesh.add(legL,legR);parts.push(legL,legR)}
    else{wingL=new THREE.Mesh(batWingGeo(-1),emat);wingR=new THREE.Mesh(batWingGeo(1),emat);
      wingL.castShadow=wingR.castShadow=true;wingL.position.set(-.15,.95,0);wingR.position.set(.15,.95,0);mesh.add(wingL,wingR);parts.push(wingL,wingR)}
  }else{mesh=new THREE.Mesh(enemyGeo(type),emat);mesh.castShadow=true;parts=[mesh]}
  mesh.scale.setScalar(sc);mesh.position.set(x,0,z);level.add(mesh);
  const hp=D.hp*S.hp*(elite?5:1)*(ms<1?ms*1.1:1+(ms-1)*.9);
  const e={type,x,z,r:D.r*(elite?1.25:1)*ms,hp,maxHp:hp,speed:D.speed*rand(.9,1.1)*(elite?.9:1)*(ms<1?1.25:1/(1+(ms-1)*.25))*(S.spd||1),dmg:D.dmg*S.dmg*(elite?1.5:1)*(ms<1?.6:1+(ms-1)*.8),h:D.h*sc,sc,color:D.color,mesh,mat:emat,parts,legL,legR,wingL,wingR,mini:!!(opts&&opts.mini),miniPh:(opts&&opts.mini)?rand(0,TAU):0,walk:rand(0,TAU),
    kx:0,kz:0,cd:rand(.4,1.2),t:rand(0,10),face:0,flash:0,side:Math.random()<.5?-1:1,wind:0,elite:!!elite,xp:D.xp*(elite?8:1),fly:!!D.fly,orbCd:0,dead:false,atk:0};
  enemies.push(e);return e;
}
function spawnBoss(){
  const SC=scaleT();bossCount++;const a=player.facing+rand(-.6,.6);let x=player.x+Math.sin(a)*14,z=player.z+Math.cos(a)*14;
  for(let i=0;i<20&&collide(x,z,1);i++){const b=rand(0,TAU);x=player.x+Math.sin(b)*14;z=player.z+Math.cos(b)*14}
  const cyc=bossCount%3,isSlime=cyc===2,isOgre=cyc===0; // 1º Golem, 2º Rei do Slime, 3º Ogro — em ciclo
  let mdl;
  if(isSlime){const body=new THREE.Mesh(enemyGeo('slime'),vcMat);body.castShadow=true;const g=new THREE.Group();g.add(body);mdl={root:collect(g)}} // o slime comum, ampliado 4.4×
  else mdl=isOgre?buildOgre():buildGolem();
  const obj=new THREE.Group();obj.add(mdl.root);obj.position.set(x,0,z);level.add(obj);
  const hp=(isSlime?1150:(isOgre?950:1100))*(1+.8*(bossCount-1))*(1+runTime/600);
  const type=isSlime?'slimeking':isOgre?'ogre':'golem';
  boss={type,x,z,r:isSlime?1.5:1,hp,maxHp:hp,speed:isSlime?3.2:(isOgre?2.9:2.6),dmg:(isSlime?25:(isOgre?27:24))*SC.dmg,h:3,sc:isSlime?4.4:1,color:isSlime?0x5fcf5a:isOgre?0x7aa84a:0x6e6578,obj,mdl,kx:0,kz:0,cd:1,t:0,face:0,faceT:0,flash:0,mode:'chase',phaseT:2.5,boss:true,xp:60,orbCd:0,dead:false};
  enemies.push(boss);$('#bossbar').hidden=false;$('#bossbar').querySelector('span').textContent=isSlime?'REI DO SLIME':isOgre?'OGRO BRUTAMONTES':'GOLEM DO CAMPO';
  toast(isSlime?'O Rei do Slime apareceu':isOgre?'O Ogro apareceu':'O Golem chegou',isSlime?'Ao cair, o bando inteiro escapa':isOgre?'Cuidado com as bastonadas no chão':'Ele fica mais bravo com metade da vida');addShake(.4);S('bossin');
}
function handleBossDeath(e){
  S('bossdie');hitStop(.16);
  for(let i=0;i<12;i++)dropGem(e.x+rand(-2,2),e.z+rand(-2,2),5);dropGem(e.x,e.z,40);
  for(let i=0;i<3;i++)dropPickup(e.x+rand(-1.5,1.5),e.z+rand(-1.5,1.5),'heart');
  for(let i=0;i<10;i++)dropPickup(e.x+rand(-1.8,1.8),e.z+rand(-1.8,1.8),'coin',randi(3,6)); // chuva de moedas
  addShake(.6);$('#bossbar').hidden=true;boss=null;bossKills++;
  if(e.type==='ogre'){ogreLoose=true;toast('Ogro derrotado!','Agora ogros vagam pelo campo...')}
  else if(e.type==='slimeking'){toast('Rei do Slime derrotado!','O bando de slimes menores escapou...');
    for(let i=0;i<12;i++){const a=i/12*TAU+rand(-.25,.25),dd=2.4+rand(0,1.8),sx=e.x+Math.sin(a)*dd,sz=e.z+Math.cos(a)*dd;if(!collide(sx,sz,.4)){const mm=spawnEnemy('slime',sx,sz,false,{ms:.55,mini:true});if(mm){mm.kx=Math.sin(a)*4;mm.kz=Math.cos(a)*4}}}}
  else toast('Golem derrotado!','O próximo vai ser mais forte');
  if(!store.get('cv_unlocked',{}).demon&&metaStat().bosses+bossKills>=MISSION.demon.goal){doUnlock('demon');toast('😈 '+CLASSES.demon.nome+' liberado!','Missão cumprida: '+MISSION.demon.goal+' Golens derrotados')}
}
function checkBossSpawn(){const t=runTime;if(t>=nextBoss&&!moonOn){nextBoss+=240;if(!boss)spawnBoss()}}
function pickType(){const t=runTime,w=[['slime',5],['bat',t>15?3:0],['spider',t>30?3:0],['zombie',t>40?4:0],['slimeB',t>80?3:0],['skel',t>100?2:0],['brute',t>160?1:0],['ogre',ogreLoose?2:0]];
  let tot=0;for(const x of w)tot+=x[1];let r=Math.random()*tot;for(const x of w){r-=x[1];if(r<=0)return x[0]}return'slime'}
function spawnPos(dmin,dmax){for(let i=0;i<12;i++){const a=rand(0,TAU),d=rand(dmin,dmax),x=player.x+Math.sin(a)*d,z=player.z+Math.cos(a)*d;if(!collide(x,z,.5))return[x,z]}return null}
function director(dt){
  const t=runTime,rate=Math.min(8,1.1+t/28),maxAlive=Math.min(isTouch?95:130,32+t*.38);
  spawnAcc+=rate*dt;while(spawnAcc>=1){spawnAcc--;if(enemies.length<maxAlive){const p=spawnPos(18,25);if(p){const el=t>150&&Math.random()<Math.min(.07,(t-150)/2500);spawnEnemy(pickType(),p[0],p[1],el)}}}
  if(t>=nextHorde&&!moonOn&&!boss){hordeN++;const SA=scaleT();nextHorde+=60;const n0=14+hordeN*5,n=n0+(SA.extra>.03?Math.round(n0*SA.extra):0),tp=pickType();toast('Horda '+hordeN,'Estão te cercando');addShake(.15);
    for(let i=0;i<n;i++){const a=i/n*TAU,d=15+rand(0,2.5),x=player.x+Math.sin(a)*d,z=player.z+Math.cos(a)*d;if(!collide(x,z,.4))spawnEnemy(i%5===0?pickType():tp,x,z,hordeN>=4&&i%17===0)}}
  checkBossSpawn();
}

/* ================= projéteis, cristais, coletáveis ================= */
function spawnProj(o){
  const m=new THREE.Mesh(PROJ_GEO[o.kind],projMat);m.position.set(o.x,o.y!=null?o.y:.62,o.z);m.rotation.y=o.a;if(o.mScale)m.scale.setScalar(o.mScale);fxGroup.add(m);
  projs.push(Object.assign({r:.2,life:1.6,pierce:0,y:.62},o,{vx:Math.sin(o.a)*o.speed,vz:Math.cos(o.a)*o.speed,g:m,hit:new Set()}));
  if(o.owner==='e')S('bone');else S('shot',o.kind);
}
const GEM_MAX=900;let gemMesh=null,gems=[];
const orbGeo=new THREE.IcosahedronGeometry(1,1);
// Verde sólido no próprio material (sem cor por instância, que saía preta em algumas GPUs). Tamanho distingue o valor.
function makeGems(){gemMesh=new THREE.InstancedMesh(orbGeo,new THREE.MeshBasicMaterial({color:0x6fe05a}),GEM_MAX);gemMesh.count=0;gemMesh.frustumCulled=false;fxGroup.add(gemMesh)}
function dropGem(x,z,v){if(gems.length>=GEM_MAX){const g=gems[Math.floor(Math.random()*gems.length)];g.v+=v;return}gems.push({x:x+rand(-.3,.3),z:z+rand(-.3,.3),v,t:rand(0,6),pull:false,vac:false,pt:0})}
const gm4=new THREE.Matrix4(),gq=new THREE.Quaternion(),gp=new THREE.Vector3(),gs=new THREE.Vector3(),ge=new THREE.Euler();
function updGems(dt){
  const mag=2.4*player.stats.magnet;
  for(let i=gems.length-1;i>=0;i--){const g=gems[i];g.t+=dt;const dx=player.x-g.x,dz=player.z-g.z,d=Math.hypot(dx,dz);
    if(d<mag||g.vac)g.pull=true;else if(d>mag*2.2)g.pull=false;
    if(g.pull){g.pt+=dt;const sp=Math.min(28,7+g.pt*22);g.x+=dx/d*sp*dt;g.z+=dz/d*sp*dt}else g.pt=0;
    if(d<.6&&player.y<1.4){S('gem');gainXP(g.v);if(Math.random()<.5)burst(g.x,.3,g.z,0x9af07a,2,{emi:1,speed:1.5,up0:.5,up1:2,life:.3,size:.07});gems[i]=gems[gems.length-1];gems.pop()}}
  gemMesh.count=gems.length;
  for(let i=0;i<gems.length;i++){const g=gems[i],big=g.v>=5,s=(g.v>=20?.32:big?.22:.14)*(1+Math.sin(g.t*5)*.12);ge.set(0,g.t*2,0);gq.setFromEuler(ge);gm4.compose(gp.set(g.x,g.pull?.45:s+.02,g.z),gq,gs.set(s,s,s));gemMesh.setMatrixAt(i,gm4)}
  gemMesh.instanceMatrix.needsUpdate=true;
}
function dropPickup(x,z,type,v){const g=new THREE.Group();g.position.set(x,.5,z);
  if(type==='heart'){const c=0xe5473c;vox(g,-.08,.06,0,.14,.14,.1,c,.5);vox(g,.08,.06,0,.14,.14,.1,c,.5);vox(g,0,-.04,0,.24,.12,.1,c,.5);vox(g,0,-.12,0,.1,.08,.1,c,.5)}
  else if(type==='coin'){vox(g,0,0,0,.26,.26,.07,0xf2b84b,.35);vox(g,0,0,.04,.14,.14,.02,0xffe9a0,.5);vox(g,0,0,-.04,.14,.14,.02,0xd89a2a,.3)} // moeda dourada
  else{vox(g,-.12,0,0,.08,.3,.1,0xd23b2f,.4);vox(g,.12,0,0,.08,.3,.1,0xd23b2f,.4);vox(g,0,-.12,0,.32,.08,.1,0xd23b2f,.4);vox(g,-.12,.17,0,.08,.06,.1,0xeeeeee,.5);vox(g,.12,.17,0,.08,.06,.1,0xeeeeee,.5)}
  fxGroup.add(g);pickups.push({x,z,g,t:rand(0,5),type,v:v||1,pt:0})}

/* ================= efeitos ================= */
function burst(x,y,z,color,n,o={}){
  const sp=o.speed||3.5,sz=o.size||.12,life=o.life||.6;
  for(let i=0;i<n;i++){
    if(parts.length>300){const old=parts.shift();fxGroup.remove(old.m)}
    const m=new THREE.Mesh(boxGeo,mat(color,o.emi||0));const s=sz*rand(.6,1.3);m.scale.setScalar(s);m.position.set(x+rand(-.12,.12),y,z+rand(-.12,.12));fxGroup.add(m);
    const a=rand(0,TAU),v=rand(.3,1)*sp;
    parts.push({m,vx:Math.sin(a)*v,vz:Math.cos(a)*v,vy:rand(o.up0!=null?o.up0:1,o.up1!=null?o.up1:4),life:life*rand(.7,1.2),t:0,grav:o.grav!=null?o.grav:14,s})
  }
}
function addFx(obj,life,upd){fxGroup.add(obj);fxs.push({obj,life,t:0,upd})}
function disposeFx(f){fxGroup.remove(f.obj);f.obj.traverse(o=>{if(o.isMesh&&o.userData.own){o.material.dispose();if(o.userData.ownGeo)o.geometry.dispose()}})}
function flatMesh(geo,color,op){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:op,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.userData.own=true;return m}
function ringFX(x,z,R,color,life=.4){const g=new THREE.Group();g.position.set(x,.08,z);const m=flatMesh(ringGeo,color,.8);g.add(m);
  addFx(g,life,k=>{const s=lerp(.3,R,1-Math.pow(1-k,3));g.scale.set(s,1,s);m.material.opacity=.8*(1-k)})}
function swingFX(range,arc,a,color){const g=new THREE.Group();g.position.set(player.x,.55+player.y,player.z);g.rotation.y=a;
  const inner=Math.max(.45,range*.86);
  const geo=new THREE.RingGeometry(inner,range,28,1,-Math.PI/2-arc/2,arc);const m=flatMesh(geo,color,.7);m.userData.ownGeo=true;g.add(m);
  const edge=new THREE.RingGeometry(range*.985,range,32,1,-Math.PI/2-arc/2,arc);const m2=flatMesh(edge,0xffffff,.55);m2.position.y=.006;m2.userData.ownGeo=true;g.add(m2);
  addFx(g,.2,k=>{m.material.opacity=.7*(1-k);m2.material.opacity=.55*(1-k);g.scale.setScalar(.82+.18*k)})}
// Pancada do Brom: anel duplo, clarão rasteiro e detritos de aço/azul.
function slamFX(x,z,R){
  ringFX(x,z,R,0x9fc4ff,.34);
  ringFX(x,z,R*.76,0xd7e8ff,.27);
  const g=new THREE.Group();g.position.set(x,.07,z);
  const m=flatMesh(discGeo,0xbfd9ff,.18);g.add(m);g.scale.setScalar(.78);
  addFx(g,.26,k=>{m.material.opacity=.18*(1-k);g.scale.setScalar(.78+.28*k)});
  burst(x,.12,z,0x8b95a3,14,{speed:5.5,up0:.5,up1:2.7,size:.11});
  burst(x,.12,z,0x6fa8ff,9,{emi:.65,speed:4.2,up0:.3,up1:1.5,life:.3,size:.055});
}
// Baluarte: três anéis de comando e faíscas subindo do escudo.
function baluarteFX(x,z,R){
  ringFX(x,z,R,0x7fb2ff,.5);
  ringFX(x,z,R*.74,0xd7e8ff,.38);
  ringFX(x,z,R*.45,0xbfe4ff,.28);
  burst(x,.2,z,0x8b95a3,24,{speed:6,up0:1,up1:3});
  burst(x,.7,z,0x6fa8ff,18,{emi:.7,speed:4.8,up0:.8,up1:2.8});
}
function telegraph(x,z,R,time){const g=new THREE.Group();g.position.set(x,.04,z);const ring=flatMesh(ringGeo,0xff3a2a,.75);ring.scale.set(R,R,1);const disc=flatMesh(discGeo,0xff3a2a,.22);g.add(ring,disc);
  addFx(g,time,k=>{const s=R*k;disc.scale.set(s,s,1);ring.material.opacity=.45+.35*Math.sin(k*20)})}
function lineTelegraph(x,z,ux,uz,len,time){const g=new THREE.Group();g.position.set(x+ux*len/2,.05,z+uz*len/2);g.rotation.y=Math.atan2(ux,uz);
  const m=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xff3a2a,transparent:true,opacity:.3,depthWrite:false}));m.userData.own=true;m.scale.set(2,.02,len);g.add(m);
  addFx(g,time,k=>{m.material.opacity=.2+.25*Math.sin(k*18)})}
function boltFX(x,z){const g=new THREE.Group();g.position.set(x,0,z);const m=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xe6f6ff,transparent:true,opacity:1}));m.userData.own=true;m.scale.set(.28,10,.28);m.position.y=5;g.add(m);
  const m2=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0x7fc8ff,transparent:true,opacity:.5,depthWrite:false}));m2.userData.own=true;m2.scale.set(.7,10,.7);m2.position.y=5;g.add(m2);
  addFx(g,.2,k=>{m.material.opacity=1-k;m2.material.opacity=.5*(1-k);m.scale.x=m.scale.z=.28*(1-k*.6)});ringFX(x,z,1.2,0xbfe4ff,.25);burst(x,.3,z,0xd6f3ff,8,{emi:1,speed:4})}
function dmgText(x,y,z,txt,cls){if(texts.length>32){const o=texts.shift();o.el.remove()}const el=document.createElement('div');el.className='dn '+(cls||'');el.textContent=txt;$('#dmg').appendChild(el);texts.push({el,x:x+rand(-.25,.25),y,z,t:0})}
let toastT=0;function toast(t,sub){const el=$('#toast');el.innerHTML='';el.append(t);if(sub){const s=document.createElement('small');s.textContent=sub;el.append(s)}el.classList.add('show');toastT=2.4}
function addShake(v){if(!reduceMotion)shake=Math.max(shake,v)}

/* ================= combate ================= */
function roll(base){let d=base*player.stats.dmg*rand(.9,1.1);const crit=Math.random()<player.stats.crit;if(crit)d*=player.stats.critDmg;return{d,crit}}
function damageEnemy(e,amt,crit,kx=0,kz=0,quiet){
  if(e.dead)return;
  e.hp-=amt;runDealt+=amt;e.flash=.08;const kb=e.boss?.08:e.type==='brute'||e.elite?.4:1;e.kx+=kx*kb;e.kz+=kz*kb;
  if(!quiet){S('hit',!!crit);const chill=player.stats.chill;
    if(chill&&!e.boss){const cf=1-.2*chill;if((e.slowF||1)>cf)e.slowF=cf;e.slowT=Math.max(e.slowT||0,.5+.2*chill)}}
  if(!quiet||crit)dmgText(e.x,e.h+.2,e.z,Math.round(amt),crit?'crit':'');
  if(player.stats.ls>0)healPlayer(amt*player.stats.ls*(quiet ? .4 : 1),true);
  if(e.hp<=0)killEnemy(e);
}
function killEnemy(e){
  e.dead=true;if(e.boss)level.remove(e.obj);else level.remove(e.mesh);kills++;if(!moonOn&&!boss&&moonCd<=0&&hordeN>=3&&aiSkill>.62){moonKills++;if(moonKills>=80)bloodMoon()}
  if(!store.get('cv_unlocked',{}).pistol&&kills>=MISSION.pistol.goal){doUnlock('pistol');toast('🔫 '+CLASSES.pistol.nome+' liberado!','Missão cumprida: '+MISSION.pistol.goal+' abates numa corrida')}
  burst(e.x,e.h*.5,e.z,e.color,e.boss?50:7,{speed:e.boss?7:4,size:e.boss?.22:.13,life:.7});
  if(e.boss){handleBossDeath(e);}
  else{S('kill');killStop(e.type==='brute'||e.elite?.05:.04);dropGem(e.x,e.z,e.xp);const r=Math.random();
    if(r<.022)dropPickup(e.x,e.z,'heart'); // íma: saiu do drop dos bichos — agora é totem fixo no mapa
    if(Math.random()<(e.elite?1:.16))dropPickup(e.x,e.z,'coin',e.elite?randi(3,6):randi(1,2))} // moeda no chão
  if(e.type==='skel'){runSkel++; // missão do Necromante: abater esqueletos no total
    if(!store.get('cv_unlocked',{}).necro&&metaStat().skelKills+runSkel>=MISSION.necro.goal){doUnlock('necro');toast('💀 '+CLASSES.necro.nome+' liberado!','Missão cumprida: '+MISSION.necro.goal+' esqueletos abatidos')}}
  if(e.type==='bat'){runBat++; // missão do Drácula: abater morcegos no total
    if(!store.get('cv_unlocked',{}).dracula&&metaStat().batKills+runBat>=MISSION.dracula.goal){doUnlock('dracula');toast('🧛 '+CLASSES.dracula.nome+' liberado!','Missão cumprida: '+MISSION.dracula.goal+' morcegos abatidos')}}
  const i=enemies.indexOf(e);if(i>=0){enemies[i]=enemies[enemies.length-1];enemies.pop()}
}
function healPlayer(a,quiet){const before=player.hp;player.hp=Math.min(player.maxHp,player.hp+a);if(!quiet&&player.hp-before>=1)dmgText(player.x,1.6+player.y,player.z,'+'+Math.round(player.hp-before),'heal')}
function hurtPlayer(amt,src,contact){
  if(state!=='play'||player.invuln>0||player.hp<=0||cheatGod)return;
  let a=amt*(1-player.stats.armor);if(player.shieldT>0)a*=.15;
  player.hp-=a;player.invuln=.5;player.flash=.12;hurtA=Math.min(1,.35+a/player.maxHp*3);addShake(.2);S('hurt');
  runDmg+=a; // missão do Tank: receber bastante dano numa corrida
  if(!store.get('cv_unlocked',{}).tank&&runDmg>=MISSION.tank.goal){doUnlock('tank');toast('🛡️ '+CLASSES.tank.nome+' liberado!','Missão cumprida: '+MISSION.tank.goal+' de dano recebido')}
  dmgText(player.x,1.5+player.y,player.z,'-'+Math.round(a),'hurt');burst(player.x,.7+player.y,player.z,0xe5473c,5,{speed:3});
  if(src&&contact&&player.stats.thorns>0&&!src.dead)damageEnemy(src,amt*player.stats.thorns,false,0,0,true);
  if(player.hp<=0)die();
}
function gainXP(v){player.xp+=v*player.stats.xpMul;while(player.xp>=player.xpNeed){player.xp-=player.xpNeed;player.lvl++;player.xpNeed=xpNeed(player.lvl);pendingUps++;S('level')}
  if(!store.get('cv_unlocked',{}).future&&player.lvl>=MISSION.future.goal){doUnlock('future');toast('🛸 '+CLASSES.future.nome+' liberado!','Missão cumprida: nível '+MISSION.future.goal+' alcançado')}
  if(pendingUps>0&&state==='play'){upSource='lvl';openUpgrade()}}
const xpNeed=l=>Math.floor(5+l*3.2+l*l*.35);

/* ================= ataques automáticos ================= */
function nearest(range){let b=null,bd=range;for(const e of enemies){const d=Math.hypot(e.x-player.x,e.z-player.z)-e.r;if(d<bd){bd=d;b=e}}return b}
function autoAttack(){
  const C=CLASSES[player.cls],st=player.stats;if(player.atkCd>0||player.spinT>0)return;
  if(C.kind==='proj'){const t=nearest(C.range);if(!t)return;player.atkCd=C.atkCd/st.atkSpd;player.atkAnim=1;
    const sp=C.projSpeed*st.pspd;
    const lead=Math.hypot(t.x-player.x,t.z-player.z)/sp;const tx=t.x+(t.mvx||0)*lead,tz=t.z+(t.mvz||0)*lead;const a=Math.atan2(tx-player.x,tz-player.z);player.aimAng=a;
    let big=false;if(player.cls==='mago'){player.orbN=(player.orbN||0)+1;big=player.orbN%4===0}const n=1+st.multi;for(let i=0;i<n;i++){const aa=a+(i-(n-1)/2)*.15;const borb=big&&i===0;const r=roll(C.dmg*(borb?1.7:1));
      spawnProj({x:player.x+Math.sin(aa)*.45,z:player.z+Math.cos(aa)*.45,y:.7+player.y,a:aa,speed:sp,dmg:r.d,crit:r.crit,owner:'p',kind:C.proj,pierce:C.pierce+st.pierce,r:C.proj==='fire'?(borb?.4:.26):.22,mScale:borb?1.55:1,big:borb,life:C.range/sp+.15})}
    if(player.cls==='arqueiro')burst(player.x+Math.sin(a)*.52,.8+player.y,player.z+Math.cos(a)*.52,0x7fcf5a,3,{emi:.45,speed:1.8,up0:.1,up1:.8,life:.18,size:.055})}
  else if(C.kind==='melee'){const R=C.range*st.area,t=nearest(R+.6);if(!t)return;player.atkCd=C.atkCd/st.atkSpd;player.atkAnim=1;const a=Math.atan2(t.x-player.x,t.z-player.z);player.aimAng=a;let hit=false;
    for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d>R+e.r)continue;if(Math.abs(angDiff(a,Math.atan2(dx,dz)))>C.arc/2&&d>e.r+.45)continue;const r=roll(C.dmg);damageEnemy(e,r.d,r.crit,dx/d*C.knock*st.kb,dz/d*C.knock*st.kb);hit=true}
    if(player.cls==='guerreiro')swingFX(R,C.arc,a,0xff5a42);else swingFX(R,C.arc,a,0xffffff);
    if(hit){if(player.cls==='guerreiro')burst(player.x+Math.sin(a)*.95,.78+player.y,player.z+Math.cos(a)*.95,0xffb08a,5,{emi:.45,speed:2.8,up0:.2,up1:1.4,life:.22,size:.06});addShake(.06);S('melee');hitStop(.03)}}
  else{const R=C.radius*st.area,t=nearest(R);if(!t)return;player.atkCd=C.atkCd/st.atkSpd;player.atkAnim=1;player.aimAng=Math.atan2(t.x-player.x,t.z-player.z);
    for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(C.dmg);damageEnemy(e,r.d,r.crit,dx/d*C.knock*st.kb,dz/d*C.knock*st.kb)}}
    if(player.cls==='tank')slamFX(player.x,player.z,R);else{ringFX(player.x,player.z,R,0x9fc4ff,.35);burst(player.x,.15,player.z,0x8b7a66,10,{speed:5,up0:.5,up1:2.5})}
    addShake(.12);S('melee');hitStop(.03)}
}
function useAbility(){
  if(state!=='play'||player.abCd>0)return;const C=CLASSES[player.cls],st=player.stats;player.abCd=C.ab.cd*st.cdr;player.atkAnim=1;S('ability');
  if(player.cls==='mago'){const R=4.5*st.area;for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(C.dmg*2.5);damageEnemy(e,r.d,r.crit,dx/d*13*st.kb,dz/d*13*st.kb);e.slowT=Math.max(e.slowT||0,2);e.slowF=.55}}
    ringFX(player.x,player.z,R,0x8fe1ff,.5);ringFX(player.x,player.z,R*.7,0xd6f3ff,.4);ringFX(player.x,player.z,R*.4,0xbfa8ff,.3);burst(player.x,.6,player.z,0x8fe1ff,36,{emi:1,speed:7.5,up0:.5,up1:3});burst(player.x,.6,player.z,0xd6f3ff,14,{emi:1,speed:4,up0:1,up1:3});addShake(.3)}
  else if(player.cls==='arqueiro'){const t=nearest(18);const a0=t?Math.atan2(t.x-player.x,t.z-player.z):player.facing;player.aimAng=a0;
    for(let i=0;i<9;i++){const aa=a0+(i-4)*.12;const r=roll(C.dmg*1.2);spawnProj({x:player.x+Math.sin(aa)*.45,z:player.z+Math.cos(aa)*.45,y:.7+player.y,a:aa,speed:C.projSpeed*st.pspd,dmg:r.d,crit:r.crit,owner:'p',kind:'arrow',pierce:3+st.pierce,life:.8})}
    ringFX(player.x,player.z,1.55,0x7fcf5a,.24);
    burst(player.x,.8,player.z,0x7fcf5a,18,{emi:.65,speed:5.2,up0:.5,up1:2.1});
    burst(player.x,.8,player.z,0xd23b2f,6,{emi:.25,speed:3.4,up0:.4,up1:1.6});addShake(.16)}
  else if(player.cls==='guerreiro'){player.spinT=1.5;player.spinTick=0;
    ringFX(player.x,player.z,2.4*st.area,0xff6a55,.3);
    burst(player.x,.72,player.z,0xffb08a,16,{emi:.55,speed:4.5,up0:.4,up1:2});
    burst(player.x,.72,player.z,0xd23b2f,5,{emi:.25,speed:3.2,up0:.3,up1:1.5});addShake(.18)}
  else if(player.cls==='tank'){player.shieldT=4;const R=3.6*st.area;for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(30);damageEnemy(e,r.d,r.crit,dx/d*16*st.kb,dz/d*16*st.kb)}}
    baluarteFX(player.x,player.z,R);addShake(.35)}
  else if(player.cls==='necro'){for(let i=0;i<3;i++)summonMinion();for(const m of minions)m.hp=m.maxHp;
    ringFX(player.x,player.z,3*st.area,0x7ee0a8,.45);burst(player.x,.6,player.z,0x7ee0a8,24,{emi:1,speed:6,up0:.5,up1:3});addShake(.2)}
  else if(player.cls==='chrono'){const R=7*st.area;for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){e.slowT=Math.max(e.slowT||0,3.5);e.slowF=.1;const r=roll(C.dmg*1.5);damageEnemy(e,r.d,r.crit,0,0,true)}}
    ringFX(player.x,player.z,R,0x9fe8ff,.5);ringFX(player.x,player.z,R*.65,0xe9d58a,.4);burst(player.x,.5,player.z,0x9fe8ff,28,{emi:1,speed:6,up0:.5,up1:3});addShake(.2)}
  else if(player.cls==='demon'){const R=5.5*st.area;for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(C.dmg*2);damageEnemy(e,r.d,r.crit,dx/d*13*st.kb,dz/d*13*st.kb)}}
    ringFX(player.x,player.z,R,0xff6a2a,.55);ringFX(player.x,player.z,R*.6,0xffb04a,.45);burst(player.x,.5,player.z,0xff6a2a,32,{emi:1,speed:7,up0:.5,up1:3.5});
    for(let i=0;i<10;i++)burst(player.x+rand(-1.5,1.5),.3,player.z+rand(-1.5,1.5),0x7a1a0a,2,{emi:.6,speed:3,up0:1,up1:3});addShake(.3)}
  else if(player.cls==='future'){const t=nearest(16),a=t?Math.atan2(t.x-player.x,t.z-player.z):player.facing;player.aimAng=a;
    let tx=player.x,tz=player.z;for(let s=.6;s<=7;s+=.5){const qx=player.x+Math.sin(a)*s,qz=player.z+Math.cos(a)*s;if(collide(qx,qz,player.r))break;tx=qx;tz=qz}
    burst(player.x,.6+player.y,player.z,0x3bf0d0,18,{emi:1,speed:5}); // some do ponto de saída
    player.x=tx;player.z=tz;player.invuln=Math.max(player.invuln,.6);camFx=tx;camFz=tz;
    const R=2.8*st.area;for(const e of enemies.slice()){const d=Math.hypot(e.x-tx,e.z-tz)||.01;if(d<R+e.r){const r=roll(C.dmg*1.9);damageEnemy(e,r.d,r.crit,(e.x-tx)/d*9*st.kb,(e.z-tz)/d*9*st.kb)}}
    ringFX(tx,tz,R,0x3bf0d0,.5);burst(tx,.6,tz,0x1affd8,26,{emi:1,speed:6,up0:.5,up1:3});addShake(.25)}
  else if(player.cls==='king'){for(let i=0;i<4;i++)summonMinion('soldier');
    ringFX(player.x,player.z,3*st.area,0xf2c14b,.45);burst(player.x,.6,player.z,0xf2c14b,24,{emi:1,speed:6,up0:.5,up1:3});addShake(.2)}
  else if(player.cls==='human'){const t=nearest(14),a0=t?Math.atan2(t.x-player.x,t.z-player.z):player.facing;player.aimAng=a0;
    for(let i=0;i<3;i++){const aa=a0+(i-1)*.14;const r=roll(C.dmg*1.2);spawnProj({x:player.x+Math.sin(aa)*.45,z:player.z+Math.cos(aa)*.45,y:.7+player.y,a:aa,speed:C.projSpeed*st.pspd,dmg:r.d,crit:r.crit,owner:'p',kind:'rock',pierce:st.pierce,r:.2,life:1.3})}
    burst(player.x,.7,player.z,0x9a9a94,6,{speed:3});addShake(.08)}
  else if(player.cls==='dracula'){const R=5*st.area;let dealt=0;
    for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(C.dmg*1.6);damageEnemy(e,r.d,r.crit,dx/d*6*st.kb,dz/d*6*st.kb);dealt+=r.d}}
    if(dealt>0)healPlayer(Math.min(player.maxHp*.25,dealt*.18)); // cura forte, mas não enche a vida inteira numa horda
    ringFX(player.x,player.z,R,0x9c1f3a,.5);ringFX(player.x,player.z,R*.6,0xc23a55,.4);burst(player.x,.6,player.z,0x7a1024,26,{emi:.5,speed:6,up0:.5,up1:3});
    for(let i=0;i<12;i++)burst(player.x+rand(-1.2,1.2),.7+player.y,player.z+rand(-1.2,1.2),0x2a1f38,2,{emi:.3,speed:3,up0:.5,up1:2});addShake(.2)}
  else if(player.cls==='pistol'){const near=enemies.slice().map(e=>({e,d:Math.hypot(e.x-player.x,e.z-player.z)})).filter(o=>!o.e.dead&&o.d<16).sort((a,b)=>a.d-b.d).slice(0,6);
    if(near[0])player.aimAng=Math.atan2(near[0].e.x-player.x,near[0].e.z-player.z);
    for(const o of near){const e=o.e,a=Math.atan2(e.x-player.x,e.z-player.z),r=roll(C.dmg*2.2);damageEnemy(e,r.d,true,Math.sin(a)*5,Math.cos(a)*5);
      burst(e.x,.6,e.z,0xffe08a,6,{emi:1,speed:3});ringFX(e.x,e.z,.6,0xffd27a,.2)}
    burst(player.x+Math.sin(player.aimAng)*.5,.8+player.y,player.z+Math.cos(player.aimAng)*.5,0xfff4c8,10,{emi:1,speed:5});addShake(.22)}
}
function dash(){
  if(player.dashCd>0||player.dashT>0)return;let dx=moveVec.x,dz=moveVec.z;if(Math.hypot(dx,dz)<.1){dx=Math.sin(player.facing);dz=Math.cos(player.facing)}
  const l=Math.hypot(dx,dz);player.dvx=dx/l*18;player.dvz=dz/l*18;player.dashT=.17;player.dashCd=1.1*player.stats.dashCd;player.invuln=Math.max(player.invuln,.3);
  burst(player.x,.3,player.z,0xcfc7b0,8,{speed:2,up0:.2,up1:1.5});S('dash');
}
function jump(){if(player.y<=.001&&state==='play'){player.vy=8;burst(player.x,.1,player.z,0xb59a6a,5,{speed:2,up0:.3,up1:1.2});S('jump')}}
// armas: cada arma vive em assets/js/weapons/ e recebe o contexto C do motor
function updWeapons(dt){
  const C={player,enemies,wGroup,THREE,PROJ_GEO,projMat,roll,damageEnemy,spawnProj,nearest,burst,flatMesh,S,boltFX,rand,pick,vox,runTime,TAU};
  for(const k in WEAPONS)if(player.weap[k]>0&&WEAPON_UPDATERS[k])WEAPON_UPDATERS[k](dt,C);
}

/* ===== necromante: horda de esqueletos ===== */
let minions=[],minSummonT=1;
const minMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:new THREE.Color(0x2f8f4a),emissiveIntensity:.55});
// soldado real (guarda do Rei): humanoide de aço com elmo e emblema dourado
const SOLDIER_GEO=mergeBoxes(humanoid({legs:0x5a4433,body:0x8b95a3,trim:0xf2c14b,skin:0xe0b088,arm:0x8b95a3,eye:0x2a2018},{extra:[[0,1.14,0,.3,.08,.3,0x6d7682],[0,1.22,0,.06,.1,.06,0xf2c14b],[0,.56,.16,.1,.14,.02,0xf2c14b]]}));
const soldierMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:new THREE.Color(0x3a2e10),emissiveIntensity:.2});
// monta o mesh de um minion (sold: soldado real do Midas; senão esqueleto necromante do Necronus)
function buildMinionMesh(sold){
  const boxes=sold?humanoid({legs:0x5a4433,body:0x8b95a3,trim:0xf2c14b,skin:0xe0b088,arm:0x8b95a3,eye:0x2a2018},{extra:[[0,1.14,0,.3,.08,.3,0x6d7682],[0,1.22,0,.06,.1,.06,0xf2c14b],[0,.56,.16,.1,.14,.02,0xf2c14b]]}):ENEMY_BOXES['skel']();
  const mm=sold?soldierMat:minMat,g=new THREE.Group();
  g.add(new THREE.Mesh(mergeBoxes(boxes.slice(2)),mm));                          // corpo sem as pernas
  // esqueleto usa as mesmas pernas finas de osso do inimigo (fêmur/tíbia/pé); soldado mantém bota grossa
  const skelLeg=(typeof ENEMY_DEFS!=='undefined'&&ENEMY_DEFS.skel&&ENEMY_DEFS.skel.leg)||[[0,-.12,0,.055,.17,.055,0x8f8f8f],[0,-.27,0,.05,.14,.05,0x8f8f8f],[0,-.325,.03,.06,.05,.13,0x9b9b9b]];
  const lgeo=mergeBoxes(sold?[[0,-.17,0,.16,.34,.18,0x5a4433]]:skelLeg);         // perna com pivô no quadril
  const legL=new THREE.Mesh(lgeo,mm);legL.position.set(-.11,.34,0);g.add(legL);
  const legR=new THREE.Mesh(lgeo,mm);legR.position.set(.11,.34,0);g.add(legR);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.scale.setScalar(sold?.86:.82);
  return{g,legL,legR}}
function summonMinion(type){
  if(minions.length>=8)return;
  const a=rand(0,TAU),x=player.x+Math.sin(a)*rand(.9,1.7),z=player.z+Math.cos(a)*rand(.9,1.7);
  if(collide(x,z,.3))return;
  const sold=type==='soldier',{g,legL,legR}=buildMinionMesh(sold);
  fxGroup.add(g);
  const hp=sold?70:45;
  minions.push({x,z,y:0,r:.3,hp,maxHp:hp,t:rand(0,6),atkCd:0,face:a,mesh:g,legL,legR,anim:0,sold});
  burst(x,.5,z,sold?0xf2c14b:0x7ee0a8,12,{emi:.9,speed:3,up0:.6,up1:2.4});
}
function clearMinions(){for(const m of minions)if(m.mesh&&m.mesh.parent)m.mesh.parent.remove(m.mesh);minions=[]}
function updateMinions(dt){
  const dmgMul=player.stats.dmg*(player.minDmg||1);
  for(let i=0;i<minions.length;i++)for(let j=i+1;j<minions.length;j++){const A=minions[i],B=minions[j]; // separação: não atravessar um ao outro
    const dx=B.x-A.x,dz=B.z-A.z,rr=A.r+B.r+.06,d2=dx*dx+dz*dz;if(d2>=rr*rr)continue;
    const d=Math.sqrt(d2)||.001,p=(rr-d)/d*.25;moveEnt(A,-dx*p,-dz*p);moveEnt(B,dx*p,dz*p)}
  for(let i=minions.length-1;i>=0;i--){const m=minions[i];m.t+=dt;m.atkCd-=dt;m.anim=Math.max(0,m.anim-dt*4);
    let tgt=null,bd=14;for(const e of enemies){const d=Math.hypot(e.x-m.x,e.z-m.z);if(d<bd){bd=d;tgt=e}}
    let moving=false;
    if(tgt){const dx=tgt.x-m.x,dz=tgt.z-m.z,d=Math.hypot(dx,dz)||.01;m.face=Math.atan2(dx,dz);const reach=m.r+tgt.r+.25;
      if(d>reach){moveEnt(m,dx/d*4.4*dt,dz/d*4.4*dt);moving=true}
      else if(m.atkCd<=0){m.atkCd=.55;m.anim=1;const base=9+runTime*.025,crit=Math.random()<player.stats.crit;let dd=base*dmgMul*rand(.9,1.1);if(crit)dd*=player.stats.critDmg;damageEnemy(tgt,dd,crit,dx/d*2.5,dz/d*2.5,true)}
    }else{const dx=player.x-m.x,dz=player.z-m.z,d=Math.hypot(dx,dz)||.01;if(d>2.2){m.face=Math.atan2(dx,dz);moveEnt(m,dx/d*4*dt,dz/d*4*dt);moving=true}}
    for(const e of enemies){if(Math.hypot(e.x-m.x,e.z-m.z)<m.r+e.r+.1){m.hp-=e.dmg*dt*1.3}}
    if(m.hp<=0){burst(m.x,.5,m.z,m.sold?0xf2c14b:0x7ee0a8,9,{emi:.7,speed:2.6});fxGroup.remove(m.mesh);minions.splice(i,1);continue}
    m.mesh.position.set(m.x,(moving?Math.abs(Math.sin(m.t*10))*.03:Math.sin(m.t*2)*.015)+relief(m.x,m.z),m.z);m.mesh.rotation.y=m.face;m.mesh.rotation.x=m.anim*-.5;
    const sw=moving?Math.sin(m.t*10)*.6:0;m.legL.rotation.x=sw;m.legR.rotation.x=-sw;m.mesh.rotation.z=moving?Math.sin(m.t*10+Math.PI/2)*.045:0;
  }
  if(player.cls==='necro'&&state==='play'){minSummonT-=dt;if(minions.length<(player.minCap||0)&&minSummonT<=0){minSummonT=4;summonMinion()}}
}

/* ================= fluxo ================= */
function newRun(cls){
  if(!isUnlocked(cls))return;
  const C=CLASSES[cls];selCls=cls;store.set('cv_cls',cls);
  Object.assign(player,{cls,x:W/2,z:H/2,y:0,vy:0,r:.32,maxHp:C.hp,hp:C.hp,facing:Math.PI,atkCd:.5,abCd:0,dashCd:0,dashT:0,dvx:0,dvz:0,invuln:1,shieldT:0,spinT:0,spinTick:0,spinAng:0,walk:0,atkAnim:0,flash:0,aimAng:Math.PI,minCap:cls==='necro'?3:0,minDmg:1,orbN:0,
    lvl:1,xp:0,xpNeed:xpNeed(1),weap:Object.fromEntries(Object.keys(WEAPONS).map(k=>[k,0])),
    stats:{dmg:1,atkSpd:1,move:1,cdr:1,ls:C.lsBase||0,crit:C.critBase||.05,armor:C.armor,multi:0,pierce:0,area:1,thorns:0,regen:0,magnet:1,xpMul:1,critDmg:2,pspd:1,kb:1,dashCd:1,chill:0},picks:[],upgIds:{}});
  applyShop(player);
  if(player.model)scene.remove(player.model.root);
  player.model=buildHero(cls);scene.add(player.model.root);
  kills=0;runTime=0;hordeN=0;nextHorde=60;nextBoss=240;bossCount=0;spawnAcc=0;pendingUps=0;boss=null;bossKills=0;runDmg=0;runSkel=0;runBat=0;cheatGod=false;ogreLoose=false;aiSkill=.5;aiHpAvg=1;runDealt=0;aiT=0;moonOn=false;moonT=0;moonCd=0;moonKills=0;moonA=0;moonBudget=0;moonAcc=0;
  scene.remove(menuGroup);
  if(level)scene.remove(level);if(fxGroup)scene.remove(fxGroup);if(wGroup)scene.remove(wGroup);
  enemies=[];projs=[];pickups=[];fxs=[];parts=[];gems=[];texts.forEach(t=>t.el.remove());texts=[];WEAPON_RESETS.forEach(f=>f());minions=[];minSummonT=1;
  level=new THREE.Group();fxGroup=new THREE.Group();wGroup=new THREE.Group();scene.add(level,fxGroup,wGroup);
  buildField();makeGems();
  camYaw=player.facing;camDist=5.4;camFx=player.x;camFz=player.z;
  $('#h-cls').textContent=C.nome;$('#sk-ab-n').textContent=C.ab.nome;$('#bossbar').hidden=true;
  for(let i=0;i<8;i++){const p=spawnPos(12,18);if(p)spawnEnemy('slime',p[0],p[1])}
  setScreen('play');lockMouse();camPitch=.5;toast('Sobreviva','Seus ataques são automáticos');
}
function openUpgrade(){
  setScreen('upgrade');
  $('#up-title').textContent=upSource==='chest'?'Baú aberto!':'Nível '+player.lvl+'!';
  const wSlots=weaponSlots(player),uSlots=upgradeSlots(player);
  $('#up-sub').textContent=`Build: ${wSlots}/${BUILD_LIMITS.weapons} armas · ${uSlots}/${BUILD_LIMITS.upgrades} melhorias — escolha uma opção ${upSource==='chest'?'(grátis) ':''}ou teclas 1/2/3.`;
  let pool=STAT_UPS.filter(u=>(!u.cls||u.cls.includes(player.cls))&&(!u.ok||u.ok(player))&&(player.upgIds[u.id]||uSlots<BUILD_LIMITS.upgrades)).map(u=>Object.assign({kind:u.cls?'cls':'stat'},u));
  for(const k in WEAPONS){const l=player.weap[k];if(l<5&&(l>0||wSlots<BUILD_LIMITS.weapons)){const up={id:'w_'+k,kind:'weapon',nome:WEAPONS[k].nome+(l?' nv '+(l+1):''),desc:(l?'':'Nova arma. ')+WEAPONS[k].desc(l+1),apply:p=>p.weap[k]++,wk:k};pool.push(up)}}
  const choice=[];while(choice.length<3&&pool.length){const u=pick(pool);choice.push(u);pool=pool.filter(x=>x.id!==u.id)}
  if(!choice.length){ // tudo no teto: recompensa de consolação encerra a cadeia de sorteios
    pendingUps=0;player.hp=Math.min(player.maxHp,player.hp+player.maxHp*.2);addCoins(10);
    toast('Tudo no teto','Melhorias no máximo — +20% de vida e 🪙 10 por nível sobrando');setScreen('play');lockMouse();return}
  const wrap=$('#ups');wrap.innerHTML='';
  choice.forEach((u,i)=>{const b=document.createElement('button');b.type='button';b.className='up';b.id='up-'+i;
    const wlvl=u.wk?player.weap[u.wk]:0;
    const have=u.kind==='weapon'?wlvl:player.picks.filter(x=>x===u.nome).length;
    const rar=u.kind==='weapon'?(wlvl?RARITY.incomum:RARITY.novo):u.kind==='cls'?RARITY.raro:RARITY.comum;
    const lvlTxt=have?('NV '+(have+1)):'NOVO';
    b.style.setProperty('--c',rar.c);
    const ic=icon(u.wk?WEAPONS[u.wk].nome:u.nome)||'●';
    const dlv=u.kind==='weapon'?player.weap[u.wk]+1:have+1;
    const desc=(typeof u.desc==='function'?u.desc(dlv):u.desc).replace(/(\+?\d[\d.,]*\s?%?)/g,'<b class="hl">$1</b>');
    b.innerHTML=`<span class="up-key">${i+1}</span><div class="up-ic">${ic}</div><div class="up-body"><div class="up-top"><span class="rar">${rar.t}</span><span class="lvl">${lvlTxt}</span></div><h3>${u.nome}</h3><p>${desc}</p></div>`;
    b.onclick=()=>chooseUpgrade(u);wrap.appendChild(b)});
  wrap._choice=choice;setTimeout(()=>{const f=$('#up-0');f&&f.focus({preventScroll:true})},50);
}
function chooseUpgrade(u){if(state!=='upgrade')return;if(!u.wk)player.upgIds[u.id]=true;u.apply(player);player.picks.push(u.wk?WEAPONS[u.wk].nome:u.nome);
  if(upSource==='lvl')pendingUps=Math.max(0,pendingUps-1);upSource='lvl';
  if(pendingUps>0)openUpgrade();else{setScreen('play');lockMouse()}renderWeap()}
function renderWeap(){const el=$('#h-weap');el.innerHTML='';for(const k in WEAPONS)if(player.weap[k]){const s=document.createElement('span');const ic=icon(WEAPONS[k].nome);s.innerHTML=(ic?'<i class="ic">'+ic+'</i>':'')+WEAPONS[k].nome+' '+player.weap[k];el.appendChild(s)}}
let deathText='caiu';
function die(why){
  deathText=why||'caiu';state='dying';deadT=1.2;player.model.root.visible=false;burst(player.x,.6,player.z,CLASSES[player.cls].pal.body,36,{speed:6,size:.16,life:1.2});burst(player.x,.6,player.z,0xe5473c,18,{speed:5});addShake(.5);
  $('#touch').hidden=true;const best=store.get('cv_bestT',{});if((best[player.cls]||0)<runTime){best[player.cls]=Math.floor(runTime);store.set('cv_bestT',best)}
  const bk=store.get('cv_bestK',{});if((bk[player.cls]||0)<kills){bk[player.cls]=kills;store.set('cv_bestK',bk)} // recorde: mais abates numa corrida
  const bl=store.get('cv_bestL',{});if((bl[player.cls]||0)<player.lvl){bl[player.cls]=player.lvl;store.set('cv_bestL',bl)} // recorde: maior nível
  clearMinions();lastReward=recordRun();
}
function showDeath(){
  setScreen('dead');const C=CLASSES[player.cls];
  $('#dead-title').textContent='Você '+deathText+' aos '+fmtT(runTime);
  const best=store.get('cv_bestT',{})[player.cls]||runTime;const rw=lastReward||{earned:0,bonus:0};
  $('#dead-sub').innerHTML=C.nome+' · recorde: '+fmtT(best)+(hordeN?' · horda '+hordeN:'')+' · ganhou <b style="color:var(--gold)">'+emIc('🪙')+' '+(rw.earned+rw.bonus)+'</b>'+(rw.bonus?' (+'+rw.bonus+' de conquistas!)':'')+(rw.newCls?'<br><b style="color:var(--moss)">'+clsImg(rw.newCls)+' '+CLASSES[rw.newCls].nome+' liberado!</b>':'');
  $('#d-time').textContent=fmtT(runTime);$('#d-lvl').textContent=player.lvl;$('#d-kills').textContent=kills;
  chips($('#d-chips'),player.picks,'Nenhuma melhoria escolhida');
}
function chips(el,list,empty){el.innerHTML='';const c={};list.forEach(n=>c[n]=(c[n]||0)+1);const keys=Object.keys(c);if(!keys.length){const s=document.createElement('span');s.textContent=empty;el.appendChild(s);return}
  keys.forEach(k=>{const s=document.createElement('span');const ic=icon(k);s.innerHTML=(ic?'<i class="ic">'+ic+'</i>':'')+k+(c[k]>1?' ×'+c[k]:'');el.appendChild(s)})}
function setScreen(s){
  state=s;
  if(s!=='play'&&mapOpen){mapOpen=false;if(mapScreen)mapScreen.style.display='none'} // fecha o mapa ao sair do jogo
  $('#title').hidden=s!=='title';$('#howto').hidden=s!=='howto';$('#recs').hidden=s!=='recs';$('#menu').hidden=s!=='menu';$('#upgrade').hidden=s!=='upgrade';$('#pause').hidden=s!=='pause';$('#dead').hidden=s!=='dead';$('#options').hidden=s!=='options';
  $('#hud').hidden=!(s==='play'||s==='pause'||s==='upgrade'||s==='dying');
  $('#touch').hidden=!(isTouch&&s==='play');
  if(s!=='play'&&document.pointerLockElement)try{document.exitPointerLock()}catch(e){}
  $('#shop').hidden=s!=='shop';$('#ach').hidden=s!=='ach';
  $('#lockhint').hidden=!(s==='play'&&!isTouch&&!document.pointerLockElement);
  if(s==='title'){claimAch();renderBest()}
  if(s==='pause')renderPause();
  updateCoins();
}
function renderPause(){
  const w=[];for(const k in WEAPONS)if(player.weap[k])w.push(`<div class="invslot" title="${WEAPONS[k].nome}">${icon(WEAPONS[k].nome)}<span class="q">${player.weap[k]}</span></div>`);
  const c={};player.picks.forEach(n=>{if(!WEAPONS_NAMES.has(n))c[n]=(c[n]||0)+1});
  const up=Object.keys(c).map(n=>`<div class="invslot" title="${n}">${icon(n)||'●'}<span class="q">${c[n]}</span></div>`);
  $('#pause-inv').innerHTML=`<div class="invlabel">Armas ${weaponSlots(player)} / ${BUILD_LIMITS.weapons}</div><div class="invgrid">${w.length?w.join(''):'<span class="pnum">nenhuma ainda</span>'}</div>`+
    `<div class="invlabel">Melhorias ${upgradeSlots(player)} / ${BUILD_LIMITS.upgrades}</div><div class="invgrid">${up.length?up.join(''):'<span class="pnum">nenhuma ainda</span>'}</div>`;
  const st=player.stats,pct=v=>Math.round(v*100)+'%',mul=v=>'×'+(Math.round(v*100)/100);
  const S=[[emIc('❤️')+' Vida',Math.round(player.maxHp)],[emIc('💪')+' Dano',mul(st.dmg)],[emIc('⚡')+' Vel. ataque',mul(st.atkSpd)],[emIc('👟')+' Vel. movimento',mul(st.move)],[emIc('🎯')+' Crítico',pct(st.crit)],[emIc('💥')+' Área',mul(st.area)],[emIc('⏳')+' Recarga hab.',mul(st.cdr)],[emIc('🧱')+' Armadura',pct(st.armor)]];
  if(st.regen)S.push([emIc('💚')+' Regeneração','+'+(Math.round(st.regen*10)/10)+'/s']);
  if(st.ls)S.push([emIc('🩸')+' Roubo de vida',pct(st.ls)]);
  if(st.thorns)S.push([emIc('🌵')+' Espinhos',pct(st.thorns)]);
  if(st.multi)S.push([emIc('✨')+' Projéteis extra','+'+st.multi]);
  if(st.pierce)S.push([emIc('➡️')+' Perfuração','+'+st.pierce]);
  if(st.critDmg>2)S.push([emIc('💢')+' Dano crítico','×'+(Math.round(st.critDmg*100)/100)]);
  if(st.pspd>1)S.push([emIc('🚀')+' Vel. de tiro',mul(st.pspd)]);
  if(st.kb>1)S.push([emIc('🫱')+' Recuo',mul(st.kb)]);
  if(st.dashCd<1)S.push([emIc('💨')+' Esquiva rápida',mul(st.dashCd)]);
  if(st.chill)S.push([emIc('❄️')+' Pulso Congelante',st.chill*20+'% lento']);
  S.push([emIc('🧲')+' Ímã',mul(st.magnet)],[emIc('📖')+' XP',mul(st.xpMul)]);
  if(player.cls==='necro')S.push([emIc('💀')+' Esqueletos',minions.length+' / '+player.minCap]);
  if(player.cls==='king')S.push([emIc('⚔️')+' Soldados',minions.length+' / 8']);
  $('#pause-stats').innerHTML=S.map(([n,v])=>`<span>${n}</span><b>${v}</b>`).join('');
  $('#pause-missions').innerHTML=ORDER.filter(k=>MISSION[k]).map(k=>{
    const M=MISSION[k],done=isUnlocked(k),cur=M.prog(),pct=done?100:Math.min(100,Math.round(cur/M.goal*100));
    const curT=M.fmt?M.fmt(cur):fmtN(cur),goalT=M.fmt?M.fmt(M.goal):fmtN(M.goal);
    return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:8px;font-size:13px">`+
      `<span style="color:var(--dust)">${clsImg(k)} ${CLASSES[k].nome}</span>`+
      `<b style="color:${done?'var(--moss)':'var(--bone)'};font-variant-numeric:tabular-nums">${done?'✓ liberado':curT+' / '+goalT}</b></div>`+
      `<div class="pbar"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
}
function goMenu(to){if(level){scene.remove(level);level=null;fireFx=null;flameMat=null}if(fxGroup){scene.remove(fxGroup);fxGroup=null}if(wGroup){scene.remove(wGroup);wGroup=null}texts.forEach(t=>t.el.remove());texts=[];enemies=[];minions=[];grid=null;WEAPON_RESETS.forEach(f=>f());
  if(player.model)player.model.root.visible=false;scene.add(menuGroup);renderCards();setScreen(to||'menu')}

// caixão de madeira escura com bandas de ferro e cruz dourada — aberto mostra o lençol e um brilho fantasma
function buildCoffin(open){const g=new THREE.Group();
  vox(g,0,.13,0,.64,.26,.4,0x3f2d4d);                              // base
  vox(g,0,.3,0,.56,.1,.34,0x4a3558);                               // meio
  vox(g,0,.385,0,.46,.08,.28,0x554066);                            // ombros
  vox(g,0,.13,.208,.66,.05,.07,0x9aa0b0);vox(g,0,.13,-.208,.66,.05,.07,0x9aa0b0); // bandas de ferro
  const lid=new THREE.Group();lid.position.set(0,.42,-.18);g.add(lid);
  vox(lid,0,.04,.18,.44,.09,.26,0x5a4270);vox(lid,0,.1,.18,.5,.08,.3,0x4a3558);vox(lid,0,.16,.18,.58,.07,.34,0x3f2d4d); // tampa abaulada
  vox(lid,0,.21,.06,.07,.26,.07,0xd9a43a);vox(lid,0,.255,.06,.22,.07,.07,0xd9a43a); // cruz dourada
  if(open){lid.rotation.x=-1.5; // tampa aberta de verdade: ereta, apoiada na borda de trás
    vox(g,0,.33,0,.42,.05,.24,0xe8e2d0);                            // lençol visível dentro
    const l=new THREE.PointLight(0x9a7ae8,.8,5,2);l.position.set(0,.85,0);g.add(l)}
  return g}
// TARDIS: a cabine azul do Smith (referência Doctor Who) — placa, janelas, portas, lampião
function buildTardis(){const g=new THREE.Group();const B=0x1542a0,BD=0x0d2f6e;
  vox(g,0,.05,0,1.08,.1,1.08,BD);vox(g,0,1.05,0,1,1.9,1,B);vox(g,0,2.05,0,1.08,.1,1.08,BD); // base, corpo, teto
  vox(g,0,2.24,0,1.06,.24,1.06,0x14161c); // faixa lisa do letreiro (sem escrito)
  for(let s=0;s<4;s++){const f=new THREE.Group();f.rotation.y=s*Math.PI/2;g.add(f); // 4 faces iguais, portas s/0 e s/2
    for(const t of[-.3,-.1,.1,.3]){const p=vox(f,t,1.78,.555,.16,.3,.05,0xcfe3ef,.15);p.castShadow=false} // mezanino: 4 vidros
    if(s===0||s===2){vox(f,-.25,.95,.55,.42,1.1,.05,0x123a86);vox(f,.25,.95,.55,.42,1.1,.05,0x123a86); // portas
      vox(f,-.25,.95,.578,.3,.95,.02,0x0e2f6b);vox(f,.25,.95,.578,.3,.95,.02,0x0e2f6b);
      vox(f,-.25,.5,.585,.3,.07,.02,0x0a2a66);vox(f,.25,.5,.585,.3,.07,.02,0x0a2a66); // venezianas
      vox(f,-.06,1.35,.59,.03,.05,.03,0xe8e2d0);vox(f,.06,1.35,.59,.03,.05,.03,0xe8e2d0); // maçanetas
    }else{vox(f,0,1.0,.555,.5,1.3,.03,0x103684);vox(f,0,.35,.555,.5,.5,.03,0x0e2f6b);vox(f,0,1.7,.57,.07,.07,.03,0xdfe8ee)}} // laterais: painéis + roundel
  vox(g,0,2.42,0,.14,.12,.14,0xf4f6f8,1.2); // lampião do teto
  return g}
/* ================= menu 3D ================= */
const menuGroup=new THREE.Group();const menuHeroes={};let menuRing,fireGroup,fireLight,flames=[],fireGlow=[],fireRim=[],menuStones={},royalGrp=null,necroG=null,tGref=null,cemeG=null;let smokesM=[];
const silMat=new THREE.MeshBasicMaterial({color:0x101116});const FIREY=[.34,.5,.66]; // silMat = sombra preta dos heróis travados
(function buildMenu(){
  { // chão do título com a MESMA lógica do campo do jogo: blocos grama/terra batida, manchas secas e micro-relevo voxel
    const gCells=[],dCells=[];
    for(let x=-14;x<=14;x++)for(let z=-17;z<=5;z++){ // ilha oval, borda irregular
      if(x*x/200+z*z/290>rand(.9,1.2))continue;
      (nz(x,z)>1.2?dCells:gCells).push([x,z])}
    const mkGround=(geo,cells)=>{
      const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}),Math.max(1,cells.length));
      im.receiveShadow=true;menuGroup.add(im);
      const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),pp=new THREE.Vector3(),ss=new THREE.Vector3(),col=new THREE.Color();
      cells.forEach(([x,z],i)=>{ // superfície plana p/ os heróis em pé: só o micro-relevo voxel do jogo
        m4.compose(pp.set(x,jv(x,z)*.06-.7,z),q,ss.set(1,1.4,1));im.setMatrixAt(i,m4);
        if(nz2(x,z)>0.98)col.setHex(0xa8a24a).offsetHSL(0,0,rand(-.06,.04)); // manchas de grama seca/amarelada
        else col.setScalar(1.0+rand(-.08,.08)+((x+z)%2?.03:-.03)); // contraste em tabuleiro como o campo
        im.setColorAt(i,col)})};
    mkGround(grassBlockGeo,gCells);mkGround(dirtBlockGeo,dCells)}
  for(let i=0;i<48;i++){const fx=rand(-11,11),fz=rand(-13,4);if(fx*fx+fz*fz<4)continue;vox(menuGroup,fx,.08,fz,.12,.12,.12,pick([0xf2d24b,0xe86a8a,0xffffff,0xa58bff])).castShadow=false}
  [[-12,.5,1],[12,-2,3],[-5,-13.5,4],[-4,4.3,2],[2.6,4.4,0]].forEach(([tx,tz,t])=>{ // poucas árvores, estilo o campo do jogo
    const m=new THREE.Mesh(TREE_GEOS[t],treeMat);m.position.set(tx,jv(tx,tz)*.06,tz);m.rotation.y=rand(0,TAU);m.scale.setScalar(rand(.8,1.1));m.castShadow=true;m.receiveShadow=true;menuGroup.add(m)});
  const tG=new THREE.Group();tG.position.set(-10.2,0,2.7);tG.rotation.y=1.75;tG.scale.setScalar(.92);menuGroup.add(tG);tG.add(buildTardis());tGref=tG; // a cabine do Smith — só aparece com ele liberado
  // cemitério com os caixões: morada do Vampiro quando ele está liberado
  const ceme=new THREE.Group();ceme.position.set(-8.6,0,-11.6);ceme.rotation.y=.55;menuGroup.add(ceme);cemeG=ceme;
  [[-1.7,.5,'grave'],[.7,-.8,'cross'],[-.6,1.7,'grave'],[1.8,1.0,'cross'],[.2,2.5,'grave']].forEach(([x,z,g])=>{
    const m=new THREE.Mesh(DECOR_GEO[g],treeMat);m.position.set(x,0,z);m.rotation.y=rand(0,TAU);ceme.add(m)});
  [[-2.3,2.2],[2.3,-1.5]].forEach(([x,z])=>{const m=new THREE.Mesh(DECOR_GEO.shroom,treeMat);m.position.set(x,0,z);ceme.add(m)});
  const dTree=new THREE.Mesh(TREE_GEOS[5],treeMat);dTree.position.set(-3,0,-1.8);dTree.scale.setScalar(1.15);ceme.add(dTree); // árvore morta
  const cofA=buildCoffin(false);cofA.position.set(1.3,0,.4);cofA.rotation.y=-.5;ceme.add(cofA);
  const cofB=buildCoffin(true);cofB.position.set(-1.4,0,-.7);cofB.rotation.y=.35;ceme.add(cofB);
  // cortejo real: trono + soldados — só existe quando o Rei é liberado
  royalGrp=new THREE.Group();menuGroup.add(royalGrp);
  const thr=new THREE.Group();thr.position.set(6.9,0,3.9);thr.rotation.y=-2.5;royalGrp.add(thr);
  vox(thr,0,.1,0,.9,.2,.8,0x6e6578);vox(thr,0,.35,-.1,.5,.3,.4,0x5a4a3a);vox(thr,0,.75,-.24,.5,1.1,.12,0x5a4a3a);
  vox(thr,0,1.32,-.24,.56,.14,.14,0xd9a43a);vox(thr,-.28,.5,-.05,.1,.34,.4,0x5a4a3a);vox(thr,.28,.5,-.05,.1,.34,.4,0x5a4a3a);
  vox(thr,-.28,.68,-.05,.12,.08,.42,0xd9a43a);vox(thr,.28,.68,-.05,.12,.08,.42,0xd9a43a);vox(thr,0,.53,-.06,.42,.1,.3,0xf2c14b); // trono
  [[7.6,1.6],[8.0,3.6]].forEach(([sx,sz])=>{const sg=new THREE.Mesh(SOLDIER_GEO,soldierMat);sg.position.set(sx,0,sz);sg.scale.setScalar(.86);sg.rotation.y=Math.atan2(-sx,-sz);sg.castShadow=true;royalGrp.add(sg)}); // súditos
  // cemitério do Necromante: ele e sua horda de esqueletos (só quando liberado)
  necroG=new THREE.Group();menuGroup.add(necroG);
  [[6.3,-6.5,'grave'],[7.8,-8,'cross'],[6.6,-8.3,'grave']].forEach(([x,z,g])=>{const m=new THREE.Mesh(DECOR_GEO[g],treeMat);m.position.set(x,0,z);m.rotation.y=rand(0,TAU);necroG.add(m)});
  [[6.4,-6.8],[7.7,-7.5],[6.8,-8.4]].forEach(([x,z])=>{const sm=new THREE.Mesh(enemyGeo('skel'),minMat);sm.position.set(x,0,z);sm.scale.setScalar(.82);sm.rotation.y=Math.atan2(7-x,-7.2-z);sm.castShadow=true;necroG.add(sm)});
  // fogueira no centro da praça: os três principais acampam em volta dela (tela de título)
  fireGroup=new THREE.Group();menuGroup.add(fireGroup);
  for(let i=0;i<9;i++){const a=i/9*TAU+rand(-.08,.08);vox(fireGroup,Math.sin(a)*.85,.13+rand(-.02,.02),Math.cos(a)*.85,.26+rand(0,.09),.2+rand(0,.07),.26+rand(0,.09),pick([0x8a857c,0x7d7a72,0x93907f]))} // círculo de pedras
  vox(fireGroup,0,.07,0,.3,.14,.3,0x3a2a1a); // brasa no centro
  const lA=vox(fireGroup,0,.13,0,.85,.13,.15,0x5d3f22);lA.rotation.y=.9;
  const lB=vox(fireGroup,0,.13,0,.85,.13,.15,0x5d3f22);lB.rotation.y=-.9; // lenhas cruzadas
  flames=[[0,.34,0,.34,.4,.34,0xff7a1f],[0,.5,0,.25,.3,.25,0xffa52a],[0,.66,0,.15,.2,.15,0xffdf6a]].map(a=>{const f=vox(fireGroup,a[0],a[1],a[2],a[3],a[4],a[5],a[6],1);f.castShadow=false;f.userData.b=[a[3],a[4],a[5]];return f}); // chamas em camadas (animadas no update)
  fireLight=new THREE.PointLight(0xff8a3a,1.6,9,2);fireLight.position.set(0,.85,0);fireGroup.add(fireLight);
  smokesM=[0,1,2].map(i=>{const m=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xaab0b8,transparent:true,opacity:0,depthWrite:false}));m.castShadow=false;m.position.y=-2;fireGroup.add(m);return{m,p:i/3}}); // fumaça subindo
  ORDER.forEach((k,i)=>{const h=buildHero(k);h.root.position.set((i-(ORDER.length-1)/2)*1.55,0,0);menuGroup.add(h.root);menuHeroes[k]=h});
  const REST=['tank','chrono','pistol','demon','human'];
const slotOf=i=>{if(i===9)return[-1.22,7.24];if(i<3)return[[Math.PI/2,Math.PI*1.5,Math.PI][i],2.5];const j=REST.indexOf(ORDER[i]);return[j>=0?1.7+j*.675:Math.PI,4.6]}; // trio na fogueira; Smith junto da TARDIS; demais em arco
  const mkRef=(k,i)=>{const C=CLASSES[k];const[f,rr]=slotOf(i);const g=new THREE.Group();
    g.position.set(Math.sin(f)*(rr+.6),0,Math.cos(f)*(rr+.6));g.rotation.y=f;menuGroup.add(g); // monumento atrás da sombra
    vox(g,0,.21,0,.3,.42,.2,0x837e74);vox(g,0,.47,0,.36,.08,.24,0x8f8a80);vox(g,0,.56,0,.12,.14,.12,C.ui,1); // pedestal + cristal da cor da classe
    try{const cv=document.createElement('canvas');cv.width=128;cv.height=64;const cx=cv.getContext('2d');
      if(cx&&cx.fillText){cx.fillStyle='#151120';cx.fillRect(0,0,128,64);cx.strokeStyle='#3b3249';cx.strokeRect(2,2,124,60);
        cx.textAlign='center';
        const icd=CLSIMG[k]&&CLSIMG[k].complete;
        if(icd){cx.imageSmoothingEnabled=false;cx.drawImage(CLSIMG[k],48,2,32,32)}else{cx.font='26px serif';cx.fillStyle='#cfc4da';cx.fillText('?',64,34)}
        cx.font='bold 11px monospace';cx.fillStyle='#cfc4da';cx.fillText(C.nome.toUpperCase(),64,56);
        const pm=new THREE.Mesh(new THREE.PlaneGeometry(.3,.15),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));pm.position.set(0,.2,.105);g.add(pm)}}catch(e){}
    return g};
  ORDER.forEach((k,i)=>{menuStones[k]=mkRef(k,i)});
  const rg=new THREE.Group();rg.position.y=.03;menuGroup.add(rg);menuRing=rg;
  // luz do fogo no chão: fogueira estilo Minecraft — labaredas em círculo irregular, manchas alaranjadas translúcidas, sem disco sólido
  fireGlow=[];fireRim=[];
  for(let i=0;i<5;i++){const a=rand(0,TAU),r=rand(.05,.55);
    const bm=flatMesh(new THREE.CircleGeometry(rand(.18,.34),22),pick([0xff8a2a,0xd9571e,0xffa52a]),rand(.1,.2));bm.userData.own=false;
    bm.position.set(Math.sin(a)*r,rand(0,.02),Math.cos(a)*r);rg.add(bm);fireGlow.push({m:bm,a,r,op:bm.material.opacity,ph:rand(0,TAU)})}
  const mkFlare=(r,a,sparse)=>{const g=new THREE.Group();
    const b=vox(g,0,.09,0,.09,.16,.09,pick([0xffb02f,0xff9a1f]),1);b.castShadow=false;
    const t=vox(g,0,.21,0,.06,.1,.06,0xff4a1a,1);t.castShadow=false;t.rotation.x=rand(-.3,.3);
    g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);rg.add(g);
    return{g,ph:rand(0,TAU),base:.8+rand(-.25,.3),sparse:!!sparse,cur:0}};
  for(let i=0;i<18;i++)fireRim.push(mkFlare(.8+rand(-.14,.14),i/18*TAU+rand(-.08,.08))); // anel de chamas grudado no círculo de pedras
  for(let i=0;i<7;i++)fireRim.push(mkFlare(rand(.15,.5),rand(0,TAU),true)); // brasas soltas dentro do círculo
  scene.add(menuGroup);
})();
let menuT=0,menuAtk=0,mcx=0,mcy=2.1,mcz=6.6,mly=.75,mclx=0,mclz=0,podium=null;
podium=new THREE.Mesh(new THREE.CircleGeometry(.85,28),new THREE.MeshBasicMaterial({color:0xf2b84b,transparent:true,opacity:.14,depthWrite:false}));podium.rotation.x=-Math.PI/2;podium.position.y=.03;menuGroup.add(podium); // palco do herói no seletor
function updateMenu(dt){
  menuT+=dt;const narrow=camera.aspect<.95;const inMenu=state==='menu';
  const CAMPA=[Math.PI/2,Math.PI*1.5,Math.PI]; // ângulos do trio em volta da fogueira (lado, lado e fundo)
  ORDER.forEach((k,i)=>{const h=menuHeroes[k];const sel=k===selCls;
    // cada herói vive no seu lugar (trono, caixão, cemitério, acampamento) — visível em qualquer tela, mesmo de longe
    let tx,tz,ty;
    if(k==='dracula'&&isUnlocked(k)){tx=-10.6;tz=-10.3;ty=Math.atan2(-tx,-tz)} // vampiro mora na área do caixão aberto
    else if(k==='necro'&&isUnlocked(k)){tx=7;tz=-7.2;ty=Math.atan2(-tx,-tz)} // necromante dentro do cemitério
    else if(k==='king'&&isUnlocked(k)){tx=5.6;tz=3.2;ty=Math.atan2(-tx,-tz)} // rei à frente do trono (dentro da moldura)
    else if(k==='future'&&isUnlocked(k)){tx=-6.8;tz=2.4;ty=Math.atan2(-tx,-tz)} // Smith mora do lado da TARDIS
    else if(i<3){const f=CAMPA[i];tx=Math.sin(f)*2.5;tz=Math.cos(f)*2.5;ty=Math.atan2(-tx,-tz)}
    else{ // os demais (sem casa própria) espalhados em arco atrás
      const REST=['tank','chrono','pistol','demon','human'];const j=REST.indexOf(k);
      const f=j>=0?1.7+j*.675:Math.PI;tx=Math.sin(f)*4.6;tz=Math.cos(f)*4.6;ty=Math.atan2(-tx,-tz)}
    h.root.position.x=lerp(h.root.position.x,tx,Math.min(1,dt*8));
    h.root.position.z=lerp(h.root.position.z,tz,Math.min(1,dt*8));
    h.root.visible=inMenu?sel:isUnlocked(k); // seletor: só o escolhido (travado vira sombra); título: só os liberados
    {const on=!isUnlocked(k);if(on!==h.root.userData.silOn){h.root.userData.silOn=on;h.root.traverse(o=>{if(o.isMesh){if(o.userData.silM===undefined)o.userData.silM=o.material;o.material=on?silMat:o.userData.silM}})}}
    h.root.rotation.y=lerp(h.root.rotation.y,ty,Math.min(1,dt*5));
    h.torso.position.y=.34+(sel?Math.abs(Math.sin(menuT*3))*.05:0);
    const ax=Math.sin(menuT*2+i)*.08;h.armR.rotation.x=ax;h.armL.rotation.x=-ax;h.torso.rotation.y=0;
    if(k==='guerreiro'&&h.sword){h.sword.rotation.x=0;h.sword.rotation.z=0}
    if(sel&&menuAtk>0){const t=1-menuAtk,e=1-Math.pow(1-t,3);
      if(k==='guerreiro'){h.armR.rotation.x=lerp(-1.15,-.35,e);h.torso.rotation.y=lerp(.9,-.9,e);
        if(h.sword){h.sword.rotation.x=Math.PI/2*Math.min(1,menuAtk*4);h.sword.rotation.z=-.65*Math.min(1,menuAtk*3)}}
      else if(k==='tank'){h.armR.rotation.x=lerp(-3,-.8,e);h.armL.rotation.x=-1.4}
      else if(k==='mago'||k==='chrono'||k==='pistol'||k==='dracula'||k==='demon'||k==='future'||k==='human'||k==='king'){h.armR.rotation.x=-1.3}else{h.armL.rotation.x=-1.5;h.armR.rotation.x=-1.3}}
    applyKeep(h.keep);
    if(k==='tank'&&h.hammer){const hk=sel&&menuAtk>0?1-menuAtk:0,he=1-Math.pow(1-hk,3);h.hammer.rotation.x=-h.armR.rotation.x+(hk>0?lerp(-1.2,2.15,he):.07)}
    if(h.cape)h.cape.rotation.x=.02+Math.sin(menuT*1.4+i)*.015;
    if(k==='mago'&&h.mageOrb){h.mageOrb.position.y=1.02+Math.sin(menuT*2.2)*.03;h.mageMotes.rotation.y=menuT*1.8}
    if(k==='arqueiro'&&h.quiver)h.quiver.rotation.z=Math.sin(menuT*1.8+i)*.025;
    if(k==='arqueiro'&&h.bowArrow)h.bowArrow.visible=sel&&menuAtk>0;
    if(k==='guerreiro'&&h.plume){h.plume.rotation.z=Math.sin(menuT*2+i)*.045;h.plume.rotation.x=Math.sin(menuT*1.7+i)*.03}
  });
  for(const k in menuStones)menuStones[k].visible=!isUnlocked(k); // placa no lugar dos que ainda descansam no caixão
  if(royalGrp)royalGrp.visible=isUnlocked('king');
  if(necroG)necroG.visible=isUnlocked('necro');
  if(tGref)tGref.visible=isUnlocked('future');
  if(cemeG)cemeG.visible=isUnlocked('dracula'); // cada cenário só existe com o dono dele
  menuRing.position.x=0;
  const selP=menuHeroes[selCls]?menuHeroes[selCls].root.position:null;
  if(selP){podium.position.x=lerp(podium.position.x,selP.x,Math.min(1,dt*6));podium.position.z=lerp(podium.position.z,selP.z,Math.min(1,dt*6))} // palco desliza até o herói
  podium.visible=inMenu;if(inMenu&&podium.material.color.set){podium.material.color.set(CLASSES[selCls].ui);podium.material.opacity=.1+.05*Math.sin(menuT*2.2)}
  menuAtk=Math.max(0,menuAtk-dt*2.2);if(menuT%3<dt)menuAtk=1;
  menuRing.rotation.y+=dt*.06;const rp=1+Math.sin(menuT*2.2)*.025;menuRing.scale.set(rp,1,rp); // anel quase parado, só ondula
  for(const gb of fireGlow){const nr=gb.r*(1+Math.sin(menuT*1.3+gb.ph)*.15); // luz do chão suave
    gb.m.position.set(Math.sin(gb.a)*nr,Math.sin(menuT*1.7+gb.ph)*.008,Math.cos(gb.a)*nr);
    gb.m.material.opacity=gb.op*(.8+.25*Math.sin(menuT*2.7+gb.ph*2))}
  for(const fl of fireRim){const tgt=fl.sparse?(Math.sin(menuT*.5+fl.ph*3.1)>.4?fl.base:0):fl.base*(.7+.3*Math.sin(menuT*.8+fl.ph*3.1)); // chamas acesas, só lamber
    fl.cur+=(tgt-fl.cur)*Math.min(1,dt*7);
    const w=.35+.65*fl.cur*(.75+.35*Math.sin(menuT*7+fl.ph*5));
    fl.g.scale.set(Math.max(.01,w),Math.max(.01,w),Math.max(.01,w));fl.g.rotation.z=Math.sin(menuT*9+fl.ph)*.1*fl.cur}
  fireGroup.visible=true;menuRing.visible=true; // acampamento continua de pé no seletor
  {const ft=menuT;
    flames.forEach((f,i)=>{const w=Math.sin(ft*9+i*2.1)+Math.sin(ft*13.7+i*1.3);
      f.scale.set(f.userData.b[0]*(1+w*.09),f.userData.b[1]*(1+w*.14),f.userData.b[2]*(1-w*.09));f.position.y=FIREY[i]+w*.03});
    fireLight.intensity=1.5+Math.sin(ft*11)*.25+Math.sin(ft*23.3)*.15;
    smokesM.forEach(sm=>{const ph=((ft*.22)+sm.p)%1;
      sm.m.position.set(Math.sin(ft*.8+sm.p*9)*.16,.75+ph*1.7,Math.cos(ft*.6+sm.p*7)*.16);
      sm.m.scale.setScalar(.14+ph*.34);sm.m.material.opacity=.2*(1-ph)})}
  let cpx,cpy,cpz,cly,cwx=0,cwz=0;
  if(inMenu){ // seletor: câmera parada e firme, enquadrando o herói exatamente onde ele vive (trono, caixão, cemitério...)
    const hp=menuHeroes[selCls]?menuHeroes[selCls].root.position:null;
    if(hp){const d=Math.max(.001,Math.hypot(hp.x,hp.z)),fx=-hp.x/d,fz=-hp.z/d,DD=narrow?5:(selCls==='tank'?4.05:3.4);
      cpx=hp.x+fx*DD;cpy=1.5;cpz=hp.z+fz*DD;cly=1.05;cwx=hp.x;cwz=hp.z}}
  else if(state==='title'){ // título: imagem fixa lá da colina, todo mundo visível mesmo de longe
    if(narrow){cpx=0;cpy=10.5;cpz=21;cly=.4;cwz=-2.5}else{cpx=0;cpy=8.3;cpz=16.2;cly=.5;cwz=-2.5}}
  else{const a=menuT*.12;cpx=Math.sin(a)*9;cpy=2.6;cpz=Math.cos(a)*9;cly=1.4}
  const ck=Math.min(1,dt*4);mcx+=(cpx-mcx)*ck;mcy+=(cpy-mcy)*ck;mcz+=(cpz-mcz)*ck;mly+=(cly-mly)*ck;mclx+=(cwx-mclx)*ck;mclz+=(cwz-mclz)*ck; // desliza suave, depois fica parada
  camera.position.set(mcx,mcy,mcz);camera.lookAt(mclx,mly,mclz)
  sun.position.set(7,9,9); // mesmo sol baixo do jogo (consistência com o menu)sun.target.position.set(0,0,0);heroLight.intensity=0;
}
let buyConfirm=''; // classe aguardando confirmação de compra no painel de detalhe
function renderCards(){
  buyConfirm='';
  if(!isUnlocked(selCls))selCls=ORDER.find(isUnlocked)||'guerreiro';
  const wrap=$('#classes');wrap.innerHTML='';
  ORDER.forEach((k,i)=>{const C=CLASSES[k];const b=document.createElement('button');b.type='button';b.className='ctile';b.id='cc-'+k;b.style.setProperty('--c',C.ui);b.setAttribute('aria-pressed',String(k===selCls));
    b.innerHTML=`<span class="cic">${clsImg(k)}</span><span class="cname">${C.nome}</span><span class="ctipo">${CLSTIPO[k]}</span>`;
    if(i<10){const kb=document.createElement('i');kb.className='kbd';kb.textContent='1234567890'[i];b.appendChild(kb)}
    b.onclick=()=>selectClass(k);b.ondblclick=()=>newRun(k);
    if(!isUnlocked(k)){b.classList.add('locked');const lk=document.createElement('div');lk.className='lock';
      if(MISSION[k]){const M=MISSION[k],pv=M.fmt?M.fmt(M.prog()):fmtN(M.prog()),gv=M.fmt?M.fmt(M.goal):fmtN(M.goal);
        lk.innerHTML=`<span class="lk">${emIc('🔒')}</span><b>Missão</b><small>${pv} / ${gv} ${M.label}</small>`;}
      else{lk.innerHTML=`<span class="lk">${emIc('🔒')}</span><b>${emIc('🪙')} ${UNLOCK[k]}</b><small>clique para ver</small>`;}
      b.appendChild(lk)}
    wrap.appendChild(b)});
  renderDetail(selCls);
}
function renderDetail(k){const C=CLASSES[k],best=store.get('cv_bestT',{}),det=$('#chardetail'),locked=!isUnlocked(k);
  det.style.setProperty('--c',C.ui);
  const runs=metaStat().runs;
  det.innerHTML=`<div class="cd-top" style="--c:${C.ui}"><span class="cd-ic">${clsImg(k)}</span><div class="cd-id"><h3 style="color:${C.ui}">${C.nome}</h3><span class="cd-tipo">${CLSTIPO[k]}</span></div></div>`+
    `<div class="cd-meta">${best[k]?'★ Recorde '+fmtT(best[k]):'★ Sem recorde ainda'} · ${runs} corrida${runs===1?'':'s'}</div>`+
    `<p class="cd-role">${C.role}</p>`+
    `<div class="pips">${Object.entries(C.stats).map(([n,v])=>`<div class="pip-row" style="--c:${C.ui}"><span>${n}</span><i>${'<b class="on"></b>'.repeat(v)}${'<b></b>'.repeat(5-v)}</i></div>`).join('')}</div>`+
    `<div class="ab"><strong>${clsImg(k)} ${C.ab.nome}<small>Q · ${C.ab.cd}s</small></strong><span>${C.ab.desc}</span></div>`+
    (locked&&MISSION[k]?`<div class="rec" style="color:var(--gold)">${emIc('🎯')} ${MISSION[k].desc}<br>Progresso: ${MISSION[k].fmt?MISSION[k].fmt(MISSION[k].prog()):fmtN(MISSION[k].prog())} / ${MISSION[k].fmt?MISSION[k].fmt(MISSION[k].goal):fmtN(MISSION[k].goal)} ${MISSION[k].label}</div>`:'')+
    (locked
      ?(MISSION[k]?`<button class="btn" id="startbtn" type="button" disabled style="opacity:.6;cursor:default">${emIc('🔒')} CUMPRA A MISSÃO</button>`
                  :(buyConfirm===k?`<button class="btn" id="startbtn" type="button" style="border-color:var(--gold)">✓ CONFIRMAR COMPRA · ${emIc('🪙')} ${UNLOCK[k]}</button>`
                                  :`<button class="btn" id="startbtn" type="button">${emIc('🔓')} DESBLOQUEAR · ${emIc('🪙')} ${UNLOCK[k]}</button>`))
      :`<button class="btn" id="startbtn" type="button">CONFIRMAR</button>`);
  const startBtn=det.querySelector('#startbtn');
  if(startBtn)startBtn.onclick=()=>{
    if(!locked){newRun(k);return}
    if(MISSION[k])return;
    if(buyConfirm!==k){buyConfirm=k;renderDetail(k);return}
    if(coins()>=UNLOCK[k]){addCoins(-UNLOCK[k]);buyConfirm='';doUnlock(k);renderCards();updateCoins()}
    else{startBtn.textContent='🪙 Ouro insuficiente';buyConfirm=''}
  };
}
function selectClass(k){selCls=k;menuAtk=1;buyConfirm='';document.querySelectorAll('.ctile').forEach(c=>c.setAttribute('aria-pressed',String(c.id==='cc-'+k)));renderDetail(k)}
renderCards();

/* ================= entrada ================= */
const keys={},touchMove={x:0,y:0},moveVec={x:0,z:0};
addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.altKey&&e.code==='KeyC'){e.preventDefault();toggleCheat();return} // combo secreto
  if(cheatOpen){if(e.code==='Escape'){e.preventDefault();toggleCheat()}return} // terminal aberto: jogo ignora teclas
  if(mediaOpen){if(e.code==='Escape'||e.code==='KeyM')toggleMedia(false);e.preventDefault();return} // galeria de mídias aberta
  if(galleryOpen){e.preventDefault();if(e.code==='Escape'||e.code==='KeyG')toggleGallery();else if(e.code==='ArrowRight'||e.code==='ArrowDown')galleryStep(1);else if(e.code==='ArrowLeft'||e.code==='ArrowUp')galleryStep(-1);return}
  keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state==='play')e.preventDefault();
  if(e.repeat)return;
  if(e.code==='KeyT'){e.preventDefault();setMuted(!muted);return} // T: som liga/desliga
  if(state==='title'){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();renderCards();setScreen('menu')}return}
  if(state==='howto'||state==='recs'||state==='shop'||state==='ach'){if(e.code==='Escape')setScreen('title');return}
  if(state==='menu'){if(e.code==='Escape'){setScreen('title');return}const i=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0'].indexOf(e.code);if(i>=0&&ORDER[i])selectClass(ORDER[i]);
    const N=ORDER.length;if(e.code==='ArrowRight')selectClass(ORDER[(ORDER.indexOf(selCls)+1)%N]);if(e.code==='ArrowLeft')selectClass(ORDER[(ORDER.indexOf(selCls)+N-1)%N]);
    if(e.code==='ArrowDown')selectClass(ORDER[(ORDER.indexOf(selCls)+3)%N]);if(e.code==='ArrowUp')selectClass(ORDER[(ORDER.indexOf(selCls)+N-3)%N]);
    if(e.code==='Enter'&&!(document.activeElement&&document.activeElement.classList.contains('ctile')))newRun(selCls)}
  else if(state==='play'){
    if(e.code==='KeyM'){toggleMap();return}
    if(mapOpen){if(e.code==='Escape')toggleMap();return} // mapa aberto: ignora o resto
    if(e.code==='KeyQ'||e.code==='KeyE')useAbility();if(e.code==='Space')jump();if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyX')dash();if(e.code==='Escape'||e.code==='KeyP')setScreen('pause')}
  else if(state==='pause'){if(e.code==='KeyP'||e.code==='Enter'){setScreen('play');lockMouse()}}
  else if(state==='upgrade'){const i=['Digit1','Digit2','Digit3'].indexOf(e.code);const ch=$('#ups')._choice;if(i>=0&&ch&&ch[i]){chooseUpgrade(ch[i])}}
});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;if(state==='play')setScreen('pause')});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
const cvs=renderer.domElement;let dragging=false;
function lockMouse(){if(isTouch)return;try{const r=cvs.requestPointerLock&&cvs.requestPointerLock();if(r&&r.catch)r.catch(()=>{})}catch(e){}}
function look(dx,dy){if(state!=='play')return;camYaw-=dx*.0028;camPitch=clamp(camPitch+dy*.0022,-.05,1.05)}
cvs.addEventListener('mousedown',e=>{if(state!=='play'||galleryOpen)return;if(!document.pointerLockElement)lockMouse();dragging=true});
addEventListener('mouseup',()=>{dragging=false});
addEventListener('mousemove',e=>{if(document.pointerLockElement===cvs)look(e.movementX,e.movementY);else if(dragging)look(e.movementX,e.movementY)});
cvs.addEventListener('wheel',e=>{if(state!=='play')return;e.preventDefault();camZoom=clamp(camZoom+e.deltaY*.006,2.5,13)},{passive:false});
document.addEventListener('pointerlockchange',()=>{const on=document.pointerLockElement===cvs;$('#lockhint').hidden=on||state!=='play'||isTouch;if(!on&&state==='play'&&!mapOpen)setScreen('pause')});
$('#resumebtn').onclick=()=>{setScreen('play');lockMouse()};
$('#quitbtn').onclick=()=>{if(state==='pause'&&player)die('desistiu')}; // desistir = suicídio: morre na arena e registra os recordes
$('#t-play').onclick=()=>{renderCards();setScreen('menu')};$('#t-how').onclick=()=>setScreen('howto');$('#t-recs').onclick=()=>{renderRecs();setScreen('recs')};
$('#t-shop').onclick=()=>{renderShop();setScreen('shop')};$('#t-ach').onclick=()=>{renderAch();setScreen('ach')};
$('#shop-back').onclick=()=>setScreen('title');$('#ach-back').onclick=()=>setScreen('title');
$('#how-back').onclick=()=>setScreen('title');$('#recs-back').onclick=()=>setScreen('title');$('#backbtn').onclick=()=>setScreen('title');
$('#pausebtn').onclick=()=>{if(state==='play')setScreen('pause')};
const sndBtn=$('#sndbtn');if(sndBtn)sndBtn.onclick=()=>setMuted(!muted);
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button'))S('click')}); // clique em qualquer botão
setMuted(muted);
$('#againbtn').onclick=()=>newRun(player.cls);
$('#menubtn').onclick=()=>goMenu();
// ---- Opções: navegação + controles de áudio ----
let optReturn='pause';
const optBtn=$('#optbtn');if(optBtn)optBtn.onclick=()=>{optReturn=(state==='title')?'title':'pause';setScreen('options')};
const optBack=$('#optBack');if(optBack)optBack.onclick=()=>setScreen(optReturn);
const bindRange=(id,fn)=>{const el=$(id);if(el)el.addEventListener('input',()=>fn(el.value/100))};
bindRange('#musicVol',setMusicVol);bindRange('#optMusicVol',setMusicVol);
bindRange('#sfxVol',setSfxVol);bindRange('#optSfxVol',setSfxVol);
const bindCheck=(id,fn)=>{const el=$(id);if(el)el.addEventListener('change',()=>fn(el.checked))};
bindCheck('#muteAll',setMuted);bindCheck('#optMuteAll',setMuted);
(function(){
  const stick=$('#stick'),knob=stick.querySelector('i');let tid=null,ox=0,oy=0,ltid=null,lpx=0,lpy=0;
  addEventListener('touchstart',e=>{if(state!=='play')return;for(const t of e.changedTouches){
    if(tid===null&&t.clientX<innerWidth*.5&&!t.target.closest('.tbtns')){tid=t.identifier;const r=stick.getBoundingClientRect();ox=r.left+r.width/2;oy=r.top+r.height/2;upd(t)}
    else if(ltid===null&&t.clientX>=innerWidth*.5&&!t.target.closest('.tbtns,button')){ltid=t.identifier;lpx=t.clientX;lpy=t.clientY}}},{passive:true});
  addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(t.identifier===tid)upd(t);else if(t.identifier===ltid){look((t.clientX-lpx)*1.6,(t.clientY-lpy)*1.4);lpx=t.clientX;lpy=t.clientY}}},{passive:true});
  const end=e=>{for(const t of e.changedTouches){if(t.identifier===tid){tid=null;touchMove.x=touchMove.y=0;knob.style.transform=''}if(t.identifier===ltid)ltid=null}};
  addEventListener('touchend',end);addEventListener('touchcancel',end);
  function upd(t){let dx=t.clientX-ox,dy=t.clientY-oy;const l=Math.hypot(dx,dy),m=50;if(l>m){dx*=m/l;dy*=m/l}knob.style.transform=`translate(${dx}px,${dy}px)`;touchMove.x=dx/m;touchMove.y=dy/m}
  const tap=(id,fn)=>{const el=$(id);if(el)el.addEventListener('pointerdown',e=>{e.preventDefault();fn()})};
  tap('#t-ab',useAbility);tap('#t-jump',jump);tap('#t-dash',dash);
})();

/* ================= atualização ================= */
function update(dt){
  runTime+=dt;updAI(dt);const C=CLASSES[player.cls],st=player.stats;
  if(!store.get('cv_unlocked',{}).chrono&&runTime>=MISSION.chrono.goal){doUnlock('chrono');toast('⏳ '+CLASSES.chrono.nome+' liberado!','Missão cumprida: 30 minutos sobrevividos')}
  // controle estilo Megabonk: direção relativa à câmera; o herói olha pra onde anda
  let ix=0,iz=0;if(keys.KeyW||keys.ArrowUp)iz+=1;if(keys.KeyS||keys.ArrowDown)iz-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;
  ix=clamp(ix+touchMove.x,-1,1);iz=clamp(iz-touchMove.y,-1,1);
  let il=Math.hypot(ix,iz);if(il>1){ix/=il;iz/=il;il=1}
  const fX=Math.sin(camYaw),fZ=Math.cos(camYaw),rX=-Math.cos(camYaw),rZ=Math.sin(camYaw);
  let mx=fX*iz+rX*ix,mz=fZ*iz+rZ*ix;moveVec.x=mx;moveVec.z=mz;
  const moving=il>.1;
  if(moving)player.facing+=angDiff(player.facing,Math.atan2(mx,mz))*Math.min(1,dt*14);
  player.atkCd-=dt;player.abCd=Math.max(0,player.abCd-dt);player.dashCd=Math.max(0,player.dashCd-dt);player.invuln-=dt;player.flash-=dt;player.shieldT=Math.max(0,player.shieldT-dt);
  if(st.regen>0&&player.hp<player.maxHp)healPlayer(st.regen*dt,true);
  if(player.dashT>0){player.dashT-=dt;moveEnt(player,player.dvx*dt,player.dvz*dt);if(Math.random()<.6)burst(player.x,.4+player.y,player.z,C.pal.body,1,{speed:.5,up0:0,up1:.5,grav:0,life:.3,size:.18})}
  else if(moving){let sp=C.speed*st.move;if(player.spinT>0)sp*=1.15;if(player.shieldT>0)sp*=.75;moveEnt(player,mx*sp*dt,mz*sp*dt)}
  player.vy-=24*dt;player.y+=player.vy*dt;if(player.y<0){if(player.vy<-6)burst(player.x,.05,player.z,0xb59a6a,4,{speed:2,up0:.2,up1:1});player.y=0;player.vy=0}
  // fogueira: queima ao pisar em cima (o Castiel, sendo o diabo, quase não sente). Pular por cima escapa.
  if(landPos&&landPos.fire&&player.y<.5){player.fireCd=(player.fireCd||0)-dt;
    const onFire=landPos.fire.some(f=>Math.hypot(player.x-f.x,player.z-f.z)<.85);
    if(onFire&&player.fireCd<=0){player.fireCd=.5;hurtPlayer(player.cls==='demon'?3:12,null,false);burst(player.x,.4,player.z,0xff7a1a,6,{emi:.7,speed:2.5,up0:.5,up1:2})}}
  autoAttack();
  if(player.spinT>0){player.spinT-=dt;player.spinTick-=dt;if(player.spinTick<=0){player.spinTick=.16;const R=2.4*st.area;
    for(const e of enemies.slice()){const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz)||.01;if(d<R+e.r){const r=roll(C.dmg*.55);damageEnemy(e,r.d,r.crit,dx/d*3*st.kb,dz/d*3*st.kb,true)}}
    swingFX(R,TAU*.42,player.spinAng,0xff3a24);
    if(Math.random()<.38)burst(player.x+Math.sin(player.spinAng)*1.25,.72+player.y,player.z+Math.cos(player.spinAng)*1.25,Math.random()<.72?0xff6a55:0xf2b84b,1,{emi:.5,speed:1.2,up0:.1,up1:.8,grav:0,life:.18,size:.05})}}
  updWeapons(dt);
  updateMinions(dt);
  director(dt);
  updMinionBounce(dt);for(const e of enemies.slice())updEnemy(e,dt);
  // separação (grade espacial simples)
  const cell={};for(const e of enemies){const k=(Math.floor(e.x/2))+','+(Math.floor(e.z/2));(cell[k]||(cell[k]=[])).push(e)}
  for(const e of enemies){const cx=Math.floor(e.x/2),cz=Math.floor(e.z/2);for(let ix=-1;ix<=1;ix++)for(let iz=-1;iz<=1;iz++){const L=cell[(cx+ix)+','+(cz+iz)];if(!L)continue;
      for(const o of L){if(o===e)continue;const dx=o.x-e.x,dz=o.z-e.z,d=Math.hypot(dx,dz),m=e.r+o.r;if(d<m&&d>.001){const p=(m-d)*.25;moveEnt(e,-dx/d*p,-dz/d*p)}}}
    const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz),m=e.r+player.r;if(d<m&&d>.001&&player.y<.6)moveEnt(e,dx/d*(m-d),dz/d*(m-d))}
  // projéteis
  for(let i=projs.length-1;i>=0;i--){const p=projs[i];p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;p.g.position.set(p.x,p.y,p.z);
    if(p.kind==='arrow'&&p.owner==='p'&&Math.random()<.16)burst(p.x,p.y,p.z,0x7fcf5a,1,{emi:.4,speed:.25,up0:0,up1:.25,grav:0,life:.16,size:.045});
    if(p.kind==='bone'||p.kind==='orb')p.g.rotation.y+=dt*12;if(p.kind==='fire'&&Math.random()<.35)burst(p.x,p.y,p.z,p.big?0xc9b4ff:0x8fe1ff,1,{emi:1,speed:.4,up0:0,up1:.6,grav:0,life:.25,size:p.big?.14:.1});
    let dead=p.life<=0;
    if(!dead&&wallH(p.x,p.z)>p.y){dead=true;burst(p.x,p.y,p.z,p.kind==='fire'?(p.big?0xc9b4ff:0x8fe1ff):0xcfc7b0,p.kind==='fire'?(p.big?14:6):3,{emi:p.kind==='fire'?1:0,speed:2.5})}
    if(!dead&&p.owner==='p'){for(const e of enemies){if(e.dead||p.hit.has(e))continue;if(Math.hypot(e.x-p.x,e.z-p.z)<e.r+p.r){p.hit.add(e);const kx=p.vx/p.speed,kz=p.vz/p.speed;damageEnemy(e,p.dmg,p.crit,kx*(p.kind==='fire'?(p.big?4.5:3):2)*st.kb,kz*(p.kind==='fire'?(p.big?4.5:3):2)*st.kb);
          if(p.kind==='arrow')burst(p.x,p.y,p.z,0x7fcf5a,3,{emi:.45,speed:2.4,up0:.2,up1:1.4,life:.22,size:.065});
          if(p.kind==='fire'){e.slowT=Math.max(e.slowT||0,p.big?1.8:.9);e.slowF=.55;const R=(p.big?2.3:1.5)*st.area;for(const o of enemies.slice()){if(o===e||o.dead)continue;if(Math.hypot(o.x-p.x,o.z-p.z)<R+o.r){damageEnemy(o,p.dmg*(p.big?.7:.5),false,0,0,true);o.slowT=Math.max(o.slowT||0,p.big?1.8:.9);o.slowF=.55}}ringFX(p.x,p.z,R,p.big?0xbfa8ff:0x8fe1ff,p.big?.35:.25);burst(p.x,p.y,p.z,p.big?0xc9b4ff:0x8fe1ff,p.big?14:6,{emi:1,speed:p.big?4:3,size:p.big?.14:.12});if(p.big)addShake(.08)}
          if(p.kind==='time'){e.slowT=Math.max(e.slowT||0,2.5);e.slowF=.5;const R=1.6*st.area; // lentifica o alvo e os próximos
            for(const o of enemies.slice()){if(o===e||o.dead)continue;if(Math.hypot(o.x-p.x,o.z-p.z)<R+o.r){o.slowT=Math.max(o.slowT||0,2.2);o.slowF=.5;damageEnemy(o,p.dmg*.4,false,0,0,true)}}
            ringFX(p.x,p.z,R,0x9fe8ff,.25);burst(p.x,p.y,p.z,0x9fe8ff,5,{emi:1,speed:2.5})}
          if(p.pierce--<=0){dead=true;break}}}}
    else if(!dead&&p.owner==='e'){if(Math.hypot(player.x-p.x,player.z-p.z)<player.r+p.r&&Math.abs(player.y+.6-p.y)<.8){if(player.invuln<=0){hurtPlayer(p.dmg,null,false);dead=true}}}
    if(dead){fxGroup.remove(p.g);projs.splice(i,1)}}
  updGems(dt);
  // coletáveis
  for(let i=pickups.length-1;i>=0;i--){const k=pickups[i];k.t+=dt;
    if(k.type==='coin'){const dx=player.x-k.x,dz=player.z-k.z,d=Math.hypot(dx,dz)||.01,mag=2.4*player.stats.magnet; // moeda é puxada como os orbes
      if(d<mag||k.vac){k.pt+=dt;const sp=Math.min(24,8+k.pt*20);k.x+=dx/d*sp*dt;k.z+=dz/d*sp*dt}else k.pt=0;
      k.g.position.set(k.x,.42+Math.sin(k.t*4)*.08,k.z);k.g.rotation.y+=dt*4;}
    else{k.g.position.y=.5+Math.sin(k.t*3)*.1;k.g.rotation.y+=dt*2;}
    if(Math.hypot(player.x-k.x,player.z-k.z)<(k.type==='coin'?.7:.9)){
      if(k.type==='heart'){S('heart');healPlayer(player.maxHp*.2);burst(k.x,.5,k.z,0xe5473c,10,{emi:.5})}
      else if(k.type==='coin'){S('coin');addCoins(k.v);updateCoins();dmgText(k.x,.9,k.z,'+'+k.v,'gold');burst(k.x,.5,k.z,0xf2b84b,7,{emi:.6,speed:2.5})}
      else{S('magnet');for(const g of gems)g.vac=true;toast('Ímã!','Todos os orbes vêm até você');burst(k.x,.5,k.z,0xd23b2f,10,{emi:.5})}
      fxGroup.remove(k.g);pickups.splice(i,1)}}
  // baús
  for(const c of chests){if(c.open)continue;if(Math.hypot(player.x-c.x,player.z-c.z)<1.1){c.open=true;c.lid.rotation.x=-1.9;burst(c.x,.6,c.z,0xf2b84b,24,{emi:1,speed:5});S('chest');upSource='chest';openUpgrade();break}}
  // totens de íma: giram enquanto estão ativos; ao se aproximar, disparam o vácuo global e ficam apagados
  for(const T of totems){if(T.used)continue;T.t+=dt;T.m.rotation.y+=dt*1.6;T.m.position.y=1.95+Math.sin(T.t*2.2)*.09;
    if(Math.hypot(player.x-T.x,player.z-T.z)<2){T.used=true;T.m.visible=false;T.off.visible=true;S('magnet');addShake(.25);burst(T.x,1.6,T.z,0xd23b2f,24,{emi:.7,speed:5,up0:1,up1:4});toast('Totem de Ímã!','Orbes e moedas de todo o mapa vêm até você');for(const G of gems)G.vac=true;for(const K of pickups)if(K.type==='coin')K.vac=true}}
  animHero(dt,moving||player.dashT>0);
}
// física dos minions (bando do Rei do Slime): empurro suave para não atravessarem um ao outro
function updMinionBounce(dt){
  for(let i=enemies.length-1;i>=0;i--){const a=enemies[i];if(!a.mini)continue;
    for(let j=i-1;j>=0;j--){const b=enemies[j];if(!b.mini)continue;
      const dx=a.x-b.x,dz=a.z-b.z,d2=dx*dx+dz*dz,rr=a.r+b.r+.06;
      if(d2<rr*rr){const d=Math.sqrt(d2)||.001,f=Math.min(3,(rr-d)*12)*dt*8;
        a.kx+=dx/d*f;a.kz+=dz/d*f;b.kx-=dx/d*f;b.kz-=dz/d*f;
        const ov=(rr-d)*dt*8;a.bump=Math.min(1.2,(a.bump||0)+ov);b.bump=Math.min(1.2,(b.bump||0)+ov)}}}}
function updEnemy(e,dt){
  e.t+=dt;e.cd-=dt;e.flash-=dt;if(e.slowT>0)e.slowT-=dt;
  const dx=player.x-e.x,dz=player.z-e.z,d=Math.hypot(dx,dz)||.001,ux=dx/d,uz=dz/d;
  if(!e.boss&&d>40){const p=spawnPos(18,24);if(p){e.x=p[0];e.z=p[1]}return}
  let mx=ux,mz=uz,sp=e.speed*(e.slowT>0?(e.slowF||.45):1);e.faceT=Math.atan2(ux,uz);
  const contact=d<e.r+player.r+.12&&(player.y<.6||e.fly);
  switch(e.type){
    case'slime':case'slimeB':sp*=.6+.6*Math.abs(Math.sin(e.t*4));if(contact&&e.cd<=0){hurtPlayer(e.dmg,e,true);e.cd=.9}break;
    case'bat':{e.diveCd=(e.diveCd||0)-dt;const w=Math.sin(e.t*5)*.7; // voa em curva
      if(e.dive>0){e.dive-=dt;mx=ux;mz=uz;sp*=1.85} // rasante reto
      else if(e.retreat>0){e.retreat-=dt;mx=-ux;mz=-uz;sp*=.8;e.faceT=Math.atan2(-ux,-uz)} // recua
      else if(d<3.8&&e.diveCd<=0){e.dive=.34;e.diveCd=2.3;burst(e.x,1,e.z,0x6a3a9a,5,{speed:2,up0:.2,up1:1})} // inicia rasante
      else{mx=ux-uz*w;mz=uz+ux*w}
      if(contact){if(e.cd<=0){hurtPlayer(e.dmg,e,true);e.cd=.8}if(e.dive>0){e.dive=0;e.retreat=.5}}
      break}
    case'spider':{e.leapCd=(e.leapCd||0)-dt;const w=Math.sin(e.t*11)*.35;mx=ux-uz*w;mz=uz+ux*w; // corre em zigue-zague
      if(e.leap>0){e.leap-=dt;mx=ux;mz=uz;sp*=2.05} // bote: reto e rápido
      else if(d<5.2&&e.leapCd<=0){e.leap=.3;e.leapCd=1.7;sp*=2.05;burst(e.x,.12,e.z,0x6a3a7a,5,{speed:2.2,up0:.2,up1:1.2})}
      if(contact&&e.cd<=0){hurtPlayer(e.dmg,e,true);e.cd=1}break}
    case'zombie':{const c={d,ux,uz,mx,mz,contact,rnd:Math.random,rand,spawnProj,hurtPlayer};ENEMY_DEFS.zombie.ai(e,dt,c);mx=c.mx;mz=c.mz;break}
    case'skel':{const c={d,ux,uz,mx,mz,contact,rnd:Math.random,rand,spawnProj,hurtPlayer};ENEMY_DEFS.skel.ai(e,dt,c);mx=c.mx;mz=c.mz;break}
    case'brute':if(e.wind>0){e.wind-=dt;mx=mz=0;e.faceT=Math.atan2(e.tx-e.x,e.tz-e.z);if(e.wind<=0){if(Math.hypot(player.x-e.tx,player.z-e.tz)<1.9*e.sc/1.45+player.r&&player.y<.8)hurtPlayer(e.dmg,e,true);ringFX(e.tx,e.tz,1.9,0xffb08a,.3);burst(e.tx,.1,e.tz,0x8b7a66,10,{speed:4});addShake(.12)}}
      else if(d<2.1&&e.cd<=0){e.wind=.8;e.cd=2.4;e.tx=e.x+ux;e.tz=e.z+uz;telegraph(e.tx,e.tz,1.9,.8)}break;
    case'golem':case'slimeking':{const r=bossAI(e,dt,ux,uz,d);mx=r[0];mz=r[1];sp=r[2];break}
    case'ogre':if(e.boss){const r=bossAI(e,dt,ux,uz,d);mx=r[0];mz=r[1];sp=r[2]} // boss usa o AI de chefe
      else{sp*=.5+.5*Math.abs(Math.sin(e.t*2.5));if(contact&&e.cd<=0){hurtPlayer(e.dmg,e,true);e.cd=1.1;addShake(.08)}}break; // ogro comum: avança pesado e bate no contato
  }
  const l=Math.hypot(mx,mz);if(l>1){mx/=l;mz/=l}
  const vx=mx*sp,vz=mz*sp;e.mvx=vx;e.mvz=vz;
  moveEnt(e,(vx+e.kx)*dt,(vz+e.kz)*dt);const dec=Math.max(0,1-9*dt);e.kx*=dec;e.kz*=dec;
  e.face+=angDiff(e.face,e.faceT)*Math.min(1,dt*10);
  if(e.boss){const M=e.mdl;e.obj.position.set(e.x,relief(e.x,e.z),e.z);
    if(e.type==='slimeking'){const hop=Math.abs(Math.sin(e.t*3.4)),q=.75+hop*.55,s=e.sc; // gigante: mesmo pulso elástico do slime comum
      M.root.rotation.y=e.face;e.obj.scale.set(s/Math.sqrt(q),s*q,s/Math.sqrt(q));e.obj.position.y+=hop*1.3}
    else{M.root.rotation.y=e.face;const sw=Math.sin(e.t*5)*(sp>0?1:0);
      M.legL.rotation.x=sw*.6;M.legR.rotation.x=-sw*.6;M.armL.rotation.x=-sw*.5;M.armR.rotation.x=sw*.5;
      if(e.mode==='ring'||e.mode==='windSlam'){M.armL.rotation.x=-2.8;M.armR.rotation.x=-2.8}else if(e.mode==='charge'||e.mode==='windCharge'){M.armL.rotation.x=-1.4;M.armR.rotation.x=-1.4}}
    setFlash(M.root,e.flash>0);$('#boss-hp').style.width=(clamp(e.hp/e.maxHp,0,1)*100)+'%';return}
  const m=e.mesh;m.position.set(e.x,0,e.z);m.rotation.y=e.face;
  if(e.type==='slime'||e.type==='slimeB'){const hop=Math.abs(Math.sin(e.t*4+(e.miniPh||0))); // pulinhos (minis com fase própria)
    m.position.y=hop*(e.mini?.46:.32); // minis pulam mais alto
    let q=e.mini?(.62+hop*.85):(.8+hop*.46); // minis: esticam bem no ar, achatam forte no pouso
    const bm=e.bump||0;
    m.scale.set(e.sc/Math.sqrt(q)*(1+bm*.28),e.sc*q*(1-bm*.22),e.sc/Math.sqrt(q)*(1+bm*.28));
    m.rotation.z=bm*Math.sin(e.t*21)*.22; // balanço de gelatina quando são espremidos pelos parceiros
    if(bm>0)e.bump=Math.max(0,bm-dt*3)}
  else if(e.type==='bat'){ // morcego: rasante fecha as asas, recuo bate forte
    const diving=e.dive>0,retreating=e.retreat>0;
    const flapSpd=diving?32:(retreating?27:20),amp=diving?.45:(retreating?1.15:.95);
    const fl=.35+Math.sin(e.t*flapSpd)*amp;
    e.wingL.rotation.z=-fl;e.wingR.rotation.z=fl;
    m.position.y=Math.sin(e.t*4)*.08+Math.sin(e.t*flapSpd)*.02;
    m.rotation.z=Math.sin(e.t*8)*.07+(diving?-.18:(retreating?.12:0));
    m.rotation.x=diving?.10:(retreating?-.06:Math.sin(e.t*3)*.03)}
  else if(e.type==='spider'){ // aranha: corpo balança na passada (as 8 pernas são parte da malha)
    const spd=Math.hypot(e.mvx||0,e.mvz||0),moving=spd>.2;
    e.walk+=dt*(moving?16+spd*3:2);
    m.position.y=moving?Math.abs(Math.sin(e.walk))*.03:0;
    m.rotation.z=Math.sin(e.walk)*.07;
    m.rotation.x=Math.sin(e.walk*2)*.02}
  else{ // pernas: passada alternada conforme a velocidade de movimento
    const spd=Math.hypot(e.mvx||0,e.mvz||0),moving=spd>.2;e.walk+=dt*(moving?6+spd*2.2:0);
    const amp=moving?.7:0;e.legL.rotation.x=Math.sin(e.walk)*amp;e.legR.rotation.x=-Math.sin(e.walk)*amp;
    m.position.y=moving?Math.abs(Math.sin(e.walk))*.04:0;m.rotation.z=Math.sin(e.walk)*.035;
    if(e.type==='brute'&&e.wind>0)m.rotation.x=-.2*(1-e.wind/.8);else m.rotation.x=0}
  m.position.y+=relief(e.x,e.z); // acompanha o relevo do chão
  const fm=e.flash>0;for(const pm of e.parts)pm.material=fm?flashMat:e.mat;
}
function bossAI(e,dt,ux,uz,d){
  e.phaseT-=dt;const rage=e.hp<e.maxHp*.5;let mx=0,mz=0,sp=e.speed*(rage?1.2:1);
  switch(e.mode){
    case'chase':mx=ux;mz=uz;if(d<e.r+player.r+.15&&e.cd<=0&&player.y<1){hurtPlayer(e.dmg*.7,e,true);e.cd=1}
      if(e.phaseT<=0){const m=pick(d>5?['ring','charge','charge']:['ring','slam','slam','charge']);
        if(m==='ring'){e.mode='ring';e.waves=rage?4:3;e.shotT=.35}
        else if(m==='charge'){e.mode='windCharge';e.phaseT=rage?.6:.8;e.cdx=ux;e.cdz=uz;lineTelegraph(e.x,e.z,ux,uz,10,e.phaseT)}
        else{e.mode='windSlam';e.phaseT=rage?.8:1;telegraph(e.x,e.z,3.8,e.phaseT)}}break;
    case'ring':e.shotT-=dt;if(e.shotT<=0){const n=rage?18:14;for(let i=0;i<n;i++){const a=i/n*TAU+e.waves*.2;spawnProj({x:e.x+Math.sin(a)*1.1,z:e.z+Math.cos(a)*1.1,y:.7,a,speed:6.5,dmg:e.dmg*.5,owner:'e',kind:'orb',r:.24,life:3})}
        e.waves--;e.shotT=.5;addShake(.08);if(e.waves<=0){e.mode='chase';e.phaseT=rand(1.6,2.4)}}break;
    case'windCharge':e.faceT=Math.atan2(e.cdx,e.cdz);if(e.phaseT<=0){e.mode='charge';e.phaseT=.7;e.hitP=false}break;
    case'charge':{const bl=moveEnt(e,e.cdx*14*dt,e.cdz*14*dt);if(Math.random()<.5)burst(e.x,.1,e.z,0x8b7a66,2,{speed:2});
      for(const o of enemies)if(o!==e&&Math.hypot(o.x-e.x,o.z-e.z)<1.4){o.kx+=e.cdz*8*(Math.random()<.5?1:-1);o.kz-=e.cdx*8}
      if(!e.hitP&&d<e.r+player.r+.2&&player.y<1.2){e.hitP=true;hurtPlayer(e.dmg,e,true)}
      if(bl||e.phaseT<=0){e.mode='chase';e.phaseT=rand(1.8,2.6);if(bl){addShake(.3);burst(e.x,.5,e.z,0x8b7a66,14,{speed:5})}}break}
    case'windSlam':if(e.phaseT<=0){if(d<3.8+player.r&&player.y<.8)hurtPlayer(e.dmg*1.15,e,true);ringFX(e.x,e.z,3.8,0xff8a4a,.45);burst(e.x,.1,e.z,0x8b7a66,26,{speed:7});addShake(.45);
        if(rage)for(let i=0;i<10;i++){const a=i/10*TAU;spawnProj({x:e.x+Math.sin(a)*1.1,z:e.z+Math.cos(a)*1.1,y:.7,a,speed:5.5,dmg:e.dmg*.45,owner:'e',kind:'orb',r:.24,life:3})}
        e.mode='chase';e.phaseT=rand(2,2.6)}break;
  }
  if(e.mode!=='chase')sp=0;
  return[mx,mz,sp];
}
// posiciona armas presas à mão: vertical ao mirar; cajados inclinam ao abaixar o braço (não cruzam o corpo)
function applyKeep(keep){for(const kk of keep){kk.g.rotation.x=-kk.arm.rotation.x;kk.g.rotation.z=0;
  if(kk.lean){const w=1-clamp(-kk.arm.rotation.x/1.3,0,1);kk.g.rotation.z=kk.lean*w;kk.g.rotation.x+=(kk.leanX||0)*w}}}
function animHero(dt,moving){
  const b=player.model,cls=player.cls;b.root.position.set(player.x,player.y+relief(player.x,player.z),player.z);b.root.rotation.y=player.facing;
  if(moving)player.walk+=dt*11;const sw=moving&&player.y<.05?Math.sin(player.walk):0;
  b.legL.rotation.x=player.y>.05?-.5:sw*.7;b.legR.rotation.x=player.y>.05?.3:-sw*.7;b.torso.position.y=.34+(moving?Math.abs(Math.cos(player.walk))*.03:0);
  b.armL.rotation.x=-sw*.6;b.armR.rotation.x=sw*.6;b.torso.rotation.y=0;
  if(cls==='guerreiro'&&b.sword){b.sword.rotation.x=0;b.sword.rotation.z=0}
  player.atkAnim=Math.max(0,player.atkAnim-dt*(cls==='tank'?3.5:5));const k=player.atkAnim,t=1-k,ez=1-Math.pow(1-t,3);
  const rel=clamp(angDiff(player.facing,player.aimAng),-1.3,1.3);
  if(cls==='guerreiro'){if(player.spinT>0){player.spinAng+=dt*24;b.torso.rotation.y=player.spinAng-player.facing;b.armR.rotation.x=-1.5;b.armL.rotation.x=-1.2;if(b.sword)b.sword.rotation.x=Math.PI/2}
    else if(k>0){b.armR.rotation.x=lerp(-1.15,-.35,ez);b.torso.rotation.y=rel+lerp(.9,-.9,ez);
      if(b.sword){b.sword.rotation.x=Math.PI/2*Math.min(1,k*3);b.sword.rotation.z=lerp(0,-.65,ez)}}}
  else if(cls==='tank'){
    if(k>0)b.armR.rotation.x=lerp(-3,-.7,ez);
    if(b.hammer)b.hammer.rotation.x=-b.armR.rotation.x+(k>0?lerp(-1.2,2.15,ez):.07); // o martelo mantém a cabeça legível no idle e desce no golpe
    if(player.shieldT>0)b.armL.rotation.x=-1.45;
    b.bubble.visible=player.shieldT>0;
    if(b.bubble.visible){b.bubble.material.opacity=.14+Math.sin(runTime*10)*.05;
      if(b.bubbleFacets){b.bubbleFacets.rotation.y+=dt*.55;b.bubbleFacets.material.opacity=.12+Math.sin(runTime*6)*.05}
      if(b.bubbleCore)b.bubbleCore.material.opacity=.08+Math.sin(runTime*4)*.03}}
  else if(cls==='mago'||cls==='necro'||cls==='chrono'||cls==='pistol'||cls==='dracula'||cls==='demon'||cls==='future'||cls==='human'||cls==='king'){if(k>0){b.armR.rotation.x=-1.3;b.torso.rotation.y=rel*k}}
  else if(cls==='arqueiro'){if(k>0){b.armL.rotation.x=-1.5;b.armR.rotation.x=-1.35;b.torso.rotation.y=rel*Math.min(1,k*2)}}
  applyKeep(b.keep);
  if(b.cape)b.cape.rotation.x=(moving?.07+Math.sin(player.walk)*.04:.015+Math.sin(runTime*1.6)*.012);
  if(cls==='mago'&&b.mageOrb){b.mageOrb.position.y=1.02+Math.sin(runTime*2.4)*.028;b.mageMotes.rotation.y+=dt*1.8}
  if(cls==='arqueiro'&&b.quiver)b.quiver.rotation.z=(moving?Math.sin(player.walk)*.03:Math.sin(runTime*1.7)*.012);
  if(cls==='arqueiro'&&b.bowArrow)b.bowArrow.visible=k>.12;
  if(cls==='guerreiro'&&b.plume){b.plume.rotation.z=Math.sin(runTime*2.2)*.04;b.plume.rotation.x=Math.sin(runTime*1.8)*.025}
  setFlash(b.root,player.flash>0);
  b.root.visible=!(player.invuln>0&&player.dashT<=0&&runTime>1&&Math.floor(runTime*20)%2===0);
}
function updateFX(dt){
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.vy-=p.grav*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;
    if(p.m.position.y<.03&&p.grav>0){p.m.position.y=.03;p.vy*=-.3;p.vx*=.6;p.vz*=.6}
    const k=p.t/p.life;if(k>.6)p.m.scale.setScalar(p.s*(1-(k-.6)/.4));if(k>=1){fxGroup&&fxGroup.remove(p.m);parts.splice(i,1)}}
  for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=dt;const k=Math.min(1,f.t/f.life);f.upd(k);if(k>=1){disposeFx(f);fxs.splice(i,1)}}
  const v=new THREE.Vector3();
  for(let i=texts.length-1;i>=0;i--){const t=texts[i];t.t+=dt;t.y+=dt*1.3;v.set(t.x,t.y,t.z).project(camera);
    if(v.z>1){t.el.style.opacity='0'}else{const sx=(v.x*.5+.5)*innerWidth,sy=(-v.y*.5+.5)*innerHeight,s=t.t<.1?1+(.1-t.t)*5:1;
      t.el.style.transform=`translate(${sx}px,${sy}px) translate(-50%,-50%) scale(${s})`;t.el.style.opacity=String(Math.max(0,1-Math.max(0,t.t-.4)/.4))}
    if(t.t>.8){t.el.remove();texts.splice(i,1)}}
}
// radar: norte para cima, 48 blocos em volta do herói
let miniT=0;
function drawMini(){
  const c=$('#mini'),x=c.getContext('2d'),S=c.width/48,cx=player.x,cz=player.z,half=24;x.clearRect(0,0,c.width,c.height);
  x.save();x.beginPath();x.arc(c.width/2,c.height/2,c.width/2,0,TAU);x.clip();
  for(let j=-half;j<half;j++)for(let i=-half;i<half;i++){const X=Math.round(cx)+i,Z=Math.round(cz)+j;if(X<0||Z<0||X>=W||Z>=H){x.fillStyle='#2a2a26';}else{const g=grid[Z*W+X];if(!g)continue;x.fillStyle=g===1?'#4a4c44':g===2?'#2f5a2a':'#6a6a66'}x.fillRect((i+half)*S,(j+half)*S,S,S)}
  const P=(px,pz)=>[(px-cx+half)*S,(pz-cz+half)*S];
  x.fillStyle='#f2b84b';for(const ch of chests)if(!ch.open){const[a,b]=P(ch.x,ch.z);x.fillRect(a-3,b-3,6,6)}
  x.fillStyle='#d23b2f';for(const T of totems)if(!T.used){const[a,b]=P(T.x,T.z);x.fillRect(a-3,b-3,6,6)}
  if(landPos){x.fillStyle='#ff8a3a';for(const f of landPos.fire){const[a,b]=P(f.x,f.z);x.fillRect(a-2,b-2,4,4)}
    x.fillStyle='#b08aff';for(const cr of landPos.cry){const[a,b]=P(cr.x,cr.z);x.fillRect(a-1.5,b-1.5,3,3)}}
  x.fillStyle='#e5473c';for(const e of enemies){const[a,b]=P(e.x,e.z);if(e.boss){x.fillStyle='#ff8a4a';x.fillRect(a-5,b-5,10,10);x.fillStyle='#e5473c'}else x.fillRect(a-1.5,b-1.5,3,3)}
  x.restore();
  const m=c.width/2;x.fillStyle='#fff';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(m,m);x.lineTo(m+Math.sin(player.facing)*12,m+Math.cos(player.facing)*12);x.stroke();x.fillRect(m-3,m-3,6,6);
}
/* ================= mapa completo (tecla M) ================= */
function buildMapUI(){
  mapScreen=document.createElement('div');
  mapScreen.style.cssText='position:fixed;inset:0;z-index:40;display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(8,6,12,.84)';
  const title=document.createElement('div');title.style.cssText='font-family:var(--display,monospace);color:var(--gold,#f2b84b);font-size:16px;letter-spacing:.06em;text-shadow:2px 2px 0 #000';
  title.textContent='🗺️ MAPA — 🪙 tesouro · 🔥 fogueira · 💎 cristal · 🧲 totem';
  mapCanvas=document.createElement('canvas');mapCanvas.width=512;mapCanvas.height=512;
  mapCanvas.style.cssText='width:min(80vmin,560px);height:min(80vmin,560px);border:2px solid var(--edge,#3b3249);box-shadow:6px 6px 0 #000;background:#0c0a12;image-rendering:pixelated';
  const hint=document.createElement('div');hint.style.cssText='font-family:var(--body,sans-serif);color:var(--dust,#a99db8);font-size:12px';hint.textContent='M ou ESC fecha · ◆ tesouro · ◇ aberto · 🔥 fogueira · 💎 cristal · 🧲 totem';
  mapScreen.append(title,mapCanvas,hint);document.body.appendChild(mapScreen);
  mapScreen.addEventListener('click',()=>toggleMap());
}
function drawMap(){
  if(!mapCanvas||!grid)return;const c=mapCanvas,x=c.getContext('2d'),S=c.width/W;
  x.fillStyle='#17331a';x.fillRect(0,0,c.width,c.height);
  // montanhas (relevo rochoso)
  for(let z=0;z<H;z+=2)for(let i=0;i<W;i+=2){const y=relief(i,z);if(y>1.6){x.fillStyle=y>3.5?'#4d524b':'#3b463e';x.fillRect(i*S,z*S,S*2,S*2)}}
  for(let z=0;z<H;z++)for(let i=0;i<W;i++){const g=grid[z*W+i];if(!g)continue;x.fillStyle=g===1?'#3a3d36':g===2?'#245c24':'#5a5a56';x.fillRect(i*S,z*S,S,S)}
  // tesouros
  for(const ch of chests){const a=ch.x*S,b=ch.z*S;
    if(ch.open){x.strokeStyle='#8a7a46';x.lineWidth=2;x.beginPath();x.moveTo(a,b-5);x.lineTo(a+5,b);x.lineTo(a,b+5);x.lineTo(a-5,b);x.closePath();x.stroke()}
    else{x.fillStyle='#f2b84b';x.beginPath();x.moveTo(a,b-6);x.lineTo(a+6,b);x.lineTo(a,b+6);x.lineTo(a-6,b);x.closePath();x.fill();x.strokeStyle='#fff6d0';x.lineWidth=1.5;x.stroke()}}
  // marcos do campo
  if(landPos){x.fillStyle='#ff8a3a';for(const f of landPos.fire)x.fillRect(f.x*S-2,f.z*S-2,4,4);
    x.fillStyle='#b08aff';for(const cr of landPos.cry)x.fillRect(cr.x*S-2,cr.z*S-2,4,4);
    x.fillStyle='#8a8a80';for(const g of landPos.grave)x.fillRect(g.x*S-1,g.z*S-1,2,2)}
  // totens de íma
  for(const T of totems){const a=T.x*S,b=T.z*S;if(!T.used){x.fillStyle='#ffd9d0';x.fillRect(a-4,b-4,8,8)}x.fillStyle=T.used?'#5c4a40':'#e5473c';x.fillRect(a-3,b-3,6,6)}
  // inimigos + chefe
  x.fillStyle='#e5473c';for(const e of enemies)x.fillRect(e.x*S-1.5,e.z*S-1.5,3,3);
  if(boss){x.fillStyle='#ff8a4a';x.fillRect(boss.x*S-5,boss.z*S-5,10,10)}
  // jogador (seta)
  const px=player.x*S,pz=player.z*S,f=player.facing;x.fillStyle='#fff';
  x.beginPath();x.moveTo(px+Math.sin(f)*10,pz+Math.cos(f)*10);x.lineTo(px+Math.sin(f+2.5)*6,pz+Math.cos(f+2.5)*6);x.lineTo(px+Math.sin(f-2.5)*6,pz+Math.cos(f-2.5)*6);x.closePath();x.fill();
}
function toggleMap(){
  if(state!=='play'&&!mapOpen)return;
  if(!mapScreen)buildMapUI();
  mapOpen=!mapOpen;mapScreen.style.display=mapOpen?'flex':'none';
  if(mapOpen){for(const k in keys)keys[k]=false;drawMap()}
}
// toque no mini-mapa → abre/fecha o mapa completo (no celular não existe a tecla M);
// arrastar continua girando a câmera — só um toque curto e parado abre o mapa
(()=>{const mm=$('#mini');if(!mm)return;let px=0,py=0,pt=0;
mm.addEventListener('pointerdown',e=>{px=e.clientX;py=e.clientY;pt=performance.now()});
mm.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-px,e.clientY-py)<16&&performance.now()-pt<500&&(state==='play'||mapOpen))toggleMap()});
})();
function hud(){
  $('#h-hp').style.width=(clamp(player.hp/player.maxHp,0,1)*100)+'%';$('#h-hpt').textContent=Math.max(0,Math.ceil(player.hp))+' / '+Math.round(player.maxHp);
  $('#xp-fill').style.width=(player.xp/player.xpNeed*100)+'%';$('#xp-lvl').textContent='NV '+player.lvl;$('#h-lvl').textContent='Nível '+player.lvl;
  const C=CLASSES[player.cls],abT=C.ab.cd*player.stats.cdr;const ab=$('#sk-ab');ab.style.setProperty('--p',String(player.abCd/abT));ab.classList.toggle('ready',player.abCd<=0);
  const ds=$('#sk-dash');ds.style.setProperty('--p',String(player.dashCd/(1.1*player.stats.dashCd)));ds.classList.toggle('ready',player.dashCd<=0);
  $('#t-ab').classList.toggle('cool',player.abCd>0);$('#t-dash').classList.toggle('cool',player.dashCd>0);
  $('#h-time').textContent=fmtT(runTime);$('#h-kills').textContent=kills;$('#h-lvlc').textContent=player.lvl;
  $('#h-wave').textContent=hordeN?'Horda '+hordeN:'Próxima horda em '+Math.ceil(nextHorde-runTime)+'s';
  $('#h-boss').textContent=boss?'':'Chefe em '+fmtT(Math.max(0,nextBoss-runTime));
}
// céu: dia → pôr do sol → noite ao longo de 12 minutos
function setSky(k){
  if(k<.5)skyC.copy(SKY_DAY).lerp(SKY_DUSK,k*2);else skyC.copy(SKY_DUSK).lerp(SKY_NIGHT,(k-.5)*2);
  scene.background.copy(skyC);scene.fog.color.copy(skyC);scene.fog.near=lerp(26,16,k);scene.fog.far=lerp(70,48,k);
  hemi.intensity=lerp(.7,.34,k);sun.intensity=lerp(.9,.26,k);sun.color.setHSL(lerp(.11,.62,k),lerp(.6,.35,k),lerp(.9,.75,k));heroLight.intensity=lerp(.3,1.4,k);
}

/* ================= laço ================= */
// fogueiras do campo: mesmo coração da animação do título — chama tremulando, fumaça subindo, luz quente só de perto
const ffm4=new THREE.Matrix4(),ffq=new THREE.Quaternion(),ffp=new THREE.Vector3(),ffs=new THREE.Vector3(),ffup=new THREE.Vector3(0,1,0);
function updFireFx(dt){const F=fireFx;if(!F||!F.mesh||!level)return;F.t+=dt;const t=F.t;
  flameMat.color.setHSL(.07,.95,.5+.13*Math.sin(t*13)+.07*Math.sin(t*41));
  for(let i=0;i<F.base.length;i++){const b=F.base[i],w=Math.sin(t*9+b.ph)+Math.sin(t*13.7+b.ph*1.3); // cada fogueira com fase própria
    ffq.setFromAxisAngle(ffup,b.ry);ffm4.compose(ffp.set(b.x,b.y+w*.03,b.z),ffq,ffs.set(b.sc*(1-w*.09),b.sc*(1+w*.14),b.sc*(1-w*.09)));F.mesh.setMatrixAt(i,ffm4)}
  F.mesh.instanceMatrix.needsUpdate=true;
  for(const sm of F.smokes){const ph=((t*.22)+sm.ph)%1;
    sm.m.position.set(sm.x+Math.sin(t*.8+sm.ph*9)*.16,sm.y+.75+ph*1.7,sm.z+Math.cos(t*.6+sm.ph*7)*.16);
    sm.m.scale.setScalar(.14+ph*.34);sm.m.material.opacity=.2*(1-ph)}
  for(const li of F.lights){li.visible=Math.abs(player.x-li.position.x)<15&&Math.abs(li.position.z-player.z)<15; // não paga luz longe (mobile)
    if(li.visible)li.intensity=1.4+Math.sin(t*11+li.position.x)*.25+Math.sin(t*23.3+li.position.z)*.15}}
let last=performance.now();
function frame(now){
  requestAnimationFrame(frame);const rt=Math.min(.05,(now-last)/1000);last=now;
  if(hitStopT>0)hitStopT-=rt; // hit-stop: o mundo desacelera num piscar nos momentos fortes
  const dt=(hitStopT>0&&!reduceMotion)?rt*.18:rt;
  if(galleryOpen){updateGallery(dt);renderer.render(galScene,camera);return} // sala de testes: cena isolada
  const inMenu=state==='menu'||state==='title'||state==='howto'||state==='recs';
  const fov=inMenu?42:(camera.aspect<1?74:64);if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix()}
  updTitleAmb();updFieldMusic();
  if(inMenu){setSky(.22);updateMenu(dt)}
  else if(player.model&&grid){
    if(state==='play'&&!mapOpen)update(dt);
    if(state==='dying'){deadT-=dt;if(deadT<=0)showDeath()}
    if((state==='play'&&!mapOpen)||state==='dying')updateFX(dt);
    setSky(clamp(runTime/720,0,1));moonA=clamp(moonA+(moonOn?dt:-dt)*.7,0,1);
if(moonA>.001){scene.background.lerp(MOON_RED,moonA*.85);scene.fog.color.copy(scene.background);scene.fog.far=lerp(scene.fog.far,42,moonA);sun.intensity*=(1-moonA*.5);hemi.intensity*=(1-moonA*.35)}
    updFireFx(dt); // fogueiras do campo com a mesma animação da do título
    const tall=camera.aspect<1?1.15:1;shake=Math.max(0,shake-dt*1.6);const sx=(Math.random()-.5)*shake,sz=(Math.random()-.5)*shake;
    const foll=Math.min(1,dt*8);camFx+=(player.x-camFx)*foll;camFz+=(player.z-camFz)*foll;
    const bx=-Math.sin(camYaw),bz=-Math.cos(camYaw),MAXD=camZoom*tall,cp=Math.cos(camPitch),sp=Math.sin(camPitch),base=1.3+player.y*.5;let D=MAXD;
    for(let s=.4;s<=MAXD;s+=.1){const qx=camFx+bx*s*cp,qz=camFz+bz*s*cp,qy=base+s*sp;if(wallH(qx,qz)>qy||relief(qx,qz)>qy-.25){D=Math.max(.7,s-.35);break}}
    camDist=D<camDist?D:lerp(camDist,D,Math.min(1,dt*3));
    const cx0=camFx+bx*camDist*cp,cz0=camFz+bz*camDist*cp;const cy=Math.max(.35,base+camDist*sp,relief(cx0,cz0)+.9);
    camera.position.set(cx0+sx,cy+sz*.4,cz0+sz);camera.lookAt(camFx-bx*2.4,.95+player.y*.4+(.32-camPitch)*2.2,camFz-bz*2.4);
    const fx=player.x-bx*8,fz=player.z-bz*8;sun.position.set(fx+13,9,fz+8); // sol baixo de entardecer: sombras longas e quentessun.target.position.set(fx,0,fz);
    heroLight.position.set(player.x,1.8+player.y,player.z);
    if(state==='play'){hud();miniT-=dt;if(miniT<=0){miniT=.1;drawMini()}}
  }
  hurtA=Math.max(0,hurtA-dt*2.2);$('#hurt').style.opacity=String(hurtA);
  if(toastT>0){toastT-=dt;if(toastT<=0)$('#toast').classList.remove('show')}
  renderer.render(scene,camera);
}
function renderBest(){const b=store.get('cv_bestT',{});let k=null;for(const c of ORDER)if(b[c]&&(!k||b[c]>b[k]))k=c;
 const local=k?'★ SEU MELHOR '+fmtT(b[k])+' · '+CLASSES[k].nome:'';
 const wr=WORLD_RECS.length?'🌍 RECORDE MUNDIAL '+WORLD_RECS[0].name+' · '+fmtT(WORLD_RECS[0].time):'';
 $('#t-best').textContent=[local,wr].filter(Boolean).join('   ')}
// ============ RECORDES MUNDIAIS (placar da comunidade — os primeiros da história do Oathbound) ============
// Para adicionar um novo: copie a linha e edite name/cls/time(seg)/kills/lvl/date
const WORLD_RECS=[
 {name:'C4.09',cls:'mago',time:1944,kills:10008,lvl:65,date:'23/10/26'}, // 1º recorde mundial: 32:24 · 10.008 abates · NV 65
 {name:'C4.09',cls:'guerreiro',time:915,kills:8124,lvl:59,date:'23/10/26'} // C4.09 com o guerreiro: 15:15 · 8.124 abates · NV 59
];
let recTab=0;
function renderRecs(){const st=metaStat(),w=$('#recs-list');w.innerHTML='';
 const CATS=[
  {key:'cv_bestT',ic:'⏳',t:'TEMPO VIVO',get:r=>r.time,fmt:v=>fmtT(v),zero:'--:--'},
  {key:'cv_bestK',ic:'💀',t:'ABATES',get:r=>r.kills,fmt:v=>fmtN(v),zero:'0'},
  {key:'cv_bestL',ic:'⭐',t:'NÍVEL',get:r=>r.lvl,fmt:v=>'NV '+v,zero:'--'}];
 const hd=document.createElement('div');hd.className='rhead';
 hd.innerHTML=`<b>RECORDES</b><span class="rhs">${emIc('🌍')||'🌍'} ${WORLD_RECS.length?WORLD_RECS.length+' mundial'+(WORLD_RECS.length>1?'is':''):''}</span>`;w.appendChild(hd);
 const tb=document.createElement('div');tb.className='rtabs';w.appendChild(tb);
 const tbl=document.createElement('div');tbl.className='rtable';w.appendChild(tbl);
 const yw=document.createElement('div');yw.className='ryou';w.appendChild(yw);
 const draw=()=>{const c=CATS[recTab];
  tb.innerHTML='';
  CATS.forEach((cc,i)=>{const b=document.createElement('button');b.type='button';b.className='rtab'+(i===recTab?' on':'');b.innerHTML=`${emIc(cc.ic)} ${cc.t}`;b.onclick=()=>{recTab=i;draw()};tb.appendChild(b)});
  const rows=WORLD_RECS.map(r=>({n:r.name,k:r.cls,v:c.get(r)})).sort((a,b)=>b.v-a.v);
  const m2=store.get(c.key,{});
  tbl.innerHTML=`<div class="rrh"><span class="rk">#</span><span class="rc">CLASSE</span><span class="rn">JOGADOR</span><span class="rv">${c.t}</span></div>`+
   rows.map((r,i)=>`<div class="rr"><span class="rk${i===0?' g':''}">#${i+1}</span><span class="rc">${clsImg(r.k)}</span><span class="rn" title="${CLASSES[r.k]?CLASSES[r.k].nome:''}">${r.n}</span><span class="rv">${c.fmt(r.v)}</span></div>`).join('');
  const yv=m2[selCls]||0;
  yw.innerHTML=`<span class="yt">VOCÊ</span><span class="rc">${clsImg(selCls)}</span><b>${CLASSES[selCls].nome}</b><span class="rv">${yv?c.fmt(yv):c.zero}</span>`;};
 draw();
 $('#recs-sum').textContent=`${st.runs} partidas · ${st.kills} abates no total · ${st.bosses} golens derrotados`;}
function updateCoins(){$('#coins-n').textContent=coins();$('#coins').hidden=!['title','menu','shop','ach','recs','play','pause','upgrade','dying'].includes(state);
  if(!store.get('cv_unlocked',{}).king&&coins()>=MISSION.king.goal){doUnlock('king');toast('👑 '+CLASSES.king.nome+' liberado!','Missão cumprida: '+fmtN(MISSION.king.goal)+' de ouro acumulado')}}
function renderShop(){const w=$('#shop-list');w.innerHTML='';const s=shopLv();
  SHOP.forEach(it=>{const lv=s[it.id]||0,maxed=lv>=it.max,cost=it.cost(lv+1);
    const b=document.createElement('div');b.className='shopit'+(maxed?' max':'');
    b.innerHTML=`<div class="up-ic">${emIc(it.ic)||it.ic}</div><div class="up-body"><h3>${it.nome}</h3><p>${it.desc(lv+1)}</p></div><button class="buy" ${maxed?'disabled':''}>${maxed?'MÁX':'🪙 '+cost}</button>`;
    const btn=b.querySelector('.buy');if(!maxed&&btn)btn.onclick=()=>{if(coins()>=cost){addCoins(-cost);s[it.id]=lv+1;store.set('cv_shop',s);renderShop();updateCoins()}else{btn.classList.add('no');btn.textContent='sem ouro';setTimeout(()=>{btn.classList.remove('no');btn.textContent='🪙 '+cost},700)}};
    w.appendChild(b)})}
function renderAch(){const w=$('#ach-list');w.innerHTML='';const st=metaStat();
  ACH.forEach(a=>{const cur=a.cur(st),done=cur>=a.goal,pct=Math.min(1,cur/a.goal)*100;
    const curT=a.time?fmtT(Math.min(cur,a.goal)):Math.min(cur,a.goal),goalT=a.time?fmtT(a.goal):a.goal;
    const d=document.createElement('div');d.className='achit'+(done?' done':'');
    d.innerHTML=`<div class="up-ic">${done?'✅':(emIc(a.ic)||a.ic)}</div><div class="up-body"><div class="up-top"><span class="rar">${a.nome}</span><span class="lvl">${done?'✓ ':''}${emIc('🪙')} ${a.rw}</span></div><p>${a.desc}</p><div class="pbar"><i style="width:${pct}%"></i></div><span class="pnum">${curT} / ${goalT}</span></div>`;
    w.appendChild(d)})}
/* ================= terminal de cheats (Ctrl+Alt+C) ================= */
let cheatOpen=false,cheatBox=null,cheatLog=null,cheatIn=null,cheatHist=[],cheatHi=0;
function buildCheatUI(){
  cheatBox=document.createElement('div');
  cheatBox.style.cssText='position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;width:min(620px,94vw);'
    +'background:rgba(12,10,18,.96);border:2px solid var(--arcane,#62b8ff);box-shadow:6px 6px 0 #000;font-family:var(--display,monospace);color:#cfe8ff;display:none';
  const title=document.createElement('div');
  title.style.cssText='padding:7px 10px;background:var(--arcane,#62b8ff);color:#06121f;font-size:12px;letter-spacing:.06em;display:flex;justify-content:space-between';
  title.innerHTML='<span>▚ TERMINAL DE TESTES</span><span style="opacity:.8">Ctrl+Alt+C · ESC fecha</span>';
  cheatLog=document.createElement('div');
  cheatLog.style.cssText='height:180px;overflow-y:auto;padding:8px 10px;font-size:12px;line-height:1.5;white-space:pre-wrap;font-family:var(--body,monospace)';
  const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 10px;border-top:1px solid #2a3a4a';
  const pr=document.createElement('span');pr.textContent='›';pr.style.cssText='color:var(--arcane,#62b8ff);font-size:16px';
  cheatIn=document.createElement('input');cheatIn.type='text';cheatIn.autocomplete='off';cheatIn.spellcheck=false;
  cheatIn.placeholder='digite um comando (help)';
  cheatIn.style.cssText='flex:1;background:#06101a;border:1px solid #2a3a4a;color:#eaf4ff;font:14px var(--body,monospace);padding:7px 9px;outline:none';
  row.append(pr,cheatIn);cheatBox.append(title,cheatLog,row);document.body.appendChild(cheatBox);
  cheatIn.addEventListener('keydown',ev=>{
    ev.stopPropagation();
    if(ev.ctrlKey&&ev.altKey&&ev.code==='KeyC'){ev.preventDefault();toggleCheat();return}
    if(ev.code==='Enter'){const v=cheatIn.value.trim();if(v){cheatHist.push(v);cheatHi=cheatHist.length;runCheat(v)}cheatIn.value=''}
    else if(ev.code==='Escape'){ev.preventDefault();toggleCheat()}
    else if(ev.code==='ArrowUp'){ev.preventDefault();if(cheatHi>0){cheatHi--;cheatIn.value=cheatHist[cheatHi]||''}}
    else if(ev.code==='ArrowDown'){ev.preventDefault();if(cheatHi<cheatHist.length){cheatHi++;cheatIn.value=cheatHist[cheatHi]||''}}
  });
  clog('Terminal de testes pronto. Digite "help".','#7fe0a8');
}
function clog(msg,color){if(!cheatLog)return;const d=document.createElement('div');if(color)d.style.color=color;d.textContent=msg;cheatLog.appendChild(d);cheatLog.scrollTop=cheatLog.scrollHeight}
function toggleCheat(){
  if(!cheatBox)buildCheatUI();
  cheatOpen=!cheatOpen;cheatBox.style.display=cheatOpen?'block':'none';
  if(cheatOpen){for(const k in keys)keys[k]=false;setTimeout(()=>cheatIn.focus(),0)}else cheatIn.blur();
}
const CHEAT_HELP=[
  'help · lista os comandos',
  'galeria · abre a sala de testes (ver todos os modelos em 360°)',
  'arte · abre a galeria de imagens (rostos, skins) e emoticons',
  'god · liga/desliga invencibilidade',
  'heal · cura total',
  'hp N · define vida máxima',
  'gold N · adiciona ouro',
  'xp N · adiciona experiência',
  'lvl N · sobe N níveis',
  'speed X · multiplicador de velocidade (ex: 2)',
  'dmg X · multiplicador de dano (ex: 5)',
  'kill · elimina todos os inimigos (e o chefe)',
  'boss · invoca o Golem agora',
  'spawn TIPO [N] · cria inimigos (slime,slimeB,bat,spider,zombie,skel,brute)',
  'wave · adianta a próxima horda',
  'time SEG · pula o cronômetro (escala a dificuldade)',
  'unlock [all|classe] · libera classes',
  'clear · limpa o terminal',
];
/* ================= galeria / sala de testes (terminal: galeria) ================= */
let galleryOpen=false,galleryItems=null,galleryIdx=0,galleryObj=null,galScene=null,galGroup=null,galleryUI=null,galNameEl=null,galYaw=0,galSpin=true,galDist=5,galTY=1,galH=2,galDrag=false,galLX=0;
function buildEnemyDisplay(type){const g=new THREE.Group();
  if(LEGGED[type]||type==='bat'){g.add(new THREE.Mesh(enemyBodyGeo(type),vcMat));
    if(LEGGED[type]){const l=new THREE.Mesh(enemyLegGeo(type),vcMat),r=new THREE.Mesh(enemyLegGeo(type),vcMat);l.position.set(-.11,.34,0);r.position.set(.11,.34,0);g.add(l,r)}
    else{const wl=new THREE.Mesh(batWingGeo(-1),vcMat),wr=new THREE.Mesh(batWingGeo(1),vcMat);wl.position.set(-.15,.95,0);wr.position.set(.15,.95,0);g.add(wl,wr)}}
  else g.add(new THREE.Mesh(enemyGeo(type),vcMat));
  return g}
function buildGalleryItems(){const items=[];
  ORDER.forEach(k=>items.push({name:CLASSES[k].nome+' · '+CLSTIPO[k],make:()=>buildHero(k).root}));
  const EN={slime:'Slime',slimeB:'Slime Azul',bat:'Morcego',spider:'Aranha',zombie:'Zumbi',skel:'Esqueleto',brute:'Brutamontes',ogre:'Ogro'};
  for(const t in ENEMIES)items.push({name:(EN[t]||t)+' · inimigo',make:()=>buildEnemyDisplay(t)});
  // minions dos heróis (modelo solo + combo com o dono)
  items.push({name:'Esqueleto Necromante · minion do Necronus',make:()=>buildMinionMesh().g});
  items.push({name:'Soldado Real · minion do Midas',make:()=>buildMinionMesh(true).g});
  items.push({name:'Necronus + Horda de Esqueletos · combo',make:()=>{const g=new THREE.Group();g.add(buildHero('necro').root);
    for(let i=0;i<3;i++){const a=Math.PI*.6+i*Math.PI*.4;const m=buildMinionMesh(false).g;m.position.set(Math.sin(a)*1.35,0,Math.cos(a)*1.35);m.rotation.y=a+Math.PI;g.add(m)}return g}});
  items.push({name:'Midas + Guarda Real · combo',make:()=>{const g=new THREE.Group();g.add(buildHero('king').root);
    for(let i=0;i<4;i++){const a=Math.PI*.5+i*Math.PI*.5;const m=buildMinionMesh(true).g;m.position.set(Math.sin(a)*1.45,0,Math.cos(a)*1.45);m.rotation.y=a+Math.PI;g.add(m)}return g}});
  items.push({name:'Golem do Campo · chefe',make:()=>buildGolem().root});
  items.push({name:'Ogro Brutamontes · chefe',make:()=>buildOgre().root});
  const TR=['Carvalho','Pinheiro','Arbusto','Árvore de Outono','Bétula','Árvore Morta'];
  TREE_GEOS.forEach((g,i)=>items.push({name:(TR[i]||'Árvore '+(i+1))+' · árvore',make:()=>new THREE.Mesh(g,treeMat)}));
  ROCK_GEOS.forEach((g,i)=>items.push({name:'Pedra '+(i+1)+' · cenário',make:()=>new THREE.Mesh(g,treeMat)}));
  // decoração do campo
  items.push({name:'Fogueira · decoração',make:()=>{const g=new THREE.Group();g.add(new THREE.Mesh(DECOR_GEO.fire,treeMat),new THREE.Mesh(DECOR_GEO.flame,new THREE.MeshBasicMaterial({color:0xff8a2a})));return g}});
  items.push({name:'Cristal Arcano · decoração',make:()=>new THREE.Mesh(DECOR_GEO.crystal,new THREE.MeshBasicMaterial({vertexColors:true}))});
  items.push({name:'Cogumelo · decoração',make:()=>new THREE.Mesh(DECOR_GEO.shroom,treeMat)});
  items.push({name:'Lápide · decoração',make:()=>new THREE.Mesh(DECOR_GEO.grave,treeMat)});
  items.push({name:'Cruz · decoração',make:()=>new THREE.Mesh(DECOR_GEO.cross,treeMat)});
  items.push({name:'Toco · decoração',make:()=>new THREE.Mesh(DECOR_GEO.stump,treeMat)});
  items.push({name:'Baú · tesouro',make:buildChestDisplay});
  items.push({name:'Caixão · decoração',make:()=>buildCoffin(true)});
  return items}
// totem de íma (uso único): pilar de pedra com íma flutuando. Ao gastar, o íma apaga e sobra uma tampa escura
function makeTotem(){const g=new THREE.Group();
  vox(g,0,.11,0,1.05,.22,1.05,0x6f6a63);vox(g,0,.28,0,.82,.14,.82,0x837e74);vox(g,0,.42,0,.6,.1,.6,0x74706a);
  vox(g,0,.95,0,.46,1,.46,0x8f8a80);vox(g,-.23,.95,0,.1,1,.5,0x7d786f);vox(g,.23,.95,0,.1,1,.5,0x7d786f);
  vox(g,0,.7,.25,.4,.14,.07,0xd23b2f,.6); // runa vermelha na frente
  const m=new THREE.Group();m.name='mag';m.position.y=1.95;
  vox(m,-.13,.06,0,.13,.34,.15,0xd23b2f,.45);vox(m,.13,.06,0,.13,.34,.15,0xd23b2f,.45);vox(m,0,-.11,0,.39,.13,.15,0xd23b2f,.45);
  vox(m,-.13,.24,0,.13,.1,.16,0xeeeeee,.5);vox(m,.13,.24,0,.13,.1,.16,0xeeeeee,.5);
  g.add(m);
  const off=new THREE.Group();off.name='off';off.visible=false;vox(off,0,1.5,0,.3,.22,.3,0x6b665e);g.add(off);
  return {g,m,off}}
// baú detalhado (madeira + ferro + bandas douradas + ferrolho). Retorna {g, lid} pro lid animar ao abrir.
function makeChest(){const g=new THREE.Group();
  vox(g,0,.22,0,.72,.44,.5,0x7a4e24);                                       // corpo de madeira
  vox(g,0,.34,0,.76,.05,.54,0xd9a43a);vox(g,0,.1,0,.76,.05,.54,0xc8902e);    // bandas (cima/baixo)
  vox(g,-.33,.22,.23,.07,.46,.06,0x3a2a1a);vox(g,.33,.22,.23,.07,.46,.06,0x3a2a1a); // cantoneiras de ferro na frente
  vox(g,0,.25,.255,.16,.18,.03,0xd9a43a);vox(g,0,.23,.272,.05,.07,.02,0x2a1a0a);    // fechadura + buraco da chave
  const lid=new THREE.Group();lid.position.set(0,.44,-.25);g.add(lid);                // dobradiça atrás-em-cima
  vox(lid,0,.08,.25,.72,.15,.5,0x7a4e24);vox(lid,0,.17,.25,.7,.08,.32,0x875528);      // tampa + lombada arqueada
  vox(lid,-.24,.11,.25,.06,.2,.54,0xd9a43a);vox(lid,.24,.11,.25,.06,.2,.54,0xd9a43a); // bandas douradas
  vox(lid,0,-.02,.53,.14,.15,.04,0xe8c558);vox(lid,0,-.04,.552,.05,.07,.02,0x2a1a0a); // ferrolho
  return{g,lid}}
function buildChestDisplay(){const{g,lid}=makeChest();lid.rotation.x=-1.2;return g}
function ensureGalScene(){if(galScene)return;
  galScene=new THREE.Scene();galScene.background=new THREE.Color(0x14121c);
  galScene.add(new THREE.HemisphereLight(0xffffff,0x3a3a4a,.95));
  const d1=new THREE.DirectionalLight(0xffffff,.75);d1.position.set(4,8,5);galScene.add(d1);
  const d2=new THREE.DirectionalLight(0x88aaff,.35);d2.position.set(-5,3,-4);galScene.add(d2);
  galScene.add(new THREE.AmbientLight(0x5858a0,.35));
  const plat=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.9,.3,36),new THREE.MeshLambertMaterial({color:0x2a2535}));plat.position.y=-.15;galScene.add(plat);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.75,.04,8,40),new THREE.MeshBasicMaterial({color:0x62b8ff}));ring.rotation.x=Math.PI/2;ring.position.y=.01;galScene.add(ring);
  galGroup=new THREE.Group();galScene.add(galGroup)}
function galleryShow(i){galleryIdx=(i+galleryItems.length)%galleryItems.length;
  while(galGroup.children.length)galGroup.remove(galGroup.children[0]);
  const it=galleryItems[galleryIdx];galleryObj=it.make();galGroup.add(galleryObj);galYaw=0;galSpin=true;
  const box=new THREE.Box3().setFromObject(galleryObj),sz=new THREE.Vector3(),ctr=new THREE.Vector3();box.getSize(sz);box.getCenter(ctr);
  galleryObj.position.x-=ctr.x;galleryObj.position.z-=ctr.z; // centraliza na plataforma
  const m=Math.max(sz.x,sz.y,sz.z,.6);galDist=m*1.9+1.3;galTY=ctr.y;galH=ctr.y+m*.4;
  if(galNameEl)galNameEl.textContent=(galleryIdx+1)+' / '+galleryItems.length+' · '+it.name}
function galleryStep(d){galleryShow(galleryIdx+d)}
function buildGalleryUI(){galleryUI=document.createElement('div');
  galleryUI.style.cssText='position:fixed;inset:0;z-index:45;display:none;pointer-events:none';
  const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;top:0;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;background:linear-gradient(rgba(8,6,12,.85),transparent);pointer-events:auto';
  bar.innerHTML='<span style="font-family:var(--display,monospace);color:var(--arcane,#62b8ff);font-size:14px;letter-spacing:.06em">▚ SALA DE TESTES</span><span style="font-family:var(--body);color:var(--dust,#a99db8);font-size:12px">← → troca · arraste pra girar · ESC fecha</span>';
  const foot=document.createElement('div');foot.style.cssText='position:absolute;left:0;right:0;bottom:24px;display:flex;justify-content:center;align-items:center;gap:14px;pointer-events:auto';
  const bst='font-family:var(--display,monospace);font-size:20px;background:var(--stone,#191521);color:var(--bone,#efe6d6);border:2px solid var(--edge,#3b3249);box-shadow:3px 3px 0 #000;width:46px;height:46px;cursor:pointer';
  const prev=document.createElement('button');prev.style.cssText=bst;prev.textContent='◀';prev.onclick=()=>galleryStep(-1);
  const next=document.createElement('button');next.style.cssText=bst;next.textContent='▶';next.onclick=()=>galleryStep(1);
  galNameEl=document.createElement('div');galNameEl.style.cssText='min-width:240px;text-align:center;font-family:var(--display,monospace);color:var(--gold,#f2b84b);font-size:15px;text-shadow:2px 2px 0 #000;background:rgba(8,6,12,.72);border:2px solid var(--edge,#3b3249);padding:9px 14px';
  foot.append(prev,galNameEl,next);galleryUI.append(bar,foot);document.body.appendChild(galleryUI);
  addEventListener('pointerdown',e=>{if(galleryOpen&&e.target.tagName!=='BUTTON'){galDrag=true;galSpin=false;galLX=e.clientX}});
  addEventListener('pointerup',()=>{galDrag=false});
  addEventListener('pointermove',e=>{if(galDrag){galYaw-=(e.clientX-galLX)*.012;galLX=e.clientX}})}
function toggleGallery(){ensureGalScene();if(!galleryItems)galleryItems=buildGalleryItems();if(!galleryUI)buildGalleryUI();
  galleryOpen=!galleryOpen;galleryUI.style.display=galleryOpen?'block':'none';
  const uis=['#hud','#touch','#coins','#dmg','#hurt','#lockhint'];
  if(galleryOpen){if(cheatOpen)toggleCheat();for(const k in keys)keys[k]=false;
    if(document.pointerLockElement)try{document.exitPointerLock()}catch(e){}
    uis.forEach(s=>{const el=$(s);if(el)el.hidden=true});
    document.querySelectorAll('.screen').forEach(s=>s.style.visibility='hidden');
    galleryShow(galleryIdx)}
  else{document.querySelectorAll('.screen').forEach(s=>s.style.visibility='');setScreen(state)}}
function updateGallery(dt){if(galSpin)galYaw+=dt*.5;if(galGroup)galGroup.rotation.y=galYaw;
  camera.position.set(0,galH,galDist);camera.lookAt(0,galTY,0);
  const fov=camera.aspect<1?58:46;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix()}}
/* ================= galeria de mídias & emoticons (terminal: arte) ================= */
let mediaOpen=false,mediaUI=null;
const MEDIA_SKINS=[
 ['assets/images/characters/archer.png','Arqueiro · Oliver'],
 ['assets/images/characters/chronomancer.png','Chronomante · Vespera'],
 ['assets/images/characters/demon.png','Demônio · Castiel'],
 ['assets/images/characters/dracula.png','Vampiro · Vlad'],
 ['assets/images/characters/king.png','Rei · Midas'],
 ['assets/images/characters/necrmancer.png','Necromante · Necronus'],
 ['assets/images/characters/warrior.png','Guerreiro · Darian'],
 ['assets/images/enemies/skeleton.png','Esqueleto (inimigo)'],
 ['assets/images/enemies/zombie.png','Zumbi (inimigo)'],
 ['assets/images/title.png','Logo do título'],
];
function buildMediaUI(){
 mediaUI=document.createElement('div');
 mediaUI.style.cssText='position:fixed;inset:0;z-index:9998;background:rgba(8,6,14,.97);display:none;overflow-y:auto;color:#efe6d6;font-family:var(--body,monospace)';
 const head=document.createElement('div');
 head.style.cssText='position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 20px;background:rgba(12,10,18,.97);border-bottom:2px solid var(--arcane,#62b8ff)';
 const t=document.createElement('span');t.style.cssText='font-family:var(--display,monospace);color:var(--arcane,#62b8ff);font-size:14px;letter-spacing:.06em';t.textContent='▚ GALERIA DE MÍDIAS & EMOTICONS';
 const close=document.createElement('button');close.type='button';close.textContent='✕ fechar (ESC)';close.style.cssText='background:var(--stone,#191521);color:#efe6d6;border:2px solid var(--edge,#3b3249);box-shadow:3px 3px 0 #000;padding:8px 14px;font-family:var(--display,monospace);cursor:pointer';close.onclick=()=>toggleMedia(false);
 head.append(t,close);mediaUI.append(head);
 const sec=ttl=>{const s=document.createElement('h3');s.style.cssText='margin:26px 20px 10px;font-family:var(--display,monospace);font-size:13px;letter-spacing:.08em;color:var(--gold,#f2b84b)';s.textContent=ttl;mediaUI.append(s)};
 const grid=mn=>{const g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax('+mn+'px,1fr));gap:12px;padding:0 20px';mediaUI.append(g);return g};
 const cell=(...items)=>{const c=document.createElement('div');c.style.cssText='background:rgba(255,255,255,.04);border:1px solid var(--edge,#3b3249);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;padding:12px;text-align:center';items.forEach(i=>c.append(i));return c};
 const checker='repeating-conic-gradient(#191521 0% 25%,#100d18 0% 50%) 0 0/16px 16px';
 sec('ROSTOS DAS CLASSES · pixel art 16×16 (assets/images/icons/ · node _genicons.js)');
 const g1=grid(120);
 ORDER.forEach(k=>{const C=CLASSES[k];
  const box=document.createElement('div');box.style.cssText='width:96px;height:96px;display:flex;align-items:center;justify-content:center;background:'+checker+';border:2px solid '+C.ui;
  const im=new Image();im.src=CLSICON[k];im.width=88;im.height=88;im.style.imageRendering='pixelated';box.append(im);
  const nm=document.createElement('div');nm.style.cssText='font-family:var(--display,monospace);font-size:12px;color:'+C.ui;nm.textContent=C.nome;
  const rl=document.createElement('div');rl.style.cssText='font-size:11px;color:#a99db8';rl.textContent=CLSTIPO[k];
  g1.append(cell(box,nm,rl))});
 sec('SKINS DE REFERÊNCIA · PNGs base dos models (assets/images/)');
 const g2=grid(170);
 MEDIA_SKINS.forEach(f=>{const im=new Image();im.src=f[0];im.style.cssText='max-width:150px;max-height:150px;image-rendering:pixelated;background:'+checker+';padding:6px';
  const nm=document.createElement('div');nm.style.cssText='font-size:11px;color:#cfc4da;line-height:1.35';nm.textContent=f[1];
  g2.append(cell(im,nm))});
 sec('EMOTICONS DO JOGO · ícones de poderes e melhorias (pixel art 16×16 · assets/images/icons/upg/)');
 const icView=(slug,fb)=>{const v=document.createElement('div');v.style.cssText='height:64px;display:flex;align-items:center;justify-content:center';
   if(slug){const im=new Image();im.src='assets/images/icons/upg/'+slug+'.png?v=3';im.width=56;im.height=56;im.style.imageRendering='pixelated';v.append(im)}
   else{v.textContent=fb||'';v.style.fontSize='34px'}return v};
 const g3=grid(130);
 Object.entries(ICONS).forEach(([n,e])=>{const em=icView(UPGSLUG[n],e);em.title=n;
  const nm=document.createElement('div');nm.style.cssText='font-size:11px;color:#cfc4da;line-height:1.3';nm.textContent=n;
  g3.append(cell(em,nm))});
 sec('EMOTICONS DE INTERFACE · pixel art');
 const g4=grid(130);
 [['🪙','ouro','ouro / recompensas'],['🔒','trancado','classe bloqueada'],['🔓','desbloquear','desbloquear'],['🎯','alvo','missão de desbloqueio'],['💀','craneo','abates (HUD)'],['⭐','estrela','nível / recorde'],['👹','golem','Golem do Campo'],['⚔️','espadas','melee / título'],['⬆','seta-cima','menu: Upgrades'],['📊','grafico','menu: Recordes'],['🏆','trofeu','menu: Conquistas'],['❔','ajuda','menu: Como jogar']].forEach(p=>{const em=icView(p[1]||EMICON[p[0]],p[0]);
  const nm=document.createElement('div');nm.style.cssText='font-size:11px;color:#cfc4da;line-height:1.3';nm.textContent=p[1];g4.append(cell(em,nm))});
 mediaUI.style.paddingBottom='60px';
 document.body.appendChild(mediaUI)}
function toggleMedia(force){if(!mediaUI)buildMediaUI();mediaOpen=force!==undefined?force:!mediaOpen;mediaUI.style.display=mediaOpen?'block':'none';if(mediaOpen&&cheatOpen)toggleCheat()}

function runCheat(line){
  clog('› '+line,'#8fb7ff');
  const parts=line.trim().split(/\s+/),cmd=parts[0].toLowerCase(),a1=parts[1],num=parseFloat(a1);
  const playing=()=>{if(state!=='play'){clog('⚠ entre numa partida primeiro','#f2b84b');return false}return true};
  switch(cmd){
    case'help':CHEAT_HELP.forEach(h=>clog('  '+h));break;
    case'god':if(!playing())break;cheatGod=!cheatGod;clog('godmode: '+(cheatGod?'LIGADO 🛡️':'desligado'),'#7fe0a8');break;
    case'heal':if(!playing())break;player.hp=player.maxHp;clog('vida cheia','#7fe0a8');break;
    case'hp':if(!playing())break;if(isNaN(num)){clog('uso: hp N','#f2b84b');break}player.maxHp=num;player.hp=num;clog('vida máxima = '+num,'#7fe0a8');break;
    case'gold':case'coins':if(isNaN(num)){clog('uso: gold N','#f2b84b');break}addCoins(num);if(typeof updateCoins==='function')updateCoins();clog('ouro += '+num+' (agora '+coins()+')','#7fe0a8');break;
    case'xp':if(!playing())break;if(isNaN(num)){clog('uso: xp N','#f2b84b');break}gainXP(num);clog('xp += '+num,'#7fe0a8');break;
    case'lvl':case'level':if(!playing())break;{const n=isNaN(num)?1:Math.floor(num);for(let i=0;i<n;i++)gainXP(player.xpNeed-player.xp);clog('+'+n+' nível(is) (agora '+player.lvl+')','#7fe0a8')}break;
    case'speed':if(!playing())break;if(isNaN(num)){clog('uso: speed X','#f2b84b');break}player.stats.move=num;clog('velocidade x'+num,'#7fe0a8');break;
    case'dmg':if(!playing())break;if(isNaN(num)){clog('uso: dmg X','#f2b84b');break}player.stats.dmg=num;clog('dano x'+num,'#7fe0a8');break;
    case'kill':case'killall':if(!playing())break;{let c=0;for(const e of enemies.slice()){killEnemy(e);c++}if(boss){killEnemy(boss);c++}clog(c+' inimigo(s) eliminado(s)','#7fe0a8')}break;
    case'boss':if(!playing())break;if(boss){clog('já tem um chefe na arena','#f2b84b')}else{spawnBoss();clog('Golem invocado 👹','#7fe0a8')}break;
    case'spawn':if(!playing())break;{if(!a1||!ENEMIES[a1]){clog('tipos: '+Object.keys(ENEMIES).join(', '),'#f2b84b');break}const n=parts[2]?Math.max(1,Math.floor(parseFloat(parts[2]))):1;let c=0;for(let i=0;i<n;i++){const p=spawnPos(6,12);if(p){spawnEnemy(a1,p[0],p[1]);c++}}clog(c+'x '+a1+' criado(s)','#7fe0a8')}break;
    case'wave':if(!playing())break;nextHorde=runTime;clog('horda chegando...','#7fe0a8');break;
    case'time':if(!playing())break;if(isNaN(num)){clog('uso: time SEG','#f2b84b');break}runTime=num;clog('cronômetro = '+fmtT(num),'#7fe0a8');break;
    case'unlock':{if(a1==='all'||!a1){ORDER.forEach(doUnlock);clog('todas as classes liberadas 🔓','#7fe0a8')}else if(CLASSES[a1]){doUnlock(a1);clog(CLASSES[a1].nome+' liberado 🔓','#7fe0a8')}else clog('classe: '+ORDER.join(', '),'#f2b84b');if(state==='menu')renderCards()}break;
    case'galeria':case'gallery':case'dev':toggleGallery();clog('🏛️ sala de testes '+(galleryOpen?'aberta — ← → troca, arraste gira, ESC fecha':'fechada'),'#7fe0a8');break;
case'arte':case'midia':case'midias':case'media':case'imagens':case'emojis':toggleMedia();clog('🖼️ galeria de mídias '+(mediaOpen?'aberta — ESC fecha':'fechada'),'#7fe0a8');break;
    case'clear':cheatLog.innerHTML='';break;
    default:clog('comando desconhecido: '+cmd+' (digite "help")','#e5473c');
  }
}

(function(){const box=$('#t-embers');if(!box||reduceMotion)return;const cols=['#f2b84b','#ff8a4a','#62b8ff','#7ee05a'];
for(let i=0;i<16;i++){const e=document.createElement('i'),s=rand(3,6);
e.style.cssText='left:'+rand(2,97).toFixed(1)+'%;width:'+s.toFixed(1)+'px;height:'+s.toFixed(1)+'px;--c:'+pick(cols)+';--sw:'+rand(-70,70).toFixed(0)+'px;--dur:'+rand(7,14).toFixed(1)+'s;--del:'+(-rand(0,14)).toFixed(1)+'s';
box.appendChild(e)}})(); // brasas sobem pela tela de título
setScreen('title');
requestAnimationFrame(frame);
if(typeof location!=='undefined'&&location.href.indexOf('shot=menu')>=0){var _hm=location.search.match(/hero=(\w+)/);setTimeout(function(){renderCards();setScreen('menu');selectClass(_hm?_hm[1]:'king')},2500)} // debug: abre o seletor (padrão Rei) pra screenshot
})();



