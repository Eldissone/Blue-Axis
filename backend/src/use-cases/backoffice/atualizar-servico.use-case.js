export class AtualizarServicoUseCase {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async executar(id, dados) {
    return this.repositorio.atualizar(id, dados);
  }
}
