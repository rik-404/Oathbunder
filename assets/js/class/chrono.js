/* ================= CLASSE: CHRONOMANTE ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.chrono = {
  nome: 'Vespera',
  role: 'Orbes do tempo que lentificam os inimigos',
  ui: '#5fe08a',
  hp: 95,
  armor: .05,
  speed: 5.4,
  atkCd: .6,
  dmg: 18,
  kind: 'proj',
  proj: 'time',
  projSpeed: 15,
  range: 15,
  pierce: 1,
  ab: {
    nome: 'Distorção Temporal',
    cd: 9,
    desc: 'Quase congela o tempo dos inimigos em volta por 3,5 s e causa dano.'
  },
  pal: {
    body: 0x0c231c,
    trim: 0xbdbd96,
    skin: 0x22302a,
    legs: 0x13092b,
    hat: 0x26423b,
    cape: 0x06150f,
    arm: 0x2f5149,
    boots: 0x0a0514
  },
  stats: { Vida: 3, Dano: 3, Veloc: 4, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.chrono.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: chrono — Chronomancer. Modelo voxel com a skin chronomancer.png (assets\images\characters) de referência:
// capuz verde-petróleo de borda dourada sobre rosto na sombra, manto verde-quase-preto,
// gola creme, mangas douradas e brilho esmeralda nos mecanismos do tempo.
window.CLASSES.chrono.model=function(b,P,vox,makeBow,boxGeo){
  const H2=0x26423b,H3=0x2f5149;                // verdes-petróleo do capuz (skin)
  const ROB=0x0c231c,ROB2=0x06150f;             // manto verde-quase-preto + capa profunda
  const GD=0xbdbd96,GDk=0x8a875f;               // dourado-creme da skin (molduras, gola)
  const EW=0x60e651;                             // brilho esmeralda (relógios, olhos, runas)
  // capuz cobrindo toda a cabeça, com ponta caída
  vox(b.head,0,.18,-.01,.44,.12,.46,H2);vox(b.head,0,.06,-.02,.42,.34,.42,H3);
  vox(b.head,0,.26,-.13,.14,.12,.18,H2);
  // abertura do rosto com moldura dourada e sombra vazia (como na skin) + olhos esmeralda fracos
  vox(b.head,0,.13,.19,.24,.05,.06,GD);
  vox(b.head,-.145,0,.19,.04,.3,.06,GDk);vox(b.head,.145,0,.19,.04,.3,.06,GDk);
  vox(b.head,0,-.04,.19,.24,.3,.05,0x0b0b10);
  vox(b.head,-.06,-.02,.215,.05,.045,.03,EW,1.1);vox(b.head,.06,-.02,.215,.05,.045,.03,EW,1.1);
  // manto esvoaçante + barra rasgada + capa nas costas
  vox(b.torso,0,-.14,0,.52,.34,.36,ROB);vox(b.torso,0,-.3,0,.56,.05,.42,ROB2);
  vox(b.torso,-.18,-.28,0,.1,.08,.4,ROB);vox(b.torso,.14,-.29,0,.1,.06,.4,ROB);
  vox(b.torso,0,.14,-.18,.48,.52,.04,ROB2);
  // gola alta creme (da skin)
  vox(b.torso,0,.3,0,.5,.07,.34,GD);
  // relógio de bolso: caixa dourada + ponteiro esmeralda brilhante
  vox(b.torso,0,-.02,.185,.15,.15,.02,GD,.4);
  vox(b.torso,0,-.02,.196,.035,.09,.02,EW,1);vox(b.torso,0,-.02,.196,.08,.03,.02,EW,1);
  // engrenagem temporal flutuante ao lado
  vox(b.torso,-.42,.2,.03,.04,.2,.04,GD);vox(b.torso,-.42,.2,.03,.2,.04,.04,GD);vox(b.torso,-.42,.2,.05,.1,.1,.03,EW,1.1);
  // mangas verde-petróleo com punhos dourados
  vox(b.armL,0,-.14,0,.155,.3,.175,H3);vox(b.armR,0,-.14,0,.155,.3,.175,H3);
  vox(b.armL,0,-.28,0,.16,.05,.18,GDk);vox(b.armR,0,-.28,0,.16,.05,.18,GDk);
  // cajado com relógio de bolso gigante: mostrador encostado na ponta + ponteiros esmeralda
  const st=new THREE.Group();b.handR.add(st);vox(st,0,.12,0,.055,1,.055,0x545137);
  vox(st,0,.68,0,.2,.2,.05,0x123524);                                            // mostrador verde-escuro (liga ao cajado)
  vox(st,0,.78,.02,.24,.05,.03,GD);vox(st,0,.58,.02,.24,.05,.03,GD);             // moldura cima/baixo
  vox(st,-.12,.68,.02,.05,.24,.03,GD);vox(st,.12,.68,.02,.05,.24,.03,GD);        // moldura laterais
  vox(st,0,.70,.035,.02,.12,.02,EW,1.2);vox(st,.05,.68,.035,.09,.02,.02,EW,1.2); // ponteiros brilhando
  b.keep.push({g:st,arm:b.armR,lean:-.18,leanX:.6});
};
