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
          [-.1, .84, .18, .05, .09, .035, 0xf0ead8],  // presas
          [.1, .84, .18, .05, .09, .035, 0xf0ead8],
          [0, .84, .18, .12, .045, .035, 0x321e16],    // mandíbula escura
          [0, 1.1, 0, .42, .12, .4, 0x3b2919],         // elmo de couro
          [-.22, 1.08, 0, .11, .18, .11, 0xd9c99c],    // chifres de osso
          [.22, 1.08, 0, .11, .18, .11, 0xd9c99c],
          [0, 1.18, -.02, .16, .08, .13, 0xa83d28],    // crista vermelha
          [-.08, 1.04, .195, .12, .045, .04, 0x3d2718],// sobrancelhas pesadas
          [.08, 1.04, .195, .12, .045, .04, 0x3d2718],
          [0, .59, .162, .34, .3, .055, 0x49321f],     // peitoral de couro
          [-.16, .6, .196, .07, .3, .035, 0xb37d3d],   // tiras e costuras
          [.16, .6, .196, .07, .3, .035, 0x6a4828],
          [0, .58, .199, .1, .1, .03, 0xf2ad35],      // emblema âmbar
          [0, .37, .158, .47, .12, .32, 0x51361f],     // cinto largo
          [0, .37, .329, .16, .09, .045, 0xd7b65a],    // fivela
          [-.34, .73, 0, .3, .25, .36, 0x566c35],      // ombreiras maciças
          [.34, .73, 0, .3, .25, .36, 0x566c35],
          [-.4, .84, 0, .09, .12, .1, 0xd5c79d],       // rebites de osso
          [.4, .84, 0, .09, .12, .1, 0xd5c79d],
          [-.3, .47, .17, .2, .12, .09, 0x71502e],     // braçadeiras
          [.3, .47, .17, .2, .12, .09, 0x71502e],
          [-.1, .55, .2, .035, .12, .025, 0xd95532],   // cicatriz no peitoral
          [.34, .45, .43, .08, .09, .5, 0x4a321c],     // cabo da clava
          [.34, .45, .68, .3, .3, .3, 0x725234],       // cabeça pesada
          [.34, .45, .69, .34, .1, .32, 0x5b432a],     // faixa atravessada
          [.34, .45, .55, .12, .12, .05, 0xa28a5a],    // anéis metálicos
          [.34, .45, .64, .12, .12, .05, 0xa28a5a],
          [.34, .61, .69, .09, .13, .1, 0x493521],     // espinhos da clava
          [.34, .29, .69, .09, .13, .1, 0x493521],
          [.14, .45, .69, .13, .09, .1, 0x493521],
          [.54, .45, .69, .13, .09, .1, 0x493521],
          [.34, .45, .85, .1, .1, .1, 0x493521]
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
