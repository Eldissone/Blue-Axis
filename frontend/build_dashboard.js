import fs from 'fs';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'public', 'pages', 'backoffice', 'dashboard.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// The panels to add
const panels = `
        <!-- Banners Panel -->
        <div id="panel-banners" class="hidden bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h1 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">view_carousel</span> Banners
            </h1>
            <button onclick="abrirModalBanner()" class="bg-primary text-white px-4 py-2 rounded-[25px] font-bold text-sm">Novo Banner</button>
          </div>
          <div class="p-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead><tr><th>Título</th><th>Imagem URL</th><th>Ações</th></tr></thead>
              <tbody id="tabelaBanners"></tbody>
            </table>
          </div>
        </div>

        <!-- Serviços Panel -->
        <div id="panel-servicos" class="hidden bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h1 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">design_services</span> Serviços
            </h1>
            <button onclick="abrirModalServico()" class="bg-primary text-white px-4 py-2 rounded-[25px] font-bold text-sm">Novo Serviço</button>
          </div>
          <div class="p-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead><tr><th>Título</th><th>Descrição</th><th>Ações</th></tr></thead>
              <tbody id="tabelaServicos"></tbody>
            </table>
          </div>
        </div>

        <!-- Inscrições Panel -->
        <div id="panel-inscricoes" class="hidden bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h1 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">school</span> Inscrições (Cursos)
            </h1>
          </div>
          <div class="p-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead><tr><th>Nome / E-mail</th><th>Curso</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody id="tabelaInscricoes"></tbody>
            </table>
          </div>
        </div>

        <!-- Consultorias Panel -->
        <div id="panel-consultorias" class="hidden bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h1 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">support_agent</span> Solicitações de Consultoria
            </h1>
          </div>
          <div class="p-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead><tr><th>Empresa</th><th>Contato</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody id="tabelaConsultorias"></tbody>
            </table>
          </div>
        </div>
`;

// Replace the main content logic
html = html.replace(/<div class="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">/, \`<div id="panel-usuarios" class="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">\`);

// Insert the new panels right before the end of the max-w-7xl div
html = html.replace(/<\/main>/, \`\n\${panels}\n    </main>\`);

// Add onclick handlers to the sidebar links
html = html.replace('href="/backoffice/dashboard"', 'href="#" onclick="showPanel(\\'usuarios\\')"');
html = html.replace('<span class="material-symbols-outlined">school</span> Inscrições (Cursos)', '<span class="material-symbols-outlined">school</span> <span onclick="showPanel(\\'inscricoes\\')">Inscrições (Cursos)</span>');
html = html.replace('<span class="material-symbols-outlined">support_agent</span> Consultorias', '<span class="material-symbols-outlined">support_agent</span> <span onclick="showPanel(\\'consultorias\\')">Consultorias</span>');
html = html.replace('<span class="material-symbols-outlined">handshake</span> Parceiros', '<span class="material-symbols-outlined">handshake</span> <span onclick="showPanel(\\'parceiros\\')">Parceiros</span>');
html = html.replace('<span class="material-symbols-outlined">view_carousel</span> Banners', '<span class="material-symbols-outlined">view_carousel</span> <span onclick="showPanel(\\'banners\\')">Banners</span>');
html = html.replace('<span class="material-symbols-outlined">design_services</span> Serviços', '<span class="material-symbols-outlined">design_services</span> <span onclick="showPanel(\\'servicos\\')">Serviços</span>');
html = html.replace('<span class="material-symbols-outlined">mail</span> Newsletter', '<span class="material-symbols-outlined">mail</span> <span onclick="showPanel(\\'newsletter\\')">Newsletter</span>');

fs.writeFileSync(htmlPath, html);
console.log('Dashboard HTML updated com sucesso!');
