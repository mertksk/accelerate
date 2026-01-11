/**
 * Rate Limiting Middleware
 * In-memory sliding window rate limiter with tier-based limits
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiKeyTier } from '@prisma/client';
import type { AuthContext } from './auth';

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
}

interface RateLimitWindow {
  count: number;
  resetAt: number;
}

interface RateLimitState {
  minute: RateLimitWindow;
  day: RateLimitWindow;
}

// ============================================================================
// Configuration
// ============================================================================

const TIER_LIMITS: Record<ApiKeyTier, RateLimitConfig> = {
  FREE: {
    requestsPerMinute: 60,
    requestsPerDay: 1000,
  },
  STARTER: {
    requestsPerMinute: 300,
    requestsPerDay: 10000,
  },
  PRO: {
    requestsPerMinute: 1000,
    requestsPerDay: 100000,
  },
  ENTERPRISE: {
    requestsPerMinute: 5000,
    requestsPerDay: 1000000,
  },
};

// In-memory rate limit storage
// Key: API key ID, Value: rate limit state
const rateLimitStore = new Map<string, RateLimitState>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupScheduled = false;

function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;

  setInterval(() => {
    const now = Date.now();
    for (const [key, state] of rateLimitStore.entries()) {
      // Remove if both windows have expired
      if (state.minute.resetAt < now && state.day.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

// ============================================================================
// Rate Limit Logic
// ============================================================================

function getOrCreateState(apiKeyId: string): RateLimitState {
  let state = rateLimitStore.get(apiKeyId);

  if (!state) {
    const now = Date.now();
    state = {
      minute: { count: 0, resetAt: now + 60000 },
      day: { count: 0, resetAt: now + 86400000 },
    };
    rateLimitStore.set(apiKeyId, state);
    scheduleCleanup();
  }

  return state;
}

function checkAndUpdateLimit(
  state: RateLimitState,
  limits: RateLimitConfig
): { allowed: boolean; minuteRemaining: number; dayRemaining: number; resetAt: number } {
  const now = Date.now();

  // Reset minute window if expired
  if (now >= state.minute.resetAt) {
    state.minute = { count: 0, resetAt: now + 60000 };
  }

  // Reset day window if expired
  if (now >= state.day.resetAt) {
    state.day = { count: 0, resetAt: now + 86400000 };
  }

  const minuteRemaining = Math.max(0, limits.requestsPerMinute - state.minute.count);
  const dayRemaining = Math.max(0, limits.requestsPerDay - state.day.count);

  // Check if over limit
  if (state.minute.count >= limits.requestsPerMinute) {
    return {
      allowed: false,
      minuteRemaining: 0,
      dayRemaining,
      resetAt: state.minute.resetAt,
    };
  }

  if (state.day.count >= limits.requestsPerDay) {
    return {
      allowed: false,
      minuteRemaining,
      dayRemaining: 0,
      resetAt: state.day.resetAt,
    };
  }

  // Increment counters
  state.minute.count++;
  state.day.count++;

  return {
    allowed: true,
    minuteRemaining: minuteRemaining - 1,
    dayRemaining: dayRemaining - 1,
    resetAt: state.minute.resetAt,
  };
}

// ============================================================================
// Response Helpers
// ============================================================================

function rateLimitExceededResponse(
  resetAt: number,
  limit: number,
  isMinuteLimit: boolean
): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: isMinuteLimit
          ? `Rate limit exceeded. You can make ${limit} requests per minute. Try again in ${retryAfter} seconds.`
          : `Daily rate limit exceeded. You can make ${limit} requests per day. Limit resets at ${new Date(resetAt).toISOString()}.`,
        retryAfter,
      },
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  resetAt: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());
  return response;
}

// ============================================================================
// Middleware
// ============================================================================

export interface RateLimitedHandler {
  (request: NextRequest, context: AuthContext): Promise<NextResponse>;
}

/**
 * Wrap a handler with rate limiting
 * Must be used after withAuth middleware
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   return withAuth(request, async (req, ctx) => {
 *     return withRateLimit(req, ctx, async (req, ctx) => {
 *       // Handler logic here
 *       return NextResponse.json({ success: true });
 *     });
 *   });
 * }
 * ```
 */
export async function withRateLimit(
  request: NextRequest,
  context: AuthContext,
  handler: RateLimitedHandler
): Promise<NextResponse> {
  const { apiKey } = context;

  // Get limits for this tier (use custom rateLimit if set, otherwise tier default)
  const tierLimits = TIER_LIMITS[apiKey.tier];
  const limits: RateLimitConfig = {
    requestsPerMinute: apiKey.rateLimit || tierLimits.requestsPerMinute,
    requestsPerDay: tierLimits.requestsPerDay,
  };

  // Get or create rate limit state
  const state = getOrCreateState(apiKey.id);

  // Check rate limit
  const result = checkAndUpdateLimit(state, limits);

  if (!result.allowed) {
    const isMinuteLimit = result.minuteRemaining === 0;
    return rateLimitExceededResponse(
      result.resetAt,
      isMinuteLimit ? limits.requestsPerMinute : limits.requestsPerDay,
      isMinuteLimit
    );
  }

  // Execute handler
  const response = await handler(request, context);

  // Add rate limit headers to response
  return addRateLimitHeaders(
    response,
    limits.requestsPerMinute,
    result.minuteRemaining,
    result.resetAt
  );
}

/**
 * Combined auth + rate limit middleware
 * Convenience function that applies both middlewares
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   return withAuthAndRateLimit(request, async (req, ctx) => {
 *     return NextResponse.json({ success: true });
 *   });
 * }
 * ```
 */
export async function withAuthAndRateLimit(
  request: NextRequest,
  handler: RateLimitedHandler,
  options?: {
    requiredPermission?: 'read' | 'write';
  }
): Promise<NextResponse> {
  // Import here to avoid circular dependency
  const { withAuth } = await import('./auth');

  return withAuth(request, async (req, ctx) => {
    return withRateLimit(req, ctx, handler);
  }, options);
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get current rate limit state for an API key (for debugging/monitoring)
 */
export function getRateLimitState(apiKeyId: string): RateLimitState | null {
  return rateLimitStore.get(apiKeyId) || null;
}

/**
 * Reset rate limit for an API key (admin use)
 */
export function resetRateLimit(apiKeyId: string): void {
  rateLimitStore.delete(apiKeyId);
}

/**
 * Get tier limits configuration
 */
export function getTierLimits(tier: ApiKeyTier): RateLimitConfig {
  return TIER_LIMITS[tier];
}
