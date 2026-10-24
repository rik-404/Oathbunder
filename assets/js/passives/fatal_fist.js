// Passiva fixa de Darian: o primeiro nível de Punho Fatal fortalece todos os críticos.
window.PASSIVE_REGISTRY.register({
  id: 'fatal_fist',
  nome: 'Punho Fatal',
  desc: 'Seus críticos causam +50% de dano (multiplicador crítico inicial de 2,5×).',
  fixedFor: ['guerreiro'],
  random: false,
  apply: player => {
    player.stats.critDmg = Math.min(4, player.stats.critDmg + .5);
  }
});
