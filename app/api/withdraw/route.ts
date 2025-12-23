// Withdraw API for Casper Accelerate ZK-Rollup
// Handles L2 -> L1 withdrawals
import { NextRequest, NextResponse } from 'next/server';
import { stateManager } from '@/services/stateManager';
import { AccountDB } from '@/services/db';

// POST /api/withdraw - Process withdrawal request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, amount } = body;

    if (!address || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing address or amount' },
        { status: 400 }
      );
    }

    const amountBigInt = BigInt(amount);
    console.log(`[Withdraw API] Processing withdrawal: ${address} -> ${Number(amountBigInt) / 1e9} CSPR`);

    // Initialize state manager if needed
    await stateManager.init();

    // Get current account
    const account = await stateManager.getAccount(address);
    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Check balance
    if (account.balance < amountBigInt) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Have: ${account.balance}, need: ${amountBigInt}` },
        { status: 400 }
      );
    }

    // Deduct from L2 balance
    const newBalance = account.balance - amountBigInt;
    await stateManager.updateAccountBalance(address, newBalance, true);

    // Generate withdrawal ID
    const withdrawalId = `${Date.now().toString(16)}${Math.random().toString(16).substring(2, 8)}`;

    console.log(`[Withdraw API] Withdrawal processed: ${withdrawalId}`);
    console.log(`[Withdraw API] New balance for ${address}: ${newBalance}`);

    // In production, this would:
    // 1. Create a withdrawal record in the database
    // 2. Queue an L1 transaction to release funds from the contract
    // 3. Track the withdrawal status until L1 confirmation

    return NextResponse.json({
      success: true,
      withdrawalId,
      message: 'Withdrawal processed successfully',
      newBalance: newBalance.toString(),
      amountWithdrawn: amount
    });
  } catch (error) {
    console.error('[Withdraw API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process withdrawal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
