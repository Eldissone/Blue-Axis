export class RecursoJaExistenteError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'RecursoJaExistenteError';
  }
}
