/* Baú de tesouro voxel: geometria, paleta e detalhes visuais em um módulo próprio. */
window.CHEST_MODEL=(()=>{
  let bodyGeo=null,lidGeo=null;
  const BODY_PARTS=[
    [0,.045,0,.82,.09,.60,0x3b291b],
    [0,.26,0,.76,.40,.54,0x684222],
    [0,.13,0,.82,.055,.60,0x39434b],[0,.39,0,.82,.055,.60,0x39434b],
    [-.21,.255,.282,.19,.20,.025,0x94612f],[0,.255,.282,.19,.20,.025,0xaa7137],[.21,.255,.282,.19,.20,.025,0x855329],
    [-.39,.255,0,.025,.20,.44,0x8e5b2d],[.39,.255,0,.025,.20,.44,0x80502a],
    [-.335,.26,.307,.075,.38,.035,0x303a45],[.335,.26,.307,.075,.38,.035,0x303a45],
    [-.335,.13,.33,.035,.035,.018,0xe8bd58],[.335,.13,.33,.035,.035,.018,0xe8bd58],[-.335,.39,.33,.035,.035,.018,0xe8bd58],[.335,.39,.33,.035,.035,.018,0xe8bd58],
    [0,.25,.319,.20,.26,.04,0xd7a642],
    [0,.215,.345,.035,.09,.018,0x281c17]
  ];
  const LID_PARTS=[
    [0,.075,.27,.78,.15,.58,0x76502a],
    [0,.16,.27,.66,.075,.42,0x906132],[0,.208,.27,.46,.035,.26,0xa16c38],
    [-.25,.11,.27,.055,.21,.60,0xb88737],[.25,.11,.27,.055,.21,.60,0xb88737],
    [0,.035,.575,.78,.045,.025,0x39434b],
    [0,.005,.595,.17,.12,.035,0xe4b94e],
    [-.25,.035,.605,.035,.035,.018,0xf3d475],[.25,.035,.605,.035,.035,.018,0xf3d475],
    [0,.244,.27,.22,.035,.15,0xe0b64d]
  ];

  function create({THREE,mergeBoxes,vcMat,vox}){
    if(!bodyGeo){bodyGeo=mergeBoxes(BODY_PARTS);lidGeo=mergeBoxes(LID_PARTS)}
    const g=new THREE.Group(),body=new THREE.Mesh(bodyGeo,vcMat);
    body.castShadow=true;body.receiveShadow=true;g.add(body);
    vox(g,0,.315,.347,.07,.055,.025,0x4be0c7,.55);
    const lid=new THREE.Group();lid.position.set(0,.44,-.27);g.add(lid);
    const lidMesh=new THREE.Mesh(lidGeo,vcMat);lidMesh.castShadow=true;lidMesh.receiveShadow=true;lid.add(lidMesh);
    vox(lid,0,.274,.27,.085,.035,.08,0x4be0c7,.55);
    return{g,lid};
  }

  return{create};
})();
