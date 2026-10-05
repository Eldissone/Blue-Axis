export class ListarServicoUseCase {
  constructor(servicoRepository) {
    this.servicoRepository = servicoRepository;
  }
  async executar() {
    return this.servicoRepository.listar();
  }
}
