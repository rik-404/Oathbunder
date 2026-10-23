/* ================= CLASSE: TANK ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.tank = {
  nome: 'Brom',
  role: 'Pancada no chão em volta',
  ui: '#6fa8ff',
  hp: 220,
  armor: .25,
  speed: 4.6,
  atkCd: 1,
  dmg: 22,
  kind: 'slam',
  radius: 2.7,
  knock: 10,
  ab: {
    nome: 'Baluarte',
    cd: 8,
    desc: 'Escudo de 4 s que bloqueia 85% do dano e solta uma onda de choque.'
  },
  pal: {
    body: 0x5d6672,
    trim: 0x2f5fa8,
    skin: 0xd99b74,
    legs: 0x454b55,
    arm: 0x6d7682
  },
  stats: { Vida: 5, Dano: 2, Veloc: 2, Alcance: 3 }
};