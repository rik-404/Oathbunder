// patch: totens de ima (drop removido) + ia adaptativa no intervalo do chefe
const fs=require('fs');
const D='C:/Users/ricar/OneDrive/\u00c1rea de Trabalho/jogos/';
function rep(file,oldS,newS,n=1){
  const p=D+file;let s=fs.readFileSync(p,'utf8');
  let c=0,i=s.indexOf(oldS);while(i!==-1){c++;i=s.indexOf(oldS,i+oldS.length)}
  if(c!==n)throw new Error(file+' ocorrencias='+c+' para: '+oldS.slice(0,70).replace(/\n/g,'\u2424'));
  fs.writeFileSync(p,s.split(oldS).join(newS));console.log('ok',file,'::',oldS.slice(0,46).replace(/\n/g,'\u2424'));
}
// A) estado: lista de totens
rep('game.js','texts=[],chests=[],landPos=null','texts=[],chests=[],totems=[],landPos=null');
// B) ima sai do drop dos inimigos
rep('game.js',
"if(r<.022)dropPickup(e.x,e.z,'heart');else if(r<.027)dropPickup(e.x,e.z,'magnet');",
"if(r<.022)dropPickup(e.x,e.z,'heart'); // \u00edma: saiu do drop dos bichos \u2014 agora \u00e9 totem fixo no mapa");
// C) construtor do totem (pilar de pedra + im\u00e3 em U flutuante)
rep('game.js','// ba\u00fa detalhado (madeira + ferro',
`// totem de \u00edma (uso \u00fanico): pilar de pedra com \u00edma flutuando. Ao gastar, o \u00edma apaga e sobra uma tampa escura
function makeTotem(){const g=new THREE.Group();
  vox(g,0,.11,0,1.05,.22,1.05,0x6f6a63);vox(g,0,.28,0,.82,.14,.82,0x837e74);vox(g,0,.42,0,.6,.1,.6,0x74706a);
  vox(g,0,.95,0,.46,1,.46,0x8f8a80);vox(g,-.23,.95,0,.1,1,.5,0x7d786f);vox(g,.23,.95,0,.1,1,.5,0x7d786f);
  vox(g,0,.7,.25,.4,.14,.07,0xd23b2f,.6); // runa vermelha na frente
  const m=new THREE.Group();m.name='mag';m.position.y=1.95;
  vox(m,-.13,.06,0,.13,.34,.15,0xd23b2f,.45);vox(m,.13,.06,0,.13,.34,.15,0xd23b2f,.45);vox(m,0,-.11,0,.39,.13,.15,0xd23b2f,.45);
  vox(m,-.13,.24,0,.13,.1,.16,0xeeeeee,.5);vox(m,.13,.24,0,.13,.1,.16,0xeeeeee,.5);
  g.add(m);
  const off=new THREE.Group();off.name='off';off.visible=false;vox(off,0,1.5,0,.3,.22,.3,0x6b665e);g.add(off);
  return g}
// ba\u00fa detalhado (madeira + ferro`);
// D) gera 2 totens por partida, longe do centro
rep('game.js',
`    const {g,lid}=makeChest();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);g.rotation.y=rand(0,TAU);level.add(g);chests.push({x,z,g,lid,open:false})}\r\n}`,
`    const {g,lid}=makeChest();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);g.rotation.y=rand(0,TAU);level.add(g);chests.push({x,z,g,lid,open:false})}\r\n  // totens de \u00edma \u2014 dois por partida, bem afastados. Ao usar: puxa orbes e moedas de todo o mapa e fica apagado\r\n  totems=[];let tt=0;while(totems.length<2&&tt++<900){const x=randi(12,W-13),z=randi(12,H-13);if(isWall(x,z)||Math.hypot(x-W/2,z-H/2)<22)continue;if(totems.some(c=>Math.hypot(c.x-x,c.z-z)<40))continue;if(chests.some(c=>Math.hypot(c.x-x,c.z-z)<4))continue;\r\n    const g=makeTotem();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);level.add(g);\r\n    totems.push({x,z,g,m:g.getObjectByName('mag'),off:g.getObjectByName('off'),t:rand(0,5),used:false})}\r\n}`);
// E) moedas tamb\u00e9m voam quando vac=true
rep('game.js',
"if(d<mag){k.pt+=dt;const sp=Math.min(24,8+k.pt*20);k.x+=dx/d*sp*dt;k.z+=dz/d*sp*dt}else k.pt=0;",
"if(d<mag||k.vac){k.pt+=dt;const sp=Math.min(24,8+k.pt*20);k.x+=dx/d*sp*dt;k.z+=dz/d*sp*dt}else k.pt=0;");
// F) ativa\u00e7\u00e3o + anima\u00e7\u00e3o dos totens no update
rep('game.js',
"for(const c of chests){if(c.open)continue;if(Math.hypot(player.x-c.x,player.z-c.z)<1.1){c.open=true;c.lid.rotation.x=-1.9;burst(c.x,.6,c.z,0xf2b84b,24,{emi:1,speed:5});S('chest');upSource='chest';openUpgrade();break}}",
`for(const c of chests){if(c.open)continue;if(Math.hypot(player.x-c.x,player.z-c.z)<1.1){c.open=true;c.lid.rotation.x=-1.9;burst(c.x,.6,c.z,0xf2b84b,24,{emi:1,speed:5});S('chest');upSource='chest';openUpgrade();break}}
  // totens de \u00edma: giram enquanto est\u00e3o ativos; ao se aproximar, disparam o v\u00e1cuo global e ficam apagados
  for(const T of totems){if(T.used)continue;T.t+=dt;T.m.rotation.y+=dt*1.6;T.m.position.y=1.95+Math.sin(T.t*2.2)*.09;
    if(Math.hypot(player.x-T.x,player.z-T.z)<2){T.used=true;T.m.visible=false;T.off.visible=true;S('magnet');addShake(.25);burst(T.x,1.6,T.z,0xd23b2f,24,{emi:.7,speed:5,up0:1,up1:4});toast('Totem de \u00cdm\u00e3!','Orbes e moedas de todo o mapa v\u00eam at\u00e9 voc\u00ea');for(const G of gems)G.vac=true;for(const K of pickups)if(K.type==='coin')K.vac=true}}`);
