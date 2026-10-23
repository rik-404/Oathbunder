const b=require('fs').readFileSync('_skin.raw');const W=128,H=128;
// paleta completa
const m={};for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(!b[i+3])continue;const c=[b[i],b[i+1],b[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('');m[c]=(m[c]||0)+1}
console.log('== paleta completa (ordem: frequência)');
console.log(Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([c,n])=>c+' '+n).join(' '));
// rosto em resolução nativa: (16,16)-(48,48) no espaço 128
function grid(x0,y0,x1,y1){let s='';for(let y=y0;y<y1;y++){s+='';for(let x=x0;x<x1;x++){const i=(y*W+x)*4;s+=b[i+3]?[b[i],b[i+1],b[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''):'00'}if(s.length)s+=' |'}return s.split('\n').filter(Boolean)}
console.log('== rosto nativo (16,16)-(48,48)');console.log(grid(16,16,48,48).join('\n'));
console.log('== topo-cabeça nativo (16,0)-(48,16)');console.log(grid(16,0,48,16).join('\n'));
console.log('== lateral-cabeça nativo (32,0)-(96,16)');console.log(grid(32,0,96,16).join('\n'));
