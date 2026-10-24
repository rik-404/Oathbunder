// Passiva fixa de Necronus: mortos podem retornar por alguns instantes como aliados.
window.PASSIVE_REGISTRY.register({
  id: 'unholy_resurrection',
  nome: 'Ressurreição Profana',
  desc: 'Inimigos derrotados têm 15% de chance de voltar como esqueletos aliados por 12 s.',
  fixedFor: ['necro'],
  random: false,
  apply: player => {
    player.stats.unholyChance = .15;
    player.stats.unholyDuration = 12;
  }
});
