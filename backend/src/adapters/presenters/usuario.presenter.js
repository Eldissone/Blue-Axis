export class UsuarioPresenter {
  static paraHTTP(usuario) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      criadoEm: usuario.criadoEm,
    };
  }
}
