#!/bin/bash

# CodexAuth Database Setup Script
# Creates the prelaunch_signups table

echo "🔧 Setting up CodexAuth pre-launch database table..."
echo ""

# Database connection details (from .env)
DB_HOST="${DB_HOST:-172.104.24.82}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_DATABASE:-codex_main}"
DB_USER="${DB_USERNAME:-codex_admin}"

echo "📊 Database: $DB_NAME"
echo "🌐 Host: $DB_HOST:$DB_PORT"
echo "👤 User: $DB_USER"
echo ""

# Execute the SQL schema
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/../lib/db-schema.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database table created successfully!"
    echo ""
    echo "📋 You can now:"
    echo "  • Test the API: curl -X POST http://localhost:3003/api/prelaunch-signup -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\"}'"
    echo "  • View stats: curl http://localhost:3003/api/prelaunch-signup"
    echo "  • Check signups: psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c 'SELECT * FROM prelaunch_signups;'"
else
    echo ""
    echo "❌ Failed to create table. Check your database connection."
    exit 1
fi
