# Push to GitHub & Deploy to Vercel (Step-by-Step)

## ⏱️ Time: 5-10 minutes

---

## 📋 Prerequisites

✅ GitHub account with admin-leadiumx org access  
✅ Git installed locally  
✅ Vercel account (can be same as GitHub)  

---

## 🚀 Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (Fastest - 1 minute)

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# Authenticate
gh auth login

# Create repository
gh repo create admin-leadiumx/leadiumx-api-docs \
  --public \
  --source=/home/clawdbot/.openclaw/workspace/projects/leadiumx-api-docs \
  --push \
  --description="LeadiumX AI API Documentation - Voice, SMS, Email Outreach"

# Done! Repository created and code pushed ✅
```

### Option B: GitHub Web UI (Manual - 2 minutes)

1. Go to: https://github.com/admin-leadiumx
2. Click **"New"** → **"Repository"**
3. Fill in:
   - Name: `leadiumx-api-docs`
   - Description: `LeadiumX AI API Documentation`
   - Public: **✓ Yes**
   - Initialize with README: No
4. Click **"Create Repository"**

Then push locally:
```bash
cd /home/clawdbot/.openclaw/workspace/projects/leadiumx-api-docs
git init
git add .
git commit -m "Initial commit: LeadiumX API Documentation"
git branch -M main
git remote add origin https://github.com/admin-leadiumx/leadiumx-api-docs.git
git push -u origin main
```

---

## ✅ Verify GitHub Push

```bash
# Check remote
git remote -v
# Should show: origin  https://github.com/admin-leadiumx/leadiumx-api-docs.git

# Verify GitHub has code
curl https://api.github.com/repos/admin-leadiumx/leadiumx-api-docs | jq '.pushed_at'
```

**Visit:** https://github.com/admin-leadiumx/leadiumx-api-docs

Should see all files! ✅

---

## 🎯 Step 2: Deploy to Vercel

### Option A: Vercel Web UI (Recommended - 1 minute)

1. Go to: https://vercel.com/new
2. Click **"GitHub"**
3. Search for: `leadiumx-api-docs`
4. Click **"Import"**
5. Configure:
   - Framework: **"Other"**
   - Root Directory: **"./"**
   - Build Command: Leave blank (or `npm install`)
   - Output Directory: Leave blank
6. Click **"Deploy"** 🚀

Wait 1-2 minutes... **DONE!** 🎉

You'll get a URL like:
```
https://leadiumx-api-docs-abc123.vercel.app
```

### Option B: Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd /home/clawdbot/.openclaw/workspace/projects/leadiumx-api-docs

# Deploy
vercel --prod

# Follow prompts:
# ✓ Set up and deploy? Yes
# ✓ Which scope? (select your org)
# ✓ Link to existing project? No
# ✓ Project name? leadiumx-api-docs
# ✓ Output directory? (leave blank)

# Result: https://leadiumx-api-docs.vercel.app
```

---

## 🌐 Step 3: Add Custom Domain (2 minutes)

### In Vercel Dashboard

1. Go to: https://vercel.com/admin-leadiumx/leadiumx-api-docs
2. Click **"Settings"**
3. Click **"Domains"**
4. Click **"Add Domain"**
5. Enter: `docs.leadiumx.com`
6. Click **"Add"**
7. Select DNS provider: **"Cloudflare"**
8. Follow instructions

### In Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com → leadiumx.com
2. Click **"DNS"**
3. Click **"+ Add record"**
4. Fill in:
   - Type: **CNAME**
   - Name: **docs**
   - Content: **cname.vercel-dns.com** *(from Vercel)*
   - TTL: **Auto**
   - Proxy: **Proxied** (orange cloud)
5. Click **"Save"**

Wait 5-10 minutes for DNS propagation.

**Test:**
```bash
curl https://docs.leadiumx.com
# Should work!
```

---

## ✨ Step 4: Verify Everything Works

```bash
# Check health endpoint
curl https://docs.leadiumx.com/api/v1/health

# Check endpoints list
curl https://docs.leadiumx.com/api/v1/endpoints

# Visit documentation
open https://docs.leadiumx.com

# Or on Linux
xdg-open https://docs.leadiumx.com
```

---

## 📊 What You Should See

✅ Documentation homepage at https://docs.leadiumx.com  
✅ Dark mode toggle button (top right)  
✅ 4 API endpoints documented  
✅ Copy-to-clipboard code examples  
✅ Professional styling  

---

## 🔄 Automatic Deployments

Now whenever you push to GitHub:

```bash
git add .
git commit -m "Update API docs"
git push origin main

# Vercel automatically:
# ✓ Sees the push
# ✓ Builds the project
# ✓ Deploys to production
# ✓ Updates https://docs.leadiumx.com
```

No manual deployments needed! 🎉

---

## 🐛 Troubleshooting

### GitHub push failed?
```bash
# Make sure remote is set
git remote remove origin
git remote add origin https://github.com/admin-leadiumx/leadiumx-api-docs.git

# Try again
git push -u origin main
```

### Vercel deployment failed?
1. Check logs in Vercel dashboard
2. Common issues:
   - Missing `package.json` ❌
   - Wrong build command ❌
   - Node version mismatch ❌

### Custom domain not working?
1. DNS can take 5-10 minutes
2. Run: `nslookup docs.leadiumx.com`
3. Should point to Vercel nameservers

### API endpoints not responding?
```bash
curl https://docs.leadiumx.com/api/v1/health
# Should return JSON health check
```

---

## ✅ Final Checklist

- [ ] Created GitHub repository
- [ ] Pushed code to main branch
- [ ] Deployed to Vercel
- [ ] Added custom domain
- [ ] DNS records updated in Cloudflare
- [ ] Documentation accessible at docs.leadiumx.com
- [ ] Dark mode working
- [ ] API endpoints responding
- [ ] Ready for production! 🚀

---

## 📞 Support

If anything fails:
1. Check the GITHUB_SETUP.md for detailed info
2. Check Vercel deployment logs
3. Check Cloudflare DNS propagation
4. Try again in 5 minutes

---

**Time elapsed:** 5-10 minutes  
**Status:** Production Ready ✅  
**Next:** Update API backend to use REST endpoints!
