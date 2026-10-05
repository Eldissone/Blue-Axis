import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaPerfilParceiroRepository {
  async listar() {
    return prisma.perfilParceiro.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.perfilParceiro.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.perfilParceiro.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.perfilParceiro.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.perfilParceiro.delete({ where: { id } });
  }
}
