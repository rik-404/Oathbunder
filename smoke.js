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
global.localStorage.setItem('cv_shop',JSON.stringify({hp:6,dmg:6,spd:5,crit:5,magnet:3,greed:5}));
global.matchMedia=()=>({matches:false});
global.innerWidth=1280;global.innerHeight=720;
let rafCb=null;
global.requestAnimationFrame=cb=>{rafCb=cb};
const realNow=()=>performance.now();let fakeT=realNow();
global.performance={now:()=>fakeT};
global.addEventListener=function(){};
global.window=global;
eval(fs.readFileSync('assets/js/decorations/trees.js','utf8'));
eval(fs.readFileSync('assets/js/functions/missions.js','utf8'));

// ---------- THREE ----------
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}setScalar(v){this.x=this.y=this.z=v;return this}project(){this.z=0;return this}}
class Sc{constructor(){this.x=1;this.y=1;this.z=1}set(a,b,c){this.x=a;this.y=b;this.z=c;return this}setScalar(s){this.x=this.y=this.z=s;return this}}
class Rt{constructor(){this.x=0;this.y=0;this.z=0}set(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;return this}setScalar(v){this.x=this.y=this.z=v;return this}copy(o){this.x=o.x;this.y=o.y;this.z=o.z;return this}}
class Color{constructor(c){this.r=1;this.g=1;this.b=1;if(typeof c==='number')this.fromHex(c)}fromHex(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}setHex(h){return this.fromHex(h)}setScalar(v){this.r=this.g=this.b=v;return this}copy(c){this.r=c.r;this.g=c.g;this.b=c.b;return this}lerp(c,t){this.r+=(c.r-this.r)*t;this.g+=(c.g-this.g)*t;this.b+=(c.b-this.b)*t;return this}offsetHSL(){return this}setHSL(){return this}getHex(){return(Math.round(this.r*255)<<16)|(Math.round(this.g*255)<<8)|Math.round(this.b*255)}}
class Mesh{constructor(g,m){this.isMesh=true;this.geometry=g;this.material=m;this.position=new V3();this.rotation=new Rt();this.scale=new Sc();this.userData={};this.visible=true;this.castShadow=false;this.receiveShadow=false;this.frustumCulled=true;this.children=[]}add(c){this.children.push(c);return c}remove(c){this.children=this.children.filter(x=>x!==c)}traverse(fn){fn(this);for(const c of this.children)if(c.traverse)c.traverse(fn)}dispose(){}}
class Grp extends Mesh{constructor(){super(undefined,undefined)}}
class Ins extends Mesh{constructor(g,m,n){super(g,m);this.count=n;this.instanceMatrix={needsUpdate:false}}setMatrixAt(){}setColorAt(){}}
function geoBox(){const n=24;return{attributes:{position:{count:n,array:new Float32Array(n*3)},normal:{array:new Float32Array(n*3)}},index:{array:Array.from({length:n},(_,i)=>i)},setAttribute(){},translate(){},dispose(){},computeBoundingSphere(){}}}
const plain=o=>Object.assign({},o,{dispose(){}});
function fakeMaterial(o){const m=Object.assign({},o,{dispose(){}});if(typeof m.color==='number')m.color=new Color(m.color);if(typeof m.emissive==='number')m.emissive=new Color(m.emissive);m.clone=()=>{const c=fakeMaterial(m);if(m.color&&typeof m.color.copy==='function')c.color=new Color().copy(m.color);if(m.emissive&&typeof m.emissive.copy==='function')c.emissive=new Color().copy(m.emissive);return c};return m}
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
  MeshLambertMaterial:fakeMaterial,MeshBasicMaterial:fakeMaterial,
  Mesh,Group:Grp,InstancedMesh:Ins,
};
global.THREE=THREE;

// ---------- carrega o jogo exposto via __G ----------
// Armas, melhorias e passivas seguem a mesma ordem dos <script>s no navegador.
const cdir='assets/js/class';
const csrc=fs.readdirSync(cdir).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?1:b==='index.js'?-1:a.localeCompare(b)).map(f=>fs.readFileSync(cdir+'/'+f,'utf8')).join('\n')+'\n';
const wdir='assets/js/weapons';
const wsrc=fs.readdirSync(wdir).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:a.localeCompare(b)).map(f=>fs.readFileSync(wdir+'/'+f,'utf8')).join('\n')+'\n';
const udir='assets/js/upgrades';
const usrc=['core.js','general.js','combat.js','utility.js','class.js','index.js'].map(f=>fs.readFileSync(udir+'/'+f,'utf8')).join('\n')+'\n';
const pdir='assets/js/passives';
const psrc=['index.js','vampirism.js','iron_plating.js','midas_touch.js','burning_fire.js','ricochet.js','beer_bottle.js','keen_eye.js','wisdom.js','future_echo.js','frozen_pulse.js','fatal_fist.js','unholy_resurrection.js'].map(f=>fs.readFileSync(pdir+'/'+f,'utf8')).join('\n')+'\n';
const fsrc=fs.readFileSync('assets/js/functions/blood_moon.js','utf8')+'\n';
const ssrc=['vlad.js','demon.js','king.js'].map(f=>fs.readFileSync('assets/js/spawn/'+f,'utf8')).join('\n')+'\n';
const dsrc=['index.js','smith.js','vlad.js','king.js'].map(f=>fs.readFileSync('assets/js/dash/'+f,'utf8')).join('\n')+'\n';
let src=csrc+wsrc+usrc+psrc+fsrc+dsrc+ssrc+fs.readdirSync('assets/js/enimies').filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync('assets/js/enimies/'+f,'utf8')).join('\n')+'\n'+fs.readFileSync('assets/js/decorations/chest.js','utf8')+'\n'+fs.readFileSync('assets/js/decorations/index.js','utf8')+'\n'+fs.readFileSync('game.js','utf8');
const i=src.lastIndexOf('})();');
const hook=`window.__G={newRun,update,openUpgrade,chooseUpgrade,damageEnemy,gainXP,hurtPlayer,dash,jump,useAbility,spawnBoss,spawnEnemy,killEnemy,S,setMuted,player,keys,setScreen,getBoss:()=>boss,getUps:()=>($('#ups')&&$('#ups')._choice)||null,hs:()=>hitStopT,getState:()=>state,enemies:()=>enemies,projs:()=>projs,mapInfo:()=>({W,H,grid,landPos,chestN:chests.length}),jv:(x,z)=>jv(x,z),relief:(x,z)=>relief(x,z),hills:()=>HILLS.length,runCheat,toggleMap,galNames:()=>{if(!galleryItems)galleryItems=buildGalleryItems();return galleryItems.map(g=>g.name)},weaponGal:()=>buildWeaponGalleryItems(),cheatHelp:CHEAT_HELP,galMake:(n)=>{if(!galleryItems)galleryItems=buildGalleryItems();const it=galleryItems.find(g=>g.name===n);return it?it.make():null},skelDef:()=>(window.ENEMY_DEFS&&!!window.ENEMY_DEFS.skel),zombieDef:()=>(window.ENEMY_DEFS&&!!window.ENEMY_DEFS.zombie)};\n})();`;
src=src.slice(0,i)+hook.replace('projs:()=>projs,','projs:()=>projs,dashFxGroup:()=>fxGroup,minions:()=>minions,updateMinions,spawnIntro:()=>spawnController,vladIntro:()=>spawnController,skyFactor:currentSkyFactor,pickups:()=>pickups,weaponGroup:()=>wGroup,statUps:()=>STAT_UPS,weaponSlots:()=>weaponSlots(player),');
try{eval(src)}catch(e){console.log('ERRO AO CARREGAR:',e.stack);process.exit(1)}
const G=global.__G;
const finishSpawnIntro=()=>{for(let k=0;k<420&&G.spawnIntro();k++)G.update(1/60);G.enemies().length=0};
const finishVladIntro=finishSpawnIntro;const finishKingIntro=finishSpawnIntro;
const frames=n=>{for(let k=0;k<n;k++){const cb=rafCb;rafCb=null;fakeT+=16.7;cb&&cb(fakeT)}};

