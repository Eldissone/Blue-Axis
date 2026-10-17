import crypto from 'crypto';

const slugify = (texto = '') => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const visitanteHash = (req) => crypto.createHash('sha256')
  .update(`${req.ip}|${req.get('user-agent') || ''}|${process.env.ANALYTICS_SALT || 'blue-horizon'}`)
  .digest('hex');

export class PublicacaoController {
  constructor(repositorio) { this.repositorio = repositorio; }

  async listarPublicas(req, res, next) {
    try {
      const pagina = Math.max(1, Number(req.query.pagina) || 1);
      const limite = Math.min(24, Math.max(1, Number(req.query.limite) || 9));
      res.json(await this.repositorio.listarPublicadas({ pesquisa: req.query.pesquisa?.trim(), categoria: req.query.categoria?.trim(), pagina, limite }));
    } catch (erro) { next(erro); }
  }

  async detalhePublico(req, res, next) {
    try {
      const publicacao = await this.repositorio.buscarPublicadaPorSlug(req.params.slug);
      if (!publicacao) return res.status(404).json({ mensagem: 'Publicação não encontrada.' });
      await this.repositorio.registrarVisualizacao(publicacao.id, visitanteHash(req), req.get('referer') || null);
      res.json(publicacao);
    } catch (erro) { next(erro); }
  }

  async downloadPublico(req, res, next) {
    try {
      const publicacao = await this.repositorio.buscarPublicadaPorSlug(req.params.slug);
      const documento = publicacao?.documentos.find((item) => item.id === Number(req.params.documentoId));
      if (!documento) return res.status(404).json({ mensagem: 'Documento não encontrado.' });
      await this.repositorio.registrarDownload(publicacao.id, documento.id, visitanteHash(req));
      res.redirect(documento.arquivoUrl);
    } catch (erro) { next(erro); }
  }

  async listarAdmin(req, res, next) {
    try { res.json(await this.repositorio.listarAdmin()); } catch (erro) { next(erro); }
  }

  async criar(req, res, next) {
    try {
      const dados = { ...req.body };
      dados.slug = slugify(dados.slug || dados.titulo);
      dados.imagemCapaUrl = req.file ? `/uploads/${req.file.filename}` : dados.imagemCapaUrl || null;
      dados.publicadoEm = dados.status === 'PUBLICADO' ? (dados.publicadoEm ? new Date(dados.publicadoEm) : new Date()) : null;
      dados.agendadoPara = dados.agendadoPara ? new Date(dados.agendadoPara) : null;
      res.status(201).json(await this.repositorio.criar(dados));
    } catch (erro) { next(erro); }
  }

  async atualizar(req, res, next) {
    try {
      const dados = { ...req.body };
      if (dados.slug || dados.titulo) dados.slug = slugify(dados.slug || dados.titulo);
      if (req.file) dados.imagemCapaUrl = `/uploads/${req.file.filename}`;
      if (dados.status === 'PUBLICADO' && !dados.publicadoEm) dados.publicadoEm = new Date();
      else if (dados.publicadoEm) dados.publicadoEm = new Date(dados.publicadoEm);
      if (dados.agendadoPara) dados.agendadoPara = new Date(dados.agendadoPara);
      res.json(await this.repositorio.atualizar(Number(req.params.id), dados));
    } catch (erro) { next(erro); }
  }

  async deletar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const publicacao = await this.repositorio.buscarPorId(id);
      if (!publicacao) return res.status(404).json({ mensagem: 'Publicação não encontrada.' });
      await this.repositorio.deletar(id);
      res.json({ mensagem: 'Publicação excluída com sucesso.' });
    } catch (erro) { next(erro); }
  }

  async adicionarDocumento(req, res, next) {
    try {
      if (!req.file || req.file.mimetype !== 'application/pdf') return res.status(400).json({ mensagem: 'Envie um documento PDF válido.' });
      const publicacaoId = Number(req.params.id);
      const publicacao = await this.repositorio.buscarPorId(publicacaoId);
      if (!publicacao) return res.status(404).json({ mensagem: 'Publicação não encontrada.' });
      const versao = publicacao.documentos.length + 1;
      res.status(201).json(await this.repositorio.criarDocumento({ publicacaoId, nomeArquivo: req.file.originalname, arquivoUrl: `/uploads/${req.file.filename}`, mimeType: req.file.mimetype, tamanhoBytes: req.file.size, versao }));
    } catch (erro) { next(erro); }
  }

  async analytics(req, res, next) {
    try { res.json(await this.repositorio.analytics(req.query)); } catch (erro) { next(erro); }
  }
}
