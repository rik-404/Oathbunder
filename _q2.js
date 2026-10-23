const fs=require('fs');let g=fs.readFileSync('_genicons.js','utf8');
const i=g.indexOf('seta-cima');
console.log(JSON.stringify(g.slice(i-60,i+40)));