try{
if(process.env.SMOKE_SPIDER_ONLY!=='1'){
console.log('[1] carregamento / menu');
ok(G.getState()==='title','estado inicial é título');
ok(!!window.MISSIONS_MODULE&&typeof window.MISSIONS_MODULE.create==='function','módulo de missões separado carregado');
{const unlocked=[],notices=[],probe=window.MISSIONS_MODULE.create({isRunActive:()=>true,
 getMeta:()=>({runs:2,maxDmg:120,skelKills:100,bestTime:80,maxKills:30,batKills:20,bosses:1,bestLvl:8}),
 getRunDamage:()=>42,getRunSkeletons:()=>5,getRunBats:()=>3,getRunTime:()=>12,getKills:()=>50,getBossKills:()=>2,getPlayerLevel:()=>9,getCoins:()=>87,
 isUnlocked:k=>unlocked.includes(k),unlock:k=>unlocked.push(k),className:k=>k,toast:(title,subtitle)=>notices.push([title,subtitle]),formatTime:v=>String(v),formatNumber:v=>String(v)});
 ok(Object.keys(probe.missions).length===10&&probe.missions.tank.prog()===120&&probe.missions.pistol.prog()===50,'dez missões e progresso calculados pelo módulo');
 const first=probe.complete('pistol',300),repeat=probe.complete('pistol',300);ok(first&&!repeat&&unlocked[0]==='pistol'&&notices.length===1,'conclusão da missão desbloqueia e notifica apenas uma vez')}
ok(G.skelDef(),'esqueleto registrado via assets/js/enimies/skeleton.js');
ok(G.zombieDef(),'zumbi registrado via assets/js/enimies/zombie.js');
{const green=window.ENEMY_DEFS.slime(),blue=window.ENEMY_DEFS.slimeB();
 ok(green.boxes().length>=18&&blue.boxes().length>=18&&green.stats.hp===22&&blue.stats.hp===30&&green.stats.speed===2.6&&blue.stats.speed===3,'slimes têm modelos voxel detalhados e atributos preservados')}
{const brute=window.ENEMY_DEFS.brute((P,o)=>o.extra||[]),parts=brute.boxes();
 ok(parts.length>=30&&brute.stats.hp===120&&brute.stats.speed===1.9&&brute.stats.dmg===16&&brute.leg.length===3,'Brutamontes redesenhado e atributos de combate preservados')}
{const ogre=window.ENEMY_DEFS.ogre((P,o)=>o.extra||[]),parts=ogre.boxes();
 ok(parts.length>=35&&ogre.stats.hp===200&&ogre.stats.speed===2&&ogre.stats.dmg===19&&ogre.leg.length===3,'Ogro redesenhado e atributos de combate preservados')}
{const zombie=window.ENEMY_DEFS.zombie((P,o)=>o.extra||[]),parts=zombie.boxes();
 ok(parts.length>=35&&zombie.stats.hp===34&&zombie.stats.speed===2.3&&zombie.stats.dmg===9&&zombie.legged&&zombie.leg.length===3,'Zumbi redesenhado e atributos/animação preservados')}
{const ks=Object.keys(CLASSES);ok(ks.length===12&&ks.every(k=>typeof CLASSES[k].model==='function'&&!!CLASSES[k].weaponId&&!CLASSES[k].ab&&window.CLASS_WEAPONS[CLASSES[k].weaponId]?.classId===k)&&Object.keys(window.CLASS_WEAPONS).length===12,'12 classes com modelo, sem Q ativo e arma-base individual registrada em CLASS_WEAPONS')}
{const items=G.weaponGal(),models=items.map(i=>i.make()),names=items.map(i=>i.name);ok(items.length===17&&models.length===17&&models.every(m=>m&&m.children&&m.children.length>0)&&names.some(n=>n.includes('Bumerangue'))&&names.some(n=>n.includes('Espada de Aço'))&&names.some(n=>n.includes('Guarda Real')),'arsenal 3D compõe as 12 armas fixas e as 5 armas gerais em modelos voxel')}
ok(G.cheatHelp.some(h=>h.startsWith('weapons')),'terminal help lista o comando weapons');
{const items=G.weaponGal(),bow=items.find(i=>i.name.startsWith('Arco Longo')),display=bow&&bow.make();ok(!!display&&display.children.length===2,'arma física do Arqueiro é exibida junto do projétil flecha')}
ok(STAT_UPS.length===16&&!STAT_UPS.some(u=>u.id==='xp'||u.id==='crit'||u.id==='ls'||u.id==='armor')&&window.UPGRADE_REGISTRY.groups.map(g=>g.nome).join(',')==='general,combat,utility,class'&&new Set(STAT_UPS.map(u=>u.id)).size===16,'16 melhorias únicas; Sabedoria, Olho Certeiro, Vampirismo e Placas de Ferro não aparecem na roleta geral');
ok(window.PASSIVE_REGISTRY.get('vampirism')?.nome==='Vampirismo'&&window.PASSIVE_REGISTRY.get('iron_plating')?.nome==='Placas de Ferro'&&window.PASSIVE_REGISTRY.get('midas_touch')?.nome==='Toque de Midas'&&window.PASSIVE_REGISTRY.get('burning_fire')?.nome==='Fogo Ardente'&&window.PASSIVE_REGISTRY.get('ricochet')?.nome==='Ricochete'&&window.PASSIVE_REGISTRY.get('beer_bottle')?.nome==='Garrafa de Cerveja'&&window.PASSIVE_REGISTRY.get('keen_eye')?.nome==='Olho Certeiro'&&window.PASSIVE_REGISTRY.get('wisdom')?.nome==='Sabedoria'&&window.PASSIVE_REGISTRY.get('frozen_pulse')?.nome==='Pulso Congelante'&&window.PASSIVE_REGISTRY.get('fatal_fist')?.nome==='Punho Fatal'&&window.PASSIVE_REGISTRY.get('unholy_resurrection')?.nome==='Ressurreição Profana'&&!window.PASSIVE_REGISTRY.randomOptions({cls:'dracula',passives:[],maxPassives:5}).some(p=>p.passiveId==='vampirism')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'tank',passives:[],maxPassives:5}).some(p=>p.passiveId==='iron_plating')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'king',passives:[],maxPassives:5}).some(p=>p.passiveId==='midas_touch')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'demon',passives:[],maxPassives:5}).some(p=>p.passiveId==='burning_fire')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'arqueiro',passives:[],maxPassives:5}).some(p=>p.passiveId==='ricochet')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'human',passives:[],maxPassives:5}).some(p=>p.passiveId==='beer_bottle')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'pistol',passives:[],maxPassives:5}).some(p=>p.passiveId==='keen_eye')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'mago',passives:[],maxPassives:5}).some(p=>p.passiveId==='wisdom'),'passivas fixas: Vampirismo, Placas de Ferro, Toque de Midas, Fogo Ardente, Ricochete, Garrafa de Cerveja, Olho Certeiro, Sabedoria, Pulso Congelante, Punho Fatal e Ressurreição Profana')
{const name=G.galNames().find(n=>n==='Brom · Guardião'),guard=name&&G.galMake(name);let head=null,shield=null;if(guard)guard.traverse(o=>{if(o.name==='guardianHammerHead')head=o;if(o.name==='guardianShield')shield=o});
 ok(!!head&&Math.abs(head.rotation.y+Math.PI/2)<1e-6&&head.children.length>=20&&!!shield&&shield.position.y===0,'Guardião tem face larga de impacto alinhada ao golpe e escudo centrado na mão')}
{const name=G.galNames().find(n=>n.startsWith('Darian ·')),hero=name&&G.galMake(name);let hold=null,sword=null;if(hero)hero.traverse(o=>{if(o.name==='swordHold')hold=o;if(o.name==='sword')sword=o});
 ok(!!hold&&Math.abs(hold.rotation.z+.75)<1e-6&&!!sword&&sword.children.length>=15,'Guerreiro segura a espada pela empunhadura na pose de repouso')}
{const name=G.galNames().find(n=>n.startsWith('Oliver ·')),hero=name&&G.galMake(name);let bow=null,arrow=null;if(hero)hero.traverse(o=>{if(o.name==='oliverBow')bow=o;if(o.name==='nockedArrow')arrow=o});
 ok(!!bow&&bow.position.x===0&&bow.position.z===.10&&bow.scale.x===-1&&!!arrow&&arrow.position.z===.25,'arco do Oliver fica centrado na mão e mantém a flecha apontada para a frente')}
{const gn=G.galNames();ok(gn.some(n=>n.includes('TARDIS'))&&gn.some(n=>n.includes('Trono')),'galeria de modelos inclui TARDIS e trono ('+gn.length+' itens)');
 const a=G.galMake(gn.find(n=>n.includes('TARDIS'))),b=G.galMake(gn.find(n=>n.includes('Trono')));
 ok(!!a&&!!b&&a.children.length>=20&&b.children.length>=55,'cabine do tempo detalhada e trono real com mais de 55 peças voxel constroem na galeria')}
{const name=G.galNames().find(n=>n==='Golem do Campo · chefe'),golem=name&&G.galMake(name);let pieces=0;if(golem)golem.traverse(o=>{if(o.isMesh)pieces++});
 ok(!!golem&&golem.scale.x===2.6&&pieces>=50,'Golem ancestral com núcleo, placas e cristais constrói em escala original na galeria ('+pieces+' peças)')}
{const n=G.galNames().find(n=>n==='Soldado Real · minion do Midas'),soldier=n&&G.galMake(n),combo=G.galMake('Midas + Guarda Real · combo');
 ok(!!soldier&&soldier.children.length===3&&soldier.scale.x===.86&&!!combo&&combo.children.length===5,'Soldado Real detalhado e combo do Midas constroem na galeria')}
{const gn=G.galNames(),n=gn.find(n=>n==='Ogro Brutamontes · chefe'),ogre=n&&G.galMake(n);
 ok(!!ogre&&ogre.children.length>0,'chefe Ogro constrói o modelo atualizado na galeria')}
{const chest=G.galMake(G.galNames().find(n=>n.includes('Baú')));ok(!!window.CHEST_MODEL&&!!chest&&chest.children.length>=3,'baú separado carrega e constrói na galeria')}
{const n=G.galNames().find(n=>n==='Árvore Morta · árvore'),tree=n&&G.galMake(n);ok(!!tree&&!!tree.geometry,'árvore morta carrega do módulo assets/js/decorations/trees.js')}
{const names=G.galNames().filter(n=>n.endsWith(' · árvore')),models=names.map(n=>G.galMake(n));
 ok(names.length===6&&models.every(m=>m&&m.geometry)&&new Set(models.map(m=>m.geometry)).size===6,'seis árvores da galeria têm geometrias próprias')}
{const names=G.galNames().filter(n=>/^Pedra \d+ · cenário$/.test(n)),models=names.map(n=>G.galMake(n)),geos=models.map(m=>m&&m.geometry);
 ok(names.length===3&&models.every(m=>m&&m.isMesh&&m.material&&m.material.vertexColors)&&new Set(geos).size===3,'três pedras voxel distintas com material de cores constroem na galeria')}
{const fire=G.galMake('Fogueira · decoração');ok(!!fire&&fire.children.length===2&&fire.children.every(m=>m.isMesh&&m.material&&m.material.vertexColors),'fogueira da galeria tem base voxel e chama em camadas de cor')}
{const totem=G.galMake('Totem de Ímã · decoração'),mag=totem&&totem.children.find(c=>c.name==='mag'),off=totem&&totem.children.find(c=>c.name==='off');let pieces=0;if(totem)totem.traverse(o=>{if(o.isMesh&&o.geometry)pieces++});
 ok(!!totem&&pieces>=35&&!!mag&&mag.children.length>=15&&!!off&&!off.visible,'totem de ímã voxel detalhado aparece na visualização de desenvolvimento ('+pieces+' peças)')}
{const names=['Cristal Arcano · decoração','Cogumelo · decoração','Lápide · decoração','Cruz · decoração','Toco · decoração','Caixão · decoração'],models=names.map(n=>G.galMake(n)),coffin=models[5];let coffinPieces=0;if(coffin)coffin.traverse(o=>{if(o.isMesh)coffinPieces++});
 ok(models.slice(0,5).every(m=>m&&m.isMesh&&m.geometry&&m.material&&m.material.vertexColors)&&!!coffin&&coffinPieces>=25,'cristal, cogumelo, lápide, cruz e toco voxel e caixão ornamentado constroem na galeria ('+coffinPieces+' peças no caixão)')}
{const B=window.BLOOD_MOON;let spawned=0,next=105;const ctx={boss:false,hordeN:3,aiSkill:.7,runTime:100,nextHorde:next,player:{x:20,z:20},TAU:Math.PI*2,rand:(a,b)=>a,collide:()=>false,spawnEnemy:()=>{spawned++},setNextHorde:v=>{next=v},toast(){},addShake(){},S(){}};let started=false;for(let i=0;i<80;i++)started=B.onKill(ctx)||started;const triggered=B.isActive()&&spawned===16&&next===150;for(let i=0;i<350;i++)B.update(.1,ctx);const ended=!B.isActive()&&B.state().time===0&&B.state().cooldown===240&&spawned===28;ok(!!B&&started&&triggered&&ended,'Lua de Sangue: 80 abates após a 3ª horda, até 28 zumbis, 35 s de evento e cooldown de 4 min');B.reset()}
frames(3);
if(process.env.SMOKE_STATIC_ONLY==='1'){console.log(fails.length?('\n'+fails.length+' FALHA(S)'):'\nSMOKE_STATIC_OK — módulos e modelos da galeria validados');process.exit(fails.length?1:0)}
console.log('[2] nova corrida (guerreiro)');
G.runCheat('unlock all'); // localStorage vazio: libera todas as classes
G.newRun('king');G.enemies().length=0;const seatedKing=G.player,kingIntro=G.spawnIntro(),kingPose=kingIntro&&kingIntro.pose();ok(!!kingIntro&&kingIntro.duration===3.1&&kingIntro.throne.children.length>=55&&!!kingPose&&kingPose.offsetY>.5&&kingPose.offsetZ>.5&&kingPose.sit===1&&seatedKing.model.root.visible,'Rei começa sentado no trono real e visível antes de se erguer');finishKingIntro();ok(!G.spawnIntro()&&seatedKing.model.root.visible&&!kingIntro.active,'Rei levanta e avança do trono; a intro termina e remove o trono temporário');ok(!!G.player.model&&G.player.model.keep.length===0&&G.player.model.handL.children.length===0,'Midas aparece sem cajado e com a mão esquerda livre');
ok(G.player.weaponId==='king_guard'&&G.player.passives.includes('midas_touch')&&G.player.stats.goldMul===1.5&&G.weaponSlots()===1,'Midas começa com Guarda Real e Toque de Midas fixos, ocupando um slot de cada grupo');
{const oldShop=JSON.parse(localStorage.getItem('cv_shop')||'{}');ok(G.player.maxHp===105&&G.player.stats.dmg===1&&G.player.stats.move===1&&G.player.stats.magnet===1&&Object.keys(oldShop).length===0,'melhorias antigas da loja são limpas e não fortalecem novas partidas');}
G.enemies().length=0;G.player.atkCd=0;G.update(1/60);const midasGuard=G.minions().find(m=>m.owner==='king');
ok(!!midasGuard&&midasGuard.sold&&midasGuard.hp===110&&midasGuard.baseDmg===13&&G.projs().every(p=>p.kind!=='gcoin'),'ataque principal invoca um Guarda Real aliado e não dispara moedas');
G.enemies().length=0;G.spawnEnemy('brute',G.player.x+3,G.player.z,true);const midasTarget=G.enemies()[0],targetHp=midasTarget?.hp;if(midasGuard&&midasTarget){midasGuard.x=midasTarget.x-.2;midasGuard.z=midasTarget.z;midasGuard.atkCd=0;G.update(1/60)}
ok(!!midasTarget&&midasTarget.hp<targetHp,'Guarda Real persegue e causa dano ao inimigo por Midas');
if(midasTarget)G.killEnemy(midasTarget);const midasCoin=G.pickups().find(p=>p.type==='coin');
ok(!!midasCoin&&midasCoin.v>=5&&midasCoin.v<=9,'Toque de Midas aumenta em 50% o valor das moedas derrubadas por inimigos');
G.player.dashCd=0;G.dash();G.update(1/60);const carry=G.dashFxGroup().children.find(o=>o.name==='kingDashCarry'),carrier=carry&&carry.children.find(o=>o.name==='kingDashMinion'),passenger=carry&&carry.children.find(o=>o.name==='kingDashMidasPassenger');ok(G.player.dashT>0&&!G.player.model.root.visible&&!!carry&&!!carrier&&!!passenger,'dash do Rei mostra Midas sendo carregado por um Guarda Real');for(let k=0;k<24;k++)G.update(1/60);ok(G.player.dashT<=0&&G.player.model.root.visible&&!G.dashFxGroup().children.some(o=>o.name==='kingDashCarry'),'Guarda Real encerra o transporte ao fim do dash e Midas volta ao modelo normal');
G.newRun('arqueiro');ok(G.player.passives.includes('ricochet')&&G.player.stats.ricochetChance===.25&&G.player.stats.ricochetMax===2&&G.player.stats.ricochetRange===8&&G.player.stats.ricochetDamage===.75,'Oliver começa com Ricochete fixa: 25%, até 2 saltos e 75% de dano por salto');
G.enemies().length=0;G.spawnEnemy('slime',G.player.x+4,G.player.z,false);G.spawnEnemy('brute',G.player.x+7,G.player.z,false);const ricFirst=G.enemies().find(e=>e.type==='slime'),ricSecond=G.enemies().find(e=>e.type==='brute'),ricFirstHp=ricFirst&&ricFirst.hp,ricSecondHp=ricSecond&&ricSecond.hp;
if(ricFirst){ricFirst.speed=0;ricFirst.cd=30}if(ricSecond){ricSecond.speed=0;ricSecond.cd=30}G.player.stats.ricochetChance=1;G.player.stats.ricochetMax=1;G.player.atkCd=0;G.update(1/60);G.player.atkCd=30;for(let k=0;k<30;k++)G.update(1/60);
ok(!!ricFirst&&!!ricSecond&&ricFirst.hp<ricFirstHp&&ricSecond.hp<ricSecondHp,'flecha do Oliver acerta o primeiro inimigo e ricocheteia para o segundo');
G.newRun('human');ok(G.player.passives.includes('beer_bottle')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.picks.includes('Garrafa de Cerveja')&&!Object.keys(G.player.stats).some(k=>k.startsWith('beer')),'Garrafa de Cerveja é o poder meme fixo do Zé: ocupa 1 dos 5 espaços e não altera atributos');
G.newRun('pistol');const pistolWeapon=window.CLASS_WEAPONS[CLASSES.pistol.weaponId],expectedPistolCrit=(pistolWeapon.critBase||.05)+.08;ok(G.player.passives.includes('keen_eye')&&G.player.passives.length===1&&G.player.maxPassives===5&&Math.abs(G.player.stats.crit-expectedPistolCrit)<1e-9,'Olho Certeiro é passiva fixa do Cassian: +8% crítico e 1 dos 5 espaços');
G.newRun('mago');ok(G.player.passives.includes('wisdom')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.picks.includes('Sabedoria')&&Math.abs(G.player.stats.xpMul-1.15)<1e-9,'Sabedoria é passiva fixa do Mago: +15% XP e 1 dos 5 espaços');
G.newRun('future');ok(G.player.passives.includes('future_echo')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.stats.echoChance===.2&&G.player.stats.echoDamage===.5&&G.player.stats.echoDelay===.35&&!window.PASSIVE_REGISTRY.randomOptions({cls:'future',passives:[],maxPassives:5}).some(p=>p.passiveId==='future_echo'),'Smith começa com Eco do Futuro fixo: 20% de chance, atraso de 0,35 s e dano pela metade');
G.enemies().length=0;G.spawnEnemy('brute',G.player.x+7,G.player.z,false);const futureEchoTarget=G.enemies()[0];if(futureEchoTarget){futureEchoTarget.speed=0;futureEchoTarget.cd=30}G.player.stats.echoChance=1;G.player.atkCd=30;G.damageEnemy(futureEchoTarget,20,false);const echoDirectHp=futureEchoTarget&&futureEchoTarget.hp;G.update(.4);const echoRepeatHp=futureEchoTarget&&futureEchoTarget.hp;G.update(.4);
ok(!!futureEchoTarget&&Math.abs((echoDirectHp-echoRepeatHp)-10)<1e-6&&futureEchoTarget.hp===echoRepeatHp,'eco temporal repete o acerto com 50% do dano sem gerar ecos em cadeia');
G.player.dashCd=0;G.dash();const smithDashStarted=G.player.dashT===.17&&G.player.dashCd===1.1*G.player.stats.dashCd;for(let k=0;k<15;k++)G.update(1/60);
ok(smithDashStarted&&G.player.dashT<=0&&G.player.model.root.visible,'dash glitch do Smith preserva duração e recarga, restaurando o modelo após o flicker');
G.newRun('guerreiro');ok(G.player.passives.includes('fatal_fist')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.picks.includes('Punho Fatal')&&G.player.stats.critDmg===2.5&&!G.statUps().some(u=>u.id==='cdmg')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'guerreiro',passives:[],maxPassives:5}).some(p=>p.passiveId==='fatal_fist'),'Darian começa com Punho Fatal fixo: multiplicador crítico 2,5× e 1 dos 5 slots');
G.newRun('guerreiro');ok(G.player.weaponId===CLASSES.guerreiro.weaponId&&G.player.ownedWeaponIds.length===1&&G.player.maxWeapons===5&&G.weaponSlots()===1,'arma original fixa ocupa um dos cinco espaços de arma');
for(const k of Object.keys(G.player.weap).slice(0,4)){G.player.weap[k]=1;G.player.ownedWeaponIds.push(k)}ok(G.weaponSlots()===5,'quatro armas adicionais completam o limite total de cinco incluindo a arma fixa');G.openUpgrade();const atCap=G.getUps()||[];ok(atCap.length===3&&atCap.every(u=>!u.wk||G.player.weap[u.wk]>0),'com cinco armas, nenhuma nova arma entra na oferta; só melhorias das já obtidas');G.newRun('guerreiro');
ok(G.getState()==='play','partida iniciada');
ok(G.enemies().length===8,'8 slimes iniciais');
{G.enemies().length=0;G.player.weap.orbit=2;G.update(1/60);const orbs=G.weaponGroup().children.filter(m=>m.name==='orbitOrb'),first=orbs[0],core=first&&first.userData.orbitCore;
 ok(orbs.length===3&&!!core&&first.children.length>=20&&first.scale.x===.78,'Orbes Giratórios constroem três relicários voxel detalhados sem alterar o nível da arma')}
{G.player.weap.aura=1;G.update(1/60);const aura=G.weaponGroup().children.find(m=>m.userData.weaponAura==='voxel-fire-v2'),flames=aura&&aura.children.filter(m=>m.userData.auraFlame),embers=aura&&aura.children.filter(m=>m.userData.auraEmber);ok(!!aura&&flames.length===10&&embers.length===12&&aura.scale.y===1&&window.WEAPONS.aura.desc(1).includes('9 de dano'),'Aura de Brasa redesenhada como coroa voxel de dez chamas e brasas orbitais, mantendo o dano da arma')}
{const savedRandom=Math.random;Math.random=()=>.42;try{G.enemies().length=0;const bp=G.player;bp.weap.aura=0;bp.weap.orbit=0;bp.atkCd=30;const target=G.spawnEnemy('brute',bp.x+3,bp.z,false);target.speed=0;target.cd=30;const hp0=target.hp;bp.weap.boomerang=1;bp.ownedWeaponIds.push('boomerang');
 ok(!!window.WEAPONS.boomerang&&Object.prototype.hasOwnProperty.call(bp.weap,'boomerang')&&G.weaponSlots()===2&&window.WEAPONS.boomerang.desc(1).includes('ida')&&window.WEAPONS.boomerang.desc(1).includes('volta'),'Bumerangue entra como arma geral sorteável, sem vínculo com classe, e ocupa slot normal de arma');
 G.update(1/60);const boomer=G.weaponGroup().children.find(m=>m.userData.weaponProjectile==='boomerang');
 for(let k=0;k<80&&boomer&&boomer.userData.phase==='out';k++)G.update(1/60);
 const hpOut=target.hp;ok(!!boomer&&boomer.userData.phase==='return'&&hpOut<hp0,'Bumerangue voxel segue até o alvo, acerta na ida e inicia o retorno');
 target.x=bp.x+3;target.z=bp.z;target.kx=0;target.kz=0;
 for(let k=0;k<20&&target.hp===hpOut;k++)G.update(1/60);
 ok(target.hp<hpOut,'Bumerangue atinge novamente o mesmo inimigo ao passar de volta')}finally{Math.random=savedRandom}}

