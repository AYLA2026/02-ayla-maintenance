"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)",
        border: "1px solid rgba(201, 162, 39, 0.2)",
        boxShadow: "0 4px 20px rgba(201, 162, 39, 0.1)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#5C3A2A] text-sm mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>
            {title}
          </p>
          <p className="text-3xl font-bold text-[#2C1810]">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)",
          }}
        >
          <Icon className="w-6 h-6 text-[#1A0F09]" />
        </div>
      </div>
    </motion.div>
  );
}