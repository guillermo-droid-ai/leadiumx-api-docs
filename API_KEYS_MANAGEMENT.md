# LeadiumX API Key Management

## 🎯 Sub-Account Key Generation System

Each sub-account (Greenlight Offer, Mansor Customs, Persistent Offer, etc.) needs its own API key.

---

## 📊 Current Sub-Accounts

| Sub-Account | Company ID | Status | API Key |
|------------|-----------|--------|---------|
| Greenlight Offer | 1 | ✅ Active | `sk_leadiumx_greenlight_xxx` |
| Mansor Customs | 2 | ✅ Active | `sk_leadiumx_mansor_xxx` |
| Persistent Offer | 3 | ✅ Active | `sk_leadiumx_persistent_xxx` |
| Collective Solar | 4 | ✅ Active | `sk_leadiumx_collective_xxx` |
| Trinity Offers | 5 | ✅ Active | `sk_leadiumx_trinity_xxx` |

---

## 🚀 Generate API Key for Sub-Account

### Step 1: Create Key in Database

```sql
INSERT INTO api_keys (
  sub_account_id,
  key_hash,
  key_name,
  created_at,
  expires_at,
  rate_limit_per_day,
  is_active
) VALUES (
  'greenlight_offer',
  SHA256('sk_leadiumx_greenlight_abc123xyz'),
  'Greenlight Offer - Main Key',
  NOW(),
  NOW() + INTERVAL '1 year',
  1000,  -- 1000 calls/day
  true
);
```

### Step 2: Return Key to Sub-Account

```json
{
  "key": "sk_leadiumx_greenlight_abc123xyz",
  "sub_account": "Greenlight Offer",
  "created_at": "2026-04-18T18:23:00Z",
  "expires_at": "2027-04-18T18:23:00Z",
  "rate_limit_per_day": 1000,
  "endpoints": [
    "POST /v1/calls",
    "POST /v1/messages/sms",
    "POST /v1/messages/email"
  ]
}
```

---

## 🔐 How to Use API Key

### In cURL

```bash
curl -X POST https://api.leadiumx.com/v1/calls \
  -H "Authorization: Bearer sk_leadiumx_greenlight_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_67147b301907688dfbb1404888",
    "from_number": "+17122183438",
    "to_number": "+18055551234"
  }'
```

### In JavaScript

```javascript
const response = await fetch('https://api.leadiumx.com/v1/calls', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_leadiumx_greenlight_abc123xyz',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent_id: 'agent_67147b301907688dfbb1404888',
    from_number: '+17122183438',
    to_number: '+18055551234'
  })
});
```

### In Python

```python
import requests

headers = {
  'Authorization': 'Bearer sk_leadiumx_greenlight_abc123xyz',
  'Content-Type': 'application/json'
}

data = {
  'agent_id': 'agent_67147b301907688dfbb1404888',
  'from_number': '+17122183438',
  'to_number': '+18055551234'
}

response = requests.post(
  'https://api.leadiumx.com/v1/calls',
  headers=headers,
  json=data
)
```

---

## 🔑 Key Format Standard

```
sk_leadiumx_[ACCOUNT]_[RANDOM_32_CHARS]

Example: sk_leadiumx_greenlight_abc123xyz789000111222333444555
```

**Parts:**
- `sk_` = Standard Key prefix
- `leadiumx_` = Product prefix
- `[ACCOUNT]` = Sub-account name (greenlight, mansor, etc.)
- `[RANDOM]` = 32-char random string (alphanumeric)

---

## 🛡️ Security Best Practices

### For Sub-Accounts

✅ **DO:**
- Store API key in environment variables
- Rotate keys every 90 days
- Use HTTPS for all requests
- Never commit keys to git
- Add key to `.gitignore`

❌ **DON'T:**
- Hardcode API keys in code
- Share keys via email or Slack
- Use same key for multiple services
- Log API keys in error messages
- Expose key in client-side code (JavaScript)

