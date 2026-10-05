import { Router } from 'express';
import { PrismaUsuarioRepository } from '../../adapters/repositories/prisma-usuario.repository.js';
import { PrismaAuditoriaRepository } from '../../adapters/repositories/prisma-auditoria.repository.js';

import { CriarUsuarioUseCase } from '../../use-cases/usuarios/criar-usuario.use-case.js';
import { LoginUseCase } from '../../use-cases/autenticacao/login.use-case.js';
import { AlterarPerfilUsuarioUseCase } from '../../use-cases/backoffice/alterar-perfil-usuario.use-case.js';
import { ListarUsuariosUseCase } from '../../use-cases/backoffice/listar-usuarios.use-case.js';

import { CriarUsuarioController } from '../../adapters/controllers/criar-usuario.controller.js';
import { LoginController } from '../../adapters/controllers/login.controller.js';
import { AlterarPerfilUsuarioController } from '../../adapters/controllers/alterar-perfil-usuario.controller.js';
import { ListarUsuariosController } from '../../adapters/controllers/listar-usuarios.controller.js';

import { middlewareAutenticacao, middlewarePermissaoAdmin } from './middlewares/autenticacao.middleware.js';

// --- NOVOS MÓDULOS ---
import { PrismaInscricaoCursoRepository } from '../../adapters/repositories/prisma-inscricaoCurso.repository.js';
import { PrismaSolicitacaoConsultoriaRepository } from '../../adapters/repositories/prisma-solicitacaoConsultoria.repository.js';
import { PrismaPerfilParceiroRepository } from '../../adapters/repositories/prisma-perfilParceiro.repository.js';
import { PrismaOportunidadeRepository } from '../../adapters/repositories/prisma-oportunidade.repository.js';
import { PrismaBannerRepository } from '../../adapters/repositories/prisma-banner.repository.js';
import { PrismaServicoRepository } from '../../adapters/repositories/prisma-servico.repository.js';
import { PrismaNewsletterRepository } from '../../adapters/repositories/prisma-newsletter.repository.js';

import { CriarInscricaoCursoUseCase } from '../../use-cases/publico/criar-inscricaoCurso.use-case.js';
import { ListarInscricaoCursoUseCase } from '../../use-cases/backoffice/listar-inscricaoCurso.use-case.js';
import { InscricaoCursoController } from '../../adapters/controllers/inscricaoCurso.controller.js';

import { CriarSolicitacaoConsultoriaUseCase } from '../../use-cases/publico/criar-solicitacaoConsultoria.use-case.js';
import { ListarSolicitacaoConsultoriaUseCase } from '../../use-cases/backoffice/listar-solicitacaoConsultoria.use-case.js';
import { SolicitacaoConsultoriaController } from '../../adapters/controllers/solicitacaoConsultoria.controller.js';

import { CriarPerfilParceiroUseCase } from '../../use-cases/publico/criar-perfilParceiro.use-case.js';
import { ListarPerfilParceiroUseCase } from '../../use-cases/backoffice/listar-perfilParceiro.use-case.js';
import { PerfilParceiroController } from '../../adapters/controllers/perfilParceiro.controller.js';

import { CriarOportunidadeUseCase } from '../../use-cases/publico/criar-oportunidade.use-case.js';
import { ListarOportunidadeUseCase } from '../../use-cases/backoffice/listar-oportunidade.use-case.js';
import { OportunidadeController } from '../../adapters/controllers/oportunidade.controller.js';

import { CriarBannerUseCase } from '../../use-cases/publico/criar-banner.use-case.js';
import { ListarBannerUseCase } from '../../use-cases/backoffice/listar-banner.use-case.js';
import { BannerController } from '../../adapters/controllers/banner.controller.js';

import { CriarServicoUseCase } from '../../use-cases/publico/criar-servico.use-case.js';
import { ListarServicoUseCase } from '../../use-cases/backoffice/listar-servico.use-case.js';
import { ServicoController } from '../../adapters/controllers/servico.controller.js';

import { CriarNewsletterUseCase } from '../../use-cases/publico/criar-newsletter.use-case.js';
import { ListarNewsletterUseCase } from '../../use-cases/backoffice/listar-newsletter.use-case.js';
import { NewsletterController } from '../../adapters/controllers/newsletter.controller.js';

export const routes = Router();

