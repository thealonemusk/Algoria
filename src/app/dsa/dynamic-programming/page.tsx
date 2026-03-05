'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { BrainCircuit } from 'lucide-react';
import { generateDPKnapsack } from '@/lib/algorithms/dp';

const WEIGHTS = [2, 3, 4, 5];
const VALUES = [3, 4, 5, 6];
const CAPACITY = 8;
const ITEMS = ['Gem', 'Ring', 'Book', 'Sword'];

const STRATEGIES: Strategy[] = [
    {
        id: 'brute',
        name: 'Brute Force',
        iconName: 'hammer',
        description: 'Try every subset of items (2ⁿ combinations). Explodes exponentially.',
        timeComplexity: 'O(2ⁿ)',
        spaceComplexity: 'O(n)',
        quality: 'bad',
    },
    {
        id: 'dp',
        name: 'Dynamic Programming',
        iconName: 'cpu',
        description: 'Build a table of optimal values. Each cell uses previously computed results.',
        timeComplexity: 'O(n·W)',
        spaceComplexity: 'O(n·W)',
        quality: 'good',
    },
];

interface DPCell { row: number; col: number; value: number; }

export default function DPPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const [table, setTable] = useState<(number | null)[][]>([]);
    const [currentCell, setCurrentCell] = useState<DPCell | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        const initTable = Array.from({ length: WEIGHTS.length + 1 }, () => new Array(CAPACITY + 1).fill(null));
        for (let w = 0; w <= CAPACITY; w++) initTable[0][w] = 0;
        setTable(initTable);
        setCurrentCell(null);

        const steps = generateDPKnapsack(WEIGHTS, VALUES, CAPACITY);
        const engine = new AlgorithmEngine((s) => {
            setState(s);
            const step = s.steps[s.currentStep];
            if (step?.dpCell) {
                setCurrentCell(step.dpCell);
                setTable((prev) => {
                    const next = prev.map((r) => [...r]);
                    if (step.dpCell) next[step.dpCell.row][step.dpCell.col] = step.dpCell.value;
                    return next;
                });
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
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><BrainCircuit size={14} /> DP Pattern</div>
                <h1 className="page-title gradient-text">0/1 Knapsack — Dynamic Programming</h1>
                <p className="page-subtitle">
                    You have a knapsack with capacity <strong>{CAPACITY}</strong> and {ITEMS.length} items. Maximize the total value.
                    Watch how DP fills the table solving subproblems bottom-up.
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    {/* Items display */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <div className="section-label">Items</div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {ITEMS.map((name, i) => (
                                <div key={i} className="glass-card-elevated" style={{ padding: '10px 16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>📦</div>
                                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13 }}>{name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>W: {WEIGHTS[i]} | V: {VALUES[i]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DP Table */}
                    <div className="dp-table-container">
                        <div className="section-label">DP Table — dp[item][capacity]</div>
                        <table className="dp-table">
                            <thead>
                                <tr>
                                    <th>Item ↓ / W →</th>
                                    {Array.from({ length: CAPACITY + 1 }, (_, w) => <th key={w}>{w}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((row, i) => (
                                    <tr key={i}>
                                        <th style={{ color: 'var(--text-secondary)', paddingRight: 12, textAlign: 'right', fontWeight: 500 }}>
                                            {i === 0 ? '∅' : ITEMS[i - 1]}
                                        </th>
                                        {row.map((cell, w) => {
                                            const isCurrent = currentCell?.row === i && currentCell?.col === w;
                                            const isFilled = cell !== null;
                                            const isResult = completed && i === WEIGHTS.length && w === CAPACITY;
                                            return (
                                                <motion.td
                                                    key={w}
                                                    className={`${isResult ? 'dp-cell-result' : isCurrent ? 'dp-cell-current' : isFilled ? 'dp-cell-filled' : ''}`}
                                                    animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    {cell === null ? '' : cell}
                                                </motion.td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description || 'empty'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box" style={{ minHeight: 64 }}>
                            {step?.description ?? 'Select a strategy to solve this classic DP problem.'}
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
                            { label: 'Brute Force', time: 'O(2ⁿ)', space: 'O(n)', ops: Math.pow(2, WEIGHTS.length), barColor: '#9B3535', maxOps: 20 },
                            { label: 'Dynamic Programming', time: 'O(n·W)', space: 'O(n·W)', ops: WEIGHTS.length * CAPACITY, barColor: '#2E7D60', maxOps: 20 },
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
                        {completed && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 20 }}>
                                <div className="section-label">💡 DP Insight</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    Each cell <strong style={{ color: 'var(--primary-light)' }}>dp[i][w]</strong> represents
                                    the best value using first i items with capacity w.
                                    It builds on already-solved subproblems — no redundant computation.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
