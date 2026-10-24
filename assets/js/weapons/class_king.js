/* Arma fixa de Midas: Guarda Real. O soldado luta ao lado dele até cair. */
(function (registry) {
  const weapon = Object.freeze({
    id: 'king_guard', classId: 'king', nome: 'Guarda Real',
    kind: 'summon', atkCd: 2.6, minionHp: 110, minionDmg: 13
  });
  registry[weapon.id] = weapon;
  const updaters = window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {};
  updaters[weapon.id] = function (_dt, C) {
    if (C.minions.some(minion => minion.owner === 'king')) return;
    const guard = C.summonMinion('soldier');
    if (!guard) return;
    guard.owner = 'king';
    guard.hp = guard.maxHp = weapon.minionHp;
    guard.baseDmg = weapon.minionDmg;
  };
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
