'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, User, Download, RefreshCw } from 'lucide-react';

const SHARD_COUNT = 4;
const SHARD_COLORS = ['#5B4FCF', '#2884A0', '#2E7D60', '#9A6E2A'];
const SHARD_NAMES = ['Shard 0\n(A-G)', 'Shard 1\n(H-N)', 'Shard 2\n(O-T)', 'Shard 3\n(U-Z)'];

interface DataRecord { key: string; shardIdx: number; id: number; }

let idCounter = 0;

function hashKey(key: string): number {
    // Simple hash: first letter range
    const c = key.toLowerCase().charCodeAt(0) - 97;
    return Math.min(3, Math.floor(c / 6.5));
}

function rangeKey(key: string): number {
    const c = key.toLowerCase().charCodeAt(0) - 97;
    return Math.min(3, Math.floor(c / 6.5));
}

const SAMPLE_KEYS = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivan', 'Olivia', 'Peter', 'Quinn', 'Sara', 'Tom', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zara'];
type Strategy = 'Hash' | 'Range' | 'Round Robin';

export default function ShardingPage() {
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [strategy, setStrategy] = useState<Strategy>('Hash');
    const [highlighted, setHighlighted] = useState<number | null>(null);
    const [keyIdx, setKeyIdx] = useState(0);
    const rrRef = { current: 0 };

    const insert = () => {
        if (keyIdx >= SAMPLE_KEYS.length) return;
        const key = SAMPLE_KEYS[keyIdx];
        let shardIdx = 0;
        if (strategy === 'Hash') shardIdx = hashKey(key);
        else if (strategy === 'Range') shardIdx = rangeKey(key);
        else shardIdx = (keyIdx) % SHARD_COUNT;

        const rec: DataRecord = { key, shardIdx, id: idCounter++ };
        setRecords((prev) => [...prev, rec]);
        setHighlighted(shardIdx);
        setTimeout(() => setHighlighted(null), 600);
        setKeyIdx((i) => i + 1);
    };

    const shardRecords = (idx: number) => records.filter((r) => r.shardIdx === idx);

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><Database size={14} /> System Design</div>
                <h1 className="page-title gradient-text">Sharding — Data Distribution</h1>
                <p className="page-subtitle">Watch how data is distributed across {SHARD_COUNT} database shards. Compare Hash, Range, and Round Robin strategies.</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                {(['Hash', 'Range', 'Round Robin'] as Strategy[]).map((s) => (
                    <button key={s} onClick={() => { setStrategy(s); setRecords([]); setKeyIdx(0); }} className={s === strategy ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 18px', fontSize: 13 }}>{s} Sharding</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
                {Array.from({ length: SHARD_COUNT }, (_, i) => {
                    const recs = shardRecords(i);
                    return (
                        <motion.div
                            key={i}
                            className="glass-card"
                            animate={{ borderColor: highlighted === i ? SHARD_COLORS[i] : 'var(--border)', boxShadow: highlighted === i ? `0 0 24px ${SHARD_COLORS[i]}40` : 'none' }}
                            style={{ padding: 24, minHeight: 320 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: SHARD_COLORS[i] }} />
                                <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk', color: SHARD_COLORS[i] }}>
                                    {SHARD_NAMES[i].replace('\n', ' ')}
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{recs.length} records</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <AnimatePresence>
                                    {recs.map((r) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, x: -10, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            className="info-tag"
                                            style={{ fontSize: 14, padding: '6px 12px', color: SHARD_COLORS[i], borderColor: `${SHARD_COLORS[i]}40` }}
                                        >
                                            <User size={14} style={{ marginRight: 6, display: 'inline' }} /> {r.key}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-primary" onClick={insert} disabled={keyIdx >= SAMPLE_KEYS.length} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Download size={14} /> Insert "{keyIdx < SAMPLE_KEYS.length ? SAMPLE_KEYS[keyIdx] : 'done'}"
                </button>
                <button className="btn-secondary" onClick={() => { setRecords([]); setKeyIdx(0); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RefreshCw size={14} /> Reset
                </button>
            </div>

            <div className="complexity-dashboard" style={{ marginTop: 24 }}>
                {[
                    { label: 'Hash Sharding', desc: 'Uniform distribution. No range queries.', color: '#5B4FCF' },
                    { label: 'Range Sharding', desc: 'Efficient range queries, but can cause hotspots.', color: '#2884A0' },
                    { label: 'Round Robin', desc: 'Perfectly even. No locality, no range support.', color: '#2E7D60' },
                ].map((s) => (
                    <div key={s.label} className="complexity-card" style={{ borderColor: strategy === s.label.split(' ')[0] ? s.color : 'var(--border)' }}>
                        <div className="complexity-card-label">{s.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
