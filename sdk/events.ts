/**
 * Casper Accelerate SDK - Event Subscription Manager
 * @package @accelerate/sdk
 */

import type {
  SDKConfig,
  EventHandlers,
  EventSubscription,
  SDKEvent,
  ProofProgressEvent,
  BatchUpdateEvent,
  TransactionUpdateEvent,
} from './types';

const DEFAULT_BASE_URL = 'https://accelerate.casper.network';
const DEFAULT_RECONNECT_DELAY = 3000;

export class EventManager {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly autoReconnect: boolean;
  private readonly reconnectDelay: number;

  private eventSource: EventSource | null = null;
  private handlers: EventHandlers = {};
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isManualDisconnect = false;
  private clientId: string | null = null;

  constructor(config: SDKConfig) {
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.autoReconnect = config.autoReconnect ?? true;
    this.reconnectDelay = config.reconnectDelay ?? DEFAULT_RECONNECT_DELAY;
  }

  /**
   * Subscribe to all events with handlers
   */
  subscribe(handlers: EventHandlers): EventSubscription {
    this.handlers = { ...this.handlers, ...handlers };
    this.isManualDisconnect = false;
    this.connect();

    return {
      unsubscribe: () => this.disconnect(),
      isConnected: () => this.isConnected(),
    };
  }

  /**
   * Subscribe only to proof progress events
   */
  onProofProgress(handler: (event: ProofProgressEvent) => void): EventSubscription {
    return this.subscribe({ onProofProgress: handler });
  }

  /**
   * Subscribe only to batch update events
   */
  onBatchUpdate(handler: (event: BatchUpdateEvent) => void): EventSubscription {
    return this.subscribe({ onBatchUpdate: handler });
  }

  /**
   * Subscribe only to transaction update events
   */
  onTransactionUpdate(handler: (event: TransactionUpdateEvent) => void): EventSubscription {
    return this.subscribe({ onTransactionUpdate: handler });
  }

  /**
   * Check if connected to event stream
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * Get current client ID (assigned by server)
   */
  getClientId(): string | null {
    return this.clientId;
  }

  /**
   * Connect to the event stream
   */
  private connect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // EventSource doesn't support custom headers, so we pass API key as query param
    // This is acceptable for SSE as it's a read-only subscription
    const url = `${this.baseUrl}/api/events?apiKey=${encodeURIComponent(this.apiKey)}`;

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        // Connection established - wait for CONNECTED message with clientId
      };

      this.eventSource.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.eventSource.onerror = (error) => {
        console.error('[AccelerateSDK] Event stream error:', error);
        this.handlers.onError?.(new Error('Event stream connection error'));
        this.handlers.onDisconnect?.();
        this.clientId = null;

        if (this.autoReconnect && !this.isManualDisconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('[AccelerateSDK] Failed to create EventSource:', error);
      this.handlers.onError?.(error as Error);
    }
  }

  /**
   * Handle incoming SSE message
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as SDKEvent;

      switch (message.type) {
        case 'CONNECTED':
          this.clientId = message.clientId;
          this.handlers.onConnect?.(message.clientId);
          break;

        case 'PROOF_PROGRESS':
          this.handlers.onProofProgress?.(message);
          break;

        case 'BATCH_UPDATE':
          this.handlers.onBatchUpdate?.(message);
          break;

        case 'TX_UPDATE':
          this.handlers.onTransactionUpdate?.(message);
          break;

        case 'PING':
          // Keep-alive ping, no action needed
          break;

        default:
          // Unknown message type, ignore
          break;
      }
    } catch (error) {
      console.error('[AccelerateSDK] Error parsing event:', error);
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isManualDisconnect) {
        console.log('[AccelerateSDK] Reconnecting to event stream...');
        this.connect();
      }
    }, this.reconnectDelay);
  }

  /**
   * Disconnect from the event stream
   */
  disconnect(): void {
    this.isManualDisconnect = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.clientId = null;
    this.handlers.onDisconnect?.();
  }

  /**
   * Manually reconnect (useful after network recovery)
   */
  reconnect(): void {
    this.isManualDisconnect = false;
    this.connect();
  }
}

/**
 * Create a standalone event manager
 * Useful when you only need event subscription without full SDK
 */
export function createEventManager(config: SDKConfig): EventManager {
  return new EventManager(config);
}
