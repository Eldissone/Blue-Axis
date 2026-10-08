export class ListarCursosUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async executar() {
    return this.repository.listar();
  }
}
