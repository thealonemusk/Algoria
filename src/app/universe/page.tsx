'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    SlidersHorizontal, Pointer, Search, Network, Layers,
    Calendar, Package, BarChart2, Scale, Zap, Database, Radio,
} from 'lucide-react';

interface UniverseNode {
    id: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    href: string;
    category: string;
    x: number; y: number;
    color: string;
    connections: string[];
}

const NODES: UniverseNode[] = [
    { id: 'sw', label: 'Sliding Window', Icon: SlidersHorizontal, href: '/dsa/sliding-window', category: 'DSA', x: 400, y: 200, color: '#7C3AED', connections: ['tp', 'bs'] },
    { id: 'tp', label: 'Two Pointer', Icon: Pointer, href: '/dsa/two-pointer', category: 'DSA', x: 200, y: 320, color: '#06B6D4', connections: ['sw', 'bs', 'js'] },
    { id: 'bs', label: 'Binary Search', Icon: Search, href: '/dsa/binary-search', category: 'DSA', x: 600, y: 320, color: '#10B981', connections: ['sw', 'tp', 'dp'] },
    { id: 'gt', label: 'Graph Traversal', Icon: Network, href: '/dsa/graph-traversal', category: 'DSA', x: 300, y: 460, color: '#EC4899', connections: ['tp', 'dp', 'ps'] },
    { id: 'dp', label: 'Dyn Programming', Icon: Layers, href: '/dsa/dynamic-programming', category: 'DSA', x: 550, y: 460, color: '#F59E0B', connections: ['bs', 'gt', 'fk'] },
    { id: 'js', label: 'Job Scheduling', Icon: Calendar, href: '/greedy/job-scheduling', category: 'Greedy', x: 100, y: 200, color: '#A78BFA', connections: ['tp', 'im', 'fk'] },
    { id: 'fk', label: 'Frac Knapsack', Icon: Package, href: '/greedy/knapsack', category: 'Greedy', x: 700, y: 200, color: '#F59E0B', connections: ['dp', 'js'] },
    { id: 'im', label: 'Interval Merge', Icon: BarChart2, href: '/greedy/interval-merge', category: 'Greedy', x: 150, y: 500, color: '#06B6D4', connections: ['js', 'gt'] },
    { id: 'lb', label: 'Load Balancer', Icon: Scale, href: '/system-design/load-balancer', category: 'System', x: 700, y: 480, color: '#7C3AED', connections: ['sh', 'ca'] },
    { id: 'ca', label: 'Caching', Icon: Zap, href: '/system-design/caching', category: 'System', x: 760, y: 340, color: '#10B981', connections: ['lb', 'sh', 'ps'] },
    { id: 'sh', label: 'Sharding', Icon: Database, href: '/system-design/sharding', category: 'System', x: 650, y: 600, color: '#F59E0B', connections: ['lb', 'ca'] },
    { id: 'ps', label: 'Pub / Sub', Icon: Radio, href: '/system-design/pub-sub', category: 'System', x: 480, y: 600, color: '#EC4899', connections: ['gt', 'ca', 'sh'] },
];

const SVG_W = 900;
const SVG_H = 700;

export default function UniversePage() {
    return (
        <div className="page-container" style={{ minHeight: '100vh' }}>
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>
                    Pattern Universe
                </div>
                <h1 className="page-title gradient-text">Algorithm Universe</h1>
                <p className="page-subtitle">Every pattern is a node in an interconnected galaxy. Click any node to enter that challenge.</p>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.05) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                        {NODES.map((n) => (
                            <filter key={n.id} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        ))}
                    </defs>

                    {/* Edges */}
                    {NODES.map((n) =>
                        n.connections.map((cId) => {
                            const target = NODES.find((nd) => nd.id === cId);
                            if (!target) return null;
                            return (
                                <line key={`${n.id}-${cId}`}
                                    x1={n.x} y1={n.y} x2={target.x} y2={target.y}
                                    stroke={`${n.color}28`}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 8"
                                />
                            );
                        })
                    )}

                    {/* Nodes */}
                    {NODES.map((n, i) => (
                        <a key={n.id} href={n.href} style={{ cursor: 'pointer' }}>
                            <g>
                                {/* Pulse ring */}
                                <motion.circle
                                    cx={n.x} cy={n.y} r={36}
                                    fill={`${n.color}10`}
                                    animate={{ r: [34, 42, 34] }}
                                    transition={{ duration: 3.2 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                {/* Node circle */}
                                <motion.circle
                                    cx={n.x} cy={n.y} r={24}
                                    fill={`${n.color}18`}
                                    stroke={n.color}
                                    strokeWidth={1.5}
                                    filter={`url(#glow-${n.id})`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.22 }}
                                />
                                {/* Icon — rendered as foreignObject */}
                                <foreignObject x={n.x - 10} y={n.y - 10} width={20} height={20} style={{ overflow: 'visible' }}>
                                    <div style={{
                                        width: 20, height: 20,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: n.color, pointerEvents: 'none',
                                    }}>
                                        <n.Icon size={15} strokeWidth={2} />
                                    </div>
                                </foreignObject>
                                {/* Label */}
                                <text x={n.x} y={n.y + 38} textAnchor="middle" fill={n.color}
                                    fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
                                    {n.label}
                                </text>
                                <text x={n.x} y={n.y + 52} textAnchor="middle" fill="rgba(255,255,255,0.25)"
                                    fontSize="9" fontFamily="Inter, sans-serif">
                                    {n.category}
                                </text>
                            </g>
                        </a>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                    { label: 'DSA Patterns', color: '#7C3AED' },
                    { label: 'Greedy Algorithms', color: '#A78BFA' },
                    { label: 'System Design', color: '#06B6D4' },
                ].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, boxShadow: `0 0 8px ${l.color}60` }} />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
