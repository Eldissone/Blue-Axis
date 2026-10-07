export class BannerController {
  constructor(criarUseCase, listarUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
  }

  async criar(req, res, next) {
    try {
      const dados = { ...req.body };
      // Se um arquivo foi enviado via multer, constrói a URL
      if (req.file) {
        dados.imagemUrl = '/uploads/' + req.file.filename;
      }
      
      // Converte booleanos e números se vierem como string do form-data
      if (dados.ativo !== undefined) dados.ativo = dados.ativo === 'true' || dados.ativo === true;
      if (dados.ordem !== undefined) dados.ordem = Number(dados.ordem);

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
}
