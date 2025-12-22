// Single Account API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { AccountDB } from '@/services/db';
import { stateManager } from '@/services/stateManager';

// GET /api/accounts/[address] - Get single account
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    const account = await AccountDB.getByAddress(address);

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get Merkle proof
    let merkleProof = null;
    try {
      const proof = await stateManager.getMerkleProof(address);
      merkleProof = {
        pathElements: proof.pathElements.map(e => e.toString()),
        pathIndices: proof.pathIndices,
        leaf: proof.leaf.toString(),
        root: proof.root.toString(),
      };
    } catch {
      // Merkle proof might not be available
    }

    // Serialize for JSON
    const serialized = {
      ...account,
      balance: account.balance.toString(),
      nonce: account.nonce.toString(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
      merkleProof,
    };

    return NextResponse.json({
      success: true,
      account: serialized,
    });
  } catch (error) {
    console.error('[API] Error getting account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get account' },
      { status: 500 }
    );
  }
}
