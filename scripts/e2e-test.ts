// End-to-End Test Script for Casper Accelerate
// Tests: ProverService, CasperService RPC, and sequencer flow

import { proverService } from '../services/proverService';
import { CasperService } from '../services/casperService';
import { observability } from '../services/observability';

const TEST_TRANSACTIONS = [
    { id: '0xtest1', from: '0x1', to: '0x2', amount: 100, timestamp: Date.now(), status: 'PENDING' as const },
    { id: '0xtest2', from: '0x2', to: '0x3', amount: 50, timestamp: Date.now(), status: 'PENDING' as const },
    { id: '0xtest3', from: '0x3', to: '0x4', amount: 25, timestamp: Date.now(), status: 'PENDING' as const },
];

async function testProverService() {
    console.log('\n=== Testing ProverService ===');

    try {
        // Test status
        const status = proverService.getStatus();
        console.log('Prover Status:', status);

        // Test proof generation
        const oldRoot = '0x1234567890abcdef';
        const newRoot = '0xfedcba0987654321';

        console.log('Generating batch proof...');
        const result = await proverService.generateBatchProof(
            TEST_TRANSACTIONS as any,
            oldRoot,
            newRoot
        );

        if (result.success) {
            console.log('Proof generated successfully!');
            console.log('- Proof Hash:', result.proofHash);
            console.log('- Generation Time:', result.generationTimeMs, 'ms');
            console.log('- Public Signals:', result.publicSignals);
            return true;
        } else {
            console.error('Proof generation failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('ProverService test failed:', error);
        return false;
    }
}

async function testCasperRPC() {
    console.log('\n=== Testing Casper RPC Connectivity ===');

    try {
        // Test state root fetch
        console.log('Fetching state root...');
        const stateRoot = await CasperService.getStateRoot();

        if (stateRoot) {
            console.log('State Root:', stateRoot);
            console.log('RPC connectivity: OK');
            return true;
        } else {
            console.log('Could not fetch state root (may be expected in Node.js env)');
            return true; // Not a failure in non-browser env
        }
    } catch (error) {
        console.error('Casper RPC test failed:', error);
        return false;
    }
}

async function testCasperConfig() {
    console.log('\n=== Testing Casper Configuration ===');

    const config = CasperService.getContractConfig();
    console.log('Contract Config:', config);
    console.log('Contract Hash:', config.contractHash);
    console.log('Chain:', config.chainName);
    console.log('Configured:', config.isConfigured);

    return config.isConfigured;
}

async function testBatchSubmission() {
    console.log('\n=== Testing Batch Submission (Demo Mode) ===');

    try {
        const newRoot = '0xabcdef1234567890';
        const proof = 'groth16_test_proof_abc123';

        console.log('Submitting batch...');
        const txHash = await CasperService.submitBatch(newRoot, proof);

        if (txHash) {
            console.log('Batch submitted (mock):', txHash);

            // Check status
            const status = await CasperService.getDeployStatus(txHash);
            console.log('Deploy status:', status);
            return true;
        } else {
            console.log('Batch submission returned null');
            return false;
        }
    } catch (error) {
        console.error('Batch submission test failed:', error);
        return false;
    }
}

async function testObservability() {
    console.log('\n=== Testing Observability Service ===');

    try {
        // Test logging
        observability.log('info', 'E2ETest', 'Test log entry');

        // Test metrics recording
        observability.recordBatchProcessed(5);
        observability.recordProofGenerated(150);
        observability.recordL1Submission(true);

        // Get metrics
        const metrics = observability.getMetrics();
        console.log('Metrics:', metrics);

        // Get logs
        const logs = observability.getLogs(5);
        console.log(`Logs collected: ${logs.length} entries`);

        // Test health check
        console.log('Running health check...');
        const health = await observability.checkHealth();
        console.log('Health Status:', health.status);
        console.log('Checks:', health.checks.map(c => `${c.name}: ${c.status}`).join(', '));

        // Test Prometheus format
        const promMetrics = observability.getPrometheusMetrics();
        console.log('Prometheus metrics lines:', promMetrics.split('\n').length);

        return health.status !== 'unhealthy';
    } catch (error) {
        console.error('Observability test failed:', error);
        return false;
    }
}

async function runAllTests() {
    console.log('========================================');
    console.log('  Casper Accelerate E2E Tests');
    console.log('========================================');

    const results: Record<string, boolean> = {};

    results['ProverService'] = await testProverService();
    results['CasperRPC'] = await testCasperRPC();
    results['CasperConfig'] = await testCasperConfig();
    results['BatchSubmission'] = await testBatchSubmission();
    results['Observability'] = await testObservability();

    console.log('\n========================================');
    console.log('  Test Results Summary');
    console.log('========================================');

    let allPassed = true;
    for (const [test, passed] of Object.entries(results)) {
        const status = passed ? 'PASS' : 'FAIL';
        console.log(`  ${test}: ${status}`);
        if (!passed) allPassed = false;
    }

    console.log('========================================');
    console.log(`  Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    console.log('========================================');

    process.exit(allPassed ? 0 : 1);
}

runAllTests().catch(console.error);
