export class InscricaoCursoController {
  constructor(criarUseCase, listarUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
  }

  async criar(req, res, next) {
    try {
      const registro = await this.criarUseCase.executar(req.body);
      return res.status(201).json(registro);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const registros = await this.listarUseCase.executar();
      return res.status(200).json(registros);
    } catch (erro) {
      next(erro);
    }
  }
}
