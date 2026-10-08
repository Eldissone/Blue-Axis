export class AtualizarStatusInscricaoUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async executar(id, status) {
    if (!['PENDENTE', 'APROVADO', 'REJEITADO'].includes(status)) {
      throw new Error("Status inválido");
    }
    const inscricao = await this.repository.buscarPorId(id);
    if (!inscricao) {
      throw new Error("Inscrição não encontrada");
    }
    return this.repository.atualizar(id, { status });
  }
}
