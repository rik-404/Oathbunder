// Slime Azul (variante) — corpo gosmento azulado
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).slimeB = function(humanoid) {
  return {
    legged: false,
    fly: false,
    stats: { hp: 30, speed: 3, r: .36, dmg: 8, h: .75, color: 0x4fb8d8, xp: 1 },
    boxes: function() {
      return [
        [0, .08, 0, .78, .16, .7, 0x155d7a],                  // base de água profunda
        [-.16, .15, .02, .25, .16, .62, 0x197d9c],             // borda de gel ondulada
        [.16, .15, -.02, .25, .16, .62, 0x197d9c],
        [0, .25, 0, .74, .32, .6, 0x258fb5],                  // massa azul translúcida em degraus
        [0, .43, -.02, .62, .24, .52, 0x36b5d0],
        [-.12, .51, -.04, .3, .14, .38, 0x56d2df],
        [.04, .61, -.035, .24, .16, .24, 0x83eaf0],            // crista central
        [.04, .7, -.035, .12, .08, .13, 0xc2fbff],             // ponta de gelo
        [-.25, .58, -.02, .14, .18, .14, 0x65dce8],            // cristais laterais
        [.27, .54, -.02, .13, .16, .13, 0x72e8f4],
        [-.145, .38, .316, .09, .13, .025, 0x10212c],          // olhos azul-marinho
        [.145, .38, .316, .09, .13, .025, 0x10212c],
        [-.16, .416, .334, .03, .035, .012, 0xe8ffff],         // brilhos gelados
        [.13, .416, .334, .03, .035, .012, 0xe8ffff],
        [-.25, .29, .309, .065, .045, .018, 0x75e5ed],         // bochechas claras
        [.25, .29, .309, .065, .045, .018, 0x75e5ed],
        [-.048, .235, .315, .045, .025, .018, 0x12465d],       // sorriso pequeno
        [.048, .235, .315, .045, .025, .018, 0x12465d],
        [0, .49, .27, .1, .11, .025, 0xe1fdff],                // núcleo de gelo no peito
        [-.22, .49, .268, .08, .04, .018, 0xa9f5fa],           // faixas de reflexo
        [.21, .46, .268, .06, .035, .018, 0xc4fbff]
      ];
    },
    // IA: persegue o jogador diretamente, dano no contato (mais rápido que slime normal)
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 1;
      }
    }
  };
};
