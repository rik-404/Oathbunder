/* Menu principal: ações da tela título, navegação, placar resumido e brasas. */
(function(root){
  function create(ctx){
    const {
      document,onPlay,onHow,onRecords,onShop,onAchievements,onBack,
      getBestTimes,getOrder,getClassName,formatTime,getWorldRecords,
      reduceMotion,random,pick
    }=ctx;
    const find=id=>document.querySelector('#'+id);

    function bind(){
      const actions=[
        ['t-play',onPlay],['t-how',onHow],['t-recs',onRecords],
        ['t-shop',onShop],['t-ach',onAchievements]
      ];
      actions.forEach(([id,handler])=>{const button=find(id);if(button)button.onclick=handler});
      ['shop-back','ach-back','how-back','recs-back'].forEach(id=>{
        const button=find(id);if(button)button.onclick=onBack;
      });
    }

    function handleKey(e){
      if(e.code==='Enter'||e.code==='Space'){
        if(e.preventDefault)e.preventDefault();
        onPlay();
      }
      return true;
    }

    function renderBest(){
      const best=getBestTimes();let bestClass=null;
      for(const cls of getOrder())if(best[cls]&&(!bestClass||best[cls]>best[bestClass]))bestClass=cls;
      const local=bestClass?'★ SEU MELHOR '+formatTime(best[bestClass])+' · '+getClassName(bestClass):'';
      const records=getWorldRecords();
      const world=records.length?'🌍 RECORDE MUNDIAL '+records[0].name+' · '+formatTime(records[0].time):'';
      const badge=find('t-best');if(badge)badge.textContent=[local,world].filter(Boolean).join('   ');
    }

    function createEmbers(){
      const box=find('t-embers');if(!box||reduceMotion)return;
      const colors=['#f2b84b','#ff8a4a','#62b8ff','#7ee05a'];
      for(let i=0;i<16;i++){
        const ember=document.createElement('i'),size=random(3,6);
        ember.style.cssText='left:'+random(2,97).toFixed(1)+'%;width:'+size.toFixed(1)+'px;height:'+size.toFixed(1)+'px;--c:'+pick(colors)+';--sw:'+random(-70,70).toFixed(0)+'px;--dur:'+random(7,14).toFixed(1)+'s;--del:'+(-random(0,14)).toFixed(1)+'s';
        box.appendChild(ember);
      }
    }

    return{bind,handleKey,renderBest,createEmbers};
  }
  root.MAIN_MENU={create};
})(typeof window!=='undefined'?window:globalThis);
