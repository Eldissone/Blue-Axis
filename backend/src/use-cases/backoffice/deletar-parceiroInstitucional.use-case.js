export class DeletarParceiroInstitucionalUseCase {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async executar(id) {
    return this.repositorio.deletar(id);
  }
}
