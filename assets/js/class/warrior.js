/* ================= CLASSE: GUERREIRO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.guerreiro = {
  nome: 'Darian',
  role: 'Golpes automáticos em arco',
  ui: '#ff6a55',
  hp: 130,
  armor: .1,
  speed: 5.3,
  atkCd: .62,
  dmg: 26,
  kind: 'melee',
  range: 2.2,
  arc: 2.6,
  knock: 5,
  ab: {
    nome: 'Redemoinho',
    cd: 7,
    desc: 'Gira por 1,5 s cortando tudo em volta.'
  },
  pal: {
    body: 0x2b3942,
    trim: 0x593928,
    skin: 0x8c6d4d,
    legs: 0x595655,
    hat: 0x828c99,
    arm: 0x828c99,
    boots: 0x42251b
  },
  stats: { Vida: 4, Dano: 4, Veloc: 4, Alcance: 2 }
};

/* ================= MODELO VOXEL (CLASSES.guerreiro.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: guerreiro (Darian) — modelo voxel.
// Cavaleiro de aço com elmo fechado, visor em brasa, crista/capa vermelhas,
// couraça em camadas, tassets, guardas de braço/perna e espada longa.
window.CLASSES.guerreiro.model=function(b,P,vox,makeBow,boxGeo){

    // Paleta: aço frio, couro, ouro e o vermelho da classe.
    const HL=0xb8c4ce,HB=0x7f8d9a,HD=0x525c68,Hk=0x343b46,HM=0x9aa7b3;
    const P1=0x2b3942,P2=0x3e5059,P3=0x22303a;
    const LB=0x8c6d4d,Ld=0x593928,Lb=0x42251b;
    const GOLD=0xf2b84b,GOLDD=0xc58a28;
    const RED=0xd23b2f,REDk=0x7a2420,REDl=0xff6a55;
    const EMBER=0xff5a42,STEEL=0xcfdae3;

    /* ---------------- elmo ---------------- */
    // cúpula de aço em camadas, laterais e protetor de nuca
    vox(b.head,0,.09,0,.40,.30,.40,HB);
    vox(b.head,0,.17,-.01,.44,.08,.44,HL);
    vox(b.head,0,.235,-.02,.32,.06,.34,HB);
    vox(b.head,-.20,-.02,.01,.045,.27,.34,HD);
    vox(b.head,.20,-.02,.01,.045,.27,.34,HD);
    vox(b.head,0,.015,.205,.34,.06,.025,0x0d1116);       // fenda do visor
    vox(b.head,-.075,.018,.219,.055,.022,.012,EMBER,.55);  // brasa atrás do visor
    vox(b.head,.075,.018,.219,.055,.022,.012,EMBER,.55);
    vox(b.head,0,.085,.205,.35,.045,.035,HL);             // sobrancelha de aço
    vox(b.head,0,-.04,.213,.055,.15,.045,HB);             // guarda nasal
    vox(b.head,-.145,-.075,.195,.075,.13,.045,HD);        // bochechas
    vox(b.head,.145,-.075,.195,.075,.13,.045,HD);
    vox(b.head,0,-.17,.11,.28,.10,.25,Hk);                 // queixo/bevor
    vox(b.head,0,-.135,.19,.22,.035,.025,GOLDD);          // debrum inferior
    vox(b.head,0,-.12,-.18,.28,.11,.10,HD);                // nuca
    vox(b.head,-.12,-.13,.05,.08,.05,.16,HD);
    vox(b.head,.12,-.13,.05,.08,.05,.16,HD);
    // rebites e dobradiças laterais
    vox(b.head,-.215,.055,.13,.025,.03,.03,GOLD,.15);
    vox(b.head,.215,.055,.13,.025,.03,.03,GOLD,.15);
    vox(b.head,-.218,.10,.03,.025,.06,.06,HL);
    vox(b.head,.218,.10,.03,.025,.06,.06,HL);

    // crista vermelha em pente, presa por base dourada e inclinada para trás
    const plume=new THREE.Group();plume.position.set(0,.255,.015);b.head.add(plume);b.plume=plume;
    vox(b.head,0,.255,.02,.10,.045,.26,GOLDD);
    vox(plume,0,.015,0,.065,.055,.24,REDk);
    vox(plume,0,.065,-.025,.075,.10,.22,RED);
    vox(plume,0,.13,-.06,.058,.095,.18,REDk);
    vox(plume,0,.195,-.095,.045,.075,.14,RED);
    vox(plume,0,.245,-.13,.028,.055,.10,REDl,.12);
    vox(plume,-.035,.10,-.085,.045,.055,.11,RED);
    vox(plume,.035,.075,-.105,.035,.045,.09,REDk);

    /* ---------------- tronco ---------------- */
    // gorjal e couraça em placas sobre a base escura
    vox(b.torso,0,.445,.01,.30,.075,.24,Hk);
    vox(b.torso,0,.435,.125,.32,.035,.045,HL);
    vox(b.torso,-.14,.43,.13,.045,.035,.045,GOLD,.18);
    vox(b.torso,.14,.43,.13,.045,.035,.045,GOLD,.18);
    vox(b.torso,0,.205,.155,.40,.37,.04,P2);
    vox(b.torso,0,.34,.15,.43,.055,.035,HL);
    vox(b.torso,0,.112,.16,.34,.045,.04,HM);
    vox(b.torso,0,.015,.155,.38,.05,.035,Hk);
    vox(b.torso,0,.22,.182,.055,.27,.018,HB);
    vox(b.torso,-.185,.20,.155,.055,.25,.035,HD);
    vox(b.torso,.185,.20,.155,.055,.25,.035,HD);
    // emblema dourado do peitoral: cruz de guerra com joia central
    vox(b.torso,0,.235,.198,.035,.15,.018,GOLD);
    vox(b.torso,0,.255,.198,.13,.035,.018,GOLD);
    vox(b.torso,0,.235,.199,.075,.045,.02,GOLDD);
    vox(b.torso,0,.235,.209,.026,.026,.008,0xf8d477,.35);
    vox(b.torso,-.075,.31,.17,.035,.035,.018,GOLD,.18);
    vox(b.torso,.075,.31,.17,.035,.035,.018,GOLD,.18);
    // cinto, fivela e tassets
    vox(b.torso,0,.018,0,.48,.075,.32,Ld);
    vox(b.torso,0,.018,.17,.09,.065,.03,GOLD);
    vox(b.torso,0,.018,.188,.04,.03,.015,GOLDD);
    for(const s of [-1,1]){
      vox(b.torso,s*.16,-.095,.148,.15,.18,.04,P2);
      vox(b.torso,s*.16,-.188,.153,.15,.035,.04,HL);
      vox(b.torso,s*.16,-.01,.158,.065,.065,.02,GOLD,.18);
      vox(b.torso,s*.225,-.08,.10,.055,.14,.16,HD);
    }
    // aba vermelha central com debrum dourado
    vox(b.torso,0,-.16,.158,.15,.35,.025,REDk);
    vox(b.torso,0,-.335,.166,.16,.035,.03,GOLDD);
    vox(b.torso,0,.005,.155,.17,.035,.03,RED);
    vox(b.torso,0,-.16,.172,.022,.33,.012,REDl,.08);

    // placas de couro/malha nas laterais e cinta de couro transversal
    vox(b.torso,0,-.055,.135,.34,.06,.025,Hk);
    vox(b.torso,-.20,.17,.05,.035,.30,.035,Lb);
    vox(b.torso,.20,.17,.05,.035,.30,.035,Lb);
    vox(b.torso,0,.22,-.16,.38,.32,.025,P1);
    vox(b.torso,0,.36,-.17,.42,.04,.025,Hk);

    /* ---------------- capa ---------------- */
    const cape=new THREE.Group();cape.position.set(0,.38,-.145);b.torso.add(cape);b.cape=cape;
    // manto em tiras verticais, barra irregular, pregas e fechos de ombro
    vox(cape,-.19,-.16,-.012,.105,.47,.035,REDk);
    vox(cape,-.085,-.20,0,.11,.55,.04,REDk);
    vox(cape,.02,-.22,.006,.105,.59,.04,REDk);
    vox(cape,.125,-.19,0,.105,.53,.04,REDk);
    vox(cape,.23,-.15,-.012,.09,.45,.035,REDk);
    vox(cape,-.19,-.395,-.005,.105,.03,.038,RED);
    vox(cape,-.085,-.475,.002,.11,.035,.042,RED);
    vox(cape,.02,-.515,.008,.105,.035,.042,RED);
    vox(cape,.125,-.455,.002,.105,.035,.042,RED);
    vox(cape,.23,-.375,-.005,.09,.03,.038,RED);
    for(const x of [-.145,-.04,.075,.18])vox(cape,x,-.18,-.026,.018,.36,.012,RED);
    vox(cape,0,.075,.005,.42,.055,.045,RED);
    vox(cape,-.15,.075,.016,.06,.07,.022,GOLD);
    vox(cape,.15,.075,.016,.06,.07,.022,GOLD);
    vox(cape,0,.075,-.026,.045,.045,.018,GOLDD);
    vox(cape,0,-.085,-.026,.075,.085,.012,GOLDD);
    vox(cape,0,-.085,-.035,.035,.045,.008,GOLD);
    vox(cape,-.235,-.30,.012,.035,.14,.025,RED);
    vox(cape,.265,-.26,.012,.03,.12,.025,RED);

    /* ---------------- braços ---------------- */
    for(const [a,h,s] of [[b.armL,b.handL,-1],[b.armR,b.handR,1]]){
      vox(a,0,-.075,0,.18,.20,.18,HD);              // braçal superior
      vox(a,0,-.155,0,.16,.045,.17,HL);              // bisel
      vox(a,0,-.235,0,.17,.10,.17,P2);               // cotoveleira
      vox(a,0,-.275,0,.18,.035,.18,Hk);
      vox(a,0,-.335,0,.16,.13,.16,HB);               // vambrace
      vox(a,0,-.39,0,.17,.035,.17,HL);
      vox(a,s*.065,-.20,.085,.035,.035,.02,GOLD,.18);
      vox(h,0,.012,0,.155,.09,.17,Ld);               // manopla
      vox(h,0,-.035,.01,.16,.035,.18,HB);
      vox(h,0,-.002,.092,.035,.035,.018,GOLD,.16);
      vox(h,0,-.05,.10,.08,.025,.02,Hk);
    }

    /* ---------------- pernas ---------------- */
    for(const lg of [b.legL,b.legR]){
      vox(lg,0,-.055,0,.18,.13,.20,HD);              // coxa
      vox(lg,0,-.125,0,.19,.04,.205,HL);             // bisel
      vox(lg,0,-.19,.065,.18,.065,.07,HB);            // joelheira
      vox(lg,0,-.19,.112,.05,.035,.02,GOLD,.18);
      vox(lg,0,-.255,0,.17,.09,.19,P2);               // greva
      vox(lg,0,-.287,0,.18,.035,.20,Hk);              // tira
      vox(lg,0,-.322,.02,.19,.055,.225,HD);           // bota de aço
      vox(lg,0,-.35,.135,.06,.035,.04,HL);            // biqueira
      vox(lg,0,-.155,.09,.045,.045,.02,GOLD,.12);
    }

    /* ---------------- espada longa ---------------- */
    const sw=new THREE.Group();b.handR.add(sw);b.sword=sw;
    sw.position.set(0,-.035,.05);
    // punho de couro, pomo e guarda
    vox(sw,0,-.085,0,.058,.18,.058,Ld);
    vox(sw,0,-.085,0,.066,.018,.066,Lb);
    vox(sw,0,-.18,0,.075,.045,.075,GOLDD);
    vox(sw,0,-.207,0,.05,.022,.05,GOLD,.15);
    vox(sw,0,.135,0,.34,.055,.08,HB);
    vox(sw,-.17,.135,0,.055,.05,.09,HL);
    vox(sw,.17,.135,0,.055,.05,.09,HL);
    vox(sw,0,.135,0,.07,.06,.085,GOLD,.12);
    vox(sw,0,.17,0,.04,.025,.05,GOLDD);
    // lâmina: fio claro, bisel e canaleta central
    vox(sw,0,.50,0,.10,.68,.035,STEEL);
    vox(sw,-.052,.50,0,.022,.68,.04,0xaebac6);
    vox(sw,.052,.50,0,.022,.68,.04,0xaebac6);
    vox(sw,0,.50,.022,.026,.62,.012,0x9aa8b6);
    vox(sw,0,.86,0,.078,.07,.03,0xeaf2f8);
    vox(sw,0,.915,0,.045,.04,.025,0xffffff);
    vox(sw,0,.935,0,.018,.018,.018,0xffffff,.2);
};
