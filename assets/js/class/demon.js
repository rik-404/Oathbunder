/* ================= CLASSE: DEMÔNIO ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.demon = {
  nome: 'Castiel',
  role: 'Lança fogo infernal e explode em chamas',
  ui: '#ff5a2a',
  hp: 110,
  armor: .08,
  speed: 5.2,
  atkCd: .55,
  dmg: 22,
  kind: 'proj',
  proj: 'hellfire',
  projSpeed: 15,
  range: 14,
  pierce: 1,
  ab: {
    nome: 'Inferno',
    cd: 8,
    desc: 'Erupção de chamas ao redor que causa dano alto e arremessa os inimigos.'
  },
  pal: {
    body: 0x121212,
    trim: 0x8d0000,
    skin: 0x1a1a1a,
    legs: 0x151515,
    hat: 0x0c0c0c,
    cape: 0x151515,
    arm: 0x1a1a1a,
    boots: 0x1b1b1b
  },
  stats: { Vida: 4, Dano: 5, Veloc: 3, Alcance: 3 }
};