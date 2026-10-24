(function(root){
  const registry=root.SPAWN_INTROS||(root.SPAWN_INTROS={});
  registry.demon=function createDemonSpawn(ctx){
    const {player,level,relief,ringFX,burst,vox,THREE}=ctx;
    const duration=2.6,radius=1.18;
    const ritual=new THREE.Group();
    ritual.position.set(player.x,relief(player.x,player.z)+.025,player.z);
    level.add(ritual);
    const points=Array.from({length:5},(_,i)=>{
      const a=-Math.PI/2+i*Math.PI*2/5;
      return{x:Math.cos(a)*radius,z:Math.sin(a)*radius};
    });
    const bar=(a,b,width,height,color,glow)=>{
      const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
      const mesh=vox(ritual,(a.x+b.x)/2,.035,(a.z+b.z)/2,width,height,length,color,glow);
      mesh.rotation.y=Math.atan2(dx,dz);
      return mesh;
    };
    for(let i=0;i<5;i++)bar(points[i],points[(i+1)%5],.075,.045,0x64101d,.35);
    const star=[0,2,4,1,3,0];
    for(let i=0;i<5;i++)bar(points[star[i]],points[star[i+1]],.055,.065,0xe52b42,.95);
    points.forEach((p,i)=>{
      vox(ritual,p.x,.075,p.z,.14,.065,.14,i%2?0xff463b:0xf52a3d,1);
      const rune=vox(ritual,p.x*.58,.065,p.z*.58,.075,.045,.075,0xff7044,.7);
      rune.rotation.y=i*Math.PI*.4;
    });
    vox(ritual,0,.065,0,.12,.055,.12,0xff493f,1);
    player.model.root.visible=false;
    player.atkCd=duration;
    ringFX(player.x,player.z,1.55,0xd91d3b,.55);
    ringFX(player.x,player.z,.48,0xff563c,.4);
    burst(player.x,.18,player.z,0xe52b42,22,{emi:.9,speed:3.2,up0:.15,up1:1.8,life:.55,size:.08});
    burst(player.x,.12,player.z,0x28101b,10,{speed:2.5,up0:.1,up1:1.2,life:.45,size:.09});
    let t=0,active=true,erupted=false;
    return{
      ritual,duration,
      get t(){return t},
      get active(){return active},
      update(dt){
        if(!active)return;
        t=Math.min(duration,t+dt);
        ritual.scale.setScalar(.96+Math.sin(t*10)*.035);
        if(!erupted&&t>.55){erupted=true;ringFX(player.x,player.z,1.35,0xff3c36,.38);
          burst(player.x,.3,player.z,0xff492f,24,{emi:1,speed:4.4,up0:.3,up1:2.6,life:.48,size:.085});
          burst(player.x,.25,player.z,0xf5aa42,10,{emi:.9,speed:3.2,up0:.4,up1:2.1,life:.42,size:.07})}
        if(t<duration)return;
        level.remove(ritual);
        active=false;
        ringFX(player.x,player.z,.95,0xff3c36,.3);
        burst(player.x,.55,player.z,0xe52b42,18,{emi:.8,speed:3.8,up0:.2,up1:2,life:.38,size:.08});
        if(player.model)player.model.root.visible=true;
      },
      pose(){
        if(!active)return null;
        const p=Math.max(0,Math.min(1,t/duration)),e=p*p*(3-2*p);
        return{offsetY:-.78*(1-e),rotationX:.2*(1-e),visible:t>.12};
      }
    };
  };
})(typeof window!=='undefined'?window:globalThis);
