// despeja grids hexadecimais das regiões padrão de skin MC 64x32 a partir de _skin.raw
const fs=require('fs');
const b=fs.readFileSync('_skin.raw');
const W=64,H=32;
const px=(x,y)=>{const i=(y*W+x)*4;return ((b[i+2]<<16)|(b[i+1]<<8)|b[i]).toString(16).padStart(6,'0')};
function dump(name,x0,y0,w,h){
  console.log('== '+name+' origem('+x0+','+y0+') '+w+'x'+h);
  for(let y=y0;y<y0+h;y++){
    let row='';
    for(let x=x0;x<x0+w;x++)row+=px(x,y)+' ';
    console.log(String(y).padStart(2,'0')+'| '+row);
  }
}
dump('topo-cabeça',8,0,16,8);
dump('laterais-cabeça',24,0,24,8);
dump('rosto',8,8,16,16);
dump('costas-cabeça',0,8,16,16);
dump('tronco+brazos',16,16,48,16);
dump('pernas',0,16,32,32);
