'use client';

import { motion, AnimatePresence } from 'framer-motion';

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
            {label && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="array-bar-label"
                    style={{ color: 'var(--accent)', fontWeight: 700 }}
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
        <div className="array-visualizer">
            {/* Window overlay */}
            <AnimatePresence>
                {windowStart !== undefined && windowEnd !== undefined && (
                    <motion.div
                        key={`window-${windowStart}-${windowEnd}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            bottom: 48,
                            left: `calc(${windowStart * (42 + 4) + 24}px)`,
                            width: `${(windowEnd - windowStart + 1) * (42 + 4) - 4}px`,
                            top: 24,
                            border: '2px solid rgba(124,58,237,0.6)',
                            borderRadius: 10,
                            background: 'rgba(124,58,237,0.05)',
                            pointerEvents: 'none',
                            transition: 'left 400ms cubic-bezier(0.16,1,0.3,1)',
                            boxShadow: '0 0 24px rgba(124,58,237,0.2)',
                        }}
                    />
                )}
            </AnimatePresence>

            {array.map((value, i) => (
                <ArrayBar
                    key={i}
                    value={value}
                    maxValue={maxValue}
                    state={getState(i)}
                    index={i}
                    delay={i}
                />
            ))}
        </div>
    );
}
