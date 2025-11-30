// Observability Service for Casper Accelerate
// Provides metrics, health checks, and logging utilities

import { CasperService } from './casperService';

// Metrics types
export interface SequencerMetrics {
    totalBatches: number;
    totalTransactions: number;
    totalProofsGenerated: number;
    avgProofTimeMs: number;
    avgBatchSize: number;
    l1SubmissionsAttempted: number;
    l1SubmissionsSucceeded: number;
    l1SubmissionFailures: number;
    uptime: number; // milliseconds
}

export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    rpcConnected: boolean;
    contractConfigured: boolean;
    proverReady: boolean;
    lastHealthCheck: number;
    checks: HealthCheck[];
}

export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    latencyMs?: number;
}

export interface LogEntry {
    timestamp: number;
    level: 'debug' | 'info' | 'warn' | 'error';
    component: string;
    message: string;
    data?: any;
}

class ObservabilityService {
    private startTime: number;
    private logs: LogEntry[] = [];
    private maxLogs = 1000;
    private metrics: SequencerMetrics = {
        totalBatches: 0,
        totalTransactions: 0,
        totalProofsGenerated: 0,
        avgProofTimeMs: 0,
        avgBatchSize: 0,
        l1SubmissionsAttempted: 0,
        l1SubmissionsSucceeded: 0,
        l1SubmissionFailures: 0,
        uptime: 0
    };
    private proofTimes: number[] = [];
    private batchSizes: number[] = [];
    private healthCheckInterval: NodeJS.Timeout | null = null;
    private lastHealth: SystemHealth | null = null;

    constructor() {
        this.startTime = Date.now();
        this.log('info', 'Observability', 'Service initialized');
    }

