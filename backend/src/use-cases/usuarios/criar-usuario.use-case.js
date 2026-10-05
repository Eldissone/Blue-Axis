import { RecursoJaExistenteError } from '../../domain/errors/recurso-ja-existente.error.js';
import bcrypt from 'bcryptjs';

export class CriarUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async executar({ nome, email, senha }) {
    const usuarioJaExiste = await this.usuarioRepository.buscarPorEmail(email);

    if (usuarioJaExiste) {
      throw new RecursoJaExistenteError('Já existe um usuário com este e-mail.');
    }

    const senhaHash = await bcrypt.hash(senha, 8);

    const usuario = await this.usuarioRepository.criar({
      nome,
      email,
      senha: senhaHash,
      perfil: 'USUARIO',
    });

    return usuario;
  }
}
