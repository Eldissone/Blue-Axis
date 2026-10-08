export class InscricaoCursoController {
  constructor(criarUseCase, listarUseCase, atualizarStatusUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
    this.atualizarStatusUseCase = atualizarStatusUseCase;
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

  async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!this.atualizarStatusUseCase) throw new Error("Use case não injetado");
      const registro = await this.atualizarStatusUseCase.executar(Number(id), status);
      return res.status(200).json(registro);
    } catch (erro) {
      next(erro);
    }
  }
}
