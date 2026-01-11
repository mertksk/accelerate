/**
 * Casper Accelerate SDK - Error Classes
 * @package @accelerate/sdk
 */

// ============================================================================
// Base Error
// ============================================================================

export class AccelerateError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'ACCELERATE_ERROR',
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AccelerateError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// ============================================================================
// Authentication Errors (401)
// ============================================================================

export class AuthenticationError extends AccelerateError {
  constructor(message: string = 'Authentication failed', code: string = 'AUTH_ERROR') {
    super(message, code, 401);
    this.name = 'AuthenticationError';
  }
}

export class InvalidApiKeyError extends AuthenticationError {
  constructor(message: string = 'Invalid API key') {
    super(message, 'INVALID_API_KEY');
    this.name = 'InvalidApiKeyError';
  }
}

export class ExpiredApiKeyError extends AuthenticationError {
  constructor(message: string = 'API key has expired') {
    super(message, 'EXPIRED_API_KEY');
    this.name = 'ExpiredApiKeyError';
  }
}

export class MissingApiKeyError extends AuthenticationError {
  constructor(message: string = 'API key is required') {
    super(message, 'MISSING_API_KEY');
    this.name = 'MissingApiKeyError';
  }
}

export class DisabledApiKeyError extends AuthenticationError {
  constructor(message: string = 'API key has been disabled') {
    super(message, 'DISABLED_API_KEY');
    this.name = 'DisabledApiKeyError';
  }
}

// ============================================================================
// Authorization Errors (403)
// ============================================================================

export class AuthorizationError extends AccelerateError {
  constructor(message: string = 'Access denied', code: string = 'AUTHZ_ERROR') {
    super(message, code, 403);
    this.name = 'AuthorizationError';
  }
}

export class InsufficientPermissionsError extends AuthorizationError {
  constructor(message: string = 'Insufficient permissions for this operation') {
    super(message, 'INSUFFICIENT_PERMISSIONS');
    this.name = 'InsufficientPermissionsError';
  }
}

// ============================================================================
// Rate Limit Errors (429)
// ============================================================================

export class RateLimitError extends AccelerateError {
  public readonly retryAfter: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter: number = 60) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, { retryAfter });
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// Validation Errors (400)
// ============================================================================

export class ValidationError extends AccelerateError {
  public readonly field?: string;

  constructor(
    message: string = 'Validation failed',
    code: string = 'VALIDATION_ERROR',
    field?: string
  ) {
    super(message, code, 400, field ? { field } : undefined);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class InvalidAddressError extends ValidationError {
  constructor(message: string = 'Invalid address format', field: string = 'address') {
    super(message, 'INVALID_ADDRESS', field);
    this.name = 'InvalidAddressError';
  }
}

export class InvalidAmountError extends ValidationError {
  constructor(message: string = 'Invalid amount', field: string = 'amount') {
    super(message, 'INVALID_AMOUNT', field);
    this.name = 'InvalidAmountError';
  }
}

export class InsufficientBalanceError extends ValidationError {
  public readonly available: string;
  public readonly required: string;

  constructor(
    message: string = 'Insufficient balance',
    available: string = '0',
    required: string = '0'
  ) {
    super(message, 'INSUFFICIENT_BALANCE');
    this.name = 'InsufficientBalanceError';
    this.available = available;
    this.required = required;
    this.details = { available, required };
  }
}

export class MissingFieldError extends ValidationError {
  constructor(field: string) {
    super(`Missing required field: ${field}`, 'MISSING_FIELD', field);
    this.name = 'MissingFieldError';
  }
}

// ============================================================================
// Not Found Errors (404)
// ============================================================================

export class NotFoundError extends AccelerateError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super(message, code, 404);
    this.name = 'NotFoundError';
  }
}

export class AccountNotFoundError extends NotFoundError {
  constructor(address?: string) {
    super(
      address ? `Account not found: ${address}` : 'Account not found',
      'ACCOUNT_NOT_FOUND'
    );
    this.name = 'AccountNotFoundError';
    if (address) {
      this.details = { address };
    }
  }
}

export class TransactionNotFoundError extends NotFoundError {
  constructor(txId?: string) {
    super(
      txId ? `Transaction not found: ${txId}` : 'Transaction not found',
      'TRANSACTION_NOT_FOUND'
    );
    this.name = 'TransactionNotFoundError';
    if (txId) {
      this.details = { txId };
    }
  }
}

export class BatchNotFoundError extends NotFoundError {
  constructor(batchId?: number) {
    super(
      batchId ? `Batch not found: ${batchId}` : 'Batch not found',
      'BATCH_NOT_FOUND'
    );
    this.name = 'BatchNotFoundError';
    if (batchId) {
      this.details = { batchId };
    }
  }
}

