'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let animId: number;
        let W = window.innerWidth;
        let H = window.innerHeight;

        canvas.width = W;
        canvas.height = H;

        const resize = () => {
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W; canvas.height = H;
        };
        window.addEventListener('resize', resize);

        // Nodes
        const N = 70;
        type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
        const nodes: Node[] = Array.from({ length: N }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2 + 1, hue: Math.random() > 0.5 ? 265 : 195,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Draw connections
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `hsla(${nodes[i].hue}, 80%, 65%, ${(1 - dist / 120) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach((n) => {
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
                grad.addColorStop(0, `hsla(${n.hue}, 80%, 70%, 0.9)`);
                grad.addColorStop(1, `hsla(${n.hue}, 80%, 70%, 0)`);
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${n.hue}, 90%, 75%, 1)`;
                ctx.fill();

                // Update
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
            });

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
}

const PATTERNS = [
    { icon: '🪟', name: 'Sliding Window', href: '/dsa/sliding-window', category: 'DSA', diff: 'Easy' },
    { icon: '👆', name: 'Two Pointer', href: '/dsa/two-pointer', category: 'DSA', diff: 'Easy' },
    { icon: '🔍', name: 'Binary Search', href: '/dsa/binary-search', category: 'DSA', diff: 'Easy' },
    { icon: '🕸️', name: 'Graph Traversal', href: '/dsa/graph-traversal', category: 'DSA', diff: 'Medium' },
    { icon: '🧩', name: 'Dynamic Programming', href: '/dsa/dynamic-programming', category: 'DSA', diff: 'Hard' },
    { icon: '🗓️', name: 'Job Scheduling', href: '/greedy/job-scheduling', category: 'Greedy', diff: 'Medium' },
    { icon: '🎒', name: 'Fractional Knapsack', href: '/greedy/knapsack', category: 'Greedy', diff: 'Medium' },
    { icon: '📊', name: 'Interval Merge', href: '/greedy/interval-merge', category: 'Greedy', diff: 'Easy' },
    { icon: '⚖️', name: 'Load Balancer', href: '/system-design/load-balancer', category: 'System', diff: 'Medium' },
    { icon: '⚡', name: 'Caching', href: '/system-design/caching', category: 'System', diff: 'Medium' },
    { icon: '🗄️', name: 'Sharding', href: '/system-design/sharding', category: 'System', diff: 'Hard' },
    { icon: '📡', name: 'Pub / Sub', href: '/system-design/pub-sub', category: 'System', diff: 'Hard' },
];

const DIFF_CLASS: Record<string, string> = { Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard' };

export default function HomePage() {
    return (
        <>
            {/* HERO */}
            <section className="hero-section">
                <ParticleCanvas />
                <div className="hero-content">
                    <motion.div className="hero-badge" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                        ⬡ Visual Algorithm Learning Platform
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Explore Algorithms<br />
                        <span className="gradient-text">Like a Universe</span>
                    </motion.h1>

                    <motion.p
                        className="hero-sub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        No code. No memorization. Just pure visual experimentation.<br />
                        Choose strategies, watch algorithms animate, understand patterns.
                    </motion.p>

                    <motion.div
                        className="hero-cta-group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link href="/dsa/sliding-window" className="btn-primary">
                            🚀 Start Learning
                        </Link>
                        <Link href="/universe" className="btn-secondary">
                            🌌 Pattern Universe
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56 }}
                    >
                        {[['12', 'Patterns'], ['5', 'DSA Topics'], ['4', 'System Design Sims']].map(([num, label]) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {num}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* PATTERN GRID */}
            <section className="universe-section">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>🌌 Pattern Library</div>
                        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, fontFamily: 'Space Grotesk' }}>
                            Choose Your <span className="gradient-text">Pattern</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
                            12 interactive simulations spanning DSA patterns, Greedy algorithms, and System Design concepts.
                        </p>
                    </div>

                    <div className="pattern-grid">
                        {PATTERNS.map((p, i) => (
                            <motion.div
                                key={p.href}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <Link href={p.href} className="pattern-node-card">
                                    <div className={`pattern-node-difficulty ${DIFF_CLASS[p.diff]}`}>{p.diff}</div>
                                    <div className="pattern-node-icon">{p.icon}</div>
                                    <div className="pattern-node-name">{p.name}</div>
                                    <div className="pattern-node-category">{p.category}</div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ padding: '80px 48px', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, fontFamily: 'Space Grotesk' }}>
                        How <span className="gradient-text">Algoria</span> Works
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
                    {[
                        { step: '01', icon: '🎯', title: 'See the Problem', desc: 'A visual problem statement with animated data. No abstract descriptions.' },
                        { step: '02', icon: '🃏', title: 'Pick a Strategy', desc: 'Brute Force, Optimal, or everything in between. You choose.' },
                        { step: '03', icon: '▶', title: 'Watch It Execute', desc: 'Step-by-step animation shows exactly what the algorithm does.' },
                        { step: '04', icon: '📊', title: 'Compare Performance', desc: 'See operations count, time complexity, and why one wins.' },
                    ].map((s) => (
                        <motion.div
                            key={s.step}
                            className="glass-card"
                            style={{ padding: 28 }}
                            whileHover={{ y: -4, borderColor: 'var(--border-active)' }}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--primary)', marginBottom: 12, letterSpacing: '0.1em' }}>{s.step}</div>
                            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                            <div style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
