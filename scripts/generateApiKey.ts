/**
 * Script to generate a new API key
 * Run with: npx ts-node scripts/generateApiKey.ts
 */

import { apiKeyService } from '../services/apiKeyService';
import { prisma } from '../services/db';

async function main() {
  console.log('Generating new API key...\n');

  try {
    const result = await apiKeyService.create({
      name: 'Development Key',
      tier: 'PRO',
      ownerEmail: 'dev@accelerate.casper.network',
      permissions: ['read', 'write'],
    });

    console.log('✅ API Key Generated Successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('  🔑 API Key (save this - shown only once):');
    console.log(`     ${result.rawKey}`);
    console.log('');
    console.log('  📋 Key Details:');
    console.log(`     ID:          ${result.apiKey.id}`);
    console.log(`     Name:        ${result.apiKey.name}`);
    console.log(`     Tier:        ${result.apiKey.tier}`);
    console.log(`     Rate Limit:  ${result.apiKey.rateLimit} req/min`);
    console.log(`     Permissions: ${result.apiKey.permissions.join(', ')}`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📖 Usage Example:\n');
    console.log(`const sdk = new AccelerateSDK({`);
    console.log(`  apiKey: '${result.rawKey}',`);
    console.log(`  baseUrl: 'http://localhost:3000'`);
    console.log(`});\n`);

  } catch (error) {
    console.error('❌ Error generating API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