### Example: Environment Setup

```bash
# .env file (DO NOT COMMIT)
LEADIUMX_API_KEY=sk_leadiumx_greenlight_abc123xyz
LEADIUMX_API_URL=https://api.leadiumx.com
LEADIUMX_SUB_ACCOUNT=greenlight_offer
```

```python
# Python: Load from environment
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('LEADIUMX_API_KEY')
api_url = os.getenv('LEADIUMX_API_URL')
sub_account = os.getenv('LEADIUMX_SUB_ACCOUNT')
```

---

## 📊 Rate Limiting per Key

| Plan | Calls/Day | SMS/Day | Emails/Day | Cost |
|------|-----------|---------|-----------|------|
| **Starter** | 50 | 100 | 100 | Free |
| **Professional** | 500 | 1,000 | 1,000 | $99/mo |
| **Enterprise** | 10,000+ | 10,000+ | 10,000+ | Custom |

Rate limit enforced in API:
```javascript
// In backend: Check rate limit before processing
const dailyUsage = await db.countCallsToday(apiKey);
if (dailyUsage >= rateLimitPerDay) {
  return res.status(429).json({
    error: 'Rate limit exceeded',
    message: `${dailyUsage}/${rateLimitPerDay} calls used today`,
    retry_after: 3600
  });
}
```

---

## 🔄 Key Rotation

### Generate New Key

1. Create new key in database
2. Set old key to `is_active = false`
3. Give sub-account 7-day grace period
4. Disable old key after grace period

### Example Timeline

```
Day 0: Issue new key
       sk_leadiumx_greenlight_new_key_2026
Day 7: Notify sub-account to switch
Day 14: Disable old key
       sk_leadiumx_greenlight_old_key_2025 → is_active = false
```

---

## 📋 Sub-Account Onboarding Checklist

When adding new sub-account:

- [ ] Create sub-account in Supabase
- [ ] Generate unique API key
- [ ] Assign Retell AI agents
- [ ] Set rate limits
- [ ] Create welcome email with credentials
- [ ] Provide documentation link
- [ ] Test with sample call
- [ ] Monitor for abuse

---

## 🚨 Monitor API Usage

### Per-Key Dashboard

```sql
SELECT 
  ak.key_name,
  ak.sub_account_id,
  COUNT(ch.id) as calls_today,
  ak.rate_limit_per_day,
  ROUND(COUNT(ch.id) * 100.0 / ak.rate_limit_per_day, 1) as percent_used
FROM api_keys ak
LEFT JOIN call_history ch ON ch.api_key_id = ak.id 
  AND ch.created_at::date = CURRENT_DATE
WHERE ak.is_active = true
GROUP BY ak.id, ak.key_name, ak.sub_account_id, ak.rate_limit_per_day
ORDER BY percent_used DESC;
```

### Alert if over 80%

```javascript
// Cron job: Check daily
const usage = await db.getApiKeyUsage();
usage.forEach(key => {
  const percent = key.calls_today / key.rate_limit_per_day * 100;
  if (percent > 80) {
    sendAlert(`${key.sub_account_id} approaching rate limit: ${percent}%`);
  }
});
```

---

## 🔧 Revoke Compromised Key

If key is exposed:

```sql
UPDATE api_keys 
SET is_active = false, revoked_at = NOW()
WHERE key = 'sk_leadiumx_greenlight_abc123xyz';
```

Then:
1. Notify sub-account immediately
2. Issue new key
3. Update their system
4. Monitor old key for abuse

---

## 📞 Support

### For Sub-Accounts
- Email: support@leadiumx.com
- Dashboard: https://dashboard.leadiumx.com
- Docs: https://docs.leadiumx.com

### For API Issues
- Status page: https://status.leadiumx.com
- Debug: Check error response HTTP status
- Logs: Available in dashboard

---

**Status:** Documentation Ready ✅  
**Last Updated:** April 18, 2026
