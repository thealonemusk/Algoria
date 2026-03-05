'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Bell,
    Minus,
    SlidersHorizontal,
    Pointer,
    Search,
    Network,
    Layers,
    Calendar,
    Package,
    BarChart2,
    Scale,
    Zap,
    Database,
    Radio,
    Eye,
    Play,
    BarChart,
    Lightbulb,
    Hexagon,
} from 'lucide-react';

/* ── Animated algorithm canvas ─────────────────────────────── */
function AlgoCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let raf: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const W = () => canvas.offsetWidth;
        const H = () => canvas.offsetHeight;

        // Generate array bars
        const BARS = 18;
        const values = Array.from({ length: BARS }, (_, i) =>
            Math.round(30 + Math.abs(Math.sin(i * 0.7)) * 60 + Math.random() * 30)
        );
        let windowStart = 0;
        let t = 0;

        const draw = () => {
            ctx.clearRect(0, 0, W(), H());
            t += 0.008;

            // Animate window
            windowStart = Math.floor((Math.sin(t * 0.5) * 0.5 + 0.5) * (BARS - 4));

            const barW = (W() - 60) / BARS;
            const maxVal = Math.max(...values);
            const maxBarH = H() - 70;

            values.forEach((v, i) => {
                const x = 30 + i * barW + 2;
                const barH = (v / maxVal) * maxBarH;
                const y = H() - 40 - barH;
                const inWindow = i >= windowStart && i < windowStart + 4;

                // Bar shadow / glow
                if (inWindow) {
                    ctx.shadowColor = 'rgba(26,18,9,0.25)';
                    ctx.shadowBlur = 8;
                    ctx.fillStyle = '#1A1209';
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(26, 18, 9, 0.12)';
                }

                // Rounded top bar
                const r = 4;
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + barW - 6 - r, y);
                ctx.quadraticCurveTo(x + barW - 6, y, x + barW - 6, y + r);
                ctx.lineTo(x + barW - 6, y + barH);
                ctx.lineTo(x, y + barH);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // Value label
                if (inWindow) {
                    ctx.fillStyle = 'rgba(26,18,9,0.5)';
                    ctx.font = `600 9px "Inter", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(String(v), x + (barW - 6) / 2, y - 6);
                }

                // Index
                ctx.fillStyle = 'rgba(26,18,9,0.25)';
                ctx.font = `400 9px "Inter", sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(String(i), x + (barW - 6) / 2, H() - 24);
            });

            // Window bracket top line
            const bx = 30 + windowStart * barW + 2;
            const bw = 4 * barW - 6;
            ctx.strokeStyle = '#1A1209';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(bx - 2, 20);
            ctx.lineTo(bx + bw + 2, 20);
            ctx.stroke();

            // Bracket left/right ticks
            ctx.beginPath();
            ctx.moveTo(bx - 2, 20);
            ctx.lineTo(bx - 2, 32);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx + bw + 2, 20);
            ctx.lineTo(bx + bw + 2, 32);
            ctx.stroke();

            // Label above bracket
            ctx.fillStyle = 'rgba(26,18,9,0.6)';
            ctx.font = `600 10px "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`window  k = 4`, bx + bw / 2, 14);

            raf = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
}

/* ── Patterns data ──────────────────────────────────────────── */
const PATTERNS = [
    { label: 'Sliding Window', href: '/dsa/sliding-window', Icon: SlidersHorizontal, cat: 'DSA', diff: 'Easy' },
    { label: 'Two Pointer', href: '/dsa/two-pointer', Icon: Pointer, cat: 'DSA', diff: 'Easy' },
    { label: 'Binary Search', href: '/dsa/binary-search', Icon: Search, cat: 'DSA', diff: 'Easy' },
    { label: 'Graph Traversal', href: '/dsa/graph-traversal', Icon: Network, cat: 'DSA', diff: 'Medium' },
    { label: 'Dynamic Programming', href: '/dsa/dynamic-programming', Icon: Layers, cat: 'DSA', diff: 'Hard' },
    { label: 'Job Scheduling', href: '/greedy/job-scheduling', Icon: Calendar, cat: 'Greedy', diff: 'Medium' },
    { label: 'Fractional Knapsack', href: '/greedy/knapsack', Icon: Package, cat: 'Greedy', diff: 'Medium' },
    { label: 'Interval Merging', href: '/greedy/interval-merge', Icon: BarChart2, cat: 'Greedy', diff: 'Easy' },
    { label: 'Load Balancer', href: '/system-design/load-balancer', Icon: Scale, cat: 'System', diff: 'Medium' },
    { label: 'Caching', href: '/system-design/caching', Icon: Zap, cat: 'System', diff: 'Medium' },
    { label: 'Sharding', href: '/system-design/sharding', Icon: Database, cat: 'System', diff: 'Hard' },
    { label: 'Pub / Sub', href: '/system-design/pub-sub', Icon: Radio, cat: 'System', diff: 'Hard' },
];

const DIFF_CLS: Record<string, string> = {
    Easy: 'ldiff-easy',
    Medium: 'ldiff-medium',
    Hard: 'ldiff-hard',
};

const STEPS = [
    { Icon: Eye, title: 'See the Problem', desc: 'Visual problem statement with animated data. No abstract descriptions.' },
    { Icon: Layers, title: 'Pick a Strategy', desc: 'Brute Force, Optimal, or anything in between — you decide.' },
    { Icon: Play, title: 'Watch It Execute', desc: 'Step-by-step animation shows exactly what the algorithm does.' },
    { Icon: BarChart, title: 'Compare Performance', desc: 'Operations count, time complexity, and why one approach wins.' },
];

/* ── Page ───────────────────────────────────────────────────── */
export default function HomePage() {
    return (
        <div className="landing-root">
            {/* ── NAV ─────────────────────────────────── */}
            <nav className="landing-nav">
                <div className="landing-nav-logo">
                    <div className="landing-nav-logo-mark">
                        <Hexagon size={16} strokeWidth={2.5} />
                    </div>
                    <span className="landing-nav-logo-text">Algoria</span>
                </div>
                <div className="landing-nav-actions">
                    <button className="nav-circle-btn" aria-label="Notifications">
                        <Bell size={15} />
                    </button>
                    <button className="nav-circle-btn" aria-label="Menu">
                        <Minus size={15} />
                    </button>
                </div>
            </nav>

            {/* ── HERO ─────────────────────────────────── */}
            <section className="landing-hero">
                {/* Left text column */}
                <div className="landing-hero-left">
                    <motion.div
                        className="landing-hero-eyebrow"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="landing-hero-eyebrow-line" />
                        Visual Learning Platform
                    </motion.div>

                    <motion.h1
                        className="landing-hero-title"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span>Algorithm</span>
                        <br />
                        <span>Exploration</span>
                        <span
                            style={{
                                display: 'block',
                                color: '#1A1209',
                                fontStyle: 'italic',
                                fontWeight: 700,
                            }}
                        >
                            Reimagined
                        </span>
                    </motion.h1>

                    <motion.p
                        className="landing-hero-subtitle"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        No code. No memorization. Choose strategies, watch animations, understand patterns through experimentation.
                    </motion.p>

                    <motion.div
                        className="landing-hero-cta"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link href="/dsa/sliding-window" className="btn-dark">
                            Start Learning
                            <ArrowRight size={15} />
                        </Link>
                        <Link href="/universe" className="btn-outline-dark">
                            View Universe
                        </Link>
                    </motion.div>

                    {/* Mini stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ display: 'flex', gap: 32, marginTop: 48 }}
                    >
                        {[['12', 'Patterns'], ['3', 'Categories'], ['100%', 'Visual']].map(([n, l]) => (
                            <div key={l}>
                                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#1A1209' }}>{n}</div>
                                <div style={{ fontSize: 11, color: 'rgba(26,18,9,0.4)', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{l}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Center — canvas */}
                <div className="landing-hero-canvas-area">
                    {/* Large background text */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 800,
                            fontSize: 'clamp(80px, 14vw, 200px)',
                            color: 'rgba(26,18,9,0.04)',
                            letterSpacing: '-0.06em',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                        }}>
                            Algoria
                        </div>
                    </div>

                    {/* Floating annotation top */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{ position: 'absolute', top: 100, left: '60%', zIndex: 10 }}
                    >
                        <div className="landing-annotation">
                            <div className="landing-annotation-dot" />
                            <div className="landing-annotation-line" />
                            <div className="landing-annotation-text">Sliding Window — O(n)</div>
                        </div>
                    </motion.div>

                    {/* Canvas wrapper */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            width: '100%',
                            maxWidth: 580,
                            height: 280,
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: 20,
                            border: '1.5px solid rgba(26,18,9,0.1)',
                            boxShadow: '0 24px 60px rgba(26,18,9,0.08), 0 4px 16px rgba(26,18,9,0.04)',
                            overflow: 'hidden',
                            backdropFilter: 'blur(20px)',
                            position: 'relative',
                            zIndex: 10,
                        }}
                    >
                        {/* Header bar */}
                        <div style={{
                            padding: '12px 18px',
                            borderBottom: '1px solid rgba(26,18,9,0.07)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <div style={{ display: 'flex', gap: 5 }}>
                                {['#FF5F56', '#FFBD2E', '#27C93F'].map((c) => (
                                    <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                                ))}
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(26,18,9,0.4)', fontFamily: 'JetBrains Mono' }}>
                                Maximum Sum Subarray — Strategy: Sliding Window
                            </div>
                        </div>
                        <div style={{ height: 'calc(100% - 41px)', padding: '8px 0 0' }}>
                            <AlgoCanvas />
                        </div>
                    </motion.div>

                    {/* Bottom label */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        style={{ position: 'absolute', bottom: 100, left: '55%', zIndex: 10 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(26,18,9,0.45)', fontFamily: 'Inter, sans-serif' }}>
                            <Lightbulb size={12} />
                            Active window highlighted in dark
                        </div>
                    </motion.div>
                </div>

                {/* Right numbers */}
                <div className="landing-hero-right-numbers" style={{ zIndex: 1 }}>
                    {[
                        { n: '01', label: 'Choose Strategy', sub: 'Brute / Optimal' },
                        { n: '02', label: 'Watch Animation', sub: 'Step-by-step' },
                        { n: '03', label: 'Compare Results', sub: 'Complexity meter' },
                    ].map((item) => (
                        <motion.div
                            key={item.n}
                            className="landing-number-item"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Number(item.n) * 0.12, duration: 0.55 }}
                        >
                            <div className="landing-number-item-num">{item.n}</div>
                            <div className="landing-number-item-label">{item.label}</div>
                            <div className="landing-number-item-sub">{item.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="landing-scroll-indicator">
                    <div className="scroll-circle">↓</div>
                    <span className="scroll-label">Scroll</span>
                </div>
            </section>

            {/* ── PATTERNS SECTION ──────────────────── */}
            <section className="landing-patterns-section">
                <div className="landing-section-header">
                    <h2 className="landing-section-title">
                        Pattern<br />Library
                    </h2>
                    <span className="landing-section-count">12 interactive simulations</span>
                </div>

                <div className="landing-pattern-grid">
                    {PATTERNS.map((p, i) => (
                        <motion.div
                            key={p.href}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04, duration: 0.4 }}
                        >
                            <Link href={p.href} className="landing-pattern-card">
                                <div className={`landing-pattern-card-diff ${DIFF_CLS[p.diff]}`}>{p.diff}</div>
                                <div className="landing-pattern-icon-wrap">
                                    <p.Icon size={18} strokeWidth={1.8} />
                                </div>
                                <div className="landing-pattern-card-name">{p.label}</div>
                                <div className="landing-pattern-card-cat">{p.cat}</div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────── */}
            <section className="landing-how-section">
                <h2 className="landing-how-title">How it works</h2>

                <div className="landing-steps-grid">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.title}
                            className="landing-step"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07, duration: 0.4 }}
                        >
                            <div className="landing-step-num">0{i + 1}</div>
                            <div className="landing-step-icon">
                                <s.Icon size={20} strokeWidth={1.6} />
                            </div>
                            <div className="landing-step-title">{s.title}</div>
                            <div className="landing-step-desc">{s.desc}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="landing-stats-strip">
                    {[['12', 'Patterns'], ['5', 'DSA Topics'], ['4', 'System Design Sims'], ['0', 'Lines of Code Needed']].map(([n, l]) => (
                        <div key={l} className="landing-stat">
                            <div className="landing-stat-num">{n}</div>
                            <div className="landing-stat-label">{l}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
