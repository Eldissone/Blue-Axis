import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaInscricaoCursoRepository {
  async listar() {
    return prisma.inscricaoCurso.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.inscricaoCurso.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.inscricaoCurso.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.inscricaoCurso.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.inscricaoCurso.delete({ where: { id } });
  }
}
