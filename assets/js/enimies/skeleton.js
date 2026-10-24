// Registra em window.ENEMY_DEFS.skel (factory que recebe o helper humanoid do game.js).
// Carregado via <script> antes do game.js; o merge acontece no game.js após a declaração de ENEMY_BOXES/ENEMIES/LEGGED.
(window.ENEMY_DEFS=window.ENEMY_DEFS||{}).skel=function(humanoid){
  const SK=0xd8c9ac,SP=0xb09a7b,PV=0x927c62,AR=0xb7a385,LEG=0xb09b7d,FT=0xd1bd98;
  const BONE=0xe4d2ae,BONEl=0xf5e5c4,RIB=0xc2ad8d,JW=0xc5b18e;
  const SOCKET=0x30252a,EYE=0xff5939,PUPIL=0xffdf86,ARMOR=0x514248,BRASS=0xb98649;
  return {
    legged:true, // pernas animadas (pivô no quadril)
    stats:{hp:24,speed:2.3,r:.3,dmg:8,h:1.15,color:0x989898,xp:2},
    // Perna articulada em voxels finos, com joelho, canela e dedos.
    leg:[[0,-.12,0,.062,.17,.065,LEG],[0,-.27,0,.052,.14,.055,LEG],[0,-.325,.045,.065,.05,.12,FT],
      [0,-.205,.035,.09,.065,.075,PV],[0,-.22,.073,.05,.075,.018,BONEl],[-.027,-.33,.105,.03,.03,.065,BONE],[.027,-.33,.105,.03,.03,.065,BONE]],
    boxes:function(){
      // Dois primeiros blocos são placeholders de pernas e são removidos pelo game.js.
      const bx=[
        [-.11,.17,0,.16,.34,.18,LEG],[.11,.17,0,.16,.34,.18,LEG],
        [0,.36,0,.21,.09,.14,PV],[-.085,.365,.025,.09,.10,.12,SK],[.085,.365,.025,.09,.10,.12,SK], // pelve
        [0,.43,0,.07,.055,.075,SP],[0,.50,0,.07,.055,.075,BONE],[0,.57,0,.07,.055,.075,SP],
        [0,.64,0,.07,.055,.075,BONE],[0,.69,0,.07,.05,.075,SP],                              // vértebras
        [0,.55,.095,.045,.25,.025,BONEl],                                                     // esterno
        [-.06,.45,.075,.13,.035,.045,BONE],[.06,.45,.075,.13,.035,.045,BONE],
        [-.07,.52,.08,.15,.035,.045,BONEl],[.07,.52,.08,.15,.035,.045,BONEl],
        [-.075,.59,.075,.16,.035,.045,BONE],[.075,.59,.075,.16,.035,.045,BONE],
        [-.06,.655,.06,.13,.035,.04,RIB],[.06,.655,.06,.13,.035,.04,RIB],                    // costelas em pares
        [-.145,.52,.015,.035,.18,.06,SP],[.145,.52,.015,.035,.18,.06,SP],                    // laterais da caixa torácica
        [0,.70,.02,.45,.045,.065,BONEl],                                                       // clavícula
        [-.3,.64,0,.09,.11,.09,AR],[.3,.64,0,.09,.11,.09,AR],                                // ombros articulados
        [-.3,.56,0,.055,.17,.055,AR],[-.3,.38,0,.045,.16,.045,BONE],[-.3,.27,0,.07,.08,.07,BONEl],
        [.3,.56,0,.055,.17,.055,AR],[.3,.46,.025,.075,.07,.075,PV],[.3,.38,0,.045,.16,.045,BONE],[.3,.27,0,.07,.08,.07,BONEl],
        // Ombreira antiga e assimétrica para dar silhueta própria ao guardião.
        [-.3,.655,.04,.145,.13,.16,ARMOR],[-.3,.725,.045,.12,.025,.14,BRASS],[-.3,.66,.13,.035,.035,.018,0xe7c16e],
        // Osso/porrete na mão direita, com cabeça irregular e farpas.
        [.3,.27,.10,.045,.045,.30,BONE],[.3,.27,.27,.09,.09,.09,BONEl],
        [.255,.27,.285,.035,.07,.055,BONE],[.345,.27,.285,.035,.07,.055,BONE],
        // Crânio em camadas, órbitas fundas, olhos em brasa e maxilar dentado.
        [0,.86,0,.29,.23,.27,SK],[0,.958,-.025,.22,.055,.22,BONEl],
        [-.13,.86,.02,.045,.14,.18,SP],[.13,.86,.02,.045,.14,.18,SP],
        [-.065,.94,.13,.105,.035,.025,BONE],[.065,.94,.13,.105,.035,.025,BONE],
        [-.07,.89,.14,.086,.082,.025,SOCKET],[.07,.89,.14,.086,.082,.025,SOCKET],
        [-.07,.89,.157,.047,.048,.014,EYE],[.07,.89,.157,.047,.048,.014,EYE],
        [-.07,.89,.166,.018,.027,.008,PUPIL],[.07,.89,.166,.018,.027,.008,PUPIL],
        [-.11,.79,.085,.07,.07,.09,BONE],[.11,.79,.085,.07,.07,.09,BONE],
        [0,.82,.15,.045,.065,.025,SOCKET],                                                   // cavidade nasal
        [0,.745,.05,.20,.075,.16,JW],[0,.746,.14,.16,.025,.02,SOCKET]                       // maxilar e boca
      ];
      for(let i=-2;i<=2;i++)bx.push([i*.032,.75,.153,.023,.032,.02,i%2?BONE:BONEl]);          // dentes separados
      return bx;
    },
    // IA: orbita o jogador de perto, recua no contato, joga osso de longe.
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.d<7){c.mx=-c.uz*e.side;c.mz=c.ux*e.side;if(c.d<4.5){c.mx-=c.ux;c.mz-=c.uz}if(c.rnd()<dt*.3)e.side*=-1}
      if(e.cd<=0&&c.d<12){c.spawnProj({x:e.x+c.ux*.4,z:e.z+c.uz*.4,y:.75,a:Math.atan2(c.ux,c.uz)+c.rand(-.06,.06),speed:8.5,dmg:e.dmg,owner:'e',kind:'bone',r:.2,life:2});e.cd=c.rand(2,2.8)}
      if(c.contact&&e.atk<=0){c.hurtPlayer(e.dmg*.6,e,true);e.atk=.9}e.atk-=dt}
  };
};
