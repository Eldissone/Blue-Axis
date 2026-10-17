import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

const resumoInclude = {
  documentos: { select: { id: true, nomeArquivo: true, tamanhoBytes: true, atualizadoEm: true } },
  _count: { select: { visualizacoes: true, downloads: true } },
};

export class PrismaPublicacaoRepository {
  async listarPublicadas({ pesquisa, categoria, pagina = 1, limite = 9 } = {}) {
    const where = {
      status: 'PUBLICADO',
      publicadoEm: { lte: new Date() },
      ...(categoria ? { categoria } : {}),
      ...(pesquisa ? {
        OR: [
          { titulo: { contains: pesquisa, mode: 'insensitive' } },
          { resumo: { contains: pesquisa, mode: 'insensitive' } },
          { tags: { contains: pesquisa, mode: 'insensitive' } },
        ],
      } : {}),
    };
    const skip = (pagina - 1) * limite;
    const [dados, total] = await Promise.all([
      prisma.publicacao.findMany({ where, include: resumoInclude, orderBy: { publicadoEm: 'desc' }, skip, take: limite }),
      prisma.publicacao.count({ where }),
    ]);
    return { dados, total, pagina, limite, totalPaginas: Math.max(1, Math.ceil(total / limite)) };
  }

  async buscarPublicadaPorSlug(slug) {
    return prisma.publicacao.findFirst({
      where: { slug, status: 'PUBLICADO', publicadoEm: { lte: new Date() } },
      include: { documentos: { orderBy: { criadoEm: 'desc' } }, _count: { select: { visualizacoes: true, downloads: true } } },
    });
  }

  async listarAdmin() {
    return prisma.publicacao.findMany({ include: resumoInclude, orderBy: { atualizadoEm: 'desc' } });
  }

  async criar(dados) { return prisma.publicacao.create({ data: dados, include: resumoInclude }); }
  async atualizar(id, dados) { return prisma.publicacao.update({ where: { id }, data: dados, include: resumoInclude }); }
  async deletar(id) { return prisma.publicacao.delete({ where: { id } }); }
  async buscarPorId(id) { return prisma.publicacao.findUnique({ where: { id }, include: { documentos: true } }); }
  async criarDocumento(dados) { return prisma.documentoPublicacao.create({ data: dados }); }

  async registrarVisualizacao(publicacaoId, visitanteHash, origem) {
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existe = await prisma.visualizacaoPublicacao.findFirst({ where: { publicacaoId, visitanteHash, criadoEm: { gte: desde } } });
    if (!existe) await prisma.visualizacaoPublicacao.create({ data: { publicacaoId, visitanteHash, origem } });
  }

  async registrarDownload(publicacaoId, documentoId, visitanteHash) {
    return prisma.downloadPublicacao.create({ data: { publicacaoId, documentoId, visitanteHash } });
  }

  async analytics({ inicio, fim, categoria } = {}) {
    const periodo = { ...(inicio ? { gte: new Date(inicio) } : {}), ...(fim ? { lte: new Date(fim) } : {}) };
    const publicacoes = await prisma.publicacao.findMany({
      where: categoria ? { categoria } : {},
      include: { _count: { select: { visualizacoes: true, downloads: true } } },
      orderBy: { publicadoEm: 'desc' },
    });
    const vistas = await prisma.visualizacaoPublicacao.count({ where: Object.keys(periodo).length ? { criadoEm: periodo } : {} });
    const downloads = await prisma.downloadPublicacao.count({ where: Object.keys(periodo).length ? { criadoEm: periodo } : {} });
    return {
      totalPublicacoes: publicacoes.length,
      visualizacoes: vistas,
      downloads,
      taxaDownload: vistas ? Number(((downloads / vistas) * 100).toFixed(1)) : 0,
      populares: publicacoes.map((p) => ({ id: p.id, titulo: p.titulo, slug: p.slug, categoria: p.categoria, visualizacoes: p._count.visualizacoes, downloads: p._count.downloads })).sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 10),
    };
  }
}
