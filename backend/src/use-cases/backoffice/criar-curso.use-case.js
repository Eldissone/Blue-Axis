export class CriarCursoUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async executar(dados) {
    return this.repository.criar(dados);
  }
}
