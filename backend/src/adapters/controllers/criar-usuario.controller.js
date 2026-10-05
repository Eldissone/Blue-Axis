import { z } from 'zod';
import { UsuarioPresenter } from '../presenters/usuario.presenter.js';
import { RecursoJaExistenteError } from '../../domain/errors/recurso-ja-existente.error.js';

export class CriarUsuarioController {
  constructor(criarUsuarioUseCase) {
    this.criarUsuarioUseCase = criarUsuarioUseCase;
  }

  async lidar(req, res, next) {
    try {
      const esquemaValidacao = z.object({
        nome: z.string().min(2),
        email: z.string().email(),
        senha: z.string().min(6),
      });

      const { nome, email, senha } = esquemaValidacao.parse(req.body);

      const usuario = await this.criarUsuarioUseCase.executar({ nome, email, senha });

      return res.status(201).json(UsuarioPresenter.paraHTTP(usuario));
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        return res.status(400).json({ mensagem: 'Erro de validação', erros: erro.format() });
      }
      
      if (erro instanceof RecursoJaExistenteError) {
        return res.status(409).json({ mensagem: erro.message });
      }

      next(erro);
    }
  }
}
