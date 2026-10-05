import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaNewsletterRepository {
  async listar() {
    return prisma.newsletter.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.newsletter.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.newsletter.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.newsletter.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.newsletter.delete({ where: { id } });
  }
}
