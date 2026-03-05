import type { Metadata } from 'next';
import '../styles/globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
    title: 'Algoria — Visual Algorithm Learning',
    description: 'Learn DSA and System Design through interactive visual simulations. No code required.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
