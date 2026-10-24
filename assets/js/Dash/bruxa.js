/* DASH EXCLUSIVO DA BRUXA: impulso ascendente e voo sobre a vassoura voxel. */
(function(root){
  const specials=root.DASH_SPECIALS||(root.DASH_SPECIALS={});
  specials.bruxa={
    start(ctx){
      const p=ctx.player;p.dashT=.34;p.vy=Math.max(p.vy||0,6.8);p.bruxaTrailT=0;
      ctx.ringFX(p.x,p.z,.9,0xb98cff,.28);
      ctx.burst(p.x,.35+p.y,p.z,0xb98cff,12,{emi:.9,speed:4.2,up0:.5,up1:2.5,life:.32,size:.075});
      ctx.burst(p.x,.32+p.y,p.z,0x8fe1a4,6,{emi:.7,speed:3.2,up0:.3,up1:1.8,life:.28,size:.065});
    },
    update(ctx){
      const p=ctx.player;p.bruxaTrailT=(p.bruxaTrailT||0)-ctx.dt;
      if(p.bruxaTrailT<=0){p.bruxaTrailT=.065;ctx.burst(p.x,.38+p.y,p.z,0xb98cff,2,{emi:.8,speed:1.1,up0:-.05,up1:.3,grav:0,life:.22,size:.06});}
    },
    render(ctx){
      const p=ctx.player,b=p.model;if(!b||!b.broom)return;
      const flying=p.dashT>0;b.broom.visible=flying;
      if(flying){
        b.broom.position.y=.36+Math.sin(ctx.runTime*38)*.025;
        b.broom.rotation.x=Math.sin(ctx.runTime*28)*.035;
        b.broom.rotation.z=Math.sin(ctx.runTime*24)*.055;
        b.legL.rotation.x=-1.05;b.legR.rotation.x=-1.05;
        b.torso.rotation.x=-.10;
      }else{
        b.broom.position.y=.36;b.broom.rotation.set(0,0,0);b.torso.rotation.x=0;
      }
    },
    stop(ctx){const b=ctx.player&&ctx.player.model;if(b&&b.broom){b.broom.visible=false;b.broom.rotation.set(0,0,0);b.torso.rotation.x=0}}
  };
})(typeof window!=='undefined'?window:globalThis);
