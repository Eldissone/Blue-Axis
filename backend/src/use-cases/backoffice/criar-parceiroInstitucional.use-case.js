export class CriarParceiroInstitucionalUseCase {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async executar(dados) {
    return this.repositorio.criar(dados);
  }
}
