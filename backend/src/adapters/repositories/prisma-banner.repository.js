import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaBannerRepository {
  async listar() {
    return prisma.banner.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.banner.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.banner.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.banner.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.banner.delete({ where: { id } });
  }
}
