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
    { id: 'sw', label: 'Sliding Window', Icon: SlidersHorizontal, href: '/dsa/sliding-window', category: 'DSA', x: 400, y: 200, color: '#5B4FCF', connections: ['tp', 'bs'] },
    { id: 'tp', label: 'Two Pointer', Icon: Pointer, href: '/dsa/two-pointer', category: 'DSA', x: 200, y: 320, color: '#5B4FCF', connections: ['sw', 'bs', 'js'] },
    { id: 'bs', label: 'Binary Search', Icon: Search, href: '/dsa/binary-search', category: 'DSA', x: 600, y: 320, color: '#5B4FCF', connections: ['sw', 'tp', 'dp'] },
    { id: 'gt', label: 'Graph Traversal', Icon: Network, href: '/dsa/graph-traversal', category: 'DSA', x: 300, y: 460, color: '#5B4FCF', connections: ['tp', 'dp', 'ps'] },
    { id: 'dp', label: 'Dyn Programming', Icon: Layers, href: '/dsa/dynamic-programming', category: 'DSA', x: 550, y: 460, color: '#5B4FCF', connections: ['bs', 'gt', 'fk'] },
    { id: 'js', label: 'Job Scheduling', Icon: Calendar, href: '/greedy/job-scheduling', category: 'Greedy', x: 100, y: 200, color: '#2884A0', connections: ['tp', 'im', 'fk'] },
    { id: 'fk', label: 'Frac Knapsack', Icon: Package, href: '/greedy/knapsack', category: 'Greedy', x: 700, y: 200, color: '#2884A0', connections: ['dp', 'js'] },
    { id: 'im', label: 'Interval Merge', Icon: BarChart2, href: '/greedy/interval-merge', category: 'Greedy', x: 150, y: 500, color: '#2884A0', connections: ['js', 'gt'] },
    { id: 'lb', label: 'Load Balancer', Icon: Scale, href: '/system-design/load-balancer', category: 'System', x: 700, y: 480, color: '#2E7D60', connections: ['sh', 'ca'] },
    { id: 'ca', label: 'Caching', Icon: Zap, href: '/system-design/caching', category: 'System', x: 760, y: 340, color: '#2E7D60', connections: ['lb', 'sh', 'ps'] },
    { id: 'sh', label: 'Sharding', Icon: Database, href: '/system-design/sharding', category: 'System', x: 650, y: 600, color: '#2E7D60', connections: ['lb', 'ca'] },
    { id: 'ps', label: 'Pub / Sub', Icon: Radio, href: '/system-design/pub-sub', category: 'System', x: 480, y: 600, color: '#2E7D60', connections: ['gt', 'ca', 'sh'] },
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
                    background: 'radial-gradient(ellipse at 30% 40%, rgba(91,79,207,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(40,132,160,0.04) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                        {NODES.map((n) => (
                            <radialGradient key={n.id} id={`glow-${n.id}`}>
                                <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                            </radialGradient>
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
                                    stroke={`${n.color}50`}
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
                                {/* Glowing background instead of strict SVG filter for performance */}
                                <circle cx={n.x} cy={n.y} r={32} fill={`url(#glow-${n.id})`} />

                                {/* Pulse ring */}
                                <motion.circle
                                    cx={n.x} cy={n.y} r={36}
                                    fill="none"
                                    stroke={`${n.color}20`}
                                    strokeWidth={1}
                                    animate={{ r: [35, 42, 35], opacity: [0.3, 0.8, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                                />

                                {/* Node circle */}
                                <motion.circle
                                    cx={n.x} cy={n.y} r={24}
                                    fill={`${n.color}15`}
                                    stroke={n.color}
                                    strokeWidth={1.5}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.04, duration: 0.4 }}
                                    whileHover={{ scale: 1.15 }}
                                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
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
                                <text x={n.x} y={n.y + 52} textAnchor="middle" fill="rgba(26,18,9,0.35)"
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
                    { label: 'DSA Patterns', color: '#5B4FCF' },
                    { label: 'Greedy Algorithms', color: '#2884A0' },
                    { label: 'System Design', color: '#2E7D60' },
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
