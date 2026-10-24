/* ================= CLASSE: DEMÔNIO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.demon = {
  nome: 'Castiel',
  role: 'Lança fogo infernal e explode em chamas',
  ui: '#ff5a2a',
  hp: 110,
  armor: .08,
  speed: 5.2,
  weaponId: 'demon_hellfire',
  passiveId: 'burning_fire',
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
// Herói: demon (Castiel) — senhor das brasas: chifres de obsidiana, pele queimada,
// fenda de magma no peito, ombreiras com esporões, garras de osso e capa rasgada.
window.CLASSES.demon.model=function(b,P,vox,makeBow,boxGeo){

    const OBS=0x1d1512,OBS2=0x2c201b,OBS3=0x0b0807;             // obsidiana / couro queimado
    const EMB=0xff6a1a,MOLT=0xff8a2a,CORE=0xffc14a;             // brasa → magma → núcleo
    const BONE=0xc2ae8c,BONE_D=0x8a7a62;                        // osso
    const RED=P.trim,RED2=0xb01400;                             // vermelho da paleta
    const CLOAK=0x120d0d,EYE=0xff5a1a;                          // capa / olhos

    // ---------- cabeça: chifres grandes curvos, olhos em brasa, presas ----------
    vox(b.head,0,.14,.152,.3,.06,.035,OBS);                     // testa blindada
    for(const s of [-1,1]){                                     // sobrancelhas inclinadas (fronte carregada)
      const br=new THREE.Group();br.position.set(s*.085,.09,.171);br.rotation.z=s*.24;b.head.add(br);
      vox(br,0,0,0,.12,.03,.022,OBS2);
      vox(br,0,.0,.012,.12,.008,.006,EMB,.35);
    }
    // chifres: três seções encaixadas (grupos rotacionados) formando a curva
    const horn=(s)=>{
      const g1=new THREE.Group();g1.position.set(s*.15,.115,-.02);g1.rotation.set(-.22,0,-s*.2);b.head.add(g1);
      vox(g1,0,.05,0,.085,.12,.09,OBS);
      vox(g1,0,.02,.045,.03,.035,.012,EMB,.9);                  // brasa na base do chifre
      const g2=new THREE.Group();g2.position.set(0,.11,0);g2.rotation.set(-.5,0,-s*.16);g1.add(g2);
      vox(g2,0,.045,0,.065,.11,.07,OBS);
      vox(g2,0,.02,.04,.026,.012,.012,EMB,.8);
      const g3=new THREE.Group();g3.position.set(0,.1,0);g3.rotation.set(-.55,0,-s*.1);g2.add(g3);
      vox(g3,0,.04,0,.048,.09,.052,OBS);
      vox(g3,0,.09,0,.032,.05,.036,BONE);                       // ponta óssea
    };
    horn(-1);horn(1);
    vox(b.head,-.158,.145,-.02,.09,.022,.092,BONE_D);vox(b.head,.158,.145,-.02,.09,.022,.092,BONE_D); // anéis
    vox(b.head,-.145,.115,.035,.028,.028,.012,EMB,1.2);vox(b.head,.145,.115,.035,.028,.028,.012,EMB,1.2); // brasa na base
    vox(b.head,0,.02,.171,.28,.085,.012,0x0a0705);              // sombra das órbitas
    vox(b.head,-.075,.025,.178,.052,.032,.012,EYE,1.25);vox(b.head,.075,.025,.178,.052,.032,.012,EYE,1.25);
    vox(b.head,-.075,.025,.184,.024,.016,.008,CORE,1.7);vox(b.head,.075,.025,.184,.024,.016,.008,CORE,1.7); // núcleo do olhar
    vox(b.head,-.128,-.045,.173,.014,.085,.008,EMB,1.3);        // cicatriz de brasa no rosto
    vox(b.head,0,-.1,.172,.15,.028,.012,0x1a0a08);              // boca
    vox(b.head,-.045,-.118,.174,.018,.038,.012,BONE);vox(b.head,.045,-.118,.174,.018,.038,.012,BONE); // presas
    vox(b.head,0,-.15,.171,.15,.04,.02,OBS3);                   // queixo blindado

    // ---------- tronco: placas de obsidiana, fenda de magma e núcleo ----------
    vox(b.torso,-.115,.3,.15,.16,.2,.05,OBS);vox(b.torso,.115,.3,.15,.16,.2,.05,OBS);   // peitorais
    vox(b.torso,0,.26,.166,.018,.18,.02,EMB,.8);                // fenda de magma no esterno
    vox(b.torso,.016,.235,.171,.011,.045,.012,MOLT,1.0);       // ramo curto
    vox(b.torso,0,.24,.176,.022,.04,.012,CORE,1.5);             // núcleo
    vox(b.torso,0,.05,.148,.3,.18,.04,OBS2);                    // abdômen queimado
    vox(b.torso,-.09,.13,.168,.13,.018,.012,RED2,.3);vox(b.torso,.09,.13,.168,.13,.018,.012,RED2,.3); // veias
    vox(b.torso,0,.03,0,.47,.08,.31,OBS3);                      // cinto
    vox(b.torso,0,.075,.152,.44,.012,.02,RED2,.3);              // friso vermelho do cinto
    vox(b.torso,0,.03,.157,.06,.045,.02,EMB,1.2);               // fivela incandescente
    vox(b.torso,0,.41,0,.44,.05,.29,OBS3);                      // gola
    vox(b.torso,0,.4,.148,.06,.06,.02,RED,.5);                   // gema da gola
    // ombreiras com esporões ósseos
    vox(b.torso,-.245,.35,0,.14,.12,.21,OBS);vox(b.torso,.245,.35,0,.14,.12,.21,OBS);
    vox(b.torso,-.25,.405,0,.12,.05,.18,OBS2);vox(b.torso,.25,.405,0,.12,.05,.18,OBS2);
    const sp=(x,s)=>{const g=new THREE.Group();g.position.set(x,.395,0);g.rotation.z=-s*.35;b.torso.add(g);
      vox(g,0,.055,0,.062,.12,.072,OBS);vox(g,0,.115,0,.034,.05,.042,BONE);
      vox(g,0,.0,.05,.04,.05,.02,EMB,1.0)};
    sp(-.27,-1);sp(.27,1);

    // ---------- capa rasgada com forro de brasa (grupo animado) ----------
    const cape=new THREE.Group();cape.position.set(0,.42,-.15);b.torso.add(cape);b.cape=cape;
    vox(cape,-.2,-.22,-.01,.12,.54,.04,CLOAK);
    vox(cape,-.06,-.3,0,.14,.7,.045,CLOAK);
    vox(cape,.09,-.25,-.005,.13,.6,.04,CLOAK);
    vox(cape,.22,-.18,-.015,.1,.46,.035,CLOAK);
    vox(cape,-.2,-.5,.002,.12,.03,.045,EMB,.45);
    vox(cape,-.06,-.66,.004,.14,.035,.05,EMB,.55);
    vox(cape,.09,-.56,.0,.13,.03,.045,EMB,.5);
    vox(cape,.22,-.42,-.01,.1,.025,.04,EMB,.45);
    vox(cape,-.06,-.36,-.028,.022,.42,.015,RED2,.3);             // veia de brasa na capa
    // selo infernal nas costas (anel de brasa + núcleo) — foco na câmera do jogo
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;vox(cape,Math.cos(a)*.075,-.22+Math.sin(a)*.075,-.04,.018,.018,.006,EMB,1.1)}
    vox(cape,0,-.22,-.041,.03,.03,.007,CORE,1.5);
    vox(cape,-.11,-.1,-.036,.012,.05,.006,EMB,.8);vox(cape,.1,-.34,-.036,.012,.06,.006,EMB,.8);

    // ---------- braços: braceletes de obsidiana e garras de osso ----------
    vox(b.armL,0,-.18,0,.15,.13,.16,OBS);vox(b.armR,0,-.18,0,.15,.13,.16,OBS);
    vox(b.armL,0,-.115,0,.155,.03,.165,RED2,.35);vox(b.armR,0,-.115,0,.155,.03,.165,RED2,.35);
    vox(b.armL,0,-.255,.078,.03,.02,.012,EMB,1.1);vox(b.armR,0,-.255,.078,.03,.02,.012,EMB,1.1);
    for(const h of [b.handL,b.handR])for(const x of [-.035,0,.035])vox(h,x,-.035,.075,.022,.07,.022,BONE_D);

    // ---------- pernas: grevas, joelho em brasa e casco ----------
    vox(b.legL,0,-.15,0,.175,.14,.2,OBS);vox(b.legR,0,-.15,0,.175,.14,.2,OBS);
    vox(b.legL,0,-.2,.09,.055,.04,.02,EMB,1.1);vox(b.legR,0,-.2,.09,.055,.04,.02,EMB,1.1);
    vox(b.legL,0,-.3,.03,.19,.1,.245,OBS3);vox(b.legR,0,-.3,.03,.19,.1,.245,OBS3);
    vox(b.legL,0,-.325,.152,.05,.014,.012,EMB,.9);vox(b.legR,0,-.325,.152,.05,.014,.012,EMB,.9);
};
