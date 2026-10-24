/* DASH EXCLUSIVO DO SMITH: glitch temporal ciano e magenta. */
(function(root){
  const specials=root.DASH_SPECIALS||(root.DASH_SPECIALS={});
  function glitchFX(ctx,x,y,z){
    ctx.ringFX(x,z,.92,0x3bf0d0,.2);ctx.ringFX(x,z,.6,0xf247d7,.16);
    ctx.burst(x,y,z,0x3bf0d0,7,{emi:1,speed:4.8,up0:.15,up1:1.6,life:.24,size:.07});
    ctx.burst(x,y,z,0xf247d7,6,{emi:1,speed:4.2,up0:.1,up1:1.3,life:.22,size:.065});
  }
  specials.future={
    start(ctx){const p=ctx.player;p.glitchT=0;p.glitchFxT=0;glitchFX(ctx,p.x,.45+p.y,p.z)},
    update(ctx){
      const p=ctx.player;p.glitchT=(p.glitchT||0)+ctx.dt;p.glitchFxT=(p.glitchFxT||0)-ctx.dt;
      if(p.glitchFxT<=0){p.glitchFxT=.045;glitchFX(ctx,p.x,.4+p.y,p.z)}
      if(p.model)p.model.root.visible=Math.floor(p.glitchT*52)%6!==0;
      if(p.dashT<=0&&p.model)p.model.root.visible=true;
    },
    render(ctx){const p=ctx.player;if(p.dashT>0&&p.model)p.model.root.visible=Math.floor((p.glitchT||0)*52)%6!==0}
  };
})(typeof window!=='undefined'?window:globalThis);
