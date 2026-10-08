export class ListarCursosAtivosUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async executar() {
    return this.repository.listarAtivos();
  }
}
