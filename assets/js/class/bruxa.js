/* ================= CLASSE: BRUXA ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.bruxa = {
  nome: 'Morgana',
  role: 'Lança feitiços com a varinha e voa na vassoura durante o dash.',
  ui: '#b98cff',
  hp: 68,
  armor: 0,
  speed: 4.8,
  weaponId: 'bruxa_wand',
  passiveId: 'bruxa_pocao',
  pal: {
    body: 0x49305f,
    trim: 0xe6bf61,
    skin: 0xe6b894,
    legs: 0x2c203a,
    hat: 0x301c48,
    boots: 0x21172c,
    arm: 0x62447e,
    eye: 0x45a879
  },
  stats: { Vida: 3, Dano: 4, Veloc: 3, Alcance: 4 }
};

/* Modelo voxel da Bruxa; a vassoura aparece apenas durante o voo do dash. */
window.CLASSES.bruxa.model = function(b, P, vox) {
  const PLUM=0x352047, PLUM2=0x57356f, LILAC=0xc29aff, MINT=0x78d990;
  const SK=P.skin, GOLD=P.trim, HAT=P.hat, ROBE=P.body, DARK=0x21162d;

  // Chapéu pontudo, curvado para o lado, com faixa dourada e fivela verde.
  vox(b.head,0,.185,0,.64,.035,.58,DARK);
  vox(b.head,0,.205,0,.60,.045,.54,HAT);
  vox(b.head,0,.245,0,.43,.065,.40,HAT);
  vox(b.head,0,.305,-.015,.34,.12,.32,HAT);
  vox(b.head,.035,.405,-.035,.25,.12,.25,HAT);
  vox(b.head,.105,.49,-.08,.18,.10,.19,HAT);
  vox(b.head,.19,.535,-.14,.13,.075,.16,PLUM);
  vox(b.head,.238,.575,-.17,.08,.055,.10,PLUM2);
  vox(b.head,0,.275,.19,.48,.035,.025,GOLD);
  vox(b.head,.07,.28,.211,.075,.07,.02,MINT,.35);

  // Cabelos em blocos laterais e atrás, olhos verdes e nariz pequeno.
  vox(b.head,0,-.07,-.185,.23,.28,.035,PLUM);
  vox(b.head,-.18,-.10,-.02,.045,.28,.20,PLUM2);
  vox(b.head,.18,-.10,-.02,.045,.28,.20,PLUM2);
  vox(b.head,-.14,-.18,.015,.07,.23,.13,PLUM);
  vox(b.head,.14,-.18,.015,.07,.23,.13,PLUM);
  vox(b.head,-.08,.02,.178,.07,.04,.014,DARK);
  vox(b.head,.08,.02,.178,.07,.04,.014,DARK);
  vox(b.head,-.08,.02,.189,.027,.027,.01,MINT,.25);
  vox(b.head,.08,.02,.189,.027,.027,.01,MINT,.25);
  vox(b.head,0,-.025,.19,.035,.055,.025,SK);
  vox(b.head,0,-.09,.18,.07,.018,.014,0x8b435d);

  // Gola, corpete, cinto e saia de túnica em camadas pixeladas.
  vox(b.torso,0,.43,0,.34,.08,.30,PLUM);
  vox(b.torso,0,.37,.015,.50,.10,.35,GOLD);
  vox(b.torso,0,.30,0,.49,.25,.34,ROBE);
  vox(b.torso,0,.22,.18,.31,.20,.025,PLUM2);
  vox(b.torso,0,.24,.198,.08,.09,.018,MINT,.3);
  vox(b.torso,0,.24,.21,.035,.12,.018,GOLD,.25);
  vox(b.torso,-.255,-.11,0,.07,.31,.32,HAT);
  vox(b.torso,.255,-.11,0,.07,.31,.32,HAT);
  vox(b.torso,0,-.26,0,.52,.07,.36,PLUM);
  vox(b.torso,0,-.26,.19,.20,.055,.02,GOLD,.2);
  vox(b.torso,-.18,-.20,.17,.035,.12,.02,GOLD,.2);
  vox(b.torso,.18,-.20,.17,.035,.12,.02,GOLD,.2);

  // Mangas com punhos e pequenos detalhes de costura.
  for(const arm of [b.armL,b.armR]){
    vox(arm,0,.005,0,.18,.08,.19,HAT);
    vox(arm,0,-.12,0,.17,.16,.18,ROBE);
    vox(arm,0,-.255,.012,.15,.035,.16,GOLD,.18);
  }
  for(const leg of [b.legL,b.legR]){
    vox(leg,0,-.255,.02,.18,.035,.22,PLUM2);
    vox(leg,0,-.31,.035,.18,.025,.23,GOLD,.15);
  }

  // Varinha curta presa à mão direita, com cristal arcano em três tons.
  const wand=new THREE.Group();wand.name='bruxaWand';b.handR.add(wand);
  vox(wand,0,.10,0,.045,.55,.045,0x684629);
  vox(wand,0,-.16,0,.065,.12,.065,0x4b321e);
  vox(wand,0,.39,0,.085,.08,.085,GOLD,.2);
  vox(wand,0,.48,0,.12,.12,.12,PLUM2,.35);
  vox(wand,0,.50,.06,.07,.07,.025,LILAC,.55);
  vox(wand,-.07,.45,0,.025,.11,.025,GOLD,.2);
  b.keep.push({g:wand,arm:b.armR,lean:-.16,leanX:.48});

  // +Z é a frente da Bruxa: cabo liso para a frente, cerdas agrupadas atrás (-Z).
  const broom=new THREE.Group();broom.name='bruxaBroom';broom.position.set(0,.36,-.015);broom.visible=false;b.root.add(broom);
  vox(broom,0,0,.055,.055,.055,1.1,0x81552e);
  vox(broom,0,0,.45,.055,.055,.36,0x81552e);
  vox(broom,0,.012,-.47,.06,.075,.10,0x5a3b25);
  vox(broom,0,0,-.51,.12,.085,.10,0x694222);
  vox(broom,0,.015,-.58,.07,.13,.08,GOLD);
  const straw=[0xb88942,0x9d6c32,0xd0a34f];
  for(let i=0;i<7;i++){
    const x=(i-3)*.035, y=(i%3-1)*.035, c=straw[i%straw.length];
    vox(broom,x,y,-.68,.035,.035,.24,c);
    if(i%2===0)vox(broom,x*1.1,y-.035,-.79,.03,.03,.13,0x9d6c32);
  }
  vox(broom,0,.07,-.85,.09,.035,.12,0xd0a34f);
  b.broom=broom;
};
