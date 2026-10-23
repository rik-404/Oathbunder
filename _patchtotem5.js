const fs=require('fs');let s=fs.readFileSync('game.js','utf8');
const o="for(const T of totems){const a=T.x*S,b=T.z*S;x.fillStyle=T.used?'#5c4a40':'#e5473c';x.fillRect(a-3,b-3,6,6);if(!T.used){x.strokeStyle='#ffd9d0';x.lineWidth=1.5;x.strokeRect(a-4,b-4,8,8)}}",
      n="for(const T of totems){const a=T.x*S,b=T.z*S;if(!T.used){x.fillStyle='#ffd9d0';x.fillRect(a-4,b-4,8,8)}x.fillStyle=T.used?'#5c4a40':'#e5473c';x.fillRect(a-3,b-3,6,6)}";
if(s.indexOf(o)<0)throw new Error('anchor nao achado');
s=s.split(o).join(n);fs.writeFileSync('game.js',s);console.log('ok marcador sem strokect');
let h=fs.readFileSync('index.html','utf8');h=h.replace('game.js?v=111','game.js?v=112');fs.writeFileSync('index.html',h);
let w=fs.readFileSync('sw.js','utf8');w=w.replace("VERSAO='cvsw-v16'","VERSAO='cvsw-v17'");fs.writeFileSync('sw.js',w);
console.log('bumps v112 / v17');
