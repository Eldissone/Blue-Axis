export class ListarNewsletterUseCase {
  constructor(newsletterRepository) {
    this.newsletterRepository = newsletterRepository;
  }
  async executar() {
    return this.newsletterRepository.listar();
  }
}
