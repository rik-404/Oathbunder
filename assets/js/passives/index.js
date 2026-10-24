// Registry central de passivas. Novas definições ficam em arquivos próprios na pasta assets/js/passives/.
window.PASSIVE_REGISTRY = (() => {
  const defs = Object.create(null);
  return {
    register(def) {
      if (!def || !def.id || !def.nome || typeof def.apply !== 'function') throw new TypeError('Definição de passiva inválida.');
      if (defs[def.id]) throw new Error('Passiva duplicada: ' + def.id);
      defs[def.id] = def;
      return def;
    },
    get(id) { return defs[id] || null; },
    list() { return Object.values(defs); },
    randomOptions(player) {
      const owned = player.passives || [];
      const max = player.maxPassives || 5;
      if (owned.length >= max) return [];
      return Object.values(defs)
        .filter(def => def.random === true && !owned.includes(def.id) && (!def.classes || def.classes.includes(player.cls)))
        .map(def => ({
          id: 'passive:' + def.id,
          kind: 'passive',
          nome: def.nome,
          desc: def.desc,
          passiveId: def.id,
          apply(p) {
            if (!p.passives) p.passives = [];
            if (p.passives.includes(def.id) || p.passives.length >= (p.maxPassives || 5)) return;
            p.passives.push(def.id);
            def.apply(p);
          }
        }));
    },
    applyFixed(player, classDef) {
      const def = this.get(classDef && classDef.passiveId);
      if (!def) return null;
      if (def.fixedFor && !def.fixedFor.includes(player.cls)) throw new Error(`Passiva ${def.id} não pertence à classe ${player.cls}.`);
      if (!player.passives) player.passives = [];
      if (!player.upgIds) player.upgIds = {};
      if (player.passives.includes(def.id)) return def;
      if (player.passives.length >= (player.maxPassives || 5)) return null;
      player.passives.push(def.id);
      player.upgIds['passive:' + def.id] = true;
      if (player.picks && !player.picks.includes(def.nome)) player.picks.push(def.nome);
      def.apply(player);
      return def;
    }
  };
})();
