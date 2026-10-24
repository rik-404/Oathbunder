// Passiva fixa da Bruxa: prepara uma única poção de cura a cada 30 segundos.
window.PASSIVE_REGISTRY.register({
  id: 'bruxa_pocao',
  nome: 'Poção da Bruxa',
  desc: 'Gera uma poção a cada 30 s. Ao coletá-la, recupera 35% da vida máxima.',
  fixedFor: ['bruxa'],
  random: false,
  apply(player) { player.bruxaPocaoTimer = 0; },
  update(player, dt, ctx) {
    if (player.cls !== 'bruxa' || !ctx || typeof ctx.hasPickup !== 'function' || typeof ctx.spawnPotion !== 'function') return;
    if (ctx.hasPickup('witchPotion')) { player.bruxaPocaoTimer = 0; return; }
    player.bruxaPocaoTimer = (player.bruxaPocaoTimer || 0) + dt;
    if (player.bruxaPocaoTimer < 30) return;
    player.bruxaPocaoTimer = 0;
    ctx.spawnPotion(player.x, player.z, player.maxHp * .35);
  }
});
