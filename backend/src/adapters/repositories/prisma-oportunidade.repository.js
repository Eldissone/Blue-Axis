import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaOportunidadeRepository {
  async listar() {
    return prisma.oportunidade.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.oportunidade.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.oportunidade.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.oportunidade.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.oportunidade.delete({ where: { id } });
  }
}
