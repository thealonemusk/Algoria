'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
    {
        label: 'Explore',
        items: [
            { href: '/', label: 'Home', icon: '🏠' },
            { href: '/universe', label: 'Pattern Universe', icon: '🌌' },
        ],
    },
    {
        label: 'DSA Patterns',
        items: [
            { href: '/dsa/sliding-window', label: 'Sliding Window', icon: '🪟', badge: 'O(n)' },
            { href: '/dsa/two-pointer', label: 'Two Pointer', icon: '👆', badge: 'O(n)' },
            { href: '/dsa/binary-search', label: 'Binary Search', icon: '🔍', badge: 'O(log n)' },
            { href: '/dsa/graph-traversal', label: 'Graph Traversal', icon: '🕸️', badge: 'BFS/DFS' },
            { href: '/dsa/dynamic-programming', label: 'Dynamic Programming', icon: '🧩', badge: 'O(n²)' },
        ],
    },
    {
        label: 'Greedy',
        items: [
            { href: '/greedy/job-scheduling', label: 'Job Scheduling', icon: '🗓️', badge: 'O(n log n)' },
            { href: '/greedy/knapsack', label: 'Fractional Knapsack', icon: '🎒', badge: 'Greedy' },
            { href: '/greedy/interval-merge', label: 'Interval Merging', icon: '📊', badge: 'Greedy' },
        ],
    },
    {
        label: 'System Design',
        items: [
            { href: '/system-design/load-balancer', label: 'Load Balancer', icon: '⚖️' },
            { href: '/system-design/caching', label: 'Caching', icon: '⚡' },
            { href: '/system-design/sharding', label: 'Sharding', icon: '🗄️' },
            { href: '/system-design/pub-sub', label: 'Pub / Sub', icon: '📡' },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">⬡</div>
                <span className="sidebar-logo-text">Algoria</span>
            </div>

            {sections.map((section) => (
                <div key={section.label} className="sidebar-section">
                    <div className="sidebar-section-label">{section.label}</div>
                    {section.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="sidebar-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </div>
            ))}
        </nav>
    );
}
