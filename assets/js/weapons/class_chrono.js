/* Arma fixa da Véspera: Orbe do Tempo. */
(function (registry) {
  registry.chrono_orb = Object.freeze({
    id: 'chrono_orb', classId: 'chrono', nome: 'Orbe do Tempo',
    kind: 'proj', proj: 'time', atkCd: .6, dmg: 18, projSpeed: 15, range: 15, pierce: 1
  });
})(window.CLASS_WEAPONS = window.CLASS_WEAPONS || {});
