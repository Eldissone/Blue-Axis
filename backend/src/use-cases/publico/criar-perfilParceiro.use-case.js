export class CriarPerfilParceiroUseCase {
  constructor(perfilParceiroRepository) {
    this.perfilParceiroRepository = perfilParceiroRepository;
  }
  async executar(dados) {
    return this.perfilParceiroRepository.criar(dados);
  }
}
