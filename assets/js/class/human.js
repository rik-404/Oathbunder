/* ================= CLASSE: HUMANO (ZÉ) ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.human = {
  nome: 'Zé',
  role: 'Joga pedra. É isso mesmo.',
  ui: '#b0a089',
  hp: 50,
  armor: 0,
  speed: 2.6,
  weaponId: 'human_stone',
  passiveId: 'beer_bottle',
  pal: {
    body: 0x12b5b5,
    trim: 0x3838c8,
    skin: 0xc08a5f,
    legs: 0x3838c8,
    hat: 0x4a2f1e,
    arm: 0xc08a5f,
    boots: 0x555a60
  },
  stats: { Vida: 1, Dano: 1, Veloc: 1, Alcance: 1 }
};

/* ================= MODELO VOXEL (CLASSES.human.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: human (Zé) — modelo voxel.
// v2 do designer: calvo, barbudo, barrigudo e com garrafinha (ver abaixo).
window.CLASSES.human.model=function(b,P,vox,makeBow,boxGeo){

    // Zé, o humano — novo designer: calvo (só sobras nas laterais e atrás), barbudo,
    // barrigudo com a barriga escapando da regata e uma garrafinha na mão esquerda.
    const HR=P.hat,BE=0x3d2c1e,BE2=0x5a4534,GRY=0x8d7d6a;       // cabelo, barba, barba clara, fios brancos
    const SK=P.skin,SKD=0xa8714b,SKL=0xd9a072,NV=0x7a4a28;      // pele, sombra, brilho, umbigo
    const SH=P.body,SHD=0x0d8a8a;                               // regata + sombra da regata
    const GL=0x2f6b3f,GLD=0x1e4a2c,GLL=0x4e9a63;                // vidro verde da garrafinha
    const LBL=0xe6d7b4,LBLR=0xb8442f,CAP=0xc8a13c;              // rótulo, faixa, tampa

    // ---------- cabeça careca: nada em cima, sobras baixas nas laterais e atrás ----------
    vox(b.head,0,-.055,-.172,.32,.17,.03,HR);                                         // cabelo traseiro (baixo)
    vox(b.head,-.17,-.03,-.01,.03,.12,.26,HR);vox(b.head,.17,-.03,-.01,.03,.12,.26,HR); // sobras laterais
    vox(b.head,0,.168,.01,.28,.02,.24,SKL);                                           // brilho da careca
    vox(b.head,0,-.03,.19,.07,.1,.06,SK);vox(b.head,0,-.055,.215,.06,.05,.02,SKL);    // nariz
    vox(b.head,-.085,.1,.172,.11,.035,.02,BE);vox(b.head,.085,.1,.172,.11,.035,.02,BE); // sobrancelhas grossas

    // ---------- barba grande: maçãs, queixo, bigode caído e ponta no peito ----------
    vox(b.head,0,-.15,.1,.34,.14,.16,BE);                                             // base do queixo
    vox(b.head,-.16,-.12,.09,.09,.16,.15,BE);vox(b.head,.16,-.12,.09,.09,.16,.15,BE); // bochechas
    vox(b.head,-.16,.02,.05,.04,.16,.18,HR);vox(b.head,.16,.02,.05,.04,.16,.18,HR);   // costeletas
    vox(b.head,0,-.24,.09,.3,.1,.16,BE2);                                             // barba cheia
    vox(b.head,0,-.305,.1,.2,.07,.12,BE2);vox(b.head,0,-.35,.1,.11,.04,.08,BE);       // ponta
    vox(b.head,0,-.095,.17,.24,.05,.07,BE2);                                          // bigode
    vox(b.head,-.115,-.125,.16,.05,.06,.06,BE2);vox(b.head,.115,-.125,.16,.05,.06,.06,BE2); // pontas do bigode
    vox(b.head,-.135,-.2,.155,.025,.08,.02,GRY);vox(b.head,.135,-.235,.14,.025,.07,.02,GRY); // fios brancos

    // ---------- corpo: regata esticada sobre o barrigão + barriga de fora ----------
    vox(b.torso,0,.45,0,.14,.1,.14,SK);                                               // pescoço (atrás da barba)
    vox(b.torso,0,.43,0,.3,.035,.21,SHD);                                             // gola da regata
    vox(b.torso,0,.24,.17,.46,.3,.18,SH);                                             // barrigão dentro da regata
    vox(b.torso,0,.335,.13,.44,.1,.15,SH);                                            // transição peito/barriga
    vox(b.torso,0,.085,.175,.46,.04,.19,SHD);                                         // barra da regata (dobra)
    vox(b.torso,0,0,.16,.40,.18,.18,SK);                                              // barriga de fora
    vox(b.torso,0,0,.196,.24,.19,.14,SK);                                             // centro da barriga (volume)
    vox(b.torso,0,-.105,.15,.32,.06,.16,SKD);                                         // fundo caído da barriga
    vox(b.torso,0,-.02,.2665,.045,.06,.012,NV);                                       // umbigo
    // cós do jeans colado na barra da camisa (sem placa flutuando)
    vox(b.torso,0,-.06,0,.40,.12,.29,P.legs);

    // ---------- garrafinha pendurada na mão esquerda (gargalo encaixado no punho) ----------
    vox(b.handL,0,-.039,.05,.055,.028,.055,CAP);                                      // tampa
    vox(b.handL,0,-.073,.05,.042,.04,.042,GLD);                                       // gargalo
    vox(b.handL,0,-.099,.05,.078,.016,.078,GL);                                       // ombro do vidro
    vox(b.handL,0,-.173,.055,.1,.13,.1,GL);                                           // corpo
    vox(b.handL,-.046,-.173,.1,.02,.11,.015,GLL);                                     // brilho do vidro
    vox(b.handL,0,-.173,.107,.088,.06,.012,LBL);                                      // rótulo
    vox(b.handL,0,-.193,.108,.088,.02,.012,LBLR);                                     // faixa do rótulo
    vox(b.handL,0,-.245,.055,.105,.016,.105,GLD);                                     // fundo da garrafa
    b.handL.rotation.z=-.12;                                                          // garrafa pendurada de lado

    // pedra na mão direita (o arsenal) — menor, encaixada na palma
    vox(b.handR,0,-.04,.05,.16,.14,.14,0x8a8a86);vox(b.handR,.04,-.01,.09,.07,.06,.07,0x9a9a94);vox(b.handR,-.04,-.06,.095,.06,.05,.06,0x74746f);
};
