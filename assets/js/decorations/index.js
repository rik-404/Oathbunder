/*
 * Sistema visual do Oathbound: geometrias voxel, props e composição ambiental.
 * O motor injeta Three.js e seus helpers; a lógica de combate continua em game.js.
 */
(function(){
  window.DECORATION_MODULE=function({THREE,boxGeo,mergeBoxes,mat,vox,vcMat,rand,randi,TAU,pick}){
    if(!window.TREE_MODULE||!window.CHEST_MODEL)throw new Error('Módulos de árvores e baú precisam ser carregados antes das decorações.');
    function faceBoxGeo(topHex,sideHex,botHex){const g=new THREE.BoxGeometry(1,1,1),n=g.attributes.position.count,a=new Float32Array(n*3);
      const top=new THREE.Color(topHex),side=new THREE.Color(sideHex),bot=new THREE.Color(botHex==null?sideHex:botHex);
      for(let i=0;i<n;i++){const c=(i>=8&&i<12)?top:(i>=12&&i<16)?bot:side;a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}
      g.setAttribute('color',new THREE.Float32BufferAttribute(a,3));return g}

    // Materiais e geometrias do piso e do cenário.
    const grassBlockGeo=faceBoxGeo(0x78a24d,0x5b472f,0x2c2019);
    const dryBlockGeo=faceBoxGeo(0xaaa052,0x695032,0x2c2019);
    const mossBlockGeo=faceBoxGeo(0x537d3a,0x53462d,0x2c2019);
    const dirtBlockGeo=faceBoxGeo(0x98663a,0x644831,0x33251d);
    const TREE_SYSTEM=window.TREE_MODULE(mergeBoxes,THREE),TREE_GEOS=TREE_SYSTEM.geos,treeMat=TREE_SYSTEM.material;
    const ROCK_GEOS=[
      // Pedra de fratura: placas de basalto, uma junta escura e pequenas manchas de líquen.
      mergeBoxes([[0,.14,0,.92,.28,.82,0x4e565a],[-.06,.34,0,.78,.34,.7,0x6e777a],[-.28,.39,.02,.42,.38,.58,0x858d8f],[.25,.36,-.04,.42,.32,.58,0x606a6e],[-.02,.58,-.04,.48,.3,.48,0x929a9b],[.1,.58,.12,.3,.2,.3,0x7c8588],[-.13,.71,-.11,.27,.22,.29,0x697477],[0,.29,.363,.48,.055,.025,0x353e42],[-.19,.18,.416,.22,.045,.025,0x8a6c4c],[.2,.49,.365,.16,.055,.025,0xb1b7b3],[-.26,.68,.02,.22,.06,.19,0x587443],[.25,.66,-.14,.16,.05,.16,0x6b8548]],.09),
      // Seixo largo: tons quentes de calcário, estratos visíveis e musgo nas quinas.
      mergeBoxes([[0,.12,0,.92,.24,.84,0x57564e],[-.04,.29,0,.9,.38,.78,0x77766c],[-.2,.48,-.02,.64,.32,.66,0x969486],[.23,.38,.04,.46,.3,.62,0x6b6a61],[.03,.61,-.02,.42,.2,.44,0xa8a48f],[-.28,.36,-.12,.3,.22,.46,0x888577],[-.05,.25,.407,.48,.055,.025,0xb1a98e],[.18,.18,.423,.21,.045,.025,0x5c5c52],[-.1,.48,.347,.24,.045,.025,0xc0b9a1],[.26,.57,.02,.2,.06,.17,0x71804b],[-.28,.49,.03,.17,.05,.14,0x627545],[.06,.69,-.1,.17,.045,.13,0x8b9850]],.075),
      // Laje quebrada: perfil alto em degraus, veio mineral claro e líquen nas fendas.
      mergeBoxes([[0,.13,0,.86,.26,.8,0x454e52],[.02,.34,0,.72,.34,.68,0x5d686b],[-.19,.52,-.04,.54,.34,.58,0x768184],[.16,.57,-.09,.42,.38,.46,0x899294],[-.02,.77,-.1,.3,.22,.34,0x626e72],[-.29,.33,.09,.3,.22,.52,0x4c585c],[.03,.2,.414,.5,.06,.025,0x3a4448],[-.09,.42,.353,.07,.2,.025,0xc2c6bf],[.18,.64,.154,.055,.17,.025,0xd2d3cb],[-.28,.61,.13,.19,.06,.16,0x557044],[.19,.83,-.1,.13,.05,.12,0x6e8246],[.29,.26,-.1,.17,.05,.16,0x747a70]],.085)
    ];
    const DECOR_GEO={
      // Lápide antiga: silhueta em arco, placa gravada, cruz em relevo e musgo nas quinas.
      grave:mergeBoxes([
        [0,.08,0,.62,.16,.34,0x454b50],[0,.43,0,.48,.62,.2,0x697276],[0,.74,0,.48,.16,.2,0x7d8585],[0,.85,0,.38,.12,.19,0x616b70],[0,.92,0,.24,.08,.17,0x848a84],
        [0,.48,.112,.31,.34,.025,0x424a50],[0,.48,.13,.22,.26,.018,0x77736a],[0,.51,.146,.045,.18,.02,0xc0ad7c],[0,.57,.148,.16,.045,.02,0xc0ad7c],
        [-.09,.38,.151,.045,.045,.02,0xe3d5af],[.09,.38,.151,.045,.045,.02,0xe3d5af],[0,.31,.15,.12,.035,.02,0xd2c299],[0,.24,.15,.08,.035,.02,0xaba185],
        [-.24,.72,.07,.12,.055,.1,0x526b42],[.24,.66,-.03,.1,.045,.08,0x627a49],[-.2,.19,.18,.11,.05,.04,0x4f6540]
      ],.045),
      // Cruz memorial de pedra: base encaixada, braços facetados, rebites e um pequeno sigilo.
      cross:mergeBoxes([
        [0,.07,0,.46,.14,.3,0x3d4448],[0,.16,0,.3,.08,.23,0x626a6c],[0,.44,0,.16,.58,.14,0x747c7d],[0,.56,0,.21,.14,.17,0x96968e],
        [0,.61,0,.57,.14,.15,0x747c7e],[0,.66,0,.62,.07,.14,0x9a998e],[0,.84,0,.23,.13,.16,0x687174],[0,.94,0,.12,.09,.13,0xa7a394],
        [0,.38,.076,.055,.2,.018,0x454d51],[0,.57,.09,.15,.045,.02,0xd0b567],[0,.58,.105,.065,.065,.018,0x69b8aa],
        [-.23,.61,.085,.08,.07,.025,0x555f61],[.23,.61,.085,.08,.07,.025,0x555f61],[-.19,.18,.13,.1,.045,.04,0x536b43]
      ],.04),
      // Cogumelos em família: chapéus rubi com pintas, lamelas claras e talos de tamanhos variados.
      shroom:mergeBoxes([
        [0,.16,0,.12,.3,.12,0xe5dcc7],[0,.31,0,.27,.06,.26,0xf0e7d4],[0,.38,0,.43,.14,.42,0x9c2f25],[0,.45,0,.36,.12,.36,0xd84b3a],[0,.514,0,.25,.025,.26,0xe76650],
        [-.12,.516,-.08,.06,.025,.06,0xffdfb2],[.09,.516,-.1,.055,.025,.055,0xffdfb2],[.12,.516,.08,.06,.025,.06,0xffdfb2],[-.09,.516,.11,.05,.025,.05,0xffdfb2],[0,.516,.015,.045,.025,.045,0xf5c99b],
        [-.28,.105,.08,.085,.21,.085,0xe7dfce],[-.28,.21,.08,.2,.045,.2,0xf0e7d4],[-.28,.26,.08,.31,.11,.31,0x9b3028],[-.28,.312,.08,.25,.1,.25,0xe25744],[-.28,.367,.08,.06,.02,.06,0xffdeb0],[.27,.11,-.08,.08,.22,.08,0xddd3bf],
        [.27,.22,-.08,.18,.04,.18,0xf0e7d4],[.27,.27,-.08,.27,.1,.27,0x832a26],[.27,.322,-.08,.22,.09,.22,0xc94337],[.22,.373,-.08,.05,.02,.05,0xffdeb0],[-.12,.32,.205,.12,.025,.025,0xeee2ca]
      ],.035),
      // Fogueira: aro de rochas facetadas, cinza, lenha cruzada e pontos de brasa.
      fire:mergeBoxes([
        [0,.14,.5,.3,.22,.28,0x696c66],[.36,.14,.36,.3,.2,.28,0x817c70],[.5,.14,.02,.28,.23,.3,0x555f61],[.35,.14,-.34,.3,.2,.28,0x77786f],
        [0,.14,-.49,.3,.22,.27,0x626963],[-.36,.14,-.34,.3,.2,.28,0x8a8579],[-.5,.14,.02,.28,.23,.3,0x606966],[-.35,.14,.36,.3,.2,.28,0x74766f],
        [.02,.25,.51,.18,.045,.12,0x9c9686],[-.37,.24,-.34,.15,.045,.12,0xa59b87],[.5,.25,.02,.12,.05,.16,0x7f847a],
        [0,.065,0,.55,.09,.5,0x332a24],[0,.115,0,.43,.055,.37,0x514237],
        [0,.19,0,.76,.12,.13,0x55341d],[0,.205,0,.58,.11,.15,0x704326],[0,.19,0,.13,.12,.76,0x4b301c],[0,.205,0,.15,.11,.58,0x684022],
        [-.36,.2,0,.07,.105,.16,0xb27d48],[.36,.2,0,.07,.105,.16,0xc39254],[0,.2,-.28,.16,.105,.07,0xb27d48],[0,.2,.28,.16,.105,.07,0xc39254],
        [-.1,.15,.08,.16,.055,.12,0x9f2f18],[.08,.16,-.08,.14,.065,.13,0xe04a1d],[.02,.19,.04,.09,.055,.08,0xffa52c],[-.2,.19,-.13,.07,.04,.07,0xe85b1e]
      ],.04),
      // Silhueta em degraus com núcleo amarelo, língua laranja e ponta quente; cores pintadas por face.
      flame:mergeBoxes([
        [0,.2,0,.32,.2,.3,0xb72e14],[.01,.35,0,.34,.23,.31,0xf14b13],[-.035,.5,.025,.27,.27,.25,0xff7018],[.015,.65,.025,.2,.25,.19,0xffa322],
        [-.015,.8,.02,.14,.22,.14,0xffd34c],[.015,.95,.02,.08,.18,.08,0xffef9a],[-.145,.4,.04,.12,.18,.12,0xff5915],
        [.155,.49,-.03,.11,.18,.11,0xf24712],[.14,.64,-.02,.075,.15,.075,0xffad25]
      ],.025),
      // Geodo arcano: base violeta escura, grupo de cristais facetados e lascas luminosas.
      crystal:mergeBoxes([
        [0,.11,0,.62,.22,.54,0x21192f],[0,.22,0,.52,.06,.45,0x38264f],[-.18,.18,.12,.2,.12,.18,0x171326],[.19,.17,-.13,.18,.11,.18,0x171326],
        [0,.55,0,.23,.68,.22,0x6940b6],[.015,.62,.018,.16,.52,.16,0x875be0],[.23,.43,.1,.17,.53,.17,0x8c67eb],[-.21,.37,-.12,.17,.42,.17,0x50358f],[-.12,.31,.2,.12,.35,.12,0xb18af5],
        [.08,.35,-.23,.13,.39,.13,0x7149c6],[.22,.74,.1,.075,.24,.075,0xd5bdff],[-.205,.55,-.12,.055,.19,.055,0xc4a5ff],[.02,.88,.018,.07,.18,.07,0xe7d7ff],
        [.015,.62,.102,.07,.3,.018,0xd1b4ff],[.306,.43,.1,.025,.26,.1,0xd8c1ff],[-.21,.37,-.03,.02,.2,.08,0x8c70d1]
      ],.035),
      // Toco recém-cortado: casca estriada, anéis quadrados no topo, raízes e broto de musgo.
      stump:mergeBoxes([
        [0,.17,0,.54,.34,.52,0x56351f],[0,.25,0,.48,.2,.47,0x754629],[-.05,.34,.01,.44,.07,.43,0x8c5732],[0,.39,0,.41,.05,.4,0xb77a45],
        [0,.419,0,.31,.012,.3,0xd7b77f],[0,.428,0,.22,.012,.21,0xb58a58],[0,.437,0,.11,.012,.11,0xe2c996],
        [-.2,.12,.17,.2,.13,.19,0x5b3922],[.2,.12,.14,.2,.13,.2,0x604027],[.03,.11,-.2,.19,.12,.2,0x54351f],[-.16,.25,.252,.07,.22,.025,0x3e2a1c],[.15,.23,.248,.06,.18,.025,0x9b6136],[-.26,.3,.16,.12,.045,.09,0x536b3d],
        [.18,.37,-.12,.13,.035,.12,0x69854b],[-.18,.44,.02,.07,.035,.07,0xf0dcb1],[.21,.46,.02,.055,.025,.055,0xf0dcb1]
      ],.04)
    };
    const GROUND_GEO={
      tuft:mergeBoxes([[-.10,.08,0,.07,.16,.07,0x416f34],[0,.11,.02,.07,.22,.07,0x5b923d],[.10,.07,-.06,.07,.14,.07,0x75a44a],[-.04,.045,.10,.10,.09,.08,0x869e45],[.08,.04,.05,.08,.08,.08,0xa4a34d]],.04),
      dryTuft:mergeBoxes([[-.10,.06,.04,.07,.12,.07,0x9b8639],[0,.09,0,.06,.18,.06,0xc1a54e],[.10,.05,-.04,.06,.10,.06,0x93723a],[-.04,.04,-.10,.08,.08,.07,0xbd9d41],[.08,.035,.09,.08,.07,.07,0x8d5633]],.04),
      pebbles:mergeBoxes([[-.15,.03,0,.17,.06,.13,0x777667],[.01,.04,-.07,.13,.08,.12,0xa5a08a],[.15,.025,.08,.14,.05,.11,0x60675a],[-.04,.045,.13,.13,.09,.12,0x898b7b],[.07,.025,-.15,.11,.05,.09,0x736f66]],.04)
    };
    const FIELD_FLOWERS=(()=>{const make=(petal,light,center)=>mergeBoxes([
      [0,.14,0,.025,.28,.025,0x4e7736],[-.12,.105,.04,.025,.21,.025,0x547f3a],[.12,.11,-.035,.025,.22,.025,0x4a7333],[-.045,.11,.015,.10,.025,.045,0x6d9942],[.075,.15,-.01,.10,.025,.045,0x5c8b3c],
      [0,.29,0,.09,.035,.065,petal],[0,.29,0,.065,.035,.09,light],[0,.315,0,.032,.025,.032,center],[-.12,.22,.04,.075,.03,.06,petal],[-.12,.22,.04,.055,.03,.08,light],[-.12,.242,.04,.026,.022,.026,center],[.12,.23,-.035,.075,.03,.06,petal],[.12,.23,-.035,.055,.03,.08,light],[.12,.252,-.035,.026,.022,.026,center]
    ],.08);return[make(0xf0bf48,0xffdf78,0xfff0ad),make(0xe86f91,0xf4a7ba,0xffdc73),make(0x9b80d2,0xc3a9eb,0xffd66f),make(0xe9e4c6,0xfff5dc,0xffbd52)]})();

    function buildCoffin(open){const g=new THREE.Group(),DARK=0x21182a,PLUM=0x493653,EDGE=0x72577d,GOLD=0xc89a45,WINE=0x78253e;
      // Corpo afunilado em degraus, com faixas metálicas e puxadores laterais.
      vox(g,0,.07,0,.66,.14,1.24,DARK);vox(g,0,.15,0,.61,.09,1.18,0x33283b);
      vox(g,0,.22,-.3,.58,.18,.56,PLUM);vox(g,0,.21,.05,.5,.16,.25,0x584365);vox(g,0,.19,.36,.43,.13,.34,0x40304a);
      vox(g,0,.31,-.3,.5,.07,.46,EDGE);vox(g,0,.29,.05,.43,.055,.18,0x725b7d);vox(g,0,.26,.36,.36,.04,.27,0x604a6d);
      for(const z of[-.48,-.08,.27,.51])vox(g,0,.33,z,z>.4?.38:z<-.4?.48:.56,.035,.035,GOLD);
      for(const x of[-.32,.32])for(const z of[-.23,.31]){vox(g,x,.22,z,.07,.1,.13,GOLD);vox(g,x*1.04,.22,z,.035,.045,.07,0xe4c778)}
      vox(g,0,.345,.17,.18,.035,.035,0x8ee0cc,1);vox(g,0,.36,.17,.07,.065,.025,GOLD);vox(g,-.11,.34,.17,.035,.04,.025,0x8ee0cc,.7);vox(g,.11,.34,.17,.035,.04,.025,0x8ee0cc,.7);
      const lid=new THREE.Group();lid.position.set(0,.38,-.5);g.add(lid);
      // Tampa com moldura dourada, painel ameixa e sigilo turquesa.
      vox(lid,0,.04,.52,.62,.1,1.08,DARK);vox(lid,0,.105,.52,.58,.08,1.04,PLUM);vox(lid,0,.16,.52,.51,.045,.96,EDGE);
      vox(lid,0,.19,.52,.42,.035,.82,DARK);vox(lid,0,.215,.52,.34,.03,.68,WINE);
      for(const x of[-.27,.27])vox(lid,x,.18,.52,.035,.05,.92,GOLD);for(const z of[.08,.96])vox(lid,0,.18,z,.53,.05,.035,GOLD);
      vox(lid,0,.25,.52,.15,.05,.22,GOLD);vox(lid,0,.28,.52,.075,.055,.14,0x67cbb4,1);vox(lid,-.1,.245,.52,.04,.04,.08,0xc4f4df,.7);vox(lid,.1,.245,.52,.04,.04,.08,0xc4f4df,.7);
      if(open){lid.rotation.x=-1.5;vox(g,0,.3,0,.4,.035,.88,0xe2d9c5);vox(g,0,.325,.02,.29,.03,.66,WINE);vox(g,0,.345,.02,.12,.02,.48,0xa63a58);const l=new THREE.PointLight(0x9a7ae8,.8,5,2);l.position.set(0,.85,0);g.add(l)}
      return g}

    const TARDIS_LABEL_GEO=(()=>{const font={P:['11110','10001','10001','11110','10000'],O:['01110','10001','10001','10001','01110'],L:['10000','10000','10000','10000','11111'],I:['11111','00100','00100','00100','11111'],C:['01111','10000','10000','10000','01111'],E:['11111','10000','11110','10000','11111']},word='POLICE',cell=.018,step=.022,gap=.018,total=word.length*(4*step+cell)+(word.length-1)*gap,boxes=[];
      for(let k=0;k<word.length;k++)for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(font[word[k]][r][c]==='1')boxes.push([-total/2+cell/2+k*(4*step+cell+gap)+c*step,(2-r)*step,0,cell,cell,.01,0x102c5a]);
      return mergeBoxes(boxes)})();
    const TARDIS_LABEL_MAT=new THREE.MeshLambertMaterial({vertexColors:true});
    function buildTardis(){const g=new THREE.Group(),B=0x17499f,BD=0x0c2d68,EDGE=0x3971bf,GOLD=0xf2c14b,GLASS=0x83d9f2;
      vox(g,0,.045,0,1.16,.09,1.16,0x0a1830);vox(g,0,.105,0,1.09,.07,1.09,BD);vox(g,0,1.05,0,1,1.9,1,B);
      for(const x of[-.46,.46])for(const z of[-.46,.46])vox(g,x,1.05,z,.085,1.82,.085,EDGE);
      for(const x of[-.46,.46])for(const z of[-.46,.46])vox(g,x,2.035,z,.095,.12,.095,GOLD);
      vox(g,0,2.03,0,1.12,.08,1.12,0x09172e);vox(g,0,2.09,0,1.07,.06,1.07,EDGE);
      vox(g,0,2.18,0,1.08,.18,1.08,0x111827);vox(g,0,2.29,0,1.14,.08,1.14,0x0a1830);
      vox(g,0,2.345,0,.25,.07,.25,0x23446c);vox(g,0,2.44,0,.14,.17,.14,GLASS,1.3);vox(g,0,2.535,0,.2,.035,.2,GOLD);
      for(let s=0;s<4;s++){const f=new THREE.Group();f.rotation.y=s*Math.PI/2;g.add(f);
        for(const x of[-.46,.46])vox(f,x,1.05,.525,.075,1.76,.075,EDGE);
        vox(f,0,.15,.53,1.02,.08,.08,0x08172d);vox(f,0,.19,.58,.88,.025,.025,GOLD);
        vox(f,0,2.18,.55,.94,.15,.055,0xe8eceb);
        const label=new THREE.Mesh(TARDIS_LABEL_GEO,TARDIS_LABEL_MAT);label.position.set(0,2.18,.583);f.add(label);
        if(s===0||s===2){
          for(const x of[-.25,.25]){vox(f,x,.98,.535,.43,1.62,.08,0x0b285b);vox(f,x,.98,.58,.36,1.52,.035,B);vox(f,x,.77,.603,.29,.32,.025,0x123a7d);vox(f,x,.45,.603,.29,.22,.025,0x0e326e);vox(f,x,.77,.62,.22,.025,.018,EDGE);vox(f,x,.45,.62,.22,.025,.018,EDGE)}
          vox(f,0,.98,.603,.025,1.54,.025,0x081b3c);vox(f,0,1.72,.56,.84,.36,.06,0x0a244e);
          for(const t of[-.3,-.1,.1,.3]){const pane=vox(f,t,1.72,.601,.15,.28,.03,GLASS,.35);pane.castShadow=false;vox(f,t-.035,1.72,.619,.018,.24,.012,0xdaf6ff,.25)}
          vox(f,0,1.72,.622,.82,.035,.02,0x164078);for(const x of[-.2,0,.2])vox(f,x,1.72,.622,.025,.29,.02,0x164078);
          vox(f,-.055,1.23,.63,.035,.16,.035,GOLD);vox(f,.055,1.23,.63,.035,.16,.035,GOLD);
          vox(f,.34,1.05,.612,.09,.27,.035,0x10223b);vox(f,.34,1.12,.638,.045,.045,.02,GOLD);vox(f,.34,1.02,.638,.045,.045,.02,GLASS,.45);vox(f,.34,.92,.638,.045,.045,.02,0xd42020,.35);
        }else{
          vox(f,0,1.03,.545,.78,1.55,.06,0x103579);vox(f,0,1.56,.583,.56,.46,.035,0x0a244e);
          const side=vox(f,0,1.56,.61,.45,.34,.025,GLASS,.35);side.castShadow=false;vox(f,0,1.56,.628,.045,.32,.018,0xdaf6ff,.3);vox(f,0,1.56,.628,.43,.035,.018,0x164078);
          vox(f,0,.92,.583,.56,.46,.035,0x164078);vox(f,0,.92,.605,.42,.34,.025,B);vox(f,0,.39,.583,.56,.36,.035,0x0a244e);vox(f,0,.39,.605,.42,.25,.025,0x123a7d);
          vox(f,0,1.04,.635,.14,.14,.035,GOLD);vox(f,0,1.04,.657,.075,.075,.02,GLASS,.7);
        }}
      const lamp=new THREE.PointLight(GLASS,.45,4,2);lamp.position.set(0,2.43,0);g.add(lamp);return g}

    function buildRoyalThrone(){const thr=new THREE.Group(),GD=0xc99b35,GLD=0xf4d36a,RED=0x861727,RED2=0xb72b3d,WOOD=0x24170f,DARK=0x111019,GEM=0x31d6a0;
      // Base em degraus, com friso dourado e pés esculpidos.
      vox(thr,0,.065,0,1.5,.13,1.28,WOOD);vox(thr,0,.135,0,1.43,.035,1.21,GD);vox(thr,0,.19,0,1.31,.09,1.1,0x3b2516);vox(thr,0,.235,0,1.36,.035,1.13,GLD);
      for(const x of[-.52,.52])for(const z of[-.4,.4]){vox(thr,x,.34,z,.15,.2,.15,GD);vox(thr,x,.45,z,.105,.08,.105,GLD);vox(thr,x,.285,z,.18,.07,.18,WOOD)}
      // Assento acolchoado em veludo, com debrum e tachas em pixels.
      vox(thr,0,.43,.11,.98,.12,.78,WOOD);vox(thr,0,.51,.11,.96,.07,.76,GD);vox(thr,0,.575,.11,.88,.11,.68,RED);vox(thr,0,.635,.11,.82,.035,.62,RED2);
      for(const x of[-.34,-.17,0,.17,.34]){vox(thr,x,.66,.405,.045,.035,.045,GLD);vox(thr,x,.66,-.185,.045,.035,.045,GLD)}
      // Encosto alto: madeira escura, painel acolchoado e moldura dourada em camadas.
      vox(thr,0,1.12,-.43,1.08,1.16,.16,WOOD);vox(thr,0,1.12,-.335,.91,.99,.045,DARK);vox(thr,0,1.12,-.305,.82,.88,.035,RED);vox(thr,0,1.12,-.278,.72,.78,.025,RED2);
      vox(thr,0,1.12,-.257,.07,.7,.018,RED);vox(thr,0,1.12,-.256,.58,.07,.018,RED);
      for(const x of[-.53,.53]){vox(thr,x,1.08,-.43,.12,1.18,.17,GD);vox(thr,x,1.08,-.33,.065,1.02,.055,GLD);vox(thr,x,1.68,-.43,.19,.13,.22,WOOD);vox(thr,x,1.7,-.3,.13,.12,.08,GLD)}
      vox(thr,0,1.69,-.43,1.12,.14,.19,GD);vox(thr,0,1.65,-.31,.86,.07,.045,GLD);
      // Brasões laterais, cravejados de ouro e pequenas esmeraldas.
      for(const x of[-.32,.32]){vox(thr,x,1.13,-.24,.18,.2,.055,GD);vox(thr,x,1.13,-.205,.105,.12,.025,GEM,.35);vox(thr,x,1.39,-.24,.11,.08,.045,GLD)}
      const crest=vox(thr,0,1.26,-.225,.27,.27,.055,GEM,.55);crest.rotation.z=Math.PI/4;vox(thr,0,1.26,-.19,.1,.1,.025,0xeaffd6,.8);
      // Coroa entalhada no topo do espaldar, com pontas alternadas e rubi central.
      vox(thr,0,1.81,-.43,.9,.16,.22,WOOD);vox(thr,0,1.87,-.31,.82,.09,.08,GD);vox(thr,0,1.95,-.4,.62,.12,.17,GLD);
      for(const x of[-.35,-.18,0,.18,.35])vox(thr,x,2.04-(Math.abs(x)*.28),-.4,.105,.23,.14,GD);
      vox(thr,0,2.12,-.4,.18,.19,.17,GLD);const ruby=vox(thr,0,2.13,-.29,.09,.11,.04,0xff4055,1);ruby.rotation.z=Math.PI/4;
      for(const x of[-.57,.57]){vox(thr,x,1.91,-.43,.15,.18,.15,GLD);vox(thr,x,2.03,-.43,.09,.12,.09,0x4fd8ff,.65)}
      // Apoios largos com guarnição, punhos facetados e descanso para os pés.
      for(const x of[-.61,.61]){vox(thr,x,.72,-.02,.15,.47,.17,WOOD);vox(thr,x,.96,-.02,.2,.13,.22,GLD);vox(thr,x,.79,.16,.18,.09,.48,GD);vox(thr,x,.85,.16,.14,.035,.39,RED);vox(thr,x,.85,.39,.2,.12,.16,GLD);vox(thr,x,.91,.39,.13,.08,.11,GEM,.3);vox(thr,x,.42,.04,.18,.1,.2,WOOD)}
      vox(thr,0,.22,.69,.82,.18,.3,WOOD);vox(thr,0,.31,.69,.76,.08,.25,GD);vox(thr,0,.37,.69,.67,.07,.19,RED);
      for(const x of[-.25,0,.25])vox(thr,x,.405,.69,.06,.025,.06,GLD);
      return thr}

    function makeTotem(){const g=new THREE.Group();
      const dark=0x272a34,stone=0x60656a,edge=0x899096,gold=0xc69b4d,teal=0x68d4d2;
      // Pedestal em degraus: basalto, frisos de bronze e rebites nos quatro cantos.
      vox(g,0,.08,0,1.12,.16,1.12,0x292b31);vox(g,0,.17,0,1,.08,1,0x77766e);vox(g,0,.225,0,.91,.045,.91,gold);
      vox(g,0,.29,0,.84,.11,.84,0x454a50);vox(g,0,.36,0,.72,.08,.72,0x77796f);vox(g,0,.415,0,.66,.035,.66,0x282b32);
      for(const x of[-.43,.43])for(const z of[-.43,.43]){vox(g,x,.14,z,.14,.13,.14,0x4d5156);vox(g,x,.215,z,.085,.035,.085,0xe2bd68);vox(g,x,.24,z,.035,.025,.035,0xf5e2a8)}
      // Coluna reforçada com placas laterais e um sigilo de magnetita na face frontal.
      vox(g,0,.91,0,.53,1,.53,stone);vox(g,0,.91,0,.39,.91,.4,dark);
      for(const x of[-.24,.24]){vox(g,x,.91,0,.075,.88,.54,edge);vox(g,x*1.08,.91,0,.025,.62,.55,0x454b54)}
      vox(g,0,.46,0,.65,.1,.65,0x343941);vox(g,0,1.39,0,.71,.13,.71,0x353941);vox(g,0,1.465,0,.61,.045,.61,gold);vox(g,0,1.51,0,.48,.045,.48,0x30333b);
      vox(g,0,.91,.207,.29,.45,.035,0x20232d);vox(g,0,.91,.23,.19,.33,.025,0x8e293e,.15);vox(g,0,.93,.247,.055,.22,.018,gold,.2);
      for(const x of[-.085,.085])vox(g,x,.91,.25,.025,.12,.018,teal,.7);
      for(const side of[-1,1]){vox(g,side*.27,.88,0,.035,.32,.2,0x303640);vox(g,side*.292,.88,0,.018,.18,.08,teal,.55)}
      // Oito placas suspensas formam o campo magnético sob o artefato.
      for(let i=0;i<8;i++){const a=i*Math.PI/4,r=.36,chip=vox(g,Math.cos(a)*r,1.59,Math.sin(a)*r,.12,.065,.12,i%2?teal:gold,i%2?.45:.12);chip.rotation.y=a}
      // Ímã ferradura, com núcleo vermelho, contorno escuro, pontas prateadas e faíscas pixeladas.
      const m=new THREE.Group();m.name='mag';m.position.y=1.95;
      vox(m,-.16,.075,0,.19,.39,.21,0x451521);vox(m,.16,.075,0,.19,.39,.21,0x451521);vox(m,0,-.105,0,.51,.18,.21,0x451521);
      vox(m,-.16,.085,.018,.135,.33,.18,0xc32d45,.35);vox(m,.16,.085,.018,.135,.33,.18,0xc32d45,.35);vox(m,0,-.105,.018,.43,.12,.18,0xc32d45,.35);
      vox(m,-.19,.12,.115,.045,.23,.025,0xf1767f,.18);vox(m,.13,.12,.115,.045,.23,.025,0xf1767f,.18);vox(m,-.025,-.085,.115,.25,.035,.025,0xf1767f,.12);
      for(const x of[-.16,.16]){vox(m,x,.285,0,.18,.105,.23,0x666d76);vox(m,x,.3,.018,.13,.075,.19,0xe1e5e7,.35);vox(m,x,.31,.12,.075,.045,.025,0xffffff,.5)}
      for(const x of[-.08,.08])vox(m,x,-.1,.13,.035,.045,.02,gold,.3);
      for(const [x,y,z,c] of[[-.36,.03,0,teal],[.36,.03,0,gold],[0,.37,0,teal],[0,-.22,.12,0x8ceaf0]]){const shard=vox(m,x,y,z,.075,.075,.075,c,.6);shard.rotation.y=Math.PI/4}
      g.add(m);
      // Quando consumido, o ímã some e revela o encaixe de energia apagado.
      const off=new THREE.Group();off.name='off';off.visible=false;vox(off,0,1.49,0,.52,.09,.52,0x25232c);vox(off,0,1.545,0,.38,.035,.38,0x514443);vox(off,0,1.57,0,.22,.025,.22,0x632538,.35);
      for(const [x,z] of[[-.16,0],[.16,0],[0,-.16],[0,.16]]){const shard=vox(off,x,1.62,z,.07,.08,.07,0x59404b);shard.rotation.y=Math.PI/4}g.add(off);return{g,m,off}}
    function makeChest(){return window.CHEST_MODEL.create({THREE,mergeBoxes,vcMat,vox})}
    function buildChestDisplay(){const{g,lid}=makeChest();lid.rotation.x=-1.2;return g}

    // Constrói o cenário da fase: relevo visual e props; genField continua responsável por mapa e obstáculos.
    function buildField({level,trees,rocks,grid,hgt,W,H,relief,jv,nz,nz2,isWall}){
      const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),col=new THREE.Color(),up=new THREE.Vector3(0,1,0);
      const inst=(n,cast)=>{const m=new THREE.InstancedMesh(boxGeo,new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,n));m.receiveShadow=true;m.castShadow=!!cast;level.add(m);return m};
      const gCells=[],dCells=[],dryCells=[],mossCells=[];
      for(let z=0;z<H;z++)for(let x=0;x<W;x++){const patch=nz2(x,z);if(nz(x,z)>1.2)dCells.push([x,z]);else if(patch>.82)dryCells.push([x,z]);else if(patch<-.98)mossCells.push([x,z]);else gCells.push([x,z])}
      const ROCK_TONE=new THREE.Color(0x8c8c80);
      const blockInst=(geo,cells,variant)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}),Math.max(1,cells.length));m.receiveShadow=true;level.add(m);
        cells.forEach(([x,z],i)=>{m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06-.7,z),q,s.set(1,1.4,1));m.setMatrixAt(i,m4);const yv=relief(x,z);
          if(variant==='dry')col.setScalar(.98+rand(-.05,.04));else if(variant==='moss')col.setScalar(.96+rand(-.05,.04));else if(variant==='dirt')col.setScalar(1+rand(-.05,.05));else col.setScalar(1+rand(-.08,.08)+((x+z)%2?.03:-.03));
          if(yv>2)col.lerp(ROCK_TONE,Math.min(.8,(yv-2)/3));m.setColorAt(i,col)});return m};
      blockInst(grassBlockGeo,gCells,'grass');blockInst(dryBlockGeo,dryCells,'dry');blockInst(mossBlockGeo,mossCells,'moss');blockInst(dirtBlockGeo,dCells,'dirt');
      const ring=inst(32,false);ring.castShadow=false;ring.receiveShadow=false;
      for(let i=0;i<32;i++){const a=i*TAU/32,r=3.05+rand(-.1,.1),x=W/2+Math.cos(a)*r,z=H/2+Math.sin(a)*r;m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06+.045,z),q.setFromAxisAngle(up,a+Math.PI/2),s.set(.5,.08,.24));ring.setMatrixAt(i,m4);col.setHex(i%8===0?0x92794d:pick([0x656c5b,0x777563,0x89846c,0x5d6658]));ring.setColorAt(i,col)}
      ring.instanceMatrix.needsUpdate=true;if(ring.instanceColor)ring.instanceColor.needsUpdate=true;
      const bl=[];for(let z=0;z<H;z++)for(let x=0;x<W;x++)if(grid[z*W+x]===1)bl.push([x,z]);
      const bm=inst(bl.length,true);bl.forEach(([x,z],i)=>{const h=hgt[z*W+x];m4.compose(p.set(x,h/2,z),q,s.set(1,h,1));bm.setMatrixAt(i,m4);col.setHex(0x7d8274).offsetHSL(0,0,rand(-.06,.04));bm.setColorAt(i,col)});
      TREE_SYSTEM.addToField(trees,level,{rand,TAU,relief,jv});
      const rb=ROCK_GEOS.map(()=>[]);rocks.forEach(t=>rb[(Math.random()*ROCK_GEOS.length)|0].push(t));
      ROCK_GEOS.forEach((geo,bi)=>{const list=rb[bi];if(!list.length)return;const im=new THREE.InstancedMesh(geo,treeMat,list.length);im.castShadow=true;im.receiveShadow=true;
        list.forEach(([x,z],i)=>{q.setFromAxisAngle(up,rand(0,TAU));m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06,z),q,s.setScalar(rand(.75,1.1)));im.setMatrixAt(i,m4);col.setScalar(1+rand(-.06,.05));im.setColorAt(i,col)});level.add(im)});
      const landPos={fire:[],cry:[],grave:[]},crystalMeshes=[];
      const decInst=(geo,matl,list,sc)=>{if(!list.length)return;const im=new THREE.InstancedMesh(geo,matl,list.length);im.castShadow=true;im.receiveShadow=true;level.add(im);
        list.forEach((it,i)=>{q.setFromAxisAngle(up,it[2]!=null?it[2]:rand(0,TAU));const k=sc?sc[0]+Math.random()*(sc[1]-sc[0]):1;m4.compose(p.set(it[0],relief(it[0],it[1])+jv(it[0],it[1])*.06,it[1]),q,s.setScalar(k));im.setMatrixAt(i,m4);col.setScalar(1+rand(-.08,.05));im.setColorAt(i,col)});return im};
      const open=(x,z,dC=12)=>x>4&&z>4&&x<W-5&&z<H-5&&!isWall(x,z)&&Math.hypot(x-W/2,z-H/2)>dC&&relief(x,z)<2;
      const spots=[];let gt=0;while(spots.length<6&&gt++<250){const x=randi(12,W-13),z=randi(12,H-13);if(!open(x,z)||spots.some(a=>Math.hypot(a.x-x,a.z-z)<18))continue;spots.push({x,z})}
      landPos.grave=spots.map(a=>({x:a.x,z:a.z}));const graves=[],crosses=[];
      for(const spot of spots){const n=randi(3,6);for(let i=0;i<n;i++){const x=spot.x+randi(-2,2),z=spot.z+randi(-2,2);if(isWall(x,z)||x<4||z<4||x>=W-5||z>=H-5)continue;(Math.random()<.55?graves:crosses).push([x,z,rand(-.5,.5)])}}
      decInst(DECOR_GEO.grave,new THREE.MeshLambertMaterial({vertexColors:true}),graves,[.9,1.2]);decInst(DECOR_GEO.cross,new THREE.MeshLambertMaterial({vertexColors:true}),crosses,[.9,1.2]);
      const shrooms=[];let ht=0;while(shrooms.length<24&&ht++<400){const x=randi(6,W-7),z=randi(6,H-7);if(!open(x,z,6)||shrooms.some(a=>Math.hypot(a[0]-x,a[1]-z)<6))continue;shrooms.push([x,z,rand(0,TAU)])}
      decInst(DECOR_GEO.shroom,new THREE.MeshLambertMaterial({vertexColors:true}),shrooms,[.7,1.2]);
      const fires=[];let ft=0;while(fires.length<7&&ft++<300){const x=randi(10,W-11),z=randi(10,H-11);if(!open(x,z,20)||fires.some(a=>Math.hypot(a[0]-x,a[1]-z)<24))continue;fires.push([x,z,rand(0,TAU)])}
      landPos.fire=fires.map(a=>({x:a[0],z:a[1]}));decInst(DECOR_GEO.fire,new THREE.MeshLambertMaterial({vertexColors:true}),fires,[1,1.1]);
      const flameMat=new THREE.MeshBasicMaterial({color:0xffffff,vertexColors:true}),fireFx={mesh:null,base:[],smokes:[],lights:[],t:rand(0,9)};
      if(fires.length){const fm=new THREE.InstancedMesh(DECOR_GEO.flame,flameMat,fires.length);level.add(fm);fireFx.mesh=fm;
        fires.forEach(([x,z,ry],i)=>{const y=relief(x,z)+jv(x,z)*.06,sc=rand(.85,1.1);q.setFromAxisAngle(up,ry);m4.compose(p.set(x,y,z),q,s.setScalar(sc));fm.setMatrixAt(i,m4);fireFx.base.push({x,z,y,ry,sc,ph:rand(0,TAU)});
          const li=new THREE.PointLight(0xff8a3a,1.5,6,2);li.position.set(x,y+.85,z);li.visible=false;level.add(li);fireFx.lights.push(li);
          for(let k=0;k<3;k++){const sm=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xaab0b8,transparent:true,opacity:0,depthWrite:false}));sm.position.set(x,y-1.5,z);level.add(sm);fireFx.smokes.push({m:sm,x,y,z,ph:k/3})}})}
      const crys=[];let yt=0;while(crys.length<8&&yt++<300){const x=randi(8,W-9),z=randi(8,H-9);if(!open(x,z,16)||crys.some(a=>Math.hypot(a[0]-x,a[1]-z)<22))continue;crys.push([x,z,rand(0,TAU)])}
      landPos.cry=crys.map(([x,z])=>({x,z,used:false}));
      if(crys.length){const crystalMat=new THREE.MeshBasicMaterial({vertexColors:true});crys.forEach(([x,z,ry],i)=>{const cm=new THREE.Mesh(DECOR_GEO.crystal,crystalMat);cm.position.set(x,relief(x,z)+jv(x,z)*.06,z);cm.rotation.y=ry;cm.scale.setScalar(rand(.9,1.4));cm.castShadow=true;cm.receiveShadow=true;level.add(cm);crystalMeshes[i]=cm})}
      const stumps=[];for(let i=0;i<26;i++){const x=randi(5,W-6),z=randi(5,H-6);if(open(x,z,10))stumps.push([x,z,rand(0,TAU)])}
      decInst(DECOR_GEO.stump,new THREE.MeshLambertMaterial({vertexColors:true}),stumps,[.8,1.2]);
      const chests=[];let tries=0;while(chests.length<20&&tries++<800){const x=randi(6,W-7),z=randi(6,H-7);if(isWall(x,z)||Math.hypot(x-W/2,z-H/2)<14||chests.some(c=>Math.hypot(c.x-x,c.z-z)<10))continue;
        const {g,lid}=makeChest();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);g.rotation.y=rand(0,TAU);level.add(g);chests.push({x,z,g,lid,open:false})}
      const totems=[];let tt=0;while(totems.length<2&&tt++<900){const x=randi(12,W-13),z=randi(12,H-13);if(isWall(x,z)||Math.hypot(x-W/2,z-H/2)<22||totems.some(c=>Math.hypot(c.x-x,c.z-z)<40)||chests.some(c=>Math.hypot(c.x-x,c.z-z)<4))continue;
        const {g,m,off}=makeTotem();g.position.set(x,relief(x,z)+jv(x,z)*.06,z);level.add(g);totems.push({x,z,g,m,off,t:rand(0,5),used:false})}
      const tufts=[],dryTufts=[],pebbles=[],placed=[],avoid=[...landPos.fire,...landPos.cry,...landPos.grave,...chests,...totems];
      const valid=(x,z)=>grid[z*W+x]===0&&relief(x,z)<1.4&&Math.hypot(x-W/2,z-H/2)>4.2&&!avoid.some(o=>Math.hypot(o.x-x,o.z-z)<2.2)&&placed.every(([px,pz])=>Math.hypot(px-x,pz-z)>=1.8);
      const fill=(list,count,condition)=>{let tries=0;while(list.length<count&&tries++<count*30){const x=randi(4,W-5),z=randi(4,H-5);if(!valid(x,z)||!condition(x,z))continue;list.push([x,z]);placed.push([x,z])}};
      fill(tufts,420,(x,z)=>nz2(x,z)<.88);fill(dryTufts,160,(x,z)=>nz2(x,z)>.70);fill(pebbles,220,(x,z)=>nz(x,z)>1);
      const addGround=(geo,list,min,max)=>{if(!list.length)return;const im=new THREE.InstancedMesh(geo,treeMat,list.length);im.castShadow=false;im.receiveShadow=false;list.forEach(([x,z],i)=>{q.setFromAxisAngle(up,rand(0,TAU));m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06+.008,z),q,s.setScalar(rand(min,max)));im.setMatrixAt(i,m4);col.setScalar(1+rand(-.05,.05));im.setColorAt(i,col)});im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;level.add(im)};
      addGround(GROUND_GEO.tuft,tufts,.72,1.2);addGround(GROUND_GEO.dryTuft,dryTufts,.72,1.15);addGround(GROUND_GEO.pebbles,pebbles,.72,1.15);
      const blooms=FIELD_FLOWERS.map(()=>[]),reserved=[...landPos.fire,...landPos.cry,...landPos.grave,...chests,...totems];let bt=0,placedBlooms=0;
      while(placedBlooms<300&&bt++<1800){const x=randi(4,W-5),z=randi(4,H-5);if(isWall(x,z)||relief(x,z)>1.5||Math.hypot(x-W/2,z-H/2)<4.7||reserved.some(o=>Math.hypot(o.x-x,o.z-z)<1.8))continue;blooms[(Math.random()*blooms.length)|0].push([x,z]);placedBlooms++}
      FIELD_FLOWERS.forEach((geo,bi)=>{const list=blooms[bi];if(!list.length)return;const im=new THREE.InstancedMesh(geo,treeMat,list.length);im.castShadow=false;im.receiveShadow=false;list.forEach(([x,z],i)=>{q.setFromAxisAngle(up,rand(0,TAU));m4.compose(p.set(x,relief(x,z)+jv(x,z)*.06,z),q,s.setScalar(rand(.78,1.18)));im.setMatrixAt(i,m4);col.setScalar(1+rand(-.05,.06));im.setColorAt(i,col)});im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;level.add(im)});
      return{landPos,chests,totems,flameMat,fireFx,crystalMeshes}
    }

    function buildMenuLandscape(menuGroup,{nz,nz2,jv,ritualX=10.8,ritualZ=-12.2,barX=-1.45,barZ=-11.2,barTableX=-.48,barTableZ=-11.2}){
      const gCells=[],dCells=[];for(let x=-14;x<=14;x++)for(let z=-17;z<=5;z++){if(x*x/200+z*z/290>rand(.9,1.2))continue;(nz(x,z)>1.2?dCells:gCells).push([x,z])}
      const mkGround=(geo,cells)=>{const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}),Math.max(1,cells.length));im.receiveShadow=true;menuGroup.add(im);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),pp=new THREE.Vector3(),ss=new THREE.Vector3(),col=new THREE.Color();
        cells.forEach(([x,z],i)=>{m4.compose(pp.set(x,jv(x,z)*.06-.7,z),q,ss.set(1,1.4,1));im.setMatrixAt(i,m4);if(nz2(x,z)>.98)col.setHex(0xa8a24a).offsetHSL(0,0,rand(-.06,.04));else col.setScalar(1+rand(-.08,.08)+((x+z)%2?.03:-.03));im.setColorAt(i,col)})};
      mkGround(grassBlockGeo,gCells);mkGround(dirtBlockGeo,dCells);
      for(let i=0;i<48;i++){const fx=rand(-11,11),fz=rand(-13,4);if(fx*fx+fz*fz<4||Math.hypot(fx-ritualX,fz-ritualZ)<3.1||Math.hypot(fx-barX,fz-barZ)<2.2||Math.hypot(fx-barTableX,fz-barTableZ)<1.7)continue;const flower=vox(menuGroup,fx,.08,fz,.12,.12,.12,pick([0xf2d24b,0xe86a8a,0xffffff,0xa58bff]));flower.castShadow=false}
      [[-12,.5,1],[12,-2,3],[-5,-13.5,4],[-4,4.3,2],[2.6,4.4,0]].forEach(([tx,tz,t])=>{const m=new THREE.Mesh(TREE_GEOS[t],treeMat);m.position.set(tx,jv(tx,tz)*.06,tz);m.rotation.y=rand(0,TAU);m.scale.setScalar(rand(.8,1.1));m.castShadow=true;m.receiveShadow=true;menuGroup.add(m)})
    }
    function buildMenuTardis(menuGroup){const tG=new THREE.Group();tG.position.set(-10.2,0,2.7);tG.rotation.y=1.75;tG.scale.setScalar(.92);menuGroup.add(tG);tG.add(buildTardis());return tG}
    function buildMenuCemetery(menuGroup){const ceme=new THREE.Group();ceme.position.set(-8.6,0,-11.6);ceme.rotation.y=.55;menuGroup.add(ceme);
      [[-1.7,.5,'grave'],[.7,-.8,'cross'],[-.6,1.7,'grave'],[1.8,1,'cross'],[.2,2.5,'grave']].forEach(([x,z,k])=>{const m=new THREE.Mesh(DECOR_GEO[k],treeMat);m.position.set(x,0,z);m.rotation.y=rand(0,TAU);ceme.add(m)});
      [[-2.3,2.2],[2.3,-1.5]].forEach(([x,z])=>{const m=new THREE.Mesh(DECOR_GEO.shroom,treeMat);m.position.set(x,0,z);ceme.add(m)});
      const deadTree=new THREE.Mesh(TREE_GEOS[5],treeMat);deadTree.position.set(-3,0,-1.8);deadTree.scale.setScalar(1.15);ceme.add(deadTree);
      const cofA=buildCoffin(false);cofA.position.set(1.3,0,.4);cofA.rotation.y=-.5;ceme.add(cofA);const cofB=buildCoffin(true);cofB.position.set(-1.4,0,-.7);cofB.rotation.y=.35;ceme.add(cofB);return ceme}
    function buildMenuRoyalCourt(menuGroup){const court=new THREE.Group();menuGroup.add(court);const throne=buildRoyalThrone();throne.position.set(6.9,0,3.9);throne.rotation.y=-2.5;court.add(throne);return court}
    function buildMenuNecroGraves(menuGroup){const necro=new THREE.Group();menuGroup.add(necro);[[8.35,-6.55,'grave'],[7.8,-8,'cross'],[6.6,-8.3,'grave']].forEach(([x,z,k],i)=>{const m=new THREE.Mesh(DECOR_GEO[k],treeMat);m.name=i===0?'necroSideTombstone':'necroGrave'+i;m.position.set(x,0,z);m.rotation.y=rand(0,TAU);necro.add(m)});return necro}
    function buildMenuCampfire(menuGroup){const fireGroup=new THREE.Group();menuGroup.add(fireGroup);
      const hearth=new THREE.Mesh(DECOR_GEO.fire,treeMat);hearth.castShadow=true;hearth.receiveShadow=true;fireGroup.add(hearth);
      const flames=[[0,.24,0,.36,.22,.34,0xd53a12],[0,.39,0,.32,.24,.29,0xff5c15],[-.035,.54,.025,.25,.27,.24,0xff841b],[.015,.69,.03,.19,.24,.18,0xffb52c],[-.015,.83,.02,.13,.21,.13,0xffdc59],[.005,.96,.02,.08,.17,.08,0xffef9a],[-.14,.41,.035,.12,.18,.12,0xff6416],[.15,.48,-.025,.1,.17,.1,0xf94812],[.14,.61,-.03,.07,.16,.08,0xffa323]].map(a=>{const f=vox(fireGroup,a[0],a[1],a[2],a[3],a[4],a[5],a[6],1);f.castShadow=false;f.userData.b=[a[3],a[4],a[5]];return f});
      const light=new THREE.PointLight(0xff8a3a,1.6,9,2);light.position.set(0,.85,0);fireGroup.add(light);
      const smokes=[0,1,2].map(i=>{const m=new THREE.Mesh(boxGeo,new THREE.MeshBasicMaterial({color:0xaab0b8,transparent:true,opacity:0,depthWrite:false}));m.castShadow=false;m.position.y=-2;fireGroup.add(m);return{m,p:i/3}});return{group:fireGroup,flames,light,smokes}}
    function buildMenuFireRing(menuGroup,flatMesh){const group=new THREE.Group();group.position.y=.03;menuGroup.add(group);const glow=[],rim=[];
      for(let i=0;i<5;i++){const a=rand(0,TAU),r=rand(.05,.55),bm=flatMesh(new THREE.CircleGeometry(rand(.18,.34),22),pick([0xff8a2a,0xd9571e,0xffa52a]),rand(.1,.2));bm.userData.own=false;bm.position.set(Math.sin(a)*r,rand(0,.02),Math.cos(a)*r);group.add(bm);glow.push({m:bm,a,r,op:bm.material.opacity,ph:rand(0,TAU)})}
      const mkFlare=(r,a,sparse)=>{const g=new THREE.Group(),b=vox(g,0,.09,0,.09,.16,.09,pick([0xffb02f,0xff9a1f]),1);b.castShadow=false;const t=vox(g,0,.21,0,.06,.1,.06,0xff4a1a,1);t.castShadow=false;t.rotation.x=rand(-.3,.3);g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);group.add(g);return{g,ph:rand(0,TAU),base:.8+rand(-.25,.3),sparse:!!sparse,cur:0}};
      for(let i=0;i<18;i++)rim.push(mkFlare(.8+rand(-.14,.14),i/18*TAU+rand(-.08,.08)));for(let i=0;i<7;i++)rim.push(mkFlare(rand(.15,.5),rand(0,TAU),true));return{group,glow,rim}}
    function buildClassPedestal(color){const g=new THREE.Group();vox(g,0,.21,0,.3,.42,.2,0x837e74);vox(g,0,.47,0,.36,.08,.24,0x8f8a80);vox(g,0,.56,0,.12,.14,.12,color,1);return g}
    function buildMenuDemonRitual(menuGroup,x=10.8,z=-12.2){
      const altar=new THREE.Group();altar.name='demonMenuRitual';altar.position.set(x,0,z);menuGroup.add(altar);
      const stoneColors=[0x28202a,0x39303a,0x44333a,0x33262e];
      for(let i=0;i<10;i++){const a=i/10*TAU,slab=vox(altar,Math.sin(a)*1.92,.045,Math.cos(a)*1.92,.66,.13,.58,stoneColors[i%stoneColors.length]);slab.rotation.y=a}
      const points=Array.from({length:5},(_,i)=>{const a=-Math.PI/2+i*TAU/5;return{x:Math.cos(a)*1.28,z:Math.sin(a)*1.28}});
      const stroke=(a,b,width,height,color,glow,y=.145)=>{const dx=b.x-a.x,dz=b.z-a.z,m=vox(altar,(a.x+b.x)/2,y,(a.z+b.z)/2,width,height,Math.hypot(dx,dz),color,glow);m.rotation.y=Math.atan2(dx,dz);return m};
      for(let i=0;i<5;i++)stroke(points[i],points[(i+1)%5],.085,.045,0x611421,.45);
      const star=[0,2,4,1,3,0];for(let i=0;i<5;i++)stroke(points[star[i]],points[star[i+1]],.075,.055,0xf12d45,1.1);
      for(let i=0;i<5;i++){
        const a=i/5*TAU-Math.PI/2,px=Math.cos(a)*1.72,pz=Math.sin(a)*1.72;
        vox(altar,px,.14,pz,.16,.18,.16,0x761b2b,.35);vox(altar,px,.245,pz,.095,.11,.095,0xff483d,1.15);
        const rune=vox(altar,Math.cos(a)*.74,.17,Math.sin(a)*.74,.16,.035,.055,i%2?0xff6044:0xd72d69,.9);rune.rotation.y=a;
      }
      vox(altar,0,.16,0,.19,.06,.19,0xffb153,1.2);
      const flameLight=new THREE.PointLight(0xb51d3d,.85,4.5,2);flameLight.position.set(0,.8,0);altar.add(flameLight);
      return altar
    }
    function buildMenuBarSet(menuGroup,chairX=-1.45,chairZ=-11.2,tableX=-.48,tableZ=-11.2){
      const group=new THREE.Group();group.name='zeBarCorner';menuGroup.add(group);
      const yellow=0xffcf19,light=0xffe34a,shade=0xe4a900;
      const chair=new THREE.Group();chair.name='yellowBarChair';chair.position.set(chairX,0,chairZ);chair.rotation.y=0;chair.scale.set(.58,.6,.58);group.add(chair);
      for(const sx of [-1,1])for(const sz of [-1,1])vox(chair,sx*.27,.36,sz*.24,.09,.72,.09,yellow);
      vox(chair,0,.73,0,.74,.12,.66,yellow);vox(chair,0,.80,.015,.62,.025,.53,light);
      vox(chair,0,1.15,-.28,.72,.78,.11,yellow);
      vox(chair,0,.34,-.25,.59,.07,.07,shade);vox(chair,0,.34,.25,.59,.07,.07,shade);
      vox(chair,-.27,.34,0,.07,.07,.5,shade);vox(chair,.27,.34,0,.07,.07,.5,shade);
      const table=new THREE.Group();table.name='yellowBarTable';table.position.set(tableX,0,tableZ);table.scale.set(.6,.68,.6);group.add(table);
      for(const sx of [-1,1])for(const sz of [-1,1])vox(table,sx*.48,.51,sz*.4,.105,.96,.105,yellow);
      vox(table,0,1.01,0,1.38,.14,1.18,shade);vox(table,0,1.095,0,1.31,.07,1.11,yellow);
      vox(table,0,1.137,0,.88,.014,.045,light);
      vox(table,0,.27,0,.96,.075,.08,shade);vox(table,0,.27,0,.08,.075,.8,shade);
      return{group,chair,table}
    }
    function buildHeroPodium(menuGroup){const podium=new THREE.Mesh(new THREE.CircleGeometry(.85,28),new THREE.MeshBasicMaterial({color:0xf2b84b,transparent:true,opacity:.14,depthWrite:false}));podium.rotation.x=-Math.PI/2;podium.position.y=.03;menuGroup.add(podium);return podium}

    return{grassBlockGeo,dryBlockGeo,mossBlockGeo,dirtBlockGeo,TREE_SYSTEM,TREE_GEOS,treeMat,ROCK_GEOS,DECOR_GEO,GROUND_GEO,FIELD_FLOWERS,buildField,buildCoffin,buildTardis,buildRoyalThrone,buildTotem:()=>makeTotem().g,buildChestDisplay,buildMenuLandscape,buildMenuTardis,buildMenuCemetery,buildMenuRoyalCourt,buildMenuNecroGraves,buildMenuCampfire,buildMenuFireRing,buildClassPedestal,buildMenuDemonRitual,buildMenuBarSet,buildHeroPodium}
  };
})();
