/* Arma fixa da Bruxa: feitiços arcanos lançados pela varinha. */
(function (registry) {
  registry.bruxa_wand = Object.freeze({
    id: 'bruxa_wand', classId: 'bruxa', nome: 'Feitiço da Varinha',
    kind: 'proj', proj: 'witch', atkCd: .68, dmg: 18, projSpeed: 17, range: 16, pierce: 0
  });
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
