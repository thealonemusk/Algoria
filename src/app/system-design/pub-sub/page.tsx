'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Subscriber { id: string; name: string; topics: string[]; color: string; emoji: string; messages: string[]; }
interface Event { id: number; topic: string; payload: string; publishedAt: number; }

const TOPICS = ['user.created', 'order.placed', 'payment.done', 'email.sent', 'analytics.log'];
const TOPIC_COLORS: Record<string, string> = {
    'user.created': '#5B4FCF', 'order.placed': '#2884A0', 'payment.done': '#2E7D60',
    'email.sent': '#9A6E2A', 'analytics.log': '#85406A',
};

const INITIAL_SUBS: Subscriber[] = [
    { id: 'auth', name: 'Auth Service', topics: ['user.created'], color: '#5B4FCF', emoji: 'auth', messages: [] },
    { id: 'order', name: 'Order Service', topics: ['payment.done', 'order.placed'], color: '#2884A0', emoji: 'order', messages: [] },
    { id: 'email', name: 'Email Service', topics: ['user.created', 'order.placed', 'payment.done'], color: '#2E7D60', emoji: 'email', messages: [] },
    { id: 'analytics', name: 'Analytics', topics: ['user.created', 'order.placed', 'payment.done', 'email.sent', 'analytics.log'], color: '#9A6E2A', emoji: 'analytics', messages: [] },
];

export default function PubSubPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBS);
    const [events, setEvents] = useState<Event[]>([]);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [activeSubIds, setActiveSubIds] = useState<string[]>([]);
    const [flying, setFlying] = useState<{ topic: string; subId: string; id: number }[]>([]);
    const flyIdRef = useRef(0);
    const eventIdRef = useRef(0);

    const publish = (topic: string) => {
        const payloads: Record<string, string> = {
            'user.created': '{ userId: "u_123", email: "alice@..." }',
            'order.placed': '{ orderId: "ord_42", total: "$99" }',
            'payment.done': '{ txnId: "txn_7", amount: "$99" }',
            'email.sent': '{ to: "alice@...", subject: "Welcome!" }',
            'analytics.log': '{ event: "page_view", page: "/home" }',
        };

        const evt: Event = { id: eventIdRef.current++, topic, payload: payloads[topic], publishedAt: Date.now() };
        setEvents((prev) => [evt, ...prev.slice(0, 9)]);
        setActiveTopic(topic);

        const matchedSubs = subscribers.filter((s) => s.topics.includes(topic));
        setActiveSubIds(matchedSubs.map((s) => s.id));

        // Animate packets flying to each subscriber
        matchedSubs.forEach((sub, i) => {
            const flyId = flyIdRef.current++;
            setTimeout(() => {
                setFlying((prev) => [...prev, { topic, subId: sub.id, id: flyId }]);
                setTimeout(() => {
                    setFlying((prev) => prev.filter((f) => f.id !== flyId));
                    setSubscribers((prev) =>
                        prev.map((s) => s.id === sub.id
                            ? { ...s, messages: [`[${topic}] ${payloads[topic].slice(0, 28)}...`, ...s.messages.slice(0, 4)] }
                            : s
                        )
                    );
                }, 700);
            }, i * 100);
        });

        setTimeout(() => { setActiveTopic(null); setActiveSubIds([]); }, 1500);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="challenge-phase-badge phase-selection" style={{ marginBottom: 12, display: 'inline-flex' }}>📡 System Design</div>
                <h1 className="page-title gradient-text">Pub / Sub — Event-Driven Architecture</h1>
                <p className="page-subtitle">Publish events to topics. Watch how subscribers receive only what they care about — decoupled, async, scalable.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                {/* Publisher */}
                <div>
                    <div className="section-label">Publisher — Choose Event to Publish</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {TOPICS.map((topic) => (
                            <motion.button
                                key={topic}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => publish(topic)}
                                className="glass-card"
                                style={{
                                    padding: '14px 18px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    borderColor: activeTopic === topic ? TOPIC_COLORS[topic] : 'var(--border)',
                                    boxShadow: activeTopic === topic ? `0 0 20px ${TOPIC_COLORS[topic]}40` : 'none',
                                }}
                            >
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: TOPIC_COLORS[topic], boxShadow: activeTopic === topic ? `0 0 12px ${TOPIC_COLORS[topic]}` : 'none' }} />
                                <div>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: TOPIC_COLORS[topic], fontWeight: 600 }}>{topic}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                        {subscribers.filter((s) => s.topics.includes(topic)).length} subscribers
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: 18 }}>📤</div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Event log */}
                    <div className="glass-card" style={{ padding: 16, marginTop: 16 }}>
                        <div className="section-label">Event Stream</div>
                        <AnimatePresence>
                            {events.map((e) => (
                                <motion.div
                                    key={e.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ fontSize: 11, fontFamily: 'JetBrains Mono', padding: '5px 0', borderBottom: '1px solid var(--border)', color: TOPIC_COLORS[e.topic] }}
                                >
                                    ▸ {e.topic}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Subscribers */}
                <div>
                    <div className="section-label">Subscribers</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {subscribers.map((sub) => {
                            const isActive = activeSubIds.includes(sub.id);
                            return (
                                <motion.div
                                    key={sub.id}
                                    className="glass-card"
                                    animate={{ borderColor: isActive ? sub.color : 'var(--border)', boxShadow: isActive ? `0 0 24px ${sub.color}40` : 'none' }}
                                    style={{ padding: 16 }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <motion.div
                                            animate={{ scale: isActive ? [1, 1.3, 1] : 1 }}
                                            transition={{ duration: 0.4 }}
                                            style={{ fontSize: 22 }}
                                        >
                                            {sub.emoji}
                                        </motion.div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: isActive ? sub.color : 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{sub.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                Subscribed: {sub.topics.map((t) => (
                                                    <span key={t} style={{ color: TOPIC_COLORS[t], marginRight: 6 }}>{t.split('.')[0]}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="challenge-phase-badge phase-running" style={{ marginLeft: 'auto' }}>
                                                📨 receiving
                                            </motion.div>
                                        )}
                                    </div>
                                    {sub.messages.length > 0 && (
                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                                            {sub.messages.slice(0, 3).map((m, i) => (
                                                <div key={i} style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', padding: '2px 0' }}>
                                                    {m}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
