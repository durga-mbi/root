const fs = require('fs');
const path = require('path');

const rootPrisma = path.join(__dirname, '../prisma');
const services = ['user', 'admin'];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Handle .env (only if it doesn't exist)
const rootEnv = path.join(__dirname, '../.env');
const rootEnvExample = path.join(__dirname, '../env.example');
if (!fs.existsSync(rootEnv) && fs.existsSync(rootEnvExample)) {
  console.log('📝 Creating .env from env.example...');
  fs.copyFileSync(rootEnvExample, rootEnv);
}

// 2. Sync Prisma to services
services.forEach(service => {
  const servicePrisma = path.join(__dirname, `../${service}/prisma`);
  
  if (!fs.existsSync(servicePrisma)) {
    fs.mkdirSync(servicePrisma, { recursive: true });
  }

  // Copy schema
  console.log(`🔄 Syncing schema to ${service}...`);
  fs.copyFileSync(path.join(rootPrisma, 'schema.prisma'), path.join(servicePrisma, 'schema.prisma'));

  // Copy migrations
  const rootMigrations = path.join(rootPrisma, 'migrations');
  if (fs.existsSync(rootMigrations)) {
    console.log(`📂 Syncing migrations to ${service}...`);
    copyRecursiveSync(rootMigrations, path.join(servicePrisma, 'migrations'));
  }
  
  // Copy .env to service (legacy requirement)
  if (fs.existsSync(rootEnv)) {
    fs.copyFileSync(rootEnv, path.join(__dirname, `../${service}/.env`));
  }
});

console.log('✅ Prisma synchronization complete.');
