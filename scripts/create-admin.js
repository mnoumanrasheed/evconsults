/**
 * scripts/create-admin.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates (or updates) the admin user in the database.
 *
 * Usage:
 *   node scripts/create-admin.js
 *
 * Credentials are read from .env.local:
 *   ADMIN_EMAIL    — e.g. admin@evconsults.com
 *   ADMIN_PASSWORD — strong password (min 8 chars)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require('path');
const fs   = require('fs');

// Manual .env.local loader (no external dependency needed)
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val   = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    console.error('❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  if (plainPassword.length < 8) {
    console.error('❌  ADMIN_PASSWORD must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`\n🔐  Creating / updating admin user: ${email}`);

  const hashed = await bcrypt.hash(plainPassword, 12); // cost=12 (strong)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashed,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✅  Admin user ready  →  id: ${user.id}  |  email: ${user.email}`);
  console.log('    You can now sign in at /admin/login\n');
}

main()
  .catch((err) => {
    console.error('❌  Unexpected error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
