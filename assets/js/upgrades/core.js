// Núcleo do sistema de melhorias. Os módulos de categoria registram suas listas aqui.
window.UPGRADE_REGISTRY = {
  groups: [],
  utils: Object.freeze({
    pode: (p, nome, cap) => (p.picks || []).filter(x => x === nome).length < cap
  }),
  register(nome, melhorias) {
    if (!nome || !Array.isArray(melhorias)) throw new TypeError('Grupo de melhorias inválido.');
    if (this.groups.some(g => g.nome === nome)) throw new Error('Grupo de melhorias duplicado: ' + nome);
    this.groups.push({ nome, melhorias });
  },
  all() {
    const todas = this.groups.flatMap(g => g.melhorias);
    const ids = new Set();
    for (const melhoria of todas) {
      if (!melhoria.id || ids.has(melhoria.id)) throw new Error('ID de melhoria ausente ou duplicado: ' + melhoria.id);
      ids.add(melhoria.id);
    }
    return todas;
  }
};
