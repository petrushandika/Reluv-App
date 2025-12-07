#!/bin/bash
set -e

echo "🔧 Starting Vercel deployment process..."

echo "📦 Installing dependencies..."
npm install

echo "🔨 Generating Prisma Client..."
npx prisma generate

echo "🔄 Resetting database (WARNING: This will delete all data)..."
npx prisma migrate reset --force

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database (if needed)..."
if [ "$RUN_SEED" = "true" ]; then
  echo "Running seed script..."
  npm run db:seed || echo "Seed skipped or failed"
else
  echo "Seed skipped (set RUN_SEED=true to enable)"
fi

echo "🏗️ Building application..."
npm run build

echo "✅ Deployment build completed successfully!"

