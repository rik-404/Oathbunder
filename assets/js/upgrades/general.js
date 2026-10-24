// Melhorias gerais que podem aparecer para qualquer personagem.
window.UPGRADE_REGISTRY.register('general', [
  { id: 'dmg', nome: 'Força', desc: '+15% de dano em tudo.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Força', 10), apply: p => p.stats.dmg *= 1.15 },
  { id: 'as', nome: 'Mãos Rápidas', desc: '+12% de velocidade de ataque.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Mãos Rápidas', 10), apply: p => p.stats.atkSpd *= 1.12 },
  { id: 'ms', nome: 'Botas Leves', desc: '+8% de velocidade de movimento.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Botas Leves', 6), apply: p => p.stats.move *= 1.08 },
  { id: 'hp', nome: 'Coração de Pedra', desc: '+25 de vida máxima e cura 25.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Coração de Pedra', 10), apply: p => { p.maxHp += 25; p.hp += 25 } },
  { id: 'regen', nome: 'Regeneração', desc: 'Recupera +0,8 de vida por segundo.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Regeneração', 5), apply: p => p.stats.regen += .8 },
  { id: 'magnet', nome: 'Ímã', desc: '+40% de distância para puxar orbes de experiência.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Ímã', 5), apply: p => p.stats.magnet *= 1.4 },
  { id: 'area', nome: 'Alcance Maior', desc: '+18% de área em golpes, explosões e auras.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Alcance Maior', 8), apply: p => p.stats.area *= 1.18 }
]);
