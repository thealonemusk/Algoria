'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState, AlgorithmStep } from '@/lib/engine/AlgorithmEngine';
import { generateSlidingWindow, generateBruteForce } from '@/lib/algorithms/slidingWindow';

const ARRAY = [2, 1, 5, 1, 3, 2, 7, 4, 1, 6];
const K = 3;

const STRATEGIES: Strategy[] = [
    {
        id: 'brute',
        name: 'Brute Force',
        iconName: 'hammer',
        description: 'Check every subarray of length k. Sum each one and track the maximum.',
        timeComplexity: 'O(n·k)',
        spaceComplexity: 'O(1)',
        quality: 'bad',
    },
    {
        id: 'sliding',
        name: 'Sliding Window',
        iconName: 'wind',
        description: 'Maintain a running sum. Slide the window by adding the next element and removing the first.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        quality: 'good',
    },
];

export default function SlidingWindowPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const initEngine = useCallback((stratId: string) => {
        const steps = stratId === 'brute'
            ? generateBruteForce(ARRAY, K)
            : generateSlidingWindow(ARRAY, K);
        const engine = new AlgorithmEngine(setState);
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const handleSelect = (id: string) => {
        setSelected(id);
        initEngine(id);
    };

    const step = state?.steps[state.currentStep];
    const windowStart = step?.windowStart;
    const windowEnd = step?.windowEnd;
    const activeIndices = step?.indices ?? [];
    const leftPointer = step?.leftPointer;
    const rightPointer = step?.rightPointer;

    const eliminatedLeft = (step?.type === 'eliminate-left') ? (step.leftPointer ?? 0) : undefined;
    const eliminatedRight = (step?.type === 'eliminate-right') ? (step.rightPointer ?? ARRAY.length - 1) : undefined;

    const completed = state?.phase === 'complete';

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>
                    🪟 Array Pattern
                </div>
                <h1 className="page-title gradient-text">Maximum Sum Subarray of Size K</h1>
                <p className="page-subtitle">
                    Given an array of integers, find the maximum sum of any contiguous subarray of size <strong>k = {K}</strong>.
                    Choose your strategy and watch the algorithm unfold.
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    {/* Array */}
                    <ArrayVisualizer
                        array={ARRAY}
                        windowStart={windowStart}
                        windowEnd={windowEnd}
                        activeIndices={activeIndices}
                        leftPointer={leftPointer}
                        rightPointer={rightPointer}
                        phase={state?.phase ?? 'idle'}
                        resultIndices={completed ? (step?.indices ?? []) : []}
                    />

                    {/* Description */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step?.description}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="description-box"
                        >
                            {step?.description ?? 'Choose a strategy below to begin the simulation.'}
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    {state && (
                        <StepControls
                            isPlaying={state.isPlaying}
                            currentStep={state.currentStep}
                            totalSteps={state.steps.length}
                            speed={state.speed}
                            phase={state.phase}
                            onPlay={() => engineRef.current?.play()}
                            onPause={() => engineRef.current?.pause()}
                            onStep={() => engineRef.current?.step()}
                            onStepBack={() => engineRef.current?.stepBack()}
                            onReset={() => engineRef.current?.reset()}
                            onSpeedChange={(ms) => engineRef.current?.setSpeed(ms)}
                        />
                    )}

                    <ComplexityDashboard
                        visible={completed}
                        strategies={[
                            { label: 'Brute Force', time: 'O(n·k)', space: 'O(1)', ops: ARRAY.length * K, barColor: '#EF4444', maxOps: 50 },
                            { label: 'Sliding Window', time: 'O(n)', space: 'O(1)', ops: ARRAY.length, barColor: '#10B981', maxOps: 50 },
                        ]}
                    />
                </div>

                {/* Strategy Panel */}
                <div className="challenge-sidebar-panel">
                    <div className="section-label">Choose Strategy</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {STRATEGIES.map((s, i) => (
                            <StrategyCard
                                key={s.id}
                                strategy={s}
                                selected={selected === s.id}
                                onClick={() => handleSelect(s.id)}
                                disabled={state?.isPlaying}
                                index={i}
                            />
                        ))}
                    </div>

                    {/* Pattern Explanation */}
                    <AnimatePresence>
                        {completed && selected === 'sliding' && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card"
                                style={{ padding: 20, marginTop: 4 }}
                            >
                                <div className="section-label">💡 Why Sliding Window Works</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    Instead of recalculating the sum from scratch for every window, sliding window
                                    <strong style={{ color: 'var(--primary-light)' }}> reuses previous work</strong>.
                                    Add the new element, drop the old one. O(k) computation becomes O(1) per slide.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
