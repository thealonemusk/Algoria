'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { generateKnapsack } from '@/lib/algorithms/greedy';

const ITEMS = [
    { name: 'Gold Dust', weight: 2, value: 12 },
    { name: 'Silver Bar', weight: 5, value: 20 },
    { name: 'Emerald', weight: 1, value: 10 },
    { name: 'Ruby', weight: 3, value: 15 },
    { name: 'Pearl Chain', weight: 4, value: 14 },
];
const CAPACITY = 8;

const SORTED_ITEMS = [...ITEMS.map((it, i) => ({ ...it, ratio: it.value / it.weight, idx: i }))]
    .sort((a, b) => b.ratio - a.ratio);

const STRATEGIES: Strategy[] = [
    {
        id: 'brute',
        name: 'Try All Fractions',
        iconName: 'hammer',
        description: 'Check every possible combination of item fractions — exponential search space.',
        timeComplexity: 'O(2ⁿ)',
        spaceComplexity: 'O(n)',
        quality: 'bad',
    },
    {
        id: 'greedy',
        name: 'Greedy by Value/Weight',
        iconName: 'trending',
        description: 'Sort by value/weight ratio. Take items fully if possible, else take a fraction.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        quality: 'good',
    },
];

export default function KnapsackPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const [takenItems, setTakenItems] = useState<Set<number>>(new Set());
    const [currentIdx, setCurrentIdx] = useState<number | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        setTakenItems(new Set());
        setCurrentIdx(null);
        const steps = generateKnapsack(ITEMS, CAPACITY);
        const engine = new AlgorithmEngine((s) => {
            setState(s);
            const step = s.steps[s.currentStep];
            if (step) {
                setCurrentIdx(step.indices[0] ?? null);
                if (step.type === 'result') setTakenItems((prev) => new Set([...prev, step.indices[0]]));
            }
        });
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const step = state?.steps[state.currentStep];
    const completed = state?.phase === 'complete';

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>🎒 Greedy Pattern</div>
                <h1 className="page-title gradient-text">Fractional Knapsack</h1>
                <p className="page-subtitle">
                    Bag capacity: <strong>{CAPACITY} kg</strong>. Pack items to maximize value. Unlike 0/1 Knapsack, you can take fractions. Greedy works here!
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label">Items — sorted by value/weight ratio</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {SORTED_ITEMS.map((item, i) => {
                                const isTaken = takenItems.has(i);
                                const isCurrent = i === currentIdx;
                                return (
                                    <motion.div
                                        key={item.name}
                                        className={`glass-card-elevated`}
                                        animate={{ borderColor: isCurrent ? 'var(--primary)' : isTaken ? 'var(--success)' : 'transparent' }}
                                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, border: '1px solid', boxShadow: isCurrent ? '0 0 20px var(--primary-glow)' : isTaken ? '0 0 16px var(--success-glow)' : 'none' }}
                                    >
                                        <div style={{ fontSize: 22 }}>{isTaken ? '✅' : isCurrent ? '👀' : '📦'}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: isTaken ? 'var(--success)' : 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{item.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Weight: {item.weight}kg · Value: ${item.value}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>
                                                {item.ratio.toFixed(1)}/kg
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ratio</div>
                                        </div>
                                        {/* Weight bar */}
                                        <div style={{ width: 60 }}>
                                            <div className="complexity-bar-track">
                                                <motion.div
                                                    className="complexity-bar-fill"
                                                    style={{ background: isTaken ? 'var(--success)' : 'var(--primary)' }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.weight / CAPACITY) * 100}%` }}
                                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                                />
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{item.weight}kg</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box">
                            {step?.description ?? 'Select the Greedy strategy to fill your knapsack optimally.'}
                        </motion.div>
                    </AnimatePresence>

                    {state && (
                        <StepControls
                            isPlaying={state.isPlaying} currentStep={state.currentStep} totalSteps={state.steps.length}
                            speed={state.speed} phase={state.phase}
                            onPlay={() => engineRef.current?.play()} onPause={() => engineRef.current?.pause()}
                            onStep={() => engineRef.current?.step()} onStepBack={() => engineRef.current?.stepBack()}
                            onReset={() => { engineRef.current?.reset(); setTakenItems(new Set()); setCurrentIdx(null); }}
                            onSpeedChange={(ms) => engineRef.current?.setSpeed(ms)}
                        />
                    )}

                    <ComplexityDashboard
                        visible={completed}
                        strategies={[
                            { label: 'Brute Force', time: 'O(2ⁿ)', space: 'O(n)', ops: Math.pow(2, ITEMS.length), barColor: '#9B3535', maxOps: 40 },
                            { label: 'Greedy', time: 'O(n log n)', space: 'O(1)', ops: ITEMS.length * 2, barColor: '#2E7D60', maxOps: 40 },
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
                        {completed && selected === 'greedy' && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 20 }}>
                                <div className="section-label">💡 Why Greedy is Optimal Here</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    Fractions make greedy provably optimal. Taking the highest value-per-kg item first
                                    <strong style={{ color: 'var(--primary-light)' }}> always maximizes the remaining capacity's potential</strong>.
                                    This does NOT work for 0/1 Knapsack — that needs DP.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
