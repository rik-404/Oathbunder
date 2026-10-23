/* ================= CLASSE: REI ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.king = {
  nome: 'Midas',
  role: 'Arremessa moedas e convoca a guarda real',
  ui: '#f2c14b',
  hp: 105,
  armor: .1,
  speed: 5,
  atkCd: .5,
  dmg: 17,
  kind: 'proj',
  proj: 'gcoin',
  projSpeed: 17,
  range: 14,
  pierce: 1,
  ab: {
    nome: 'Convocar a Guarda',
    cd: 10,
    desc: 'Chama 4 soldados reais que lutam por você.'
  },
  pal: {
    body: 0x990000,
    trim: 0xe3ab28,
    skin: 0xc48b6a,
    legs: 0xe8e8e8,
    hat: 0xe3ab28,
    cape: 0x8a1212,
    arm: 0xa10000,
    boots: 0x282828,
    eye: 0x1a3fd1
  },
  stats: { Vida: 3, Dano: 3, Veloc: 3, Alcance: 4 }
};