// Passiva meme fixa do Zé: ocupa um espaço de poder sem conceder bônus.
window.PASSIVE_REGISTRY.register({
  id: 'beer_bottle',
  nome: 'Garrafa de Cerveja',
  desc: 'Zé toma uma cerveja. Não concede bônus, mas ocupa 1 espaço de poder.',
  fixedFor: ['human'],
  random: false,
  apply: () => {}
});
