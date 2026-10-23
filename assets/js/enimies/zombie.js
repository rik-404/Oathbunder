// Registra em window.ENEMY_DEFS.zombie (factory que recebe o helper humanoid do game.js).
// Carregado via <script> antes do game.js; o merge acontece no game.js após a declaração de ENEMY_BOXES/ENEMIES/LEGGED.
(window.ENEMY_DEFS=window.ENEMY_DEFS||{}).zombie=function(humanoid){
  return {
    legged:true, // pernas animadas (pivô no quadril)
    stats:{hp:34,speed:2.3,r:.32,dmg:9,h:1.15,color:0x7fae6a,xp:2},
    boxes:function(){
      // braços pra frente (corpo caído), chapéu na cabeça, ferida no ombro
      return humanoid({legs:0x3d4a6a,body:0x6b5a4a,trim:0x4a3a2a,skin:0x7fae6a,arm:0x7fae6a,eye:0xffee55},
        {armsFwd:true,extra:[[0,1.14,-.02,.36,.06,.36,0x2a2a1a],[.12,.6,.142,.12,.1,.02,0x7fae6a]]});
    },
    // IA: anda reto até o jogador e morde no contato (dano no cd de 0.9s).
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.contact&&e.cd<=0){c.hurtPlayer(e.dmg,e,true);e.cd=.9}}
  };
};
