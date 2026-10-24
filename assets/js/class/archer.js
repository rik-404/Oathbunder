/* ================= CLASSE: ARQUEIRO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.arqueiro = {
  nome: 'Oliver',
  role: 'Flechas rápidas no mais perto',
  ui: '#7fcf5a',
  hp: 90,
  armor: 0,
  speed: 5.8,
  weaponId: 'archer_bow',
  passiveId: 'ricochet',
  pal: {
    body: 0x275447,
    trim: 0x221812,
    skin: 0xecc99d,
    legs: 0x2b231c,
    cape: 0x12483c,
    arm: 0x275447,
    boots: 0x1c1510
  },
  stats: { Vida: 3, Dano: 3, Veloc: 5, Alcance: 5 }
};

/* ================= MODELO VOXEL (CLASSES.arqueiro.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: arqueiro (Oliver) — modelo voxel.
// Capuz verde-musgo em camadas, máscara de couro, olhos verdes, capa com dobras,
// aljava diagonal e arco recurvo com flecha encaixada.
window.CLASSES.arqueiro.model=function(b,P,vox,makeBow,boxGeo){

    // Paleta da skin: verdes do capuz/túnica, couro, metal envelhecido e a
    // assinatura da classe (olhos verdes + penas vermelhas/brancas/verdes).
    const HG=0x155343,HD=0x0e3a2f,HL=0x1f6b58,HL2=0x2a7a63;
    const TB=0x275447,TD=0x18372c,TL=0x356b58;
    const GP=0x262828,BT=0x221812,BU=0x6a6055,BUD=0x4d463d;
    const ST=0x4a2e1d,LT=0x2c231d,LB=0x3c3029,LS=0x5a3b25,WOOD=0x7a5230;
    const SKD=0xcfa578,EY=0x2fbf62,EY2=0xa8ffc0;
    const FLR=0xd23b2f,FLW=0xeee7da;

    /* ---------------- capuz ---------------- */
    // casco traseiro, laterais e aro interno escuro em volta do rosto
    vox(b.head,0,.02,-.135,.44,.36,.27,HG);
    vox(b.head,-.195,.02,-.02,.055,.31,.21,HD);
    vox(b.head,.195,.02,-.02,.055,.31,.21,HD);
    vox(b.head,0,.17,.161,.34,.025,.038,HD);
    vox(b.head,-.17,.01,.16,.025,.25,.03,HD);
    vox(b.head,.17,.01,.16,.025,.25,.03,HD);

    // aba frontal do capuz (sombreia os olhos)
    vox(b.head,0,.16,.15,.38,.045,.10,HG);
    vox(b.head,0,.132,.15,.36,.018,.08,HD);

    // topo em camadas, caído para trás e para o lado (evita silhueta de árvore)
    vox(b.head,0,.20,-.06,.38,.09,.33,HG);
    vox(b.head,.012,.26,-.105,.30,.08,.25,HL);
    vox(b.head,.045,.315,-.155,.21,.07,.18,HG);
    vox(b.head,.085,.355,-.20,.125,.06,.12,HD);
    vox(b.head,.11,.39,-.235,.06,.035,.07,HL2);
    // vincos do tecido
    vox(b.head,-.10,.265,-.26,.05,.07,.018,HD);
    vox(b.head,.10,.265,-.26,.05,.07,.018,HD);
    vox(b.head,.045,.30,-.285,.035,.08,.015,HD);

    // tira de couro na testa + fivela e gema verde
    vox(b.head,0,.105,.176,.34,.035,.018,ST);
    vox(b.head,0,.105,.19,.065,.05,.014,BU);
    vox(b.head,0,.105,.2,.03,.025,.012,EY,.5);

    // pena da classe presa no lado do capuz
    const feather=new THREE.Group();
    feather.position.set(-.18,.235,.015);feather.rotation.z=-.52;b.head.add(feather);
    vox(feather,0,0,0,.022,.15,.022,FLW);
    vox(feather,0,.10,0,.03,.07,.03,FLR);
    vox(feather,-.022,.045,0,.018,.06,.018,FLW);
    vox(feather,.022,.035,0,.018,.05,.018,FLW);
    vox(feather,.012,.02,0,.018,.05,.018,EY);
    vox(feather,0,-.025,0,.04,.025,.04,ST);

    // rosto: sombra das maçãs, olhos verdes e nariz
    vox(b.head,-.13,-.035,.173,.04,.09,.012,SKD);
    vox(b.head,.13,-.035,.173,.04,.09,.012,SKD);
    vox(b.head,-.075,.022,.174,.063,.047,.012,0x101a14);
    vox(b.head,.075,.022,.174,.063,.047,.012,0x101a14);
    vox(b.head,-.075,.022,.181,.038,.024,.012,EY,.3);
    vox(b.head,.075,.022,.181,.038,.024,.012,EY,.3);
    vox(b.head,-.075,.025,.188,.008,.008,.008,EY2,.8);
    vox(b.head,.075,.025,.188,.008,.008,.008,EY2,.8);
    vox(b.head,-.075,.046,.181,.066,.012,.012,HD);
    vox(b.head,.075,.046,.181,.066,.012,.012,HD);
    vox(b.head,0,-.018,.181,.035,.065,.035,SKD);

    // máscara de couro cinza: borda, costura, fresta e tiras laterais
    vox(b.head,0,-.09,.172,.30,.15,.04,GP);
    vox(b.head,0,-.025,.182,.32,.025,.02,BT);
    vox(b.head,0,-.12,.194,.15,.02,.015,0x0b0a09);
    vox(b.head,-.06,-.09,.194,.008,.025,.006,0x4d4d49);
    vox(b.head,.06,-.09,.194,.008,.025,.006,0x4d4d49);
    vox(b.head,-.145,-.06,.145,.03,.08,.06,ST);
    vox(b.head,.145,-.06,.145,.03,.08,.06,ST);
    vox(b.head,0,-.17,.152,.18,.035,.05,LT);

    /* ---------------- gola, peito e aljava ---------------- */
    // gola alta + capa curta sobre os ombros
    vox(b.torso,0,.42,0,.22,.12,.22,HG);
    vox(b.torso,0,.37,0,.50,.075,.36,P.cape);
    vox(b.torso,0,.335,.145,.36,.07,.04,HG);
    vox(b.torso,-.235,.31,0,.10,.15,.32,HG);
    vox(b.torso,.235,.31,0,.10,.15,.32,HG);
    vox(b.torso,-.235,.235,.10,.09,.06,.18,HD);
    vox(b.torso,.235,.235,.10,.09,.06,.18,HD);
    vox(b.torso,0,.365,.165,.075,.06,.04,BU);
    vox(b.torso,0,.365,.185,.03,.03,.015,EY,.45);

    // painel de couro no peito, com bordas e costura central
    vox(b.torso,0,.15,.155,.34,.27,.03,GP);
    vox(b.torso,0,.285,.162,.36,.035,.02,BT);
    vox(b.torso,0,.015,.162,.32,.03,.02,BT);
    vox(b.torso,0,.15,.176,.014,.23,.01,HD);
    vox(b.torso,-.10,.15,.172,.018,.22,.012,BT);
    vox(b.torso,.10,.15,.172,.018,.22,.012,BT);

    // folha verde da classe no peito (à esquerda da alça)
    vox(b.torso,-.11,.15,.182,.042,.08,.012,HL);
    vox(b.torso,-.11,.195,.182,.028,.03,.012,HL2);
    vox(b.torso,-.11,.10,.182,.018,.03,.012,HD);

    // alça diagonal da aljava (frente) — couro com fivela e gema
    const qf=new THREE.Group();
    qf.position.set(0,.15,.185);qf.rotation.z=.56;b.torso.add(qf);
    vox(qf,0,0,0,.055,.39,.016,LB);
    vox(qf,0,.01,.012,.075,.06,.012,BU);
    vox(qf,0,.01,.024,.028,.028,.008,EY,.4);

    // alça traseira sobre a capa
    const qb=new THREE.Group();
    qb.position.set(0,.10,-.195);qb.rotation.z=.56;b.torso.add(qb);
    vox(qb,0,0,0,.055,.52,.016,LB);
    vox(qb,0,.02,.01,.07,.055,.012,BU);

    // ombreiras de couro (presas aos braços)
    vox(b.armL,0,-.01,0,.16,.10,.18,LB);
    vox(b.armR,0,-.01,0,.16,.10,.18,LB);
    vox(b.armL,0,.04,0,.18,.025,.20,LT);
    vox(b.armR,0,.04,0,.18,.025,.20,LT);
    vox(b.armL,-.03,-.01,.09,.03,.03,.02,BU);
    vox(b.armR,.03,-.01,.09,.03,.03,.02,BU);

    // braceletes e luvas sem dedos
    for(const h of [b.handL,b.handR]){
      vox(h,0,.015,0,.155,.09,.16,LB);
      vox(h,0,-.035,0,.16,.025,.17,BU);
      vox(h,-.03,0,.085,.025,.025,.015,BUD);
      vox(h,0,-.045,.02,.115,.06,.12,ST);
    }

    // cinto de couro, fivela, gema e bolsas
    vox(b.torso,0,.02,0,.48,.075,.32,ST);
    vox(b.torso,0,.02,.168,.09,.065,.03,BU);
    vox(b.torso,0,.02,.186,.038,.03,.015,EY,.4);
    vox(b.torso,-.18,-.055,.15,.10,.13,.07,LB);
    vox(b.torso,-.18,-.115,.165,.11,.035,.075,ST);
    vox(b.torso,.17,-.05,.16,.09,.11,.06,LT);
    for(const x of [-.12,.12])vox(b.torso,x,.02,.175,.025,.085,.015,BT);

    // túnica curta em abas, aba central e caudas laterais (silhueta de batedor)
    vox(b.torso,-.095,-.075,.15,.16,.14,.035,TB);
    vox(b.torso,.095,-.075,.15,.16,.14,.035,TB);
    vox(b.torso,0,-.12,.152,.13,.20,.035,TB);
    // barra reforçada
    vox(b.torso,-.095,-.15,.15,.17,.035,.04,TD);
    vox(b.torso,.095,-.15,.15,.17,.035,.04,TD);
    vox(b.torso,0,-.225,.152,.14,.035,.04,TD);
    // caudas laterais longas
    vox(b.torso,-.20,-.13,.10,.09,.24,.03,TD);
    vox(b.torso,.20,-.13,.10,.09,.24,.03,TD);
    vox(b.torso,-.20,-.26,.11,.10,.035,.035,ST);
    vox(b.torso,.20,-.26,.11,.10,.035,.035,ST);

    // capa longa com dobras, debrum e fecho
    const cape=new THREE.Group();
    cape.position.set(0,.38,-.145);b.torso.add(cape);b.cape=cape;
    vox(cape,0,-.20,0,.46,.58,.035,P.cape);
    vox(cape,0,-.49,0,.47,.045,.04,HD);
    vox(cape,-.235,-.20,0,.018,.53,.035,ST);
    vox(cape,.235,-.20,0,.018,.53,.035,ST);
    vox(cape,-.08,-.21,-.018,.015,.50,.012,HD);
    vox(cape,.08,-.21,-.018,.015,.50,.012,HD);
    vox(cape,0,.07,0,.40,.045,.04,HL);
    vox(cape,-.12,-.18,-.02,.065,.065,.02,BU);
    vox(cape,-.12,-.18,-.032,.032,.032,.014,EY,.45);

    // aljava de couro presa nas costas
    const quiver=new THREE.Group();
    quiver.position.set(.19,.04,-.225);b.torso.add(quiver);b.quiver=quiver;
    vox(quiver,0,0,0,.14,.38,.11,ST);
    vox(quiver,0,.19,0,.15,.05,.12,LB);
    vox(quiver,0,-.19,0,.15,.04,.12,LT);
    vox(quiver,0,.09,0,.15,.03,.12,LB);
    vox(quiver,0,-.08,0,.15,.03,.12,LB);
    // flechas com penas vermelhas, brancas e verdes
    const arrX=[-.045,-.015,.015,.045];
    const arrC=[FLR,FLW,EY,FLR];
    arrX.forEach((ax,i)=>{
      vox(quiver,ax,.30,0,.012,.26,.012,0xd9c9a8);
      vox(quiver,ax,.43,.005,.045,.07,.02,arrC[i]);
      vox(quiver,ax,.43,0,.018,.07,.05,arrC[i]===EY?FLW:FLR);
      vox(quiver,ax,.475,0,.008,.03,.008,0x6a4a2a);
    });

    /* ---------------- pernas ---------------- */
    for(const lg of [b.legL,b.legR]){
      vox(lg,0,-.06,0,.18,.11,.20,TB);          // perneira verde
      vox(lg,0,-.115,0,.18,.025,.205,TD);
      vox(lg,0,-.19,.07,.18,.065,.07,LB);       // joelheira
      vox(lg,0,-.19,.11,.055,.035,.02,BU);
      vox(lg,0,-.245,0,.17,.08,.19,TL);         // cano
      vox(lg,0,-.285,0,.19,.05,.22,ST);         // cano da bota
      vox(lg,0,-.33,.02,.20,.03,.24,LT);        // tira
      vox(lg,0,-.345,.13,.06,.035,.04,BU);      // biqueira
    }

    /* ---------------- arco recurvo ---------------- */
    // Espelho no eixo X para corrigir a curvatura; a flecha continua apontada para +Z.
    const bow=new THREE.Group();bow.name='oliverBow';b.handL.add(bow);b.bow=bow;
    bow.position.set(0,0,.10);
    bow.scale.x=-1;
    for(let i=-4;i<=4;i++){
      const y=i*.085,x=-i*i*.0075;
      vox(bow,x,y,.035,.058,.10,.07,i%2?LS:WOOD);
    }
    // veio claro e reforço de couro nas pontas
    for(let i=-3;i<=3;i++){
      const y=i*.085,x=-i*i*.0075;
      vox(bow,x-.025,y,.072,.02,.07,.02,LT);
    }
    // punho de couro, enrolamento verde e pequena gema
    vox(bow,0,0,.035,.08,.20,.085,ST);
    vox(bow,0,.08,.075,.075,.04,.095,HL);
    vox(bow,0,-.08,.075,.075,.04,.095,HL);
    vox(bow,-.03,.0,.086,.025,.035,.012,EY,.45);
    // pontas com reforço metálico e penas
    vox(bow,-.12,.365,.035,.045,.04,.065,BU);
    vox(bow,-.12,-.365,.035,.045,.04,.065,BU);
    vox(bow,-.15,.39,.03,.035,.06,.025,FLW);
    vox(bow,-.15,.435,.03,.025,.045,.02,FLR);
    // corda entre as pontas
    vox(bow,-.12,0,.035,.012,.69,.012,0xe6e0d0,.1);
    // flecha encaixada (aparece durante o ataque)
    const nocked=new THREE.Group();nocked.name='nockedArrow';nocked.position.set(-.12,.02,.25);bow.add(nocked);b.bowArrow=nocked;
    vox(nocked,0,0,0,.028,.028,.46,0x8a6a42);
    vox(nocked,0,0,.25,.06,.06,.10,0xcfd6dd);
    vox(nocked,0,0,.31,.02,.02,.04,0xe8eef2);
    vox(nocked,0,0,-.20,.06,.012,.09,EY);
    vox(nocked,0,0,-.20,.012,.06,.09,FLW);
    vox(nocked,0,0,-.26,.04,.04,.02,0x2a4a3a);
    nocked.visible=false;
    b.keep.push({g:bow,arm:b.armL});
};
