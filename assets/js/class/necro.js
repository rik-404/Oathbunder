/* ================= CLASSE: NECROMANTE ================= */
window.CLASSES = window.CLASSES || {};
window.CLASSES.necro = {
  nome: 'Necronus',
  role: 'Ergue esqueletos que lutam por você',
  ui: '#7ee0a8',
  hp: 85,
  armor: 0,
  speed: 5.2,
  atkCd: .8,
  dmg: 16,
  kind: 'proj',
  proj: 'skull',
  projSpeed: 13,
  range: 13,
  pierce: 0,
  ab: {
    nome: 'Legião dos Mortos',
    cd: 9,
    desc: 'Ergue 3 esqueletos na hora e cura os seus.'
  },
  pal: {
    body: 0x1f1b18,
    trim: 0x666561,
    skin: 0xcabfa1,
    legs: 0x141210,
    hat: 0x403e39,
    arm: 0x666561,
    boots: 0x0a0908
  },
  stats: { Vida: 3, Dano: 3, Veloc: 3, Alcance: 4 }
};