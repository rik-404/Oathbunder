// Herói: future — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).future=function(b,P,vox,makeBow,boxGeo){

    // Viajante do Futuro — doutor no tempo: casaco longo caramelo, terno escuro e parafuso sônico
    const CO=0x8a6a48,CD=0x6b5238;                          // casaco claro/escuro
    // cabelos pretos bagunçados (sem capacete)
    vox(b.head,0,.15,-.02,.4,.16,.4,0x181510);              // topo
    vox(b.head,-.15,.22,-.08,.1,.12,.14,0x241f18);vox(b.head,.14,.19,.02,.11,.13,.12,0x241f18); // tóssos laterais
    vox(b.head,.05,.25,-.16,.11,.1,.14,0x181510);           // tósso para trás
    vox(b.head,-.05,.2,.12,.1,.1,.12,0x241f18);             // franja bagunçada
    // colete escuro sobe até o pescoço (sem faixa no peito) com a gravata por cima
    vox(b.torso,0,.14,.146,.44,.58,.03,0x232b38); // colete até o pescoço, sem mostrar o terno
    vox(b.torso,0,.26,.165,.045,.22,.025,0x3a2430);
    vox(b.torso,0,.36,.168,.06,.06,.03,0x3a2430);
    vox(b.torso,-.13,.3,.168,.04,.03,.02,0xd9a43a);
    // mangas do casaco cobrindo os braços até o pulso
    vox(b.armL,0,-.13,0,.165,.34,.185,CO);
    vox(b.armR,0,-.13,0,.165,.34,.185,CO);
    // ombreiras estreitas (deixam os ombros do terno à vista)
    vox(b.torso,-.215,.3,0,.1,.16,.34,CO);vox(b.torso,.215,.3,0,.1,.16,.34,CO);
    // gola de pé atrás + lapelas em V aberto na frente
    vox(b.torso,0,.34,-.11,.4,.15,.06,CD);
    vox(b.torso,-.115,.27,.145,.09,.28,.04,CO);vox(b.torso,.115,.27,.145,.09,.28,.04,CO);
    vox(b.torso,-.17,.08,.148,.06,.38,.035,CO);vox(b.torso,.17,.08,.148,.06,.38,.035,CO);
    // abas longas nas laterais e cauda atrás
    vox(b.torso,-.245,0,0,.09,.55,.3,CO);vox(b.torso,.245,0,0,.09,.55,.3,CO);
    // caudas gêmeas embaixo das costas (abertura clássica de sobretudo)
    vox(b.torso,-.145,-.10,-.155,.2,.42,.05,CD);vox(b.torso,.145,-.10,-.155,.2,.42,.05,CD);
    // parafuso sônico na mão direita: prata + mármore branco, anéis dourados, ponta energética
    const sd=new THREE.Group();sd.position.set(0,-.01,.05);b.handR.add(sd);
    vox(sd,0,0,-.11,.045,.05,.14,0x23252b);                  // empunhadura
    vox(sd,0,0,0,.05,.06,.09,0xd9a43a);                      // anel dourado
    vox(sd,0,0,.11,.045,.052,.16,0xe8e9ec);                  // seção em mármore branco
    vox(sd,0,0,.215,.05,.06,.06,0xd9a43a);                   // anel dourado
    vox(sd,0,0,.32,.05,.052,.15,0xcfd4da);                   // haste prata
    vox(sd,0,0,.42,.032,.034,.08,0xeef1f4);                  // bico
    vox(sd,0,0,.49,.018,.02,.05,0x3bf0d0,1.6);               // ponta energética
};