// G) IA adaptativa no intervalo do chefe: jogador bom = chefe vem antes
rep('game.js',
"if(t>=nextBoss){nextBoss+=240;if(!boss)spawnBoss()}",
"const bgap=Math.max(140,Math.round(240-Math.max(0,aiSkill-.4)*180)); // i\u00e1 silenciosa: quanto melhor o jogador, mais cedo o pr\u00f3ximo chefe (4 min -> ~2,3 min)\r\n  if(t>=nextBoss){nextBoss+=bgap;if(!boss)spawnBoss()}");
// H) legendas do mapa cheio
rep('game.js',"title.textContent='\ud83d\uddfa\ufe0f MAPA \u2014 \ud83e\ude99 tesouro \u00b7 \ud83d\udd25 fogueira \u00b7 \ud83d\udc8e cristal';",
"title.textContent='\ud83d\uddfa\ufe0f MAPA \u2014 \ud83e\ude99 tesouro \u00b7 \ud83d\udd25 fogueira \u00b7 \ud83d\udc8e cristal \u00b7 \ud83e\uddf2 totem';");
rep('game.js',"hint.textContent='M ou ESC fecha \u00b7 \u25c6 tesouro \u00b7 \u25c7 aberto \u00b7 \ud83d\udd25 fogueira \u00b7 \ud83d\udc8e cristal';",
"hint.textContent='M ou ESC fecha \u00b7 \u25c6 tesouro \u00b7 \u25c7 aberto \u00b7 \ud83d\udd25 fogueira \u00b7 \ud83d\udc8e cristal \u00b7 \ud83e\uddf2 totem';");
// I) marcador no mapa cheio
rep('game.js',
"x.fillStyle='#8a8a80';for(const g of landPos.grave)x.fillRect(g.x*S-1,g.z*S-1,2,2)}",
`x.fillStyle='#8a8a80';for(const g of landPos.grave)x.fillRect(g.x*S-1,g.z*S-1,2,2)}
  // totens de \u00edma
  for(const T of totems){const a=T.x*S,b=T.z*S;x.fillStyle=T.used?'#5c4a40':'#e5473c';x.fillRect(a-3,b-3,6,6);if(!T.used){x.strokeStyle='#ffd9d0';x.lineWidth=1.5;x.strokeRect(a-4,b-4,8,8)}}`);
// J) marcador no mini-mapa
rep('game.js',
"x.fillStyle='#f2b84b';for(const ch of chests)if(!ch.open){const[a,b]=P(ch.x,ch.z);x.fillRect(a-3,b-3,6,6)}",
`x.fillStyle='#f2b84b';for(const ch of chests)if(!ch.open){const[a,b]=P(ch.x,ch.z);x.fillRect(a-3,b-3,6,6)}
  x.fillStyle='#d23b2f';for(const T of totems)if(!T.used){const[a,b]=P(T.x,T.z);x.fillRect(a-3,b-3,6,6)}`);
// K) bumps
rep('index.html','game.js?v=109','game.js?v=110');
rep('sw.js',"VERSAO='cvsw-v14'",`VERSAO='cvsw-v15'`);
console.log('TUDO OK');
