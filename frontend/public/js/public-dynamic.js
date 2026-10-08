document.addEventListener('DOMContentLoaded', async () => {

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:3333/banners');
      if (res.ok) {
        const banners = await res.json();
        const activeBanners = banners.filter(b => b.ativo).sort((a, b) => a.ordem - b.ordem);

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

  const fetchCursos = async () => {
    try {
      const res = await fetch('http://localhost:3333/cursos');
      if (res.ok) {
        const cursos = await res.json();
        const activeCursos = cursos.filter(c => c.ativo);
        const container = document.getElementById('cursosContainer');
        if (container && activeCursos.length > 0) {
          container.innerHTML = '';
          activeCursos.forEach(curso => {
            const imgHtml = curso.imagemUrl ? `<img class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" src="http://localhost:3333${curso.imagemUrl}" />` : '<div class="w-full h-full bg-gray-200"></div>';
            container.innerHTML += `
              <article class="bg-surface-container-lowest border border-outline-variant rounded-[25px] group hover:border-secondary transition-colors duration-300 flex flex-col h-full overflow-hidden">
                  <div class="relative h-48 w-full overflow-hidden bg-surface-container">
                      <div class="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-300"></div>
                      ${imgHtml}
                      <div class="absolute top-4 left-4 z-20">
                          <span class="bg-secondary text-on-secondary px-2 py-1 rounded-[25px] font-label-sm text-label-sm">${curso.categoria}</span>
                      </div>
                  </div>
                  <div class="p-6 flex flex-col flex-1">
                      <h3 class="font-headline-md text-headline-md text-primary mb-2 line-clamp-2">${curso.titulo}</h3>
                      <p class="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-1">${curso.descricao}</p>
                      
                      <div class="space-y-3 mb-6 pt-4 border-t border-surface-variant">
                          <div class="flex items-center justify-between">
                              <span class="font-label-sm text-label-sm text-outline flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span> Carga Horária</span>
                              <span class="font-label-sm text-label-sm text-primary font-bold">${curso.cargaHoraria}</span>
                          </div>
                          <div class="flex items-center justify-between">
                              <span class="font-label-sm text-label-sm text-outline flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">computer</span> Modalidade</span>
                              <span class="font-label-sm text-label-sm text-primary font-bold">${curso.modalidade}</span>
                          </div>
                          <div class="flex items-center justify-between">
                              <span class="font-label-sm text-label-sm text-outline flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">verified</span> Certificadora</span>
                              <span class="font-label-sm text-label-sm text-primary font-bold">${curso.certificadora}</span>
                          </div>
                      </div>
                      <button onclick="abrirModalInscricao('${curso.titulo}')" class="w-full bg-primary text-on-primary font-button text-button py-3 rounded-[25px] hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200">
                          Inscrever-me
                      </button>
                  </div>
              </article>
            `;
          });
          
          const selectElement = document.getElementById('acadCurso');
          if (selectElement) {
            selectElement.innerHTML = '<option value="">Selecione um Curso...</option>';
            activeCursos.forEach(c => {
               selectElement.innerHTML += `<option value="${c.titulo}">${c.titulo}</option>`;
            });
          }
        }
      }
    } catch (e) {
      console.error('Erro ao carregar cursos:', e);
    }
  };

  await fetchBanners();
  await fetchServicos();
  await fetchCursos();
});
