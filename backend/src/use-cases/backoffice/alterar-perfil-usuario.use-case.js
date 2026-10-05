import { RecursoNaoEncontradoError } from '../../domain/errors/recurso-nao-encontrado.error.js';

export class AlterarPerfilUsuarioUseCase {
  constructor(usuarioRepository, auditoriaRepository) {
    this.usuarioRepository = usuarioRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async executar({ idAdmin, idAlvo, novoPerfil }) {
    // 1. Busca quem está fazendo a ação (admin)
    const admin = await this.usuarioRepository.buscarPorId(idAdmin);
    if (!admin || (admin.perfil !== 'ADMIN' && admin.perfil !== 'SUPER_ADMIN')) {
      throw new Error('Sem permissão para realizar esta ação.'); // Poderia ser um erro customizado de permissão
    }

    // 2. Busca o usuário que sofrerá a alteração
    const usuarioAlvo = await this.usuarioRepository.buscarPorId(idAlvo);
    if (!usuarioAlvo) {
      throw new RecursoNaoEncontradoError('Usuário alvo não encontrado.');
    }

    const perfilAntigo = usuarioAlvo.perfil;

    // 3. Atualiza o perfil
    const usuarioAtualizado = await this.usuarioRepository.atualizar(idAlvo, { perfil: novoPerfil });

    // 4. Registra no Backoffice (Auditoria)
    await this.auditoriaRepository.registrar({
      acao: 'ALTERAR_PERFIL_USUARIO',
      entidade: 'USUARIO',
      entidadeId: idAlvo,
      realizadoPor: idAdmin,
      mudancas: {
        antes: { perfil: perfilAntigo },
        depois: { perfil: novoPerfil }
      }
    });

    return usuarioAtualizado;
  }
}
