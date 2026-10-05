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

  carregarUsuarios();

  async function carregarUsuarios() {
    try {
      const resposta = await fetch('http://localhost:3333/backoffice/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (resposta.status === 401 || resposta.status === 403) {
        localStorage.removeItem('backoffice_token');
        window.location.href = '/backoffice/login';
        return;
      }

      const usuarios = await resposta.json();
      renderizarTabela(usuarios);
    } catch (erro) {
      console.error('Erro ao carregar usuários', erro);
    }
  }

  function renderizarTabela(usuarios) {
    const tbody = document.getElementById('tabelaUsuarios');
    tbody.innerHTML = '';

    usuarios.forEach(usuario => {
      const tr = document.createElement('tr');
      
      const dataFormatada = new Date(usuario.criadoEm).toLocaleDateString('pt-BR');
      
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${usuario.nome}</div>
          <div class="text-sm text-gray-500">${usuario.email}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.perfil === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
            ${usuario.perfil}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${dataFormatada}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <select onchange="alterarPerfil('${usuario.id}', this.value)" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="USUARIO" ${usuario.perfil === 'USUARIO' ? 'selected' : ''}>Usuário</option>
            <option value="ADMIN" ${usuario.perfil === 'ADMIN' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
  }

  window.alterarPerfil = async function(idUsuario, novoPerfil) {
    if (!confirm(`Tem certeza que deseja mudar este usuário para ${novoPerfil}?`)) {
      carregarUsuarios(); // Reverte a seleção do select
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3333/backoffice/usuarios/${idUsuario}/perfil`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ novoPerfil })
      });

      if (resposta.ok) {
        alert('Perfil alterado e ação auditada com sucesso!');
        carregarUsuarios();
      } else {
        const dados = await resposta.json();
        alert('Erro: ' + dados.mensagem);
        carregarUsuarios();
      }
    } catch (erro) {
      alert('Erro de conexão ao alterar perfil.');
      carregarUsuarios();
    }
  }
});
