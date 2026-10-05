export class CriarBannerUseCase {
  constructor(bannerRepository) {
    this.bannerRepository = bannerRepository;
  }
  async executar(dados) {
    return this.bannerRepository.criar(dados);
  }
}