{G.newRun('tank');G.enemies().length=0;G.player.shieldT=1;G.update(1/60);const t=G.player.model,idleTilt=t.armR.rotation.x+t.hammer.rotation.x,shieldPose=Math.abs(t.armL.rotation.x+1)<1e-6&&Math.abs(t.shield.rotation.x-1)<1e-6;
 G.player.shieldT=0;G.player.atkAnim=.01;G.update(.001);const impactAngle=t.armR.rotation.x+t.hammer.rotation.x;
 ok(idleTilt>.66&&idleTilt<.72,'martelo recebe mais 10 graus de inclinação para a frente no repouso');
 ok(shieldPose,'escudo do Guardião acompanha a mão numa elevação de defesa coerente');
 ok(!!t.hammerHead&&Math.abs(t.hammerHead.rotation.y+Math.PI/2)<1e-6&&Math.sin(impactAngle)>.7,'face larga do martelo aponta para o chão no impacto');}
G.newRun('guerreiro');
{G.runCheat('time 179.8');G.update(.1);const before=G.getBoss();G.runCheat('time 180');G.update(1/60);const first=G.getBoss();
 ok(!before&&!!first,'primeiro chefe invocado ao atingir 3 minutos, não antes')}
G.newRun('guerreiro'); // isola os testes seguintes do salto de tempo da verificação
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
for(const e of G.enemies().slice(0,3))G.damageEnemy(e,99999);
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
ok(p.spinT===0&&!('abCd'in p),'Q removido: não dispara habilidade nem mantém recarga ativa');
G.jump();
ok(p.vy>0,'pulo funcionou');
G.hurtPlayer(5,null,false);
ok(p.invuln>0,'dano no herói deu invencibilidade curta');
console.log('[7] mudo + sons');
G.S('hit',true);G.S('shot','bullet');G.S('kill');G.S('level');G.S('bossin');
G.setMuted(true);
ok(els['#sndbtn'].textContent.includes('🔇'),'botão mostra mudo');
G.S('hit');G.setMuted(false);
ok(els['#sndbtn'].textContent.includes('🔊'),'botão voltou ao normal');
console.log('[8] velocidade dos projéteis respeita pspd');
G.newRun('mago');
ok(G.skyFactor()===0,'corridas de outras classes mantêm o ciclo dia-noite normal');
G.player.stats.pspd=2;
G.player.atkCd=0;
for(let k=0;k<5;k++)G.spawnEnemy('slime',G.player.x,G.player.z+8+k,false);
G.update(1/60);
const pr=G.projs();
ok(pr.length>0,'mago atirou ('+pr.length+' projéteis)');
if(pr.length)ok(Math.abs(pr[0].speed-28)<0.01,'velocidade do orbe = projSpeed*pspd (esperado 28, veio '+pr[0].speed+')');
for(let k=0;k<3;k++){G.player.atkCd=0;G.update(1/60)}
const bigOrb=G.projs().find(q=>q.big);
ok(!!bigOrb&&bigOrb.kind==='fire'&&bigOrb.r===.4&&bigOrb.mScale===1.55&&!!bigOrb.g.geometry,'quarto disparo do Mago cria o orbe arcano maior com o modelo facetado');
G.newRun('necro');G.enemies().length=0;G.player.atkCd=0;G.spawnEnemy('slime',G.player.x,G.player.z+8,false);G.update(1/60);
const skullShot=G.projs().find(q=>q.owner==='p'&&q.kind==='skull');
ok(!!skullShot&&skullShot.g.name==='necroSkullProjectile'&&skullShot.g.geometry.userData.voxelKind==='necro-skull-projectile'&&skullShot.g.geometry.userData.voxelParts>=25,'Necromante dispara uma caveira voxel com órbitas verdes, maxilar e dentes');
const necroWeapon=window.CLASS_WEAPONS[CLASSES.necro.weaponId],expectedSkullDamage=skullShot&&necroWeapon.dmg*G.player.stats.dmg*(skullShot.crit?G.player.stats.critDmg:1),skullDamageFactor=skullShot?skullShot.dmg/expectedSkullDamage:0;
ok(!!skullShot&&necroWeapon.projSpeed===13&&necroWeapon.dmg===16&&Math.abs(skullShot.speed-necroWeapon.projSpeed*G.player.stats.pspd)<.01&&skullDamageFactor>.899&&skullDamageFactor<1.101&&skullShot.r===.22,'caveira do Necromante lê velocidade e dano do módulo, mantendo crítico e colisão');
console.log('[8a] Ressurreição Profana');
G.newRun('necro');ok(G.player.passives.includes('unholy_resurrection')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.stats.unholyChance===.15&&G.player.stats.unholyDuration===12&&!window.PASSIVE_REGISTRY.randomOptions({cls:'necro',passives:[],maxPassives:5}).some(p=>p.passiveId==='unholy_resurrection'),'Ressurreição Profana é passiva fixa de Necronus: 15% de chance, 12 s e 1 dos 5 slots');
G.enemies().length=0;G.player.stats.unholyChance=1;const slainEnemy=G.spawnEnemy('slime',G.player.x+5,G.player.z,false);G.killEnemy(slainEnemy);const risenSkeleton=G.minions().find(m=>m.temporary);
ok(!!risenSkeleton&&!risenSkeleton.sold&&Math.abs(risenSkeleton.lifeLeft-12)<1e-9&&Math.hypot(risenSkeleton.x-slainEnemy.x,risenSkeleton.z-slainEnemy.z)<1,'inimigo derrotado retorna no local como esqueleto aliado temporário');
G.enemies().length=0;const allyTarget=G.spawnEnemy('brute',risenSkeleton.x+.4,risenSkeleton.z,false),allyTargetHp=allyTarget.hp;G.updateMinions(.6);
ok(allyTarget.hp<allyTargetHp,'esqueleto ressuscitado persegue e ataca inimigos próximos');
G.player.minCap=0;G.enemies().length=0;G.updateMinions(12);
ok(!G.minions().includes(risenSkeleton)&&!risenSkeleton.mesh.parent,'esqueleto temporário desaparece ao terminar os 12 segundos');
G.newRun('mago');const mage=G.player;G.spawnEnemy('brute',mage.x+1,mage.z,false);const target=G.enemies().find(e=>e.type==='brute'),hpBefore=target.hp;G.useAbility();
ok(target.hp===hpBefore&&mage.spinT===0,'Q do Mago removido sem aplicar dano ou lentidão');
console.log('[8b] poderes da Véspera');
G.newRun('chrono');G.enemies().length=0;G.player.atkCd=0;G.spawnEnemy('slime',G.player.x,G.player.z+8,false);G.update(1/60);
const timeShot=G.projs().find(q=>q.owner==='p'&&q.kind==='time');
ok(!!timeShot&&timeShot.g.geometry.userData.voxelKind==='vespera-chronosphere'&&timeShot.g.geometry.userData.voxelParts>=25,'Orbe do Tempo cria uma cronosfera voxel com mostrador, ponteiros e lascas arcanas');
const chronoWeapon=window.CLASS_WEAPONS[CLASSES.chrono.weaponId],expectedTimeDamage=timeShot&&chronoWeapon.dmg*G.player.stats.dmg*(timeShot.crit?G.player.stats.critDmg:1),timeDamageFactor=timeShot?timeShot.dmg/expectedTimeDamage:0;
ok(!!timeShot&&chronoWeapon.projSpeed===15&&chronoWeapon.dmg===18&&Math.abs(timeShot.speed-chronoWeapon.projSpeed*G.player.stats.pspd)<.01&&timeDamageFactor>.899&&timeDamageFactor<1.101&&timeShot.r===.22,'Orbe do Tempo lê velocidade e dano do módulo, mantendo crítico e colisão');
G.newRun('chrono');G.enemies().length=0;G.spawnEnemy('brute',G.player.x+2,G.player.z,false);const timeTarget=G.enemies().find(e=>e.type==='brute'),timeHp=timeTarget.hp;G.useAbility();
ok(timeTarget.hp===timeHp&&G.player.spinT===0,'Q da Véspera removido sem dano ou controle temporal ativo');
console.log('[8b.5] passiva fixa do Guardião');
G.newRun('tank');const tank=G.player;
ok(tank.passives.length===1&&tank.passives[0]==='iron_plating'&&tank.picks.includes('Placas de Ferro')&&tank.upgIds['passive:iron_plating']&&Object.keys(tank.upgIds).length===1&&Math.abs(tank.stats.armor-(CLASSES.tank.armor+.08))<1e-8,'Placas de Ferro é passiva fixa do Guardião, soma 8% de armadura e ocupa 1 dos 5 slots');
console.log('[8c] spawn noturno e dash-morcego do Vlad');
G.newRun('dracula');G.enemies().length=0;const vlad=G.player,batForm=vlad.model.dashBat,vladIntro=G.vladIntro();
ok(!!vladIntro&&vladIntro.duration===2.4&&!!vladIntro.coffin&&!vlad.model.root.visible&&G.skyFactor()===1,'Vlad começa oculto dentro do caixão aberto, com a corrida já à noite');
G.dash();ok(vlad.dashT===0,'dash e movimento especial ficam bloqueados durante a animação de saída');
finishVladIntro();ok(!G.vladIntro()&&vlad.model.root.visible&&G.skyFactor()===1,'Vlad emerge em 2,4 s e a noite permanece fixa durante a corrida');
G.dash();
ok(vlad.passives.length===1&&vlad.passives[0]==='vampirism'&&vlad.picks.includes('Vampirismo')&&vlad.upgIds['passive:vampirism']&&Object.keys(vlad.upgIds).length===1&&Math.abs(vlad.stats.ls-.15)<1e-8,'Vampirismo é passiva fixa do Vlad, soma 3% ao roubo de vida da arma e ocupa 1 dos 5 slots');
const vladDashSpeed=Math.hypot(vlad.dvx,vlad.dvz),vladDashCd=vlad.dashCd,vladDashT=vlad.dashT,vladDashInvuln=vlad.invuln;
ok(vladDashSpeed===18&&Math.abs(vladDashCd-1.1*vlad.stats.dashCd)<.001&&Math.abs(vladDashT-.17)<.001&&vladDashInvuln>=.3,'dash do Vlad mantém velocidade, duração, recarga e invulnerabilidade');
G.update(1/60);
ok(!!batForm&&batForm.visible&&vlad.model.dashBatWings.length===2&&!vlad.model.torso.visible&&!vlad.model.legL.visible&&!vlad.model.legR.visible,'Vlad assume forma de morcego com asas animáveis durante o dash');
for(let i=0;i<15;i++)G.update(1/60);
ok(!batForm.visible&&vlad.model.torso.visible&&vlad.model.legL.visible&&vlad.model.legR.visible,'Vlad retorna à forma normal quando o dash termina');
console.log('[8d] projétil vampírico');
G.newRun('dracula');G.enemies().length=0;finishVladIntro();G.player.atkCd=0;G.spawnEnemy('slime',G.player.x,G.player.z+8,false);G.update(1/60);
const vladShot=G.projs().find(q=>q.owner==='p'&&q.kind==='batp');
ok(!!vladShot&&vladShot.g.geometry.userData.voxelKind==='vlad-bat-projectile'&&vladShot.g.geometry.userData.voxelParts>=28,'Vlad dispara um morcego voxel com asas carmesim, olhos rubros e presas');
const draculaWeapon=window.CLASS_WEAPONS[CLASSES.dracula.weaponId],expectedVladDamage=vladShot&&draculaWeapon.dmg*G.player.stats.dmg*(vladShot.crit?G.player.stats.critDmg:1),vladDamageFactor=vladShot?vladShot.dmg/expectedVladDamage:0;
ok(!!vladShot&&draculaWeapon.projSpeed===16&&draculaWeapon.dmg===16&&Math.abs(vladShot.speed-draculaWeapon.projSpeed*G.player.stats.pspd)<.01&&vladDamageFactor>.899&&vladDamageFactor<1.101&&vladShot.r===.22,'projétil do Vlad lê velocidade e dano do módulo, mantendo crítico e colisão');
console.log('[8e] spawn ritualístico + projétil do Castiel');
G.newRun('demon');G.enemies().length=0;const castiel=G.player,ritualIntro=G.spawnIntro();
ok(!!ritualIntro&&ritualIntro.duration===2.6&&!!ritualIntro.ritual&&ritualIntro.ritual.children.length>=20&&!castiel.model.root.visible,'Castiel começa oculto sob pentagrama vermelho voxel, cercado por runas do ritual');
G.dash();ok(castiel.dashT===0,'movimento e esquiva ficam bloqueados durante a invocação demoníaca');
finishSpawnIntro();ok(!G.spawnIntro()&&castiel.model.root.visible,'Castiel emerge do pentagrama e o círculo ritual é removido ao fim da animação');
G.enemies().length=0;G.player.atkCd=0;G.spawnEnemy('slime',G.player.x,G.player.z+8,false);G.update(1/60);
const castielShot=G.projs().find(q=>q.owner==='p'&&q.kind==='hellfire');
ok(!!castielShot&&castielShot.g.geometry.userData.voxelKind==='castiel-hellfire-projectile'&&castielShot.g.geometry.userData.voxelParts>=28,'Castiel lança uma brasa demoníaca voxel com núcleo vulcânico e cauda de fogo');
const demonWeapon=window.CLASS_WEAPONS[CLASSES.demon.weaponId],expectedCastielDamage=castielShot&&demonWeapon.dmg*G.player.stats.dmg*(castielShot.crit?G.player.stats.critDmg:1),castielDamageFactor=castielShot?castielShot.dmg/expectedCastielDamage:0;
ok(!!castielShot&&demonWeapon.projSpeed===15&&demonWeapon.dmg===22&&Math.abs(castielShot.speed-demonWeapon.projSpeed*G.player.stats.pspd)<.01&&castielDamageFactor>.899&&castielDamageFactor<1.101&&castielShot.r===.22,'projétil do Castiel lê velocidade e dano do módulo, mantendo crítico e colisão');
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
const NOVOS=['Velocidade de Tiro','Empurrão','Reflexo Relâmpago'];
G.newRun('chrono');
ok(G.player.passives.includes('frozen_pulse')&&G.player.passives.length===1&&G.player.maxPassives===5&&G.player.picks.includes('Pulso Congelante')&&G.player.stats.chill===1&&!G.statUps().some(u=>u.id==='chill')&&!window.PASSIVE_REGISTRY.randomOptions({cls:'chrono',passives:[],maxPassives:5}).some(p=>p.passiveId==='frozen_pulse'),'Pulso Congelante é passiva fixa da Véspera, ocupa 1 dos 5 slots e saiu da roleta');
G.enemies().length=0;G.spawnEnemy('slime',G.player.x+2,G.player.z,false);const frozenPulseTarget=G.enemies()[0];if(frozenPulseTarget)G.damageEnemy(frozenPulseTarget,1,false);const frozenSlow=1-.2*G.player.stats.chill;
ok(!!frozenPulseTarget&&frozenPulseTarget.slowF<=frozenSlow+1e-9&&Math.abs(frozenPulseTarget.slowT-.7)<1e-9,'Pulso Congelante deixa o inimigo 20% mais lento por 0,7 s');
G.newRun('mago');
const novosIds=['pspd','kb','dc'],defs=G.statUps();
for(const id of novosIds){const u=defs.find(x=>x.id===id);ok(!!u&&u.ok(G.player),'upgrade '+id+' está disponível para o perfil atual');if(u&&u.ok(G.player)){u.apply(G.player);G.player.picks.push(u.nome)}}
const ganhos=new Set(G.player.picks.filter(x=>NOVOS.includes(x)));
ok(ganhos.size===NOVOS.length,'os três upgrades individuais restantes foram aplicados sem depender da roleta ('+[...ganhos].join(', ')+')');
ok(G.player.stats.critDmg===2&&G.player.stats.pspd>1&&G.player.stats.kb>1&&G.player.stats.dashCd<1&&G.player.stats.chill===0,
  'stats dos três upgrades: critDmg='+G.player.stats.critDmg+' pspd='+G.player.stats.pspd+' kb='+G.player.stats.kb+' dashCd='+G.player.stats.dashCd+' chill='+G.player.stats.chill);
