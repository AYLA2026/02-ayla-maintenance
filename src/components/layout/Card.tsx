"use client";

import { motion } from "framer-motion";
import { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function Card({ children, className = "", delay = 0, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)",
        border: "1px solid rgba(201, 162, 39, 0.15)",
        boxShadow: "0 4px 20px rgba(201, 162, 39, 0.08)",
      }}
    >
      {children}
    </motion.div>
  );
}