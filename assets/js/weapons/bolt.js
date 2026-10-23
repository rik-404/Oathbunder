/* ================= ARMA: RAIO CELESTE ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.bolt = {
    nome: 'Raio Celeste',
    desc: l => `Raio cai num inimigo a cada ${Math.max(.55, 2.2 - .32 * l).toFixed(1).replace('.', ',')} s, ${28 + 12 * l} de dano${l >= 3 ? ', 2 alvos' : ''}.`
  };

  let boltT = 1;

  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => { boltT = 1; });

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).bolt = function (dt, C) {
    const Wp = C.player.weap;
    boltT -= dt;
    if (boltT > 0) return;

    boltT = Math.max(.55, 2.2 - .32 * Wp.bolt);
    const cnt = Wp.bolt >= 3 ? 2 : 1;
    const near = C.enemies.filter(e => Math.hypot(e.x - C.player.x, e.z - C.player.z) < 15);

    for (let c = 0; c < cnt && near.length; c++) {
      const i = Math.floor(Math.random() * near.length), e = near[i];
      near.splice(i, 1);
      C.boltFX(e.x, e.z);
      const r = C.roll(28 + 12 * Wp.bolt);
      C.damageEnemy(e, r.d, r.crit);
      for (const o of C.enemies.slice())
        if (o !== e && Math.hypot(o.x - e.x, o.z - e.z) < 1.2)
          C.damageEnemy(o, r.d * .4, false, 0, 0, true);
    }
  };
})();
