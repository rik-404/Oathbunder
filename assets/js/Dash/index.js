/* Controlador comum de esquiva; os efeitos e formas exclusivos vivem em módulos próprios. */
(function(root){
  const specials=root.DASH_SPECIALS||(root.DASH_SPECIALS={});
  root.DASH_SYSTEM={
    start(ctx){
      const p=ctx.player;
      if(!p||ctx.blocked||p.dashCd>0||p.dashT>0)return false;
      let dx=ctx.moveVec.x,dz=ctx.moveVec.z;
      if(Math.hypot(dx,dz)<.1){dx=Math.sin(p.facing);dz=Math.cos(p.facing)}
      const length=Math.hypot(dx,dz)||1;
      p.dvx=dx/length*18;p.dvz=dz/length*18;p.dashT=.17;
      p.dashCd=1.1*p.stats.dashCd;p.invuln=Math.max(p.invuln,.3);
      const special=specials[p.cls];
      if(special&&special.start)special.start(ctx);
      else ctx.burst(p.x,.3+p.y,p.z,0xcfc7b0,8,{speed:2,up0:.2,up1:1.5});
      if(ctx.S)ctx.S('dash');
      return true;
    },
    update(ctx){
      const p=ctx.player;if(!p)return false;
      p.dashCd=Math.max(0,p.dashCd-ctx.dt);
      if(p.dashT<=0)return false;
      p.dashT-=ctx.dt;ctx.moveEnt(p,p.dvx*ctx.dt,p.dvz*ctx.dt);
      const special=specials[p.cls];
      if(special&&special.update)special.update(ctx);
      else if(Math.random()<.6)ctx.burst(p.x,.4+p.y,p.z,ctx.heroClass.pal.body,1,{speed:.5,up0:0,up1:.5,grav:0,life:.3,size:.18});
      if(p.cls==='future'&&p.dashT<=0&&p.model)p.model.root.visible=true;
      return true;
    },
    render(ctx){
      const p=ctx.player,special=p&&specials[p.cls];
      if(special&&special.render)special.render(ctx);
    },
    reset(ctx){
      const p=ctx.player,special=p&&specials[p.cls];
      if(special&&special.stop)special.stop(ctx);
    }
  };
})(typeof window!=='undefined'?window:globalThis);
