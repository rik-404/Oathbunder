/* Arma fixa do Arqueiro: Arco Longo. */
(function (registry) {
  registry.archer_bow = Object.freeze({
    id: 'archer_bow', classId: 'arqueiro', nome: 'Arco Longo',
    kind: 'proj', proj: 'arrow', atkCd: .42, dmg: 12, projSpeed: 24, range: 16, pierce: 1
  });
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
