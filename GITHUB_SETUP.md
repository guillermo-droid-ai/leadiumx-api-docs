# GitHub Setup for LeadiumX API Documentation

## 🚀 Quick Start (5 minutes)

### Step 1: Create GitHub Repository

```bash
# Option A: Using GitHub CLI (easiest)
gh auth login  # Authenticate if needed
gh repo create admin-leadiumx/leadiumx-api-docs \
  --public \
  --source=. \
  --push \
  --description="LeadiumX AI API Documentation - Voice, SMS, Email"

# Option B: Manual GitHub Web UI
# 1. Go to https://github.com/admin-leadiumx
# 2. Click "New Repository"
# 3. Name: leadiumx-api-docs
# 4. Description: LeadiumX AI API Documentation
# 5. Public: Yes
# 6. Add .gitignore: Node
# 7. Click "Create Repository"
```

---

### Step 2: Initialize Git Locally

```bash
cd /path/to/leadiumx-api-docs

# If not already a git repo
git init
git add .
git commit -m "Initial commit: API documentation with Vercel config"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/admin-leadiumx/leadiumx-api-docs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Authenticate
vercel login

# 3. Deploy
vercel --prod

# 4. Follow prompts:
#    - Which scope? (select admin-leadiumx or your org)
#    - Link to existing project? No
#    - Project name? leadiumx-api-docs
#    - Output directory? .

# 5. Result:
#    ✓ Production: https://leadiumx-api-docs.vercel.app
```

#### Option B: Vercel Web UI (Easiest)

```
1. Go to https://vercel.com
2. Click "Import Project"
3. Select "GitHub" 
4. Search for: admin-leadiumx/leadiumx-api-docs
5. Click "Import"
6. Configure:
   - Framework: Other (static)
   - Root Directory: ./
   - Build Command: npm install
   - Output Directory: .
7. Click "Deploy"
```

---

### Step 4: Configure Custom Domain

In **Vercel Dashboard**:
1. Select project: leadiumx-api-docs
2. Go to "Settings" → "Domains"
3. Click "Add Domain"
4. Enter: `docs.leadiumx.com`
5. Select DNS provider: Cloudflare
6. Follow instructions

In **Cloudflare Dashboard**:
1. Go to DNS settings for leadiumx.com
2. Add new CNAME record:
   - **Name:** docs
   - **Content:** cname.vercel-dns.com
   - **TTL:** Auto
   - **Proxy:** Proxied (orange cloud)

Wait 5-10 minutes for DNS propagation.

**Test:**
```bash
curl https://docs.leadiumx.com
```

---

## 📊 Repository Structure

```
leadiumx-api-docs/
├── index.html              # Main documentation page
├── server.js              # Express server
├── package.json           # Node dependencies
├── package-lock.json      # Dependency lock
├── vercel.json           # Vercel config (auto-deploy)
├── .gitignore            # Git ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml    # Optional: Auto-deploy on push
├── README.md             # Project overview
├── DEPLOYMENT.md         # Deployment guide
├── GITHUB_SETUP.md       # This file
└── public/               # Static assets (optional)
```

---

## 🔄 Automatic Deployments with Vercel

Once connected to GitHub, Vercel **automatically redeploys** when you push to main:

```bash
# Make changes
git add .
git commit -m "Update API documentation"
git push origin main

# Vercel automatically:
# ✓ Builds the project
# ✓ Runs tests (if configured)
# ✓ Deploys to production
# ✓ Keeps previous versions for rollback
```

Check deployment status: https://vercel.com/admin-leadiumx/leadiumx-api-docs

---

## 🚀 GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

Setup secrets in GitHub:
1. Settings → Secrets and variables → Actions
2. Add:
   - VERCEL_TOKEN (from https://vercel.com/account/tokens)
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID

---

## 📝 Making Changes

### Update Endpoints

1. Edit `server.js` - Update endpoints
2. Edit `index.html` - Update documentation
3. Test locally:
   ```bash
   npm start
   # Visit http://localhost:3001
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Add new endpoint: /v1/webhooks"
   git push origin main
   ```

5. Vercel auto-deploys! ✅

---

## 🔐 Security Best Practices

### Never Commit Secrets
```bash
# Bad ❌
git add .env
git commit -m "Add API keys"

# Good ✅
echo ".env" >> .gitignore
git add .gitignore
# Use Vercel environment variables instead
```

### Set Environment Variables in Vercel

1. Vercel Dashboard → Project Settings
2. Environment Variables
3. Add variables (these are NOT in code):
   ```
   NODE_ENV=production
   API_URL=https://api.leadiumx.com
   ```

### GitHub Secrets (if using Actions)

1. GitHub → Settings → Secrets
2. Add sensitive values
3. Reference in workflows: `${{ secrets.VAR_NAME }}`

---

## 🐛 Troubleshooting

### Vercel Build Fails

Check logs:
```bash
vercel logs --follow
```

Common issues:
- Missing `package.json` ❌
- Node version mismatch ❌
- Environment variables not set ❌

### Changes Not Deployed

```bash
# Force redeploy
git commit --allow-empty -m "Force rebuild"
git push origin main

# Or manually in Vercel UI:
# → Deployments → Redeploy
```

### Custom Domain Not Working

1. Check Cloudflare DNS pointing to Vercel
2. Check Vercel domain settings
3. Wait 24 hours for full DNS propagation
4. Test: `nslookup docs.leadiumx.com`

---

## 📚 Useful Links

- **GitHub:** https://github.com/admin-leadiumx/leadiumx-api-docs
- **Vercel:** https://vercel.com/admin-leadiumx/leadiumx-api-docs
- **Documentation:** https://docs.leadiumx.com
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Docs:** https://docs.github.com

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to main branch
- [ ] Vercel project created
- [ ] Custom domain configured
- [ ] DNS records added to Cloudflare
- [ ] Documentation accessible at https://docs.leadiumx.com
- [ ] Environment variables set in Vercel
- [ ] GitHub Actions workflow configured (optional)
- [ ] Automatic deployments working
- [ ] Team has access

---

**Last Updated:** April 18, 2026
**Status:** Production Ready ✅
