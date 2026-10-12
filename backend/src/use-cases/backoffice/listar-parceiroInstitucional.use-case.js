export class ListarParceiroInstitucionalUseCase {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async executar() {
    return this.repositorio.listar();
  }
}
