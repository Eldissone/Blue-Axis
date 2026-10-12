export class ParceiroInstitucionalController {
  constructor(criarUseCase, listarUseCase, atualizarUseCase, deletarUseCase, listarAtivosUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
    this.atualizarUseCase = atualizarUseCase;
    this.deletarUseCase = deletarUseCase;
    this.listarAtivosUseCase = listarAtivosUseCase;
  }

  async criar(req, res, next) {
    try {
      const dados = { ...req.body };
      if (req.file) {
        dados.imagemUrl = '/uploads/' + req.file.filename;
      }
      if (dados.ativo !== undefined) {
        dados.ativo = dados.ativo === 'true' || dados.ativo === true;
      }
      if (dados.ordem !== undefined) {
        dados.ordem = parseInt(dados.ordem) || 0;
      }

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

  async listarAtivos(req, res, next) {
    try {
      const categoria = req.query.categoria || null;
      const registros = await this.listarAtivosUseCase.executar(categoria);
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
        dados.imagemUrl = '/uploads/' + req.file.filename;
      }
      if (dados.ativo !== undefined) {
        dados.ativo = dados.ativo === 'true' || dados.ativo === true;
      }
      if (dados.ordem !== undefined) {
        dados.ordem = parseInt(dados.ordem) || 0;
      }

      const registro = await this.atualizarUseCase.executar(id, dados);
      return res.status(200).json(registro);
    } catch (erro) {
      next(erro);
    }
  }

  async deletar(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      await this.deletarUseCase.executar(id);
      return res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
}
