/* ================= CLASSE: VIAJANTE DO TEMPO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.future = {
  nome: 'Smith',
  role: 'Rajadas de plasma de tecnologia temporal',
  ui: '#3bf0d0',
  hp: 92,
  armor: .05,
  speed: 5.6,
  weaponId: 'future_plasma',
  passiveId: 'future_echo',
  pal: {
    body: 0x1c2b3a,
    trim: 0x3bf0d0,
    skin: 0xd9b48a,
    legs: 0x14202c,
    hat: 0x24384a,
    cape: 0x3a5f74,
    arm: 0x1c2b3a
  },
  stats: { Vida: 3, Dano: 3, Veloc: 5, Alcance: 5 }
};

/* ================= MODELO VOXEL (CLASSES.future.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: future (Smith) — agente temporal: terno escuro, óculos escuros, gravata de
// plasma, casaco longo que balança e pistola de plasma (ciano = energia quântica).
window.CLASSES.future.model=function(b,P,vox,makeBow,boxGeo){

    const TR=P.trim;                                          // ciano: energia quântica
    const SUIT_D=0x0e1620,COAT=P.cape,COAT_D=0x24404f;        // terno escuro / casaco longo
    const SHIRT=0xd7dee6,GLASS=0x06090c,HAIR=0x1a2129,METAL=0x3a4650,BOOT=0x0a1014;

    // ---------- cabeça: cabelo penteado pra trás (com entrada) + óculos de agente ----------
    vox(b.head,0,.158,-.045,.32,.03,.32,HAIR);                // topo colado no crânio
    vox(b.head,0,.146,-.155,.3,.06,.05,HAIR);                 // topo atrás
    vox(b.head,0,.134,.152,.33,.05,.025,HAIR);                // linha do cabelo
    vox(b.head,0,.102,.168,.09,.05,.02,HAIR);                 // bico central na testa
    vox(b.head,-.171,.04,-.05,.026,.1,.2,HAIR);vox(b.head,.171,.04,-.05,.026,.1,.2,HAIR);
    vox(b.head,0,-.02,-.172,.33,.24,.028,HAIR);               // nuca
    vox(b.head,0,-.1,-.19,.05,.028,.012,TR,.9);               // porta de dados na nuca
    vox(b.head,0,-.06,-.189,.022,.07,.01,TR,.5);              // chip da nuca
    vox(b.head,0,.03,.176,.315,.09,.02,GLASS);                // armação escura
    vox(b.head,-.09,.045,.188,.115,.058,.008,0x13202a);vox(b.head,.09,.045,.188,.115,.058,.008,0x13202a);
    vox(b.head,0,.05,.187,.05,.022,.012,METAL);               // ponte
    vox(b.head,-.157,.05,.181,.02,.02,.01,METAL);vox(b.head,.157,.05,.181,.02,.02,.01,METAL);
    vox(b.head,-.12,.058,.193,.05,.012,.004,TR,1.1);          // reflexo ciano na lente
    vox(b.head,.183,-.03,-.03,.024,.05,.04,0x10161a);         // ponto no ouvido
    vox(b.head,.198,-.03,-.01,.007,.016,.016,TR,1.6);         // luz do interfone
    vox(b.head,.174,-.1,-.02,.01,.08,.01,0x10161a);           // fio do interfone
    vox(b.head,0,-.02,.186,.05,.058,.038,0xcf9a72);           // nariz
    vox(b.head,0,-.052,.192,.055,.026,.042,0xd8a47c);         // ponta do nariz
    vox(b.head,0,-.105,.173,.06,.014,.008,0x7a4a38);          // boca

    // ---------- tronco: camisa clara, gravata de plasma e casaco aberto ----------
    vox(b.torso,0,.29,.148,.22,.26,.02,SHIRT);                // camisa
    vox(b.torso,0,.38,.15,.28,.08,.02,SHIRT);                 // gola da camisa
    vox(b.torso,0,.35,.167,.065,.05,.03,TR,.9);               // nó da gravata
    vox(b.torso,0,.23,.172,.05,.22,.026,TR,.45);              // gravata
    vox(b.torso,0,.13,.172,.032,.04,.02,TR,.45);              // ponta da gravata
    vox(b.torso,-.115,.3,.154,.09,.3,.03,SUIT_D);vox(b.torso,.115,.3,.154,.09,.3,.03,SUIT_D); // lapelas
    vox(b.torso,0,.03,0,.47,.08,.31,SUIT_D);                  // cinto (cobre a faixa base)
    vox(b.torso,0,.03,.158,.06,.045,.02,TR,.9);               // fivela ciano
    vox(b.torso,-.15,.3,.17,.045,.045,.015,0x0e1620);         // broche quântico
    vox(b.torso,-.15,.3,.179,.025,.025,.008,TR,1.4);
    vox(b.torso,-.237,-.03,0,.05,.5,.31,COAT);vox(b.torso,.237,-.03,0,.05,.5,.31,COAT); // abas laterais
    vox(b.torso,-.263,-.02,.0,.008,.46,.03,TR,.55);vox(b.torso,.263,-.02,.0,.008,.46,.03,TR,.55); // debrum ciano
    vox(b.torso,0,.42,-.13,.34,.1,.05,COAT);                  // gola alta atrás
    vox(b.torso,0,.02,-.152,.44,.4,.03,COAT_D);               // costas do casaco
    vox(b.torso,0,.34,-.185,.11,.11,.02,0x0e1620);            // núcleo nas costas
    vox(b.torso,0,.34,-.196,.055,.055,.012,TR,1.4);

    // ---------- caudas do casaco (grupo animado: balança ao andar) ----------
    const cape=new THREE.Group();cape.position.set(0,.4,-.15);b.torso.add(cape);b.cape=cape;
    vox(cape,-.105,-.27,-.01,.19,.58,.04,COAT);vox(cape,.105,-.27,-.01,.19,.58,.04,COAT);
    vox(cape,-.203,-.27,-.005,.008,.55,.03,TR,.5);vox(cape,.203,-.27,-.005,.008,.55,.03,TR,.5); // debrum das caudas
    vox(cape,0,-.2,-.032,.05,.4,.02,COAT_D);                  // fenda central
    vox(cape,-.105,-.555,.002,.19,.03,.045,COAT_D);vox(cape,.105,-.555,.002,.19,.03,.045,COAT_D);
    vox(cape,0,-.46,-.036,.13,.022,.015,TR,.5);               // brilho quântico na barra

    // ---------- mangas do casaco + punhos ----------
    vox(b.armL,0,-.14,0,.165,.3,.185,COAT);vox(b.armR,0,-.14,0,.165,.3,.185,COAT);
    vox(b.armL,0,-.305,0,.155,.05,.175,COAT_D);vox(b.armR,0,-.305,0,.155,.05,.175,COAT_D);

    // ---------- pulso esquerdo: bracelete quântico + anel de luz flutuando ----------
    vox(b.handL,0,.06,0,.17,.07,.17,0x0d151c);
    vox(b.handL,0,.06,.088,.07,.045,.012,TR,1.2);
    const ring=new THREE.Group();ring.position.set(0,.075,0);b.handL.add(ring);
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;vox(ring,Math.cos(a)*.088,0,Math.sin(a)*.088,.03,.022,.03,TR,1.3)}

    // ---------- mão direita: pistola de plasma (cano pra baixo, alinhado ao braço) ----------
    const gun=new THREE.Group();b.handR.add(gun);
    vox(gun,0,-.005,.01,.07,.11,.08,0x0b1218);                // empunhadura
    vox(gun,0,-.095,.05,.085,.17,.11,0x223442);               // corpo
    vox(gun,0,-.05,.056,.05,.06,.12,0x3a4c5c);                // trilho superior
    vox(gun,0,-.13,.02,.03,.05,.03,0x0a0f14);                 // guarda-mato
    vox(gun,0,-.19,.05,.05,.06,.05,0x05090c);                 // cano
    vox(gun,0,-.222,.05,.04,.024,.04,TR,1.8);                 // boca carregada
    vox(gun,0,-.095,.111,.045,.1,.015,TR,1.0);                // célula de energia

    // ---------- botas escuras com anel de energia ----------
    vox(b.legL,0,-.3,.02,.185,.095,.235,BOOT);vox(b.legR,0,-.3,.02,.185,.095,.235,BOOT);
    vox(b.legL,0,-.252,.02,.19,.014,.24,TR,.55);vox(b.legR,0,-.252,.02,.19,.014,.24,TR,.55);
};
