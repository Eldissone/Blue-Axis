import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'public');

// --- 1. JS GLOBAL PARA FORMULÁRIOS ---
const jsContent = \`
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
\`;
fs.writeFileSync(path.join(basePath, 'js', 'public-forms.js'), jsContent);


// --- 2. INSERIR SCRIPTS E FORMS NAS PÁGINAS ---
function appendScriptAndForm(filePath, formHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  if(!content.includes('public-forms.js')) {
    content = content.replace('</body>', \`<script src="/js/public-forms.js"></script>\n</body>\`);
  }
  if(!content.includes(formHtml.substring(0, 30))) {
    // Insere o form antes do footer
    content = content.replace(/<section class="footer-main">|<footer/i, match => \`\n\${formHtml}\n\n\` + match);
    fs.writeFileSync(filePath, content);
  }
}

// Form Academia
const htmlAcademia = \`
<section class="py-16 bg-white" id="inscricao">
  <div class="container mx-auto px-4 max-w-2xl">
    <form id="formAcademia" class="bg-slate-50 p-8 rounded-[25px] shadow-sm border border-gray-100">
      <h3 class="text-3xl font-bold text-primary mb-6 text-center">Ficha de Inscrição - Academia</h3>
      <div class="space-y-4">
        <input type="text" id="acadNome" placeholder="Nome Completo" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="email" id="acadEmail" placeholder="E-mail" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="text" id="acadTelefone" placeholder="Telefone" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <select id="acadCurso" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 focus:ring-2 focus:ring-primary outline-none">
          <option value="">Selecione um Curso...</option>
          <option value="Gestao Portuaria">Gestão Portuária</option>
          <option value="Logistica Maritima">Logística Marítima</option>
          <option value="Direito Maritimo">Direito Marítimo</option>
        </select>
        <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-[25px] hover:bg-blue-800 transition shadow-md">Enviar Inscrição</button>
      </div>
    </form>
  </div>
</section>
\`;
appendScriptAndForm(path.join(basePath, 'pages', 'academia.html'), htmlAcademia);


// Form Consultoria
const htmlConsultoria = \`
<section class="py-16 bg-white" id="solicitar-consultoria">
  <div class="container mx-auto px-4 max-w-2xl">
    <form id="formConsultoria" class="bg-slate-50 p-8 rounded-[25px] shadow-sm border border-gray-100">
      <h3 class="text-3xl font-bold text-primary mb-6 text-center">Solicitar Consultoria</h3>
      <div class="space-y-4">
        <input type="text" id="consEmpresa" placeholder="Nome da Empresa" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="text" id="consContato" placeholder="Nome do Contato" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="email" id="consEmail" placeholder="E-mail Corporativo" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <textarea id="consNecessidade" placeholder="Descreva sua necessidade..." required rows="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"></textarea>
        <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-[25px] hover:bg-blue-800 transition shadow-md">Solicitar Contato</button>
      </div>
    </form>
  </div>
</section>
\`;
appendScriptAndForm(path.join(basePath, 'pages', 'consultoria.html'), htmlConsultoria);


// Form Parceiros
const htmlParceiros = \`
<section class="py-16 bg-white" id="seja-parceiro">
  <div class="container mx-auto px-4 max-w-2xl">
    <form id="formParceiro" class="bg-slate-50 p-8 rounded-[25px] shadow-sm border border-gray-100">
      <h3 class="text-3xl font-bold text-primary mb-6 text-center">Seja um Parceiro</h3>
      <div class="space-y-4">
        <input type="text" id="parcEmpresa" placeholder="Nome da Empresa / Instituição" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="email" id="parcEmail" placeholder="E-mail Corporativo" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <input type="text" id="parcSetor" placeholder="Setor de Atuação" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
        <textarea id="parcProposta" placeholder="Descreva a proposta de parceria..." required rows="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"></textarea>
        <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-[25px] hover:bg-blue-800 transition shadow-md">Enviar Proposta</button>
      </div>
    </form>
  </div>
</section>
\`;
appendScriptAndForm(path.join(basePath, 'pages', 'parceiros.html'), htmlParceiros);

// Index.html para o script da Newsletter global
let idxContent = fs.readFileSync(path.join(basePath, 'index.html'), 'utf8');
if(!idxContent.includes('public-forms.js')) {
  idxContent = idxContent.replace('</body>', \`<script src="/js/public-forms.js"></script>\n</body>\`);
  fs.writeFileSync(path.join(basePath, 'index.html'), idxContent);
}
let sobreContent = fs.readFileSync(path.join(basePath, 'pages', 'sobre.html'), 'utf8');
if(!sobreContent.includes('public-forms.js')) {
  sobreContent = sobreContent.replace('</body>', \`<script src="/js/public-forms.js"></script>\n</body>\`);
  fs.writeFileSync(path.join(basePath, 'pages', 'sobre.html'), sobreContent);
}
let contContent = fs.readFileSync(path.join(basePath, 'pages', 'contacto.html'), 'utf8');
if(!contContent.includes('public-forms.js')) {
  contContent = contContent.replace('</body>', \`<script src="/js/public-forms.js"></script>\n</body>\`);
  fs.writeFileSync(path.join(basePath, 'pages', 'contacto.html'), contContent);
}

console.log("Injeção de formulários concluída com sucesso!");
