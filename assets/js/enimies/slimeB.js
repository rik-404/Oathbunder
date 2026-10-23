// Slime Azul (variante) — corpo gosmento azulado
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).slimeB = function(humanoid) {
  return {
    legged: false,
    fly: false,
    stats: { hp: 30, speed: 3, r: .36, dmg: 8, h: .75, color: 0x4fb8d8, xp: 1 },
    boxes: function() {
      return [
        [0, .27, 0, .72, .54, .72, 0x4fb8d8],       // corpo principal azul
        [0, .58, 0, .3, .08, .3, 0x7fd4ee],          // topo brilhante
        [-.14, .38, .362, .1, .12, .01, 0x0d0b12],   // olho esq
        [.14, .38, .362, .1, .12, .01, 0x0d0b12]     // olho dir
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