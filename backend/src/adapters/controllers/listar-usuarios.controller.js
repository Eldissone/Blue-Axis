import { UsuarioPresenter } from '../presenters/usuario.presenter.js';

export class ListarUsuariosController {
  constructor(listarUsuariosUseCase) {
    this.listarUsuariosUseCase = listarUsuariosUseCase;
  }

  async lidar(req, res, next) {
    try {
      const usuarios = await this.listarUsuariosUseCase.executar();
      
      const usuariosFormatados = usuarios.map(u => UsuarioPresenter.paraHTTP(u));
      return res.status(200).json(usuariosFormatados);
    } catch (erro) {
      next(erro);
    }
  }
}
