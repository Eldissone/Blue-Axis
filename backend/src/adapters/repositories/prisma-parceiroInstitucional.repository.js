import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaParceiroInstitucionalRepository {
  async listar() {
    return prisma.parceiroInstitucional.findMany({ orderBy: [{ ordem: 'asc' }, { criadoEm: 'desc' }] });
  }

  async listarAtivos(categoria = null) {
    const where = { ativo: true };
    if (categoria) {
      where.categoria = categoria;
    }
    return prisma.parceiroInstitucional.findMany({ 
      where, 
      orderBy: [{ ordem: 'asc' }, { criadoEm: 'desc' }] 
    });
  }

  async criar(dados) {
    return prisma.parceiroInstitucional.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.parceiroInstitucional.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.parceiroInstitucional.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.parceiroInstitucional.delete({ where: { id } });
  }
}
