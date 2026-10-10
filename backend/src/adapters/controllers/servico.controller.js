export class ServicoController {
  constructor(criarUseCase, listarUseCase, atualizarUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
    this.atualizarUseCase = atualizarUseCase;
  }

  async criar(req, res, next) {
    try {
      const dados = { ...req.body };
      if (req.file) {
        dados.iconeUrl = '/uploads/' + req.file.filename;
      }

      if (dados.ativo !== undefined) dados.ativo = dados.ativo === 'true' || dados.ativo === true;

      const registro = await this.criarUseCase.executar(dados);
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

  async atualizar(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const dados = { ...req.body };
      if (req.file) {
        dados.iconeUrl = '/uploads/' + req.file.filename;
      }
      if (dados.ativo !== undefined) dados.ativo = dados.ativo === 'true' || dados.ativo === true;

      const registro = await this.atualizarUseCase.executar(id, dados);
      return res.status(200).json(registro);
    } catch (erro) {
      next(erro);
    }
  }
}
