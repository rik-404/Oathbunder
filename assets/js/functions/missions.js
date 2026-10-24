// Sistema de missões: definições, progresso e conclusão vivem fora do game.js.
// O motor fornece apenas os dados dinâmicos da partida e as ações de desbloqueio/UI.
(function(){
  function create(runtime){
    const inRun=()=>runtime.isRunActive();
    const missions={
      arqueiro:{goal:1,label:'corrida',desc:'Jogue uma corrida até o fim (até morrer)',prog:()=>Math.min(1,runtime.getMeta().runs)},
      tank:{goal:2000,label:'de dano',desc:'Receba 2.000 de dano numa única corrida',prog:()=>Math.min(2000,Math.max(runtime.getMeta().maxDmg,inRun()?runtime.getRunDamage():0)),
        notify:({name,goal})=>['🛡️ '+name+' liberado!','Missão cumprida: '+goal+' de dano recebido']},
      necro:{goal:2500,label:'esqueletos',desc:'Abata 2.500 esqueletos no total',prog:()=>Math.min(2500,runtime.getMeta().skelKills+(inRun()?runtime.getRunSkeletons():0)),
        notify:({name,goal})=>['💀 '+name+' liberado!','Missão cumprida: '+goal+' esqueletos abatidos']},
      chrono:{goal:1200,label:'',fmt:v=>runtime.formatTime(v),desc:'Sobreviva 20 minutos numa única corrida',prog:()=>Math.min(1200,Math.max(runtime.getMeta().bestTime,inRun()?runtime.getRunTime():0)),
        notify:({name})=>['⏳ '+name+' liberado!','Missão cumprida: 30 minutos sobrevividos']},
      pistol:{goal:300,label:'abates numa corrida',desc:'Faça 300 abates numa única corrida',prog:()=>Math.min(300,Math.max(runtime.getMeta().maxKills,inRun()?runtime.getKills():0)),
        notify:({name,goal})=>['🔫 '+name+' liberado!','Missão cumprida: '+goal+' abates numa corrida']},
      dracula:{goal:1500,label:'morcegos',desc:'Abata 1.500 morcegos no total',prog:()=>Math.min(1500,runtime.getMeta().batKills+(inRun()?runtime.getRunBats():0)),
        notify:({name,goal})=>['🧛 '+name+' liberado!','Missão cumprida: '+goal+' morcegos abatidos']},
      bruxa:{goal:5000,label:'aranhas',desc:'Abata 5.000 aranhas no total',prog:()=>Math.min(5000,runtime.getMeta().spiderKills+(inRun()?runtime.getRunSpiders():0)),
        notify:()=>['🧙 Bruxa liberada!','Missão cumprida: 5.000 aranhas abatidas']},
      demon:{goal:5,label:'Golens',desc:'Derrote o Golem 5 vezes no total',prog:()=>Math.min(5,runtime.getMeta().bosses+runtime.getBossKills()),
        notify:({name,goal})=>['😈 '+name+' liberado!','Missão cumprida: '+goal+' Golens derrotados']},
      future:{goal:20,label:'de nível',desc:'Alcance o nível 20 numa única corrida',prog:()=>Math.min(20,Math.max(runtime.getMeta().bestLvl,inRun()?runtime.getPlayerLevel():0)),
        notify:({name,goal})=>['🛸 '+name+' liberado!','Missão cumprida: nível '+goal+' alcançado']},
      human:{goal:3,label:'corridas',desc:'Jogue 3 corridas (o Zé insiste em aparecer)',prog:()=>Math.min(3,runtime.getMeta().runs)},
      king:{goal:1000,label:'de ouro',desc:'Acumule 1.000 de ouro',prog:()=>Math.min(1000,runtime.getCoins()),
        notify:({name,goal,formatNumber})=>['👑 '+name+' liberado!','Missão cumprida: '+formatNumber(goal)+' de ouro acumulado']}
    };
    function complete(id,current,options){
      const mission=missions[id];
      if(!mission||!Number.isFinite(current)||current<mission.goal||runtime.isUnlocked(id))return false;
      runtime.unlock(id);
      if(mission.notify&&!(options&&options.silent)){
        const [title,subtitle]=mission.notify({name:runtime.className(id),goal:mission.goal,formatNumber:runtime.formatNumber});
        runtime.toast(title,subtitle);
      }
      return true;
    }
    return{missions,complete};
  }
  window.MISSIONS_MODULE=Object.freeze({create});
})();
