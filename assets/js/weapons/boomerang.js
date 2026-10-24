/* ================= ARMA GERAL: BUMERANGUE ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.boomerang = {
    nome: 'Bumerangue',
    desc: l => `Arremessa ${1 + Math.floor((l - 1) / 2)} bumerangue${l >= 3 ? 's' : ''}; cada alvo atingido recebe ${10 + 4 * l} de dano na ida e pode ser atingido de novo na volta.`
  };

  let launchCd = 0, flights = [];
  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => {
    launchCd = 0;
    flights.length = 0;
  });

  function makeBoomerang(C) {
    const g = new C.THREE.Group();
    g.name = 'boomerangProjectile';
    g.userData.weaponProjectile = 'boomerang';
    const parts = [
      [-.29, .17, -.72, .19, .105, .13, 0x8b4a22],
      [-.17, .065, -.43, .19, .105, .13, 0xd17a2c],
      [-.035, -.005, -.12, .2, .105, .14, 0xf2b946],
      [.12, .04, .3, .19, .105, .13, 0xd17a2c],
      [.265, .15, .68, .19, .105, .13, 0x8b4a22]
    ];
    for (const [x, y, rz, w, h, d, color] of parts) {
      const p = C.vox(g, x, y, 0, w, h, d, color, .55);
      p.rotation.z = rz;
    }
    C.vox(g, -.33, .235, 0, .075, .075, .14, 0xffdf78, 1.15);
    C.vox(g, .32, .215, 0, .075, .075, .14, 0xffdf78, 1.15);
    C.vox(g, .015, .025, .078, .11, .07, .035, 0xff6231, 1.1);
    return g;
  }

  (window.WEAPON_PREVIEW_BUILDERS = window.WEAPON_PREVIEW_BUILDERS || {}).boomerang = makeBoomerang;

  function launch(C, level, target) {
    const p = C.player;
    let dx = target.x - p.x, dz = target.z - p.z;
    let distance = Math.hypot(dx, dz);
    if (distance < .001) {
      dx = Math.sin(p.facing);
      dz = Math.cos(p.facing);
      distance = 1;
    }
    const ux = dx / distance, uz = dz / distance;
    const reach = Math.min(11.5, Math.max(3.6, distance + 1.55 + level * .12));
    const g = makeBoomerang(C);
    const x = p.x + ux * .48, z = p.z + uz * .48;
    g.position.set(x, .72 + p.y, z);
    g.rotation.y = Math.atan2(ux, uz);
    g.userData.phase = 'out';
    C.wGroup.add(g);
    flights.push({
      g, x, z, ux, uz, level, reach, phase: 'out', age: 0, spin: 0,
      hitOut: new Set(), hitReturn: new Set()
    });
    C.S('shot', 'rock');
  }

  function hitAlongPath(C, b) {
    const hit = b.phase === 'out' ? b.hitOut : b.hitReturn;
    const sign = b.phase === 'out' ? 1 : -1;
    for (const e of C.enemies.slice()) {
      if (e.dead || hit.has(e) || Math.hypot(e.x - b.x, e.z - b.z) > e.r + .42) continue;
      hit.add(e);
      const r = C.roll(10 + 4 * b.level);
      C.damageEnemy(e, r.d, r.crit, b.ux * 2.2 * sign, b.uz * 2.2 * sign, true);
    }
  }

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).boomerang = function (dt, C) {
    const level = C.player.weap.boomerang;
    launchCd = Math.max(0, launchCd - dt);
    const maxFlying = 1 + Math.floor((level - 1) / 2);
    if (launchCd <= 0 && flights.length < maxFlying) {
      const target = C.nearest(12);
      if (target) {
        launch(C, level, target);
        launchCd = Math.max(1.25, 2.45 - .24 * (level - 1));
      }
    }

    const speed = 11.5 + level * .55;
    for (let i = flights.length - 1; i >= 0; i--) {
      const b = flights[i];
      b.age += dt;
      if (b.phase === 'out') {
        const tx = C.player.x + b.ux * b.reach, tz = C.player.z + b.uz * b.reach;
        const dx = tx - b.x, dz = tz - b.z, d = Math.hypot(dx, dz);
        const step = speed * dt;
        if (d <= step || d < .03) {
          b.x = tx; b.z = tz;
          b.phase = 'return';
          b.g.userData.phase = 'return';
        } else {
          b.x += dx / d * step;
          b.z += dz / d * step;
        }
      } else {
        const dx = C.player.x - b.x, dz = C.player.z - b.z, d = Math.hypot(dx, dz);
        if (d < .58) {
          C.wGroup.remove(b.g);
          flights.splice(i, 1);
          continue;
        }
        const step = Math.min(d, speed * dt);
        b.x += dx / d * step;
        b.z += dz / d * step;
      }

      hitAlongPath(C, b);
      b.spin += dt * (b.phase === 'out' ? 15 : -17);
      const face = b.phase === 'out' ? 1 : -1;
      b.g.position.set(b.x, .72 + C.player.y + Math.sin(b.age * 10) * .09, b.z);
      b.g.rotation.y = Math.atan2(b.ux * face, b.uz * face);
      b.g.rotation.z = b.spin;
    }
  };
})();
