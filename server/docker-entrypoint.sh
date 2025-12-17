#!/bin/sh
set -e

echo "🔄 Running database migrations..."
cd /app/database

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set!"
  exit 1
fi

echo "✅ DATABASE_URL is set (length: ${#DATABASE_URL} chars)"

# Create .env file with DATABASE_URL
echo "DATABASE_URL=${DATABASE_URL}" > .env

echo "Contents of .env:"
cat .env | sed 's/postgresql:\/\/[^@]*@/postgresql:\/\/***:***@/'

echo "Running migration..."
pnpm exec prisma migrate deploy --schema=prisma/schema.prisma

echo "🚀 Starting server..."
cd /app/server
node dist/index.js

