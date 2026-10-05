import { AuditoriaRepository } from '../../domain/repositories/auditoria.repository.js';
import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class PrismaAuditoriaRepository extends AuditoriaRepository {
  async registrar(dados) {
    return prisma.auditoria.create({ data: dados });
  }
}
