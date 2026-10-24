// Passiva fixa de Smith: repete ocasionalmente um ataque recente como eco temporal.
window.PASSIVE_REGISTRY.register({
  id: 'future_echo',
  nome: 'Eco do Futuro',
  desc: '20% de chance por acerto: após 0,35 s, repete o golpe com 50% de dano; se o alvo cair, pode atingir um inimigo próximo.',
  fixedFor: ['future'],
  random: false,
  apply: player => {
    player.stats.echoChance = .2;
    player.stats.echoDamage = .5;
    player.stats.echoDelay = .35;
    player.stats.echoRange = 4.5;
  }
});
