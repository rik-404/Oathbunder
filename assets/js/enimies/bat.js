// Morcego — inimigo voador com asas animadas
// Visual: corpo roxo/azul, orelhas grandes, olhos amarelos e presas
// IA: circula o jogador, dá um rasante e recua (ver updEnemy no game.js)
// Carregado via <script> antes do game.js
(window.ENEMY_DEFS = window.ENEMY_DEFS || {}).bat = function(humanoid) {
  const BODY_DARK  = 0x1a1038;   // corpo roxo/azul bem escuro
  const BODY_MID   = 0x2d1b4e;   // tom médio
  const BODY_LIGHT = 0x3d2a6b;   // destaque
  const FUR        = 0x241542;   // tufos de pelo
  const EAR_INNER  = 0x5a1a5a;   // interior das orelhas
  const EYE_GLOW   = 0xffd040;   // olhos amarelos brilhantes
  const EYE_CORE   = 0xfff8d0;   // centro dos olhos
  const SOCKET     = 0x120a1e;   // órbita escura
  const FANG       = 0xf0ead8;   // presas
  const CLAW       = 0xcfc7b0;   // garras
  const NOSE       = 0x0d0818;
  const MOUTH      = 0x3a0f2a;

  return {
    legged: false,
    fly: true,
    stats: { hp: 12, speed: 4.3, r: .28, dmg: 5, h: 1.2, color: BODY_MID, xp: 1 },

    boxes: function() {
      return [
        // === CORPO ===
        [0, .96, 0, .34, .30, .30, BODY_DARK],       // torso
        [0, .92, .13, .22, .20, .12, BODY_MID],      // peito/barriga
        [-.19, .99, 0, .10, .16, .20, BODY_MID],     // ombro esq
        [.19, .99, 0, .10, .16, .20, BODY_MID],      // ombro dir
        [0, 1.03, -.08, .14, .03, .20, BODY_LIGHT],  // faixa das costas

        // === CABEÇA ===
        [0, 1.12, .04, .24, .18, .20, BODY_MID],     // cabeça
        [0, 1.07, .16, .12, .08, .10, BODY_LIGHT],   // focinho
        [0, 1.09, .22, .045, .03, .03, NOSE],        // nariz
        [0, 1.03, .17, .10, .025, .05, MOUTH],       // boca
        [-.035, 1.01, .19, .022, .05, .022, FANG],   // presa esq
        [.035, 1.01, .19, .022, .05, .022, FANG],    // presa dir

        // === OLHOS ===
        [-.07, 1.14, .138, .075, .065, .012, SOCKET], // órbita esq
        [.07, 1.14, .138, .075, .065, .012, SOCKET],  // órbita dir
        [-.07, 1.14, .148, .055, .05, .012, EYE_GLOW],// olho esq
        [.07, 1.14, .148, .055, .05, .012, EYE_GLOW], // olho dir
        [-.065, 1.14, .157, .025, .025, .008, EYE_CORE], // pupila esq
        [.065, 1.14, .157, .025, .025, .008, EYE_CORE],  // pupila dir

        // === ORELHAS ===
        [-.12, 1.21, .02, .06, .14, .06, BODY_DARK],  // base esq
        [-.145, 1.30, .02, .035, .10, .035, BODY_DARK],// ponta esq
        [-.12, 1.22, .055, .03, .07, .02, EAR_INNER], // interior esq
        [.12, 1.21, .02, .06, .14, .06, BODY_DARK],   // base dir
        [.145, 1.30, .02, .035, .10, .035, BODY_DARK], // ponta dir
        [.12, 1.22, .055, .03, .07, .02, EAR_INNER],  // interior dir

        // === DETALHES ===
        [-.10, 1.06, -.02, .06, .05, .06, FUR],       // tufo esq
        [.10, 1.06, -.02, .06, .05, .06, FUR],        // tufo dir
        [-.10, .82, -.02, .06, .10, .06, BODY_DARK],  // perna dobrada esq
        [.10, .82, -.02, .06, .10, .06, BODY_DARK],   // perna dobrada dir
        [-.10, .77, .03, .05, .03, .06, CLAW],        // garra esq
        [.10, .77, .03, .05, .03, .06, CLAW],         // garra dir
        [0, .86, -.20, .14, .025, .12, BODY_MID],     // membrana da cauda
        [0, .88, -.27, .04, .04, .10, BODY_DARK]      // cauda
      ];
    },

    // IA base: dano no contato (o rasante/recuo fica no updEnemy)
    ai: function(e, dt, c) {
      if (c.contact && e.cd <= 0) {
        c.hurtPlayer(e.dmg, e, true);
        e.cd = 0.8;
      }
    }
  };
};
