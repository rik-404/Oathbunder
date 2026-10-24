// Zumbi — skin assets/images/enemies/zombie.png: pele verde sem chapéu, olhos pretos grandes,
// camisa xadrez azul-esverdeada rasgada no peito (bainha branca mostrando o peito),
// jeans azul com sapatos cinza. Carregado via <script> antes do game.js.
(window.ENEMY_DEFS=window.ENEMY_DEFS||{}).zombie=function(humanoid){
  const J=0x463aa5,JD=0x302872,SH=0x3f3f3f; // jeans / denim escuro / sapato cinza
  const SK=0x436934;                      // pele verde
  const T=0x006868,TD=0x00555c;           // camisa teal / vinco escuro
  return {
    legged:true, // pernas animadas (pivô no quadril)
    stats:{hp:34,speed:2.3,r:.32,dmg:9,h:1.15,color:0x4b7537,xp:2},
    leg:[ // jeans + barra escura + sapato cinza com biqueira (movem junto na caminhada)
      [0,-.15,0,.16,.30,.18,J],
      [0,-.265,0,.162,.15,.182,JD],
      [0,-.31,.03,.16,.06,.26,SH]],
    boxes:function(){
      // braços arrastados pra frente; retalhos xadrez e feridas em pixels dão a silhueta de morto-vivo
      return humanoid({legs:J,body:T,trim:0x282828,skin:SK,arm:T,eye:0x3b622f},
        {armsFwd:true,extra:[
          [-.1,1.02,.174,.085,.11,.025,0x182018],[.1,1.02,.174,.085,.11,.025,0x182018], // olhos fundos
          [-.115,1.04,.191,.028,.035,.012,0x9bbd46],                                  // brilho do olho esquerdo
          [.075,1.03,.191,.035,.028,.012,0x526d34],
          [0,.855,.174,.17,.055,.025,0x28351e],                                        // boca escura
          [-.055,.842,.192,.035,.045,.018,0xd9d1a9],[.035,.842,.192,.035,.045,.018,0xe6ddbb], // dentes tortos
          [0,.72,.151,.44,.045,.02,TD],[0,.47,.151,.44,.045,.02,TD],                  // costuras da camisa
          [-.145,.66,.16,.11,.09,.025,0x177c78],[.14,.51,.16,.12,.1,.025,0x08747a], // padrão xadrez em blocos
          [.08,.69,.16,.1,.08,.025,0x164d58],[-.09,.48,.16,.13,.07,.025,0x174b56],
          [-.19,.56,.158,.08,.12,.025,0x08747a],[.2,.65,.158,.07,.11,.025,0x164d58],
          [0,.60,.17,.14,.17,.025,SK],                                                // buraco rasgado no peito
          [-.045,.55,.19,.16,.025,.025,0xc9c2a1],[.015,.60,.19,.17,.025,.025,0xb5ae90], // costelas expostas
          [-.035,.65,.19,.15,.025,.025,0xd7cfad],
          [-.17,.78,.16,.11,.1,.028,0x252d25],[.16,.77,.16,.1,.08,.028,0x613c3b], // rasgo e mancha escura
          [0,.37,.155,.48,.08,.025,0x252d25],                                         // faixa esfarrapada na cintura
          [-.3,.76,.18,.15,.055,.2,0x263b39],[.3,.76,.18,.15,.055,.2,0x16494a],    // punhos puídos
          [-.32,.7,.32,.06,.06,.08,SK],[.32,.7,.32,.06,.06,.08,SK],                 // dedos esverdeados
          [0,1.16,-.025,.34,.1,.32,0x263027],                                         // cabelo em mechas quadradas
          [-.13,1.19,-.03,.13,.09,.13,0x35402d],[.12,1.18,-.04,.11,.1,.12,0x1e2924],
          [-.2,.93,.17,.07,.09,.06,SK],[.2,.96,.17,.07,.08,.06,SK],                // orelhas assimétricas
          [-.23,.94,.195,.035,.04,.02,0x7f483b],                                     // ferida na têmpora
          [-.11,.96,.193,.04,.025,.018,0x607844],[.15,.92,.193,.035,.025,.018,0x607844], // manchas cadavéricas
          [-.12,.23,.105,.025,.22,.018,0x66843b],[.12,.23,.105,.025,.22,.018,0x66843b] // costuras da calça
        ]});
    },
    // IA: anda reto até o jogador e morde no contato (dano no cd de 0.9s).
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.contact&&e.cd<=0){c.hurtPlayer(e.dmg,e,true);e.cd=.9}
    }
  };
};
