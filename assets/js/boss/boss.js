/* ================= BOSS SYSTEM =================
 * Extracted from game.js for modularity
 * All boss logic: spawning, AI, models, death behavior
 * ============================================= */

// Boss state (will be initialized by game.js)
let boss = null;
let bossCount = 0;
let nextBoss = 240;
let bossKills = 0;
let ogreLoose = false;

// Boss configuration
const BOSS_CONFIG = {
  golem: {
    baseHp: 1100,
    speed: 2.6,
    dmg: 24,
    color: 0x6e6578,
    scale: 1,
    name: 'GOLEM DO CAMPO',
    desc: 'Ele fica mais bravo com metade da vida',
    build: 'buildGolem'
  },
  slimeking: {
    baseHp: 1150,
    speed: 3.2,
    dmg: 25,
    color: 0x5fcf5a,
    scale: 4.4,
    name: 'REI DO SLIME',
    desc: 'Ao cair, o bando inteiro escapa',
    build: 'slime'
  },
  ogre: {
    baseHp: 950,
    speed: 2.9,
    dmg: 27,
    color: 0x7aa84a,
    scale: 1,
    name: 'OGRO BRUTAMONTES',
    desc: 'Cuidado com as bastonadas no chão',
    build: 'buildOgre'
  }
};

// Build functions for boss models (need access to THREE, vox, buildBody, collect, mergeBoxes, vcMat, enemyGeo)
// These will be attached to window.BOSS_BUILDERS by game.js after its dependencies are ready

// ================= BOSS AI =================
function bossAI(e, dt, ux, uz, d) {
  e.phaseT -= dt;
  const rage = e.hp < e.maxHp * 0.5;
  let mx = 0, mz = 0, sp = e.speed * (rage ? 1.2 : 1);

  switch (e.mode) {
    case 'chase':
      mx = ux; mz = uz;
      if (d < e.r + player.r + .15 && e.cd <= 0 && player.y < 1) {
        hurtPlayer(e.dmg * .7, e, true);
        e.cd = 1;
      }
      if (e.phaseT <= 0) {
        const m = pick(d > 5 ? ['ring', 'charge', 'charge'] : ['ring', 'slam', 'slam', 'charge']);
        if (m === 'ring') {
          e.mode = 'ring';
          e.waves = rage ? 4 : 3;
          e.shotT = .35;
        } else if (m === 'charge') {
          e.mode = 'windCharge';
          e.phaseT = rage ? .6 : .8;
          e.cdx = ux; e.cdz = uz;
          lineTelegraph(e.x, e.z, ux, uz, 10, e.phaseT);
        } else {
          e.mode = 'windSlam';
          e.phaseT = rage ? .8 : 1;
          telegraph(e.x, e.z, 3.8, e.phaseT);
        }
      }
      break;

    case 'ring':
      e.shotT -= dt;
      if (e.shotT <= 0) {
        const n = rage ? 18 : 14;
        for (let i = 0; i < n; i++) {
          const a = i / n * TAU + e.waves * .2;
          spawnProj({
            x: e.x + Math.sin(a) * 1.1,
            z: e.z + Math.cos(a) * 1.1,
            y: .7,
            a,
            speed: 6.5,
            dmg: e.dmg * .5,
            owner: 'e',
            kind: 'orb',
            r: .24,
            life: 3
          });
        }
        e.waves--;
        e.shotT = .5;
        addShake(.08);
        if (e.waves <= 0) {
          e.mode = 'chase';
          e.phaseT = rand(1.6, 2.4);
        }
      }
      break;

    case 'windCharge':
      e.faceT = Math.atan2(e.cdx, e.cdz);
      if (e.phaseT <= 0) {
        e.mode = 'charge';
        e.phaseT = .7;
        e.hitP = false;
      }
      break;

    case 'charge': {
      const bl = moveEnt(e, e.cdx * 14 * dt, e.cdz * 14 * dt);
      if (Math.random() < .5) burst(e.x, .1, e.z, 0x8b7a66, 2, { speed: 2 });
      for (const o of enemies) if (o !== e && Math.hypot(o.x - e.x, o.z - e.z) < 1.4) {
        o.kx += e.cdz * 8 * (Math.random() < .5 ? 1 : -1);
        o.kz -= e.cdx * 8;
      }
      if (!e.hitP && d < e.r + player.r + .2 && player.y < 1.2) {
        e.hitP = true;
        hurtPlayer(e.dmg, e, true);
      }
      if (bl || e.phaseT <= 0) {
        e.mode = 'chase';
        e.phaseT = rand(1.8, 2.6);
        if (bl) { addShake(.3); burst(e.x, .5, e.z, 0x8b7a66, 14, { speed: 5 }); }
      }
      break;
    }

    case 'windSlam':
      if (e.phaseT <= 0) {
        if (d < 3.8 + player.r && player.y < .8) hurtPlayer(e.dmg * 1.15, e, true);
        ringFX(e.x, e.z, 3.8, 0xff8a4a, .45);
        burst(e.x, .1, e.z, 0x8b7a66, 26, { speed: 7 });
        addShake(.45);
        if (rage) for (let i = 0; i < 10; i++) {
          const a = i / 10 * TAU;
          spawnProj({
            x: e.x + Math.sin(a) * 1.1,
            z: e.z + Math.cos(a) * 1.1,
            y: .7,
            a,
            speed: 5.5,
            dmg: e.dmg * .45,
            owner: 'e',
            kind: 'orb',
            r: .24,
            life: 3
          });
        }
        e.mode = 'chase';
        e.phaseT = rand(2, 2.6);
      }
      break;
  }

  if (e.mode !== 'chase') sp = 0;
  return [mx, mz, sp];
}

