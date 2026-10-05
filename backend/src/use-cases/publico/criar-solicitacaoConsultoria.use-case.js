export class CriarSolicitacaoConsultoriaUseCase {
  constructor(solicitacaoConsultoriaRepository) {
    this.solicitacaoConsultoriaRepository = solicitacaoConsultoriaRepository;
  }
  async executar(dados) {
    return this.solicitacaoConsultoriaRepository.criar(dados);
  }
}
