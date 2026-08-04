import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "آيلا للصيانة",
  description: "نظام إدارة الصيانة الذكي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} bg-[#FAF7F2]`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}