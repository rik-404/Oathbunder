/* ================= CLASSE: HUMANO (ZÉ) ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.human = {
  nome: 'Zé',
  role: 'Joga pedra. É isso mesmo.',
  ui: '#b0a089',
  hp: 50,
  armor: 0,
  speed: 2.6,
  atkCd: .6,
  dmg: 6,
  kind: 'proj',
  proj: 'rock',
  projSpeed: 13,
  range: 9,
  pierce: 0,
  ab: {
    nome: 'Pedrada Caprichada',
    cd: 5,
    desc: 'Joga 3 pedras de uma vez, com bastante vontade. Pronto, esse é o poder especial.'
  },
  pal: {
    body: 0x12b5b5,
    trim: 0x3838c8,
    skin: 0xc08a5f,
    legs: 0x3838c8,
    hat: 0x4a2f1e,
    arm: 0xc08a5f,
    boots: 0x555a60
  },
  stats: { Vida: 1, Dano: 1, Veloc: 1, Alcance: 1 }
};