/* DASH EXCLUSIVO DO REI: um Guarda Real carrega Midas durante o impulso. */
(function(root){
  const specials=root.DASH_SPECIALS||(root.DASH_SPECIALS={});
  let ride=null,carrier=null,passenger=null;
  function clear(ctx){
    if(ride){if(ride.parent&&ride.parent.remove)ride.parent.remove(ride);else if(ctx.fxGroup&&ctx.fxGroup.remove)ctx.fxGroup.remove(ride)}
    if(ctx.player&&ctx.player.model)ctx.player.model.root.visible=true;
    ride=null;carrier=null;passenger=null;
  }
  function create(ctx){
    const p=ctx.player;ride=new ctx.THREE.Group();ride.name='kingDashCarry';
    carrier=ctx.buildMinionMesh(true);carrier.g.name='kingDashMinion';
    passenger=ctx.buildHero('king');passenger.root.name='kingDashMidasPassenger';passenger.root.scale.setScalar(.64);
    passenger.root.position.set(0,.7,-.08);passenger.root.rotation.x=-.08;
    passenger.legL.rotation.x=.82;passenger.legR.rotation.x=.82;
    passenger.armL.rotation.x=-.58;passenger.armR.rotation.x=-.58;
    ride.add(carrier.g);ride.add(passenger.root);
    ride.position.set(p.x,ctx.relief(p.x,p.z),p.z);ride.rotation.y=Math.atan2(p.dvx,p.dvz);
    if(ctx.fxGroup)ctx.fxGroup.add(ride);
    p.model.root.visible=false;
  }
  specials.king={
    start(ctx){clear(ctx);create(ctx);const p=ctx.player;
      ctx.ringFX(p.x,p.z,.92,0xf2c14b,.22);
      ctx.burst(p.x,.46+p.y,p.z,0xf2c14b,12,{emi:.9,speed:3.4,up0:.2,up1:1.7,life:.3,size:.075});
      ctx.burst(p.x,.42+p.y,p.z,0x8c121d,6,{emi:.55,speed:2.4,up0:.15,up1:1.1,life:.26,size:.08});
    },
    render(ctx){
      const p=ctx.player;
      if(p.dashT<=0){if(ride){clear(ctx);ctx.ringFX(p.x,p.z,.72,0xf2c14b,.2);ctx.burst(p.x,.3+p.y,p.z,0xf2c14b,8,{emi:.8,speed:2.5,up0:.2,up1:1.35,life:.28,size:.07})}return}
      if(!ride)create(ctx);
      ride.position.set(p.x,ctx.relief(p.x,p.z),p.z);ride.rotation.y=Math.atan2(p.dvx,p.dvz);
      const bob=Math.abs(Math.sin(ctx.runTime*48));carrier.g.position.y=.02+bob*.045;
      carrier.g.rotation.x=Math.sin(ctx.runTime*48)*.035;
      carrier.legL.rotation.x=Math.sin(ctx.runTime*50)*.72;carrier.legR.rotation.x=-Math.sin(ctx.runTime*50)*.72;
      passenger.root.position.y=.7+bob*.025;passenger.root.rotation.x=-.08+Math.sin(ctx.runTime*24)*.025;
      passenger.armL.rotation.x=-.58+Math.sin(ctx.runTime*50)*.12;passenger.armR.rotation.x=-.58-Math.sin(ctx.runTime*50)*.12;
      p.model.root.visible=false;
    },
    stop(ctx){clear(ctx)}
  };
})(typeof window!=='undefined'?window:globalThis);
