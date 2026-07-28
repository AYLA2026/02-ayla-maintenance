import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "آيلا للصيانة",
  description: "نظام إدارة الصيانة المتكامل",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#FAF7F2]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
