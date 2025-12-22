// SSE Hook for real-time updates
import { useState, useEffect, useRef } from 'react';

export interface ProofProgressMessage {
  type: 'PROOF_PROGRESS';
  jobId: string;
  batchId: number;
  status: string;
  progress: number;
  progressMsg: string;
  estimatedTimeMs?: number;
}

export interface BatchUpdateMessage {
  type: 'BATCH_UPDATE';
  batchId: number;
  status: string;
  proofHash?: string;
  l1TxHash?: string;
}

export interface TransactionUpdateMessage {
  type: 'TX_UPDATE';
  txId: string;
  status: string;
  batchId?: number;
}

export interface ConnectedMessage {
  type: 'CONNECTED';
  clientId: string;
}

export interface PingMessage {
  type: 'PING';
  timestamp: number;
}

export type EventMessage =
  | ProofProgressMessage
  | BatchUpdateMessage
  | TransactionUpdateMessage
  | ConnectedMessage
  | PingMessage;

interface UseEventSourceOptions {
  onProofProgress?: (msg: ProofProgressMessage) => void;
  onBatchUpdate?: (msg: BatchUpdateMessage) => void;
  onTransactionUpdate?: (msg: TransactionUpdateMessage) => void;
  onConnect?: (clientId: string) => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

export function useEventSource(options: UseEventSourceOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [lastPing, setLastPing] = useState<number | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Store callbacks in refs to avoid dependency issues
  const callbacksRef = useRef(options);
  callbacksRef.current = options;

  useEffect(() => {
    mountedRef.current = true;

    const connect = () => {
      // Don't connect if unmounted
      if (!mountedRef.current) return;

      // Clean up existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new EventSource
      const eventSource = new EventSource('/api/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        if (!mountedRef.current) return;
        console.log('[SSE] Connected');
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        if (!mountedRef.current) return;

        try {
          const message: EventMessage = JSON.parse(event.data);
          const callbacks = callbacksRef.current;

          switch (message.type) {
            case 'CONNECTED':
              setClientId(message.clientId);
              callbacks.onConnect?.(message.clientId);
              break;
            case 'PING':
              setLastPing(message.timestamp);
              break;
            case 'PROOF_PROGRESS':
              callbacks.onProofProgress?.(message);
              break;
            case 'BATCH_UPDATE':
              callbacks.onBatchUpdate?.(message);
              break;
            case 'TX_UPDATE':
              callbacks.onTransactionUpdate?.(message);
              break;
          }
        } catch (error) {
          console.error('[SSE] Error parsing message:', error);
        }
      };

      eventSource.onerror = (error) => {
        if (!mountedRef.current) return;

        console.error('[SSE] Error:', error);
        setIsConnected(false);
        callbacksRef.current.onError?.(error);

        // Auto-reconnect with backoff
        const autoReconnect = callbacksRef.current.autoReconnect ?? true;
        const reconnectDelay = callbacksRef.current.reconnectDelay ?? 3000;

        if (autoReconnect && mountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              console.log('[SSE] Attempting to reconnect...');
              connect();
            }
          }, reconnectDelay);
        }
      };
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setClientId(null);
  };

  const reconnect = () => {
    disconnect();
    if (eventSourceRef.current === null) {
      const eventSource = new EventSource('/api/events');
      eventSourceRef.current = eventSource;
      // Re-attach handlers...
    }
  };

  return {
    isConnected,
    clientId,
    lastPing,
    reconnect,
    disconnect,
  };
}
