'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    if (isLandingPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
