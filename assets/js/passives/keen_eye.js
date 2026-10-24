// Passiva fixa de Cassian: mantém o bônus original do upgrade Olho Certeiro.
window.PASSIVE_REGISTRY.register({
  id: 'keen_eye',
  nome: 'Olho Certeiro',
  desc: '+8% de chance de crítico (dano dobrado).',
  fixedFor: ['pistol'],
  random: false,
  apply: player => { player.stats.crit += .08; }
});
