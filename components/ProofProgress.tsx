// Proof Progress Component for Casper Accelerate
import React from 'react';

interface ProofProgressProps {
  progress: number;
  progressMsg: string;
  status: string;
  batchId: number;
  startedAt?: string;
  estimatedTimeMs?: number;
}

export function ProofProgress({
  progress,
  progressMsg,
  status,
  batchId,
  startedAt,
  estimatedTimeMs,
}: ProofProgressProps) {
  // Calculate elapsed time
  const elapsedMs = startedAt
    ? Date.now() - new Date(startedAt).getTime()
    : 0;

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400';
      case 'FAILED':
        return 'text-red-400';
      case 'GENERATING_PROOF':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  // Get progress bar color
  const getProgressBarColor = () => {
    if (status === 'COMPLETED') return 'bg-green-500';
    if (status === 'FAILED') return 'bg-red-500';
    if (progress < 30) return 'bg-blue-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          Batch #{batchId} Proof Generation
        </span>
        <span className={`text-xs font-semibold ${getStatusColor()}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getProgressBarColor()}`}
          style={{ width: `${progress}%` }}
        />
        {status !== 'COMPLETED' && status !== 'FAILED' && (
          <div
            className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              animation: 'shimmer 2s infinite linear',
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </div>

      {/* Progress Details */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{progressMsg || 'Initializing...'}</span>
        <span>{progress}%</span>
      </div>

      {/* Time Info */}
      {(elapsedMs > 0 || estimatedTimeMs) && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          {elapsedMs > 0 && (
            <span>Elapsed: {formatTime(elapsedMs)}</span>
          )}
          {estimatedTimeMs && status !== 'COMPLETED' && (
            <span>Est. remaining: {formatTime(estimatedTimeMs)}</span>
          )}
        </div>
      )}

      {/* Stage Indicator */}
      <div className="flex items-center gap-2 mt-3">
        <StageIndicator
          label="Loading"
          isActive={status === 'LOADING_CIRCUIT'}
          isComplete={progress > 20}
        />
        <StageConnector isComplete={progress > 20} />
        <StageIndicator
          label="Witness"
          isActive={status === 'BUILDING_WITNESS'}
          isComplete={progress > 40}
        />
        <StageConnector isComplete={progress > 40} />
        <StageIndicator
          label="Proving"
          isActive={status === 'GENERATING_PROOF'}
          isComplete={status === 'COMPLETED'}
        />
        <StageConnector isComplete={status === 'COMPLETED'} />
        <StageIndicator
          label="Done"
          isActive={false}
          isComplete={status === 'COMPLETED'}
        />
      </div>
    </div>
  );
}

function StageIndicator({
  label,
  isActive,
  isComplete,
}: {
  label: string;
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-3 h-3 rounded-full transition-colors ${
          isComplete
            ? 'bg-green-500'
            : isActive
            ? 'bg-yellow-500 animate-pulse'
            : 'bg-gray-600'
        }`}
      />
      <span className="text-[10px] text-gray-500 mt-1">{label}</span>
    </div>
  );
}

function StageConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div
      className={`flex-1 h-0.5 transition-colors ${
        isComplete ? 'bg-green-500' : 'bg-gray-600'
      }`}
    />
  );
}

// Add shimmer animation to global styles or use inline
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = shimmerKeyframes;
  document.head.appendChild(styleEl);
}

export default ProofProgress;
