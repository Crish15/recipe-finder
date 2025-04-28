#!/bin/sh
set -e

if [ -f /src/schema.sql ]; then
  echo "Inizializzo il database PostgreSQL..."
  psql -U postgres -d recipe_db -f /src/schema.sql
else
  echo "File schema.sql non trovato!"
  exit 1
fi
