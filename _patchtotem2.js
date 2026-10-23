const fs=require('fs');let s=fs.readFileSync('game.js','utf8');
function rep(o,n){let c=0,i=s.indexOf(o);while(i!==-1){c++;i=s.indexOf(o,i+o.length)}if(c!==1)throw new Error('ocorrencias='+c+' :: '+o.slice(0,60));s=s.split(o).join(n);console.log('ok',o.slice(0,46))}
rep('g.add(off);\r\n  return g}','g.add(off);\r\n  return {g,m,off}');
rep("const g=makeTotem();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);level.add(g);\r\n    totems.push({x,z,g,m:g.getObjectByName('mag'),off:g.getObjectByName('off'),t:rand(0,5),used:false})}",
    "const {g,m,off}=makeTotem();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);level.add(g);\r\n    totems.push({x,z,g,m,off,t:rand(0,5),used:false})");
fs.writeFileSync('game.js',s);
let h=fs.readFileSync('index.html','utf8');h=h.replace('game.js?v=110','game.js?v=111');fs.writeFileSync('index.html',h);
let w=fs.readFileSync('sw.js','utf8');w=w.replace("VERSAO='cvsw-v15'","VERSAO='cvsw-v16'");fs.writeFileSync('sw.js',w);
console.log('bumps v111 / v16');
