"use client";

import React from "react";
import { motion } from "framer-motion";

interface GaugeProps {
  score: number;
}

export function Gauge({ score }: GaugeProps) {
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#23163a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#a855f7"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-2xl font-bold text-[#a855f7] font-mono drop-shadow-[0_0_8px_rgba(168,85,247,0.45)]"
        >
          {score}%
        </motion.span>
        <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold font-mono">Match</span>
      </div>
    </div>
  );
}
