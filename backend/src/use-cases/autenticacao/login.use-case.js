import { CredenciaisInvalidasError } from '../../domain/errors/credenciais-invalidas.error.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-desenvolvimento-123';

export class LoginUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async executar({ email, senha }) {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new CredenciaisInvalidasError();
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo.');
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
      throw new CredenciaisInvalidasError();
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { usuario, token };
  }
}
