import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaCursoRepository {
  async listar() {
    return prisma.curso.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async listarAtivos() {
    return prisma.curso.findMany({ where: { ativo: true }, orderBy: { criadoEm: 'desc' } });
  }

  async buscarPorId(id) {
    return prisma.curso.findUnique({ where: { id } });
  }

  async criar(dados) {
    return prisma.curso.create({ data: dados });
  }

  async atualizar(id, dados) {
    return prisma.curso.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.curso.delete({ where: { id } });
  }
}