// 1. Repositórios
const usuarioRepository = new PrismaUsuarioRepository();
const auditoriaRepository = new PrismaAuditoriaRepository();
const repoInscricao = new PrismaInscricaoCursoRepository();
const repoConsultoria = new PrismaSolicitacaoConsultoriaRepository();
const repoParceiro = new PrismaPerfilParceiroRepository();
const repoOportunidade = new PrismaOportunidadeRepository();
const repoBanner = new PrismaBannerRepository();
const repoServico = new PrismaServicoRepository();
const repoNewsletter = new PrismaNewsletterRepository();

// 2. Controladores
const criarUsuarioController = new CriarUsuarioController(new CriarUsuarioUseCase(usuarioRepository));
const loginController = new LoginController(new LoginUseCase(usuarioRepository));
const alterarPerfilUsuarioController = new AlterarPerfilUsuarioController(new AlterarPerfilUsuarioUseCase(usuarioRepository, auditoriaRepository));
const listarUsuariosController = new ListarUsuariosController(new ListarUsuariosUseCase(usuarioRepository));

const inscricaoController = new InscricaoCursoController(new CriarInscricaoCursoUseCase(repoInscricao), new ListarInscricaoCursoUseCase(repoInscricao));
const consultoriaController = new SolicitacaoConsultoriaController(new CriarSolicitacaoConsultoriaUseCase(repoConsultoria), new ListarSolicitacaoConsultoriaUseCase(repoConsultoria));
const parceiroController = new PerfilParceiroController(new CriarPerfilParceiroUseCase(repoParceiro), new ListarPerfilParceiroUseCase(repoParceiro));
const oportunidadeController = new OportunidadeController(new CriarOportunidadeUseCase(repoOportunidade), new ListarOportunidadeUseCase(repoOportunidade));
const bannerController = new BannerController(new CriarBannerUseCase(repoBanner), new ListarBannerUseCase(repoBanner));
const servicoController = new ServicoController(new CriarServicoUseCase(repoServico), new ListarServicoUseCase(repoServico));
const newsletterController = new NewsletterController(new CriarNewsletterUseCase(repoNewsletter), new ListarNewsletterUseCase(repoNewsletter));

routes.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// --- ROTAS PÚBLICAS ---
routes.post('/usuarios', (req, res, next) => criarUsuarioController.lidar(req, res, next));
routes.post('/login', (req, res, next) => loginController.lidar(req, res, next));

// Submissões de formulários
routes.post('/inscricoes', (req, res, next) => inscricaoController.criar(req, res, next));
routes.post('/consultorias', (req, res, next) => consultoriaController.criar(req, res, next));
routes.post('/parceiros', (req, res, next) => parceiroController.criar(req, res, next));
routes.post('/oportunidades', (req, res, next) => oportunidadeController.criar(req, res, next)); // Pode ser vaga
routes.post('/newsletter', (req, res, next) => newsletterController.criar(req, res, next));

// Listagem pública
routes.get('/banners', (req, res, next) => bannerController.listar(req, res, next));
routes.get('/servicos', (req, res, next) => servicoController.listar(req, res, next));


// --- ROTAS DE BACKOFFICE (Protegidas) ---
routes.use('/backoffice', middlewareAutenticacao, middlewarePermissaoAdmin);

routes.get('/backoffice/usuarios', (req, res, next) => listarUsuariosController.lidar(req, res, next));
routes.patch('/backoffice/usuarios/:idAlvo/perfil', (req, res, next) => alterarPerfilUsuarioController.lidar(req, res, next));

routes.get('/backoffice/inscricoes', (req, res, next) => inscricaoController.listar(req, res, next));
routes.get('/backoffice/consultorias', (req, res, next) => consultoriaController.listar(req, res, next));
routes.get('/backoffice/parceiros', (req, res, next) => parceiroController.listar(req, res, next));
routes.get('/backoffice/oportunidades', (req, res, next) => oportunidadeController.listar(req, res, next));
routes.get('/backoffice/newsletter', (req, res, next) => newsletterController.listar(req, res, next));

// Banners e Serviços (CRUD)
routes.get('/backoffice/banners', (req, res, next) => bannerController.listar(req, res, next));
routes.post('/backoffice/banners', (req, res, next) => bannerController.criar(req, res, next));
routes.get('/backoffice/servicos', (req, res, next) => servicoController.listar(req, res, next));
routes.post('/backoffice/servicos', (req, res, next) => servicoController.criar(req, res, next));
