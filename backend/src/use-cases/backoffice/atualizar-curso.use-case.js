export class AtualizarCursoUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async executar(id, dados) {
    return this.repository.atualizar(id, dados);
  }
}
