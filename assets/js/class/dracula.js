/* ================= CLASSE: DRÁCULA ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.dracula = {
  nome: 'Vlad',
  role: 'Lança morcegos e drena a vida dos inimigos',
  ui: '#c23a55',
  hp: 100,
  armor: .05,
  speed: 5.3,
  atkCd: .5,
  dmg: 16,
  kind: 'proj',
  proj: 'batp',
  projSpeed: 16,
  range: 14,
  pierce: 1,
  lsBase: .12,
  ab: {
    nome: 'Enxame de Morcegos',
    cd: 8,
    desc: 'Solta um enxame que fere tudo em volta e cura você com o dano causado.'
  },
  pal: {
    body: 0x141414,
    trim: 0x0a0a0a,
    skin: 0xe7ae82,
    legs: 0x202020,
    hat: 0x141414,
    cape: 0x1c0507,
    arm: 0x141414,
    boots: 0x0a0a0a
  },
  stats: { Vida: 3, Dano: 4, Veloc: 3, Alcance: 3 }
};