// WebSocket Manager for Casper Accelerate ZK-Rollup
// Manages real-time connections and broadcasts updates

import { ProofJobStatus, BatchStatus, TransactionStatus } from './db';

// Message types
export interface ProofProgressMessage {
  type: 'PROOF_PROGRESS';
  jobId: string;
  batchId: number;
  status: ProofJobStatus;
  progress: number;
  progressMsg: string;
  estimatedTimeMs?: number;
}

export interface BatchUpdateMessage {
  type: 'BATCH_UPDATE';
  batchId: number;
  status: BatchStatus;
  proofHash?: string;
  l1TxHash?: string;
}

export interface TransactionUpdateMessage {
  type: 'TX_UPDATE';
  txId: string;
  status: TransactionStatus;
  batchId?: number;
}

export type WSMessage = ProofProgressMessage | BatchUpdateMessage | TransactionUpdateMessage;

// Subscriber callback type
type MessageHandler = (message: WSMessage) => void;

class WebSocketManager {
  private subscribers: Map<string, MessageHandler> = new Map();
  private lastMessages: Map<string, WSMessage> = new Map();

  /**
   * Subscribe to WebSocket messages
   * Returns an unsubscribe function
   */
  subscribe(clientId: string, handler: MessageHandler): () => void {
    this.subscribers.set(clientId, handler);
    console.log(`[WSManager] Client ${clientId} subscribed. Total: ${this.subscribers.size}`);

    // Send last known state to new subscriber
    this.sendLastMessages(handler);

    return () => {
      this.subscribers.delete(clientId);
      console.log(`[WSManager] Client ${clientId} unsubscribed. Total: ${this.subscribers.size}`);
    };
  }

  /**
   * Send last messages to a new subscriber
   */
  private sendLastMessages(handler: MessageHandler): void {
    const messages = Array.from(this.lastMessages.values());
    for (const message of messages) {
      try {
        handler(message);
      } catch (error) {
        console.error('[WSManager] Failed to send last message:', error);
      }
    }
  }

  /**
   * Broadcast a message to all subscribers
   */
  broadcast(message: WSMessage): void {
    console.log(`[WSManager] Broadcasting ${message.type} to ${this.subscribers.size} subscribers`);

    // Store as last message
    const key = this.getMessageKey(message);
    this.lastMessages.set(key, message);

    // Clean up old messages (keep last 50)
    if (this.lastMessages.size > 50) {
      const keys = Array.from(this.lastMessages.keys());
      this.lastMessages.delete(keys[0]);
    }

    // Broadcast to all subscribers
    const entries = Array.from(this.subscribers.entries());
    for (const [clientId, handler] of entries) {
      try {
        handler(message);
        console.log(`[WSManager] Sent to ${clientId}`);
      } catch (error) {
        console.error(`[WSManager] Failed to send to ${clientId}:`, error);
        // Remove dead subscribers
        this.subscribers.delete(clientId);
      }
    }
  }

  /**
   * Get unique key for message storage
   */
  private getMessageKey(message: WSMessage): string {
    switch (message.type) {
      case 'PROOF_PROGRESS':
        return `proof_${message.jobId}`;
      case 'BATCH_UPDATE':
        return `batch_${message.batchId}`;
      case 'TX_UPDATE':
        return `tx_${message.txId}`;
    }
  }

  /**
   * Broadcast proof progress update
   */
  broadcastProofProgress(
    jobId: string,
    batchId: number,
    status: ProofJobStatus,
    progress: number,
    progressMsg: string,
    estimatedTimeMs?: number
  ): void {
    this.broadcast({
      type: 'PROOF_PROGRESS',
      jobId,
      batchId,
      status,
      progress,
      progressMsg,
      estimatedTimeMs,
    });
  }

  /**
   * Broadcast batch status update
   */
  broadcastBatchUpdate(
    batchId: number,
    status: BatchStatus,
    proofHash?: string,
    l1TxHash?: string
  ): void {
    this.broadcast({
      type: 'BATCH_UPDATE',
      batchId,
      status,
      proofHash,
      l1TxHash,
    });
  }

  /**
   * Broadcast transaction status update
   */
  broadcastTransactionUpdate(
    txId: string,
    status: TransactionStatus,
    batchId?: number
  ): void {
    this.broadcast({
      type: 'TX_UPDATE',
      txId,
      status,
      batchId,
    });
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      subscriberCount: this.subscribers.size,
      lastMessageCount: this.lastMessages.size,
    };
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();

// Helper to create progress callback for proof generation
export function createProgressCallback(jobId: string, batchId: number) {
  return async (progress: number, message: string, status: ProofJobStatus): Promise<void> => {
    wsManager.broadcastProofProgress(jobId, batchId, status, progress, message);
  };
}
