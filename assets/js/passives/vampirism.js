// Passiva fixa de Vlad: reaproveita o efeito de Sede de Sangue sem entrar na roleta geral.
window.PASSIVE_REGISTRY.register({
  id: 'vampirism',
  nome: 'Vampirismo',
  desc: 'Cura 3% do dano causado. Passiva fixa de Vlad.',
  fixedFor: ['dracula'],
  random: false,
  apply: player => { player.stats.ls += .03 }
});
