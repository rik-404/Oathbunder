/* ================= CLASSE: DEMÔNIO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.demon = {
  nome: 'Castiel',
  role: 'Lança fogo infernal e explode em chamas',
  ui: '#ff5a2a',
  hp: 110,
  armor: .08,
  speed: 5.2,
  atkCd: .55,
  dmg: 22,
  kind: 'proj',
  proj: 'hellfire',
  projSpeed: 15,
  range: 14,
  pierce: 1,
  ab: {
    nome: 'Inferno',
    cd: 8,
    desc: 'Erupção de chamas ao redor que causa dano alto e arremessa os inimigos.'
  },
  pal: {
    body: 0x121212,
    trim: 0x8d0000,
    skin: 0x1a1a1a,
    legs: 0x151515,
    hat: 0x0c0c0c,
    cape: 0x151515,
    arm: 0x1a1a1a,
    boots: 0x1b1b1b
  },
  stats: { Vida: 4, Dano: 5, Veloc: 3, Alcance: 3 }
};

/* ================= MODELO VOXEL (CLASSES.demon.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: demon (Castiel) — modelo voxel adaptado da skin mine (assets/images/characters/demon.png).
// Paleta da skin: armadura preta, gemas de brasa vermelha (peito/pernas), olhos ardentes,
// ombreiras e caneleiras ossos (tan), capa escura com forro vermelho, botas com solola incandescente.
window.CLASSES.demon.model=function(b,P,vox,makeBow,boxGeo){
    // — cores da skin —
    const K2=0x121212,K5=0x0f0f0f,K7=0x171717,K9=0x090909;            // armadura preta
    const R1=0x8d0000,R2=0xb20000,R3=0xc80000,R4=0xda0000,R5=0xe60a00;// brasa escura→viva
    const RO=0xec1a00,RF=0xf22500,Rf=0xf62b06;                        // núcleo incandescente
    const T1=0xb5a690,T2=0xc6bdac,TB2=0x5f533f;                       // osso/couro (ombros, garras)
    const TEETH=0xfafafa;                                             // dentes
    // — cabeça: chifres com pontas ósseas, sobrancelhas cerradas, olhos ardentes, boca de dentes —
    vox(b.head,0,.17,0,.36,.06,.36,K2);
    vox(b.head,-.13,.17,-.02,.07,.16,.07,K5);vox(b.head,.13,.17,-.02,.07,.16,.07,K5);      // base dos chifres
    vox(b.head,-.16,.27,-.05,.05,.12,.05,T2);vox(b.head,.16,.27,-.05,.05,.12,.05,T2);      // pontas dos chifres
    vox(b.head,-.08,.085,.172,.08,.025,.012,K7);vox(b.head,.08,.085,.172,.08,.025,.012,K7);// sobrocelhas
    vox(b.head,-.08,.02,.173,.06,.05,.012,RO,1.6);vox(b.head,.08,.02,.173,.06,.05,.012,RO,1.6); // olhos
    vox(b.head,0,-.1,.17,.18,.035,.012,R1);                              // boca
    vox(b.head,0,-.085,.176,.14,.016,.012,TEETH,.25);                    // dentes
    // — tronco: placa escura + gema de brasa no peito, gola com prego, cinto (trim) fivela incandescente —
    vox(b.torso,0,0,.155,.26,.3,.04,K9);
    vox(b.torso,0,.12,.18,.10,.08,.02,R3,.6);                            // gema: topo
    vox(b.torso,0,.02,.18,.18,.12,.02,R4,1.0);                           // gema: meio
    vox(b.torso,0,-.09,.185,.09,.09,.02,Rf,1.6);                         // gema: núcleo
    vox(b.torso,-.14,-.02,.175,.05,.05,.02,R3,.5);vox(b.torso,.14,-.02,.175,.05,.05,.02,R3,.5); // brasas laterais
    vox(b.torso,0,.40,0,.46,.07,.30,K9);                                 // gola
    vox(b.torso,0,.40,.16,.06,.06,.02,R4,.9);                            // prego da gola
    vox(b.torso,0,.03,.16,.07,.07,.02,R5,1.1);                           // fivela do cinto
    // — capa escura com forro vermelho na barra —
    vox(b.torso,0,.14,-.185,.46,.52,.05,P.cape);
    vox(b.torso,0,-.09,-.19,.48,.07,.055,R2,.4);
    // — ombreiras de osso —
    vox(b.torso,-.245,.34,0,.13,.12,.19,T1);vox(b.torso,.245,.34,0,.13,.12,.19,T1);
    // — braços: guarda-antebraco de osso, faixa de couro, pulso em brasa —
    vox(b.armL,0,-.19,0,.15,.12,.16,T1);vox(b.armR,0,-.19,0,.15,.12,.16,T1);
    vox(b.armL,0,-.11,0,.155,.04,.165,TB2);vox(b.armR,0,-.11,0,.155,.04,.165,TB2);
    vox(b.armL,0,-.30,0,.135,.04,.145,R4,1.0);vox(b.armR,0,-.30,0,.135,.04,.145,R4,1.0);
    // — garras escuras —
    vox(b.handR,0,-.06,.08,.1,.05,.1,K2);vox(b.handL,0,-.06,.08,.1,.05,.1,K2);
    // — pernas: grevas brilhantes, joelho em brasa, bota com ponta incandescente —
    vox(b.legL,0,-.14,0,.175,.10,.20,R4,.85);vox(b.legR,0,-.14,0,.175,.10,.20,R4,.85);
    vox(b.legL,0,-.06,0,.17,.05,.19,R5,1.1);vox(b.legR,0,-.06,0,.17,.05,.19,R5,1.1);
    vox(b.legL,0,-.30,.09,.16,.06,.07,RF,1.2);vox(b.legR,0,-.30,.09,.16,.06,.07,RF,1.2);
    // — asas pequenas de morcego —
    vox(b.torso,-.3,.3,-.2,.18,.26,.04,K5);vox(b.torso,.3,.3,-.2,.18,.26,.04,K5);
};
