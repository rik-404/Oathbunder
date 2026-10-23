// monta _ttest.js a partir do harness do smoke.js com um hook ampliado
const fs=require('fs');
let s=fs.readFileSync('smoke.js','utf8');
const h1=s.indexOf('const hook=');
let e=s.indexOf('})();`;',h1);
if(h1<0||e<0)throw new Error('hook nao achado');
e+=6; // apos ";", sobra o CRLF original
const newhook='const hook=`window.__G={newRun,update,player,enemies,damageEnemy,getBoss:()=>boss,runCheat,getState:()=>state,totems:()=>totems,gems:()=>gems,pickups:()=>pickups,dropGem,dropPickup,setAi:v=>aiSkill=v,ai:()=>aiSkill,nbG:()=>nextBoss,nbS:v=>nextBoss=v,tS:v=>runTime=v};\\n})();`;';
s=s.slice(0,h1)+newhook+s.slice(e);
const t1=s.indexOf('\ntry{',s.indexOf('const frames'));
if(t1<0)throw new Error('bloco de testes nao achado');
s=s.slice(0,t1)+`
try{
console.log('[T] totens de ímã');
G.newRun('guerreiro');
G.runCheat('god');
const T=G.totems();
ok(T.length===2,'dois totens por partida');
ok(T.every(t=>!t.used&&t.m&&t.off&&t.m.visible===true&&t.off.visible===false),'totens nascem ativos (imã visível, tampa oculta)');
const p=G.player;
G.dropPickup(p.x+25,p.z,'coin',5);
G.dropGem(p.x+30,p.z,3);
const ck=G.pickups()[G.pickups().length-1],gm=G.gems()[G.gems().length-1];
p.x=T[0].x+1.2;p.z=T[0].z+1.2;
G.update(1/60);
ok(T[0].used===true,'tocar no totem o ativa');
ok(T[0].m.visible===false&&T[0].off.visible===true,'usado, parou de funcionar: imã apagou, tampa escura no lugar');
ok(T[1].used===false,'o segundo totem segue intacto');
ok(ck.vac===true,'moeda distante passou a voar até o jogador (vac)');
ok(gm.vac===true,'orbe distante passou a voar até o jogador (vac)');
console.log('[B] intervalo de chefe adaptativo');
if(G.getBoss())G.damageEnemy(G.getBoss(),1e9);
G.setAi(.2);G.nbS(99);G.tS(99);
G.update(1/60);
const gapBaixo=G.nbG()-99;
ok(gapBaixo>=239&&gapBaixo<=241,'jogador fraco: chefe mantém os 4 min (gap='+Math.round(gapBaixo)+')');
ok(!!G.getBoss(),'chefe nasceu no horário');
G.damageEnemy(G.getBoss(),1e9);
G.setAi(1);G.nbS(298);G.tS(298);
G.update(1/60);
const gapAlto=G.nbG()-298;
ok(gapAlto>=139&&gapAlto<=141,'jogador bom: chefe vem mais cedo (gap='+Math.round(gapAlto)+' esperado 140)');
}catch(e){console.log('ERRO NO TESTE:',e.stack);fails.push('exceção: '+e.message)}
console.log(fails.length?('\\n'+fails.length+' FALHA(S)'):'\\nTT_OK — tudo passou');
process.exit(fails.length?1:0);
`;
fs.writeFileSync('_ttest.js',s.replace(/\r\n/g,'\n'));
console.log('gerado _ttest.js, linhas:',s.split('\n').length);
