import fs from 'fs';
import path from 'path';

const entidades = [
  { nome: 'InscricaoCurso', camel: 'inscricaoCurso', rota: 'inscricoes' },
  { nome: 'SolicitacaoConsultoria', camel: 'solicitacaoConsultoria', rota: 'consultorias' },
  { nome: 'PerfilParceiro', camel: 'perfilParceiro', rota: 'parceiros' },
  { nome: 'Oportunidade', camel: 'oportunidade', rota: 'oportunidades' },
  { nome: 'Banner', camel: 'banner', rota: 'banners' },
  { nome: 'Servico', camel: 'servico', rota: 'servicos' },
  { nome: 'Newsletter', camel: 'newsletter', rota: 'newsletters' },
];

const basePath = process.cwd();

entidades.forEach((ent) => {
  // 1. Prisma Repositories
  const repoContent = `import { prisma } from '../../infrastructure/database/prisma/prisma.client.js';

export class Prisma${ent.nome}Repository {
  async listar() {
    return prisma.${ent.camel}.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async criar(dados) {
    return prisma.${ent.camel}.create({ data: dados });
  }

  async buscarPorId(id) {
    return prisma.${ent.camel}.findUnique({ where: { id } });
  }

  async atualizar(id, dados) {
    return prisma.${ent.camel}.update({ where: { id }, data: dados });
  }

  async deletar(id) {
    return prisma.${ent.camel}.delete({ where: { id } });
  }
}
`;
  fs.writeFileSync(path.join(basePath, 'src', 'adapters', 'repositories', `prisma-${ent.camel}.repository.js`), repoContent);

  // 2. Use Cases (Criar e Listar básicos)
  const ucDirPublico = path.join(basePath, 'src', 'use-cases', 'publico');
  const ucDirBackoffice = path.join(basePath, 'src', 'use-cases', 'backoffice');
  if (!fs.existsSync(ucDirPublico)) fs.mkdirSync(ucDirPublico, { recursive: true });

  const criarUcContent = `export class Criar${ent.nome}UseCase {
  constructor(${ent.camel}Repository) {
    this.${ent.camel}Repository = ${ent.camel}Repository;
  }
  async executar(dados) {
    return this.${ent.camel}Repository.criar(dados);
  }
}
`;
  fs.writeFileSync(path.join(ucDirPublico, `criar-${ent.camel}.use-case.js`), criarUcContent);

  const listarUcContent = `export class Listar${ent.nome}UseCase {
  constructor(${ent.camel}Repository) {
    this.${ent.camel}Repository = ${ent.camel}Repository;
  }
  async executar() {
    return this.${ent.camel}Repository.listar();
  }
}
`;
  fs.writeFileSync(path.join(ucDirBackoffice, `listar-${ent.camel}.use-case.js`), listarUcContent);

  // 3. Controllers (Criar e Listar básicos)
  const ctrlContent = `export class ${ent.nome}Controller {
  constructor(criarUseCase, listarUseCase) {
    this.criarUseCase = criarUseCase;
    this.listarUseCase = listarUseCase;
  }

  async criar(req, res, next) {
    try {
      const registro = await this.criarUseCase.executar(req.body);
      return res.status(201).json(registro);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const registros = await this.listarUseCase.executar();
      return res.status(200).json(registros);
    } catch (erro) {
      next(erro);
    }
  }
}
`;
  fs.writeFileSync(path.join(basePath, 'src', 'adapters', 'controllers', `${ent.camel}.controller.js`), ctrlContent);
});

console.log("Arquivos gerados com sucesso!");
