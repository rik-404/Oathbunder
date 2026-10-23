// Ogro — inimigo humanoide grande com bastão (com pernas animadas)
// Versão comum (bem mais fraca que o boss)
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).ogre = function(humanoid) {
  return {
    legged: true,
    stats: { hp: 200, speed: 2.0, r: .52, dmg: 19, h: 1.9, color: 0x7aa84a, xp: 8, scale: 1.55 },
    // Perna grossa em 3 peças
    leg: [
      [0, -.15, 0, .18, .30, .2, 0x5a4a2e],
      [0, -.265, 0, .18, .15, .2, 0x5a4a2e],
      [0, -.31, .03, .19, .06, .28, 0x3a2a1a]
    ],
    boxes: function() {
      return humanoid({
        legs: 0x5a4a2e,
        body: 0x6a5a3a,
        trim: 0x4a3a28,
        skin: 0x7aa84a,
        arm: 0x7aa84a,
        eye: 0xffd24a
      }, {
        extra: [
          [0, .56, .12, .5, .4, .12, 0x7aa84a],            // barrigão
          [-.09, .82, .172, .045, .08, .03, 0xf0ead8],     // presa esq
          [.09, .82, .172, .045, .08, .03, 0xf0ead8],      // presa dir
          [-.2, .96, 0, .06, .1, .08, 0x7aa84a],           // orelha esq
          [.2, .96, 0, .06, .1, .08, 0x7aa84a],            // orelha dir
          [0, 1.14, -.02, .3, .1, .3, 0x2a1f14],           // cabelo
          [.3, .42, .3, .1, .1, .58, 0x5a3f26],            // bastão: cabo
          [.3, .42, .64, .26, .26, .28, 0x7a5a3a],         // bastão: cabeça
          [.3, .6, .64, .1, .12, .1, 0x9a9a90],            // nó de pedra superior
          [.3, .24, .64, .1, .12, .1, 0x9a9a90]            // nó de pedra inferior
        ]
      });
    },
    // IA: anda até o jogador, ataca no contato com bastão (alcance maior)
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 1.8;
      }
    }
  };
};