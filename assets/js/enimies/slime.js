// Slime verde — corpo gosmento simples (sem pernas/asas)
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).slime = function(humanoid) {
  return {
    legged: false,
    fly: false,
    stats: { hp: 22, speed: 2.6, r: .36, dmg: 7, h: .75, color: 0x5fcf5a, xp: 1 },
    boxes: function() {
      return [
        [0, .27, 0, .72, .54, .72, 0x5fcf5a],      // corpo principal
        [0, .58, 0, .3, .08, .3, 0x7fe07a],         // topo brilhante
        [-.14, .38, .362, .1, .12, .01, 0x0d0b12],  // olho esq
        [.14, .38, .362, .1, .12, .01, 0x0d0b12],   // olho dir
        [0, .2, .362, .2, .04, .01, 0x2f6a2a]       // boca/brilho
      ];
    },
    // IA: persegue o jogador diretamente, dano no contato
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 1.2;
      }
    }
  };
};