'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { generateIntervalMerge } from '@/lib/algorithms/greedy';

const RAW_INTERVALS: [number, number][] = [[1, 4], [2, 6], [8, 10], [15, 18], [10, 12]];
const SORTED_INTERVALS = [...RAW_INTERVALS].sort((a, b) => a[0] - b[0]);
const MAX_T = 20;

const STRATEGIES: Strategy[] = [
    {
        id: 'naive',
        name: 'Naive Comparison',
        iconName: 'hammer',
        description: 'Compare every pair of intervals for overlap. O(n²) pairs.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n)',
        quality: 'bad',
    },
    {
        id: 'greedy',
        name: 'Greedy Sort & Merge',
        iconName: 'trending',
        description: 'Sort by start time, then scan once. Merge overlapping intervals greedily.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        quality: 'good',
    },
];

export default function IntervalMergePage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [mergedIntervals, setMergedIntervals] = useState<[number, number][]>([]);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        setActiveIdx(null);
        setMergedIntervals([]);
        const steps = generateIntervalMerge(RAW_INTERVALS);
        const engine = new AlgorithmEngine((s) => {
            setState(s);
            const step = s.steps[s.currentStep];
            if (step) {
                setActiveIdx(step.indices[0] ?? null);
                if (step.type === 'result' && step.value !== undefined) {
                    // value = merged count
                }
            }
        });
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const step = state?.steps[state.currentStep];
    const completed = state?.phase === 'complete';
    const W = 480;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>📊 Greedy Pattern</div>
                <h1 className="page-title gradient-text">Merge Overlapping Intervals</h1>
                <p className="page-subtitle">Given {RAW_INTERVALS.length} intervals, merge all overlapping ones. Greedy approach: sort by start, then do one linear scan.</p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label">Interval Timeline</div>
                        {/* Time axis */}
                        <div style={{ position: 'relative', marginLeft: 80, marginBottom: 12, height: 16 }}>
                            {Array.from({ length: MAX_T + 1 }, (_, t) =>
                                t % 2 === 0 ? <div key={t} style={{ position: 'absolute', left: (t / MAX_T) * W, fontSize: 10, color: 'var(--text-muted)', transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono' }}>{t}</div> : null
                            )}
                        </div>
                        {SORTED_INTERVALS.map(([s, e], i) => {
                            const isCurrent = i === activeIdx;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                    <div style={{ width: 76, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', paddingRight: 8, fontFamily: 'JetBrains Mono' }}>
                                        [{s}, {e}]
                                    </div>
                                    <div style={{ position: 'relative', height: 28, width: W, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid var(--border)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: ((e - s) / MAX_T) * W }}
                                            transition={{ duration: 0.5, delay: i * 0.07 }}
                                            style={{
                                                position: 'absolute', left: (s / MAX_T) * W,
                                                top: 4, bottom: 4,
                                                background: isCurrent ? 'var(--primary)' : 'rgba(124,58,237,0.3)',
                                                borderRadius: 4,
                                                boxShadow: isCurrent ? '0 0 16px var(--primary-glow)' : 'none',
                                                border: isCurrent ? '1px solid var(--primary)' : 'none',
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box">
                            {step?.description ?? 'Select Greedy to watch intervals merge in a single pass.'}
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
                            { label: 'Naive O(n²)', time: 'O(n²)', space: 'O(n)', ops: RAW_INTERVALS.length * RAW_INTERVALS.length, barColor: '#9B3535', maxOps: 50 },
                            { label: 'Greedy Sort+Scan', time: 'O(n log n)', space: 'O(n)', ops: RAW_INTERVALS.length * Math.ceil(Math.log2(RAW_INTERVALS.length)), barColor: '#2E7D60', maxOps: 50 },
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
                </div>
            </div>
        </div>
    );
}
