// Melhorias condicionadas à classe selecionada.
window.UPGRADE_REGISTRY.register('class', [
  { id: 'multi', cls: ['mago', 'arqueiro', 'necro'], nome: 'Projétil Extra', desc: '+1 projétil em cada ataque.', ok: p => p.stats.multi < 4, apply: p => p.stats.multi++ },
  { id: 'pierce', cls: ['mago', 'arqueiro', 'necro'], nome: 'Perfuração', desc: 'Projéteis atravessam +1 inimigo.', ok: p => p.stats.pierce < 4, apply: p => p.stats.pierce++ },
  { id: 'thorns', cls: ['guerreiro', 'tank'], nome: 'Espinhos', desc: 'Devolve 50% do dano de contato recebido.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Espinhos', 4), apply: p => p.stats.thorns += .5 },
  { id: 'minc', cls: ['necro'], nome: 'Horda Óssea', desc: '+1 esqueleto na sua horda.', ok: p => p.minCap < 7, apply: p => p.minCap++ },
  { id: 'mind', cls: ['necro'], nome: 'Ossos Afiados', desc: '+20% de dano dos esqueletos.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Ossos Afiados', 6), apply: p => p.minDmg *= 1.2 }
]);
