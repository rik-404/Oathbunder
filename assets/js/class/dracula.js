/* ================= CLASSE: DRÁCULA ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.dracula = {
  nome: 'Vlad',
  role: 'Lança morcegos e drena a vida dos inimigos',
  ui: '#c23a55',
  hp: 100,
  armor: .05,
  speed: 5.3,
  atkCd: .5,
  dmg: 16,
  kind: 'proj',
  proj: 'batp',
  projSpeed: 16,
  range: 14,
  pierce: 1,
  lsBase: .12,
  ab: {
    nome: 'Enxame de Morcegos',
    cd: 8,
    desc: 'Solta um enxame que fere tudo em volta e cura você com o dano causado.'
  },
  pal: {
    body: 0x141414,
    trim: 0x0a0a0a,
    skin: 0xe7ae82,
    legs: 0x202020,
    hat: 0x141414,
    cape: 0x1c0507,
    arm: 0x141414,
    boots: 0x0a0a0a
  },
  stats: { Vida: 3, Dano: 4, Veloc: 3, Alcance: 3 }
};

/* ================= MODELO VOXEL (CLASSES.dracula.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: dracula (Vlad) — conde vampiro: cabelo com pico da viúva, olhos vermelhos,
// gola alta erguida (forro vinho), sobrecasaca preta, gravata de sangue e capa longa
// com forro vermelho que balança ao andar.
window.CLASSES.dracula.model=function(b,P,vox,makeBow,boxGeo){

    const HAIR=0x0f0f12,CLOAK=0x191420,VELVET=0x241016;         // cabelo / capa / veludo do fraque
    const CRIM=0xb2000a,CRIM_D=0x6b0008,SHIRT=0xe8dcc2;         // sangue / vinho / camisa
    const SILVER=0xcfd2d6,SILVER_D=0x8a8f96,GEM=0xdc0011;       // prata / gema
    const SKIN=P.skin,EYE=0xff2f2f,EYE_C=0xffc2a8,MOUTH=0x36090b;

    // ---------- cabelo preto com pico da viúva e nuca comprida ----------
    vox(b.head,0,.163,-.03,.36,.055,.36,HAIR);                  // topo
    vox(b.head,0,.12,-.1,.35,.13,.19,HAIR);                     // coroa
    vox(b.head,0,-.005,-.17,.34,.33,.05,HAIR);                  // nuca
    vox(b.head,-.168,-.005,-.03,.026,.24,.2,HAIR);vox(b.head,.168,-.005,-.03,.026,.24,.2,HAIR);
    vox(b.head,0,.13,.158,.14,.045,.03,HAIR);                   // pico (3 degraus)
    vox(b.head,0,.1,.166,.09,.05,.025,HAIR);
    vox(b.head,0,.07,.171,.045,.05,.02,HAIR);
    vox(b.head,-.16,-.03,.05,.03,.16,.1,HAIR);vox(b.head,.16,-.03,.05,.03,.16,.1,HAIR); // costeletas

    // ---------- rosto pálido: órbitas fundas, olhos vermelhos, presas ----------
    for(const s of [-1,1]){                                    // sobrancelhas finas e inclinadas
      const br=new THREE.Group();br.position.set(s*.08,.075,.174);br.rotation.z=s*.18;b.head.add(br);
      vox(br,0,0,0,.085,.018,.015,HAIR);
    }
    vox(b.head,-.08,.02,.173,.08,.05,.012,0xc08a63);vox(b.head,.08,.02,.173,.08,.05,.012,0xc08a63); // órbitas
    vox(b.head,-.08,.02,.178,.052,.038,.012,EYE,1.5);vox(b.head,.08,.02,.178,.052,.038,.012,EYE,1.5);
    vox(b.head,-.08,.02,.184,.024,.016,.008,EYE_C,1.8);vox(b.head,.08,.02,.184,.024,.016,.008,EYE_C,1.8);
    vox(b.head,0,-.025,.184,.05,.06,.035,SKIN);                 // nariz
    vox(b.head,0,-.055,.19,.055,.025,.04,SKIN);
    vox(b.head,0,-.105,.173,.1,.018,.01,MOUTH);                 // boca
    vox(b.head,-.035,-.12,.176,.02,.04,.014,0xf2eae0);vox(b.head,.035,-.12,.176,.02,.04,.014,0xf2eae0); // presas

    // ---------- tronco: camisa creme, gravata de sangue e fraque preto ----------
    vox(b.torso,0,.28,.148,.16,.26,.02,SHIRT);                  // camisa
    vox(b.torso,0,.39,.15,.3,.07,.02,SHIRT);                    // gola da camisa
    vox(b.torso,0,.36,.166,.07,.06,.03,CRIM,.15);               // nó da gravata
    vox(b.torso,0,.28,.168,.055,.16,.025,CRIM,.1);              // lâmina
    vox(b.torso,0,.31,.172,.032,.032,.012,SILVER);              // alfinete de prata
    vox(b.torso,-.115,.3,.151,.09,.28,.03,VELVET);vox(b.torso,.115,.3,.151,.09,.28,.03,VELVET); // lapelas
    vox(b.torso,-.16,.3,.153,.012,.26,.012,SILVER_D);vox(b.torso,.16,.3,.153,.012,.26,.012,SILVER_D); // debrum prateado
    for(const y of [.22,.16,.1])vox(b.torso,.075,y,.152,.02,.02,.012,SILVER);                    // botões
    // medalhão de prata com gema
    vox(b.torso,0,.15,.172,.05,.05,.015,SILVER);
    vox(b.torso,0,.15,.181,.026,.026,.012,GEM,1.1);
    vox(b.torso,0,.175,.172,.014,.02,.012,SILVER_D);            // corrente
    // ---------- gola alta erguida atrás da cabeça (preta por fora, vinho por dentro) ----------
    const col=(s)=>{const g=new THREE.Group();g.position.set(s*.17,.42,-.19);g.rotation.set(-.25,0,-s*.5);b.torso.add(g);
      vox(g,0,.14,0,.24,.34,.045,CLOAK);vox(g,0,.14,.012,.2,.3,.012,CRIM_D)};
    col(-1);col(1);
    // ombros do fraque com debrum
    vox(b.torso,-.235,.33,0,.08,.15,.3,VELVET);vox(b.torso,.235,.33,0,.08,.15,.3,VELVET);

    // ---------- capa longa preta com forro vermelho (grupo animado) ----------
    const cape=new THREE.Group();cape.position.set(0,.42,-.16);b.torso.add(cape);b.cape=cape;
    vox(cape,-.2,-.3,-.01,.13,.6,.04,HAIR);
    vox(cape,-.06,-.34,0,.14,.68,.045,HAIR);
    vox(cape,.08,-.32,-.005,.13,.64,.04,HAIR);
    vox(cape,.21,-.26,-.015,.11,.52,.035,HAIR);
    vox(cape,-.2,-.585,.0,.13,.03,.045,CRIM_D);                 // forro na barra
    vox(cape,-.06,-.665,.004,.14,.035,.05,CRIM_D);
    vox(cape,.08,-.625,.0,.13,.03,.045,CRIM_D);
    vox(cape,.21,-.505,-.01,.11,.025,.04,CRIM_D);
    vox(cape,-.264,-.3,.006,.012,.54,.03,CRIM_D);               // debrum esquerdo
    vox(cape,.264,-.26,.0,.012,.48,.03,CRIM_D);                 // debrum direito
    // morcego heráldico nas costas (foco na câmera do jogo)
    vox(cape,0,-.28,-.04,.034,.1,.008,CRIM);                    // corpo
    vox(cape,0,-.232,-.04,.02,.028,.008,CRIM);                  // cabeça
    vox(cape,-.012,-.212,-.04,.008,.018,.008,CRIM);vox(cape,.012,-.212,-.04,.008,.018,.008,CRIM); // orelhas
    vox(cape,-.06,-.258,-.04,.085,.032,.008,CRIM);vox(cape,.06,-.258,-.04,.085,.032,.008,CRIM);   // asas
    vox(cape,-.112,-.24,-.04,.038,.02,.008,CRIM);vox(cape,.112,-.24,-.04,.038,.02,.008,CRIM);     // pontas
    vox(cape,0,-.325,-.04,.018,.04,.008,CRIM);                  // cauda

    // ---------- punhos de camisa e anel de sinete ----------
    vox(b.handL,0,.065,0,.155,.022,.155,SHIRT);vox(b.handR,0,.065,0,.155,.022,.155,SHIRT);
    vox(b.handR,.035,.0,.07,.028,.018,.02,GEM,.8);
};
