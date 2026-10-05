export class ListarSolicitacaoConsultoriaUseCase {
  constructor(solicitacaoConsultoriaRepository) {
    this.solicitacaoConsultoriaRepository = solicitacaoConsultoriaRepository;
  }
  async executar() {
    return this.solicitacaoConsultoriaRepository.listar();
  }
}
