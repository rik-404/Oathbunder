// Herói: arqueiro (Oliver) — modelo voxel adaptado da skin de MC (archer.png).
// Capuz verde-musgo, tira de couro na testa, máscara cinza na boca, túnica com
// painel cinza no peito e barra larga, braçadeiras de couro e aljava nas costas.
// Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).arqueiro=function(b,P,vox,makeBow,boxGeo){

    // paleta da skin
    const HG=0x155343,HD=0x114236,HL=0x1a6151;      // capuz: base/sombra/luz
    const TB=0x275447,TD=0x18372c;                 // túnica: base/base escura
    const GP=0x262828,BT=0x221812,BU=0x5d544d;      // painel cinza / cinto / metal
    const ST=0x4a2e1d,LT=0x2c231d,LB=0x3c3029;      // couro: tira clara / escura / média
    const SKD=0xcfa578,EY=0x9be36a;                 // pele sombreada / olhos brilhando (assinatura da classe)

    // capuz: cúpula encaixada atrás do rosto, aba saliente na testa e topo
    vox(b.head,0,.05,-.08,.42,.34,.42,HG);          // corpo do capuz (frente recessa à linha do rosto)
    vox(b.head,0,.15,-.04,.44,.1,.44,HL);           // aba do capuz 1cm à frente da testa (sem z-fighting)
    vox(b.head,0,.24,-.04,.2,.1,.3,HL);             // topo do capuz
    // rosto: tira de couro sob a aba, olhos verdes encostados na pele, nariz
    vox(b.head,0,.07,.18,.36,.05,.02,ST);
    vox(b.head,-.07,-.01,.185,.06,.05,.03,EY,.9);vox(b.head,.07,-.01,.185,.06,.05,.03,EY,.9);
    vox(b.head,0,-.08,.18,.04,.07,.04,SKD);
    // máscara cinza na boca + fresta escura + gola verde enrolada no queixo
    vox(b.head,0,-.115,.182,.3,.15,.045,GP);
    vox(b.head,0,-.15,.19,.16,.035,.02,0x0a0908);
    vox(b.head,0,-.21,.15,.32,.07,.08,TB);
    // túnica + capa das costas + gola
    vox(b.torso,0,-.05,0,.44,.2,.28,P.body);
    vox(b.torso,0,.15,-.17,.44,.52,.04,P.cape);vox(b.torso,0,.31,-.02,.5,.08,.33,P.cape);
    // painel cinza no peito com fivela
    vox(b.torso,0,.06,.172,.22,.3,.03,GP);
    vox(b.torso,0,.06,.198,.03,.03,.02,BU);
    // barra larga da túnica sobre as coxas + borda escura (sem z-fighting)
    vox(b.torso,0,-.26,0,.46,.16,.34,P.body);
    vox(b.torso,0,-.32,0,.46,.05,.36,TD);
    // fivela do cinto + gema da classe + bolsa de couro
    vox(b.torso,0,-.1,.168,.06,.05,.02,BU);
    vox(b.torso,-.11,-.1,.17,.045,.045,.02,EY,.7);
    vox(b.torso,-.16,-.17,.14,.09,.11,.06,LB);
    // aljava nas costas com flechas (penas vermelhas, claras e verdes)
    vox(b.torso,.15,.33,-.2,.12,.4,.1,ST);
    vox(b.torso,.15,.45,-.2,.13,.05,.11,LB);
    vox(b.torso,.1,.6,-.21,.03,.15,.03,0xd9c9a8);vox(b.torso,.18,.58,-.21,.03,.15,.03,0xd9c9a8);vox(b.torso,.14,.64,-.21,.03,.15,.03,0xd9c9a8);
    vox(b.torso,.1,.69,-.21,.05,.05,.03,0xd23b2f);vox(b.torso,.18,.67,-.21,.05,.05,.03,0xeeeeee);vox(b.torso,.14,.73,-.21,.05,.05,.03,0x8fbf5a);
    // braçadeiras de couro com anel metálico nos punhos
    vox(b.handL,0,.02,0,.17,.08,.17,LB);vox(b.handR,0,.02,0,.17,.08,.17,LB);
    vox(b.handL,0,-.045,0,.18,.03,.18,BU);vox(b.handR,0,-.045,0,.18,.03,.18,BU);
    // arco na mão esquerda
    const bw=makeBow(b.handL);b.keep.push({g:bw,arm:b.armL});
};
