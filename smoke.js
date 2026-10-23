// smoke.js — exercita a lógica do jogo no Node (sem browser/WebGL)
const fs=require('fs');
let fails=[];
const ok=(cond,msg)=>{if(!cond){fails.push(msg);console.log('FALHOU:',msg)}else console.log('  ok:',msg)};

// ---------- DOM ----------
function ctx2d(){return{clearRect(){},save(){},restore(){},beginPath(){},arc(){},clip(){},fillRect(){},moveTo(){},lineTo(){},closePath(){},stroke(){},fill(){}}}
function fakeEl(){const el={children:[],style:{setProperty(){}},hidden:false,innerHTML:'',textContent:'',value:'',
  classList:{add(){},remove(){},toggle(){},contains:()=>false},
  appendChild(c){el.children.push(c);return c},append(){},remove(){},focus(){},blur(){},
  querySelector:()=>fakeEl(),querySelectorAll:()=>[],
  setAttribute(){},getAttribute:()=>null,addEventListener(){},requestPointerLock:()=>null,
  closest:()=>null,getContext:()=>ctx2d(),width:160,height:160};
  return el}
const els={};
const docEl=$=>els[$]||(els[$]=fakeEl());
global.document={createElement:()=>fakeEl(),querySelector:s=>docEl(s),querySelectorAll:()=>[],addEventListener(){},pointerLockElement:null,exitPointerLock(){},body:fakeEl()};
global.localStorage={_d:{},getItem(k){return k in this._d?this._d[k]:null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
global.matchMedia=()=>({matches:false});
global.innerWidth=1280;global.innerHeight=720;
let rafCb=null;
global.requestAnimationFrame=cb=>{rafCb=cb};
const realNow=()=>performance.now();let fakeT=realNow();
global.performance={now:()=>fakeT};
global.addEventListener=function(){};
global.window=global;

// ---------- THREE ----------
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}setScalar(v){this.x=this.y=this.z=v;return this}project(){this.z=0;return this}}
class Sc{constructor(){this.x=1;this.y=1;this.z=1}set(a,b,c){this.x=a;this.y=b;this.z=c;return this}setScalar(s){this.x=this.y=this.z=s;return this}}
class Rt{constructor(){this.x=0;this.y=0;this.z=0}}
class Color{constructor(c){this.r=1;this.g=1;this.b=1;if(typeof c==='number')this.fromHex(c)}fromHex(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}setHex(h){return this.fromHex(h)}setScalar(v){this.r=this.g=this.b=v;return this}copy(c){this.r=c.r;this.g=c.g;this.b=c.b;return this}lerp(c,t){this.r+=(c.r-this.r)*t;this.g+=(c.g-this.g)*t;this.b+=(c.b-this.b)*t;return this}offsetHSL(){return this}setHSL(){return this}getHex(){return(Math.round(this.r*255)<<16)|(Math.round(this.g*255)<<8)|Math.round(this.b*255)}}
class Mesh{constructor(g,m){this.isMesh=true;this.geometry=g;this.material=m;this.position=new V3();this.rotation=new Rt();this.scale=new Sc();this.userData={};this.visible=true;this.castShadow=false;this.receiveShadow=false;this.frustumCulled=true;this.children=[]}add(c){this.children.push(c);return c}remove(c){this.children=this.children.filter(x=>x!==c)}traverse(fn){fn(this);for(const c of this.children)if(c.traverse)c.traverse(fn)}dispose(){}}
class Grp extends Mesh{constructor(){super(undefined,undefined)}}
class Ins extends Mesh{constructor(g,m,n){super(g,m);this.count=n;this.instanceMatrix={needsUpdate:false}}setMatrixAt(){}setColorAt(){}}
function geoBox(){const n=24;return{attributes:{position:{count:n,array:new Float32Array(n*3)},normal:{array:new Float32Array(n*3)}},index:{array:Array.from({length:n},(_,i)=>i)},setAttribute(){},translate(){},dispose(){},computeBoundingSphere(){}}}
const plain=o=>Object.assign({},o,{dispose(){}});
const THREE={
  PCFSoftShadowMap:1,
  WebGLRenderer:function(){return{domElement:fakeEl(),setPixelRatio(){},setSize(){},render(){},clearColor(){},shadowMap:{enabled:false,type:0}}},
  Scene:class{constructor(){this.children=[];this.background=null;this.fog=null}add(...o){this.children.push(...o)}remove(o){this.children=this.children.filter(x=>x!==o)}},
  Fog:function(c,n,f){return{color:new Color(c),near:n,far:f}},
  Color,Vector3:V3,Quaternion:function(){return{x:0,y:0,z:0,w:1,setFromEuler(){return this},setFromAxisAngle(){return this}}},Euler:function(){return{x:0,y:0,z:0,set(){return this}}},Matrix4:function(){return{compose(){return this}}},
  PerspectiveCamera:function(fov,a){return{fov,aspect:a||1,near:.1,far:160,position:new V3(),lookAt(){},updateProjectionMatrix(){}}},
  HemisphereLight:function(){return{intensity:1,position:new V3()}},
  DirectionalLight:function(){return{intensity:1,castShadow:false,position:new V3(),color:new Color(0xffffff),target:{position:new V3()},shadow:{mapSize:{set(){}},camera:{left:0,right:0,top:0,bottom:0,near:0,far:0,updateProjectionMatrix(){}},bias:0}}},
  PointLight:function(){return{intensity:1,position:new V3()}},
  BoxGeometry:geoBox,RingGeometry:geoBox,CircleGeometry:geoBox,IcosahedronGeometry:geoBox,
  BufferGeometry:function(){return{setAttribute(){},setIndex(){},computeBoundingSphere(){},dispose(){}}},
  Float32BufferAttribute:function(a,n){return{array:a,itemSize:n}},
  MeshLambertMaterial:function(o){const m=Object.assign({},o,{dispose(){}});if(typeof m.color==='number')m.color=new Color(m.color);return m},MeshBasicMaterial:function(o){const m=Object.assign({},o,{dispose(){}});if(typeof m.color==='number')m.color=new Color(m.color);return m},
  Mesh,Group:Grp,InstancedMesh:Ins,
};
global.THREE=THREE;

