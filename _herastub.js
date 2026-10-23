// Teste de fumaça: executa os 12 builders de personagem contra as pals reais do CLASSES.
const fs=require('fs'),vm=require('vm');
const game=fs.readFileSync('game.js','utf8');
const i=game.indexOf('const CLASSES={');
let d=0,end=-1;
for(let j=game.indexOf('{',i);j<game.length;j++){const c=game[j];if(c==='{')d++;else if(c==='}'&&--d===0){end=j+1;break}}
const CLASSES=vm.runInNewContext('('+game.slice(game.indexOf('{',i),end)+')');

function mkG(){return{children:[],add(c){this.children.push(c);return this},
  position:{x:0,y:0,z:0,set(){},setScalar(){}},rotation:{x:0,y:0,z:0},scale:{set(){},setScalar(){}},visible:true}}
const THREE={Group:function(){return mkG()},Mesh:function(g,m){return mkG()},
  BoxGeometry:function(){},Color:function(){},MeshLambertMaterial:function(){},MeshBasicMaterial:function(){}};

const sandbox={window:{},THREE,console};
vm.createContext(sandbox);
for(const f of fs.readdirSync('assets/js/characters')){
  if(f.endsWith('.js'))vm.runInContext(fs.readFileSync('assets/js/characters/'+f,'utf8'),sandbox,{filename:f});
}
const CH=sandbox.window.CHARACTERS||{};
const ORDER=['mago','arqueiro','guerreiro','tank','necro','chrono','pistol','dracula','demon','future','human','king'];
let fails=0;
for(const c of ORDER)if(!CH[c]){console.log('FALTA REGISTRO:',c);fails++}
for(const c of Object.keys(CH))if(!ORDER.includes(c)){console.log('REGISTRO EXTRA:',c);fails++}

for(const cls of ORDER){
  if(!CH[cls])continue;
  const b={root:mkG(),head:mkG(),torso:mkG(),armL:mkG(),armR:mkG(),handL:mkG(),handR:mkG(),keep:[],bubble:null};
  let voxN=0,badArgs=[],badPal=[];
  const vox=(p,x,y,z,w,h,d,c)=>{voxN++;
    [x,y,z,w,h,d].forEach(v=>{if(!Number.isFinite(v))badArgs.push(String(v))});
    if(typeof c!=='number'||!Number.isFinite(c))badPal.push(String(c));
    p.add(mkG())};
  let bows=0;
  try{
    CH[cls](b,CLASSES[cls].pal,vox,(h)=>{bows++;return mkG()},{});
    const bad=[];
    if(voxN<5)bad.push('só '+voxN+' vox');
    if(badArgs.length)bad.push('args não numéricos');
    if(badPal.length)bad.push('P.campo ausente ('+badPal.length+'x)');
    if(bad.length){console.log(cls.toUpperCase()+': FALHA →',bad.join('; '));fails++}
    else console.log(cls.padEnd(9),'OK  vox:'+String(voxN).padEnd(3)+' keep:'+b.keep.length+(b.bubble?' bubble':'')+(bows?' bow:'+bows:''));
  }catch(err){console.log(cls.toUpperCase()+': ERRO →',err.message);fails++}
}
console.log(fails?('→ '+fails+' problema(s)'):'→ tudo ok (12/12)');
process.exit(fails?1:0);
