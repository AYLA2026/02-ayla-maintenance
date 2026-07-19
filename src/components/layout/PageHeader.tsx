"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1
        className="text-3xl font-bold mb-2"
        style={{
          background: "linear-gradient(135deg, #2C1810 0%, #3D2417 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "Tajawal, sans-serif",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[#5C3A2A] text-sm">{subtitle}</p>
      )}
      <div
        className="h-1 w-24 mt-4 rounded-full"
        style={{
          background: "linear-gradient(90deg, #C9A227 0%, #E8D5A3 100%)",
        }}
      />
    </motion.div>
  );
}