    /**
     * Log a message with structured data
     */
    log(level: LogEntry['level'], component: string, message: string, data?: any) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            component,
            message,
            data
        };

        this.logs.push(entry);

        // Trim logs if exceeding max
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Also output to console with formatting
        const prefix = `[${new Date(entry.timestamp).toISOString()}] [${level.toUpperCase()}] [${component}]`;
        switch (level) {
            case 'error':
                console.error(prefix, message, data || '');
                break;
            case 'warn':
                console.warn(prefix, message, data || '');
                break;
            case 'debug':
                if (process.env.NODE_ENV === 'development') {
                    console.debug(prefix, message, data || '');
                }
                break;
            default:
                console.log(prefix, message, data || '');
        }
    }

    /**
     * Record a batch processing event
     */
    recordBatchProcessed(batchSize: number) {
        this.metrics.totalBatches++;
        this.metrics.totalTransactions += batchSize;
        this.batchSizes.push(batchSize);
        this.metrics.avgBatchSize = this.batchSizes.reduce((a, b) => a + b, 0) / this.batchSizes.length;

        this.log('info', 'Sequencer', `Batch processed: ${batchSize} transactions`, {
            totalBatches: this.metrics.totalBatches,
            avgBatchSize: this.metrics.avgBatchSize.toFixed(2)
        });
    }

    /**
     * Record proof generation event
     */
    recordProofGenerated(generationTimeMs: number) {
        this.metrics.totalProofsGenerated++;
        this.proofTimes.push(generationTimeMs);
        this.metrics.avgProofTimeMs = this.proofTimes.reduce((a, b) => a + b, 0) / this.proofTimes.length;

        this.log('info', 'Prover', `Proof generated in ${generationTimeMs}ms`, {
            totalProofs: this.metrics.totalProofsGenerated,
            avgTime: this.metrics.avgProofTimeMs.toFixed(2)
        });
    }

    /**
     * Record L1 submission attempt
     */
    recordL1Submission(success: boolean, error?: string) {
        this.metrics.l1SubmissionsAttempted++;
        if (success) {
            this.metrics.l1SubmissionsSucceeded++;
            this.log('info', 'L1Bridge', 'L1 submission succeeded');
        } else {
            this.metrics.l1SubmissionFailures++;
            this.log('error', 'L1Bridge', 'L1 submission failed', { error });
        }
    }

    /**
     * Get current metrics
     */
    getMetrics(): SequencerMetrics {
        return {
            ...this.metrics,
            uptime: Date.now() - this.startTime
        };
    }

    /**
     * Get recent logs
     */
    getLogs(limit = 100, level?: LogEntry['level']): LogEntry[] {
        let filteredLogs = this.logs;
        if (level) {
            filteredLogs = this.logs.filter(l => l.level === level);
        }
        return filteredLogs.slice(-limit);
    }

    /**
     * Run health checks
     */
    async checkHealth(): Promise<SystemHealth> {
        const checks: HealthCheck[] = [];

        // 1. RPC Health Check
        const rpcStart = Date.now();
        try {
            const stateRoot = await CasperService.getStateRoot();
            checks.push({
                name: 'RPC Connectivity',
                status: stateRoot ? 'pass' : 'warn',
                message: stateRoot ? `Connected, state root: ${stateRoot.substring(0, 16)}...` : 'No state root returned',
                latencyMs: Date.now() - rpcStart
            });
        } catch (error) {
            checks.push({
                name: 'RPC Connectivity',
                status: 'fail',
                message: error instanceof Error ? error.message : 'Unknown error',
                latencyMs: Date.now() - rpcStart
            });
        }

        // 2. Contract Configuration Check
        const config = CasperService.getContractConfig();
        checks.push({
            name: 'Contract Configuration',
            status: config.isConfigured ? 'pass' : 'warn',
            message: config.isDemoMode ? 'Running in DEMO mode (Hello World contract)' : `Contract: ${config.contractHash}`
        });

        // 3. Prover Status Check
        const proverReady = this.metrics.totalProofsGenerated > 0 || this.metrics.totalBatches === 0;
        checks.push({
            name: 'Prover Service',
            status: proverReady ? 'pass' : 'warn',
            message: proverReady ? `${this.metrics.totalProofsGenerated} proofs generated` : 'No proofs generated yet'
        });

        // 4. Sequencer Throughput Check
        const avgBatchTime = this.metrics.totalBatches > 0
            ? (Date.now() - this.startTime) / this.metrics.totalBatches
            : 0;
        checks.push({
            name: 'Sequencer Throughput',
            status: 'pass',
            message: `${this.metrics.totalBatches} batches, ${this.metrics.totalTransactions} txs, avg ${(avgBatchTime / 1000).toFixed(1)}s/batch`
        });

        // 5. L1 Submission Success Rate
        const successRate = this.metrics.l1SubmissionsAttempted > 0
            ? (this.metrics.l1SubmissionsSucceeded / this.metrics.l1SubmissionsAttempted) * 100
            : 100;
        checks.push({
            name: 'L1 Submission Rate',
            status: successRate >= 90 ? 'pass' : successRate >= 50 ? 'warn' : 'fail',
            message: `${successRate.toFixed(1)}% success (${this.metrics.l1SubmissionsSucceeded}/${this.metrics.l1SubmissionsAttempted})`
        });

        // Determine overall status
        const hasFailure = checks.some(c => c.status === 'fail');
        const hasWarning = checks.some(c => c.status === 'warn');
        const overallStatus: SystemHealth['status'] = hasFailure ? 'unhealthy' : hasWarning ? 'degraded' : 'healthy';

        this.lastHealth = {
            status: overallStatus,
            rpcConnected: checks.find(c => c.name === 'RPC Connectivity')?.status === 'pass',
            contractConfigured: config.isConfigured,
            proverReady,
            lastHealthCheck: Date.now(),
            checks
        };

        this.log(
            overallStatus === 'healthy' ? 'info' : overallStatus === 'degraded' ? 'warn' : 'error',
            'Health',
            `System status: ${overallStatus}`,
            { checks: checks.map(c => ({ name: c.name, status: c.status })) }
        );

        return this.lastHealth;
    }

    /**
     * Get last health check result (cached)
     */
    getLastHealth(): SystemHealth | null {
        return this.lastHealth;
    }

    /**
     * Start periodic health checks
     */
    startHealthChecks(intervalMs = 30000) {
        if (this.healthCheckInterval) return;

        this.log('info', 'Health', `Starting health checks every ${intervalMs / 1000}s`);
        this.checkHealth(); // Initial check

        this.healthCheckInterval = setInterval(() => {
            this.checkHealth();
        }, intervalMs);
    }

    /**
     * Stop health checks
     */
    stopHealthChecks() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
            this.log('info', 'Health', 'Health checks stopped');
        }
    }

    /**
     * Get formatted uptime string
     */
    getUptimeString(): string {
        const uptime = Date.now() - this.startTime;
        const hours = Math.floor(uptime / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    /**
     * Export metrics in Prometheus format
     */
    getPrometheusMetrics(): string {
        const m = this.getMetrics();
        return [
            '# HELP casper_accelerate_batches_total Total number of batches processed',
            '# TYPE casper_accelerate_batches_total counter',
            `casper_accelerate_batches_total ${m.totalBatches}`,
            '',
            '# HELP casper_accelerate_transactions_total Total number of transactions',
            '# TYPE casper_accelerate_transactions_total counter',
            `casper_accelerate_transactions_total ${m.totalTransactions}`,
            '',
            '# HELP casper_accelerate_proofs_total Total number of proofs generated',
            '# TYPE casper_accelerate_proofs_total counter',
            `casper_accelerate_proofs_total ${m.totalProofsGenerated}`,
            '',
            '# HELP casper_accelerate_proof_time_avg_ms Average proof generation time',
            '# TYPE casper_accelerate_proof_time_avg_ms gauge',
            `casper_accelerate_proof_time_avg_ms ${m.avgProofTimeMs.toFixed(2)}`,
            '',
            '# HELP casper_accelerate_l1_submissions_total L1 submission attempts',
            '# TYPE casper_accelerate_l1_submissions_total counter',
            `casper_accelerate_l1_submissions_total{result="success"} ${m.l1SubmissionsSucceeded}`,
            `casper_accelerate_l1_submissions_total{result="failure"} ${m.l1SubmissionFailures}`,
            '',
            '# HELP casper_accelerate_uptime_seconds System uptime in seconds',
            '# TYPE casper_accelerate_uptime_seconds gauge',
            `casper_accelerate_uptime_seconds ${(m.uptime / 1000).toFixed(0)}`
        ].join('\n');
    }
}

// Singleton instance
export const observability = new ObservabilityService();
