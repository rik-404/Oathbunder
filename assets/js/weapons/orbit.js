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

  function buildOrb(C) {
    const g = new C.THREE.Group();
    g.name = 'orbitOrb';
    const core = new C.THREE.Mesh(C.PROJ_GEO.orb, C.projMat);
    core.scale.setScalar(.52);
    g.add(core);
    g.userData.orbitCore = core;
    // Duas órbitas de segmentos voxel em planos cruzados, em metal e brasa.
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const band = C.vox(g, Math.cos(a) * .27, 0, Math.sin(a) * .27, .12, .045, .065,
        i % 2 ? 0xe7a84e : 0x6e263d, i % 2 ? .35 : .2);
      band.rotation.y = -a;
      const crossBand = C.vox(g, Math.cos(a) * .255, Math.sin(a) * .255, 0, .105, .045, .055,
        i % 2 ? 0xff7440 : 0x9e3650, .35);
      crossBand.rotation.z = a + Math.PI / 2;
    }
    // Quatro facetas suspensas e os polos que fecham a silhueta da esfera.
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const shard = C.vox(g, Math.cos(a) * .21, 0, Math.sin(a) * .21, .075, .11, .075,
        i % 2 ? 0xffb34c : 0xf04c32, .65);
      shard.rotation.y = -a;
      shard.rotation.z = i % 2 ? Math.PI / 4 : -Math.PI / 4;
    }
    C.vox(g, 0, .31, 0, .095, .095, .095, 0xffc56a, .75).rotation.y = Math.PI / 4;
    C.vox(g, 0, -.31, 0, .095, .095, .095, 0x8d2c43, .35).rotation.y = Math.PI / 4;
    const lens = C.vox(g, 0, 0, .205, .12, .12, .045, 0xffe5a6, .9);
    lens.rotation.z = Math.PI / 4;
    C.vox(g, 0, 0, .232, .045, .045, .018, 0xffffff, 1);
    C.vox(g, 0, 0, -.205, .085, .085, .045, 0xc44a38, .5);
    return g;
  }

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).orbit = function (dt, C) {
    const Wp = C.player.weap, st = C.player.stats;
    const n = Math.min(6, 1 + Wp.orbit);

    while (orbMeshes.length < n) {
      const m = buildOrb(C);
      m.scale.setScalar(.78);
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
      m.position.set(ox, .75 + C.player.y + Math.sin(orbAng * 2 + i) * .045, oz);
      m.rotation.y += dt * 8;
      if (m.userData.orbitCore) {
        m.userData.orbitCore.rotation.x += dt * 2.2;
        m.userData.orbitCore.rotation.y -= dt * 3.4;
      }

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
