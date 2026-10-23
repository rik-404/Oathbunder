const fs=require('fs');let s=fs.readFileSync('game.js','utf8');
const o='totems.push({x,z,g,m,off,t:rand(0,5),used:false})\r\n}\r\n\r\n/* ================= entidades',
      n='totems.push({x,z,g,m,off,t:rand(0,5),used:false})}\r\n}\r\n\r\n/* ================= entidades';
if(s.indexOf(o)<0)throw new Error('anchor nao achado');
s=s.split(o).join(n);fs.writeFileSync('game.js',s);console.log('ok while fechada');