// ---------- carrega o jogo exposto via __G ----------
// weapons.js e upgrades.js juntos com o game.js (no navegador são <script>s antes do game.js)
let src=fs.readFileSync('assets/js/weapons.js','utf8')+'\n'+fs.readFileSync('assets/js/upgrades.js','utf8')+'\n'+fs.readFileSync('game.js','utf8');
const i=src.lastIndexOf('})();');
const hook=`window.__G={newRun,update,openUpgrade,chooseUpgrade,damageEnemy,gainXP,hurtPlayer,dash,jump,useAbility,spawnBoss,spawnEnemy,killEnemy,S,setMuted,player,keys,setScreen,getBoss:()=>boss,getUps:()=>($('#ups')&&$('#ups')._choice)||null,hs:()=>hitStopT,getState:()=>state,enemies:()=>enemies,projs:()=>projs,mapInfo:()=>({W,H,grid,landPos,chestN:chests.length}),jv:(x,z)=>jv(x,z),relief:(x,z)=>relief(x,z),hills:()=>HILLS.length,runCheat,toggleMap};\n})();`;
src=src.slice(0,i)+hook;
try{eval(src)}catch(e){console.log('ERRO AO CARREGAR:',e.stack);process.exit(1)}
const G=global.__G;
const frames=n=>{for(let k=0;k<n;k++){const cb=rafCb;rafCb=null;fakeT+=16.7;cb&&cb(fakeT)}};

