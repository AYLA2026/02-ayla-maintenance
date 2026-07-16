import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'آيلا - منصة الصيانة الذكية',
  description: 'نظام إدارة الصيانة المتكامل للمدارس',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 lg:mr-72 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
