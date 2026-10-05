export class CredenciaisInvalidasError extends Error {
  constructor(mensagem = 'E-mail ou senha inválidos.') {
    super(mensagem);
    this.name = 'CredenciaisInvalidasError';
  }
}
