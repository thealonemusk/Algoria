'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface UniverseNode {
    id: string;
    label: string;
    icon: string;
    href: string;
    category: string;
    x: number; y: number;
    color: string;
    connections: string[];
}

const NODES: UniverseNode[] = [
    { id: 'sw', label: 'Sliding Window', icon: '🪟', href: '/dsa/sliding-window', category: 'DSA', x: 400, y: 200, color: '#7C3AED', connections: ['tp', 'bs'] },
    { id: 'tp', label: 'Two Pointer', icon: '👆', href: '/dsa/two-pointer', category: 'DSA', x: 200, y: 320, color: '#06B6D4', connections: ['sw', 'bs', 'js'] },
    { id: 'bs', label: 'Binary Search', icon: '🔍', href: '/dsa/binary-search', category: 'DSA', x: 600, y: 320, color: '#10B981', connections: ['sw', 'tp', 'dp'] },
    { id: 'gt', label: 'Graph Traversal', icon: '🕸️', href: '/dsa/graph-traversal', category: 'DSA', x: 300, y: 460, color: '#EC4899', connections: ['tp', 'dp', 'ps'] },
    { id: 'dp', label: 'Dyn Programming', icon: '🧩', href: '/dsa/dynamic-programming', category: 'DSA', x: 550, y: 460, color: '#F59E0B', connections: ['bs', 'gt', 'fk'] },
    { id: 'js', label: 'Job Scheduling', icon: '🗓️', href: '/greedy/job-scheduling', category: 'Greedy', x: 100, y: 200, color: '#A78BFA', connections: ['tp', 'im', 'fk'] },
    { id: 'fk', label: 'Frac Knapsack', icon: '🎒', href: '/greedy/knapsack', category: 'Greedy', x: 700, y: 200, color: '#F59E0B', connections: ['dp', 'js'] },
    { id: 'im', label: 'Interval Merge', icon: '📊', href: '/greedy/interval-merge', category: 'Greedy', x: 150, y: 500, color: '#06B6D4', connections: ['js', 'gt'] },
    { id: 'lb', label: 'Load Balancer', icon: '⚖️', href: '/system-design/load-balancer', category: 'System', x: 700, y: 480, color: '#7C3AED', connections: ['sh', 'ca'] },
    { id: 'ca', label: 'Caching', icon: '⚡', href: '/system-design/caching', category: 'System', x: 760, y: 340, color: '#10B981', connections: ['lb', 'sh', 'ps'] },
    { id: 'sh', label: 'Sharding', icon: '🗄️', href: '/system-design/sharding', category: 'System', x: 650, y: 600, color: '#F59E0B', connections: ['lb', 'ca'] },
    { id: 'ps', label: 'Pub / Sub', icon: '📡', href: '/system-design/pub-sub', category: 'System', x: 480, y: 600, color: '#EC4899', connections: ['gt', 'ca', 'sh'] },
];

export default function UniversePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgW = 900;
    const svgH = 680;

    return (
        <div className="page-container" style={{ minHeight: '100vh' }}>
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>🌌 Pattern Universe</div>
                <h1 className="page-title gradient-text">Algorithm Universe</h1>
                <p className="page-subtitle">Every pattern is a node in an interconnected galaxy. Click any node to enter that challenge.</p>
            </div>

            {/* SVG Universe Map */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                {/* Nebula background */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

                <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                        {NODES.map((n) => (
                            <filter key={n.id} id={`glow-${n.id}`}>
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        ))}
                    </defs>

                    {/* Edges */}
                    {NODES.map((n) =>
                        n.connections.map((c) => {
                            const target = NODES.find((nd) => nd.id === c);
                            if (!target) return null;
                            return (
                                <line key={`${n.id}-${c}`}
                                    x1={n.x} y1={n.y} x2={target.x} y2={target.y}
                                    stroke={`${n.color}30`} strokeWidth={1.5}
                                    strokeDasharray="4 6"
                                />
                            );
                        })
                    )}

                    {/* Nodes */}
                    {NODES.map((n, i) => (
                        <g key={n.id}>
                            {/* Ambient glow ring */}
                            <motion.circle
                                cx={n.x} cy={n.y} r={34}
                                fill={`${n.color}12`}
                                animate={{ r: [34, 40, 34] }}
                                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            <a href={n.href} style={{ cursor: 'pointer' }}>
                                <motion.circle
                                    cx={n.x} cy={n.y} r={26}
                                    fill={`${n.color}20`}
                                    stroke={n.color}
                                    strokeWidth={1.5}
                                    filter={`url(#glow-${n.id})`}
                                    whileHover={{ scale: 1.25 }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                />
                                <text x={n.x} y={n.y - 2} textAnchor="middle" dominantBaseline="central" fontSize="18" style={{ cursor: 'pointer' }}>{n.icon}</text>
                                <text x={n.x} y={n.y + 38} textAnchor="middle" fill={n.color} fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="600">{n.label}</text>
                                <text x={n.x} y={n.y + 52} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter, sans-serif">{n.category}</text>
                            </a>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'DSA Patterns', color: '#7C3AED' },
                    { label: 'Greedy Algorithms', color: '#A78BFA' },
                    { label: 'System Design', color: '#06B6D4' },
                ].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, boxShadow: `0 0 8px ${l.color}60` }} />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
