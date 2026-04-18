#!/bin/bash

# LeadiumX API Documentation - Quick Setup Commands
# Run these commands to push to GitHub and deploy to Vercel

set -e

echo "=========================================="
echo "🚀 LeadiumX API Docs - GitHub + Vercel Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Initialize Git Repository${NC}"
echo ""

if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: LeadiumX API Documentation"
    echo -e "${GREEN}✓ Git initialized${NC}"
else
    echo -e "${GREEN}✓ Git already initialized${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Add GitHub Remote${NC}"
echo ""

read -p "Enter GitHub username or org (admin-leadiumx): " github_org
github_org=${github_org:-admin-leadiumx}

read -p "Enter GitHub token (for authentication): " github_token

# Set git credentials
git config credential.helper store

# Add remote
git remote remove origin 2>/dev/null || true
git remote add origin https://${github_token}@github.com/${github_org}/leadiumx-api-docs.git

echo -e "${GREEN}✓ GitHub remote added${NC}"

echo ""
echo -e "${BLUE}Step 3: Push to GitHub${NC}"
echo ""

git branch -M main
git push -u origin main --force

echo -e "${GREEN}✓ Code pushed to GitHub!${NC}"
echo "Repository: https://github.com/${github_org}/leadiumx-api-docs"

echo ""
echo -e "${BLUE}Step 4: Deploy to Vercel${NC}"
echo ""

read -p "Install Vercel CLI? (y/n): " install_vercel

if [ "$install_vercel" = "y" ]; then
    npm install -g vercel
fi

echo ""
echo "Run this command to deploy:"
echo ""
echo -e "${YELLOW}vercel --prod${NC}"
echo ""
echo "Or use Vercel Web UI:"
echo "1. Go to https://vercel.com"
echo "2. Click 'Import Project'"
echo "3. Select GitHub → ${github_org}/leadiumx-api-docs"
echo "4. Click Import and Deploy"
echo ""

echo -e "${BLUE}Step 5: Configure Custom Domain${NC}"
echo ""
echo "In Vercel Dashboard:"
echo "1. Settings → Domains"
echo "2. Add: docs.leadiumx.com"
echo ""
echo "In Cloudflare DNS:"
echo "1. Add CNAME record:"
echo "   Name: docs"
echo "   Content: cname.vercel-dns.com"
echo ""

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify code at: https://github.com/${github_org}/leadiumx-api-docs"
echo "2. Deploy with: vercel --prod"
echo "3. Access docs at: https://docs.leadiumx.com"
echo ""
