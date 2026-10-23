// Herói: guerreiro (Darian) — modelo voxel adaptado da skin de MC (warrior.png, 64x64).
// Armadura de aço: elmo fechado com fenda de visor, peitoral chapa escura com
// bordas biseladas, ombreiras com rebite, luvas e botas de couro. Crista e capa
// vermelhas mantidas como assinatura da classe. Espada na mão direita.
// Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).guerreiro=function(b,P,vox,makeBow,boxGeo){

    // paleta da skin (aço + couro)
    const HL=0xbcc5cc,HB=0x828c99,HD=0x656b78,Hk=0x454a57,HM=0x9ba7b2;
    const P1=0x2b3942,P2=0x3e5059;                 // peitoral: base escura/chapa média
    const LB=0x8c6d4d,Ld=0x593928;                 // couro: claro/escuro
    const GOLD=0xf2b84b;                           // emblema/clasp dourados
    const RED=0xd23b2f,REDk=0x7a2420;              // assinatura: crista e capa

    // elmo de aço fechado: cúpula com bisel claro no topo, laterais sombreadas, fenda do visor e queixo
    vox(b.head,0,.1,0,.4,.3,.4,HB);vox(b.head,0,.17,0,.44,.1,.44,HL);
    vox(b.head,-.19,-.02,.02,.05,.26,.34,HD);vox(b.head,.19,-.02,.02,.05,.26,.34,HD);
    vox(b.head,0,-.04,.2,.3,.05,.02,0x15181c);vox(b.head,0,-.12,.19,.22,.1,.04,HD);
    // crista vermelha (assinatura da classe)
    vox(b.head,0,.26,-.02,.05,.12,.32,REDk);vox(b.head,0,.33,-.05,.05,.07,.28,RED);
    // ombreiras de aço: placa + bisel claro + rebite escuro
    vox(b.torso,-.32,.44,0,.24,.14,.28,HB);vox(b.torso,.32,.44,0,.24,.14,.28,HB);
    vox(b.torso,-.32,.52,0,.26,.04,.3,HL);vox(b.torso,.32,.52,0,.26,.04,.3,HL);
    vox(b.torso,-.32,.38,0,.09,.04,.1,Hk);vox(b.torso,.32,.38,0,.09,.04,.1,Hk);
    // peitoral: coluna chapa média sobre a base escura + borda superior escura + borda inferior biselada
    vox(b.torso,0,.08,.155,.3,.56,.03,P2);
    vox(b.torso,0,.32,.15,.44,.05,.03,Hk);
    vox(b.torso,0,-.1,.15,.44,.05,.03,HM);
    // emblema dourado + fivela de aço no cinto de couro
    vox(b.torso,0,.1,.165,.12,.16,.02,GOLD);
    vox(b.torso,0,-.02,.168,.07,.07,.02,HL);
    // tabardo vermelho nas costas + capa fluindo + clasp dourado
    vox(b.torso,0,.1,-.15,.42,.46,.03,REDk);
    vox(b.torso,0,-.04,-.21,.44,.58,.04,REDk);vox(b.torso,0,.32,-.2,.34,.08,.05,0x9c2f2a);
    vox(b.torso,-.16,.34,-.19,.06,.06,.04,GOLD,.2);vox(b.torso,.16,.34,-.19,.06,.06,.04,GOLD,.2);
    // espada (punho, pomo, guarda, lâmina com canaleta)
    const sw=new THREE.Group();sw.rotation.x=Math.PI/2;b.handR.add(sw);
    vox(sw,0,0,0,.07,.16,.07,Ld);vox(sw,0,.08,0,.09,.05,.09,P.trim);
    vox(sw,0,.17,0,.34,.06,.09,P.trim);vox(sw,0,.5,0,.1,.66,.03,0xe4ebf2);
    vox(sw,0,.5,0,.035,.66,.035,0xaab4bf);vox(sw,0,.86,0,.055,.08,.03,0xe4ebf2);
};
