// Passiva fixa de Castiel: seus golpes podem deixar inimigos queimando.
window.PASSIVE_REGISTRY.register({
  id: 'burning_fire',
  nome: 'Fogo Ardente',
  desc: '25% de chance de causar Queimação por 3s; cada pulso causa 8% do dano do golpe.',
  fixedFor: ['demon'],
  random: false,
  apply: player => {
    player.stats.burnChance = .25;
    player.stats.burnDuration = 3;
    player.stats.burnInterval = .75;
    player.stats.burnRatio = .08;
  }
});
