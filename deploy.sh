#!/bin/bash

# LeadiumX API Documentation - Quick Deploy Script

set -e

echo "🚀 LeadiumX API Documentation Deploy Script"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo ""

# Get deployment option
echo "Select deployment target:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Local EC2 (manual)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying to Vercel..."
        echo ""
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo ""
        echo "🔗 Connecting to GitHub and deploying..."
        vercel --prod
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Next steps:"
        echo "  1. Go to Vercel dashboard"
        echo "  2. Settings → Domains"
        echo "  3. Add custom domain: docs.leadiumx.com"
        echo "  4. In Cloudflare DNS, add:"
        echo "     CNAME docs → <vercel-domain>"
        ;;
        
    2)
        echo ""
        echo "📦 Deploying to Netlify..."
        echo ""
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "📥 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo ""
        echo "🔗 Deploying..."
        netlify deploy --prod
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Next steps:"
        echo "  1. Go to Netlify dashboard"
        echo "  2. Domain settings"
        echo "  3. Add custom domain: docs.leadiumx.com"
        ;;
        
    3)
        echo ""
        echo "📋 Manual EC2 Deployment"
        echo ""
        echo "Run these commands on your EC2 instance:"
        echo ""
        echo "ssh -i your-key.pem ubuntu@44.200.84.173"
        echo "cd /opt"
        echo "git clone https://github.com/admin-leadiumx/leadiumx-api-docs.git"
        echo "cd leadiumx-api-docs"
        echo "npm install"
        echo "npm start"
        echo ""
        echo "Then configure nginx and DNS manually."
        echo "See DEPLOYMENT.md for detailed instructions."
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "Documentation will be available at:"
echo "  https://docs.leadiumx.com"
echo ""
echo "Endpoints available at:"
echo "  https://docs.leadiumx.com/api/endpoints"
echo ""
