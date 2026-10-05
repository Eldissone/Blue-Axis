export class ListarBannerUseCase {
  constructor(bannerRepository) {
    this.bannerRepository = bannerRepository;
  }
  async executar() {
    return this.bannerRepository.listar();
  }
}
