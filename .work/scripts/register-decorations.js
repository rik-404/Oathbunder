const fs=require('fs');
const file='smoke.js';
let source=fs.readFileSync(file,'utf8');
function replaceAllChecked(from,to,label){const count=source.split(from).length-1;if(!count)throw new Error(`trecho ausente: ${label}`);source=source.split(from).join(to)}
replaceAllChecked('assets/js/tree/trees.js','assets/js/decorations/trees.js','caminho das árvores');
replaceAllChecked('assets/js/environment/chest.js','assets/js/decorations/chest.js','caminho do baú');
const old=String.raw`+'\n'+fs.readFileSync('assets/js/decorations/chest.js','utf8')+'\n'+fs.readFileSync('game.js','utf8')`;
const count=source.split(old).length-1;if(count!==1)throw new Error(`trecho do carregador do smoke test não é único: ${count}`);
const next=String.raw`+'\n'+fs.readFileSync('assets/js/decorations/chest.js','utf8')+'\n'+fs.readFileSync('assets/js/decorations/index.js','utf8')+'\n'+fs.readFileSync('game.js','utf8')`;
source=source.replace(old,next);
fs.writeFileSync(file,source,'utf8');
console.log('smoke.js atualizado para os módulos em assets/js/decorations/.');
