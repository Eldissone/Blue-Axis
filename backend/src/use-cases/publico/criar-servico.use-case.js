export class CriarServicoUseCase {
  constructor(servicoRepository) {
    this.servicoRepository = servicoRepository;
  }
  async executar(dados) {
    return this.servicoRepository.criar(dados);
  }
}
