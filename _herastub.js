// Teste de fumaça: executa os 12 builders de personagem (CLASSES.<classe>.model, no mesmo
// arquivo da classe em assets/js/class/<classe>.js) contra as pals reais do CLASSES.
const fs=require('fs'),vm=require('vm');
const dir='assets/js/class';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?1:b==='index.js'?-1:a.localeCompare(b));

function mkG(){return{children:[],add(c){this.children.push(c);return c},
  position:{x:0,y:0,z:0,set(){},setScalar(){}},rotation:{x:0,y:0,z:0,set(){}},scale:{set(){},setScalar(){}},visible:true,castShadow:false,material:null,geometry:null}}
const geo=function(){return{}};
const THREE={Group:function(){return mkG()},Mesh:function(g,m){return mkG()},
  BoxGeometry:geo,IcosahedronGeometry:geo,CylinderGeometry:geo,SphereGeometry:geo,ConeGeometry:geo,RingGeometry:geo,TorusGeometry:geo,PlaneGeometry:geo,CircleGeometry:geo,
  Color:function(){},MeshLambertMaterial:function(){},MeshBasicMaterial:function(){}};

const sandbox={window:{},THREE,console};
vm.createContext(sandbox);
for(const f of files)vm.runInContext(fs.readFileSync(dir+'/'+f,'utf8'),sandbox,{filename:f});
const CLASSES=sandbox.window.CLASSES||{};
const ORDER=sandbox.window.ORDER||['mago','arqueiro','guerreiro','tank','necro','chrono','pistol','dracula','demon','future','human','king'];
let fails=0;
for(const c of ORDER){
  if(!CLASSES[c]){console.log('FALTA CLASSE:',c);fails++}
  else if(typeof CLASSES[c].model!=='function'){console.log('FALTA MODELO:',c);fails++}
}
for(const c of Object.keys(CLASSES))if(!ORDER.includes(c)){console.log('CLASSE EXTRA:',c);fails++}

for(const cls of ORDER){
  if(!CLASSES[cls]||typeof CLASSES[cls].model!=='function')continue;
  const b={root:mkG(),head:mkG(),torso:mkG(),armL:mkG(),armR:mkG(),handL:mkG(),handR:mkG(),legL:mkG(),legR:mkG(),keep:[],bubble:null};
  let voxN=0,badArgs=[],badPal=[];
  const vox=(p,x,y,z,w,h,d,c)=>{voxN++;
    [x,y,z,w,h,d].forEach(v=>{if(!Number.isFinite(v))badArgs.push(String(v))});
    if(typeof c!=='number'||!Number.isFinite(c))badPal.push(String(c));
    p.add(mkG());return p.children[p.children.length-1]};
  let bows=0;
  try{
    CLASSES[cls].model(b,CLASSES[cls].pal,vox,(h)=>{bows++;return mkG()},{});
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
