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
class Rt{constructor(){this.x=0;this.y=0;this.z=0}set(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;return this}setScalar(v){this.x=this.y=this.z=v;return this}copy(o){this.x=o.x;this.y=o.y;this.z=o.z;return this}}
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
const cdir='assets/js/class';const csrc=fs.readdirSync(cdir).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?1:b==='index.js'?-1:a.localeCompare(b)).map(f=>fs.readFileSync(cdir+'/'+f,'utf8')).join('\n')+'\n';const wdir='assets/js/weapons';let src=csrc+fs.readdirSync(wdir).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:a.localeCompare(b)).map(f=>fs.readFileSync(wdir+'/'+f,'utf8')).join('\n')+'\n'+fs.readFileSync('assets/js/upgrades.js','utf8')+'\n'+fs.readdirSync('assets/js/enimies').filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync('assets/js/enimies/'+f,'utf8')).join('\n')+'\n'+fs.readFileSync('game.js','utf8');
const i=src.lastIndexOf('})();');
const hook=`window.__G={newRun,update,player,enemies,damageEnemy,getBoss:()=>boss,runCheat,getState:()=>state,probe:()=>({W,H,isWall,randi:(a,b)=>randi(a,b),chests,grid}),totems:()=>totems,gems:()=>gems,pickups:()=>pickups,dropGem,dropPickup,setAi:v=>aiSkill=v,ai:()=>aiSkill,nbG:()=>nextBoss,nbS:v=>nextBoss=v,tS:v=>runTime=v};\n})();`;;
src=src.slice(0,i)+hook;
try{eval(src)}catch(e){console.log('ERRO AO CARREGAR:',e.stack);process.exit(1)}
const G=global.__G;
const frames=n=>{for(let k=0;k<n;k++){const cb=rafCb;rafCb=null;fakeT+=16.7;cb&&cb(fakeT)}};

frames(3);
G.newRun('guerreiro');
const P=G.probe();
console.log('W,H',P.W,P.H,'totens:',G.totems().length,'chests:',P.chests.length);
console.log('grid nulo?',P.grid==null,P.grid?[P.grid[64*128+64],P.grid[20*128+20],P.grid[3*128+3],P.grid[100*128+100]]:'-');
let free=0,okCand=0;
for(let x=12;x<P.W-13;x++)for(let z=12;z<P.H-13;z++){
  if(P.isWall(x,z))continue;
  if(Math.hypot(x-P.W/2,z-P.H/2)<22)continue;
  if(P.chests.some(c=>Math.hypot(c.x-x,c.z-z)<4))continue;
  okCand++;free++;
}
console.log('celulas candidatas livres no anel:',okCand);
// tenta replicar o sorteio
let n=0,tries=0;
while(n<2&&tries++<900){const x=P.randi(12,P.W-13),z=P.randi(12,P.H-13);
  if(P.isWall(x,z)||Math.hypot(x-P.W/2,z-P.H/2)<22)continue;
  if(P.chests.some(c=>Math.hypot(c.x-x,c.z-z)<4))continue;n++;console.log('sorteou',x,z)}
console.log('replicacao achou',n);
process.exit(0);
