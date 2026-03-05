'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, CheckCircle2, Clock, Play } from 'lucide-react';
import { GraphVisualizer } from '@/components/visualizers/GraphVisualizer';
import { StrategyCard, Strategy } from '@/components/ui/StrategyCard';
import { StepControls } from '@/components/ui/StepControls';
import { ComplexityDashboard } from '@/components/ui/ComplexityDashboard';
import { AlgorithmEngine, AlgorithmState } from '@/lib/engine/AlgorithmEngine';
import { generateBFS, generateDFS, GraphNode, GraphEdge } from '@/lib/algorithms/graphTraversal';

const NODES: GraphNode[] = [
    { id: 'A', label: 'A', x: 340, y: 50 },
    { id: 'B', label: 'B', x: 180, y: 140 },
    { id: 'C', label: 'C', x: 500, y: 140 },
    { id: 'D', label: 'D', x: 100, y: 250 },
    { id: 'E', label: 'E', x: 260, y: 250 },
    { id: 'F', label: 'F', x: 420, y: 250 },
    { id: 'G', label: 'G', x: 580, y: 250 },
];

const EDGES: GraphEdge[] = [
    { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
    { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
    { from: 'C', to: 'F' }, { from: 'C', to: 'G' },
];

const STRATEGIES: Strategy[] = [
    {
        id: 'bfs',
        name: 'BFS — Breadth First',
        iconName: 'wind',
        description: 'Explore level by level using a queue. Guarantees shortest path in unweighted graphs.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        quality: 'good',
    },
    {
        id: 'dfs',
        name: 'DFS — Depth First',
        iconName: 'mountain',
        description: 'Go deep along each branch before backtracking. Uses a stack (or recursion).',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        quality: 'good',
    },
];

export default function GraphTraversalPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [state, setState] = useState<AlgorithmState | null>(null);
    const engineRef = useRef<AlgorithmEngine | null>(null);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
    const [currentNode, setCurrentNode] = useState<string | undefined>();
    const [activeEdge, setActiveEdge] = useState<[string, string] | undefined>();

    const handleSelect = useCallback((id: string) => {
        setSelected(id);
        setVisitedNodes(new Set());
        setCurrentNode(undefined);
        setActiveEdge(undefined);
        const steps = id === 'bfs' ? generateBFS(NODES, EDGES, 'A') : generateDFS(NODES, EDGES, 'A');
        const engine = new AlgorithmEngine((s) => {
            setState(s);
            const step = s.steps[s.currentStep];
            if (step?.graphNode) {
                if (step.type === 'graph-visit') {
                    setCurrentNode(step.graphNode);
                    setVisitedNodes((prev) => new Set([...prev, step.graphNode!]));
                }
                if (step.type === 'graph-edge') {
                    setActiveEdge(step.graphEdge);
                }
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
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><Network size={14} /> Graph Pattern</div>
                <h1 className="page-title gradient-text">Graph Traversal — BFS vs DFS</h1>
                <p className="page-subtitle">
                    Both visit all nodes in O(V+E). But the <em>order</em> of exploration is completely different.
                    Watch the graph light up and understand when to use each.
                </p>
            </div>

            <div className="challenge-layout">
                <div className="challenge-main">
                    <GraphVisualizer
                        nodes={NODES} edges={EDGES}
                        visitedNodes={visitedNodes}
                        currentNode={currentNode}
                        activeEdge={activeEdge}
                        phase={state?.phase ?? 'idle'}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div key={step?.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="description-box">
                            {step?.description ?? 'Choose BFS or DFS and watch how each traversal pattern differs.'}
                        </motion.div>
                    </AnimatePresence>

                    {state && (
                        <StepControls
                            isPlaying={state.isPlaying} currentStep={state.currentStep} totalSteps={state.steps.length}
                            speed={state.speed} phase={state.phase}
                            onPlay={() => engineRef.current?.play()} onPause={() => engineRef.current?.pause()}
                            onStep={() => engineRef.current?.step()} onStepBack={() => engineRef.current?.stepBack()}
                            onReset={() => { engineRef.current?.reset(); setVisitedNodes(new Set()); setCurrentNode(undefined); setActiveEdge(undefined); }}
                            onSpeedChange={(ms) => engineRef.current?.setSpeed(ms)}
                        />
                    )}

                    <ComplexityDashboard
                        visible={completed}
                        strategies={[
                            { label: 'BFS — Queue based', time: 'O(V+E)', space: 'O(V)', ops: NODES.length + EDGES.length, barColor: '#06B6D4', maxOps: 30 },
                            { label: 'DFS — Stack based', time: 'O(V+E)', space: 'O(V)', ops: NODES.length + EDGES.length, barColor: '#7C3AED', maxOps: 30 },
                        ]}
                    />
                </div>

                <div className="challenge-sidebar-panel">
                    <div className="section-label">Choose Traversal</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {STRATEGIES.map((s, i) => (
                            <StrategyCard key={s.id} strategy={s} selected={selected === s.id} onClick={() => handleSelect(s.id)} disabled={state?.isPlaying} index={i} />
                        ))}
                    </div>
                    <AnimatePresence>
                        {completed && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 20 }}>
                                <div className="section-label">💡 BFS vs DFS</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 8 }}>
                                    <strong style={{ color: 'var(--accent)' }}>BFS</strong>: Shortest path, level order. Use for: finding nearest node, connected components.
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    <strong style={{ color: 'var(--primary-light)' }}>DFS</strong>: Explores deep branches. Use for: cycle detection, topological sort, backtracking.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
