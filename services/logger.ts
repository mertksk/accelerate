// Logger utility for Casper Accelerate
// In production, logs are suppressed. In development, they are shown.

const isDev = process.env.NODE_ENV === 'development';

// Debug logger - only logs in development
export const debug = isDev
  ? (...args: unknown[]) => console.log(...args)
  : () => {};

// Info logger - always logs (important info)
export const info = (...args: unknown[]) => console.log(...args);

// Warning logger - always logs
export const warn = (...args: unknown[]) => console.warn(...args);

// Error logger - always logs
export const error = (...args: unknown[]) => console.error(...args);

// Service-specific debug loggers
export const createServiceLogger = (serviceName: string) => ({
  debug: isDev
    ? (...args: unknown[]) => console.log(`[${serviceName}]`, ...args)
    : () => {},
  info: (...args: unknown[]) => console.log(`[${serviceName}]`, ...args),
  warn: (...args: unknown[]) => console.warn(`[${serviceName}]`, ...args),
  error: (...args: unknown[]) => console.error(`[${serviceName}]`, ...args),
});

// Pre-configured service loggers
export const casperLogger = createServiceLogger('CasperService');
export const sequencerLogger = createServiceLogger('Sequencer');
export const proverLogger = createServiceLogger('RobustProver');
export const dashboardLogger = createServiceLogger('Dashboard');
