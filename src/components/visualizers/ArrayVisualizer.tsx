'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ArrayBarProps {
    value: number;
    maxValue: number;
    state: 'default' | 'active' | 'window' | 'pointer-left' | 'pointer-right' | 'eliminated' | 'complete' | 'result';
    index: number;
    label?: string;
    showLabel?: boolean;
    delay?: number;
}

const stateColors: Record<ArrayBarProps['state'], string> = {
    default: '',
    active: 'active',
    window: 'window',
    'pointer-left': 'pointer-left',
    'pointer-right': 'pointer-right',
    eliminated: 'eliminated',
    complete: 'complete',
    result: 'complete',
};

export function ArrayBar({ value, maxValue, state, index, label, showLabel = true, delay = 0 }: ArrayBarProps) {
    const heightPct = Math.max(12, (value / maxValue) * 140);

    return (
        <motion.div
            className="array-bar-wrapper"
            style={{ position: 'relative' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            {showLabel && (
                <div className="array-bar-label" style={{ color: state === 'eliminated' ? 'var(--text-muted)' : '' }}>
                    {index}
                </div>
            )}
            <motion.div
                className={`array-bar ${stateColors[state]}`}
                animate={{ height: heightPct }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: heightPct }}
            />
            <div className="array-bar-value">{value}</div>

            {/* Real Visual Pointers */}
            <AnimatePresence>
                {(state === 'pointer-left' || state === 'pointer-right') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                            position: 'absolute',
                            bottom: -24,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: state === 'pointer-left' ? 'var(--success)' : 'var(--warning)',
                        }}
                    >
                        <ChevronUp size={20} strokeWidth={3} />
                    </motion.div>
                )}
            </AnimatePresence>

            {label && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="array-bar-label"
                    style={{ color: 'var(--accent)', fontWeight: 700, position: 'absolute', bottom: -40 }}
                >
                    {label}
                </motion.div>
            )}
        </motion.div>
    );
}

interface ArrayVisualizerProps {
    array: number[];
    windowStart?: number;
    windowEnd?: number;
    leftPointer?: number;
    rightPointer?: number;
    activeIndices?: number[];
    eliminatedLeft?: number; // everything below this index is eliminated
    eliminatedRight?: number; // everything above this index is eliminated
    resultIndices?: number[];
    phase?: 'idle' | 'running' | 'complete';
}

export function ArrayVisualizer({
    array,
    windowStart,
    windowEnd,
    leftPointer,
    rightPointer,
    activeIndices = [],
    eliminatedLeft,
    eliminatedRight,
    resultIndices = [],
    phase = 'idle',
}: ArrayVisualizerProps) {
    const maxValue = Math.max(...array, 1);

    const getState = (i: number): ArrayBarProps['state'] => {
        if (phase === 'complete' && resultIndices.includes(i)) return 'complete';
        if (eliminatedLeft !== undefined && i < eliminatedLeft) return 'eliminated';
        if (eliminatedRight !== undefined && i > eliminatedRight) return 'eliminated';
        if (leftPointer !== undefined && i === leftPointer) return 'pointer-left';
        if (rightPointer !== undefined && i === rightPointer) return 'pointer-right';
        if (windowStart !== undefined && windowEnd !== undefined && i >= windowStart && i <= windowEnd) return 'window';
        if (activeIndices.includes(i)) return 'active';
        return 'default';
    };

    return (
        <div className="array-visualizer" style={{ paddingBottom: 60 /* make room for pointers under bars */ }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                {/* Window overlay */}
                <AnimatePresence>
                    {windowStart !== undefined && windowEnd !== undefined && windowStart <= windowEnd && (
                        <motion.div
                            key={`window-${windowStart}-${windowEnd}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, left: windowStart * 44, width: (windowEnd - windowStart + 1) * 44 - 4 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                top: 12,
                                border: '2px solid rgba(124,58,237,0.6)',
                                borderRadius: 10,
                                background: 'rgba(124,58,237,0.08)',
                                pointerEvents: 'none',
                                transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
                                boxShadow: '0 0 24px rgba(124,58,237,0.2)',
                                zIndex: 0,
                            }}
                        />
                    )}
                </AnimatePresence>

                {array.map((value, i) => (
                    <div style={{ zIndex: 1 }} key={i}>
                        <ArrayBar
                            value={value}
                            maxValue={maxValue}
                            state={getState(i)}
                            index={i}
                            delay={i}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
