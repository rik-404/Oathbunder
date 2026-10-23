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
      // braços pra frente (corpo caído); camisa lisa (sem xadrez), rasgo pequeno no peito
      return humanoid({legs:J,body:T,trim:0x282828,skin:SK,arm:T,eye:0x3b622f},
        {armsFwd:true,extra:[
          [-.1,1.02,.172,.085,.11,.02,0x1a1a1a],[.1,1.02,.172,.085,.11,.02,0x1a1a1a], // olhos pretos menores, bem separados
          [0,.855,.172,.15,.045,.02,0x28351e],                                        // bocinha escura lá embaixo
          [0,.72,.142,.44,.045,.012,TD],[0,.47,.142,.44,.045,.012,TD],               // vincos sutis da camisa
          [0,.60,.146,.13,.15,.02,SK]                                                 // rasgo no peito: pele aparecendo
        ]});
    },
    // IA: anda reto até o jogador e morde no contato (dano no cd de 0.9s).
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.contact&&e.cd<=0){c.hurtPlayer(e.dmg,e,true);e.cd=.9}
    }
  };
};
