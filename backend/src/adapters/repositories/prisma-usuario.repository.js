import { UsuarioRepository } from '../../domain/repositories/usuario.repository.js';
import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaUsuarioRepository extends UsuarioRepository {
  async buscarPorEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async buscarPorId(id) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async criar(dados) {
    return prisma.usuario.create({ data: dados });
  }

  async atualizar(id, dados) {
    return prisma.usuario.update({
      where: { id },
      data: dados
    });
  }

  async listar() {
    return prisma.usuario.findMany({
      orderBy: { criadoEm: 'desc' }
    });
  }
}