// ================= BOSS SPAWNING =================
function spawnBoss() {
  const SC = scaleT();
  bossCount++;
  const a = player.facing + rand(-.6, .6);
  let x = player.x + Math.sin(a) * 14;
  let z = player.z + Math.cos(a) * 14;

  for (let i = 0; i < 20 && collide(x, z, 1); i++) {
    const b = rand(0, TAU);
    x = player.x + Math.sin(b) * 14;
    z = player.z + Math.cos(b) * 14;
  }

  const cyc = bossCount % 3;
  const isSlime = cyc === 2;
  const isOgre = cyc === 0; // 1º Golem, 2º Rei do Slime, 3º Ogro — em ciclo

  let mdl;
  if (isSlime) {
    const body = new THREE.Mesh(enemyGeo('slime'), vcMat);
    body.castShadow = true;
    const g = new THREE.Group();
    g.add(body);
    mdl = { root: collect(g) }; // o slime comum, ampliado 4.4×
  } else {
    mdl = isOgre ? window.BOSS_BUILDERS.buildOgre() : window.BOSS_BUILDERS.buildGolem();
  }

  const obj = new THREE.Group();
  obj.add(mdl.root);
  obj.position.set(x, 0, z);
  level.add(obj);

  const cfg = isSlime ? BOSS_CONFIG.slimeking : (isOgre ? BOSS_CONFIG.ogre : BOSS_CONFIG.golem);
  const hp = cfg.baseHp * (1 + .8 * (bossCount - 1)) * (1 + runTime / 600);
  const type = isSlime ? 'slimeking' : (isOgre ? 'ogre' : 'golem');

  boss = {
    type,
    x, z,
    r: isSlime ? 1.5 : 1,
    hp,
    maxHp: hp,
    speed: cfg.speed,
    dmg: cfg.dmg * SC.dmg,
    h: 3,
    sc: cfg.scale,
    color: cfg.color,
    obj,
    mdl,
    kx: 0, kz: 0,
    cd: 1, t: 0,
    face: 0, faceT: 0, flash: 0,
    mode: 'chase',
    phaseT: 2.5,
    boss: true,
    xp: 60,
    orbCd: 0,
    dead: false
  };

  enemies.push(boss);
  $('#bossbar').hidden = false;
  $('#bossbar').querySelector('span').textContent = cfg.name;
  toast(cfg.name.replace('O ', 'O ').replace('E ', 'O ') + ' apareceu', cfg.desc);
  addShake(.4);
  S('bossin');
}

