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

  const initServiceCarousels = (scope) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    scope.querySelectorAll('[data-service-carousel]').forEach((carousel) => {
      const viewport = carousel.querySelector('.service-carousel-viewport');
      const track = carousel.querySelector('.service-carousel-track');
      const previous = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      const firstCard = track && track.querySelector('.service-card');
      if (!viewport || !track || !firstCard) return;

      const getStep = () => {
        const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
        return firstCard.getBoundingClientRect().width + gap;
      };

      const move = (direction) => {
        const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
        if (direction > 0 && atEnd) {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }
        viewport.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
      };

      previous.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));

      if (reducedMotion) return;
      let autoplay = window.setInterval(() => move(1), 4800);
      const stopAutoplay = () => { window.clearInterval(autoplay); autoplay = undefined; };
      const startAutoplay = () => { if (!autoplay) autoplay = window.setInterval(() => move(1), 4800); };
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', () => {
        if (!carousel.contains(document.activeElement)) startAutoplay();
      });
    });
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
              const shouldUseCarousel = srvs.length > 4;
              const cardsContainerOpen = shouldUseCarousel
                ? `
                  <div class="service-carousel" data-service-carousel>
                    <button class="service-carousel-control service-carousel-prev" type="button" data-carousel-prev aria-label="Serviços anteriores">
                      <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                    </button>
                    <div class="service-carousel-viewport">
                      <div class="service-carousel-track reveal-stagger-parent">
                `
                : `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter reveal-stagger-parent w-full">`;
              let areaHtml = `
                <div class="service-area-group w-full">
                  <h3 class="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-2">${area}</h3>
                  ${cardsContainerOpen}
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

              areaHtml += shouldUseCarousel
                ? `
                      </div>
                    </div>
                    <button class="service-carousel-control service-carousel-next" type="button" data-carousel-next aria-label="Próximos serviços">
                      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </div>`
                : `</div></div>`;
              srvContainer.innerHTML += areaHtml;
            }
            initServiceCarousels(srvContainer);
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

  const fetchAllPartners = async () => {
    try {
      const containerAcademic = document.getElementById('dynamic-academic-partners');
      const containerIndustry = document.getElementById('dynamic-industry-partners');
      const tabsContainer = document.getElementById('partnerCategoryTabs');
      if (!containerAcademic && !containerIndustry && !tabsContainer) return;

      const res = await fetch('http://localhost:3333/parceiros-institucionais');
      if (!res.ok) return;

      const parceiros = await res.json();
      const activePartners = parceiros.filter(p => p.ativo);

      // Agrupamento por Categoria
      const grouped = {};
      activePartners.forEach(p => {
        const cat = (p.categoria || 'Universidades & Academia').trim();
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
      });

      // Função de apoio para renderizar cartão estilo Universidade
      const renderAcademicCard = (partner) => {
        let imgStyle = '';
        if (partner.imagemUrl) {
          const src = partner.imagemUrl.startsWith('http') || partner.imagemUrl.startsWith('/assets') 
            ? partner.imagemUrl 
            : `http://localhost:3333${partner.imagemUrl}`;
          imgStyle = `style="background-image: url('${src}')"`;
        }

        const tagsArray = (partner.tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);

        const tagsHtml = tagsArray.map(tag => `
          <span class="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded-[25px]">${tag}</span>
        `).join('');

        return `
          <div class="bg-surface-container-lowest border border-outline-variant rounded-[25px] p-6 flex gap-6 hover:shadow-sm transition-shadow reveal-stagger-child">
            <div class="hidden sm:block w-32 h-32 rounded-[25px] bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant">
              <div class="bg-cover bg-center w-full h-full grayscale opacity-80 mix-blend-multiply" ${imgStyle}></div>
            </div>
            <div class="flex flex-col justify-center">
              ${tagsHtml ? `<div class="flex flex-wrap gap-2 mb-2">${tagsHtml}</div>` : ''}
              <h3 class="font-headline-md text-headline-md text-primary mb-2">${partner.nome}</h3>
              <p class="font-body-md text-body-md text-on-surface-variant">${partner.descricao}</p>
            </div>
          </div>
        `;
      };

      // Função de apoio para renderizar cartão estilo Indústria / Geral
      const renderIndustryCard = (partner, defaultIcon = 'handshake') => {
        let imgHtml = `
          <div class="w-16 h-16 bg-surface-container rounded-[25px] flex items-center justify-center border border-outline-variant overflow-hidden">
            <span class="material-symbols-outlined text-3xl text-primary">${defaultIcon}</span>
          </div>
        `;
        if (partner.imagemUrl) {
          const src = partner.imagemUrl.startsWith('http') || partner.imagemUrl.startsWith('/assets') 
            ? partner.imagemUrl 
            : `http://localhost:3333${partner.imagemUrl}`;
          imgHtml = `
            <div class="w-16 h-16 bg-surface-container rounded-[25px] flex items-center justify-center border border-outline-variant overflow-hidden p-1">
              <img src="${src}" alt="${partner.nome}" class="w-full h-full object-contain">
            </div>
          `;
        }

        const tagsArray = (partner.tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);

        const tagText = tagsArray[0] || partner.categoria || 'Parceria';

        return `
          <div class="bg-surface-container-lowest border border-outline-variant rounded-[25px] p-6 flex flex-col h-full hover:border-secondary transition-colors duration-300 relative overflow-hidden group reveal-stagger-child">
            <div class="absolute top-0 left-0 w-full h-1 bg-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-4">
                ${imgHtml}
                <span class="bg-surface-container px-2 py-1 rounded-[25px] font-label-sm text-label-sm text-on-surface-variant border border-outline-variant">${tagText}</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-2">${partner.nome}</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-6">${partner.descricao}</p>
            </div>
            <div class="pt-4 border-t border-outline-variant mt-auto">
              <a href="#seja-parceiro" onclick="abrirModalParceiro()" class="w-full bg-surface hover:bg-surface-container border border-outline text-on-surface-variant font-button text-button py-2 rounded-[25px] transition-colors flex justify-center items-center gap-2">
                Saber Mais <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        `;
      };

      // 1. Universidades & Academia
      if (containerAcademic && grouped['Universidades & Academia'] && grouped['Universidades & Academia'].length > 0) {
        containerAcademic.innerHTML = grouped['Universidades & Academia'].map(renderAcademicCard).join('');
      }

      // 2. Indústria & Certificação
      if (containerIndustry && grouped['Indústria & Certificação'] && grouped['Indústria & Certificação'].length > 0) {
        containerIndustry.innerHTML = grouped['Indústria & Certificação'].map(p => renderIndustryCard(p, 'precision_manufacturing')).join('');
      }

      // 3. Governo & Instituições Públicas
      const blockGov = document.getElementById('block-governo');
      const containerGov = document.getElementById('dynamic-governo-partners');
      if (grouped['Governo & Instituições Públicas'] && grouped['Governo & Instituições Públicas'].length > 0) {
        if (blockGov) blockGov.classList.remove('hidden');
        if (containerGov) {
          containerGov.innerHTML = grouped['Governo & Instituições Públicas'].map(p => renderIndustryCard(p, 'account_balance')).join('');
        }
      }

      // 4. Sustentabilidade & Ambiente
      const blockSust = document.getElementById('block-sustentabilidade');
      const containerSust = document.getElementById('dynamic-sustainability-partners');
      if (grouped['Sustentabilidade & Ambiente'] && grouped['Sustentabilidade & Ambiente'].length > 0) {
        if (blockSust) blockSust.classList.remove('hidden');
        if (containerSust) {
          containerSust.innerHTML = grouped['Sustentabilidade & Ambiente'].map(p => renderIndustryCard(p, 'eco')).join('');
        }
      }

      // 5. Outras Categorias Customizadas criadas no Backoffice
      const customContainer = document.getElementById('dynamic-custom-categories');
      if (customContainer) {
        const knownCategories = ['Universidades & Academia', 'Indústria & Certificação', 'Governo & Instituições Públicas', 'Sustentabilidade & Ambiente'];
        Object.keys(grouped).forEach(catName => {
          if (!knownCategories.includes(catName) && grouped[catName].length > 0) {
            const sectionHtml = `
              <div class="partner-category-block" data-category-section="${catName}">
                <div class="flex items-center gap-3 mb-8 border-b border-outline-variant pb-4">
                  <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">domain</span>
                  <h2 class="font-headline-md text-headline-md text-primary">${catName}</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter reveal-stagger-parent">
                  ${grouped[catName].map(p => renderIndustryCard(p, 'domain')).join('')}
                </div>
              </div>
            `;
            customContainer.innerHTML += sectionHtml;
          }
        });
      }

      // 6. Configurar Filtros Interativos por Categoria (Tabs)
      if (tabsContainer) {
        const filterBtns = tabsContainer.querySelectorAll('.partner-filter-btn');
        filterBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const selectedCat = btn.getAttribute('data-category');

            // Atualiza botões
            filterBtns.forEach(b => {
              b.classList.remove('bg-primary', 'text-on-primary', 'border-primary', 'shadow-sm');
              b.classList.add('bg-surface', 'text-on-surface-variant', 'border-outline-variant');
            });
            btn.classList.remove('bg-surface', 'text-on-surface-variant', 'border-outline-variant');
            btn.classList.add('bg-primary', 'text-on-primary', 'border-primary', 'shadow-sm');

            // Filtra os blocos de categoria na página
            const categoryBlocks = document.querySelectorAll('.partner-category-block');
            categoryBlocks.forEach(block => {
              const blockCat = block.getAttribute('data-category-section');
              if (selectedCat === 'all' || blockCat === selectedCat) {
                // Não exibir blocos que estejam vazios por padrão (ex: governo se não tiver parceiros)
                if ((block.id === 'block-governo' && (!grouped['Governo & Instituições Públicas'] || grouped['Governo & Instituições Públicas'].length === 0)) ||
                    (block.id === 'block-sustentabilidade' && (!grouped['Sustentabilidade & Ambiente'] || grouped['Sustentabilidade & Ambiente'].length === 0))) {
                  block.classList.add('hidden');
                } else {
                  block.classList.remove('hidden');
                }
              } else {
                block.classList.add('hidden');
              }
            });

            if (window.observeScrollElements) window.observeScrollElements();
          });
        });
      }

      if (window.observeScrollElements) window.observeScrollElements();
    } catch (e) {
      console.error('Erro ao carregar parceiros institucionais:', e);
    }
  };

  await fetchBanners();
  await fetchServicos();
  await fetchCursos();
  await fetchAllPartners();
});

