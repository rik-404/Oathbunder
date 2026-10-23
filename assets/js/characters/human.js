// Herói: human — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).human=function(b,P,vox,makeBow,boxGeo){

    // Zé, o humano — designer Steve: regata verde-azulada, jeans, cabelo e barba castanhos
    const SHD=0x0d8a8a,H2=0x4a2f1e,BE=0x33241a;
    // cabelo chapéu + entradas laterais
    vox(b.head,0,.17,-.02,.37,.09,.39,H2);vox(b.head,0,.1,-.15,.38,.18,.1,H2);
    vox(b.head,-.175,.02,.1,.03,.2,.14,H2);vox(b.head,.175,.02,.1,.03,.2,.14,H2);
    // a barba do Steve (queixo + queixo embaixo)
    vox(b.head,0,-.16,.12,.34,.16,.12,BE);vox(b.head,0,-.22,.06,.3,.08,.12,BE);
    // regata sem mangas: gola escura no topo e pescoço ligando a cabeça
    vox(b.torso,0,.42,0,.45,.05,.29,SHD);vox(b.torso,0,.4,.145,.16,.16,.02,SHD);vox(b.torso,0,.37,0,.14,.2,.14,P.skin);
    // cós do jeans colado na barra da camisa (sem placa flutuando)
    vox(b.torso,0,-.06,0,.40,.12,.29,P.legs);
    // pedra na mão direita (o arsenal) — menor, encaixada na palma
    vox(b.handR,0,-.04,.05,.16,.14,.14,0x8a8a86);vox(b.handR,.04,-.01,.09,.07,.06,.07,0x9a9a94);vox(b.handR,-.04,-.06,.095,.06,.05,.06,0x74746f);
};
