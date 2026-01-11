/**
 * Casper Accelerate SDK - HTTP Client
 * @package @accelerate/sdk
 */

import type { SDKConfig, RateLimitInfo } from './types';
import {
  AccelerateError,
  NetworkError,
  TimeoutError,
  ConnectionError,
  RateLimitError,
  AuthenticationError,
  parseApiError,
} from './errors';

export const SDK_VERSION = '1.0.0';

const DEFAULT_BASE_URL = 'https://accelerate.casper.network';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: unknown;
  params?: Record<string, string | number | undefined>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  // Direct response fields (some endpoints return data directly)
  [key: string]: unknown;
}

export class AccelerateClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly retryDelay: number;

  private lastRateLimitInfo: RateLimitInfo | null = null;

  constructor(config: SDKConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.retries = config.retries ?? DEFAULT_RETRIES;
    this.retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY;
  }

  /**
   * Get the last rate limit info from the most recent request
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.lastRateLimitInfo;
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, data, params } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-SDK-Version': SDK_VERSION,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });

        // Parse rate limit headers
        this.parseRateLimitHeaders(response.headers);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
          throw new RateLimitError('Rate limit exceeded', retryAfter);
        }

        const json = (await response.json()) as ApiResponse<T>;

        if (!response.ok) {
          throw parseApiError(response.status, json);
        }

        // Handle different response formats
        if (json.success === false) {
          throw parseApiError(response.status, json);
        }

        // Return the data or the entire response if no data field
        return (json.data ?? json) as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on these errors
        if (
          error instanceof AuthenticationError ||
          error instanceof RateLimitError
        ) {
          throw error;
        }

        // Don't retry on 4xx errors (except rate limit which is handled above)
        if (error instanceof AccelerateError && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retries - 1) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed
    if (lastError instanceof AccelerateError) {
      throw lastError;
    }

    throw new NetworkError(lastError?.message || 'Request failed after retries');
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(`Request timed out after ${this.timeout}ms`, this.timeout);
        }
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new ConnectionError(error.message);
        }
      }
      throw new NetworkError((error as Error)?.message || 'Network request failed');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse rate limit headers from response
   */
  private parseRateLimitHeaders(headers: Headers): void {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const dailyLimit = headers.get('X-RateLimit-Daily-Limit');
    const dailyRemaining = headers.get('X-RateLimit-Daily-Remaining');

    if (limit && remaining && reset) {
      this.lastRateLimitInfo = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        dailyLimit: dailyLimit ? parseInt(dailyLimit, 10) : undefined,
        dailyRemaining: dailyRemaining ? parseInt(dailyRemaining, 10) : undefined,
      };
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // =========================================================================
  // Convenience methods
  // =========================================================================

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return this.request<T>({ method: 'GET', path, params });
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, data });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, data });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }
}
