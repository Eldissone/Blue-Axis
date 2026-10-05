import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaServicoRepository {
  async listar() {
    return prisma.servico.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.servico.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.servico.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.servico.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.servico.delete({ where: { id } });
  }
}
