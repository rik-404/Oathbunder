// Herói: necro — Morveth. Modelo voxel com a skin necrmancer.png (assets\images\characters) de referência:
// capuz cinza-cinza sobre ROSTO-CRÂNIO (olheiras escuras com brilho verde), manto quase-preto
// com emblema de crânio no peito e gauntlets cinza-ósseo.
(window.CHARACTERS=window.CHARACTERS||{}).necro=function(b,P,vox,makeBow,boxGeo){
  const HD=0x403e39,HL=0x52514b;               // capuz cinza-cinza (skin)
  const RB=0x262220,RK=0x141210,RD2=0x0f0d0b;  // manto quase-preto + pontas
  const BN=0xcabfa1,BNl=0xd6d1c0,BNd=0x9c9272; // osso (crânios, cajado)
  const GM=0x8ff0b0;                             // verde espectral (magia do necro)
  // capuz cobrindo toda a cabeça, com ponta caída
  vox(b.head,0,.18,-.01,.44,.12,.46,HD);vox(b.head,0,.06,-.02,.42,.34,.42,HL);
  vox(b.head,0,.26,-.13,.14,.12,.18,HD);
  // rosto-crânio (o rosto da skin é o próprio crânio) + olheiras verdes brilhando
  vox(b.head,0,-.04,.19,.24,.3,.05,BNl);
  vox(b.head,0,-.14,.195,.2,.05,.02,BNd);                                             // sombra da boca/mandíbula
  vox(b.head,-.06,-.02,.215,.05,.045,.02,GM,1.2);vox(b.head,.06,-.02,.215,.05,.045,.02,GM,1.2); // olhos
  // manto esvoaçante + barra rasgada + draparia nas costas
  vox(b.torso,0,-.14,0,.52,.34,.36,RB);vox(b.torso,0,-.3,0,.56,.05,.42,RK);
  vox(b.torso,-.18,-.28,0,.1,.08,.4,RD2);vox(b.torso,.14,-.29,0,.1,.06,.4,RD2);
  vox(b.torso,0,.14,-.18,.48,.52,.04,RB);
  // gola cinza metálica (garras da skin)
  vox(b.torso,0,.3,0,.5,.07,.34,0x666561);
  // emblema de crânio no peito (da skin)
  vox(b.torso,0,.12,.175,.14,.18,.03,BNl);
  vox(b.torso,-.035,.14,.19,.035,.035,.02,0x0a0908);vox(b.torso,.035,.14,.19,.035,.035,.02,0x0a0908); // olheiras
  vox(b.torso,0,.05,.185,.08,.04,.02,BNd);                                                 // boca
  // crânios espectrais flutuantes (magia da classe)
  vox(b.torso,-.4,.2,.03,.08,.08,.08,GM,.9);vox(b.torso,.39,.08,-.03,.08,.08,.08,GM,.9);
  // cajado com crânio detalhado e chama verde
  const st=new THREE.Group();b.handR.add(st);vox(st,0,.12,0,.06,1,.06,RK);
  vox(st,0,.68,0,.22,.2,.2,BNl);vox(st,0,.58,.08,.12,.04,.04,BNd);            // crânio + mandíbula
  vox(st,-.055,.68,.105,.04,.05,.03,0x0a0908);vox(st,.055,.68,.105,.04,.05,.03,0x0a0908); // olheiras
  vox(st,-.14,.73,0,.05,.16,.05,BNl);vox(st,.14,.73,0,.05,.16,.05,BNl);       // chifres de osso
  vox(st,0,.86,0,.14,.14,.14,GM,1.4);                                          // chama verde
  b.keep.push({g:st,arm:b.armR,lean:-.18,leanX:.6});
};
