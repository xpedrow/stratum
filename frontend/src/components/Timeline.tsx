"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineItem {
  company: string;
  role: string;
  period: string;
  main_activities: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 text-sm">Nenhum histórico profissional registrado.</p>;
  }

  return (
    <div className="relative ml-3 space-y-8 py-2">
      {items.length > 1 && (
        <div className="absolute left-[5px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-emerald-500/20" />
      )}
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative pl-8"
        >
          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#00FF9D] border-2 border-[#090B11] shadow-[0_0_8px_#00FF9D]" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
            <h4 className="text-base font-semibold text-white tracking-wide">{item.role}</h4>
            <span className="text-xs text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/20 px-2.5 py-0.5 rounded-full font-mono font-medium self-start md:self-auto">
              {item.period}
            </span>
          </div>
          <p className="text-sm text-gray-400 font-medium mt-0.5">{item.company}</p>
          {item.main_activities && item.main_activities.length > 0 && (
            <ul className="list-disc list-inside mt-3 text-xs text-gray-400 space-y-1.5 pl-1">
              {item.main_activities.map((activity, actIdx) => (
                <li key={actIdx} className="leading-relaxed">
                  {activity}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  );
}
