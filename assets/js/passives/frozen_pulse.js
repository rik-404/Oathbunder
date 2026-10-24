// Passiva fixa da Véspera: o pulso desacelera os inimigos atingidos.
window.PASSIVE_REGISTRY.register({
  id: 'frozen_pulse',
  nome: 'Pulso Congelante',
  desc: 'Seus golpes deixam os inimigos 20% mais lentos por 0,7 s.',
  fixedFor: ['chrono'],
  random: false,
  apply: player => {
    player.stats.chill = 1;
  }
});
