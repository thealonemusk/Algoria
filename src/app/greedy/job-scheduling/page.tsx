'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { Calendar, Lightbulb } from 'lucide-react';
import { generateJobScheduling, Job } from '@/lib/algorithms/greedy';

const JOBS: Job[] = [
    { id: '1', name: 'Design Sprint', start: 0, end: 3, profit: 50 },
    { id: '2', name: 'Client Meeting', start: 1, end: 4, profit: 10 },
    { id: '3', name: 'Code Review', start: 3, end: 5, profit: 40 },
    { id: '4', name: 'API Build', start: 0, end: 6, profit: 70 },
    { id: '5', name: 'Testing', start: 5, end: 7, profit: 30 },
    { id: '6', name: 'Deployment', start: 5, end: 9, profit: 60 },
];

const SORTED_JOBS = [...JOBS].sort((a, b) => a.end - b.end);

const STRATEGIES: Strategy[] = [
    {
        id: 'brute',
        name: 'Exhaustive Search',
        iconName: 'hammer',
        description: 'Try all 2ⁿ subsets of non-overlapping jobs. Choose the max profit subset.',
        timeComplexity: 'O(2ⁿ)',
        spaceComplexity: 'O(n)',
        quality: 'bad',
    },
    {
        id: 'greedy',
        name: 'Greedy (End-Time Sort)',
        iconName: 'trending',
        description: 'Sort by end time. Always pick the earliest-ending compatible job. Locally optimal → globally optimal.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        quality: 'good',
    },
];

export default function JobSchedulingPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const [highlightedJobs, setHighlightedJobs] = useState<Set<number>>(new Set());
    const [skippedJobs, setSkippedJobs] = useState<Set<number>>(new Set());
    const [currentJobIdx, setCurrentJobIdx] = useState<number | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        setHighlightedJobs(new Set());
        setSkippedJobs(new Set());
        setCurrentJobIdx(null);
        const steps = generateJobScheduling(JOBS);
        const engine = new AlgorithmEngine((s) => {
            setState(s);
            const step = s.steps[s.currentStep];
            if (step) {
                if (step.indices.length > 0) setCurrentJobIdx(step.indices[0]);
                if (step.type === 'result') setHighlightedJobs((prev) => new Set([...prev, step.indices[0]]));
                if (step.type === 'eliminate-left') setSkippedJobs((prev) => new Set([...prev, step.indices[0]]));
            }
        });
        engine.load(steps);
        engineRef.current = engine;
    }, []);

    const step = state?.steps[state.currentStep];
    const completed = state?.phase === 'complete';

    // Timeline visualization
    const maxTime = 10;
    const totalWidth = 560;
    const cellWidth = totalWidth / maxTime;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><Calendar size={14} /> Greedy Pattern</div>
                <h1 className="page-title gradient-text">Job Scheduling — Activity Selection</h1>
                <p className="page-subtitle">
                    You have {JOBS.length} tasks each with a time range and profit. Schedule as many non-overlapping jobs as possible to maximize profit.
                    The greedy insight: <em>always pick the job that ends earliest</em>.
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    {/* Gantt-style timeline */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label">Job Timeline (sorted by end time)</div>
                        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                            {/* Time axis */}
                            <div style={{ display: 'flex', gap: 0, marginBottom: 8, paddingLeft: 110 }}>
                                {Array.from({ length: maxTime + 1 }, (_, t) => (
                                    <div key={t} style={{ width: cellWidth, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, textAlign: 'center', fontFamily: 'JetBrains Mono' }}>{t}</div>
                                ))}
                            </div>
                            {SORTED_JOBS.map((job, idx) => {
                                const isHighlighted = highlightedJobs.has(idx);
                                const isSkipped = skippedJobs.has(idx);
                                const isCurrent = currentJobIdx === idx;
                                const barColor = isHighlighted ? 'var(--success)' : isSkipped ? 'rgba(155,53,53,0.22)' : isCurrent ? 'var(--primary)' : 'rgba(255,255,255,0.05)';
                                const textColor = isHighlighted ? '#4ADE80' : isSkipped ? '#F87171' : isCurrent ? '#7B6FDF' : 'var(--text-muted)';
                                return (
                                    <div key={job.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <div style={{ width: 100, fontSize: 12, color: textColor, fontWeight: isHighlighted ? 600 : 400, flexShrink: 0, paddingRight: 8, textAlign: 'right' }}>
                                            {job.name}
                                        </div>
                                        <div style={{ position: 'relative', height: 32, width: totalWidth, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid var(--border)', flexShrink: 0 }}>
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: (job.end - job.start) * cellWidth, opacity: 1 }}
                                                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                                style={{
                                                    position: 'absolute',
                                                    left: job.start * cellWidth,
                                                    top: 4, bottom: 4,
                                                    background: barColor,
                                                    borderRadius: 4,
                                                    border: isCurrent ? '1px solid var(--primary)' : isHighlighted ? '1px solid var(--success)' : 'none',
                                                    boxShadow: isHighlighted ? '0 0 12px var(--success-glow)' : isCurrent ? '0 0 12px var(--primary-glow)' : 'none',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, color: isHighlighted ? '#fff' : 'var(--text-muted)', fontFamily: 'JetBrains Mono',
                                                }}
                                            >
                                                ${job.profit}
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box">
                            {step?.description ?? 'Select Greedy strategy to watch the scheduler pick optimal non-overlapping jobs.'}
                        </motion.div>
                    </AnimatePresence>

                    {state && (
                        <StepControls
                            isPlaying={state.isPlaying} currentStep={state.currentStep} totalSteps={state.steps.length}
                            speed={state.speed} phase={state.phase}
                            onPlay={() => engineRef.current?.play()} onPause={() => engineRef.current?.pause()}
                            onStep={() => engineRef.current?.step()} onStepBack={() => engineRef.current?.stepBack()}
                            onReset={() => { engineRef.current?.reset(); setHighlightedJobs(new Set()); setSkippedJobs(new Set()); setCurrentJobIdx(null); }}
                            onSpeedChange={(ms) => engineRef.current?.setSpeed(ms)}
                        />
                    )}

                    <ComplexityDashboard
                        visible={completed}
                        strategies={[
                            { label: 'Exhaustive Search', time: 'O(2ⁿ)', space: 'O(n)', ops: Math.pow(2, JOBS.length), barColor: '#9B3535', maxOps: 100 },
                            { label: 'Greedy', time: 'O(n log n)', space: 'O(1)', ops: JOBS.length * Math.ceil(Math.log2(JOBS.length)), barColor: '#2E7D60', maxOps: 100 },
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
                                <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lightbulb size={14} /> Greedy Proof</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    Picking the job that ends earliest <strong style={{ color: 'var(--primary-light)' }}>leaves the maximum future time available</strong>.
                                    This is provably optimal — any deviation leads to equal or worse results.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
