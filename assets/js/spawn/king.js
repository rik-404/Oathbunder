/* ================= SPAWN DO REI: ERGUE-SE DO TRONO ================= */
(function(root){
  const registry=root.SPAWN_INTROS||(root.SPAWN_INTROS={});
  registry.king=function createKingSpawn(ctx){
    const {player,level,decorations,relief,ringFX,burst}=ctx;
    const duration=3.1,seatOffset=.70;
    const throne=decorations.buildRoyalThrone();
    throne.position.set(player.x,relief(player.x,player.z+seatOffset),player.z+seatOffset);
    throne.rotation.y=Math.PI;
    level.add(throne);
    let t=0,active=true,stepFx=false;
    player.model.root.visible=true;
    player.atkCd=duration;
    ringFX(player.x,player.z+seatOffset,1.25,0xf2c14b,.48);
    ringFX(player.x,player.z+seatOffset,.72,0x4fd8bf,.3);
    burst(player.x,.78+relief(player.x,player.z+seatOffset),player.z+seatOffset,0xf2c14b,14,{emi:.85,speed:2.3,up0:.2,up1:1.5,life:.48,size:.075});
    const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
    return{
      throne,duration,
      get t(){return t},
      get active(){return active},
      update(dt){
        if(!active)return;
        t=Math.min(duration,t+dt);
        throne.position.y=relief(throne.position.x,throne.position.z)+Math.sin(t*3)*.008;
        if(!stepFx&&t>.62){stepFx=true;ringFX(player.x,player.z+seatOffset*.55,1.05,0xf2c14b,.34);
          burst(player.x,.62+relief(player.x,player.z),player.z+.38,0xf2c14b,12,{emi:.8,speed:2.8,up0:.2,up1:1.7,life:.42,size:.07})}
        if(t<duration)return;
        level.remove(throne);
        active=false;
        player.atkCd=.38;
        ringFX(player.x,player.z,.95,0xf2c14b,.3);
        burst(player.x,.38+relief(player.x,player.z),player.z,0xf2c14b,16,{emi:.85,speed:3.2,up0:.2,up1:1.8,life:.42,size:.08});
        burst(player.x,.32+relief(player.x,player.z),player.z,0x4fd8bf,8,{emi:.7,speed:2.5,up0:.2,up1:1.4,life:.36,size:.065});
        if(player.model){player.model.root.visible=true;player.model.legL.rotation.x=0;player.model.legR.rotation.x=0;player.model.torso.rotation.x=0}
      },
      pose(){
        if(!active)return null;
        const rise=smooth(t/.42),step=smooth((t-.45)/(duration-.45));
        return{offsetY:.53+.28*rise-.81*step,offsetZ:seatOffset*(1-step),rotationX:-.1*(1-step),sit:1-smooth(t/.78),visible:true};
      }
    };
  };
})(typeof window!=='undefined'?window:globalThis);
