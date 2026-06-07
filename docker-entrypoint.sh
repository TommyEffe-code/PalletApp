#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

# Seed only if the database is empty (no departments exist)
DEPT_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.department.count().then(n => { console.log(n); p.\$disconnect(); });
")

if [ "$DEPT_COUNT" = "0" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

echo "Starting server..."
exec node server.js
