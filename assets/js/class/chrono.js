/* ================= CLASSE: CHRONOMANTE ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.chrono = {
  nome: 'Vespera',
  role: 'Orbes do tempo que lentificam os inimigos',
  ui: '#5fe08a',
  hp: 95,
  armor: .05,
  speed: 5.4,
  weaponId: 'chrono_orb',
  pal: {
    body: 0x0c231c,
    trim: 0xbdbd96,
    skin: 0x22302a,
    legs: 0x13092b,
    hat: 0x26423b,
    cape: 0x06150f,
    arm: 0x2f5149,
    boots: 0x0a0514
  },
  stats: { Vida: 3, Dano: 3, Veloc: 4, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.chrono.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: chrono (Vespera) — senhora do tempo: capuz petróleo com moldura dourada,
// rosto na sombra com olhos esmeralda, manto escuro com MOSTRADOR DE RELÓGIO nas
// costas e cajado em forma de AMPULHETA com areia esmeralda.
window.CLASSES.chrono.model=function(b,P,vox,makeBow,boxGeo){

    const H2=0x26423b,H3=0x2f5149;                              // petróleo do capuz/mangas
    const ROB=P.body,ROB2=P.cape,ROB3=0x102e26;                 // manto
    const GD=P.trim,GD_D=0x8a875f,GD_L=0xd8d6b0;                // dourado-creme
    const EW=0x5fe08a,EW_D=0x2f9a5e,DARK=0x07080c;              // esmeralda / vazio
    const GLASS=0x2a6b56;

    // ---------- capuz: crista, ponta, laterais e moldura dourada do rosto ----------
    vox(b.head,0,.17,-.02,.42,.08,.44,H2);                      // topo
    vox(b.head,0,.225,-.08,.3,.07,.3,H2);                       // crista
    vox(b.head,0,.27,-.11,.18,.055,.2,H2);                      // ponta
    vox(b.head,0,.04,-.16,.42,.34,.06,H3);                      // nuca
    vox(b.head,-.19,.02,-.02,.05,.26,.36,H3);vox(b.head,.19,.02,-.02,.05,.26,.36,H3);
    vox(b.head,0,.115,.19,.42,.05,.055,GD);                     // moldura da testa
    vox(b.head,-.16,-.01,.175,.055,.3,.06,GD_D);vox(b.head,.16,-.01,.175,.055,.3,.06,GD_D); // laterais
    vox(b.head,0,-.155,.178,.3,.05,.05,GD_D);                   // queixo da moldura
    // rosto vazio na sombra + olhos esmeralda + marca de ampulheta na testa
    vox(b.head,0,-.04,.185,.27,.28,.035,DARK);
    vox(b.head,-.065,-.01,.205,.055,.045,.02,EW,1.2);vox(b.head,.065,-.01,.205,.055,.045,.02,EW,1.2);
    vox(b.head,0,.075,.2,.045,.012,.015,EW,.7);vox(b.head,0,.058,.2,.022,.014,.015,EW,.7);vox(b.head,0,.042,.2,.045,.012,.015,EW,.7);

    // ---------- tronco: gola dourada, abertura do manto e cinto com ampulheta ----------
    vox(b.torso,0,.4,0,.46,.06,.34,GD);                         // gola alta
    vox(b.torso,0,.39,.155,.2,.05,.03,GD_D);
    vox(b.torso,-.12,.28,.148,.04,.26,.02,GD_D);vox(b.torso,.12,.28,.148,.04,.26,.02,GD_D); // debrum
    for(let i=0;i<4;i++)vox(b.torso,0,.31-i*.06,.15,.03,.02,.015,EW,.5);                    // botões-runa
    vox(b.torso,0,.03,0,.48,.07,.32,GD);                        // cinto
    vox(b.torso,0,.03,.168,.11,.09,.03,GD_D);                   // fivela-ampulheta
    vox(b.torso,0,.055,.182,.075,.025,.015,EW,.9);
    vox(b.torso,0,.005,.182,.075,.025,.015,EW,.9);
    vox(b.torso,0,.03,.184,.012,.03,.012,GD_L,.6);
    // engrenagem no quadril direito
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;vox(b.torso,.235+Math.cos(a)*.055,-.03+Math.sin(a)*.055,.13,.022,.022,.015,GD_D)}
    vox(b.torso,.235,-.03,.14,.04,.04,.015,EW,.9);

    // ---------- capa com mostrador de relógio nas costas (grupo animado) ----------
    const cape=new THREE.Group();cape.position.set(0,.42,-.17);b.torso.add(cape);b.cape=cape;
    vox(cape,-.19,-.24,-.01,.15,.52,.04,ROB);
    vox(cape,-.03,-.3,0,.16,.64,.045,ROB);
    vox(cape,.13,-.26,-.005,.15,.56,.04,ROB);
    vox(cape,-.19,-.49,.0,.15,.03,.045,ROB2);
    vox(cape,-.03,-.61,.004,.16,.035,.05,ROB2);
    vox(cape,.13,-.53,.0,.15,.03,.045,ROB2);
    // mostrador: aro dourado, 12 marcas, ponteiros esmeralda
    const C0=-.3;
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
      vox(cape,c*.135,C0+s*.135,-.041,.028,.028,.01,GD)}
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
      vox(cape,c*.115,C0+s*.115,-.043,.05,.02,.01,GD_L,.3)}
    vox(cape,0,C0+.05,-.044,.02,.1,.012,EW,.8);                 // ponteiro dos minutos
    vox(cape,.04,C0,-.044,.08,.018,.012,EW,.8);                 // ponteiro das horas
    vox(cape,0,C0,-.048,.032,.032,.012,GD_L,.5);                // eixo

    // ---------- mangas com punhos dourados e mãos ----------
    vox(b.armL,0,-.14,0,.16,.3,.18,H3);vox(b.armR,0,-.14,0,.16,.3,.18,H3);
    vox(b.armL,0,-.285,0,.165,.05,.185,GD_D);vox(b.armR,0,-.285,0,.165,.05,.185,GD_D);

    // ---------- cajado-ampulheta (mão esquerda) ----------
    const st=new THREE.Group();b.handL.add(st);
    vox(st,0,.1,0,.05,.95,.05,0x24201a);                        // haste
    vox(st,0,-.36,0,.06,.07,.06,GD_D);                          // contrapeso
    for(const y of [.16,.3])vox(st,0,y,0,.06,.025,.06,GD);      // anéis
    // moldura da ampulheta
    vox(st,0,.56,0,.17,.03,.17,GD);vox(st,0,.9,0,.17,.03,.17,GD);
    vox(st,-.08,.73,0,.03,.3,.03,GD);vox(st,.08,.73,0,.03,.3,.03,GD);
    // bulbos de vidro
    vox(st,0,.63,0,.15,.1,.15,GLASS);vox(st,0,.7,0,.09,.05,.09,GLASS);
    vox(st,0,.83,0,.15,.1,.15,GLASS);vox(st,0,.76,0,.09,.05,.09,GLASS);
    // areia esmeralda (pilha embaixo, grão em cima e fio caindo)
    vox(st,0,.6,0,.1,.025,.1,EW,1.1);
    vox(st,0,.85,0,.075,.03,.075,EW,.9);
    vox(st,0,.73,0,.012,.06,.012,EW,1.3);
    vox(st,0,.93,0,.06,.04,.06,EW,1.2);                         // brilho no topo
    b.keep.push({g:st,arm:b.armL,lean:-.14,leanX:.4});
};
