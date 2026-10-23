// Herói: dracula (Vladren) — modelo voxel adaptado da skin de MC (dracula.png, 64x64).
// Cabelo preto com pico da viúva, olhos vermelhos e presas, camisa creme em V sob
// terno preto e sobrecasaca vermelho-sangue com broche prateado e gola alta marmela.
// Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).dracula=function(b,P,vox,makeBow,boxGeo){

    // paleta da skin
    const HK=0x141414;                            // cabelo
    const SKD=0xc07c5c;                           // pele sombreada
    const RED=0xff2a2a;                           // olhos brilhando (o vermelho f60016 da skin)
    const JKT=0x141414;                           // terno preto
    const CR=0x55000a,CRL=0xb2000a,OR=0xfc8e27;   // sobrecasaca: marmela/clara/laranja
    const SH=0xf2e4c2;                            // camisa creme
    const BV=0xd8d8d8,BG=0xdc0011;                // broche prateado + gema vermelha
    const CP=0x1c0507;                            // capa: quase-preto com tom vinho

    // cabelo preto repartido com pico da viúva + costeletas
    vox(b.head,0,.19,-.02,.37,.09,.4,P.hat);vox(b.head,0,.1,-.07,.39,.2,.3,P.hat);
    vox(b.head,0,.04,.175,.07,.1,.02,P.hat);                         // pico da viúva na testa
    vox(b.head,-.15,.04,.09,.05,.24,.22,P.hat);vox(b.head,.15,.04,.09,.05,.24,.22,P.hat); // costeletas
    // sobrancelhas finas, olhos vermelhos, boca escura e presas brancas
    vox(b.head,-.08,.055,.18,.07,.02,.015,HK);vox(b.head,.08,.055,.18,.07,.02,.015,HK);
    vox(b.head,-.08,.02,.173,.06,.05,.012,RED,1.3);vox(b.head,.08,.02,.173,.06,.05,.012,RED,1.3);
    vox(b.head,0,-.125,.172,.09,.03,.015,0x120a0a);
    vox(b.head,-.05,-.15,.175,.028,.055,.02,0xffffff);vox(b.head,.05,-.15,.175,.028,.055,.02,0xffffff); // presas
    // gola alta icônica (marmela) + capa descendo nas costas
    vox(b.torso,-.27,.52,-.06,.07,.36,.16,CR);vox(b.torso,.27,.52,-.06,.07,.36,.16,CR); // erguida (laterais)
    vox(b.torso,0,.5,-.17,.54,.34,.05,CP);                                // parte de trás da gola
    vox(b.torso,0,.08,-.2,.52,.62,.05,CP);                                // capa nas costas
    // camisa creme em V + lapelas pretas do terno
    vox(b.torso,0,.14,.16,.14,.4,.03,SH);
    vox(b.torso,-.11,.16,.175,.08,.4,.03,JKT);vox(b.torso,.11,.16,.175,.08,.4,.03,JKT);
    // sobrecasaca vermelho-sangue: painéis laterais com costura clara
    vox(b.torso,-.165,.02,.17,.07,.5,.03,CR);vox(b.torso,.165,.02,.17,.07,.5,.03,CR);
    vox(b.torso,-.2,.02,.19,.02,.52,.015,CRL);vox(b.torso,.2,.02,.19,.02,.52,.015,CRL);
    // broche prateado com gema vermelha brilhando + losango decorativo abaixo
    vox(b.torso,0,.2,.19,.1,.09,.02,BV);
    vox(b.torso,0,.2,.205,.05,.05,.02,BG,1.0);
    vox(b.torso,0,0,.178,.06,.06,.02,CRL);
    vox(b.torso,0,0,.19,.03,.03,.015,OR,.5);
    // punhos marmela nas mãos
    vox(b.handL,0,.04,0,.18,.05,.18,CR);vox(b.handR,0,.04,0,.18,.05,.18,CR);
};
