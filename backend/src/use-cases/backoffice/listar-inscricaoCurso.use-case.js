export class ListarInscricaoCursoUseCase {
  constructor(inscricaoCursoRepository) {
    this.inscricaoCursoRepository = inscricaoCursoRepository;
  }
  async executar() {
    return this.inscricaoCursoRepository.listar();
  }
}
