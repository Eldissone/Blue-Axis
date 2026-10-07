document.addEventListener('DOMContentLoaded', () => {
  
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
      const res = await fetch('http://localhost:3333/inscricoes', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      if(res.ok) { alert('Inscrição enviada com sucesso!'); formAcademia.reset(); }
      else alert('Erro ao enviar inscrição.');
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
      const res = await fetch('http://localhost:3333/consultorias', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      if(res.ok) { alert('Solicitação de consultoria enviada com sucesso!'); formConsultoria.reset(); }
      else alert('Erro ao enviar solicitação.');
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
      const res = await fetch('http://localhost:3333/parceiros', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      if(res.ok) { alert('Solicitação de parceria enviada com sucesso!'); formParceiro.reset(); }
      else alert('Erro ao enviar solicitação.');
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
