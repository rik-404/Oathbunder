/* ================= CLASSE: MAGO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.mago = {
  nome: 'Aurelion',
  role: 'Orbes arcanos explosivos; cada 4º é maior',
  ui: '#a58bff',
  hp: 75,
  armor: 0,
  speed: 5,
  weaponId: 'mage_orbs',
  pal: {
    body: 0x5b3fa8,
    trim: 0xf2b84b,
    skin: 0xe8b48a,
    legs: 0x3a2870,
    hat: 0x4a3290,
    boots: 0x2a1d55
  },
  stats: { Vida: 2, Dano: 5, Veloc: 3, Alcance: 4 }
};

/* ================= MODELO VOXEL (CLASSES.mago.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: mago — modelo voxel.
window.CLASSES.mago.model=function(b,P,vox,makeBow,boxGeo){
    // Paleta: roxo arcano, dourado, pele e cristais — as mesmas cores atuais,
    // com alguns tons de sombra/realce dentro da mesma família.
    const BODY=P.body, TRIM=P.trim, SKIN=P.skin, HAT=P.hat;
    const DARK=0x2a1d55;      // sombra do roxo
    const LILAC=0x6b4fc0;     // realce do roxo
    const ARCANE=0x9f7bff, ARCANE2=0xcbb6ff, ARCANE3=0xd9ccff;
    const WHITE=0xe8e6e2, WHITE2=0xd3d1ce;

    /* ---------- chapéu ---------- */
    // aba com sombra, faixa dourada, fivela e ponta torta com cristal
    vox(b.head,0,.165,0,.60,.03,.60,DARK);
    vox(b.head,0,.195,0,.58,.05,.58,HAT);
    for(const sx of [-1,1])for(const sz of [-1,1])vox(b.head,sx*.255,.22,sz*.255,.03,.02,.03,TRIM,.3);
    vox(b.head,0,.237,0,.44,.04,.44,TRIM,.3);
    vox(b.head,0,.245,.225,.085,.06,.018,TRIM,.4);
    vox(b.head,0,.245,.238,.035,.03,.015,ARCANE,.45);
    vox(b.head,0,.31,0,.36,.14,.36,HAT);
    vox(b.head,0,.43,-.005,.28,.12,.28,HAT);
    vox(b.head,0,.54,-.035,.20,.11,.20,HAT);
    vox(b.head,0,.63,-.075,.14,.09,.14,HAT);
    vox(b.head,0,.70,-.105,.09,.07,.09,HAT);
    vox(b.head,0,.745,-.13,.11,.03,.11,TRIM,.45);
    vox(b.head,0,.79,-.145,.075,.08,.075,ARCANE,.55);
    vox(b.head,0,.845,-.16,.035,.05,.035,ARCANE3,.75);

    /* ---------- cabelo, rosto e barba ---------- */
    vox(b.head,-.168,.10,.01,.035,.12,.17,WHITE2);
    vox(b.head,.168,.10,.01,.035,.12,.17,WHITE2);
    // cabelo traseiro em mechas
    vox(b.head,0,.03,-.176,.18,.28,.035,WHITE);
    vox(b.head,-.11,.04,-.171,.08,.22,.035,WHITE2);
    vox(b.head,.11,.04,-.171,.08,.22,.035,WHITE2);
    vox(b.head,0,-.135,-.172,.12,.08,.035,WHITE2);
    vox(b.head,-.045,-.02,-.197,.008,.20,.006,0xb8b5b1);
    vox(b.head,.045,-.02,-.197,.008,.20,.006,0xb8b5b1);
    // órbitas escuras + olhos arcanos + brilho
    vox(b.head,-.08,.02,.172,.082,.058,.012,DARK);
    vox(b.head,.08,.02,.172,.082,.058,.012,DARK);
    vox(b.head,-.08,.02,.179,.048,.032,.012,LILAC,.32);
    vox(b.head,.08,.02,.179,.048,.032,.012,LILAC,.32);
    vox(b.head,-.08,.02,.186,.011,.011,.008,ARCANE3,.65);
    vox(b.head,.08,.02,.186,.011,.011,.008,ARCANE3,.65);
    // sobrancelhas grossas, com pontas caídas
    vox(b.head,-.095,.083,.179,.08,.022,.012,WHITE2);
    vox(b.head,.095,.083,.179,.08,.022,.012,WHITE2);
    vox(b.head,-.14,.072,.179,.025,.02,.012,WHITE2);
    vox(b.head,.14,.072,.179,.025,.02,.012,WHITE2);
    // nariz
    vox(b.head,0,-.005,.19,.055,.06,.035,SKIN);
    // bigode com pontas, à frente da barba
    vox(b.head,-.065,-.028,.194,.09,.032,.022,WHITE);
    vox(b.head,.065,-.028,.194,.09,.032,.022,WHITE);
    vox(b.head,-.115,-.042,.19,.045,.025,.02,WHITE2);
    vox(b.head,.115,-.042,.19,.045,.025,.02,WHITE2);
    // boca discreta entre o bigode e a barba
    vox(b.head,0,-.062,.192,.05,.008,.01,0x4a2a2a);
    // barba longa, mais estreita e em camadas
    vox(b.head,0,-.095,.156,.24,.10,.075,WHITE2);
    vox(b.head,0,-.185,.151,.20,.09,.065,0xc7c4c0);
    vox(b.head,0,-.265,.146,.15,.08,.058,WHITE2);
    vox(b.head,0,-.335,.141,.09,.07,.052,0xc7c4c0);
    vox(b.head,-.032,-.385,.136,.035,.05,.044,WHITE2);
    vox(b.head,.032,-.385,.136,.035,.05,.044,0xc7c4c0);
    vox(b.head,-.128,-.12,.142,.04,.10,.05,WHITE2);
    vox(b.head,.128,-.12,.142,.04,.10,.05,WHITE2);
    vox(b.head,-.10,-.22,.14,.035,.09,.045,WHITE2);
    vox(b.head,.10,-.22,.14,.035,.09,.045,WHITE2);
    // sulcos da barba
    vox(b.head,0,-.13,.196,.012,.10,.006,0xb8b5b1);
    vox(b.head,-.06,-.17,.187,.01,.08,.006,0xb8b5b1);
    vox(b.head,.06,-.17,.187,.01,.08,.006,0xb8b5b1);
    // argola dourada que prende a barba, em relevo
    vox(b.head,0,-.225,.194,.055,.035,.022,TRIM,.35);
    vox(b.head,0,-.225,.207,.022,.022,.012,ARCANE,.5);

    /* ---------- gola, manto e capa ---------- */
    // gola alta nas costas, emoldurando a cabeça
    vox(b.torso,-.19,.46,-.18,.06,.14,.06,HAT);
    vox(b.torso,.19,.46,-.18,.06,.14,.06,HAT);
    vox(b.torso,-.19,.53,-.18,.08,.025,.07,TRIM,.3);
    vox(b.torso,.19,.53,-.18,.08,.025,.07,TRIM,.3);
    // gola baixa + debrum dourado
    vox(b.torso,0,.31,0,.46,.05,.34,HAT);
    vox(b.torso,0,.34,0,.48,.025,.36,TRIM,.2);
    // manto em duas camadas, com barra dourada e fecho central
    vox(b.torso,0,.285,0,.52,.10,.36,BODY);
    vox(b.torso,0,.225,0,.56,.07,.38,HAT);
    vox(b.torso,0,.185,0,.58,.025,.40,TRIM,.2);
    vox(b.torso,0,.27,.19,.075,.075,.02,TRIM,.4);
    vox(b.torso,0,.27,.202,.035,.035,.015,ARCANE,.5);
    vox(b.torso,-.23,.28,.19,.035,.035,.02,TRIM,.3);
    vox(b.torso,.23,.28,.19,.035,.035,.02,TRIM,.3);
    // capa: visível principalmente na câmera de trás
    const cape=new THREE.Group();cape.position.set(0,.24,-.17);b.torso.add(cape);
    vox(cape,0,-.24,0,.30,.48,.035,HAT);
    vox(cape,-.19,-.20,0,.08,.40,.03,HAT);
    vox(cape,.19,-.20,0,.08,.40,.03,HAT);
    // borda escura em vez de mais uma faixa dourada
    vox(cape,0,-.475,0,.32,.025,.04,DARK);
    vox(cape,-.19,-.395,0,.09,.025,.035,DARK);
    vox(cape,.19,-.395,0,.09,.025,.035,DARK);
    // debrum dourado vertical nas laterais da capa
    vox(cape,-.235,-.20,0,.018,.40,.035,TRIM,.2);
    vox(cape,.235,-.20,0,.018,.40,.035,TRIM,.2);
    // dobras de tecido
    vox(cape,-.075,-.22,-.019,.014,.34,.018,DARK);
    vox(cape,.075,-.22,-.019,.014,.34,.018,DARK);
    // estrela arcana nas costas
    vox(cape,0,-.17,-.025,.11,.025,.02,TRIM,.25);
    vox(cape,0,-.17,-.025,.025,.11,.02,TRIM,.25);
    vox(cape,0,-.17,-.038,.035,.035,.015,ARCANE,.45);
    vox(cape,-.17,-.01,.02,.05,.05,.025,TRIM,.3);
    vox(cape,.17,-.01,.02,.05,.05,.025,TRIM,.3);
    b.cape=cape;

    /* ---------- túnica, cinto e saia ---------- */
    vox(b.torso,0,-.12,0,.50,.30,.34,BODY);
    // painel frontal mais claro, entre o manto e o cinto
    vox(b.torso,0,.09,.171,.30,.25,.012,LILAC);
    vox(b.torso,-.16,.09,.178,.02,.24,.01,TRIM,.15);
    vox(b.torso,.16,.09,.178,.02,.24,.01,TRIM,.15);
    // cinto dourado, fivela com gema e bolsa
    vox(b.torso,0,-.015,0,.55,.06,.39,TRIM);
    vox(b.torso,0,-.015,.20,.08,.075,.025,TRIM,.45);
    vox(b.torso,0,-.015,.215,.04,.04,.015,ARCANE,.5);
    vox(b.torso,-.20,-.015,.195,.035,.035,.015,DARK);
    vox(b.torso,.20,-.015,.195,.035,.035,.015,DARK);
    vox(b.torso,.19,-.085,.17,.11,.12,.08,HAT);
    vox(b.torso,.19,-.035,.21,.06,.03,.02,TRIM,.3);
    vox(b.torso,.19,-.085,.211,.02,.05,.01,DARK);
    // corrente com cristal no quadril esquerdo
    vox(b.torso,-.19,-.06,.185,.018,.12,.018,TRIM,.25);
    vox(b.torso,-.19,-.145,.185,.055,.085,.055,ARCANE,.6);
    vox(b.torso,-.19,-.14,.214,.02,.035,.015,ARCANE3,.8);
    // saia acampanhada com abertura frontal
    vox(b.torso,-.255,-.19,0,.06,.16,.34,BODY);
    vox(b.torso,.255,-.19,0,.06,.16,.34,BODY);
    vox(b.torso,0,-.27,0,.52,.05,.37,TRIM);
    vox(b.torso,0,-.19,.172,.09,.14,.012,DARK);
    vox(b.torso,-.065,-.19,.178,.022,.14,.012,TRIM,.2);
    vox(b.torso,.065,-.19,.178,.022,.14,.012,TRIM,.2);
    // brasão estelar no peito + estrelas
    vox(b.torso,0,.10,.19,.12,.025,.02,TRIM,.3);
    vox(b.torso,0,.10,.19,.025,.12,.02,TRIM,.3);
    vox(b.torso,0,.10,.205,.04,.04,.015,ARCANE,.5);
    vox(b.torso,-.15,-.10,.178,.04,.04,.012,TRIM,.3);
    vox(b.torso,.15,-.16,.178,.03,.03,.012,TRIM,.3);
    // cristais flutuantes (giram como pequenos diamantes)
    const c1=vox(b.torso,-.44,.16,.04,.075,.075,.075,ARCANE,.4);c1.rotation.y=Math.PI/4;
    vox(b.torso,-.44,.205,.04,.028,.028,.028,ARCANE3,.65);
    const c2=vox(b.torso,.44,.25,-.03,.06,.06,.06,ARCANE2,.4);c2.rotation.y=Math.PI/4;
    vox(b.torso,.44,.29,-.03,.023,.023,.023,ARCANE3,.65);

    /* ---------- mangas ---------- */
    for(const arm of [b.armL,b.armR]){
        vox(arm,0,.01,0,.17,.07,.19,HAT);           // ombreira
        vox(arm,0,-.16,0,.17,.18,.18,BODY);         // manga ampla
        vox(arm,0,-.255,0,.16,.035,.17,TRIM,.2);    // punho dourado
        vox(arm,0,-.275,0,.14,.015,.15,DARK);       // sombra do punho
    }

    /* ---------- botas ---------- */
    for(const leg of [b.legL,b.legR]){
        vox(leg,0,-.267,.02,.19,.025,.24,TRIM,.15);
        vox(leg,0,-.32,.035,.16,.02,.20,DARK);
    }

    /* ---------- cajado ---------- */
    const st=new THREE.Group();b.handR.add(st);
    // haste de madeira com veio escuro, empunhadura e ponteira
    vox(st,0,.14,0,.055,1,.055,0x5a3d24);
    vox(st,0,.14,.026,.015,1,.015,0x4a3018);
    vox(st,0,.02,0,.075,.18,.075,0x3a2818);
    vox(st,0,.12,0,.08,.025,.08,TRIM,.25);
    vox(st,0,-.08,0,.08,.025,.08,TRIM,.25);
    vox(st,0,-.31,0,.08,.1,.08,TRIM,.2);
    vox(st,0,-.36,0,.06,.035,.06,DARK);
    // coroa: anel, garras e cristal facetado
    vox(st,0,.60,0,.10,.035,.10,TRIM,.25);
    vox(st,0,.64,0,.13,.06,.13,TRIM,.3);
    vox(st,-.065,.71,0,.028,.15,.028,TRIM);
    vox(st,.065,.71,0,.028,.15,.028,TRIM);
    vox(st,0,.71,.065,.028,.15,.028,TRIM);
    vox(st,0,.71,-.065,.028,.15,.028,TRIM);
    vox(st,-.095,.78,0,.022,.08,.022,TRIM,.1);
    vox(st,.095,.78,0,.022,.08,.022,TRIM,.1);
    vox(st,0,.78,.095,.022,.08,.022,TRIM,.1);
    vox(st,0,.78,-.095,.022,.08,.022,TRIM,.1);
    vox(st,0,.72,0,.155,.03,.155,TRIM,.2);
    vox(st,0,.81,0,.11,.11,.11,ARCANE,.55);
    vox(st,0,.81,.06,.055,.065,.018,ARCANE3,.65);
    vox(st,0,.875,0,.06,.06,.06,ARCANE2,.65);
    vox(st,-.12,.78,.02,.03,.05,.03,ARCANE2,.5);
    vox(st,.11,.84,-.03,.025,.045,.025,ARCANE3,.6);
    // pingente lateral
    vox(st,.13,.61,.02,.015,.10,.015,TRIM,.25);
    vox(st,.13,.55,.02,.05,.07,.05,ARCANE,.5);
    // orbe flutuante + anel de motes (giram em animHero/updateMenu)
    const orb=new THREE.Group();orb.position.set(0,1.02,0);st.add(orb);
    vox(orb,0,0,0,.10,.10,.10,ARCANE,.45);
    vox(orb,0,0,.055,.036,.036,.015,0xffffff,.8);
    vox(orb,0,.055,0,.024,.015,.024,0xffffff,.7);
    const motes=new THREE.Group();orb.add(motes);
    for(let i=0;i<4;i++){const a=i*Math.PI/2;vox(motes,Math.sin(a)*.14,0,Math.cos(a)*.14,.02,.02,.02,ARCANE2,.55)}
    b.mageOrb=orb;b.mageMotes=motes;
    b.keep.push({g:st,arm:b.armR,lean:-.18,leanX:.6});
};
