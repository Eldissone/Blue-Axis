export class RecursoNaoEncontradoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'RecursoNaoEncontradoError';
  }
}
