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
    if (panelId === 'newsletter') carregarNewsletter();
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
  function carregarBanners() {
    fetchData('/backoffice/banners', 'tabelaBanners', (dados, tbody) => {
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

  // 4. INSCRIÇÕES
  function carregarInscricoes() {
    fetchData('/backoffice/inscricoes', 'tabelaInscricoes', (dados, tbody) => {
      tbody.innerHTML = '';
      dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${item.nome}</div><div class="text-sm text-gray-500">${item.email}</div></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.curso}</td>
          <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${item.status}</span></td>
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

  // --- MODAL BANNER ---
  window.criarBanner = function() {
    document.getElementById('modalBanner').classList.remove('hidden');
  }
  window.fecharModalBanner = function() {
    document.getElementById('modalBanner').classList.add('hidden');
    document.getElementById('formBanner').reset();
  }

  document.getElementById('formBanner').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('bannerTitulo').value;
    const fileInput = document.getElementById('bannerImagem');
    const formData = new FormData();
    
    formData.append('titulo', titulo);
    formData.append('ativo', 'true');
    formData.append('ordem', '1');
    if (fileInput.files[0]) {
      formData.append('imagem', fileInput.files[0]);
    }

    try {
      const res = await fetch('http://localhost:3333/backoffice/banners', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // NOTA: O FormData define automaticamente o Content-Type para multipart
        body: formData
      });
      if (res.ok) {
        alert('Banner criado com sucesso!');
        fecharModalBanner();
        carregarBanners();
      } else {
        alert('Erro ao criar banner');
      }
    } catch(e) { alert('Erro ao criar: ' + e.message); }
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
  });

  // --- START ---
  showPanel('usuarios');
});
