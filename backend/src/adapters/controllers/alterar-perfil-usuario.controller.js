import { z } from 'zod';
import { UsuarioPresenter } from '../presenters/usuario.presenter.js';
import { RecursoNaoEncontradoError } from '../../domain/errors/recurso-nao-encontrado.error.js';

export class AlterarPerfilUsuarioController {
  constructor(alterarPerfilUsuarioUseCase) {
    this.alterarPerfilUsuarioUseCase = alterarPerfilUsuarioUseCase;
  }

  async lidar(req, res, next) {
    try {
      // Agora pegamos o id do admin a partir do token (req.usuario.id) inserido pelo middleware
      const esquemaValidacao = z.object({
        novoPerfil: z.enum(['USUARIO', 'ADMIN', 'SUPER_ADMIN'])
      });

      const idAlvo = Number(req.params.idAlvo);
      if (isNaN(idAlvo)) return res.status(400).json({ mensagem: 'ID inválido' });
      
      const { novoPerfil } = esquemaValidacao.parse(req.body);
      const idAdmin = req.usuario.id;

      const usuarioAtualizado = await this.alterarPerfilUsuarioUseCase.executar({
        idAdmin,
        idAlvo,
        novoPerfil
      });

      return res.status(200).json({
        mensagem: 'Perfil alterado com sucesso',
        usuario: UsuarioPresenter.paraHTTP(usuarioAtualizado)
      });
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        return res.status(400).json({ mensagem: 'Erro de validação', erros: erro.format() });
      }
      
      if (erro instanceof RecursoNaoEncontradoError) {
        return res.status(404).json({ mensagem: erro.message });
      }

      if (erro.message === 'Sem permissão para realizar esta ação.') {
        return res.status(403).json({ mensagem: erro.message });
      }

      next(erro);
    }
  }
}
