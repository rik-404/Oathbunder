// Aranha — inimiga rápida que corre em zigue-zague e dá botes curtos
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).spider = function(humanoid) {
  const BODY  = 0x241530;   // abdômen
  const BODY2 = 0x33203f;   // cefalotórax / brilho
  const LEG   = 0x140b1c;   // pernas
  const JOINT = 0x241530;   // articulações
  const EYE   = 0xff3b3b;   // olhos vermelhos
  const EYE2  = 0xffd0d0;   // brilho dos olhos
  const FANG  = 0xd8d0c0;   // presas

  return {
    legged: false,
    fly: false,
    stats: { hp: 18, speed: 4.8, r: .34, dmg: 6, h: .7, color: BODY, xp: 1 },
    poison: { duration: 3.2, interval: .8, damage: 1.2 },
    boxes: function() {
      const b = [
        // abdômen
        [0, .44, -.26, .52, .42, .6, BODY],
        [0, .52, -.08, .34, .18, .34, BODY2],
        [0, .47, -.44, .3, .22, .22, BODY2],
        [0, .64, -.26, .14, .05, .4, 0x4a2a58],    // faixa clara
        [0, .61, -.22, .12, .04, .2, 0x7a3a8a],    // marca
        // cefalotórax + cabeça
        [0, .36, .12, .38, .3, .42, BODY2],
        [0, .32, .34, .26, .22, .2, BODY],
        // olhos (4 grandes + 2 brilhantes)
        [-.08, .38, .45, .05, .05, .02, EYE],
        [.08, .38, .45, .05, .05, .02, EYE],
        [-.13, .42, .43, .035, .035, .02, EYE],
        [.13, .42, .43, .035, .035, .02, EYE],
        [-.03, .31, .46, .03, .03, .02, EYE2],
        [.03, .31, .46, .03, .03, .02, EYE2],
        // presas
        [-.06, .22, .46, .045, .09, .045, FANG],
        [.06, .22, .46, .045, .09, .045, FANG]
      ];
      return b;
    },
    legColors: { leg: LEG, joint: JOINT, foot: 0x0c0712 },
    // Quatro pares com fases alternadas (marcha de tripod) para articulação independente.
    legs: function() {
      const zs = [-.34, -.14, .06, .24], out = [];
      for (const side of [-1, 1]) for (let pair = 0; pair < zs.length; pair++)
        out.push({ side, z: zs[pair], phase: (pair % 2 ? Math.PI : 0) + (side > 0 ? Math.PI : 0) });
      return out;
    },
    // IA base: dano no contato (o bote é tratado no updEnemy)
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 1;
      }
    }
  };
};
