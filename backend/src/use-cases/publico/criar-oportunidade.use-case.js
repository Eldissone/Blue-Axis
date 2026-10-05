export class CriarOportunidadeUseCase {
  constructor(oportunidadeRepository) {
    this.oportunidadeRepository = oportunidadeRepository;
  }
  async executar(dados) {
    return this.oportunidadeRepository.criar(dados);
  }
}
