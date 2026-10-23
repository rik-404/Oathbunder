/* ================= ARMA: AURA DE BRASA ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.aura = {
    nome: 'Aura de Brasa',
    desc: l => `Queima tudo num raio de ${(1.7 + .3 * l).toFixed(1).replace('.', ',')} m, ${5 + 4 * l} de dano a cada 0,5 s.`
  };

  let auraT = 0, auraFx = null, auraFlares = [], auraStains = [];

  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => {
    auraT = 0;
    auraFx = null;
    auraFlares.length = 0;
    auraStains.length = 0;
  });

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).aura = function (dt, C) {
    const Wp = C.player.weap, st = C.player.stats;

    if (!auraFx) {
      auraFx = new C.THREE.Group();
      C.wGroup.add(auraFx);

      for (let i = 0; i < 5; i++) {
        const a = C.rand(0, C.TAU), r = C.rand(.08, .6);
        const s = C.flatMesh(new C.THREE.CircleGeometry(C.rand(.28, .5), 20), C.pick([0xff8a2a, 0xd9571e]), C.rand(.07, .13));
        s.userData.own = false;
        s.position.set(Math.sin(a) * r, C.rand(0, .014), Math.cos(a) * r);
        auraFx.add(s);
        auraStains.push({ m: s, ph: C.rand(0, C.TAU), op: s.material.opacity });
      }

      for (let i = 0; i < 14; i++) {
        const g = new C.THREE.Group();
        C.vox(g, 0, .09, 0, .1, .18, .1, C.pick([0xffb02f, 0xff9a1f]), 1);
        const t = C.vox(g, 0, .23, 0, .065, .12, .065, 0xff4a1a, 1);
        t.rotation.x = C.rand(-.3, .3);

        const fa = i / 14 * C.TAU + C.rand(-.15, .15), fr = .92 + C.rand(-.1, .14);
        g.position.set(Math.sin(fa) * fr, 0, Math.cos(fa) * fr);
        auraFx.add(g);
        auraFlares.push({ g, ph: C.rand(0, C.TAU), base: .8 + C.rand(-.25, .3), cur: .5 });
      }
    }

    const R = (1.7 + .3 * Wp.aura) * st.area;
    auraFx.position.set(C.player.x, .04, C.player.z);
    auraFx.scale.setScalar(R);
    auraFx.rotation.y += dt * .6;

    for (const fl of auraFlares) {
      const tgt = Math.sin(C.runTime * .7 + fl.ph * 3.1) > .0 ? fl.base : 0;
      fl.cur += (tgt - fl.cur) * Math.min(1, dt * 7);
      const w = .3 + .7 * fl.cur * (.75 + .35 * Math.sin(C.runTime * 8 + fl.ph * 5));
      fl.g.scale.set(w, w, w);
    }

    for (const sn of auraStains)
      sn.m.material.opacity = sn.op * (.7 + .4 * Math.sin(C.runTime * 2.5 + sn.ph * 2));

    auraT -= dt;
    if (auraT <= 0) {
      auraT = .5;
      for (const e of C.enemies.slice()) {
        if (Math.hypot(e.x - C.player.x, e.z - C.player.z) < R + e.r) {
          const r = C.roll(5 + 4 * Wp.aura);
          C.damageEnemy(e, r.d, r.crit, 0, 0, true);
        }
      }
      if (Math.random() < .8)
        C.burst(C.player.x + C.rand(-R, R) * .7, .1, C.player.z + C.rand(-R, R) * .7, 0xff8a3a, 2, { emi: 1, speed: .5, up0: 1, up1: 2.5, grav: 0, life: .5, size: .1 });
    }
  };
})();
