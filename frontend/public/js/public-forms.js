document.addEventListener('DOMContentLoaded', () => {
  
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
  
  // Academia Form
  const formAcademia = document.getElementById('formAcademia');
  if(formAcademia) {
    formAcademia.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        nome: document.getElementById('acadNome').value,
        email: document.getElementById('acadEmail').value,
        telefone: document.getElementById('acadTelefone').value,
        curso: document.getElementById('acadCurso').value
      };
      setButtonLoading(formAcademia, true);
      try {
        const res = await fetch('http://localhost:3333/inscricoes', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        if(res.ok) { alert('Inscrição enviada com sucesso!'); formAcademia.reset(); if(typeof fecharModalInscricao === 'function') fecharModalInscricao(); }
        else alert('Erro ao enviar inscrição.');
      } catch(e) { alert('Erro de conexão ao servidor.'); }
      finally { setButtonLoading(formAcademia, false); }
    });
  }

  // Consultoria Form
  const formConsultoria = document.getElementById('formConsultoria');
  if(formConsultoria) {
    formConsultoria.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        nomeEmpresa: document.getElementById('consEmpresa').value,
        nomeContato: document.getElementById('consContato').value,
        email: document.getElementById('consEmail').value,
        necessidade: document.getElementById('consNecessidade').value
      };
      setButtonLoading(formConsultoria, true);
      try {
        const res = await fetch('http://localhost:3333/consultorias', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        if(res.ok) { alert('Solicitação de consultoria enviada com sucesso!'); formConsultoria.reset(); if(typeof fecharModalConsultoria === 'function') fecharModalConsultoria(); }
        else alert('Erro ao enviar solicitação.');
      } catch(e) { alert('Erro de conexão ao servidor.'); }
      finally { setButtonLoading(formConsultoria, false); }
    });
  }

  // Parceiros Form
  const formParceiro = document.getElementById('formParceiro');
  if(formParceiro) {
    formParceiro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        nomeEmpresa: document.getElementById('parcEmpresa').value,
        email: document.getElementById('parcEmail').value,
        setor: document.getElementById('parcSetor').value,
        proposta: document.getElementById('parcProposta').value
      };
      setButtonLoading(formParceiro, true);
      try {
        const res = await fetch('http://localhost:3333/parceiros', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        if(res.ok) { alert('Solicitação de parceria enviada com sucesso!'); formParceiro.reset(); if(typeof fecharModalParceiro === 'function') fecharModalParceiro(); }
        else alert('Erro ao enviar solicitação.');
      } catch(e) { alert('Erro de conexão ao servidor.'); }
      finally { setButtonLoading(formParceiro, false); }
    });
  }

  // Newsletter (global nas tags 'a' com texto especifico)
  document.addEventListener('click', async (e) => {
    if (e.target.closest('a') && e.target.closest('a').textContent.includes('Subscrever newsletter')) {
      e.preventDefault();
      const email = prompt('Digite seu e-mail para assinar nossa newsletter:');
      if (email) {
        const res = await fetch('http://localhost:3333/newsletter', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email }) });
        if(res.ok) alert('E-mail cadastrado na newsletter com sucesso!');
        else alert('Erro ao cadastrar e-mail.');
      }
    }
  });

});
