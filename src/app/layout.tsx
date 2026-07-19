import type { Metadata } from 'next';
import { Tajawal, Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Sidebar from '@/components/layout/Sidebar';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'آيلا للصيانة | Ayla Maintenance',
  description: 'نظام إدارة الصيانة الذكي المتكامل - منصة أيلا الرقمية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable}`}>
      <body className="font-ayla antialiased">
        <Providers>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:mr-72 p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}