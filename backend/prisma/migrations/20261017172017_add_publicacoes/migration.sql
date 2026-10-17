-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('USUARIO', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'USUARIO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "mudancas" JSONB,
    "realizadoPor" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes_cursos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "curso" TEXT NOT NULL,
    "mensagem" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscricoes_cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes_consultoria" (
    "id" SERIAL NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "nomeContato" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "necessidade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitacoes_consultoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_parceiros" (
    "id" SERIAL NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "proposta" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ANALISE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_parceiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oportunidades" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oportunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tituloDestaque" TEXT,
    "descricao" TEXT,
    "imagemUrl" TEXT NOT NULL,
    "linkDestino" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "area" TEXT DEFAULT 'Outras Áreas',
    "descricao" TEXT NOT NULL,
    "iconeUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cargaHoraria" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "certificadora" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parceiros_institucionais" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'Universidades & Academia',
    "tags" TEXT,
    "descricao" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parceiros_institucionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicacoes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagemCapaUrl" TEXT,
    "categoria" TEXT NOT NULL,
    "autor" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "publicadoEm" TIMESTAMP(3),
    "agendadoPara" TIMESTAMP(3),
    "seoTitulo" TEXT,
    "seoDescricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_publicacoes" (
    "id" SERIAL NOT NULL,
    "publicacaoId" INTEGER NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visualizacoes_publicacoes" (
    "id" SERIAL NOT NULL,
    "publicacaoId" INTEGER NOT NULL,
    "visitanteHash" TEXT NOT NULL,
    "origem" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visualizacoes_publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloads_publicacoes" (
    "id" SERIAL NOT NULL,
    "publicacaoId" INTEGER NOT NULL,
    "documentoId" INTEGER NOT NULL,
    "visitanteHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_email_key" ON "newsletters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "publicacoes_slug_key" ON "publicacoes"("slug");

-- CreateIndex
CREATE INDEX "publicacoes_status_publicadoEm_idx" ON "publicacoes"("status", "publicadoEm");

-- CreateIndex
CREATE INDEX "publicacoes_categoria_idx" ON "publicacoes"("categoria");

-- CreateIndex
CREATE INDEX "documentos_publicacoes_publicacaoId_idx" ON "documentos_publicacoes"("publicacaoId");

-- CreateIndex
CREATE INDEX "visualizacoes_publicacoes_publicacaoId_criadoEm_idx" ON "visualizacoes_publicacoes"("publicacaoId", "criadoEm");

-- CreateIndex
CREATE INDEX "visualizacoes_publicacoes_visitanteHash_criadoEm_idx" ON "visualizacoes_publicacoes"("visitanteHash", "criadoEm");

-- CreateIndex
CREATE INDEX "downloads_publicacoes_publicacaoId_criadoEm_idx" ON "downloads_publicacoes"("publicacaoId", "criadoEm");

-- CreateIndex
CREATE INDEX "downloads_publicacoes_documentoId_idx" ON "downloads_publicacoes"("documentoId");

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_realizadoPor_fkey" FOREIGN KEY ("realizadoPor") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_publicacoes" ADD CONSTRAINT "documentos_publicacoes_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "publicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacoes_publicacoes" ADD CONSTRAINT "visualizacoes_publicacoes_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "publicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads_publicacoes" ADD CONSTRAINT "downloads_publicacoes_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "publicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads_publicacoes" ADD CONSTRAINT "downloads_publicacoes_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "documentos_publicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
