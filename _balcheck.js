// checa balanceamento por linha ignorando strings/comentarios
const s=require('fs').readFileSync('game.js','utf8');
let d=0,line=1,i=0,n=s.length,inStr=null,inLC=false,inBC=false,prev='';
const marks=[];
function scan(from,to){let dd=0;for(let p=from;p<to;p++){const c=s[p];
  if(inBC){if(c==='/'&&prev==='*'){inBC=false}continue}
  if(inLC){if(c==='\n'){inLC=false;line++}continue}
  if(inStr){if(c==='\\'){p++;continue}if(c===inStr){inStr=null}else if(c==='\n')inStr=null;continue}
  if(c==='/'&&s[p+1]==='/'){inLC=true;prev=c;continue}
  if(c==='/'&&s[p+1]==='*'){inBC=true;prev=c;continue}
  if(c==="'"||c==='"'||c==='`'){inStr=c;prev=c;continue}
  if(c==='{'||c==='('||c==='[')dd++;
  if(c==='}'||c===')'||c===']')dd--;
  prev=c}return dd}
// varre linha a linha
let start=0;
while(start<n){
  let nl=s.indexOf('\n',start);if(nl<0)nl=n;
  const delta=scan(start,nl+1);
  d+=delta;marks.push([line,d]);line++;start=nl+1;
}
console.log('final',d);
// mostra linhas onde o salto foi >=2 em modulo ou onde depth ficou <0
for(const[l,dd]of marks){if(dd<0)console.log('NEGATIVA linha',l,dd)}
// profundidade no fim de cada funcao grande: imprime trechos suspeitos (regioes inseridas nesta sessao)
const reg=[['makeTotem',/function makeTotem/,14],['totens worldgen',/totens=\[\];let tt=0/,6],['totens update',/for\(const T of totems\)\{if\(T.used\)continue;T\.t\+=dt/,3],['bgap',/const bgap=Math\.max/,2],['drawMap tot',/for\(const T of totems\)\{const a=T\.x\*S/,3],['drawMini tot',/for\(const T of totems\)if\(!T\.used\)/,1]];
for(const[name,re,skip]of reg){const m=re.exec(s);if(!m){console.log(name,'NAO ACHADO');continue}
  const from=m.index;let to=from;for(let k=0;k<skip;k++)to=s.indexOf('\n',to+1)+1;
  console.log(name,'delta=',scan(from,to))}
