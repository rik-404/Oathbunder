const t=require('fs').readFileSync('game.js','utf8');const lines=t.split(/\r?\n/);
lines.forEach((l,i)=>{if(/openUpgrade|\.ok\(|pool|picks\.push|Nenhum|esgotado|sem melhoria/i.test(l)&&i<1400)console.log((i+1)+': '+l.trim().slice(0,200))});
