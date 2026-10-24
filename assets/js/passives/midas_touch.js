// Passiva fixa de Midas: moedas derrubadas por inimigos valem 50% a mais.
window.PASSIVE_REGISTRY.register({
  id: 'midas_touch',
  nome: 'Toque de Midas',
  desc: 'Inimigos deixam moedas que valem 50% a mais.',
  fixedFor: ['king'],
  random: false,
  apply: player => { player.stats.goldMul = 1.5 }
});
