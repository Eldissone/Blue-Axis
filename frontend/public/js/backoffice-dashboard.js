document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('backoffice_token');
  const user = JSON.parse(localStorage.getItem('backoffice_user') || '{}');

  if (!token) {
    window.location.href = '/backoffice/login';
    return;
  }

  document.getElementById('adminNome').textContent = `Olá, ${user.nome}`;

  document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.removeItem('backoffice_token');
    localStorage.removeItem('backoffice_user');
    window.location.href = '/backoffice/login';
  });

  // --- Função para trocar de painéis (SPA) ---
  window.showPanel = function showPanel(panelId) {
    // Esconde todos
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.remove('bg-primary/10', 'text-primary', 'font-bold');
      l.classList.add('text-gray-600', 'font-medium');
    });

    // Mostra o atual
    const painelAtual = document.getElementById(`panel-${panelId}`);
    if (painelAtual) painelAtual.classList.remove('hidden');

    // Estiliza o link ativo (baseado no onclick="showPanel('id')")
    const linkAtivo = document.querySelector(`[onclick="showPanel('${panelId}')"]`);
    if (linkAtivo) {
      linkAtivo.classList.remove('text-gray-600', 'font-medium');
      linkAtivo.classList.add('bg-primary/10', 'text-primary', 'font-bold');
    }

    // Carrega os dados correspondentes
    if (panelId === 'usuarios') carregarUsuarios();
    if (panelId === 'inscricoes') carregarInscricoes();
    if (panelId === 'consultorias') carregarConsultorias();
    if (panelId === 'parceiros') carregarParceiros();
    if (panelId === 'banners') carregarBanners();
    if (panelId === 'servicos') carregarServicos();
    if (panelId === 'cursos') carregarCursos();
    if (panelId === 'newsletter') carregarNewsletter();
  }

  function setButtonLoading(form, isLoading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.innerHTML = '<div class="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 align-middle"></div><span class="align-middle">A aguardar...</span>';
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.innerHTML = btn.dataset.originalHtml;
    }
  }

  // Removido showPanel daqui

  // --- MÓDULOS DE FETCH ---
  const headerComum = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  async function fetchData(endpoint, tableId, renderCallback) {
    try {
      const res = await fetch(`http://localhost:3333${endpoint}`, { headers: headerComum });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('backoffice_token');
        window.location.href = '/backoffice/login';
        return;
      }
      const data = await res.json();
      renderCallback(data, document.getElementById(tableId));
    } catch (err) {
      console.error(`Erro ao buscar ${endpoint}`, err);
    }
  }

  // 1. USUÁRIOS
  function carregarUsuarios() {
    fetchData('/backoffice/usuarios', 'tabelaUsuarios', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${item.nome}</div><div class="text-sm text-gray-500">${item.email}</div></td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.perfil === 'ADMIN' || item.perfil === 'SUPER_ADMIN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${item.perfil}</span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(item.criadoEm).toLocaleDateString('pt-BR')}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <select onchange="alterarPerfil('${item.id}', this.value)" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm">
              <option value="USUARIO" ${item.perfil === 'USUARIO' ? 'selected' : ''}>Usuário</option>
              <option value="ADMIN" ${item.perfil === 'ADMIN' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 2. BANNERS
  let bannersData = [];
  function carregarBanners() {
    fetchData('/backoffice/banners', 'tabelaBanners', (dados, tbody) => {
      bannersData = dados;
      tbody.innerHTML = '';
      dados.forEach(item => {
        const imagemSrc = item.imagemUrl ? `http://localhost:3333${item.imagemUrl}` : '';
        const imgTag = imagemSrc ? `<img src="${imagemSrc}" alt="Banner" class="h-12 w-24 object-cover rounded shadow-sm border border-gray-200">` : '<span class="text-xs text-gray-400">Sem imagem</span>';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">${item.ordem}</td>
          <td class="px-6 py-4 whitespace-nowrap">${imgTag}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[250px] truncate" title="${item.titulo}">${item.titulo}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full ${item.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${item.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer" onclick="editarBanner(${item.id})">Editar</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 3. SERVIÇOS
  function carregarServicos() {
    fetchData('/backoffice/servicos', 'tabelaServicos', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.titulo}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full ${item.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${item.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer">Editar</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 3.5 CURSOS
  let cursosData = [];
  function carregarCursos() {
    fetchData('/backoffice/cursos', 'tabelaCursos', (dados, tbody) => {
      cursosData = dados;
      tbody.innerHTML = '';
      dados.forEach(item => {
        const imgTag = item.imagemUrl ? `<img src="http://localhost:3333${item.imagemUrl}" class="h-12 w-16 object-cover rounded shadow-sm border border-gray-200">` : '<span class="text-xs text-gray-400">S/ Imagem</span>';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap">${imgTag}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-bold text-gray-900">${item.titulo}</div>
            <div class="text-xs text-gray-500">${item.categoria}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
            <div>${item.cargaHoraria}</div>
            <div>${item.modalidade}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full ${item.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${item.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer" onclick="editarCurso(${item.id})">Editar</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 4. INSCRIÇÕES
  function carregarInscricoes() {
    fetchData('/backoffice/inscricoes', 'tabelaInscricoes', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        let statusColor = 'bg-yellow-100 text-yellow-800';
        if (item.status === 'APROVADO') statusColor = 'bg-green-100 text-green-800';
        if (item.status === 'REJEITADO') statusColor = 'bg-red-100 text-red-800';

        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${item.nome}</div><div class="text-sm text-gray-500">${item.email}</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.curso}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full ${statusColor}">${item.status}</span></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <select onchange="alterarStatusInscricao('${item.id}', this.value)" class="mt-1 block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm">
              <option value="PENDENTE" ${item.status === 'PENDENTE' ? 'selected' : ''}>Pendente</option>
              <option value="APROVADO" ${item.status === 'APROVADO' ? 'selected' : ''}>Aprovar</option>
              <option value="REJEITADO" ${item.status === 'REJEITADO' ? 'selected' : ''}>Rejeitar</option>
            </select>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 5. CONSULTORIAS
  function carregarConsultorias() {
    fetchData('/backoffice/consultorias', 'tabelaConsultorias', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${item.nomeEmpresa}</div><div class="text-sm text-gray-500">${item.nomeContato} (${item.email})</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">${item.necessidade}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 6. PARCEIROS
  function carregarParceiros() {
    fetchData('/backoffice/parceiros', 'tabelaParceiros', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${item.nomeEmpresa}</div><div class="text-sm text-gray-500">${item.email}</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.setor}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // 7. NEWSLETTER
  function carregarNewsletter() {
    fetchData('/backoffice/newsletter', 'tabelaNewsletter', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.email}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(item.criadoEm).toLocaleDateString('pt-BR')}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // --- ACTIONS ---
  window.alterarPerfil = async function(idUsuario, novoPerfil) {
    if (!confirm(`Tem certeza que deseja mudar este usuário para ${novoPerfil}?`)) {
      carregarUsuarios(); // Reverte
      return;
    }
    try {
      const res = await fetch(`http://localhost:3333/backoffice/usuarios/${idUsuario}/perfil`, {
        method: 'PATCH',
        headers: headerComum,
        body: JSON.stringify({ novoPerfil })
      });
      if (res.ok) {
        alert('Perfil alterado!');
        carregarUsuarios();
      } else {
        alert('Erro ao alterar perfil');
      }
    } catch (e) {
      alert('Erro de conexão');
    }
  }

  window.alterarStatusInscricao = async function(idInscricao, novoStatus) {
    if (!confirm(`Tem certeza que deseja marcar esta inscrição como ${novoStatus}?`)) {
      carregarInscricoes(); // Reverte
      return;
    }
    try {
      const res = await fetch(`http://localhost:3333/backoffice/inscricoes/${idInscricao}/status`, {
        method: 'PATCH',
        headers: headerComum,
        body: JSON.stringify({ status: novoStatus })
      });
      if (res.ok) {
        alert(`Inscrição ${novoStatus.toLowerCase()}!`);
        carregarInscricoes();
      } else {
        alert('Erro ao alterar status');
      }
    } catch (e) {
      alert('Erro de conexão');
    }
  }

  // --- MODAL BANNER ---
  window.criarBanner = function() {
    document.getElementById('bannerId').value = '';
    document.getElementById('bannerImagem').required = true;
    document.getElementById('modalBanner').classList.remove('hidden');
  }

  window.editarBanner = function(id) {
    const banner = bannersData.find(b => b.id === id);
    if (!banner) return;
    document.getElementById('bannerId').value = banner.id;
    document.getElementById('bannerTitulo').value = banner.titulo;
    document.getElementById('bannerTituloDestaque').value = banner.tituloDestaque || '';
    document.getElementById('bannerDescricao').value = banner.descricao || '';
    document.getElementById('bannerOrdem').value = banner.ordem || 1;
    document.getElementById('bannerImagem').required = false; // Não é obrigatório alterar a imagem
    document.getElementById('modalBanner').classList.remove('hidden');
  }

  window.fecharModalBanner = function() {
    document.getElementById('modalBanner').classList.add('hidden');
    document.getElementById('formBanner').reset();
    const previewContainer = document.getElementById('bannerPreviewContainer');
    if (previewContainer) previewContainer.classList.add('hidden');
  }

  document.getElementById('formBanner').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('bannerTitulo').value;
    const tituloDestaque = document.getElementById('bannerTituloDestaque').value;
    const descricao = document.getElementById('bannerDescricao').value;
    const ordem = document.getElementById('bannerOrdem').value;
    const fileInput = document.getElementById('bannerImagem');
    const formData = new FormData();
    
    formData.append('titulo', titulo);
    if (tituloDestaque) formData.append('tituloDestaque', tituloDestaque);
    if (descricao) formData.append('descricao', descricao);
    formData.append('ativo', 'true');
    formData.append('ordem', ordem);
    if (fileInput.files[0]) {
      formData.append('imagem', fileInput.files[0]);
    }

    const bannerId = document.getElementById('bannerId').value;
    
    setButtonLoading(document.getElementById('formBanner'), true);
    try {
      let url = 'http://localhost:3333/backoffice/banners';
      let method = 'POST';

      if (bannerId) {
        url = `http://localhost:3333/backoffice/banners/${bannerId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }, // NOTA: O FormData define automaticamente o Content-Type para multipart
        body: formData
      });
      if (res.ok) {
        alert('Banner salvo com sucesso!');
        fecharModalBanner();
        carregarBanners();
      } else {
        alert('Erro ao salvar banner');
      }
    } catch(e) { alert('Erro ao salvar: ' + e.message); }
    finally { setButtonLoading(document.getElementById('formBanner'), false); }
  });

  // --- MODAL SERVIÇO ---
  window.criarServico = function() {
    document.getElementById('modalServico').classList.remove('hidden');
  }
  window.fecharModalServico = function() {
    document.getElementById('modalServico').classList.add('hidden');
    document.getElementById('formServico').reset();
  }

  document.getElementById('formServico').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('servicoTitulo').value;
    const descricao = document.getElementById('servicoDescricao').value;
    const fileInput = document.getElementById('servicoImagem');
    
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('ativo', 'true');
    if (fileInput.files[0]) {
      formData.append('imagem', fileInput.files[0]);
    }

    setButtonLoading(document.getElementById('formServico'), true);
    try {
      const res = await fetch('http://localhost:3333/backoffice/servicos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Serviço criado com sucesso!');
        fecharModalServico();
        carregarServicos();
      } else {
        alert('Erro ao criar serviço');
      }
    } catch(e) { alert('Erro ao criar: ' + e.message); }
    finally { setButtonLoading(document.getElementById('formServico'), false); }
  });

  // --- MODAL CURSO ---
  window.criarCurso = function() {
    document.getElementById('cursoId').value = '';
    document.getElementById('cursoImagem').required = true;
    document.getElementById('modalCurso').classList.remove('hidden');
    document.getElementById('cursoPreviewContainer').classList.add('hidden');
    document.getElementById('formCurso').reset();
  }
  
  window.editarCurso = function(id) {
    const curso = cursosData.find(c => c.id === id);
    if (!curso) return;
    document.getElementById('cursoId').value = curso.id;
    document.getElementById('cursoTitulo').value = curso.titulo;
    document.getElementById('cursoCategoria').value = curso.categoria;
    document.getElementById('cursoDescricao').value = curso.descricao;
    document.getElementById('cursoCargaHoraria').value = curso.cargaHoraria;
    document.getElementById('cursoModalidade').value = curso.modalidade;
    document.getElementById('cursoCertificadora').value = curso.certificadora;
    document.getElementById('cursoAtivo').checked = curso.ativo;
    document.getElementById('cursoImagem').required = false;

    if (curso.imagemUrl) {
      document.getElementById('cursoPreview').src = `http://localhost:3333${curso.imagemUrl}`;
      document.getElementById('cursoPreviewContainer').classList.remove('hidden');
    }
    document.getElementById('modalCurso').classList.remove('hidden');
  }

  window.fecharModalCurso = function() {
    document.getElementById('modalCurso').classList.add('hidden');
    document.getElementById('formCurso').reset();
  }

  document.getElementById('formCurso').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cursoId').value;
    const formData = new FormData();
    formData.append('titulo', document.getElementById('cursoTitulo').value);
    formData.append('categoria', document.getElementById('cursoCategoria').value);
    formData.append('descricao', document.getElementById('cursoDescricao').value);
    formData.append('cargaHoraria', document.getElementById('cursoCargaHoraria').value);
    formData.append('modalidade', document.getElementById('cursoModalidade').value);
    formData.append('certificadora', document.getElementById('cursoCertificadora').value);
    formData.append('ativo', document.getElementById('cursoAtivo').checked);

    const fileInput = document.getElementById('cursoImagem');
    if (fileInput.files[0]) formData.append('imagemUrl', fileInput.files[0]);

    let url = 'http://localhost:3333/backoffice/cursos';
    let method = 'POST';
    if (id) {
      url = `${url}/${id}`;
      method = 'PUT';
    }

    setButtonLoading(document.getElementById('formCurso'), true);
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.ok) {
        alert(`Curso ${id ? 'atualizado' : 'criado'} com sucesso!`);
        fecharModalCurso();
        carregarCursos();
      } else alert('Erro ao salvar curso');
    } catch(e) { alert('Erro: ' + e.message); }
    finally { setButtonLoading(document.getElementById('formCurso'), false); }
  });

  // --- START ---
  showPanel('usuarios');
});

// Custom Alert/Toast Notification System
window.showAlert = function(message, type = 'info') {
    let container = document.getElementById('alert-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-toast-container';
        container.style.cssText = 'position: fixed; bottom: 32px; right: 32px; z-index: 99999; display: flex; flex-direction: column; gap: 12px; pointer-events: none;';
        document.body.appendChild(container);
    }
    
    const isError = message.toLowerCase().includes('erro');
    const borderColor = isError ? '#BA1A1A' : '#005A9C';
    const iconName = isError ? 'error' : 'check_circle';
    const iconColor = isError ? '#BA1A1A' : '#005A9C';
    
    const toast = document.createElement('div');
    toast.style.cssText = `background: white; border-radius: 16px; padding: 16px 24px 16px 20px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15); border-left: 6px solid ${borderColor}; transform: translateY(150%) scale(0.9); opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: space-between; gap: 16px; pointer-events: auto; min-width: 300px;`;
    
    toast.innerHTML = `
        <div style="display: flex; items-center: center; gap: 12px;">
            <span class="material-symbols-outlined" style="color: ${iconColor}; font-size: 24px;" style="font-variation-settings: 'FILL' 1;">${iconName}</span>
            <span style="color: #1a202c; font-weight: 600; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.4;">${message}</span>
        </div>
        <button style="background: none; border: none; cursor: pointer; color: #a0aec0; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'; this.style.color='#4a5568'" onmouseout="this.style.background='transparent'; this.style.color='#a0aec0'">
            <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
        </button>
    `;
    
    const closeBtn = toast.querySelector('button');
    const close = () => {
        toast.style.transform = 'translateY(150%) scale(0.9)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    };
    closeBtn.onclick = close;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0) scale(1)';
            toast.style.opacity = '1';
        });
    });
    
    setTimeout(close, 4500);
};

// Override native alert globally
window.alert = function(msg) {
    window.showAlert(msg);
};
