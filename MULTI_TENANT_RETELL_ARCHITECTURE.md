# LeadiumX Multi-Tenant Retell Architecture

## 🏗️ Architecture Overview

Each LeadiumX sub-account has its own Retell AI account with independent agent limits based on subscription.

```
LeadiumX Platform
│
├─ API Gateway (44.200.84.173:3000)
│  └─ Routes calls to correct Retell account based on API key
│
├─ Sub-Account: Greenlight Offer
│  ├─ Plan: Professional
│  ├─ Agent Limit: 500
│  ├─ Retell Account: retell_greenlight@leadiumx.com
│  ├─ Retell API Key: key_greenlight_xxx
│  ├─ Agents: 0/500 (can create 500)
│  └─ Status: ✅ READY
│
├─ Sub-Account: Mansor Customs
│  ├─ Plan: Starter
│  ├─ Agent Limit: 5
│  ├─ Retell Account: retell_mansor@leadiumx.com
│  ├─ Retell API Key: key_mansor_xxx
│  ├─ Agents: 0/5 (can create 5)
│  └─ Status: ✅ READY
│
├─ Sub-Account: Persistent Offer
│  ├─ Plan: Enterprise
│  ├─ Agent Limit: Unlimited
│  ├─ Retell Account: retell_persistent@leadiumx.com
│  ├─ Retell API Key: key_persistent_xxx
│  ├─ Agents: 0/∞ (can create unlimited)
│  └─ Status: ✅ READY
│
└─ Supabase (Database)
   ├─ Sub-accounts table
   ├─ API keys table (per sub-account)
   ├─ Retell keys table (per sub-account)
   └─ Agent mappings table
```

---

## 📊 Subscription Tiers & Agent Limits

| Plan | Monthly Cost | Agent Limit | Calls/Month | Best For |
|------|-------------|------------|-----------|----------|
| **Starter** | Free | 5 | 100 | Testing |
| **Professional** | $99 | 500 | 50K | Small team |
| **Enterprise** | Custom | Unlimited | Unlimited | Large scale |
| **Premium** | $299 | 1,000 | 250K | Growing team |

---

## 🔧 Implementation Architecture

### Step 1: Create Retell Account per Sub-Account

**For each sub-account:**

```bash
# Greenlight Offer
Email: retell_greenlight@leadiumx.com
Password: Generate secure password
Retell API Key: key_greenlight_xxx
Plan: Professional ($99/month)

# Mansor Customs
Email: retell_mansor@leadiumx.com
Password: Generate secure password
Retell API Key: key_mansor_xxx
Plan: Starter (Free)

# Persistent Offer
Email: retell_persistent@leadiumx.com
Password: Generate secure password
Retell API Key: key_persistent_xxx
Plan: Enterprise (Custom)
```

### Step 2: Store Credentials in Supabase

```sql
CREATE TABLE sub_account_retell_keys (
  id UUID PRIMARY KEY,
  sub_account_id VARCHAR UNIQUE,
  sub_account_name VARCHAR,
  retell_api_key VARCHAR ENCRYPTED,
  retell_account_email VARCHAR,
  plan_type VARCHAR (starter|professional|enterprise),
  agent_limit INTEGER,
  agents_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO sub_account_retell_keys VALUES
  (uuid(), 'greenlight_offer', 'Greenlight Offer', 'key_greenlight_xxx', 'retell_greenlight@leadiumx.com', 'professional', 500, 0, true, now(), now()),
  (uuid(), 'mansor_customs', 'Mansor Customs', 'key_mansor_xxx', 'retell_mansor@leadiumx.com', 'starter', 5, 0, true, now(), now()),
  (uuid(), 'persistent_offer', 'Persistent Offer', 'key_persistent_xxx', 'retell_persistent@leadiumx.com', 'enterprise', NULL, 0, true, now(), now());
```

### Step 3: Update Backend to Route by Sub-Account

**In server.js:**

