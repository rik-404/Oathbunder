const fs=require('fs');let s=fs.readFileSync('game.js','utf8');
const o='return {g,m,off}\r\n// ba\u00fa detalhado',n='return {g,m,off}}\r\n// ba\u00fa detalhado';
if(s.indexOf(o)<0)throw new Error('anchor nao achado');
s=s.split(o).join(n);fs.writeFileSync('game.js',s);console.log('ok fechada a funcao');
