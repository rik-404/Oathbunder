// Herói: mago — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).mago=function(b,P,vox,makeBow,boxGeo){

    // chapéu pontudo em cone, com aba larga, faixa dourada e ponta cristalina
    vox(b.head,0,.185,0,.56,.05,.56,P.hat);          // aba larga
    vox(b.head,0,.225,0,.5,.045,.5,P.trim,.35);       // faixa dourada
    vox(b.head,0,.3,-.005,.36,.12,.36,P.hat);
    vox(b.head,0,.41,-.02,.26,.12,.26,P.hat);
    vox(b.head,0,.52,-.05,.18,.11,.18,P.hat);
    vox(b.head,0,.61,-.085,.11,.09,.11,P.hat);
    vox(b.head,0,.68,-.115,.07,.07,.07,P.hat);
    vox(b.head,0,.735,-.14,.14,.05,.14,P.trim,.5);    // enfeite dourado
    vox(b.head,0,.78,-.155,.07,.07,.07,0x9f7bff,1.4); // cristal no topo
    // olhos arcanos brilhando + sobrancelhas
    vox(b.head,-.08,.02,.172,.06,.05,.012,0x9f7bff,1.3);vox(b.head,.08,.02,.172,.06,.05,.012,0x9f7bff,1.3);
    vox(b.head,-.08,.085,.173,.07,.02,.01,0xe9e4dc);vox(b.head,.08,.085,.173,.07,.02,.01,0xe9e4dc);
    // barba longa em camadas
    vox(b.head,0,-.1,.15,.27,.1,.07,0xeae3d2);vox(b.head,0,-.185,.145,.22,.09,.06,0xdfd7c4);
    vox(b.head,0,-.26,.14,.16,.08,.055,0xeae3d2);vox(b.head,0,-.33,.135,.1,.08,.05,0xdfd7c4);
    // bigode
    vox(b.head,-.06,-.03,.173,.08,.03,.02,0xeae3d2);vox(b.head,.06,-.03,.173,.08,.03,.02,0xeae3d2);
    // túnica: manto, gola, cinto e barra, com estrelas
    vox(b.torso,0,-.12,0,.5,.3,.34,P.body);
    vox(b.torso,0,.27,0,.52,.12,.33,P.body);          // manto nos ombros
    vox(b.torso,0,.325,0,.56,.05,.37,P.trim);         // gola dourada
    vox(b.torso,0,-.015,0,.54,.06,.38,P.trim);        // cinto
    vox(b.torso,0,-.015,.18,.07,.07,.025,P.trim,.5);  // fivela
    vox(b.torso,0,-.27,0,.52,.06,.37,P.trim);         // barra inferior
    vox(b.torso,-.13,-.1,.172,.05,.05,.012,P.trim,.5);vox(b.torso,.11,-.17,.172,.04,.04,.012,P.trim,.5); // estrelas
    vox(b.torso,-.4,.16,.04,.09,.09,.09,0x9f7bff,1.2);vox(b.torso,.4,.25,-.03,.07,.07,.07,0xcbb6ff,1.2); // cristais arcanos flutuantes
    // cajado com garra dourada segurando um cristal flutuante
    const st=new THREE.Group();b.handR.add(st);
    vox(st,0,.14,0,.055,1,.055,0x5a3d24);             // haste
    vox(st,0,-.31,0,.07,.1,.07,0x4a3018);             // ponteira
    vox(st,0,.63,0,.15,.08,.15,P.trim);               // garra (base)
    vox(st,-.075,.7,0,.03,.15,.03,P.trim);vox(st,.075,.7,0,.03,.15,.03,P.trim);
    vox(st,0,.7,.075,.03,.15,.03,P.trim);vox(st,0,.7,-.075,.03,.15,.03,P.trim);
    vox(st,0,.8,0,.15,.15,.15,0x9f7bff,1.3);          // cristal
    vox(st,0,.9,0,.08,.1,.08,0xcbb6ff,1.5);           // brilho do cristal
    b.keep.push({g:st,arm:b.armR,lean:-.18,leanX:.6});
};
