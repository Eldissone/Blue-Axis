document.addEventListener('DOMContentLoaded', async () => {

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:3333/banners');
      if (res.ok) {
        const banners = await res.json();
        const activeBanners = banners.filter(b => b.ativo);

        if (activeBanners.length > 0) {
          const bgContainer = document.getElementById('dynamic-banners-bg');
          const textContainer = document.getElementById('dynamic-banners-text');
          const dotsContainer = document.getElementById('dynamic-banners-dots');

          if (bgContainer && textContainer && dotsContainer) {
            bgContainer.innerHTML = '';
            textContainer.innerHTML = '';
            dotsContainer.innerHTML = '';

            activeBanners.forEach((banner, index) => {
              const isActive = index === 0 ? 'is-active' : '';
              const isAriaCurrent = index === 0 ? 'true' : 'false';

              // Render Background Image
              const bannerBgUrl = banner.imagemUrl.startsWith('http') ? banner.imagemUrl : `http://localhost:3333${banner.imagemUrl}`;
              bgContainer.innerHTML += `
                <div class="hero-slide ${isActive}" role="img" aria-label="${banner.titulo}"
                  style="background-image: url('${bannerBgUrl}')"></div>
              `;

              // Render Copy Texts
              textContainer.innerHTML += `
                <div class="hero-copy-slide ${isActive}">
                  <h1 class="text-display-lg">
                    ${banner.titulo}
                    ${banner.tituloDestaque ? `<span class="text-tertiary-fixed">${banner.tituloDestaque}</span>` : ''}
                  </h1>
                  ${banner.descricao ? `<p>${banner.descricao}</p>` : ''}
                </div>
              `;
              // Render Dots
              dotsContainer.innerHTML += `
                <button class="hero-carousel-dot ${isActive}" type="button" aria-label="Mostrar imagem ${index + 1}"
                  aria-current="${isAriaCurrent}"></button>
              `;
            });
            
            if (window.initCarousel) {
              window.initCarousel();
            }
          }
        }
      }
    } catch (e) {
      console.error('Erro ao carregar banners:', e);
    }
  };

  const fetchServicos = async () => {
    try {
      const res = await fetch('http://localhost:3333/servicos');
      if (res.ok) {
        const servicos = await res.json();
        const activeServicos = servicos.filter(s => s.ativo);

        if (activeServicos.length > 0) {
          const srvContainer = document.getElementById('dynamic-services');
          if (srvContainer) {
            srvContainer.innerHTML = '';

            const icons = ['support_agent', 'trending_up', 'school', 'handshake'];

              activeServicos.forEach((servico, index) => {
              const icon = icons[index % icons.length];
              const imageHtml = servico.iconeUrl ? `<img class="service-card-hover-image" src="http://localhost:3333${servico.iconeUrl}" alt="${servico.titulo}" style="opacity: 0.8; object-fit: cover; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 0; transition: transform 0.3s ease;" />` : '';
              
              srvContainer.innerHTML += `
                <article class="service-card service-card-solid" style="position: relative; overflow: hidden;">
                  ${imageHtml}
                  <div class="service-card-content" style="position: relative; z-index: 10;">
                    <span class="service-card-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
                    <h3>${servico.titulo}</h3>
                    <p>${servico.descricao || 'Serviço oferecido pela Blue Horizon.'}</p>
                    <a href="./pages/contacto.html">Saber mais</a>
                  </div>
                </article>
              `;
            });
          }
        }
      }
    } catch (e) {
      console.error('Erro ao carregar serviços:', e);
    }
  };

  await fetchBanners();
  await fetchServicos();
});
