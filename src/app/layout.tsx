import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayla Maintenance",
  description: "Multi-Tenant Maintenance Management System",
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
