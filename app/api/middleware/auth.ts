/**
 * API Key Authentication Middleware
 * Validates X-API-Key header and attaches auth context to requests
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/services/db';
import type { ApiKeyTier } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface AuthContext {
  apiKey: {
    id: string;
    tier: ApiKeyTier;
    permissions: string[];
    rateLimit: number;
    ownerId: string | null;
  };
}

export interface AuthenticatedHandler {
  (request: NextRequest, context: AuthContext): Promise<NextResponse>;
}

// ============================================================================
// Error Responses
// ============================================================================

function missingApiKeyResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required. Include X-API-Key header in your request.',
      },
    },
    { status: 401 }
  );
}

function invalidApiKeyResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key. Please check your API key and try again.',
      },
    },
    { status: 401 }
  );
}

function disabledApiKeyResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'DISABLED_API_KEY',
        message: 'This API key has been disabled. Contact support for assistance.',
      },
    },
    { status: 401 }
  );
}

function expiredApiKeyResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'EXPIRED_API_KEY',
        message: 'This API key has expired. Please generate a new key.',
      },
    },
    { status: 401 }
  );
}

function insufficientPermissionsResponse(required: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `This operation requires '${required}' permission.`,
      },
    },
    { status: 403 }
  );
}

// ============================================================================
// Hash Function
// ============================================================================

/**
 * Hash an API key for storage/lookup
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// ============================================================================
// Authentication Middleware
// ============================================================================

/**
 * Wrap a handler with API key authentication
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   return withAuth(request, async (req, ctx) => {
 *     // ctx.apiKey contains validated API key info
 *     return NextResponse.json({ success: true });
 *   });
 * }
 * ```
 */
export async function withAuth(
  request: NextRequest,
  handler: AuthenticatedHandler,
  options?: {
    requiredPermission?: 'read' | 'write';
  }
): Promise<NextResponse> {
  // Get API key from header
  const apiKeyHeader = request.headers.get('X-API-Key');

  if (!apiKeyHeader) {
    return missingApiKeyResponse();
  }

  // Hash the key for lookup
  const keyHash = hashApiKey(apiKeyHeader);

  try {
    // Look up API key
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: keyHash },
    });

    if (!apiKey) {
      return invalidApiKeyResponse();
    }

    // Check if active
    if (!apiKey.isActive) {
      return disabledApiKeyResponse();
    }

    // Check expiry
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return expiredApiKeyResponse();
    }

    // Check permissions
    const requiredPerm = options?.requiredPermission;
    if (requiredPerm && !apiKey.permissions.includes(requiredPerm)) {
      return insufficientPermissionsResponse(requiredPerm);
    }

    // Update usage stats (async, don't wait)
    prisma.apiKey
      .update({
        where: { id: apiKey.id },
        data: {
          lastRequestAt: new Date(),
          requestCount: { increment: 1 },
        },
      })
      .catch(() => {
        // Ignore errors - usage tracking is best-effort
      });

    // Build auth context
    const context: AuthContext = {
      apiKey: {
        id: apiKey.id,
        tier: apiKey.tier,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        ownerId: apiKey.ownerId,
      },
    };

    // Call the handler
    return handler(request, context);
  } catch (error) {
    console.error('[Auth] Error validating API key:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication failed. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Optional authentication - validates API key if present, but allows requests without
 * Useful for endpoints that have both public and authenticated modes
 */
export async function withOptionalAuth(
  request: NextRequest,
  handler: (request: NextRequest, context: AuthContext | null) => Promise<NextResponse>
): Promise<NextResponse> {
  const apiKeyHeader = request.headers.get('X-API-Key');

  // No API key - proceed without auth context
  if (!apiKeyHeader) {
    return handler(request, null);
  }

  // Has API key - validate it
  const keyHash = hashApiKey(apiKeyHeader);

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: keyHash },
    });

    if (!apiKey || !apiKey.isActive) {
      return handler(request, null);
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return handler(request, null);
    }

    const context: AuthContext = {
      apiKey: {
        id: apiKey.id,
        tier: apiKey.tier,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        ownerId: apiKey.ownerId,
      },
    };

    return handler(request, context);
  } catch {
    return handler(request, null);
  }
}

/**
 * Check if a raw API key is valid (before hashing)
 * Used by SSE endpoint which gets key from query param
 */
export async function validateApiKey(rawKey: string): Promise<AuthContext | null> {
  if (!rawKey) return null;

  const keyHash = hashApiKey(rawKey);

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: keyHash },
    });

    if (!apiKey || !apiKey.isActive) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

    return {
      apiKey: {
        id: apiKey.id,
        tier: apiKey.tier,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        ownerId: apiKey.ownerId,
      },
    };
  } catch {
    return null;
  }
}
