/**
 * Script d'initialisation de la base de données
 * Crée les tables et l'administrateur par défaut
 * 
 * Usage: node scripts/init-db.mjs
 */

import { execSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

console.log('\n🚀 Initialisation de REAAGESS\n');
console.log('━'.repeat(50));

// 1. Prisma generate + db push
try {
  console.log('\n📦 Génération du client Prisma...');
  execSync('npx prisma generate', { cwd: root, stdio: 'inherit' });
  
  console.log('\n🗄️  Création/mise à jour de la base de données...');
  execSync('npx prisma db push', { cwd: root, stdio: 'inherit' });
  
  console.log('\n✅ Base de données prête');
} catch (e) {
  console.error('❌ Erreur Prisma:', e.message);
  process.exit(1);
}

// 2. Seed admin
try {
  console.log('\n👤 Création de l\'administrateur...');
  execSync('npx tsx scripts/seed-admin.ts', { cwd: root, stdio: 'inherit' });
} catch (e) {
  // tsx peut ne pas être disponible, essayons ts-node
  try {
    execSync('npx ts-node scripts/seed-admin.ts', { cwd: root, stdio: 'inherit' });
  } catch {
    console.warn('⚠️  Impossible d\'exécuter le seed via tsx/ts-node');
    console.log('   Accédez à http://localhost:3000/api/seed pour créer l\'admin');
  }
}

console.log('\n━'.repeat(50));
console.log('\n✨ Initialisation terminée !');
console.log('\n   Lancez le serveur avec : npm run dev');
console.log('   Puis accédez à        : http://localhost:3000\n');
