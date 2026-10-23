const b=require('fs').readFileSync('_skin.raw');const W=128;
const P=(x,y)=>{const i=(y*W+x)*4;return b[i+3]?[b[i],b[i+1],b[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''):'.'}
console.log('amostras:',P(80,36),'P(80,37)','P(88,36)','P(44,60)',P(44,60),'P(44,61)','P(44,72)');
function grid(x0,y0,x1,y1){const out=[];for(let y=y0;y<y1;y++){let r=y+'| ';for(let x=x0;x<x1;x++)r+=P(x,y);out.push(r)}return out}
console.log('== tronco nativo (32,32)-(64,48)');console.log(grid(32,32,64,48).join('\n'));
console.log('== braco-dir nativo (96,32)-(112,48)');console.log(grid(96,32,112,48).join('\n'));
console.log('== braco-esq nativo (80,32)-(96,48)');console.log(grid(80,32,96,48).join('\n'));
console.log('== pernas nativo (0,32)-(64,96)');console.log(grid(0,32,64,96).join('\n'));
console.log('== meta inferior (overlay?) paleta y>=64');
const m={};for(let y=64;y<128;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(!b[i+3])continue;const c=[b[i],b[i+1],b[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('');m[c]=(m[c]||0)+1}
console.log(Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([c,n])=>c+' '+n).join(' '));
