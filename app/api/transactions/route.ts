// Transactions API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { TransactionDB, TransactionStatus } from '@/services/db';
import { sequencer } from '@/services/sequencer';

// GET /api/transactions - List transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TransactionStatus | null;
    const batchId = searchParams.get('batchId');
    const fromAddress = searchParams.get('from');
    const toAddress = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const transactions = await TransactionDB.list({
      status: status || undefined,
      batchId: batchId ? parseInt(batchId) : undefined,
      fromAddress: fromAddress || undefined,
      toAddress: toAddress || undefined,
      limit,
      offset,
    });

    // Convert BigInt to string for JSON serialization
    const serialized = transactions.map(tx => ({
      ...tx,
      amount: tx.amount.toString(),
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      transactions: serialized,
      count: serialized.length,
    });
  } catch (error) {
    console.error('[API] Error listing transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, amount, l1DepositHash } = body;

    console.log('[API] POST /api/transactions received:', { from, to, amount, l1DepositHash });

    if (!from || !to || amount === undefined) {
      console.log('[API] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields: from, to, amount' },
        { status: 400 }
      );
    }

    // Convert amount to BigInt (input should be in CSPR, convert to motes)
    const amountMotes = BigInt(Math.floor(parseFloat(amount) * 1e9));
    console.log('[API] Amount in motes:', amountMotes.toString());

    // Submit transaction via sequencer
    console.log('[API] Calling sequencer.submitTransaction...');
    const txId = await sequencer.submitTransaction(
      from,
      to,
      amountMotes,
      l1DepositHash
    );
    console.log('[API] Transaction submitted, txId:', txId);

    // Get the created transaction
    const tx = await TransactionDB.getById(txId);

    return NextResponse.json({
      success: true,
      transaction: tx ? {
        ...tx,
        amount: tx.amount.toString(),
        createdAt: tx.createdAt.toISOString(),
        updatedAt: tx.updatedAt.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error('[API] Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
