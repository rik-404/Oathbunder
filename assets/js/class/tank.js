/* ================= CLASSE: TANK ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.tank = {
  nome: 'Brom',
  role: 'Pancada no chão em volta',
  ui: '#6fa8ff',
  hp: 220,
  armor: .25,
  speed: 4.6,
  weaponId: 'guardian_hammer',
  pal: {
    body: 0x5d6672,
    trim: 0x2f5fa8,
    skin: 0xd99b74,
    legs: 0x454b55,
    arm: 0x6d7682
  },
  stats: { Vida: 5, Dano: 2, Veloc: 2, Alcance: 3 }
};

/* ================= MODELO VOXEL (CLASSES.tank.model) =================
 * Mesmo arquivo da classe: stats em window.CLASSES + modelo voxel do herói.
 * game.js buildHero(cls) chama CLASSES[cls].model(b, P, vox, makeBow, boxGeo).
 * =================================================================== */
// Herói: tank (Brom) — modelo voxel.
// Bruto de linha de frente: elmo chifrudo com rosto aberto, ombreiras de aço,
// couraça em camadas, escudo-torre azul e martelo de guerra.
window.CLASSES.tank.model = function (b, P, vox, makeBow, boxGeo) {

  b.root.scale.setScalar(1.15);

  /* ---------------- paleta ---------------- */
  // Aço frio da classe, azul de comando, couro e os detalhes de osso do elmo.
  const S0 = 0x8b95a3, S1 = 0xa9b4c0, S2 = 0x6d7885, S3 = 0x4c5560, S4 = 0x343a43;
  const BLU = 0x2f5fa8, BLUD = 0x1d3d70, BLUL = 0x6fa8ff, BLUE = 0xbfe4ff;
  const LEA = 0x4a3524, LEAD = 0x2f2116, WOOD = 0x3a2a1a;
  const BONE = 0xe4ebf2, BONED = 0xc2cbd5;
  const SKIN = 0xd99b74, SKIND = 0xb87a57;
  const HAIR = 0x3a2a1a, BEARD = 0x4a3322;

  /* ---------------- elmo / rosto ---------------- */
  // Base do crânio: a face fica aberta para Brom parecer um veterano, não uma
  // armadura vazia. O elmo cobre testa, laterais, nuca e queixo.
  vox(b.head, 0, .15, -.02, .42, .22, .40, S0);              // cúpula
  vox(b.head, 0, .255, -.025, .34, .06, .34, S1);             // topo rebitado
  vox(b.head, 0, .285, -.035, .10, .055, .30, BLU);           // crista baixa azul
  vox(b.head, 0, .305, -.045, .065, .035, .22, BLUL, .18);
  vox(b.head, -.195, .02, -.02, .06, .30, .34, S2);          // laterais
  vox(b.head, .195, .02, -.02, .06, .30, .34, S2);
  vox(b.head, -.20, .13, .08, .055, .06, .12, S1);            // dobradiças
  vox(b.head, .20, .13, .08, .055, .06, .12, S1);
  vox(b.head, 0, .115, .19, .40, .065, .045, S0);             // sobrancelha
  vox(b.head, 0, .06, .205, .06, .16, .045, S1);              // guarda nasal
  vox(b.head, 0, .06, .232, .025, .13, .015, S3);
  vox(b.head, -.16, -.01, .17, .06, .19, .045, S2);           // bochechas
  vox(b.head, .16, -.01, .17, .06, .19, .045, S2);
  vox(b.head, 0, -.17, .08, .28, .075, .24, S3);              // nuca/garganta
  vox(b.head, 0, -.205, .10, .30, .045, .22, S1);
  vox(b.head, 0, .02, -.185, .36, .30, .055, S2);             // placa traseira do elmo
  vox(b.head, 0, .17, -.20, .30, .09, .05, S0);
  vox(b.head, 0, -.12, -.198, .26, .09, .04, S3);
  vox(b.head, -.13, .02, -.215, .06, .20, .03, S1);           // reforços traseiros
  vox(b.head, .13, .02, -.215, .06, .20, .03, S1);
  vox(b.head, -.145, -.14, .18, .035, .06, .03, BLU);         // rebites azuis da mandíbula
  vox(b.head, .145, -.14, .18, .035, .06, .03, BLU);
  // rosto: olhos azuis, sobrancelhas grossas e cicatriz
  vox(b.head, -.078, .035, .176, .062, .045, .012, 0x11161c);
  vox(b.head, .078, .035, .176, .062, .045, .012, 0x11161c);
  vox(b.head, -.078, .035, .184, .038, .023, .012, BLUL, .55);
  vox(b.head, .078, .035, .184, .038, .023, .012, BLUL, .55);
  vox(b.head, -.078, .038, .191, .009, .009, .008, BLUE, .9);
  vox(b.head, .078, .038, .191, .009, .009, .008, BLUE, .9);
  vox(b.head, 0, -.03, .19, .035, .075, .035, SKIND);         // nariz
  vox(b.head, 0, .012, .18, .04, .018, .014, SKIND);          // vinco
  vox(b.head, .125, .085, .178, .012, .10, .014, SKIND);      // cicatriz
  vox(b.head, .132, .075, .181, .01, .055, .012, SKIN);
  // barba curta em camadas, bigode e anel de aço
  vox(b.head, 0, -.135, .185, .28, .12, .035, BEARD);
  vox(b.head, 0, -.075, .195, .20, .045, .025, BEARD);
  vox(b.head, -.13, -.12, .16, .07, .11, .035, HAIR);
  vox(b.head, .13, -.12, .16, .07, .11, .035, HAIR);
  vox(b.head, 0, -.205, .19, .10, .08, .035, BEARD);
  vox(b.head, 0, -.245, .192, .055, .035, .02, HAIR);
  vox(b.head, 0, -.255, .20, .045, .022, .015, S1);
  vox(b.head, -.10, -.145, .201, .025, .025, .01, S1);
  vox(b.head, .10, -.145, .201, .025, .025, .01, S1);

  // chifres curvos: base de aço, osso em três segmentos e ponta clara
  for (const s of [-1, 1]) {
    vox(b.head, s * .22, .16, .01, .09, .09, .11, S2);
    vox(b.head, s * .285, .20, .015, .09, .10, .09, BONED);
    vox(b.head, s * .345, .255, .02, .095, .11, .08, BONE);
    vox(b.head, s * .395, .325, .02, .085, .11, .07, BONE);
    vox(b.head, s * .425, .405, .018, .065, .09, .06, BONED);
    vox(b.head, s * .44, .465, .015, .04, .055, .05, BONE);
    vox(b.head, s * .285, .16, .075, .03, .035, .02, BLU);
    vox(b.head, s * .34, .245, .055, .022, .035, .02, S3);
  }

  /* ---------------- tronco ---------------- */
  // Gorjal e couraça de placas sobre a base. O peito é mais largo que o normal
  // para formar a silhueta de parede da classe.
  vox(b.torso, 0, .455, .01, .32, .07, .25, S3);
  vox(b.torso, 0, .44, .14, .34, .035, .04, S1);
  vox(b.torso, 0, .205, .155, .46, .38, .05, S2);
  vox(b.torso, 0, .345, .157, .48, .055, .04, S1);
  vox(b.torso, 0, .115, .158, .40, .035, .04, S3);
  vox(b.torso, 0, .015, .155, .44, .055, .035, S4);
  vox(b.torso, 0, .265, .185, .07, .28, .02, S0);             // quilha central
  vox(b.torso, -.215, .22, .15, .055, .28, .04, S0);
  vox(b.torso, .215, .22, .15, .055, .28, .04, S0);
  vox(b.torso, -.19, .07, .16, .05, .06, .03, S1);            // rebites do peitoral
  vox(b.torso, .19, .07, .16, .05, .06, .03, S1);
  vox(b.torso, -.19, .36, .16, .05, .05, .03, S1);
  vox(b.torso, .19, .36, .16, .05, .05, .03, S1);
  // emblema: torre/escudo azul no centro do peito
  vox(b.torso, 0, .245, .204, .19, .17, .02, BLU);
  vox(b.torso, 0, .245, .214, .13, .11, .016, BLUD);
  vox(b.torso, 0, .245, .223, .07, .07, .012, BLUL);
  vox(b.torso, 0, .245, .229, .035, .035, .01, BLUE, .8);
  vox(b.torso, 0, .16, .214, .075, .035, .012, S1);            // base do emblema
  // cinto grosso, fivela e bolsa lateral
  vox(b.torso, 0, .015, .01, .52, .085, .33, LEA);
  vox(b.torso, 0, .015, .18, .12, .09, .035, S0);
  vox(b.torso, 0, .02, .203, .065, .055, .025, BLU);
  vox(b.torso, 0, .02, .218, .028, .028, .012, BLUE, .55);
  vox(b.torso, -.235, -.005, .15, .06, .10, .06, LEAD);
  vox(b.torso, -.235, -.005, .185, .03, .03, .015, S1);
  // tassets e saia de malha
  for (const s of [-1, 0, 1]) {
    const x = s * .155;
    vox(b.torso, x, -.085, .155, .145, .19, .045, S2);
    vox(b.torso, x, -.13, .178, .15, .035, .03, S1);
    vox(b.torso, x, -.08, .184, .055, .055, .02, BLU);
  }
  vox(b.torso, 0, -.16, .12, .40, .20, .22, S4);
  for (const x of [-.15, -.05, .05, .15]) vox(b.torso, x, -.15, .16, .06, .18, .035, S3);
  vox(b.torso, -.245, -.10, .10, .06, .17, .16, S3);
  vox(b.torso, .245, -.10, .10, .06, .17, .16, S3);
  // cinta de couro e a corrente de ombro
  vox(b.torso, -.22, .34, .15, .035, .15, .025, LEA);
  vox(b.torso, .22, .34, .15, .035, .15, .025, LEA);
  vox(b.torso, 0, .33, .155, .36, .028, .03, LEA);
  for (const x of [-.15, -.05, .05, .15]) vox(b.torso, x, .33, .175, .045, .04, .015, S1);

  /* ---------------- ombreiras ---------------- */
  for (const s of [-1, 1]) {
    const x = s * .36;
    vox(b.torso, x, .43, 0, .31, .17, .37, S0);
    vox(b.torso, x, .53, 0, .34, .06, .40, S1);
    vox(b.torso, x, .40, 0, .27, .09, .33, S2);
    vox(b.torso, x, .36, 0, .29, .045, .35, S3);
    vox(b.torso, x, .50, .19, .07, .055, .025, BLU);
    vox(b.torso, x, .50, -.19, .07, .055, .025, BLU);
    vox(b.torso, x, .41, .19, .06, .06, .03, BLUL);
    vox(b.torso, x, .45, -.155, .11, .11, .05, S3);
    vox(b.torso, x, .49, -.155, .055, .055, .025, S1);
    // espigão curto na borda externa
    vox(b.torso, s * .50, .43, .0, .075, .09, .075, S1);
    vox(b.torso, s * .545, .43, .0, .045, .055, .045, S2);
    // tira de couro sob a ombreira
    vox(b.torso, s * .30, .30, 0, .06, .12, .30, LEAD);
  }

  /* ---------------- braços ---------------- */
  for (const [a, h, s] of [[b.armL, b.handL, -1], [b.armR, b.handR, 1]]) {
    vox(a, 0, -.07, 0, .19, .21, .19, S2);                    // bíceps
    vox(a, 0, -.16, 0, .17, .045, .18, S1);                   // bisel
    vox(a, 0, -.24, 0, .19, .11, .19, S0);                    // cotovelo
    vox(a, 0, -.285, 0, .20, .04, .20, S4);
    vox(a, 0, -.34, 0, .17, .13, .17, S1);                    // vambrace
    vox(a, 0, -.40, 0, .18, .04, .18, S3);
    vox(a, 0, -.34, .095, .07, .07, .025, BLU);
    vox(a, 0, -.23, .09, .035, .035, .02, S1);
    vox(h, 0, .012, 0, .17, .10, .18, LEAD);                  // manopla
    vox(h, 0, -.038, .01, .18, .04, .19, S2);
    vox(h, 0, -.002, .095, .04, .04, .025, S1);
    vox(h, 0, -.055, .105, .09, .03, .025, S3);
    if (s < 0) { vox(h, 0, -.02, .12, .11, .03, .015, BLU); }       // reforço da mão do escudo
  }

  /* ---------------- pernas ---------------- */
  for (const lg of [b.legL, b.legR]) {
    vox(lg, 0, -.05, 0, .205, .14, .23, S2);                  // coxa
    vox(lg, 0, -.125, 0, .215, .045, .235, S1);
    vox(lg, 0, -.195, .075, .195, .075, .09, S0);             // joelheira
    vox(lg, 0, -.195, .125, .065, .04, .025, BLU);
    vox(lg, 0, -.195, .142, .032, .02, .012, BLUE, .55);
    vox(lg, 0, -.265, 0, .19, .10, .205, S1);                 // greva
    vox(lg, 0, -.30, 0, .20, .04, .22, S4);
    vox(lg, 0, -.342, .02, .215, .065, .245, S0);             // bota
    vox(lg, 0, -.375, .145, .08, .045, .045, S1);             // biqueira
    vox(lg, 0, -.333, .11, .05, .03, .02, S3);
    vox(lg, 0, -.17, .095, .045, .045, .02, BLU);             // rebite do joelho
  }

  /* ---------------- capa curta ---------------- */
  const cape = new THREE.Group(); cape.position.set(0, .38, -.15); b.torso.add(cape); b.cape = cape;
  // cinco tiras largas, barra rasgada, pregas e fechos de aço
  for (const [x, w, h, y] of [[-.19, .115, .50, -.19], [-.09, .12, .57, -.22], [.01, .12, .61, -.235], [.11, .115, .56, -.21], [.21, .10, .48, -.17]]) {
    vox(cape, x, y, -.01, w, h, .04, BLUD);
    vox(cape, x, y - h / 2 + .015, .0, w, .03, .045, BLU);
  }
  for (const x of [-.145, -.045, .055, .155]) vox(cape, x, -.17, -.035, .018, .40, .012, BLU);
  vox(cape, -.11, -.18, -.036, .028, .31, .014, 0x162f55);    // sombras das pregas
  vox(cape, .075, -.19, -.036, .026, .34, .014, 0x162f55);
  vox(cape, 0, -.16, -.038, .045, .38, .012, BLU);            // faixa central
  vox(cape, 0, -.16, -.048, .018, .36, .008, BLUL);
  vox(cape, 0, .075, .005, .43, .06, .05, S3);                // gola da capa
  vox(cape, -.155, .075, .02, .06, .07, .025, S1);            // fechos
  vox(cape, .155, .075, .02, .06, .07, .025, S1);
  vox(cape, 0, .075, -.03, .17, .055, .018, BLU);
  vox(cape, 0, -.03, -.035, .08, .10, .012, BLU);             // emblema nas costas
  vox(cape, 0, -.03, -.046, .045, .06, .008, BLUL);
  vox(cape, -.235, -.30, .0, .035, .14, .03, BLU);
  vox(cape, .255, -.26, .0, .032, .12, .03, BLU);

  /* ---------------- escudo-torre ---------------- */
  const sh = new THREE.Group(); sh.name = 'guardianShield'; sh.position.set(-.05, 0, .235); sh.rotation.y = -.04; b.handL.add(sh); b.shield = sh; b.keep.push({ g: sh, arm: b.armL });
  // corpo em três camadas: aro externo, campo de aço e reforço central
  vox(sh, 0, 0, 0, .66, .88, .09, S3);
  vox(sh, 0, 0, .032, .58, .80, .06, S1);
  vox(sh, 0, 0, .066, .50, .72, .025, S2);
  vox(sh, 0, .405, 0, .68, .09, .11, S0);
  vox(sh, 0, -.405, 0, .68, .09, .11, S0);
  vox(sh, -.30, 0, 0, .08, .88, .11, S0);
  vox(sh, .30, 0, 0, .08, .88, .11, S0);
  vox(sh, 0, .455, .0, .10, .05, .12, S1);                    // pinázio superior
  vox(sh, 0, -.455, .0, .13, .045, .12, S1);                  // ponteira inferior
  vox(sh, 0, .46, .02, .055, .07, .06, BLU);
  // cruz azul escalonada com pedra central
  vox(sh, 0, .04, .082, .12, .42, .02, BLU);
  vox(sh, 0, .13, .082, .40, .12, .02, BLU);
  vox(sh, 0, .04, .094, .075, .32, .012, BLUD);
  vox(sh, 0, .13, .094, .31, .075, .012, BLUD);
  vox(sh, 0, .13, .101, .22, .05, .012, BLUL);
  vox(sh, 0, .04, .101, .05, .22, .012, BLUL);
  // chefe central e gema
  vox(sh, 0, .13, .112, .20, .20, .035, S3);
  vox(sh, 0, .13, .132, .16, .16, .025, S1);
  vox(sh, 0, .13, .148, .11, .11, .02, BLU);
  vox(sh, 0, .13, .161, .065, .065, .015, BLUL);
  vox(sh, 0, .13, .171, .03, .03, .01, BLUE, .9);
  // rebites e reforços das quinas
  for (const [x, y] of [[-.245, .335], [.245, .335], [-.245, -.08], [.245, -.08], [-.245, -.335], [.245, -.335]]) {
    vox(sh, x, y, .058, .045, .045, .03, S0);
    vox(sh, x, y, .078, .022, .022, .012, S1);
  }
  vox(sh, -.21, -.27, .07, .12, .10, .025, BLU);
  vox(sh, .21, -.27, .07, .12, .10, .025, BLU);
  vox(sh, 0, -.28, .07, .30, .035, .025, S0);
  // presilhas traseiras (dão leitura quando o escudo gira)
  vox(sh, -.16, .01, -.055, .05, .24, .035, LEAD);
  vox(sh, .16, .01, -.055, .05, .24, .035, LEAD);

  /* ---------------- martelo de guerra ---------------- */
  const hm = new THREE.Group(); hm.name = 'guardianHammer'; hm.position.set(.04, -.015, .07); hm.rotation.set(.80 + Math.PI / 9, 0, -.12); b.handR.add(hm); b.hammer = hm;
  // cabo vertical: couro, anilhas de aço e pomo
  vox(hm, 0, .14, 0, .052, .68, .052, WOOD);
  for (const y of [-.13, -.03, .07, .17, .27, .37]) vox(hm, 0, y, 0, .062, .025, .062, LEAD);
  vox(hm, 0, -.235, 0, .07, .055, .07, S2);
  vox(hm, 0, -.275, 0, .085, .035, .085, S1);
  vox(hm, 0, -.30, 0, .045, .025, .045, BLU);
  vox(hm, 0, .47, 0, .075, .12, .075, S3);                    // encaixe da cabeça
  vox(hm, 0, .47, 0, .09, .045, .09, S1);
  // Cabeçote girado no eixo do cabo: a face larga fica alinhada ao golpe descendente.
  const head = new THREE.Group(); head.name = 'guardianHammerHead'; head.position.set(0, .56, 0); head.rotation.y = -Math.PI / 2; hm.add(head); b.hammerHead = head;
  vox(head, 0, 0, 0, .22, .26, .22, S1);
  vox(head, .205, 0, 0, .22, .31, .25, S0);
  vox(head, .33, 0, 0, .065, .25, .19, S2);
  vox(head, .36, 0, 0, .025, .20, .15, S3);
  // Contra-peso e núcleo azul nas duas faces laterais.
  vox(head, -.17, 0, 0, .16, .18, .19, S2);
  vox(head, -.285, 0, 0, .13, .13, .15, S3);
  vox(head, -.37, 0, 0, .055, .055, .08, S1);
  vox(head, 0, 0, .135, .11, .17, .035, BLU);
  vox(head, 0, 0, .158, .065, .11, .02, BLUL);
  vox(head, 0, 0, .171, .03, .05, .012, BLUE, .85);
  vox(head, 0, 0, -.135, .11, .17, .035, BLU);
  vox(head, 0, 0, -.158, .065, .11, .02, BLUL);
  vox(head, 0, 0, -.171, .03, .05, .012, BLUE, .85);
  // Placa ampla e ressaltos azul-aço que deixam claro qual face atinge o chão.
  vox(head, .395, 0, 0, .06, .30, .28, S2);
  vox(head, .43, 0, 0, .025, .27, .25, S1);
  vox(head, .445, 0, 0, .012, .21, .20, BLUD);
  vox(head, .453, 0, 0, .006, .15, .045, BLUL, .35);
  vox(head, .458, 0, 0, .006, .045, .15, BLUL, .35);
  vox(head, .462, 0, 0, .006, .055, .055, BLUE, .85);
  vox(head, .24, .145, 0, .10, .045, .10, S1);                  // rebites do martelo
  vox(head, .24, -.145, 0, .10, .045, .10, S1);
  vox(head, -.24, .075, 0, .06, .04, .06, BLU);
  // tiras de couro cruzadas no cabo, para leitura de arma pesada
  vox(hm, 0, .19, .04, .085, .028, .018, LEAD);
  vox(hm, 0, .10, .04, .085, .028, .018, LEAD);
  vox(hm, 0, .01, .04, .085, .028, .018, LEAD);

  /* ---------------- bolha do Baluarte ---------------- */
  // Esfera facetada: mantém o material/visibilidade que o game.js controla.
  const bub = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2),
    new THREE.MeshBasicMaterial({ color: 0x7fb2ff, transparent: true, opacity: .18, depthWrite: false }));
  bub.scale.set(.64, .79, .64); bub.position.y = .72; bub.visible = false; b.bubble = bub;
  const facets = new THREE.Mesh(new THREE.IcosahedronGeometry(1.025, 1),
    new THREE.MeshBasicMaterial({ color: 0xbfe4ff, transparent: true, opacity: .22, depthWrite: false, wireframe: true }));
  bub.add(facets); b.bubbleFacets = facets;
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.96, 0),
    new THREE.MeshBasicMaterial({ color: 0x2f5fa8, transparent: true, opacity: .10, depthWrite: false, side: THREE.BackSide }));
  bub.add(core); b.bubbleCore = core;
};
