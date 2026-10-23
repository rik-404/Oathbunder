/* ================= ARMA: CANHÃO DE ESTILHAÇOS ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.shot = {
    nome: 'Canhão de Estilhaços',
    desc: l => `A cada ${(1.5 - .15 * l).toFixed(1).replace('.', ',')} s, atira ${l + 2} estilhaços em leque no mais perto (${4 + 3 * l} de dano cada).`
  };

  let shotT = 0;

  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => { shotT = 0; });

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).shot = function (dt, C) {
    const Wp = C.player.weap;
    shotT -= dt;
    if (shotT > 0) return;

    const tg = C.nearest(13);
    if (!tg) return;

    shotT = 1.5 - .15 * Wp.shot;
    const a = Math.atan2(tg.x - C.player.x, tg.z - C.player.z), n = Wp.shot + 2;

    for (let i = 0; i < n; i++) {
      const aa = a + (i - (n - 1) / 2) * .22, r = C.roll(4 + 3 * Wp.shot);
      C.spawnProj({ x: C.player.x + Math.sin(aa) * .4, z: C.player.z + Math.cos(aa) * .4, y: .7 + C.player.y, a: aa, speed: 15, dmg: r.d, crit: r.crit, owner: 'p', kind: 'rock', pierce: 0, r: .14, life: .85 });
    }
    C.S('shot', 'rock');
  };
})();