try{
console.log('[1] carregamento / menu');
ok(G.getState()==='title','estado inicial é título');
frames(3);
console.log('[2] nova corrida (guerreiro)');
G.runCheat('unlock all'); // localStorage vazio: libera todas as classes
G.newRun('guerreiro');
ok(G.getState()==='play','partida iniciada');
ok(G.enemies().length===8,'8 slimes iniciais');
console.log('[3] combate automático + upgrades');
G.keys.KeyW=true;
let steps=0;
while(steps<2400){
  if(G.getState()==='upgrade'){const ch=G.getUps();if(ch&&ch.length===3)G.chooseUpgrade(ch[0]);else break}
  else G.update(1/60);
  steps++;
}
ok(G.player.lvl>1,'subiu de nível (nível '+G.player.lvl+')');
ok(G.player.picks.length>0,'escolheu melhorias ('+G.player.picks.length+')');
ok(G.getState()!=='upgrade','não ficou travado na tela de upgrade');
console.log('[4] morte de inimigos + hit-stop');
const p=G.player;
for(let k=0;k<3;k++)G.spawnEnemy('slime',p.x+1,p.z+0.2*k,false);
const antes=G.enemies().length;
for(const e of G.enemies().slice(0,3)){if(e.type==='slime'){G.damageEnemy(e,99999)}}
ok(G.enemies().length<antes,'inimigos morreram');
ok(G.hs()>=0,'killStop executou sem erro');
console.log('[5] chefe');
G.spawnBoss();
const b=G.getBoss();
ok(!!b,'golem invocado');
G.damageEnemy(b,1e9);
ok(G.getBoss()===null,'golem morreu e saiu da arena');
ok(G.hs()>0,'hit-stop ativo após morte do chefe');
G.setScreen('pause');frames(40);G.setScreen('play'); // pausa: sem combate novo para re-disparar
ok(G.hs()<=0,'hit-stop decaiu com os frames');
console.log('[6] esquiva / pulo / habilidade / dano');
p.dashCd=0;p.dashT=0;
G.dash();
ok(Math.abs(p.dashCd-1.1*p.stats.dashCd)<1e-6,'cooldown da esquiva = 1.1 * dashCd ('+p.dashCd.toFixed(3)+' vs esperado '+(1.1*p.stats.dashCd).toFixed(3)+')');
p.dashCd=0;G.useAbility();
ok(p.spinT>0,'habilidade do guerreiro (redemoinho) ativou');
G.jump();
ok(p.vy>0,'pulo funcionou');
G.hurtPlayer(5,null,false);
ok(p.invuln>0,'dano no herói deu invencibilidade curta');
console.log('[7] mudo + sons');
G.S('hit',true);G.S('shot','bullet');G.S('kill');G.S('level');G.S('bossin');
G.setMuted(true);
ok(els['#sndbtn'].textContent==='🔇','botão mostra mudo');
G.S('hit');G.setMuted(false);
ok(els['#sndbtn'].textContent==='🔊','botão voltou ao normal');
console.log('[8] velocidade dos projéteis respeita pspd');
G.newRun('mago');
G.player.stats.pspd=2;
G.player.atkCd=0;
for(let k=0;k<5;k++)G.spawnEnemy('slime',G.player.x,G.player.z+8+k,false);
G.update(1/60);
const pr=G.projs();
ok(pr.length>0,'mago atirou ('+pr.length+' projéteis)');
if(pr.length)ok(Math.abs(pr[0].speed-28)<0.01,'velocidade do orbe = projSpeed*pspd (esperado 28, veio '+pr[0].speed+')');
console.log('[9] upgrade por XP em lote');
G.gainXP(9999);
let guard=0;
while(G.getState()==='upgrade'&&guard++<300){const ch=G.getUps();G.chooseUpgrade(ch[0])}
ok(G.getState()==='play','voltou a jogar após escolher todos os upgrades pendentes');
console.log('[10] mapa + cheats + pausa');
G.toggleMap();G.toggleMap();
G.runCheat('unlock all');G.runCheat('god');G.runCheat('heal');
G.setScreen('pause');
ok(G.getState()==='pause','pausa abriu (renderPause sem erro)');
G.setScreen('play');
frames(3);
console.log('[11] novos upgrades estilo Megabonk');
const NOVOS=['Punho Fatal','Velocidade de Tiro','Empurrão','Reflexo Relâmpago','Pulso Congelante'];
G.newRun('mago');
const ganhos=new Set();let rounds=0;
while(rounds++<400&&ganhos.size<NOVOS.length){
  G.gainXP(G.player.xpNeed-G.player.xp+1); // sobe 1 nível e abre a oferta
  let g=0;
  while(G.getState()==='upgrade'&&g++<5){
    const ch=G.getUps();
    const alvo=ch.find(u=>NOVOS.includes(u.nome))||ch[0];
    G.chooseUpgrade(alvo);
  }
  for(const u of G.player.picks)if(NOVOS.includes(u))ganhos.add(u);
}
ok(ganhos.size===NOVOS.length,'os 5 novos upgrades apareceram na oferta e foram aplicados ('+[...ganhos].join(', ')+')');
ok(G.player.stats.critDmg>2&&G.player.stats.pspd>1&&G.player.stats.kb>1&&G.player.stats.dashCd<1&&G.player.stats.chill>0,
  'stats novos com valores: critDmg='+G.player.stats.critDmg+' pspd='+G.player.stats.pspd+' kb='+G.player.stats.kb+' dashCd='+G.player.stats.dashCd+' chill='+G.player.stats.chill);
G.spawnEnemy('slime',G.player.x+1,G.player.z,false);
const sl=G.enemies().find(e=>e.type==='slime');
G.damageEnemy(sl,1,false);
const cf=1-.2*G.player.stats.chill;
ok(sl.slowT>0&&sl.slowF<=cf+1e-9,'Pulso Congelante lentifica o alvo (slowF='+sl.slowF+' slowT='+sl.slowT.toFixed(2)+')');
console.log('[12] mapa diversificado e jogável');
{
  const m=G.mapInfo(),{W,H,grid}=m;
  const found=[];
  for(let z=10;z<H-10;z+=3)for(let x=10;x<W-10;x+=3){ // janelas 9x9 totalmente livres, longe do spawn
    if(Math.hypot(x-W/2,z-H/2)<20)continue;
    let okw=true;
    for(let dz=-4;dz<=4&&okw;dz++)for(let dx=-4;dx<=4;dx++){if(grid[(z+dz)*W+x+dx]>0){okw=false;break}}
    if(okw&&found.every(f=>Math.hypot(f.x-x,f.z-z)>=12))found.push({x,z});
  }
  ok(found.length>=4,'clareiras abertas no mapa ('+found.length+' áreas livres grandes)');
  ok(m.chestN===20,'baús: 20 espalhados pelo campo');
  const L=m.landPos;
  ok(!!L&&L.fire.length>=5&&L.fire.length<=7,'fogueiras: '+L.fire.length);
  ok(L.cry.length>=6&&L.cry.length<=8,'cristais: '+L.cry.length);
  ok(L.grave.length>=4&&L.grave.length<=6,'cemitérios: '+L.grave.length);
  const isW=(x,z)=>grid[Math.round(z)*W+Math.round(x)]>0;
  ok(L.fire.every(f=>!isW(f.x,f.z))&&L.cry.every(c=>!isW(c.x,c.z))&&L.grave.every(g=>!isW(g.x,g.z)),'marcos fora de paredes/obstáculos');
  ok(Math.abs(G.jv(7,9))<=.5&&G.jv(7.2,9.4)===G.jv(7,9)&&G.jv(7,9)!==G.jv(8,9),'micro-relevo voxel determinístico por célula');
{
  const m2=G.mapInfo();let mx=0;for(let x=4;x<m2.W;x+=4)for(let z=4;z<m2.H;z+=4){const y=G.relief(x,z);if(y>mx)mx=y}
  ok(G.hills()>=1&&Math.abs(G.relief(m2.W/2,m2.H/2))<1.5&&mx>3,'montanhas: '+G.hills()+' morros, centro plano ('+G.relief(m2.W/2,m2.H/2).toFixed(2)+') e ponto alto '+mx.toFixed(1));
}
}
console.log('[13] Rei do Slime — chefe que solta um bando de slimes menores');
let king=null,tries=0;
while(tries++<3&&!king){G.spawnBoss();const bb=G.getBoss();if(bb&&bb.type==='slimeking')king=bb}
ok(!!king,'Rei do Slime entrou na rotação de chefes');
if(king){
  G.damageEnemy(king,1e9);
  const minis=G.enemies().filter(e=>e.type==='slime'&&e.mini);
  ok(minis.length>=8,'ao morrer solta um bando de slimes menores ('+minis.length+' escaparam)');
  ok(minis.length>0&&minis.every(m=>m.sc<1&&m.r<.3),'slimes pequenos de verdade (sc='+(minis[0]?minis[0].sc.toFixed(2):'?')+', r='+(minis[0]?minis[0].r.toFixed(2):'?')+')');
}
}catch(e){console.log('ERRO NO TESTE:',e.stack);fails.push('exceção: '+e.message)}
console.log(fails.length?('\n'+fails.length+' FALHA(S)'):'\nSMOKE_OK — tudo passou');
process.exit(fails.length?1:0);
