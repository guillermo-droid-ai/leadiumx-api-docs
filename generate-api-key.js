#!/usr/bin/env node

/**
 * LeadiumX API Key Generator
 * Usage: node generate-api-key.js --account greenlight --name "Main Key"
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const account = args[args.indexOf('--account') + 1] || 'default';
const keyName = args[args.indexOf('--name') + 1] || `${account} API Key`;
const rateLimit = parseInt(args[args.indexOf('--rate-limit') + 1] || '1000');

// Generate random key
function generateKey() {
  const prefix = 'sk_leadiumx_';
  const accountPrefix = account.toLowerCase().replace(/\s+/g, '_');
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `${prefix}${accountPrefix}_${randomBytes}`;
}

// Generate key hash (SHA256)
function hashKey(key) {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex');
}

// Main
async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🔑 LeadiumX API Key Generator');
  console.log('═══════════════════════════════════════════');
  console.log('');

  // Generate key
  const apiKey = generateKey();
  const keyHash = hashKey(apiKey);
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year

  // Display key info
  console.log('📋 Key Details:');
  console.log('');
  console.log(`  Account:          ${account}`);
  console.log(`  Key Name:         ${keyName}`);
  console.log(`  Created:          ${createdAt}`);
  console.log(`  Expires:          ${expiresAt}`);
  console.log(`  Rate Limit:       ${rateLimit} calls/day`);
  console.log('');

  console.log('🔐 API Key (Save This!):');
  console.log('');
  console.log(`  ${apiKey}`);
  console.log('');

  console.log('📊 Key Hash (For Database):');
  console.log('');
  console.log(`  ${keyHash}`);
  console.log('');

  // SQL insert
  console.log('💾 Database Insert:');
  console.log('');
  console.log(`INSERT INTO api_keys (`);
  console.log(`  sub_account_id,`);
  console.log(`  key_hash,`);
  console.log(`  key_name,`);
  console.log(`  created_at,`);
  console.log(`  expires_at,`);
  console.log(`  rate_limit_per_day,`);
  console.log(`  is_active`);
  console.log(`) VALUES (`);
  console.log(`  '${account}',`);
  console.log(`  '${keyHash}',`);
  console.log(`  '${keyName}',`);
  console.log(`  '${createdAt}',`);
  console.log(`  '${expiresAt}',`);
  console.log(`  ${rateLimit},`);
  console.log(`  true`);
  console.log(`);`);
  console.log('');

  // Example usage
  console.log('📝 Example Usage:');
  console.log('');
  console.log(`curl -X POST https://api.leadiumx.com/v1/calls \\`);
  console.log(`  -H "Authorization: Bearer ${apiKey}" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{`);
  console.log(`    "agent_id": "agent_67147b301907688dfbb1404888",`);
  console.log(`    "from_number": "+17122183438",`);
  console.log(`    "to_number": "+18055551234"`);
  console.log(`  }'`);
  console.log('');

  // Save to file
  const filename = `api-key-${account}-${Date.now()}.txt`;
  const content = `
LeadiumX API Key - ${account}
Generated: ${createdAt}
Expires: ${expiresAt}

API KEY (Keep Secret!):
${apiKey}

Key Hash (for database):
${keyHash}

Rate Limit: ${rateLimit} calls/day

Usage:
  curl -H "Authorization: Bearer ${apiKey}" https://api.leadiumx.com/v1/calls

IMPORTANT: Store this key securely. Do not commit to version control.
`;

  fs.writeFileSync(filename, content);
  console.log(`✅ Key saved to: ${filename}`);
  console.log('');
  console.log('⚠️  Keep this file secure and never commit it to git!');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
