const fs=require('fs');
let s=fs.readFileSync('_ttest.js','utf8').replace(/\r\n/g,'\n');
// estende o hook com sondas
s=s.replace('getState:()=>state,', 'getState:()=>state,probe:()=>({W,H,isWall,randi:(a,b)=>randi(a,b),chests,grid}),');
const t=s.indexOf('\ntry{',s.indexOf('const frames'));
s=s.slice(0,t)+`
frames(3);
G.newRun('guerreiro');
G.update(1/60);
const P=G.probe();
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
`;
fs.writeFileSync('_dbg.js',s);
console.log('ok');
