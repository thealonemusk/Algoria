'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    Globe,
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
    Hexagon,
    Trophy,
} from 'lucide-react';

const sections = [
    {
        label: 'Explore',
        items: [
            { href: '/', label: 'Home', Icon: Home },
            { href: '/universe', label: 'Pattern Universe', Icon: Globe },
        ],
    },
    {
        label: 'DSA Patterns',
        items: [
            { href: '/dsa/sliding-window', label: 'Sliding Window', Icon: SlidersHorizontal, badge: 'O(n)' },
            { href: '/dsa/two-pointer', label: 'Two Pointer', Icon: Pointer, badge: 'O(n)' },
            { href: '/dsa/binary-search', label: 'Binary Search', Icon: Search, badge: 'O(log n)' },
            { href: '/dsa/graph-traversal', label: 'Graph Traversal', Icon: Network, badge: 'BFS/DFS' },
            { href: '/dsa/dynamic-programming', label: 'Dynamic Programming', Icon: Layers, badge: 'DP' },
        ],
    },
    {
        label: 'Greedy',
        items: [
            { href: '/greedy/job-scheduling', label: 'Job Scheduling', Icon: Calendar, badge: 'O(n log n)' },
            { href: '/greedy/knapsack', label: 'Fractional Knapsack', Icon: Package, badge: 'Greedy' },
            { href: '/greedy/interval-merge', label: 'Interval Merging', Icon: BarChart2, badge: 'Greedy' },
        ],
    },
    {
        label: 'System Design',
        items: [
            { href: '/system-design/load-balancer', label: 'Load Balancer', Icon: Scale },
            { href: '/system-design/caching', label: 'Caching', Icon: Zap },
            { href: '/system-design/sharding', label: 'Sharding', Icon: Database },
            { href: '/system-design/pub-sub', label: 'Pub / Sub', Icon: Radio },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="sidebar">
            <Link href="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
                <div className="sidebar-logo-mark">
                    <Hexagon size={16} strokeWidth={2.5} />
                </div>
                <span className="sidebar-logo-text">Algoria</span>
            </Link>

            {sections.map((section) => (
                <div key={section.label} className="sidebar-section">
                    <div className="sidebar-section-label">{section.label}</div>
                    {section.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <item.Icon className="sidebar-nav-icon" size={15} strokeWidth={1.8} />
                            <span>{item.label}</span>
                            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </div>
            ))}

            {/* Gamification Profile */}
            <div style={{ marginTop: 'auto', padding: '24px 20px', borderTop: '1px solid rgba(26, 18, 9, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Trophy size={18} />
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>Level 5 Architect</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>1,250 / 2,000 XP</div>
                    </div>
                </div>

                <div style={{ width: '100%', height: 6, background: 'rgba(26, 18, 9, 0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '62%' }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                        style={{ height: '100%', background: 'var(--primary)', borderRadius: 4 }}
                    />
                </div>
            </div>
        </nav>
    );
}
