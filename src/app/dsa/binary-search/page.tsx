'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { generateBinarySearch } from '@/lib/algorithms/binarySearch';

const ARRAY = [3, 7, 11, 15, 19, 23, 28, 34, 41, 50];
const TARGET = 28;

const STRATEGIES: Strategy[] = [
    {
        id: 'linear',
        name: 'Linear Search',
        iconName: 'hammer',
        description: 'Scan every element from left to right until target is found. Simple but slow.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        quality: 'ok',
    },
    {
        id: 'binary',
        name: 'Binary Search',
        iconName: 'zap',
        description: 'Each comparison eliminates half the search space. Only works on sorted arrays.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        quality: 'good',
    },
];

function generateLinearSearch(arr: number[], target: number) {
    const steps: any[] = [];
    for (let i = 0; i < arr.length; i++) {
        steps.push({ type: 'compare', indices: [i], leftPointer: i, rightPointer: i, value: arr[i], description: `Check arr[${i}] = ${arr[i]}. Is it ${target}?` });
        if (arr[i] === target) {
            steps.push({ type: 'result', indices: [i], description: `✅ Found ${target} at index ${i} after ${i + 1} comparisons.` });
            steps.push({ type: 'complete', indices: [i], description: `Linear Search done. Checked ${i + 1} of ${arr.length} elements.` });
            return steps;
        }
    }
    steps.push({ type: 'complete', indices: [], description: `Not found after checking all ${arr.length} elements.` });
    return steps;
}

export default function BinarySearchPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        const steps = id === 'linear' ? generateLinearSearch(ARRAY, TARGET) : generateBinarySearch(ARRAY, TARGET);
        const engine = new AlgorithmEngine(setState);
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const step = state?.steps[state.currentStep];
    const completed = state?.phase === 'complete';

    const elimLeft = step?.type === 'eliminate-left' ? step.leftPointer : undefined;
    const elimRight = step?.type === 'eliminate-right' ? step.rightPointer : undefined;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>🔍 Search Pattern</div>
                <h1 className="page-title gradient-text">Binary Search</h1>
                <p className="page-subtitle">Find target <strong>{TARGET}</strong> in a sorted array. See how Binary Search shrinks the search space in half every step, achieving O(log n).</p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    <ArrayVisualizer
                        array={ARRAY}
                        leftPointer={step?.leftPointer !== step?.rightPointer ? step?.leftPointer : undefined}
                        rightPointer={step?.leftPointer !== step?.rightPointer ? step?.rightPointer : undefined}
                        activeIndices={step?.indices ?? []}
                        eliminatedLeft={elimLeft}
                        eliminatedRight={elimRight}
                        phase={state?.phase ?? 'idle'}
                        resultIndices={completed ? step?.indices ?? [] : []}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box">
                            {step?.description ?? `Search for target = ${TARGET} in the sorted array. Select a strategy.`}
                        </motion.div>
                    </AnimatePresence>

                    {state && (
                        <StepControls
                            isPlaying={state.isPlaying} currentStep={state.currentStep} totalSteps={state.steps.length}
                            speed={state.speed} phase={state.phase}
                            onPlay={() => engineRef.current?.play()} onPause={() => engineRef.current?.pause()}
                            onStep={() => engineRef.current?.step()} onStepBack={() => engineRef.current?.stepBack()}
                            onReset={() => engineRef.current?.reset()} onSpeedChange={(ms) => engineRef.current?.setSpeed(ms)}
                        />
                    )}

                    <ComplexityDashboard
                        visible={completed}
                        strategies={[
                            { label: 'Linear Search', time: 'O(n)', space: 'O(1)', ops: ARRAY.length, barColor: '#9A6E2A', maxOps: 50 },
                            { label: 'Binary Search', time: 'O(log n)', space: 'O(1)', ops: Math.ceil(Math.log2(ARRAY.length)), barColor: '#2E7D60', maxOps: 50 },
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
                        {completed && selected === 'binary' && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 20 }}>
                                <div className="section-label">💡 Why Binary Search Works</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    Each step <strong style={{ color: 'var(--primary-light)' }}>halves the search space</strong>.
                                    10 elements → at most 4 comparisons. 1 million elements → at most 20 comparisons. That's the power of O(log n).
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
