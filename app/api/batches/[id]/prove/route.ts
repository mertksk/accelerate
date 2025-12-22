// Batch Prove API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { BatchDB, ProofJobDB, BatchStatus, ProofJobStatus } from '@/services/db';

// POST /api/batches/[id]/prove - Trigger proof generation for batch
export async function POST(
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

    // Check if batch already has a proof job
    if (batch.proofJob) {
      return NextResponse.json({
        success: true,
        message: 'Proof job already exists',
        proofJob: {
          ...batch.proofJob,
          startedAt: batch.proofJob.startedAt?.toISOString(),
          completedAt: batch.proofJob.completedAt?.toISOString(),
          createdAt: batch.proofJob.createdAt.toISOString(),
          updatedAt: batch.proofJob.updatedAt.toISOString(),
        },
      });
    }

    // Check batch status
    if (batch.status !== BatchStatus.PENDING) {
      return NextResponse.json(
        { success: false, error: `Cannot start proof for batch in ${batch.status} status` },
        { status: 400 }
      );
    }

    // Create proof job
    const proofJob = await ProofJobDB.create(batchId);

    return NextResponse.json({
      success: true,
      proofJob: {
        ...proofJob,
        createdAt: proofJob.createdAt.toISOString(),
        updatedAt: proofJob.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] Error triggering proof:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger proof generation' },
      { status: 500 }
    );
  }
}