```javascript
// Get Retell key based on API key sub-account
async function getRetellKeyForSubAccount(apiKey) {
  // Extract sub-account from API key
  const matches = apiKey.match(/sk_leadiumx_([a-z_]+)_/);
  const subAccountId = matches ? matches[1] : null;

  if (!subAccountId) {
    throw new Error('Invalid API key format');
  }

  // Fetch Retell key from Supabase
  const { data, error } = await supabase
    .from('sub_account_retell_keys')
    .select('retell_api_key, agent_limit, agents_used')
    .eq('sub_account_id', subAccountId)
    .single();

  if (error || !data) {
    throw new Error(`Sub-account not found: ${subAccountId}`);
  }

  return data;
}

// Check agent limit before creating
async function checkAgentLimit(apiKey) {
  const retellConfig = await getRetellKeyForSubAccount(apiKey);

  if (retellConfig.agent_limit && retellConfig.agents_used >= retellConfig.agent_limit) {
    return {
      allowed: false,
      message: `Agent limit reached: ${retellConfig.agents_used}/${retellConfig.agent_limit}`,
      limit: retellConfig.agent_limit,
      used: retellConfig.agents_used
    };
  }

  return {
    allowed: true,
    remaining: retellConfig.agent_limit ? (retellConfig.agent_limit - retellConfig.agents_used) : Infinity
  };
}

// In voice call endpoint
app.post('/v1/calls', async (req, res) => {
  const { apiKey } = req.headers.authorization.split(' ')[1];

  // Check limit
  const limitCheck = await checkAgentLimit(apiKey);
  if (!limitCheck.allowed) {
    return res.status(429).json({
      error: 'Agent limit exceeded',
      message: limitCheck.message,
      limit: limitCheck.limit,
      used: limitCheck.used
    });
  }

  // Get Retell key for this sub-account
  const retellConfig = await getRetellKeyForSubAccount(apiKey);

  // Make call with sub-account's Retell API key
  const response = await axios.post(
    `${RETELL_BASE_URL}/v2/create-phone-call`,
    {
      agent_id: req.body.agent_id,
      from_number: req.body.from_number,
      to_number: req.body.to_number,
      agent_version: req.body.agent_version || 0,
      ...req.body.dynamic_vars_values && { retell_llm_dynamic_variables: req.body.dynamic_vars_values }
    },
    {
      headers: {
        Authorization: `Bearer ${retellConfig.retell_api_key}`,  // ← Use sub-account's key!
        'Content-Type': 'application/json'
      }
    }
  );

  // Increment agent usage
  await supabase
    .from('sub_account_retell_keys')
    .update({ agents_used: retellConfig.agents_used + 1 })
    .eq('sub_account_id', apiKey.match(/sk_leadiumx_([a-z_]+)_/)[1]);

  res.json(response.data);
});
```

---

## 🔑 API Key Flow

### Sub-Account 1: Greenlight Offer

```
User sends API call:
  POST /v1/calls
  Authorization: Bearer sk_leadiumx_greenlight_abc123

Backend processes:
  1. Extracts sub-account: "greenlight"
  2. Looks up Retell key: key_greenlight_xxx
  3. Checks limit: 0/500 ✅ allowed
  4. Calls Retell with: key_greenlight_xxx
  5. Increments counter: 1/500
  6. Logs call to Supabase

Result:
  Voice call initiated using Greenlight's Retell account
```

### Sub-Account 2: Mansor Customs

```
User sends API call:
  POST /v1/calls
  Authorization: Bearer sk_leadiumx_mansor_def456

Backend processes:
  1. Extracts sub-account: "mansor"
  2. Looks up Retell key: key_mansor_xxx
  3. Checks limit: 4/5 ✅ allowed
  4. Calls Retell with: key_mansor_xxx
  5. Increments counter: 5/5
  6. Logs call to Supabase

Next call:
  BLOCKED - Agent limit reached (5/5)
  Error: "Agent limit reached: 5/5"
```

---

## 📈 Upgrade Flow

When sub-account upgrades plan:

```
Mansor Customs upgrades: Starter → Professional

Database update:
UPDATE sub_account_retell_keys
SET plan_type = 'professional', agent_limit = 500
WHERE sub_account_id = 'mansor_customs';

Result:
  Before: 5/5 agents (blocked)
  After: 5/500 agents (495 remaining)
  New agents can be created immediately
```

---

## 🛡️ Security

### API Key Per Sub-Account

```bash
# Greenlight API key
sk_leadiumx_greenlight_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Mansor API key
sk_leadiumx_mansor_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4

# Persistent API key
sk_leadiumx_persistent_f1e2d3c4b5a6978z8y9x0w1v2u3t4s5
```

Each key:
- ✅ Grants access to own Retell account only
- ✅ Respects own agent limit
- ✅ Can't see other sub-account data
- ✅ Logged separately in database

