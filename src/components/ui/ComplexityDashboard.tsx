'use client';

import { motion } from 'framer-motion';

interface ComplexityMetric {
    label: string;
    value: string;
    subtext: string;
    color: string;
    barPercent: number;
}

interface ComplexityDashboardProps {
    strategies: {
        label: string;
        time: string;
        space: string;
        ops: number;
        barColor: string;
        maxOps: number;
    }[];
    visible: boolean;
}

export function ComplexityDashboard({ strategies, visible }: ComplexityDashboardProps) {
    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="section-label" style={{ marginTop: 8 }}>Performance Comparison</div>
            <div className="complexity-dashboard">
                {strategies.map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="complexity-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12, duration: 0.4 }}
                    >
                        <div className="complexity-card-label">{s.label}</div>
                        <div className="complexity-card-value" style={{ color: s.barColor }}>
                            {s.time}
                        </div>
                        <div className="complexity-card-sub">Space: {s.space}</div>
                        <div className="complexity-bar-track" style={{ marginTop: 16 }}>
                            <motion.div
                                className="complexity-bar-fill"
                                style={{ background: s.barColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (s.ops / s.maxOps) * 100)}%` }}
                                transition={{ delay: i * 0.15 + 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                        <div className="complexity-card-sub" style={{ marginTop: 6 }}>
                            ~{s.ops} operations
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
