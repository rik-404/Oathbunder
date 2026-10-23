/* ================= CLASSE: PISTOLEIRO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.pistol = {
  nome: 'Cassian',
  role: 'Tiros rápidos e certeiros no mais perto',
  ui: '#e0a94f',
  hp: 88,
  armor: 0,
  speed: 5.7,
  atkCd: .4,
  dmg: 9,
  kind: 'proj',
  proj: 'bullet',
  projSpeed: 30,
  range: 15,
  pierce: 0,
  critBase: .15,
  ab: {
    nome: 'Saque Rápido',
    cd: 6,
    desc: 'Num piscar, atira em até 6 inimigos próximos com crítico garantido.'
  },
  pal: {
    body: 0x6e4a2e,
    trim: 0xe0a94f,
    skin: 0xe8b48a,
    legs: 0x3a2a1c,
    hat: 0x4a3222,
    cape: 0x8a3a2a,
    arm: 0x6e4a2e
  },
  stats: { Vida: 2, Dano: 3, Veloc: 5, Alcance: 4 }
};