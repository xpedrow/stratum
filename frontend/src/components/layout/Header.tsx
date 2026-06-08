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
      </div>
    </header>
  );
}
