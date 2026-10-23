// Herói: demon — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).demon=function(b,P,vox,makeBow,boxGeo){

    // chifres curvados + topo da cabeça
    vox(b.head,0,.17,0,.36,.06,.36,0x2a0e0e);
    vox(b.head,-.13,.17,-.02,.07,.16,.07,0x1a0808);vox(b.head,.13,.17,-.02,.07,.16,.07,0x1a0808);     // base dos chifres
    vox(b.head,-.16,.27,-.05,.05,.12,.05,0xe8ddc8);vox(b.head,.16,.27,-.05,.05,.12,.05,0xe8ddc8);     // pontas dos chifres
    // olhos laranja em brasa + boca
    vox(b.head,-.08,.02,.173,.06,.05,.012,0xff8a2a,1.5);vox(b.head,.08,.02,.173,.06,.05,.012,0xff8a2a,1.5);
    vox(b.head,0,-.1,.17,.18,.03,.02,0x1a0808);
    // armadura/manto com runas em brasa, capa e gola
    vox(b.torso,0,-.12,0,.5,.32,.34,P.body);
    vox(b.torso,0,.14,-.18,.46,.52,.04,P.cape);vox(b.torso,0,.3,0,.5,.06,.34,P.trim);
    vox(b.torso,0,.06,.18,.06,.16,.02,0xff6a2a,.9);vox(b.torso,-.13,0,.18,.05,.05,.02,0xff6a2a,.7);vox(b.torso,.13,-.06,.18,.05,.05,.02,0xff6a2a,.7); // runas em brasa
    vox(b.torso,0,-.26,0,.52,.06,.37,P.trim);     // barra
    // garras escuras nas mãos
    vox(b.handR,0,-.06,.08,.1,.05,.1,0x1a0808);vox(b.handL,0,-.06,.08,.1,.05,.1,0x1a0808);
    // asas pequenas de morcego nas costas
    vox(b.torso,-.3,.3,-.2,.18,.26,.04,0x2a0e0e);vox(b.torso,.3,.3,-.2,.18,.26,.04,0x2a0e0e);
};
