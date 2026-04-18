# LeadiumX API Documentation - Deployment Guide

## Quick Start

### Local Testing
```bash
# Install dependencies
npm install express

# Run server
node server.js

# Visit: http://localhost:3001
```

---

## Deploy to Production

### Option 1: Vercel (Recommended for Frontend)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Follow prompts to connect to GitHub repo

# 4. Set custom domain
# In Vercel dashboard: Settings → Domains → Add "docs.leadiumx.com"
```

### Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Set custom domain in Netlify dashboard
```

### Option 3: AWS S3 + CloudFront

```bash
# 1. Create S3 bucket
aws s3 mb s3://leadiumx-api-docs

# 2. Upload files
aws s3 sync . s3://leadiumx-api-docs --delete

# 3. Configure as static website
aws s3 website s3://leadiumx-api-docs \
  --index-document index.html \
  --error-document index.html

# 4. Create CloudFront distribution
# Point to S3 bucket
# Set custom domain (docs.leadiumx.com)
```

### Option 4: Your Own EC2 Instance

```bash
# 1. SSH into instance
ssh -i key.pem ubuntu@your-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Clone/upload files
git clone <repo-url> /opt/leadiumx-api-docs
cd /opt/leadiumx-api-docs

# 4. Install dependencies
npm install

# 5. Create systemd service
sudo tee /etc/systemd/system/leadiumx-docs.service > /dev/null << EOF
[Unit]
Description=LeadiumX API Documentation
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/leadiumx-api-docs
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
Environment="PORT=3001"
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable leadiumx-docs
sudo systemctl start leadiumx-docs

# 7. Set up nginx reverse proxy (optional)
sudo tee /etc/nginx/sites-available/docs.leadiumx.com > /dev/null << EOF
server {
    listen 80;
    server_name docs.leadiumx.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 8. Enable site and test
sudo ln -s /etc/nginx/sites-available/docs.leadiumx.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Domain Setup

### Add Custom Domain to Cloudflare

```bash
# 1. In Cloudflare dashboard:
# Add DNS record:
# Type: CNAME
# Name: docs
# Content: <your-deployment-domain>
# TTL: Auto
# Proxy: Proxied (orange cloud)

# Example:
# docs.leadiumx.com → leadiumx-api-docs.vercel.app
# OR
# docs.leadiumx.com → d12345.cloudfront.net
```

---

## SSL/HTTPS Setup

### Vercel/Netlify
Automatic SSL certificate provisioning with custom domain

### EC2 + nginx
```bash
# Install Let's Encrypt certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d docs.leadiumx.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Monitoring

### Check Documentation Service Status
```bash
# EC2
systemctl status leadiumx-docs
journalctl -u leadiumx-docs -f

# Remote uptime check
curl https://docs.leadiumx.com/health || echo "OFFLINE"
```

---

## Customization

### Change Branding
Edit `index.html`:
- Line 148: Header text
- CSS variables (lines 15-31): Colors, fonts

### Add More Endpoints
1. Update endpoint grid (line 206)
2. Create new details section
3. Add to error handling table

### Dark Mode
Already included! Toggle with 🌙 button

---

## Performance Optimization

### Enable Caching
```nginx
# In nginx config
add_header Cache-Control "public, max-age=3600";
```

### Minify CSS/JS
```bash
npm install -g minify
minify index.html > index.min.html
```

### CDN Distribution
- Vercel: Automatic global CDN
- Netlify: Automatic global CDN
- CloudFront: Configure origin + distributions

---

## Backup & Versioning

```bash
# Keep git history
git init
git add .
git commit -m "Initial API docs"
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

---

## Support & Updates

When API endpoints change:
1. Update endpoint table (line 262)
2. Update request/response examples
3. Test all examples
4. Deploy to production
5. Update endpoint grid (line 206)

---

**Last Updated**: April 18, 2026
**Current Version**: 1.0.0
