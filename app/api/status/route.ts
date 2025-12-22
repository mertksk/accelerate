// Status API for Casper Accelerate ZK-Rollup
import { NextResponse } from 'next/server';
import { sequencer } from '@/services/sequencer';
import { stateManager } from '@/services/stateManager';
import { serverProver } from '@/services/serverProver';
import { wsManager } from '@/services/wsManager';
import { checkDatabaseConnection, TransactionDB, BatchDB, AccountDB } from '@/services/db';

// GET /api/status - Get system status
export async function GET() {
  try {
    const dbConnected = await checkDatabaseConnection();

    let stats = {
      pendingTxCount: 0,
      totalTxCount: 0,
      batchCount: 0,
      accountCount: 0,
    };

    if (dbConnected) {
      try {
        const [pendingCount, totalCount, batchCount, accountCount] = await Promise.all([
          TransactionDB.count('PENDING'),
          TransactionDB.count(),
          BatchDB.count(),
          AccountDB.count(),
        ]);
        stats = {
          pendingTxCount: pendingCount,
          totalTxCount: totalCount,
          batchCount,
          accountCount,
        };
      } catch {
        // Stats might fail if tables don't exist yet
      }
    }

    let stateRoot = '0';
    try {
      stateRoot = (await stateManager.getStateRoot()).toString();
    } catch {
      // State manager might not be initialized
    }

    return NextResponse.json({
      success: true,
      status: {
        database: {
          connected: dbConnected,
        },
        sequencer: sequencer.getStatus(),
        stateManager: stateManager.getStatus(),
        prover: serverProver.getStatus(),
        websocket: wsManager.getStatus(),
        stats,
        stateRoot: stateRoot.substring(0, 20) + '...',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] Error getting status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/status - Start sequencer or resume proofs
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'start_sequencer';

    if (action === 'resume_proofs') {
      const resumed = await sequencer.resumeProofs();
      return NextResponse.json({
        success: true,
        message: `Resumed ${resumed} proof jobs`,
        status: sequencer.getStatus(),
      });
    }

    // Default: start sequencer
    await sequencer.start();
    return NextResponse.json({
      success: true,
      message: 'Sequencer started',
      status: sequencer.getStatus(),
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed' },
      { status: 500 }
    );
  }
}
