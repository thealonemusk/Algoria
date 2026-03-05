'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Server { id: number; name: string; load: number; requests: number; color: string; emoji: string; }
interface Packet { id: number; x: number; targetX: number; y: number; serverId: number; stage: 'transit' | 'done'; }

const COLORS = ['#5B4FCF', '#2884A0', '#2E7D60', '#9A6E2A'];
const EMOJIS = ['🖥️', '💻', '🗄️', '⚙️'];
const STRATEGIES = ['Round Robin', 'Least Connections', 'Random', 'IP Hash'];

export default function LoadBalancerPage() {
    const [servers, setServers] = useState<Server[]>([
        { id: 0, name: 'Server A', load: 0, requests: 0, color: COLORS[0], emoji: EMOJIS[0] },
        { id: 1, name: 'Server B', load: 0, requests: 0, color: COLORS[1], emoji: EMOJIS[1] },
        { id: 2, name: 'Server C', load: 0, requests: 0, color: COLORS[2], emoji: EMOJIS[2] },
        { id: 3, name: 'Server D', load: 0, requests: 0, color: COLORS[3], emoji: EMOJIS[3] },
    ]);
    const [packets, setPackets] = useState<Packet[]>([]);
    const [strategy, setStrategy] = useState<string>('Round Robin');
    const [running, setRunning] = useState(false);
    const [totalRequests, setTotalRequests] = useState(0);
    const rrRef = useRef(0);
    const packetIdRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const getTargetServer = (strat: string, serverList: Server[]): number => {
        switch (strat) {
            case 'Round Robin': {
                const idx = rrRef.current % serverList.length;
                rrRef.current++;
                return idx;
            }
            case 'Least Connections':
                return serverList.reduce((min, s, i, arr) => s.load < arr[min].load ? i : min, 0);
            case 'Random':
                return Math.floor(Math.random() * serverList.length);
            case 'IP Hash':
                return Math.floor(Math.random() * serverList.length);
            default:
                return 0;
        }
    };

    const sendRequest = () => {
        setServers((prev) => {
            const targetIdx = getTargetServer(strategy, prev);
            const newPacket: Packet = {
                id: packetIdRef.current++,
                x: 120,
                targetX: 80 + targetIdx * 150,
                y: 100 + Math.random() * 30 - 15,
                serverId: targetIdx,
                stage: 'transit',
            };
            setPackets((p) => [...p, newPacket]);
            setTotalRequests((t) => t + 1);

            setTimeout(() => {
                setPackets((p) => p.filter((pk) => pk.id !== newPacket.id));
                setServers((s) => s.map((srv, i) => i === targetIdx
                    ? { ...srv, load: Math.min(100, srv.load + Math.floor(Math.random() * 15 + 5)), requests: srv.requests + 1 }
                    : srv
                ));
                setTimeout(() => {
                    setServers((s) => s.map((srv, i) => i === targetIdx
                        ? { ...srv, load: Math.max(0, srv.load - Math.floor(Math.random() * 8)) }
                        : srv
                    ));
                }, 1500);
            }, 800);

            return prev;
        });
    };

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(sendRequest, 600);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, strategy]);

    const reset = () => {
        setRunning(false);
        setServers((s) => s.map((srv) => ({ ...srv, load: 0, requests: 0 })));
        setPackets([]);
        setTotalRequests(0);
        rrRef.current = 0;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>⚖️ System Design</div>
                <h1 className="page-title gradient-text">Load Balancer Simulation</h1>
                <p className="page-subtitle">Watch requests distribute across servers in real time. Switch strategies to see how each algorithm affects load balance.</p>
            </div>

            {/* Strategy selector */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                {STRATEGIES.map((s) => (
                    <button
                        key={s}
                        onClick={() => { setStrategy(s); setRunning(false); }}
                        className={s === strategy ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '8px 18px', fontSize: 13 }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Sim */}
            <div className="sim-container" style={{ minHeight: 320 }}>
                {/* Packets flying */}
                <AnimatePresence>
                    {packets.map((pk) => (
                        <motion.div
                            key={pk.id}
                            initial={{ opacity: 0, scale: 0, left: 60, top: pk.y }}
                            animate={{ opacity: 1, scale: 1, left: pk.targetX + 20, top: servers[pk.serverId] ? 200 : pk.y }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="sim-packet"
                            style={{ background: servers[pk.serverId]?.color, position: 'absolute' }}
                        />
                    ))}
                </AnimatePresence>

                {/* Source */}
                <div style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="sim-server-box" style={{ borderColor: 'var(--accent)', boxShadow: running ? '0 0 20px var(--accent-glow)' : 'none' }}>
                        🌐
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Internet</div>
                    <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--accent)' }}>{totalRequests} req</div>
                </div>

                {/* LB icon */}
                <div style={{ position: 'absolute', left: '38%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={`sim-server-box ${running ? 'active' : ''}`} style={{ width: 64, height: 64, fontSize: 28 }}>⚖️</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Load Balancer</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{strategy}</div>
                </div>

                {/* Servers */}
                <div style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {servers.map((srv) => (
                        <div key={srv.id} className="sim-server-node">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <motion.div
                                    className={`sim-server-box ${srv.load > 60 ? 'active' : ''}`}
                                    animate={{ borderColor: srv.load > 80 ? '#9B3535' : srv.load > 40 ? srv.color : 'var(--border)' }}
                                >
                                    {srv.emoji}
                                </motion.div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{srv.name}</div>
                                    <div className="complexity-bar-track" style={{ width: 100, marginTop: 4 }}>
                                        <motion.div
                                            className="complexity-bar-fill"
                                            style={{ background: srv.load > 80 ? '#9B3535' : srv.color }}
                                            animate={{ width: `${srv.load}%` }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                                        {srv.load}% load · {srv.requests} req
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <motion.button
                    className={running ? 'btn-secondary' : 'btn-primary'}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setRunning((v) => !v)}
                >
                    {running ? '⏸ Pause' : '▶ Start Simulation'}
                </motion.button>
                <button className="btn-secondary" onClick={sendRequest}>📨 Send 1 Request</button>
                <button className="btn-secondary" onClick={reset}>↺ Reset</button>
            </div>

            {/* Info */}
            <div className="complexity-dashboard" style={{ marginTop: 24 }}>
                {[
                    { label: 'Round Robin', desc: 'Equal distribution, sequential', color: '#5B4FCF' },
                    { label: 'Least Connections', desc: 'Routes to server with fewest active connections', color: '#2884A0' },
                    { label: 'Random', desc: 'Stateless, simple, unpredictable', color: '#2E7D60' },
                    { label: 'IP Hash', desc: 'Same client always hits same server (session affinity)', color: '#9A6E2A' },
                ].map((s) => (
                    <div key={s.label} className="complexity-card" style={{ borderColor: strategy === s.label ? s.color : 'var(--border)' }}>
                        <div className="complexity-card-label">{s.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
