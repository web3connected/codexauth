#!/bin/bash

# Setup GitHub Secrets for CodexAuth Deployment
# This script helps you configure the required secrets

echo "🔐 CodexAuth GitHub Secrets Setup"
echo "================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "🔐 Please login to GitHub CLI first:"
    gh auth login
fi

echo "📋 Setting up secrets for CodexAuth deployment..."

# Set deployment host
echo "🌐 Setting DEPLOY_HOST..."
gh secret set DEPLOY_HOST --body "45.79.180.207"

# Set deployment user
echo "👤 Setting DEPLOY_USER..."
gh secret set DEPLOY_USER --body "forge"

# Set SSH private key
echo "🔑 Setting DEPLOY_PRIVATE_KEY..."
echo "Please paste your SSH private key (press Ctrl+D when done):"
gh secret set DEPLOY_PRIVATE_KEY

echo ""
echo "✅ GitHub secrets configured successfully!"
echo ""
echo "📋 Configured secrets:"
echo "  - DEPLOY_HOST: 45.79.180.207"
echo "  - DEPLOY_USER: forge"  
echo "  - DEPLOY_PRIVATE_KEY: [SSH key configured]"
echo ""
echo "🚀 Your repository is now ready for automatic deployment!"
echo "   Push to main branch to trigger deployment to codexauth.io"