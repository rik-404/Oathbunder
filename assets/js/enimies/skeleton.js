// Registra em window.ENEMY_DEFS.skel (factory que recebe o helper humanoid do game.js).
// Carregado via <script> antes do game.js; o merge acontece no game.js após a declaração de ENEMY_BOXES/ENEMIES/LEGGED.
(window.ENEMY_DEFS=window.ENEMY_DEFS||{}).skel=function(humanoid){
  const SK=0xa3a3a3,SP=0x8f8f8f,PV=0x919191,AR=0x919191,LEG=0x8f8f8f,FT=0x9b9b9b;// crânio/espinha/pelve/braços/perna/pé
  const BONE=0xcacaca,BONEl=0xd8d8d8,RIB=0x6e6e6e,JW=0xcacaca;                   // osso da mão/costelas/maxilar
  return {
    legged:true, // pernas animadas (pivô no quadril)
    stats:{hp:24,speed:2.3,r:.3,dmg:8,h:1.15,color:0x989898,xp:2},
    // perna fina em 3 peças (fêmur, tíbia, pé) com folga no joelho — substitui o bloco maciço do enemyLegGeo
    leg:[[0,-.12,0,.055,.17,.055,LEG],[0,-.27,0,.05,.14,.05,LEG],[0,-.325,.03,.06,.05,.13,FT]],
    boxes:function(){
      // esqueleto todo em caixas finas com folgas: crânio, maxilar, espinha, costelas, braços de osso.
      // (sem arco: segura um osso na mão direita e joga ossos à distância)
      return [
        [-.11,.17,0,.16,.34,.18,LEG],[.11,.17,0,.16,.34,.18,LEG],                // placeholders cortados pelo enemyBodyGeo
        [0,.36,0,.18,.08,.12,PV],                                                // pelve
        [0,.54,0,.055,.34,.05,SP],                                               // espinha dorsal
        [0,.44,.03,.30,.035,.10,RIB],[0,.525,.03,.34,.035,.11,RIB],              // costelas com folgas
        [0,.61,.03,.30,.035,.11,RIB],[0,.695,.03,.22,.035,.10,RIB],
        [0,.70,0,.56,.04,.06,SP],                                                     // clavícula ligando os ombros
        [-.3,.64,0,.07,.11,.07,AR],[.3,.64,0,.07,.11,.07,AR],                         // omóplatos (articulação do ombro)
        [-.3,.56,0,.05,.18,.05,AR],[-.3,.38,0,.045,.16,.045,AR],[-.3,.27,0,.07,.08,.07,BONE],   // braço esq.
        [.3,.56,0,.05,.18,.05,AR],[.3,.38,0,.045,.16,.045,AR],[.3,.27,0,.07,.08,.07,BONE],      // braço dir.
        [.3,.27,.10,.045,.045,.30,BONE],[.3,.27,.27,.09,.09,.09,BONEl],          // osso na mão
        [0,.86,0,.26,.22,.26,SK],[0,.735,.05,.16,.04,.13,JW],                    // crânio + maxilar solto
        [-.055,.88,.131,.045,.04,.01,0xff3020],[.055,.88,.131,.045,.04,.01,0xff3020]];          // olhos
    },
    // IA: orbita o jogador de perto, recua no contato, joga osso de longe.
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.d<7){c.mx=-c.uz*e.side;c.mz=c.ux*e.side;if(c.d<4.5){c.mx-=c.ux;c.mz-=c.uz}if(c.rnd()<dt*.3)e.side*=-1}
      if(e.cd<=0&&c.d<12){c.spawnProj({x:e.x+c.ux*.4,z:e.z+c.uz*.4,y:.75,a:Math.atan2(c.ux,c.uz)+c.rand(-.06,.06),speed:8.5,dmg:e.dmg,owner:'e',kind:'bone',r:.2,life:2});e.cd=c.rand(2,2.8)}
      if(c.contact&&e.atk<=0){c.hurtPlayer(e.dmg*.6,e,true);e.atk=.9}e.atk-=dt}
  };
};
