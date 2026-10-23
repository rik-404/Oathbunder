// Inimigo: esqueleto — geometria, stats e IA separados do game.js.
// Registra em window.ENEMY_DEFS.skel (factory que recebe o helper humanoid do game.js).
// Carregado via <script> antes do game.js; o merge acontece no game.js após a declaração de ENEMY_BOXES/ENEMIES/LEGGED.
(window.ENEMY_DEFS=window.ENEMY_DEFS||{}).skel=function(humanoid){
  const BOW=0x5a4a3a,RIB=0x5a5448; // arco / costelas
  return {
    legged:true, // pernas animadas (pivô no quadril)
    stats:{hp:24,speed:2.3,r:.3,dmg:8,h:1.15,color:0xd9d2bd,xp:2},
    boxes:function(){
      const bw=[];for(let i=-3;i<=3;i++)bw.push([-.32,.6+i*.1,.2-i*i*.011,.05,.11,.05,BOW]); // arco curvo
      return humanoid({legs:0xcfc7b0,body:0xd9d2bd,trim:0x8c8573,skin:0xe6dfca,arm:0xd9d2bd,eye:0xff3020},
        {extra:[[0,.5,.145,.32,.03,.02,RIB],[0,.6,.145,.32,.03,.02,RIB],[0,.7,.145,.32,.03,.02,RIB]].concat(bw)});
    },
    // IA: orbita o jogador de perto, recua no contato, flecha ossos de longe.
    // c = {d,ux,uz,mx,mz,contact,rnd,rand,spawnProj,hurtPlayer}; mx/mz são lidos depois da chamada.
    ai:function(e,dt,c){
      if(c.d<7){c.mx=-c.uz*e.side;c.mz=c.ux*e.side;if(c.d<4.5){c.mx-=c.ux;c.mz-=c.uz}if(c.rnd()<dt*.3)e.side*=-1}
      if(e.cd<=0&&c.d<12){c.spawnProj({x:e.x+c.ux*.4,z:e.z+c.uz*.4,y:.75,a:Math.atan2(c.ux,c.uz)+c.rand(-.06,.06),speed:8.5,dmg:e.dmg,owner:'e',kind:'bone',r:.2,life:2});e.cd=c.rand(2,2.8)}
      if(c.contact&&e.atk<=0){c.hurtPlayer(e.dmg*.6,e,true);e.atk=.9}e.atk-=dt}
  };
};
