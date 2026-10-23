/* ================= CLASSE: NECROMANTE ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.necro = {
  nome: 'Necronus',
  role: 'Ergue esqueletos que lutam por você',
  ui: '#7ee0a8',
  hp: 85,
  armor: 0,
  speed: 5.2,
  atkCd: .8,
  dmg: 16,
  kind: 'proj',
  proj: 'skull',
  projSpeed: 13,
  range: 13,
  pierce: 0,
  ab: {
    nome: 'Legião dos Mortos',
    cd: 9,
    desc: 'Ergue 3 esqueletos na hora e cura os seus.'
  },
  pal: {
    body: 0x1f1b18,
    trim: 0x666561,
    skin: 0xcabfa1,
    legs: 0x141210,
    hat: 0x403e39,
    arm: 0x666561,
    boots: 0x0a0908
  },
  stats: { Vida: 3, Dano: 3, Veloc: 3, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.necro.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: necro (Necronus) — necromante encapuzado: crânio exposto com olhos de
// fogo-fátuo, capuz cinza, túnica esvoaçante com costelas de osso, cinto com
// fivela de caveira e cajado com crânio + chama verde.
window.CLASSES.necro.model=function(b,P,vox,makeBow,boxGeo){

    const BONE=0xcabfa1,BONE_L=0xd8d2bd,BONE_D=0x9c9272;        // osso
    const ROBE=P.body,ROBE_D=0x141210,ROBE_L=0x2b2622;          // túnica
    const HOOD=0x403e39,HOOD_D=0x24221f,HOOD_L=0x52514b;        // capuz
    const GRN=0x5fe89a,GRN_D=0x2f9a5e,DARK=0x0a0908;            // fogo-fátuo

    // ---------- crânio: órbitas fundas com fogo-fátuo, nasal e dentes ----------
    vox(b.head,0,-.02,.176,.28,.28,.02,BONE);                   // face de osso
    vox(b.head,-.075,.02,.19,.085,.07,.015,DARK);vox(b.head,.075,.02,.19,.085,.07,.015,DARK); // órbitas
    vox(b.head,-.075,.02,.199,.036,.032,.01,GRN,.7);vox(b.head,.075,.02,.199,.036,.032,.01,GRN,1.0); // olhos
    vox(b.head,0,-.055,.19,.04,.045,.012,DARK);                 // nasal
    vox(b.head,0,-.072,.19,.022,.03,.012,DARK);
    vox(b.head,-.13,-.02,.181,.045,.08,.02,BONE_D);vox(b.head,.13,-.02,.181,.045,.08,.02,BONE_D); // maçãs
    vox(b.head,0,-.125,.183,.19,.05,.025,BONE_L);               // maxilar
    for(const x of [-.06,-.02,.02,.06])vox(b.head,x,-.125,.197,.012,.045,.01,DARK); // vãos dos dentes
    vox(b.head,0,-.16,.179,.16,.02,.02,BONE_D);                 // mandíbula

    // ---------- capuz: topo, ponta caída, laterais e sombra interna ----------
    vox(b.head,0,.165,-.02,.4,.075,.42,HOOD);                   // topo
    vox(b.head,0,.215,-.08,.28,.065,.28,HOOD);                  // crista do capuz
    vox(b.head,0,.26,-.11,.17,.055,.18,HOOD);                   // ponta
    vox(b.head,0,.03,-.16,.42,.4,.06,HOOD);                     // nuca (até a base)
    vox(b.head,-.185,.0,-.02,.05,.26,.36,HOOD);vox(b.head,.185,.0,-.02,.05,.26,.36,HOOD); // laterais
    vox(b.head,0,.115,.17,.42,.055,.05,HOOD);                   // testa do capuz
    vox(b.head,0,.09,.166,.34,.025,.012,HOOD_D);                // sombra interna

    // ---------- túnica: gola do capuz, costelas e cinto com caveira ----------
    vox(b.torso,0,.38,0,.46,.1,.34,HOOD);                       // gola
    vox(b.torso,-.16,.31,.145,.1,.2,.03,HOOD);vox(b.torso,.16,.31,.145,.1,.2,.03,HOOD); // capuz descendo
    for(let i=0;i<3;i++){                                       // costelas de osso no peito
      const y=.28-i*.075,w=.2+i*.02;
      vox(b.torso,-w/2-.02,y,.15,w*.55,.028,.02,BONE);
      vox(b.torso,w/2+.02,y,.15,w*.55,.028,.02,BONE);
    }
    vox(b.torso,0,.09,.152,.05,.16,.02,BONE_D);                 // esterno
    vox(b.torso,0,.03,0,.48,.06,.32,BONE_D);                    // cinto de osso
    vox(b.torso,0,.03,.168,.1,.085,.03,BONE);                   // fivela-caveira
    vox(b.torso,-.025,.04,.18,.03,.035,.015,DARK);vox(b.torso,.025,.04,.18,.03,.035,.015,DARK);
    vox(b.torso,-.025,.04,.186,.012,.014,.008,GRN,1.2);vox(b.torso,.025,.04,.186,.012,.014,.008,GRN,1.2);
    // tangas esfarrapadas sobre o quadril
    for(const [x,w] of [[-.21,.12],[-.07,.1],[.07,.11],[.21,.12]])vox(b.torso,x,-.07,0,w,.16,.3,ROBE_L);

    // ---------- capa esfarrapada (grupo animado) com sigilo verde ----------
    const cape=new THREE.Group();cape.position.set(0,.4,-.17);b.torso.add(cape);b.cape=cape;
    vox(cape,-.18,-.24,-.01,.14,.52,.04,ROBE);
    vox(cape,-.03,-.3,0,.15,.62,.045,ROBE);
    vox(cape,.13,-.26,-.005,.14,.56,.04,ROBE);
    vox(cape,-.18,-.49,.0,.14,.03,.045,BONE_D);
    vox(cape,-.03,-.6,.004,.15,.035,.05,BONE_D);
    vox(cape,.13,-.53,.0,.14,.03,.045,BONE_D);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;vox(cape,Math.cos(a)*.055,-.3+Math.sin(a)*.055,-.038,.016,.016,.008,GRN,.9)} // sigilo
    vox(cape,0,-.3,-.044,.024,.024,.008,GRN,.9);

    // ---------- ombreiras de osso ----------
    vox(b.torso,-.24,.33,0,.09,.1,.2,BONE_D);vox(b.torso,.24,.33,0,.09,.1,.2,BONE_D);
    vox(b.torso,-.24,.385,.0,.07,.03,.16,BONE);vox(b.torso,.24,.385,.0,.07,.03,.16,BONE);

    // ---------- mãos de esqueleto ----------
    for(const h of [b.handL,b.handR]){vox(h,0,-.02,0,.13,.11,.145,BONE);vox(h,-.045,-.05,.08,.03,.05,.03,BONE_D);vox(h,.045,-.05,.08,.03,.05,.03,BONE_D)}

    // ---------- cajado com crânio e chama verde (mão esquerda) ----------
    const st=new THREE.Group();b.handL.add(st);
    vox(st,0,.1,0,.05,.92,.05,0x2a2018);                       // haste de madeira escura
    vox(st,0,-.36,0,.06,.08,.06,BONE_D);                       // contrapeso
    vox(st,0,.2,0,.06,.05,.06,BONE);                           // anéis de osso
    vox(st,0,.44,0,.06,.05,.06,BONE);
    vox(st,0,.6,0,.19,.19,.19,BONE);                           // crânio
    vox(st,-.055,.62,.098,.055,.055,.02,DARK);vox(st,.055,.62,.098,.055,.055,.02,DARK); // órbitas
    vox(st,-.055,.62,.106,.024,.024,.012,GRN,.8);vox(st,.055,.62,.106,.024,.024,.012,GRN,1.5);
    vox(st,0,.54,.098,.05,.045,.02,BONE_D);                    // mandíbula
    vox(st,0,.71,0,.13,.1,.13,GRN,1.3);                        // chama
    vox(st,0,.78,0,.07,.07,.07,GRN,1.0);
    vox(st,0,.83,0,.035,.05,.035,0xd8ffe8,.9);
    b.keep.push({g:st,arm:b.armL,lean:-.14,leanX:.4});
};
