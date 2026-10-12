import { prisma } from './src/infrastructure/database/prisma/prisma.client.js';

async function main() {
  await prisma.parceiroInstitucional.updateMany({ where: { nome: 'UNIVERSIDADE DO NAMIBE' }, data: { imagemUrl: '/assets/images/parceiros/uninamib.webp' } });
  await prisma.parceiroInstitucional.updateMany({ where: { nome: 'FACULDADE DE CIÊNCIAS NATURAIS' }, data: { imagemUrl: '/assets/images/parceiros/funi.jpg' } });
  await prisma.parceiroInstitucional.updateMany({ where: { nome: 'TRANSHIP BRASIL' }, data: { imagemUrl: '/assets/images/parceiros/ts.jpg' } });
  await prisma.parceiroInstitucional.updateMany({ where: { nome: 'FACULDADE DE PESCAS' }, data: { imagemUrl: '/assets/images/parceiros/fp.jpg' } });
  await prisma.parceiroInstitucional.updateMany({ where: { nome: 'CEFOPESCAS' }, data: { imagemUrl: '/assets/images/parceiros/cf.jpg' } });
  console.log('Parceiros atualizados com imagens locais!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
