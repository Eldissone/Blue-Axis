export class CriarNewsletterUseCase {
  constructor(newsletterRepository) {
    this.newsletterRepository = newsletterRepository;
  }
  async executar(dados) {
    return this.newsletterRepository.criar(dados);
  }
}
