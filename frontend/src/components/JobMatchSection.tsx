"use client";

import { sanitize, sanitizeList } from "@/lib/sanitize";
import { Check } from "@phosphor-icons/react";
import { WarningCircle } from "@phosphor-icons/react";

interface JobMatchSectionProps {
  justification: string;
  strengths: string[];
  gaps_identified: string[];
}

export function JobMatchSection({ justification, strengths, gaps_identified }: JobMatchSectionProps) {
  const safeJustification = sanitize(justification);
  const safeStrengths = sanitizeList(strengths);
  const safeGaps = sanitizeList(gaps_identified);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-on-surface-variant">
          Justificativa do Fit
        </span>
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium font-sans">
          {safeJustification}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-primary">
            Pontos Fortes
          </span>
          <ul className="space-y-1.5">
            {safeStrengths.map((ponto, idx) => (
              <li key={idx} className="text-xs text-on-background flex items-start gap-2 leading-relaxed font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-1 flex-shrink-0" />
                <span>{ponto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] font-label-sm uppercase font-bold tracking-wider text-orange-400">
            Lacunas Identificadas
          </span>
          <ul className="space-y-1.5">
            {safeGaps.map((lacuna, idx) => (
              <li key={idx} className="text-xs text-on-background flex items-start gap-2 leading-relaxed font-sans">
                <WarningCircle className="w-3.5 h-3.5 text-amber-500 mt-1 flex-shrink-0" />
                <span>{lacuna}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
