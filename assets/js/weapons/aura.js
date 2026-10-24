/* ================= ARMA: AURA DE BRASA ================= */
(function () {
  const W = window.WEAPONS = window.WEAPONS || {};
  W.aura = {
    nome: 'Aura de Brasa',
    desc: l => `Queima tudo num raio de ${(1.7 + .3 * l).toFixed(1).replace('.', ',')} m, ${5 + 4 * l} de dano a cada 0,5 s.`
  };

  let auraT = 0, auraFx = null, auraFlares = [], auraEmbers = [], auraHalos = [];

  (window.WEAPON_RESETS = window.WEAPON_RESETS || []).push(() => {
    auraT = 0;
    auraFx = null;
    auraFlares.length = 0;
    auraEmbers.length = 0;
    auraHalos.length = 0;
  });

  function buildAura(C) {
    const root = new C.THREE.Group();
    root.name = 'voxelFireAura';
    root.userData.weaponAura = 'voxel-fire-v2';

    // Selo de calor no chão: disco discreto e dois anéis independentes e pulsantes.
    const ground = C.flatMesh(new C.THREE.CircleGeometry(1, 20), 0x8b2818, .12);
    ground.position.y = .012;
    ground.scale.set(.94, .94, .94);
    root.add(ground);
    const outer = C.flatMesh(new C.THREE.RingGeometry(.91, 1, 24), 0xff5a21, .38);
    outer.position.y = .024;
    root.add(outer);
    auraHalos.push({ m: outer, op: .38, phase: .2 });
    const inner = C.flatMesh(new C.THREE.RingGeometry(.72, .79, 20), 0xffc34b, .48);
    inner.position.y = .03;
    inner.scale.set(.66, .66, .66);
    root.add(inner);
    auraHalos.push({ m: inner, op: .48, phase: 1.7 });

    // Placas de carvão e magma formam uma coroa segmentada, mais legível que uma mancha lisa.
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * C.TAU, tile = new C.THREE.Group();
      const color = i % 4 === 0 ? 0xffb83c : i % 2 ? 0x9b291b : 0xd74620;
      C.vox(tile, 0, .045, 0, i % 4 === 0 ? .13 : .105, .055, .17, color, i % 4 === 0 ? .9 : .35);
      tile.position.set(Math.sin(a) * .87, 0, Math.cos(a) * .87);
      tile.rotation.y = a;
      root.add(tile);
    }

    // Dez torres de chama em blocos escalonados, com base de carvão, brasa e ponta dourada.
    for (let i = 0; i < 10; i++) {
      const g = new C.THREE.Group();
      const phase = i * 2.399 + C.rand(-.2, .2);
      C.vox(g, 0, .055, 0, .19, .09, .18, 0x54201b, .35);
      C.vox(g, -.008, .14, 0, .15, .12, .15, 0xe8441c, 1);
      C.vox(g, .012, .245, -.008, .12, .12, .12, i % 3 ? 0xff8c23 : 0xffb12f, 1.1);
      C.vox(g, -.014, .345, .012, .085, .105, .09, 0xffd45a, 1.15);
      C.vox(g, .022, .435, -.008, .055, .09, .06, 0xff6a1d, 1);
      const a = i / 10 * C.TAU + .12;
      g.position.set(Math.sin(a) * .86, 0, Math.cos(a) * .86);
      g.rotation.y = phase;
      g.userData.auraFlame = true;
      root.add(g);
      auraFlares.push({ g, phase, base: .78 + C.rand(-.12, .2) });
    }

    // Brasas cúbicas orbitam em alturas diferentes, deixando o efeito vivo sem virar fumaça lisa.
    for (let i = 0; i < 12; i++) {
      const g = new C.THREE.Group(), color = i % 3 === 0 ? 0xffdf70 : i % 2 ? 0xff5425 : 0xff9b2e;
      C.vox(g, 0, 0, 0, .065, .075, .065, color, 1.2);
      if (i % 3 === 0) C.vox(g, .025, .035, 0, .035, .035, .035, 0xfff0a0, 1.4);
      g.userData.auraEmber = true;
      root.add(g);
      auraEmbers.push({ g, phase: i / 12 * C.TAU, radius: .48 + (i % 4) * .11, speed: (i % 2 ? 1 : -1) * (1.1 + (i % 3) * .22), height: .25 + (i % 4) * .105, size: .72 + (i % 3) * .16 });
    }

    // Pequeno núcleo em cruz, quase encostado no chão, para amarrar o selo visualmente.
    const core = new C.THREE.Group();
    C.vox(core, 0, .035, 0, .22, .045, .075, 0xff7825, 1);
    C.vox(core, 0, .037, 0, .075, .048, .22, 0xffc54d, 1.1);
    core.userData.auraCore = true;
    root.add(core);

    return root;
  }

  (window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {}).aura = function (dt, C) {
    const Wp = C.player.weap, st = C.player.stats;

    if (!auraFx) {
      auraFx = buildAura(C);
      C.wGroup.add(auraFx);
    }

    const R = (1.7 + .3 * Wp.aura) * st.area;
    auraFx.position.set(C.player.x, .04 + C.player.y, C.player.z);
    auraFx.scale.set(R, 1, R);
    auraFx.rotation.y += dt * .16;

    for (const fl of auraFlares) {
      const wave = Math.sin(C.runTime * 8 + fl.phase * 3);
      const height = fl.base * (.88 + .12 * wave);
      fl.g.scale.set(.92 + .08 * Math.sin(C.runTime * 6 + fl.phase), height, .92 + .08 * Math.cos(C.runTime * 7 + fl.phase));
      fl.g.rotation.z = Math.sin(C.runTime * 9 + fl.phase) * .09;
    }
    for (const ember of auraEmbers) {
      const a = ember.phase + C.runTime * ember.speed;
      ember.g.position.set(Math.sin(a) * ember.radius, ember.height + Math.sin(C.runTime * 5 + ember.phase) * .075, Math.cos(a) * ember.radius);
      ember.g.rotation.y = a * 1.7;
      ember.g.scale.setScalar(ember.size * (.78 + .22 * Math.sin(C.runTime * 11 + ember.phase)));
    }
    for (const halo of auraHalos)
      halo.m.material.opacity = halo.op * (.78 + .22 * Math.sin(C.runTime * 3.2 + halo.phase));

    // Dano e intervalo mantêm o balanceamento já existente: pulso de 0,5 s no mesmo raio.
    auraT -= dt;
    if (auraT <= 0) {
      auraT = .5;
      for (const e of C.enemies.slice()) {
        if (Math.hypot(e.x - C.player.x, e.z - C.player.z) < R + e.r) {
          const r = C.roll(5 + 4 * Wp.aura);
          C.damageEnemy(e, r.d, r.crit, 0, 0, true);
        }
      }
      if (Math.random() < .8) {
        const a = C.rand(0, C.TAU), r = C.rand(.25, .92) * R;
        C.burst(C.player.x + Math.sin(a) * r, .12 + C.player.y, C.player.z + Math.cos(a) * r, 0xff9a32, 3, { emi: 1, speed: .65, up0: .8, up1: 2.2, grav: 0, life: .42, size: .065 });
      }
    }
  };
})();
