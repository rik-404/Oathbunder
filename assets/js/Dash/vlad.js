/* DASH EXCLUSIVO DO VLAD: impulso carmesim e transformação em morcego voxel. */
(function(root){
  const specials=root.DASH_SPECIALS||(root.DASH_SPECIALS={});
  specials.dracula={
    start(ctx){const p=ctx.player;
      ctx.burst(p.x,.65+p.y,p.z,0xb2000a,14,{emi:.7,speed:4.8,up0:.15,up1:1.5,life:.28,size:.085});
      ctx.burst(p.x,.55+p.y,p.z,0x1c0507,8,{speed:3.4,up0:.1,up1:1.1,life:.24,size:.095});
    },
    render(ctx){
      const p=ctx.player,b=p.model;if(!b||!b.dashBat)return;
      const transforming=p.dashT>0;b.dashBat.visible=transforming;b.torso.visible=!transforming;b.legL.visible=!transforming;b.legR.visible=!transforming;
      if(transforming){const flap=Math.sin(ctx.runTime*42)*.82;b.dashBatWings[0].rotation.z=-flap;b.dashBatWings[1].rotation.z=flap;
        const aim=Math.atan2(p.dvx,p.dvz),delta=Math.atan2(Math.sin(aim-p.facing),Math.cos(aim-p.facing));
        b.dashBat.rotation.y=delta;b.dashBat.rotation.x=-.12;b.dashBat.rotation.z=Math.sin(ctx.runTime*32)*.06;b.dashBat.position.y=.025+Math.sin(ctx.runTime*42)*.025;
      }else{b.dashBat.rotation.set(0,0,0);b.dashBat.position.y=0;b.dashBatWings[0].rotation.z=0;b.dashBatWings[1].rotation.z=0}
    }
  };
})(typeof window!=='undefined'?window:globalThis);
