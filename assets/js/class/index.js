/* ================= CLASSES - INDEX =================
 * Carrega todas as classes e define constantes compartilhadas
 * ================================================= */

// Ordem das classes no menu
window.ORDER = ['mago','arqueiro','guerreiro','tank','necro','chrono','pistol','dracula','demon','future','human','king'];

// Tipos de classe para exibição
window.CLSTIPO = {
  mago: 'Mago',
  arqueiro: 'Arqueiro',
  guerreiro: 'Guerreiro',
  tank: 'Guardião',
  necro: 'Necromante',
  chrono: 'Chronomante',
  pistol: 'Pistoleiro',
  dracula: 'Vampiro',
  demon: 'Demônio',
  future: 'Viajante',
  human: 'Humano',
  king: 'Rei'
};

// Ícones de classe (imagens 16x16)
window.CLSICON = {
  mago: 'assets/images/icons/mago.png?v=3',
  arqueiro: 'assets/images/icons/arqueiro.png?v=3',
  guerreiro: 'assets/images/icons/guerreiro.png?v=3',
  tank: 'assets/images/icons/tank.png?v=3',
  necro: 'assets/images/icons/necro.png?v=3',
  chrono: 'assets/images/icons/chrono.png?v=3',
  pistol: 'assets/images/icons/pistol.png?v=3',
  dracula: 'assets/images/icons/dracula.png?v=3',
  demon: 'assets/images/icons/demon.png?v=3',
  future: 'assets/images/icons/future.png?v=3',
  human: 'assets/images/icons/human.png?v=3',
  king: 'assets/images/icons/king.png?v=3'
};

// Pré-carregar imagens
window.CLSIMG = {};
try {
  for (const k in window.CLSICON) {
    const im = new Image();
    im.src = window.CLSICON[k];
    window.CLSIMG[k] = im;
  }
} catch (e) {}

// Helper para gerar HTML do ícone da classe
window.clsImg = k => `<img class="cimg" src="${window.CLSICON[k]}" alt="" title="${window.CLASSES[k]?window.CLASSES[k].nome:k}">`;

// Desbloqueio por ouro (apenas Guerreiro por enquanto)
window.UNLOCK = { guerreiro: 150 };

// Missões para desbloquear classes
window.MISSION = {
  arqueiro: { goal: 1, label: 'corrida', desc: 'Jogue uma corrida até o fim (até morrer)', prog: () => Math.min(1, metaStat().runs) },
  tank: { goal: 2000, label: 'de dano', desc: 'Receba 2.000 de dano numa única corrida', prog: () => Math.min(2000, Math.max(metaStat().maxDmg, inRun()?runDmg:0)) },
  necro: { goal: 2500, label: 'esqueletos', desc: 'Abata 2.500 esqueletos no total', prog: () => Math.min(2500, metaStat().skelKills+(inRun()?runSkel:0)) },
  chrono: { goal: 1200, label: '', fmt: v=>fmtT(v), desc: 'Sobreviva 20 minutos numa única corrida', prog: () => Math.min(1200, Math.max(metaStat().bestTime, inRun()?runTime:0)) },
  pistol: { goal: 300, label: 'abates numa corrida', desc: 'Faça 300 abates numa única corrida', prog: () => Math.min(300, Math.max(metaStat().maxKills, inRun()?kills:0)) },
  dracula: { goal: 1500, label: 'morcegos', desc: 'Abata 1.500 morcegos no total', prog: () => Math.min(1500, metaStat().batKills+(inRun()?runBat:0)) },
  demon: { goal: 5, label: 'Golens', desc: 'Derrote o Golem 5 vezes no total', prog: () => Math.min(5, metaStat().bosses+(inRun()?bossKills:0)) },
  future: { goal: 20, label: 'de nível', desc: 'Alcance o nível 20 numa única corrida', prog: () => Math.min(20, Math.max(metaStat().bestLvl, inRun()?player.lvl:0)) },
  human: { goal: 3, label: 'corridas', desc: 'Jogue 3 corridas (o Zé insiste em aparecer)', prog: () => Math.min(3, metaStat().runs) },
  king: { goal: 1000, label: 'de ouro', desc: 'Acumule 1.000 de ouro', prog: () => Math.min(1000, coins()) }
};

// Verifica se uma classe está desbloqueada
window.isUnlocked = k => (!window.UNLOCK[k] && !window.MISSION[k]) || !!store.get('cv_unlocked',{})[k];

// Desbloqueia uma classe
window.doUnlock = k => { const u = store.get('cv_unlocked',{}); u[k]=1; store.set('cv_unlocked',u); };