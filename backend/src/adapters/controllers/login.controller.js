import { z } from 'zod';
import { CredenciaisInvalidasError } from '../../domain/errors/credenciais-invalidas.error.js';
import { UsuarioPresenter } from '../presenters/usuario.presenter.js';

export class LoginController {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  async lidar(req, res, next) {
    try {
      const esquemaValidacao = z.object({
        email: z.string().email(),
        senha: z.string().min(1),
      });

      const { email, senha } = esquemaValidacao.parse(req.body);

      const { usuario, token } = await this.loginUseCase.executar({ email, senha });

      return res.status(200).json({
        usuario: UsuarioPresenter.paraHTTP(usuario),
        token
      });
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        return res.status(400).json({ mensagem: 'Erro de validação', erros: erro.format() });
      }
      if (erro instanceof CredenciaisInvalidasError || erro.message === 'Usuário inativo.') {
        return res.status(401).json({ mensagem: erro.message });
      }
      next(erro);
    }
  }
}
