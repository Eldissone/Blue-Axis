document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const erroDiv = document.getElementById('erroMensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    erroDiv.classList.add('hidden');

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const resposta = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        if (dados.usuario.perfil !== 'ADMIN' && dados.usuario.perfil !== 'SUPER_ADMIN') {
          erroDiv.textContent = 'Acesso negado. Apenas administradores.';
          erroDiv.classList.remove('hidden');
          return;
        }

        // Salva token e dados do usuário
        localStorage.setItem('backoffice_token', dados.token);
        localStorage.setItem('backoffice_user', JSON.stringify(dados.usuario));
        
        window.location.href = '/backoffice/dashboard';
      } else {
        erroDiv.textContent = dados.mensagem || 'Erro ao fazer login';
        erroDiv.classList.remove('hidden');
      }
    } catch (erro) {
      erroDiv.textContent = 'Erro de conexão com o servidor.';
      erroDiv.classList.remove('hidden');
    }
  });
});
