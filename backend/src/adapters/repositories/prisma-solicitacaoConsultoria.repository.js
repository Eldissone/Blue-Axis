import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaSolicitacaoConsultoriaRepository {
  async listar() {
    return prisma.solicitacaoConsultoria.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.solicitacaoConsultoria.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.solicitacaoConsultoria.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.solicitacaoConsultoria.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.solicitacaoConsultoria.delete({ where: { id } });
  }
}
