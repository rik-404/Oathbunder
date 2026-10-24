// Melhorias situacionais/utilitárias.
window.UPGRADE_REGISTRY.register('utility', [
  { id: 'heal', nome: 'Poção Grande', desc: 'Recupera toda a vida agora.', ok: p => p.hp < p.maxHp * .7, apply: p => p.hp = p.maxHp }
]);
