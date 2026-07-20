"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Package, ArrowDown, ArrowUp, AlertTriangle, Plus, Download, Upload } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function InventoryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = [
    { name: "فلاتر مكيفات", category: "تكييف", qty: 45, min: 10, unit: "قطعة" },
    { name: "لمبات LED", category: "كهرباء", qty: 8, min: 20, unit: "علبة" },
    { name: "منظفات عامة", category: "تنظيف", qty: 120, min: 30, unit: "لتر" },
    { name: "مواسير PVC", category: "سباكة", qty: 25, min: 15, unit: "متر" },
  ];

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "الصنف,التصنيف,الكمية,الحد الأدنى,الوحدة,الحالة\n" +
      items.map(i => `${i.name},${i.category},${i.qty},${i.min},${i.unit},${i.qty <= i.min ? "نفاد" : "متوفر"}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "المخزون_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`✅ تم اختيار الملف: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB\nسيتم تحديث المخزون...`);
    e.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input