'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

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

const speeds = [1200, 700, 400, 200, 100];
const speedLabels: Record<number, string> = { 1200: '0.5×', 700: '1×', 400: '2×', 200: '4×', 100: '8×' };

export function StepControls({
    isPlaying, currentStep, totalSteps, speed, phase,
    onPlay, onPause, onStep, onStepBack, onReset, onSpeedChange,
}: StepControlsProps) {
    const speedIdx = speeds.indexOf(speed);

    return (
        <div className="step-controls">
            <button className="step-btn" onClick={onReset} title="Reset">
                <RotateCcw size={14} />
            </button>
            <button className="step-btn" onClick={onStepBack} disabled={currentStep === 0} title="Step Back">
                <ChevronLeft size={16} />
            </button>

            <motion.button
                className="step-btn primary"
                whileTap={{ scale: 0.9 }}
                onClick={isPlaying ? onPause : onPlay}
                title={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
            </motion.button>

            <button className="step-btn" onClick={onStep} disabled={phase === 'complete'} title="Next Step">
                <ChevronRight size={16} />
            </button>

            <span className="speed-label">Speed</span>
            <input
                className="speed-slider"
                type="range"
                min={0}
                max={speeds.length - 1}
                value={speedIdx === -1 ? 1 : speedIdx}
                onChange={(e) => onSpeedChange(speeds[Number(e.target.value)])}
            />
            <span className="speed-label">{speedLabels[speed] ?? '1×'}</span>

            <div className="step-info">
                {currentStep + 1} / {totalSteps}
            </div>

            {phase === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="challenge-phase-badge phase-complete"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                    <CheckCircle2 size={11} />
                    Complete
                </motion.div>
            )}
        </div>
    );
}
