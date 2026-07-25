"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Building2, Wrench, Users, Truck, Package, Calendar, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { title: "المدارس", value: "12", icon: Building2, href: "/schools", color: "from-blue-500 to-blue-600" },
    { title: "الفرق", value: "5", icon: Users, href: "/teams", color: "from-green-500 to-green-600" },
    { title: "العمال", value: "48", icon: Users, href: "/workforce", color: "from-purple-500 to-purple-600" },
    { title: "المركبات", value: "8", icon: Truck, href: "/vehicles", color: "from-orange-500 to-orange-600" },
    { title: "المخزون", value: "156", icon: Package, href: "/inventory", color: "from-pink-500 to-pink-600" },
    { title: "مهام اليوم", value: "14", icon: Calendar, href: "/schedule", color: "from-cyan-500 to-cyan-600" },
  ];

  const alerts = [
    { title: "نفاد مخزون", desc: "لمبات LED — الكمية 8 (الحد الأدنى 20)", type: "warning" },
    { title: "صيانة متأخرة", desc: "مركبة أ ب ج 9012 — آخر صيانة 2026/05/20", type: "danger" },
    { title: "مهمة مجدولة", desc: "تنظيف مدرسة النور — 06:00 صباحاً", type: "info" },
  ];

  // Chart data
  const monthlyData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"],
    datasets: [
      {
        label: "البلاغات",
        data: [12, 19, 15, 25, 22, 30, 48],
        backgroundColor: "rgba(201, 162, 39, 0.8)",
        borderColor: "#C9A227",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const categoryData = {
    labels: ["كهرباء", "سباكة", "تكييف", "نجارة", "دهان", "تنظيف", "أخرى"],
    datasets: [
      {
        data: [15, 12, 8, 5, 4, 3, 1],
        backgroundColor: [
          "#C9A227", "#D4AF37", "#E5C158", "#B8921F",
          "#A07820", "#8B6914", "#6B4E0A",
        ],
        borderWidth: 0,
      },
    ],
  };

  const priorityTrend = {
    labels: ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"],
    datasets: [
      {
        label: "عالي",
        data: [3, 5, 4, 6],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "متوسط",
        data: [5, 7, 6, 8],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "منخفض",
        data: [8, 6, 9, 7],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#C9A227", font: { family: "Tajawal" } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#C9A227" },
        grid: { color: "rgba(201, 162, 39, 0.1)" },
      },
      y: {
        ticks: { color: "#C9A227" },
        grid: { color: "rgba(201, 162, 39, 0.1)" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: "#C9A227", font: { family: "Tajawal" } },
      },
    },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader title="لوحة التحكم" subtitle="نظرة عامة على جميع العمليات" />

      {/* الإحصائيات القديمة */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card delay={i * 0.05} className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-[#5C3A2A]">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* صف ثاني: التنبيهات + المخطط السريع */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* التنبيهات */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#C9A227]" />
            <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>تنبيهات مهمة</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border-r-4 ${
                alert.type === "danger" ? "border-red-500 bg-red-50" :
                alert.type === "warning" ? "border-yellow-500 bg-yellow-50" :
                "border-blue-500 bg-blue-50"
              }`}>
                <p className="font-medium text-[#2C1810] text-sm">{alert.title}</p>
                <p className="text-xs text-[#5C3A2A]">{alert.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* نشاط سريع */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#C9A227]" />
            <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>نشاط اليوم</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "مهام مكتملة", value: "8", color: "text-green-600" },
              { label: "قيد التنفيذ", value: "4", color: "text-yellow-600" },
              { label: "متأخرة", value: "1", color: "text-red-600" },
              { label: "مجدولة", value: "5", color: "text-blue-600" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/50 border border-[#C9A227]/10">
                <p className={`text-2xl font-bold ${item.color}`} style={{ fontFamily: "Tajawal, sans-serif" }}>{item.value}</p>
                <p className="text-xs text-[#5C3A2A] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ✅ الجديد: الرسوم البيانية */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
              البلاغات الشهرية
            </h3>
            <div className="h-64">
              <Bar data={monthlyData} options={chartOptions} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
              توزيع الفئات
            </h3>
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </Card>
        </div>
      )}

      {mounted && (
        <Card>
          <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
            اتجاه الأولويات
          </h3>
          <div className="h-64">
            <Line data={priorityTrend} options={chartOptions} />
          </div>
        </Card>
      )}
    </div>
  );
}