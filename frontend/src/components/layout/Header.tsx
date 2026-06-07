"use client";

import React from "react";
import { CaretDown, Bell } from "@phosphor-icons/react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-black/40 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display-lg text-sm font-bold tracking-[0.2em] text-zinc-100 uppercase">
            STRATUM
          </a>
          <span className="w-px h-4 bg-zinc-800"></span>
          <span className="font-label-sm text-[10px] text-zinc-500 uppercase tracking-[0.15em] ml-1 hidden sm:inline">
            Recruiter Intelligence
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors font-semibold cursor-pointer">
            <span>VB Snooker</span>
            <CaretDown className="w-3.5 h-3.5" />
          </button>
          <button className="relative p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
          </button>
          <div className="group flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-950/40 to-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-purple-300 hover:border-purple-500/40 transition-colors cursor-pointer">
            ST
          </div>
        </div>
      </div>
    </header>
  );
}
