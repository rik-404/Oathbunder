/* Arma fixa do Pistoleiro: Revólver de Precisão. */
(function (registry) {
  registry.pistol_revolver = Object.freeze({
    id: 'pistol_revolver', classId: 'pistol', nome: 'Revólver de Precisão',
    kind: 'proj', proj: 'bullet', atkCd: .4, dmg: 9, projSpeed: 30, range: 15, pierce: 0, critBase: .15
  });
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
