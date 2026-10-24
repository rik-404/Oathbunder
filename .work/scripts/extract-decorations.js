const fs = require('fs');
const path = 'game.js';
let source = fs.readFileSync(path, 'utf8');
function between(start, end, replacement, label) {
  const a = source.indexOf(start);
  if (a < 0 || source.indexOf(start, a + start.length) >= 0) throw new Error(`marcador inicial inválido (${label})`);
  const b = source.indexOf(end, a + start.length);
  if (b < 0) throw new Error(`marcador final ausente (${label})`);
  source = source.slice(0, a) + replacement + source.slice(b);
}
function replaceOnce(oldText, newText, label) {
  const first = source.indexOf(oldText);
  if (first < 0 || source.indexOf(oldText, first + oldText.length) >= 0) throw new Error(`trecho não único (${label})`);
  source = source.slice(0, first) + newText + source.slice(first + oldText.length);
}
function replaceRegexOnce(regex, replacement, label) {
  const hits = source.match(new RegExp(regex.source, regex.flags.replace('g', '') + 'g')) || [];
  if (hits.length !== 1) throw new Error(`padrão não único (${label}): ${hits.length}`);
  source = source.replace(regex, replacement);
}

// O construtor de face e as quatro paletas pertencem ao módulo de cenário.
between('// Bloco com faces coloridas', 'const ringGeo=', 'const ringGeo=', 'paletas do terreno');
// Geometrias de árvores/rochas/props/flores deixam o escopo principal.
between('// Modelos, material e instanciação das árvores ficam no módulo assets/js/tree/trees.js.', 'function buildBody(P){',
  'const DECORATIONS=window.DECORATION_MODULE({THREE,boxGeo,mergeBoxes,mat,vox,vcMat,rand,randi,TAU,pick});\n\n', 'geometrias decorativas');
// O render do terreno e a distribuição dos props passam a ser responsabilidade do módulo.
between('function buildField(){', '/* ================= entidades ================= */',
  'function buildField(){\n  const{trees,rocks}=genField();\n  const field=DECORATIONS.buildField({level,trees,rocks,grid,hgt,W,H,relief,jv,nz,nz2,isWall});\n  landPos=field.landPos;chests=field.chests;totems=field.totems;flameMat=field.flameMat;fireFx=field.fireFx;\n}\n\n', 'montagem do campo');
// Props de menu e galeria ficam no módulo.
between('// caixão de madeira escura com bandas de ferro e cruz dourada — aberto mostra o lençol e um brilho fantasma', '/* ================= menu 3D ================= */', '', 'modelos decorativos');

// Paisagismo do menu.
between('  { // chão do título com a MESMA lógica do campo do jogo:', '  const tG=',
  '  DECORATIONS.buildMenuLandscape(menuGroup,{nz,nz2,jv});\n', 'paisagismo do título');
replaceOnce('  const tG=new THREE.Group();tG.position.set(-10.2,0,2.7);tG.rotation.y=1.75;tG.scale.setScalar(.92);menuGroup.add(tG);tG.add(buildTardis());tGref=tG; // a cabine do Smith — só aparece com ele liberado',
  '  tGref=DECORATIONS.buildMenuTardis(menuGroup); // cabine do tempo do Smith', 'TARDIS do menu');
between('  // cemitério com os caixões: morada do Vampiro quando ele está liberado', '  // cortejo real:',
  '  cemeG=DECORATIONS.buildMenuCemetery(menuGroup);\n', 'cemitério do menu');
between('  royalGrp=new THREE.Group();menuGroup.add(royalGrp);', '  // cemitério do Necromante:',
  '  royalGrp=DECORATIONS.buildMenuRoyalCourt(menuGroup);\n', 'cortejo real');
between('  necroG=new THREE.Group();menuGroup.add(necroG);', '  [[6.4,-6.8],[7.7,-7.5],[6.8,-8.4]].forEach',
  '  necroG=DECORATIONS.buildMenuNecroGraves(menuGroup);\n', 'cemitério do necromante');
between('  // fogueira no centro da praça: os três principais acampam em volta dela (tela de título)', '  ORDER.forEach((k,i)=>{const h=buildHero(k);',
  '  const campfire=DECORATIONS.buildMenuCampfire(menuGroup);fireGroup=campfire.group;flames=campfire.flames;fireLight=campfire.light;smokesM=campfire.smokes;\n', 'fogueira do título');
// O pedestal e o anel do fogo também são construídos pelo sistema visual.
replaceOnce('let menuT=0,menuAtk=0,mcx=0,mcy=2.1,mcz=6.6,mly=.75,mclx=0,mclz=0,podium=null;',
  'let menuT=0,menuAtk=0,mcx=0,mcy=2.1,mcz=6.6,mly=.75,mclx=0,mclz=0,podium=DECORATIONS.buildHeroPodium(menuGroup);', 'pódio');
replaceRegexOnce(/^podium=new THREE\.Mesh\(new THREE\.CircleGeometry\(\.85,28\),new THREE\.MeshBasicMaterial\(\{color:0xf2b84b,transparent:true,opacity:\.14,depthWrite:false\}\)\);podium\.rotation\.x=-Math\.PI\/2;podium\.position\.y=\.03;menuGroup\.add\(podium\); \/\/ palco do herói no seletor\r?\n/m, '', 'criação do pódio');
between('  const rg=new THREE.Group();rg.position.y=.03;menuGroup.add(rg);menuRing=rg;', '  scene.add(menuGroup);',
  '  const fireRing=DECORATIONS.buildMenuFireRing(menuGroup,flatMesh);menuRing=fireRing.group;fireGlow=fireRing.glow;fireRim=fireRing.rim;\n', 'anel de fogo do menu');
replaceOnce('const mkRef=(k,i)=>{const C=CLASSES[k];const[f,rr]=slotOf(i);const g=new THREE.Group();',
  'const mkRef=(k,i)=>{const C=CLASSES[k];const[f,rr]=slotOf(i);const g=DECORATIONS.buildClassPedestal(C.ui);', 'pedestal das classes');
replaceOnce('vox(g,0,.21,0,.3,.42,.2,0x837e74);vox(g,0,.47,0,.36,.08,.24,0x8f8a80);vox(g,0,.56,0,.12,.14,.12,C.ui,1); // pedestal + cristal da cor da classe',
  '', 'geometria do pedestal');

// Itens de galeria e grupos de árvores/rochas usam a API nova.
for (const [from,to] of [
  ['buildTardis','DECORATIONS.buildTardis'],['buildRoyalThrone','DECORATIONS.buildRoyalThrone'],['buildCoffin','DECORATIONS.buildCoffin'],['buildChestDisplay','DECORATIONS.buildChestDisplay'],
  ['TREE_SYSTEM','DECORATIONS.TREE_SYSTEM'],['TREE_GEOS','DECORATIONS.TREE_GEOS'],['treeMat','DECORATIONS.treeMat'],['ROCK_GEOS','DECORATIONS.ROCK_GEOS'],['DECOR_GEO','DECORATIONS.DECOR_GEO']
]) source = source.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
// Remover adaptadores de baú/totem que agora são internos ao sistema de decorações.
between('// totem de íma (uso único): pilar de pedra com íma flutuando. Ao gastar, o íma apaga e sobra uma tampa escura', 'function ensureGalScene(){',
  '', 'adaptadores de props');
fs.writeFileSync(path, source, 'utf8');
console.log('game.js atualizado com o sistema de decorações externo.');
