const t=require('fs').readFileSync('game.js','utf8');const lines=t.split(/\r?\n/);
for(let i=858;i<=900;i++)console.log((i+1)+': '+JSON.stringify(lines[i]));
