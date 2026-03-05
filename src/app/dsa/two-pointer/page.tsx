'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { ArrowsUpFromLine } from 'lucide-react';
import { generateTwoPointer, generateTwoPointerBrute } from '@/lib/algorithms/twoPointer';

const ARRAY = [1, 4, 6, 2, 9, 3, 11, 7];
const TARGET = 10;

const STRATEGIES: Strategy[] = [
    {
        id: 'brute',
        name: 'Brute Force',
        iconName: 'hammer',
        description: 'Check every pair (i, j) where i ≠ j. O(n²) nested loops.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        quality: 'bad',
    },
    {
        id: 'two-pointer',
        name: 'Two Pointer',
        iconName: 'arrow',
        description: 'Sort the array, then converge left and right pointers based on the current sum vs target.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        quality: 'good',
    },
];

export default function TwoPointerPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        const steps = id === 'brute'
            ? generateTwoPointerBrute(ARRAY, TARGET)
            : generateTwoPointer(ARRAY, TARGET);
        const engine = new AlgorithmEngine(setState);
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const step = state?.steps[state.currentStep];
    const completed = state?.phase === 'complete';
    const displayArr = [...ARRAY].sort((a, b) => a - b);

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>
                    <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><ArrowsUpFromLine size={14} /> Array Pattern</div>
                </div>
                <h1 className="page-title gradient-text">Two Sum — Find the Pair</h1>
                <p className="page-subtitle">
                    Given a sorted array and target <strong>{TARGET}</strong>, find two numbers that sum to it.
                    Watch how Two Pointer eliminates O(n²) comparisons by converging intelligently.
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    <ArrayVisualizer
                        array={displayArr}
                        leftPointer={step?.leftPointer}
                        rightPointer={step?.rightPointer}
                        activeIndices={step?.type === 'result' ? step.indices : []}
                        phase={state?.phase ?? 'idle'}
                        resultIndices={completed ? step?.indices ?? [] : []}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step?.description || 'empty'}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="description-box"
                        >
                            {step?.description ?? `Find two numbers in the array that sum to ${TARGET}. Choose a strategy.`}
                        </motion.div>
                    </AnimatePresence>

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
                            { label: 'Brute Force O(n²)', time: 'O(n²)', space: 'O(1)', ops: ARRAY.length * ARRAY.length, barColor: '#9B3535', maxOps: 100 },
                            { label: 'Two Pointer O(n)', time: 'O(n log n)', space: 'O(1)', ops: ARRAY.length + Math.ceil(Math.log2(ARRAY.length)), barColor: '#2E7D60', maxOps: 100 },
                        ]}
                    />
                </div>

                <div className="challenge-sidebar-panel">
                    <div className="section-label">Choose Strategy</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {STRATEGIES.map((s, i) => (
                            <StrategyCard key={s.id} strategy={s} selected={selected === s.id} onClick={() => handleSelect(s.id)} disabled={state?.isPlaying} index={i} />
                        ))}
                    </div>
                    <AnimatePresence>
                        {completed && selected === 'two-pointer' && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 20 }}>
                                <div className="section-label">💡 Why Two Pointer Works</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    On a sorted array, if the sum of two pointers is too small — move left up.
                                    Too big — move right down. Each pointer moves at most n steps.
                                    <strong style={{ color: 'var(--primary-light)' }}> O(n) instead of O(n²)</strong>.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
