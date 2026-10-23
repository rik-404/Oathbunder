const t=require('fs').readFileSync('game.js','utf8');const lines=t.split(/\r?\n/);
lines.forEach((l,i)=>{if(/dmgText/.test(l)&&/function|const|=>/.test(l))console.log('DEF'+(i+1)+': '+l.trim().slice(0,160))});
for(let i=1258;i<=1276;i++)console.log((i+1)+': '+lines[i].slice(0,185));
console.log('--- autoAttack spawn');
const ia=lines.findIndex(l=>/function autoAttack/.test(l));
for(let i=ia;i<ia+16&&i<lines.length;i++)console.log('A'+(i+1)+': '+lines[i].slice(0,185));
