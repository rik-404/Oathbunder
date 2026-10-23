// Poderes passivos de arma — lista editável (descrita na tela de melhorias e no menu).
// Separada do game.js para mexer sem tocar no resto: edite aqui e suba o ?v= no HTML.
// Precisa ser carregada ANTES do game.js.
const WEAPONS={
  orbit:{nome:'Orbes Giratórios',desc:l=>`${Math.min(6,1+l)} orbes giram em volta de você, ${9+5*l} de dano por toque.`},
  bolt:{nome:'Raio Celeste',desc:l=>`Raio cai num inimigo a cada ${Math.max(.55,2.2-.32*l).toFixed(1).replace('.',',')} s, ${28+12*l} de dano${l>=3?', 2 alvos':''}.`},
  aura:{nome:'Aura de Brasa',desc:l=>`Queima tudo num raio de ${(1.7+.3*l).toFixed(1).replace('.',',')} m, ${5+4*l} de dano a cada 0,5 s.`},
};
