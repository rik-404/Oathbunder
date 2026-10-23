/* ================= ARMAS - INDEX =================
 * Uma arma por arquivo, no mesmo padrão de assets/js/class/ e assets/js/enimies/.
 *
 * Cada arquivo registra:
 *   window.WEAPONS[k]          -> { nome, desc(l) }
 *   window.WEAPON_UPDATERS[k]  -> function(dt, C)
 *   window.WEAPON_RESETS       -> lista de funções de reset (nova partida / menu)
 *
 * O objeto C é montado pelo game.js a cada frame e expõe o que as armas
 * precisam do motor: player, enemies, wGroup, THREE, roll, damageEnemy, etc.
 *
 * Carregar ANTES do game.js.
 * ================================================= */
window.WEAPONS = window.WEAPONS || {};
window.WEAPON_UPDATERS = window.WEAPON_UPDATERS || {};
window.WEAPON_RESETS = window.WEAPON_RESETS || [];
