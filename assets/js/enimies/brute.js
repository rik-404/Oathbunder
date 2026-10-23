// Brute — inimigo humanoide grande e forte (com pernas animadas)
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).brute = function(humanoid) {
  return {
    legged: true,
    stats: { hp: 120, speed: 1.9, r: .5, dmg: 16, h: 1.7, color: 0x6f9a44, xp: 5, scale: 1.45 },
    // Perna em 3 peças (fêmur, tíbia, pé)
    leg: [
      [0, -.15, 0, .16, .30, .18, 0x4a3424],
      [0, -.265, 0, .162, .15, .182, 0x4a3424],
      [0, -.31, .03, .16, .06, .26, 0x3a2a1a]
    ],
    boxes: function() {
      return humanoid({
        legs: 0x4a3424,
        body: 0x6a4a2e,
        trim: 0x3a2a1a,
        skin: 0x6f9a44,
        arm: 0x6f9a44,
        eye: 0xffd040
      }, {
        extra: [
          [-.1, .84, .18, .04, .09, .03, 0xf0ead8],   // dente esq
          [.1, .84, .18, .04, .09, .03, 0xf0ead8],    // dente dir
          [0, 1.15, 0, .36, .05, .36, 0x2a1f14],     // cabelo/cabeça
          [.3, .42, .3, .09, .09, .5, 0x5a3a22],      // arma cabo
          [.3, .42, .6, .22, .22, .3, 0x7a5a3a]       // arma cabeça
        ]
      });
    },
    // IA: anda até o jogador, ataca no contato com cooldown
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 1.5;
      }
    }
  };
};