### Encryption

Retell API keys stored encrypted in Supabase:

```javascript
// Encrypt before storing
const encrypted = encrypt(retellApiKey, ENCRYPTION_KEY);

// Decrypt before using
const decrypted = decrypt(encrypted, ENCRYPTION_KEY);
```

---

## 🚀 Implementation Steps

### Phase 1: Setup (This Week)

1. **Create Retell accounts** for each sub-account
   ```
   Time: 30 min per account
   Cost: Depends on plan
   ```

2. **Store Retell keys** in Supabase
   ```
   Time: 10 min
   SQL: Create table + insert records
   ```

3. **Update backend** to route by sub-account
   ```
   Time: 2 hours
   Code: Update server.js with routing logic
   ```

4. **Generate LeadiumX API keys**
   ```
   Time: 10 min
   Script: generate-api-key.js
   ```

### Phase 2: Testing (Next Week)

1. Test each sub-account separately
   ```bash
   # Test Greenlight
   curl -X POST https://api.leadiumx.com/v1/calls \
     -H "Authorization: Bearer sk_leadiumx_greenlight_abc123" \
     -d '{"agent_id":"...", "from_number":"+17122183438", "to_number":"+18055551234"}'
   
   # Test Mansor
   curl -X POST https://api.leadiumx.com/v1/calls \
     -H "Authorization: Bearer sk_leadiumx_mansor_def456" \
     -d '{"agent_id":"...", "from_number":"+17122183438", "to_number":"+18055551234"}'
   ```

2. Verify limits enforced
   ```bash
   # Mansor Starter (5 agents) - Create 6th agent → Should fail
   # Error: "Agent limit reached: 5/5"
   ```

3. Test upgrade flow
   ```bash
   # Upgrade Mansor to Professional
   # Limits change: 5 → 500 agents
   # 6th agent creation should succeed
   ```

### Phase 3: Rollout (Production)

1. Deploy updated backend
2. Provision Retell accounts in production
3. Issue API keys to sub-accounts
4. Monitor usage

---

## 📊 Monitoring Dashboard

Create dashboard to monitor per sub-account:

```sql
SELECT 
  sa.sub_account_name,
  sa.plan_type,
  sa.agent_limit,
  sa.agents_used,
  ROUND(sa.agents_used * 100.0 / sa.agent_limit, 1) as percent_used,
  (sa.agent_limit - sa.agents_used) as agents_remaining
FROM sub_account_retell_keys sa
ORDER BY percent_used DESC;
```

Example output:
```
┌──────────────────┬──────────────┬──────────┬──────────┬──────────┬──────────────┐
│ sub_account_name │ plan_type    │ limit    │ used     │ percent  │ remaining    │
├──────────────────┼──────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Mansor Customs   │ Professional │ 500      │ 125      │ 25%      │ 375          │
│ Greenlight Offer │ Professional │ 500      │ 89       │ 17.8%    │ 411          │
│ Persistent Offer │ Enterprise   │ NULL     │ 2342     │ N/A      │ Unlimited    │
└──────────────────┴──────────────┴──────────┴──────────┴──────────┴──────────────┘
```

---

## 🎯 Benefits of This Architecture

✅ **Isolated Limits** - Each sub-account respects own limit  
✅ **Scalable** - Easy to add new sub-accounts  
✅ **Upgrade Path** - Seamless plan upgrades  
✅ **Security** - API keys grant access only to own account  
✅ **Monitoring** - Track usage per sub-account  
✅ **Cost Control** - Bill each sub-account separately  
✅ **Support** - Easier troubleshooting per tenant  

---

## 💰 Cost Model

| Sub-Account | Plan | Monthly Cost | Agent Limit |
|------------|------|-------------|------------|
| Greenlight | Pro | $200 | Unlimited |
| Mansor | Starter | Free | 8 |
| Persistent | Pro | $200 | Unlimited |
| **Total** | | **$400** | **Varies** |

---

## ⏭️ Next Steps

1. **Create Retell accounts** for each sub-account
2. **Update Supabase** with Retell keys
3. **Update backend** routing logic
4. **Test limits** with each sub-account
5. **Deploy to production**

**Estimated time:** 2-3 days

---

**Status:** Architecture Designed ✅  
**Implementation:** Ready to start  
**Priority:** High (Unblocks sub-account system)
