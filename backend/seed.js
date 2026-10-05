import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const emailAdmin = 'admin@bluehorizon.com';
  const senhaAdmin = 'admin123';

  console.log(`Gerando hash para a senha: ${senhaAdmin}...`);
  const senhaHash = await bcrypt.hash(senhaAdmin, 8);

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: {},
    create: {
      nome: 'Administrador Master',
      email: emailAdmin,
      senha: senhaHash,
      perfil: 'SUPER_ADMIN',
    },
  });

  console.log('--- ✅ Conta de Acesso Criada com Sucesso! ---');
  console.log(`Email: ${admin.email}`);
  console.log(`Senha: ${senhaAdmin}`);
  console.log('----------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
