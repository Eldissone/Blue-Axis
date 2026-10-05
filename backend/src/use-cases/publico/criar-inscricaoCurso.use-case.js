export class CriarInscricaoCursoUseCase {
  constructor(inscricaoCursoRepository) {
    this.inscricaoCursoRepository = inscricaoCursoRepository;
  }
  async executar(dados) {
    return this.inscricaoCursoRepository.criar(dados);
  }
}
