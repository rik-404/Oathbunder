// Passiva fixa do Guardião: começa a corrida com uma camada extra de armadura.
window.PASSIVE_REGISTRY.register({
  id: 'iron_plating',
  nome: 'Placas de Ferro',
  desc: 'Recebe 8% menos dano. Passiva fixa do Guardião.',
  fixedFor: ['tank'],
  random: false,
  apply: player => { player.stats.armor = Math.min(.7, player.stats.armor + .08) }
});
