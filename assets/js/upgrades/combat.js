// Melhorias específicas de desempenho de combate e controle.
window.UPGRADE_REGISTRY.register('combat', [
  { id: 'cdmg', nome: 'Punho Fatal', desc: 'Críticos causam +50% mais dano.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Punho Fatal', 4), apply: p => p.stats.critDmg = Math.min(4, p.stats.critDmg + .5) },
  { id: 'pspd', nome: 'Velocidade de Tiro', desc: '+15% de velocidade nos projéteis.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Velocidade de Tiro', 5), apply: p => p.stats.pspd *= 1.15 },
  { id: 'kb', nome: 'Empurrão', desc: '+30% de recuo em golpes e tiros.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Empurrão', 6), apply: p => p.stats.kb *= 1.3 },
  { id: 'dc', nome: 'Reflexo Relâmpago', desc: 'A esquiva recarrega 15% mais rápido.', ok: p => window.UPGRADE_REGISTRY.utils.pode(p, 'Reflexo Relâmpago', 6), apply: p => p.stats.dashCd *= .85 },
  { id: 'chill', nome: 'Pulso Congelante', desc: l => `Seus golpes deixam os inimigos ${l * 20}% lentos por ${(0.5 + 0.2 * l).toFixed(1).replace('.', ',')} s.`, ok: p => p.stats.chill < 3, apply: p => p.stats.chill++ }
]);
