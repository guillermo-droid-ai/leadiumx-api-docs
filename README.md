# LeadiumX AI API Documentation

Beautiful, interactive API documentation for the LeadiumX AI outreach platform.

## 🎯 What's Included

### API Endpoints Documented
1. **GET /health** - Health check
2. **POST /make-outbound-voice-call** - Voice calls via Retell AI
3. **POST /send-initial-sms** - SMS messaging
4. **POST /send-initial-email** - Email campaigns

### Features
- 🌙 Dark/Light mode toggle
- 📋 Complete endpoint documentation
- 💻 Copy-to-clipboard code examples
- 📱 Mobile responsive design
- 🎨 Professional styling
- ⚡ Interactive UI with smooth animations

---

## 📂 File Structure

```
leadiumx-api-docs/
├── index.html           # Main documentation page (30KB)
├── server.js           # Express server
├── package.json        # Dependencies
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # This file
```

---

## 🚀 Quick Start (Local)

```bash
# Install dependencies
npm install

# Run server
npm start

# Visit: http://localhost:3001
```

---

## 📦 Deploy to Production

### Fastest: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Follow prompts
# - Connect to GitHub
# - Set domain: docs.leadiumx.com
```

**Advantages:**
- ✅ Zero-config deployment
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Free tier available

### Alternative: Your EC2 Instance

```bash
# 1. SSH to instance
ssh -i key.pem ubuntu@44.200.84.173

# 2. Clone or upload files
git clone <repo-url> /opt/leadiumx-api-docs
cd /opt/leadiumx-api-docs

# 3. Install & run
npm install
npm start

# 4. Set up nginx reverse proxy to port 3001
# 5. Configure DNS: docs.leadiumx.com → IP
```

---

## 🌐 DNS Configuration

In Cloudflare (or your DNS provider):

```
Type:  CNAME
Name:  docs
Value: leadiumx-api-docs.vercel.app  (or your domain)
TTL:   Auto
Proxy: Proxied (orange cloud)
```

This makes the documentation available at: **docs.leadiumx.com**

---

## 📝 Customization

### Update Endpoints
Edit `index.html`:
1. Update endpoint grid (around line 206)
2. Add new details section
3. Update tables with parameters
4. Add request/response examples

### Change Colors
Edit CSS variables in `index.html` (lines 15-31):
```css
:root {
    --primary: #7c3aed;      /* Purple */
    --secondary: #ec4899;    /* Pink */
    --success: #10b981;      /* Green */
    /* ... more colors ... */
}
```

### Add New Endpoint
```html
<div class="endpoint-card">
    <span class="method-badge method-post">POST</span>
    <div class="endpoint-name">/new-endpoint</div>
    <div class="endpoint-description">Description here</div>
    <a href="#new-endpoint-details">View Details →</a>
</div>
```

Then add corresponding details section below.

---

## 🔗 API Backend Integration

This documentation is for:
- **API Backend:** http://44.200.84.173:3000
- **From Number:** +17122183438 (configured in Retell)
- **Database:** Supabase (inxwustdvklxopwqhqkk.supabase.co)

### Required Backend Configuration
```env
RETELL_API_KEY=key_c771f32eccd1db82b497f9127c09
SUPABASE_SERVICE_KEY=<service_role_key>
DEFAULT_FROM_NUMBER=+17122183438
```

---

## 📊 Available Agents

| Agent | ID | Type |
|-------|----|----|
| GreenlightOffer - New Leads | agent_67147b301907688dfbb1404888 | Outbound |
| MansorCustoms - New Leads | agent_5ccbbaaa5239f5d6934a054f85 | Outbound |
| PersistenOffer - Olivia | agent_34832d3b1e73e105111158e1d0 | Outbound |

---

## ✅ Testing the Documentation

### Local Test
```bash
npm start
curl http://localhost:3001
```

### After Deployment
```bash
curl https://docs.leadiumx.com
curl https://docs.leadiumx.com/api/endpoints
```

---

## 🔐 Security Notes

- Documentation is public (no authentication required)
- API keys are **not** shown in examples
- Actual API key management in separate system
- HTTPS required for production

---

## 📈 Analytics (Optional)

Add Google Analytics to track documentation usage:

```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -i :3001  # Find process
kill -9 <PID>  # Kill it
npm start      # Restart
```

### CSS/Images Not Loading
- Check file paths in `index.html`
- Ensure static files are in same directory
- Clear browser cache (Ctrl+Shift+Delete)

### Dark Mode Not Working
- Check localStorage in browser console
- Clear localStorage: `localStorage.clear()`

---

## 📚 Documentation Standards

All endpoints should include:
- [ ] Method (GET, POST, etc.)
- [ ] Path and parameters
- [ ] Required vs optional fields
- [ ] Request example (curl)
- [ ] Response example (JSON)
- [ ] Error examples
- [ ] Rate limit info

---

## 🔄 Version History

### v1.0.0 (April 18, 2026)
- ✅ Initial release
- ✅ 4 endpoints documented
- ✅ Dark mode
- ✅ Responsive design
- ✅ Copy code examples

---

## 📞 Support

For API support: support@leadiumx.com
For documentation updates: dev@leadiumx.com

---

**Created**: April 18, 2026
**Status**: Production Ready
**License**: MIT
