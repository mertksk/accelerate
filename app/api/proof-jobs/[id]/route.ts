// Proof Job API for Casper Accelerate ZK-Rollup
import { NextRequest, NextResponse } from 'next/server';
import { ProofJobDB } from '@/services/db';

// GET /api/proof-jobs/[id] - Get proof job status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proofJob = await ProofJobDB.getById(id);

    if (!proofJob) {
      return NextResponse.json(
        { success: false, error: 'Proof job not found' },
        { status: 404 }
      );
    }

    // Serialize for JSON
    const serialized = {
      ...proofJob,
      batch: {
        ...proofJob.batch,
        createdAt: proofJob.batch.createdAt.toISOString(),
        updatedAt: proofJob.batch.updatedAt.toISOString(),
      },
      startedAt: proofJob.startedAt?.toISOString(),
      completedAt: proofJob.completedAt?.toISOString(),
      createdAt: proofJob.createdAt.toISOString(),
      updatedAt: proofJob.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      proofJob: serialized,
    });
  } catch (error) {
    console.error('[API] Error getting proof job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get proof job' },
      { status: 500 }
    );
  }
}
