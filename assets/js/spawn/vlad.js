(function(root){
  const registry=root.SPAWN_INTROS||(root.SPAWN_INTROS={});
  registry.dracula=function createVladSpawn(ctx){
    const {player,level,decorations,relief,ringFX,burst}=ctx;
    const duration=2.4;
    const coffin=decorations.buildCoffin(true);
    coffin.position.set(player.x,relief(player.x,player.z),player.z);
    coffin.rotation.y=0;
    level.add(coffin);
    let t=0,active=true;
    player.model.root.visible=false;
    player.atkCd=duration;
    ringFX(player.x,player.z,1.15,0x8e58c5,.5);
    ringFX(player.x,player.z,.72,0xb2000a,.36);
    burst(player.x,.35,player.z,0x9b5bd1,16,{emi:.8,speed:2.8,up0:.2,up1:1.7,life:.5,size:.075});
    return{
      coffin,duration,
      get t(){return t},
      get active(){return active},
      update(dt){
        if(!active)return;
        t=Math.min(duration,t+dt);
        if(t<duration)return;
        level.remove(coffin);
        active=false;
        ringFX(player.x,player.z,.85,0xb2000a,.28);
        burst(player.x,.55,player.z,0xb2000a,12,{emi:.7,speed:3.6,up0:.2,up1:1.8,life:.35,size:.08});
        burst(player.x,.55,player.z,0x28132f,8,{speed:2.8,up0:.1,up1:1.2,life:.3,size:.09});
        if(player.model)player.model.root.visible=true;
      },
      pose(){
        if(!active)return null;
        const p=Math.max(0,Math.min(1,t/duration)),e=p*p*(3-2*p);
        return{offsetY:-.52*(1-e),rotationX:.38*(1-e),visible:t>.08};
      }
    };
  };
})(typeof window!=='undefined'?window:globalThis);
