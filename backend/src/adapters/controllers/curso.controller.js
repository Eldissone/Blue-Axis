export class CursoController {
  constructor(criarUseCase, listarUseCase, atualizarUseCase, listarAtivosUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
    this.atualizarUseCase = atualizarUseCase;
    this.listarAtivosUseCase = listarAtivosUseCase;
  }

  async criar(req, res, next) {
    try {
      const { titulo, categoria, descricao, cargaHoraria, modalidade, certificadora, ativo } = req.body;
      let imagemUrl = '';
      if (req.file) {
        imagemUrl = '/uploads/' + req.file.filename;
      }
      
      const dados = {
        titulo,
        categoria,
        descricao,
        cargaHoraria,
        modalidade,
        certificadora,
        imagemUrl,
        ativo: ativo === 'true' || ativo === true
      };

      const resultado = await this.criarUseCase.executar(dados);
      return res.status(201).json(resultado);
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
      const registros = await this.listarAtivosUseCase.executar();
      return res.status(200).json(registros);
    } catch (erro) {
      next(erro);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { titulo, categoria, descricao, cargaHoraria, modalidade, certificadora, ativo } = req.body;
      
      const dados = {
        titulo,
        categoria,
        descricao,
        cargaHoraria,
        modalidade,
        certificadora,
        ativo: ativo === 'true' || ativo === true
      };

      if (req.file) {
        dados.imagemUrl = '/uploads/' + req.file.filename;
      }

      const resultado = await this.atualizarUseCase.executar(Number(id), dados);
      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }
}
