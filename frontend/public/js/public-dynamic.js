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
            srvContainer.className = 'flex flex-col gap-12 w-full';

            const grouped = {};
            activeServicos.forEach(s => {
              const area = s.area || 'Outras Áreas';
              if(!grouped[area]) grouped[area] = [];
              grouped[area].push(s);
            });

            const icons = ['support_agent', 'trending_up', 'school', 'handshake'];

            for (const [area, srvs] of Object.entries(grouped)) {
              let areaHtml = `
                <div class="service-area-group w-full">
                  <h3 class="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-2">${area}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter reveal-stagger-parent w-full">
              `;
              
              srvs.forEach((servico, index) => {
                const icon = icons[index % icons.length];
                const hasImage = !!servico.iconeUrl;
                const cardClass = hasImage ? 'service-card-image' : 'service-card-solid';
                const imageHtml = hasImage ? `<img src="http://localhost:3333${servico.iconeUrl}" alt="${servico.titulo}" />` : '';
                
                areaHtml += `
                  <article class="service-card ${cardClass} reveal-stagger-child">
                    ${imageHtml}
                    <div class="service-card-content">
                      <span class="service-card-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
                      <h3>${servico.titulo}</h3>
                      <p>${servico.descricao || 'Serviço oferecido pela Blue Horizon.'}</p>
                      <a href="./pages/contacto.html">Saber mais</a>
                    </div>
                  </article>
                `;
              });

              areaHtml += `
                  </div>
                </div>
              `;
              srvContainer.innerHTML += areaHtml;
            }
            if (window.observeScrollElements) window.observeScrollElements();
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
        const filterContainer = document.getElementById('filterContainer');
        
        if (container && activeCursos.length > 0) {
          
          const renderCursos = (cursosToRender) => {
            container.innerHTML = '';
            cursosToRender.forEach(curso => {
              const imgHtml = curso.imagemUrl ? `<img class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" src="http://localhost:3333${curso.imagemUrl}" />` : '<div class="w-full h-full bg-gray-200"></div>';
              container.innerHTML += `
                <article class="bg-surface-container-lowest border border-outline-variant rounded-[25px] group hover:border-secondary transition-colors duration-300 flex flex-col h-full overflow-hidden" data-categoria="${curso.categoria}">
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
          };

          renderCursos(activeCursos);
          if (window.observeScrollElements) window.observeScrollElements();

          if (filterContainer) {
            const categorias = [...new Set(activeCursos.map(c => c.categoria))];
            
            let filterHtml = `
              <button data-filter="all" class="filter-btn shrink-0 px-4 py-2 rounded-[25px] bg-primary text-on-primary font-button text-button border border-primary transition-colors">
                Todos os Cursos
              </button>
            `;
            
            categorias.forEach(cat => {
              filterHtml += `
                <button data-filter="${cat}" class="filter-btn shrink-0 px-4 py-2 rounded-[25px] bg-surface text-on-surface-variant font-button text-button border border-outline-variant hover:border-secondary hover:text-secondary transition-colors">
                  ${cat}
                </button>
              `;
            });
            
            filterContainer.innerHTML = filterHtml;

            const filterBtns = filterContainer.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
              btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                  b.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
                  b.classList.add('bg-surface', 'text-on-surface-variant', 'border-outline-variant', 'hover:border-secondary', 'hover:text-secondary');
                });
                
                const targetBtn = e.target;
                targetBtn.classList.remove('bg-surface', 'text-on-surface-variant', 'border-outline-variant', 'hover:border-secondary', 'hover:text-secondary');
                targetBtn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
                
                const filterValue = targetBtn.getAttribute('data-filter');
                if (filterValue === 'all') {
                  renderCursos(activeCursos);
                } else {
                  renderCursos(activeCursos.filter(c => c.categoria === filterValue));
                }
                if (window.observeScrollElements) window.observeScrollElements();
              });
            });
          }
          
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
