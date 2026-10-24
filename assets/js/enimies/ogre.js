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
          [0, .56, .12, .5, .4, .12, 0x7aa84a],             // barrigão
          [0, .37, .17, .46, .1, .1, 0x513b27],             // faixa de couro
          [0, .37, .228, .14, .1, .025, 0xd3ad57],          // fivela de latão
          [-.16, .63, .2, .07, .26, .035, 0x8c6c3c],        // tiras do peitoral
          [.16, .63, .2, .07, .26, .035, 0x6d512f],
          [0, .61, .215, .17, .16, .035, 0x34472c],         // placa de osso/esmalte
          [0, .61, .24, .07, .07, .02, 0xd9c779],           // runa no peito
          [-.24, .51, .12, .12, .15, .12, 0x8da957],        // verrugas do ventre
          [.25, .57, .14, .09, .11, .08, 0x97b65d],
          [-.09, .82, .172, .055, .1, .04, 0xf0ead8],       // presas curvas
          [.09, .82, .172, .055, .1, .04, 0xf0ead8],
          [0, .79, .18, .13, .045, .04, 0x3c3320],          // boca escura
          [-.2, .96, 0, .08, .12, .1, 0x7aa84a],            // orelhas largas
          [.2, .96, 0, .08, .12, .1, 0x7aa84a],
          [-.2, 1.01, .025, .04, .045, .045, 0xd1b76d],     // brincos
          [.2, 1.01, .025, .04, .045, .045, 0xd1b76d],
          [0, 1.14, -.02, .34, .12, .32, 0x2a1f14],         // cabelo desgrenhado
          [-.13, 1.19, -.02, .12, .1, .12, 0x3b2a1d],
          [.13, 1.19, -.02, .12, .1, .12, 0x3b2a1d],
          [-.08, 1.04, .177, .13, .06, .04, 0x4b3a24],       // sobrancelhas pesadas
          [.08, 1.04, .177, .13, .06, .04, 0x4b3a24],
          [-.05, .99, .19, .035, .025, .018, 0xfff0a0],     // reflexo dos olhos
          [.11, .99, .19, .035, .025, .018, 0xfff0a0],
          [-.34, .73, 0, .28, .23, .34, 0x51412d],           // ombreiras de couro
          [.34, .73, 0, .28, .23, .34, 0x51412d],
          [-.38, .82, .02, .1, .1, .1, 0xd1c49c],            // rebites de osso
          [.38, .82, .02, .1, .1, .1, 0xd1c49c],
          [.3, .42, .3, .1, .1, .58, 0x5a3f26],              // bastão: cabo
          [.3, .42, .64, .28, .28, .3, 0x7a5a3a],           // bastão: cabeça
          [.3, .6, .64, .1, .12, .1, 0x9a9a90],             // nós de pedra
          [.3, .24, .64, .1, .12, .1, 0x9a9a90],
          [.3, .42, .47, .13, .08, .06, 0xb58b4a],          // anéis no cabo
          [.3, .42, .56, .13, .08, .06, 0xb58b4a],
          [.3, .59, .68, .1, .12, .09, 0x4c3824],           // espinhos no topo
          [.3, .25, .68, .1, .12, .09, 0x4c3824]
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