export class ProofJobNotFoundError extends NotFoundError {
  constructor(jobId?: string) {
    super(
      jobId ? `Proof job not found: ${jobId}` : 'Proof job not found',
      'PROOF_JOB_NOT_FOUND'
    );
    this.name = 'ProofJobNotFoundError';
    if (jobId) {
      this.details = { jobId };
    }
  }
}

// ============================================================================
// Server Errors (500)
// ============================================================================

export class ServerError extends AccelerateError {
  constructor(message: string = 'Internal server error', code: string = 'SERVER_ERROR') {
    super(message, code, 500);
    this.name = 'ServerError';
  }
}

export class DatabaseError extends ServerError {
  constructor(message: string = 'Database error') {
    super(message, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export class ProofGenerationError extends ServerError {
  constructor(message: string = 'Proof generation failed') {
    super(message, 'PROOF_GENERATION_ERROR');
    this.name = 'ProofGenerationError';
  }
}

export class SequencerError extends ServerError {
  constructor(message: string = 'Sequencer error') {
    super(message, 'SEQUENCER_ERROR');
    this.name = 'SequencerError';
  }
}

// ============================================================================
// Network Errors
// ============================================================================

export class NetworkError extends AccelerateError {
  constructor(message: string = 'Network error', code: string = 'NETWORK_ERROR') {
    super(message, code, 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends NetworkError {
  public readonly timeoutMs: number;

  constructor(message: string = 'Request timed out', timeoutMs: number = 30000) {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
    this.details = { timeoutMs };
  }
}

export class ConnectionError extends NetworkError {
  constructor(message: string = 'Connection failed') {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

// ============================================================================
// Error Parsing Utility
// ============================================================================

export function parseApiError(statusCode: number, response: { error?: { code?: string; message?: string; details?: Record<string, unknown> } }): AccelerateError {
  const code = response.error?.code || 'UNKNOWN_ERROR';
  const message = response.error?.message || 'An error occurred';
  const details = response.error?.details;

  switch (statusCode) {
    case 401:
      switch (code) {
        case 'INVALID_API_KEY':
          return new InvalidApiKeyError(message);
        case 'EXPIRED_API_KEY':
          return new ExpiredApiKeyError(message);
        case 'MISSING_API_KEY':
          return new MissingApiKeyError(message);
        case 'DISABLED_API_KEY':
          return new DisabledApiKeyError(message);
        default:
          return new AuthenticationError(message, code);
      }

    case 403:
      if (code === 'INSUFFICIENT_PERMISSIONS') {
        return new InsufficientPermissionsError(message);
      }
      return new AuthorizationError(message, code);

    case 404:
      switch (code) {
        case 'ACCOUNT_NOT_FOUND':
          return new AccountNotFoundError(details?.address as string);
        case 'TRANSACTION_NOT_FOUND':
          return new TransactionNotFoundError(details?.txId as string);
        case 'BATCH_NOT_FOUND':
          return new BatchNotFoundError(details?.batchId as number);
        case 'PROOF_JOB_NOT_FOUND':
          return new ProofJobNotFoundError(details?.jobId as string);
        default:
          return new NotFoundError(message, code);
      }

    case 429:
      const retryAfter = (details?.retryAfter as number) || 60;
      return new RateLimitError(message, retryAfter);

    case 400:
      switch (code) {
        case 'INVALID_ADDRESS':
          return new InvalidAddressError(message, details?.field as string);
        case 'INVALID_AMOUNT':
          return new InvalidAmountError(message, details?.field as string);
        case 'INSUFFICIENT_BALANCE':
          return new InsufficientBalanceError(
            message,
            details?.available as string,
            details?.required as string
          );
        case 'MISSING_FIELD':
          return new MissingFieldError(details?.field as string || 'unknown');
        default:
          return new ValidationError(message, code, details?.field as string);
      }

    default:
      if (statusCode >= 500) {
        switch (code) {
          case 'DATABASE_ERROR':
            return new DatabaseError(message);
          case 'PROOF_GENERATION_ERROR':
            return new ProofGenerationError(message);
          case 'SEQUENCER_ERROR':
            return new SequencerError(message);
          default:
            return new ServerError(message, code);
        }
      }
      return new AccelerateError(message, code, statusCode, details);
  }
}

// ============================================================================
// Type Guards
// ============================================================================

export function isAccelerateError(error: unknown): error is AccelerateError {
  return error instanceof AccelerateError;
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
