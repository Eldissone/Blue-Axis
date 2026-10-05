export class ListarUsuariosUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async executar() {
    return this.usuarioRepository.listar();
  }
}
