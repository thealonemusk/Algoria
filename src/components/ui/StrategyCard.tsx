'use client';

import { motion } from 'framer-motion';
import {
    Hammer, Wind, ArrowDown, Cpu, Zap, Mountain, Settings,
    TrendingUp, CheckCircle,
} from 'lucide-react';

export type Strategy = {
    id: string;
    name: string;
    iconName: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    quality: 'bad' | 'ok' | 'good';
};

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
    hammer: Hammer,
    wind: Wind,
    cpu: Cpu,
    zap: Zap,
    mountain: Mountain,
    settings: Settings,
    trending: TrendingUp,
    check: CheckCircle,
    arrow: ArrowDown,
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

export function StrategyCard({ strategy, selected, onClick, disabled, index }: StrategyCardProps) {
    const Icon = ICON_MAP[strategy.iconName] ?? Settings;

    return (
        <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!disabled ? { y: -3 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`strategy-card ${selected ? 'selected' : ''}`}
            onClick={!disabled ? onClick : undefined}
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                textAlign: 'left',
            }}
        >
            <div className="strategy-card-icon-wrap">
                <Icon size={17} strokeWidth={1.8} />
            </div>

            <div className="strategy-card-name">{strategy.name}</div>
            <div className="strategy-card-desc">{strategy.description}</div>

            <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`strategy-card-complexity ${qualityClass[strategy.quality]}`}>
                    {strategy.timeComplexity}
                </span>
                <span className="strategy-card-complexity complexity-ok">
                    {strategy.spaceComplexity}
                </span>
            </div>

            <div style={{
                position: 'absolute',
                top: 14, right: 14,
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
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
                        border: '1.5px solid var(--primary)',
                        pointerEvents: 'none',
                    }}
                />
            )}
        </motion.button>
    );
}
