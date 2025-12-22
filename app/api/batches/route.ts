// Batches API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { BatchDB, BatchStatus } from '@/services/db';
import { sequencer } from '@/services/sequencer';

// GET /api/batches - List batches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as BatchStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const batches = await BatchDB.list({
      status: status || undefined,
      limit,
      offset,
    });

    // Serialize for JSON
    const serialized = batches.map(batch => ({
      ...batch,
      transactions: batch.transactions.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
        createdAt: tx.createdAt.toISOString(),
        updatedAt: tx.updatedAt.toISOString(),
      })),
      proofJob: batch.proofJob ? {
        ...batch.proofJob,
        startedAt: batch.proofJob.startedAt?.toISOString(),
        completedAt: batch.proofJob.completedAt?.toISOString(),
        createdAt: batch.proofJob.createdAt.toISOString(),
        updatedAt: batch.proofJob.updatedAt.toISOString(),
      } : null,
      createdAt: batch.createdAt.toISOString(),
      updatedAt: batch.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      batches: serialized,
      count: serialized.length,
    });
  } catch (error) {
    console.error('[API] Error listing batches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list batches' },
      { status: 500 }
    );
  }
}

// POST /api/batches - Force create a new batch
export async function POST() {
  try {
    const batchId = await sequencer.forceBatch();

    if (batchId === null) {
      return NextResponse.json({
        success: false,
        error: 'No pending transactions to batch',
      }, { status: 400 });
    }

    const batch = await BatchDB.getById(batchId);

    return NextResponse.json({
      success: true,
      batch: batch ? {
        ...batch,
        transactions: batch.transactions.map(tx => ({
          ...tx,
          amount: tx.amount.toString(),
          createdAt: tx.createdAt.toISOString(),
          updatedAt: tx.updatedAt.toISOString(),
        })),
        createdAt: batch.createdAt.toISOString(),
        updatedAt: batch.updatedAt.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error('[API] Error creating batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create batch' },
      { status: 500 }
    );
  }
}
