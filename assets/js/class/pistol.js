/* ================= CLASSE: PISTOLEIRO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.pistol = {
  nome: 'Cassian',
  role: 'Tiros rápidos e certeiros no mais perto',
  ui: '#e0a94f',
  hp: 88,
  armor: 0,
  speed: 5.7,
  atkCd: .4,
  dmg: 9,
  kind: 'proj',
  proj: 'bullet',
  projSpeed: 30,
  range: 15,
  pierce: 0,
  critBase: .15,
  ab: {
    nome: 'Saque Rápido',
    cd: 6,
    desc: 'Num piscar, atira em até 6 inimigos próximos com crítico garantido.'
  },
  pal: {
    body: 0x6e4a2e,
    trim: 0xe0a94f,
    skin: 0xe8b48a,
    legs: 0x3a2a1c,
    hat: 0x4a3222,
    cape: 0x8a3a2a,
    arm: 0x6e4a2e
  },
  stats: { Vida: 2, Dano: 3, Veloc: 5, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.pistol.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: pistol — modelo voxel.
window.CLASSES.pistol.model=function(b,P,vox,makeBow,boxGeo){

    // chapéu de aba larga com copa e faixa
    vox(b.head,0,.17,-.01,.62,.04,.64,P.hat);vox(b.head,0,.2,0,.58,.03,.6,P.hat);
    vox(b.head,0,.27,0,.34,.15,.34,P.hat);vox(b.head,0,.21,0,.36,.04,.36,P.trim,.1); // copa + faixa
    // olhos na sombra da aba
    vox(b.head,-.08,.03,.172,.06,.04,.012,0x15101c);vox(b.head,.08,.03,.172,.06,.04,.012,0x15101c);
    // bandana vermelha cobrindo a parte de baixo do rosto
    vox(b.head,0,-.09,.15,.32,.14,.07,P.cape);vox(b.head,0,-.17,.13,.2,.08,.1,P.cape);
    // poncho/colete + gola + cinturão com fivela
    vox(b.torso,0,.08,0,.48,.46,.34,P.body);vox(b.torso,0,.31,0,.52,.07,.37,P.cape); // gola do poncho
    vox(b.torso,0,.1,.165,.1,.3,.02,P.cape,.05);                                       // faixa do poncho
    vox(b.torso,0,.03,0,.5,.07,.36,0x3a2a1a);vox(b.torso,0,.03,.19,.08,.08,.03,P.trim); // cinturão + fivela no quadril
    // balas no cinturão
    vox(b.torso,-.15,+.03,.18,.03,.06,.02,P.trim);vox(b.torso,-.05,+.03,.185,.03,.06,.02,P.trim);
    vox(b.torso,.05,+.03,.185,.03,.06,.02,P.trim);vox(b.torso,.15,+.03,.18,.03,.06,.02,P.trim);
    // coldre na lateral
    vox(b.torso,-.26,-.02,.05,.1,.2,.12,0x3a2a1a); // coldre pendurado no cinturão
    // revólver na mão direita — cano alinhado ao braço (−y): aponta pra baixo com o braço baixado,
    // e pra frente quando ele estica o braço pra mirar.
    const gun=new THREE.Group();b.handR.add(gun);
    vox(gun,0,.02,-.03,.07,.16,.09,0x5a3a22);  // cabo de madeira (na mão)
    vox(gun,0,-.03,.05,.1,.12,.11,0x6d7682);    // tambor
    vox(gun,0,-.18,.05,.07,.28,.08,0x3a3a42);   // corpo/cano descendo
    vox(gun,0,-.35,.05,.05,.06,.07,0x2a2a30);   // boca do cano
    vox(gun,0,-.08,.05,.05,.1,.03,0x2a2a30);    // guarda-mato
    // segundo revólver na mão esquerda (dual-wield)
    const gun2=new THREE.Group();b.handL.add(gun2);
    vox(gun2,0,.02,-.03,.07,.16,.09,0x5a3a22);vox(gun2,0,-.03,.05,.1,.12,.11,0x6d7682);
    vox(gun2,0,-.18,.05,.07,.28,.08,0x3a3a42);vox(gun2,0,-.35,.05,.05,.06,.07,0x2a2a30);vox(gun2,0,-.08,.05,.05,.1,.03,0x2a2a30);
};
