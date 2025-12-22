// Accounts API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { AccountDB } from '@/services/db';

// GET /api/accounts - List accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const accounts = await AccountDB.list({ limit, offset });
    const total = await AccountDB.count();

    // Convert BigInt to string for JSON serialization
    const serialized = accounts.map(account => ({
      ...account,
      balance: account.balance.toString(),
      nonce: account.nonce.toString(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      accounts: serialized,
      count: serialized.length,
      total,
    });
  } catch (error) {
    console.error('[API] Error listing accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list accounts' },
      { status: 500 }
    );
  }
}
