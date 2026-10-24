// Slime verde — corpo gosmento simples (sem pernas/asas)
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).slime = function(humanoid) {
  return {
    legged: false,
    fly: false,
    stats: { hp: 22, speed: 2.6, r: .36, dmg: 7, h: .75, color: 0x5fcf5a, xp: 1 },
    boxes: function() {
      return [
        [0, .08, 0, .76, .16, .7, 0x246b32],                 // sombra/pudim escuro na base
        [-.15, .15, .02, .26, .16, .62, 0x368c3c],            // gota lateral esquerda
        [.17, .15, -.02, .25, .16, .61, 0x32863a],            // gota lateral direita
        [0, .25, 0, .74, .32, .6, 0x3fb248],                  // corpo principal
        [0, .43, -.02, .62, .24, .54, 0x55c957],              // ombros arredondados em degraus
        [-.13, .51, -.04, .3, .14, .38, 0x69d964],            // volume lateral alto
        [.1, .58, -.07, .2, .18, .2, 0x80e875],               // pequeno tufo de gel
        [.16, .68, -.07, .1, .08, .1, 0xb4fa8f],              // gotícula no topo
        [-.145, .38, .316, .09, .13, .025, 0x102318],          // olho esquerdo
        [.145, .38, .316, .09, .13, .025, 0x102318],           // olho direito
        [-.16, .416, .334, .03, .035, .012, 0xe2ffd1],         // brilho dos olhos
        [.13, .416, .334, .03, .035, .012, 0xe2ffd1],
        [-.25, .29, .309, .065, .045, .018, 0x80df66],         // pintinhas nas bochechas
        [.25, .29, .309, .065, .045, .018, 0x80df66],
        [-.048, .235, .315, .045, .025, .018, 0x1e5129],       // sorriso em dois pixels
        [.048, .235, .315, .045, .025, .018, 0x1e5129],
        [-.22, .49, .278, .095, .045, .018, 0x9aec7a],         // reflexos quadrados na superfície
        [.02, .54, .278, .065, .035, .018, 0xc0f58e],
        [.25, .47, .278, .055, .035, .018, 0x79dc69]
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
