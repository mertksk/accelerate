// Server-Sent Events API for Casper Accelerate ZK-Rollup
// Provides real-time updates for proof progress, batch status, and transactions
import { NextRequest } from 'next/server';
import { wsManager, WSMessage } from '@/services/wsManager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/events - SSE endpoint for real-time updates
export async function GET(request: NextRequest) {
  const clientId = `sse_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const connectMsg = `data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`;
      controller.enqueue(encoder.encode(connectMsg));

      // Subscribe to updates
      const unsubscribe = wsManager.subscribe(clientId, (message: WSMessage) => {
        try {
          const data = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error('[SSE] Error sending message:', error);
        }
      });

      // Keep-alive ping every 30 seconds
      const pingInterval = setInterval(() => {
        try {
          const ping = `data: ${JSON.stringify({ type: 'PING', timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(ping));
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      // Cleanup on abort
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Stream may already be closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
