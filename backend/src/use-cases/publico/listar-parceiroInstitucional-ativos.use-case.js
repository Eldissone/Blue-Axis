export class ListarParceiroInstitucionalAtivosUseCase {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async executar(categoria = null) {
    return this.repositorio.listarAtivos(categoria);
  }
}
