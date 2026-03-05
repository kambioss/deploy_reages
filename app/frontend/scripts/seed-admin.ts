/**
 * Script pour créer l'administrateur par défaut
 * Exécuter : npx tsx scripts/seed-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Initialisation de la base de données...\n');

  const count = await db.user.count();
  
  if (count > 0) {
    console.log(`ℹ️  La base contient déjà ${count} utilisateur(s).\n`);
    const admin = await db.user.findFirst({ where: { role: 'admin' } });
    if (admin) {
      console.log(`✅ Admin existant: ${admin.email}`);
    } else {
      const first = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
      if (first) {
        await db.user.update({ where: { id: first.id }, data: { role: 'admin' } });
        console.log(`✅ Premier utilisateur promu admin: ${first.email}`);
      }
    }
    return;
  }

  const email    = process.env.ADMIN_EMAIL    || 'admin@reaages.org';
  const password = process.env.ADMIN_PASSWORD || 'Admin@2024!';

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await db.user.create({
    data: {
      nom: 'Admin',
      prenom: 'Super',
      email,
      password: hashedPassword,
      pays: 'International',
      fonction: 'Administrateur',
      secteurActivite: 'Administration',
      role: 'admin',
      isActive: true,
    }
  });

  console.log('✅ Administrateur créé avec succès !\n');
  console.log('━'.repeat(40));
  console.log(`  Email    : ${email}`);
  console.log(`  Password : ${password}`);
  console.log('━'.repeat(40));
  console.log('\n⚠️  Changez ce mot de passe après la première connexion !\n');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
