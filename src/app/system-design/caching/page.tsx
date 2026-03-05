'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, RefreshCw, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

interface CacheEntry { key: string; value: string; hits: number; insertedAt: number; }

const SAMPLE_REQUESTS = ['GET /user/1', 'GET /product/42', 'GET /user/1', 'GET /home', 'GET /user/1', 'GET /product/42', 'GET /cart', 'GET /home', 'GET /user/99', 'GET /product/42'];
const CACHE_SIZE = 4;

type EvictionPolicy = 'LRU' | 'LFU' | 'FIFO';

export default function CachingPage() {
    const [cache, setCache] = useState<CacheEntry[]>([]);
    const [log, setLog] = useState<{ text: string; hit: boolean }[]>([]);
    const [stats, setStats] = useState({ hits: 0, misses: 0 });
    const [policy, setPolicy] = useState<EvictionPolicy>('LRU');
    const [flash, setFlash] = useState<{ key: string; hit: boolean } | null>(null);
    const [reqIdx, setReqIdx] = useState(0);
    const timeRef = useRef(0);

    const handleRequest = () => {
        if (reqIdx >= SAMPLE_REQUESTS.length) return;
        const req = SAMPLE_REQUESTS[reqIdx];
        const key = req.replace('GET ', '');
        timeRef.current++;

        setCache((prev) => {
            const existing = prev.find((e) => e.key === key);
            if (existing) {
                // Cache HIT
                setFlash({ key, hit: true });
                setTimeout(() => setFlash(null), 800);
                setStats((s) => ({ ...s, hits: s.hits + 1 }));
                setLog((l) => [{ text: `HIT  ${req}`, hit: true }, ...l.slice(0, 14)]);
                return prev.map((e) => e.key === key ? { ...e, hits: e.hits + 1, insertedAt: timeRef.current } : e);
            }

            // Cache MISS
            setFlash({ key, hit: false });
            setTimeout(() => setFlash(null), 800);
            setStats((s) => ({ ...s, misses: s.misses + 1 }));
            setLog((l) => [{ text: `MISS ${req} → fetched from DB`, hit: false }, ...l.slice(0, 14)]);

            const newEntry: CacheEntry = { key, value: `data_${key.replace('/', '_')}`, hits: 1, insertedAt: timeRef.current };
            if (prev.length < CACHE_SIZE) return [...prev, newEntry];

            let evictIdx = 0;
            if (policy === 'LRU') evictIdx = prev.reduce((mi, e, i, arr) => e.insertedAt < arr[mi].insertedAt ? i : mi, 0);
            else if (policy === 'LFU') evictIdx = prev.reduce((mi, e, i, arr) => e.hits < arr[mi].hits ? i : mi, 0);
            else evictIdx = 0; // FIFO

            const evicted = prev[evictIdx];
            setLog((l) => [{ text: `EVICT [${evicted.key}] (${policy})`, hit: false }, ...l.slice(0, 14)]);
            const next = [...prev];
            next[evictIdx] = newEntry;
            return next;
        });

        setReqIdx((i) => i + 1);
    };

    const reset = () => {
        setCache([]);
        setLog([]);
        setStats({ hits: 0, misses: 0 });
        setReqIdx(0);
        timeRef.current = 0;
    };

    const hitRate = stats.hits + stats.misses > 0 ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100) : 0;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><Zap size={14} /> System Design</div>
                <h1 className="page-title gradient-text">Caching — LRU / LFU / FIFO</h1>
                <p className="page-subtitle">Simulate a cache with size {CACHE_SIZE}. Fire requests and watch cache hits (green) and misses (red) with different eviction policies.</p>
            </div>

            {/* Policy */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {(['LRU', 'LFU', 'FIFO'] as EvictionPolicy[]).map((p) => (
                    <button key={p} onClick={() => { setPolicy(p); reset(); }} className={p === policy ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 20px', fontSize: 13 }}>{p}</button>
                ))}
            </div>

            {/* Flash feedback */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        style={{
                            position: 'fixed', top: 80, right: 40, zIndex: 999,
                            padding: '12px 24px', borderRadius: 12, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18,
                            background: flash.hit ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                            border: `1px solid ${flash.hit ? 'var(--success)' : 'var(--danger)'}`,
                            boxShadow: flash.hit ? '0 0 24px var(--success-glow)' : '0 0 24px var(--danger-glow)',
                            color: flash.hit ? 'var(--success)' : 'var(--danger)',
                        }}
                    >
                        {flash.hit ? 'CACHE HIT' : 'CACHE MISS'}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Cache slots */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label" style={{ fontSize: 14 }}>Cache ({cache.length}/{CACHE_SIZE} slots used)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
                            {Array.from({ length: CACHE_SIZE }, (_, i) => {
                                const entry = cache[i];
                                return (
                                    <AnimatePresence key={i} mode="wait">
                                        {entry ? (
                                            <motion.div
                                                key={entry.key}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="glass-card-elevated"
                                                style={{ padding: '20px 24px', border: flash?.key === entry.key ? `2px solid ${flash.hit ? 'var(--success)' : 'var(--danger)'}` : undefined, boxShadow: flash?.key === entry.key ? `0 0 24px ${flash.hit ? 'var(--success-glow)' : 'var(--danger-glow)'}` : undefined }}
                                            >
                                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Slot {i + 1}</div>
                                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: 'var(--accent)', fontWeight: 600 }}>{entry.key}</div>
                                                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Hits: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{entry.hits}</span></div>
                                            </motion.div>
                                        ) : (
                                            <div key={`empty-${i}`} style={{ padding: '14px 16px', borderRadius: 12, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Empty</span>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="complexity-dashboard">
                        <div className="complexity-card">
                            <div className="complexity-card-label">Hit Rate</div>
                            <div className="complexity-card-value" style={{ color: hitRate > 60 ? 'var(--success)' : 'var(--warning)' }}>{hitRate}%</div>
                            <div className="complexity-bar-track" style={{ marginTop: 12 }}>
                                <motion.div className="complexity-bar-fill" style={{ background: hitRate > 60 ? 'var(--success)' : 'var(--warning)' }} animate={{ width: `${hitRate}%` }} />
                            </div>
                        </div>
                        <div className="complexity-card">
                            <div className="complexity-card-label">Cache Hits</div>
                            <div className="complexity-card-value" style={{ color: 'var(--success)' }}>{stats.hits}</div>
                            <div className="complexity-card-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={12} /> Served from cache</div>
                        </div>
                        <div className="complexity-card">
                            <div className="complexity-card-label">Cache Misses</div>
                            <div className="complexity-card-value" style={{ color: 'var(--danger)' }}>{stats.misses}</div>
                            <div className="complexity-card-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><XCircle size={12} /> DB fetch required</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <motion.button whileTap={{ scale: 0.96 }} className="btn-primary" onClick={handleRequest} disabled={reqIdx >= SAMPLE_REQUESTS.length} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Send size={14} /> Fire Request {reqIdx < SAMPLE_REQUESTS.length ? `"${SAMPLE_REQUESTS[reqIdx]}"` : '(done)'}
                        </motion.button>
                        <button className="btn-secondary" onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><RefreshCw size={14} /> Reset</button>
                    </div>
                </div>

                {/* Log */}
                <div className="glass-card" style={{ padding: 20, maxHeight: 500, overflowY: 'auto' }}>
                    <div className="section-label">Request Log</div>
                    <AnimatePresence>
                        {log.map((entry, i) => (
                            <motion.div
                                key={`${entry.text}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ fontSize: 12, fontFamily: 'JetBrains Mono', padding: '6px 0', borderBottom: '1px solid var(--border)', color: entry.hit ? 'var(--success)' : 'var(--text-muted)' }}
                            >
                                {entry.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {log.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fire requests to see the log.</p>}
                </div>
            </div>
        </div>
    );
}
