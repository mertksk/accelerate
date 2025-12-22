// Single Batch API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { BatchDB } from '@/services/db';

// GET /api/batches/[id] - Get single batch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batchId = parseInt(id);

    if (isNaN(batchId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid batch ID' },
        { status: 400 }
      );
    }

    const batch = await BatchDB.getById(batchId);

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Serialize for JSON
    const serialized = {
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
    };

    return NextResponse.json({
      success: true,
      batch: serialized,
    });
  } catch (error) {
    console.error('[API] Error getting batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get batch' },
      { status: 500 }
    );
  }
}
