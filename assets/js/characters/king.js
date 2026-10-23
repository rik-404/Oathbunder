// Herói: king — Midas. Modelo voxel com a skin king.png (assets\images\characters) de referência:
// coroa dourada com joia verde, cabelo castanho, barba branca, manto real vermelho
// com manto de arminho branco nas costas e joia dourada no peito.
(window.CHARACTERS=window.CHARACTERS||{}).king=function(b,P,vox,makeBow,boxGeo){
  const RD=0x990000,RDl=0xa10000;                // vermelho do manto real (skin)
  const W=0xf2f2f2,GY=0xd9d9d9;                  // arminho branco + sombra
  const GD=0xe3ab28,GDk=0xbf9022;                // dourado (coroa, cinto, bordas)
  const HA=0x8c6639,HAd=0x66492c;                // cabelo castanho
  // coroa: faixa grossa + dentes altos com joias verdes (referência do usuário)
  vox(b.head,0,.21,0,.44,.12,.44,GD);
  vox(b.head,0,.33,.19,.07,.14,.07,GD);vox(b.head,0,.33,-.19,.07,.14,.07,GD);     // dentes frent/trás
  vox(b.head,-.19,.33,0,.07,.14,.07,GD);vox(b.head,.19,.33,0,.07,.14,.07,GD);    // dentes laterais
  vox(b.head,0,.35,0,.09,.18,.09,GDk);                                           // dente central maior
  vox(b.head,0,.465,0,.06,.05,.06,0x1ab829,.7);                                  // joia verde no topo
  // cabelo castanho sob a coroa + barba branca
  vox(b.head,0,.165,-.05,.38,.08,.22,HA);vox(b.head,0,.09,-.19,.36,.1,.08,HAd);    // topo + nuca
  vox(b.head,-.175,0,0,.05,.16,.3,HA);vox(b.head,.175,0,0,.05,.16,.3,HA);          // laterais
  vox(b.head,0,-.13,.15,.2,.1,.05,W);vox(b.head,0,-.2,.14,.12,.08,.04,GY);         // queixo + ponta
  // manto real: corpo vermelho + manto de arminho nas costas + abas caídas
  vox(b.torso,0,-.1,0,.5,.44,.34,RD);
  vox(b.torso,0,.14,-.18,.5,.56,.04,GY);                    // arminho branco atrás
  vox(b.torso,-.13,-.14,-.19,.08,.4,.03,RDl);vox(b.torso,.13,-.14,-.19,.08,.4,.03,RDl); // abas vermelhas sob o arminho
  // gola alta de arminho branco com manchas escuras
  vox(b.torso,0,.3,0,.56,.09,.38,W);
  vox(b.torso,-.12,.3,.19,.03,.03,.02,0x1a1a1a);vox(b.torso,0,.29,.19,.03,.03,.02,0x1a1a1a);vox(b.torso,.12,.3,.19,.03,.03,.02,0x1a1a1a);
  // joia de peito: moldura dourada + gema escura + brilho (motivo da skin)
  vox(b.torso,0,.2,.155,.1,.14,.02,GD,.3);
  vox(b.torso,0,.2,.165,.055,.08,.02,0x1c1836);
  vox(b.torso,0,.2,.175,.025,.04,.02,0xffdca1,.8);
  // mangas vermelhas com punhos dourados
  vox(b.armL,0,-.14,0,.145,.32,.165,RD);vox(b.armR,0,-.14,0,.145,.32,.165,RD);
  vox(b.armL,0,-.29,0,.15,.05,.17,GDk);vox(b.armR,0,-.29,0,.15,.05,.17,GDk);
  // cinto dourado + fivela
  vox(b.torso,0,-.02,0,.52,.06,.36,GD);vox(b.torso,0,-.02,.19,.08,.07,.02,GDk,.4);
  // bolsa de moedas no cinto + moeda na mão
  vox(b.torso,.2,-.1,.14,.1,.12,.1,0x6a4a2a);vox(b.torso,.2,-.03,.16,.06,.04,.04,GD,.5);
  vox(b.handR,0,-.05,.08,.15,.15,.04,GD,.3);
};
