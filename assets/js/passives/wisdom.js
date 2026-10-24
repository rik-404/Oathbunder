// Passiva fixa do Mago: preserva o efeito original da melhoria Sabedoria.
window.PASSIVE_REGISTRY.register({
  id: 'wisdom',
  nome: 'Sabedoria',
  desc: '+15% de experiência ganha.',
  fixedFor: ['mago'],
  random: false,
  apply: player => { player.stats.xpMul *= 1.15; }
});
