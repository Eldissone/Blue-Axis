(() => {
  const API = 'http://localhost:3333';
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
  const formatDate = (value) => value ? new Intl.DateTimeFormat('pt-PT', { dateStyle: 'long' }).format(new Date(value)) : '';

  const grid = document.getElementById('newsGrid');
  if (grid) {
    const state = document.getElementById('newsState');
    const search = document.getElementById('newsSearch');
    const categories = document.getElementById('newsCategories');
    let category = '';
    let timer;

    const load = async () => {
      state.hidden = false;
      state.textContent = 'A carregar publicações…';
      const params = new URLSearchParams({ limite: '12' });
      if (search.value.trim()) params.set('pesquisa', search.value.trim());
      if (category) params.set('categoria', category);
      try {
        const response = await fetch(`${API}/publicacoes?${params}`);
        if (!response.ok) throw new Error('Falha ao carregar');
        const { dados } = await response.json();
        grid.innerHTML = dados.map((item) => {
          const image = item.imagemCapaUrl ? `<img src="${API}${escapeHtml(item.imagemCapaUrl)}" alt="">` : '<div class="news-card-placeholder"></div>';
          return `<article class="news-card">${image}<div class="news-card-body"><span class="news-card-meta">${escapeHtml(item.categoria)} · ${formatDate(item.publicadoEm)}</span><h2>${escapeHtml(item.titulo)}</h2><p>${escapeHtml(item.resumo)}</p><a href="/noticias/${encodeURIComponent(item.slug)}">Ler publicação <span aria-hidden="true">→</span></a></div></article>`;
        }).join('');
        state.hidden = dados.length > 0;
        if (!dados.length) state.textContent = 'Não foram encontradas publicações com estes filtros.';
      } catch {
        grid.innerHTML = '';
        state.hidden = false;
        state.textContent = 'Não foi possível carregar as publicações. Tente novamente mais tarde.';
      }
    };
    search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(load, 260); });
    categories.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      category = button.dataset.category;
      categories.querySelectorAll('[data-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      load();
    });
    load();
    return;
  }

  const article = document.getElementById('newsArticle');
  if (!article) return;
  const state = document.getElementById('detailState');
  const slug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean).pop() || '');
  (async () => {
    try {
      const response = await fetch(`${API}/publicacoes/${encodeURIComponent(slug)}`);
      if (!response.ok) throw new Error('not-found');
      const item = await response.json();
      document.title = `${item.titulo} | BLUE HORIZON`;
      document.getElementById('newsMeta').textContent = `${item.categoria} · ${formatDate(item.publicadoEm)}${item.autor ? ` · ${item.autor}` : ''}`;
      document.getElementById('newsTitle').textContent = item.titulo;
      document.getElementById('newsSummary').textContent = item.resumo;
      document.getElementById('newsContent').textContent = item.conteudo;
      if (item.imagemCapaUrl) { const cover = document.getElementById('newsCover'); cover.src = `${API}${item.imagemCapaUrl}`; cover.alt = item.titulo; cover.hidden = false; }
      if (item.documentos?.length) {
        const box = document.getElementById('newsDocuments');
        document.getElementById('newsDocumentsList').innerHTML = item.documentos.map((doc) => `<a class="news-document" href="${API}/publicacoes/${encodeURIComponent(item.slug)}/documentos/${doc.id}/download"><span>PDF · ${escapeHtml(doc.nomeArquivo)}</span><span>Descarregar ↓</span></a>`).join('');
        box.hidden = false;
      }
      state.hidden = true; article.hidden = false;
    } catch { state.textContent = 'Publicação não encontrada ou indisponível.'; }
  })();
})();
