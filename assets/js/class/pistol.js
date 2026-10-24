/* ================= CLASSE: PISTOLEIRO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.pistol = {
  nome: 'Cassian',
  role: 'Tiros rápidos e certeiros no mais perto',
  ui: '#e0a94f',
  hp: 88,
  armor: 0,
  speed: 5.7,
  weaponId: 'pistol_revolver',
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
// Herói: pistol (Cassian) — pistoleiro do deserto: chapéu de aba larga, bandana no
// rosto, poncho listrado (serape), cinto de balas e dois revólveres de latão.
window.CLASSES.pistol.model=function(b,P,vox,makeBow,boxGeo){

    const LEATHER=P.body,HAT=P.hat,HAT_D=0x332216;
    const RUST=P.cape,RUST_D=0x6b2a1e;                          // poncho / bandana
    const CREAM=0xe8dcc0,GOLD=P.trim,GOLD_D=0xb8862c;            // listras / latão
    const STEEL=0x8a8f96,STEEL_D=0x4a4e55,WOOD=0x6a3a22;        // armas
    const DARK=0x2a1c14;

    // ---------- chapéu de aba larga: borda, copa amassada e faixa com fivela ----------
    vox(b.head,0,.185,-.02,.6,.035,.62,HAT);                    // aba
    vox(b.head,0,.172,-.02,.63,.018,.65,HAT_D);                 // borda inferior
    vox(b.head,-.3,.203,-.02,.05,.03,.5,HAT);vox(b.head,.3,.203,-.02,.05,.03,.5,HAT); // abas levantadas
    vox(b.head,0,.25,-.02,.32,.12,.34,HAT);                     // copa
    vox(b.head,0,.312,-.02,.28,.025,.3,HAT);                    // topo
    vox(b.head,0,.325,.0,.2,.018,.13,HAT_D);                    // vinco do topo
    vox(b.head,0,.213,-.02,.335,.038,.355,RUST_D);              // faixa do chapéu
    vox(b.head,0,.213,.163,.07,.05,.02,GOLD);                   // fivela
    vox(b.head,0,.213,.174,.035,.028,.012,DARK);

    // ---------- rosto: olhos na sombra e bandana no nariz/boca ----------
    vox(b.head,0,.1,.171,.34,.07,.012,0x3a2418);                // sombra da aba
    vox(b.head,-.08,.03,.173,.06,.035,.012,0x15101c);vox(b.head,.08,.03,.173,.06,.035,.012,0x15101c);
    vox(b.head,-.085,.062,.172,.07,.018,.012,0x2a1a12);vox(b.head,.085,.062,.172,.07,.018,.012,0x2a1a12); // sobrancelhas
    vox(b.head,0,-.055,.16,.33,.09,.05,RUST);                   // bandana
    vox(b.head,0,-.13,.15,.27,.07,.06,RUST_D);                  // parte de baixo
    vox(b.head,-.1,-.05,.163,.02,.08,.02,RUST_D);vox(b.head,.08,-.06,.163,.02,.07,.02,RUST_D); // dobras
    vox(b.head,0,-.06,-.178,.06,.04,.022,RUST);vox(b.head,0,-.095,-.182,.035,.045,.018,RUST_D); // nó atrás

    // ---------- poncho listrado (serape) em camadas ----------
    vox(b.torso,0,.32,.0,.5,.1,.36,RUST);                       // ombros
    vox(b.torso,0,.245,0,.54,.075,.38,CREAM);                   // listra clara
    vox(b.torso,0,.17,0,.57,.075,.4,RUST);                      // listra vermelha
    vox(b.torso,0,.1,0,.6,.065,.42,GOLD_D);                     // listra dourada
    vox(b.torso,0,.06,0,.61,.04,.43,RUST_D);                    // barra
    vox(b.torso,0,.36,.155,.14,.12,.03,DARK);                   // camisa no decote
    vox(b.torso,0,.31,.168,.2,.03,.02,RUST);                    // gola do poncho

    // ---------- cinto de couro com balas e fivela (abaixo do poncho) ----------
    vox(b.torso,0,-.02,0,.5,.075,.34,LEATHER);
    vox(b.torso,0,-.02,.172,.1,.06,.02,GOLD);
    vox(b.torso,0,-.02,.183,.045,.03,.012,DARK);
    for(const x of [-.19,-.13,-.07,.07,.13,.19])vox(b.torso,x,-.015,.171,.028,.05,.018,GOLD_D); // balas
    for(const x of [-.16,-.08,.0,.08,.16])vox(b.torso,x,-.015,-.171,.028,.05,.018,GOLD_D);     // balas nas costas
    vox(b.torso,0,-.02,-.172,.08,.05,.02,LEATHER);              // passador do cinto atrás
    vox(b.torso,.235,-.06,.06,.055,.17,.1,LEATHER);             // coldre direito
    vox(b.torso,.235,-.15,.06,.06,.03,.11,STEEL_D);
    vox(b.torso,-.21,-.07,.13,.07,.06,.05,0xc9a06a);            // corda enrolada no quadril

    // ---------- revólveres de latão (cano pra baixo, alinhado ao braço) ----------
    const makeGun=(h)=>{
      const g=new THREE.Group();h.add(g);
      vox(g,0,.02,-.02,.07,.13,.08,WOOD);                       // cabo de madeira
      vox(g,0,.075,-.05,.035,.03,.04,GOLD_D);                   // martelo
      vox(g,0,-.04,.045,.095,.1,.09,GOLD);                      // armação de latão
      vox(g,0,-.1,.055,.1,.09,.1,STEEL);                        // tambor
      vox(g,0,-.12,.0,.04,.05,.05,STEEL_D);                     // guarda-mato
      vox(g,0,-.25,.055,.06,.2,.06,STEEL_D);                    // cano
      vox(g,0,-.36,.055,.07,.04,.07,0x23262b);                  // boca
      vox(g,0,-.25,.09,.03,.02,.03,GOLD_D);                     // mira
    };
    makeGun(b.handR);makeGun(b.handL);

    // ---------- botas com esporas ----------
    vox(b.legL,0,-.3,.02,.185,.095,.235,0x2a1c12);vox(b.legR,0,-.3,.02,.185,.095,.235,0x2a1c12);
    vox(b.legL,0,-.31,-.1,.07,.02,.07,STEEL);vox(b.legR,0,-.31,-.1,.07,.02,.07,STEEL);
    vox(b.legL,0,-.05,0,.17,.05,.19,LEATHER);vox(b.legR,0,-.05,0,.17,.05,.19,LEATHER); // cano da bota
};
