/* Evento Lua de Sangue: gatilhos, hordas adicionais, temporizadores e atmosfera. */
(function(root){
  const state={active:false,time:0,cooldown:0,kills:0,visual:0,budget:0,spawnClock:0};
  let red=null;
  function spawnZombie(ctx,angle,distance,collisionRadius){
    const x=ctx.player.x+Math.sin(angle)*distance,z=ctx.player.z+Math.cos(angle)*distance;
    if(!ctx.collide(x,z,collisionRadius))ctx.spawnEnemy('zombie',x,z,false,{ms:1.05+Math.random()*.2});
  }
  function begin(ctx){
    state.active=true;state.time=35;state.cooldown=240;state.kills=0;state.budget=12;state.spawnClock=3;
    ctx.setNextHorde(Math.max(ctx.nextHorde,ctx.runTime+state.time+15));
    for(let i=0;i<16;i++)spawnZombie(ctx,i/16*ctx.TAU,15+ctx.rand(0,7),.5);
    ctx.toast('🩸 LUA DE SANGUE','Seu massacre atraiu os mortos — eles vêm grandes e fortes');
    ctx.addShake(.5);ctx.S('bossin');
  }
  root.BLOOD_MOON={
    isActive(){return state.active},
    onKill(ctx){
      if(state.active||ctx.boss||state.cooldown>0||ctx.hordeN<3||ctx.aiSkill<=.62)return false;
      state.kills++;
      if(state.kills>=80){begin(ctx);return true}
      return false;
    },
    decayKillCounter(){state.kills=Math.max(0,state.kills-1)},
    update(dt,ctx){
      if(state.active){
        state.time-=dt;state.spawnClock+=dt;
        if(state.spawnClock>3&&state.budget>0){
          state.spawnClock-=3;state.budget--;
          spawnZombie(ctx,ctx.rand(0,ctx.TAU),15+ctx.rand(0,7),.4);
        }
        if(state.time<=0){state.active=false;state.time=0;state.cooldown=240}
      }else if(state.cooldown>0)state.cooldown=Math.max(0,state.cooldown-dt);
    },
    updateVisual(dt,ctx){
      if(!red)red=new ctx.THREE.Color(0x5c0f12);
      state.visual=ctx.clamp(state.visual+(state.active?dt:-dt)*.7,0,1);
      if(state.visual>.001){
        ctx.scene.background.lerp(red,state.visual*.85);ctx.scene.fog.color.copy(ctx.scene.background);
        ctx.scene.fog.far=ctx.lerp(ctx.scene.fog.far,42,state.visual);
        ctx.sun.intensity*=(1-state.visual*.5);ctx.hemi.intensity*=(1-state.visual*.35);
      }
    },
    reset(){state.active=false;state.time=0;state.cooldown=0;state.kills=0;state.visual=0;state.budget=0;state.spawnClock=0},
    state(){return{active:state.active,time:state.time,cooldown:state.cooldown,kills:state.kills,visual:state.visual,budget:state.budget,spawnClock:state.spawnClock}}
  };
})(typeof window!=='undefined'?window:globalThis);
