// Melhorias de nível — lista editável (escolhidas ao subir de nível no jogo).
// Separada do game.js para mexer sem tocar no resto: edite aqui e suba o ?v= no HTML.
// Precisa ser carregada ANTES do game.js (usado em: sorteio da tela de melhoria).
// TETOS: cada melhoria tem limite de stacks (pode) — o herói não escala pra infinito em corrida longa;
// a dificuldade continua sobindo por horda (ver scaleT no game.js).
const pode=(p,nome,cap)=>(p.picks||[]).filter(x=>x===nome).length<cap;
const STAT_UPS=[
  {id:'dmg',nome:'Força',desc:'+15% de dano em tudo.',ok:p=>pode(p,'Força',10),apply:p=>p.stats.dmg*=1.15},
  {id:'as',nome:'Mãos Rápidas',desc:'+12% de velocidade de ataque.',ok:p=>pode(p,'Mãos Rápidas',10),apply:p=>p.stats.atkSpd*=1.12},
  {id:'ms',nome:'Botas Leves',desc:'+8% de velocidade de movimento.',ok:p=>pode(p,'Botas Leves',6),apply:p=>p.stats.move*=1.08},
  {id:'hp',nome:'Coração de Pedra',desc:'+25 de vida máxima e cura 25.',ok:p=>pode(p,'Coração de Pedra',10),apply:p=>{p.maxHp+=25;p.hp+=25}},
  {id:'crit',nome:'Olho Certeiro',desc:'+8% de chance de crítico (dano dobrado).',ok:p=>pode(p,'Olho Certeiro',7),apply:p=>p.stats.crit+=.08},
  {id:'ls',nome:'Sede de Sangue',desc:'Cura 3% de todo dano causado.',ok:p=>pode(p,'Sede de Sangue',5),apply:p=>p.stats.ls+=.03},
  {id:'armor',nome:'Placas de Ferro',desc:'Recebe 8% menos dano (teto de 70%).',ok:p=>p.stats.armor<.69,apply:p=>p.stats.armor=Math.min(.7,p.stats.armor+.08)},
  {id:'regen',nome:'Regeneração',desc:'Recupera +0,8 de vida por segundo.',ok:p=>pode(p,'Regeneração',5),apply:p=>p.stats.regen+=.8},
  {id:'magnet',nome:'Ímã',desc:'+40% de distância para puxar orbes de experiência.',ok:p=>pode(p,'Ímã',5),apply:p=>p.stats.magnet*=1.4},
  {id:'xp',nome:'Sabedoria',desc:'+15% de experiência ganha.',ok:p=>pode(p,'Sabedoria',8),apply:p=>p.stats.xpMul*=1.15},
  {id:'area',nome:'Alcance Maior',desc:'+18% de área em golpes, explosões e auras.',ok:p=>pode(p,'Alcance Maior',8),apply:p=>p.stats.area*=1.18},
  {id:'cdr',nome:'Foco',desc:'Habilidade recarrega 15% mais rápido.',ok:p=>pode(p,'Foco',6),apply:p=>p.stats.cdr*=.85},
  {id:'cdmg',nome:'Punho Fatal',desc:'Críticos causam +50% mais dano.',ok:p=>pode(p,'Punho Fatal',4),apply:p=>p.stats.critDmg=Math.min(4,p.stats.critDmg+.5)},
  {id:'pspd',nome:'Velocidade de Tiro',desc:'+15% de velocidade nos projéteis.',ok:p=>pode(p,'Velocidade de Tiro',5),apply:p=>p.stats.pspd*=1.15},
  {id:'kb',nome:'Empurrão',desc:'+30% de recuo em golpes e tiros.',ok:p=>pode(p,'Empurrão',6),apply:p=>p.stats.kb*=1.3},
  {id:'dc',nome:'Reflexo Relâmpago',desc:'A esquiva recarrega 15% mais rápido.',ok:p=>pode(p,'Reflexo Relâmpago',6),apply:p=>p.stats.dashCd*=.85},
  {id:'chill',nome:'Pulso Congelante',desc:l=>`Seus golpes deixam os inimigos ${l*20}% lentos por ${(0.5+0.2*l).toFixed(1).replace('.',',')} s.`,ok:p=>p.stats.chill<3,apply:p=>p.stats.chill++},
  {id:'heal',nome:'Poção Grande',desc:'Recupera toda a vida agora.',ok:p=>p.hp<p.maxHp*.7,apply:p=>p.hp=p.maxHp},
  {id:'multi',cls:['mago','arqueiro','necro'],nome:'Projétil Extra',desc:'+1 projétil em cada ataque.',ok:p=>p.stats.multi<4,apply:p=>p.stats.multi++},
  {id:'pierce',cls:['mago','arqueiro','necro'],nome:'Perfuração',desc:'Projéteis atravessam +1 inimigo.',ok:p=>p.stats.pierce<4,apply:p=>p.stats.pierce++},
  {id:'thorns',cls:['guerreiro','tank'],nome:'Espinhos',desc:'Devolve 50% do dano de contato recebido.',ok:p=>pode(p,'Espinhos',4),apply:p=>p.stats.thorns+=.5},
  {id:'minc',cls:['necro'],nome:'Horda Óssea',desc:'+1 esqueleto na sua horda.',ok:p=>p.minCap<7,apply:p=>p.minCap++},
  {id:'mind',cls:['necro'],nome:'Ossos Afiados',desc:'+20% de dano dos esqueletos.',ok:p=>pode(p,'Ossos Afiados',6),apply:p=>p.minDmg*=1.2},
];