// ================= BOSS DEATH BEHAVIOR =================
function handleBossDeath(e) {
  S('bossdie');
  hitStop(.16);

  // Drop rewards
  for (let i = 0; i < 12; i++) dropGem(e.x + rand(-2, 2), e.z + rand(-2, 2), 5);
  dropGem(e.x, e.z, 40);
  for (let i = 0; i < 3; i++) dropPickup(e.x + rand(-1.5, 1.5), e.z + rand(-1.5, 1.5), 'heart');
  for (let i = 0; i < 10; i++) dropPickup(e.x + rand(-1.8, 1.8), e.z + rand(-1.8, 1.8), 'coin', randi(3, 6));

  addShake(.6);
  $('#bossbar').hidden = true;
  boss = null;
  bossKills++;

  // Type-specific death effects
  if (e.type === 'ogre') {
    ogreLoose = true;
    toast('Ogro derrotado!', 'Agora ogros vagam pelo campo...');
  } else if (e.type === 'slimeking') {
    toast('Rei do Slime derrotado!', 'O bando de slimes menores escapou...');
    // Spawn mini slimes that scatter
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + rand(-.25, .25);
      const dd = 2.4 + rand(0, 1.8);
      const sx = e.x + Math.sin(a) * dd;
      const sz = e.z + Math.cos(a) * dd;
      if (!collide(sx, sz, .4)) {
        const mm = spawnEnemy('slime', sx, sz, false, { ms: .55, mini: true });
        if (mm) { mm.kx = Math.sin(a) * 4; mm.kz = Math.cos(a) * 4; }
      }
    }
  } else {
    toast('Golem derrotado!', 'O próximo vai ser mais forte');
  }

  // Unlock Demon class after 5 boss kills
  if (!store.get('cv_unlocked', {}).demon && metaStat().bosses + bossKills >= MISSION.demon.goal) {
    doUnlock('demon');
    toast('😈 ' + CLASSES.demon.nome + ' liberado!', 'Missão cumprida: ' + MISSION.demon.goal + ' Golens derrotados');
  }
}

// ================= BOSS UPDATE (called from main loop) =================
function updateBoss(dt) {
  if (!boss) return;

  // Update boss position and animation
  const M = boss.mdl;
  boss.obj.position.set(boss.x, relief(boss.x, boss.z), boss.z);
  boss.obj.rotation.y = boss.face;
  setFlash(M.root, boss.flash > 0);
  $('#boss-hp').style.width = (clamp(boss.hp / boss.maxHp, 0, 1) * 100) + '%';

  // Run boss AI
  const ux = Math.sin(player.facing);
  const uz = Math.cos(player.facing);
  const d = Math.hypot(boss.x - player.x, boss.z - player.z);
  const [mx, mz, sp] = bossAI(boss, dt, ux, uz, d);

  // Move boss
  if (sp > 0) moveEnt(boss, mx * sp * dt, mz * sp * dt);

  // Handle boss death
  if (boss.hp <= 0) {
    handleBossDeath(boss);
  }
}

// ================= DIRECTOR INTEGRATION =================
function checkBossSpawn(dt) {
  const t = runTime;
  if (t >= nextBoss && !moonOn) {
    nextBoss += 240;
    if (!boss) spawnBoss();
  }
}

// ================= EXPORTS =================
window.BOSS = {
  boss: () => boss,
  setBoss: (v) => { boss = v; },
  bossCount: () => bossCount,
  nextBoss: () => nextBoss,
  setNextBoss: (v) => { nextBoss = v; },
  bossKills: () => bossKills,
  ogreLoose: () => ogreLoose,
  setOgreLoose: (v) => { ogreLoose = v; },
  spawnBoss,
  bossAI,
  handleBossDeath,
  updateBoss,
  checkBossSpawn,
  BOSS_CONFIG
};

// Builders will be registered by game.js after its dependencies load
window.BOSS_BUILDERS = {};