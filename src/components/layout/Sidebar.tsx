'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
            <div className="sidebar-logo">
                <div className="sidebar-logo-mark">
                    <Hexagon size={16} strokeWidth={2.5} />
                </div>
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
                            <item.Icon className="sidebar-nav-icon" size={15} strokeWidth={1.8} />
                            <span>{item.label}</span>
                            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </div>
            ))}
        </nav>
    );
}
