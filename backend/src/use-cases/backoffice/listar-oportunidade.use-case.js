export class ListarOportunidadeUseCase {
  constructor(oportunidadeRepository) {
    this.oportunidadeRepository = oportunidadeRepository;
  }
  async executar() {
    return this.oportunidadeRepository.listar();
  }
}
