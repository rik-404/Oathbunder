// Melhorias de nível — lista editável (escolhidas ao subir de nível no jogo).
// Separada do game.js para mexer sem tocar no resto: edite aqui e suba o ?v= no HTML.
// Precisa ser carregada ANTES do game.js (usado em: sorteio da tela de melhoria).
const STAT_UPS=[
  {id:'dmg',nome:'Força',desc:'+15% de dano em tudo.',apply:p=>p.stats.dmg*=1.15},
  {id:'as',nome:'Mãos Rápidas',desc:'+12% de velocidade de ataque.',apply:p=>p.stats.atkSpd*=1.12},
  {id:'ms',nome:'Botas Leves',desc:'+8% de velocidade de movimento.',apply:p=>p.stats.move*=1.08},
  {id:'hp',nome:'Coração de Pedra',desc:'+25 de vida máxima e cura 25.',apply:p=>{p.maxHp+=25;p.hp+=25}},
  {id:'crit',nome:'Olho Certeiro',desc:'+8% de chance de crítico (dano dobrado).',apply:p=>p.stats.crit+=.08},
  {id:'ls',nome:'Sede de Sangue',desc:'Cura 3% de todo dano causado.',apply:p=>p.stats.ls+=.03},
  {id:'armor',nome:'Placas de Ferro',desc:'Recebe 8% menos dano.',apply:p=>p.stats.armor=Math.min(.7,p.stats.armor+.08)},
  {id:'regen',nome:'Regeneração',desc:'Recupera +0,8 de vida por segundo.',apply:p=>p.stats.regen+=.8},
  {id:'magnet',nome:'Ímã',desc:'+40% de distância para puxar orbes de experiência.',apply:p=>p.stats.magnet*=1.4},
  {id:'xp',nome:'Sabedoria',desc:'+15% de experiência ganha.',apply:p=>p.stats.xpMul*=1.15},
  {id:'area',nome:'Alcance Maior',desc:'+18% de área em golpes, explosões e auras.',apply:p=>p.stats.area*=1.18},
  {id:'cdr',nome:'Foco',desc:'Habilidade recarrega 15% mais rápido.',apply:p=>p.stats.cdr*=.85},
  {id:'cdmg',nome:'Punho Fatal',desc:'Críticos causam +50% mais dano.',apply:p=>p.stats.critDmg*=1.5},
  {id:'pspd',nome:'Velocidade de Tiro',desc:'+15% de velocidade nos projéteis.',apply:p=>p.stats.pspd*=1.15},
  {id:'kb',nome:'Empurrão',desc:'+30% de recuo em golpes e tiros.',apply:p=>p.stats.kb*=1.3},
  {id:'dc',nome:'Reflexo Relâmpago',desc:'A esquiva recarrega 15% mais rápido.',apply:p=>p.stats.dashCd*=.85},
  {id:'chill',nome:'Pulso Congelante',desc:l=>`Seus golpes deixam os inimigos ${l*20}% lentos por ${(0.5+0.2*l).toFixed(1).replace('.',',')} s.`,ok:p=>p.stats.chill<3,apply:p=>p.stats.chill++},
  {id:'heal',nome:'Poção Grande',desc:'Recupera toda a vida agora.',ok:p=>p.hp<p.maxHp*.7,apply:p=>p.hp=p.maxHp},
  {id:'multi',cls:['mago','arqueiro','necro'],nome:'Projétil Extra',desc:'+1 projétil em cada ataque.',ok:p=>p.stats.multi<4,apply:p=>p.stats.multi++},
  {id:'pierce',cls:['mago','arqueiro','necro'],nome:'Perfuração',desc:'Projéteis atravessam +1 inimigo.',ok:p=>p.stats.pierce<4,apply:p=>p.stats.pierce++},
  {id:'thorns',cls:['guerreiro','tank'],nome:'Espinhos',desc:'Devolve 50% do dano de contato recebido.',apply:p=>p.stats.thorns+=.5},
  {id:'minc',cls:['necro'],nome:'Horda Óssea',desc:'+1 esqueleto na sua horda.',ok:p=>p.minCap<7,apply:p=>p.minCap++},
  {id:'mind',cls:['necro'],nome:'Ossos Afiados',desc:'+20% de dano dos esqueletos.',apply:p=>p.minDmg*=1.2},
];
