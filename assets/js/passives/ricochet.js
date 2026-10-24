// Passiva fixa de Oliver: flechas podem saltar de um inimigo para outro.
window.PASSIVE_REGISTRY.register({
  id: 'ricochet',
  nome: 'Ricochete',
  desc: '25% de chance de ricochetear até 2 vezes para inimigos a até 8m; cada ricochete causa 75% do dano anterior.',
  fixedFor: ['arqueiro'],
  random: false,
  apply: player => {
    player.stats.ricochetChance = .25;
    player.stats.ricochetMax = 2;
    player.stats.ricochetRange = 8;
    player.stats.ricochetDamage = .75;
  }
});
