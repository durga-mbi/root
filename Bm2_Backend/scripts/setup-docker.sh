#!/bin/bash

# setup-docker.sh - Automate Bm2_Backend setup and start

echo "🚀 Starting Bm2_Backend Setup..."

# Check for .env file
if [ ! -f .env ]; then
    echo "📄 .env file not found, creating from env.example..."
    cp env.example .env
    # Optionally generate a random secret if needed, but we'll stick to example for now
    echo "✅ Created .env from env.example"
else
    echo "ℹ️  .env file already exists."
fi

# Stop existing containers if any
echo "🧹 Cleaning up existing containers..."
docker compose down --remove-orphans

# Build and start services
echo "🛠️  Building and starting services..."
docker compose up -d --build

echo "-------------------------------------------------------"
echo "✅ Bm2_Backend successfully started!"
echo "🌍 API: http://localhost:3003"
echo "🗄️  PHPMyAdmin: http://localhost:8082"
echo "💡 Use 'npm run docker:logs' to view logs."
echo "-------------------------------------------------------"

# Display container status
docker compose ps
