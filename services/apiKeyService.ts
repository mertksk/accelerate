/**
 * API Key Service
 * Manages API key generation, validation, and lifecycle
 */

import crypto from 'crypto';
import { prisma } from './db';
import type { ApiKey, ApiKeyTier } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface CreateApiKeyParams {
  name: string;
  tier?: ApiKeyTier;
  ownerId?: string;
  ownerEmail?: string;
  permissions?: string[];
  rateLimit?: number;
  expiresAt?: Date;
}

export interface CreateApiKeyResult {
  apiKey: ApiKey;
  rawKey: string; // Only returned once at creation time
}

export interface ApiKeyStats {
  totalKeys: number;
  activeKeys: number;
  keysByTier: Record<ApiKeyTier, number>;
  totalRequests: bigint;
}

// ============================================================================
// Constants
// ============================================================================

const KEY_PREFIX_MAP: Record<string, string> = {
  production: 'acc_live_sk_',
  development: 'acc_test_sk_',
  test: 'acc_test_sk_',
};

const DEFAULT_PERMISSIONS = ['read', 'write'];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Get the key prefix based on environment
 */
function getKeyPrefix(): string {
  const env = process.env.NODE_ENV || 'development';
  return KEY_PREFIX_MAP[env] || KEY_PREFIX_MAP.development;
}

// ============================================================================
// API Key Service
// ============================================================================

export const apiKeyService = {
  /**
   * Generate a new API key
   * Returns both the hashed key (stored) and raw key (shown once)
   */
  async create(params: CreateApiKeyParams): Promise<CreateApiKeyResult> {
    const prefix = getKeyPrefix();
    const randomPart = generateRandomString(32);
    const rawKey = `${prefix}${randomPart}`;
    const hashedKey = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        key: hashedKey,
        keyPrefix: prefix,
        name: params.name,
        tier: params.tier || 'FREE',
        ownerId: params.ownerId,
        ownerEmail: params.ownerEmail,
        permissions: params.permissions || DEFAULT_PERMISSIONS,
        rateLimit: params.rateLimit || 60,
        expiresAt: params.expiresAt,
        isActive: true,
      },
    });

    return {
      apiKey,
      rawKey, // This is the only time the raw key is available
    };
  },

  /**
   * Get API key by ID
   */
  async getById(id: string): Promise<ApiKey | null> {
    return prisma.apiKey.findUnique({
      where: { id },
    });
  },

  /**
   * Validate a raw API key and return the key record if valid
   */
  async validate(rawKey: string): Promise<ApiKey | null> {
    if (!rawKey) return null;

    const hashedKey = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hashedKey },
    });

    if (!apiKey) return null;

    // Check if active
    if (!apiKey.isActive) return null;

    // Check expiry
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    return apiKey;
  },

  /**
   * Revoke (disable) an API key
   */
  async revoke(id: string): Promise<ApiKey> {
    return prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  },

  /**
   * Reactivate a disabled API key
   */
  async activate(id: string): Promise<ApiKey> {
    return prisma.apiKey.update({
      where: { id },
      data: { isActive: true },
    });
  },

  /**
   * Update API key settings
   */
  async update(
    id: string,
    data: {
      name?: string;
      tier?: ApiKeyTier;
      permissions?: string[];
      rateLimit?: number;
      expiresAt?: Date | null;
    }
  ): Promise<ApiKey> {
    return prisma.apiKey.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete an API key permanently
   */
  async delete(id: string): Promise<void> {
    await prisma.apiKey.delete({
      where: { id },
    });
  },

  /**
   * List API keys with filtering
   */
  async list(options?: {
    ownerId?: string;
    tier?: ApiKeyTier;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ keys: ApiKey[]; total: number }> {
    const where: { ownerId?: string; tier?: ApiKeyTier; isActive?: boolean } = {};

    if (options?.ownerId) where.ownerId = options.ownerId;
    if (options?.tier) where.tier = options.tier;
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    const [keys, total] = await Promise.all([
      prisma.apiKey.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.apiKey.count({ where }),
    ]);

    return { keys, total };
  },

  /**
   * Record API key usage
   */
  async recordUsage(
    apiKeyId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseMs: number
  ): Promise<void> {
    await prisma.apiKeyUsage.create({
      data: {
        apiKeyId,
        endpoint,
        method,
        statusCode,
        responseMs,
      },
    });
  },

  /**
   * Get usage statistics for an API key
   */
  async getUsage(
    apiKeyId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<{
    totalRequests: number;
    avgResponseMs: number;
    recentRequests: Array<{
      endpoint: string;
      method: string;
      statusCode: number;
      responseMs: number;
      timestamp: Date;
    }>;
  }> {
    const where: { apiKeyId: string; timestamp?: { gte?: Date; lte?: Date } } = {
      apiKeyId,
    };

    if (options?.startDate || options?.endDate) {
      where.timestamp = {};
      if (options.startDate) where.timestamp.gte = options.startDate;
      if (options.endDate) where.timestamp.lte = options.endDate;
    }

    const [usage, recent, aggregate] = await Promise.all([
      prisma.apiKeyUsage.count({ where }),
      prisma.apiKeyUsage.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: options?.limit || 100,
        select: {
          endpoint: true,
          method: true,
          statusCode: true,
          responseMs: true,
          timestamp: true,
        },
      }),
      prisma.apiKeyUsage.aggregate({
        where,
        _avg: { responseMs: true },
      }),
    ]);

    return {
      totalRequests: usage,
      avgResponseMs: aggregate._avg.responseMs || 0,
      recentRequests: recent,
    };
  },

  /**
   * Get overall API key statistics
   */
  async getStats(): Promise<ApiKeyStats> {
    const [total, active, byTier, requests] = await Promise.all([
      prisma.apiKey.count(),
      prisma.apiKey.count({ where: { isActive: true } }),
      prisma.apiKey.groupBy({
        by: ['tier'],
        _count: true,
      }),
      prisma.apiKey.aggregate({
        _sum: { requestCount: true },
      }),
    ]);

    const keysByTier: Record<ApiKeyTier, number> = {
      FREE: 0,
      STARTER: 0,
      PRO: 0,
      ENTERPRISE: 0,
    };

    for (const group of byTier) {
      keysByTier[group.tier] = group._count;
    }

    return {
      totalKeys: total,
      activeKeys: active,
      keysByTier,
      totalRequests: requests._sum.requestCount || BigInt(0),
    };
  },

  /**
   * Rotate an API key (create new, revoke old)
   */
  async rotate(id: string): Promise<CreateApiKeyResult> {
    const oldKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!oldKey) {
      throw new Error('API key not found');
    }

    // Create new key with same settings
    const result = await this.create({
      name: `${oldKey.name} (rotated)`,
      tier: oldKey.tier,
      ownerId: oldKey.ownerId || undefined,
      ownerEmail: oldKey.ownerEmail || undefined,
      permissions: oldKey.permissions,
      rateLimit: oldKey.rateLimit,
      expiresAt: oldKey.expiresAt || undefined,
    });

    // Revoke old key
    await this.revoke(id);

    return result;
  },

  /**
   * Check if a raw API key has a specific permission
   */
  async hasPermission(rawKey: string, permission: string): Promise<boolean> {
    const apiKey = await this.validate(rawKey);
    if (!apiKey) return false;
    return apiKey.permissions.includes(permission);
  },

  /**
   * Clean up expired API keys
   */
  async cleanupExpired(): Promise<number> {
    const result = await prisma.apiKey.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true,
      },
      data: { isActive: false },
    });

    return result.count;
  },
};

export default apiKeyService;
