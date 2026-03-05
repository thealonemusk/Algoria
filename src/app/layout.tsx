import type { Metadata } from 'next';
import '../styles/globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
    title: 'Algoria — Visual Algorithm Learning',
    description: 'Learn DSA and System Design through interactive visual simulations. No code required.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AppLayout>{children}</AppLayout>
            </body>
        </html>
    );
}
