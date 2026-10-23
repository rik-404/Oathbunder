/* ================= CLASSE: REI ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.king = {
  nome: 'Midas',
  role: 'Arremessa moedas e convoca a guarda real',
  ui: '#f2c14b',
  hp: 105,
  armor: .1,
  speed: 5,
  atkCd: .5,
  dmg: 17,
  kind: 'proj',
  proj: 'gcoin',
  projSpeed: 17,
  range: 14,
  pierce: 1,
  ab: {
    nome: 'Convocar a Guarda',
    cd: 10,
    desc: 'Chama 4 soldados reais que lutam por você.'
  },
  pal: {
    body: 0x990000,
    trim: 0xe3ab28,
    skin: 0xc48b6a,
    legs: 0xe8e8e8,
    hat: 0xe3ab28,
    cape: 0x8a1212,
    arm: 0xa10000,
    boots: 0x282828,
    eye: 0x1a3fd1
  },
  stats: { Vida: 3, Dano: 3, Veloc: 3, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.king.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: king (Midas) — rei dourado: coroa com pontas e joias, barba branca, manto de
// arminho nos ombros, capa vermelha com barra de arminho, cetro e a mão dourada que
// transforma tudo em ouro (a mão que arremessa as moedas).
window.CLASSES.king.model=function(b,P,vox,makeBow,boxGeo){

    const RD=P.body,RD_D=0x6b0000,VELVET=0x7a0a0a;              // vermelho do manto
    const GD=P.trim,GD_D=0xbf8f1e,GD_L=0xffd45a;                 // ouro
    const ERM=0xf4f0e8,ERM_D=0xd8d2c4;                          // arminho
    const HAIR=0x8c6639,HAIR_D=0x5f452a,BEARD=0xece6da;          // cabelo/barba
    const SKIN=P.skin,EYE=P.eye||0x1a3fd1;
    const RUBY=0xd42020,EMER=0x1ab829,SAPPH=0x1a3fd1;

    // ---------- cabelo castanho + barba branca ----------
    vox(b.head,0,.06,-.17,.34,.2,.03,HAIR);                     // nuca
    vox(b.head,-.172,.0,-.02,.03,.18,.26,HAIR);vox(b.head,.172,.0,-.02,.03,.18,.26,HAIR);
    vox(b.head,0,.14,.152,.34,.05,.03,HAIR);                    // linha do cabelo sob a coroa
    vox(b.head,0,-.075,.172,.16,.03,.03,BEARD);                 // bigode
    vox(b.head,0,-.13,.155,.185,.09,.08,BEARD);                 // barba
    vox(b.head,0,-.19,.145,.13,.07,.06,BEARD);                  // ponta da barba
    vox(b.head,-.085,.075,.174,.075,.02,.015,HAIR_D);vox(b.head,.085,.075,.174,.075,.02,.015,HAIR_D); // sobrancelhas
    vox(b.head,-.08,.02,.173,.06,.045,.012,EYE,.6);vox(b.head,.08,.02,.173,.06,.045,.012,EYE,.6);     // olhos azuis
    vox(b.head,0,-.02,.184,.055,.06,.035,SKIN);                 // nariz

    // ---------- coroa: faixa, veludo, pontas e joias ----------
    vox(b.head,0,.163,0,.36,.055,.36,GD);                       // faixa
    vox(b.head,0,.196,0,.33,.025,.33,VELVET);                   // veludo interno
    for(const s of [-1,1]){
      vox(b.head,s*.15,.24,0,.055,.1,.06,GD);                   // pontas laterais
      vox(b.head,s*.105,.235,.115,.05,.085,.05,GD);             // diagonais frente
      vox(b.head,s*.105,.235,-.115,.05,.085,.05,GD);            // diagonais trás
    }
    vox(b.head,0,.245,.15,.055,.11,.055,GD);vox(b.head,0,.245,-.15,.055,.11,.055,GD); // frente/trás
    vox(b.head,0,.305,.15,.025,.025,.02,RUBY,.9);               // joia frontal
    vox(b.head,0,.305,-.15,.025,.025,.02,EMER,.9);              // joia traseira
    vox(b.head,-.15,.3,0,.02,.025,.02,SAPPH,.9);vox(b.head,.15,.3,0,.02,.025,.02,SAPPH,.9);
    vox(b.head,0,.212,.182,.05,.05,.015,GD_L,.35);              // broche central da faixa

    // ---------- manto de arminho nos ombros, aberto em V no peito ----------
    vox(b.torso,-.21,.35,0,.1,.16,.3,ERM);vox(b.torso,.21,.35,0,.1,.16,.3,ERM); // ombros
    vox(b.torso,0,.37,-.178,.4,.15,.03,ERM);                    // costas
    for(const s of [-1,1])vox(b.torso,s*.13,.2,.152,.035,.28,.025,ERM); // debrum de arminho na abertura
    for(const [x,y,z] of [[-.21,.4,.163],[-.21,.32,.163],[.21,.4,.163],[.21,.32,.163],[-.13,.41,-.19],[.13,.41,-.19],[-.03,.34,-.19],[.08,.33,-.19]])
      vox(b.torso,x,y,z,.022,.022,.012,0x181414);                // manchas de arminho
    vox(b.torso,0,.38,.168,.06,.06,.025,GD);                    // fecho dourado
    vox(b.torso,0,.38,.182,.025,.025,.015,RUBY,1.0);

    // ---------- peito: trança dourada, botões e moeda-medalhão ----------
    vox(b.torso,0,.24,.148,.03,.26,.015,GD_D);                  // trança central
    for(const y of [.3,.24,.18]){vox(b.torso,-.055,y,.148,.025,.025,.015,GD);vox(b.torso,.055,y,.148,.025,.025,.015,GD)}
    vox(b.torso,0,.12,.152,.09,.09,.02,GD);                    // moldura do medalhão
    vox(b.torso,0,.12,.163,.06,.06,.015,GD_D);
    vox(b.torso,0,.12,.172,.035,.035,.012,GD_L,.6);
    // cinto dourado + fivela com rubi
    vox(b.torso,0,.03,0,.47,.07,.31,GD_D);
    vox(b.torso,0,.03,.157,.07,.05,.02,GD);
    vox(b.torso,0,.03,.168,.03,.025,.015,RUBY,1.0);
    // bolsa de moedas no quadril esquerdo
    vox(b.torso,-.235,-.03,.08,.09,.1,.09,0x6a4a2a);
    vox(b.torso,-.235,.02,.125,.08,.03,.03,GD_D);
    vox(b.torso,-.235,.035,.13,.025,.02,.02,GD_L,.6);

    // ---------- capa real: veludo vermelho com barra de arminho ----------
    const cape=new THREE.Group();cape.position.set(0,.42,-.16);b.torso.add(cape);b.cape=cape;
    vox(cape,-.2,-.28,-.01,.15,.6,.04,RD);
    vox(cape,-.04,-.32,0,.15,.68,.045,RD);
    vox(cape,.12,-.3,-.005,.15,.64,.04,RD);
    vox(cape,.24,-.24,-.015,.1,.5,.035,RD);
    vox(cape,-.2,-.59,.0,.15,.035,.045,ERM);                    // barra de arminho
    vox(cape,-.04,-.67,.004,.15,.04,.05,ERM);
    vox(cape,.12,-.63,.0,.15,.035,.045,ERM);
    vox(cape,.24,-.5,-.01,.1,.03,.04,ERM);
    vox(cape,-.27,-.28,.006,.012,.55,.03,GD_D);                 // debrum dourado
    vox(cape,.29,-.24,.0,.012,.5,.03,GD_D);
    vox(cape,0,-.2,-.036,.02,.36,.012,GD_D);                    // trança nas costas
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;vox(cape,Math.cos(a)*.07,-.36+Math.sin(a)*.07,-.04,.022,.022,.012,GD)} // moeda/emblema
    vox(cape,0,-.36,-.045,.045,.045,.012,GD_L,.5);              // centro do emblema

    // ---------- mangas, punhos dourados e mão de ouro ----------
    vox(b.armL,0,-.285,0,.152,.05,.17,GD_D);vox(b.armR,0,-.285,0,.152,.05,.17,GD_D);
    vox(b.handR,0,-.01,0,.14,.12,.15,GD);                       // luva dourada (toque de Midas)
    vox(b.handR,0,.0,.075,.12,.1,.035,GD_L,.25);
    vox(b.handR,.0,-.05,.1,.09,.03,.03,GD_D);                   // moeda entre os dedos

    // ---------- cetro dourado com joia (mão esquerda) ----------
    const sc=new THREE.Group();b.handL.add(sc);
    vox(sc,0,.12,0,.045,.85,.045,GD_D);                         // haste
    vox(sc,0,-.28,0,.06,.08,.06,GD);                            // contrapeso
    vox(sc,0,.54,0,.075,.06,.075,GD);                           // colarinho
    vox(sc,0,.61,0,.1,.06,.1,GD);                               // copo
    vox(sc,0,.68,0,.07,.07,.07,RUBY,1.1);                       // joia
    vox(sc,0,.735,0,.035,.035,.035,GD_L,.7);                    // ponta
    b.keep.push({g:sc,arm:b.armL});
};
