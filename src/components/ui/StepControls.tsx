'use client';

import { motion } from 'framer-motion';

interface StepControlsProps {
    isPlaying: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
    phase: 'idle' | 'running' | 'complete';
    onPlay: () => void;
    onPause: () => void;
    onStep: () => void;
    onStepBack: () => void;
    onReset: () => void;
    onSpeedChange: (ms: number) => void;
}

const speedLabels: Record<number, string> = {
    1200: '0.5×',
    700: '1×',
    400: '2×',
    200: '4×',
    100: '8×',
};

export function StepControls({
    isPlaying, currentStep, totalSteps, speed, phase,
    onPlay, onPause, onStep, onStepBack, onReset, onSpeedChange,
}: StepControlsProps) {
    const speeds = [1200, 700, 400, 200, 100];
    const currentSpeedIdx = speeds.indexOf(speed);

    return (
        <div className="step-controls">
            <button className="step-btn" onClick={onReset} title="Reset">↺</button>
            <button className="step-btn" onClick={onStepBack} disabled={currentStep === 0} title="Step Back">◀</button>

            <motion.button
                className="step-btn primary"
                whileTap={{ scale: 0.92 }}
                onClick={isPlaying ? onPause : onPlay}
                title={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? '⏸' : '▶'}
            </motion.button>

            <button className="step-btn" onClick={onStep} disabled={phase === 'complete'} title="Next Step">▶</button>

            <div className="speed-label">Speed:</div>
            <input
                className="speed-slider"
                type="range"
                min={0}
                max={speeds.length - 1}
                value={currentSpeedIdx === -1 ? 1 : currentSpeedIdx}
                onChange={(e) => onSpeedChange(speeds[Number(e.target.value)])}
            />
            <div className="speed-label">{speedLabels[speed] ?? '1×'}</div>

            <div className="step-info">
                {currentStep + 1} / {totalSteps}
            </div>

            {phase === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="challenge-phase-badge phase-complete"
                >
                    ✓ Complete
                </motion.div>
            )}
        </div>
    );
}
