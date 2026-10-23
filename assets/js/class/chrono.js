/* ================= CLASSE: CHRONOMANTE ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.chrono = {
  nome: 'Vespera',
  role: 'Orbes do tempo que lentificam os inimigos',
  ui: '#5fe08a',
  hp: 95,
  armor: .05,
  speed: 5.4,
  atkCd: .6,
  dmg: 18,
  kind: 'proj',
  proj: 'time',
  projSpeed: 15,
  range: 15,
  pierce: 1,
  ab: {
    nome: 'Distorção Temporal',
    cd: 9,
    desc: 'Quase congela o tempo dos inimigos em volta por 3,5 s e causa dano.'
  },
  pal: {
    body: 0x0c231c,
    trim: 0xbdbd96,
    skin: 0x22302a,
    legs: 0x13092b,
    hat: 0x26423b,
    cape: 0x06150f,
    arm: 0x2f5149,
    boots: 0x0a0514
  },
  stats: { Vida: 3, Dano: 3, Veloc: 4, Alcance: 4 }
};