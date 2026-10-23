const fs=require('fs');
// ---- 1) adiciona os 4 ícones de menu ao _genicons.js ----
let g=fs.readFileSync('_genicons.js','utf8');
const idx=g.indexOf("const out=path.join('assets','images','icons')");
if(idx<0)throw new Error('marcador do genicons nao encontrado');
const close=g.lastIndexOf('};',idx);
if(close<0)throw new Error('fechamento do UPG nao encontrado');
const NEW=[
"seta-cima:{pal:{G:0xf2b84b,W:0xfff0a0,g:0xc8912e},rows:[",
"'.......GG.......',",
"'......GGGG......',",
"'.....GGWWGG.....',",
"'....GGGWWGGG....',",
"'...GGGGWWGGGG...',",
"'..GGGGGWWGGGGG..',",
"'.GGGGGGWWGGGGGG.',",
"'GGGGGGGWWGGGGGGG',",
"'....GGGGWWGG....',",
"'....GGGGWWGG....',",
"'....GGGGWWGG....',",
"'....GGGGWWGG....',",
"'....gggggggg....',",
"'................',",
"'................']",
"},",
"grafico:{pal:{B:0x4aa8e8,G:0x5ad43a,Y:0xf2c14b,K:0x3a3f4a},rows:[",
"'................',",
"'............YYY.',",
"'............YYY.',",
"'.......GGG..YYY.',",
"'.......GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'..BBB..GGG..YYY.',",
"'KKKKKKKKKKKKKKKK',",
"'................',",
"'................',",
"'................']",
"},",
"trofeu:{pal:{W:0xfff0a0,G:0xf2b84b,g:0xc8912e},rows:[",
"'....WWWWWWWW....',",
"'GG.GGGGGGGGG.GG.',",
"'GGGGGGGGGGGGGGGG',",
"'GG.GGGGGGGGG.GG.',",
"'..GGGGGGGGGGGG..',",
"'...GGGGGGGGGG...',",
"'....GGGGGGGG....',",
"'.....GGGGGG.....',",
"'......GGGG......',",
"'......gggg......',",
"'.....GGGGGG.....',",
"'....gggggggg....',",
"'...GGGGGGGGGG...',",
"'..gggggggggggg..',",
"'................',",
"'................']",
"},",
"ajuda:{pal:{W:0xf2ead8,g:0xb0a488},rows:[",
"'....WWWWWWWW....',",
"'...WWWWWWWWWW...',",
"'...WW......WW...',",
"'...WW......WW...',",
"'.....WWWWWWWW...',",
"'......WWWWWW....',",
"'.......WWWW.....',",
"'.......WWW......',",
"'........WW......',",
"'........WW......',",
"'........gg......',",
"'................',",
"'.......WW.......',",
"'.......gg.......',",
"'................',",
"'................']"
].join('\n');
g=g.slice(0,close)+NEW+'\n};'+g.slice(close+2);
fs.writeFileSync('_genicons.js',g,'utf8');
console.log('GENICONS_ATUALIZADO');

// ---- 2) galeria de mídias: lista de interface ganha os 4 novos slugs ----
let t=fs.readFileSync('game.js','utf8');
const oldG4="[['🪙','ouro / recompensas'],['🔒','classe bloqueada'],['🔓','desbloquear'],['🎯','missão de desbloqueio'],['💀','abates (HUD)'],['⭐','nível / recorde'],['👹','Golem do Campo'],['⚔️','melee / título']].forEach(p=>{const em=icView(EMICON[p[0]],p[0]);";
const newG4="[['🪙','ouro','ouro / recompensas'],['🔒','trancado','classe bloqueada'],['🔓','desbloquear','desbloquear'],['🎯','alvo','missão de desbloqueio'],['💀','craneo','abates (HUD)'],['⭐','estrela','nível / recorde'],['👹','golem','Golem do Campo'],['⚔️','espadas','melee / título'],['⬆','seta-cima','menu: Upgrades'],['📊','grafico','menu: Recordes'],['🏆','trofeu','menu: Conquistas'],['❔','ajuda','menu: Como jogar']].forEach(p=>{const em=icView(p[1]||EMICON[p[0]],p[0]);";
if(t.indexOf(oldG4)<0)throw new Error('linha g4 nao encontrada');
t=t.replace(oldG4,newG4);
fs.writeFileSync('game.js',t,'utf8');
console.log('GAMEJS_GALLERY_OK');

// ---- 3) botões do título: emoji → pixel art ----
let h=fs.readFileSync('index.html','utf8');
const btns=[
['<button class="btn ghost" id="t-shop" type="button">⬆ Upgrades</button>','<button class="btn ghost" id="t-shop" type="button"><img class="cimg" src="assets/images/icons/upg/seta-cima.png?v=1" alt=""> Upgrades</button>'],
['<button class="btn ghost" id="t-ach" type="button">🏆 Conquistas</button>','<button class="btn ghost" id="t-ach" type="button"><img class="cimg" src="assets/images/icons/upg/trofeu.png?v=1" alt=""> Conquistas</button>'],
['<button class="btn ghost" id="t-recs" type="button">📊 Recordes</button>','<button class="btn ghost" id="t-recs" type="button"><img class="cimg" src="assets/images/icons/upg/grafico.png?v=1" alt=""> Recordes</button>'],
['<button class="btn ghost" id="t-how" type="button">❔ Como jogar</button>','<button class="btn ghost" id="t-how" type="button"><img class="cimg" src="assets/images/icons/upg/ajuda.png?v=1" alt=""> Como jogar</button>']
];
for(const[o,n]of btns){if(h.indexOf(o)<0)throw new Error('botao nao encontrado: '+o);h=h.replace(o,n)}
fs.writeFileSync('index.html',h,'utf8');
console.log('INDEX_HTML_OK');
