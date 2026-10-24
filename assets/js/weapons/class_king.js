/* Arma fixa de Midas: Moeda Real. */
(function (registry) {
  registry.king_coins = Object.freeze({
    id: 'king_coins', classId: 'king', nome: 'Moeda Real',
    kind: 'proj', proj: 'gcoin', atkCd: .5, dmg: 17, projSpeed: 17, range: 14, pierce: 1
  });
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
