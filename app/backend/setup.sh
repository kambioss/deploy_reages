#!/bin/bash

# REAAGES Backend Setup Script

echo "🚀 Setting up REAAGES Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ PostgreSQL found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p logs

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration:"
    echo "   - Database credentials"
    echo "   - Keycloak configuration"
    echo "   - JWT secret"
    echo ""
    echo "⚠️  Don't forget to change the default secrets!"
fi

# Check if database exists
echo "🗄️  Checking database..."
if psql -lqt | cut -d \| -f 1 | grep -qw reaages; then
    echo "✅ Database 'reaages' exists"
else
    echo "❌ Database 'reaages' not found"
    echo "Please create the database first:"
    echo "  createdb reaages"
    echo "Then run: npm run migrate"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file"
echo "2. Make sure Keycloak is running and configured"
echo "3. Run database migrations: npm run migrate"
echo "4. Start the server: npm run dev"
echo ""
echo "📚 For more information, see README.md"