// Herói: guerreiro — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).guerreiro=function(b,P,vox,makeBow,boxGeo){

    const S=0xb8c0c8,St=0x9aa3ad;
    // elmo com aba, laterais, fenda do visor e queixo
    vox(b.head,0,.1,0,.4,.3,.4,S);vox(b.head,0,.16,0,.44,.1,.44,St);
    vox(b.head,-.19,-.02,.02,.05,.26,.34,S);vox(b.head,.19,-.02,.02,.05,.26,.34,S);
    vox(b.head,0,-.04,.2,.3,.05,.02,0x15181c);vox(b.head,0,-.12,.19,.22,.1,.04,St);
    // crista vermelha
    vox(b.head,0,.26,-.02,.05,.14,.34,0x7a2420);vox(b.head,0,.33,-.05,.05,.08,.3,0xd23b2f);
    // ombreiras com rebite dourado
    vox(b.torso,-.32,.44,0,.24,.14,.28,S);vox(b.torso,.32,.44,0,.24,.14,.28,S);
    vox(b.torso,-.32,.52,0,.1,.04,.1,P.trim,.2);vox(b.torso,.32,.52,0,.1,.04,.1,P.trim,.2);
    // peitoral de placas com emblema + tabardo nas costas + cinto
    vox(b.torso,0,.22,.15,.42,.4,.03,S);vox(b.torso,0,.1,.165,.12,.16,.02,0xf2b84b);
    vox(b.torso,0,.1,-.15,.42,.46,.03,0x7a2420);
    vox(b.torso,0,-.02,0,.5,.06,.33,0x3a2a1a);vox(b.torso,0,-.02,.165,.08,.07,.02,P.trim);
    // capa vermelha fluindo nas costas + gola/clasp dourado
    vox(b.torso,0,-.04,-.21,.44,.58,.04,0x7a2420);vox(b.torso,0,.32,-.2,.34,.08,.05,0x9c2f2a);
    vox(b.torso,-.16,.34,-.19,.06,.06,.04,P.trim,.2);vox(b.torso,.16,.34,-.19,.06,.06,.04,P.trim,.2);
    // espada melhorada (punho, pomo, guarda, lâmina com canaleta)
    const sw=new THREE.Group();sw.rotation.x=Math.PI/2;b.handR.add(sw);
    vox(sw,0,0,0,.07,.16,.07,0x3a2a1a);vox(sw,0,.08,0,.09,.05,.09,P.trim);
    vox(sw,0,.17,0,.34,.06,.09,P.trim);vox(sw,0,.5,0,.1,.66,.03,0xe4ebf2);
    vox(sw,0,.5,0,.035,.66,.035,0xaab4bf);vox(sw,0,.86,0,.055,.08,.03,0xe4ebf2);
};
