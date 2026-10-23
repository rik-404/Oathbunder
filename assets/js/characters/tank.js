// Herói: tank — modelo voxel. Registrado em window.CHARACTERS (dispatch em game.js buildHero).
(window.CHARACTERS=window.CHARACTERS||{}).tank=function(b,P,vox,makeBow,boxGeo){

    b.root.scale.setScalar(1.15);const S=0x8b95a3,St=0x6d7682;
    // elmo pesado com aba, fenda azul brilhando, crista e chifres
    vox(b.head,0,.02,0,.42,.42,.42,S);vox(b.head,0,.2,0,.46,.08,.46,St);
    vox(b.head,0,.04,.205,.3,.06,.02,0x2f5fa8,.6);vox(b.head,0,.26,0,.07,.1,.4,0x2f5fa8);
    vox(b.head,-.22,.12,0,.06,.12,.1,0xe4ebf2);vox(b.head,.22,.12,0,.06,.12,.1,0xe4ebf2);
    // ombreiras enormes com rebites + peitoral grosso + emblema + cinto
    vox(b.torso,-.36,.44,0,.3,.2,.34,S);vox(b.torso,.36,.44,0,.3,.2,.34,S);
    vox(b.torso,-.36,.44,.15,.08,.08,.04,P.trim,.3);vox(b.torso,.36,.44,.15,.08,.08,.04,P.trim,.3);
    vox(b.torso,0,.24,.15,.44,.4,.05,S);vox(b.torso,0,.24,.18,.16,.16,.02,P.trim,.3);
    vox(b.torso,0,.22,-.15,.44,.42,.04,St);vox(b.torso,0,.02,0,.52,.07,.34,0x3a4048);
    // escudo-torre grande com cruz azul
    const sh=new THREE.Group();sh.position.set(-.05,.08,.24);b.handL.add(sh); // mais à frente: não cruza o corpo com o braço baixado
    vox(sh,0,0,0,.58,.78,.08,S);vox(sh,0,0,.045,.46,.66,.02,St);
    vox(sh,0,0,.06,.1,.5,.02,P.trim);vox(sh,0,.08,.06,.34,.1,.02,P.trim);
    vox(sh,0,.4,0,.6,.06,.1,St);vox(sh,0,-.38,0,.6,.06,.1,St);vox(sh,0,-.44,0,.12,.08,.1,0xe4ebf2);
    vox(sh,0,0,.07,.2,.2,.03,P.trim);vox(sh,0,0,.085,.14,.14,.03,0x2f5fa8,.8);vox(sh,0,0,.1,.07,.07,.02,0x9fd0ff,1.2); // gema azul central
    b.keep.push({g:sh,arm:b.armL});
    // martelo de guerra
    const hm=new THREE.Group();hm.rotation.x=Math.PI/2;b.handR.add(hm);
    vox(hm,0,.2,0,.07,.64,.07,0x3a2a1a);vox(hm,0,.55,0,.4,.26,.26,0x6d7682);vox(hm,0,.55,0,.42,.08,.28,0x2f5fa8);vox(hm,0,.55,.14,.1,.1,.06,P.trim,.2);
    const bub=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0x7fb2ff,transparent:true,opacity:.18,depthWrite:false}));bub.scale.set(1.2,1.5,1.2);bub.position.y=.7;bub.visible=false;b.bubble=bub;
};