console.log('[11.5] cristais arcanos exclusivos do Mago');
G.newRun('mago');let crystal=G.mapInfo().landPos.cry[0];G.player.x=crystal.x;G.player.z=crystal.z;G.player.y=0;G.player.atkCd=30;
G.spawnEnemy('brute',crystal.x+1,crystal.z,false);let crystalTarget=G.enemies().find(e=>e.type==='brute'),crystalHp=crystalTarget.hp;G.update(1/60);
ok(crystal.used&&crystalTarget.hp<crystalHp,'Mago detona e consome o cristal, causando dano em área');
G.newRun('guerreiro');crystal=G.mapInfo().landPos.cry[0];G.player.x=crystal.x;G.player.z=crystal.z;G.player.y=0;G.player.atkCd=30;
G.spawnEnemy('brute',crystal.x+1,crystal.z,false);crystalTarget=G.enemies().find(e=>e.type==='brute');crystalHp=crystalTarget.hp;G.update(1/60);
ok(!crystal.used&&crystalTarget.hp===crystalHp,'outras classes passam pelo cristal sem ativá-lo nem causar dano');
console.log('[11.6] fogueira exclusiva do Castiel');
G.newRun('demon');ok(G.player.passives.includes('burning_fire')&&G.player.stats.burnChance===.25&&G.player.stats.burnDuration===3,'Fogo Ardente é passiva fixa de Castiel: 25% de chance e 3s de Queimação');let fire=G.mapInfo().landPos.fire[0];G.player.x=fire.x;G.player.z=fire.z;G.player.y=0;G.player.atkCd=30;G.player.fireCd=0;G.player.invuln=0;G.player.stats.burnChance=1;
const castielHp=G.player.hp;G.spawnEnemy('brute',fire.x+.35,fire.z,false);let fireTarget=G.enemies().find(e=>e.type==='brute'),fireTargetHp=fireTarget&&fireTarget.hp;if(fireTarget){fireTarget.cd=30;fireTarget.speed=0}G.update(1/60);
ok(fire.used===true&&G.player.hp===castielHp&&!!fireTarget&&fireTarget.hp<fireTargetHp,'Castiel consome a fogueira, não recebe dano e explode inimigos próximos');
const hpAfterFire=fireTarget&&fireTarget.hp;G.update(.8);ok(!!fireTarget&&fireTarget.burnT>0&&fireTarget.hp<hpAfterFire,'Queimação causa dano periódico e mantém o efeito visual no alvo');
G.newRun('guerreiro');fire=G.mapInfo().landPos.fire[0];G.player.x=fire.x;G.player.z=fire.z;G.player.y=0;G.player.atkCd=30;G.player.fireCd=0;G.player.invuln=0;const warriorFireHp=G.player.hp;G.update(1/60);
ok(!fire.used&&G.player.hp<warriorFireHp,'fogueira continua causando dano e não explode para as outras classes');
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
console.log('[14] esqueleto (definido em assets/js/enimies/skeleton.js)');
G.newRun('guerreiro');
G.spawnEnemy('skel',G.player.x+5,G.player.z);
const sk=G.enemies().find(e=>e.type==='skel');
ok(!!sk,'esqueleto spawna');
if(sk){sk.maxHp=sk.hp=1e6; // invulnerável durante o teste: queremos ver a IA, não a morte
  let sawBone=false;
  for(let k=0;k<240;k++){
    if(G.getState()==='upgrade'){const ch=G.getUps();if(ch&&ch.length===3)G.chooseUpgrade(ch[0])}else G.update(1/60);
    if(G.projs().some(p=>p.kind==='bone'))sawBone=true}
  ok(sawBone,'IA do arquivo separado rodou e jogou osso')}
}
console.log('[15] aranha — deslocamento e bote');
G.runCheat('unlock all');G.newRun('guerreiro');G.enemies().length=0;
const spider=G.spawnEnemy('spider',G.player.x+7,G.player.z);
ok(!!spider,'aranha spawna para o teste de movimento');
if(spider){spider.cd=100;const legs=spider.mesh.userData.spiderLegs||[];ok(legs.length===8,'aranha tem oito pernas articuladas');
  let maxLegSwing=0;spider.maxHp=spider.hp=1e6;const sx=spider.x,sz=spider.z;
  for(let k=0;k<90;k++){G.update(1/60);for(const leg of legs)maxLegSwing=Math.max(maxLegSwing,Math.abs(leg.hip.rotation.y))}
  ok(Math.hypot(spider.x-sx,spider.z-sz)>1,'aranha se desloca até o jogador sem ficar parada');
  ok(maxLegSwing>.05,'pernas alternam a passada durante o movimento');
  ok(Number.isFinite(spider.leapX)&&Number.isFinite(spider.leapZ),'bote mantém uma direção definida');
  const p=G.player;p.invuln=0;p.poisonT=0;p.poisonTick=0;const poisonPart=p.model.root.userData.meshes.find(it=>it.mat&&it.mat.color),normalMat=poisonPart.mat,normalGreen=normalMat.color.g;spider.x=p.x+.1;spider.z=p.z;spider.cd=0;spider.leap=0;spider.leapCd=10;
  G.update(1/60);ok(p.poisonT>0&&p.model.root.userData.poisonTintOn&&poisonPart.mat!==normalMat&&poisonPart.mat.color.g>normalGreen,'mordida da aranha deixa o personagem esverdeado (t='+p.poisonT.toFixed(2)+', tint='+p.model.root.userData.poisonTintOn+', materialAlterado='+(poisonPart.mat!==normalMat)+', verde='+poisonPart.mat.color.g.toFixed(3)+'/'+normalGreen.toFixed(3)+')');const hpAtBite=p.hp;
  spider.cd=100;spider.x=p.x+10;for(let k=0;k<60;k++)G.update(1/60);
  ok(p.hp<hpAtBite,'veneno causa dano gradual durante a invulnerabilidade');G.enemies().length=0;for(let k=0;k<150;k++)G.update(1/60);
  ok(p.poisonT===0&&!p.model.root.userData.poisonTintOn&&poisonPart.mat===normalMat,'personagem recupera as cores originais (t='+p.poisonT.toFixed(2)+', tint='+p.model.root.userData.poisonTintOn+', materialOriginal='+(poisonPart.mat===normalMat)+')')}
}catch(e){console.log('ERRO NO TESTE:',e.stack);fails.push('exceção: '+e.message)}
console.log(fails.length?('\n'+fails.length+' FALHA(S)'):'\nSMOKE_OK — tudo passou');
process.exit(fails.length?1:0);
