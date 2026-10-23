/* ================= ARMA: ORBES GIRATÓRIOS ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.orbit = {
    nome: 'Orbes Giratórios',
    desc: l => `${Math.min(6, 1 + l)} orbes giram em volta de você, ${9 + 5 * l} de dano por toque.`
  };

  let orbMeshes = [], orbAng = 0;

  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => {
    orbMeshes.length = 0;
    orbAng = 0;
  });

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).orbit = function (dt, C) {
    const Wp = C.player.weap, st = C.player.stats;
    const n = Math.min(6, 1 + Wp.orbit);

    while (orbMeshes.length < n) {
      const m = new C.THREE.Mesh(C.PROJ_GEO.orb, C.projMat);
      m.scale.setScalar(1.15);
      C.wGroup.add(m);
      orbMeshes.push(m);
    }

    orbAng += dt * (2.6 + Wp.orbit * .25);
    const R = 2.2 * st.area, dmg = 9 + 5 * Wp.orbit;

    for (let i = 0; i < n; i++) {
      const a = orbAng + i / n * C.TAU;
      const ox = C.player.x + Math.sin(a) * R;
      const oz = C.player.z + Math.cos(a) * R;
      const m = orbMeshes[i];
      m.position.set(ox, .75 + C.player.y, oz);
      m.rotation.y += dt * 8;

      for (const e of C.enemies.slice()) {
        if (e.orbCd > C.runTime) continue;
        const dx = e.x - ox, dz = e.z - oz, d = Math.hypot(dx, dz) || .01;
        if (d < .5 + e.r) {
          e.orbCd = C.runTime + .4;
          const r = C.roll(dmg);
          C.damageEnemy(e, r.d, r.crit, dx / d * 3 * st.kb, dz / d * 3 * st.kb, true);
        }
      }
    }
  };
})();
