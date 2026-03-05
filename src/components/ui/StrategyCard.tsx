'use client';

import { motion } from 'framer-motion';

export type Strategy = {
    id: string;
    name: string;
    icon: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    quality: 'bad' | 'ok' | 'good';
};

interface StrategyCardProps {
    strategy: Strategy;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    index: number;
}

const qualityClass: Record<Strategy['quality'], string> = {
    bad: 'complexity-bad',
    ok: 'complexity-ok',
    good: 'complexity-good',
};

const qualityLabel: Record<Strategy['quality'], string> = {
    bad: 'Brute Force',
    ok: 'Better',
    good: 'Optimal',
};

const cardClass: Record<Strategy['quality'], string> = {
    bad: 'brute-force',
    ok: 'better',
    good: 'optimal',
};

export function StrategyCard({ strategy, selected, onClick, disabled, index }: StrategyCardProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!disabled ? { y: -4, rotateX: 4 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            className={`strategy-card ${cardClass[strategy.quality]} ${selected ? 'selected' : ''}`}
            onClick={!disabled ? onClick : undefined}
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                textAlign: 'left',
                transformStyle: 'preserve-3d',
            }}
        >
            <div className="strategy-card-icon">{strategy.icon}</div>
            <div className="strategy-card-name">{strategy.name}</div>
            <div className="strategy-card-desc">{strategy.description}</div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className={`strategy-card-complexity ${qualityClass[strategy.quality]}`}>
                    Time: {strategy.timeComplexity}
                </span>
                <span className="strategy-card-complexity complexity-ok">
                    Space: {strategy.spaceComplexity}
                </span>
            </div>

            <div style={{
                position: 'absolute',
                top: 14, right: 14,
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                letterSpacing: '0.06em',
            }} className={qualityClass[strategy.quality]}>
                {qualityLabel[strategy.quality]}
            </div>

            {selected && (
                <motion.div
                    layoutId="selected-indicator"
                    style={{
                        position: 'absolute',
                        inset: -1,
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--primary)',
                        pointerEvents: 'none',
                    }}
                />
            )}
        </motion.button>
    );
}
