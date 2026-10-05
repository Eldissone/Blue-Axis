export class ListarPerfilParceiroUseCase {
  constructor(perfilParceiroRepository) {
    this.perfilParceiroRepository = perfilParceiroRepository;
  }
  async executar() {
    return this.perfilParceiroRepository.listar();
  }
}
